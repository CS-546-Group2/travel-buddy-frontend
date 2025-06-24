// Auth page functionality
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

  // Form submission handlers
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Basic validation
    if (!email || !password) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    // Simulate login process
    showMessage('Signing you in...', 'info');
    
    setTimeout(() => {
      showMessage('Welcome back! Redirecting...', 'success');
      // Redirect to dashboard or home page
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    }, 1000);
  });

  signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const firstname = document.getElementById('signup-firstname').value;
    const lastname = document.getElementById('signup-lastname').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    const terms = signupForm.querySelector('input[name="terms"]').checked;
    
    // Basic validation
    if (!firstname || !lastname || !email || !password || !confirm) {
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

    // Simulate signup process
    showMessage('Creating your account...', 'info');
    
    setTimeout(() => {
      showMessage('Account created successfully! Welcome to Travel Buddy!', 'success');
      // Redirect to dashboard or home page
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    }, 1000);
  });

  // Social login handlers
  document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
      showMessage(`Connecting with ${provider}...`, 'info');
      
      setTimeout(() => {
        showMessage(`${provider} authentication would be implemented here`, 'info');
      }, 1000);
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