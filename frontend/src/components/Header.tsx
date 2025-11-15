import React, { useState, useEffect, useRef } from 'react';
import { Bell, User, Search, LogOut, Settings } from 'lucide-react';
// Importa os tipos e a função de buscar perfis
import type { Usuario, PerfilAcesso } from '../types';
import { getPerfisAcesso } from '../services/api'; 

// Define as props que o Header vai receber do App.tsx
interface HeaderProps {
  currentUser: Usuario | null; // Recebe o objeto do usuário logado
  onLogout: () => void; // Recebe a função de logout
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [perfis, setPerfis] = useState<Map<number, string>>(new Map());

  // Busca os perfis (Admin, Tecnico) quando o componente carrega
  useEffect(() => {
    const carregarPerfis = async () => {
      try {
        const listaPerfis = await getPerfisAcesso(); 
        const mapaPerfis = new Map(listaPerfis.map(p => [p.perfil_id, p.nome_perfil]));
        setPerfis(mapaPerfis);
      } catch (error) {
        console.error("Erro ao carregar perfis no Header:", error);
      }
    };
    carregarPerfis();
  }, []);

  // Lógica para fechar o dropdown se clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Busca o nome do perfil (ex: "Administrador")
  const getNomePerfil = () => {
    if (currentUser?.perfil_id && perfis.has(currentUser.perfil_id)) {
      return perfis.get(currentUser.perfil_id);
    }
    // Tenta adivinhar se o perfil não foi carregado (ex: ID 1 = Admin)
    if (currentUser?.perfil_id === 1) return "Administrador";
    return "Usuário"; // Padrão
  };

  return (
    <header className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
      {/* Barra de Busca (do seu print) */}
      <div className="relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar..."
          className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Ícones e Perfil do Usuário */}
      <div className="flex items-center space-x-4">
        <button
          title="Notificações"
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600 relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* --- SEÇÃO DO PERFIL (AGORA FUNCIONAL) --- */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              {/* TODO: Adicionar imagem de perfil se houver */}
              <User className="w-5 h-5 text-gray-500" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-gray-800">
                {/* Mostra o nome do usuário logado */}
                {currentUser?.nome_completo || 'Usuário'}
              </p>
              <p className="text-xs text-gray-500">
                {/* Mostra o nome do perfil */}
                {getNomePerfil()}
              </p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <div className="p-2 border-b border-gray-100">
                 <p className="text-sm font-medium text-gray-800 px-2">
                   {currentUser?.nome_completo}
                 </p>
                 <p className="text-xs text-gray-500 px-2">
                   {currentUser?.login}
                 </p>
              </div>
              <div className="py-1">
                <a
                  href="#"
                  onClick={(e) => { 
                      e.preventDefault(); 
                      alert('Tela "Meu Perfil" não implementada.'); 
                      setIsDropdownOpen(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Meu Perfil
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onLogout(); // Chama a função de logout do App.tsx
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;