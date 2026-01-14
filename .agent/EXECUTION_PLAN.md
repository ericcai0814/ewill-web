# ewill-web 專案執行計畫

**版本**: v1.0
**建立日期**: 2026-01-12
**適用情境**: 新 AI 協作者首次進入專案或開始新任務

---

## Phase 0: 文件發現與系統理解（必讀階段）

### 目標
建立對專案架構、技術棧、開發規範的完整理解,確保後續實作符合專案慣例。

### 必讀文件清單

#### 1. 專案概覽（5 分鐘）

```bash
# 快速理解專案性質
cat README.md          # 專案概述、目錄結構、快速開始
cat CONTEXT.md         # 當前狀態快報
git status             # 確認當前分支與狀態
git log --oneline -10  # 查看最近的 commit 風格
```

**預期產出**:
- [ ] 確認專案類型: 網站內容庫 / SEO 資料源
- [ ] 確認技術棧: TypeScript, Nuxt 3, Python
- [ ] 確認當前分支: DEV (主分支: master)
- [ ] 確認文件系統: 三層架構 (根目錄/.agent/.claude)

#### 2. 開發規範（10 分鐘）

```bash
# 理解協作規範
cat .claude/CLAUDE.md        # AI 協作行為準則（壓縮版）
head -50 GUIDELINES.md        # 開發維護指南前言
tail -100 GUIDELINES.md       # Commit message 規範
```

**預期產出**:
- [ ] 理解核心原則: 文件同步、Commit 確認、不破壞性操作
- [ ] 理解同步啟發式: 何時需更新 README/CONTEXT/decisions/learnings
- [ ] 理解 Commit 格式: `<type>(<scope>): <subject>`
- [ ] 確認禁止操作: 刪除、覆蓋、URL 變更需人類確認

#### 3. 可用工具與自動化（5 分鐘）

```bash
# 查看可用指令與技能
cat .claude/commands/README.md   # Commands 索引
ls -la .claude/skills/           # Skills 清單
cat .agent/README.md             # SOP 索引
```

**預期產出**:
- [ ] 確認 6 個 Commands: check_assets, check_docs, seo_audit, gen_image_meta, update_doc, eval_architecture
- [ ] 確認 5 個 Skills: content-build, doc-sync, sop-consistency, web-crawler, run-log
- [ ] 確認 8 個 SOP: 00-05 工作流程 + guide
- [ ] 確認 5 個維護腳本: find_undescribed.py, fix-yml-metadata.py 等

#### 4. 專案特定慣例（按需讀取）

**內容結構**:
```bash
# 理解雙檔案系統
ls -la pages/logsec/             # 範例目錄
cat pages/logsec/index.yml       # YAML 元資料範例
cat pages/logsec/index.md        # Markdown 內容範例
cat pages/logsec/assets/*.yml    # 圖片描述檔範例
```

**命名規範**:
```bash
# 從實際檔案學習命名慣例
grep -r "url_mapping:" pages/*/index.yml | head -5  # URL kebab-case
ls -d pages/*/                                       # 目錄 snake_case
```

### 文件發現產出

建立「允許使用的 API/模式清單」:

```markdown
## 允許的檔案結構模式

**來源**: pages/logsec/ (已驗證範例)

pages/{name}/
├── index.md              # 內容（人工編輯）
├── index.yml             # 元資料（seo, url_mapping, layout）
└── assets/               # 圖片資源
    ├── {name}.png
    └── {name}.png.yml    # 圖片描述檔（必須）

## 允許的 YAML 欄位

**來源**: pages/logsec/index.yml:1-80

- seo.title: string
- seo.description: string
- seo.keywords: string[]
- url_mapping.current_url: string
- url_mapping.old_url: string
- url_mapping.redirect: boolean
- layout.hero.image.id: string
- layout.sections[].type: "text" | "image"

## 允許的 Git 操作

**來源**: GUIDELINES.md:334-410, git log 實際範例

✅ 允許:
- git status
- git diff
- git log
- git add -A
- git commit -m "type(scope): subject"

❌ 禁止（需人類確認）:
- git rm
- git push --force
- 覆蓋已存在檔案
- 修改 URL 結構
```

### 反模式警示清單

**來源**: learnings.md:38-42, 05_agent_refactor.md:292-304

```markdown
❌ 不要留下沒有 .yml 描述檔的圖片
❌ 不要在 MD 檔案中使用絕對路徑引用圖片
❌ 不要在 MD 檔案中放技術參數（應放 YML）
❌ 不要一個 commit 混合多個 scope
❌ 不要在未經人類確認下刪除檔案
❌ 不要假設 API 存在而不檢查文件
```

