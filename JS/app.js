// js/app.js

// Optional ping check
fetch(`${appConfig.API_BASE}/ping`)
  .then(res => res.json())
  .then(data => console.log('🌐 Backend says:', data.message))
  .catch(err => console.error('❌ Could not connect to backend:', err));

// Login + Fetch trips & collaborations
document.getElementById('loginBtn').addEventListener('click', () => {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const resultBox = document.getElementById('result');

  resultBox.textContent = '🔐 Logging in...';

  if (!username || !password) {
    resultBox.textContent = '❌ Please enter both username and password.';
    return;
  }

  fetch(`${appConfig.API_BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(res => {
      if (!res.ok) throw new Error('Invalid credentials');
      return res.json();
    })
    .then(user => {
      resultBox.textContent = `✅ Logged in as ${user.username}!\nFetching trips and collaborations...`;

      return Promise.all([
        fetch(`${appConfig.API_BASE}/trips/user/${user._id}`).then(r => r.json()),
        fetch(`${appConfig.API_BASE}/collaboration/user/${user._id}`).then(r => r.json())
      ]).then(([trips, collabs]) => {
        resultBox.textContent =
          `👤 User:\n${JSON.stringify(user, null, 2)}\n\n` +
          `🧳 Trips:\n${JSON.stringify(trips, null, 2)}\n\n` +
          `🤝 Collaborations:\n${JSON.stringify(collabs, null, 2)}`;
      });
    })
    .catch(err => {
      resultBox.textContent = `❌ Login error: ${err.message}`;
    });
});
