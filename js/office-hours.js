// Office Hours Calendar System

const officeHoursData = [
    // Informatique Department
    {
        id: 1,
        name: "Ben Khelil C.",
        initials: "BC",
        department: "it",
        title: "Enseignante-chercheuse",
        email: "ben.khelil@efrei.fr",
        office: "Building Maison A305",
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
        department: "it",
        title: "Enseignant",
        email: "gaaloul@efrei.fr",
        office: "Building Maison A309",
        schedule: [
            { day: "Tuesday", startTime: "10:00", endTime: "12:00" },
            { day: "Thursday", startTime: "14:00", endTime: "16:00" }
        ]
    },
    {
        id: 3,
        name: "Klai K.",
        initials: "KK",
        department: "it",
        title: "Enseignant",
        email: "klai@efrei.fr",
        office: "Building Maison A301",
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
        department: "it",
        title: "Enseignante",
        email: "trebaul@efrei.fr",
        office: "Building Maison A307",
        schedule: [
            { day: "Tuesday", startTime: "14:00", endTime: "16:00" },
            { day: "Thursday", startTime: "09:00", endTime: "11:00" }
        ]
    },
    {
        id: 5,
        name: "Winstanley T.",
        initials: "WT",
        department: "it",
        title: "Enseignant",
        email: "winstanley@efrei.fr",
        office: "Building Maison A303",
        schedule: [
            { day: "Wednesday", startTime: "09:00", endTime: "11:00" },
            { day: "Friday", startTime: "10:00", endTime: "12:00" }
        ]
    },
    {
        id: 6,
        name: "Elloumi M.",
        initials: "EM",
        department: "it",
        title: "Enseignante",
        email: "elloumi@efrei.fr",
        office: "Building Maison A310",
        schedule: [
            { day: "Monday", startTime: "09:00", endTime: "11:00" },
            { day: "Thursday", startTime: "10:00", endTime: "12:00" }
        ]
    },
    // Management Department
    {
        id: 7,
        name: "Dupont J.",
        initials: "DJ",
        department: "business",
        title: "Enseignant",
        email: "dupont@efrei.fr",
        office: "Building Maison A408",
        schedule: [
            { day: "Monday", startTime: "13:00", endTime: "15:00" },
            { day: "Wednesday", startTime: "15:00", endTime: "17:00" }
        ]
    },
    {
        id: 8,
        name: "Martin S.",
        initials: "MS",
        department: "business",
        title: "Enseignante",
        email: "martin@efrei.fr",
        office: "Building Maison A402",
        schedule: [
            { day: "Tuesday", startTime: "13:00", endTime: "15:00" },
            { day: "Friday", startTime: "13:00", endTime: "15:00" }
        ]
    },
    // Engineering Department
    {
        id: 9,
        name: "Bernard P.",
        initials: "BP",
        department: "eng",
        title: "Enseignant-chercheur",
        email: "bernard@efrei.fr",
        office: "Building Maison A405",
        schedule: [
            { day: "Monday", startTime: "15:00", endTime: "17:00" },
            { day: "Thursday", startTime: "13:00", endTime: "15:00" }
        ]
    },
    {
        id: 10,
        name: "Leclerc A.",
        initials: "LA",
        department: "eng",
        title: "Enseignante",
        email: "leclerc@efrei.fr",
        office: "Building Maison A410",
        schedule: [
            { day: "Wednesday", startTime: "13:00", endTime: "15:00" },
            { day: "Friday", startTime: "14:00", endTime: "16:00" }
        ]
    }
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const dayNames = {
    "Monday": "Lundi",
    "Tuesday": "Mardi",
    "Wednesday": "Mercredi",
    "Thursday": "Jeudi",
    "Friday": "Vendredi"
};

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
    const options = { day: "numeric", month: "long" };
    return `Semaine du ${monday.toLocaleDateString("fr-FR", options)} au ${friday.toLocaleDateString("fr-FR", options)}`;
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
        
        const scheduleText = professor.schedule.map(s => 
            `${dayNames[s.day]} ${s.startTime}-${s.endTime}`
        ).join(" | ");

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
                <p><strong>Permanences:</strong> ${scheduleText}</p>
                <p><strong>Bureau:</strong> ${professor.office}</p>
                <p><strong>Email:</strong> <a href="mailto:${professor.email}">${professor.email}</a></p>
            </div>
        `;
        
        listContainer.appendChild(item);
    });
}

// Filter professors
function applyFilters() {
    const deptSelect = document.getElementById("dept-select");
    const profSearch = document.getElementById("prof-search");
    
    const deptFilter = deptSelect ? deptSelect.value : "all";
    const searchTerm = profSearch ? profSearch.value.toLowerCase() : "";

    filteredProfessors = officeHoursData.filter(prof => {
        const deptMatch = deptFilter === "all" || prof.department === deptFilter;
        const nameMatch = prof.name.toLowerCase().includes(searchTerm) || 
                         prof.initials.toLowerCase().includes(searchTerm);
        return deptMatch && nameMatch;
    });

    generateCalendar();
    generateOfficeHoursList();
}

// Initialize
function initOfficeHours() {
    const prevBtn = document.getElementById("prev-week");
    const nextBtn = document.getElementById("next-week");
    const deptSelect = document.getElementById("dept-select");
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

    if (deptSelect) {
        deptSelect.addEventListener("change", applyFilters);
    }

    if (profSearch) {
        profSearch.addEventListener("input", applyFilters);
    }

    // Initial generation
    generateCalendar();
    generateOfficeHoursList();
}

// Run on page load
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initOfficeHours);
} else {
    initOfficeHours();
}
