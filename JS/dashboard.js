// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  const currentUser = localStorage.getItem('currentUser');
  
  if (!currentUser) {
    // Redirect to login if not authenticated
    window.location.href = './auth.html';
    return;
  }

  const user = JSON.parse(currentUser);
  
  // Update user name in welcome message
  const userNameElement = document.getElementById('user-name');
  if (userNameElement) {
    userNameElement.textContent = user.firstName || user.username;
  }

  // Load user data
  loadUserData(user._id);
  
  // Setup event listeners
  setupEventListeners();
});

// Load user trips and collaborations
async function loadUserData(userId) {
  try {
    // Load trips and collaborations in parallel
    const [trips, collaborations] = await Promise.all([
      fetch(`${appConfig.API_BASE}/trips/user/${userId}`).then(r => r.json()),
      fetch(`${appConfig.API_BASE}/collaboration/user/${userId}`).then(r => r.json())
    ]);

    // Update stats
    updateStats(trips, collaborations);
    
    // Render trips
    renderTrips(trips);
    
    // Render collaborations
    renderCollaborations(collaborations);
    
  } catch (error) {
    console.error('Error loading user data:', error);
    showError('Failed to load your data. Please try again.');
  }
}

// Update dashboard statistics
function updateStats(trips, collaborations) {
  const tripsCount = document.getElementById('trips-count');
  const collabsCount = document.getElementById('collabs-count');
  const destinationsCount = document.getElementById('destinations-count');
  
  if (tripsCount) tripsCount.textContent = trips.length || 0;
  if (collabsCount) collabsCount.textContent = collaborations.length || 0;
  
  // Count unique destinations
  const destinations = new Set();
  trips.forEach(trip => {
    if (trip.destination) destinations.add(trip.destination);
  });
  if (destinationsCount) destinationsCount.textContent = destinations.size || 0;
}

// Render trips in the trips grid
function renderTrips(trips) {
  const tripsGrid = document.getElementById('trips-grid');
  if (!tripsGrid) return;

  if (trips.length === 0) {
    tripsGrid.innerHTML = `
      <div class="loading-card">
        <i class="fas fa-plane"></i>
        <h3>No trips yet</h3>
        <p>Start planning your first adventure!</p>
        <button class="create-trip-btn" onclick="createNewTrip()">
          <i class="fas fa-plus"></i>
          <span>Create Your First Trip</span>
        </button>
      </div>
    `;
    return;
  }

  tripsGrid.innerHTML = trips.map(trip => `
    <div class="trip-card">
      <div class="trip-header">
        <div class="trip-title">${trip.tripName}</div>
        <div class="trip-destination">${trip.destination}</div>
      </div>
      <div class="trip-body">
        <div class="trip-dates">
          <span>${formatDate(trip.startDate)}</span>
          <span>${formatDate(trip.endDate)}</span>
        </div>
        <div class="trip-budget">Budget: $${trip.budget?.toLocaleString() || 'N/A'}</div>
        <div class="trip-status ${trip.status}">${trip.status}</div>
        <div class="trip-actions">
          <button class="trip-btn primary" onclick="viewTrip('${trip._id}')">
            <i class="fas fa-eye"></i> View
          </button>
          <button class="trip-btn secondary" onclick="editTrip('${trip._id}')">
            <i class="fas fa-edit"></i> Edit
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Render collaborations in the collaborations grid
function renderCollaborations(collaborations) {
  const collabsGrid = document.getElementById('collaborations-grid');
  if (!collabsGrid) return;

  if (collaborations.length === 0) {
    collabsGrid.innerHTML = `
      <div class="loading-card">
        <i class="fas fa-users"></i>
        <h3>No collaborations yet</h3>
        <p>When friends share trips with you, they'll appear here.</p>
      </div>
    `;
    return;
  }

  collabsGrid.innerHTML = collaborations.map(collab => `
    <div class="collab-card">
      <div class="collab-header">
        <div class="collab-avatar">
          <i class="fas fa-user"></i>
        </div>
        <div class="collab-info">
          <h3>Shared Trip</h3>
          <p>Trip ID: ${collab.tripId}</p>
        </div>
      </div>
      <div class="collab-role">${collab.role}</div>
      <p>Status: ${collab.status}</p>
      <button class="trip-btn primary" onclick="viewCollaboration('${collab._id}')">
        <i class="fas fa-eye"></i> View Trip
      </button>
    </div>
  `).join('');
}

// Setup event listeners
function setupEventListeners() {
  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  // Create trip button
  const createTripBtn = document.getElementById('create-trip-btn');
  if (createTripBtn) {
    createTripBtn.addEventListener('click', createNewTrip);
  }

  // Quick action buttons
  const planTripBtn = document.getElementById('plan-trip-btn');
  if (planTripBtn) {
    planTripBtn.addEventListener('click', createNewTrip);
  }

  const shareTripBtn = document.getElementById('share-trip-btn');
  if (shareTripBtn) {
    shareTripBtn.addEventListener('click', () => {
      showMessage('Share trip functionality coming soon!', 'info');
    });
  }

  const findInspirationBtn = document.getElementById('find-inspiration-btn');
  if (findInspirationBtn) {
    findInspirationBtn.addEventListener('click', () => {
      showMessage('Inspiration feature coming soon!', 'info');
    });
  }

  const viewStatsBtn = document.getElementById('view-stats-btn');
  if (viewStatsBtn) {
    viewStatsBtn.addEventListener('click', () => {
      showMessage('Travel statistics coming soon!', 'info');
    });
  }
}

// Logout function
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = '../index.html';
}

// Create new trip
function createNewTrip() {
  showMessage('Trip creation feature coming soon!', 'info');
}

// View trip details
function viewTrip(tripId) {
  showMessage(`Viewing trip ${tripId} - details coming soon!`, 'info');
}

// Edit trip
function editTrip(tripId) {
  showMessage(`Editing trip ${tripId} - editor coming soon!`, 'info');
}

// View collaboration
function viewCollaboration(collabId) {
  showMessage(`Viewing collaboration ${collabId} - details coming soon!`, 'info');
}

// Utility functions
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}

function showMessage(message, type = 'info') {
  // Create message element
  const messageEl = document.createElement('div');
  messageEl.className = `dashboard-message ${type}`;
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

function showError(message) {
  showMessage(message, 'error');
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