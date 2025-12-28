import { Link } from '@tanstack/react-router'
import type { JournalEntry } from '../schemas/entry'
import { Card } from './Card'
import { Button } from './Button'
import { parseEntryDate } from '../lib/dateUtils'

interface EntryListProps {
    entries: JournalEntry[]
    loading: boolean
}

export function EntryList({ entries, loading }: EntryListProps) {
    if (loading) {
        return <div className="text-center py-10 text-gray-500">読み込み中...</div>
    }

    if (entries.length === 0) {
        return (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-lg text-gray-500">まだエントリーがありません。</p>
                <Link to="/create" className="mt-4 inline-block">
                    <Button variant="ghost">書き始める</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="grid gap-4">
            {entries.map((entry) => (
                <Card
                    key={entry.id}
                    hover={false}
                    className="border-transparent ring-inset hover:ring-1 hover:ring-black dark:hover:ring-white transition-colors"
                >
                    <Link to="/$entryId" params={{ entryId: entry.id }} className="block no-underline">
                        <div className="flex flex-col gap-2">
                            <div className="text-gray-500 dark:text-gray-400 text-sm">
                                {(parseEntryDate(entry.date) ?? new Date()).toLocaleDateString('ja-JP', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                })}
                            </div>
                            {entry.title && (
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {entry.title}
                                </h3>
                            )}
                            <p className="text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                                {entry.content}
                            </p>
                        </div>
                    </Link>
                </Card>
            ))}
        </div>
    )
}

