# LoftCommunity Design System

> Visual design system and theming reference for the LoftCommunity frontend.
> Source: `react-loft/` — extracted 2026-07-23.

---

## 1. Overview

LoftCommunity is a dark-first job portal UI built on a near-black canvas with an emerald green accent palette, glassmorphism card surfaces, and scroll-triggered reveal animations. The component library is built on **shadcn/ui** (Radix primitives + Tailwind CSS + CVA), with **Framer Motion** for animation and **lucide-react** for iconography.

**Tech stack:**

| Layer | Library |
|---|---|
| Framework | React 18 + Vite 6 |
| Styling | Tailwind CSS 3.4 + tailwindcss-animate |
| Components | shadcn/ui (Radix UI primitives) |
| Variants | class-variance-authority (CVA) 0.7 |
| Animation | Framer Motion 11 |
| Forms | react-hook-form 7 + Zod 3 |
| Icons | lucide-react 0.468 |
| Routing | react-router-dom 7 |
| Toasts | Sonner |
| Drawer | Vaul |
| Command palette | cmdk 0.2 |
| Resizable panels | react-resizable-panels 2 |
| Class merging | clsx + tailwind-merge (via `cn()` utility) |

**Design philosophy:** Dark-only (no light mode toggle in practice). All surfaces use semi-transparent black overlays with `backdrop-blur` for depth. The emerald green (`hsl(152, 76%, 40%)`) serves as the single accent color used across primary actions, active states, badges, progress bars, and focus rings.

---

## 2. Color System

### 2.1 CSS Custom Properties (`src/styles/globals.css`)

All colors are defined as HSL values (without the `hsl()` wrapper) on the `:root` selector. Tailwind consumes them via `hsl(var(--token))`.

| Token | HSL Value | Usage |
|---|---|---|
| `--background` | `0 0% 3.9%` | Page background (`#0a0a0a`) |
| `--foreground` | `0 0% 98%` | Primary text (`#fafafa`) |
| `--card` | `0 0% 3.9%` | Card surface background |
| `--card-foreground` | `0 0% 98%` | Card text |
| `--popover` | `0 0% 3.9%` | Popover/dropdown surface |
| `--popover-foreground` | `0 0% 98%` | Popover text |
| `--primary` | `152 76% 40%` | Emerald green accent (buttons, active states) |
| `--primary-foreground` | `0 0% 98%` | Text on primary surfaces |
| `--secondary` | `0 0% 14.9%` | Secondary surface (dark gray) |
| `--secondary-foreground` | `0 0% 98%` | Text on secondary surfaces |
| `--muted` | `0 0% 14.9%` | Muted surface (same as secondary) |
| `--muted-foreground` | `0 0% 63.9%` | Subdued text (`#a3a3a3`) |
| `--accent` | `152 50% 30%` | Accent (darker emerald, used for hover/active backgrounds) |
| `--accent-foreground` | `0 0% 98%` | Text on accent surfaces |
| `--destructive` | `0 62.8% 30.6%` | Error/danger red |
| `--destructive-foreground` | `0 0% 98%` | Text on destructive surfaces |
| `--border` | `0 0% 14.9%` | Border color (dark gray) |
| `--input` | `0 0% 14.9%` | Input border color |
| `--ring` | `152 76% 40%` | Focus ring color (matches primary) |
| `--radius` | `0.5rem` | Base border radius (8px) |

### 2.2 Tailwind Color Extensions (`tailwind.config.ts`)

Every Tailwind color alias maps directly to a CSS custom property:

| Tailwind Class | Resolves To |
|---|---|
| `bg-background` | `hsl(0 0% 3.9%)` |
| `text-foreground` | `hsl(0 0% 98%)` |
| `bg-primary` | `hsl(152 76% 40%)` |
| `text-primary` | `hsl(152 76% 40%)` |
| `bg-primary-foreground` | `hsl(0 0% 98%)` |
| `bg-secondary` | `hsl(0 0% 14.9%)` |
| `bg-muted` | `hsl(0 0% 14.9%)` |
| `text-muted-foreground` | `hsl(0 0% 63.9%)` |
| `bg-accent` | `hsl(152 50% 30%)` |
| `text-accent-foreground` | `hsl(0 0% 98%)` |
| `bg-destructive` | `hsl(0 62.8% 30.6%)` |
| `bg-card` | `hsl(0 0% 3.9%)` |
| `bg-popover` | `hsl(0 0% 3.9%)` |
| `border-border` | `hsl(0 0% 14.9%)` |
| `border-input` | `hsl(0 0% 14.9%)` |
| `ring-ring` | `hsl(152 76% 40%)` |

### 2.3 Hardcoded Emerald Utilities

Beyond the CSS variable tokens, many components use Tailwind's emerald palette directly for gradient overlays, badge tints, and hover states:

| Utility | Approximate HSL | Usage |
|---|---|---|
| `emerald-400` | `160 84% 60%` | Focus rings, active text, icon color, links |
| `emerald-500` | `160 84% 50%` | Badge backgrounds, active state fills, gradient start |
| `emerald-600` | `160 84% 40%` | Button backgrounds, switch checked, tab active |
| `emerald-700` | `160 84% 30%` | Button hover states |
| `emerald-900` | `160 84% 15%` | Shadow colors, CTA banner gradients |
| `emerald-500/20` | — | Glass icon container backgrounds |
| `emerald-500/10` | — | Sidebar active item background, section glows |

### 2.4 Additional Accent Colors (Hardcoded)

Used only in JobCategories gradients and avatar backgrounds:

| Color | Usage |
|---|---|
| `blue-500/20` to `blue-600/10` | Software Development category icon bg |
| `purple-500/20` to `purple-600/10` | Data Science category |
| `pink-500/20` to `pink-600/10` | Design category |
| `sky-500/20` to `sky-600/10` | Mobile Development category |
| `cyan-500/20` to `cyan-600/10` | Cloud Computing category |
| `orange-500/20` to `orange-600/10` | Business Analyst category |
| `yellow-500/20` to `yellow-600/10` | Project Management category |
| `red-500/20` to `red-600/10` | Healthcare category |
| `indigo-500/20` to `indigo-600/10` | Cybersecurity category |
| `blue-500 → blue-700` | Testimonial avatar gradient |
| `purple-500 → purple-700` | Testimonial avatar gradient |
| `amber-500/10`, `amber-500/20` | Email verification banner |
| `red-400`, `red-500/10` | Sign Out buttons, form error states |

