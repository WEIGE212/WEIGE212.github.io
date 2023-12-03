import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",
  port:8081,
  lang: "zh-CN",
  title: "WEIGE的知识库",
  description: "WEIGE的知识库",
  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
