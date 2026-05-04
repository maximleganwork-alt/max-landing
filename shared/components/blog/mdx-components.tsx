import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { InlineCTA } from "./InlineCTA";
import { EndCTA } from "./EndCTA";
import { Callout } from "./Callout";
import { Faq, FaqItem } from "./Faq";
import { slugifyHeading } from "../../lib/blog-utils";

/**
 * Карта компонентов, которыми next-mdx-remote заменяет HTML-теги
 * и кастомные JSX-элементы в .mdx файлах.
 *
 * Стилизация проз — через тонкие Tailwind-классы, без `@tailwindcss/typography`,
 * чтобы не тащить лишний плагин. Заголовки получают `scroll-mt-*` для
 * корректного скролла по якорям.
 *
 * Каждому H2/H3/H4 автоматически проставляется `id` через `slugifyHeading`,
 * чтобы оглавление, ссылки `#section` из соцсетей и AI-ассистенты могли
 * прыгать к нужному параграфу. Транслит кириллицы — стабильный, не зависит
 * от UTF-кодирования URL.
 */
function nodeToText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join("");
  if (typeof node === "object" && "props" in node) {
    return nodeToText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

function headingId(props: ComponentProps<"h2">): string {
  if (typeof props.id === "string" && props.id) return props.id;
  return slugifyHeading(nodeToText(props.children));
}

function H2(props: ComponentProps<"h2">) {
  const id = headingId(props);
  return (
    <h2
      {...props}
      id={id}
      className="mt-12 mb-4 scroll-mt-[calc(var(--header-height)+24px)] text-h2 font-bold text-fg leading-tight"
    />
  );
}

function H3(props: ComponentProps<"h3">) {
  const id = headingId(props);
  return (
    <h3
      {...props}
      id={id}
      className="mt-8 mb-3 scroll-mt-[calc(var(--header-height)+24px)] text-h3 font-semibold text-fg leading-snug"
    />
  );
}

function H4(props: ComponentProps<"h4">) {
  const id = headingId(props);
  return (
    <h4
      {...props}
      id={id}
      className="mt-6 mb-2 text-body-lg font-semibold text-fg"
    />
  );
}

function Paragraph(props: ComponentProps<"p">) {
  return <p {...props} className="my-4 text-body text-fg-muted leading-relaxed" />;
}

function UList(props: ComponentProps<"ul">) {
  return <ul {...props} className="my-5 ml-6 list-disc space-y-2 text-body text-fg-muted leading-relaxed marker:text-fg-subtle" />;
}

function OList(props: ComponentProps<"ol">) {
  return <ol {...props} className="my-5 ml-6 list-decimal space-y-2 text-body text-fg-muted leading-relaxed marker:text-fg-subtle" />;
}

function ListItem(props: ComponentProps<"li">) {
  return <li {...props} className="leading-relaxed" />;
}

function Anchor({ href = "#", children, ...rest }: ComponentProps<"a">) {
  const isExternal = /^https?:\/\//.test(href);
  if (isExternal) {
    return (
      <a
        {...rest}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium [color:var(--brand-grad-from)] underline underline-offset-4 hover:no-underline"
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      href={href}
      prefetch
      className="font-medium [color:var(--brand-grad-from)] underline underline-offset-4 hover:no-underline"
    >
      {children}
    </Link>
  );
}

function Blockquote(props: ComponentProps<"blockquote">) {
  return (
    <blockquote
      {...props}
      className="my-6 border-l-4 pl-4 italic text-fg-muted"
      style={{ borderLeftColor: "var(--border-strong)" }}
    />
  );
}

function InlineCode(props: ComponentProps<"code">) {
  return (
    <code
      {...props}
      className="rounded-md bg-bg-subtle px-1.5 py-0.5 text-[0.92em] font-mono text-fg"
    />
  );
}

function Pre(props: ComponentProps<"pre">) {
  return (
    <pre
      {...props}
      className="my-6 overflow-x-auto rounded-[var(--radius)] border border-border bg-bg-subtle p-4 text-body-sm leading-relaxed"
    />
  );
}

function Strong(props: ComponentProps<"strong">) {
  return <strong {...props} className="font-semibold text-fg" />;
}

function Hr(props: ComponentProps<"hr">) {
  return <hr {...props} className="my-10 border-border" />;
}

function Table(props: ComponentProps<"table">) {
  return (
    <div className="my-6 overflow-x-auto">
      <table {...props} className="w-full border-collapse text-body-sm" />
    </div>
  );
}

function Th(props: ComponentProps<"th">) {
  return (
    <th
      {...props}
      className="border-b border-border px-3 py-2 text-left font-semibold text-fg"
    />
  );
}

function Td(props: ComponentProps<"td">) {
  return (
    <td
      {...props}
      className="border-b border-border px-3 py-2 text-fg-muted"
    />
  );
}

export const mdxComponents = {
  h2: H2,
  h3: H3,
  h4: H4,
  p: Paragraph,
  ul: UList,
  ol: OList,
  li: ListItem,
  a: Anchor,
  blockquote: Blockquote,
  code: InlineCode,
  pre: Pre,
  strong: Strong,
  hr: Hr,
  table: Table,
  th: Th,
  td: Td,
  InlineCTA,
  EndCTA,
  Callout,
  Faq,
  FaqItem,
};
