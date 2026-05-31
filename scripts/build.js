const fs = require("fs");
const path = require("path");

const root = process.cwd();
const outDir = path.join(root, "public");

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const config = {
  apiKey: process.env.FIREBASE_API_KEY || "",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.FIREBASE_APP_ID || "",
};

const enabled = Object.values(config).every(Boolean);
const firebaseConfig = `window.__FIREBASE_CONFIG__ = ${JSON.stringify(config, null, 2)};\nwindow.__FIREBASE_ENABLED__ = ${JSON.stringify(enabled)};\n`;

const files = [
  "index.html",
  "styles.css",
  "app.js",
  "preview.png",
  "vercel.json",
];

files.forEach((file) => {
  const source = path.join(root, file);
  if (fs.existsSync(source)) fs.copyFileSync(source, path.join(outDir, file));
});

fs.writeFileSync(path.join(outDir, "firebase-config.js"), firebaseConfig);
fs.writeFileSync(path.join(root, "firebase-config.js"), firebaseConfig);

console.log(enabled ? "Built public app with Firebase config." : "Built public app with missing Firebase values.");
