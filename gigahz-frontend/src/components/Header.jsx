import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import { Link } from "react-router";

export default function Header() {
  const [open, setOpen] = useState(false);

  // Close on ESC + lock body scroll
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    // lock scroll when menu open
    const prevOverflow = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = prevOverflow || "";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow || "";
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header className={styles.ghHeader}>
      <nav className={styles.ghNav} aria-label="Primary Navigation">
        {/* LEFT */}
        <div className={styles.ghLeft}>
          <Link
            to="/"
            className={styles.ghBrand}
            aria-label="Go to GigaHz home"
            onClick={closeMenu}
          >
            <img src="/logo.png" className={styles.ghLogo} alt="GigaHz" />
            <img
              src="/logo.png"
              className={styles.ghLogoMobile}
              alt="GigaHz"
            />
          </Link>
        </div>

        {/* CENTER (DESKTOP MENU) */}
        <ul className={styles.ghMenu}>
          <li>
            <a href="#">Products</a>
          </li>
          <li>
            <a href="#">Accessories</a>
          </li>
          <li>
            <Link to="/laptops">Laptops</Link>
          </li>
          <li>
            <Link to="/mobiles">Mobiles</Link>
          </li>
          <li>
            <Link to="/preowned">Pre-Owned</Link>
          </li>
          <li className={styles.build}>
            <Link to="/buildmypc">Build My PC</Link>
          </li>
        </ul>

        {/* RIGHT */}
        <div className={styles.ghRight}>
          <div className={styles.ghSearch}>
            <input type="text" placeholder="Search products…" />
            <button aria-label="Search">
              <img
                className={styles.searchicon}
                src="/icons/header/search.png"
                alt=""
              />
            </button>
          </div>

          <Link
            to="/checkout"
            className={styles.ghCart}
            aria-label="Cart"
            onClick={closeMenu}
          >
            <img src="/icons/header/cart-icon.png" alt="" />
            <span className={styles.cartBadge}>3</span>
          </Link>

          {/* HAMBURGER */}
          <button
            className={styles.ghHamburger}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="gh-mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* ✅ Mobile overlay */}
      <div
        className={`${styles.mobileOverlay} ${open ? styles.show : ""}`}
        onClick={closeMenu}
        aria-hidden={!open}
      />

      {/* ✅ Mobile menu panel */}
      <div
        id="gh-mobile-menu"
        className={`${styles.mobileMenu} ${open ? styles.open : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        <div className={styles.mobileMenuInner}>
          <div className={styles.mobileTitle}>Navigation</div>

          <Link to="/" onClick={closeMenu} className={styles.mobileLink}>
            Home
          </Link>

          <a href="#" onClick={closeMenu} className={styles.mobileLink}>
            Products
          </a>

          <a href="#" onClick={closeMenu} className={styles.mobileLink}>
            Accessories
          </a>

          <Link to="/laptops" onClick={closeMenu} className={styles.mobileLink}>
            Laptops
          </Link>

          <Link to="/mobiles" onClick={closeMenu} className={styles.mobileLink}>
            Mobiles
          </Link>

          <Link
            to="/preowned"
            onClick={closeMenu}
            className={styles.mobileLink}
          >
            Pre-Owned
          </Link>

          <Link
            to="/buildmypc"
            onClick={closeMenu}
            className={`${styles.mobileLink} ${styles.mobileBuild}`}
          >
            Build My PC
          </Link>
        </div>
      </div>
    </header>
  );
}
