import { FiTrash2 } from "react-icons/fi";
import { formatPHP } from "../utils/helpers";

export default function CartRow({ line, onChangeQty, onRemove }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-base text-white lg:h-10 lg:w-10 lg:text-lg">
        {line.emoji}
      </span>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-slate-950 lg:text-base">
          {line.name}
        </div>
        <div className="text-xs text-slate-500 lg:text-sm">
          {formatPHP(line.price)} each
        </div>
      </div>

      <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2 py-1">
        <button
          className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100"
          onClick={() => onChangeQty(line.id, -1)}
        >
          −
        </button>
        <span className="min-w-[1.25rem] text-center text-sm font-semibold text-slate-900 lg:text-base">
          {line.quantity}
        </span>
        <button
          className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100"
          onClick={() => onChangeQty(line.id, 1)}
        >
          +
        </button>
      </div>

      <div className="min-w-[4rem] text-right text-sm font-semibold text-slate-900 lg:text-base">
        {formatPHP(line.price * line.quantity)}
      </div>

      <button
        type="button"
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
        onClick={() => onRemove(line.id)}
        title="Remove"
      >
        <FiTrash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
