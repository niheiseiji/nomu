import { type HTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, hover = true, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "bg-ios-card-light dark:bg-ios-card-dark rounded-xl shadow-card p-4 transition-all duration-200 border border-transparent",
                    hover && "hover:shadow-float hover:-translate-y-0.5",
                    className
                )}
                {...props}
            />
        );
    }
);
Card.displayName = "Card";
