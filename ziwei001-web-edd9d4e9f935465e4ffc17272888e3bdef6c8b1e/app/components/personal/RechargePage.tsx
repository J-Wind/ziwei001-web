import { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '@/stores'
import { api } from '@/api'

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
  <svg viewBox="0 0 1024 1024" className="w-6 h-6" fill="currentColor">
    <path d="M230.4 460.8c-51.2 0-89.6 38.4-89.6 89.6s38.4 89.6 89.6 89.6 89.6-38.4 89.6-89.6-38.4-89.6-89.6-89.6z m563.2 0c-51.2 0-89.6 38.4-89.6 89.6s38.4 89.6 89.6 89.6 89.6-38.4 89.6-89.6-38.4-89.6-89.6-89.6z" fill="#1677FF"/>
    <path d="M512 0C229.2 0 0 229.2 0 512s229.2 512 512 512 512-229.2 512-512S794.8 0 512 0zm281.6 665.6c-25.6 44.8-64 76.8-115.2 89.6-19.2 6.4-38.4 12.8-57.6 12.8H403.2c-89.6 0-166.4-57.6-185.6-140.8-6.4-32-6.4-64 0-96C243.2 454.4 294.4 390.4 364.8 358.4c38.4-19.2 83.2-25.6 128-25.6h38.4c44.8 0 89.6 6.4 128 25.6 70.4 32 121.6 96 147.2 172.8 6.4 32 6.4 64 0 96-6.4 12.8-12.8 25.6-12.8 38.4z" fill="#1677FF"/>
  </svg>
)

