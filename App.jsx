const { useState, useEffect, useMemo, useCallback, useRef } = React;

/* ===== Constants ===== */

const HORSE_SVG=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="48" height="48">
  <g fill="none" stroke="#c8a84b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M38 8 C36 6 32 6 30 8 C28 10 28 13 30 14 L32 15" />
    <path d="M32 15 C30 16 28 18 27 21 C26 24 27 28 29 30" />
    <path d="M29 30 C26 32 22 34 20 38 C18 42 19 48 22 50" />
    <path d="M22 50 L20 58 M22 50 L24 58" />
    <path d="M29 30 C32 32 36 33 39 32 C42 31 44 28 44 25" />
    <path d="M44 25 C46 22 47 18 45 15 C43 12 40 11 38 12" />
    <path d="M38 12 L38 8" />
    <path d="M44 25 C46 27 48 30 48 34 C48 38 46 42 44 44" />
    <path d="M44 44 L46 56 M44 44 L42 56" />
    <path d="M36 8 C37 5 40 4 42 5" />
    <path d="M36 8 C35 5 33 4 31 5" />
    <circle cx="35" cy="10" r="1" fill="#c8a84b" stroke="none"/>
  </g>
</svg>`;

const PC_STYLES=`
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Serif+JP:wght@700;900&display=swap');

