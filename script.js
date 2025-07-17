const questions = {
    math: [
        {
            q: 'What is 2 + 2?',
            options: ['3', '4', '5', '2'],
            answer: 1
        },
        {
            q: 'What is 5 x 3?',
            options: ['15', '8', '10', '20'],
            answer: 0
        },
        {
            q: 'What is the square root of 16?',
            options: ['2', '4', '6', '8'],
            answer: 1
        }
    ],
    history: [
        {
            q: 'Who was the first President of the USA?',
            options: ['Abraham Lincoln', 'George Washington', 'Thomas Jefferson', 'John Adams'],
            answer: 1
        },
        {
            q: 'In which year did World War II end?',
            options: ['1940', '1945', '1950', '1939'],
            answer: 1
        },
        {
            q: 'The pyramids are located in which country?',
            options: ['Mexico', 'Greece', 'Egypt', 'India'],
            answer: 2
        }
    ],
    science: [
        {
            q: 'Water freezes at what temperature (C)?',
            options: ['0', '32', '100', '-10'],
            answer: 0
        },
        {
            q: 'What planet is known as the Red Planet?',
            options: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
            answer: 0
        },
        {
            q: 'Humans breathe which gas?',
            options: ['Carbon Dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'],
            answer: 2
        }
    ]
};

let currentTopic = null;
let currentQuestionIndex = 0;
let score = 0;
let soundOn = true;
let highScore = parseInt(localStorage.getItem('quizHighScore') || '0');

const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const scoreScreen = document.getElementById('score-screen');
const questionDiv = document.getElementById('question');
const optionsDiv = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const finalScoreP = document.getElementById('final-score');
const highScoreP = document.getElementById('high-score');
const restartBtn = document.getElementById('restart-btn');
const soundToggle = document.getElementById('sound-toggle');
const progressDiv = document.getElementById('progress');

soundToggle.addEventListener('change', () => {
    soundOn = soundToggle.checked;
});

function playBeep(correct) {
    if (!soundOn) return;
    const duration = 0.2;
    const frequency = correct ? 440 : 220;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    oscillator.start();
    gainNode.gain.setValueAtTime(1, ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
}

function showQuestion() {
    const questionObj = questions[currentTopic][currentQuestionIndex];
    progressDiv.textContent = `Question ${currentQuestionIndex + 1} of ${questions[currentTopic].length}`;
    questionDiv.textContent = questionObj.q;
    optionsDiv.innerHTML = '';
    questionObj.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.addEventListener('click', () => selectAnswer(idx));
        optionsDiv.appendChild(btn);
    });
    nextBtn.classList.add('hidden');
}

function selectAnswer(index) {
    const questionObj = questions[currentTopic][currentQuestionIndex];
    const buttons = optionsDiv.querySelectorAll('button');
    buttons.forEach((btn, i) => {
        btn.disabled = true;
        if (i === questionObj.answer) {
            btn.style.backgroundColor = '#8f8';
        }
        if (i === index && i !== questionObj.answer) {
            btn.style.backgroundColor = '#f88';
        }
    });
    if (index === questionObj.answer) {
        score++;
        playBeep(true);
    } else {
        playBeep(false);
    }
    nextBtn.classList.remove('hidden');
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex >= questions[currentTopic].length) {
        showScore();
    } else {
        showQuestion();
    }
}

function showScore() {
    quizScreen.classList.add('hidden');
    scoreScreen.classList.remove('hidden');
    finalScoreP.textContent = `Your score: ${score} / ${questions[currentTopic].length}`;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('quizHighScore', highScore);
    }
    highScoreP.textContent = `High score: ${highScore}`;
    highScoreP.classList.remove('hidden');
}

function restart() {
    scoreScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    score = 0;
    currentQuestionIndex = 0;
    progressDiv.textContent = '';
    highScoreP.classList.add('hidden');
}

function startQuiz(topic) {
    currentTopic = topic;
    currentQuestionIndex = 0;
    score = 0;
    startScreen.classList.add('hidden');
    scoreScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    highScoreP.classList.add('hidden');
    progressDiv.textContent = '';
    showQuestion();
}

// Event listeners

document.querySelectorAll('.topic-btn').forEach(btn => {
    btn.addEventListener('click', () => startQuiz(btn.dataset.topic));
});

nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restart);
