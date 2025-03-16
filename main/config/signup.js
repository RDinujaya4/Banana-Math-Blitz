const signupForm = document.getElementById('signup-form');
const errorMessageElement = document.getElementById('error-message');

function showError(message) {
  if (errorMessageElement) {
    errorMessageElement.textContent = message;
    errorMessageElement.classList.remove('hidden');
  } else {
    alert(message);
  }
}

function clearError() {
  if (errorMessageElement) {
    errorMessageElement.textContent = '';
    errorMessageElement.classList.add('hidden');
  }
}

async function checkUsernameExists(username) {
  try {
    const usernameDoc = await db.collection("usernames").doc(username).get();
    if (usernameDoc.exists) {
      return true;
    }

    const usernameQuery = await db.collection("users")
      .where("username", "==", username)
      .get();

    return !usernameQuery.empty;
  } catch (error) {
    console.error("Error checking username:", error);

    throw new Error("Unable to check username availability");
  }
}

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError();
  
  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const submitButton = document.querySelector('.signup-button');
  const originalButtonText = submitButton.textContent;
  submitButton.textContent = 'Creating account...';
  submitButton.disabled = true;
  
  try {
    const usernameExists = await checkUsernameExists(username);
    if (usernameExists) {
      throw {
        code: 'auth/username-already-in-use',
        message: 'This username is already taken. Please choose another username.'
      };
    }
    
    console.log("Username available, creating user with:", email);
    
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    console.log("User created successfully:", user.uid);
    
    await db.collection("users").doc(user.uid).set({
      email: email,
      username: username,
      createdAt: new Date().toISOString()
    });

    await db.collection("usernames").doc(username).set({
      email: email,
      uid: user.uid,
      createdAt: new Date().toISOString()
    });
    
    console.log("User data stored in Firestore");

    showError('Account created successfully! Redirecting to login...');
    setTimeout(() => {
      window.location.href = '../public/login.html';
    }, 1500);
    
  } catch (error) {
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
    submitButton.textContent = originalButtonText;
    submitButton.disabled = false;
  }
});

const usernameInput = document.getElementById('username');
if (usernameInput) {
  usernameInput.addEventListener('blur', async () => {
    const username = usernameInput.value.trim();
    if (username.length > 0) {
      try {
        const exists = await checkUsernameExists(username);
        if (exists) {
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