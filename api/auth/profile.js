/**
 * Serverless function for updating user profile
 * PUT /api/auth/profile
 */

const UserModel = require('../models/User');
const { withAuth, validateBody, formatResponse, createErrorHandler } = require('../utils/auth');

const handler = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, organization, useCase } = req.body;

    // Validate fields if provided
    const allowedFields = ['name', 'organization', 'useCase'];
    const updateData = {};
    
    if (name !== undefined) {
      if (name.trim() === '') {
        return res.status(400).json({ 
          error: 'Name cannot be empty' 
        });
      }
      updateData.name = name.trim();
    }

    if (organization !== undefined) {
      if (organization.trim() === '') {
        return res.status(400).json({ 
          error: 'Organization cannot be empty' 
        });
      }
      updateData.organization = organization.trim();
    }

    if (useCase !== undefined) {
      const validUseCases = ['agribusiness', 'research', 'ngo', 'input-supplier', 'policy', 'investment', 'other'];
      if (!validUseCases.includes(useCase)) {
        return res.status(400).json({ 
          error: 'Valid use case is required' 
        });
      }
      updateData.useCase = useCase;
    }

    // Check if at least one field is being updated
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ 
        error: 'At least one field must be provided for update' 
      });
    }

    // Update user profile
    const updatedUser = await UserModel.updateProfile(userId, updateData);
    
    if (!updatedUser) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    // Format response
    const responseData = {
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        organization: updatedUser.organization,
        role: updatedUser.role,
        useCase: updatedUser.useCase
      }
    };

    return res.status(200).json(
      formatResponse(true, responseData, 'Profile updated successfully')
    );

  } catch (error) {
    const errorHandler = createErrorHandler('Failed to update profile');
    return errorHandler(res, error);
  }
};

// Export with authentication middleware
module.exports = withAuth(handler);