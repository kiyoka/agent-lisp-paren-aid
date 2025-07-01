# agent-lisp-paren-aid

## Project Overview

`agent-lisp-paren-aid` is a command-line utility that automatically checks
parenthesis matching in Lisp source code produced by **coding agents powered by
large language models (LLMs)**.  While the parser is tuned for Emacs Lisp, it
also works with other Lisp dialects that rely on simple S-expressions.

Even modern LLMs occasionally emit Lisp code with *missing* or *extra*
parentheses. Integrating this tool into your workflow lets you verify generated
code instantly and pin-point the exact line that needs to be fixed.

## Features

* **Extra parenthesis** — immediately reports the offending line number.
* **Missing parenthesis** — heuristically locates the line where a `)` should
  be inserted and reports it.

## Installation

Download the Deno-compiled single binary for your platform from the GitHub
Releases page and place it somewhere in your `$PATH`.

## Usage

```bash
# Basic
agent-lisp-paren-aid-linux <file.el>

# Print version
agent-lisp-paren-aid-linux --version
```

### Output examples

| Situation           | Example output                                                     |
|---------------------|--------------------------------------------------------------------|
| Balanced            | `ok`                                                               |
| Extra parenthesis   | `Error: line 42: There are extra 1 closing parentheses.`           |
| Missing parenthesis | `Error: line 10: Missing 2 closing parentheses.`                   |

*If multiple mismatches exist, only the first one (from the top of the file) is
reported.*

## Requirements

* **Node.js ≥ 18** or **Deno ≥ 1.44** (not required when you run the single
  binary)
* **Emacs** — used only when the tool needs to detect *missing* parentheses via
  indentation analysis

## Development

```bash
npm test   # Run unit tests (Jest + ts-jest)
```

How to build the Deno single binary: see
[HOW_TO_BUILD.md](HOW_TO_BUILD.md).

## License

MIT License
