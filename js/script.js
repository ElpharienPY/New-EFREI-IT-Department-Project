const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
        navLinks.classList.toggle("open");
    });
}

// ── Header : masquer la top-bar au scroll ──
const siteHeader = document.querySelector(".site-header");
const topBar = document.querySelector(".top-bar");
const levelsStickySection = document.querySelector(".levels-sticky-section");

function syncHeaderOffset() {
    if (!siteHeader || !levelsStickySection) return;
    const h = siteHeader.offsetHeight;
    levelsStickySection.style.top = h + "px";
    levelsStickySection.style.height = `calc(100vh - ${h}px)`;
}

// Recalcule l'offset une fois la transition CSS terminée
if (topBar) {
    topBar.addEventListener("transitionend", syncHeaderOffset);
}

window.addEventListener("scroll", () => {
    if (siteHeader) {
        siteHeader.classList.toggle("scrolled", window.scrollY > 10);
    }
});

// ── Pinned horizontal scroll — Niveaux ──
const levelsPinnedTrack = document.getElementById("levels-track");
const levelsStrip = document.getElementById("levels-strip");

if (levelsPinnedTrack && levelsStrip) {
    let totalWidth = levelsStrip.scrollWidth;
    let ticking = false;

    function updateLevelsScroll() {
        const trackHeight = levelsPinnedTrack.offsetHeight - window.innerHeight;
        if (trackHeight <= 0) return;

        const rect = levelsPinnedTrack.getBoundingClientRect();
        const maxScroll = totalWidth - window.innerWidth;
        const progress = Math.min(Math.max(-rect.top / trackHeight, 0), 1);
        levelsStrip.style.transform = `translateX(${-progress * maxScroll}px)`;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateLevelsScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    window.addEventListener("resize", () => {
        totalWidth = levelsStrip.scrollWidth;
        syncHeaderOffset();
        updateLevelsScroll();
    });

    syncHeaderOffset();
    updateLevelsScroll();
}

const filterButtons = document.querySelectorAll(".filter-button");
const teacherCards = document.querySelectorAll(".interactive-teacher");
const subjectsList = document.querySelector("#subjects-list");

function showSubjects(card) {
    if (!subjectsList || !card) return;

    teacherCards.forEach((teacher) => teacher.classList.remove("selected"));
    card.classList.add("selected");

    const subjects = (card.dataset.subjects || "").split(",").map((subject) => subject.trim());
    subjectsList.innerHTML = subjects.map((subject) => `<li>${subject}</li>`).join("");
}

teacherCards.forEach((card) => {
    card.addEventListener("mouseenter", () => showSubjects(card));
    card.addEventListener("click", () => showSubjects(card));
});

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        filterButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        teacherCards.forEach((card) => {
            const shouldShow = filter === "all" || card.dataset.category === filter;
            card.hidden = !shouldShow;
        });

        const firstVisible = Array.from(teacherCards).find((card) => !card.hidden);
        showSubjects(firstVisible);
    });
});
