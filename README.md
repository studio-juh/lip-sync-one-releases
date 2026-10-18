# LipSyncOne Releases

LipSyncOne（リップシンク One）のWindows配布ファイルと公式サイトを公開するリポジトリです。アプリケーションのソースコードは含みません。

## 公開中のアプリ

Windows 11 x64向け **v0.3.9** を公開しています。

- [最新版をダウンロード](https://github.com/studio-juh/lip-sync-one-releases/releases/latest)
- [公式サイト](https://lipsyncone.studiojuh.com/)
- [画面付きヘルプ](https://lipsyncone.studiojuh.com/help/)
- [BOOTH](https://hanairo-m.booth.pm/items/8707179)
- [お問い合わせ](https://marshmallow-qa.com/jyfux4yi4cp85hw)

通常のリリースはNSISセットアップEXE、Updater署名、latest.json、SHA256SUMS.txtの4点です。ポータブル版や旧版互換用feedは提供しません。アプリ内の更新確認は「ヘルプ → アップデートを確認」から手動で行います。起動時の自動確認はありません。配布バイナリはGitHub Releasesへ置き、Gitには登録しません。

## 公式サイトの構成

製品紹介とヘルプを site/ からCloudflare Workers Static Assetsへ公開します。GitHub Pagesは使いません。

- 製品紹介：最少2枚からの始めかた、3種類のサンプル比較、画像付き4手順、口形と解析の調整、透明動画の形式、よくある質問。
- ヘルプ：目的別の詳しい操作手順。アプリ同梱ヘルプと本文・画像を同期し、サイト固有のcanonical / OGP / JSON-LDは維持します。
- 開発中の機能：0.4.0のVRM・VRMA・キーフレーム・プロパティは「0.4.0 開発版の画面」と明記した別枠だけで紹介します。公開0.3.9の機能と混同させません。

0.4.0を公開するときは、製品紹介の開発版枠を正式機能の紹介へ更新してください。バージョン番号の一括置換だけでは、未公開の注記が残ります。

### スクリーンショット

製品紹介の共通2D操作の画像は site/assets/ の editor、home、mouth-setup、lip-sync-analysis、timeline、exportと、site/help/assets/two-image-characterです。現在の画面例は0.4.0開発版で撮影し、冒頭と各画像のキャプションにその旨を明記します。公開0.3.9で使える制作手順を主に案内し、表示の違いと区別します。VRM等の0.4.0専用画像には preview-v040- を付け、開発版の別枠で紹介します。

同じ画面の -light.png と -dark.png を対で用意し、data-theme-light / data-theme-dark属性でサイトテーマに追従させます。画像は切り抜かず全体を表示し、クリックまたはキーボードで拡大できます。Escで閉じると元の画像へフォーカスが戻ります。

サンプルのプレビューは sample-girl.png、sample-silver.png、sample-boy.png。実際の配布素材を使用します。ヘルプ本文・CSS・スクリプト・画像は site/help/ 配下で独立して管理し、製品紹介の表示へ影響させません。

### 無料サンプル

以下のZIPを site/downloads/ に配置してから検証・デプロイします。ZIPと素材の原本はGit管理対象外です。サイト掲載用のプレビュー画像・スクリーンショットはsite/assetsで管理します。

| ファイル | 内容 |
| --- | --- |
| LipSyncOne_SampleAssets_v1.zip | 茶髪の女の子、パーツPNG 7枚、櫻歌ミコの音声WAV 2本、利用案内 |
| LipSyncOne_SampleAssets2_v1.zip | 銀髪の女の子、パーツPNG 7枚、春日部つむぎの音声WAV 2本、利用案内 |
| LipSyncOne_SampleAssets3_v1.zip | 男の子の全身PNG 2枚、猫使アルの音声WAV 1本、確認用GIF、利用案内 |

アプリrepositoryの pnpm package:samples 等で publish/samples/ に生成します。サンプル3の2枚は口以外の画素が一致するよう調整済みで、目パチの差分は含みません。画像はAIで生成・位置調整したもので、音声キャラクターの公式立ち絵ではありません。声名・クレジット・利用規約のリンクは公開ページと同梱READMEで揃えてください。

VRMサンプルVitaのZIPは既存のGitHub Release sample-vrm-vita-v1 から案内します。アプリでの利用は0.4.0以降向けです。

## ローカル確認と公開

```powershell
pnpm install
pnpm dev
pnpm check
pnpm site:deploy
```

pnpm checkはmetadata、JSON-LD、ページ内アンカー、Search Console確認ファイル、サンプルZIPの存在を検証します。デプロイ前にはPCと狭幅、ライト・ダーク両テーマで、画像の読込・拡大・FAQの開閉・ダウンロード導線を確認してください。公開後は配信されたHTMLと各ZIPも確認します。

アプリrepositoryのリリーススクリプトは製品紹介の「vX.Y.Zを公開しました。」と、その直後の更新案内の段落を置換します。この2段落の構造を変更する場合は、同時に scripts/release/site.mjs のannouncement契約を更新します。

## 検索向けの公開情報

canonical、OG / Twitter Card、JSON-LD、robots.txt、sitemap.xml、llms.txtを本文と揃えます。公開版はSoftwareApplicationのsoftwareVersionに記載し、未公開機能をそのfeatureListへ混ぜません。サイトマップのlastmodは実際の内容更新日です。

本文では「リップシンク One / LipSyncOne」を使い、口パク・目パチ（まばたき・瞬き）、Windows、立ち絵アニメーション、VOICEVOX、ゆっくり実況、背景透過動画を自然な用途説明に含めます。英字の別表記はalternateNameへまとめます。検索順位や即時反映は保証しません。

site/google*.html はGoogle Search Consoleの所有権確認に使います。登録後も削除せず、再確認できる状態を保ちます。
