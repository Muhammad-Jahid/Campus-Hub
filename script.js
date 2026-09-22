console.log("CampusHub JavaScript loaded");

document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
       AUTH CARD
    ===================================================== */

  const authCard = document.getElementById("authCard");

  /* =====================================================
       NAVIGATION BUTTONS
    ===================================================== */

  const studentButton = document.getElementById("studentButton");

  const alumniButton = document.getElementById("alumniButton");

  const coverStudentButton = document.getElementById("coverStudentButton");

  const coverAlumniButton = document.getElementById("coverAlumniButton");

  const coverLoginButton = document.getElementById("coverLoginButton");

  const backLoginButtons = document.querySelectorAll(".backLoginButton");

  /* =====================================================
       DEFAULT DEMO USERS
    ===================================================== */

  const defaultUsers = [
    {
      id: "student-001",

      name: "Arif Rahman",

      email: "student@premier.edu",

      password: "student123",

      role: "student",

      department: "Computer Science & Engineering",

      batch: "2026",

      section: "Section A",

      avatar: "AR",
    },

    {
      id: "alumni-001",

      name: "Tanvir Ahmed",

      email: "alumni@premier.edu",

      password: "alumni123",

      role: "alumni",

      department: "Computer Science & Engineering",

      graduationYear: "2020",

      company: "Orbit Labs",

      jobTitle: "Software Engineer",

      avatar: "TA",
    },

    {
      id: "admin-001",

      name: "CampusHub Admin",

      email: "admin@premier.edu",

      password: "admin123",

      role: "admin",

      department: "Administration",

      avatar: "CA",
    },
  ];

  /* =====================================================
       INITIALIZE LOCAL STORAGE
    ===================================================== */

  function initializeUsers() {
    const users = localStorage.getItem("campusHubUsers");

    if (!users) {
      localStorage.setItem(
        "campusHubUsers",

        JSON.stringify(defaultUsers),
      );
    }
  }

  initializeUsers();

  /* =====================================================
       GET USERS
    ===================================================== */

  function getUsers() {
    return JSON.parse(localStorage.getItem("campusHubUsers")) || [];
  }

  /* =====================================================
       SAVE USERS
    ===================================================== */

  function saveUsers(users) {
    localStorage.setItem(
      "campusHubUsers",

      JSON.stringify(users),
    );
  }

  /* =====================================================
       OPEN STUDENT REGISTRATION
    ===================================================== */

  function openStudent() {
    if (!authCard) return;

    authCard.classList.remove("alumni-active");

    authCard.classList.add("student-active");

    console.log("Student registration opened");
  }

  /* =====================================================
       OPEN ALUMNI REGISTRATION
    ===================================================== */

  function openAlumni() {
    if (!authCard) return;

    authCard.classList.remove("student-active");

    authCard.classList.add("alumni-active");

    console.log("Alumni registration opened");
  }

  /* =====================================================
       BACK TO LOGIN
    ===================================================== */

  function openLogin() {
    if (!authCard) return;

    authCard.classList.remove("student-active");

    authCard.classList.remove("alumni-active");

    console.log("Login screen opened");
  }

  /* =====================================================
       REGISTRATION BUTTONS
    ===================================================== */

  if (studentButton) {
    studentButton.addEventListener("click", openStudent);
  }

  if (alumniButton) {
    alumniButton.addEventListener("click", openAlumni);
  }

  if (coverStudentButton) {
    coverStudentButton.addEventListener("click", openStudent);
  }

  if (coverAlumniButton) {
    coverAlumniButton.addEventListener("click", openAlumni);
  }

  if (coverLoginButton) {
    coverLoginButton.addEventListener("click", openLogin);
  }

  backLoginButtons.forEach(function (button) {
    button.addEventListener("click", openLogin);
  });

  /* =====================================================
       SHOW / HIDE LOGIN PASSWORD
    ===================================================== */

  const showPassword = document.getElementById("showPassword");

  if (showPassword) {
    showPassword.addEventListener("click", function () {
      const password = document.getElementById("loginPassword");

      if (!password) return;

      if (password.type === "password") {
        password.type = "text";

        showPassword.textContent = "Hide";
      } else {
        password.type = "password";

        showPassword.textContent = "Show";
      }
    });
  }

  /* =====================================================
       DEMO LOGIN BUTTONS
    ===================================================== */

  const demoButtons = document.querySelectorAll(".demo-button");

  demoButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();

      const email = button.dataset.email;

      const password = button.dataset.password;

      const emailInput = document.getElementById("loginEmail");

      const passwordInput = document.getElementById("loginPassword");

      if (emailInput) {
        emailInput.value = email;
      }

      if (passwordInput) {
        passwordInput.value = password;
      }

      openLogin();

      console.log("Demo account selected:", email);

      /*
       * Automatically login
       * after selecting demo account.
       */

      setTimeout(function () {
        const loginForm = document.getElementById("loginForm");

        if (loginForm) {
          loginForm.requestSubmit();
        }
      }, 150);
    });
  });

  /* =====================================================
       LOGIN FORM
    ===================================================== */

  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const emailInput = document.getElementById("loginEmail");

      const passwordInput = document.getElementById("loginPassword");

      if (!emailInput || !passwordInput) {
        return;
      }

      const email = emailInput.value.trim().toLowerCase();

      const password = passwordInput.value.trim();

      if (!email || !password) {
        alert("Please enter email and password.");

        return;
      }

      const users = getUsers();

      const user = users.find(function (account) {
        return (
          account.email.toLowerCase() === email && account.password === password
        );
      });

      if (!user) {
        alert("Invalid email or password.");

        return;
      }

      /* =========================================
                   CREATE LOGIN SESSION
                ========================================= */

      localStorage.setItem(
        "campusHubCurrentUser",

        JSON.stringify(user),
      );

      console.log("Login successful:", user);

      /* =========================================
                   ROLE BASED REDIRECT
                ========================================= */

      if (user.role === "student") {
        window.location.href = "./student.html";
      } else if (user.role === "alumni") {
        window.location.href = "./alumni.html";
      } else if (user.role === "admin") {
        window.location.href = "./admin.html";
      }
    });
  }

  /* =====================================================
       STUDENT REGISTRATION
    ===================================================== */

  const studentForm = document.getElementById("studentForm");

  if (studentForm) {
    studentForm.addEventListener("submit", function (event) {
      event.preventDefault();

      /* -----------------------------------------
                   GET FORM ELEMENTS
                ----------------------------------------- */

      const inputs = studentForm.querySelectorAll("input");

      const selects = studentForm.querySelectorAll("select");

      const name = inputs[0].value.trim();

      const email = inputs[1].value.trim().toLowerCase();

      const password = document.getElementById("studentPassword").value;

      const confirmPassword = document.getElementById(
        "studentConfirmPassword",
      ).value;

      const department = selects[0].value;

      const batch = selects[1].value;

      const section = selects[2].value;

      /* -----------------------------------------
                   VALIDATION
                ----------------------------------------- */

      if (password !== confirmPassword) {
        alert("Student password and confirm password do not match!");

        return;
      }

      if (!email.endsWith("@premier.edu")) {
        alert("Please use a Premier University email address.");

        return;
      }

      if (password.length < 6) {
        alert("Password must contain at least 6 characters.");

        return;
      }

      /* -----------------------------------------
                   CHECK EXISTING USER
                ----------------------------------------- */

      const users = getUsers();

      const existingUser = users.find(function (user) {
        return user.email.toLowerCase() === email;
      });

      if (existingUser) {
        alert("An account with this email already exists.");

        return;
      }

      /* -----------------------------------------
                   CREATE USER
                ----------------------------------------- */

      const newUser = {
        id: "student-" + Date.now(),

        name: name,

        email: email,

        password: password,

        role: "student",

        department: department,

        batch: batch,

        section: section,

        avatar: createInitials(name),
      };

      users.push(newUser);

      saveUsers(users);

      /* -----------------------------------------
                   CREATE SESSION
                ----------------------------------------- */

      localStorage.setItem(
        "campusHubCurrentUser",

        JSON.stringify(newUser),
      );

      alert("Student registration successful!");

      /* -----------------------------------------
                   GO TO DASHBOARD
                ----------------------------------------- */

      window.location.href = "./student.html";
    });
  }

  /* =====================================================
       ALUMNI REGISTRATION
    ===================================================== */

  const alumniForm = document.getElementById("alumniForm");

  if (alumniForm) {
    alumniForm.addEventListener("submit", function (event) {
      event.preventDefault();

      /* -----------------------------------------
                   GET FORM ELEMENTS
                ----------------------------------------- */

      const inputs = alumniForm.querySelectorAll("input");

      const selects = alumniForm.querySelectorAll("select");

      const name = inputs[0].value.trim();

      const email = inputs[1].value.trim().toLowerCase();

      const password = document.getElementById("alumniPassword").value;

      const confirmPassword = document.getElementById(
        "alumniConfirmPassword",
      ).value;

      const department = selects[0].value;

      const graduationYear = selects[1].value;

      /* -----------------------------------------
                   COMPANY + JOB
                ----------------------------------------- */

      const companyInput = document.getElementById("alumniCompany");

      const jobTitleInput = document.getElementById("alumniJobTitle");

      const company = companyInput ? companyInput.value.trim() : "";

      const jobTitle = jobTitleInput ? jobTitleInput.value.trim() : "";

      /* -----------------------------------------
                   VALIDATION
                ----------------------------------------- */

      if (password !== confirmPassword) {
        alert("Alumni password and confirm password do not match!");

        return;
      }

      if (password.length < 6) {
        alert("Password must contain at least 6 characters.");

        return;
      }

      /* -----------------------------------------
                   CHECK EXISTING USER
                ----------------------------------------- */

      const users = getUsers();

      const existingUser = users.find(function (user) {
        return user.email.toLowerCase() === email;
      });

      if (existingUser) {
        alert("An account with this email already exists.");

        return;
      }

      /* -----------------------------------------
                   CREATE ALUMNI ACCOUNT
                ----------------------------------------- */

      const newUser = {
        id: "alumni-" + Date.now(),

        name: name,

        email: email,

        password: password,

        role: "alumni",

        department: department,

        graduationYear: graduationYear,

        company: company,

        jobTitle: jobTitle,

        avatar: createInitials(name),
      };

      users.push(newUser);

      saveUsers(users);

      /* -----------------------------------------
                   CREATE SESSION
                ----------------------------------------- */

      localStorage.setItem(
        "campusHubCurrentUser",

        JSON.stringify(newUser),
      );

      alert("Alumni registration successful!");

      window.location.href = "./alumni.html";
    });
  }

  /* =====================================================
       CREATE USER INITIALS
    ===================================================== */

  function createInitials(name) {
    if (!name) {
      return "U";
    }

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(function (word) {
        return word.charAt(0).toUpperCase();
      })
      .join("");
  }

  /* =====================================================
       LOGOUT FUNCTION
       
       Dashboard pages can use:
       
       logoutCampusHub();
    ===================================================== */

  window.logoutCampusHub = function () {
    localStorage.removeItem("campusHubCurrentUser");

    window.location.href = "./index.html";
  };

  /* =====================================================
       GET CURRENT USER
       
       Dashboard pages can use:
       
       const user = getCurrentUser();
    ===================================================== */

  window.getCurrentUser = function () {
    const user = localStorage.getItem("campusHubCurrentUser");

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch (error) {
      console.error("Invalid CampusHub session");

      return null;
    }
  };

  /* =====================================================
       DASHBOARD AUTH PROTECTION
       
       Example:
       
       requireAuth("student");
       
    ===================================================== */

  window.requireAuth = function (requiredRole = null) {
    const user = window.getCurrentUser();

    if (!user) {
      window.location.href = "./index.html";

      return null;
    }

    if (requiredRole && user.role !== requiredRole) {
      if (user.role === "student") {
        window.location.href = "./student.html";
      } else if (user.role === "alumni") {
        window.location.href = "./alumni.html";
      } else if (user.role === "admin") {
        window.location.href = "./admin.html";
      }

      return null;
    }

    return user;
  };
});