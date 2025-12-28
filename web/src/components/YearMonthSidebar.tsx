import type { JournalEntry } from '../schemas/entry'

export interface YearMonth {
    year: number
    month: number
}

interface YearMonthGroup extends YearMonth {
    count: number
}

interface YearMonthSidebarProps {
    yearGroups: [number, YearMonthGroup[]][]
    selectedYearMonth: YearMonth | null
    onSelectYearMonth: (yearMonth: YearMonth) => void
}

export function YearMonthSidebar({ yearGroups, selectedYearMonth, onSelectYearMonth }: YearMonthSidebarProps) {
    return (
        <aside className="w-64 flex-shrink-0 overflow-y-auto border-r border-gray-200 dark:border-gray-800 pr-4">
            <div className="sticky top-0 pt-6 pb-4">
                <h2 className="text-lg font-semibold mb-4">月別一覧</h2>
                <nav className="space-y-4">
                    {yearGroups.map(([year, months]) => (
                        <div key={year} className="space-y-1">
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2 py-1">
                                {year}
                            </div>
                            {months.map((ym) => (
                                <button
                                    key={`${ym.year}-${ym.month}`}
                                    onClick={() => onSelectYearMonth(ym)}
                                    className={`w-full text-left px-2 py-1 rounded text-sm transition-colors ${
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
                    ))}
                </nav>
            </div>
        </aside>
    )
}

