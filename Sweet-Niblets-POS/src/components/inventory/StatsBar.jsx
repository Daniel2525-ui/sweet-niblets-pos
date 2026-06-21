export default function StatsBar({
  totalItems,
  totalCategories,
  lowStockCount,
}) {
  return (
    <div className="mb-4 grid grid-cols-3 gap-2 sm:mb-5 sm:gap-3">
      <div className="rounded-xl bg-white border border-slate-200 p-2.5 sm:p-3 lg:p-4">
        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide sm:text-xs lg:text-sm">
          Raw Items
        </p>
        <p className="mt-0.5 text-lg font-bold text-slate-800 sm:text-xl lg:text-2xl">
          {totalItems}
        </p>
      </div>

      <div className="rounded-xl bg-white border border-slate-200 p-2.5 sm:p-3 lg:p-4">
        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide sm:text-xs lg:text-sm">
          Categories
        </p>
        <p className="mt-0.5 text-lg font-bold text-slate-800 sm:text-xl lg:text-2xl">
          {totalCategories}
        </p>
      </div>

      <div
        className={`rounded-xl border p-2.5 sm:p-3 lg:p-4 ${
          lowStockCount > 0
            ? "bg-red-50 border-red-200"
            : "bg-white border-slate-200"
        }`}
      >
        <p
          className={`text-[10px] font-medium uppercase tracking-wide sm:text-xs lg:text-sm ${
            lowStockCount > 0 ? "text-red-500" : "text-slate-500"
          }`}
        >
          Low Stock
        </p>
        <p
          className={`mt-0.5 text-lg font-bold sm:text-xl lg:text-2xl ${
            lowStockCount > 0 ? "text-red-600" : "text-slate-800"
          }`}
        >
          {lowStockCount}
        </p>
      </div>
    </div>
  );
}
