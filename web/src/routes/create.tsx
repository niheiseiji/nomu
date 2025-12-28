import { createFileRoute } from '@tanstack/react-router'
import { EntryEditor } from '../components/EntryEditor'

const CreateEntry = () => {
    return (
        <div className="max-w-screen-md mx-auto px-4 py-6">
            <EntryEditor />
        </div>
    )
}

export const Route = createFileRoute('/create')({
    component: CreateEntry,
})