### 2.5 Surface Transparency Patterns

The design system uses consistent alpha transparency for depth layers:

| Pattern | CSS | Usage |
|---|---|---|
| `bg-black/40` | Black at 40% opacity | Navbar header, Card base |
| `bg-black/50` | Black at 50% opacity | glass-hover state |
| `bg-black/60` | Black at 60% opacity | Hero search bar, mobile drawer backdrop |
| `bg-black/80` | Black at 80% opacity | Dialog/drawer overlay |
| `bg-white/5` | White at 5% opacity | Input backgrounds, tab list, ghost hover |
| `bg-white/10` | White at 10% opacity | Sidebar border, separator, skeleton, border utility |
| `border-white/[0.05]` | White at 5% | Card borders, footer border, subtle dividers |
| `border-white/[0.08]` | White at 8% | Hero search bar border |
| `border-white/10` | White at 10% | Dialog borders, drawer borders, sidebar borders |
| `border-emerald-500/20` | Emerald at 20% | Badge border, active hover borders |
| `border-emerald-500/30` | Emerald at 30% | Card hover border |

---

## 3. Typography

### 3.1 Font Stack

```css
body {
  font-family: system-ui, -apple-system, sans-serif;
}
```

No custom web fonts are loaded. The system font stack provides native rendering on each platform.

### 3.2 Type Scale

| Element | Tailwind Classes | Size | Weight |
|---|---|---|---|
| Hero heading | `text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight` | 2.25rem → 6rem | 700 |
| Section title | `text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight` | 1.875rem → 3rem | 700 |
| Section subtitle | `text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto mt-4` | 1rem → 1.125rem | 400 |
| Card heading | `font-semibold text-sm sm:text-base text-white` | 0.875rem → 1rem | 600 |
| Body text | `text-sm sm:text-base text-neutral-400` | 0.875rem → 1rem | 400 |
| Small/caption | `text-xs text-neutral-500` | 0.75rem | 400 |
| Nav link | `text-sm` | 0.875rem | 400–500 |
| Button default | `text-sm font-medium` | 0.875rem | 500 |
| Button large | `text-base` | 1rem | 500 |
| Button XL | `text-lg` | 1.125rem | 500 |
| Badge | `text-xs font-semibold` | 0.75rem | 600 |

### 3.3 Text Colors

| Role | Class | Usage |
|---|---|---|
| Primary text | `text-white` | Headings, card titles, nav active, dropdown user name |
| Secondary text | `text-neutral-300` | Testimonial body, CTA descriptions |
| Muted text | `text-neutral-400` | Subtitles, descriptions, nav links, form labels |
| Subtle text | `text-neutral-500` | Captions, timestamps, job counts, placeholder text |
| Very subtle | `text-neutral-600` | Arrow icons before hover, decorative step numbers |
| Accent text | `text-emerald-400` | Active links, gradient text, team roles, interactive highlights |
| Gradient text | `text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600` | Section titles, hero highlight |
| Destructive text | `text-red-400` | Sign out buttons, form validation errors |
| Amber text | `text-amber-400` | Email verification banner icon |

---

## 4. Spacing & Layout

### 4.1 Container

```ts
// tailwind.config.ts
container: {
  center: true,
  padding: '1rem',       // 16px on mobile
  screens: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1400px',     // max container width
  },
}
```

### 4.2 Section Spacing

| Pattern | Classes | Sizes |
|---|---|---|
| `.section-padding` | `py-16 md:py-20 lg:py-24` | 64px → 80px → 96px |
| Hero sections | `min-h-screen` or `pt-28 sm:pt-32 pb-16 sm:pb-20` | Full viewport or 112px/128px top, 64px/80px bottom |
| Footer padding | `py-12 md:py-16` | 48px → 64px |
| Card padding | `p-5 sm:p-6 md:p-8` | 20px → 24px → 32px |

### 4.3 Grid Systems

| Context | Grid Classes |
|---|---|
| Hero page | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6` |
| Job categories | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4` |
| Testimonials | `grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6` |
| Team members | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6` |
| Footer columns | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12` |
| Dashboard stat cards | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4` |
| Job cards | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6` |
| Contact form grid | `grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5` |

### 4.4 Border Radius

| Token | Value | Tailwind |
|---|---|---|
| `--radius` | `0.5rem` (8px) | `rounded-lg` |
| `md` | `calc(0.5rem - 2px)` (6px) | `rounded-md` |
| `sm` | `calc(0.5rem - 4px)` (4px) | `rounded-sm` |
| `lg` | `1rem` (16px) | `rounded-xl` |
| `xl` | `1.5rem` (24px) | `rounded-2xl` |
| Full | `9999px` | `rounded-full` |

---

## 5. Component Library

All components are in `src/components/ui/`. Variants are defined using **class-variance-authority (CVA)** where applicable.

### 5.1 Accordion

| Part | Radix Primitive |
|---|---|
| `Accordion` | `@radix-ui/react-accordion` Root |
| `AccordionItem` | `@radix-ui/react-accordion` Item |
| `AccordionTrigger` | `@radix-ui/react-accordion` Trigger |
| `AccordionContent` | `@radix-ui/react-accordion` Content |

**Styling:**
- `AccordionItem`: `border-b` (bottom border separator)
- `AccordionTrigger`: `flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline`
- Chevron rotates 180° on open via `[&[data-state=open]>svg]:rotate-180`
- `AccordionContent`: animates height using `animate-accordion-down` / `animate-accordion-up`
- Custom class `.accordion-chevron[data-state="open"]` applies `transform: rotate(180deg)`

**Icons:** `ChevronDown` from lucide-react

### 5.2 Badge

**CVA Variants:**

| Variant | Classes |
|---|---|
| `default` | `border-transparent bg-emerald-500/20 text-emerald-300` |
| `secondary` | `border-transparent bg-secondary text-secondary-foreground` |
| `destructive` | `border-transparent bg-destructive/20 text-destructive` |
| `outline` | `text-foreground border-white/10` |
| `featured` | `border-transparent bg-gradient-to-r from-emerald-500/30 to-emerald-600/30 text-emerald-300` |