### Phase 0 驗證檢查

完成此階段後,必須能回答:

1. 此專案的主要用途是什麼?（答: 網站內容庫 / SEO 資料源）
2. 當前工作分支是什麼?（答: DEV，主分支: master）
3. 圖片檔案必須有什麼配對檔案?（答: .yml 描述檔）
4. 哪些操作需要人類確認?（答: 刪除、覆寫、URL 變更）

**如果無法回答以上問題,必須回到相關文件重新閱讀**

---

## Phase 1: 任務理解與範圍確認

### 目標
明確任務需求,識別需要修改的檔案,制定具體實作計畫。

### Step 1.1: 任務分類

根據任務類型選擇對應的 SOP 或 Skill:

| 任務類型 | 使用工具 | 參考文件 |
|----------|----------|----------|
| 新增頁面內容 | content-build skill | .claude/skills/content-build/SKILL.md |
| 圖片描述檔生成 | /gen_image_meta | .claude/commands/gen_image_meta.md |
| 文件同步檢查 | doc-sync skill | .claude/skills/doc-sync/SKILL.md |
| SEO 優化 | /seo_audit | .claude/commands/seo_audit.md |
| 資源完整性檢查 | /check_assets | .claude/commands/check_assets.md |
| 結構重構 | 05_agent_refactor.md | .agent/sop/05_agent_refactor.md |

### Step 1.2: 識別影響範圍

使用文件發現的模式,預測需要修改的檔案:

```bash
# 範例: 新增產品頁面 "new_product"

# 需要建立的檔案（根據 pages/logsec/ 模式）:
pages/new_product/index.md
pages/new_product/index.yml
pages/new_product/assets/*.png
pages/new_product/assets/*.png.yml

# 可能需要更新的文件（根據同步啟發式）:
README.md           # 如果增加目錄
CONTEXT.md          # 更新頁面總數
.agent/system/changelog.md  # 記錄變更
```

### Step 1.3: 變更影響檢查

**來源**: .agent/sop/05_agent_refactor.md:217-249

```
任務確認
    ↓
1. 這會影響專案結構嗎?
   是 → 需更新 README.md, CONTEXT.md
   否 → 跳到 2
    ↓
2. 這是重大決策嗎?
   是 → 需記錄到 .agent/system/decisions.md
   否 → 跳到 3
    ↓
3. 這有新的教訓嗎?
   是 → 需加入 .agent/system/learnings.md
   否 → 跳到 4
    ↓
4. 新增 SOP/Command/Skill?
   是 → 需更新 changelog.md 與對應索引
   否 → 完成檢查
```

### Step 1.4: 建立任務檢查清單

根據影響範圍建立具體的 TODO:

```markdown
## 任務: [任務描述]

### 實作項目
- [ ] 建立/修改 [具體檔案路徑]
- [ ] 建立/修改 [具體檔案路徑]

### 文件同步項目
- [ ] 更新 README.md: [具體章節]
- [ ] 更新 CONTEXT.md: [具體欄位]
- [ ] 記錄到 changelog.md

### 驗證項目
- [ ] 執行 /check_assets 確認配對完整
- [ ] 確認 URL 符合 kebab-case
- [ ] 確認目錄符合 snake_case
- [ ] 確認所有圖片有 .yml 描述檔
```

### Phase 1 驗證檢查

- [ ] 明確知道需要建立/修改哪些檔案
- [ ] 明確知道需要同步更新哪些文件
- [ ] 已建立具體的 TODO 檢查清單
- [ ] 已識別可能的風險點（URL 變更、刪除操作等）

---

## Phase 2: 實作執行（根據檔案模式）

### 核心原則

**從文件複製,不要憑空創造**

- ✅ Good: 「從 pages/logsec/index.yml:1-80 複製結構,修改欄位值」
- ❌ Bad: 「創建一個 YAML 檔案包含 SEO 資訊」

### Step 2.1: 讀取參考範例

**在開始實作前,必須先讀取相似的現有檔案**

```bash
# 範例: 需要建立新的產品頁面

# 1. 讀取相似頁面的完整結構
cat pages/logsec/index.yml
cat pages/logsec/index.md
cat pages/logsec/assets/logsec_1_fix.png.yml

# 2. 理解欄位用途
grep -r "url_mapping:" pages/*/index.yml | head -5
grep -r "layout.sections" pages/*/index.yml | head -5

# 3. 確認命名慣例
ls -d pages/*/
ls pages/logsec/assets/*.yml
```

