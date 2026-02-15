# Kibougaoka-Challengebase
# 希望が丘チャレンジベース Webサイト README

最終更新: 2026-02-15

この README は、`index.html` + `pages/` 配下の現行実装を保守しやすくするための運用ドキュメントです。  
「どのページで何を使っているか」「どこを触ると何に影響するか」「JSON 更新でどこが変わるか」をまとめています。

---

## 1. サイト概要

- 種別: 静的サイト（HTML/CSS/JS）
- 共通アセット:
  - `style.css`（全体のデザイン + レイアウト + レスポンシブ）
  - `script.js`（共通UI挙動 + イベント/開館情報の動的反映）
  - `assets/data/schedule.json`（今月/来月の開館情報・イベントデータ）
- 文字コード: UTF-8（すべての HTML に `<meta charset="UTF-8">` 設定あり）

重要:
- `schedule.json` の読込は `fetch()` を使うため、`file://` 直開きでは反映されない環境があります。ローカル確認は簡易サーバーで実施してください。

---

## 2. ディレクトリ構成（主要）

```text
challengebase-HP/
├─ index.html
├─ style.css
├─ script.js
├─ assets/
│  ├─ data/
│  │  └─ schedule.json
│  ├─ icon/
│  └─ images/
├─ pages/
│  ├─ about/
│  ├─ activity/
│  ├─ events/
│  ├─ facility/
│  ├─ news/
│  ├─ notice,news/
│  ├─ support/
│  ├─ challenge/   (補助系)
│  ├─ guide/       (補助系)
│  ├─ article/     (空)
│  ├─ notice/      (空)
│  └─ other/       (空)
└─ tools/
   ├─ schedule-json-builder/
   │  ├─ index.html
   │  ├─ app.css
   │  └─ app.js
   ├─ snippet-header.html
   └─ snippet-footer.html
```

---

## 3. ページマップ

### 3.1 メイン導線（index のヘッダー/サイトマップで使用）

#### イベント情報
- `pages/events/index.html`（概要）
- `pages/events/month.html`（今月のイベント）
- `pages/events/past.html`（過去のイベント）
- `pages/events/calendar.html`（イベントカレンダー）

#### 活動内容
- `pages/activity/index.html`（概要）
- `pages/activity/club.html`
- `pages/activity/cafe.html`
- `pages/activity/book.html`
- `pages/activity/concierge.html`

#### チャレベを知る
- `pages/about/index.html`（概要）
- `pages/about/concept.html`
- `pages/about/place.html`
- `pages/about/community.html`
- `pages/about/records.html`
- `pages/about/team.html`

#### 施設案内
- `pages/facility/index.html`（概要）
- `pages/facility/rental.html`
- `pages/facility/access.html`
- `pages/facility/news.html`
- `pages/facility/gallery.html`

#### サポート
- `pages/support/index.html`（概要）
- `pages/support/donate.html`
- `pages/support/contact.html`

### 3.2 補助ページ（存在するがメイン導線外を含む）

- `pages/events/week.html`
- `pages/events/local.html`
- `pages/support/apply.html`
- `pages/challenge/index.html`
- `pages/challenge/concept.html`
- `pages/challenge/story.html`
- `pages/challenge/community.html`
- `pages/challenge/support.html`
- `pages/challenge/staff.html`
- `pages/guide/index.html`
- `pages/guide/rental.html`
- `pages/guide/access.html`
- `pages/guide/faq.html`
- `pages/guide/gallery.html`
- `pages/news/template.html`
- `pages/notice,news/news-template.html`
- `pages/notice,news/notice-template.html`

### 3.3 現在の孤立ページ（内部リンク流入なし）

- `pages/facility/book.html`
- `pages/facility/cafe.html`
- `pages/facility/concierge.html`

---

## 4. 共通UI（全ページ共通）

### 4.1 ヘッダー/モバイルメニュー

必須ID/クラス（`script.js` 参照）:
- `#main-header`（スクロールで隠す制御）
- `#menu-toggle`（SPメニュートグル）
- `#mobile-menu`（開閉対象）
- `.dropdown-toggle` + `.mobile-nav-item`（SPドロップダウン）
- `.icon-btn[aria-label="通知"]`（通知パネル開閉）

共通HTMLの雛形:
- `tools/snippet-header.html`

### 4.2 フッター

共通HTMLの雛形:
- `tools/snippet-footer.html`

### 4.3 ページ共通レイアウト

基本クラス:
- `.page-main`
- `.page-shell`
- `.page-hero`
- `.page-section` / `.page-section.alt`
- `.section-header`
- `.info-tile-grid`, `.event-card-grid`, `.split-grid` など

---

## 5. CSS 設計（`style.css`）

`style.css` は1ファイルに段階的に拡張されています。主要レイヤー:

- `1-1400` 付近: 初期グローバル（ヘッダー、ホーム、フッター、レスポンシブ）
- `1412-2051` 付近: サブページ共通テンプレート
- `2052-2310` 付近: テーマ変数（`theme-events` など）
- `2311-2590` 付近: UX改善層（フォーカス、均等高、カード整形）
- `2590-2759` 付近: 大画面最適化（均等高・余白最適化）
- `2760-3523` 付近: 動的スケジュール/カレンダー/狭幅対応
- `3524-3634` 付近: 記事テンプレート層（旧）
- `3635-` 付近: ニュース/お知らせテンプレート層（Yahoo風 + ページ限定スコープ）、通知パネル

### 5.1 テーマクラス

`body` のテーマクラスで色が切り替わります。

- `theme-events`
- `theme-activity`
- `theme-about`
- `theme-facility`
- `theme-support`

### 5.2 iPhone SE など狭幅対応

末尾の `Narrow Width Typography Guard` で、改行崩れ・読みにくさを抑制しています。


### 5.3 主要クラスと利用ページ

- ヘッダー系: `#main-header`, `.header-container`, `.global-nav`, `.mobile-menu`
  - 利用: `index.html` + `pages/**/*.html` 全体
- ページ骨格: `.page-main`, `.page-shell`, `.page-hero`, `.page-section`
  - 利用: `pages/**/*.html` 全体
- カード/一覧: `.info-tile-grid`, `.event-card-grid`, `.notice-list`, `.meta-list`, `.split-grid`
  - 利用: サブページ全般（`events`, `about`, `activity`, `facility`, `support`, `guide`, `challenge`）
- 動的スケジュール: `.status-badge.open/.closed`, `#js-month-opening-list`
  - 利用: `index.html`, `pages/events/month.html`
- カレンダー系: `.month-calendar*`, `.calendar-day-popover*`, `.calendar-mobile-list*`
  - 利用: `pages/events/calendar.html`
- 記事テンプレート系: `.news-main`, `.news-grid`, `.news-article`, `.news-sidebar`
  - 利用: `pages/news/template.html`, `pages/notice,news/*.html`
- 通知系: `.notify-panel`, `.notify-dot`, `.notify-item`
  - 利用: 全ページヘッダー（通知アイコン）

---

## 6. JavaScript 設計（`script.js`）

### 6.1 共通機能

- ヘッダーのスクロール表示制御
- トップのランダムカード生成（`#random-content-area`）
- お気に入りボタン状態保存（`.heart-btn` + `localStorage`）
- モバイルメニュー/ドロップダウン
- `.reveal` スクロール表示
- トップMVスライダー（`.mv-container .slide`）
- ヘッダー通知（最新お知らせ + おすすめイベント最大3件、既読で新着マークを非表示）

### 6.2 スケジュールJSON連携（中核）

エントリ:
- `initScheduleFromJson()`

データ取得:
- `getScheduleDataPath()` で `index.html` と `pages/*` で相対パスを切り替え

レンダリング先:

1. ホーム（`index.html`）
- 対象: `.dashboard .schedule-card`
- 更新要素: `.today-date`, `.status-badge`, `.event-list`

2. イベント概要（`pages/events/index.html`）
- 対象: `.event-week-grid`
- 必要に応じて `#js-events-summary-section` を動的追加
- 月次/翌月一覧:
  - `#js-events-current-month-title`
  - `#js-events-next-month-title`
  - `#js-events-current-month-list`
  - `#js-events-next-month-list`

3. 今月イベント（`pages/events/month.html`）
- タイトル更新:
  - `#events-month-title`
  - `#month-summary-title`
- 一覧更新: `.event-card-grid`
- 必要に応じて `#js-month-opening-section` を動的追加
- 開館情報/翌月予定:
  - `#js-month-opening-list`
  - `#js-month-next-list`

4. 今週イベント（`pages/events/week.html`）
- 対象: `.info-tile-grid`

5. カレンダー（`pages/events/calendar.html`）
- 対象: `.page-events-calendar .page-section.alt .info-tile-grid`
- PC:
  - 月切替（当月/翌月）
  - 日付セルクリック/ホバーで吹き出し表示（popover）
  - 今日強調 / 過去日グレー
- SP:
  - 「これからの閉館日」「これからのイベント予定」をリスト表示
  - ボックス内スクロール

補足:
- JSON取得失敗時は `catch` で静的HTMLを残す設計（完全停止はしない）。
- 通知は `localStorage` の `seen_notify_signature` で既読管理。

---

## 7. `schedule.json` 仕様

### 7.1 ルート構造

```json
{
  "meta": {
    "name": "...",
    "timezone": "Asia/Tokyo",
    "updatedAt": "YYYY-MM-DD"
  },
  "months": {
    "YYYY-MM": {
      "label": "2026年2月",
      "openingStatus": [ ... ],
      "events": [ ... ]
    }
  },
  "notices": {
    "latest": [
      {
        "title": "文字列",
        "publishedAt": "YYYY-MM-DD",
        "path": "pages/news/....html"
      }
    ]
  }
}
```

