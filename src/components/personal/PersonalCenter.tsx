import { useState, useEffect, useRef } from 'react'
import { useAuthStore, usePointsConfigStore } from '@/stores'
import { api, type PointsLogEntry } from '@/api'
import { RechargeHistory } from './RechargeHistory'
import { HistoryPage } from './HistoryPage'
import { RechargePage } from './RechargePage'
import { Diamond, Wallet, Log, Time, Histogram, Ticket, FileText, Edit, Correct, Logout } from '@icon-park/react'
import iconPoints from '@/assets/icon-points.svg'
import iconPointsLog from '@/assets/icon-points-log.svg'

export function PersonalCenter({ onClose }: { onClose: () => void }) {
  const { user, logout, refreshUser } = useAuthStore()
  const { configs, load: loadConfigs } = usePointsConfigStore()

  if (!user) {
    return (
      <div className="modal-overlay"
        onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="relative w-full max-w-sm bg-night/95 border border-gold/25 rounded-2xl p-8 text-center animate-fade-in">
          <p className="text-text-muted mb-4">请先登录</p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gold/20 text-gold hover:bg-gold/30 transition-all"
          >
            关闭
          </button>
        </div>
      </div>
    )
  }

  const [redeemCode, setRedeemCode] = useState('')
  const [redeeming, setRedeeming] = useState(false)
  const [redeemMsg, setRedeemMsg] = useState('')
  const [redeemError, setRedeemError] = useState(false)
  const [pointsLog, setPointsLog] = useState<PointsLogEntry[]>([])
  const [showLog, setShowLog] = useState(false)
  const [showRechargeHistory, setShowRechargeHistory] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showRechargeNotice, setShowRechargeNotice] = useState(false)
  const [showRechargePage, setShowRechargePage] = useState(false)
  const [showPointsConfig, setShowPointsConfig] = useState(false)
  const [invitePoints, setInvitePoints] = useState(500)

  const [displayName, setDisplayName] = useState(user?.display_name || user?.username || '')
  const [editingDisplayName, setEditingDisplayName] = useState(false)
  const [savingDisplayName, setSavingDisplayName] = useState(false)
  const [displayNameMsg, setDisplayNameMsg] = useState('')

  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '')
  const [savingAvatar, setSavingAvatar] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadConfigs()
    refreshUser()
    fetch('/api/points-config').then(r => r.json()).then(d => setInvitePoints(d.invitePoints || 500)).catch(() => {})
  }, [])

  useEffect(() => {
    setDisplayName(user?.display_name || user?.username || '')
    setAvatarUrl(user?.avatar_url || '')
  }, [user])

  const handleRedeem = async () => {
    if (!redeemCode || !redeemCode.trim()) return
    setRedeeming(true)
    setRedeemMsg('')
    setRedeemError(false)
    try {
      const res = await api.redeem.use(redeemCode.trim())
      setRedeemMsg(`成功兑换 ${res.points_added} 积分！当前积分：${res.current_points}`)
      setRedeemCode('')
      refreshUser()
    } catch (err) {
      setRedeemMsg(err instanceof Error ? err.message : '兑换失败')
      setRedeemError(true)
    } finally {
      setRedeeming(false)
    }
  }

  const loadLog = async () => {
    if (pointsLog.length > 0) { setShowLog(!showLog); return }
    try {
      const res = await api.user.pointsLog(30)
      setPointsLog(res.logs)
      setShowLog(true)
    } catch {}
  }

  const handleSaveDisplayName = async () => {
    if (displayName.trim() === user?.display_name) { setEditingDisplayName(false); return }
    setSavingDisplayName(true)
    setDisplayNameMsg('')
    try {
      await api.user.update({ display_name: displayName.trim() })
      refreshUser()
      setEditingDisplayName(false)
    } catch (err) {
      setDisplayNameMsg(err instanceof Error ? err.message : '修改失败')
    } finally {
      setSavingDisplayName(false)
    }
  }

  const handleAvatarSave = async (base64Url?: string) => {
    const url = base64Url || avatarUrl
    if (!url.trim()) return
    setSavingAvatar(true)
    try {
      await api.user.update({ avatar_url: url })
      refreshUser()
    } catch {}
    setSavingAvatar(false)
  }

  const handleAvatarUpload = async (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      alert('图片不能超过 2MB')
      return
    }
    setUploading(true)
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      await handleAvatarSave(base64)
    } catch {
      alert('上传失败')
    }
    setUploading(false)
  }

  return (
    <div className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`
        relative w-full max-w-md
        ${showPointsConfig ? 'max-h-[90vh] overflow-y-auto' : ''}
        bg-gradient-to-b from-[#1a1035]/90 to-[#0d0b1a]/95 bg-night/95
        border border-purple-500/20 rounded-3xl
        animate-fade-in overflow-hidden
      `}>

        <div className="p-4 xs:p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4 xs:mb-5 sm:mb-6 relative">
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg xs:text-xl font-semibold text-gold" style={{ fontFamily: 'var(--font-serif)' }}>
                个人中心
              </h2>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-text-muted hover:text-gold hover:border-gold/30 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 头像 + 信息 | 邀请码 */}
          <div className="flex gap-4 mb-4 xs:mb-5 sm:mb-6 items-center">
            {/* 左侧：头像 */}
            <div
              className="relative w-20 h-20 flex-shrink-0 cursor-pointer group"
              onClick={() => fileRef.current?.click()}
              title="点击更换头像"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/50 via-gold/40 to-purple-500/50" />
              <div
                className="relative w-full h-full rounded-full bg-gradient-to-br from-star/30 to-gold/20 border-2 border-[#1a1035] flex items-center justify-center text-3xl xs:text-4xl overflow-hidden hover:opacity-80 transition-opacity"
              >
              {uploading ? (
                <span className="w-6 h-6 border-2 border-gold/50 border-t-transparent rounded-full animate-spin" />
              ) : user?.avatar_url ? (
                <img src={user.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gold/60">🧑</span>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleAvatarUpload(f)
                }}
              />
              </div>
            </div>

            {/* 中间：用户信息 */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                {editingDisplayName ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSaveDisplayName(); if (e.key === 'Escape') { setEditingDisplayName(false); setDisplayName(user?.display_name || user?.username || '') } }}
                      className="
                        w-28 px-2 py-1 rounded-lg text-sm
                        bg-white/[0.04] border border-star/40
                        text-text focus:outline-none focus:border-star
                      "
                      maxLength={20}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveDisplayName}
                      disabled={savingDisplayName}
                      className="w-7 h-7 rounded-lg bg-star/20 text-star-light hover:bg-star/30 transition-all disabled:opacity-50 flex items-center justify-center"
                    >
                      {savingDisplayName ? <span className="text-[10px]">...</span> : <Correct size="14" strokeWidth={2} />}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-text text-base xs:text-lg font-medium" style={{ fontFamily: 'var(--font-brush)' }}>
                      {user?.display_name || user?.username}
                    </p>
                    <button
                      onClick={() => setEditingDisplayName(true)}
                      className="text-text-muted/40 hover:text-star-light transition-colors p-0.5 rounded hover:bg-white/[0.06]"
                      title="修改昵称"
                    >
                      <Edit size="13" strokeWidth={2} />
                    </button>
                  </div>
                )}
              </div>
              {displayNameMsg && (
                <p className="text-xs text-misfortune">{displayNameMsg}</p>
              )}
              <p className="text-text-muted/60 text-xs">ID: {user?.id}</p>
            </div>

            {/* 右侧：邀请码 */}
            {user?.invite_code && (
              <div className="flex-shrink-0 text-right space-y-0.5">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-gold font-mono text-xs tracking-wider">{user.invite_code}</span>
                  <button
                    onClick={() => {
                      if (user.invite_code) {
                        navigator.clipboard?.writeText(user.invite_code)
                        alert('邀请码已复制')
                      }
                    }}
                    className="text-xs px-1.5 py-0.5 rounded bg-white/[0.06] text-text-muted hover:text-gold hover:bg-white/[0.1] transition-all"
                  >
                    复制
                  </button>
                </div>
                <p className="text-text-muted/60 text-[11px]">成功邀请好友可得 {invitePoints} 积分</p>
              </div>
            )}
          </div>

          {/* 积分展示 */}
          <div className="rounded-2xl bg-gradient-to-br from-purple-900/30 to-indigo-950/40 border border-purple-400/15 p-4 xs:p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-text-secondary text-sm flex items-center gap-1.5">
                <img src={iconPoints} alt="积分" className="w-[18px] h-[18px] brightness-0 invert" />
                当前积分
              </span>
                <span className="text-2xl font-bold text-gold">{user?.points ?? 0}</span>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              <button
                onClick={() => setShowRechargePage(true)}
                className="flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl border border-gold/30 bg-gradient-to-b from-gold/[0.12] to-gold/[0.04] hover:bg-white/[0.08] hover:border-gold/40 active:scale-[0.97] transition-all duration-200"
              >
                <Wallet theme="outline" size="20" strokeWidth={2} className="text-gold" />
                <span className="text-text-secondary text-xs">充值积分</span>
              </button>
              <button
                onClick={() => setShowRechargeHistory(true)}
                className="flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-purple-400/25 active:scale-[0.97] transition-all duration-200"
              >
                <Log theme="outline" size="20" strokeWidth={2} className="text-text-secondary" />
                <span className="text-text-secondary text-xs">充值记录</span>
              </button>
              <button
                onClick={() => setShowHistory(true)}
                className="flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-purple-400/25 active:scale-[0.97] transition-all duration-200"
              >
                <Time theme="outline" size="20" strokeWidth={2} className="text-text-secondary" />
                <span className="text-text-secondary text-xs">历史记录</span>
              </button>
              <button
                onClick={loadLog}
                className="flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-purple-400/25 active:scale-[0.97] transition-all duration-200"
              >
                <img src={iconPointsLog} alt="积分流水" className="w-5 h-5 brightness-0 invert" />
                <span className="text-text-secondary text-xs">{showLog ? '收起' : '积分流水'}</span>
              </button>
            </div>
          </div>

          {/* 兑换码 */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 mb-4">
            <p className="text-text-secondary text-sm mb-2 xs:mb-3 flex items-center gap-1.5">
              <Ticket theme="outline" size="18" strokeWidth={2} />
              兑换码
            </p>
            <div className="flex gap-1.5 xs:gap-2">
              <input
                type="text"
                value={redeemCode}
                onChange={(e) => setRedeemCode(e.target.value)}
                placeholder="输入兑换码"
                className="
                  flex-1 px-3 xs:px-4 py-2 rounded-xl text-xs xs:text-sm
                  bg-white/[0.05] border border-white/[0.10]
                  text-text placeholder-text-muted
                  focus:outline-none focus:border-purple-400/40
                  uppercase
                "
                onKeyDown={(e) => e.key === 'Enter' && handleRedeem()}
              />
              <button
                onClick={handleRedeem}
                disabled={redeeming || !redeemCode.trim()}
                className="
                  px-3 xs:px-5 py-2 rounded-xl
                  bg-gradient-to-r from-purple-500 to-indigo-600
                  text-white text-xs xs:text-sm font-medium whitespace-nowrap
                  hover:from-purple-400 hover:to-indigo-500
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                "
              >
                {redeeming ? '...' : '兑换'}
              </button>
            </div>
            {redeemMsg && (
              <p className={`text-xs mt-2 ${redeemError ? 'text-misfortune' : 'text-fortune'}`}>
                {redeemMsg}
              </p>
            )}
          </div>

          {/* 消耗参考 - 可折叠 */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden mb-4">
            <button
              onClick={() => setShowPointsConfig(!showPointsConfig)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
            >
              <p className="text-text-secondary text-sm flex items-center gap-1.5">
                <FileText theme="outline" size="18" strokeWidth={2} />
                消耗积分规则
              </p>
              <svg className={`w-4 h-4 text-text-muted/50 transition-transform duration-200 ${showPointsConfig ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {showPointsConfig && (
              <div className="px-3 xs:px-4 pb-3 xs:pb-4 space-y-1 xs:space-y-1.5 border-t border-white/[0.04] pt-2 xs:pt-3">
                {configs.map((c) => (
                  <div key={c.key} className="flex items-center justify-between text-[10px] xs:text-xs">
                    <span className="text-text-muted">{c.name}</span>
                    <span className="text-gold/80">{c.cost} 积分/次</span>
                  </div>
                ))}
                <p className="text-text-muted/40 text-[10px] pt-1 border-t border-white/[0.03]">积分不足时，建议前往充值</p>
              </div>
            )}
          </div>

          <button
            onClick={() => { logout(); onClose() }}
            className="w-full py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-text-muted hover:text-misfortune hover:border-misfortune/20 hover:bg-misfortune/5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Logout theme="outline" size="18" strokeWidth={2} />
            退出登录
          </button>

          {/* 背景装饰元素 */}
          <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none opacity-[0.04]">
            <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
              <defs>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity="1" />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="120" cy="40" r="80" fill="url(#glow)" filter="blur(20px)" />
            </svg>
            <div className="absolute top-8 right-12">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#a78bfa">
                <path d="M12 2L14.09 8.26L20.18 9.27L15.54 13.97L16.64 20.27L12 17.27L7.36 20.27L8.46 13.97L3.82 9.27L9.91 8.26L12 2Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {showRechargeNotice && (
        <div className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowRechargeNotice(false)}>
          <div className="
            relative w-full max-w-sm
            bg-night/95
            border border-gold/25 rounded-2xl
            animate-fade-in
          ">
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-gold mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
                充值功能暂未开放
              </h3>
              <p className="text-text-secondary text-sm mb-2">
                如需充值，请联系管理员
              </p>
              <p className="text-gold text-lg font-medium mb-6">
                微信：TianHong-04
              </p>
              <button
                onClick={() => setShowRechargeNotice(false)}
                className="
                  w-full py-3 rounded-xl text-sm font-medium
                  bg-gradient-to-r from-gold to-gold-dark
                  text-[#121228]
                  hover:from-gold-light hover:to-gold
                  transition-all duration-200
                "
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}

      {showLog && (
        <div className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowLog(false)}>
          <div className="
            relative w-full max-w-md max-h-[70vh] flex flex-col
            bg-night/95 border border-gold/20 rounded-2xl
            animate-fade-in
            " style={{ transform: 'translateZ(0)', contain: 'layout style paint' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

            {/* 固定标题栏 */}
            <div className="flex-shrink-0 p-4 xs:p-5 pb-3 border-b border-white/[0.06] rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gold" style={{ fontFamily: 'var(--font-serif)' }}>
                  积分流水
                </h2>
                <button onClick={() => setShowLog(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-gold hover:bg-white/[0.08] transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 滚动内容区 */}
            <div className="flex-1 overflow-y-auto p-4 xs:p-5 pt-3">
              {pointsLog.map((log) => (
                <div key={log.id} className="flex items-center justify-between text-sm py-2.5 border-b border-white/[0.04]">
                  <span className={log.amount > 0 ? 'text-green-400 font-medium' : 'text-misfortune font-medium'}>
                    {log.amount > 0 ? '+' : ''}{log.amount} 积分
                  </span>
                  <span className="text-text-secondary text-xs">{log.description}</span>
                  <span className="text-text-muted/50 text-xs whitespace-nowrap ml-2">{log.created_at?.slice(5, 16)}</span>
                </div>
              ))}
              {pointsLog.length === 0 && (
                <p className="text-center text-text-muted py-8">暂无记录</p>
              )}
            </div>
          </div>
        </div>
      )}

      {showRechargeHistory && (
        <RechargeHistory onClose={() => setShowRechargeHistory(false)} />
      )}

      {showRechargePage && (
        <RechargePage onClose={() => setShowRechargePage(false)} />
      )}

      {showHistory && (
        <HistoryPage onClose={() => setShowHistory(false)} />
      )}
    </div>
  )
}
