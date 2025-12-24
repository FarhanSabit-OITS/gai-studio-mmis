import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Edit, Trash2, Download, CheckCircle, XCircle, 
  Eye, ChevronDown, User, MapPin, DollarSign, Calendar, 
  CreditCard, History, ArrowRight, LayoutGrid, Layers, ShieldCheck, 
  Zap, Clock, Mail, Package, QrCode, X, Printer, Share2, Camera, Save, Lock, Info, CheckCircle2, Shield,
  Store, AlertCircle, ShoppingBag, Copy, AlertTriangle, FileCheck, HelpCircle, TrendingUp, RotateCcw,
  ArrowUpRight, ArrowDownLeft, SlidersHorizontal, Tag, Briefcase, Building, Wallet, ListFilter,
  Users
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Vendor, UserProfile, Product } from '../../types';
import { PaymentGateway } from '../payments/PaymentGateway';

type ManagementTab = 'DIRECTORY' | 'FINANCIALS' | 'MY_PRODUCTS';

export const VendorManagement = ({ user }: { user: UserProfile }) => {
  const isVendor = user.role === 'VENDOR';
  const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'MARKET_ADMIN';
  const [activeTab, setActiveTab] = useState<ManagementTab>(isVendor ? 'MY_PRODUCTS' : 'DIRECTORY');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'PENDING' | 'INACTIVE'>('ALL');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedVendorQR, setSelectedVendorQR] = useState<Vendor | null>(null);
  const [payingVendor, setPayingVendor] = useState<Vendor | null>(null);
  
  const [vendors, setVendors] = useState<Vendor[]>([
    { id: 'V-001', name: 'Global Tech', email: 'contact@globaltech.com', category: 'Electronics', status: 'ACTIVE', products: 124, joinedDate: '2023-10-12', gender: 'MALE', age: 34, city: 'Mbarara', market: 'Mbarara Central', rentDue: 0, vatDue: 0, level: 'Ground Floor', section: 'Electronics Hub', storeType: 'SHOP', ownershipType: 'LEASED' },
    { id: 'V-002', name: 'Fresh Foods Co.', email: 'sales@freshfoods.io', category: 'Groceries', status: 'PENDING', products: 45, joinedDate: '2024-01-05', gender: 'FEMALE', age: 28, city: 'Kabale', market: 'Bugongi', rentDue: 150000, vatDue: 45000, level: 'Level 1', section: 'Fresh Produce Area', storeType: 'STALL', ownershipType: 'OWNED' },
    { id: 'V-003', name: 'West End Mart', email: 'admin@westend.ug', category: 'General', status: 'INACTIVE', products: 0, joinedDate: '2024-03-12', gender: 'MALE', age: 41, city: 'Jinja', market: 'Jinja Main', rentDue: 80000, vatDue: 12000, level: 'Level 2', section: 'Aisle B', storeType: 'KIOSK', ownershipType: 'SUB-LEASED' },
  ]);

  const [products, setProducts] = useState<Product[]>([
    { id: 'P-101', name: 'Premium Basmati', vendor: user.name, stock: 45, price: 120000, status: 'HEALTHY', category: 'Food', description: 'Premium grade basmati rice.' },
    { id: 'P-102', name: 'Refined Sugar', vendor: user.name, stock: 4, price: 85000, status: 'CRITICAL', category: 'Food', description: 'Double refined white sugar.' },
  ]);

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({ name: '', price: '', stock: '', category: 'General', description: '' });

  // Financial Totals Calculation
  const financialSummary = useMemo(() => {
    return vendors.reduce((acc, v) => ({
      totalVendors: acc.totalVendors + 1,
      totalRent: acc.totalRent + v.rentDue,
      totalVAT: acc.totalVAT + v.vatDue,
    }), { totalVendors: 0, totalRent: 0, totalVAT: 0 });
  }, [vendors]);

  const handleSaveProduct = () => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...productForm, price: Number(productForm.price), stock: Number(productForm.stock), status: Number(productForm.stock) < 5 ? 'CRITICAL' : 'HEALTHY' } : p));
    } else {
      const newP: Product = {
        id: 'P-' + Math.floor(100 + Math.random() * 900),
        name: productForm.name,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        vendor: user.name,
        status: Number(productForm.stock) < 5 ? 'CRITICAL' : 'HEALTHY',
        category: productForm.category,
        description: productForm.description
      };
      setProducts([newP, ...products]);
    }
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const deleteProduct = (id: string) => {
    if (confirm("Confirm removal of this item from your catalog?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleRentPayment = (vendor: Vendor) => {
    setPayingVendor(vendor);
  };

  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === 'ALL' || v.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [vendors, search, filterStatus]);

  return (
    <div className="space-y-6 animate-fade-in relative pb-20">
      {payingVendor && (
        <PaymentGateway 
          amount={payingVendor.rentDue + payingVendor.vatDue}
          itemDescription={`Outstanding Rent & VAT for ${payingVendor.name}`}
          onSuccess={() => {
            setVendors(vendors.map(v => v.id === payingVendor.id ? { ...v, rentDue: 0, vatDue: 0 } : v));
            setPayingVendor(null);
          }}
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
              <p className="text-slate-500 font-medium text-lg">Infrastructure management & trade oversight.</p>
           </div>
        </div>
        {isVendor && activeTab === 'MY_PRODUCTS' && (
          <Button onClick={() => { setEditingProduct(null); setProductForm({ name: '', price: '', stock: '', category: 'General', description: '' }); setShowProductForm(true); }} className="h-14 px-8 font-black uppercase text-xs shadow-xl shadow-indigo-100">
            <Plus size={20}/> New Listing
          </Button>
        )}
      </div>

      <div className="flex gap-2 bg-slate-100/50 p-2 rounded-2xl w-fit border border-slate-200/50 shadow-inner">
        {!isVendor && <button onClick={() => setActiveTab('DIRECTORY')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'DIRECTORY' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}>Node Directory</button>}
        {isVendor && <button onClick={() => setActiveTab('MY_PRODUCTS')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'MY_PRODUCTS' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}>My Catalog</button>}
        <button onClick={() => setActiveTab('FINANCIALS')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'FINANCIALS' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}>{isVendor ? 'Payments' : 'Financials'}</button>
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
                     <th className="px-8 py-5">Operational Node</th>
                     <th className="px-8 py-5">Location</th>
                     <th className="px-8 py-5">Status</th>
                     <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredVendors.map(v => (
                     <tr key={v.id} onClick={() => setSelectedVendor(v)} className="hover:bg-slate-50/50 group transition-all cursor-pointer">
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
                           <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border shadow-sm ${
                             v.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                             v.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                             'bg-red-50 text-red-600 border-red-100'
                           }`}>{v.status}</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button onClick={(e) => { e.stopPropagation(); setSelectedVendorQR(v); }} className="p-2.5 bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all"><QrCode size={18} /></button>
                        </td>
                     </tr>
                  ))}
                  {filteredVendors.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-slate-400">
                        <Search size={48} className="mx-auto mb-4 opacity-10" />
                        <p className="font-black uppercase text-xs tracking-widest">No nodes match your filter criteria.</p>
                      </td>
                    </tr>
                  )}
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
                <div className="flex gap-2">
                  <button onClick={() => { setEditingProduct(p); setProductForm({ name: p.name, price: p.price.toString(), stock: p.stock.toString(), category: p.category, description: p.description || '' }); setShowProductForm(true); }} className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600"><Edit size={18}/></button>
                  <button onClick={() => deleteProduct(p.id)} className="p-2.5 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-600"><Trash2 size={18}/></button>
                </div>
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
            <div className="col-span-full py-20 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
               <ShoppingBag size={48} className="mx-auto mb-4 text-slate-300" />
               <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">No products in catalog. Initialize your inventory listings.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'FINANCIALS' && (
        <div className="space-y-6 animate-fade-in">
           {/* Financial Summary Section */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-900 text-white p-8 rounded-[36px] shadow-2xl relative overflow-hidden border-none group">
                 <div className="relative z-10">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Aggregate Registry</p>
                    <p className="text-4xl font-black tracking-tighter group-hover:text-indigo-400 transition-colors">{financialSummary.totalVendors}</p>
                    <p className="text-xs font-bold text-slate-500 mt-2">Active Trade Entities</p>
                 </div>
                 {/* Fixed missing import for Users icon */}
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
                    <p className="text-3xl font-black tracking-tighter text-slate-900">UGX {financialSummary.totalVAT.toLocaleString()}</p>
                    <div className="mt-4 flex items-center gap-2 text-[10px] text-amber-600 font-black bg-amber-50 px-3 py-1.5 rounded-full w-fit border border-amber-100">
                       <History size={14} /> Regional Tax Sync
                    </div>
                 </div>
              </Card>
           </div>

           <Card className="p-0 overflow-hidden rounded-[32px] shadow-2xl border-slate-100">
              <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Financial Ledger</h3>
                 <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                    <Wallet size={18} className="text-indigo-600" />
                    <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Settlement Node: Delta</span>
                 </div>
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
                     {vendors.map(v => (
                        <tr key={v.id} className="hover:bg-slate-50/50 transition-all">
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
                                   onClick={() => handleRentPayment(v)}
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

      {/* Vendor Detail Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-fade-in">
           <Card className="w-full max-w-2xl shadow-2xl border-none rounded-[48px] p-0 relative bg-white overflow-hidden max-h-[90vh] flex flex-col">
              <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
              <button onClick={() => setSelectedVendor(null)} className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-full transition-all text-slate-400"><X size={32}/></button>
              
              <div className="p-12 border-b border-slate-100 shrink-0">
                 <div className="flex gap-8 items-center mb-8">
                    <div className="w-24 h-24 bg-slate-900 text-white rounded-[32px] flex items-center justify-center text-4xl font-black shadow-2xl ring-8 ring-indigo-50">{selectedVendor.name.charAt(0)}</div>
                    <div>
                       <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">{selectedVendor.name}</h3>
                       <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] font-black bg-indigo-600 text-white px-3 py-1 rounded-full uppercase tracking-widest">{selectedVendor.category}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><MapPin size={12}/> {selectedVendor.city} Hub</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-3 gap-6">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Products</p>
                       <p className="text-2xl font-black text-slate-900">{selectedVendor.products}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Dues (UGX)</p>
                       <p className={`text-xl font-black ${selectedVendor.rentDue > 0 ? 'text-red-500' : 'text-emerald-600'}`}>{selectedVendor.rentDue.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Tenure</p>
                       <p className="text-xl font-black text-slate-800">{new Date(selectedVendor.joinedDate).getFullYear()}</p>
                    </div>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <h4 className="text-[10px] uppercase text-slate-400 font-black tracking-widest flex items-center gap-2"><Mail size={14} className="text-indigo-400"/> Communications</h4>
                       <div className="space-y-4">
                          <div>
                             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Registry Email</p>
                             <p className="text-sm font-bold text-slate-800">{selectedVendor.email}</p>
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Operational Status</p>
                             <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">{selectedVendor.status} Node</p>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <h4 className="text-[10px] uppercase text-slate-400 font-black tracking-widest flex items-center gap-2"><Building size={14} className="text-indigo-400"/> Hub Infrastructure</h4>
                       <div className="space-y-4">
                          <div>
                             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Spatial Allocation</p>
                             <p className="text-sm font-bold text-slate-800">{selectedVendor.level}, {selectedVendor.section}</p>
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Store Entity Type</p>
                             <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest">{selectedVendor.storeType} • {selectedVendor.ownershipType}</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-10 bg-slate-50 border-t border-slate-100 flex gap-4 shrink-0">
                 <Button variant="secondary" onClick={() => setSelectedVendor(null)} className="flex-1 h-14 font-black uppercase text-xs tracking-widest">Dismiss Dossier</Button>
                 {isAdmin && <Button className="flex-2 h-14 bg-indigo-600 border-none shadow-2xl shadow-indigo-100 font-black uppercase text-xs tracking-widest text-white">Initialize Admin Sync</Button>}
              </div>
           </Card>
        </div>
      )}

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[300] flex items-center justify-center p-4">
           <Card className="w-full max-w-xl shadow-2xl rounded-[40px] p-12 bg-white relative overflow-hidden border-none">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{editingProduct ? 'Edit Catalog Item' : 'New Catalog Listing'}</h3>
                 <button onClick={() => setShowProductForm(false)} className="text-slate-400 hover:text-slate-600"><X size={28}/></button>
              </div>
              <div className="space-y-6">
                 <Input label="Commodity Designation *" placeholder="e.g. Premium Basmati Rice" value={productForm.name} onChange={(e:any)=>setProductForm({...productForm, name: e.target.value})} />
                 <div className="grid grid-cols-2 gap-6">
                    <Input label="Unit Price (UGX) *" type="number" placeholder="0.00" value={productForm.price} onChange={(e:any)=>setProductForm({...productForm, price: e.target.value})} />
                    <Input label="Starting Reserve *" type="number" placeholder="0" value={productForm.stock} onChange={(e:any)=>setProductForm({...productForm, stock: e.target.value})} />
                 </div>
                 <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Classification Segment</label>
                    <div className="relative group">
                       <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                       <select 
                          value={productForm.category}
                          onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                          className="w-full bg-black text-white border-2 border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold outline-none appearance-none shadow-xl transition-all"
                       >
                          <option value="General">General</option>
                          <option value="Food">Food & Produce</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Clothing">Apparel</option>
                       </select>
                       <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    </div>
                 </div>
                 <Input label="Technical Context" multiline placeholder="Moisture levels, sourcing info, etc..." value={productForm.description} onChange={(e:any)=>setProductForm({...productForm, description: e.target.value})} />
                 
                 <div className="flex gap-4 pt-4">
                    <Button variant="secondary" onClick={() => setShowProductForm(false)} className="flex-1 h-14 font-black uppercase text-[10px]">Cancel</Button>
                    <Button onClick={handleSaveProduct} className="flex-2 h-14 bg-indigo-600 border-none shadow-xl font-black uppercase text-[10px] text-white">Save to Ledger</Button>
                 </div>
              </div>
           </Card>
        </div>
      )}

      {selectedVendorQR && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-fade-in">
           <Card className="w-full max-sm text-center py-12 relative overflow-hidden rounded-[48px] border-none bg-white">
              <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
              <button onClick={() => setSelectedVendorQR(null)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400"><X size={24}/></button>
              <div className="mb-8">
                 <div className="w-28 h-28 bg-slate-900 text-white rounded-[36px] flex items-center justify-center mx-auto mb-6 shadow-2xl ring-8 ring-slate-100">
                    <QrCode size={56} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{selectedVendorQR.name}</h3>
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">Verified Hub Node</p>
              </div>
              <div className="bg-slate-50 p-6 mx-8 rounded-[24px] space-y-3 mb-8 text-left border border-slate-100 shadow-inner">
                 <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400 uppercase tracking-widest text-[9px]">Entity ID:</span>
                    <span className="text-slate-900 font-black">{selectedVendorQR.id}</span>
                 </div>
                 <div className="flex justify-between text-xs font-bold border-t border-slate-200 pt-3">
                    <span className="text-slate-400 uppercase tracking-widest text-[9px]">Hub:</span>
                    <span className="text-slate-900 font-black truncate max-w-[140px] text-right">{selectedVendorQR.market}</span>
                 </div>
              </div>
              <div className="px-8 flex gap-3">
                 <Button variant="secondary" className="flex-1 font-black uppercase text-[10px] py-3 rounded-xl border-slate-200"><Printer size={16}/> Print</Button>
                 <Button className="flex-1 font-black uppercase text-[10px] py-3 rounded-xl bg-slate-900 border-none text-white"><Share2 size={16}/> Sync</Button>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
};
