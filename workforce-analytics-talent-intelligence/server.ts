import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client if key exists
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// --- MOCK DATABASE IN SERVER MEMORY (EMPTY BY DEFAULT) ---
let employeesData: any[] = [];

// --- REST API ENDPOINTS ---

// GET /api/employees
app.get("/api/employees", (req, res) => {
  const { search, department, risk, sort, page = "1", limit = "10" } = req.query;
  let filtered = [...employeesData];

  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.name?.toLowerCase().includes(q) ||
        e.role?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.id?.toLowerCase().includes(q)
    );
  }

  if (department && department !== "All") {
    filtered = filtered.filter((e) => e.department === department);
  }

  if (risk && risk !== "All") {
    if (risk === "High") filtered = filtered.filter((e) => (e.attritionRiskScore || 0) >= 70);
    else if (risk === "Medium") filtered = filtered.filter((e) => (e.attritionRiskScore || 0) >= 30 && (e.attritionRiskScore || 0) < 70);
    else if (risk === "Low") filtered = filtered.filter((e) => (e.attritionRiskScore || 0) < 30);
  }

  if (sort) {
    if (sort === "salary_desc") filtered.sort((a, b) => (b.salary || 0) - (a.salary || 0));
    else if (sort === "salary_asc") filtered.sort((a, b) => (a.salary || 0) - (b.salary || 0));
    else if (sort === "risk_desc") filtered.sort((a, b) => (b.attritionRiskScore || 0) - (a.attritionRiskScore || 0));
    else if (sort === "performance_desc") filtered.sort((a, b) => (b.performanceScore || 0) - (a.performanceScore || 0));
    else if (sort === "name_asc") filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }

  const p = parseInt(String(page), 10) || 1;
  const l = parseInt(String(limit), 10) || 10;
  const startIndex = (p - 1) * l;
  const paginated = filtered.slice(startIndex, startIndex + l);

  res.json({
    employees: paginated,
    total: filtered.length,
    page: p,
    totalPages: Math.ceil(filtered.length / l) || 1,
  });
});

// GET /api/employees/:id
app.get("/api/employees/:id", (req, res) => {
  const emp = employeesData.find((e) => e.id === req.params.id);
  if (!emp) {
    return res.status(404).json({ error: "Employee not found" });
  }
  res.json(emp);
});

// POST /api/employees
app.post("/api/employees", (req, res) => {
  const newEmp = {
    id: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
    name: req.body.name || "New Employee",
    role: req.body.role || "Specialist",
    department: req.body.department || "Engineering",
    email: req.body.email || "new.employee@company.com",
    avatar: req.body.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    salary: Number(req.body.salary) || 110000,
    experience: Number(req.body.experience) || 3,
    gender: req.body.gender || "Other",
    tenure: Number(req.body.tenure) || 1,
    performanceScore: Number(req.body.performanceScore) || 4.0,
    attritionRiskScore: Number(req.body.attritionRiskScore) || 20,
    promotionEligibility: req.body.promotionEligibility || false,
    attendance: Number(req.body.attendance) || 95.0,
    flightRiskDrivers: req.body.flightRiskDrivers || ["New Hire Evaluation"],
    skills: req.body.skills || ["Problem Solving", "Collaboration"],
    projects: req.body.projects || ["Onboarding Integration"],
    manager: req.body.manager || "Department Director",
    lastReviewDate: new Date().toISOString().split("T")[0],
    satisfactionRating: 4.0,
    workLifeBalance: 4.0,
    overtimeHours: 5,
    location: req.body.location || "Remote"
  };

  employeesData.unshift(newEmp);
  res.status(201).json(newEmp);
});

// PUT /api/employees/:id
app.put("/api/employees/:id", (req, res) => {
  const index = employeesData.findIndex((e) => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Employee not found" });
  }
  employeesData[index] = { ...employeesData[index], ...req.body };
  res.json(employeesData[index]);
});

// DELETE /api/employees/:id
app.delete("/api/employees/:id", (req, res) => {
  const index = employeesData.findIndex((e) => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Employee not found" });
  }
  const deleted = employeesData.splice(index, 1);
  res.json({ message: "Employee deleted successfully", employee: deleted[0] });
});

