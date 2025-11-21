import React from 'react';
import PriceChart from './PriceChart';
import PieChartComp from './PieChartComp';
import DataTable from './DataTable';

export default function ResultCard({ result, apiBase, priceCols = [], demandCols = [], selectedPriceCol, selectedDemandCol, setSelectedPriceCol, setSelectedDemandCol, onRefreshSelection }) {
  if(!result) return <div className="card p-3">No result yet. Try "Analyze Wakad".</div>;
  const areaLabel = result.area || result.query || 'All areas';
  const downloadCSV = ()=> {
    const url = `${apiBase}/download?use_sample=true&area=${encodeURIComponent(result?.area || result?.query || '')}`;
    window.open(url, '_blank');
  };
  return (
    <div className="card p-3">
      <h5>Summary — {areaLabel}</h5>
      <p>{result.summary}</p>

      <div style={{display:'flex', gap:12, alignItems:'center', marginBottom:12}}>
        <div>
          <small>Price column</small>
          <div>
            <select className="form-select form-select-sm" value={selectedPriceCol || ''} onChange={(e)=> setSelectedPriceCol && setSelectedPriceCol(e.target.value)}>
              <option value="">(auto)</option>
              {priceCols.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <small>Demand column</small>
          <div>
            <select className="form-select form-select-sm" value={selectedDemandCol || ''} onChange={(e)=> setSelectedDemandCol && setSelectedDemandCol(e.target.value)}>
              <option value="">(auto)</option>
              {demandCols.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <button className="btn btn-sm btn-primary" onClick={()=> onRefreshSelection && onRefreshSelection()}>Apply</button>
        </div>
      </div>

      <div className="charts-row mb-3">
        <div className="chart-box">
          <h6>Price trend</h6>
          <PriceChart chartData={result.chart} />
        </div>
        <div className="chart-box" style={{width:300}}>
          <h6>Demand distribution</h6>
          <PieChartComp rows={result.table} />
        </div>
      </div>

      <h6>Filtered Data</h6>
      <div className="table-container">
        {(!result.table || result.table.length===0) ? <div>No records found for {areaLabel}. Try another area.</div> : <DataTable rows={result.table} />}
      </div>

      <div className="mt-3 controls">
        <button className="btn btn-outline-secondary" onClick={downloadCSV}>Download Data</button>
        <button className="btn btn-outline-primary" onClick={()=>window.print()}>Print</button>
      </div>
    </div>
  );
}