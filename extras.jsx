/* ===== 血統くん refined — 血統DB + 馬券計算（軽量版） ===== */

/* ========== 血統DB ========== */
const DBScreen = () => {
  const { stallions, lineColors } = window.KB;
  const [q, setQ] = React.useState("");
  const list = stallions.filter((s) => !q || s.name.includes(q) || s.line.includes(q));
  const surfLabel = { TURF: "芝", DIRT: "ダート", BOTH: "芝・ダ" };
  const dLabel = { SPRINT: "短", MILE: "マ", MIDDLE: "中", LONG: "長" };
  return (
    <div>
      <Header title="血統データベース" sub={`STALLIONS · 157`} />
      <div style={{ padding: "14px 14px 0" }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="種牡馬・系統で検索…" style={{
          width: "100%", padding: "11px 14px", borderRadius: "var(--radius)", border: "1px solid var(--line2)",
          background: "var(--surface)", color: "var(--txt)", fontSize: 13, boxSizing: "border-box", outline: "none",
        }} />
      </div>
      <div style={{ padding: "12px 14px 28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
        {list.map((s) => (
          <div key={s.name} style={{ background: "var(--surface)", border: "1px solid var(--line2)", borderRadius: "var(--radius)", padding: "12px 12px 13px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 3, background: lineColors[s.line], flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--txt)", fontFamily: "var(--display)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</span>
            </div>
            <div style={{ fontSize: 9, color: "var(--txt3)", marginTop: 3 }}>{s.line}</div>
            <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
              <Pill kind="gold" style={{ fontSize: 9 }}>{surfLabel[s.surface]}</Pill>
              <Pill kind="ghost" style={{ fontSize: 9 }}>{dLabel[s.dMin]}〜{dLabel[s.dMax]}</Pill>
            </div>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 5 }}>
              {[["スピード", s.spd], ["スタミナ", s.sta], ["パワー", s.pow]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 40, fontSize: 8.5, color: "var(--txt3)", flexShrink: 0 }}>{k}</span>
                  <GoldBar value={v} max={10} h={5} />
                  <span style={{ fontFamily: "var(--num)", fontSize: 11, color: "var(--txt2)", width: 14, textAlign: "right" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ========== 馬券計算 ========== */
const BETS = {
  umaren: { label: "馬連", min: 2, combos: (n) => (n * (n - 1)) / 2 },
  wide: { label: "ワイド", min: 2, combos: (n) => (n * (n - 1)) / 2 },
  sanpuku: { label: "3連複", min: 3, combos: (n) => (n * (n - 1) * (n - 2)) / 6 },
  santan: { label: "3連単", min: 3, combos: (n) => n * (n - 1) * (n - 2) },
};

const BettingScreen = () => {
  const { overall, byNum } = window.KB;
  const picks = overall.slice(0, 7);
  const [type, setType] = React.useState("sanpuku");
  const [sel, setSel] = React.useState(picks.slice(0, 5).map((o) => o.num));
  const [unit, setUnit] = React.useState(100);
  const bet = BETS[type];
  const toggle = (num) => setSel((s) => s.includes(num) ? s.filter((x) => x !== num) : [...s, num]);
  const combos = sel.length >= bet.min ? Math.round(bet.combos(sel.length)) : 0;
  const total = combos * unit;

  return (
    <div>
      <Header title="馬券計算" sub="TICKET CALCULATOR" />
      <div style={{ padding: "14px 14px 0" }}>
        <div style={{ fontSize: 11, color: "var(--txt3)", marginBottom: 8, letterSpacing: "1px" }}>{window.KB.race.short} ・ AI診断の上位から選択</div>
        {/* 券種 */}
        <div style={{ display: "flex", gap: 5, marginBottom: 14 }}>
          {Object.entries(BETS).map(([id, b]) => {
            const on = type === id;
            return (
              <button key={id} onClick={() => setType(id)} style={{
                flex: 1, padding: "8px 0", borderRadius: "var(--radius)", cursor: "pointer",
                border: `1px solid ${on ? "transparent" : "var(--line2)"}`,
                background: on ? "var(--gold-grad)" : "var(--surface)", color: on ? "#15120a" : "var(--txt2)",
                fontSize: 12, fontWeight: 700,
              }}>{b.label}</button>
            );
          })}
        </div>
      </div>

      {/* 馬選択 */}
      <div style={{ padding: "0 14px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--txt2)", marginBottom: 8 }}>BOX対象を選択（{sel.length}頭）</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {picks.map((o) => {
            const r = byNum[o.num];
            const on = sel.includes(o.num);
            return (
              <div key={o.num} onClick={() => toggle(o.num)} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: "var(--radius)", cursor: "pointer",
                background: on ? "var(--gold-soft)" : "var(--surface)", border: `1px solid ${on ? "var(--line)" : "var(--line2)"}`,
              }}>
                <Mark mark={o.mark} size={20} />
                <FrameChip frame={r.frame} num={r.num} size={22} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: on ? "var(--txt)" : "var(--txt2)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</span>
                <span style={{ fontFamily: "var(--num)", fontSize: 15, color: "var(--gold)" }}>{o.total}</span>
                <span style={{ width: 20, height: 20, borderRadius: "50%", border: `1.5px solid ${on ? "var(--gold)" : "var(--txt3)"}`, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#15120a", background: on ? "var(--gold-grad)" : "transparent", fontSize: 12, flexShrink: 0 }}>{on ? "✓" : ""}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 金額 */}
      <div style={{ padding: "16px 14px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--txt2)" }}>1点あたり</span>
          <div style={{ display: "flex", gap: 5, marginLeft: "auto" }}>
            {[100, 200, 500, 1000].map((u) => {
              const on = unit === u;
              return (
                <button key={u} onClick={() => setUnit(u)} style={{
                  padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontFamily: "var(--num)", fontSize: 13,
                  border: `1px solid ${on ? "transparent" : "var(--line2)"}`, background: on ? "var(--gold-grad)" : "var(--surface)", color: on ? "#15120a" : "var(--txt2)",
                }}>{u}</button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 合計 */}
      <div style={{ margin: "8px 14px 28px", borderRadius: "var(--radius-lg)", background: "var(--hero)", border: "1px solid var(--line)", boxShadow: "var(--glow)", padding: "16px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, color: "var(--txt3)", letterSpacing: "1px" }}>{bet.label} BOX · {sel.length}頭</div>
            <div style={{ fontFamily: "var(--num)", fontSize: 18, color: "var(--gold)", marginTop: 2 }}>{combos} 点</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "var(--txt3)", letterSpacing: "1px" }}>合計購入額</div>
            <div style={{ fontFamily: "var(--num)", fontSize: 32, color: "var(--gold-bright)", lineHeight: 1.1 }}>¥{total.toLocaleString()}</div>
          </div>
        </div>
        {sel.length < bet.min && <div style={{ fontSize: 10.5, color: "var(--neg)", marginTop: 8 }}>※ {bet.label}は最低{bet.min}頭の選択が必要です</div>}
      </div>
    </div>
  );
};

Object.assign(window, { DBScreen, BettingScreen });
