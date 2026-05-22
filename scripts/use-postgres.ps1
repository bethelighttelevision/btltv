# Run this script before deploying to Vercel
# It switches Prisma from SQLite to PostgreSQL

Write-Host "=== Switching to PostgreSQL ===" -ForegroundColor Cyan
Write-Host ""

# Backup SQLite schema
Copy-Item "prisma\schema.prisma" "prisma\schema.sqlite.prisma" -Force

# Replace with PostgreSQL schema
Copy-Item "prisma\schema.postgres.prisma" "prisma\schema.prisma" -Force

Write-Host "✓ Schema switched to PostgreSQL" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Set DATABASE_URL to your PostgreSQL connection string in .env"
Write-Host "  2. Run: npx prisma migrate dev --name init"
Write-Host "  3. Deploy to Vercel"
Write-Host ""
Write-Host "To switch back to SQLite, run: Copy-Item prisma\schema.sqlite.prisma prisma\schema.prisma" -ForegroundColor Gray
