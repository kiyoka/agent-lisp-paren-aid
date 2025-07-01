import { checkParenthesesLogic } from './index';
import * as fs from 'fs';
import * as path from 'path';

describe('checkParenthesesLogic', () => {
  const fixturesDir = path.join(__dirname, '../tests/fixtures');
  const loadFixture = (fileName: string) => {
    return fs.readFileSync(path.join(fixturesDir, fileName), 'utf8');
  };

  test('should return "ok" for balanced parentheses (balanced-0.el)', () => {
    const lispCode = loadFixture('balanced-0.el');
    expect(checkParenthesesLogic(lispCode)).toBe('ok');
  });

  test('should return "ok" for balanced parentheses (balanced-1.el)', () => {
    const lispCode = loadFixture('balanced-1.el');
    expect(checkParenthesesLogic(lispCode)).toBe('ok');
  });

  test('should return an error for missing closing parentheses (missing_paren-0.el)', () => {
    const filePath = path.join(fixturesDir, 'missing_paren-0.el');
    const lispCode = fs.readFileSync(filePath, 'utf8');
    const expectedError = `Error: near line 2: Missing 2 closing parentheses.`;
    expect(checkParenthesesLogic(lispCode, filePath)).toBe(expectedError);
  });

  test('should return an error for missing closing parentheses (missing_paren-1.el)', () => {
    const filePath = path.join(fixturesDir, 'missing_paren-1.el');
    const lispCode = fs.readFileSync(filePath, 'utf8');
    const expectedError = `Error: near line 11: Missing 1 closing parentheses.`;
    expect(checkParenthesesLogic(lispCode, filePath)).toBe(expectedError);
  });

  test('should return an error for missing closing parentheses (missing_paren-2.el)', () => {
    const filePath = path.join(fixturesDir, 'missing_paren-2.el');
    const lispCode = fs.readFileSync(filePath, 'utf8');
    const expectedError = `Error: near line 12: Missing 1 closing parentheses.`;
    expect(checkParenthesesLogic(lispCode, filePath)).toBe(expectedError);
  });

  test('should return an error for missing closing parentheses (missing_paren-3.el)', () => {
    const filePath = path.join(fixturesDir, 'missing_paren-3.el');
    const lispCode = fs.readFileSync(filePath, 'utf8');
    const expectedError = `Error: near line 9: Missing 1 closing parentheses.`;
    expect(checkParenthesesLogic(lispCode, filePath)).toBe(expectedError);
  });

  test('should return an error for extra closing parentheses (extra_paren-0.el)', () => {
    const lispCode = loadFixture('extra_paren-0.el');
    const expectedError = 'Error: line 2: There are extra 1 closing parentheses.';
    expect(checkParenthesesLogic(lispCode)).toBe(expectedError);
  });

  test('should return an error for extra closing parentheses (extra_paren-1.el)', () => {
    const lispCode = loadFixture('extra_paren-1.el');
    const expectedError = 'Error: line 9: There are extra 1 closing parentheses.';
    expect(checkParenthesesLogic(lispCode)).toBe(expectedError);
  });

  test('should return an error for real world sample (real_world_sample-1.el)', () => {
    const filePath = path.join(fixturesDir, 'real_world_sample-1.el');
    const lispCode = fs.readFileSync(filePath, 'utf8');
    const expectedError = `Error: near line 14: Missing 2 closing parentheses.`;
    expect(checkParenthesesLogic(lispCode, filePath)).toBe(expectedError);
  });
});
