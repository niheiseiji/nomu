import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type ToastContextType = {
    show: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
    const [message, setMessage] = useState<string | null>(null)

    const show = useCallback((msg: string) => {
        setMessage(msg)
        setTimeout(() => {
            setMessage(null)
        }, 3000)
    }, [])

    return (
        <ToastContext.Provider value={{ show }}>
            {message && (
                <div 
                    style={{ 
                        position: 'fixed',
                        top: '16px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#1F2937',
                        color: 'white',
                        padding: '12px 24px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        fontSize: '14px',
                        fontWeight: '500',
                        whiteSpace: 'nowrap',
                        zIndex: 99999,
                        animation: 'fadeInDown 0.3s ease-out'
                    }}
                >
                    {message}
                </div>
            )}
            {children}
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}
