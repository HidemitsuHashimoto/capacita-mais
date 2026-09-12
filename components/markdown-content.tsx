import ReactMarkdown from "react-markdown";

type MarkdownContentProps = {
  source: string;
};

export function MarkdownContent({
  source,
}: MarkdownContentProps): React.ReactElement {
  return (
    <div className="markdown-body">
      <ReactMarkdown>{source}</ReactMarkdown>
    </div>
  );
}
