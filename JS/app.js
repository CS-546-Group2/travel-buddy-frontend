// JS/main.js
fetch('http://localhost:5000/api/ping')
  .then(res => res.json())
  .then(data => console.log('🌐 Backend says:', data.message))
  .catch(err => console.error('❌ Could not connect to backend:', err));

document.getElementById('fetchTrip').addEventListener('click', () => {
  const userId = document.getElementById('userId').value.trim();
  const tripId = document.getElementById('tripId').value.trim();

  const resultBox = document.getElementById('result');
  resultBox.textContent = 'Loading...';

  if (!userId || !tripId) {
    resultBox.textContent = 'Please enter both User ID and Trip ID.';
    return;
  }

  const url = `http://localhost:5000/api/trips/${userId}/${tripId}`;

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error('Trip not found');
      return res.json();
    })
    .then((trip) => {
      resultBox.textContent = JSON.stringify(trip, null, 2);
    })
    .catch((err) => {
      resultBox.textContent = `Error: ${err.message}`;
    });
});
