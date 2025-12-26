import { createFileRoute } from '@tanstack/react-router'
import { EntryEditor } from '../components/EntryEditor'

export const Route = createFileRoute('/$entryId')({
    component: EntryDetail,
})

function EntryDetail() {
    const { entryId } = Route.useParams()
    return <EntryEditor entryId={entryId} />
}
