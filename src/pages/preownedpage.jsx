import { useEffect, useMemo, useState } from "react";
import ProductsPageLayout from "../components/ProductsPageLayout";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Helpers
function formatLKR(amount) {
  return new Intl.NumberFormat("en-LK").format(amount);
}
function toggleInSet(prevSet, value) {
  const next = new Set(prevSet);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

// ✅ Set your brand list here (edit anytime)
const PREOWNED_BRANDS = [
  { label: "APPLE", value: "apple" },
  { label: "SAMSUNG", value: "samsung" },
  { label: "DELL", value: "dell" },
  { label: "HP", value: "hp" },
  { label: "LENOVO", value: "lenovo" },
  { label: "ASUS", value: "asus" },
  { label: "ACER", value: "acer" },
  { label: "MSI", value: "msi" },
];

// Demo fallback (replace with API later)
const FALLBACK_PREOWNED = [
  {
    id: 1,
    name: "Dell Latitude 5400 i5 (16GB / 512GB)",
    price: 169000,
    oldPrice: 189000,
    rating: 4.5,
    reviews: 210,
    sold: "420",
    brand: "dell",
    condition: "used", // "used" | "refurbished"
    grade: "A", // "A" | "B" | "C"
    availability: "in_stock",
    image: "/images/products/preowned/pre-1.jpg",
  },
  {
    id: 2,
    name: "iPhone 12 (64GB) — Refurbished",
    price: 199000,
    oldPrice: 229000,
    rating: 4.6,
    reviews: 388,
    sold: "1.2K",
    brand: "apple",
    condition: "refurbished",
    grade: "B",
    availability: "in_stock",
    image: "/images/products/preowned/pre-2.jpg",
  },
];

export default function PreOwnedPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1200000);

  const [brand, setBrand] = useState(new Set());
  const [condition, setCondition] = useState(new Set()); // used/refurbished
  const [grade, setGrade] = useState(new Set()); // A/B/C

  const [sortBy, setSortBy] = useState("featured");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      try {
        // ✅ Replace with your API:
        // const res = await fetch("http://localhost:3000/api/products?category=preowned");
        // const data = await res.json();
        // if (alive) setProducts(data);

        if (alive) setProducts(FALLBACK_PREOWNED);
      } catch {
        if (alive) setProducts(FALLBACK_PREOWNED);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => (alive = false);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const passSet = (set, value) => (set.size === 0 ? true : set.has(value));

    let list = products.filter((p) => {
      const inPrice = p.price >= priceMin && p.price <= priceMax;
      const inQuery = q ? p.name.toLowerCase().includes(q) : true;

      return (
        inPrice &&
        inQuery &&
        passSet(brand, p.brand) &&
        passSet(condition, p.condition) &&
        passSet(grade, p.grade)
      );
    });

    if (sortBy === "price_asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") list.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [products, priceMin, priceMax, brand, condition, grade, sortBy, query]);

  function clearAll() {
    setPriceMin(0);
    setPriceMax(1200000);
    setBrand(new Set());
    setCondition(new Set());
    setGrade(new Set());
    setQuery("");
    setSortBy("featured");
  }

  const onMinChange = (v) => {
    const next = Math.min(Number(v), priceMax - 1000);
    setPriceMin(Math.max(0, next));
  };
  const onMaxChange = (v) => {
    const next = Math.max(Number(v), priceMin + 1000);
    setPriceMax(Math.min(1200000, next));
  };

  const FilterBody = ({ isMobile, closeMobile }) => (
    <>
      <div className="lp-sideHead">
        <h2 className="lp-sideTitle">Filters</h2>
        <button className="lp-clearMini" type="button" onClick={clearAll}>
          Clear all
        </button>
      </div>

      {/* Price */}
      <div className="lp-filterSection">
        <div className="lp-filterTitle">Price (LKR)</div>
        <div className="lp-priceBox">
          <div className="lp-rangeTrack" role="group" aria-label="Price range">
            <div className="lp-bar" />
            <div
              className="lp-barFill"
              style={{
                left: `${(priceMin / 1200000) * 100}%`,
                right: `${100 - (priceMax / 1200000) * 100}%`,
              }}
            />
            <input
              type="range"
              min="0"
              max="1200000"
              step="1000"
              value={priceMin}
              onChange={(e) => onMinChange(e.target.value)}
            />
            <input
              type="range"
              min="0"
              max="1200000"
              step="1000"
              value={priceMax}
              onChange={(e) => onMaxChange(e.target.value)}
            />
          </div>
          <div className="lp-priceText">
            {formatLKR(priceMin)} — {formatLKR(priceMax)}
          </div>
        </div>
      </div>

      {/* Brand */}
      <div className="lp-filterSection">
        <div className="lp-filterTitle">Brand</div>
        <div className="lp-list">
          {PREOWNED_BRANDS.map((b) => (
            <label className="lp-check" key={b.value}>
              <input
                type="checkbox"
                checked={brand.has(b.value)}
                onChange={() => setBrand((s) => toggleInSet(s, b.value))}
              />
              <span>{b.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Condition: Used / Refurbished */}
      <div className="lp-filterSection">
        <div className="lp-filterTitle">Condition</div>
        <div className="lp-list">
          {[
            { label: "USED", value: "used" },
            { label: "REFURBISHED", value: "refurbished" },
          ].map((c) => (
            <label className="lp-check" key={c.value}>
              <input
                type="checkbox"
                checked={condition.has(c.value)}
                onChange={() => setCondition((s) => toggleInSet(s, c.value))}
              />
              <span>{c.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Grade: A / B / C */}
      <div className="lp-filterSection">
        <div className="lp-filterTitle">Grade</div>
        <div className="lp-list">
          {["A", "B", "C"].map((g) => (
            <label className="lp-check" key={g}>
              <input
                type="checkbox"
                checked={grade.has(g)}
                onChange={() => setGrade((s) => toggleInSet(s, g))}
              />
              <span>GRADE {g}</span>
            </label>
          ))}
        </div>
      </div>

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

  return (
    <>
      <Header/>
      <ProductsPageLayout
        pageClassName="gh-preowned-page"
        title="Pre-Owned"
        subtitle="Tested. Trusted. Budget-smart picks — clean UI, clean deals."
        query={query}
        setQuery={setQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        searchPlaceholder="Search pre-owned (e.g., Dell, iPhone, 16GB, Grade A)"
        resultsText={loading ? "Loading..." : `${filtered.length} results`}
        sidebar={<FilterBody isMobile={false} />}
        drawer={
          <>
            <div className="lp-drawerHead">
              <div>
                <div className="lp-drawerTitle">Filters</div>
                <div className="lp-drawerHint">
                  {loading ? "Loading..." : `${filtered.length} results`}
                </div>
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
            <FilterBody isMobile closeMobile={() => setMobileFiltersOpen(false)} />
          </>
        }
        mobileFiltersOpen={mobileFiltersOpen}
        setMobileFiltersOpen={setMobileFiltersOpen}
      >
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div className="lp-skeletonCard" key={i} />
          ))
        ) : filtered.length === 0 ? (
          <div className="lp-empty">
            <h3>No pre-owned items match your filters.</h3>
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
                  <img className="lp-img" src={p.image} alt={p.name} loading="lazy" />
                  <div className="lp-chipRow">
                    <span className="lp-chip">{p.condition === "refurbished" ? "REFURB" : "USED"}</span>
                    <span className="lp-chip lp-chipGhost">GRADE {p.grade}</span>
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
      </ProductsPageLayout>
      <Footer/>
    </>
  );
}
