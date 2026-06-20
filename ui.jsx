/* ===== 血統くん refined — 共有UIコンポーネント ===== */

/* 印の色 */
const markColor = (m) =>
  m === "◎" ? "var(--gold-bright)" :
  m === "○" ? "var(--gold)" :
  m === "▲" ? "#cf9a5a" :
  m === "★" ? "var(--pos)" :
  m === "⚠" ? "var(--neg)" : "var(--txt3)";

/* 枠番色チップ（馬番入り） */
const FrameChip = ({ frame, num, size = 30 }) => {
  const f = window.KB.FRAME[frame] || window.KB.FRAME[1];
  return (
    <span style={{
      width: size, height: size, borderRadius: "var(--chip-r)", background: f.bg, color: f.tx,
      border: `1px solid ${f.b}`, display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--num)", fontSize: size * 0.52, fontWeight: 400, flexShrink: 0, letterSpacing: ".5px",
    }}>{num}</span>
  );
};

/* 印（◎○▲）ゴールドリング付き */
const Mark = ({ mark, size = 26 }) => {
  if (!mark) return <span style={{ width: size, display: "inline-block" }} />;
  const c = markColor(mark);
  const strong = mark === "◎" || mark === "○";
  return (
    <span style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.62, color: c, fontWeight: 700,
      border: strong ? `1.5px solid ${c}` : "1.5px solid transparent",
      background: mark === "◎" ? "var(--gold-soft)" : "transparent",
    }}>{mark}</span>
  );
};

/* 充填バー */
const GoldBar = ({ value, max = 100, color = "var(--gold-grad)", h = 7, track = "rgba(255,255,255,0.07)" }) => (
  <div style={{ flex: 1, height: h, borderRadius: h, background: track, overflow: "hidden" }}>
    <div style={{ width: `${Math.max(0, Math.min(100, (value / max) * 100))}%`, height: "100%", borderRadius: h, background: color, transition: "width .6s cubic-bezier(.2,.8,.2,1)" }} />
  </div>
);

/* 汎用ピル */
const Pill = ({ children, kind = "default", style = {} }) => {
  const map = {
    default: { bg: "var(--surface2)", c: "var(--txt2)", b: "var(--line2)" },
    gold: { bg: "var(--gold-soft)", c: "var(--gold-bright)", b: "var(--line)" },
    pos: { bg: "var(--pos-bg)", c: "var(--pos)", b: "transparent" },
    neg: { bg: "var(--neg-bg)", c: "var(--neg)", b: "transparent" },
    ghost: { bg: "transparent", c: "var(--txt3)", b: "var(--line2)" },
  };
  const s = map[kind] || map.default;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 20,
      fontSize: 10.5, fontWeight: 600, background: s.bg, color: s.c, border: `1px solid ${s.b}`,
      whiteSpace: "nowrap", lineHeight: 1.5, ...style,
    }}>{children}</span>
  );
};

/* 脚質タグ */
const StyleTag = ({ style: st }) => {
  const c = st === "逃げ" ? "#e08474" : st === "先行" ? "var(--gold)" : st === "差し" ? "#7aa8d8" : "var(--pos)";
  return <span style={{ fontSize: 10.5, fontWeight: 700, color: c }}>{st}</span>;
};

/* セクション見出し（和文＋欧文ラベル） */
const SectionTitle = ({ jp, en, right, icon }) => (
  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 12 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      {icon && <span style={{ fontSize: 17 }}>{icon}</span>}
      <div>
        {en && <div style={{ fontFamily: "var(--num)", fontSize: 11, letterSpacing: "2.5px", color: "var(--gold)", lineHeight: 1 }}>{en}</div>}
        <div style={{ fontFamily: "var(--display)", fontSize: 18, fontWeight: 700, color: "var(--txt)", letterSpacing: ".5px", marginTop: 3 }}>{jp}</div>
      </div>
    </div>
    {right}
  </div>
);

