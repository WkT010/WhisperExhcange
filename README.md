# Whisper Exchange (韦伯交易所)

## 功能简介（币安式风格）
- 登录、注册
- 实时现货/合约行情
- 充值（BNB/BTC/ETH/USDT-TRC20/USDT-BEP20/USDC-POLYGON）
- TradingView图表（自动适配国内可用方案）
- 余额初始化、C2C买币、链上充提币等

---

## 配置币安API密钥（仅需访问资产、下单、用户API时）

1. **复制 `.env.example`，重命名为 `.env`，并填写你的密钥：**
   ```
   BINANCE_API_KEY=你的币安API Key
   BINANCE_API_SECRET=你的币安Secret
   ```
2. `.env` 文件会被自动排除（不上传仓库），只需本地或部署服务器填写。
3. 
   - "实时行情" & K线图等公共API **无需密钥**
   - "下单/充值/提现/个人资产"等涉及你个人的数据时，**需要填写密钥**
4. 推荐用 [node-binance-api](https://github.com/jaggedsoft/node-binance-api) 库调用。

---

## TradingView 图表中国大陆可用方案

项目内已自动集成国内可用JS/CDN，若被墙将自动降级或提示使用Plotly等替代。问题仍未解决请联系维护者。

---

## 安全说明
- **密钥只写在��地.env。请勿上传密钥至Git。**
- 部署服务器需正确设置环境变量，否则部分API无法拉取私有数据。

---

## 联系
如有疑问/功能建议，可issue联系作者。
