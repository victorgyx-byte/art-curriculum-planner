const fs = require("fs");

const config = {
  apiKey: process.env.FIREBASE_API_KEY || "",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.FIREBASE_APP_ID || "",
};

const enabled = Object.values(config).every(Boolean);
const contents = `window.__FIREBASE_CONFIG__ = ${JSON.stringify(config, null, 2)};\nwindow.__FIREBASE_ENABLED__ = ${JSON.stringify(enabled)};\n`;

fs.writeFileSync("firebase-config.js", contents);
console.log(enabled ? "Firebase config written." : "Firebase config written with missing values.");
