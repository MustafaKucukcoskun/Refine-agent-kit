---
name: nextjs-app-router-patterns
description: Next.js App Router patterns — directory structure, Server/Client Components, Server Actions, route groups, Metadata API, image/font optimization, configuration. Use when building Next.js 14+ apps with App Router.
version: 1.0.0
domain: next-web
triggers: next, app router, server component, server action, layout, metadata
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Next.js App Router Patterns

> Actionable patterns for Next.js 14+ App Router. No theory — code first.

---

## 1. Directory Structure

```
app/
├── layout.tsx          # Root layout (required) — wraps ALL pages
├── page.tsx            # Home page (/)
├── loading.tsx         # Loading UI (Suspense boundary)
├── error.tsx           # Error boundary (client component)
├── not-found.tsx       # 404 page
├── global-error.tsx    # Root error boundary
├── dashboard/
│   ├── layout.tsx      # Nested layout
│   ├── page.tsx        # /dashboard
│   └── settings/
│       └── page.tsx    # /dashboard/settings
├── (marketing)/        # Route Group — no URL segment
│   ├── about/page.tsx  # /about
│   └── blog/page.tsx   # /blog
├── @modal/             # Parallel Route (slot)
│   └── default.tsx
└── api/
    └── route.ts        # Route Handler (GET, POST, etc.)
```

### Key Files

| File            | Purpose                                 | Component Type       |
| --------------- | --------------------------------------- | -------------------- |
| `layout.tsx`    | Shared UI, persists across navigations  | Server (default)     |
| `page.tsx`      | Unique UI for a route                   | Server (default)     |
| `loading.tsx`   | Instant loading state                   | Server               |
| `error.tsx`     | Error recovery UI                       | **Client** (must be) |
| `template.tsx`  | Like layout but re-mounts on navigation | Server               |
| `not-found.tsx` | 404 UI                                  | Server               |

---

## 2. Server Components vs Client Components

### Decision Rule

```
Default = Server Component (SC)
Add "use client" ONLY when you need:
├── useState, useEffect, useRef
├── onClick, onChange (event handlers)
├── Browser APIs (window, localStorage)
└── Third-party client libraries
```

### Pattern

```tsx
// Server Component (default) — can be async
export default async function ProductList() {
  const products = await db.product.findMany(); // Direct DB access
  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>
          <AddToCartButton productId={p.id} /> {/* Client boundary */}
        </li>
      ))}
    </ul>
  );
}
```

```tsx
"use client"; // Client Component — for interactivity

import { useState } from "react";

export function AddToCartButton({ productId }: { productId: string }) {
  const [pending, setPending] = useState(false);
  return (
    <button onClick={() => setPending(true)} disabled={pending}>
      {pending ? "Adding..." : "Add to Cart"}
    </button>
  );
}
```

### Rules

| ✅ Do                                | ❌ Don't                               |
| ------------------------------------ | -------------------------------------- |
| Keep "use client" at leaf components | Put "use client" in layout.tsx         |
| Pass serializable props to client    | Import server-only code in client      |
| Fetch data in SC, pass to CC         | Fetch data in client useEffect         |
| Use SC for static/SEO content        | Make everything client for convenience |

---

## 3. Server Actions

```tsx
// app/actions.ts
"use server";

import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  await db.post.create({ data: { title } });
  revalidatePath("/posts");
}
```

```tsx
// app/posts/new/page.tsx — Server Component with form
import { createPost } from "@/app/actions";

export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <button type="submit">Create</button>
    </form>
  );
}
```

### With useActionState (client-side feedback)

```tsx
"use client";

import { useActionState } from "react";
import { createPost } from "@/app/actions";

export function PostForm() {
  const [state, formAction, isPending] = useActionState(createPost, null);
  return (
    <form action={formAction}>
      <input name="title" required />
      <button disabled={isPending}>
        {isPending ? "Creating..." : "Create"}
      </button>
      {state?.error && <p>{state.error}</p>}
    </form>
  );
}
```

---

## 4. Route Groups & Parallel Routes

### Route Groups `(name)` — organize without affecting URL

```
app/
├── (auth)/
│   ├── login/page.tsx    → /login
│   └── register/page.tsx → /register
├── (dashboard)/
│   ├── layout.tsx        → dashboard-specific layout
│   └── settings/page.tsx → /settings
```

### Parallel Routes `@slot` — render multiple pages simultaneously

```
app/
├── layout.tsx           → receives {children, modal} as props
├── @modal/
│   ├── default.tsx      → rendered when no modal active
│   └── photo/[id]/page.tsx → /photo/123 in modal slot
└── page.tsx
```

```tsx
// app/layout.tsx
export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
```

---

## 5. Metadata API

### Static Metadata

```tsx
// app/about/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about our company",
  openGraph: { title: "About Us", description: "..." },
};
```

### Dynamic Metadata

```tsx
// app/products/[id]/page.tsx
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  return {
    title: product.name,
    description: product.description,
  };
}
```

---

## 6. Image & Font Optimization

### next/image

```tsx
import Image from "next/image";

// Local image (auto width/height)
import heroImg from "@/public/hero.webp";
<Image src={heroImg} alt="Hero" priority placeholder="blur" />

// Remote image (must specify dimensions)
<Image src="https://example.com/photo.jpg" alt="Photo" width={800} height={600} />
```

### next/font

```tsx
// app/layout.tsx
import { GeistSans, GeistMono } from "geist/font";
// OR with Google Fonts:
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>{children}</body>
    </html>
  );
}
```

---

## 7. next.config.ts

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image domains
  images: {
    remotePatterns: [{ protocol: "https", hostname: "example.com" }],
  },
  // Redirects
  async redirects() {
    return [{ source: "/old-path", destination: "/new-path", permanent: true }];
  },
  // Environment variables (public)
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Experimental features
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
```

---

## Quick Reference

| Task           | Pattern                              |
| -------------- | ------------------------------------ |
| Data fetching  | `async` SC + direct DB/API call      |
| Form mutation  | Server Action + `revalidatePath`     |
| Loading state  | `loading.tsx` or `useActionState`    |
| Error handling | `error.tsx` (client) + `notFound()`  |
| SEO            | `generateMetadata` + `<Image>`       |
| Shared layout  | `layout.tsx` (nests automatically)   |
| Auth gate      | Middleware (`middleware.ts` at root) |
