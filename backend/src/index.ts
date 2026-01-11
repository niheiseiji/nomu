import 'dotenv/config';
import { Hono, Context } from 'hono';
import { cors } from 'hono/cors';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { z } from 'zod';
import { createEntrySchema, updateEntrySchema } from './schemas/entry';
import { serve } from '@hono/node-server';

const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL!.replace('file:', ''),
});
const prisma = new PrismaClient({ adapter });

const app = new Hono();

app.use('/*', cors());

function toLocalDateString(date: Date): string {
    const local = new Date(date);
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    return local.toISOString().slice(0, 10);
}

// API routes
const api = new Hono();

// List entries
api.get('/entries', async (c: Context) => {
    try {
        const entries = await prisma.journalEntry.findMany({
            orderBy: { date: 'desc' },
        });
        return c.json(entries);
    } catch (error) {
        return c.json({ error: 'Failed to fetch entries' }, 500);
    }
});

// Create entry
api.post('/entries', async (c: Context) => {
    try {
        const body = await c.req.json();
        const validatedData = createEntrySchema.parse(body);
        const entryDate = validatedData.date ?? toLocalDateString(new Date());
        const entry = await prisma.journalEntry.create({
            data: {
                title: validatedData.title,
                content: validatedData.content ?? '',
                date: entryDate,
                registeredAt: new Date(),
            },
        });
        return c.json(entry, 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ errors: error.issues }, 400);
        }
        return c.json({ error: 'Failed to create entry' }, 500);
    }
});

// Get single entry
api.get('/entries/:id', async (c: Context) => {
    try {
        const id = c.req.param('id');
        const entry = await prisma.journalEntry.findUnique({
            where: { id },
        });
        if (!entry) {
            return c.json({ error: 'Entry not found' }, 404);
        }
        return c.json(entry);
    } catch (error) {
        return c.json({ error: 'Failed to fetch entry' }, 500);
    }
});

// Update entry
api.put('/entries/:id', async (c: Context) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const validatedData = updateEntrySchema.parse(body);

        const entry = await prisma.journalEntry.update({
            where: { id },
            data: {
                title: validatedData.title,
                content: validatedData.content,
                date: validatedData.date,
            },
        });
        return c.json(entry);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ errors: error.issues }, 400);
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return c.json({ error: 'Entry not found' }, 404);
        }
        return c.json({ error: 'Failed to update entry' }, 500);
    }
});

// Delete entry
api.delete('/entries/:id', async (c: Context) => {
    try {
        const id = c.req.param('id');
        await prisma.journalEntry.delete({
            where: { id },
        });
        return c.body(null, 204);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return c.json({ error: 'Entry not found' }, 404);
        }
        return c.json({ error: 'Failed to delete entry' }, 500);
    }
});

app.route('/api', api);

const PORT = Number(process.env.PORT) || 3000;

serve({
    fetch: app.fetch,
    port: PORT,
}, (info: { port: number; address: string }) => {
    console.log(`Server running on port ${info.port}`);
});
