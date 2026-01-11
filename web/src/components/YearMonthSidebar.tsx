import type { YearMonth } from '../lib/entryUtils'

interface YearMonthGroup extends YearMonth {
    count: number
}

interface YearMonthSidebarProps {
    yearGroups: [number, YearMonthGroup[]][]
    selectedYearMonth: YearMonth | null
    onSelectYearMonth: (yearMonth: YearMonth) => void
    isOpen?: boolean
    onClose?: () => void
}

export const YearMonthSidebar = ({ yearGroups, selectedYearMonth, onSelectYearMonth, isOpen = false, onClose }: YearMonthSidebarProps) => {

    return (
        <>
            {/* サイドバー */}
            <aside
                className={`transition-transform duration-300 ${
                    isOpen
                        ? 'fixed inset-y-0 left-0 bg-white z-40 p-6 w-64 translate-x-0 md:relative md:w-32 md:flex-shrink-0 md:border-l md:border-gray-200 md:pl-6 md:translate-x-0 md:z-auto'
                        : 'hidden md:block md:relative md:w-32 md:flex-shrink-0 md:border-l md:border-gray-200 md:pl-6 md:translate-x-0'
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
                                            onClose?.()
                                        }}
                                        className={`w-full text-left text-sm font-medium px-2 py-1 rounded transition-colors cursor-pointer ${
                                            selectedYearMonth?.year === year && selectedYearMonth?.month === 0
                                                ? 'bg-gray-200 text-gray-900'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        {year}年 ({yearTotalCount})
                                    </button>
                                    {months.map((ym) => (
                                        <button
                                            key={`${ym.year}-${ym.month}`}
                                            onClick={() => {
                                                onSelectYearMonth(ym)
                                                onClose?.()
                                            }}
                                            className={`w-full text-left px-2 py-1 rounded text-sm transition-colors cursor-pointer ${
                                                selectedYearMonth?.year === ym.year &&
                                                selectedYearMonth?.month === ym.month
                                                    ? 'bg-gray-200 font-medium'
                                                    : 'text-gray-600 hover:bg-gray-100'
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
                    onClick={() => onClose?.()}
                />
            )}
        </>
    )
}

