import { useState, useMemo } from "react";
import { formatPHP } from "../utils/helpers";
import { FiTrash2 } from "react-icons/fi";

function getWeekRange(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
}

function getMonthWeeks(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const weeks = [];
  let current = new Date(firstDay);
  let weekNum = 1;
  while (current <= lastDay) {
    const weekStart = new Date(current);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(current);
    weekEnd.setDate(weekEnd.getDate() + 6);
    if (weekEnd > lastDay) weekEnd.setTime(lastDay.getTime());
    weekEnd.setHours(23, 59, 59, 999);
    weeks.push({ weekNum, weekStart, weekEnd });
    current.setDate(current.getDate() + 7);
    weekNum++;
  }
  return weeks;
}

function getDaySales(sales, date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return sales.filter((s) => {
    const d = new Date(s.date);
    return d >= start && d <= end;
  });
}

function getRangeSales(sales, start, end) {
  return sales.filter((s) => {
    const d = new Date(s.date);
    return d >= start && d <= end;
  });
}

function aggregateItems(sales) {
  const map = new Map();
  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      if (!map.has(item.id)) {
        map.set(item.id, {
          id: item.id,
          name: item.name,
          emoji: item.emoji,
          price: item.price,
          qty: 0,
          revenue: 0,
        });
      }
      const e = map.get(item.id);
      e.qty += item.qty;
      e.revenue += item.price * item.qty;
    });
  });
  return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
}

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDateTime(dateStr) {
  return (
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    ", " +
    formatTime(dateStr)
  );
}

