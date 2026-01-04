import { createFileRoute } from '@tanstack/react-router'
import { EntryEditor } from '../components/EntryEditor'

const EntryDetail = () => {
    const { entryId } = Route.useParams()
    return (
        <div className="max-w-7xl w-full">
            <EntryEditor entryId={entryId} />
        </div>
    )
}

export const Route = createFileRoute('/$entryId')({
    component: EntryDetail,
})
