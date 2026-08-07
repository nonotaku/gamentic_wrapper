# DAWN DEBT（g054347）進度報告

**日期** 2026-08-06 · **狀態** 可玩、美術無佔位圖 · **預算** 1,174 / 4,000cr 已用（1,144 綁咗 game ＋ 30 未綁）

<https://gamentic.net/play/g054347> · 編輯器 <https://gamentic.net/edit/g054347>

---

## 一、做咗啲乜

### 遊戲本體

一個「夜間拾荒 → 天光前撤離 → 交租」嘅 2D 橫向生存平台遊戲。核心循環：

1. **夜晚** — 入城搜物資，背囊有容量上限，殭屍靠**聲音**同**視線**搵你
2. **撤離** — 天亮倒數歸零前返到撤離口，唔返到就死
3. **收容所** — 交租；租每期加碼，逼你一晚比一晚行遠

已實作嘅系統：聲音傳播（跑步／潛行／落地／開槍／踩碎玻璃各有半徑）、視線偵測（含垂直視距同背後察覺）、受傷分級（完好 → 跛行 → 死）、藏身位、可開閘門、有限子彈、難度隨晚數爬升、四張場景背景輪換、標題／暫停／結算畫面、壞結局 CG。

### 美術（全部已上畫面，無佔位圖）

| 類別 | 內容 |
|---|---|
| 角色動畫（多幀） | `girl_run`、`girl_idle`、`girl_limp`、`zombie_walk` |
| 角色姿勢（單幀） | `girl_jump`、`girl_shoot`、`girl_hurt`、`girl_death`、`girl_grab`、`zombie_death` |
| 背景 | `bg_street`、`bg_metro`、`bg_indoor`、`bg_roof`、`bg_shelter` |
| 材質 | `tex_ground`、`tex_plank`（`tex_ledge` 已退役） |
| 佈景 | `prop_glass`、`prop_car`、`prop_drums`、`prop_rubble`、`prop_locker`、`prop_exit` |
| 其他 | `keeper`（收容所管理人）、`cg_bad_end`、封面 |

### 音效（已接線）

11 個 SFX ＋ 4 首 BGM，經 `engine.js` 嘅 `sfx()` / `playBgm()` 播放。

---

## 二、修好咗嘅真 bug

| 問題 | 成因 | 修法 |
|---|---|---|
| **殭屍跌穿地面** | 墜落速度上限 18 × 停頓幀（dt 上限 3）＝ 一步 54px，可以一步跨過下層地板頂而完全冇測試過佢 | 上限降到 12 ＋ 加 `_unstick()` 最後防線。實測 1500 幀零沉落 |
| **碎玻璃畫到同女主一樣高** | 按闊度縮放：194px 闊 × 3:2 原圖 ＝ 80px 高，變咗一幅玻璃牆 | 高度封頂 30px，闊度照鋪 |
| **平台讀成鏽色橫紋** | 用緊一幅「牆」貼圖，但平台只有 20px 高，切一條出嚟乜都唔剩 | 換棚板貼圖 ＋ pattern 縮到 0.11 ＋ code 畫板頭板尾同底部陰影 |
| **撤離點係綠色方框** | 從來冇出過圖 | `prop_exit` ＋ 暖色呼吸光暈（全遊戲唯一暖光） |

**學到嘅通則**（已寫入 spec）：

- 薄物件只留得住**水平特徵** —— 揀貼圖唔係揀靚唔靚，係揀「切成 20px 之後仲剩返啲乜」
- 地面散落物要**鎖高度**，唔可以由闊度推導
- 藏身位嘅**圖要畫得大過碰撞框**（＋34%）—— 貼住框剪會讀成木箱，大少少先讀成「入得去」

---

## 三、開支拆解

| 工具 | 次數 | Credits | 佔比 |
|---|---:|---:|---:|
| `sprite_animation` | 10 | **675** | **59%** |
| `character_sprite` | 10 | 150 | 13% |
| `generate_asset` | 17 | 136 | 12% |
| `generate_music` | 4 | 120 | 10% |
| `generate_sound` | 11 | 55 | 5% |
| `generate_cover` | 1 | 8 | 1% |
| 未綁 game（create_game 之前嘅 concept_art） | — | 30 | — |
| **合計** | | **1,174** | |

⚠ **動畫食咗接近六成預算，但最後只剩四張圖表上到畫面。** 10 次呼叫 ÷ 4 張成品 ≈ 每張 169cr。原因未查實（可能同名覆蓋，可能失敗重試）—— 呢個係下一步做動畫之前要搞清楚嘅數。

**餘額 2,826cr。**

### 追加：重出 run 動畫（2026-08-06，45cr）

Owner 要求重做。冇淨係翻擲同一鋪骰，四樣一齊調：

| 項 | 舊 | 新 |
|---|---|---|
| 底圖 | 不明 | `canon_run` (asset:ab38ac1fd21) —— 衫色已校正嗰版 |
| 幀數 | 6（推斷） | **8** |
| 尺寸 | 128px（推斷） | **256px**（hero 尺寸） |
| motion | — | 明確要求「一個完整步幅後回到原位，循環接得返」 |

結果：8 幀 × 256×256，面向左（同 `ART_FACES = -1` 慣例一致，唔使改 code），衫色同 canon 一致，去背乾淨。
片段實證 <https://gamentic.net/asset/a7eabc8814d.mp4>

⚠ **切幀邏輯係安全嘅**：`src/core/sheet.js` 由 `naturalWidth / naturalHeight` 推導幀數，冇寫死 —— 所以 6→8 幀直接落得，零 code 改動。呢個係當初寫 sheet.js 時嘅決定，今次省返一次 debug。

