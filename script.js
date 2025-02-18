// Ensure page content is visible after load
window.onload = function () {
    document.body.classList.add('visible');
    let savedTheme = localStorage.getItem("theme");

    // Apply saved theme (dark or light)
    if (savedTheme === "dark") {
        document.body.classList.add('dark-mode');
        document.querySelector('.theme-toggle-btn').innerText = '🌞'; // Change icon to Sun
    } else {
        document.querySelector('.theme-toggle-btn').innerText = '🌙'; // Default to Moon
    }
};

// Toggle between dark and light mode
function toggleTheme() {
    let theme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        document.querySelector('.theme-toggle-btn').innerText = '🌞'; // Sun Icon for Light Mode
        localStorage.setItem("theme", "dark"); // Save theme preference
    } else {
        document.body.classList.remove('dark-mode');
        document.querySelector('.theme-toggle-btn').innerText = '🌙'; // Moon Icon for Dark Mode
        localStorage.setItem("theme", "light"); // Save theme preference
    }
}

// Token Generation Logic
function generateToken() {
    let token = Math.random().toString(36).substr(2, 10); // Generate random token
    let expiryTime = new Date().getTime() + (60 * 60 * 1000); // Token expires after 1 hour (3600000 ms)
    
    // Store token and expiry time in localStorage
    let tokenData = {
        token: token,
        expiry: expiryTime
    };
    localStorage.setItem("userToken", JSON.stringify(tokenData)); // Save token with expiry time
    document.getElementById("token-box").innerText = "Your Token: " + token;
}

// Token Validation Logic
function validateToken() {
    let storedData = JSON.parse(localStorage.getItem("userToken")); // Get token data from localStorage
    if (storedData) {
        let currentTime = new Date().getTime(); // Get current time
        if (currentTime < storedData.expiry) {
            return true; // Token is valid
        } else {
            localStorage.removeItem("userToken"); // Remove expired token
            alert("Token expired, please generate a new one.");
            return false; // Token expired
        }
    } else {
        alert("No token found, please generate a token.");
        return false; // No token found
    }
}

// Login Logic
function login() {
    let enteredToken = document.getElementById("token-input").value;
    let storedData = JSON.parse(localStorage.getItem("userToken"));
    if (storedData && enteredToken === storedData.token && validateToken()) {
        window.location.href = "neko.html"; // If token matches and is valid, login
    } else {
        showNotification("Invalid or expired token! Please generate a new one.");
    }
}

// Show Notification Message
function showNotification(message) {
    let notification = document.getElementById("notification");
    notification.innerText = message;
    notification.classList.add("show");
    setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
}

// Show or Hide Token in Input
function togglePassword() {
    let passwordField = document.getElementById("token-input");
    let checkbox = document.getElementById("show-token-checkbox");
    passwordField.type = checkbox.checked ? "text" : "password";
}

// Function to copy token to clipboard
function copyToken() {
    let tokenBox = document.getElementById("token-box");

    // Ensure token-box has content before attempting to copy
    if (tokenBox && tokenBox.innerText !== "Your Token will appear here") {
        let tokenText = tokenBox.innerText.replace("Your Token: ", ""); // Get the token text
        navigator.clipboard.writeText(tokenText)  // Use clipboard API to copy text
            .then(() => {
                showNotification("Token copied to clipboard!");
            })
            .catch(err => {
                showNotification("Failed to copy token: " + err);
            });
    } else {
        showNotification("No token generated to copy.");
    }
}