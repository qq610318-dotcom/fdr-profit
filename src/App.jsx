import { useState, useRef, useEffect } from "react"; 

const PW = { 一級輔導: "1111", 皇家輔導: "royal" };
const ADMIN_PW = "FDR2026";
const STORAGE_PREFIX = "fdrv4_";
const PROMO_KEY = "fdrv4_promos";

const lvIdx = { 零售: 0, 任兩盒: 1, 混品VIP: 2, 實習加盟: 3, 三級零售: 4, 三級輔導: 5, 二級輔導: 6, 一級輔導: 7, 皇家輔導: 8 };
const PROMO_COST_LEVELS = ["實習加盟", "三級零售", "三級輔導", "二級輔導", "一級輔導", "皇家輔導"];
const CUSTOMER_TARGETS = ["零售", "任兩盒", "混品VIP"];

const targetsMap = {
  實習加盟: ["零售", "任兩盒", "混品VIP"],
  三級零售: ["零售", "任兩盒", "混品VIP", "實習加盟"],
  三級輔導: ["零售", "任兩盒", "混品VIP", "實習加盟", "三級零售"],
  二級輔導: ["零售", "任兩盒", "混品VIP", "實習加盟", "三級零售", "三級輔導"],
  一級輔導: ["零售", "任兩盒", "混品VIP", "實習加盟", "三級零售", "三級輔導", "二級輔導"],
  皇家輔導: ["零售", "任兩盒", "混品VIP", "實習加盟", "三級零售", "三級輔導", "二級輔導", "一級輔導"],
};

const tIcon = { 零售: "🛍", 任兩盒: "📦", 混品VIP: "💎", 實習加盟: "🌱", 三級零售: "📋", 三級輔導: "📊", 二級輔導: "⭐", 一級輔導: "🔥", 皇家輔導: "👑" };

const priceTable = {
  beauty: [
    { id: "b01", name: "水光錠(60顆/盒)",               prices: [1680,1580,1480,1260,1080,1040,920,830,740] },
    { id: "b02", name: "水光纖帶面膜精裝盒(5片/盒)",    prices: [700,650,600,550,500,485,450,400,360] },
    { id: "b03", name: "水光纖帶面膜環保箱(20片/箱)",   prices: [null,null,2200,null,1800,1740,1600,1440,1300] },
    { id: "b04", name: "水光纖帶面膜體驗包(30ml/片)",   prices: [150,null,null,null,null,null,null,null,null] },
    { id: "b05", name: "雪聚露(120ml/瓶)",              prices: [1280,1180,1100,990,860,830,770,690,620] },
    { id: "b06", name: "婕肌零(200ml/瓶)",              prices: [990,900,830,780,660,635,580,510,440] },
    { id: "b07", name: "婕肌零體驗包(7ml/包)",          prices: [40,null,null,30,25,24,20,17,15] },
    { id: "b08", name: "精純玻尿酸保濕原液(30ml/瓶)",   prices: [990,900,830,780,660,635,580,510,440] },
    { id: "b09", name: "小白瓶(100ml/瓶)",              prices: [1280,1180,1100,990,860,830,770,690,620] },
    { id: "b10", name: "護手霜(50ml/支)",               prices: [680,630,600,530,455,440,410,365,320] },
    { id: "b11", name: "法樂蓬洗髮露(500ml/瓶)",        prices: [1280,1180,1100,990,860,830,770,690,620] },
    { id: "b12", name: "法樂蓬體驗包(8ml/包)",          prices: [30,null,null,24,21,20,17,14,12] },
    { id: "b13", name: "法樂蓬養髮原液(30ml/瓶)",       prices: [1080,990,900,840,720,695,640,570,500] },
  ],
  fiber: [
    { id: "f01", name: "纖纖飲X(14入/盒)",              prices: [1480,1380,1280,1160,990,955,880,790,700] },
    { id: "f02", name: "纖纖錠(60粒/盒)",               prices: [1480,1380,1280,1160,990,955,880,790,700] },
    { id: "f03", name: "雪花紫纖飲(14包/盒)",           prices: [990,null,null,780,660,635,580,510,440] },
    { id: "f04", name: "爆纖錠(120錠/盒)",              prices: [880,800,740,660,580,560,520,470,430] },
    { id: "f05", name: "爆纖錠體驗包(30錠/包)",         prices: [240,null,null,190,164,158,146,133,120] },
    { id: "f06", name: "纖酵宿(60包/盒)",               prices: [990,900,830,780,660,635,580,510,440] },
    { id: "f07", name: "纖酵宿體驗包(10包/包)",         prices: [190,null,null,145,117,113,103,89,75] },
    { id: "f08", name: "肽纖飲-可可/奶茶(10入/盒)",     prices: [990,900,830,780,660,635,580,510,440] },
    { id: "f09", name: "金盞花葉黃素晶亮凍(10入/盒)",   prices: [1080,990,900,840,720,695,640,570,500] },
    { id: "f10", name: "複方金盞花葉黃素EX飲(12入/盒)", prices: [680,630,600,530,455,440,410,365,320] },
    { id: "f11", name: "高機能益生菌(30入/盒)",          prices: [1280,1180,1100,990,860,830,770,690,620] },
    { id: "f12", name: "九國英雄(20錠/包)",              prices: [680,630,600,530,455,440,410,365,320] },
    { id: "f13", name: "癒肺草正冠茶(20入/盒)",         prices: [990,900,830,780,660,635,580,510,440] },
    { id: "f14", name: "固樂纖(60粒/盒)",               prices: [1680,1580,1480,1260,1080,1040,920,830,740] },
  ],
};

