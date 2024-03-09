const {
    createData,
    deleteData,
    updateData,
  } = require('./dbFunctions'); 
  
  const Module = {
    create: async (req, res, next) => {
      try {
        const { module_name, module_code } = req.body;
        if (!module_name || !module_code) {
          return res.status(400).json({ status: false, message: 'Module name and module code are required.' });
        }
        const newModule = {
          module_name,
          module_code,
        };
        await createData('modules', newModule);
        res.status(201).json({ status: true, message: 'Module created successfully.' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal server error.' });
      }
    },
  
    update: async (req, res, next) => {
      try {
        const { id } = req.params;
        const { module_name, module_code } = req.body;
    
        // Validation: At least one of module_name or module_code should be provided
        if (!module_name && !module_code) {
          return res.status(400).json({ status: false, message: 'At least one of module_name or module_code is required for update.' });
        }
    
        const updatedModule = {
          module_name,
          module_code,
        };
    
        await updateData('modules', id, updatedModule);
    
        res.status(200).json({ status: true, message: 'Module updated successfully.' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal server error.' });
      }
    },
    
    delete: async (req, res, next) => {
      try {
        const { id } = req.params;
  
        await deleteData('modules', id);
  
        res.status(200).json({ status: true, message: 'Module deleted successfully.' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal server error.' });
      }
    },
  };
  
  module.exports = Module;
  