
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import Database from 'better-sqlite3'
import { fakerJA as faker } from '@faker-js/faker'

// const connection = new Database(process.env.DATABASE_URL!.replace('file:', ''))
const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL!.replace('file:', ''),
})
const prisma = new PrismaClient({ adapter })

function toLocalDateString(date: Date): string {
    const local = new Date(date)
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset())
    return local.toISOString().slice(0, 10)
}

async function main() {
    console.log('Seeding database...')

    // Clear existing entries
    await prisma.journalEntry.deleteMany()

    // Generate 20 entries for the last 20 days
    for (let i = 0; i < 20; i++) {
        const entryCreatedAt = new Date()
        entryCreatedAt.setDate(entryCreatedAt.getDate() - i)

        await prisma.journalEntry.create({
            data: {
                title: faker.word.noun() + 'の' + faker.word.verb(),
                content: faker.lorem.paragraphs(2), // Generates roughly 100-300 chars usually
                date: toLocalDateString(entryCreatedAt),
                registeredAt: entryCreatedAt,
            },
        })
    }

    console.log('Seeding finished.')
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
