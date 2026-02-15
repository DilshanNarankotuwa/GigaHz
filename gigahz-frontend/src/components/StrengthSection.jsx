import React from "react";
import styles from "./StrengthSection.module.css";

const FEATURES = [
  { title: "Verified Listings", desc: "Clear specs. Honest grading." },
  { title: "Compatibility Checks", desc: "Avoid mismatches + bottlenecks." },
  { title: "Fast Browsing", desc: "Smooth. Instant. Clean." },
  { title: "Real Support", desc: "Quick help when you need it." },
];

export default function StrengthSection() {
  return (
    <section className={styles["gh-strength"]} aria-label="GigaHz Strengths">
      <div className={styles["gh-strength__container"]}>
        {/* LEFT */}
        <div className={styles["gh-strength__left"]}>
          <div className={styles["gh-strength__content"]}>
            <span className={styles["gh-strength__kicker"]}>GigaHz Strength</span>

            <h2 className={styles["gh-strength__title"]}>
              Build clean. <span>Buy smart.</span>
            </h2>

            <p className={styles["gh-strength__desc"]}>
              Compatibility logic + quality parts — no guesswork.
            </p>

            {/* clean list (no text boxes) */}
            <div className={styles["gh-strength__grid"]}>
              {FEATURES.map((f) => (
                <div key={f.title} className={styles["gh-strength__item"]}>
                  <div className={styles["gh-strength__itemTitle"]}>
                    {f.title}
                  </div>
                  <div className={styles["gh-strength__itemDesc"]}>
                    {f.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className={styles["gh-strength__right"]} aria-hidden="true">
          <img
            src="/images/strengthsection/vr.png"
            alt=""
            className={styles["gh-strength__img"]}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
