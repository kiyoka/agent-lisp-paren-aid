package main

import (
	"fmt"
	"os"
)

const version = "2.1.0"

func main() {
	args := os.Args[1:]

	// --version flag
	if len(args) == 1 && (args[0] == "--version" || args[0] == "-v") {
		fmt.Printf("agent-lisp-paren-aid %s\n", version)
		return
	}

	if len(args) == 0 {
		fmt.Fprintln(os.Stderr, "Usage: agent-lisp-paren-aid [--version] <file.lisp>")
		os.Exit(1)
	}

	filePath := args[0]
	data, err := os.ReadFile(filePath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error reading file: %v\n", err)
		os.Exit(1)
	}

	result := CheckParentheses(string(data), filePath)
	fmt.Println(result)
}
