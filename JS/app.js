// js/app.js

// Ping test (optional)
fetch(`${appConfig.API_BASE}/ping`)
  .then(res => res.json())
  .then(data => console.log('🌐 Backend says:', data.message))
  .catch(err => console.error('❌ Could not connect to backend:', err));

// Trip fetcher
document.getElementById('fetchTrip').addEventListener('click', () => {
  const userId = document.getElementById('userId').value.trim();
  const tripId = document.getElementById('tripId').value.trim();
  const resultBox = document.getElementById('result');

  resultBox.textContent = 'Loading...';

  if (!userId || !tripId) {
    resultBox.textContent = 'Please enter both User ID and Trip ID.';
    return;
  }

  const url = `${appConfig.API_BASE}/trips/${userId}/${tripId}`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error('Trip not found');
      return res.json();
    })
    .then(data => {
      resultBox.textContent = JSON.stringify(data, null, 2);
    })
    .catch(err => {
      resultBox.textContent = `Error: ${err.message}`;
    });
});
