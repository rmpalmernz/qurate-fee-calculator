
# Admin Link Generator

A simple internal page for generating time-limited calculator access links for clients.

## Overview

This feature adds an admin-only page at `/admin/generate-link` where you can:
- Select how long the link should be valid (7, 30, or 90 days)
- Optionally add a client name for reference
- Generate a secure access link
- Copy the link to clipboard with one click

## User Flow

```text
+----------------------------------+
|  Admin Link Generator            |
+----------------------------------+
|                                  |
|  Client Name (optional)          |
|  [________________________]      |
|                                  |
|  Link Validity                   |
|  ( ) 7 days                      |
|  (•) 30 days                     |
|  ( ) 90 days                     |
|                                  |
|  [  Generate Link  ]             |
|                                  |
+----------------------------------+
|                                  |
|  Generated Link:                 |
|  +----------------------------+  |
|  | https://app.../calculator  |  |
|  | ?token=eyJleH...           |  |
|  +----------------------------+  |
|                                  |
|  Expires: 28 Feb 2026            |
|                                  |
|  [  Copy to Clipboard  ]         |
|                                  |
+----------------------------------+
```

## What Will Be Built

### 1. New Page: `src/pages/AdminGenerateLink.tsx`
- Form with client name input (optional, for your reference only)
- Radio button group for validity period (7, 30, 90 days)
- Generate button that creates a token using existing `generateToken()` function
- Display area showing the full URL with token
- Copy-to-clipboard button with success feedback via toast
- Shows expiry date for the generated link

### 2. Route Addition
- Add `/admin/generate-link` route in `App.tsx`
- No authentication required (internal tool only)

### 3. UI Styling
- Uses existing `PageShell` layout for consistency
- Uses existing `Card`, `Input`, `RadioGroup`, and `Button` primitives
- Follows Qurate brand tokens (slate background, gold accents)

---

## Technical Details

### Files to Create
| File | Purpose |
|------|---------|
| `src/pages/AdminGenerateLink.tsx` | Admin page with link generation form |

### Files to Modify
| File | Change |
|------|--------|
| `src/App.tsx` | Add route for `/admin/generate-link` |

### Key Implementation

The page will import and use the existing `generateToken()` function from `src/lib/tokenUtils.ts`:

```typescript
import { generateToken } from '@/lib/tokenUtils';

// When user clicks "Generate Link"
const token = generateToken(selectedDays); // 7, 30, or 90
const fullUrl = `${window.location.origin}/calculator?token=${token}`;
```

### Dependencies
- No new dependencies required
- Uses existing UI components: `Card`, `Input`, `Button`, `RadioGroup`, `Label`
- Uses existing `sonner` toast for copy confirmation
