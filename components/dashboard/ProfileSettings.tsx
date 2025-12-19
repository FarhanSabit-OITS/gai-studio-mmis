
import React, { useState } from 'react';
import { User, Mail, Lock, Camera, Shield, Smartphone, Globe, Save } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { UserProfile } from '../../types';

interface ProfileSettingsProps {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
}

export const ProfileSettings = ({ user, setUser }: ProfileSettingsProps) => {
  const [activeSection, setActiveSection] = useState<'PROFILE' | 'SECURITY' | 'PREFERENCES'>('PROFILE');
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setUser({ ...user, name: formData.name, email: formData.email });
    setLoading(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 space-y-2">
          <button 
            onClick={() => setActiveSection('PROFILE')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeSection === 'PROFILE' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-600 hover:bg-white'}`}
          >
            <User size={18} /> My Profile
          </button>
          <button 
            onClick={() => setActiveSection('SECURITY')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeSection === 'SECURITY' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-600 hover:bg-white'}`}
          >
            <Shield size={18} /> Security & Auth
          </button>
          <button 
            onClick={() => setActiveSection('PREFERENCES')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeSection === 'PREFERENCES' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-600 hover:bg-white'}`}
          >
            <Globe size={18} /> Preferences
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {activeSection === 'PROFILE' && (
            <Card title="Public Profile">
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="relative group w-32 h-32">
                  <div className="w-full h-full rounded-2xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-4xl font-black text-slate-400 overflow-hidden">
                    {user.name.charAt(0)}
                  </div>
                  <button className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                    <Camera size={24} />
                  </button>
                </div>
                <div className="flex-1 space-y-4">
                  <Input label="Full Name" icon={User} value={formData.name} onChange={(e:any) => setFormData({...formData, name: e.target.value})} />
                  <Input label="Email Address" icon={Mail} value={formData.email} onChange={(e:any) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div className="pt-6 border-t border-slate-50 flex justify-end">
                <Button onClick={handleUpdateProfile} loading={loading}><Save size={18}/> Update Basic Info</Button>
              </div>
            </Card>
          )}

          {activeSection === 'SECURITY' && (
            <div className="space-y-6">
              <Card title="Change Password">
                <div className="space-y-4">
                  <Input type="password" label="Current Password" placeholder="••••••••" icon={Lock} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input type="password" label="New Password" placeholder="••••••••" icon={Lock} />
                    <Input type="password" label="Confirm New Password" placeholder="••••••••" icon={Lock} />
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-50 flex justify-end">
                  <Button variant="secondary">Change Password</Button>
                </div>
              </Card>

              <Card title="Multi-Factor Authentication (MFA)">
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                      <Smartphone size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-800 text-sm">Authenticator App Enabled</h4>
                      <p className="text-xs text-emerald-600">Your account is secured with 2FA.</p>
                    </div>
                  </div>
                  <Button variant="danger" className="!py-1 text-xs">Disable</Button>
                </div>
              </Card>
            </div>
          )}

          {activeSection === 'PREFERENCES' && (
             <Card title="System Preferences">
               <div className="space-y-4">
                 <div className="flex items-center justify-between py-2 border-b border-slate-50">
                   <div>
                     <p className="text-sm font-bold text-slate-800">Email Notifications</p>
                     <p className="text-xs text-slate-500">Receive weekly reports and stock alerts.</p>
                   </div>
                   <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-indigo-600" />
                 </div>
                 <div className="flex items-center justify-between py-2 border-b border-slate-50">
                   <div>
                     <p className="text-sm font-bold text-slate-800">Browser Alerts</p>
                     <p className="text-xs text-slate-500">Enable real-time order notifications.</p>
                   </div>
                   <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-indigo-600" />
                 </div>
                 <div className="flex items-center justify-between py-2">
                   <div>
                     <p className="text-sm font-bold text-slate-800">Theme Preference</p>
                     <p className="text-xs text-slate-500">Choose between light or system theme.</p>
                   </div>
                   <select className="bg-slate-100 border-none rounded-lg px-3 py-1 text-xs outline-none">
                     <option>System Default</option>
                     <option>Light Mode</option>
                     <option>Dark Mode</option>
                   </select>
                 </div>
               </div>
             </Card>
          )}
        </div>
      </div>
    </div>
  );
};
