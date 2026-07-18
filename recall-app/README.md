# Sọrọ Sọkẹ

Sọrọ Sọkẹ is a small vocabulary and memory app built with Next.js, TypeScript, Tailwind, Prisma, PostgreSQL, and server-side Anthropic drafting.

## What it does

- Add a card and generate an editable draft with Claude
- Review only cards due today with SM-2 spaced repetition
- Track three encouraging dashboard stats: streak, total cards learned, due today
- Organise cards into decks, including seeded decks for:
  - Vocabulary
  - People I care about
  - Founder Vocabulary
- Edit saved cards from each deck
- Seed founder-language cards derived from the sibling projects [`../japa-reality-api`](../japa-reality-api) and [`../Network Interview Coach`](../Network Interview Coach)

## Install

```bash
npm install
```

## Environment

Copy [`.env.example`](.env.example) to [`.env`](.env) and set your values.

```bash
cp .env.example .env
```

Use a PostgreSQL connection string for [`DATABASE_URL`](prisma/schema.prisma:7). For Vercel, this should be your hosted Postgres URL.

## Prisma migrate + seed

```bash
npx prisma migrate dev --name init
npm run db:seed
```

For Vercel production, run a deploy migration after your environment variables are set:

```bash
npx prisma migrate deploy
```

If your hosted Postgres database is still empty, run the migration before expecting the deployed app to render real data. After migrating, run the seed locally against the same database only if you want starter data there.

## Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

For local development with PostgreSQL, point [`DATABASE_URL`](prisma/schema.prisma:7) to your local or hosted Postgres instance before running migrations.

## Demo script

1. Open the dashboard and click **Open today's review**.
2. Reveal one card and grade yourself from 0–5.
3. Return to the dashboard and see the stats update.
4. Click **Add a new card**, type a word, then click **Generate draft**.
5. Save the card and open its deck to edit it if needed.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run db:seed`

## Possible later

- Voice/pronunciation
- Quiz or multiple-choice mode
- Import/export
- Sharing
- Cloud sync
- Analytics charts
