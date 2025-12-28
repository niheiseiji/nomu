import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState, useMemo } from 'react'
import { api } from '../lib/api'
import type { JournalEntry } from '../schemas/entry'
import { Button } from '../components/Button'
import { Plus } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { parseEntryDate } from '../lib/dateUtils'
import { YearMonthSidebar, type YearMonth } from '../components/YearMonthSidebar'
import { EntryList } from '../components/EntryList'

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    const [entries, setEntries] = useState<JournalEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedYearMonth, setSelectedYearMonth] = useState<YearMonth | null>(null)
    const { show: showToast } = useToast()

    useEffect(() => {
        fetchEntries()
    }, [])

    useEffect(() => {
        const toastMessage = sessionStorage.getItem('toast_message')
        if (toastMessage) {
            sessionStorage.removeItem('toast_message')
            showToast(toastMessage)
        }
    }, [showToast])

    const fetchEntries = async () => {
        try {
            const res = await api.get<JournalEntry[]>('/entries')
            setEntries(res.data)
        } catch (error) {
            console.error('Failed to fetch entries', error)
        } finally {
            setLoading(false)
        }
    }

    const yearMonthGroups = useMemo(() => {
        const groups = new Map<string, YearMonth & { count: number }>()
        entries.forEach((entry) => {
            const date = parseEntryDate(entry.date)
            if (date) {
                const year = date.getFullYear()
                const month = date.getMonth() + 1
                const key = `${year}-${month}`
                if (!groups.has(key)) {
                    groups.set(key, { year, month, count: 0 })
                }
                groups.get(key)!.count++
            }
        })
        return Array.from(groups.values()).sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year
            return b.month - a.month
        })
    }, [entries])

    const filteredEntries = useMemo(() => {
        if (!selectedYearMonth) return entries
        return entries.filter((entry) => {
            const date = parseEntryDate(entry.date)
            if (!date) return false
            return (
                date.getFullYear() === selectedYearMonth.year &&
                date.getMonth() + 1 === selectedYearMonth.month
            )
        })
    }, [entries, selectedYearMonth])

    const yearGroups = useMemo(() => {
        const groups = new Map<number, (YearMonth & { count: number })[]>()
        yearMonthGroups.forEach((ym) => {
            if (!groups.has(ym.year)) {
                groups.set(ym.year, [])
            }
            groups.get(ym.year)!.push(ym)
        })
        return Array.from(groups.entries()).sort((a, b) => b[0] - a[0])
    }, [yearMonthGroups])

    useEffect(() => {
        if (yearMonthGroups.length > 0 && !selectedYearMonth) {
            setSelectedYearMonth(yearMonthGroups[0])
        }
    }, [yearMonthGroups, selectedYearMonth])

    return (
        <div className="flex gap-6 h-[calc(100vh-4rem)]">
            <YearMonthSidebar
                yearGroups={yearGroups}
                selectedYearMonth={selectedYearMonth}
                onSelectYearMonth={setSelectedYearMonth}
            />

            <main className="flex-1 overflow-y-auto">
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
