import path from "node:path";
import {
  readBlogPosts,
  readBlogSummaries,
  findBlogPost as sharedFindBlogPost,
  findRelatedPosts,
} from "shared/lib/blog";

/**
 * Адаптер вокруг shared-функций — фиксирует абсолютный путь до
 * `frontend-max/content/blog`. Все хелперы вызываются только из RSC во
 * время SSG, поэтому `process.cwd()` здесь — корень фронтенда.
 */
const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export function getAllBlogPosts() {
  return readBlogPosts(BLOG_DIR);
}

export function getAllBlogSummaries() {
  return readBlogSummaries(BLOG_DIR);
}

export function findPostBySlug(slug: string) {
  return sharedFindBlogPost(BLOG_DIR, slug);
}

export { findRelatedPosts };
