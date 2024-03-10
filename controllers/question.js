const {
  createData,
  deleteData,
  updateWithCondition,
} = require("../config/dbFunctions");

const Question = {
  create: async (req, res, next) => {
    try {
      const { question_text, test_id } = req.body;
      await createData("questions", { question_text, test_id });
      res
        .status(201)
        .json({ status: true, message: "Test created successfully." });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ status: false, message: "Internal server error." });
    }
  },

  update: async (req, res, next) => {
    try {
      const { question_text, question_id } = req.body;

      await updateWithCondition(
        "questions",
        {
          question_text,
        },
        { question_id: question_id }
      );
      res
        .status(200)
        .json({ status: true, message: "Test updated successfully." });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ status: false, message: "Internal server error." });
    }
  },

  delete: async (req, res, next) => {
    try {
      const { questionID, testId } = req.params;

      console.log(req.params);

      await deleteData("questions", "question_id", questionID);
      res.redirect(`/question/view?test=${testId}`);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ status: false, message: "Internal server error." });
    }
  },
};

module.exports = Question;
