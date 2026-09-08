console.log("CampusHub JavaScript loaded");

document.addEventListener("DOMContentLoaded", function () {

    const authCard = document.getElementById("authCard");

    const studentButton =
        document.getElementById("studentButton");

    const alumniButton =
        document.getElementById("alumniButton");

    const coverStudentButton =
        document.getElementById("coverStudentButton");

    const coverAlumniButton =
        document.getElementById("coverAlumniButton");

    const coverLoginButton =
        document.getElementById("coverLoginButton");

    const backLoginButtons =
        document.querySelectorAll(".backLoginButton");


    /* ==========================================
       STUDENT REGISTRATION
    ========================================== */

    function openStudent() {

        authCard.classList.remove("alumni-active");

        authCard.classList.add("student-active");

    }


    /* ==========================================
       ALUMNI REGISTRATION
    ========================================== */

    function openAlumni() {

        authCard.classList.remove("student-active");

        authCard.classList.add("alumni-active");

    }


    /* ==========================================
       BACK TO LOGIN
    ========================================== */

    function openLogin() {

        authCard.classList.remove("student-active");

        authCard.classList.remove("alumni-active");

    }


    /* ==========================================
       REGISTRATION BUTTONS
    ========================================== */

    if (studentButton) {

        studentButton.addEventListener(
            "click",
            openStudent
        );

    }


    if (alumniButton) {

        alumniButton.addEventListener(
            "click",
            openAlumni
        );

    }


    if (coverStudentButton) {

        coverStudentButton.addEventListener(
            "click",
            openStudent
        );

    }


    if (coverAlumniButton) {

        coverAlumniButton.addEventListener(
            "click",
            openAlumni
        );

    }


    if (coverLoginButton) {

        coverLoginButton.addEventListener(
            "click",
            openLogin
        );

    }


    backLoginButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            openLogin
        );

    });


    /* ==========================================
       SHOW / HIDE PASSWORD
    ========================================== */

    const showPassword =
        document.getElementById("showPassword");


    if (showPassword) {

        showPassword.addEventListener(
            "click",
            function () {

                const password =
                    document.getElementById(
                        "loginPassword"
                    );


                if (password.type === "password") {

                    password.type = "text";

                    showPassword.textContent = "Hide";

                }

                else {

                    password.type = "password";

                    showPassword.textContent = "Show";

                }

            }
        );

    }


    /* ==========================================
       DEMO LOGIN
    ========================================== */

    const demoButtons =
        document.querySelectorAll(".demo-button");


    demoButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const email =
                    button.dataset.email;

                const password =
                    button.dataset.password;


                const emailInput =
                    document.getElementById(
                        "loginEmail"
                    );

                const passwordInput =
                    document.getElementById(
                        "loginPassword"
                    );


                if (emailInput) {

                    emailInput.value = email;

                }


                if (passwordInput) {

                    passwordInput.value = password;

                }


                /*
                 * Make sure we are on Login screen
                 */

                authCard.classList.remove(
                    "student-active"
                );

                authCard.classList.remove(
                    "alumni-active"
                );


                /*
                 * Small visual confirmation
                 */

                emailInput.focus();


                console.log(
                    "Demo Login:",
                    email
                );

            }
        );

    });


    /* ==========================================
       LOGIN FORM
    ========================================== */

    const loginForm =
        document.getElementById("loginForm");


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const email =
                    document.getElementById(
                        "loginEmail"
                    ).value.trim();


                const password =
                    document.getElementById(
                        "loginPassword"
                    ).value.trim();


                if (!email || !password) {

                    alert(
                        "Please enter email and password."
                    );

                    return;

                }


                alert(
                    "Login successful!\n\n" +
                    "Email: " +
                    email
                );

            }
        );

    }


    /* ==========================================
       STUDENT REGISTRATION
    ========================================== */

    const studentForm =
        document.getElementById("studentForm");


    if (studentForm) {

        studentForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const password =
                    document.getElementById(
                        "studentPassword"
                    ).value;


                const confirmPassword =
                    document.getElementById(
                        "studentConfirmPassword"
                    ).value;


                if (
                    password !==
                    confirmPassword
                ) {

                    alert(
                        "Student password and confirm password do not match!"
                    );

                    return;

                }


                alert(
                    "Student registration successful!"
                );


                studentForm.reset();

            }
        );

    }


    /* ==========================================
       ALUMNI REGISTRATION
    ========================================== */

    const alumniForm =
        document.getElementById("alumniForm");


    if (alumniForm) {

        alumniForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const password =
                    document.getElementById(
                        "alumniPassword"
                    ).value;


                const confirmPassword =
                    document.getElementById(
                        "alumniConfirmPassword"
                    ).value;


                if (
                    password !==
                    confirmPassword
                ) {

                    alert(
                        "Alumni password and confirm password do not match!"
                    );

                    return;

                }


                alert(
                    "Alumni registration successful!"
                );


                alumniForm.reset();

            }
        );

    }


});