// ── localStorage helpers ──
function stKey(lv, m) { return STORAGE_PREFIX + lv + "_" + m; }
function lsGet(key) { try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : null; } catch { return null; } }
function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch { return false; } }
function lsDel(key) { try { localStorage.removeItem(key); } catch {} }
function lsMonths(lv) {
  const pfx = STORAGE_PREFIX + lv + "_", months = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k?.startsWith(pfx)) { const m = k.slice(pfx.length); if (/^\d{4}-\d{2}$/.test(m)) months.push(m); }
  }
  return [...new Set(months)].sort().reverse();
}
function loadEntries(lv, m) { return lsGet(stKey(lv, m)) || { entries: [], seq: 0 }; }
function saveEntries(lv, m, entries, seq) { return lsSet(stKey(lv, m), { entries, seq }); }
function loadPromos() { return lsGet(PROMO_KEY) || []; }
function savePromos(list) { return lsSet(PROMO_KEY, list); }

function getDays(m) { if (!m) return 30; const [y, mm] = m.split("-").map(Number); return new Date(y, mm, 0).getDate(); }
function nowMonth() { const n = new Date(); return n.getFullYear() + "-" + String(n.getMonth() + 1).padStart(2, "0"); }
function isCustomer(t) { return CUSTOMER_TARGETS.includes(t); }
function getPromoProfit(promo, myLevel, target) {
  const myCost = Number(promo.costs?.[myLevel]); if (!myCost) return null;
  if (isCustomer(target)) { const sp = Number(promo.customerPrice); if (!sp) return null; return { sellPrice: sp, myCost, profit: sp - myCost }; }
  else { const tc = Number(promo.costs?.[target]); if (!tc) return null; return { sellPrice: tc, myCost, profit: tc - myCost }; }
}

