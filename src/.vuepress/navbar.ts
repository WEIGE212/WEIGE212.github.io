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
      { text: "计算机网络", link: "network/" },
      {text: "Debug", link: "debug/" },
      { text: "IDE工具", link: "tools/" },
    ],
  },
  { text: "代码片段", link: "/blogs/codes/",  icon: "code" },
  { text: "时间轴", icon: "list", link: "timeline" },
  { text: "作者", icon:"at",link: "/intro"},
  

]);
