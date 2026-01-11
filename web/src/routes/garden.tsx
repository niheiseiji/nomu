import { createFileRoute } from '@tanstack/react-router'

const Garden = () => {
    return (
        <div className="max-w-7xl w-full">
            <h1>Garden</h1>
        </div>
    )
}

export const Route = createFileRoute('/garden')({
    component: Garden,
})
