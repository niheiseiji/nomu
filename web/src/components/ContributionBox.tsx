import { useMemo, useState, useRef, useEffect } from 'react'

interface ContributionBoxProps {
    entries: Array<{ date: string }>
}

interface TooltipCellProps {
    formattedDate: string
    hasEntry: boolean
}

const getSeasonImage = (dateStr: string): string => {
    // formattedDate: "2026-01-04" -> 月を抽出
    const month = parseInt(dateStr.split('-')[1], 10)
    if (month >= 1 && month <= 3) {
        return '/ume_red.png' // winter
    } else if (month >= 4 && month <= 6) {
        return '/sakura_pink.png' // spring
    } else if (month >= 7 && month <= 9) {
        return '/himawari_01.png' // summer
    } else {
        return '/cosmos_blue.png' // autumn
    }
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
                <div className={`w-[10px] h-[10px] rounded-sm bg-white overflow-hidden ${
                    hasEntry ? '' : 'border border-black'
                }`}>
                    {hasEntry && (
                        <img
                            src={getSeasonImage(formattedDate)}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
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

    // 月ラベルの位置を計算（各月の1日が存在する週の列を基準にする）
    const monthLabels = useMemo(() => {
        const labels: Array<{ weekIndex: number; month: string }> = []
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        
        // 各月の1日がどの週の列にあるかを探す
        for (let month = 0; month < 12; month++) {
            const targetDate = `${new Date().getFullYear()}${String(month + 1).padStart(2, '0')}01`
            
            weeks.forEach((week, weekIndex) => {
                const hasFirstDay = week.some(day => day !== null && day.date === targetDate)
                if (hasFirstDay) {
                    labels.push({ weekIndex, month: monthNames[month] })
                }
            })
        }
        
        return labels
    }, [weeks])

    const currentYear = new Date().getFullYear()

    return (
        <div className="bg-ios-bg-light rounded-md max-w-[750px] p-1">
            <h3 className="text-lg font-semibold mb-1">
                {currentYear}年の記録
            </h3>
            <div className="overflow-x-auto max-w-[750px]" style={{ overflowY: 'visible' }}>
                <div className="relative pt-[18px] pb-2">
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
                                            <span className="text-xs text-gray-600 pr-1">
                                                {label}
                                            </span>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                        
                        {/* 週の列 */}
                        {weeks.map((week, weekIndex) => {
                            const monthLabel = monthLabels.find(label => label.weekIndex === weekIndex)
                            return (
                                <div key={weekIndex} className="flex flex-col gap-[3px] relative">
                                    {/* 月名ラベル行（絶対配置でブロックをはみ出す） */}
                                    {monthLabel && (
                                        <div className="absolute -top-[18px] left-0 text-xs text-gray-600 whitespace-nowrap pointer-events-none">
                                            {monthLabel.month}
                                        </div>
                                    )}
                                    {/* 日付セル */}
                                    {week.map((day, dayIndex) => {
                                        if (day === null) {
                                            return (
                                                <div
                                                    key={`${weekIndex}-${dayIndex}`}
                                                    className="w-[10px] h-[10px] rounded-sm border border-gray-300 bg-gray-200"
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
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

