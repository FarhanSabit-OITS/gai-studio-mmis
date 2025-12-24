
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
  ChevronRight, ChevronLeft, Calculator, Hash, Plus, MapPin, Star, Wrench, ShieldAlert, ToggleLeft, ToggleRight, ArrowUpDown
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, Cell, PieChart as RePieChart, Pie 
} from 'recharts';
import { GoogleGenAI, Type } from '@google/genai';

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

export interface Vendor {
  id: string;
  name: string;
  email: string;
  category: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  products: number;
  joinedDate: string;
  city: string;
  market: string;
  rentDue: number;
  vatDue: number;
  level?: string;
  section?: string;
  storeType?: 'STALL' | 'KIOSK' | 'SHOP' | 'WAREHOUSE';
  ownershipType?: 'LEASED' | 'OWNED' | 'SUB-LEASED';
}

export interface TransactionRecord {
  id: string;
  vendorId: string;
  vendorName: string;
  date: string;
  amount: number;
  type: 'RENT' | 'VAT' | 'SERVICE' | 'LICENSE';
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  category: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  warehouseLocation: string;
  suppliedItemsCount: number;
  rating: number;
  totalRatings: number;
  kycValidated: boolean;
  onboardingDate: string;
  showcase?: { id: string; name: string; description: string; priceRange: string; category: string; }[];
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  vendor: string;
  stock: number;
  price: number;
  status: 'HEALTHY' | 'LOW' | 'CRITICAL' | 'PENDING_APPROVAL';
  category: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  context: 'SUPPORT' | 'ASSET' | 'SUPPLY' | 'COMPLAINT';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  creatorName: string;
  createdAt: string;
  attachmentUrl?: string; 
  assetType?: string;
  assignedToId?: string;
  assignedToName?: string;
}

export interface ManifestItem {
  id: string;
  vendorId: string;
  vendorName: string;
  itemName: string;
  qty: number;
  estPrice: number;
  paid: boolean;
}

export interface BridgeLogistics {
  id: string;
  dispatchDate: string;
  status: 'PREPARING' | 'DISPATCHED' | 'PURCHASING' | 'RETURNING' | 'ARRIVED';
  capacity: number;
  items: ManifestItem[];
}

// --- CONSTANTS ---

const ROLES_HIERARCHY: Record<Role, Role[]> = {
  SUPER_ADMIN: ['MARKET_ADMIN', 'COUNTER_STAFF', 'VENDOR', 'SUPPLIER', 'USER'],
  MARKET_ADMIN: ['COUNTER_STAFF', 'VENDOR', 'USER'],
  COUNTER_STAFF: ['USER'],
  VENDOR: ['USER'],
  SUPPLIER: ['USER'],
  USER: [],
};

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

// --- FEATURE COMPONENTS ---

const PaymentGateway = ({ amount, itemDescription, onSuccess, onCancel }: any) => {
  const [step, setStep] = useState<'DETAILS' | 'PROCESSING' | 'SUCCESS'>('DETAILS');
  const handlePay = async () => {
    setStep('PROCESSING');
    await new Promise(r => setTimeout(r, 2000));
    setStep('SUCCESS');
    setTimeout(() => onSuccess(), 1500);
  };

  if (step === 'PROCESSING') return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-[300] flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center py-12"><div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div><h2 className="text-2xl font-bold text-slate-900 uppercase">Syncing Ledger...</h2></Card>
    </div>
  );

  if (step === 'SUCCESS') return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-[300] flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center py-12"><CheckCircle2 className="mx-auto mb-6 text-emerald-500" size={60}/><h2 className="text-2xl font-bold text-emerald-600 uppercase">Payment Authorized</h2></Card>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[300] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2"><Card className="bg-indigo-600 text-white h-full p-10 rounded-[40px] border-none"><h3 className="text-2xl font-black mb-8 leading-tight">{itemDescription}</h3><div className="space-y-4 pt-8 border-t border-indigo-400"><div className="flex justify-between"><span>Amount Due</span><span className="font-mono text-xl">UGX {amount.toLocaleString()}</span></div></div></Card></div>
        <div className="lg:col-span-3"><Card className="h-full rounded-[40px] p-10 shadow-2xl"><h3 className="text-2xl font-black mb-8 uppercase">Authorization</h3><Input label="Registry Name" icon={UserIcon}/><Input label="Payment Sequence" icon={CreditCard}/><div className="flex gap-4 mt-8"><Button variant="secondary" className="flex-1" onClick={onCancel}>Abort</Button><Button className="flex-[2] h-14" onClick={handlePay}>Commit Payment</Button></div></Card></div>
      </div>
    </div>
  );
};

// --- VIEWS ---

