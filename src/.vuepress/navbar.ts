import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "技术博文",
    prefix: "/blogs/articles",
    icon: "pen-to-square",
    children: [
      { text: "Java", link: "java/" },
      { text: "Spring", link: "spring/"},
      { text: "设计模式", link: "designpattern/" },
      { text: "计算机基础", link: "computerbase/" },
      {text: "Debug", link: "debug/" },
      { text: "工具与杂文", link: "tools/" },
    ],
  },
  { text: "代码片段", link: "/blogs/codes/",  icon: "code" },
  { text: "时间轴", icon: "list", link: "timeline" },
  { text: "作者", icon:"at",link: "/intro"},
  

]);
