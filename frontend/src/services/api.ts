import axios from 'axios';
// Adiciona Equipamento aos tipos importados
import type { Cliente, Plano, Equipamento } from '../types';

// Configura a URL base do seu backend.
const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
});

// ===================================================================
// FUNÇÕES DE CLIENTE
// ===================================================================
const mapBackendClienteToFrontend = (backendCliente: any): Cliente => {
  // Adiciona checagens para evitar erros se campos forem nulos/undefined
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
    // Adiciona checagem para garantir que response.data é um array
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
    if (response.data.result?.insertId) { // Adiciona checagem opcional (?)
      const novoId = response.data.result.insertId;
      return await getClienteById(novoId);
    } else {
       console.warn("Backend não retornou insertId ao criar cliente.");
       return mapBackendClienteToFrontend({...dadosNovoCliente, id_cliente: Date.now()}); // ID temporário
    }
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.mensagem || "Falha ao criar o cliente.");
    }
    throw new Error("Falha ao criar o cliente.");
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


// ===================================================================
// FUNÇÕES DE PLANOS
// ===================================================================
const mapBackendPlanoToFrontend = (backendPlano: any): Plano => {
  // <<< --- CORREÇÃO AQUI --- >>>
  // O código que estava quebrado foi removido
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
    // Campos extras (não fazem parte da interface padrão Equipamento, mas podem ser úteis)
    // mac_adress: backendEquip.mac_adress || '', // <<< CORRIGIDO NOME (não está na interface)
    // ip_gerenciado: backendEquip.ip_gerenciado || '',
    // firmware: backendEquip.firmware || '',
    // fabricante: backendEquip.fabricante || '',
  };
};

type DadosEquipamentoBackend = { // Simplificado para o que o backend realmente usa
    tipo: string;
    modelo: string;
    fabricante?: string; // Fabricante pode não ser obrigatório?
    numero_serie: string;
    mac_adress?: string;
    ip_gerenciado?: string;
    firmware?: string;
    status: string;
    localizacao: string;
};

const mapFrontendEquipamentoToBackend = (equip: Partial<Equipamento>): Partial<DadosEquipamentoBackend> => {
    const backendData: Partial<DadosEquipamentoBackend> = {};
    if (equip.type !== undefined) backendData.tipo = equip.type;
    if (equip.model !== undefined) backendData.modelo = equip.model;
    if (equip.serialNumber !== undefined) backendData.numero_serie = equip.serialNumber;
    if (equip.status !== undefined) backendData.status = equip.status;
    if (equip.location !== undefined) backendData.localizacao = equip.location;
    // Assume que esses podem vir do formulário (precisam ser adicionados lá)
    if ((equip as any).fabricante !== undefined) backendData.fabricante = (equip as any).fabricante;
    if ((equip as any).mac_adress !== undefined) backendData.mac_adress = (equip as any).mac_adress;
    if ((equip as any).ip_gerenciado !== undefined) backendData.ip_gerenciado = (equip as any).ip_gerenciado;
    if ((equip as any).firmware !== undefined) backendData.firmware = (equip as any).firmware;
    return backendData;
};

// <<< --- CORREÇÃO AQUI --- >>>
// Exporta as funções corretamente
export const getEquipamentos = async (): Promise<Equipamento[]> => {
  try {
    const response = await apiClient.get('/Equip'); // <<< CONFIRME A ROTA NO app.js

    // --- CORREÇÃO AQUI ---
    // Verifica se a resposta tem a chave 'result' (formato antigo)
    // ou se é diretamente o array (formato novo/corrigido).
    const backendData = response.data.result || response.data;

    // Garante que estamos mapeando um array
    return Array.isArray(backendData) ? backendData.map(mapBackendEquipamentoToFrontend) : [];
  } catch (error) {
    console.error("Erro ao buscar equipamentos:", error);
    throw new Error("Não foi possível carregar os equipamentos.");
  }
};

export const createEquipamento = async (dadosEquip: any): Promise<Equipamento> => {
  try {
    // 1. Envia os dados para criar (formato do backend)
    const response = await apiClient.post('/Equip', dadosEquip); // <<< CONFIRME A ROTA

    // 2. Verifica se o backend retornou sucesso e o serial number foi enviado
    //    Seu backend retorna { msg: '...', result: OkPacket }
    //    O OkPacket tem affectedRows, mas pode não ter insertId se a PK não for auto_increment
    const insertOk = response.data.result?.affectedRows > 0;
    const serialNumberEnviado = dadosEquip.numero_serie;

    if (insertOk && serialNumberEnviado) {
       // 3. Tenta buscar o equipamento recém-criado pelo S/N
       try {
           // Pequeno delay para dar tempo ao BD
           await new Promise(resolve => setTimeout(resolve, 500)); // Aumenta o delay
           return await getEquipamentoBySerial(serialNumberEnviado);
       } catch (getErr) {
           // Se a busca falhar, assume que foi criado e retorna os dados enviados formatados
           console.warn(`Equipamento S/N ${serialNumberEnviado} criado, mas falha ao buscar em seguida:`, getErr);
           // Usa o mapeador para formatar os dados que foram enviados
           return mapBackendEquipamentoToFrontend({ ...dadosEquip, id_equipamento: Date.now() }); // Usa ID temporário
       }
    } else {
       // Se o backend não confirmou a inserção ou não tínhamos S/N
       throw new Error("Falha ao criar equipamento ou resposta inesperada do backend.");
    }
  } catch (error) {
    console.error('Erro ao criar equipamento:', error);
    if (axios.isAxiosError(error) && error.response) {
      // Tenta pegar a mensagem de erro específica do backend (ex: Duplicado)
      throw new Error(error.response.data.msg || "Falha ao criar o equipamento.");
    }
    // Se não for erro Axios ou não tiver msg, lança erro genérico
    throw new Error("Falha ao criar o equipamento.");
  }
};

export const getEquipamentoBySerial = async (serialNumber: string): Promise<Equipamento> => {
  try {
    const response = await apiClient.get(`/Equip/${serialNumber}`);
    if (response.data.result) {
      return mapBackendEquipamentoToFrontend(response.data.result);
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
     if (axios.isAxiosError(error) && error.response?.data?.error?.includes('foreign key constraint')) {
        throw new Error("Não é possível excluir: Equipamento está associado a outros registros.");
     }
    throw new Error("Falha ao excluir o equipamento.");
  }
};
// <<< --- FIM DAS CORREÇÕES --- >>>