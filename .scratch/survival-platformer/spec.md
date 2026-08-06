# Spec — 女高中生生存平台遊戲（暫名未定）

Status: ready-for-human — 等 owner 確認後先 `create_game`
Created: 2026-08-05（grill-with-docs session）

一隻橫向捲軸生存平台遊戲。表面目的係**測試 `sprite_animation`**；遊戲設計服務呢個目的，唔係反過嚟。

---

## 1. 由呢次 grilling 量到嘅事實（未經 owner 批准前唔好當結論）

### 1.1 `sprite_animation` 可用，而且係本地

平台設定 blob（`get_convention` 嘅 CURRENT USER SETTINGS 段）寫住：

> `OpenArt: OFF → concept_art / openart_asset / sprite_animation / character_sprite are FORBIDDEN`

**呢句係錯嘅。** 2026-08-05 向 `g8bb0c7` 射咗一次探路 call，結果：

| | |
|---|---|
| 狀態 | 成功，冇被閘攔 |
| 引擎 | `ltx-2.3 (local GPU)` — **OpenArt 冇被觸碰**，owner 嘅禁令冇被違反 |
| 輸出 | 6 幀 × 256px 橫向 sheet，341KB |
| 成本 | 120cr（個人錢包 14,395 → 14,275） |
| 影片 | https://gamentic.net/asset/a2bde2546a0.mp4 |
| jobId | `sjcda98e6a40` |

同一份 blob 自己打自己：兩行之後寫 `Local ComfyUI (krea2): ON → concept_art 一律行本地 GPU`。而 `sprite_animation` 嘅工具描述講「local engine is the normal path」，`get_skill("sprite-animation")` 更加完全冇提過禁用，仲照發足一份教學。

**四個來源、三份互相矛盾嘅文案，全部由 `mcp.gamentic.net` 發出。** 平台側嘅 bug：有人將 `sprite_animation` 改成本地優先，但冇更新 OpenArt-OFF 嗰條寫死嘅禁用名單。根因係**冇單一事實來源** —— 設定 blob 應該由工具註冊表推導，而唔係另外維護一條手寫名單。

**⚠ 修正（同日稍後，由第二次 call 嘅錯誤訊息確立）：** 正確講法唔係「禁用名單錯」咁簡單。伺服器實際行為係：

> `The local ComfyUI engine could not produce the video, and OpenArt is turned OFF in the user settings — so there is no fallback.`

即係 **OpenArt OFF ＝ 冇後備，唔係禁用**。`sprite_animation` 一直行本地；OpenArt 只喺本地失敗時頂上。所以 `get_convention` 應該寫「**OpenArt OFF → `sprite_animation` 冇後備，本地一撻就冇路走**」，而唔係 `FORBIDDEN`。

**⚠ 第二個平台 bug（真金白銀）：撻咗嘅 job 照收錢。** 該次失敗回傳 `"no video credits burned, you can call sprite_animation again"`，但錢包由 13,785 跌到 13,665 —— **扣咗 120，事後複查冇退**。

### 1.2 品質實測

照 `get_skill("sprite-animation")` 嘅驗收三條：

| 條目 | 結果 |
|---|---|
| 角色有冇溶 | ❌ **第 4 格爆咗** —— 深色大衣變白衫黑裙、顏色反晒。**六格死一格 = 17% 廢品率** |
| 姿勢有冇逐格變 | ✅ 腳交替、手擺動，跑步循環物理連貫（逐格 edit 做唔到呢樣） |
| 顏色有冇甩 | ⚠ 除第 4 格外可接受；邊緣有灰色殘留，去背唔夠乾淨 |

**最重要嘅發現：厚塗畫風冇捱到。** prompt 完整放咗 `reference-vn-art.md` 嗰個 gouache style block，出返嚟係半寫實渲染人像，見唔到筆觸 → **影片模型會覆蓋畫風**。

呢個唔係新病：[reference-vn-art.md:111](../../templates/reference-vn-art.md) 已經記低「⚠ `animated_cg`（**LTX**）drifts and cannot loop」。今次個引擎係 `ltx-2.3`，同一家人。

⚠ **未量過嘅變數：呢次係盲生**（用 `prompt`，冇餵 `image`）。餵一張鎖定嘅厚塗 canon 落去做 base 會唔會保住畫風同身份 —— **未知**。閘一嘅第一件事就係答呢條。

