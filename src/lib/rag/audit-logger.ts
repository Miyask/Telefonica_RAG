export interface AuditLog {
  id: string;
  timestamp: string;
  query: string;
  docs_retrieved: {
    id: string;
    score: number;
    status: string;
  }[];
  citation_generated: string | null;
  escalated: boolean;
  escalation_reason: string | null;
}

const logs: AuditLog[] = [];

export function logAudit(log: Omit<AuditLog, "id" | "timestamp">) {
  const newLog: AuditLog = {
    ...log,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString()
  };
  logs.push(newLog);
  return newLog;
}

export function getAuditLogs() {
  return [...logs].reverse();
}

export function getMetrics() {
  const total = logs.length;
  if (total === 0) return { citationRate: 0, handoffRate: 0, total };

  const citations = logs.filter(l => l.citation_generated !== null).length;
  const handoffs = logs.filter(l => l.escalated).length;

  return {
    citationRate: (citations / total) * 100,
    handoffRate: (handoffs / total) * 100,
    total
  };
}
