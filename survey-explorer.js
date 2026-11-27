(() => {
  'use strict';
  const rows = window.surveyData;
  if (!rows) return;
  const $ = id => document.getElementById(id);
  const pvalue = v => v < .0001 ? '<0.0001' : v.toFixed(4);
  const signed = v => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(3)}`;
  const notes = {
    raw:'No adjustment tests each comparison separately at 5%, without controlling errors across the set of comparisons.',
    bonferroni:'Bonferroni controls the chance of at least one false rejection across the full set of comparisons.',
    holm:'Holm is a step-down procedure that also controls the chance of at least one false rejection across the full set.',
    fdr_bh:'Benjamini–Hochberg targets the expected share of false discoveries among rejected hypotheses, under its dependence assumptions. It answers a different error-control question from Bonferroni and Holm.'
  };
  rows.forEach(r=>$('survey-country').add(new Option(r.name,r.country)));
  $('survey-country').value='840';
  function render() {
    const method=$('survey-method').value;
    const p = r => r[method==='raw'?'p_value':`p_adjusted_${method}`];
    const passes = r => p(r)<.05;
    const r=rows.find(r=>r.country===$('survey-country').value);
    const count=rows.filter(passes).length, raw=rows.filter(r=>r.p_value<.05).length;
    const label=$('survey-method').selectedOptions[0].textContent;
    $('survey-count').textContent=`${count} of ${rows.length} comparisons meet the 5% threshold (${label}).${method === 'raw' ? '' : ` Without adjustment, ${raw} do.`}`;
    $('survey-method-note').textContent=notes[method];
    $('survey-dots').replaceChildren(...rows.map(r=>{const dot=document.createElement('span');dot.className=passes(r)?'passes':'';return dot;}));
    $('survey-country-title').textContent=r.name;
    const ns='http://www.w3.org/2000/svg';
    const el=(tag,attrs,text)=>{const n=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));if(text!==undefined)n.textContent=text;return n;};
    const compact=window.matchMedia('(max-width:600px)').matches,w=compact?360:760;
    const limit=Math.ceil(Math.max(...rows.flatMap(r=>[Math.abs(r.fairness_ci_low),Math.abs(r.fairness_ci_high)]))*10)/10;
    const x=v=>32+(v+limit)/(2*limit)*(w-64);
    const svg=el('svg',{viewBox:`0 0 ${w} 145`,role:'img','aria-label':`${r.name}: difference ${signed(r.fairness_diff_high_minus_low)}, 95% confidence interval ${signed(r.fairness_ci_low)} to ${signed(r.fairness_ci_high)}`});
    svg.append(el('line',{x1:32,x2:w-32,y1:92,y2:92,stroke:'#e5cdd6'}));
    [-limit,0,limit].forEach(v=>{svg.append(el('text',{x:x(v),y:116,'text-anchor':'middle',fill:'#352b30','font-size':12},signed(v)));});
    svg.append(el('line',{x1:x(0),x2:x(0),y1:20,y2:92,stroke:'#8b777f','stroke-dasharray':'3 4'}));
    svg.append(el('line',{x1:x(r.fairness_ci_low),x2:x(r.fairness_ci_high),y1:54,y2:54,stroke:'#91455f','stroke-width':3}));
    [r.fairness_ci_low,r.fairness_ci_high].forEach(v=>svg.append(el('line',{x1:x(v),x2:x(v),y1:46,y2:62,stroke:'#91455f','stroke-width':2})));
    svg.append(el('circle',{cx:x(r.fairness_diff_high_minus_low),cy:54,r:6,fill:passes(r)?'#91455f':'#fff8fa',stroke:'#91455f','stroke-width':2}));
    svg.append(el('text',{x:32,y:139,fill:'#352b30','font-size':12},'Less perceived fairness'));
    svg.append(el('text',{x:w-32,y:139,'text-anchor':'end',fill:'#352b30','font-size':12},'More perceived fairness'));
    $('survey-chart').replaceChildren(svg);
    $('survey-reading').textContent=`${r.name}: ${signed(r.fairness_diff_high_minus_low)} points (95% interval ${signed(r.fairness_ci_low)} to ${signed(r.fairness_ci_high)}). ${method==='raw'?'Unadjusted':'Adjusted'} p-value: ${pvalue(p(r))}. ${passes(r)?'Meets':'Does not meet'} the selected 5% threshold. Groups: ${r.n_high.toLocaleString()} frequent and ${r.n_low.toLocaleString()} infrequent users.`;
    const table=document.createElement('table');table.createCaption().textContent=`All comparisons: ${label}, 5% threshold`;
    const header=table.createTHead().insertRow();
    ['Location','Difference','95% interval',method==='raw'?'p-value':'Adjusted p-value','Meets threshold'].forEach(text=>{const th=document.createElement('th');th.scope='col';th.textContent=text;header.append(th);});
    const body=table.createTBody();rows.forEach(r=>{const tr=body.insertRow();[r.name,signed(r.fairness_diff_high_minus_low),`${signed(r.fairness_ci_low)} to ${signed(r.fairness_ci_high)}`,pvalue(p(r)),passes(r)?'Yes':'No'].forEach((text,i)=>{const c=document.createElement(i?'td':'th');if(!i)c.scope='row';c.textContent=text;tr.append(c);});});
    $('survey-table').replaceChildren(table);
  }
  $('survey-country').addEventListener('change',render);$('survey-method').addEventListener('change',render);window.addEventListener('resize',render);render();
  document.querySelector('#survey-explorer .explorer-controls').hidden=false;
})();
