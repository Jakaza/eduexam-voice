document.addEventListener("DOMContentLoaded", (event) => {
  const translateButtons = document.querySelectorAll(".translate-button");
  translateButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.stopPropagation(); // Prevent any parent event handlers from being triggered
      const questionId = button.getAttribute("data-question-id");
      const questionText = button.getAttribute("data-question-text");
      const translatedQuestionElement = document.getElementById(
        `translated-${questionId}`
      );
      if (translatedQuestionElement) {
        const translatedText = await translateQuestion(
          questionId,
          questionText
        );
        console.log("translatedText : ", translatedText);
        translatedQuestionElement.innerText = `Translated Question: ${translatedText.response}`;
        translatedQuestionElement.style.display = "block";
      }
    });
  });

  async function translateQuestion(questionId, questionText) {
    const data = {
      question_id: questionId,
      question_text: questionText,
    };
    try {
      const response = await fetch("/translate/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
});