**Base:** `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold`

### 5.3 Button

**CVA Variants:**

| Variant | Classes |
|---|---|
| `default` | `bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-900/30` |
| `destructive` | `bg-destructive text-destructive-foreground hover:bg-destructive/90` |
| `outline` | `border border-white/10 bg-transparent hover:bg-white/5 text-foreground` |
| `secondary` | `bg-secondary text-secondary-foreground hover:bg-secondary/80` |
| `ghost` | `hover:bg-white/5 text-muted-foreground hover:text-foreground` |
| `link` | `text-emerald-400 underline-offset-4 hover:underline` |
| `gradient` | `bg-gradient-to-r from-emerald-500 to-emerald-700 text-white hover:from-emerald-600 hover:to-emerald-800 shadow-lg shadow-emerald-900/30` |

**Size Variants:**

| Size | Classes |
|---|---|
| `default` | `h-10 px-4 py-2` |
| `sm` | `h-9 rounded-md px-3 text-xs` |
| `lg` | `h-12 px-8 text-base rounded-xl` |
| `xl` | `h-14 px-10 text-lg rounded-xl` |
| `icon` | `h-10 w-10` |

**Base:** `inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]`

**Focus:** `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background`

**Props:** `asChild?: boolean` (uses Radix `Slot` for composition)

### 5.4 Card

| Part | Styling |
|---|---|
| `Card` | `rounded-xl border border-white/[0.05] bg-black/40 backdrop-blur-xl` |
| `CardHeader` | `flex flex-col space-y-1.5 p-6` |
| `CardTitle` | `font-semibold leading-none tracking-tight` |
| `CardDescription` | `text-sm text-muted-foreground` |
| `CardContent` | `p-6 pt-0` |
| `CardFooter` | `flex items-center p-6 pt-0` |

**No CVA variants.** Card is the base glassmorphism surface. Customization is via `className` prop.

### 5.5 Command

| Part | Radix/Library |
|---|---|
| `Command` | `cmdk` CommandPrimitive |
| `CommandDialog` | Wraps `Dialog` + `DialogContent` + `Command` |
| `CommandInput` | cmdk Input with Search icon prefix |
| `CommandList` | cmdk List, max-h 300px |
| `CommandEmpty` | Empty state placeholder |
| `CommandGroup` | cmdk Group with heading styling |
| `CommandItem` | cmdk Item with aria-selected styles |
| `CommandShortcut` | Shortcut text (ml-auto) |
| `CommandSeparator` | `h-px bg-border` |

**Command base:** `flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground`

### 5.6 Dialog

| Part | Radix Primitive | Styling |
|---|---|---|
| `Dialog` | `@radix-ui/react-dialog` Root | — |
| `DialogTrigger` | Dialog Trigger | — |
| `DialogPortal` | Dialog Portal | — |
| `DialogClose` | Dialog Close | — |
| `DialogOverlay` | Dialog Overlay | `fixed inset-0 z-50 bg-black/80 backdrop-blur-sm` + fade animations |
| `DialogContent` | Dialog Content | `fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/10 bg-neutral-950 p-6 shadow-lg sm:rounded-xl` + zoom/slide animations |
| `DialogHeader` | — | `flex flex-col space-y-1.5 text-center sm:text-left` |
| `DialogFooter` | — | `flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2` |
| `DialogTitle` | Dialog Title | `text-lg font-semibold leading-none tracking-tight` |
| `DialogDescription` | Dialog Description | `text-sm text-muted-foreground` |

**Close button:** Absolute positioned X icon, `right-4 top-4`, opacity 70, hover opacity 100.

### 5.7 Drawer

| Part | Library | Styling |
|---|---|---|
| `Drawer` | `vaul` Drawer.Root | `shouldScaleBackground` defaults to `true` |
| `DrawerTrigger` | vaul Trigger | — |
| `DrawerPortal` | vaul Portal | — |
| `DrawerClose` | vaul Close | — |
| `DrawerOverlay` | vaul Overlay | `fixed inset-0 z-50 bg-black/80` |
| `DrawerContent` | vaul Content | `fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background` + drag handle bar |
| `DrawerHeader` | — | `grid gap-1.5 p-4 text-center sm:text-left` |
| `DrawerFooter` | — | `mt-auto flex flex-col gap-2 p-4` |
| `DrawerTitle` | vaul Title | `text-lg font-semibold leading-none tracking-tight` |
| `DrawerDescription` | vaul Description | `text-sm text-muted-foreground` |

### 5.8 DropdownMenu

| Part | Radix Primitive |
|---|---|
| `DropdownMenu` | `@radix-ui/react-dropdown-menu` Root |
| `DropdownMenuTrigger` | Trigger |
| `DropdownMenuGroup` | Group |
| `DropdownMenuPortal` | Portal |
| `DropdownMenuSub` | Sub |
| `DropdownMenuRadioGroup` | RadioGroup |
| `DropdownMenuSubTrigger` | SubTrigger — `rounded-sm px-2 py-1.5 text-sm`, `inset` prop adds `pl-8` |
| `DropdownMenuSubContent` | SubContent — `min-w-[8rem] rounded-md border bg-popover p-1 shadow-lg` + animations |
| `DropdownMenuContent` | Content — `min-w-[8rem] rounded-md border bg-popover p-1 shadow-md`, `sideOffset={4}` |
| `DropdownMenuItem` | Item — `rounded-sm px-2 py-1.5 text-sm`, `inset` prop |
| `DropdownMenuCheckboxItem` | CheckboxItem — `rounded-sm py-1.5 pl-8 pr-2`, Check icon indicator |
| `DropdownMenuRadioItem` | RadioItem — `rounded-sm py-1.5 pl-8 pr-2`, Circle dot indicator |
| `DropdownMenuLabel` | Label — `px-2 py-1.5 text-sm font-semibold` |
| `DropdownMenuSeparator` | Separator — `-mx-1 my-1 h-px bg-muted` |
| `DropdownMenuShortcut` | — | `ml-auto text-xs tracking-widest opacity-60` |

### 5.9 Form

