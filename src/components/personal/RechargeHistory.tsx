import { useState, useEffect } from 'react'
import { api } from '@/api'

interface RechargeOrder {
  id: number
  amount: number
  points: number
  payment_method: string
  status: string
  order_no?: string | null
  trade_no?: string | null
  voucher_note: string | null
  admin_note: string | null
  processed_by: string | null
  processed_at: string | null
  created_at: string
}

export function RechargeHistory({ onClose }: { onClose: () => void }) {
  const [orders, setOrders] = useState<RechargeOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const res = await api.recharge.history(50)
      setOrders(res.orders)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: '待审核', color: 'text-yellow-400' },
    approved: { label: '已通过', color: 'text-emerald-400' },
    rejected: { label: '已拒绝', color: 'text-misfortune' },
  }

  const paymentMap: Record<string, string> = {
    wechat: '微信支付',
    alipay: '支付宝',
  }

  return (
    <div className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="
        relative w-full max-w-sm max-h-[90vh] flex flex-col
        bg-night/95
        border border-gold/20 rounded-2xl
        animate-fade-in
      ">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

        {/* 固定标题栏 */}
        <div className="flex-shrink-0 p-4 xs:p-5 pb-3 border-b border-white/[0.06] rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gold" style={{ fontFamily: 'var(--font-serif)' }}>
              充值记录
            </h2>
            <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-gold hover:bg-white/[0.08] transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 滚动内容区 */}
        <div className="flex-1 overflow-y-auto p-4 xs:p-5 pt-3">
          {loading ? (
            <div className="text-center py-8 text-text-muted text-sm">加载中...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-text-muted text-sm">暂无充值记录</div>
          ) : (
            <div className="space-y-2">
              {orders.map((order) => {
                const status = statusMap[order.status] || { label: order.status, color: 'text-text-muted' }
                return (
                  <div
                    key={order.id}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-text-secondary text-sm">
                        ¥{order.amount} → {order.points} 积分
                      </span>
                      <span className={`text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <span>
                        {paymentMap[order.payment_method] || order.payment_method}
                        {order.trade_no && (
                          <span className="ml-1.5 text-text-secondary/70 font-mono text-[10px]">
                            {order.trade_no.slice(-8)}
                          </span>
                        )}
                      </span>
                      <span>{order.created_at?.slice(0, 16)}</span>
                    </div>
                    {order.voucher_note && (
                      <p className="text-[10px] text-text-muted mt-1.5">备注: {order.voucher_note}</p>
                    )}
                    {order.admin_note && (
                      <p className="text-[10px] text-text-muted mt-1">管理员: {order.admin_note}</p>
                    )}
                    {order.processed_at && (
                      <p className="text-[10px] text-text-muted mt-1">
                        处理时间: {order.processed_at.slice(0, 16)}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
