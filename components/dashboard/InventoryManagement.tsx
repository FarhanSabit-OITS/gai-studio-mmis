
import React, { useState, useMemo } from 'react';
import { Package, Search, Filter, Plus, Edit, Trash2, AlertCircle, ShoppingCart, Send, CheckCircle, X, Save, Info } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { UserProfile, Product } from '../../types';

export const InventoryManagement = ({ user }: { user: UserProfile }) => {
  const [items, setItems] = useState<Product[]>([
    { id: '1', name: 'Basmati Rice (50kg)', description: 'Long-grain aromatic rice, Grade A quality.', vendor: 'Fresh Foods', stock: 12, price: 180000, status: 'LOW', category: 'Food' },
    { id: '2', name: 'Refined Sugar (20kg)', description: 'Fine white sugar for household use.', vendor: 'Fresh Foods', stock: 140, price: 85000, status: 'HEALTHY', category: 'Food' },
    { id: '3', name: 'Cooking Oil (20L)', description: 'Pure vegetable oil, cholesterol-free.', vendor: 'Global Mart', stock: 5, price: 120000, status: 'CRITICAL', category: 'Household' },
  ]);

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: ''
  });

  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase()) || 
      item.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setForm({ name: '', description: '', price: '', stock: '', category: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    setDeletingId(null);
  };

  const determineStatus = (stock: number): Product['status'] => {
    if (stock === 0) return 'CRITICAL';
    if (stock < 10) return 'LOW';
    return 'HEALTHY';
  };

  const handleSave = () => {
    if (!form.name || !form.price || !form.stock) {
      alert("Please fill in required fields.");
      return;
    }

    if (editingProduct) {
      setItems(items.map(item => {
        if (item.id === editingProduct.id) {
          const newStock = Number(form.stock);
          return {
            ...item,
            name: form.name,
            description: form.description,
            price: Number(form.price),
            stock: newStock,
            category: form.category,
            status: determineStatus(newStock)
          };
        }
        return item;
      }));
    } else {
      const newStock = Number(form.stock);
      const p: Product = {
        id: Math.random().toString(36).substr(2, 9),
        name: form.name,
        description: form.description,
        vendor: user.name,
        price: Number(form.price),
        stock: newStock,
        status: user.role === 'SUPPLIER' ? 'PENDING_APPROVAL' : determineStatus(newStock),
        category: form.category
      };
      setItems([...items, p]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <Card className="w-full max-w-lg shadow-2xl relative overflow-hidden" title={editingProduct ? 'Update Product Catalog' : 'Initialize New Listing'}>
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="space-y-4 py-2">
              <Input 
                label="Product Title *" 
                placeholder="e.g. Solar Powered Lamp" 
                value={form.name} 
                onChange={(e:any) => setForm({...form, name: e.target.value})} 
              />
              <Input 
                label="Description" 
                multiline 
                placeholder="Describe features, quality, and specifications..." 
                value={form.description} 
                onChange={(e:any) => setForm({...form, description: e.target.value})} 
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Unit Price (UGX) *" 
                  placeholder="0.00" 
                  type="number"
                  value={form.price} 
                  onChange={(e:any) => setForm({...form, price: e.target.value})} 
                />
                <Input 
                  label="Available Stock *" 
                  placeholder="0" 
                  type="number"
                  value={form.stock} 
                  onChange={(e:any) => setForm({...form, stock: e.target.value})} 
                />
              </div>
              <Input 
                label="Domain / Category *" 
                placeholder="e.g. Electronics" 
                value={form.category} 
                onChange={(e:any) => setForm({...form, category: e.target.value})} 
              />
              
              <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl flex gap-3">
                <Info size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-indigo-700 leading-relaxed">
                  {user.role === 'SUPPLIER' 
                    ? "Listing will be queued for MMIS Quality Assurance review before going live." 
                    : "Listing will be updated instantly in your market-facing storefront."}
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-8 pt-4 border-t border-slate-50">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleSave} className="px-8 shadow-lg shadow-indigo-100 font-bold uppercase tracking-widest text-xs">
                {editingProduct ? <Save size={16}/> : (user.role === 'SUPPLIER' ? <Send size={16}/> : <Plus size={16}/>)}
                {editingProduct ? 'Commit Changes' : (user.role === 'SUPPLIER' ? 'Submit for Audit' : 'Publish Listing')}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
          <Card className="max-w-sm w-full text-center py-8">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Purge Listing?</h3>
            <p className="text-slate-500 text-sm mb-8">This action will permanently remove the item from the MMIS catalog and storefronts.</p>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setDeletingId(null)}>Abstain</Button>
              <Button variant="danger" className="flex-1 font-bold" onClick={() => handleDelete(deletingId)}>Delete Permanently</Button>
            </div>
          </Card>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Package className="text-indigo-600" size={28} />
            Inventory Control
          </h2>
          <p className="text-slate-500 font-medium text-sm">Real-time oversight of your commercial catalog and stock health.</p>
        </div>
        <Button onClick={handleOpenAdd} className="shadow-lg shadow-indigo-100 font-bold uppercase tracking-widest text-xs py-3 px-6">
          {user.role === 'SUPPLIER' ? <ShoppingCart size={18}/> : <Plus size={18}/>}
          {user.role === 'SUPPLIER' ? 'Request Product Listing' : 'Add New Product'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <Input 
            icon={Search} 
            placeholder="Search catalog by product name or category..." 
            value={search}
            onChange={(e:any) => setSearch(e.target.value)}
          />
        </div>
        <select className="bg-black text-white border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold transition-all shadow-lg">
          <option>View All Domains</option>
          <option>Food & Cereals</option>
          <option>Household Essentials</option>
          <option>Electronics</option>
        </select>
        <select className="bg-black text-white border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold transition-all shadow-lg">
          <option>Status: All</option>
          <option>Healthy Stock</option>
          <option>Low Supplies</option>
          <option>Critical Deficit</option>
          <option>Pending Audit</option>
        </select>
      </div>

      <Card className="overflow-hidden border-slate-100 shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-5">Entity Definition</th>
                <th className="px-6 py-5">Source Node</th>
                <th className="px-6 py-5">Reserve Capacity</th>
                <th className="px-6 py-5">Unit Valuation</th>
                <th className="px-6 py-5">Health Status</th>
                <th className="px-6 py-5 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredItems.map((item) => (
                <tr key={item.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg group-hover:bg-indigo-600 transition-colors">
                        <Package size={20} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm font-black text-slate-900 block truncate tracking-tight">{item.name}</span>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter truncate max-w-[200px]">
                          {item.description || "No detailed specification provided."}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Operator</span>
                      <span className="text-xs font-bold text-slate-700">{item.vendor}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                       <span className="text-sm font-black text-slate-800">{item.stock.toLocaleString()} Units</span>
                       <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className={`h-full transition-all duration-500 ${
                            item.status === 'HEALTHY' ? 'bg-emerald-500' :
                            item.status === 'LOW' ? 'bg-amber-500' :
                            'bg-red-500'
                          }`} style={{ width: `${Math.min((item.stock / 200) * 100, 100)}%` }} />
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900 tracking-tighter">UGX {item.price.toLocaleString()}</span>
                      <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">{item.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                      item.status === 'CRITICAL' ? 'bg-red-50 text-red-600 border-red-100' :
                      item.status === 'LOW' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      item.status === 'PENDING_APPROVAL' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenEdit(item)}
                        className="p-2.5 hover:bg-indigo-50 rounded-xl text-indigo-600 transition-all hover:scale-110" 
                        title="Edit Entry"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => setDeletingId(item.id)}
                        className="p-2.5 hover:bg-red-50 rounded-xl text-red-500 transition-all hover:scale-110" 
                        title="Purge Listing"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-24 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <Package className="text-slate-300" size={32} />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">No matching products found in the regional index.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
