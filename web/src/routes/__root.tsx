import { createRootRoute, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools' // Devtools removed
import { ToastProvider } from '../context/ToastContext'

function RootComponent() {
    return (
        <ToastProvider>
            <div className="min-h-screen bg-ios-bg-light dark:bg-ios-bg-dark text-ios-text-light dark:text-ios-text-dark font-sans p-4">
                <div className="max-w-screen-md mx-auto">
                    <Outlet />
                </div>
            </div>
        </ToastProvider>
    )
}

export const Route = createRootRoute({
    component: RootComponent,
})