| Part | Description |
|---|---|
| `Form` | Re-export of `react-hook-form` `FormProvider` |
| `FormField` | Wraps `Controller` with `FormFieldContext` |
| `useFormField()` | Returns field state, IDs for accessibility |
| `FormItem` | `space-y-2` div, generates unique ID |
| `FormLabel` | Uses `Label`, adds `text-destructive` on error |
| `FormControl` | Radix `Slot`, sets `aria-describedby`, `aria-invalid` |
| `FormDescription` | `text-sm text-muted-foreground` paragraph |
| `FormMessage` | `text-sm font-medium text-destructive` paragraph, renders `error.message` |

### 5.10 Input

**Styling:** `flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200`

**No CVA variants.**

### 5.11 Label

**Radix Primitive:** `@radix-ui/react-label`

**Styling:** `text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70`

### 5.12 Logo

| Export | Description |
|---|---|
| `Logo` | `<img>` tag, default 40×40, `object-contain` |
| `LogoWithText` | `<Link to="/">` wrapping Logo + "LoftCommunity" text (hidden on `sm:hidden`), `flex items-center gap-2 shrink-0` |
| `LogoIcon` | `<Link to="/">` wrapping just the logo image |

**Props:** `className?: string`, `width?: number`, `height?: number`

### 5.13 MultipleSelector

**Description:** Multi-select combobox built on `cmdk` + `Badge`.

**Props:**
- `value?: Option[]` — controlled selected options
- `defaultOptions?: Option[]` — initial options
- `options?: Option[]` — option list
- `placeholder?: string`
- `onSearch?: (value: string) => Promise<Option[]>` — async search
- `onChange?: (options: Option[]) => void`
- `maxSelected?: number` — limit selections
- `creatable?: boolean` — allow creating new options
- `badgeClassName?: string`
- `hidePlaceholderWhenSelected?: boolean`

**Styling:** Border container with `rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring`. Selected items rendered as `Badge` components with X button.

### 5.14 Popover

| Part | Radix Primitive |
|---|---|
| `Popover` | `@radix-ui/react-popover` Root |
| `PopoverTrigger` | Popover Trigger |
| `PopoverContent` | Popover Content — `z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md`, `align="center"`, `sideOffset={4}`, directional animations |

### 5.15 Progress

**Radix Primitive:** `@radix-ui/react-progress`

**Styling:**
- Root: `relative h-2 w-full overflow-hidden rounded-full bg-white/10`
- Indicator: `h-full w-full flex-1 bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500`

### 5.16 ProtectedRoute

**Description:** Auth guard component. Shows `Loader2` spinner while loading, redirects to `/login` when unauthenticated, redirects to appropriate dashboard based on `requiredRole`.

**Props:** `requiredRole?: 'applicant' | 'employer'`

**Loading state:** `min-h-screen flex items-center justify-center bg-[#0a0a0a]` with `Loader2 className="h-8 w-8 animate-spin text-emerald-400"`

### 5.17 Resizable

| Part | Library |
|---|---|
| `ResizablePanelGroup` | `react-resizable-panels` PanelGroup — `flex h-full w-full` |
| `ResizablePanel` | Panel (re-export) |
| `ResizableHandle` | PanelResizeHandle — with optional `withHandle` prop showing GripVertical icon |

**Handle styling:** `relative flex w-px items-center justify-center bg-border` with vertical variant support.

### 5.18 ScrollSplitCard

**Description:** Framer Motion card that scales and fades based on scroll position.

**Animations:**
- `scale`: `[0.8, 1, 0.8]` across scroll progress
- `opacity`: `[0.3, 1, 1, 0.3]` across scroll progress
- `y`: `[100, 0, -100]` across scroll progress

### 5.19 Select

| Part | Radix Primitive |
|---|---|
| `Select` | `@radix-ui/react-select` Root |
| `SelectGroup` | Select Group |
| `SelectValue` | Select Value |
| `SelectTrigger` | Select Trigger — `h-10 rounded-md border border-input bg-background px-3 py-2 text-sm` |
| `SelectContent` | Select Content — `max-h-96 rounded-md border bg-popover shadow-md`, popper position support |
| `SelectLabel` | Select Label — `py-1.5 pl-8 pr-2 text-sm font-semibold` |
| `SelectItem` | Select Item — `rounded-sm py-1.5 pl-8 pr-2 text-sm`, Check indicator |
| `SelectSeparator` | Select Separator — `-mx-1 my-1 h-px bg-muted` |
| `SelectScrollUpButton` | ChevronUp icon |
| `SelectScrollDownButton` | ChevronDown icon |

### 5.20 Separator

**Radix Primitive:** `@radix-ui/react-separator`

**Styling:** `shrink-0 bg-white/10`
- Horizontal: `h-[1px] w-full`
- Vertical: `h-full w-[1px]`

**Props:** `orientation?: 'horizontal' | 'vertical'`, `decorative?: boolean` (default `true`)

### 5.21 Skeleton

**Styling:** `animate-pulse rounded-md bg-white/10`

**Accessibility:** `aria-hidden="true"`

### 5.22 Sonner (Toaster)

**Styling:** Theme `dark`, custom classNames:
- Toast: `bg-background text-foreground border-border shadow-lg`
- Description: `text-muted-foreground`
- Action button: `bg-primary text-primary-foreground`
- Cancel button: `bg-muted text-muted-foreground`

### 5.23 Switch

**Radix Primitive:** `@radix-ui/react-switch`

**Styling:**
- Root: `inline-flex h-[24px] w-[44px] rounded-full border-2 border-transparent transition-colors`
  - Checked: `bg-emerald-600`
  - Unchecked: `bg-white/10`
  - Focus: `focus-visible:ring-2 focus-visible:ring-emerald-400`
- Thumb: `pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform`
  - Checked: `translate-x-5`
  - Unchecked: `translate-x-0`

### 5.24 Tabs

| Part | Radix Primitive | Styling |
|---|---|---|
| `Tabs` | `@radix-ui/react-tabs` Root | — |
| `TabsList` | Tabs List | `inline-flex h-10 items-center justify-center rounded-lg bg-white/5 p-1 text-muted-foreground` |
| `TabsTrigger` | Tabs Trigger | `rounded-md px-3 py-1.5 text-sm font-medium` · Active: `bg-emerald-600 text-white shadow-sm` |
| `TabsContent` | Tabs Content | `mt-2 ring-offset-background` |

