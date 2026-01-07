import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '../lib/utils'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    ({ className, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={cn(
                    "flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-2 ring-transparent ring-offset-0 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-ios-blue disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={cn(
                    "flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-2 ring-transparent ring-offset-0 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-ios-blue disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]",
                    className
                )}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

