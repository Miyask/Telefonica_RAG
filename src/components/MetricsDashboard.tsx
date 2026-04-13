import React, { useState, useEffect } from "react";
import { Shield, AlertTriangle, CheckCircle, Clock, BarChart3, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { cn } from "../lib/utils";

export default function MetricsDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/metrics");
      const json = await res.json();
      setData(json);
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="p-8">Cargando métricas...</div>;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Auditoría RAG</h1>
          <p className="text-gray-500">Métricas de rendimiento y control de alucinaciones.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-mono text-gray-500">
          Status: <span className="text-green-600">ONLINE</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tasa de Cita</p>
                <p className="text-2xl font-bold">{data.metrics.citationRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tasa de Escalado</p>
                <p className="text-2xl font-bold">{data.metrics.handoffRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Consultas Totales</p>
                <p className="text-2xl font-bold">{data.metrics.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Docs en KB</p>
                <p className="text-2xl font-bold">{data.kbStatus.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* KB Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              Control de Vigencia Documental
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.kbStatus.map((doc: any) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{doc.title}</span>
                    <span className="text-[10px] text-gray-400 font-mono">{doc.id}</span>
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold uppercase",
                    doc.status === "valid" ? "bg-green-100 text-green-700" :
                    doc.status === "warning" ? "bg-amber-100 text-amber-700" :
                    "bg-red-100 text-red-700"
                  )}>
                    {doc.status === "expired" ? "Caducado" : `${doc.daysToExpiry} días`}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Audit Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-400" />
              Logs de Auditoría en Tiempo Real
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {data.logs.map((log: any) => (
                <div key={log.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-gray-900">"{log.query}"</span>
                    <span className="text-[10px] text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex gap-2">
                    {log.escalated ? (
                      <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">ESCALADO: {log.escalation_reason}</span>
                    ) : (
                      <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">CITA GENERADA</span>
                    )}
                  </div>
                  {log.docs_retrieved.length > 0 && (
                    <div className="text-[10px] text-gray-500">
                      Top Score: {(log.docs_retrieved[0].score * 100).toFixed(0)}% | Doc: {log.docs_retrieved[0].id}
                    </div>
                  )}
                </div>
              ))}
              {data.logs.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm italic">
                  No hay logs registrados todavía.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
