import { Bell, Search, User } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar"
              className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="button"
            aria-label="Notificações"
            className="p-2 text-gray-400 hover:text-gray-600 relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              5
            </span>
          </button>

          <div className="flex items-center space-x-3 pl-4 border-1 border-gray-300">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">Gustavo Mariz</p>
              <p className="text-xs text-gray-500">Administrador</p>
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
