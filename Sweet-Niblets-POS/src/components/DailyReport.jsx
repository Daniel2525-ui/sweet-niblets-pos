import { formatPHP } from "../utils/helpers";

export default function DailyReport({ date, sales, onClose }) {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const daySales = sales.filter((sale) => {
    const saleDate = new Date(sale.date);
    return saleDate >= dayStart && saleDate <= dayEnd;
  });

  const totalRevenue = daySales.reduce((sum, sale) => sum + sale.total, 0);
  const totalTransactions = daySales.length;

  const itemMap = new Map();
  daySales.forEach((sale) => {
    sale.items.forEach((item) => {
      if (!itemMap.has(item.id)) {
        itemMap.set(item.id, {
          id: item.id,
          name: item.name,
          emoji: item.emoji,
          price: item.price,
          quantity: 0,
          revenue: 0,
        });
      }
      const entry = itemMap.get(item.id);
      entry.quantity += item.qty;
      entry.revenue += item.price * item.qty;
    });
  });

  const itemsList = Array.from(itemMap.values()).sort(
    (a, b) => b.quantity - a.quantity,
  );

  return (
    <div className="modal-backdrop">
      <div className="modal-panel">
        <div className="flex items-start justify-between border-b border-slate-200 pb-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Daily Report</h2>
            <p className="mt-1 text-sm text-slate-500">
              {new Date(date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <button
            type="button"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="modal-body space-y-8">
          {daySales.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <p className="text-sm text-slate-500">
                No sales data for this day
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Total Revenue
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-950">
                    {formatPHP(totalRevenue)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Transactions
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-950">
                    {totalTransactions}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Avg per Sale
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-950">
                    {formatPHP(totalRevenue / totalTransactions)}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-600">
                  Items Sold ({itemsList.length})
                </h3>
                <div className="space-y-3">
                  {itemsList.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="text-xl">{item.emoji}</span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold text-slate-950">
                            {item.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {item.quantity} sold
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-slate-950">
                          {formatPHP(item.revenue)}
                        </div>
                        <div className="text-xs text-slate-500">
                          {formatPHP(item.price)} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-600">
                  Top Seller
                </h3>
                {itemsList.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{itemsList[0].emoji}</span>
                      <div>
                        <p className="font-semibold text-slate-950">
                          {itemsList[0].name}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {itemsList[0].quantity} units sold for{" "}
                          {formatPHP(itemsList[0].revenue)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
