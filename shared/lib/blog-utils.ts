import type { BlogPostSummary } from "./content/blog";

/**
 * Чистые функции для работы со списком постов — без `node:fs`/`node:path`,
 * чтобы безопасно импортироваться в клиентских компонентах. Файловые
 * утилиты (чтение MDX) живут отдельно в `./blog.ts`.
 */

/** Дата в человеко-читаемом виде ru-RU: «1 ноября 2025». */
export function formatBlogDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Все уникальные теги из массива постов, отсортированы по алфавиту. */
export function collectTags(posts: BlogPostSummary[]): string[] {
  const set = new Set<string>();
  for (const p of posts) for (const t of p.tags) set.add(t);
  return [...set].sort((a, b) => a.localeCompare(b, "ru"));
}

/**
 * Самые популярные `limit` тегов по числу постов. Тай-брейк — по алфавиту.
 * Внутри возвращаемого подмножества порядок алфавитный, чтобы чип-лента
 * не выглядела «рейтингом», а оставалась ровной.
 */
export function collectTopTags(posts: BlogPostSummary[], limit: number): string[] {
  const counts = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.tags) {
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }
  const top = [...counts.entries()]
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0].localeCompare(b[0], "ru");
    })
    .slice(0, limit)
    .map(([t]) => t);
  return top.sort((a, b) => a.localeCompare(b, "ru"));
}

/**
 * Слугификация заголовков для якорей. Поддерживает кириллицу: транслит
 * в латиницу один-к-одному, чтобы линки `#section` оставались стабильными
 * между редактурой контента и не превращались в `%D1%82%D0%B5%D0%B3...`
 * в адресной строке. Регистронезависимая, схлопывает повторяющиеся «-».
 */
const TRANSLIT_MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh",
  щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

export function slugifyHeading(input: string): string {
  const lower = input.toLowerCase().trim();
  let out = "";
  for (const ch of lower) {
    if (TRANSLIT_MAP[ch] !== undefined) {
      out += TRANSLIT_MAP[ch];
    } else if (/[a-z0-9]/.test(ch)) {
      out += ch;
    } else {
      out += "-";
    }
  }
  return out.replace(/-+/g, "-").replace(/^-|-$/g, "") || "section";
}

export interface PostHeading {
  /** Уровень: 2 или 3 (H4 пропускаем — слишком мелко для оглавления). */
  depth: 2 | 3;
  /** Текст заголовка как написан в MDX. */
  text: string;
  /** Идентификатор-якорь, синхронизированный с mdx-components. */
  id: string;
}

/**
 * Достаём H2/H3 из тела MDX простой регуляркой по строкам. Без полноценного
 * парсера: посты у нас всегда чистый markdown без хитрых ATX-заголовков,
 * и подключать remark-parse только ради оглавления — оверкилл.
 */
export function extractPostHeadings(body: string): PostHeading[] {
  const headings: PostHeading[] = [];
  const lines = body.split(/\r?\n/);
  // Пропускаем заголовки внутри fenced-кодблоков (```), там ## — это shell-комментарий.
  let inCode = false;
  for (const line of lines) {
    if (/^```/.test(line)) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const depth = m[1].length === 2 ? 2 : 3;
    const text = m[2].replace(/\s*\{#[a-z0-9-]+\}\s*$/, ""); // на случай явного {#id}
    headings.push({ depth: depth as 2 | 3, text, id: slugifyHeading(text) });
  }
  return headings;
}

/**
 * Грубая оценка времени чтения: 180 слов в минуту для русского. Минимум — 1.
 * Цифра показывается читателю и используется в JSON-LD как `wordCount`.
 */
export function estimateReadingTime(body: string): { minutes: number; words: number } {
  const stripped = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[`*_~#>\[\]\(\)!]/g, " ");
  const words = stripped.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 180));
  return { minutes, words };
}

/**
 * Минимальная конвертация markdown → HTML для RSS `<content:encoded>`.
 * Намеренно простая: блочные H2/H3, параграфы, ul/ol, blockquote, hr, fenced
 * code, inline code/bold/italic/links. MDX-компоненты вырезаем целиком —
 * ботам они бесполезны и часто содержат CTA на лид-форму, что в RSS
 * выглядит как мусор.
 */
