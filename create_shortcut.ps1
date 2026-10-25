$WshShell = New-Object -ComObject WScript.Shell
$Desktop = [System.Environment]::GetFolderPath('Desktop')
$ShortcutPath = Join-Path $Desktop "Bilişim Macerası.lnk"
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = "c:\Users\elifnur\Downloads\Yeni klasör\baslat.bat"
$Shortcut.WorkingDirectory = "c:\Users\elifnur\Downloads\Yeni klasör"
$Shortcut.Description = "Bilişim Macerası MEB Özel Eğitim Bilişim Portalı"
$Shortcut.IconLocation = "shell32.dll,14"
$Shortcut.Save()
Write-Host "Kısayol başarıyla oluşturuldu: $ShortcutPath"
