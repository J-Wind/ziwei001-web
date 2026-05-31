import { useState, useCallback, useEffect } from 'react'

interface MathCaptchaProps {
  onValidate: (isValid: boolean) => void
  onValueChange?: (value: string) => void
}

export function MathCaptcha({ onValidate, onValueChange }: MathCaptchaProps) {
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [answer, setAnswer] = useState('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  // 生成新的验证码
  const generateCaptcha = useCallback(() => {
    const n1 = Math.floor(Math.random() * 10) + 1
    const n2 = Math.floor(Math.random() * 10) + 1
    setNum1(n1)
    setNum2(n2)
    setAnswer('')
    setIsCorrect(null)
    onValidate(false)
    onValueChange?.('')
  }, [onValidate, onValueChange])

  // 初始化时生成验证码
  useEffect(() => {
    generateCaptcha()
  }, [])

  // 验证答案
  const validateAnswer = (value: string) => {
    setAnswer(value)
    onValueChange?.(value)

    if (value === '') {
      setIsCorrect(null)
      onValidate(false)
      return
    }

    const userAnswer = parseInt(value, 10)
    const correctAnswer = num1 + num2
    const isValid = !isNaN(userAnswer) && userAnswer === correctAnswer

    setIsCorrect(isValid)
    onValidate(isValid)
  }

  return (
    <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3">
      {/* 验证码显示区域 */}
      <div className="relative flex-shrink-0 w-[80px] xs:w-[100px] sm:w-[120px] h-[40px] xs:h-[44px] rounded-lg overflow-hidden bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/30 backdrop-blur-sm">
        {/* 干扰线 */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="10" x2="100%" y2="30" stroke="rgba(167,139,250,0.15)" strokeWidth="1" />
          <line x1="20" y1="0" x2="80%" y2="44" stroke="rgba(255,224,102,0.12)" strokeWidth="1" />
          <line x1="0" y1="35" x2="100%" y2="15" stroke="rgba(167,139,250,0.18)" strokeWidth="1" />
        </svg>

        {/* 数学表达式 */}
        <div className="relative z-10 flex items-center justify-center h-full gap-1.5 text-lg font-bold select-none"
          style={{
            fontFamily: 'var(--font-serif)',
            color: '#ffeb8a',
            textShadow: '0 0 8px rgba(255,235,138,0.6), 0 0 16px rgba(255,224,102,0.4), 0 0 24px rgba(245,200,66,0.25)',
          }}
        >
          <span className="inline-block transform -rotate-6">{num1}</span>
          <span className="text-purple-300">+</span>
          <span className="inline-block transform rotate-3">{num2}</span>
          <span className="text-purple-300 ml-0.5">=</span>
          <span className="text-gold-light">?</span>
        </div>

        {/* 刷新按钮 */}
        <button
          type="button"
          onClick={generateCaptcha}
          className="absolute top-0.5 right-0.5 p-1 rounded-md hover:bg-white/10 transition-colors group"
          title="刷新验证码"
        >
          <svg
            className="w-3.5 h-3.5 text-purple-400/60 group-hover:text-purple-300 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* 输入框 */}
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={answer}
        onChange={(e) => validateAnswer(e.target.value.replace(/\D/g, '').slice(0, 3))}
        placeholder="输入结果"
        maxLength={3}
        className={`
          flex-1 min-w-0 h-[40px] xs:h-[44px] px-2.5 xs:px-4 rounded-lg
          bg-white/[0.04] backdrop-blur-sm
          border transition-all duration-200
          placeholder:text-text-muted text-xs xs:text-sm
          focus:outline-none focus:bg-white/[0.06]
          ${
            isCorrect === true
              ? 'border-green-500/50 focus:border-green-400 shadow-[0_0_12px_rgba(34,197,94,0.2)]'
              : isCorrect === false && answer !== ''
              ? 'border-red-500/50 focus:border-red-400'
              : 'border-white/[0.08] focus:border-star/50'
          }
          text-text font-medium tracking-wider
        `}
      />

      {/* 状态图标 */}
      {isCorrect === true && (
        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse">
          <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      {isCorrect === false && answer !== '' && (
        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      )}
    </div>
  )
}
