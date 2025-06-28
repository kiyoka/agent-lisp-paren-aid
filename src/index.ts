#!/usr/bin/env node

import * as fs from 'fs';

function checkParentheses(filePath: string): void {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file: ${filePath}`, err);
      process.exit(1);
    }

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
        // 不足ではなく、閉じ括弧が先行した場合
        errorLine = index + 1;
      }
    });

    if (parenCount > 0) {
      // 閉じ括弧が不足している場合
      // 簡略化のため、最終行をエラー行として報告
      const lastLineWithParen = lines.map(line => line.includes('(') || line.includes(')')).lastIndexOf(true) + 1;
      console.log(`Error: Unmatched open parentheses. Missing ${parenCount} closing parentheses.`);
      console.log(`Suspicious line: ${lastLineWithParen > 0 ? lastLineWithParen : lines.length}`);
    } else if (parenCount < 0) {
        // 閉じ括弧が多すぎる場合
        console.log(`Error: Unmatched closing parentheses. Extra ${-parenCount} closing parentheses.`);
        if(errorLine !== -1) {
            console.log(`Suspicious line: ${errorLine}`);
        }
    }
    // parenCount === 0 の場合は何も出力しない
  });
}

const filePath = process.argv[2];

if (!filePath) {
  console.error('Please provide a file path as an argument.');
  process.exit(1);
}

checkParentheses(filePath);