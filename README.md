# Next.js + Convex + Clerk + shadcn/ui + Tailwind v4 Template

A modern, full-stack template using the latest versions of Next.js, Convex, Clerk, shadcn/ui, and Tailwind CSS v4. Designed for rapid development and easy authentication with a beautiful, accessible component library.

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

Create a `.env.local` file in the root with the following (see below for details):

```env
NEXT_PUBLIC_CONVEX_URL=...
NEXT_PUBLIC_CLERK_FRONTEND_API_URL=...
CLERK_SECRET_KEY=...
```

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

## ⚙️ Environment Variables

| Variable                                                                    | Description                                               |
| --------------------------------------------------------------------------- | --------------------------------------------------------- |
| `NEXT_PUBLIC_CONVEX_URL`                                                    | Your Convex deployment URL (from Convex dashboard)        |
| `NEXT_PUBLIC_CLERK_FRONTEND_API_URL` or `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Your Clerk frontend API key (from Clerk dashboard)        |
| `CLERK_SECRET_KEY`                                                          | Your Clerk secret key (server-side, from Clerk dashboard) |

- Get your Convex URL from the [Convex dashboard](https://dashboard.convex.dev/).
- Get your Clerk keys from the [Clerk dashboard](https://clerk.com/docs/reference/environment-variables).

---

## 📚 Key Documentation

- [Next.js Documentation](https://docs.nextjs.org/)
- [Convex Documentation](https://docs.convex.dev/)
- [Clerk Documentation](https://clerk.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs/v4-beta)

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

## 🤖 AI Assistant Integration

This repository is configured with rule files to enhance collaboration with AI coding assistants like Cursor, GitHub Copilot, and Windsurf. These rules help ensure consistent coding practices, adherence to project-specific guidelines (such as Convex best practices), and overall improved development efficiency.

You can find these rule files in directories like `.github/instructions` and `.cursor/rules`. Please ensure your AI assistant is configured to use these rules for the best experience.

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
