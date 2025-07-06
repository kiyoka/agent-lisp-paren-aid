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

// Use Node.js built-in modules with `node:` prefix for Deno compatibility
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
// Use Node.js compatibility import for Deno (node: prefix)
import { execSync } from 'node:child_process';

// ---------------------- Version helper ----------------------------------

function getPackageInfo(): { name: string; version: string } {
  let name = 'agent-lisp-paren-aid';
  let version = 'unknown';

  // Attempt CommonJS require (Node.js)
  try {
    if (typeof require !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const pkg = require('../package.json');
      name = pkg.name ?? name;
      version = pkg.version ?? version;
      return { name, version };
    }
  } catch {
    // ignore
  }

  // Attempt to read the JSON file directly (may work when running from source tree)
  try {
    const pkgPath = path.resolve(__dirname, '..', 'package.json');
    const raw = fs.readFileSync(pkgPath, 'utf8');
    const pkg = JSON.parse(raw);
    name = pkg.name ?? name;
    version = pkg.version ?? version;
  } catch {
    // ignore – fall back to defaults
  }

  // Attempt when running in a Deno compiled binary: use Deno.mainModule
  try {
    const denoGlobal: any = (globalThis as any).Deno;
    if (denoGlobal && typeof denoGlobal.mainModule === 'string') {
      const pkgUrl = new URL('../package.json', denoGlobal.mainModule);
      const raw = fs.readFileSync(pkgUrl, 'utf8');
      const pkg = JSON.parse(raw as unknown as string);
      name = pkg.name ?? name;
      version = pkg.version ?? version;
    }
  } catch {
    /* ignore */
  }

  // Attempt via import.meta.url (Deno / ESM)
  try {
    const metaUrl = Function('return typeof import!=="undefined" ? import.meta.url : undefined')();
    if (metaUrl) {
      const pkgUrl = new URL('../package.json', metaUrl);
      const raw = fs.readFileSync(pkgUrl, 'utf8');
      const pkg = JSON.parse(raw as unknown as string);
      name = pkg.name ?? name;
      version = pkg.version ?? version;
    }
  } catch {
    /* ignore */
  }

  return { name, version };
}

