import appConfig from './appConfig.js';

document.getElementById('preferencesForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;

  const userId = sessionStorage.getItem('userId') || "665a213bd76d6e8f9c8b1234";

  if (!userId) {
    alert('User ID not found. Please log in.');
    return;
  }

  const data = {
    userId,
    travelStyle: form.travelStyle.value,
    budgetRange: form.budgetRange.value,
    accommodationStyle: form.accommodationStyle.value,
    interests: Array.from(form.querySelectorAll('input[name="interests"]:checked')).map(i => i.value)
  };

  try {
    const response = await fetch(`${appConfig.API_BASE}/preferences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById('successMsg').style.display = 'block';
      console.log('✅ Preferences saved:', result);
    } else {
      console.error('❌ Server error:', result.error);
      alert(result.error || 'Failed to save preferences.');
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    alert('Network error. Please try again.');
  }
});
