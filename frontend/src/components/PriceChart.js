import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function formatCurrency(v){
  if (v === null || v === undefined || isNaN(v)) return '';
  // format with commas and rupee symbol
  try{
    const n = Number(v);
    return '₹' + n.toLocaleString('en-IN', {maximumFractionDigits:0});
  }catch(e){ return String(v); }
}

export default function PriceChart({ chartData }) {
  if(!chartData || chartData.length===0) return <div>No chart data available</div>;
  const labels = chartData.map(r=>String(r.year || r['year'] || ''));
  const values = chartData.map(r => {
    if (r == null) return null;
    if (typeof r.value === 'number') return r.value;
    if (typeof r.price === 'number') return r.price;
    if (typeof r.demand === 'number') return r.demand;
    for (const k in r) {
      if (typeof r[k] === 'number') return r[k];
    }
    return null;
  });

  const datasetColor = 'rgba(0,163,255,0.95)';
  const data = { labels, datasets: [{ label:'Average Price', data: values, fill:true, tension:0.25, borderColor: datasetColor, backgroundColor: 'rgba(0,163,255,0.12)', pointBackgroundColor: '#00A3FF', pointBorderColor: '#071423', pointRadius: 3, borderWidth: 2 }] };
  const options = {
    plugins: { legend: { labels: { color: '#BFD7FF' } }, tooltip: { bodyColor: '#E6EEF8', titleColor: '#E6EEF8', callbacks: { label: (ctx)=> formatCurrency(ctx.parsed.y) } } },
    scales: {
      x: { ticks: { color: '#BFD7FF' }, grid: { color: 'rgba(255,255,255,0.03)' } },
      y: { ticks: { color: '#BFD7FF', callback: (v)=> formatCurrency(Number(v)) }, grid: { color: 'rgba(255,255,255,0.03)' } }
    },
    maintainAspectRatio: false,
    responsive: true
  };
  return <div style={{height:300}}><Line data={data} options={options} /></div>;
}