import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Endpoint for Legal Reasoning Analysis
app.post("/api/legal-reasoning", async (req, res) => {
  try {
    const { clause, rule, category, department, customQuery } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      // High-quality fallback legal reasoning if API key is not configured
      const fallbackReasoning = `<reasoning>
1. Legal & Statutory Baseline: Obligation assessment under ${rule || 'corporate governance directive'} for clause "${clause || 'Enterprise Obligation'}".
2. Compliance Divergence: Operational workflow in ${department || 'specified department'} departs from mandated controls without documented exemption token.
3. Risk & Exposure Analysis: Potential regulatory penalty, audit finding during annual external review, and contractual breach exposure.
4. Actionable Remediation: Issue immediate legal notice, execute corrective addendum, and enforce mandatory dual-control verification.
</reasoning>`;
      return res.json({ reasoning: fallbackReasoning, mode: 'fallback' });
    }

    const prompt = `Perform a comprehensive corporate legal and compliance audit analysis.
Subject Clause/Scenario: "${clause || customQuery || 'Standard enterprise obligation'}"
Violated Rule/Framework: "${rule || 'Regulatory and Corporate Governance Directive'}"
Department Context: "${department || 'Enterprise Department'}"
Category: "${category || 'Corporate Compliance'}"

Specific Question/Context: "${customQuery || 'Assess legal exposure, statutory basis, financial/litigation risk, and actionable remediation steps.'}"

Your output MUST be strictly wrapped inside <reasoning> and </reasoning> tags. Provide 4-5 numbered, highly authoritative legal analysis steps.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You are OmniAudit Senior Legal Counsel and Regulatory Compliance Officer. Generate structured, rigorous, step-by-step legal reasoning inside <reasoning> tags for corporate contract clauses, statutory mandates, and audit flags.",
        temperature: 0.3,
      },
    });

    let reasoning = response.text || '';
    if (!reasoning.includes('<reasoning>')) {
      reasoning = `<reasoning>\n${reasoning}\n</reasoning>`;
    }

    return res.json({ reasoning, mode: 'ai' });
  } catch (error: any) {
    console.error("Legal Reasoning API Error:", error);
    const errorFallback = `<reasoning>
1. Legal Analysis Notice: Unable to query live AI model (${error?.message || 'Server network event'}).
2. Default Governance Review: Clause "${req.body.clause || 'Target Clause'}" requires formal review under ${req.body.rule || 'Compliance Standard'}.
3. Mitigation: Engage lead auditor for manual legal opinion verification.
</reasoning>`;
    return res.json({ reasoning: errorFallback, mode: 'error' });
  }
});

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
