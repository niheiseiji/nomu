import { createRootRoute, Outlet } from '@tanstack/react-router'

const RootComponent = () => {
    return (
        <div className="min-h-screen w-full bg-ios-bg-light dark:bg-ios-bg-dark text-ios-text-light dark:text-ios-text-dark font-sans overflow-x-hidden">
            <Outlet />
        </div>
    )
}

export const Route = createRootRoute({
    component: RootComponent,
})
