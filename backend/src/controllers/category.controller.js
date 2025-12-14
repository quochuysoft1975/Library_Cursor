import prisma from '../config/database.js';

/**
 * Get all categories with optional search and sort
 * @route GET /api/categories
 */
export const getAllCategories = async (req, res) => {
  try {
    const { search, sortBy = 'name', sortOrder = 'asc' } = req.query;

    // Build where clause for search
    const where = search
      ? {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        }
      : {};

    // Build orderBy clause
    const orderBy = {};
    if (sortBy === 'name') {
      orderBy.name = sortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc';
    } else if (sortBy === 'books_count') {
      // Sort by number of books (will be computed)
      orderBy.createdAt = 'asc'; // Fallback
    } else {
      orderBy.createdAt = sortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc';
    }

    // Get categories with book count
    const categories = await prisma.bookCategory.findMany({
      where,
      orderBy,
      include: {
        _count: {
          select: { books: true }
        }
      }
    });

    // Format response with books_count
    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      created_at: category.createdAt,
      updated_at: category.updatedAt,
      books_count: category._count.books
    }));

    // Sort by books_count if needed (since we can't do it in Prisma easily)
    if (sortBy === 'books_count') {
      formattedCategories.sort((a, b) => {
        const diff = a.books_count - b.books_count;
        return sortOrder.toLowerCase() === 'desc' ? -diff : diff;
      });
    }

    res.json({
      success: true,
      data: {
        categories: formattedCategories
      }
    });

  } catch (error) {
    console.error('Get All Categories Error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy danh sách thể loại'
    });
  }
};

/**
 * Create a new category
 * @route POST /api/categories
 */
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if category with same name already exists
    const existingCategory = await prisma.bookCategory.findUnique({
      where: { name: name.trim() }
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Thể loại đã tồn tại',
        errors: [
          {
            field: 'name',
            message: 'Thể loại đã tồn tại'
          }
        ]
      });
    }

    // Create new category
    const newCategory = await prisma.bookCategory.create({
      data: {
        name: name.trim(),
        description: description && description.trim() ? description.trim() : null
      },
      include: {
        _count: {
          select: { books: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Thêm thể loại thành công',
      data: {
        category: {
          id: newCategory.id,
          name: newCategory.name,
          description: newCategory.description,
          created_at: newCategory.createdAt,
          updated_at: newCategory.updatedAt,
          books_count: newCategory._count.books
        }
      }
    });

  } catch (error) {
    console.error('Create Category Error:', error);
    
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Thể loại đã tồn tại',
        errors: [
          {
            field: 'name',
            message: 'Thể loại đã tồn tại'
          }
        ]
      });
    }

    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi thêm thể loại'
    });
  }
};

/**
 * Update a category
 * @route PATCH /api/categories/:id
 */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Check if category exists
    const existingCategory = await prisma.bookCategory.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thể loại'
      });
    }

    // Check if another category with same name exists (excluding current one)
    const duplicateCategory = await prisma.bookCategory.findFirst({
      where: {
        name: name.trim(),
        NOT: { id }
      }
    });

    if (duplicateCategory) {
      return res.status(400).json({
        success: false,
        message: 'Thể loại đã tồn tại',
        errors: [
          {
            field: 'name',
            message: 'Thể loại đã tồn tại'
          }
        ]
      });
    }

    // Update category
    const updatedCategory = await prisma.bookCategory.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description && description.trim() ? description.trim() : null
      },
      include: {
        _count: {
          select: { books: true }
        }
      }
    });

    res.json({
      success: true,
      message: 'Cập nhật thể loại thành công',
      data: {
        category: {
          id: updatedCategory.id,
          name: updatedCategory.name,
          description: updatedCategory.description,
          created_at: updatedCategory.createdAt,
          updated_at: updatedCategory.updatedAt,
          books_count: updatedCategory._count.books
        }
      }
    });

  } catch (error) {
    console.error('Update Category Error:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thể loại'
      });
    }

    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Thể loại đã tồn tại',
        errors: [
          {
            field: 'name',
            message: 'Thể loại đã tồn tại'
          }
        ]
      });
    }

    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi cập nhật thể loại'
    });
  }
};

/**
 * Delete a category
 * @route DELETE /api/categories/:id
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists and get book count
    const category = await prisma.bookCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { books: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thể loại'
      });
    }

    // Check if category has any books
    if (category._count.books > 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa. Thể loại đang có sách',
        errors: [
          {
            field: 'id',
            message: `Không thể xóa. Thể loại đang có ${category._count.books} cuốn sách`
          }
        ]
      });
    }

    // Delete category
    await prisma.bookCategory.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Xóa thể loại thành công'
    });

  } catch (error) {
    console.error('Delete Category Error:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thể loại'
      });
    }

    // Handle foreign key constraint violation
    if (error.code === 'P2003') {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa. Thể loại đang có sách'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi xóa thể loại'
    });
  }
};

