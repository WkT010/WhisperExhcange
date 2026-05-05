import React, { useState, useEffect } from 'react';

function TabSwitcher({tab, setTab}) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: 8 }}>
      <button onClick={()=>setTab('spot')} style={{background:tab==='spot'?'#ffe29b':'#eee'}}>现货</button>
      <button onClick={()=>setTab('futures')} style={{background:tab==='futures'?'#ffe29b':'#eee'}}>合约</button>
    </div>
  );
}

function SymbolSelector({ symbol, setSymbol, symbols }) {
  return (
    <select value={symbol} onChange={e => setSymbol(e.target.value)}>
      {symbols.map(s => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}

export default function Trade() {
  const [tab, setTab] = useState('spot');
  const [symbol, setSymbol] = useState('BTCUSDT');
  const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];
  const [depth, setDepth] = useState(null);
  const [kline, setKline] = useState([]);
  const [ticker, setTicker] = useState({});
  const [side, setSide] = useState('BUY');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const query = tab==='spot' ? '' : '/futures';
    fetch(`/api/binance${query}/ticker?symbol=${symbol}`).then(res=>res.json()).then(setTicker);
    fetch(`/api/binance${query}/depth?symbol=${symbol}&limit=10`).then(r=>r.json()).then(setDepth);
    fetch(`/api/binance${query}/klines?symbol=${symbol}&interval=1m&limit=60`).then(r=>r.json()).then(setKline);
  }, [symbol, tab]);

  async function submitOrder(e) {
    e.preventDefault();
    setMessage('');
    const api = tab === 'spot' ? '/api/binance/order' : '/api/binance/futures/order';
    const params = {
      symbol, side,
      type: 'LIMIT',
      timeInForce: 'GTC',
      price, quantity: qty
    };
    const res = await fetch(api, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      credentials: 'include',
      body: JSON.stringify(params)
    });
    const data = await res.json();
    setMessage(data.error ? (`下单失败: ${data.error} ${data.details?.msg||''}`) : '下单成功<br/>'+JSON.stringify(data));
  }

  return (
    <div style={{maxWidth:900,margin:'0 auto',background:'#232323',padding:16,borderRadius:8,color:'#ffe29b'}}>
      <TabSwitcher tab={tab} setTab={setTab}/>
      <SymbolSelector symbol={symbol} setSymbol={setSymbol} symbols={symbols}/>
      <h3>最新价: {ticker?.price || '--'}</h3>
      <h4>盘口深度</h4>
      <table style={{width:'100%',marginBottom:16}}>
        <thead>
          <tr><th>买盘</th><th>数量</th><th>卖盘</th><th>数量</th></tr>
        </thead>
        <tbody>
        {
          !depth ? null :
          Array.from({ length: Math.max(depth.bids.length, depth.asks.length) }).map((_,i) => (
            <tr key={i}>
              <td style={{color:'green'}}>{depth.bids[i]?.[0] || '--'}</td>
              <td>{depth.bids[i]?.[1] || ''}</td>
              <td style={{color:'red'}}>{depth.asks[i]?.[0] || '--'}</td>
              <td>{depth.asks[i]?.[1] || ''}</td>
            </tr>
          ))
        }
        </tbody>
      </table>
      <form onSubmit={submitOrder} style={{marginBottom:24}}>
        <h4>{tab==='spot'?'现货':'合约'}快速下单</h4>
        <select value={side} onChange={e=>setSide(e.target.value)} style={{marginRight:6}}>
          <option value='BUY'>买入</option>
          <option value='SELL'>卖出</option>
        </select>
        <input placeholder='价格' value={price} onChange={e=>setPrice(e.target.value)} required />
        <input placeholder='数量' value={qty} onChange={e=>setQty(e.target.value)} required />
        <button type='submit'>下单</button>
        {message && <div style={{color:message.startsWith('下单成功')?'green':'red',marginTop:8}} dangerouslySetInnerHTML={{__html:message}} />}
      </form>
      <h4>K线 (1min, 最近1小时)</h4>
      <div style={{background:'#18181a',height:200,overflowX:'scroll',whiteSpace:'nowrap'}}>
        {
          kline && kline.map?.((k,i)=>(
            <div key={i} style={{
              display:'inline-block',height:180,
              borderLeft:`2px solid ${Number(k[4])>Number(k[1])?'#16d358':'#ff2121'}`,
              marginLeft:2,verticalAlign:'bottom'
            }} title={`开:${k[1]} 收:${k[4]}`}>
              <div style={{height:Math.abs((k[4]-k[1])/k[1])*160+8}} />
            </div>
          ))
        }
      </div>
    </div>
  );
}
