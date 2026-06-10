// logging_middleware/index.js

const API_URL = "http://4.224.186.213/evaluation-service/logs";

// PASTE YOUR MASSIVE ACCESS TOKEN HERE (Keep the quotes)
const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhZGl0eWEucHJha2FzaF9jczIzQGdsYS5hYy5pbiIsImV4cCI6MTc4MTA3NDE4MiwiaWF0IjoxNzgxMDczMjgyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZDQxYzBkZjEtODY0OS00ZDVhLWIwMWYtY2Y5ODBhN2I5MGYxIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYWRpdHlhIHByYWthc2giLCJzdWIiOiJiNTlmODY2Yi1jZmVhLTQyYzItOWFlNS05NzFjZDFlYTg3MDIifSwiZW1haWwiOiJhZGl0eWEucHJha2FzaF9jczIzQGdsYS5hYy5pbiIsIm5hbWUiOiJhZGl0eWEgcHJha2FzaCIsInJvbGxObyI6IjIzMTUwMDAxMzEiLCJhY2Nlc3NDb2RlIjoiUlBzZ1l0IiwiY2xpZW50SUQiOiJiNTlmODY2Yi1jZmVhLTQyYzItOWFlNS05NzFjZDFlYTg3MDIiLCJjbGllbnRTZWNyZXQiOiJlanl5RUFWZmtVdXFwa3N6In0.tvcsRG16KRJ0xLaXpOcmdpVJ1CcZ-BvnwN9gwRX-3oY"; 

export const Log = async (stack, level, pkg, message) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${BEARER_TOKEN}`
      },
      body: JSON.stringify({
        stack: stack,      // Must be "frontend"
        level: level,      // "debug", "info", "warn", "error", or "fatal"
        package: pkg,      // "api", "component", "hook", "page", etc.
        message: message   // Your descriptive log message
      })
    });

    if (!response.ok) {
        console.error("Failed to send log to server. Status:", response.status);
    }
  } catch (error) {
    console.error("Logging middleware error:", error);
  }
};