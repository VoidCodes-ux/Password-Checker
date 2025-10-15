document.getElementById("checkBtn").addEventListener("click", async () => {
  const password = document.getElementById("password").value;
  const result = document.getElementById("result");

  if (!password) {
    result.textContent = "⚠️ Please enter a password!";
    return;
  }

  result.textContent = "Checking...";
  
  try {
    const res = await fetch("/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (data.error) {
      result.textContent = "❌ Error: " + data.error;
    } else if (data.breached) {
      result.textContent = `😬 Oh no! This password was found in ${data.count} breaches.`;
    } else {
      result.textContent = "✅ Good news! This password has not been found in any known breaches.";
    }
  } catch (err) {
    result.textContent = "❌ Network error.";
  }
});