const HomeView = ({ user, setActive, onLogout }: { user: UserProfile, setActive: (tab: string) => void, onLogout: () => void }) => {
  const [insights, setInsights] = useState('Gathering regional data...');
  useEffect(() => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: `Short 1-sentence trend for ${user.role} in Uganda e-commerce.` })
      .then(res => setInsights(res.text || 'Steady growth observed in local hubs.'));
  }, []);

  const routes = [
    { n: 'Markets', i: Building2, d: 'Admin Hub Registry' },
    { n: 'Vendors', i: Store, d: 'Directory & Dues' },
    { n: 'Suppliers Network', i: HeartHandshake, d: 'Bulk Fulfillment' },
    { n: 'Supply Requisitions', i: ShoppingBag, d: 'The Bridge Service' },
    { n: 'Inventory Control', i: Box, d: 'Stock Ledger' },
    { n: 'Gate Management', i: Truck, d: 'Security Terminal' },
    { n: 'Stock Counter', i: Boxes, d: 'Manifest Triage' },
    { n: 'Tickets & Support', i: LifeBuoy, d: 'Incident Case Files' },
    { n: 'Audit Logs', i: History, d: 'Security Events' },
    { n: 'Settings', i: Settings, d: 'Node Configuration' }
  ];

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      <div className="bg-slate-900 rounded-[48px] p-12 text-white flex flex-col lg:flex-row justify-between items-center shadow-2xl relative overflow-hidden">
        <div className="z-10 text-center lg:text-left">
          <h2 className="text-5xl font-black mb-4 uppercase tracking-tighter">Welcome, {user.name}</h2>
          <p className="text-indigo-300 text-xl font-medium italic mb-8">{insights}</p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <Button onClick={() => setActive('Tickets & Support')} variant="primary" className="h-12 px-6 bg-indigo-600">New Incident</Button>
            <Button onClick={() => setActive('Settings')} variant="secondary" className="!bg-white/10 !text-white !border-white/10">Configure Node</Button>
          </div>
        </div>
        <div className="bg-white/10 p-10 rounded-[40px] backdrop-blur-md z-10 mt-10 lg:mt-0"><p className="text-[10px] font-black uppercase text-indigo-400 mb-2">Efficiency Rating</p><p className="text-6xl font-black">98.4<span className="text-2xl opacity-20">%</span></p></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"></div>
      </div>

      <div>
        <div className="flex items-center gap-4 mb-8">
           <div className="h-px bg-slate-200 flex-1"></div>
           <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.4em]">GUI Navigation Hub</h3>
           <div className="h-px bg-slate-200 flex-1"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {routes.map(r => (
            <button 
              key={r.n}
              onClick={() => setActive(r.n)}
              className="group bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-indigo-200 transition-all text-left flex flex-col justify-between h-44"
            >
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                <r.i size={24} />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight">{r.n}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{r.d}</p>
              </div>
            </button>
          ))}
          <button 
            onClick={onLogout}
            className="group bg-slate-900 p-6 rounded-[32px] border-none shadow-xl hover:bg-indigo-600 transition-all text-left flex flex-col justify-between h-44"
          >
            <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center shadow-inner">
              <LogOut size={24} />
            </div>
            <div>
              <h4 className="font-black text-white text-sm uppercase tracking-tight">Logout</h4>
              <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mt-1">Auth Reset</p>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[{l:'Vendors', v:'42', i:Store}, {l:'Orders', v:'1.2k', i:Package}, {l:'Revenue', v:'84.2M', i:DollarSign}, {l:'Rating', v:'4.9', i:Star}].map(s => (
          <Card key={s.l} className="p-8 rounded-[36px] hover:shadow-xl transition-all group">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all"><s.i size={24}/></div>
            <p className="text-[10px] font-black text-slate-400 uppercase mt-6 mb-1">{s.l}</p><p className="text-2xl font-black">{s.v}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

