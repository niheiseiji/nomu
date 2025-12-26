import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { api } from '../lib/api' // Fixed import path
import type { JournalEntry } from '../schemas/entry'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Plus } from 'lucide-react'
import { useToast } from '../context/ToastContext'

export const Route = createFileRoute('/')({
    component: Index,
})

function parseEntryDate(dateString: string): Date | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString)
    if (!match) return null
    const year = Number(match[1])
    const month = Number(match[2])
    const day = Number(match[3])
    return new Date(year, month - 1, day)
}

function Index() {
    const [entries, setEntries] = useState<JournalEntry[]>([])
    const [loading, setLoading] = useState(true)
    const { show: showToast } = useToast()

    useEffect(() => {
        fetchEntries()
    }, [])

    useEffect(() => {
        // sessionStorageからトーストメッセージを取得
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">nomu</h1>
                <Link to="/create">
                    <Button className="rounded-full w-10 h-10 p-0 shadow-lg">
                        <Plus className="w-6 h-6" />
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500">読み込み中...</div>
            ) : entries.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-lg text-gray-500">まだエントリーがありません。</p>
                    <Link to="/create" className="mt-4 inline-block">
                        <Button variant="ghost">書き始める</Button>
                    </Link>
                </div>
            ) : (
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
            )}
        </div>
    )
}