function StatCards({ sales }) {
  const total = sales.reduce((s, x) => s + x.total, 0);
  const transactions = sales.length;
  const items = sales.reduce(
    (s, x) => s + x.items.reduce((a, i) => a + i.qty, 0),
    0,
  );
  const avg = transactions > 0 ? total / transactions : 0;

  return (
    <div className="grid grid-cols-2 gap-2 lg:gap-3">
      {[
        { label: "Total Revenue", value: formatPHP(total), emoji: "💰" },
        { label: "Transactions", value: transactions, emoji: "🧾" },
        { label: "Items Sold", value: items, emoji: "🧁" },
        { label: "Avg Order", value: formatPHP(avg), emoji: "📈" },
      ].map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-slate-200 bg-amber-50 p-3 lg:p-4"
        >
          <div className="text-lg lg:text-2xl">{card.emoji}</div>
          <div className="mt-1 text-base lg:text-xl font-bold text-slate-950 leading-tight break-all">
            {card.value}
          </div>
          <div className="mt-1 text-[10px] lg:text-xs font-semibold uppercase tracking-wider text-slate-500 leading-tight">
            {card.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function ItemBreakdown({ sales }) {
  const items = aggregateItems(sales);
  if (items.length === 0)
    return (
      <p className="text-sm lg:text-base text-slate-500">No items sold.</p>
    );

  return (
    <div className="space-y-2">
      <p className="text-xs lg:text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">
        Sales breakdown per item
      </p>
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 lg:px-4 lg:py-3"
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-base lg:text-xl shrink-0">{item.emoji}</span>
            <span className="text-sm lg:text-base font-medium text-slate-700 truncate">
              {item.name}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0 text-xs lg:text-sm text-slate-500">
            <span className="whitespace-nowrap">{item.qty} sold</span>
            <span className="font-semibold text-slate-950 whitespace-nowrap">
              {formatPHP(item.revenue)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function TransactionHistory({ sales, onDeleteSale }) {
  if (sales.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs lg:text-sm font-semibold uppercase tracking-wider text-slate-500">
        Transaction History
      </p>
      {sales.map((sale) => (
        <div
          key={sale.id}
          className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 lg:px-4 lg:py-4"
        >
          <div className="flex-1 min-w-0">
            <p className="text-xs lg:text-sm text-slate-400">
              {formatDateTime(sale.date)}
            </p>
            <p className="text-sm lg:text-base font-bold text-slate-950 mt-0.5">
              {formatPHP(sale.total)}
            </p>
          </div>
          <button
            type="button"
            className="group inline-flex h-8 w-8 lg:h-10 lg:w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white transition hover:border-red-300 hover:bg-red-50"
            onClick={() => onDeleteSale(sale.id)}
            title="Delete"
          >
            <FiTrash2 className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-slate-400 transition group-hover:text-red-500" />
          </button>
        </div>
      ))}
    </div>
  );
}

function DayBlock({ date, sales, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const daySales = getDaySales(sales, date);
  const total = daySales.reduce((s, x) => s + x.total, 0);
  const label = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between gap-2 px-4 py-3 lg:px-5 lg:py-4 hover:bg-slate-50 transition"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex flex-col items-start min-w-0 flex-1">
          <span className="text-sm lg:text-base font-semibold text-slate-950 truncate w-full text-left">
            {label}
          </span>
          <span className="text-xs lg:text-sm text-slate-500">
            {daySales.length} transaction{daySales.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm lg:text-base font-semibold text-slate-950">
            {formatPHP(total)}
          </span>
          <span className="text-slate-400 text-xs lg:text-sm">
            {open ? "▲" : "▼"}
          </span>
        </div>
      </button>
      {open && daySales.length > 0 && (
        <div className="border-t border-slate-100 px-4 py-4 lg:px-5 lg:py-5 space-y-4">
          <StatCards sales={daySales} />
          <ItemBreakdown sales={daySales} />
        </div>
      )}
      {open && daySales.length === 0 && (
        <div className="border-t border-slate-100 px-4 py-4 text-sm lg:text-base text-slate-400">
          No sales this day.
        </div>
      )}
    </div>
  );
}

function WeekBlock({
  weekNum,
  weekStart,
  weekEnd,
  sales,
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const weekSales = getRangeSales(sales, weekStart, weekEnd);
  const total = weekSales.reduce((s, x) => s + x.total, 0);
  const days = [];
  const cur = new Date(weekStart);
  while (cur <= weekEnd) {
    days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }

  const dateRange =
    weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    " – " +
    weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between gap-2 px-4 py-3 lg:px-5 lg:py-4 hover:bg-slate-50 transition"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex flex-col items-start min-w-0 flex-1">
          <span className="text-sm lg:text-base font-semibold text-slate-950">
            Week {weekNum}
          </span>
          <span className="text-xs lg:text-sm text-slate-500">{dateRange}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm lg:text-base font-semibold text-slate-950">
            {formatPHP(total)}
          </span>
          <span className="text-slate-400 text-xs lg:text-sm">
            {open ? "▲" : "▼"}
          </span>
        </div>
      </button>
      {open && (
        <div className="border-t border-slate-100 px-4 py-4 lg:px-5 lg:py-5 space-y-3">
          <StatCards sales={weekSales} />
          <ItemBreakdown sales={weekSales} />
          <div className="space-y-2 pt-2">
            {days.map((day) => (
              <DayBlock key={day.toISOString()} date={day} sales={sales} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SalesDashboard({
  sales,
  onClose,
  onClearAll,
  onDeleteSale,
}) {
  const [period, setPeriod] = useState("day");
  const now = new Date();

  const todaySales = useMemo(() => getDaySales(sales, now), [sales]);
  const { monday, sunday } = useMemo(() => getWeekRange(now), []);
  const thisWeekSales = useMemo(
    () => getRangeSales(sales, monday, sunday),
    [sales],
  );
  const monthWeeks = useMemo(() => getMonthWeeks(now), []);
  const thisMonthSales = useMemo(() => {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
    return getRangeSales(sales, start, end);
  }, [sales]);

  const weekDays = useMemo(() => {
    const days = [];
    const cur = new Date(monday);
    while (cur <= sunday) {
      days.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return days;
  }, [monday, sunday]);

  const activeSales =
    period === "day"
      ? todaySales
      : period === "week"
        ? thisWeekSales
        : thisMonthSales;

  return (
    <div className="modal-backdrop">
      <div className="modal-panel">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-950 sm:text-2xl lg:text-3xl">
              Sales Dashboard
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm lg:text-base">
              Review recent activity and transactions.
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-2xl border border-slate-200 bg-white px-3 py-2 lg:px-4 lg:py-2.5 text-sm lg:text-base font-semibold text-slate-700 transition hover:bg-red-50 hover:border-red-200 hover:text-red-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="modal-body space-y-5">
          {/* Period tabs */}
          <div className="flex gap-2">
            {[
              ["day", "Today"],
              ["week", "This Week"],
              ["month", "This Month"],
            ].map(([val, label]) => (
              <button
                key={val}
                type="button"
                className={`flex-1 rounded-xl px-2 py-2 lg:py-3 text-xs font-semibold transition sm:text-sm lg:text-base sm:px-3 ${
                  period === val
                    ? "bg-slate-950 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
                onClick={() => setPeriod(val)}
              >
                {label}
              </button>
            ))}
          </div>

          <StatCards sales={activeSales} />

          {period === "day" && (
            <div className="space-y-5">
              <ItemBreakdown sales={todaySales} />
              <TransactionHistory
                sales={todaySales}
                onDeleteSale={onDeleteSale}
              />
              {todaySales.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-10 text-center text-sm lg:text-base text-slate-500">
                  No sales today yet
                </div>
              )}
            </div>
          )}

          {period === "week" && (
            <div className="space-y-3">
              <ItemBreakdown sales={thisWeekSales} />
              <div className="space-y-2 pt-1">
                {weekDays.map((day) => (
                  <DayBlock
                    key={day.toISOString()}
                    date={day}
                    sales={sales}
                    defaultOpen={day.toDateString() === now.toDateString()}
                  />
                ))}
              </div>
            </div>
          )}

          {period === "month" && (
            <div className="space-y-3">
              <ItemBreakdown sales={thisMonthSales} />
              <div className="space-y-2 pt-1">
                {monthWeeks.map((w) => (
                  <WeekBlock
                    key={w.weekNum}
                    weekNum={w.weekNum}
                    weekStart={w.weekStart}
                    weekEnd={w.weekEnd}
                    sales={sales}
                    defaultOpen={now >= w.weekStart && now <= w.weekEnd}
                  />
                ))}
              </div>
            </div>
          )}

          {activeSales.length > 0 && (
            <div className="flex justify-end border-t border-slate-200 pt-4">
              <button
                type="button"
                className="w-full rounded-2xl bg-red-600 px-5 py-2.5 lg:py-3 text-sm lg:text-base font-semibold text-white transition hover:bg-red-700 sm:w-auto"
                onClick={onClearAll}
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
