import { checkParenthesesLogic } from './index';
import * as fs from 'fs';
import * as path from 'path';

describe('checkParenthesesLogic', () => {
  const loadFixture = (fileName: string) => {
    return fs.readFileSync(path.join(__dirname, '../tests/fixtures', fileName), 'utf8');
  };

  test('should return an empty string for balanced parentheses', () => {
    const lispCode = loadFixture('balanced.lisp');
    expect(checkParenthesesLogic(lispCode)).toBe('');
  });

  test('should return an error for missing closing parentheses', () => {
    const lispCode = loadFixture('missing_paren.lisp');
    const expectedError = 'Error: Unmatched open parentheses. Missing 1 closing parentheses.\nSuspicious line: 2';
    expect(checkParenthesesLogic(lispCode)).toBe(expectedError);
  });

  test('should return an error for extra closing parentheses', () => {
    const lispCode = loadFixture('extra_paren.lisp');
    const expectedError = 'Error: Unmatched closing parentheses. Extra 1 closing parentheses.\nSuspicious line: 2';
    expect(checkParenthesesLogic(lispCode)).toBe(expectedError);
  });
});