# Claude Code Dev Container

Run Claude Code in a secure, network-firewalled dev container with persistent authentication and agent teams support.

## Quick Start

1. Install the **Dev Containers** extension in VS Code or Cursor
2. Open this project
3. Open the Command Palette (`Cmd+Shift+P`) and select **Dev Containers: Reopen in Container**
4. Wait for the container to build and the firewall to initialize
5. Open a terminal and run `claude`

## First-Time Authentication

On the first launch, Claude Code will prompt you to authenticate:

```
claude
# Follow the OAuth URL in your browser
# Complete authentication
# Credentials are saved automatically
```

On subsequent container opens (including rebuilds), authentication is skipped — your credentials persist on a Docker volume.

## How It Works

```
  Host (VS Code / Cursor)              Dev Container
+-------------------------+     +--------------------------------+
|                         |     |  iptables firewall             |
| Dev Containers          |     |    (allowlist only)            |
|   extension             |     |                                |
|                         |     |  Docker volume                 |
| "Reopen in Container"   |---->|    /home/node/.claude          |
|                         |     |    (credentials persist here)  |
|                         |     |                                |
|                         |     |  Claude Code                   |
|                         |     |  Bun + Node.js 22              |
+-------------------------+     +--------------------------------+
```

- **`CLAUDE_CONFIG_DIR=/home/node/.claude`** tells Claude Code where to store credentials and settings
- **Docker volume** (`claude-code-config-*`) persists this directory across container rebuilds
- **Network firewall** (iptables + ipset) restricts outbound traffic to a domain allowlist
- **Scoped sudo** allows the container user to run only the firewall init script as root

## Allowed Network Destinations

| Domain | Purpose |
|--------|---------|
| `api.anthropic.com` | Claude API |
| `sentry.io` | Error reporting |
| `statsig.anthropic.com` | Feature flags |
| `statsig.com` | Feature flags |
| `registry.npmjs.org` | npm packages |
| `registry.yarnpkg.com` | Yarn fallback registry |
| `bun.sh` | Bun package registry |
| `marketplace.visualstudio.com` | VS Code extensions |
| `vscode.blob.core.windows.net` | VS Code extension downloads |
| `update.code.visualstudio.com` | VS Code updates |
| GitHub IPs | Git operations, API |
| Host network | Docker host communication |
| Localhost | Dev servers, internal services |

All other outbound connections are **rejected**.

## What's Inside

| Component | Detail |
|-----------|--------|
| Base image | Node.js 22 (Bookworm) |
| Package manager | Bun (latest) |
| Claude Code | Latest via npm |
| Shell | zsh with Powerlevel10k |
| Tools | git, vim, nano, jq, ripgrep, fzf, git-delta, gh |
| Firewall | iptables + ipset (domain allowlist) |
| Agent teams | `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` |
| Formatter | Biome (VS Code extension included) |

## Customization

### Adding a domain to the firewall

Edit `.devcontainer/init-firewall.sh` and add the domain to the `for domain in` loop:

```bash
for domain in \
    "api.anthropic.com" \
    ...
    "your-new-domain.com"; do
```

Then rebuild the container.

### Changing VS Code extensions

Edit `.devcontainer/devcontainer.json` under `customizations.vscode.extensions`:

```json
"extensions": [
  "anthropic.claude-code",
  "biomejs.biome",
  "eamodio.gitlens",
  "your.extension-id"
]
```

### Running with `--dangerously-skip-permissions`

This is not baked into the container. Run it explicitly in the terminal:

```
claude --dangerously-skip-permissions
```

## Troubleshooting

### Firewall blocks something you need

The terminal will show `REJECT` errors. Add the domain to `init-firewall.sh` and rebuild the container.

### Authentication issues

If credentials are lost or corrupted:

```bash
# Inside the container terminal
rm -rf /home/node/.claude/.credentials*
claude  # re-authenticate
```

### Credentials not persisting across rebuilds

Verify the volume mount exists:

```bash
docker volume ls | grep claude-code-config
```

If missing, reopen the container with the Dev Containers extension (it creates the volume automatically).

### Container fails to build

```bash
# Rebuild without cache
# Command Palette > Dev Containers: Rebuild Container Without Cache
```

### Port 3000 not accessible

The dev container forwards port 3000 for the Next.js dev server. If it's not working, check the **Ports** tab in VS Code's terminal panel.

## File Structure

| File | Purpose |
|------|---------|
| `.devcontainer/devcontainer.json` | Dev container configuration |
| `.devcontainer/Dockerfile` | Container image definition |
| `.devcontainer/init-firewall.sh` | Network firewall setup (iptables rules) |
