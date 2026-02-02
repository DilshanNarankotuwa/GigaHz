import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductsPageLayout from "../components/ProductsPageLayout"

// 🔧 Demo fallback (so the page looks perfect even without backend)
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: "ASUS TUF Gaming F15 (i7 / RTX 4060 / 16GB / 1TB)",
    price: 489000,
    oldPrice: 529000,
    rating: 4.8,
    reviews: 1294,
    sold: "2.1K",
    brand: "asus",
    cpu: "i7",
    gpu: "rtx4060",
    screen: 15.6,
    ram: "16",
    storage: "1tb",
    availability: "in_stock",
    condition: "new",
    image: "/images/products/laptops/laptop-1.jpg",
  },
  {
    id: 2,
    name: "Lenovo LOQ 15 (Ryzen 5 / RTX 4050 / 16GB / 512GB)",
    price: 359000,
    oldPrice: 389000,
    rating: 4.6,
    reviews: 802,
    sold: "1.4K",
    brand: "lenovo",
    cpu: "ryzen5",
    gpu: "rtx4050",
    screen: 15.6,
    ram: "16",
    storage: "512",
    availability: "pre_order",
    condition: "new",
    image: "/images/products/laptops/laptop-2.jpg",
  },
  {
    id: 3,
    name: "HP Pavilion 14 (i5 / Iris Xe / 8GB / 512GB)",
    price: 219000,
    oldPrice: 239000,
    rating: 4.3,
    reviews: 511,
    sold: "3.6K",
    brand: "hp",
    cpu: "i5",
    gpu: "integrated",
    screen: 14,
    ram: "8",
    storage: "512",
    availability: "in_stock",
    condition: "new",
    image: "/images/products/laptops/laptop-3.jpg",
  },
  {
    id: 4,
    name: "Apple MacBook Air M2 (8GB / 256GB)",
    price: 399000,
    oldPrice: 429000,
    rating: 4.9,
    reviews: 2104,
    sold: "5.9K",
    brand: "apple",
    cpu: "m2",
    gpu: "integrated",
    screen: 13.6,
    ram: "8",
    storage: "256",
    availability: "in_stock",
    condition: "new",
    image: "/images/products/laptops/laptop-4.jpg",
  },
];

function formatLKR(amount) {
  return new Intl.NumberFormat("en-LK").format(amount);
}

