#!/bin/bash
npx agent-lisp-paren-aid ./tests/fixtures/balanced-0.lisp
npx agent-lisp-paren-aid ./tests/fixtures/balanced-1.lisp
echo --------------------------- extra_paren-0.lisp
cat -n ./tests/fixtures/extra_paren-0.lisp
npx agent-lisp-paren-aid ./tests/fixtures/extra_paren-0.lisp
echo 
echo --------------------------- extra_paren-1.lisp
cat -n ./tests/fixtures/extra_paren-1.lisp
npx agent-lisp-paren-aid ./tests/fixtures/extra_paren-1.lisp
echo 
echo --------------------------- missing_paren-0.lisp
cat -n ./tests/fixtures/missing_paren-0.lisp
npx agent-lisp-paren-aid ./tests/fixtures/missing_paren-0.lisp
echo 
echo --------------------------- missing_paren-1.lisp
cat -n ./tests/fixtures/missing_paren-1.lisp
npx agent-lisp-paren-aid ./tests/fixtures/missing_paren-1.lisp
echo 
echo --------------------------- missing_paren-2.lisp
cat -n ./tests/fixtures/missing_paren-2.lisp
npx agent-lisp-paren-aid ./tests/fixtures/missing_paren-2.lisp
echo 
echo --------------------------- missing_paren-3.lisp
cat -n ./tests/fixtures/missing_paren-3.lisp
npx agent-lisp-paren-aid ./tests/fixtures/missing_paren-3.lisp
echo 
echo --------------------------- real_world_sample-1.el
cat -n ./tests/fixtures/real_world_sample-1.el
npx agent-lisp-paren-aid ./tests/fixtures/real_world_sample-1.el
echo 
