/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  AlertCircle, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Database, 
  LayoutDashboard, 
  MessageSquare, 
  Pill, 
  RefreshCw, 
  Settings, 
  TrendingUp 
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

// --- Tipos ---
interface Dispensacion {
  id: number;
  medicamento: string;
  fecha: string;
  hora: string;
  estado: 'completado' | 'pendiente' | 'fallido';
  stock: number;
}

// --- Datos Simulados ---
const MOCK_DATA: Dispensacion[] = [
  { id: 1, medicamento: 'Paracetamol 500mg', fecha: '2024-05-20', hora: '08:00', estado: 'completado', stock: 24 },
  { id: 2, medicamento: 'Ibuprofeno 400mg', fecha: '2024-05-20', hora: '14:00', estado: 'completado', stock: 23 },
  { id: 3, medicamento: 'Paracetamol 500mg', fecha: '2024-05-20', hora: '20:00', estado: 'completado', stock: 22 },
  { id: 4, medicamento: 'Paracetamol 500mg', fecha: '2024-05-21', hora: '08:00', estado: 'completado', stock: 21 },
  { id: 5, medicamento: 'Ibuprofeno 400mg', fecha: '2024-05-21', hora: '14:00', estado: 'fallido', stock: 21 },
  { id: 6, medicamento: 'Paracetamol 500mg', fecha: '2024-05-21', hora: '20:00', estado: 'completado', stock: 20 },
];

export default function App() {
  const [history, setHistory] = useState<Dispensacion[]>(MOCK_DATA);
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'ai'>('dashboard');

  // Inicializar Gemini
  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' }), []);

  const analyzeWithAI = async () => {
    setIsAnalyzing(true);
    try {
      const prompt = `Analiza los siguientes datos de un dispensador de medicamentos IoT y da recomendaciones breves en español: ${JSON.stringify(history)}. Enfócate en la adherencia del paciente y alertas de stock.`;
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ parts: [{ text: prompt }] }],
      });
      setAnalysis(response.text || 'No se pudo generar el análisis.');
    } catch (error) {
      console.error("Error con Gemini:", error);
      setAnalysis("Error al conectar con la IA. Por favor, verifica tu API Key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const stats = {
    total: history.length,
    completados: history.filter(h => h.estado === 'completado').length,
    fallidos: history.filter(h => h.estado === 'fallido').length,
    stockActual: history[history.length - 1]?.stock || 0
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 p-6 hidden lg:block">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Pill className="text-white w-6 h-6" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">SmartMed</h1>
        </div>

        <nav className="space-y-2">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<Calendar size={20} />} 
            label="Historial" 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
          />
          <NavItem 
            icon={<MessageSquare size={20} />} 
            label="Análisis IA" 
            active={activeTab === 'ai'} 
            onClick={() => setActiveTab('ai')} 
          />
          <div className="pt-4 mt-4 border-t border-slate-100">
            <NavItem icon={<Settings size={20} />} label="Configuración" />
          </div>
        </nav>

        <div className="absolute bottom-8 left-6 right-6">
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm mb-1">
              <Activity size={16} />
              Sistema Online
            </div>
            <p className="text-xs text-emerald-600">Arduino conectado vía Serial</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {activeTab === 'dashboard' && 'Resumen General'}
              {activeTab === 'history' && 'Registro de Dispensación'}
              {activeTab === 'ai' && 'Análisis Inteligente'}
            </h2>
            <p className="text-slate-500 text-sm">Monitoreo en tiempo real del paciente</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <RefreshCw size={20} className="text-slate-400" />
          </button>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Dosis Totales" value={stats.total} icon={<Database className="text-blue-500" />} />
              <StatCard title="Completadas" value={stats.completados} icon={<CheckCircle2 className="text-emerald-500" />} />
              <StatCard title="Fallidas" value={stats.fallidos} icon={<AlertCircle className="text-rose-500" />} />
              <StatCard title="Stock Restante" value={stats.stockActual} icon={<TrendingUp className="text-amber-500" />} />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Activity size={18} className="text-emerald-500" />
                  Nivel de Stock (Sensor Ultrasónico)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history}>
                      <defs>
                        <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="hora" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="stock" stroke="#10b981" fillOpacity={1} fill="url(#colorStock)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-blue-500" />
                  Próxima Dosis
                </h3>
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <Clock size={40} className="text-blue-600" />
                  </div>
                  <p className="text-slate-500 text-sm mb-1">Programada para hoy</p>
                  <p className="text-2xl font-bold text-slate-800">20:00 PM</p>
                  <p className="text-blue-600 font-medium mt-2">Paracetamol 500mg</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-bottom border-slate-200">
                  <th className="p-4 font-semibold text-slate-600 text-sm">ID</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Medicamento</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Fecha/Hora</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Estado</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Stock</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm text-slate-500">#{item.id}</td>
                    <td className="p-4 text-sm font-medium text-slate-800">{item.medicamento}</td>
                    <td className="p-4 text-sm text-slate-600">{item.fecha} {item.hora}</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.estado === 'completado' ? 'bg-emerald-100 text-emerald-700' : 
                        item.estado === 'fallido' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.estado.charAt(0).toUpperCase() + item.estado.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{item.stock} uds</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Análisis de Adherencia con IA</h3>
              <p className="text-slate-500 mb-8">
                Utilizamos Google Gemini para analizar los patrones de dispensación y detectar posibles riesgos en el tratamiento.
              </p>
              <button 
                onClick={analyzeWithAI}
                disabled={isAnalyzing}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
              >
                {isAnalyzing ? <RefreshCw className="animate-spin" size={20} /> : <TrendingUp size={20} />}
                {isAnalyzing ? 'Analizando...' : 'Generar Recomendaciones'}
              </button>
            </div>

            <AnimatePresence>
              {analysis && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl"
                >
                  <div className="flex items-center gap-2 text-emerald-800 font-bold mb-4">
                    <CheckCircle2 size={20} />
                    Informe de la IA
                  </div>
                  <p className="text-emerald-900 leading-relaxed whitespace-pre-wrap">
                    {analysis}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}

// --- Subcomponentes ---

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-emerald-50 text-emerald-700 font-semibold' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
      }`}
    >
      {icon}
      <span>{label}</span>
      {active && <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />}
    </button>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-lg">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
      </div>
    </div>
  );
}
