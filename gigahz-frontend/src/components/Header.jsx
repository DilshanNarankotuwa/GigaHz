import React from "react";
import styles from "./Header.module.css";
import { Link } from 'react-router'

export default function Header() {
  return (
    <header className={styles.ghHeader}>
      <nav className={styles.ghNav} aria-label="Primary Navigation">
        {/* LEFT */}
        <div className={styles.ghLeft}>
          <Link to="/" className={styles.ghBrand} aria-label="Go to GigaHz home">
            <img src="/logo.png" className={styles.ghLogo} alt="GigaHz" />
          </Link>
        </div>

        {/* CENTER (DESKTOP MENU) */}
        <ul className={styles.ghMenu}>
          <li>
            <a href="#">
              Products 
            </a>
          </li>
          <li>
            <a href="#">
              Accessories 
            </a>
          </li>
          <li>
            <Link to="/laptops">Laptops</Link>
          </li>
          <li>
            <a href="/mobiles">Mobiles</a>
          </li>
          <li>
            <a href="/preowned">Pre-Owned</a>
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
              <img className={styles.searchicon}src="/icons/header/search.png" alt=""/>
            </button>
          </div>

          <Link to="/checkout" className={styles.ghCart} aria-label="Cart">
            <img src="/icons/header/cart-icon.png" alt="" />
            <span className={styles.cartBadge}>3</span>
          </Link>

          {/* HAMBURGER */}
          <button className={styles.ghHamburger} aria-label="Open menu">
            ☰
          </button>
        </div>
      </nav>
    </header>
  );
}
