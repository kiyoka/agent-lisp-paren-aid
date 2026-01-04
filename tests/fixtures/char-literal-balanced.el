;; Test for character literal handling
(defun test ()
  (cond
   ((and (string= (buffer-name) "*scratch*")
         (char-equal (preceding-char) ?\)))
    (eval-print-last-sexp))
   ((eq (preceding-char) ?\()
    (message "opening paren"))
   ((eq (preceding-char) ?\n)
    (message "newline"))
   (t
    (message "other"))))
