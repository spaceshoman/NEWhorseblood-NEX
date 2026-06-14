/* ===== 血統くん refined — AI診断「3つの目」+ 総合判断 ===== */

/* 3ゲージ（期待度/馬場適性/騎手相性） */
const Gauges = ({ g }) => {
  const rows = [["期待度", g.e], ["馬場適性", g.t], ["騎手相性", g.j]];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 9 }}>
      {rows.map(([k, v]) => (
        <div key={k} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 52, fontSize: 9.5, color: "var(--txt3)", textAlign: "right", flexShrink: 0 }}>{k}</span>
          <GoldBar value={v} h={6} />
          <span style={{ width: 22, fontFamily: "var(--num)", fontSize: 13, color: v >= 75 ? "var(--gold)" : "var(--txt3)", textAlign: "right" }}>{v}</span>
        </div>
      ))}
    </div>
  );
};

const ReasonChips = ({ str, weak }) => (
  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 9 }}>
    {str.map((s, i) => <Pill key={"s" + i} kind="pos">✓ {s}</Pill>)}
    {weak.map((w, i) => <Pill key={"w" + i} kind="neg">✗ {w}</Pill>)}
  </div>
);

/* ===== 「3つの目」パイプライン・ナビ ===== */
const EyeNav = ({ eye, setEye }) => {
  const eyes = [
    { id: "blood", n: "①", icon: "🧬", label: "血統" },
    { id: "bias", n: "②", icon: "🏟️", label: "馬場傾向" },
    { id: "sim", n: "③", icon: "🎲", label: "1000回" },
  ];
  return (
    <div style={{ margin: "16px 14px 0" }}>
      <div style={{ display: "flex", alignItems: "stretch", gap: 6 }}>
        {eyes.map((e) => {
          const on = eye === e.id;
          return (
            <button key={e.id} onClick={() => setEye(e.id)} style={{
              flex: 1, padding: "9px 4px 8px", borderRadius: "var(--radius)", cursor: "pointer",
              border: `1px solid ${on ? "var(--line)" : "var(--line2)"}`,
              background: on ? "var(--gold-soft)" : "var(--surface)", textAlign: "center", transition: "all .2s",
            }}>
              <div style={{ fontSize: 15, filter: on ? "none" : "grayscale(.5) opacity(.7)" }}>{e.icon}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: on ? "var(--gold-bright)" : "var(--txt2)", marginTop: 3 }}>
                <span style={{ fontFamily: "var(--num)" }}>{e.n}</span> {e.label}
              </div>
            </button>
          );
        })}
        <div style={{ display: "flex", alignItems: "center", color: "var(--txt3)", fontSize: 16 }}>⇒</div>
        <button onClick={() => setEye("total")} style={{
          flex: 1.05, padding: "9px 4px 8px", borderRadius: "var(--radius)", cursor: "pointer",
          border: `1px solid ${eye === "total" ? "transparent" : "var(--line)"}`,
          background: eye === "total" ? "var(--gold-grad)" : "var(--gold-soft)", textAlign: "center",
          boxShadow: eye === "total" ? "var(--glow)" : "none", transition: "all .2s",
        }}>
          <div style={{ fontSize: 15 }}>⚖️</div>
          <div style={{ fontSize: 10.5, fontWeight: 800, color: eye === "total" ? "#15120a" : "var(--gold-bright)", marginTop: 3 }}>総合判断</div>
        </button>
      </div>
    </div>
  );
};

const Diagnosis = ({ t }) => {
  const [eye, setEye] = React.useState("total");
  return (
    <div>
      <EyeNav eye={eye} setEye={setEye} />
      <div style={{ padding: "16px 14px 28px" }}>
        {eye === "total" && <OverallPanel setEye={setEye} />}
        {eye === "blood" && <BloodPanel layout={t.diagLayout} />}
        {eye === "bias" && <BiasPanel />}
        {eye === "sim" && <SimPanel chartStyle={t.chartStyle} />}
      </div>
    </div>
  );
};

