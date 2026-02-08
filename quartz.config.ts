//quartz.config.ts
import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "NKUstat-exam-note",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "quartz.jzhao.xyz",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "STIX Two Text",
        body: "STIX Two Text",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#fbfafb",        // 背景更接近纸白
          lightgray: "#e9e5ea",
          gray: "#bfb6c2",
          darkgray: "#4d4650",
          dark: "#231f24",

          // —— 南开紫主色系 ——
          secondary: "#701E5E",    // 主色：链接/按钮/强调
          tertiary: "#9A5A8E",     // 次强调：轻一点的紫（hover/次级标签）

          highlight: "transparent", // 选中/引用块底色（透明）
          textHighlight: "rgba(154, 90, 142, 0.28)", // 文本高亮（更明显一点）
        },
        darkMode: {
          light: "#141214",
          lightgray: "#2a252b",
          gray: "#6f6772",
          darkgray: "#e3dfe4",
          dark: "#f2eef3",

          // —— 南开紫主色系（暗色模式要更亮一点以保证对比） ——
          secondary: "#D6A7CE",    // 主色：更亮的南开紫
          tertiary: "#B678AA",

          highlight: "transparent",
          textHighlight: "rgba(182, 120, 170, 0.30)",
        },
      },

    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
