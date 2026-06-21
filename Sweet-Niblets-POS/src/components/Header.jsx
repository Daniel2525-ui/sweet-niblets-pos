import { FiShoppingBag, FiPackage, FiBarChart2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Header({ clock, onShowDashboard }) {
  const navigate = useNavigate();
  return (
    <header className="rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm shadow-slate-200/70 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-950 text-white shadow-sm shadow-slate-900/10 sm:h-12 sm:w-12 sm:rounded-3xl">
          <FiShoppingBag className="h-4 w-4 sm:h-6 sm:w-6" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 sm:text-sm sm:tracking-[0.24em]">
            Sweet Niblets
          </p>
          <h1 className="text-lg font-semibold tracking-tight text-slate-950 sm:text-2xl lg:text-3xl">
            Point of Sale
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
          {clock}
        </span>
        <button
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:gap-2 sm:rounded-2xl sm:px-4 sm:py-2 sm:text-sm"
          onClick={() => navigate("/inventory")}
        >
          <FiPackage className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span>Inventory</span>
        </button>
        <button
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 sm:gap-2 sm:rounded-2xl sm:px-4 sm:py-2 sm:text-sm"
          onClick={onShowDashboard}
        >
          <FiBarChart2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span>Sales</span>
        </button>
      </div>
    </header>
  );
}
