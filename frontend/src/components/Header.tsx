import React, { useState, useEffect, useRef } from 'react';
import { Bell, User, Search, LogOut, Settings, Sun, Moon } from 'lucide-react';
import type { Usuario, PerfilAcesso } from '../types';
import { getPerfisAcesso } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  currentUser: Usuario | null;
  onLogout: () => void;
  onOpenProfile: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, onOpenProfile }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  const [perfis, setPerfis] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    const carregarPerfis = async () => {
      try {
        const listaPerfis = await getPerfisAcesso();
        const mapa = new Map(listaPerfis.map(p => [p.perfil_id, p.nome_perfil]));
        setPerfis(mapa);
      } catch (error) {
        console.error("Erro ao carregar perfis:", error);
      }
    };
    carregarPerfis();
  }, []);

  const getNomePerfil = () => {
    if (currentUser?.perfil_id && perfis.has(currentUser.perfil_id)) {
      return perfis.get(currentUser.perfil_id);
    }
    return "Usuário";
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between transition-colors duration-200">
      <div className="relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar..."
          className="pl-10 pr-4 py-2 w-64 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={theme === 'light' ? 'Mudar para modo escuro' : 'Mudar para modo claro'}
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-500" />
          )}
        </button>

        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500 dark:text-gray-300" />
            </div>

            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {currentUser?.nome_completo || "Usuário"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {getNomePerfil()}
              </p>
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg border dark:border-gray-700 rounded-lg z-50">
              <div className="p-2 border-b dark:border-gray-700">
                <p className="text-sm font-medium px-2 dark:text-white">{currentUser?.nome_completo}</p>
                <p className="text-xs px-2 text-gray-500 dark:text-gray-400">{currentUser?.login}</p>
              </div>

              <div className="py-1">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenProfile();
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Meu Perfil
                </a>

                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onLogout();
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
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
