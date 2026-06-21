import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { formatPHP } from "../utils/helpers";

function CartItem({ item, onUpdateQty, onRemove }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-base text-white lg:h-10 lg:w-10 lg:text-lg">
          {item.emoji}
        </span>

        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-slate-950 lg:text-base">
            {item.name}
          </div>
          <div className="text-xs text-slate-500 lg:text-sm">
            {formatPHP(item.price)} each
          </div>
        </div>

        <button
          type="button"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 lg:h-8 lg:w-8"
          onClick={() => onRemove(item.id)}
          title="Remove"
        >
          <FiTrash2 className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
        </button>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2 pl-11 lg:pl-12">
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-1.5 py-1">
          <button
            type="button"
            className="inline-flex h-6 w-6 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 lg:h-7 lg:w-7"
            onClick={() => onUpdateQty(item.id, item.qty - 1)}
          >
            -
          </button>
          <span className="min-w-[1.25rem] text-center text-sm font-semibold text-slate-900 lg:text-base">
            {item.qty}
          </span>
          <button
            type="button"
            className="inline-flex h-6 w-6 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 lg:h-7 lg:w-7"
            onClick={() => onUpdateQty(item.id, item.qty + 1)}
          >
            +
          </button>
        </div>

        <span className="text-sm font-semibold text-slate-900 lg:text-base">
          {formatPHP(item.price * item.qty)}
        </span>
      </div>
    </div>
  );
}

export default function CartPanel({
  cart = [],
  onRemove,
  onUpdateQty,
  onCheckout,
}) {
  const [cash, setCash] = useState("");
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);
  const cashAmount = parseFloat(cash) || 0;
  const change = cashAmount - total;
  const isExactOrMore = cashAmount >= total;

  const handleCheckout = () => {
    onCheckout();
    setCash("");
  };

  return (
    <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 lg:p-6">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-950 lg:text-lg">
            Cart
          </h2>
          <p className="mt-1 text-xs text-slate-500 lg:text-sm">
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </p>
        </div>
        {itemCount > 0 && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
            {itemCount} in cart
          </span>
        )}
      </div>

      {/* Items */}
      <div className="min-h-[220px] space-y-2.5 py-4">
        {cart.length === 0 ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
            <span className="text-4xl">🛒</span>
            <span className="font-semibold text-slate-900 lg:text-base">
              Cart is empty
            </span>
            <span className="lg:text-base">Tap a product to add it</span>
          </div>
        ) : (
          cart.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQty={onUpdateQty}
              onRemove={onRemove}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="space-y-4 border-t border-slate-200 pt-4">
        <div className="flex items-center justify-between text-sm text-slate-600 lg:text-base">
          <span>Total</span>
          <span className="font-semibold text-slate-950">
            {formatPHP(total)}
          </span>
        </div>

        {cart.length > 0 && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 lg:text-sm">
                Cash Tendered
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                <span className="text-sm font-semibold text-slate-400 lg:text-base">
                  ₱
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={cash}
                  onChange={(e) => setCash(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400 lg:text-base"
                />
              </div>
            </div>

            {cashAmount > 0 && (
              <div
                className={`flex items-center justify-between rounded-2xl px-4 py-3 ${
                  isExactOrMore
                    ? "bg-emerald-50 border border-emerald-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <span
                  className={`text-xs font-semibold uppercase tracking-wider lg:text-sm ${
                    isExactOrMore ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {isExactOrMore ? "Change" : "Short by"}
                </span>
                <span
                  className={`text-lg font-bold lg:text-xl ${
                    isExactOrMore ? "text-emerald-700" : "text-red-600"
                  }`}
                >
                  {formatPHP(Math.abs(change))}
                </span>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          className="w-full rounded-3xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 lg:py-3.5 lg:text-base"
          onClick={handleCheckout}
          disabled={cart.length === 0 || !isExactOrMore}
        >
          Charge {formatPHP(total)}
        </button>
      </div>
    </section>
  );
}
