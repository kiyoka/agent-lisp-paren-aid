.PHONY: build clean test build-linux build-darwin build-all

# Build for current platform
build:
	go build -o agent-lisp-paren-aid

# Build for Linux (amd64)
build-linux:
	GOOS=linux GOARCH=amd64 go build -o agent-lisp-paren-aid-linux

# Build for macOS (amd64)
build-darwin-amd64:
	GOOS=darwin GOARCH=amd64 go build -o agent-lisp-paren-aid-darwin-amd64

# Build for macOS (arm64 / Apple Silicon)
build-darwin-arm64:
	GOOS=darwin GOARCH=arm64 go build -o agent-lisp-paren-aid-darwin-arm64

# Build for all platforms
build-all: build-linux build-darwin-amd64 build-darwin-arm64

# Run tests
test:
	go test -v

# Clean build artifacts
clean:
	rm -f agent-lisp-paren-aid agent-lisp-paren-aid-linux agent-lisp-paren-aid-darwin-amd64 agent-lisp-paren-aid-darwin-arm64
