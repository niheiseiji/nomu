import { createFileRoute } from '@tanstack/react-router'
import { EntryEditor } from '../components/EntryEditor'

const CreateEntry = () => {
    return (
        <div className="max-w-7xl w-full">
            <EntryEditor />
        </div>
    )
}

export const Route = createFileRoute('/create')({
    component: CreateEntry,
})
