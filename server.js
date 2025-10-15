console.log("Server file loaded!");


import express from "express";
import fetch from "node-fetch";
import crypto from "crypto";

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());

app.post("/check", async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: "Password required" });
  }

  const sha1 = crypto.createHash("sha1").update(password).digest("hex").toUpperCase();
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);

  try {
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const data = await response.text();

    const found = data.split("\n").find(line => line.startsWith(suffix));
    if (found) {
      const count = found.split(":")[1].trim();
      res.json({ breached: true, count });
    } else {
      res.json({ breached: false });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "API request failed" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