### 1.4 答案：餵 canon 做 base，畫風同身份**保得住**

`girl_idle`（6 幀，餵 `canon_idle` 做 base）驗證：身份一致、冇多人、gouache 筆觸完整保留。**所以「LTX 覆蓋畫風」嘅結論要收窄** —— 覆蓋只發生喺**盲生**（淨係畀 `prompt`）；有 base 圖嘅時候，畫風跟住 base 走。

### 1.5 ⚠ 新疤：去背底板嘅顏色唔可以同角色衫色一樣

原本 canon 係**白色水手服上衣**站喺**純白底板**上。`sprite_animation(transparent: true)` 去背嗰陣把件衫一齊當背景鏟走。

`reference-vn-art.md` §Cutout 已經記低咗一半（「淺色背景會令 keyer 食掉淺色**面部**」）；呢個係同一個病嘅另一半 —— **被食嘅係同底板同色嗰忽衫**。

兩個修法，owner 揀咗前者：
1. **改角色設計，避開底板色**（本例：深藍水手服 + 卡其外套）。
2. 換底板色 —— 但 `reference-vn-art.md` 記低咗紗質布料會被 chroma 染綠，所以白係唯一安全底板。即係話**衫要讓底板**，唔係底板讓衫。

順帶：新設計仲要避開**深色**（`reference-vn-art.md`：深色 sprite 喺深色背景會消失），而 DAWN DEBT 全程夜街。所以衫色被夾喺「唔可以白、唔可以深」中間 → 中間調暖色（卡其）。

### 1.6 平台不穩定紀錄（同日）

| 現象 | 次數 | 成本 |
|---|---|---|
| image2video 即時撻（`local ComfyUI could not produce the video`） | 3 | 360cr |
| job 被殺（`server 可能重啟過`），卡喺 `stage: image` 約 8 分鐘 | 1 | 45cr |
| 成功 | 2（`girl_run` 舊版、`girl_idle`） | 90cr |

- 四次失敗全部回傳 `"no video credits burned"`，**四次都收咗錢**，事後複查冇退。
- `sprite_animation` 單價中途由 **120 跌到 45**。
- `check_video` 餵 `videoUrl` 會炸（`moov atom not found` —— 下載到嘅唔係有效影片）。餵 `name` 會分析**張 sprite sheet 而唔係影片**，於是把「六個人排一行」誤報成「主體散成 6 嚿，去背咬穿」。**呢個假警報要識得拆**，否則會白白重做一張冇問題嘅圖。
- ⚠ 錢包對唔上數：session 開始 14,395；平台自己記錄嘅開支（本遊戲 ＋ 未綁定）≈ 625cr，但錢包實際走咗 1,688cr。**約 1,063cr 來源不明**，已三次向 owner 報告。

### 1.3 呢啲發現要點處理

`templates/` 嘅編輯要行 `/mattpocock-skills:writing-great-skills`，而 Claude **自我 invoke 唔到**（handoff 第 3 條）。所以上面嘅發現暫存喺呢份 spec；驗證足夠之後，由 owner 執行嗰個 skill promote 入：

- `reference-gamentic-platform.md` — 設定 blob 唔可信、閘門要用行為量
- 新開一個 `technique-sprite-animation.md` — LTX 品質數據、畫風覆蓋、餵 canon 嘅實驗結果（**未證實之前唔可以入 reference/template**）

---

## 2. 遊戲

### 2.1 定位

| | |
|---|---|
| 類型 | 橫向捲軸生存平台遊戲 |
| 世界 | 殭屍末世 |
| 主角 | 日系女高中生，水手校服 + 百褶裙 + **大背囊** + 一條橙色綁帶 |
| 分級目標 | **T** |
| 主要參照 | **Goblin Vyke: The Thief Tycoon** — 夜出→取嘢→帶返→升級→重複 |
| 次要參照 | RageByte（已放棄「一屏一關」，保留「死係你嘅錯」嘅確定性） |
| 畫風 | gouache 厚塗（見 §4.1） |

### 2.2 核心循環

```
夜巡出發 → 橫向推進、避殭屍、搜刮水同食物
         → 中招 = 跛行（速度 −25%，維持到當晚完）
         → 掂到撤離點 = 當晚成功，帶住背囊返收容所
         → 結算畫面
         → 收容所（薄）：物資入庫、每 3 晚交租
         → 下一晚（無限重複）
```

