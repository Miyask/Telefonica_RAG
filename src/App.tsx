import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { MessageSquare, BarChart3, ShieldAlert, LayoutDashboard } from "lucide-react";
import Chat from "./components/Chat";
import MetricsDashboard from "./components/MetricsDashboard";
import AgentPanel from "./components/AgentPanel";
import { cn } from "./lib/utils";

function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Chat Asistente", icon: MessageSquare },
    { path: "/agent", label: "Panel Agente", icon: ShieldAlert },
    { path: "/metrics", label: "Auditoría RAG", icon: BarChart3 },
  ];

  return (
    <nav className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#0066FF] rounded flex items-center justify-center">
          <LayoutDashboard className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-gray-900 tracking-tight">Telefónica <span className="text-[#0066FF]">Empresas</span></span>
      </div>
      
      <div className="flex gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-[#0066FF]/10 text-[#0066FF]" 
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-gray-900">Ariadna RT</p>
          <p className="text-[10px] text-gray-400">RAG Engineer</p>
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded-full border border-gray-300" />
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-sans text-gray-950">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/agent" element={<AgentPanel />} />
            <Route path="/metrics" element={<MetricsDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
