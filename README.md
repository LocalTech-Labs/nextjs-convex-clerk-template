# Next.js + Convex Micro-SaaS Template

A production-ready template for micro-SaaS applications using Next.js 16, Convex, Clerk, shadcn/ui, Tailwind CSS v4, PostHog, and Cloudflare Workers.

## Stack

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) | App Router, React 19, SSR |
| [Convex](https://convex.dev/) | Serverless backend, real-time database |
| [Clerk](https://clerk.com/) | Authentication and user management |
| [shadcn/ui](https://ui.shadcn.com/) | Component library (46 components) |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [PostHog](https://posthog.com/) | Product analytics and feature flags |
| [Biome](https://biomejs.dev/) | Linting and formatting |
| [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) | Unit and E2E testing |
| [Cloudflare Workers](https://workers.cloudflare.com/) | Edge deployment |

## Quickstart

### 1. Clone and install

```bash
git clone <your-repo-url>
cd <project-directory>
bun install
```

### 2. Set up services

You'll need accounts for:
- **Convex** - [dashboard.convex.dev](https://dashboard.convex.dev/) (backend)
- **Clerk** - [dashboard.clerk.com](https://dashboard.clerk.com/) (auth)
- **PostHog** (optional) - [app.posthog.com](https://app.posthog.com/) (analytics)

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual keys. See `.env.example` for descriptions of each variable.

### 4. Run development server

```bash
bun run dev
```

This starts both the Convex dev server and Next.js concurrently. Open [http://localhost:3000](http://localhost:3000).

## Customization

Replace `TemplateApp` with your project name in:
- `components/layout/header.tsx` (header title)
- `app/layout.tsx` (metadata)
- `app/page.tsx` (welcome text)
- `package.json` (`name` field)

## Scripts

### Development
| Command | Description |
|---|---|
| `bun run dev` | Start Convex + Next.js dev servers |
| `bun run build` | Production build |
| `bun run start` | Start production server |

### Code Quality
| Command | Description |
|---|---|
| `bun run check` | Biome lint + format (auto-fix) |
| `bun run lint` | Biome lint only |
| `bun run format` | Biome format only |

### Testing
| Command | Description |
|---|---|
| `bun run test` | Unit tests |
| `bun run test:watch` | Unit tests in watch mode |
| `bun run test:coverage` | Unit tests with coverage |
| `bun run test:e2e` | E2E tests (Playwright) |
| `bun run test:all` | All tests |

See [TESTING.md](./TESTING.md) for detailed testing documentation.

### Deployment
| Command | Description |
|---|---|
| `bun run build:worker` | Build for Cloudflare Workers |
| `bun run preview` | Local preview with Wrangler |
| `bun run deploy` | Deploy to Cloudflare Workers |

## Deployment to Cloudflare Workers

This template uses [@opennextjs/cloudflare](https://opennext.js.org/cloudflare) for deployment.

1. Install Wrangler CLI and authenticate:
```bash
bunx wrangler login
```

2. Build and deploy:
```bash
bun run build:worker
bun run deploy
```

See `wrangler.jsonc` for Workers configuration.

### Environment Variables in Production

Set environment variables in Cloudflare:
```bash
bunx wrangler secret put CLERK_SECRET_KEY
bunx wrangler secret put CLERK_WEBHOOK_SECRET
```

For `NEXT_PUBLIC_*` variables, add them to `wrangler.jsonc` under `vars`.

## Convex Setup

The Convex backend includes:
- **User sync** via Clerk webhooks (`convex/http.ts`)
- **Users table** with Clerk integration (`convex/schema.ts`)
- **User queries** for accessing the current user (`convex/users.ts`)

### Clerk Webhook Setup

1. In [Clerk Dashboard > Webhooks](https://dashboard.clerk.com/), create a webhook endpoint pointing to your Convex HTTP endpoint: `https://<your-convex-url>.convex.site/clerk-users-webhook`
2. Subscribe to: `user.created`, `user.updated`, `user.deleted`
3. Copy the signing secret to `CLERK_WEBHOOK_SECRET`

## Adding Components

```bash
bunx shadcn@latest add <component-name>
```

## License

MIT
