package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

// CheckParentheses analyzes Lisp code for parenthesis matching issues.
// It uses Emacs for indentation analysis when a file path is provided.
func CheckParentheses(data string, filePath string) string {
	lines := strings.Split(data, "\n")
	parenCounter := 0
	inString := false

	// Stack to keep track of line numbers for each unmatched opening parenthesis
	openStack := []int{}

	// DB1: Record of every ')' token encountered along with its line number
	closeParenLines := []int{}

	extraParenLine := 0 // Line where extra closing parenthesis was found

	for i := 0; i < len(lines); i++ {
		line := lines[i]
		lineNum := i + 1

		for j := 0; j < len(line); {
			char := line[j]

			// Handle string literals
			if inString {
				if char == '\\' && j+1 < len(line) {
					j += 2 // Skip escaped character and the character itself
				} else if char == '"' {
					inString = false
					j++
				} else {
					j++
				}
				continue
			}

			// Handle comments
			if char == ';' {
				break // Ignore the rest of the line
			}

			switch char {
			case '"':
				inString = true
				j++
			case '(':
				parenCounter++
				openStack = append(openStack, lineNum)
				j++
			case ')':
				// Record this closing parenthesis occurrence (DB1)
				closeParenLines = append(closeParenLines, lineNum)

				if parenCounter > 0 {
					parenCounter--
					openStack = openStack[:len(openStack)-1]
				} else {
					// Found an extra closing parenthesis
					parenCounter-- // Continue counting to check total imbalance
					if extraParenLine == 0 {
						extraParenLine = lineNum // Remember first occurrence
					}
				}
				j++
			default:
				j++
			}
		}
	}

	// Check for parenthesis imbalance or potential structural issues
	// Even if parenCounter == 0, we still check with Emacs for structural mismatches
	if parenCounter != 0 || filePath != "" {
		diffLineNum := 0      // (L1)
		indentChange := ""    // 'deeper' or 'shallower'

		if filePath != "" {
			tempDir := os.TempDir()
			tempFilePath := filepath.Join(tempDir, filepath.Base(filePath))

			// Copy file to temp directory
			if err := copyFile(filePath, tempFilePath); err == nil {
				// Use Emacs to indent the file
				cmd := exec.Command("emacs", "--batch", tempFilePath,
					"--eval", "(indent-region (point-min) (point-max))",
					"-f", "save-buffer")
				cmd.Run() // Ignore errors

				// Compare the original file and the indented temporary file line by line
				indentedData, err := os.ReadFile(tempFilePath)
				if err == nil {
					originalLines := lines
					indentedLines := strings.Split(string(indentedData), "\n")
					maxCompare := min(len(originalLines), len(indentedLines))

					seenCode := false
					for i := 0; i < maxCompare; i++ {
						origTrim := strings.TrimLeft(originalLines[i], " \t")
						indentTrim := strings.TrimLeft(indentedLines[i], " \t")

						// Skip initial comment block until first non-comment code line is seen
						if !seenCode && strings.HasPrefix(origTrim, ";") && strings.HasPrefix(indentTrim, ";") {
							continue
						}

						if !strings.HasPrefix(origTrim, ";") {
							seenCode = true
						}

						// Detect any difference (including indentation)
						if originalLines[i] != indentedLines[i] {
							diffLineNum = i + 1 // 1-based line number (L1)

							// Determine if indentation became deeper or shallower
							origIndent := len(originalLines[i]) - len(strings.TrimLeft(originalLines[i], " \t"))
							indentedIndent := len(indentedLines[i]) - len(strings.TrimLeft(indentedLines[i], " \t"))

							if indentedIndent > origIndent {
								indentChange = "deeper" // Missing parentheses
							} else if indentedIndent < origIndent {
								indentChange = "shallower" // Extra parentheses
							}
							break
						}
					}

					// If no difference found but file lengths differ, point to first extra line
					if diffLineNum == 0 && len(originalLines) != len(indentedLines) {
						diffLineNum = maxCompare + 1
					}
				}
			}
		}

		// Handle based on indentation change
		if diffLineNum > 0 {
			// If parenCounter == 0 but indentation differs, we have a structural mismatch
			if parenCounter == 0 {
				// For structural mismatches with balanced total count,
				// we need to find the actual problematic line

				// Search backwards from diffLineNum to find the problematic line
				targetLine := diffLineNum

				// Check for missing parentheses by looking at closeParenLines (DB1)
				if indentChange == "deeper" {
					// Indentation became deeper, indicating missing parentheses
					// Search backwards in closeParenLines for the last ) before diffLineNum
					for i := len(closeParenLines) - 1; i >= 0; i-- {
						l := closeParenLines[i]
						if l < diffLineNum {
							targetLine = l
							break
						}
					}
					return fmt.Sprintf("Error: line %d: Missing 1 closing parentheses.", targetLine)
				} else if indentChange == "shallower" {
					// Indentation became shallower, indicating extra parentheses
					return fmt.Sprintf("Error: line %d: There are extra 1 closing parentheses.", diffLineNum)
				}
			} else if parenCounter < 0 {
				// Extra parentheses detected
				// For extra parentheses, look for the line with actual extra closing parentheses
				// Search backwards from diffLineNum to find a line with more ) than (
				targetLine := diffLineNum
				for i := diffLineNum - 1; i >= 1; i-- {
					line := lines[i-1] // 0-based index
					openCount := 0
					closeCount := 0
					inStr := false

					for j := 0; j < len(line); j++ {
						char := line[j]

						// Skip comments
						if !inStr && char == ';' {
							break
						}

						if char == '"' && (j == 0 || line[j-1] != '\\') {
							inStr = !inStr
						} else if !inStr {
							if char == '(' {
								openCount++
							} else if char == ')' {
								closeCount++
							}
						}
					}

					// If this line has more closing than opening parens, it's likely the error location
					if closeCount > openCount {
						targetLine = i
						break
					}
				}
				return fmt.Sprintf("Error: line %d: There are extra %d closing parentheses.", targetLine, abs(parenCounter))
			} else {
				// Missing parentheses - use existing logic
				// Use DB1 (closeParenLines) to search upward from L1
				targetLine := 0
				// According to spec (A): start searching from the line **before** L1
				for i := len(closeParenLines) - 1; i >= 0; i-- {
					l := closeParenLines[i]
					if l < diffLineNum {
						targetLine = l
						break
					}
				}

				if targetLine > 0 {
					// If this candidate is before the most recent unmatched opening '(',
					// prefer the line of that unmatched opening instead
					lastUnmatchedOpen := 0
					if len(openStack) > 0 {
						lastUnmatchedOpen = openStack[len(openStack)-1]
					}
					if targetLine < lastUnmatchedOpen {
						targetLine = lastUnmatchedOpen
					}
					return fmt.Sprintf("Error: line %d: Missing %d closing parentheses.", targetLine, parenCounter)
				}
			}
		}

		// Fallback for when Emacs is unavailable or diff couldn't be determined
		if parenCounter < 0 {
			// Extra parentheses - use the first occurrence line
			if extraParenLine > 0 {
				return fmt.Sprintf("Error: line %d: There are extra %d closing parentheses.", extraParenLine, abs(parenCounter))
			}
			return fmt.Sprintf("Error: There are extra %d closing parentheses.", abs(parenCounter))
		} else if parenCounter > 0 {
			// Missing parentheses - use existing fallback logic
			if diffLineNum == 0 && len(openStack) > 0 {
				diffLineNum = openStack[len(openStack)-1]
				// Try DB1 search again with this approximated L1
				for i := len(closeParenLines) - 1; i >= 0; i-- {
					l := closeParenLines[i]
					if l < diffLineNum {
						lastUnmatchedOpen := openStack[len(openStack)-1]
						finalLine := l
						if l < lastUnmatchedOpen {
							finalLine = lastUnmatchedOpen
						}
						return fmt.Sprintf("Error: line %d: Missing %d closing parentheses.", finalLine, parenCounter)
					}
				}
			}

			// Final fallback: report using the latest unmatched opening parenthesis
			if len(openStack) > 0 {
				fallbackLine := openStack[len(openStack)-1]
				return fmt.Sprintf("Error: line %d: Missing %d closing parentheses.", fallbackLine, parenCounter)
			}

			return fmt.Sprintf("Error: Missing %d closing parentheses.", parenCounter)
		}
	}

	return "ok"
}

// Helper function to copy a file
func copyFile(src, dst string) error {
	data, err := os.ReadFile(src)
	if err != nil {
		return err
	}
	return os.WriteFile(dst, data, 0644)
}

// Helper function to get the absolute value
func abs(n int) int {
	if n < 0 {
		return -n
	}
	return n
}

// Helper function to get the minimum of two integers
func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
