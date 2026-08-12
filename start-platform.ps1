# EAM Platform Full Startup Script
# This script starts Docker, seeds DB, and launches both servers

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  EAM/AIM/RCM Platform - Full Startup" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Step 1: Start Docker Desktop
Write-Host "`n[1/5] Starting Docker Desktop..." -ForegroundColor Yellow
$dockerProcess = Get-Process "Docker Desktop" -ErrorAction SilentlyContinue
if (-not $dockerProcess) {
    Start-Process "C:\Users\Gopal Krishan\AppData\Local\Programs\DockerDesktop\Docker Desktop.exe"
}

# Wait for Docker engine
$maxWait = 120; $elapsed = 0
while ($elapsed -lt $maxWait) {
    Start-Sleep 5; $elapsed += 5
    try { docker ps 2>$null | Out-Null; if ($LASTEXITCODE -eq 0) { break } } catch {}
    Write-Host "  ${elapsed}s: waiting for Docker engine..."
}
if ($elapsed -ge $maxWait) { Write-Host "TIMEOUT: Docker not ready" -ForegroundColor Red; exit 1 }
Write-Host "  Docker engine ready!" -ForegroundColor Green

# Step 2: Start containers
Write-Host "`n[2/5] Starting PostgreSQL and Redis..." -ForegroundColor Yellow
docker compose up -d postgres redis 2>&1 | Out-Null
Start-Sleep 15

# Wait for healthy
$maxWait = 60; $elapsed = 0
while ($elapsed -lt $maxWait) {
    Start-Sleep 5; $elapsed += 5
    $h = docker ps --filter "health=healthy" --format "{{.Names}}" 2>$null
    if ($h -match "eam-postgres" -and $h -match "eam-redis") { break }
}
docker ps --format "table {{.Names}}`t{{.Status}}`t{{.Ports}}"
Write-Host "  Containers healthy!" -ForegroundColor Green

# Step 3: Seed data
Write-Host "`n[3/5] Seeding database..." -ForegroundColor Yellow
$assetCount = docker exec eam-postgres psql -U eam_user -d eam_platform -t -c "SELECT count(*) FROM assets;" 2>$null
$assetCount = $assetCount.Trim()
if ([int]$assetCount -lt 5) {
    Write-Host "  Running seed SQL..."
    Get-Content "packages\database\seed-data.sql" | docker exec -i eam-postgres psql -U eam_user -d eam_platform 2>&1
} else {
    Write-Host "  Database already seeded ($assetCount assets)"
}

# Show data summary
docker exec eam-postgres psql -U eam_user -d eam_platform -c "SELECT 'tenants' as entity, count(*) FROM tenants UNION ALL SELECT 'users', count(*) FROM users UNION ALL SELECT 'locations', count(*) FROM functional_locations UNION ALL SELECT 'asset_types', count(*) FROM asset_types UNION ALL SELECT 'assets', count(*) FROM assets UNION ALL SELECT 'work_orders', count(*) FROM work_orders UNION ALL SELECT 'stock_items', count(*) FROM stock_items ORDER BY entity;" 2>&1
Write-Host "  Seed complete!" -ForegroundColor Green

# Step 4: Set environment
Write-Host "`n[4/5] Setting environment..." -ForegroundColor Yellow
$env:DATABASE_URL = "postgresql://eam_user:eam_secret@localhost:5432/eam_platform"
$env:JWT_SECRET = "dev-jwt-secret-change-in-production"
$env:CORS_ORIGIN = "http://localhost:3000"
$env:PORT = "3001"
$env:NODE_ENV = "development"
$env:REDIS_URL = "redis://localhost:6379"
Write-Host "  Environment configured" -ForegroundColor Green

# Step 5: Start API server
Write-Host "`n[5/5] Starting API server on port 3001..." -ForegroundColor Yellow
Write-Host "  Starting: npx tsx watch apps/api/src/index.ts" -ForegroundColor Gray
npx tsx watch apps/api/src/index.ts 2>&1
