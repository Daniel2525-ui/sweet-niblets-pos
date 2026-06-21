export default function DeleteConfirmModal({ itemName, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl sm:p-6">
        <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
          <span className="text-lg">🗑️</span>
        </div>
        <h2 className="mt-3 text-base font-bold text-slate-800 sm:text-lg">
          Delete "{itemName}"?
        </h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          This cannot be undone. All stock data for this item will be
          permanently removed.
        </p>
        <div className="mt-5 flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors sm:text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-500 px-4 py-2 text-xs font-semibold text-white hover:bg-red-600 transition-colors sm:text-sm"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
