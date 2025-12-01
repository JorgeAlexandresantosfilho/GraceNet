const db = require('../config/db');

async function getDashboardStats(req, res) {
    try {
        // 1. Total de Clientes Ativos
        const [activeClientsResult] = await db.query(
            "SELECT COUNT(*) as total FROM clientes WHERE status = 'Ativo' OR status = 1"
        );
        const activeClients = activeClientsResult[0].total;

        // 2. Novos Clientes (Mês Atual)
        // Como não temos data_cadastro, vamos retornar 0 ou um valor mockado por enquanto.
        // Se houvesse data_cadastro: "SELECT COUNT(*) as total FROM clientes WHERE MONTH(data_cadastro) = MONTH(CURRENT_DATE()) AND YEAR(data_cadastro) = YEAR(CURRENT_DATE())"
        const newClients = 0;

        // 3. Chamados Abertos
        const [openTicketsResult] = await db.query(
            "SELECT COUNT(*) as total FROM suportes WHERE status = 'Aberto'"
        );
        const openTickets = openTicketsResult[0].total;

        // 4. Plano Mais Vendido (Top Plan)
        const [topPlanResult] = await db.query(`
            SELECT plano, COUNT(*) as total 
            FROM clientes 
            WHERE plano IS NOT NULL AND plano != '' 
            GROUP BY plano 
            ORDER BY total DESC 
            LIMIT 1
        `);
        const topPlan = topPlanResult.length > 0 ? topPlanResult[0].plano : 'N/A';

        // 5. Distribuição de Planos (para o gráfico de Pizza)
        const [planDistributionResult] = await db.query(`
            SELECT plano as name, COUNT(*) as value 
            FROM clientes 
            WHERE plano IS NOT NULL AND plano != '' 
            GROUP BY plano
        `);

        // 6. Clientes Recentes (para a tabela) - Baseado no ID (assumindo auto-increment)
        const [recentClientsResult] = await db.query(`
            SELECT id_cliente as id, nome_completo as nomeCompleto, email, plano, status, vencimento 
            FROM clientes 
            ORDER BY id_cliente DESC 
            LIMIT 5
        `);

        // Formatar status para o frontend
        const recentClients = recentClientsResult.map(c => ({
            ...c,
            status: (c.status === 1 || c.status === 'Ativo') ? 'Ativo' : 'Inativo'
        }));

        // 7. Crescimento da Base (Gráfico de Área)
        // Mockado por enquanto devido à falta de histórico
        const growthData = [
            { mes: "Jan", clientes: activeClients - 50 },
            { mes: "Fev", clientes: activeClients - 40 },
            { mes: "Mar", clientes: activeClients - 30 },
            { mes: "Abr", clientes: activeClients - 20 },
            { mes: "Mai", clientes: activeClients - 10 },
            { mes: "Jun", clientes: activeClients }
        ];

        res.status(200).json({
            novosClientes: newClients,
            clientesAtivos: activeClients,
            chamadosAbertos: openTickets,
            planoMaisVendido: topPlan,
            distribuicaoPlanos: planDistributionResult,
            clientesRecentes: recentClients,
            crescimentoBase: growthData
        });

    } catch (error) {
        console.error("Erro ao buscar estatísticas do dashboard:", error);
        res.status(500).json({ msg: "Erro ao carregar dashboard", error: error.message });
    }
}

module.exports = {
    getDashboardStats
};
