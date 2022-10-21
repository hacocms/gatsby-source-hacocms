# gatsby-source-hacocms

[hacoCMS](https://hacocms.com/) の API を Gatsby で使用するためのソースプラグインです。

## インストール

```
npm install gatsby-source-hacocms

# or

yarn add gatsby-source-hacocms
```

## 使い方

新規または既存の Gatsby プロジェクトを準備してください。
プロジェクトに `gatsby-source-hacocms` プラグインをインストールしてください。
`gatsby-config.js` の `plugins` に次のようなオプションを追加してください。

```js
{
  resolve: `gatsby-source-hacocms`,
  options: {
    subdomain: process.env.HACOCMS_API_SUBDOMAIN,
    accessToken: process.env.HACOCMS_API_ACCESS_TOKEN,
    apis: [
      {
        endpoint: `entries`,
      },
    ],
  },
},
```

ここでは、プロジェクトのサブドメイン `subdomain` とアクセストークン `accessToken` を環境変数 `HACOCMS_API_SUBDOMAIN`, `HACOCMS_API_ACCESS_TOKEN` で設定し、
Gatsby のデータレイヤに取り込む API のエンドポイント `/entries` を `apis` に指定しています。

## オプション

### 必須

### `subdomain`（必須）

プロジェクトのサブドメイン

型： `String`

### `accessToken`（必須）

プロジェクトの Access-Token

型： `String`

### `apis`（必須）

取り込む API のリスト

型： `Array`

#### `apis[].endpoint`（必須）

API のエンドポイント

型： `String`
