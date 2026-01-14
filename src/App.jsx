// src/App.jsx
import { useState, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";
import { perfumeData } from "./perfumeData";
import Prism from "./components/Prism";

const BrandAccordionItem = ({ brand, perfumes }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-stone-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-6 text-left group transition-colors duration-300"
      >
        <span
          className={`font-serif text-2xl md:text-3xl transition-colors duration-300 ${
            isOpen ? "text-amber-800" : "text-stone-800 group-hover:text-amber-800"
          }`}
        >
          {brand}
        </span>

        <span
          className={`text-stone-400 transition-transform duration-500 ${
            isOpen ? "rotate-180 text-amber-800" : ""
          }`}
        >
          <ChevronDown size={24} strokeWidth={1.5} />
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-96 opacity-100 mb-6" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="pl-4 space-y-2 border-l border-stone-200 ml-2">
          {perfumes.map((perfume, index) => (
            <li key={index} className="text-stone-500 font-light text-sm tracking-wide">
              {perfume}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const App = () => {
  const [activePage, setActivePage] = useState("collection");
  const [searchTerm, setSearchTerm] = useState("");

  // 1) Filter raw data by search
  const normalize = (s = "") =>
    s
      .toLowerCase()
      .normalize("NFKD")                 // helps with accented chars
      .replace(/[\u0300-\u036f]/g, "")   // remove diacritics
      .replace(/[^a-z0-9]+/g, "");       // keep only letters+numbers
  
  const filteredPerfumes = useMemo(() => {
    const q = normalize(searchTerm);
    if (!q) return perfumeData;
  
    return perfumeData.filter((item) => {
      const name = normalize(item.name);
      const brand = normalize(item.brand);
      return name.includes(q) || brand.includes(q);
    });
  }, [searchTerm]);
  // 2) Group filtered data for brands accordion
  const brandsData = useMemo(() => {
    const grouped = {};

    filteredPerfumes.forEach((item) => {
      if (!grouped[item.brand]) grouped[item.brand] = [];
      grouped[item.brand].push(item.name);
    });

    // Sort perfumes inside each brand
    Object.keys(grouped).forEach((b) => grouped[b].sort((a, b2) => a.localeCompare(b2)));

    // Sort brands A-Z
    return Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredPerfumes]);

  const onNav = (page) => {
    setActivePage(page);
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      {/* FULL-SCREEN FIXED PRISM BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Prism
          animationType="rotate"
          timeScale={0.5}
          height={3.5}
          baseWidth={5.5}
          scale={3.6}
          hueShift={0}
          colorFrequency={1}
          noise={0} // ✅ removes grain. Try 0.02 for subtle film grain.
          glow={1.4}
          bloom={1.1}
          suspendWhenOffscreen={false}
          transparent={true}
        />
        {/* Readability wash across entire site */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[0.5px]" />
      </div>

      {/* NAV */}
      <nav className="sticky top-0 z-50 px-6 md:px-12 py-6 bg-white/60 backdrop-blur-md border-b border-stone-100 transition-all duration-300">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* LOGO */}
          <div
            onClick={() => onNav("collection")}
            className="cursor-pointer hover:opacity-60 transition-opacity"
            aria-label="Go to collection"
          >
            <img src="/hush_logo.png" alt="HUSH DHAKA" className="h-16 object-contain" />
          </div>

          {/* MENU */}
          <div className="flex space-x-12 text-[10px] font-semibold tracking-[0.25em] uppercase text-stone-600">
            {["collection", "brands"].map((page) => (
              <button
                key={page}
                onClick={() => onNav(page)}
                className={`relative py-2 transition-all duration-500 hover:text-stone-900 ${
                  activePage === page ? "text-stone-900" : ""
                }`}
              >
                {page}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-amber-900 transform transition-transform duration-500 ${
                    activePage === page ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-16 min-h-[80vh] w-full flex-grow">
        {/* HEADER */}
        <header className="text-center mb-12">
          <span className="block text-amber-700 text-xs tracking-[0.2em] uppercase mb-4">
            {activePage === "collection" ? "The Collection" : "The Houses"}
          </span>

          <h1 className="font-serif text-5xl md:text-6xl text-stone-900 font-light mb-8">
            {activePage === "collection" ? "All Fragrances" : "By Brand"}
          </h1>

          {/* SEARCH */}
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search perfumes or brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/70 border border-stone-200 focus:border-amber-700 focus:ring-1 focus:ring-amber-700 outline-none transition-all placeholder:text-stone-400 font-light tracking-wide text-sm backdrop-blur-sm"
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
              size={18}
            />
          </div>
        </header>

        {/* CONTENT CARD */}
        <section className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm p-4 md:p-8">
          {/* 1) COLLECTION VIEW */}
          {activePage === "collection" && (
            <div className="w-full">
              {filteredPerfumes.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 pb-4 border-b border-stone-800 text-xs tracking-[0.15em] uppercase text-stone-500 mb-6">
                    <span>Fragrance</span>
                    <span>House</span>
                  </div>

                  <div className="space-y-1">
                    {filteredPerfumes.map((perfume) => (
                      <div
                        key={perfume.id}
                        className="grid grid-cols-2 py-5 border-b border-stone-200 hover:border-amber-700/50 hover:pl-2 transition-all duration-300 cursor-default group"
                      >
                        <span className="font-medium text-stone-800 group-hover:text-black">
                          {perfume.name}
                        </span>
                        <span className="font-light text-stone-500">{perfume.brand}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-20 text-stone-400 font-light">
                  No fragrances found matching &quot;{searchTerm}&quot;
                </div>
              )}
            </div>
          )}

          {/* 2) BRANDS VIEW */}
          {activePage === "brands" && (
            <div className="border-t border-stone-200">
              {brandsData.length > 0 ? (
                brandsData.map(([brand, perfumes]) => (
                  <BrandAccordionItem key={brand} brand={brand} perfumes={perfumes} />
                ))
              ) : (
                <div className="text-center py-20 text-stone-400 font-light">
                  No brands found matching &quot;{searchTerm}&quot;
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 py-8 text-center text-stone-400 text-[10px] tracking-widest uppercase">
        Est. 2024 — HUSH DHAKA
      </footer>
    </div>
  );
};

export default App;
