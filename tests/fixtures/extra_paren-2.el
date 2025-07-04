
(defun func (str)
  (cond
   ;; Markdown heading (with or without trailing space)
   ((= "a" str)
    (let* ((m (match-string 0 str))
           (prefix (if (string-suffix-p " " m) m (concat m " "))))
      (cons prefix (substring str (match-end 0))))))
   ;; Markdown list marker '-' or '*' (with or without trailing space)
   ((string-match "`[ \t]+" str)
    (cons (match-string 0 str) (substring str (match-end 0))))
   (t
    (cons "" str))))

