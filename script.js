// script.js

// Get elements from DOM
const form = document.getElementById('loginForm');
const usernameField = document.getElementById('username');
const passwordField = document.getElementById('password');
const togglePasswordButton = document.getElementById('togglePassword');
const rememberMeCheckbox = document.getElementById('rememberMe');
const messageElement = document.getElementById('message');
const spinner = document.getElementById('spinner');

// Show/Hide Password Feature
togglePasswordButton.addEventListener('click', function () {
  const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordField.setAttribute('type', type);
  togglePasswordButton.textContent = type === 'password' ? 'Show' : 'Hide';
});

// Remember Me Feature
document.addEventListener('DOMContentLoaded', function () {
  const rememberedUsername = localStorage.getItem('rememberedUsername');
  if (rememberedUsername) {
    usernameField.value = rememberedUsername;
    rememberMeCheckbox.checked = true;
  }
});

// Form Submission with Validation and API Call
form.addEventListener('submit', function (event) {
  event.preventDefault();

  const username = usernameField.value;
  const password = passwordField.value;

  messageElement.textContent = '';  // Clear previous messages

  // Validate form inputs
  if (!username || !validateEmail(username)) {
    messageElement.textContent = 'Please enter a valid email.';
    return;
  }

  if (password.length < 6) {
    messageElement.textContent = 'Password must be at least 6 characters long.';
    return;
  }

  // Remember Me functionality
  if (rememberMeCheckbox.checked) {
    localStorage.setItem('rememberedUsername', username);
  } else {
    localStorage.removeItem('rememberedUsername');
  }

  // Show spinner while making the API call
  spinner.style.display = 'block';

  // Make API call
  fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
    .then(response => {
      spinner.style.display = 'none';  // Hide spinner after response
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Login failed');
      }
    })
    .then(data => {
      // Handle successful login
      messageElement.style.color = 'green';
      messageElement.textContent = 'Login successful!';
      console.log('Login success:', data);
    })
    .catch(error => {
      // Handle failed login
      messageElement.style.color = 'red';
      messageElement.textContent = 'Login failed. Please try again.';
      console.error('Error:', error);
    });
});

// Helper function to validate email format
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}
