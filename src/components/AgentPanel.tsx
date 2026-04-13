import React, { useState, useEffect } from "react";
import { PhoneCall, User, Clock, MessageSquare, ExternalLink, ChevronRight, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { cn } from "../lib/utils";

export default function AgentPanel() {
  const [handoffs, setHandoffs] = useState<any[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch("/api/metrics");
      const json = await res.json();
      const escalatedLogs = json.logs.filter((l: any) => l.escalated);
      setHandoffs(escalatedLogs);
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <PhoneCall className="w-8 h-8 text-[#0066FF]" />
          Panel de Agente Especializado
        </h1>
        <p className="text-gray-500">Gestión de consultas escaladas por falta de evidencia o caducidad.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-gray-700">Casos Pendientes ({handoffs.length})</h2>
          {handoffs.map((ho: any) => (
            <Card key={ho.id} className="hover:border-[#0066FF] transition-colors cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Cliente ID: CL-9921</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Escalado hace 2 min</p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-1 rounded uppercase",
                    ho.escalation_reason === "expired_doc" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                  )}>
                    {ho.escalation_reason}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Consulta del Usuario</p>
                  <p className="text-sm text-gray-800 italic">"{ho.query}"</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                      <MessageSquare className="w-3 h-3" /> 1 Mensaje
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                      <Clock className="w-3 h-3" /> Prioridad Alta
                    </div>
                  </div>
                  <Button size="sm" className="group-hover:translate-x-1 transition-transform">
                    Atender Caso <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {handoffs.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No hay casos pendientes de escalado.</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-[#0066FF] text-white border-none">
            <CardHeader>
              <CardTitle className="text-lg">Resumen de Turno</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Casos Resueltos</span>
                <span className="text-xl font-bold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Tiempo Medio</span>
                <span className="text-xl font-bold">4.2 min</span>
              </div>
              <div className="h-px bg-white/20 my-2" />
              <Button variant="outline" className="w-full bg-white/10 border-white/20 hover:bg-white/20 text-white">
                Ver Reporte Detallado
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm uppercase text-gray-400">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-xs">
                <ExternalLink className="w-3 h-3 mr-2" /> Base de Conocimientos
              </Button>
              <Button variant="ghost" className="w-full justify-start text-xs">
                <ExternalLink className="w-3 h-3 mr-2" /> Historial de Facturación
              </Button>
              <Button variant="ghost" className="w-full justify-start text-xs">
                <ExternalLink className="w-3 h-3 mr-2" /> CRM Telefónica
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
