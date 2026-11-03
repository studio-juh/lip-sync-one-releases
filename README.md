# LipSyncOne Releases

LipSyncOneのWindows配布ファイルと公式サイトを公開するrepositoryです。アプリsourceは含みません。

GitHub / 公式サイトの現行公開版は **0.5.5**。BOOTHの商品版0.3.9・ローカルZIP生成とは区別します。通常ReleaseはNSIS EXE、Updater署名、latest.json、SHA256SUMS.txtの4assetです。Store / MSIXは停止中です。

- 日本語製品ページ: https://lipsyncone.studiojuh.com/
- English: https://lipsyncone.studiojuh.com/en/
- 日本語ヘルプ: https://lipsyncone.studiojuh.com/help/
- English guide: https://lipsyncone.studiojuh.com/en/help/
- Download: https://github.com/studio-juh/lip-sync-one-releases/releases/latest

## サイトの保守

site/をCloudflare Workers Static Assetsへ公開します。公開ページは日英それぞれのcanonical / OGP / JSON-LDと相互hreflangを持ちます。切替はhashを保持し、日本語URLを維持します。説明だけの更新ではアプリのRelease assetを差し替えません。

英語の製品紹介原稿はsite/en/index.html。ヘルプ本文・共有CSS / JavaScript・画像はアプリrepositoryのdocs/offline-help/、英語原稿はそのen/index.htmlです。scripts/release/site.mjsとsite-localization.mjsで両言語を同期します。英語版の共有ファイルはsite/help/を参照します。画像は日本語UIの参照例と明記し、英語撮影済みとは扱いません。

通常のアプリ公開では、製品紹介の日本語告知2段落、英語のdata-release-announcementと版表示を既存workflowで更新します。英語の告知はReleaseの変更説明へのリンクで、古い翻訳内容を新しい版へ流用しません。

## サンプル

site/downloads/のサンプル1 / 2 / 3 ZIPはアプリrepositoryで生成し、原本の利用案内・音声クレジットを維持します。Git管理対象外のZIPを配置してからdeployします。

| Sample | 内容 | 音声 |
| --- | --- | --- |
| 1 | 茶髪の女の子・パーツPNG7枚 / WAV2本 | VOICEVOX:櫻歌ミコ |
| 2 | 銀髪の女の子・パーツPNG7枚 / WAV2本 | VOICEVOX:春日部つむぎ |
| 3 | 男の子・全身PNG2枚 / WAV1本 / GIF | VOICEVOX:猫使アル |

画像はAI生成・位置調整した素材で、音声キャラクターの公式立ち絵ではありません。サンプル3には目パチ画像はありません。利用 / 再配布と必要creditは各ZIPのREADME・話者規約を確認してください。ZIP内説明と音声は日本語です。Vita VRMは既存のsample-vrm-vita-v1 Releaseから案内し、モデルのCC0と作者creditを保持します。

## 検証と公開

pnpm checkで日英4ページのmetadata・sitemap・内部anchorとヘルプ項目、Search Console確認file、サンプルZIPを確認します。pnpm site:deployは同じ検査後に既存Cloudflare Workerへdeployします。既存の認証・custom domainを使用します。

代表UIはアプリrepositoryのscripts/release/site-ui.mjsで日英切替・英語検索・filename copy・画像拡大 / Escape・固定geometryと画像decodeを確認。PC / 狭幅・両themeでoverflowを確認します。公開後はsite.mjsのverifyPublicSiteで日英HTML・CSS / JS・サンプル3種とchecksumを実HTTP照合します。

site/google*.html、robots.txtのbot policy、共通theme、公開用headは保護します。アプリ内の更新確認はHelp → Check for Updatesからの手動操作で、起動時には自動確認しません。制作 / 音声解析はローカルで行います。
