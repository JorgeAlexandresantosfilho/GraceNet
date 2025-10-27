import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Wifi,
  DollarSign, // Vamos manter o ícone, mas remover o dado
  Calendar,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Activity,
  FileText,
} from "lucide-react";
// IMPORTA DA API, NÃO DOS DADOS FALSOS!
import { getClienteById, deleteCliente } from "../services/api"; 
import type { Cliente } from "../types";

// Função auxiliar para determinar a cor do status
const pegarStatusCor = (status: string) => {
  switch (status) {
    case "Ativo":
      return "bg-green-100 text-green-800";
    case "Inativo":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

interface CustomerDetailsProps {
  idCliente: number;
  onBack: () => void;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  idCliente,
  onBack,
}) => {
  const [abaAtiva, definirAbaAtiva] = useState("visaoGeral");

  // --- LÓGICA DE BUSCA DE DADOS ---
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarCliente = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getClienteById(idCliente);
        setCliente(data);
      } catch (err) {
        setError("Falha ao carregar dados do cliente.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    carregarCliente();
  }, [idCliente]); // Recarrega se o ID mudar

  // --- Lógica de Excluir (Soft Delete) ---
  const handleExcluir = async () => {
    if (cliente && window.confirm("Tem certeza que deseja inativar este cliente?")) {
      try {
        await deleteCliente(cliente.id);
        alert("Cliente inativado com sucesso.");
        onBack(); // Volta para a lista
      } catch (err) {
        alert("Falha ao inativar o cliente.");
        console.error(err);
      }
    }
  };

  // Se o cliente não for encontrado (após carregar)
  if (loading) {
    return <div className="p-6 text-center">Carregando...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }
  
  if (!cliente) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>Cliente não encontrado.</p>
        <button
          onClick={onBack}
          className="mt-4 text-blue-500 hover:underline"
        >
          Voltar para a lista
        </button>
      </div>
    );
  }

  const renderizarConteudoDaAba = () => {
    if (abaAtiva === "visaoGeral") {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card de Informações Pessoais */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informações Pessoais
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Nome</p>
                  <p className="font-medium text-gray-900">{cliente.nomeCompleto}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{cliente.email}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="font-medium text-gray-900">{cliente.telefone}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">CPF</p>
                  <p className="font-medium text-gray-900">{cliente.cpf}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Endereço</p>
                  <p className="font-medium text-gray-900">{`${cliente.rua}, ${cliente.numero} - CEP: ${cliente.cep}`}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card de Plano e Conexão */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Plano e Conexão
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Wifi className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Plano</p>
                  <p className="font-medium text-gray-900">{cliente.plano}</p>
                </div>
              </div>
              
              {/* CORREÇÃO: Removido 'dataInstalacao' pois não existe */}
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Data de Nascimento</p>
                  <p className="font-medium text-gray-900">{cliente.dataNascimento}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Card de Informações Financeiras */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informações Financeiras
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Reduzido para 2 colunas */}
              
              {/* CORREÇÃO: Removido 'valorMensal' e 'ultimoPagamento' */}

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="text-orange-600 w-8 h-8 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Próximo Vencimento</p>
                <p className="text-lg font-semibold text-gray-900">{cliente.vencimento}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Status</p>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${pegarStatusCor(cliente.status)}`}>
                  {cliente.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null; // Retorna null se nenhuma aba corresponder
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            title="Voltar"
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{cliente.nomeCompleto}</h1>
            <p className="text-gray-600">Cliente #{cliente.id} • {cliente.plano}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Edit className="w-4 h-4" />
            <span>Editar</span>
          </button>
          <button 
            onClick={handleExcluir}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Trash2 className="w-4 h-4" />
            <span>Inativar</span> {/* Mudei de Excluir para Inativar */}
          </button>
        </div>
      </div>

      {/* StatusCards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* Reduzido para 3 colunas */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg"><CheckCircle className="w-5 h-5 text-green-600" /></div>
            <div>
              <p className="text-sm text-gray-600">Status da Conta</p>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${pegarStatusCor(cliente.status)}`}>{cliente.status}</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg"><Activity className="w-5 h-5 text-blue-600" /></div>
            <div>
              <p className="text-sm text-gray-600">Conexão</p>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${pegarStatusCor(cliente.status)}`}>{cliente.status}</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg"><Wifi className="w-5 h-5 text-purple-600" /></div>
            <div>
              <p className="text-sm text-gray-600">Plano</p>
              <p className="font-semibold text-gray-900">{cliente.plano}</p>
            </div>
          </div>
        </div>
        {/* CORREÇÃO: Removido o card de 'Mensalidade' */}
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => definirAbaAtiva("visaoGeral")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                abaAtiva === "visaoGeral"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Visão Geral
            </button>
          </nav>
        </div>
        <div className="p-6">{renderizarConteudoDaAba()}</div>
      </div>
    </div>
  );
};

export default CustomerDetails;