/* === スマホ専用: 漆黒×ゴールドテーマ === */
@media(max-width:767px){
  body{background:#0a0a0a!important}
  .kb-app{background:#0a0a0a!important;color:#fff!important}

  /* ヘッダー */
  .kb-header{background:#0a0a0a!important;border-bottom:1px solid rgba(200,168,75,0.15)!important}
  .kb-header-logo{font-family:'Noto Serif JP',serif!important;background:linear-gradient(135deg,#f5d77a,#c8a84b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;color:transparent!important;letter-spacing:1px!important}
  .kb-header-sub{color:#8a7530!important}
  .kb-header-meta{color:rgba(255,255,255,0.4)!important}

  /* 次の重賞ヒーロー */
  .kb-next{background:radial-gradient(ellipse at top right,rgba(200,168,75,0.25),transparent 60%),linear-gradient(180deg,#1a1408 0%,#0e0a04 100%)!important;border:1px solid rgba(200,168,75,0.35)!important;border-left:4px solid #c8a84b!important;margin:14px 14px 0!important;border-radius:18px!important;padding:18px!important}
  .kb-next .kb-next-label{color:#c8a84b!important}
  .kb-next .kb-next-name{font-family:'Noto Serif JP',serif!important;font-weight:900!important;color:#fff!important;font-size:28px!important;letter-spacing:1px!important}

  .kb-race-list-pc{display:none!important}
  .kb-race-list-mobile{display:block!important}
  .kb-sidebar{display:none!important}
  .kb-bottom-nav{display:flex!important}
  /* ボトムナビ */
  .kb-bottom-nav{background:rgba(10,10,10,0.95)!important;backdrop-filter:blur(10px);border-top:1px solid rgba(200,168,75,0.15)!important;border-bottom:none!important}

  /* カード全般を暗色化 */
  .kb-app [style*="background: var(--color-background-primary)"],
  .kb-app [style*="background:var(--color-background-primary)"],
  .kb-app [style*="background: rgb(255, 255, 255)"],
  .kb-app [style*="background:#fff"],
  .kb-app [style*="background: #fff"]{background:#141414!important;color:#fff!important}

  /* 入力フィールド */
  .kb-app input,.kb-app select,.kb-app textarea{background:#1a1a1a!important;color:#fff!important;border-color:rgba(200,168,75,0.2)!important}

  /* テキスト全般 */
  .kb-app{--color-text-primary:#fff;--color-text-secondary:rgba(255,255,255,0.7);--color-text-tertiary:rgba(255,255,255,0.4);--color-background-primary:#141414;--color-background-secondary:#0a0a0a;--color-border-tertiary:rgba(200,168,75,0.12)}
}

/* === PC: 既存のままsa === */
@media(min-width:768px){
  .kb-app{max-width:100%!important;padding-bottom:0!important}
  .kb-header{padding:10px 24px 8px!important}
  .kb-header-logo{font-size:28px!important}
  .kb-header-sub{font-size:10px!important}
  .kb-header-meta{font-size:11px!important}
  .kb-next{padding:14px 24px!important}
  .kb-next-name{font-size:32px!important}
  .kb-next-info{font-size:11px!important}
  .kb-body{display:grid!important;grid-template-columns:280px 1fr!important;align-items:start}
  .kb-sidebar{display:block!important;position:sticky;top:57px;height:calc(100vh - 57px);overflow-y:auto;background:#fff;border-right:1px solid #e0e6ed}
  .kb-sidebar-inner{padding:0}
  .kb-grade-tabs{display:flex;background:#0d1f3c}
  .kb-grade-tab{flex:1;padding:10px 0;text-align:center;font-size:13px;font-weight:700;letter-spacing:2px;cursor:pointer;border:none;border-bottom:2px solid transparent;background:transparent;color:rgba(255,255,255,0.4)}
  .kb-grade-tab.active{color:#c8a84b;border-bottom:2px solid #c8a84b}
  .kb-race-list-mobile{display:none!important}
  .kb-race-list-pc{display:block!important}
  .kb-race-item{padding:9px 16px;cursor:pointer;border-left:3px solid transparent;display:flex;align-items:center;justify-content:space-between;border-bottom:0.5px solid #f0f4f8}
  .kb-race-item:hover{background:#f8f9fb}
  .kb-race-item.active{background:#f0f6fd;border-left:3px solid #1e5fa8}
  .kb-race-item.done{opacity:0.7}
  .kb-race-item-name{font-size:13px!important;font-weight:500}
  .kb-race-item-meta{font-size:11px!important;color:#8897a8;margin-top:2px}
  .kb-race-sec-label{font-size:10px;font-weight:700;color:#8897a8;letter-spacing:2px;padding:8px 16px 4px;border-bottom:0.5px solid #e0e6ed;background:#f8f9fb}
  .kb-main{padding:20px;min-height:calc(100vh - 100px)}
  .kb-main .kb-race-name{font-size:28px!important}
  .kb-main .kb-race-meta{font-size:12px!important}
  .kb-main .kb-runner-name{font-size:15px!important}
  .kb-main .kb-runner-blood{font-size:11px!important}
  .kb-main .kb-score-num{font-size:36px!important}
  .kb-bottom-nav{display:none!important}
`;


/* ===== Shared UI Components ===== */
const Badge=({children,variant="default"})=>{
  const C={turf:{bg:"#E1F5EE",text:"#085041",b:"#5DCAA5"},dirt:{bg:"#FAEEDA",text:"#633806",b:"#EF9F27"},both:{bg:"#EEEDFE",text:"#3C3489",b:"#AFA9EC"},right:{bg:"#FAECE7",text:"#712B13",b:"#F0997B"},left:{bg:"#E6F1FB",text:"#0C447C",b:"#85B7EB"},bothC:{bg:"#F1EFE8",text:"#444441",b:"#B4B2A9"},early:{bg:"#FCEBEB",text:"#791F1F",b:"#F09595"},normal:{bg:"#EAF3DE",text:"#27500A",b:"#97C459"},late:{bg:"#FBEAF0",text:"#72243E",b:"#ED93B1"},default:{bg:"var(--color-background-secondary)",text:"var(--color-text-secondary)",b:"var(--color-border-tertiary)"}};
  const c=C[variant]||C.default;
  return <span style={{display:"inline-block",padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:500,background:c.bg,color:c.text,border:`1px solid ${c.b}`,whiteSpace:"nowrap"}}>{children}</span>;
};
const surfBadge=k=><Badge variant={k==="TURF"?"turf":k==="DIRT"?"dirt":"both"}>{SURFACE[k]}</Badge>;
const courseBadge=k=><Badge variant={k==="RIGHT"?"right":k==="LEFT"?"left":"bothC"}>{COURSE[k]}</Badge>;
const growthBadge=k=><Badge variant={k==="EARLY"?"early":k==="LATE"?"late":"normal"}>{GROWTH[k]}</Badge>;

/* ===== Race Animation ===== */
const FRAME_COLORS={1:{bg:"#fff",text:"#333",b:"#999"},2:{bg:"#333",text:"#fff",b:"#333"},3:{bg:"#e03c3c",text:"#fff",b:"#e03c3c"},4:{bg:"#2563c4",text:"#fff",b:"#2563c4"},5:{bg:"#e8c832",text:"#333",b:"#d4b520"},6:{bg:"#3da53d",text:"#fff",b:"#3da53d"},7:{bg:"#e8842e",text:"#fff",b:"#e8842e"},8:{bg:"#e87aa4",text:"#fff",b:"#e87aa4"}};
const RaceAnimation=({horses,raceName})=>{
  const[pos,setPos]=useState(null);
  const[finished,setFinished]=useState([]);
  const[running,setRunning]=useState(false);
  const rafRef=useRef(null);
  const stateRef=useRef(null);
  useEffect(()=>()=>{if(rafRef.current)cancelAnimationFrame(rafRef.current);},[]);
  const start=()=>{
    if(rafRef.current)cancelAnimationFrame(rafRef.current);
    const maxScore=Math.max(...horses.map(h=>h.score||50));
    const minScore=Math.min(...horses.map(h=>h.score||50));
    const range=Math.max(1,maxScore-minScore);
    const st=horses.map(h=>({...h,x:0,fin:false,mom:0}));
    stateRef.current={st,finArr:[]};
    setFinished([]);setRunning(true);
    const tick=()=>{
      const{st,finArr}=stateRef.current;
      let allDone=true;
      st.forEach(h=>{
        if(h.fin)return;
        allDone=false;
        // スコア比例の基礎速度 + 慣性付きランダム（展開のアヤ）
        const norm=((h.score||50)-minScore)/range; // 0-1
        const base=0.18+norm*0.10;
        h.mom=h.mom*0.9+(Math.random()-0.5)*0.10;
        h.x+=Math.max(0.05,base+h.mom);
        if(h.x>=100){h.x=100;h.fin=true;finArr.push({num:h.num,name:h.name,frame:h.frame});}
      });
      setPos(st.map(h=>({num:h.num,name:h.name,x:h.x,fin:h.fin,frame:h.frame})));
      setFinished([...finArr]);
      if(!allDone)rafRef.current=requestAnimationFrame(tick);
      else setRunning(false);
    };
    rafRef.current=requestAnimationFrame(tick);
  };
  const laneH=20;
  return(
    <div style={{marginTop:16,background:"linear-gradient(180deg,rgba(61,165,61,0.08),rgba(61,165,61,0.03))",border:"2px solid rgba(61,165,61,0.35)",borderRadius:12,padding:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:17,fontWeight:400,color:"#3da53d",letterSpacing:"2px"}}>レースアニメーション</div>
        <button onClick={start} disabled={running} style={{padding:"6px 14px",borderRadius:8,border:"none",background:running?"#999":"#3da53d",color:"#fff",fontSize:11,fontWeight:600,cursor:running?"default":"pointer"}}>{running?"レース中…":"🏁 発走！"}</button>
      </div>
      <div style={{fontSize:9,color:"rgba(61,165,61,0.7)",marginBottom:10}}>血統スコアをベースに展開のアヤを加えた仮想レース。{raceName||""}</div>
      {/* コース */}
      <div style={{position:"relative",background:"linear-gradient(180deg,#2d6b2d,#235823)",borderRadius:8,padding:"8px 4px",overflow:"hidden"}}>
        {/* ゴール線 */}
        <div style={{position:"absolute",right:28,top:0,bottom:0,width:3,background:"repeating-linear-gradient(180deg,#fff 0 6px,#d33 6px 12px)",zIndex:1}}/>
        <div style={{position:"absolute",right:6,top:"50%",transform:"translateY(-50%)",fontSize:10,color:"#fff",fontWeight:700,writingMode:"vertical-rl",letterSpacing:"2px",opacity:0.7}}>GOAL</div>
        {(pos||horses.map(h=>({num:h.num,name:h.name,x:0,fin:false,frame:h.frame}))).map((h)=>{
          const fc=FRAME_COLORS[h.frame]||FRAME_COLORS[1];
          return(
            <div key={h.num} style={{position:"relative",height:laneH,borderBottom:"1px dashed rgba(255,255,255,0.12)"}}>
              <div style={{position:"absolute",left:`calc(${Math.min(h.x,100)*0.85}% )`,top:1,display:"flex",alignItems:"center",gap:2,transition:"none",zIndex:2}}>
                <span style={{width:15,height:15,borderRadius:3,background:fc.bg,color:fc.text,border:`1px solid ${fc.b}`,fontSize:8,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{h.num}</span>
                <span style={{fontSize:12,transform:"scaleX(-1)",display:"inline-block"}}>🏇</span>
                {h.fin&&<span style={{fontSize:8,color:"#ffd700",fontWeight:700}}>✓</span>}
              </div>
            </div>
          );
        })}
      </div>
      {/* 着順速報 */}
      {finished.length>0&&(
        <div style={{marginTop:10,padding:"8px 10px",background:"rgba(0,0,0,0.15)",borderRadius:8}}>
          <div style={{fontSize:10,fontWeight:700,color:"#3da53d",marginBottom:4}}>🏆 着順速報</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {finished.slice(0,5).map((f,i)=>{
              const fc=FRAME_COLORS[f.frame]||FRAME_COLORS[1];
              return(
                <div key={f.num} style={{display:"flex",alignItems:"center",gap:3,padding:"3px 8px",background:i===0?"rgba(255,215,0,0.15)":"rgba(255,255,255,0.05)",borderRadius:8,border:i===0?"1px solid rgba(255,215,0,0.4)":"1px solid transparent"}}>
                  <span style={{fontSize:11,fontWeight:700,color:i===0?"#ffd700":i<3?"#3da53d":"var(--color-text-tertiary)"}}>{i+1}着</span>
                  <span style={{width:14,height:14,borderRadius:3,background:fc.bg,color:fc.text,fontSize:8,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{f.num}</span>
                  <span style={{fontSize:10,fontWeight:i===0?700:400,color:"var(--color-text-primary)"}}>{f.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const Field=({label,children})=>(<div style={{display:"flex",flexDirection:"column",gap:3}}><label style={{fontSize:11,color:"var(--color-text-secondary)",fontWeight:500}}>{label}</label>{children}</div>);
const inputStyle={padding:"6px 8px",borderRadius:8,border:"1px solid var(--color-border-tertiary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:12};

/* ===== DB Card ===== */
const StallionCard=({stallion,onEdit,onDelete})=>{
  const[expanded,setExpanded]=useState(false);
  return(
    <div style={{background:"var(--color-background-primary)",border:"1px solid var(--color-border-tertiary)",borderRadius:12,overflow:"hidden"}}>
      <div onClick={()=>setExpanded(!expanded)} style={{padding:"12px 16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:4}}>
            <span style={{fontSize:15,fontWeight:500,color:"var(--color-text-primary)"}}>{stallion.name}</span>
            <span style={{fontSize:11,color:"var(--color-text-tertiary)"}}>{stallion.nameEn}</span>
          </div>
          <div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:6}}>父: {stallion.pedigree?.sire||"—"} / 母父: {stallion.pedigree?.sireOfDam||"—"}</div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{surfBadge(stallion.surface)}{courseBadge(stallion.course)}{growthBadge(stallion.growth)}</div>
        </div>
        <span style={{fontSize:16,color:"var(--color-text-tertiary)",transform:expanded?"rotate(180deg)":"none",transition:"transform 0.2s",marginTop:4}}>▾</span>
      </div>
      {expanded&&(<div style={{padding:"0 16px 16px",borderTop:"1px solid var(--color-border-tertiary)"}}><div style={{paddingTop:12}}>
        <PedigreeTable pedigree={stallion.pedigree}/>
        <div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:8}}>適性距離: {DISTANCE[stallion.distanceMin]} 〜 {DISTANCE[stallion.distanceMax]}</div>
        <StatBar label="スピード" value={stallion.speedScore} color="#1D9E75"/>
        <StatBar label="スタミナ" value={stallion.staminaScore} color="#378ADD"/>
        <StatBar label="パワー" value={stallion.powerScore} color="#D85A30"/>
        <StatBar label="重馬場" value={stallion.heavyTrack} color="#7F77DD"/>
      </div>
      {stallion.notes&&<div style={{fontSize:11,color:"var(--color-text-secondary)",lineHeight:1.6,padding:"8px 10px",background:"var(--color-background-tertiary)",borderRadius:8,margin:"8px 0"}}>{stallion.notes}</div>}
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
        <button onClick={e=>{e.stopPropagation();onEdit(stallion)}} style={{padding:"5px 12px",borderRadius:6,border:"1px solid var(--color-border-tertiary)",background:"var(--color-background-primary)",color:"var(--color-text-secondary)",fontSize:11,cursor:"pointer"}}>編集</button>
        <button onClick={e=>{e.stopPropagation();onDelete(stallion.id)}} style={{padding:"5px 12px",borderRadius:6,border:"1px solid var(--color-border-tertiary)",background:"var(--color-background-primary)",color:"#A32D2D",fontSize:11,cursor:"pointer"}}>削除</button>
      </div></div>)}
    </div>
  );
};

/* ===== DB Form ===== */
const StallionForm=({stallion,onSave,onCancel})=>{
  const[f,setF]=useState({...stallion,pedigree:{...stallion.pedigree}});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const sp=(k,v)=>setF(p=>({...p,pedigree:{...p.pedigree,[k]:v}}));
  return(
    <div style={{background:"var(--color-background-primary)",border:"1px solid var(--color-border-tertiary)",borderRadius:12,padding:20,marginBottom:12}}>
      <h3 style={{fontSize:15,fontWeight:500,color:"var(--color-text-primary)",margin:"0 0 14px"}}>{stallion.name?"編集":"新規登録"}</h3>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        <Field label="馬名"><input value={f.name} onChange={e=>s("name",e.target.value)} style={inputStyle}/></Field>
        <Field label="英名"><input value={f.nameEn} onChange={e=>s("nameEn",e.target.value)} style={inputStyle}/></Field>
      </div>
      <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",marginBottom:6}}>3代血統</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        <Field label="父"><input value={f.pedigree?.sire||""} onChange={e=>sp("sire",e.target.value)} style={inputStyle}/></Field>
        <Field label="母"><input value={f.pedigree?.dam||""} onChange={e=>sp("dam",e.target.value)} style={inputStyle}/></Field>
        <Field label="父の父"><input value={f.pedigree?.sireOfSire||""} onChange={e=>sp("sireOfSire",e.target.value)} style={inputStyle}/></Field>
        <Field label="父の母"><input value={f.pedigree?.damOfSire||""} onChange={e=>sp("damOfSire",e.target.value)} style={inputStyle}/></Field>
        <Field label="母の父"><input value={f.pedigree?.sireOfDam||""} onChange={e=>sp("sireOfDam",e.target.value)} style={inputStyle}/></Field>
        <Field label="母の母"><input value={f.pedigree?.damOfDam||""} onChange={e=>sp("damOfDam",e.target.value)} style={inputStyle}/></Field>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
        <Field label="馬場"><select value={f.surface} onChange={e=>s("surface",e.target.value)} style={inputStyle}>{Object.entries(SURFACE).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></Field>
        <Field label="コース"><select value={f.course} onChange={e=>s("course",e.target.value)} style={inputStyle}>{Object.entries(COURSE).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></Field>
        <Field label="成長型"><select value={f.growth} onChange={e=>s("growth",e.target.value)} style={inputStyle}>{Object.entries(GROWTH).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></Field>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        <Field label="距離(下限)"><select value={f.distanceMin} onChange={e=>s("distanceMin",e.target.value)} style={inputStyle}>{Object.entries(DISTANCE).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></Field>
        <Field label="距離(上限)"><select value={f.distanceMax} onChange={e=>s("distanceMax",e.target.value)} style={inputStyle}>{Object.entries(DISTANCE).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></Field>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        {[["speedScore","スピード"],["staminaScore","スタミナ"],["powerScore","パワー"],["heavyTrack","重馬場"]].map(([k,l])=>(
          <Field key={k} label={`${l}: ${f[k]}`}><input type="range" min={1} max={10} value={f[k]} onChange={e=>s(k,Number(e.target.value))} style={{width:"100%"}}/></Field>
        ))}
      </div>
      <Field label="メモ"><textarea value={f.notes} onChange={e=>s("notes",e.target.value)} rows={2} style={{...inputStyle,resize:"vertical"}}/></Field>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:14}}>
        <button onClick={onCancel} style={{padding:"7px 14px",borderRadius:8,border:"1px solid var(--color-border-tertiary)",background:"var(--color-background-primary)",color:"var(--color-text-secondary)",fontSize:12,cursor:"pointer"}}>キャンセル</button>
        <button onClick={()=>onSave(f)} disabled={!f.name} style={{padding:"7px 14px",borderRadius:8,border:"none",background:f.name?"#1D9E75":"var(--color-border-tertiary)",color:"#fff",fontSize:12,fontWeight:500,cursor:f.name?"pointer":"default",opacity:f.name?1:0.5}}>保存</button>
      </div>
    </div>
  );
};

const AptitudeCard=({stallion,result,rank})=>{
  const[open,setOpen]=useState(false);
  const scoreColor=result.score>=80?"#1D9E75":result.score>=60?"#378ADD":result.score>=40?"#EF9F27":"#A32D2D";
  return(
    <div style={{background:"var(--color-background-primary)",border:"1px solid var(--color-border-tertiary)",borderRadius:12,overflow:"hidden"}}>
      <div onClick={()=>setOpen(!open)} style={{padding:"10px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:32,height:32,borderRadius:8,background:scoreColor,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:500,fontSize:13,flexShrink:0}}>{rank}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"baseline",gap:6}}>
            <span style={{fontSize:14,fontWeight:500,color:"var(--color-text-primary)"}}>{stallion.name}</span>
            <span style={{fontSize:10,color:"var(--color-text-tertiary)"}}>{stallion.nameEn}</span>
          </div>
          <div style={{fontSize:10,color:"var(--color-text-secondary)",marginTop:2}}>父: {stallion.pedigree?.sire} / 母父: {stallion.pedigree?.sireOfDam}</div>
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{fontSize:20,fontWeight:500,color:scoreColor}}>{result.score}</div>
          <div style={{fontSize:9,color:"var(--color-text-tertiary)"}}>/ 100</div>
        </div>
        <span style={{fontSize:14,color:"var(--color-text-tertiary)",transform:open?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▾</span>
      </div>
      {open&&(
        <div style={{padding:"0 16px 14px",borderTop:"1px solid var(--color-border-tertiary)"}}>
          <div style={{paddingTop:10}}>
            <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",marginBottom:8}}>適性スコア内訳</div>
            {result.details.map((d,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <span style={{width:60,fontSize:11,color:"var(--color-text-secondary)",textAlign:"right"}}>{d.label}</span>
                <div style={{flex:1,height:8,borderRadius:4,background:"var(--color-background-tertiary)",overflow:"hidden"}}>
                  <div style={{width:`${(d.pts/d.max)*100}%`,height:"100%",borderRadius:4,background:d.pts>=d.max*0.8?"#1D9E75":d.pts>=d.max*0.5?"#378ADD":"#EF9F27",transition:"width 0.3s"}}/>
                </div>
                <span style={{width:50,fontSize:10,color:"var(--color-text-secondary)",textAlign:"right"}}>{d.pts}/{d.max}</span>
                <span style={{fontSize:10,color:"var(--color-text-tertiary)",width:80}}>{d.note}</span>
              </div>
            ))}
            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:2,marginBottom:8}}>
              <span style={{width:60,fontSize:11,color:"var(--color-text-secondary)",textAlign:"right"}}>能力補正</span>
              <span style={{fontSize:11,fontWeight:500,color:"#7F77DD"}}>+{result.bonus}</span>
            </div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
              {surfBadge(stallion.surface)}{courseBadge(stallion.course)}{growthBadge(stallion.growth)}
            </div>
            <PedigreeTable pedigree={stallion.pedigree}/>
            {stallion.notes&&<div style={{fontSize:10,color:"var(--color-text-secondary)",lineHeight:1.5,padding:"6px 10px",background:"var(--color-background-tertiary)",borderRadius:8}}>{stallion.notes}</div>}
          </div>
        </div>
      )}
    </div>
  );
};


/* ================================================================
   ===== PHASE 3: ANALYSIS COMPONENTS =====
   ================================================================ */

/* --- Utility: Sire Line Classification --- */
const SIRE_LINES = {
  "サンデーサイレンス系": ["サンデーサイレンス","ディープインパクト","ステイゴールド","ハーツクライ","アグネスタキオン","フジキセキ","マンハッタンカフェ","ダイワメジャー","ネオユニヴァース","ゴールドアリュール","ブラックタイド","アドマイヤベガ","キタサンブラック","ダノンプレミアム","シルバーステート","ジョーカプチーノ"],
  "キングマンボ系": ["キングカメハメハ","キングマンボ","ドゥラメンテ","ロードカナロア","ルーラーシップ","リオンディーズ","エイシンフラッシュ","キングズベスト","サートゥルナーリア","トゥザワールド","ワークフォース"],
  "ロベルト系": ["シンボリクリスエス","クリスエス","ブライアンズタイム","タニノギムレット","リアルシャダイ","ロベルト","スクリーンヒーロー","グラスワンダー","モーリス"],
  "ノーザンダンサー系": ["デインヒル","ダンジグ","ハービンジャー","タートルボウル","サドラーズウェルズ","オペラハウス","ダンシングブレーヴ","リファール","ノーザンテースト","ディンヒル","ローエングリン","シングスピール","ウォーフロント","アメリカンペイトリオット","ドーンアプローチ","ポエティックフレア","ファルブラヴ","パドトロワ","ハードスパン","Sligo Bay"],
  "ミスタープロスペクター系": ["エンドスウィープ","フォーティナイナー","アドマイヤムーン","ファインニードル","リアルインパクト","カーソンシティ","City Zip"],
  "ストームキャット系": ["ヘネシー","ヘニーヒューズ","ストームキャット","レイヴンズパス","エルーシヴクオリティ","ジオポンティ","ドレフォン"],
  "エーピーインディ系": ["エーピーインディ","プルピット","パイロ","シニスターミニスター","オールドトリエステ","パイオニアオブザナイル","American Pharoah","スティーヴンゴットイーヴン","First Dude"],
  "その他": [],
};

function getSireLine(sireName) {
  for(const [line, sires] of Object.entries(SIRE_LINES)){
    if(sires.includes(sireName)) return line;
  }
  return "その他";
}

const LINE_COLORS = {
  "サンデーサイレンス系":"#1e5fa8",
  "キングマンボ系":"#3578c4",
  "ロベルト系":"#d4941a",
  "ノーザンダンサー系":"#4a90d9",
  "ミスタープロスペクター系":"#f0b840",
  "ストームキャット系":"#E05C97",
  "エーピーインディ系":"#44B8A8",
  "その他":"#999",
};

/* --- 1. Distance Range Chart --- */
const DistanceRangeChart=({stallions})=>{
  const distOrder=["SPRINT","MILE","MIDDLE","LONG"];
  const distX={SPRINT:0, MILE:1, MIDDLE:2, LONG:3};
  const sorted=[...stallions].sort((a,b)=>{
    const aMid=(distX[a.distanceMin]+distX[a.distanceMax])/2;
    const bMid=(distX[b.distanceMin]+distX[b.distanceMax])/2;
    return aMid-bMid || a.name.localeCompare(b.name,"ja");
  });
  const [hovered,setHovered]=useState(null);
  const barH=22, gap=3, padTop=36, padLeft=110, padRight=20;
  const chartW=500;
  const totalH=padTop+(barH+gap)*sorted.length+20;
  const colW=(chartW-padLeft-padRight)/4;

  return(
    <div style={{overflowX:"auto"}}>
      <svg viewBox={`0 0 ${chartW} ${totalH}`} style={{width:"100%",maxWidth:chartW,display:"block"}}>
        {/* Column headers */}
        {distOrder.map((d,i)=>(
          <g key={d}>
            <rect x={padLeft+i*colW} y={0} width={colW} height={totalH} fill={i%2===0?"transparent":"var(--color-background-secondary)"} opacity={0.3}/>
            <text x={padLeft+i*colW+colW/2} y={24} textAnchor="middle" fontSize={11} fontWeight={500} fill="var(--color-text-secondary)">{DIST_SHORT[d]}</text>
          </g>
        ))}
        {/* Bars */}
        {sorted.map((s,i)=>{
          const minI=distX[s.distanceMin]||0;
          const maxI=distX[s.distanceMax]||0;
          const x1=padLeft+minI*colW+4;
          const x2=padLeft+(maxI+1)*colW-4;
          const y=padTop+i*(barH+gap);
          const surfColor=s.surface==="TURF"?"#1e5fa8":s.surface==="DIRT"?"#f0b840":"#4a90d9";
          const isHover=hovered===s.id;
          return(
            <g key={s.id} onMouseEnter={()=>setHovered(s.id)} onMouseLeave={()=>setHovered(null)} style={{cursor:"pointer"}}>
              <text x={padLeft-6} y={y+barH/2+4} textAnchor="end" fontSize={10} fontWeight={isHover?600:400} fill={isHover?surfColor:"var(--color-text-primary)"}>{s.name}</text>
              <rect x={x1} y={y+2} width={Math.max(x2-x1,8)} height={barH-4} rx={6} fill={surfColor} opacity={isHover?1:0.7}/>
              {isHover&&<text x={x2+6} y={y+barH/2+4} fontSize={9} fill="var(--color-text-secondary)">SP:{s.speedScore} ST:{s.staminaScore} PW:{s.powerScore}</text>}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/* --- 2. Surface Aptitude Scatter --- */
const SurfaceScatter=({stallions})=>{
  const [hovered,setHovered]=useState(null);
  const padL=50,padR=30,padT=40,padB=50;
  const w=480,h=380;
  const innerW=w-padL-padR, innerH=h-padT-padB;

  // X = speed, Y = stamina, color = surface, size = power
  return(
    <div>
      <div style={{fontSize:11,color:"var(--color-text-tertiary)",marginBottom:8}}>X軸: スピード / Y軸: スタミナ / 円の大きさ: パワー / 色: 馬場適性</div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{width:"100%",maxWidth:w,display:"block"}}>
        {/* Grid */}
        {[...Array(10)].map((_,i)=>{
          const x=padL+(i/9)*innerW;
          const y=padT+(i/9)*innerH;
          return(<g key={i}>
            <line x1={x} y1={padT} x2={x} y2={padT+innerH} stroke="var(--color-border-tertiary)" strokeWidth={0.5}/>
            <line x1={padL} y1={y} x2={padL+innerW} y2={y} stroke="var(--color-border-tertiary)" strokeWidth={0.5}/>
            <text x={x} y={h-padB+16} textAnchor="middle" fontSize={9} fill="var(--color-text-tertiary)">{i+1}</text>
            <text x={padL-8} y={padT+innerH-(i/9)*innerH+3} textAnchor="end" fontSize={9} fill="var(--color-text-tertiary)">{i+1}</text>
          </g>);
        })}
        <text x={w/2} y={h-6} textAnchor="middle" fontSize={11} fill="var(--color-text-secondary)">スピード →</text>
        <text x={10} y={h/2} textAnchor="middle" fontSize={11} fill="var(--color-text-secondary)" transform={`rotate(-90,10,${h/2})`}>スタミナ →</text>
        {/* Bubbles */}
        {stallions.map(s=>{
          const cx=padL+((s.speedScore-1)/9)*innerW;
          const cy=padT+innerH-((s.staminaScore-1)/9)*innerH;
          const r=6+s.powerScore*1.5;
          const surfColor=s.surface==="TURF"?"#1e5fa8":s.surface==="DIRT"?"#f0b840":"#4a90d9";
          const isH=hovered===s.id;
          return(
            <g key={s.id} onMouseEnter={()=>setHovered(s.id)} onMouseLeave={()=>setHovered(null)} style={{cursor:"pointer"}}>
              <circle cx={cx} cy={cy} r={r} fill={surfColor} opacity={isH?0.95:0.55} stroke={isH?surfColor:"none"} strokeWidth={2}/>
              {isH&&<>
                <text x={cx} y={cy-r-4} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--color-text-primary)">{s.name}</text>
                <text x={cx} y={cy-r-16} textAnchor="middle" fontSize={9} fill="var(--color-text-secondary)">{SURFACE[s.surface]} / PW:{s.powerScore}</text>
              </>}
            </g>
          );
        })}
        {/* Legend */}
        {[{l:"芝",c:"#1e5fa8"},{l:"ダート",c:"#f0b840"},{l:"兼用",c:"#4a90d9"}].map((item,i)=>(
          <g key={i} transform={`translate(${padL+i*70},${padT-28})`}>
            <circle cx={6} cy={0} r={5} fill={item.c} opacity={0.7}/>
            <text x={16} y={4} fontSize={10} fill="var(--color-text-secondary)">{item.l}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};

/* --- 3. Sire x BMS Heatmap --- */
const SireBmsHeatmap=({stallions})=>{
  // Build unique sire and sireOfDam (BMS) names from actual data
  const sireNames=[...new Set(stallions.map(s=>s.pedigree?.sire).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"ja"));
  const bmsNames=[...new Set(stallions.map(s=>s.pedigree?.sireOfDam).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"ja"));
  
  // For the heatmap, pick top sires and top BMS that appear at least once
  const sireCount={};
  stallions.forEach(s=>{if(s.pedigree?.sire)sireCount[s.pedigree.sire]=(sireCount[s.pedigree.sire]||0)+1;});
  const bmsCount={};
  stallions.forEach(s=>{if(s.pedigree?.sireOfDam)bmsCount[s.pedigree.sireOfDam]=(bmsCount[s.pedigree.sireOfDam]||0)+1;});

  const topSires=Object.entries(sireCount).sort((a,b)=>b[1]-a[1]).slice(0,10).map(e=>e[0]);
  const topBms=Object.entries(bmsCount).sort((a,b)=>b[1]-a[1]).slice(0,10).map(e=>e[0]);

  // Build matrix: for each (sire, bms) pair, average total ability
  const matrix={};
  stallions.forEach(s=>{
    const sr=s.pedigree?.sire;
    const bm=s.pedigree?.sireOfDam;
    if(!sr||!bm) return;
    const key=`${sr}|${bm}`;
    if(!matrix[key]) matrix[key]={sum:0,count:0,names:[]};
    const total=(s.speedScore+s.staminaScore+s.powerScore)/3;
    matrix[key].sum+=total;
    matrix[key].count++;
    matrix[key].names.push(s.name);
  });

  // Also show sire-line affinity scores (simulated from data)
  const cellSize=42, padL=90, padT=90, padR=10, padB=10;
  const w=padL+topSires.length*cellSize+padR;
  const h=padT+topBms.length*cellSize+padB;

  const [hoverCell,setHoverCell]=useState(null);

  const getColor=(val)=>{
    if(!val) return "var(--color-background-secondary)";
    const t=Math.max(0,Math.min(1,(val-4)/5));
    const r=Math.round(29+t*0);
    const g=Math.round(158*t);
    const b=Math.round(117*t);
    return `rgb(${r},${g},${b})`;
  };

  return(
    <div>
      <div style={{fontSize:11,color:"var(--color-text-tertiary)",marginBottom:8}}>父 × 母父の組み合わせ別 平均能力値（データが存在するセルのみ着色）</div>
      <div style={{overflowX:"auto"}}>
        <svg viewBox={`0 0 ${w} ${h}`} style={{width:"100%",maxWidth:w,minWidth:400,display:"block"}}>
          {/* Column headers (sires) */}
          {topSires.map((sr,i)=>(
            <text key={sr} x={padL+i*cellSize+cellSize/2} y={padT-8} textAnchor="end" fontSize={9} fill="var(--color-text-secondary)" transform={`rotate(-45,${padL+i*cellSize+cellSize/2},${padT-8})`}>{sr.slice(0,6)}</text>
          ))}
          {/* Row headers (BMS) */}
          {topBms.map((bm,j)=>(
            <text key={bm} x={padL-6} y={padT+j*cellSize+cellSize/2+3} textAnchor="end" fontSize={9} fill="var(--color-text-secondary)">{bm.slice(0,7)}</text>
          ))}
          {/* Cells */}
          {topSires.map((sr,i)=>
            topBms.map((bm,j)=>{
              const key=`${sr}|${bm}`;
              const cell=matrix[key];
              const avg=cell?cell.sum/cell.count:null;
              const isH=hoverCell===key;
              return(
                <g key={key} onMouseEnter={()=>setHoverCell(key)} onMouseLeave={()=>setHoverCell(null)} style={{cursor:cell?"pointer":"default"}}>
                  <rect x={padL+i*cellSize+1} y={padT+j*cellSize+1} width={cellSize-2} height={cellSize-2} rx={4}
                    fill={avg?getColor(avg):"var(--color-background-secondary)"} opacity={avg?(isH?1:0.8):0.3}
                    stroke={isH&&avg?"var(--color-text-primary)":"none"} strokeWidth={1.5}/>
                  {avg&&<text x={padL+i*cellSize+cellSize/2} y={padT+j*cellSize+cellSize/2+4} textAnchor="middle" fontSize={10} fontWeight={500} fill="#fff">{avg.toFixed(1)}</text>}
                </g>
              );
            })
          )}
          {/* Hover tooltip */}
          {hoverCell&&matrix[hoverCell]&&(()=>{
            const [sr,bm]=hoverCell.split("|");
            const cell=matrix[hoverCell];
            const i=topSires.indexOf(sr);
            const j=topBms.indexOf(bm);
            const tx=padL+i*cellSize+cellSize+4;
            const ty=padT+j*cellSize;
            return(
              <g>
                <rect x={tx} y={ty} width={130} height={40} rx={6} fill="var(--color-background-primary)" stroke="var(--color-border-tertiary)"/>
                <text x={tx+8} y={ty+14} fontSize={9} fontWeight={500} fill="var(--color-text-primary)">{sr}×{bm}</text>
                <text x={tx+8} y={ty+28} fontSize={9} fill="var(--color-text-secondary)">{cell.names.join(", ")}</text>
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
};

/* --- 4. Sire Line Trend (Stacked Bar) --- */
const SireLineTrend=({stallions})=>{
  // Group stallions by sire line
  const lineData={};
  const allLines=new Set();
  
  stallions.forEach(s=>{
    const sireName=s.pedigree?.sire||"不明";
    const line=getSireLine(sireName);
    allLines.add(line);
    if(!lineData[line]) lineData[line]={count:0,stallions:[],avgSpeed:0,avgStamina:0,avgPower:0};
    lineData[line].count++;
    lineData[line].stallions.push(s);
    lineData[line].avgSpeed+=s.speedScore;
    lineData[line].avgStamina+=s.staminaScore;
    lineData[line].avgPower+=s.powerScore;
  });

  // Compute averages
  Object.values(lineData).forEach(d=>{
    d.avgSpeed=+(d.avgSpeed/d.count).toFixed(1);
    d.avgStamina=+(d.avgStamina/d.count).toFixed(1);
    d.avgPower=+(d.avgPower/d.count).toFixed(1);
  });

  const lines=Object.entries(lineData).sort((a,b)=>b[1].count-a[1].count);
  const total=stallions.length;
  const [hoveredLine,setHoveredLine]=useState(null);

  // Surface distribution per line
  const surfDist=(lst)=>{
    const t=lst.filter(s=>s.surface==="TURF").length;
    const d=lst.filter(s=>s.surface==="DIRT").length;
    const b=lst.filter(s=>s.surface==="BOTH").length;
    return {turf:t,dirt:d,both:b};
  };

  // Growth distribution per line
  const growthDist=(lst)=>{
    const e=lst.filter(s=>s.growth==="EARLY").length;
    const n=lst.filter(s=>s.growth==="NORMAL").length;
    const l=lst.filter(s=>s.growth==="LATE").length;
    return {early:e,normal:n,late:l};
  };

  const barMaxW=300, barH=32, gap=8, padL=140, padR=60;
  const svgW=padL+barMaxW+padR;
  const svgH=40+lines.length*(barH+gap)+60;

  return(
    <div>
      <div style={{fontSize:11,color:"var(--color-text-tertiary)",marginBottom:12}}>父系統（サイアーライン）ごとの頭数分布と平均能力値</div>
      <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{width:"100%",maxWidth:svgW,display:"block"}}>
        <text x={padL} y={20} fontSize={11} fontWeight={500} fill="var(--color-text-secondary)">系統別構成比（{total}頭）</text>
        {lines.map(([name,data],i)=>{
          const y=40+i*(barH+gap);
          const bw=(data.count/total)*barMaxW;
          const pct=((data.count/total)*100).toFixed(0);
          const col=LINE_COLORS[name]||"#999";
          const isH=hoveredLine===name;
          const sd=surfDist(data.stallions);
          const gd=growthDist(data.stallions);
          return(
            <g key={name} onMouseEnter={()=>setHoveredLine(name)} onMouseLeave={()=>setHoveredLine(null)} style={{cursor:"pointer"}}>
              <text x={padL-8} y={y+barH/2+4} textAnchor="end" fontSize={10} fontWeight={isH?600:400} fill={isH?col:"var(--color-text-primary)"}>{name}</text>
              <rect x={padL} y={y+2} width={Math.max(bw,4)} height={barH-4} rx={6} fill={col} opacity={isH?1:0.7}/>
              <text x={padL+bw+8} y={y+barH/2+4} fontSize={10} fontWeight={500} fill="var(--color-text-secondary)">{data.count}頭 ({pct}%)</text>
              {isH&&(
                <g>
                  <rect x={padL} y={y+barH+2} width={barMaxW+padR} height={52} rx={6} fill="var(--color-background-primary)" stroke="var(--color-border-tertiary)" strokeWidth={0.5}/>
                  <text x={padL+8} y={y+barH+18} fontSize={9} fill="var(--color-text-secondary)">
                    平均 — SP: {data.avgSpeed}　ST: {data.avgStamina}　PW: {data.avgPower}
                  </text>
                  <text x={padL+8} y={y+barH+32} fontSize={9} fill="var(--color-text-secondary)">
                    馬場 — 芝:{sd.turf} ダ:{sd.dirt} 兼:{sd.both}　成長 — 早:{gd.early} 普:{gd.normal} 晩:{gd.late}
                  </text>
                  <text x={padL+8} y={y+barH+46} fontSize={8} fill="var(--color-text-tertiary)">
                    {data.stallions.map(s=>s.name).join("、")}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/* --- Analysis Tab Wrapper --- */
const AnalysisTab=({stallions})=>{
  const [subTab,setSubTab]=useState("distance");
  const tabs=[
    {id:"distance",label:"距離適性"},
    {id:"surface",label:"芝/ダート"},
    {id:"heatmap",label:"父×母父"},
    {id:"trend",label:"系統トレンド"},
  ];
  const subBtn=(id,label)=>(
    <button key={id} onClick={()=>setSubTab(id)} style={{
      padding:"6px 14px",borderRadius:20,border:subTab===id?"none":"1px solid var(--color-border-tertiary)",
      background:subTab===id?"#3578c4":"transparent",
      color:subTab===id?"#fff":"var(--color-text-secondary)",
      fontSize:11,fontWeight:500,cursor:"pointer",transition:"all 0.2s"
    }}>{label}</button>
  );

  return(
    <div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
        {tabs.map(t=>subBtn(t.id,t.label))}
      </div>
      <div style={{background:"var(--color-background-primary)",border:"1px solid var(--color-border-tertiary)",borderRadius:12,padding:16}}>
        {subTab==="distance"&&<DistanceRangeChart stallions={stallions}/>}
        {subTab==="surface"&&<SurfaceScatter stallions={stallions}/>}
        {subTab==="heatmap"&&<SireBmsHeatmap stallions={stallions}/>}
        {subTab==="trend"&&<SireLineTrend stallions={stallions}/>}
      </div>
    </div>
  );
};

/* ================================================================
   ===== PHASE 4: RACE PREDICTION =====
   ================================================================ */


// findJockey/calcJockeyVenueScore are initialized after data loads
let _jockeysData=[];
const setJockeysData=(d)=>{_jockeysData=d;};
const findJockey=(name)=>{
  if(!name) return null;
  return _jockeysData.find(j=>j.name===name)||null;
};

const calcJockeyVenueScore=(jockeyName,venueKey)=>{
  const j=findJockey(jockeyName);
  if(!j) return {score:0,aff:0,label:"騎手DB未登録"};
  const aff=j.venueAff[venueKey]||5;
  // Score out of 10: venue affinity + win rate bonus + G1 bonus
  const wrBonus=Math.min(3,j.winRate*15);
  const g1Bonus=Math.min(2,j.g1Wins/20);
  const total=Math.min(10,+(aff*0.6+wrBonus+g1Bonus).toFixed(1));
  const label=total>=8?"◎ 絶好":total>=6.5?"○ 好相性":total>=5?"▲ 普通":total>=3.5?"✖ やや不安":"⭐ 未知数";
  return {score:total,aff,label,jockey:j};
};

/* Runner entry row */
const RunnerRow=({runner,index,onChange,onRemove,matchedSire,matchedBms,matchedDam})=>{
  const jMatch=!!findJockey(runner.jockey);
  return(
    <div style={{display:"flex",gap:3,alignItems:"center",padding:"5px 0",borderBottom:"1px solid var(--color-border-tertiary)"}}>
      <span style={{width:18,fontSize:11,fontWeight:500,color:"var(--color-text-tertiary)",textAlign:"center",flexShrink:0}}>{index+1}</span>
      <input value={runner.name} onChange={e=>onChange("name",e.target.value)} placeholder="馬名"
        style={{flex:2,padding:"4px 5px",borderRadius:6,border:"1px solid var(--color-border-tertiary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:10,minWidth:0}}/>
      <div style={{flex:1.3,position:"relative"}}>
        <input value={runner.sire} onChange={e=>onChange("sire",e.target.value)} placeholder="父"
          style={{width:"100%",padding:"4px 5px",borderRadius:6,border:`1px solid ${matchedSire?"#1e5fa8":"var(--color-border-tertiary)"}`,background:matchedSire?"#f0f6fd":"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:10,boxSizing:"border-box"}}/>
        {matchedSire&&<span style={{position:"absolute",right:2,top:5,fontSize:7,color:"#1e5fa8"}}>✓</span>}
      </div>
      <div style={{flex:1.3,position:"relative"}}>
        <input value={runner.bms||""} onChange={e=>onChange("bms",e.target.value)} placeholder="母父"
          style={{width:"100%",padding:"4px 5px",borderRadius:6,border:`1px solid ${matchedBms?"#3578c4":"var(--color-border-tertiary)"}`,background:matchedBms?"#E6F1FB":"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:10,boxSizing:"border-box"}}/>
        {matchedBms&&<span style={{position:"absolute",right:2,top:5,fontSize:7,color:"#3578c4"}}>✓</span>}
      </div>
      <div style={{flex:1.3,position:"relative"}}>
        <input value={runner.dam||""} onChange={e=>onChange("dam",e.target.value)} placeholder="母"
          style={{width:"100%",padding:"4px 5px",borderRadius:6,border:`1px solid ${matchedDam?"#E05C97":"var(--color-border-tertiary)"}`,background:matchedDam?"#FBEAF0":"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:10,boxSizing:"border-box"}}/>
        {matchedDam&&<span style={{position:"absolute",right:2,top:5,fontSize:7,color:"#E05C97"}}>✓</span>}
      </div>
      <div style={{flex:1.2,position:"relative"}}>
        <input value={runner.jockey||""} onChange={e=>onChange("jockey",e.target.value)} placeholder="騎手"
          style={{width:"100%",padding:"4px 5px",borderRadius:6,border:`1px solid ${jMatch?"#d4941a":"var(--color-border-tertiary)"}`,background:jMatch?"#f0f6fd":"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:10,boxSizing:"border-box"}}/>
        {jMatch&&<span style={{position:"absolute",right:2,top:5,fontSize:7,color:"#d4941a"}}>✓</span>}
      </div>
      <select value={runner.age} onChange={e=>onChange("age",e.target.value)}
        style={{width:36,padding:"4px 1px",borderRadius:6,border:"1px solid var(--color-border-tertiary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:9,flexShrink:0}}>
        <option value="ANY">齢</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6+</option>
      </select>
      <button onClick={onRemove} style={{width:20,height:20,borderRadius:6,border:"none",background:"transparent",color:"var(--color-text-tertiary)",fontSize:12,cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
    </div>
  );
};

/* Prediction result card */
const PredictionCard=({entry,rank,expanded,onToggle,venueKey})=>{
  const scoreColor=entry.score>=75?"#1e5fa8":entry.score>=55?"#3578c4":entry.score>=35?"#f0b840":"#A32D2D";
  const recLabel=entry.score>=80?"◎":entry.score>=70?"○":entry.score>=60?"▲":entry.score>=50?"✖":"⭐";
  const recFull=entry.score>=80?"◎ 本命":entry.score>=70?"○ 対抗":entry.score>=60?"▲ 単穴":entry.score>=50?"✖ 軽視":"⭐ 大穴";
  const recColor=entry.score>=80?"#1e5fa8":entry.score>=70?"#3578c4":entry.score>=60?"#4a90d9":entry.score>=50?"#A32D2D":"#E05C97";
  const jvs=entry.jockeyVenue;
  return(
    <div style={{background:"var(--color-background-primary)",border:"1px solid var(--color-border-tertiary)",borderRadius:12,overflow:"hidden",marginBottom:6}}>
      <div onClick={onToggle} style={{padding:"10px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:30,height:30,borderRadius:8,background:scoreColor,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:600,fontSize:12,flexShrink:0}}>{rank}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2,flexWrap:"wrap"}}>
            <span style={{fontSize:16,fontWeight:700,color:recColor}}>{recLabel}</span>
            <span style={{fontSize:14,fontWeight:600,color:"var(--color-text-primary)"}}>{entry.runner.name||"(未入力)"}</span>
            {entry.runner.jockey&&<span style={{fontSize:9,padding:"1px 6px",borderRadius:8,background:"var(--color-background-secondary)",color:"var(--color-text-secondary)",fontWeight:500}}>{entry.runner.jockey}</span>}
          </div>
          <div style={{fontSize:10,color:"var(--color-text-secondary)"}}>
            父: {entry.runner.sire||"—"} / 母父: {entry.runner.bms||"—"}{entry.runner.dam?` / 母: ${entry.runner.dam}`:""}{entry.runner.age&&entry.runner.age!=="ANY"?` / ${entry.runner.age}歳`:""}
          </div>
          {jvs&&jvs.jockey&&(
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}>
              <span style={{fontSize:9,color:jvs.score>=7?"#1e5fa8":jvs.score>=5?"#3578c4":"#f0b840",fontWeight:600}}>🏇 騎手×会場: {jvs.label}</span>
              <span style={{fontSize:9,color:"var(--color-text-tertiary)"}}>({jvs.score}/10)</span>
            </div>
          )}
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{fontSize:22,fontWeight:600,color:scoreColor}}>{entry.score}</div>
          <div style={{fontSize:9,color:"var(--color-text-tertiary)"}}>/ 100</div>
        </div>
        <span style={{fontSize:14,color:"var(--color-text-tertiary)",transform:expanded?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▾</span>
      </div>
      {expanded&&(
        <div style={{padding:"0 14px 14px",borderTop:"1px solid var(--color-border-tertiary)"}}>
          <div style={{paddingTop:10}}>
            {/* Score breakdown */}
            <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",marginBottom:8}}>血統スコア内訳</div>
            {entry.details.map((d,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <span style={{width:65,fontSize:10,color:"var(--color-text-secondary)",textAlign:"right"}}>{d.label}</span>
                <div style={{flex:1,height:7,borderRadius:4,background:"#f0f6fd",overflow:"hidden"}}>
                  <div style={{width:`${(d.pts/d.max)*100}%`,height:"100%",borderRadius:4,background:d.pts>=d.max*0.8?"#1e5fa8":d.pts>=d.max*0.5?"#3578c4":"#f0b840",transition:"width 0.3s"}}/>
                </div>
                <span style={{width:45,fontSize:9,color:"var(--color-text-secondary)",textAlign:"right"}}>{d.pts}/{d.max}</span>
                <span style={{fontSize:9,color:"var(--color-text-tertiary)",width:75}}>{d.note}</span>
              </div>
            ))}
            {entry.bonus>0&&(
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:2}}>
                <span style={{width:65,fontSize:10,color:"var(--color-text-secondary)",textAlign:"right"}}>能力補正</span>
                <span style={{fontSize:11,fontWeight:500,color:"#4a90d9"}}>+{entry.bonus}</span>
              </div>
            )}
            {/* Matched DB info */}
            {entry.matchedSire&&(
              <div style={{marginTop:10,padding:"8px 10px",background:"#f0f6fd",borderRadius:8}}>
                <div style={{fontSize:10,fontWeight:500,color:"#1e5fa8",marginBottom:4}}>父 {entry.matchedSire.name} — DB照合済</div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:4}}>
                  {surfBadge(entry.matchedSire.surface)}{courseBadge(entry.matchedSire.course)}{growthBadge(entry.matchedSire.growth)}
                </div>
                <div style={{fontSize:10,color:"var(--color-text-secondary)"}}>
                  SP:{entry.matchedSire.speedScore} / ST:{entry.matchedSire.staminaScore} / PW:{entry.matchedSire.powerScore} / 重:{entry.matchedSire.heavyTrack}
                </div>
                {entry.matchedSire.notes&&<div style={{fontSize:9,color:"var(--color-text-tertiary)",marginTop:4}}>{entry.matchedSire.notes}</div>}
              </div>
            )}
            {entry.matchedBms&&(
              <div style={{marginTop:6,padding:"8px 10px",background:"#f0f6fd",borderRadius:8}}>
                <div style={{fontSize:10,fontWeight:500,color:"#3578c4",marginBottom:4}}>母父 {entry.matchedBms.name} — DB照合済</div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:4}}>
                  {surfBadge(entry.matchedBms.surface)}{courseBadge(entry.matchedBms.course)}{growthBadge(entry.matchedBms.growth)}
                </div>
                <div style={{fontSize:10,color:"var(--color-text-secondary)"}}>
                  SP:{entry.matchedBms.speedScore} / ST:{entry.matchedBms.staminaScore} / PW:{entry.matchedBms.powerScore} / 重:{entry.matchedBms.heavyTrack}
                </div>
              </div>
            )}
            {entry.matchedDam&&(
              <div style={{marginTop:6,padding:"8px 10px",background:"#f0f6fd",borderRadius:8,border:"1px solid #E05C97"}}>
                <div style={{fontSize:10,fontWeight:500,color:"#E05C97",marginBottom:4}}>母 {entry.matchedDam.name} — 繁殖牝馬DB照合済</div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:4}}>
                  {surfBadge(entry.matchedDam.surface)}{courseBadge(entry.matchedDam.course)}{growthBadge(entry.matchedDam.growth)}
                </div>
                <div style={{fontSize:10,color:"var(--color-text-secondary)"}}>
                  SP:{entry.matchedDam.speedScore} / ST:{entry.matchedDam.staminaScore} / PW:{entry.matchedDam.powerScore} / 重:{entry.matchedDam.heavyTrack}
                </div>
                {entry.matchedDam.notes&&<div style={{fontSize:9,color:"var(--color-text-tertiary)",marginTop:3}}>{entry.matchedDam.notes}</div>}
              </div>
            )}
            {/* Strengths / Weaknesses */}
            {entry.strengths.length>0&&(
              <div style={{marginTop:8,fontSize:10,color:"#1e5fa8"}}>
                <span style={{fontWeight:500}}>強み: </span>{entry.strengths.join(" / ")}
              </div>
            )}
            {entry.weaknesses.length>0&&(
              <div style={{marginTop:3,fontSize:10,color:"#A32D2D"}}>
                <span style={{fontWeight:500}}>弱点: </span>{entry.weaknesses.join(" / ")}
              </div>
            )}
            {/* Training comment */}
            {entry.runner.training&&(
              <div style={{marginTop:8,padding:"8px 10px",background:"rgba(200,168,75,0.08)",border:"1px solid rgba(200,168,75,0.25)",borderRadius:8}}>
                <div style={{fontSize:10,fontWeight:600,color:"#c8a84b",marginBottom:3}}>🏋️ 調教コメント</div>
                <div style={{fontSize:9,color:"var(--color-text-secondary)",lineHeight:1.6}}>{entry.runner.training}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* Mini radar chart for comparing top runners */
const MiniRadar=({entries,labels})=>{
  const size=200, cx=size/2, cy=size/2, r=70;
  const axes=labels||["馬場","距離","コース","馬場状態","成長"];
  const n=axes.length;
  const angleStep=(Math.PI*2)/n;
  const colors=["#1e5fa8","#3578c4","#d4941a","#4a90d9","#E05C97"];

  const getPoint=(i,val)=>{
    const angle=-Math.PI/2+i*angleStep;
    const dist=(val/100)*r;
    return [cx+Math.cos(angle)*dist, cy+Math.sin(angle)*dist];
  };

  return(
    <svg viewBox={`0 0 ${size} ${size}`} style={{width:"100%",maxWidth:size}}>
      {/* Grid rings */}
      {[0.25,0.5,0.75,1].map((s,i)=>(
        <polygon key={i} points={Array.from({length:n},(_,j)=>{const a=-Math.PI/2+j*angleStep;return `${cx+Math.cos(a)*r*s},${cy+Math.sin(a)*r*s}`;}).join(" ")}
          fill="none" stroke="var(--color-border-tertiary)" strokeWidth={0.5}/>
      ))}
      {/* Axis lines & labels */}
      {axes.map((label,i)=>{
        const a=-Math.PI/2+i*angleStep;
        const lx=cx+Math.cos(a)*(r+18);
        const ly=cy+Math.sin(a)*(r+18);
        return(<g key={i}>
          <line x1={cx} y1={cy} x2={cx+Math.cos(a)*r} y2={cy+Math.sin(a)*r} stroke="var(--color-border-tertiary)" strokeWidth={0.5}/>
          <text x={lx} y={ly+3} textAnchor="middle" fontSize={8} fill="var(--color-text-tertiary)">{label}</text>
        </g>);
      })}
      {/* Data polygons */}
      {entries.slice(0,4).map((e,ei)=>{
        const vals=e.details.map(d=>(d.pts/d.max)*100);
        const points=vals.map((v,i)=>getPoint(i,v).join(",")).join(" ");
        return(<g key={ei}>
          <polygon points={points} fill={colors[ei]} fillOpacity={0.12} stroke={colors[ei]} strokeWidth={1.5}/>
          {vals.map((v,i)=>{const[px,py]=getPoint(i,v);return <circle key={i} cx={px} cy={py} r={2.5} fill={colors[ei]}/>;})}
        </g>);
      })}
    </svg>
  );
};

/* Main Prediction Tab */
const RacePredictionTab=({stallions,broodmares=[]})=>{
  const [pVenue,setPVenue]=useState("tokyo");
  const [pSurface,setPSurface]=useState("TURF");
  const [pDistance,setPDistance]=useState("MIDDLE");
  const [pCond,setPCond]=useState("GOOD");
  const [runners,setRunners]=useState([
    {name:"",sire:"",bms:"",dam:"",jockey:"",age:"3"},
    {name:"",sire:"",bms:"",dam:"",jockey:"",age:"3"},
    {name:"",sire:"",bms:"",dam:"",jockey:"",age:"3"},
  ]);
  const [results,setResults]=useState(null);
  const [expandedId,setExpandedId]=useState(null);
  const [showInput,setShowInput]=useState(true);

  const pVenueData=VENUES[pVenue];
  const pCourse=pVenueData?.course||"RIGHT";

  // Update surface if venue doesn't support it
  useEffect(()=>{
    const v=VENUES[pVenue];
    if(v&&!v.surface.includes(pSurface)) setPSurface(v.surface[0]);
  },[pVenue]);

  const updateRunner=(i,field,val)=>{
    setRunners(prev=>{const n=[...prev];n[i]={...n[i],[field]:val};return n;});
  };
  const removeRunner=(i)=>{
    setRunners(prev=>prev.filter((_,j)=>j!==i));
  };
  const addRunner=()=>{
    if(runners.length<18) setRunners(prev=>[...prev,{name:"",sire:"",bms:"",dam:"",jockey:"",age:"3"}]);
  };

  // Find matching stallion in DB
  const findStallion=(name)=>{
    if(!name) return null;
    const q=name.trim();
    return stallions.find(s=>s.name===q)||stallions.find(s=>s.nameEn?.toLowerCase()===q.toLowerCase())||null;
  };

  // Find matching broodmare
  const findBroodmare=(name)=>{
    if(!name) return null;
    const q=name.trim();
    return broodmares.find(m=>m.name===q)||null;
  };

  // Calculate predictions
  const calcPredictions=()=>{
    const validRunners=runners.filter(r=>r.name||r.sire);
    if(validRunners.length===0) return;

    const raceConfig={surface:pSurface, distance:pDistance, course:pCourse, trackCondition:pCond};
    
    const scored=validRunners.map(runner=>{
      const matchedSire=findStallion(runner.sire);
      const matchedBms=findStallion(runner.bms);
      const matchedDam=findBroodmare(runner.dam);
      
      // Weights: sire 55%, BMS 20%, dam 25% (when dam available)
      // Without dam: sire 70%, BMS 30% (fallback)
      const hasDam=!!matchedDam;
      const wSire=hasDam?0.55:0.70;
      const wBms=hasDam?0.20:0.30;
      const wDam=hasDam?0.25:0;
      
      let score=0, details=[], bonus=0, strengths=[], weaknesses=[];

      if(matchedSire){
        const sireResult=calcAptitude(matchedSire, {...raceConfig, horseAge:runner.age});
        const sireContrib=sireResult.score*wSire;
        details=sireResult.details.map(d=>({...d,pts:+(d.pts*wSire).toFixed(1),max:+(d.max*wSire).toFixed(1)}));
        score+=sireContrib;
        bonus+=sireResult.bonus*wSire;

        if(matchedSire.speedScore>=9) strengths.push("父のスピード◎");
        if(matchedSire.staminaScore>=9) strengths.push("父のスタミナ◎");
        if(matchedSire.powerScore>=9) strengths.push("父のパワー◎");
        if(matchedSire.heavyTrack>=8&&(pCond==="HEAVY"||pCond==="BAD")) strengths.push("重馬場巧者の血統");
        if(matchedSire.heavyTrack<=3&&(pCond==="HEAVY"||pCond==="BAD")) weaknesses.push("父は重馬場苦手");
        if(matchedSire.growth==="LATE"&&runner.age&&parseInt(runner.age)<=2) weaknesses.push("晩成血統×若駒");
        if(matchedSire.growth==="EARLY"&&runner.age&&parseInt(runner.age)>=5) weaknesses.push("早熟血統×高齢");
      } else if(runner.sire) {
        score+=40;
        details=[
          {label:"馬場",pts:7,max:17.5,note:"DB未登録"},
          {label:"距離",pts:7,max:17.5,note:"DB未登録"},
          {label:"コース",pts:6,max:14,note:"DB未登録"},
          {label:"馬場状態",pts:4,max:10.5,note:"DB未登録"},
          {label:"成長",pts:4,max:10.5,note:"DB未登録"},
        ];
        weaknesses.push("父がDB未登録");
      } else {
        score+=30;
        details=[
          {label:"馬場",pts:5,max:17.5,note:"父不明"},
          {label:"距離",pts:5,max:17.5,note:"父不明"},
          {label:"コース",pts:4,max:14,note:"父不明"},
          {label:"馬場状態",pts:3,max:10.5,note:"父不明"},
          {label:"成長",pts:3,max:10.5,note:"父不明"},
        ];
        weaknesses.push("父情報なし");
      }

      if(matchedBms){
        const bmsResult=calcAptitude(matchedBms, {...raceConfig, horseAge:runner.age});
        const bmsContrib=bmsResult.score*wBms;
        details=details.map((d,i)=>{
          const bmsD=bmsResult.details[i];
          if(bmsD){
            return {...d, pts:+(d.pts+bmsD.pts*wBms).toFixed(1), max:+(d.max+bmsD.max*wBms).toFixed(1)};
          }
          return d;
        });
        score+=bmsContrib;
        bonus+=bmsResult.bonus*wBms;

        if(matchedBms.speedScore>=9) strengths.push("母父のスピード◎");
        if(matchedBms.staminaScore>=9) strengths.push("母父のスタミナ◎");
        if(matchedBms.powerScore>=9&&pSurface==="DIRT") strengths.push("母父パワー×ダート◎");
      } else if(!matchedSire) {
        // Neither matched
      } else {
        score*=0.95;
      }

      // Dam (broodmare) contribution
      if(matchedDam){
        const damApt=calcAptitude(matchedDam, {...raceConfig, horseAge:runner.age});
        const damContrib=damApt.score*wDam;
        details=details.map((d,i)=>{
          const damD=damApt.details[i];
          if(damD){
            return {...d, pts:+(d.pts+damD.pts*wDam).toFixed(1), max:+(d.max+damD.max*wDam).toFixed(1)};
          }
          return d;
        });
        score+=damContrib;
        bonus+=damApt.bonus*wDam;

        // Dam-specific analysis
        if(matchedDam.speedScore>=8) strengths.push("母のスピード○");
        if(matchedDam.staminaScore>=8) strengths.push("母のスタミナ○");
        if(matchedDam.notes&&matchedDam.notes.includes("G1")) strengths.push("母がG1級の良血");
        if(matchedDam.growth==="EARLY"&&runner.age==="3") strengths.push("母系の仕上がり早さ○");
        if(matchedDam.growth==="LATE"&&runner.age==="3") weaknesses.push("母系は晩成型");
      }

      // Sire-BMS synergy bonus
      if(matchedSire&&matchedBms){
        if(matchedSire.speedScore>=8&&matchedBms.staminaScore>=8) {bonus+=3;strengths.push("スピード×スタミナの補完◎");}
        if(matchedSire.surface==="TURF"&&matchedBms.surface==="BOTH") {bonus+=1;strengths.push("芝適性を幅広くカバー");}
        if(matchedSire.surface===pSurface&&matchedBms.surface===pSurface) {bonus+=2;strengths.push("父母父ともに馬場一致");}
        if(matchedSire.surface!==pSurface&&matchedSire.surface!=="BOTH"&&matchedBms.surface!==pSurface&&matchedBms.surface!=="BOTH") weaknesses.push("父母父ともに馬場不適合");
      }

      // Sire-Dam synergy bonus
      if(matchedSire&&matchedDam){
        const avgSpeed=(matchedSire.speedScore+matchedDam.speedScore)/2;
        const avgStamina=(matchedSire.staminaScore+matchedDam.staminaScore)/2;
        if(avgSpeed>=8&&pDistance==="MILE") {bonus+=2;strengths.push("父母ともにマイル適性高");}
        if(avgStamina>=8&&(pDistance==="MIDDLE"||pDistance==="LONG")) {bonus+=2;strengths.push("父母ともにスタミナ豊富");}
        if(matchedSire.surface===matchedDam.surface&&matchedDam.surface===pSurface) {bonus+=1.5;strengths.push("父母の馬場適性が一致");}
      }

      // Jockey × Venue affinity
      const jvs=calcJockeyVenueScore(runner.jockey, pVenue);
      if(jvs.jockey){
        // Jockey adds up to 5 points to total
        const jockeyBonus=jvs.score*0.5;
        bonus+=jockeyBonus;
        if(jvs.score>=8) strengths.push(`騎手${runner.jockey}×${pVenueData?.name||""}は${jvs.label}`);
        if(jvs.score<=4) weaknesses.push(`騎手${runner.jockey}は${pVenueData?.name||""}苦手`);
      }

      return {
        runner,
        matchedSire,
        matchedBms,
        matchedDam,
        jockeyVenue:jvs,
        score:Math.min(100,Math.max(0,+((score+bonus)).toFixed(1))),
        details,
        bonus:+bonus.toFixed(1),
        strengths:[...new Set(strengths)],
        weaknesses:[...new Set(weaknesses)],
      };
    });

    scored.sort((a,b)=>b.score-a.score);
    setResults(scored);
    setShowInput(false);
  };

  return(
    <div>
      {/* Toggle input/results */}
      {results&&(
        <button onClick={()=>setShowInput(!showInput)} style={{marginBottom:12,padding:"6px 14px",borderRadius:8,border:"1px solid var(--color-border-tertiary)",background:"var(--color-background-primary)",color:"var(--color-text-secondary)",fontSize:11,cursor:"pointer"}}>
          {showInput?"▲ 入力を閉じる":"▼ 出走馬を編集"}
        </button>
      )}

      {/* Race conditions & runner input */}
      {showInput&&(
        <div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:16,marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)",marginBottom:12}}>レース条件</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:16}}>
            <Field label="競馬場">
              <select value={pVenue} onChange={e=>setPVenue(e.target.value)} style={inputStyle}>
                {Object.entries(VENUES).map(([k,v])=><option key={k} value={k}>{v.name}</option>)}
              </select>
            </Field>
            <Field label="馬場">
              <select value={pSurface} onChange={e=>setPSurface(e.target.value)} style={inputStyle}>
                {(pVenueData?.surface||["TURF","DIRT"]).map(k=><option key={k} value={k}>{SURFACE[k]}</option>)}
              </select>
            </Field>
            <Field label="距離">
              <select value={pDistance} onChange={e=>setPDistance(e.target.value)} style={inputStyle}>
                {(pVenueData?.distances||Object.keys(DISTANCE)).filter(k=>k!=="VERSATILE").map(k=><option key={k} value={k}>{DISTANCE[k]}</option>)}
              </select>
            </Field>
            <Field label="馬場状態">
              <select value={pCond} onChange={e=>setPCond(e.target.value)} style={inputStyle}>
                {Object.entries(TRACK_COND).map(([k,v])=><option key={k} value={k}>{v}</option>)}
              </select>
            </Field>
          </div>

          {/* Runner condition summary */}
          <div style={{padding:"6px 10px",background:"var(--color-background-primary)",borderRadius:8,display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",marginBottom:14}}>
            <span style={{fontSize:11,fontWeight:500,color:"var(--color-text-primary)"}}>{pVenueData?.name}</span>
            <Badge variant={pSurface==="TURF"?"turf":"dirt"}>{SURFACE[pSurface]}</Badge>
            <Badge>{DISTANCE[pDistance]}</Badge>
            <Badge variant={pCourse==="RIGHT"?"right":"left"}>{COURSE[pCourse]}</Badge>
            <Badge>{TRACK_COND[pCond]}</Badge>
          </div>

          {/* Runner list header */}
          <div style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)",marginBottom:8}}>出走馬リスト</div>
          <div style={{display:"flex",gap:3,alignItems:"center",padding:"0 0 5px",borderBottom:"1px solid var(--color-border-tertiary)",marginBottom:2}}>
            <span style={{width:18,fontSize:8,color:"var(--color-text-tertiary)",textAlign:"center"}}>枠</span>
            <span style={{flex:2,fontSize:8,color:"var(--color-text-tertiary)"}}>馬名</span>
            <span style={{flex:1.3,fontSize:8,color:"var(--color-text-tertiary)"}}>父</span>
            <span style={{flex:1.3,fontSize:8,color:"var(--color-text-tertiary)"}}>母父</span>
            <span style={{flex:1.3,fontSize:8,color:"var(--color-text-tertiary)"}}>母</span>
            <span style={{flex:1.2,fontSize:8,color:"var(--color-text-tertiary)"}}>騎手</span>
            <span style={{width:36,fontSize:8,color:"var(--color-text-tertiary)"}}>齢</span>
            <span style={{width:20}}/>
          </div>
          {runners.map((r,i)=>(
            <RunnerRow key={i} runner={r} index={i}
              onChange={(f,v)=>updateRunner(i,f,v)}
              onRemove={()=>removeRunner(i)}
              matchedSire={!!findStallion(r.sire)}
              matchedBms={!!findStallion(r.bms)}
              matchedDam={!!broodmares.find(m=>m.name===r.dam)}/>
          ))}
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <button onClick={addRunner} disabled={runners.length>=18}
              style={{padding:"6px 14px",borderRadius:8,border:"1px solid var(--color-border-tertiary)",background:"var(--color-background-primary)",color:runners.length>=18?"var(--color-text-tertiary)":"var(--color-text-secondary)",fontSize:11,cursor:runners.length>=18?"default":"pointer"}}>
              + 馬を追加 ({runners.length}/18)
            </button>
            <button onClick={calcPredictions}
              style={{padding:"6px 20px",borderRadius:8,border:"none",background:"#1e5fa8",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",marginLeft:"auto"}}>
              🏇 血統診断を実行
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {results&&(
        <div>
          <div style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)",marginBottom:4}}>血統診断結果</div>
          <div style={{fontSize:10,color:"var(--color-text-tertiary)",marginBottom:12}}>
            {pVenueData?.name} {SURFACE[pSurface]} {DISTANCE[pDistance]} / {TRACK_COND[pCond]} — {results.length}頭を診断
          </div>

          {/* Top pick summary */}
          {results.length>=3&&(
            <div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:14,marginBottom:16}}>
              <div style={{fontSize:12,fontWeight:500,color:"var(--color-text-primary)",marginBottom:10}}>血統的注目馬</div>
              <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:10}}>
                {results.slice(0,3).map((e,i)=>{
                  const marks=["◎","○","▲"];
                  const cols=["#1e5fa8","#3578c4","#4a90d9"];
                  return(
                    <div key={i} style={{flex:1,minWidth:120,background:"var(--color-background-primary)",borderRadius:10,padding:"10px 12px",border:`2px solid ${cols[i]}`}}>
                      <div style={{fontSize:18,fontWeight:700,color:cols[i],marginBottom:2}}>{marks[i]} {e.runner.name||"(未入力)"}</div>
                      <div style={{fontSize:22,fontWeight:700,color:cols[i]}}>{e.score}<span style={{fontSize:11,fontWeight:400,color:"var(--color-text-tertiary)"}}> pts</span></div>
                      <div style={{fontSize:9,color:"var(--color-text-secondary)",marginTop:3}}>
                        {e.strengths.slice(0,2).join(" / ")||"—"}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Radar comparison */}
              <div style={{display:"flex",justifyContent:"center"}}>
                <MiniRadar entries={results} labels={["馬場","距離","コース","馬場状態","成長"]}/>
              </div>
              <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:4}}>
                {results.slice(0,4).map((e,i)=>{
                  const cols=["#1e5fa8","#3578c4","#d4941a","#4a90d9"];
                  return <span key={i} style={{fontSize:9,color:cols[i],fontWeight:500}}>{`● ${e.runner.name||"—"}`}</span>;
                })}
              </div>
            </div>
          )}

          {/* Full ranking */}
          <div style={{display:"flex",flexDirection:"column"}}>
            {results.map((e,i)=>(
              <PredictionCard key={i} entry={e} rank={i+1} venueKey={pVenue}
                expanded={expandedId===i} onToggle={()=>setExpandedId(expandedId===i?null:i)}/>
            ))}
          </div>

          {/* Disclaimer */}
          <div style={{marginTop:12,padding:"8px 12px",background:"var(--color-background-secondary)",borderRadius:8,fontSize:10,color:"var(--color-text-tertiary)",lineHeight:1.6}}>
            ※ この診断は血統データベースに基づく適性評価です。実際のレース結果は馬の能力・調教状態・騎手・展開など多くの要素に左右されます。投票の最終判断はご自身の責任でお願いします。
          </div>
        </div>
      )}
    </div>
  );
};

/* ================================================================
   ===== GRADE RACE DATA & PAGES =====
   ================================================================ */
const GRADE_RACES = {
  ouka2026: {
    id:"ouka2026", name:"第86回 桜花賞", grade:"G1", date:"2026/4/12", venue:"阪神", course:"芝1600m（外）",
    weather:"晴", trackCond:"良", emoji:"🌸",
    trends: {
      popularity:[
        {label:"1番人気",val:"【1.4.1.4】複勝率60%"},
        {label:"2番人気",val:"【5.2.0.3】複勝率70%",hl:true},
        {label:"3番人気",val:"【3.3.2.2】複勝率80%",hl:true},
        {label:"4-5番人気",val:"【0.0.1.9】複勝率10%"},
        {label:"6-9番人気",val:"【1.1.6.32】複勝率20%"},
        {label:"10番人気以下",val:"【0.0.0.88】好走ゼロ"},
      ],
      popTip:"2番人気が最多5勝。3番人気以内が全滅した年はゼロ。",
      draw:[{label:"1-2枠",val:"連対は2番人気以内のG1馬のみ"},{label:"3-6枠",val:"勝ち馬集中ゾーン",hl:true},{label:"7枠",val:"複勝率17%"},{label:"8枠",val:"過去10年勝ちなし"}],
      drawTip:"3-6枠が狙い目。8枠は厳しい。",
      style:[{label:"逃げ",val:"複勝率20%"},{label:"先行",val:"複勝率21%"},{label:"差し",val:"複勝率22%",hl:true},{label:"追込",val:"複勝率11%"},{label:"上がり3F上位",val:"複勝率51%",hl:true}],
      styleTip:"差し・追込優勢。上がり上位は半数以上が馬券圏内。",
      bloodTip:"キングカメハメハ系が圧倒的。ロードカナロア産駒、ドゥラメンテ産駒が活躍。",
      roteTip:"阪神JF直行×2番人気以内は連対率100%。前走1600m＋3着以内が必須条件。",
    },
    result:null,review:null,verification:null,
  },
  // === 2026 G1 Calendar (追加はここにオブジェクトを足すだけ) ===
  satsuki2026:{id:"satsuki2026",grade:"G1",name:"第86回 皐月賞",date:"2026/4/19",venue:"中山",course:"芝2000m",weather:"晴",trackCond:"良",emoji:"🏇",
    trends:{
      popularity:[
        {label:"1番人気",val:"【2.3.1.4】複勝率60%（過去5年勝ちなし）"},
        {label:"2番人気",val:"【3.1.1.5】複勝率50%",hl:true},
        {label:"3番人気",val:"【1.3.2.4】複勝率60%",hl:true},
        {label:"4-5番人気",val:"【2.1.2.15】複勝率25%"},
        {label:"6-9番人気",val:"【2.2.3.33】複勝率18%（中穴狙い目）",hl:true},
        {label:"10番人気以下",val:"【0.0.1.84】好走ほぼゼロ"},
      ],
      popTip:"1番人気は過去5年勝ちなし。勝ち馬は2〜6番人気に集中。6〜9番人気の中穴が驚異的な回収率。",
      draw:[
        {label:"1枠",val:"【2.0.0.18】勝率10%"},
        {label:"2-3枠",val:"【0.1.3.36】勝ちなし"},
        {label:"4枠",val:"【2.3.2.13】複勝率35%",hl:true},
        {label:"5枠",val:"【0.1.2.17】やや不振"},
        {label:"6枠",val:"【3.1.2.14】複勝率30%",hl:true},
        {label:"7枠",val:"【2.3.0.23】連対率18%",hl:true},
        {label:"8枠",val:"【1.1.1.24】複勝率11%"},
      ],
      drawTip:"枠順の有利不利はフラット。4枠・6枠・7枠が好成績。内枠有利のイメージに反して外枠でも好走可能。ただし外枠は先行力が必要。",
      style:[
        {label:"逃げ",val:"【0.1.0.12】複勝率8%"},
        {label:"先行",val:"【4.5.3.24】複勝率33%",hl:true},
        {label:"差し",val:"【5.3.5.57】複勝率19%",hl:true},
        {label:"追込",val:"【1.1.2.49】複勝率8%"},
      ],
      styleTip:"先行・中団が有利。追込は重馬場の2023年ソールオリエンスのみ勝利。良馬場なら中団より前が必須。前走で先行していた馬が7勝。上がり3F5位以内が全10勝を独占。",
      bloodTip:"キタサンブラック、ロードカナロア、キズナ、リオンディーズなど日本の主流血統が好成績。ディープインパクト直仔はもういないが、ディープ後継（キズナ、ワールドプレミア、フィエールマン等）に注目。中山の急坂をこなすパワーが求められる。",
      roteTip:"共同通信杯組が6勝と最多。弥生賞組は複勝率21%だが勝ちは1回のみ。ホープフルS組は無敗馬なら連対率高い。前走6着以下は過去10年勝ちなし。前走0.6秒以上負けは3着以内ゼロ。前走460kg以上が好走の必須条件。",
    },
    runners:null,result:null,review:null,verification:null},
  tennoshoS2026:{id:"tennoshoS2026",grade:"G1",name:"第173回 天皇賞（春）",date:"2026/5/3",venue:"京都",course:"芝3200m",weather:"",trackCond:"",emoji:"👑",trends:null,result:null,review:null},
  nhkmile2026:{id:"nhkmile2026",grade:"G1",name:"第29回 NHKマイルC",date:"2026/5/10",venue:"東京",course:"芝1600m",weather:"",trackCond:"",emoji:"🎯",trends:null,result:null,review:null},
  victoria2026:{id:"victoria2026",grade:"G1",name:"第21回 ヴィクトリアマイル",date:"2026/5/17",venue:"東京",course:"芝1600m",weather:"",trackCond:"",emoji:"🌺",trends:null,result:null,review:null},
  oaks2026:{id:"oaks2026",grade:"G1",name:"第87回 優駿牝馬（オークス）",date:"2026/5/24",venue:"東京",course:"芝2400m",weather:"",trackCond:"",emoji:"🌹",trends:null,result:null,review:null},
  derby2026:{id:"derby2026",grade:"G1",name:"第93回 東京優駿（日本ダービー）",date:"2026/5/31",venue:"東京",course:"芝2400m",weather:"",trackCond:"",emoji:"🏆",trends:null,result:null,review:null},
  yasuda2026:{id:"yasuda2026",grade:"G1",name:"第76回 安田記念",date:"2026/6/7",venue:"東京",course:"芝1600m",weather:"",trackCond:"",emoji:"⚡",trends:null,result:null,review:null},
  takarazuka2026:{id:"takarazuka2026",grade:"G1",name:"第67回 宝塚記念",date:"2026/6/14",venue:"阪神",course:"芝2200m",weather:"",trackCond:"",emoji:"🌟",trends:null,result:null,review:null},
  shirasagiS2026:{id:"shirasagiS2026",grade:"G3",name:"第2回 しらさぎステークス",date:"2026/6/21",venue:"阪神",course:"芝1600m",weather:"",trackCond:"",emoji:"🦢",trends:null,result:null,review:null},
  fuchuFillies2026:{id:"fuchuFillies2026",grade:"G3",name:"第74回 府中牝馬ステークス",date:"2026/6/21",venue:"東京",course:"芝1800m",weather:"",trackCond:"",emoji:"🌸",trends:null,result:null,review:null},
  sprinters2026:{id:"sprinters2026",grade:"G1",name:"第60回 スプリンターズS",date:"2026/10/4",venue:"中山",course:"芝1200m",weather:"",trackCond:"",emoji:"💨",trends:null,result:null,review:null},
  shuka2026:{id:"shuka2026",grade:"G1",name:"第29回 秋華賞",date:"2026/10/18",venue:"京都",course:"芝2000m",weather:"",trackCond:"",emoji:"🍂",trends:null,result:null,review:null},
  kikka2026:{id:"kikka2026",grade:"G1",name:"第87回 菊花賞",date:"2026/10/25",venue:"京都",course:"芝3000m",weather:"",trackCond:"",emoji:"🌻",trends:null,result:null,review:null},
  tennoshoA2026:{id:"tennoshoA2026",grade:"G1",name:"第174回 天皇賞（秋）",date:"2026/11/1",venue:"東京",course:"芝2000m",weather:"",trackCond:"",emoji:"👑",trends:null,result:null,review:null},
  elizabethQC2026:{id:"elizabethQC2026",grade:"G1",name:"第51回 エリザベス女王杯",date:"2026/11/15",venue:"京都",course:"芝2200m",weather:"",trackCond:"",emoji:"💎",trends:null,result:null,review:null},
  mileCS2026:{id:"mileCS2026",grade:"G1",name:"第43回 マイルCS",date:"2026/11/22",venue:"京都",course:"芝1600m",weather:"",trackCond:"",emoji:"🎯",trends:null,result:null,review:null},
  japanCup2026:{id:"japanCup2026",grade:"G1",name:"第46回 ジャパンカップ",date:"2026/11/29",venue:"東京",course:"芝2400m",weather:"",trackCond:"",emoji:"🌍",trends:null,result:null,review:null},
  championsCup2026:{id:"championsCup2026",grade:"G1",name:"第23回 チャンピオンズC",date:"2026/12/6",venue:"中京",course:"ダ1800m",weather:"",trackCond:"",emoji:"🔥",trends:null,result:null,review:null},
  hanshinJF2026:{id:"hanshinJF2026",grade:"G1",name:"第78回 阪神JF",date:"2026/12/13",venue:"阪神",course:"芝1600m",weather:"",trackCond:"",emoji:"🌸",trends:null,result:null,review:null},
  asahiFS2026:{id:"asahiFS2026",grade:"G1",name:"第78回 朝日杯FS",date:"2026/12/20",venue:"阪神",course:"芝1600m",weather:"",trackCond:"",emoji:"⭐",trends:null,result:null,review:null},
  arima2026:{id:"arima2026",grade:"G1",name:"第71回 有馬記念",date:"2026/12/27",venue:"中山",course:"芝2500m",weather:"",trackCond:"",emoji:"🎄",trends:null,result:null,review:null},
  hopeful2026:{id:"hopeful2026",grade:"G1",name:"第10回 ホープフルS",date:"2026/12/28",venue:"中山",course:"芝2000m",weather:"",trackCond:"",emoji:"🌅",trends:null,result:null,review:null},
  // === G2 ===
  aobaSho2026:{id:"aobaSho2026",grade:"G2",name:"第33回 テレビ東京杯青葉賞",date:"2026/4/25",venue:"東京",course:"芝2400m",weather:"",trackCond:"",emoji:"🌿",
    trends:{
      popularity:[
        {label:"1番人気",val:"【5.3.2.5】複勝率67%",hl:true},
        {label:"2番人気",val:"【3.4.2.6】複勝率60%",hl:true},
        {label:"3番人気",val:"【2.2.3.8】複勝率47%"},
        {label:"4-5番人気",val:"【3.2.2.18】複勝率28%"},
        {label:"6-9番人気",val:"【2.3.4.31】複勝率23%"},
        {label:"10番人気以下",val:"【1.1.2.47】複勝率8%"},
      ],
      popularityTip:"上位人気が堅い。1〜2番人気の複勝率60%以上。東京2400mは能力通りに決まりやすい。",
      draw:[
        {label:"1-2枠",val:"【3.2.2.15】複勝率32%"},
        {label:"3-4枠",val:"【4.3.3.14】複勝率42%",hl:true},
        {label:"5-6枠",val:"【4.4.3.17】複勝率39%",hl:true},
        {label:"7-8枠",val:"【2.4.5.30】複勝率27%"},
      ],
      drawTip:"内〜中枠が有利。東京2400mは序盤のポジション取りが重要で、外枠は距離ロスが生じやすい。",
      style:[
        {label:"逃げ",val:"【2.1.2.10】複勝率33%"},
        {label:"先行",val:"【5.4.4.20】複勝率39%",hl:true},
        {label:"差し",val:"【6.7.5.28】複勝率39%",hl:true},
        {label:"追込",val:"【1.2.2.30】複勝率14%"},
      ],
      styleTip:"先行・差しが中心。東京2400mは直線が長く差しも届くが、スタミナ切れも多い。先行勢の残り方に注目。",
      bloodTip:"ディープインパクト系・キタサンブラック産駒が強い。スタミナと瞬発力を兼備する中長距離型種牡馬が有利。コントレイル産駒は初年度から活躍。",
      roteTip:"前走1勝クラス・2勝クラス勝ち馬が中心。前走2400m経験馬は距離慣れで有利。重賞経験馬は実力上位。",
    },
    runners:null,result:null,review:null,verification:null},
  milersCup2026:{id:"milersCup2026",grade:"G2",name:"第57回 読売マイラーズカップ",date:"2026/4/26",venue:"京都",course:"芝1600m",weather:"",trackCond:"",emoji:"🌸",
    trends:{
      popularity:[
        {label:"1番人気",val:"【4.3.2.6】複勝率60%",hl:true},
        {label:"2番人気",val:"【3.2.2.8】複勝率47%",hl:true},
        {label:"3番人気",val:"【2.3.2.8】複勝率47%"},
        {label:"4-5番人気",val:"【3.2.2.18】複勝率28%"},
        {label:"6-9番人気",val:"【2.3.4.31】複勝率23%"},
        {label:"10番人気以下",val:"【1.1.2.47】複勝率8%"},
      ],
      popularityTip:"上位人気の信頼度が高い。1〜3番人気の複勝率は50%以上で堅い決着が多い。",
      draw:[
        {label:"1-2枠",val:"【3.2.2.15】複勝率32%"},
        {label:"3-4枠",val:"【4.3.3.18】複勝率36%",hl:true},
        {label:"5-6枠",val:"【3.4.2.19】複勝率32%",hl:true},
        {label:"7-8枠",val:"【4.4.7.30】複勝率33%"},
      ],
      drawTip:"外枠不利はなく、全枠均等に好走。京都外回りマイルは先行力が重要。",
      style:[
        {label:"逃げ",val:"【2.1.1.8】複勝率33%"},
        {label:"先行",val:"【5.5.4.22】複勝率39%",hl:true},
        {label:"差し",val:"【5.6.7.30】複勝率38%",hl:true},
        {label:"追込",val:"【2.2.2.28】複勝率18%"},
      ],
      styleTip:"先行・差しが中心。京都外回りは直線が長く差しも届く。逃げ馬の粘り込みも警戒。",
      bloodTip:"ロードカナロア・ダイワメジャー・ディープインパクト系が強い。マイル実績のある種牡馬産駒を重視。",
      roteTip:"前走マイルCS・安田記念などG1組は基本的に有力。前走重賞で3着以内が理想。",
    },
    runners:null,result:null,review:null,verification:null},
  // === G3 ===
  antares2026:{id:"antares2026",grade:"G3",name:"第31回 アンタレスS",date:"2026/4/18",venue:"阪神",course:"ダ1800m",weather:"晴",trackCond:"良",emoji:"🏜️",
    trends:{
      popularity:[
        {label:"1番人気",val:"【3.2.1.4】複勝率60%"},
        {label:"2番人気",val:"【2.1.2.5】複勝率50%"},
        {label:"3番人気",val:"【1.2.2.5】複勝率50%",hl:true},
        {label:"4-5番人気",val:"【2.3.2.13】複勝率35%",hl:true},
        {label:"6-9番人気",val:"【2.2.3.33】複勝率18%"},
        {label:"10番人気以下",val:"【0.0.0.57】好走なし"},
      ],
      popTip:"上位人気の信頼度は標準的。4〜5番人気の複勝率が高く中穴狙いが有効。二桁人気は過去10年馬券圏外。",
      draw:[
        {label:"1-2枠",val:"やや不振。内枠が必ずしも有利でない"},
        {label:"3-5枠",val:"複勝率30%前後の好ゾーン",hl:true},
        {label:"6-7枠",val:"逃げ・先行なら問題なし",hl:true},
        {label:"8枠",val:"外枠でも先行力があれば好走可"},
      ],
      drawTip:"阪神ダート1800mは枠順より先行力が重要。外枠でも積極的に位置を取れる馬が有利。",
      style:[
        {label:"逃げ",val:"【2.1.0.10】複勝率23%"},
        {label:"先行",val:"【5.6.5.28】複勝率36%",hl:true},
        {label:"差し",val:"【3.3.5.32】複勝率26%",hl:true},
        {label:"追込",val:"【0.0.0.37】複勝率0%"},
      ],
      styleTip:"先行・差しが中心。追込は決まりにくいコース形態。4コーナーで好位につけられる馬を重視。",
      bloodTip:"ヘニーヒューズ、ホッコータルマエ等のダート系種牡馬が活躍。キングカメハメハ系（ホッコータルマエ等）も好相性。父または母父がダート色の強い血統を優先。",
      roteTip:"前走チャンピオンズC・フェブラリーS等G1組は基本的に有力。前走重賞で3着以内が理想。前走着差0.5秒以内の馬が好走。地方競馬からの転入馬は割引き。",
    },
    runners:null,result:null,review:null,verification:null,
  },
};

const GradeRacePage=({raceId,stallions=[],reviews={}})=>{
  const raceBase=GRADE_RACES[raceId];
  if(!raceBase) return <div style={{textAlign:"center",padding:32,color:"var(--color-text-tertiary)"}}>レースデータが見つかりません</div>;
  // Merge review data from JSON if available
  const reviewData=reviews[raceId]||{};
  const race={...raceBase,...reviewData};
  const hasResult=!!race.result;
  const hasVerify=!!race.verification;
  const hasRunners=!!race.runners&&race.runners.length>0;
  // section初期値はreviewsロード後に更新されるようuseEffectで制御
  const [section,setSection]=useState(hasResult?"review":hasRunners?"runners":"overview");
  useEffect(()=>{
    if(hasResult) setSection("review");
    else if(hasRunners) setSection("runners");
    else setSection("overview");
  },[raceId,hasResult,hasRunners]);
  const [bloodResults,setBloodResults]=useState(null);
  const [selectedCond,setSelectedCond]=useState(null);
  const [diagView,setDiagView]=useState("list"); // "list" or "diag"
  // sectionsはhasResult/hasVerifyが変わるたびに再計算
  // レース前: 出走馬・傾向・脚質を強調 / レース後: 結果・回顧・検証を強調
  const sections=useMemo(()=>[
    ...(hasResult?[
      {id:"review",  label:"回顧", accent:"#1e5fa8", phase:"post"},
      {id:"result",  label:"結果", accent:"#3578c4", phase:"post"},
    ]:[]),
    ...(hasVerify?[
      {id:"verify",  label:"検証", accent:"#d4941a", phase:"post"},
    ]:[]),
    ...(hasRunners?[
      {id:"runners", label:"出走馬", accent:"#1e5fa8", phase:"pre"},
    ]:[]),
    {id:"overview", label:"傾向",  accent:"#3578c4", phase:"pre"},
    {id:"track",   label:"馬場",  accent:"#d4941a", phase:"pre"},
    {id:"draw",     label:"枠順"},
    {id:"style",    label:"脚質",  accent:"#4a90d9", phase:"pre"},
    {id:"blood",    label:"血統"},
    {id:"rotation", label:"ローテ"},
    {id:"sim",      label:"シミュ", accent:"#c8a84b", phase:"pre"},
  ],[hasResult,hasVerify,hasRunners]);
  const DataRow=({label,value,highlight})=>(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:"1px solid var(--color-border-tertiary)"}}>
      <span style={{fontSize:11,color:"var(--color-text-secondary)"}}>{label}</span>
      <span style={{fontSize:11,fontWeight:highlight?600:400,color:highlight?"#1e5fa8":"var(--color-text-primary)"}}>{value}</span>
    </div>
  );
  const t=race.trends, r=race.result, rv=race.review;
  return(
    <div style={{background:"var(--color-background-primary)",border:"1px solid var(--color-border-tertiary)",borderRadius:12,padding:16,marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
        <span style={{fontSize:20}}>{race.emoji}</span>
        <div>
          <div style={{fontSize:15,fontWeight:600,color:"var(--color-text-primary)"}}>{race.name}</div>
          <div style={{fontSize:10,color:"var(--color-text-tertiary)"}}>{race.date} {race.venue} {race.course} / {race.weather}・{race.trackCond}</div>
        </div>
      </div>
      {hasResult&&<div style={{fontSize:11,color:"#1e5fa8",fontWeight:600,marginBottom:10,padding:"6px 10px",background:"#f0f6fd",borderRadius:8,borderLeft:"3px solid #1e5fa8"}}>✅ レース終了 — タイム {r.time}</div>}
      {/* レース前バナー */}
      {!hasResult&&hasRunners&&<div style={{fontSize:11,color:"#d4941a",fontWeight:600,marginBottom:10,padding:"6px 10px",background:"#fff9ee",borderRadius:8,borderLeft:"3px solid #d4941a"}}>🏇 レース前 — 出走馬・傾向・脚質をチェック</div>}
      <div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:14}}>
        {sections.map(s=>{
          const isActive=section===s.id;
          const isEmphasis=hasResult?(s.phase==="post"):(!hasResult&&s.phase==="pre");
          return(
            <button key={s.id} onClick={()=>setSection(s.id)} style={{
              padding:"5px 11px",borderRadius:16,cursor:"pointer",fontSize:10,
              fontWeight:isActive||isEmphasis?700:500,
              border:isActive?"none":isEmphasis?`1.5px solid ${s.accent||"#ccdcee"}`:"1px solid var(--color-border-tertiary)",
              background:isActive?(s.accent||"#1e5fa8"):"transparent",
              color:isActive?"#fff":isEmphasis?(s.accent||"#1e5fa8"):"#7a9ab8",
            }}>{s.label}</button>
          );
        })}
      </div>
      {/* REVIEW */}
      {section==="review"&&rv&&(<div>
        <div style={{fontSize:11,color:"var(--color-text-secondary)",lineHeight:1.8,marginBottom:12}}>{rv.summary}</div>
        <div style={{background:"var(--color-background-secondary)",borderRadius:10,padding:"10px 12px",marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-primary)",marginBottom:4}}>🏇 レース展開</div>
          <div style={{fontSize:10,color:"var(--color-text-secondary)",lineHeight:1.7}}>{rv.展開}</div>
        </div>
        {rv.jockeyComment&&(
          <div style={{background:"#f0f6fd",borderRadius:10,padding:"10px 12px",marginBottom:12,borderLeft:"3px solid #D85A30"}}>
            <div style={{fontSize:10,fontWeight:500,color:"#d4941a",marginBottom:3}}>🎤 勝利騎手コメント</div>
            <div style={{fontSize:10,color:"var(--color-text-secondary)",lineHeight:1.7,fontStyle:"italic"}}>{rv.jockeyComment}</div>
          </div>
        )}
        <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-primary)",marginBottom:8}}>血統分析・振り返り</div>
        {rv.bloodAnalysis.map((a,i)=>(
          <div key={i} style={{background:"var(--color-background-secondary)",borderRadius:8,padding:"8px 10px",marginBottom:5}}>
            <div style={{fontSize:11,fontWeight:600,color:"var(--color-text-primary)",marginBottom:2}}>{a.icon} {a.t}</div>
            <div style={{fontSize:10,color:"var(--color-text-secondary)",lineHeight:1.6}}>{a.d}</div>
          </div>
        ))}
      </div>)}
      {/* RESULT */}
      {section==="result"&&r&&(<div>
        {r.topFinishers.map((f,i)=>{
          const c=i===0?"#1e5fa8":i===1?"#3578c4":i===2?"#4a90d9":"var(--color-text-secondary)";
          return(<div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"8px 0",borderBottom:"1px solid var(--color-border-tertiary)"}}>
            <div style={{width:26,height:26,borderRadius:8,background:c,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:12,flexShrink:0}}>{f.rank}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"baseline",gap:6}}><span style={{fontSize:13,fontWeight:600}}>{f.name}</span><span style={{fontSize:9,color:"var(--color-text-tertiary)"}}>{f.pop}人気</span><span style={{fontSize:9,padding:"1px 6px",borderRadius:8,background:"var(--color-background-secondary)",color:"var(--color-text-secondary)"}}>{f.jockey}</span></div>
              <div style={{fontSize:9,color:"var(--color-text-secondary)",marginTop:2}}>父:{f.sire} / 母父:{f.bms} / {f.style}{f.margin?` / ${f.margin}差`:""}</div>
              <div style={{fontSize:9,color:"var(--color-text-tertiary)",marginTop:1}}>{f.note}</div>
            </div>
          </div>);
        })}
        <div style={{fontSize:11,fontWeight:500,margin:"10px 0 4px"}}>全着順</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:2}}>
          {r.fullOrder.map(f=>(<div key={f.rank} style={{display:"flex",gap:4,alignItems:"center",padding:"2px 5px",background:f.rank<=3?"var(--color-background-secondary)":"transparent",borderRadius:4}}>
            <span style={{fontSize:10,fontWeight:f.rank<=3?600:400,color:f.rank<=3?"#1e5fa8":"var(--color-text-tertiary)",width:14}}>{f.rank}</span>
            <span style={{fontSize:9,color:"var(--color-text-primary)"}}>{f.name}</span>
            <span style={{fontSize:8,color:"var(--color-text-tertiary)",marginLeft:"auto"}}>{f.pop}人</span>
          </div>))}
        </div>
        <div style={{fontSize:11,fontWeight:500,margin:"10px 0 4px"}}>払戻金</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3}}>
          {Object.entries(r.payouts).map(([k,v])=>(<div key={k} style={{display:"flex",justifyContent:"space-between",padding:"3px 8px",background:"var(--color-background-secondary)",borderRadius:6}}>
            <span style={{fontSize:10,color:"var(--color-text-secondary)"}}>{({tansho:"単勝",fukusho:"複勝",umaren:"馬連",umatan:"馬単",sanrenpuku:"3連複",sanrentan:"3連単"})[k]}</span>
            <span style={{fontSize:10,fontWeight:500}}>{v}</span>
          </div>))}
        </div>
      </div>)}
      {/* VERIFY (検証) */}
      {section==="verify"&&race.verification&&(()=>{
        const v=race.verification;
        const s=v.summary;
        return(<div>
          <div style={{fontSize:11,color:"var(--color-text-secondary)",lineHeight:1.6,marginBottom:12}}>{v.intro}</div>
          {/* Accuracy summary */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:4,marginBottom:14}}>
            {[{l:"的中",v:s.hitCount,c:"#1e5fa8"},{l:"妥当",v:s.nearCount,c:"#3578c4"},{l:"過小評価",v:s.missCount,c:"#f0b840"},{l:"過大評価",v:s.overCount,c:"#A32D2D"}].map(d=>(
              <div key={d.l} style={{background:"var(--color-background-secondary)",borderRadius:8,padding:"8px",textAlign:"center"}}>
                <div style={{fontSize:20,fontWeight:700,color:d.c}}>{d.v}</div>
                <div style={{fontSize:9,color:"var(--color-text-tertiary)"}}>{d.l}</div>
              </div>
            ))}
          </div>
          <div style={{padding:"8px 10px",background:"var(--color-background-secondary)",borderRadius:8,marginBottom:14}}>
            <div style={{fontSize:10,color:"var(--color-text-secondary)",marginBottom:6}}>分析精度: <span style={{fontWeight:600,color:"var(--color-text-primary)"}}>{s.accuracy}</span></div>
            {/* Accuracy gauge bar */}
            <div style={{height:20,borderRadius:10,background:"#f0f6fd",overflow:"hidden",display:"flex"}}>
              {[{v:s.hitCount,c:"#1e5fa8",l:"的中"},{v:s.nearCount,c:"#3578c4",l:"妥当"},{v:s.missCount,c:"#f0b840",l:"過小"},{v:s.overCount,c:"#A32D2D",l:"過大"}].map((d,i)=>(
                d.v>0?<div key={i} style={{width:`${(d.v/s.total)*100}%`,height:"100%",background:d.c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#fff",fontWeight:600,minWidth:d.v>0?24:0}}>{d.v}</div>:null
              ))}
            </div>
            <div style={{display:"flex",gap:10,marginTop:4,justifyContent:"center"}}>
              {[{l:"的中",c:"#1e5fa8"},{l:"妥当",c:"#3578c4"},{l:"過小評価",c:"#f0b840"},{l:"過大評価",c:"#A32D2D"}].map((d,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:3}}>
                  <div style={{width:8,height:8,borderRadius:2,background:d.c}}/>
                  <span style={{fontSize:8,color:"var(--color-text-tertiary)"}}>{d.l}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Per-horse comparison */}
          <div style={{fontSize:12,fontWeight:500,color:"var(--color-text-primary)",marginBottom:8}}>馬別 予想 vs 実績</div>
          {v.runners.map((h,i)=>(
            <div key={i} style={{border:"1px solid var(--color-border-tertiary)",borderRadius:10,marginBottom:8,overflow:"hidden"}}>
              {/* Header */}
              <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"var(--color-background-secondary)"}}>
                <span style={{fontSize:16,fontWeight:700,color:h.vColor}}>{h.predMark}</span>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                    <span style={{fontSize:13,fontWeight:600,color:"var(--color-text-primary)"}}>{h.name}</span>
                    <span style={{fontSize:9,color:"var(--color-text-tertiary)"}}>馬番{h.num}</span>
                  </div>
                  <div style={{fontSize:9,color:"var(--color-text-secondary)"}}>父:{h.sire} / 母父:{h.bms} / 母:{h.dam}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <span style={{fontSize:10,padding:"2px 8px",borderRadius:10,background:h.vColor,color:"#fff",fontWeight:600}}>{h.verdict}</span>
                </div>
              </div>
              {/* Comparison */}
              <div style={{padding:"8px 12px"}}>
                {/* Visual gauge: prediction score */}
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                  <span style={{width:55,fontSize:9,color:"#3578c4",fontWeight:600,textAlign:"right"}}>予想スコア</span>
                  <div style={{flex:1,height:14,borderRadius:7,background:"#f0f6fd",overflow:"hidden",position:"relative"}}>
                    <div style={{width:`${Math.min(100,h.predScore/80*100)}%`,height:"100%",borderRadius:7,background:"linear-gradient(90deg, #3578c4, #4a90d9)",transition:"width 0.5s"}}/>
                    <span style={{position:"absolute",right:6,top:1,fontSize:9,fontWeight:600,color:"var(--color-text-primary)"}}>{h.predScore}</span>
                  </div>
                </div>
                {/* Visual gauge: actual result (18=worst, 1=best → invert to percentage) */}
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                  <span style={{width:55,fontSize:9,color:"#d4941a",fontWeight:600,textAlign:"right"}}>実着順</span>
                  <div style={{flex:1,height:14,borderRadius:7,background:"#f0f6fd",overflow:"hidden",position:"relative"}}>
                    <div style={{width:`${Math.max(5,(18-h.actualRank+1)/18*100)}%`,height:"100%",borderRadius:7,background:h.actualRank<=3?"linear-gradient(90deg, #1e5fa8, #3578c4)":h.actualRank<=6?"linear-gradient(90deg, #3578c4, #4a90d9)":"linear-gradient(90deg, #A32D2D, #F09595)",transition:"width 0.5s"}}/>
                    <span style={{position:"absolute",right:6,top:1,fontSize:9,fontWeight:600,color:"var(--color-text-primary)"}}>{h.actualRank}着</span>
                  </div>
                </div>
                {/* Verdict badge */}
                <div style={{display:"flex",justifyContent:"center",marginBottom:6}}>
                  <span style={{fontSize:10,padding:"3px 12px",borderRadius:12,background:h.vColor,color:"#fff",fontWeight:600}}>{h.verdict}</span>
                </div>
              </div>
              {/* Detail comparison */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>
                <div style={{padding:"8px 12px",borderRight:"1px solid var(--color-border-tertiary)",borderTop:"1px solid var(--color-border-tertiary)"}}>
                  <div style={{fontSize:9,fontWeight:600,color:"#3578c4",marginBottom:4}}>📊 血統分析の予想</div>
                  <div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:4}}>
                    <span style={{fontSize:18,fontWeight:700,color:"#3578c4"}}>{h.predMark}</span>
                    <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>スコア {h.predScore}</span>
                  </div>
                  <div style={{fontSize:9,color:"var(--color-text-secondary)",lineHeight:1.5}}>{h.predComment}</div>
                </div>
                <div style={{padding:"8px 12px",borderTop:"1px solid var(--color-border-tertiary)"}}>
                  <div style={{fontSize:9,fontWeight:600,color:"#d4941a",marginBottom:4}}>🏁 実際の結果</div>
                  <div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:4}}>
                    <span style={{fontSize:18,fontWeight:700,color:h.actualRank<=3?"#1e5fa8":h.actualRank<=6?"#3578c4":"var(--color-text-tertiary)"}}>{h.actualRank}着</span>
                    <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{h.actualPop}番人気</span>
                  </div>
                  <div style={{fontSize:9,color:"var(--color-text-secondary)",lineHeight:1.5}}>{h.actualComment}</div>
                </div>
              </div>
            </div>
          ))}
          {/* Lessons learned */}
          <div style={{fontSize:12,fontWeight:500,color:"var(--color-text-primary)",margin:"14px 0 8px"}}>📝 今後への教訓</div>
          {s.lessons.map((l,i)=>(
            <div key={i} style={{display:"flex",gap:8,padding:"6px 0",borderBottom:"1px solid var(--color-border-tertiary)"}}>
              <span style={{fontSize:12,color:"#d4941a",flexShrink:0}}>{i+1}.</span>
              <span style={{fontSize:10,color:"var(--color-text-secondary)",lineHeight:1.6}}>{l}</span>
            </div>
          ))}
        </div>);
      })()}
      {/* RUNNERS (出走馬 + 血統診断) */}
      {section==="runners"&&hasRunners&&(()=>{
        const venueMap={中山:"nakayama",東京:"tokyo",阪神:"hanshin",京都:"kyoto",中京:"chukyo",小倉:"kokura",新潟:"niigata",札幌:"sapporo",函館:"hakodate"};
        const distMap={"芝1200m":"SPRINT","芝1400m":"SPRINT","芝1600m":"MILE","芝1800m":"MILE","芝2000m":"MIDDLE","芝2200m":"MIDDLE","芝2400m":"MIDDLE","芝2500m":"LONG","芝3000m":"LONG","芝3200m":"LONG","ダ1200m":"SPRINT","ダ1400m":"SPRINT","ダ1600m":"MILE","ダ1800m":"MILE","ダ2000m":"MIDDLE","ダ2100m":"MIDDLE"};
        const surfMap=k=>k.startsWith("芝")?"TURF":"DIRT";
        const venueKey=venueMap[race.venue]||"tokyo";
        const vData=VENUES[venueKey]||{};
        const surf=surfMap(race.course);
        const dist=distMap[race.course]||"MIDDLE";

        const runAnalysis=(cond)=>{
          if(!stallions.length) return;
          setSelectedCond(cond);
          const raceConfig={surface:surf,distance:dist,course:vData.course||"RIGHT",trackCondition:cond,horseAge:"3"};
          const findS=n=>stallions.find(s=>s.name===n)||null;
          const scored=race.runners.map(runner=>{
            const ms=findS(runner.sire);
            const mb=findS(runner.bms);
            let rawScore=0,bonus=0,strengths=[],weaknesses=[];
            // ① 長距離レースでは母父の比重をアップ（父45%+母父30%）
            const distIdx=["SPRINT","MILE","MIDDLE","LONG"].indexOf(dist);
            const isLongDist=distIdx>=3; // LONGの場合
            const wSire=isLongDist?0.45:0.55;
            const wBms=isLongDist?0.30:0.20;
            if(ms){
              const sr=calcAptitude(ms,raceConfig);
              rawScore+=sr.score*wSire;bonus+=sr.bonus*wSire;
              if(ms.speedScore>=9) strengths.push("父のスピード◎");
              if(ms.staminaScore>=9) strengths.push("父のスタミナ◎");
              if(ms.powerScore>=9) strengths.push("父のパワー◎");
              if(ms.surface===surf) strengths.push("父の馬場適性○");
              else if(ms.surface!=="BOTH"&&ms.surface!==surf) weaknesses.push("父の馬場不適合");
              if(ms.heavyTrack>=7&&(cond==="HEAVY"||cond==="BAD")) strengths.push("重馬場巧者の血統");
              if(ms.heavyTrack<=3&&(cond==="HEAVY"||cond==="BAD")) weaknesses.push("父は重馬場苦手");
              if(ms.growth==="LATE") weaknesses.push("父は晩成型");
              if(ms.growth==="EARLY") strengths.push("仕上がり早い血統");
              const sMin=["SPRINT","MILE","MIDDLE","LONG"].indexOf(ms.distanceMin);
              const sMax=["SPRINT","MILE","MIDDLE","LONG"].indexOf(ms.distanceMax);
              const ri=["SPRINT","MILE","MIDDLE","LONG"].indexOf(dist);
              if(ri>=sMin&&ri<=sMax){
                const center=(sMin+sMax)/2;
                if(Math.abs(ri-center)<0.6) strengths.push("距離ど真ん中◎");
              } else { weaknesses.push("距離適性外"); }
            } else { rawScore+=35; weaknesses.push("父DB未登録"); }
            if(mb){
              const br=calcAptitude(mb,raceConfig);
              rawScore+=br.score*wBms;bonus+=br.bonus*wBms;
              if(mb.speedScore>=8) strengths.push("母父スピード○");
              if(mb.staminaScore>=8) strengths.push(isLongDist?"母父スタミナ◎（長距離+）":"母父スタミナ○");
              if(mb.powerScore>=8&&surf==="DIRT") strengths.push("母父パワー×ダート○");
            }
            const jvs=calcJockeyVenueScore(runner.jockey,venueKey);
            if(jvs.jockey){
              bonus+=jvs.score*0.5;
              if(jvs.score>=8) strengths.push("騎手×会場◎");
              if(jvs.score<=4) weaknesses.push("騎手×会場△");
            }
            // 距離適性外ペナルティ（父の距離レンジとレース距離の乖離）
            if(ms){
              const dOrder=["SPRINT","MILE","MIDDLE","LONG"];
              const sireMax=dOrder.indexOf(ms.distanceMax||"MIDDLE");
              const sireMin=dOrder.indexOf(ms.distanceMin||"MIDDLE");
              const raceIdx=dOrder.indexOf(dist);
              if(raceIdx>sireMax){
                const gap=raceIdx-sireMax;
                if(gap>=2){bonus-=15;weaknesses.push("父の距離適性大幅外（-15pt）");}
                else if(gap===1){bonus-=6;weaknesses.push("父の距離やや長い（-6pt）");}
              }
              if(raceIdx<sireMin){
                const gap=sireMin-raceIdx;
                if(gap>=2){bonus-=15;weaknesses.push("父の距離適性大幅外（-15pt）");}
                else if(gap===1){bonus-=6;weaknesses.push("父の距離やや短い（-6pt）");}
              }
            }
            // コース距離をメートルで取得（枠順補正・ペース補正で使用）
            const courseMeters=parseInt((race.course||"").replace(/[^0-9]/g,""))||0;
            // ② 前走着順トレンド補正（条件付きペナルティあり）
            let trendBonus=0;
            const prevRank=runner.prevRank||null;
            const prevRaceGrade=runner.prevRaceGrade||null; // "G1","G2","G3","OP","L"
            const prevRaceDist=runner.prevRaceDist||null;   // 例: 1400
            const prevRaceName=runner.prevRaceName||"";     // 例: "ファルコンS"
            if(prevRank!==null){
              if(prevRank===1){
                // 前走1着でも短距離重賞勝ちはペナルティ
                const shortGradeWin=prevRaceDist&&prevRaceDist<=1400&&(prevRaceGrade==="G2"||prevRaceGrade==="G3");
                const shortSprintWin=["NZT","ファルコンS","チャーチルダウンズC","フィリーズレビュー"].some(n=>prevRaceName.includes(n));
                if(shortSprintWin){trendBonus=-5;weaknesses.push("前走短距離重賞→距離延長×");}
                else if(shortGradeWin){trendBonus=-3;weaknesses.push("前走短距離重賞→適性疑問");}
                else{trendBonus=3;strengths.push("前走1着の勢い◎");}
              }
              else if(prevRank===2){trendBonus=2;strengths.push("前走2着好走");}
              else if(prevRank===3){trendBonus=1;strengths.push("前走3着好走");}
              else if(prevRank>=10){trendBonus=-3;weaknesses.push("前走大敗（10着以下）");}
            }
            bonus+=trendBonus;
            // ③ 枠順補正（レースJSONのframeBonusフィールドで個別設定、なければデフォルト）
            const frame=runner.frame||null;
            const isTokyo=race.venue==="東京";
            const isMile=courseMeters===1600;
            const frameCfg=race.frameBonus||null; // {inner:[1,4],-4}, {outer:[7,8],+5} 形式
            if(frame){
              if(frameCfg){
                // JSONで個別設定がある場合はそちらを優先
                if(frameCfg.innerRange&&frame>=frameCfg.innerRange[0]&&frame<=frameCfg.innerRange[1]){
                  bonus+=frameCfg.innerPts;
                  if(frameCfg.innerPts<0) weaknesses.push(`内枠${frameCfg.innerPts}pt（${race.name}傾向）`);
                  else strengths.push(`内枠+${frameCfg.innerPts}pt（${race.name}傾向）`);
                }
                if(frameCfg.outerRange&&frame>=frameCfg.outerRange[0]&&frame<=frameCfg.outerRange[1]){
                  bonus+=frameCfg.outerPts;
                  if(frameCfg.outerPts<0) weaknesses.push(`外枠${frameCfg.outerPts}pt（${race.name}傾向）`);
                  else strengths.push(`外枠+${frameCfg.outerPts}pt（${race.name}傾向）`);
                }
              } else if(isTokyo&&isMile){
                // デフォルト: 東京マイルのみ
                if(frame<=4){bonus-=4;weaknesses.push("内枠不利（東京マイル）");}
                else if(frame>=7){bonus+=5;strengths.push("外枠有利（東京マイル）");}
              }
            }
            // 重賞実績ボーナス（年数減衰＋タイム差減衰あり）
            let gradeBonus=0;
            const gw=runner.gradeWins||[];
            const currentYear=new Date().getFullYear();
            const dOrderGrade=["SPRINT","MILE","MIDDLE","LONG"];
            const raceDistCat=dist; // 現在のレース距離カテゴリ
            gw.forEach(w=>{
              // 年数減衰: 1年以内100% / 2年前70% / 3年以上40%
              const yearsAgo=currentYear-(w.year||currentYear);
              const decay=yearsAgo<=1?1.0:yearsAgo===2?0.7:0.4;
              // タイム差減衰
              const margin=w.margin!=null?w.margin:0;
              const marginDecay=w.place===1?1.0:margin<=0.5?1.0:margin<=1.0?0.7:0.4;
              // 距離乖離減衰: 実績距離と今走距離の差が大きいほど減衰
              let distDecay=1.0;
              if(w.dist){
                const winDistCat=w.dist<=1400?"SPRINT":w.dist<=1800?"MILE":w.dist<=2200?"MIDDLE":"LONG";
                const winIdx=dOrderGrade.indexOf(winDistCat);
                const raceIdx=dOrderGrade.indexOf(raceDistCat);
                const distGap=Math.abs(winIdx-raceIdx);
                if(distGap===1) distDecay=0.85;
                else if(distGap>=2) distDecay=0.5;
              }
              let base=0;
              if(w.grade==="G1"){
                if(w.place===1){base=12;strengths.push(yearsAgo<=1?"G1勝ち馬":"G1勝ち実績");}
                else if(w.place===2){base=7;strengths.push(margin<=0.5?"G1接戦2着":"G1連対実績");}
                else if(w.place===3){base=4;strengths.push(margin<=0.5?"G1接戦3着":"G1好走実績");}
                else if(w.place<=5){base=2;}
              } else if(w.grade==="G2"){
                if(w.place===1){base=6;strengths.push("G2勝ち馬");}
                else if(w.place<=2){base=3;strengths.push(margin<=0.5?"G2接戦2着":"G2連対実績");}
              } else if(w.grade==="G3"){
                if(w.place===1){base=3;strengths.push("G3勝ち馬");}
                else if(w.place<=2){base=2;}
              } else if(w.grade==="OP"||w.grade==="L"){
                if(w.place===1){base=w.grade==="OP"?2:1;strengths.push(w.grade==="OP"?"OP勝ち実績":"L勝ち実績");}
              }
              gradeBonus+=base*decay*marginDecay*distDecay;
            });
            bonus+=gradeBonus;
            // ⑥ 複数G1勝ちボーナス（二冠馬・三冠馬の評価）
            const g1WinCount=gw.filter(w=>w.grade==="G1"&&w.place===1).length;
            if(g1WinCount>=3){bonus+=8;strengths.push(`G1×${g1WinCount}勝！三冠級`);}
            else if(g1WinCount>=2){bonus+=5;strengths.push(`G1×${g1WinCount}勝（二冠級）`);}
            // ⑦ 連勝ボーナス（pastRanksから直近連勝数を計算）
            const ranks=runner.pastRanks||[];
            let winStreak=0;
            for(let ri=0;ri<ranks.length;ri++){if(ranks[ri]===1)winStreak++;else break;}
            if(winStreak>=4){bonus+=8;strengths.push(`${winStreak}連勝中！無敗`);}
            else if(winStreak>=3){bonus+=5;strengths.push(`${winStreak}連勝中◎`);}
            else if(winStreak>=2){bonus+=3;strengths.push(`${winStreak}連勝中`);}
            // ⑧ 前走G1で1着の特別ボーナス（直近のG1連勝は非常に価値が高い）
            if(prevRaceGrade==="G1"&&prevRank===1){bonus+=4;strengths.push("前走G1勝ち→直結◎");}
            // ペース適性補正（長距離3000m以上は±4pt、それ以外は±6pt）
            const isVeryLong=courseMeters>=3000;
            const paceRange=isVeryLong?4:6;
            const expectedPace=race.expectedPace||"BOTH";
            const runnerPace=runner.paceType||"BOTH";
            let paceBonus=0;
            if(expectedPace!=="BOTH"&&runnerPace!=="BOTH"){
              if(runnerPace===expectedPace){
                paceBonus=paceRange;
                strengths.push(expectedPace==="SLOW"?"スロー瞬発力◎":"ハイペース耐性◎");
              } else {
                // SLOW型×HIGH予想 or HIGH型×SLOW予想
                paceBonus=isVeryLong?-4:-5;
                weaknesses.push(expectedPace==="SLOW"?"スロー向き×（ハイペース型）":"ハイペース向き×（スロー型）");
              }
            }
            bonus+=paceBonus;

            // ⑤a コース×脚質ペナルティ（ダービー2026の教訓）
            // 安田記念2026の教訓: 良馬場時は逃げ・先行ペナルティを緩和（前残りリスク）
            const runnerStyle=runner.style||null;
            const isGoodTrack=(race.trackCond==="良"||!race.trackCond);
            const nigePenaltyScale=isGoodTrack?0.5:1.0; // 良馬場では逃げペナルティ半減
            // 東京2400m: 逃げ・追込は強いペナルティ
            if(isTokyo&&courseMeters===2400){
              if(runnerStyle==="逃げ"){
                const p=Math.round(10*nigePenaltyScale);
                bonus-=p;weaknesses.push(`東京2400m逃げ脚質×（-${p}pt${isGoodTrack?"・良馬場で緩和":""}）`);
              } else if(runnerStyle==="追込"){
                bonus-=5;weaknesses.push("東京2400m追込×（届かないパターン）");
              }
            }
            // 東京1600m（安田記念・NHKマイル）: 4角5番手以内が圧倒的有利
            if(isTokyo&&courseMeters===1600){
              if(runnerStyle==="逃げ"){const p=Math.round(4*nigePenaltyScale);bonus-=p;weaknesses.push(`東京1600m逃げ×（-${p}pt${isGoodTrack?"・良馬場で緩和":""}）`);}
              else if(runnerStyle==="先行"){bonus+=3;strengths.push("東京1600m先行○（4角5番手以内有利）");}
              else if(runnerStyle==="差し"){bonus+=2;strengths.push("東京1600m差し○");}
              else if(runnerStyle==="追込"){bonus-=3;weaknesses.push("東京1600m追込×（届きにくい）");}
            }
            // 中山2500m（有馬記念）: 内枠先行が有利、外枠差しは厳しい
            if(race.venue==="中山"&&courseMeters===2500){
              if(runnerStyle==="逃げ"||runnerStyle==="先行"){bonus+=2;strengths.push("中山2500m前々○");}
              else if(runnerStyle==="追込"){bonus-=3;weaknesses.push("中山2500m追込×");}
            }
            // 阪神2200m（宝塚記念）: 内回りでスタミナ型先行有利。昨年逃げ切りメイショウタバルの例も
            if(race.venue==="阪神"&&courseMeters===2200){
              if(runnerStyle==="先行"){bonus+=3;strengths.push("阪神2200m先行○（内回りで前有利）");}
              else if(runnerStyle==="逃げ"){bonus+=2;strengths.push("阪神2200m逃げ○（昨年逃げ切りの例）");}
              else if(runnerStyle==="追込"){bonus-=3;weaknesses.push("阪神2200m追込×（内回りで届きにくい）");}
            }

            // ⑤c リピーターボーナス（安田記念2026の教訓: ガイアフォースが2年連続2着）
            // 同レースでの過去好走実績（gradeWinsに同名レースがある場合）
            const raceBaseName=(race.race_name||race.name||"").replace(/第\d+回\s*/,"").replace(/（.*?）/,"");
            if(raceBaseName){
              const repeaterWin=gw.find(w=>w.race&&raceBaseName.includes(w.race.replace(/（.*?）/,"")));
              if(repeaterWin){
                if(repeaterWin.place===1){bonus+=6;strengths.push(`リピーター◎（${repeaterWin.year}年同レース1着）`);}
                else if(repeaterWin.place<=3){bonus+=4;strengths.push(`リピーター○（${repeaterWin.year}年同レース${repeaterWin.place}着）`);}
              }
            }

            // ⑤b ペース×脚質3次元評価（脚質specified時に追加加点）
            // 既存のpaceBonus（paceType基準）に加えて、明示的なstyle指定時はさらに精密評価
            if(runnerStyle&&expectedPace!=="BOTH"){
              if(expectedPace==="SLOW"){
                // スロー予想時: 先行有利、追込不利
                if(runnerStyle==="先行"){bonus+=3;strengths.push("スロー×先行◎（前残り想定）");}
                else if(runnerStyle==="逃げ"){bonus+=2;strengths.push("スロー×逃げ○");}
                else if(runnerStyle==="追込"){bonus-=3;weaknesses.push("スロー×追込×（届かない）");}
              } else if(expectedPace==="HIGH"){
                // ハイペース予想時: 差し・追込有利、逃げ不利
                if(runnerStyle==="追込"){bonus+=3;strengths.push("ハイペース×追込◎");}
                else if(runnerStyle==="差し"){bonus+=2;strengths.push("ハイペース×差し○");}
                else if(runnerStyle==="逃げ"){bonus-=4;weaknesses.push("ハイペース×逃げ×（垂れる）");}
              }
            }

            // ④ 上がり3F実績補正（lastF3フィールドがある場合）
            const lastF3=runner.lastF3||null; // 直近の上がり3Fタイム（秒）
            if(lastF3){
              if(lastF3<=33.0){bonus+=4;strengths.push(`上がり${lastF3}秒◎（瞬発力最上位）`);}
              else if(lastF3<=33.5){bonus+=3;strengths.push(`上がり${lastF3}秒○（高い末脚）`);}
              else if(lastF3<=34.0){bonus+=1;strengths.push(`上がり${lastF3}秒△（標準末脚）`);}
              else if(lastF3>=35.0){bonus-=2;weaknesses.push(`上がり${lastF3}秒×（末脚不足）`);}
            }

            // ⑤ 距離延長時の母父スタミナ加点（オークスの教訓）
            // 前走より400m以上長い場合、母父のstaminaScoreを加算
            if(prevRaceDist&&courseMeters&&courseMeters-prevRaceDist>=400&&mb){
              const staminaAdd=+(mb.staminaScore*0.4).toFixed(1);
              bonus+=staminaAdd;
              if(mb.staminaScore>=8) strengths.push(`距離延長×母父スタミナ◎(+${staminaAdd}pt)`);
              else if(mb.staminaScore>=6) strengths.push(`距離延長×母父スタミナ○(+${staminaAdd}pt)`);
            }
            // 前走より400m以上短い場合は距離短縮補正（母父スピード重視）
            if(prevRaceDist&&courseMeters&&prevRaceDist-courseMeters>=400&&mb){
              const speedAdd=+(mb.speedScore*0.2).toFixed(1);
              bonus+=speedAdd;
              if(mb.speedScore>=8) strengths.push(`距離短縮×母父スピード◎(+${speedAdd}pt)`);
            }

            const total=+(rawScore+bonus).toFixed(2);
            // Normalize: 実際のスコア分布(15〜70)に合わせて45〜95pt表示
            // 旧: (total-20)/35 → 50-85 だと上位が全員85で横並びになっていた
            // 新: 分母を55に拡大し、95到達にはtotal=70が必要（差別化強化）
            const normalizedPct=Math.max(0,Math.min(1,(total-15)/55));
            const displayScore=+(45+normalizedPct*50).toFixed(1); // 45.0-95.0

            // 3-gauge breakdown (each 0-100)
            // 期待度: overall blood aptitude (sire + bms combined)
            const gaugeExpect=Math.min(100,Math.max(0,Math.round((rawScore/45)*100)));
            // 馬場適性: how well sire fits this track condition
            let gaugeTrack=50;
            if(ms){
              const condLevel={"GOOD":0,"SLIGHTLY_HEAVY":1,"HEAVY":2,"BAD":3}[cond]||0;
              if(condLevel===0){
                gaugeTrack=Math.round((10-ms.heavyTrack)/9*100);
              } else if(condLevel===1){
                gaugeTrack=Math.round((1-Math.abs(ms.heavyTrack-5)/5)*100);
              } else {
                gaugeTrack=Math.round(ms.heavyTrack/10*100);
              }
              // Blend with surface match
              if(ms.surface===surf) gaugeTrack=Math.min(100,gaugeTrack+15);
              else if(ms.surface==="BOTH") gaugeTrack=Math.min(100,gaugeTrack+5);
              else gaugeTrack=Math.max(0,gaugeTrack-30);
            }
            // 騎手相性: jockey x venue score (0-10 → 0-100)
            const gaugeJockey=jvs.jockey?Math.round(jvs.score*10):50;

            return {...runner,rawScore:total,score:displayScore,mark:"",gaugeExpect,gaugeTrack,gaugeJockey,strengths:[...new Set(strengths)].slice(0,3),weaknesses:[...new Set(weaknesses)].slice(0,2),matchedSire:!!ms,matchedBms:!!mb,jvs};
          });
          scored.sort((a,b)=>b.rawScore-a.rawScore);
          // Assign marks by RANK (not score threshold) — guarantees ◎ always appears
          // Also handles ties: same score = same mark, but top is always ◎
          scored.forEach((r,i)=>{
            if(i===0) r.mark="◎";
            else if(i<=2) r.mark="○";
            else if(i<=5) r.mark="▲";
            else if(i<=10) r.mark="✖";
            else r.mark="⭐";
            // If same score as previous, give same mark (but first is always ◎)
            if(i>0&&r.score===scored[i-1].score&&i!==1) r.mark=scored[i-1].mark;
          });
          setBloodResults(scored);
        };
        return(<div>
          {/* 出馬表 / AI血統診断 切り替えタブ */}
          <div style={{display:"flex",marginBottom:12,background:"var(--color-background-secondary)",borderRadius:12,padding:3}}>
            <button onClick={()=>setDiagView("list")} style={{flex:1,padding:"10px 0",border:"none",borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:700,
              background:diagView==="list"?"var(--color-background-primary)":"transparent",
              color:diagView==="list"?"var(--color-text-primary)":"var(--color-text-tertiary)",
              boxShadow:diagView==="list"?"0 1px 4px rgba(0,0,0,0.1)":"none"}}>出馬表</button>
            <button onClick={()=>{setDiagView("diag");if(!bloodResults&&selectedCond)runAnalysis(selectedCond);else if(!bloodResults)runAnalysis("GOOD");}} style={{flex:1,padding:"10px 0",border:"none",borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:700,
              background:diagView==="diag"?"linear-gradient(135deg,#c8a84b,#a8873a)":"transparent",
              color:diagView==="diag"?"#0a0a0a":"var(--color-text-tertiary)",
              boxShadow:diagView==="diag"?"0 1px 4px rgba(200,168,75,0.3)":"none"}}>AI血統診断</button>
          </div>

          {/* === 出馬表ビュー === */}
          {diagView==="list"&&(<>
          <div style={{fontSize:12,fontWeight:500,color:"var(--color-text-primary)",marginBottom:8}}>出走馬一覧（{race.runners.length}頭）</div>
          {race.runners.map((r,i)=>{
            const sireMatch=stallions.some(s=>s.name===r.sire);
            const bmsMatch=stallions.some(s=>s.name===r.bms);
            return(
              <div key={i} style={{display:"flex",gap:8,alignItems:"center",padding:"6px 0",borderBottom:"1px solid var(--color-border-tertiary)"}}>
                <span style={{width:20,fontSize:11,fontWeight:500,color:"var(--color-text-tertiary)",textAlign:"center"}}>{r.num}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:12,fontWeight:600,color:"var(--color-text-primary)"}}>{r.name}</span>
                    <span style={{fontSize:9,padding:"1px 6px",borderRadius:8,background:"var(--color-background-secondary)",color:"var(--color-text-secondary)"}}>{r.jockey}</span>
                  </div>
                  <div style={{fontSize:9,color:"var(--color-text-secondary)",marginTop:2}}>
                    父:<span style={{color:sireMatch?"#1e5fa8":"inherit",fontWeight:sireMatch?500:400}}>{r.sire}{sireMatch?" ✓":""}</span>
                    {" / "}母父:<span style={{color:bmsMatch?"#3578c4":"inherit",fontWeight:bmsMatch?500:400}}>{r.bms}{bmsMatch?" ✓":""}</span>
                  </div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:3}}>
                    {r.style&&<span style={{fontSize:8,padding:"1px 6px",borderRadius:8,background:r.style==="逃げ"?"#FCEBEB":r.style==="先行"?"#EAF3DE":r.style==="差し"?"#E6F1FB":"#FBEAF0",color:r.style==="逃げ"?"#791F1F":r.style==="先行"?"#27500A":r.style==="差し"?"#0C447C":"#72243E",fontWeight:600}}>{r.style}</span>}
                    {r.age&&<span style={{fontSize:8,padding:"1px 6px",borderRadius:8,background:"var(--color-background-secondary)",color:"var(--color-text-tertiary)"}}>{r.age}歳{r.sex==="牝"?" 牝":""}</span>}
                    {(r.gradeWins||[]).filter(w=>w.place===1).slice(0,2).map((w,j)=><span key={j} style={{fontSize:8,padding:"1px 6px",borderRadius:8,background:w.grade==="G1"?"rgba(200,168,75,0.2)":"rgba(30,95,168,0.1)",color:w.grade==="G1"?"#c8a84b":"#1e5fa8",fontWeight:600}}>{w.race}</span>)}
                  </div>
                  {r.training&&(
                    <div style={{fontSize:8,color:"#c8a84b",marginTop:3,lineHeight:1.5}}>🏋️ {r.training.length>60?r.training.slice(0,60)+"…":r.training}</div>
                  )}
                </div>
              </div>
            );
          })}
          </>)}

          {/* === AI血統診断ビュー === */}
          {diagView==="diag"&&(<>
            <div style={{padding:"10px 14px",borderRadius:12,background:"linear-gradient(90deg,rgba(200,168,75,0.1),transparent)",border:"1px solid rgba(200,168,75,0.2)",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:16}}>✨</span>
              <span style={{fontSize:12,fontWeight:600,color:"var(--color-text-primary)"}}>AI診断結果</span>
              <span style={{fontSize:10,color:"var(--color-text-tertiary)"}}>・{race.venue}{race.course} / 馬場: {TRACK_COND[selectedCond]||"良"}</span>
            </div>
            {/* 馬場状態切り替え */}
            <div style={{display:"flex",gap:4,marginBottom:14}}>
              {Object.entries(TRACK_COND).map(([k,v])=>{
                const isSelected=selectedCond===k;
                return(
                  <button key={k} onClick={()=>runAnalysis(k)} style={{
                    flex:1,padding:"8px 0",borderRadius:8,cursor:"pointer",fontSize:11,fontWeight:600,
                    border:isSelected?"2px solid #c8a84b":"1px solid var(--color-border-tertiary)",
                    background:isSelected?"rgba(200,168,75,0.15)":"var(--color-background-secondary)",
                    color:isSelected?"#c8a84b":"var(--color-text-tertiary)",
                  }}>🏇 {v}</button>
                );
              })}
            </div>
          {bloodResults&&diagView==="diag"&&(
            <div style={{marginTop:0}}>
              {/* ダウンロードボタン */}
              <button onClick={()=>{
                const t=race;
                const rs=bloodResults.slice(0,7);
                const html=`<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>血統くん診断レポート - ${t.name}</title><style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Noto Serif JP',serif,sans-serif;font-size:10px;color:#111;background:#fff;padding:12px}
.header{border-top:3px solid #c8a84b;border-bottom:1px solid #111;padding:4px 0;display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:6px}
.header-title{font-size:18px;font-weight:700;letter-spacing:2px}
.header-sub{font-size:8px;color:#555;text-align:right;line-height:1.6}
.race-info{background:#f5f0e8;border:1px solid #c8a84b;padding:4px 8px;display:flex;gap:10px;align-items:center;margin-bottom:8px}
.grade-badge{background:#0a0a0a;color:#c8a84b;font-size:8px;font-weight:700;padding:2px 6px;white-space:nowrap}
.race-name{font-size:13px;font-weight:700}
.race-meta{font-size:8px;color:#555;line-height:1.8}
.sec{font-size:8px;font-weight:700;letter-spacing:2px;border-bottom:1px solid #111;padding-bottom:2px;margin:8px 0 4px;color:#555}
table{width:100%;border-collapse:collapse;margin-bottom:8px}
th{font-size:7px;text-align:center;border-bottom:1px solid #111;padding:2px;background:#f5f0e8;font-weight:700}
td{font-size:8px;text-align:center;padding:2px 3px;border-bottom:0.5px solid #ddd;vertical-align:middle}
tr:nth-child(even){background:#fafafa}
.bar-wrap{width:40px;height:5px;background:#e0e0e0;border-radius:2px;display:inline-block;vertical-align:middle}
.bar{height:5px;background:#c8a84b;border-radius:2px}
.three{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:8px}
.two{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px}
.tr{display:flex;justify-content:space-between;font-size:7px;padding:2px 0;border-bottom:0.5px solid #eee}
.hl{font-weight:700;color:#c8a84b}
.ng{color:#8b1a1a}
.rote{font-size:7px;padding:2px 0;border-bottom:0.5px solid #eee;line-height:1.6}
.rote-hl{background:#fff8e8;border-left:2px solid #c8a84b;padding-left:4px}
.tkt{border:1px solid #c8a84b;padding:5px 6px;background:#fffdf5;margin-bottom:4px}
.tkt-plan{font-size:8px;font-weight:700;margin-bottom:2px}
.tkt-nums{font-size:9px;font-weight:700;letter-spacing:1px}
.tkt-detail{font-size:7px;color:#555}
.footer{border-top:1px solid #111;margin-top:6px;padding-top:4px;display:flex;justify-content:space-between;font-size:7px;color:#888}
@media print{body{padding:0}button{display:none}}
</style></head><body>
<div class="header">
  <div><div class="header-title">血統くん</div><div style="font-size:7px;color:#888">BLOODLINE PREDICTOR · AI血統診断レポート</div></div>
  <div class="header-sub">${t.name}<br>${t.date} ${t.venue} ${t.course}<br>印刷日: ${new Date().toLocaleDateString('ja-JP')}</div>
</div>
<div class="race-info">
  <span class="grade-badge">${t.grade||'G1'}</span>
  <div class="race-name">${t.name}</div>
  <div class="race-meta">${t.venue} ${t.course}　馬場: ${t.trackCond||'良'}　出走: ${t.runners?.length||'-'}頭　予想ペース: ${t.expectedPace==='SLOW'?'スロー':t.expectedPace==='HIGH'?'ハイペース':'標準'}</div>
</div>
<div class="sec">◆ AI血統診断結果（馬場: ${t.trackCond||'良'}）</div>
<table>
<tr><th>順</th><th>印</th><th>馬番</th><th>馬名</th><th>父 / 母父</th><th>騎手</th><th>スコア</th><th>バー</th><th>強み・弱み</th></tr>
${rs.map((r,i)=>{
  const marks=['◎','○','▲','△','△','△','△'];
  const mk=marks[i]||'';
  const pct=Math.round(((r.score-50)/35)*100);
  const pos=r.strengths?.slice(0,2).map(s=>`<span style="color:#1a6b3a">✓${s}</span>`).join(' ')||'';
  const neg=r.weaknesses?.slice(0,1).map(s=>`<span style="color:#8b1a1a">✗${s}</span>`).join(' ')||'';
  return `<tr><td style="font-weight:700;font-size:${i===0?'13':'10'}px;color:${i===0?'#c8a84b':'#111'}">${i+1}</td><td><span style="border:1px solid ${i===0?'#c8a84b':'#111'};border-radius:50%;display:inline-block;width:14px;height:14px;font-size:7px;line-height:14px;text-align:center;background:${i===0?'#c8a84b':'transparent'};color:${i===0?'#fff':'#111'}">${mk}</span></td><td><b>${r.num}</b></td><td style="text-align:left;font-weight:${i<3?'700':'400'}">${r.name}</td><td style="text-align:left;font-size:7px">${r.sire||''}/${r.bms||''}</td><td style="font-size:7px">${r.jockey||''}</td><td><b>${r.score}</b></td><td><div class="bar-wrap"><div class="bar" style="width:${Math.max(5,pct)}%"></div></div></td><td style="text-align:left;font-size:6px;line-height:1.5">${pos}${neg}</td></tr>`;
}).join('')}
</table>
<div class="three">
<div>
<div class="sec">◆ レース傾向</div>
${(t.trends?.popularity||[]).slice(0,5).map(d=>`<div class="tr"><span>${d.label}</span><span class="${d.hl?'hl':''}">${d.val.slice(0,15)}</span></div>`).join('')}
<div style="margin-top:3px;font-size:7px;color:#555;background:#fff8e8;padding:3px;border-left:2px solid #c8a84b">${(t.trends?.popTip||'').slice(0,80)}...</div>
</div>
<div>
<div class="sec">◆ 前走ローテ</div>
${(t.trends?.rotation||[]).slice(0,4).map(d=>`<div class="rote ${d.hl?'rote-hl':''}"><b>${d.label}</b><br><span style="color:#555;font-size:6px">${d.val.slice(0,50)}...</span></div>`).join('')}
${t.trends?.rotationHorses?`<div style="margin-top:3px;font-size:6px;color:#c8a84b;font-weight:700">今年の注目馬:<br><span style="color:#555">${t.trends.rotationHorses[0]?.horses?.slice(0,60)||''}</span></div>`:''}
</div>
<div>
<div class="sec">◆ 馬券プラン</div>
${bloodResults.length>=3?`
<div class="tkt"><div class="tkt-plan">A — 堅実 馬連</div><div class="tkt-nums">◎${bloodResults[0].num} → ${bloodResults.slice(1,5).map(r=>r.num).join('-')}</div><div class="tkt-detail">馬連4点×500円=2,000円</div></div>
<div class="tkt"><div class="tkt-plan">B — 3連複BOX</div><div class="tkt-nums">${bloodResults.slice(0,5).map(r=>r.num).join('-')} BOX</div><div class="tkt-detail">3連複10点×200円=2,000円</div></div>
<div class="tkt"><div class="tkt-plan">C — 3連単</div><div class="tkt-nums">◎${bloodResults[0].num}→○${bloodResults[1].num}→▲${bloodResults[2].num}</div><div class="tkt-detail">3連単×300円=300円</div></div>`:''}
</div>
</div>
<div class="footer"><span>血統くん AI診断レポート｜https://spaceshoman.github.io/horsebloodline/</span><span>※本レポートは参考情報です。馬券購入は自己責任でお願いします。</span></div>
<script>window.onload=()=>{window.print()}</script>
</body></html>`;
                const w=window.open('','_blank');
                if(w){w.document.write(html);w.document.close();}
              }} style={{
                display:"flex",alignItems:"center",gap:6,width:"100%",padding:"10px 14px",
                background:"linear-gradient(135deg,#c8a84b,#a8873a)",border:"none",borderRadius:10,
                color:"#0a0a0a",fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:12,
                justifyContent:"center",letterSpacing:"1px",
              }}>
                📄 診断レポートをPDF保存
              </button>
              {bloodResults.map((r,i)=>{ if(i>=7) return null;
                const sc=r.mark==="◎"?"#d4941a":r.mark==="○"?"#1e5fa8":r.mark==="▲"?"#3578c4":r.mark==="✖"?"#4a90d9":"#7a9ab8";
                const mc=sc;
                return(
                  <div key={i} style={{background:"var(--color-background-secondary)",borderRadius:10,padding:"10px 12px",marginBottom:6}}>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <div style={{width:24,height:24,borderRadius:6,background:sc,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:11,flexShrink:0}}>{i+1}</div>
                      <span style={{fontSize:18,fontWeight:700,color:mc}}>{r.mark}</span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                          <span style={{fontSize:10,fontWeight:700,color:"var(--color-text-tertiary)",background:"var(--color-background-primary)",border:"1px solid var(--color-border-tertiary)",borderRadius:4,padding:"0px 5px",flexShrink:0}}>{r.num}</span>
                          <span style={{fontSize:13,fontWeight:600,color:"var(--color-text-primary)"}}>{r.name}</span>
                          <span style={{fontSize:9,color:"var(--color-text-tertiary)"}}>{r.jockey}</span>
                          {r.pop&&<span style={{fontSize:9,padding:"1px 5px",borderRadius:8,background:r.pop<=3?"#fff3e0":r.pop<=6?"#f0f6fd":"var(--color-background-primary)",color:r.pop<=3?"#d4941a":r.pop<=6?"#1e5fa8":"var(--color-text-tertiary)",fontWeight:600,border:`1px solid ${r.pop<=3?"#f0b840":r.pop<=6?"#c8e0f8":"var(--color-border-tertiary)"}`}}>{r.pop}人気</span>}
                          {r.tan&&(()=>{
                            // オッズvスコアの乖離判定
                            const scoreRank=i+1;
                            const popRank=r.pop||10;
                            const diff=popRank-scoreRank;
                            if(diff>=4) return <span style={{fontSize:8,padding:"2px 6px",borderRadius:8,background:"#e8f5e9",color:"#1b5e20",fontWeight:700}}>★穴候補</span>;
                            if(diff<=-4) return <span style={{fontSize:8,padding:"2px 6px",borderRadius:8,background:"#fdecea",color:"#c0392b",fontWeight:700}}>⚠人気先行</span>;
                            return null;
                          })()}
                        </div>
                        <div style={{fontSize:9,color:"var(--color-text-secondary)"}}>父:{r.sire} / 母父:{r.bms}</div>
                      </div>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <div style={{fontSize:20,fontWeight:700,color:sc}}>{r.score}</div>
                        {r.tan&&<div style={{fontSize:10,fontWeight:600,color:r.tan<10?"#c0392b":"var(--color-text-secondary)"}}>{r.tan}倍</div>}
                      </div>
                    </div>
                    {/* 3-gauge bars */}
                    <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:4}}>
                      {[
                        {label:"期待度",value:r.gaugeExpect,color:"#1e5fa8"},
                        {label:"馬場適性",value:r.gaugeTrack,color:"#3578c4"},
                        {label:"騎手相性",value:r.gaugeJockey,color:"#d4941a"},
                      ].map((g,gi)=>(
                        <div key={gi} style={{display:"flex",alignItems:"center",gap:6}}>
                          <span style={{width:48,fontSize:8,color:"var(--color-text-tertiary)",textAlign:"right",flexShrink:0}}>{g.label}</span>
                          <div style={{flex:1,height:10,borderRadius:5,background:"#f0f6fd",overflow:"hidden"}}>
                            <div style={{width:`${g.value}%`,height:"100%",borderRadius:5,background:`linear-gradient(90deg, ${g.color}66, ${g.color})`,transition:"width 0.5s"}}/>
                          </div>
                          <span style={{width:24,fontSize:9,fontWeight:600,color:g.value>=70?g.color:"var(--color-text-tertiary)",textAlign:"right"}}>{g.value}</span>
                        </div>
                      ))}
                    </div>
                    {/* Diagnosis reasons */}
                    <div style={{marginTop:6,display:"flex",gap:6,flexWrap:"wrap"}}>
                      {r.strengths.map((s,j)=><span key={"s"+j} style={{fontSize:8,padding:"2px 6px",borderRadius:6,background:"#f0f6fd",color:"#1e5fa8",fontWeight:500}}>✓ {s}</span>)}
                      {r.weaknesses.map((w,j)=><span key={"w"+j} style={{fontSize:8,padding:"2px 6px",borderRadius:6,background:"#FCEBEB",color:"#A32D2D",fontWeight:500}}>✗ {w}</span>)}
                    </div>
                    {r.jvs&&r.jvs.jockey&&(
                      <div style={{marginTop:4,fontSize:8,color:r.jvs.score>=7?"#1e5fa8":r.jvs.score>=5?"#3578c4":"#f0b840"}}>
                        🏇 騎手{r.jockey}×{race.venue}: {r.jvs.label} ({r.jvs.score}/10)
                      </div>
                    )}
                  </div>
                );
              })}
              {/* Betting suggestion */}
              {bloodResults.length>=3&&(()=>{
                const honmei=bloodResults[0];
                const taiko=bloodResults[1];
                const anaume=bloodResults[2];
                const top3=bloodResults.slice(0,3);
                const top5=bloodResults.slice(0,5);
                // 結果データから的中判定
                const resultData=race.result;
                const fin=resultData?.fullOrder||resultData?.topFinishers||null;
                const get=(rank)=>fin?fin.find(f=>f.rank===rank):null;
                const win=get(1), nd=get(2), rd=get(3);
                // 払戻データを数値化（"270円" → 270, "1,460円" → 1460）
                const parsePayout=(s)=>{
                  if(!s) return 0;
                  const m=String(s).match(/[\d,]+/g);
                  return m?parseInt(m[0].replace(/,/g,"")):0;
                };
                const p=resultData?.payouts||{};
                const tanPayout=parsePayout(p.tansho);
                const umarenPayout=parsePayout(p.umaren);
                const sanpukuPayout=parsePayout(p.sanrenpuku);
                // プラン定義
                const planTan={
                  num:honmei.num, name:honmei.name, tan:honmei.tan,
                  unit:1000, points:1, cost:1000,
                  hit:!!(win&&win.num===honmei.num),
                  payoutPer100:tanPayout
                };
                const umarenPairs=top3.slice(1).map(r=>[honmei.num,r.num].sort((a,b)=>a-b));
                const planUmaren={
                  pairs:umarenPairs, axis:honmei,
                  unit:500, points:umarenPairs.length, cost:500*umarenPairs.length,
                  hit:!!(win&&nd&&umarenPairs.some(pr=>{
                    const ws=[win.num,nd.num].sort((a,b)=>a-b);
                    return pr[0]===ws[0]&&pr[1]===ws[1];
                  })),
                  payoutPer100:umarenPayout
                };
                // 3連複: 1〜5位のBOX 10点
                const sanpukuCombos=[];
                for(let i=0;i<top5.length;i++)for(let j=i+1;j<top5.length;j++)for(let k=j+1;k<top5.length;k++){
                  sanpukuCombos.push([top5[i].num,top5[j].num,top5[k].num].sort((a,b)=>a-b));
                }
                const planSanpuku={
                  combos:sanpukuCombos, top5,
                  unit:200, points:sanpukuCombos.length, cost:200*sanpukuCombos.length,
                  hit:!!(win&&nd&&rd&&sanpukuCombos.some(c=>{
                    const ws=[win.num,nd.num,rd.num].sort((a,b)=>a-b);
                    return c[0]===ws[0]&&c[1]===ws[1]&&c[2]===ws[2];
                  })),
                  payoutPer100:sanpukuPayout
                };
                // 払戻計算
                const calcReturn=(plan,perPointPayout)=>{
                  if(!plan.hit) return 0;
                  return Math.floor(plan.unit/100)*perPointPayout;
                };
                const tanReturn=calcReturn(planTan, tanPayout);
                const umarenReturn=calcReturn(planUmaren, umarenPayout);
                const sanpukuReturn=calcReturn(planSanpuku, sanpukuPayout);
                const totalCost=planTan.cost+planUmaren.cost+planSanpuku.cost;
                const totalReturn=tanReturn+umarenReturn+sanpukuReturn;
                const recoveryRate=totalCost>0?Math.round(totalReturn/totalCost*100):0;
                const PlanRow=({plan,returnAmt,label,color,bg})=>(
                  <div style={{marginBottom:10,padding:"10px 12px",background:bg,borderLeft:`3px solid ${color}`,borderRadius:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <div style={{fontSize:12,fontWeight:700,color}}>{label}</div>
                      {resultData&&(
                        <span style={{fontSize:9,padding:"2px 8px",borderRadius:10,background:plan.hit?"#1e5fa8":"#777",color:"#fff",fontWeight:700}}>{plan.hit?"🎯 的中":"✗ 不的中"}</span>
                      )}
                    </div>
                    {plan.children}
                    <div style={{marginTop:4,display:"flex",justifyContent:"space-between",alignItems:"baseline",fontSize:11,fontWeight:600,color}}>
                      <span>{plan.points}点 × {plan.unit}円</span>
                      <span>= {plan.cost.toLocaleString()}円</span>
                    </div>
                    {resultData&&plan.hit&&(
                      <div style={{marginTop:4,padding:"4px 8px",background:"rgba(30,95,168,0.15)",borderRadius:4,display:"flex",justifyContent:"space-between",fontSize:10,color:"#1e5fa8",fontWeight:700}}>
                        <span>💰 払戻 ({plan.payoutPer100}円×{Math.floor(plan.unit/100)}口)</span>
                        <span>+{returnAmt.toLocaleString()}円</span>
                      </div>
                    )}
                  </div>
                );
                return(
                  <div style={{marginTop:16,background:"rgba(30,95,168,0.05)",border:"2px solid rgba(200,168,75,0.3)",borderRadius:12,padding:14}}>
                    <div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:17,fontWeight:400,color:"#c8a84b",letterSpacing:"2px",marginBottom:8}}>馬券プラン</div>
                    <div style={{fontSize:9,color:"rgba(200,168,75,0.6)",marginBottom:12}}>単勝・馬連・3連複の3点セット（合計{totalCost.toLocaleString()}円）</div>

                    {/* Plan 単勝 */}
                    {PlanRow({
                      plan:{...planTan,
                        children:<div style={{fontSize:10,color:"#1e5fa8",lineHeight:1.6}}>
                          <div>◎ <span style={{fontWeight:700}}>({honmei.num}){honmei.name}</span>{honmei.tan?` (${honmei.tan}倍)`:""}</div>
                          <div style={{fontSize:9,color:"rgba(30,95,168,0.7)"}}>血統スコア1位への単勝1点勝負</div>
                        </div>
                      },
                      returnAmt:tanReturn,
                      label:"① 単勝",
                      color:"#1e5fa8",
                      bg:"rgba(30,95,168,0.1)"
                    })}

                    {/* Plan 馬連 */}
                    {PlanRow({
                      plan:{...planUmaren,
                        children:<div style={{fontSize:10,color:"#d4941a",lineHeight:1.6}}>
                          <div>◎ <span style={{fontWeight:700}}>({honmei.num}){honmei.name}</span> ⇔ 2〜3位</div>
                          <div style={{fontSize:9,color:"rgba(212,148,26,0.7)"}}>相手: {top3.slice(1).map(r=>`(${r.num})${r.name}`).join("、")}</div>
                        </div>
                      },
                      returnAmt:umarenReturn,
                      label:"② 馬連流し",
                      color:"#d4941a",
                      bg:"rgba(212,148,26,0.1)"
                    })}

                    {/* Plan 3連複 */}
                    {PlanRow({
                      plan:{...planSanpuku,
                        children:<div style={{fontSize:10,color:"#A32D2D",lineHeight:1.6}}>
                          <div>上位5頭BOX</div>
                          <div style={{fontSize:9,color:"rgba(163,45,45,0.7)"}}>{top5.map(r=>`(${r.num})${r.name}`).join("、")}</div>
                        </div>
                      },
                      returnAmt:sanpukuReturn,
                      label:"③ 3連複BOX",
                      color:"#A32D2D",
                      bg:"rgba(163,45,45,0.1)"
                    })}

                    {/* 合計 + 回収率（結果がある場合のみ） */}
                    {resultData&&(
                      <div style={{marginTop:12,padding:"12px 14px",background:"linear-gradient(135deg,rgba(200,168,75,0.15),rgba(200,168,75,0.05))",borderRadius:10,border:"1px solid rgba(200,168,75,0.4)"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                          <span style={{fontSize:11,fontWeight:700,color:"#c8a84b"}}>💼 収支</span>
                          <span style={{fontSize:9,color:"var(--color-text-tertiary)"}}>投資{totalCost.toLocaleString()}円</span>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
                          <span style={{fontSize:10,color:"var(--color-text-secondary)"}}>払戻合計</span>
                          <span style={{fontSize:14,fontWeight:700,color:totalReturn>0?"#1e5fa8":"#777"}}>{totalReturn.toLocaleString()}円</span>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
                          <span style={{fontSize:10,color:"var(--color-text-secondary)"}}>収支</span>
                          <span style={{fontSize:14,fontWeight:700,color:totalReturn-totalCost>=0?"#1e5fa8":"#A32D2D"}}>{totalReturn-totalCost>=0?"+":""}{(totalReturn-totalCost).toLocaleString()}円</span>
                        </div>
                        <div style={{height:8,borderRadius:4,background:"rgba(255,255,255,0.1)",overflow:"hidden",marginBottom:4}}>
                          <div style={{width:`${Math.min(200,recoveryRate)/2}%`,height:"100%",background:recoveryRate>=100?"linear-gradient(90deg,#1e5fa8,#4a90d9)":recoveryRate>=50?"linear-gradient(90deg,#d4941a,#f0b840)":"linear-gradient(90deg,#A32D2D,#c0392b)",borderRadius:4,transition:"width 0.5s"}}/>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"var(--color-text-tertiary)"}}>
                          <span>回収率</span>
                          <span style={{fontSize:16,fontWeight:700,color:recoveryRate>=100?"#1e5fa8":recoveryRate>=50?"#d4941a":"#A32D2D"}}>{recoveryRate}%</span>
                        </div>
                      </div>
                    )}
                    {/* Owner Pick */}
                    {race.ownerPick&&(()=>{
                      const op=race.ownerPick;
                      // 後方互換: 旧tickets形式と新mainBet/supportBet形式の両対応
                      const mainTickets=op.mainBet?.tickets||op.tickets||[];
                      const supportTickets=op.supportBet?.tickets||[];
                      const mainTotal=op.mainBet?.totalBet||op.totalBet||0;
                      const supportTotal=op.supportBet?.totalBet||0;
                      const grandTotal=mainTotal+supportTotal;
                      // 軸馬の人気を取得（axisNumがあれば判定、なければ全券種の共通馬番から推定）
                      let axisPop=null;
                      let axisName="";
                      if(op.axisNum&&race.runners){
                        const ax=race.runners.find(r=>r.num===op.axisNum);
                        if(ax){axisPop=ax.pop;axisName=ax.name;}
                      } else if(mainTickets.length>=2){
                        // 全券種に共通する馬番を軸とみなす
                        const common=mainTickets[0].nums.filter(n=>mainTickets.every(t=>t.nums.includes(n)));
                        if(common.length===1&&race.runners){
                          const ax=race.runners.find(r=>r.num===common[0]);
                          if(ax){axisPop=ax.pop;axisName=ax.name;}
                        }
                      }
                      // 人気度別の推奨買い方
                      let axisGuide=null;
                      if(axisPop){
                        if(axisPop<=2) axisGuide={level:"safe",  label:"鉄板級",   color:"#1e5fa8", advice:"1〜2人気軸は信頼度高。1点固定の流し馬券でOK。"};
                        else if(axisPop<=5) axisGuide={level:"caution",label:"要注意", color:"#d4941a", advice:"3〜5人気軸は崩壊リスクあり。2頭軸フォーメーション推奨。"};
                        else axisGuide={level:"risky",label:"穴狙い",   color:"#A32D2D", advice:"6人気以下軸は崩壊リスク大。BOX買いまたは軸変更検討を。"};
                      }
                      return(
                        <div style={{marginTop:12,padding:"10px 12px",background:"rgba(200,168,75,0.08)",border:"2px solid rgba(200,168,75,0.5)",borderRadius:8}}>
                          <div style={{fontSize:12,fontWeight:700,color:"#c8a84b",marginBottom:6}}>🏇 作成者の馬券</div>
                          {op.comment&&<div style={{fontSize:10,color:"#c8a84b",marginBottom:8,fontStyle:"italic"}}>「{op.comment}」</div>}
                          {/* 軸馬ガイド */}
                          {axisGuide&&(
                            <div style={{padding:"6px 10px",background:"rgba(0,0,0,0.2)",borderRadius:6,marginBottom:10,borderLeft:`3px solid ${axisGuide.color}`}}>
                              <div style={{fontSize:9,color:"var(--color-text-tertiary)",marginBottom:2}}>
                                軸: {axisName&&<span style={{color:"var(--color-text-primary)",fontWeight:600}}>{axisName}</span>} <span style={{fontWeight:700,color:axisGuide.color}}>{axisPop}番人気</span>
                                <span style={{marginLeft:6,padding:"1px 6px",borderRadius:8,background:axisGuide.color,color:"#fff",fontSize:8,fontWeight:700}}>{axisGuide.label}</span>
                              </div>
                              <div style={{fontSize:9,color:"var(--color-text-secondary)",lineHeight:1.5}}>💡 {axisGuide.advice}</div>
                            </div>
                          )}
                          {/* メイン馬券（血統スコア軸） */}
                          {mainTickets.length>0&&(
                            <div style={{marginBottom:supportTickets.length>0?12:0}}>
                              {op.mainBet&&<div style={{fontSize:10,fontWeight:700,color:"#c8a84b",marginBottom:4,display:"flex",alignItems:"center",gap:4}}>📊 メイン馬券（血統スコア軸）</div>}
                              {mainTickets.map((t,i)=>{
                                const numStr=t.nums.join(" - ");
                                return(
                                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:"0.5px solid rgba(200,168,75,0.2)"}}>
                                    <div style={{fontSize:10,color:"var(--color-text-primary)"}}>
                                      <span style={{fontWeight:700,color:"#c8a84b"}}>{t.type}</span>
                                      <span style={{marginLeft:6}}>{numStr}</span>
                                    </div>
                                    <div style={{fontSize:10,color:"var(--color-text-secondary)",textAlign:"right"}}>
                                      <span style={{fontWeight:600}}>{t.unit.toLocaleString()}円</span>
                                    </div>
                                  </div>
                                );
                              })}
                              {op.mainBet&&(
                                <div style={{display:"flex",justifyContent:"space-between",marginTop:4,fontSize:10,color:"#c8a84b"}}>
                                  <span>小計</span>
                                  <span style={{fontWeight:600}}>{mainTotal.toLocaleString()}円</span>
                                </div>
                              )}
                            </div>
                          )}
                          {/* 応援馬券 */}
                          {supportTickets.length>0&&(
                            <div style={{padding:"6px 8px",background:"rgba(255,255,255,0.04)",borderRadius:6,marginBottom:8}}>
                              <div style={{fontSize:10,fontWeight:700,color:"#F09595",marginBottom:4,display:"flex",alignItems:"center",gap:4}}>💖 応援馬券</div>
                              {op.supportBet?.comment&&<div style={{fontSize:9,color:"#F09595",marginBottom:4,fontStyle:"italic"}}>「{op.supportBet.comment}」</div>}
                              {supportTickets.map((t,i)=>{
                                const numStr=t.nums.join(" - ");
                                return(
                                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:"0.5px solid rgba(240,149,149,0.2)"}}>
                                    <div style={{fontSize:10,color:"var(--color-text-primary)"}}>
                                      <span style={{fontWeight:700,color:"#F09595"}}>{t.type}</span>
                                      <span style={{marginLeft:6}}>{numStr}</span>
                                    </div>
                                    <div style={{fontSize:10,color:"var(--color-text-secondary)",textAlign:"right"}}>
                                      <span style={{fontWeight:600}}>{t.unit.toLocaleString()}円</span>
                                    </div>
                                  </div>
                                );
                              })}
                              <div style={{display:"flex",justifyContent:"space-between",marginTop:4,fontSize:10,color:"#F09595"}}>
                                <span>小計</span>
                                <span style={{fontWeight:600}}>{supportTotal.toLocaleString()}円</span>
                              </div>
                            </div>
                          )}
                          <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontSize:11,fontWeight:700,color:"#c8a84b",paddingTop:6,borderTop:"1px solid rgba(200,168,75,0.3)"}}>
                            <span>合計</span>
                            <span>{grandTotal.toLocaleString()}円</span>
                          </div>
                        </div>
                      );
                    })()}
                    <div style={{fontSize:8,color:"var(--color-text-tertiary)",textAlign:"center",marginTop:10}}>※ 血統スコア・馬場適性・オッズ乖離に基づく参考プランです。投票の最終判断はご自身でお願いします。</div>
                  </div>
                );
              })()}
              {/* レースアニメーション */}
              {bloodResults.length>=5&&(
                <RaceAnimation horses={bloodResults.map(r=>({num:r.num,name:r.name,score:r.score,frame:r.frame}))} raceName={race.race_name||race.name}/>
              )}
            </div>
          )}
          {!bloodResults&&diagView==="diag"&&(
            <div style={{textAlign:"center",padding:"40px 0",color:"var(--color-text-tertiary)"}}>
              <div style={{fontSize:32,marginBottom:8}}>🏇</div>
              <div style={{fontSize:12}}>馬場状態を選択すると診断が始まります</div>
            </div>
          )}
          </>)}
        </div>);
      })()}
      {/* TRENDS */}
      {section==="overview"&&t&&(<div>
        <div style={{fontSize:12,fontWeight:500,marginBottom:6}}>人気別成績（過去10年）</div>
        {t.popularity.map((d,i)=><DataRow key={i} label={d.label} value={d.val} highlight={d.hl}/>)}
        <div style={{marginTop:8,padding:"8px 10px",background:"#f0f6fd",borderRadius:8,fontSize:10,color:"#d4941a",lineHeight:1.6}}>💡 {t.popTip}</div>
      </div>)}
      {/* 馬場分析セクション */}
      {section==="track"&&(()=>{
        const pa=race.prevDayAnalysis;
        if(!pa) return <div style={{fontSize:11,color:"var(--color-text-tertiary)",padding:16,textAlign:"center"}}>前日馬場データ未設定</div>;
        return(
          <div>
            <div style={{fontSize:12,fontWeight:500,marginBottom:8}}>📊 前日馬場分析</div>
            <div style={{padding:"10px 12px",background:"rgba(200,168,75,0.08)",border:"1px solid rgba(200,168,75,0.25)",borderRadius:10,marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span style={{fontSize:11,fontWeight:600,color:"#c8a84b"}}>{pa.date} {race.venue}競馬場</span>
                <span style={{fontSize:9,padding:"2px 8px",borderRadius:8,background:"rgba(200,168,75,0.2)",color:"#c8a84b",fontWeight:600}}>翌日想定: {pa.trackCondForecast}</span>
              </div>
              {pa.summary&&<div style={{fontSize:10,color:"var(--color-text-secondary)",lineHeight:1.6,marginBottom:8}}>{pa.summary}</div>}
            </div>
            {/* 前日レース結果 */}
            {pa.races&&pa.races.map((rc,i)=>(
              <div key={i} style={{marginBottom:12,padding:"10px 12px",background:"var(--color-background-secondary)",borderRadius:8,borderLeft:"3px solid #1e5fa8"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <span style={{fontSize:11,fontWeight:600,color:"#1e5fa8"}}>{rc.raceNum} {rc.raceName}</span>
                  <span style={{fontSize:9,color:"var(--color-text-tertiary)"}}>{rc.course} / {rc.trackCond}</span>
                </div>
                <div style={{fontSize:9,color:"var(--color-text-secondary)",marginBottom:6}}>
                  タイム {rc.time} / ペース: {rc.pace} / 前半{rc.frontHalf} / 上がり{rc.lastHalf}
                </div>
                {rc.results&&rc.results.map((res,j)=>(
                  <div key={j} style={{display:"flex",alignItems:"center",gap:8,padding:"3px 0",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                    <span style={{width:20,fontSize:j===0?13:10,fontWeight:j===0?700:400,color:j===0?"#c8a84b":"var(--color-text-primary)",textAlign:"center"}}>{res.rank}</span>
                    <span style={{flex:1,fontSize:10,fontWeight:j===0?600:400,color:"var(--color-text-primary)"}}>{res.name}</span>
                    <span style={{fontSize:9,padding:"1px 6px",borderRadius:8,background:res.style==="差し"?"#E6F1FB":res.style==="逃げ"?"#FCEBEB":res.style==="先行"?"#EAF3DE":"#FBEAF0",color:res.style==="差し"?"#0C447C":res.style==="逃げ"?"#791F1F":res.style==="先行"?"#27500A":"#72243E",fontWeight:600}}>{res.style}</span>
                    <span style={{fontSize:9,color:"var(--color-text-tertiary)"}}>4角{res.corner4}番手</span>
                    <span style={{fontSize:9,fontWeight:600,color:j===0?"#c8a84b":"var(--color-text-secondary)"}}>{res.agari3f}</span>
                  </div>
                ))}
                {rc.analysis&&<div style={{fontSize:9,color:"#d4941a",marginTop:6,lineHeight:1.5}}>💡 {rc.analysis}</div>}
              </div>
            ))}
            {/* 翌日レースへの影響 */}
            {pa.impactOnRace&&(
              <div style={{marginBottom:12,padding:"10px 12px",background:"linear-gradient(135deg,rgba(200,168,75,0.12),rgba(200,168,75,0.04))",border:"1px solid rgba(200,168,75,0.3)",borderRadius:10}}>
                <div style={{fontSize:11,fontWeight:600,color:"#c8a84b",marginBottom:6}}>⚡ 今日のレースへの影響</div>
                {pa.impactOnRace.map((imp,i)=>(
                  <div key={i} style={{display:"flex",gap:6,padding:"3px 0",fontSize:10,color:"var(--color-text-secondary)",lineHeight:1.5}}>
                    <span style={{flexShrink:0}}>•</span>
                    <span>{imp}</span>
                  </div>
                ))}
              </div>
            )}
            {/* 良馬場→重馬場の変化比較 */}
            {pa.conditionChange&&(
              <div style={{marginBottom:12}}>
                <div style={{fontSize:12,fontWeight:500,marginBottom:6}}>良馬場 → 重馬場の変化</div>
                <div style={{borderRadius:8,overflow:"hidden",border:"1px solid var(--color-border-tertiary)"}}>
                  <div style={{display:"grid",gridTemplateColumns:"60px 1fr 1fr",background:"rgba(30,95,168,0.1)",padding:"6px 8px",fontSize:9,fontWeight:600,color:"#1e5fa8"}}>
                    <span>項目</span><span>良馬場（昨日）</span><span>重馬場（今日）</span>
                  </div>
                  {pa.conditionChange.map((c,i)=>(
                    <div key={i} style={{display:"grid",gridTemplateColumns:"60px 1fr 1fr",padding:"5px 8px",borderTop:"0.5px solid var(--color-border-tertiary)",fontSize:9,color:"var(--color-text-secondary)"}}>
                      <span style={{fontWeight:600,color:"var(--color-text-primary)"}}>{c.item}</span>
                      <span>{c.good}</span>
                      <span style={{color:"#A32D2D",fontWeight:500}}>{c.heavy}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* 全馬評価マトリクス */}
            {pa.horseMatrix&&(
              <div style={{marginBottom:12}}>
                <div style={{fontSize:12,fontWeight:500,marginBottom:6}}>🎯 全馬評価マトリクス（重馬場想定）</div>
                {pa.horseMatrix.map((h,i)=>{
                  const rankColor=h.rank==="S"?"#c8a84b":h.rank==="A"||h.rank==="A-"?"#1e5fa8":h.rank.startsWith("B")?"#3578c4":"#999";
                  return(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 0",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                      <span style={{width:22,height:22,borderRadius:6,background:rankColor,color:"#fff",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{h.rank}</span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:4}}>
                          <span style={{fontSize:11,fontWeight:600,color:"var(--color-text-primary)"}}>{h.name}</span>
                          <span style={{fontSize:8,color:"var(--color-text-tertiary)"}}>{h.pop}人気</span>
                          <span style={{fontSize:8,padding:"1px 5px",borderRadius:6,background:h.style==="差し"?"#E6F1FB":h.style==="逃げ"?"#FCEBEB":h.style==="先行"?"#EAF3DE":"#FBEAF0",color:h.style==="差し"?"#0C447C":h.style==="逃げ"?"#791F1F":h.style==="先行"?"#27500A":"#72243E",fontWeight:600}}>{h.style}</span>
                        </div>
                        <div style={{fontSize:8,color:"var(--color-text-tertiary)",marginTop:1}}>{h.frame} / 重{h.heavy} 差{h.sashi} / {h.data}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {/* 重馬場で浮上する馬 */}
            {pa.pickupHorses&&(
              <div style={{marginBottom:12}}>
                <div style={{fontSize:12,fontWeight:500,marginBottom:6}}>🔑 重馬場で浮上する馬</div>
                {pa.pickupHorses.map((h,i)=>(
                  <div key={i} style={{marginBottom:8,padding:"10px 12px",background:"rgba(30,95,168,0.05)",borderLeft:`3px solid ${h.color}`,borderRadius:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <span style={{fontSize:12,fontWeight:700,color:h.color}}>{"①②③"[i]} {h.name}（{h.pop}人気 {h.odds}倍）</span>
                      <span style={{fontSize:9,padding:"2px 8px",borderRadius:8,background:h.color,color:"#fff",fontWeight:700}}>{h.label}</span>
                    </div>
                    {h.reasons.map((r,j)=>(
                      <div key={j} style={{fontSize:9,color:"var(--color-text-secondary)",lineHeight:1.6,paddingLeft:4}}>• {r}</div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            {/* 危険な人気馬 */}
            {pa.dangerHorses&&(
              <div style={{marginBottom:12}}>
                <div style={{fontSize:12,fontWeight:500,marginBottom:6}}>⚠️ 危険な人気馬</div>
                {pa.dangerHorses.map((h,i)=>(
                  <div key={i} style={{marginBottom:6,padding:"8px 12px",background:"rgba(163,45,45,0.06)",borderLeft:"3px solid #A32D2D",borderRadius:8}}>
                    <div style={{fontSize:11,fontWeight:600,color:"#A32D2D",marginBottom:2}}>{h.name}（{h.pop}人気 {h.odds}倍）</div>
                    <div style={{fontSize:9,color:"var(--color-text-secondary)",lineHeight:1.6}}>{h.note}</div>
                  </div>
                ))}
              </div>
            )}
            {/* 馬券戦略 */}
            {pa.bettingStrategy&&(
              <div style={{padding:"10px 12px",background:"linear-gradient(135deg,rgba(200,168,75,0.15),rgba(200,168,75,0.05))",border:"1px solid rgba(200,168,75,0.4)",borderRadius:10}}>
                <div style={{fontSize:12,fontWeight:600,color:"#c8a84b",marginBottom:8}}>💡 馬券戦略の提案</div>
                {[
                  {label:"◎ 軸",   val:pa.bettingStrategy.axis,   sub:pa.bettingStrategy.axisReason,   color:"#c8a84b"},
                  {label:"○ 対抗", val:pa.bettingStrategy.counter, sub:pa.bettingStrategy.counterReason, color:"#1e5fa8"},
                  {label:"▲ 穴",   val:pa.bettingStrategy.hole,   sub:pa.bettingStrategy.holeReason,   color:"#d4941a"},
                  {label:"△ 大穴", val:pa.bettingStrategy.bighole, sub:pa.bettingStrategy.bigholeReason, color:"#A32D2D"},
                ].map((b,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"baseline",gap:8,padding:"4px 0",borderBottom:i<3?"0.5px solid rgba(200,168,75,0.2)":"none"}}>
                    <span style={{fontSize:10,fontWeight:700,color:b.color,width:50,flexShrink:0}}>{b.label}</span>
                    <span style={{fontSize:10,fontWeight:600,color:"var(--color-text-primary)"}}>{b.val}</span>
                    <span style={{fontSize:8,color:"var(--color-text-tertiary)"}}>{b.sub}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}
      {section==="draw"&&t&&(<div>
        <div style={{fontSize:12,fontWeight:500,marginBottom:6}}>枠順別傾向</div>
        {t.draw.map((d,i)=><DataRow key={i} label={d.label} value={d.val} highlight={d.hl}/>)}
        <div style={{marginTop:8,padding:"8px 10px",background:"#f0f6fd",borderRadius:8,fontSize:10,color:"#d4941a",lineHeight:1.6}}>💡 {t.drawTip}</div>
      </div>)}
      {section==="style"&&t&&(<div>
        <div style={{fontSize:12,fontWeight:500,marginBottom:6}}>脚質別傾向</div>
        {t.style.map((d,i)=><DataRow key={i} label={d.label} value={d.val} highlight={d.hl}/>)}
        <div style={{marginTop:8,padding:"8px 10px",background:"#f0f6fd",borderRadius:8,fontSize:10,color:"#d4941a",lineHeight:1.6}}>💡 {t.styleTip}</div>
      </div>)}
      {section==="blood"&&t&&(<div>
        <div style={{fontSize:12,fontWeight:500,marginBottom:6}}>血統傾向</div>
        {t.blood&&t.blood.map((d,i)=><DataRow key={i} label={d.label} value={d.val} highlight={d.hl}/>)}
        {t.bloodTip&&<div style={{marginTop:8,padding:"8px 10px",background:"#f0f6fd",borderRadius:8,fontSize:10,color:"#d4941a",lineHeight:1.6}}>💡 {t.bloodTip}</div>}
      </div>)}
      {section==="rotation"&&t&&(<div>
        <div style={{fontSize:12,fontWeight:500,marginBottom:6}}>前走ローテ傾向</div>
        {t.rotation&&t.rotation.map((d,i)=>(
          <div key={i}>
            <DataRow label={d.label} value={d.val} highlight={d.hl}/>
            {d.horses&&<div style={{fontSize:9,color:"#c8a84b",padding:"2px 0 6px 8px",lineHeight:1.5}}>→ {d.horses}</div>}
          </div>
        ))}
        {t.rotationTip&&<div style={{marginTop:8,padding:"8px 10px",background:"#f0f6fd",borderRadius:8,fontSize:10,color:"#d4941a",lineHeight:1.6}}>💡 {t.rotationTip}</div>}
        {t.rotationHorses&&(<div style={{marginTop:12}}>
          <div style={{fontSize:11,fontWeight:600,marginBottom:6,color:"var(--color-text-primary)"}}>📋 今年の出走馬ローテ別一覧</div>
          {t.rotationHorses.map((g,i)=>(
            <div key={i} style={{marginBottom:6,padding:"6px 10px",background:"var(--color-background-secondary)",borderRadius:6,borderLeft:"3px solid #1e5fa8"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#1e5fa8",marginBottom:2}}>{g.label}</div>
              <div style={{fontSize:10,color:"var(--color-text-secondary)",lineHeight:1.5}}>{g.horses}</div>
            </div>
          ))}
        </div>)}
      </div>)}
      {/* シミュレーションセクション */}
      {section==="sim"&&(()=>{
        const sim=race.simulation;
        if(!sim) return <div style={{fontSize:11,color:"var(--color-text-tertiary)",padding:16,textAlign:"center"}}>シミュレーションデータ未設定</div>;
        return(
          <div>
            <div style={{fontSize:12,fontWeight:500,marginBottom:8}}>🎲 レースシミュレーション（{sim.n}回）</div>
            <div style={{padding:"8px 10px",background:"rgba(200,168,75,0.08)",border:"1px solid rgba(200,168,75,0.25)",borderRadius:8,marginBottom:12}}>
              <div style={{fontSize:9,color:"var(--color-text-secondary)",lineHeight:1.6}}>{sim.method}</div>
              {sim.note&&<div style={{fontSize:8,color:"var(--color-text-tertiary)",marginTop:2}}>{sim.note}</div>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"24px 1fr 50px 50px 50px 44px",gap:4,padding:"4px 0",borderBottom:"1px solid rgba(200,168,75,0.3)",fontSize:8,fontWeight:700,color:"#c8a84b"}}>
              <span></span><span>馬名</span><span style={{textAlign:"right"}}>勝率</span><span style={{textAlign:"right"}}>連対率</span><span style={{textAlign:"right"}}>複勝率</span><span style={{textAlign:"right"}}>平均着</span>
            </div>
            {sim.results.map((s,i)=>(
              <div key={s.num} style={{display:"grid",gridTemplateColumns:"24px 1fr 50px 50px 50px 44px",gap:4,padding:"5px 0",borderBottom:"0.5px solid var(--color-border-tertiary)",alignItems:"center"}}>
                <span style={{fontSize:10,fontWeight:i<3?700:400,color:i===0?"#c8a84b":i<3?"#1e5fa8":"var(--color-text-tertiary)",textAlign:"center"}}>{i+1}</span>
                <div style={{minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:4}}>
                    <span style={{fontSize:10,fontWeight:i<3?600:400,color:"var(--color-text-primary)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>({s.num}){s.name}</span>
                    <span style={{fontSize:8,color:"var(--color-text-tertiary)"}}>{s.pop}人気</span>
                    {s.style&&<span style={{fontSize:7,padding:"1px 4px",borderRadius:4,background:s.style==="先行"?"#EAF3DE":s.style==="逃げ"?"#FCEBEB":s.style==="差し"?"#E6F1FB":"#FBEAF0",color:s.style==="先行"?"#27500A":s.style==="逃げ"?"#791F1F":s.style==="差し"?"#0C447C":"#72243E",fontWeight:600}}>{s.style}</span>}
                    {s.ev>=1.2&&<span style={{fontSize:7,padding:"1px 4px",borderRadius:6,background:"rgba(212,148,26,0.2)",color:"#d4941a",fontWeight:700,flexShrink:0}}>💰妙味</span>}
                  </div>
                  <div style={{height:4,borderRadius:2,background:"rgba(255,255,255,0.08)",overflow:"hidden",marginTop:2}}>
                    <div style={{width:`${s.place3Pct}%`,height:"100%",background:i===0?"linear-gradient(90deg,#c8a84b,#e8c86b)":"linear-gradient(90deg,#1e5fa8,#4a90d9)",borderRadius:2}}/>
                  </div>
                </div>
                <span style={{fontSize:10,fontWeight:700,textAlign:"right",color:s.winPct>=20?"#c8a84b":s.winPct>=10?"#1e5fa8":"var(--color-text-primary)"}}>{s.winPct}%</span>
                <span style={{fontSize:9,textAlign:"right",color:"var(--color-text-secondary)"}}>{s.place2Pct}%</span>
                <span style={{fontSize:9,textAlign:"right",color:"var(--color-text-secondary)"}}>{s.place3Pct}%</span>
                <span style={{fontSize:9,textAlign:"right",color:"var(--color-text-tertiary)"}}>{s.avgRank}</span>
              </div>
            ))}
            {sim.results.slice(0,3).map((s,i)=>{
              const colors=["#c8a84b","#1e5fa8","#3578c4"];
              return(
                <div key={s.num} style={{marginTop:i===0?12:8,padding:"8px 12px",borderLeft:`3px solid ${colors[i]}`,background:`rgba(${i===0?"200,168,75":"30,95,168"},0.06)`,borderRadius:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:12,fontWeight:700,color:colors[i]}}>{"🥇🥈🥉"[i]} ({s.num}){s.name}</span>
                    <span style={{fontSize:10,color:"var(--color-text-tertiary)"}}>{s.pop}人気 {s.tan}倍</span>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,fontSize:9}}>
                    <div><div style={{color:"var(--color-text-tertiary)"}}>勝率</div><div style={{fontSize:14,fontWeight:700,color:colors[i]}}>{s.winPct}%</div></div>
                    <div><div style={{color:"var(--color-text-tertiary)"}}>連対率</div><div style={{fontSize:14,fontWeight:700,color:"var(--color-text-primary)"}}>{s.place2Pct}%</div></div>
                    <div><div style={{color:"var(--color-text-tertiary)"}}>複勝率</div><div style={{fontSize:14,fontWeight:700,color:"var(--color-text-primary)"}}>{s.place3Pct}%</div></div>
                    <div><div style={{color:"var(--color-text-tertiary)"}}>期待値</div><div style={{fontSize:14,fontWeight:700,color:s.ev>=1.2?"#d4941a":"var(--color-text-primary)"}}>{s.ev.toFixed(2)}{s.ev>=1.2?" 💰":""}</div></div>
                  </div>
                </div>
              );
            })}
            <div style={{fontSize:8,color:"var(--color-text-tertiary)",marginTop:8,lineHeight:1.5,padding:"6px 10px",background:"var(--color-background-secondary)",borderRadius:6}}>
              💡 期待値 = シミュ勝率 × 単勝オッズ。1.0以上なら理論上プラス収支、1.2以上で「妙味あり」と判定。
            </div>
          </div>
        );
      })()}
    </div>
  );
};

/* ================================================================
   ===== BETTING CALCULATOR =====
   ================================================================ */
const BET_TYPES=[
  {id:"win",name:"単勝",desc:"1着を当てる",minSelect:1,from:1,formula:(n)=>n},
  {id:"place",name:"複勝",desc:"3着以内を当てる",minSelect:1,from:1,formula:(n)=>n},
  {id:"exacta",name:"馬単",desc:"1-2着を順番通りに",minSelect:2,from:2,formula:(n,s)=>{if(s.mode==="box")return n*(n-1);if(s.mode==="nagashi")return(n-1)*(s.axis==="1st"?1:1)+(s.multi?n-1:0);return 1;}},
  {id:"quinella",name:"馬連",desc:"1-2着を順不同",minSelect:2,from:2,formula:(n)=>n*(n-1)/2},
  {id:"wide",name:"ワイド",desc:"3着以内の2頭",minSelect:2,from:2,formula:(n)=>n*(n-1)/2},
  {id:"trio",name:"3連複",desc:"1-2-3着を順不同",minSelect:3,from:3,formula:(n)=>n*(n-1)*(n-2)/6},
  {id:"trifecta",name:"3連単",desc:"1-2-3着を順番通り",minSelect:3,from:3,formula:(n)=>n*(n-1)*(n-2)},
];

const BettingCalculator=()=>{
  const [betType,setBetType]=useState("quinella");
  const [mode,setMode]=useState("box"); // box, nagashi, formation
  const [unitPrice,setUnitPrice]=useState(100);
  const [headCount,setHeadCount]=useState(18);
  // Box mode
  const [boxSelected,setBoxSelected]=useState([]);
  // Nagashi mode
  const [axisHorses,setAxisHorses]=useState([]);
  const [partnerHorses,setPartnerHorses]=useState([]);
  // Formation mode (3連単/3連複)
  const [formA,setFormA]=useState([]); // 1着
  const [formB,setFormB]=useState([]); // 2着
  const [formC,setFormC]=useState([]); // 3着

  const bt=BET_TYPES.find(b=>b.id===betType);
  const isTrio=betType==="trio"||betType==="trifecta";
  const isExacta=betType==="exacta";
  const isPair=betType==="quinella"||betType==="wide";
  const isSingle=betType==="win"||betType==="place";

  // Calculate points
  const calcPoints=()=>{
    if(isSingle){
      return boxSelected.length;
    }
    if(mode==="box"){
      const n=boxSelected.length;
      if(isPair||isExacta) return isExacta?n*(n-1):n*(n-1)/2;
      if(isTrio) return betType==="trifecta"?n*(n-1)*(n-2):n*(n-1)*(n-2)/6;
      return 0;
    }
    if(mode==="nagashi"){
      const a=axisHorses.length;
      const p=partnerHorses.filter(h=>!axisHorses.includes(h)).length;
      if(isPair) return a*p;
      if(isExacta) return a*p*2; // 軸→相手 and 相手→軸
      if(isTrio){
        // 軸1頭流し: 相手からの2頭組み合わせ
        if(a===1) return betType==="trifecta"?p*(p-1):p*(p-1)/2;
        // 軸2頭流し: 相手N頭
        if(a===2) return betType==="trifecta"?p*2:p;
        return 0;
      }
      return 0;
    }
    if(mode==="formation"){
      // For trifecta/trio: unique combos from A×B×C excluding duplicates
      if(!isTrio&&!isExacta) return 0;
      let count=0;
      const aa=formA, bb=formB, cc=isTrio||isExacta?formC:[];
      if(isExacta){
        // 馬単フォーメーション: A→B (no dups)
        for(const a of aa) for(const b of bb) if(a!==b) count++;
        return count;
      }
      // 3連単/3連複
      for(const a of aa) for(const b of bb) for(const c of cc){
        if(a!==b&&b!==c&&a!==c){
          if(betType==="trifecta") count++;
          else {
            // 3連複: sort to avoid counting same combo twice
            const key=[a,b,c].sort().join("-");
            count++; // We'll deduplicate below
          }
        }
      }
      if(betType==="trio"){
        // Deduplicate
        const seen=new Set();
        count=0;
        for(const a of aa) for(const b of bb) for(const c of cc){
          if(a!==b&&b!==c&&a!==c){
            const key=[a,b,c].sort((x,y)=>x-y).join("-");
            if(!seen.has(key)){seen.add(key);count++;}
          }
        }
      }
      return count;
    }
    return 0;
  };

  const points=calcPoints();
  const totalCost=points*unitPrice;

  const toggleInList=(list,setList,val)=>{
    setList(prev=>prev.includes(val)?prev.filter(v=>v!==val):[...prev,val]);
  };

  const HorseGrid=({selected,onToggle,label})=>(
    <div>
      {label&&<div style={{fontSize:10,color:"var(--color-text-secondary)",marginBottom:4,fontWeight:500}}>{label}</div>}
      <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
        {Array.from({length:headCount},(_,i)=>i+1).map(n=>{
          const sel=selected.includes(n);
          return <button key={n} onClick={()=>onToggle(n)} style={{
            width:32,height:32,borderRadius:8,border:sel?"2px solid #1e5fa8":"1px solid var(--color-border-tertiary)",
            background:sel?"#f0f6fd":"var(--color-background-primary)",color:sel?"#1e5fa8":"var(--color-text-secondary)",
            fontSize:12,fontWeight:sel?600:400,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"
          }}>{n}</button>;
        })}
      </div>
    </div>
  );

  // Available modes per bet type
  const availModes=isSingle?["box"]:isPair?["box","nagashi"]:isExacta?["box","nagashi","formation"]:["box","nagashi","formation"];

  return(
    <div>
      {/* Bet type selector */}
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:14}}>
        {BET_TYPES.map(b=>(
          <button key={b.id} onClick={()=>{setBetType(b.id);setBoxSelected([]);setAxisHorses([]);setPartnerHorses([]);setFormA([]);setFormB([]);setFormC([]);}}
            style={{padding:"6px 12px",borderRadius:8,border:betType===b.id?"none":"1px solid var(--color-border-tertiary)",
              background:betType===b.id?"#1e5fa8":"var(--color-background-primary)",
              color:betType===b.id?"#fff":"var(--color-text-secondary)",fontSize:12,fontWeight:500,cursor:"pointer"}}>
            {b.name}
          </button>
        ))}
      </div>
      <div style={{fontSize:11,color:"var(--color-text-tertiary)",marginBottom:12}}>{bt?.desc}</div>

      {/* Head count & unit price */}
      <div style={{display:"flex",gap:12,marginBottom:14,alignItems:"center"}}>
        <Field label="出走頭数">
          <select value={headCount} onChange={e=>setHeadCount(Number(e.target.value))} style={{...inputStyle,width:70}}>
            {Array.from({length:14},(_,i)=>i+5).map(n=><option key={n} value={n}>{n}頭</option>)}
          </select>
        </Field>
        <Field label="1点あたり">
          <select value={unitPrice} onChange={e=>setUnitPrice(Number(e.target.value))} style={{...inputStyle,width:90}}>
            {[100,200,300,500,1000,2000,5000,10000].map(p=><option key={p} value={p}>{p.toLocaleString()}円</option>)}
          </select>
        </Field>
      </div>

      {/* Mode selector (not for single bets) */}
      {!isSingle&&(
        <div style={{display:"flex",gap:6,marginBottom:14}}>
          {availModes.map(m=>(
            <button key={m} onClick={()=>{setMode(m);setBoxSelected([]);setAxisHorses([]);setPartnerHorses([]);setFormA([]);setFormB([]);setFormC([]);}}
              style={{padding:"5px 14px",borderRadius:20,border:mode===m?"none":"1px solid var(--color-border-tertiary)",
                background:mode===m?"#3578c4":"transparent",color:mode===m?"#fff":"var(--color-text-secondary)",
                fontSize:11,fontWeight:500,cursor:"pointer"}}>
              {m==="box"?"ボックス":m==="nagashi"?"流し":"フォーメーション"}
            </button>
          ))}
        </div>
      )}

      {/* Selection grids by mode */}
      <div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:14,marginBottom:16}}>
        {(isSingle||mode==="box")&&(
          <HorseGrid selected={boxSelected} onToggle={n=>toggleInList(boxSelected,setBoxSelected,n)} label={isSingle?"買い目の馬番を選択":"ボックスに入れる馬番を選択"}/>
        )}
        {mode==="nagashi"&&!isSingle&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <HorseGrid selected={axisHorses} onToggle={n=>toggleInList(axisHorses,setAxisHorses,n)} label="軸馬（1〜2頭）"/>
            <div style={{borderTop:"1px solid var(--color-border-tertiary)",paddingTop:10}}>
              <HorseGrid selected={partnerHorses} onToggle={n=>toggleInList(partnerHorses,setPartnerHorses,n)} label="相手馬"/>
            </div>
          </div>
        )}
        {mode==="formation"&&!isSingle&&(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <HorseGrid selected={formA} onToggle={n=>toggleInList(formA,setFormA,n)} label={isExacta?"1着候補":"1着候補"}/>
            <div style={{borderTop:"1px solid var(--color-border-tertiary)",paddingTop:8}}>
              <HorseGrid selected={formB} onToggle={n=>toggleInList(formB,setFormB,n)} label={isExacta?"2着候補":"2着候補"}/>
            </div>
            {isTrio&&(
              <div style={{borderTop:"1px solid var(--color-border-tertiary)",paddingTop:8}}>
                <HorseGrid selected={formC} onToggle={n=>toggleInList(formC,setFormC,n)} label="3着候補"/>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div style={{background:"var(--color-background-primary)",border:"2px solid #1e5fa8",borderRadius:12,padding:16,textAlign:"center"}}>
        <div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:4}}>{bt?.name} {mode==="box"?"ボックス":mode==="nagashi"?"流し":"フォーメーション"}</div>
        <div style={{display:"flex",justifyContent:"center",gap:24,alignItems:"baseline"}}>
          <div>
            <div style={{fontSize:32,fontWeight:700,color:"#1e5fa8"}}>{points}</div>
            <div style={{fontSize:11,color:"var(--color-text-secondary)"}}>点</div>
          </div>
          <div style={{fontSize:20,color:"var(--color-text-tertiary)"}}>×</div>
          <div>
            <div style={{fontSize:18,fontWeight:500,color:"var(--color-text-primary)"}}>{unitPrice.toLocaleString()}円</div>
          </div>
          <div style={{fontSize:20,color:"var(--color-text-tertiary)"}}>=</div>
          <div>
            <div style={{fontSize:28,fontWeight:700,color:totalCost>10000?"#d4941a":"var(--color-text-primary)"}}>{totalCost.toLocaleString()}</div>
            <div style={{fontSize:11,color:"var(--color-text-secondary)"}}>円</div>
          </div>
        </div>
        {totalCost>10000&&<div style={{fontSize:10,color:"#d4941a",marginTop:6}}>※ 1万円を超えています</div>}
      </div>
    </div>
  );
};

/* ===== Main App ===== */
function App(){
  const[stallions,setStallions]=useState([]);
  const[broodmares,setBroodmares]=useState([]);
  const[dataLoading,setDataLoading]=useState(true);
  const[loadError,setLoadError]=useState(null);
  const[reviews,setReviews]=useState({});

  // Fetch JSON data on mount
  useEffect(()=>{
    const base=(document.querySelector('base')?.getAttribute('href'))||"./";
    const fetchJson=async(file)=>{
      const url=base+file;
      console.log("[血統くん] fetching:",url);
      const res=await fetch(url);
      if(!res.ok) throw new Error(`${file}: ${res.status} ${res.statusText} (url: ${url})`);
      return res.json();
    };
    const fetchReview=async(id)=>{
      try{
        const data=await fetchJson(`reviews/${id}.json`);
        return{id,data};
      }catch(e){
        return null;
      }
    };
    // Fetch reviews for all races
    const allIds=Object.keys(GRADE_RACES);
    Promise.all([
      fetchJson("stallions.json"),
      fetchJson("broodmares.json"),
      fetchJson("jockeys.json"),
      ...allIds.map(id=>fetchReview(id)),
    ]).then((results)=>{
      const [sData,bData,jData,...reviewResults]=results;
      console.log("[血統くん] loaded:",sData.length,"stallions,",bData.length,"broodmares,",jData.length,"jockeys");
      const saved=load(sData.length);
      setStallions(saved&&saved.length>=sData.length?saved:sData);
      setBroodmares(bData);
      setJockeysData(jData);
      const reviewMap={};
      reviewResults.forEach(r=>{if(r)reviewMap[r.id]=r.data;});
      console.log("[血統くん] reviews loaded:",Object.keys(reviewMap));
      setReviews(reviewMap);
      setDataLoading(false);
    }).catch(err=>{
      console.error("[血統くん] データ読み込み失敗:",err);
      setLoadError(err.message);
      setDataLoading(false);
    });
  },[]);
  const[tab,setTab]=useState("predict");
  const[predMode,setPredMode]=useState("grade");
  const[selectedGrade,setSelectedGrade]=useState("G1");
  const[selectedRace,setSelectedRace]=useState("antares2026");
  
  const[dbView,setDbView]=useState("list");
  const[editing,setEditing]=useState(null);
  const[search,setSearch]=useState("");
  const[fSurf,setFSurf]=useState("ALL");
  const[fCourse,setFCourse]=useState("ALL");
  const[fDist,setFDist]=useState("ALL");
  const[sortBy,setSortBy]=useState("name");

  // Aptitude state
  const[raceVenue,setRaceVenue]=useState("tokyo");
  const[raceSurface,setRaceSurface]=useState("TURF");
  const[raceDistance,setRaceDistance]=useState("MIDDLE");
  const[raceCond,setRaceCond]=useState("GOOD");
  const[raceAge,setRaceAge]=useState("ANY");
  const[showTop,setShowTop]=useState(20);

  useEffect(()=>{save(stallions)},[stallions]);

  // nextRaceをトップレベルで計算（Hooksルール遵守）
  const nextRace=useMemo(()=>{
    const today=new Date();
    today.setHours(0,0,0,0);
    const merged=Object.values(GRADE_RACES).map(g=>({...g,...(reviews[g.id]||{})}));
    // 今日以降のレースでrunnersがあるものを優先
    const upcoming=merged.filter(g=>{
      const d=new Date(g.date);
      return d>=today && g.runners && g.runners.length>0 && !g.result;
    }).sort((a,b)=>new Date(a.date)-new Date(b.date));
    if(upcoming.length>0) return upcoming[0];
    // なければ今日以降で一番近いレース
    const upcomingAll=merged.filter(g=>{
      const d=new Date(g.date);
      return d>=today;
    }).sort((a,b)=>new Date(a.date)-new Date(b.date));
    if(upcomingAll.length>0) return upcomingAll[0];
    // 全部過去なら一番最近のレース
    return merged.sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
  },[reviews]);

  // 次の重賞が変わったら自動選択
  useEffect(()=>{
    if(nextRace&&nextRace.id){
      setSelectedRace(nextRace.id);
      setSelectedGrade(nextRace.grade||"G1");
    }
  },[nextRace?.id]);

  // Auto-set course from venue
  const venueData=VENUES[raceVenue];
  const raceCourse=venueData?.course||"RIGHT";

  const aptitudeResults=useMemo(()=>{
    const race={surface:raceSurface,distance:raceDistance,course:raceCourse,trackCondition:raceCond,horseAge:raceAge};
    return stallions.map(s=>({stallion:s,result:calcAptitude(s,race)})).sort((a,b)=>b.result.score-a.result.score);
  },[stallions,raceSurface,raceDistance,raceCourse,raceCond,raceAge]);

  const filtered=useMemo(()=>{
    let list=stallions.filter(s=>{
      if(search){const q=search.toLowerCase();const fields=[s.name,s.nameEn,s.pedigree?.sire,s.pedigree?.dam,s.pedigree?.sireOfSire,s.pedigree?.damOfSire,s.pedigree?.sireOfDam,s.pedigree?.damOfDam].filter(Boolean);if(!fields.some(f=>f.toLowerCase().includes(q)))return false;}
      if(fSurf!=="ALL"&&s.surface!==fSurf&&s.surface!=="BOTH")return false;
      if(fCourse!=="ALL"&&s.course!==fCourse&&s.course!=="BOTH")return false;
      if(fDist!=="ALL"){const order=["SPRINT","MILE","MIDDLE","LONG"];const di=order.indexOf(fDist);const mi=order.indexOf(s.distanceMin);const ma=order.indexOf(s.distanceMax);if(s.distanceMin!=="VERSATILE"&&s.distanceMax!=="VERSATILE"&&(di<mi||di>ma))return false;}
      return true;
    });
    if(sortBy==="name")list.sort((a,b)=>a.name.localeCompare(b.name,"ja"));
    else if(sortBy==="speed")list.sort((a,b)=>b.speedScore-a.speedScore);
    else if(sortBy==="stamina")list.sort((a,b)=>b.staminaScore-a.staminaScore);
    else if(sortBy==="power")list.sort((a,b)=>b.powerScore-a.powerScore);
    return list;
  },[stallions,search,fSurf,fCourse,fDist,sortBy]);

  const handleSave=f=>{setStallions(p=>{const i=p.findIndex(s=>s.id===f.id);if(i>=0){const n=[...p];n[i]=f;return n;}return[...p,f];});setEditing(null);setDbView("list");};
  const stats=useMemo(()=>({total:stallions.length,turf:stallions.filter(s=>s.surface==="TURF").length,dirt:stallions.filter(s=>s.surface==="DIRT").length,both:stallions.filter(s=>s.surface==="BOTH").length}),[stallions]);
  const empty=()=>({id:Date.now().toString(),name:"",nameEn:"",pedigree:{sire:"",dam:"",sireOfSire:"",damOfSire:"",sireOfDam:"",damOfDam:""},surface:"TURF",distanceMin:"MILE",distanceMax:"MIDDLE",course:"BOTH",growth:"NORMAL",heavyTrack:5,staminaScore:5,speedScore:5,powerScore:5,notes:""});

  const tabBtn=(id,label)=>(<button key={id} onClick={()=>setTab(id)} style={{padding:"8px 20px",borderRadius:8,border:"none",background:tab===id?"#1e5fa8":"var(--color-background-secondary)",color:tab===id?"#fff":"var(--color-text-secondary)",fontSize:13,fontWeight:500,cursor:"pointer",transition:"all 0.2s"}}>{label}</button>);

  if(dataLoading) return(
    <div style={{maxWidth:720,margin:"0 auto",fontFamily:"var(--font-sans)",textAlign:"center",padding:"60px 20px"}}>
      <div style={{fontSize:32,marginBottom:12}}>🐴</div>
      <div style={{fontSize:14,color:"var(--color-text-secondary)"}}>データを読み込み中...</div>
    </div>
  );

  if(loadError) return(
    <div style={{maxWidth:720,margin:"0 auto",fontFamily:"var(--font-sans)",textAlign:"center",padding:"60px 20px"}}>
      <div style={{fontSize:32,marginBottom:12}}>⚠️</div>
      <div style={{fontSize:14,color:"#A32D2D",marginBottom:8}}>データの読み込みに失敗しました</div>
      <div style={{fontSize:11,color:"var(--color-text-tertiary)",marginBottom:16,lineHeight:1.6}}>{loadError}</div>
      <div style={{fontSize:11,color:"var(--color-text-secondary)",lineHeight:1.8,textAlign:"left",background:"var(--color-background-secondary)",borderRadius:8,padding:16}}>
        <div style={{fontWeight:600,marginBottom:6}}>確認してください:</div>
        <div>1. public/ フォルダに stallions.json, broodmares.json, jockeys.json が存在するか</div>
        <div>2. JSONファイルが正しいJSON形式か（構文エラーがないか）</div>
        <div>3. ブラウザの開発者ツール → Console でエラーの詳細を確認</div>
        <div>4. ブラウザの開発者ツール → Network でファイルが404になっていないか確認</div>
      </div>
      <button onClick={()=>window.location.reload()} style={{marginTop:16,padding:"8px 20px",borderRadius:8,border:"none",background:"#1e5fa8",color:"#fff",fontSize:12,cursor:"pointer"}}>再読み込み</button>
    </div>
  );

  if(stallions.length===0) return(
    <div style={{maxWidth:720,margin:"0 auto",fontFamily:"var(--font-sans)",textAlign:"center",padding:"60px 20px"}}>
      <div style={{fontSize:32,marginBottom:12}}>📂</div>
      <div style={{fontSize:14,color:"var(--color-text-secondary)",marginBottom:8}}>データが空です</div>
      <div style={{fontSize:11,color:"var(--color-text-tertiary)",marginBottom:16}}>stallions.json の読み込みに成功しましたが、中身が空の可能性があります。</div>
      <button onClick={()=>{localStorage.removeItem("keiba-v6");window.location.reload();}} style={{padding:"8px 20px",borderRadius:8,border:"none",background:"#d4941a",color:"#fff",fontSize:12,cursor:"pointer"}}>キャッシュをクリアして再読み込み</button>
    </div>
  );

  

  return(
    <div className="kb-app" style={{maxWidth:480,margin:"0 auto",fontFamily:"var(--font-sans)",paddingBottom:68,minHeight:"100vh",background:"#f0f6fd"}}>
      <style>{PC_STYLES}</style>

      {/* ===== TOP HEADER ===== */}
      <div className="kb-header" style={{background:"#0d1f3c",padding:"10px 16px 8px",position:"sticky",top:0,zIndex:10,borderBottom:"3px solid #c8a84b"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div className="kb-horse-icon" style={{display:"none"}} dangerouslySetInnerHTML={{__html:HORSE_SVG}}/>
            <div>
              <div className="kb-header-logo" style={{fontFamily:"Bebas Neue, sans-serif",fontSize:20,fontWeight:400,color:"#fff",letterSpacing:"3px"}}>血統くん
                <span className="kb-header-sub" style={{fontFamily:"var(--font-sans)",fontSize:8,color:"#c8a84b",letterSpacing:"3px",marginLeft:8,fontWeight:700}}>BLOODLINE PREDICTOR</span>
              </div>
              <div className="kb-header-meta" style={{fontSize:9,color:"rgba(255,255,255,0.45)",letterSpacing:"1px"}}>種牡馬{stats.total}頭 · 騎手{_jockeysData.length}名 · G1 21レース</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {/* PC用ナビ */}
            <div className="kb-pc-topnav" style={{display:"none",gap:4}}>
              {["predict","db","keisan"].map((t,i)=>(
                <button key={t} onClick={()=>setTab(t)} style={{
                  padding:"5px 14px",border:"none",background:tab===t?"#c8a84b":"rgba(255,255,255,0.1)",
                  color:tab===t?"#0d1f3c":"rgba(255,255,255,0.6)",fontSize:10,fontWeight:700,cursor:"pointer",letterSpacing:"1px"
                }}>{["予想","血統DB","馬券計算"][i]}</button>
              ))}
            </div>
            {tab==="predict"&&(
              <div style={{display:"flex",background:"rgba(255,255,255,0.12)",borderRadius:20,padding:"2px"}}>
                <button onClick={()=>setPredMode("grade")} style={{padding:"4px 10px",border:"none",background:predMode==="grade"?"#fff":"transparent",color:predMode==="grade"?"#1e5fa8":"rgba(255,255,255,0.55)",fontSize:10,fontWeight:700,cursor:"pointer",borderRadius:16}}>重賞</button>
                <button onClick={()=>setPredMode("hiraba")} style={{padding:"4px 10px",border:"none",background:predMode==="hiraba"?"#fff":"transparent",color:predMode==="hiraba"?"#1e5fa8":"rgba(255,255,255,0.55)",fontSize:10,fontWeight:700,cursor:"pointer",borderRadius:16}}>平場</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== PREDICT TAB ===== */}
      {tab==="predict"&&predMode==="grade"&&(
        <div>
          {/* Next Race Hero */}
          {nextRace&&(
            <div className="kb-next" onClick={()=>{setSelectedRace(nextRace.id);setSelectedGrade(nextRace.grade||"G1");}}
              style={{background:"#0d1f3c",borderLeft:"4px solid #c8a84b",padding:"12px 16px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <div className="kb-next-label" style={{fontSize:8,color:"#c8a84b",letterSpacing:"3px",fontWeight:700,marginBottom:5}}>NEXT RACE</div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:8,padding:"2px 7px",background:"#c8a84b",color:"#0d1f3c",fontWeight:700,letterSpacing:"1px"}}>{nextRace.grade}</span>
                  <div className="kb-next-name" style={{fontFamily:"Bebas Neue,sans-serif",fontSize:26,fontWeight:400,color:"#fff",letterSpacing:"2px"}}>{nextRace.emoji} {nextRace.name.replace(/第\d+回\s*/,"")}</div>
                </div>
                <div className="kb-next-info" style={{fontSize:9,color:"rgba(255,255,255,0.5)",marginTop:3,letterSpacing:"1px"}}>{nextRace.date} · {nextRace.venue} {nextRace.course}{nextRace.runners&&` · ${nextRace.runners.length}頭`}</div>
              </div>
              <div style={{color:"#c8a84b",fontSize:16}}>▶</div>
            </div>
          )}

          {/* 累積回収率バナー */}
          {(()=>{
            // 全レビューから bettingResults を集計
            const allRaces=Object.values(reviews||{}).filter(r=>r&&r.bettingResults);
            if(allRaces.length===0) return null;
            const totals=allRaces.reduce((acc,r)=>{
              const b=r.bettingResults;
              acc.cost+=(b.totalCost||0);
              acc.return+=(b.totalReturn||0);
              acc.races+=1;
              acc.hits+=(b.hits||0);
              return acc;
            },{cost:0,return:0,races:0,hits:0});
            const rate=totals.cost>0?Math.round(totals.return/totals.cost*100):0;
            const profit=totals.return-totals.cost;
            return(
              <div style={{background:"linear-gradient(135deg,#1a2845,#0d1f3c)",padding:"10px 16px",borderBottom:"1px solid rgba(200,168,75,0.2)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <span style={{fontSize:9,color:"#c8a84b",letterSpacing:"2px",fontWeight:700}}>📊 累積回収率（{totals.races}レース）</span>
                  <span style={{fontSize:9,color:"rgba(255,255,255,0.5)"}}>的中{totals.hits}/{totals.races*3}点</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:6}}>
                  <div>
                    <div style={{fontSize:8,color:"rgba(255,255,255,0.4)"}}>投資</div>
                    <div style={{fontSize:12,fontWeight:600,color:"#fff"}}>{totals.cost.toLocaleString()}円</div>
                  </div>
                  <div>
                    <div style={{fontSize:8,color:"rgba(255,255,255,0.4)"}}>払戻</div>
                    <div style={{fontSize:12,fontWeight:600,color:"#fff"}}>{totals.return.toLocaleString()}円</div>
                  </div>
                  <div>
                    <div style={{fontSize:8,color:"rgba(255,255,255,0.4)"}}>収支</div>
                    <div style={{fontSize:12,fontWeight:700,color:profit>=0?"#7cd97c":"#ff7c7c"}}>{profit>=0?"+":""}{profit.toLocaleString()}円</div>
                  </div>
                </div>
                <div style={{height:6,borderRadius:3,background:"rgba(255,255,255,0.1)",overflow:"hidden",marginBottom:3}}>
                  <div style={{width:`${Math.min(200,rate)/2}%`,height:"100%",background:rate>=100?"linear-gradient(90deg,#1e5fa8,#7cd97c)":rate>=50?"linear-gradient(90deg,#d4941a,#f0b840)":"linear-gradient(90deg,#A32D2D,#c0392b)",transition:"width 0.5s"}}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                  <span style={{fontSize:8,color:"rgba(255,255,255,0.4)"}}>回収率</span>
                  <span style={{fontSize:18,fontWeight:700,color:rate>=100?"#7cd97c":rate>=50?"#f0b840":"#ff7c7c"}}>{rate}%</span>
                </div>
              </div>
            );
          })()}

          {/* 2カラムボディ */}
          <div className="kb-body">
            {/* PC サイドバー */}
            <div className="kb-sidebar">
              <div className="kb-sidebar-inner">
                <div className="kb-grade-tabs">
                  {["G1","G2","G3"].map(g=>(
                    <button key={g} className={`kb-grade-tab${selectedGrade===g?" active":""}`} onClick={()=>setSelectedGrade(g)}>{g}</button>
                  ))}
                </div>
                {/* レースリスト（PC用縦並び） */}
                <div className="kb-race-list-pc">
                  {(()=>{
                    const today=new Date();today.setHours(0,0,0,0);
                    const races=Object.values(GRADE_RACES).filter(g=>g.grade===selectedGrade);
                    const merged=races.map(g=>({...g,...(reviews[g.id]||{})}));
                    const done=merged.filter(g=>g.result);
                    const live=merged.filter(g=>!g.result&&g.runners&&g.runners.length>0);
                    const upcoming=merged.filter(g=>!g.result&&(!g.runners||g.runners.length===0));
                    const RaceItem=({g})=>{
                      const isSel=selectedRace===g.id;
                      return(
                        <div className={`kb-race-item${isSel?" active":""}`} onClick={()=>setSelectedRace(g.id)}>
                          <div>
                            <div style={{fontSize:11,fontWeight:500,color:"#0d1f3c"}}>{g.emoji}{g.name.replace(/第\d+回\s*/,"")}</div>
                            <div style={{fontSize:9,color:"#8897a8",marginTop:1}}>{g.date} · {g.venue} {g.course}</div>
                          </div>
                          {g.result?<span style={{fontSize:8,background:"#e8f0f8",color:"#1e5fa8",padding:"1px 5px",fontWeight:700}}>✓</span>
                          :g.runners?<span style={{fontSize:8,background:"#fff8e8",color:"#8b6000",padding:"1px 5px",fontWeight:700}}>▶</span>
                          :<span style={{fontSize:8,background:"#0d1f3c",color:"#c8a84b",padding:"1px 5px",fontWeight:700}}>{g.grade}</span>}
                        </div>
                      );
                    };
                    return(<>
                      {done.length>0&&<><div className="kb-race-sec-label">終了</div>{done.map(g=><RaceItem key={g.id} g={g}/>)}</>}
                      {live.length>0&&<><div className="kb-race-sec-label">出走馬確定</div>{live.map(g=><RaceItem key={g.id} g={g}/>)}</>}
                      {upcoming.length>0&&<><div className="kb-race-sec-label">今後</div>{upcoming.map(g=><RaceItem key={g.id} g={g}/>)}</>}
                      {races.length===0&&<div style={{fontSize:11,color:"#8897a8",padding:"12px 14px"}}>登録レースなし</div>}
                    </>);
                  })()}
                </div>
              </div>
            </div>

            {/* メインコンテンツ */}
            <div className="kb-main">
              {/* スマホ用グレードタブ */}
              <div className="kb-race-list-mobile">
                <div style={{display:"flex",background:"var(--color-background-primary)",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                  {["G1","G2","G3"].map(g=>(
                    <button key={g} onClick={()=>setSelectedGrade(g)} style={{
                      flex:1,padding:"10px 0",border:"none",cursor:"pointer",background:"transparent",
                      borderBottom:selectedGrade===g?"3px solid #1e5fa8":"3px solid transparent",
                      color:selectedGrade===g?"#1e5fa8":"#7a9ab8",fontSize:13,fontWeight:selectedGrade===g?600:400,
                    }}>{g}</button>
                  ))}
                </div>
                <div style={{padding:"10px 12px",background:"var(--color-background-primary)",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                    {Object.values(GRADE_RACES).filter(g=>g.grade===selectedGrade).map(g=>{
                      const isSel=selectedRace===g.id;
                      const rv=reviews[g.id]||{};
                      const hasData=!!rv.result;
                      const hasRunners=!!(rv.runners&&rv.runners.length>0)||(g.runners&&g.runners.length>0);
                      return(
                        <button key={g.id} onClick={()=>setSelectedRace(g.id)} style={{
                          padding:"5px 8px",borderRadius:8,cursor:"pointer",fontSize:9,fontWeight:isSel?600:400,
                          border:isSel?"2px solid #1e5fa8":"0.5px solid var(--color-border-tertiary)",
                          background:isSel?"#f0f6fd":hasData?"var(--color-background-primary)":"var(--color-background-secondary)",
                          color:isSel?"#1e5fa8":hasData?"var(--color-text-primary)":"var(--color-text-tertiary)",
                          opacity:hasData||hasRunners||isSel?1:0.5,
                        }}>
                          {g.emoji}{g.name.replace(/第\d+回\s*/,"").slice(0,10)}
                          {hasData&&<span style={{marginLeft:2,color:"#1e5fa8",fontSize:7}}>✓</span>}
                          {hasRunners&&!hasData&&<span style={{marginLeft:2,color:"#d4941a",fontSize:7}}>▶</span>}
                        </button>
                      );
                    })}
                    {Object.values(GRADE_RACES).filter(g=>g.grade===selectedGrade).length===0&&(
                      <div style={{fontSize:11,color:"var(--color-text-tertiary)",padding:"8px 4px"}}>登録レースなし（今後追加予定）</div>
                    )}
                  </div>
                </div>
              </div>

              {/* レース詳細 */}
              <div style={{padding:"0 0 12px"}}>
                <GradeRacePage raceId={selectedRace} stallions={stallions} reviews={reviews}/>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== 平場 MODE ===== */}
      {tab==="predict"&&predMode==="hiraba"&&(
        <div style={{padding:"12px 16px"}}>
          <div style={{background:"var(--color-background-primary)",borderRadius:12,padding:16,marginBottom:12,border:"0.5px solid var(--color-border-tertiary)"}}>
            <div style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)",marginBottom:12}}>レース条件を設定</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
              <Field label="競馬場">
                <select value={raceVenue} onChange={e=>{setRaceVenue(e.target.value);const v=VENUES[e.target.value];if(v&&!v.surface.includes(raceSurface))setRaceSurface(v.surface[0]);}} style={inputStyle}>
                  {Object.entries(VENUES).map(([k,v])=><option key={k} value={k}>{v.name}</option>)}
                </select>
              </Field>
              <Field label="馬場">
                <select value={raceSurface} onChange={e=>setRaceSurface(e.target.value)} style={inputStyle}>
                  {(venueData?.surface||["TURF","DIRT"]).map(k=><option key={k} value={k}>{SURFACE[k]}</option>)}
                </select>
              </Field>
              <Field label="距離">
                <select value={raceDistance} onChange={e=>setRaceDistance(e.target.value)} style={inputStyle}>
                  {(venueData?.distances||Object.keys(DISTANCE)).filter(k=>k!=="VERSATILE").map(k=><option key={k} value={k}>{DISTANCE[k]}</option>)}
                </select>
              </Field>
              <Field label="馬場状態">
                <select value={raceCond} onChange={e=>setRaceCond(e.target.value)} style={inputStyle}>
                  {Object.entries(TRACK_COND).map(([k,v])=><option key={k} value={k}>{v}</option>)}
                </select>
              </Field>
              <Field label="馬齢">
                <select value={raceAge} onChange={e=>setRaceAge(e.target.value)} style={inputStyle}>
                  <option value="ANY">指定なし</option>
                  {["2","3","4","5","6"].map(a=><option key={a} value={a}>{a}歳{a==="6"?"+":""}</option>)}
                </select>
              </Field>
              <Field label="表示">
                <select value={showTop} onChange={e=>setShowTop(Number(e.target.value))} style={inputStyle}>
                  <option value={10}>上位10頭</option><option value={20}>上位20頭</option><option value={50}>全頭</option>
                </select>
              </Field>
            </div>
            <div style={{padding:"6px 10px",background:"var(--color-background-secondary)",borderRadius:8,display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
              <span style={{fontSize:11,fontWeight:500,color:"var(--color-text-primary)"}}>{venueData?.name}</span>
              <Badge variant={raceSurface==="TURF"?"turf":"dirt"}>{SURFACE[raceSurface]}</Badge>
              <Badge>{DIST_SHORT[raceDistance]||raceDistance}</Badge>
              <Badge variant={raceCourse==="RIGHT"?"right":"left"}>{COURSE[raceCourse]}</Badge>
              <Badge>{TRACK_COND[raceCond]}</Badge>
              {raceAge!=="ANY"&&<Badge>{raceAge}歳</Badge>}
            </div>
          </div>
          <div style={{fontSize:12,fontWeight:500,color:"var(--color-text-primary)",marginBottom:8}}>
            種牡馬適性ランキング — {venueData?.name} {SURFACE[raceSurface]} {DIST_SHORT[raceDistance]}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {aptitudeResults.slice(0,showTop).map((r,i)=>(
              <AptitudeCard key={r.stallion.id} stallion={r.stallion} result={r.result} rank={i+1}/>
            ))}
          </div>
        </div>
      )}

      {/* ===== DATABASE TAB ===== */}
      {tab==="database"&&(
        <div style={{padding:"12px 16px"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:12}}>
            {[{l:"登録数",v:stats.total,c:"var(--color-text-primary)"},{l:"芝",v:stats.turf,c:"#1e5fa8"},{l:"ダート",v:stats.dirt,c:"#f0b840"},{l:"兼用",v:stats.both,c:"#4a90d9"}].map(s=>(
              <div key={s.l} style={{background:"var(--color-background-secondary)",borderRadius:10,padding:"8px 6px",textAlign:"center"}}>
                <div style={{fontSize:18,fontWeight:500,color:s.c}}>{s.v}</div>
                <div style={{fontSize:9,color:"var(--color-text-tertiary)"}}>{s.l}</div>
              </div>
            ))}
          </div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="馬名・血統名で検索..." style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1px solid var(--color-border-tertiary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:13,boxSizing:"border-box",marginBottom:8}}/>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12,alignItems:"center"}}>
            {[[fSurf,setFSurf,{ALL:"馬場:すべて",...SURFACE}],[fCourse,setFCourse,{ALL:"コース:すべて",...COURSE}],[fDist,setFDist,{ALL:"距離:すべて",...DISTANCE}],[sortBy,setSortBy,{name:"名前順",speed:"スピード順",stamina:"スタミナ順",power:"パワー順"}]].map(([v,fn,opts],i)=>(
              <select key={i} value={v} onChange={e=>fn(e.target.value)} style={{padding:"5px 6px",borderRadius:8,border:"1px solid var(--color-border-tertiary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:10}}>
                {Object.entries(opts).map(([k,v])=><option key={k} value={k}>{v}</option>)}
              </select>
            ))}
            <button onClick={()=>{setEditing(empty());setDbView("form")}} style={{marginLeft:"auto",padding:"5px 12px",borderRadius:8,border:"none",background:"#1e5fa8",color:"#fff",fontSize:11,fontWeight:500,cursor:"pointer"}}>+ 追加</button>
          </div>
          {dbView==="form"&&editing?(
            <StallionForm stallion={editing} onSave={handleSave} onCancel={()=>{setEditing(null);setDbView("list")}}/>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <div style={{fontSize:10,color:"var(--color-text-tertiary)",marginBottom:2}}>{filtered.length}件表示</div>
              {filtered.length===0?(<div style={{textAlign:"center",padding:32,color:"var(--color-text-tertiary)",fontSize:13}}>該当なし</div>):filtered.map(s=>(
                <StallionCard key={s.id} stallion={s} onEdit={st=>{setEditing(st);setDbView("form")}} onDelete={id=>setStallions(p=>p.filter(x=>x.id!==id))}/>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== BETTING TAB ===== */}
      {tab==="betting"&&(
        <div style={{padding:"12px 16px"}}>
          <BettingCalculator/>
        </div>
      )}

      {/* ===== BOTTOM NAVIGATION ===== */}
      <div className="kb-bottom-nav" style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#0d1f3c",borderTop:"2px solid #c8a84b",display:"flex",zIndex:20,paddingBottom:"env(safe-area-inset-bottom)"}}>
        {[
          {id:"predict",emoji:"🏇",label:"予想"},
          {id:"database",emoji:"📚",label:"血統DB"},
          {id:"betting",emoji:"🎯",label:"馬券計算"},
        ].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            flex:1,padding:"10px 0 8px",border:"none",cursor:"pointer",
            background:"transparent",
            display:"flex",flexDirection:"column",alignItems:"center",gap:2,
          }}>
            <span style={{fontSize:18}}>{t.emoji}</span>
            <span style={{fontSize:9,fontWeight:tab===t.id?600:400,color:tab===t.id?"#1e5fa8":"#7a9ab8"}}>{t.label}</span>
            {tab===t.id&&<div style={{width:20,height:2,borderRadius:1,background:"#1e5fa8"}}/>}
          </button>
        ))}
      </div>

    </div>
  );
}


/* ブラウザ内Babel運用: マウント */
const _root = ReactDOM.createRoot(document.getElementById('root'));
_root.render(<App />);
