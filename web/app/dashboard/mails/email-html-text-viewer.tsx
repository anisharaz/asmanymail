import DOMPurify from "dompurify";

export function EmailHtmlViewer({ html }: { html: string }) {
  const sanitized = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ["script", "iframe", "object", "embed", "form"],
    FORBID_ATTR: ["onload", "onclick", "onerror", "style"],
  });

  return (
    <iframe
      sandbox="allow-same-origin allow-popups"
      srcDoc={sanitized}
      className="w-full h-[600px] border-0"
    />
  );
}

export function EmailTextViewer({ text }: { text: string }) {
  return (
    <pre className="whitespace-pre-wrap break-words text-sm md:text-base leading-relaxed font-sans">
      {text}
    </pre>
  );
}
