import { Link } from '@tanstack/react-router'
import { Button } from './Button'

export const GardenButton = () => {
    return (
        <Link to="/garden">
            <Button 
                className="px-6 py-3 shadow-lg cursor-pointer text-white font-semibold"
                style={{
                    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(/maptile_sogen_hana_01.png)',
                    backgroundRepeat: 'repeat',
                    backgroundSize: '40px 40px',
                }}
            >
                庭へ
            </Button>
        </Link>
    )
}

