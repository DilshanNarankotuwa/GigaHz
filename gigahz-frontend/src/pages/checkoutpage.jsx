import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import Header from "../components/Header";
import styles from "./checkoutpage.module.css";
import Footer from "../components/Footer";

/**
 * GigaHz Checkout Page
 * Reads cart data from:
 *  1) react-router location.state (recommended)
 *  2) sessionStorage key "gigahz_checkout"
 *  3) sessionStorage key "gigahz_build" (optional legacy)
 *
 * Expected payload shape:
 * {
 *   selections: { cpu, motherboard, ram, storage, casing, cooling, psu, gpu },
 *   qtyByKey:   { cpu:1, motherboard:1, ... }
 * }
 */

const DEFAULT_KEYS = ["cpu","motherboard","ram","storage","casing","cooling","psu","gpu"];

function safeParse(json) {
  try { return JSON.parse(json); } catch { return null; }
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [payload, setPayload] = useState(null);
  const [notice, setNotice] = useState("");

  // Customer details
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postal, setPostal] = useState("");

  // Payment + extras
  const [payment, setPayment] = useState("cod"); // cod | card | bank
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(null); // {code, amount}

  useEffect(() => {
    // 1) Location state
    const stateData = location?.state?.checkout || location?.state;
    if (stateData?.selections) {
      setPayload(stateData);
      sessionStorage.setItem("gigahz_checkout", JSON.stringify(stateData));
      return;
    }

    // 2) sessionStorage checkout
    const ss = safeParse(sessionStorage.getItem("gigahz_checkout"));
    if (ss?.selections) {
      setPayload(ss);
      return;
    }

    // 3) optional legacy key
    const legacy = safeParse(sessionStorage.getItem("gigahz_build"));
    if (legacy?.selections) {
      setPayload(legacy);
      return;
    }

    setPayload({ selections: {}, qtyByKey: {} });
  }, [location]);

  const { selections, qtyByKey } = payload || { selections: {}, qtyByKey: {} };

  const cartLines = useMemo(() => {
    return DEFAULT_KEYS
      .map((k) => {
        const item = selections?.[k];
        if (!item) return null;
        const qty = Math.max(1, Number(qtyByKey?.[k] ?? 1));
        const price = Number(item.price ?? 0);
        return {
          key: k,
          label: item.label ?? item.name ?? k.toUpperCase(),
          image: item.image,
          price,
          qty,
          lineTotal: price * qty,
          stock: item.stock,
          sku: item.sku,
        };
      })
      .filter(Boolean);
  }, [selections, qtyByKey]);

  const subtotal = useMemo(
    () => cartLines.reduce((s, l) => s + l.lineTotal, 0),
    [cartLines]
  );

  // Same discount logic as your BuildMyPC
  const buildDiscount = useMemo(() => {
    const count = cartLines.length;
    const rate = count >= 5 ? 0.02 : count >= 3 ? 0.01 : 0;
    return Math.round(subtotal * rate);
  }, [cartLines.length, subtotal]);

  const promoDiscount = promoApplied?.amount ?? 0;

  // Delivery rule (simple)
  const deliveryFee = useMemo(() => {
    if (cartLines.length === 0) return 0;
    return subtotal >= 250000 ? 0 : 1500; // LKR example
  }, [cartLines.length, subtotal]);

  const payable = Math.max(0, subtotal - buildDiscount - promoDiscount + deliveryFee);

  function fmtLKR(n) {
    try {
      return new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(n);
    } catch {
      return `LKR ${Number(n || 0).toLocaleString()}`;
    }
  }

  function applyPromo() {
    const code = promo.trim().toUpperCase();
    if (!code) return setPromoApplied(null);

    // Demo promo rules (replace with backend later)
    if (code === "GIGAHZ10") {
      const amt = Math.min(10000, Math.round(subtotal * 0.03)); // capped
      setPromoApplied({ code, amount: amt });
      setNotice(`Promo applied: ${code}`);
      return;
    }

    if (code === "FREESHIP") {
      if (deliveryFee === 0) {
        setNotice("Delivery is already free for this order.");
        setPromoApplied(null);
        return;
      }
      setPromoApplied({ code, amount: deliveryFee });
      setNotice(`Promo applied: ${code}`);
      return;
    }

    setPromoApplied(null);
    setNotice("Invalid promo code.");
  }

  function validate() {
    if (cartLines.length === 0) return "Your cart is empty.";
    if (!fullName.trim()) return "Please enter your full name.";
    if (!phone.trim()) return "Please enter your phone number.";
    if (!address1.trim()) return "Please enter your address.";
    if (!city.trim()) return "Please enter your city.";
    return "";
  }

  function placeOrder() {
    const err = validate();
    if (err) {
      setNotice(err);
      return;
    }

    // Save order draft (demo). Replace with API call later.
    const order = {
      id: `GHZ-${Date.now()}`,
      createdAt: new Date().toISOString(),
      customer: { fullName, phone, email, address1, address2, city, province, postal },
      payment,
      promo: promoApplied,
      totals: { subtotal, buildDiscount, promoDiscount, deliveryFee, payable },
      items: cartLines,
    };

    sessionStorage.setItem("gigahz_last_order", JSON.stringify(order));
    setNotice(`Order placed! (Demo) Your order ID: ${order.id}`);
    // If you have a confirmation route, you can enable this:
    // navigate("/order-confirmation", { state: { order } });
  }

  return (
    <>
    <Header />
    <div className={styles.page}>
      <main className={styles.container}>
        <div className={styles.topBar}>
          <button className={styles.ghostBtn} onClick={() => navigate(-1)}>
            ← Back
          </button>

          <div className={styles.titleWrap}>
            <h1 className={styles.title}>Checkout</h1>
            <p className={styles.subTitle}>
              Secure your build — review parts, add delivery details, and place your order.
            </p>
          </div>
        </div>

        {notice ? <div className={styles.notice}>{notice}</div> : null}

        <div className={styles.grid}>
          {/* LEFT: Details */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Delivery Details</h2>

            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.label}>Full name *</label>
                <input className={styles.input} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Dilshan Narankotuwa" />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Phone *</label>
                <input className={styles.input} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+94 7X XXX XXXX" />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>

              <div className={styles.fieldWide}>
                <label className={styles.label}>Address line 1 *</label>
                <input className={styles.input} value={address1} onChange={(e) => setAddress1(e.target.value)} placeholder="House No, Street, Area" />
              </div>

              <div className={styles.fieldWide}>
                <label className={styles.label}>Address line 2</label>
                <input className={styles.input} value={address2} onChange={(e) => setAddress2(e.target.value)} placeholder="Apartment, landmark (optional)" />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>City *</label>
                <input className={styles.input} value={city} onChange={(e) => setCity(e.target.value)} placeholder="Colombo" />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Province</label>
                <input className={styles.input} value={province} onChange={(e) => setProvince(e.target.value)} placeholder="Western Province" />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Postal code</label>
                <input className={styles.input} value={postal} onChange={(e) => setPostal(e.target.value)} placeholder="xxxxx" />
              </div>
            </div>

            <div className={styles.divider} />

            <h2 className={styles.cardTitle}>Payment Method</h2>

            <div className={styles.payGrid}>
              <button
                className={`${styles.payOption} ${payment === "cod" ? styles.payActive : ""}`}
                onClick={() => setPayment("cod")}
                type="button"
              >
                <div className={styles.payTop}>
                  <span className={styles.payDot} />
                  <span className={styles.payName}>Cash on Delivery</span>
                </div>
                <p className={styles.payDesc}>Pay when your PC parts arrive.</p>
              </button>

              <button
                className={`${styles.payOption} ${payment === "card" ? styles.payActive : ""}`}
                onClick={() => setPayment("card")}
                type="button"
              >
                <div className={styles.payTop}>
                  <span className={styles.payDot} />
                  <span className={styles.payName}>Card Payment</span>
                </div>
                <p className={styles.payDesc}>Visa / MasterCard (add gateway later).</p>
              </button>

              <button
                className={`${styles.payOption} ${payment === "bank" ? styles.payActive : ""}`}
                onClick={() => setPayment("bank")}
                type="button"
              >
                <div className={styles.payTop}>
                  <span className={styles.payDot} />
                  <span className={styles.payName}>Bank Transfer</span>
                </div>
                <p className={styles.payDesc}>Upload slip later (optional flow).</p>
              </button>
            </div>

            <div className={styles.actionsRow}>
              <button className={styles.secondaryBtn} onClick={() => navigate("/buildmypc")}>
                Edit Build
              </button>
              <button className={styles.primaryBtn} onClick={placeOrder}>
                Place Order
              </button>
            </div>
          </section>

          {/* RIGHT: Summary */}
          <aside className={styles.cardSticky}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Order Summary</h2>

              {cartLines.length === 0 ? (
                <div className={styles.empty}>
                  <p className={styles.emptyTitle}>No items yet</p>
                  <p className={styles.emptyText}>Go back to Build My PC and add components to your cart.</p>
                  <button className={styles.primaryBtn} onClick={() => navigate("/buildmypc")}>
                    Build My PC
                  </button>
                </div>
              ) : (
                <>
                  <div className={styles.lines}>
                    {cartLines.map((l) => (
                      <div key={l.key} className={styles.line}>
                        <div className={styles.lineLeft}>
                          {l.image ? (
                            <img className={styles.lineImg} src={l.image} alt={l.label} />
                          ) : (
                            <div className={styles.lineImgFallback} />
                          )}
                          <div className={styles.lineText}>
                            <div className={styles.lineTitle}>{l.label}</div>
                            <div className={styles.lineMeta}>
                              Qty: {l.qty} • {fmtLKR(l.price)}
                              {typeof l.stock === "string" ? ` • ${l.stock}` : ""}
                            </div>
                          </div>
                        </div>
                        <div className={styles.lineRight}>{fmtLKR(l.lineTotal)}</div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.divider} />

                  <div className={styles.promoRow}>
                    <input
                      className={styles.input}
                      value={promo}
                      onChange={(e) => setPromo(e.target.value)}
                      placeholder="Promo code (e.g., GIGAHZ10)"
                    />
                    <button className={styles.ghostBtn} onClick={applyPromo} type="button">
                      Apply
                    </button>
                  </div>

                  <div className={styles.totals}>
                    <div className={styles.totalRow}>
                      <span className={styles.muted}>Subtotal</span>
                      <span>{fmtLKR(subtotal)}</span>
                    </div>
                    <div className={styles.totalRow}>
                      <span className={styles.muted}>Build discount</span>
                      <span className={styles.good}>- {fmtLKR(buildDiscount)}</span>
                    </div>
                    {promoApplied ? (
                      <div className={styles.totalRow}>
                        <span className={styles.muted}>Promo ({promoApplied.code})</span>
                        <span className={styles.good}>- {fmtLKR(promoDiscount)}</span>
                      </div>
                    ) : null}
                    <div className={styles.totalRow}>
                      <span className={styles.muted}>Delivery</span>
                      <span>{deliveryFee === 0 ? "FREE" : fmtLKR(deliveryFee)}</span>
                    </div>

                    <div className={styles.totalRowBig}>
                      <span className={styles.totalLabel}>Payable</span>
                      <span className={styles.totalValue}>{fmtLKR(payable)}</span>
                    </div>

                    <p className={styles.finePrint}>
                      Prices shown are estimates. Final totals may change based on stock and delivery location.
                    </p>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
    <Footer/>
    </>
    
  );
}
