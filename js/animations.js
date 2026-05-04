/**
 * animations.js — Global animations, vanilla JS
 *
 * 1. Page entrance    — main fade + slide on load
 * 2. Scroll reveal    — IntersectionObserver, stagger auto dans les grids
 * 3. Counter          — chiffres .stats-section comptent vers la cible
 * 4. Word split       — h1 se révèlent mot par mot
 * 5. Magnetic buttons — CTA attirent légèrement le curseur
 */

document.addEventListener("DOMContentLoaded", () => {
    initPageEntrance();
    initScrollReveal();
    initCounters();
    initWordSplit();
    initMagneticButtons();
});

// ─────────────────────────────────────────────────────
// 1. Page entrance
// ─────────────────────────────────────────────────────
function initPageEntrance() {
    const main = document.querySelector("main");
    if (!main) return;

    main.style.cssText = "opacity:0; transform:translateY(18px); transition:opacity 0.55s ease, transform 0.55s ease;";

    // Double rAF pour s'assurer que le navigateur a peint l'état initial
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            main.style.opacity = "1";
            main.style.transform = "translateY(0)";
        });
    });
}

// ─────────────────────────────────────────────────────
// 2. Scroll reveal
// ─────────────────────────────────────────────────────
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
].join(", ");

function initScrollReveal() {
    const elements = document.querySelectorAll(REVEAL_TARGETS);
    if (!elements.length) return;

    // Stagger automatique pour les enfants directs de grids
    const STAGGER_PARENTS = ".cards-grid, .teacher-preview, .teacher-list, .stats-section";
    document.querySelectorAll(STAGGER_PARENTS).forEach(grid => {
        Array.from(grid.children).forEach((child, i) => {
            child.dataset.staggerDelay = (i * 100).toString(); // ms
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            const delay = parseInt(el.dataset.staggerDelay || "0");

            setTimeout(() => el.classList.add("is-revealed"), delay);
            observer.unobserve(el);
        });
    }, {
        threshold: 0.08,
        rootMargin: "0px 0px -32px 0px",
    });

    elements.forEach(el => {
        el.classList.add("reveal-ready");
        observer.observe(el);
    });
}

// ─────────────────────────────────────────────────────
// 3. Counter animation
// ─────────────────────────────────────────────────────
function initCounters() {
    const counters = document.querySelectorAll(".stats-section strong");
    if (!counters.length) return;

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
    const raw = el.textContent.trim();
    // Capture la partie numérique (avec espaces éventuels) et le suffixe
    const match = raw.match(/^([\d\s]+)(.*)/);
    if (!match) return;

    const target = parseInt(match[1].replace(/\s/g, ""), 10);
    const suffix = match[2]; // "+", "%", " ans"…
    const duration = 1800;
    const startTime = performance.now();

    function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quart
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(eased * target);

        // Format français : séparateur de milliers = espace
        el.textContent = current.toLocaleString("fr-FR") + suffix;

        if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
}

// ─────────────────────────────────────────────────────
// 4. Word split (h1)
// ─────────────────────────────────────────────────────
function initWordSplit() {
    const headings = document.querySelectorAll(".hero h1, .page-hero h1");
    if (!headings.length) return;

    headings.forEach(h => {
        const words = h.textContent.trim().split(/\s+/);
        h.innerHTML = words
            .map((word, i) =>
                `<span class="ws-wrap" style="--wi:${i}"><span class="ws-word">${word}</span></span>`
            )
            .join(" ");
        h.classList.add("ws-ready");
    });

    // Déclencher après l'entrance de la page
    setTimeout(() => {
        headings.forEach(h => h.classList.add("ws-visible"));
    }, 180);
}

// ─────────────────────────────────────────────────────
// 5. Magnetic buttons
// ─────────────────────────────────────────────────────
function initMagneticButtons() {
    // Désactivé sur tactile
    if (window.matchMedia("(hover: none)").matches) return;

    const targets = document.querySelectorAll(".button, .nav-button.yellow");

    targets.forEach(btn => {
        btn.addEventListener("mousemove", (e) => {
            const rect = btn.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) * 0.3;
            const dy = (e.clientY - cy) * 0.3;
            btn.style.transition = "transform 0.1s ease";
            btn.style.transform = `translate(${dx}px, ${dy}px)`;
        });

        btn.addEventListener("mouseleave", () => {
            btn.style.transition = "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
            btn.style.transform = "";
        });
    });
}
