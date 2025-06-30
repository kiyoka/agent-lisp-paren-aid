import { checkParenthesesLogic } from './index';
import * as fs from 'fs';
import * as path from 'path';

describe('checkParenthesesLogic', () => {
  const fixturesDir = path.join(__dirname, '../tests/fixtures');
  const loadFixture = (fileName: string) => {
    return fs.readFileSync(path.join(fixturesDir, fileName), 'utf8');
  };

  test('should return "ok" for balanced parentheses (balanced-0.lisp)', () => {
    const lispCode = loadFixture('balanced-0.lisp');
    expect(checkParenthesesLogic(lispCode)).toBe('ok');
  });

  test('should return "ok" for balanced parentheses (balanced-1.lisp)', () => {
    const lispCode = loadFixture('balanced-1.lisp');
    expect(checkParenthesesLogic(lispCode)).toBe('ok');
  });

  test('should return an error for missing closing parentheses (missing_paren-0.lisp)', () => {
    const filePath = path.join(fixturesDir, 'missing_paren-0.lisp');
    const lispCode = fs.readFileSync(filePath, 'utf8');
    const expectedError = `Error: Missing 2 closing parentheses.`;
    expect(checkParenthesesLogic(lispCode, filePath)).toBe(expectedError);
  });

    test.skip('should return an error for missing closing parentheses (missing_paren-1.lisp)', () => {
    const lispCode = loadFixture('missing_paren-1.lisp');
    const expectedError = `Error: Missing 1 closing parentheses.`;
    expect(checkParenthesesLogic(lispCode)).toBe(expectedError);
  });

  test.skip('should return an error for missing closing parentheses (missing_paren-2.lisp)', () => {
    const lispCode = loadFixture('missing_paren-2.lisp');
    const expectedError = `Error: Missing 1 closing parentheses.`;
    expect(checkParenthesesLogic(lispCode)).toBe(expectedError);
  });

  test.skip('should return an error for missing closing parentheses (missing_paren-3.lisp)', () => {
    const lispCode = loadFixture('missing_paren-3.lisp');
    const expectedError = `Error: Missing 1 closing parentheses.`;
    expect(checkParenthesesLogic(lispCode)).toBe(expectedError);
  });

  test.skip('should return an error for extra closing parentheses (extra_paren-0.lisp)', () => {
    const lispCode = loadFixture('extra_paren-0.lisp');
    const expectedError = 'Error: line 2: There are extra 1 closing parentheses.';
    expect(checkParenthesesLogic(lispCode)).toBe(expectedError);
  });

  test.skip('should return an error for extra closing parentheses (extra_paren-1.lisp)', () => {
    const lispCode = loadFixture('extra_paren-1.lisp');
    const expectedError = 'Error: line 9: There are extra 1 closing parentheses.';
    expect(checkParenthesesLogic(lispCode)).toBe(expectedError);
  });

  test.skip('should return an error for real world sample (real_world_sample-1.el)', () => {
    const lispCode = loadFixture('real_world_sample-1.el');
    const expectedError = `Error: Missing 2 closing parentheses.`;
    expect(checkParenthesesLogic(lispCode)).toBe(expectedError);
  });
});
