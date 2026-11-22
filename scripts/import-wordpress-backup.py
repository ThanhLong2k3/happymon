#!/usr/bin/env python3
"""Export published WordPress pages and posts without importing accounts or orders."""

import argparse
import html
import json
import re
from html.parser import HTMLParser
from pathlib import Path, PurePosixPath


PUBLIC_TYPES = {"page", "post", "event", "course", "team", "testimonial", "product"}
IMAGE_EXTENSIONS = {".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"}
BLOCK_TAGS = {
    "address", "article", "blockquote", "br", "dd", "div", "dl", "dt",
    "figcaption", "figure", "h1", "h2", "h3", "h4", "h5", "h6", "hr",
    "li", "ol", "p", "section", "table", "td", "th", "tr", "ul",
}


class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.skip_depth = 0

    def handle_starttag(self, tag, attrs):
        if tag in {"script", "style", "svg", "noscript"}:
            self.skip_depth += 1
        if self.skip_depth:
            return
        if tag in BLOCK_TAGS:
            self.parts.append("\n")
        if tag == "img":
            alt = dict(attrs).get("alt", "")
            if alt:
                self.parts.append(alt)

    def handle_endtag(self, tag):
        if tag in {"script", "style", "svg", "noscript"} and self.skip_depth:
            self.skip_depth -= 1
        if not self.skip_depth and tag in BLOCK_TAGS:
            self.parts.append("\n")

    def handle_data(self, data):
        if not self.skip_depth:
            self.parts.append(data)


def plain_text(markup):
    markup = re.sub(r"<!--.*?-->", " ", markup, flags=re.S)
    markup = re.sub(r"\[[^\]]{1,300}\]", " ", markup)
    parser = TextExtractor()
    parser.feed(markup)
    text = html.unescape("".join(parser.parts))
    lines = [re.sub(r"\s+", " ", line).strip() for line in text.splitlines()]
    return "\n\n".join(line for line in lines if line)


def table_columns(dump, table):
    pattern = (
        r"CREATE\s+TABLE\s+`"
        + re.escape(table)
        + r"`\s*\((.*?)\)\s*ENGINE"
    )
    match = re.search(pattern, dump, flags=re.S | re.I)
    if not match:
        raise ValueError(f"Required table is missing: {table}")
    return re.findall(r"^\s*`([^`]+)`\s+", match.group(1), flags=re.M)


def insert_values(dump, table):
    marker = f"INSERT INTO `{table}`"
    position = 0
    while True:
        start = dump.find(marker, position)
        if start < 0:
            return

        values_start = dump.find("VALUES", start)
        if values_start < 0:
            raise ValueError(f"Malformed INSERT statement for {table}")
        index = values_start + len("VALUES")
        while index < len(dump) and dump[index].isspace():
            index += 1

        begin = index
        quoted = False
        escaped = False
        while index < len(dump):
            char = dump[index]
            if quoted:
                if escaped:
                    escaped = False
                elif char == "\\":
                    escaped = True
                elif char == "'":
                    quoted = False
            elif char == "'":
                quoted = True
            elif char == ";":
                break
            index += 1

        if index >= len(dump):
            raise ValueError(f"Unterminated INSERT statement for {table}")
        yield dump[begin:index]
        position = index + 1


def parse_tuples(values):
    index = 0
    while index < len(values):
        if values[index].isspace() or values[index] == ",":
            index += 1
            continue
        if values[index] != "(":
            index += 1
            continue

        index += 1
        row = []
        field = []
        quoted = False
        escaped = False
        while index < len(values):
            char = values[index]
            if quoted:
                if escaped:
                    field.append(
                        {"0": "\0", "n": "\n", "r": "\r", "t": "\t",
                         "b": "\b", "Z": "\x1a"}.get(char, char)
                    )
                    escaped = False
                elif char == "\\":
                    escaped = True
                elif char == "'":
                    quoted = False
                else:
                    field.append(char)
            elif char == "'":
                quoted = True
            elif char == ",":
                row.append("".join(field).strip())
                field = []
            elif char == ")":
                row.append("".join(field).strip())
                index += 1
                break
            else:
                field.append(char)
            index += 1
        else:
            raise ValueError("Unterminated row in SQL dump")
        yield row


def read_table(dump, table):
    columns = table_columns(dump, table)
    rows = []
    for values in insert_values(dump, table):
        for row in parse_tuples(values):
            if len(row) != len(columns):
                raise ValueError(f"Unexpected column count in {table}")
            rows.append(row)
    return columns, rows


def safe_media_path(value):
    path = PurePosixPath(value)
    if (
        path.is_absolute()
        or not path.parts
        or any(part in {"", ".", ".."} for part in path.parts)
        or path.suffix.lower() not in IMAGE_EXTENSIONS
    ):
        return None
    return path.as_posix()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--sql", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()

    dump = args.sql.read_text(encoding="utf-8", errors="replace")
    post_tables = re.findall(r"CREATE\s+TABLE\s+`([^`]+)_posts`", dump, re.I)
    if len(post_tables) != 1:
        raise ValueError("Could not identify a unique WordPress post table")
    prefix = post_tables[0]

    post_columns, posts = read_table(dump, f"{prefix}_posts")
    meta_columns, metadata = read_table(dump, f"{prefix}_postmeta")
    post_index = {name: index for index, name in enumerate(post_columns)}
    meta_index = {name: index for index, name in enumerate(meta_columns)}

    featured_ids = {}
    media_paths = {}
    for row in metadata:
        post_id = row[meta_index["post_id"]]
        key = row[meta_index["meta_key"]]
        value = row[meta_index["meta_value"]]
        if key == "_thumbnail_id":
            featured_ids[post_id] = value
        elif key == "_wp_attached_file":
            media_paths[post_id] = value

    exported = []
    exported_media = set()
    for row in posts:
        if row[post_index["post_status"]] != "publish":
            continue
        kind = row[post_index["post_type"]]
        if kind not in PUBLIC_TYPES:
            continue

        body = plain_text(row[post_index["post_content"]])
        excerpt = plain_text(row[post_index["post_excerpt"]]) or body[:240]
        media_path = None
        image_id = featured_ids.get(row[post_index["ID"]])
        if image_id in media_paths:
            media_path = safe_media_path(media_paths[image_id])
            if media_path:
                exported_media.add(media_path)

        exported.append(
            {
                "id": int(row[post_index["ID"]]),
                "type": kind,
                "slug": row[post_index["post_name"]],
                "title": row[post_index["post_title"]],
                "date": row[post_index["post_date"]],
                "excerpt": excerpt,
                "body": body,
                "featuredImage": f"/media/{media_path}" if media_path else None,
            }
        )

    exported.sort(key=lambda item: (item["date"], item["id"]), reverse=True)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(exported, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(
        f"Exported {len(exported)} published items and "
        f"{len(exported_media)} referenced featured images."
    )
    print("Accounts, form entries, order records, and unpublished content were excluded.")
if __name__ == "__main__":
    main()

