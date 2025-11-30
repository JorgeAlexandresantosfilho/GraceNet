import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isUserLoggedIn } from '../services/api';

interface PrivateRouteProps {
    roles?: number[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ roles }) => {
    const { auth, user } = isUserLoggedIn();

    if (!auth) {
        return <Navigate to="/login" replace />;
    }

    if (roles && user) {
        if (user.perfil_id === null || !roles.includes(user.perfil_id)) {
            // User logged in but doesn't have permission
            return (
                <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
                    <h1 className="text-4xl font-bold mb-4">403</h1>
                    <p className="text-xl mb-6">Acesso Negado. Você não tem permissão para acessar esta página.</p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Voltar
                    </button>
                </div>
            );
        }
    }

    return <Outlet />;
};

export default PrivateRoute;