### Step 2.2: 複製與修改

**從範例複製,保留結構,僅修改值**

```yaml
# 從 pages/logsec/index.yml:1-20 複製
seo:
  title: "原範例標題"  # → 修改為新頁面標題
  description: "原範例描述"  # → 修改為新頁面描述
  keywords: ["原", "範例"]  # → 修改為新關鍵字

# 保留完整結構,不要省略欄位
url_mapping:
  current_url: /security-solutions/logsec/  # → 修改為新 URL
  old_url: /logsec/  # → 修改為舊 URL（如有）
  redirect: true
```

### Step 2.3: 逐檔案實作模式

#### 模式 A: 建立新頁面目錄

**參考**: pages/logsec/ 完整範例

```bash
# Step 1: 建立目錄結構
mkdir -p pages/new_product/assets/

# Step 2: 複製範例檔案作為模板
cp pages/logsec/index.yml pages/new_product/index.yml
cp pages/logsec/index.md pages/new_product/index.md

# Step 3: 修改內容（使用編輯工具,不要手動 echo）
# 在 index.yml 中修改 seo, url_mapping, layout
# 在 index.md 中修改 Markdown 內容

# Step 4: 處理圖片（如有）
# 下載圖片到 assets/
# 使用 /gen_image_meta 生成 .yml 描述檔
```

#### 模式 B: 修改現有檔案

**參考**: Edit 工具,不要覆寫整個檔案

```bash
# ❌ 錯誤做法: 覆寫整個檔案
cat > pages/logsec/index.yml << EOF
...
EOF

# ✅ 正確做法: 使用 Edit 工具修改特定欄位
# 1. 先讀取檔案
cat pages/logsec/index.yml

# 2. 使用 Edit 工具修改特定行
# 範例: 修改 SEO title
old_value: "  title: 舊標題"
new_value: "  title: 新標題"
```

#### 模式 C: 新增圖片資源

**參考**: .claude/commands/gen_image_meta.md

```bash
# Step 1: 下載/複製圖片到 assets/
# (確保檔名符合慣例: {name}_banner.png, {name}_m.png 等)

# Step 2: 執行 /gen_image_meta 生成描述檔
# 或手動建立 .yml（從範例複製）

# Step 3: 驗證配對完整
python3 .agent/scripts/find_undescribed.py pages/new_product/
```

### Step 2.4: 實作檢查清單

每完成一個檔案,立即檢查:

- [ ] 檔案格式正確（YAML 語法、Markdown 語法）
- [ ] 欄位值已修改（沒有遺留範例文字）
- [ ] 路徑引用正確（圖片路徑使用相對路徑）
- [ ] 命名符合慣例（目錄 snake_case, URL kebab-case）

### Phase 2 驗證檢查

```bash
# 驗證 YAML 語法
python3 -c "import yaml; yaml.safe_load(open('pages/new_product/index.yml'))"

# 驗證圖片配對
python3 .agent/scripts/find_undescribed.py pages/new_product/

# 驗證 URL 格式
grep "current_url:" pages/new_product/index.yml  # 應為 kebab-case

# 驗證目錄命名
ls -d pages/new_product/  # 應為 snake_case
```

---

## Phase 3: 文件同步更新

### 目標
確保所有相關文件反映最新變更,避免資訊不一致。

### Step 3.1: 更新 changelog.md

**來源**: .agent/system/changelog.md（單一真相來源）

**格式**: 時間倒序記錄

```markdown
## [2026-01-12] [任務簡述]

### 變更內容
- 新增 pages/new_product/ 目錄
- 新增 pages/new_product/index.yml（SEO + URL mapping）
- 新增 pages/new_product/index.md（內容）
- 新增 3 張圖片 + .yml 描述檔

### 影響範圍
- pages/ 目錄: +1 頁面
- 總圖片數: 232 → 235

### 參考
- 遵循 pages/logsec/ 結構模式
- URL: /security-solutions/new-product/
```

### Step 3.2: 更新 CONTEXT.md

**檢查項目**（來源: GUIDELINES.md:314-333）:

```bash
# 1. 目錄結構（如有變更）
# CONTEXT.md 行號: [待補充]
# 更新: 頁面總數、目錄清單

# 2. Skills/Commands（如有新增）
# CONTEXT.md 行號: 52-68
# 更新: Skills 表格、Commands 表格

# 3. 關鍵技術（如有變更）
# CONTEXT.md 行號: [待補充]
# 更新: 技術棧、依賴項
```

