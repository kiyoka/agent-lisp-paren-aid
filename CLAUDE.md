
本プロジェクトはGo言語で実装されています。
- プログラム本体は agent-lisp-paren-aid という名前で実行できるようにします。
- ソースコードのコメントは英語で書きます。
- クロスプラットフォーム対応のバイナリをビルドできます（Linux、macOS Intel、macOS Apple Silicon）。
- バイナリファイルは.gitignoreに含まれているためgitにはコミットしません。

claude codeのセッションは日本語でお願いします。

了解です。一旦ソースコードを確認させてください。

コミットして、コミットログも英語で書いてください。

HOW_TO_BUILD.ja.mdと、README.ja.mdを最新に更新してください。

package.jsonは不要になったので削除してください。
package-lock.json不要です。

go言語になったので、他の不要なファイルがあります。以下のファイルを削除してください。
jest.config.js
src/index.test.ts
src/index.ts
tsconfig.deno.json
tsconfig.json

以下の4つのファイルはビルド後、binディレクトリに保存するようにしてください
agent-lisp-paren-aid			agent-lisp-paren-aid-darwin-arm64
agent-lisp-paren-aid-darwin-amd64	agent-lisp-paren-aid-linux

