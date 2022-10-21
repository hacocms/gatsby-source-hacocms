# gatsby-source-hacocms

[![build, test, lint](https://github.com/hacocms/gatsby-source-hacocms/actions/workflows/test.yml/badge.svg)](https://github.com/hacocms/gatsby-source-hacocms/actions/workflows/test.yml)
[![npm version](https://badge.fury.io/js/gatsby-source-hacocms.svg)](https://badge.fury.io/js/gatsby-source-hacocms)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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
`gatsby-config.js` の `plugins` に次のような[オプション](#オプション)を追加してください。

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

この例では、プロジェクトのサブドメイン `subdomain` とアクセストークン `accessToken` を環境変数 `HACOCMS_API_SUBDOMAIN`, `HACOCMS_API_ACCESS_TOKEN` で設定し、
Gatsby のデータレイヤに取り込む API のエンドポイント `/entries` を `apis` に指定しています。

## 注意

- hacoCMS のコンテンツ ID は `id` ではなく `hacocmsId` フィールドになります。これは、GraphQL スキーマにおいて `id` フィールドがデータノードの ID として使用されるためです。

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
