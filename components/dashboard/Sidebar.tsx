
import React from 'react';
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  Users, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  MessageSquare,
  History,
  Ticket,
  Truck,
  Box,
  UserPlus,
  CreditCard,
  Building2,
  Warehouse,
  Boxes,
  Map as MapIcon,
  HeartHandshake,
  LifeBuoy,
  ShoppingBag,
  ShoppingCart,
  Shield,
  Landmark
} from 'lucide-react';
import { Role, UserProfile } from '../../types';
import { ROLES_HIERARCHY } from '../../constants';

interface SidebarProps {
  user: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLogout: () => void;
}

export const Sidebar = ({ user, activeTab, setActiveTab, isOpen, setIsOpen, onLogout }: SidebarProps) => {
  
  const canSee = (requiredRoles?: Role[]) => {
    if (!requiredRoles) return true;
    if (user.role === 'SUPER_ADMIN') return true;
    const hierarchy = ROLES_HIERARCHY[user.role] || [];
    return requiredRoles.includes(user.role) || requiredRoles.some(role => hierarchy.includes(role));
  };

  const menuItems = [
    { name: 'Home', icon: LayoutDashboard },
    { name: 'Markets', icon: Building2, roles: ['SUPER_ADMIN', 'MARKET_ADMIN'] as Role[] },
    { name: 'Map View', icon: MapIcon, roles: ['SUPER_ADMIN', 'MARKET_ADMIN', 'VENDOR', 'SUPPLIER'] as Role[] },
    { name: user.role === 'VENDOR' ? 'My Store' : 'Vendors', icon: Store, roles: ['SUPER_ADMIN', 'MARKET_ADMIN', 'VENDOR'] as Role[] },
    { name: 'Orders', icon: ShoppingCart, roles: ['SUPER_ADMIN', 'MARKET_ADMIN', 'VENDOR', 'USER'] as Role[] },
    { name: 'Suppliers Network', icon: HeartHandshake, roles: ['SUPER_ADMIN', 'MARKET_ADMIN', 'VENDOR', 'SUPPLIER', 'USER'] as Role[] },
    { name: 'Supply Requisitions', icon: ShoppingBag, roles: ['SUPER_ADMIN', 'MARKET_ADMIN', 'VENDOR', 'SUPPLIER'] as Role[] },
    { name: 'Inventory Control', icon: Box, roles: ['SUPER_ADMIN', 'MARKET_ADMIN', 'VENDOR', 'SUPPLIER'] as Role[] },
    { name: 'Security Console', icon: Shield, roles: ['SUPER_ADMIN', 'MARKET_ADMIN', 'COUNTER_STAFF'] as Role[] },
    { name: 'Revenue Module', icon: Landmark, roles: ['SUPER_ADMIN', 'MARKET_ADMIN'] as Role[] },
    { name: 'Gate Management', icon: Truck, roles: ['SUPER_ADMIN', 'MARKET_ADMIN', 'COUNTER_STAFF'] as Role[] },
    { name: 'Stock Counter', icon: Boxes, roles: ['SUPER_ADMIN', 'MARKET_ADMIN', 'COUNTER_STAFF'] as Role[] },
    { name: 'QR & Receipts', icon: Ticket, roles: ['COUNTER_STAFF', 'VENDOR'] as Role[] },
    { name: 'Tickets & Support', icon: LifeBuoy },
    { name: 'Audit Logs', icon: History, roles: ['SUPER_ADMIN', 'MARKET_ADMIN'] as Role[] },
    { name: 'Settings', icon: Settings },
  ].filter(item => canSee(item.roles));

  return (
    <aside className={`bg-white border-r border-slate-100 flex flex-col transition-all duration-300 h-screen sticky top-0 z-50 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg" onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
          <Store className="text-white" size={24} />
        </div>
        {isOpen && <h1 className="text-xl font-black text-slate-800 tracking-tight">MMIS</h1>}
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              activeTab === item.name 
              ? 'bg-indigo-600 text-white shadow-indigo-100 shadow-lg' 
              : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <item.icon size={20} />
            {isOpen && <span className="font-medium text-xs font-black uppercase tracking-widest">{item.name}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-all font-medium`}
        >
          <LogOut size={20} />
          {isOpen && <span className="text-xs font-black uppercase tracking-widest">Logout</span>}
        </button>
      </div>
    </aside>
  );
};
