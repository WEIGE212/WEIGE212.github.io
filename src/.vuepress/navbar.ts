import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "技术博文",
    prefix: "/blogs/ITblogs/",
    icon: "code",
    children: [
      {
        text: "Java",
        prefix: "Java/",
        children: [
          { text: "Java基础", icon: "code", link: "README" },
        ],
      },

      {
        text: "后端框架",
        prefix: "BackEnd/Spring/",
        children: [{ text: "Spring", icon: "code", link: "README", },]

      },
      {
        text: "大数据框架",
        prefix: "BigData/",
        children: [
          { text: "Hadoop", icon: "code", link: "README", },
        ]

      },
      {
        text: "计算机基础",
        icon: "pen-to-square",
        prefix: "ComputerBase/",
        children: [
          { text: "数据库", icon: "computer", link: "" },
          { text: "计算机网络", icon: "computer", link: "" },
          { text: "操作系统", icon: "computer", link: "", },
        ],
      },
      {
        text: "Debug",
        icon: "pen-to-square",
        prefix: "Debug/",
        children:[
          { text: "Debug", icon: "check", link: "" },
        ]
        
      },
    ],
  },
 
  {
    text: "杂文",
    prefix: "/blogs/Liveblogs",
    icon: "pen-to-square",
    children: [
      {
        text: "随笔",
        icon: "pen-to-square",
        prefix: "",
        children: [
          { text: "记录生活", icon: "pen-to-square",link:""},
        ],
      },
    ]
  },
  { text: "时间轴", icon: "list", link: "timeline" },
  // "timeline",
  { text: "作者", icon:"at",link: "/intro"},
  

]);
