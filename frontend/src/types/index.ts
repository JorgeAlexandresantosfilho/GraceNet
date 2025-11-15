export interface Cliente {
  id: number;
  cpf: string;
  nomeCompleto: string;
  telefone: string;
  email: string;
  cep: string;
  rua: string;
  numero: string;
  status: "Ativo" | "Pendente" | "Inativo";
  plano: string;
  vencimento: string;
  dataNascimento?: string;
}

export interface Plano {
  id: number;
  nome: string;
  velocidade: string;
  preco: number;
  descricao: string;
  features: string[];
  clientes: number;
  status: "Ativo" | "Inativo";
}

export interface TicketSuporte {
  id: number;
  titulo: string;
  cliente: string;
  telefone: string;
  plano: string;
  categoria: string;
  descricao: string;
  criado: string;
  atualizado: string;
  status: "Aberto" | "Em andamento" | "Resolvido";
  prioridade: "Alta" | "Média" | "Baixa";
  inicio_desejado_input?: string;
  id_tecnico: number | null;
}

// --- CORREÇÕES AQUI ---
export interface Equipamento {
  id: number | string; // Corrigido: Aceita ID numérico ou Serial (string)
  name: string;
  type: string;
  model: string;
  serialNumber: string;
  status: "Em uso" | "Disponível" | "Manutenção" | "Defeito";
  customer: string | null;
  location: string;
  installDate: string | null;
  lastMaintenance: string | null;
  // Campos extras do backend (opcionais)
  fabricante?: string;
  mac_adress?: string;
  ip_gerenciado?: string;
  firmware?: string;
}
// --- FIM DAS CORREÇÕES ---

export interface Usuario {
  usuario_id: number;
  nome_completo: string;
  perfil_id: number | null;
}

export interface Relatorio {
  id: "financial" | "customers" | "network" | "growth";
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}