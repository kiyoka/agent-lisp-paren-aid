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

import * as fs from 'fs';

// --------------------------------- Internals -----------------------------

function isCommentLine(line: string): boolean {
  return line.trimStart().startsWith(';');
}

function countLeadingSpaces(line: string): number {
  let i = 0;
  while (i < line.length && line[i] === ' ') i++;
  if (i < line.length && line[i] === '\t') {
    throw new Error('Tab characters are not supported');
  }
  return i;
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

    const indent = countLeadingSpaces(rawLine);

    // Heuristic: New top-level form while stack still contains unmatched "(" ⇒
    // we must have missed some ")" earlier.
    if (stack.length > 0 && indent === 0 && rawLine.trimStart().startsWith('(')) {
      const missing = stack.length;
      const lastOpenLine = stack[stack.length - 1].line;
      const suspect = lastClosingLine !== -1 ? Math.max(lastClosingLine, lastOpenLine) : i + 1;
      return `Error: Unmatched open parentheses. Missing ${missing} closing parentheses.\nSuspicious line: ${suspect}`;
    }

    let j = 0;
    while (j < rawLine.length) {
      const ch = rawLine[j];

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
        stack.push({ line: i + 1, column: j });
      } else if (ch === ')') {
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
    const lastOpenLine = stack[stack.length - 1].line;
    const suspect = lastClosingLine !== -1 ? Math.max(lastClosingLine, lastOpenLine) : lines.length;
    return `Error: Unmatched open parentheses. Missing ${missing} closing parentheses.\nSuspicious line: ${suspect}`;
  }

  return '';
}

// --------------------------------- CLI wrapper --------------------------

function main(): void {
  const [, , filePath] = process.argv;
  if (!filePath) {
    console.error('Please provide a file path as an argument.');
    process.exit(1);
  }

  const src = fs.readFileSync(filePath, 'utf8');
  const result = checkParenthesesLogic(src);
  console.log(result || 'ok');
}

if (require.main === module) {
  main();
}
