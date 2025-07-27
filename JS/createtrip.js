// Auth page functionality with backend integration
import appConfig from './appConfig.js';

document.addEventListener('DOMContentLoaded', function() {

    const currentUser = localStorage.getItem('currentUser');
  
    if (!currentUser) {
        // Redirect to login if not authenticated
        window.location.href = './auth.html';
        return;
    }

    const user = JSON.parse(currentUser);

    // Get DOM elements
    const tripForm = document.getElementById('trip-form');

    // Backend signup integration
    tripForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const tripname = document.getElementById('create-tripname').value;
        const destination = document.getElementById('create-destination').value;
        const startdate = document.getElementById('create-start-date').value;
        const enddate = document.getElementById('create-end-date').value;
        const budget = document.getElementById('create-budget').value;
        const status = document.getElementById('create-status').value;

        // Basic validation
        if (!tripname || !destination || !startdate || !enddate || !budget || !status) {
        showMessage('Please fill in all fields', 'error');
        return;
        }
        
        const start = new Date(startdate);
        const end = new Date(enddate);

        if (start >= end) {
        showMessage('End date must be after start date', 'error');
        }

        if (start < new Date()) {
        showMessage('Start date cannot be in the past', 'error');
        }    

        showMessage('Creating your trip...', 'info');

        // Call backend signup endpoint
        fetch(`${appConfig.API_BASE}/trips/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: user._id,
            tripName: tripname,
            destination: destination,
            startDate: start,
            endDate: end,
            duration: Math.ceil((end - start) / (1000 * 60 * 60 * 24)),
            budget: budget,
            status: status,
            preferences: user.travelPreferences 
        })
        })
        .then(res => {
        if (!res.ok) {
            return res.json().then(err => {
            throw new Error(err.error || 'Trip creation failed');
            });
        }
        return res.json();
        })
        .then(data => {
        showMessage('Trip created successfully! View your trip on the dashboard!', 'success');
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = './dashboard.html#trips';
        }, 1500);
        })
        .catch(err => {
        console.error('Trip creation error:', err);
        showMessage('Trip creation failed: ' + err.message, 'error');
        });
    });
});

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