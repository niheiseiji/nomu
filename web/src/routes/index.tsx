import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { YearMonthSidebar } from '../components/YearMonthSidebar'
import { EntryList } from '../components/EntryList'
import { ContributionBox } from '../components/ContributionBox'
import { AppTitle } from '../components/AppTitle'
import { CreateButton } from '../components/CreateButton'
import { useEntries, useYearMonthFilter } from '../hooks/useEntries'
import { useToastMessage } from '../hooks/useToastMessage'
import { GardenButton } from '../components/GardenButton'
import { UserIcon } from '../components/UserIcon'

const Index = () => {
    const { entries, loading } = useEntries()
    const { selectedYearMonth, setSelectedYearMonth, yearGroups, filteredEntries } = useYearMonthFilter(entries)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    useToastMessage()

    return (
        <div className="flex max-w-7xl w-full">
            {/* 左サイド */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between mt-1">
                    <AppTitle />
                    <div className="flex gap-2 items-center">
                        <div className="hidden md:flex gap-2 items-center">
                            <GardenButton />
                            <CreateButton />
                        </div>
                        <UserIcon />
                        {/* スマホ版: 「=」ボタン */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                {/* スマホ版: フロートボタン */}
                <div className="md:hidden fixed bottom-6 right-6 flex flex-col gap-3 z-40">
                    <GardenButton />
                    <CreateButton />
                </div>
                {!loading && entries.length > 0 && (
                    <div className="mb-2">
                        <ContributionBox entries={entries} />
                    </div>
                )}
                <EntryList entries={filteredEntries} loading={loading} />
            </div>
            {/* 右サイド */}
            <div className="hidden md:block flex-shrink-0">
                <YearMonthSidebar
                    yearGroups={yearGroups}
                    selectedYearMonth={selectedYearMonth}
                    onSelectYearMonth={setSelectedYearMonth}
                />
            </div>
            {/* スマホ版: YearMonthSidebarはfixedポジションで表示 */}
            <div className="md:hidden">
                <YearMonthSidebar
                    yearGroups={yearGroups}
                    selectedYearMonth={selectedYearMonth}
                    onSelectYearMonth={setSelectedYearMonth}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
            </div>
        </div>
    )
}

export const Route = createFileRoute('/')({
    component: Index,
})
