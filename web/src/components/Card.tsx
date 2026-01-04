import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '../lib/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, hover = true, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "bg-ios-card-light dark:bg-ios-card-dark rounded-xl shadow-card transition-all duration-200 border border-transparent",
                    hover && "hover:shadow-float hover:-translate-y-0.5",
                    className
                )}
                {...props}
            />
        )
    }
)
Card.displayName = "Card"

