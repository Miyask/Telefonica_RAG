import type { RetrievalResult } from "./rag-retriever";

export interface HandoffPayload {
  handoff_id: string;
  timestamp: string;
  user_query: string;
  retrieved_docs: {
    title: string;
    version: string;
    relevance: number;
    status: "valid" | "expired";
  }[];
  escalation_reason: "no_evidence" | "expired_doc" | "conflict" | "user_request";
  client_context: {
    id?: string;
    service?: string;
    history?: string;
  };
  summary_for_agent: string;
}

export function generateHandoff(
  query: string, 
  results: RetrievalResult[], 
  reason: HandoffPayload["escalation_reason"]
): HandoffPayload {
  const id = `HO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  
  const summaryMap = {
    no_evidence: "No se encontró información relevante en la base de conocimientos.",
    expired_doc: "La información encontrada está caducada y requiere revisión manual.",
    conflict: "Se detectaron discrepancias entre múltiples documentos de la base de conocimientos.",
    user_request: "El usuario solicitó hablar con un agente humano."
  };

  return {
    handoff_id: id,
    timestamp: new Date().toISOString(),
    user_query: query,
    retrieved_docs: results.map(r => ({
      title: r.document.title,
      version: r.document.version,
      relevance: r.score,
      status: r.status
    })),
    escalation_reason: reason,
    client_context: {
      service: results.length > 0 ? results[0].document.category : "General"
    },
    summary_for_agent: `${summaryMap[reason]} Consulta: "${query}"`
  };
}
