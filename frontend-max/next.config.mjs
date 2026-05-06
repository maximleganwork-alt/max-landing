import path from "node:path";
import { fileURLToPath } from "node:url";
import { CSP_DIRECTIVES } from "../shared/csp.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Bundle the shared workspace into a self-contained server. Required for
  // `output: "standalone"` to copy shared code into the deploy artifact.
  transpilePackages: ["shared"],
  // Build a self-contained `.next/standalone/` directory that the Dockerfile
  // can copy as-is — no `node_modules/` shipped to the runtime image.
  output: "standalone",
  // Without this, Next would only trace inside frontend-max/ and miss the
  // symlinked `shared` workspace package — runtime would crash with
  // "Cannot find module 'shared/...'".
  outputFileTracingRoot: path.join(__dirname, ".."),
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // lucide-react is auto-optimized by Next 15+. framer-motion isn't on the
  // default list, so we hint it manually — Next rewrites barrel imports into
  // direct module imports for better tree-shaking.
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: CSP_DIRECTIVES },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
