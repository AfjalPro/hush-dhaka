import { useState, useMemo } from 'react';
import { ChevronDown, Search } from 'lucide-react'; // Added Search Icon
import { perfumeData } from './perfumeData';

// --- COMPONENTS ---

const BrandAccordionItem = ({ brand, perfumes }) => {
  // If the user is searching, we default the accordion to "Open" so they can see results immediately.
  // Otherwise, default to "Closed".
  const [isOpen, setIsOpen] = useState(false);

  // Auto-open if the list is short (implying a search result) is a nice touch, 
  // but for simplicity, let's keep the user in control or default to closed.
  
  return (
    <div className="border-b border-stone-200">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-6 text-left group transition-colors duration-300"
      >
        <span className={`font-serif text-2xl md:text-3xl transition-colors duration-300 ${isOpen ? 'text-amber-800' : 'text-stone-800 group-hover:text-amber-800'}`}>
          {brand}
        </span>
        <span className={`text-stone-400 transition-transform duration-500 ${isOpen ? 'rotate-180 text-amber-800' : ''}`}>
          <ChevronDown size={24} strokeWidth={1.5} />
        </span>
      </button>

      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}
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
  const [activePage, setActivePage] = useState('collection');
  const [searchTerm, setSearchTerm] = useState(''); // NEW: Search State

  // 1. First, filter the raw data based on search term
  const filteredPerfumes = useMemo(() => {
    if (!searchTerm) return perfumeData;

    const lowerTerm = searchTerm.toLowerCase();
    return perfumeData.filter(item => 
      item.name.toLowerCase().includes(lowerTerm) || 
      item.brand.toLowerCase().includes(lowerTerm)
    );
  }, [searchTerm]);

  // 2. Then, group the FILTERED data for the Brands view
  // This ensures that if you search "Aventus", only "Creed" appears in the brands list.
  const brandsData = useMemo(() => {
    const grouped = {};
    
    filteredPerfumes.forEach(item => {
      if (!grouped[item.brand]) {
        grouped[item.brand] = [];
      }
      grouped[item.brand].push(item.name);
    });

    // Sort alphabetically A-Z
    return Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredPerfumes]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAV */}
      <nav className="sticky top-0 z-50 px-6 md:px-12 py-6 bg-white/60 backdrop-blur-md border-b border-stone-100 transition-all duration-300">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* LOGO SECTION - UPDATED */}
          <div 
            onClick={() => { setActivePage('collection'); setSearchTerm(''); }} 
            className="cursor-pointer hover:opacity-60 transition-opacity"
          >
            {/* Adjust h-12 (height) if you need it bigger or smaller */}
            <img 
              src="/hush_logo.png" 
              alt="HUSH DHAKA" 
              className="h-16 object-contain" 
            />
          </div>
          
          {/* MENU LINKS */}
          <div className="flex space-x-12 text-[10px] font-semibold tracking-[0.25em] uppercase text-stone-600">
            {['collection', 'brands'].map((page) => (
              <button 
                key={page}
                onClick={() => { setActivePage(page); setSearchTerm(''); }}
                className={`relative py-2 transition-all duration-500 hover:text-stone-900 ${activePage === page ? 'text-stone-900' : ''}`}
              >
                {page}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-amber-900 transform transition-transform duration-500 ${activePage === page ? 'scale-x-100' : 'scale-x-0'}`}></span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="max-w-4xl mx-auto px-6 py-16 min-h-[80vh] w-full flex-grow">
        
        {/* HEADER SECTION (Dynamic based on page) */}
        <header className="text-center mb-12">
          <span className="block text-amber-700 text-xs tracking-[0.2em] uppercase mb-4">
            {activePage === 'collection' ? 'The Collection' : 'The Houses'}
          </span>
          <h1 className="font-serif text-5xl md:text-6xl text-stone-900 font-light mb-8">
            {activePage === 'collection' ? 'All Fragrances' : 'By Brand'}
          </h1>

          {/* --- SEARCH BAR ADDED HERE --- */}
          <div className="relative max-w-md mx-auto">
            <input 
              type="text"
              placeholder="Search perfumes or brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 focus:border-amber-700 focus:ring-1 focus:ring-amber-700 outline-none transition-all placeholder:text-stone-400 font-light tracking-wide text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="animate-fade-in-up">
          
          {/* 1. COLLECTION VIEW */}
          {activePage === 'collection' && (
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
                        <span className="font-medium text-stone-800 group-hover:text-black">{perfume.name}</span>
                        <span className="font-light text-stone-500">{perfume.brand}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-20 text-stone-400 font-light">
                  No fragrances found matching "{searchTerm}"
                </div>
              )}
            </div>
          )}

          {/* 2. BRANDS VIEW */}
          {activePage === 'brands' && (
            <div className="border-t border-stone-200">
              {brandsData.length > 0 ? (
                brandsData.map(([brand, perfumes]) => (
                  <BrandAccordionItem key={brand} brand={brand} perfumes={perfumes} />
                ))
              ) : (
                <div className="text-center py-20 text-stone-400 font-light">
                  No brands found matching "{searchTerm}"
                </div>
              )}
            </div>
          )}

        </div>

      </main>

      {/* FOOTER */}
      <footer className="py-8 text-center text-stone-400 text-[10px] tracking-widest uppercase">
        Est. 2024 — Scent & Soul
      </footer>
    </div>
  );
};

export default App;