**修改範例**:

```diff
- 總頁面數: 20 + 2 共用元件
+ 總頁面數: 21 + 2 共用元件

- 總圖片數: 232 張 (100% 有 .yml 描述檔)
+ 總圖片數: 235 張 (100% 有 .yml 描述檔)
```

### Step 3.3: 更新 README.md（視需要）

**檢查項目**:

```bash
# 1. 目錄結構圖（如有重大變更）
# README.md 行號: 約 40-100
# 僅在新增主要目錄時更新

# 2. 建置指令（如有新增腳本）
# README.md 行號: 約 130-145
# 新增維護腳本時更新

# 3. 維護腳本（如有新增）
# README.md 行號: 147-171
# 新增表格項目
```

**何時不需更新 README**:
- 僅新增單一頁面（不改變整體結構）
- 修改現有頁面內容
- 更新圖片資源

### Step 3.4: 更新 decisions.md（視需要）

**來源**: .agent/system/decisions.md

**新增決策記錄的時機**:

```markdown
## 需要記錄的決策類型

- 架構選擇（為何使用雙檔案系統）
- 技術棧選擇（為何選 Nuxt 3）
- 命名慣例（為何目錄用 snake_case, URL 用 kebab-case）
- 工作流程（為何 Commit 需人類確認）
- 工具選擇（為何用 Python 而非 TypeScript 寫維護腳本）

## 不需記錄的決策

- 單次實作細節（特定頁面的內容）
- 臨時性修正（修復 typo）
- 遵循現有慣例的變更
```

**決策記錄格式**:

```markdown
## [日期] [決策標題]

### 背景
為什麼需要做這個決策?

### 選項
1. 選項 A: [描述] - [優點] - [缺點]
2. 選項 B: [描述] - [優點] - [缺點]

### 決策
選擇 [選項 X]

### 理由
[詳細說明選擇理由]

### 後果
- 正面影響: [列舉]
- 需要注意: [列舉]
```

### Step 3.5: 更新 learnings.md（視需要）

**來源**: .agent/system/learnings.md

**新增教訓的時機**:

```markdown
## 需要記錄的教訓類型

- 踩過的坑（曾犯的錯誤）
- 專案慣例（約定俗成的做法）
- 最佳實務（證明有效的方法）
- 反模式（應避免的做法）

## 範例

### 圖片管理慣例

**教訓**: 所有圖片必須有對應的 .yml 描述檔

**背景**: 曾有圖片缺少描述檔,導致 SEO 缺少 alt text

**解決方案**:
- 使用 /gen_image_meta 自動生成
- 使用 find_undescribed.py 定期檢查
```

### Phase 3 驗證檢查

**必須完成**:
- [ ] changelog.md 已新增當次變更記錄
- [ ] CONTEXT.md 已更新（如影響專案結構）
- [ ] README.md 已更新（如影響目錄結構或腳本）

**視情況完成**:
- [ ] decisions.md 已記錄重大決策（如有）
- [ ] learnings.md 已記錄新教訓（如有）

**自動驗證**:
```bash
# 檢查 changelog.md 是否有今日日期
grep "$(date +%Y-%m-%d)" .agent/system/changelog.md

# 檢查 CONTEXT.md 最後更新時間
grep "最後更新:" CONTEXT.md
```

---

## Phase 4: 最終驗證與 Commit

### 目標
確保所有變更符合專案規範,建立符合規範的 commit。

### Step 4.1: 執行自動化檢查

