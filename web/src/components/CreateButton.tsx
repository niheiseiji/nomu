import { Link } from '@tanstack/react-router'
import { Button } from './Button'

export const CreateButton = () => {
    return (
        <Link to="/create">
            <Button variant="primary" className="px-6 py-3 shadow-lg cursor-pointer font-semibold">
                書く
            </Button>
        </Link>
    )
}

