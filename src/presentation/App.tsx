import { GitBranch, ChevronLeft, Settings, LogIn, Plus, Bell, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProfileForm } from './components/ProfileForm';
import { Modal } from './components/Modal';
import type { Profile } from '@domain/profiles/Profile';
import { ClanSettingsProvider, useClanSettingsContext } from './context/ClanSettingsContext';
import { AppRoutes } from './routes/AppRoutes';
import { NAV_ITEMS } from './routes/routeConfig';

function Dashboard() {
  const { user, signOut } = useAuth();
  // TD-003: consumed from shared Context (single fetch for whole Dashboard)
  const { settings: clanSettings } = useClanSettingsContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);

  // LT-602.1: Detect mobile and handle auto-collapse
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // LT-602.14: Collapse on mobile, expand on desktop
      setSidebarCollapsed(mobile);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeNav = NAV_ITEMS.find(item => item.path === location.pathname)?.id || 'home';

  // Close sidebar on navigation on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [location.pathname, isMobile]);

  const handleProfileSuccess = () => {
    setShowForm(false);
    setEditingProfile(undefined);
    setRefreshKey(prev => prev + 1);
  };
  const handleEditProfile = (profile: Profile) => {
    setEditingProfile(profile);
    setShowForm(true);
  };
  const handleAddNew = () => {
    setEditingProfile(undefined);
    setShowForm(true);
  };
  const handleCancel = () => {
    setShowForm(false);
    setEditingProfile(undefined);
  };

  return (
    <div className="flex h-screen bg-[#F0F4FA] font-sans overflow-hidden print-root">

      {/* ── MODAL FORM ───────────────────────────────────────────── */}
      <Modal
        isOpen={showForm}
        onClose={handleCancel}
        title={editingProfile ? `Sửa hồ sơ: ${editingProfile.full_name}` : 'Thêm thành viên mới'}
      >
        <ProfileForm
          initialData={editingProfile}
          onSuccess={handleProfileSuccess}
          onCancel={handleCancel}
        />
      </Modal>

      {/* ── SIDEBAR BACKDROP (Mobile only) ────────────────────────── */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity duration-300"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* ── SIDEBAR ────────────────────────────────────────────────── */}
      <aside className={`
        flex flex-col bg-white border-r border-gray-200 transition-all duration-300 shadow-xl
        ${isMobile
          ? `fixed inset-y-0 left-0 z-50 w-72 ${sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}`
          : `relative z-20 ${sidebarCollapsed ? 'w-[64px]' : 'w-[240px]'}`
        }
      `}>
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md transform transition-transform hover:scale-105 cursor-pointer" onClick={() => navigate('/')}>
              <GitBranch size={18} className="text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="overflow-hidden">
                <div className="text-sm font-black text-gray-900 tracking-tight leading-tight">
                  {clanSettings?.clan_name || 'Gia Phả Dòng Họ'}
                </div>
                <div className="text-[10px] text-gray-400 font-medium whitespace-nowrap">Legacy Tree System</div>
              </div>
            )}
          </div>
          {isMobile && !sidebarCollapsed && (
            <button onClick={() => setSidebarCollapsed(true)} className="p-1 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                title={sidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group
                  ${isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                  }`}
              >
                <Icon size={16} className="shrink-0" />
                {!sidebarCollapsed && <span className="text-xs font-semibold truncate">{item.label}</span>}
                {isActive && !sidebarCollapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-gray-700 py-2 rounded-xl hover:bg-gray-100 transition-all"
          >
            <ChevronLeft size={14} className={`transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            {!sidebarCollapsed && <span className="font-medium">Thu gọn</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN AREA ──────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden print-main-col">
        <header className="flex items-center justify-between px-4 lg:px-6 py-3 bg-white border-b border-gray-200 shadow-sm shrink-0 z-10">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 transition-all"
              >
                <Menu size={20} />
              </button>
            )}
            <div className="min-w-0">
              <div className="text-[10px] text-gray-400 font-medium truncate hidden sm:block">Dòng họ • {clanSettings?.clan_name || 'Lê Huy'}</div>
              <h1 className="text-sm sm:text-base font-black text-gray-900 flex items-center gap-2 mt-0.5 uppercase tracking-tighter truncate">
                {activeNav === 'tree' ? 'Cây gia phả' :
                  activeNav === 'members' ? 'Hồ sơ thành viên' :
                    activeNav === 'ancestry' ? 'Phả ký phả chí' :
                      NAV_ITEMS.find(n => n.id === activeNav)?.label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* LT-505: CRUD buttons only visible to logged-in users */}
            {user && (
              <>
                <button
                  onClick={handleAddNew}
                  className="flex items-center gap-1.5 bg-indigo-600 text-white px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-95"
                >
                  <Plus size={13} /> <span className="hidden sm:inline">Thêm thành viên</span><span className="sm:hidden">Thêm</span>
                </button>
                <div className="h-4 w-px bg-gray-200 mx-1" />
                <button
                  onClick={() => navigate('/settings')}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-all"
                  title="Cài đặt Dòng Họ"
                ><Settings size={16} /></button>
              </>
            )}
            <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-all relative">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                <div className="w-7 h-7 rounded-lg bg-linear-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[10px] font-black shadow-inner shrink-0">
                  {user.email?.[0]?.toUpperCase()}
                </div>
                <button onClick={signOut} className="text-[10px] text-gray-400 hover:text-red-500 font-bold transition-colors hidden sm:block">Đăng xuất</button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-1.5 text-xs text-gray-600 font-bold hover:text-indigo-600 transition-colors pl-2 border-l border-gray-200"
              >
                <LogIn size={14} /> <span className="hidden sm:inline">Đăng nhập</span>
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-hidden relative print-main">
          <AppRoutes onEditProfile={handleEditProfile} refreshKey={refreshKey} />
        </main>

        <footer className="flex flex-col sm:flex-row items-center justify-between px-6 py-2 bg-white border-t border-gray-100 text-[9px] text-gray-400 shrink-0 font-medium gap-2 sm:gap-0">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> <span className="hidden sm:inline">Supabase Connected</span><span className="sm:hidden">Supabase</span></span>
            <span className="text-gray-200">|</span>
            <span className="truncate max-w-[150px] sm:max-w-none">Sprint 6: Tech Debt Cleared</span>
          </div>
          <div className="flex items-center gap-4">
            <span>© 2026 Legacy Tree</span>
            <span className="hidden sm:inline">Build 2.0.3-stable</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ClanSettingsProvider>
          <Dashboard />
        </ClanSettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
