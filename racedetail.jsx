/* ===== 血統くん refined — レース詳細シェル + 出馬表 ===== */

const scoreTierColor = (s) =>
  s >= 85 ? "var(--gold-bright)" : s >= 70 ? "var(--gold)" : s >= 55 ? "#cf9a5a" : "var(--txt3)";

const RaceDetail = ({ t, onBack }) => {
  const { race } = window.KB;
  const [view, setView] = React.useState("diag"); // list | diag
  return (
    <div>
      <Header title={race.short} sub={race.en} onBack={onBack} />

      {/* レースメタ */}
      <div style={{ padding: "14px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <GradeBadge grade={race.grade} />
          <span style={{ fontFamily: "var(--display)", fontSize: 22, fontWeight: 900, color: "var(--txt)", letterSpacing: ".5px" }}>{race.emoji} {race.name}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {[`${race.date}（${race.dow}）`, race.venue, race.course, `馬場 ${race.track}`, race.weather, `${race.field}頭`].map((x) => (
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
              fontFamily: "var(--display)", fontWeight: 700, fontSize: 13.5,
              background: on ? "var(--gold-grad)" : "transparent", color: on ? "#15120a" : "var(--txt2)",
              boxShadow: on ? "var(--glow)" : "none", transition: "all .2s",
            }}>{label}</button>
          );
        })}
      </div>

      {view === "list" ? <EntryTable /> : <Diagnosis t={t} />}
    </div>
  );
};

/* ===== 出馬表 ===== */
const EntryTable = () => {
  const { runners } = window.KB;
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
              <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end", marginTop: 3 }}>
                <span style={{ fontFamily: "var(--num)", fontSize: 14, color: r.pop <= 3 ? "var(--gold)" : "var(--txt3)", letterSpacing: ".5px" }}>{r.pop}人気</span>
                <span style={{ fontSize: 11, color: "var(--txt2)", fontWeight: 700 }}>{r.tan.toFixed(1)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

Object.assign(window, { RaceDetail, EntryTable, scoreTierColor });
