import { useMemo, useState, useRef, useEffect } from 'react'

interface ContributionBoxProps {
    entries: Array<{ date: string }>
}

interface TooltipCellProps {
    formattedDate: string
    hasEntry: boolean
}

const TooltipCell = ({ formattedDate, hasEntry }: TooltipCellProps) => {
    const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number; showBelow: boolean } | null>(null)
    const [isHovered, setIsHovered] = useState(false)
    const cellRef = useRef<HTMLDivElement>(null)

    const handleMouseEnter = () => {
        if (cellRef.current) {
            const rect = cellRef.current.getBoundingClientRect()
            const cellCenterX = rect.left + rect.width / 2
            const margin = 8
            const tooltipHeight = 24
            const estimatedTooltipWidth = 180
            
            let top = rect.top - tooltipHeight - margin + 10
            let showBelow = false
            
            if (top < margin) {
                top = rect.bottom + margin
                showBelow = true
            }
            
            let left = cellCenterX
            const minLeft = margin + estimatedTooltipWidth / 2
            const maxLeft = window.innerWidth - margin - estimatedTooltipWidth / 2
            
            if (left < minLeft) {
                left = minLeft
            } else if (left > maxLeft) {
                left = maxLeft
            }
            
            setTooltipPosition({ 
                top, 
                left, 
                showBelow 
            })
            setIsHovered(true)
        }
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        setTooltipPosition(null)
    }

    useEffect(() => {
        return () => {
            setIsHovered(false)
            setTooltipPosition(null)
        }
    }, [])

    return (
        <>
            <div
                ref={cellRef}
                className="relative group"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div
                    className={`w-[10px] h-[10px] rounded-sm border border-black dark:border-white ${
                        hasEntry ? 'bg-black' : 'bg-white'
                    }`}
                />
            </div>
            {isHovered && tooltipPosition && (
                <div
                    className="fixed px-2 py-1 bg-gray-600 text-white text-xs rounded whitespace-nowrap pointer-events-none z-50 shadow-lg"
                    style={{
                        top: `${tooltipPosition.top}px`,
                        left: `${tooltipPosition.left}px`,
                        transform: 'translateX(-50%)',
                    }}
                >
                    {formattedDate}: {hasEntry ? '記録あり' : '記録なし'}
                    {tooltipPosition.showBelow ? (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full border-4 border-transparent border-b-gray-600" />
                    ) : (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-4 border-transparent border-t-gray-600" />
                    )}
                </div>
            )}
        </>
    )
}