### 5.25 Textarea

**Styling:** `flex min-h-[80px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none`

### 5.26 Tooltip

| Part | Radix Primitive |
|---|---|
| `TooltipProvider` | `@radix-ui/react-tooltip` Provider |
| `Tooltip` | Tooltip Root |
| `TooltipTrigger` | Tooltip Trigger |
| `TooltipContent` | Tooltip Content — `rounded-md border bg-popover px-3 py-1.5 text-sm shadow-md`, `sideOffset={4}`, directional slide + fade + zoom animations |

---

## 6. Layout Components

All in `src/components/layout/`.

### 6.1 Navbar

**Structure:**
```
<header class="fixed right-0 left-0 top-0 z-[100]">
  <div class="bg-black/40 backdrop-blur-xl border-b border-white/[0.05]">
    <div class="container flex items-center justify-between h-16 sm:h-20">
      [LogoWithText] | [Nav links] | [Auth buttons / NavbarDropdown]
    </div>
  </div>
  [Mobile drawer via AnimatePresence + motion.nav]
</header>
```

**Responsive behavior:**
- **Desktop (lg+):** Horizontal nav links, Sign In/Get Started buttons or NavbarDropdown
- **Mobile (<lg):** Hamburger menu icon, slides in a 280px right-side drawer

**Mobile drawer:** `fixed right-0 top-16 sm:top-20 bottom-0 w-[280px] max-w-[85vw] bg-neutral-950 border-l border-white/10 p-6 flex flex-col gap-2`. Animated with spring physics (`stiffness: 300, damping: 30`).

**Nav links:** Home, Jobs, About, Contact. Active state: `text-white bg-white/10`. Inactive: `text-neutral-400 hover:text-white hover:bg-white/5`.

**Authenticated mobile drawer sections:**
- Employer section (if `user.isEmployer`): Employer Dashboard, Hiring Workflow, Company Profile
- Account section: Dashboard, Profile, Saved Jobs, Messages
- Sign Out button (red)

### 6.2 NavbarDropdown

**Structure:** Custom dropdown (not Radix DropdownMenu), positioned `absolute right-0 top-full mt-2 w-56`.

**Styling:** `rounded-xl border border-white/10 bg-neutral-950 backdrop-blur-xl shadow-xl overflow-hidden`

**Sections:**
- User info header (name + email)
- Employer items (if `user.isEmployer`): Employer Dashboard, Hiring Workflow, Company Profile
- Standard items: Dashboard, Profile, Saved Jobs, Messages, Notifications, Settings
- Sign Out (red)

**Avatar:** Gradient circle with user initials, `bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 text-emerald-400`

**Animation:** Framer Motion fade + y-slide + scale, 150ms duration

### 6.3 Sidebar

**Two modes:**
1. **Desktop (md+):** Fixed 224px (`w-56`) sidebar, `hidden md:flex`, `border-r border-white/10 bg-background`
2. **Mobile:** Overlay drawer, `fixed inset-0 z-50 md:hidden`, slides from left (`-100%` to `0`), spring physics

**Role-based links:**
- **Applicant:** Dashboard, Jobs, Applications, Saved Jobs, Messages, Settings
- **Employer:** Dashboard, My Jobs, Candidates, Company, Messages, Settings

**Active state:** `bg-emerald-500/10 text-emerald-400`
**Inactive state:** `text-muted-foreground hover:text-foreground hover:bg-muted`

**Footer area:** Notifications link + Sign Out button (red on hover)

### 6.4 DashboardShell

**Structure:**
```
<div class="flex h-screen overflow-hidden bg-[#0a0a0a]">
  [Sidebar] (desktop)
  [Sidebar mobile] (mobile overlay)
  <div class="flex-1 flex flex-col overflow-hidden">
    <header> [MenuIcon button (mobile)] [Infobar] </header>
    <main class="flex-1 overflow-y-auto">
      <AnimatePresence> <Outlet /> </AnimatePresence>
    </main>
  </div>
</div>
```

**Page transitions:** Framer Motion opacity fade, 150ms, respects reduced motion.

### 6.5 PageShell

**Structure:**
```
<div class="flex flex-col min-h-screen bg-[#0a0a0a]">
  <Navbar />
  <motion.main class="flex-1"> {children} </motion.main>
  <Footer /> (optional, default true)
</div>
```

**Page entrance animation:** `opacity: 0, y: 10` → `opacity: 1, y: 0`, 300ms ease-out.

### 6.6 Footer

**Structure:** 4-column grid (logo + 3 link groups) with bottom bar.

**Columns:**
1. LogoWithText + description + social links (Twitter, LinkedIn, GitHub, Instagram)
2. For Job Seekers: Browse Jobs, My Profile, My Applications, Dashboard
3. For Employers: Employer Dashboard, Post a Job, Hiring Pipeline
4. Support: Contact Us, FAQ, Privacy Policy, Terms of Service

**Bottom bar:** Copyright + Privacy/Terms/Cookies links

**Styling:** `border-t border-white/[0.05] bg-neutral-950`

**Social link style:** `w-10 h-10 rounded-lg bg-white/5 hover:bg-emerald-600/20 text-neutral-400 hover:text-emerald-400` with 44px min touch target.

### 6.7 Infobar

**Description:** Dashboard top bar with right-aligned actions.

**Elements:** ContactSupportModal, Guide link (Book icon), NotificationCenter, User name display (hidden on mobile), Logout button.

---

## 7. Page Sections

### 7.1 Home Page

#### HeroSection (`src/components/sections/home/HeroSection.tsx`)

- Full viewport height (`min-h-screen`), centered flex layout
- Background: `bg-neutral-950` with three ambient animated orbs (from `useAmbient`)
- Grid overlay: `bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),...] bg-[size:64px_64px]`
- Background image at 4% opacity
- Content: Badge → H1 with gradient "Dream Job" → Search bar → Stats → CTA buttons
- Search bar: `bg-black/60 backdrop-blur-2xl border border-white/[0.08] rounded-2xl` with two inputs + Search button
- Stats: 50K+ Active Jobs, 10K+ Companies, 100K+ Hired
- CTA buttons: "Find Jobs" (emerald primary), "Post a Job" (outline)

