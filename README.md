# agent-lisp-paren-aid

## Overview

`agent-lisp-paren-aid` is a command-line tool that automatically checks
parenthesis balancing in Lisp source code generated (or edited) by **coding
agents backed by large language models (LLMs)**.

Although the implementation is tuned for Emacs Lisp, it will also work with
any Lisp dialect that uses simple S-expressions.

Why do we need it? Even the newest LLMs sometimes produce Lisp code with
missing or extra closing parentheses.  When that happens the agent often fails
to repair the code by itself.  By inserting this tool into the workflow you
can instantly detect such mistakes and point the agent (or a human developer)
to the exact line that needs to be fixed.

## Features

* Ignores comments (`; …`) and string literals (`"…"`) while parsing.
* Records the line number of every closing parenthesis in an internal database
  (DB1).
* **Extra parenthesis** – reported immediately with the offending line number.
* **Missing parenthesis** – detected through a multi-step heuristic:
  1. Copy the target file to `/tmp/` and run Emacs `indent-region` on it.
  2. Find the first line where the indentation (or any text) differs – this is
     line L1.
  3. Starting from *one line before* L1, search upward in DB1 until the first
     `)` is found; that line is reported as the place where a closing paren is
     missing.
  4. If Emacs is unavailable, fall back to the most recent unmatched opening
     parenthesis.
* Works both as a Node.js script and as a self-contained binary produced by
  `deno compile`.
* `--version` flag prints the program name and version.

## Installation

### 1) Run with Node.js

```bash
git clone https://github.com/kiyoka/agent-lisp-paren-aid.git
cd agent-lisp-paren-aid
npm install          # install dependencies
npm run build        # transpile TypeScript to JS

# Example
node dist/index.js sample.el
```

### 2) Self-contained binary with Deno

`deno compile` can bundle the program and its dependencies into a single
executable.  See `HOW_TO_BUILD.md` for detailed instructions.

```bash
npm run deno-build   # produces bin/agent-lisp-paren-aid-linux (for your OS)
```

## Usage

```bash
# Basic usage
agent-lisp-paren-aid <file.lisp>

# Print version
agent-lisp-paren-aid --version
```

### Output examples

| Situation            | Output example                                                      |
|----------------------|---------------------------------------------------------------------|
| No problems          | `ok`                                                               |
| Extra parenthesis    | `Error: line 42: There are extra 1 closing parentheses.`            |
| Missing parenthesis  | `Error: line 10: Missing 2 closing parentheses.`                    |

*Only the first mismatch from the top of the file is reported even if multiple
errors exist.*

## Requirements

* **Node.js ≥ 18** *or* **Deno ≥ 1.44**
* **Emacs** – required only when detecting *missing* parentheses (indentation
  trick).

## Development

```bash
npm test   # run unit tests (Jest + ts-jest)
```

## License

ISC License
