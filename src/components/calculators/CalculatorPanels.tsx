import { useState } from 'react';
import {
  calculateEmi,
  costOfDelay,
  formatInr,
  goalPlanning,
  humanLifeValue,
  lumpsumFutureValue,
  sipFutureValue,
  sipInvested,
  sipRequiredForTarget,
  stepUpSip,
} from '../../utils/finance';
import { CalcPanel, ResultGrid, SliderField } from './CalcUI';

export function SIPCalculatorPanel() {
  const [monthly, setMonthly] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const futureValue = sipFutureValue(monthly, rate, years);
  const invested = sipInvested(monthly, years);

  return (
    <CalcPanel>
      <div className="calc-inputs">
        <SliderField label="Monthly Investment (₹)" value={monthly} onChange={setMonthly} min={500} max={100000} step={500} display={formatInr(monthly)} />
        <SliderField label="Expected Return (% p.a.)" value={rate} onChange={setRate} min={1} max={30} step={0.5} display={`${rate}%`} />
        <SliderField label="Time Period (Years)" value={years} onChange={setYears} min={1} max={40} step={1} display={`${years} years`} />
      </div>
      <ResultGrid
        items={[
          { label: 'Invested Amount', value: invested, format: 'currency' },
          { label: 'Est. Returns', value: futureValue - invested, format: 'currency', accent: true },
          { label: 'Total Value', value: futureValue, format: 'currency', total: true },
        ]}
      />
    </CalcPanel>
  );
}

export function RetirementCalculatorPanel() {
  const [currentAge, setCurrentAge] = useState(35);
  const [retireAge, setRetireAge] = useState(60);
  const [monthlyExp, setMonthlyExp] = useState(50000);
  const [inflation, setInflation] = useState(6);
  const [expectedReturn, setExpectedReturn] = useState(10);

  const yearsToRetire = Math.max(1, retireAge - currentAge);
  const futureMonthlyExp = monthlyExp * Math.pow(1 + inflation / 100, yearsToRetire);
  const corpusNeeded = futureMonthlyExp * 12 * 25;
  const sipNeeded = sipRequiredForTarget(corpusNeeded, expectedReturn, yearsToRetire);

  return (
    <CalcPanel disclaimer="Uses 25x annual expense rule for corpus. Educational estimate only.">
      <div className="calc-inputs">
        <SliderField label="Current Age" value={currentAge} onChange={setCurrentAge} min={25} max={55} display={currentAge} />
        <SliderField label="Retirement Age" value={retireAge} onChange={setRetireAge} min={Math.max(currentAge + 1, 50)} max={70} display={retireAge} />
        <SliderField label="Monthly Expenses Today (₹)" value={monthlyExp} onChange={setMonthlyExp} min={20000} max={200000} step={5000} display={formatInr(monthlyExp)} />
        <SliderField label="Inflation Rate (%)" value={inflation} onChange={setInflation} min={3} max={10} step={0.5} display={`${inflation}%`} />
        <SliderField label="Expected Return (% p.a.)" value={expectedReturn} onChange={setExpectedReturn} min={6} max={15} step={0.5} display={`${expectedReturn}%`} />
      </div>
      <ResultGrid
        items={[
          { label: 'Years to Retirement', value: yearsToRetire, format: 'number' },
          { label: 'Future Monthly Expense', value: futureMonthlyExp, format: 'currency' },
          { label: 'Corpus Needed (25x)', value: corpusNeeded, format: 'currency', accent: true },
          { label: 'Monthly SIP Needed', value: sipNeeded, format: 'currency', total: true },
        ]}
      />
    </CalcPanel>
  );
}

// Retirement calculator panel

export function EducationCalculatorPanel() {
  const [currentCost, setCurrentCost] = useState(2000000);
  const [years, setYears] = useState(10);
  const [inflation, setInflation] = useState(7);
  const [savings, setSavings] = useState(200000);
  const [rate, setRate] = useState(12);

  const result = goalPlanning({
    currentCost: currentCost,
    years,
    inflation,
    currentSavings: savings,
    expectedReturn: rate,
  });

  return (
    <CalcPanel>
      <div className="calc-inputs">
        <SliderField label="Current Education Cost (₹)" value={currentCost} onChange={setCurrentCost} min={500000} max={5000000} step={100000} display={formatInr(currentCost)} />
        <SliderField label="Years Until Needed" value={years} onChange={setYears} min={1} max={20} display={`${years} years`} />
        <SliderField label="Education Inflation (%)" value={inflation} onChange={setInflation} min={4} max={12} step={0.5} display={`${inflation}%`} />
        <SliderField label="Current Savings (₹)" value={savings} onChange={setSavings} min={0} max={2000000} step={50000} display={formatInr(savings)} />
        <SliderField label="Expected Return (% p.a.)" value={rate} onChange={setRate} min={6} max={15} step={0.5} display={`${rate}%`} />
      </div>
      <ResultGrid
        items={[
          { label: 'Future Education Cost', value: result.target, format: 'currency', accent: true },
          { label: 'Savings Grow To', value: result.savingsFv, format: 'currency' },
          { label: 'Monthly SIP Needed', value: result.monthlySip, format: 'currency', total: true },
        ]}
      />
    </CalcPanel>
  );
}