export function RechargePage({ onClose }: { onClose: () => void }) {
  const { user, refreshUser } = useAuthStore()
  const [config, setConfig] = useState<RechargeConfig | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<RechargePackage | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [currentOrderNo, setCurrentOrderNo] = useState<string | null>(null)
  const [orderStatus, setOrderStatus] = useState<string | null>(null)
  const [qrcodeUrl, setQrcodeUrl] = useState<string | null>(null)
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    loadConfig()
    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current)
      }
    }
  }, [])

  const loadConfig = async () => {
    try {
      const data = await api.recharge.getConfig()
      setConfig(data)
    } catch {
      setErrorMsg('加载充值配置失败')
    }
  }

  // 轮询订单状态
  const startPolling = (orderNo: string) => {
    setCurrentOrderNo(orderNo)
    setOrderStatus('pending')
    
    pollTimerRef.current = setInterval(async () => {
      try {
        const data = await api.recharge.zpayQuery(orderNo)
        setOrderStatus(data.status)
        
        if (data.status === 'approved') {
          if (pollTimerRef.current) {
            clearInterval(pollTimerRef.current)
            pollTimerRef.current = null
          }
          setSuccessMsg(`✅ 充值成功！获得 ${data.points} 积分`)
          refreshUser()
          
          setTimeout(() => {
            onClose()
          }, 3000)
        }
      } catch {
        // 忽略轮询错误
      }
    }, 3000)
  }

  const handlePay = async () => {
    if (!selectedPackage) {
      setErrorMsg('请选择充值套餐')
      return
    }

    setSubmitting(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const result = await api.recharge.zpayCreate({
        amount: selectedPackage.amount,
        points: selectedPackage.points,
        type: 'alipay',
      })
      
      if (result.success && result.orderNo) {
        startPolling(result.orderNo)
        
        // 显示二维码或跳转链接
        if (result.qrcode || result.img) {
          setQrcodeUrl(result.img || result.qrcode)
        }
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : '创建订单失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="
        relative w-full max-w-md max-h-[90vh] overflow-y-auto
        bg-gradient-to-br from-[#121228] to-[#0a0a15]
        backdrop-blur-xl border border-gold/20 rounded-2xl
        shadow-[0_8px_40px_rgba(0,0,0,0.5)]
      ">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

        <div className="p-6">
          {/* 标题栏 */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <AlipayIcon />
              <h2 className="text-lg font-semibold text-gold" style={{ fontFamily: 'var(--font-serif)' }}>
                支付宝充值
              </h2>
            </div>
            <button onClick={onClose} className="text-text-muted hover:text-gold transition-colors text-xl leading-none">
              ✕
            </button>
          </div>

          {/* 当前积分 */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-600/5 border border-blue-500/20 mb-5">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-sm">当前积分</span>
              <span className="text-xl font-bold text-blue-400">{user?.points ?? 0}</span>
            </div>
          </div>

          {/* 成功提示 */}
          {successMsg && (
            <div className="p-4 mb-4 rounded-xl bg-fortune/10 border border-fortune/30 animate-pulse">
              <p className="text-fortune text-sm font-medium text-center">{successMsg}</p>
            </div>
          )}

          {/* 错误提示 */}
          {errorMsg && (
            <div className="p-3 mb-4 rounded-xl bg-misfortune/10 border border-misfortune/30">
              <p className="text-misfortune text-xs">{errorMsg}</p>
            </div>
          )}

          {/* 订单状态 + 二维码显示 */}
          {currentOrderNo && orderStatus === 'pending' && qrcodeUrl && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-star/10 border border-star/30 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="w-4 h-4 border-2 border-star border-t-transparent rounded-full animate-spin" />
                  <p className="text-star text-sm font-medium">等待支付中...</p>
                </div>
                <p className="text-text-muted text-xs">订单号：{currentOrderNo}</p>
              </div>

              {/* 二维码区域 */}
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <p className="text-gray-700 text-sm font-medium text-center mb-3">
                  请使用支付宝扫码付款
                </p>
                <div className="w-52 h-52 mx-auto bg-white rounded-xl p-2 border-2 border-dashed border-gray-200">
                  <img 
                    src={qrcodeUrl} 
                    alt="支付宝收款码" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-gray-500 text-xs text-center mt-3">
                  金额：¥{selectedPackage?.amount}
                </p>
              </div>

              <button 
                onClick={() => window.open(qrcodeUrl, '_blank')}
                className="w-full py-2.5 rounded-xl bg-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-all"
              >
                打开大图扫码
              </button>
            </div>
          )}

          {!currentOrderNo && (
            <>
              {/* 套餐选择 */}
              <div className="mb-5">
                <p className="text-text-secondary text-xs mb-3 font-medium">选择充值金额</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {config?.packages.map((pkg, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`
                        p-3.5 rounded-xl border transition-all text-left relative group
                        ${selectedPackage?.amount === pkg.amount
                          ? 'border-blue-400 bg-blue-500/10 shadow-lg shadow-blue-500/20 scale-[1.02]'
                          : 'border-white/10 bg-white/[0.03] hover:border-blue-400/50 hover:bg-white/[0.05]'
                        }
                      `}
                    >
                      {pkg.original_price && (
                        <div className="absolute top-1.5 right-1.5 text-[10px] text-text-muted/50 line-through">
                          ¥{pkg.original_price}
                        </div>
                      )}
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className={`text-xl font-bold ${selectedPackage?.amount === pkg.amount ? 'text-blue-400' : 'text-gold'}`}>
                          ¥{pkg.amount}
                        </span>
                        {pkg.limited && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-misfortune/20 text-misfortune">
                            限时
                          </span>
                        )}
                      </div>
                      <p className="text-text-muted text-[11px]">{pkg.label}</p>
                      <p className={`text-xs mt-1 ${selectedPackage?.amount === pkg.amount ? 'text-blue-300' : 'text-text'}`}>
                        {pkg.points} 积分
                        {pkg.bonus && (
                          <span className="text-fortune text-[10px] ml-1">
                            +{pkg.bonus}赠送
                          </span>
                        )}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 支付信息卡片 */}
              {selectedPackage && (
                <>
                  <div className="mb-5 p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-blue-500/10">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <AlipayIcon />
                      </div>
                      <div>
                        <p className="text-blue-400 text-sm font-semibold">支付宝</p>
                        <p className="text-text-muted text-[11px]">安全快捷支付</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-muted">充值金额</span>
                        <span className="text-gold font-bold">¥{selectedPackage.amount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-muted">获得积分</span>
                        <span className="text-fortune font-semibold">
                          {selectedPackage.points}
                          {selectedPackage.bonus && (
                            <span className="text-[11px] ml-1 opacity-80">
                              （含{selectedPackage.bonus}赠送）
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 立即支付按钮 */}
                  <button
                    onClick={handlePay}
                    disabled={submitting}
                    className="
                      w-full py-3.5 rounded-xl text-base font-bold
                      bg-gradient-to-r from-[#1677FF] to-[#0958d9]
                      text-white
                      hover:from-[#4096ff] hover:to-[#1677FF]
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-200
                      shadow-lg shadow-blue-500/30
                      active:scale-[0.98]
                    "
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        创建订单中...
                      </span>
                    ) : (
                      `立即支付 ¥${selectedPackage.amount}`
                    )}
                  </button>

                  <p className="text-text-muted text-[11px] text-center mt-3">
                    🔒 支付由 Zpay 提供安全保障
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}