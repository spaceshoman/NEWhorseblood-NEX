// 血統くん 共通定数
// この定数は App.jsx と calcAptitude.js から参照される
// インシデント教訓: 巨大単一ファイルで誤削除されたため独立ファイル化

const SURFACE = { TURF:"芝", DIRT:"ダート", BOTH:"芝・ダート兼用" };
const DISTANCE = { SPRINT:"短距離 (~1400m)", MILE:"マイル (1400~1800m)", MIDDLE:"中距離 (1800~2400m)", LONG:"長距離 (2400m~)", VERSATILE:"万能" };
const DIST_SHORT = { SPRINT:"短距離", MILE:"マイル", MIDDLE:"中距離", LONG:"長距離" };
const COURSE = { RIGHT:"右回り", LEFT:"左回り", BOTH:"左右兼用" };
const GROWTH = { EARLY:"早熟", NORMAL:"普通", LATE:"晩成" };
const TRACK_COND = { GOOD:"良", SLIGHTLY_HEAVY:"稍重", HEAVY:"重", BAD:"不良" };
const VENUES = {
  tokyo:{name:"東京",course:"LEFT",surface:["TURF","DIRT"],distances:["SPRINT","MILE","MIDDLE","LONG"]},
  nakayama:{name:"中山",course:"RIGHT",surface:["TURF","DIRT"],distances:["SPRINT","MILE","MIDDLE","LONG"]},
  hanshin:{name:"阪神",course:"RIGHT",surface:["TURF","DIRT"],distances:["SPRINT","MILE","MIDDLE","LONG"]},
  kyoto:{name:"京都",course:"RIGHT",surface:["TURF","DIRT"],distances:["SPRINT","MILE","MIDDLE","LONG"]},
  chukyo:{name:"中京",course:"LEFT",surface:["TURF","DIRT"],distances:["SPRINT","MILE","MIDDLE"]},
  kokura:{name:"小倉",course:"RIGHT",surface:["TURF","DIRT"],distances:["SPRINT","MILE","MIDDLE"]},
  niigata:{name:"新潟",course:"LEFT",surface:["TURF","DIRT"],distances:["SPRINT","MILE","MIDDLE"]},
  sapporo:{name:"札幌",course:"RIGHT",surface:["TURF","DIRT"],distances:["SPRINT","MILE","MIDDLE"]},
  hakodate:{name:"函館",course:"RIGHT",surface:["TURF","DIRT"],distances:["SPRINT","MILE"]},
  ooi:{name:"大井",course:"RIGHT",surface:["DIRT"],distances:["SPRINT","MILE","MIDDLE"]},
  funabashi:{name:"船橋",course:"LEFT",surface:["DIRT"],distances:["SPRINT","MILE","MIDDLE"]},
  kawasaki:{name:"川崎",course:"LEFT",surface:["DIRT"],distances:["SPRINT","MILE"]},
  monbetsu:{name:"門別",course:"RIGHT",surface:["DIRT"],distances:["SPRINT","MILE","MIDDLE"]},
};

// ===== 種牡馬データベース本体 =====
// 164頭。surface(TURF/DIRT/BOTH)/distanceMin/distanceMax(SPRINT/MILE/MIDDLE/LONG)/
// course(RIGHT/LEFT/BOTH)/growth(EARLY/NORMAL/LATE)/heavyTrack(1-8)/
// staminaScore/speedScore/powerScore(各1-10)/notes を持つ。calcAptitude.js が参照。
// 各種牡馬は pedigree（sire/dam/sireOfSire/damOfSire/sireOfDam/damOfDam）も保持。
/* STALLIONS は stallions.json から fetch */


/* グローバル参照用に window へも公開 */
try{ Object.assign(window, { SURFACE, DISTANCE, DIST_SHORT, COURSE, GROWTH, TRACK_COND, VENUES }); }catch(e){}
