export const genId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const formatPHP = (n) => `₱${Number(n).toFixed(2)}`;

export const filterSales = (sales, period) => {
  const now = new Date();

  return sales.filter((e) => {
    const d = new Date(e.date);

    if (period === "day")
      return d.toDateString() === now.toDateString();

    if (period === "week") {
      const w = new Date(now);
      w.setDate(now.getDate() - 7);
      return d >= w;
    }

    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });
}; 