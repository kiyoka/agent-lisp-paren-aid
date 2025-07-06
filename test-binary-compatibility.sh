#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Test files
TEST_FILES=(
    "./tests/fixtures/balanced-0.el"
    "./tests/fixtures/balanced-1.el"
    "./tests/fixtures/extra_paren-0.el"
    "./tests/fixtures/extra_paren-1.el"
    "./tests/fixtures/missing_paren-0.el"
    "./tests/fixtures/missing_paren-1.el"
    "./tests/fixtures/missing_paren-2.el"
    "./tests/fixtures/missing_paren-3.el"
    "./tests/fixtures/real_world_sample-1.el"
    "./tests/fixtures/issue-10.el"
)

# Track test results
FAILED=0
PASSED=0

echo "Testing compatibility between npx agent-lisp-paren-aid and bin/agent-lisp-paren-aid-linux"
echo "=================================================================================="

# Check if binary exists
if [ ! -f "bin/agent-lisp-paren-aid-linux" ]; then
    echo -e "${RED}Error: bin/agent-lisp-paren-aid-linux not found!${NC}"
    echo "Please run 'npm run deno-build' first."
    exit 1
fi

# Test each file
for TEST_FILE in "${TEST_FILES[@]}"; do
    echo
    echo "Testing: $TEST_FILE"
    echo "---------------------------"
    
    # Show file content for context
    if [[ "$TEST_FILE" == *"extra_paren"* ]] || [[ "$TEST_FILE" == *"missing_paren"* ]] || [[ "$TEST_FILE" == *"real_world"* ]] || [[ "$TEST_FILE" == *"issue"* ]]; then
        echo "File content:"
        cat -n "$TEST_FILE"
        echo
    fi
    
    # Run npx version
    NPX_OUTPUT=$(npx agent-lisp-paren-aid "$TEST_FILE" 2>&1)
    NPX_EXIT_CODE=$?
    
    # Run binary version
    BIN_OUTPUT=$(bin/agent-lisp-paren-aid-linux "$TEST_FILE" 2>&1)
    BIN_EXIT_CODE=$?
    
    # Compare outputs
    if [ "$NPX_OUTPUT" == "$BIN_OUTPUT" ] && [ $NPX_EXIT_CODE -eq $BIN_EXIT_CODE ]; then
        echo -e "${GREEN}✓ PASSED${NC} - Outputs match"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC} - Outputs differ"
        echo
        echo "NPX output (exit code: $NPX_EXIT_CODE):"
        echo "$NPX_OUTPUT"
        echo
        echo "Binary output (exit code: $BIN_EXIT_CODE):"
        echo "$BIN_OUTPUT"
        ((FAILED++))
    fi
done

# Summary
echo
echo "=================================================================================="
echo "Test Summary:"
echo -e "  Passed: ${GREEN}$PASSED${NC}"
echo -e "  Failed: ${RED}$FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "\n${RED}Some tests failed!${NC}"
    exit 1
fi