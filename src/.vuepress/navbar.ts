import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "技术博文",
    prefix: "/blogs/articles",
    icon: "pen-to-square",
    children: [
      {text: "Spring", link: "spring/"},
      { text: "SpringMVC", link: "springmvc/" },
      { text: "数据库", link: "database/" },
      {text: "Debug", link: "debug/" },
    ],
  },
  { text: "代码片段", link: "/blogs/codes/",  icon: "code" },
  { text: "时间轴", icon: "list", link: "timeline" },
  { text: "作者", icon:"at",link: "/intro"},
  

]);
