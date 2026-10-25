@echo off
chcp 65001 > nul
title Bilişim Macerası - MEB Özel Eğitim Portalı
cls
echo ======================================================================
echo   🚀 BİLİŞİM MACERASI: ÖZEL EĞİTİM BİLİŞİM PORTALI BAŞLATILIYOR...
echo ======================================================================
echo.
echo Tarayıcınız otomatik olarak açılacaktır (http://localhost:5173)
echo Portaldan çıkmak için bu pencereyi kapatabilirsiniz.
echo.

cd /d "%~dp0"

:: Tarayıcıyı aç
start http://localhost:5173

:: Vite geliştirme sunucusunu başlat
call npm run dev
