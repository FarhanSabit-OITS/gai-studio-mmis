
import React, { useState, useMemo } from 'react';
import { 
  Building2, MapPin, Plus, Search, Filter, Calendar, 
  Users, Briefcase, Globe, ExternalLink, ShieldAlert, 
  TrendingUp, BarChart as ChartIcon, PieChart as PieIcon, LineChart as LineIcon,
  ChevronDown, ArrowUpDown
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
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
  const [sortBy, setSortBy] = useState<'name' | 'capacity' | 'date'>('name');

  const filtered = useMemo(() => {
    let result = markets.filter(m => 
      m.name.toLowerCase().includes(search.toLowerCase()) || 
      m.city.toLowerCase().includes(search.toLowerCase())
    );

    if (filterType !== 'ALL') {
      result = result.filter(m => m.type === filterType);
    }

    if (filterOwnership !== 'ALL') {
      result = result.filter(m => m.ownership === filterOwnership);
    }

    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'capacity') return b.capacity - a.capacity;
      if (sortBy === 'date') return new Date(b.establishedDate).getTime() - new Date(a.establishedDate).getTime();
      return 0;
    });

    return result;
  }, [markets, search, filterType, filterOwnership, sortBy]);

  const capacityData = useMemo(() => {
    return markets.map(m => ({
      name: m.name,
      capacity: m.capacity
    }));
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
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Building2 className="text-indigo-600" size={28} />
            Hub Infrastructure Registry
          </h2>
          <p className="text-slate-500 text-sm font-medium">Regional commerce nodes organized by infrastructure and ownership model.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="font-bold text-xs flex items-center gap-2 h-11"
          >
            {showAnalytics ? <Building2 size={16}/> : <ChartIcon size={16}/>}
            {showAnalytics ? 'Show Hub Grid' : 'Visual BI Analytics'}
          </Button>
          {(user.role === 'SUPER_ADMIN' || user.role === 'MARKET_ADMIN') && (
            <Button className="font-bold uppercase tracking-widest text-xs h-11 px-6 shadow-xl shadow-indigo-100 bg-indigo-600 border-none text-white">
              <Plus size={18}/> Register Center
            </Button>
          )}
        </div>
      </div>

      {!showAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <Input icon={Search} placeholder="Filter markets by name, city..." value={search} onChange={(e:any) => setSearch(e.target.value)} />
          </div>
          <div className="relative">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-black text-white border-2 border-slate-800 rounded-2xl px-5 py-3.5 text-[10px] font-black uppercase tracking-widest outline-none focus:border-indigo-600 appearance-none cursor-pointer shadow-lg"
            >
              <option value="ALL">All Types</option>
              <option value="WHOLESALE">Wholesale Hub</option>
              <option value="RETAIL">Retail Market</option>
              <option value="MIXED">Mixed Use</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
          </div>
          <div className="relative">
            <select 
              value={filterOwnership}
              onChange={(e) => setFilterOwnership(e.target.value)}
              className="w-full bg-black text-white border-2 border-slate-800 rounded-2xl px-5 py-3.5 text-[10px] font-black uppercase tracking-widest outline-none focus:border-indigo-600 appearance-none cursor-pointer shadow-lg"
            >
              <option value="ALL">All Ownership</option>
              <option value="PUBLIC">Public Domain</option>
              <option value="PRIVATE">Private Sector</option>
              <option value="PPP">PPP Model</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
          </div>
          <div className="relative">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-black text-white border-2 border-slate-800 rounded-2xl px-5 py-3.5 text-[10px] font-black uppercase tracking-widest outline-none focus:border-indigo-600 appearance-none cursor-pointer shadow-lg"
            >
              <option value="name">Sort: A-Z</option>
              <option value="capacity">Sort: Capacity</option>
              <option value="date">Sort: Est. Date</option>
            </select>
            <ArrowUpDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
          </div>
        </div>
      )}

      {showAnalytics ? (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Capacity Distribution Grid">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={capacityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" fontSize={10} tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <YAxis fontSize={10} tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="capacity" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Ownership Structure Mix">
              <div className="h-80 w-full flex flex-col">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={typeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {typeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                  {typeData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{entry.name}</span>
                    </div>
                  ))}
                </div>
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
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
