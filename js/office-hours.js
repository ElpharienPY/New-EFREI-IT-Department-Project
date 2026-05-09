// Office Hours Calendar System

const officeHoursData = [
    {
        id: 1,
        name: "Ben Khelil C.",
        initials: "BC",
        title: "Enseignante-chercheuse",
        email: "ben.khelil@efrei.fr",
        office: "Building Maison A305",
        subjects: ["Algorithmique", "Structures de données", "Complexité"],
        schedule: [
            { day: "Monday", startTime: "10:00", endTime: "12:00" },
            { day: "Wednesday", startTime: "14:00", endTime: "16:00" },
            { day: "Friday", startTime: "09:00", endTime: "11:00" }
        ]
    },
    {
        id: 2,
        name: "Gaaloul W.",
        initials: "GW",
        title: "Enseignant",
        email: "gaaloul@efrei.fr",
        office: "Building Maison A309",
        subjects: ["Java OOP", "Design Patterns", "Génie logiciel"],
        schedule: [
            { day: "Tuesday", startTime: "10:00", endTime: "12:00" },
            { day: "Thursday", startTime: "14:00", endTime: "16:00" }
        ]
    },
    {
        id: 3,
        name: "Klai K.",
        initials: "KK",
        title: "Enseignant",
        email: "klai@efrei.fr",
        office: "Building Maison A301",
        subjects: ["Réseaux", "Protocoles", "Sécurité réseau"],
        schedule: [
            { day: "Monday", startTime: "14:00", endTime: "16:00" },
            { day: "Wednesday", startTime: "10:00", endTime: "12:00" },
            { day: "Friday", startTime: "14:00", endTime: "15:30" }
        ]
    },
    {
        id: 4,
        name: "Trebaul L.",
        initials: "TL",
        title: "Enseignante",
        email: "trebaul@efrei.fr",
        office: "Building Maison A307",
        subjects: ["Architecture", "Systèmes embarqués", "Linux"],
        schedule: [
            { day: "Tuesday", startTime: "14:00", endTime: "16:00" },
            { day: "Thursday", startTime: "09:00", endTime: "11:00" }
        ]
    },
    {
        id: 5,
        name: "Winstanley T.",
        initials: "WT",
        title: "Enseignant",
        email: "winstanley@efrei.fr",
        office: "Building Maison A303",
        subjects: ["Développement web", "JavaScript", "Interfaces"],
        schedule: [
            { day: "Wednesday", startTime: "09:00", endTime: "11:00" },
            { day: "Friday", startTime: "10:00", endTime: "12:00" }
        ]
    },
    {
        id: 6,
        name: "Elloumi M.",
        initials: "EM",
        title: "Enseignante",
        email: "elloumi@efrei.fr",
        office: "Building Maison A310",
        subjects: ["Machine Learning", "Data Mining", "Python"],
        schedule: [
            { day: "Monday", startTime: "09:00", endTime: "11:00" },
            { day: "Thursday", startTime: "10:00", endTime: "12:00" }
        ]
    }
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const dayNames = {
    fr: { "Monday": "Lundi", "Tuesday": "Mardi", "Wednesday": "Mercredi", "Thursday": "Jeudi", "Friday": "Vendredi" },
    en: { "Monday": "Monday", "Tuesday": "Tuesday", "Wednesday": "Wednesday", "Thursday": "Thursday", "Friday": "Friday" }
};

function getCurrentLang() {
    return localStorage.getItem("lang") || "fr";
}

const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];

let currentWeekOffset = 0;
let filteredProfessors = [...officeHoursData];

// Get week dates
function getWeekDates(offset = 0) {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) + (offset * 7);
    const monday = new Date(today.setDate(diff));
    const friday = new Date(monday);
    friday.setDate(friday.getDate() + 4);
    return { monday, friday };
}

// Format date for display
function formatWeekDisplay(offset = 0) {
    const { monday, friday } = getWeekDates(offset);
    const lang = getCurrentLang();
    const locale = lang === "en" ? "en-GB" : "fr-FR";
    const options = { day: "numeric", month: "long" };
    if (lang === "en") {
        return `Week of ${monday.toLocaleDateString(locale, options)} to ${friday.toLocaleDateString(locale, options)}`;
    }
    return `Semaine du ${monday.toLocaleDateString(locale, options)} au ${friday.toLocaleDateString(locale, options)}`;
}

// Check if a professor has office hours at a specific time
function getProfessorAtTimeSlot(professor, day, time) {
    return professor.schedule.find(s => 
        s.day === day && 
        s.startTime <= time && 
        time < s.endTime
    );
}

