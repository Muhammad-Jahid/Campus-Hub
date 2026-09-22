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

        const words = name
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (words.length === 1) {
            return words[0].substring(0, 2).toUpperCase();
        }

        return (
            words[0].charAt(0) +
            words[words.length - 1].charAt(0)
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

    const department =
        currentUser.department ||
        "Computer Science & Engineering";

    const batch =
        currentUser.batch ||
        "2026";

    const section =
        currentUser.section ||
        "Section A";


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

    const notificationButton =
        document.getElementById("notificationButton");

    const notificationDropdown =
        document.getElementById("notificationDropdown");

    const profileButton =
        document.getElementById("profileButton");

    const profileDropdown =
        document.getElementById("profileDropdown");

    const logoutButton =
        document.getElementById("logoutButton");

    const dropdownLogout =
        document.getElementById("dropdownLogout");

    const markNotificationsRead =
        document.getElementById("markNotificationsRead");

    const globalSearch =
        document.getElementById("globalSearch");

    const pageTitle =
        document.getElementById("pageTitle");


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
        settings: "settingsSection"
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
        settings: "Settings"
    };


    function showSection(sectionName, updateHash = true) {

        const targetId = sectionMap[sectionName];

        if (!targetId) {
            sectionName = "dashboard";
        }


        const finalTargetId =
            sectionMap[sectionName] || sectionMap.dashboard;


        contentSections.forEach(section => {
            section.classList.remove("active-section");
        });


        const targetSection =
            document.getElementById(finalTargetId);


        if (targetSection) {
            targetSection.classList.add("active-section");
        }


        navItems.forEach(item => {

            item.classList.remove("active");

            if (item.dataset.section === sectionName) {
                item.classList.add("active");
            }

        });


        if (pageTitle) {
            pageTitle.textContent =
                pageTitles[sectionName] || "Dashboard";
        }


        if (updateHash) {
            history.replaceState(
                null,
                "",
                `#${sectionName}`
            );
        }


        closeSidebar();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    navItems.forEach(item => {

        item.addEventListener("click", event => {

            event.preventDefault();

            const sectionName =
                item.dataset.section;

            showSection(sectionName);
        });

    });


    // =====================================================
    // 9. HASH NAVIGATION
    // =====================================================

    function loadSectionFromHash() {

        const hash =
            window.location.hash.replace("#", "").trim();

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

        notificationButton.addEventListener("click", event => {

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

        profileButton.addEventListener("click", event => {

            event.stopPropagation();

            if (notificationDropdown) {
                notificationDropdown.classList.remove("show");
            }

            profileDropdown.classList.toggle("show");
        });

    }


    // Prevent dropdown click from closing itself
    if (notificationDropdown) {

        notificationDropdown.addEventListener(
            "click",
            event => {
                event.stopPropagation();
            }
        );

    }


    if (profileDropdown) {

        profileDropdown.addEventListener(
            "click",
            event => {
                event.stopPropagation();
            }
        );

    }


    document.addEventListener("click", () => {
        closeDropdowns();
    });


    // =====================================================
    // 13. MARK NOTIFICATIONS AS READ
    // =====================================================

    if (markNotificationsRead) {

        markNotificationsRead.addEventListener(
            "click",
            () => {

                const unreadItems =
                    document.querySelectorAll(
                        ".notification-item.unread"
                    );

                unreadItems.forEach(item => {
                    item.classList.remove("unread");
                });


                const notificationDot =
                    document.querySelector(".notification-dot");

                if (notificationDot) {
                    notificationDot.style.display = "none";
                }


                const notificationCount =
                    document.querySelector(".notification-count");

                if (notificationCount) {
                    notificationCount.textContent = "0";
                }


                const headerCount =
                    document.querySelector(
                        ".dropdown-header span"
                    );

                if (headerCount) {
                    headerCount.textContent =
                        "You're all caught up";
                }

            }
        );

    }


    // =====================================================
    // 14. PROFILE DROPDOWN LINKS
    // =====================================================

    const profileLinks =
        profileDropdown
            ? profileDropdown.querySelectorAll("a")
            : [];


    profileLinks.forEach(link => {

        link.addEventListener("click", event => {

            event.preventDefault();

            const href =
                link.getAttribute("href");

            if (href && href.startsWith("#")) {

                const section =
                    href.substring(1);

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

        const confirmed =
            window.confirm(
                "Are you sure you want to log out of CampusHub?"
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
        ".activity-item"
    );


    function clearSearchHighlights() {

        searchableElements.forEach(element => {
            element.classList.remove("search-highlight");
        });
    }


    function performSearch(query) {

        clearSearchHighlights();

        const cleanQuery =
            query.trim().toLowerCase();


        if (!cleanQuery) {
            return;
        }


        let firstMatch = null;


        searchableElements.forEach(element => {

            const text =
                element.textContent.toLowerCase();


            if (text.includes(cleanQuery)) {

                element.classList.add(
                    "search-highlight"
                );

                if (!firstMatch) {
                    firstMatch = element;
                }
            }

        });


        if (firstMatch) {

            firstMatch.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }

    }


    if (globalSearch) {

        globalSearch.addEventListener(
            "input",
            event => {
                performSearch(event.target.value);
            }
        );


        globalSearch.addEventListener(
            "keydown",
            event => {

                if (event.key === "Escape") {

                    globalSearch.value = "";

                    clearSearchHighlights();

                    globalSearch.blur();
                }

            }
        );

    }


    // =====================================================
    // 17. SEARCH SHORTCUT
    // =====================================================

    document.addEventListener("keydown", event => {

        const isShortcut =
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k";


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

    const SAVED_JOBS_KEY =
        "campusHubSavedJobs";


    function getSavedJobs() {

        const saved =
            localStorage.getItem(SAVED_JOBS_KEY);

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

        localStorage.setItem(
            SAVED_JOBS_KEY,
            JSON.stringify(jobs)
        );
    }


    const saveJobButtons =
        document.querySelectorAll(".save-job");


    saveJobButtons.forEach((button, index) => {

        const jobId = `student-job-${index + 1}`;

        const savedJobs = getSavedJobs();

        if (savedJobs.includes(jobId)) {

            button.classList.add("saved");

            const icon =
                button.querySelector("i");

            if (icon) {
                icon.classList.remove("fa-regular");
                icon.classList.add("fa-solid");
            }
        }


        button.addEventListener("click", () => {

            let jobs = getSavedJobs();

            const icon =
                button.querySelector("i");


            if (jobs.includes(jobId)) {

                jobs =
                    jobs.filter(
                        id => id !== jobId
                    );

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

    const viewAllLinks =
        document.querySelectorAll(
            ".view-all[href^='#']"
        );


    viewAllLinks.forEach(link => {

        link.addEventListener("click", event => {

            event.preventDefault();

            const href =
                link.getAttribute("href");

            if (!href) {
                return;
            }

            const section =
                href.substring(1);

            if (sectionMap[section]) {
                showSection(section);
            }

        });

    });


    // =====================================================
    // 20. RESOURCE LINKS
    // =====================================================

    const resourceLinks =
        document.querySelectorAll(
            ".resource-item[href^='#']"
        );


    resourceLinks.forEach(link => {

        link.addEventListener("click", event => {

            event.preventDefault();

            showSection("resources");
        });

    });


    // =====================================================
    // 21. COMMUNITY LINKS
    // =====================================================

    const communityLinks =
        document.querySelectorAll(
            ".community-item[href^='#']"
        );


    communityLinks.forEach(link => {

        link.addEventListener("click", event => {

            event.preventDefault();

            showSection("communities");
        });

    });


    // =====================================================
    // 22. PREVENT EMPTY FOOTER LINKS
    // =====================================================

    const emptyLinks =
        document.querySelectorAll(
            '.dashboard-footer a[href="#"]'
        );


    emptyLinks.forEach(link => {

        link.addEventListener("click", event => {
            event.preventDefault();
        });

    });


    // =====================================================
    // 23. SAVE SESSION HELPER
    // =====================================================

    window.getCampusHubStudent =
        function () {
            return getCurrentUser();
        };


    // =====================================================
    // 24. LOGOUT GLOBAL HELPER
    // =====================================================

    window.logoutCampusHub =
        function () {

            localStorage.removeItem(
                SESSION_KEY
            );

            window.location.href =
                "./index.html";
        };


    // =====================================================
    // 25. DEBUG INFORMATION
    // =====================================================

    console.log(
        "CampusHub Student Dashboard loaded."
    );

    console.log(
        "Logged in student:",
        currentUser
    );

});