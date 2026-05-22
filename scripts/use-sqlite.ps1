# Run this script to switch back to SQLite for local development

Write-Host "=== Switching to SQLite ===" -ForegroundColor Cyan

if (Test-Path "prisma\schema.sqlite.prisma") {
  Copy-Item "prisma\schema.sqlite.prisma" "prisma\schema.prisma" -Force
  Write-Host "✓ Schema switched back to SQLite" -ForegroundColor Green
  Write-Host "Run: npx prisma db push" -ForegroundColor Yellow
} else {
  Write-Host "No SQLite backup found (prisma\schema.sqlite.prisma)" -ForegroundColor Red
}
