const express = require('express');
const router = express.Router();
const Binance = require('node-binance-api');
const User = require('../models/User');

// 查询当前登录用户币安账户资产
router.get('/api/binance/account', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: '未登录' });
  const user = await User.findById(userId);
  if (!user) return res.status(401).json({ error: '未登录' });
  const binance = new Binance().options({
    APIKEY: user.binanceApiKey,
    APISECRET: user.binanceApiSecret
  });
  try {
    const account = await binance.accountInfo();
    res.json(account);
  } catch (e) {
    res.status(500).json({ error: '币安API异常', details: String(e) });
  }
});

module.exports = router;