```bash
# 檢查 1: 資源完整性
# 確認所有圖片有 .yml 描述檔
python3 .agent/scripts/find_undescribed.py pages/

# 預期輸出:
# "所有圖片都有對應的 .yml 描述檔"

# 檢查 2: YAML 語法
# 驗證所有 .yml 檔案格式正確
for file in $(find pages/ -name "*.yml"); do
    python3 -c "import yaml; yaml.safe_load(open('$file'))" || echo "錯誤: $file"
done

# 檢查 3: URL 格式
# 確認 URL 使用 kebab-case
grep -r "current_url:" pages/*/index.yml | grep -v "/[a-z-]*/$" && echo "警告: URL 格式不符"

# 檢查 4: 目錄命名
# 確認目錄使用 snake_case
ls -d pages/*/ | grep -v "/[a-z_]*/$" && echo "警告: 目錄命名不符"

# 檢查 5: 圖片格式（建議）
# 確認圖片為常見網頁格式
find pages/ -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" \) | wc -l
# 如發現其他格式，考慮轉換

# 檢查 6: Markdown 語法（可選）
# 驗證 Markdown 檔案沒有明顯錯誤
# for file in $(find pages/ -name "*.md"); do
#     # 使用 markdownlint 或類似工具
# done

# 檢查 7: 依賴項檢查（如有修改 package.json）
if git diff --cached package.json | grep -q .; then
    echo "package.json 已變更，建議執行 npm install 驗證"
    # npm install --dry-run
fi

# 檢查 8: 圖片引用完整性
# 確認 index.md 中引用的圖片都存在
for md_file in $(find pages/ -name "index.md"); do
    dir=$(dirname "$md_file")
    grep -o '!\[.*\](assets/[^)]*)' "$md_file" | sed 's/.*(\(.*\))/\1/' | while read img; do
        if [ ! -f "$dir/$img" ]; then
            echo "警告: $md_file 引用的圖片不存在: $img"
        fi
    done
done

# 檢查 9: 圖片描述檔欄位完整性
# 確認所有 .yml 描述檔包含必要欄位 (id, alt, description)
for yml_file in $(find pages/ -path "*/assets/*.yml"); do
    if ! grep -q "^id:" "$yml_file" || ! grep -q "^alt:" "$yml_file" || ! grep -q "^description:" "$yml_file"; then
        echo "警告: $yml_file 缺少必要欄位 (id/alt/description)"
    fi
done
```

### Step 4.2: 文件一致性驗證

**使用 doc-sync skill 自動提醒**:

```bash
# 手動檢查清單（doc-sync 會自動提醒,此處為備份）

# 1. 專案結構變更 → README.md, CONTEXT.md
git diff README.md CONTEXT.md

# 2. 新增 Skills/Commands → 對應索引檔案
git diff .claude/commands/README.md
git diff .agent/README.md

# 3. 新增 SOP → .agent/README.md
git diff .agent/README.md

# 4. 所有變更 → changelog.md
git diff .agent/system/changelog.md
```

### Step 4.3: Commit 前確認

**來源**: CLAUDE.md:18-23, GUIDELINES.md:334-410

#### 1. 檢查變更內容

```bash
# 查看所有變更
git status

# 查看具體 diff
git diff
git diff --cached  # 如果已 staged
```

#### 2. 分類變更（按 scope）

根據變更檔案,確定 commit scope:

| 變更範圍 | Scope | 範例 |
|----------|-------|------|
| pages/ 目錄 | `pages` | feat(pages): 新增產品頁面 |
| .agent/ 目錄 | `agent` | docs(agent): 更新 changelog |
| .claude/ 目錄 | `claude` | feat(claude): 新增 command |
| 圖片資源 | `assets` | feat(assets): 新增產品圖片 |
| SEO 相關 | `seo` | feat(seo): 優化 meta description |
| 腳本工具 | `scripts` | feat(scripts): 新增檢查腳本 |
| 設計規範 | `design` | docs(design): 更新設計指南 |

**如果變更跨越多個 scope**: 拆分為多個 commit

```bash
# ❌ 錯誤: 混合多個 scope
git add pages/ .agent/
git commit -m "feat: 新增頁面並更新文件"

# ✅ 正確: 分開 commit
git add pages/
git commit -m "feat(pages): 新增產品頁面"

git add .agent/
git commit -m "docs(agent): 記錄新頁面到 changelog"
```

#### 3. 撰寫 Commit Message

**格式** (來源: GUIDELINES.md:334-410):

```
<type>(<scope>): <subject>

<body>
```

**Subject 規則**:
- 使用繁體中文
- 動詞開頭（新增、修改、修復、重構）
- ≤ 50 字元
- 不加句號

**Body 規則**:
- 使用 bullet points 列舉變更
- 說明「為什麼」而非「做什麼」
- 每行 ≤ 72 字元

**實際範例**:

```bash
git commit -m "feat(pages): 新增安全防護產品頁面

- 新增 pages/new_product/index.yml（SEO + URL mapping）
- 新增 pages/new_product/index.md（產品介紹內容）
- 新增 3 張產品圖片 + .yml 描述檔
- 遵循 pages/logsec/ 結構模式
- URL: /security-solutions/new-product/
"
```

### Step 4.4: 提交流程

**來源**: CLAUDE.md:18-23

