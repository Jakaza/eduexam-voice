const {
  createData,
  deleteData,
  updateData,
} = require('../config/dbFunctions');

const Test = {
  create: async (req, res, next) => {
    try {
      const { test_name, module_id } = req.body;
      await createData('tests', { test_name, module_id });
      res.status(201).json({ status: true, message: 'Test created successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: 'Internal server error.' });
    }
  },

  update: async (req, res, next) => {
    try {
      const { test_name, module_id } = req.body;
      const { id } = req.params;
      await updateData('tests', id, { test_name, module_id });
      res.status(200).json({ status: true, message: 'Test updated successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: 'Internal server error.' });
    }
  },
  
  delete: async (req, res, next) => {
    try {
      const { testID } = req.params;
      await deleteData('tests', 'test_id', testID);
      res.status(200).json({ status: true, message: 'Test deleted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: 'Internal server error.' });
    }
  }
};

module.exports = Test;
