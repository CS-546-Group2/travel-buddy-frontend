// Auth page functionality with backend integration
document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const loginToggle = document.getElementById('login-toggle');
  const signupToggle = document.getElementById('signup-toggle');
  const toggleSlider = document.getElementById('toggle-slider');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  // Toggle between login and signup
  function switchToLogin() {
    loginToggle.classList.add('active');
    signupToggle.classList.remove('active');
    toggleSlider.classList.remove('signup');
    
    setTimeout(() => {
      loginForm.classList.add('active');
      signupForm.classList.remove('active');
    }, 150);
  }

  function switchToSignup() {
    signupToggle.classList.add('active');
    loginToggle.classList.remove('active');
    toggleSlider.classList.add('signup');
    
    setTimeout(() => {
      signupForm.classList.add('active');
      loginForm.classList.remove('active');
    }, 150);
  }

  // Event listeners for toggle buttons
  loginToggle.addEventListener('click', switchToLogin);
  signupToggle.addEventListener('click', switchToSignup);

  // Backend login integration
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Basic validation
    if (!email || !password) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    // Use email as username for now, or map to correct usernames
    let username = email.split('@')[0];
    
    // Map common email patterns to correct usernames
    if (email === 'alice.smith@example.com') {
      username = 'asmith';
    } else if (email === 'bob.johnson@example.com') {
      username = 'bjohnson';
    }
    
    showMessage('Signing you in...', 'info');
    
    // Call backend login endpoint
    fetch(`${appConfig.API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Invalid credentials');
      }
      return res.json();
    })
    .then(user => {
      showMessage('Welcome back! Redirecting...', 'success');
      
      // Store user data in localStorage for future use
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = './dashboard.html';
      }, 1500);
    })
    .catch(err => {
      console.error('Login error:', err);
      showMessage('Login failed: ' + err.message, 'error');
    });
  });

  // Backend signup integration
  signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const firstname = document.getElementById('signup-firstname').value;
    const lastname = document.getElementById('signup-lastname').value;
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const age = document.getElementById('signup-age').value;
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    const terms = signupForm.querySelector('input[name="terms"]').checked;

    // Travel Preferences
    const budgetRange = document.getElementById('signup-budget').value;
    const travelStyle = document.getElementById('signup-style').value;
    const accommodationStyle = document.getElementById('signup-accommodation').value;
    const dietaryRestrictions = [document.getElementById('signup-dietary').value];
    const accessibilityNeeds = [document.getElementById('signup-accessibility').value];
    const interests = Array.from(document.querySelectorAll('#signup-interests input[type="checkbox"]:checked')).map(cb => cb.value);

    // Basic validation
    if (!firstname || !lastname || !username || !email || !password || !confirm) {
      showMessage('Please fill in all fields', 'error');
      return;
    }
    
    if (password !== confirm) {
      showMessage('Passwords do not match', 'error');
      return;
    }
    
    if (password.length < 6) {
      showMessage('Password must be at least 6 characters', 'error');
      return;
    }
    
    if (!terms) {
      showMessage('Please accept the Terms & Conditions', 'error');
      return;
    }

    showMessage('Creating your account...', 'info');

    // Call backend signup endpoint
    fetch(`${appConfig.API_BASE}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: firstname,
        lastName: lastname,
        username: username,
        email: email,
        password: password,
        age: age ? Number(age) : undefined,
        travelPreferences: {
          budgetRange,
          travelStyle,
          interests,
          accommodationStyle,
          dietaryRestrictions,
          accessibilityNeeds
        }
      })
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => {
          throw new Error(err.error || 'Signup failed');
        });
      }
      return res.json();
    })
    .then(data => {
      showMessage('Account created successfully! Welcome to Travel Buddy!', 'success');
      // Store user data in localStorage
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = './dashboard.html';
      }, 1500);
    })
    .catch(err => {
      console.error('Signup error:', err);
      showMessage('Signup failed: ' + err.message, 'error');
    });
  });

  // Social login handlers (placeholder)
  document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
      showMessage(`${provider} authentication will be implemented soon!`, 'info');
    });
  });
});

// Password visibility toggle
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const toggle = input.parentElement.querySelector('.password-toggle i');
  
  if (input.type === 'password') {
    input.type = 'text';
    toggle.classList.remove('fa-eye');
    toggle.classList.add('fa-eye-slash');
  } else {
    input.type = 'password';
    toggle.classList.remove('fa-eye-slash');
    toggle.classList.add('fa-eye');
  }
}

// Message display function
function showMessage(message, type = 'info') {
  // Remove existing message
  const existingMessage = document.querySelector('.auth-message');
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create message element
  const messageEl = document.createElement('div');
  messageEl.className = `auth-message ${type}`;
  messageEl.textContent = message;
  
  // Add styles
  messageEl.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    z-index: 10000;
    animation: slideIn 0.3s ease;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  
  // Set colors based on type
  switch(type) {
    case 'success':
      messageEl.style.backgroundColor = '#27ae60';
      messageEl.style.color = 'white';
      break;
    case 'error':
      messageEl.style.backgroundColor = '#e74c3c';
      messageEl.style.color = 'white';
      break;
    case 'info':
    default:
      messageEl.style.backgroundColor = '#365359';
      messageEl.style.color = 'white';
      break;
  }
  
  document.body.appendChild(messageEl);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    if (messageEl.parentElement) {
      messageEl.style.animation = 'slideOut 0.3s ease forwards';
      setTimeout(() => {
        if (messageEl.parentElement) {
          messageEl.remove();
        }
      }, 300);
    }
  }, 4000);
}

// Add CSS animations for messages
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);