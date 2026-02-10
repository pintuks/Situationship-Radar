const markdownToHtml = (markdown: string) =>
  markdown
    .replace(/^```(?:json)?\s*([\s\S]*?)\s*```$/gim, "<pre><code>$1</code></pre>")
    .replace(/^###\s+(.*)$/gim, "<h3>$1</h3>")
    .replace(/^##\s+(.*)$/gim, "<h2>$1</h2>")
    .replace(/^#\s+(.*)$/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    .replace(/\n/g, "<br />");

const sanitizeHtml = (html: string) =>
  html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/on\w+=(["']).*?\1/gi, "");

const extractTextFromHtml = (html: string) =>
  html
    .replace(/<br\s*\/?\>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();

export const parseJsonFromCompletion = <T>(completion: string): T => {
  const markdown = completion.trim();
  const html = markdownToHtml(markdown);
  const safeHtml = sanitizeHtml(html);
  const safeText = extractTextFromHtml(safeHtml);

  try {
    return JSON.parse(safeText) as T;
  } catch {
    const objectStart = safeText.indexOf("{");
    const objectEnd = safeText.lastIndexOf("}");

    if (objectStart === -1 || objectEnd === -1 || objectStart >= objectEnd) {
      throw new Error("Model response did not contain valid JSON");
    }

    const objectCandidate = safeText.slice(objectStart, objectEnd + 1);
    return JSON.parse(objectCandidate) as T;
  }
};
