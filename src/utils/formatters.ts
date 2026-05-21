export const formatInteger = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export const formatCompactCurrency = (value: number) => {
  if (value >= 1_00_00_000) {
    return `Rs. ${(value / 1_00_00_000).toFixed(2)} Cr`;
  }

  if (value >= 1_00_000) {
    return `Rs. ${(value / 1_00_000).toFixed(2)} L`;
  }

  return formatCurrency(value);
};

export const formatPercent = (value: number) =>
  `${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
  }).format(value)}%`;
