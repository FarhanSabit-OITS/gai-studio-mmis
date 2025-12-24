
import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, Plus, Edit, Trash2, Download, CheckCircle, XCircle, 
  Eye, ChevronDown, User, MapPin, DollarSign, Calendar, 
  CreditCard, History, ArrowRight, LayoutGrid, Layers, ShieldCheck, 
  Zap, Clock, Mail, Package, QrCode, X, Printer, Share2, Camera, Save, Lock, Info, CheckCircle2, Shield,
  Store, AlertCircle, ShoppingBag, Copy, AlertTriangle, FileCheck, HelpCircle, TrendingUp, RotateCcw,
  ArrowUpRight, ArrowDownLeft, SlidersHorizontal, Tag, Briefcase, Building, Wallet, ListFilter,
  Users, ArrowUpDown, ToggleLeft, ToggleRight, MoreHorizontal, Settings2, Smartphone, Key, Upload
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Vendor, UserProfile, Product, Transaction } from '../../types';
import { PaymentGateway } from '../payments/PaymentGateway';

type ManagementTab = 'DIRECTORY' | 'FINANCIALS' | 'MY_PRODUCTS' | 'MY_PROFILE';
type SortKey = 'name' | 'city' | 'status';
type HistorySortKey = 'id' | 'date' | 'amount' | 'type';

