const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
        navLinks.classList.toggle("open");
    });
}

const levelsTrack = document.querySelector("#levels-track");
const scrollButtons = document.querySelectorAll(".scroll-btn");

scrollButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if (!levelsTrack) return;

        const direction = button.dataset.direction === "left" ? -1 : 1;
        levelsTrack.scrollBy({
            left: direction * 340,
            behavior: "smooth"
        });
    });
});

if (levelsTrack) {
    levelsTrack.addEventListener("wheel", (event) => {
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

        event.preventDefault();
        levelsTrack.scrollLeft += event.deltaY;
    }, { passive: false });
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
