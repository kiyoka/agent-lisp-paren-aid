#!/usr/bin/env node

/*
 * Lisp Parenthesis Checker based on the new specification.
 *
 * This implementation focuses on parenthesis counting, ignoring comments and strings.
 * - Detects extra closing parentheses and reports the line number.
 * - Detects missing closing parentheses and reports the count.
 *
 * The logic for locating missing parentheses using Emacs is not yet implemented.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { execSync } from 'child_process';

export function checkParenthesesLogic(data: string, filePath?: string): string {
  const lines = data.split('\n');
  let parenCounter = 0;
  let inString = false;

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
          j++;
          break;
        case ')':
          if (parenCounter > 0) {
            parenCounter--;
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
    if (filePath) {
        const tempDir = os.tmpdir();
        const tempFilePath = path.join(tempDir, path.basename(filePath));
        try {
            fs.copyFileSync(filePath, tempFilePath);
            execSync(`emacs --batch "${tempFilePath}" --eval '(indent-region (point-min) (point-max))' -f 'save-buffer'`, { stdio: 'pipe' });
        } catch (e) {
            if (e instanceof Error) {
                return `Error: Failed to process file with Emacs: ${e.message}`;
            }
            return `Error: Failed to process file with Emacs.`;
        }
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