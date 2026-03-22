// ---------- GLOBAL STATE ----------
let currentMode = null; // "financial" or "managerial"
let questionCount = 10;
let currentIndex = 0;
let score = 0;
let answeredCount = 0;
let currentQuestions = [];
let currentQuestion = null;
let currentAnswer = null; // structure depends on type
let answeredMap = {}; // store correctness by index (for back navigation)

// ---------- QUESTION BANKS ----------
// NOTE: Replace these placeholder questions with your own,
// derived from "Financial & Managerial Accounting for MBAs, 7e, Easton et al."
// Keep the same structure.

const financialQuestions = [
    // --- MULTIPLE CHOICE ---
    {
        type: "mcq",
        prompt: "Which financial statement reports a company’s performance over a period of time?",
        choices: [
            "Balance sheet",
            "Income statement",
            "Statement of shareholders’ equity",
            "Statement of cash flows"
        ],
        correctIndex: 1,
        explanation: "The income statement summarizes revenues and expenses over a period, showing profitability."
    },
    {
        type: "mcq",
        prompt: "Under accrual accounting, revenue is recognized when:",
        choices: [
            "Cash is received",
            "The customer places an order",
            "The company satisfies its performance obligation",
            "The customer pays the invoice"
        ],
        correctIndex: 2,
        explanation: "Accrual accounting recognizes revenue when earned, not when cash is collected."
    },
    {
        type: "mcq",
        prompt: "Which inventory method results in the highest cost of goods sold during periods of rising prices?",
        choices: ["FIFO", "LIFO", "Weighted average", "Specific identification"],
        correctIndex: 1,
        explanation: "LIFO assigns the most recent (higher) costs to COGS during inflation."
    },
    {
        type: "mcq",
        prompt: "Depreciation expense appears on which financial statement?",
        choices: [
            "Balance sheet",
            "Income statement",
            "Statement of shareholders’ equity",
            "Statement of cash flows only"
        ],
        correctIndex: 1,
        explanation: "Depreciation is an operating expense reported on the income statement."
    },
    {
        type: "mcq",
        prompt: "Which of the following is a current liability?",
        choices: [
            "Bonds payable (10-year maturity)",
            "Common stock",
            "Accounts payable",
            "Retained earnings"
        ],
        correctIndex: 2,
        explanation: "Accounts payable is due within one year, making it a current liability."
    },

    // --- FILL IN THE BLANK ---
    {
        type: "fill",
        prompt: "Fill in the blank: Assets minus liabilities equals ______.",
        answer: "equity",
        explanation: "Equity represents the residual interest in assets after liabilities are deducted."
    },
    {
        type: "fill",
        prompt: "Fill in the blank: The adjusting entry to record depreciation includes a debit to Depreciation Expense and a credit to ______.",
        answer: "accumulated depreciation",
        explanation: "Accumulated depreciation is a contra-asset account used to track total depreciation."
    },
    {
        type: "fill",
        prompt: "Fill in the blank: Cash received before providing goods or services is recorded as ______ revenue.",
        answer: "unearned",
        explanation: "Unearned revenue is a liability until the company fulfills its obligation."
    },
    {
        type: "fill",
        prompt: "Fill in the blank: The statement that explains changes in cash across operating, investing, and financing activities is the ______.",
        answer: "statement of cash flows",
        explanation: "The statement of cash flows categorizes cash movements into operating, investing, and financing."
    },

    // --- MATCHING ---
    {
        type: "match",
        prompt: "Match each financial statement with what it reports.",
        pairs: [
            { left: "Balance sheet", right: "Assets, liabilities, and equity at a point in time" },
            { left: "Income statement", right: "Revenues and expenses over a period" },
            { left: "Cash flow statement", right: "Cash inflows and outflows by activity" }
        ],
        explanation: "Each statement serves a distinct purpose in financial reporting."
    },
    {
        type: "match",
        prompt: "Match each term with its definition.",
        pairs: [
            { left: "Asset", right: "Resource expected to provide future benefit" },
            { left: "Liability", right: "Obligation to transfer assets or provide services" },
            { left: "Equity", right: "Residual interest in assets after liabilities" }
        ],
        explanation: "These are the three fundamental elements of the balance sheet."
    },
    {
        type: "match",
        prompt: "Match each account with its classification.",
        pairs: [
            { left: "Inventory", right: "Current asset" },
            { left: "Notes payable (2 years)", right: "Long-term liability" },
            { left: "Common stock", right: "Equity" }
        ],
        explanation: "Accounts are grouped by their nature and expected timing."
    }
];

