# Next.js + Convex + Clerk + shadcn/ui + Tailwind v4 Template

A modern, full-stack template using the latest versions of Next.js, Convex, Clerk, shadcn/ui, and Tailwind CSS v4. Designed for rapid development and easy authentication with a beautiful, accessible component library.

---

## ✨ Key Features

- **Modern Full-Stack**: Combines the latest versions of Next.js (with React 19), Convex, and Tailwind CSS v4.
- **Seamless Authentication**: Pre-configured with Clerk for robust, easy-to-implement user management.
- **Real-time Backend**: Leverages Convex for a serverless, real-time database, and TypeScript server functions.
- **Beautiful & Accessible UI**: Comes with shadcn/ui components, ready for customization and built on Radix UI.
- **Developer-Friendly**: Includes AI assistant integration rules (Cursor, Copilot, Windsurf) and clear setup instructions.

---

## ⚠️ Customization: Update Your Project Name

This template uses `TemplateApp` as a placeholder name. **After cloning, you should replace all instances of `TemplateApp` with your own project name.**

Update the following files/locations:

- `components/layout/header.tsx` (App title in the header)
- `app/layout.tsx` (HTML metadata: title and description)
- `app/page.tsx` (Welcome message or any sample content)
- `package.json`: Change the `name` field to your project's name. You should also consider updating other fields like `version`, `description`, `author`, and `repository` to match your project.
- **After updating `package.json`**: Run `npm install` in your terminal. This command will automatically update the `package-lock.json` file to reflect your new project name and ensure all dependencies are correctly configured and locked for reproducible builds.

**Tip:** Use your code editor's "Find and Replace" feature to search for `TemplateApp` across the entire project to catch any other references.

---

## 🛠️ Stack Overview

