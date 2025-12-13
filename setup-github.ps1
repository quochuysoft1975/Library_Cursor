# Script để kết nối repository local với GitHub
# Sử dụng: .\setup-github.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup GitHub Repository" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra xem đã có remote chưa
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "Đã có remote origin: $existingRemote" -ForegroundColor Yellow
    $overwrite = Read-Host "Bạn có muốn thay đổi remote? (y/n)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Hủy bỏ." -ForegroundColor Red
        exit
    }
    git remote remove origin
}

# Nhập URL repository
Write-Host ""
Write-Host "Nhập URL repository GitHub của bạn:" -ForegroundColor Green
Write-Host "Ví dụ: https://github.com/username/repo-name.git" -ForegroundColor Gray
Write-Host "Hoặc: git@github.com:username/repo-name.git" -ForegroundColor Gray
$repoUrl = Read-Host "Repository URL"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "URL không hợp lệ!" -ForegroundColor Red
    exit 1
}

# Thêm remote
Write-Host ""
Write-Host "Đang thêm remote origin..." -ForegroundColor Yellow
git remote add origin $repoUrl

if ($LASTEXITCODE -ne 0) {
    Write-Host "Lỗi khi thêm remote!" -ForegroundColor Red
    exit 1
}

# Đổi tên branch sang main (nếu đang ở master)
$currentBranch = git branch --show-current
if ($currentBranch -eq "master") {
    Write-Host "Đang đổi tên branch từ master sang main..." -ForegroundColor Yellow
    git branch -M main
}

# Push code lên GitHub
Write-Host ""
Write-Host "Đang push code lên GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Thành công!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Repository đã được kết nối và code đã được push lên GitHub." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Lỗi khi push code!" -ForegroundColor Red
    Write-Host "Vui lòng kiểm tra:" -ForegroundColor Yellow
    Write-Host "1. URL repository có đúng không?" -ForegroundColor Yellow
    Write-Host "2. Bạn đã đăng nhập GitHub chưa?" -ForegroundColor Yellow
    Write-Host "3. Bạn có quyền truy cập repository không?" -ForegroundColor Yellow
}

