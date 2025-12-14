import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  XCircle,
  BookMarked,
  User,
  LogOut
} from 'lucide-react';
import categoryService from '../services/category.service';
import authService from '../services/auth.service';

function CategoryManagement() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    formState: { errors: errorsAdd }
  } = useForm();

  // Load categories
  useEffect(() => {
    loadCategories();
  }, [searchTerm, sortBy, sortOrder]);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (sortBy) params.sortBy = sortBy;
      if (sortOrder) params.sortOrder = sortOrder;

      const response = await categoryService.getAllCategories(params);
      if (response.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Lỗi tải danh sách thể loại:', error);
      setErrorMessage('Đã xảy ra lỗi khi tải danh sách thể loại');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle add category
  const onAddCategory = async (data) => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');

      const response = await categoryService.createCategory(data);
      if (response.success) {
        setSuccessMessage('Thêm thể loại thành công');
        setTimeout(() => setSuccessMessage(''), 3000);
        setShowAddForm(false);
        resetAdd();
        loadCategories();
      }
    } catch (error) {
      console.error('Lỗi thêm thể loại:', error);
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.message).join(', ');
        setErrorMessage(errorMessages);
      } else {
        setErrorMessage('Đã xảy ra lỗi khi thêm thể loại');
      }
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle start editing
  const startEdit = (category) => {
    setEditingId(category.id);
    setEditingName(category.name);
    setEditingDescription(category.description || '');
    setErrorMessage('');
  };

  // Handle cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setEditingDescription('');
  };

  // Handle save edit
  const saveEdit = async () => {
    if (!editingName.trim()) {
      setErrorMessage('Tên thể loại không được để trống');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (editingName.trim().length > 50) {
      setErrorMessage('Tên thể loại không được vượt quá 50 ký tự');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');

      const data = {
        name: editingName.trim(),
        description: editingDescription.trim() || null
      };

      const response = await categoryService.updateCategory(editingId, data);
      if (response.success) {
        setSuccessMessage('Cập nhật thể loại thành công');
        setTimeout(() => setSuccessMessage(''), 3000);
        cancelEdit();
        loadCategories();
      }
    } catch (error) {
      console.error('Lỗi cập nhật thể loại:', error);
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.message).join(', ');
        setErrorMessage(errorMessages);
      } else {
        setErrorMessage('Đã xảy ra lỗi khi cập nhật thể loại');
      }
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');

      const response = await categoryService.deleteCategory(id);
      if (response.success) {
        setSuccessMessage('Xóa thể loại thành công');
        setTimeout(() => setSuccessMessage(''), 3000);
        setDeleteConfirmId(null);
        loadCategories();
      }
    } catch (error) {
      console.error('Lỗi xóa thể loại:', error);
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.message).join(', ');
        setErrorMessage(errorMessages);
      } else {
        setErrorMessage('Đã xảy ra lỗi khi xóa thể loại');
      }
      setTimeout(() => setErrorMessage(''), 5000);
      setDeleteConfirmId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <BookMarked className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Trung Tâm Thư Viện</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/books" className="text-gray-600 hover:text-gray-900 transition-colors">
                Sách
              </Link>
              <Link to="/categories" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                Thể Loại
              </Link>
              <Link to="/profile" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Hồ sơ</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-8 h-8 text-blue-600" />
                Quản Lý Thể Loại Sách
              </h1>
              <p className="mt-2 text-gray-600">Quản lý các thể loại sách trong hệ thống</p>
            </div>
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              {showAddForm ? 'Đóng' : 'Thêm thể loại sách'}
            </button>
          </div>
        </div>

        {/* Messages */}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Add Form */}
        {showAddForm && (
          <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Thêm thể loại sách mới</h2>
            <form onSubmit={handleSubmitAdd(onAddCategory)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên thể loại <span className="text-red-500">*</span>
                </label>
                <input
                  {...registerAdd('name', {
                    required: 'Tên thể loại không được để trống',
                    maxLength: {
                      value: 50,
                      message: 'Tên thể loại không được vượt quá 50 ký tự'
                    }
                  })}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tên thể loại"
                />
                {errorsAdd.name && (
                  <p className="mt-1 text-sm text-red-600">{errorsAdd.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  {...registerAdd('description')}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập mô tả (tùy chọn)"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    resetAdd();
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters and Search */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm theo tên thể loại..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Sắp xếp theo tên</option>
                <option value="books_count">Sắp xếp theo số lượng sách</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Đang tải...</div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Không có thể loại nào. Hãy thêm thể loại mới!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên thể loại
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mô tả
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số lượng sách
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === category.id ? (
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                saveEdit();
                              } else if (e.key === 'Escape') {
                                cancelEdit();
                              }
                            }}
                            className="w-full px-3 py-2 border border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            autoFocus
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === category.id ? (
                          <textarea
                            value={editingDescription}
                            onChange={(e) => setEditingDescription(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="text-sm text-gray-500">
                            {category.description || '-'}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{category.books_count}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editingId === category.id ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={saveEdit}
                              disabled={isSubmitting}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                              title="Lưu"
                            >
                              <Save className="w-5 h-5" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              disabled={isSubmitting}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              title="Hủy"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => startEdit(category)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Sửa"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(category.id)}
                              disabled={category.books_count > 0}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              title={category.books_count > 0 ? 'Không thể xóa thể loại có sách' : 'Xóa'}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">Xác nhận xóa</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa thể loại này không? Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Đang xóa...' : 'Xóa'}
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default CategoryManagement;

