export type SalaryInputs = {
  hourlyRate: number;
  hoursPerWeek: number;
  weeksPerYear: number;
};

export type SalaryOutputs = {
  daily: number;
  weekly: number;
  biweekly: number;
  monthly: number;
  yearly: number;
};

export function calcFromHourly({ hourlyRate, hoursPerWeek, weeksPerYear }: SalaryInputs): SalaryOutputs {
  const weekly = hourlyRate * hoursPerWeek;
  const yearly = weekly * weeksPerYear;
  const biweekly = weekly * 2;
  const monthly = yearly / 12;
  const daily = hourlyRate * 8;

  return { daily, weekly, biweekly, monthly, yearly };
}

export function formatMoney(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}
