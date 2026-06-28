/* ===== 血統くん refined — WIN5 予想ページ ===== */

const Win5Screen = ({ onOpenRace }) => {
  const K = window.KB_WIN5;
  if (!K) return <div>データ読み込み中…</div>;

  // 軸の堅さ別カラー
  const confColor = (c) =>
    c === "S" ? "var(--gold-bright)" :
    c === "A" ? "var(--gold)" :
    c === "B" ? "#cf9a5a" : "#7aa8d8";
  const confLabel = (c) =>
    c === "S" ? "断然" : c === "A" ? "鉄板級" : c === "B" ? "本線型" : "混戦";

  // 5レース通しの「最尤コンビ」累計確率（参考値）
  const compositeProb = K.races.reduce((acc, r) => acc * (r.top[0].prob / 100), 1) * 100;

  return (
    <div>
      <Header title="WIN5 予想" sub="JACKPOT FIVE" />

      {/* レース後の結果バナー */}
      {K.win5Result && <Win5ResultBanner res={K.win5Result} />}

      {/* ヒーロー */}
      <div style={{ margin: "14px 14px 0", borderRadius: "var(--radius-lg)", padding: "18px 18px 16px", background: "var(--hero)", border: "1px solid var(--line)", boxShadow: "var(--glow)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "var(--num)", fontSize: 11, letterSpacing: "4px", color: "var(--gold)" }}>SUNDAY WIN5</span>
          <Pill kind="pos" style={{ marginLeft: "auto", fontSize: 9.5 }}>● 予想公開中</Pill>
        </div>
        <div style={{ fontFamily: "var(--display)", fontWeight: 900, fontSize: 28, color: "var(--txt)", letterSpacing: "1px", marginTop: 6 }}>
          🎰 5レース通し予想
        </div>
        <div style={{ fontFamily: "var(--num)", fontSize: 12, letterSpacing: "2px", color: "var(--gold)", marginTop: 2 }}>{K.date}（{K.dow}）</div>
        <div style={{ fontSize: 11.5, color: "var(--txt2)", marginTop: 10, lineHeight: 1.75, textWrap: "pretty" }}>{K.summary}</div>

        <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
          <div>
            <div style={{ fontSize: 9, color: "var(--txt3)", letterSpacing: "1px" }}>シミュ回数</div>
            <div style={{ fontFamily: "var(--num)", fontSize: 18, color: "var(--gold-bright)", marginTop: 2 }}>1,000</div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: "var(--txt3)", letterSpacing: "1px" }}>本線通し確率</div>
            <div style={{ fontFamily: "var(--num)", fontSize: 18, color: "var(--gold-bright)", marginTop: 2 }}>{compositeProb.toFixed(2)}<span style={{ fontSize: 10, color: "var(--txt2)" }}>%</span></div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "flex-end" }}>
            <span style={{ fontSize: 9, color: "var(--txt3)", letterSpacing: "1px" }}>※5R全て本命1着の場合</span>
          </div>
        </div>
      </div>

      {/* 5レースカード */}
      <div style={{ padding: "16px 14px 8px" }}>
        <SectionTitle jp="5レース予想" en="LEG-BY-LEG" icon="🏇" />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {K.races.map((r) => (
            <Win5RaceCard key={r.leg} r={r} confColor={confColor} confLabel={confLabel} onOpenRace={onOpenRace} />
          ))}
        </div>
      </div>

      {/* 軸の堅さサマリ */}
      <div style={{ padding: "12px 14px 8px" }}>
        <SectionTitle jp="軸の堅さ" en="CONFIDENCE" icon="📊" />
        <div style={{ background: "var(--surface)", border: "1px solid var(--line2)", borderRadius: "var(--radius)", padding: "10px 12px" }}>
          {K.races.map((r) => (
            <div key={r.leg} style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 0", borderTop: r.leg === 1 ? "none" : "1px solid var(--line2)" }}>
              <div style={{ fontFamily: "var(--num)", fontSize: 14, width: 14, color: "var(--gold)" }}>{r.leg}</div>
              <span style={{ fontSize: 12, color: "var(--txt)", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontFamily: "var(--num)", fontSize: 16, color: confColor(r.confidence), width: 14 }}>{r.confidence}</span>
                <span style={{ fontSize: 10, color: "var(--txt2)", width: 50 }}>{confLabel(r.confidence)}</span>
              </div>
              <span style={{ fontFamily: "var(--num)", fontSize: 12, color: "var(--gold-bright)", width: 48, textAlign: "right" }}>{r.top[0].prob.toFixed(1)}<span style={{ fontSize: 9, color: "var(--txt3)" }}>%</span></span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, color: "var(--txt3)", marginTop: 8, lineHeight: 1.7 }}>
          <b style={{ color: "var(--gold-bright)" }}>S</b>=断然軸 / <b style={{ color: "var(--gold)" }}>A</b>=鉄板級 / <b style={{ color: "#cf9a5a" }}>B</b>=本線型 / <b style={{ color: "#7aa8d8" }}>C</b>=混戦
        </div>
      </div>

      {/* 推奨買い目パターン */}
      {K.betPatterns && <Win5BetPatterns bp={K.betPatterns} />}

      {/* モデル説明 */}
      <div style={{ padding: "8px 14px 28px" }}>
        <Card pad={13}>
          <div style={{ fontFamily: "var(--num)", fontSize: 11, letterSpacing: "2.5px", color: "var(--gold)", marginBottom: 8 }}>MODEL NOTE</div>
          <div style={{ fontSize: 11.5, color: "var(--txt2)", lineHeight: 1.8 }}>
            {K.method}<br />
            {K.modelNote}<br />
            <span style={{ color: "var(--txt3)", fontSize: 10 }}>※馬場状態（特に阪神・しらさぎS）次第で適性評価は動くので、当日の馬場発表を見て微調整を推奨。馬券は余裕資金の範囲で。</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

const Win5RaceCard = ({ r, confColor, confLabel, onOpenRace }) => {
  const hasRace = !!r.raceId;
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--line2)", borderRadius: "var(--radius)", overflow: "hidden" }}>
      {/* ヘッダ */}
      <div style={{ padding: "11px 13px 9px", borderBottom: "1px solid var(--line2)", display: "flex", alignItems: "center", gap: 9, background: "color-mix(in srgb, var(--surface2) 60%, transparent)" }}>
        <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--gold-grad)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--num)", fontSize: 16, color: "#15120a", flexShrink: 0 }}>{r.leg}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 9.5, color: "var(--txt3)", fontFamily: "var(--num)", letterSpacing: "1px" }}>{r.venue} {r.raceNo}</span>
            <span style={{ fontFamily: "var(--display)", fontSize: 14.5, fontWeight: 800, color: "var(--txt)" }}>{r.name}</span>
            {r.class && <Pill kind="ghost" style={{ fontSize: 9 }}>{r.class}</Pill>}
          </div>
          <div style={{ fontSize: 10, color: "var(--txt3)", marginTop: 2 }}>{r.course} ・ 発走{r.time}</div>
        </div>
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <div style={{ fontFamily: "var(--num)", fontSize: 22, color: confColor(r.confidence), lineHeight: 1 }}>{r.confidence}</div>
          <div style={{ fontSize: 8.5, color: "var(--txt3)", marginTop: 2 }}>{confLabel(r.confidence)}</div>
        </div>
      </div>

      {/* レース後の結果表示 */}
      {r.result && (
        <div style={{ padding: "8px 13px", background: r.result.hit ? "var(--gold-soft)" : "color-mix(in srgb, var(--surface2) 50%, transparent)", borderBottom: "1px solid var(--line2)", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12 }}>{r.result.hit ? "🎯" : "✗"}</span>
          <span style={{ fontSize: 9.5, color: "var(--txt3)", letterSpacing: "1px" }}>勝馬</span>
          <span style={{ fontFamily: "var(--num)", fontSize: 14, color: "var(--gold-bright)" }}>{r.result.winNum}</span>
          <span style={{ fontSize: 12, color: "var(--txt)", fontWeight: 700 }}>{r.result.winName}</span>
          <span style={{ fontSize: 9.5, color: "var(--txt3)" }}>{r.result.winPop}番人気</span>
          <span style={{ marginLeft: "auto", fontSize: 10, color: r.result.hit ? "var(--gold-bright)" : "var(--txt3)" }}>
            {r.result.inTop5 ? `自分の${r.result.myMark}で的中` : "印なし(取りこぼし)"}
          </span>
        </div>
      )}

      {/* 上位5頭 */}
      <div style={{ padding: "8px 0" }}>
        {r.top.map((h, i) => {
          const isTop = i === 0;
          const isWinner = r.result && r.result.winNum === h.num;
          const barW = (h.prob / r.top[0].prob) * 100; // 相対バー
          return (
            <div key={h.num} style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 13px", background: isWinner ? "var(--gold-soft)" : "transparent" }}>
              <Mark mark={h.mark} size={18} />
              <span style={{ fontFamily: "var(--num)", fontSize: 14, color: "var(--txt2)", width: 20, textAlign: "center", flexShrink: 0 }}>{h.num}</span>
              <span style={{ fontSize: 12.5, color: isTop ? "var(--txt)" : "var(--txt2)", fontWeight: isTop ? 700 : 500, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{h.name}{isWinner && <span style={{ marginLeft: 6, fontSize: 9, color: "var(--gold-bright)" }}>🏆勝</span>}</span>
              <div style={{ width: 60, height: 5, borderRadius: 5, background: "rgba(255,255,255,0.05)", overflow: "hidden", flexShrink: 0 }}>
                <div style={{ width: `${barW}%`, height: "100%", background: isTop ? "var(--gold-grad)" : "rgba(216,182,89,0.4)" }} />
              </div>
              <span style={{ fontFamily: "var(--num)", fontSize: 12.5, color: isTop ? "var(--gold-bright)" : "var(--txt2)", width: 42, textAlign: "right", flexShrink: 0 }}>{h.prob.toFixed(1)}<span style={{ fontSize: 8.5, color: "var(--txt3)" }}>%</span></span>
              <span style={{ fontSize: 10, color: "var(--txt3)", width: 38, textAlign: "right", flexShrink: 0 }}>{h.odds.toFixed(1)}</span>
            </div>
          );
        })}
      </div>

      {/* TIP & 買い目 & 詳細リンク */}
      <div style={{ padding: "10px 13px 12px", borderTop: "1px solid var(--line2)" }}>
        <div style={{ fontSize: 11, color: "var(--txt2)", lineHeight: 1.75, textWrap: "pretty" }}>{r.tip}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 9 }}>
          <Pill kind="gold" style={{ fontSize: 9.5 }}>買い目</Pill>
          <span style={{ fontSize: 11, color: "var(--gold-bright)", fontWeight: 700 }}>{r.buy}</span>
        </div>
        {r.crossRef && (
          <div style={{ marginTop: 9, padding: "8px 10px", borderRadius: 8, background: "var(--gold-soft)", border: "1px solid var(--line2)", display: "flex", alignItems: "flex-start", gap: 7 }}>
            <span style={{ fontSize: 10 }}>🔮</span>
            <span style={{ fontSize: 10, color: "var(--txt2)", lineHeight: 1.65, flex: 1 }}>{r.crossRef}</span>
          </div>
        )}
        {hasRace && onOpenRace && (
          <div onClick={() => onOpenRace(r.raceId, "diag")} style={{ marginTop: 9, padding: "8px 10px", borderRadius: 8, background: "var(--surface2)", border: "1px solid var(--line)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11 }}>🔮</span>
            <span style={{ fontSize: 11.5, color: "var(--gold)", fontWeight: 700, flex: 1 }}>このレースのAI血統診断を見る</span>
            <span style={{ fontSize: 14, color: "var(--gold)" }}>›</span>
          </div>
        )}
      </div>
    </div>
  );
};

