import { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

const EMPTY_FORM = { name: "", emoji: "", price: "", category: "" };

export default function MenuItemModal({
  editTarget,
  inventoryItems,
  onSave,
  onClose,
}) {
  const [form, setForm] = useState(
    editTarget
      ? {
          name: editTarget.name,
          emoji: editTarget.emoji || "",
          price: editTarget.price ?? "",
          category: editTarget.category || "",
        }
      : { ...EMPTY_FORM },
  );

  // consumes: [{ inventoryItemId, inventoryItemName, qty }]
  const [consumes, setConsumes] = useState(
    editTarget?.consumes?.map((c) => {
      const found = inventoryItems.find(
        (i) => i.firestoreId === c.inventoryItemId,
      );
      return { ...c, inventoryItemName: found?.name || "Unknown" };
    }) || [],
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const addConsumesRow = () => {
    if (inventoryItems.length === 0) return;
    const first = inventoryItems[0];
    setConsumes([
      ...consumes,
      {
        inventoryItemId: first.firestoreId,
        inventoryItemName: first.name,
        qty: 1,
      },
    ]);
  };

  const updateConsumesRow = (index, field, value) => {
    setConsumes((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        if (field === "inventoryItemId") {
          const found = inventoryItems.find(
            (item) => item.firestoreId === value,
          );
          return {
            ...row,
            inventoryItemId: value,
            inventoryItemName: found?.name || "",
          };
        }
        return { ...row, [field]: value };
      }),
    );
  };

  const removeConsumesRow = (index) => {
    setConsumes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || form.price === "") {
      setError("Name and price are required.");
      return;
    }
    const price = parseFloat(form.price);
    if (isNaN(price)) {
      setError("Price must be a valid number.");
      return;
    }
    for (const row of consumes) {
      const qty = parseInt(row.qty, 10);
      if (isNaN(qty) || qty <= 0) {
        setError(`Qty for "${row.inventoryItemName}" must be at least 1.`);
        return;
      }
    }
    setError("");
    setSaving(true);
    await onSave({
      name: form.name.trim(),
      emoji: form.emoji.trim(),
      price,
      category: form.category.trim(),
      consumes: consumes.map((c) => ({
        inventoryItemId: c.inventoryItemId,
        qty: parseInt(c.qty, 10),
      })),
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-0 sm:px-4">
      <div className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl bg-white p-4 sm:p-5 lg:p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="mb-4 text-base font-bold text-slate-800 sm:text-lg">
          {editTarget ? "Edit Menu Item" : "Add Menu Item"}
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
                Menu Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 sm:text-sm"
                placeholder="e.g. Egg Tarts Bagsak Presyo (2-pcs)"
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

          {/* Category + Price */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="mb-1 block text-[10px] font-semibold text-slate-500 sm:text-xs">
                Category
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 sm:text-sm"
                placeholder="e.g. Dessert"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold text-slate-500 sm:text-xs">
                Price (₱) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 sm:text-sm"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Consumes / Recipe */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div>
                <label className="text-[10px] font-semibold text-slate-500 sm:text-xs">
                  Deducts from Stock
                </label>
                <p className="text-[10px] text-slate-400">
                  What raw items does selling this consume?
                </p>
              </div>
              <button
                onClick={addConsumesRow}
                disabled={inventoryItems.length === 0}
                className="inline-flex items-center gap-1 rounded-lg bg-orange-50 border border-orange-200 px-2 py-1 text-[10px] font-semibold text-orange-600 hover:bg-orange-100 transition-colors disabled:opacity-40 sm:text-xs"
              >
                <FiPlus className="h-3 w-3" />
                Add
              </button>
            </div>

            {inventoryItems.length === 0 && (
              <p className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-[10px] text-amber-600 sm:text-xs">
                No stock items yet. Add raw inventory items first before linking
                them here.
              </p>
            )}

            {consumes.length === 0 && inventoryItems.length > 0 && (
              <p className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-[10px] text-slate-400 sm:text-xs">
                No deductions linked. Selling this item won't affect any stock.
              </p>
            )}

            <div className="flex flex-col gap-2">
              {consumes.map((row, index) => (
                <div key={index} className="flex items-center gap-2">
                  <select
                    value={row.inventoryItemId}
                    onChange={(e) =>
                      updateConsumesRow(
                        index,
                        "inventoryItemId",
                        e.target.value,
                      )
                    }
                    className="flex-1 rounded-lg border border-slate-200 px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 sm:text-sm"
                  >
                    {inventoryItems.map((inv) => (
                      <option key={inv.firestoreId} value={inv.firestoreId}>
                        {inv.emoji} {inv.name} ({inv.unit || "pcs"})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={row.qty}
                    onChange={(e) =>
                      updateConsumesRow(index, "qty", e.target.value)
                    }
                    className="w-16 rounded-lg border border-slate-200 px-2 py-2 text-xs text-center focus:outline-none focus:ring-2 focus:ring-orange-400 sm:text-sm"
                    placeholder="1"
                  />
                  <button
                    onClick={() => removeConsumesRow(index)}
                    className="rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50 transition-colors"
                  >
                    <FiTrash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
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
