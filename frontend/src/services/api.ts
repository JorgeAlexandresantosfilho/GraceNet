import axios from 'axios';
import type { Cliente, Plano, Equipamento, TicketSuporte, Usuario, PerfilAcesso } from '../types';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
});

// ===================================================================
// FUNÇÕES DE CLIENTE (Sem alterações)
// ===================================================================
const mapBackendClienteToFrontend = (backendCliente: any): Cliente => {
  return {
    id: backendCliente.id_cliente,
    cpf: backendCliente.cpf || '',
    nomeCompleto: backendCliente.nome_completo || '',
    telefone: backendCliente.telefone || '',
    email: backendCliente.email || '',
    cep: backendCliente.cep || '',
    rua: backendCliente.rua || '',
    numero: backendCliente.numero || '',
    status: backendCliente.status === 1 ? 'Ativo' : 'Inativo',
    plano: backendCliente.plano || '',
    vencimento: backendCliente.vencimento ? `Todo dia ${backendCliente.vencimento}`: '',
    dataNascimento: backendCliente.data_nascimento ? new Date(backendCliente.data_nascimento).toLocaleDateString('pt-BR'): '',
  };
};
export const getClientes = async (): Promise<Cliente[]> => {
  try {
    const response = await apiClient.get('/Customer');
    return Array.isArray(response.data) ? response.data.map(mapBackendClienteToFrontend) : [];
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    throw new Error("Não foi possível carregar os clientes.");
  }
};
export const getClienteById = async (id: number): Promise<Cliente> => {
  try {
    const response = await apiClient.get(`/Customer/${id}`);
    if (response.data) {
      return mapBackendClienteToFrontend(response.data);
    } else {
      throw new Error("Cliente não encontrado.");
    }
  } catch (error) {
    console.error(`Erro ao buscar cliente ${id}:`, error);
    throw new Error("Falha ao carregar dados do cliente.");
  }
};
export const createCliente = async (dadosNovoCliente: any): Promise<Cliente> => {
  try {
    const response = await apiClient.post('/Customer', dadosNovoCliente);
    if (response.data.result?.insertId) {
      const novoId = response.data.result.insertId;
      return await getClienteById(novoId);
    } else {
       console.warn("Backend não retornou insertId ao criar cliente.");
       return mapBackendClienteToFrontend({...dadosNovoCliente, id_cliente: Date.now()});
    }
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.mensagem || "Falha ao criar o cliente.");
    }
    throw new Error("Falha ao criar o cliente.");
  }
};
export const updateCliente = async (id: number, dadosCliente: Partial<Cliente>): Promise<Partial<Cliente>> => {
  try {
    const payload = mapFrontendClienteToBackend(dadosCliente);
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
    await apiClient.put(`/Customer/${id}`, payload);
    return dadosCliente;
  } catch (error) {
    console.error(`Erro ao atualizar cliente ${id}:`, error);
    throw new Error("Falha ao atualizar o cliente.");
  }
};
export const deleteCliente = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/Customer/${id}`);
  } catch (error) {
    console.error(`Erro ao inativar cliente ${id}:`, error);
    throw new Error("Falha ao inativar o cliente.");
  }
};
const mapFrontendClienteToBackend = (cliente: Partial<Cliente>) => {
  const backendData: any = {};
  if (cliente.nomeCompleto !== undefined) backendData.nome_completo = cliente.nomeCompleto;
  if (cliente.telefone !== undefined) backendData.telefone = cliente.telefone;
  if (cliente.email !== undefined) backendData.email = cliente.email;
  if (cliente.cep !== undefined) backendData.cep = cliente.cep;
  if (cliente.rua !== undefined) backendData.rua = cliente.rua;
  if (cliente.numero !== undefined) backendData.numero = cliente.numero;
  if (cliente.plano !== undefined) backendData.plano = cliente.plano;
  if (cliente.status !== undefined) backendData.status = cliente.status === 'Ativo' ? 1 : 0;
  if (cliente.vencimento !== undefined) backendData.vencimento = cliente.vencimento.replace('Todo dia ', '');
  return backendData;
};

// ===================================================================
// FUNÇÕES DE PLANOS
// ===================================================================
const mapBackendPlanoToFrontend = (backendPlano: any): Plano => {
  return {
    id: backendPlano.id_plano,
    nome: backendPlano.nomeplano || '',
    velocidade: backendPlano.velocidade || '',
    preco: parseFloat(backendPlano.valor) || 0,
    descricao: backendPlano.descricao || '',
    status: backendPlano.status === 1 || backendPlano.status === 'Ativo' ? 'Ativo' : 'Inativo',
    clientes: backendPlano.clientes_count || 0,
    features: backendPlano.descricao ? backendPlano.descricao.split(',').map((f: string) => f.trim()) : [],
  };
};
type DadosPlanoBackend = Omit<Plano, 'id' | 'clientes' | 'features'>;
const mapFrontendPlanoToBackend = (plano: DadosPlanoBackend) => {
  return {
    nomeplano: plano.nome,
    descricao: plano.descricao,
    velocidade: plano.velocidade,
    valor: plano.preco,
    status: plano.status === 'Ativo' ? 1 : 0,
  };
};
export const getPlanos = async (): Promise<Plano[]> => {
    try {
        const response = await apiClient.get('/Plans');
        return Array.isArray(response.data) ? response.data.map(mapBackendPlanoToFrontend) : [];
    } catch (error) {
        console.error("Erro ao buscar planos:", error);
        throw new Error("Não foi possível carregar os planos.");
    }
}
export const createPlano = async (dadosPlano: DadosPlanoBackend): Promise<Plano> => {
  try {
    const payload = mapFrontendPlanoToBackend(dadosPlano);
    const response = await apiClient.post('/Plans', payload);
    if (response.data.ctrl_result?.insertId) {
      const novoId = response.data.ctrl_result.insertId;
      return {
        ...dadosPlano,
        id: novoId,
        clientes: 0,
        features: dadosPlano.descricao ? dadosPlano.descricao.split(',').map(f => f.trim()) : [],
      };
    } else {
       console.warn("Backend não retornou insertId ao criar plano.");
       return {
            ...dadosPlano,
            id: Date.now(),
            clientes: 0,
            features: dadosPlano.descricao ? dadosPlano.descricao.split(',').map(f => f.trim()) : [],
       };
    }
  } catch (error) {
    console.error('Erro ao criar plano:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.Msg || "Falha ao criar o plano.");
    }
    throw new Error("Falha ao criar o plano.");
  }
};
export const updatePlano = async (id: number, dadosPlano: Plano): Promise<Plano> => {
  try {
     const payloadParaBackend: DadosPlanoBackend = {
        nome: dadosPlano.nome,
        velocidade: dadosPlano.velocidade,
        preco: dadosPlano.preco,
        descricao: dadosPlano.descricao,
        status: dadosPlano.status,
     }
    const payload = mapFrontendPlanoToBackend(payloadParaBackend);
    await apiClient.put(`/Plans/${id}`, payload);
    const featuresAtualizadas = dadosPlano.descricao ? dadosPlano.descricao.split(',').map(f => f.trim()) : [];
    return {...dadosPlano, features: featuresAtualizadas};
  } catch (error) {
    console.error(`Erro ao atualizar plano ${id}:`, error);
    throw new Error("Falha ao atualizar o plano.");
  }
};
export const deletePlano = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/Plans/${id}`);
  } catch (error) {
    console.error(`Erro ao inativar plano ${id}:`, error);
    throw new Error("Falha ao inativar o plano.");
  }
};

