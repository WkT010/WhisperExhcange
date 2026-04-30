const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// 用户注册已在前述代码

// 用户登录接口
router.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: '用户不存在' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: '密码错误' });

  // 简单 session 方式（需配合 express-session 中间件）
  req.session.userId = user._id;
  return res.json({ success: true, username });
});

module.exports = router;
