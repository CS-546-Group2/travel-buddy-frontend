// Backend integration for Travel Buddy Frontend
import appConfig from './appConfig.js';

// Optional ping check to verify backend connectivity
fetch(`${appConfig.API_BASE}/ping`)
  .then(res => res.json())
  .then(data => console.log('🌐 Backend says:', data.message))
  .catch(err => console.error('❌ Could not connect to backend:', err));

// Check if user is logged in and display appropriate UI
document.addEventListener('DOMContentLoaded', function() {
  const currentUser = localStorage.getItem('currentUser');
  
  if (currentUser) {
    const user = JSON.parse(currentUser);
    console.log('👤 User logged in:', user.username);
    
    // Update navigation to show user info and dashboard link
    const navAuth = document.querySelector('.nav-auth');
    const navCta = document.querySelector('.nav-cta');
    
    if (navAuth && navCta) {
      navAuth.textContent = `Welcome, ${user.firstName || user.username}`;
      navAuth.href = './Pages/dashboard.html';
      navCta.textContent = 'Dashboard';
      navCta.href = './Pages/dashboard.html';
    }
  }
});
