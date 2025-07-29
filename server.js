// Tejo Nails Admin Server
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001; // Koristi različiti port od glavne aplikacije

// Middleware
app.use(morgan("dev"));
app.use(express.static(__dirname));

// Posluživanje admin.html stranice
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// Pokretanje servera
const server = app.listen(PORT, () => {
  console.log(`Admin poslužitelj je pokrenut na portu ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM primljen: zatvaranje HTTP poslužitelja");
  server.close(() => {
    console.log("HTTP poslužitelj zatvoren");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT primljen: zatvaranje HTTP poslužitelja");
  server.close(() => {
    console.log("HTTP poslužitelj zatvoren");
    process.exit(0);
  });
});
