import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from './Button'

export const CreateButton = () => {
    return (
        <Link to="/create">
            <Button className="rounded-full w-10 h-10 p-0 shadow-lg bg-black">
                <Plus className="w-6 h-6" />
            </Button>
        </Link>
    )
}

