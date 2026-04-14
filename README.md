# FITAI Web

React + Vite + TypeScript + Tailwind CSS 打造的 AI 健身 / 營養追蹤儀表板。

## 功能

- **儀表板** — 心率折線圖、每週活動柱狀圖、連線裝置、快速動作
- **飲食紀錄** — 熱量圓環、三大營養素、飲水追蹤、AI 洞察、拍照辨識 + 搜尋 + 手動輸入
- **訓練計劃** — 週曆、動作展開、AI 生成計劃
- **AI Coach** — 聊天歷史 sidebar、建議 prompt、打字動畫、帶入營養 + 健康情境
- **上傳報告** — 拖曳 / 選檔 / PDF，AI 分析生物標記並色碼標記異常
- **個人檔案** — 頭像上傳、基本資料編輯、裝置切換、通知與隱私設定

## 技術堆疊

- React 18 + Vite 5
- TypeScript 5
- Tailwind CSS 3
- React Router 6 + Zustand (with persist) + React Query
- Recharts · Lucide Icons · Axios

## 本地開發

```bash
npm install
npm run dev
```

開啟 http://localhost:5173/

## 環境變數

複製 `.env.example` 為 `.env.local` 並填入 API URL：

```
VITE_API_URL=http://localhost:8000
```

若未設定或後端無法連線，所有畫面會自動退回到內建 mock 資料（含台灣常見 50 種食物）。

## 部署到 Vercel

此專案為 pure Vite SPA，Vercel 會自動偵測並使用 `vite build`。Build output 是 `dist/`。

在 Vercel 專案設定 → Environment Variables 加入：

- `VITE_API_URL` = 你部署的 FastAPI 位址