### 7.2 `openingStatus[]` 必須項目

- `date` (`YYYY-MM-DD`)
- `day`（`日` など）
- `isOpen`（`true/false`）
- `status`（`営業` / `休館`）
- `hours`（例: `10:00-21:00`、休館日は `null` 可）
- `note`（補足）

### 7.3 `events[]` 必須項目

- `id`（ユニーク）
- `date` (`YYYY-MM-DD`)
- `start`, `end`
- `title`
- `category`
- `summary`
- `detailPath`（相対パスまたは絶対URL）

### 7.4 更新手順（推奨）

1. `meta.updatedAt` を更新
2. 対象月（`months.YYYY-MM`）を追加または修正
3. `openingStatus` を月の日数分そろえる（未設定日はUI上「未設定」）
4. `events` を追加（`id` 重複禁止）
5. `detailPath` のリンク先を確認
6. `pages/events/index.html` / `month.html` / `week.html` / `calendar.html` / `index.html` で表示確認

### 7.5 通知データ（任意）

- `notices.latest` は任意。
- 未設定でも通知ロジックは動作し、フォールバックで「最新情報」リンクを表示。
- 設定すると通知優先順位の先頭に最新お知らせが表示される。

---

## 8. 変更時の影響範囲

### 8.1 HTML変更で壊れやすいポイント

次を削除/改名するとJS連携が壊れます:

- `index.html` の `.schedule-card` 配下（`.today-date`, `.status-badge`, `.event-list`）
- `pages/events/index.html` の `.event-week-grid`
- `pages/events/month.html` の `.event-card-grid`
- `pages/events/week.html` の `.info-tile-grid`
- `pages/events/calendar.html` の `.page-section.alt .info-tile-grid`
- 通知アイコンの `aria-label="通知"`（変更すると通知パネルが出ない）

### 8.2 ヘッダー/フッター更新ルール

- 複数ページを手修正すると差分が出やすいため、`tools/snippet-header.html` / `tools/snippet-footer.html` を基準に同期する。
- `index.html` は相対パスが他ページと異なるため、コピー時はリンクパスを必ず調整する。

### 8.3 エンコーディング

- 保存時は UTF-8 を維持する。
- 文字化け予防のため、エディタの「自動判定」任せではなく UTF-8 固定推奨。

---

## 9. トラブルシュート

### 症状: ページが真っ白

確認ポイント:
- HTMLの閉じタグ崩れ
- `../../style.css` / `../../script.js` の相対パス崩れ
- `script.js` の構文エラー

### 症状: モバイルメニューが開かない

確認ポイント:
- `#menu-toggle` と `#mobile-menu` が存在するか
- `.dropdown-toggle` の構造が崩れていないか

### 症状: カレンダーの吹き出しが出ない/位置が不正

確認ポイント:
- `page-events-calendar` が `body` に付いているか
- `.month-calendar-wrap` / `.calendar-day-popover` が残っているか
- CSS末尾のカレンダー系セクションが上書きされていないか

### 症状: JSONを更新しても反映しない

確認ポイント:
- JSON構文エラー
- `months` キー形式（`YYYY-MM`）
- `date` 形式（`YYYY-MM-DD`）
- `meta.timezone`（通常 `Asia/Tokyo`）
- `file://` 直開きではなくローカルサーバー経由で確認しているか

---

## 10. 確認用チェックリスト（更新後）

- PC/SPでヘッダー・フッターリンクが機能する
- `index.html` の本日開館状況が当日データで更新される
- `pages/events/index.html` の直近予定/今月/来月が更新される
- `pages/events/month.html` の開館一覧がスクロール表示される
- `pages/events/calendar.html` で:
  - PC: 月切替 + 日付ホバー/クリック吹き出し
  - SP: 未来予定リスト + スクロール
- 通知アイコンでパネルが開き、最大3件が表示される
- 通知パネルを開いた後に新着ドットが消える（既読化）
- iPhone SE 相当幅で不自然な改行がない

---

## 11. 今後の保守改善候補

- `style.css` の分割（`base.css` / `layout.css` / `theme.css` / `calendar.css`）
- ヘッダー/フッターのテンプレート化（ビルド導入 or SSI）
- `pages/challenge` と `pages/guide` の役割整理（統合 or 公式導線化）
- 孤立ページ（`pages/facility/book.html` 等）の扱い決定（導線追加 or アーカイブ）

---

## 12. 参考ファイル

- `index.html`
- `style.css`
- `script.js`
- `assets/data/schedule.json`
- `pages/news/template.html`
- `pages/notice,news/news-template.html`
- `pages/notice,news/notice-template.html`
- `tools/schedule-json-builder/index.html`
- `tools/snippet-header.html`
- `tools/snippet-footer.html`



