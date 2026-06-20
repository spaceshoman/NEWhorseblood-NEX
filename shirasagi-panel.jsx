/* ===== 血統くん refined — しらさぎS 表示パネル ===== */

/* ===== 全体ラッパ（RaceDetailから呼ばれる） ===== */
const ShirasagiRaceDetail = ({ onBack }) => {
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    if (window.KB_SHIRASAGI && window.KB_SHIRASAGI.ready) return;
    const onLoad = () => force();
    document.addEventListener("kb-shirasagi-loaded", onLoad);
    return () => document.removeEventListener("kb-shirasagi-loaded", onLoad);
  }, []);

  const K = window.KB_SHIRASAGI;
  if (!K || !K.ready) {
    return (
      <div>
        <Header title="しらさぎS" sub="LOADING" onBack={onBack} />
        <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--txt3)" }}>
          データ読み込み中… {K && K.error ? <div style={{ color: "var(--neg)", fontSize: 11, marginTop: 8 }}>{K.error}</div> : null}
        </div>
      </div>
    );
  }

  const [view, setView] = React.useState("diag"); // diag | list

  return (
    <div>
      <Header title={K.race.short} sub={K.race.en} onBack={onBack} />

      {/* レースメタ */}
      <div style={{ padding: "14px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <GradeBadge grade={K.race.grade} />
          <span style={{ fontFamily: "var(--display)", fontSize: 20, fontWeight: 900, color: "var(--txt)", letterSpacing: ".5px" }}>{K.race.emoji} {K.race.name}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {[`${K.race.date}（${K.race.dow}）`, K.race.venue, K.race.course, `馬場 ${K.race.track}`, `${K.race.field}頭`].map((x) => (
            <Pill key={x} kind="ghost">{x}</Pill>
          ))}
        </div>
      </div>

      {/* ビュー切替 */}
      <div style={{ display: "flex", gap: 4, margin: "16px 16px 0", padding: 3, background: "var(--surface)", border: "1px solid var(--line2)", borderRadius: "var(--radius)" }}>
        {[["diag", "🔮 AI血統診断"], ["list", "📋 出馬表"]].map(([id, label]) => {
          const on = view === id;
          return (
            <button key={id} onClick={() => setView(id)} style={{
              flex: 1, padding: "10px 0", border: "none", borderRadius: "calc(var(--radius) - 3px)", cursor: "pointer",
              fontFamily: "var(--display)", fontWeight: 700, fontSize: 13,
              background: on ? "var(--gold-grad)" : "transparent", color: on ? "#15120a" : "var(--txt2)",
              boxShadow: on ? "var(--glow)" : "none", transition: "all .2s",
            }}>{label}</button>
          );
        })}
      </div>

      {view === "list" ? <ShirasagiEntries /> : <ShirasagiDiagnosis />}
    </div>
  );
};

/* ===== AI診断（3つの目＋総合判断） ===== */
const ShirasagiDiagnosis = () => {
  const [eye, setEye] = React.useState("total");
  return (
    <div>
      <ShirasagiEyeNav eye={eye} setEye={setEye} />
      <div style={{ padding: "16px 14px 28px" }}>
        {eye === "total" && <ShirasagiOverall />}
        {eye === "blood" && <ShirasagiBlood />}
        {eye === "bias" && <ShirasagiBias />}
        {eye === "sim" && <ShirasagiSim />}
      </div>
    </div>
  );
};

const ShirasagiEyeNav = ({ eye, setEye }) => {
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

/* ===== ⚖ 総合判断 ===== */
const ShirasagiOverall = () => {
  const K = window.KB_SHIRASAGI;
  const { overall, strategy, byNum, markMap } = K;
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
        {[strategy.axis, strategy.counter, strategy.hole, strategy.bighole].filter(Boolean).map((p, i) => {
          const r = m(p.num);
          const tone = i === 0 ? "gold" : i === 1 ? "default" : "pos";
          return (
            <div key={i} style={{ padding: "11px 12px", borderRadius: "var(--radius)", background: "var(--surface)", border: `1px solid ${i === 0 ? "var(--line)" : "var(--line2)"}` }}>
              <Pill kind={tone} style={{ fontSize: 9.5 }}>{p.role}</Pill>
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
        {overall.map((o) => <ShirasagiOverallRow key={o.num} o={o} />)}
      </div>
    </div>
  );
};

const ShirasagiOverallRow = ({ o }) => {
  const r = window.KB_SHIRASAGI.byNum[o.num];
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
          {o.tag === "ana" && <Pill kind="pos" style={{ fontSize: 8.5 }}>★穴推奨</Pill>}
          {o.tag === "over" && <Pill kind="neg" style={{ fontSize: 8.5 }}>危険馬</Pill>}
        </div>
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

/* ===== ① 血統 ===== */
const ShirasagiBlood = () => {
  const K = window.KB_SHIRASAGI;
  const trends = K.trends || {};
  const items = trends.blood || [];
  return (
    <div>
      <SectionTitle jp="① 血統の目" en="BLOODLINE" icon="🧬" />
      <Card pad={14}>
        <div style={{ fontSize: 12.5, lineHeight: 1.85, color: "var(--txt2)", textWrap: "pretty" }}>{trends.bloodTip || "—"}</div>
      </Card>
      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((it, i) => (
          <div key={i} style={{
            padding: "11px 13px", borderRadius: "var(--radius)",
            background: it.hl ? "var(--gold-soft)" : "var(--surface)",
            border: `1px solid ${it.hl ? "var(--line)" : "var(--line2)"}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {it.hl && <span style={{ fontSize: 11 }}>★</span>}
              <span style={{ fontSize: 12.5, fontWeight: 700, color: it.hl ? "var(--gold-bright)" : "var(--txt)" }}>{it.label}</span>
            </div>
            <div style={{ fontSize: 11, color: "var(--txt2)", marginTop: 5, lineHeight: 1.6 }}>{it.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ===== ② 馬場傾向（前日分析） ===== */
const ShirasagiBias = () => {
  const K = window.KB_SHIRASAGI;
  const p = K.prevDayAnalysis || {};
  return (
    <div>
      <SectionTitle jp="② 馬場傾向" en="TRACK BIAS" icon="🏟️" />
      <div style={{ borderRadius: "var(--radius-lg)", padding: "14px 15px", background: "var(--hero)", border: "1px solid var(--line)", marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "2px", marginBottom: 6 }}>{p.date} 想定</div>
        <div style={{ fontFamily: "var(--display)", fontSize: 16, fontWeight: 700, color: "var(--gold-bright)", marginBottom: 8 }}>{p.trackCondForecast}</div>
        <div style={{ fontSize: 12.5, lineHeight: 1.85, color: "var(--txt2)", textWrap: "pretty" }}>{p.summary}</div>
      </div>

      {p.conditionChange && p.conditionChange.length > 0 && (
        <>
          <SectionTitle jp="馬場傾向マトリクス" en="MATRIX" icon="📊" />
          <div style={{ background: "var(--surface)", border: "1px solid var(--line2)", borderRadius: "var(--radius)", padding: "4px 12px", marginBottom: 18 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "8px 4px", fontSize: 9.5, color: "var(--txt3)", letterSpacing: "1px", fontWeight: 700, width: 80 }}>項目</th>
                  <th style={{ textAlign: "left", padding: "8px 4px", fontSize: 9.5, color: "var(--gold)", letterSpacing: "1px", fontWeight: 700 }}>有利</th>
                  <th style={{ textAlign: "left", padding: "8px 4px", fontSize: 9.5, color: "var(--neg)", letterSpacing: "1px", fontWeight: 700 }}>不利／注意</th>
                </tr>
              </thead>
              <tbody>
                {p.conditionChange.map((c, i) => (
                  <tr key={i} style={{ borderTop: i === 0 ? "none" : "1px solid var(--line2)" }}>
                    <td style={{ padding: "8px 4px", color: "var(--txt)", fontWeight: 700 }}>{c.item}</td>
                    <td style={{ padding: "8px 4px", color: "var(--txt2)", lineHeight: 1.6 }}>{c.good}</td>
                    <td style={{ padding: "8px 4px", color: "var(--txt2)", lineHeight: 1.6 }}>{c.heavy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {p.pickupHorses && p.pickupHorses.length > 0 && (
        <>
          <SectionTitle jp="馬場の注目馬" en="PICKUP" icon="🎯" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
            {p.pickupHorses.map((h, i) => {
              const r = K.byNum[h.num];
              return (
                <div key={i} style={{ padding: "12px 13px", borderRadius: "var(--radius)", background: "var(--surface)", border: `1px solid ${h.color || "var(--line)"}`, borderLeft: `4px solid ${h.color || "var(--gold)"}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <FrameChip frame={r.frame} num={r.num} size={24} />
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--txt)" }}>{h.name}</span>
                    <Pill kind="gold" style={{ fontSize: 9, marginLeft: "auto" }}>{h.label}</Pill>
                  </div>
                  <ul style={{ marginTop: 8, paddingLeft: 14, fontSize: 11, color: "var(--txt2)", lineHeight: 1.7 }}>
                    {h.reasons.map((rs, ri) => <li key={ri}>{rs}</li>)}
                  </ul>
                </div>
              );
            })}
          </div>
        </>
      )}

      {p.horseMatrix && p.horseMatrix.length > 0 && (
        <>
          <SectionTitle jp="出走馬 適性マトリクス" en="HORSE MATRIX" icon="🧮" />
          <div style={{ background: "var(--surface)", border: "1px solid var(--line2)", borderRadius: "var(--radius)", padding: "4px 8px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5, minWidth: 380 }}>
              <thead>
                <tr>
                  {["馬", "枠", "脚", "馬場", "差し", "評", "コメント"].map((h, i) => (
                    <th key={i} style={{ textAlign: "left", padding: "8px 5px", fontSize: 9, color: "var(--txt3)", letterSpacing: "1px", fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {p.horseMatrix.map((h, i) => {
                  const r = K.byNum[h.num];
                  const rankColor = h.rank === "S" ? "var(--gold-bright)" : h.rank === "A" ? "var(--gold)" : h.rank === "B" ? "#cf9a5a" : "var(--txt3)";
                  return (
                    <tr key={i} style={{ borderTop: i === 0 ? "none" : "1px solid var(--line2)" }}>
                      <td style={{ padding: "7px 5px", color: "var(--txt)", whiteSpace: "nowrap" }}>{h.name}</td>
                      <td style={{ padding: "7px 5px", color: "var(--txt2)" }}>{h.frame}</td>
                      <td style={{ padding: "7px 5px" }}><StyleTag style={h.style} /></td>
                      <td style={{ padding: "7px 5px", color: "var(--txt2)" }}>{h.heavy}</td>
                      <td style={{ padding: "7px 5px", color: "var(--txt2)" }}>{h.sashi}</td>
                      <td style={{ padding: "7px 5px", fontFamily: "var(--num)", fontSize: 14, color: rankColor }}>{h.rank}</td>
                      <td style={{ padding: "7px 5px", color: "var(--txt3)", fontSize: 10, lineHeight: 1.5 }}>{h.data}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

/* ===== ③ 1000回シミュ ===== */
const ShirasagiSim = () => {
  const K = window.KB_SHIRASAGI;
  const { simulation, ranked, byNum, markMap } = K;
  return (
    <div>
      <SectionTitle jp="③ 1000回シミュレーション" en="MONTE CARLO" icon="🎲" />
      <Card pad={14} style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: "var(--txt3)", letterSpacing: "1px" }}>{simulation.method || "モンテカルロ法"} × n={simulation.n || 1000} （σ={simulation.sigma || 8}）</div>
        {simulation.note && <div style={{ fontSize: 11.5, color: "var(--txt2)", marginTop: 6, lineHeight: 1.7 }}>{simulation.note}</div>}
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {ranked.map((r, i) => {
          const top = i < 3;
          const mark = markMap[r.num] || "";
          return (
            <div key={r.num} style={{
              display: "flex", alignItems: "center", gap: 9, padding: "9px 11px",
              background: top ? "var(--surface)" : "transparent",
              border: `1px solid ${top ? "var(--line)" : "var(--line2)"}`,
              borderRadius: "var(--radius)",
            }}>
              <div style={{ fontFamily: "var(--num)", fontSize: 17, width: 18, textAlign: "center", color: top ? "var(--gold)" : "var(--txt3)", flexShrink: 0 }}>{i + 1}</div>
              <Mark mark={mark} size={20} />
              <FrameChip frame={r.frame} num={r.num} size={22} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--txt)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</div>
                <div style={{ display: "flex", gap: 7, marginTop: 3, fontSize: 9.5, color: "var(--txt3)" }}>
                  <span>勝<span style={{ color: "var(--txt2)", marginLeft: 2 }}>{r.winPct.toFixed(1)}</span></span>
                  <span>連<span style={{ color: "var(--txt2)", marginLeft: 2 }}>{r.place2Pct.toFixed(1)}</span></span>
                  <span>複<span style={{ color: "var(--txt2)", marginLeft: 2 }}>{r.place3Pct.toFixed(1)}</span></span>
                  <span>平均<span style={{ color: "var(--txt2)", marginLeft: 2 }}>{r.avgRank.toFixed(1)}</span>着</span>
                </div>
              </div>
              <div style={{ fontFamily: "var(--num)", fontSize: 20, color: scoreTierColor(r.score), width: 38, textAlign: "right", flexShrink: 0 }}>{r.score.toFixed(1)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ===== 出馬表 ===== */
const ShirasagiEntries = () => {
  const K = window.KB_SHIRASAGI;
  const { runners } = K;
  return (
    <div style={{ padding: "14px 14px 24px" }}>
      <SectionTitle jp="出馬表" en="ENTRIES" right={<span style={{ fontSize: 11, color: "var(--txt3)" }}>{runners.length}頭立て</span>} />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {runners.map((r) => (
          <div key={r.num} style={{
            display: "flex", alignItems: "center", gap: 11, padding: "10px 12px",
            background: "var(--surface)", border: "1px solid var(--line2)", borderRadius: "var(--radius)",
          }}>
            <FrameChip frame={r.frame} num={r.num} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ fontSize: 14.5, fontWeight: 700, color: "var(--txt)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</span>
                <span style={{ fontSize: 9.5, color: "var(--txt3)" }}>{r.sex}{r.age}</span>
              </div>
              <div style={{ fontSize: 10.5, color: "var(--txt2)", marginTop: 2 }}>
                父 {r.sire} <span style={{ color: "var(--txt3)" }}>/ 母父 {r.bms}</span>
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
                <StyleTag style={r.style} />
                <span style={{ fontSize: 11.5, color: "var(--txt2)" }}>{r.jockey}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

Object.assign(window, { ShirasagiRaceDetail, ShirasagiDiagnosis, ShirasagiBlood, ShirasagiBias, ShirasagiSim, ShirasagiOverall, ShirasagiEntries });
