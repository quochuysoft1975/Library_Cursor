import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen, 
  DollarSign,
  Edit2,
  Lock,
  CheckCircle,
  XCircle,
  Save,
  X
} from 'lucide-react';
import profileService from '../services/profile.service';
import authService from '../services/auth.service';
import dayjs from 'dayjs';

function Profile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [profile, setProfile] = useState(null);

  // Form for updating profile
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: errorsProfile }
  } = useForm();

  // Form for changing password
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    watch: watchPassword,
    formState: { errors: errorsPassword }
  } = useForm();

  const newPassword = watchPassword('newPassword');

  // Load profile data
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const response = await profileService.getProfile();
      if (response.success) {
        setProfile(response.data.profile);
        // Reset form with profile data
        resetProfile({
          name: response.data.profile.name,
          phone: response.data.profile.phone || '',
          address: response.data.profile.address || ''
        });
      }
    } catch (error) {
      console.error('Lỗi tải hồ sơ:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Handle update profile
  const onUpdateProfile = async (data) => {
    try {
      setIsLoading(true);
      setServerError('');
      setSuccessMessage('');

      const response = await profileService.updateProfile(data);

      if (response.success) {
        setProfile(response.data.profile);
        setIsEditing(false);
        setSuccessMessage('Cập nhật thông tin thành công');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Lỗi cập nhật hồ sơ:', error);

      if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors
          .map(err => err.message)
          .join(', ');
        setServerError(errorMessages);
      } else {
        setServerError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle change password
  const onChangePassword = async (data) => {
    try {
      setIsLoading(true);
      setServerError('');
      setSuccessMessage('');

      const response = await profileService.changePassword(data);

      if (response.success) {
        setSuccessMessage('Đổi mật khẩu thành công. Vui lòng đăng nhập lại.');
        resetPassword();
        setIsChangingPassword(false);
        
        // Logout and redirect to login after 2 seconds
        setTimeout(async () => {
          await authService.logout();
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Lỗi đổi mật khẩu:', error);

      if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors
          .map(err => err.message)
          .join(', ');
        setServerError(errorMessages);
      } else {
        setServerError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    resetProfile({
      name: profile?.name || '',
      phone: profile?.phone || '',
      address: profile?.address || ''
    });
    setServerError('');
  };

  // Cancel change password
  const handleCancelChangePassword = () => {
    setIsChangingPassword(false);
    resetPassword();
    setServerError('');
  };

  // Phone validation pattern
  const phonePattern = /^(\+84|0)[0-9]{9,10}$/;

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-paper-50 via-white to-wood-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ink-800 mx-auto mb-4"></div>
          <p className="text-ink-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-paper-50 via-white to-wood-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-ink-600">Không thể tải thông tin hồ sơ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-paper-50 via-white to-wood-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-ink-900 mb-2">Hồ Sơ Cá Nhân</h1>
          <p className="text-ink-600">Quản lý thông tin tài khoản của bạn</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-green-800 font-medium">Thành công!</p>
              <p className="text-green-700 text-sm mt-1">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
            <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Lỗi!</p>
              <p className="text-red-700 text-sm mt-1">{serverError}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information Card */}
          <div className="lg:col-span-2">
            <div className="card p-6 shadow-soft-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-ink-900">Thông Tin Cá Nhân</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-outline text-sm flex items-center space-x-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Chỉnh sửa</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-ink-700 mb-2">
                      Họ và tên
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
                      <input
                        id="name"
                        type="text"
                        {...registerProfile('name', {
                          required: 'Tên không được để trống',
                          maxLength: {
                            value: 50,
                            message: 'Tên không được vượt quá 50 ký tự'
                          }
                        })}
                        className={`input pl-10 ${errorsProfile.name ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    {errorsProfile.name && (
                      <p className="mt-1 text-sm text-red-600">{errorsProfile.name.message}</p>
                    )}
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-ink-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
                      <input
                        id="email"
                        type="email"
                        value={profile.email}
                        disabled
                        className="input pl-10 bg-paper-100 cursor-not-allowed"
                      />
                    </div>
                    <p className="mt-1 text-xs text-ink-500">Email không thể thay đổi</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-ink-700 mb-2">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
                      <input
                        id="phone"
                        type="tel"
                        {...registerProfile('phone', {
                          pattern: {
                            value: phonePattern,
                            message: 'Số điện thoại không đúng định dạng'
                          }
                        })}
                        className={`input pl-10 ${errorsProfile.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                        placeholder="0123456789 hoặc +84123456789"
                      />
                    </div>
                    {errorsProfile.phone && (
                      <p className="mt-1 text-sm text-red-600">{errorsProfile.phone.message}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-ink-700 mb-2">
                      Địa chỉ
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
                      <input
                        id="address"
                        type="text"
                        {...registerProfile('address', {
                          required: 'Địa chỉ không được để trống',
                          maxLength: {
                            value: 255,
                            message: 'Địa chỉ không được vượt quá 255 ký tự'
                          }
                        })}
                        className={`input pl-10 ${errorsProfile.address ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                        placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                      />
                    </div>
                    {errorsProfile.address && (
                      <p className="mt-1 text-sm text-red-600">{errorsProfile.address.message}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4 pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={isLoading}
                      className="btn-outline flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="w-4 h-4" />
                      <span>Hủy</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Display Profile Info */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <User className="w-5 h-5 text-ink-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-ink-500">Họ và tên</p>
                        <p className="text-lg font-semibold text-ink-900">{profile.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Mail className="w-5 h-5 text-ink-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-ink-500">Email</p>
                        <p className="text-lg font-semibold text-ink-900">{profile.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Phone className="w-5 h-5 text-ink-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-ink-500">Số điện thoại</p>
                        <p className="text-lg font-semibold text-ink-900">
                          {profile.phone || 'Chưa cập nhật'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <MapPin className="w-5 h-5 text-ink-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-ink-500">Địa chỉ</p>
                        <p className="text-lg font-semibold text-ink-900">
                          {profile.address || 'Chưa cập nhật'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Calendar className="w-5 h-5 text-ink-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-ink-500">Ngày tham gia</p>
                        <p className="text-lg font-semibold text-ink-900">
                          {dayjs(profile.joined_date).format('DD/MM/YYYY')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Statistics Card */}
          <div className="lg:col-span-1">
            <div className="card p-6 shadow-soft-lg mb-6">
              <h2 className="text-xl font-bold text-ink-900 mb-4">Thống Kê</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-wood-100 rounded-xl">
                    <BookOpen className="w-6 h-6 text-wood-700" />
                  </div>
                  <div>
                    <p className="text-sm text-ink-500">Tổng số lần mượn</p>
                    <p className="text-2xl font-bold text-ink-900">{profile.total_borrows}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <DollarSign className="w-6 h-6 text-red-700" />
                  </div>
                  <div>
                    <p className="text-sm text-ink-500">Tổng tiền phạt</p>
                    <p className="text-2xl font-bold text-ink-900">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(profile.total_fines)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password Card */}
            <div className="card p-6 shadow-soft-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-ink-900">Đổi Mật Khẩu</h2>
                {!isChangingPassword && (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="btn-outline text-sm flex items-center space-x-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Đổi mật khẩu</span>
                  </button>
                )}
              </div>

              {isChangingPassword ? (
                <form onSubmit={handleSubmitPassword(onChangePassword)} className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-ink-700 mb-2">
                      Mật khẩu hiện tại
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
                      <input
                        id="currentPassword"
                        type="password"
                        {...registerPassword('currentPassword', {
                          required: 'Mật khẩu hiện tại không được để trống'
                        })}
                        className={`input pl-10 ${errorsPassword.currentPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                        placeholder="••••••••"
                      />
                    </div>
                    {errorsPassword.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">{errorsPassword.currentPassword.message}</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-ink-700 mb-2">
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
                      <input
                        id="newPassword"
                        type="password"
                        {...registerPassword('newPassword', {
                          required: 'Mật khẩu mới không được để trống',
                          minLength: {
                            value: 8,
                            message: 'Mật khẩu phải từ 8-16 ký tự'
                          },
                          maxLength: {
                            value: 16,
                            message: 'Mật khẩu phải từ 8-16 ký tự'
                          }
                        })}
                        className={`input pl-10 ${errorsPassword.newPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                        placeholder="••••••••"
                      />
                    </div>
                    {errorsPassword.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{errorsPassword.newPassword.message}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-ink-700 mb-2">
                      Xác nhận mật khẩu mới
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
                      <input
                        id="confirmPassword"
                        type="password"
                        {...registerPassword('confirmPassword', {
                          required: 'Mật khẩu xác nhận không được để trống',
                          validate: (value) =>
                            value === newPassword || 'Mật khẩu xác nhận không khớp'
                        })}
                        className={`input pl-10 ${errorsPassword.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                        placeholder="••••••••"
                      />
                    </div>
                    {errorsPassword.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errorsPassword.confirmPassword.message}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4 pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary text-sm flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelChangePassword}
                      disabled={isLoading}
                      className="btn-outline text-sm flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="w-4 h-4" />
                      <span>Hủy</span>
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-sm text-ink-500">
                  Nhấn nút "Đổi mật khẩu" để thay đổi mật khẩu của bạn
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;



