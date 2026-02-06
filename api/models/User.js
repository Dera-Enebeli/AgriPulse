/**
 * User model for serverless functions
 * MongoDB user document operations
 */

const { getCollection } = require('../utils/database');
const bcrypt = require('bcryptjs');

class UserModel {
  /**
   * Find user by email
   * @param {string} email - User email
   * @param {boolean} includePassword - Include password field
   * @returns {Object|null} - User document or null
   */
  static async findByEmail(email, includePassword = false) {
    try {
      const collection = await getCollection('users');
      const projection = includePassword ? {} : { password: 0 };
      
      const user = await collection.findOne({ email }, { projection });
      return user;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  /**
   * Find user by ID
   * @param {string} id - User ID
   * @returns {Object|null} - User document or null
   */
  static async findById(id) {
    try {
      const collection = await getCollection('users');
      const user = await collection.findOne({ _id: require('mongodb').ObjectId(id) }, { password: 0 });
      return user;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Object} - Created user document
   */
  static async create(userData) {
    try {
      const collection = await getCollection('users');
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      const userDocument = {
        ...userData,
        password: hashedPassword,
        role: userData.role || 'buyer',
        apiUsage: {
          requests: 0,
          lastReset: new Date()
        },
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await collection.insertOne(userDocument);
      
      // Return user without password
      const { password, ...userWithoutPassword } = userDocument;
      return {
        ...userWithoutPassword,
        _id: result.insertedId
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {string} id - User ID
   * @param {Object} updateData - Data to update
   * @returns {Object|null} - Updated user document
   */
  static async updateProfile(id, updateData) {
    try {
      const collection = await getCollection('users');
      
      const updateDoc = {
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      };
      
      const result = await collection.findOneAndUpdate(
        { _id: require('mongodb').ObjectId(id) },
        updateDoc,
        { returnDocument: 'after', projection: { password: 0 } }
      );
      
      return result.value;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Validate user password
   * @param {string} email - User email
   * @param {string} password - Plain text password
   * @returns {Object|null} - User document if valid, null if invalid
   */
  static async validatePassword(email, password) {
    try {
      const user = await this.findByEmail(email, true);
      
      if (!user) {
        return null;
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return null;
      }
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error validating password:', error);
      throw error;
    }
  }

  /**
   * Check if user exists
   * @param {string} email - User email
   * @returns {boolean} - True if user exists
   */
  static async exists(email) {
    try {
      const user = await this.findByEmail(email);
      return !!user;
    } catch (error) {
      console.error('Error checking user existence:', error);
      throw error;
    }
  }
}

module.exports = UserModel;