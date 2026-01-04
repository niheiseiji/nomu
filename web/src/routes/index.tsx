import { createFileRoute } from '@tanstack/react-router'
import { YearMonthSidebar } from '../components/YearMonthSidebar'
import { EntryList } from '../components/EntryList'
import { ContributionBox } from '../components/ContributionBox'
import { AppTitle } from '../components/AppTitle'
import { CreateButton } from '../components/CreateButton'
import { useEntries, useYearMonthFilter } from '../hooks/useEntries'
import { useToastMessage } from '../hooks/useToastMessage'

const Index = () => {
    const { entries, loading } = useEntries()
    const { selectedYearMonth, setSelectedYearMonth, yearGroups, filteredEntries } = useYearMonthFilter(entries)
    useToastMessage()

    return (
        <div className="flex max-w-7xl w-full gap-6">
            {/* 左サイド */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                    <AppTitle />
                    <CreateButton />
                </div>
                {!loading && entries.length > 0 && (
                    <div>
                        <ContributionBox entries={entries} />
                    </div>
                )}
                <EntryList entries={filteredEntries} loading={loading} />
            </div>
            {/* 右サイド */}
            <div className="flex-shrink-0">
                <YearMonthSidebar
                    yearGroups={yearGroups}
                    selectedYearMonth={selectedYearMonth}
                    onSelectYearMonth={setSelectedYearMonth}
                /></div>
        </div>
    )
}

export const Route = createFileRoute('/')({
    component: Index,
})
