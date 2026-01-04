import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { YearMonth } from '../lib/entryUtils'

interface YearMonthGroup extends YearMonth {
    count: number
}

interface YearMonthSidebarProps {
    yearGroups: [number, YearMonthGroup[]][]
    selectedYearMonth: YearMonth | null
    onSelectYearMonth: (yearMonth: YearMonth) => void
}

export const YearMonthSidebar = ({ yearGroups, selectedYearMonth, onSelectYearMonth }: YearMonthSidebarProps) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* スマホ版: 折りたたみボタン */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-6 right-4 z-50 p-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg"
            >
                {isOpen ? (
                    <ChevronRight className="w-5 h-5 cursor-pointer" />
                ) : (
                    <ChevronLeft className="w-5 h-5 cursor-pointer" />
                )}
            </button>

            {/* サイドバー */}
            <aside
                className={`w-64 md:w-32 flex-shrink-0 border-l border-gray-200 dark:border-gray-800 pl-6 transition-transform duration-300 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 ${
                    isOpen ? 'fixed md:relative inset-y-0 right-0 bg-white dark:bg-zinc-900 z-40 p-6' : 'md:relative'
                }`}
            >
                <div className="sticky top-6">
                    <nav className="space-y-4">
                        {yearGroups.map(([year, months]) => {
                            const yearTotalCount = months.reduce((sum, m) => sum + m.count, 0)
                            return (
                                <div key={year} className="space-y-1">
                                    <button
                                        onClick={() => {
                                            onSelectYearMonth({ year, month: 0 })
                                            setIsOpen(false)
                                        }}
                                        className={`w-full text-left text-sm font-medium px-2 py-1 rounded transition-colors cursor-pointer ${
                                            selectedYearMonth?.year === year && selectedYearMonth?.month === 0
                                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        {year}年 ({yearTotalCount})
                                    </button>
                                    {months.map((ym) => (
                                        <button
                                            key={`${ym.year}-${ym.month}`}
                                            onClick={() => {
                                                onSelectYearMonth(ym)
                                                setIsOpen(false)
                                            }}
                                            className={`w-full text-left px-2 py-1 rounded text-sm transition-colors cursor-pointer ${
                                                selectedYearMonth?.year === ym.year &&
                                                selectedYearMonth?.month === ym.month
                                                    ? 'bg-gray-200 dark:bg-gray-700 font-medium'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                        >
                                            {ym.month}月({ym.count})
                                        </button>
                                    ))}
                                </div>
                            )
                        })}
                    </nav>
                </div>
            </aside>

            {/* スマホ版: オーバーレイ */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    )
}

