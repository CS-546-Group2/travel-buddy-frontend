import appConfig from './appConfig.js';
import logger from './utils/logger.js';

document.addEventListener('DOMContentLoaded', async function () {
  const params = new URLSearchParams(window.location.search);
  const tripId = params.get('tripId');
  if (!tripId) {
    showMessage('Missing trip ID in URL', 'error');
    return;
  }

  //Change this when collaborations are added
  const currentUser = localStorage.getItem('currentUser');
  
    if (!currentUser) {
        // Redirect to login if not authenticated
        window.location.href = './auth.html';
        return;
    }

  try {
    // Fetch trip from backend
    const response = await fetch(`${appConfig.API_BASE}/trips/${tripId}`, { method: 'GET' });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Trip not found');
    }

    const trip = await response.json();
    //console.log(trip);
    logger.info('Viewing trip:', trip)

    document.getElementById('trip-title').textContent = `${trip.tripName} | Travel Buddy`;
    document.getElementById('trip-name').textContent = trip.tripName;
    document.getElementById('trip-destination').textContent = trip.destination;
    document.getElementById('trip-start-date').textContent = formatDate(trip.startDate);
    document.getElementById('trip-end-date').textContent = formatDate(trip.endDate);
    document.getElementById('trip-budget').textContent = trip.budget;
    document.getElementById('trip-budget-range').textContent = trip.preferences.budgetRange;
    document.getElementById('trip-travel-style').textContent = trip.preferences.travelStyle;
    document.getElementById('trip-accommodation-style').textContent = trip.preferences.accommodationStyle;
    document.getElementById('trip-interests').textContent = trip.preferences.interests;
    document.getElementById('trip-status').textContent = trip.status;
    document.getElementById('last-updated').textContent = formatDate(trip.updatedAt);
    document.getElementById('created-on').textContent = formatDate(trip.createdAt);

    document.getElementById('return').addEventListener('click', function () {
      window.location.href = './dashboard.html#trips';
    });

    document.getElementById('edit').addEventListener('click', function () {
      window.location.href = `./edittrip.html?tripId=${tripId}`;
    });

  } catch (err) {
    showMessage('Could not load trip: ' + err.message, 'error');
    logger.error('Could not load trip: ' + err.message);
  }
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

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    timeZone: 'UTC', 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
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