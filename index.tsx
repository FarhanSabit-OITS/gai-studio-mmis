
import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  LayoutDashboard, Store, Package, Users, ShieldCheck, Settings, LogOut, 
  MessageSquare, History, Ticket, Truck, Box, UserPlus, CreditCard, 
  Building2, Warehouse, Boxes, Map as MapIcon, HeartHandshake, LifeBuoy, 
  ShoppingBag, Bell, Search, User as UserIcon, Shield, Smartphone, Globe, 
  Save, AlertTriangle, CheckCircle2, DollarSign, Clock, AlertCircle, 
  BarChart3, LineChart, PieChart, Info, TrendingUp, Zap, Sparkles, 
  ArrowRight, LayoutGrid, ClipboardList, RefreshCw, ChevronDown, 
  ImageIcon, Trash2, Edit, Download, XCircle, Eye, Calendar, 
  Layers, QrCode, X, Printer, Share2, Camera, Lock, Briefcase, Building, 
  Wallet, ListFilter, ClipboardCheck, ArrowUpRight, ArrowDownLeft, 
  SlidersHorizontal, Tag, Navigation, ExternalLink, ThumbsUp, 
  MoreHorizontal, ShoppingCart, Award, Compass, Scan, FileText, FileCheck, 
  ChevronRight, ChevronLeft, Calculator, Hash, Plus, MapPin, Star, Wrench, ShieldAlert, ToggleLeft, ToggleRight, ArrowUpDown, Landmark
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, Cell, PieChart as RePieChart, Pie 
} from 'recharts';
import { GoogleGenAI, Type } from '@google/genai';

import { RevenueModule } from './components/dashboard/RevenueModule';
import { InventoryManagement } from './components/dashboard/InventoryManagement';
import { GateManagement } from './components/dashboard/GateManagement';

// --- TYPES ---

export type Role = 'SUPER_ADMIN' | 'MARKET_ADMIN' | 'COUNTER_STAFF' | 'VENDOR' | 'SUPPLIER' | 'USER';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
  kycStatus: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'NONE';
  mfaEnabled: boolean;
  profileImage?: string;
  settings?: {
    lowStockThreshold: number;
    criticalStockThreshold: number;
    notifications: { email: boolean; browser: boolean; sms: boolean; };
  };
}

// ... other types ... (restored from provided file)

// --- UI COMPONENTS ---

const Button = ({ children, onClick, variant = 'primary', className = '', loading = false, disabled = false, type = 'button' }: any) => {
  const variants: any = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50',
    ghost: 'text-slate-600 hover:bg-slate-100',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };
  return (
    <button type={type} disabled={disabled || loading} onClick={onClick} className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : children}
    </button>
  );
};

const Input = ({ label, type = 'text', placeholder, icon: Icon, value, onChange, multiline, className = '' }: any) => (
  <div className={`mb-4 ${className}`}>
    {label && <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-2 px-1">{label}</label>}
    <div className="relative group">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 z-10" />}
      {multiline ? (
        <textarea value={value} onChange={onChange} placeholder={placeholder} rows={4} className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3.5 bg-black text-white border-2 border-slate-800 rounded-2xl focus:border-indigo-600 transition-all outline-none text-sm font-bold shadow-xl`} />
      ) : (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3.5 bg-black text-white border-2 border-slate-800 rounded-2xl focus:border-indigo-600 transition-all outline-none text-sm font-bold shadow-xl`} />
      )}
    </div>
  </div>
);

const Card = ({ children, title, className = '', onClick }: any) => (
  <div onClick={onClick} className={`bg-white rounded-xl shadow-sm border border-slate-100 p-6 ${className}`}>
    {title && <h3 className="text-lg font-semibold mb-4 text-slate-800">{title}</h3>}
    {children}
  </div>
);

// ... feature components ...

