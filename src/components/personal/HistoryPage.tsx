import { useState, useEffect } from 'react'
import { api } from '@/api'
import type { HistoryEntry } from '@/api'

const TYPE_MAP: Record<string, { label: string; icon: string }> = {
  chart: { label: '排盘解读', icon: '🔮' },
  fortune: { label: '年度运势', icon: '📅' },
  kline: { label: '人生K线', icon: '📈' },
  match: { label: '双人合盘', icon: '💑' },
}

interface HistoryPageProps {
  onClose: () => void
}

export function HistoryPage({ onClose }: HistoryPageProps) {
  const [histories, setHistories] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState('')
  const [selectedHistory, setSelectedHistory] = useState<HistoryEntry | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)

  useEffect(() => {
    loadHistories()
  }, [selectedType])

  const loadHistories = async () => {
    setLoading(true)
    try {
      const res = await api.user.history.list(selectedType)
      setHistories(res.histories)
    } catch (err) {
      console.error('加载历史记录失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    setDeleteTargetId(id)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    if (!deleteTargetId) return
    setShowDeleteConfirm(false)
    setDeleting(deleteTargetId)
    try {
      await api.user.history.delete(deleteTargetId)
      if (selectedHistory?.id === deleteTargetId) {
        setSelectedHistory(null)
      }
      await loadHistories()
    } catch (err) {
      console.error('删除失败:', err)
      alert('删除失败，请重试')
    } finally {
      setDeleting(null)
      setDeleteTargetId(null)
    }
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false)
    setDeleteTargetId(null)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const renderBoldText = (text: string) => {
    const parts = text.split(/\*\*(.+?)\*\*/g)
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <span key={i} className="text-gold font-medium">{part}</span>
      }
      return <span key={i}>{part}</span>
    })
  }

  const renderContent = (history: HistoryEntry) => {
    const lines = history.content.split('\n')
    return (
      <div className="space-y-3">
        {lines.map((line, i) => {
          if (line.startsWith('### ')) {
            return (
              <h4 key={i} className="text-gold font-semibold text-base mt-4 mb-2">
                {renderBoldText(line.replace('### ', ''))}
              </h4>
            )
          }
          if (line.startsWith('## ')) {
            return (
              <h3 key={i} className="text-gold font-semibold text-base mt-4 mb-2">
                {renderBoldText(line.replace('## ', ''))}
              </h3>
            )
          }
          if (line.startsWith('# ')) {
            return (
              <h2 key={i} className="text-gold font-semibold text-lg mt-4 mb-2">
                {renderBoldText(line.replace('# ', ''))}
              </h2>
            )
          }
          if (/^\s*[*-]\s+/.test(line)) {
            const content = line.replace(/^\s*[*-]\s+/, '')
            return (
              <li key={i} className="text-text-secondary text-sm ml-4 list-disc">
                {renderBoldText(content)}
              </li>
            )
          }
          if (line.trim() === '') {
            return <div key={i} className="h-2" />
          }
          return (
            <p key={i} className="text-text-secondary text-sm leading-relaxed">
              {renderBoldText(line)}
            </p>
          )
        })}
      </div>
    )
  }

  if (showDeleteConfirm) {
    return (
      <div className="modal-overlay"
        onClick={(e) => e.target === e.currentTarget && cancelDelete()}>
        <div className="
          relative w-full max-w-sm
          bg-night/80 bg-night/95
          border border-gold/20 rounded-2xl
          animate-fade-in
        ">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

          <div className="p-6 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gold mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
              确认删除
            </h3>
            <p className="text-text-secondary text-sm mb-6">
              删除后无法恢复，确定要删除这条记录吗？
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="
                  flex-1 py-3 rounded-xl text-sm font-medium
                  bg-white/10 text-text-secondary
                  hover:bg-white/15
                  transition-all duration-200
                "
              >
                取消
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting === deleteTargetId}
                className="
                  flex-1 py-3 rounded-xl text-sm font-medium
                  bg-gradient-to-r from-misfortune to-misfortune/80
                  text-white
                  hover:from-misfortune/90 hover:to-misfortune/70
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                "
              >
                {deleting === deleteTargetId ? '删除中...' : '确认删除'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (selectedHistory) {
    const typeInfo = TYPE_MAP[selectedHistory.type] || { label: selectedHistory.type, icon: '📝' }
    return (
      <div className="modal-overlay"
        onClick={(e) => e.target === e.currentTarget && setSelectedHistory(null)}>
        <div className="
          relative w-full max-w-2xl max-h-[90vh] flex flex-col
          bg-night/80 bg-night/95
          border border-gold/20 rounded-2xl
          animate-fade-in
        ">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

          {/* 固定标题区 */}
          <div className="flex-shrink-0 bg-night/70 bg-night/95 p-3 xs:p-4 pb-2 xs:pb-3 border-b border-white/[0.06] rounded-t-2xl">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm sm:text-base font-semibold text-gold flex items-center gap-1.5 truncate" style={{ fontFamily: 'var(--font-serif)' }}>
                <span className="flex-shrink-0 text-xs sm:text-sm">{typeInfo.icon}</span>
                <span className="truncate">{selectedHistory.title || typeInfo.label}</span>
              </h2>
              <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                <button
                  onClick={() => handleDelete(selectedHistory.id)}
                  disabled={deleting === selectedHistory.id}
                  className="p-1.5 rounded-lg bg-misfortune/20 text-misfortune hover:bg-misfortune/30 transition-all disabled:opacity-50 hover:scale-105"
                  title="删除记录"
                >
                  {deleting === selectedHistory.id ? (
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => setSelectedHistory(null)}
                  className="text-text-muted hover:text-gold transition-colors text-base p-1 rounded hover:bg-white/5"
                >
                  ✕
                </button>
              </div>
            </div>

            <p className="text-text-muted text-[10px] mb-1.5">{formatDate(selectedHistory.created_at)}</p>

            {selectedHistory.birth_info && (
              <div className="text-[11px] text-text-muted space-y-0.5">
                <p>出生：{selectedHistory.birth_info.year}年{selectedHistory.birth_info.month}月{selectedHistory.birth_info.day}日 {selectedHistory.birth_info.hour}时</p>
                <p>性别：{selectedHistory.birth_info.gender === 'male' ? '男' : '女'}</p>
              </div>
            )}
          </div>

          {/* 滚动内容区 */}
          <div className="flex-1 overflow-y-auto p-3 xs:p-4 sm:p-5 pt-2 xs:pt-3">
            <div className="prose prose-invert max-w-none prose-p:text-xs sm:prose-p:text-sm prose-headings:text-xs sm:prose-headings:text-sm prose-li:text-xs sm:prose-li:text-sm">
              {renderContent(selectedHistory)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="
        relative w-full max-w-sm max-h-[90vh] flex flex-col
        bg-night/80 bg-night/95
        border border-gold/20 rounded-2xl
        animate-fade-in
      ">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

        {/* 固定标题栏 */}
        <div className="flex-shrink-0 p-4 xs:p-5 pb-3 border-b border-white/[0.06] rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gold" style={{ fontFamily: 'var(--font-serif)' }}>
              历史记录
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
          {/* 类型筛选 */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setSelectedType('')}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                selectedType === ''
                  ? 'bg-gold/20 text-gold border border-gold/30'
                  : 'bg-white/5 text-text-muted border border-white/10 hover:border-gold/30'
              }`}
            >
              全部
            </button>
            {Object.entries(TYPE_MAP).map(([key, { label, icon }]) => (
              <button
                key={key}
                onClick={() => setSelectedType(key)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  selectedType === key
                    ? 'bg-gold/20 text-gold border border-gold/30'
                    : 'bg-white/5 text-text-muted border border-white/10 hover:border-gold/30'
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          {/* 历史记录列表 */}
          {loading ? (
            <div className="flex justify-center py-8">
              <span className="w-6 h-6 border-2 border-gold/50 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : histories.length === 0 ? (
            <div className="text-center py-8 text-text-muted text-sm">
              暂无历史记录
            </div>
          ) : (
            <div className="space-y-2">
              {histories.map(h => {
                const typeInfo = TYPE_MAP[h.type] || { label: h.type, icon: '📝' }
                return (
                  <button
                    key={h.id}
                    onClick={() => setSelectedHistory(h)}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 transition-all text-left"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-base flex-shrink-0 mt-0.5">{typeInfo.icon}</span>
                        <p className="text-text text-xs font-medium leading-tight break-words">{h.title || typeInfo.label}</p>
                      </div>
                      <span className="text-text-muted text-[11px] whitespace-nowrap flex-shrink-0 mt-0.5">{formatDate(h.created_at)}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
