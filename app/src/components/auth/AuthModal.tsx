import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores'
import { MathCaptcha } from './MathCaptcha'
import logoImg from '@/assets/zwdsLogo-small.png'

export function AuthModal() {
  const { showAuthModal, authModalTab, setShowAuthModal, setAuthModalTab, login, register } = useAuthStore()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [newUserPoints, setNewUserPoints] = useState(1000)
  const [captchaValid, setCaptchaValid] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // 弹窗打开时清空表单并获取注册积分配置
  useEffect(() => {
    if (showAuthModal) {
      setPhone('')
      setPassword('')
      setConfirmPassword('')
      setInviteCode('')
      setError('')
      setCaptchaValid(false)
      fetchNewUserPoints()
    }
  }, [showAuthModal])

  const fetchNewUserPoints = async () => {
    try {
      const res = await fetch('/api/points-config')
      if (res.ok) {
        const data = await res.json()
        setNewUserPoints(data.newUserPoints || 1000)
      }
    } catch {
      // 使用默认值
    }
  }

  if (!showAuthModal) return null

  const isLogin = authModalTab === 'login'
  const isAdminPhone = isLogin && phone.trim() === '13888888888'

  const validatePhone = (p: string): string | null => {
    if (isLogin && p === '13888888888') return null
    if (!/^1[3-9]\d{9}$/.test(p)) {
      return '请输入正确的11位手机号'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 验证码校验
    if (!captchaValid) {
      setError('请输入正确的验证码')
      return
    }

    const trimmedPhone = phone.trim()
    const phoneError = validatePhone(trimmedPhone)
    if (phoneError) {
      setError(phoneError)
      return
    }

    if (!password) {
      setError('请输入密码')
      return
    }

    if (password.length < 6) {
      setError('密码至少需要6个字符')
      return
    }

    if (!isLogin && password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    setLoading(true)
    try {
      if (isLogin) {
        await login(trimmedPhone, password)
      } else {
        await register(trimmedPhone, password, inviteCode.trim() || undefined)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : '操作失败，请重试'
      console.error('注册/登录失败:', { error: msg, phone: trimmedPhone, passwordLength: password?.length })
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && setShowAuthModal(false)}
    >
      <div className="relative w-[92%] max-w-md sm:w-full">
        {/* 主卡片 - 性能优化版 */}
        <div
          className="
            relative overflow-hidden
            bg-night/95
            border border-gold/20 rounded-2xl
          "
        >
          {/* 顶部发光线 */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

          {/* Logo 和标题区域 */}
          <div className="relative pt-5 xs:pt-6 sm:pt-8 pb-4 xs:pb-5 sm:pb-6 px-4 xs:px-5 sm:px-8 text-center">
            <div className="inline-flex items-center justify-center mb-3 xs:mb-4">
              <img src={logoImg} alt="紫微卜运" className="w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 object-contain" />
            </div>
            <h2
              className="text-xl xs:text-2xl font-bold mb-1.5 xs:mb-2 text-gold"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {isLogin ? '欢迎回来' : '加入我们'}
            </h2>
            <p className="text-sm text-text-muted">
              {isLogin ? '登录您的紫微卜运账户' : '创建新账户开始探索命运'}
            </p>
          </div>

          {/* Tab 切换 - 精致纹理版 */}
          <div className="px-4 xs:px-5 sm:px-8 mb-4 xs:mb-6">
            <div className="relative flex gap-0 rounded-full bg-gradient-to-r from-white/[0.08] via-white/[0.04] to-white/[0.08] border border-white/[0.1] shadow-[inset_0_1px_3px_rgba(255,255,255,0.05),0_4px_20px_rgba(0,0,0,0.3)] overflow-hidden">

              {/* 背景纹理装饰 */}
              <div className="absolute inset-0 rounded-full opacity-30 pointer-events-none" style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,224,102,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(168,85,247,0.1) 0%, transparent 50%)`
              }} />

              <button
                onClick={() => { setAuthModalTab('login'); setError('') }}
                className={`relative flex-1 py-3 text-center text-sm font-bold overflow-hidden group ${
                  isLogin
                    ? 'text-night rounded-full'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {isLogin && (
                  <>
                    {/* 多层渐变背景 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-light via-gold to-gold-dark rounded-full" />

                    {/* 纹理叠加层 */}
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }} />

                    {/* 顶部高光 */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-gold-light" />

                    {/* 底部阴影 */}
                    <div className="absolute bottom-0 left-2 right-2 h-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent blur-sm" />
                  </>
                )}

                <span className="relative z-10 inline-block w-full">
                  登录
                </span>
              </button>

              <button
                onClick={() => { setAuthModalTab('register'); setError('') }}
                className={`relative flex-1 py-3 text-center text-sm font-bold overflow-hidden group ${
                  !isLogin
                    ? 'text-white rounded-full'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {!isLogin && (
                  <>
                    {/* 紫色多层渐变 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-full" />

                    {/* 纹理叠加 */}
                    <div className="absolute inset-0 opacity-15" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20z'/%3E%3C/g%3E%3C/svg%3E")`,
                      backgroundSize: '10px 10px'
                    }} />

                    {/* 顶部高光 */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/70 to-purple-300" />

                    {/* 底部发光 */}
                    <div className="absolute bottom-0 left-2 right-2 h-1 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent blur-sm" />
                  </>
                )}

                <span className="relative z-10 inline-block w-full">
                  注册
                </span>
              </button>
            </div>
          </div>

          {/* 表单区域 */}
          <form onSubmit={handleSubmit} className="px-4 xs:px-5 sm:px-8 space-y-3 xs:space-y-4 pb-5 xs:pb-8">
            {/* 手机号输入 */}
            <div className="group relative">
              <label className="block text-xs font-medium text-text-secondary mb-1.5 ml-1">手机号码</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-star transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => {
                    if (isAdminPhone) {
                      setPhone(e.target.value)
                    } else {
                      setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))
                    }
                  }}
                  placeholder="请输入手机号"
                  className="
                    w-full pl-12 pr-4 py-3 rounded-xl
                    bg-white/[0.06] border border-white/[0.08]
                    text-text placeholder-text-muted/60
                    focus:outline-none focus:border-star/50 focus:bg-white/[0.08]
                    focus:shadow-[0_0_20px_rgba(139,92,246,0.1)]
                    transition-all duration-200 group-hover:border-white/12
                  "
                />
              </div>
            </div>

            {/* 密码输入 */}
            <div className="group relative">
              <label className="block text-xs font-medium text-text-secondary mb-1.5 ml-1">登录密码</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-star transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码（至少6位）"
                  className="
                    w-full pl-12 pr-12 py-3 rounded-xl
                    bg-white/[0.06] border border-white/[0.08]
                    text-text placeholder-text-muted/60
                    focus:outline-none focus:border-star/50 focus:bg-white/[0.08]
                    focus:shadow-[0_0_20px_rgba(139,92,246,0.1)]
                    transition-all duration-200 group-hover:border-white/12
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* 确认密码（仅注册） */}
            {!isLogin && (
              <div className="group relative animate-fadeIn">
                <label className="block text-xs font-medium text-text-secondary mb-1.5 ml-1">确认密码</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-star transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="请再次输入密码"
                    className="
                      w-full pl-12 pr-4 py-3 rounded-xl
                      bg-white/[0.06] border border-white/[0.08]
                      text-text placeholder-text-muted/60
                      focus:outline-none focus:border-star/50 focus:bg-white/[0.08]
                      focus:shadow-[0_0_20px_rgba(139,92,246,0.1)]
                      transition-all duration-200 group-hover:border-white/12
                    "
                  />
                </div>
              </div>
            )}

            {/* 邀请码（仅注册，可选） */}
            {!isLogin && (
              <div className="group relative animate-fadeIn">
                <label className="block text-xs font-medium text-text-secondary mb-1.5 ml-1">
                  邀请码
                  <span className="ml-1 text-text-muted/60 font-normal">(选填)</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-star transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    placeholder="输入邀请码可获得奖励"
                    maxLength={6}
                    className="
                      w-full pl-12 pr-4 py-3 rounded-xl
                      bg-white/[0.06] border border-white/[0.08]
                      text-text placeholder-text-muted/60
                      focus:outline-none focus:border-star/50 focus:bg-white/[0.08]
                      focus:shadow-[0_0_20px_rgba(139,92,246,0.1)]
                      transition-all duration-200 group-hover:border-white/12
                      uppercase tracking-widest font-mono
                    "
                  />
                </div>
              </div>
            )}

            {/* 数学验证码 */}
            <div className="group relative">
              <label className="block text-xs font-medium text-text-secondary mb-1.5 ml-1">
                安全验证
                <span className="ml-1 text-red-400">*</span>
              </label>
              <MathCaptcha
                onValidate={setCaptchaValid}
                onValueChange={() => {}}
              />
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 animate-shake">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={loading || !captchaValid}
              className="
                relative w-full py-3.5 rounded-xl
                bg-gradient-to-r from-gold-light via-gold to-gold-dark
                text-night font-bold text-base
                shadow-[0_4px_20px_rgba(255,224,102,0.35)]
                border border-gold/40
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                overflow-hidden group
              "
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {/* 按钮光效 */}
              <span className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />

              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-night border-t-transparent rounded-full animate-spin" />
                    {isLogin ? '登录中...' : '注册中...'}
                  </>
                ) : (
                  <>
                    {isLogin ? '立即登录' : '立即注册'}
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>

          {/* 底部提示 */}
          {isLogin && (
            <div className="pb-5 xs:pb-8 px-4 xs:px-5 sm:px-8">
              <div className="text-center pt-4 border-t border-white/[0.06]">
                <p className="text-xs text-text-muted">
                  新用户注册即送
                  <span className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.257 1.13a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {newUserPoints} 积分
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 关闭按钮 */}
        <button
          type="button"
          onClick={() => setShowAuthModal(false)}
          className="absolute -top-3 -right-3 w-10 h-10 flex items-center justify-center rounded-full bg-night-light/90 border border-white/10 text-text-muted hover:text-text hover:bg-night hover:border-white/20 transition-all duration-200 shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
