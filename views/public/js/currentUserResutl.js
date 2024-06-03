// const responsesData = [
//     {
//         response_id: 1,
//         test_id: 123,
//         question_id: 456,
//         student_id: 789,
//         answer_text: "Lorem ipsum dolor sit amet",
//         outcome: "Correct",
//         submitted_at: "2024-05-30T12:00:00" // Assuming current timestamp
//     },
//     {
//         response_id: 2,
//         test_id: 123,
//         question_id: 457,
//         student_id: 790,
//         answer_text: "Consectetur adipiscing elit",
//         outcome: "Wrong",
//         submitted_at: "2024-05-30T12:05:00" // Assuming current timestamp
//     },
//     {
//         response_id: 3,
//         test_id: 123,
//         question_id: 458,
//         student_id: 791,
//         answer_text: "Sed do eiusmod tempor incididunt",
//         outcome: "Correct",
//         submitted_at: "2024-05-30T12:10:00" // Assuming current timestamp
//     },
//     {
//         response_id: 4,
//         test_id: 123,
//         question_id: 459,
//         student_id: 792,
//         answer_text: "Ut labore et dolore magna aliqua",
//         outcome: "Wrong",
//         submitted_at: "2024-05-30T12:15:00" // Assuming current timestamp
//     },
// ];

const savedResults = localStorage.getItem('evaluationCurrentResults');
let responsesData = '';

if (savedResults) {
    responsesData = JSON.parse(savedResults);
    console.log(responsesData);
} else {
    console.error("Evaluation results not found in local storage");
}

let correctCount = 0;
let wrongCount = 0;

let total = responsesData.length;
responsesData.forEach(result => {
    if (result.response === "Correct") {
        correctCount++;
    } else if (result.response === "Wrong") {
        wrongCount++;
    }
});

let percentage = Math.round((correctCount *100) / total)

if (percentage >= 50) {
    message = 'Congratulations! You passed the exam. ';
} else {
    message = 'Sorry, you did not pass the exam. ';
}
document.getElementById('correctCount').innerHTML = correctCount
document.getElementById('totalCount').innerHTML = total
document.getElementById('percentage').innerHTML = `${percentage}%`
document.getElementById('feedback').innerHTML = message

































