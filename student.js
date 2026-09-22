// =========================================================
// CAMPUSHUB STUDENT DASHBOARD
// student.js
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  // =====================================================
  // 1. CONFIGURATION
  // =====================================================

  const SESSION_KEY = "campusHubCurrentUser";

  // =====================================================
  // 2. GET CURRENT USER
  // =====================================================

  function getCurrentUser() {
    const session = localStorage.getItem(SESSION_KEY);

    if (!session) {
      return null;
    }

    try {
      return JSON.parse(session);
    } catch (error) {
      console.error("Invalid CampusHub session:", error);
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  }

  const currentUser = getCurrentUser();

  // =====================================================
  // 3. AUTHENTICATION CHECK
  // =====================================================

  if (!currentUser) {
    window.location.href = "./index.html";
    return;
  }

  /*
        A student should only access student.html.

        If another role somehow reaches this page,
        redirect them to the correct dashboard.
    */

  if (currentUser.role !== "student") {
    if (currentUser.role === "alumni") {
      window.location.href = "./alumni.html";
      return;
    }

    if (currentUser.role === "admin") {
      window.location.href = "./admin.html";
      return;
    }

    localStorage.removeItem(SESSION_KEY);
    window.location.href = "./index.html";
    return;
  }

  // =====================================================
  // 4. HELPER FUNCTIONS
  // =====================================================

  function getInitials(name) {
    if (!name) {
      return "ST";
    }

    const words = name.trim().split(/\s+/).filter(Boolean);

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (
      words[0].charAt(0) + words[words.length - 1].charAt(0)
    ).toUpperCase();
  }

  function getFirstName(name) {
    if (!name) {
      return "Student";
    }

    return name.trim().split(/\s+/)[0];
  }

  function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = value || "";
    }
  }

  // =====================================================
  // 5. LOAD STUDENT INFORMATION
  // =====================================================

  const fullName = currentUser.name || "Student";
  const firstName = getFirstName(fullName);
  const email = currentUser.email || "student@premier.edu";
  const avatar = currentUser.avatar || getInitials(fullName);

  const department = currentUser.department || "Computer Science & Engineering";

  const batch = currentUser.batch || "2026";

  const section = currentUser.section || "Section A";

  // Sidebar
  setText("sidebarUserName", fullName);
  setText("sidebarAvatar", avatar);

  // Topbar
  setText("topbarUserName", fullName);
  setText("topbarAvatar", avatar);

  // Profile dropdown
  setText("dropdownUserName", fullName);
  setText("dropdownUserEmail", email);
  setText("dropdownAvatar", avatar);

  // Welcome banner
  setText("welcomeName", firstName);

  // Profile page
  setText("profileName", fullName);
  setText("profileEmail", email);
  setText("profileAvatar", avatar);
  setText("profileDepartment", department);
  setText("profileBatch", batch);
  setText("profileSection", section);

  // =====================================================
  // 6. DOM ELEMENTS
  // =====================================================

  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const mobileMenuButton = document.getElementById("mobileMenuButton");
  const sidebarClose = document.getElementById("sidebarClose");

  const notificationButton = document.getElementById("notificationButton");

  const notificationDropdown = document.getElementById("notificationDropdown");

  const profileButton = document.getElementById("profileButton");

  const profileDropdown = document.getElementById("profileDropdown");

  const logoutButton = document.getElementById("logoutButton");

  const dropdownLogout = document.getElementById("dropdownLogout");

  const markNotificationsRead = document.getElementById(
    "markNotificationsRead",
  );

  const globalSearch = document.getElementById("globalSearch");

  const pageTitle = document.getElementById("pageTitle");

  // =====================================================
  // 7. SIDEBAR MOBILE CONTROLS
  // =====================================================

  function openSidebar() {
    if (!sidebar) {
      return;
    }

    sidebar.classList.add("mobile-open");

    if (sidebarOverlay) {
      sidebarOverlay.classList.add("show");
    }
  }

  function closeSidebar() {
    if (!sidebar) {
      return;
    }

    sidebar.classList.remove("mobile-open");

    if (sidebarOverlay) {
      sidebarOverlay.classList.remove("show");
    }
  }

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", openSidebar);
  }

  if (sidebarClose) {
    sidebarClose.addEventListener("click", closeSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeSidebar);
  }

  // =====================================================
  // 8. PAGE SECTION NAVIGATION
  // =====================================================

  const navItems = document.querySelectorAll(".nav-item");
  const contentSections = document.querySelectorAll(".content-section");

  const sectionMap = {
    dashboard: "dashboardSection",
    announcements: "announcementsSection",
    events: "eventsSection",
    resources: "resourcesSection",
    communities: "communitiesSection",
    jobs: "jobsSection",
    alumni: "alumniSection",
    profile: "profileSection",
    notifications: "notificationsSection",
    settings: "settingsSection",
  };

  const pageTitles = {
    dashboard: "Dashboard",
    announcements: "Announcements",
    events: "Events",
    resources: "Academic Resources",
    communities: "Communities",
    jobs: "Jobs & Internships",
    alumni: "Alumni Network",
    profile: "My Profile",
    notifications: "Notifications",
    settings: "Settings",
  };

  function showSection(sectionName, updateHash = true) {
    const targetId = sectionMap[sectionName];

    if (!targetId) {
      sectionName = "dashboard";
    }

    const finalTargetId = sectionMap[sectionName] || sectionMap.dashboard;

    contentSections.forEach((section) => {
      section.classList.remove("active-section");
    });

    const targetSection = document.getElementById(finalTargetId);

    if (targetSection) {
      targetSection.classList.add("active-section");
    }

    navItems.forEach((item) => {
      item.classList.remove("active");

      if (item.dataset.section === sectionName) {
        item.classList.add("active");
      }
    });

    if (pageTitle) {
      pageTitle.textContent = pageTitles[sectionName] || "Dashboard";
    }

    if (updateHash) {
      history.replaceState(null, "", `#${sectionName}`);
    }

    closeSidebar();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  navItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();

      const sectionName = item.dataset.section;

      showSection(sectionName);
    });
  });

  // =====================================================
  // 9. HASH NAVIGATION
  // =====================================================

  function loadSectionFromHash() {
    const hash = window.location.hash.replace("#", "").trim();

    if (hash && sectionMap[hash]) {
      showSection(hash, false);
    } else {
      showSection("dashboard", false);
    }
  }

  loadSectionFromHash();

  window.addEventListener("hashchange", () => {
    loadSectionFromHash();
  });

  // =====================================================
  // 10. CLOSE DROPDOWNS
  // =====================================================

  function closeDropdowns() {
    if (notificationDropdown) {
      notificationDropdown.classList.remove("show");
    }

    if (profileDropdown) {
      profileDropdown.classList.remove("show");
    }
  }

  // =====================================================
  // 11. NOTIFICATION DROPDOWN
  // =====================================================

  if (notificationButton) {
    notificationButton.addEventListener("click", (event) => {
      event.stopPropagation();

      if (profileDropdown) {
        profileDropdown.classList.remove("show");
      }

      notificationDropdown.classList.toggle("show");
    });
  }

  // =====================================================
  // 12. PROFILE DROPDOWN
  // =====================================================

  if (profileButton) {
    profileButton.addEventListener("click", (event) => {
      event.stopPropagation();

      if (notificationDropdown) {
        notificationDropdown.classList.remove("show");
      }

      profileDropdown.classList.toggle("show");
    });
  }

  // Prevent dropdown click from closing itself
  if (notificationDropdown) {
    notificationDropdown.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  if (profileDropdown) {
    profileDropdown.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  document.addEventListener("click", () => {
    closeDropdowns();
  });

  // =====================================================
  // 13. MARK NOTIFICATIONS AS READ
  // =====================================================

  if (markNotificationsRead) {
    markNotificationsRead.addEventListener("click", () => {
      const unreadItems = document.querySelectorAll(
        ".notification-item.unread",
      );

      unreadItems.forEach((item) => {
        item.classList.remove("unread");
      });

      const notificationDot = document.querySelector(".notification-dot");

      if (notificationDot) {
        notificationDot.style.display = "none";
      }

      const notificationCount = document.querySelector(".notification-count");

      if (notificationCount) {
        notificationCount.textContent = "0";
      }

      const headerCount = document.querySelector(".dropdown-header span");

      if (headerCount) {
        headerCount.textContent = "You're all caught up";
      }
    });
  }

  // =====================================================
  // 14. PROFILE DROPDOWN LINKS
  // =====================================================

  const profileLinks = profileDropdown
    ? profileDropdown.querySelectorAll("a")
    : [];

  profileLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const href = link.getAttribute("href");

      if (href && href.startsWith("#")) {
        const section = href.substring(1);

        if (sectionMap[section]) {
          showSection(section);
        }
      }

      closeDropdowns();
    });
  });

  // =====================================================
  // 15. LOGOUT
  // =====================================================

  function logout() {
    const confirmed = window.confirm(
      "Are you sure you want to log out of CampusHub?",
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(SESSION_KEY);

    window.location.href = "./index.html";
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }

  if (dropdownLogout) {
    dropdownLogout.addEventListener("click", logout);
  }

  // =====================================================
  // 16. SEARCH
  // =====================================================

  const searchableElements = document.querySelectorAll(
    ".dashboard-card, .announcement-item, .event-item, " +
      ".resource-item, .job-item, .community-item, " +
      ".activity-item",
  );

  function clearSearchHighlights() {
    searchableElements.forEach((element) => {
      element.classList.remove("search-highlight");
    });
  }

  function performSearch(query) {
    clearSearchHighlights();

    const cleanQuery = query.trim().toLowerCase();

    if (!cleanQuery) {
      return;
    }

    let firstMatch = null;

    searchableElements.forEach((element) => {
      const text = element.textContent.toLowerCase();

      if (text.includes(cleanQuery)) {
        element.classList.add("search-highlight");

        if (!firstMatch) {
          firstMatch = element;
        }
      }
    });

    if (firstMatch) {
      firstMatch.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }

  if (globalSearch) {
    globalSearch.addEventListener("input", (event) => {
      performSearch(event.target.value);
    });

    globalSearch.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        globalSearch.value = "";

        clearSearchHighlights();

        globalSearch.blur();
      }
    });
  }

  // =====================================================
  // 17. SEARCH SHORTCUT
  // =====================================================

  document.addEventListener("keydown", (event) => {
    const isShortcut =
      (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";

    if (isShortcut) {
      event.preventDefault();

      if (globalSearch) {
        globalSearch.focus();
      }
    }
  });

  // =====================================================
  // 18. SAVED JOBS
  // =====================================================

  const SAVED_JOBS_KEY = "campusHubSavedJobs";

  function getSavedJobs() {
    const saved = localStorage.getItem(SAVED_JOBS_KEY);

    if (!saved) {
      return [];
    }

    try {
      return JSON.parse(saved);
    } catch (error) {
      return [];
    }
  }

  function saveSavedJobs(jobs) {
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(jobs));
  }

  const saveJobButtons = document.querySelectorAll(".save-job");

  saveJobButtons.forEach((button, index) => {
    const jobId = `student-job-${index + 1}`;

    const savedJobs = getSavedJobs();

    if (savedJobs.includes(jobId)) {
      button.classList.add("saved");

      const icon = button.querySelector("i");

      if (icon) {
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
      }
    }

    button.addEventListener("click", () => {
      let jobs = getSavedJobs();

      const icon = button.querySelector("i");

      if (jobs.includes(jobId)) {
        jobs = jobs.filter((id) => id !== jobId);

        button.classList.remove("saved");

        if (icon) {
          icon.classList.remove("fa-solid");
          icon.classList.add("fa-regular");
        }
      } else {
        jobs.push(jobId);

        button.classList.add("saved");

        if (icon) {
          icon.classList.remove("fa-regular");
          icon.classList.add("fa-solid");
        }
      }

      saveSavedJobs(jobs);
    });
  });

  // =====================================================
  // 19. "VIEW ALL" LINKS
  // =====================================================

  const viewAllLinks = document.querySelectorAll(".view-all[href^='#']");

  viewAllLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const href = link.getAttribute("href");

      if (!href) {
        return;
      }

      const section = href.substring(1);

      if (sectionMap[section]) {
        showSection(section);
      }
    });
  });

  // =====================================================
  // 20. RESOURCE LINKS
  // =====================================================

  const resourceLinks = document.querySelectorAll(".resource-item[href^='#']");

  resourceLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      showSection("resources");
    });
  });

  // =====================================================
  // 21. COMMUNITY LINKS
  // =====================================================

  const communityLinks = document.querySelectorAll(
    ".community-item[href^='#']",
  );

  communityLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      showSection("communities");
    });
  });

  // =====================================================
  // 22. PREVENT EMPTY FOOTER LINKS
  // =====================================================

  const emptyLinks = document.querySelectorAll('.dashboard-footer a[href="#"]');

  emptyLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });

  // =====================================================
  // 23. SAVE SESSION HELPER
  // =====================================================

  window.getCampusHubStudent = function () {
    return getCurrentUser();
  };

  // =====================================================
  // 24. LOGOUT GLOBAL HELPER
  // =====================================================

  window.logoutCampusHub = function () {
    localStorage.removeItem(SESSION_KEY);

    window.location.href = "./index.html";
  };

  // =====================================================
  // 25. DEBUG INFORMATION
  // =====================================================

  console.log("CampusHub Student Dashboard loaded.");

  console.log("Logged in student:", currentUser);
});

