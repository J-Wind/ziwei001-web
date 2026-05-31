import { useState, useEffect, useRef } from 'react'
import { useAuthStore, usePointsConfigStore } from '@/stores'
import { api, type PointsLogEntry } from '@/api'
import { RechargeHistory } from './RechargeHistory'
import { HistoryPage } from './HistoryPage'
import { config } from '@/config/environment'

export function PersonalCenter({ onClose }: { onClose: () => void }) {
  const { user, logout, refreshUser } = useAuthStore()
  const { configs, load: loadConfigs } = usePointsConfigStore()
  const [redeemCode, setRedeemCode] = useState('')
  const [redeeming, setRedeeming] = useState(false)
  const [redeemMsg, setRedeemMsg] = useState('')
  const [redeemError, setRedeemError] = useState(false)
  const [pointsLog, setPointsLog] = useState<PointsLogEntry[]>([])
  const [showLog, setShowLog] = useState(false)
  const [showRechargeHistory, setShowRechargeHistory] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showRechargeNotice, setShowRechargeNotice] = useState(false)
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
    fetch(`${config.apiBaseUrl}/api/points-config`).then(r => r.json()).then(d => setInvitePoints(d.invitePoints || 500)).catch(() => {})
  }, [])

  useEffect(() => {
    setDisplayName(user?.display_name || user?.username || '')
    setAvatarUrl(user?.avatar_url || '')
  }, [user])

  const handleRedeem = async () => {
    if (!redeemCode.trim()) return
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="
        relative w-full max-w-lg max-h-[90vh] overflow-y-auto
        bg-gradient-to-br from-[#121228] to-[#0a0a15]
        backdrop-blur-xl border border-gold/20 rounded-2xl
        shadow-[0_8px_40px_rgba(0,0,0,0.5)]
        animate-fade-in
      ">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
              </svg>
              <h2 className="text-xl font-semibold text-gold" style={{ fontFamily: 'var(--font-serif)' }}>
                个人中心
              </h2>
            </div>
            <button onClick={onClose} className="text-text-muted hover:text-gold transition-colors text-xl">
              ✕
            </button>
          </div>

          {/* 头像 + 信息 */}
          <div className="flex flex-col items-center mb-6">
            <div
              className="w-20 h-20 rounded-full bg-gradient-to-br from-star/30 to-gold/20 border border-gold/30 flex items-center justify-center text-4xl mb-3 cursor-pointer hover:opacity-80 transition-opacity relative overflow-hidden"
              onClick={() => fileRef.current?.click()}
              title="点击更换头像"
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

            {/* 用户名 */}
            <div className="flex items-center gap-2 mb-1">
              {editingDisplayName ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSaveDisplayName(); if (e.key === 'Escape') { setEditingDisplayName(false); setDisplayName(user?.display_name || user?.username || '') } }}
                    className="
                      w-28 px-2 py-1 rounded-lg text-sm text-center
                      bg-white/[0.04] border border-star/40
                      text-text focus:outline-none focus:border-star
                    "
                    maxLength={20}
                    autoFocus
                  />
                  <button
                    onClick={handleSaveDisplayName}
                    disabled={savingDisplayName}
                    className="text-xs px-2 py-1 rounded bg-star/20 text-star-light hover:bg-star/30 transition-all disabled:opacity-50"
                  >
                    {savingDisplayName ? '...' : '确认'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-text text-lg font-medium" style={{ fontFamily: 'var(--font-brush)' }}>
                    {user?.display_name || user?.username}
                  </p>
                  <button
                    onClick={() => setEditingDisplayName(true)}
                    className="text-text-muted/40 hover:text-star-light transition-colors text-xs"
                    title="修改昵称"
                  >
                    编辑
                  </button>
                </div>
              )}
            </div>
            {displayNameMsg && (
              <p className="text-xs text-misfortune mb-1">{displayNameMsg}</p>
            )}
            <p className="text-text-muted/60 text-xs">ID: {user?.id}</p>
            <p className="text-text-muted text-sm mt-0.5">
              注册时间：{user?.created_at ? new Date(user.created_at).toLocaleDateString('zh-CN') : ''}
            </p>

            {/* 邀请码 */}
            {user?.invite_code && (
              <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/20 w-full max-w-xs">
                <p className="text-text-muted text-xs mb-1">我的邀请码</p>
                <div className="flex items-center justify-between">
                  <span className="text-gold font-mono text-lg tracking-widest">{user.invite_code}</span>
                  <button
                    onClick={() => {
                      if (user.invite_code) {
                        navigator.clipboard?.writeText(user.invite_code)
                        alert('邀请码已复制')
                      }
                    }}
                    className="text-xs px-2 py-1 rounded bg-gold/20 text-gold hover:bg-gold/30 transition-all"
                  >
                    复制
                  </button>
                </div>
                <p className="text-text-muted/60 text-xs mt-1">邀请用户可得 {invitePoints} 积分</p>
              </div>
            )}

            {/* 头像 URL 输入 (暂时隐藏) */}
            {/* <div className="flex items-center gap-2 mt-3 w-full max-w-xs">
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="或输入头像图片 URL"
                className="
                  flex-1 px-3 py-2 rounded-lg text-sm
                  bg-white/[0.04] border border-white/[0.08]
                  text-text placeholder-text-muted
                  focus:outline-none focus:border-star/50
                "
                onKeyDown={(e) => e.key === 'Enter' && handleAvatarSave()}
              />
              <button
                onClick={() => handleAvatarSave()}
                disabled={savingAvatar || !avatarUrl.trim()}
                className="px-3 py-2 rounded-lg text-sm bg-star/20 border border-star/30 text-star-light hover:bg-star/30 transition-all disabled:opacity-50"
              >
                {savingAvatar ? '...' : '保存'}
              </button>
            </div> */}
          </div>

          {/* 积分展示 */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-star/10 to-gold/5 border border-gold/10 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 3l2.5 5 5.5.8-4 3.9.9 5.5L10 15.5 5.1 18.2l.9-5.5-4-3.9L7.5 8z"/>
                </svg>
                <span className="text-text-secondary text-sm">当前积分</span>
              </div>
              <span className="text-2xl font-bold text-gold">{user?.points ?? 0}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setShowRechargeNotice(true)}
                className="
                  flex flex-col items-center justify-center gap-1
                  py-2 px-1 rounded-lg
                  hover:bg-white/5
                  text-gold text-xs font-medium
                  transition-all duration-200
                "
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"/>
                </svg>
                <span>充值</span>
              </button>
              <button
                onClick={() => setShowRechargeHistory(true)}
                className="
                  flex flex-col items-center justify-center gap-1
                  py-2 px-1 rounded-lg
                  hover:bg-white/5
                  text-text-secondary text-xs font-medium
                  transition-all duration-200
                "
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
                </svg>
                <span>记录</span>
              </button>
              <button
                onClick={() => setShowHistory(true)}
                className="
                  flex flex-col items-center justify-center gap-1
                  py-2 px-1 rounded-lg
                  hover:bg-white/5
                  text-text-secondary text-xs font-medium
                  transition-all duration-200
                "
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.292A8.967 8.967 0 0118 3.75c.967 0 1.914.18 2.75.512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6-2.292m0-14.292v14.25"/>
                </svg>
                <span>历史</span>
              </button>
              <button
                onClick={loadLog}
                className="
                  flex flex-col items-center justify-center gap-1
                  py-2 px-1 rounded-lg
                  hover:bg-white/5
                  text-text-secondary text-xs font-medium
                  transition-all duration-200
                "
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/>
                </svg>
                <span>{showLog ? '收起' : '流水'}</span>
              </button>
            </div>

            {showLog && (
              <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={(e) => e.target === e.currentTarget && setShowLog(false)}>
                <div className="
                  relative w-full max-w-md max-h-[70vh]
                  bg-gradient-to-br from-[#121228] to-[#0a0a15]
                  backdrop-blur-xl border border-gold/20 rounded-2xl
                  shadow-[0_8px_40px_rgba(0,0,0,0.5)]
                  animate-fade-in overflow-hidden flex flex-col
                ">
                  <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                    <h3 className="text-lg font-semibold text-gold" style={{ fontFamily: 'var(--font-serif)' }}>
                      积分流水
                    </h3>
                    <button onClick={() => setShowLog(false)} className="text-text-muted hover:text-gold transition-colors text-xl">
                      ✕
                    </button>
                  </div>
                  <div className="p-5 space-y-2 overflow-y-auto flex-1">
                    {pointsLog.map((log) => (
                      <div key={log.id} className="flex items-center justify-between text-sm py-2.5 border-b border-white/[0.04]">
                        <span className={log.amount > 0 ? 'text-fortune font-medium' : 'text-misfortune font-medium'}>
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
          </div>

          {/* 兑换码 */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-star" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"/>
              </svg>
              <p className="text-text-secondary text-sm">兑换码</p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={redeemCode}
                onChange={(e) => setRedeemCode(e.target.value)}
                placeholder="输入兑换码"
                className="
                  flex-1 px-4 py-2.5 rounded-xl text-sm
                  bg-white/[0.04] border border-white/[0.08]
                  text-text placeholder-text-muted
                  focus:outline-none focus:border-star/50
                  uppercase
                "
                onKeyDown={(e) => e.key === 'Enter' && handleRedeem()}
              />
              <button
                onClick={handleRedeem}
                disabled={redeeming || !redeemCode.trim()}
                className="
                  px-5 py-2.5 rounded-xl
                  bg-gradient-to-r from-star to-star-dark
                  text-white text-sm font-medium
                  hover:from-star-light hover:to-star
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

          {/* 消耗参考 */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] mb-6">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
              </svg>
              <p className="text-text-muted text-xs">各操作消耗积分参考：</p>
            </div>
            <div className="space-y-1.5">
              {configs.map((c) => (
                <div key={c.key} className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">{c.name}</span>
                  <span className="text-gold/80">{c.cost} 积分/次</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => { logout(); onClose() }}
            className="
              w-full py-3 rounded-xl text-sm
              bg-white/[0.04] border border-white/[0.08]
              text-text-muted hover:text-misfortune hover:border-misfortune/30
              transition-all duration-200 flex items-center justify-center gap-2
            "
            style={{ fontFamily: 'var(--font-brush)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/>
            </svg>
            退出登录
          </button>
        </div>
      </div>

      {showRechargeNotice && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowRechargeNotice(false)}>
          <div className="
            relative w-full max-w-sm
            bg-gradient-to-br from-[#121228] to-[#0a0a15]
            backdrop-blur-xl border border-gold/20 rounded-2xl
            shadow-[0_8px_40px_rgba(0,0,0,0.5)]
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

      {showRechargeHistory && (
        <RechargeHistory onClose={() => setShowRechargeHistory(false)} />
      )}

      {showHistory && (
        <HistoryPage onClose={() => setShowHistory(false)} />
      )}
    </div>
  )
}
