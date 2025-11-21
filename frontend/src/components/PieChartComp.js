import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChartComp({ rows }) {
  if(!rows || rows.length===0) return <div>No data</div>;
  const counts = {};
  rows.forEach(r => {
    const a = (r.area || r['final location'] || 'Unknown');
    const k = String(a).trim();
    counts[k] = (counts[k] || 0) + 1;
  });
  const keys = Object.keys(counts).slice(0,6);
  const values = keys.map(k=>counts[k]);
  // aggregate small slices into 'Others'
  const total = values.reduce((a,b)=>a+b,0);
  const items = keys.map((k,i)=>({k,v:values[i]})).sort((a,b)=>b.v-a.v);
  const major = [];
  const others = [];
  for(const it of items){
    if(major.length < 5 && it.v/total >= 0.02){ major.push(it); } else { others.push(it); }
  }
  const final = major.slice();
  if(others.length){ final.push({k:'Others', v: others.reduce((a,b)=>a+b,0)}); }
  const finalLabels = final.map(f=>f.k);
  const finalValues = final.map(f=>f.v);
  const colors = ['#00A3FF','#FF7A59','#7C5CFF','#00D166','#FFD166','#FF5DA2'];
  const data = { labels: finalLabels, datasets: [{ data: finalValues, backgroundColor: colors.slice(0, finalLabels.length), hoverOffset: 6, borderColor: '#071423' }] };
  const options = { plugins: { legend: { labels: { color: '#BFD7FF' } }, tooltip: { callbacks: { label: (ctx)=> {
        const v = ctx.parsed || 0; const pct = total ? Math.round((v/total)*100) : 0; return `${ctx.label}: ${v} (${pct}%)`;
      } } } }, maintainAspectRatio: false, responsive: true };
  return <div style={{height:260}}><Pie data={data} options={options} /></div>;
}