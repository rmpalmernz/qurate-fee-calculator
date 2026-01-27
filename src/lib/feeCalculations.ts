// Fee calculation logic based on Qurate's tiered fee structure
// Success Fee = Terms Agreed + Completion Fee + Sliding Scale
// Sliding Scale = (EV - $2M) × rate of highest tier reached

interface FeeBand {
  minEV: number;
  maxEV: number;
  termsAgreed: number;      // Fixed fee when terms agreed
  completionFee: number;    // Fixed completion fee
  slidingScaleRate: number; // Flat percentage applied to (EV - $2M)
}

// Fee bands - sliding scale uses FLAT rate based on highest tier reached
const FEE_BANDS: FeeBand[] = [
  { minEV: 2_000_000, maxEV: 5_000_000, termsAgreed: 20_000, completionFee: 125_000, slidingScaleRate: 0.035 },
  { minEV: 5_000_000, maxEV: 10_000_000, termsAgreed: 30_000, completionFee: 270_000, slidingScaleRate: 0.025 },
  { minEV: 10_000_000, maxEV: 20_000_000, termsAgreed: 35_000, completionFee: 400_000, slidingScaleRate: 0.025 },
  { minEV: 20_000_000, maxEV: 50_000_000, termsAgreed: 50_000, completionFee: 600_000, slidingScaleRate: 0.015 },
];

const MINIMUM_EV = 2_000_000;

export interface FeeResult {
  enterpriseValue: number;
  termsAgreedFee: number;
  completionFee: number;
  slidingScaleFee: number;
  totalSuccessFee: number;
  percentageOfEV: number;
}

export function calculateFees(enterpriseValue: number): FeeResult | null {
  // Minimum EV is $2M
  if (enterpriseValue < MINIMUM_EV) {
    return null;
  }

  // Cap at $50M for fee calculation
  const cappedEV = Math.min(enterpriseValue, 50_000_000);

  // Find the highest tier the EV reaches
  let applicableBand = FEE_BANDS[0];
  for (const band of FEE_BANDS) {
    if (cappedEV > band.minEV) {
      applicableBand = band;
    }
  }

  // Fixed fees from highest tier reached
  const termsAgreedFee = applicableBand.termsAgreed;
  const completionFee = applicableBand.completionFee;

  // Sliding scale: (EV - $2M) × rate of highest tier
  const taxableAmount = cappedEV - MINIMUM_EV;
  const slidingScaleFee = taxableAmount * applicableBand.slidingScaleRate;

  const totalSuccessFee = termsAgreedFee + completionFee + slidingScaleFee;
  const percentageOfEV = (totalSuccessFee / enterpriseValue) * 100;

  return {
    enterpriseValue,
    termsAgreedFee: Math.round(termsAgreedFee),
    completionFee: Math.round(completionFee),
    slidingScaleFee: Math.round(slidingScaleFee),
    totalSuccessFee: Math.round(totalSuccessFee),
    percentageOfEV: Math.round(percentageOfEV * 100) / 100,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function parseCurrencyInput(value: string): number {
  // Remove all non-numeric characters except decimal point
  const cleaned = value.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
}

// Reference table for display showing max fees at each tier
export const FEE_REFERENCE_TABLE = [
  { ev: 5_000_000, termsAgreed: 20_000, completionFee: 125_000, rate: '3.50%' },
  { ev: 10_000_000, termsAgreed: 30_000, completionFee: 270_000, rate: '2.50%' },
  { ev: 20_000_000, termsAgreed: 35_000, completionFee: 400_000, rate: '2.50%' },
  { ev: 50_000_000, termsAgreed: 50_000, completionFee: 600_000, rate: '1.50%' },
];
