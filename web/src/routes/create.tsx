import { createFileRoute } from '@tanstack/react-router'
import { EntryEditor } from '../components/EntryEditor'

const CreateEntry = () => {
    return (
        <div className="max-w-7xl w-full px-1 pt-1">
            <EntryEditor />
        </div>
    )
}

export const Route = createFileRoute('/create')({
    component: CreateEntry,
})
