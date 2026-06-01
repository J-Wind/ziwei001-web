import{j as t,M as U,r as q}from"./ui-DLbki8NR.js";import{a as u}from"./echarts-Bxz-31iD.js";import{u as L,a as G,b as J,c as K,d as Q,e as P,f as B,s as W,g as V,S as X,B as Z,F as ee}from"./index-D355FiZf.js";import"./charts-Dxni0A0R.js";import"./utils-CyS9ObzW.js";const v=new Date().getFullYear(),te=Array.from({length:10},(e,a)=>({value:v-5+a,label:`${v-5+a}年`})),O=`# Role
你是一位精通流年推算的紫微斗数专家。根据提供的命盘信息进行解读。在分析流年时，你严格遵循"本命为体，大限为用，流年为应"的原则，运用"限流叠宫"和"流年四化"技法，精准捕捉该年份的吉凶趋势。

# Analysis Logic
1. **叠宫分析**：推演流年命宫叠入本命/大限何宫，以此判断今年的核心际遇（例如：流年命宫叠本命官禄，主事业变动）。
2. **四化引动**：重点分析流年天干引发的四化（禄权科忌）落入何宫，指出得失所在。
3. **时间应期**：结合月令，指出吉凶可能发生的具体时间段。

# Output Style Guidelines
- **使用Markdown格式**来突出重点内容：
  - **粗体** (\`**\`) 用于强调最重要的内容，如关键结论、重要提醒
  - *斜体* (\`*\`) 用于强调次要重点，如特殊说明、补充信息
  - \`代码\` (\`\`) 用于突出命理术语或特定名词
  - > 引用块 用于突出金句或重要建议
  - 列表项 用于分点说明，清晰易读

# Output Format
请严格按照以下结构输出分析报告：

## [年份] 岁次流年运程

### 壹· 年度总断
* **流年定调**：给这一年定一个关键词（如：破局之年、蛰伏之年、开拓之年）。
* **核心际遇**：基于"叠宫"理论，简述今年最核心的关注点是什么（是求财、升迁，还是由于家庭变故分心）。

### 贰· 名利机缘（事业/财运）
* **事业走势**：流年官禄宫分析。是否有升职、跳槽或创业的契机？工作压力源自何处？
* **求财建议**：流年财帛宫分析。适合进取投资还是保守储蓄？是否有意外破耗？

### 叁· 情感与家宅
* **流年姻缘**：流年夫妻宫分析。单身者是否有正缘？已婚者感情是否和睦？
* **家宅平安**：流年田宅与父母宫分析。是否涉及房产变动、装修或长辈健康问题。

### 肆· 月令趋势
* **吉运月份**：指出运势较顺遂的农历月份，适合开展重要事项。
* **注意月份**：指出压力较大或易出问题的农历月份，提示需谨慎行事。

### 伍· 锦囊寄语
* **行事准则**：给出一句针对今年的具体行动建议（如：宜静不宜动，宜守不宜攻）。
* **关键提醒**：关于健康或安全的特别嘱咐。

---
*注：流年运势受多方因素影响，分析仅供参考，切勿执着。*`,se={h1:({children:e})=>t.jsx("h1",{className:"text-xl sm:text-2xl font-bold text-gold mt-5 mb-3 first:mt-0",children:e}),h2:({children:e})=>t.jsx("h2",{className:"text-lg sm:text-xl font-semibold text-gold/90 mt-4 mb-2",children:e}),h3:({children:e})=>t.jsx("h3",{className:"text-base sm:text-lg font-medium text-star-dark mt-3 mb-2",children:e}),h4:({children:e})=>t.jsx("h4",{className:"text-sm sm:text-base font-medium text-star-dark/80 mt-3 mb-1.5",children:e}),p:({children:e})=>t.jsx("p",{className:"mb-2.5 sm:mb-3 leading-relaxed sm:leading-loose text-sm sm:text-base",children:e}),strong:({children:e})=>t.jsx("strong",{className:"text-gold font-semibold",children:e}),em:({children:e})=>t.jsx("em",{className:"text-star-light not-italic font-medium",children:e}),ul:({children:e})=>t.jsx("ul",{className:"list-none space-y-1 sm:space-y-1.5 mb-2.5 sm:mb-3 pl-4 xs:pl-5 sm:pl-6",children:e}),ol:({children:e})=>t.jsx("ol",{className:"list-decimal list-inside space-y-1 sm:space-y-1.5 mb-2.5 sm:mb-3 pl-1 sm:pl-2 text-sm sm:text-base",children:e}),li:({children:e})=>t.jsxs("li",{className:"relative pl-6 xs:pl-7 sm:pl-8 mb-2 leading-relaxed text-sm sm:text-base",children:[t.jsx("span",{className:"absolute left-0 top-[0.35em] text-star/60 text-xs select-none",children:"◆"}),e]}),blockquote:({children:e})=>t.jsx("blockquote",{className:"border-l-2 border-gold/40 pl-3 sm:pl-4 my-2.5 sm:my-3 italic text-text-secondary bg-gold/5 rounded-r-lg text-sm sm:text-base",children:e}),hr:()=>t.jsx("hr",{className:"my-4 sm:my-6 border-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"}),code:({children:e,className:a})=>a?t.jsx("code",{className:`${a} px-1.5 sm:px-2 py-0.5 rounded bg-white/10 text-star-light text-xs sm:text-sm`,children:e}):t.jsx("code",{className:"px-1 sm:px-1.5 py-0.5 rounded bg-gold/10 text-gold text-xs sm:text-sm",children:e}),a:({children:e,href:a})=>t.jsx("a",{href:a,className:"text-star-light hover:text-gold underline transition-colors",target:"_blank",rel:"noopener noreferrer",children:e}),table:({children:e})=>t.jsx("div",{className:"overflow-x-auto -mx-2 sm:mx-0 my-3 sm:my-4",children:t.jsx("table",{className:"w-full min-w-[280px] border-collapse text-sm",children:e})}),thead:({children:e})=>t.jsx("thead",{className:"border-b border-gold/20",children:e}),tbody:({children:e})=>t.jsx("tbody",{children:e}),tr:({children:e})=>t.jsx("tr",{className:"border-b border-white/5 last:border-0",children:e}),th:({children:e})=>t.jsx("th",{className:"text-left py-2 px-2 sm:px-3 text-gold/80 font-semibold text-xs sm:text-sm whitespace-nowrap",children:e}),td:({children:e})=>t.jsx("td",{className:"py-2 px-2 sm:px-3 text-text-secondary text-xs sm:text-sm leading-relaxed",children:e})};function T(e,a,b){const s=[],l=a?.yearly,m=a?.decadal;if(!l||!l.heavenlyStem||!Array.isArray(l.mutagen))return s.push("【流年盘信息】"),s.push(""),s.push(`- 流年：${b}年`),s.push("- 流年四化：待计算"),s.join(`
`);s.push("【流年盘信息】"),s.push(""),s.push("## 流年基础"),s.push(`- 流年：${b}年（${l.heavenlyStem}${l.earthlyBranch}年）`),s.push(`- 流年四化：${Array.isArray(l.mutagen)?l.mutagen.join("、"):"无"}`),s.push(`- 流年命宫位置：${l.palaceNames&&l.palaceNames[0]?l.palaceNames[0]:"未知"}`),s.push(""),s.push("## 当前大限"),m&&m.heavenlyStem?(s.push(`- 大限天干：${m.heavenlyStem}`),s.push(`- 大限四化：${Array.isArray(m.mutagen)?m.mutagen.join("、"):"无"}`),s.push(`- 大限命宫位置：${m.palaceNames&&m.palaceNames[0]?m.palaceNames[0]:"未知"}`)):s.push("- 大限信息：待计算"),s.push(""),s.push("## 流年重点宫位星曜");const N=["命宫","财帛宫","官禄宫","夫妻宫","疾厄宫","迁移宫"];for(const g of N){const f=e.palaces.find(i=>String(i.name)===g);if(!f)continue;const S=f.majorStars.map(i=>{let h=String(i.name);return i.brightness&&(h+=`(${i.brightness})`),i.mutagen&&(h+=`[${i.mutagen}]`),h}).join("、")||"无主星",p=f.minorStars.map(i=>{let h=String(i.name);return i.mutagen&&(h+=`[${i.mutagen}]`),h}).join("、");s.push(`### ${g}`),s.push(`- 主星：${S}`),p&&s.push(`- 辅星：${p}`),s.push("")}return s.join(`
`)}function ie(){const{chart:e,birthInfo:a}=L(),{provider:b,enableThinking:s,enableWebSearch:l}=G(),{getCost:m,load:N}=J(),{yearlyFortune:g,setYearlyFortune:f,fortuneChatHistory:S,setFortuneChatHistory:p}=K(),{requireAuth:i,user:h}=Q(),[r,z]=u.useState(v),[y,C]=u.useState(g[v]||""),[w,_]=u.useState(!1),[Y,k]=u.useState(null);u.useEffect(()=>{N()},[N]);const E=S[r]||[],F=u.useMemo(()=>({provider:b,enableThinking:s,enableWebSearch:l,operation:"ai_fortune"}),[b,s,l]),H=u.useCallback(o=>{z(o),C(g[o]||"")},[g]);u.useEffect(()=>{if(y&&E.length===0&&e&&a)try{const o=e.horoscope(new Date(`${r}-6-15`));if(!o||typeof o!="object"){console.warn("流年数据无效，使用基础信息");return}const j=o.yearly;if(!j||typeof j!="object"){console.warn("流年 yearly 数据无效，使用基础信息");return}const n=P(e,a.year),d=B(n),x=T(e,o,r),A=`请分析以下命盘的 ${r} 年运势：

## 基本信息
- 出生：${a.year}年${a.month}月${a.day}日
- 性别：${a.gender==="male"?"男":"女"}
- 五行局：${e.fiveElementsClass}
- 分析年份：${r}年

${d}

${x}

请结合本命盘和流年盘信息，给出详细的 ${r} 年运势分析。`;p(r,[{role:"user",content:A},{role:"assistant",content:y}])}catch(o){console.error("初始化对话历史失败:",o)}},[y,E,r,e,a,p]);const I=u.useCallback(async()=>{if(!e||!a)return;const o=m("ai_fortune"),j=h?.points??0;if(j<o){k(`当前积分不足（需要 ${o} 积分，当前 ${j} 积分），请充值后再试`);return}_(!0),k(null),C("");try{let n;try{const c=new Date(r,5,15);if(console.log(`[YearlyFortune] 计算流年数据，年份: ${r}, 日期: ${c.toISOString()}`),n=e.horoscope(c),!n)throw new Error("horoscope 返回 null");(!n.yearly||!n.decadal)&&console.warn(`[YearlyFortune] 流年数据不完整，yearly: ${!!n.yearly}, decadal: ${!!n.decadal}`),console.log("[YearlyFortune] 流年数据计算成功",{yearly:n.yearly?{heavenlyStem:n.yearly.heavenlyStem,earthlyBranch:n.yearly.earthlyBranch}:null,decadal:n.decadal?{heavenlyStem:n.decadal.heavenlyStem,earthlyBranch:n.decadal.earthlyBranch}:null})}catch(c){throw console.error("[YearlyFortune] 计算流年数据失败:",c),console.error("[YearlyFortune] 错误详情:",{year:r,errorMessage:c instanceof Error?c.message:String(c),errorStack:c instanceof Error?c.stack:void 0}),new Error(`流年数据计算失败（${r}年），可能是该年份超出支持范围，请尝试其他年份`)}if(!n||typeof n!="object")throw new Error("流年数据计算失败，请重试");const d=n.yearly;if(!d||typeof d!="object")throw new Error(`流年四化数据获取失败（${r}年），请尝试其他年份`);const x=P(e,a.year),A=B(x),R=T(e,n,r),M=`请分析以下命盘的 ${r} 年运势：

## 基本信息
- 出生：${a.year}年${a.month}月${a.day}日
- 性别：${a.gender==="male"?"男":"女"}
- 五行局：${e.fiveElementsClass}
- 分析年份：${r}年

${A}

${R}

请结合本命盘和流年盘信息，给出详细的 ${r} 年运势分析。`,D=[{role:"system",content:O},{role:"user",content:M}];let $="";for await(const c of W(F,D))$+=c,C($);f(r,$),p(r,[{role:"user",content:M},{role:"assistant",content:$}]);try{await fetch(`${V.apiBaseUrl}/api/user/history`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("ziwei-token")}`},body:JSON.stringify({type:"fortune",title:`${r}年运势`,content:$,birth_info:a})})}catch{}}catch(n){console.error("运势分析错误:",n);let d="分析失败，请重试";if(n instanceof Error){const x=n.message.toLowerCase();x.includes("401")||x.includes("unauthorized")?d="请先登录后再使用此功能":x.includes("402")||x.includes("积分不足")?d="积分不足，请充值后继续使用":x.includes("api key")||x.includes("not configured")?d="AI 服务暂时不可用":d=n.message}k(d)}finally{_(!1)}},[e,a,r,F,f,p]);return e?t.jsxs("div",{className:"animate-fade-in space-y-8 max-w-6xl mx-auto",children:[t.jsxs("div",{className:`
          relative p-6 lg:p-8
          bg-night/70 backdrop-blur-md
          border border-white/[0.1] rounded-2xl
          shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        `,children:[t.jsx("div",{className:`
            absolute top-0 left-1/2 -translate-x-1/2
            w-1/3 h-px
            bg-gradient-to-r from-transparent via-gold/50 to-transparent
          `}),t.jsxs("div",{className:"flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",children:[t.jsx("h2",{className:`
              text-xl lg:text-2xl font-semibold
              bg-gradient-to-r from-gold via-gold-light to-gold
              bg-clip-text text-transparent
            `,style:{fontFamily:"var(--font-serif)"},children:"年度运势"}),t.jsxs("div",{className:"flex items-center gap-4",children:[t.jsx(X,{options:te,value:r,onChange:o=>H(Number(o.target.value))}),t.jsx(Z,{onClick:()=>i(I),disabled:w,size:"sm",variant:"gold",children:w?t.jsxs("span",{className:"flex items-center gap-2",children:[t.jsx("span",{className:"w-3 h-3 border-2 border-night border-t-transparent rounded-full animate-spin"}),"分析中"]}):"查看运势"})]})]}),Y&&t.jsx("div",{className:"mt-4 p-3 rounded-lg bg-misfortune/10 text-misfortune text-sm border border-misfortune/20",children:Y})]}),t.jsxs("div",{className:`
          relative p-6 lg:p-8
          bg-night/70 backdrop-blur-md
          border border-white/[0.1] rounded-2xl
          shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        `,children:[t.jsx("div",{className:`
            absolute top-0 left-1/2 -translate-x-1/2
            w-1/3 h-px
            bg-gradient-to-r from-transparent via-star/50 to-transparent
          `}),!y&&!w&&t.jsxs("div",{className:"text-text-muted text-sm py-8 text-center",children:[t.jsx("div",{className:"text-3xl mb-3 opacity-30",children:"◎"}),"选择年份并点击「查看运势」开始分析"]}),w&&!y&&t.jsxs("div",{className:"flex items-center justify-center gap-3 text-text-muted py-12",children:[t.jsx("div",{className:"w-5 h-5 border-2 border-star border-t-transparent rounded-full animate-spin"}),t.jsxs("span",{children:["正在分析 ",r," 年运势..."]})]}),y&&t.jsxs(t.Fragment,{children:[t.jsx("div",{className:`
                prose prose-invert max-w-none
                text-text-secondary text-lg lg:text-xl leading-loose
              `,style:{fontFamily:"var(--font-brush)"},children:t.jsx(U,{remarkPlugins:[q],components:se,children:y})}),t.jsx(ee,{systemPrompt:O,chatHistory:E,onChatHistoryChange:o=>p(r,o),llmConfig:F,placeholder:`基于以上${r}年运势解读，有什么问题想问吗？`})]})]})]}):null}export{O as FORTUNE_SYSTEM_PROMPT,ie as YearlyFortune};
