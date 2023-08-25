//Get references to HTML elements
const questionElement = document.getElementById("question");
const mainQuestionElement = document.getElementById("question-main");
const answerContainer = document.getElementById("answers");
const scoreElement = document.getElementById("score");
const restartButton = document.getElementById("restartButton");

//Initialize variables
let questions = [];
let score = 0;
let currentQuestion = 0;

//Fetch questions from JSON files
const fetchQuestions = async () => {
  try {
    const response = await fetch("questions.json");
    questions = await response.json();
    showQuestion();
  } catch (error) {
    console.log("Error fetching questions: ", error);
  }
};

//Display the current question and answer options
showQuestion = () => {
  const {question, questionMain, answers} = questions[currentQuestion];
  questionElement.textContent = question;
  mainQuestionElement.textContent = questionMain;

  //Generate answer buttons and attach click event listener
  answerContainer.innerHTML = answers
    .map((answer) => `<button>${answer}</button>`)
    .join("");

  answerContainer.querySelectorAll("button").forEach((button, index) => {
    button.addEventListener("click", () => checkAnswer(index));
    button.disabled = false; //Enable buttons for the current question
    button.classList.remove("correct", "incorrect"); //Reset button classes
  });
};

//Check if the selected answer is correct
checkAnswer = (selectedIndex) => {
  //determine if the selected answer is correct for the current question
  const isCorrect = selectedIndex === questions[currentQuestion].correct;
  const selectedButton = answerContainer.querySelector(`button:nth-child(${selectedIndex + 1})`);

  //Apply visual feedback and update score
  selectedButton.classList.add(isCorrect? "correct" : "incorrect")
  score += isCorrect;

  //disable all buttons to prevent further interactions
  answerContainer
    .querySelectorAll("button")
    .forEach((button) => (button.disabled = true));

    //proceed to the next question after a brief delay
    setTimeout(() => {
      answerContainer.innerHTML = ""; //clear all answer buttons
      currentQuestion++;

      //check if there are more questions
      if (currentQuestion < questions.length) {
        showQuestion();
      } else {
        //display completion message and restart button
        answerContainer.innerHTML = `<p class='feedback completed'>Quiz completed!<br>Score: ${score} out of ${questions.length}</p>`;
        questionElement.style.display = "none"; //hide the question field
        mainQuestionElement.style.display = "none"; //hide the main question field
        restartButton.style.display = "block"; //show the restart button
      }

      //update score display
      showScore();
    }, 500);
};

//function to reset the quiz
resetQuiz = () => {
  currentQuestion = 0;
  score = 0;
  questionElement.style.display = "block"; //show the question field again
  mainQuestionElement.style.display = "block"; //show the main question field again
  restartButton.style.display = "none"; //hide the restart button
  fetchQuestions();
  showScore();
};

showScore = () => {
  scoreElement.textContent = `Score: ${score}`;
}

//add event listener to the restart button
restartButton.addEventListener("click", resetQuiz);

//fetch questions and start the quiz when the page loads
fetchQuestions();


