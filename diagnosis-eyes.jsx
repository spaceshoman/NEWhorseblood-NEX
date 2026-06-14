/* ===== 血統くん refined — 3つの目: 血統 / 馬場傾向 / 1000回シミュ ===== */

/* ========== ① 血統診断（表現3種: card / compact / karte） ========== */
const BloodPanel = ({ layout = "card" }) => {
  const { diag } = window.KB;
  return (
    <div>
      <SectionTitle jp="血統診断" en="BLOODLINE" icon="🧬"
        right={<Pill kind="ghost" style={{ fontSize: 9 }}>スコアリング v2.5</Pill>} />
      {layout === "compact" && <BloodCompact diag={diag} />}
      {layout === "karte" && <BloodKarte diag={diag.slice(0, 6)} />}
      {(layout === "card" || !layout) && <BloodCards diag={diag} />}
    </div>
  );
};

/* card: 上位8頭リッチ + 残りコンパクト */
const BloodCards = ({ diag }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    {diag.slice(0, 8).map((d, i) => {
      const r = d.r;
      return (
        <div key={d.num} style={{ background: "var(--surface)", border: `1px solid ${i === 0 ? "var(--line)" : "var(--line2)"}`, borderRadius: "var(--radius)", padding: "12px 13px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ fontFamily: "var(--num)", fontSize: 18, width: 16, textAlign: "center", color: i < 3 ? "var(--gold)" : "var(--txt3)" }}>{d.rank}</div>
            <Mark mark={d.mark} size={24} />
            <FrameChip frame={r.frame} num={r.num} size={26} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14.5, fontWeight: 700, color: "var(--txt)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</span>
                {d.tag === "ana" && <Pill kind="pos" style={{ fontSize: 8.5 }}>★穴候補</Pill>}
                {d.tag === "over" && <Pill kind="neg" style={{ fontSize: 8.5 }}>人気先行</Pill>}
              </div>
              <div style={{ fontSize: 10, color: "var(--txt2)", marginTop: 2 }}>父 {r.sire} / 母父 {r.bms}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontFamily: "var(--num)", fontSize: 28, color: scoreTierColor(d.score), lineHeight: 1 }}>{d.score}</div>
              <div style={{ fontSize: 9, color: "var(--txt3)" }}>{r.jockey} · {r.pop}人気</div>
            </div>
          </div>
          <Gauges g={d.g} />
          <ReasonChips str={d.str} weak={d.weak} />
          {d.jvs && <div style={{ fontSize: 10, color: "var(--gold)", marginTop: 8, display: "flex", alignItems: "center", gap: 5 }}>🏇 {d.jvs.label} <span style={{ color: "var(--txt3)" }}>({d.jvs.s}/10)</span></div>}
        </div>
      );
    })}
    <div style={{ fontSize: 10, color: "var(--txt3)", margin: "6px 2px 2px", letterSpacing: "1px" }}>9位以下</div>
    {diag.slice(8).map((d) => {
      const r = d.r;
      return (
        <div key={d.num} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 12px", borderRadius: "var(--radius)", border: "1px solid var(--line2)" }}>
          <span style={{ fontFamily: "var(--num)", fontSize: 14, width: 16, textAlign: "center", color: "var(--txt3)" }}>{d.rank}</span>
          <FrameChip frame={r.frame} num={r.num} size={22} />
          <span style={{ flex: 1, fontSize: 12.5, color: "var(--txt2)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</span>
          <span style={{ fontSize: 9.5, color: "var(--txt3)" }}>{r.sire}</span>
          <span style={{ fontFamily: "var(--num)", fontSize: 16, color: "var(--txt3)", width: 26, textAlign: "right" }}>{d.score}</span>
        </div>
      );
    })}
  </div>
);

/* compact: 全18頭の密なリーダーボード */
const BloodCompact = ({ diag }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
    {diag.map((d, i) => {
      const r = d.r;
      return (
        <div key={d.num} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 11px", borderRadius: "var(--radius)", background: i < 3 ? "var(--surface)" : "transparent", border: `1px solid ${i < 3 ? "var(--line)" : "var(--line2)"}` }}>
          <span style={{ fontFamily: "var(--num)", fontSize: 15, width: 16, textAlign: "center", color: i < 3 ? "var(--gold)" : "var(--txt3)" }}>{d.rank}</span>
          <Mark mark={d.mark} size={20} />
          <FrameChip frame={r.frame} num={r.num} size={22} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--txt)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>{r.name}</span>
            <div style={{ marginTop: 3 }}><GoldBar value={d.score} h={4} /></div>
          </div>
          <div style={{ display: "flex", gap: 3 }}>
            {d.str.slice(0, 2).map((s, j) => <span key={j} title={s} style={{ width: 6, height: 6, borderRadius: 3, background: "var(--pos)" }} />)}
            {d.weak.slice(0, 1).map((s, j) => <span key={"w" + j} title={s} style={{ width: 6, height: 6, borderRadius: 3, background: "var(--neg)" }} />)}
          </div>
          <span style={{ fontFamily: "var(--num)", fontSize: 18, color: scoreTierColor(d.score), width: 26, textAlign: "right" }}>{d.score}</span>
        </div>
      );
    })}
  </div>
);

/* karte: 診断書スタイル（上位6頭） */
const BloodKarte = ({ diag }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    {diag.map((d) => {
      const r = d.r;
      return (
        <div key={d.num} style={{ borderRadius: "var(--radius)", border: "1px solid var(--line)", overflow: "hidden", background: "var(--surface)" }}>
          {/* カルテ ヘッダー帯 */}
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 13px", background: "var(--gold-soft)", borderBottom: "1px solid var(--line)" }}>
            <Mark mark={d.mark} size={24} />
            <FrameChip frame={r.frame} num={r.num} size={26} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: "var(--txt)", fontFamily: "var(--display)" }}>{r.name}</div>
              <div style={{ fontSize: 9.5, color: "var(--txt2)" }}>{r.sex}{r.age} · {r.jockey} · {r.pop}番人気 {r.tan.toFixed(1)}倍</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 8, color: "var(--txt3)", letterSpacing: "1px" }}>SCORE</div>
              <div style={{ fontFamily: "var(--num)", fontSize: 30, color: scoreTierColor(d.score), lineHeight: 1 }}>{d.score}</div>
            </div>
          </div>
          <div style={{ padding: "12px 13px" }}>
            {/* 血統 行 */}
            <div style={{ display: "flex", gap: 14, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 8.5, color: "var(--txt3)", letterSpacing: "1px" }}>父</div>
                <div style={{ fontSize: 12, color: "var(--txt)", fontWeight: 600, marginTop: 2 }}>{r.sire}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 8.5, color: "var(--txt3)", letterSpacing: "1px" }}>母父</div>
                <div style={{ fontSize: 12, color: "var(--txt)", fontWeight: 600, marginTop: 2 }}>{r.bms}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 8.5, color: "var(--txt3)", letterSpacing: "1px" }}>脚質</div>
                <div style={{ marginTop: 3 }}><StyleTag style={r.style} /></div>
              </div>
            </div>
            <Gauges g={d.g} />
            <ReasonChips str={d.str} weak={d.weak} />
          </div>
        </div>
      );
    })}
    <div style={{ fontSize: 10, color: "var(--txt3)", textAlign: "center" }}>※ カルテ表示は上位6頭。全頭は「カード/コンパクト」表示で確認できます</div>
  </div>
);

