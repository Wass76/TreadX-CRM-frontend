# PowerShell script to check ports and manage Docker containers

Write-Host "=== Port Usage Check ===" -ForegroundColor Green
Write-Host "Checking common web server ports..." -ForegroundColor Yellow

# Check common ports
$ports = @(80, 443, 3000, 5173, 8080, 8000)

foreach ($port in $ports) {
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "Port $port is in use by:" -ForegroundColor Red
        $process | ForEach-Object {
            $proc = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
            if ($proc) {
                Write-Host "  - PID: $($_.OwningProcess), Process: $($proc.ProcessName)" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "Port $port is available" -ForegroundColor Green
    }
}

Write-Host "`n=== Docker Container Status ===" -ForegroundColor Green
docker ps -a

Write-Host "`n=== Available Commands ===" -ForegroundColor Green
Write-Host "To start production container on port 3000:" -ForegroundColor Yellow
Write-Host "  docker-compose up -d treadx-crm-prod" -ForegroundColor Cyan
Write-Host "`nTo start development container on port 5173:" -ForegroundColor Yellow
Write-Host "  docker-compose --profile dev up -d treadx-crm-dev" -ForegroundColor Cyan
Write-Host "`nTo stop all containers:" -ForegroundColor Yellow
Write-Host "  docker-compose down" -ForegroundColor Cyan
Write-Host "`nTo view logs:" -ForegroundColor Yellow
Write-Host "  docker-compose logs -f" -ForegroundColor Cyan 