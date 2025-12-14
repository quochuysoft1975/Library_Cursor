# Hướng dẫn tạo Repository trên GitHub

## Bước 1: Tạo Repository trên GitHub

1. Đăng nhập vào [GitHub](https://github.com)
2. Click vào biểu tượng **+** ở góc trên bên phải, chọn **New repository**
3. Điền thông tin:
   - **Repository name**: `library-management-system` (hoặc tên bạn muốn)
   - **Description**: Modern Library Management System
   - **Visibility**: Chọn Public hoặc Private
   - **KHÔNG** tích vào "Initialize this repository with a README" (vì đã có code sẵn)
   - **KHÔNG** chọn .gitignore hoặc license (đã có sẵn)
4. Click **Create repository**

## Bước 2: Kết nối Local Repository với GitHub

Sau khi tạo repository trên GitHub, bạn sẽ thấy URL của repository. Chạy các lệnh sau:

### Nếu dùng HTTPS:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Nếu dùng SSH:
```bash
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**Lưu ý**: Thay `YOUR_USERNAME` và `YOUR_REPO_NAME` bằng thông tin thực tế của bạn.

## Hoặc sử dụng script tự động

Chạy file `setup-github.ps1` và nhập URL repository của bạn khi được yêu cầu.



