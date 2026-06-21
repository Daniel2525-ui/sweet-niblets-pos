export default function MenuTable({ items, inventoryItems, onEdit, onDelete }) {
  const getConsumesLabel = (consumes = []) => {
    if (consumes.length === 0)
      return <span className="text-slate-300">No deductions</span>;
    return consumes.map((c, i) => {
      const inv = inventoryItems.find(
        (item) => item.firestoreId === c.inventoryItemId,
      );
      return (
        <span key={i} className="inline-flex items-center gap-0.5">
          {i > 0 && <span className="text-slate-300 mx-1">+</span>}
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
            {c.qty} {inv?.name || "?"} {inv?.emoji || ""}
          </span>
        </span>
      );
    });
  };

  if (items.length === 0) {
    return (
      <div className="hidden sm:block overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="py-16 text-center">
          <p className="text-2xl mb-2">🍽️</p>
          <p className="text-sm font-medium text-slate-500">
            No menu items found.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Add a menu item and link it to raw stock.
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
            <th className="px-4 py-3 text-left lg:px-5 lg:py-4">Menu Item</th>
            <th className="px-4 py-3 text-left lg:px-5 lg:py-4">Category</th>
            <th className="px-4 py-3 text-right lg:px-5 lg:py-4">Price</th>
            <th className="px-4 py-3 text-left lg:px-5 lg:py-4">Deducts</th>
            <th className="px-4 py-3 text-right lg:px-5 lg:py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => (
            <tr
              key={item.firestoreId}
              className="hover:bg-slate-50 transition-colors"
            >
              <td className="px-4 py-3 font-medium text-slate-800 lg:px-5 lg:py-4">
                <span className="mr-2">{item.emoji}</span>
                {item.name}
              </td>
              <td className="px-4 py-3 lg:px-5 lg:py-4">
                {item.category ? (
                  <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">
                    {item.category}
                  </span>
                ) : (
                  <span className="text-slate-300">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-right text-slate-700 lg:px-5 lg:py-4">
                ₱{Number(item.price).toFixed(2)}
              </td>
              <td className="px-4 py-3 lg:px-5 lg:py-4">
                <div className="flex flex-wrap gap-1">
                  {getConsumesLabel(item.consumes)}
                </div>
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