// ── Styles ──
const S = {
  back: { width: 34, height: 34, background: "none", border: "1px solid rgba(201,160,144,.35)", borderRadius: "50%", color: "#c9a090", fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  primary: { width: "100%", padding: 15, background: "linear-gradient(135deg,#c9a090,#e8c4b8)", border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700, letterSpacing: 2, cursor: "pointer", fontFamily: "'Noto Serif TC',serif", boxShadow: "0 4px 18px rgba(201,160,144,.3)" },
  secondary: { width: "100%", padding: 13, background: "none", border: "1px solid #c9a090", borderRadius: 12, color: "#c9a090", fontSize: 13, cursor: "pointer", marginTop: 8, fontFamily: "inherit" },
  danger: { width: "100%", padding: 13, background: "none", border: "1px solid rgba(212,117,106,.35)", borderRadius: 12, color: "#d4756a", fontSize: 13, cursor: "pointer", marginTop: 8, fontFamily: "inherit" },
  ghost: { width: "100%", padding: 13, background: "none", border: "1px solid rgba(201,160,144,.22)", borderRadius: 11, color: "#b09490", fontSize: 13, cursor: "pointer", marginTop: 10, fontFamily: "inherit" },
  qBtn: { width: 30, height: 30, background: "none", border: "none", color: "#c9a090", fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  input: { width: "100%", background: "#f2e6e1", border: "1px solid rgba(201,160,144,.35)", borderRadius: 8, padding: "10px 14px", color: "#4a3530", fontSize: 14, outline: "none", fontFamily: "inherit" },
};

function SecLabel({ children }) {
  return <div style={{ fontSize: 11, color: "#b09490", letterSpacing: 3, margin: "18px 0 10px" }}>{children}</div>;
}
function Toast({ msg }) {
  return msg ? <div style={{ position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)", background: "#fff8f6", border: "1px solid rgba(201,160,144,.35)", boxShadow: "0 4px 20px rgba(201,160,144,.25)", borderRadius: 20, padding: "10px 22px", fontSize: 13, color: "#4a3530", zIndex: 9999, whiteSpace: "nowrap", animation: "fadeInUp .25s ease" }}>{msg}</div> : null;
}
function Watermark() {
  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      <div style={{ fontSize: 36, fontWeight: 700, color: "rgba(201,160,144,.05)", letterSpacing: 6, textAlign: "center", transform: "rotate(-25deg)", fontFamily: "'Noto Serif TC',serif", whiteSpace: "nowrap", userSelect: "none" }}>Fashion Diva Rich</div>
    </div>
  );
}
function PageHeader({ onBack, title }) {
  return (
    <div style={{ padding: "18px 18px 14px", display: "flex", alignItems: "center", gap: 10, background: "#fdf6f3", flexShrink: 0, position: "relative", zIndex: 1, borderBottom: "1px solid rgba(201,160,144,.12)" }}>
      <button onClick={onBack} style={S.back}>←</button>
      <div style={{ fontFamily: "'Noto Serif TC',serif", fontSize: 16, color: "#c9a090", letterSpacing: 2 }}>{title}</div>
      <div style={{ marginLeft: "auto", fontSize: 10, color: "rgba(201,160,144,.4)", letterSpacing: 2 }}>FDR</div>
    </div>
  );
}

// ── S1 ──
function S1({ onSelect, onAdmin }) {
  const levels = [
    { name: "實習加盟", hint: "可賣：零售客・任兩盒・VIP", icon: "🌱" },
    { name: "三級零售", hint: "可賣：零售客・任兩盒・VIP", icon: "📦" },
    { name: "三級輔導", hint: "可賣：零售客・任兩盒・VIP・三級零售", icon: "📊" },
    { name: "二級輔導", hint: "可賣：零售至三級輔導", icon: "⭐" },
    { name: "一級輔導", hint: "需要密碼解鎖", icon: "🔒", locked: true },
    { name: "皇家輔導", hint: "需要密碼解鎖", icon: "👑", locked: true },
  ];
  return (
    <div style={{ minHeight: "100vh", background: "#fdf6f3", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
      <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 0 }}>
        <div style={{ fontSize: 48, fontWeight: 700, color: "rgba(201,160,144,.06)", letterSpacing: 8, textAlign: "center", transform: "rotate(-25deg)", fontFamily: "'Noto Serif TC',serif", whiteSpace: "nowrap" }}>Fashion Diva Rich</div>
      </div>
      <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 11, letterSpacing: 8, color: "#c9a090", marginBottom: 4 }}>✦ FDR EXCLUSIVE ✦</div>
          <div style={{ fontFamily: "'Noto Serif TC',serif", fontSize: 20, letterSpacing: 5, color: "#c9a090", fontWeight: 600 }}>Fashion Diva Rich</div>
          <div style={{ width: 60, height: 1, background: "linear-gradient(90deg,transparent,#c9a090,transparent)", margin: "10px auto" }} />
        </div>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 10, letterSpacing: 6, color: "#c9a090", opacity: .65, marginBottom: 8 }}>MONTHLY PROFIT</div>
          <div style={{ fontFamily: "'Noto Serif TC',serif", fontSize: 26, letterSpacing: 4, color: "#4a3530" }}>月淨利計算</div>
          <div style={{ fontSize: 11, color: "#b09490", marginTop: 6, letterSpacing: 3 }}>選擇您的夥伴階級</div>
        </div>
        <div style={{ width: 1, height: 40, background: "linear-gradient(180deg,transparent,#c9a090,transparent)", margin: "0 auto 28px" }} />
        <div style={{ width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", gap: 9 }}>
          {levels.map(lv => (
            <button key={lv.name} onClick={() => onSelect(lv.name, lv.locked)} style={{ background: "#fff8f6", border: "1px solid rgba(201,160,144,.22)", borderRadius: 12, boxShadow: "0 2px 12px rgba(201,160,144,.1)", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left", width: "100%", fontFamily: "inherit" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: 1, color: "#4a3530" }}>{lv.name}</div>
                <div style={{ fontSize: 11, color: "#b09490", marginTop: 3, letterSpacing: 1 }}>{lv.hint}</div>
              </div>
              <div style={{ fontSize: 20 }}>{lv.icon}</div>
            </button>
          ))}
          <button onClick={onAdmin} style={{ background: "none", border: "1px solid rgba(201,160,144,.22)", borderRadius: 12, padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left", width: "100%", marginTop: 8, fontFamily: "inherit" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: 1, color: "#b09490" }}>後台管理</div>
              <div style={{ fontSize: 11, color: "#b09490", opacity: .7, marginTop: 3 }}>管理活動組合商品</div>
            </div>
            <div style={{ fontSize: 18 }}>⚙️</div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Admin ──
function AdminScreen({ onBack, toast }) {
  const [promos, setPromos] = useState(() => loadPromos());
  const [editing, setEditing] = useState(null);

  function handleSave(item) {
    const updated = item.id ? promos.map(p => p.id === item.id ? item : p) : [...promos, { ...item, id: "p" + Date.now() }];
    savePromos(updated); setPromos(updated); setEditing(null);
    toast(item.id ? "已更新 ✓" : "已新增 ✓");
  }
  function handleDelete(id) {
    const updated = promos.filter(p => p.id !== id);
    savePromos(updated); setPromos(updated); toast("已刪除");
  }

  if (editing !== null) return <AdminForm item={editing === "new" ? null : editing} onSave={handleSave} onBack={() => setEditing(null)} />;

  return (
    <div style={{ minHeight: "100vh", background: "#fdf6f3", display: "flex", flexDirection: "column" }}>
      <Watermark />
      <PageHeader onBack={onBack} title="後台管理" />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px 140px" }}>
        <SecLabel>活動組合商品</SecLabel>
        <div style={{ fontSize: 12, color: "#b09490", marginBottom: 16, lineHeight: 1.8 }}>每個組合填入：客人售價 + 各階級進貨成本<br />系統自動計算每個情況的利潤</div>
        {!promos.length && <div style={{ textAlign: "center", padding: "40px 0", color: "#b09490", fontSize: 13 }}><div style={{ fontSize: 32, marginBottom: 12 }}>🎁</div>尚無活動組合</div>}
        {promos.map(p => (
          <div key={p.id} style={{ background: "#fff8f6", border: "1px solid rgba(201,160,144,.22)", borderRadius: 12, padding: "14px 16px", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#4a3530" }}>🎁 {p.name}</div>
                {p.month && <div style={{ fontSize: 11, color: "#c9a090", marginTop: 3 }}>📅 {p.month}</div>}
                <div style={{ fontSize: 12, color: "#b09490", marginTop: 4 }}>客人售價：<span style={{ color: "#4a3530", fontWeight: 600 }}>{p.customerPrice ? p.customerPrice + " 元" : "未設定"}</span></div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setEditing(p)} style={{ background: "none", border: "1px solid rgba(201,160,144,.35)", borderRadius: 8, padding: "5px 12px", fontSize: 12, color: "#c9a090", cursor: "pointer" }}>編輯</button>
                <button onClick={() => handleDelete(p.id)} style={{ background: "none", border: "1px solid rgba(212,117,106,.3)", borderRadius: 8, padding: "5px 12px", fontSize: 12, color: "#d4756a", cursor: "pointer" }}>刪除</button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {PROMO_COST_LEVELS.map(lv => { const cost = p.costs?.[lv]; if (!cost) return null; return <div key={lv} style={{ background: "#f2e6e1", borderRadius: 8, padding: "6px 10px" }}><div style={{ fontSize: 10, color: "#b09490" }}>{lv} 成本</div><div style={{ fontSize: 12, color: "#4a3530", marginTop: 2 }}>{cost} 元</div></div>; })}
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "sticky", bottom: 0, padding: "12px 18px 24px", background: "linear-gradient(rgba(253,246,243,0),#fdf6f3 55%)" }}>
        <button onClick={() => setEditing("new")} style={S.primary}>＋ 新增活動組合</button>
        <button onClick={onBack} style={S.secondary}>← 返回主頁</button>
      </div>
    </div>
  );
}

function AdminForm({ item, onSave, onBack }) {
  const [name, setName] = useState(item?.name || "");
  const [month, setMonth] = useState(item?.month || nowMonth());
  const [customerPrice, setCustomerPrice] = useState(item?.customerPrice || "");
  const [costs, setCosts] = useState(item?.costs || {});

  function handleSave() {
    if (!name.trim()) { alert("請輸入組合名稱"); return; }
    if (!customerPrice) { alert("請填入客人售價"); return; }
    if (!PROMO_COST_LEVELS.some(lv => costs[lv])) { alert("請至少填入一個階級的進貨成本"); return; }
    onSave({ id: item?.id, name: name.trim(), month, customerPrice: Number(customerPrice), costs });
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fdf6f3", display: "flex", flexDirection: "column" }}>
      <Watermark />
      <PageHeader onBack={onBack} title={item ? "編輯活動組合" : "新增活動組合"} />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px 140px" }}>
        <SecLabel>組合名稱</SecLabel>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="例：母親節水光美肌組" style={S.input} />
        <SecLabel>活動月份</SecLabel>
        <input type="month" value={month} onChange={e => setMonth(e.target.value)} style={S.input} />
        <SecLabel>客人售價</SecLabel>
        <input type="number" value={customerPrice} onChange={e => setCustomerPrice(e.target.value)} placeholder="例：2800" style={S.input} />
        <SecLabel>各階級進貨成本</SecLabel>
        <div style={{ fontSize: 12, color: "#b09490", marginBottom: 14, lineHeight: 1.8, background: "#f2e6e1", borderRadius: 10, padding: "10px 14px" }}>💡 賣給客人利潤 = 客人售價 − 自己的成本</div>
        {PROMO_COST_LEVELS.map(lv => {
          const mc = costs[lv] || "";
          const profitToCustomer = customerPrice && mc ? Number(customerPrice) - Number(mc) : null;
          return (
            <div key={lv} style={{ background: "#fff8f6", border: "1px solid rgba(201,160,144,.22)", borderRadius: 12, padding: "12px 14px", marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#4a3530", marginBottom: 8 }}>{tIcon[lv] || ""} {lv}</div>
              <input type="number" value={mc} onChange={e => setCosts(prev => ({ ...prev, [lv]: e.target.value }))} placeholder="輸入進貨成本" style={{ ...S.input, padding: "8px 12px" }} />
              {profitToCustomer !== null && <div style={{ marginTop: 8, fontSize: 12, color: profitToCustomer >= 0 ? "#7dab8f" : "#d4756a", fontWeight: 600 }}>賣客人利潤：{profitToCustomer >= 0 ? "+" : ""}{profitToCustomer} 元</div>}
            </div>
          );
        })}
      </div>
      <div style={{ position: "sticky", bottom: 0, padding: "12px 18px 24px", background: "linear-gradient(rgba(253,246,243,0),#fdf6f3 55%)" }}>
        <button onClick={handleSave} style={S.primary}>✦ {item ? "儲存變更" : "新增組合"}</button>
        <button onClick={onBack} style={S.secondary}>取消</button>
      </div>
    </div>
  );
}

// ── S2 ──
function S2({ myLevel, myIdx, onBack, onAdd, toast }) {
  const [curTarget, setCurTarget] = useState("");
  const [curSeries, setCurSeries] = useState("beauty");
  const [qty, setQty] = useState({});
  const [promos] = useState(() => loadPromos());
  const avail = targetsMap[myLevel] || [];
  function setQ(id, v) { setQty(q => ({ ...q, [id]: v })); }

  function handleAdd() {
    if (!curTarget) { toast("請先選擇賣給誰"); return; }
    const ti = lvIdx[curTarget], added = [];
    if (curSeries === "beauty" || curSeries === "fiber") {
      priceTable[curSeries].forEach(p => {
        const q = qty[p.id] || 0; if (!q) return;
        const sp = p.prices[ti], mc = p.prices[myIdx];
        if (sp == null || mc == null) return;
        added.push({ product: p.name, series: curSeries, target: curTarget, qty: q, sellPrice: sp, myCost: mc, profit: (sp - mc) * q, revenue: sp * q });
      });
    }
    if (curSeries === "promo") {
      promos.forEach(p => {
        const q = qty[p.id] || 0; if (!q) return;
        const info = getPromoProfit(p, myLevel, curTarget); if (!info) return;
        added.push({ product: "🎁 " + p.name, series: "promo", target: curTarget, qty: q, sellPrice: info.sellPrice, myCost: info.myCost, profit: info.profit * q, revenue: info.sellPrice * q });
      });
    }
    if (!added.length) { toast("請填入至少一個商品數量"); return; }
    onAdd(added);
  }

  const seriesTabs = [{ key: "beauty", label: "美肌系列" }, { key: "fiber", label: "纖體・保健" }, { key: "promo", label: "🎁 活動組合" }];
  const availPromos = promos.filter(p => p.costs?.[myLevel]);

  return (
    <div style={{ minHeight: "100vh", background: "#fdf6f3", display: "flex", flexDirection: "column" }}>
      <Watermark />
      <PageHeader onBack={onBack} title={`${myLevel} · 新增銷售`} />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px 140px" }}>
        <SecLabel>STEP 1 · 賣給誰</SecLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 18 }}>
          {avail.map(t => <button key={t} onClick={() => setCurTarget(t)} style={{ padding: "7px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer", background: curTarget === t ? "#c9a090" : "#fff8f6", border: curTarget === t ? "1px solid #c9a090" : "1px solid rgba(201,160,144,.22)", color: curTarget === t ? "#fff" : "#b09490", fontWeight: curTarget === t ? 700 : 400, fontFamily: "inherit" }}>{(tIcon[t] || "") + " " + t}</button>)}
        </div>
        <SecLabel>STEP 2 · 選商品系列</SecLabel>
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          {seriesTabs.map(s => <button key={s.key} onClick={() => setCurSeries(s.key)} style={{ padding: "7px 16px", borderRadius: 20, fontSize: 12, cursor: "pointer", background: curSeries === s.key ? "#f2e6e1" : "#fff8f6", border: curSeries === s.key ? "1px solid #c9a090" : "1px solid rgba(201,160,144,.22)", color: curSeries === s.key ? "#4a3530" : "#b09490", fontFamily: "inherit" }}>{s.label}</button>)}
        </div>
        {!curTarget && <div style={{ textAlign: "center", padding: "32px 0", color: "#b09490", fontSize: 13, letterSpacing: 2 }}>請先選擇賣給誰 ↑</div>}
        {curTarget && (curSeries === "beauty" || curSeries === "fiber") && (
          priceTable[curSeries].filter(p => { const ti = lvIdx[curTarget]; return p.prices[ti] != null && p.prices[myIdx] != null; }).map(p => {
            const ti = lvIdx[curTarget], sp = p.prices[ti], mc = p.prices[myIdx], mg = sp - mc, q = qty[p.id] || 0;
            return (
              <div key={p.id} style={{ background: "#fff8f6", border: "1px solid rgba(201,160,144,.22)", borderRadius: 11, padding: "11px 13px", marginBottom: 7, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#4a3530", lineHeight: 1.4 }}>{p.name}</div>
                  <div style={{ fontSize: 11, marginTop: 2, color: mg > 0 ? "#7dab8f" : mg < 0 ? "#d4756a" : "#b09490" }}>售 {sp} ｜利潤 {mg >= 0 ? "+" : ""}{mg}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", background: "#f2e6e1", border: "1px solid rgba(201,160,144,.22)", borderRadius: 8, overflow: "hidden" }}>
                  <button onClick={() => setQ(p.id, Math.max(0, q - 1))} style={S.qBtn}>−</button>
                  <input type="number" value={q} min={0} onChange={e => setQ(p.id, Math.max(0, parseInt(e.target.value) || 0))} style={{ width: 36, textAlign: "center", fontSize: 14, fontWeight: 500, color: "#4a3530", border: "none", background: "none", outline: "none" }} />
                  <button onClick={() => setQ(p.id, q + 1)} style={S.qBtn}>＋</button>
                </div>
                <div style={{ fontSize: 12, color: "#7dab8f", minWidth: 52, textAlign: "right" }}>{q > 0 ? "+" + (mg * q).toLocaleString() : "—"}</div>
              </div>
            );
          })
        )}
        {curTarget && curSeries === "promo" && (
          availPromos.length === 0
            ? <div style={{ textAlign: "center", padding: "32px 0", color: "#b09490", fontSize: 13 }}>{promos.length === 0 ? "後台尚未新增活動組合" : "你的階級尚未設定此活動成本"}</div>
            : availPromos.map(p => {
              const info = getPromoProfit(p, myLevel, curTarget);
              if (!info) return <div key={p.id} style={{ background: "#fff8f6", border: "1px solid rgba(201,160,144,.15)", borderRadius: 11, padding: "11px 13px", marginBottom: 7, opacity: 0.5 }}><div style={{ fontSize: 13, color: "#b09490" }}>🎁 {p.name}</div></div>;
              const { sellPrice, myCost, profit } = info, q = qty[p.id] || 0;
              return (
                <div key={p.id} style={{ background: "#fff8f6", border: "1px solid rgba(201,160,144,.35)", borderRadius: 11, padding: "11px 13px", marginBottom: 7, display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#4a3530" }}>🎁 {p.name}</div>
                    {p.month && <div style={{ fontSize: 10, color: "#c9a090", marginTop: 2 }}>📅 {p.month}</div>}
                    <div style={{ fontSize: 11, marginTop: 2, color: profit > 0 ? "#7dab8f" : "#d4756a" }}>{isCustomer(curTarget) ? `售 ${sellPrice}` : `下家成本 ${sellPrice}`} ｜利潤 {profit >= 0 ? "+" : ""}{profit}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", background: "#f2e6e1", border: "1px solid rgba(201,160,144,.22)", borderRadius: 8, overflow: "hidden" }}>
                    <button onClick={() => setQ(p.id, Math.max(0, q - 1))} style={S.qBtn}>−</button>
                    <input type="number" value={q} min={0} onChange={e => setQ(p.id, Math.max(0, parseInt(e.target.value) || 0))} style={{ width: 36, textAlign: "center", fontSize: 14, fontWeight: 500, color: "#4a3530", border: "none", background: "none", outline: "none" }} />
                    <button onClick={() => setQ(p.id, q + 1)} style={S.qBtn}>＋</button>
                  </div>
                  <div style={{ fontSize: 12, color: "#7dab8f", minWidth: 52, textAlign: "right" }}>{q > 0 ? "+" + (profit * q).toLocaleString() : "—"}</div>
                </div>
              );
            })
        )}
      </div>
      <div style={{ position: "sticky", bottom: 0, padding: "12px 18px 24px", background: "linear-gradient(rgba(253,246,243,0),#fdf6f3 55%)" }}>
        <button onClick={handleAdd} style={S.primary}>✦ 加入銷售清單</button>
        <button onClick={onBack} style={S.secondary}>← 返回清單</button>
      </div>
    </div>
  );
}

// ── S3 ──
function S3({ myLevel, entries, curMonth, savedMonths, onMonthChange, onBack, onOpenAdd, onDelete, onResult, onStats, onClear }) {
  const months = [...savedMonths];
  if (!months.includes(curMonth)) months.unshift(curMonth);
  const tabs = [...new Set(months)].sort().reverse();
  const total = entries.reduce((s, e) => s + e.profit, 0);
  const [y, mo] = curMonth.split("-");
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#fdf6f3", display: "flex", flexDirection: "column" }}>
      <Watermark />
      <PageHeader onBack={onBack} title={`${myLevel} · 銷售清單`} />
      <div style={{ margin: "12px 18px 0", display: "flex", alignItems: "center", background: "#fff8f6", border: "1px solid rgba(201,160,144,.22)", borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
        <label style={{ fontSize: 12, color: "#b09490", padding: "10px 14px", borderRight: "1px solid rgba(201,160,144,.22)", whiteSpace: "nowrap", letterSpacing: 1 }}>計算月份</label>
        <input type="month" value={curMonth} onChange={e => onMonthChange(e.target.value)} style={{ flex: 1, background: "none", border: "none", color: "#4a3530", fontSize: 14, padding: "10px 14px", outline: "none" }} />
      </div>
      <div style={{ padding: "7px 18px 0", fontSize: 12, color: "#b09490", flexShrink: 0, marginBottom: 6 }}>本月 <span style={{ color: "#c9a090", fontWeight: 700 }}>{getDays(curMonth)}</span> 天</div>
      <div style={{ padding: "0 18px", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 10 }}>
          {tabs.map(m => {
            const [ty, tm] = m.split("-"), has = savedMonths.includes(m);
            return <button key={m} onClick={() => onMonthChange(m)} style={{ padding: "6px 13px", borderRadius: 16, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, background: m === curMonth ? "#e8d5ce" : "#fff8f6", border: m === curMonth ? "1px solid #c9a090" : "1px solid rgba(201,160,144,.22)", color: m === curMonth ? "#c8a96e" : "#b09490", fontWeight: m === curMonth ? 700 : 400, fontFamily: "inherit" }}>{ty}/{parseInt(tm)}月{has && <span style={{ display: "inline-block", width: 5, height: 5, background: "#7dab8f", borderRadius: "50%", marginLeft: 4, verticalAlign: "middle" }} />}</button>;
          })}
        </div>
      </div>
      <div style={{ margin: "0 18px 10px", background: "#fff8f6", border: "1px solid rgba(201,160,144,.22)", borderRadius: 12, boxShadow: "0 2px 12px rgba(201,160,144,.12)", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 11, color: "#b09490", letterSpacing: 2, marginBottom: 4 }}>本月淨利預估</div>
          <div style={{ fontFamily: "'Noto Serif TC',serif", fontSize: 22, color: "#e8c4b8", fontWeight: 600 }}>+ {total.toLocaleString()} 元</div>
        </div>
        <div style={{ fontSize: 12, color: "#b09490" }}>已記錄 <span style={{ color: "#4a3530", fontWeight: 700 }}>{entries.length}</span> 筆</div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 18px 10px" }}>
        {!entries.length
          ? <div style={{ textAlign: "center", padding: "48px 0", color: "#b09490", fontSize: 13, letterSpacing: 2 }}><div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>尚無銷售紀錄<br />點下方按鈕新增</div>
          : entries.map(e => (
            <div key={e.id} style={{ background: "#fff8f6", border: "1px solid rgba(201,160,144,.22)", borderRadius: 11, padding: "13px 14px", marginBottom: 8, display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{tIcon[e.target] || "📋"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#4a3530" }}>{e.product}</div>
                <div style={{ fontSize: 12, color: "#b09490", marginTop: 3 }}>賣給 {e.target} ／{e.qty} 件 ／單利 {e.sellPrice - e.myCost >= 0 ? "+" : ""}{e.sellPrice - e.myCost}</div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#7dab8f", flexShrink: 0 }}>+{e.profit.toLocaleString()}</div>
              <button onClick={() => onDelete(e.id)} style={{ background: "none", border: "none", color: "#b09490", fontSize: 17, cursor: "pointer", padding: "0 0 0 8px", flexShrink: 0 }}>✕</button>
            </div>
          ))}
      </div>
      <div style={{ position: "sticky", bottom: 0, padding: "12px 18px 24px", background: "linear-gradient(rgba(253,246,243,0),#fdf6f3 55%)" }}>
        <button onClick={onOpenAdd} style={S.primary}>＋ 新增銷售紀錄</button>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={onResult} style={{ ...S.secondary, flex: 1, marginTop: 0 }}>✦ 淨利報表</button>
          <button onClick={onStats} style={{ ...S.secondary, flex: 1, marginTop: 0 }}>📊 產品統計</button>
        </div>
        {!confirmClear
          ? <button onClick={() => entries.length && setConfirmClear(true)} disabled={!entries.length} style={{ ...S.danger, opacity: entries.length ? 1 : 0.35, cursor: entries.length ? "pointer" : "default" }}>✕ 清空本月紀錄</button>
          : <div style={{ marginTop: 8, background: "rgba(212,117,106,.08)", border: "1px solid rgba(212,117,106,.35)", borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 13, color: "#d4756a", textAlign: "center", marginBottom: 12, lineHeight: 1.7 }}>⚠️ 確定要清空 <span style={{ fontWeight: 700 }}>{y}年{parseInt(mo)}月</span> 的所有紀錄？<br /><span style={{ fontSize: 11, color: "#b09490" }}>此操作無法復原</span></div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setConfirmClear(false)} style={{ flex: 1, padding: "11px 0", background: "none", border: "1px solid rgba(201,160,144,.35)", borderRadius: 10, color: "#b09490", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>取消</button>
                <button onClick={() => { setConfirmClear(false); onClear(); }} style={{ flex: 1, padding: "11px 0", background: "#d4756a", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>確認清空</button>
              </div>
            </div>
        }
      </div>
    </div>
  );
}

// ── S4 ──
function S4({ entries, curMonth, onBack, onGoS1 }) {
  const days = getDays(curMonth), [y, mo] = curMonth.split("-");
  let tp = 0, tr = 0, tu = 0;
  entries.forEach(e => { tp += e.profit; tr += e.revenue; tu += e.qty; });
  return (
    <div style={{ minHeight: "100vh", background: "#fdf6f3", display: "flex", flexDirection: "column" }}>
      <Watermark /><PageHeader onBack={onBack} title="月淨利報表" />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 18px 40px" }}>
        <div style={{ background: "linear-gradient(135deg,#ffffff,#f7ece8)", border: "1px solid rgba(201,160,144,.45)", borderRadius: 16, padding: "28px 22px", textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#b09490", letterSpacing: 3, marginBottom: 6 }}>本月總淨利</div>
          <div style={{ fontSize: 13, color: "#c9a090", letterSpacing: 2, marginBottom: 16 }}>{y}年 {parseInt(mo)}月</div>
          <div><span style={{ fontFamily: "'Noto Serif TC',serif", fontSize: 52, fontWeight: 600, color: "#e8c4b8", lineHeight: 1 }}>{tp.toLocaleString()}</span><span style={{ fontSize: 18, color: "#c9a090" }}> 元</span></div>
          <div style={{ marginTop: 12, fontSize: 13, color: "#b09490" }}>日均淨利 <span style={{ color: "#7dab8f", fontWeight: 500 }}>{days > 0 ? Math.round(tp / days).toLocaleString() : 0}</span> 元／天</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 18 }}>
          {[["銷售筆數", entries.length, "#c9a090"], ["本月天數", days, "#4a3530"], ["總銷售件數", tu.toLocaleString(), "#4a3530"], ["估算總收入", tr.toLocaleString(), "#7dab8f"]].map(([l, v, c]) => (
            <div key={l} style={{ background: "#fff8f6", border: "1px solid rgba(201,160,144,.22)", borderRadius: 11, padding: "13px 15px" }}>
              <div style={{ fontSize: 11, color: "#b09490", letterSpacing: 1, marginBottom: 5 }}>{l}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: c }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#b09490", letterSpacing: 3, marginBottom: 12, paddingTop: 16, borderTop: "1px solid rgba(201,160,144,.2)" }}>銷售明細</div>
        {entries.map(e => (
          <div key={e.id} style={{ display: "flex", alignItems: "center", background: "#fff8f6", border: "1px solid rgba(201,160,144,.22)", borderRadius: 9, padding: "10px 13px", marginBottom: 6 }}>
            <div style={{ flex: 1, fontSize: 13, color: "#4a3530", lineHeight: 1.5 }}>{e.product}<br /><span style={{ fontSize: 11, color: "#b09490" }}>賣給 {e.target}</span></div>
            <div style={{ fontSize: 12, color: "#b09490", minWidth: 48, textAlign: "center" }}>{e.qty} 件</div>
            <div style={{ fontSize: 13, color: "#7dab8f", fontWeight: 500, minWidth: 68, textAlign: "right" }}>+{e.profit.toLocaleString()}</div>
          </div>
        ))}
        <button onClick={onBack} style={S.ghost}>← 修改銷售記錄</button>
        <button onClick={onGoS1} style={S.ghost}>重新選擇階級</button>
      </div>
    </div>
  );
}

// ── S5 ──
function S5({ entries, curMonth, onBack }) {
  const [y, mo] = curMonth.split("-");
  const map = {};
  entries.forEach(e => { if (!map[e.product]) map[e.product] = { name: e.product, qty: 0, profit: 0, revenue: 0 }; map[e.product].qty += e.qty; map[e.product].profit += e.profit; map[e.product].revenue += e.revenue; });
  const arr = Object.values(map).sort((a, b) => b.profit - a.profit);
  const total = arr.reduce((s, x) => s + x.qty, 0), maxP = arr.length ? arr[0].profit : 1;
  const podiumOrder = arr.length >= 3 ? [arr[1], arr[0], arr[2]] : arr.length === 2 ? [arr[1], arr[0]] : arr.slice(0, 1);
  const podiumMedals = arr.length >= 3 ? ["🥈", "🥇", "🥉"] : arr.length === 2 ? ["🥈", "🥇"] : ["🥇"];
  return (
    <div style={{ minHeight: "100vh", background: "#fdf6f3", display: "flex", flexDirection: "column" }}>
      <Watermark /><PageHeader onBack={onBack} title={`${y}年${parseInt(mo)}月 · 產品統計`} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 18px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ fontSize: 13, color: "#c9a090", letterSpacing: 2 }}>{y}年 {parseInt(mo)}月</div>
          <div style={{ fontSize: 12, color: "#b09490" }}>共 <span style={{ color: "#4a3530", fontWeight: 700 }}>{total}</span> 件</div>
        </div>
        {!arr.length ? <div style={{ textAlign: "center", padding: 20, color: "#b09490", fontSize: 13 }}>尚無資料</div> : (
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 10, marginBottom: 16 }}>
            {podiumOrder.map((item, i) => {
              const sn = item.name.replace(/（.*?）/g, "").replace(/\(.*?\)/g, "").trim(), isFirst = podiumMedals[i] === "🥇";
              return <div key={item.name} style={{ flex: 1, maxWidth: 110, background: isFirst ? "linear-gradient(180deg,rgba(201,160,144,.18),#fff)" : "#fff8f6", border: isFirst ? "1px solid #c9a090" : "1px solid rgba(180,180,180,.28)", borderRadius: "12px 12px 8px 8px", padding: "12px 10px 10px", textAlign: "center" }}><div style={{ fontSize: 20, marginBottom: 4 }}>{podiumMedals[i]}</div><div style={{ fontSize: 11, color: "#4a3530", lineHeight: 1.3, marginBottom: 6 }}>{sn}</div><div style={{ fontSize: 14, fontWeight: 700, color: "#7dab8f" }}>+{item.profit.toLocaleString()}</div><div style={{ fontSize: 11, color: "#b09490", marginTop: 2 }}>{item.qty} 件</div></div>;
            })}
          </div>
        )}
        <div style={{ fontSize: 11, color: "#b09490", letterSpacing: 3, marginBottom: 12, paddingTop: 16, borderTop: "1px solid rgba(201,160,144,.2)" }}>全部產品明細</div>
        {arr.map((item, i) => {
          const pct = maxP > 0 ? Math.round(item.profit / maxP * 100) : 0;
          return (
            <div key={item.name} style={{ background: "#fff8f6", border: "1px solid rgba(201,160,144,.22)", borderRadius: 11, padding: "13px 14px", marginBottom: 7 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#4a3530", flex: 1, lineHeight: 1.4 }}>{item.name}</div>
                <div style={{ fontSize: 11, color: "#b09490", marginLeft: 8 }}>#{i + 1}</div>
              </div>
              <div style={{ background: "#e8d5ce", borderRadius: 4, height: 3, overflow: "hidden", marginBottom: 8 }}><div style={{ height: "100%", width: pct + "%", background: "linear-gradient(90deg,#7dab8f,#c9a090)", borderRadius: 4 }} /></div>
              <div style={{ display: "flex" }}>
                {[["件數", item.qty, "#c9a090"], ["淨利", "+" + item.profit.toLocaleString(), "#7dab8f"], ["收入", item.revenue.toLocaleString(), "#4a3530"]].map(([l, v, c], idx) => (
                  <div key={l} style={{ flex: 1, textAlign: "center", borderLeft: idx > 0 ? "1px solid rgba(201,160,144,.22)" : "none" }}>
                    <div style={{ fontSize: 10, color: "#b09490", letterSpacing: 1, marginBottom: 2 }}>{l}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: c }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <button onClick={onBack} style={S.ghost}>← 返回清單</button>
      </div>
    </div>
  );
}

function PwModal({ title, hint, correctPw, onClose, onSuccess }) {
  const [val, setVal] = useState(""), [err, setErr] = useState(""), [shake, setShake] = useState(false);
  const inp = useRef();
  useEffect(() => { setTimeout(() => inp.current?.focus(), 120); }, []);
  function submit() {
    if (val === correctPw) { onSuccess(); }
    else { setErr("密碼錯誤，請再試一次"); setShake(true); setVal(""); setTimeout(() => setShake(false), 600); }
  }
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, backdropFilter: "blur(5px)" }}>
      <div style={{ background: "#fff8f6", border: "1px solid rgba(201,160,144,.35)", borderRadius: 16, padding: "30px 26px", width: "100%", maxWidth: 330, textAlign: "center" }}>
        <div style={{ fontFamily: "'Noto Serif TC',serif", fontSize: 18, color: "#c9a090", letterSpacing: 2, marginBottom: 6 }}>{title}</div>
        <p style={{ fontSize: 13, color: "#b09490", marginBottom: 22 }}>{hint}</p>
        <input ref={inp} type="password" value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} placeholder="· · · · · ·" maxLength={20}
          style={{ width: "100%", background: "#f2e6e1", border: shake ? "1px solid #d4756a" : "1px solid rgba(201,160,144,.35)", borderRadius: 8, padding: "12px 16px", color: "#4a3530", fontSize: 18, textAlign: "center", letterSpacing: 6, outline: "none", animation: shake ? "shake .3s" : "none" }} />
        {err && <div style={{ fontSize: 12, color: "#d4756a", marginTop: 7 }}>{err}</div>}
        <div style={{ display: "flex", gap: 9, marginTop: 18 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 12, background: "none", border: "1px solid rgba(201,160,144,.35)", borderRadius: 8, color: "#b09490", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>取消</button>
          <button onClick={submit} style={{ flex: 1, padding: 12, background: "#c9a090", border: "none", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>確認</button>
        </div>
      </div>
    </div>
  );
}

// ── Main ──
export default function App() {
  const [screen, setScreen] = useState("s1");
  const [myLevel, setMyLevel] = useState("");
  const [myIdx, setMyIdx] = useState(0);
  const [curMonth, setCurMonth] = useState(nowMonth());
  const [entries, setEntries] = useState([]);
  const [seq, setSeq] = useState(0);
  const [savedMonths, setSavedMonths] = useState([]);
  const [pwModal, setPwModal] = useState(null);
  const [adminPw, setAdminPw] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const toastTimer = useRef();

  function showToast(msg) { setToastMsg(msg); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToastMsg(""), 2400); }

  function selectLevel(lv) {
    setMyLevel(lv); setMyIdx(lvIdx[lv]);
    const m = nowMonth(); setCurMonth(m);
    const s = loadEntries(lv, m);
    setEntries(s.entries); setSeq(s.seq);
    setSavedMonths(lsMonths(lv));
    setScreen("s3");
  }

  function onMonthChange(m) {
    setCurMonth(m);
    const s = loadEntries(myLevel, m);
    setEntries(s.entries); setSeq(s.seq);
  }

  function addEntries(newEntries) {
    const withIds = newEntries.map((e, i) => ({ ...e, id: seq + i + 1 }));
    const updated = [...entries, ...withIds];
    const nextSeq = seq + newEntries.length;
    setEntries(updated); setSeq(nextSeq);
    saveEntries(myLevel, curMonth, updated, nextSeq);
    setSavedMonths(lsMonths(myLevel));
    setScreen("s3");
    showToast(`已新增 ${newEntries.length} 筆 ✓`);
  }

  function deleteEntry(id) {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    saveEntries(myLevel, curMonth, updated, seq);
  }

  function handleClear() {
    lsDel(stKey(myLevel, curMonth));
    setEntries([]); setSeq(0);
    setSavedMonths(lsMonths(myLevel));
    showToast("已清空本月紀錄");
  }

  return (
    <div style={{ fontFamily: "'Noto Sans TC',sans-serif", WebkitTapHighlightColor: "transparent" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&family=Noto+Serif+TC:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=month]::-webkit-calendar-picker-indicator { opacity: .5; cursor: pointer; }
        @keyframes fadeInUp { from{opacity:0;transform:translateX(-50%) translateY(10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
      `}</style>
      {screen === "s1" && <S1 onSelect={(n, locked) => locked ? setPwModal(n) : selectLevel(n)} onAdmin={() => setAdminPw(true)} />}
      {screen === "s2" && <S2 myLevel={myLevel} myIdx={myIdx} onBack={() => setScreen("s3")} onAdd={addEntries} toast={showToast} />}
      {screen === "s3" && <S3 myLevel={myLevel} entries={entries} curMonth={curMonth} savedMonths={savedMonths} onMonthChange={onMonthChange} onBack={() => setScreen("s1")} onOpenAdd={() => setScreen("s2")} onDelete={deleteEntry} onResult={() => setScreen("s4")} onStats={() => setScreen("s5")} onClear={handleClear} />}
      {screen === "s4" && <S4 entries={entries} curMonth={curMonth} onBack={() => setScreen("s3")} onGoS1={() => setScreen("s1")} />}
      {screen === "s5" && <S5 entries={entries} curMonth={curMonth} onBack={() => setScreen("s3")} />}
      {screen === "admin" && <AdminScreen onBack={() => setScreen("s1")} toast={showToast} />}
      {pwModal && <PwModal title={pwModal} hint="此階級需要授權密碼" correctPw={PW[pwModal]} onClose={() => setPwModal(null)} onSuccess={() => { setPwModal(null); selectLevel(pwModal); }} />}
      {adminPw && <PwModal title="後台管理" hint="請輸入管理員密碼" correctPw={ADMIN_PW} onClose={() => setAdminPw(false)} onSuccess={() => { setAdminPw(false); setScreen("admin"); }} />}
      <Toast msg={toastMsg} />
    </div>
  );
}