export function checkParenthesesLogic(data: string, filePath?: string): string {
  const lines = data.split('\n');
  let parenCounter = 0;
  let inString = false;
  // Stack to keep track of line numbers for each unmatched opening parenthesis
  const openStack: number[] = [];
  // DB1: Record of every ')' token encountered along with its line number
  const closeParenLines: number[] = [];
  let extraParenLine = 0; // Line where extra closing parenthesis was found

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
            parenCounter--; // Continue counting to check total imbalance
            if (extraParenLine === 0) {
              extraParenLine = lineNum; // Remember first occurrence
            }
          }
          j++;
          break;
        default:
          j++;
          break;
      }
    }

  }

  // Check for parenthesis imbalance or potential structural issues
  // Even if parenCounter === 0, we still check with Emacs for structural mismatches
  if (parenCounter !== 0 || filePath) {
    let diffLineNum = 0; // (L1)
    let indentChange = ''; // 'deeper' or 'shallower'

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
                    
                    // Determine if indentation became deeper or shallower
                    const origIndent = originalLines[i].length - originalLines[i].trimStart().length;
                    const indentedIndent = indentedLines[i].length - indentedLines[i].trimStart().length;
                    
                    if (indentedIndent > origIndent) {
                        indentChange = 'deeper'; // Missing parentheses
                    } else if (indentedIndent < origIndent) {
                        indentChange = 'shallower'; // Extra parentheses
                    }
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

    // Handle based on indentation change
    if (diffLineNum > 0) {
        // If parenCounter === 0 but indentation differs, we have a structural mismatch
        if (parenCounter === 0) {
            // For structural mismatches with balanced total count,
            // we need to find the actual problematic line
            
            // Search backwards from diffLineNum to find the problematic line
            let targetLine = diffLineNum;
            
            // Check for missing parentheses by looking at closeParenLines (DB1)
            if (indentChange === 'deeper') {
                // Indentation became deeper, indicating missing parentheses
                // Search backwards in closeParenLines for the last ) before diffLineNum
                for (let i = closeParenLines.length - 1; i >= 0; i--) {
                    const l = closeParenLines[i];
                    if (l < diffLineNum) {
                        targetLine = l;
                        break;
                    }
                }
                return `Error: line ${targetLine}: Missing 1 closing parentheses.`;
            } else if (indentChange === 'shallower') {
                // Indentation became shallower, indicating extra parentheses
                return `Error: line ${diffLineNum}: There are extra 1 closing parentheses.`;
            }
        } else if (parenCounter < 0) {
            // Extra parentheses detected
            // For extra parentheses, look for the line with actual extra closing parentheses
            // Search backwards from diffLineNum to find a line with more ) than (
            let targetLine = diffLineNum;
            for (let i = diffLineNum - 1; i >= 1; i--) {
                const line = lines[i - 1]; // 0-based index
                let openCount = 0;
                let closeCount = 0;
                let inStr = false;
                
                for (let j = 0; j < line.length; j++) {
                    const char = line[j];
                    
                    // Skip comments
                    if (!inStr && char === ';') break;
                    
                    if (char === '"' && (j === 0 || line[j-1] !== '\\')) {
                        inStr = !inStr;
                    } else if (!inStr) {
                        if (char === '(') openCount++;
                        else if (char === ')') closeCount++;
                    }
                }
                
                // If this line has more closing than opening parens, it's likely the error location
                if (closeCount > openCount) {
                    targetLine = i;
                    break;
                }
            }
            return `Error: line ${targetLine}: There are extra ${Math.abs(parenCounter)} closing parentheses.`;
        } else {
            // Missing parentheses - use existing logic
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
                return `Error: line ${finalLine}: Missing ${parenCounter} closing parentheses.`;
            }
        }
    }

    // Fallback for when Emacs is unavailable or diff couldn't be determined
    if (parenCounter < 0) {
        // Extra parentheses - use the first occurrence line
        if (extraParenLine > 0) {
            return `Error: line ${extraParenLine}: There are extra ${Math.abs(parenCounter)} closing parentheses.`;
        }
        return `Error: There are extra ${Math.abs(parenCounter)} closing parentheses.`;
    } else if (parenCounter > 0) {
        // Missing parentheses - use existing fallback logic
        if (diffLineNum === 0 && openStack.length > 0) {
            diffLineNum = openStack[openStack.length - 1];
            // Try DB1 search again with this approximated L1.
            for (let i = closeParenLines.length - 1; i >= 0; i--) {
                const l = closeParenLines[i];
                if (l < diffLineNum) {
                    const lastUnmatchedOpen = openStack[openStack.length - 1];
                    const finalLine = l < lastUnmatchedOpen ? lastUnmatchedOpen : l;
                    return `Error: line ${finalLine}: Missing ${parenCounter} closing parentheses.`;
                }
            }
        }

        // Final fallback: report using the latest unmatched opening parenthesis.
        if (openStack.length > 0) {
            const fallbackLine = openStack[openStack.length - 1];
            return `Error: line ${fallbackLine}: Missing ${parenCounter} closing parentheses.`;
        }

        return `Error: Missing ${parenCounter} closing parentheses.`;
    }
  }

  return 'ok';
}

// --------------------------------- CLI wrapper --------------------------

function main(): void {
  const args = process.argv.slice(2);

  // --version flag
  if (args.length === 1 && (args[0] === '--version' || args[0] === '-v')) {
    const { name, version } = getPackageInfo();
    console.log(`${name} ${version}`);
    return;
  }

  const filePath = args[0];
  if (!filePath) {
    console.error('Usage: agent-lisp-paren-aid [--version] <file.lisp>');
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

// Node.js entry point check (CommonJS) and Deno entry point.
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore - Guard for environments without `require` (e.g., Deno).
const isNodeEntry = typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module;
// Deno sets `import.meta.main` to true for the entry script.
// Use a try/catch to avoid syntax errors when transpiled to CommonJS.
const isDenoEntry = typeof (globalThis as any).Deno !== 'undefined' && typeof (globalThis as any).Deno.mainModule === 'string';

if (isNodeEntry || isDenoEntry) {
  main();
}