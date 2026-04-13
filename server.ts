import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { retrieve } from "./src/lib/rag/rag-retriever";
import { formatCitation } from "./src/lib/rag/citation-engine";
import { generateHandoff } from "./src/lib/rag/handoff-engine";
import { logAudit, getMetrics, getAuditLogs } from "./src/lib/rag/audit-logger";
import { getKbStatus } from "./src/lib/rag/kb-manager";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/chat", async (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required" });

    const results = retrieve(query);
    const topResult = results[0];

    // RAG Rules: Score < 0.75 or Expired -> No evidence
    if (!topResult || topResult.score < 0.75 || topResult.status === "expired") {
      const reason = !topResult || topResult.score < 0.75 ? "no_evidence" : "expired_doc";
      const handoff = generateHandoff(query, results, reason);
      
      logAudit({
        query,
        docs_retrieved: results.map(r => ({ id: r.document.id, score: r.score, status: r.status })),
        citation_generated: null,
        escalated: true,
        escalation_reason: reason
      });

      return res.json({
        answer: "No he encontrado información sobre esto en la documentación actual de Telefónica Empresas. ¿Te gustaría que derive tu consulta a un agente especializado que pueda revisarlo manualmente?",
        handoff,
        status: "escalated"
      });
    }

    // Valid result found
    const citation = formatCitation([topResult]);
    
    logAudit({
      query,
      docs_retrieved: results.map(r => ({ id: r.document.id, score: r.score, status: r.status })),
      citation_generated: citation,
      escalated: false,
      escalation_reason: null
    });

    res.json({
      answer: citation,
      status: "success",
      source: topResult.document
    });
  });

  app.get("/api/metrics", (req, res) => {
    res.json({
      metrics: getMetrics(),
      logs: getAuditLogs(),
      kbStatus: getKbStatus()
    });
  });

  // Vite middleware for development
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
