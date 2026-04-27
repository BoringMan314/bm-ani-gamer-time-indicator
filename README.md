# [B.M] 動畫瘋 +90秒 進度標記

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)](https://developer.chrome.com/docs/extensions/mv3/)
[![Site](https://img.shields.io/badge/site-ani.gamer.com.tw-5865F2)](https://ani.gamer.com.tw)
[![GitHub](https://img.shields.io/badge/GitHub-bm--ani--gamer--time--indicator-181717?logo=github)](https://github.com/BoringMan314/bm-ani-gamer-time-indicator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

適用於 [巴哈姆特動畫瘋](https://ani.gamer.com.tw)（`ani.gamer.com.tw`）的瀏覽器擴充功能：在播放器進度條顯示「目前時間 + 90 秒」黃色標記，並提供快轉 90 秒的快捷鍵。

*在巴哈姆特动画疯（`ani.gamer.com.tw`）播放器进度条显示「当前时间 +90 秒」黄色标记，并提供快转 90 秒快捷键。*<br>
*Bahamut Anime Crazy（`ani.gamer.com.tw`）の再生バーに「現在時刻 +90 秒」の黄色マーカーを表示し、90 秒スキップのショートカットを提供します。*<br>
*Shows a +90s yellow marker on the player progress bar and provides a 90-second skip shortcut on Bahamut Anime Crazy.*

> **聲明**：本專案為第三方輔助工具，與動畫瘋／巴哈姆特官方無關。使用請遵守該站服務條款與著作權規範。

---

![擴充功能示意圖（進度條 +90 秒黃色標記）](screenshot/screenshot_1280x800.png)

---

## 目錄

- [功能](#功能)
- [系統需求](#系統需求)
- [安裝方式](#安裝方式)
- [本機開發與測試](#本機開發與測試)
- [技術概要](#技術概要)
- [專案結構](#專案結構)
- [版本與多語系](#版本與多語系)
- [隱私說明](#隱私說明)
- [維護者：更新 GitHub 與 Chrome 線上應用程式商店](#維護者更新-github-與-chrome-線上應用程式商店)
- [授權](#授權)
- [問題與建議](#問題與建議)

---

## 功能

- 在播放器進度條顯示「目前時間 +90 秒」的黃色標記，幫助快速預判片頭／片尾時機，並提供快轉 90 秒的快捷鍵。
- 支援兩種快轉方式：固定單鍵 `S`（僅在未自訂擴充快捷鍵時啟用；留言輸入框內不觸發），與 `chrome://extensions/shortcuts` 可自訂命令快捷鍵（`skip90`）。
- 僅在 **`https://ani.gamer.com.tw/*`** 載入，不請求其他網站權限。

---

## 系統需求

- **Chrome** 或 **Microsoft Edge**（Chromium）等支援 **Manifest V3** 的瀏覽器。

---

## 安裝方式

### 從 Chrome 線上應用程式商店（建議）

請在 [Chrome Web Store](https://chromewebstore.google.com/) 搜尋 **「[\[B.M\] 動畫瘋 +90秒 進度標記](https://chromewebstore.google.com/detail/bm-%E5%8B%95%E7%95%AB%E7%98%8B-+90%E7%A7%92-%E9%80%B2%E5%BA%A6%E6%A8%99%E8%A8%98/kbhbclfechhhdeanffaoihjhpfnjcljm?hl=zh-TW)」**，或點擊名稱從商店頁面安裝。

### 從原始碼載入（開發人員模式）

1. 點選本頁綠色 **Code** → **Download ZIP** 解壓，或執行 `git clone https://github.com/BoringMan314/bm-ani-gamer-time-indicator.git` 複製本倉庫。
2. 以 **Chrome** 或 **Microsoft Edge** 開啟 `chrome://extensions`（在 Edge 為 `edge://extensions`）。
3. 開啟「**開發人員模式**」→「**載入未封裝項目**」→ 選取含 [`manifest.json`](manifest.json) 的**專案根目錄**（勿選子資料夾）。
4. 開啟動畫瘋任一有影片的頁面，重新整理後檢查進度條是否出現黃色標記。

---

## 本機開發與測試

修改 [`content.js`](content.js) 或 [`background.js`](background.js) 後，在 `chrome://extensions` 將本擴充**重新載入**，再重新整理動畫瘋分頁驗證。

---

## 技術概要

- **內容腳本** [`content.js`](content.js)：監看並綁定播放器 `<video>`，計算 `currentTime + 90` 位置更新標記；接收 `{ type: "skip90" }` 訊息執行快轉，並在未自訂命令快捷鍵時提供固定單鍵 `S`。
- **背景腳本** [`background.js`](background.js)：監聽 `chrome.commands.onCommand` 的 `skip90` 並轉發到目前分頁；以 `chrome.commands.getAll()` 判斷命令是否被自訂，控制固定單鍵是否停用。

---

## 專案結構

| 路徑 | 說明 |
|------|------|
| [`manifest.json`](manifest.json) | Manifest V3 設定、命令快捷鍵、多語系鍵值 |
| [`content.js`](content.js) | 進度條標記與頁面內快捷鍵行為 |
| [`background.js`](background.js) | `commands` 指令與快捷鍵狀態判斷 |
| [`_locales/`](_locales/) | 多語系字串（`zh_TW`、`zh_CN`、`ja_JP`、`en_US`） |
| [`privacy-policy.html`](privacy-policy.html) | 隱私權政策（上架商店所需之公開網頁） |
| [`icons/`](icons/) | 工具列與商店用圖示：icon.png |
| [`screenshot/`](screenshot/) | 商店與說明用截圖 |

---

## 版本與多語系

- **版本**：以 [`manifest.json`](manifest.json) 的 `version` 為準。
- **預設語系**：`zh_TW`（`default_locale`）。
- **內建語系**：`zh_TW`、`zh_CN`、`ja_JP`、`en_US`（路徑為 `_locales/<code>/messages.json`）。實際顯示依瀏覽器語系與遞減規則。

---

## 隱私說明

本擴充**不蒐集、不上傳**可識別個人之帳戶或瀏覽內容；**未內建**遠端可執行程式、分析或廣告追蹤。詳見 [`privacy-policy.html`](privacy-policy.html)。

**上架提醒**：若上架 Chrome Web Store，須在開發人員後台完成隱私實踐聲明，並提供本政策之**公開 HTTPS 網址**（建議以 [GitHub Pages](https://pages.github.com/) 託管專案內的 `privacy-policy.html`）。

---

## 維護者：更新 GitHub 與 Chrome 線上應用程式商店

### 更新至 GitHub

**Bash / Git Bash / PowerShell：**

```powershell
git add .
git commit -m "docs: 更新內容說明與商店連結"
git push origin main
```

### 更新至 Chrome 線上應用程式商店

請透過 [Chrome Web Store 開發人員控制台](https://chrome.google.com/webstore/devconsole) 手動上傳更新：

1. **遞增版本**：修改 `manifest.json` 中的 `version`（例如從 `0.1.0` 提升至 `0.1.1`）。
2. **封裝套件**：將專案內容壓縮為 ZIP 檔。
   - **必要檔案**：`manifest.json`, `content.js`, `background.js`, `privacy-policy.html`, `icons/`, `_locales/`
   - **建議不打包**：`.git/`, `.gitignore`, `README.md`, `screenshot/`, `*.psd`, `*.zip`, `*.url`
3. **上傳審核**：在控制台選擇項目 →「套件」→「上傳新套件」。
4. **提交送審**：確認版號、商店文案、截圖、隱私欄位與 `privacy-policy` 公開網址無誤後，點擊「**提交送審**」。

---

## 授權

本專案以 [MIT License](LICENSE) 授權。

---

## 問題與建議

歡迎透過 [GitHub Issues](https://github.com/BoringMan314/bm-ani-gamer-time-indicator/issues) 回報錯誤或提出改善建議。回報時請一併提供瀏覽器版本、**介面語言**及重現步驟。
