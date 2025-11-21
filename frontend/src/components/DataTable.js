import React from 'react';
export default function DataTable({ rows }) {
  if(!rows || rows.length===0) return <div>No rows found.</div>;
  const headers = Object.keys(rows[0]);
  return (
    <table className="table table-sm">
      <thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead>
      <tbody>
        {rows.slice(0,200).map((r, i) => (
          <tr key={i} style={{borderTop: '1px solid rgba(255,255,255,0.02)'}}>{headers.map(h => <td key={h}>{String(r[h] ?? '')}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}