function toggleInSet(prevSet, value) {
  const next = new Set(prevSet);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

export default function LaptopsPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Filters
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1600000);

  const [availability, setAvailability] = useState(new Set());
  const [condition, setCondition] = useState(new Set());
  const [brand, setBrand] = useState(new Set());
  const [cpu, setCpu] = useState(new Set());
  const [screen, setScreen] = useState(new Set());
  const [gpu, setGpu] = useState(new Set());
  const [ram, setRam] = useState(new Set());
  const [storage, setStorage] = useState(new Set());

  const [sortBy, setSortBy] = useState("featured");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      try {
        // ✅ Replace with your real API when ready:
        // const res = await axios.get("http://localhost:3000/api/products?category=laptops");
        // if (alive) setProducts(res.data);

        // Fallback demo:
        if (alive) setProducts(FALLBACK_PRODUCTS);
      } catch (e) {
        if (alive) setProducts(FALLBACK_PRODUCTS);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const passSet = (set, value) => (set.size === 0 ? true : set.has(value));

    const passScreen = (set, value) => {
      if (set.size === 0) return true;
      // Compare as string to match checkbox values
      return set.has(String(value));
    };

    let list = products.filter((p) => {
      const inPrice = p.price >= priceMin && p.price <= priceMax;
      const inQuery = q ? p.name.toLowerCase().includes(q) : true;

      return (
        inPrice &&
        inQuery &&
        passSet(availability, p.availability) &&
        (condition.size === 0 ? true : condition.has(p.condition)) &&
        passSet(brand, p.brand) &&
        passSet(cpu, p.cpu) &&
        passScreen(screen, p.screen) &&
        (gpu.size === 0 ? true : gpu.has(p.gpu)) &&
        (ram.size === 0 ? true : ram.has(p.ram)) &&
        (storage.size === 0 ? true : storage.has(p.storage))
      );
    });

    // Sorting
    if (sortBy === "price_asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") list.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [
    products,
    priceMin,
    priceMax,
    availability,
    condition,
    brand,
    cpu,
    screen,
    gpu,
    ram,
    storage,
    sortBy,
    query,
  ]);

  function clearAll() {
    setPriceMin(0);
    setPriceMax(1600000);
    setAvailability(new Set());
    setCondition(new Set());
    setBrand(new Set());
    setCpu(new Set());
    setScreen(new Set());
    setGpu(new Set());
    setRam(new Set());
    setStorage(new Set());
    setQuery("");
    setSortBy("featured");
  }

  // Price range constraints
  const onMinChange = (v) => {
    const next = Math.min(Number(v), priceMax - 1000);
    setPriceMin(Math.max(0, next));
  };
  const onMaxChange = (v) => {
    const next = Math.max(Number(v), priceMin + 1000);
    setPriceMax(Math.min(1600000, next));
  };

  return (
    <>
      <Header/>
      <div className="gh-laptops-page">
        {/* HERO / HEADER */}
        <header className="lp-hero">
          <div className="lp-heroInner">
            <div className="lp-titleBlock">
              <p className="lp-kicker">GigaHz Store</p>
              <h1 className="lp-title">Laptops</h1>
              <p className="lp-subtitle">
                Filter fast. Compare clearly. Find your perfect rig — no clutter.
              </p>
            </div>

            <div className="lp-heroGlow" aria-hidden="true" />
          </div>
        </header>

        {/* MAIN LAYOUT */}
        <section className="lp-shell">
          {/* TOP TOOLBAR (mobile & tablet) */}
          <div className="lp-toolbar">
            <button
              className="lp-filterBtn"
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
            >
              Filters
              <span className="lp-badge">{filtered.length}</span>
            </button>

            <div className="lp-searchWrap">
              <input
                className="lp-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search laptops (e.g., RTX 4060, Ryzen 7, MacBook)"
                aria-label="Search laptops"
              />
            </div>

            <div className="lp-sortWrap">
              <span className="lp-sortLabel">Sort</span>
              <select
                className="lp-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* DESKTOP SIDEBAR */}
          <aside className="lp-sidebar" aria-label="Laptop filters">
            <div className="lp-sideHead">
              <h2 className="lp-sideTitle">Filters</h2>
              <button className="lp-clearMini" type="button" onClick={clearAll}>
                Clear all
              </button>
            </div>

            <FilterBody
              priceMin={priceMin}
              priceMax={priceMax}
              onMinChange={onMinChange}
              onMaxChange={onMaxChange}
              availability={availability}
              setAvailability={setAvailability}
              condition={condition}
              setCondition={setCondition}
              brand={brand}
              setBrand={setBrand}
              cpu={cpu}
              setCpu={setCpu}
              screen={screen}
              setScreen={setScreen}
              gpu={gpu}
              setGpu={setGpu}
              ram={ram}
              setRam={setRam}
              storage={storage}
              setStorage={setStorage}
              clearAll={clearAll}
              closeMobile={() => {}}
              isMobile={false}
            />
          </aside>

          {/* PRODUCTS AREA */}
          <main className="lp-content" aria-label="Laptop products">
            {/* Desktop top row */}
            <div className="lp-contentTop">
              <div className="lp-results">
                {loading ? "Loading..." : `${filtered.length} results`}
              </div>

              <div className="lp-contentSearch">
                <input
                  className="lp-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search laptops..."
                  aria-label="Search laptops"
                />
              </div>

              <div className="lp-contentSort">
                <span className="lp-sortLabel">Sort</span>
                <select
                  className="lp-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort products"
                >
                  <option value="featured">Featured</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <div className="lp-grid">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div className="lp-skeletonCard" key={i} />
                ))
              ) : filtered.length === 0 ? (
                <div className="lp-empty">
                  <h3>No laptops match your filters.</h3>
                  <p>Try clearing some filters or searching a different keyword.</p>
                  <button className="lp-primaryBtn" onClick={clearAll} type="button">
                    Reset filters
                  </button>
                </div>
              ) : (
                filtered.map((p) => (
                  <article className="lp-card" key={p.id}>
                    <a className="lp-cardLink" href="#" aria-label={`View ${p.name}`}>
                      <div className="lp-imgWrap">
                        <img
                          className="lp-img"
                          src={p.image}
                          alt={p.name}
                          loading="lazy"
                        />
                        <div className="lp-chipRow">
                          <span className="lp-chip">
                            {p.availability === "in_stock" ? "IN STOCK" : "PRE ORDER"}
                          </span>
                          <span className="lp-chip lp-chipGhost">
                            {p.screen}"
                          </span>
                        </div>
                      </div>

                      <h3 className="lp-name">{p.name}</h3>

                      <div className="lp-priceRow">
                        <div className="lp-price">
                          <span className="lp-cur">LKR</span>
                          <span className="lp-amt">{formatLKR(p.price)}</span>
                        </div>

                        <div className="lp-meta">
                          {p.oldPrice ? (
                            <span className="lp-old">
                              <s>{formatLKR(p.oldPrice)}</s>
                            </span>
                          ) : null}
                          <span className="lp-sold">{p.sold}+ sold</span>
                        </div>

                        <button className="lp-cart" type="button" aria-label="Add to cart">
                          +
                        </button>
                      </div>

                      <div className="lp-ratingRow" aria-label={`Rating ${p.rating}`}>
                        <span className="lp-ratingPill">★ {p.rating}</span>
                        <span className="lp-reviews">({formatLKR(p.reviews)})</span>
                      </div>
                    </a>
                  </article>
                ))
              )}
            </div>
          </main>

          {/* MOBILE FILTER DRAWER */}
          {mobileFiltersOpen ? (
            <div className="lp-drawerRoot" role="dialog" aria-modal="true">
              <button
                className="lp-backdrop"
                aria-label="Close filters"
                onClick={() => setMobileFiltersOpen(false)}
                type="button"
              />
              <aside className="lp-drawer" aria-label="Filters drawer">
                <div className="lp-drawerHead">
                  <div>
                    <div className="lp-drawerTitle">Filters</div>
                    <div className="lp-drawerHint">{filtered.length} results</div>
                  </div>
                  <button
                    className="lp-x"
                    onClick={() => setMobileFiltersOpen(false)}
                    type="button"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <FilterBody
                  priceMin={priceMin}
                  priceMax={priceMax}
                  onMinChange={onMinChange}
                  onMaxChange={onMaxChange}
                  availability={availability}
                  setAvailability={setAvailability}
                  condition={condition}
                  setCondition={setCondition}
                  brand={brand}
                  setBrand={setBrand}
                  cpu={cpu}
                  setCpu={setCpu}
                  screen={screen}
                  setScreen={setScreen}
                  gpu={gpu}
                  setGpu={setGpu}
                  ram={ram}
                  setRam={setRam}
                  storage={storage}
                  setStorage={setStorage}
                  clearAll={clearAll}
                  closeMobile={() => setMobileFiltersOpen(false)}
                  isMobile
                />
              </aside>
            </div>
          ) : null}
        </section>
      </div>
      <Footer/>
    </>
  );
}

