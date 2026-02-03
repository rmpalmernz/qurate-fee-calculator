

# Fee Calculator Update + Admin Dashboard

## Summary

This plan covers two major changes:
1. **Update fee calculation logic** to match the new engagement letter framework (cumulative percentage tiers)
2. **Build an Admin Dashboard** to track generated tokens and client links

---

## Part 1: New Fee Structure

### Current vs New Model

The engagement letter introduces a **cumulative tiered percentage** model where each EV band is taxed at its own rate (like income tax brackets):

```text
Example: $12,000,000 Enterprise Value

First $5M      × 5.00% = $250,000
Next $5M       × 4.00% = $200,000
Next $2M       × 3.00% = $60,000
─────────────────────────────────
Total Success Fee      = $510,000 (4.25% effective rate)
```

### Additional Fee Components

| Component | Amount | When Payable |
|-----------|--------|--------------|
| Monthly Retainer | $15,000/month | Monthly in advance (max 5 months) |
| Retainer Rebate | 50% of retainers paid | Credited against Success Fee at completion |
| Transaction Structuring Fee | $35,000 | On term sheet execution |

### Calculator Updates

- Replace the current three-fee model (Terms Agreed + Completion + Sliding) with cumulative tiers
- Add optional inputs for retainer months paid (to calculate rebate)
- Show breakdown by tier
- Display effective percentage rate

---

## Part 2: Admin Dashboard

### Features

A new admin page at `/admin` with:

1. **Token Management Table**
   - Client name
   - Generated date
   - Expiry date
   - Status (Active / Expired)
   - Quick copy button

2. **Generate New Link** (moved into dashboard)
   - Client name input
   - Validity period selector
   - Generate button

3. **Token Storage**
   - Store generated tokens in browser localStorage
   - Persists across sessions
   - Can delete/revoke tokens

### User Flow

```text
+------------------------------------------+
|  Admin Dashboard                         |
+------------------------------------------+
|                                          |
|  [Generate New Link]                     |
|                                          |
|  ┌──────────────────────────────────────┐|
|  │ Client Links                         │|
|  ├──────────────────────────────────────┤|
|  │ Client     │ Created │ Expires │     │|
|  ├──────────────────────────────────────┤|
|  │ Clipex     │ 3 Feb   │ 5 May   │ [Copy] [Delete] │|
|  │ Smith Ind  │ 1 Feb   │ 3 Mar   │ [Copy] [Delete] │|
|  │ ACME Corp  │ 15 Jan  │ 14 Feb  │ Expired         │|
|  └──────────────────────────────────────┘|
+------------------------------------------+
```

---

## Technical Details

### Files to Create

| File | Purpose |
|------|---------|
| `src/pages/Admin.tsx` | Main admin dashboard with token table |
| `src/lib/tokenStorage.ts` | LocalStorage utilities for token management |

### Files to Modify

| File | Change |
|------|--------|
| `src/lib/feeCalculations.ts` | Replace with cumulative tier logic |
| `src/pages/Calculator.tsx` | Update UI for new fee breakdown |
| `src/App.tsx` | Add `/admin` route |

### New Fee Calculation Logic

```typescript
const FEE_TIERS = [
  { upTo: 5_000_000, rate: 0.05 },    // First $5M at 5%
  { upTo: 10_000_000, rate: 0.04 },   // $5M-$10M at 4%
  { upTo: 15_000_000, rate: 0.03 },   // $10M-$15M at 3%
  { upTo: 20_000_000, rate: 0.025 },  // $15M-$20M at 2.5%
  { upTo: Infinity, rate: 0.02 },     // Above $20M at 2%
];

function calculateSuccessFee(ev: number) {
  let remaining = ev;
  let total = 0;
  let prevCap = 0;

  for (const tier of FEE_TIERS) {
    const taxable = Math.min(remaining, tier.upTo - prevCap);
    total += taxable * tier.rate;
    remaining -= taxable;
    prevCap = tier.upTo;
    if (remaining <= 0) break;
  }

  return total;
}
```

### Token Storage Schema

```typescript
interface StoredToken {
  id: string;
  clientName: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  fullUrl: string;
}
```

---

## Implementation Order

1. Create `src/lib/tokenStorage.ts` for localStorage management
2. Update `src/lib/feeCalculations.ts` with new cumulative tier logic
3. Update `src/pages/Calculator.tsx` to display new fee breakdown
4. Create `src/pages/Admin.tsx` with token table and generation form
5. Update `src/App.tsx` with new `/admin` route
6. Remove or redirect `/admin/generate-link` to `/admin`

---

## Dependencies

No new dependencies required. Uses existing:
- localStorage API for token persistence
- shadcn/ui Table component for token list
- Existing Card, Button, Input primitives