const App = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [active, setActive] = useState('Home');

  const handleLogin = () => setUser({ id: 'u-1', name: 'James Mukasa', email: 'james@mmis.ug', role: 'SUPER_ADMIN', isVerified: true, kycStatus: 'APPROVED', mfaEnabled: true });

  if (!user) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6"><Card className="max-w-md w-full p-12 rounded-[56px] shadow-2xl border-none text-center bg-white"><div className="absolute top-0 left-0 w-full h-3 bg-indigo-600"></div><div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl ring-[12px] ring-indigo-50"><Store size={48} className="text-white"/></div><h1 className="text-4xl font-black uppercase mb-2 tracking-tighter">MMIS HUB</h1><p className="text-slate-400 font-bold text-[10px] tracking-[0.4em] uppercase mb-12">Regional Trade Logistics</p><Button onClick={handleLogin} className="w-full h-20 bg-slate-900 text-white font-black uppercase tracking-[0.3em] text-xs rounded-3xl hover:bg-indigo-600 transition-all">Authorize Terminal</Button></Card></div>
  );

  const Sidebar = ({ user, active, setActive, onLogout }: any) => {
    const items = [
      { n: 'Home', i: LayoutDashboard },
      { n: 'Revenue Hub', i: Landmark, r: ['SUPER_ADMIN', 'MARKET_ADMIN'] },
      { n: 'Inventory Control', i: Boxes, r: ['SUPER_ADMIN', 'MARKET_ADMIN', 'VENDOR', 'SUPPLIER'] },
      { n: 'Gate Management', i: Truck, r: ['SUPER_ADMIN', 'MARKET_ADMIN', 'COUNTER_STAFF'] },
      { n: 'Suppliers Network', i: HeartHandshake },
      { n: 'Tickets & Support', i: LifeBuoy },
      { n: 'Settings', i: Settings },
    ].filter(it => !it.r || it.r.includes(user.role) || user.role === 'SUPER_ADMIN');

    return (
      <aside className="w-80 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 z-50 shadow-2xl">
        <div className="p-10 flex items-center gap-5 shrink-0"><div className="w-12 h-12 bg-indigo-600 rounded-[18px] flex items-center justify-center shadow-2xl"><Store className="text-white" size={28} /></div><h1 className="text-3xl font-black uppercase tracking-tighter">MMIS</h1></div>
        <nav className="flex-1 px-6 space-y-2 overflow-y-auto custom-scrollbar">{items.map(it => (
          <button key={it.n} onClick={() => setActive(it.n)} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.2em] ${active === it.n ? 'bg-indigo-600 text-white shadow-2xl scale-105' : 'text-slate-500 hover:bg-slate-50'}`}><it.i size={20}/>{it.n}</button>
        ))}</nav>
        <div className="p-6 border-t border-slate-50"><button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-4 text-red-500 hover:bg-red-50 rounded-2xl font-black text-[10px] uppercase tracking-widest"><LogOut size={22}/> Logout Node</button></div>
      </aside>
    );
  };

  const render = () => {
    switch (active) {
      case 'Home': return <Home user={user} />;
      case 'Revenue Hub': return <RevenueModule />;
      case 'Inventory Control': return <InventoryManagement user={user} />;
      case 'Gate Management': return <GateManagement />;
      default: return <Home user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 antialiased">
      <Sidebar user={user} active={active} setActive={setActive} onLogout={() => setUser(null)} />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Header user={user} onLogout={() => setUser(null)} />
        <main className="p-12 max-w-7xl mx-auto w-full">{render()}</main>
        <footer className="p-12 text-center border-t border-slate-100"><p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">© MMIS v2.5 PRE-RELEASE • TEVAS UG</p></footer>
      </div>
    </div>
  );
};

const Header = ({ user, onLogout }: any) => (
  <header className="h-24 bg-white/70 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-12 border-b border-slate-50 shadow-sm">
    <div className="flex items-center gap-4"><Search className="text-slate-400" size={20}/><input placeholder="Search global ledger..." className="bg-transparent outline-none text-sm font-bold text-slate-800 w-64"/></div>
    <div className="flex items-center gap-6"><button className="p-3 text-slate-500 hover:bg-slate-100 rounded-full transition-all relative"><Bell size={24}/><span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-600 rounded-full border-[3px] border-white animate-ping"></span></button><div className="text-right"><p className="text-xs font-black uppercase tracking-tight">{user.name}</p><p className="text-[9px] font-black text-indigo-600 uppercase mt-1.5">{user.role}</p></div><div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black shadow-lg ring-4 ring-slate-100">{user.name.charAt(0)}</div></div>
  </header>
);

const Home = ({ user }: any) => (
    <div className="space-y-6">
        <div className="bg-slate-900 rounded-[48px] p-12 text-white flex flex-col lg:flex-row justify-between items-center shadow-2xl relative overflow-hidden">
            <div className="z-10">
                <h2 className="text-5xl font-black mb-4 uppercase tracking-tighter">Welcome, {user.name}</h2>
                <p className="text-indigo-300 text-xl font-medium italic">Regional commerce nodes are currently performing at peak capacity.</p>
            </div>
            <div className="bg-white/10 p-10 rounded-[40px] backdrop-blur-md z-10 mt-10 lg:mt-0"><p className="text-[10px] font-black uppercase text-indigo-400 mb-2">Efficiency Index</p><p className="text-6xl font-black">98.4<span className="text-2xl opacity-20">%</span></p></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-8 rounded-[36px] bg-white border-l-8 border-l-indigo-600 shadow-xl">
               <TrendingUp size={32} className="text-indigo-600 mb-6"/>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Today's Revenue</p>
               <p className="text-3xl font-black">UGX 1.2M</p>
            </Card>
            <Card className="p-8 rounded-[36px] bg-white border-l-8 border-l-emerald-600 shadow-xl">
               <ShoppingBag size={32} className="text-emerald-600 mb-6"/>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Orders</p>
               <p className="text-3xl font-black">128 Units</p>
            </Card>
            <Card className="p-8 rounded-[36px] bg-white border-l-8 border-l-amber-500 shadow-xl">
               <Truck size={32} className="text-amber-500 mb-6"/>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Vehicle Log</p>
               <p className="text-3xl font-black">42 Flows</p>
            </Card>
        </div>
    </div>
);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
