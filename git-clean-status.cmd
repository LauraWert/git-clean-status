@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\git-clean-status.js" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\git-clean-status.js" %*
)