const VendorView = ({ user }: { user: UserProfile }) => {
  const isVendor = user.role === 'VENDOR';
  const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'MARKET_ADMIN';
  const [activeTab, setActiveTab] = useState<'DIRECTORY' | 'FINANCIALS' | 'PRODUCTS'>(isVendor ? 'PRODUCTS' : 'DIRECTORY');
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [selectedQR, setSelectedQR] = useState<any>(null);
  const [payingVendor, setPayingVendor] = useState<any>(null);
  const [duesOnly, setDuesOnly] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [historyFilter, setHistoryFilter] = useState('ALL');
  const [sortConfig, setSortConfig] = useState<{ key: keyof TransactionRecord, direction: 'asc' | 'desc' } | null>(null);

  const [vendors, setVendors] = useState<Vendor[]>([
    { id: 'V-001', name: 'Global Tech', email: 'v1@mmis.ug', category: 'Electronics', status: 'ACTIVE', products: 12, joinedDate: '2023-10-12', city: 'Kampala', market: 'Owino', rentDue: 150000, vatDue: 20000, level: 'Ground', section: 'B' },
    { id: 'V-002', name: 'Fresh Hub', email: 'fresh@mmis.ug', category: 'Produce', status: 'ACTIVE', products: 45, joinedDate: '2024-01-05', city: 'Mbarara', market: 'Central', rentDue: 0, vatDue: 0, level: 'Stall', section: 'A' },
    { id: 'V-003', name: 'Zion Apparel', email: 'zion@mmis.ug', category: 'Clothing', status: 'INACTIVE', products: 8, joinedDate: '2024-02-15', city: 'Jinja', market: 'Main', rentDue: 300000, vatDue: 45000, level: 'Wing A', section: '12' },
  ]);

  const [transactions] = useState<TransactionRecord[]>([
    { id: 'TX-8291', vendorId: 'V-001', vendorName: 'Global Tech', date: '2024-05-15', amount: 150000, type: 'RENT', status: 'SUCCESS' },
    { id: 'TX-8292', vendorId: 'V-002', vendorName: 'Fresh Hub', date: '2024-05-14', amount: 20000, type: 'VAT', status: 'SUCCESS' },
    { id: 'TX-8293', vendorId: 'V-001', vendorName: 'Global Tech', date: '2024-05-10', amount: 5000, type: 'SERVICE', status: 'PENDING' },
    { id: 'TX-8294', vendorId: 'V-003', vendorName: 'Zion Apparel', date: '2024-05-08', amount: 45000, type: 'LICENSE', status: 'FAILED' },
  ]);

  const [products, setProducts] = useState<Product[]>([{ id: 'P-101', name: 'Basmati Rice', vendor: user.name, stock: 45, price: 120000, status: 'HEALTHY', category: 'Food' }]);
  const [showPForm, setShowPForm] = useState(false);
  const [pForm, setPForm] = useState({ name: '', price: '', stock: '', category: 'General' });

  const toggleVendorStatus = (v: Vendor) => {
    if (!isAdmin) return;
    const newStatus = v.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setVendors(vendors.map(item => item.id === v.id ? {...item, status: newStatus} : item));
    alert(`Node status updated: ${v.name} is now ${newStatus}`);
  };

  const filteredVendors = useMemo(() => {
    if (duesOnly) {
      return vendors.filter(v => (v.rentDue + v.vatDue) > 0);
    }
    return vendors;
  }, [vendors, duesOnly]);

  const sortedAndFilteredHistory = useMemo(() => {
    let data = transactions.filter(tx => {
      const matchSearch = tx.vendorName.toLowerCase().includes(historySearch.toLowerCase()) || tx.id.includes(historySearch);
      const matchType = historyFilter === 'ALL' || tx.type === historyFilter;
      return matchSearch && matchType;
    });

    if (sortConfig) {
      data.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [transactions, historySearch, historyFilter, sortConfig]);

  const handleSort = (key: keyof TransactionRecord) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const totals = useMemo(() => ({
    count: vendors.length,
    rent: vendors.reduce((acc, v) => acc + v.rentDue, 0),
    vat: vendors.reduce((acc, v) => acc + v.vatDue, 0)
  }), [vendors]);

  return (
    <div className="space-y-6">
      {payingVendor && <PaymentGateway amount={payingVendor.rentDue + payingVendor.vatDue} itemDescription={`Rent & VAT: ${payingVendor.name}`} onSuccess={() => {setVendors(vendors.map(v => v.id === payingVendor.id ? {...v, rentDue: 0, vatDue: 0} : v)); setPayingVendor(null);}} onCancel={() => setPayingVendor(null)} />}
      
      {selectedQR && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[400] flex items-center justify-center p-4">
          <Card className="max-w-sm w-full p-10 rounded-[48px] text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
            <button onClick={() => setSelectedQR(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X/></button>
            <div className="w-24 h-24 bg-slate-900 text-white rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <QrCode size={48} />
            </div>
            <h3 className="text-2xl font-black mb-2">{selectedQR.name}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Store ID: {selectedQR.id}</p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
              <p className="text-xs font-bold text-slate-500 mb-1 italic">Location Hash:</p>
              <p className="text-[10px] font-mono text-indigo-600 font-bold truncate">MMIS-{selectedQR.id}-{selectedQR.city.toUpperCase()}</p>
            </div>
            <Button className="w-full h-12 rounded-2xl font-black uppercase text-[10px]"><Printer size={16}/> Print Token</Button>
          </Card>
        </div>
      )}

      <div className="flex justify-between items-center pb-6 border-b border-slate-100">
        <h2 className="text-3xl font-black uppercase tracking-tight">{isVendor ? 'My Store' : 'Vendors Registry'}</h2>
        {isVendor && activeTab === 'PRODUCTS' && <Button onClick={() => setShowPForm(true)} className="h-12 px-8 font-black uppercase text-xs">New Listing</Button>}
      </div>

      <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit mb-4">
        {!isVendor && <button onClick={() => setActiveTab('DIRECTORY')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'DIRECTORY' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>Directory</button>}
        {isVendor && <button onClick={() => setActiveTab('PRODUCTS')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'PRODUCTS' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>My Catalog</button>}
        <button onClick={() => setActiveTab('FINANCIALS')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'FINANCIALS' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>Financials</button>
      </div>

      {activeTab === 'DIRECTORY' && (
        <Card className="p-0 overflow-hidden rounded-[32px] shadow-xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-5">Entity Operator</th>
                <th className="px-8 py-5">Spatial Node</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {vendors.map(v => (
                <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4" onClick={() => setSelectedVendor(v)}>
                      <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm">{v.name.charAt(0)}</div>
                      <div>
                        <p className="font-black text-sm uppercase tracking-tight">{v.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">{v.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs text-slate-600 font-bold">{v.city} • {v.market}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${v.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>{v.status}</span>
                      {isAdmin && (
                        <button onClick={() => toggleVendorStatus(v)} className={`transition-all duration-300 ${v.status === 'ACTIVE' ? 'text-indigo-600' : 'text-slate-300 hover:text-indigo-400'}`}>
                          {v.status === 'ACTIVE' ? <ToggleRight size={28}/> : <ToggleLeft size={28}/>}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                       <Button onClick={() => setSelectedQR(v)} variant="secondary" className="h-9 w-9 p-0 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all" title="Generate Access Token"><QrCode size={18}/></Button>
                       <Button variant="secondary" onClick={() => setSelectedVendor(v)} className="h-9 px-4 text-[9px] font-black uppercase">Dossier</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {activeTab === 'FINANCIALS' && (
        <div className="space-y-8 animate-fade-in">
           {/* Financial Summary Section */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-900 text-white p-8 rounded-[40px] border-none shadow-2xl relative overflow-hidden group">
                 <div className="relative z-10">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Total Managed Nodes</p>
                    <p className="text-5xl font-black tracking-tighter group-hover:scale-105 transition-transform origin-left">{totals.count}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">Verified Trade Entities</p>
                 </div>
                 <Users size={120} className="absolute -right-4 -bottom-4 opacity-5 text-white" />
              </Card>
              <Card className="p-8 rounded-[40px] shadow-xl border-l-8 border-l-red-500 relative overflow-hidden group">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Aggregate Rent Dues</p>
                 <p className="text-3xl font-black text-slate-900 tracking-tighter group-hover:text-red-600 transition-colors">UGX {totals.rent.toLocaleString()}</p>
                 <div className="mt-4 flex items-center gap-2 text-[9px] font-black uppercase text-red-600 bg-red-50 w-fit px-3 py-1 rounded-full border border-red-100">
                    <AlertCircle size={12}/> Critical Deficit
                 </div>
              </Card>
              <Card className="p-8 rounded-[40px] shadow-xl border-l-8 border-l-amber-500 relative overflow-hidden group">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Aggregate VAT Registry</p>
                 <p className="text-3xl font-black text-slate-900 tracking-tighter group-hover:text-amber-600 transition-colors">UGX {totals.vat.toLocaleString()}</p>
                 <div className="mt-4 flex items-center gap-2 text-[9px] font-black uppercase text-amber-600 bg-amber-50 w-fit px-3 py-1 rounded-full border border-amber-100">
                    <History size={12}/> Regional Tax Sync
                 </div>
              </Card>
           </div>

           {/* Ledger Controls & Advanced Filtering */}
           <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                       <ListFilter size={20} />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight">Settlement Ledger</h3>
                 </div>
                 <div className="h-8 w-px bg-slate-100"></div>
                 <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                       <input type="checkbox" checked={duesOnly} onChange={() => setDuesOnly(!duesOnly)} className="sr-only" />
                       <div className={`w-12 h-6 rounded-full transition-all ${duesOnly ? 'bg-red-600' : 'bg-slate-200'}`}></div>
                       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${duesOnly ? 'right-1' : 'left-1'}`}></div>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${duesOnly ? 'text-red-600' : 'text-slate-500 group-hover:text-indigo-600'}`}>
                       Dues &gt; 0 Filter
                    </span>
                 </label>
              </div>
              <div className="flex gap-2">
                 <Button variant="secondary" className="h-10 px-6 text-[10px] font-black uppercase tracking-widest border-slate-200 hover:bg-slate-50"><Download size={16}/> Export ledger</Button>
              </div>
           </div>

           <Card className="p-0 overflow-hidden rounded-[32px] shadow-xl border-none">
             <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-8 py-5">Vendor Entity</th>
                    <th className="px-8 py-5 text-right">Rent Owed</th>
                    <th className="px-8 py-5 text-right">VAT Owed</th>
                    <th className="px-8 py-5 text-center">Settlement Status</th>
                    <th className="px-8 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredVendors.map(v => (
                    <tr key={v.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="px-8 py-6">
                        <p className="font-black text-sm uppercase text-slate-800">{v.name}</p>
                        <p className="text-[9px] text-slate-400 uppercase tracking-widest">{v.id}</p>
                      </td>
                      <td className={`px-8 py-6 text-right font-mono text-sm font-bold ${v.rentDue > 0 ? 'text-red-600' : 'text-slate-500'}`}>
                        {v.rentDue.toLocaleString()}
                      </td>
                      <td className={`px-8 py-6 text-right font-mono text-sm font-bold ${v.vatDue > 0 ? 'text-amber-600' : 'text-slate-500'}`}>
                        {v.vatDue.toLocaleString()}
                      </td>
                      <td className="px-8 py-6 text-center">
                        {(v.rentDue + v.vatDue) > 0 ? (
                           <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[8px] font-black uppercase border border-amber-100 animate-pulse shadow-sm">Pending</span>
                        ) : (
                           <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[8px] font-black uppercase border border-emerald-100 shadow-sm">Cleared</span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        {(v.rentDue + v.vatDue) > 0 ? (
                           <Button onClick={() => setPayingVendor(v)} className="h-9 px-6 text-[9px] font-black uppercase shadow-indigo-100">Settle Now</Button>
                        ) : (
                           <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center justify-end gap-1"><CheckCircle2 size={12}/> Authorized</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
           </Card>

           {/* Payment Transaction History Section */}
           <div className="space-y-6 pt-10">
              <div className="flex flex-col md:flex-row items-center justify-between px-2 gap-4">
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl">
                       <History size={24} />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">Transaction History</h3>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="relative">
                       <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input 
                        value={historySearch} 
                        onChange={(e) => setHistorySearch(e.target.value)} 
                        placeholder="Search TX ID or Node..." 
                        className="bg-white border-2 border-slate-100 rounded-2xl pl-11 pr-4 py-3 text-xs font-bold outline-none focus:border-indigo-600 w-64 shadow-xl transition-all" 
                       />
                    </div>
                    <div className="relative">
                       <select 
                        value={historyFilter} 
                        onChange={(e) => setHistoryFilter(e.target.value)} 
                        className="bg-black text-white border-none rounded-2xl px-6 py-3.5 text-[10px] font-black uppercase tracking-widest outline-none shadow-xl appearance-none pr-10 cursor-pointer"
                       >
                          <option value="ALL">All Flows</option>
                          <option value="RENT">Rent Only</option>
                          <option value="VAT">VAT Only</option>
                          <option value="SERVICE">Services</option>
                       </select>
                       <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                 </div>
              </div>

              <Card className="p-0 overflow-hidden rounded-[32px] shadow-2xl border-none">
                 <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <th className="px-8 py-5 cursor-pointer hover:text-indigo-600 transition-colors group" onClick={() => handleSort('id')}>
                           <div className="flex items-center gap-2">Transaction ID <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100"/></div>
                        </th>
                        <th className="px-8 py-5 cursor-pointer hover:text-indigo-600 transition-colors group" onClick={() => handleSort('vendorName')}>
                           <div className="flex items-center gap-2">Entity Node <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100"/></div>
                        </th>
                        <th className="px-8 py-5 cursor-pointer hover:text-indigo-600 transition-colors group" onClick={() => handleSort('date')}>
                           <div className="flex items-center gap-2">Allocation Date <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100"/></div>
                        </th>
                        <th className="px-8 py-5 text-right cursor-pointer hover:text-indigo-600 transition-colors group" onClick={() => handleSort('amount')}>
                           <div className="flex items-center justify-end gap-2">Amount (UGX) <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100"/></div>
                        </th>
                        <th className="px-8 py-5 text-center">Flow Type</th>
                        <th className="px-8 py-5 text-right">Integrity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {sortedAndFilteredHistory.map(tx => (
                        <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-8 py-6 font-mono text-xs font-black text-indigo-600">{tx.id}</td>
                          <td className="px-8 py-6 text-sm font-bold text-slate-700">{tx.vendorName}</td>
                          <td className="px-8 py-6 text-xs text-slate-500">{tx.date}</td>
                          <td className="px-8 py-6 text-right font-black text-slate-900 tracking-tighter group-hover:scale-105 transition-transform origin-right">
                             {tx.amount.toLocaleString()}
                          </td>
                          <td className="px-8 py-6 text-center">
                             <span className="text-[9px] font-black bg-slate-100 text-slate-600 px-2.5 py-1 rounded uppercase border border-slate-200 tracking-widest shadow-sm">{tx.type}</span>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border shadow-sm ${
                                tx.status === 'SUCCESS' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 
                                tx.status === 'PENDING' ? 'text-amber-600 bg-amber-50 border-amber-100' : 
                                'text-red-600 bg-red-50 border-red-100'
                             }`}>
                                {tx.status}
                             </span>
                          </td>
                        </tr>
                      ))}
                      {sortedAndFilteredHistory.length === 0 && (
                        <tr>
                           <td colSpan={6} className="px-8 py-20 text-center">
                              <History size={48} className="mx-auto mb-4 text-slate-200" />
                              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No matching transaction records found in ledger.</p>
                           </td>
                        </tr>
                      )}
                    </tbody>
                 </table>
              </Card>
           </div>
        </div>
      )}

      {activeTab === 'PRODUCTS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{products.map(p => (
          <Card key={p.id} className="p-8 rounded-[32px] border-l-8 border-l-indigo-600 shadow-xl group hover:scale-105 transition-all">
            <div className="flex justify-between mb-6"><div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all"><Package size={24}/></div><button onClick={() => setProducts(products.filter(item => item.id !== p.id))} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={20}/></button></div>
            <h4 className="text-xl font-black uppercase mb-4 text-slate-800">{p.name}</h4><div className="flex justify-between items-end pt-6 border-t border-slate-50"><div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reserve</p><p className="text-2xl font-black">{p.stock}</p></div><div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rate</p><p className="text-lg font-black text-indigo-600">UGX {p.price.toLocaleString()}</p></div></div>
          </Card>
        ))}</div>
      )}

      {selectedVendor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[250] flex items-center justify-center p-4 animate-fade-in"><Card className="w-full max-w-2xl shadow-2xl border-none rounded-[48px] p-0 relative bg-white overflow-hidden flex flex-col"><div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div><button onClick={() => setSelectedVendor(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 p-2"><X size={32}/></button><div className="p-12"><div className="flex gap-8 items-center mb-8"><div className="w-24 h-24 bg-slate-900 text-white rounded-[32px] flex items-center justify-center text-5xl font-black shadow-2xl">{selectedVendor.name.charAt(0)}</div><div><h3 className="text-4xl font-black tracking-tighter uppercase text-slate-900">{selectedVendor.name}</h3><div className="flex gap-3 mt-2"><span className="text-[10px] font-black bg-indigo-600 text-white px-4 py-1.5 rounded-full uppercase tracking-widest">{selectedVendor.category} Node</span></div></div></div><div className="grid grid-cols-2 gap-8 py-8 border-y border-slate-50"><div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Spatial Node</p><p className="font-bold text-slate-700">{selectedVendor.level || 'Ground'} / {selectedVendor.section || 'General'}</p></div><div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Entity Integrity</p><p className="font-bold text-emerald-600 uppercase tracking-widest">{selectedVendor.status}</p></div></div><div className="pt-8"><Button className="w-full h-14 uppercase font-black tracking-widest text-xs shadow-xl" onClick={() => setSelectedVendor(null)}>Dismiss Dossier</Button></div></div></Card></div>
      )}

      {showPForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[250] flex items-center justify-center p-4"><Card className="w-full max-w-md shadow-2xl rounded-[40px] p-10 bg-white relative overflow-hidden border-none"><div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div><div className="flex justify-between items-center mb-8"><h3 className="text-2xl font-black uppercase tracking-tight">Register Commodity</h3><button onClick={() => setShowPForm(false)} className="text-slate-400 hover:text-red-500 transition-colors p-2"><X size={28}/></button></div><div className="space-y-4"><Input label="Official Designation" value={pForm.name} onChange={(e:any)=>setPForm({...pForm, name:e.target.value})}/><div className="grid grid-cols-2 gap-4"><Input label="Unit Price (UGX)" value={pForm.price} onChange={(e:any)=>setPForm({...pForm, price:e.target.value})}/><Input label="Initial Reserve" value={pForm.stock} onChange={(e:any)=>setPForm({...pForm, stock:e.target.value})}/></div><Button className="w-full h-14 font-black uppercase text-xs shadow-xl shadow-indigo-100 mt-4" onClick={() => {setProducts([{id:'P-'+Date.now(), name:pForm.name, price:Number(pForm.price), stock:Number(pForm.stock), vendor:user.name, status:'HEALTHY', category:'General'}, ...products]); setShowPForm(false);}}>Commit to Registry</Button></div></Card></div>
      )}
    </div>
  );
};

const SupplyView = ({ user }: any) => {
  const [activeTab, setActiveTab] = useState<'NETWORK' | 'BRIDGE'>('NETWORK');
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: 'S-8801', name: 'Nile Agro', email: 's1@mmis.ug', category: 'Grain', status: 'ACTIVE', warehouseLocation: 'Jinja', suppliedItemsCount: 150, rating: 4.8, totalRatings: 120, kycValidated: true, onboardingDate: '2023-01-12' },
  ]);
  const [bridge, setBridge] = useState<BridgeLogistics>({ id: 'BW-21', dispatchDate: 'Next Monday', status: 'PREPARING', capacity: 65, items: [] });
  const [showBridgeForm, setShowBridgeForm] = useState(false);
  const [bridgePay, setBridgePay] = useState<any>(null);

  return (
    <div className="space-y-6">
      {bridgePay && <PaymentGateway amount={bridgePay.price} itemDescription={`Bridge Pre-pay: ${bridgePay.item}`} onSuccess={() => {setBridge({...bridge, items:[...bridge.items, {id:'M-'+Date.now(), vendorId:user.id, vendorName:user.name, itemName:bridgePay.item, qty:Number(bridgePay.qty), estPrice:bridgePay.price, paid:true}]}); setBridgePay(null);}} onCancel={() => setBridgePay(null)} />}
      <div className="flex justify-between items-center pb-6 border-b border-slate-100"><h2 className="text-3xl font-black uppercase">Supply Network</h2></div>
      <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit"><button onClick={() => setActiveTab('NETWORK')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase ${activeTab === 'NETWORK' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Partners</button><button onClick={() => setActiveTab('BRIDGE')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase ${activeTab === 'BRIDGE' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Weekly Bridge</button></div>

      {activeTab === 'NETWORK' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{suppliers.map(s => (
          <Card key={s.id} className="p-8 rounded-[36px] shadow-xl border-l-8 border-l-emerald-600 hover:scale-[1.02] transition-transform group">
            <div className="flex justify-between items-start mb-6"><div><h3 className="text-xl font-black uppercase text-slate-800">{s.name}</h3><p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{s.category} Sector</p></div><div className="text-right text-amber-500 font-black"><Star fill="currentColor" size={20} className="inline mr-1"/>{s.rating}</div></div>
            <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-50 text-[10px] font-black uppercase text-slate-400"><div><p>Hub</p><p className="text-slate-900 text-sm">{s.warehouseLocation}</p></div><div><p>Volume</p><p className="text-slate-900 text-sm">{s.suppliedItemsCount} Loads</p></div></div>
          </Card>
        ))}</div>
      )}

      {activeTab === 'BRIDGE' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-slate-900 text-white p-16 rounded-[56px] border-none relative overflow-hidden shadow-2xl">
            <div className="z-10 relative"><div className="flex justify-between items-start mb-12"><div><h3 className="text-6xl font-black tracking-tighter uppercase">The Bridge</h3><p className="text-indigo-400 font-bold mt-2">Next dispatch: {bridge.dispatchDate}</p></div><span className="bg-indigo-600 px-6 py-2 rounded-full text-[10px] font-black uppercase animate-pulse">{bridge.status}</span></div><div className="space-y-4 mb-12"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aggregate Payload</p><div className="h-4 bg-white/10 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-indigo-500" style={{width:`${bridge.capacity}%`}}></div></div></div><Button className="w-full h-16 bg-white text-slate-900 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-indigo-50 shadow-xl" onClick={() => setShowBridgeForm(true)}>Join Next Cycle</Button></div><Truck size={400} className="absolute -right-20 -bottom-20 opacity-5 text-white" />
          </Card>
          <div className="space-y-6"><Card className="p-8 rounded-[40px] shadow-xl border-none"><h4 className="font-black uppercase text-xs mb-6 text-slate-400 tracking-widest">Bridge Ledger</h4><div className="space-y-4">{bridge.items.map(i => (<div key={i.id} className="flex justify-between items-center text-xs pb-4 border-b border-slate-50 last:border-0"><div><p className="font-black uppercase text-slate-800">{i.itemName}</p><p className="text-slate-400">{i.vendorName}</p></div><span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">PAID</span></div>))}</div></Card></div>
        </div>
      )}

      {showBridgeForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[250] flex items-center justify-center p-4"><Card className="w-full max-md rounded-[48px] p-10 bg-white relative overflow-hidden shadow-2xl border-none"><button onClick={()=>setShowBridgeForm(false)} className="absolute top-8 right-8 text-slate-400 p-2"><X size={28}/></button><h3 className="text-2xl font-black uppercase mb-8 tracking-tight">Join Dispatch</h3><form onSubmit={(e:any)=>{e.preventDefault(); setBridgePay({item:e.target.item.value, qty:e.target.qty.value, price:Number(e.target.price.value)}); setShowBridgeForm(false);}} className="space-y-4"><Input label="Commodity" name="item" required/><div className="grid grid-cols-2 gap-4"><Input label="Qty" name="qty" required/><Input label="Est. Price" name="price" required/></div><div className="p-5 bg-amber-50 rounded-2xl text-[9px] font-black text-amber-700 uppercase border border-amber-100">Finance Note: Pre-payment required. Discrepancies settled at Terminal Delta.</div><Button type="submit" className="w-full h-14 font-black uppercase text-xs shadow-xl">Pay & Sync Manifest</Button></form></Card></div>
      )}
    </div>
  );
};

const TicketView = ({ user }: any) => {
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: 'TIC-1022', title: 'CCTV Failure - Wing B', description: 'Camera 12 is offline.', context: 'ASSET', priority: 'HIGH', status: 'OPEN', creatorName: 'Mukasa (Security)', createdAt: '2024-05-18 10:30' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', desc: '', context: 'SUPPORT' as any, prio: 'MEDIUM' as any });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-6 border-b border-slate-100"><h2 className="text-3xl font-black uppercase tracking-tight">Case Registry</h2><Button onClick={() => setShowModal(true)} className="h-12 px-8 uppercase font-black text-xs shadow-xl"><Camera size={18}/> Field Incident</Button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{tickets.map(t => (
        <Card key={t.id} className="p-8 rounded-[36px] shadow-xl border-l-8 border-l-indigo-600 hover:scale-105 transition-all cursor-pointer border-none">
          <div className="flex justify-between mb-4"><span className="text-[10px] font-black text-indigo-600 font-mono tracking-widest">{t.id}</span><span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[8px] font-black uppercase tracking-widest border border-amber-100">{t.status}</span></div>
          <h4 className="text-xl font-black mb-2 uppercase tracking-tight text-slate-800">{t.title}</h4><p className="text-xs text-slate-500 line-clamp-2 mb-6 font-medium">{t.description}</p>
          <div className="pt-6 border-t border-slate-50 flex justify-between items-center"><div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${t.priority === 'HIGH' ? 'bg-red-500' : 'bg-amber-500'}`}></div><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.priority} Prio</span></div><span className="text-[9px] font-black uppercase text-slate-900">{t.creatorName}</span></div>
        </Card>
      ))}</div>
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[250] flex items-center justify-center p-4"><Card className="w-full max-w-lg rounded-[48px] p-12 bg-white relative overflow-hidden shadow-2xl border-none"><button onClick={()=>setShowModal(false)} className="absolute top-10 right-10 text-slate-400 p-2"><X size={32}/></button><h3 className="text-2xl font-black uppercase mb-8 tracking-tight">Raise Incident</h3><div className="space-y-4"><Input label="Summary Headline" value={form.title} onChange={(e:any)=>setForm({...form, title:e.target.value})}/><div className="grid grid-cols-2 gap-4"><div className="flex flex-col gap-1.5"><label className="text-[10px] font-black uppercase text-slate-500 px-1">Flow</label><select className="bg-black text-white p-3.5 rounded-2xl text-xs font-black uppercase appearance-none"><option>Maintenance</option><option>Support</option><option>Complaint</option></select></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-black uppercase text-slate-500 px-1">Urgency</label><select className="bg-black text-white p-3.5 rounded-2xl text-xs font-black uppercase appearance-none"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></div></div><Input label="Technical Context" multiline value={form.desc} onChange={(e:any)=>setForm({...form, desc:e.target.value})}/><Button onClick={()=>{setTickets([{id:'TIC-'+Date.now(), title:form.title, description:form.desc, context:form.context, priority:form.prio, status:'OPEN', creatorName:user.name, createdAt:'Today'}, ...tickets]); setShowModal(false);}} className="w-full h-14 font-black uppercase text-xs shadow-xl">Broadcast Request</Button></div></Card></div>
      )}
    </div>
  );
};

// --- APP SHELL ---

const Sidebar = ({ user, active, setActive, onLogout }: any) => {
  const items = [
    { n: 'Home', i: LayoutDashboard },
    { n: 'Markets', i: Building2, r: ['SUPER_ADMIN', 'MARKET_ADMIN'] },
    { n: user.role === 'VENDOR' ? 'My Store' : 'Vendors', i: Store, r: ['SUPER_ADMIN', 'MARKET_ADMIN', 'VENDOR'] },
    { n: 'Suppliers Network', i: HeartHandshake },
    { n: 'Inventory Control', i: Box, r: ['SUPER_ADMIN', 'MARKET_ADMIN', 'VENDOR', 'SUPPLIER'] },
    { n: 'Supply Hub', i: ShoppingBag, r: ['SUPER_ADMIN', 'MARKET_ADMIN', 'VENDOR', 'SUPPLIER'] },
    { n: 'Gate Management', i: Truck, r: ['SUPER_ADMIN', 'MARKET_ADMIN', 'COUNTER_STAFF'] },
    { n: 'Stock Counter', i: Boxes, r: ['SUPER_ADMIN', 'MARKET_ADMIN', 'COUNTER_STAFF'] },
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

const Header = ({ user }: any) => (
  <header className="h-24 bg-white/70 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-12 border-b border-slate-50 shadow-sm">
    <div className="flex items-center gap-4"><Search className="text-slate-400" size={20}/><input placeholder="Search global ledger..." className="bg-transparent outline-none text-sm font-bold text-slate-800 w-64"/></div>
    <div className="flex items-center gap-6"><button className="p-3 text-slate-500 hover:bg-slate-100 rounded-full transition-all relative"><Bell size={24}/><span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-600 rounded-full border-[3px] border-white animate-ping"></span></button><div className="text-right"><p className="text-xs font-black uppercase tracking-tight">{user.name}</p><p className="text-[9px] font-black text-indigo-600 uppercase mt-1.5">{user.role}</p></div><div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black shadow-lg ring-4 ring-slate-100">{user.name.charAt(0)}</div></div>
  </header>
);

const App = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [active, setActive] = useState('Home');

  const handleLogin = () => setUser({ id: 'u-1', name: 'James Mukasa', email: 'james@mmis.ug', role: 'SUPER_ADMIN', isVerified: true, kycStatus: 'APPROVED', mfaEnabled: true });

  if (!user) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6"><Card className="max-w-md w-full p-12 rounded-[56px] shadow-2xl border-none text-center bg-white"><div className="absolute top-0 left-0 w-full h-3 bg-indigo-600"></div><div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl ring-[12px] ring-indigo-50"><Store size={48} className="text-white"/></div><h1 className="text-4xl font-black uppercase mb-2 tracking-tighter">MMIS HUB</h1><p className="text-slate-400 font-bold text-[10px] tracking-[0.4em] uppercase mb-12">Regional Trade Logistics</p><Button onClick={handleLogin} className="w-full h-20 bg-slate-900 text-white font-black uppercase tracking-[0.3em] text-xs rounded-3xl hover:bg-indigo-600 transition-all">Authorize Terminal</Button></Card></div>
  );

  const render = () => {
    switch (active) {
      case 'Home': return <HomeView user={user} setActive={setActive} onLogout={() => setUser(null)} />;
      case 'My Store':
      case 'Vendors': return <VendorView user={user} />;
      case 'Suppliers Network':
      case 'Supply Hub': return <SupplyView user={user} />;
      case 'Tickets & Support': return <TicketView user={user} />;
      default: return <div className="flex flex-col items-center justify-center py-40 text-center"><div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center border-4 border-dashed border-slate-100 text-slate-200 mb-8"><Zap size={48}/></div><h3 className="text-2xl font-black uppercase tracking-tighter">{active} node coming soon</h3><p className="text-slate-400 font-medium max-w-xs mt-4">This operational terminal is being synchronized with the master ledger.</p><Button onClick={() => setActive('Home')} className="mt-8 shadow-xl">Return to Hub</Button></div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 antialiased">
      <Sidebar user={user} active={active} setActive={setActive} onLogout={() => setUser(null)} />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Header user={user} />
        <main className="p-12 max-w-7xl mx-auto w-full">{render()}</main>
        <footer className="p-12 text-center border-t border-slate-100"><p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">© MMIS v2.5 PRE-RELEASE • TEVAS UG</p></footer>
      </div>
      <button className="fixed bottom-8 right-8 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform animate-bounce-subtle"><MessageSquare size={28}/></button>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
