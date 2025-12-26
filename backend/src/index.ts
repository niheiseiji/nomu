import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { z } from 'zod';
import { createEntrySchema, updateEntrySchema } from './schemas/entry';

const app = express();

const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL!.replace('file:', ''),
});
const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

function toLocalDateString(date: Date): string {
    const local = new Date(date);
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    return local.toISOString().slice(0, 10);
}

// Routes
const router = express.Router();

// List entries
router.get('/entries', async (req, res) => {
    try {
        const entries = await prisma.journalEntry.findMany({
            orderBy: { date: 'desc' },
        });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch entries' });
    }
});

// Create entry
router.post('/entries', async (req, res) => {
    try {
        const validatedData = createEntrySchema.parse(req.body);
        const entryDate = validatedData.date ?? toLocalDateString(new Date());
        const entry = await prisma.journalEntry.create({
            data: {
                title: validatedData.title,
                content: validatedData.content ?? '',
                date: entryDate,
                registeredAt: new Date(),
            },
        });
        res.status(201).json(entry);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ errors: error.issues });
        } else {
            res.status(500).json({ error: 'Failed to create entry' });
        }
    }
});

// Get single entry
router.get('/entries/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const entry = await prisma.journalEntry.findUnique({
            where: { id },
        });
        if (!entry) {
            return res.status(404).json({ error: 'Entry not found' });
        }
        res.json(entry);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch entry' });
    }
});

// Update entry
router.put('/entries/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const validatedData = updateEntrySchema.parse(req.body);

        const entry = await prisma.journalEntry.update({
            where: { id },
            data: {
                title: validatedData.title,
                content: validatedData.content,
                date: validatedData.date,
            },
        });
        res.json(entry);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ errors: error.issues });
        } else if ((error as any).code === 'P2025') { // Prisma record not found
            res.status(404).json({ error: 'Entry not found' });
        } else {
            res.status(500).json({ error: 'Failed to update entry' });
        }
    }
});

// Delete entry
router.delete('/entries/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.journalEntry.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (error) {
        if ((error as any).code === 'P2025') {
            res.status(404).json({ error: 'Entry not found' });
        } else {
            res.status(500).json({ error: 'Failed to delete entry' });
        }
    }
});

app.use('/api', router);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