export const VendorManagement = ({ user }: { user: UserProfile }) => {
  const isVendor = user.role === 'VENDOR';
  const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'MARKET_ADMIN';
  const [activeTab, setActiveTab] = useState<ManagementTab>(isVendor ? 'MY_PRODUCTS' : 'DIRECTORY');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'PENDING' | 'INACTIVE'>('ALL');
  const [duesFilterOnly, setDuesFilterOnly] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedVendorQR, setSelectedVendorQR] = useState<Vendor | null>(null);
  const [payingVendor, setPayingVendor] = useState<Vendor | null>(null);
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [showProductRequestModal, setShowProductRequestModal] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  
  // Profile State
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    email: user.email,
    currentKey: '',
    newKey: '',
    confirmKey: ''
  });
  const [profileImage, setProfileImage] = useState<string | null>(user.profileImage || null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  // Vendor Data
  const [vendors, setVendors] = useState<Vendor[]>([
    { id: 'V-001', name: 'Global Tech', email: 'contact@globaltech.com', category: 'Electronics', status: 'ACTIVE', kycStatus: 'APPROVED', products: 124, joinedDate: '2023-10-12', gender: 'MALE', age: 34, city: 'Mbarara', market: 'Mbarara Central', rentDue: 0, vatDue: 0, level: 'Ground Floor', section: 'Electronics Hub', storeType: 'SHOP', ownershipType: 'LEASED' },
    { id: 'V-002', name: 'Fresh Foods Co.', email: 'sales@freshfoods.io', category: 'Groceries', status: 'PENDING', kycStatus: 'PENDING', products: 45, joinedDate: '2024-01-05', gender: 'FEMALE', age: 28, city: 'Kabale', market: 'Bugongi', rentDue: 150000, vatDue: 45000, level: 'Level 1', section: 'Fresh Produce Area', storeType: 'STALL', ownershipType: 'OWNED' },
    { id: 'V-003', name: 'West End Mart', email: 'admin@westend.ug', category: 'General', status: 'INACTIVE', kycStatus: 'REJECTED', products: 0, joinedDate: '2024-03-12', gender: 'MALE', age: 41, city: 'Jinja', market: 'Jinja Main', rentDue: 80000, vatDue: 12000, level: 'Level 2', section: 'Aisle B', storeType: 'KIOSK', ownershipType: 'SUB-LEASED' },
  ]);

  const [products] = useState<Product[]>([
    { id: 'P-101', name: 'Premium Basmati', vendor: user.name, stock: 45, price: 120000, status: 'HEALTHY', category: 'Food' },
    { id: 'P-102', name: 'Refined Sugar', vendor: user.name, stock: 4, price: 85000, status: 'CRITICAL', category: 'Food' },
  ]);

  const financialSummary = useMemo(() => {
    return vendors.reduce((acc, v) => ({
      totalVendors: acc.totalVendors + 1,
      totalRent: acc.totalRent + v.rentDue,
      totalVAT: acc.totalVAT + v.vatDue,
    }), { totalVendors: 0, totalRent: 0, totalVAT: 0 });
  }, [vendors]);

  const handleSort = (key: SortKey) => {
    setSortConfig({ key, direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc' });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = () => {
    if (profileForm.newKey && profileForm.newKey !== profileForm.confirmKey) {
      alert("Error: Master key sequence mismatch.");
      return;
    }
    alert("Vendor profile synchronized successfully. Registry updated.");
  };

  const handleDeleteVendor = (id: string) => {
    if (confirm("Are you sure you want to purge this vendor from the registry?")) {
       setVendors(vendors.filter(v => v.id !== id));
    }
  };

  const filteredVendors = useMemo(() => {
    let result = vendors.filter(v => {
      const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === 'ALL' || v.status === filterStatus;
      const matchesDues = !duesFilterOnly || (v.rentDue + v.vatDue > 0);
      return matchesSearch && matchesStatus && matchesDues;
    });

    result.sort((a, b) => {
      const fieldA = String(a[sortConfig.key]).toLowerCase();
      const fieldB = String(b[sortConfig.key]).toLowerCase();
      if (fieldA < fieldB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [vendors, search, filterStatus, duesFilterOnly, sortConfig]);

  const kycStatusColors: Record<string, string> = {
    APPROVED: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    PENDING: 'bg-amber-50 text-amber-600 border-amber-100',
    REJECTED: 'bg-red-50 text-red-600 border-red-100',
    NONE: 'bg-slate-50 text-slate-400 border-slate-100'
  };

  return (
    <div className="space-y-6 animate-fade-in relative pb-20">
      {payingVendor && (
        <PaymentGateway 
          amount={payingVendor.rentDue + payingVendor.vatDue}
          itemDescription={`Outstanding Rent & VAT for ${payingVendor.name}`}
          onSuccess={() => setPayingVendor(null)}
          onCancel={() => setPayingVendor(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-indigo-50">
             <Store size={32} />
           </div>
           <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{isVendor ? 'Store Console' : 'Vendor Registry'}</h2>
              <div className="flex items-center gap-3 mt-1">
                 <p className="text-slate-500 font-medium text-lg">Infrastructure management & trade oversight.</p>
                 {isVendor && (
                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase border tracking-[0.1em] ${kycStatusColors[user.kycStatus]}`}>
                       KYC: {user.kycStatus}
                    </span>
                 )}
              </div>
           </div>
        </div>
        {isVendor && activeTab === 'MY_PRODUCTS' && (
           <Button onClick={() => setShowProductRequestModal(true)} className="h-14 px-8 font-black uppercase text-xs shadow-xl shadow-indigo-100 bg-indigo-600 text-white border-none">
              <ShoppingBag size={20}/> Product Request
           </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 bg-slate-100/50 p-2 rounded-2xl w-fit border border-slate-200/50 shadow-inner">
        {!isVendor && <button onClick={() => setActiveTab('DIRECTORY')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'DIRECTORY' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}>Node Directory</button>}
        {isVendor && <button onClick={() => setActiveTab('MY_PRODUCTS')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'MY_PRODUCTS' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}>My Catalog</button>}
        <button onClick={() => setActiveTab('FINANCIALS')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'FINANCIALS' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}>{isVendor ? 'Payments' : 'Financials'}</button>
        {isVendor && <button onClick={() => setActiveTab('MY_PROFILE')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'MY_PROFILE' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}>My Profile</button>}
      </div>

      {activeTab === 'DIRECTORY' && !isVendor && (
        <Card className="p-0 overflow-hidden rounded-[32px] shadow-2xl border-slate-100">
           <div className="p-8 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row gap-4">
              <Input className="flex-[2] mb-0" icon={Search} placeholder="Search vendor registry..." value={search} onChange={(e:any) => setSearch(e.target.value)} />
              <div className="flex-1 relative">
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="w-full h-full bg-black text-white border-2 border-slate-800 rounded-2xl px-5 py-3 text-xs font-black uppercase tracking-widest outline-none focus:border-indigo-600 appearance-none cursor-pointer shadow-xl transition-all"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active Nodes</option>
                  <option value="PENDING">Pending Review</option>
                  <option value="INACTIVE">Dormant/Suspended</option>
                </select>
                <ListFilter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 border-b border-slate-100">
                     <th className="px-8 py-5 cursor-pointer hover:text-indigo-600" onClick={() => handleSort('name')}>
                        <div className="flex items-center gap-2">Operational Node <ArrowUpDown size={12} className={sortConfig.key === 'name' ? 'text-indigo-600' : 'text-slate-300'}/></div>
                     </th>
                     <th className="px-8 py-5 cursor-pointer hover:text-indigo-600" onClick={() => handleSort('city')}>
                        <div className="flex items-center gap-2">Location <ArrowUpDown size={12} className={sortConfig.key === 'city' ? 'text-indigo-600' : 'text-slate-300'}/></div>
                     </th>
                     <th className="px-8 py-5">KYC Status</th>
                     <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredVendors.map(v => (
                     <React.Fragment key={v.id}>
                       <tr className="hover:bg-slate-50/50 group transition-all cursor-pointer" onClick={() => setSelectedVendor(v)}>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black group-hover:bg-indigo-600 transition-colors shadow-md">{v.name.charAt(0)}</div>
                                <div>
                                   <p className="text-sm font-black text-slate-800 tracking-tight">{v.name}</p>
                                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{v.id}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-xs font-bold text-slate-600">{v.city} • {v.market}</td>
                          <td className="px-8 py-6">
                             <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border shadow-sm ${kycStatusColors[v.kycStatus]}`}>
                               {v.kycStatus}
                             </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <div className="flex justify-end gap-2">
                                <Button 
                                  variant="secondary" 
                                  onClick={(e) => { e.stopPropagation(); setSelectedVendorQR(v); }}
                                  className="h-9 w-9 p-0 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm border-slate-200"
                                  title="Generate Store QR"
                                >
                                   <QrCode size={18} />
                                </Button>
                                <Button 
                                  variant="secondary" 
                                  onClick={(e) => { e.stopPropagation(); setSelectedVendor(v); }}
                                  className="h-9 px-4 text-[10px] font-black uppercase tracking-widest border-slate-200"
                                >
                                   Dossier
                                </Button>
                                {isAdmin && (
                                   <Button 
                                    variant="danger" 
                                    onClick={(e) => { e.stopPropagation(); handleDeleteVendor(v.id); }}
                                    className="h-9 w-9 p-0 rounded-xl shadow-sm bg-red-500 text-white border-none"
                                    title="Purge Node"
                                   >
                                      <Trash2 size={16} />
                                   </Button>
                                )}
                             </div>
                          </td>
                       </tr>
                     </React.Fragment>
                  ))}
                </tbody>
             </table>
           </div>
        </Card>
      )}

      {activeTab === 'MY_PRODUCTS' && isVendor && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <Card key={p.id} className="group relative overflow-hidden rounded-[32px] border-none shadow-xl hover:shadow-2xl transition-all bg-white p-8 border-l-8 border-l-indigo-600">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Package size={28} />
                </div>
                <button className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600"><Edit size={18}/></button>
              </div>
              <h4 className="text-xl font-black text-slate-900 tracking-tight mb-2">{p.name}</h4>
              <div className="flex items-center gap-3 mb-4">
                 <span className="text-[9px] font-black text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded">{p.category}</span>
                 <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${p.status === 'CRITICAL' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>{p.status}</span>
              </div>
              <div className="pt-6 border-t border-slate-50 flex justify-between items-end">
                 <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Reserve</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tighter">{p.stock}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Price (UGX)</p>
                    <p className="text-lg font-black text-indigo-600 tracking-tighter">{p.price.toLocaleString()}</p>
                 </div>
              </div>
            </Card>
          ))}
          {products.length === 0 && (
             <div className="lg:col-span-3 py-20 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                <ShoppingBag size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="font-black uppercase text-xs text-slate-400 tracking-widest">No active commodity listings.</p>
             </div>
          )}
        </div>
      )}

      {activeTab === 'MY_PROFILE' && isVendor && (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
           <Card className="p-12 rounded-[48px] shadow-2xl border-none relative overflow-hidden bg-white">
              <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
              
              <div className="flex justify-between items-start mb-12">
                 <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
                    <div className="relative group shrink-0">
                       <div className="w-40 h-40 rounded-[48px] bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-5xl font-black text-slate-400 shadow-inner overflow-hidden">
                          {profileImage ? <img src={profileImage} className="w-full h-full object-cover" alt="Profile" /> : user.name.charAt(0)}
                       </div>
                       <button onClick={() => profileInputRef.current?.click()} className="absolute -bottom-4 -right-4 w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 transition-transform ring-4 ring-white">
                          <Camera size={24} />
                       </button>
                       <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </div>
                    <div className="flex-1 space-y-6 w-full">
                       <div>
                          <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">{user.name}</h3>
                          <div className="flex items-center gap-3">
                             <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border tracking-widest ${kycStatusColors[user.kycStatus]}`}>
                                KYC: {user.kycStatus}
                             </span>
                             <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">Trade Node Active</span>
                          </div>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input label="Operational Designation" value={profileForm.name} onChange={(e:any)=>setProfileForm({...profileForm, name: e.target.value})} icon={User} />
                          <Input label="Registry Email Address" value={profileForm.email} onChange={(e:any)=>setProfileForm({...profileForm, email: e.target.value})} icon={Mail} />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-8 pt-12 border-t border-slate-50">
                 <div>
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">Access Control Protocol</h4>
                    <p className="text-xs text-slate-500 font-medium mb-8 leading-relaxed">Update your master key for session authorization. System requires a 128-bit compliant sequence.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <Input label="Current Master Key" type="password" placeholder="••••••••" icon={Lock} value={profileForm.currentKey} onChange={(e:any)=>setProfileForm({...profileForm, currentKey: e.target.value})} />
                       <Input label="New Sequence" type="password" placeholder="••••••••" icon={Key} value={profileForm.newKey} onChange={(e:any)=>setProfileForm({...profileForm, newKey: e.target.value})} />
                       <Input label="Confirm New Sequence" type="password" placeholder="••••••••" icon={ShieldCheck} value={profileForm.confirmKey} onChange={(e:any)=>setProfileForm({...profileForm, confirmKey: e.target.value})} />
                    </div>
                 </div>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-50 flex justify-between items-center">
                 <div className="flex items-center gap-2 text-slate-400">
                    <Info size={14}/>
                    <span className="text-[9px] font-black uppercase tracking-widest">Last registry sync: Today, 08:45</span>
                 </div>
                 <Button onClick={handleUpdateProfile} className="h-14 px-12 font-black uppercase text-xs shadow-xl shadow-indigo-100 bg-indigo-600 text-white border-none">
                    Commit Profile Sync
                 </Button>
              </div>
           </Card>
        </div>
      )}

      {activeTab === 'FINANCIALS' && (
        <div className="space-y-8 animate-fade-in">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-900 text-white p-8 rounded-[36px] shadow-2xl relative overflow-hidden border-none group">
                 <div className="relative z-10">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Aggregate Registry</p>
                    <p className="text-4xl font-black tracking-tighter group-hover:text-indigo-400 transition-colors">{financialSummary.totalVendors}</p>
                    <p className="text-xs font-bold text-slate-500 mt-2">Active Trade Entities</p>
                 </div>
                 <Users className="absolute -right-4 -bottom-4 opacity-5 text-white" size={120} />
              </Card>
              <Card className="bg-white p-8 rounded-[36px] shadow-xl border-l-8 border-l-red-500 relative overflow-hidden group">
                 <div className="relative z-10">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Rent Outstanding</p>
                    <p className="text-3xl font-black tracking-tighter text-slate-900">UGX {financialSummary.totalRent.toLocaleString()}</p>
                    <div className="mt-4 flex items-center gap-2 text-[10px] text-red-500 font-black bg-red-50 px-3 py-1.5 rounded-full w-fit border border-red-100">
                       <AlertTriangle size={14} /> Settlement Required
                    </div>
                 </div>
              </Card>
              <Card className="bg-white p-8 rounded-[36px] shadow-xl border-l-8 border-l-amber-500 relative overflow-hidden group">
                 <div className="relative z-10">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Aggregate VAT Dues</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter text-slate-900">UGX {financialSummary.totalVAT.toLocaleString()}</p>
                    <div className="mt-4 flex items-center gap-2 text-[10px] text-amber-600 font-black bg-amber-50 px-3 py-1.5 rounded-full w-fit border border-amber-100">
                       <History size={14} /> Regional Tax Sync
                    </div>
                 </div>
              </Card>
           </div>

           <Card className="p-0 overflow-hidden rounded-[32px] shadow-2xl border-slate-100">
              <div className="p-8 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                 <div className="flex items-center gap-3">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Active Dues Ledger</h3>
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                      <Wallet size={18} className="text-indigo-600" />
                      <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Settlement Node: Delta</span>
                    </div>
                 </div>
                 <label className="flex items-center gap-3 cursor-pointer group">
                   <div className="relative">
                     <input 
                       type="checkbox" 
                       className="sr-only" 
                       checked={duesFilterOnly}
                       onChange={() => setDuesFilterOnly(!duesFilterOnly)}
                     />
                     <div className={`w-10 h-5 rounded-full transition-all ${duesFilterOnly ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
                     <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${duesFilterOnly ? 'right-0.5' : 'left-0.5'}`}></div>
                   </div>
                   <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-indigo-600 transition-colors">Dues > 0 Only</span>
                 </label>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                     <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 border-b border-slate-100">
                        <th className="px-8 py-5">Vendor Entity</th>
                        <th className="px-8 py-5 text-right">Rent Due</th>
                        <th className="px-8 py-5 text-right">VAT Due</th>
                        <th className="px-8 py-5 text-center">Settlement Status</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {filteredVendors.map(v => (
                        <tr key={v.id} className="hover:bg-slate-50/50 transition-all cursor-pointer" onClick={() => setSelectedVendor(v)}>
                           <td className="px-8 py-6">
                              <p className="text-sm font-black text-slate-800 tracking-tight">{v.name}</p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase">{v.id}</p>
                           </td>
                           <td className="px-8 py-6 text-right font-mono text-sm font-bold text-slate-700">
                              {v.rentDue.toLocaleString()} UGX
                           </td>
                           <td className="px-8 py-6 text-right font-mono text-sm font-bold text-slate-700">
                              {v.vatDue.toLocaleString()} UGX
                           </td>
                           <td className="px-8 py-6 text-center">
                              {(v.rentDue + v.vatDue) > 0 ? (
                                 <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[8px] font-black uppercase tracking-widest border border-amber-100 animate-pulse shadow-sm shadow-amber-100">PENDING</span>
                              ) : (
                                 <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm shadow-emerald-100">CLEARED</span>
                              )}
                           </td>
                           <td className="px-8 py-6 text-right">
                              {(v.rentDue + v.vatDue) > 0 ? (
                                 <Button 
                                   onClick={(e) => { e.stopPropagation(); setPayingVendor(v); }}
                                   className="h-10 px-6 bg-indigo-600 text-white border-none text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-indigo-200"
                                 >
                                   Settle Dues
                                 </Button>
                              ) : (
                                 <Button variant="ghost" disabled className="h-10 px-6 text-[10px] font-black uppercase tracking-widest opacity-30">
                                   No Balance
                                 </Button>
                              )}
                           </td>
                        </tr>
                     ))}
                   </tbody>
                </table>
              </div>
           </Card>
        </div>
      )}

      {/* Product Request Modal */}
      {showProductRequestModal && (
         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[300] flex items-center justify-center p-4">
            <Card className="w-full max-w-lg shadow-2xl rounded-[40px] p-10 bg-white relative border-none">
               <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-slate-900 uppercase">Product Requisition</h3>
                  <button onClick={() => setShowProductRequestModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={28}/></button>
               </div>
               <div className="space-y-6">
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Submit a demand requisition to market management. This triggers an RFQ broadcast to the certified supplier network.</p>
                  <Input label="Target Commodity SKU / Name *" placeholder="e.g. Basmati Rice (Bulk)" />
                  <div className="grid grid-cols-2 gap-4">
                     <Input label="Quantity Unit *" type="number" placeholder="0" />
                     <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest px-1">Urgency Node</label>
                        <select className="bg-black text-white p-4 rounded-2xl text-xs font-black outline-none border-2 border-slate-800 shadow-xl appearance-none">
                           <option>Standard Cycle</option>
                           <option>Low Latency</option>
                           <option>Critical Deficit</option>
                        </select>
                     </div>
                  </div>
                  <Input label="Technical Context" multiline placeholder="Moisture levels, sourcing specifics..." />
                  <Button onClick={() => { setShowProductRequestModal(false); alert("Demand requisition broadcasted to market hub node."); }} className="w-full h-14 font-black uppercase text-xs tracking-widest shadow-xl bg-indigo-600 text-white border-none">Transmit Requisition</Button>
               </div>
            </Card>
         </div>
      )}

      {selectedVendor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[250] flex items-center justify-center p-4 animate-fade-in">
            <Card className="w-full max-w-2xl shadow-2xl border-none rounded-[48px] p-0 relative bg-white overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
                <button onClick={() => setSelectedVendor(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 p-2"><X size={32}/></button>
                <div className="p-12">
                    <div className="flex gap-8 items-center mb-8">
                        <div className="w-24 h-24 bg-slate-900 text-white rounded-[32px] flex items-center justify-center text-5xl font-black shadow-2xl">{selectedVendor.name.charAt(0)}</div>
                        <div>
                            <h3 className="text-4xl font-black tracking-tighter uppercase text-slate-900">{selectedVendor.name}</h3>
                            <div className="flex gap-3 mt-2">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${kycStatusColors[selectedVendor.kycStatus]}`}>KYC: {selectedVendor.kycStatus}</span>
                                <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${selectedVendor.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{selectedVendor.status}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 py-8 border-y border-slate-50">
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Spatial Node</p>
                                <p className="font-bold text-slate-700">{selectedVendor.city} Hub / {selectedVendor.market}</p>
                                <p className="text-xs text-slate-400">{selectedVendor.level} • {selectedVendor.section}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Entity Ownership</p>
                                <p className="font-bold text-slate-700 uppercase tracking-widest text-xs">{selectedVendor.ownershipType} • {selectedVendor.storeType}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact Protocol</p>
                                <p className="font-bold text-slate-700 text-sm">{selectedVendor.email}</p>
                                <p className="text-xs text-slate-400">Joined: {selectedVendor.joinedDate}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Catalog Load</p>
                                <p className="font-bold text-indigo-600 text-lg">{selectedVendor.products} Managed Products</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Settlement Snapshot</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 bg-red-50 rounded-3xl border border-red-100">
                                <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1">Rent Outstanding</p>
                                <p className="text-xl font-black text-red-700">UGX {selectedVendor.rentDue.toLocaleString()}</p>
                            </div>
                            <div className="p-5 bg-amber-50 rounded-3xl border border-amber-100">
                                <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-1">VAT Dues</p>
                                <p className="text-xl font-black text-amber-700">UGX {selectedVendor.vatDue.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8">
                        <Button className="w-full h-14 uppercase font-black tracking-widest text-xs shadow-xl bg-slate-900 text-white border-none" onClick={() => setSelectedVendor(null)}>Dismiss Dossier</Button>
                    </div>
                </div>
            </Card>
        </div>
      )}

      {selectedVendorQR && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[400] flex items-center justify-center p-4">
          <Card className="max-w-sm w-full p-10 rounded-[48px] text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
            <button onClick={() => setSelectedVendorQR(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X/></button>
            <div className="w-24 h-24 bg-slate-900 text-white rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <QrCode size={48} />
            </div>
            <h3 className="text-2xl font-black mb-2">{selectedVendorQR.name}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Store ID: {selectedVendorQR.id}</p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
              <p className="text-xs font-bold text-slate-500 mb-1 italic">Location Hash:</p>
              <p className="text-[10px] font-mono text-indigo-600 font-bold truncate">MMIS-{selectedVendorQR.id}-{selectedVendorQR.city.toUpperCase()}</p>
            </div>
            <Button className="w-full h-12 rounded-2xl font-black uppercase text-[10px] bg-slate-900 text-white border-none"><Printer size={16}/> Print Token</Button>
          </Card>
        </div>
      )}
    </div>
  );
};
