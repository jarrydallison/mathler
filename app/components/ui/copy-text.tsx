import { CheckCircle2, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

/**
 * Simple component that copies text to the clipboard and
 * let's the user know it was copied
 * @param text The text to copy
 * @returns Component that renders text to copy
 */
export const CopyText = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const [copied, setCopied] = useState("");

  // Simple timeout to let the user know the text has been selected
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined = undefined;
    if (copied) {
      timeoutId = setTimeout(() => {
        setCopied("");
      }, 3000); // Reset after 3 seconds
    }
    return () => clearTimeout(timeoutId);
  }, [copied]);

  return (
    <button
      className={twMerge(
        "flex items-center gap-1 text-sm text-blue-500 underline cursor-pointer",
        className
      )}
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(text);
      }}
    >
      {text}
      {text === copied ? (
        <CheckCircle2 className="size-4 text-green-500" />
      ) : (
        <Copy className="size-4" />
      )}
    </button>
  );
};