```bash
# Step 1: 確認當前分支
git branch --show-current
# 應該在 DEV 分支，不應直接在 master 分支工作

# Step 2: 暫存檔案
git add -A  # 或選擇性 add 特定檔案

# Step 3: 檢查 staged 內容
git status
git diff --cached

# Step 4: 詢問用戶確認
echo "是否需要 commit?（請用戶確認）"

# Step 5: 檢查 pre-commit hooks（自動執行）
# Husky 會自動執行 .husky/pre-commit
# 可能檢查項目：
# - YAML 語法驗證
# - Markdown 格式檢查
# - 圖片描述檔完整性
# - 檔案命名規範

# Step 6: 用戶確認後執行 commit
git commit -m "$(cat <<'EOF'
feat(pages): 新增安全防護產品頁面

- 新增 pages/new_product/index.yml（SEO + URL mapping）
- 新增 pages/new_product/index.md（產品介紹內容）
- 新增 3 張產品圖片 + .yml 描述檔
- 遵循 pages/logsec/ 結構模式
- URL: /security-solutions/new-product/
EOF
)"

# Step 7: 驗證 commit 成功
git log -1 --format="%h %s%n%b"

# Step 8: 分支保護提醒
# ⚠️ 不要直接推送到 master
# ✅ 應該在 DEV 分支工作，透過 PR 合併到 master
```

### Step 4.5: Post-Commit 檢查

```bash
# 1. 確認 commit message 格式正確
git log -1 --format="%s" | grep -E "^(feat|fix|docs|refactor|chore)\(.+\): .+$"

# 3. 確認 run-log skill 自動觸發
# 檢查是否新增當日日誌
ls -la .agent/run-logs/$(date +%Y-%m-%d).md
```

### Phase 4 驗證檢查

- [ ] 所有自動化檢查通過（find_undescribed.py, YAML 語法等）
- [ ] 文件一致性驗證完成（README, CONTEXT, changelog 已更新）
- [ ] Commit message 符合規範（type/scope/subject/body）
- [ ] Git status 乾淨（所有變更已 commit）
- [ ] run-log 自動記錄已觸發

---

## Phase 5: 專案特定驗證（可選）

### 針對特定任務類型的額外驗證

#### 5A. SEO 相關變更

```bash
# 執行 SEO 稽核
/seo_audit

# 檢查項目:
# - Title 長度 (50-60 字元)
# - Description 長度 (150-160 字元)
# - Keywords 數量 (5-10 個)
# - FAQ 結構（如有）
```

#### 5B. 圖片相關變更

```bash
# 執行資源檢查
/check_assets

# 檢查項目:
# - 圖片描述檔完整性
# - MD/YML 配對
# - 圖片引用路徑
```

#### 5C. 內容建置驗證

**重要：兩階段建置流程**

```
pages/*.yml  →  根目錄 pnpm run build  →  astro-app/public/content/*.json  →  Astro 渲染
```

| 位置 | 指令 | 作用 |
|------|------|------|
| **根目錄** | `pnpm run build` | 執行 content-build，生成 JSON |
| astro-app/ | `pnpm run build` | 建置 Astro 靜態網站到 `dist/` |

```bash
# Step 1: 執行內容建置（根目錄）
pnpm run build

# 檢查 JSON 是否生成
ls -la astro-app/public/content/

# 驗證建置成功
if [ -d "astro-app/public/content" ]; then
    echo "✅ Content build 成功"

    # 檢查 JSON 檔案數量
    find astro-app/public/content/ -name "*.json" | wc -l

    # 檢查 assets 是否正確複製
    find astro-app/public/assets/ -type f \( -name "*.png" -o -name "*.jpg" \) | wc -l
else
    echo "❌ Content build 失敗，檢查錯誤訊息"
fi

# Step 2: 執行 Astro 建置（可選，CI/CD 會自動執行）
cd astro-app && pnpm run build

# 可選：啟動本地預覽
cd astro-app && pnpm run dev
# 在瀏覽器開啟 http://localhost:4321 驗證
```

**CI/CD 必要步驟**（順序重要）：
```yaml
- name: Sync content
  run: pnpm run sync-content      # 1. md → yml（根目錄）

- name: Build content
  run: pnpm run build              # 2. yml → JSON（根目錄）⚠️ 關鍵

- name: Build Astro site
  working-directory: astro-app
  run: pnpm run build              # 3. JSON → HTML
```

#### 5D. 文件一致性

```bash
# 執行文件檢查
/check_docs

# 檢查項目:
# - README.md 與實際結構一致
# - GUIDELINES.md 規範有效
# - CONTEXT.md 狀態正確
```

---

