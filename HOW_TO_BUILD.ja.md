# HOW_TO_BUILD (Deno 版シングルバイナリ)  
*English version is available in [HOW_TO_BUILD.md](HOW_TO_BUILD.md).* 

本ツールは TypeScript 製ですが、Deno の `deno compile` コマンドを使うことで **単一実行ファイル** に変換して配布できます。以下に手順を示します。

---

## 前提条件

1. **Deno v1.44 以降** がインストールされていること  
   インストール方法は公式サイトを参照してください → <https://deno.com/runtime>

2. (任意) Linux/macOS では `chmod +x` で実行属性を付与できる権限

---

## ビルド手順

### 1. リポジトリを取得

```bash
$ git clone https://github.com/kiyoka/agent-lisp-paren-aid.git
$ cd agent-lisp-paren-aid
```

### 2. シングルバイナリを生成

最も簡単なのはデフォルトターゲット（現在の OS / CPU）向けにバイナリを作る方法です。

```bash
$ deno compile \
    --config tsconfig.deno.json \
    --allow-read \   # ファイルを読み取るための権限
    --allow-write \  # /tmp/ やコピー先にファイルを出力するための権限
    --allow-env \    # TMPDIR など環境変数へのアクセス権限
    --allow-run \    # 外部コマンド(Emacs) を実行する権限
    --output bin/agent-lisp-paren-aid \  # 生成物の出力先
    src/index.ts
```

生成後は `bin/agent-lisp-paren-aid` が出来上がり、そのまま実行できます。

```bash
$ ./bin/agent-lisp-paren-aid path/to/file.el
```

### 3. クロスコンパイル (オプション)

`--target` フラグを付与すると別プラットフォーム向けのバイナリが作れます。

```bash
# 例: Windows (x86_64)
deno compile \
  --config tsconfig.deno.json \
  --allow-read --allow-write --allow-env --allow-run \
  --target x86_64-pc-windows-msvc \
  --output bin/agent-lisp-paren-aid-win.exe \
  src/index.ts

# 例: macOS (Apple Silicon)
deno compile \
  --config tsconfig.deno.json \
  --allow-read --allow-write --allow-env --allow-run \
  --target aarch64-apple-darwin \
  --output bin/agent-lisp-paren-aid-macos-arm64 \
  src/index.ts
```

利用可能なターゲット一覧は `deno compile --help` で確認してください。

---

## ビルドスクリプトのショートカット

`package.json` には同等のコマンドを実行する npm script が用意されています。

```bash
$ npm run deno-build
```

このスクリプトは `bin/agent-lisp-paren-aid-linux` という名前でバイナリを生成します。

---

## よくある質問

### Q. バイナリ実行時に「Permission denied」が出る

生成されたファイルに実行フラグが立っていない場合があります。`chmod +x bin/agent-lisp-paren-aid` で付与してください。

### Q. `deno compile` 時に「PermissionNotGranted」エラーが出る

`--allow-read`, `--allow-write` の権限が不足している可能性があります。必要に応じて追加してください。

---

これで Deno 版シングルバイナリの作成は完了です。お疲れさまでした！
