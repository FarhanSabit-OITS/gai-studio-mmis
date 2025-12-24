
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Truck, LogIn, LogOut, DollarSign, Clock, ShieldCheck, 
  Printer, Camera, QrCode, Search, X, CheckCircle2, 
  AlertTriangle, CreditCard, ArrowRight, UserCheck, Ticket,
  LayoutGrid, History, Smartphone, Scan, User, RefreshCw, Star, Info, ChevronDown,
  // Fixed: Removed non-existent 'Keypad' icon import
  Hash, Clipboard, Calculator
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface GateRecord {
  id: string;
  plate: string;
  type: 'SUPPLIER' | 'VENDOR' | 'STAFF' | 'VISITOR';
  timeIn: string;
  timeOut?: string;
  status: 'INSIDE' | 'EXITED';
  charge: number;
  paymentStatus: 'PAID' | 'PENDING' | 'EXEMPT';
  token: string;
  isRegular: boolean;
  visitCount: number;
}

export const GateManagement = () => {
  const [activeTab, setActiveTab] = useState<'TERMINAL' | 'MANUAL_VERIFY' | 'PARKING'>('TERMINAL');
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<GateRecord | null>(null);
  const [search, setSearch] = useState('');
  const [manualCode, setManualCode] = useState('');
  
  const TOTAL_SLOTS = 150;
  const [records, setRecords] = useState<GateRecord[]>([
    { id: 'GT-001', plate: 'UAX 123Z', type: 'SUPPLIER', timeIn: '08:45 AM', status: 'INSIDE', charge: 5000, paymentStatus: 'PAID', token: 'MM-4219', isRegular: true, visitCount: 45 },
    { id: 'GT-002', plate: 'UBB 990X', type: 'VENDOR', timeIn: '09:12 AM', timeOut: '11:05 AM', status: 'EXITED', charge: 2000, paymentStatus: 'PAID', token: 'MM-1123', isRegular: true, visitCount: 124 },
    { id: 'GT-003', plate: 'UCA 445L', type: 'VISITOR', timeIn: '10:05 AM', status: 'INSIDE', charge: 3000, paymentStatus: 'PENDING', token: 'MM-5561', isRegular: false, visitCount: 1 },
  ]);

  const [entryForm, setEntryForm] = useState({ plate: '', type: 'VISITOR' as GateRecord['type'] });

  const handleEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const plate = entryForm.plate.toUpperCase();
    const existing = records.find(r => r.plate === plate);
    const count = (existing?.visitCount || 0) + 1;
    const isRegular = entryForm.type === 'STAFF' || entryForm.type === 'VENDOR' || count > 5;

    const newRecord: GateRecord = {
      id: 'GT-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
      plate,
      type: entryForm.type,
      timeIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'INSIDE',
      charge: entryForm.type === 'STAFF' ? 0 : (isRegular ? 1500 : 3000),
      paymentStatus: entryForm.type === 'STAFF' ? 'EXEMPT' : 'PENDING',
      token: 'MM-' + Math.floor(1000 + Math.random() * 9000), // Human-writable ID
      isRegular,
      visitCount: count
    };
    
    setRecords([newRecord, ...records]);
    setGeneratedToken(newRecord);
    setShowEntryModal(false);
    setEntryForm({ plate: '', type: 'VISITOR' });
  };

  const verifyTokenManual = () => {
    const record = records.find(r => r.token === manualCode || r.token === `MM-${manualCode}`);
    if (record) {
      if (record.status === 'EXITED') {
        alert("Alert: This token was already exited from the hub.");
        return;
      }
      handleExit(record.id);
      setManualCode('');
      setActiveTab('TERMINAL');
      alert(`Manifest Verified: ${record.plate} is cleared for exit.`);
    } else {
      alert("Error: Token ID not found in global ledger. Please verify chit handwriting.");
    }
  };

  const handleExit = (id: string) => {
    setRecords(records.map(r => r.id === id ? { ...r, status: 'EXITED', timeOut: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), paymentStatus: 'PAID' } : r));
  };

  const totals = useMemo(() => {
    const inside = records.filter(r => r.status === 'INSIDE').length;
    return { inside, occupancy: Math.round((inside / TOTAL_SLOTS) * 100) };
  }, [records]);

  return (
    <div className="space-y-6 animate-fade-in pb-20 max-w-4xl mx-auto">
      {/* PWA High-Tactile Header */}
      <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 border border-white/5 relative overflow-hidden group">
        <div className="relative z-10 flex items-center gap-6">
           <div className="w-20 h-20 bg-indigo-600 rounded-[28px] flex items-center justify-center shadow-2xl ring-8 ring-indigo-600/20 group-hover:scale-110 transition-transform duration-500">
             <Truck size={40} />
           </div>
           <div>
              <h2 className="text-3xl font-black tracking-tight leading-none uppercase">Hub Gate</h2>
              <div className="flex items-center gap-3 mt-3">
                 <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-lg border border-white/10">Delta Terminal</span>
                 <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-lg border border-white/10">{totals.occupancy}% Load</span>
              </div>
           </div>
        </div>
        <div className="flex gap-3 relative z-10 w-full md:w-auto">
           <Button onClick={() => setShowEntryModal(true)} className="flex-1 h-16 px-10 font-black uppercase tracking-widest text-xs bg-white text-slate-900 border-none shadow-2xl hover:bg-indigo-50">
             <LogIn size={20} /> CHECK-IN
           </Button>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="flex gap-2 bg-slate-100 p-2 rounded-2xl shadow-inner">
        <button onClick={() => setActiveTab('TERMINAL')} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'TERMINAL' ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-slate-500'}`}>Manifest</button>
        <button onClick={() => setActiveTab('MANUAL_VERIFY')} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'MANUAL_VERIFY' ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-slate-500'}`}>Verify Chit</button>
        <button onClick={() => setActiveTab('PARKING')} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'PARKING' ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-slate-500'}`}>Spatial</button>
      </div>

      {activeTab === 'MANUAL_VERIFY' ? (
        <div className="max-w-md mx-auto space-y-8 animate-slide-up pt-6">
           <Card className="rounded-[48px] shadow-2xl border-none p-12 text-center bg-slate-900 text-white relative overflow-hidden">
              <div className="relative z-10">
                 <div className="w-20 h-20 bg-white/10 rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-white/10">
                    <Hash size={40} className="text-indigo-400" />
                 </div>
                 <h3 className="text-2xl font-black tracking-tight mb-4 uppercase">Chit Verification</h3>
                 <p className="text-slate-400 text-xs font-medium leading-relaxed mb-10 px-4">Operator: Input the numeric ID from the visitor's paper token to triangulate clearing.</p>
                 
                 <div className="bg-black/40 border-2 border-white/10 rounded-[32px] p-8 mb-10 shadow-inner group">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Input Sequence (4-6 digits)</p>
                    <div className="flex items-center justify-center gap-4">
                       <span className="text-4xl font-black tracking-[0.3em] font-mono text-white group-hover:text-indigo-400 transition-colors">MM-{manualCode || '____'}</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-3 gap-4 mb-10">
                    {[1,2,3,4,5,6,7,8,9,'CLR',0,'DEL'].map(num => (
                       <button 
                        key={num} 
                        onClick={() => {
                           if (num === 'CLR') setManualCode('');
                           else if (num === 'DEL') setManualCode(prev => prev.slice(0,-1));
                           else if (manualCode.length < 4) setManualCode(prev => prev + num);
                        }}
                        className="h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-black hover:bg-white/10 active:scale-95 transition-all shadow-md"
                       >
                         {num}
                       </button>
                    ))}
                 </div>

                 <Button 
                  onClick={verifyTokenManual}
                  disabled={manualCode.length < 4}
                  className="w-full h-16 font-black uppercase tracking-widest text-xs shadow-2xl bg-indigo-600 border-none text-white disabled:opacity-30 rounded-[28px]"
                 >
                    Verify & Exit Manifest
                 </Button>
              </div>
           </Card>
        </div>
      ) : activeTab === 'TERMINAL' ? (
        <div className="space-y-4">
           {records.filter(r => r.status === 'INSIDE').map(r => (
              <Card key={r.id} className="p-6 rounded-[32px] border-slate-100 shadow-xl group hover:border-indigo-200 transition-all">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-indigo-600 transition-colors">
                          <Truck size={28}/>
                       </div>
                       <div>
                          <p className="text-xl font-black text-slate-900 tracking-tight">{r.plate}</p>
                          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">TOKEN: {r.token}</p>
                       </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-3">
                       <p className="text-sm font-black text-slate-800 tracking-tight">{r.timeIn}</p>
                       <Button onClick={() => handleExit(r.id)} variant="secondary" className="h-10 px-6 text-[10px] font-black uppercase rounded-xl border-slate-200 shadow-sm hover:bg-indigo-50">Manual Exit</Button>
                    </div>
                 </div>
              </Card>
           ))}
           {records.filter(r => r.status === 'INSIDE').length === 0 && (
             <div className="py-20 text-center text-slate-400 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-100">
               <Info size={48} className="mx-auto mb-4 opacity-20"/>
               <p className="font-black uppercase text-xs tracking-widest">No active manifests stationary within hub.</p>
             </div>
           )}
        </div>
      ) : (
        <Card className="p-8 rounded-[40px] shadow-xl border-slate-100">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">Capacity Node Visualization</h3>
          <div className="grid grid-cols-10 gap-2">
            {Array.from({ length: 120 }).map((_, i) => (
              <div key={i} className={`aspect-square rounded-lg border-2 ${i < totals.inside ? 'bg-indigo-600 border-indigo-600 shadow-lg' : 'bg-slate-50 border-slate-100'}`} />
            ))}
          </div>
        </Card>
      )}

      {showEntryModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[150] flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <Card className="w-full max-w-md shadow-2xl rounded-[40px] p-10 relative bg-white overflow-hidden my-auto border-none">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Terminal Check-In</h3>
               <button onClick={() => setShowEntryModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={28} /></button>
            </div>
            <form onSubmit={handleEntry} className="space-y-6">
              <Input label="Plate Identification *" placeholder="UAX 982P" icon={Truck} value={entryForm.plate} onChange={(e:any)=>setEntryForm({...entryForm, plate: e.target.value})} required />
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Node Class</label>
                <select 
                  value={entryForm.type}
                  onChange={(e) => setEntryForm({...entryForm, type: e.target.value as any})}
                  className="w-full bg-black text-white border-2 border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold focus:border-indigo-600 outline-none appearance-none shadow-xl transition-all"
                >
                  <option value="VISITOR">Visitor</option>
                  <option value="VENDOR">Vendor</option>
                  <option value="STAFF">Official</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <Button variant="secondary" onClick={() => setShowEntryModal(false)} className="flex-1 h-14 font-black uppercase text-[10px]">Abort</Button>
                <Button type="submit" className="flex-2 h-14 bg-indigo-600 border-none shadow-xl font-black uppercase text-[10px] text-white">Authorize</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {generatedToken && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[200] flex items-center justify-center p-4 animate-fade-in">
           <Card className="w-full max-w-sm text-center py-12 relative overflow-hidden rounded-[48px] border-none bg-white">
              <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
              <button onClick={() => setGeneratedToken(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
              
              <div className="mb-8">
                 <div className="w-28 h-28 bg-slate-900 text-white rounded-[36px] flex items-center justify-center mx-auto mb-6 shadow-2xl ring-8 ring-slate-100">
                    <Ticket size={48} />
                 </div>
                 <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{generatedToken.token}</h3>
                 <p className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.3em] mb-8 bg-indigo-50 px-4 py-1.5 rounded-full w-fit mx-auto">Paper ID Node</p>
              </div>

              <div className="bg-slate-50 p-8 mx-10 rounded-[32px] border border-slate-100 mb-10 text-left space-y-4 shadow-inner">
                 <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-400 uppercase tracking-widest text-[9px]">Entity:</span>
                    <span className="text-slate-900 font-black">{generatedToken.plate}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs font-bold pt-3 border-t border-slate-200">
                    <span className="text-slate-400 uppercase tracking-widest text-[9px]">Entrance:</span>
                    <span className="text-slate-900 font-black">{generatedToken.timeIn}</span>
                 </div>
              </div>

              <div className="px-10 flex flex-col gap-4">
                 <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 text-left">
                    <Calculator size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[9px] text-amber-700 font-bold uppercase leading-relaxed">Operator Instructions: Write the <span className="underline">Token ID</span> on the visitor's paper chit. Exit verify required.</p>
                 </div>
                 <Button onClick={() => setGeneratedToken(null)} className="w-full h-16 bg-slate-900 border-none font-black uppercase text-xs tracking-widest shadow-2xl text-white rounded-2xl">Confirm Sync</Button>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
};
