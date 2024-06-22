const passport = require("passport");
const { ROLES } = require("../constants/");
const {
  createData,
  selectWithCondition,
  selectWithConditionIgnoreCase
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
  },
  result : async (req, res, next) => {
    passport.authenticate(
      "jwt",
      { session: false },
      async (err, user, info) => {

        const {testId} = req.params;

        let tests = await selectWithCondition(
          "tests",
          { test_id : testId },
          1
        );

        tests = tests[0];

        let modules = await selectWithCondition(
          "modules",
          { module_id : tests.module_id },
          1
        );
      modules = modules[0];
     
      let testName = tests.test_name;
      let moduleName = "Internet Programming";
  
  
      res.render("student/result" , {user : user ,
          testName ,
          moduleName,
     } );
    }
    )(req, res, next);
  }, 
  viewStudentPerWrittenExam : async (req, res, next) => {
    passport.authenticate(
      "jwt",
      { session: false },
      async (err, user, info) => {
        if (err) {
          return res.status(500).render("error/server");
        }
        if (!user) {
          return res.render("index", { isAuthenticated: false });
        }
        if (user.user_role === ROLES.Lecturer) {
          const {testId} = req.params;

        let answers = await selectWithCondition(
            "answer",
            { test_id : testId },
            1
        );

        let tests = await selectWithCondition(
          "tests",
          { test_id : testId },
          1
      );

      console.log(tests);

      let modules = await selectWithCondition(
        "modules",
        { module_id : tests[0].module_id },
        1
    );

        const studentIdsSet = new Set(answers.map((answer) => answer.student_id));
        const studentIds = Array.from(studentIdsSet);

        let userData = [];
        for (const studentId of studentIdsSet) {

        let answers = await selectWithCondition(
            "answer",
            { student_id : studentId },
            1
        );
        let correctCount = 0;

        let total = answers.length;
        answers.forEach(result => {
            if (result.outcome === "Correct") {
                correctCount++;
            }
        });

        let percentage = Math.round((correctCount *100) / total)
        const users = await selectWithConditionIgnoreCase(
            "users",
            { user_id: studentId },
            1
          );
          const userDataWithPercentage = {
            ...users[0],
            percentage: percentage
          };

          userData.push(userDataWithPercentage);
        }


        // console.log(answers);
        console.log(userData);

        return res.render("student/outcome", {
          user: user,
          users : userData,
          testName: tests[0].test_name,
          testId: tests[0].test_id,
          moduleName: modules[0].module_name,
          moduleId: modules[0].module_id
        });
        } else {
          res.redirect("/");
        }
      }
    )(req, res, next);
  }, 
  viewStudentPerWrittenExamTest : async (req, res, next) => {
    passport.authenticate("jwt", { session: false }, async (err, user, info) => {
      if (err) {
        return res.status(500).render("error/server");
      }
      if (!user) {
        return res.render("index", { isAuthenticated: false });
      }
      if (user.user_role === ROLES.Lecturer) {
        const { testId } = req.params;
  
        try {
          // Get answers for the given test ID
          let answers = await selectWithCondition(
            "answer",
            { test_id: testId },
            1
          );
  
          let userData = [];
          // Group answers by student ID
          const answersByStudentId = answers.reduce((acc, answer) => {
            acc[answer.student_id] = acc[answer.student_id] || [];
            acc[answer.student_id].push(answer);
            return acc;
          }, {});
  
          // Calculate percentage for each student
          for (const studentId in answersByStudentId) {
            const studentAnswers = answersByStudentId[studentId];
            let correctCount = studentAnswers.reduce((count, answer) => {
              if (answer.response === "Correct") {
                count++;
              }
              return count;
            }, 0);
            let total = studentAnswers.length;
            let percentage = Math.round((correctCount * 100) / total);
  
            // Get user data for the student ID
            const users = await selectWithConditionIgnoreCase(
              "users",
              { user_id: studentId },
              1
            );
  
            // Add percentage to user data
            if (users.length > 0) {
              const userDataWithPercentage = {
                ...users[0],
                percentage: percentage
              };
              userData.push(userDataWithPercentage);
            }
          }

          console.log(userData);
  
          return res.render("student/outcome", {
            userData: userData,
            errors: [],
          });
        } catch (error) {
          console.error("Error:", error.message);
          return res.status(500).render("error/server");
        }
      } else {
        res.redirect("/");
      }
    })(req, res, next);
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
    await createData("answer", UserResponse);

  } catch (error) {
      console.log(error);
  }
}

  module.exports = Exam;
  