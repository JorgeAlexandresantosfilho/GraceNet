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
  latitude?: number;
  longitude?: number;
}

export interface Log {
  id_log: number;
  tabela_afetada: string;
  id_registro_afetado: number;
  tipo_acao: "INSERÇÃO" | "ATUALIZAÇÃO" | "EXCLUSÃO";
  descricao_acao: string;
  usuario_responsavel: string;
  data_acao: string;
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

export interface Usuario {
  usuario_id: number;
  nome_completo: string;
  matricula: string;
  login: string;
  perfil_id: number | null;
  status_usuario: "Ativo" | "Inativo" | "Bloqueado";

  email?: string;
  telefone?: string;
  foto_perfil?: string | null;
  ultimo_login?: string | null;
}

// <<< --- INTERFACE ADICIONADA --- >>>
// (Caso ela estivesse faltando)
export interface PerfilAcesso {
  perfil_id: number;
  nome_perfil: string;
}
// <<< --- FIM DA ADIÇÃO --- >>>

export interface Equipamento {
  id: number | string;
  name: string;
  type: string;
  model: string;
  serialNumber: string;
  status: "Em uso" | "Disponível" | "Manutenção" | "Defeito";
  customer: string | null;
  location: string;
  installDate: string | null;
  lastMaintenance: string | null;
  fabricante?: string;
  mac_adress?: string;
  ip_gerenciado?: string;
  firmware?: string;
}

export interface Relatorio {
  id: "financial" | "customers" | "network" | "growth";
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

export interface Tecnico {
  id_tecnico: number;
  nome: string;
  matricula: string;
  equipe: string;
  status: "Ativo" | "Férias" | "Inativo";
}

export interface Pop {
  id_torre: number;
  localizacao: string;
  ip_gerenciamento: string;
  latitude?: number;
  longitude?: number;
}