/* ===== レース後の結果バナー ===== */
const Win5ResultBanner = ({ res }) => {
  return (
    <div style={{ margin: "14px 14px 0", borderRadius: "var(--radius-lg)", padding: "16px 16px 14px", background: "var(--hero)", border: "1px solid var(--line)", boxShadow: "var(--glow)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 16 }}>🏁</span>
        <span style={{ fontFamily: "var(--num)", fontSize: 12, letterSpacing: "2.5px", color: "var(--gold)" }}>WIN5 RESULT</span>
        <Pill kind="ghost" style={{ marginLeft: "auto", fontSize: 9 }}>確定</Pill>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 9, color: "var(--txt3)", letterSpacing: "1px" }}>的中馬番</div>
          <div style={{ fontFamily: "var(--num)", fontSize: 18, color: "var(--gold-bright)", marginTop: 2, letterSpacing: "1px" }}>{res.hitNums}</div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: "var(--txt3)", letterSpacing: "1px" }}>払戻</div>
          <div style={{ fontFamily: "var(--num)", fontSize: 18, color: "var(--gold-bright)", marginTop: 2 }}>{res.payout}</div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: "var(--txt3)", letterSpacing: "1px" }}>的中票数</div>
          <div style={{ fontFamily: "var(--num)", fontSize: 18, color: "var(--txt)", marginTop: 2 }}>{res.hitTickets}<span style={{ fontSize: 10, color: "var(--txt3)" }}>票</span></div>
        </div>
      </div>
      <div style={{ fontSize: 11, color: "var(--txt2)", lineHeight: 1.7, textWrap: "pretty" }}>{res.summary}</div>

      {/* 推奨パターンの成績 */}
      {res.patternResults && res.patternResults.length > 0 && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--line2)" }}>
          <div style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "1px", marginBottom: 8 }}>推奨パターンの成績</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {res.patternResults.map((pr, i) => {
              const near = pr.hits === 4;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "var(--txt)", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{pr.label}</span>
                  <span style={{ fontFamily: "var(--num)", fontSize: 13, color: near ? "var(--gold-bright)" : "var(--txt2)" }}>{pr.hits}<span style={{ fontSize: 9, color: "var(--txt3)" }}>/5</span></span>
                  {near && <Pill kind="gold" style={{ fontSize: 8 }}>あと1</Pill>}
                  <span style={{ fontSize: 9, color: "var(--txt3)", width: 90, textAlign: "right", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>外: {pr.missRaces.join("・")}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* ===== 推奨買い目パターン ===== */
const Win5BetPatterns = ({ bp }) => {
  const [open, setOpen] = React.useState(0); // 開いているパターンのindex（最初=Bを開く）

  return (
    <div style={{ padding: "12px 14px 8px" }}>
      <SectionTitle jp={bp.title} en="BET PATTERNS" icon="🎫"
        right={<span style={{ fontSize: 10, color: "var(--txt3)" }}>{bp.budget}</span>} />

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {bp.patterns.map((p, i) => {
          const isOpen = open === i;
          return (
            <div key={i} style={{
              borderRadius: "var(--radius)", overflow: "hidden",
              background: p.best ? "var(--gold-soft)" : "var(--surface)",
              border: `1px solid ${p.best ? "var(--line)" : "var(--line2)"}`,
            }}>
              {/* ヘッダ（タップで開閉） */}
              <div onClick={() => setOpen(isOpen ? -1 : i)} style={{
                padding: "11px 13px", cursor: "pointer", display: "flex", alignItems: "center", gap: 9,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: p.best ? "var(--gold-bright)" : "var(--txt)" }}>{p.label}</span>
                    {p.best && <Pill kind="gold" style={{ fontSize: 8.5 }}>本命推奨</Pill>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <span style={{ fontFamily: "var(--num)", fontSize: 11, color: "var(--gold)", letterSpacing: "1px" }}>{p.formula}</span>
                    <span style={{ fontFamily: "var(--num)", fontSize: 12, color: "var(--txt)", fontWeight: 700 }}>= {p.points}点</span>
                    <span style={{ fontSize: 10, color: "var(--txt3)" }}>的中率 {p.hitRate}%</span>
                  </div>
                </div>
                <span style={{ fontSize: 14, color: "var(--txt3)", transform: isOpen ? "rotate(90deg)" : "none", transition: "transform .2s" }}>›</span>
              </div>

              {/* 展開部 */}
              {isOpen && (
                <div style={{ padding: "0 13px 13px" }}>
                  <div style={{ fontSize: 11, color: "var(--txt2)", lineHeight: 1.7, marginBottom: 10, textWrap: "pretty" }}>{p.desc}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {p.legs.map((leg) => (
                      <div key={leg.leg} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--gold-grad)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--num)", fontSize: 13, color: "#15120a", flexShrink: 0 }}>{leg.leg}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 10, color: "var(--txt3)", marginBottom: 3 }}>{leg.name}（{leg.picks.length}頭）</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                            {leg.picks.map((h) => (
                              <span key={h.num} style={{
                                display: "inline-flex", alignItems: "center", gap: 3, padding: "3px 7px",
                                borderRadius: 6, background: "var(--surface2)", border: "1px solid var(--line2)",
                                fontSize: 10.5, color: "var(--txt)",
                              }}>
                                <span style={{ fontFamily: "var(--num)", fontSize: 11, color: "var(--gold)" }}>{h.num}</span>
                                {h.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 9.5, color: "var(--txt3)", marginTop: 10, lineHeight: 1.7 }}>{bp.note}</div>
    </div>
  );
};

Object.assign(window, { Win5Screen, Win5RaceCard, Win5BetPatterns, Win5ResultBanner });