/* ===== ⚖ 総合判断 ===== */
const OverallPanel = ({ setEye }) => {
  const { overall, strategy, byNum, diagByNum } = window.KB;
  const m = (num) => byNum[num];
  return (
    <div>
      {/* 結論ヘッダー */}
      <div style={{ borderRadius: "var(--radius-lg)", padding: "16px 16px 14px", background: "var(--hero)", border: "1px solid var(--line)", boxShadow: "var(--glow)", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 17 }}>⚖️</span>
          <span style={{ fontFamily: "var(--num)", fontSize: 12, letterSpacing: "2.5px", color: "var(--gold)" }}>FINAL VERDICT</span>
          <span style={{ marginLeft: "auto", fontSize: 9.5, color: "var(--txt3)" }}>3つの目を統合</span>
        </div>
        <div style={{ fontSize: 12.5, lineHeight: 1.85, color: "var(--txt)", marginTop: 10, textWrap: "pretty" }}>{strategy.verdict}</div>
        {/* 結論の印 */}
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {overall.slice(0, 3).map((o) => (
            <div key={o.num} style={{ flex: 1, display: "flex", alignItems: "center", gap: 7, padding: "8px 9px", borderRadius: "var(--radius)", background: "color-mix(in srgb, var(--surface) 70%, transparent)", border: "1px solid var(--line2)" }}>
              <Mark mark={o.mark} size={22} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--txt)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m(o.num).name}</div>
                <div style={{ fontFamily: "var(--num)", fontSize: 13, color: scoreTierColor(o.total) }}>{o.total}<span style={{ fontSize: 9, color: "var(--txt3)" }}> pt</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 買い目戦略 */}
      <SectionTitle jp="買い目戦略" en="STRATEGY" icon="🎯" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
        {[strategy.axis, strategy.counter, strategy.hole, strategy.bighole].map((p, i) => {
          const r = m(p.num);
          const tone = i === 0 ? "gold" : i === 1 ? "default" : "pos";
          return (
            <div key={i} style={{ padding: "11px 12px", borderRadius: "var(--radius)", background: "var(--surface)", border: `1px solid ${i === 0 ? "var(--line)" : "var(--line2)"}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Pill kind={tone} style={{ fontSize: 9.5 }}>{p.role}</Pill>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 8 }}>
                <FrameChip frame={r.frame} num={r.num} size={26} />
                <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--txt)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</span>
              </div>
              <div style={{ fontSize: 10, color: "var(--txt2)", marginTop: 7, lineHeight: 1.6, textWrap: "pretty" }}>{p.why}</div>
            </div>
          );
        })}
      </div>

      {/* 危険な人気馬 */}
      <div style={{ borderRadius: "var(--radius)", border: "1px solid var(--neg-bg)", background: "var(--neg-bg)", padding: "12px 13px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 9 }}>
          <span style={{ fontSize: 13 }}>⚠️</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: "var(--neg)", letterSpacing: ".5px" }}>危険な人気馬</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {strategy.danger.map((d) => {
            const r = m(d.num);
            return (
              <div key={d.num} style={{ display: "flex", gap: 9 }}>
                <FrameChip frame={r.frame} num={r.num} size={24} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--txt)" }}>{r.name}</span>
                    <Pill kind="neg" style={{ fontSize: 9 }}>{r.pop}番人気</Pill>
                  </div>
                  <div style={{ fontSize: 10, color: "var(--txt2)", marginTop: 4, lineHeight: 1.6, textWrap: "pretty" }}>{d.why}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 総合ランキング */}
      <SectionTitle jp="総合ランキング" en="RANKING" icon="🏆"
        right={<div style={{ display: "flex", gap: 8, fontSize: 8.5, color: "var(--txt3)" }}>
          <span>🧬血統</span><span>🏟️馬場</span><span>🎲シミュ</span>
        </div>} />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {overall.map((o) => <OverallRow key={o.num} o={o} setEye={setEye} />)}
      </div>
    </div>
  );
};

const OverallRow = ({ o }) => {
  const r = window.KB.byNum[o.num];
  const top = o.rank <= 3;
  const segs = [["血", o.blood, "var(--gold-grad)"], ["馬", o.bias, "linear-gradient(90deg,#5fae8c,#3da57a)"], ["シ", o.sim, "linear-gradient(90deg,#7aa8d8,#4f7fc4)"]];
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: "var(--radius)",
      background: top ? "var(--surface)" : "transparent", border: `1px solid ${top ? "var(--line)" : "var(--line2)"}`,
    }}>
      <div style={{ fontFamily: "var(--num)", fontSize: 19, width: 18, textAlign: "center", color: top ? "var(--gold)" : "var(--txt3)", flexShrink: 0 }}>{o.rank}</div>
      <Mark mark={o.mark} size={22} />
      <FrameChip frame={r.frame} num={r.num} size={24} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--txt)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</span>
          {o.tag === "ana" && <Pill kind="pos" style={{ fontSize: 8.5 }}>★穴</Pill>}
          {o.tag === "over" && <Pill kind="neg" style={{ fontSize: 8.5 }}>人気先行</Pill>}
        </div>
        {/* 3つの目 内訳バー */}
        <div style={{ display: "flex", gap: 6, marginTop: 5 }}>
          {segs.map(([lab, v, col]) => (
            <div key={lab} style={{ flex: 1, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 8, color: "var(--txt3)", width: 8, flexShrink: 0 }}>{lab}</span>
              <GoldBar value={v} h={4} color={col} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0, width: 42 }}>
        <div style={{ fontFamily: "var(--num)", fontSize: 22, color: scoreTierColor(o.total), lineHeight: 1 }}>{o.total}</div>
        <div style={{ fontSize: 8, color: "var(--txt3)", marginTop: 1 }}>信頼{o.conf}</div>
      </div>
    </div>
  );
};

Object.assign(window, { Diagnosis, Gauges, ReasonChips, OverallPanel, OverallRow, EyeNav });
