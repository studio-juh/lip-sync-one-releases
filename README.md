# LipSyncOne Releases

LipSyncOne の Windows 向け配布ファイルと公式サイトを公開するためのリポジトリです。アプリケーションのソースコードはこのリポジトリには含まれません。

## 配布状態

Windows 11 x64向け`v0.3.7`を公開しています。

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

v0.3.7はNSISセットアップEXE・Updater署名・latest.json・SHA256SUMS.txtの4点を公開します。ポータブルZIPと旧版互換用feedは提供しません。バイナリはGitへ登録せずGitHub Releasesで配布します。

## 日本語検索向けの表記（2026-09-13）

製品紹介の本文ではLipSyncOne（リップシンク One / Lip Sync One）を併記し、立ち絵・口パク自動作成・背景透過動画・実況用途を説明します。title、description、OG / Twitter、SoftwareApplicationとWebSiteのalternateNameを本文に合わせています。サイト名の別名指定は順位や検索語との一致を保証しません。

更新後は`pnpm check`、PC / 狭幅の表示、Cloudflare公開ページのHTMLを確認します。サイトマップのlastmodは実際の内容更新日に合わせます。Googleへの反映確認はSearch ConsoleのURL検査と検索パフォーマンスで行い、必要なら製品紹介URLのインデックス登録をリクエストします。検索結果の改善は再クロール後に評価します。

英字の別表記`lipsync one`、`lip sync one`、`lipsyncone`は製品紹介の名前FAQとSoftwareApplication / WebSiteのalternateNameへ記載します。タイトルへの表記列挙は行いません。

## 無料サンプル（2026-10-12）

製品ページの `#samples` とヘルプの素材準備から、無料サンプルを案内します。ZIPは公式サイト内の `site/downloads/LipSyncOne_SampleAssets_v1.zip` に置き、`/downloads/LipSyncOne_SampleAssets_v1.zip` から直接配布します。各ZIPはPNG 7枚・WAV 2本・READMEで構成します。サンプル1は櫻歌ミコ、サンプル2は春日部つむぎの音声を含み、使用する声ごとのクレジットと利用条件を同梱します。素材はGitへ登録しません。

再deploy時は `site/downloads/LipSyncOne_SampleAssets_v1.zip` を配置してください。入力ZIPはアプリrepositoryの `pnpm package:samples` で生成し、`publish/samples/` に出力します。ZIPはGit管理対象外です。`pnpm check` は公開リンクとファイルの存在を確認します。

## ヘルプと画面例の更新（2026-10-12）

オンラインヘルプとアプリ同梱ヘルプの本文・画像を同期しました。現行React UIを日本語・1600×1000で撮影し、無料サンプルを使用しています。撮影時のネイティブ処理境界は検証用fixtureです。操作手順、外部素材更新、S/R変形、整数・ホイール入力、初期値25％、軽量WebMを案内しています。画面例で案内する変更は0.2.2の公開ZIPに含まれています。

2026-10-13 サンプル修正: 目3差分の眉の切り出しを修正。ZIPは1,754,956 bytes、SHA-256 `30aebcab19e2193729d15d10bcc446e6ee1b0384d8e6c96af2f556ed201ad0ed`。画像7枚・音声1本・利用案内の構成は維持しています。

2026-10-13 歯なし版へ更新。サンプル1とサンプル2（銀髪）の両ZIPを `site/downloads/` へ配置してdeployしてください。サンプル2の原本はアプリrepositoryの `sample-assets/silver-girl-20261013/`、配布ZIPは `publish/samples/LipSyncOne_SampleAssets2_v1.zip` です。配布ファイルは引き続きGit対象外です。

- `39a4186a56a8bdf27527ad998b64dcd42b54e1d7a55102da8de7e4409fa8b585  LipSyncOne_SampleAssets_v1.zip`
- `de76273e2e1d93784067db749ec512dc3078b6ee39e1987bf091913233b1e30b  LipSyncOne_SampleAssets2_v1.zip`

2026-10-14: v0.3.2を公開。.ls1の関連付けと専用ファイルアイコンに対応。ユーザー編集済みサンプル2へ更新（3,395,764 bytes）。サンプル2はアプリrepositoryの `pnpm package:samples2` で原本から梱包します。

2026-10-14: サンプル2音声を `kasukabe_tsumugi_004_lipsyncone_multi_character.wav`（VOICEVOX:春日部つむぎ）へ差し替え。利用案内・公開checksumを更新。アプリ公開版は0.3.2を維持。

2026-10-14: v0.3.3を公開。起動時の更新確認を廃止し、ヘルプからの手動確認だけに変更。

2026-10-14: 両サンプルに挨拶音声を追加。サンプル1に `ouka_miko_001_hello.wav`、サンプル2に `kasukabe_tsumugi_002_hello.wav` を同梱。最終ZIPを直接配布し、checksumとページの声名・利用案内を更新。アプリ公開版は0.3.3を維持。

2026-10-14: タイトル・説明・SoftwareApplication構造化データと本文・FAQ・ヘルプを検索用途へ整理。Windowsの口パク / 目パチアニメーション作成、リップシンクジェネレーター、まばたき・瞬き、立ち絵差分、2Dコマアニメーション、VOICEVOX / ゆっくり実況、背景透過動画を自然な用途説明へ含める。検索順位や即時反映は保証せず、未対応機能は訴求しない。

2026-10-14: 日本語製品名を「リップシンク One」へ統一。英語表記LipSyncOneとロゴは維持。説明・別名・FAQ・llmsも同じ表記へ更新。

2026-10-15: v0.3.4を公開。レイヤー削除・自動アニメーション割り当て解除、未完成の口・目設定の保存、画像差し替え時の手動修正保持、未使用素材の削除、BASE再作成時の親への追従を改善。

2026-10-15: v0.3.5を公開。埋込ICCの名前や有無で画像を拒否する処理を撤去し、大口などのサムネイルが表示されない問題を修正。PNG / JPEGの共通読み込みへ反映。


2026-10-16: サンプル3（男の子の全身画像2枚）を追加。`site/downloads/LipSyncOne_SampleAssets3_v1.zip` と個別sha256を配置し、製品ページ・ヘルプ・llmsから案内します。PNG2枚（1024×1536、口以外のRGBAと全域alphaは一致）、確認用GIF、利用案内の4ファイル。音声なし。公開0.3.7の既存「口・リップシンクレイヤーを追加 → かんたん（2枚）」の手順と、新しい2枚追加画面を持つバージョンの手順を区別しています。アプリ本体・既存サンプル1 / 2・Updaterは変更しません。再deploy前には3種類のサンプルZIPをすべて配置してください。メディアはGit管理対象外です。

2026-10-16: サンプル3へ指定の猫使アル（ノーマル）説明音声を追加。配布名はaudio/nekotsuka_aru_001_two_image_lipsync.wav。原音を加工せず同梱し、VOICEVOX:猫使アルのクレジットと公式規約をREADME・配布ページへ記載。サンプル3はPNG2枚・WAV1本・GIF・READMEの5ファイルになりました。画像・アプリ本体は変更しません。

## 0.3.7 配布ファイル更新（2026-10-16）

全身画像2枚からのキャラクター追加、カンバスの縮小プレビューとハンドル調整、追加プレビューの全体表示とBASE口形timeline修正を反映します。既存0.3.7は最新インストーラーを再実行してください。同じversionの差し替えはアプリ内更新の対象になりません。公式ヘルプ・サンプル3の利用案内も現行導線へ同期します。
