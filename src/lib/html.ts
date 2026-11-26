const ALLOWED_TAGS = new Set(["a", "b", "br", "div", "em", "h1", "h2", "h3", "h4", "i", "li", "ol", "p", "span", "strong", "ul"]);

function stripUnsafe(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");
}

function cleanElement(element: Element) {
  [...element.querySelectorAll("*")].forEach((node) => {
    const tag = node.tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) {
      node.replaceWith(...node.childNodes);
      return;
    }
    [...node.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const unsafeLink = (name === "href" || name === "src") && /^\s*javascript:/i.test(attribute.value);
      if (name.startsWith("on") || name === "style" || unsafeLink) node.removeAttribute(attribute.name);
    });
    if (tag === "a") {
      node.setAttribute("rel", "noreferrer");
      node.setAttribute("target", "_blank");
    }
  });
}

export function sanitizeHtml(html: string): string {
  if (typeof DOMParser === "undefined") return stripUnsafe(html);
  const document = new DOMParser().parseFromString(html, "text/html");
  cleanElement(document.body);
  return document.body.innerHTML;
}

export function htmlToText(html: string): string {
  const decoded = sanitizeHtml(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|div|h\d|ul|ol)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');

  return decoded
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
