export function formatInr(n: number, fractionDigits = 0): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(n);
}

export function sipFutureValue(monthly: number, annualRate: number, years: number): number {
  const months = years * 12;
  const r = annualRate / 12 / 100;
  if (r === 0) return monthly * months;
  return monthly * (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
}

export function sipInvested(monthly: number, years: number): number {
  return monthly * years * 12;
}

export function sipRequiredForTarget(target: number, annualRate: number, years: number): number {
  const months = years * 12;
  const r = annualRate / 12 / 100;
  if (target <= 0) return 0;
  if (r === 0) return target / months;
  const factor = ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
  return target / factor;
}

export function lumpsumFutureValue(principal: number, annualRate: number, years: number): number {
  return principal * Math.pow(1 + annualRate / 100, years);
}

export function futureCost(currentCost: number, inflation: number, years: number): number {
  return currentCost * Math.pow(1 + inflation / 100, years);
}

export function calculateEmi(principal: number, annualRate: number, years: number) {
  const months = years * 12;
  const r = annualRate / 12 / 100;
  if (months <= 0) return { emi: 0, totalPayment: 0, totalInterest: 0 };
  if (r === 0) {
    const emi = principal / months;
    return { emi, totalPayment: principal, totalInterest: 0 };
  }
  const factor = Math.pow(1 + r, months);
  const emi = (principal * r * factor) / (factor - 1);
  const totalPayment = emi * months;
  return { emi, totalPayment, totalInterest: totalPayment - principal };
}

export function stepUpSip(
  initialMonthly: number,
  annualStepUpPercent: number,
  annualRate: number,
  years: number,
) {
  const monthlyRate = annualRate / 12 / 100;
  let totalInvested = 0;
  let futureValue = 0;
  let monthly = initialMonthly;

  for (let month = 0; month < years * 12; month++) {
    if (month > 0 && month % 12 === 0) {
      monthly *= 1 + annualStepUpPercent / 100;
    }
    totalInvested += monthly;
    const monthsGrowth = years * 12 - month;
    futureValue += monthly * Math.pow(1 + monthlyRate, monthsGrowth);
  }

  const regularSipValue = sipFutureValue(initialMonthly, annualRate, years);
  return {
    totalInvested,
    futureValue,
    regularSipValue,
    extraGain: futureValue - regularSipValue,
  };
}

export function costOfDelay(
  monthly: number,
  annualRate: number,
  totalYears: number,
  delayYears: number,
) {
  const corpusNow = sipFutureValue(monthly, annualRate, totalYears);
  const remainingYears = Math.max(0, totalYears - delayYears);
  const corpusDelayed = remainingYears > 0 ? sipFutureValue(monthly, annualRate, remainingYears) : 0;
  const wealthLost = corpusNow - corpusDelayed;
  const monthlyNeededIfDelayed =
    remainingYears > 0 ? sipRequiredForTarget(corpusNow, annualRate, remainingYears) : 0;
  const extraMonthly = Math.max(0, monthlyNeededIfDelayed - monthly);

  return { corpusNow, corpusDelayed, wealthLost, monthlyNeededIfDelayed, extraMonthly };
}

export function humanLifeValue(params: {
  annualIncome: number;
  personalExpenses: number;
  currentAge: number;
  retirementAge: number;
  discountRate: number;
  inflation: number;
  liabilities: number;
  existingCover: number;
}) {
  const years = Math.max(0, params.retirementAge - params.currentAge);
  let presentValue = 0;

  for (let y = 1; y <= years; y++) {
    const netIncome =
      (params.annualIncome - params.personalExpenses) * Math.pow(1 + params.inflation / 100, y - 1);
    presentValue += netIncome / Math.pow(1 + params.discountRate / 100, y);
  }

  const recommendedCover = Math.max(0, presentValue + params.liabilities - params.existingCover);
  const incomeMultiple = params.annualIncome > 0 ? recommendedCover / params.annualIncome : 0;

  return { presentValue, recommendedCover, workingYears: years, incomeMultiple };
}

export function goalPlanning(params: {
  currentCost: number;
  years: number;
  inflation: number;
  currentSavings: number;
  expectedReturn: number;
}) {
  const target = futureCost(params.currentCost, params.inflation, params.years);
  const savingsFv = lumpsumFutureValue(params.currentSavings, params.expectedReturn, params.years);
  const gap = Math.max(0, target - savingsFv);
  const monthlySip = params.years > 0 ? sipRequiredForTarget(gap, params.expectedReturn, params.years) : 0;

  return { target, savingsFv, gap, monthlySip };
}

function slabTax(taxableIncome: number, slabs: { upTo: number; rate: number }[]): number {
  if (taxableIncome <= 0) return 0;
  let tax = 0;
  let prev = 0;
  for (const slab of slabs) {
    if (taxableIncome <= prev) break;
    const taxableInSlab = Math.min(taxableIncome, slab.upTo) - prev;
    tax += taxableInSlab * slab.rate;
    prev = slab.upTo;
  }
  return tax;
}

function applyRebate(tax: number, taxableIncome: number, maxRebate: number, incomeLimit: number): number {
  if (taxableIncome <= incomeLimit) return Math.max(0, tax - maxRebate);
  return tax;
}

function withCess(tax: number): number {
  return tax * 1.04;
}

const NEW_REGIME_SLABS = [
  { upTo: 400_000, rate: 0 },
  { upTo: 800_000, rate: 0.05 },
  { upTo: 1_200_000, rate: 0.1 },
  { upTo: 1_600_000, rate: 0.15 },
  { upTo: 2_000_000, rate: 0.2 },
  { upTo: 2_400_000, rate: 0.25 },
  { upTo: Infinity, rate: 0.3 },
];

const OLD_REGIME_SLABS = [
  { upTo: 250_000, rate: 0 },
  { upTo: 500_000, rate: 0.05 },
  { upTo: 1_000_000, rate: 0.2 },
  { upTo: Infinity, rate: 0.3 },
];

export function calculateIncomeTax(params: {
  grossIncome: number;
  deduction80C: number;
  deduction80D: number;
  otherDeductions: number;
  isSalaried: boolean;
}) {
  const newStdDeduction = params.isSalaried ? 75_000 : 0;
  const oldStdDeduction = params.isSalaried ? 50_000 : 0;
  const totalOldDeductions = Math.min(
    params.deduction80C,
    150_000,
  ) + params.deduction80D + params.otherDeductions;

  const newTaxable = Math.max(0, params.grossIncome - newStdDeduction);
  const oldTaxable = Math.max(0, params.grossIncome - oldStdDeduction - totalOldDeductions);

  let newTax = slabTax(newTaxable, NEW_REGIME_SLABS);
  newTax = applyRebate(newTax, newTaxable, 60_000, 1_200_000);
  newTax = withCess(newTax);

  let oldTax = slabTax(oldTaxable, OLD_REGIME_SLABS);
  oldTax = applyRebate(oldTax, oldTaxable, 12_500, 500_000);
  oldTax = withCess(oldTax);

  const betterRegime = newTax <= oldTax ? 'new' : 'old';
  const savings = Math.abs(newTax - oldTax);

  return {
    newTaxable,
    oldTaxable,
    newTax,
    oldTax,
    betterRegime,
    savings,
    takeHomeNew: params.grossIncome - newTax,
    takeHomeOld: params.grossIncome - oldTax,
  };
}
