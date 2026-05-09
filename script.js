// Quiz Questions
const questions = [
    {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"],
        answer: 0
    },
    {
        question: "Which of the following is not a CSS property?",
        options: ["background-color", "text-align", "font-weight", "innerHTML"],
        answer: 3
    },
    {
        question: "How do you write 'Hello World' in an alert box?",
        options: ["msg('Hello World');", "alertBox('Hello World');", "alert('Hello World');", "console.log('Hello World');"],
        answer: 2
    },
    {
        question: "Which symbol is used for comments in JavaScript?",
        options: ["<!-- comment -->", "// comment", "/* comment", "# comment"],
        answer: 1
    },
    {
        question: "What is the correct way to link an external CSS file?",
        options: ["<style src='style.css'>", "<link rel='stylesheet' href='style.css'>", "<css href='style.css'>", "<script src='style.css'>"],
        answer: 1
    },
    {
        question: "Which method removes the last element from an array?",
        options: ["pop()", "push()", "shift()", "unshift()"],
        answer: 0
    },
    {
        question: "In CSS, what does 'rem' stand for?",
        options: ["Relative Em", "Root Em", "Responsive Element", "Root Element"],
        answer: 1
    },
    {
        question: "Which JS function is used to parse a string to an integer?",
        options: ["parseInt()", "parseInteger()", "toInteger()", "Number.parse()"],
        answer: 0
    },
    {
        question: "What property is used to change the text color of an element in CSS?",
        options: ["text-color", "fgcolor", "color", "font-color"],
        answer: 2
    },
    {
        question: "Which event occurs when the user clicks on an HTML element?",
        options: ["onmouseclick", "onchange", "onclick", "onmouseover"],
        answer: 2
    }
];

// State Variables
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;
const timePerQuestion = 15;

// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const clearScoreBtn = document.getElementById('clearScoreBtn');

const questionText = document.getElementById('questionText');
const optionsGrid = document.getElementById('optionsGrid');
const questionCounter = document.getElementById('questionCounter');
const timeText = document.getElementById('timeText');
const timerElement = document.querySelector('.timer');
const progressBar = document.getElementById('progressBar');

const finalScoreEl = document.getElementById('finalScore');
const totalQuestionsEl = document.getElementById('totalQuestions');
const resultMessage = document.getElementById('resultMessage');
const resultIcon = document.getElementById('resultIcon');
const scoreCircle = document.querySelector('.score-circle');

const themeToggle = document.getElementById('themeToggle');
const highScorePreview = document.querySelector('#highScorePreview span');

// Initialization
function init() {
    loadHighScore();
    checkTheme();
}

// Event Listeners
startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', resetQuiz);
clearScoreBtn.addEventListener('click', clearHighScore);
themeToggle.addEventListener('click', toggleTheme);

// Functions
function startQuiz() {
    startScreen.classList.remove('active');
    quizScreen.classList.add('active');
    currentQuestionIndex = 0;
    score = 0;
    loadQuestion();
}

function loadQuestion() {
    resetState();
    
    const currentQuestion = questions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;
    questionCounter.textContent = `Question ${currentQuestionIndex + 1}/${questions.length}`;
    
    // Update progress bar
    const progress = ((currentQuestionIndex) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;

    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectOption(index, button));
        optionsGrid.appendChild(button);
    });

    startTimer();
}

function resetState() {
    clearInterval(timer);
    timeLeft = timePerQuestion;
    timeText.textContent = timeLeft;
    timerElement.classList.remove('warning');
    optionsGrid.innerHTML = '';
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timeText.textContent = timeLeft;
        
        if(timeLeft <= 5 && timeLeft > 0) {
            timerElement.classList.add('warning');
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            timeText.textContent = '0';
            handleTimeOut();
        }
    }, 1000);
}

function selectOption(selectedIndex, selectedButton) {
    clearInterval(timer);
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedIndex === currentQuestion.answer;
    
    const buttons = optionsGrid.querySelectorAll('.option-btn');
    
    buttons.forEach((button, index) => {
        button.disabled = true; // Disable all buttons
        if (index === currentQuestion.answer) {
            button.classList.add('correct');
            button.innerHTML += ' <span>✓</span>';
        }
    });

    if (isCorrect) {
        score++;
    } else {
        selectedButton.classList.add('wrong');
        selectedButton.innerHTML += ' <span>✗</span>';
    }

    setTimeout(() => {
        nextQuestion();
    }, 1500);
}

function handleTimeOut() {
    const currentQuestion = questions[currentQuestionIndex];
    const buttons = optionsGrid.querySelectorAll('.option-btn');
    
    buttons.forEach((button, index) => {
        button.disabled = true;
        if (index === currentQuestion.answer) {
            button.classList.add('correct');
            button.innerHTML += ' <span>✓</span>';
        }
    });

    setTimeout(() => {
        nextQuestion();
    }, 1500);
}

function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    quizScreen.classList.remove('active');
    resultScreen.classList.add('active');
    
    finalScoreEl.textContent = score;
    totalQuestionsEl.textContent = questions.length;
    
    // Update progress bar to 100%
    progressBar.style.width = `100%`;

    // Animate score circle
    const percentage = (score / questions.length) * 100;
    scoreCircle.style.background = `conic-gradient(var(--primary-color) ${percentage}%, transparent 0%)`;

    if (percentage >= 80) {
        resultMessage.textContent = "Excellent Work!";
        resultIcon.textContent = "🏆";
    } else if (percentage >= 50) {
        resultMessage.textContent = "Good Job!";
        resultIcon.textContent = "👍";
    } else {
        resultMessage.textContent = "Keep Practicing!";
        resultIcon.textContent = "📚";
    }

    saveHighScore();
}

function resetQuiz() {
    resultScreen.classList.remove('active');
    startQuiz();
}

// Local Storage
function saveHighScore() {
    const currentHighScore = localStorage.getItem('quizHighScore') || 0;
    if (score > currentHighScore) {
        localStorage.setItem('quizHighScore', score);
        loadHighScore();
    }
}

function loadHighScore() {
    const highScore = localStorage.getItem('quizHighScore') || 0;
    highScorePreview.textContent = highScore;
}

function clearHighScore() {
    localStorage.removeItem('quizHighScore');
    loadHighScore();
    alert("High scores cleared!");
}

// Theme Management
function toggleTheme() {
    const body = document.documentElement;
    const isDark = body.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeToggle.querySelector('.icon').textContent = '🌙';
    } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.querySelector('.icon').textContent = '☀️';
    }
}

function checkTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.querySelector('.icon').textContent = '☀️';
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.querySelector('.icon').textContent = '🌙';
    }
}

// Run init
init();
