
import React, { useState } from 'react';
/* Added Store icon import from lucide-react */
import { Store } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { UserProfile } from '../../types';
import { Home } from './Home';
import { KYCModule } from './KYCModule';
import { AdminApplicationForm } from './AdminApplicationForm';
import { ContactForm } from '../contact/ContactForm';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { VendorManagement } from './VendorManagement';
import { SupplierManagement } from './SupplierManagement';
import { SuppliersNetwork } from './SuppliersNetwork';
import { SupplyRequisitions } from './SupplyRequisitions';
import { TicketingSystem } from './TicketingSystem';
import { MarketRegistry } from './MarketRegistry';
import { InteractiveMap } from './InteractiveMap';
import { AuditLogs } from './AuditLogs';
import { QRManagement } from './QRManagement';
import { NotificationCenter } from './NotificationCenter';
import { Chatbot } from './Chatbot';
import { GateManagement } from './GateManagement';
import { StockCounterTerminal } from './StockCounterTerminal';
import { InventoryManagement } from './InventoryManagement';
import { ProfileSettings } from './ProfileSettings';
import { TransactionHistory } from './TransactionHistory';
import { OrdersManagement } from './OrdersManagement';
import { VendorOnboarding } from './VendorOnboarding';
import { SecurityModule } from './SecurityModule';
import { RevenueModule } from './RevenueModule';
import { Header } from '../ui/Header';
import { Footer } from '../ui/Footer';

interface DashboardLayoutProps {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  onLogout: () => void;
}

export const DashboardLayout = ({ user, setUser, onLogout }: DashboardLayoutProps) => {
  const [activeTab, setActiveTab] = useState('Home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isVendorOnboarding, setIsVendorOnboarding] = useState(false);

  const renderContent = () => {
    if (isVendorOnboarding) {
       return <VendorOnboarding user={user} onComplete={() => { setIsVendorOnboarding(false); setActiveTab('My Store'); }} />;
    }

    switch (activeTab) {
      case 'Home':
        return <Home user={user} />;
      case 'Orders':
        return <OrdersManagement user={user} />;
      case 'Vendors':
      case 'My Store':
        if (user.role === 'USER' && !isVendorOnboarding) {
           return (
             <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                <Card className="max-w-md p-10 rounded-[48px] shadow-2xl border-none">
                   <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Store size={40}/>
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Trade Node Deactivated</h3>
                   <p className="text-slate-500 mb-8 font-medium leading-relaxed">You are currently accessing the system as a <strong>Standard User</strong>. To activate your store entity, please complete the onboarding sequence.</p>
                   <Button onClick={() => setIsVendorOnboarding(true)} className="w-full h-14 font-black uppercase text-xs shadow-xl shadow-indigo-100">Initialize Onboarding</Button>
                </Card>
             </div>
           );
        }
        return <VendorManagement user={user} />;
      case 'Suppliers Network':
        return <SuppliersNetwork user={user} />;
      case 'Supply Requisitions':
        return <SupplyRequisitions user={user} />;
      case 'Suppliers':
        return <SupplierManagement user={user} />;
      case 'Markets':
        return <MarketRegistry user={user} />;
      case 'Map View':
        return <InteractiveMap user={user} />;
      case 'KYC Verification':
        return <VendorManagement user={user} />;
      case 'Inventory Control':
        return <InventoryManagement user={user} />;
      case 'Billing & Dues':
      case 'Transactions':
        return <TransactionHistory user={user} />;
      case 'Tickets & Support':
        return <TicketingSystem user={user} />;
      case 'Settings':
        return <ProfileSettings user={user} setUser={setUser} />;
      case 'Audit Logs':
        return <AuditLogs />;
      case 'Support':
        return <ContactForm />;
      case 'QR & Receipts':
        return <QRManagement />;
      case 'Gate Management':
        return <GateManagement />;
      case 'Stock Counter':
        return <StockCounterTerminal />;
      case 'Security Console':
        return <SecurityModule />;
      case 'Revenue Module':
        return <RevenueModule />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <h3 className="text-xl font-bold text-slate-800">{activeTab} module is coming soon</h3>
            <p className="text-slate-500 max-w-md">The component for {activeTab} is being prepared for deployment.</p>
            <Button onClick={() => setActiveTab('Home')}>Back to Home</Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {!isVendorOnboarding && (
          <Sidebar 
            user={user} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isOpen={isSidebarOpen} 
            setIsOpen={setIsSidebarOpen}
            onLogout={onLogout}
          />
        )}

        <div className="flex-1 flex flex-col overflow-y-auto">
          {!isVendorOnboarding && (
            <Header 
              user={user} 
              onLogout={onLogout} 
              onLogoClick={() => setActiveTab('Home')}
              onNotificationClick={() => setShowNotifications(!showNotifications)}
            />
          )}
          
          <div className="relative">
            {showNotifications && <NotificationCenter onClose={() => setShowNotifications(false)} />}
          </div>

          <main className={`flex-1 p-8 max-w-7xl mx-auto w-full ${isVendorOnboarding ? 'flex items-center justify-center' : ''}`}>
            {renderContent()}
          </main>
          
          {!isVendorOnboarding && <Footer />}
        </div>
      </div>
      {!isVendorOnboarding && <Chatbot />}
    </div>
  );
};
