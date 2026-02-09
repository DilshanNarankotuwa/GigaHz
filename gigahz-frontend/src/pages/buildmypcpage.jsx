import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./buildmypcpage.module.css";
import Header from '../components/Header'
import { useNavigate } from "react-router";

const PARTS = [
  { key: "cpu", label: "CPU", image: "/icons/buildmypc/cpu.png" },
  { key: "motherboard", label: "Motherboard", image: "/icons/buildmypc/motherboard.png" },
  { key: "ram", label: "RAM", image: "/icons/buildmypc/ram.png" },
  { key: "storage", label: "SSD & HDD", image: "/icons/buildmypc/ssd.png" },
  { key: "casing", label: "Casing", image: "/icons/buildmypc/casing.png" },
  { key: "cooling", label: "Cooling & Fans", image: "/icons/buildmypc/cooler.png" },
  { key: "psu", label: "Power Unit", image: "/icons/buildmypc/psu.png" },
  { key: "gpu", label: "GPU", image: "/icons/buildmypc/gpu.png" },
];




const API_BASE = "http://localhost:3000";

const CATEGORY_MAP = {
  cpu: "cpu",
  motherboard: "motherboard",
  ram: "ram",
  storage: "storage",
  casing: "case",
  cooling: "cooling",
  psu: "psu",
  gpu: "gpu",
};

function normalizeProduct(p) {
  return {
    id: String(p.id),
    image: p.image_url || "",
    brand: p.brand || "",
    name: p.name || "",
    socket: p.socket || null,
    type: p.ram_type || null,
    watt: p.wattage ?? null,
    price: Number(p.price_lkr ?? 0),
    stock: (p.stock_qty ?? 0) > 0 ? "in" : "out",
  };
}









function formatLKR(value) {
  return new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(value);
}

function stockBadge(stock) {
  if (stock === "in") return { text: "In stock", cls: `${styles.badge} ${styles.in}` };
  if (stock === "out") return { text: "Out of stock", cls: `${styles.badge} ${styles.out}` };
  return { text: "Pre-order", cls: `${styles.badge} ${styles.pre}` };
}

export default function BuildMyPC() {



  const [productsByKey, setProductsByKey] = useState({
  cpu: [],
  motherboard: [],
  ram: [],
  storage: [],
  casing: [],
  cooling: [],
  psu: [],
  gpu: [],
});

const [loadingProducts, setLoadingProducts] = useState(false);
const [productsError, setProductsError] = useState("");


  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = PARTS[activeStepIndex];

  const [selections, setSelections] = useState({
    cpu: null,
    motherboard: null,
    ram: null,
    storage: null,
    casing: null,
    cooling: null,
    psu: null,
    gpu: null,
  });

  const [qtyByKey, setQtyByKey] = useState({
    cpu: 1, motherboard: 1, ram: 1, storage: 1, casing: 1, cooling: 1, psu: 1, gpu: 1,
  });

  // ✅ CPU modal only AMD/Intel (opens when Build My PC page opens)
  const [cpuModalOpen, setCpuModalOpen] = useState(true);
  const [cpuBrandSelected, setCpuBrandSelected] = useState(null); // "AMD" | "Intel" | null

  
  // ✅ Products list highlight pulse when switching parts
  const [listFlash, setListFlash] = useState(false);

  // ✅ Product details modal
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsItem, setDetailsItem] = useState(null);

