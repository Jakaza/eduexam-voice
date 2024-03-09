const dbFunctions = require('./dbFunctions');
const { STATUS_CODE } = require('./constants');

const SuperAdmin = {
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      await dbFunctions.deleteData('users', userId);
      res.status(STATUS_CODE.Success).json('User deleted successfully');
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODE.Internal).json('Internal Server Error');
    }
  },

  updateUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      const updateFields = req.body; // Assuming the updated fields are in the request body
      await dbFunctions.updateData('users', userId, updateFields);
      res.status(STATUS_CODE.Success).json('User updated successfully');
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODE.Internal).json('Internal Server Error');
    }
  },

  toggleUserBlockStatus: async (req, res, isBlocked) => {
    try {
      const userId = req.params.userId;
      const updateFields = { isBlocked }; // Assuming there's a field 'isBlocked' in your users table
      await dbFunctions.updateData('users', userId, updateFields);
      res.status(STATUS_CODE.Success).json(`User ${isBlocked ? 'blocked' : 'unblocked'} successfully`);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODE.Internal).json('Internal Server Error');
    }
  },

  blockUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      await SuperAdmin.toggleUserBlockStatus(req, res, true);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODE.Internal).json('Internal Server Error');
    }
  },

  unBlockUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      await SuperAdmin.toggleUserBlockStatus(req, res, false);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODE.Internal).json('Internal Server Error');
    }
  },

  createModule: async (req, res) => {
    try {
      const moduleData = req.body; // Assuming module data is in the request body
      await dbFunctions.createData('modules', moduleData);
      res.status(STATUS_CODE.Created).json('Module created successfully');
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODE.Internal).json('Internal Server Error');
    }
  },

  createTest: async (req, res) => {
    try {
      const testData = req.body; // Assuming test data is in the request body
      await dbFunctions.createData('tests', testData);
      res.status(STATUS_CODE.Created).json('Test created successfully');
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODE.Internal).json('Internal Server Error');
    }
  },

  createQuestion: async (req, res) => {
    try {
      const questionData = req.body; // Assuming question data is in the request body
      await dbFunctions.createData('questions', questionData);
      res.status(STATUS_CODE.Created).json('Question created successfully');
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODE.Internal).json('Internal Server Error');
    }
  },

  updateModule: async (req, res) => {
    try {
      const moduleId = req.params.moduleId;
      const updateFields = req.body; // Assuming the updated fields are in the request body
      await dbFunctions.updateData('modules', moduleId, updateFields);
      res.status(STATUS_CODE.Success).json('Module updated successfully');
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODE.Internal).json('Internal Server Error');
    }
  },

  updateTest: async (req, res) => {
    try {
      const testId = req.params.testId;
      const updateFields = req.body; // Assuming the updated fields are in the request body
      await dbFunctions.updateData('tests', testId, updateFields);
      res.status(STATUS_CODE.Success).json('Test updated successfully');
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODE.Internal).json('Internal Server Error');
    }
  },

  updateQuestion: async (req, res) => {
    try {
      const questionId = req.params.questionId;
      const updateFields = req.body; // Assuming the updated fields are in the request body
      await dbFunctions.updateData('questions', questionId, updateFields);
      res.status(STATUS_CODE.Success).json('Question updated successfully');
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODE.Internal).json('Internal Server Error');
    }
  },

  deleteModule: async (req, res) => {
    try {
      const moduleId = req.params.moduleId;
      await dbFunctions.deleteData('modules', moduleId);
      res.status(STATUS_CODE.Success).json('Module deleted successfully');
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODE.Internal).json('Internal Server Error');
    }
  },

  deleteTest: async (req, res) => {
    try {
      const testId = req.params.testId;
      await dbFunctions.deleteData('tests', testId);
      res.status(STATUS_CODE.Success).json('Test deleted successfully');
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODE.Internal).json('Internal Server Error');
    }
  },

  deleteQuestion: async (req, res) => {
    try {
      const questionId = req.params.questionId;
      await dbFunctions.deleteData('questions', questionId);
      res.status(STATUS_CODE.Success).json('Question deleted successfully');
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODE.Internal).json('Internal Server Error');
    }
  },
};

module.exports = SuperAdmin;
