import React, { useState } from 'react';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(''); setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setMsg('登录成功');
        // 可跳转主页等操作
      } else {
        setMsg(data.error || '登录失败');
      }
    } catch (err) {
      setMsg('网络或服务器错误');
    }
    setLoading(false);
  }
  return (
    <form onSubmit={handleSubmit} style={{maxWidth:400,margin:'0 auto'}}>
      <h2>登录</h2>
      <div><input name="username" placeholder="用户名" value={form.username} onChange={change} required /></div>
      <div><input name="password" placeholder="密码" type="password" value={form.password} onChange={change} required /></div>
      <button type="submit" disabled={loading}>{loading ? '登录中...' : '登录'}</button>
      {msg && <div style={{color: msg.includes('成功') ? 'green':'red'}}>{msg}</div>}
    </form>
  );
}
