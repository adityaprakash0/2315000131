// notification_app_fe/index.js
import { Log } from '../logging_middleware/index.js';

const AUTH_URL = "http://4.224.186.213/evaluation-service/auth";
const NOTIFICATION_API_URL = "http://4.224.186.213/evaluation-service/notifications";

const credentials = {
  email: "aditya.prakash_cs23@gla.ac.in",
  name: "Aditya Prakash",
  mobileNo: "7779939961",
  githubUsername: "adityaprakash0",
  rollNo: "2315000131",
  accessCode: "RPsgYt",
  clientId: "b59f866b-cfea-42c2-9ae5-971cd1ea8702",
  clientSecret: "ejyyEAVfkUuqpksz"
};

const getPriorityWeight = (type) => {
  if (type === 'Placement') return 3;
  if (type === 'Result') return 2;
  if (type === 'Event') return 1;
  return 0;
};

async function processPriorityInbox() {
  try {
    await Log("frontend", "info", "api", "Stage 1: Initiating fetch request for campus notifications stream");

    // 1. Automatically fetch a fresh token immediately before calling the data api
    const authResponse = await fetch(AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials)
    });

    if (!authResponse.ok) {
      throw new Error("Automatic script authentication failed");
    }

    const authData = await authResponse.json();
    const activeToken = authData.access_token;

    // 2. Fetch the real-time data stream with the fresh token
    const response = await fetch(NOTIFICATION_API_URL, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${activeToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Server responded with an invalid status code: ${response.status}`);
    }

    const data = await response.json();
    const notificationList = data.notifications || [];

    // Dual-Sorting Algorithm
    const sortedNotifications = [...notificationList].sort((a, b) => {
      const weightA = getPriorityWeight(a.Type);
      const weightB = getPriorityWeight(b.Type);

      if (weightA !== weightB) {
        return weightB - weightA;
      }
      return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
    });

    const top10 = sortedNotifications.slice(0, 10);

    const formattedOutput = top10.map((item, index) => 
      `[${index + 1}] TYPE: ${item.Type.padEnd(9)} | TIME: ${item.Timestamp} | MSG: ${item.Message}`
    ).join('\n');

    await Log("frontend", "info", "utils", `Successfully extracted top 10 priority notifications out of ${notificationList.length} total elements.`);

    // Print clean results layout safely to console layout window
    process.stdout.write(`\n===================== PRIORITY INBOX — TOP 10 =====================\n`);
    process.stdout.write(`${formattedOutput}\n`);
    process.stdout.write(`===================================================================\n\n`);

  } catch (error) {
    await Log("frontend", "error", "api", `Stage 1 Processing Failure: ${error.message}`);
    process.stdout.write(`Execution Error: ${error.message}\n`);
  }
}

processPriorityInbox();