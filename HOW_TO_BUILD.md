# HOW TO BUILD (Deno single-binary version)

This project is written in TypeScript, but you can turn it into a **single stand-alone executable** by using Deno’s `deno compile` command. That makes distribution simple—no runtime dependencies are required except the binary itself.

---

## Prerequisites

1. **Deno v1.44 or later** must be installed. Install instructions: <https://deno.com/runtime>
2. (Optional) On Linux/macOS you’ll need permission to mark the file as executable with `chmod +x`.

---

## Build steps

### 1. Clone the repository

```bash
git clone https://github.com/kiyoka/agent-lisp-paren-aid.git
cd agent-lisp-paren-aid
```

### 2. Build a binary for your current OS / CPU

```bash
deno compile \
  --config tsconfig.deno.json \     # ignore Node-specific tsconfig options
  --allow-read \                    # the tool reads source files
  --allow-write \                   # writes to /tmp when using Emacs
  --output bin/agent-lisp-paren-aid \  # output file name
  src/index.ts
```

Run it:

```bash
./bin/agent-lisp-paren-aid path/to/file.el
```

### 3. Cross-compile (optional)

```bash
# Windows (x86_64)
deno compile \
  --config tsconfig.deno.json \
  --allow-read --allow-write \
  --target x86_64-pc-windows-msvc \
  --output bin/agent-lisp-paren-aid-win.exe \
  src/index.ts

# macOS (Apple Silicon)
deno compile \
  --config tsconfig.deno.json \
  --allow-read --allow-write \
  --target aarch64-apple-darwin \
  --output bin/agent-lisp-paren-aid-macos-arm64 \
  src/index.ts
```

See `deno compile --help` for the full target list.

---

## npm shortcut

```bash
npm run deno-build
```

This creates `bin/agent-lisp-paren-aid-linux` by default (the name may differ if you edited the script).

---

## FAQ

**Q. Executable says “Permission denied”**  
Add execute permission: `chmod +x bin/agent-lisp-paren-aid`.

**Q. `PermissionNotGranted` error during compile**  
Pass both `--allow-read` and `--allow-write` to `deno compile`.

---

That’s it—your Deno single-binary build is ready. Happy hacking!
