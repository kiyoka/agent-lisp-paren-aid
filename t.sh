#!/bin/bash -x
npx agent-lisp-paren-aid ./tests/fixtures/balanced-0.lisp
npx agent-lisp-paren-aid ./tests/fixtures/balanced-1.lisp
npx agent-lisp-paren-aid ./tests/fixtures/extra_paren-0.lisp
npx agent-lisp-paren-aid ./tests/fixtures/extra_paren-1.lisp
npx agent-lisp-paren-aid ./tests/fixtures/missing_paren-0.lisp
npx agent-lisp-paren-aid ./tests/fixtures/missing_paren-1.lisp
