# agent-lisp-paren-aid  
*English version is available in [README.md](README.md).* 

## プロジェクト概要

`agent-lisp-paren-aid` は、LLM（大規模言語モデル）ベースの **コーディングエージェント** が生成した Lisp コードに対して、括弧の対応を自動チェックするツールです。特に Emacs Lisp を想定していますが、単純な S 式を用いる他の Lisp 方言にも利用できます。

近年の LLM は優秀になりつつあるものの、Lisp のように括弧の対応が厳密な言語では、**閉じ括弧の不足／過剰** が混入するケースが依然として存在します。本ツールをワークフローに組み込むことで、エージェントが生成したソースを即座に検証し、修正すべき箇所をピンポイントで特定できます。

LLMが生成するLispコードは、インデントは正しいにもかかわらず **閉じ括弧の不足／過剰** が発生するという特徴があります。そこで本ツールは、Emacsを使用してコードを再インデントし、インデントが崩れた箇所を問題のある行番号として報告します。

## 特長

* 括弧が **多すぎる** 場合 … 過剰な開き括弧がある正確な行番号を報告。
* 括弧が **足りない** 場合 … 閉じ括弧が不足している正確な行番号を報告。

## インストール方法

お使いのOSに対応したクロスプラットフォームバイナリをGitHubのリリースページからダウンロードして、パスの通ったところに置いてください。

利用可能なバイナリ：
- `agent-lisp-paren-aid-linux` (Linux x86_64)
- `agent-lisp-paren-aid-darwin-amd64` (macOS Intel)
- `agent-lisp-paren-aid-darwin-arm64` (macOS Apple Silicon)

使いやすくするために、バイナリを `agent-lisp-paren-aid` にリネームすることをお勧めします。

## 使い方
```bash
# 基本
$ agent-lisp-paren-aid <file.el>

# バージョン表示
$ agent-lisp-paren-aid --version
```

### 出力例

| 状態 | 出力 |
|------|------|
| 正常 | `ok` |
| 括弧が多い | `Error: line 8: There are extra 1 closing parentheses.` |
| 括弧が少ない | `Error: line 9: Missing 1 closing parentheses.` |

> **備考**: 不整合が複数あった場合でも、ファイルの先頭から最初に検出した 1 件のみを報告します。

## コーディングエージェントのワークフローへの組み込み

以下の文章をAGENTS.md/GEMINI.md/CLAUDE.mdに記載するとエージェントがツールを積極的に利用してくれます。

```
## 編集プロセス
- <あなたのLispプログラム名> を編集した後は、必ず agent-lisp-paren-aid を実行して、閉じ括弧が合っているか確認してください。

もし括弧が整合していない場合は、修正すべき行番号を教えてくれます。

agent-lisp-paren-aid <あなたのLispプログラム名>

もし不整合が検出されたら他の編集作業はせず、一旦指摘された行番号に括弧を補う修正のみを行って、
再度 agent-lisp-paren-aid を実行するようにしてください。
LLMはLisp括弧を数えるのが苦手なため、自分で数えたり考えたりせず、必ずこのツールを使うようにしてください。
```

## 前提ソフトウェア

* **Emacs**（括弧不足時のインデント解析に使用）
* **Go 1.21+**（ソースからビルドする場合のみ必要。バイナリ実行には不要）

## 開発

```bash
$ make test   # Go のユニットテストを実行
# または
$ go test -v
```

ビルド方法は [HOW_TO_BUILD.md](HOW_TO_BUILD.md) を参照

## ライセンス

MIT License