## 附錄 A: 快速參考

### A1. Pre-commit Hooks 檢查項目

**來源**: .husky/pre-commit（推測，需實際讀取確認）

Husky pre-commit hooks 可能檢查的項目：

| 檢查項目 | 說明 | 失敗時的處理 |
|----------|------|--------------|
| YAML 語法 | 驗證所有 .yml 檔案可正確解析 | 執行 `python3 -c "import yaml; yaml.safe_load(...)"` 找出錯誤檔案 |
| 圖片描述檔 | 確認所有圖片有對應 .yml | 執行 `find_undescribed.py` 找出缺失 |
| 必要欄位 | .yml 必須包含 id, alt, description | 檢查並補齊欄位 |
| 檔案命名 | 目錄 snake_case, URL kebab-case | 重新命名不符規範的檔案 |
| Markdown 語法 | 基本的 Markdown 格式檢查 | 修正格式錯誤 |

**如何查看實際 hooks**:
```bash
cat .husky/pre-commit
```

### A2. 常用檔案路徑

```
核心文件:
├── README.md                          # 專案概覽
├── CONTEXT.md                         # 當前狀態
├── GUIDELINES.md                      # 開發規範
└── .claude/CLAUDE.md                  # AI 協作準則

專案記憶:
├── .agent/system/changelog.md         # 變更日誌（單一來源）
├── .agent/system/decisions.md         # 決策記錄
├── .agent/system/learnings.md         # 最佳實務
├── .agent/README.md                   # SOP 索引
└── agent/EXECUTION_PLAN.md            # 執行計畫（本文件）

自動化:
├── .claude/commands/README.md         # Commands 索引
├── .claude/skills/                    # Skills 目錄
└── .agent/scripts/                    # 維護腳本

Git 配置:
├── .husky/pre-commit                  # Pre-commit hooks
├── .gitignore                         # Git 忽略規則
└── package.json                       # 專案依賴與腳本

內容範例:
├── pages/logsec/                      # 完整頁面範例
├── pages/logsec/index.yml             # YAML 範例
├── pages/logsec/index.md              # Markdown 範例
└── pages/logsec/assets/*.yml          # 圖片描述檔範例

建置輸出:
├── astro-app/public/content/          # Content build JSON 輸出（⚠️ gitignored）
├── astro-app/public/assets/           # 正規化後的圖片資源
└── astro-app/dist/                    # Astro 靜態網站輸出
```

### A2. 常用檢查指令

```bash
# 專案狀態
git status
git log --oneline -10
ls -la pages/

# 資源檢查
python3 .agent/scripts/find_undescribed.py pages/
python3 -c "import yaml; yaml.safe_load(open('path/to/file.yml'))"

# 文件同步
grep "$(date +%Y-%m-%d)" .agent/system/changelog.md
git diff README.md CONTEXT.md

# 格式驗證
grep -r "current_url:" pages/*/index.yml | grep -v "/[a-z-]*/$"
ls -d pages/*/ | grep -v "/[a-z_]*/$"
```

### A3. 命名慣例速查

