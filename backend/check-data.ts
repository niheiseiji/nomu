import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import Database from 'better-sqlite3'

const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL!.replace('file:', ''),
})
const prisma = new PrismaClient({ adapter })

async function main() {
    const count = await prisma.journalEntry.count()
    console.log(`Total entries: ${count}`)

    const entries = await prisma.journalEntry.findMany({
        take: 5,
        orderBy: {
            date: 'desc'
        }
    })

    console.log('\nFirst 5 entries:')
    entries.forEach(entry => {
        console.log(`- ${entry.date}: ${entry.title}`)
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
