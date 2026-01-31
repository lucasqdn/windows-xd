# Contributing to windows-xd

Thank you for contributing to windows-xd! This guide will help you get started.

## Development Workflow

### 1. Initial Setup

```bash
# Clone the repository
git clone <repo-url>
cd windows-xd

# Run automated setup
./setup.sh

# Or manually:
nvm use              # Use correct Node.js version
npm ci               # Install exact dependency versions
cp .env.example .env.local
```

### 2. Creating a New Feature

```bash
# Create a new branch
git checkout -b feature/my-feature

# Make your changes
# ...

# Test your changes
npm run dev
npm run lint
npm run build
```

### 3. Committing Changes

We use [Conventional Commits](https://www.conventionalcommits.org/) format:

```bash
# Format: <type>: <description>

git commit -m "feat: add new feature"
git commit -m "fix: resolve bug in component"
git commit -m "docs: update README"
git commit -m "refactor: improve code structure"
git commit -m "test: add unit tests"
```

**Common types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### 4. Adding Dependencies

**IMPORTANT**: Always commit `package-lock.json` with `package.json`

```bash
# Install new dependency
npm install <package-name>

# Commit BOTH files
git add package.json package-lock.json
git commit -m "feat: add <package-name> for <reason>"
```

### 5. Pulling Latest Changes

When teammates add dependencies:

```bash
# Pull latest changes
git pull origin main

# Reinstall dependencies with exact versions
npm ci
```

**Never use `npm install` after pulling!** Use `npm ci` to ensure exact versions.

## Code Style Guidelines

### TypeScript

- ✅ Use explicit types for function parameters and return values
- ✅ Use `type` over `interface` (unless extending)
- ✅ Enable strict mode (already configured)

```typescript
// Good
function formatDate(date: Date): string {
  return date.toISOString();
}

// Avoid
function formatDate(date) {
  return date.toISOString();
}
```

### React Components

- ✅ Use function components
- ✅ Use TypeScript for props
- ✅ Export as default for pages, named for reusable components

```typescript
type ButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export default function Button({ label, onClick, disabled }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
}
```

### Imports

Order: External packages → Next.js → Local → Types → Styles

```typescript
import { useState } from "react";
import Image from "next/image";
import { MyComponent } from "@/app/components/MyComponent";
import type { MyType } from "@/app/types";
import "./styles.css";
```

### Naming Conventions

- **Files**: PascalCase for components (`MyComponent.tsx`), camelCase for utilities (`formatDate.ts`)
- **Components**: PascalCase (`function MyComponent()`)
- **Functions/Variables**: camelCase (`const myFunction`)
- **Constants**: UPPER_SNAKE_CASE (`const API_URL`)
- **Types**: PascalCase (`type User`, `interface ApiResponse`)

### Tailwind CSS

Use utility classes directly in JSX:

```typescript
<div className="flex min-h-screen items-center justify-center">
```

Order: Layout → Spacing → Typography → Colors → Effects

## Project Structure

```
windows-xd/
├── app/
│   ├── components/
│   │   ├── apps/          # Application windows
│   │   ├── Desktop.tsx    # Main desktop component
│   │   └── Window.tsx     # Window wrapper
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript types
│   └── page.tsx
├── server.ts              # Custom Next.js + Socket.IO server
├── .planning/             # Project documentation
└── package.json
```

## Testing

Before submitting:

1. ✅ Run the dev server: `npm run dev`
2. ✅ Test in browser at http://localhost:3000
3. ✅ Run linter: `npm run lint`
4. ✅ Build successfully: `npm run build`

## Common Issues

### Module not found after pulling

```bash
npm ci
```

### Port 3000 already in use

```bash
lsof -i :3000
kill -9 <PID>
```

### TypeScript errors

```bash
npx tsc --noEmit
```

## Getting Help

- Check existing issues on GitHub
- Read the planning docs in `.planning/`
- Ask in team chat/discussion

## Code Review Process

1. Create feature branch
2. Make changes with atomic commits
3. Push to remote
4. Create pull request
5. Wait for review
6. Address feedback
7. Merge when approved

---

**Happy coding!** 🚀
