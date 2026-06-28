/* ===== 血統くん refined — 汎用レースローダー =====
   JSON駆動の各レース（しらさぎS・府中牝馬S 等）を window.KB_RACES[id] に格納。
   印付与は「危険馬扱いの馬はシミュ上位でも◎を譲る」設計で、予想として読める形にする。
*/

(function () {
  const FRAME = (window.KB && window.KB.FRAME) || {
    1: { bg: "#ffffff", tx: "#222", b: "#bbb" },
    2: { bg: "#1a1a1a", tx: "#fff", b: "#1a1a1a" },
    3: { bg: "#e0382f", tx: "#fff", b: "#e0382f" },
    4: { bg: "#2563c4", tx: "#fff", b: "#2563c4" },
    5: { bg: "#e8c832", tx: "#2a2204", b: "#cdae1c" },
    6: { bg: "#2fa54a", tx: "#fff", b: "#2fa54a" },
    7: { bg: "#e8842e", tx: "#fff", b: "#e8842e" },
    8: { bg: "#e87aa4", tx: "#fff", b: "#e87aa4" },
  };

  // レース固有のメタ（emoji・shortName・enName）。JSONに無い表示用情報を補完
  const RACE_META = {
    shirasagiS2026: { short: "しらさぎS", en: "SHIRASAGI STAKES", emoji: "🦢", grade: "G3" },
    fuchuFillies2026: { short: "府中牝馬S", en: "FUCHU HIMBA S", emoji: "🌸", grade: "G2" },
    hakodateKinen2026: { short: "函館記念", en: "HAKODATE KINEN", emoji: "🐻", grade: "G3" },
  };

  // 戦略コメント（レースごとに手当て。なければ自動）
  const VERDICTS = {
    shirasagiS2026:
      "シミュ最上位の ◎カズミクラーシュ を軸に、◯スマートワイス・▲エルトンバローズ で本線。先行有利の高速馬場想定で、馬場の本命に推す ★エコロアルバ(差し3歳53kg) を穴に絡める。8歳の ⚠サイルーン・メイショウシンタケ は危険馬として軽視。",
    fuchuFillies2026:
      "シミュ1位の ⚠ヴァルキリーバースは「4歳×1-3番人気【0.0.1.11】」のデータ的に危険、軸を譲る判断。差し有利の馬場想定で、◎エストゥペンダ(差し)・○コガネノソラ(差し)・▲ルージュソリテールの差し本線で組み立て、★マカナ(差し7番人気)を穴に。前走ヴィクトリアM組の ⚠ニシノティアモ も同様に軽視。",
    hakodateKinen2026:
      "6/27時点で芝は重め・時計かかる馬場。先行〜好位の地力型が優位で、◎エコロディノス(キタサンブラック×先行×G1帰り)を軸に、○フィーリウス・▲ファウストラーゼンの先行本線。函館記念の黄金データ「前走重賞×軽ハンデ」に合致する ★オニャンコポン(54kg・前走G3) を穴に。高速上がり頼みの ⚠マジックサンズ(58kg差し)・⚠イガッチ(3勝クラスから格上挑戦)は人気でも割引。波乱必至の一戦。",
  };

  // 戦略の役割理由（個別レース）
  const STRATEGY_NOTES = {
    shirasagiS2026: {
      axis: "先行×先行有利の高速馬場。シミュ勝率最上位で安定",
      counter: "川田×渡月橋S1着。先行力でカバー",
      hole: "京王杯SC6着→マイル戻し。差し脚質の持続型",
      bighole: "3歳53kg×NHKマイル組。馬場の差し本線推奨",
    },
    fuchuFillies2026: {
      axis: "差し有利の東京馬場で前走京都牝馬3着。差し脚質×先行有利でない馬場",
      counter: "差し脚質×東京の長い直線。ゴールドシップ産駒の持続力",
      hole: "シミュ2位タイ。差しの長く脚を使えるタイプ",
      bighole: "差し7番人気の妙味。前走3勝1着の上昇気配",
    },
    hakodateKinen2026: {
      axis: "キタサンブラック産駒の持続力×先行力。重め馬場のベスト。前走G1は度外視可",
      counter: "キタサンブラック産駒×3勝クラス1着の上昇度。重め馬場の持続力",
      hole: "前走大阪杯G1帰りの中央開催組。内枠先行で巻き返し",
      bighole: "54kg軽ハンデ×前走G3×前走5着以下＝函館記念の穴データに完全合致",
    },
  };

  window.KB_RACES = window.KB_RACES || {};

  function loadRace(jsonPath, raceId) {
    return fetch(jsonPath)
      .then((r) => r.json())
      .then((d) => {
        const meta = RACE_META[raceId] || {};
        const byNum = {};
        d.runners.forEach((r) => (byNum[r.num] = r));

        const simByNum = {};
        (d.simulation && d.simulation.results || []).forEach((s) => (simByNum[s.num] = s));

        const ranked = [...d.runners]
          .map((r) => ({
            ...r,
            score: simByNum[r.num] ? simByNum[r.num].score : 0,
            winPct: simByNum[r.num] ? simByNum[r.num].winPct : 0,
            place2Pct: simByNum[r.num] ? simByNum[r.num].place2Pct : 0,
            place3Pct: simByNum[r.num] ? simByNum[r.num].place3Pct : 0,
            avgRank: simByNum[r.num] ? simByNum[r.num].avgRank : 18,
          }))
          .sort((a, b) => b.score - a.score);

        const dangerNums = new Set((d.prevDayAnalysis && d.prevDayAnalysis.dangerHorses || []).map((h) => h.num));
        const pickupArr = (d.prevDayAnalysis && d.prevDayAnalysis.pickupHorses) || [];
        const pickupNums = new Set(pickupArr.map((p) => p.num));

        // 印付与: 危険馬は◎○▲△を譲って ⚠ 表示。それ以外をシミュ降順で ◎○▲△ に。
        // ★はpickup3頭目（穴推し）など、印未割当のpickupに付与。
        const markMap = {};
        // 1) 危険馬を ⚠ で先に確保
        dangerNums.forEach((n) => (markMap[n] = "⚠"));
        // 2) シミュ降順で、危険馬を飛ばしながら ◎○▲△ を配る
        const mainMarks = ["◎", "○", "▲", "△"];
        let mi = 0;
        for (const r of ranked) {
          if (dangerNums.has(r.num)) continue;
          if (mi >= mainMarks.length) break;
          markMap[r.num] = mainMarks[mi++];
        }
        // 3) pickup（馬場の注目馬）で印未割当なら ★
        pickupArr.forEach((p) => {
          if (!markMap[p.num]) markMap[p.num] = "★";
        });

        // 総合ランキング配列
        const overall = ranked.map((r, i) => ({
          rank: i + 1,
          num: r.num,
          mark: markMap[r.num] || "",
          total: Math.round(r.score),
          conf: Math.round(r.place3Pct),
          blood: Math.round(r.score),
          bias: dangerNums.has(r.num) ? 30 : Math.round(70 - (i * 3)),
          sim: Math.round(r.place3Pct + r.winPct * 0.5),
          tag: pickupNums.has(r.num) ? "ana" : (dangerNums.has(r.num) ? "over" : ""),
        }));

        // 戦略構築
        const notes = STRATEGY_NOTES[raceId] || {};
        const axMark = overall.find((o) => o.mark === "◎");
        const coMark = overall.find((o) => o.mark === "○");
        const hoMark = overall.find((o) => o.mark === "▲");
        const bgMark = overall.find((o) => o.mark === "★");
        const danger = (d.prevDayAnalysis && d.prevDayAnalysis.dangerHorses || []).map((h) => ({ num: h.num, why: h.note }));

        const strategy = {
          verdict: VERDICTS[raceId] || "シミュ上位を軸に、馬場の傾向を加味した買い目。",
          axis: axMark ? { num: axMark.num, role: "◎ 本命", why: notes.axis || "シミュ最上位の堅実な軸" } : null,
          counter: coMark ? { num: coMark.num, role: "○ 対抗", why: notes.counter || "シミュ2位の連対候補" } : null,
          hole: hoMark ? { num: hoMark.num, role: "▲ 単穴", why: notes.hole || "シミュ3位の3着候補" } : null,
          bighole: bgMark ? { num: bgMark.num, role: "★ 穴", why: notes.bighole || "馬場傾向の注目馬" } : null,
          danger,
        };

        window.KB_RACES[raceId] = {
          ready: true,
          race: {
            id: raceId,
            grade: meta.grade || "G3",
            name: d.race_name,
            short: meta.short || d.race_name,
            en: meta.en || "",
            date: d.date,
            dow: dowFromDate(d.date),
            venue: d.venue,
            course: d.course,
            weather: "晴",
            track: d.trackCond,
            pace: d.expectedPace,
            field: d.runners.length,
            emoji: meta.emoji || "🏇",
            result: d.result || null,
            review: d.review || null,
            verification: d.verification || null,
          },
          runners: d.runners,
          byNum,
          ranked,
          overall,
          markMap,
          strategy,
          trends: d.trends || {},
          prevDayAnalysis: d.prevDayAnalysis || {},
          simulation: d.simulation || {},
          FRAME,
        };
        document.dispatchEvent(new CustomEvent("kb-race-loaded", { detail: { raceId } }));
      })
      .catch((err) => {
        console.error("[" + raceId + "] JSON load failed:", err);
        window.KB_RACES[raceId] = { ready: false, error: String(err) };
      });
  }

  function dowFromDate(s) {
    // "2026/6/21" → "日"
    try {
      const m = (s || "").match(/(\d+)\/(\d+)\/(\d+)/);
      if (!m) return "";
      const dt = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]));
      return ["日", "月", "火", "水", "木", "金", "土"][dt.getDay()];
    } catch (e) { return ""; }
  }

  // 読み込むレース
  loadRace("shirasagiS2026.json", "shirasagiS2026");
  loadRace("fuchuFillies2026.json", "fuchuFillies2026");
  loadRace("hakodateKinen2026.json", "hakodateKinen2026");

  // 旧 KB_SHIRASAGI とのエイリアス（互換）
  document.addEventListener("kb-race-loaded", (e) => {
    if (e.detail.raceId === "shirasagiS2026") {
      window.KB_SHIRASAGI = window.KB_RACES.shirasagiS2026;
      document.dispatchEvent(new CustomEvent("kb-shirasagi-loaded"));
    }
  });
})();
