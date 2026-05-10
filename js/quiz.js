const QUESTIONS_COUNT = 5;

// all possible results, in both languages
// each track has a badge, a color, a description and tags
const RESULTS = {
    fr: {
        data: {
            title: "Data Science",
            badge: "DS",
            color: "#00a3c7",
            desc: "Tu es fait pour la Data Science ! Analyse de données, intelligence artificielle et business intelligence sont tes domaines de prédilection. Tu transformeras des données brutes en décisions stratégiques.",
            tags: ["Data & IA", "Data Engineering", "BI & Analytics"],
        },
        it: {
            title: "Info. Technology",
            badge: "IT",
            color: "#003a70",
            desc: "Tu es taillé pour l'Info. Technology ! Du développement full stack à l'architecture logicielle, tu construiras les applications qui font tourner le monde numérique.",
            tags: ["Full Stack", "Web Avancé", "Architecture logicielle"],
        },
        secu: {
            title: "Sécurité & Réseaux",
            badge: "SR",
            color: "#1a1a2e",
            desc: "La Sécurité & Réseaux est faite pour toi ! Protéger les infrastructures, détecter les intrusions et maîtriser la cryptographie — tu seras le gardien du monde numérique.",
            tags: ["Cybersécurité", "Réseaux", "Confiance numérique"],
        },
        emb: {
            title: "Systèmes Embarqués",
            badge: "SE",
            color: "#ffd200",
            desc: "Les Systèmes Embarqués t'attendent ! Robotique, IoT, transports intelligents — tu concevras les systèmes intelligents qui connectent le monde physique et le numérique.",
            tags: ["Robotique", "IoT", "Transports intelligents"],
        },
    },
    en: {
        data: {
            title: "Data Science",
            badge: "DS",
            color: "#00a3c7",
            desc: "You were made for Data Science! Data analysis, artificial intelligence and business intelligence are your fields of predilection. You will turn raw data into strategic decisions.",
            tags: ["Data & AI", "Data Engineering", "BI & Analytics"],
        },
        it: {
            title: "Info. Technology",
            badge: "IT",
            color: "#003a70",
            desc: "You are built for Info. Technology! From full stack development to software architecture, you will build the applications that power the digital world.",
            tags: ["Full Stack", "Advanced Web", "Software Architecture"],
        },
        secu: {
            title: "Security & Networks",
            badge: "SR",
            color: "#1a1a2e",
            desc: "Security & Networks is made for you! Protecting infrastructures, detecting intrusions and mastering cryptography — you will be the guardian of the digital world.",
            tags: ["Cybersecurity", "Networks", "Digital Trust"],
        },
        emb: {
            title: "Embedded Systems",
            badge: "SE",
            color: "#ffd200",
            desc: "Embedded Systems are waiting for you! Robotics, IoT, intelligent transport — you will design the smart systems that connect the physical and digital worlds.",
            tags: ["Robotics", "IoT", "Intelligent Transport"],
        },
    },
};

// tracks which question we're on and how many points each track has accumulated
let currentQuestion = 0;
let scores = { data: 0, it: 0, secu: 0, emb: 0 };

const questions = Array.from(document.querySelectorAll(".quiz-question"));
const nextBtn = document.getElementById("quiz-next");
const counter = document.getElementById("quiz-counter");
const progressBar = document.getElementById("quiz-progress-bar");
const progressTrack = document.querySelector(".quiz-progress-track");
const quizQuestionsWrapper = document.getElementById("quiz-questions");
const quizResult = document.getElementById("quiz-result");
const restartBtn = document.getElementById("quiz-restart");

// read the current language from localStorage (set by i18n.js)
function getCurrentLang() {
    return localStorage.getItem("lang") || "fr";
}

// update the progress bar width and the "Question X / 5" label
function updateProgress() {
    const pct = ((currentQuestion + 1) / QUESTIONS_COUNT) * 100;
    progressBar.style.width = pct + "%";
    counter.textContent = "Question " + (currentQuestion + 1) + " / " + QUESTIONS_COUNT;
    if (progressTrack) {
        progressTrack.setAttribute("aria-valuenow", currentQuestion + 1);
    }
}

// change the button label on the last question so the user knows they're about to see their result
function updateNextBtn() {
    const lang = getCurrentLang();
    const isLast = currentQuestion === QUESTIONS_COUNT - 1;
    if (lang === "en") {
        nextBtn.textContent = isLast ? "See my result ✓" : "Next →";
    } else {
        nextBtn.textContent = isLast ? "Voir mon résultat ✓" : "Suivant →";
    }
}

function goToQuestion(index) {
    questions[currentQuestion].hidden = true;
    currentQuestion = index;
    questions[currentQuestion].hidden = false;
    // disable "next" until the user picks an answer on the new question
    nextBtn.disabled = true;
    updateNextBtn();
    updateProgress();
}

function showResult() {
    // hide the quiz interface
    quizQuestionsWrapper.hidden = true;
    nextBtn.hidden = true;
    counter.hidden = true;
    progressBar.parentElement.hidden = true;

    const lang = getCurrentLang();

    // find the track with the highest score
    let winner = "data";
    for (let track in scores) {
        if (scores[track] > scores[winner]) {
            winner = track;
        }
    }
    const result = RESULTS[lang][winner];

    document.getElementById("result-badge").textContent = result.badge;
    document.getElementById("result-badge").style.background = result.color;
    // yellow badge needs dark text to stay readable
    document.getElementById("result-badge").style.color = result.color === "#ffd200" ? "#003a70" : "#fff";
    document.getElementById("result-title").textContent = result.title;
    document.getElementById("result-desc").textContent = result.desc;

    const tagsEl = document.getElementById("result-tags");
    tagsEl.innerHTML = result.tags.map((t) => `<span>${t}</span>`).join("");

    quizResult.hidden = false;
    quizResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// reset everything back to the initial state
function restart() {
    scores = { data: 0, it: 0, secu: 0, emb: 0 };
    currentQuestion = 0;

    questions.forEach((q) => {
        q.hidden = true;
        q.querySelectorAll(".quiz-answer").forEach((a) => a.classList.remove("selected"));
    });

    quizResult.hidden = true;
    quizQuestionsWrapper.hidden = false;
    nextBtn.hidden = false;
    counter.hidden = false;
    progressBar.parentElement.hidden = false;

    questions[0].hidden = false;
    nextBtn.disabled = true;
    updateNextBtn();
    updateProgress();
}

// when the user clicks an answer, mark it as selected and enable the next button
questions.forEach((q) => {
    q.querySelectorAll(".quiz-answer").forEach((btn) => {
        btn.addEventListener("click", () => {
            q.querySelectorAll(".quiz-answer").forEach((b) => b.classList.remove("selected"));
            btn.classList.add("selected");
            nextBtn.disabled = false;
        });
    });
});

// on "next": add the score for the selected answer, then go to the next question (or show the result)
nextBtn.addEventListener("click", () => {
    const selectedAnswer = questions[currentQuestion].querySelector(".quiz-answer.selected");
    if (!selectedAnswer) return;

    // data-score on each button tells us which track to increment ("data", "it", "secu", "emb")
    scores[selectedAnswer.dataset.score]++;

    if (currentQuestion < QUESTIONS_COUNT - 1) {
        goToQuestion(currentQuestion + 1);
    } else {
        showResult();
    }
});

restartBtn.addEventListener("click", restart);

// if the user switches language mid-quiz, update the next button label immediately
document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        setTimeout(updateNextBtn, 0);
    });
});

// initial render
updateProgress();
updateNextBtn();
