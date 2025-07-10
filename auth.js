// Get key form and DOM elements
const form = document.getElementById('form');                            // The signup/login form element
const firstname_input = document.getElementById('name');                // First name input (exists only in signup form)
const email_input = document.getElementById('email');                   // Email input field
const password_input = document.getElementById('password');             // Password input field
const error_message = document.getElementById('error-message');         // Error message container (string)
const error_list = document.getElementById('error-list');               // Error list container (ul element)
const roleSelect = document.getElementById('role');                     // Optional role <select> dropdown
const receiverEmailField = document.getElementById('receiver-email-field'); // Container to input receiver email(s)
const receiverEmailsInput = document.getElementById('receiverEmails'); // Actual <input> for entering receiver emails





let selectedRole = '';  // Keeps track of the chosen role: 'Sender' or 'Receiver'
// Function to handle role selection via buttons
function selectRole(role) {
  selectedRole = role; // Store the selected role
  // Remove the active class from both buttons
  document.getElementById('senderBtn').classList.remove('active');
  document.getElementById('receiverBtn').classList.remove('active');
  
  // Add 'active' class to the selected button
  document.getElementById(role.toLowerCase() + 'Btn').classList.add('active');
  
  // Show receiver email field if role is Sender
  receiverEmailField.style.display = role.toLowerCase() === 'sender' ? 'block' : 'none';
}



// Optional: If using a dropdown for role selection
if (roleSelect) {
  roleSelect.addEventListener('change', () => {
    receiverEmailField.style.display = roleSelect.value === 'sender' ? 'block' : 'none';
  });
}





// Handle form submission (signup or login)
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent form default behavior (page reload)

  let errors = [];
  const isSignup = firstname_input !== null; // If first name exists, it's a signup form

  // Validate form based on context
  if (isSignup) {
    errors = getSignupErrors();
    if (!selectedRole) errors.push("Please select a role (Sender or Receiver).");
  // If role is Sender, validate receiver emails
  } else {
    // For login, only validate email and password
    errors = getLoginErrors();
  }

  // Show errors or proceed
  if (errors.length > 0) {
    showErrors(errors);
  } else {
    clearErrors();
    completeSignupOrLogin(isSignup);
  }
});






// ----------- VALIDATION FUNCTIONS ----------- //

// Validate signup form fields
function getSignupErrors() {
  const errors = [];
  const emailValue = email_input.value.trim();
  const passwordValue = password_input.value.trim();

  if (!firstname_input.value.trim()) errors.push('Firstname is required');

  if (!emailValue) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
    errors.push('Invalid email format');
  }

  if (!passwordValue) {
    errors.push('Password is required');
  } else if (passwordValue.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  return errors;
}





// Validate login form fields
function getLoginErrors() {
  const errors = [];

  if (!email_input.value.trim()) errors.push('Email is required');
  if (!password_input.value.trim()) errors.push('Password is required');

  return errors;
}




// Display list of errors in the UI
function showErrors(errors) {
  error_message.innerText = errors.join('. '); // Single-line error message
  error_list.innerHTML = ''; // Clear old errors

  // Display each error as list item
  errors.forEach(error => {
    const li = document.createElement('li');
    li.textContent = error;
    error_list.appendChild(li);
  });

  // Optionally clear input fields
  email_input.value = '';
  password_input.value = '';
  if (firstname_input) firstname_input.value = '';
}




// Clear error messages
function clearErrors() {
  if (error_message) error_message.innerText = '';
  if (error_list) error_list.innerHTML = '';
}




// Execute signup or login logic
function completeSignupOrLogin(isSignup) {
  // Get values from inputs
  const name = firstname_input ? firstname_input.value.trim() : null;
  const email = email_input.value.trim().toLowerCase();
  const password = password_input.value.trim();

  if (isSignup) {
    const existingUser = localStorage.getItem(email);
    if (existingUser) {
      alert("An account with this email already exists.");
      return;
    }

    // If user is a Sender, parse and validate receiver emails
    let receivers = [];
    // If role is Sender, get receiver emails from input
    // This input is only present if the role is Sender
    if (selectedRole === 'Sender' && receiverEmailsInput) {
      // Get receiver emails, split by commas, trim whitespace, and validate format
      receivers = receiverEmailsInput.value
        .split(',')                                     // Separate by commas
        .map(e => e.trim().toLowerCase())               // Trim and lowercase
        .filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)); // Keep only valid emails
    }

    // User data to store
    const userData = {
      name,
      email,
      password,
      role: selectedRole,
      receivers: selectedRole === 'Sender' ? receivers : []
    };

    // Store in localStorage
    localStorage.setItem(email, JSON.stringify(userData));
    // Store current session user
    localStorage.setItem('loggedInUser', JSON.stringify(userData));

    // Redirect based on role
    // If role is Sender, redirect to inputer page, else to receiver page
    window.location.href = selectedRole === 'Sender' ? '/index.html' : '/receiver.html';
  } else {
    // Login flow
    // Check if user exists in localStorage
    const user = JSON.parse(localStorage.getItem(email));// Retrieve user data by email
    // If user doesn't exist or password doesn't match, show error
    if (!user || user.password !== password) {
      alert("Invalid login credentials.");
      return;
    }

    // Store current session user
    localStorage.setItem('loggedInUser', JSON.stringify(user));// Store logged-in user data

    // Redirect based on user role
    window.location.href = user.role === 'Sender' ? '/index.html' : '/receiver.html';
  }
}





// ----------- LIVE INPUT CLEANUP ----------- //

// Watch all form inputs and remove red border/error when typing
const allInputs = [firstname_input, email_input, password_input].filter(Boolean);
allInputs.forEach(input => {
  input.addEventListener('input', () => {
    input.classList.remove('incorrect');
    clearErrors();
  });
});
