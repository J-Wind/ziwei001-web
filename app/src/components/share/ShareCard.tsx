/* ============================================================
   命格金句分享卡片
   紫微斗数命理风格 · 适合小红书分享
   ============================================================ */

import { useRef, useState, useCallback } from 'react'
import html2canvas from 'html2canvas'
import { useChartStore, useContentCacheStore } from '@/stores'
import { Button } from '@/components/ui'

/* ------------------------------------------------------------
   字体常量 (html2canvas 不支持 CSS 变量，需硬编码)
   ------------------------------------------------------------ */

const FONT_BRUSH = "'Ma Shan Zheng', 'STKaiti', 'KaiTi', cursive"
const FONT_SERIF = "'Noto Serif SC', 'Georgia', serif"

/* ------------------------------------------------------------
   天干地支转换
   ------------------------------------------------------------ */

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

function yearToGanZhi(year: number): string {
  const stemIndex = (year - 4) % 10
  const branchIndex = (year - 4) % 12
  return `${STEMS[stemIndex]}${BRANCHES[branchIndex]}`
}

/* ------------------------------------------------------------
   根据命盘自动生成个性化语录
   ------------------------------------------------------------ */

function generatePersonalizedQuote(chart: any, birthInfo: any): string {
  const stars = getLifePalaceStars(chart)
  const pattern = getPatternName(chart)
  const fiveElements = chart?.fiveElementsClass || ''
  const gender = birthInfo?.gender === 'male' ? '乾' : '坤'
  
  // 基于命宫主星的语录库
  const starQuotes: Record<string, string[]> = {
    '紫微': [
      '紫微坐命，帝王之象。贵气天成，自有非凡格局。',
      '命带紫微，星君临世。不怒自威，运筹帷幄定乾坤。',
    ],
    '天府': [
      '天府为财库之星，主富足安乐。一生衣食无忧，福泽深厚。',
      '府相朝垣，财官双美。稳扎稳打，终成大器。',
    ],
    '太阳': [
      '太阳照耀，光明磊落。正直刚毅，名扬四方。',
      '日丽中天，光辉普照。才华横溢，必有所成。',
    ],
    '太阴': [
      '太阴柔美，温润如玉。聪慧内敛，以柔克刚。',
      '月华如水，清辉遍洒。心思细腻，洞察秋毫。',
    ],
    '贪狼': [
      '贪狼桃花，魅力四射。多才多艺，机遇不断。',
      '欲望之星，志向远大。敢想敢做，开创先河。',
    ],
    '天机': [
      '天机善变，智慧过人。审时度势，化险为夷。',
      '机月同梁，善于谋划。深思熟虑，决胜千里。',
    ],
    '武曲': [
      '武曲刚毅，意志坚定。白手起家，创一番事业。',
      '财星高照，理财有方。勤俭持家，积沙成塔。',
    ],
    '天同': [
      '天同福星，一生顺遂。贵人相助，逢凶化吉。',
      '逍遥自在，知足常乐。淡泊明志，宁静致远。',
    ],
    '廉贞': [
      '廉贞烈性，刚正不阿。百折不挠，终成正果。',
      '次桃花星，魅力独特。感情丰富，情深义重。',
    ],
    '巨门': [
      '巨门暗曜，口才出众。能言善辩，化腐朽为神奇。',
      '是非分明，正义感强。直言不讳，令人敬佩。',
    ],
  }

  // 基于五行局的语录
  const elementQuotes: Record<string, string> = {
    '土五局': '厚重沉稳，脚踏实地。厚德载物，必有后福。',
    '土四局': '敦厚诚实，值得信赖。稳中求进，步步为营。',
    '土三局': '忠厚可靠，人缘极佳。广结善缘，助人为乐。',
    '土二局': '包容大度，心胸宽广。海纳百川，有容乃大。',
    '水二局': '聪慧灵活，适应力强。随遇而安，游刃有余。',
    '水三局': '智慧深邃，思想超前。独具慧眼，洞悉先机。',
    '木三局': '仁慈善良，生机勃勃。向上生长，欣欣向荣。',
    '木二局': '温和谦逊，与世无争。顺其自然，无为而治。',
    '金四局': '刚毅果断，行事利落。说一不二，一言九鼎。',
    '金三局': '重情重义，讲求原则。光明磊落，坦荡无私。',
    '金二局': '精明干练，效率至上。雷厉风行，卓有成效。',
    '火六局': '热情奔放，活力四射。积极进取，勇往直前。',
    '火五局': '开朗乐观，感染力强。阳光向上，温暖人心。',
  }

  // 获取命宫第一主星
  const lifePalace = chart?.palaces?.find((p: any) => p.name === '命宫')
  const firstStar = lifePalace?.majorStars?.[0]?.name?.replace('星', '') || ''

  // 选择语录（优先级：格局 > 主星 > 五行 > 默认）
  let quote = ''

  if (pattern) {
    quote = `${pattern}，${gender}命造。\n格局已成，运势可期。`
  } else if (starQuotes[firstStar]) {
    const quotes = starQuotes[firstStar]
    quote = quotes[Math.floor(Math.random() * quotes.length)]
  } else if (elementQuotes[fiveElements]) {
    quote = elementQuotes[fiveElements]
  } else {
    // 根据性别和年份生成通用语录
    const yearProps = ['坚韧不拔', '志向高远', '聪慧过人', '心地善良', '才华横溢']
    const prop = yearProps[birthInfo.year % yearProps.length]
    quote = `${prop}，${gender}命造。\n命由天定，事在人为。\n知命而不惧，顺势而为之。`
  }

  return quote
}

