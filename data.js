/* ===== 血統くん refined — データ層 ===== */
/* 実データ: 第67回 宝塚記念 (2026/6/14 阪神 芝2200m 良) 全18頭 */

window.KB = (function () {
  const FRAME = {
    1: { bg: "#ffffff", tx: "#222", b: "#bbb" },
    2: { bg: "#1a1a1a", tx: "#fff", b: "#1a1a1a" },
    3: { bg: "#e0382f", tx: "#fff", b: "#e0382f" },
    4: { bg: "#2563c4", tx: "#fff", b: "#2563c4" },
    5: { bg: "#e8c832", tx: "#2a2204", b: "#cdae1c" },
    6: { bg: "#2fa54a", tx: "#fff", b: "#2fa54a" },
    7: { bg: "#e8842e", tx: "#fff", b: "#e8842e" },
    8: { bg: "#e87aa4", tx: "#fff", b: "#e87aa4" },
  };

  const race = {
    id: "takarazuka2026",
    grade: "G1",
    name: "第67回 宝塚記念",
    short: "宝塚記念",
    en: "TAKARAZUKA KINEN",
    date: "2026.6.14",
    dow: "日",
    venue: "阪神",
    course: "芝2200m",
    weather: "晴",
    track: "良",
    pace: "標準〜ややハイ",
    field: 18,
    emoji: "🌟",
  };

  // 出走馬（実データ）
  const runners = [
    { num: 1, frame: 1, name: "ダノンデサイル", sire: "エピファネイア", bms: "Congrats", jockey: "戸崎圭太", age: 5, sex: "牡", pop: 5, tan: 7.6, style: "差し", win: "日本ダービー" },
    { num: 2, frame: 1, name: "ミュージアムマイル", sire: "リオンディーズ", bms: "ハーツクライ", jockey: "D.レーン", age: 4, sex: "牡", pop: 4, tan: 5.9, style: "追込", win: "有馬記念" },
    { num: 3, frame: 2, name: "シュガークン", sire: "ドゥラメンテ", bms: "サクラバクシンオー", jockey: "吉村誠之助", age: 5, sex: "牡", pop: 17, tan: 270.2, style: "先行", win: "青葉賞" },
    { num: 4, frame: 2, name: "ミクニインスパイア", sire: "アドマイヤマーズ", bms: "ティンバーカントリー", jockey: "丹内祐次", age: 4, sex: "牡", pop: 8, tan: 57.2, style: "先行", win: "" },
    { num: 5, frame: 3, name: "クロワデュノール", sire: "キタサンブラック", bms: "Cape Cross", jockey: "北村友一", age: 4, sex: "牡", pop: 1, tan: 2.7, style: "先行", win: "天皇賞（春）" },
    { num: 6, frame: 3, name: "ビザンチンドリーム", sire: "エピファネイア", bms: "ジャングルポケット", jockey: "西村淳也", age: 5, sex: "牡", pop: 7, tan: 29.8, style: "追込", win: "フォワ賞" },
    { num: 7, frame: 4, name: "ファミリータイム", sire: "リアルスティール", bms: "Galileo", jockey: "幸英明", age: 5, sex: "牡", pop: 18, tan: 364.2, style: "逃げ", win: "" },
    { num: 8, frame: 4, name: "タガノデュード", sire: "ヤマカツエース", bms: "ハーツクライ", jockey: "高杉吏麒", age: 5, sex: "牡", pop: 12, tan: 86.4, style: "追込", win: "小倉大賞典" },
    { num: 9, frame: 5, name: "コスモキュランダ", sire: "アルアイン", bms: "Southern Image", jockey: "横山武史", age: 5, sex: "牡", pop: 9, tan: 60.5, style: "先行", win: "弥生賞" },
    { num: 10, frame: 5, name: "ジューンテイク", sire: "キズナ", bms: "シンボリクリスエス", jockey: "松山弘平", age: 5, sex: "牡", pop: 14, tan: 165.5, style: "先行", win: "京都記念" },
    { num: 11, frame: 6, name: "シンエンペラー", sire: "Siyouni", bms: "Galileo", jockey: "坂井瑠星", age: 5, sex: "牡", pop: 11, tan: 76.6, style: "差し", win: "京都2歳S" },
    { num: 12, frame: 6, name: "マイネルエンペラー", sire: "ゴールドシップ", bms: "ロージズインメイ", jockey: "川田将雅", age: 6, sex: "牡", pop: 15, tan: 172.7, style: "先行", win: "" },
    { num: 13, frame: 7, name: "シェイクユアハート", sire: "ハーツクライ", bms: "Sri Pekan", jockey: "古川吉洋", age: 6, sex: "牡", pop: 10, tan: 64.9, style: "差し", win: "金鯱賞" },
    { num: 14, frame: 7, name: "スティンガーグラス", sire: "キズナ", bms: "Not For Sale", jockey: "岩田望来", age: 5, sex: "牡", pop: 16, tan: 192.0, style: "先行", win: "ダイヤモンドS" },
    { num: 15, frame: 7, name: "マイユニバース", sire: "レイデオロ", bms: "ネオユニヴァース", jockey: "横山典弘", age: 4, sex: "牡", pop: 6, tan: 17.1, style: "差し", win: "日経賞" },
    { num: 16, frame: 8, name: "メイショウタバル", sire: "ゴールドシップ", bms: "フレンチデピュティ", jockey: "武豊", age: 5, sex: "牡", pop: 2, tan: 4.8, style: "逃げ", win: "宝塚記念" },
    { num: 17, frame: 8, name: "レガレイラ", sire: "スワーヴリチャード", bms: "ハービンジャー", jockey: "C.ルメール", age: 5, sex: "牝", pop: 3, tan: 5.5, style: "追込", win: "有馬記念" },
    { num: 18, frame: 8, name: "ミステリーウェイ", sire: "ジャスタウェイ", bms: "High Chaparral", jockey: "松本大輝", age: 8, sex: "せ", pop: 13, tan: 135.9, style: "逃げ", win: "AR共和国杯" },
  ];

  // AI血統診断（宝塚記念 阪神2200m 良 / 血統スコアリング v2.5）
  // tag: 'ana'=穴候補(スコア>人気) / 'over'=人気先行(人気>スコア)
  const diag = [
    { rank: 1, mark: "◎", num: 5, score: 89, g: { e: 92, t: 85, j: 78 },
      str: ["キタサンブラックの中距離安定感", "先行有利の枠と展開", "充実の4歳世代を代表"], weak: ["古馬G1は初対戦"], tag: null, jvs: { label: "北村友×阪神 巧者", s: 7 } },
    { rank: 2, mark: "○", num: 16, score: 84, g: { e: 86, t: 90, j: 88 },
      str: ["ゴールドシップ産駒のタフ適性", "前年覇者・阪神2200の鬼", "武豊×逃げで主導権"], weak: ["締まった流れで失速も"], tag: null, jvs: { label: "武豊×阪神 鉄板", s: 9 } },
    { rank: 3, mark: "▲", num: 17, score: 80, g: { e: 82, t: 76, j: 92 },
      str: ["有馬記念Vの王者の地力", "瞬発力はメンバー屈指", "ルメール継続騎乗"], weak: ["追込は届かぬリスク"], tag: null, jvs: { label: "ルメール 名手", s: 9 } },
    { rank: 4, mark: "△", num: 1, score: 76, g: { e: 78, t: 74, j: 80 },
      str: ["ダービー馬の確かな地力", "エピ産駒の中距離適性"], weak: ["末脚一辺倒で展開待ち"], tag: null, jvs: { label: "戸崎 堅実", s: 7 } },
    { rank: 5, mark: "△", num: 15, score: 73, g: { e: 74, t: 72, j: 72 },
      str: ["日経賞勝ちの上昇度", "折り合い安定で崩れない"], weak: ["G1では地力一枚下か"], tag: null, jvs: { label: "横山典 老練", s: 6 } },
    { rank: 6, mark: "★", num: 13, score: 71, g: { e: 70, t: 80, j: 60 },
      str: ["金鯱賞勝ちの阪神実績", "ハーツクライの晩成力", "人気薄でマークが甘い"], weak: ["相手強化で展開頼み"], tag: "ana", jvs: { label: "古川吉 地元の利", s: 6 } },
    { rank: 7, mark: "△", num: 6, score: 69, g: { e: 71, t: 68, j: 66 },
      str: ["エピ産駒×追込の破壊力", "海外G2勝ちの底力"], weak: ["位置取りが毎度の課題"], tag: null, jvs: { label: "西村淳 標準", s: 5 } },
    { rank: 8, mark: "△", num: 9, score: 67, g: { e: 68, t: 70, j: 84 },
      str: ["横山武と手が合う", "弥生賞勝ちの素質"], weak: ["近走はやや平凡"], tag: null, jvs: { label: "横山武 相性◎", s: 8 } },
    { rank: 9, mark: "⚠", num: 2, score: 66, g: { e: 67, t: 60, j: 86 },
      str: ["レーン継続騎乗の魅力"], weak: ["阪神2200は追込不利", "人気先行の懸念"], tag: "over", jvs: { label: "レーン 名手", s: 8 } },
    { rank: 10, mark: "", num: 11, score: 63, g: { e: 64, t: 62, j: 68 },
      str: ["凱旋門賞遠征の地力"], weak: ["国内中距離は試金石"], tag: null, jvs: { label: "坂井 標準", s: 5 } },
    { rank: 11, mark: "", num: 8, score: 58, g: { e: 58, t: 62, j: 50 },
      str: ["小倉大賞典勝ちの一発"], weak: ["G1では地力不足"], tag: null, jvs: { label: "高杉 未知数", s: 4 } },
    { rank: 12, mark: "", num: 18, score: 56, g: { e: 56, t: 60, j: 48 },
      str: ["長距離で培ったスタミナ"], weak: ["速い流れだと脆い"], tag: null, jvs: { label: "松本 未知数", s: 4 } },
    { rank: 13, mark: "", num: 12, score: 54, g: { e: 54, t: 66, j: 70 },
      str: ["ゴールドシップ産駒のタフさ"], weak: ["近走見せ場なし"], tag: null, jvs: { label: "川田 名手", s: 8 } },
    { rank: 14, mark: "", num: 4, score: 52, g: { e: 52, t: 54, j: 50 },
      str: ["日経賞2着の善戦"], weak: ["G1の壁は高い"], tag: null, jvs: { label: "丹内 標準", s: 5 } },
    { rank: 15, mark: "", num: 10, score: 50, g: { e: 50, t: 52, j: 62 },
      str: ["京都記念勝ちの実績"], weak: ["阪神替わりは未知"], tag: null, jvs: { label: "松山 堅実", s: 6 } },
    { rank: 16, mark: "", num: 14, score: 47, g: { e: 46, t: 50, j: 58 },
      str: ["ダイヤモンドS勝ちの長距離"], weak: ["2200は忙しい"], tag: null, jvs: { label: "岩田望 標準", s: 5 } },
    { rank: 17, mark: "", num: 3, score: 44, g: { e: 44, t: 48, j: 40 },
      str: ["青葉賞勝ちの素質"], weak: ["近走大敗続き"], tag: null, jvs: { label: "吉村 未知数", s: 4 } },
    { rank: 18, mark: "", num: 7, score: 40, g: { e: 40, t: 44, j: 42 },
      str: ["逃げて見せ場を作る"], weak: ["地力が大きく見劣り"], tag: null, jvs: { label: "幸 未知数", s: 4 } },
  ];

  const byNum = {};
  runners.forEach((r) => (byNum[r.num] = r));
  diag.forEach((d) => (d.r = byNum[d.num]));
  const diagByNum = {};
  diag.forEach((d) => (diagByNum[d.num] = d));

  /* ===== 第二の目：前日馬場傾向（トラックバイアス）===== 実データ prevDayAnalysis ===== */
  const RANK_SCORE = { S: 96, A: 86, "A-": 80, "B+": 73, B: 66, "B-": 58, "C+": 50, C: 44 };
  const bias = {
    date: "2026/6/13（土）",
    forecast: "良",
    bar: { 逃げ: 90, 先行: 86, 差し: 58, 追込: 32 }, // 脚質別 期待バイアス
    summary:
      "阪神3日目は芝・ダートとも先行〜好位が基本有利で前残り傾向。Bコース替わりで内前極端は緩和されるが、前残り基調は維持。追込一本型は割引、好位〜中団前目から長く脚を使える馬を優先すべき。",
    factors: [
      { k: "脚質", good: "先行〜好位が有利。逃げも残る", note: "先行 ≫ 差し ≫ 追込" },
      { k: "コース", good: "Bコース替わりで内前極端は緩和", note: "前残り基調は維持" },
      { k: "直線", good: "内回り357mで差しは届きにくい", note: "坂で止まらぬ持続力勝負" },
      { k: "差し馬", good: "早めに動けるタイプは○", note: "コーナーで置かれる馬は×" },
    ],
    // num, rank, heavy(馬場), sashi(展開), note
    matrix: [
      { num: 5, rank: "S", heavy: "◎", sashi: "◎", note: "先行×4歳×G1 4勝。父キタサンブラックは阪神内回り勝率トップ" },
      { num: 16, rank: "S", heavy: "◎", sashi: "◎", note: "逃げ有利馬場×リピーター×武豊×8枠" },
      { num: 1, rank: "A", heavy: "○", sashi: "○", note: "中団前目から運べれば。エピ産駒は内回り6勝" },
      { num: 4, rank: "A-", heavy: "◎", sashi: "○", note: "先行×4歳×前走2着。4連勝中の上昇馬" },
      { num: 15, rank: "B+", heavy: "○", sashi: "○", note: "前走1着×4歳=66.7%。好位から差せる" },
      { num: 13, rank: "B+", heavy: "○", sashi: "○", note: "金鯱賞1着。差しても早めに動けるタイプ" },
      { num: 8, rank: "B", heavy: "△", sashi: "△", note: "追込型だが大阪杯4着で適性あり。穴候補" },
      { num: 2, rank: "B-", heavy: "✗", sashi: "✗", note: "有馬1着も追込一本型。前残り馬場に不向き" },
      { num: 17, rank: "C+", heavy: "✗", sashi: "✗", note: "追込×内回り。昨年宝塚11着。前残り馬場×" },
      { num: 9, rank: "C", heavy: "○", sashi: "○", note: "馬場は合うが前走G2 7着=過去全滅データ" },
    ],
    impact: [
      { t: "good", s: "先行〜好位が基本有利・逃げも残る", who: "クロワデュノール・メイショウタバルに追い風" },
      { t: "bad", s: "追込一本型は厳しい馬場", who: "ミュージアムマイル(4人気)・レガレイラ(3人気)に逆風" },
      { t: "warn", s: "差し馬は『早めに動けるか』が鍵", who: "コーナーで置かれるタイプは割引" },
    ],
  };
  const biasByNum = {};
  bias.matrix.forEach((m) => (biasByNum[m.num] = m));
  const biasScore = (num) => {
    const m = biasByNum[num];
    if (m) return RANK_SCORE[m.rank] ?? 55;
    const st = byNum[num].style;
    return st === "逃げ" || st === "先行" ? 66 : st === "差し" ? 56 : 44;
  };

  /* ===== 第三の目：レースシミュレーション1000回 ===== 実データ simulation ===== */
  const simRaw = [
    { num: 5, win: 42.1, p2: 72.5, p3: 87.1, avg: 2.2, ev: 1.14 },
    { num: 16, win: 38.9, p2: 69.9, p3: 87.2, avg: 2.1, ev: 1.87 },
    { num: 17, win: 14.2, p2: 36.2, p3: 64.2, avg: 3.4, ev: 0.78 },
    { num: 2, win: 1.8, p2: 7.9, p3: 19.6, avg: 6.0, ev: 0.11 },
    { num: 14, win: 1.1, p2: 2.5, p3: 7.8, avg: 8.1, ev: 2.11 },
    { num: 1, win: 0.6, p2: 3.2, p3: 10.2, avg: 7.4, ev: 0.05 },
    { num: 6, win: 0.5, p2: 2.3, p3: 4.8, avg: 9.2, ev: 0.15 },
    { num: 10, win: 0.2, p2: 1.8, p3: 6.7, avg: 8.5, ev: 0.33 },
    { num: 9, win: 0.2, p2: 1.7, p3: 4.4, avg: 9.0, ev: 0.12 },
    { num: 13, win: 0.2, p2: 1.0, p3: 3.2, avg: 10.1, ev: 0.13 },
    { num: 4, win: 0.1, p2: 0.5, p3: 2.5, avg: 10.5, ev: 0.06 },
    { num: 8, win: 0.1, p2: 0.3, p3: 1.5, avg: 11.2, ev: 0.09 },
    { num: 15, win: 0.0, p2: 0.1, p3: 1.0, avg: 11.8, ev: 0.0 },
    { num: 11, win: 0.0, p2: 0.1, p3: 0.8, avg: 12.5, ev: 0.0 },
    { num: 12, win: 0.0, p2: 0.0, p3: 0.2, avg: 14.0, ev: 0.0 },
    { num: 3, win: 0.0, p2: 0.0, p3: 0.1, avg: 15.0, ev: 0.0 },
    { num: 18, win: 0.0, p2: 0.0, p3: 0.0, avg: 17.0, ev: 0.0 },
    { num: 7, win: 0.0, p2: 0.0, p3: 0.0, avg: 16.0, ev: 0.0 },
  ];
  simRaw.forEach((s) => (s.r = byNum[s.num]));
  const simByNum = {};
  simRaw.forEach((s) => (simByNum[s.num] = s));
  const sim = {
    n: 1000,
    sigma: 8,
    method: "モンテカルロ法（Box-Muller正規乱数 σ=8）",
    note: "血統スコア推定値をベースに展開のアヤを1000回試行。",
    results: simRaw,
  };
  const simScore = (num) => {
    const s = simByNum[num];
    if (!s) return 30;
    return Math.min(100, s.win * 1.1 + s.p3 * 0.65);
  };

  /* ===== 総合判断：3つの目を統合 ===== */
  // 総合 = 血統40% + 馬場35% + シミュ25%
  const W = { blood: 0.4, bias: 0.35, sim: 0.25 };
  const overall = runners
    .map((r) => {
      const blood = diagByNum[r.num].score;
      const bia = biasScore(r.num);
      const si = simScore(r.num);
      const total = Math.round((blood * W.blood + bia * W.bias + si * W.sim) * 10) / 10;
      // 3つの目の一致度（標準偏差ベース → 信頼度）
      const vals = [blood, bia, si];
      const mean = (blood + bia + si) / 3;
      const sd = Math.sqrt(vals.reduce((a, v) => a + (v - mean) ** 2, 0) / 3);
      const conf = Math.max(0, Math.min(100, Math.round(100 - sd * 2.2)));
      return { num: r.num, r, blood, bias: Math.round(bia), sim: Math.round(si), total, conf };
    })
    .sort((a, b) => b.total - a.total);
  const MARKS = ["◎", "○", "▲", "△", "△"];
  overall.forEach((o, i) => {
    o.rank = i + 1;
    o.mark = MARKS[i] || "";
    // 人気との乖離で穴/危険を判定
    const diff = o.r.pop - (i + 1);
    o.tag = diff >= 5 ? "ana" : diff <= -4 ? "over" : null;
  });

  // 買い目戦略（実データ bettingStrategy）
  const strategy = {
    axis: { num: 5, role: "軸 / 本命", why: "先行×前残り馬場×4歳×G1 4勝。3つの目が全合致" },
    counter: { num: 16, role: "対抗", why: "逃げ×リピーター×武豊×8枠。馬場・シミュとも高評価" },
    hole: { num: 4, role: "穴", why: "先行×4歳×前走2着=66.7%データ。馬場傾向が後押し" },
    bighole: { num: 8, role: "大穴", why: "ヤマカツエース産駒の穴血統。大阪杯4着の実力" },
    danger: [
      { num: 2, why: "有馬1着も追込一本型×前残り馬場は最不利。父リオンディーズ内回り未勝利" },
      { num: 17, why: "G1 2勝も追込×内回り×昨年11着。前残りで不利増幅。危険な3番人気" },
    ],
    verdict:
      "3つの目が一致して指すのは『前残り馬場を味方につける先行勢』。血統・シミュ最上位の◎クロワデュノールを軸に、馬場が押す○メイショウタバルとの2強。人気でも追込のミュージアムマイル・レガレイラは思い切って評価を下げる。",
  };

  // 馬券プラン（◎○▲△から自動生成風）
  const top = diag.slice(0, 6).map((d) => d.num);
  const betting = [
    { plan: "A", label: "本命 馬連", risk: "堅実", nums: "◎5 → 16・17・1・13", detail: "馬連 4点 × 500円 = 2,000円", color: "win" },
    { plan: "B", label: "3連複 フォーメーション", risk: "バランス", nums: "5 ‐ 16,17 ‐ 1,13,15,6", detail: "3連複 8点 × 300円 = 2,400円", color: "mid" },
    { plan: "C", label: "ヒモ穴 ワイド", risk: "一発", nums: "★13 ‐ 5・16・17", detail: "ワイド 3点 × 400円 = 1,200円", color: "ana" },
  ];

  // レース傾向（実データ抜粋）
  const trends = {
    pace: "前年は逃げ切り決着。先行有利だが上がり上位も台頭。",
    blood: "ステイゴールド系・キングカメハメハ系が阪神2200で好相性。タフな馬場をこなすスタミナとパワーが鍵。",
    draw: "内〜中枠がやや有利。8枠は先行力があれば克服可。",
    bullets: [
      { k: "脚質", v: "先行 複勝率33% / 差し 28%", hl: true },
      { k: "枠順", v: "3〜6枠が勝ち馬集中ゾーン", hl: false },
      { k: "血統", v: "ステゴ系・キンカメ系が優勢", hl: true },
      { k: "前走", v: "天皇賞春・大阪杯組が中心", hl: false },
    ],
  };

  // 主要種牡馬（分析チャート用 / stallions.json 実データ）
  const stallions = [
    { name: "ディープインパクト", surface: "TURF", dMin: "MILE", dMax: "LONG", course: "BOTH", growth: "NORMAL", heavy: 2, sta: 8, spd: 9, pow: 6, line: "サンデー系" },
    { name: "キタサンブラック", surface: "TURF", dMin: "MILE", dMax: "LONG", course: "BOTH", growth: "NORMAL", heavy: 6, sta: 9, spd: 8, pow: 8, line: "サンデー系" },
    { name: "ゴールドシップ", surface: "TURF", dMin: "MIDDLE", dMax: "LONG", course: "RIGHT", growth: "LATE", heavy: 8, sta: 10, spd: 6, pow: 9, line: "サンデー系" },
    { name: "キズナ", surface: "TURF", dMin: "MILE", dMax: "MIDDLE", course: "BOTH", growth: "NORMAL", heavy: 5, sta: 8, spd: 8, pow: 7, line: "サンデー系" },
    { name: "エピファネイア", surface: "TURF", dMin: "MILE", dMax: "LONG", course: "BOTH", growth: "NORMAL", heavy: 4, sta: 8, spd: 8, pow: 7, line: "ロベルト系" },
    { name: "ハーツクライ", surface: "TURF", dMin: "MIDDLE", dMax: "LONG", course: "LEFT", growth: "LATE", heavy: 5, sta: 9, spd: 7, pow: 7, line: "サンデー系" },
    { name: "ドゥラメンテ", surface: "TURF", dMin: "MILE", dMax: "MIDDLE", course: "BOTH", growth: "NORMAL", heavy: 5, sta: 7, spd: 9, pow: 8, line: "キンカメ系" },
    { name: "ロードカナロア", surface: "TURF", dMin: "SPRINT", dMax: "MILE", course: "BOTH", growth: "EARLY", heavy: 4, sta: 5, spd: 10, pow: 7, line: "キンカメ系" },
    { name: "キングカメハメハ", surface: "BOTH", dMin: "SPRINT", dMax: "MIDDLE", course: "BOTH", growth: "EARLY", heavy: 7, sta: 7, spd: 8, pow: 9, line: "キンカメ系" },
    { name: "モーリス", surface: "TURF", dMin: "MILE", dMax: "MIDDLE", course: "BOTH", growth: "LATE", heavy: 5, sta: 7, spd: 9, pow: 8, line: "ロベルト系" },
    { name: "ドレフォン", surface: "BOTH", dMin: "SPRINT", dMax: "MILE", course: "RIGHT", growth: "EARLY", heavy: 7, sta: 6, spd: 9, pow: 9, line: "ミスプロ系" },
    { name: "ヘニーヒューズ", surface: "DIRT", dMin: "SPRINT", dMax: "MILE", course: "BOTH", growth: "EARLY", heavy: 9, sta: 5, spd: 9, pow: 10, line: "ミスプロ系" },
    { name: "オルフェーヴル", surface: "TURF", dMin: "MIDDLE", dMax: "LONG", course: "BOTH", growth: "NORMAL", heavy: 6, sta: 9, spd: 8, pow: 8, line: "サンデー系" },
    { name: "スワーヴリチャード", surface: "TURF", dMin: "MILE", dMax: "MIDDLE", course: "BOTH", growth: "NORMAL", heavy: 5, sta: 7, spd: 8, pow: 7, line: "サンデー系" },
  ];

  const lineColors = {
    "サンデー系": "#d8b659",
    "キンカメ系": "#7aa8d8",
    "ロベルト系": "#cf8a5a",
    "ミスプロ系": "#8fb87a",
  };

  // 重賞カレンダー（予想ホーム用）
  const calendar = [
    { id: "takarazuka2026", grade: "G1", name: "宝塚記念", date: "6.14", dow: "日", venue: "阪神", course: "芝2200m", emoji: "🌟", status: "live", field: 18 },
    { id: "yasuda2026", grade: "G1", name: "安田記念", date: "6.7", dow: "日", venue: "東京", course: "芝1600m", emoji: "⚡", status: "done", win: "ソウルラッシュ" },
    { id: "epsom2026", grade: "G3", name: "エプソムC", date: "6.7", dow: "日", venue: "東京", course: "芝1800m", emoji: "🎩", status: "done", win: "レーベンスティール" },
    { id: "naruo2026", grade: "G3", name: "鳴尾記念", date: "6.7", dow: "日", venue: "阪神", course: "芝2000m", emoji: "🌾", status: "done", win: "ヨーホーレイク" },
    { id: "shirasagi2026", grade: "G3", name: "しらさぎステークス", date: "6.21", dow: "日", venue: "阪神", course: "芝1600m", emoji: "🕊️", status: "soon", note: "別定・3歳上", field: 0 },
    { id: "cbc2026", grade: "G3", name: "CBC賞", date: "7.5", dow: "日", venue: "中京", course: "芝1200m", emoji: "💨", status: "soon", field: 0 },
    { id: "procyon2026", grade: "G3", name: "プロキオンS", date: "7.5", dow: "日", venue: "中京", course: "ダ1400m", emoji: "🏜️", status: "soon", field: 0 },
    { id: "tanabata2026", grade: "G3", name: "七夕賞", date: "7.12", dow: "日", venue: "福島", course: "芝2000m", emoji: "🎋", status: "soon", field: 0 },
    { id: "spring2026", grade: "G2", name: "函館記念", date: "7.19", dow: "日", venue: "函館", course: "芝2000m", emoji: "🦀", status: "soon", field: 0 },
  ];

  /* ===== レース結果・回顧・AI検証（確定後の実データ）===== */
  const result = {
    decided: true,
    track: "重", weather: "雨", time: "2:12.1", last3f: "35.6",
    // 着順（中止含む）: pos, num, time(上位のみ), margin(着差)
    order: [
      { pos: 1, num: 16, time: "2:12.1", margin: "" },
      { pos: 2, num: 5, time: "2:12.2", margin: "クビ" },
      { pos: 3, num: 1, time: "2:12.6", margin: "2½" },
      { pos: 4, num: 9, margin: "アタマ" },
      { pos: 5, num: 8, margin: "5" },
      { pos: 6, num: 7, margin: "ハナ" },
      { pos: 7, num: 17, margin: "1" },
      { pos: 8, num: 10, margin: "クビ" },
      { pos: 9, num: 2, margin: "アタマ" },
      { pos: 10, num: 12, margin: "クビ" },
      { pos: 11, num: 11, margin: "2½" },
      { pos: 12, num: 4, margin: "2" },
      { pos: 13, num: 14, margin: "1¾" },
      { pos: 14, num: 13, margin: "¾" },
      { pos: 15, num: 6, margin: "1½" },
      { pos: 16, num: 18, margin: "クビ" },
      { pos: 17, num: 3, margin: "¾" },
      { pos: "中止", num: 15, margin: "" },
    ],
    payout: [
      { k: "単勝", c: "⑯", v: 390 },
      { k: "馬連", c: "⑤-⑯", v: 620 },
      { k: "馬単", c: "⑯-⑤", v: 1360 },
      { k: "ワイド", c: "⑤-⑯", v: 260 },
      { k: "3連複", c: "①⑤⑯", v: 1230 },
      { k: "3連単", c: "⑯⑤①", v: 6040 },
    ],
    comment: {
      by: "武豊", horse: "メイショウタバル",
      text: "（レース直前の雨は）嫌な気持ちではなかったですね。天国から松本会長が降らしてくれたのかな。2番手で馬も我慢してくれて、いいリズムで走ってくれました。今日は今までで一番馬の強さを感じましたし、これで秋には胸を張ってフランスに行けます",
    },
    review:
      "直前の雨で馬場は重まで悪化。道中も12秒台が続くタフな消耗戦となり、瞬発力ではなく地力と馬場適性が問われた。逃げたコスモキュランダを見ながら2番手で折り合ったメイショウタバルが4角で早めに先頭をうかがい押し切り勝ち。クロワデュノールは中団から差を詰めたがクビ差届かず2着。重馬場と前残りの展開がわずかにタバル向きだった。3着は人気薄ダノンデサイルが後方から伸び、3連複①⑤⑯は1番人気の堅い決着。AIが軽視した追込勢（②⑰）は伸びを欠き、馬場傾向の読みがそのまま結果に直結した。",
    // 買い目の収支検証（diag/strategy由来の3プランを答え合わせ）
    bets: [
      { plan: "A", label: "本命 馬連", kind: "gold", nums: "◎5 → 16・17・1・13", invest: 2000, ret: 3100, hit: true, note: "5-16 620円" },
      { plan: "B", label: "3連複 F", kind: "default", nums: "5 ‐ 16,17 ‐ 1,13,15,6", invest: 2400, ret: 3690, hit: true, note: "1-5-16 1,230円" },
      { plan: "C", label: "ヒモ穴 ワイド", kind: "default", nums: "★13 ‐ 5・16・17", invest: 1200, ret: 0, hit: false, note: "★13は14着" },
    ],
  };
  // 着順を num から引けるように
  const posByNum = {};
  result.order.forEach((o) => (posByNum[o.num] = o.pos));
  result.posByNum = posByNum;

  return { race, runners, diag, diagByNum, byNum, betting, trends, stallions, lineColors, calendar, FRAME, bias, sim, overall, strategy, result };
})();
