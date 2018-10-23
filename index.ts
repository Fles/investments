const investments = [{
  investment_id: '12JXK5',
  year: 0,
  revenue_go: 0.0,
  capex_go: 30000.0,
  opex_go: 10000.0,
  revenue_nogo: 15000.0,
  capex_nogo: 0.0,
  opex_nogo: 5000.0,
}, {
  investment_id: '12JXK5',
  year: 1,
  revenue_go: 25000.0,
  capex_go: 0.0,
  opex_go: 10000.0,
  revenue_nogo: 10000.0,
  capex_nogo: 0.0,
  opex_nogo: 5000.0,
}, {
  investment_id: '12JXK5',
  year: 2,
  revenue_go: 40000.0,
  capex_go: 0.0,
  opex_go: 10000.0,
  revenue_nogo: 5000.0,
  capex_nogo: 0.0,
  opex_nogo: 5000.0,
}, {
  investment_id: '12JXK5',
  year: 3,
  revenue_go: 45000.0,
  capex_go: 0.0,
  opex_go: 10000.0,
  revenue_nogo: 5000.0,
  capex_nogo: 0.0,
  opex_nogo: 5000.0,
}, {
  investment_id: 'HT4AA2',
  year: 0,
  revenue_go: 100.0,
  capex_go: 15500.0,
  opex_go: 2000.0,
  revenue_nogo: 1000.0,
  capex_nogo: 0.0,
  opex_nogo: 1250.0,
}];

interface Investment {
  investment_id: string;
  year: number;
  revenue_go: number;
  capex_go: number;
  opex_go: number;
  revenue_nogo: number;
  capex_nogo: number;
  opex_nogo: number;
}

interface IncrementalCashflow {
  investment_id: string;
  year: number;
  incremental_cashflow: number;
}

interface Cashflow {
  investment_id: string;
  year: number;
  cashflow: number;
};

const filterByInvesmentId = (investments: Investment[], id: string): Investment[] => {
  return investments.filter(i => i.investment_id === id);
}

const calculate_go = (investment: Investment): number => {
  return investment.revenue_go - investment.capex_go - investment.opex_go;
};

const calculate_nogo = (investment: Investment): number => {
  return investment.revenue_nogo - investment.capex_nogo - investment.opex_nogo;
};

const convertToIncrementalCashflow = (investment: Investment): IncrementalCashflow => {
  const { investment_id, year } = investment;
  return {
    incremental_cashflow: calculate_go(investment) - calculate_nogo(investment),
    investment_id,
    year, 
  } 
}

const calculate_incremental_cashflows = (incremental_cashflows: Investment[]): IncrementalCashflow[] => incremental_cashflows.map(convertToIncrementalCashflow);

const calculate_cashflows = (incremental_cashflows: IncrementalCashflow[]): Cashflow[] => {
  let cashflows = [];
  incremental_cashflows.forEach((value: IncrementalCashflow, index: number) => {
    const {investment_id, year, incremental_cashflow} = value;
    if (index === 0) {
      cashflows.push({investment_id, year, cashflow: incremental_cashflow})
    } else {
      cashflows.push({investment_id, year, cashflow: cashflows[index-1].cashflow + value.incremental_cashflow})
    }
  });
  return cashflows;
};

const calculate_payback_period = (cashflows: Cashflow[]): number => {

  const lastNegativeCashflow: Cashflow = cashflows.filter((value: Cashflow) => value.cashflow <= 0).sort((a, b) => b.cashflow - a.cashflow)[0];
  const firstPositiveCashflow: Cashflow = cashflows.filter((value: Cashflow) => value.cashflow >= 0).sort((a, b) => b.cashflow - a.cashflow)[0];

  const cashflow_ratio = ((0 - lastNegativeCashflow.cashflow) / (firstPositiveCashflow.cashflow - lastNegativeCashflow.cashflow));

  return Math.round((lastNegativeCashflow.year + cashflow_ratio) * 10) / 10;
};

const incremental_cashflows = calculate_incremental_cashflows(filterByInvesmentId(investments, '12JXK5').sort((a, b) => a.year - b.year));
const cashflows = calculate_cashflows(incremental_cashflows);
const payback_period = calculate_payback_period(cashflows);

console.log(payback_period);
