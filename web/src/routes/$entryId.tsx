import { createFileRoute } from '@tanstack/react-router'
import { EntryEditor } from '../components/EntryEditor'

const EntryDetail = () => {
    const { entryId } = Route.useParams()
    return (
        <div className="max-w-screen-md mx-auto px-4 py-6">
            <EntryEditor entryId={entryId} />
        </div>
    )
}

export const Route = createFileRoute('/$entryId')({
    component: EntryDetail,
})
