
import React, { useState, useMemo } from 'react';
import { 
  Building2, MapPin, Plus, Search, Filter, Calendar, 
  Users, Briefcase, Globe, ExternalLink, ShieldAlert, 
  TrendingUp, BarChart as ChartIcon, LayoutGrid, ChevronDown, ArrowUpDown
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { UserProfile, Market } from '../../types';
import { MOCK_MARKETS } from '../../constants';

export const MarketRegistry = ({ user }: { user: UserProfile }) => {
  const [markets] = useState<Market[]>(MOCK_MARKETS);
  const [search, setSearch] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  const [filterType, setFilterType] = useState('ALL');
  const [filterOwnership, setFilterOwnership] = useState('ALL');
  const [yearRange, setYearRange] = useState({ start: '1800', end: '2025' });
  const [sortBy, setSortBy] = useState<'name' | 'capacity' | 'date'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: 'name' | 'capacity' | 'date') => {
    if (sortBy === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDirection('asc');
    }
  };

  const filtered = useMemo(() => {
    let result = markets.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                           m.city.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === 'ALL' || m.type === filterType;
      const matchesOwnership = filterOwnership === 'ALL' || m.ownership === filterOwnership;
      
      const establishedYear = new Date(m.establishedDate).getFullYear();
      const matchesDate = establishedYear >= Number(yearRange.start) && establishedYear <= Number(yearRange.end);

      return matchesSearch && matchesType && matchesOwnership && matchesDate;
    });

    result.sort((a, b) => {
      let valA: any, valB: any;
      if (sortBy === 'name') {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } else if (sortBy === 'capacity') {
        valA = a.capacity;
        valB = b.capacity;
      } else if (sortBy === 'date') {
        valA = new Date(a.establishedDate).getTime();
        valB = new Date(b.establishedDate).getTime();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [markets, search, filterType, filterOwnership, yearRange, sortBy, sortDirection]);

  // Analytics Data
  const capacityData = useMemo(() => {
    return markets.map(m => ({
      name: m.name,
      capacity: m.capacity,
      established: new Date(m.establishedDate).getFullYear()
    })).sort((a, b) => a.established - b.established);
  }, [markets]);

  const typeData = useMemo(() => {
    const counts: Record<string, number> = {};
    markets.forEach(m => {
      counts[m.type] = (counts[m.type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [markets]);

  const COLORS = ['#4f46e5', '#8b5cf6', '#10b981', '#f59e0b'];

  const handleOpenMap = (marketName: string) => {
    const query = encodeURIComponent(`${marketName} Uganda`);
    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Building2 className="text-indigo-600" size={32} />
            Hub Registry
          </h2>
          <p className="text-slate-500 font-medium">Regional commerce nodes organized by infrastructure and ownership.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="font-bold text-xs flex items-center gap-2 h-12 px-6"
          >
            {showAnalytics ? <LayoutGrid size={18}/> : <ChartIcon size={18}/>}
            {showAnalytics ? 'Show Hub Grid' : 'Visual BI Analytics'}
          </Button>
          {(user.role === 'SUPER_ADMIN' || user.role === 'MARKET_ADMIN') && (
            <Button className="font-black uppercase tracking-widest text-xs h-12 px-8 shadow-xl shadow-indigo-100 bg-indigo-600 border-none text-white">
              <Plus size={18}/> Register Center
            </Button>
          )}
        </div>
      </div>

      {!showAnalytics && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <Input icon={Search} placeholder="Filter markets by name, city..." value={search} onChange={(e:any) => setSearch(e.target.value)} />
            </div>
            <div className="md:col-span-2 relative">
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full h-full bg-black text-white border-2 border-slate-800 rounded-2xl px-5 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:border-indigo-600 appearance-none cursor-pointer shadow-lg"
              >
                <option value="ALL">All Types</option>
                <option value="WHOLESALE">Wholesale Hub</option>
                <option value="RETAIL">Retail Market</option>
                <option value="MIXED">Mixed Use</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
            </div>
            <div className="md:col-span-2 relative">
              <select 
                value={filterOwnership}
                onChange={(e) => setFilterOwnership(e.target.value)}
                className="w-full h-full bg-black text-white border-2 border-slate-800 rounded-2xl px-5 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:border-indigo-600 appearance-none cursor-pointer shadow-lg"
              >
                <option value="ALL">All Ownership</option>
                <option value="PUBLIC">Public Domain</option>
                <option value="PRIVATE">Private Sector</option>
                <option value="PPP">PPP Model</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
            </div>
            <div className="md:col-span-4 grid grid-cols-2 gap-2">
              <div className="relative">
                 <label className="absolute -top-2 left-3 bg-white px-1 text-[8px] font-black text-slate-400 uppercase z-10">From Year</label>
                 <input type="number" value={yearRange.start} onChange={(e)=>setYearRange({...yearRange, start: e.target.value})} className="w-full h-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-2 text-xs font-bold outline-none focus:border-indigo-600 transition-all"/>
              </div>
              <div className="relative">
                 <label className="absolute -top-2 left-3 bg-white px-1 text-[8px] font-black text-slate-400 uppercase z-10">To Year</label>
                 <input type="number" value={yearRange.end} onChange={(e)=>setYearRange({...yearRange, end: e.target.value})} className="w-full h-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-2 text-xs font-bold outline-none focus:border-indigo-600 transition-all"/>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Sort Manifest By:</span>
             <div className="flex gap-2">
                {[
                  { k: 'name', l: 'Hub Name' },
                  { k: 'capacity', l: 'Cap Load' },
                  { k: 'date', l: 'Est. Date' }
                ].map(s => (
                  <button 
                    key={s.k} 
                    onClick={() => handleSort(s.k as any)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${sortBy === s.k ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    {s.l} {sortBy === s.k && (sortDirection === 'asc' ? <ArrowUpDown size={12} className="rotate-180"/> : <ArrowUpDown size={12}/>)}
                  </button>
                ))}
             </div>
          </div>
        </div>
      )}

      {showAnalytics ? (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Market Capacity Comparison">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={capacityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" fontSize={10} tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <YAxis fontSize={10} tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="capacity" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Establishment Timeline">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={capacityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="established" fontSize={10} tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <YAxis fontSize={10} tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line type="monotone" dataKey="capacity" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map(market => (
            <Card key={market.id} className="relative group overflow-hidden border-2 border-transparent hover:border-indigo-100 transition-all shadow-xl rounded-[32px] p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:bg-indigo-600 transition-colors">
                    <Building2 size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{market.name}</h3>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold mt-1">
                      <MapPin size={12} className="text-indigo-500" /> {market.city} Node
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                  market.ownership === 'PUBLIC' ? 'bg-blue-100 text-blue-700' :
                  market.ownership === 'PRIVATE' ? 'bg-purple-100 text-purple-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {market.ownership}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8 border-y border-slate-50 py-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Briefcase size={12}/> Class
                  </p>
                  <p className="text-sm font-black text-slate-800 tracking-tight">{market.type}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Calendar size={12}/> Established
                  </p>
                  <p className="text-sm font-black text-slate-800 tracking-tight">
                    {new Date(market.establishedDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Users size={12}/> Capacity
                  </p>
                  <p className="text-sm font-black text-slate-800">{market.capacity.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Globe size={12}/> Focus
                  </p>
                  <p className="text-sm font-black text-slate-800 truncate">{market.primaryProducts[0]}</p>
                </div>
              </div>

              <div className="flex gap-2">
                 <Button 
                   variant="secondary" 
                   className="flex-1 text-[10px] font-black uppercase tracking-widest py-3 rounded-xl border-slate-200"
                   onClick={() => handleOpenMap(market.name)}
                 >
                   <ExternalLink size={14}/> Mapping
                 </Button>
                 <Button variant="outline" className="flex-1 text-[10px] font-black uppercase tracking-widest py-3 rounded-xl border-2">
                   Admin Log
                 </Button>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="lg:col-span-2 py-32 text-center bg-white rounded-[48px] border-2 border-dashed border-slate-100 shadow-inner">
               <ShieldAlert size={64} className="mx-auto mb-4 opacity-10 text-slate-400"/>
               <p className="font-black uppercase text-xs tracking-widest text-slate-400">No regional nodes triangulated in this timeframe.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
