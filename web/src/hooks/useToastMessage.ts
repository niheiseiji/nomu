import { useEffect } from 'react'
import { showToast } from '../lib/toast'

const TOAST_MESSAGE_KEY = 'toast_message'

export const useToastMessage = () => {
    useEffect(() => {
        const toastMessage = sessionStorage.getItem(TOAST_MESSAGE_KEY)
        if (toastMessage) {
            sessionStorage.removeItem(TOAST_MESSAGE_KEY)
            showToast(toastMessage)
        }
    }, [])
}

export const setToastMessage = (message: string) => {
    sessionStorage.setItem(TOAST_MESSAGE_KEY, message)
}

