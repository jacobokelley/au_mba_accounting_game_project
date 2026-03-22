===========================
==  script.js (START)    ==
===========================
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

// ---------- GAME FLOW ----------
function showHome() {
    resetState();
    showScreen("home");
}

function startGame() {
    // Select question bank
    const source = currentMode === "financial" ? financialQuestions : managerialQuestions;

    // Shuffle and slice
    const shuffled = [...source].sort(() => Math.random() - 0.5);
    currentQuestions = shuffled.slice(0, Math.min(questionCount, shuffled.length));

    currentIndex = 0;
    score = 0;
    answeredCount = 0;
    answeredMap = {};

    updateStatusLabels();
    loadCurrentQuestion();
    showScreen("game");
}

function loadCurrentQuestion() {
    currentQuestion = currentQuestions[currentIndex];
    currentAnswer = null;

    // Reset UI
    answerArea.innerHTML = "";
    feedbackArea.classList.add("hidden");
    feedbackArea.classList.remove("correct", "incorrect");
    correctnessLabel.textContent = "";
    explanationText.textContent = "";
    submitBtn.classList.remove("hidden");
    nextBtn.classList.add("hidden");

    questionTitle.textContent = `Question ${currentIndex + 1}`;
    questionText.textContent = currentQuestion.prompt;

    // Render based on type
    if (currentQuestion.type === "mcq") {
        renderMCQ(currentQuestion);
    } else if (currentQuestion.type === "fill") {
        renderFill(currentQuestion);
    } else if (currentQuestion.type === "match") {
        renderMatch(currentQuestion);
    }

    updateStatusLabels();
}

function goBack() {
    if (currentIndex > 0) {
        currentIndex--;
        loadCurrentQuestion();
    }
}

function goNext() {
    if (currentIndex < currentQuestions.length - 1) {
        currentIndex++;
        loadCurrentQuestion();
    } else {
        showResults();
    }
}

// ---------- RENDERING ----------
function renderMCQ(q) {
    q.choices.forEach((choice, idx) => {
        const btn = document.createElement("button");
        btn.className = "answer-btn";
        btn.textContent = choice;
        btn.dataset.index = idx.toString();
        btn.addEventListener("click", () => {
            document.querySelectorAll(".answer-btn").forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            currentAnswer = idx;
        });
        answerArea.appendChild(btn);
    });
}

function renderFill(q) {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "fill-input";
    input.placeholder = "Type your answer here";
    input.addEventListener("input", () => {
        currentAnswer = input.value.trim();
    });
    answerArea.appendChild(input);
}

function renderMatch(q) {
    const container = document.createElement("div");
    container.className = "match-container";

    const leftCol = document.createElement("div");
    leftCol.className = "match-column";
    const rightCol = document.createElement("div");
    rightCol.className = "match-column";

    const leftTitle = document.createElement("h3");
    leftTitle.textContent = "Column A";
    const rightTitle = document.createElement("h3");
    rightTitle.textContent = "Column B";

    leftCol.appendChild(leftTitle);
    rightCol.appendChild(rightTitle);

    // Left items (fixed order)
    q.pairs.forEach((pair, idx) => {
        const item = document.createElement("div");
        item.className = "match-item";
        item.textContent = pair.left;
        item.draggable = true;
        item.dataset.side = "left";
        item.dataset.id = idx.toString();
        addDragHandlers(item);
        leftCol.appendChild(item);
    });

    // Right items (shuffled)
    const shuffledRight = [...q.pairs].map((p, idx) => ({ text: p.right, id: idx }));
    shuffledRight.sort(() => Math.random() - 0.5);

    shuffledRight.forEach(obj => {
        const dropZone = document.createElement("div");
        dropZone.className = "drop-zone";
        dropZone.dataset.targetId = obj.id.toString();
        addDropHandlers(dropZone);
        const label = document.createElement("div");
        label.className = "match-item";
        label.textContent = obj.text;
        label.draggable = true;
        label.dataset.side = "right";
        label.dataset.id = obj.id.toString();
        addDragHandlers(label);
        rightCol.appendChild(label);
        rightCol.appendChild(dropZone);
    });

    container.appendChild(leftCol);
    container.appendChild(rightCol);
    answerArea.appendChild(container);

    // currentAnswer will be an array of {leftId, rightId}
    currentAnswer = [];
}

// ---------- DRAG & DROP HELPERS ----------
let draggedItem = null;

function addDragHandlers(el) {
    el.addEventListener("dragstart", (e) => {
        draggedItem = el;
        el.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
    });

    el.addEventListener("dragend", () => {
        if (draggedItem) {
            draggedItem.classList.remove("dragging");
            draggedItem = null;
        }
    });
}

