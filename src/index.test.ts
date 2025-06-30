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
    const expectedError = `Error: Indentation mismatch detected at line 2.
This suggests a parenthesis issue. Please determine the cause based on the following possibilities:
1. The expression block ending before line 2 has too few closing parentheses.
2. A closing parenthesis is missing somewhere between line 2 and line 2.`;
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
    const expectedError = `Error: Indentation mismatch detected at line 11.
This suggests a parenthesis issue. Please determine the cause based on the following possibilities:
1. The expression block ending before line 11 has too few closing parentheses.
2. A closing parenthesis is missing somewhere between line 5 and line 11.`;
    expect(checkParenthesesLogic(lispCode)).toBe(expectedError);
  });

  test('should return an error for missing closing parentheses (missing_paren-2.lisp)', () => {
    const lispCode = loadFixture('missing_paren-2.lisp');
    const expectedError = `Error: Indentation mismatch detected at line 12.
This suggests a parenthesis issue. Please determine the cause based on the following possibilities:
1. The expression block ending before line 12 has too few closing parentheses.
2. A closing parenthesis is missing somewhere between line 5 and line 12.`;
    expect(checkParenthesesLogic(lispCode)).toBe(expectedError);
  });

  test('should return an error for missing closing parentheses (missing_paren-3.lisp)', () => {
    const lispCode = loadFixture('missing_paren-3.lisp');
    const expectedError = `Error: Indentation mismatch detected at line 11.
This suggests a parenthesis issue. Please determine the cause based on the following possibilities:
1. The expression block ending before line 11 has too few closing parentheses.
2. A closing parenthesis is missing somewhere between line 7 and line 11.`;
    expect(checkParenthesesLogic(lispCode)).toBe(expectedError);
  });

  test('should return an error for extra closing parentheses (extra_paren-1.lisp)', () => {
    const lispCode = loadFixture('extra_paren-1.lisp');
    const expectedError = 'Error: Unmatched closing parentheses. Extra 1 closing parentheses.\nSuspicious line: 9';
    expect(checkParenthesesLogic(lispCode)).toBe(expectedError);
  });

  // @TODO: This test is skipped because the current logic cannot handle this complex case.
  // The logic needs to be improved to understand S-expression structures (e.g., let*)
  // to correctly identify indentation errors in nested forms.
  test('should return an error for real world sample (real_world_sample-1.el)', () => {
    const lispCode = loadFixture('real_world_sample-1.el');
    const expectedError = `Error: Indentation mismatch detected at line 25.
This suggests a parenthesis issue. Please determine the cause based on the following possibilities:
1. The expression block ending before line 25 has too few closing parentheses.
2. A closing parenthesis is missing somewhere between line 9 and line 25.`;
    expect(checkParenthesesLogic(lispCode)).toBe(expectedError);
  });
});