- **[Next.js 15](https://docs.nextjs.org/)** (React 19): App router, SSR, file-based routing
- **[Convex](https://docs.convex.dev/)**: Serverless backend, real-time database, TypeScript server functions
- **[Clerk](https://clerk.com/docs)**: Authentication and user management
- **[shadcn/ui](https://ui.shadcn.com/docs)**: Accessible, customizable React components
- **[Tailwind CSS v4](https://tailwindcss.com/docs/v4-beta)**: Utility-first styling
- **[Vitest](https://vitest.dev/)**: Fast unit test runner with React Testing Library
- **[Playwright](https://playwright.dev/)**: Modern end-to-end testing framework

---

## 📋 Prerequisites

Before you begin, ensure you have completed the following setup steps. These are crucial for the template to function correctly.

1.  **Set Up Your Convex Project**:
    Follow the official Convex Next.js Quickstart guide to initialize your Convex backend, install the CLI, and link your project.
    *   **Guide**: [Convex Next.js Quickstart](https://docs.convex.dev/quickstart/nextjs)

2.  **Configure Clerk Authentication with Convex**:
    Integrate Clerk for authentication by following the Convex documentation. This involves setting up your Clerk application and configuring Convex to use Clerk for authentication.
    *   **Tutorial**: [Convex + Clerk for Next.js](https://docs.convex.dev/auth/clerk#nextjs)

    *Specifically, ensure you have completed these key steps from the tutorials:*
    *   Logged into Convex (`npx convex login`).
    *   Initialized a Convex project in this repository's directory (`npx convex dev` will prompt you if it's a new project).
    *   Created a Clerk application and obtained your API keys.
    *   Configured the JWT issuer URL in your Convex project settings on the Convex dashboard.

Once these prerequisites are met, you can proceed with the Quickstart section below to set up your environment variables and run the application.

---

## 🚀 Quickstart

### 1. Start Your Project

#### Option A: Use this Template on Replit

1. Go to [Replit](https://replit.com/).
2. Click **"Create Repl"** and search for this template (or use the template link if provided).
3. Replit will automatically install dependencies. If not, run:
   ```bash
   npm install
   # or yarn, pnpm, bun
   ```

#### Option B: Clone from GitHub

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd <project-directory>
   npm install # or yarn, pnpm, bun
   ```

### 2. Set Up Environment Variables

This project uses environment variables to manage sensitive information like API keys and deployment URLs. The `.env.example` file in the root directory lists all required variables.

**Choose the setup method based on how you are using this template:**

#### Option 1: For GitHub Users (Cloning Locally or Using as a GitHub Template)

If you have cloned this repository from GitHub to your local machine or are using it as a GitHub template for a new repository that you will clone locally, you will create a `.env.local` file.

1.  **Create your local environment file:**
    In your project's root directory, make a copy of `.env.example` and name it `.env.local`:
    ```bash
    cp .env.example .env.local
    ```
    This command copies the template to a new file named `.env.local`.

2.  **Populate `.env.local` with your secrets:**
    Open the newly created `.env.local` file. You'll see it contains all the necessary environment variables with placeholder values. Replace these placeholders with your actual credentials from Convex and Clerk.
    Refer to the comments within `.env.example` (and now in your `.env.local`) and the "Environment Variables" table further down in this README for guidance on where to find these values.

    Your `.env.local` will look something like this after filling it out (the exact values will be yours):
    ```env
    # Convex Deployment URL
    NEXT_PUBLIC_CONVEX_URL="https://your-project-name.convex.cloud"

    # Clerk JWT Issuer URL (for Convex Integration)
    NEXT_PUBLIC_CLERK_FRONTEND_API_URL="https://your-instance.clerk.accounts.dev"

    # Clerk Publishable Key (Frontend API Key)
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

    # Clerk Secret Key
    CLERK_SECRET_KEY="clerk_secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    ```

    **Important Security Note:** The `.env.local` file contains your secret keys and should **NEVER** be committed to Git or shared publicly. The `.gitignore` file in this template is already configured to ignore `.env.local` (by ignoring `.env*` and then specifically un-ignoring `.env.example` with `!.env.example`), but it's crucial to be aware of this. Only the `.env.example` file (which contains no secrets) should be version controlled.

#### Option 2: For Replit Users (Using as a Replit Template)

If you are using this template directly on Replit (e.g., by clicking "Use Template" on Replit or forking a Repl), you will use Replit's Secrets manager instead of a `.env.local` file.

1.  **Open the Secrets Panel:**
    In your Replit workspace, locate the "Secrets" tab in the sidebar (it usually has a lock icon 🔒). Click on it to open the secrets management panel.

2.  **Add Environment Variables:**
    For each variable listed in the `.env.example` file, you will add a new secret in Replit.
    - The **Key** in Replit Secrets will be the variable name (e.g., `NEXT_PUBLIC_CONVEX_URL`).
    - The **Value** in Replit Secrets will be your actual secret credential (e.g., `https://your-project-name.convex.cloud`).

    You need to add the following variables from `.env.example` into your Replit Secrets:
    - `NEXT_PUBLIC_CONVEX_URL`
    - `NEXT_PUBLIC_CLERK_FRONTEND_API_URL`
    - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
    - `CLERK_SECRET_KEY`

    Refer to the comments within `.env.example` and the "Environment Variables" table further down in this README for guidance on where to find these values.

    **Important Security Note:** Replit Secrets are designed to keep your sensitive information secure and are not stored in your project files. Do not manually create a `.env.local` file in Replit if you are using Replit Secrets, as Replit will automatically manage environment variables from the Secrets panel for your deployed application and development environment.

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📜 Available Scripts

In the project directory, you can run the following scripts via `npm run <script-name>` (or `yarn <script-name>`, `pnpm run <script-name>`, `bun run <script-name>`):

### Development & Build

- **`dev`**: Runs the Convex and Next.js development servers concurrently. Output from each server is labeled (`CONVEX`, `NEXT`) and color-coded for readability.
  ```bash
  concurrently --names "CONVEX,NEXT" --prefix-colors "auto" "convex dev" "next dev"
  ```
- **`build`**: Builds the Next.js application for production.
  ```bash
  next build
  ```
- **`start`**: Starts the Next.js production server (requires a prior `npm run build`).
  ```bash
  next start
  ```
- **`lint`**: Lints the codebase using ESLint to identify and fix code style issues.
  ```bash
  next lint
  ```

### Testing

- **`test`**: Runs unit tests with Vitest.
  ```bash
  vitest
  ```
- **`test:watch`**: Runs unit tests in watch mode.
  ```bash
  vitest --watch
  ```
- **`test:ui`**: Opens Vitest UI dashboard for interactive test running.
  ```bash
  vitest --ui
  ```
- **`test:coverage`**: Generates test coverage report.
  ```bash
  vitest --coverage
  ```
- **`test:e2e`**: Runs end-to-end tests with Playwright.
  ```bash
  playwright test
  ```
- **`test:e2e:ui`**: Runs e2e tests with Playwright UI mode.
  ```bash
  playwright test --ui
  ```
- **`test:e2e:headed`**: Runs e2e tests in headed mode (visible browser).
  ```bash
  playwright test --headed
  ```
- **`test:e2e:debug`**: Runs e2e tests in debug mode.
  ```bash
  playwright test --debug
  ```
- **`test:all`**: Runs all tests (unit + e2e).
  ```bash
  npm run test && npm run test:e2e
  ```
- **`playwright:install`**: Installs Playwright browsers.
  ```bash
  playwright install --with-deps
  ```

For detailed testing documentation, see [TESTING.md](./TESTING.md).

---

## 📚 Key Documentation

- [Next.js Documentation](https://docs.nextjs.org/)
- [Convex Documentation](https://docs.convex.dev/)
- [Clerk Documentation](https://clerk.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs/v4-beta)

### AI-First & Architecture Docs

- [AI Agent Playbook](./docs/ai/README.md) – repository map, workflows, and checklists optimized for Claude/Cursor/GPT agents.
- [Architecture Overview](./docs/architecture/OVERVIEW.md) – layered view of the frontend, Convex backend, and testing/tooling surfaces.

### Convex + Clerk Integration

- [Convex & Clerk Integration Guide](https://docs.convex.dev/auth/clerk)

---

## 🧑‍💻 Development Notes

- Convex runs as part of your Next.js app (no separate backend to run).
- Use the [Convex dashboard](https://dashboard.convex.dev/) to manage schema and server functions.
- Authentication is enforced via Clerk middleware and the Convex Clerk provider.
- UI is built with shadcn/ui and styled using Tailwind v4.

---

## 🏗️ Customization & Deployment

- Edit pages in `app/` (Next.js app directory)
- Add Convex functions in `convex/`
- Customize components in `components/ui/`
- Deploy easily to [Vercel](https://vercel.com/) or your preferred platform

For more details, see the official docs linked above.

---

### General Deployment Considerations

- **Convex Project Linking**: Ensure your local Convex CLI is linked to the correct Convex project (dev and prod). Use `npx convex project switch` if needed.
- **Environment Consistency**: The `NEXT_PUBLIC_CONVEX_URL` used by your deployed Next.js app *must* point to the corresponding Convex deployment (dev URL for dev frontend, prod URL for prod frontend).
- **Clerk Configuration**: Double-check that your Clerk application is configured with the correct production URLs for your frontend and that the Convex JWT issuer URL in your Convex dashboard points to your production Clerk instance.

Refer to the official [Convex Deployment Docs](https://docs.convex.dev/hosting) and [Next.js Vercel Deployment Guide](https://nextjs.org/docs/deployment) for more comprehensive information.

---

## 🤖 AI Assistant Integration

This repository is configured with rule files to enhance collaboration with AI coding assistants like Cursor, GitHub Copilot, and Windsurf. These rules help ensure consistent coding practices, adherence to project-specific guidelines (such as Convex best practices), and overall improved development efficiency.

You can find these rule files in directories like `.github/instructions` and `.cursor/rules`. Please ensure your AI assistant is configured to use these rules for the best experience.

---

## 🤔 Troubleshooting / FAQ

- **Q: My Convex functions aren't updating after local changes, or data isn't appearing.**
  A:
    1. Ensure the `convex dev` process is running. If you use `npm run dev`, it should manage this. If running `next dev` and `convex dev` in separate terminals, ensure both are active and not showing errors.
    2. Check the Convex dashboard for your dev deployment for any errors in the function logs.
    3. Verify that `NEXT_PUBLIC_CONVEX_URL` in your `.env.local` points to your *development* Convex deployment URL.

- **Q: Clerk authentication isn't working, I see "Issuer URL" errors, or I'm stuck in a redirect loop.**
  A:
    1. Double-check all Clerk-related environment variables in `.env.local`: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, and `NEXT_PUBLIC_CLERK_FRONTEND_API_URL`.
    2. In your Convex Dashboard settings for your *development* deployment, ensure the "Clerk JWT Issuer URL" (under Auth > Clerk) is correctly set to your Clerk instance's URL (e.g., `https://your-instance.clerk.accounts.dev`).
    3. Ensure your Clerk application settings (on the Clerk dashboard) have the correct URLs for your local development environment (e.g., `http://localhost:3000` for sign-in/sign-up redirects).

- **Q: Tailwind CSS styles are not applying correctly or are missing after adding new classes.**
  A:
    1. Ensure the Next.js development server (`npm run dev`) is running. It should automatically recompile Tailwind styles.
    2. Verify your `tailwind.config.ts` `content` array correctly includes all paths where you use Tailwind classes (e.g., `./app/**/*.{js,ts,jsx,tsx,mdx}`, `./components/**/*.{js,ts,jsx,tsx,mdx}`).
    3. Check `app/globals.css` (or your main CSS entry point) to ensure Tailwind's base, components, and utilities layers are imported (`@tailwind base; @tailwind components; @tailwind utilities;`).

- **Q: I get errors related to `window` or `document` not being defined during Next.js build (`npm run build`).**
  A: This usually happens when client-side browser APIs are accessed in code that Next.js tries to render on the server.
    1. Use `useEffect` hooks for code that must run only on the client-side.
    2. Conditionally render components that rely on browser APIs: `typeof window !== 'undefined' && <MyClientComponent />`.
    3. Use Next.js dynamic imports with `ssr: false`: `const MyClientComponent = dynamic(() => import('../components/MyClientComponent'), { ssr: false })`.

- **Q: How do I add a new shadcn/ui component?**
  A: Use the CLI: `npx shadcn-ui@latest add <component-name>`. For example, `npx shadcn-ui@latest add dialog`. The component files will be added to your `components/ui` directory.

---

## ⚙️ Setting up the Convex MCP Server

The Convex Model Context Protocol (MCP) server allows your AI coding assistant to interact directly with your Convex deployment. This enables it to query your schema, run functions, and provide more context-aware assistance.

The general command to start the Convex MCP server is:
`npx -y convex@latest mcp start`

Below are specific instructions for integrating it with popular AI assistants:

### For GitHub Copilot (in VS Code)

1.  Create a file named `mcp.json` in the `.vscode` directory of your project (`.vscode/mcp.json`).
2.  Add the following configuration to this file:

    ```json
    {
      "servers": {
        "convex-mcp": {
          "type": "stdio",
          "command": "npx",
          "args": ["-y", "convex@latest", "mcp", "start"]
        }
      }
    }
    ```

3.  VS Code should automatically detect and start the server. You'll see Convex tools available in the Copilot Chat interface.
4.  For optimal performance, also ensure you have the Convex instructions file at `.github/instructions/convex.instructions.md` (as mentioned in the "AI Assistant Integration" section).

### For Cursor

1.  Open Cursor Settings:
    - On macOS: `Cursor > Settings`
    - On Windows/Linux: `File > Preferences > Settings`
2.  Navigate to the "MCP" section (you might need to search for "MCP").
3.  Click on "Add new global MCP server". This will likely open an `mcp.json` file.
4.  Add or update the configuration for the Convex server. If the file is new or empty, you can use this structure:

    ```json
    {
      "mcpServers": {
        "convex": {
          "command": "npx",
          "args": ["-y", "convex@latest", "mcp", "start"]
        }
      }
    }
    ```

    If `mcpServers` already exists, just add the `"convex": { ... }` part within it.

5.  Save the `mcp.json` file.
6.  Back in the Cursor MCP settings UI, ensure the "convex" server is enabled (it should be lit green). You might need to click "Disabled" to toggle it to "Enabled".
7.  For best results, also ensure you have the Convex rules files in your project's `.cursor/rules` directory.

---

## 📜 License

This project is licensed under the MIT License.

You are free to use, modify, and distribute this template as per the terms of the MIT License. It's recommended to include a `LICENSE` file in your project root if you haven't already. You can create one with the standard MIT License text.

### For Windsurf

1.  Open Windsurf Settings:
    - Usually accessible via a gear icon or `Windsurf > Settings`.
2.  Navigate to `Cascade > Model Context Protocol (MCP) Servers`.
3.  Click on "Add Server", then choose "Add custom server".
4.  You'll be prompted to enter the server details:
    - **Name:** `Convex` (or any name you prefer)
    - **Command:** `npx`
    - **Arguments:** Enter the following arguments (the UI might require you to add them one by one or as a JSON array string):
      - `-y`
      - `convex@latest`
      - `mcp`
      - `start`
        (If the UI expects a JSON array string for arguments, use: `["-y", "convex@latest", "mcp", "start"]`)
5.  After adding the server configuration, return to the "Model Context Protocol (MCP) Servers" screen.
6.  Click the "Refresh" button for Windsurf to detect and initialize the new Convex MCP server.
7.  Remember to also utilize the `convex_rules.txt` file in your project by referencing it in your prompts to Windsurf.

---

## 🤝 Contributing

Pull requests and issues welcome! Help improve this template for the community.

---

## 📄 License

MIT
