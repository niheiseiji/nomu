import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '../components/Button'
import { Plus } from 'lucide-react'
import { YearMonthSidebar } from '../components/YearMonthSidebar'
import { EntryList } from '../components/EntryList'
import { useEntries, useYearMonthFilter } from '../hooks/useEntries'
import { useToastMessage } from '../hooks/useToastMessage'

const Index = () => {
    const { entries, loading } = useEntries()
    const { selectedYearMonth, setSelectedYearMonth, yearGroups, filteredEntries } = useYearMonthFilter(entries)
    useToastMessage()

    return (
        <div className="flex gap-6 min-h-screen max-w-screen-xl mx-auto px-4 py-6">
            <YearMonthSidebar
                yearGroups={yearGroups}
                selectedYearMonth={selectedYearMonth}
                onSelectYearMonth={setSelectedYearMonth}
            />

            <main className="flex-1 min-w-0">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold tracking-tight">nomu</h1>
                        <Link to="/create">
                            <Button className="rounded-full w-10 h-10 p-0 shadow-lg">
                                <Plus className="w-6 h-6" />
                            </Button>
                        </Link>
                    </div>

                    <EntryList entries={filteredEntries} loading={loading} />
                </div>
            </main>
        </div>
    )
}

export const Route = createFileRoute('/')({
    component: Index,
})