export function LumpsumCalculatorPanel() {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const futureValue = lumpsumFutureValue(principal, rate, years);
  const returns = futureValue - principal;

  return (
    <CalcPanel>
      <div className="calc-inputs">
        <SliderField label="Investment Amount (₹)" value={principal} onChange={setPrincipal} min={10000} max={5000000} step={10000} display={formatInr(principal)} />
        <SliderField label="Expected Return (% p.a.)" value={rate} onChange={setRate} min={1} max={30} step={0.5} display={`${rate}%`} />
        <SliderField label="Time Period (Years)" value={years} onChange={setYears} min={1} max={40} display={`${years} years`} />
      </div>
      <ResultGrid
        items={[
          { label: 'Amount Invested', value: principal, format: 'currency' },
          { label: 'Est. Returns', value: returns, format: 'currency', accent: true },
          { label: 'Total Value', value: futureValue, format: 'currency', total: true },
        ]}
      />
    </CalcPanel>
  );
}

export function EmiCalculatorPanel() {
  const [loan, setLoan] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const { emi, totalPayment, totalInterest } = calculateEmi(loan, rate, years);

  return (
    <CalcPanel>
      <div className="calc-inputs">
        <SliderField label="Loan Amount (₹)" value={loan} onChange={setLoan} min={100000} max={20000000} step={100000} display={formatInr(loan)} />
        <SliderField label="Interest Rate (% p.a.)" value={rate} onChange={setRate} min={5} max={18} step={0.1} display={`${rate}%`} />
        <SliderField label="Loan Tenure (Years)" value={years} onChange={setYears} min={1} max={30} display={`${years} years`} />
      </div>
      <ResultGrid
        items={[
          { label: 'Monthly EMI', value: emi, format: 'currency', accent: true, total: true },
          { label: 'Total Payment', value: totalPayment, format: 'currency' },
          { label: 'Total Interest', value: totalInterest, format: 'currency' },
        ]}
      />
    </CalcPanel>
  );
}

export function DelayCalculatorPanel() {
  const [monthly, setMonthly] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);
  const [delayYears, setDelayYears] = useState(3);

  const maxDelay = Math.max(1, years - 1);
  const safeDelay = Math.min(delayYears, maxDelay);
  const result = costOfDelay(monthly, rate, years, safeDelay);

  return (
    <CalcPanel>
      <div className="calc-inputs">
        <SliderField label="Monthly SIP (₹)" value={monthly} onChange={setMonthly} min={500} max={100000} step={500} display={formatInr(monthly)} />
        <SliderField label="Expected Return (% p.a.)" value={rate} onChange={setRate} min={6} max={15} step={0.5} display={`${rate}%`} />
        <SliderField label="Investment Period (Years)" value={years} onChange={setYears} min={5} max={40} display={`${years} years`} />
        <SliderField label="Delay (Years)" value={safeDelay} onChange={setDelayYears} min={1} max={maxDelay} display={`${safeDelay} years`} />
      </div>
      <ResultGrid
        items={[
          { label: 'Corpus If Started Now', value: result.corpusNow, format: 'currency' },
          { label: 'Corpus If Delayed', value: result.corpusDelayed, format: 'currency' },
          { label: 'Wealth Lost', value: result.wealthLost, format: 'currency', accent: true },
          { label: 'Extra Monthly SIP Needed', value: result.extraMonthly, format: 'currency', total: true },
        ]}
      />
    </CalcPanel>
  );
}