function addDropHandlers(zone) {
    zone.addEventListener("dragover", (e) => {
        e.preventDefault();
        zone.classList.add("over");
    });

    zone.addEventListener("dragleave", () => {
        zone.classList.remove("over");
    });

    zone.addEventListener("drop", (e) => {
        e.preventDefault();
        zone.classList.remove("over");
        if (!draggedItem) return;

        // Only allow one item per drop zone
        zone.innerHTML = "";
        const clone = draggedItem.cloneNode(true);
        clone.classList.remove("dragging");
        clone.draggable = false;
        zone.appendChild(clone);

        const leftId = draggedItem.dataset.side === "left" ? draggedItem.dataset.id : null;
        const rightId = draggedItem.dataset.side === "right" ? draggedItem.dataset.id : null;
        const targetId = zone.dataset.targetId;

        // Store mapping: zone targetId matched with dragged item id
        // currentAnswer: array of {targetId, draggedId}
        if (!Array.isArray(currentAnswer)) currentAnswer = [];
        const existingIndex = currentAnswer.findIndex(p => p.targetId === targetId);
        const draggedId = draggedItem.dataset.id;

        const pair = { targetId, draggedId, leftId, rightId };

        if (existingIndex >= 0) {
            currentAnswer[existingIndex] = pair;
        } else {
            currentAnswer.push(pair);
        }
    });
}

// ---------- SCORING & FEEDBACK ----------
function handleSubmit() {
    if (!currentQuestion) return;

    const result = evaluateAnswer(currentQuestion, currentAnswer);
    const alreadyAnswered = answeredMap[currentIndex] !== undefined;

    if (!alreadyAnswered) {
        answeredCount++;
        if (result.correct) {
            score++;
        }
        answeredMap[currentIndex] = result.correct;
    }

    showFeedback(result);
    updateStatusLabels();

    submitBtn.classList.add("hidden");
    nextBtn.classList.remove("hidden");
}

function evaluateAnswer(q, answer) {
    let correct = false;

    if (q.type === "mcq") {
        if (typeof answer === "number") {
            correct = answer === q.correctIndex;
        }
    } else if (q.type === "fill") {
        if (typeof answer === "string") {
            const user = answer.trim().toLowerCase();
            const expected = q.answer.trim().toLowerCase();
            correct = user === expected;
        }
    } else if (q.type === "match") {
        // For matching, ensure every pair is correctly matched
        if (Array.isArray(answer)) {
            let allCorrect = true;
            q.pairs.forEach((pair, idx) => {
                const match = answer.find(p => p.targetId === idx.toString());
                if (!match) {
                    allCorrect = false;
                    return;
                }
                // targetId is the right side index; draggedId can be left or right
                // We consider it correct if draggedId equals idx (same pair index)
                if (match.draggedId !== idx.toString()) {
                    allCorrect = false;
                }
            });
            correct = allCorrect;
        }
    }

    return {
        correct,
        explanation: q.explanation
    };
}

function showFeedback(result) {
    feedbackArea.classList.remove("hidden");
    feedbackArea.classList.toggle("correct", result.correct);
    feedbackArea.classList.toggle("incorrect", !result.correct);
    correctnessLabel.textContent = result.correct ? "Correct" : "Not quite";
    explanationText.textContent = result.explanation || "";
}

function updateStatusLabels() {
    const modeText = currentMode === "financial" ? "Financial Accounting" :
                     currentMode === "managerial" ? "Managerial Accounting" : "";
    modeLabel.textContent = modeText;

    if (currentQuestions.length > 0) {
        progressLabel.textContent = `Q ${currentIndex + 1} of ${currentQuestions.length}`;
    } else {
        progressLabel.textContent = "";
    }

    if (answeredCount > 0) {
        const pct = Math.round((score / answeredCount) * 100);
        scoreLabel.textContent = `Score: ${score}/${answeredCount} (${pct}%)`;
    } else {
        scoreLabel.textContent = "Score: 0/0 (0%)";
    }
}

// ---------- RESULTS ----------
function showResults() {
    const total = currentQuestions.length;
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;

    resultsSummary.textContent = `You answered ${score} out of ${total} questions correctly.`;
    resultsDetail.textContent = `Final score: ${pct}%. Mode: ${
        currentMode === "financial" ? "Financial Accounting" : "Managerial Accounting"
    }.`;

    showScreen("results");
}

// ---------- INIT ----------
resetState();
showScreen("home");
===========================
==  script.js (END)      ==
===========================
