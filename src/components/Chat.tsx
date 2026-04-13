import React, { useState, useEffect, useRef } from "react";
import { Send, Search, FileText, User, Bot, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Card, CardContent } from "./ui/Card";
import { cn } from "../lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  source?: any;
  status?: "searching" | "citing" | "no_evidence" | "handoff";
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const FREQUENT_QUESTIONS = [
    { label: "Avería en fibra óptica", query: "avería fibra óptica reiniciar" },
    { label: "Configurar VPN", query: "configurar vpn corporativa 2fa" },
    { label: "Tarifas Móviles 2026", query: "tarifa ilimitada total 5g precio" },
    { label: "Roaming Internacional", query: "roaming zona 1 ue eeuu" },
    { label: "Desviar llamadas", query: "desviar llamadas centralita virtual" },
    { label: "Cambio de cuenta", query: "cambio cuenta bancaria sepa" },
  ];

  const handleSend = async (overrideQuery?: string) => {
    const queryToSend = overrideQuery || input;
    if (!queryToSend.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: queryToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!overrideQuery) setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryToSend }),
      });
      const data = await response.json();

      const assistantMsg: Message = {
        role: "assistant",
        content: data.answer,
        source: data.source,
        status: data.status === "escalated" ? "no_evidence" : "citing"
      };

      setMessages(prev => [...prev, assistantMsg]);
      if (data.source) setSelectedDoc(data.source);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-50">
      {/* Chat Area */}
      <div className="flex flex-col flex-1 border-r border-gray-200 bg-white">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-16 h-16 bg-[#0066FF]/10 rounded-full flex items-center justify-center">
                <Bot className="w-8 h-8 text-[#0066FF]" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Asistente RAG Telefónica Empresas</h2>
              <p className="text-gray-500 max-w-md">
                Consulta la base de conocimientos oficial. Citas obligatorias y control de vigencia garantizados.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg mt-4">
                {FREQUENT_QUESTIONS.map((fq, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="text-xs justify-start h-auto py-3 px-4 border-gray-200 hover:border-[#0066FF] hover:bg-[#0066FF]/5"
                    onClick={() => handleSend(fq.query)}
                  >
                    <Search className="w-3 h-3 mr-2 text-[#0066FF]" />
                    {fq.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-4 max-w-[85%]",
                  msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  msg.role === "user" ? "bg-gray-100" : "bg-[#0066FF]/10"
                )}>
                  {msg.role === "user" ? <User className="w-4 h-4 text-gray-600" /> : <Bot className="w-4 h-4 text-[#0066FF]" />}
                </div>
                <div className="space-y-2">
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed",
                    msg.role === "user" 
                      ? "bg-[#0066FF] text-white rounded-tr-none" 
                      : "bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200"
                  )}>
                    {msg.content}
                  </div>
                  
                  {msg.status === "citing" && (
                    <div className="flex items-center gap-2 text-[10px] font-medium text-[#0066FF] uppercase tracking-wider">
                      <ShieldCheck className="w-3 h-3" />
                      Información Verificada
                    </div>
                  )}

                  {msg.status === "no_evidence" && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-[10px] font-medium text-amber-600 uppercase tracking-wider">
                        <AlertCircle className="w-3 h-3" />
                        Sin Evidencia Documental
                      </div>
                      <Button variant="outline" size="sm" className="w-fit text-xs h-8">
                        Derivar a Agente <ArrowRight className="ml-2 w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <div className="flex gap-4 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-gray-100" />
              <div className="space-y-2">
                <div className="h-10 w-48 bg-gray-100 rounded-2xl" />
                <div className="h-4 w-24 bg-gray-50 rounded" />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-2 max-w-4xl mx-auto">
            <Input
              placeholder="Escribe tu consulta sobre servicios de Telefónica..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={isLoading}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] text-center text-gray-400 mt-2">
            Prototipo RAG v1.0. Solo información documentada.
          </p>
        </div>
      </div>

      {/* Side Panel */}
      <div className="w-80 bg-gray-50 p-6 overflow-y-auto hidden lg:block">
        <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#0066FF]" />
          FUENTE DOCUMENTADA
        </h3>

        {selectedDoc ? (
          <div className="space-y-4">
            <Card className="border-[#0066FF]/20 bg-white">
              <CardContent className="p-4 space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Título</label>
                  <p className="text-sm font-semibold text-gray-900">{selectedDoc.title}</p>
                </div>
                <div className="flex justify-between">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Versión</label>
                    <p className="text-xs font-mono">v{selectedDoc.version}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Categoría</label>
                    <p className="text-xs">{selectedDoc.category}</p>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Propietario</label>
                  <p className="text-xs">{selectedDoc.owner}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Vigencia</label>
                  <p className="text-xs text-green-600 font-medium">
                    Hasta {new Date(selectedDoc.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Extractos Clave</label>
              {selectedDoc.chunks.map((chunk: string, i: number) => (
                <div key={i} className="p-3 bg-white border border-gray-200 rounded-md text-xs text-gray-600 italic">
                  "{chunk}"
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-2 opacity-40">
            <Search className="w-8 h-8" />
            <p className="text-xs">Realiza una consulta para ver la fuente</p>
          </div>
        )}
      </div>
    </div>
  );
}
