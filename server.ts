import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(process.cwd(), "yara-rules.json");
const SOC_DATA_FILE = path.join(process.cwd(), "soc-data.json");
const CASES_DATA_FILE = path.join(process.cwd(), "cases-data.json");

// Middleware
app.use(express.json({ limit: '10mb' }));

// Initial data load/setup
if (!fs.existsSync(CASES_DATA_FILE)) {
  fs.writeFileSync(CASES_DATA_FILE, JSON.stringify([
    {
      id: '1224',
      uuid: 'ce730674-e424-488b-8d89-7975bf8e5599',
      name: 'Snapshot Malware Detection',
      summary: 'Filescan Malware file found FILE: ./.snapshots/1/snapshot/10.txt',
      assessment: 'Likely persistence mechanism established via hidden snapshot directory.',
      type: 'Malware',
      status: 'Level 1 Working',
      creator: 'admin',
      priority: 'Medium (default)',
      recommendations: ['Remove Vulnerability', 'Plan Remediation'],
      customRecommendation: 'Deep scan all snapshot volumes for similar patterns.',
      tags: ['malware', 'persistence'],
      externalId: 'EXT-9921',
      createdAt: '2026-05-07T14:30:00Z',
      events: [
        { time: '2023-06-19', scan: '806', level: 'ALERT', score: 100, raw: 'MODULE: Filescan, SCORE: 100, FILE: /snapshot/10.txt' }
      ],
      affectedAssets: [
        { id: '2', name: 'Web-FE-01', risk: 'Medium', type: 'Web Server', status: 'Infected' }
      ]
    }
  ], null, 2));
}

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([
    {
      id: '1',
      name: 'Webshell_C99',
      category: 'Webshells',
      enabled: true,
      assets: ['WebServer', 'DMZ'],
      content: `rule Webshell_C99 {
    meta:
        description = "Detects C99 webshell"
        author = "GuardMCP"
        date = "2024-01-01"
    strings:
        $s1 = "c99shell" ascii
        $s2 = "phpshell" ascii
    condition:
        any of them
}`
    }
  ], null, 2));
}

if (!fs.existsSync(SOC_DATA_FILE)) {
  fs.writeFileSync(SOC_DATA_FILE, JSON.stringify({
    events: [
      { id: '8816', rule: 'Access to Blacklisted External URL Blocked by Firewall', severity: 'High', type: 'Firewall', date: 'Apr 26th 2026 at 23:07', status: 'Awaiting action' },
      { id: '8815', rule: 'Inbound Email Containing Suspicious External Link', severity: 'Medium', type: 'Phishing', date: 'Apr 26th 2026 at 23:06', status: 'Awaiting action' },
      { id: '8814', rule: 'Inbound Email Containing Suspicious External Link', severity: 'Medium', type: 'Phishing', date: 'Apr 26th 2026 at 23:03', status: 'Awaiting action' },
      { id: '8813', rule: 'Multiple Failed Login Attempts', severity: 'Low', type: 'Brute Force', date: 'Apr 26th 2026 at 22:45', status: 'Resolved' },
    ],
    assets: [
      { id: '1', name: 'DB-Prod-01', risk: 'High', type: 'Database', status: 'Monitored' },
      { id: '2', name: 'Web-FE-01', risk: 'Medium', type: 'Web Server', status: 'Infected' },
      { id: '3', name: 'Mail-Relay', risk: 'Low', type: 'Mail Server', status: 'Secure' },
    ],
    history: [
      { id: '1', user: 'admin', action: 'Rule Created', target: 'Webshell_C99', date: '2026-05-07T10:00:00Z' },
      { id: '2', user: 'analyst1', action: 'Alert Resolved', target: 'EV-8813', date: '2026-05-07T11:30:00Z' },
    ]
  }, null, 2));
}

