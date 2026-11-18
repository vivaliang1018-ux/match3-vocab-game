// Executed inside ego-browser nodejs, using its documented helpers.
const task = await taskSpace(25);
const page = task.page("p2");
const cases = globalThis.auditCases;
const locale = globalThis.auditLocale || 'en';
const sizes = [[1032,1376],[1376,1032],[744,1133],[1133,744],[375,667]];
const evidence = "/Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/docs/interface-audit-2026-10-17/evidence";
for (const scenario of cases) {
 for (const [width,height] of sizes) {
  try {
   await page.cdp("Emulation.setDeviceMetricsOverride",{width,height,deviceScaleFactor:1,mobile:true});
   await page.goto("http://127.0.0.1:5197/docs/interface-audit-2026-10-17/fixture.html?case="+scenario+"&locale="+locale);
   await page.waitForFunction(([s,l])=>document.body.dataset.auditCase===s&&document.documentElement.lang===l,[scenario,locale],{timeout:10000});
   await page.waitForFunction(()=>{
    const el=document.querySelector("[role=dialog] > :last-child") || document.querySelector("#root > div");
    if(!el) return false;
    const r=el.getBoundingClientRect(), key=[r.x,r.y,r.width,r.height].map(n=>Math.round(n)).join(",");
    if(window.__auditRect===key) window.__auditStable=(window.__auditStable||0)+1;
    else {window.__auditRect=key;window.__auditStable=0;}
    return window.__auditStable>3;
   },undefined,{timeout:7000});
   const result=await page.evaluate(()=>{
    const rect=el=>{const r=el.getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};};
    const buttons=[...document.querySelectorAll("button,input,select")].filter(el=>el.getClientRects().length&&getComputedStyle(el).visibility!=="hidden");
    const scrollAncestor=el=>{for(let p=el.parentElement;p;p=p.parentElement){const c=getComputedStyle(p);if(/auto|scroll/.test(c.overflowY)&&p.scrollHeight>p.clientHeight+1)return true;}return false;};
    const outside=buttons.filter(el=>{const r=el.getBoundingClientRect();return (r.top<0||r.bottom>innerHeight||r.left<0||r.right>innerWidth)&&!scrollAncestor(el);}).map(el=>({text:(el.getAttribute("aria-label")||el.textContent||el.tagName).trim().slice(0,100),rect:rect(el)}));
    const surfaces=[...document.querySelectorAll(".candy-modal-surface,.auth-sheet-panel,.course-picker-content,.candy-quiz-panel,.learned-word-modal,[role=dialog] > section,[role=dialog] > div:last-child")].filter(el=>el.getClientRects().length).map(el=>({class:el.className,rect:rect(el),overflow:getComputedStyle(el).overflowY}));
    return {viewport:[innerWidth,innerHeight],case:document.body.dataset.auditCase,locale:document.documentElement.lang,buttonCount:buttons.length,outside,surfaces,bodyOverflow:getComputedStyle(document.body).overflowY,scrollWidth:document.documentElement.scrollWidth};
   });
   console.log(JSON.stringify(result));
   if(width===1032||width===1376||result.outside.length) await page.screenshot({path:evidence+"/"+scenario+"-"+(locale==='en'?'':locale+'-')+width+"x"+height+".png"});
  } catch(error) {console.log(JSON.stringify({case:scenario,viewport:[width,height],error:String(error)}));}
 }
}
