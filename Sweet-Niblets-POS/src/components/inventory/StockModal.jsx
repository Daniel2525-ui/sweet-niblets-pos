import { useState } from "react";

const EMPTY_FORM = {
  name: "",
  emoji: "",
  unit: "",
  stock: "",
  lowStockThreshold: "10",
};

export default function StockModal({ editTarget, onSave, onClose }) {
  const [form, setForm] = useState(
    editTarget
      ? {
          name: editTarget.name,
          emoji: editTarget.emoji || "",
          unit: editTarget.unit || "",
          stock: editTarget.stock ?? "",
          lowStockThreshold: editTarget.lowStockThreshold ?? 10,
        }
      : { ...EMPTY_FORM },
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.name.trim() || form.stock === "") {
      setError("Name and stock are required.");
      return;
    }
    const stock = parseInt(form.stock, 10);
    const lowStockThreshold = parseInt(form.lowStockThreshold, 10);
    if (isNaN(stock) || isNaN(lowStockThreshold)) {
      setError("Stock and threshold must be valid numbers.");
      return;
    }
    setError("");
    setSaving(true);
    await onSave({
      name: form.name.trim(),
      emoji: form.emoji.trim(),
      unit: form.unit.trim(),
      stock,
      lowStockThreshold,
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-0 sm:px-4">
      <div className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl bg-white p-4 sm:p-5 lg:p-6 shadow-xl">
        <h2 className="mb-4 text-base font-bold text-slate-800 sm:text-lg">
          {editTarget ? "Edit Stock Item" : "Add Stock Item"}
        </h2>

        {error && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-500">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3">
          {/* Name + Emoji */}
          <div className="grid grid-cols-[1fr_72px] gap-2.5 sm:grid-cols-[1fr_80px]">
            <div>
              <label className="mb-1 block text-[10px] font-semibold text-slate-500 sm:text-xs">
                Item Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 sm:text-sm"
                placeholder="e.g. Egg Tarts"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold text-slate-500 sm:text-xs">
                Emoji
              </label>
              <input
                type="text"
                value={form.emoji}
                onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 text-center sm:text-sm"
                placeholder="🥚"
              />
            </div>
          </div>

          {/* Unit */}
          <div>
            <label className="mb-1 block text-[10px] font-semibold text-slate-500 sm:text-xs">
              Unit{" "}
              <span className="font-normal text-slate-400">
                (e.g. pcs, box, bottle)
              </span>
            </label>
            <input
              type="text"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 sm:text-sm"
              placeholder="pcs"
            />
          </div>

          {/* Stock + Low Stock Threshold */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="mb-1 block text-[10px] font-semibold text-slate-500 sm:text-xs">
                Current Stock *
              </label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 sm:text-sm"
                placeholder="0"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold text-slate-500 sm:text-xs">
                Low Stock Alert
              </label>
              <input
                type="number"
                min="0"
                value={form.lowStockThreshold}
                onChange={(e) =>
                  setForm({ ...form, lowStockThreshold: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 sm:text-sm"
                placeholder="10"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors sm:text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 rounded-xl bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600 transition-colors disabled:opacity-60 sm:text-sm"
          >
            {saving ? "Saving…" : editTarget ? "Save Changes" : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  );
}
