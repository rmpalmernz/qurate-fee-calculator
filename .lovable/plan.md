

# Performance Optimization Plan

## Executive Summary

This is a lightweight client-side fee calculator application with no database operations or edge functions. The codebase is relatively clean but has several areas for optimization, primarily around:
1. **Bundle size reduction** (significant unused dependencies and components)
2. **Runtime performance improvements** (memoization and re-render prevention)
3. **Code cleanup** (dead code removal)

---

## Category 1: Bundle Size Optimization

### HIGH IMPACT

#### 1.1 Remove Unused Dependencies
**Issue**: Multiple heavy dependencies are installed but never used in the application.

| Dependency | Size Impact | Used? |
|------------|-------------|-------|
| `@tanstack/react-query` | ~40KB | Not used (no useQuery/useMutation calls) |
| `recharts` | ~200KB | Not used in any pages |
| `react-hook-form` + `@hookform/resolvers` + `zod` | ~50KB | Not used (no forms with validation) |
| `date-fns` + `react-day-picker` | ~30KB | Not used |
| `embla-carousel-react` | ~15KB | Not used |
| `input-otp` | ~5KB | Not used |
| `next-themes` | ~3KB | Not used (app is dark theme only) |
| `cmdk` | ~15KB | Not used |
| `react-resizable-panels` | ~10KB | Not used |

**Fix**: Remove unused dependencies from `package.json`

**Expected Impact**: ~350-400KB reduction in bundle size (30-40% improvement)

**Non-breaking**: Yes - these are never imported

#### 1.2 Remove Unused UI Components
**Issue**: 48 UI components exist in `src/components/ui/` but only 8 are actually used:
- Used: `card`, `input`, `label`, `table`, `separator`, `select`, `button`, `toaster`, `sonner`, `tooltip`
- Unused (40 components): `accordion`, `alert-dialog`, `alert`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `calendar`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `form`, `hover-card`, `input-otp`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `sheet`, `sidebar`, `skeleton`, `slider`, `switch`, `tabs`, `textarea`, `toggle-group`, `toggle`

**Fix**: Remove unused component files (they are tree-shaken but removing reduces maintenance burden and potential import errors)

**Expected Impact**: Cleaner codebase, faster IDE indexing, reduced cognitive load

**Non-breaking**: Yes - unused files

---

### MEDIUM IMPACT

#### 1.3 Remove Unused Toast Systems
**Issue**: App imports BOTH `Toaster` (from `@/components/ui/toaster`) and `Sonner` but neither toast function is ever called in the application.

**Fix**: 
- Remove `<Toaster />` and `<Sonner />` from `App.tsx`
- Remove unused toast hook imports

**Expected Impact**: Slight bundle size reduction, cleaner component tree

**Non-breaking**: Yes - toast is never triggered

#### 1.4 Remove Unused QueryClientProvider
**Issue**: `@tanstack/react-query` provider wraps the entire app but no queries are used.

**Fix**: Remove `QueryClientProvider` wrapper and `queryClient` instance from `App.tsx`

**Expected Impact**: Faster initial render, reduced memory usage

**Non-breaking**: Yes - no queries exist

#### 1.5 Remove Unused TooltipProvider
**Issue**: `TooltipProvider` wraps the app but no tooltips are used in pages.

**Fix**: Remove provider wrapper (can be re-added if tooltips are needed later)

**Expected Impact**: Minimal, but cleaner component tree

**Non-breaking**: Yes - no tooltips used in pages

---

## Category 2: Runtime Performance

### HIGH IMPACT

#### 2.1 Memoize Expensive Calculations in Calculator
**Issue**: `formatCurrency()` is called multiple times on every render within the retainer months dropdown. Each call creates a new `Intl.NumberFormat` instance.

**Current code (Calculator.tsx, lines 150-159)**:
```tsx
{[3, 4, 5, 6].map((m) => {
  const monthlyRate = getMonthlyRetainer(enterpriseValue);
  return (
    <SelectItem ...>
      {m} months ({formatCurrency(m * monthlyRate)})
    </SelectItem>
  );
})}
```

**Fix**: 
1. Create a memoized currency formatter
2. Pre-compute the monthly rate outside the map
3. Use `useMemo` for the dropdown options

**Expected Impact**: Eliminates redundant object creation on each render

**Non-breaking**: Yes - same output, better performance

#### 2.2 Cache Intl.NumberFormat Instance
**Issue**: `formatCurrency()` creates a new `Intl.NumberFormat` instance on every call.

**Current code (feeCalculations.ts)**:
```typescript
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-AU', {...}).format(value);
}
```

**Fix**: Create formatter once at module level:
```typescript
const currencyFormatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}
```

**Expected Impact**: Significant reduction in garbage collection pressure, faster formatting

