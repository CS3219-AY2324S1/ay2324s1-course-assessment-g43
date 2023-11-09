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

// Add an event lister to all the back buttons
for (let i = 0; i < backToMainBtns.length; i++) {
  backToMainBtns[i].addEventListener("click", () => {
    showMainSection();
  });
}

// Add an event listener to the confirm button
createConfirmBtn.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get values from form fields
  const title = document.getElementById("create-question-title").value.trim();
  const description = document
    .getElementById("create-question-description")
    .value.trim();
  const category = document
    .getElementById("create-question-category")
    .value.trim();
  const complexity = document.getElementById(
    "create-question-complexity"
  ).value;

  // Basic validation, ensure title is not empty
  if (!title || !category || !complexity) {
    alert(
      "Title / Category / Complexity for the question is missing. Make sure to enter these required fields."
    );
    return;
  }

  let isDuplicated = false;
  questions.forEach((question) => {
    if (title === question.questionTitle) {
      isDuplicated = true;
      return;
    }
  });

  if (isDuplicated) {
    alert(
      "Question with the same title exists! Duplicated questions not allowed."
    );
    return;
  }

  createQuestion(title, description, category, complexity);

  showMainSection();
});

// Function to create a question
function createQuestion(title, description, category, complexity) {
  // Create a new question object
  const newQuestion = {
    questionId: generateQuestionId(), // You need to implement this function
    questionTitle: title,
    questionDescription: description,
    questionCategory: category,
    questionComplexity: complexity,
  };

  // Add the new question to the array or storage
  questions.push(newQuestion); // Assuming you have an array named "questions"

  // Save the updated questions to local storage (or perform any other desired storage operation)
  localStorage.setItem("questions", JSON.stringify(questions));

  // Optionally, show a success message or toast
  alert("Question added successfully.");
}

// Function to generate a unique question ID (you can customize this as needed)
function generateQuestionId() {
  return new Date().getTime().toString();
}

// Function to load and display question details by question ID
function loadQuestionDetails(questionId) {
  // Find the question with the specified questionId
  const question = questions.find((q) => q.questionId === questionId);

  if (question) {
    // Populate the question details on the page
    document.getElementById("view-question-title").textContent =
      question.questionTitle;
    document.getElementById("view-question-description").textContent =
      question.questionDescription;
    document.getElementById("view-question-category").textContent =
      question.questionCategory;
    document.getElementById("view-question-complexity").textContent =
      question.questionComplexity;
  } else {
    // Handle the case where the question with the specified ID was not found
    alert("Question not found.");
  }
}

updateQuestionBtn.addEventListener("click", (event) => {
  const questionId = event.target.dataset.id;
  populateFormWithQuestionDetails(questionId);
  backToViewBtn.setAttribute("data-id", questionId);
  updateConfirmBtn.setAttribute("data-id", questionId);
  showSection("update-question-section");
});

updateQuestionBtn.addEventListener("click", (event) => {
  const questionId = event.target.dataset.id;
  populateFormWithQuestionDetails(questionId);
  backToViewBtn.setAttribute("data-id", questionId);
  updateConfirmBtn.setAttribute("data-id", questionId);
  showSection("update-question-section");
});

deleteQuestionBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const questionId = event.target.dataset.id;

  // Prompt the user for confirmation (you can implement the delete logic here)
  const confirmDelete = confirm(
    "Are you sure you want to delete this question?"
  );

  if (confirmDelete) {
    // Find the index of the question with the specified questionId
    const index = questions.findIndex((q) => q.questionId === questionId);

    if (index !== -1) {
      // Remove the question from the questions array
      questions.splice(index, 1);

      // Save the updated questions back to local storage
      localStorage.setItem("questions", JSON.stringify(questions));

      // Display a success message
      alert("Question deleted successfully.");

      showMainSection();
    } else {
      // Handle the case where the question with the specified ID was not found
      alert("Question not found.");
    }
  }
});

// Function to populate the form with the current question details
function populateFormWithQuestionDetails(questionId) {
  // Find the question with the specified questionId
  const question = questions.find((q) => q.questionId === questionId);

  if (question) {
    // Populate the form fields with the current question details
    document.getElementById("update-question-title").value =
      question.questionTitle;
    document.getElementById("update-question-description").value =
      question.questionDescription;
    document.getElementById("update-question-category").value =
      question.questionCategory;
    document.getElementById("update-question-complexity").value =
      question.questionComplexity;
  } else {
    // Handle the case where the question with the specified ID was not found
    alert("Question not found.");
  }
}

// Add an event listener to the update button
updateConfirmBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const questionId = event.target.dataset.id;

  // Get the updated question details from the form
  const updatedQuestion = {
    questionTitle: document
      .getElementById("update-question-title")
      .value.trim(),
    questionDescription: document
      .getElementById("update-question-description")
      .value.trim(),
    questionCategory: document
      .getElementById("update-question-category")
      .value.trim(),
    questionComplexity: document.getElementById("update-question-complexity")
      .value,
  };

  // Find the question with the specified questionId
  const index = questions.findIndex((q) => q.questionId === questionId);

  if (index !== -1) {
    // Update the question in the questions array
    questions[index] = { ...questions[index], ...updatedQuestion };

    // Save the updated questions back to local storage
    localStorage.setItem("questions", JSON.stringify(questions));

    alert("Question updated successfully.");
    viewDetails(questionId);
  } else {
    // Handle the case where the question with the specified ID was not found
    alert("Question not found.");
  }
});

backToViewBtn.addEventListener("click", (event) => {
  const questionId = event.target.dataset.id;
  viewDetails(questionId);
});

// Initialize the application by displaying questions
displayQuestions();
