let toastTimeout: ReturnType<typeof setTimeout> | null = null

export const showToast = (message: string) => {
    if (toastTimeout) {
        clearTimeout(toastTimeout)
    }

    const existingToast = document.getElementById('app-toast')
    if (existingToast) {
        existingToast.remove()
    }

    const toast = document.createElement('div')
    toast.id = 'app-toast'
    toast.textContent = message
    toast.style.cssText = `
        position: fixed;
        top: 16px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #1F2937;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        font-size: 14px;
        font-weight: 500;
        white-space: nowrap;
        z-index: 99999;
        animation: fadeInDown 0.3s ease-out;
    `

    document.body.appendChild(toast)

    toastTimeout = setTimeout(() => {
        toast.style.animation = 'fadeOutUp 0.3s ease-out'
        setTimeout(() => {
            toast.remove()
            toastTimeout = null
        }, 300)
    }, 3000)
}

