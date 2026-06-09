const formatter = new Intl.NumberFormat("ro-RO", {
  style: "currency",
  currency: "RON",
});

export const fmt = (value: number) => formatter.format(value);