/* グレードバッジ */
const GradeBadge = ({ grade, small }) => {
  const c = grade === "G1" ? "var(--gold-grad)" : grade === "G2" ? "linear-gradient(135deg,#d8d2c4,#9a948a)" : grade === "G3" ? "linear-gradient(135deg,#c8a07a,#9a6f4a)" : "linear-gradient(135deg,#cdd6dd,#8a98a4)";
  return (
    <span style={{
      fontFamily: "var(--num)", fontSize: small ? 11 : 13, letterSpacing: "1px", fontWeight: 400,
      padding: small ? "1px 7px" : "2px 9px", borderRadius: 3, background: c, color: "#15120a",
    }}>{grade}</span>
  );
};

/* カード */
const Card = ({ children, style = {}, pad = 14, onClick, active }) => (
  <div onClick={onClick} style={{
    background: "var(--surface)", border: `1px solid ${active ? "var(--line)" : "var(--line2)"}`,
    borderRadius: "var(--radius)", padding: pad, cursor: onClick ? "pointer" : "default",
    backdropFilter: "var(--glass,0)" ? "blur(14px)" : "none",
    WebkitBackdropFilter: "blur(14px)",
    transition: "border-color .2s, transform .15s", ...style,
  }}>{children}</div>
);

/* ===== ヘッダー ===== */
const Header = ({ title, sub, onBack, right }) => (
  <header style={{
    position: "sticky", top: 0, zIndex: 40, background: "color-mix(in srgb, var(--bg) 86%, transparent)",
    backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
    borderBottom: "1px solid var(--line)", padding: "11px 16px 10px",
    display: "flex", alignItems: "center", gap: 12,
  }}>
    {onBack ? (
      <button onClick={onBack} style={{ background: "none", border: "none", color: "var(--gold)", fontSize: 22, cursor: "pointer", padding: 0, lineHeight: 1, width: 24 }}>‹</button>
    ) : (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 7, background: "var(--gold-grad)", flexShrink: 0 }}>
        <span style={{ fontSize: 17 }}>🐎</span>
      </div>
    )}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        fontFamily: "var(--display)", fontSize: 20, fontWeight: 900, letterSpacing: "1px", lineHeight: 1,
        background: "var(--gold-grad)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>{title}</div>
      {sub && <div style={{ fontSize: 9.5, letterSpacing: "2px", color: "var(--txt3)", marginTop: 3, fontFamily: "var(--num)" }}>{sub}</div>}
    </div>
    {right}
  </header>
);

/* ===== ボトムナビ ===== */
const BottomNav = ({ tab, onTab }) => {
  const items = [
    { id: "home", emoji: "🏇", label: "予想" },
    { id: "win5", emoji: "🎰", label: "WIN5" },
    { id: "analysis", emoji: "📊", label: "分析" },
    { id: "db", emoji: "🧬", label: "血統DB" },
    { id: "betting", emoji: "🎯", label: "馬券" },
  ];
  return (
    <nav style={{
      position: "sticky", bottom: 0, zIndex: 40, display: "flex",
      background: "color-mix(in srgb, var(--bg) 90%, transparent)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      borderTop: "1px solid var(--line)", paddingBottom: "env(safe-area-inset-bottom)",
    }}>
      {items.map((it) => {
        const on = tab === it.id;
        return (
          <button key={it.id} onClick={() => onTab(it.id)} style={{
            flex: 1, padding: "9px 0 8px", border: "none", background: "transparent", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4, position: "relative",
          }}>
            <span style={{ fontSize: 18, filter: on ? "none" : "grayscale(1) opacity(.6)", transition: "filter .2s" }}>{it.emoji}</span>
            <span style={{ fontSize: 9.5, fontWeight: on ? 700 : 500, color: on ? "var(--gold)" : "var(--txt3)", letterSpacing: ".5px" }}>{it.label}</span>
            {on && <span style={{ position: "absolute", top: 0, width: 22, height: 2, borderRadius: 2, background: "var(--gold-grad)" }} />}
          </button>
        );
      })}
    </nav>
  );
};

Object.assign(window, { markColor, FrameChip, Mark, GoldBar, Pill, StyleTag, SectionTitle, GradeBadge, Card, Header, BottomNav });
