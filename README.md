# LipSyncOne Releases

LipSyncOne の Windows 向け配布ファイルと、自動更新フィードを公開するためのリポジトリです。アプリケーションのソースコードはこのリポジトリには含まれません。

## 配布状態

Windows 11 x64向け`v0.1.4`ベータ版を公開しています。

- [最新版をダウンロード](https://github.com/studio-juh/lip-sync-one-releases/releases/latest)
- [LipSyncOne 製品紹介](https://studio-juh.github.io/lip-sync-one-releases/lp/)
- [LipSyncOne 公式ヘルプ](https://studio-juh.github.io/lip-sync-one-releases/)
- [一般向けお問い合わせ（マシュマロ）](https://marshmallow-qa.com/jyfux4yi4cp85hw)

製品紹介LPとヘルプページは`site/`の静的ファイルをGitHub Pagesへ公開します。HOME、画面構成、口形設定、音声解析、タイムライン、動画書き出しを実画面付きで案内し、配布バイナリやUpdater用Release assetとは分離しています。

検索エンジンとAI検索向けにcanonical URL、OG / Twitter Card、JSON-LD、`robots.txt`、`sitemap.xml`、補助的な`llms.txt`を公開します。検索向けクローラーは許可し、構造化データとAI向け要約には公開ページで確認できる現行仕様だけを記載します。

## Release assets

各安定版の GitHub Release には、同じバージョン番号を持つ次のファイルを添付します。

- `latest.json`: アプリが参照する更新情報
- `LipSyncOne_<version>_x64-setup.exe`: Windows NSIS インストーラー
- `LipSyncOne_<version>_x64-setup.exe.sig`: Tauri Updater の署名
- `LipSyncOne_<version>_windows-x64-portable.zip`: ポータブル版
- `SHA256SUMS.txt`: 配布ファイルの SHA-256

アプリが参照する安定版フィード:

`https://github.com/studio-juh/lip-sync-one-releases/releases/latest/download/latest.json`

バイナリは Git 履歴へコミットせず、GitHub Releases にのみ添付します。