// ===================================================================
// FUNÇÕES DE EQUIPAMENTOS
// ===================================================================
const mapBackendEquipamentoToFrontend = (backendEquip: any): Equipamento => {
  return {
    id: backendEquip.id_equipamento || backendEquip.numero_serie,
    name: backendEquip.fabricante ? `${backendEquip.fabricante} ${backendEquip.modelo}` : backendEquip.modelo || '',
    type: backendEquip.tipo || '',
    model: backendEquip.modelo || '',
    serialNumber: backendEquip.numero_serie || '',
    status: backendEquip.status || 'Desconhecido',
    location: backendEquip.localizacao || '',
    customer: null,
    installDate: null,
    lastMaintenance: null,
    fabricante: backendEquip.fabricante || '',
    mac_adress: backendEquip.mac_adress || '',
    ip_gerenciado: backendEquip.ip_gerenciado || '',
    firmware: backendEquip.firmware || '',
  };
};
type EquipamentoPayloadBackend = {
    tipo?: string;
    modelo?: string;
    fabricante?: string;
    numero_serie?: string;
    mac_adress?: string;
    ip_gerenciado?: string;
    firmware?: string;
    status?: string;
    localizacao?: string;
};
const mapFrontendEquipamentoToBackend = (equip: Partial<Equipamento>): Partial<EquipamentoPayloadBackend> => {
    const backendData: Partial<EquipamentoPayloadBackend> = {};
    if (equip.type !== undefined) backendData.tipo = equip.type;
    if (equip.model !== undefined) backendData.modelo = equip.model;
    if (equip.serialNumber !== undefined) backendData.numero_serie = equip.serialNumber;
    if (equip.status !== undefined) backendData.status = equip.status;
    if (equip.location !== undefined) backendData.localizacao = equip.location;
    if (equip.fabricante !== undefined) backendData.fabricante = equip.fabricante;
    if (equip.mac_adress !== undefined) backendData.mac_adress = equip.mac_adress;
    if (equip.ip_gerenciado !== undefined) backendData.ip_gerenciado = equip.ip_gerenciado;
    if (equip.firmware !== undefined) backendData.firmware = equip.firmware;
    return backendData;
};
export const getEquipamentos = async (): Promise<Equipamento[]> => {
  try {
    const response = await apiClient.get('/Equip');
    const backendData = response.data.result || response.data;
    return Array.isArray(backendData) ? backendData.map(mapBackendEquipamentoToFrontend) : [];
  } catch (error) {
    console.error("Erro ao buscar equipamentos:", error);
    throw new Error("Não foi possível carregar os equipamentos.");
  }
};
export const getEquipamentoBySerial = async (serialNumber: string): Promise<Equipamento> => {
  try {
    const response = await apiClient.get(`/Equip/${serialNumber}`);
    if (response.data) {
      return mapBackendEquipamentoToFrontend(response.data);
    } else {
      throw new Error("Equipamento não encontrado.");
    }
  } catch (error) {
    console.error(`Erro ao buscar equipamento ${serialNumber}:`, error);
     if (axios.isAxiosError(error) && error.response?.status === 404) {
          throw new Error("Equipamento não encontrado.");
     }
    throw new Error("Falha ao carregar dados do equipamento.");
  }
};
export const createEquipamento = async (dadosEquip: any): Promise<Equipamento> => {
  try {
    const response = await apiClient.post('/Equip', dadosEquip);
     if (response.data.result?.affectedRows > 0 && dadosEquip.numero_serie) {
       try {
           await new Promise(resolve => setTimeout(resolve, 500));
           return await getEquipamentoBySerial(dadosEquip.numero_serie);
       } catch (getErr) {
           console.warn(`Equipamento S/N ${dadosEquip.numero_serie} criado, mas falha ao buscar em seguida:`, getErr);
           return mapBackendEquipamentoToFrontend({ ...dadosEquip, id_equipamento: Date.now() });
       }
    } else {
       throw new Error("Falha ao criar equipamento ou resposta inesperada do backend.");
    }
  } catch (error) {
    console.error('Erro ao criar equipamento:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.msg || "Falha ao criar o equipamento.");
    }
    throw new Error("Falha ao criar o equipamento.");
  }
};
export const updateEquipamento = async (serialNumber: string, dadosEquip: Partial<Equipamento>): Promise<Partial<Equipamento>> => {
  try {
    const payload = mapFrontendEquipamentoToBackend(dadosEquip);
    Object.keys(payload).forEach(key => (payload as any)[key] === undefined && delete (payload as any)[key]);
    await apiClient.put(`/Equip/${serialNumber}`, payload);
    return dadosEquip;
  } catch (error) {
    console.error(`Erro ao atualizar equipamento ${serialNumber}:`, error);
    throw new Error("Falha ao atualizar o equipamento.");
  }
};
export const deleteEquipamento = async (serialNumber: string): Promise<void> => {
  try {
    await apiClient.delete(`/Equip/${serialNumber}`);
  } catch (error) {
    console.error(`Erro ao excluir equipamento ${serialNumber}:`, error);
     if (axios.isAxiosError(error) && error.response?.status === 409) {
        throw new Error(error.response.data.msg || "Não é possível excluir: Equipamento está associado a outros registros.");
     }
    throw new Error("Falha ao excluir o equipamento.");
  }
};

