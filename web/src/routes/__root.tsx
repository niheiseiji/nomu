import { createRootRoute, Outlet } from '@tanstack/react-router'

const RootComponent = () => {
    return (
        <div className="my-1 flex justify-center min-h-screen w-full bg-ios-bg-light text-ios-text-light font-sans overflow-x-hidden">
            <Outlet />
        </div>
    )
}

export const Route = createRootRoute({
    component: RootComponent,
})