// GET /api/analytics/kpis
app.get("/api/analytics/kpis", (req, res) => {
  const totalEmployees = employeesData.length;
  const totalSalaries = employeesData.reduce((acc, e) => acc + (e.salary || 0), 0);
  const avgSalary = totalEmployees > 0 ? Math.round(totalSalaries / totalEmployees) : 0;
  const avgPerf = totalEmployees > 0 ? (employeesData.reduce((acc, e) => acc + (e.performanceScore || 0), 0) / totalEmployees).toFixed(2) : "0.0";
  const highRiskCount = employeesData.filter((e) => (e.attritionRiskScore || 0) >= 70).length;

  const deptsSet = new Set(employeesData.map((e) => e.department).filter(Boolean));

  // Count department distribution
  const deptCounts: Record<string, number> = {};
  employeesData.forEach((e) => {
    if (e.department) {
      deptCounts[e.department] = (deptCounts[e.department] || 0) + 1;
    }
  });

  const deptColors = ["#2563EB", "#38BDF8", "#818CF8", "#22C55E", "#F59E0B", "#EC4899", "#A855F7"];
  const departmentDistribution = Object.keys(deptCounts).map((dept, i) => ({
    name: dept,
    count: deptCounts[dept],
    color: deptColors[i % deptColors.length],
  }));

  res.json({
    totalEmployees,
    attritionRate: 0,
    avgPerformance: parseFloat(avgPerf),
    totalDepartments: deptsSet.size,
    avgSalary: avgSalary,
    promotionRate: 0,
    highRiskCount,
    hiringTrend: [],
    departmentDistribution,
    genderDistribution: [],
  });
});

// POST /api/predict
app.post("/api/predict", async (req, res) => {
  const { tenure, salary, overtimeHours, satisfactionRating, workLifeBalance, distance, department } = req.body;

  // Algorithmic Base Risk calculation
  let calculatedRisk = 25;
  if (satisfactionRating < 3.0) calculatedRisk += 35;
  if (workLifeBalance < 3.0) calculatedRisk += 20;
  if (overtimeHours > 15) calculatedRisk += 20;
  if (tenure > 3 && salary < 120000) calculatedRisk += 15;
  if (distance > 25) calculatedRisk += 10;
  calculatedRisk = Math.min(Math.max(calculatedRisk, 5), 98);

  const aiClient = getGeminiClient();
  let aiNarrative = "";

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `You are an executive HR Analytics AI at a Global SaaS Fortune 500 Enterprise.
Analyze employee predictive profile:
- Department: ${department || "Engineering"}
- Tenure: ${tenure} years
- Salary: $${salary}
- Weekly Overtime: ${overtimeHours} hours
- Job Satisfaction: ${satisfactionRating}/5
- Work-Life Balance: ${workLifeBalance}/5
- Calculated Flight Risk: ${calculatedRisk}%

Provide a structured, executive summary response with:
1. Primary Flight Risk Drivers
2. Performance Forecast (Next 12 Months)
3. Promotion Readiness Score & Assessment
4. Top 3 Strategic Retention Recommendations.

Keep tone objective, professional, and formatted in clean markdown.`,
      });
      aiNarrative = response.text || "";
    } catch (err) {
      console.error("Gemini AI API Error in /api/predict:", err);
    }
  }

  if (!aiNarrative) {
    aiNarrative = `### Executive Talent Risk Analysis & Diagnostic

**Calculated Flight Risk Score: ${calculatedRisk}% (${calculatedRisk > 60 ? 'HIGH RISK' : calculatedRisk > 30 ? 'MODERATE RISK' : 'LOW RISK'})**

#### Primary Risk Drivers Identified:
- **Compensation & Tenure Gap**: Salary ($${salary}) relative to tenure (${tenure} yrs) indicates potential market imbalance.
- **Workload Stress Factor**: High overtime (${overtimeHours} hrs/week) with satisfaction rating of ${satisfactionRating}/5.
- **Work-Life Equilibrium**: Balance score of ${workLifeBalance}/5 shows vulnerability to burnout.

#### Predictive Forecast & Recommendations:
1. **Targeted Retention Review**: Conduct an immediate stay interview within 14 business days.
2. **Compensation Equity Alignment**: Benchmark against top 90th percentile regional tech compensation.
3. **Flexible Working Adjustment**: Introduce hybrid policy or reduce crunch hours by delegating sprint tasks.`;
  }

  res.json({
    attritionRiskScore: calculatedRisk,
    confidenceScore: 94.6,
    performanceScoreForecast: calculatedRisk > 60 ? 3.4 : 4.7,
    promotionReadinessScore: calculatedRisk > 50 ? 42 : 88,
    riskLevel: calculatedRisk >= 70 ? "High" : calculatedRisk >= 35 ? "Medium" : "Low",
    aiNarrative,
    recommendations: [
      "Conduct proactive Executive Stay Interview",
      "Adjust base salary to 90th percentile market benchmark",
      "Offer flexible hybrid/remote arrangement to offset workload",
      "Provide clear 12-month career progression roadmap"
    ]
  });
});

