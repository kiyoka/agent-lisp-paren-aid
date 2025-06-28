import { checkParenthesesLogic } from './index';
import * as fs from 'fs';
import * as path from 'path';

describe('checkParenthesesLogic', () => {
  const loadFixture = (fileName: string) => {
    return fs.readFileSync(path.join(__dirname, '../tests/fixtures', fileName), 'utf8');
  };

  test('should return an empty string for balanced parentheses (balanced-0.lisp)', () => {
    const lispCode = loadFixture('balanced-0.lisp');
    expect(checkParenthesesLogic(lispCode)).toBe('');
  });

  test('should return an error for missing closing parentheses (missing_paren-0.lisp)', () => {
    const lispCode = loadFixture('missing_paren-0.lisp');
    const expectedError = `Error: Unmatched open parentheses. Missing 2 closing parentheses.\nSuspicious line: 2`;
    expect(checkParenthesesLogic(lispCode)).toBe(expectedError);
  });

  test('should return an error for extra closing parentheses (extra_paren-0.lisp)', () => {
    const lispCode = loadFixture('extra_paren-0.lisp');
    const expectedError = 'Error: Unmatched closing parentheses. Extra 1 closing parentheses.\nSuspicious line: 2';
    expect(checkParenthesesLogic(lispCode)).toBe(expectedError);
  });

  test('should return an empty string for balanced parentheses (balanced-1.lisp)', () => {
    const lispCode = loadFixture('balanced-1.lisp');
    expect(checkParenthesesLogic(lispCode)).toBe('');
  });

  test('should return an error for missing closing parentheses (missing_paren-1.lisp)', () => {
    const lispCode = loadFixture('missing_paren-1.lisp');
    const expectedError = `Error: Unmatched closing parentheses. Missing 1 closing parentheses.\nSuspicious line: 9`;
    expect(checkParenthesesLogic(lispCode)).toBe(expectedError);
  });

  test('should return an error for extra closing parentheses (extra_paren-1.lisp)', () => {
    const lispCode = loadFixture('extra_paren-1.lisp');
    const expectedError = 'Error: Unmatched closing parentheses. Extra 1 closing parentheses.\nSuspicious line: 8';
    expect(checkParenthesesLogic(lispCode)).toBe(expectedError);
  });
});