import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'

const Garden = () => {
    const navigate = useNavigate()

    const cardData = [
        {
            title: 'やっていること',
            items: [
                '日記を書く',
                '運動をする',
                '読書をする',
                '料理を楽しむ',
                '音楽を聴く'
            ]
        },
        {
            title: 'やりたいこと',
            items: [
                '新しい言語を学ぶ',
                '旅行に行く',
                '写真を撮る',
                '絵を描く',
                '楽器を演奏する'
            ]
        },
        {
            title: 'やりたくないこと',
            items: [
                '早起きをする',
                '人混みに行く',
                '長時間の会議',
                '複雑な手続き',
                'ストレスを感じること'
            ]
        },
        {
            title: '不安なこと',
            items: [
                '将来のキャリア',
                '健康状態',
                '人間関係',
                '経済的なこと',
                '時間の使い方'
            ]
        },
        {
            title: '気になっていること',
            items: [
                '新しい技術',
                '天気予報',
                'ニュース',
                '友人の近況',
                '興味のある本'
            ]
        },
        {
            title: '最近よく考えていること',
            items: [
                '人生の目標',
                '日々の習慣',
                '自己成長',
                '時間管理',
                'バランスの取り方'
            ]
        },
        {
            title: '頼れる人',
            items: [
                '家族',
                '親しい友人',
                '同僚',
                'メンター',
                '専門家'
            ]
        }
    ]

    return (
        <div 
            className="max-w-7xl w-full min-h-screen p-4"
            style={{
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(/maptile_sogen_hana_01.png)',
                backgroundRepeat: 'repeat',
                backgroundSize: '80px 80px',
            }}
        >
            <div className="mb-4">
                <Button variant="white" onClick={() => navigate({ to: '/' })}>
                    <ArrowLeft className="w-5 h-5 mr-1" />
                    戻る
                </Button>
            </div>
            <div className="flex flex-col md:flex-row flex-wrap gap-4">
                {cardData.map((card, index) => (
                    <Card key={index} className="flex-1 min-w-[280px] p-4 bg-white/90">
                        <h2 className="text-lg font-semibold mb-3">{card.title}</h2>
                        <ul className="list-disc list-inside space-y-1">
                            {card.items.map((item, itemIndex) => (
                                <li key={itemIndex} className="text-sm">{item}</li>
                            ))}
                        </ul>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export const Route = createFileRoute('/garden')({
    component: Garden,
})
