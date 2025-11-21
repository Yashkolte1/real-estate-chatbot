import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatInput from './components/ChatInput';
import MessageList from './components/MessageList';
import ResultCard from './components/ResultCard';

export default function App(){
  const [messages, setMessages] = useState([{id:1,from:'bot',text:'Hi — ask: "Analyze Wakad" or upload your Excel.'}]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [areas, setAreas] = useState([]);
  const [priceCols, setPriceCols] = useState([]);
  const [demandCols, setDemandCols] = useState([]);
  const [selectedPriceCol, setSelectedPriceCol] = useState(null);
  const [selectedDemandCol, setSelectedDemandCol] = useState(null);
  const apiBase = process.env.REACT_APP_API_BASE || 'http://localhost:8000/api';

  const sendQuery = async (text) => {
    if(loading) return;
    setMessages(prev => [...prev, {id:Date.now(), from:'user', text}]);
    setLoading(true);
    try {
      // try to detect an explicit area from the user's text
      const parseArea = (s) => {
        if(!s) return '';
        const t = s.toLowerCase();
        // remove common verbs
        const verbs = ['analyze', 'analyse', 'show', 'compare', 'give', 'find', 'search', 'show me', 'give me analysis of'];
        let out = s;
        for(const v of verbs){
          const idx = t.indexOf(v);
          if(idx !== -1){
            out = s.slice(idx + v.length);
            break;
          }
        }
        out = out.replace(':', '').trim();
        // if nothing left, maybe user typed just 'analyze' - return empty
        return out;
      };

      let area = parseArea(text);
      // if parseArea didn't find an area, try to match any suggestion present in the text
      if(!area && areas && areas.length){
        const t = text.toLowerCase();
        for(const s of areas){
          if(!s) continue;
          const sLow = String(s).toLowerCase();
          if(sLow && t.includes(sLow)){
            area = s;
            break;
          }
        }
      }
  const params = { q: text, use_sample: true };
  if(area) params.area = area;
  if(selectedPriceCol) params.price_col = selectedPriceCol;
  if(selectedDemandCol) params.demand_col = selectedDemandCol;
      const res = await axios.get(`${apiBase}/query`, { params });
      setResult(res.data);
      // add a bot message that includes area context
      const areaText = res.data && res.data.area ? ` (area: ${res.data.area})` : '';
      setMessages(prev => [...prev, {id:Date.now()+1, from:'bot', text: res.data.summary + areaText}]);
    } catch (err) {
      console.error('API error', err);
      // try to extract backend error message
      let errMsg = 'Error fetching results.';
      if (err.response && err.response.data) {
        const d = err.response.data;
        if (d.error) errMsg = `Error: ${d.error}`;
        if (d.trace) console.error('Backend trace:', d.trace);
      } else if (err.message) {
        errMsg = `Error: ${err.message}`;
      }
      setMessages(prev => [...prev, {id:Date.now()+1, from:'bot', text: errMsg}]);
      setResult(null);
    }
    setLoading(false);
  };

  // auto-load sample data on mount
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${apiBase}/query`, { params: { q: '', use_sample: true }});
        setResult(res.data);
        setMessages(prev => [...prev, {id:Date.now()+2, from:'bot', text: res.data.summary}]);
          // fetch area suggestions and detected numeric columns
          try {
            const [ares, cols] = await Promise.all([
              axios.get(`${apiBase}/areas`, { params: { use_sample: true }}),
              axios.get(`${apiBase}/columns`, { params: { use_sample: true }})
            ]);
            setAreas(ares.data.areas || []);
            setPriceCols(cols.data.price_cols || []);
            setDemandCols(cols.data.demand_cols || []);
            if((cols.data.price_cols || []).length) setSelectedPriceCol(cols.data.price_cols[0]);
            if((cols.data.demand_cols || []).length) setSelectedDemandCol(cols.data.demand_cols[0]);
          } catch (e) {
            // ignore
          }
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const refreshForSelection = async () => {
    if(loading) return;
    setLoading(true);
    try {
      const params = { q: '', use_sample: true };
      if(result && result.area) params.area = result.area;
      if(selectedPriceCol) params.price_col = selectedPriceCol;
      if(selectedDemandCol) params.demand_col = selectedDemandCol;
      const res = await axios.get(`${apiBase}/query`, { params });
      setResult(res.data);
      setMessages(prev => [...prev, {id:Date.now()+3, from:'bot', text: 'Updated analysis' + (res.data.area ? ` (${res.data.area})` : '')}]);
    } catch (e) {
      console.error('Refresh error', e);
      setMessages(prev => [...prev, {id:Date.now()+3, from:'bot', text: 'Failed to refresh with selected columns.'}]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4 app-root">
      <h2 className="mb-3">Sigmavalue — Mini Real Estate Chatbot</h2>
      <div className="row gx-4">
        <div className="col-lg-4">
          <div className="chat-window p-3">
            <MessageList messages={messages} />
            <ChatInput onSend={sendQuery} suggestions={areas} />
          </div>
        </div>
        <div className="col-lg-8">
          <ResultCard
            result={result}
            apiBase={process.env.REACT_APP_API_BASE || 'http://localhost:8000/api'}
            priceCols={priceCols}
            demandCols={demandCols}
            selectedPriceCol={selectedPriceCol}
            selectedDemandCol={selectedDemandCol}
            setSelectedPriceCol={setSelectedPriceCol}
            setSelectedDemandCol={setSelectedDemandCol}
            onRefreshSelection={refreshForSelection}
          />
        </div>
      </div>
    </div>
  );
}