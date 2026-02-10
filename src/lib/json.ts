interface JsonTools {
  markdownToHtml: (markdown: string) => string;
  sanitizeHtml: (html: string) => string;
  extractTextFromHtml: (html: string) => string;
}

const createFallbackTools = (): JsonTools => ({
  markdownToHtml: (markdown: string) =>
    markdown
      .replace(/^```(?:json)?\s*([\s\S]*?)\s*```$/gim, "<pre><code>$1</code></pre>")
      .replace(/^###\s+(.*)$/gim, "<h3>$1</h3>")
      .replace(/^##\s+(.*)$/gim, "<h2>$1</h2>")
      .replace(/^#\s+(.*)$/gim, "<h1>$1</h1>")
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      .replace(/\n/g, "<br />"),
  sanitizeHtml: (html: string) =>
    html
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/on\w+=(['"]).*?\1/gi, ""),
  extractTextFromHtml: (html: string) =>
    html
      .replace(/<br\s*\/?\>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .trim(),
});

const loadPackageTools = (): JsonTools | null => {
  try {
    const requireFn = new Function("return require")() as (moduleName: string) => unknown;
    const markedModule = requireFn("marked") as { marked: { parse: (input: string, options?: { async?: boolean }) => string } };
    const jsdomModule = requireFn("jsdom") as { JSDOM: new (html?: string) => { window: { document: { body: { textContent: string | null } } } };
    };
    const domPurifyModule = requireFn("dompurify") as { default?: (window: unknown) => { sanitize: (input: string, options?: { ALLOWED_TAGS?: string[]; ALLOWED_ATTR?: string[] }) => string } };

    const JSDOM = jsdomModule.JSDOM;
    const createDOMPurify = domPurifyModule.default;
    if (!markedModule?.marked || !JSDOM || !createDOMPurify) {
      return null;
    }

    const domWindow = new JSDOM("").window;
    const DOMPurify = createDOMPurify(domWindow);

    return {
      markdownToHtml: (markdown: string) => {
        const html = markedModule.marked.parse(markdown, { async: false });
        return typeof html === "string" ? html : String(html);
      },
      sanitizeHtml: (html: string) =>
        DOMPurify.sanitize(html, {
          ALLOWED_TAGS: ["pre", "code", "p", "br", "strong", "em", "h1", "h2", "h3"],
          ALLOWED_ATTR: [],
        }),
      extractTextFromHtml: (html: string) =>
        new JSDOM(`<body>${html}</body>`).window.document.body.textContent?.trim() ?? "",
    };
  } catch {
    return null;
  }
};

const jsonTools = loadPackageTools() ?? createFallbackTools();

export const parseJsonFromCompletion = <T>(completion: string): T => {
  const markdown = completion.trim();
  const html = jsonTools.markdownToHtml(markdown);
  const safeHtml = jsonTools.sanitizeHtml(html);
  const safeText = jsonTools.extractTextFromHtml(safeHtml);

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
