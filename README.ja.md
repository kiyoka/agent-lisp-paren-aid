# agent-lisp-paren-aid

## プロジェクト概要

`agent-lisp-paren-aid` は、LLM（大規模言語モデル）ベースの **コーディングエージェント** が生成した Lisp コードに対して、括弧の対応を自動チェックするツールです。特に Emacs Lisp を想定していますが、単純な S 式を用いる他の Lisp 方言にも利用できます。

近年の LLM は優秀になりつつあるものの、Lisp のように括弧の対応が厳密な言語では、**閉じ括弧の不足／過剰** が混入するケースが依然として存在します。本ツールをワークフローに組み込むことで、エージェントが生成したソースを即座に検証し、修正すべき箇所をピンポイントで特定できます。

## 特長

* コメント (`;...`) と文字列リテラル（`"..."`）を無視して解析。
* すべての閉じ括弧の行番号を内部 DB1 に記録。
* 括弧が **多すぎる** 場合 … その行番号を即座にエラー報告。
* 括弧が **足りない** 場合 …
  1. 対象ファイルを `/tmp/` にコピーして Emacs の `indent-region` で整形。
  2. 整形前後の差分で最初にズレた行 (L1) を取得。
  3. L1 の 1 行前から上向きに DB1 を検索し、最初に見つかった `)` の行を "閉じ括弧を付け忘れた行" として報告。
  4. Emacs が使えない環境では、最後に残った未マッチの `(` の行をフォールバック。
* Node.js 実行でも Deno の単一バイナリでも動作。
* `--version` フラグでバージョン確認可能。

## インストール方法

### 1) Node.js で直接実行

```bash
$ git clone https://github.com/kiyoka/agent-lisp-paren-aid.git
$ cd agent-lisp-paren-aid
$ npm install    # 依存パッケージ取得
$ npm run build  # TypeScript から JS へビルド

# 例
$ node dist/index.js sample.el
```

### 2) Deno シングルバイナリ

`deno compile` を用いて自己完結型バイナリを生成できます。詳しくは `WHO_TO_BUILD.md` を参照してください。

```bash
$ npm run deno-build   # bin/agent-lisp-paren-aid-linux が生成される
```

## 使い方

```bash
# 基本
$ agent-lisp-paren-aid <file.lisp>

# バージョン表示
$ agent-lisp-paren-aid --version
```

### 出力例

| 状態 | 出力 |
|------|------|
| 正常 | `ok` |
| 括弧が多い | `Error: line 42: There are extra 1 closing parentheses.` |
| 括弧が少ない | `Error: line 10: Missing 2 closing parentheses.` |

> **備考**: 不整合が複数あった場合でも、ファイルの先頭から最初に検出した 1 件のみを報告します。

## 前提ソフトウェア

* **Node.js v18+** もしくは **Deno v1.44+**
* **Emacs**（括弧不足時のインデント解析に使用）

## 開発

```bash
$ npm test   # Jest + ts-jest でユニットテスト実行
```

## ライセンス

ISC License
