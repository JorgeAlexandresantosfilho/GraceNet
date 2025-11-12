import { useState } from "react";
// Importa a nova tela de Cadastro
import Register from "./components/auth/Register";
import CustomerDetails from "./components/CustomerDetails";
import Login from "./components/auth/Login";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import CustumerManagement from "./components/CustomerManagement";
import Plans from "./components/Plans";
import Equipment from "./components/Equipment";
import Support from "./components/Support";
import Reports from "./components/Reports";

function App() {
  const [isAutenticado, setIsAutenticado] = useState(false);
  const [abaAtiva, definirAbaAtiva] = useState("dashboard");
  const [barraLateralRecolhida, definirBarraLateralRecolhida] = useState(false);
  const [idClienteSelecionado, definirIdClienteSelecionado] = useState<
    number | null
  >(null);
  
  // --- NOVO ESTADO ---
  // Controla se vemos a tela de 'login' ou de 'register'
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  const renderizarConteudo = () => {
    if (idClienteSelecionado) {
      return (
        <CustomerDetails 
          idCliente={idClienteSelecionado}
          onBack={() => definirIdClienteSelecionado(null)}
        />
      );
    }

    switch (abaAtiva) {
      case "dashboard":
        return <Dashboard />;
      case "clientes":
        return <CustumerManagement onSelecionarCliente={definirIdClienteSelecionado} />;
      case "planos":
        return <Plans />;
      case "equipamentos":
        return <Equipment />;
      case "suporte":
        return <Support />;
      case "relatorios":
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  const renderizarAutenticacao = () => {
    // --- LÓGICA ATUALIZADA ---
    // Se o estado for 'login', mostra Login.
    // Se for 'register', mostra Register.
    if (authView === 'login') {
      return (
        <Login 
          onLogin={() => {setIsAutenticado(true)}}
          onNavigateToRegister={() => setAuthView('register')} // Passa a função para mudar de tela
        />
      );
    }
    
    if (authView === 'register') {
       return (
         <Register
           onNavigateToLogin={() => setAuthView('login')} // Passa a função para voltar ao login
         />
       );
    }
  };

  if (!isAutenticado) {
    return renderizarAutenticacao();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        abaAtiva={abaAtiva}
        definirAbaAtiva={definirAbaAtiva}
        recolhida={barraLateralRecolhida}
        definirRecolhida={definirBarraLateralRecolhida}
      />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          barraLateralRecolhida ? "ml-16" : "ml-64"
        }`}
      >
        <Header />
        <main className="flex-1 p-6 overflow-auto">{renderizarConteudo()}</main>
      </div>
    </div>
  );
}

export default App;