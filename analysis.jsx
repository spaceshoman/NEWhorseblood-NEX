/* ===== 血統くん refined — 分析チャート ===== */

const DIST = [["SPRINT", "短"], ["MILE", "マ"], ["MIDDLE", "中"], ["LONG", "長"]];
const distIdx = { SPRINT: 0, MILE: 1, MIDDLE: 2, LONG: 3 };

const AnalysisScreen = ({ t }) => {
  const [sub, setSub] = React.useState("distance");
  const tabs = [["distance", "距離適性"], ["scatter", "適性散布図"], ["line", "系統トレンド"]];
  return (
    <div>
      <Header title="血統アナリティクス" sub="ANALYTICS" />
      <div style={{ display: "flex", gap: 7, padding: "14px 14px 4px", overflowX: "auto" }}>
        {tabs.map(([id, label]) => {
          const on = sub === id;
          return (
            <button key={id} onClick={() => setSub(id)} style={{
              padding: "6px 14px", borderRadius: 20, whiteSpace: "nowrap", cursor: "pointer",
              border: `1px solid ${on ? "transparent" : "var(--line2)"}`,
              background: on ? "var(--gold-grad)" : "transparent", color: on ? "#15120a" : "var(--txt2)",
              fontSize: 12, fontWeight: 700,
            }}>{label}</button>
          );
        })}
      </div>
      <div style={{ padding: "12px 14px 28px" }}>
        {sub === "distance" && <DistanceChart rich={t.chartStyle === "rich"} />}
        {sub === "scatter" && <SurfaceScatter rich={t.chartStyle === "rich"} />}
        {sub === "line" && <LineTrend rich={t.chartStyle === "rich"} />}
      </div>
    </div>
  );
};

