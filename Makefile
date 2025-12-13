.PHONY: build clean test build-linux build-darwin build-all

# Build for current platform
build:
	mkdir -p bin
	go build -o bin/agent-lisp-paren-aid

# Build for Linux (amd64)
build-linux:
	mkdir -p bin
	GOOS=linux GOARCH=amd64 go build -o bin/agent-lisp-paren-aid-linux

# Build for macOS (amd64)
build-darwin-amd64:
	mkdir -p bin
	GOOS=darwin GOARCH=amd64 go build -o bin/agent-lisp-paren-aid-darwin-amd64

# Build for macOS (arm64 / Apple Silicon)
build-darwin-arm64:
	mkdir -p bin
	GOOS=darwin GOARCH=arm64 go build -o bin/agent-lisp-paren-aid-darwin-arm64

# Build for all platforms
build-all: build-linux build-darwin-amd64 build-darwin-arm64

# Run tests
test:
	go test -v

# Clean build artifacts
clean:
	rm -f bin/agent-lisp-paren-aid bin/agent-lisp-paren-aid-linux bin/agent-lisp-paren-aid-darwin-amd64 bin/agent-lisp-paren-aid-darwin-arm64
