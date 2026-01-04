import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'

import { api } from '../lib/api'
import { createEntrySchema, type CreateEntryInput, type JournalEntry } from '../schemas/entry'
import { Button } from './Button'
import { Card } from './Card'
import { Input, Textarea } from './Input'
import { setToastMessage } from '../hooks/useToastMessage'

const toLocalDateString = (date: Date): string => {
    const local = new Date(date)
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset())
    return local.toISOString().slice(0, 10)
}

const normalizeEntryDate = (value: string): string => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
    if (value.includes('T')) {
        const datePart = value.split('T')[0]
        if (datePart && /^\d{4}-\d{2}-\d{2}$/.test(datePart)) return datePart
    }
    return toLocalDateString(new Date())
}

type Props = {
    entryId?: string
}

export const EntryEditor = (props: Props) => {
    const navigate = useNavigate()
    const isEdit = Boolean(props.entryId)

    const [loading, setLoading] = useState(isEdit)
    const [entry, setEntry] = useState<JournalEntry | null>(null)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<CreateEntryInput>({
        resolver: zodResolver(createEntrySchema),
        defaultValues: {
            date: toLocalDateString(new Date()),
        },
    })

    useEffect(() => {
        if (!props.entryId) return

        const fetchEntry = async () => {
            try {
                const res = await api.get<JournalEntry>(`/entries/${props.entryId}`)
                const fetchedEntry = res.data
                setEntry(fetchedEntry)
                reset({
                    title: fetchedEntry.title ?? '',
                    content: fetchedEntry.content,
                    date: normalizeEntryDate(fetchedEntry.date),
                })
            } catch {
                setEntry(null)
            } finally {
                setLoading(false)
            }
        }

        fetchEntry()
    }, [props.entryId, reset])

    // 編集時のみ、未保存での画面離脱をブロック（既存挙動を維持）
    useEffect(() => {
        if (!isEdit) return
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (!isDirty) return
            e.preventDefault()
            e.returnValue = ''
        }
        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [isDirty, isEdit])

    const handleBack = () => {
        if (isEdit && isDirty) {
            if (!confirm('保存されていない変更があります。移動してもよろしいですか？')) return
        }
        navigate({ to: '/' })
    }

    const onSubmit = async (data: CreateEntryInput) => {
        // 両方空の場合は保存せず一覧へ
        const hasTitle = data.title?.trim()
        const hasContent = data.content?.trim()
        if (!hasTitle && !hasContent) {
            navigate({ to: '/' })
            return
        }

        try {
            if (props.entryId) {
                await api.put(`/entries/${props.entryId}`, data)
            } else {
                await api.post('/entries', data)
            }
            reset(data)
            setToastMessage('保存しました')
            navigate({ to: '/' })
        } catch {
            alert('保存に失敗しました')
        }
    }

    const handleDelete = async () => {
        if (!props.entryId) return
        if (!confirm('本当にこのエントリーを削除しますか？')) return
        try {
            await api.delete(`/entries/${props.entryId}`)
            navigate({ to: '/' })
        } catch {
            alert('削除に失敗しました')
        }
    }

    if (loading) return <div className="text-center py-10">読み込み中...</div>
    if (isEdit && !entry) return <div className="text-center py-10">エントリーが見つかりません</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={handleBack} className="cursor-pointer">
                    <ArrowLeft className="w-5 h-5 mr-1" />
                    戻る
                </Button>
                {isEdit && (
                    <Button variant="danger" onClick={handleDelete} className="cursor-pointer">
                        <Trash2 className="w-4 h-4 mr-2" />
                        削除
                    </Button>
                )}
            </div>

            <div className={isEdit ? 'min-h-[50vh]' : undefined}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Input type="date" {...register('date')} />
                        {errors.date && (
                            <p className="text-red-500 text-sm">{errors.date.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Input
                            placeholder="タイトル (任意)"
                            className="text-lg font-semibold border-none px-0 shadow-none bg-transparent placeholder:text-gray-400"
                            autoFocus
                            {...register('title')}
                        />
                    </div>

                    <div className="space-y-2">
                        <Textarea
                            placeholder={isEdit ? '内容を入力...' : '今、何を考えていますか？'}
                            className="min-h-[300px] border-none px-0 shadow-none bg-transparent resize-none text-base leading-relaxed"
                            {...register('content')}
                        />
                        {errors.content && (
                            <p className="text-red-500 text-sm">{errors.content.message}</p>
                        )}
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
                        <Button
                            type="submit"
                            disabled={isSubmitting || (isEdit && !isDirty)}
                            className="w-full sm:w-auto bg-black cursor-pointer"
                        >
                            {isSubmitting ? '保存中...' : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    保存する
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}