export function mdxToRssHtml(body: string, siteUrl: string): string {
  // 1) Срезаем известные MDX-блоки целиком (теги верхнего уровня).
  let src = body;
  for (const tag of ["EndCTA", "InlineCTA", "Callout", "Faq", "FaqItem"]) {
    const re = new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}>`, "g");
    src = src.replace(re, "");
    // Самозакрывающиеся варианты `<X ... />`.
    const reSelf = new RegExp(`<${tag}\\b[^>]*\\/>`, "g");
    src = src.replace(reSelf, "");
  }

  const escapeHtml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const inline = (s: string) => {
    // Inline code сначала — чтобы внутри него не сработали другие правила.
    s = s.replace(/`([^`]+?)`/g, (_, c) => `<code>${escapeHtml(c)}</code>`);
    s = s.replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^*])\*([^*]+?)\*/g, "$1<em>$2</em>");
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) => {
      const absolute = href.startsWith("/") ? `${siteUrl}${href}` : href;
      return `<a href="${escapeHtml(absolute)}">${text}</a>`;
    });
    return s;
  };

  const lines = src.split(/\r?\n/);
  const out: string[] = [];
  let inCode = false;
  let codeBuf: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let paraBuf: string[] = [];

  const flushPara = () => {
    if (paraBuf.length) {
      out.push(`<p>${inline(paraBuf.join(" ").trim())}</p>`);
      paraBuf = [];
    }
  };
  const closeList = () => {
    if (listType) {
      out.push(`</${listType}>`);
      listType = null;
    }
  };

  for (const raw of lines) {
    const line = raw;
    // Fenced code.
    if (/^```/.test(line)) {
      flushPara();
      closeList();
      if (inCode) {
        out.push(`<pre><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`);
        codeBuf = [];
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      continue;
    }
    // Пустая строка — закрываем абзац/список.
    if (/^\s*$/.test(line)) {
      flushPara();
      closeList();
      continue;
    }
    // Заголовки.
    const h = /^(#{2,4})\s+(.+?)\s*$/.exec(line);
    if (h) {
      flushPara();
      closeList();
      const depth = h[1].length;
      const text = h[2].replace(/\s*\{#[a-z0-9-]+\}\s*$/, "");
      const id = slugifyHeading(text);
      out.push(`<h${depth} id="${id}">${inline(text)}</h${depth}>`);
      continue;
    }
    // Hr.
    if (/^---+\s*$/.test(line)) {
      flushPara();
      closeList();
      out.push("<hr>");
      continue;
    }
    // Blockquote.
    const bq = /^>\s+(.*)$/.exec(line);
    if (bq) {
      flushPara();
      closeList();
      out.push(`<blockquote>${inline(bq[1])}</blockquote>`);
      continue;
    }
    // Списки.
    const ul = /^[-*+]\s+(.*)$/.exec(line);
    const ol = /^\d+\.\s+(.*)$/.exec(line);
    if (ul || ol) {
      flushPara();
      const want: "ul" | "ol" = ul ? "ul" : "ol";
      if (listType !== want) {
        closeList();
        out.push(`<${want}>`);
        listType = want;
      }
      out.push(`<li>${inline((ul ?? ol)![1])}</li>`);
      continue;
    }
    // Иначе — копим в абзац.
    closeList();
    paraBuf.push(line.trim());
  }
  flushPara();
  closeList();
  if (inCode) out.push(`<pre><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`);
  return out.join("\n");
}

export interface FaqEntryRaw {
  q: string;
  /** Plain-text ответа: markdown без форматирования, готов для FAQPage schema. */
  a: string;
}

/**
 * Достать пары Q/A из MDX-тела статьи: ищем `<FaqItem q="…">…</FaqItem>` и
 * берём атрибут `q` как вопрос, а контент — как ответ. Работает с мульти-
 * строчными ответами. Используется при сборке FAQPage JSON-LD: AI-поиск
 * (Yandex Neuro, Google AI Overviews) любит структурированные Q&A.
 */
export function extractFaqEntries(body: string): FaqEntryRaw[] {
  const out: FaqEntryRaw[] = [];
  // Поддерживаем `q="..."`, `q='...'` и `q={"..."}`.
  const re = /<FaqItem\s+q\s*=\s*(?:"([^"]+)"|'([^']+)'|\{["']([^"']+)["']\})\s*>([\s\S]*?)<\/FaqItem>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    const q = (m[1] ?? m[2] ?? m[3] ?? "").trim();
    const aRaw = (m[4] ?? "").trim();
    // Чистим markdown до plain text: вырезаем JSX-теги, форматирование,
    // ссылочные скобки и кодфенсы. Ответ должен быть осмысленным абзацем.
    const a = aRaw
      .replace(/<[^>]+>/g, "")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\s+/g, " ")
      .trim();
    if (q && a) out.push({ q, a });
  }
  return out;
}

/**
 * Найти 3 «похожие» статьи: считаем пересечение тегов с текущей,
 * сортируем по убыванию числа совпадений → по свежести даты.
 */
export function findRelatedPosts(
  posts: BlogPostSummary[],
  current: BlogPostSummary,
  limit = 3,
): BlogPostSummary[] {
  const tagSet = new Set(current.tags);
  return posts
    .filter((p) => p.slug !== current.slug)
    .map((p) => ({ post: p, score: p.tags.filter((t) => tagSet.has(t)).length }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.post.date < b.post.date ? 1 : -1;
    })
    .slice(0, limit)
    .map((x) => x.post);
}
