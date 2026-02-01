import React from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} aria-label="GigaHz footer">
      <div className={styles.topGlow} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.grid}>
          {/* BRAND */}
          <section className={styles.brandCol}>
            <a href="/" className={styles.brand} aria-label="Go to GigaHz home">
              <span className={styles.logoMark} aria-hidden="true">
                <img className={styles.logo} src='/src/assets/logo.png'/>
              </span>
              <span className={styles.brandText}>
                <span className={styles.brandName}>GigaHz</span>
                <span className={styles.brandTag}>Build • Upgrade • Game</span>
              </span>
            </a>

            <p className={styles.desc}>
              Sri Lanka’s modern PC marketplace laptops, mobiles, pre-owned gear,
              and a powerful “Build Your Own PC” experience.
            </p>

            <div className={styles.badges} aria-label="Highlights">
              <span className={styles.badge}>Compatibility Checked</span>
              <span className={styles.badge}>Secure Payments</span>
              <span className={styles.badge}>Fast Delivery</span>
            </div>
          </section>

          {/* LINKS */}
          <section className={styles.linksCol} aria-label="Footer navigation">
            <div className={styles.linkGroup}>
              <h4 className={styles.title}>Shop</h4>
              <ul className={styles.list}>
                <li><a href="/laptops">Laptops</a></li>
                <li><a href="/mobiles">Mobiles</a></li>
                <li><a href="/pre-owned">Pre-Owned</a></li>
                <li><a href="/build">Build Your PC</a></li>
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.title}>Company</h4>
              <ul className={styles.list}>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/shipping">Shipping</a></li>
                <li><a href="/warranty">Warranty</a></li>
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.title}>Support</h4>
              <ul className={styles.list}>
                <li><a href="/faq">FAQ</a></li>
                <li><a href="/returns">Returns</a></li>
                <li><a href="/privacy">Privacy</a></li>
                <li><a href="/terms">Terms</a></li>
              </ul>
            </div>
          </section>

          {/* NEWSLETTER */}
          <section className={styles.newsCol} aria-label="Newsletter">
            <h4 className={styles.newsTitle}>Get Deals & Drops</h4>
            <p className={styles.note}>
              Weekly updates on new stock, price cuts, and custom builds.
            </p>

            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <input
                className={styles.input}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
              <button className={styles.btn} type="submit">Subscribe</button>
            </form>

            <div className={styles.socialRow} aria-label="Social links">
              <a className={styles.social} href="#" aria-label="Instagram">
                <img className={styles.socialicon} src='/src/assets/icons/footer/instagram.png'/>
              </a>
              <a className={styles.social} href="#" aria-label="Facebook">
                <img className={styles.socialicon} src='/src/assets/icons/footer/facebook.png'/>
              </a>
              <a className={styles.social} href="#" aria-label="TikTok">
                <img className={styles.socialicon} src='/src/assets/icons/footer/tiktok.png'/>
              </a>
              <a className={styles.social} href="#" aria-label="YouTube">
                <img className={styles.socialicon} src='/src/assets/icons/footer/youtube.png'/>
              </a>
            </div>
          </section>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottomBar}>
          <p className={styles.copy}>© {year} GigaHz. All rights reserved.</p>

          <div className={styles.bottomLinks}>
            <a href="/privacy">Privacy</a>
            <span className={styles.dot} aria-hidden="true">•</span>
            <a href="/terms">Terms</a>
            <span className={styles.dot} aria-hidden="true">•</span>
            <a href="/contact">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