export const ContributionBox = ({ entries }: ContributionBoxProps) => {
    const contributionData = useMemo(() => {
        const currentYear = new Date().getFullYear()
        const startDate = new Date(currentYear, 0, 1) // 1月1日
        const endDate = new Date(currentYear, 11, 31) // 12月31日
        
        // エントリーの日付をSetに変換（高速検索用）
        // "2026-01-04" -> "20260104" に正規化
        const entryDates = new Set(
            entries.map(entry => entry.date.replace(/-/g, ''))
        )
        
        // 1月1日から12月31日までの全日付を生成
        const days: Array<{ date: string; hasEntry: boolean; dayOfWeek: number }> = []
        const currentDate = new Date(startDate)
        
        while (currentDate <= endDate) {
            const dateStr = `${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}${String(currentDate.getDate()).padStart(2, '0')}`
            const dayOfWeek = currentDate.getDay() // 0=日曜, 1=月曜, ..., 6=土曜
            const hasEntry = entryDates.has(dateStr)
            
            days.push({
                date: dateStr,
                hasEntry,
                dayOfWeek
            })
            
            currentDate.setDate(currentDate.getDate() + 1)
        }
        
        return days
    }, [entries])

    // 週ごとにグループ化（月曜始まり）
    const weeks = useMemo(() => {
        const result: Array<Array<{ date: string; hasEntry: boolean } | null>> = []
        
        // 最初の日が何曜日か確認（0=日曜, 1=月曜, ..., 6=土曜）
        const firstDayOfWeek = contributionData[0]?.dayOfWeek ?? 1
        
        // 月曜始まりに調整（月曜=0, 日曜=6）
        const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
        
        // 最初の週を作成（月曜日までの空白を埋める）
        let currentWeek: Array<{ date: string; hasEntry: boolean } | null> = Array(7).fill(null)
        let dayIndex = 0
        
        for (let i = adjustedFirstDay; i < 7 && dayIndex < contributionData.length; i++) {
            const dayData = contributionData[dayIndex]
            currentWeek[i] = {
                date: dayData.date,
                hasEntry: dayData.hasEntry
            }
            dayIndex++
        }
        result.push(currentWeek)
        
        // 残りの日付を週ごとに配置
        while (dayIndex < contributionData.length) {
            currentWeek = Array(7).fill(null)
            for (let i = 0; i < 7 && dayIndex < contributionData.length; i++) {
                const dayData = contributionData[dayIndex]
                currentWeek[i] = {
                    date: dayData.date,
                    hasEntry: dayData.hasEntry
                }
                dayIndex++
            }
            result.push(currentWeek)
        }
        
        return result
    }, [contributionData])

    // 月ラベルの位置を計算
    const monthLabels = useMemo(() => {
        const labels: Array<{ weekIndex: number; month: string }> = []
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        let lastMonth = -1
        
        weeks.forEach((week, weekIndex) => {
            // 週の最初の有効な日を確認（月曜日から順に探す）
            let firstDayInWeek: { date: string } | null = null
            for (let i = 0; i < 7; i++) {
                if (week[i] !== null) {
                    firstDayInWeek = week[i]
                    break
                }
            }
            
            if (firstDayInWeek) {
                const month = parseInt(firstDayInWeek.date.slice(4, 6)) - 1 // 0-11
                // 月が変わった場合、または最初の週の場合にラベルを追加
                if (month !== lastMonth || weekIndex === 0) {
                    labels.push({ weekIndex, month: monthNames[month] })
                    lastMonth = month
                }
            }
        })
        
        return labels
    }, [weeks])

    const currentYear = new Date().getFullYear()

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-md max-w-[750px]">
            <h3 className="text-lg font-semibold mb-1">
                {currentYear}年の記録
            </h3>
            <div className="overflow-x-auto overflow-y-hidden max-w-[750px]">
                <div className="relative">
                    {/* 月ラベル */}
                    <div className="flex gap-[3px]" style={{ paddingLeft: '24px' }}>
                        {weeks.map((_, weekIndex) => {
                            const monthLabel = monthLabels.find(label => label.weekIndex === weekIndex)
                            return (
                                <div key={weekIndex} className="flex flex-col" style={{ width: '13px' }}>
                                    {monthLabel && (
                                        <div className="text-xs text-gray-600 dark:text-gray-400 h-[10px] flex items-center">
                                            {monthLabel.month}
                                        </div>
                                    )}
                                    {!monthLabel && <div className="h-[10px]" />}
                                </div>
                            )
                        })}
                    </div>
                    
                    {/* カレンダーグリッド */}
                    <div className="inline-flex gap-[3px] min-w-[600px] max-w-[600px]">
                        {/* 曜日ラベル列 */}
                        <div className="flex flex-col gap-[3px] mr-1">
                            {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                                const dayLabels: { [key: number]: string } = { 0: 'Mon', 2: 'Wed', 4: 'Fri', 6: 'Sun' }
                                const label = dayLabels[dayIndex]
                                return (
                                    <div key={dayIndex} className="flex items-center h-[10px]">
                                        {label && (
                                            <span className="text-xs text-gray-600 dark:text-gray-400 pr-1">
                                                {label}
                                            </span>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                        
                        {/* 週の列 */}
                        {weeks.map((week, weekIndex) => (
                            <div key={weekIndex} className="flex flex-col gap-[3px]">
                                {week.map((day, dayIndex) => {
                                    if (day === null) {
                                        return (
                                            <div
                                                key={`${weekIndex}-${dayIndex}`}
                                                className="w-[10px] h-[10px] rounded-sm border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-800"
                                            />
                                        )
                                    }
                                    
                                    const formattedDate = `${day.date.slice(0, 4)}-${day.date.slice(4, 6)}-${day.date.slice(6, 8)}`
                                    
                                    return (
                                        <TooltipCell
                                            key={`${weekIndex}-${dayIndex}`}
                                            formattedDate={formattedDate}
                                            hasEntry={day.hasEntry}
                                        />
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

