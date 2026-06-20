/* ===== 血統くん refined — しらさぎS データローダー ===== */
/* shirasagiS2026.json を読み込み、印付与・上位抽出・整形して
   window.KB_SHIRASAGI として公開する。
*/

(function () {
  // 既存(window.KB)の枠番カラーを共有
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

  window.KB_SHIRASAGI = { ready: false };

  fetch("shirasagiS2026.json")
    .then((r) => r.json())
    .then((d) => {
      // 共通アクセサ
      const byNum = {};
      d.runners.forEach((r) => (byNum[r.num] = r));

      // シミュ結果に runner 情報をマージ
      const simByNum = {};
      (d.simulation && d.simulation.results || []).forEach((s) => (simByNum[s.num] = s));

      // シミュスコア降順で並べた配列
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

      // 印の自動付与（スコア降順 ◎○▲△、prevDayAnalysis.dangerHorses に ⚠）
      const dangerNums = new Set((d.prevDayAnalysis && d.prevDayAnalysis.dangerHorses || []).map((h) => h.num));
      const markMap = {};
      ranked.forEach((r, i) => {
        if (dangerNums.has(r.num)) {
          markMap[r.num] = "⚠";
        } else if (i === 0) markMap[r.num] = "◎";
        else if (i === 1) markMap[r.num] = "○";
        else if (i === 2) markMap[r.num] = "▲";
        else if (i === 3) markMap[r.num] = "△";
      });
      // 馬場の本命（prevDayAnalysis.pickupHorses[0]）を ★穴 候補としてマーク
      const pickup = (d.prevDayAnalysis && d.prevDayAnalysis.pickupHorses) || [];
      // 上位印に入っていない pickup を ★ として登録（人気薄推奨）
      pickup.forEach((p) => {
        if (!markMap[p.num]) markMap[p.num] = "★";
      });

      // 総合ランキング（◎○▲を持つ馬を上に）
      const overall = ranked.map((r, i) => ({
        rank: i + 1,
        num: r.num,
        mark: markMap[r.num] || "",
        total: Math.round(r.score),
        conf: Math.round(r.place3Pct), // 信頼度=複勝率%
        blood: Math.round(r.score),    // 暫定: 血統の目=シミュスコア
        bias: dangerNums.has(r.num) ? 30 : Math.round(70 - (i * 3)), // 馬場の目=暫定式
        sim: Math.round(r.place3Pct + r.winPct * 0.5), // シミュの目=複勝率寄り
        tag: pickup.find((p) => p.num === r.num) ? "ana" : (dangerNums.has(r.num) ? "over" : ""),
      }));

      // 買い目戦略の自動生成（◎○▲★を軸に）
      const findOverall = (mark) => overall.find((o) => o.mark === mark);
      const ax = findOverall("◎"), co = findOverall("○"), ho = findOverall("▲"), bg = findOverall("★");
      const dangerArr = (d.prevDayAnalysis && d.prevDayAnalysis.dangerHorses || []).map((h) => ({
        num: h.num, why: h.note,
      }));

      const strategy = {
        verdict: "シミュ最上位の ◎カズミクラーシュ を軸に、◯スマートワイス・▲エルトンバローズ で本線。先行有利の高速馬場想定で、馬場の本命に推す ★エコロアルバ(差し3歳53kg) を穴に絡める。8歳の ⚠サイルーン・メイショウシンタケ は危険馬として軽視。",
        axis: ax ? { num: ax.num, role: "◎ 本命", why: byNum[ax.num] ? `先行×先行有利の高速馬場。シミュ勝率${ranked[0].winPct.toFixed(1)}%でトップ` : "" } : null,
        counter: co ? { num: co.num, role: "○ 対抗", why: "川田×渡月橋S1着の好調。先行力でカバー" } : null,
        hole: ho ? { num: ho.num, role: "▲ 単穴", why: "京王杯SC6着→マイル戻し。差し脚質も持続型" } : null,
        bighole: bg ? { num: bg.num, role: "★ 穴", why: "3歳53kg×NHKマイル組。馬場の差し本線" } : null,
        danger: dangerArr,
      };

      // 全部 window へ
      window.KB_SHIRASAGI = {
        ready: true,
        race: {
          id: d.id,
          grade: "G3",
          name: d.race_name,
          short: "しらさぎS",
          en: "SHIRASAGI STAKES",
          date: d.date,
          dow: "日",
          venue: d.venue,
          course: d.course,
          weather: "晴",
          track: d.trackCond,
          pace: d.expectedPace,
          field: d.runners.length,
          emoji: "🦢",
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
      // データが届いたら UI を再描画させる軽いトリガ
      document.dispatchEvent(new CustomEvent("kb-shirasagi-loaded"));
    })
    .catch((err) => {
      console.error("[shirasagi] JSON load failed:", err);
      window.KB_SHIRASAGI = { ready: false, error: String(err) };
    });
})();