/* =========================================================
   ANNOUNCEMENTS / EVENTS / RESOURCES
   ISOLATED FUNCTIONAL MODULE
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const ANNOUNCEMENTS_KEY = "campusHubAnnouncements";
  const EVENTS_KEY = "campusHubEvents";
  const RESOURCES_KEY = "campusHubResources";
  const RSVP_KEY = "campusHubEventRSVPs";

  const defaultAnnouncements = [
    {
      id: "a1",
      title: "Mid-Term Examination Schedule Published",
      category: "Academic",
      date: "2026-09-18",
      description:
        "The mid-term examination schedule has been published. Students should check their department notice board for room assignments.",
    },
    {
      id: "a2",
      title: "CampusHub Community Registration Open",
      category: "Community",
      date: "2026-09-16",
      description:
        "Students can now join academic, cultural, technical and recreational communities through CampusHub.",
    },
    {
      id: "a3",
      title: "Library Extended Hours",
      category: "Library",
      date: "2026-09-14",
      description:
        "The university library will remain open until 10:00 PM during the examination preparation period.",
    },
    {
      id: "a4",
      title: "Career Development Workshop",
      category: "Career",
      date: "2026-09-12",
      description:
        "A workshop covering CV preparation, interviews and professional networking will be held this month.",
    },
  ];

  const defaultEvents = [
    {
      id: "e1",
      title: "Campus Career Fair 2026",
      date: "2026-09-28",
      time: "10:00 AM - 4:00 PM",
      location: "University Auditorium",
      category: "Career",
      description:
        "Meet recruiters from leading companies and explore internship and graduate opportunities.",
    },
    {
      id: "e2",
      title: "Inter-University Programming Contest",
      date: "2026-10-03",
      time: "9:00 AM - 5:00 PM",
      location: "CSE Department Lab",
      category: "Academic",
      description: "A competitive programming event for university students.",
    },
    {
      id: "e3",
      title: "Alumni Networking Evening",
      date: "2026-10-10",
      time: "5:30 PM - 8:00 PM",
      location: "University Conference Hall",
      category: "Networking",
      description:
        "Connect with alumni and learn about careers and professional opportunities.",
    },
    {
      id: "e4",
      title: "Freshers Cultural Night",
      date: "2026-10-17",
      time: "6:00 PM - 9:30 PM",
      location: "Central Auditorium",
      category: "Cultural",
      description:
        "An evening of music, performances, games and student activities.",
    },
  ];

  const defaultResources = [
    {
      id: "r1",
      title: "Database Management Systems",
      course: "CSE 311",
      type: "Lecture Notes",
      date: "2026-09-15",
    },
    {
      id: "r2",
      title: "Data Structures & Algorithms",
      course: "CSE 221",
      type: "Study Guide",
      date: "2026-09-13",
    },
    {
      id: "r3",
      title: "Computer Networks — Chapter 1-5",
      course: "CSE 331",
      type: "Lecture Slides",
      date: "2026-09-11",
    },
    {
      id: "r4",
      title: "Software Engineering Previous Questions",
      course: "CSE 341",
      type: "Previous Questions",
      date: "2026-09-09",
    },
    {
      id: "r5",
      title: "Operating Systems Lab Manual",
      course: "CSE 321",
      type: "Lab Manual",
      date: "2026-09-07",
    },
  ];

  function getData(key, fallback) {
    try {
      const data = JSON.parse(localStorage.getItem(key));

      if (Array.isArray(data)) {
        return data;
      }

      return fallback;
    } catch {
      return fallback;
    }
  }

  function setData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  /* Create demo data only once */

  if (!localStorage.getItem(ANNOUNCEMENTS_KEY)) {
    setData(ANNOUNCEMENTS_KEY, defaultAnnouncements);
  }

  if (!localStorage.getItem(EVENTS_KEY)) {
    setData(EVENTS_KEY, defaultEvents);
  }

  if (!localStorage.getItem(RESOURCES_KEY)) {
    setData(RESOURCES_KEY, defaultResources);
  }

  if (!localStorage.getItem(RSVP_KEY)) {
    setData(RSVP_KEY, {});
  }

  /* =====================================================
       ANNOUNCEMENTS
    ===================================================== */

  const announcementsList = document.getElementById("announcementsList");

  const announcementSearch = document.getElementById("announcementSearch");

  function renderAnnouncements(search = "") {
    if (!announcementsList) return;

    const announcements = getData(ANNOUNCEMENTS_KEY, defaultAnnouncements);

    const query = search.toLowerCase().trim();

    const filtered = announcements.filter((item) => {
      return (
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    });

    if (filtered.length === 0) {
      announcementsList.innerHTML = `
                <div class="empty-state">
                    <h3>No announcements found</h3>
                    <p>Try another search.</p>
                </div>
            `;
      return;
    }

    announcementsList.innerHTML = filtered
      .map(
        (item) => `
            <article class="functional-card announcement-functional-card">

                <div class="functional-card-top">
                    <span class="functional-tag">
                        ${escapeHTML(item.category)}
                    </span>

                    <span class="functional-date">
                        ${formatDate(item.date)}
                    </span>
                </div>

                <h3>${escapeHTML(item.title)}</h3>

                <p>${escapeHTML(item.description)}</p>

                <button
                    type="button"
                    class="functional-link"
                    data-announcement-id="${escapeHTML(item.id)}"
                >
                    Read more
                    <i class="fa-solid fa-arrow-right"></i>
                </button>

            </article>
        `,
      )
      .join("");
  }

  if (announcementSearch) {
    announcementSearch.addEventListener("input", function () {
      renderAnnouncements(this.value);
    });
  }

  if (announcementsList) {
    announcementsList.addEventListener("click", function (event) {
      const button = event.target.closest("[data-announcement-id]");

      if (!button) return;

      const announcements = getData(ANNOUNCEMENTS_KEY, defaultAnnouncements);

      const item = announcements.find(
        (announcement) => announcement.id === button.dataset.announcementId,
      );

      if (!item) return;

      alert(
        `${item.title}\n\n${item.description}\n\nPublished: ${formatDate(item.date)}`,
      );
    });
  }

  renderAnnouncements();

  /* =====================================================
       EVENTS
    ===================================================== */

  const eventsList = document.getElementById("eventsList");

  function getRSVPs() {
    try {
      return JSON.parse(localStorage.getItem(RSVP_KEY)) || {};
    } catch {
      return {};
    }
  }

  function renderEvents(filter = "all") {
    if (!eventsList) return;

    const events = getData(EVENTS_KEY, defaultEvents);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filteredEvents = events;

    if (filter === "upcoming") {
      filteredEvents = events.filter((event) => {
        return new Date(event.date) >= today;
      });
    }

    const rsvps = getRSVPs();

    eventsList.innerHTML = filteredEvents
      .map((event) => {
        const eventDate = new Date(event.date);

        const confirmed = Boolean(rsvps[event.id]);

        return `
                <article class="functional-card event-functional-card">

                    <div class="event-functional-date">
                        <span>
                            ${eventDate.toLocaleDateString("en-US", {
                              month: "short",
                            })}
                        </span>

                        <strong>
                            ${eventDate.getDate()}
                        </strong>
                    </div>

                    <div class="event-functional-content">

                        <span class="functional-tag">
                            ${escapeHTML(event.category)}
                        </span>

                        <h3>${escapeHTML(event.title)}</h3>

                        <p>${escapeHTML(event.description)}</p>

                        <div class="functional-meta">
                            <span>
                                <i class="fa-regular fa-clock"></i>
                                ${escapeHTML(event.time)}
                            </span>

                            <span>
                                <i class="fa-solid fa-location-dot"></i>
                                ${escapeHTML(event.location)}
                            </span>
                        </div>

                        <button
                            type="button"
                            class="rsvp-button ${confirmed ? "confirmed" : ""}"
                            data-event-id="${escapeHTML(event.id)}"
                        >
                            ${
                              confirmed
                                ? '<i class="fa-solid fa-check"></i> RSVP Confirmed'
                                : "RSVP"
                            }
                        </button>

                    </div>
                </article>
            `;
      })
      .join("");
  }

  document.querySelectorAll(".event-filter").forEach((button) => {
    button.addEventListener("click", function () {
      document.querySelectorAll(".event-filter").forEach((item) => {
        item.classList.remove("active");
      });

      this.classList.add("active");

      renderEvents(this.dataset.filter);
    });
  });

  if (eventsList) {
    eventsList.addEventListener("click", function (event) {
      const button = event.target.closest("[data-event-id]");

      if (!button) return;

      const id = button.dataset.eventId;

      const rsvps = getRSVPs();

      if (rsvps[id]) {
        delete rsvps[id];

        setData(RSVP_KEY, rsvps);

        renderEvents(
          document.querySelector(".event-filter.active")?.dataset.filter ||
            "all",
        );

        return;
      }

      rsvps[id] = {
        userId:
          JSON.parse(localStorage.getItem("campusHubCurrentUser"))?.id ||
          "student",
        date: new Date().toISOString(),
      };

      setData(RSVP_KEY, rsvps);

      renderEvents(
        document.querySelector(".event-filter.active")?.dataset.filter || "all",
      );
    });
  }

  renderEvents();

  /* =====================================================
       ACADEMIC RESOURCES
    ===================================================== */

  const resourcesList = document.getElementById("resourcesList");

  const resourceSearch = document.getElementById("resourceSearch");

  function renderResources(search = "") {
    if (!resourcesList) return;

    const resources = getData(RESOURCES_KEY, defaultResources);

    const query = search.toLowerCase().trim();

    const filtered = resources.filter((item) => {
      return (
        item.title.toLowerCase().includes(query) ||
        item.course.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query)
      );
    });

    if (filtered.length === 0) {
      resourcesList.innerHTML = `
                <div class="empty-state">
                    <h3>No resources found</h3>
                    <p>Try another course or keyword.</p>
                </div>
            `;
      return;
    }

    resourcesList.innerHTML = filtered
      .map(
        (item) => `
            <article class="functional-card resource-functional-card">

                <div class="resource-functional-icon">
                    <i class="fa-solid fa-file-lines"></i>
                </div>

                <div class="resource-functional-content">

                    <span class="functional-tag">
                        ${escapeHTML(item.type)}
                    </span>

                    <h3>${escapeHTML(item.title)}</h3>

                    <p class="resource-course">
                        ${escapeHTML(item.course)}
                    </p>

                    <span class="functional-date">
                        Added ${formatDate(item.date)}
                    </span>

                    <button
                        type="button"
                        class="functional-link"
                        data-resource-id="${escapeHTML(item.id)}"
                    >
                        View Resource
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>

                </div>

            </article>
        `,
      )
      .join("");
  }

  if (resourceSearch) {
    resourceSearch.addEventListener("input", function () {
      renderResources(this.value);
    });
  }

  if (resourcesList) {
    resourcesList.addEventListener("click", function (event) {
      const button = event.target.closest("[data-resource-id]");

      if (!button) return;

      const resources = getData(RESOURCES_KEY, defaultResources);

      const item = resources.find(
        (resource) => resource.id === button.dataset.resourceId,
      );

      if (!item) return;

      alert(
        `${item.title}\n\nCourse: ${item.course}\nType: ${item.type}\n\nThis is a demo resource in the frontend prototype.`,
      );
    });
  }

  renderResources();
});