// API Routes
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  // Basic mock auth
  if (username === "admin" && password === "password") {
    res.json({ token: "mock-jwt-token", user: { username: "admin", role: "SOC Manager" } });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.get("/api/soc/stats", (req, res) => {
  const data = JSON.parse(fs.readFileSync(SOC_DATA_FILE, "utf-8"));
  res.json({
    totalEvents: data.events.length,
    activeAlerts: data.events.filter((e: any) => e.status !== 'Resolved').length,
    affectedAssets: data.assets.filter((a: any) => a.risk !== 'Low').length,
    yaraRules: JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")).length
  });
});

app.get("/api/soc/events", (req, res) => {
  const data = JSON.parse(fs.readFileSync(SOC_DATA_FILE, "utf-8"));
  res.json(data.events);
});

app.get("/api/soc/assets", (req, res) => {
  const data = JSON.parse(fs.readFileSync(SOC_DATA_FILE, "utf-8"));
  res.json(data.assets);
});

app.get("/api/soc/history", (req, res) => {
  const data = JSON.parse(fs.readFileSync(SOC_DATA_FILE, "utf-8"));
  res.json(data.history);
});

// Case Endpoints
app.get("/api/soc/cases", (req, res) => {
  const data = JSON.parse(fs.readFileSync(CASES_DATA_FILE, "utf-8"));
  res.json(data);
});

app.get("/api/soc/cases/:id", (req, res) => {
  const cases = JSON.parse(fs.readFileSync(CASES_DATA_FILE, "utf-8"));
  const found = cases.find((c: any) => c.id === req.params.id);
  if (found) res.json(found);
  else res.status(404).json({ error: "Case not found" });
});

app.get("/api/yara/sync", (req, res) => {
  // Mocking a remote rule sync
  const communityRules = [
    {
      id: "comm-" + Date.now(),
      name: "APT_Mustang_Panda",
      category: "APT",
      enabled: false,
      assets: ["WebServer", "Cloud"],
      room: "Infiltration",
      content: `rule APT_Mustang_Panda {
    meta:
        description = "Detects Mustang Panda loader"
        source = "Community"
    strings:
        $a = "Mustang" ascii
        $b = { 4D 55 53 54 41 4E 47 }
    condition:
        all of them
}`
    },
    {
      id: "comm-" + (Date.now() + 1),
      name: "Ransomware_LockBit_v3",
      category: "Ransomware",
      enabled: false,
      assets: ["Endpoint", "Internal"],
      room: "Exfiltration",
      content: `rule Ransomware_LockBit_v3 {
    meta:
        description = "Detects LockBit v3.0 patterns"
        source = "Community"
    strings:
        $lock = "LockBit" wide ascii
    condition:
        $lock
}`
    }
  ];
  res.json(communityRules);
});

app.post("/api/soc/cases", (req, res) => {
  const cases = JSON.parse(fs.readFileSync(CASES_DATA_FILE, "utf-8"));
  const newCase = {
    ...req.body,
    id: (Math.floor(Math.random() * 9000) + 1000).toString(),
    uuid: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };
  cases.push(newCase);
  fs.writeFileSync(CASES_DATA_FILE, JSON.stringify(cases, null, 2));
  res.status(201).json(newCase);
});

app.put("/api/soc/cases/:id", (req, res) => {
  let cases = JSON.parse(fs.readFileSync(CASES_DATA_FILE, "utf-8"));
  const index = cases.findIndex((c: any) => c.id === req.params.id);
  if (index !== -1) {
    cases[index] = { ...cases[index], ...req.body };
    fs.writeFileSync(CASES_DATA_FILE, JSON.stringify(cases, null, 2));
    res.json(cases[index]);
  } else {
    res.status(404).json({ error: "Case not found" });
  }
});

app.get("/api/yara/rules", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  res.json(data);
});

app.post("/api/yara/rules", (req, res) => {
  const rules = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  const newRule = {
    ...req.body,
    id: Date.now().toString(),
    enabled: true,
    assets: req.body.assets || []
  };
  rules.push(newRule);
  fs.writeFileSync(DATA_FILE, JSON.stringify(rules, null, 2));
  res.status(201).json(newRule);
});

app.put("/api/yara/rules/:id", (req, res) => {
  let rules = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  const index = rules.findIndex((r: any) => r.id === req.params.id);
  if (index !== -1) {
    rules[index] = { ...rules[index], ...req.body };
    fs.writeFileSync(DATA_FILE, JSON.stringify(rules, null, 2));
    res.json(rules[index]);
  } else {
    res.status(404).json({ error: "Rule not found" });
  }
});

app.delete("/api/yara/rules/:id", (req, res) => {
  let rules = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  rules = rules.filter((r: any) => r.id !== req.params.id);
  fs.writeFileSync(DATA_FILE, JSON.stringify(rules, null, 2));
  res.status(204).send();
});

// Vite Middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
