#!/usr/bin/env node

/*
 * Lisp Parenthesis Checker based on the new specification.
 *
 * This implementation focuses on parenthesis counting, ignoring comments and strings.
 * - Detects extra closing parentheses and reports the line number.
 * - Detects missing closing parentheses and reports the count.
 *
 * For missing closing parentheses, the tool identifies the first line where the
 * indentation differs from the Emacs-formatted version of the file. If that
 * cannot be determined, it falls back to the first line where the parser
 * noticed an excess of opening parentheses.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { execSync } from 'child_process';

export function checkParenthesesLogic(data: string, filePath?: string): string {
  const lines = data.split('\n');
  let parenCounter = 0;
  let inString = false;
  // Stack to keep track of line numbers for each unmatched opening parenthesis
  const openStack: number[] = [];
  // DB1: Record of every ')' token encountered along with its line number
  const closeParenLines: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    for (let j = 0; j < line.length; ) {
      const char = line[j];

      // Handle string literals
      if (inString) {
        if (char === '\\') {
          j += 2; // Skip escaped character and the character itself
        } else if (char === '"') {
          inString = false;
          j++;
        } else {
          j++;
        }
        continue;
      }

      // Handle comments
      if (char === ';') {
        break; // Ignore the rest of the line
      }

      switch (char) {
        case '"':
          inString = true;
          j++;
          break;
        case '(': 
          parenCounter++;
          openStack.push(lineNum);
          j++;
          break;
        case ')':
          // Record this closing parenthesis occurrence (DB1)
          closeParenLines.push(lineNum);

          if (parenCounter > 0) {
            parenCounter--;
            openStack.pop();
          } else {
            // Found an extra closing parenthesis
            return `Error: line ${lineNum}: There are extra 1 closing parentheses.`;
          }
          j++;
          break;
        default:
          j++;
          break;
      }
    }

  }

  if (parenCounter > 0) {
    let diffLineNum = 0; // (L1)

    if (filePath) {
        const tempDir = os.tmpdir();
        const tempFilePath = path.join(tempDir, path.basename(filePath));
        try {
            fs.copyFileSync(filePath, tempFilePath);
            execSync(`emacs --batch "${tempFilePath}" --eval '(indent-region (point-min) (point-max))' -f 'save-buffer'`, { stdio: 'pipe' });

            // Compare the original file and the indented temporary file line by line.
            const originalLines = data.split('\n');
            const indentedLines = fs.readFileSync(tempFilePath, 'utf8').split('\n');

            const maxCompare = Math.min(originalLines.length, indentedLines.length);

            let seenCode = false;
            for (let i = 0; i < maxCompare; i++) {
                const origTrim = originalLines[i].trimStart();
                const indentTrim = indentedLines[i].trimStart();

                // Skip initial comment block until first non-comment code line is seen.
                if (!seenCode && origTrim.startsWith(';') && indentTrim.startsWith(';')) {
                    continue;
                }

                if (!origTrim.startsWith(';')) {
                    seenCode = true;
                }

                // Detect any difference (including indentation).
                if (originalLines[i] !== indentedLines[i]) {
                    diffLineNum = i + 1; // 1-based line number (L1)
                    break;
                }
            }

            // If no difference found but file lengths differ, point to first extra line.
            if (diffLineNum === 0 && originalLines.length !== indentedLines.length) {
                diffLineNum = maxCompare + 1;
            }

        } catch (e) {
            if (e instanceof Error) {
                return `Error: Failed to process file with Emacs: ${e.message}`;
            }
            return `Error: Failed to process file with Emacs.`;
        }
    }

    if (diffLineNum > 0) {
        // Use DB1 (closeParenLines) to search upward from L1.
        let targetLine = 0;
            // According to spec (A): start searching from the line **before** L1.
            for (let i = closeParenLines.length - 1; i >= 0; i--) {
                const l = closeParenLines[i];
                if (l < diffLineNum) {
                    targetLine = l;
                    break;
                }
            }


            if (targetLine > 0) {
                // If this candidate is before the most recent unmatched opening '(',
                // prefer the line of that unmatched opening instead. This heuristic
                // better pin-points the location where the missing ')' should be
                // inserted when multiple parentheses are missing on consecutive
                // lines (e.g. small one-liner expressions).
                const lastUnmatchedOpen = openStack.length > 0 ? openStack[openStack.length - 1] : 0;
                const finalLine = targetLine < lastUnmatchedOpen ? lastUnmatchedOpen : targetLine;
                return `Error: near line ${finalLine}: Missing ${parenCounter} closing parentheses.`;
            }
            // If we couldn't find any closing paren candidate, we'll fall back later.
    }

    // If diffLineNum could not be determined (e.g., Emacs unavailable), approximate it
    // with the most recent unmatched opening parenthesis line so that we can still
    // leverage DB1 for locating the error.
    if (diffLineNum === 0 && openStack.length > 0) {
        diffLineNum = openStack[openStack.length - 1];
        // Try DB1 search again with this approximated L1.
        for (let i = closeParenLines.length - 1; i >= 0; i--) {
            const l = closeParenLines[i];
            if (l < diffLineNum) {
                const lastUnmatchedOpen = openStack[openStack.length - 1];
                const finalLine = l < lastUnmatchedOpen ? lastUnmatchedOpen : l;
                return `Error: near line ${finalLine}: Missing ${parenCounter} closing parentheses.`;
            }
        }
    }

    // Final fallback: report using the latest unmatched opening parenthesis.
    if (openStack.length > 0) {
        const fallbackLine = openStack[openStack.length - 1];
        return `Error: near line ${fallbackLine}: Missing ${parenCounter} closing parentheses.`;
    }

    return `Error: Missing ${parenCounter} closing parentheses.`;
  }

  return 'ok';
}

// --------------------------------- CLI wrapper --------------------------

function main(): void {
  const [, , filePath] = process.argv;
  if (!filePath) {
    console.error('Please provide a file path as an argument.');
    process.exit(1);
  }

  try {
    const src = fs.readFileSync(filePath, 'utf8');
    const result = checkParenthesesLogic(src, filePath);
    console.log(result);
  } catch (e) {
    if (e instanceof Error) {
        console.error(`Error reading file: ${e.message}`);
    } else {
        console.error(`An unknown error occurred.`);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}