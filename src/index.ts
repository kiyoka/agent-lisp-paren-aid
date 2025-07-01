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
        for (let i = closeParenLines.length - 1; i >= 0; i--) {
            const l = closeParenLines[i];
            if (l <= diffLineNum) {
                targetLine = l;
                break;
            }
        }

        if (targetLine > 0) {
            return `Error: near line ${targetLine}: Missing ${parenCounter} closing parentheses.`;
        }
        // If we couldn't find any closing paren above diffLineNum, fall back later.
    }

    // Fallback: use the most recently opened unmatched opening parenthesis.
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