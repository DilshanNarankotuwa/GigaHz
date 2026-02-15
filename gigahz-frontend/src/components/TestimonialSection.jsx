import React from "react";
import styles from "./TestimonialSection.module.css";

const testimonials = [
  {
    name: "Praneeth Randunu",
    rating: 5,
    text:
      "I recently purchased a high-end laptop from GigaHz and it was the smoothest experience. Staff were friendly, explained everything clearly, and helped me pick the best option for my budget.",
  },
  {
    name: "Ariyadasa Kalindu",
    rating: 5,
    text:
      "Upgraded my PC cooling based on their recommendation and the temps dropped a lot. My system runs quieter and faster now. Super knowledgeable team!",
  },
  {
    name: "Tharusha",
    rating: 5,
    text:
      "Great customer service. They diagnosed the issue quickly and the repair was done faster than expected. Friendly and professional — highly recommended.",
  },
  {
    name: "Thisal Prabod",
    rating: 5,
    text:
      "Visited GigaHz for my first PC build. They explained each part, guided me with compatibility, and helped me choose the perfect setup.",
  },
  {
    name: "Ashan Fernando",
    rating: 5,
    text:
      "I needed a workstation for heavy software and plugins. They built a powerful PC that exceeded my expectations and supported me throughout.",
  },
  {
    name: "Thusitha Madushan",
    rating: 5,
    text:
      "Amazing atmosphere and support. The team is patient, explains things well, and always tries to give the best solution.",
  },
];

function Stars({ count = 5 }) {
  return (
    <div className={styles.stars} aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? styles.starOn : styles.starOff}>
          ★
        </span>
      ))}
    </div>
  );
}

function VerifiedBadge() {
  return (
    <span className={styles.verified} title="Verified" aria-label="Verified">
      ✓
    </span>
  );
}

function GoogleMark() {
  return (
    <span className={styles.googleMark} aria-label="Google">
      G
    </span>
  );
}

function InitialAvatar({ name }) {
  const letter = (name?.trim()?.[0] || "G").toUpperCase();
  return <div className={styles.avatar}>{letter}</div>;
}

export default function TestimonialSection() {
  return (
    <section className={styles.section} aria-labelledby="gh-testimonials-title">
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
            
          <img src="/images/testimonial/google.png" alt="Google" className={styles.googlelogo} />
            
          <div className={styles.subRow}>
            <Stars count={5} />
            <VerifiedBadge />
            <span className={styles.subText}>Based on 1500+ reviews</span>
          </div>
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {testimonials.map((t, idx) => (
            <article key={idx} className={styles.card}>
              <div className={styles.cardTop}>
                <Stars count={t.rating} />
                <VerifiedBadge />
                <GoogleMark />
              </div>

              <p className={styles.text}>{t.text}</p>

              <div className={styles.footer}>
                <InitialAvatar name={t.name} />
                <div className={styles.name}>{t.name}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