#### JobCategories (`src/components/sections/home/JobCategories.tsx`)

- 9 category cards in responsive grid
- Each card: icon with colored gradient bg + category name + job count + arrow
- Stagger reveal animation (0.06s delay per item)
- Background image at 3% opacity
- "View All Categories" link button

#### HowItWorks (`src/components/sections/home/HowItWorks.tsx`)

- 4 step cards in a row
- Each: numbered step (01–04), icon circle, title, description
- Step connectors: `hidden lg:block absolute top-12 left-[60%] w-[calc(100%-40px)] h-[1px] bg-gradient-to-r from-emerald-500/40 to-transparent`
- Stagger reveal (0.12s delay per item)

#### Testimonials (`src/components/sections/home/Testimonials.tsx`)

- 3 testimonial cards in a row
- Each: quotation mark, quote text, avatar with gradient + name + role
- Avatar gradients: emerald, blue, purple

#### CTABanner (`src/components/sections/home/CTABanner.tsx`)

- Gradient background: `from-emerald-900/40 via-neutral-950 to-neutral-950`
- Centered glow: `bg-emerald-500/10 rounded-full blur-[100px]` (600px)
- Two CTAs: "Get Started Free" (white), "Hire Talent" (outline)

### 7.2 About Page

#### HeroSection (`src/components/sections/about/HeroSection.tsx`)

- Gradient overlay: `from-emerald-900/20 via-transparent to-transparent`
- Section title + subtitle with gradient accent

#### MissionSection (`src/components/sections/about/MissionSection.tsx`)

- 3 cards: Mission, Vision, Promise
- Uses `.glass` + `.glass-hover` utility classes
- Icon circles with emerald gradient

#### TeamSection (`src/components/sections/about/TeamSection.tsx`)

- 4 team member cards in a row
- Circular avatar images, name, role (emerald), bio, social links

#### ValuesSection (`src/components/sections/about/ValuesSection.tsx`)

- 4 values: Transparency, Speed, Fairness, Innovation
- Timeline layout with vertical connecting line (`bg-gradient-to-b from-emerald-500/40 to-transparent`)
- Icon circles at each node
- Cards use `.glass` + `.glass-hover`

#### CTABanner (`src/components/sections/about/CTABanner.tsx`)

- Same pattern as Home CTABanner, slightly different gradient (`from-emerald-900/30`)
- "Get Started Free" (emerald) + "Contact Us" (outline)

### 7.3 Contact Page

#### ContactForm (`src/components/sections/contact/ContactForm.tsx`)

- Glass card (`glass rounded-2xl`)
- Zod-validated form: name, email, subject, message
- Error states: `ring-2 ring-red-500` on inputs, `text-xs text-red-400` messages
- Submit button with loading spinner (Loader2)

#### InfoPanel (`src/components/sections/contact/InfoPanel.tsx`)

- Section title + subtitle
- 4 info items: Address, Email, Phone, Hours
- Each: emerald gradient icon circle + label + value (links for email/phone)

#### MapSection (`src/components/sections/contact/MapSection.tsx`)

- Placeholder map with grid overlay
- Emerald pin icon circle
- "Interactive map coming soon" text

### 7.4 Jobs Page

#### SaveJobButton (`src/components/sections/jobs/SaveJobButton.tsx`)

- Toggle save/unsave with API calls
- States: unsaved (neutral bookmark), saved (emerald filled bookmark), loading (spinner)
- If not authenticated, links to login
- ARIA labels for both states

---

## 8. Effects & Animations

### 8.1 Tailwind Keyframes (`tailwind.config.ts`)

| Keyframe | Description | Usage |
|---|---|---|
| `scroll` | `translate(calc(-50% - 0.5rem))` | Infinite horizontal card marquee |
| `spotlight` | Opacity 0→1, translate + scale | Spotlight hover effect |
| `accordion-down` | Height 0 → `--radix-accordion-content-height` | Accordion open |
| `accordion-up` | `--radix-accordion-content-height` → 0 | Accordion close |

### 8.2 Tailwind Animations

| Name | Value |
|---|---|
| `scroll` | `scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite` |
| `accordion-down` | `accordion-down 0.2s ease-out` |
| `accordion-up` | `accordion-up 0.2s ease-out` |

### 8.3 CSS Keyframes (`globals.css`)

```css
.accordion-chevron[data-state="open"] {
  transform: rotate(180deg);
}
```

### 8.4 Framer Motion Usage

| Pattern | Components |
|---|---|
| **Scroll-triggered reveals** | All section components via `useReveal()` |
| **Stagger children** | JobCategories, HowItWorks, Testimonials, TeamSection via `useStaggerReveal()` |
| **Page transitions** | PageShell main, DashboardShell main |
| **Mobile drawer** | Navbar, Sidebar |
| **Dropdown open/close** | NavbarDropdown |
| **Ambient orbs** | HeroSection (3 floating orbs) |
| **Preloader** | Logo + progress bar + fade out |
| **3D tilt** | ThreeDCard (mouse-tracking rotateX/rotateY) |
| **Scroll parallax** | ConnectParallax (horizontal scroll-linked x translation) |
| **Container scroll** | ContainerScroll (scale + opacity + y on scroll) |
| **Sparkles** | SparklesCore (particle opacity + scale pulse) |
| **Lamp** | Lamp (width + opacity entrance animation) |
| **ScrollSplitCard** | Scale, opacity, y driven by scroll progress |
| **Dialog/Popover** | Built-in `animate-in`/`animate-out` via tailwindcss-animate |

### 8.5 Global Effect Components (`src/components/global/`)

#### ThreeDCard (`3d-card.tsx`)

**Props:** `children`, `className`, `containerClassName`

**Behavior:** Tracks mouse position, applies spring-driven `rotateX`/`rotateY` transforms (±17°). Uses `preserve-3d` transform style.

#### ConnectParallax (`connect-parallax.tsx`)

**Props:** `children`, `baseVelocity?: number` (default -5), `className`

**Behavior:** Horizontal scroll-linked parallax. Translates content along x-axis based on scroll progress.

