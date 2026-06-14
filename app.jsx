/* ===== 血統くん refined — メインアプリ ===== */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/ {
  "tone": "classic",
  "diagLayout": "card",
  "chartStyle": "rich"
} /*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [tab, setTab] = React.useState("home");
  const [raceOpen, setRaceOpen] = React.useState(false);

  const tone = window.KB_TONES[t.tone] || window.KB_TONES.classic;

  const openRace = (id) => { setRaceOpen(true); window.scrollTo(0, 0); };
  const backHome = () => { setRaceOpen(false); window.scrollTo(0, 0); };
  const goTab = (id) => { setTab(id); setRaceOpen(false); window.scrollTo(0, 0); };

  let screen;
  if (tab === "home") screen = raceOpen ? <RaceDetail t={t} onBack={backHome} /> : <HomeScreenWrap onOpenRace={openRace} />;
  else if (tab === "analysis") screen = <AnalysisScreen t={t} />;
  else if (tab === "db") screen = <DBScreen />;
  else if (tab === "betting") screen = <BettingScreen />;

  return (
    <div className="kb-app" style={{ ...tone.vars, background: "var(--bg)", color: "var(--txt)", minHeight: "100vh" }}>
      <div className="kb-page-tex" />
      {!raceOpen && tab === "home" && <Header title="血統くん" sub="BLOODLINE PREDICTOR" right={<Pill kind="ghost" style={{ fontSize: 9 }}>2026</Pill>} />}
      <div style={{ position: "relative", zIndex: 1 }}>{screen}</div>
      <BottomNav tab={tab} onTab={goTab} />

      <TweaksPanel>
        <TweakSection label="全体トーン（4案）" />
        <TonePicker value={t.tone} onChange={(v) => setTweak("tone", v)} />
        <TweakSection label="AI診断 ① 血統の見せ方" />
        <TweakRadio label="表現" value={t.diagLayout}
          options={[{ value: "card", label: "カード" }, { value: "compact", label: "コンパクト" }, { value: "karte", label: "カルテ" }]}
          onChange={(v) => setTweak("diagLayout", v)} />
        <TweakSection label="チャートの見せ方" />
        <TweakRadio label="様式" value={t.chartStyle}
          options={[{ value: "rich", label: "リッチ" }, { value: "minimal", label: "ミニマル" }]}
          onChange={(v) => setTweak("chartStyle", v)} />
      </TweaksPanel>
    </div>
  );
}

/* ホームは Header を内包しないので wrap */
const HomeScreenWrap = ({ onOpenRace }) => <HomeScreen onOpenRace={onOpenRace} />;

/* トーン選択（カスタム・スウォッチ） */
const TonePicker = ({ value, onChange }) => {
  const tones = window.KB_TONES;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
      {Object.entries(tones).map(([id, tn]) => {
        const on = value === id;
        const v = tn.vars;
        return (
          <button key={id} onClick={() => onChange(id)} style={{
            padding: 0, borderRadius: 10, overflow: "hidden", cursor: "pointer", textAlign: "left",
            border: `1.5px solid ${on ? "#caa84e" : "rgba(0,0,0,0.12)"}`, background: "#fff",
          }}>
            <div style={{ height: 30, background: v["--hero"], display: "flex", alignItems: "center", padding: "0 9px" }}>
              <span style={{ width: 14, height: 14, borderRadius: 4, background: v["--gold-grad"] }} />
              <span style={{ width: 9, height: 9, borderRadius: 3, background: v["--pos"], marginLeft: 5 }} />
            </div>
            <div style={{ padding: "5px 9px 6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "#29261b" }}>{tn.label}</span>
              <span style={{ fontSize: 7.5, letterSpacing: "1px", color: "#8a8578" }}>{tn.en}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
