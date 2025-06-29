#!/usr/bin/env node

/* -------------------------------------------------------------------------
 *   Lisp Parenthesis Checker (core logic)
 * -------------------------------------------------------------------------
 * 本実装は DESIGN_DOC.md に記載されている最小要件のみを満たします。
 * ・コメント(;) と文字列リテラル("…") を無視
 * ・開き/閉じ括弧の対応をカウント
 * ・スタックが残っている状態でインデント 0 の新しいトップレベルフォーム
 *   が現れた場合に「直前の閉じ括弧行」を不足位置として報告
 * – 余分な閉じ括弧は出現した行で即報告
 * – 不足は   スタックサイズ      が欠けた数
 *            最後に閉じ括弧が現れた行 (なければ EOF 行) を報告
 */

import * as fs from 'node:fs';

// --------------------------------- Internals -----------------------------

function isCommentLine(line: string): boolean {
  return line.trimStart().startsWith(';');
}

/**
 * Return indentation width where
 *   space = 1, tab = 8 (as specified in DESIGN_DOC.md).
 * Tabs and spaces may be mixed; we simply accumulate the total width until the
 * first non-whitespace character.
 */
function countLeadingSpaces(line: string): number {
  let width = 0;
  for (let idx = 0; idx < line.length; idx++) {
    const ch = line[idx];
    if (ch === ' ') {
      width += 1;
    } else if (ch === '\t') {
      width += 8;
    } else {
      break;
    }
  }
  return width;
}

// --------------------------------- Public API ---------------------------

export function checkParenthesesLogic(data: string): string {
  const lines = data.split('\n');

  const stack: { line: number; column: number }[] = [];
  let inString = false;
  let lastClosingLine = -1;

  outer: for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];

    // Skip full-line comments early.
    if (isCommentLine(rawLine)) continue;

    let colWidth = 0; // current column width (space=1, tab=8)

    // Detect start-of-line indentation before scanning chars
    const lineIndentWidth = countLeadingSpaces(rawLine);

    if (
      stack.length > 0 &&
      lineIndentWidth === 0 &&
      rawLine.trimStart().startsWith('(')
    ) {
      const suspect = lastClosingLine !== -1 ? lastClosingLine : i + 1;
      return `Error: Unmatched open parentheses. Missing ${stack.length} closing parentheses.\nSuspicious line: ${suspect}`;
    }

    let j = 0;
    while (j < rawLine.length) {
      const ch = rawLine[j];

      // Update column width *before* any other handling so that it represents
      // the position of the current character.
      if (ch === ' ') {
        colWidth += 1;
        j++;
        continue;
      }
      if (ch === '\t') {
        colWidth += 8;
        j++;
        continue;
      }

      if (inString) {
        if (ch === '\\') {
          // Skip escaped character.
          j += 2;
          continue;
        }
        if (ch === '"') inString = false;
        j++;
        continue;
      }

      // Enter string literal.
      if (ch === '"') {
        inString = true;
        j++;
        continue;
      }

      // Comment – ignore rest of line.
      if (ch === ';') {
        continue outer;
      }

      if (ch === '(') {
        // Indent mismatch check -------------------------------------------
        if (stack.length > 0) {
          const expectedIndent = stack[stack.length - 1].column;
          if (colWidth < expectedIndent) {
            const suspect = lastClosingLine !== -1 ? lastClosingLine : i + 1;
            return `Error: Unmatched closing parentheses. Extra 1 closing parentheses.\nSuspicious line: ${suspect}`;
          }
        }

        stack.push({ line: i + 1, column: colWidth });
        colWidth += 1;
      } else if (ch === ')') {
        colWidth += 1;
        lastClosingLine = i + 1;
        if (stack.length === 0) {
          // Extra closing paren detected.
          return `Error: Unmatched closing parentheses. Extra 1 closing parentheses.\nSuspicious line: ${i + 1}`;
        }
        stack.pop();
      }
      j++;
    }
  }

  // End-of-file: still unmatched openings.
  if (stack.length > 0) {
    const missing = stack.length;
    const suspect = lines.length;
    return `Error: Unmatched open parentheses. Missing ${missing} closing parentheses.\nSuspicious line: ${suspect}`;
  }

  return '';
}

// --------------------------------- CLI wrapper --------------------------

function main(): void {
  const [filePath] = Deno.args;
  if (!filePath) {
    console.error('Please provide a file path as an argument.');
    Deno.exit(1);
  }

  const src = fs.readFileSync(filePath, 'utf8');
  const result = checkParenthesesLogic(src);
  console.log(result || 'ok');
}

main();
