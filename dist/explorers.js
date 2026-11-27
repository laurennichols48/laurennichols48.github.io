(() => {
  'use strict';
  const data = window.projectData;
  if (!data) return;
  const $ = id => document.getElementById(id);
  const signed = (v, digits = 3) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(digits)}`;
  function table(headers, rows, caption) {
    const t = document.createElement('table');
    const cap = t.createCaption(); cap.textContent = caption;
    const head = t.createTHead().insertRow();
    headers.forEach(h => { const c = document.createElement('th'); c.scope = 'col'; c.textContent = h; head.append(c); });
    const body = t.createTBody();
    rows.forEach(row => {const tr = body.insertRow(); row.forEach((v, i) => { const c = document.createElement(i ? 'td' : 'th'); if (!i) c.scope = 'row'; c.textContent = v; tr.append(c); }); });
    return t;
  }
  Object.keys(data.ml).forEach(name => $('ml-target').add(new Option(name, name)));
  $('ml-target').value = 'Race / ethnicity';
  function drawML() {
    const name = $('ml-target').value, rows = data.ml[name];
    const chart = $('ml-chart'); chart.replaceChildren();
    const directions = document.createElement('div'); directions.className = 'ml-directions';
    ['← Population-weighted training performs better','Balanced training performs better →'].forEach(text => {const s = document.createElement('span');s.textContent = text;directions.append(s);});
    chart.append(directions);
    rows.forEach(([label, value]) => {
      const row = document.createElement('div'); row.className = 'ml-row';
      const title = document.createElement('span'); title.textContent = label;
      const track = document.createElement('div'); track.className = 'ml-track'; track.setAttribute('aria-hidden','true');
      const bar = document.createElement('div');bar.className = 'ml-bar' + (value < 0 ? ' negative' : '');
      bar.style.width = `${Math.abs(value) / .8 * 50}%`;bar.style.left = `${value < 0 ? 50 + value / .8 * 50 : 50}%`;track.append(bar);
      const number = document.createElement('span'); number.className = 'ml-value';number.textContent = signed(value);
      row.append(title,track,number);chart.append(row);
    });
    const axis = document.createElement('div');axis.className = 'ml-axis';axis.innerHTML = '<span>−0.8</span><span>0</span><span>+0.8</span>';chart.append(axis);
    const b = rows.filter(r => r[1] > 0).length, n = rows.filter(r => r[1] < 0).length;
    $('ml-reading').textContent = `For ${name.toLowerCase()}, balanced training has a lower Brier score in ${b} of ${rows.length} groups; population-weighted training has a lower score in ${n}. The scale stays fixed as you switch attributes.`;
    $('ml-table').replaceChildren(table(['Group','Brier difference','Lower score'],rows.map(([l,v]) => [l,signed(v),v > 0 ? 'Balanced' : 'Population-weighted']),`${name}: reported subgroup differences`));
  }
  const ns = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs, text) => {const n = document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));if(text!==undefined)n.textContent=text;return n;};
  function drawGrowth() {
    const metric = Number($('growth-metric').value), selected = Number($('growth-period').value);
    const compact = window.matchMedia('(max-width:600px)').matches;
    const w = compact ? 360 : 760, h = compact ? 290 : 320;
    const left = 40, right = w - 16, top = 22, bottom = h - 38;
    // Shared fixed range across all measures prevents scale changes from exaggerating differences.
    const x = i => left + i / (data.growth.length - 1) * (right-left);
    const y = v => bottom - (v + 4) / 16 * (bottom-top);
    const measure = $('growth-metric').selectedOptions[0].textContent;
    const units = metric === 0 ? '% per year' : 'percentage points per year';
    $('growth-unit').textContent = `${measure} · ${units} · five-year averages`;
    const svg = el('svg',{viewBox:`0 0 ${w} ${h}`,role:'img','aria-labelledby':'growth-svg-title growth-svg-desc'});
    svg.append(el('title',{id:'growth-svg-title'},`${measure}: Taiwan and the Philippines, 1950–2019`));
    svg.append(el('desc',{id:'growth-svg-desc'},'Two lines compare five-year averages. Use the period slider for exact values, or expand Data and interpretation for the complete table.'));
    [-4,0,4,8,12].forEach(t => {svg.append(el('line',{x1:left,x2:right,y1:y(t),y2:y(t),stroke:t===0?'#8b777f':'#e5cdd6','stroke-width':1}));svg.append(el('text',{x:left-8,y:y(t)+4,'text-anchor':'end',fill:'#352b30','font-size':12},t));});
    [0,compact ? 6 : 4,...(compact?[]:[8]),13].forEach(i => svg.append(el('text',{x:x(i),y:bottom+24,'text-anchor':i===0?'start':i===13?'end':'middle',fill:'#352b30','font-size':12},data.growth[i].period.slice(0,4))));
    svg.append(el('line',{x1:x(selected),x2:x(selected),y1:top,y2:bottom,stroke:'#8b777f','stroke-dasharray':'3 4'}));
    [['Taiwan','#91455f',''],['Philippines','#28676b','7 4']].forEach(([country,color,dash]) => {
      svg.append(el('polyline',{points:data.growth.map((r,i)=>`${x(i)},${y(r[country][metric])}`).join(' '),fill:'none',stroke:color,'stroke-width':3,'stroke-dasharray':dash}));
      const dot = el('circle',{cx:x(selected),cy:y(data.growth[selected][country][metric]),r:5,fill:color,stroke:'#fff8fa','stroke-width':2});svg.append(dot);
    });
    $('growth-chart').replaceChildren(svg);
    const row = data.growth[selected];
    $('growth-period-label').textContent = row.period;
    $('growth-period').setAttribute('aria-valuetext',row.period);
    $('growth-reading').textContent = `${row.period}: Taiwan ${signed(row.Taiwan[metric],1)}; Philippines ${signed(row.Philippines[metric],1)} ${units}.`;
    $('growth-table').replaceChildren(table(['Period','Taiwan','Philippines'],data.growth.map(r=>[r.period,signed(r.Taiwan[metric],1),signed(r.Philippines[metric],1)]),`${measure} (${units})`));
  }
  $('ml-target').addEventListener('change',drawML);
  $('growth-metric').addEventListener('change',drawGrowth);
  $('growth-period').addEventListener('input',drawGrowth);
  window.addEventListener('resize',drawGrowth);
  drawML();drawGrowth();
  document.querySelectorAll('.explorer-controls,.timeline').forEach(n=>n.hidden=false);
})();
