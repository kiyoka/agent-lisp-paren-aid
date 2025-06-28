#!/usr/bin/env node

import * as fs from 'fs';

export function checkParenthesesLogic(data: string): string {
  const lines = data.split('\n');
  let parenCount = 0;
  let errorLine = -1;

  lines.forEach((line, index) => {
    for (const char of line) {
      if (char === '(') {
        parenCount++;
      } else if (char === ')') {
        parenCount--;
      }
    }
    if (parenCount < 0 && errorLine === -1) {
      errorLine = index + 1;
    }
  });

  if (parenCount > 0) {
    const lastLineWithParen = lines.map(line => line.includes('(') || line.includes(')')).lastIndexOf(true) + 1;
    return `Error: Unmatched open parentheses. Missing ${parenCount} closing parentheses.\nSuspicious line: ${lastLineWithParen > 0 ? lastLineWithParen : lines.length}`;
  } else if (parenCount < 0) {
    let result = `Error: Unmatched closing parentheses. Extra ${-parenCount} closing parentheses.`;
    if(errorLine !== -1) {
        result += `\nSuspicious line: ${errorLine}`;
    }
    return result;
  }
  return ''; // No error
}

function checkParentheses(filePath: string): void {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file: ${filePath}`, err);
      process.exit(1);
    }
    const result = checkParenthesesLogic(data);
    if (result) {
      console.log(result);
    }
  });
}

if (require.main === module) {
    const filePath = process.argv[2];

    if (!filePath) {
      console.error('Please provide a file path as an argument.');
      process.exit(1);
    }

    checkParentheses(filePath);
}
