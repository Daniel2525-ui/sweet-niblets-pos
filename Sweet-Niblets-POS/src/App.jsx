import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import Inventory from "./pages/Inventory";
import MenuSetup from "./pages/MenuSetup";

import {
  collection,
  deleteDoc,
  doc,
  writeBatch,
  query,
  orderBy,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";

import Header from "./components/Header";
import ProductGrid from "./components/ProductGrid";
import CartPanel from "./components/CartPanel";
import SalesDashboard from "./components/SalesDashboard";
import DailyReport from "./components/DailyReport";

import useClock from "./hooks/useClock";

import "./styles/styles.css";

export default function App() {
  const clock = useClock();

  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [sales, setSales] = useState([]);
  const [showDash, setShowDash] = useState(false);
  const [showDailyReport, setShowDailyReport] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubMenuItems = onSnapshot(
      collection(db, "menuItems"),
      (snap) => {
        setMenuItems(
          snap.docs.map((d) => ({ ...d.data(), firestoreId: d.id })),
        );
        setLoading(false);
      },
      (err) => {
        toast.error("Failed to load products");
        console.error(err);
        setLoading(false);
      },
    );

    const unsubSales = onSnapshot(
      query(collection(db, "sales"), orderBy("date", "desc")),
      (snap) => {
        setSales(snap.docs.map((d) => ({ ...d.data(), firestoreId: d.id })));
      },
      (err) => {
        toast.error("Failed to load sales");
        console.error(err);
      },
    );

    return () => {
      unsubMenuItems();
      unsubSales();
    };
  }, []);

  const addToCart = (itemId) => {
    const item = menuItems.find((product) => product.id === itemId);
    if (!item) return;

    setCart((prevCart) => {
      const existing = prevCart.find((product) => product.id === itemId);
      if (existing) {
        return prevCart.map((product) =>
          product.id === itemId
            ? { ...product, qty: product.qty + 1 }
            : product,
        );
      }
      return [...prevCart, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((product) => product.id !== itemId));
    toast.success("Item removed from cart", { theme: "light" });
  };

  const updateQty = (itemId, qty) => {
    setCart((prevCart) =>
      prevCart
        .map((product) =>
          product.id === itemId ? { ...product, qty } : product,
        )
        .filter((product) => product.qty > 0),
    );
  };

  const checkout = async () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const sale = {
      id: crypto.randomUUID(),
      items: cart,
      total,
      date: new Date().toISOString(),
    };

    try {
      const batch = writeBatch(db);

      const saleRef = doc(collection(db, "sales"));
      batch.set(saleRef, sale);

      const deductionMap = new Map(); 

      for (const cartItem of cart) {
        const menuItem = menuItems.find((m) => m.id === cartItem.id);
        if (!menuItem || !menuItem.consumes || menuItem.consumes.length === 0)
          continue;

        for (const consumeRule of menuItem.consumes) {
          const { inventoryItemId, qty: qtyPerSale } = consumeRule;
          const totalDeduct = (qtyPerSale || 0) * cartItem.qty;
          deductionMap.set(
            inventoryItemId,
            (deductionMap.get(inventoryItemId) || 0) + totalDeduct,
          );
        }
      }

      const deductionEntries = Array.from(deductionMap.entries());
      const stockSnapshots = await Promise.all(
        deductionEntries.map(([id]) => getDoc(doc(db, "inventoryItems", id))),
      );

      stockSnapshots.forEach((snap, i) => {
        if (!snap.exists()) return;
        const [inventoryItemId, deductQty] = deductionEntries[i];
        const currentStock = snap.data().stock ?? 0;
        const newStock = Math.max(0, currentStock - deductQty);
        batch.update(doc(db, "inventoryItems", inventoryItemId), {
          stock: newStock,
        });
      });

      await batch.commit();
      setCart([]);
      toast.success("Transaction completed successfully", { theme: "light" });
    } catch (err) {
      toast.error("Checkout failed");
      console.error(err);
    }
  };

  const clearAllSales = async () => {
    if (!confirm("Are you sure? This cannot be undone")) return;
    try {
      const batch = writeBatch(db);
      sales.forEach((sale) => {
        batch.delete(doc(db, "sales", sale.firestoreId));
      });
      await batch.commit();
      toast.success("Cleared Sales Record", { theme: "light" });
    } catch (err) {
      toast.error("Failed to clear sales");
      console.error(err);
    }
  };

  const deleteSale = async (id) => {
    if (!confirm("Are you sure to delete this record?")) return;
    const sale = sales.find((s) => s.id === id);
    try {
      await deleteDoc(doc(db, "sales", sale.firestoreId));
      toast.success("Sale record deleted", { theme: "light" });
    } catch (err) {
      toast.error("Failed to delete sale");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-semibold text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-slate-50 text-slate-950">
            <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
              <Header clock={clock} onShowDashboard={() => setShowDash(true)} />

              <div className="mt-6 grid gap-5 lg:grid-cols-[1.75fr_1fr]">
                <div className="min-w-0">
                  <ProductGrid menuItems={menuItems} onAdd={addToCart} />
                </div>
                <div className="min-w-0">
                  <CartPanel
                    cart={cart}
                    onRemove={removeFromCart}
                    onUpdateQty={updateQty}
                    onCheckout={checkout}
                  />
                </div>
              </div>
            </div>

            {showDash && (
              <SalesDashboard
                sales={sales}
                onClose={() => setShowDash(false)}
                onClearAll={clearAllSales}
                onDeleteSale={deleteSale}
                onViewDaily={(date) => {
                  setSelectedDate(date);
                  setShowDailyReport(true);
                }}
              />
            )}

            {showDailyReport && selectedDate && (
              <DailyReport
                date={selectedDate}
                sales={sales}
                onClose={() => setShowDailyReport(false)}
              />
            )}

            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        }
      />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/menu-setup" element={<MenuSetup />} />
    </Routes>
  );
}