// filter states
  const [filterStock, setFilterStock] = useState("all");
  const [search, setSearch] = useState("");

  // AI assistant
  const [question, setQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");

  // Carousel refs
  const carouselRef = useRef(null);

  const navigate = useNavigate(); 


  async function loadProducts(stepKey) {
  const category = CATEGORY_MAP[stepKey];
  if (!category) return;

  const params = new URLSearchParams();
  params.set("category", category);
  params.set("active", "true");

  if (stepKey === "motherboard") {
    if (selections.cpu?.socket) params.set("socket", selections.cpu.socket);
  }

  if (stepKey === "ram") {
    const cpuSocket = selections.cpu?.socket;
    if (cpuSocket === "AM5") params.set("ramType", "DDR5");
    else if (cpuSocket === "AM4") params.set("ramType", "DDR4");
  }

  const url = `${API_BASE}/api/products?${params.toString()}`;

  setLoadingProducts(true);
  setProductsError("");

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();

    const normalized = (Array.isArray(data) ? data : []).map(normalizeProduct);
    setProductsByKey((prev) => ({ ...prev, [stepKey]: normalized }));
  } catch (e) {
    setProductsError(String(e.message || e));
    setProductsByKey((prev) => ({ ...prev, [stepKey]: [] }));
  } finally {
    setLoadingProducts(false);
  }
}




  //Wheel -> horizontal scroll (no scrollbar)
  function onCarouselWheel(e) {
    const el = carouselRef.current;
    if (!el) return;
    e.preventDefault();
    el.scrollLeft += e.deltaY * 5;
  }

  function goToStep(index) {
    setActiveStepIndex(index);
    // smooth scroll the active card into view
    requestAnimationFrame(() => {
      const el = carouselRef.current;
      if (!el) return;
      const card = el.querySelector(`[data-step-index="${index}"]`);
      if (card) card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    });
  }


  useEffect(() => {
  loadProducts(activeStep.key);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [activeStep.key, selections.cpu?.socket]);





  // pulse highlight on left list when changing the active part
  useEffect(() => {
    setListFlash(true);
    const t = setTimeout(() => setListFlash(false), 550);
    return () => clearTimeout(t);
  }, [activeStep.key]);

  function openDetails(item) {
    setDetailsItem(item);
    setDetailsOpen(true);
  }

  function closeDetails() {
    setDetailsOpen(false);
    setDetailsItem(null);
  }


  // ✅ Items shown in left column (CPU list depends on brand selected)
 


const itemsForLeft = useMemo(() => {
  const list = productsByKey[activeStep.key] || [];

  const base =
    activeStep.key === "cpu"
      ? (cpuBrandSelected ? list.filter((c) => c.brand === cpuBrandSelected) : [])
      : list;

  return base
    .filter((it) => !search.trim() || (it.name || "").toLowerCase().includes(search.toLowerCase()))
    .filter((it) => {
      if (filterStock === "all") return true;
      if (filterStock === "in") return it.stock === "in";
      if (filterStock === "out") return it.stock === "out";
      if (filterStock === "pre") return it.stock === "pre";
      return true;
    });
}, [activeStep.key, productsByKey, cpuBrandSelected, filterStock, search]);




  const cartLines = useMemo(() => {
    return PARTS
      .map((p) => {
        const item = selections[p.key];
        if (!item) return null;
        const qty = qtyByKey[p.key] || 1;
        return {
          key: p.key,
          label: p.label,
          name: item.name,
          qty,
          price: item.price,
          lineTotal: item.price * qty,
        };
      })
      .filter(Boolean);
  }, [selections, qtyByKey]);

  const total = useMemo(() => cartLines.reduce((s, l) => s + l.lineTotal, 0), [cartLines]);
  const discount = useMemo(() => {
    const count = cartLines.length;
    const rate = count >= 5 ? 0.02 : count >= 3 ? 0.01 : 0;
    return Math.round(total * rate);
  }, [cartLines.length, total]);
  const payable = total - discount;

  // ✅ Set selection + auto move
  function setSelection(stepKey, item) {
    setSelections((prev) => {
      const next = { ...prev, [stepKey]: item };

      if (stepKey === "cpu") {
        next.motherboard = null;
        next.ram = null;
      }
      return next;
    });

    const nextIndex = Math.min(activeStepIndex + 1, PARTS.length - 1);
    goToStep(nextIndex);
  }

  // ✅ Clicking CPU shows ONLY AMD/Intel popup
  function openCpuBrandModal() {
    setCpuModalOpen(true);
  }

  // ✅ After picking brand: close modal, then show CPU list in left column
  function chooseCpuBrand(brand) {
    setCpuBrandSelected(brand);
    setCpuModalOpen(false);
    // ensure we are on CPU step (as you said CPU is first)
    goToStep(0);
  }

  // ✅ Left column highlight until the user selects the required item for the active part
  const needsSelection = useMemo(() => {
    if (activeStep.key === "cpu") return !selections.cpu;
    return !selections[activeStep.key];
  }, [activeStep.key, selections]);

  function aiSuggestionText() {
    const cpu = selections.cpu;
    const mb = selections.motherboard;
    const ram = selections.ram;
    const gpu = selections.gpu;
    const psu = selections.psu;

    if (!cpu) return "Select your CPU to begin. I will summarize compatibility and avoid bottlenecks.";

    const lines = [];
    lines.push(`Build Summary: ${cpu.name} (${cpu.socket})`);

    if (mb) lines.push(`• Motherboard: ${mb.name} ✅ socket match`);
    else lines.push("• Motherboard: not selected yet (compatible boards are filtered).");

    if (ram) lines.push(`• RAM: ${ram.name}`);
    else lines.push("• RAM: not selected yet.");

    if (gpu) lines.push(`• GPU: ${gpu.name}`);
    else lines.push("• GPU: not selected yet.");

    if (psu) lines.push(`• PSU: ${psu.name}`);
    else lines.push("• PSU: not selected yet.");

    lines.push("Advice: This build is filtered step-by-step to prevent compatibility mistakes.");

    return lines.join("\n");
  }

  function askAI() {
    const q = question.trim();
    if (!q) return;

    const cpu = selections.cpu?.name || "your CPU";
    const mb = selections.motherboard?.name || "your motherboard";
    const gpu = selections.gpu?.name || "your GPU";

    let reply =
      `Based on your current build (${cpu}, ${mb}, ${gpu}):\n` +
      `• Tell me your target use (gaming/editing/AI) + resolution + budget.\n` +
      `• I will recommend the best balance and avoid bottlenecks.\n`;

    if (q.toLowerCase().includes("socket")) {
      reply = `Your CPU socket is **${selections.cpu?.socket || "not selected"}**.\nMotherboard must match the same socket.`;
    } else if (q.toLowerCase().includes("bottleneck")) {
      reply =
        `To avoid bottleneck:\n` +
        `• 1080p high-FPS → CPU matters more.\n` +
        `• 1440p/4K → GPU matters more.\n` +
        `Tell me your resolution + games/software for a perfect balance.`;
    }

    setAiAnswer(reply);
  }

  return (
    <>
      <Header/>
      <div className={styles["bmp-page"]}>
        <header className={styles["bmp-header"]}>
          <div>
            <div className={styles.brand}>
              <span className={styles.brandDot} />
              <span className={styles.brandName}>GigaHz</span>
              <span className={styles.brandSub}>Build My PC</span>
            </div>
            <p className={styles.subtitle}>
              Build a compatible system unit step-by-step, track totals, then get AI suggestions.
            </p>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.ghostBtn}
              onClick={() => {
                setSelections({ cpu: null, motherboard: null, ram: null, storage: null, casing: null, cooling: null, psu: null, gpu: null });
                setQtyByKey({ cpu: 1, motherboard: 1, ram: 1, storage: 1, casing: 1, cooling: 1, psu: 1, gpu: 1 });
                setCpuBrandSelected(null);
                setCpuModalOpen(true);
                goToStep(0);
                setAiAnswer("");
                setQuestion("");
                setSearch("");
                setFilterStock("all");
              }}
            >
              Reset build
            </button>
            <button
              className={styles.primaryBtn}
              onClick={() => {
                const payload = { selections, qtyByKey };
                sessionStorage.setItem("gigahz_checkout", JSON.stringify(payload));
                navigate("/checkout", { state: payload });
              }}
            >
              Add to Cart
            </button>
          </div>
        </header>

        {/* System Unit Carousel */}
        <section className={styles.card}>
          <div className={styles.cardTop}>
            <h2 className={styles.cardTitle}>Choose PC Part </h2>
            <div className={styles.stepHint}>
              Current: <span className={styles.stepPill}>{activeStep.label}</span>
            </div>
          </div>

          <div className={styles.carouselWrap}>
            <div className={styles.carousel} ref={carouselRef} onWheel={onCarouselWheel}>
              {PARTS.map((p, idx) => {
                const isActive = idx === activeStepIndex;
                const chosen = selections[p.key];

                return (
                  <button
                    key={p.key}
                    data-step-index={idx}
                    className={`${styles.partCard} ${isActive ? styles.active : ""}`}
                    onClick={() => {
                      // CPU no longer opens modal on click
                      if (p.key === "cpu") return goToStep(0);
                      return goToStep(idx);
                    }}
                  >
                    {p.image ? (
                    <div className={styles.partImageWrap}>
                      <img className={styles.partImage} src={p.image} alt={p.label} />
                    </div>
                  ) : null}

                    <div className={styles.partTop}>
                      <div className={styles.partLabel}>{p.label}</div>
                      <div className={`${styles.miniStatus} ${chosen ? styles.ok : ""}`}>
                        {chosen ? "Selected" : "Choose"}
                      </div>
                    </div>

                    <div className={styles.partBody}>
                      <div className={styles.partName}>
                        {chosen ? chosen.name : "Click to select"}
                      </div>
                      <div className={styles.partMeta}>
                        {chosen ? formatLKR(chosen.price) : ""}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Dots */}
            <div className={styles.dots}>
              {PARTS.map((p, i) => (
                <button
                  key={p.key}
                  className={`${styles.dot} ${i === activeStepIndex ? styles.on : ""}`}
                  onClick={() => {
                    if (p.key === "cpu") return goToStep(0);
                    return goToStep(i);
                  }}
                  aria-label={`Go to ${p.label}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Main 2-column area */}
        <section className={styles.grid2}>
          {/* Left column */}
          <div className={`${styles.card} ${needsSelection ? styles.cardHighlight : ""}`}>
            <div className={styles.cardTop}>
              <h3 className={styles.cardTitle}>{activeStep.label} Options</h3>

              <div className={styles.filters}>
                <div className={styles.seg}>
                  <button className={filterStock === "all" ? styles.on : ""} onClick={() => setFilterStock("all")}>All</button>
                  <button className={filterStock === "in" ? styles.on : ""} onClick={() => setFilterStock("in")}>In</button>
                  <button className={filterStock === "out" ? styles.on : ""} onClick={() => setFilterStock("out")}>Out</button>
                  <button className={filterStock === "pre" ? styles.on : ""} onClick={() => setFilterStock("pre")}>Pre</button>
                </div>

                <input
                  className={styles.search}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search parts..."
                />
              </div>
            </div>

            {/* ✅ CPU step behavior exactly */}
            {activeStep.key === "cpu" && !cpuBrandSelected ? (
              <div className={styles.emptyCpu}>
                <div className={styles.emptyCpuBox}>
                  <div className={styles.bigText}>Choose your processor type</div>
                  <div className={styles.muted}>Select AMD or Intel to begin.</div>
                  <button className={styles.primaryBtn} onClick={openCpuBrandModal}>
                    Select AMD / Intel
                  </button>
                </div>
              </div>
            ) : (
              <div className={`${styles.list} ${listFlash ? styles.listFlash : ""}`}>
                {itemsForLeft.length === 0 ? (
                  <div className={styles.emptyState}>
                    No items found. Try changing filters or search.
                  </div>
                ) : (
                  itemsForLeft.map((it) => {
                    const b = stockBadge(it.stock);
                    return (
                      <div
                        key={it.id}
                        role="button"
                        tabIndex={it.stock === "out" ? -1 : 0}
                        aria-disabled={it.stock === "out"}
                        className={`${styles.listRow} ${selections[activeStep.key]?.id === it.id ? styles.selectedRow : ""} ${it.stock === "out" ? styles.rowDisabled : ""}`}
                        title={it.stock === "out" ? "Out of stock" : "Select"}
                        onClick={() => {
                          if (it.stock === "out") return;
                          setSelection(activeStep.key, it);
                        }}
                        onKeyDown={(e) => {
                          if (it.stock === "out") return;
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelection(activeStep.key, it);
                          }
                        }}
                      >
                        
                        <div className={styles.rowLeft}>
                          {it.image ? (
                          <img className={styles.modelThumb} src={it.image} alt={it.name} />
                        ) : null}
                          <div>
                            <div className={styles.rowName}>{it.name}</div>
                            <div className={styles.rowSub}>
                              {it.socket ? `Socket: ${it.socket}` : it.type ? `Type: ${it.type}` : it.watt ? `Watt: ${it.watt}W` : ""}
                            </div>
                          </div>
                        </div>
                        <div className={styles.rowRight}>
                          <div className={styles.rowMeta}>
                            <div className={b.cls}>{b.text}</div>
                            <div className={styles.rowPrice}>{formatLKR(it.price)}</div>
                            <button
                              type="button"
                              className={styles.detailsBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                openDetails(it);
                              }}
                            >
                              View details
                            </button>
                          </div>
                        </div>
                        
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Right column: summary */}
          <div className={styles.card}>
            <div className={styles.cardTop}>
              <h3 className={styles.cardTitle}>Selected Parts</h3>
              <div className={styles.miniNote}>Auto moves to next step after selection</div>
            </div>

            <div className={styles.summaryList}>
              {PARTS.map((p) => {
                const item = selections[p.key];
                return (
                  <div key={p.key} className={`${styles.sumRow} ${item ? "" : styles.dim}`}>
                    <div className={styles.sumLeft}>
                      <div className={styles.sumLabel}>{p.label}</div>
                      <div className={styles.sumName}>{item ? item.name : "Not selected"}</div>
                    </div>

                    <div className={styles.sumRight}>
                      {item ? (
                        <>
                          <div className={styles.qty}>
                            <button
                              onClick={() =>
                                setQtyByKey((prev) => ({
                                  ...prev,
                                  [p.key]: Math.max(1, (prev[p.key] || 1) - 1),
                                }))
                              }
                            >
                              −
                            </button>
                            <span>{qtyByKey[p.key] || 1}</span>
                            <button
                              onClick={() =>
                                setQtyByKey((prev) => ({
                                  ...prev,
                                  [p.key]: (prev[p.key] || 1) + 1,
                                }))
                              }
                            >
                              +
                            </button>
                          </div>
                          <div className={styles.sumPrice}>{formatLKR(item.price * (qtyByKey[p.key] || 1))}</div>
                        </>
                      ) : (
                        <button
                          className={`${styles.ghostBtn} ${styles.small}`}
                          onClick={() => {
                            const idx = PARTS.findIndex((x) => x.key === p.key);
                            if (p.key === "cpu") {
                              goToStep(0);
                              if (!cpuBrandSelected) openCpuBrandModal();
                            } else {
                              goToStep(Math.max(0, idx));
                            }
                          }}
                        >
                          Select
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* AI Assistant section */}
        <section className={`${styles.card} ${styles.aiCard}`}>
          <div className={styles.cardTop}>
            <h2 className={styles.cardTitle}>AI PC Builder Assistant</h2>
            <div className={styles.miniNote}>Scroll here after selecting parts to get suggestions</div>
          </div>

          <div className={styles.aiGrid}>
            <div className={styles.aiSuggestion}>
              <div className={styles.aiTitle}>AI Suggestion Note</div>
              <pre className={styles.aiBox}>{aiSuggestionText()}</pre>
            </div>

            <div className={styles.aiAsk}>
              <div className={styles.aiTitle}>Ask a Question</div>
              <div className={styles.askRow}>
                <input
                  className={styles.askInput}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., Will this build bottleneck at 1440p gaming?"
                />
                <button className={styles.primaryBtn} onClick={askAI}>Ask</button>
              </div>

              <div className={styles.aiAnswer}>
                <div className={styles.aiTitle}>Answer</div>
                <div className={styles.answerBox}>
                  {aiAnswer ? <pre className={styles.answerText}>{aiAnswer}</pre> : <span className={styles.muted}>AI answer will appear here.</span>}
                </div>
              </div>

              <div className={styles.finalRow}>
                <button
                  className={styles.primaryBtn}
                  onClick={() => {
                    const payload = { selections, qtyByKey };
                    sessionStorage.setItem("gigahz_checkout", JSON.stringify(payload));
                    navigate("/checkout", { state: payload });
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ✅ CPU Modal (ONLY AMD/Intel buttons) */}
        {cpuModalOpen && (
          <div className={styles.modalBack} onMouseDown={() => setCpuModalOpen(false)}>
            <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
              <div className={styles.modalTop}>
                <div>
                  <div className={styles.modalTitle}>Processor Selection</div>
                  <div className={styles.muted}>Select AMD or Intel</div>
                </div>
                <button className={styles.xBtn} onClick={() => setCpuModalOpen(false)}>✕</button>
              </div>

              <div className={styles.brandPick}>
                <button className={styles.on} onClick={() => chooseCpuBrand("AMD")}>AMD</button>
                <button className={styles.on} onClick={() => chooseCpuBrand("Intel")}>Intel</button>
              </div>

              <div className={styles.modalBottom}>
                <button className={styles.ghostBtn} onClick={() => setCpuModalOpen(false)}>Cancel</button>
                <div className={styles.muted}>After choosing type → CPU models appear on the left.</div>
              </div>
            </div>
          </div>
        )}


        {detailsOpen && detailsItem && (
          <div className={styles.modalBack} onMouseDown={closeDetails}>
            <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
              <div className={styles.modalTop}>
                <div>
                  <div className={styles.modalTitle}>{detailsItem.name}</div>
                  <div className={styles.muted}>View details</div>
                </div>
                <button type="button" className={styles.xBtn} onClick={closeDetails}>✕</button>
              </div>

              <div className={styles.detailsBody}>
                <div className={styles.detailsGrid}>
                  {(() => {
                    const pairs = [];
                    const add = (label, value) => {
                      if (value === undefined || value === null || value === "") return;
                      pairs.push({ label, value: String(value) });
                    };

                    const stockText =
                      detailsItem.stock === "in"
                        ? "In stock"
                        : detailsItem.stock === "out"
                        ? "Out of stock"
                        : detailsItem.stock === "pre"
                        ? "Pre-order"
                        : detailsItem.stock;

                    add("Stock", stockText);
                    add("Brand", detailsItem.brand);
                    add("Socket", detailsItem.socket);
                    add("Type", detailsItem.type);
                    add("Watt", detailsItem.watt ? `${detailsItem.watt}W` : "");
                    return pairs;
                  })().map((p) => (
                    <div key={p.label} className={styles.detailRow}>
                      <div className={styles.detailLabel}>{p.label}</div>
                      <div className={styles.detailValue}>{p.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.modalBottom}>
                <div className={styles.muted}>
                  Price: <span className={styles.detailsPrice}>{formatLKR(detailsItem.price)}</span>
                </div>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={() => {
                    if (detailsItem.stock === "out") return;
                    setSelection(activeStep.key, detailsItem);
                    closeDetails();
                  }}
                  disabled={detailsItem.stock === "out"}
                  title={detailsItem.stock === "out" ? "Out of stock" : "Select this item"}
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
