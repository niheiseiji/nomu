import { useState, useEffect, useMemo } from 'react'
import { api } from '../lib/api'
import type { JournalEntry } from '../schemas/entry'
import { groupEntriesByYearMonth, groupYearMonthsByYear, filterEntriesByYearMonth, type YearMonth } from '../lib/entryUtils'

/**
 * エントリーを取得する
 */
export const useEntries = (): { entries: JournalEntry[]; loading: boolean } => {
    const [entries, setEntries] = useState<JournalEntry[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchEntries()
    }, [])

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

    return { entries, loading }
}

export const useYearMonthFilter = (entries: JournalEntry[]) => {
    const [selectedYearMonth, setSelectedYearMonth] = useState<YearMonth | null>(null)

    const yearMonthGroups = useMemo(() => groupEntriesByYearMonth(entries), [entries])
    
    const yearGroups = useMemo(() => groupYearMonthsByYear(yearMonthGroups), [yearMonthGroups])
    
    const filteredEntries = useMemo(
        () => filterEntriesByYearMonth(entries, selectedYearMonth),
        [entries, selectedYearMonth]
    )

    useEffect(() => {
        if (!selectedYearMonth) {
            const currentYear = new Date().getFullYear()
            setSelectedYearMonth({ year: currentYear, month: 0 })
        }
    }, [selectedYearMonth])

    return {
        selectedYearMonth,
        setSelectedYearMonth,
        yearGroups,
        filteredEntries
    }
}
