import React, { useState } from 'react';
import { Wifi, User, Send, CheckCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios'; // Usamos axios para a chamada

// URL da sua API de backend
const API_URL = 'http://localhost:3000';

interface PublicTicketFormProps {
  onNavigateToLogin: () => void; // Função para voltar ao login de admin
}

const PublicTicketForm: React.FC<PublicTicketFormProps> = ({ onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    cpf: '',
    titulo: '',
    descricao_problema: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const { cpf, titulo, descricao_problema } = formData;

    if (!cpf || !titulo || !descricao_problema) {
      setError('Todos os campos são obrigatórios.');
      setLoading(false);
      return;
    }

    try {
      // 1. Chamar a nova rota /public/ticket
      const response = await axios.post(`${API_URL}/public/ticket`, {
        cpf,
        titulo,
        descricao_problema,
      });
      
      setSuccess(response.data.msg); // "Chamado aberto com sucesso!..."
      setFormData({ cpf: '', titulo: '', descricao_problema: '' }); // Limpa o formulário

    } catch (err: any) {
      // Se a API der erro (ex: "CPF não encontrado")
      if (err.response && err.response.data && err.response.data.Msg) {
        setError(err.response.data.Msg);
      } else {
        setError('Erro de conexão. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        
        <div className="flex flex-col items-center mb-6">
          <div className="p-4 bg-blue-600 rounded-full mb-3">
            <Wifi className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Portal do Cliente</h1>
          <p className="text-gray-600">Precisa de ajuda? Abra seu chamado aqui.</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Abrir Chamado de Suporte</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">Seu CPF</label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="cpf"
                  name="cpf"
                  type="text"
                  required
                  value={formData.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título do Problema</label>
              <input
                id="titulo"
                name="titulo"
                type="text"
                required
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Ex: Internet lenta"
                className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="descricao_problema" className="block text-sm font-medium text-gray-700">Descreva o Problema</label>
              <textarea
                id="descricao_problema"
                name="descricao_problema"
                rows={4}
                required
                value={formData.descricao_problema}
                onChange={handleChange}
                placeholder="Detalhe o que está acontecendo..."
                className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Mensagem de Erro ou Sucesso */}
            {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>{success}</span>
                </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm 
                text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none 
                focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : (
                    <>
                        <Send className="w-5 h-5 mr-2" />
                        Enviar Chamado
                    </>
                )}
              </button>
            </div>
          </form>

          {/* Link Voltar */}
          <div className="text-center mt-6">
            <button
              onClick={onNavigateToLogin}
              className="font-medium text-sm text-gray-600 hover:text-blue-600 hover:underline flex items-center justify-center mx-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Voltar para o login de Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicTicketForm;