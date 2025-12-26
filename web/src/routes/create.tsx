import { createFileRoute } from '@tanstack/react-router'
import { EntryEditor } from '../components/EntryEditor'

export const Route = createFileRoute('/create')({
    component: CreateEntry,
})

function CreateEntry() {
    return <EntryEditor />
}
