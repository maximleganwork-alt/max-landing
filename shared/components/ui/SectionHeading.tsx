import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
  titleId?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  className,
  titleId,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center mx-auto max-w-3xl" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? (
        <span className="inline-flex items-center rounded-full border border-border bg-bg-card px-3 py-1 text-caption font-medium tracking-wide uppercase text-fg-muted">
          {eyebrow}
        </span>
      ) : null}
      <h2 id={titleId} className="text-h1 font-bold text-fg text-balance">
        {title}
      </h2>
      {lead ? (
        <p className="text-body sm:text-body-lg text-fg-muted text-pretty">{lead}</p>
      ) : null}
    </div>
  );
}
