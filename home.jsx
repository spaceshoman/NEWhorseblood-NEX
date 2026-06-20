/* ===== 血統くん refined — 予想ホーム ===== */

const HomeScreen = ({ onOpenRace }) => {
  const { race, nextRace, nextRaces, calendar } = window.KB;
  const racesArr = nextRaces || [nextRace];
  const main = racesArr[0];
  const sub = racesArr[1] || null;
  const [grade, setGrade] = React.useState("ALL");
  const grades = ["ALL", "G1", "G2", "G3"];
  const list = calendar.filter((c) => grade === "ALL" || c.grade === grade);
  const live = list.filter((c) => c.status === "live");
  const upcoming = list.filter((c) => c.status === "soon");
  const done = list.filter((c) => c.status === "done");

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* NEXT RACE ヒーロー（メイン） */}
      <div onClick={() => onOpenRace(main.id, "diag")} style={{
        margin: "14px 14px 0", borderRadius: "var(--radius-lg)", padding: "20px 18px 18px",
        background: "var(--hero)", border: "1px solid var(--line)", position: "relative", overflow: "hidden",
        cursor: "pointer", boxShadow: "var(--glow)",
      }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "var(--radius-lg)", border: "1px solid rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--num)", fontSize: 11, letterSpacing: "4px", color: "var(--gold)", fontWeight: 400 }}>NEXT RACE</span>
          <Pill kind="pos" style={{ fontSize: 9.5 }}>● 予想公開中</Pill>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
          <GradeBadge grade={main.grade} />
          <span style={{ fontSize: 11, color: "var(--txt3)", fontFamily: "var(--num)", letterSpacing: "1px" }}>{main.date}（{main.dow}）{main.venue}</span>
        </div>
        <div style={{ fontFamily: "var(--display)", fontWeight: 900, fontSize: 34, color: "var(--txt)", letterSpacing: "1.5px", marginTop: 6, lineHeight: 1.1 }}>
          {main.emoji} {main.short}
        </div>
        <div style={{ fontFamily: "var(--num)", fontSize: 12, letterSpacing: "2px", color: "var(--gold)", opacity: 0.8, marginTop: 4 }}>{main.en}</div>
        <div style={{ fontSize: 10.5, color: "var(--txt2)", marginTop: 8 }}>{main.tagline}</div>
        <div style={{ display: "flex", gap: 14, marginTop: 14, alignItems: "center" }}>
          {[["コース", main.course], ["発走", main.post]].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 9, color: "var(--txt3)", letterSpacing: "1px" }}>{k}</div>
              <div style={{ fontSize: 13, color: "var(--txt)", fontWeight: 700, marginTop: 2 }}>{v}</div>
            </div>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, color: "var(--gold)", fontSize: 12, fontWeight: 700 }}>
            AI診断を見る <span style={{ fontSize: 15 }}>›</span>
          </div>
        </div>
      </div>

      {/* 同日開催のサブレース */}
      {sub && (
        <div onClick={() => onOpenRace(sub.id, "diag")} style={{
          margin: "10px 14px 0", borderRadius: "var(--radius)", padding: "12px 14px",
          background: "var(--surface)", border: "1px solid var(--line)", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{ fontFamily: "var(--num)", fontSize: 10, letterSpacing: "2.5px", color: "var(--gold)", writingMode: "vertical-rl", textOrientation: "mixed" }}>SAME&nbsp;DAY</div>
          <div style={{ width: 1, height: 32, background: "var(--line2)" }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <GradeBadge grade={sub.grade} small />
              <span style={{ fontFamily: "var(--display)", fontSize: 15, fontWeight: 800, color: "var(--txt)" }}>{sub.emoji} {sub.short}</span>
            </div>
            <div style={{ fontSize: 10, color: "var(--txt3)", marginTop: 3 }}>
              {sub.venue} ・ {sub.course} ・ 発走{sub.post} ・ {sub.tagline}
            </div>
          </div>
          <span style={{ color: "var(--gold)", fontSize: 18 }}>›</span>
        </div>
      )}

      {/* 3つの目 予告 */}
      <div style={{ display: "flex", gap: 8, margin: "12px 14px 0" }}>
        {[["🧬", "血統"], ["🏟️", "馬場傾向"], ["🎲", "1000回"]].map(([e, l]) => (
          <div key={l} style={{ flex: 1, textAlign: "center", padding: "8px 4px", borderRadius: "var(--radius)", background: "var(--surface)", border: "1px solid var(--line2)" }}>
            <div style={{ fontSize: 15 }}>{e}</div>
            <div style={{ fontSize: 9.5, color: "var(--txt2)", marginTop: 3, fontWeight: 600 }}>{l}</div>
          </div>
        ))}
        <div style={{ flex: 0.7, display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 4px", borderRadius: "var(--radius)", background: "var(--gold-soft)", border: "1px solid var(--line)" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 15 }}>⚖️</div>
            <div style={{ fontSize: 9.5, color: "var(--gold-bright)", marginTop: 3, fontWeight: 700 }}>総合</div>
          </div>
        </div>
      </div>

      {/* グレードフィルタ */}
      <div style={{ display: "flex", gap: 7, padding: "18px 14px 10px", position: "sticky", top: 60, zIndex: 20, background: "color-mix(in srgb, var(--bg) 92%, transparent)", backdropFilter: "blur(8px)" }}>
        {grades.map((g) => {
          const on = grade === g;
          return (
            <button key={g} onClick={() => setGrade(g)} style={{
              padding: "5px 14px", borderRadius: 20, border: `1px solid ${on ? "transparent" : "var(--line2)"}`,
              background: on ? "var(--gold-grad)" : "transparent", color: on ? "#15120a" : "var(--txt2)",
              fontFamily: "var(--num)", fontSize: 13, letterSpacing: "1px", fontWeight: on ? 400 : 400, cursor: "pointer",
            }}>{g}</button>
          );
        })}
      </div>

      <div style={{ padding: "0 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        {live.length > 0 && <RowLabel text="開催中・発売中" />}
        {live.map((c) => <RaceRow key={c.id} c={c} onOpenRace={onOpenRace} />)}
        {upcoming.length > 0 && <RowLabel text="今後の重賞" />}
        {upcoming.map((c) => <RaceRow key={c.id} c={c} onOpenRace={onOpenRace} />)}
        {done.length > 0 && <RowLabel text="開催終了" />}
        {done.map((c) => <RaceRow key={c.id} c={c} onOpenRace={onOpenRace} />)}
      </div>
    </div>
  );
};

const RowLabel = ({ text }) => (
  <div style={{ fontFamily: "var(--num)", fontSize: 11, letterSpacing: "3px", color: "var(--txt3)", margin: "12px 2px 2px" }}>{text}</div>
);

const RaceRow = ({ c, onOpenRace }) => {
  const live = c.status === "live";
  const done = c.status === "done";
  const clickable = live || done;
  const onClick = () => {
    if (live) onOpenRace(c.id, "diag");
    else if (done) onOpenRace(c.id, "review");
  };
  return (
    <div onClick={clickable ? onClick : undefined} style={{
      display: "flex", alignItems: "center", gap: 12, padding: "13px 14px",
      background: live ? "var(--surface)" : "transparent",
      border: `1px solid ${live ? "var(--line)" : "var(--line2)"}`,
      borderRadius: "var(--radius)", cursor: clickable ? "pointer" : "default", opacity: done ? 0.78 : 1,
    }}>
      <div style={{ textAlign: "center", width: 38, flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--num)", fontSize: 18, color: "var(--gold)", lineHeight: 1 }}>{c.date}</div>
        <div style={{ fontSize: 9, color: "var(--txt3)", marginTop: 1 }}>{c.dow}</div>
      </div>
      <div style={{ width: 1, height: 30, background: "var(--line2)" }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <GradeBadge grade={c.grade} small />
          <span style={{ fontFamily: "var(--display)", fontSize: 15, fontWeight: 700, color: "var(--txt)" }}>{c.emoji} {c.name}</span>
        </div>
        <div style={{ fontSize: 10.5, color: "var(--txt3)", marginTop: 3 }}>
          {c.venue} {c.course}{c.note ? ` ・ ${c.note}` : ""}{done && c.win ? ` ・ 勝 ${c.win}` : ""}{live ? ` ・ ${c.field}頭立て` : ""}
        </div>
      </div>
      {live ? <span style={{ color: "var(--gold)", fontSize: 18 }}>›</span> :
        done ? <Pill kind="gold" style={{ fontSize: 9 }}>回顧 ›</Pill> :
          <Pill kind="ghost" style={{ fontSize: 9 }}>予定</Pill>}
    </div>
  );
};

Object.assign(window, { HomeScreen });