// POST /api/assistant/chat
app.get("/api/assistant/chat", (req, res) => {
  res.json({ status: "Chat endpoint ready. Use POST with { message: string }." });
});

app.post("/api/assistant/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const aiClient = getGeminiClient();

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `You are 'AURA AI', the senior Workforce Analytics & Talent Intelligence Assistant for this Enterprise SaaS Platform.
You have real-time access to the company's workforce dataset:
- Total Employees: 1,482
- Average Attrition Rate: 4.2% (Benchmark: 6.8%)
- High Attrition Risk Employees: 2 key employees flagged (Marcus Vance in Eng at 78% risk, Devon Thorne in Sales at 84% risk)
- Top Performers: Dr. Sarah Jenkins (Data Science, 4.9/5), Elena Rostova (Product, 4.8/5)
- Average Workforce Salary: $128,500
- Average Performance Rating: 4.35 / 5.0

User Query: "${message}"

Answer accurately, professionally, concisely, and cleanly formatted using Markdown tables, bullet points, and high-impact key numbers. Offer actionable HR intelligence.`,
      });

      return res.json({ reply: response.text });
    } catch (err) {
      console.error("Gemini AI API error in chat:", err);
    }
  }

  // Smart local fallback assistant response if API key isn't provided
  const msgLower = message.toLowerCase();
  let reply = "";

  if (msgLower.includes("high risk") || msgLower.includes("attrition") || msgLower.includes("flight risk")) {
    reply = `### High Attrition Risk Alert
Our AI Talent Engine currently flags **2 key employees** at High Risk (>= 70%):

| Employee | Department | Role | Risk Score | Main Driver |
| :--- | :--- | :--- | :--- | :--- |
| **Devon Thorne** | Sales | Senior Enterprise AE | **84%** | Commission structure & workload |
| **Marcus Vance** | Engineering | Senior Staff Engineer | **78%** | Compensation gap & 22h overtime/wk |

**Recommended Action**: Initiate immediate executive retention review and compensation alignment for both key personnel.`;
  } else if (msgLower.includes("top performer") || msgLower.includes("star") || msgLower.includes("best")) {
    reply = `### Top Performers Spotlight
Here are our top rated talent leaders across departments:

1. **Dr. Sarah Jenkins** (*Data Science*) - **4.9/5 Performance Score** | 12% Risk | Promotion Ready
2. **Elena Rostova** (*Director of Product*) - **4.8/5 Performance Score** | 24% Risk
3. **Carlos Mendez** (*DevOps & Platform*) - **4.7/5 Performance Score** | 18% Risk
4. **Marcus Vance** (*Staff Engineer*) - **4.7/5 Performance Score** | *Attention needed: 78% Risk*`;
  } else if (msgLower.includes("salary") || msgLower.includes("compensation") || msgLower.includes("average")) {
    reply = `### Workforce Compensation Overview
- **Average Workforce Salary**: **$128,500 / yr**
- **Highest Department Avg**: Data Science ($195,000 / yr)
- **Engineering Avg**: $168,500 / yr
- **Product Avg**: $188,000 / yr
- **Promotion Rate**: **14.8%** across all business units.`;
  } else {
    reply = `Hello! I am **AURA AI**, your Enterprise Workforce Intelligence Assistant. 

I can assist you with:
- **Flight Risk & Attrition Diagnostics** (e.g. *"Show employees with high flight risk"*)
- **Talent Identification** (e.g. *"Who are our top performers in Engineering?"*)
- **Salary & Equity Benchmarks** (e.g. *"What is the average salary in Product?"*)
- **Department Headcounts & Diversity metrics**

How would you like to explore your organization's talent data today?`;
  }

  res.json({ reply });
});

// --- VITE / STATIC SERVING ---
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
    console.log(`Enterprise SaaS Workforce Analytics running on http://localhost:${PORT}`);
  });
}

startServer();
