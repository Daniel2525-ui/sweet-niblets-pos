import { useState, useEffect, useMemo } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiShoppingBag, FiPlus, FiSearch, FiPackage } from "react-icons/fi";

import StatsBar from "../components/inventory/StatsBar";
import StockTable from "../components/inventory/StockTable";
import StockCard from "../components/inventory/StockCard";
import StockModal from "../components/inventory/StockModal";
import DeleteConfirmModal from "../components/inventory/DeleteConfirmModal";

export default function Inventory() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "inventoryItems"),
      (snap) => {
        setItems(snap.docs.map((d) => ({ ...d.data(), firestoreId: d.id })));
        setLoading(false);
      },
      (err) => {
        toast.error("Failed to load inventory");
        console.error(err);
        setLoading(false);
      },
    );
    return () => unsub();
  }, []);

  const categories = useMemo(
    () => [
      "all",
      ...Array.from(new Set(items.map((i) => i.category).filter(Boolean))),
    ],
    [items],
  );

  const lowStockCount = useMemo(
    () =>
      items.filter((i) => (i.stock ?? 0) <= (i.lowStockThreshold ?? 10)).length,
    [items],
  );

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchSearch = item.name
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchFilter =
        filter === "all"
          ? true
          : filter === "low"
            ? (item.stock ?? 0) <= (item.lowStockThreshold ?? 10)
            : item.category === filter;
      return matchSearch && matchFilter;
    });
  }, [items, search, filter]);

  const handleSave = async (payload) => {
    try {
      if (editTarget) {
        await updateDoc(
          doc(db, "inventoryItems", editTarget.firestoreId),
          payload,
        );
        toast.success("Stock item updated", { theme: "light" });
      } else {
        await addDoc(collection(db, "inventoryItems"), payload);
        toast.success("Stock item added", { theme: "light" });
      }
      setShowModal(false);
      setEditTarget(null);
    } catch (err) {
      toast.error("Failed to save item");
      console.error(err);
      throw err; 
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "inventoryItems", deleteTarget.firestoreId));
      toast.success("Item deleted", { theme: "light" });
      setDeleteTarget(null);
    } catch (err) {
      toast.error("Failed to delete item");
      console.error(err);
    }
  };

  const openAdd = () => {
    setEditTarget(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditTarget(item);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-xs font-semibold text-slate-500 lg:text-sm">
          Loading inventory...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
          <div className="flex items-center gap-2 min-w-0 sm:gap-3">
            <button
              onClick={() => navigate("/")}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:px-3 sm:py-2 sm:text-sm lg:px-4 lg:text-base"
            >
              <FiShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Back to POS</span>
            </button>
            <button
              onClick={() => navigate("/menu-setup")}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:px-3 sm:py-2 sm:text-sm lg:px-4 lg:text-base"
            >
              <FiPackage className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Menu Setup</span>
            </button>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-slate-800 sm:text-xl lg:text-2xl">
                Raw Inventory
              </h1>
              <p className="hidden text-xs text-slate-500 sm:block lg:text-sm">
                Track actual physical stock — ingredients and packaging
              </p>
            </div>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-orange-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 transition-colors sm:gap-2 sm:px-3 sm:py-2 sm:text-sm lg:px-4 lg:py-2.5 lg:text-base"
          >
            <FiPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Add Item</span>
          </button>
        </div>

        {/* Stats */}
        <StatsBar
          totalItems={items.length}
          totalCategories={categories.length - 1}
          lowStockCount={lowStockCount}
        />

        {/* Search */}
        <div className="mb-2.5 relative sm:mb-3">
          <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 sm:left-3 sm:h-4 sm:w-4" />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 sm:pl-9 sm:py-2 sm:text-sm lg:py-2.5 lg:text-base"
          />
        </div>

        {/* Filter tabs */}
        <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide sm:mb-4 sm:gap-2">
          {["all", "low", ...categories.slice(1)].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-colors sm:px-3 sm:py-1 sm:text-xs lg:text-sm lg:px-4 lg:py-1.5 ${
                filter === cat
                  ? "bg-orange-500 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat === "all"
                ? "All"
                : cat === "low"
                  ? `⚠ Low Stock (${lowStockCount})`
                  : cat}
            </button>
          ))}
        </div>

        {/* Desktop table */}
        <StockTable
          items={filtered}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
        />

        {/* Mobile cards */}
        <div className="sm:hidden space-y-2.5">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white py-12 text-center text-xs text-slate-400">
              No items found.
            </div>
          ) : (
            filtered.map((item) => (
              <StockCard
                key={item.firestoreId}
                item={item}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
              />
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <StockModal
          editTarget={editTarget}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditTarget(null);
          }}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          itemName={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