// Generate calendar
function generateCalendar() {
    const calendarBody = document.getElementById("calendar-body");
    const weekDisplay = document.getElementById("week-display");
    
    if (!calendarBody) return;
    
    weekDisplay.textContent = formatWeekDisplay(currentWeekOffset);
    calendarBody.innerHTML = "";

    timeSlots.forEach(time => {
        const timeRow = document.createElement("div");
        timeRow.className = "calendar-row";

        // Time label
        const timeCell = document.createElement("div");
        timeCell.className = "time-slot";
        timeCell.textContent = time;
        timeRow.appendChild(timeCell);

        // Days
        daysOfWeek.forEach(day => {
            const dayCell = document.createElement("div");
            dayCell.className = "day-slot";

            // Find professors with office hours at this time
            const professorsAtThisTime = filteredProfessors.filter(prof => {
                const hasSchedule = getProfessorAtTimeSlot(prof, day, time);
                return hasSchedule;
            });

            if (professorsAtThisTime.length > 0) {
                professorsAtThisTime.forEach(prof => {
                    const badge = document.createElement("div");
                    badge.className = "professor-badge";
                    badge.setAttribute("data-prof-id", prof.id);
                    badge.setAttribute("title", `${prof.name} - ${prof.office}`);
                    badge.innerHTML = `
                        <span class="badge-initials">${prof.initials}</span>
                        <span class="badge-name">${prof.name}</span>
                    `;
                    dayCell.appendChild(badge);
                });
            }

            timeRow.appendChild(dayCell);
        });

        calendarBody.appendChild(timeRow);
    });
}

// Generate office hours list
function generateOfficeHoursList() {
    const listContainer = document.getElementById("office-hours-items");
    if (!listContainer) return;
    
    listContainer.innerHTML = "";

    filteredProfessors.sort((a, b) => a.name.localeCompare(b.name)).forEach(professor => {
        const item = document.createElement("div");
        item.className = "office-hours-item";
        
        const lang = getCurrentLang();
        const names = dayNames[lang];
        const scheduleText = professor.schedule.map(s =>
            `${names[s.day]} ${s.startTime}-${s.endTime}`
        ).join(" | ");

        const labels = lang === "en"
            ? { hours: "Office hours", office: "Office", email: "Email" }
            : { hours: "Permanences", office: "Bureau", email: "Email" };

        item.innerHTML = `
            <div class="office-hours-header">
                <div class="professor-badge-list">
                    <span class="badge-initials">${professor.initials}</span>
                </div>
                <div class="professor-info">
                    <h4>${professor.name}</h4>
                    <p class="professor-title">${professor.title}</p>
                </div>
            </div>
            <div class="office-hours-details">
                <p><strong>${labels.hours} :</strong> ${scheduleText}</p>
                <p><strong>${labels.office} :</strong> ${professor.office}</p>
                <p><strong>${labels.email} :</strong> <a href="mailto:${professor.email}">${professor.email}</a></p>
            </div>
        `;
        
        listContainer.appendChild(item);
    });
}

// Populate subject select from data
function populateSubjectSelect() {
    const subjectSelect = document.getElementById("subject-select");
    if (!subjectSelect) return;

    const allSubjects = [];
    officeHoursData.forEach(prof => {
        prof.subjects.forEach(s => {
            if (!allSubjects.includes(s)) allSubjects.push(s);
        });
    });
    allSubjects.sort();

    // Keep only the "all" option, then add subjects
    subjectSelect.innerHTML = "";
    const lang = getCurrentLang();
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.setAttribute("data-i18n", "oh_subject_all");
    allOption.textContent = lang === "en" ? "All subjects" : "Toutes les matières";
    subjectSelect.appendChild(allOption);

    allSubjects.forEach(subject => {
        const opt = document.createElement("option");
        opt.value = subject;
        opt.textContent = subject;
        subjectSelect.appendChild(opt);
    });
}

// Filter professors
function applyFilters() {
    const subjectSelect = document.getElementById("subject-select");
    const profSearch = document.getElementById("prof-search");

    const subjectFilter = subjectSelect ? subjectSelect.value : "all";
    const searchTerm = profSearch ? profSearch.value.toLowerCase() : "";

    filteredProfessors = officeHoursData.filter(prof => {
        const subjectMatch = subjectFilter === "all" || prof.subjects.includes(subjectFilter);
        const nameMatch = prof.name.toLowerCase().includes(searchTerm) ||
                         prof.initials.toLowerCase().includes(searchTerm);
        return subjectMatch && nameMatch;
    });

    generateCalendar();
    generateOfficeHoursList();
}

// Initialize
function initOfficeHours() {
    const prevBtn = document.getElementById("prev-week");
    const nextBtn = document.getElementById("next-week");
    const subjectSelect = document.getElementById("subject-select");
    const profSearch = document.getElementById("prof-search");

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            currentWeekOffset--;
            generateCalendar();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            currentWeekOffset++;
            generateCalendar();
        });
    }

    if (subjectSelect) {
        subjectSelect.addEventListener("change", applyFilters);
    }

    if (profSearch) {
        profSearch.addEventListener("input", applyFilters);
    }

    // re-render when the user switches language
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            setTimeout(() => {
                populateSubjectSelect();
                generateCalendar();
                generateOfficeHoursList();
            }, 0);
        });
    });

    // Initial generation
    populateSubjectSelect();
    generateCalendar();
    generateOfficeHoursList();
}

// Run on page load
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initOfficeHours);
} else {
    initOfficeHours();
}
