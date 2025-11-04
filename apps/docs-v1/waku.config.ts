import mdx from "@mdx-js/rollup";
import rehypeShiki from "@shikijs/rehype";
import tailwindcss from "@tailwindcss/vite";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import remarkFlexibleMarkers from "remark-flexible-markers";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "waku/config";
import packageJson from "./package.json";

export default defineConfig({
  unstable_honoEnhancer: "./waku/hono-enhancer",
  middleware: [
    "waku/middleware/context",
    "waku/middleware/dev-server",
    "./waku/cloudflare-middleware",
    "waku/middleware/handler",
  ],
  vite: {
    resolve: {
      alias: packageJson.imports,
    },
    plugins: [
      mdx({
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: "frontmatter" }],
          remarkGfm,
          remarkFlexibleMarkers,
        ],
        rehypePlugins: [
          rehypeMdxCodeProps,
          [
            rehypeShiki,
            {
              themes: {
                light: "vitesse-light",
                dark: "vitesse-dark",
              },
            },
          ],
        ],
        providerImportSource: "#/utils/mdx-components",
      }),
      tailwindcss(),
    ],
  },
});
