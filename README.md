# LipSyncOne Releases

LipSyncOne の Windows 向け配布ファイルと公式サイトを公開するためのリポジトリです。アプリケーションのソースコードはこのリポジトリには含まれません。

## 配布状態

Windows 11 x64向け`v0.2.2`を公開しています。

- [最新版をダウンロード](https://github.com/studio-juh/lip-sync-one-releases/releases/latest)
- [LipSyncOne 製品紹介](https://lipsyncone.studiojuh.com/)
- [LipSyncOne 公式ヘルプ](https://lipsyncone.studiojuh.com/help/)
- [一般向けお問い合わせ（マシュマロ）](https://marshmallow-qa.com/jyfux4yi4cp85hw)

製品紹介LPとヘルプページは`site/`の静的ファイルをCloudflare Workers Static Assetsへ公開します。`pnpm site:deploy`はmetadataを検証してからWranglerで直接デプロイします。HOME、画面構成、口形設定、音声解析、タイムライン、動画書き出しを実画面付きで案内し、配布バイナリやUpdater用Release assetとは分離しています。

```powershell
pnpm install
pnpm dev
pnpm site:deploy
```

GitHub ActionsによるGitHub Pages公開は使用しません。独自ドメインはCloudflare WorkersのCustom Domainsへ接続し、確定後にcanonical URL、OGP、構造化データ、`robots.txt`、`sitemap.xml`、`llms.txt`を同じURLへ更新します。

検索エンジンとAI検索向けにcanonical URL、OG / Twitter Card、JSON-LD、`robots.txt`、`sitemap.xml`、補助的な`llms.txt`を公開します。検索向けクローラーは許可し、構造化データとAI向け要約には公開ページで確認できる現行仕様だけを記載します。

`site/google*.html`はGoogle Search Consoleの所有権確認に使用します。Googleが定期的に再確認するため、登録完了後も公開を維持します。

## Release assets

v0.3.0はNSISセットアップEXE・Updater署名・latest.json・SHA256SUMS.txtの4点を公開します。ポータブルZIPと旧版互換用feedは提供しません。バイナリはGitへ登録せずGitHub Releasesで配布します。

## 日本語検索向けの表記（2026-09-13）

製品紹介の本文ではLipSyncOne（リップシンクワン / Lip Sync One）を併記し、立ち絵・口パク自動作成・背景透過動画・実況用途を説明します。title、description、OG / Twitter、SoftwareApplicationとWebSiteのalternateNameを本文に合わせています。サイト名の別名指定は順位や検索語との一致を保証しません。

更新後は`pnpm check`、PC / 狭幅の表示、Cloudflare公開ページのHTMLを確認します。サイトマップのlastmodは実際の内容更新日に合わせます。Googleへの反映確認はSearch ConsoleのURL検査と検索パフォーマンスで行い、必要なら製品紹介URLのインデックス登録をリクエストします。検索結果の改善は再クロール後に評価します。

英字の別表記`lipsync one`、`lip sync one`、`lipsyncone`は製品紹介の名前FAQとSoftwareApplication / WebSiteのalternateNameへ記載します。タイトルへの表記列挙は行いません。

## 無料サンプル（2026-10-12）

製品ページの `#samples` とヘルプの素材準備から、無料サンプルを案内します。ZIPは公式サイト内の `site/downloads/LipSyncOne_SampleAssets_v1.zip` に置き、`/downloads/LipSyncOne_SampleAssets_v1.zip` から直接配布します。PNG 7枚・WAV 1本・READMEで構成し、VOICEVOX:WhiteCULの表記と利用条件を同梱します。素材はGitへ登録しません。

再deploy時は `site/downloads/LipSyncOne_SampleAssets_v1.zip` を配置してください。入力ZIPはアプリrepositoryの `pnpm package:samples` で生成し、`publish/samples/` に出力します。ZIPはGit管理対象外です。`pnpm check` は公開リンクとファイルの存在を確認します。

## ヘルプと画面例の更新（2026-10-12）

オンラインヘルプとアプリ同梱ヘルプの本文・画像を同期しました。現行React UIを日本語・1600×1000で撮影し、無料サンプルを使用しています。撮影時のネイティブ処理境界は検証用fixtureです。操作手順、外部素材更新、S/R変形、整数・ホイール入力、初期値25％、軽量WebMを案内しています。画面例で案内する変更は0.2.2の公開ZIPに含まれています。

2026-10-13 サンプル修正: 目3差分の眉の切り出しを修正。ZIPは1,754,956 bytes、SHA-256 `30aebcab19e2193729d15d10bcc446e6ee1b0384d8e6c96af2f556ed201ad0ed`。画像7枚・音声1本・利用案内の構成は維持しています。