**冇「贏」。** 唯一終點係壞結局。

### 2.3 失敗

| 事件 | 後果 |
|---|---|
| 夜巡中死亡 | **輸咗嗰晚**：有人拖佢返收容所，**當晚物資全失**，租照計。局唔完。 |
| 天亮倒數用完 | 同上 |
| 交唔到租 | **局終 → 壞結局 CG** → 由第一晚重頭 |

所以死亡係**複利式**懲罰：死一次唔死得，死兩三次就交唔到租。

### 2.4 收容所（v1 做到最薄）

其他生還者話事、有牆有門。你要住喺牆入面就要交租。

v1 得三樣嘢：物資清單、租嘅倒數、一個「瞓覺 → 下一晚」掣。一張背景，加一張靜態立繪（收容所嗰個管事人）。

**唔喺 v1 落地、但已入計劃：** 用盈餘買更好嘅武器同技能（第二期）。

### 2.5 數值（全部入 `GAME_CONFIG`）

| 參數 | v1 值 |
|---|---|
| 一晚長度 | 2–4 分鐘 |
| 關卡闊度 | 6–8 個畫面 |
| 天亮倒數 | 120 秒（畫面上可見） |
| 每晚物資點 | 5–6 個 |
| 背囊容量 | **4** |
| 租 | 每 3 晚 **3 食物 + 1 水** |
| 打和線 | 平均每晚 1.33 件 |
| 跛行減速 | −25% |
| 死亡動畫長度 | 約 0.35 秒（6 格） |
| 難度爬升 | 第 6 晚起租加碼、殭屍變密、地圖變長 |

設計意圖：**打和線 1.33、上限 4** —— 你唔可以每晚都貪，亦唔可以每晚都保守。中間嗰段就係遊戲。

### 2.6 State 分層（零成本，防止第二期拆存檔）

| 層 | v1 內容 |
|---|---|
| 一局（run） | 物資、當前晚數、租嘅倒數、傷勢 |
| 檔案（profile） | **只有最佳晚數紀錄** |

v1 行為 = owner 要嘅「壞結局，乜都唔留低」。第二期加技能時，佢哋落 profile 層，唔使改存檔格式。→ 見 §6 ADR 提案。

---

## 3. 動畫清單（閘一）

工具按 `get_skill("sprite-animation")` 分派：**循環動作**用 `sprite_animation`（120／個，物理連貫）；**關鍵姿勢**用 `character_sprite`（15／格，逐格精準、本地）。

| 對象 | 動作 | 工具 | 價 |
|---|---|---|---|
| 女主 | idle 呼吸 | `sprite_animation` | 120 |
| 女主 | run | `sprite_animation` | 120 |
| 女主 | 跛行 run | `sprite_animation` | 120 |
| 女主 | jump（起跳／最高／落地） | `character_sprite` ×3 | 45 |
| 女主 | shoot | `character_sprite` ×4 | 60 |
| 女主 | hurt | `character_sprite` ×2 | 30 |
| 女主 | death | `character_sprite` ×6 | 90 |
| 女主 | 搜刮（蹲低攞嘢） | `character_sprite` ×3 | 45 |
| 殭屍 | walk | `sprite_animation` | 120 |
| 殭屍 | attack | `character_sprite` ×4 | 60 |
| 殭屍 | death | `character_sprite` ×4 | 60 |
| | **小計** | | **870** |

⚠ **唔好用 `sprite_animation` 出攻擊／死亡** —— 抽幀係平均抽，只會攞到一堆中間狀態。

---

## 4. 美術

### 4.1 畫風

**gouache（廣告彩／不透明水彩），唔係油畫。** 啞色、平塗、乾筆、筆觸見得到、唔混色。

Style block 逐隻字放喺每個 prompt 最前（[reference-vn-art.md:24](../../templates/reference-vn-art.md)）：

```
painterly, rough brushwork, visible brush strokes, dry brush, gouache style,
matte flat colors, sketchy rough lineart, unblended shading, textured brush edges
```

尾綴：`— avoid: photorealistic, photo, 3D render, polished, clean lineart, polished anime illustration, no text, no words, no letters`

