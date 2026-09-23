document.addEventListener("DOMContentLoaded", function () {
  const SESSION_KEY = "campusHubCurrentUser";
  const EVENTS_KEY = "campusHubEvents";
  const JOBS_KEY = "campusHubJobs";
  const COMMUNITIES_KEY = "campusHubCommunities";
  const MEMBERSHIP_KEY = "campusHubCommunityMemberships";
  const ALUMNI_KEY = "campusHubAlumniDirectory";
  const RSVP_KEY = "campusHubEventRSVPs";
  const SAVED_JOBS_KEY = "campusHubSavedJobs";
  const SETTINGS_KEY = "campusHubAlumniSettings";

  const currentUser = JSON.parse(localStorage.getItem(SESSION_KEY));

  /* =========================================================
       AUTH GUARD
    ========================================================= */

  if (!currentUser) {
    window.location.href = "./index.html";
    return;
  }

  if (currentUser.role !== "alumni") {
    if (currentUser.role === "student") {
      window.location.href = "./student.html";
    } else if (currentUser.role === "admin") {
      window.location.href = "./admin.html";
    } else {
      window.location.href = "./index.html";
    }

    return;
  }

  /* =========================================================
       HELPERS
    ========================================================= */

  function readData(key, fallback) {
    try {
      const data = JSON.parse(localStorage.getItem(key));

      return data !== null && data !== undefined ? data : fallback;
    } catch {
      return fallback;
    }
  }

  function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getInitials(name) {
    if (!name) return "AL";

    return String(name)
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((item) => item.charAt(0).toUpperCase())
      .join("");
  }

  function formatDate(date) {
    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = value;
    }
  }

  /* =========================================================
       USER DATA
    ========================================================= */

  const userInitials = currentUser.avatar || getInitials(currentUser.name);

  setText("sidebarUserName", currentUser.name);

  setText("topbarUserName", currentUser.name);

  setText("dropdownUserName", currentUser.name);

  setText("dropdownUserEmail", currentUser.email);

  setText("welcomeName", currentUser.name?.split(/\s+/)[0] || "Alumni");

  setText("profileName", currentUser.name);

  setText("profileJobTitle", currentUser.jobTitle || "Alumni");

  ["sidebarAvatar", "topbarAvatar", "dropdownAvatar", "profileAvatar"].forEach(
    (id) => {
      const element = document.getElementById(id);

      if (element) {
        element.textContent = userInitials;
      }
    },
  );

  /* =========================================================
       PROFILE FORM
    ========================================================= */

  const profileEditName = document.getElementById("profileEditName");

  const profileEditEmail = document.getElementById("profileEditEmail");

  const profileEditDepartment = document.getElementById(
    "profileEditDepartment",
  );

  const profileEditYear = document.getElementById("profileEditYear");

  const profileEditCompany = document.getElementById("profileEditCompany");

  const profileEditJobTitle = document.getElementById("profileEditJobTitle");

  function populateProfileForm() {
    if (profileEditName) {
      profileEditName.value = currentUser.name || "";
    }

    if (profileEditEmail) {
      profileEditEmail.value = currentUser.email || "";
    }

    if (profileEditDepartment) {
      profileEditDepartment.value =
        currentUser.department || "Computer Science & Engineering";
    }

    if (profileEditYear) {
      profileEditYear.value = currentUser.graduationYear || "";
    }

    if (profileEditCompany) {
      profileEditCompany.value = currentUser.company || "";
    }

    if (profileEditJobTitle) {
      profileEditJobTitle.value = currentUser.jobTitle || "";
    }
  }

  populateProfileForm();

  const profileForm = document.getElementById("profileForm");

  if (profileForm) {
    profileForm.addEventListener("submit", function (event) {
      event.preventDefault();

      currentUser.name = profileEditName.value.trim();

      currentUser.department = profileEditDepartment.value;

      currentUser.graduationYear = profileEditYear.value.trim();

      currentUser.company = profileEditCompany.value.trim();

      currentUser.jobTitle = profileEditJobTitle.value.trim();

      /* Update session */

      saveData(SESSION_KEY, currentUser);

      /* Update users database */

      const users = readData("campusHubUsers", []);

      const userIndex = users.findIndex((user) => user.id === currentUser.id);

      if (userIndex >= 0) {
        users[userIndex] = {
          ...users[userIndex],
          ...currentUser,
        };

        saveData("campusHubUsers", users);
      }

      /* Update alumni directory */

      const alumni = readData(ALUMNI_KEY, []);

      const alumniIndex = alumni.findIndex(
        (person) => person.id === currentUser.id,
      );

      if (alumniIndex >= 0) {
        alumni[alumniIndex] = {
          ...alumni[alumniIndex],
          name: currentUser.name,
          department: currentUser.department,
          graduationYear: currentUser.graduationYear,
          company: currentUser.company,
          jobTitle: currentUser.jobTitle,
          avatar: getInitials(currentUser.name),
        };

        saveData(ALUMNI_KEY, alumni);
      }

      /* Update visible UI */

      setText("sidebarUserName", currentUser.name);

      setText("topbarUserName", currentUser.name);

      setText("dropdownUserName", currentUser.name);

      setText("welcomeName", currentUser.name.split(/\s+/)[0]);

      setText("profileName", currentUser.name);

      setText("profileJobTitle", currentUser.jobTitle);

      const newInitials = getInitials(currentUser.name);

      [
        "sidebarAvatar",
        "topbarAvatar",
        "dropdownAvatar",
        "profileAvatar",
      ].forEach((id) => {
        const element = document.getElementById(id);

        if (element) {
          element.textContent = newInitials;
        }
      });

      const message = document.getElementById("profileSaveMessage");

      if (message) {
        message.textContent = "Profile updated successfully.";

        setTimeout(() => {
          message.textContent = "";
        }, 2500);
      }
    });
  }

  /* =========================================================
       SECTION NAVIGATION
    ========================================================= */

  const navItems = document.querySelectorAll(".nav-item");

  const sections = document.querySelectorAll(".content-section");

  const sectionMap = {
    dashboard: "dashboardSection",

    events: "eventsSection",

    opportunities: "opportunitiesSection",

    communities: "communitiesSection",

    directory: "directorySection",

    profile: "profileSection",

    settings: "settingsSection",
  };

  const pageTitles = {
    dashboard: "Dashboard",

    events: "Events",

    opportunities: "Opportunities",

    communities: "Communities",

    directory: "Alumni Directory",

    profile: "My Profile",

    settings: "Settings",
  };

  function showSection(sectionName) {
    const targetId = sectionMap[sectionName];

    if (!targetId) return;

    sections.forEach((section) => section.classList.remove("active"));

    navItems.forEach((item) => item.classList.remove("active"));

    const targetSection = document.getElementById(targetId);

    const targetNav = document.querySelector(
      `.nav-item[data-section="${sectionName}"]`,
    );

    if (targetSection) {
      targetSection.classList.add("active");
    }

    if (targetNav) {
      targetNav.classList.add("active");
    }

    setText("pageTitle", pageTitles[sectionName]);

    window.location.hash = sectionName;

    if (sectionName === "events") {
      renderEvents();
    }

    if (sectionName === "opportunities") {
      renderJobs();
    }

    if (sectionName === "communities") {
      renderCommunities();
    }

    if (sectionName === "directory") {
      renderDirectory();
    }
  }

  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      showSection(this.dataset.section);

      closeSidebar();
    });
  });

  document.querySelectorAll("[data-section-link]").forEach((element) => {
    element.addEventListener("click", function () {
      showSection(this.dataset.sectionLink);
    });
  });

  document.querySelectorAll("[data-profile-section]").forEach((element) => {
    element.addEventListener("click", function () {
      showSection(this.dataset.profileSection);

      closeProfileDropdown();
    });
  });

  const initialSection = window.location.hash.replace("#", "");

  showSection(sectionMap[initialSection] ? initialSection : "dashboard");

  /* =========================================================
       SIDEBAR
    ========================================================= */
  /* =========================================================
   SIDEBAR — MOBILE / TABLET TOGGLE
========================================================= */

  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const mobileMenuButton = document.getElementById("mobileMenuButton");
  const sidebarClose = document.getElementById("sidebarClose");

  function openSidebar() {
    if (!sidebar) return;

    sidebar.classList.add("open");

    if (sidebarOverlay) {
      sidebarOverlay.classList.add("active");
    }

    document.body.classList.add("sidebar-open");
  }

  function closeSidebar() {
    if (!sidebar) return;

    sidebar.classList.remove("open");

    if (sidebarOverlay) {
      sidebarOverlay.classList.remove("active");
    }

    document.body.classList.remove("sidebar-open");
  }

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (sidebar.classList.contains("open")) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (sidebarClose) {
    sidebarClose.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      closeSidebar();
    });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", function () {
      closeSidebar();
    });
  }
  /* =========================================================
       PROFILE DROPDOWN
    ========================================================= */

  const profileButton = document.getElementById("profileButton");

  const profileDropdown = document.getElementById("profileDropdown");

  function closeProfileDropdown() {
    if (profileDropdown) {
      profileDropdown.classList.remove("show");
    }
  }

  if (profileButton) {
    profileButton.addEventListener("click", function (event) {
      event.stopPropagation();

      profileDropdown.classList.toggle("show");
    });
  }

  if (profileDropdown) {
    profileDropdown.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  }

  document.addEventListener("click", function () {
    closeProfileDropdown();
  });

  /* =========================================================
       LOGOUT
    ========================================================= */

  function logout() {
    const confirmed = confirm("Are you sure you want to log out of CampusHub?");

    if (!confirmed) return;

    localStorage.removeItem(SESSION_KEY);

    window.location.href = "./index.html";
  }

  const logoutButton = document.getElementById("logoutButton");

  const dropdownLogout = document.getElementById("dropdownLogout");

  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }

  if (dropdownLogout) {
    dropdownLogout.addEventListener("click", logout);
  }

  /* =========================================================
       EVENTS
    ========================================================= */

  const eventList = document.getElementById("eventsList");

  function getRSVPs() {
    return readData(RSVP_KEY, {});
  }

  function renderEvents(filter = "all") {
    if (!eventList) return;

    const events = readData(EVENTS_KEY, []);

    const rsvps = getRSVPs();

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    let filtered = Array.isArray(events) ? events : [];

    if (filter === "upcoming") {
      filtered = filtered.filter((event) => new Date(event.date) >= today);
    }

    if (!filtered.length) {
      eventList.innerHTML = `
                <div class="empty-card">
                    <i class="fa-regular fa-calendar-xmark"></i>
                    <h3>No events available</h3>
                    <p>Check back later for new university events.</p>
                </div>
            `;

      return;
    }

    eventList.innerHTML = filtered
      .map((event) => {
        const date = new Date(event.date);

        const confirmed = Boolean(rsvps[event.id]);

        return `
                    <article class="event-card">

                        <div class="event-date">
                            <span>
                                ${date.toLocaleDateString("en-US", {
                                  month: "short",
                                })}
                            </span>

                            <strong>
                                ${date.getDate()}
                            </strong>
                        </div>

                        <div class="card-body">

                            <span class="card-tag">
                                ${escapeHTML(event.category || "University")}
                            </span>

                            <h3>
                                ${escapeHTML(event.title)}
                            </h3>

                            <p>
                                ${escapeHTML(event.description || "")}
                            </p>

                            <div class="card-meta">

                                <span>
                                    <i class="fa-regular fa-clock"></i>
                                    ${escapeHTML(event.time || "")}
                                </span>

                                <span>
                                    <i class="fa-solid fa-location-dot"></i>
                                    ${escapeHTML(event.location || "")}
                                </span>

                            </div>

                            <div class="card-actions">

                                <button
                                    type="button"
                                    class="small-button ${
                                      confirmed ? "confirmed" : ""
                                    }"
                                    data-rsvp-event="${escapeHTML(event.id)}"
                                >
                                    ${
                                      confirmed
                                        ? '<i class="fa-solid fa-check"></i> RSVP Confirmed'
                                        : "RSVP"
                                    }
                                </button>

                            </div>

                        </div>

                    </article>
                `;
      })
      .join("");
  }

  document.querySelectorAll("[data-event-filter]").forEach((button) => {
    button.addEventListener("click", function () {
      document
        .querySelectorAll("[data-event-filter]")
        .forEach((item) => item.classList.remove("active"));

      this.classList.add("active");

      renderEvents(this.dataset.eventFilter);
    });
  });

  if (eventList) {
    eventList.addEventListener("click", function (event) {
      const button = event.target.closest("[data-rsvp-event]");

      if (!button) return;

      const eventId = button.dataset.rsvpEvent;

      const rsvps = getRSVPs();

      if (rsvps[eventId]) {
        delete rsvps[eventId];
      } else {
        rsvps[eventId] = {
          userId: currentUser.id,
          userName: currentUser.name,
          date: new Date().toISOString(),
        };
      }

      saveData(RSVP_KEY, rsvps);

      const activeFilter =
        document.querySelector("[data-event-filter].active")?.dataset
          .eventFilter || "all";

      renderEvents(activeFilter);
    });
  }

  /* =========================================================
       JOBS
    ========================================================= */

  const jobsList = document.getElementById("jobsList");

  const jobSearch = document.getElementById("jobSearch");

  let activeJobFilter = "all";

  function getSavedJobs() {
    return readData(SAVED_JOBS_KEY, []);
  }

  function renderJobs() {
    if (!jobsList) return;

    const jobs = readData(JOBS_KEY, []);

    const savedJobs = getSavedJobs();

    const search = jobSearch?.value?.toLowerCase().trim() || "";

    const filtered = jobs.filter((job) => {
      const searchMatch =
        !search ||
        job.title.toLowerCase().includes(search) ||
        job.company.toLowerCase().includes(search) ||
        job.location.toLowerCase().includes(search) ||
        job.category.toLowerCase().includes(search);

      if (!searchMatch) {
        return false;
      }

      if (activeJobFilter === "all") {
        return true;
      }

      if (activeJobFilter === "Remote") {
        return job.mode === "Remote";
      }

      return job.type === activeJobFilter;
    });

    if (!filtered.length) {
      jobsList.innerHTML = `
                <div class="empty-card">
                    <i class="fa-solid fa-briefcase"></i>
                    <h3>No opportunities found</h3>
                    <p>Try another search or filter.</p>
                </div>
            `;

      return;
    }

    jobsList.innerHTML = filtered
      .map((job) => {
        const saved = savedJobs.includes(job.id);

        return `
                    <article class="opportunity-card">

                        <div class="opportunity-top">

                            <div>

                                <span class="card-tag">
                                    ${escapeHTML(job.type || "Opportunity")}
                                </span>

                                <div class="card-body">

                                    <h3>
                                        ${escapeHTML(job.title)}
                                    </h3>

                                    <div class="company-line">
                                        <i class="fa-regular fa-building"></i>
                                        ${escapeHTML(job.company)}
                                    </div>

                                </div>

                            </div>

                            <button
                                type="button"
                                class="save-job ${saved ? "saved" : ""}"
                                data-save-job="${escapeHTML(job.id)}"
                                aria-label="Save opportunity"
                            >
                                <i class="${
                                  saved
                                    ? "fa-solid fa-bookmark"
                                    : "fa-regular fa-bookmark"
                                }"></i>
                            </button>

                        </div>

                        <p class="job-description">
                            ${escapeHTML(job.description || "")}
                        </p>

                        <div class="card-meta">

                            <span>
                                <i class="fa-solid fa-location-dot"></i>
                                ${escapeHTML(job.location || "")}
                            </span>

                            <span>
                                <i class="fa-solid fa-laptop"></i>
                                ${escapeHTML(job.mode || "")}
                            </span>

                        </div>

                        <div class="deadline-line">
                            Apply by
                            ${formatDate(job.deadline)}
                        </div>

                        <button
                            type="button"
                            class="apply-button"
                            data-apply-job="${escapeHTML(job.id)}"
                        >
                            Apply Now
                            <i class="fa-solid fa-arrow-right"></i>
                        </button>

                    </article>
                `;
      })
      .join("");
  }

  if (jobSearch) {
    jobSearch.addEventListener("input", renderJobs);
  }

  document.querySelectorAll("[data-job-filter]").forEach((button) => {
    button.addEventListener("click", function () {
      document
        .querySelectorAll("[data-job-filter]")
        .forEach((item) => item.classList.remove("active"));

      this.classList.add("active");

      activeJobFilter = this.dataset.jobFilter;

      renderJobs();
    });
  });

  if (jobsList) {
    jobsList.addEventListener("click", function (event) {
      const saveButton = event.target.closest("[data-save-job]");

      const applyButton = event.target.closest("[data-apply-job]");

      if (saveButton) {
        const jobId = saveButton.dataset.saveJob;

        const savedJobs = getSavedJobs();

        const index = savedJobs.indexOf(jobId);

        if (index >= 0) {
          savedJobs.splice(index, 1);
        } else {
          savedJobs.push(jobId);
        }

        saveData(SAVED_JOBS_KEY, savedJobs);

        renderJobs();

        return;
      }

      if (applyButton) {
        const jobId = applyButton.dataset.applyJob;

        const job = readData(JOBS_KEY, []).find((item) => item.id === jobId);

        if (!job) return;

        alert(
          `Application started for:\n\n${job.title}\n${job.company}\n\nThis is currently a frontend-only application simulation.`,
        );
      }
    });
  }

  /* =========================================================
       COMMUNITIES
    ========================================================= */

  const communitiesList = document.getElementById("communitiesList");

  const communitySearch = document.getElementById("communitySearch");

  function getMemberships() {
    return readData(MEMBERSHIP_KEY, {});
  }

  function renderCommunities() {
    if (!communitiesList) return;

    const communities = readData(COMMUNITIES_KEY, []);

    const memberships = getMemberships();

    if (!Array.isArray(memberships[currentUser.id])) {
      memberships[currentUser.id] = [];
    }

    const search = communitySearch?.value?.toLowerCase().trim() || "";

    const filtered = communities.filter(
      (community) =>
        community.name.toLowerCase().includes(search) ||
        community.category.toLowerCase().includes(search) ||
        community.description.toLowerCase().includes(search),
    );

    if (!filtered.length) {
      communitiesList.innerHTML = `
                <div class="empty-card">
                    <i class="fa-solid fa-users-slash"></i>
                    <h3>No communities found</h3>
                    <p>Try another search term.</p>
                </div>
            `;

      return;
    }

    communitiesList.innerHTML = filtered
      .map((community, index) => {
        const joined = memberships[currentUser.id].includes(community.id);

        const coverClass = ["", "alt-one", "alt-two", "alt-three"][index % 4];

        return `
                        <article class="community-card">

                            <div class="community-cover ${coverClass}">

                                <div class="community-icon">
                                    <i class="${escapeHTML(
                                      community.icon || "fa-solid fa-users",
                                    )}"></i>
                                </div>

                            </div>

                            <div class="community-body">

                                <span class="card-tag">
                                    ${escapeHTML(
                                      community.category || "Community",
                                    )}
                                </span>

                                <h3>
                                    ${escapeHTML(community.name)}
                                </h3>

                                <p>
                                    ${escapeHTML(community.description)}
                                </p>

                                <div class="community-members">
                                    <i class="fa-solid fa-user-group"></i>
                                    ${escapeHTML(
                                      community.members || 0,
                                    )} members
                                </div>

                                <div class="community-actions">

                                    <button
                                        type="button"
                                        class="join-button ${
                                          joined ? "joined" : ""
                                        }"
                                        data-community-id="${escapeHTML(
                                          community.id,
                                        )}"
                                    >
                                        ${
                                          joined
                                            ? '<i class="fa-solid fa-check"></i> Joined'
                                            : '<i class="fa-solid fa-plus"></i> Join'
                                        }
                                    </button>

                                    <button
                                        type="button"
                                        class="view-button"
                                        data-view-community="${escapeHTML(
                                          community.id,
                                        )}"
                                    >
                                        View
                                    </button>

                                </div>

                            </div>

                        </article>
                    `;
      })
      .join("");
  }

  if (communitySearch) {
    communitySearch.addEventListener("input", renderCommunities);
  }

  if (communitiesList) {
    communitiesList.addEventListener("click", function (event) {
      const joinButton = event.target.closest("[data-community-id]");

      const viewButton = event.target.closest("[data-view-community]");

      if (joinButton) {
        const communityId = joinButton.dataset.communityId;

        const memberships = getMemberships();

        if (!Array.isArray(memberships[currentUser.id])) {
          memberships[currentUser.id] = [];
        }

        const index = memberships[currentUser.id].indexOf(communityId);

        if (index >= 0) {
          memberships[currentUser.id].splice(index, 1);
        } else {
          memberships[currentUser.id].push(communityId);
        }

        saveData(MEMBERSHIP_KEY, memberships);

        renderCommunities();

        return;
      }

      if (viewButton) {
        const community = readData(COMMUNITIES_KEY, []).find(
          (item) => item.id === viewButton.dataset.viewCommunity,
        );

        if (!community) return;

        alert(
          `${community.name}\n\n${community.description}\n\nCategory: ${community.category}\nMembers: ${community.members}`,
        );
      }
    });
  }

  /* =========================================================
       ALUMNI DIRECTORY
    ========================================================= */

  const alumniList = document.getElementById("alumniList");

  const alumniSearch = document.getElementById("alumniSearch");

  const alumniDepartmentFilter = document.getElementById(
    "alumniDepartmentFilter",
  );

  const alumniYearFilter = document.getElementById("alumniYearFilter");

  const alumniResultCount = document.getElementById("alumniResultCount");

  function renderDirectory() {
    if (!alumniList) return;

    const alumni = readData(ALUMNI_KEY, []);

    const search = alumniSearch?.value?.toLowerCase().trim() || "";

    const department = alumniDepartmentFilter?.value || "all";

    const year = alumniYearFilter?.value || "all";

    const filtered = alumni.filter((person) => {
      const matchesSearch =
        !search ||
        person.name.toLowerCase().includes(search) ||
        person.company.toLowerCase().includes(search) ||
        person.jobTitle.toLowerCase().includes(search) ||
        person.department.toLowerCase().includes(search);

      const matchesDepartment =
        department === "all" || person.department === department;

      const matchesYear = year === "all" || person.graduationYear === year;

      return matchesSearch && matchesDepartment && matchesYear;
    });

    if (alumniResultCount) {
      alumniResultCount.textContent = filtered.length;
    }

    if (!filtered.length) {
      alumniList.innerHTML = `
                <div class="empty-card">
                    <i class="fa-solid fa-user-group"></i>
                    <h3>No alumni found</h3>
                    <p>Try changing your search or filters.</p>
                </div>
            `;

      return;
    }

    alumniList.innerHTML = filtered
      .map((person) => {
        return `
                    <article class="alumni-card">

                        <div class="alumni-card-top">

                            <div class="alumni-avatar">
                                ${escapeHTML(
                                  person.avatar || getInitials(person.name),
                                )}
                            </div>

                            <div>

                                <span class="alumni-year">
                                    Class of
                                    ${escapeHTML(person.graduationYear)}
                                </span>

                                <h3>
                                    ${escapeHTML(person.name)}
                                </h3>

                                <p class="alumni-role">
                                    ${escapeHTML(person.jobTitle)}
                                </p>

                                <p class="alumni-company">
                                    <i class="fa-regular fa-building"></i>
                                    ${escapeHTML(person.company)}
                                </p>

                            </div>

                        </div>

                        <div class="alumni-info">

                            <div>
                                <small>Department</small>
                                <span>
                                    ${escapeHTML(person.department)}
                                </span>
                            </div>

                            <div>
                                <small>Location</small>
                                <span>
                                    ${escapeHTML(
                                      person.location || "Not specified",
                                    )}
                                </span>
                            </div>

                        </div>

                    </article>
                `;
      })
      .join("");
  }

  if (alumniSearch) {
    alumniSearch.addEventListener("input", renderDirectory);
  }

  if (alumniDepartmentFilter) {
    alumniDepartmentFilter.addEventListener("change", renderDirectory);
  }

  if (alumniYearFilter) {
    alumniYearFilter.addEventListener("change", renderDirectory);
  }

  /* =========================================================
       SETTINGS
    ========================================================= */

  const settings = readData(SETTINGS_KEY, {
    profileVisible: true,
    compactMode: false,
  });

  const profileVisibilityToggle = document.getElementById(
    "profileVisibilityToggle",
  );

  const compactModeToggle = document.getElementById("compactModeToggle");

  if (profileVisibilityToggle) {
    profileVisibilityToggle.checked = settings.profileVisible !== false;

    profileVisibilityToggle.addEventListener("change", function () {
      settings.profileVisible = this.checked;

      saveData(SETTINGS_KEY, settings);
    });
  }

  if (compactModeToggle) {
    compactModeToggle.checked = settings.compactMode === true;

    if (settings.compactMode) {
      document.body.classList.add("compact-mode");
    }

    compactModeToggle.addEventListener("change", function () {
      settings.compactMode = this.checked;

      document.body.classList.toggle("compact-mode", this.checked);

      saveData(SETTINGS_KEY, settings);
    });
  }

  /* =========================================================
       DASHBOARD PREVIEWS
    ========================================================= */

  function renderDashboard() {
    const events = readData(EVENTS_KEY, []);

    const jobs = readData(JOBS_KEY, []);

    const communities = readData(COMMUNITIES_KEY, []);

    const announcements = readData("campusHubAnnouncements", []);

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const upcomingEvents = events.filter(
      (event) => new Date(event.date) >= today,
    );

    setText("statEvents", upcomingEvents.length);

    setText("statJobs", jobs.length);

    setText("statCommunities", communities.length);

    const announcementBox = document.getElementById("dashboardAnnouncements");

    if (announcementBox) {
      const latest = announcements.slice(0, 3);

      if (!latest.length) {
        announcementBox.innerHTML = `
                    <div class="empty-card">
                        <i class="fa-regular fa-bell"></i>
                        <h3>No announcements</h3>
                    </div>
                `;
      } else {
        announcementBox.innerHTML = latest
          .map(
            (item) => `
                        <div class="dashboard-announcement">

                            <div class="dashboard-announcement-top">

                                <span>
                                    ${escapeHTML(item.category || "University")}
                                </span>

                                <span>
                                    ${formatDate(item.date)}
                                </span>

                            </div>

                            <strong>
                                ${escapeHTML(item.title)}
                            </strong>

                            <p>
                                ${escapeHTML(item.description || "")}
                            </p>

                        </div>
                    `,
          )
          .join("");
      }
    }

    const eventsBox = document.getElementById("dashboardEvents");

    if (eventsBox) {
      eventsBox.innerHTML = upcomingEvents
        .slice(0, 3)
        .map((event) => {
          const date = new Date(event.date);

          return `
                            <div class="mini-event">

                                <div class="mini-event-date">

                                    <span>
                                        ${date.toLocaleDateString("en-US", {
                                          month: "short",
                                        })}
                                    </span>

                                    <strong>
                                        ${date.getDate()}
                                    </strong>

                                </div>

                                <div>

                                    <h4>
                                        ${escapeHTML(event.title)}
                                    </h4>

                                    <p>
                                        ${escapeHTML(event.location || "")}
                                    </p>

                                </div>

                            </div>
                        `;
        })
        .join("");
    }

    const jobsBox = document.getElementById("dashboardJobs");

    if (jobsBox) {
      jobsBox.innerHTML = jobs
        .slice(0, 3)
        .map(
          (job) => `
                        <div class="mini-job">

                            <strong>
                                ${escapeHTML(job.title)}
                            </strong>

                            <span>
                                ${escapeHTML(job.company)}
                            </span>

                        </div>
                    `,
        )
        .join("");
    }
  }

  /* =========================================================
       GLOBAL SEARCH
    ========================================================= */

  const globalSearch = document.getElementById("globalSearch");

  if (globalSearch) {
    globalSearch.addEventListener("keydown", function (event) {
      if (event.key !== "Enter") {
        return;
      }

      const query = this.value.toLowerCase().trim();

      if (!query) return;

      if (query.includes("job") || query.includes("intern")) {
        showSection("opportunities");
        return;
      }

      if (query.includes("event")) {
        showSection("events");
        return;
      }

      if (query.includes("community") || query.includes("club")) {
        showSection("communities");
        return;
      }

      showSection("directory");

      if (alumniSearch) {
        alumniSearch.value = this.value;

        renderDirectory();
      }
    });

    document.addEventListener("keydown", function (event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();

        globalSearch.focus();
      }
    });
  }

  /* =========================================================
       INITIAL RENDER
    ========================================================= */

  renderDashboard();
  renderEvents();
  renderJobs();
  renderCommunities();
  renderDirectory();
});
