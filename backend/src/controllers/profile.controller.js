import prisma from '../config/database.js';
import bcrypt from 'bcryptjs';

/**
 * Get current user profile
 * @route GET /api/profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.profile.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        status: true,
        borrowCount: true,
        totalFines: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin người dùng'
      });
    }

    res.json({
      success: true,
      data: {
        profile: {
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          address: user.address || '',
          joined_date: user.createdAt,
          total_borrows: user.borrowCount,
          total_fines: parseFloat(user.totalFines)
        }
      }
    });

  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy thông tin hồ sơ'
    });
  }
};

/**
 * Update user profile
 * @route PUT /api/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const userId = req.user.userId;

    // Update profile
    const updatedUser = await prisma.profile.update({
      where: { id: userId },
      data: {
        name: name.trim(),
        phone: phone && phone.trim() ? phone.trim() : null,
        address: address.trim()
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        status: true,
        borrowCount: true,
        totalFines: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      data: {
        profile: {
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone || '',
          address: updatedUser.address || '',
          joined_date: updatedUser.createdAt,
          total_borrows: updatedUser.borrowCount,
          total_fines: parseFloat(updatedUser.totalFines)
        }
      }
    });

  } catch (error) {
    console.error('Update Profile Error:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin người dùng'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi cập nhật thông tin'
    });
  }
};

/**
 * Change user password
 * @route PUT /api/profile/password
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    // Get user with password
    const user = await prisma.profile.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin người dùng'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu hiện tại không đúng'
      });
    }

    // Check if new password is different from current password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới phải khác mật khẩu cũ'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.profile.update({
      where: { id: userId },
      data: {
        password: hashedPassword
      }
    });

    // Clear authentication cookie to force re-login
    res.clearCookie('token');

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại'
    });

  } catch (error) {
    console.error('Change Password Error:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin người dùng'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi đổi mật khẩu'
    });
  }
};

