import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { 
  LayoutDashboard, 
  Briefcase, 
  DollarSign, 
  Image as ImageIcon, 
  MessageSquare, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { cn } from '../utils/cn';
import { collection, query, orderBy, limit, onSnapshot, getDocs, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Lead } from '../types';
import PortfolioManager from '../components/admin/PortfolioManager';
import ServicesManager from '../components/admin/ServicesManager';
import PricingManager from '../components/admin/PricingManager';
import BlogManager from '../components/admin/BlogManager';
import SettingsManager from '../components/admin/SettingsManager';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
};

// Sub-components
const Overview = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    totalProjects: 0,
    totalPosts: 0
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const leadsSnap = await getDocs(collection(db, 'leads'));
        const projectsSnap = await getDocs(collection(db, 'portfolio'));
        const blogSnap = await getDocs(collection(db, 'blog'));
        
        setStats({
          totalLeads: leadsSnap.size,
          newLeads: leadsSnap.docs.filter(d => d.data().status === 'new').length,
          totalProjects: projectsSnap.size,
          totalPosts: blogSnap.size
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'leads/portfolio/blog');
        setError('Failed to load dashboard stats. You might not have permission.');
      }
    };

    fetchStats();

    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'), limit(5));
    const unsubscribe = onSnapshot(q, 
      (snap) => {
        setRecentLeads(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead)));
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'leads');
        setError('Failed to listen to recent leads.');
      }
    );

    return () => unsubscribe();
  }, []);

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-100 rounded-3xl text-red-600">
        <p className="font-bold mb-2">Access Denied</p>
        <p className="text-sm">{error}</p>
        <p className="text-xs mt-4 opacity-70">Please ensure you are logged in with an administrator account.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-slate-900">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Leads', value: stats.totalLeads, icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'New Leads', value: stats.newLeads, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Projects', value: stats.totalProjects, icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Blog Posts', value: stats.totalPosts, icon: FileText, color: 'text-green-600', bg: 'bg-green-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Recent Inquiries</h3>
            <Link to="/admin/leads" className="text-blue-600 text-sm font-bold hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {recentLeads.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No recent inquiries</p>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-900">{lead.name}</p>
                    <p className="text-sm text-slate-500">{lead.email}</p>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                    lead.status === 'new' ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"
                  )}>
                    {lead.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Add Project', icon: Briefcase, path: '/admin/portfolio' },
              { label: 'New Blog Post', icon: FileText, path: '/admin/blog' },
              { label: 'Update Pricing', icon: DollarSign, path: '/admin/pricing' },
              { label: 'Site Settings', icon: Settings, path: '/admin/settings' },
            ].map((action, i) => (
              <Link
                key={i}
                to={action.path}
                className="flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-100 hover:border-blue-600 hover:bg-blue-50 transition-all gap-3"
              >
                <action.icon className="text-blue-600" size={24} />
                <span className="text-sm font-bold text-slate-700">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const LeadsManager = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, 
      (snap) => {
        setLeads(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead)));
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'leads');
        setError('Failed to load leads. You might not have permission.');
      }
    );
    return () => unsubscribe();
  }, []);

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-100 rounded-3xl text-red-600">
        <p className="font-bold mb-2">Access Denied</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-slate-900">Leads & Inquiries</h2>
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 font-bold text-slate-700">Name</th>
              <th className="px-6 py-4 font-bold text-slate-700">Email</th>
              <th className="px-6 py-4 font-bold text-slate-700">Phone</th>
              <th className="px-6 py-4 font-bold text-slate-700">Status</th>
              <th className="px-6 py-4 font-bold text-slate-700">Date</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{lead.name}</td>
                <td className="px-6 py-4 text-slate-600">{lead.email}</td>
                <td className="px-6 py-4 text-slate-600">{lead.phone || '-'}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                    lead.status === 'new' ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"
                  )}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm">
                  {lead.createdAt ? new Date((lead.createdAt as any).seconds * 1000).toLocaleDateString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        // Basic frontend check for hardcoded admins
        const hardcodedAdmins = ['nirwanisthe@gmail.com', 'nadunrosh@gmail.com'];
        const isHardcoded = hardcodedAdmins.includes(u.email || '');
        
        setIsAdminUser(isHardcoded);

        // Ensure user document exists
        try {
          const userDocRef = doc(db, 'users', u.uid);
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            await setDoc(userDocRef, {
              email: u.email,
              role: isHardcoded ? 'admin' : 'user',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
            if (isHardcoded) setIsAdminUser(true);
          } else {
            if (userDoc.data().role === 'admin') {
              setIsAdminUser(true);
            }
          }
        } catch (err) {
          console.error("Error checking/creating user document:", err);
          // If we can't read the user doc, we might still be an admin via email check in rules
        }
      } else {
        navigate('/admin/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Overview', icon: LayoutDashboard, path: '/admin' },
    { label: 'Inquiries', icon: MessageSquare, path: '/admin/leads' },
    { label: 'Services', icon: Briefcase, path: '/admin/services' },
    { label: 'Pricing', icon: DollarSign, path: '/admin/pricing' },
    { label: 'Portfolio', icon: ImageIcon, path: '/admin/portfolio' },
    { label: 'Blog', icon: FileText, path: '/admin/blog' },
    { label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={cn(
        "bg-slate-900 text-white transition-all duration-300 flex flex-col",
        sidebarOpen ? "w-72" : "w-20"
      )}>
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp size={18} />
              </div>
              <span className="font-bold tracking-tight">AdminPanel</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-grow px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all",
                location.pathname === item.path ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon size={20} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-10 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {isAdminUser ? (
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/leads" element={<LeadsManager />} />
              <Route path="/services" element={<ServicesManager />} />
              <Route path="/pricing" element={<PricingManager />} />
              <Route path="/portfolio" element={<PortfolioManager />} />
              <Route path="/blog" element={<BlogManager />} />
              <Route path="/settings" element={<SettingsManager />} />
            </Routes>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                <Lock size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Access Restricted</h2>
              <p className="text-slate-500 max-w-md">
                You do not have administrator privileges. Please contact the site owner if you believe this is an error.
              </p>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
