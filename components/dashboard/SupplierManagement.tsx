
import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Package, Truck, Star, 
  MoreVertical, CheckCircle, Clock, LayoutDashboard, 
  Boxes, CreditCard, ArrowUpRight, ArrowDownLeft, TrendingUp,
  Warehouse, ShieldCheck, MapPin, DollarSign, ArrowRight,
  Zap, PieChart, Wallet, ShoppingBag, Landmark, X, Smartphone, Lock, Edit, Trash2, Tag, Info,
  ChevronDown, Mail, Printer, Share2, Globe, Award
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { UserProfile, Supplier, SupplierShowcaseItem } from '../../types';

export const SupplierManagement = ({ user }: { user: UserProfile }) => {
  const isSupplier = user.role === 'SUPPLIER';
  const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'MARKET_ADMIN';
  const [activeTab, setActiveTab] = useState<string>(isSupplier ? 'MY_DASHBOARD' : 'DIRECTORY');
  const [search, setSearch] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  
  // Showcase CRUD State
  const [showAddShowcase, setShowAddShowcase] = useState(false);
  const [editingShowcaseItem, setEditingShowcaseItem] = useState<SupplierShowcaseItem | null>(null);
  const [showcaseForm, setShowcaseForm] = useState({ name: '', description: '', priceRange: '', category: 'General' });
  
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: 'S-8801', name: 'Nile Agro-Processing', email: 'supply@nileagro.ug', category: 'Cereals', status: 'ACTIVE', warehouseLocation: 'Jinja Industrial', suppliedItemsCount: 42, rating: 4.8, totalRatings: 124, kycValidated: true, onboardingDate: '2023-01-12', walletBalance: 4800000, showcase: [
        { id: 'SC-01', name: 'Premium Grade Maize', description: 'Sun-dried, moisture level below 12%.', priceRange: 'UGX 150k - 200k / Bag', category: 'Grain' },
    ] },
    { id: 'S-8802', name: 'Kampala Cold Storage', email: 'ops@kp-cold.ug', category: 'Dairy', status: 'ACTIVE', warehouseLocation: 'Bweyogerere', suppliedItemsCount: 12, rating: 4.5, totalRatings: 56, kycValidated: true, onboardingDate: '2023-05-20', walletBalance: 1200000, showcase: [] },
  ]);

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

  const deleteShowcaseItem = (id: string) => {
    if (confirm("Purge this listing from the network showcase?")) {
      setSuppliers(suppliers.map(s => {
        if (s.email === user.email) {
          return {
            ...s,
            showcase: s.showcase?.filter(item => item.id !== id)
          };
        }
        return s;
      }));
    }
  };

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase()));
  }, [suppliers, search]);

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-slate-100">
             <Warehouse size={32} />
           </div>
           <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{isSupplier ? 'Global Fulfillment' : 'Supplier Registry'}</h2>
              <p className="text-slate-500 font-medium text-lg">Supply chain logistics & trade nodes.</p>
           </div>
        </div>
        {isSupplier && (
          <Button onClick={() => { setEditingShowcaseItem(null); setShowcaseForm({ name: '', description: '', priceRange: '', category: 'General' }); setShowAddShowcase(true); }} className="h-14 px-8 font-black uppercase text-xs shadow-xl shadow-indigo-100">
            <Plus size={20}/> New Showcase Listing
          </Button>
        )}
      </div>

      <div className="flex gap-2 bg-slate-100/50 p-2 rounded-2xl w-fit border border-slate-200/50 shadow-inner">
        {isSupplier && <button onClick={() => setActiveTab('MY_DASHBOARD')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'MY_DASHBOARD' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}>My Dashboard</button>}
        {!isSupplier && <button onClick={() => setActiveTab('DIRECTORY')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'DIRECTORY' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}>Registry</button>}
        <button onClick={() => setActiveTab('SHOWCASE')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'SHOWCASE' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}>Showcase</button>
      </div>

      {activeTab === 'DIRECTORY' && (
        <Card className="p-0 overflow-hidden rounded-[32px] shadow-2xl border-slate-100">
           <div className="p-8 bg-slate-50 border-b border-slate-100">
              <Input className="flex-1 mb-0 w-full md:w-96" icon={Search} placeholder="Search suppliers..." value={search} onChange={(e:any) => setSearch(e.target.value)} />
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 border-b border-slate-100">
                     <th className="px-8 py-5">Partner Node</th>
                     <th className="px-8 py-5">Fulfillment Center</th>
                     <th className="px-8 py-5 text-center">Rating</th>
                     <th className="px-8 py-5 text-right">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredSuppliers.map(s => (
                     <tr key={s.id} onClick={() => setSelectedSupplier(s)} className="hover:bg-slate-50/50 group transition-all cursor-pointer">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black group-hover:bg-slate-900 transition-colors shadow-md">{s.name.charAt(0)}</div>
                              <div>
                                 <p className="text-sm font-black text-slate-800 tracking-tight">{s.name}</p>
                                 <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{s.id}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-xs font-bold text-slate-600">{s.warehouseLocation} Hub</td>
                        <td className="px-8 py-6 text-center">
                           <div className="flex items-center justify-center gap-1.5 text-amber-500">
                              <Star size={14} fill="currentColor" />
                              <span className="text-sm font-black">{s.rating}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <Button variant="secondary" className="text-[10px] font-black uppercase h-9 px-4">View Dossier</Button>
                        </td>
                     </tr>
                  ))}
                </tbody>
             </table>
           </div>
        </Card>
      )}

      {activeTab === 'SHOWCASE' && (
        <div className="space-y-6 animate-fade-in">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Public Trade Listings</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {suppliers.flatMap(s => s.showcase || []).map(item => (
                <Card key={item.id} className="p-8 rounded-[32px] border-l-8 border-l-indigo-600 hover:shadow-2xl transition-all relative">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner"><Package size={24}/></div>
                    {isSupplier && suppliers.find(s => s.email === user.email)?.showcase?.some(si => si.id === item.id) && (
                      <div className="flex gap-1">
                        <button onClick={() => { setEditingShowcaseItem(item); setShowcaseForm({ name: item.name, description: item.description, priceRange: item.priceRange, category: item.category }); setShowAddShowcase(true); }} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><Edit size={14}/></button>
                        <button onClick={() => deleteShowcaseItem(item.id)} className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                      </div>
                    )}
                  </div>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight mb-2">{item.name}</h4>
                  <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-4">{item.category}</p>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6 line-clamp-2">{item.description}</p>
                  <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{item.priceRange}</p>
                    {!isSupplier && <Button className="h-8 px-4 text-[8px] font-black uppercase">RFQ Sync</Button>}
                  </div>
                </Card>
              ))}
           </div>
        </div>
      )}

      {/* Supplier Detail Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-fade-in">
           <Card className="w-full max-w-2xl shadow-2xl border-none rounded-[48px] p-0 relative bg-white overflow-hidden max-h-[90vh] flex flex-col">
              <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
              <button onClick={() => setSelectedSupplier(null)} className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-full transition-all text-slate-400"><X size={32}/></button>
              
              <div className="p-12 border-b border-slate-100 shrink-0">
                 <div className="flex gap-8 items-center mb-8">
                    <div className="w-24 h-24 bg-slate-900 text-white rounded-[32px] flex items-center justify-center text-4xl font-black shadow-2xl ring-8 ring-indigo-50">{selectedSupplier.name.charAt(0)}</div>
                    <div>
                       <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">{selectedSupplier.name}</h3>
                       <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] font-black bg-indigo-600 text-white px-3 py-1 rounded-full uppercase tracking-widest">{selectedSupplier.category} Sector</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><MapPin size={12}/> {selectedSupplier.warehouseLocation} Center</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-3 gap-6">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Trust Index</p>
                       <p className="text-2xl font-black text-amber-500 flex items-center justify-center gap-1">{selectedSupplier.rating} <Star size={16} fill="currentColor"/></p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Supplied</p>
                       <p className="text-2xl font-black text-slate-900">{selectedSupplier.suppliedItemsCount}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Status</p>
                       <p className="text-xl font-black text-emerald-600 uppercase">VERIFIED</p>
                    </div>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <h4 className="text-[10px] uppercase text-slate-400 font-black tracking-widest flex items-center gap-2"><Mail size={14} className="text-indigo-400"/> Primary Outreach</h4>
                       <p className="text-sm font-bold text-slate-800">{selectedSupplier.email}</p>
                    </div>
                    <div className="space-y-6">
                       <h4 className="text-[10px] uppercase text-slate-400 font-black tracking-widest flex items-center gap-2"><Truck size={14} className="text-indigo-400"/> Logistics Node</h4>
                       <p className="text-sm font-bold text-slate-800">{selectedSupplier.warehouseLocation} Industrial Hub</p>
                    </div>
                 </div>
                 
                 <div>
                    <h4 className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-6 flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-500"/> Trade Compliance</h4>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                       <div className="flex gap-3 items-center">
                          <Award className="text-indigo-600" />
                          <span className="text-xs font-bold text-slate-700">ISO 9001 Sourcing Certified</span>
                       </div>
                       <span className="text-[8px] font-black bg-indigo-600 text-white px-2 py-1 rounded">2024 Valid</span>
                    </div>
                 </div>
              </div>

              <div className="p-10 bg-slate-50 border-t border-slate-100 flex gap-4 shrink-0">
                 <Button variant="secondary" onClick={() => setSelectedSupplier(null)} className="flex-1 h-14 font-black uppercase text-xs tracking-widest">Dismiss</Button>
                 {isAdmin && <Button className="flex-[2] h-14 bg-indigo-600 border-none shadow-2xl font-black uppercase text-xs tracking-widest text-white">Create Direct Requisition</Button>}
              </div>
           </Card>
        </div>
      )}

      {showAddShowcase && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[300] flex items-center justify-center p-4">
           <Card className="w-full max-w-xl shadow-2xl rounded-[40px] p-12 bg-white relative overflow-hidden border-none">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{editingShowcaseItem ? 'Edit Showcase Entry' : 'New Showcase Listing'}</h3>
                 <button onClick={() => setShowAddShowcase(false)} className="text-slate-400 hover:text-slate-600"><X size={28}/></button>
              </div>
              <div className="space-y-6">
                 <Input label="Listing Title *" placeholder="e.g. Bulk Poultry Supply" value={showcaseForm.name} onChange={(e:any)=>setShowcaseForm({...showcaseForm, name: e.target.value})} />
                 <Input label="Price Range Estimate *" placeholder="UGX 2k - 5k / unit" value={showcaseForm.priceRange} onChange={(e:any)=>setShowcaseForm({...showcaseForm, priceRange: e.target.value})} />
                 <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Sector Classification</label>
                    <select 
                       value={showcaseForm.category}
                       onChange={(e) => setShowcaseForm({...showcaseForm, category: e.target.value})}
                       className="w-full bg-black text-white border-2 border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold outline-none shadow-xl appearance-none"
                    >
                       <option value="General">General Trade</option>
                       <option value="Grain">Cereals & Grain</option>
                       <option value="Dairy">Dairy Products</option>
                       <option value="Electronics">Bulk Electronics</option>
                    </select>
                 </div>
                 <Input label="Technical Summary *" multiline placeholder="Quality metrics, delivery times, sourcing info..." value={showcaseForm.description} onChange={(e:any)=>setShowcaseForm({...showcaseForm, description: e.target.value})} />
                 <div className="flex gap-4 pt-4">
                    <Button variant="secondary" onClick={() => setShowAddShowcase(false)} className="flex-1">Cancel</Button>
                    <Button onClick={handleSaveShowcase} className="flex-2 bg-indigo-600 border-none shadow-xl text-white">Commit Listing</Button>
                 </div>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
};
