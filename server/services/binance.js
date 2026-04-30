const { BINANCE_API_KEY, BINANCE_API_SECRET } = require('../config/binance');

// 推荐使用 node-binance-api 库
const Binance = require('node-binance-api');

const binance = new Binance().options({
  APIKEY: BINANCE_API_KEY,
  APISECRET: BINANCE_API_SECRET
});

module.exports = binance;