const managerialQuestions = [
    // --- MULTIPLE CHOICE ---
    {
        type: "mcq",
        prompt: "Which cost changes in total with activity level but remains constant per unit?",
        choices: ["Fixed cost", "Variable cost", "Mixed cost", "Step cost"],
        correctIndex: 1,
        explanation: "Variable costs change in total proportionally with activity."
    },
    {
        type: "mcq",
        prompt: "Contribution margin equals:",
        choices: [
            "Sales minus fixed costs",
            "Sales minus variable costs",
            "Sales minus total costs",
            "Sales minus overhead"
        ],
        correctIndex: 1,
        explanation: "Contribution margin is the amount available to cover fixed costs and profit."
    },
    {
        type: "mcq",
        prompt: "Which costing system assigns costs to individual jobs or batches?",
        choices: ["Process costing", "Job order costing", "ABC costing", "Standard costing"],
        correctIndex: 1,
        explanation: "Job order costing accumulates costs for specific jobs or orders."
    },
    {
        type: "mcq",
        prompt: "Activity-based costing (ABC) assigns costs based on:",
        choices: [
            "Direct labor hours only",
            "Machine hours only",
            "Activities that drive resource consumption",
            "Units produced"
        ],
        correctIndex: 2,
        explanation: "ABC uses cost drivers that reflect actual resource usage."
    },
    {
        type: "mcq",
        prompt: "A favorable variance means:",
        choices: [
            "Actual costs were higher than expected",
            "Actual performance exceeded expectations",
            "Budgeted costs were too low",
            "The company lost money"
        ],
        correctIndex: 1,
        explanation: "A favorable variance indicates better-than-expected performance."
    },

    // --- FILL IN THE BLANK ---
    {
        type: "fill",
        prompt: "Fill in the blank: Total fixed costs divided by contribution margin per unit equals the ______ point in units.",
        answer: "break-even",
        explanation: "Break-even units = Fixed costs ÷ Contribution margin per unit."
    },
    {
        type: "fill",
        prompt: "Fill in the blank: Costs that contain both fixed and variable components are called ______ costs.",
        answer: "mixed",
        explanation: "Mixed costs include a fixed base plus a variable component."
    },
    {
        type: "fill",
        prompt: "Fill in the blank: The difference between actual and budgeted results is called a ______.",
        answer: "variance",
        explanation: "Variance analysis compares actual performance to budgeted expectations."
    },
    {
        type: "fill",
        prompt: "Fill in the blank: A budget that adjusts for different activity levels is called a ______ budget.",
        answer: "flexible",
        explanation: "Flexible budgets adjust expected costs based on actual activity."
    },

    // --- MATCHING ---
    {
        type: "match",
        prompt: "Match each cost behavior with its description.",
        pairs: [
            { left: "Fixed cost", right: "Total cost remains constant within a range" },
            { left: "Variable cost", right: "Total cost changes with activity" },
            { left: "Mixed cost", right: "Contains both fixed and variable components" }
        ],
        explanation: "Understanding cost behavior is essential for CVP analysis."
    },
    {
        type: "match",
        prompt: "Match each budgeting term with its meaning.",
        pairs: [
            { left: "Master budget", right: "Comprehensive financial plan for the period" },
            { left: "Flexible budget", right: "Budget adjusted for actual activity" },
            { left: "Variance", right: "Difference between actual and budgeted results" }
        ],
        explanation: "Budgets guide planning and performance evaluation."
    },
    {
        type: "match",
        prompt: "Match each costing method with its characteristic.",
        pairs: [
            { left: "Job order costing", right: "Costs assigned to specific jobs" },
            { left: "Process costing", right: "Costs averaged across identical units" },
            { left: "ABC costing", right: "Costs assigned based on activities" }
        ],
        explanation: "Different costing systems suit different production environments."
    }
];