/* ------------------------------------------------------------
   从解读中提取金句
   ------------------------------------------------------------ */

function extractQuote(content: string): string | null {
  // 尝试匹配 "命格金句" 章节
  const sectionMatch = content.match(/###\s*陆[·.、]\s*命格金句[\s\S]*?(?=###|---|\n\n\n|$)/)
  if (sectionMatch) {
    // 提取引号内的内容
    const quotes = sectionMatch[0].match(/"([^"]+)"/g)
    if (quotes && quotes.length > 0) {
      return quotes.map(q => q.replace(/"/g, '')).join('\n')
    }
    // 尝试提取 > 引用块
    const blockQuote = sectionMatch[0].match(/>\s*[""]([^""]+)[""]/)
    if (blockQuote) {
      return blockQuote[1]
    }
  }
  return null
}

/* ------------------------------------------------------------
   获取命宫主星
   ------------------------------------------------------------ */

function getLifePalaceStars(chart: any): string {
  const lifePalace = chart?.palaces?.find((p: any) => p.name === '命宫')
  if (!lifePalace?.majorStars?.length) return '未知'
  return lifePalace.majorStars.map((s: any) => s.name.replace('星', '')).join('·')
}

/* ------------------------------------------------------------
   获取格局名称
   ------------------------------------------------------------ */

function getPatternName(chart: any): string | null {
  // 简化版格局判断 - 可后续扩展
  const lifePalace = chart?.palaces?.find((p: any) => p.name === '命宫')
  const stars = lifePalace?.majorStars?.map((s: any) => s.name) || []

  if (stars.includes('紫微') && stars.includes('天府')) return '紫府同宫格'
  if (stars.includes('紫微') && stars.includes('贪狼')) return '紫贪同宫格'
  if (stars.includes('紫微') && stars.includes('天相')) return '紫相同宫格'
  if (stars.includes('太阳') && stars.includes('太阴')) return '日月同宫格'
  if (stars.includes('天机') && stars.includes('太阴')) return '机月同梁格'
  if (stars.includes('廉贞') && stars.includes('贪狼')) return '廉贪同宫格'
  if (stars.includes('武曲') && stars.includes('贪狼')) return '武贪同宫格'

  return null
}

/* ------------------------------------------------------------
   分享卡片组件
   ------------------------------------------------------------ */

export function ShareCard() {
  const { chart, birthInfo } = useChartStore()
  const { chartInterpretation } = useContentCacheStore()
  const cardRef = useRef<HTMLDivElement>(null)
  const [generating, setGenerating] = useState(false)
  const [customQuote, setCustomQuote] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  // 从解读中提取金句，或根据命盘自动生成
  const extractedQuote = chartInterpretation ? extractQuote(chartInterpretation) : null
  const autoGeneratedQuote = (chart && birthInfo) ? generatePersonalizedQuote(chart, birthInfo) : null
  const displayQuote = customQuote || extractedQuote || autoGeneratedQuote || '命由天定，事在人为。\n知命而不惧，顺势而为之。'

  // 命盘信息
  const ganZhi = birthInfo ? yearToGanZhi(birthInfo.year) : ''
  const gender = birthInfo?.gender === 'male' ? '乾造' : '坤造'
  const stars = chart ? getLifePalaceStars(chart) : ''
  const pattern = chart ? getPatternName(chart) : null
  const fiveElements = chart?.fiveElementsClass || ''

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return

    setGenerating(true)
    try {
      await document.fonts.ready

      const card = cardRef.current
      
      // 保存原始样式
      const originalStyle = {
        width: card.style.width,
        height: card.style.height,
        position: card.style.position,
        left: card.style.left,
        top: card.style.top,
        transform: card.style.transform,
      }
      
      // 临时将卡片定位到左上角，避免 html2canvas 捕获到灰色边距
      card.style.width = '360px'
      card.style.height = '480px'
      card.style.position = 'fixed'
      card.style.left = '0'
      card.style.top = '0'
      card.style.transform = 'none'

      const canvas = await html2canvas(card, {
        backgroundColor: '#0c0c18',
        scale: 4,
        useCORS: true,
        logging: false,
        allowTaint: true,
        width: 360,
        height: 480,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
      })

      // 恢复原始样式
      card.style.width = originalStyle.width
      card.style.height = originalStyle.height
      card.style.position = originalStyle.position
      card.style.left = originalStyle.left
      card.style.top = originalStyle.top
      card.style.transform = originalStyle.transform

      const dataUrl = canvas.toDataURL('image/png', 1.0)

      const link = document.createElement('a')
      link.download = `紫微命格-${ganZhi}${gender}.png`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('生成图片失败:', err)
      alert(`图片生成失败: ${err instanceof Error ? err.message : '未知错误'}`)
    } finally {
      setGenerating(false)
    }
  }, [ganZhi, gender])

  if (!chart || !birthInfo) {
    return (
      <div className="text-center py-12 text-text-muted">
        <div className="text-4xl mb-3 opacity-30">✦</div>
        <p>请先生成命盘，再创建分享卡片</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-lg mx-auto">
      {/* 提示信息 */}
      {!extractedQuote && (
        <div className="text-center text-text-muted text-sm px-4">
          <p>💡 先进行命盘解读，即可自动提取专属金句</p>
        </div>
      )}

      {/* 卡片预览 - 所有颜色硬编码，避免 oklab */}
      <div className="w-full flex justify-center" style={{ padding: '0' }}>
        <div
          ref={cardRef}
          style={{
            width: '360px',
            height: '480px',
            background: '#0c0c18',
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* 外边框 - 双线描金 */}
          <div
            style={{
              position: 'absolute',
              top: '7px',
              left: '7px',
              right: '7px',
              bottom: '7px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 215, 0, 0.15)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '13px',
              left: '13px',
              right: '13px',
              bottom: '13px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 215, 0, 0.08)',
              pointerEvents: 'none',
            }}
          />

          {/* 四角装饰 */}
          <div style={{ position: 'absolute', top: '22px', left: '22px', color: 'rgba(212, 175, 55, 0.3)', fontSize: '16px' }}>✦</div>
          <div style={{ position: 'absolute', top: '22px', right: '22px', color: 'rgba(212, 175, 55, 0.3)', fontSize: '16px' }}>✦</div>
          <div style={{ position: 'absolute', bottom: '22px', left: '22px', color: 'rgba(212, 175, 55, 0.3)', fontSize: '16px' }}>✦</div>
          <div style={{ position: 'absolute', bottom: '22px', right: '22px', color: 'rgba(212, 175, 55, 0.3)', fontSize: '16px' }}>✦</div>

          {/* 内容区 */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            padding: '20px 22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            {/* 顶部星辰装饰线 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '6px' }}>
              <div style={{ width: '30px', height: '1px', background: 'rgba(212, 175, 55, 0.3)' }} />
              <span style={{ color: 'rgba(212, 175, 55, 0.5)', fontSize: '9px', letterSpacing: '0.1em' }}>☆ · ☆ · ☆</span>
              <div style={{ width: '30px', height: '1px', background: 'rgba(212, 175, 55, 0.3)' }} />
            </div>

            {/* 标题 */}
            <div style={{ textAlign: 'center', marginBottom: '6px' }}>
              <h2
                style={{
                  fontSize: '15px',
                  letterSpacing: '0.18em',
                  color: '#FCD34D',
                  fontFamily: FONT_SERIF,
                  margin: 0,
                }}
              >
                紫微命格
              </h2>
            </div>

            {/* 金句主体 */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0, margin: '6px 0' }}>
              <div
                style={{
                  fontSize: '14px',
                  lineHeight: '2',
                  color: '#FFFBEB',
                  fontFamily: FONT_BRUSH,
                  textAlign: 'center',
                  padding: '0 14px',
                  width: '100%',
                }}
              >
                {(() => {
                  const sentences = displayQuote.split('。').filter(s => s.trim())
                  if (sentences.length === 0) return null
                  const firstSentence = sentences[0]?.trim() || ''
                  const restSentences = sentences.slice(1).filter(s => s.trim())
                  return (
                    <>
                      <div>"{firstSentence}。</div>
                      {restSentences.length > 0 && (
                        <div style={{ marginTop: '0.3em' }}>{restSentences.join('。')}。"</div>
                      )}
                    </>
                  )
                })()}
              </div>
            </div>

            {/* 分隔线 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ width: '40px', height: '1px', background: 'rgba(212, 175, 55, 0.3)' }} />
              <span style={{ color: 'rgba(212, 175, 55, 0.4)', fontSize: '9px' }}>❖</span>
              <div style={{ width: '40px', height: '1px', background: 'rgba(212, 175, 55, 0.3)' }} />
            </div>

            {/* 命盘信息 */}
            <div style={{ textAlign: 'center' }}>
              <p
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.05em',
                  color: 'rgba(252, 211, 77, 0.8)',
                  fontFamily: FONT_SERIF,
                  margin: '0 0 3px 0',
                }}
              >
                命宫主星：{stars}
              </p>
              {pattern && (
                <p style={{ fontSize: '9px', color: 'rgba(212, 175, 55, 0.6)', margin: '0 0 2px 0' }}>
                  格局：{pattern}
                </p>
              )}
              <p style={{ fontSize: '9px', color: 'rgba(212, 175, 55, 0.5)', margin: 0 }}>
                {fiveElements}
              </p>
            </div>

            {/* 印章 + 年份 - 完美居中 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginTop: '8px',
              width: '100%',
              textAlign: 'center',
            }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 180, 0, 0.4)',
                  background: 'rgba(255, 180, 0, 0.05)',
                  color: 'rgba(212, 175, 55, 0.7)',
                  fontSize: '12px',
                  fontFamily: FONT_SERIF,
                  flexShrink: 0,
                  lineHeight: 1,
                  padding: 0,
                  boxSizing: 'border-box',
                }}
              >
                命
              </div>
              <span style={{
                color: 'rgba(252, 211, 77, 0.6)',
                fontSize: '11px',
                letterSpacing: '0.12em',
                margin: 0,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                display: 'inline-block',
                verticalAlign: 'middle',
              }}>
                {ganZhi}年 · {gender}
              </span>
            </div>

            {/* 底部水印 */}
            <div style={{ marginTop: '6px', paddingTop: '5px', borderTop: '1px solid rgba(212, 175, 55, 0.1)', textAlign: 'center' }}>
              <p style={{ color: 'rgba(212, 175, 55, 0.3)', fontSize: '9px', letterSpacing: '0.2em', margin: 0 }}>
                ─── 紫微卜运 ───
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 编辑金句 */}
      <div className="space-y-3">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={customQuote}
              onChange={(e) => setCustomQuote(e.target.value)}
              placeholder="输入自定义金句，每句话换行..."
              className="w-full h-24 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold/30 resize-none"
              style={{ fontFamily: FONT_BRUSH }}
            />
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                取消
              </Button>
              <Button size="sm" onClick={() => setIsEditing(false)}>
                确定
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full py-2 text-sm text-text-muted hover:text-text-secondary transition-colors"
          >
            ✎ 自定义金句
          </button>
        )}
      </div>

      {/* 下载按钮 */}
      <Button
        onClick={handleDownload}
        disabled={generating}
        className="w-full"
        variant="gold"
      >
        {generating ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-night border-t-transparent rounded-full animate-spin" />
            生成中...
          </span>
        ) : (
          '保存分享图'
        )}
      </Button>

      <p className="text-center text-text-muted text-xs">
        点击保存图片，可分享挚友✨
      </p>
    </div>
  )
}
