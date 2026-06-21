import { formatPHP } from "../utils/helpers";

export default function ProductCard({ item, onAdd }) {
  return (
    <button
      type="button"
      onClick={() => onAdd(item.id)}
      onKeyDown={(e) => e.key === "Enter" && onAdd(item.id)}
      className="group flex h-32 w-full flex-col items-center justify-center gap-1.5 overflow-hidden rounded-[22px] border border-slate-200 bg-white p-3 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:h-40 sm:gap-2 sm:rounded-[30px] sm:p-4"
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-base text-white shadow-sm shadow-slate-900/10 sm:h-11 sm:w-11 sm:rounded-2xl sm:text-xl">
        {item.emoji}
      </span>
      <span className="text-xs font-semibold text-slate-950 sm:text-sm">
        {item.name}
      </span>
      <span className="text-[10px] font-medium text-slate-600 sm:text-xs">
        {formatPHP(item.price)}
      </span>
    </button>
  );
}
