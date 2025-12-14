import { Link } from 'react-router-dom';
import { BookMarked, User, LogOut } from 'lucide-react';
import authService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

function Books() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-paper-50 via-white to-wood-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-paper-200">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <BookMarked className="w-8 h-8 text-ink-800" />
              <h1 className="text-2xl font-bold text-ink-900">Trung Tâm Thư Viện</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/books" className="text-ink-600 hover:text-ink-900 transition-colors">
                Sách
              </Link>
              <Link to="/categories" className="text-ink-600 hover:text-ink-900 transition-colors">
                Thể Loại
              </Link>
              <Link to="/profile" className="btn-outline text-sm flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Hồ sơ</span>
              </Link>
              <button
                onClick={handleLogout}
                className="btn-outline text-sm flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-ink-900 mb-4">Danh Sách Sách</h1>
            <p className="text-ink-600 text-lg">Khám phá bộ sưu tập sách của chúng tôi</p>
          </div>

          {/* Placeholder for books list */}
          <div className="card p-8 shadow-soft-lg">
            <div className="text-center py-12">
              <BookMarked className="w-16 h-16 text-ink-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-ink-900 mb-2">Tính năng đang phát triển</h2>
              <p className="text-ink-600 mb-6">
                Trang danh sách sách sẽ được triển khai trong feature 2.2.3
              </p>
              <Link to="/profile" className="btn-primary">
                Xem hồ sơ cá nhân
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Books;


