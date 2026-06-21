export default function StockTable({ items, onEdit, onDelete }) {
  if (items.length === 0) {
    return (
      <div className="hidden sm:block overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="py-16 text-center">
          <p className="text-2xl mb-2">📦</p>
          <p className="text-sm font-medium text-slate-500">
            No stock items found.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Add a raw ingredient or packaging item to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden sm:block overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm lg:text-base">
        <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 lg:text-sm">
          <tr>
            <th className="px-4 py-3 text-left lg:px-5 lg:py-4">Item</th>
            <th className="px-4 py-3 text-left lg:px-5 lg:py-4">Unit</th>
            <th className="px-4 py-3 text-right lg:px-5 lg:py-4">Stock</th>
            <th className="px-4 py-3 text-right lg:px-5 lg:py-4">Alert At</th>
            <th className="px-4 py-3 text-right lg:px-5 lg:py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => {
            const isLow = (item.stock ?? 0) <= (item.lowStockThreshold ?? 10);
            return (
              <tr
                key={item.firestoreId}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-slate-800 lg:px-5 lg:py-4">
                  <span className="mr-2">{item.emoji}</span>
                  {item.name}
                </td>
                <td className="px-4 py-3 text-slate-500 lg:px-5 lg:py-4">
                  {item.unit || <span className="text-slate-300">—</span>}
                </td>
                <td className="px-4 py-3 text-right lg:px-5 lg:py-4">
                  <span
                    className={`font-semibold ${isLow ? "text-red-500" : "text-slate-700"}`}
                  >
                    {item.stock ?? "—"}
                    {isLow && <span className="ml-1 text-xs">⚠</span>}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-slate-400 text-xs lg:px-5 lg:py-4">
                  ≤ {item.lowStockThreshold ?? 10}
                </td>
                <td className="px-4 py-3 text-right lg:px-5 lg:py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors lg:px-4 lg:py-1.5 lg:text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors lg:px-4 lg:py-1.5 lg:text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