// ---------- DOM ELEMENTS ----------
const screens = {
    home: document.getElementById("home-screen"),
    game: document.getElementById("game-screen"),
    results: document.getElementById("results-screen")
};

const financialBtn = document.getElementById("financial-btn");
const managerialBtn = document.getElementById("managerial-btn");
const startGameBtn = document.getElementById("start-game-btn");
const questionCountSelect = document.getElementById("question-count");

const homeBtn = document.getElementById("home-btn");
const backBtn = document.getElementById("back-btn");
const modeLabel = document.getElementById("mode-label");
const progressLabel = document.getElementById("progress-label");
const scoreLabel = document.getElementById("score-label");

const questionTitle = document.getElementById("question-title");
const questionText = document.getElementById("question-text");
const answerArea = document.getElementById("answer-area");

const feedbackArea = document.getElementById("feedback-area");
const correctnessLabel = document.getElementById("correctness-label");
const explanationText = document.getElementById("explanation-text");

const submitBtn = document.getElementById("submit-btn");
const nextBtn = document.getElementById("next-btn");

const resultsSummary = document.getElementById("results-summary");
const resultsDetail = document.getElementById("results-detail");
const resultsHomeBtn = document.getElementById("results-home-btn");
const resultsReplayBtn = document.getElementById("results-replay-btn");

// ---------- SCREEN MANAGEMENT ----------
function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove("active"));
    screens[name].classList.add("active");
}

function resetState() {
    currentMode = null;
    questionCount = 10;
    currentIndex = 0;
    score = 0;
    answeredCount = 0;
    currentQuestions = [];
    currentQuestion = null;
    currentAnswer = null;
    answeredMap = {};
    financialBtn.classList.remove("selected");
    managerialBtn.classList.remove("selected");
    startGameBtn.disabled = true;
    questionCountSelect.value = "10";
}

