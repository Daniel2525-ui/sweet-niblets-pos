import { useState, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import ProductCard from "./ProductCard";

export default function ProductGrid({ menuItems = [], onAdd }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = [...new Set(menuItems.map((i) => i.category).filter(Boolean))];
    return ["All", ...cats];
  }, [menuItems]);

  const filtered = useMemo(() => {
    return menuItems.filter((item) => {
      const matchSearch =
        !search || item.name.toLowerCase().includes(search.toLowerCase());
      const matchCat =
        activeCategory === "All" || item.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [menuItems, search, activeCategory]);

  return (
    <section className="space-y-5 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-4 grid place-items-center text-slate-400 text-base">
            <FiSearch className="h-5 w-5" />
          </span>
          <input
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pl-11 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {categories.length > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  activeCategory === cat
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100"
                }`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {filtered.length === 0 ? (
          <div className="col-span-full rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500">
            {menuItems.length === 0
              ? "No products yet — add some via Manage"
              : "No products match your search"}
          </div>
        ) : (
          filtered.map((item) => (
            <ProductCard key={item.id} item={item} onAdd={onAdd} />
          ))
        )}
      </div>
    </section>
  );
}
