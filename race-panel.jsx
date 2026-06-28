/* ===== 血統くん refined — 汎用レース表示パネル =====
   raceId（"shirasagiS2026" 等）を受け取り、window.KB_RACES[raceId] を表示。
*/

const JsonRaceDetail = ({ raceId, onBack }) => {
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    if (window.KB_RACES && window.KB_RACES[raceId] && window.KB_RACES[raceId].ready) return;
    const onLoad = (e) => { if (!e.detail || e.detail.raceId === raceId) force(); };
    document.addEventListener("kb-race-loaded", onLoad);
    return () => document.removeEventListener("kb-race-loaded", onLoad);
  }, [raceId]);

  const K = window.KB_RACES && window.KB_RACES[raceId];
  if (!K || !K.ready) {
    return (
      <div>
        <Header title="レース" sub="LOADING" onBack={onBack} />
        <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--txt3)" }}>
          データ読み込み中… {K && K.error ? <div style={{ color: "var(--neg)", fontSize: 11, marginTop: 8 }}>{K.error}</div> : null}
        </div>
      </div>
    );
  }

  const [view, setView] = React.useState("diag");

  return (
    <div>
      <Header title={K.race.short} sub={K.race.en} onBack={onBack} />
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

      <div style={{ display: "flex", gap: 4, margin: "16px 16px 0", padding: 3, background: "var(--surface)", border: "1px solid var(--line2)", borderRadius: "var(--radius)" }}>
        {[["diag", "🔮 AI血統診断"], ["list", "📋 出馬表"], ...(K.race.result ? [["result", "🏁 結果・回顧"]] : [])].map(([id, label]) => {
          const on = view === id;
          return (
            <button key={id} onClick={() => setView(id)} style={{
              flex: 1, padding: "10px 0", border: "none", borderRadius: "calc(var(--radius) - 3px)", cursor: "pointer",
              fontFamily: "var(--display)", fontWeight: 700, fontSize: 12,
              background: on ? "var(--gold-grad)" : "transparent", color: on ? "#15120a" : "var(--txt2)",
              boxShadow: on ? "var(--glow)" : "none", transition: "all .2s",
            }}>{label}</button>
          );
        })}
      </div>

      {view === "list" ? <JsonRaceEntries K={K} /> : view === "result" ? <JsonRaceResult K={K} /> : <JsonRaceDiagnosis K={K} />}
    </div>
  );
};

const JsonRaceDiagnosis = ({ K }) => {
  const [eye, setEye] = React.useState("total");
  return (
    <div>
      <JsonRaceEyeNav eye={eye} setEye={setEye} />
      <div style={{ padding: "16px 14px 28px" }}>
        {eye === "total" && <JsonRaceOverall K={K} />}
        {eye === "blood" && <JsonRaceBlood K={K} />}
        {eye === "bias" && <JsonRaceBias K={K} />}
        {eye === "sim" && <JsonRaceSim K={K} />}
      </div>
    </div>
  );
};

