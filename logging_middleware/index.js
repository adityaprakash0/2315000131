// logging_middleware/index.js
const AUTH_URL = "http://4.224.186.213/evaluation-service/auth";
const LOG_URL = "http://4.224.186.213/evaluation-service/logs";

// Trimmed to contain exactly the 6 keys expected by the /auth schema
const authPayload = {
  email: "aditya.prakash_cs23@gla.ac.in",
  name: "Aditya Prakash",
  rollNo: "2315000131",
  accessCode: "RPsgYt",
  clientId: "b59f866b-cfea-42c2-9ae5-971cd1ea8702",
  clientSecret: "ejyyEAVfkUuqpksz"
};

export const Log = async (stack, level, pkg, message) => {
  try {
    const authResponse = await fetch(AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authPayload)
    });
    
    if (!authResponse.ok) return;
    const authData = await authResponse.json();
    const activeToken = authData.access_token;

    await fetch(LOG_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${activeToken}`
      },
      body: JSON.stringify({
        stack: stack,
        level: level,
        "package": pkg,
        message: message
      })
    });
  } catch (error) {
    // Graceful catch-all to prevent terminal spamming
  }
};