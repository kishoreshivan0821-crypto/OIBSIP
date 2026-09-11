const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");
const dashboardSection = document.getElementById("dashboardSection");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const registerName = document.getElementById("registerName");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");
const confirmPassword = document.getElementById("confirmPassword");

const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");

const userEmail = document.getElementById("userEmail");
const logoutButton = document.getElementById("logoutButton");


// Show Register

showRegister.addEventListener("click", () => {
    loginSection.classList.add("hidden");
    registerSection.classList.remove("hidden");

    loginMessage.textContent = "";
    registerMessage.textContent = "";
});


// Show Login

showLogin.addEventListener("click", () => {
    registerSection.classList.add("hidden");
    loginSection.classList.remove("hidden");

    loginMessage.textContent = "";
    registerMessage.textContent = "";
});


// Register

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = registerName.value.trim();
    const email = registerEmail.value.trim().toLowerCase();
    const password = registerPassword.value;
    const confirm = confirmPassword.value;

    registerMessage.textContent = "";

    if (name.length < 2) {
        registerMessage.textContent =
            "Please enter a valid name.";
        return;
    }

    if (password.length < 6) {
        registerMessage.textContent =
            "Password must contain at least 6 characters.";
        return;
    }

    if (password !== confirm) {
        registerMessage.textContent =
            "Passwords do not match.";
        return;
    }

    const existingUser =
        JSON.parse(localStorage.getItem("secureUser"));

    if (existingUser && existingUser.email === email) {
        registerMessage.textContent =
            "An account with this email already exists.";
        return;
    }

    const passwordHash = await hashPassword(password);

    const user = {
        name: name,
        email: email,
        password: passwordHash
    };

    localStorage.setItem(
        "secureUser",
        JSON.stringify(user)
    );

    registerMessage.style.color = "#287a45";
    registerMessage.textContent =
        "Account created successfully. Please sign in.";

    registerForm.reset();

    setTimeout(() => {
        registerSection.classList.add("hidden");
        loginSection.classList.remove("hidden");

        registerMessage.textContent = "";
        registerMessage.style.color = "";
        loginEmail.value = email;
    }, 1000);
});


// Login

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    loginMessage.textContent = "";

    const email =
        loginEmail.value.trim().toLowerCase();

    const password =
        loginPassword.value;

    const storedUser =
        JSON.parse(localStorage.getItem("secureUser"));

    if (!storedUser) {
        loginMessage.textContent =
            "No account found. Please create an account first.";
        return;
    }

    const passwordHash =
        await hashPassword(password);

    if (
        storedUser.email !== email ||
        storedUser.password !== passwordHash
    ) {
        loginMessage.textContent =
            "Invalid email or password.";
        return;
    }

    sessionStorage.setItem(
        "loggedIn",
        "true"
    );

    showDashboard(storedUser);
});


// Dashboard

function showDashboard(user) {
    loginSection.classList.add("hidden");
    registerSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");

    userEmail.textContent = user.email;
}


// Logout

logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem("loggedIn");

    dashboardSection.classList.add("hidden");
    loginSection.classList.remove("hidden");

    loginForm.reset();
});


// SHA-256 Password Hashing

async function hashPassword(password) {
    const encoder =
        new TextEncoder();

    const data =
        encoder.encode(password);

    const hashBuffer =
        await crypto.subtle.digest(
            "SHA-256",
            data
        );

    const hashArray =
        Array.from(
            new Uint8Array(hashBuffer)
        );

    return hashArray
        .map(byte =>
            byte.toString(16).padStart(2, "0")
        )
        .join("");
}