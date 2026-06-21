import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function MenuCard({ item, inventoryItems, onEdit, onDelete }) {
  const consumes = item.consumes || [];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-800 truncate">
            <span className="mr-1">{item.emoji}</span>
            {item.name}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {item.category && (
              <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-medium text-orange-700">
                {item.category}
              </span>
            )}
            <span className="text-xs font-semibold text-slate-700">
              ₱{Number(item.price).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Consumes */}
      <div className="mt-2 pt-2 border-t border-slate-100">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
          Deducts from stock
        </p>
        {consumes.length === 0 ? (
          <p className="text-[10px] text-slate-300">No deductions linked</p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {consumes.map((c, i) => {
              const inv = inventoryItems.find(
                (item) => item.firestoreId === c.inventoryItemId,
              );
              return (
                <span
                  key={i}
                  className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600"
                >
                  {c.qty} {inv?.name || "?"} {inv?.emoji || ""}
                </span>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-2.5 flex gap-2 border-t border-slate-100 pt-2.5">
        <button
          onClick={() => onEdit(item)}
          className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 py-1.5 text-[10px] font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <FiEdit2 className="h-3 w-3" />
          Edit
        </button>
        <button
          onClick={() => onDelete(item)}
          className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-red-200 py-1.5 text-[10px] font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <FiTrash2 className="h-3 w-3" />
          Delete
        </button>
      </div>
    </div>
  );
}
