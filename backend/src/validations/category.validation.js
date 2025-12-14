import Joi from 'joi';

export const createCategorySchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Tên thể loại không được để trống',
      'string.max': 'Tên thể loại không được vượt quá 50 ký tự',
      'any.required': 'Tên thể loại không được để trống'
    }),

  description: Joi.string()
    .trim()
    .allow(null, '')
    .messages({
      'string.base': 'Mô tả phải là chuỗi ký tự'
    })
});

export const updateCategorySchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Tên thể loại không được để trống',
      'string.max': 'Tên thể loại không được vượt quá 50 ký tự',
      'any.required': 'Tên thể loại không được để trống'
    }),

  description: Joi.string()
    .trim()
    .allow(null, '')
    .messages({
      'string.base': 'Mô tả phải là chuỗi ký tự'
    })
});

