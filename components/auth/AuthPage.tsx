
import React, { useState } from 'react';
import { Mail, Lock, User, Fingerprint, MessageSquare, Info, AlertCircle, X, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { UserProfile, Role } from '../../types';
import { Header } from '../ui/Header';
import { Footer } from '../ui/Footer';

interface AuthPageProps {
  onSuccess: (user: UserProfile) => void;
}

export const AuthPage = ({ onSuccess }: AuthPageProps) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP' | 'MFA' | 'FORGOT' | 'CONTACT'>('LOGIN');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationTooltip, setShowVerificationTooltip] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    
    if (mode === 'LOGIN') {
      setMode('MFA');
    } else if (mode === 'SIGNUP') {
      setShowVerificationTooltip(true);
    } else if (mode === 'MFA') {
      onSuccess({
        id: 'u-' + Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0] || 'Demo User',
        email: email || 'demo@market.com',
        role: 'USER' as Role,
        isVerified: true,
        kycStatus: 'NONE',
        mfaEnabled: true,
      });
    }
    setLoading(false);
  };

  const handleContactAdmin = () => {
    setMode('CONTACT');
    setShowVerificationTooltip(false);
  };

  const closeTooltipAndReset = () => {
    setShowVerificationTooltip(false);
    setMode('LOGIN');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      <Header 
        user={null} 
        isSimplified={true}
        onLogoClick={() => setMode('LOGIN')}
      />
      
      {showVerificationTooltip && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <Card className="max-w-md w-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>
            <button onClick={closeTooltipAndReset} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Check Your Email</h3>
              <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                We've sent a verification link to <span className="font-bold text-slate-800">{email || 'your email'}</span>. 
                Please click the link to activate your account.
              </p>
              
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-3 text-left mb-6">
                <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                  Can't find it? Check your <span className="font-bold">Spam, Junk, or Outbox</span> folders. 
                  The link expires in 24 hours.
                </p>
              </div>

              <Button className="w-full" onClick={closeTooltipAndReset}>
                I've Verified My Email
              </Button>
            </div>
          </Card>
        </div>
      )}

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center justify-center gap-2">
              MMIS <span className="text-indigo-600">Portal</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Regional Multi-Vendor Intelligence & Management</p>
          </div>

          <Card className="shadow-2xl border-t-4 border-t-indigo-600">
            {mode === 'LOGIN' && (
              <>
                <h2 className="text-xl font-bold mb-6 text-center text-slate-800 tracking-tight">Operator Authentication</h2>
                <Input label="System ID / Email" icon={Mail} placeholder="operator@mmis.ug" value={email} onChange={(e:any)=>setEmail(e.target.value)} />
                <Input label="Access Key" type="password" icon={Lock} placeholder="••••••••" />
                
                <div className="flex items-center justify-between mb-6">
                  <label className="flex items-center text-sm text-slate-600 cursor-pointer font-medium">
                    <input type="checkbox" className="mr-2 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500" /> Remember Workspace
                  </label>
                  <button onClick={() => setMode('FORGOT')} className="text-sm text-indigo-600 font-bold hover:underline">Lost access?</button>
                </div>

                <Button className="w-full py-3" onClick={handleAuth} loading={loading}>Authorize Session</Button>
                
                <div className="mt-8 text-center space-y-3">
                  <p className="text-sm text-slate-500 font-medium">
                    New to the ecosystem? <button onClick={() => setMode('SIGNUP')} className="text-indigo-600 font-bold hover:underline">Register Now</button>
                  </p>
                  <div className="pt-2 border-t border-slate-100">
                    <button onClick={handleContactAdmin} className="text-[11px] text-slate-400 hover:text-indigo-600 font-black uppercase tracking-widest flex items-center justify-center gap-2 mx-auto transition-colors">
                      <MessageSquare size={14} /> Contact System Admin
                    </button>
                  </div>
                </div>
              </>
            )}

            {mode === 'SIGNUP' && (
              <>
                <h2 className="text-xl font-bold mb-6 text-center text-slate-800 tracking-tight">Create Entity Account</h2>
                <Input label="Legal Full Name" icon={User} placeholder="e.g. Mukasa James" />
                <Input label="Primary Email" icon={Mail} placeholder="name@domain.com" value={email} onChange={(e:any)=>setEmail(e.target.value)} />
                <Input label="Master Password" type="password" icon={Lock} placeholder="Secure passphrase" />
                
                <Button className="w-full py-3" onClick={handleAuth} loading={loading}>Initialize Registration</Button>
                
                <div className="mt-8 text-center space-y-3">
                  <p className="text-sm text-slate-500 font-medium">
                    Existing operator? <button onClick={() => setMode('LOGIN')} className="text-indigo-600 font-bold hover:underline">Return to Log in</button>
                  </p>
                  <div className="pt-2 border-t border-slate-100">
                    <button onClick={handleContactAdmin} className="text-[11px] text-slate-400 hover:text-indigo-600 font-black uppercase tracking-widest flex items-center justify-center gap-2 mx-auto transition-colors">
                      <MessageSquare size={14} /> Contact System Admin
                    </button>
                  </div>
                </div>
              </>
            )}

            {mode === 'CONTACT' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Support Terminal</h2>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Inquiry Node</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mb-6 font-medium leading-relaxed">Need assistance with credentials or regional access? Submit an administrative ticket.</p>
                <Input label="Inquiry Subject" placeholder="e.g., Verification Failure" />
                <Input label="Technical Details" multiline placeholder="Provide specific error codes or context..." />
                <Button className="w-full py-3" onClick={() => { alert('Administrative Ticket Created!'); setMode('LOGIN'); }}>Dispatch Ticket</Button>
                <button onClick={() => setMode('LOGIN')} className="w-full text-xs text-slate-400 font-black uppercase tracking-widest hover:text-indigo-600 mt-4 text-center">Back to Authentication</button>
              </div>
            )}

            {mode === 'MFA' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Fingerprint size={32} />
                </div>
                <h2 className="text-xl font-bold mb-2 text-slate-800">Multi-Factor Auth</h2>
                <p className="text-sm text-slate-500 mb-8 font-medium">Verify your identity via the generated 6-digit MMIS Secure Key</p>
                <div className="flex gap-2 justify-center mb-8">
                  {[1,2,3,4,5,6].map(i => (
                    <input 
                      key={i} 
                      maxLength={1} 
                      autoFocus={i === 1}
                      className="w-10 h-12 bg-black text-white border border-slate-800 rounded-lg text-center font-bold text-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-lg" 
                    />
                  ))}
                </div>
                <Button className="w-full py-3" onClick={handleAuth} loading={loading}>Validate Key</Button>
                <p className="mt-6 text-xs text-slate-400">Can't access your authenticator? <button className="text-indigo-600 font-bold hover:underline">Use Recovery Code</button></p>
              </div>
            )}
            
            {mode === 'FORGOT' && (
              <>
                <h2 className="text-xl font-bold mb-4 text-center text-slate-800">Credential Recovery</h2>
                <p className="text-sm text-slate-500 mb-8 text-center font-medium">We'll dispatch recovery instructions to your registered primary email.</p>
                <Input label="Primary Email" icon={Mail} placeholder="operator@domain.ug" />
                <Button className="w-full py-3" onClick={() => { alert('Recovery packet dispatched!'); setMode('LOGIN'); }}>Send Recovery Link</Button>
                <div className="mt-8 text-center pt-4 border-t border-slate-100">
                  <button onClick={() => setMode('LOGIN')} className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">Return to Login</button>
                </div>
              </>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};
