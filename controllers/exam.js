const passport = require("passport");
const {
  createData
} = require("../config/dbFunctions");
const OPENAI_API_KEY = process.env['OPENAI_API_KEY'];

const Exam = {
   evaluate: async (req, res, next) => {
    passport.authenticate(
      "jwt",
      { session: false },
      async (err, user, info) => {
      let { question_id, test_id, question_text , answer } = req.body;
      let response = "Wrong";
      try {
        if(answer !== "" && answer != null){
          response = await chatGPTResponse(question_text, answer);
        }else{
          answer = "No Answer";
        }
        await saveToDatabase(user.user_id , question_id, test_id, answer, response);

        console.log({question_id, test_id, question_text, answer, response});
        res.json({question_id, test_id, question_text, answer, response});
      } catch (error) {
          console.error('Error evaluating answer:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
      }
    )(req, res, next);
  }
  };

  async function chatGPTResponse(question, userAnswer){
    try {
        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: `Here is the question and answer. only respond with correct or wrong. 
                                            Question : ${question}. Answer : ${userAnswer}`}],
                max_tokens: 100,
            })
        }
        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await response.json()
        console.log(data.choices[0].message);
        return data.choices[0].message.content;

    } catch (error) {
        console.log(error);
    }
}
async function saveToDatabase(user_id , question_id, test_id, answer, response){
  try {
    const UserResponse = {
      test_id: test_id,
      student_id: user_id,
      question_id: question_id,
      answer_text : answer,
      outcome : response
    };
    await createData("responses", UserResponse);

  } catch (error) {
      console.log(error);
  }
}

  module.exports = Exam;
  