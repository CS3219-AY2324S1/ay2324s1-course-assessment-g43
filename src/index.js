let questions = JSON.parse(localStorage.getItem("questions")) || [];
const createQuestionForm = document.getElementById("create-question-form");
const createQuestionBtn = document.getElementById("create-question-btn");
const createConfirmBtn = document.getElementById("create-confirm-button");
const backToMainBtns = document.getElementsByClassName("back-to-main");
const updateQuestionBtn = document.getElementById("update-question-btn");
const updateConfirmBtn = document.getElementById("update-confirm-button");
const deleteQuestionBtn = document.getElementById("delete-question-btn");
const backToViewBtn = document.getElementById("back-to-view");

function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => section.classList.remove("visible"));

  // Show the selected section
  const selectedSection = document.getElementById(sectionId);
  if (selectedSection) {
    selectedSection.classList.add("visible");
  }
}

// Function to display questions on the main page
function displayQuestions() {
  const questionList = document.getElementById("question-list");
  questionList.innerHTML = "";

  if (questions.length === 0) {
    questionList.innerHTML = "No questions available.";
  } else {
    questions.forEach((question) => {
      const questionDiv = document.createElement("div");
      questionDiv.innerHTML = `
                <p>Title: ${question.questionTitle}</p>
                <p>Category: ${question.questionCategory}</p>
                <p>Complexity: ${question.questionComplexity}</p>
                <button class="view-details-btn" data-id="${question.questionId}">View Details</button>
            `;
      questionList.appendChild(questionDiv);
    });

    // Add event listeners for view details buttons
    const viewDetailsBtns = document.querySelectorAll(".view-details-btn");
    viewDetailsBtns.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const questionId = event.target.dataset.id;
        viewDetails(questionId);
      });
    });
  }
}

// Function to display question details
function viewDetails(questionId) {
  showSection("view-question-section");
  updateQuestionBtn.setAttribute("data-id", questionId);
  deleteQuestionBtn.setAttribute("data-id", questionId);
  loadQuestionDetails(questionId);
}

function showMainSection() {
  showSection("main-section");
  displayQuestions();
}

// Add question button click event
createQuestionBtn.addEventListener("click", () => {
  // Iterate through the form elements
  for (const input of createQuestionForm.elements) {
    // Check if the element is an input or textarea and clear its value
    if (input.tagName === "INPUT" || input.tagName === "TEXTAREA") {
      input.value = "";
    } else if (input.tagName === "SELECT") {
      // For select, reset the selected option to the first option
      input.selectedIndex = 0;
    }
  }
  showSection("create-question-section");
});
