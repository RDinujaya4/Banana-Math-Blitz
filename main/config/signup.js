// Signup functionality
// Save this as ../js/signup.js

// Get the signup form element
const signupForm = document.getElementById('signup-form');
const errorMessageElement = document.getElementById('error-message');

// Function to display error messages
function showError(message) {
  if (errorMessageElement) {
    errorMessageElement.textContent = message;
    errorMessageElement.classList.remove('hidden');
  } else {
    alert(message); // Fallback to alert if error element doesn't exist
  }
}

// Function to clear error messages
function clearError() {
  if (errorMessageElement) {
    errorMessageElement.textContent = '';
    errorMessageElement.classList.add('hidden');
  }
}

// Function to check if username already exists
async function checkUsernameExists(username) {
  try {
    // First check in the dedicated usernames collection
    const usernameDoc = await db.collection("usernames").doc(username).get();
    if (usernameDoc.exists) {
      return true;
    }
    
    // Also check in users collection as a fallback
    const usernameQuery = await db.collection("users")
      .where("username", "==", username)
      .get();
    
    // If there are any documents in the result, username exists
    return !usernameQuery.empty;
  } catch (error) {
    console.error("Error checking username:", error);
    // In case of error, we'll assume username might exist to be safe
    throw new Error("Unable to check username availability");
  }
}

// Add event listener for form submission
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError();
  
  // Get user input
  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  // Create loading state
  const submitButton = document.querySelector('.signup-button');
  const originalButtonText = submitButton.textContent;
  submitButton.textContent = 'Creating account...';
  submitButton.disabled = true;
  
  try {
    // Check if username already exists
    const usernameExists = await checkUsernameExists(username);
    if (usernameExists) {
      throw {
        code: 'auth/username-already-in-use',
        message: 'This username is already taken. Please choose another username.'
      };
    }
    
    console.log("Username available, creating user with:", email);
    
    // Create user with email and password
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    console.log("User created successfully:", user.uid);
    
    // Store additional user information in Firestore (users collection)
    await db.collection("users").doc(user.uid).set({
      email: email,
      username: username,
      createdAt: new Date().toISOString()
    });
    
    // Create entry in usernames collection for login lookup
    await db.collection("usernames").doc(username).set({
      email: email,
      uid: user.uid,
      createdAt: new Date().toISOString()
    });
    
    console.log("User data stored in Firestore");
    
    // Alert success and redirect to login
    showError('Account created successfully! Redirecting to login...');
    setTimeout(() => {
      window.location.href = '../public/login.html';
    }, 1500);
    
  } catch (error) {
    // Handle errors
    const errorCode = error.code;
    let errorMessage;
    
    console.error("Full error object:", error);
    
    switch(errorCode) {
      case 'auth/email-already-in-use':
        errorMessage = 'This email is already registered. Please use another email or log in.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Please enter a valid email address.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password should be at least 6 characters long.';
        break;
      case 'auth/username-already-in-use':
        errorMessage = 'This username is already taken. Please choose another username.';
        break;
      default:
        errorMessage = `Error: ${error.message}`;
    }
    
    showError(errorMessage);
    console.error("Error during signup:", error);
    
  } finally {
    // Reset button state
    submitButton.textContent = originalButtonText;
    submitButton.disabled = false;
  }
});

// Optional: Add real-time username availability check
const usernameInput = document.getElementById('username');
if (usernameInput) {
  usernameInput.addEventListener('blur', async () => {
    const username = usernameInput.value.trim();
    if (username.length > 0) {
      try {
        const exists = await checkUsernameExists(username);
        if (exists) {
          // You could show a message near the input
          // or change the input's style to indicate it's taken
          usernameInput.setCustomValidity('Username already taken');
          usernameInput.reportValidity();
        } else {
          usernameInput.setCustomValidity('');
        }
      } catch (error) {
        console.error("Error checking username availability:", error);
      }
    }
  });
}