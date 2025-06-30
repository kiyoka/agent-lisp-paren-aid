
(defun sumibi--split-markdown-prefix (str)
  "Return cons cell (PREFIX . BODY) by separating STR into a markdown-related
prefix (leading spaces, list markers, or heading hashes) and the rest.

The PREFIX part is kept as-is and must not be fed to the conversion
engine so that constructs like `- ', `# ', or indent spaces are
preserved. BODY is the portion that should be converted."
  (cond
   ;; Markdown heading (with or without trailing space)
   ((string-match "`[ \t]*#+[ \t]*" str)
    (let* ((m (match-string 0 str))
           (prefix (if (string-suffix-p " " m) m (concat m " ")))
      (cons prefix (substring str (match-end 0)))))
   ;; Markdown list marker '-' or '*' (with or without trailing space)
   ((string-match "`[ \t]*[-*][ \t]*" str)
    (let* ((m (match-string 0 str))
           (prefix (if (string-suffix-p " " m) m (concat m " ")))
      (cons prefix (substring str (match-end 0)))))
   ;; Pure leading whitespace (code block indent etc.)
   ((string-match "`[ \t]+" str)
    (cons (match-string 0 str) (substring str (match-end 0))))
   (t
    (cons "" str))))
