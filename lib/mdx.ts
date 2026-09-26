import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export const mdxOptions = {
  blockJS: true,
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, {
        themes: { light: "github-light", dark: "github-dark" },
        defaultColor: false,
        keepBackground: false,
      }],
    ],
  },
} satisfies NonNullable<MDXRemoteProps["options"]>;
