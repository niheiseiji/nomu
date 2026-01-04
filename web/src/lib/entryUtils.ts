import type { JournalEntry } from '../schemas/entry'
import { parseEntryDate } from './dateUtils'

export interface YearMonth {
    year: number
    month: number
}

interface YearMonthGroup extends YearMonth {
    count: number
}

export const groupEntriesByYearMonth = (entries: JournalEntry[]): YearMonthGroup[] => {
    const groups = new Map<string, YearMonthGroup>()
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
}

export const groupYearMonthsByYear = (yearMonthGroups: YearMonthGroup[]): [number, YearMonthGroup[]][] => {
    const groups = new Map<number, YearMonthGroup[]>()
    yearMonthGroups.forEach((ym) => {
        if (!groups.has(ym.year)) {
            groups.set(ym.year, [])
        }
        groups.get(ym.year)!.push(ym)
    })
    return Array.from(groups.entries()).sort((a, b) => b[0] - a[0])
}

export const filterEntriesByYearMonth = (entries: JournalEntry[], yearMonth: YearMonth | null): JournalEntry[] => {
    if (!yearMonth) return entries
    
    return entries.filter((entry) => {
        const date = parseEntryDate(entry.date)
        if (!date) return false
        
        // monthが0の場合は年全体を表示
        if (yearMonth.month === 0) {
            return date.getFullYear() === yearMonth.year
        }
        
        return (
            date.getFullYear() === yearMonth.year &&
            date.getMonth() + 1 === yearMonth.month
        )
    })
}

