import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Register from "./components/auth/Register";
import PublicTicketForm from "./components/auth/PublicTicketForm";
import Login from "./components/auth/Login";
import { isUserLoggedIn, logoutUser } from "./services/api";

import CustomerDetails from "./components/CustomerDetails";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import CustumerManagement from "./components/CustomerManagement";
import Plans from "./components/Plans";
import Equipment from "./components/Equipment";
import Support from "./components/Support";
import Reports from "./components/Reports";
import UserManagement from "./components/UserManagement";
import MeuPerfil from "./components/MeuPerfil";
import MapComponent from "./components/MapComponent";
import TechnicianManagement from "./components/TechnicianManagement";

// Client Area Imports
import ClientLogin from "./pages/ClientLogin";
import ClientLayout from "./layouts/ClientLayout";
import ClientDashboard from "./pages/ClientDashboard";
import LandingPage from "./pages/LandingPage";
import ClientActivation from "./pages/ClientActivation";
import ClientSignUp from "./pages/ClientSignUp";

import { ThemeProvider } from "./contexts/ThemeContext";

type Pagina =
  "dashboard" | "clientes" | "planos" | "equipamentos" |
  "suporte" | "relatorios" | "usuarios" | "meuperfil" | "mapa" | "tecnicos";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/assinar" element={<ClientSignUp />} />
          <Route path="/public-ticket" element={<PublicTicketFormWrapper />} />
          <Route path="/login" element={<AdminAuthWrapper />} />

          {/* Client Area Routes */}
          <Route path="/area-cliente/login" element={<ClientLogin />} />
          <Route path="/area-cliente/ativar" element={<ClientActivation />} />
          <Route path="/area-cliente" element={<ClientLayout />}>
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="faturas" element={<ClientDashboard />} />
            <Route path="suporte" element={<ClientDashboard />} />
          </Route>

          {/* Admin/Employee Routes */}
          <Route path="/admin/*" element={<AdminLayout />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

// Wrapper to handle Admin Login/Register logic
function AdminAuthWrapper() {
  const [authView, setAuthView] = useState<'login' | 'register' | 'publicTicket'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn().auth);

  if (isLoggedIn) {
    return <Navigate to="/admin" replace />;
  }

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  switch (authView) {
    case 'login':
      return <Login onLogin={handleLoginSuccess} onNavigateToRegister={() => setAuthView('register')} onNavigateToPublicTicket={() => setAuthView('publicTicket')} />;
    case 'register':
      return <Register onNavigateToLogin={() => setAuthView('login')} />;
    case 'publicTicket':
      return <PublicTicketForm onNavigateToLogin={() => setAuthView('login')} />;
    default:
      return <Login onLogin={handleLoginSuccess} onNavigateToRegister={() => setAuthView('register')} onNavigateToPublicTicket={() => setAuthView('publicTicket')} />;
  }
}

function PublicTicketFormWrapper() {
  const navigate = useNavigate();
  return <PublicTicketForm onNavigateToLogin={() => navigate('/')} />;
}

// Admin Layout Component (formerly the main App logic)
function AdminLayout() {
  const auth = isUserLoggedIn();

  if (!auth.auth) {
    return <Navigate to="/login" replace />;
  }

  const [abaAtiva, definirAbaAtiva] = useState<Pagina>("dashboard");
  const [barraLateralRecolhida, definirBarraLateralRecolhida] = useState(false);
  const [idClienteSelecionado, definirIdClienteSelecionado] = useState<number | null>(null);

  const handleLogout = () => {
    logoutUser();
    window.location.href = '/login';
  };

  const renderizarConteudo = () => {
    if (idClienteSelecionado)
      return (
        <CustomerDetails
          idCliente={idClienteSelecionado}
          onBack={() => definirIdClienteSelecionado(null)}
        />
      );

    switch (abaAtiva) {
      case "dashboard": return <Dashboard />;
      case "clientes": return <CustumerManagement onSelecionarCliente={definirIdClienteSelecionado} />;
      case "planos": return <Plans />;
      case "equipamentos": return <Equipment />;
      case "suporte": return <Support />;
      case "relatorios": return <Reports />;
      case "usuarios": return <UserManagement />;
      case "meuperfil": return <MeuPerfil />;
      case "mapa": return <MapComponent />;
      case "tecnicos": return <TechnicianManagement />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-200">
      <Sidebar
        abaAtiva={abaAtiva}
        definirAbaAtiva={(tab: string) => definirAbaAtiva(tab as Pagina)}
        recolhida={barraLateralRecolhida}
        definirRecolhida={definirBarraLateralRecolhida}
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${barraLateralRecolhida ? "ml-16" : "ml-64"}`}>
        <Header
          currentUser={auth.user}
          onLogout={handleLogout}
          onOpenProfile={() => definirAbaAtiva("meuperfil")}
        />
        <main className="flex-1 p-6">{renderizarConteudo()}</main>
      </div>
    </div>
  );
}

export default App;
