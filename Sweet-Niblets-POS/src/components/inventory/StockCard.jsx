import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function StockCard({ item, onEdit, onDelete }) {
  const isLow = (item.stock ?? 0) <= (item.lowStockThreshold ?? 10);

  return (
    <div
      className={`rounded-xl border bg-white p-3 ${
        isLow ? "border-red-200" : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-800 truncate">
            <span className="mr-1">{item.emoji}</span>
            {item.name}
          </p>
          <p className="mt-0.5 text-[10px] text-slate-400">
            {item.unit ? `per ${item.unit}` : "no unit set"}
          </p>
        </div>
        <div className="flex flex-col items-end gap-0.5 shrink-0">
          <span
            className={`text-sm font-bold ${isLow ? "text-red-500" : "text-slate-700"}`}
          >
            {item.stock ?? "—"} {isLow && "⚠"}
          </span>
          <p className="text-[10px] text-slate-400">in stock</p>
        </div>
      </div>

      {isLow && (
        <p className="mt-1.5 text-[10px] font-medium text-red-400">
          Alert threshold: ≤ {item.lowStockThreshold ?? 10} {item.unit || "pcs"}
        </p>
      )}

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
