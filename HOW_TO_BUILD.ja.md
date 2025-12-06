# HOW_TO_BUILD (Go 版)
*English version is available in [HOW_TO_BUILD.md](HOW_TO_BUILD.md).*

本プロジェクトは **Go言語** で実装されており、Linux と macOS の両方で動作する **クロスプラットフォーム対応の単一バイナリ** を簡単に作成できます。ランタイム依存がないため、配布が非常に簡単です。

---

## 前提条件

1. **Go 1.21 以降** がインストールされていること
   インストール方法は公式サイトを参照してください → <https://go.dev/doc/install>

2. **Emacs** がインストールされていること（ツールの動作に必要。インデント解析に使用）

---

## ビルド手順

### 1. リポジトリを取得

```bash
git clone https://github.com/kiyoka/agent-lisp-paren-aid.git
cd agent-lisp-paren-aid
```

### 2. 現在のプラットフォーム用のバイナリをビルド

```bash
make build
```

これで `bin/agent-lisp-paren-aid` という実行ファイルが生成されます。

実行方法：

```bash
./bin/agent-lisp-paren-aid path/to/file.el
```

### 3. 複数のプラットフォーム向けにクロスコンパイル

```bash
# すべてのプラットフォーム向けにビルド (Linux, macOS Intel, macOS Apple Silicon)
make build-all
```

これで `bin/` ディレクトリに以下のバイナリが生成されます：
- `bin/agent-lisp-paren-aid-linux` (Linux amd64)
- `bin/agent-lisp-paren-aid-darwin-amd64` (macOS Intel)
- `bin/agent-lisp-paren-aid-darwin-arm64` (macOS Apple Silicon)

または、特定のプラットフォーム向けに個別にビルド：

```bash
# Linux 向けのみ
make build-linux

# macOS Intel 向けのみ
make build-darwin-amd64

# macOS Apple Silicon 向けのみ
make build-darwin-arm64
```

### 4. テストの実行

```bash
make test
# または
go test -v
```

---

## 手動ビルド (Makefile を使わない場合)

手動でビルドする場合：

```bash
# bin ディレクトリを作成（存在しない場合）
mkdir -p bin

# 現在のプラットフォーム向け
go build -o bin/agent-lisp-paren-aid

# Linux 向け
GOOS=linux GOARCH=amd64 go build -o bin/agent-lisp-paren-aid-linux

# macOS Intel 向け
GOOS=darwin GOARCH=amd64 go build -o bin/agent-lisp-paren-aid-darwin-amd64

# macOS Apple Silicon 向け
GOOS=darwin GOARCH=arm64 go build -o bin/agent-lisp-paren-aid-darwin-arm64
```

---

## よくある質問

### Q. バイナリ実行時に「Permission denied」が出る

実行権限を付与してください：`chmod +x agent-lisp-paren-aid`

### Q. テスト実行時に「emacs: command not found」エラーが出る

Emacs をインストールしてください。macOS の場合：`brew install emacs`、Linux の場合：`apt-get install emacs` または `yum install emacs`

### Q. バイナリのサイズはどのくらいですか？

各プラットフォーム向けのバイナリは約 2.5〜2.6 MB です。Deno のバイナリよりもずっと小さいです！

---

これで Go 版クロスプラットフォームビルドの作成は完了です。お疲れさまでした！
