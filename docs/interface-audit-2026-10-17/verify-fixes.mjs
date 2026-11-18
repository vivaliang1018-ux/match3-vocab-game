// Run with ego-browser nodejs; production components in the audit fixture.
const t = await taskSpace(1);
const p = t.page('p1');
const base = 'http://127.0.0.1:5197/docs/interface-audit-2026-10-17/fixture.html';
const evidence = '/Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/docs/interface-audit-2026-10-17/evidence';
for (const scenario of ['dead','quiz-pick','quiz-connect','word','learned','learned-tour']) {
  for (const [width,height] of [[375,667],[744,1133],[1133,744],[1032,1376],[1376,1032]]) {
    const locale = scenario === 'dead' ? 'de' : 'en';
    await p.cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true});
    await p.goto(`${base}?case=${scenario}&locale=${locale}`);
    await p.waitForFunction(([s,l]) => document.body.dataset.auditCase===s && document.documentElement.lang===l,[scenario,locale]);
    await p.waitForFunction(() => {
      const e=document.querySelector('.dead-machine-panel,.candy-quiz-pick-card,.candy-quiz-board,.learned-word-modal,[role=dialog]') || document.querySelector('#root');
      const r=e.getBoundingClientRect(); const key=[r.x,r.y,r.width,r.height].map(Math.round).join(',');
      window.fixStable=window.fixRect===key ? (window.fixStable||0)+1 : 0; window.fixRect=key;
      return window.fixStable>3;
    });
    const result=await p.evaluate(() => {
      const rect=e=>{if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};};
      return {viewport:[innerWidth,innerHeight],panel:rect(document.querySelector('.dead-machine-panel,.candy-quiz-pick-card,.candy-quiz-board,.learned-word-modal')),exit:rect(document.querySelector('.dead-machine-exit')),scroll:document.querySelector('.dead-machine-panel')?.scrollHeight,client:document.querySelector('.dead-machine-panel')?.clientHeight};
    });
    if(scenario==='dead' && (result.panel.y<0 || result.panel.y+result.panel.h>height+1 || result.exit.y<0 || result.exit.y+result.exit.h>height+1)) throw Error('Energy panel/exit outside viewport: '+JSON.stringify(result));
    if(scenario==='learned-tour') {
      for(let i=0;i<8;i++) {
        await p.keyboard.press('Tab');
        if(!await p.evaluate(()=>Boolean(document.activeElement?.closest('[role=dialog]')))) throw Error('Tour focus escaped');
      }
      result.focusTrap='8 Tab presses contained';
    }
    console.log(JSON.stringify({scenario,locale,...result}));
    if((scenario==='dead' && width===375) || ((scenario==='quiz-pick'||scenario==='quiz-connect'||scenario==='word') && width===1032)) await p.screenshot({path:`${evidence}/fixed-${scenario}-${width}x${height}.png`});
  }
}