const JsonRaceEyeNav = ({ eye, setEye }) => {
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

const JsonRaceOverall = ({ K }) => {
  const { overall, strategy, byNum } = K;
  const m = (num) => byNum[num];
  return (
    <div>
      <div style={{ borderRadius: "var(--radius-lg)", padding: "16px 16px 14px", background: "var(--hero)", border: "1px solid var(--line)", boxShadow: "var(--glow)", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 17 }}>⚖️</span>
          <span style={{ fontFamily: "var(--num)", fontSize: 12, letterSpacing: "2.5px", color: "var(--gold)" }}>FINAL VERDICT</span>
          <span style={{ marginLeft: "auto", fontSize: 9.5, color: "var(--txt3)" }}>3つの目を統合</span>
        </div>
        <div style={{ fontSize: 12.5, lineHeight: 1.85, color: "var(--txt)", marginTop: 10, textWrap: "pretty" }}>{strategy.verdict}</div>

        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {overall.filter((o) => ["◎", "○", "▲"].includes(o.mark)).slice(0, 3).map((o) => (
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

      <SectionTitle jp="買い目戦略" en="STRATEGY" icon="🎯" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
        {[strategy.axis, strategy.counter, strategy.hole, strategy.bighole].filter(Boolean).map((p, i) => {
          const r = m(p.num);
          if (!r) return null;
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

      {strategy.danger && strategy.danger.length > 0 && (
        <div style={{ borderRadius: "var(--radius)", border: "1px solid var(--neg-bg)", background: "var(--neg-bg)", padding: "12px 13px", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 9 }}>
            <span style={{ fontSize: 13 }}>⚠️</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: "var(--neg)", letterSpacing: ".5px" }}>危険な人気馬</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {strategy.danger.map((d) => {
              const r = m(d.num);
              if (!r) return null;
              return (
                <div key={d.num} style={{ display: "flex", gap: 9 }}>
                  <FrameChip frame={r.frame} num={r.num} size={24} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--txt)" }}>{r.name}</span>
                      {r.pop > 0 && <Pill kind="neg" style={{ fontSize: 9 }}>{r.pop}番人気</Pill>}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--txt2)", marginTop: 4, lineHeight: 1.6, textWrap: "pretty" }}>{d.why}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <SectionTitle jp="総合ランキング" en="RANKING" icon="🏆"
        right={<div style={{ display: "flex", gap: 8, fontSize: 8.5, color: "var(--txt3)" }}>
          <span>🧬血統</span><span>🏟️馬場</span><span>🎲シミュ</span>
        </div>} />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {overall.map((o) => <JsonRaceOverallRow key={o.num} o={o} K={K} />)}
      </div>
    </div>
  );
};

const JsonRaceOverallRow = ({ o, K }) => {
  const r = K.byNum[o.num];
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

const JsonRaceBlood = ({ K }) => {
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

const JsonRaceBias = ({ K }) => {
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
              if (!r) return null;
              return (
                <div key={i} style={{ padding: "12px 13px", borderRadius: "var(--radius)", background: "var(--surface)", border: `1px solid ${h.color || "var(--line)"}`, borderLeft: `4px solid ${h.color || "var(--gold)"}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <FrameChip frame={r.frame} num={r.num} size={24} />
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--txt)" }}>{h.name}</span>
                    <Pill kind="gold" style={{ fontSize: 9, marginLeft: "auto" }}>{h.label}</Pill>
                  </div>
                  <ul style={{ marginTop: 8, paddingLeft: 14, fontSize: 11, color: "var(--txt2)", lineHeight: 1.7 }}>
                    {(h.reasons || []).map((rs, ri) => <li key={ri}>{rs}</li>)}
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
                  const r = K.byNum[h.num] || { frame: 0, num: h.num };
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

const JsonRaceSim = ({ K }) => {
  const { simulation, ranked, markMap } = K;
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

const JsonRaceEntries = ({ K }) => {
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
              {r.pop > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end", marginTop: 3 }}>
                  <span style={{ fontFamily: "var(--num)", fontSize: 14, color: r.pop <= 3 ? "var(--gold)" : "var(--txt3)", letterSpacing: ".5px" }}>{r.pop}人気</span>
                  {r.tan > 0 && <span style={{ fontSize: 11, color: "var(--txt2)", fontWeight: 700 }}>{r.tan.toFixed(1)}</span>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ===== 結果・回顧タブ ===== */
const JsonRaceResult = ({ K }) => {
  const res = K.race.result, rev = K.race.review, ver = K.race.verification;
  const byNum = K.byNum;
  return (
    <div style={{ padding: "16px 16px 24px" }}>
      {/* 着順 */}
      <SectionTitle jp="レース結果" en="RESULT" icon="🏁"
        right={<span style={{ fontSize: 10, color: "var(--txt3)" }}>{res.weather}・芝{res.trackCond}</span>} />
      <Card pad={0} style={{ overflow: "hidden", marginBottom: 16 }}>
        {res.topFinishers.map((f, i) => {
          const mk = K.markMap && K.markMap[f.num];
          return (
            <div key={f.num} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 13px", borderBottom: i < res.topFinishers.length - 1 ? "1px solid var(--line2)" : "none", background: i === 0 ? "var(--gold-soft)" : "transparent" }}>
              <span style={{ fontFamily: "var(--num)", fontSize: 16, color: i === 0 ? "var(--gold-bright)" : "var(--txt2)", width: 22, textAlign: "center" }}>{f.rank}</span>
              <span style={{ fontFamily: "var(--num)", fontSize: 13, color: "var(--txt2)", width: 20, textAlign: "center" }}>{f.num}</span>
              {mk && <Mark mark={mk} size={16} />}
              <span style={{ fontSize: 12.5, color: "var(--txt)", fontWeight: i === 0 ? 700 : 500, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</span>
              <span style={{ fontSize: 10, color: "var(--txt3)" }}>{f.pop}人気</span>
              <span style={{ fontSize: 10, color: "var(--txt3)", width: 34, textAlign: "right" }}>{f.style}</span>
            </div>
          );
        })}
      </Card>

      {/* 払戻 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
        {Object.entries(res.payouts).map(([k, v]) => {
          const label = { tansho: "単勝", umaren: "馬連", sanrenpuku: "3連複", sanrentan: "3連単" }[k] || k;
          return (
            <div key={k} style={{ flex: "1 1 45%", padding: "8px 11px", background: "var(--surface)", border: "1px solid var(--line2)", borderRadius: "var(--radius)" }}>
              <div style={{ fontSize: 9, color: "var(--txt3)", marginBottom: 2 }}>{label}</div>
              <div style={{ fontFamily: "var(--num)", fontSize: 12.5, color: "var(--gold-bright)" }}>{v}</div>
            </div>
          );
        })}
      </div>

      {/* 回顧 */}
      {rev && (
        <>
          <SectionTitle jp="回顧" en="REVIEW" icon="📝" />
          <Card pad={14} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--gold-bright)", lineHeight: 1.6, marginBottom: 9, textWrap: "pretty" }}>{rev.headline}</div>
            <div style={{ fontSize: 11.5, color: "var(--txt2)", lineHeight: 1.85, textWrap: "pretty" }}>{rev.summary}</div>
          </Card>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
            <div style={{ padding: 12, background: "var(--gold-soft)", border: "1px solid var(--line)", borderRadius: "var(--radius)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--gold-bright)", marginBottom: 7 }}>◎ 的中・好評価</div>
              {rev.good.map((g, i) => (
                <div key={i} style={{ fontSize: 11, color: "var(--txt2)", lineHeight: 1.7, marginBottom: 5, paddingLeft: 12, position: "relative", textWrap: "pretty" }}>
                  <span style={{ position: "absolute", left: 0, color: "var(--gold)" }}>·</span>{g}
                </div>
              ))}
            </div>
            <div style={{ padding: 12, background: "color-mix(in srgb, var(--surface2) 50%, transparent)", border: "1px solid var(--line2)", borderRadius: "var(--radius)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--txt2)", marginBottom: 7 }}>✗ 反省点</div>
              {rev.bad.map((b, i) => (
                <div key={i} style={{ fontSize: 11, color: "var(--txt3)", lineHeight: 1.7, marginBottom: 5, paddingLeft: 12, position: "relative", textWrap: "pretty" }}>
                  <span style={{ position: "absolute", left: 0 }}>·</span>{b}
                </div>
              ))}
            </div>
          </div>

          {rev.lesson && (
            <Card pad={13} style={{ marginBottom: 16, borderColor: "var(--line)" }}>
              <div style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "1px", marginBottom: 5 }}>💡 教訓</div>
              <div style={{ fontSize: 11.5, color: "var(--txt2)", lineHeight: 1.8, textWrap: "pretty" }}>{rev.lesson}</div>
            </Card>
          )}
        </>
      )}

      {/* 買い目検証 */}
      {ver && (
        <>
          <SectionTitle jp="買い目検証" en="VERIFICATION" icon="🎯" />
          <Card pad={14}>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 11 }}>
              {[ver.honmei, ver.taikou, ver.tanana, ver.renpuku].map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <Mark mark={b.mark} size={17} />
                  <span style={{ fontFamily: "var(--num)", fontSize: 12, color: "var(--txt3)", width: 20, textAlign: "center" }}>{b.num}</span>
                  <span style={{ fontSize: 12, color: "var(--txt)", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.name}</span>
                  <span style={{ fontFamily: "var(--num)", fontSize: 12, color: b.hit ? "var(--gold-bright)" : "var(--txt3)" }}>{b.result}着</span>
                  <span style={{ fontSize: 13 }}>{b.hit ? "🎯" : "·"}</span>
                </div>
              ))}
            </div>
            {ver.danger_check && (
              <div style={{ paddingTop: 11, borderTop: "1px solid var(--line2)", marginBottom: 11 }}>
                <div style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "1px", marginBottom: 6 }}>⚠ 危険馬の判定</div>
                {ver.danger_check.map((d, i) => (
                  <div key={i} style={{ fontSize: 11, color: "var(--txt2)", lineHeight: 1.7, marginBottom: 3 }}>
                    {d.name}（{d.pop}番人気）→ {d.result}着　<span style={{ color: d.hit ? "var(--gold-bright)" : "var(--txt3)" }}>{d.hit ? "指摘的中" : "—"}</span>
                  </div>
                ))}
              </div>
            )}
            {ver.bets && (
              <div style={{ paddingTop: 11, borderTop: "1px solid var(--line2)", marginBottom: 11 }}>
                {ver.bets.map((bt, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                    <Pill kind={bt.result === "的中" ? "gold" : "ghost"} style={{ fontSize: 9, flexShrink: 0 }}>{bt.type}</Pill>
                    <span style={{ fontSize: 10.5, color: "var(--txt3)", lineHeight: 1.6, flex: 1, textWrap: "pretty" }}>{bt.target} — {bt.note}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ paddingTop: 11, borderTop: "1px solid var(--line2)", fontSize: 11.5, color: "var(--txt2)", lineHeight: 1.8, textWrap: "pretty" }}>
              <span style={{ color: "var(--gold)" }}>総括: </span>{ver.verdict}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

/* 旧API互換 */
const ShirasagiRaceDetail = ({ onBack }) => <JsonRaceDetail raceId="shirasagiS2026" onBack={onBack} />;

Object.assign(window, { JsonRaceDetail, ShirasagiRaceDetail, JsonRaceResult });
