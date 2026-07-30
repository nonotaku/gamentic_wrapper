# template-dating-horror-vn — v2 (genre-flow skill)

**This is a 手法 (technique) pack, NOT a script.** Nothing below is canonical content — every example is illustrative. Reuse the FLOW, the SYSTEMS and the ART ECONOMY; invent the content fresh per game. Inspired by the market signals of *How to Date an Entity* (itch.io 4.7★/1,389 — `data/analysis/itch_1i76fbh.md`) and genre conventions; production recipes proven on `g96d22c` (Tea with the Godmother). Built on the Gamentic `visual-novel` runtime — write ONLY `GAME_DATA`.

## When to use
Dating-sim × horror/mystery VN: "survive the encounter with an entity", monster romance, analog-horror narrative. One run 12–20 min, replay for other routes.

---

## 1. Game-flow skeleton (the "always" structure)

```
主選單 → 序章 Prologue → 第一次見面 → 互動場景×N (狀態累積)
      → 【route split】 → 路線場景 → 結局 → 結算畫面
```

**主選單手法:** `start` label = [bg, bgm, choice] only — NO dialogue before the menu (boot-into-dialog reads as unfinished). Rows: Start / How to play / Settings-style rows (⚙ 語言, text speed) / [Load & Gallery when the runtime exposes them]. Menu rows that set state must goto tiny setter labels (see §6 bilingual pattern).

**序章手法 (no fixed scenes — pick an APPROACH per game):**
- 目的：交代「玩家係邊個、點解喺度」，先立常態或即刻打破常態；**主角色未正式出場**（剪影、聲音、影都得——吊住先）。
- 三個手法家族（每隻 game 三揀一，內容自創）：
  - **Arrival** — 你點樣嚟到呢個地方（信件／搬屋／迷路／被邀請）
  - **Incident** — 一件事打破日常，你被捲入
  - **Cold-open** — 夢境／結局一閃嘅倒敘，再跳返開頭（懸念鉤）
- 構成技巧：旁白 4–6 拍 + 2–3 張 CG／bg 轉場；**一分鐘內入正題**；結尾一定停喺「第一次見面」嘅門檻上（一道門、一張空櫈、一個影）。
- 進階：序章埋低第一個 route flag（「你帶咗咩嚟」「你點解應門」）——玩家未見到角色已經開始寫自己條路。

**第一次見面手法:** 序章鋪完先俾佢出場——出場本身要係一個 event（CG 或 slideshow，見 §6），唔係「畫面一開佢就企咗喺度」。

---

## 2. Two-layer status system (手法, not fixed stats)

| 層 | 係咩 | 邊啲互動餵佢 |
|---|---|---|
| **數值層** | 一條好感/信任/恐懼值（每隻 game 改名改意義） | 主要由對話選擇加減 |
| **路線層** | 質性 flags——「你係一個點樣對佢嘅人」 | 主要由非對話互動種落嚟 |

**互動動詞手法**（全部用 choice-menu 實現；真・畫面熱點見 §7 wishlist）——每個場景混搭 2-3 種，唔好齋對話：
- **對話選擇** — 標準三揀一 → 餵數值層
- **環境互動** — 「你望向邊度？／你掂邊樣？」（佢嘅手・茶杯・窗外・唔掂）→ 種 route flags
- **學習** — 問佢問題、檢查物件得到資訊 → knowledge flags，解鎖後面先出現嘅 `if`-gated 選項（玩家會發現「識多啲嘢先揀到呢個」）
- **給予／接受** — 俾嘢佢、接唔接佢遞嚟嘅嘢 → 數值＋flag 混合

**接線鐵律：** 每一個互動都必須寫低啲嘢（`add` 或 `set`）——冇後果嘅互動係假互動。數值變化要喺兩拍之內有可見反應（§4）。

---

## 3. Routes & endings — default SMALL

- **Default：一個中段 route split → 2–3 條路線；每條路線 ~2 個結局（總數 4–6）。**起步唔使多——加結局係上線後嘅 content patch，唔係 launch 條件。
- 判定次序：**route flags 決定入邊條線**（質性）→ 線內用**數值層決定攞邊個結局**（好/壞）。唔好用一條數軸切晒所有結局（單軸=玩家感覺「儲分」；分線=玩家感覺「我嘅選擇塑造咗故事」）。
- 每個結局：命名＋一句尾聲＋「X of N endings」replay 提示。永遠唔好裸 "Game Over"。
- 隱藏結局（可選）：跨路線條件（例：三個 knowledge flags 齊）——一個就夠。

---

## 4. Art economy — the choice must be SEEN