// ===================================================================
// FUNÇÕES DE SUPORTE
// ===================================================================
const ROTA_SUPORTE = '/Support';
const mapBackendSuporteToFrontend = (backendTicket: any): TicketSuporte => {
    const formatarDataInput = (data: string | null) => {
        if (!data) return "";
        try {
            return new Date(data).toISOString().split('T')[0];
        } catch (e) {
            return "";
        }
    };
    const formatarDataExibicao = (data: string | null) => {
         if (!data) return "N/A";
         try {
            return new Date(data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
         } catch (e) {
             return "Data inválida";
         }
    };
    return {
        id: backendTicket.os_id,
        titulo: backendTicket.titulo || '',
        cliente: backendTicket.nome_completo || 'Cliente não encontrado',
        telefone: backendTicket.telefone || 'N/A',
        plano: backendTicket.plano || 'N/A',
        descricao: backendTicket.descricao_problema || '',
        status: backendTicket.status || 'Aberto', 
        prioridade: backendTicket.prioridade || 'Baixa',
        categoria: backendTicket.categoria || 'Não categorizado',
        criado: formatarDataExibicao(backendTicket.inicio_desejado),
        atualizado: formatarDataExibicao(backendTicket.conclusao_desejada), 
        inicio_desejado_input: formatarDataInput(backendTicket.inicio_desejado),
        id_tecnico: backendTicket.id_tecnico || null,
    };
};
export const getSuporteTickets = async (): Promise<TicketSuporte[]> => {
  try {
    const response = await apiClient.get(ROTA_SUPORTE);
    return Array.isArray(response.data) ? response.data.map(mapBackendSuporteToFrontend) : [];
  } catch (error) {
    console.error("Erro ao buscar tickets de suporte:", error);
    throw new Error("Não foi possível carregar os tickets de suporte.");
  }
};
export const getSuporteTicketById = async (id: number): Promise<TicketSuporte> => {
  try {
    const response = await apiClient.get(`${ROTA_SUPORTE}/${id}`);
    if (response.data) {
      return mapBackendSuporteToFrontend(response.data);
    } else {
      throw new Error("Ticket não encontrado.");
    }
  } catch (error) {
    console.error(`Erro ao buscar ticket ${id}:`, error);
    throw new Error("Falha ao carregar dados do ticket.");
  }
};
export const createSuporteTicket = async (payload: any): Promise<TicketSuporte> => {
  try {
    const response = await apiClient.post(ROTA_SUPORTE, payload);
    if (response.data.result?.insertId) {
      const novoId = response.data.result.insertId;
      return await getSuporteTicketById(novoId);
    } else {
       throw new Error("Falha ao obter ID do novo ticket.");
    }
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.Msg || "Falha ao criar o ticket.");
    }
    throw new Error("Falha ao criar o ticket.");
  }
};
export const updateSuporteTicket = async (id: number, payload: any): Promise<TicketSuporte> => {
  try {
    await apiClient.put(`${ROTA_SUPORTE}/${id}`, payload);
    return await getSuporteTicketById(id);
  } catch (error) {
    console.error(`Erro ao atualizar ticket ${id}:`, error);
     if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.Msg || "Falha ao atualizar o ticket.");
    }
    throw new Error("Falha ao atualizar o ticket.");
  }
};

