# agent-lisp-paren-aid

## プロジェクト概要

`agent-lisp-paren-aid` は、LLM（大規模言語モデル）ベースの **コーディングエージェント** が生成した Lisp コードに対して、括弧の対応を自動チェックするツールです。特に Emacs Lisp を想定していますが、単純な S 式を用いる他の Lisp 方言にも利用できます。

近年の LLM は優秀になりつつあるものの、Lisp のように括弧の対応が厳密な言語では、**閉じ括弧の不足／過剰** が混入するケースが依然として存在します。本ツールをワークフローに組み込むことで、エージェントが生成したソースを即座に検証し、修正すべき箇所をピンポイントで特定できます。

## 特長

* Emacs Lisp やlisp系言語を読み込み、括弧の不整合を指摘します。

## インストール方法

* GitHubのリリースファイルから agent-lisp-paren-aid-linux をダウンロードしパスの通った所に保存してください

## 使い方

```bash
# 基本
$ agent-lisp-paren-aid-linux <file.el>

# バージョン表示
$ agent-lisp-paren-aid-linux --version
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

MIT License
