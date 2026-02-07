import React from "react";
import styles from "./StrengthSection.module.css";

export default function StrengthSection({
  imageSrc = "/images/home/vr.jpg", // put your image in /public/images/home/vr.jpg
}) {
  return (
    <section className={styles["gh-strength"]} aria-label="GigaHz Strengths">
      <div className={styles["gh-strength__bg"]} aria-hidden="true" />

      <div className={styles["gh-strength__container"]}>
        {/* LEFT */}
        <div className={styles["gh-strength__left"]}>

          {/* FEATURE CARDS */}
          <div className={styles["gh-strength__grid"]}>
            <article className={styles["gh-strength__card"]}>
              <div className={styles["gh-strength__icon"]} aria-hidden="true">
                {/* shield */}
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3l7 4v6c0 5-3 8-7 9-4-1-7-4-7-9V7l7-4z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="M9.5 12l1.8 1.9L15 10.3"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Trusted Quality</h3>
              <p>Clear specs, clean listings, and reliable condition grading.</p>
            </article>

            <article className={styles["gh-strength__card"]}>
              <div className={styles["gh-strength__icon"]} aria-hidden="true">
                {/* cpu */}
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                  <rect
                    x="6"
                    y="6"
                    width="12"
                    height="12"
                    rx="2.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="M9 9h6v6H9V9z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                </svg>
              </div>
              <h3>Smart Compatibility</h3>
              <p>Build Your PC logic that avoids mismatches and bottlenecks.</p>
            </article>

            <article className={styles["gh-strength__card"]}>
              <div className={styles["gh-strength__icon"]} aria-hidden="true">
                {/* bolt */}
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Fast Experience</h3>
              <p>Snappy UI, smooth filters, and quick product discovery.</p>
            </article>

            <article className={styles["gh-strength__card"]}>
              <div className={styles["gh-strength__icon"]} aria-hidden="true">
                {/* headset */}
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 12a8 8 0 0116 0v6a2 2 0 01-2 2h-1v-6a2 2 0 00-2-2h-2"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M4 12v6a2 2 0 002 2h1v-6a2 2 0 012-2h2"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3>Modern Support</h3>
              <p>Easy contact, clean checkout flow, and helpful guidance.</p>
            </article>
          </div>

        </div>

        {/* RIGHT */}
        <div className={styles["gh-strength__right"]}>
          
            <img
              className={styles["gh-strength__img"]}
              src='/src/assets/images/strengthsection/vr.png'
              alt="Futuristic VR headset visual"
              loading="lazy"
            />
         
        </div>
      </div>
    </section>
  );
}
