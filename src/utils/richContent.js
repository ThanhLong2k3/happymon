const allowedTags = new Set([
  "p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li",
  "h2", "h3", "h4", "blockquote", "a", "img",
]);
const discardedTags = new Set(["script", "style", "iframe", "object", "embed", "svg", "math"]);

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function safeUrl(value, kind) {
  const url = String(value || "").trim();
  if (/^(https?:\/\/|\/|\.\/|\.\.\/|#)/i.test(url)) return url;
  if (kind === "href" && /^(mailto:|tel:)/i.test(url)) return url;
  return "";
}

export function sanitizeRichHtml(value = "") {
  const html = String(value || "");
  if (typeof DOMParser === "undefined") return escapeHtml(html);

  const document = new DOMParser().parseFromString(html, "text/html");
  function clean(node) {
    if (node.nodeType === Node.TEXT_NODE) return escapeHtml(node.nodeValue || "");
    if (node.nodeType !== Node.ELEMENT_NODE) return "";

    const tag = node.tagName.toLowerCase();
    if (discardedTags.has(tag)) return "";
    const children = Array.from(node.childNodes, clean).join("");
    if (!allowedTags.has(tag)) return children;

    if (tag === "img") {
      const src = safeUrl(node.getAttribute("src"), "src");
      if (!src) return "";
      const alt = escapeHtml(node.getAttribute("alt") || "");
      return `<img src="${escapeHtml(src)}" alt="${alt}">`;
    }
    if (tag === "a") {
      const href = safeUrl(node.getAttribute("href"), "href");
      return href
        ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${children}</a>`
        : children;
    }
    if (tag === "br") return "<br>";
    return `<${tag}>${children}</${tag}>`;
  }

  return Array.from(document.body.childNodes, clean).join("");
}

export function toRichHtml(value = "") {
  const content = String(value || "");
  if (!content) return "";
  if (/<\/?[a-z][\s\S]*>/i.test(content)) return sanitizeRichHtml(content);
  return content
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br>")}</p>`)
    .join("");
}

export function richHtmlToText(value = "") {
  if (typeof DOMParser === "undefined") return String(value || "").replace(/<[^>]*>/g, " ");
  const document = new DOMParser().parseFromString(sanitizeRichHtml(value), "text/html");
  return document.body.textContent?.replace(/\s+/g, " ").trim() || "";
}
