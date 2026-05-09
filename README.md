# Computer Science Department — Efrei Paris

Web project built for the course **TI402 – Web Programming** (P2 INT4).
A showcase website for the Computer Science department of Efrei Paris, built with HTML5 / CSS3 / vanilla JavaScript — no framework, no external library.

**Students:** Raphaël Gastaldo · Hadi Daccache

---

## Pages

| File | Content |
|---|---|
| `index.html` | Home — hero, programs, campus gallery, stats, quiz CTA |
| `formations.html` | Detail of the 4 tracks with pinned horizontal scroll |
| `enseignants.html` | Faculty members, filterable by category |
| `matiere-python.html` | Python course spotlight (syllabus, video) |
| `about.html` | Department overview and project team |
| `candidature.html` | Application form with real-time validation |
| `quiz.html` | Orientation quiz in 5 questions (bonus feature) |

---

## Features

### Navigation & layout
- Responsive header with burger menu on mobile
- Top-bar hides on scroll to maximize screen space
- Footer present on every page

### Application form (`candidature.html`)
Fully client-side validation, no library:
- Field-by-field check on `blur` (focus loss)
- Custom rules per field: minimum length, email format, optional phone via regex, mandatory GDPR checkbox
- Inline error messages displayed under each field
- Simulated form submission with visual feedback (disabled button → success message)

**AI transparency:** the validation rules object (character minimums, regex patterns for email and phone format) was designed with the assistance of Claude AI. Regular expressions in particular were not covered in our course — we used AI to generate and verify them, then integrated them into the validation logic ourselves.

### Orientation quiz (`quiz.html` + `js/quiz.js`)
5 questions to guide the user toward one of the 4 tracks (Data, IT, Security, Embedded):
- Step-by-step navigation with a progress bar
- Category-based scoring: each answer increments a counter
- Result computed in plain JS (object `scores`, `Object.keys().reduce()`)
- Result displayed with a badge, description and tags — fully bilingual

**AI transparency:** we used Claude AI to get ideas for the questions and to think through the profile deduction logic (which type of answer maps to which track). We wrote the JS code, HTML structure and CSS styles of the quiz ourselves.

### Faculty filter (`enseignants.html`)
- Filter buttons by category (computer science, mathematics, management)
- Hovering or clicking a teacher card dynamically displays their subject list
- Implemented with `querySelectorAll`, `dataset`, and `hidden` attribute toggling

### Animations (`js/animations.js`)
- **Page entrance:** `<main>` slides up on load via a CSS transition triggered by `setTimeout`
- **Scroll reveal:** uses the `IntersectionObserver` API to trigger a CSS transition when an element enters the viewport. Cascade effect on grids via incremental `transitionDelay`
- **Animated counters:** stats on the home page count from 0 to their target value using `setInterval`
- **Animated headings:** words of each `<h1>` are split into `<span>` elements and appear one by one with an increasing delay

### Pinned horizontal scroll (`formations.html`)
The "training levels" section uses a horizontal scroll driven by the page's vertical scroll: the card strip moves horizontally as the user scrolls normally.

This technique is a reuse and adaptation of a mechanism Raphaël personally developed in a prior project (https://codeenclair.netlify.app). It relies on `getBoundingClientRect()` to calculate scroll progress within the pinned area and `transform: translateX()` to move the strip.

---

## FR / EN Internationalization

The entire site is available in French and English. The language choice is persisted via `localStorage`.

**How it works:** every text node in the interface has a `data-i18n` attribute with a key. The `applyTranslations()` function in `js/i18n.js` walks the DOM and replaces each element's `textContent` with the matching translation from the `translations` object.

**AI transparency:** we designed the system architecture (`data-i18n` attributes, `localStorage` read/write, translation loop) with the assistance of Claude AI. We then wrote, reviewed and completed all translations (~80 FR + EN keys) manually, integrated them page by page, and adapted the system for the quiz's dynamic content.

---

## Images & media

All campus photos on the site are **real photos of Efrei Paris** (Villejuif campus), sourced from official school resources.

- Our profile pictures (`about.html`) are our GitHub avatars
- The Python video (`matiere-python.html`) is embedded via a YouTube `<iframe>`

**Note on Unsplash:** during the early development phase, we used some placeholder images from Unsplash. Raphaël had picked up this habit while learning web development on his own, where Unsplash is a common resource for prototyping. We replaced all of them with real Efrei campus photos before the final version.

---

## W3C Validation

Each HTML page was individually submitted to the [W3C Markup Validation Service](https://validator.w3.org/) using the file upload tool. All pages pass with no errors.

---

## Project structure

```
/
├── index.html
├── formations.html
├── enseignants.html
├── matiere-python.html
├── about.html
├── candidature.html
├── quiz.html
├── css/
│   └── style.css
├── js/
│   ├── script.js       ← core interactions (menu, scroll, form, filters)
│   ├── animations.js   ← visual effects (scroll reveal, counters, word split)
│   ├── i18n.js         ← FR/EN translation engine
│   └── quiz.js         ← orientation quiz logic
└── img/
    └── (Efrei campus photos)
```

---

## Tech stack

- Semantic HTML5 (ARIA landmarks, `role`, `aria-*` attributes)
- CSS3: Flexbox, Grid, transitions, `@media` queries
- Vanilla JavaScript ES6+: `const`/`let`, arrow functions, `forEach`, `querySelector`, `IntersectionObserver`, `localStorage`
- No framework, no external dependency (except the YouTube iframe and the Efrei SVG logo)
