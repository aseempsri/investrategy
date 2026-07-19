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
