import React, { useState } from 'react';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    apiKey: '',
    apiSecret: ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setMsg('注册成功！');
      } else {
        setMsg(data.error || '注册失败');
      }
    } catch (err) {
      setMsg('网络或服务器错误');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{maxWidth:400,margin:'0 auto'}}>
      <h2>注册新用户</h2>
      <div>
        <input
          placeholder="用户名"
          name="username"
          value={form.username}
          onChange={change}
          required
        />
      </div>
      <div>
        <input
          placeholder="密码"
          name="password"
          type="password"
          value={form.password}
          onChange={change}
          required
        />
      </div>
      <div>
        <input
          placeholder="币安API Key"
          name="apiKey"
          value={form.apiKey}
          onChange={change}
          required
        />
      </div>
      <div>
        <input
          placeholder="币安Secret Key"
          name="apiSecret"
          type="password"
          value={form.apiSecret}
          onChange={change}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? '注册中...' : '注册'}
      </button>
      {msg && <div style={{marginTop:12, color: msg.includes('成功')?'green':'red'}}>{msg}</div>}
    </form>
  );
}
