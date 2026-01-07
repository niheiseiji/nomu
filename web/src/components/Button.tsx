import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost' | 'danger'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
                    variant === 'primary' && "bg-ios-blue text-white hover:opacity-90 active:opacity-100",
                    variant === 'ghost' && "bg-transparent hover:bg-black/5 text-ios-blue",
                    variant === 'danger' && "bg-red-500 text-white hover:bg-red-600",
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

