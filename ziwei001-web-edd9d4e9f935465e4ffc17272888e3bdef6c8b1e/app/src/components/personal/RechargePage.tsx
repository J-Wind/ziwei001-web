import { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '@/stores'
import { api } from '@/api'
import iconAlipay from '@/assets/icon-alipay.svg'

// 设备检测函数
const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

interface RechargePackage {
  amount: number
  points: number
  label: string
  bonus?: number
  limited?: boolean
  original_price?: number
}

interface RechargeConfig {
  wechatQR: string
  alipayQR: string
  packages: RechargePackage[]
}

const AlipayIcon = () => (
  <img src={iconAlipay} alt="支付宝" className="w-6 h-6" />
)

export function RechargePage({ onClose }: { onClose: () => void }) {
  const { user, refreshUser } = useAuthStore()
  const [config, setConfig] = useState<RechargeConfig | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<RechargePackage | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [showQrcodeModal, setShowQrcodeModal] = useState(false)
  const [qrcodeUrl, setQrcodeUrl] = useState<string | null>(null)
  const [currentOrderNo, setCurrentOrderNo] = useState<string | null>(null)
  const [orderStatus, setOrderStatus] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(300)
  const [paymentExpired, setPaymentExpired] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [loadingQrcode, setLoadingQrcode] = useState(false)
  
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    loadConfig()

    // 检测手机端从支付宝返回的情况
    if (isMobileDevice()) {
      const pendingOrderNo = localStorage.getItem('pending_order_no')
      const pendingOrderTime = localStorage.getItem('pending_order_time')

      if (pendingOrderNo && pendingOrderTime) {
        const orderTime = new Date(pendingOrderTime)
        const now = new Date()
        const timeDiff = (now.getTime() - orderTime.getTime()) / 1000 // 秒

        // 如果订单在10分钟内创建，自动恢复轮询
        if (timeDiff < 600) {
          console.log('📱 检测到未完成的支付订单，恢复轮询:', pendingOrderNo)
          setCurrentOrderNo(pendingOrderNo)
          startPolling(pendingOrderNo)
          startCountdown()
        } else {
          // 超时清除
          localStorage.removeItem('pending_order_no')
          localStorage.removeItem('pending_order_time')
        }
      }
    }

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current)
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current)
    }
  }, [])

  const loadConfig = async () => {
    try {
      const data = await api.recharge.getConfig()
      setConfig(data)
      if (data.packages && data.packages.length > 0) {
        setSelectedPackage(data.packages[0])
      }
    } catch {}
  }

  const startPolling = (orderNo: string) => {
    setCurrentOrderNo(orderNo)
    setOrderStatus('pending')
    
    pollTimerRef.current = setInterval(async () => {
      try {
        const data = await api.recharge.zpayQuery(orderNo)
        console.log('订单状态查询:', data)
        setOrderStatus(data.status)
        
        if (data.status === 'approved') {
          if (pollTimerRef.current) clearInterval(pollTimerRef.current)
          if (countdownTimerRef.current) clearInterval(countdownTimerRef.current)
          setPaymentSuccess(true)

          localStorage.removeItem('pending_order_no')
          localStorage.removeItem('pending_order_time')

          console.log('支付成功，开始刷新用户信息和积分...')

          try {
            await refreshUser()
            console.log('首次刷新完成，当前积分:', useAuthStore.getState().user?.points)

            const logRes = await api.user.pointsLog(5)
            console.log('积分流水验证:', logRes)
          } catch (err) {
            console.error('支付后刷新失败:', err)
          }

          setTimeout(async () => {
            try {
              await refreshUser()
              const user = useAuthStore.getState().user
              console.log('二次刷新完成，最终积分:', user?.points)
            } catch (err) {
              console.error('二次刷新失败:', err)
            }
          }, 1500)

          setTimeout(() => {
            handleCloseQrcodeModal()
            refreshUser().then(() => {
              const user = useAuthStore.getState().user
              console.log('关闭前最终刷新，积分:', user?.points)
              onClose()
            }).catch(() => onClose())
          }, 3000)
        }
      } catch (err) {
        console.error('查询订单状态失败:', err)
      }
    }, 3000)
  }

  const startCountdown = () => {
    setCountdown(300)
    setPaymentExpired(false)
    
    countdownTimerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (countdownTimerRef.current) clearInterval(countdownTimerRef.current)
          if (pollTimerRef.current) clearInterval(pollTimerRef.current)
          setPaymentExpired(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handlePay = async () => {
    if (!selectedPackage) {
      setError('请先选择充值套餐')
      return
    }
    
    setSubmitting(true)
    setLoadingQrcode(true)
    setError(null)

    try {
      console.log('开始创建订单...', selectedPackage)
      
      const result = await api.recharge.zpayCreate({
        amount: selectedPackage.amount,
        points: selectedPackage.points,
        type: 'alipay',
      })
      
      console.log('API 返回结果:', result)

      if (result && result.success && result.orderNo) {
        const qrcode = result.img || result.qrcode || null
        const payUrl = result.payUrl || null

        console.log('二维码 URL:', qrcode)
        console.log('支付链接:', payUrl)
        console.log('是否手机端:', isMobileDevice())

        // 手机端：如果有支付链接，直接跳转支付宝
        if (isMobileDevice() && payUrl) {
          console.log('📱 检测到手机端，跳转支付宝...')
          setCurrentOrderNo(result.orderNo)
          startPolling(result.orderNo)

          // 保存订单信息，以便返回后继续轮询
          localStorage.setItem('pending_order_no', result.orderNo)
          localStorage.setItem('pending_order_time', new Date().toISOString())

          // 直接跳转到支付宝
          window.location.href = payUrl
          return
        }

        // PC端或无支付链接：显示二维码
        setQrcodeUrl(qrcode)
        setShowQrcodeModal(true)
        setCurrentOrderNo(result.orderNo)

        startPolling(result.orderNo)
        startCountdown()
      } else {
        console.error('创建订单失败:', result)
        setError(result?.message || '创建订单失败，请重试')
      }
    } catch (err) {
      console.error('支付错误详情:', err)
      const errorMessage = err instanceof Error ? err.message : '网络错误，请检查连接'
      setError('创建订单失败：' + errorMessage)
    } finally {
      setSubmitting(false)
      setLoadingQrcode(false)
    }
  }

  const handleCloseQrcodeModal = () => {
    if (pollTimerRef.current) clearInterval(pollTimerRef.current)
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current)
    setShowQrcodeModal(false)
    setQrcodeUrl(null)
    setCurrentOrderNo(null)
    setOrderStatus(null)
    setPaymentExpired(false)
    setPaymentSuccess(false)
    setLoadingQrcode(false)
    setError(null)
  }

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0')
  }

  if (error) {
    return (
      <div className="modal-overlay">
        <div className="relative w-full max-w-sm bg-night border border-red-500/30 rounded-2xl p-6"
          style={{ transform: 'translateZ(0)', contain: 'layout style paint' }}>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-lg font-bold text-red-400 mb-2">支付出错</h3>
            <p className="text-text-muted text-sm mb-6">{error}</p>
            <button
              onClick={() => setError(null)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#0958d9] text-white text-sm font-medium hover:from-[#4096ff] hover:to-[#1677FF] transition-all"
            >
              返回重试
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="modal-overlay"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
        <div className="relative w-full max-w-sm bg-night border border-gold/20 rounded-2xl overflow-hidden"
          style={{ transform: 'translateZ(0)', contain: 'layout style paint' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlipayIcon />
                <h2 className="text-base font-semibold text-gold" style={{ fontFamily: 'var(--font-serif)' }}>支付宝充值</h2>
              </div>
              <button onClick={onClose} className="text-text-muted hover:text-gold transition-colors text-lg leading-none">✕</button>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-600/5 border border-blue-500/20 mb-3">
              <span className="text-text-secondary text-xs">当前积分</span>
              <span className="text-lg font-bold text-blue-400">{user?.points ?? 0}</span>
            </div>

            <div className="mb-3">
              <p className="text-text-secondary text-[11px] mb-2 font-medium">选择充值金额</p>
              <div className="grid grid-cols-2 gap-2">
                {config?.packages.map((pkg, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-2.5 rounded-lg border text-left relative overflow-hidden ${
                      selectedPackage?.amount === pkg.amount
                        ? 'border-blue-400 bg-blue-500/10'
                        : 'border-white/10 bg-white/[0.03] hover:border-blue-400/50'
                    }`}
                    style={{ transition: 'border-color 0.15s, background-color 0.15s' }}
                  >
                    {pkg.original_price && (
                      <div className="absolute top-1 right-1.5 px-1.5 py-0.5 rounded bg-misfortune/10 text-[10px] text-misfortune/70 line-through font-medium">
                        ¥{pkg.original_price}
                      </div>
                    )}
                    <div className="flex items-baseline gap-1 mb-0.5">
                      <span className={`text-base font-bold ${selectedPackage?.amount === pkg.amount ? 'text-blue-400' : 'text-gold'}`}>¥{pkg.amount}</span>
                      {pkg.limited && <span className="px-1 py-0.5 rounded text-[9px] bg-misfortune/20 text-misfortune">限时</span>}
                    </div>
                    <p className="text-text-muted text-[10px]">{pkg.label}</p>
                    <p className={`text-[11px] mt-0.5 ${selectedPackage?.amount === pkg.amount ? 'text-blue-300' : 'text-text'}`}>
                      {pkg.points} 积分{pkg.bonus ? <span className="text-fortune text-[9px] ml-0.5">+{pkg.bonus}赠送</span> : null}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {selectedPackage && (
              <>
                <div className="mb-3 p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
                  <div className="flex items-center gap-2.5 mb-2 pb-2 border-b border-blue-500/10">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center"><AlipayIcon /></div>
                    <div>
                      <p className="text-blue-400 text-xs font-semibold">支付宝</p>
                      <p className="text-text-muted text-[10px]">安全快捷支付</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted">充值金额</span>
                      <span className="text-gold font-bold">¥{selectedPackage.amount}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted">获得积分</span>
                      <span className="text-fortune font-semibold">
                        {(selectedPackage.points + (selectedPackage.bonus || 0)).toLocaleString()}
                        {selectedPackage.bonus ? <span className="text-[10px] ml-1 opacity-80">（含{selectedPackage.bonus}赠送）</span> : null}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePay}
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#1677FF] to-[#0958d9] text-white hover:from-[#4096ff] hover:to-[#1677FF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      创建订单中...
                    </span>
                  ) : (
                    <span>立即支付 ¥{selectedPackage.amount}</span>
                  )}
                </button>

                <p className="text-text-muted/[0.6] text-[10px] text-center mt-2">🔒 支付由蚂蚁金服提供安全保障</p>
              </>
            )}
          </div>
        </div>
      </div>

      {showQrcodeModal && (
        <div className="modal-overlay--nested"
          onClick={(e) => { if (e.target === e.currentTarget && !paymentSuccess && !paymentExpired) handleCloseQrcodeModal() }}>
          <div className="relative w-full max-w-sm bg-night border border-blue-500/30 rounded-2xl overflow-hidden"
            style={{ transform: 'translateZ(0)', contain: 'layout style paint' }}>
            
            {paymentSuccess && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-emerald-400 text-lg font-bold mb-2">充值成功！</p>
                <p className="text-text-muted text-sm">获得 {selectedPackage?.points} 积分</p>
              </div>
            )}

            {paymentExpired && (
              <div className="p-6 space-y-4">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-misfortune/20 flex items-center justify-center">
                    <svg className="w-7 h-7 text-misfortune" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-misfortune text-base font-bold mb-1">⏰ 支付已过期</p>
                  <p className="text-text-muted text-xs">二维码已失效，请重新下单</p>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-text-muted text-xs text-center mb-1">如有疑问，请联系管理员：</p>
                  <p className="text-gold text-sm font-semibold text-center">微信：Claybur</p>
                </div>
                <button onClick={handleCloseQrcodeModal} className="w-full py-2.5 rounded-xl bg-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-all">返回重试</button>
              </div>
            )}

            {!paymentSuccess && !paymentExpired && (
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <AlipayIcon />
                    <span className="text-gold font-semibold text-base">扫码支付</span>
                  </div>
                  <button onClick={handleCloseQrcodeModal} className="text-text-muted hover:text-gold transition-colors text-lg leading-none">✕</button>
                </div>

                {loadingQrcode ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <span className="w-8 h-8 border-3 border-blue-400 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-text-muted text-sm">正在生成支付二维码...</p>
                  </div>
                ) : qrcodeUrl ? (
                  <>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className={`text-sm font-mono font-bold px-3 py-1 rounded-lg ${countdown <= 60 ? 'bg-misfortune/20 text-misfortune animate-pulse' : 'bg-star/10 text-star'}`}>
                        ⏱ {formatTime(countdown)}
                      </span>
                      <span className="text-text-muted text-xs">内完成支付</span>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
                      <p className="text-gray-700 text-sm font-medium text-center mb-3">请使用支付宝扫码付款</p>
                      <div className="w-48 h-48 mx-auto bg-white rounded-xl p-2 border-2 border-dashed border-gray-200">
                        <img src={qrcodeUrl} alt="支付宝收款码" className="w-full h-full object-contain" />
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-gray-500 text-sm">付款金额：</span>
                          <span className="text-gray-800 text-2xl font-bold">¥{selectedPackage?.amount}</span>
                        </div>
                        <p className="text-gray-400 text-xs text-center mt-1">获得 {(selectedPackage?.points ?? 0) + (selectedPackage?.bonus ?? 0)} 积分</p>
                      </div>
                    </div>

                    <button onClick={handleCloseQrcodeModal} className="w-full py-2.5 rounded-xl bg-white/[0.05] text-text-muted text-sm hover:bg-white/[0.10] transition-all">取消支付</button>

                    <p className="text-text-muted/50 text-[10px] text-center mt-3">订单号：{currentOrderNo}</p>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-misfortune text-base font-bold mb-2">⚠️ 二维码生成失败</p>
                    <p className="text-text-muted text-xs text-center mb-4">无法获取支付二维码，请重试或联系管理员</p>
                    <button onClick={handleCloseQrcodeModal} className="px-6 py-2.5 rounded-xl bg-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-all">返回重试</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}