⚠ **耗時異常**：官方 ETA 講本地 30–60 秒，實際行咗約 **35 分鐘**（image → video → frames 三個階段都有推進，唔係卡死）。如果之後要批量出動畫，呢個時間要計入計劃。

### 追加：重出餘下三個動畫（2026-08-06，135cr）

Owner 落 goal「redo all the sprite animation」。全部四個 sprite 動畫已重出，統一規格：**canon 底圖 · 8 幀 · 256px · motion 明確要求循環接得返**。

| 動畫 | jobId | 面向 | 片段 |
|---|---|---|---|
| `girl_run` | `sjd4b91e356a` | 左 ✓ | <https://gamentic.net/asset/a7eabc8814d.mp4> |
| `girl_idle` | `sj6c13d82769` | 左 ✓ | <https://gamentic.net/asset/abdcd61d1a2.mp4> |
| `girl_limp` | `sjbdd865cba8` | 左 ✓ | <https://gamentic.net/asset/ad6eced5728.mp4> |
| `zombie_walk` | `sj273beaa3ed` | 右 ✓ | <https://gamentic.net/asset/a9c06e0ed38.mp4> |

⚠ **兩套面向慣例係相反嘅，唔可以撈亂**：

- `player.js` — `ART_FACES = -1`，翻轉條件 `this.face !== ART_FACES` → **女主原圖面向左**
- `zombie.js` — 翻轉條件 `this.face < 0` → **殭屍原圖面向右**

出動畫之前一定要先睇返 canon 底圖面向邊，唔係新表會倒後行。今次三個都對得上，零 code 改動。

⚠ **並行係贏嘅**：三個 job 一次過開，`stage` 同步推進（image → video → frames），證實冇排隊。三個並行約 55 分鐘，對比單一 job 35 分鐘 —— 串行做要成 105 分鐘。**以後批量出動畫一律並行開。**

⚠ **`zombie_walk` 有色偏未處理**：新表偏**綠**，但 canon_zombie 同 `zombie_death`（單幀，唔喺今次範圍）係**灰燼白**。玩家開槍打死殭屍嗰刻會見到由綠跳去灰。影響有限（死亡幀係淡出，只閃一下），但係一個真實嘅連戲缺口。三個選擇：接受（綠喺藍黑背景上對比更好）／重出 zombie_walk 指明灰燼白／改 `zombie_death` 就綠色。**未決定，等 owner。**

**更新後合計 1,354cr（1,324 綁 game ＋ 30 未綁），餘 2,646cr。**

---

## 四、未解決 / 未驗證

### 需要 owner 試玩先答到（我判斷唔到）

1. **殭屍識跳之後，高處仲係咪逃生路線？**
   呢個推翻咗原本「永遠爬唔返上去」嘅設計 —— 高處由**永久庇護所**變成**起步優勢**。其餘三條逃生路仍然完好（斷視線 2.5 秒、藏身位、追擊速度 2.8 < 跛行 3.45），所以公平性理論上冇塌。**如果玩落覺得無處可逃，第一個拉 `zombieJump` 到 0。**
2. **玻璃聲音倍率 ×2.2** —— 未評過手感
3. **地形 40px 高低差** —— 未評過手感
4. **撤離口盞燈隔遠望唔望到**

### 已知細節缺口

- `sfx_click`（UI 按鈕）同 `sfx_win` 生成咗但**冇任何呼叫點**，實際唔會響
- `sprite_animation` 用嘅 video model 具體型號未確認。**已查實嘅部分**：`check_model_3d` 個 payload 有 `evidence.videoModel: "local GPU engine"` —— 即係行本地 GPU 嗰條路，**MiniMax／Hailuo（external API fallback）排除咗**。平台仍然唔 report 型號名，所以 LTX-Video 只係推論（本地開源選擇嘅典型），未有直接證據。另註：`check_model_3d` 個 hint 提到 OpenArt historyId，所以流程某段可能行緊 OpenArt

### 工具警告要注意

`list_assets` 話「所有圖同音效都冇用過」—— **呢個係假警報**。偵測器只掃 `game.html` 入面嘅字面 `GAME_ASSETS.x`，但我哋嘅 code 喺 `src/` 度行間接查表（`Sheet.get()` / `A[name]`）。已用截圖同 `search_game_source` 驗證過真係上咗畫面同響緊。

同樣道理，`canon_run` / `canon_idle` / `canon_limp` / `canon_zombie` **本來就唔應該畫出嚟** —— 佢哋係動畫嘅輸入原圖，唔係繪製目標。

---

## 五、建議下一步（排咗序）

**1. Owner 試玩，回覆上面四條** — 呢個係樽頸。跟住落嚟嘅調整全部靠呢啲答案，冇答案就係盲摸。

**2. 補兩個音效呼叫點**（0cr）— `sfx_click` 接落 UI 按鈕，`sfx_win` 接落成功撤離／過關。

**3. 查實動畫成本**（0cr）— 搞清楚 675cr 買咗啲乜，順手喺 `check_model_3d` 個 payload 捉返 video model 個名。呢步做完先決定使唔使再落錢落動畫。

**4. 之後先考慮加碼**（餘 2,826cr）— 按性價比排：
   - 將現有單幀姿勢（`girl_jump` / `girl_shoot` / `girl_hurt`）升做多幀動畫 —— 但要等第 3 步確認單價
   - 殭屍變體（快嘅／慢嘅／大隻嘅），拉開難度層次
   - 好結局 CG（而家只有壞結局）
   - 語音（收容所管理人）
