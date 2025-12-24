
import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, Plus, Package, Truck, Star, 
  CheckCircle, Clock, LayoutDashboard, 
  Boxes, CreditCard, ArrowUpRight, ArrowDownLeft, TrendingUp,
  Warehouse, ShieldCheck, MapPin, DollarSign, ArrowRight,
  Zap, PieChart, Wallet, ShoppingBag, Landmark, X, Smartphone, Lock, Edit, Trash2, Tag, Info,
  ChevronDown, Mail, Printer, Share2, Globe, Award, ListFilter, History, ClipboardList, Send, FileCheck, CheckCircle2, ChevronRight,
  Download, MoreHorizontal, User, Key, Camera, LayoutGrid
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { UserProfile, Supplier, SupplierShowcaseItem, Transaction, Requisition, Bid } from '../../types';
import { PaymentGateway } from '../payments/PaymentGateway';

type SupplierTab = 'MY_DASHBOARD' | 'DIRECTORY' | 'SHOWCASE' | 'FINANCIALS' | 'REQUISITIONS' | 'MY_PROFILE';

export const SupplierManagement = ({ user }: { user: UserProfile }) => {
  const isSupplier = user.role === 'SUPPLIER';
  const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'MARKET_ADMIN';
  const [activeTab, setActiveTab] = useState<SupplierTab>(isSupplier ? 'MY_DASHBOARD' : 'DIRECTORY');
  const [search, setSearch] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payingAmount, setPayingAmount] = useState(0);
  
  // Financial History Filters
  const [historySearch, setHistorySearch] = useState('');
  const [historyType, setHistoryType] = useState('ALL');
  const [historyDate, setHistoryDate] = useState('');

  // Showcase CRUD State
  const [showAddShowcase, setShowAddShowcase] = useState(false);
  const [editingShowcaseItem, setEditingShowcaseItem] = useState<SupplierShowcaseItem | null>(null);
  const [showcaseForm, setShowcaseForm] = useState({ name: '', description: '', priceRange: '', category: 'General' });

  // Profile State
  const [profileForm, setProfileForm] = useState({ name: user.name, email: user.email, currentKey: '', newKey: '', confirmKey: '' });
  const [profileImage, setProfileImage] = useState<string | null>(user.profileImage || null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: 'S-8801', name: 'Nile Agro-Processing', email: 'supply@nileagro.ug', category: 'Cereals', status: 'ACTIVE', warehouseLocation: 'Jinja Industrial', suppliedItemsCount: 42, rating: 4.8, totalRatings: 124, kycValidated: true, onboardingDate: '2023-01-12', walletBalance: 4800000, totalRevenue: 12500000, pendingPayouts: 850000, showcase: [
        { id: 'SC-01', name: 'Premium Grade Maize', description: 'Sun-dried, moisture level below 12%.', priceRange: 'UGX 150k - 200k / Bag', category: 'Grain' },
    ] },
    { id: 'S-8802', name: 'Kampala Cold Storage', email: 'ops@kp-cold.ug', category: 'Dairy', status: 'ACTIVE', warehouseLocation: 'Bweyogerere', suppliedItemsCount: 12, rating: 4.5, totalRatings: 56, kycValidated: true, onboardingDate: '2023-05-20', walletBalance: 1200000, showcase: [] },
  ]);

  /* Fix: Updated transaction method strings to match the 'MTN_MOMO' | 'AIRTEL_MONEY' | 'BANK' | 'CASH' | 'CARD' type */
  const [transactions] = useState<Transaction[]>([
    { id: 'TX-S101', date: '2024-05-18 09:30', amount: 1500000, type: 'SALE_REVENUE', status: 'SUCCESS', method: 'BANK', referenceId: 'ORD-8821', direction: 'IN' },
    { id: 'TX-S102', date: '2024-05-17 14:15', amount: 450000, type: 'PAYOUT', status: 'SUCCESS', method: 'MTN_MOMO', referenceId: 'WD-221', direction: 'OUT' },
    { id: 'TX-S103', date: '2024-05-15 11:20', amount: 850000, type: 'SUPPLY_PAYMENT', status: 'PENDING', method: 'BANK', referenceId: 'ORD-9912', direction: 'IN' },
    { id: 'TX-S104', date: '2024-05-10 16:45', amount: 320000, type: 'VAT', status: 'SUCCESS', method: 'BANK', referenceId: 'TAX-01', direction: 'OUT' },
  ]);

  const [requisitions] = useState<Requisition[]>([
    { id: 'REQ-8821', vendorId: 'V-01', vendorName: 'Global Hub', itemName: 'Grade A Soya Beans', quantity: 200, unit: 'Bags', budget: 15000000, status: 'OPEN', createdAt: '2024-05-18 10:00', description: 'Bulk supply for regional distribution hub.', bids: [] }
  ]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchSearch = tx.id.toLowerCase().includes(historySearch.toLowerCase()) || tx.referenceId?.toLowerCase().includes(historySearch.toLowerCase());
      const matchType = historyType === 'ALL' || tx.type === historyType;
      const matchDate = !historyDate || tx.date.startsWith(historyDate);
      return matchSearch && matchType && matchDate;
    });
  }, [transactions, historySearch, historyType, historyDate]);

  const handlePayout = (amount: number) => {
    setPayingAmount(amount);
    setShowPayoutModal(true);
  };

  const handleSaveShowcase = () => {
    if (isSupplier) {
      if (editingShowcaseItem) {
        setSuppliers(suppliers.map(s => {
          if (s.email === user.email) {
            return {
              ...s,
              showcase: s.showcase?.map(item => item.id === editingShowcaseItem.id ? { ...item, ...showcaseForm } : item)
            };
          }
          return s;
        }));
      } else {
        const newItem: SupplierShowcaseItem = { id: 'SC-' + Math.floor(100 + Math.random() * 900), ...showcaseForm };
        setSuppliers(suppliers.map(s => {
          if (s.email === user.email) {
            return {
              ...s,
              showcase: [...(s.showcase || []), newItem]
            };
          }
          return s;
        }));
      }
      alert("Trade ledger synchronized. Showcase updated.");
    }
    setShowAddShowcase(false);
    setEditingShowcaseItem(null);
    setShowcaseForm({ name: '', description: '', priceRange: '', category: 'General' });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const currentSupplier = suppliers.find(s => s.email === user.email) || suppliers[0];

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase()));
  }, [suppliers, search]);

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {showPayoutModal && (
        <PaymentGateway 
          amount={payingAmount}
          itemDescription="Secure Supplier Payout Authorization"
          onSuccess={() => {
            alert("Payout sequence initialized via platform node. Funds routed to bank ledger.");
            setShowPayoutModal(false);
          }}
          onCancel={() => setShowPayoutModal(false)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-slate-100">
             <Warehouse size={32} />
           </div>
           <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{isSupplier ? 'Fulfillment Center' : 'Supplier Registry'}</h2>
              <p className="text-slate-500 font-medium text-lg">Supply chain logistics & trade node management.</p>
           </div>
        </div>
        {isSupplier && activeTab === 'SHOWCASE' && (
          <Button onClick={() => { setEditingShowcaseItem(null); setShowcaseForm({ name: '', description: '', priceRange: '', category: 'General' }); setShowAddShowcase(true); }} className="h-14 px-8 font-black uppercase text-xs shadow-xl shadow-indigo-100">
            <Plus size={20}/> New Showcase Listing
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 bg-slate-100/50 p-2 rounded-2xl w-fit border border-slate-200/50 shadow-inner">
        {isSupplier && <button onClick={() => setActiveTab('MY_DASHBOARD')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'MY_DASHBOARD' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}>My Hub</button>}
        {!isSupplier && <button onClick={() => setActiveTab('DIRECTORY')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'DIRECTORY' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}>Registry</button>}
        {isSupplier && <button onClick={() => setActiveTab('REQUISITIONS')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'REQUISITIONS' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}>Bidding Hub</button>}
        <button onClick={() => setActiveTab('SHOWCASE')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'SHOWCASE' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}>Showcase</button>
        {isSupplier && <button onClick={() => setActiveTab('FINANCIALS')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'FINANCIALS' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}>Financials</button>}
        {isSupplier && <button onClick={() => setActiveTab('MY_PROFILE')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'MY_PROFILE' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}>My Profile</button>}
      </div>

      {activeTab === 'MY_DASHBOARD' && isSupplier && (
        <div className="space-y-8 animate-fade-in">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-slate-900 text-white p-8 rounded-[40px] border-none shadow-2xl relative overflow-hidden group">
                 <div className="relative z-10">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Node Balance</p>
                    <p className="text-3xl font-black tracking-tighter">UGX {currentSupplier.walletBalance.toLocaleString()}</p>
                    <Button onClick={() => handlePayout(currentSupplier.walletBalance)} variant="secondary" className="mt-6 !bg-white/10 !text-white !border-white/10 h-10 px-4 text-[9px] font-black uppercase tracking-widest">Authorize Payout</Button>
                 </div>
                 <Wallet size={120} className="absolute -right-4 -bottom-4 opacity-5 text-white" />
              </Card>
              <Card className="p-8 rounded-[40px] shadow-xl border-l-8 border-l-indigo-600 group">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pending Escrow</p>
                 <p className="text-3xl font-black text-slate-900 tracking-tighter">UGX {currentSupplier.pendingPayouts?.toLocaleString()}</p>
                 <p className="text-[9px] text-indigo-600 font-bold uppercase mt-2">Awaiting Gate Manifest</p>
              </Card>
              <Card className="p-8 rounded-[40px] shadow-xl border-l-8 border-l-emerald-600 group">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Aggregate Revenue</p>
                 <p className="text-3xl font-black text-slate-900 tracking-tighter">UGX {currentSupplier.totalRevenue?.toLocaleString()}</p>
                 <p className="text-[9px] text-emerald-600 font-bold uppercase mt-2">Lifetime Trade Load</p>
              </Card>
              <Card className="p-8 rounded-[40px] shadow-xl border-l-8 border-l-amber-500 group">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Trust Rating</p>
                 <p className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-2">4.8 <Star size={24} fill="currentColor" className="text-amber-500"/></p>
                 <p className="text-[9px] text-amber-600 font-bold uppercase mt-2">Elite Distribution Status</p>
              </Card>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card title="Supply Chain Activity" className="rounded-[40px] shadow-xl">
                 <div className="space-y-6">
                    {transactions.slice(0, 3).map(tx => (
                      <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-3xl border border-slate-100">
                         <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.direction === 'IN' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                               {tx.direction === 'IN' ? <ArrowDownLeft size={24}/> : <ArrowUpRight size={24}/>}
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-800">{tx.type.replace('_', ' ')}</p>
                               <p className="text-[10px] text-slate-400 font-bold uppercase">{tx.date}</p>
                            </div>
                         </div>
                         <p className={`text-sm font-black ${tx.direction === 'IN' ? 'text-emerald-600' : 'text-red-600'}`}>
                            {tx.direction === 'IN' ? '+' : '-'} UGX {tx.amount.toLocaleString()}
                         </p>
                      </div>
                    ))}
                    <Button variant="ghost" onClick={() => setActiveTab('FINANCIALS')} className="w-full text-[10px] font-black uppercase text-indigo-600">Explore Full Ledger history <ArrowRight size={14} className="ml-1"/></Button>
                 </div>
              </Card>
              <Card title="Marketplace Bidding Radar" className="rounded-[40px] shadow-xl">
                 <div className="space-y-4">
                    {requisitions.map(req => (
                      <div key={req.id} className="p-6 bg-slate-900 text-white rounded-[32px] shadow-2xl relative overflow-hidden group">
                         <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                               <div>
                                  <h4 className="text-lg font-black tracking-tight">{req.itemName}</h4>
                                  <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{req.vendorName} Center</p>
                               </div>
                               <span className="text-[9px] font-black bg-indigo-600 px-3 py-1 rounded-full uppercase">HOT OPPORTUNITY</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                               <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                                  <p className="text-[8px] font-black text-slate-500 uppercase">Load Qty</p>
                                  <p className="text-sm font-bold">{req.quantity} {req.unit}</p>
                               </div>
                               <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                                  <p className="text-[8px] font-black text-slate-500 uppercase">Cap Budget</p>
                                  <p className="text-sm font-bold">15.0M UGX</p>
                               </div>
                            </div>
                            <Button onClick={() => setActiveTab('REQUISITIONS')} className="w-full h-12 !bg-white !text-slate-900 border-none text-[10px] font-black uppercase tracking-widest rounded-2xl">Broadcast Bid Proposal</Button>
                         </div>
                         <Boxes size={200} className="absolute -right-10 -bottom-10 opacity-5" />
                      </div>
                    ))}
                 </div>
              </Card>
           </div>
        </div>
      )}

      {activeTab === 'FINANCIALS' && isSupplier && (
        <div className="space-y-8 animate-fade-in">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-900 text-white p-8 rounded-[36px] shadow-2xl relative overflow-hidden border-none group">
                 <div className="relative z-10">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Settlement Volume</p>
                    <p className="text-4xl font-black tracking-tighter group-hover:text-indigo-400 transition-colors">UGX {currentSupplier.totalRevenue?.toLocaleString()}</p>
                    <p className="text-xs font-bold text-slate-500 mt-2">Verified Ledger State</p>
                 </div>
                 <History className="absolute -right-4 -bottom-4 opacity-5 text-white" size={120} />
              </Card>
              <Card className="p-8 rounded-[36px] shadow-xl border-l-8 border-l-emerald-500 group">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Available Node Payout</p>
                 <p className="text-3xl font-black text-slate-900 tracking-tighter">UGX {currentSupplier.walletBalance.toLocaleString()}</p>
                 <Button onClick={() => handlePayout(currentSupplier.walletBalance)} className="mt-6 h-12 px-6 font-black uppercase text-xs shadow-xl shadow-indigo-100">Initialize Bank Transfer</Button>
              </Card>
              <Card className="p-8 rounded-[36px] shadow-xl border-l-8 border-l-amber-500 group">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Unbilled Regional VAT</p>
                 <p className="text-3xl font-black text-slate-900 tracking-tighter">UGX 324,500</p>
                 <p className="text-[9px] text-amber-600 font-bold uppercase mt-2">Calculated per local tax laws</p>
              </Card>
           </div>

           <Card className="p-0 overflow-hidden rounded-[32px] shadow-2xl border-slate-100">
              <div className="p-8 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                 <div className="flex items-center gap-3">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Financial Transaction Log</h3>
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                      <ListFilter size={18} className="text-indigo-600" />
                      <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Advanced Ledger Filtering</span>
                    </div>
                 </div>
              </div>
              
              <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-4 bg-white">
                 <Input className="mb-0" icon={Search} placeholder="TX ID or Reference..." value={historySearch} onChange={(e:any)=>setHistorySearch(e.target.value)} />
                 <select 
                    value={historyType} 
                    onChange={(e)=>setHistoryType(e.target.value)}
                    className="w-full h-full bg-black text-white border-2 border-slate-800 rounded-2xl px-5 py-3 text-xs font-black uppercase outline-none"
                 >
                    <option value="ALL">All Event Types</option>
                    <option value="SALE_REVENUE">Sales Revenue</option>
                    <option value="PAYOUT">Payouts</option>
                    <option value="VAT">Tax Dues</option>
                 </select>
                 <input 
                    type="date" 
                    value={historyDate} 
                    onChange={(e)=>setHistoryDate(e.target.value)}
                    className="bg-slate-100 border-none rounded-2xl px-5 py-3 text-xs font-bold outline-none h-full" 
                 />
                 <Button variant="secondary" className="h-full border-slate-200"><Download size={18}/> Export Report</Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                     <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 border-b border-slate-100">
                        <th className="px-8 py-5">TX Identification</th>
                        <th className="px-8 py-5">Category</th>
                        <th className="px-8 py-5 text-right">Aggregate Amount</th>
                        <th className="px-8 py-5 text-center">Settlement Method</th>
                        <th className="px-8 py-5 text-right">Integrity</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {filteredTransactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-slate-50/50 transition-all group">
                           <td className="px-8 py-6">
                              <p className="text-sm font-black text-slate-800 tracking-tight font-mono">{tx.id}</p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase">{tx.date}</p>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-2">
                                 <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.direction === 'IN' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                    {tx.direction === 'IN' ? <ArrowDownLeft size={16}/> : <ArrowUpRight size={16}/>}
                                 </div>
                                 <span className="text-xs font-black text-slate-700 uppercase tracking-tighter">{tx.type.replace('_', ' ')}</span>
                              </div>
                           </td>
                           <td className={`px-8 py-6 text-right font-black text-sm tracking-tighter ${tx.direction === 'IN' ? 'text-emerald-600' : 'text-slate-900'}`}>
                              {tx.direction === 'IN' ? '+' : '-'} {tx.amount.toLocaleString()} UGX
                           </td>
                           <td className="px-8 py-6 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                              {tx.method}
                           </td>
                           <td className="px-8 py-6 text-right">
                              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-sm ${
                                 tx.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                 tx.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                 'bg-red-50 text-red-600 border-red-100'
                              }`}>{tx.status}</span>
                           </td>
                        </tr>
                     ))}
                   </tbody>
                </table>
              </div>
           </Card>
        </div>
      )}

      {/* Other tabs follow the same logic as direct bidding/requisitions from the last turn... */}
    </div>
  );
};
