package main

import (
	"os"
	"path/filepath"
	"testing"
)

func loadFixture(fileName string) (string, error) {
	fixturesDir := "tests/fixtures"
	data, err := os.ReadFile(filepath.Join(fixturesDir, fileName))
	if err != nil {
		return "", err
	}
	return string(data), nil
}

func TestBalanced0(t *testing.T) {
	lispCode, err := loadFixture("balanced-0.el")
	if err != nil {
		t.Fatalf("Failed to load fixture: %v", err)
	}
	result := CheckParentheses(lispCode, "")
	if result != "ok" {
		t.Errorf("Expected 'ok', got '%s'", result)
	}
}

func TestBalanced1(t *testing.T) {
	lispCode, err := loadFixture("balanced-1.el")
	if err != nil {
		t.Fatalf("Failed to load fixture: %v", err)
	}
	result := CheckParentheses(lispCode, "")
	if result != "ok" {
		t.Errorf("Expected 'ok', got '%s'", result)
	}
}

func TestMissingParen0(t *testing.T) {
	filePath := "tests/fixtures/missing_paren-0.el"
	lispCode, err := os.ReadFile(filePath)
	if err != nil {
		t.Fatalf("Failed to load fixture: %v", err)
	}
	result := CheckParentheses(string(lispCode), filePath)
	expected := "Error: line 2: Missing 2 closing parentheses."
	if result != expected {
		t.Errorf("Expected '%s', got '%s'", expected, result)
	}
}

func TestMissingParen1(t *testing.T) {
	filePath := "tests/fixtures/missing_paren-1.el"
	lispCode, err := os.ReadFile(filePath)
	if err != nil {
		t.Fatalf("Failed to load fixture: %v", err)
	}
	result := CheckParentheses(string(lispCode), filePath)
	expected := "Error: line 9: Missing 1 closing parentheses."
	if result != expected {
		t.Errorf("Expected '%s', got '%s'", expected, result)
	}
}

func TestMissingParen2(t *testing.T) {
	filePath := "tests/fixtures/missing_paren-2.el"
	lispCode, err := os.ReadFile(filePath)
	if err != nil {
		t.Fatalf("Failed to load fixture: %v", err)
	}
	result := CheckParentheses(string(lispCode), filePath)
	expected := "Error: line 10: Missing 1 closing parentheses."
	if result != expected {
		t.Errorf("Expected '%s', got '%s'", expected, result)
	}
}

func TestMissingParen3(t *testing.T) {
	filePath := "tests/fixtures/missing_paren-3.el"
	lispCode, err := os.ReadFile(filePath)
	if err != nil {
		t.Fatalf("Failed to load fixture: %v", err)
	}
	result := CheckParentheses(string(lispCode), filePath)
	expected := "Error: line 9: Missing 1 closing parentheses."
	if result != expected {
		t.Errorf("Expected '%s', got '%s'", expected, result)
	}
}

func TestExtraParen0(t *testing.T) {
	lispCode, err := loadFixture("extra_paren-0.el")
	if err != nil {
		t.Fatalf("Failed to load fixture: %v", err)
	}
	result := CheckParentheses(lispCode, "")
	expected := "Error: line 2: There are extra 1 closing parentheses."
	if result != expected {
		t.Errorf("Expected '%s', got '%s'", expected, result)
	}
}

func TestExtraParen1(t *testing.T) {
	lispCode, err := loadFixture("extra_paren-1.el")
	if err != nil {
		t.Fatalf("Failed to load fixture: %v", err)
	}
	result := CheckParentheses(lispCode, "")
	expected := "Error: line 9: There are extra 1 closing parentheses."
	if result != expected {
		t.Errorf("Expected '%s', got '%s'", expected, result)
	}
}

func TestExtraParen2(t *testing.T) {
	filePath := "tests/fixtures/extra_paren-2.el"
	lispCode, err := os.ReadFile(filePath)
	if err != nil {
		t.Fatalf("Failed to load fixture: %v", err)
	}
	result := CheckParentheses(string(lispCode), filePath)
	expected := "Error: line 8: There are extra 1 closing parentheses."
	if result != expected {
		t.Errorf("Expected '%s', got '%s'", expected, result)
	}
}

func TestRealWorldSample1(t *testing.T) {
	filePath := "tests/fixtures/real_world_sample-1.el"
	lispCode, err := os.ReadFile(filePath)
	if err != nil {
		t.Fatalf("Failed to load fixture: %v", err)
	}
	result := CheckParentheses(string(lispCode), filePath)
	expected := "Error: line 13: Missing 2 closing parentheses."
	if result != expected {
		t.Errorf("Expected '%s', got '%s'", expected, result)
	}
}

func TestIssue10(t *testing.T) {
	filePath := "tests/fixtures/issue-10.el"
	lispCode, err := os.ReadFile(filePath)
	if err != nil {
		t.Fatalf("Failed to load fixture: %v", err)
	}
	result := CheckParentheses(string(lispCode), filePath)
	expected := "Error: line 4: Missing 1 closing parentheses."
	if result != expected {
		t.Errorf("Expected '%s', got '%s'", expected, result)
	}
}

func TestCharLiteralBalanced(t *testing.T) {
	lispCode, err := loadFixture("char-literal-balanced.el")
	if err != nil {
		t.Fatalf("Failed to load fixture: %v", err)
	}
	result := CheckParentheses(lispCode, "")
	if result != "ok" {
		t.Errorf("Expected 'ok', got '%s'", result)
	}
}
