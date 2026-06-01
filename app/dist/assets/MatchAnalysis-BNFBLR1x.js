import{j as e,M as Y,r as U}from"./ui-DLbki8NR.js";import{a as i}from"./echarts-Bxz-31iD.js";import{a as q,b as D,c as G,d as L,i as f,e as y,f as v,s as J,g as K,B as Q,F as W,S as j}from"./index-D355FiZf.js";import"./charts-Dxni0A0R.js";import"./utils-CyS9ObzW.js";const A=new Date().getFullYear(),V=Array.from({length:100},(t,s)=>({value:A-s,label:`${A-s}年`})),X=Array.from({length:12},(t,s)=>({value:s+1,label:`${s+1}月`})),Z=Array.from({length:31},(t,s)=>({value:s+1,label:`${s+1}日`})),ee=[{value:23,label:"子时 (23:00-00:59)"},{value:2,label:"丑时 (01:00-02:59)"},{value:4,label:"寅时 (03:00-04:59)"},{value:6,label:"卯时 (05:00-06:59)"},{value:8,label:"辰时 (07:00-08:59)"},{value:10,label:"巳时 (09:00-10:59)"},{value:12,label:"午时 (11:00-12:59)"},{value:14,label:"未时 (13:00-14:59)"},{value:16,label:"申时 (15:00-16:59)"},{value:18,label:"酉时 (17:00-18:59)"},{value:20,label:"戌时 (19:00-20:59)"},{value:22,label:"亥时 (21:00-22:59)"}],te=[{value:"male",label:"男"},{value:"female",label:"女"}],P=`# Role
你是一位擅长推演人际姻缘的紫微斗数专家。根据提供的命盘信息进行解读。在合盘分析中，你不仅观察表面的星情互补，更注重通过"飞星四化"来推演两人深层的缘分羁绊与利弊关系。

# Analysis Logic
1.  **星情对看**：分析两人命宫主星的性质是否匹配（如：强弱搭配、动静结合）。
2.  **四化互飞**：推演A的命宫四化飞入B的宫位，判断A对B是生助（化禄）还是刑克（化忌），反之亦然。
3.  **宫位参合**：观察双方夫妻宫的意象是否与对方吻合。

# Output Style Guidelines
- **使用Markdown格式**来突出重点内容：
  - **粗体** (\`**\`) 用于强调最重要的内容，如关键结论、重要提醒
  - *斜体* (\`*\`) 用于强调次要重点，如特殊说明、补充信息
  - \`代码\` (\`\`) 用于突出命理术语或特定名词
  - > 引用块 用于突出金句或重要建议
  - 列表项 用于分点说明，清晰易读

# Output Format
请严格按照以下结构输出分析报告：

## 双人命盘合参解析

### 壹· 缘分深浅
* **契合综述**：不使用分数，而是用定性描述（如：天作之合、欢喜冤家、因缘波折、相辅相成）。
* **关系本质**：从命理角度解析，两人相遇是互相成就，还是互相偿还宿债。

### 贰· 性情互动
* **相合之处**：两人性格中能够产生共鸣或互补的地方。
* **磨合难点**：两人性格中容易产生摩擦或误解的本质原因（如：一方重情，一方重利）。

### 叁· 命理羁绊（四化互飞）
* **助益分析**：分析两人在一起，谁能旺谁？（如：对方是否有助于你的事业或财运）。
* **隐忧所在**：命理上是否存在互相刑克或拖累的情况？

### 肆· 现实展望
* **未来挑战**：若长期相处或步入婚姻，最需要共同面对的现实考验是什么？
* **相处建议**：针对两人的命局特点，给出具体的相处之道与沟通建议。

---
*注：缘分天定，份在人为。合盘分析旨在增进了解，非绝对定论。*`,se={h1:({children:t})=>e.jsx("h1",{className:"text-xl md:text-2xl font-bold text-gold mt-5 md:mt-6 mb-2 md:mb-3 first:mt-0",children:t}),h2:({children:t})=>e.jsx("h2",{className:"text-lg md:text-xl font-semibold text-gold/90 mt-4 md:mt-5 mb-1.5 md:mb-2",children:t}),h3:({children:t})=>e.jsx("h3",{className:"text-base md:text-lg font-medium text-star-dark mt-3 md:mt-4 mb-1.5 md:mb-2",children:t}),p:({children:t})=>e.jsx("p",{className:"mb-2.5 md:mb-3 leading-relaxed",children:t}),strong:({children:t})=>e.jsx("strong",{className:"text-gold font-semibold",children:t}),em:({children:t})=>e.jsx("em",{className:"text-star-light not-italic font-medium",children:t}),ul:({children:t})=>e.jsx("ul",{className:"list-none space-y-1.5 mb-3 pl-4 xs:pl-5 sm:pl-6",children:t}),ol:({children:t})=>e.jsx("ol",{className:"list-decimal list-inside space-y-1.5 mb-3 pl-2",children:t}),li:({children:t})=>e.jsxs("li",{className:"relative pl-6 xs:pl-7 sm:pl-8 mb-2",children:[e.jsx("span",{className:"absolute left-0 top-[0.35em] text-star/60 text-xs select-none",children:"◆"}),t]}),blockquote:({children:t})=>e.jsx("blockquote",{className:"border-l-2 border-gold/40 pl-4 my-3 italic text-text-secondary bg-gold/5 rounded-r-lg",children:t}),hr:()=>e.jsx("hr",{className:"my-6 border-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"}),code:({children:t,className:s})=>s?e.jsx("code",{className:`${s} px-2 py-0.5 rounded bg-white/10 text-star-light text-sm`,children:t}):e.jsx("code",{className:"px-1.5 py-0.5 rounded bg-gold/10 text-gold text-sm",children:t}),a:({children:t,href:s})=>e.jsx("a",{href:s,className:"text-star-light hover:text-gold underline transition-colors",target:"_blank",rel:"noopener noreferrer",children:t})};function M({label:t,value:s,onChange:h}){const m=(a,c)=>{h({...s,[a]:c})};return e.jsxs("div",{className:`
        relative p-3 md:p-5
        bg-night/70 backdrop-blur-md
        border border-white/[0.1] rounded-xl
        shadow-[0_4px_20px_rgba(0,0,0,0.4)]
      `,children:[e.jsx("h3",{className:"text-base md:text-lg font-medium mb-2.5 md:mb-4 text-gold",style:{fontFamily:"var(--font-serif)"},children:t}),e.jsxs("div",{className:"space-y-2.5 md:space-y-3",children:[e.jsxs("div",{className:"grid grid-cols-3 gap-1.5 md:gap-2",children:[e.jsx(j,{label:"年",options:V,value:s.year,onChange:a=>m("year",Number(a.target.value))}),e.jsx(j,{label:"月",options:X,value:s.month,onChange:a=>m("month",Number(a.target.value))}),e.jsx(j,{label:"日",options:Z,value:s.day,onChange:a=>m("day",Number(a.target.value))})]}),e.jsx(j,{label:"时辰",options:ee,value:s.hour,onChange:a=>m("hour",Number(a.target.value))}),e.jsx("div",{className:"flex gap-2",children:te.map(a=>e.jsxs("label",{className:`
                flex-1 py-1.5 md:py-2 px-2 md:px-3 rounded-lg text-center text-xs md:text-sm cursor-pointer transition-all
                ${s.gender===a.value?"bg-star text-white":"bg-white/5 border border-white/10 hover:bg-white/10"}
              `,children:[e.jsx("input",{type:"radio",value:a.value,checked:s.gender===a.value,onChange:()=>m("gender",a.value),className:"sr-only"}),a.label]},a.value))})]})]})}function de(){const{provider:t,enableThinking:s,enableWebSearch:h}=q(),{getCost:m}=D(),{matchChatHistory:a,setMatchChatHistory:c}=G(),{requireAuth:E,user:T}=L(),[l,F]=i.useState({year:1990,month:1,day:1,hour:12,gender:"male"}),[n,I]=i.useState({year:1992,month:6,day:15,hour:14,gender:"female"}),[x,S]=i.useState(""),[b,k]=i.useState(!1),[_,N]=i.useState(null),$=i.useMemo(()=>({provider:t,enableThinking:s,enableWebSearch:h,operation:"ai_match"}),[t,s,h]);i.useEffect(()=>{if(x&&a.length===0){const g=f(l),u=f(n),d=y(g,l.year),r=y(u,n.year),o=v(d),w=v(r),C=`请分析以下两人的命盘契合度：

## 第一人
- 出生：${l.year}年${l.month}月${l.day}日
- 性别：${l.gender==="male"?"男":"女"}
- 五行局：${g.fiveElementsClass}

${o}

## 第二人
- 出生：${n.year}年${n.month}月${n.day}日
- 性别：${n.gender==="male"?"男":"女"}
- 五行局：${u.fiveElementsClass}

${w}

请分析两人的契合度和相处建议。`;c([{role:"user",content:C},{role:"assistant",content:x}])}},[x,a,l,n,c]);const H=i.useCallback(async()=>{const g=m("ai_match"),u=T?.points??0;if(u<g){N(`当前积分不足（需要 ${g} 积分，当前 ${u} 积分），请充值后再试`);return}k(!0),N(null),S("");try{const d=f(l),r=f(n),o=y(d,l.year),w=y(r,n.year),C=v(o),R=v(w),O=`请分析以下两人的命盘契合度：

## 第一人
- 出生：${l.year}年${l.month}月${l.day}日
- 性别：${l.gender==="male"?"男":"女"}
- 五行局：${d.fiveElementsClass}

${C}

## 第二人
- 出生：${n.year}年${n.month}月${n.day}日
- 性别：${n.gender==="male"?"男":"女"}
- 五行局：${r.fiveElementsClass}

${R}

请分析两人的契合度和相处建议。`,B=[{role:"system",content:P},{role:"user",content:O}];let p="";for await(const z of J($,B))p+=z,S(p);c([{role:"user",content:O},{role:"assistant",content:p}]);try{await fetch(`${K.apiBaseUrl}/api/user/history`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("ziwei-token")}`},body:JSON.stringify({type:"match",title:`双人合盘 - ${l.gender==="male"?"男":"女"}${l.year}年 & ${n.gender==="male"?"男":"女"}${n.year}年`,content:p,birth_info:{person1:l,person2:n}})})}catch{}}catch(d){console.error("合盘分析错误:",d);let r="分析失败，请重试";if(d instanceof Error){const o=d.message.toLowerCase();o.includes("401")||o.includes("unauthorized")?r="请先登录后再使用此功能":o.includes("402")||o.includes("积分不足")?r="积分不足，请充值后继续使用":o.includes("api key")||o.includes("not configured")?r="AI 服务暂时不可用":r=d.message}N(r)}finally{k(!1)}},[l,n,$,c]);return e.jsxs("div",{className:"animate-fade-in space-y-4 md:space-y-8 max-w-6xl mx-auto",children:[e.jsxs("div",{className:`
          relative p-4 md:p-6 lg:p-8
          bg-night/70 backdrop-blur-md
          border border-white/[0.1] rounded-2xl
          shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        `,children:[e.jsx("div",{className:`
            absolute top-0 left-1/2 -translate-x-1/2
            w-1/3 h-px
            bg-gradient-to-r from-transparent via-gold/50 to-transparent
          `}),e.jsx("h2",{className:`
            text-lg md:text-xl lg:text-2xl font-semibold mb-3 md:mb-6
            bg-gradient-to-r from-gold via-gold-light to-gold
            bg-clip-text text-transparent
          `,style:{fontFamily:"var(--font-serif)"},children:"双人合盘"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6",children:[e.jsx(M,{label:"第一人",value:l,onChange:F}),e.jsx(M,{label:"第二人",value:n,onChange:I})]}),e.jsx("div",{className:"flex justify-center",children:e.jsx(Q,{onClick:()=>E(H),disabled:b,size:"md",variant:"gold",children:b?e.jsxs("span",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"w-4 h-4 border-2 border-night border-t-transparent rounded-full animate-spin"}),"分析中"]}):"开始分析合盘"})}),_&&e.jsx("div",{className:"mt-4 p-3 rounded-lg bg-misfortune/10 text-misfortune text-sm border border-misfortune/20",children:_})]}),e.jsxs("div",{className:`
          relative p-4 md:p-6 lg:p-8
          bg-night/70 backdrop-blur-md
          border border-white/[0.1] rounded-2xl
          shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        `,children:[e.jsx("div",{className:`
            absolute top-0 left-1/2 -translate-x-1/2
            w-1/3 h-px
            bg-gradient-to-r from-transparent via-star/50 to-transparent
          `}),!x&&!b&&e.jsxs("div",{className:"text-text-muted text-sm py-6 md:py-8 text-center",children:[e.jsx("div",{className:"text-3xl mb-3 opacity-30",children:"⚭"}),"输入双方信息并点击「开始合盘分析」"]}),b&&!x&&e.jsxs("div",{className:"flex items-center justify-center gap-3 text-text-muted py-8 md:py-12",children:[e.jsx("div",{className:"w-5 h-5 border-2 border-star border-t-transparent rounded-full animate-spin"}),e.jsx("span",{children:"正在分析两人契合度..."})]}),x&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:`
                prose prose-invert max-w-none
                text-text-secondary text-base md:text-lg lg:text-xl leading-relaxed md:leading-loose
              `,style:{fontFamily:"var(--font-brush)"},children:e.jsx(Y,{remarkPlugins:[U],components:se,children:x})}),e.jsx(W,{systemPrompt:P,chatHistory:a,onChatHistoryChange:c,llmConfig:$,placeholder:"基于以上合盘解读，有什么问题想问吗？"})]})]})]})}export{P as MATCH_SYSTEM_PROMPT,de as MatchAnalysis};
