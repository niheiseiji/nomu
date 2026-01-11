import { useState, useRef, useEffect } from 'react'
import { User } from 'lucide-react'
import { Card } from './Card'

export const UserIcon = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                buttonRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false)
            }
        }

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isMenuOpen])

    const handleLogout = () => {
        // TODO: ログアウト処理を実装
        setIsMenuOpen(false)
    }

    const handleHelp = () => {
        // TODO: ヘルプ処理を実装
        setIsMenuOpen(false)
    }

    const handleSettings = () => {
        // TODO: 設定処理を実装
        setIsMenuOpen(false)
    }

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer"
            >
                <User className="w-6 h-6 text-gray-600" />
            </button>
            {isMenuOpen && (
                <Card
                    ref={menuRef}
                    className="absolute right-0 top-12 w-64 p-4 z-50 bg-white rounded-xl shadow-card border border-gray-400"
                    hover={false}
                >
                    <div className="space-y-3">
                        <div>
                            <div className="font-semibold text-gray-900">名前</div>
                            <div className="text-sm text-gray-600">メールアドレス</div>
                        </div>
                        <hr className="border-gray-200" />
                        <div className="space-y-1">
                            <button
                                onClick={handleHelp}
                                className="w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                            >
                                ヘルプ
                            </button>
                            <button
                                onClick={handleSettings}
                                className="w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                            >
                                設定
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                            >
                                ログアウト
                            </button>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    )
}

