import appConfig from './appConfig.js';

document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const tripId = params.get('tripId');

  if (!tripId) {
    showMessage('Missing trip ID in URL', 'error');
    return;
  }
  // Fetch trip from backend
fetch(`${appConfig.API_BASE}/trips/${tripId}`, {method: 'GET'})
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => {
          throw new Error(err.error || 'Trip not found');
        });
      }
      return res.json();
    })
    .then(trip => {
      document.getElementById('trip-title').textContent = "Editing " + trip.tripName;
      document.getElementById('trip-name').value = trip.tripName;
      document.getElementById('trip-destination').value = trip.destination;
      document.getElementById('trip-start-date').value = formatDate(trip.startDate);
      document.getElementById('trip-end-date').value = formatDate(trip.endDate);
      document.getElementById('trip-budget').value = trip.budget;
      document.getElementById('trip-status').value = trip.status;
      document.getElementById('return').addEventListener('click', function() {
        window.location.href = './dashboard.html#trips'
      })
      const form = document.getElementById('trip-form');

      //Update trip with new fields
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        const start = new Date(document.getElementById('trip-start-date').value);
        const end = new Date(document.getElementById('trip-end-date').value);

        if (start >= end) {
          showMessage('End date must be after start date', 'error');
          return;
        }

        const updatedTrip = {
          tripName: document.getElementById('trip-name').value,
          destination: document.getElementById('trip-destination').value,
          startDate: new Date(document.getElementById('trip-start-date').value),
          endDate: new Date(document.getElementById('trip-end-date').value),
          budget: document.getElementById('trip-budget').value,
          status: document.getElementById('trip-status').value,
        };

        fetch(`${appConfig.API_BASE}/trips/${tripId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTrip)
        })
          .then(res => {
            if (!res.ok) {
              return res.json().then(err => {
                throw new Error(err.error || 'Failed to update trip');
              });
            }
            return res.json();
          })
          .then(data => {
            showMessage('Trip updated successfully!', 'success');
            setTimeout(() => {
            window.location.href = './viewtrip.html?tripId=' + tripId;
            }, 1500);
        })
          .catch(err => {
            showMessage('Update failed: ' + err.message, 'error');
          });
      });

      //Delete trip
      document.getElementById('delete-trip').addEventListener('click', function() {

        if(!confirm("Are you sure you want to delete this trip permanently?"))
          return;

        fetch(`${appConfig.API_BASE}/trips/${tripId}`, {method: 'DELETE'})
          .then(res => {
            if (!res.ok) {
              return res.json().then(err => {
                throw new Error(err.error || 'Failed to delete trip');
              });
            }
            return res.json();
          })
              .then(data => {
                showMessage('Trip deleted successfully!', 'success');
                setTimeout(() => {
                  window.location.href = './dashboard.html#trips';
                }, 1500);
              })
              .catch(err => {
                showMessage('Delete failed: ' + err.message, 'error');
              });
          });
        })
    .catch(err => {
      showMessage('Could not load trip: ' + err.message, 'error');
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

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date;
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