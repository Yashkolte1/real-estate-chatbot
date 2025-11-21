import React, { useState } from 'react';

export default function ChatInput({ onSend, suggestions=[] }) {
  const [text, setText] = useState('');
  return (
    <div className="mt-3">
      <div className="input-group">
        <input className="form-control" placeholder='e.g., "Analyze Wakad"' value={text} onChange={(e)=>setText(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter' && text.trim()){ onSend(text.trim()); setText(''); }}} />
        <button className="btn btn-primary" onClick={()=>{ if(text.trim()){ onSend(text.trim()); setText(''); } }}>Send</button>
      </div>

      <div style={{marginTop:8}}>
        {suggestions && suggestions.length>0 && (
          <div>
            <small>Suggestions:</small>
            <div style={{marginTop:6, display:'flex', gap:6, flexWrap:'wrap'}}>
              {suggestions.slice(0,12).map((s,i)=> (
                <button key={i} className="btn btn-sm btn-outline-secondary" onClick={()=>{ onSend(`Analyze ${s}`); }}>{s}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-2">
        <input type="file" id="uploadFile" className="form-control" onChange={async (e)=>{
          const f = e.target.files[0];
          if(!f) return;
          const form = new FormData(); form.append('file', f);
          const api = process.env.REACT_APP_API_BASE || 'http://localhost:8000/api';
          try{ await fetch(api + '/upload', { method:'POST', body: form }); alert('File uploaded. Now query the area.'); } catch(err){ alert('Upload failed.'); }
        }} />
      </div>
    </div>
  )
}