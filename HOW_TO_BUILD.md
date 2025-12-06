# HOW TO BUILD (Go version)
*日本語版は [HOW_TO_BUILD.ja.md](HOW_TO_BUILD.ja.md) をご覧ください。*

This project is written in **Go**, which makes it easy to create **cross-platform single-binary executables** that work on both Linux and macOS without any runtime dependencies.

---

## Prerequisites

1. **Go 1.21 or later** must be installed. Install instructions: <https://go.dev/doc/install>
2. **Emacs** is required for the tool to work (used for indentation analysis)

---

## Build steps

### 1. Clone the repository

```bash
git clone https://github.com/kiyoka/agent-lisp-paren-aid.git
cd agent-lisp-paren-aid
```

### 2. Build a binary for your current platform

```bash
make build
```

This creates the `agent-lisp-paren-aid` executable.

Run it:

```bash
./agent-lisp-paren-aid path/to/file.el
```

### 3. Cross-compile for multiple platforms

```bash
# Build for all platforms (Linux, macOS Intel, macOS Apple Silicon)
make build-all
```

This creates:
- `agent-lisp-paren-aid-linux` (Linux amd64)
- `agent-lisp-paren-aid-darwin-amd64` (macOS Intel)
- `agent-lisp-paren-aid-darwin-arm64` (macOS Apple Silicon)

Or build for specific platforms:

```bash
# Build for Linux only
make build-linux

# Build for macOS Intel only
make build-darwin-amd64

# Build for macOS Apple Silicon only
make build-darwin-arm64
```

### 4. Run tests

```bash
make test
# or
go test -v
```

---

## Manual build (without Makefile)

If you prefer to build manually:

```bash
# Build for current platform
go build -o agent-lisp-paren-aid

# Build for Linux
GOOS=linux GOARCH=amd64 go build -o agent-lisp-paren-aid-linux

# Build for macOS Intel
GOOS=darwin GOARCH=amd64 go build -o agent-lisp-paren-aid-darwin-amd64

# Build for macOS Apple Silicon
GOOS=darwin GOARCH=arm64 go build -o agent-lisp-paren-aid-darwin-arm64
```

---

## FAQ

**Q. Executable says "Permission denied"**
Add execute permission: `chmod +x agent-lisp-paren-aid`.

**Q. Tests fail with "emacs: command not found"**
Install Emacs. On macOS: `brew install emacs`. On Linux: `apt-get install emacs` or `yum install emacs`.

**Q. How big are the binaries?**
Around 2.5-2.6 MB for each platform. Much smaller than Deno binaries!

---

That's it—your Go cross-platform build is ready. Happy hacking!
