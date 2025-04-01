document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("logoutAlert") === "true") {
      localStorage.removeItem("logoutAlert");
      setTimeout(() => {
          alert("You have been logged out due to inactivity! So your game play was not saved.");
      }, 500);
  }
});


const loginForm = document.getElementById('login-form');
const errorMessageElement = document.getElementById('error-message');

function showError(message) {
  errorMessageElement.textContent = message;
  errorMessageElement.classList.remove('hidden');
}

function clearError() {
  errorMessageElement.textContent = '';
  errorMessageElement.classList.add('hidden');
}

async function getEmailByUsername(username) {
  try {
    const usernameDoc = await db.collection('usernames').doc(username).get();
    
    if (usernameDoc.exists) {
      return usernameDoc.data().email;
    } else {
      throw new Error('auth/user-not-found');
    }
  } catch (error) {
    console.error("Error getting email by username:", error);
    throw error;
  }
}

async function loginUser(username, password) {
  try {
    const email = await getEmailByUsername(username);

    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const submitButton = document.querySelector('.login-button');
  const originalButtonText = submitButton.textContent;
  submitButton.textContent = 'Logging in...';
  submitButton.disabled = true;
  
  try {
    const user = await loginUser(username, password);
    console.log("User logged in successfully:", user.uid);

    const userDoc = await db.collection('users').doc(user.uid).get();
    
    if (userDoc.exists) {
      const userData = userDoc.data();
      console.log("Found user data:", userData);

      window.location.href = '../public/menu.html';
    } else {
      console.warn("User document does not exist in Firestore");

      window.location.href = '../public/menu.html';
    }
    
  } catch (error) {

    console.error("Login error:", error);
    let errorCode, errorMessage;
    
    if (error.message === 'auth/user-not-found') {
      errorCode = 'auth/user-not-found';
    } else if (error.code) {
      errorCode = error.code;
    } else {
      errorCode = 'unknown';
    }
    
    switch(errorCode) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this username.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid account information.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed login attempts. Please try again later.';
        break;
      default:
        errorMessage = `Error: ${error.message}`;
    }
    
    showError(errorMessage);
    
  } finally {
    submitButton.textContent = originalButtonText;
    submitButton.disabled = false;
  }
});

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User is already signed in:", user.uid);
  } else {
    console.log("No user is signed in");
  }
});