/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
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
  TrendingUp,
  Stethoscope
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

// --- Tipos ---
interface Diagnostico {
  id: number;
  enfermedad: string;
  pastilla: string;
  fecha: string;
  hora: string;
  recomendacionIA?: string;
}

// --- Datos Simulados ---
const MOCK_DIAGNOSTICS: Diagnostico[] = [
  { id: 1, enfermedad: 'Gripe Común', pastilla: 'Paracetamol', fecha: '2024-05-20', hora: '08:00', recomendacionIA: 'Mantener hidratación.' },
  { id: 2, enfermedad: 'Alergia', pastilla: 'Loratadina', fecha: '2024-05-20', hora: '14:00' },
  { id: 3, enfermedad: 'Gripe Común', pastilla: 'Paracetamol', fecha: '2024-05-21', hora: '09:30' },
];

const FREQUENCY_DATA = [
  { name: 'Gripe', count: 12 },
  { name: 'Alergia', count: 5 },
  { name: 'Infección', count: 3 },
];

export default function App() {
  const [diagnostics, setDiagnostics] = useState<Diagnostico[]>(MOCK_DIAGNOSTICS);
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'ai'>('dashboard');

  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' }), []);

  const analyzeWithAI = async () => {
    setIsAnalyzing(true);
    try {
      const prompt = `Analiza estos diagnósticos de un sistema IoT y da recomendaciones médicas breves: ${JSON.stringify(diagnostics)}.`;
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ parts: [{ text: prompt }] }],
      });
      setAnalysis(response.text || 'No se pudo generar el análisis.');
    } catch (error) {
      setAnalysis("Error al conectar con la IA.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 p-6 hidden lg:block">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Stethoscope className="text-white w-6 h-6" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">RobotMedic</h1>
        </div>

        <nav className="space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Calendar size={20} />} label="Historial" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
          <NavItem icon={<MessageSquare size={20} />} label="Análisis IA" active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} />
        </nav>

        <div className="absolute bottom-8 left-6 right-6">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm mb-1">
              <Activity size={16} />
              Sistema Activo
            </div>
            <p className="text-xs text-blue-600">Arduino: Puerto COM3</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {activeTab === 'dashboard' && 'Panel de Control'}
              {activeTab === 'history' && 'Historial de Diagnósticos'}
              {activeTab === 'ai' && 'Recomendaciones IA'}
            </h2>
            <p className="text-slate-500 text-sm">Escuela de Ingeniería en Mecatrónica - TEC</p>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Diagnósticos" value={diagnostics.length} icon={<Database className="text-blue-500" />} />
              <StatCard title="Última Enfermedad" value={diagnostics[diagnostics.length-1].enfermedad} icon={<AlertCircle className="text-amber-500" />} />
              <StatCard title="Pastilla Entregada" value={diagnostics[diagnostics.length-1].pastilla} icon={<Pill className="text-emerald-500" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp size={18} className="text-blue-500" />
                  Frecuencia de Enfermedades
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={FREQUENCY_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{fill: '#f8fafc'}} />
                      <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Activity size={18} className="text-emerald-500" />
                  Estado del Dispensador
                </h3>
                <div className="flex flex-col items-center justify-center h-64">
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-4"
                  >
                    <CheckCircle2 size={48} className="text-emerald-500" />
                  </motion.div>
                  <p className="text-lg font-bold">Carrusel Listo</p>
                  <p className="text-slate-500 text-sm">Posición actual: Compartimento 1</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 text-sm font-semibold text-slate-600">Fecha/Hora</th>
                  <th className="p-4 text-sm font-semibold text-slate-600">Diagnóstico</th>
                  <th className="p-4 text-sm font-semibold text-slate-600">Medicamento</th>
                  <th className="p-4 text-sm font-semibold text-slate-600">Recomendación IA</th>
                </tr>
              </thead>
              <tbody>
                {diagnostics.map((d) => (
                  <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-4 text-sm text-slate-500">{d.fecha} {d.hora}</td>
                    <td className="p-4 text-sm font-medium">{d.enfermedad}</td>
                    <td className="p-4 text-sm text-slate-600">{d.pastilla}</td>
                    <td className="p-4 text-sm italic text-slate-400">{d.recomendacionIA || 'Pendiente...'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
              <MessageSquare size={48} className="text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Generar Informe de Salud</h3>
              <p className="text-slate-500 mb-6">Analiza el historial para detectar patrones de uso frecuente.</p>
              <button 
                onClick={analyzeWithAI}
                disabled={isAnalyzing}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 mx-auto"
              >
                {isAnalyzing ? <RefreshCw className="animate-spin" size={18} /> : <TrendingUp size={18} />}
                {isAnalyzing ? 'Analizando...' : 'Analizar Historial'}
              </button>
            </div>
            {analysis && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p className="text-blue-900 leading-relaxed">{analysis}</p>
              </motion.div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}>
      {icon} <span>{label}</span>
    </button>
  );
}

function StatCard({ title, value, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="mb-4">{icon}</div>
      <p className="text-slate-500 text-sm">{title}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}
