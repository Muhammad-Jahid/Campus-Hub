document.addEventListener("DOMContentLoaded", function () {
  const SESSION_KEY = "campusHubCurrentUser";

  const KEYS = {
    users: "campusHubUsers",
    announcements: "campusHubAnnouncements",
    events: "campusHubEvents",
    resources: "campusHubResources",
    communities: "campusHubCommunities",
    jobs: "campusHubJobs",
    alumni: "campusHubAlumniDirectory",
  };

  const currentUser = JSON.parse(localStorage.getItem(SESSION_KEY));

  /* =========================================================
       AUTH
    ========================================================= */

  if (!currentUser) {
    window.location.href = "./index.html";
    return;
  }

  if (currentUser.role !== "admin") {
    if (currentUser.role === "student") {
      window.location.href = "./student.html";
    } else if (currentUser.role === "alumni") {
      window.location.href = "./alumni.html";
    } else {
      window.location.href = "./index.html";
    }

    return;
  }

  /* =========================================================
       HELPERS
    ========================================================= */

  function readData(key, fallback = []) {
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
    return String(name || "User")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  }

  function formatDate(date) {
    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date || "";
    }

    return parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function generateId(prefix) {
    return (
      prefix + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7)
    );
  }

  function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = value;
    }
  }

  /* =========================================================
       USER UI
    ========================================================= */

  const initials = currentUser.avatar || getInitials(currentUser.name);

  setText("sidebarUserName", currentUser.name);

  setText("topbarUserName", currentUser.name);

  setText("dropdownUserEmail", currentUser.email);

  setText("welcomeName", currentUser.name?.split(/\s+/)[0] || "Admin");

  ["sidebarAvatar", "topbarAvatar", "dropdownAvatar"].forEach((id) => {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = initials;
    }
  });

  /* =========================================================
       SECTION NAVIGATION
    ========================================================= */

  const navItems = document.querySelectorAll(".nav-item");

  const sections = document.querySelectorAll(".content-section");

  const sectionMap = {
    dashboard: "dashboardSection",

    users: "usersSection",

    announcements: "announcementsSection",

    events: "eventsSection",

    resources: "resourcesSection",

    communities: "communitiesSection",

    jobs: "jobsSection",

    alumni: "alumniSection",
  };

  const pageTitles = {
    dashboard: "Dashboard",

    users: "Users",

    announcements: "Announcements",

    events: "Events",

    resources: "Resources",

    communities: "Communities",

    jobs: "Jobs & Internships",

    alumni: "Alumni",
  };

  function showSection(sectionName) {
    const targetId = sectionMap[sectionName];

    if (!targetId) return;

    sections.forEach((section) => section.classList.remove("active"));

    navItems.forEach((item) => item.classList.remove("active"));

    const target = document.getElementById(targetId);

    const nav = document.querySelector(
      `.nav-item[data-section="${sectionName}"]`,
    );

    if (target) {
      target.classList.add("active");
    }

    if (nav) {
      nav.classList.add("active");
    }

    setText("pageTitle", pageTitles[sectionName]);

    if (window.location.hash !== `#${sectionName}`) {
      history.replaceState(null, "", `#${sectionName}`);
    }

    closeSidebar();

    renderCurrentSection(sectionName);
  }

  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      showSection(this.dataset.section);
    });
  });

  document.querySelectorAll("[data-section-link]").forEach((button) => {
    button.addEventListener("click", function () {
      showSection(this.dataset.sectionLink);
    });
  });

  /* =========================================================
       SIDEBAR
    ========================================================= */

  const sidebar = document.getElementById("sidebar");

  const sidebarOverlay = document.getElementById("sidebarOverlay");

  const mobileMenuButton = document.getElementById("mobileMenuButton");

  const sidebarClose = document.getElementById("sidebarClose");

  function openSidebar() {
    if (sidebar) {
      sidebar.classList.add("open");
    }

    if (sidebarOverlay) {
      sidebarOverlay.classList.add("active");
    }
  }

  function closeSidebar() {
    if (sidebar) {
      sidebar.classList.remove("open");
    }

    if (sidebarOverlay) {
      sidebarOverlay.classList.remove("active");
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

  /* =========================================================
       PROFILE DROPDOWN
    ========================================================= */

  const profileButton = document.getElementById("profileButton");

  const profileDropdown = document.getElementById("profileDropdown");

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
    if (profileDropdown) {
      profileDropdown.classList.remove("show");
    }
  });

  /* =========================================================
   LOGOUT — ADMIN
========================================================= */

  function logoutAdmin() {
    localStorage.removeItem("campusHubCurrentUser");
    window.location.replace("./index.html");
  }

  const adminLogoutButton = document.getElementById("logoutButton");

  const adminDropdownLogout = document.getElementById("dropdownLogout");

  if (adminLogoutButton) {
    adminLogoutButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      logoutAdmin();
    });
  }

  if (adminDropdownLogout) {
    adminDropdownLogout.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      logoutAdmin();
    });
  }
  /* =========================================================
       STATS
    ========================================================= */

  function renderStats() {
    const users = readData(KEYS.users, []);

    const announcements = readData(KEYS.announcements, []);

    const events = readData(KEYS.events, []);

    const jobs = readData(KEYS.jobs, []);

    setText("statUsers", users.length);

    setText("statAnnouncements", announcements.length);

    setText("statEvents", events.length);

    setText("statJobs", jobs.length);

    setText(
      "studentCount",
      users.filter((user) => user.role === "student").length,
    );

    setText(
      "alumniCount",
      users.filter((user) => user.role === "alumni").length,
    );

    setText("adminCount", users.filter((user) => user.role === "admin").length);
  }

  /* =========================================================
       MODAL
    ========================================================= */

  const modal = document.getElementById("adminModal");

  const modalTitle = document.getElementById("modalTitle");

  const modalEyebrow = document.getElementById("modalEyebrow");

  const modalFields = document.getElementById("modalFields");

  const modalForm = document.getElementById("adminModalForm");

  const modalClose = document.getElementById("modalClose");

  const modalCancel = document.getElementById("modalCancel");

  let modalType = "";
  let modalEditId = null;

  function field(
    id,
    label,
    type = "text",
    value = "",
    full = false,
    placeholder = "",
  ) {
    return `
            <div class="modal-field ${full ? "full" : ""}">

                <label for="${id}">
                    ${label}
                </label>

                ${
                  type === "textarea"
                    ? `
                        <textarea
                            id="${id}"
                            placeholder="${escapeHTML(placeholder)}"
                        >${escapeHTML(value)}</textarea>
                    `
                    : `
                        <input
                            id="${id}"
                            type="${type}"
                            value="${escapeHTML(value)}"
                            placeholder="${escapeHTML(placeholder)}"
                        >
                    `
                }

            </div>
        `;
  }

  function selectField(id, label, options, selected = "", full = false) {
    return `
            <div class="modal-field ${full ? "full" : ""}">

                <label for="${id}">
                    ${label}
                </label>

                <select id="${id}">

                    ${options
                      .map(
                        (option) => `
                            <option
                                value="${escapeHTML(option.value)}"
                                ${option.value === selected ? "selected" : ""}
                            >
                                ${escapeHTML(option.label)}
                            </option>
                        `,
                      )
                      .join("")}

                </select>

            </div>
        `;
  }

  function openModal(type, item = null) {
    modalType = type;
    modalEditId = item?.id || null;

    modalFields.innerHTML = "";

    const editing = Boolean(item);

    modalTitle.textContent = editing ? "Edit Item" : "Add Item";

    const configs = {
      announcement: {
        eyebrow: "ANNOUNCEMENT MANAGEMENT",

        fields: () => `
                    ${field("mTitle", "Title", "text", item?.title || "", true)}

                    ${selectField(
                      "mCategory",
                      "Category",
                      [
                        {
                          value: "Academic",
                          label: "Academic",
                        },
                        {
                          value: "Career",
                          label: "Career",
                        },
                        {
                          value: "Community",
                          label: "Community",
                        },
                        {
                          value: "Library",
                          label: "Library",
                        },
                        {
                          value: "General",
                          label: "General",
                        },
                      ],
                      item?.category || "Academic",
                    )}

                    ${field(
                      "mDate",
                      "Published Date",
                      "date",
                      item?.date || new Date().toISOString().slice(0, 10),
                    )}

                    ${field(
                      "mDescription",
                      "Description",
                      "textarea",
                      item?.description || "",
                      true,
                    )}
                `,
      },

      event: {
        eyebrow: "EVENT MANAGEMENT",

        fields: () => `
                    ${field(
                      "mTitle",
                      "Event Title",
                      "text",
                      item?.title || "",
                      true,
                    )}

                    ${selectField(
                      "mCategory",
                      "Category",
                      [
                        {
                          value: "Academic",
                          label: "Academic",
                        },
                        {
                          value: "Career",
                          label: "Career",
                        },
                        {
                          value: "Networking",
                          label: "Networking",
                        },
                        {
                          value: "Cultural",
                          label: "Cultural",
                        },
                        {
                          value: "Sports",
                          label: "Sports",
                        },
                      ],
                      item?.category || "Academic",
                    )}

                    ${field("mDate", "Date", "date", item?.date || "")}

                    ${field(
                      "mTime",
                      "Time",
                      "text",
                      item?.time || "",
                      false,
                      "10:00 AM - 2:00 PM",
                    )}

                    ${field(
                      "mLocation",
                      "Location",
                      "text",
                      item?.location || "",
                    )}

                    ${field(
                      "mOrganizer",
                      "Organizer",
                      "text",
                      item?.organizer || "",
                    )}

                    ${field(
                      "mDescription",
                      "Description",
                      "textarea",
                      item?.description || "",
                      true,
                    )}
                `,
      },

      resource: {
        eyebrow: "RESOURCE MANAGEMENT",

        fields: () => `
                    ${field(
                      "mTitle",
                      "Resource Title",
                      "text",
                      item?.title || "",
                      true,
                    )}

                    ${field(
                      "mCourse",
                      "Course Code",
                      "text",
                      item?.course || "",
                    )}

                    ${selectField(
                      "mType",
                      "Resource Type",
                      [
                        {
                          value: "Lecture Notes",
                          label: "Lecture Notes",
                        },
                        {
                          value: "Study Guide",
                          label: "Study Guide",
                        },
                        {
                          value: "Lecture Slides",
                          label: "Lecture Slides",
                        },
                        {
                          value: "Previous Questions",
                          label: "Previous Questions",
                        },
                        {
                          value: "Lab Manual",
                          label: "Lab Manual",
                        },
                      ],
                      item?.type || "Lecture Notes",
                    )}

                    ${field(
                      "mDate",
                      "Date",
                      "date",
                      item?.date || new Date().toISOString().slice(0, 10),
                    )}

                    ${field(
                      "mUploadedBy",
                      "Uploaded By",
                      "text",
                      item?.uploadedBy || "CampusHub Admin",
                    )}
                `,
      },

      community: {
        eyebrow: "COMMUNITY MANAGEMENT",

        fields: () => `
                    ${field(
                      "mName",
                      "Community Name",
                      "text",
                      item?.name || "",
                      true,
                    )}

                    ${selectField(
                      "mCategory",
                      "Category",
                      [
                        {
                          value: "Technology",
                          label: "Technology",
                        },
                        {
                          value: "Academic",
                          label: "Academic",
                        },
                        {
                          value: "Creative",
                          label: "Creative",
                        },
                        {
                          value: "Career",
                          label: "Career",
                        },
                        {
                          value: "Sports",
                          label: "Sports",
                        },
                        {
                          value: "Social",
                          label: "Social",
                        },
                      ],
                      item?.category || "Technology",
                    )}

                    ${field(
                      "mMembers",
                      "Member Count",
                      "number",
                      item?.members || 0,
                    )}

                    ${field(
                      "mIcon",
                      "Font Awesome Icon",
                      "text",
                      item?.icon || "fa-solid fa-users",
                    )}

                    ${field(
                      "mDescription",
                      "Description",
                      "textarea",
                      item?.description || "",
                      true,
                    )}
                `,
      },

      job: {
        eyebrow: "OPPORTUNITY MANAGEMENT",

        fields: () => `
                    ${field(
                      "mTitle",
                      "Job / Internship Title",
                      "text",
                      item?.title || "",
                      true,
                    )}

                    ${field("mCompany", "Company", "text", item?.company || "")}

                    ${field(
                      "mLocation",
                      "Location",
                      "text",
                      item?.location || "",
                    )}

                    ${selectField(
                      "mType",
                      "Employment Type",
                      [
                        {
                          value: "Internship",
                          label: "Internship",
                        },
                        {
                          value: "Full-time",
                          label: "Full-time",
                        },
                      ],
                      item?.type || "Internship",
                    )}

                    ${selectField(
                      "mMode",
                      "Work Mode",
                      [
                        {
                          value: "Remote",
                          label: "Remote",
                        },
                        {
                          value: "Hybrid",
                          label: "Hybrid",
                        },
                        {
                          value: "On-site",
                          label: "On-site",
                        },
                      ],
                      item?.mode || "On-site",
                    )}

                    ${field(
                      "mCategory",
                      "Category",
                      "text",
                      item?.category || "",
                    )}

                    ${field(
                      "mPosted",
                      "Posted Date",
                      "date",
                      item?.posted || new Date().toISOString().slice(0, 10),
                    )}

                    ${field(
                      "mDeadline",
                      "Application Deadline",
                      "date",
                      item?.deadline || "",
                    )}

                    ${field(
                      "mDescription",
                      "Description",
                      "textarea",
                      item?.description || "",
                      true,
                    )}
                `,
      },

      alumni: {
        eyebrow: "ALUMNI MANAGEMENT",

        fields: () => `
                    ${field(
                      "mName",
                      "Full Name",
                      "text",
                      item?.name || "",
                      true,
                    )}

                    ${field(
                      "mDepartment",
                      "Department",
                      "text",
                      item?.department || "Computer Science & Engineering",
                    )}

                    ${field(
                      "mYear",
                      "Graduation Year",
                      "number",
                      item?.graduationYear || "",
                    )}

                    ${field("mCompany", "Company", "text", item?.company || "")}

                    ${field(
                      "mJobTitle",
                      "Job Title",
                      "text",
                      item?.jobTitle || "",
                    )}

                    ${field(
                      "mLocation",
                      "Location",
                      "text",
                      item?.location || "",
                    )}

                    ${field("mEmail", "Email", "email", item?.email || "")}

                    ${field(
                      "mSkills",
                      "Skills",
                      "text",
                      item?.skills?.join(", ") || "",
                      true,
                      "JavaScript, React, Node.js",
                    )}

                    ${field("mBio", "Bio", "textarea", item?.bio || "", true)}
                `,
      },

      user: {
        eyebrow: "USER MANAGEMENT",

        fields: () => `
                    ${field(
                      "mName",
                      "Full Name",
                      "text",
                      item?.name || "",
                      true,
                    )}

                    ${field("mEmail", "Email", "email", item?.email || "")}

                    ${selectField(
                      "mRole",
                      "Role",
                      [
                        {
                          value: "student",
                          label: "Student",
                        },
                        {
                          value: "alumni",
                          label: "Alumni",
                        },
                        {
                          value: "admin",
                          label: "Admin",
                        },
                      ],
                      item?.role || "student",
                    )}

                    ${field(
                      "mDepartment",
                      "Department",
                      "text",
                      item?.department || "",
                    )}

                    ${field(
                      "mPassword",
                      "Password",
                      "text",
                      item?.password || "password123",
                    )}

                    ${field("mBatch", "Batch", "text", item?.batch || "")}

                    ${field("mSection", "Section", "text", item?.section || "")}

                    ${field(
                      "mGraduationYear",
                      "Graduation Year",
                      "number",
                      item?.graduationYear || "",
                    )}

                    ${field("mCompany", "Company", "text", item?.company || "")}

                    ${field(
                      "mJobTitle",
                      "Job Title",
                      "text",
                      item?.jobTitle || "",
                    )}
                `,
      },
    };

    const config = configs[type];

    if (!config) return;

    modalEyebrow.textContent = config.eyebrow;

    modalFields.innerHTML = config.fields();

    modal.classList.add("show");

    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("show");

    document.body.style.overflow = "";

    modalType = "";
    modalEditId = null;
  }

  modalClose?.addEventListener("click", closeModal);

  modalCancel?.addEventListener("click", closeModal);

  modal?.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  /* =========================================================
       SAVE MODAL
    ========================================================= */

  modalForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const values = {};

    modalFields
      .querySelectorAll("input, select, textarea")
      .forEach((element) => {
        values[element.id] = element.value.trim();
      });

    saveModalItem(modalType, modalEditId, values);

    closeModal();

    renderStats();

    renderCurrentSection(getCurrentSection());
  });

  function saveModalItem(type, editId, values) {
    const today = new Date().toISOString().slice(0, 10);

    /* Announcement */

    if (type === "announcement") {
      const items = readData(KEYS.announcements, []);

      const object = {
        id: editId || generateId("announcement"),

        title: values.mTitle,

        category: values.mCategory,

        date: values.mDate || today,

        description: values.mDescription,
      };

      upsert(items, object);

      saveData(KEYS.announcements, items);

      return;
    }

    /* Event */

    if (type === "event") {
      const items = readData(KEYS.events, []);

      const object = {
        id: editId || generateId("event"),

        title: values.mTitle,

        date: values.mDate,

        time: values.mTime,

        location: values.mLocation,

        category: values.mCategory,

        organizer: values.mOrganizer,

        description: values.mDescription,

        icon: "fa-solid fa-calendar",
      };

      upsert(items, object);

      saveData(KEYS.events, items);

      return;
    }

    /* Resource */

    if (type === "resource") {
      const items = readData(KEYS.resources, []);

      const object = {
        id: editId || generateId("resource"),

        title: values.mTitle,

        course: values.mCourse,

        type: values.mType,

        category: values.mType,

        uploadedBy: values.mUploadedBy,

        date: values.mDate || today,

        icon: "fa-solid fa-file-lines",
      };

      upsert(items, object);

      saveData(KEYS.resources, items);

      return;
    }

    /* Community */

    if (type === "community") {
      const items = readData(KEYS.communities, []);

      const object = {
        id: editId || generateId("community"),

        name: values.mName,

        category: values.mCategory,

        description: values.mDescription,

        members: Number(values.mMembers) || 0,

        icon: values.mIcon || "fa-solid fa-users",

        colorClass: "tech",
      };

      upsert(items, object);

      saveData(KEYS.communities, items);

      return;
    }

    /* Job */

    if (type === "job") {
      const items = readData(KEYS.jobs, []);

      const object = {
        id: editId || generateId("job"),

        title: values.mTitle,

        company: values.mCompany,

        location: values.mLocation,

        type: values.mType,

        mode: values.mMode,

        category: values.mCategory,

        posted: values.mPosted || today,

        deadline: values.mDeadline,

        description: values.mDescription,

        icon: "fa-solid fa-briefcase",
      };

      upsert(items, object);

      saveData(KEYS.jobs, items);

      return;
    }

    /* Alumni */

    if (type === "alumni") {
      const items = readData(KEYS.alumni, []);

      const object = {
        id: editId || generateId("alumni"),

        name: values.mName,

        department: values.mDepartment,

        graduationYear: values.mYear,

        company: values.mCompany,

        jobTitle: values.mJobTitle,

        location: values.mLocation,

        email: values.mEmail,

        skills: values.mSkills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        bio: values.mBio,

        avatar: getInitials(values.mName),
      };

      upsert(items, object);

      saveData(KEYS.alumni, items);

      return;
    }

    /* User */

    if (type === "user") {
      const users = readData(KEYS.users, []);

      const existingEmail = users.find(
        (user) =>
          user.email.toLowerCase() === values.mEmail.toLowerCase() &&
          user.id !== editId,
      );

      if (existingEmail) {
        alert("Another user already has this email address.");

        return;
      }

      const object = {
        id: editId || generateId("user"),

        name: values.mName,

        email: values.mEmail,

        password: values.mPassword || "password123",

        role: values.mRole,

        department: values.mDepartment,

        batch: values.mBatch,

        section: values.mSection,

        graduationYear: values.mGraduationYear,

        company: values.mCompany,

        jobTitle: values.mJobTitle,

        avatar: getInitials(values.mName),
      };

      upsert(users, object);

      saveData(KEYS.users, users);

      return;
    }
  }

  function upsert(array, object) {
    const index = array.findIndex((item) => item.id === object.id);

    if (index >= 0) {
      array[index] = {
        ...array[index],
        ...object,
      };
    } else {
      array.unshift(object);
    }
  }

  /* =========================================================
       DELETE
    ========================================================= */

  function deleteItem(key, id, label) {
    if (!confirm(`Delete "${label}"?\n\nThis cannot be undone.`)) {
      return;
    }

    const items = readData(key, []);

    const updated = items.filter((item) => item.id !== id);

    saveData(key, updated);

    renderStats();

    renderCurrentSection(getCurrentSection());
  }

  /* =========================================================
       USERS
    ========================================================= */

  const usersTableBody = document.getElementById("usersTableBody");

  const userSearch = document.getElementById("userSearch");

  const userRoleFilter = document.getElementById("userRoleFilter");

  function renderUsers() {
    if (!usersTableBody) return;

    const users = readData(KEYS.users, []);

    const query = userSearch?.value?.toLowerCase().trim() || "";

    const role = userRoleFilter?.value || "all";

    const filtered = users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.department || "").toLowerCase().includes(query);

      const matchesRole = role === "all" || user.role === role;

      return matchesSearch && matchesRole;
    });

    if (!filtered.length) {
      usersTableBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        <div class="empty-card">
                            <i class="fa-solid fa-users-slash"></i>
                            <h3>No users found</h3>
                            <p>Try a different search or role filter.</p>
                        </div>
                    </td>
                </tr>
            `;

      return;
    }

    usersTableBody.innerHTML = filtered
      .map(
        (user) => `

                <tr>

                    <td>

                        <div class="user-cell">

                            <div class="user-mini-avatar">
                                ${escapeHTML(
                                  user.avatar || getInitials(user.name),
                                )}
                            </div>

                            <div>

                                <strong>
                                    ${escapeHTML(user.name)}
                                </strong>

                                <small>
                                    ${escapeHTML(user.id)}
                                </small>

                            </div>

                        </div>

                    </td>

                    <td>
                        ${escapeHTML(user.email)}
                    </td>

                    <td>
                        <span class="role-badge ${escapeHTML(user.role)}">
                            ${escapeHTML(user.role)}
                        </span>
                    </td>

                    <td>
                        ${escapeHTML(user.department || "—")}
                    </td>

                    <td>

                        <div class="table-actions">

                            <button
                                type="button"
                                class="icon-action"
                                data-edit-user="${escapeHTML(user.id)}"
                                title="Edit"
                            >
                                <i class="fa-solid fa-pen"></i>
                            </button>

                            ${
                              user.id !== currentUser.id
                                ? `
                                    <button
                                        type="button"
                                        class="icon-action danger"
                                        data-delete-user="${escapeHTML(
                                          user.id,
                                        )}"
                                        title="Delete"
                                    >
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                `
                                : ""
                            }

                        </div>

                    </td>

                </tr>

            `,
      )
      .join("");
  }

  userSearch?.addEventListener("input", renderUsers);

  userRoleFilter?.addEventListener("change", renderUsers);

  document
    .getElementById("addUserButton")
    ?.addEventListener("click", () => openModal("user"));

  usersTableBody?.addEventListener("click", function (event) {
    const edit = event.target.closest("[data-edit-user]");

    const remove = event.target.closest("[data-delete-user]");

    const users = readData(KEYS.users, []);

    if (edit) {
      const user = users.find((item) => item.id === edit.dataset.editUser);

      if (user) {
        openModal("user", user);
      }

      return;
    }

    if (remove) {
      const user = users.find((item) => item.id === remove.dataset.deleteUser);

      if (!user) return;

      deleteItem(KEYS.users, user.id, user.name);
    }
  });

  /* =========================================================
       ANNOUNCEMENTS
    ========================================================= */

  function renderAnnouncements() {
    const container = document.getElementById("announcementsAdminList");

    if (!container) return;

    const items = readData(KEYS.announcements, []);

    const query =
      document
        .getElementById("announcementAdminSearch")
        ?.value?.toLowerCase()
        .trim() || "";

    const filtered = items.filter(
      (item) =>
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query),
    );

    if (!filtered.length) {
      container.innerHTML = emptyCard(
        "fa-solid fa-bullhorn",
        "No announcements",
        "Create your first announcement.",
      );

      return;
    }

    container.innerHTML = filtered
      .map(
        (item) => `
                <article class="manage-card">

                    <div class="manage-card-top">

                        <span class="manage-tag">
                            ${escapeHTML(item.category)}
                        </span>

                        <small>
                            ${formatDate(item.date)}
                        </small>

                    </div>

                    <h3>
                        ${escapeHTML(item.title)}
                    </h3>

                    <p>
                        ${escapeHTML(item.description)}
                    </p>

                    <div class="manage-actions">

                        <button
                            type="button"
                            class="edit-action"
                            data-edit-announcement="${escapeHTML(item.id)}"
                        >
                            <i class="fa-solid fa-pen"></i>
                            Edit
                        </button>

                        <button
                            type="button"
                            class="delete-action"
                            data-delete-announcement="${escapeHTML(item.id)}"
                        >
                            <i class="fa-solid fa-trash"></i>
                            Delete
                        </button>

                    </div>

                </article>
            `,
      )
      .join("");
  }

  document
    .getElementById("announcementAdminSearch")
    ?.addEventListener("input", renderAnnouncements);

  document
    .getElementById("addAnnouncementButton")
    ?.addEventListener("click", () => openModal("announcement"));

  /* =========================================================
       EVENTS
    ========================================================= */

  function renderAdminEvents() {
    const container = document.getElementById("eventsAdminList");

    if (!container) return;

    const items = readData(KEYS.events, []);

    if (!items.length) {
      container.innerHTML = emptyCard(
        "fa-regular fa-calendar",
        "No events",
        "Create a new event.",
      );

      return;
    }

    container.innerHTML = items
      .map((item) => {
        const date = new Date(item.date);

        return `
                    <article class="manage-card">

                        <div class="manage-card-top">

                            <span class="manage-tag">
                                ${escapeHTML(item.category || "Event")}
                            </span>

                            <small>
                                ${formatDate(item.date)}
                            </small>

                        </div>

                        <h3>
                            ${escapeHTML(item.title)}
                        </h3>

                        <p>
                            ${escapeHTML(item.description || "")}
                        </p>

                        <div class="manage-meta">

                            <span>
                                <i class="fa-regular fa-clock"></i>
                                ${escapeHTML(item.time || "")}
                            </span>

                            <span>
                                <i class="fa-solid fa-location-dot"></i>
                                ${escapeHTML(item.location || "")}
                            </span>

                        </div>

                        <div class="manage-actions">

                            <button
                                type="button"
                                class="edit-action"
                                data-edit-event="${escapeHTML(item.id)}"
                            >
                                <i class="fa-solid fa-pen"></i>
                                Edit
                            </button>

                            <button
                                type="button"
                                class="delete-action"
                                data-delete-event="${escapeHTML(item.id)}"
                            >
                                <i class="fa-solid fa-trash"></i>
                                Delete
                            </button>

                        </div>

                    </article>
                `;
      })
      .join("");
  }

  document
    .getElementById("addEventButton")
    ?.addEventListener("click", () => openModal("event"));

  /* =========================================================
       RESOURCES
    ========================================================= */

  function renderAdminResources() {
    const container = document.getElementById("resourcesAdminList");

    if (!container) return;

    const items = readData(KEYS.resources, []);

    if (!items.length) {
      container.innerHTML = emptyCard(
        "fa-solid fa-book-open",
        "No resources",
        "Add an academic resource.",
      );

      return;
    }

    container.innerHTML = items
      .map(
        (item) => `

                <article class="manage-card">

                    <div class="manage-card-top">

                        <span class="manage-tag">
                            ${escapeHTML(item.type || "Resource")}
                        </span>

                        <small>
                            ${formatDate(item.date)}
                        </small>

                    </div>

                    <h3>
                        ${escapeHTML(item.title)}
                    </h3>

                    <p>
                        Course:
                        ${escapeHTML(item.course || "—")}
                    </p>

                    <div class="manage-meta">

                        <span>
                            <i class="fa-solid fa-user"></i>
                            ${escapeHTML(item.uploadedBy || "Admin")}
                        </span>

                    </div>

                    <div class="manage-actions">

                        <button
                            type="button"
                            class="edit-action"
                            data-edit-resource="${escapeHTML(item.id)}"
                        >
                            <i class="fa-solid fa-pen"></i>
                            Edit
                        </button>

                        <button
                            type="button"
                            class="delete-action"
                            data-delete-resource="${escapeHTML(item.id)}"
                        >
                            <i class="fa-solid fa-trash"></i>
                            Delete
                        </button>

                    </div>

                </article>

            `,
      )
      .join("");
  }

  document
    .getElementById("addResourceButton")
    ?.addEventListener("click", () => openModal("resource"));

  /* =========================================================
       COMMUNITIES
    ========================================================= */

  function renderAdminCommunities() {
    const container = document.getElementById("communitiesAdminList");

    if (!container) return;

    const items = readData(KEYS.communities, []);

    if (!items.length) {
      container.innerHTML = emptyCard(
        "fa-solid fa-users",
        "No communities",
        "Create a new community.",
      );

      return;
    }

    container.innerHTML = items
      .map(
        (item) => `

                <article class="manage-card">

                    <div class="manage-card-top">

                        <span class="manage-tag">
                            ${escapeHTML(item.category || "Community")}
                        </span>

                        <small>
                            ${escapeHTML(item.members || 0)} members
                        </small>

                    </div>

                    <h3>
                        ${escapeHTML(item.name)}
                    </h3>

                    <p>
                        ${escapeHTML(item.description)}
                    </p>

                    <div class="manage-actions">

                        <button
                            type="button"
                            class="edit-action"
                            data-edit-community="${escapeHTML(item.id)}"
                        >
                            <i class="fa-solid fa-pen"></i>
                            Edit
                        </button>

                        <button
                            type="button"
                            class="delete-action"
                            data-delete-community="${escapeHTML(item.id)}"
                        >
                            <i class="fa-solid fa-trash"></i>
                            Delete
                        </button>

                    </div>

                </article>

            `,
      )
      .join("");
  }

  document
    .getElementById("addCommunityButton")
    ?.addEventListener("click", () => openModal("community"));

  /* =========================================================
       JOBS
    ========================================================= */

  function renderAdminJobs() {
    const container = document.getElementById("jobsAdminList");

    if (!container) return;

    const items = readData(KEYS.jobs, []);

    if (!items.length) {
      container.innerHTML = emptyCard(
        "fa-solid fa-briefcase",
        "No opportunities",
        "Add a job or internship.",
      );

      return;
    }

    container.innerHTML = items
      .map(
        (item) => `

                <article class="manage-card">

                    <div class="manage-card-top">

                        <span class="manage-tag">
                            ${escapeHTML(item.type || "Opportunity")}
                        </span>

                        <small>
                            ${formatDate(item.posted)}
                        </small>

                    </div>

                    <h3>
                        ${escapeHTML(item.title)}
                    </h3>

                    <p>
                        ${escapeHTML(item.description || "")}
                    </p>

                    <div class="manage-meta">

                        <span>
                            <i class="fa-regular fa-building"></i>
                            ${escapeHTML(item.company || "")}
                        </span>

                        <span>
                            <i class="fa-solid fa-location-dot"></i>
                            ${escapeHTML(item.location || "")}
                        </span>

                        <span>
                            <i class="fa-solid fa-laptop"></i>
                            ${escapeHTML(item.mode || "")}
                        </span>

                    </div>

                    <div class="manage-actions">

                        <button
                            type="button"
                            class="edit-action"
                            data-edit-job="${escapeHTML(item.id)}"
                        >
                            <i class="fa-solid fa-pen"></i>
                            Edit
                        </button>

                        <button
                            type="button"
                            class="delete-action"
                            data-delete-job="${escapeHTML(item.id)}"
                        >
                            <i class="fa-solid fa-trash"></i>
                            Delete
                        </button>

                    </div>

                </article>

            `,
      )
      .join("");
  }

  document
    .getElementById("addJobButton")
    ?.addEventListener("click", () => openModal("job"));

  /* =========================================================
       ALUMNI
    ========================================================= */

  function renderAdminAlumni() {
    const container = document.getElementById("alumniAdminList");

    if (!container) return;

    const items = readData(KEYS.alumni, []);

    if (!items.length) {
      container.innerHTML = emptyCard(
        "fa-solid fa-address-book",
        "No alumni profiles",
        "Add an alumni profile.",
      );

      return;
    }

    container.innerHTML = items
      .map(
        (item) => `

                <article class="manage-card">

                    <div class="manage-card-top">

                        <span class="manage-tag">
                            Class of
                            ${escapeHTML(item.graduationYear || "—")}
                        </span>

                        <div class="user-mini-avatar">
                            ${escapeHTML(item.avatar || getInitials(item.name))}
                        </div>

                    </div>

                    <h3>
                        ${escapeHTML(item.name)}
                    </h3>

                    <p>
                        ${escapeHTML(item.jobTitle || "Alumni")}
                        at
                        ${escapeHTML(item.company || "—")}
                    </p>

                    <div class="manage-meta">

                        <span>
                            <i class="fa-solid fa-building-columns"></i>
                            ${escapeHTML(item.department || "")}
                        </span>

                        <span>
                            <i class="fa-solid fa-location-dot"></i>
                            ${escapeHTML(item.location || "—")}
                        </span>

                    </div>

                    <div class="manage-actions">

                        <button
                            type="button"
                            class="edit-action"
                            data-edit-alumni="${escapeHTML(item.id)}"
                        >
                            <i class="fa-solid fa-pen"></i>
                            Edit
                        </button>

                        <button
                            type="button"
                            class="delete-action"
                            data-delete-alumni="${escapeHTML(item.id)}"
                        >
                            <i class="fa-solid fa-trash"></i>
                            Delete
                        </button>

                    </div>

                </article>

            `,
      )
      .join("");
  }

  document
    .getElementById("addAlumniButton")
    ?.addEventListener("click", () => openModal("alumni"));

  /* =========================================================
       EVENT DELEGATION FOR MANAGEMENT CARDS
    ========================================================= */

  document.addEventListener("click", function (event) {
    /* Announcements */

    const editAnnouncement = event.target.closest("[data-edit-announcement]");

    const deleteAnnouncement = event.target.closest(
      "[data-delete-announcement]",
    );

    if (editAnnouncement || deleteAnnouncement) {
      const items = readData(KEYS.announcements, []);

      const id = (editAnnouncement || deleteAnnouncement).dataset[
        editAnnouncement ? "editAnnouncement" : "deleteAnnouncement"
      ];

      const item = items.find((x) => x.id === id);

      if (!item) return;

      if (editAnnouncement) {
        openModal("announcement", item);
      } else {
        deleteItem(KEYS.announcements, item.id, item.title);
      }

      return;
    }

    /* Events */

    const editEvent = event.target.closest("[data-edit-event]");

    const deleteEvent = event.target.closest("[data-delete-event]");

    if (editEvent || deleteEvent) {
      const items = readData(KEYS.events, []);

      const trigger = editEvent || deleteEvent;

      const id = editEvent
        ? trigger.dataset.editEvent
        : trigger.dataset.deleteEvent;

      const item = items.find((x) => x.id === id);

      if (!item) return;

      if (editEvent) {
        openModal("event", item);
      } else {
        deleteItem(KEYS.events, item.id, item.title);
      }

      return;
    }

    /* Resources */

    const editResource = event.target.closest("[data-edit-resource]");

    const deleteResource = event.target.closest("[data-delete-resource]");

    if (editResource || deleteResource) {
      const items = readData(KEYS.resources, []);

      const id = editResource
        ? editResource.dataset.editResource
        : deleteResource.dataset.deleteResource;

      const item = items.find((x) => x.id === id);

      if (!item) return;

      if (editResource) {
        openModal("resource", item);
      } else {
        deleteItem(KEYS.resources, item.id, item.title);
      }

      return;
    }

    /* Communities */

    const editCommunity = event.target.closest("[data-edit-community]");

    const deleteCommunity = event.target.closest("[data-delete-community]");

    if (editCommunity || deleteCommunity) {
      const items = readData(KEYS.communities, []);

      const id = editCommunity
        ? editCommunity.dataset.editCommunity
        : deleteCommunity.dataset.deleteCommunity;

      const item = items.find((x) => x.id === id);

      if (!item) return;

      if (editCommunity) {
        openModal("community", item);
      } else {
        deleteItem(KEYS.communities, item.id, item.name);
      }

      return;
    }

    /* Jobs */

    const editJob = event.target.closest("[data-edit-job]");

    const deleteJob = event.target.closest("[data-delete-job]");

    if (editJob || deleteJob) {
      const items = readData(KEYS.jobs, []);

      const id = editJob
        ? editJob.dataset.editJob
        : deleteJob.dataset.deleteJob;

      const item = items.find((x) => x.id === id);

      if (!item) return;

      if (editJob) {
        openModal("job", item);
      } else {
        deleteItem(KEYS.jobs, item.id, item.title);
      }

      return;
    }

    /* Alumni */

    const editAlumni = event.target.closest("[data-edit-alumni]");

    const deleteAlumni = event.target.closest("[data-delete-alumni]");

    if (editAlumni || deleteAlumni) {
      const items = readData(KEYS.alumni, []);

      const id = editAlumni
        ? editAlumni.dataset.editAlumni
        : deleteAlumni.dataset.deleteAlumni;

      const item = items.find((x) => x.id === id);

      if (!item) return;

      if (editAlumni) {
        openModal("alumni", item);
      } else {
        deleteItem(KEYS.alumni, item.id, item.name);
      }
    }
  });

  /* =========================================================
       SEARCH
    ========================================================= */

  const globalSearch = document.getElementById("globalSearch");

  document.addEventListener("keydown", function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();

      globalSearch?.focus();
    }

    if (event.key === "Escape") {
      closeSidebar();
      closeModal();
    }
  });

  /* =========================================================
       CURRENT SECTION
    ========================================================= */

  function getCurrentSection() {
    const activeNav = document.querySelector(".nav-item.active");

    return activeNav?.dataset.section || "dashboard";
  }

  function renderCurrentSection(section) {
    if (section === "dashboard") {
      renderStats();
      return;
    }

    if (section === "users") {
      renderUsers();
    }

    if (section === "announcements") {
      renderAnnouncements();
    }

    if (section === "events") {
      renderAdminEvents();
    }

    if (section === "resources") {
      renderAdminResources();
    }

    if (section === "communities") {
      renderAdminCommunities();
    }

    if (section === "jobs") {
      renderAdminJobs();
    }

    if (section === "alumni") {
      renderAdminAlumni();
    }
  }

  function emptyCard(icon, title, description) {
    return `
            <div class="empty-card">

                <i class="${icon}"></i>

                <h3>
                    ${escapeHTML(title)}
                </h3>

                <p>
                    ${escapeHTML(description)}
                </p>

            </div>
        `;
  }

  /* =========================================================
       INITIAL LOAD
    ========================================================= */

  const hash = window.location.hash.replace("#", "");

  showSection(sectionMap[hash] ? hash : "dashboard");

  renderStats();
});