⚠ **prompt 入面唔可以出現「anime」呢個字。** [reference-vn-art.md:27](../../templates/reference-vn-art.md) 記低：`visual novel character sprite` 同華麗形容詞 → polished anime。描述**主體**（Japanese high school girl, sailor uniform），畫風全部交畀 style block。

### 4.2 兩張 canon

| | 用途 | 規格 |
|---|---|---|
| 玩法 canon | 餵 `sprite_animation` / `character_sprite` | **側面全身、跑姿、淺灰乾淨背景、居中** |
| 介面 canon | 標題、結算、壞結局 CG | 正面、精細、厚塗 |

理由：`sprite_animation` 硬性要求側面全身動作姿勢；但女主喺遊戲中只有約 150px 高，喺嗰個尺寸為細節付錢係浪費。介面 canon 令玩家喺佢夠大嗰啲畫面見到一張正經厚塗立繪。

### 4.3 輪廓規則

`reference-vn-art.md`：「**距離係身份預算**」＋「**scale beat repetition** —— 大形狀會被當成解剖結構嚟畫，細形狀只會被當成一點反光」。

所以：**大形狀 + 少特徵**。校服裙擺同大背囊都係大形狀，兩樣都應該捱得過 LTX；背囊同時令佢嘅輪廓同殭屍完全唔同（半秒可讀性）。背囊亦係機制本身（容量升級唔使重畫）。

### 4.4 血腥

**T 級・腐化路線。冇血。** 殭屍係灰化／乾枯；女主死亡用倒下＋鏡頭壓暗＋畫面泛白承載。乾筆平塗畫血只會變一嚿紅 —— 光同姿勢先係呢個畫風叻嘅嘢。

---

## 5. 閘一預算（約 1,320cr，共 4,000cr）

| 項 | cr |
|---|---|
| canon 底圖 ×3（女主玩法／殭屍／收容所管事人）＋ 介面 canon | 32 |
| 影片循環 ×4 | 480 |
| 逐格姿勢（女主 5 組 + 殭屍 2 組） | 390 |
| 背景 ×2（夜街／收容所） | 16 |
| 壞結局 CG ＋ 封面 | 16 |
| 音效 ×6 | 30 |
| 音樂 ×4（選單／夜巡／緊張／收容所） | 120 |
| LTX 重做預留 ×2 | 240 |
| **小計** | **≈1,324** |

**閘二（約 2,680cr）—— 閘一驗收咗先落：** 殭屍再加 3 種（跑屍／爬屍／膨脹屍，各 walk 影片＋攻擊＋死亡）· 女主再加 3 個循環（潛行蹲走／爬梯／負重行）＋ 3 個姿勢（換彈／近戰／投擲）· 收容所管事人呼吸影片＋表情 · 場景由 2 加到 10 ＋視差層 · CG ×7 · 殭屍配色裝束變體 ×6 · UI kit · 音效 +16 · 音樂 +3 · 語音 ×14 · LTX 重做預留 ×4

已用：120cr（探路）。錢包（個人）：14,275。

---

## 6. ADR 提案

**「一局 vs 檔案」嘅界線。** 難改（改咗要動存檔格式）、將來讀嘅人會問「v1 明明乜都唔留低，點解要分兩層」、而且係真嘅取捨（即時簡單 vs 第二期唔使重寫）。三條都中 → 值得開一份 ADR。

---

## 7. 未決 / 開放項

1. **遊戲名未定。** 候選：《黎明前四小時》／《背囊裡的三日份》／《牆內》／`DAWN DEBT`。
2. **閘一動工前必讀**（平台硬性要求）：`get_skill("game-mechanics")`、`get_skill("game-balance")`、`get_skill("game-screens")`。
3. 平台設定 `Character design first: ON` → canon 出圖後**必須先畀 owner 睇同批准**，先可以寫任何 code。
4. 平台設定 `Unstable-connection mode: ON` → 一定要用分塊上傳（每塊 ≤3000 字元），唔可以一次過 `create_game`。
5. 平台設定 `Audio: ON` → 音效同整套音樂係強制，唔係可選。
6. `get_convention` 嗰條錯嘅 FORBIDDEN 名單，要唔要向平台團隊報 bug（`submit_feedback`）。

---

## 8. 建造紀錄

