#!/usr/bin/env python3
"""Extract only published-content featured images from the Plesk user-data archive."""

import argparse
import json
import shutil
import subprocess
import tempfile
from pathlib import Path, PurePosixPath


ARCHIVE_PREFIX = "httpdocs/wp-content/uploads/"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--archive", required=True, type=Path)
    parser.add_argument("--content", required=True, type=Path)
    parser.add_argument("--destination", required=True, type=Path)
    args = parser.parse_args()

    content = json.loads(args.content.read_text(encoding="utf-8"))
    media_paths = set()
    for item in content:
        image = item.get("featuredImage")
        if not image:
            continue
        if not image.startswith("/media/"):
            raise ValueError(f"Unexpected image URL in content export: {image}")
        relative = PurePosixPath(image.removeprefix("/media/"))
        if (
            relative.is_absolute()
            or not relative.parts
            or any(part in {"", ".", ".."} for part in relative.parts)
        ):
            raise ValueError("Unsafe featured image path in content export")
        media_paths.add(relative.as_posix())

    if not media_paths:
        print("No featured images to extract.")
        return

    archive_members = [ARCHIVE_PREFIX + name for name in sorted(media_paths)]
    args.destination.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory(prefix="happymon-media-") as temporary:
        temporary_path = Path(temporary)
        member_list = temporary_path / "members.txt"
        member_list.write_text("\n".join(archive_members) + "\n", encoding="utf-8")
        result = subprocess.run(
            [
                "tar",
                "-xf",
                str(args.archive.resolve()),
                "-C",
                str(temporary_path),
                "-T",
                str(member_list),
            ],
            capture_output=True,
        )

        if result.returncode and not any(
            temporary_path.joinpath(*PurePosixPath(name).parts).is_file()
            for name in archive_members
        ):
            raise RuntimeError("The archive did not contain any requested featured images.")

        missing_paths = set()
        for relative_name, archive_name in zip(sorted(media_paths), archive_members):
            source = temporary_path.joinpath(*PurePosixPath(archive_name).parts)
            if not source.exists():
                missing_paths.add(relative_name)
                continue
            resolved_source = source.resolve(strict=True)
            resolved_source.relative_to(temporary_path.resolve())
            if source.is_symlink() or not source.is_file():
                raise ValueError(f"Featured image is not a regular file: {archive_name}")

            destination = args.destination.joinpath(*PurePosixPath(relative_name).parts)
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source, destination)

    for item in content:
        image = item.get("featuredImage")
        if image and image.removeprefix("/media/") in missing_paths:
            item["featuredImage"] = None
    if missing_paths:
        args.content.write_text(
            json.dumps(content, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

    extracted = len(media_paths) - len(missing_paths)
    print(f"Extracted {extracted} featured images.")
    if missing_paths:
        print(f"Skipped {len(missing_paths)} image path(s) absent from the archive.")


if __name__ == "__main__":
    main()
