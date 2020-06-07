@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\node_modules\minetelegram\bin\minetelegram" %*
) ELSE (
  node  "%~dp0\node_modules\minetelegram\bin\minetelegram" %*
)