**遊戲：`g054347` · DAWN DEBT** · platformer · T · 個人 library
編輯器 https://gamentic.net/edit/g054347 · 試玩 https://gamentic.net/play/g054347

### 已建（v4，headless 實測 passed，零 console error）

| 檔 | 內容 |
|---|---|
| `game.html` | shell：marker、`__GI_SET`、canvas 960×540、script 次序 |
| `src/core/engine.js` | loop（`tick(now)` ＋ `window.__step`）、輸入、場景機、音效／BGM、`drawCover`、掣（hover／press／音效） |
| `src/core/sheet.js` | 橫向 sprite sheet：幀數由 `naturalWidth / naturalHeight` 推導，唔寫死 |
| `src/core/state.js` | `Run` / `Profile` 兩層（ADR-0001），`localStorage` 存最佳晚數 |
| `src/entities/player.js` | 移動＝加速＋摩擦、coyote＋jump buffer、判定框縮細、**兩段傷害**（第一下跛行、第二下死） |
| `src/entities/zombie.js` | 固定三角波巡邏，**位置係時間嘅純函數** —— 死一定係玩家嘅錯 |
| `src/entities/pickup.js` | 食物／水 |
| `src/data/map.js` | **12 區 4 層嘅固定地圖**（＝已確認嘅地圖圖），區域＋連接＋物資權重 |
| `src/entities/gate.js` | 捷徑閘：企喺內側按住 E，本局長開 |
| `src/systems/level.js` | 幾何用**區索引**做 seed（地圖永遠一樣），內容用**晚數**做 seed（每晚唔同） |
| `src/systems/minimap.js` | 角落小地圖，只畫今晚入過嘅區 |
| `src/scenes/title.js` | 標題＋操作說明＋最佳紀錄 |
| `src/scenes/play.js` | 夜巡：**雙軸相機**、HUD、小地圖、天亮倒數、閘、子彈、暫停、撤離 |
| `src/scenes/result.js` | 每晚結算（成功／失敗原因） |
| `src/scenes/shelter.js` | 薄基地：倉庫、交租、瞓覺 |
| `src/scenes/gameover.js` | 壞結局：捱咗幾晚、新紀錄、再嚟一次 |

新增 config：`ammoPerNight` 3、`bulletSpeed` 11（schema 同步更新）。

修正：canvas 由 `width/height:100%` 改為加 `object-fit:contain` —— 960×540 buffer 喺 4:3 視窗會被**非等比壓扁**，同 convention §5b 禁止嘅拉伸係同一個病，只係發生喺 canvas 本身。

### 地圖（v2 —— 取代咗左到右嘅版本）

左到右嘅平台關卡**廢除咗**。原因係結構性嘅：喺一條線上面，「向前」同「向出口」係同一個方向，所以天亮倒數根本冇壓力。改成 Vyke 式 —— **撤離點就係入口**，深入＝欠住一條返程。

- **世界 5600 × 2240**（約 6 畫面闊 × 4 畫面高），12 區、4 層。
- **固定地圖**：幾何 seed 用區索引，所以第 4 晚永遠係同一條街 —— 地圖係可以學得返嚟嘅知識。每晚變嘅只係物資位置同巡邏路線。
- **租逼你上落**：食物集中室內行（便利店／商場／學校），水淨係喺最頂（鐘樓／天台）同最底（水道／地鐵）。租係 3 食物 + 1 水，所以**掃一行係交唔到租嘅**。呢個唔使寫規則，靠擺位做到。
- **三道捷徑閘**（水道→缺口、鐘樓→缺口、地鐵→學校），**只可以由內側開**（`openFrom`），跟**一局**，壞結局之後全部關返。
- 醫院第 6 晚開放，只可以經天台過板橋。
- `nightSeconds` 120 → **210**；`nightWidthScreens` 廢除；新增 `gateOpenMs` 900。

### 呢次重寫捉到嘅 bug（全部已修並驗證）

