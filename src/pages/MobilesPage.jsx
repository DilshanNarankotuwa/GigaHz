import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import ProductsPageLayout from "../components/ProductsPageLayout";
import Footer from "../components/Footer";

function formatLKR(amount) {
  return new Intl.NumberFormat("en-LK").format(amount);
}
function toggleInSet(prevSet, value) {
  const next = new Set(prevSet);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

// Demo fallback (replace with API)
const FALLBACK_MOBILES = [
  {
    id: 1,
    name: "Samsung Galaxy S23 (8GB / 256GB)",
    price: 289000,
    oldPrice: 319000,
    rating: 4.7,
    reviews: 920,
    sold: "1.8K",
    brand: "samsung",
    ram: "8",
    storage: "256",
    screen: 6.1,
    availability: "in_stock",
    condition: "new",
    image: "/images/products/mobiles/mobile-1.jpg",
  },
  {
    id: 2,
    name: "iPhone 14 (6GB / 128GB)",
    price: 339000,
    oldPrice: 379000,
    rating: 4.8,
    reviews: 1521,
    sold: "2.6K",
    brand: "apple",
    ram: "6",
    storage: "128",
    screen: 6.1,
    availability: "pre_order",
    condition: "new",
    image: "/images/products/mobiles/mobile-2.jpg",
  },
];

export default function MobilesPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1200000);

  const [availability, setAvailability] = useState(new Set());
  const [condition, setCondition] = useState(new Set());
  const [brand, setBrand] = useState(new Set());
  const [ram, setRam] = useState(new Set());
  const [storage, setStorage] = useState(new Set());

  const [sortBy, setSortBy] = useState("featured");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      try {
        // ✅ Replace with your API:
        // const res = await fetch("http://localhost:3000/api/products?category=mobiles");
        // const data = await res.json();
        // if (alive) setProducts(data);

        if (alive) setProducts(FALLBACK_MOBILES);
      } catch {
        if (alive) setProducts(FALLBACK_MOBILES);
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
        passSet(availability, p.availability) &&
        passSet(condition, p.condition) &&
        passSet(brand, p.brand) &&
        passSet(ram, p.ram) &&
        passSet(storage, p.storage)
      );
    });

    if (sortBy === "price_asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") list.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [products, priceMin, priceMax, availability, condition, brand, ram, storage, sortBy, query]);

  function clearAll() {
    setPriceMin(0);
    setPriceMax(1200000);
    setAvailability(new Set());
    setCondition(new Set());
    setBrand(new Set());
    setRam(new Set());
    setStorage(new Set());
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
            <input type="range" min="0" max="1200000" step="1000" value={priceMin} onChange={(e) => onMinChange(e.target.value)} />
            <input type="range" min="0" max="1200000" step="1000" value={priceMax} onChange={(e) => onMaxChange(e.target.value)} />
          </div>
          <div className="lp-priceText">{formatLKR(priceMin)} — {formatLKR(priceMax)}</div>
        </div>
      </div>

      {/* Availability */}
      <div className="lp-filterSection">
        <div className="lp-filterTitle">Availability</div>
        <div className="lp-list">
          <label className="lp-check">
            <input type="checkbox" checked={availability.has("in_stock")} onChange={() => setAvailability((s) => toggleInSet(s, "in_stock"))} />
            <span>IN STOCK</span>
          </label>
          <label className="lp-check">
            <input type="checkbox" checked={availability.has("pre_order")} onChange={() => setAvailability((s) => toggleInSet(s, "pre_order"))} />
            <span>PRE ORDER</span>
          </label>
        </div>
      </div>

      {/* Condition */}
      <div className="lp-filterSection">
        <div className="lp-filterTitle">Condition</div>
        <div className="lp-list">
          <label className="lp-check">
            <input type="checkbox" checked={condition.has("new")} onChange={() => setCondition((s) => toggleInSet(s, "new"))} />
            <span>NEW</span>
          </label>
          <label className="lp-check">
            <input type="checkbox" checked={condition.has("used")} onChange={() => setCondition((s) => toggleInSet(s, "used"))} />
            <span>USED</span>
          </label>
        </div>
      </div>

      {/* Brand */}
      <div className="lp-filterSection">
        <div className="lp-filterTitle">Brand</div>
        <div className="lp-list">
          {[
            ["APPLE", "apple"],
            ["SAMSUNG", "samsung"],
            ["XIAOMI", "xiaomi"],
            ["ONEPLUS", "oneplus"],
            ["GOOGLE", "google"],
          ].map(([label, val]) => (
            <label className="lp-check" key={val}>
              <input type="checkbox" checked={brand.has(val)} onChange={() => setBrand((s) => toggleInSet(s, val))} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* RAM */}
      <div className="lp-filterSection">
        <div className="lp-filterTitle">RAM</div>
        <div className="lp-list">
          {["4", "6", "8", "12"].map((v) => (
            <label className="lp-check" key={v}>
              <input type="checkbox" checked={ram.has(v)} onChange={() => setRam((s) => toggleInSet(s, v))} />
              <span>{v}GB</span>
            </label>
          ))}
        </div>
      </div>

      {/* Storage */}
      <div className="lp-filterSection">
        <div className="lp-filterTitle">Storage</div>
        <div className="lp-list">
          {["64", "128", "256", "512"].map((v) => (
            <label className="lp-check" key={v}>
              <input type="checkbox" checked={storage.has(v)} onChange={() => setStorage((s) => toggleInSet(s, v))} />
              <span>{v}GB</span>
            </label>
          ))}
        </div>
      </div>

      <div className="lp-actions">
        <button className="lp-secondaryBtn" type="button" onClick={clearAll}>Clear</button>
        {isMobile ? (
          <button className="lp-primaryBtn" type="button" onClick={closeMobile}>Apply</button>
        ) : null}
      </div>
    </>
  );

  return (
    <>
      <Header/>
      <ProductsPageLayout
        pageClassName="gh-mobiles-page"
        title="Mobiles"
        subtitle="Find your daily driver — flagship, budget, or value king — in the cleanest way."
        query={query}
        setQuery={setQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        searchPlaceholder="Search mobiles (e.g., iPhone, Galaxy, 256GB, 8GB RAM)"
        resultsText={loading ? "Loading..." : `${filtered.length} results`}
        sidebar={<FilterBody isMobile={false} />}
        drawer={
          <>
            <div className="lp-drawerHead">
              <div>
                <div className="lp-drawerTitle">Filters</div>
                <div className="lp-drawerHint">{loading ? "Loading..." : `${filtered.length} results`}</div>
              </div>
              <button className="lp-x" onClick={() => setMobileFiltersOpen(false)} type="button" aria-label="Close">
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
          Array.from({ length: 8 }).map((_, i) => <div className="lp-skeletonCard" key={i} />)
        ) : filtered.length === 0 ? (
          <div className="lp-empty">
            <h3>No mobiles match your filters.</h3>
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
                    <span className="lp-chip">{p.availability === "in_stock" ? "IN STOCK" : "PRE ORDER"}</span>
                    <span className="lp-chip lp-chipGhost">{p.storage}GB</span>
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
