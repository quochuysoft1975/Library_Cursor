import Joi from 'joi';

// Phone number validation pattern (Vietnamese format: 10-11 digits, may start with 0 or +84)
const phonePattern = /^(\+84|0)[0-9]{9,10}$/;

export const updateProfileSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Tên không được để trống',
      'string.max': 'Tên không được vượt quá 50 ký tự',
      'any.required': 'Tên không được để trống'
    }),

  phone: Joi.string()
    .trim()
    .pattern(phonePattern)
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Số điện thoại không đúng định dạng'
    }),

  address: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Địa chỉ không được để trống',
      'string.max': 'Địa chỉ không được vượt quá 255 ký tự',
      'any.required': 'Địa chỉ không được để trống'
    })
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Mật khẩu hiện tại không được để trống'
    }),

  newPassword: Joi.string()
    .min(8)
    .max(16)
    .required()
    .messages({
      'string.min': 'Mật khẩu phải từ 8-16 ký tự',
      'string.max': 'Mật khẩu phải từ 8-16 ký tự',
      'any.required': 'Mật khẩu mới không được để trống'
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Mật khẩu xác nhận không khớp',
      'any.required': 'Mật khẩu xác nhận không được để trống'
    })
});