function FilterBody({
  priceMin,
  priceMax,
  onMinChange,
  onMaxChange,
  availability,
  setAvailability,
  condition,
  setCondition,
  brand,
  setBrand,
  cpu,
  setCpu,
  screen,
  setScreen,
  gpu,
  setGpu,
  ram,
  setRam,
  storage,
  setStorage,
  clearAll,
  closeMobile,
  isMobile,
}) {
  const section = (title, children) => (
    <div className="lp-filterSection">
      <div className="lp-filterTitle">{title}</div>
      {children}
    </div>
  );

  const check = (label, checked, onChange) => (
    <label className="lp-check">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );

  const details = (title, children) => (
    <details className="lp-more">
      <summary>
        <span>{title}</span>
        <span className="lp-chev" aria-hidden="true" />
      </summary>
      <div className="lp-moreBody">{children}</div>
    </details>
  );

  return (
    <>
      {section(
        "Price (LKR)",
        <div className="lp-priceBox">
          <div className="lp-rangeTrack" role="group" aria-label="Price range">
            <div className="lp-bar" />
            <div
              className="lp-barFill"
              style={{
                left: `${(priceMin / 1600000) * 100}%`,
                right: `${100 - (priceMax / 1600000) * 100}%`,
              }}
            />
            <input
              type="range"
              min="0"
              max="1600000"
              step="1000"
              value={priceMin}
              onChange={(e) => onMinChange(e.target.value)}
              aria-label="Minimum price"
            />
            <input
              type="range"
              min="0"
              max="1600000"
              step="1000"
              value={priceMax}
              onChange={(e) => onMaxChange(e.target.value)}
              aria-label="Maximum price"
            />
          </div>

          <div className="lp-priceText">
            {formatLKR(priceMin)} — {formatLKR(priceMax)}
          </div>
        </div>
      )}

      {section(
        "Availability",
        <div className="lp-list">
          {check("IN STOCK", availability.has("in_stock"), () =>
            setAvailability((s) => toggleInSet(s, "in_stock"))
          )}
          {check("PRE ORDER", availability.has("pre_order"), () =>
            setAvailability((s) => toggleInSet(s, "pre_order"))
          )}
        </div>
      )}

      {section(
        "Condition",
        <div className="lp-list">
          {check("NEW", condition.has("new"), () =>
            setCondition((s) => toggleInSet(s, "new"))
          )}
          {check("USED", condition.has("used"), () =>
            setCondition((s) => toggleInSet(s, "used"))
          )}
        </div>
      )}

      {section(
        "Brand",
        <div className="lp-list">
          {check("ASUS", brand.has("asus"), () => setBrand((s) => toggleInSet(s, "asus")))}
          {check("APPLE", brand.has("apple"), () => setBrand((s) => toggleInSet(s, "apple")))}
          {check("MSI", brand.has("msi"), () => setBrand((s) => toggleInSet(s, "msi")))}
          {check("LENOVO", brand.has("lenovo"), () => setBrand((s) => toggleInSet(s, "lenovo")))}
          {check("HP", brand.has("hp"), () => setBrand((s) => toggleInSet(s, "hp")))}
          {check("ACER", brand.has("acer"), () => setBrand((s) => toggleInSet(s, "acer")))}
          {details(
            "More",
            <>
              {check("DELL", brand.has("dell"), () => setBrand((s) => toggleInSet(s, "dell")))}
              {check("GIGABYTE", brand.has("gigabyte"), () =>
                setBrand((s) => toggleInSet(s, "gigabyte"))
              )}
              {check("HUAWEI", brand.has("huawei"), () =>
                setBrand((s) => toggleInSet(s, "huawei"))
              )}
            </>
          )}
        </div>
      )}

      {section(
        "Processor",
        <div className="lp-list">
          {check("Ryzen 5", cpu.has("ryzen5"), () => setCpu((s) => toggleInSet(s, "ryzen5")))}
          {check("Ryzen 7", cpu.has("ryzen7"), () => setCpu((s) => toggleInSet(s, "ryzen7")))}
          {check("Intel i5", cpu.has("i5"), () => setCpu((s) => toggleInSet(s, "i5")))}
          {check("Intel i7", cpu.has("i7"), () => setCpu((s) => toggleInSet(s, "i7")))}
          {details(
            "More",
            <>
              {check("Ryzen 9", cpu.has("ryzen9"), () => setCpu((s) => toggleInSet(s, "ryzen9")))}
              {check("Intel i9", cpu.has("i9"), () => setCpu((s) => toggleInSet(s, "i9")))}
              {check("Apple M2", cpu.has("m2"), () => setCpu((s) => toggleInSet(s, "m2")))}
            </>
          )}
        </div>
      )}

      {section(
        "Display Size",
        <div className="lp-list">
          {check('13"', screen.has("13"), () => setScreen((s) => toggleInSet(s, "13")))}
          {check('14"', screen.has("14"), () => setScreen((s) => toggleInSet(s, "14")))}
          {check('15.6"', screen.has("15.6"), () => setScreen((s) => toggleInSet(s, "15.6")))}
          {details(
            "More",
            <>
              {check('16"', screen.has("16"), () => setScreen((s) => toggleInSet(s, "16")))}
              {check('17"', screen.has("17"), () => setScreen((s) => toggleInSet(s, "17")))}
            </>
          )}
        </div>
      )}

      {section(
        "Graphics",
        <div className="lp-list">
          {check("RTX 4050", gpu.has("rtx4050"), () => setGpu((s) => toggleInSet(s, "rtx4050")))}
          {check("RTX 4060", gpu.has("rtx4060"), () => setGpu((s) => toggleInSet(s, "rtx4060")))}
          {check("RTX 4070", gpu.has("rtx4070"), () => setGpu((s) => toggleInSet(s, "rtx4070")))}
          {details(
            "More",
            <>
              {check("RTX 3050", gpu.has("rtx3050"), () => setGpu((s) => toggleInSet(s, "rtx3050")))}
              {check("Integrated", gpu.has("integrated"), () =>
                setGpu((s) => toggleInSet(s, "integrated"))
              )}
            </>
          )}
        </div>
      )}

      {section(
        "RAM",
        <div className="lp-list">
          {check("8GB", ram.has("8"), () => setRam((s) => toggleInSet(s, "8")))}
          {check("16GB", ram.has("16"), () => setRam((s) => toggleInSet(s, "16")))}
          {check("32GB", ram.has("32"), () => setRam((s) => toggleInSet(s, "32")))}
        </div>
      )}

      {section(
        "Storage",
        <div className="lp-list">
          {check("256GB", storage.has("256"), () => setStorage((s) => toggleInSet(s, "256")))}
          {check("512GB", storage.has("512"), () => setStorage((s) => toggleInSet(s, "512")))}
          {check("1TB", storage.has("1tb"), () => setStorage((s) => toggleInSet(s, "1tb")))}
          {details(
            "More",
            <>
              {check("2TB", storage.has("2tb"), () => setStorage((s) => toggleInSet(s, "2tb")))}
            </>
          )}
        </div>
      )}

      <div className="lp-actions">
        <button className="lp-secondaryBtn" type="button" onClick={clearAll}>
          Clear
        </button>
        {isMobile ? (
          <button className="lp-primaryBtn" type="button" onClick={closeMobile}>
            Apply
          </button>
        ) : null}
      </div>
    </>
  );
}
