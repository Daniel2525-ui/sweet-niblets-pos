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
import { FiShoppingBag, FiPlus, FiSearch, FiArchive } from "react-icons/fi";
import { genId } from "../utils/helpers";

import MenuTable from "../components/menu/MenuTable";
import MenuCard from "../components/menu/MenuCard";
import MenuItemModal from "../components/menu/MenuItemModal";
import DeleteConfirmModal from "../components/inventory/DeleteConfirmModal";

export default function MenuSetup() {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    let menuLoaded = false;
    let invLoaded = false;

    const checkDone = () => {
      if (menuLoaded && invLoaded) setLoading(false);
    };

    const unsubMenu = onSnapshot(
      collection(db, "menuItems"),
      (snap) => {
        setMenuItems(
          snap.docs.map((d) => ({ ...d.data(), firestoreId: d.id })),
        );
        menuLoaded = true;
        checkDone();
      },
      (err) => {
        toast.error("Failed to load menu items");
        console.error(err);
        setLoading(false);
      },
    );

    const unsubInv = onSnapshot(
      collection(db, "inventoryItems"),
      (snap) => {
        setInventoryItems(
          snap.docs.map((d) => ({ ...d.data(), firestoreId: d.id })),
        );
        invLoaded = true;
        checkDone();
      },
      (err) => {
        toast.error("Failed to load inventory items");
        console.error(err);
        setLoading(false);
      },
    );

    return () => {
      unsubMenu();
      unsubInv();
    };
  }, []);

  const categories = useMemo(
    () => [
      "all",
      ...Array.from(new Set(menuItems.map((i) => i.category).filter(Boolean))),
    ],
    [menuItems],
  );

  const filtered = useMemo(() => {
    return menuItems.filter((item) => {
      const matchSearch = item.name
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchFilter = filter === "all" ? true : item.category === filter;
      return matchSearch && matchFilter;
    });
  }, [menuItems, search, filter]);

  const handleSave = async (payload) => {
    try {
      if (editTarget) {
        await updateDoc(doc(db, "menuItems", editTarget.firestoreId), payload);
        toast.success("Menu item updated", { theme: "light" });
      } else {
        await addDoc(collection(db, "menuItems"), {
          ...payload,
          id: genId(),
          order: menuItems.length + 1,
        });
        toast.success("Menu item added", { theme: "light" });
      }
      setShowModal(false);
      setEditTarget(null);
    } catch (err) {
      toast.error("Failed to save menu item");
      console.error(err);
      throw err;
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "menuItems", deleteTarget.firestoreId));
      toast.success("Menu item deleted", { theme: "light" });
      setDeleteTarget(null);
    } catch (err) {
      toast.error("Failed to delete menu item");
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
          Loading menu setup...
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
              onClick={() => navigate("/inventory")}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:px-3 sm:py-2 sm:text-sm lg:px-4 lg:text-base"
            >
              <FiArchive className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Raw Inventory</span>
            </button>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-slate-800 sm:text-xl lg:text-2xl">
                Menu Setup
              </h1>
              <p className="hidden text-xs text-slate-500 sm:block lg:text-sm">
                Configure menu items and link them to raw stock
              </p>
            </div>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-orange-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 transition-colors sm:gap-2 sm:px-3 sm:py-2 sm:text-sm lg:px-4 lg:py-2.5 lg:text-base"
          >
            <FiPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Add Menu Item</span>
          </button>
        </div>

        {/* Info banner if no inventory items exist yet */}
        {inventoryItems.length === 0 && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-xs font-semibold text-amber-700 sm:text-sm">
              ⚠ No raw stock items found
            </p>
            <p className="mt-0.5 text-xs text-amber-600">
              Go to{" "}
              <button
                onClick={() => navigate("/inventory")}
                className="underline font-semibold"
              >
                Raw Inventory
              </button>{" "}
              first and add items like "Egg Tarts", "2-pc Box", etc. Then come
              back here to link them.
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="mb-4 grid grid-cols-2 gap-2 sm:mb-5 sm:gap-3">
          <div className="rounded-xl bg-white border border-slate-200 p-2.5 sm:p-3 lg:p-4">
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide sm:text-xs">
              Menu Items
            </p>
            <p className="mt-0.5 text-lg font-bold text-slate-800 sm:text-xl lg:text-2xl">
              {menuItems.length}
            </p>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-2.5 sm:p-3 lg:p-4">
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide sm:text-xs">
              Unmapped Items
            </p>
            <p className="mt-0.5 text-lg font-bold text-amber-500 sm:text-xl lg:text-2xl">
              {
                menuItems.filter((i) => !i.consumes || i.consumes.length === 0)
                  .length
              }
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-2.5 relative sm:mb-3">
          <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 sm:left-3 sm:h-4 sm:w-4" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 sm:pl-9 sm:py-2 sm:text-sm lg:py-2.5 lg:text-base"
          />
        </div>

        {/* Filter tabs */}
        <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide sm:mb-4 sm:gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-colors sm:px-3 sm:py-1 sm:text-xs lg:text-sm lg:px-4 lg:py-1.5 ${
                filter === cat
                  ? "bg-orange-500 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>

        {/* Desktop table */}
        <MenuTable
          items={filtered}
          inventoryItems={inventoryItems}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
        />

        {/* Mobile cards */}
        <div className="sm:hidden space-y-2.5">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white py-12 text-center text-xs text-slate-400">
              No menu items found.
            </div>
          ) : (
            filtered.map((item) => (
              <MenuCard
                key={item.firestoreId}
                item={item}
                inventoryItems={inventoryItems}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
              />
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <MenuItemModal
          editTarget={editTarget}
          inventoryItems={inventoryItems}
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
