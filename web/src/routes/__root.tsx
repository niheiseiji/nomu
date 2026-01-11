import { createRootRoute, Outlet } from '@tanstack/react-router'

const RootComponent = () => {
    return (
        <div className="flex justify-center min-h-screen w-full font-sans overflow-x-hidden px-1 pt-1">
            <Outlet />
        </div>
    )
}

export const Route = createRootRoute({
    component: RootComponent,
})