/* 距離適性レンジ */
const DistanceChart = ({ rich }) => {
  const { stallions } = window.KB;
  const data = [...stallions].sort((a, b) => distIdx[a.dMin] - distIdx[b.dMin] || distIdx[a.dMax] - distIdx[b.dMax]);
  const colFor = (s) => s.surface === "TURF" ? "var(--gold-grad)" : s.surface === "DIRT" ? "linear-gradient(90deg,#a87a4a,#cf9a5a)" : "linear-gradient(90deg,#8fb87a,#5fae8c)";
  return (
    <div>
      <SectionTitle jp="距離適性レンジ" en="DISTANCE RANGE" icon="📏" />
      <div style={{ display: "flex", gap: 0, marginLeft: 96, marginBottom: 6 }}>
        {DIST.map(([, l]) => <div key={l} style={{ flex: 1, textAlign: "center", fontSize: 10, color: "var(--txt3)", fontWeight: 700 }}>{l}</div>)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {data.map((s) => {
          const a = distIdx[s.dMin], b = distIdx[s.dMax];
          const left = (a / 4) * 100, width = ((b - a + 1) / 4) * 100;
          return (
            <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 92, fontSize: 11, color: "var(--txt2)", textAlign: "right", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flexShrink: 0 }}>{s.name}</span>
              <div style={{ flex: 1, position: "relative", height: 18, borderRadius: 5, background: rich ? "rgba(255,255,255,0.04)" : "transparent", border: rich ? "none" : "1px solid var(--line2)" }}>
                {rich && DIST.map((_, i) => i > 0 && <div key={i} style={{ position: "absolute", left: `${(i / 4) * 100}%`, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.04)" }} />)}
                <div style={{ position: "absolute", left: `${left}%`, width: `${width}%`, top: 3, bottom: 3, borderRadius: 4, background: colFor(s), opacity: rich ? 1 : 0.85, boxShadow: rich ? "var(--glow)" : "none" }} />
              </div>
            </div>
          );
        })}
      </div>
      <Legend items={[["芝", "var(--gold)"], ["ダート", "#cf9a5a"], ["兼用", "#5fae8c"]]} />
    </div>
  );
};

/* 適性散布図（スピード×スタミナ） */
const SurfaceScatter = ({ rich }) => {
  const { stallions, lineColors } = window.KB;
  const W = 320, H = 300, pad = 38;
  const sx = (v) => pad + (v / 10) * (W - pad - 14);
  const sy = (v) => H - pad - (v / 10) * (H - pad - 14);
  return (
    <div>
      <SectionTitle jp="適性散布図" en="SPEED × STAMINA" icon="🎯" />
      <div style={{ background: rich ? "var(--surface)" : "transparent", border: "1px solid var(--line2)", borderRadius: "var(--radius)", padding: 8 }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
          {/* grid */}
          {rich && [2, 4, 6, 8].map((g) => (
            <g key={g}>
              <line x1={sx(g)} y1={pad - 8} x2={sx(g)} y2={H - pad} stroke="rgba(255,255,255,0.05)" />
              <line x1={pad} y1={sy(g)} x2={W - 14} y2={sy(g)} stroke="rgba(255,255,255,0.05)" />
            </g>
          ))}
          {/* axes */}
          <line x1={pad} y1={H - pad} x2={W - 14} y2={H - pad} stroke="var(--line)" />
          <line x1={pad} y1={pad - 8} x2={pad} y2={H - pad} stroke="var(--line)" />
          <text x={W - 10} y={H - pad + 4} fill="var(--txt3)" fontSize="10" textAnchor="end">速い→</text>
          <text x={pad - 8} y={pad - 12} fill="var(--txt3)" fontSize="10">↑スタミナ</text>
          {stallions.map((s, i) => {
            const c = lineColors[s.line] || "var(--gold)";
            const rr = 4 + s.pow * 0.6;
            const above = i % 2 === 0;
            return (
              <g key={s.name}>
                <circle cx={sx(s.spd)} cy={sy(s.sta)} r={rr} fill={c} fillOpacity={rich ? 0.85 : 0.25} stroke={c} strokeWidth={1.2} />
                <text x={sx(s.spd)} y={sy(s.sta) + (above ? -rr - 3 : rr + 9)} fill="var(--txt2)" fontSize="8" textAnchor="middle" stroke="var(--bg)" strokeWidth="2.4" paintOrder="stroke" style={{ fontWeight: 600 }}>{s.name.slice(0, 5)}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <Legend items={Object.entries(window.KB.lineColors).map(([k, v]) => [k, v])} />
      <div style={{ fontSize: 9.5, color: "var(--txt3)", marginTop: 8, lineHeight: 1.6 }}>円の大きさ ＝ パワー。右上ほどスピード・スタミナを高水準で兼備。</div>
    </div>
  );
};

/* 系統トレンド */
const LineTrend = ({ rich }) => {
  const { stallions, lineColors } = window.KB;
  const counts = {};
  stallions.forEach((s) => (counts[s.line] = (counts[s.line] || 0) + 1));
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...entries.map((e) => e[1]));
  return (
    <div>
      <SectionTitle jp="サイアーライン分布" en="SIRE LINE" icon="🌳" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {entries.map(([line, n]) => (
          <div key={line}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--txt)" }}>{line}</span>
              <span style={{ fontFamily: "var(--num)", fontSize: 15, color: lineColors[line] }}>{n}<span style={{ fontSize: 9, color: "var(--txt3)" }}> 頭</span></span>
            </div>
            <div style={{ height: 12, borderRadius: 6, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
              <div style={{ width: `${(n / max) * 100}%`, height: "100%", borderRadius: 6, background: rich ? `linear-gradient(90deg, ${lineColors[line]}aa, ${lineColors[line]})` : lineColors[line], opacity: rich ? 1 : 0.7 }} />
            </div>
            <div style={{ fontSize: 9.5, color: "var(--txt3)", marginTop: 5 }}>
              {stallions.filter((s) => s.line === line).map((s) => s.name).join("・")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Legend = ({ items }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12, justifyContent: "center" }}>
    {items.map(([l, c]) => (
      <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ width: 9, height: 9, borderRadius: 3, background: c }} />
        <span style={{ fontSize: 10, color: "var(--txt2)" }}>{l}</span>
      </div>
    ))}
  </div>
);

Object.assign(window, { AnalysisScreen, DistanceChart, SurfaceScatter, LineTrend, Legend });