| 項目 | 格式 | 範例 | 來源 |
|------|------|------|------|
| 目錄名稱 | snake_case | `pages/security_scorecard/` | learnings.md |
| URL 路徑 | kebab-case | `/security-solutions/security-scorecard/` | url_mapping 欄位 |
| 圖片檔名 | 中文+底線+英文 | `產品介紹_banner.png` | pages/*/assets/ |
| Commit type | 小寫英文 | `feat`, `fix`, `docs` | GUIDELINES.md |
| Commit scope | 小寫英文 | `pages`, `agent`, `assets` | GUIDELINES.md |

### A4. 緊急故障排除

#### 問題: Commit 被拒絕（Husky hook 失敗）

```bash
# 檢查 pre-commit hook 配置
cat .husky/pre-commit

# 檢查 hook 錯誤訊息
# 可能原因:
# 1. YAML 語法錯誤 → 使用 python3 -c "import yaml; yaml.safe_load(...)" 驗證
# 2. 缺少必要欄位 → 檢查 .yml 是否有 id, alt, description
# 3. 圖片缺少描述檔 → 執行 find_undescribed.py
# 4. Markdown 格式錯誤 → 檢查是否有未閉合的標籤
# 5. 檔案命名不符 → 確認 snake_case/kebab-case

# 修正後重新 commit（不使用 --amend，除非需要修改 commit message）
git commit
```

#### 問題: 需要建立 Pull Request

```bash
# 1. 確認當前分支已推送
git push origin DEV

# 2. 使用 gh CLI 建立 PR（如已安裝）
gh pr create --base master --head DEV --title "PR 標題" --body "PR 說明"

# 3. 或手動在 GitHub 網頁建立 PR
# - Base: master
# - Compare: DEV
```

#### 問題: 忘記更新文件

```bash
# 執行文件一致性檢查
/check_docs

# 手動檢查清單
git diff HEAD~1 --stat  # 查看上次 commit 變更了哪些檔案

# 如果變更了專案結構，但忘記更新 README/CONTEXT
git commit --amend  # 修改上次 commit，加入文件更新

# 或建立新的 commit
git add README.md CONTEXT.md .agent/system/changelog.md
git commit -m "docs(agent): 同步更新文件以反映結構變更"
```

#### 問題: 圖片描述檔遺失

```bash
# 掃描缺失
python3 .agent/scripts/find_undescribed.py pages/

# 批次生成
/gen_image_meta

# 或手動建立（從範例複製）
cp pages/logsec/assets/logsec_1_fix.png.yml pages/new_product/assets/new.png.yml
# 編輯 id, alt, description 欄位
```

#### 問題: YAML 語法錯誤

```bash
# 驗證語法
python3 -c "import yaml; yaml.safe_load(open('path/to/file.yml'))"

# 常見錯誤:
# 1. 縮排不一致（必須使用 2 空格）
# 2. 字串未加引號（包含特殊字元時）
# 3. 清單格式錯誤（- 後需空格）
```

#### 問題: 文件不同步

```bash
# 手動觸發 doc-sync 檢查
/check_docs

# 檢查 changelog 是否記錄
cat .agent/system/changelog.md | head -50

# 更新 CONTEXT.md 時間戳
# （手動編輯「最後更新」欄位）
```

---

## 附錄 B: 任務類型快速決策樹

```
收到任務
    ↓
[任務分類]
    ↓
    ├─ 新增頁面? ────→ Phase 0 → Phase 1 → 使用 content-build → Phase 3 → Phase 4
    ├─ 修改內容? ────→ Phase 0 → 讀取現有檔案 → 使用 Edit → Phase 3 → Phase 4
    ├─ 新增圖片? ────→ Phase 0 → 使用 /gen_image_meta → Phase 3 → Phase 4
    ├─ SEO 優化? ────→ Phase 0 → 使用 /seo_audit → 修改 .yml → Phase 3 → Phase 4
    ├─ 資源檢查? ────→ Phase 0 → 使用 /check_assets → 修正問題 → Phase 4
    ├─ 結構重構? ────→ Phase 0 → 讀取 05_agent_refactor.md → Phase 1 → Phase 2 → Phase 3 → Phase 4
    └─ 文件更新? ────→ Phase 0 → doc-sync 檢查 → 更新相關文件 → Phase 4
```

---

## 版本歷史

| 版本 | 日期 | 變更內容 |
|------|------|----------|
| v1.2 | 2026-01-14 | 更新 Phase 5C 內容建置流程，區分根目錄與 astro-app 兩個 build，新增 CI/CD 必要步驟 |
| v1.1 | 2026-01-12 | 補充檢查項目：圖片格式、依賴項、圖片引用完整性、描述檔欄位、分支保護、PR 流程、pre-commit hooks、建置驗證 |
| v1.0 | 2026-01-12 | 初版建立，涵蓋完整 5 個 Phase |

---

## 使用此計畫的正確方式

### 對於 AI 協作者

1. **每次任務開始前**: 必讀 Phase 0,建立允許 API 清單
2. **實作時**: 嚴格遵循「從文件複製」原則,不要憑空創造
3. **完成後**: 完整執行 Phase 3-4,確保文件同步與驗證

### 對於人類維護者

1. **新成員引導**: 提供此計畫作為 onboarding 文件
2. **定期審查**: 每月檢查計畫是否反映最新慣例
3. **持續優化**: 發現新模式時,更新對應 Phase 的範例

### 成功指標

- [ ] 新任務能在 Phase 0 後明確知道參考範例
- [ ] 實作過程不出現「我假設 API 是...」的情況
- [ ] 每次 Commit 都包含完整的文件同步更新
- [ ] 驗證檢查能自動化執行,無需人工記憶

---

**記住**: 此計畫的目的不是限制創造力,而是確保每次變更都有清晰的文件依據,避免在多次對話中重複犯錯。當不確定時,回到 Phase 0 讀取相關文件,勝過憑記憶猜測。
