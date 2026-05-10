// burger menu for mobile — toggle the nav links open/closed
const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
        navLinks.classList.toggle("open");
    });
}

// hide the top-bar when the user starts scrolling to save vertical space
const siteHeader = document.querySelector(".site-header");
const topBar = document.querySelector(".top-bar");
const levelsStickySection = document.querySelector(".levels-sticky-section");

// recalculate where the sticky section should start based on the current header height
// (header gets smaller when scrolled, so we need to update the offset)
function syncHeaderOffset() {
    if (!siteHeader || !levelsStickySection) return;
    const h = siteHeader.offsetHeight;
    levelsStickySection.style.top = h + "px";
    levelsStickySection.style.height = `calc(100vh - ${h}px)`;
}

if (topBar) {
    topBar.addEventListener("transitionend", syncHeaderOffset);
}

window.addEventListener("scroll", () => {
    if (siteHeader) {
        siteHeader.classList.toggle("scrolled", window.scrollY > 10);
    }
});

// pinned horizontal scroll for the "levels" section on formations.html
// inspired and adapted from a personal project by Raphaël Gastaldo
// the idea: as the user scrolls down through a tall container, a horizontal strip moves sideways
const levelsPinnedTrack = document.getElementById("levels-track");
const levelsStrip = document.getElementById("levels-strip");

if (levelsPinnedTrack && levelsStrip) {
    let totalWidth = levelsStrip.scrollWidth;

    function updateLevelsScroll() {
        // trackHeight is how many pixels of vertical scroll we have available for this section
        const trackHeight = levelsPinnedTrack.offsetHeight - window.innerHeight;
        if (trackHeight <= 0) return;

        // rect.top is negative once the section is past the top of the screen
        // dividing by trackHeight gives a 0→1 progress value
        const rect = levelsPinnedTrack.getBoundingClientRect();
        const maxScroll = totalWidth - window.innerWidth;
        const progress = Math.min(Math.max(-rect.top / trackHeight, 0), 1);

        levelsStrip.style.transform = `translateX(${-progress * maxScroll}px)`;
    }

    window.addEventListener("scroll", updateLevelsScroll);

    window.addEventListener("resize", () => {
        totalWidth = levelsStrip.scrollWidth;
        syncHeaderOffset();
        updateLevelsScroll();
    });

    syncHeaderOffset();
    updateLevelsScroll();
}

// application form validation (candidature.html)
const contactForm = document.getElementById("contact-form");

if (contactForm) {
    // one object to hold all the rules — easier to maintain than separate if/else chains
    const rules = {
        prenom:    { required: true, minLen: 2,  msg: "Le prénom doit contenir au moins 2 caractères." },
        nom:       { required: true, minLen: 2,  msg: "Le nom doit contenir au moins 2 caractères." },
        email:     { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: "Adresse email invalide." },
        telephone: { required: false, pattern: /^(\+?\d[\d\s\-().]{6,19})?$/, msg: "Numéro de téléphone invalide." },
        niveau:    { required: true, msg: "Veuillez sélectionner votre niveau actuel." },
        formation: { required: true, msg: "Veuillez sélectionner une formation." },
        message:   { required: true, minLen: 20, msg: "Le message doit contenir au moins 20 caractères." },
    };

    function validateField(id) {
        const field = document.getElementById(id);
        const errorEl = document.getElementById(id + "-error");
        if (!field || !errorEl) return true;

        const rule = rules[id];
        const value = field.type === "checkbox" ? field.checked : field.value.trim();

        let error = "";

        if (rule.required && !value) {
            error = rule.msg || "Ce champ est requis.";
        } else if (value && rule.minLen && String(value).length < rule.minLen) {
            error = rule.msg;
        } else if (value && rule.pattern && !rule.pattern.test(String(value))) {
            error = rule.msg;
        }

        errorEl.textContent = error;
        if (field.type !== "checkbox") {
            field.classList.toggle("invalid", !!error);
            field.classList.toggle("valid", !error && !!value);
        }
        return !error;
    }

    function validateCheckbox() {
        const field = document.getElementById("rgpd");
        const errorEl = document.getElementById("rgpd-error");
        if (!field || !errorEl) return true;
        const valid = field.checked;
        errorEl.textContent = valid ? "" : "Vous devez accepter la politique de confidentialité.";
        return valid;
    }

    // validate each field as soon as the user leaves it (blur = focus lost)
    // this gives feedback without waiting for the full submit
    Object.keys(rules).forEach((id) => {
        const field = document.getElementById(id);
        if (!field) return;
        const event = field.type === "checkbox" ? "change" : "blur";
        field.addEventListener(event, () => {
            if (id === "rgpd") validateCheckbox();
            else validateField(id);
        });
    });

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // validate all fields and track whether everything is valid
        let allValid = true;
        if (!validateField("prenom")) allValid = false;
        if (!validateField("nom")) allValid = false;
        if (!validateField("email")) allValid = false;
        if (!validateField("telephone")) allValid = false;
        if (!validateField("niveau")) allValid = false;
        if (!validateField("formation")) allValid = false;
        if (!validateField("message")) allValid = false;
        if (!validateCheckbox()) allValid = false;

        if (!allValid) {
            // focus the first invalid field so the user knows where to look
            const firstInvalid = contactForm.querySelector(".invalid, input:invalid, select:invalid, textarea:invalid");
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        const btn = document.getElementById("submit-btn");
        const successEl = document.getElementById("form-success");

        btn.disabled = true;
        btn.textContent = "Envoi en cours…";

        // no back-end, so we just simulate a short delay before showing the success message
        setTimeout(() => {
            contactForm.reset();
            contactForm.querySelectorAll(".invalid, .valid").forEach((el) => {
                el.classList.remove("invalid", "valid");
            });
            contactForm.querySelectorAll(".field-error").forEach((el) => {
                el.textContent = "";
            });
            successEl.hidden = false;
            btn.disabled = false;
            btn.textContent = "Envoyer ma demande";
            successEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 900);
    });
}

// teacher cards on enseignants.html — filter by category and show subjects on hover/click
const filterButtons = document.querySelectorAll(".filter-button");
const teacherCards = document.querySelectorAll(".interactive-teacher");
const subjectsList = document.querySelector("#subjects-list");

function showSubjects(card) {
    if (!subjectsList || !card) return;

    teacherCards.forEach((teacher) => teacher.classList.remove("selected"));
    card.classList.add("selected");

    // data-subjects on each card is a comma-separated list of subject names
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

        // show only cards that match the selected category (or all of them if "all" is selected)
        teacherCards.forEach((card) => {
            const shouldShow = filter === "all" || card.dataset.category === filter;
            card.hidden = !shouldShow;
        });

        // auto-select the first visible card so the subjects panel isn't empty
        const firstVisible = Array.from(teacherCards).find((card) => !card.hidden);
        showSubjects(firstVisible);
    });
});
