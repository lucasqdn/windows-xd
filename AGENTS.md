# AGENTS.md

This document contains guidelines and conventions for AI coding agents working in the windows-xd repository.

## Project Overview

windows-xd is a Next.js 16.1.6 application that reimagines an old Windows version on the web. The project uses:
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5 (strict mode enabled)
- **Styling**: Tailwind CSS 4
- **React**: Version 19.2.3
- **Fonts**: Geist Sans and Geist Mono via next/font

## Build, Lint & Test Commands

### Development
```bash
npm run dev          # Start development server on http://localhost:3000
```

### Build & Production
```bash
npm run build        # Build for production
npm start            # Start production server
```

### Linting
```bash
npm run lint         # Run ESLint with Next.js config
npx eslint .         # Run ESLint directly
npx eslint <file>    # Lint a specific file
```

### Testing
No test framework is currently configured. When tests are added:
- Use Jest or Vitest as the test runner
- Follow the pattern `*.test.{ts,tsx}` for test files
- Place tests alongside components or in `__tests__` directories
- Run single tests with: `npm test <test-file-path>`

## TypeScript Configuration

### Compiler Settings
- **Target**: ES2017
- **Strict mode**: Enabled (all strict checks on)
- **Module**: ESNext with bundler resolution
- **JSX**: react-jsx
- **No emit**: true (Next.js handles compilation)

### Path Aliases
- `@/*` maps to the root directory
- Example: `import { Component } from '@/app/components/Component'`

## Code Style Guidelines

### File Organization
```
app/
  ├── (route-groups)/      # Route groups for organization
  ├── components/          # Shared components (when created)
  ├── lib/                 # Utility functions (when created)
  ├── hooks/               # Custom React hooks (when created)
  ├── types/               # Shared TypeScript types (when created)
  ├── layout.tsx           # Root layout
  ├── page.tsx             # Routes
  └── globals.css          # Global styles
```

### Imports
**Order**: External packages → Next.js modules → Local modules → Types → Styles
```typescript
import { useState } from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { MyComponent } from "@/app/components/MyComponent";
import type { MyType } from "@/app/types";
import "./styles.css";
```

**Prefer named imports** for clarity except for default exports from Next.js (Image, Link, etc.)

### Naming Conventions

**Files**:
- Components: PascalCase (e.g., `MyComponent.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Pages: lowercase (e.g., `page.tsx`, `layout.tsx`)
- CSS: lowercase with hyphens (e.g., `globals.css`)

**Code**:
- Components: PascalCase (`function MyComponent()`)
- Functions/variables: camelCase (`const myFunction`, `let myVariable`)
- Constants: UPPER_SNAKE_CASE (`const API_URL`)
- Types/Interfaces: PascalCase (`type User`, `interface ApiResponse`)
- Private functions: prefix with `_` (`function _helperFunction()`)

### TypeScript Types

**Prefer explicit types** for function parameters and return values:
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

**Use type annotations** for complex objects:
```typescript
type Props = {
  title: string;
  count: number;
  onClose?: () => void;
};

export default function MyComponent({ title, count, onClose }: Props) {
  // ...
}
```

**Prefer `type` over `interface`** unless you need declaration merging or extension.

### React Components

**Use function components** with TypeScript:
```typescript
type ButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export default function Button({ label, onClick, disabled }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
```

**Export components as default** for pages, named exports for reusable components.

**Use Readonly for children props**:
```typescript
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div>{children}</div>;
}
```

### Styling with Tailwind

**Use Tailwind utility classes** directly in JSX:
```typescript
<div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
```

**Order classes logically**: Layout → Spacing → Typography → Colors → Effects
- Layout: `flex`, `grid`, `block`
- Spacing: `p-4`, `m-2`, `gap-4`
- Typography: `text-lg`, `font-bold`
- Colors: `bg-white`, `text-black`
- Effects: `hover:`, `dark:`, `transition-colors`

**Use CSS variables** for theme values in `globals.css`:
```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}
```

### Error Handling

**Use try-catch** for async operations:
```typescript
try {
  const data = await fetchData();
  return data;
} catch (error) {
  console.error("Failed to fetch data:", error);
  throw error;
}
```

**Validate props** when necessary using type guards or runtime checks.

## Next.js Conventions

### App Router
- Use `page.tsx` for routes
- Use `layout.tsx` for shared layouts
- Use `loading.tsx` for loading states
- Use `error.tsx` for error boundaries

### Metadata
Export metadata for SEO:
```typescript
export const metadata: Metadata = {
  title: "Page Title",
  description: "Page description",
};
```

### Image Optimization
Always use `next/image` instead of `<img>`:
```typescript
import Image from "next/image";

<Image src="/image.svg" alt="Description" width={100} height={100} priority />
```

## Git Workflow

- **Commit messages**: Use conventional format (feat:, fix:, docs:, refactor:, etc.)
- **Branch strategy**: Feature branches merged into main
- Keep commits atomic and focused on single changes

## Important Notes

- **Strict TypeScript**: All type errors must be resolved before committing
- **No unused variables**: ESLint will catch these
- **Accessibility**: Include alt text for images, semantic HTML
- **Performance**: Use dynamic imports for large components
- **Dark mode**: Support both light and dark themes using Tailwind's `dark:` variant