// ===================================================================
// FUNÇÕES DE AUTENTICAÇÃO E USUÁRIOS
// ===================================================================
export const registerUser = async (dadosCadastro: any) => {
    try {
        const response = await apiClient.post('/auth/register', dadosCadastro);
        return response.data;
    } catch (error: any) {
        console.error('Erro ao registrar usuário:', error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.msg || "Falha ao registrar.");
        }
        throw new Error("Falha ao registrar.");
    }
};
export const loginUser = async (login: string, senha: string) => {
    try {
        const response = await apiClient.post('/auth/login', { login, senha });
        const { token, user } = response.data;
        if (token) {
            // <<< --- CORREÇÃO DE SEGURANÇA --- >>>
            // Troca localStorage por sessionStorage
            sessionStorage.setItem('authToken', token);
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            return response.data;
        } else {
            throw new Error("Token não recebido.");
        }
    } catch (error: any) {
        console.error('Erro ao fazer login:', error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.msg || "Falha no login.");
        }
        throw new Error("Falha no login.");
    }
};

// --- FUNÇÃO DE LOGOUT ATUALIZADA ---
export const logoutUser = () => {
    // Limpa sessionStorage
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('currentUser');
};

// --- FUNÇÃO NOVA ADICIONADA ---
// Pega os dados do usuário que foram salvos no login
export const getCurrentUser = (): Usuario | null => {
    const userString = sessionStorage.getItem('currentUser'); // <-- Usa sessionStorage
    if (!userString) return null;
    try {
        // Converte a string JSON de volta para um objeto
        return JSON.parse(userString);
    } catch (e) {
        console.error("Erro ao ler usuário do sessionStorage:", e);
        logoutUser(); // Limpa se estiver corrompido
        return null;
    }
};