**Non-breaking**: Yes - identical output

---

### MEDIUM IMPACT

#### 2.3 Use useCallback for Event Handlers
**Issue**: `handleInputChange`, `handleInputBlur`, and `handleInputFocus` are recreated on every render.

**Fix**: Wrap handlers in `useCallback` with appropriate dependencies

**Expected Impact**: Prevents unnecessary child re-renders if Input component is memoized

**Non-breaking**: Yes - same behavior

#### 2.4 Optimize Token Validation
**Issue**: Token validation runs on every `searchParams` change, even when the token hasn't changed.

**Fix**: Extract token once and use it as the dependency, or memoize the validation result.

**Current**:
```tsx
useEffect(() => {
  const token = searchParams.get('token');
  ...
}, [searchParams]);
```

**Better**:
```tsx
const token = searchParams.get('token');
const devMode = searchParams.get('dev') === 'true';

useEffect(() => {
  if (devMode) {
    setIsValidating(false);
    return;
  }
  const result = validateToken(token);
  ...
}, [token, devMode]);
```

**Expected Impact**: Avoids re-validation when other search params change

**Non-breaking**: Yes

---

## Category 3: Code Cleanup

### MEDIUM IMPACT

#### 3.1 Remove Duplicate `use-toast.ts` Files
**Issue**: Two identical toast hook files exist:
- `src/hooks/use-toast.ts`
- `src/components/ui/use-toast.ts`

**Fix**: Keep one, remove the duplicate

**Non-breaking**: Yes - functionally identical

#### 3.2 Remove Unused Logo Assets
**Issue**: Three logo files exist but only one is used:
- `qurate-logo-white.svg` (USED in QurateLogo.tsx)
- `qurate-logo-gold.png` (UNUSED)
- `qurate-logo.svg` (UNUSED)

**Fix**: Remove unused logo files

**Expected Impact**: Smaller asset bundle

**Non-breaking**: Yes

#### 3.3 Simplify App.tsx
**Issue**: App.tsx has unnecessary complexity with unused providers.

**Current structure**:
```tsx
<QueryClientProvider>
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      ...
    </BrowserRouter>
  </TooltipProvider>
</QueryClientProvider>
```

**Simplified**:
```tsx
<BrowserRouter>
  <Routes>
    ...
  </Routes>
</BrowserRouter>
```

**Non-breaking**: Yes - removing unused wrappers

#### 3.4 Remove Duplicate Route
**Issue**: Calculator is mounted on both `/` and `/calculator`, causing unnecessary route matching.

**Fix**: Keep only `/` route (or redirect `/calculator` to `/` if SEO is a concern)

**Non-breaking**: Potentially breaking if users have bookmarked `/calculator` - implement redirect instead

---

## Category 4: PWA/Caching Optimization

### LOW IMPACT

#### 4.1 Optimize Workbox Runtime Caching
**Issue**: Current config only caches Google Fonts. Could add runtime caching for app assets.

**Fix**: Add runtime caching for static assets and app routes

**Expected Impact**: Faster subsequent page loads

**Non-breaking**: Yes

---

## Implementation Priority

| Priority | Item | Impact | Effort |
|----------|------|--------|--------|
| 1 | Remove unused dependencies (1.1) | HIGH | LOW |
| 2 | Cache Intl.NumberFormat (2.2) | HIGH | LOW |
| 3 | Remove unused providers from App.tsx (1.3, 1.4, 1.5, 3.3) | MEDIUM | LOW |
| 4 | Memoize Calculator calculations (2.1) | MEDIUM | LOW |
| 5 | Optimize token validation (2.4) | MEDIUM | LOW |
| 6 | Use useCallback for handlers (2.3) | LOW | LOW |
| 7 | Remove duplicate files (3.1, 3.2) | LOW | LOW |
| 8 | Remove unused UI components (1.2) | LOW | MEDIUM |

---

## Technical Implementation Details

### Files to Modify:
1. `package.json` - Remove unused dependencies
2. `src/lib/feeCalculations.ts` - Cache Intl.NumberFormat
3. `src/App.tsx` - Remove unused providers and imports
4. `src/pages/Calculator.tsx` - Add memoization and useCallback

### Files to Delete:
1. `src/components/ui/use-toast.ts` (duplicate)
2. `src/assets/qurate-logo-gold.png` (unused)
3. `src/assets/qurate-logo.svg` (unused)
4. ~40 unused UI component files (optional, tree-shaking handles this)

### Expected Results:
- **Bundle size**: 30-40% reduction (~350-400KB saved)
- **Initial render**: Faster due to removed providers
- **Runtime**: Reduced GC pressure from formatter caching
- **Maintainability**: Cleaner, more focused codebase

