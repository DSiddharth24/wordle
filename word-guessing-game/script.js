const wordList = [
    { word: "jupiter", hint: "The largest planet in our solar system.", category: "SPACE" },
    { word: "algorithm", hint: "A step-by-step procedure for calculations.", category: "TECH" },
    { word: "canvas", hint: "A surface used for oil painting.", category: "ART" },
    { word: "diamond", hint: "The hardest natural substance on Earth.", category: "NATURE" },
    { word: "keyboard", hint: "An input device with many buttons.", category: "TECH" },
    { word: "nebula", hint: "A giant cloud of dust and gas in space.", category: "SPACE" },
    { word: "pyramid", hint: "Ancient triangular monument in Egypt.", category: "HISTORY" },
    { word: "volcano", hint: "A mountain that erupts with lava.", category: "NATURE" },
    { word: "safari", hint: "An expedition to observe animals in the wild.", category: "ADVENTURE" },
    { word: "quantum", hint: "A discrete quantity of energy.", category: "SCIENCE" },
    { word: "glacier", hint: "A slowly moving mass of ice.", category: "NATURE" },
    { word: "symphony", hint: "An elaborate musical composition.", category: "MUSIC" },
    { word: "phantom", hint: "A ghost or figment of the imagination.", category: "MYSTERY" },
    { word: "paradox", hint: "A statement that contradicts itself.", category: "LOGIC" },
    { word: "vortex", hint: "A mass of whirling fluid or air.", category: "SCIENCE" }
];

// State Variables
let currentWord, currentHint, currentCategory;
let guessedLetters = [];
let mistakes = 0;
const maxMistakes = 6;
let score = 0;

// DOM Elements
const wordDisplay = document.getElementById("word-display");
const categoryName = document.getElementById("category-name");
const hintContent = document.getElementById("hint-content");
const livesProgress = document.getElementById("lives-progress");
const scoreDisplay = document.getElementById("score-display");
const keyboard = document.getElementById("keyboard");
const modal = document.getElementById("game-modal");
const modalTitle = document.getElementById("modal-title");
const modalMsg = document.getElementById("modal-msg");
const modalIcon = document.getElementById("modal-icon");
const correctWordText = document.getElementById("correct-word");
const resetBtn = document.getElementById("reset-btn");
const playAgainBtn = document.getElementById("play-again-btn");

// Initialize Game
function initGame() {
    // Reset state
    guessedLetters = [];
    mistakes = 0;
    
    // Pick random word
    const rand = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = rand.word.toLowerCase();
    currentHint = rand.hint;
    currentCategory = rand.category;

    // Update UI
    categoryName.innerText = currentCategory;
    hintContent.innerText = currentHint;
    updateLives();
    renderWord();
    renderKeyboard();
    modal.classList.add("hidden");
}

// Render Word Slots
function renderWord() {
    wordDisplay.innerHTML = currentWord.split("").map(letter => `
        <div class="letter-slot ${guessedLetters.includes(letter) ? 'revealed' : ''}">
            ${guessedLetters.includes(letter) ? letter : ''}
        </div>
    `).join("");
}

// Render Keyboard
function renderKeyboard() {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    keyboard.innerHTML = letters.split("").map(letter => `
        <button class="key" id="key-${letter}" onclick="handleGuess('${letter}')">${letter}</button>
    `).join("");
}

// Handle Guesses
function handleGuess(letter) {
    if (guessedLetters.includes(letter) || mistakes >= maxMistakes) return;

    guessedLetters.push(letter);
    const keyBtn = document.getElementById(`key-${letter}`);
    
    if (currentWord.includes(letter)) {
        keyBtn.classList.add("correct");
        renderWord();
        checkWin();
    } else {
        mistakes++;
        keyBtn.classList.add("incorrect");
        updateLives();
        checkLoss();
    }
    keyBtn.disabled = true;
}

// Update Lives Display
function updateLives() {
    const percentage = ((maxMistakes - mistakes) / maxMistakes) * 100;
    livesProgress.style.width = `${percentage}%`;
    
    // Color feedback
    if (percentage <= 30) {
        livesProgress.style.background = "var(--danger)";
    } else if (percentage <= 60) {
        livesProgress.style.background = "#fbbf24"; // Amber
    } else {
        livesProgress.style.background = "linear-gradient(to right, var(--primary), var(--secondary))";
    }
}

// Check Win Condition
function checkWin() {
    const isWon = currentWord.split("").every(letter => guessedLetters.includes(letter));
    if (isWon) {
        score += 100;
        scoreDisplay.innerText = score;
        showModal(true);
    }
}

// Check Loss Condition
function checkLoss() {
    if (mistakes >= maxMistakes) {
        showModal(false);
    }
}

// Show Result Modal
function showModal(isWin) {
    modal.classList.remove("hidden");
    if (isWin) {
        modalIcon.innerText = "🏆";
        modalTitle.innerText = "Victory!";
        modalMsg.innerText = "Fantastic! You've decoded the word.";
        modalTitle.style.color = "var(--success)";
    } else {
        modalIcon.innerText = "💀";
        modalTitle.innerText = "Defeat";
        modalMsg.innerText = "The quest ends here. Try again!";
        modalTitle.style.color = "var(--danger)";
    }
    correctWordText.innerText = currentWord.toUpperCase();
}

// Physical Keyboard Support
document.addEventListener("keydown", (e) => {
    const char = e.key.toLowerCase();
    if (/^[a-z]$/.test(char) && !modal.classList.contains("hidden")) return;
    if (/^[a-z]$/.test(char)) {
        handleGuess(char);
    }
});

// Event Listeners
resetBtn.addEventListener("click", initGame);
playAgainBtn.addEventListener("click", initGame);

// Start on Load
window.onload = initGame;
