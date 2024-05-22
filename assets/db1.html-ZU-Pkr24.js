import{_ as s}from"./plugin-vue_export-helper-x3n3nnut.js";import{o as n,c as e,e as a,a as l,f as i}from"./app-sJtE_rnN.js";const d={},c=l("p",null,"SQL语法中DQL语句的正确编写顺序和其执行的顺序。",-1),r=i(`<div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token keyword">SELECT</span>                   <span class="token number">4</span>
	字段列表
<span class="token keyword">FROM</span>                     <span class="token number">1</span>
	表名
<span class="token keyword">WHERE</span>                    <span class="token number">2</span>
	条件列表
<span class="token keyword">GROUP</span> <span class="token keyword">BY</span>                 <span class="token number">3</span>
	分组字段列表
<span class="token keyword">HAVING</span>                   
	分组后条件列表
<span class="token keyword">ORDER</span> <span class="token keyword">BY</span>                 <span class="token number">5</span>
	排序字段列表
<span class="token keyword">LIMIT</span>                    <span class="token number">6</span>
	分页参数
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>DDL语句的执行顺序即为: FROM—》WHERE—》GROUP BY—》SELECT—》ORDER BY—》LIMIT</p>`,2);function o(t,p){return n(),e("div",null,[c,a(" more "),r])}const u=s(d,[["render",o],["__file","db1.html.vue"]]);export{u as default};
