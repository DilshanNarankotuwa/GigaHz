import { useEffect } from "react";
import "./ProductsPageLayout.css";

export default function ProductsPageLayout({
  pageClassName = "gh-products-page",
  kicker = "GigaHz Store",
  title,
  subtitle,
  // toolbar/search/sort
  query,
  setQuery,
  sortBy,
  setSortBy,
  searchPlaceholder = "Search products...",
  resultsText,
  // sidebar + drawer
  sidebar,
  drawer,
  // grid
  children,
  // mobile drawer control
  mobileFiltersOpen,
  setMobileFiltersOpen,
}) {
  // Escape closes drawer (nice UX)
  useEffect(() => {
    if (!mobileFiltersOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") setMobileFiltersOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileFiltersOpen, setMobileFiltersOpen]);

  return (
    <div className={pageClassName}>
      {/* HERO */}
      <header className="lp-hero">
        <div className="lp-heroInner">
          <div className="lp-titleBlock">
            <p className="lp-kicker">{kicker}</p>
            <h1 className="lp-title">{title}</h1>
            <p className="lp-subtitle">{subtitle}</p>
          </div>
          <div className="lp-heroGlow" aria-hidden="true" />
        </div>
      </header>

      {/* MAIN */}
      <section className="lp-shell">
        {/* TOP TOOLBAR (mobile & tablet) */}
        <div className="lp-toolbar">
          <button
            className="lp-filterBtn"
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
          >
            Filters
            <span className="lp-badge">{resultsText}</span>
          </button>

          <div className="lp-searchWrap">
            <input
              className="lp-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label="Search products"
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
        <aside className="lp-sidebar" aria-label="Filters">
          {sidebar}
        </aside>

        {/* CONTENT */}
        <main className="lp-content" aria-label="Products">
          {/* Desktop top row */}
          <div className="lp-contentTop">
            <div className="lp-results">{resultsText}</div>

            <div className="lp-contentSearch">
              <input
                className="lp-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label="Search products"
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
          <div className="lp-grid">{children}</div>
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
              {drawer}
            </aside>
          </div>
        ) : null}
      </section>
    </div>
  );
}
