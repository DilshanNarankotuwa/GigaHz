import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import styles from "./HeroSection.module.css";
import image1 from "/images/herosection/image1.jpg";
import image2 from "/images/herosection/image2.jpg";
import image3 from "/images/herosection/image3.jpg";


export default function HeroSection() {
  // Put images inside: /public/images/hero/
  const slides = useMemo(
    () => [
      {
        id: 1,
        image: image1,
        title: "Build Your Dream PC",
        subtitle: "Smart compatibility checks • Zero bottlenecks • Clean builds",
        ctaPrimary: "Build Your PC",
        ctaSecondary: "Browse Parts",
      },
      {
        id: 2,
        image: image2,
        title: "Next-Gen Gaming Rigs",
        subtitle: "High FPS setups with premium cooling & RGB-ready cases",
        ctaPrimary: "Explore Gaming",
        ctaSecondary: "See Deals",
      },
      {
        id: 3,
        image: image3,
        title: "Creator Workstations",
        subtitle: "Fast rendering • Reliable performance • Pro-grade components",
        ctaPrimary: "Workstation Picks",
        ctaSecondary: "Compare CPUs",
      },
    ],
    []
  );

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = (index) => setActive((index + slides.length) % slides.length);
  const next = () => goTo(active + 1);
  const prev = () => goTo(active - 1);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setActive((a) => (a + 1) % slides.length);
    }, 4500);

    return () => clearInterval(t);
  }, [paused, slides.length]);

  return (
    <section
      className={styles.hero}
      aria-label="GigaHz hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <div className={styles.slides}>
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`${styles.slide} ${i === active ? styles.active : ""}`}
            style={{ backgroundImage: `url(${s.image})` }}
            role="img"
            aria-label={s.title}
          />
        ))}
      </div>

      {/* Overlay */}
      <div className={styles.overlay} />

      {/* Content */}
      <div className={styles.content}>
        <p className={styles.eyebrow}>GigaHz • Custom PC Builder</p>
        <h1 className={styles.title}>{slides[active].title}</h1>
        <p className={styles.subtitle}>{slides[active].subtitle}</p>

        <div className={styles.actions}>
          <Link className={`${styles.btn} ${styles.btnPrimary}`} to="/buildmyPC">
            {slides[active].ctaPrimary}
          </Link>
          <Link className={`${styles.btn} ${styles.btnGhost}`} to="#products">
            {slides[active].ctaSecondary}
          </Link>
        </div>
      </div>

      {/* Controls */}
      <button
        className={`${styles.arrow} ${styles.left}`}
        onClick={prev}
        aria-label="Previous slide"
        type="button"
      >
        ‹
      </button>
      <button
        className={`${styles.arrow} ${styles.right}`}
        onClick={next}
        aria-label="Next slide"
        type="button"
      >
        ›
      </button>

      {/* Dots */}
      <div className={styles.dots} role="tablist" aria-label="Hero slide selector">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-selected={i === active}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}