/* ========== ② 馬場傾向（トラックバイアス） ========== */
const BiasPanel = () => {
  const { bias, byNum } = window.KB;
  const styleRows = [["逃げ", bias.bar.逃げ], ["先行", bias.bar.先行], ["差し", bias.bar.差し], ["追込", bias.bar.追込]];
  const rankColor = (rk) => rk === "S" ? "var(--gold-bright)" : rk[0] === "A" ? "var(--gold)" : rk[0] === "B" ? "#cf9a5a" : "var(--neg)";
  const mk = (s) => s === "◎" ? "var(--gold)" : s === "○" ? "var(--pos)" : s === "△" ? "var(--txt3)" : "var(--neg)";
  return (
    <div>
      <SectionTitle jp="馬場傾向 診断" en="TRACK BIAS" icon="🏟️"
        right={<Pill kind="ghost" style={{ fontSize: 9 }}>前日 {bias.date}</Pill>} />
      {/* サマリー */}
      <div style={{ borderRadius: "var(--radius)", border: "1px solid var(--line)", background: "var(--surface)", padding: "13px 14px", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <Pill kind="gold">馬場予想 {bias.forecast}</Pill>
          <span style={{ fontSize: 11, fontWeight: 800, color: "var(--gold-bright)", letterSpacing: "1px" }}>前残り傾向</span>
        </div>
        <div style={{ fontSize: 11.5, lineHeight: 1.8, color: "var(--txt2)", textWrap: "pretty" }}>{bias.summary}</div>
      </div>

      {/* 脚質バイアス */}
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--txt2)", margin: "0 2px 8px", letterSpacing: "1px" }}>脚質別 期待バイアス</div>
      <div style={{ borderRadius: "var(--radius)", border: "1px solid var(--line2)", padding: "12px 14px", marginBottom: 14, display: "flex", flexDirection: "column", gap: 8 }}>
        {styleRows.map(([k, v]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 30, fontSize: 11, fontWeight: 700 }}><StyleTag style={k} /></span>
            <GoldBar value={v} h={9} color={v >= 70 ? "var(--gold-grad)" : v >= 50 ? "linear-gradient(90deg,#9a7d3a,#cf9a5a)" : "linear-gradient(90deg,#5a4a3a,#7a6a55)"} />
            <span style={{ fontFamily: "var(--num)", fontSize: 14, width: 26, textAlign: "right", color: v >= 70 ? "var(--gold)" : "var(--txt3)" }}>{v}</span>
          </div>
        ))}
      </div>

      {/* 影響 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 16 }}>
        {bias.impact.map((im, i) => {
          const c = im.t === "good" ? "var(--pos)" : im.t === "bad" ? "var(--neg)" : "var(--gold)";
          const bg = im.t === "good" ? "var(--pos-bg)" : im.t === "bad" ? "var(--neg-bg)" : "var(--gold-soft)";
          const ic = im.t === "good" ? "🟢" : im.t === "bad" ? "🔴" : "⚡";
          return (
            <div key={i} style={{ display: "flex", gap: 9, padding: "10px 12px", borderRadius: "var(--radius)", background: bg, border: "1px solid var(--line2)" }}>
              <span style={{ fontSize: 12 }}>{ic}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: c }}>{im.s}</div>
                <div style={{ fontSize: 10, color: "var(--txt2)", marginTop: 2 }}>{im.who}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 馬場適性マトリクス */}
      <SectionTitle jp="馬場×展開 適性ランク" en="MATRIX" icon="📋"
        right={<div style={{ display: "flex", gap: 9, fontSize: 8.5, color: "var(--txt3)" }}><span>馬場</span><span>展開</span></div>} />
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {bias.matrix.map((mrow) => {
          const r = byNum[mrow.num];
          return (
            <div key={mrow.num} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: "var(--radius)", background: "var(--surface)", border: "1px solid var(--line2)" }}>
              <span style={{ width: 26, height: 26, borderRadius: 6, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--num)", fontSize: 15, color: "#15120a", background: rankColor(mrow.rank), flexShrink: 0 }}>{mrow.rank}</span>
              <FrameChip frame={r.frame} num={r.num} size={22} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--txt)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</div>
                <div style={{ fontSize: 9.5, color: "var(--txt3)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{mrow.note}</div>
              </div>
              <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: mk(mrow.heavy), width: 14, textAlign: "center" }}>{mrow.heavy}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: mk(mrow.sashi), width: 14, textAlign: "center" }}>{mrow.sashi}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ========== ③ レースシミュレーション1000回 ========== */
const SimPanel = ({ chartStyle = "rich" }) => {
  const { sim, byNum } = window.KB;
  const top = sim.results.slice(0, 8);
  const maxWin = Math.max(...sim.results.map((s) => s.win));
  return (
    <div>
      <SectionTitle jp="1000回 シミュレーション" en="MONTE CARLO ×1000" icon="🎲" />
      {/* メソッド */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[["試行", `${sim.n.toLocaleString()}回`], ["手法", "Box-Muller"], ["σ", String(sim.sigma)]].map(([k, v]) => (
          <div key={k} style={{ flex: 1, textAlign: "center", padding: "9px 4px", borderRadius: "var(--radius)", background: "var(--surface)", border: "1px solid var(--line2)" }}>
            <div style={{ fontFamily: "var(--num)", fontSize: 17, color: "var(--gold)" }}>{v}</div>
            <div style={{ fontSize: 9, color: "var(--txt3)", marginTop: 1 }}>{k}</div>
          </div>
        ))}
      </div>

      {/* 勝率ランキング */}
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--txt2)", margin: "0 2px 8px", letterSpacing: "1px" }}>勝率 / 連対率 / 複勝率</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 16 }}>
        {top.map((s, i) => {
          const r = byNum[s.num];
          return (
            <div key={s.num} style={{ padding: "10px 12px", borderRadius: "var(--radius)", background: i < 2 ? "var(--surface)" : "transparent", border: `1px solid ${i < 2 ? "var(--line)" : "var(--line2)"}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <span style={{ fontFamily: "var(--num)", fontSize: 15, width: 14, color: i < 3 ? "var(--gold)" : "var(--txt3)" }}>{i + 1}</span>
                <FrameChip frame={r.frame} num={r.num} size={22} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: "var(--txt)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</span>
                <span style={{ fontFamily: "var(--num)", fontSize: 22, color: scoreTierColor(50 + s.win), lineHeight: 1 }}>{s.win.toFixed(1)}<span style={{ fontSize: 10, color: "var(--txt3)" }}>%</span></span>
              </div>
              {chartStyle === "rich" ? (
                <div style={{ position: "relative", height: 14, marginTop: 8, borderRadius: 7, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, width: `${s.p3}%`, background: "rgba(216,182,89,0.18)" }} />
                  <div style={{ position: "absolute", inset: 0, width: `${s.p2}%`, background: "rgba(216,182,89,0.34)" }} />
                  <div style={{ position: "absolute", inset: 0, width: `${s.win}%`, background: "var(--gold-grad)" }} />
                </div>
              ) : (
                <div style={{ marginTop: 8 }}><GoldBar value={s.win} max={maxWin} h={5} /></div>
              )}
              <div style={{ display: "flex", gap: 12, marginTop: 7, fontSize: 9.5, color: "var(--txt3)" }}>
                <span>勝 <b style={{ color: "var(--gold)", fontFamily: "var(--num)", fontSize: 12 }}>{s.win.toFixed(1)}%</b></span>
                <span>連対 <b style={{ color: "var(--txt2)", fontFamily: "var(--num)", fontSize: 12 }}>{s.p2.toFixed(1)}%</b></span>
                <span>複勝 <b style={{ color: "var(--txt2)", fontFamily: "var(--num)", fontSize: 12 }}>{s.p3.toFixed(1)}%</b></span>
                <span style={{ marginLeft: "auto" }}>平均 <b style={{ color: "var(--txt2)", fontFamily: "var(--num)", fontSize: 12 }}>{s.avg.toFixed(1)}着</b></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 回収期待値（妙味） */}
      <SectionTitle jp="回収期待値（妙味）" en="EXPECTED VALUE" icon="💰" />
      <div style={{ borderRadius: "var(--radius)", border: "1px solid var(--line2)", padding: "6px 4px" }}>
        {[...sim.results].filter((s) => s.ev > 0).sort((a, b) => b.ev - a.ev).slice(0, 6).map((s) => {
          const r = byNum[s.num];
          const good = s.ev >= 1.0;
          return (
            <div key={s.num} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px" }}>
              <FrameChip frame={r.frame} num={r.num} size={20} />
              <span style={{ flex: 1, fontSize: 12, color: "var(--txt2)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</span>
              <span style={{ fontSize: 9.5, color: "var(--txt3)" }}>{r.tan.toFixed(1)}倍 / {r.pop}人気</span>
              <span style={{ fontFamily: "var(--num)", fontSize: 17, color: good ? "var(--pos)" : "var(--txt3)", width: 42, textAlign: "right" }}>{s.ev.toFixed(2)}</span>
              {good && <Pill kind="pos" style={{ fontSize: 8.5 }}>妙味</Pill>}
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: 9.5, color: "var(--txt3)", marginTop: 10, lineHeight: 1.6, textWrap: "pretty" }}>※ {sim.note} 回収期待値 ＝ 単勝オッズ × 勝率 ÷ 100。1.0超で「妙味あり」。</div>
    </div>
  );
};

Object.assign(window, { BloodPanel, BloodCards, BloodCompact, BloodKarte, BiasPanel, SimPanel });