**距離狀態機手法（核心）：** 角色有 遠(全身)／中(半身)／近(特寫) 三個 tier——**同一張原圖 krea-edit 裁切**出嚟（一致性零風險）。選啱→行近一格；選錯→退一格或轉身。**距離就係玩家見到嘅 meter**——唔使顯示數字，都唔使靠估。

- 表情組（6 個，見 §6）喺三個 tier 共用；`show` 換 key＋pos 即成。
- **每 scene 美術預算：** 1 bg（＋1 "wrong" 變體可選）＋距離 tier 組＋轉折位 1 張 key CG ≈ **每 scene 新圖 3–5 張**，其餘全部 reuse。
- **回饋鐵律：** 每個有意義嘅選擇，兩拍內必有可見變化（距離／表情／bg／道具／震動＋音效）。玩家一眼知道「頭先嗰下計咗數」。
- 大轉折先用 key CG，日常拍子用 sprite 換位——CG 係重拍，唔好通脹。

---

## 5. Numeric defaults (starting points — tune in the editor, not canon)

數值層 start 50（range 0–100 概念）；安全選擇 ±5；大膽選擇 ±12；災難選擇 −25（**必須用語氣預警**，配 `shake`＋`sfx_sting`＋bg 變體）。每章 8–12 拍、互動 2–3 個；3 章 ≈ 12–18 分鐘。危險 tell：數值低過 ~30 → hollow 表情＋`bgm_tension`；高過 ~65 → pleased。

---

## 6. Platform production recipes (PROVEN on g96d22c — keep these verbatim)

**Runtime contract:** shell = `GAME_CONFIG {textSpeed}` + `GAME_ASSETS/GAME_AUDIO/GAME_DATA` markers + `// __GI_VN_RUNTIME__`; title & endings are script labels; theme via `GAME_DATA.theme`（square `boxImage` 會令文字錯位 → 用 theme 色彩自砌）。Balance 喺 script data（劇本 panel／`write_data` 改）。

**Art recipe v2:** 角色 = 人形美先行、恐怖做細節（faint third-eye 級數）；style keywords 原文行頭：`painterly, rough brushwork, visible brush strokes, dry brush, gouache style, matte flat colors, sketchy rough lineart, unblended shading, textured brush edges`；negative 用後綴 `— avoid: photorealistic, photo, elderly, wrinkles, 3D render, polished, clean lineart`。Workflow：`concept_art` ×4 → 用戶揀 → `import_asset` 原圖做 base（唔好 re-roll）→ krea-edit 出變體。Prompt 陷阱：`visual novel character sprite`/靚字眼→拋光動漫；`character sheet`→幻覺相框；`mature female` 單獨用→老年。用戶貼參考圖 1–2 輪收斂；純文字 5 輪。

**Cutout：** 淡色/有紋理背景會食咗淡色面 → 先 krea-edit `change the background to pure flat white` 再 key；唔好用綠幕（薄紗染綠）。

**表情變體：** 同一張白底原圖 + MINIMAL-DELTA prompt（「keep her EXACT same face shape … change nothing else」）；大動作描述會令 krea-edit 重畫塊面。

**Restyle 環境配角色：** img2img 唔好 fresh gen——title 由角色原圖出（keeps identity；square cover-crop OK）；bg 由現有 approved bg 出；將角色嘅紅色 accent 帶入環境（紅簾/紅茶）令全 game 一個 palette；overt horror 只放喺 bg_wrong。

**出場 CG slideshow：** 4 幀 = 4 個獨立 two-image compose（image1=同一張空房 bg、image2=角色原圖），每幀 prompt 逐項寫明身份特徵＋"only one woman in the room"；唔好 chain-edit（「move her」會複製人）；人物 mid-shot 或以上；pin 場景道具同左右位置。

**雙語 EN+zh-TW：** 每句 say 孖生（`if:"!lang_tw"`／`if:"lang_tw"`）；TW 名牌用第二個 character id；語言 row goto 細 setter label（`set_tw`=[set, goto start]）——唔好靠 option 上 set+goto 同行；複合條件未documented → clone label 拆兩個 stacked goto；寫完必 audit CJK（embed URL + `VN.flags`/`VN.goto()`/`VN.S` headless 驗證）。

**編輯：** script 一律 `read_data`/`write_data`（HTML 幾 MB base64）；`write_data` object 值會變字串（bug）→ 逐欄位寫或用 `edit_game` find/replace 做批量；chunked upload ≤3000 chars。

**Audio：** `bgm_main`＋`bgm_tension` 同一音色家族；sfx click/choice/sting/道具聲。

---

## 7. Runtime wishlist (platform extensions this genre wants)

1. **熱點互動模式** — 真・點擊畫面部位（而家用 choice-menu 模擬）
2. **結局圖鑑持久化** — localStorage gallery + menu 入口
3. **主選單 Load/Settings hooks** — runtime save/load 露出去 menu label 用
