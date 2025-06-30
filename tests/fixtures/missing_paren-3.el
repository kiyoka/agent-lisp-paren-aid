;
(require 'url)
(require 'url-http)

(defun hello (roman arg-n)
  (condition-case _err
      (if (= "a" "b")
	  (princ "true")
	(princ "false")
    ;; error path
    (error
     (printc "error!"))))
  
(defun nextfunc ()
  (princ ""))
