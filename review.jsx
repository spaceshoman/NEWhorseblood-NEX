/* ===== 血統くん refined — 🏁 結果・回顧・AI検証 ===== */

/* 着順の色 */
const posColor = (p) => p === 1 ? "var(--gold-bright)" : p === 2 ? "var(--gold)" : p === 3 ? "#cf9a5a" : "var(--txt3)";

/* 印×着順の判定（◎○▲△ は複勝圏=的中） */
const judgeMark = (pos) => {
  if (pos === "中止") return { ok: false, label: "競走中止", res: "中止" };
  if (typeof pos === "number" && pos <= 3) return { ok: true, label: pos === 1 ? "勝利 ✓" : pos === 2 ? "連対 ✓" : "複勝圏 ✓", res: pos + "着" };
  return { ok: false, label: "圏外 ✗", res: pos + "着" };
};

const ResultPanel = () => {
  const { result, overall, byNum, strategy, race } = window.KB;
  const markByNum = {};
  overall.forEach((o) => (markByNum[o.num] = o.mark));
  const top3 = result.order.filter((o) => typeof o.pos === "number" && o.pos <= 3);

  // 印つきの馬（◎○▲△）を着順と突き合わせ
  const markedRows = overall.filter((o) => o.mark).map((o) => ({
    ...o, pos: result.posByNum[o.num], j: judgeMark(result.posByNum[o.num]), r: byNum[o.num],
  }));
  const inMoney = markedRows.filter((m) => m.j.ok).length;

  // 危険な人気馬の検証（消えたら的中）
  const dangerRows = strategy.danger.map((d) => {
    const pos = result.posByNum[d.num];
    const ok = pos === "中止" || (typeof pos === "number" && pos > 3);
    return { ...d, pos, ok, r: byNum[d.num] };
  });
  const dangerHit = dangerRows.filter((d) => d.ok).length;

  // 収支
  const invest = result.bets.reduce((a, b) => a + b.invest, 0);
  const ret = result.bets.reduce((a, b) => a + b.ret, 0);
  const net = ret - invest;

  return (
    <div style={{ padding: "16px 14px 28px" }}>
      {/* 確定ヘッダー */}
      <div style={{ borderRadius: "var(--radius-lg)", padding: "16px 16px 14px", background: "var(--hero)", border: "1px solid var(--line)", boxShadow: "var(--glow)", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "var(--num)", fontSize: 12, letterSpacing: "2.5px", color: "var(--gold)" }}>RESULT</span>
          <Pill kind="pos" style={{ marginLeft: "auto", fontSize: 9.5 }}>● 確定</Pill>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 12, alignItems: "flex-end" }}>
          {[["馬場", result.track], ["天候", result.weather], ["勝ちタイム", result.time], ["上り3F", result.last3f]].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 9, color: "var(--txt3)", letterSpacing: "1px" }}>{k}</div>
              <div style={{ fontFamily: "var(--num)", fontSize: 18, color: "var(--gold-bright)", marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 9.5, color: "var(--txt3)", marginTop: 8 }}>※ 予想時は「良」想定 → 直前の雨で「重」に悪化</div>
      </div>

      {/* 上位着順 */}
      <SectionTitle jp="上位着順" en="FINISH" icon="🏁" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 4 }}>
        {top3.map((o) => {
          const r = byNum[o.num];
          return (
            <div key={o.num} style={{
              display: "flex", alignItems: "center", gap: 11, padding: "12px 13px", borderRadius: "var(--radius)",
              background: o.pos === 1 ? "linear-gradient(100deg,rgba(216,182,89,.10),var(--surface) 60%)" : "var(--surface)",
              border: `1px solid ${o.pos === 1 ? "var(--line)" : "var(--line2)"}`,
            }}>
              <div style={{ fontFamily: "var(--num)", fontSize: 24, width: 26, textAlign: "center", color: posColor(o.pos), flexShrink: 0, lineHeight: 1 }}>{o.pos}</div>
              <Mark mark={markByNum[o.num]} size={22} />
              <FrameChip frame={r.frame} num={r.num} size={28} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--txt)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</div>
                <div style={{ fontSize: 10.5, color: "var(--txt3)", marginTop: 2 }}>{r.jockey} ・ {r.style} ・ {r.pop}番人気</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: "var(--num)", fontSize: 16, color: "var(--gold)", letterSpacing: ".5px" }}>{o.time}</div>
                <div style={{ fontSize: 9, color: "var(--txt3)", marginTop: 1 }}>{o.margin || "—"}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI検証サマリー */}
      <SectionTitle jp="AI予想の答え合わせ" en="VERIFICATION" icon="⚖️" />
      <div style={{ borderRadius: "var(--radius-lg)", padding: "16px", background: "var(--hero)", border: "1px solid var(--line)", boxShadow: "var(--glow)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>⚖️</span>
          <span style={{ fontFamily: "var(--num)", fontSize: 12, letterSpacing: "2.5px", color: "var(--gold)" }}>FINAL VERDICT 検証</span>
        </div>
        <div style={{ fontSize: 12.5, lineHeight: 1.9, color: "var(--txt)", marginTop: 10, textWrap: "pretty" }}>
          AIが「2強」と読んだ <b style={{ color: "var(--gold-bright)" }}>◎クロワデュノール・○メイショウタバル</b> が順序こそ入れ替わったものの<b>そのまま1〜2着</b>を独占。本線の<b>馬連5-16は的中</b>。さらに危険な人気馬として切った2頭が揃って馬券圏外に消え、馬場の目の「前残り・追込不利」が的中しました。
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <Pill kind="pos" style={{ fontSize: 10.5, padding: "5px 11px" }}>◎○ ワンツー的中</Pill>
          <Pill kind="pos" style={{ fontSize: 10.5, padding: "5px 11px" }}>危険馬 {dangerHit}/{dangerRows.length} 消し成功</Pill>
        </div>
      </div>

      {/* 印の答え合わせ */}
      <SectionTitle jp="印 vs 結果" en="MARKS CHECK" icon="🎯" />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {markedRows.map((m) => (
          <div key={m.num} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: "var(--radius)",
            background: "var(--surface)", border: `1px solid ${m.j.ok ? "rgba(123,168,138,.3)" : "rgba(200,122,111,.28)"}`,
          }}>
            <span style={{ fontSize: 18, width: 22, textAlign: "center", color: markColor(m.mark), flexShrink: 0 }}>{m.mark}</span>
            <FrameChip frame={m.r.frame} num={m.r.num} size={22} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--txt)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.r.name}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0, width: 56 }}>
              <div style={{ fontFamily: "var(--num)", fontSize: 19, color: m.j.ok ? "var(--gold)" : "var(--txt3)", lineHeight: 1 }}>{m.j.res}</div>
              <div style={{ fontSize: 8.5, color: m.j.ok ? "var(--pos)" : "var(--neg)", marginTop: 2 }}>{m.j.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 10, color: "var(--txt3)", marginTop: 8, lineHeight: 1.7 }}>
        複勝圏（3着以内）に印 <b style={{ color: "var(--txt2)" }}>{inMoney}頭</b> が的中。⑰レガレイラは血統の目では▲も、馬場の目が危険視 → 7着で<b style={{ color: "var(--txt2)" }}>馬場の目が的中</b>。
      </div>

      {/* 危険な人気馬の検証 */}
      <SectionTitle jp="危険な人気馬の検証" en="DANGER CHECK" icon="⚠️" />
      <div style={{ borderRadius: "var(--radius)", border: "1px solid var(--neg-bg)", background: "var(--neg-bg)", padding: "12px 13px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {dangerRows.map((d) => (
            <div key={d.num} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
              <FrameChip frame={d.r.frame} num={d.r.num} size={24} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--txt)" }}>{d.r.name}</span>
                  <Pill kind="neg" style={{ fontSize: 9 }}>{d.r.pop}番人気</Pill>
                  <Pill kind={d.ok ? "pos" : "neg"} style={{ fontSize: 9, marginLeft: "auto" }}>
                    {d.ok ? `消し的中 → ${d.pos}着` : `失敗 → ${d.pos}着`}
                  </Pill>
                </div>
                <div style={{ fontSize: 10, color: "var(--txt2)", marginTop: 4, lineHeight: 1.6, textWrap: "pretty" }}>{d.why}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 買い目の収支検証 */}
      <SectionTitle jp="買い目の収支検証" en="TICKETS" icon="💰" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {result.bets.map((b) => {
          const profit = b.ret - b.invest;
          return (
            <div key={b.plan} style={{ padding: "12px 13px", borderRadius: "var(--radius)", background: "var(--surface)", border: `1px solid ${b.hit ? "rgba(123,168,138,.32)" : "var(--line2)"}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Pill kind={b.kind} style={{ fontSize: 9.5 }}>{b.plan}・{b.label}</Pill>
                <Pill kind={b.hit ? "pos" : "neg"} style={{ marginLeft: "auto", fontSize: 9.5 }}>{b.hit ? "的中" : "外れ"}</Pill>
              </div>
              <div style={{ fontFamily: "var(--num)", fontSize: 14, letterSpacing: ".5px", color: "var(--gold)", marginTop: 7 }}>{b.nums}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6, gap: 8 }}>
                <span style={{ fontSize: 10, color: "var(--txt2)" }}>投資{b.invest.toLocaleString()}円 / {b.note}</span>
                <span style={{ fontFamily: "var(--num)", fontSize: 15, color: profit >= 0 ? "var(--pos)" : "var(--neg)" }}>{profit >= 0 ? "＋" : "−"}{Math.abs(profit).toLocaleString()}円</span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 8, borderRadius: "var(--radius-lg)", background: "var(--hero)", border: "1px solid var(--line)", boxShadow: "var(--glow)", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 10, color: "var(--txt3)", letterSpacing: "1px" }}>3プラン合計収支</div>
          <div style={{ fontSize: 10.5, color: "var(--txt2)", marginTop: 2 }}>投資 {invest.toLocaleString()}円 / 払戻 {ret.toLocaleString()}円</div>
        </div>
        <div style={{ fontFamily: "var(--num)", fontSize: 30, color: net >= 0 ? "var(--pos)" : "var(--neg)", lineHeight: 1 }}>
          {net >= 0 ? "＋" : "−"}{Math.abs(net).toLocaleString()}<span style={{ fontSize: 14, color: "var(--txt2)" }}>円</span>
        </div>
      </div>

      {/* 払戻 */}
      <SectionTitle jp="払戻金" en="PAYOUT" icon="🎫" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
        {result.payout.map((p) => (
          <div key={p.k} style={{ background: "var(--surface)", border: "1px solid var(--line2)", borderRadius: 10, padding: "9px 11px" }}>
            <div style={{ fontSize: 10, color: "var(--txt3)", letterSpacing: "1px" }}>{p.k} {p.c}</div>
            <div style={{ fontFamily: "var(--num)", fontSize: 18, color: "var(--gold-bright)", marginTop: 2 }}>{p.v.toLocaleString()}<span style={{ fontSize: 11, color: "var(--txt2)", marginLeft: 4 }}>円</span></div>
          </div>
        ))}
      </div>

      {/* 勝利騎手コメント */}
      <SectionTitle jp="勝利騎手コメント" en="JOCKEY" icon="🎤" />
      <Card pad={14}>
        <div style={{ borderLeft: "2px solid var(--gold)", padding: "4px 0 4px 14px" }}>
          <div style={{ fontFamily: "var(--display)", fontSize: 14, lineHeight: 2, color: "var(--txt)" }}>「{result.comment.text}」</div>
        </div>
        <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 10 }}>
          <b style={{ color: "var(--gold)", fontWeight: 700 }}>{result.comment.by}</b>（{result.comment.horse}）
        </div>
      </Card>

      {/* レース回顧 */}
      <SectionTitle jp="レース回顧" en="REVIEW" icon="📝" />
      <Card pad={14}>
        <div style={{ fontSize: 12.5, lineHeight: 1.95, color: "var(--txt2)", textWrap: "pretty" }}>{result.review}</div>
      </Card>

      {/* 全着順 */}
      <SectionTitle jp="全着順" en="FULL ORDER" icon="📋" />
      <div style={{ background: "var(--surface)", border: "1px solid var(--line2)", borderRadius: "var(--radius)", overflow: "hidden" }}>
        {result.order.map((o, i) => {
          const r = byNum[o.num];
          const stop = o.pos === "中止";
          return (
            <div key={o.num} style={{
              display: "flex", alignItems: "center", gap: 9, padding: "8px 12px",
              borderTop: i === 0 ? "none" : "1px solid var(--line2)", opacity: stop ? 0.6 : 1,
            }}>
              <div style={{ fontFamily: "var(--num)", fontSize: 15, width: 28, textAlign: "center", color: stop ? "var(--neg)" : posColor(o.pos), flexShrink: 0 }}>{stop ? "中" : o.pos}</div>
              <span style={{ width: 16, textAlign: "center", fontSize: 12, color: markColor(markByNum[o.num]), flexShrink: 0 }}>{markByNum[o.num] || ""}</span>
              <FrameChip frame={r.frame} num={r.num} size={20} />
              <span style={{ flex: 1, fontSize: 12.5, color: "var(--txt)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</span>
              <span style={{ fontSize: 10.5, color: "var(--txt3)", flexShrink: 0 }}>{r.jockey}</span>
              <span style={{ fontFamily: "var(--num)", fontSize: 13, color: r.pop <= 3 ? "var(--gold)" : "var(--txt3)", width: 22, textAlign: "right", flexShrink: 0 }}>{r.pop}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

Object.assign(window, { ResultPanel, posColor, judgeMark });