// ---------- EVENT WIRING ----------
document.addEventListener('DOMContentLoaded', () => {
    
    financialBtn.addEventListener("click", () => {
        currentMode = "financial";
        financialBtn.classList.add("selected");
        managerialBtn.classList.remove("selected");
        startGameBtn.disabled = false;
    });

    managerialBtn.addEventListener("click", () => {
        currentMode = "managerial";
        managerialBtn.classList.add("selected");
        financialBtn.classList.remove("selected");
        startGameBtn.disabled = false;
    });

    questionCountSelect.addEventListener("change", () => {
        questionCount = parseInt(questionCountSelect.value, 10);
    });

    startGameBtn.addEventListener("click", () => {
        startGame();
    });

    homeBtn.addEventListener("click", () => {
        showHome();
    });

    backBtn.addEventListener("click", () => {
        goBack();
    });

    submitBtn.addEventListener("click", () => {
        handleSubmit();
    });

    nextBtn.addEventListener("click", () => {
        goNext();
    });

    resultsHomeBtn.addEventListener("click", () => {
        showHome();
    });

    resultsReplayBtn.addEventListener("click", () => {
        if (!currentMode) {
            showHome();
        } else {
            startGame();
        }
    });

    // ---------- INIT ----------
    resetState();
    showScreen("home");

    // ---------- GAME LOGIC ----------

function startGame() {
    resetState();
    currentQuestions = (currentMode === "financial")
        ? [...financialQuestions]
        : [...managerialQuestions];

    // Shuffle questions
    currentQuestions.sort(() => Math.random() - 0.5);

    // Trim to selected count
    currentQuestions = currentQuestions.slice(0, questionCount);

    modeLabel.textContent = currentMode === "financial"
        ? "Financial Accounting"
        : "Managerial Accounting";

    scoreLabel.textContent = `Score: 0`;
    progressLabel.textContent = `1 / ${questionCount}`;

    showScreen("game");
    loadQuestion();
}

function loadQuestion() {
    currentQuestion = currentQuestions[currentIndex];
    questionTitle.textContent = `Question ${currentIndex + 1}`;
    questionText.textContent = currentQuestion.prompt;

    answerArea.innerHTML = "";
    feedbackArea.classList.add("hidden");

    if (currentQuestion.type === "mcq") {
        renderMCQ();
    } else if (currentQuestion.type === "fill") {
        renderFill();
    } else if (currentQuestion.type === "match") {
        renderMatch();
    }

    submitBtn.classList.remove("hidden");
    nextBtn.classList.add("hidden");
}

function renderMCQ() {
    currentAnswer = null;

    currentQuestion.choices.forEach((choice, idx) => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.textContent = choice;

        btn.addEventListener("click", () => {
            currentAnswer = idx;
            document.querySelectorAll(".choice-btn").forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
        });

        answerArea.appendChild(btn);
    });
}

function renderFill() {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "fill-input";

    input.addEventListener("input", () => {
        currentAnswer = input.value.trim().toLowerCase();
    });

    answerArea.appendChild(input);
}

function renderMatch() {
    currentAnswer = {};

    const leftCol = document.createElement("div");
    const rightCol = document.createElement("div");

    leftCol.className = "match-col";
    rightCol.className = "match-col";

    currentQuestion.pairs.forEach((pair, idx) => {
        const leftItem = document.createElement("div");
        leftItem.className = "match-item";
        leftItem.textContent = pair.left;

        const select = document.createElement("select");
        select.className = "match-select";

        const defaultOpt = document.createElement("option");
        defaultOpt.textContent = "Select...";
        defaultOpt.value = "";
        select.appendChild(defaultOpt);

        currentQuestion.pairs.forEach((p, i) => {
            const opt = document.createElement("option");
            opt.value = i;
            opt.textContent = p.right;
            select.appendChild(opt);
        });

        select.addEventListener("change", () => {
            currentAnswer[idx] = parseInt(select.value, 10);
        });

        leftCol.appendChild(leftItem);
        rightCol.appendChild(select);
    });

    answerArea.appendChild(leftCol);
    answerArea.appendChild(rightCol);
}

function handleSubmit() {
    if (currentAnswer === null || currentAnswer === "") return;

    const isCorrect = evaluateAnswer();
    answeredMap[currentIndex] = isCorrect;

    if (isCorrect) score++;

    scoreLabel.textContent = `Score: ${score}`;
    showFeedback(isCorrect);

    submitBtn.classList.add("hidden");
    nextBtn.classList.remove("hidden");
}

function evaluateAnswer() {
    if (currentQuestion.type === "mcq") {
        return currentAnswer === currentQuestion.correctIndex;
    }

    if (currentQuestion.type === "fill") {
        return currentAnswer === currentQuestion.answer.toLowerCase();
    }

    if (currentQuestion.type === "match") {
        return currentQuestion.pairs.every((pair, idx) => {
            return currentAnswer[idx] === idx;
        });
    }

    return false;
}

function showFeedback(isCorrect) {
    feedbackArea.classList.remove("hidden");
    correctnessLabel.textContent = isCorrect ? "Correct!" : "Incorrect.";
    explanationText.textContent = currentQuestion.explanation;
}

function goNext() {
    if (currentIndex < questionCount - 1) {
        currentIndex++;
        progressLabel.textContent = `${currentIndex + 1} / ${questionCount}`;
        loadQuestion();
    } else {
        showResults();
    }
}

function goBack() {
    if (currentIndex > 0) {
        currentIndex--;
        progressLabel.textContent = `${currentIndex + 1} / ${questionCount}`;
        loadQuestion();
    }
}

function showResults() {
    showScreen("results");

    resultsSummary.textContent = `You scored ${score} out of ${questionCount}.`;

    let correct = score;
    let incorrect = questionCount - score;

    resultsDetail.textContent =
        `Correct: ${correct} | Incorrect: ${incorrect}`;
}

function showHome() {
    resetState();
    showScreen("home");
}
}