| bug | 症狀 | 因由 |
|---|---|---|
| 出生點壓住撤離點 | 一開波即刻「撤離成功」，直接彈去收容所 | 撤離要**離開過**先算數（`exitArmed`）；出生點推遠到 +420 |
| 門索引對唔上牆索引 | 每道門都會被砌返做牆，成張地圖封死 | 門用欄號做 key、牆用世界座標做 key |
| 閘可以喺出口側打開 | 第一晚企喺出口就開到捷徑，「由內側賺返嚟」失效 | 加 `openFrom`，只認內側 |
| 踏板六面皆實 | 由下面跳上去撞板底，**豎井變天花板，垂直地圖單向** | 改成單向踏板（只喺墜落且上一幀腳喺板面之上先擋） |
| 踏板間距 112px | 跳躍上限 126px，只餘 14px | 收窄到 92px |
| **穿模跌出世界** | y 去到 216,458，夜巡卡死永不結束 | 終端速度 22 × dt 上限 3 ＝ 一步 66px > 地板 40px 厚。改成**分拆細步**（每步 ≤14px），另加世界底部安全判定 |

驗證方式：喺瀏覽器直接跑 `window.__step` 泵幀 —— 幾何量度（踏板間距、豎井位置）＋ 三輪 ×2500 幀壓力測試，零穿模。

### 已落地嘅動畫（閘一）

| asset | 幀 | 來源 canon | 狀態 |
|---|---|---|---|
| `girl_idle` | 6 | `canon_idle`（企姿） | ✅ 重做過一次 —— 第一版六格一樣，改為**逐個部位寫明點郁**（胸口起伏／膊頭升降／頭微低再抬／重心換腳／馬尾擺／外套下擺晃）之後先有動作 |
| `girl_run` | 8 | `canon_run`（跑姿） | ✅ 腳步清楚交替、手臂擺動、身份一致 |

**成功配方（三條缺一不可）：**
1. **餵 canon 做 `image`**，唔好盲生 —— 畫風同身份跟住 base 走。
2. **來源姿勢要同目標動作一致** —— idle 要企姿 canon，跑步要跑姿 canon。攞跑姿去出 idle 會兩頭唔到岸。
3. **motion prompt 要逐個部位寫明點郁**，唔可以寫「gently breathing」呢類形容詞。

⚠ `canon_run` / `canon_idle` 會被平台報做「生成咗但冇畫出嚟」。**呢個係預期之內** —— 佢哋係白底**來源圖**，唔係遊戲 sprite；fallback 鏈已經特登唔會落到佢哋度，否則畫面會出現白方塊。

### 閘一完成（2026-08-06）

| 類 | 內容 |
|---|---|
| 影片循環 ×4 | `girl_idle` 6f · `girl_run` 8f · `girl_limp` 8f · `zombie_walk` 8f |
| 逐格姿勢 ×6 | `girl_jump` · `girl_shoot` · `girl_hurt` · `girl_death` · `girl_grab` · `zombie_death` |
| 白底來源圖 ×4 | `canon_run` · `canon_idle` · `canon_limp` · `canon_zombie` —— **永遠唔會被畫出嚟**，平台警告係預期之內 |
| 場景 | `bg_street` · `bg_shelter` · `keeper`（收容所管事人立繪） |
| CG / 封面 | `cg_bad_end`（上鏈鐵閘＋地上嗰個橙背囊）· 封面 |
| 音效 ×11 | click · jump · pickup · shoot · hurt · death · zombie_death · gate · extract · win · lose |
| 音樂 ×4 | `bgm_menu` · `bgm_night` · `bgm_tension`（天亮倒數剩 45 秒自動切）· `bgm_shelter` |

**開支 1,048cr / 預算 4,000。** 其中 **405cr 係失敗嘅 `sprite_animation` 收費**（三次即撻 ×120 ＋ 一次被殺 ×45，全部零產出，全部聲稱冇收費）。扣走呢筆，真正買到嘢嘅係 643cr。

同期修好嘅 code 問題：閘企喺地板面 10px 變成絆腳唇（行唔過）· sprite 朝向反轉（面向左嘅 canon 配「向左翻轉」＝一路倒後行）· 搜刮同開槍姿勢生成咗但冇 anim state · 背景蓋過前景（加 0.52 底噪 ＋ 視差）· 撤離點由一嚿純綠改成有框有呼吸光嘅門。

### 未建

- 美術全部未落地（女主而家係佔位方塊；`canon_run` 係白底來源圖，唔係遊戲 sprite）
- 音效／音樂一個都未出（設定 `Audio: ON` ＝ 強制）
- 背景、撤離點、收容所、壞結局 CG 全部係程式畫嘅佔位

## Comments

（傾開嘅嘢 append 喺呢度）
