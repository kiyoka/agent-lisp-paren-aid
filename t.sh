#!/bin/bash
npx agent-lisp-paren-aid ./tests/fixtures/balanced-0.el
npx agent-lisp-paren-aid ./tests/fixtures/balanced-1.el
echo --------------------------- extra_paren-0.el
cat -n ./tests/fixtures/extra_paren-0.el
npx agent-lisp-paren-aid ./tests/fixtures/extra_paren-0.el
echo 
echo --------------------------- extra_paren-1.el
cat -n ./tests/fixtures/extra_paren-1.el
npx agent-lisp-paren-aid ./tests/fixtures/extra_paren-1.el
echo 
echo --------------------------- missing_paren-0.el
cat -n ./tests/fixtures/missing_paren-0.el
npx agent-lisp-paren-aid ./tests/fixtures/missing_paren-0.el
echo 
echo --------------------------- missing_paren-1.el
cat -n ./tests/fixtures/missing_paren-1.el
npx agent-lisp-paren-aid ./tests/fixtures/missing_paren-1.el
echo 
echo --------------------------- missing_paren-2.el
cat -n ./tests/fixtures/missing_paren-2.el
npx agent-lisp-paren-aid ./tests/fixtures/missing_paren-2.el
echo 
echo --------------------------- missing_paren-3.el
cat -n ./tests/fixtures/missing_paren-3.el
npx agent-lisp-paren-aid ./tests/fixtures/missing_paren-3.el
echo 
echo --------------------------- real_world_sample-1.el
cat -n ./tests/fixtures/real_world_sample-1.el
npx agent-lisp-paren-aid ./tests/fixtures/real_world_sample-1.el
echo 