#### ContainerScroll (`container-scroll-animation.tsx`)

**Props:** `children`, `className`

**Behavior:** Sticky container that scales (1→0.9), fades (1→0.5), and moves up (0→-50px) as user scrolls past it.

#### InfiniteMovingCards (`infinite-moving-cards.tsx`)

**Props:** `items[]`, `direction?: 'left' | 'right'`, `speed?: 'fast' | 'normal' | 'slow'`, `pauseOnHover?: boolean`

**Behavior:** Duplicates items, applies CSS `scroll` animation for infinite horizontal marquee. Speed maps to duration: fast=20s, normal=40s, slow=80s.

**Mask:** `[mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]`

#### Lamp (`lamp.tsx`)

**Props:** `children`, `className`

**Behavior:** Two animated glow bars (emerald-500/20 blur-[10rem] and emerald-400 blur-[5rem]) that expand from 8–15rem to 16–30rem width on mount. Center line with radial mask.

#### Sparkles (`sparkles.tsx`)

**Props:** `id`, `background`, `minSize` (0.4), `maxSize` (1), `particleDensity` (100), `className`, `particleColor` (#FFF)

**Behavior:** Generates random particles that pulse opacity and scale on infinite loop.

#### CustomModal (`custom-modal.tsx`)

**Props:** `isOpen`, `onClose`, `children`, `className`

**Behavior:** Thin wrapper around `Dialog` + `DialogContent` with `sm:max-w-[425px]`.

#### EmailVerificationBanner (`email-verification-banner.tsx`)

**Props:** `email?`, `onDismiss?`

**Behavior:** Dismissible amber warning banner with `AlertTriangle` icon.

#### ModeToggle (`mode-toggle.tsx`)

**Description:** Theme toggle button (Sun/Moon icons), currently only visual — app is dark-only.

#### PageLoader (`page-loader.tsx`)

**Description:** Centered `Loader2` spinner (emerald-400) with "Loading..." text, `min-h-[60vh]`.

#### Preloader (`preloader.tsx`)

**Props:** `onLoadingComplete?`

**Behavior:** Full-screen loading overlay with logo, animated progress bar (emerald gradient), and "Loading..." text. Simulates 5–20% progress increments every 200ms. Fades out when complete.

### 8.6 Hooks (`src/hooks/`)

#### useAmbient (`useAmbient.ts`)

Returns three orb configurations for ambient background animation:
- Orb 1: 400px, 10%/-10%, emerald-500 at 12%, 25s duration
- Orb 2: 300px, 70%/20%, emerald-500 at 8%, 20s duration
- Orb 3: 200px, 40%/60%, emerald-500 at 6%, 30s duration

Returns empty array when reduced motion is preferred.

#### useReveal (`useReveal.ts`)

**`useReveal<T>`** — Returns `{ ref, isInView, variants }` for scroll-triggered reveal animations.

**Options:** `direction?: 'up' | 'down' | 'left' | 'right'`, `delay?: number`, `duration?: number` (0.6), `distance?: number` (40), `once?: boolean` (true)

**Hidden state:** opacity 0, translated by distance, blur 4px
**Visible state:** opacity 1, no translate, no blur, cubic-bezier `[0.22, 1, 0.36, 1]` easing
**Reduced motion:** Skips all animation (duration: 0, no blur)

**`useStaggerReveal(itemDelay?: number)`** — Returns `{ containerVariants, itemVariants }` for staggered child animations.

**Container:** `staggerChildren: itemDelay` (0.08), `delayChildren: 0.1`
**Items:** `opacity: 0, y: 24` → `opacity: 1, y: 0`, 0.5s duration

#### useReducedMotion (`useReducedMotion.ts`)

Returns `boolean`. Listens to `prefers-reduced-motion: reduce` media query. Used by `useReveal` and `useAmbient` to disable animations.

---

## 9. Custom Utility Classes

Defined in `src/styles/globals.css` under `@layer utilities`:

| Class | Definition | Usage |
|---|---|---|
| `.glass` | `bg-black/40 backdrop-blur-2xl border border-white/[0.05]` | Glassmorphism surfaces (MissionSection, ValuesSection, ContactForm) |
| `.glass-hover` | `hover:bg-black/50 hover:border-emerald-500/20 transition-all duration-300` | Hover enhancement for glass surfaces |
| `.text-gradient` | `text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600` | Highlighted text in section titles |
| `.section-padding` | `py-16 md:py-20 lg:py-24` | Standard section vertical spacing |
| `.section-title` | `text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white` | Standard section heading |
| `.section-subtitle` | `text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto mt-4` | Standard section subtitle |

**Global base styles:**
- All elements: `border-border` applied via `@apply border-border`
- Body: `bg-background text-foreground` with `font-family: system-ui, -apple-system, sans-serif`
- Focus visible: `outline-none ring-2 ring-emerald-400 ring-offset-2 ring-offset-background`

---

## 10. Dark Mode Strategy

**Configuration:** `darkMode: ['class']` in `tailwind.config.ts`

**In practice:** The app is dark-only. All CSS custom properties are defined only on `:root` (no `.dark` selector). The `ModeToggle` component exists but only renders a visual toggle — it does not switch themes.

**No light mode:** All background colors are near-black (`hsl(0 0% 3.9%)`), all text is white/gray, all surfaces use dark transparency overlays.

---

## 11. Icons

**Library:** `lucide-react` v0.468

**Icons used across the codebase:**

| Icon | Usage |
|---|---|
| `Menu`, `X` | Mobile hamburger/close |
| `ChevronDown` | Accordion trigger, select trigger, dropdown toggle |
| `ChevronRight` | Dropdown sub-trigger |
| `ChevronUp` | Select scroll up |
| `Check` | Select item indicator, dropdown checkbox indicator |
| `Circle` | Dropdown radio indicator |
| `Search` | Hero search, command input |
| `MapPin` | Hero search, contact info, map section |
| `ArrowRight` | Card links, CTA buttons |
| `Sparkles` | CTA buttons, hero accent |
| `Loader2` | Loading spinners (animate-spin) |
| `X` | Dialog close, multiple selector badge remove, verification banner dismiss |
| `Send` | Contact form submit |
| `Bookmark` | Save job button, nav link |
| `LayoutDashboard` | Dashboard nav link |
| `User` | Profile nav link |
| `MessageSquare` | Messages nav link |
| `Bell` | Notifications |
| `Settings` | Settings nav link |
| `LogOut` | Sign out |
| `Briefcase` | Employer dashboard, job categories |
| `GitBranch` | Hiring workflow |
| `Building2` | Company profile |
| `Code`, `Database`, `Palette`, `Smartphone`, `Cloud`, `BarChart`, `Heart`, `Shield` | Job category icons |
| `FileText` | Applications, upload resume step |
| `TrendingUp` | Assessment step |
| `CheckCircle` | Get hired step |
| `Target`, `Eye` | Mission/vision |
| `Linkedin`, `Twitter`, `Github`, `Instagram` | Social links |
| `Phone`, `Mail`, `Clock` | Contact info |
| `AlertTriangle` | Email verification banner |
| `Sun`, `Moon` | Theme toggle |
| `Book` | Guide link |
| `GripVertical` | Resizable handle |
| `MenuIcon` | Dashboard mobile menu |

---

## 12. Accessibility

### 12.1 Reduced Motion

- `useReducedMotion` hook queries `prefers-reduced-motion: reduce`
- All `useReveal` animations skip when reduced (duration: 0, no blur)
- All `useAmbient` orbs return empty array when reduced
- Navbar mobile drawer: skips x translation animation
- Sidebar mobile: skips x translation animation
- PageShell main: skips y translation animation
- DashboardShell main: skips opacity animation

### 12.2 Focus Management

- Global focus-visible: `outline-none ring-2 ring-emerald-400 ring-offset-2 ring-offset-background`
- Button focus-visible ring
- Input/Textarea focus ring: `focus:ring-2 focus:ring-emerald-400`
- Switch focus-visible ring
- Select trigger focus ring
- Form control uses `aria-describedby` and `aria-invalid`

### 12.3 ARIA Patterns

- Nav links use `aria-current="page"` for active state
- Mobile menu button: `aria-label` toggles between "Open menu" / "Close menu", `aria-expanded`
- NavbarDropdown button: `aria-label="User menu"`, `aria-expanded`
- Skeleton: `aria-hidden="true"`
- Dialog close: `<span className="sr-only">Close</span>`
- Theme toggle: `<span className="sr-only">Toggle theme</span>`
- SaveJobButton: `aria-label` toggles between "Save job" / "Remove from saved jobs"
- Multiple selector: `aria-label="Sign in to save jobs"` for unauthenticated state
- Social links: `aria-label` with platform name
- Logo links: `aria-label="LoftCommunity Home"`

### 12.4 Touch Targets

- Mobile hamburger: `min-w-[44px] min-h-[44px]`
- NavbarDropdown trigger: `min-w-[44px] min-h-[44px]`
- Footer social links: `min-w-[44px] min-h-[44px]`
- Team social links: `min-w-[44px] min-h-[44px]`

### 12.5 Color Contrast

- Text foreground (`hsl(0 0% 98%)`) on background (`hsl(0 0% 3.9%)`) — ratio ~20:1
- Muted foreground (`hsl(0 0% 63.9%)`) on background — ratio ~8:1
- Emerald-400 on background — used for accent, sufficient contrast
- Destructive red on background — sufficient contrast

---

## 13. Conventions

### 13.1 Adding New Components

1. Place shadcn/ui-compatible components in `src/components/ui/`
2. Use `cn()` from `@/lib/utils` for class merging
3. Define variants with CVA when multiple visual states exist
4. Wrap with `React.forwardRef` for ref forwarding
5. Set `displayName` on all exported components
6. Use Radix primitives as the base for accessible behavior
7. Style with Tailwind utility classes, not custom CSS

### 13.2 Naming Patterns

| Type | Convention | Example |
|---|---|---|
| Component files | kebab-case | `dropdown-menu.tsx`, `3d-card.tsx` |
| Component exports | PascalCase | `DropdownMenu`, `ThreeDCard` |
| Hook files | camelCase with `use` prefix | `useAmbient.ts`, `useReveal.ts` |
| Section components | PascalCase with page prefix in directory | `sections/home/HeroSection.tsx` |
| Layout components | PascalCase | `DashboardShell.tsx`, `PageShell.tsx` |
| Utility classes | kebab-case with dot prefix | `.glass`, `.text-gradient` |

### 13.3 Variant Styling with CVA

```tsx
// Pattern from button.tsx, badge.tsx
const componentVariants = cva(
  'base-classes-here',
  {
    variants: {
      variant: {
        default: 'emerald-primary-classes',
        secondary: 'secondary-classes',
        destructive: 'destructive-classes',
        outline: 'outline-classes',
        ghost: 'ghost-classes',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-12 px-8 text-base rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)
```

### 13.4 Animation Convention

All section-level animations go through `useReveal` or `useStaggerReveal`. Never add raw `motion.div` with `initial`/`animate` to page sections — always wrap with the hook to ensure reduced motion support.

### 13.5 Glass Surface Convention

For glassmorphism surfaces, combine:
```tsx
<div className="glass glass-hover rounded-xl p-6">
  {/* content */}
</div>
```

For cards with glassmorphism:
```tsx
<Card className="hover:border-emerald-500/20 transition-all duration-300">
  <CardContent className="p-6">
    {/* content */}
  </CardContent>
</Card>
```

### 13.6 Skeleton Convention

Create page-specific skeleton components in `src/components/skeletons/`. Use the base `Skeleton` component (`animate-pulse rounded-md bg-white/10`). Match the visual structure of the actual content layout.

### 13.7 Directory Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui base components (26 files)
│   ├── layout/          # App shell components (7 files)
│   ├── sections/        # Page-specific sections
│   │   ├── home/        # Home page sections
│   │   ├── about/       # About page sections
│   │   ├── contact/     # Contact page sections
│   │   └── jobs/        # Jobs page components
│   ├── global/          # Reusable effects & utilities (11 files)
│   └── skeletons/       # Loading skeletons (4 files)
├── hooks/               # Custom React hooks
├── lib/                 # Utilities, constants, API
└── styles/
    └── globals.css      # CSS variables, utility classes, base styles
```
