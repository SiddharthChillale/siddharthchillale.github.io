# Project Documentation for Agents

## Technology Stack

- **Runtime**: Bun (not npm or yarn)
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **Content**: MDX files with gray-matter for frontmatter parsing

## Package Manager

This project uses **Bun** as the package manager. All commands should use `bun` instead of `npm` or `yarn`.

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Lint code
bun run lint
```

## Project Structure

- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components
- `src/content/` - MDX content (blog posts, projects)
- `src/lib/` - Utility functions and content fetching logic

## Key Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production (static export) |
| `bun run lint` | Run ESLint |

## Static Export

The project is configured for static export (`output: "export"` in next.config.mjs). This means:
- Dynamic routes with `searchParams` require client-side handling
- Use client components with `useEffect` or `URLSearchParams` for query parameter handling