export function HlvCalculatorPanel() {
  const [income, setIncome] = useState(1200000);
  const [expenses, setExpenses] = useState(480000);
  const [currentAge, setCurrentAge] = useState(35);
  const [retireAge, setRetireAge] = useState(60);
  const [liabilities, setLiabilities] = useState(3000000);
  const [existingCover, setExistingCover] = useState(0);

  const result = humanLifeValue({
    annualIncome: income,
    personalExpenses: expenses,
    currentAge,
    retirementAge: retireAge,
    discountRate: 8,
    inflation: 6,
    liabilities,
    existingCover,
  });

  return (
    <CalcPanel disclaimer="HLV based on discounted future net income plus liabilities. For term insurance planning only.">
      <div className="calc-inputs">
        <SliderField label="Annual Income (₹)" value={income} onChange={setIncome} min={300000} max={5000000} step={50000} display={formatInr(income)} />
        <SliderField label="Personal Expenses / Year (₹)" value={expenses} onChange={setExpenses} min={100000} max={2000000} step={50000} display={formatInr(expenses)} />
        <SliderField label="Current Age" value={currentAge} onChange={setCurrentAge} min={25} max={55} display={currentAge} />
        <SliderField label="Retirement Age" value={retireAge} onChange={setRetireAge} min={Math.max(currentAge + 1, 55)} max={65} display={retireAge} />
        <SliderField label="Outstanding Liabilities (₹)" value={liabilities} onChange={setLiabilities} min={0} max={10000000} step={100000} display={formatInr(liabilities)} />
        <SliderField label="Existing Life Cover (₹)" value={existingCover} onChange={setExistingCover} min={0} max={50000000} step={500000} display={formatInr(existingCover)} />
      </div>
      <ResultGrid
        items={[
          { label: 'Human Life Value', value: result.presentValue, format: 'currency' },
          { label: 'Income Multiple', value: `${Math.round(result.incomeMultiple)}×`, format: 'text' },
          { label: 'Recommended Cover', value: result.recommendedCover, format: 'currency', accent: true, total: true },
        ]}
      />
    </CalcPanel>
  );
}

export function SipTopUpCalculatorPanel() {
  const [monthly, setMonthly] = useState(10000);
  const [stepUp, setStepUp] = useState(10);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);

  const result = stepUpSip(monthly, stepUp, rate, years);

  return (
    <CalcPanel>
      <div className="calc-inputs">
        <SliderField label="Starting Monthly SIP (₹)" value={monthly} onChange={setMonthly} min={500} max={100000} step={500} display={formatInr(monthly)} />
        <SliderField label="Annual Step-Up (%)" value={stepUp} onChange={setStepUp} min={5} max={25} step={1} display={`${stepUp}%`} />
        <SliderField label="Expected Return (% p.a.)" value={rate} onChange={setRate} min={6} max={15} step={0.5} display={`${rate}%`} />
        <SliderField label="Investment Period (Years)" value={years} onChange={setYears} min={5} max={30} display={`${years} years`} />
      </div>
      <ResultGrid
        items={[
          { label: 'Total Invested', value: result.totalInvested, format: 'currency' },
          { label: 'Without Step-Up', value: result.regularSipValue, format: 'currency' },
          { label: 'With Step-Up', value: result.futureValue, format: 'currency', accent: true },
          { label: 'Extra Wealth', value: result.extraGain, format: 'currency', total: true },
        ]}
      />
    </CalcPanel>
  );
}

export function MarriageCalculatorPanel() {
  const [currentCost, setCurrentCost] = useState(3000000);
  const [years, setYears] = useState(15);
  const [inflation, setInflation] = useState(6);
  const [savings, setSavings] = useState(500000);
  const [rate, setRate] = useState(12);

  const result = goalPlanning({
    currentCost,
    years,
    inflation,
    currentSavings: savings,
    expectedReturn: rate,
  });

  return (
    <CalcPanel>
      <div className="calc-inputs">
        <SliderField label="Wedding Cost Today (₹)" value={currentCost} onChange={setCurrentCost} min={500000} max={10000000} step={100000} display={formatInr(currentCost)} />
        <SliderField label="Years Until Marriage" value={years} onChange={setYears} min={1} max={25} display={`${years} years`} />
        <SliderField label="Cost Inflation (%)" value={inflation} onChange={setInflation} min={4} max={10} step={0.5} display={`${inflation}%`} />
        <SliderField label="Current Savings (₹)" value={savings} onChange={setSavings} min={0} max={3000000} step={50000} display={formatInr(savings)} />
        <SliderField label="Expected Return (% p.a.)" value={rate} onChange={setRate} min={6} max={15} step={0.5} display={`${rate}%`} />
      </div>
      <ResultGrid
        items={[
          { label: 'Future Wedding Cost', value: result.target, format: 'currency', accent: true },
          { label: 'Savings Grow To', value: result.savingsFv, format: 'currency' },
          { label: 'Monthly SIP Needed', value: result.monthlySip, format: 'currency', total: true },
        ]}
      />
    </CalcPanel>
  );
}
