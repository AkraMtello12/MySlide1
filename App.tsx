import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Menu, X, AlertTriangle } from 'lucide-react';
import { getAppData } from './services/storage';
import { isFirebaseConfigured } from './firebase';
import { AppData } from './types';
import HomePage from './pages/Home';
import AdminPage from './pages/Admin';
import LoginPage from './pages/Login';
import { Button } from './components/UIComponents';

// Placeholder Logo URL
const LOGO_URL = "https://cdn-icons-png.flaticon.com/512/2881/2881031.png";

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-secondary/20 shadow-sm">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={LOGO_URL} 
              alt="MySlide Logo" 
              className="w-10 h-10 object-contain transform group-hover:rotate-6 transition-transform duration-300 drop-shadow-lg"
            />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary leading-none tracking-tight">MySlide</span>
              <span className="text-xs text-secondary font-medium tracking-wider">AGENCY</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-reverse space-x-8">
            <Link to="/" className={`text-sm font-bold hover:text-secondary transition-colors ${location.pathname === '/' ? 'text-primary' : 'text-gray-500'}`}>
              الرئيسية
            </Link>
            <Link to="/admin" className="px-5 py-2 bg-primary text-white rounded-full text-sm font-bold hover:bg-secondary transition-all hover:shadow-lg hover:shadow-secondary/40 flex items-center gap-2">
              <LayoutDashboard size={16} />
              <span>لوحة التحكم</span>
            </Link>
          </div>

          <button className="md:hidden p-2 text-primary" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b border-secondary/20 absolute w-full left-0 top-20 shadow-xl py-4 flex flex-col space-y-4 px-6 animate-fade-in-down">
          <Link to="/" className="text-lg font-bold text-primary py-2 border-b border-gray-100">الرئيسية</Link>
          <Link to="/admin" className="text-lg font-bold text-secondary py-2">لوحة التحكم</Link>
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-primary text-white py-8 mt-auto border-t border-white/10">
    <div className="container mx-auto px-4 text-center">
      <p className="text-gray-300 text-sm font-medium">
        &copy; 2026 MySlide Agency. جميع الحقوق محفوظة.
      </p>
    </div>
  </footer>
);

export default function App() {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isConfigured, setIsConfigured] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const appData = await getAppData();
      setData(appData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("فشل في تحميل البيانات.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const configured = isFirebaseConfigured();
    setIsConfigured(configured);

    if (configured) {
      fetchData();
      const storedAuth = sessionStorage.getItem('isAdminLoggedIn');
      if (storedAuth === 'true') {
        setIsAdminLoggedIn(true);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = () => {
    setIsAdminLoggedIn(true);
    sessionStorage.setItem('isAdminLoggedIn', 'true');
  };

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-xl border-t-4 border-yellow-500">
           <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
           <h1 className="text-2xl font-black text-primary mb-4">مطلوب إعداد Firebase</h1>
           <p className="text-gray-600 mb-6 leading-relaxed">يرجى ربط قاعدة البيانات للبدء.</p>
           <Button onClick={() => window.location.reload()}>تحديث الصفحة</Button>
        </div>
      </div>
    );
  }

  // Minimalist loading screen - No text as requested
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse">
        <img src={LOGO_URL} alt="Loading..." className="w-16 h-16 opacity-50 grayscale" />
      </div>
    </div>
  );

  if (error) return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-4">
      <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 max-w-lg">
        <h3 className="font-bold text-lg mb-2">عذراً</h3>
        <p>{error}</p>
        <Button className="mt-4 bg-red-600 hover:bg-red-700" onClick={() => window.location.reload()}>تحديث</Button>
      </div>
    </div>
  );

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col font-sans bg-background">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage data={data!} />} />
            <Route 
              path="/admin" 
              element={isAdminLoggedIn ? <AdminPage onUpdate={fetchData} initialData={data!} /> : <LoginPage onLogin={handleLogin} />} 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}