// animations.js - visual effects (scroll reveal, counters, headings)

document.addEventListener("DOMContentLoaded", () => {
    initPageEntrance();
    initScrollReveal();
    initCounters();
    initWordSplit();
});

// slide the page up on load so it doesn't just appear instantly
function initPageEntrance() {
    const main = document.querySelector("main");
    if (!main) return;

    main.style.opacity = "0";
    main.style.transform = "translateY(18px)";
    main.style.transition = "opacity 0.55s ease, transform 0.55s ease";

    // setTimeout with a tiny delay so the browser actually renders the hidden state first
    // without this, the transition doesn't play because the start and end states are set too close together
    setTimeout(() => {
        main.style.opacity = "1";
        main.style.transform = "translateY(0)";
    }, 50);
}

// elements that should animate in when they enter the screen
const REVEAL_TARGETS = [
    ".section-title",
    ".scroll-heading",
    ".hint",
    ".program-card",
    ".special-card",
    ".teacher-card",
    ".profile-card",
    ".info-card",
    ".step-card",
    ".code-card",
    ".program-table",
    ".subjects-box",
    ".page-hero > p",
    ".hero-text > p",
    ".hero-actions",
    ".quiz-answer",
    ".quiz-question h2",
    ".quiz-progress-track",
    ".quiz-result-badge",
].join(", ");

function initScrollReveal() {
    const elements = document.querySelectorAll(REVEAL_TARGETS);
    if (!elements.length) return;

    // for grids of cards, we add a small CSS delay to each child so they appear one after another
    // instead of all at once — looks much better visually
    const gridParents = ".cards-grid, .teacher-preview, .teacher-list, .stats-section, .quiz-answers";
    document.querySelectorAll(gridParents).forEach(grid => {
        Array.from(grid.children).forEach((child, i) => {
            child.style.transitionDelay = (i * 100) + "ms";
        });
    });

    // IntersectionObserver fires a callback when an element becomes visible in the viewport
    // we found this on MDN — it's cleaner than listening to the scroll event and manually
    // checking element positions with getBoundingClientRect() on every scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-revealed");
            // unobserve once revealed so we don't keep watching elements we already animated
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1 }); // trigger when at least 10% of the element is visible

    elements.forEach(el => {
        el.classList.add("reveal-ready"); // sets opacity:0 and translateY via CSS
        observer.observe(el);
    });
}

// animate the stat counters from 0 to their target value
function initCounters() {
    const counters = document.querySelectorAll(".stats-section strong");
    if (!counters.length) return;

    // only start the animation when the stats section is actually visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.4 });

    counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
    // we need to separate the number from any suffix (e.g. "1 200+" → number: 1200, suffix: "+")
    const raw = el.textContent.trim();
    const match = raw.match(/^([\d\s]+)(.*)/);
    if (!match) return;

    const target = parseInt(match[1].replace(/\s/g, ""), 10);
    const suffix = match[2];
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    // setInterval ticks every 25ms → 60 steps × 25ms = 1500ms total duration
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.textContent = target.toLocaleString("fr-FR") + suffix;
            clearInterval(timer);
        } else {
            el.textContent = Math.round(current).toLocaleString("fr-FR") + suffix;
        }
    }, 25);
}

// split h1 words into individual spans so each word can animate in separately
function initWordSplit() {
    const headings = document.querySelectorAll(".hero h1, .page-hero h1");
    if (!headings.length) return;

    headings.forEach(h => {
        const words = h.textContent.trim().split(/\s+/);
        // each word gets a slightly longer transition-delay than the previous one
        h.innerHTML = words
            .map((word, i) =>
                `<span class="ws-wrap"><span class="ws-word" style="transition-delay:${i * 90}ms">${word}</span></span>`
            )
            .join(" ");
        h.classList.add("ws-ready");
    });

    // small timeout so the initial hidden state is painted before we trigger the animation
    setTimeout(() => {
        headings.forEach(h => h.classList.add("ws-visible"));
    }, 180);
}
