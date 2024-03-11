const {
  createData,
  deleteData,
  updateData,
  updateWithCondition
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
      const { testID, moduleID } = req.params;
      const { test_name } = req.body;
      await updateWithCondition(
        "tests",
        {
          test_name: test_name
        },
        { test_id: testID }
      );
      res.redirect(`/test/view/${moduleID}`);
    } catch (error) {
      console.log(error);
      res.redirect(`/test/view/${moduleID}`);
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