// --- FUNÇÃO NOVA ADICIONADA ---
// Verifica se o token existe E se os dados do usuário existem
export const isUserLoggedIn = (): { auth: boolean, user: Usuario | null } => {
    const token = sessionStorage.getItem('authToken'); // <-- Usa sessionStorage
    const user = getCurrentUser();
    
    if (token && user) {
        // TODO: No futuro, você pode adicionar uma chamada de API
        // para "validar" o token com o backend, mas por agora isso funciona.
        return { auth: true, user: user };
    } else {
        logoutUser(); // Limpa qualquer lixo (ex: token sem usuário)
        return { auth: false, user: null };
    }
};

export const getUsuarios = async (): Promise<Usuario[]> => {
    try {
        const response = await apiClient.get('/auth/users');
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        throw new Error("Falha ao carregar lista de técnicos.");
    }
};
export const getAllUsersForAdmin = async (): Promise<Usuario[]> => {
  try {
    const response = await apiClient.get('/auth/admin/users');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Erro ao buscar usuários (Admin):", error);
    throw new Error("Não foi possível carregar os usuários.");
  }
};
export const getUserById = async (id: number): Promise<Usuario> => {
  try {
    const response = await apiClient.get(`/auth/users/${id}`);
    if (response.data) {
      return response.data;
    } else {
      throw new Error("Usuário não encontrado.");
    }
  } catch (error) {
    console.error(`Erro ao buscar usuário ${id}:`, error);
    throw new Error("Falha ao carregar dados do usuário.");
  }
};
export const updateUser = async (id: number, dadosUsuario: Partial<Usuario>): Promise<any> => {
  try {
    const payload = {
        nome_completo: dadosUsuario.nome_completo,
        matricula: dadosUsuario.matricula,
        login: dadosUsuario.login,
        perfil_id: dadosUsuario.perfil_id,
        status_usuario: dadosUsuario.status_usuario,
    };
    const response = await apiClient.put(`/auth/users/${id}`, payload);
    return response.data;
  } catch (error: any) {
    console.error(`Erro ao atualizar usuário ${id}:`, error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.msg || "Falha ao atualizar o usuário.");
    }
    throw new Error("Falha ao atualizar o usuário.");
  }
};
export const deleteUser = async (id: number): Promise<any> => {
  try {
    const response = await apiClient.delete(`/auth/users/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Erro ao inativar usuário ${id}:`, error);
    throw new Error("Falha ao inativar o usuário.");
  }
};

// <<< --- CORREÇÃO AQUI --- >>>
// Adiciona a função que estava faltando
export const getPerfisAcesso = async (): Promise<PerfilAcesso[]> => {
    try {
        const response = await apiClient.get('/perfis');
        // O controller GetAllPerfis retorna o array direto
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error('Erro ao buscar perfis:', error);
        throw new Error("Falha ao carregar lista de perfis.");
    }
};

// ===================================================================
// FUNÇÃO DO DASHBOARD
// ===================================================================
interface DashboardStats {
  clientes: Cliente[];
  planos: Plano[];
  tickets: TicketSuporte[];
}
export const getDashboardStats = async (): Promise<DashboardStats> => {
    try {
        const [clientes, planos, tickets] = await Promise.all([
            getClientes(),
            getPlanos(),
            getSuporteTickets()
        ]);
        return { clientes, planos, tickets };
    } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
        throw new Error("Não foi possível carregar os dados do dashboard.");
    }
};