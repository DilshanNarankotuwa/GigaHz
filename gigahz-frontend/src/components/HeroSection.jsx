import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./HeroSection.module.css";
import image1 from "/images/herosection/image1.jpg";
import image2 from "/images/herosection/image2.jpg";
import image3 from "/images/herosection/image3.jpg";
import { Link } from "react-router";

export default function HeroSection() {
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

  const hostRef = useRef(null);
  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const pointerDownRef = useRef(false);
  const resumeTimerRef = useRef(null);

  const goTo = (index) => setActive((index + slides.length) % slides.length);
  const next = () => goTo(active + 1);
  const prev = () => goTo(active - 1);

  const pauseBriefly = (ms = 1200) => {
    setPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setPaused(false), ms);
  };

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setActive((a) => (a + 1) % slides.length);
    }, 4500);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  const onPointerDown = (e) => {
    pointerDownRef.current = true;
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    setPaused(true);
  };

  const onPointerMove = (e) => {
    if (!pointerDownRef.current) return;
    lastXRef.current = e.clientX;
  };

  const onPointerUp = () => {
    if (!pointerDownRef.current) return;
    pointerDownRef.current = false;

    const dx = lastXRef.current - startXRef.current;
    const SWIPE_PX = 40;

    if (dx <= -SWIPE_PX) next();
    else if (dx >= SWIPE_PX) prev();

    pauseBriefly();
  };

  return (
    <section
      ref={hostRef}
      className={styles.hero}
      aria-label="GigaHz hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{ touchAction: "pan-y" }}
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

      <div className={styles.overlay} />

      <div className={styles.content}>
        <p className={styles.eyebrow}>GigaHz • Custom PC Builder</p>
        <h1 className={styles.title}>{slides[active].title}</h1>
        <p className={styles.subtitle}>{slides[active].subtitle}</p>

        <div className={styles.actions}>
          <Link className={`${styles.btn} ${styles.btnPrimary}`} to="/buildmypc">
            {slides[active].ctaPrimary}
          </Link>
          <Link className={`${styles.btn} ${styles.btnGhost}`} to="/products">
            {slides[active].ctaSecondary}
          </Link>
        </div>
      </div>

      <div className={styles.dots}>
        {slides.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
            onClick={() => goTo(i)}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}
