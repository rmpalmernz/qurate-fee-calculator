
# Plan: Update Total Fees Calculation and Box Order

## Summary
Update the fee calculator so that **Total Fees** includes ALL fee components paid by the client, and reorder the summary boxes to show Retainers Paid first.

## Updated Formula

**Total Fees = Retainers Paid + Transaction Structuring Fee + Gross Success Fee - Retainer Rebate**

This reflects the true total amount the client pays across the entire engagement.

## Changes Required

### 1. Update Fee Calculation Logic (`src/lib/feeCalculations.ts`)

**Current logic (line 124-125):**
```typescript
const totalFees = netSuccessFee + transactionStructuringFee;
```

**New logic:**
```typescript
// Total fees includes everything the client pays:
// Retainers + TSF + Gross Success Fee - Rebate at settlement
const totalFees = retainerPaid + transactionStructuringFee + grossSuccessFee - retainerRebate;
```

### 2. Update UI Box Order (`src/pages/Calculator.tsx`)

Reorder the summary cards from:
1. Transaction Structuring Fee
2. Total Retainers Paid
3. Retainer Rebate (conditional)
4. Gross Success Fee

To:
1. **Total Retainers Paid** (first box)
2. Transaction Structuring Fee
3. Gross Success Fee
4. Retainer Rebate (conditional - shown as deduction)

### 3. Update Total Fees Display Label

Change the descriptive sub-label from:
```
"Success Fee + TSF - Rebate"
```

To:
```
"Retainers + TSF + Success Fee - Rebate"
```

## Technical Details

### File: `src/lib/feeCalculations.ts`
- Line 124-125: Update `totalFees` calculation to include `retainerPaid`

### File: `src/pages/Calculator.tsx`
- Lines 211-259: Reorder the summary card grid to put Retainers Paid first
- Line 271-272: Update the Total Fees description label

## Verification
After implementation, test with:
- $12M EV, 3 retainer months
- Expected: Retainers ($45k) + TSF ($30k) + Gross Success Fee ($410k) - Rebate ($22.5k) = **$462,500 Total Fees**
