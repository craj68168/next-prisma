This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Running it locally

To get it up and running, first you'd need to add `.env` file. Then, you'd need to add your `DATABASE_URL` value. You can use any MySQL service (like [Cloud SQL](https://cloud.google.com/sql) or [PlanetScale](https://planetscale.com/)), or spin up a local MySQL instance. For the `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN` paste your project's DSN string. For the `NEXTAUTH_SECRET` value you can use a random string generator. The value can also contain numbers and special characters. The Sentry values aren't required to run the app, so you can skip them for now.

Once you have the environment variables set, you can proceed to install the dependencies by running `yarn install`.

Then you'd need to setup your database, so follow these instructions:

1. Run `npx prisma generate` to generate the Prisma client based on the schema.
2. Run `npx prisma db push` to initialize your database branch.
3. Run `npx prisma db seed` to add demo data so you don't have to manually create the categories and flashcards.

When you're done with that, you can start the app locally by running `yarn run dev` and visiting [localhost:3000](http://localhost:3000).
