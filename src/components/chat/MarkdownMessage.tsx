import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownMessageProps {
  content: string;
}

const normalizeMarkdown = (content: string) =>
  content
    .replace(/:\s+\*\s+/g, ":\n\n* ")
    .replace(/\s+\*\s+([A-Za-z][^:*]{1,60}:)/g, "\n* $1")
    .replace(/\s+(\d+\.)\s+/g, "\n$1 ");

export function MarkdownMessage({ content }: MarkdownMessageProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        ul: ({ children }) => (
          <ul className="my-2 list-disc space-y-1 pl-5 marker:text-[var(--teal)]">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="my-2 list-decimal space-y-1 pl-5 marker:text-[var(--saffron)]">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="pl-1">{children}</li>,
        strong: ({ children }) => (
          <strong className="font-semibold text-[var(--ivory)]">{children}</strong>
        ),
        code: ({ children }) => (
          <code className="border border-white/10 bg-black/20 px-1 py-0.5 text-[0.85em] text-[var(--saffron)]">
            {children}
          </code>
        ),
        table: ({ children }) => (
          <div className="my-2 overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-white/10 bg-white/[0.06] px-2 py-1 font-semibold text-[var(--ivory)]">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-white/10 px-2 py-1 text-white/72">{children}</td>
        ),
      }}
    >
      {normalizeMarkdown(content)}
    </ReactMarkdown>
  );
}
