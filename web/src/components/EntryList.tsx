import { Link } from '@tanstack/react-router'
import type { JournalEntry } from '../schemas/entry'
import { Card } from './Card'
import { Button } from './Button'
import { parseEntryDate } from '../lib/dateUtils'

interface EntryListProps {
    entries: JournalEntry[]
    loading: boolean
}

export const EntryList = ({ entries, loading }: EntryListProps) => {
    if (loading) {
        return <div className="text-center py-10 text-gray-500">読み込み中...</div>
    }

    if (entries.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-lg text-gray-500">まだエントリーがありません。</p>
                <Link to="/create" className="mt-4 inline-block bg-blue">
                    <Button variant="ghost">書き始める</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="grid">
            {entries.map((entry) => (
                <>
                    <hr className="border-gray-200"/>
                    <Card
                        key={entry.id}
                        hover={false}
                        className="py-2 border-transparent ring-inset hover:ring-1 hover:ring-black transition-colors"
                    >
                        <Link to="/$entryId" params={{ entryId: entry.id }} preload="intent" className="block no-underline">
                            <div className="flex flex-col">
                                <div className="text-gray-500 text-sm">
                                    {(parseEntryDate(entry.date) ?? new Date()).toLocaleDateString('ja-JP', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                    })}
                                </div>
                                {entry.title && (
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {entry.title}
                                    </h3>
                                )}
                                <p className="text-gray-700 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                                    {entry.content}
                                </p>
                            </div>
                        </Link>
                    </Card></>
            ))}
        </div>
    )
}

