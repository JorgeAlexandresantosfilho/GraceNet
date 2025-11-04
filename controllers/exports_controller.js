const xl = require('excel4node');
const pool = require('../config/db');

const ExportClients = async (req, res) => {
  const wb = new xl.Workbook();
  const ws = wb.addWorksheet('Clientes');

  try {
    const [clients] = await pool.query(
      `SELECT id_cliente, cpf, nome_completo, data_nascimento, rg, telefone, email, cep, 
       rua, numero, nome_rede, senha_rede, plano, vencimento, status 
       FROM clientes`
    );

  
    const headingColumnNames = [
      "id_cliente", "cpf", "nome_completo", "data_nascimento", "rg", "telefone",
      "email", "cep", "rua", "numero", "nome_rede", "senha_rede", "plano", "vencimento",
      "status"
    ];

    let headingColumnIndex = 1;
    headingColumnNames.forEach(heading => {
      ws.cell(1, headingColumnIndex++).string(heading);
    });

    let rowIndex = 2;
    clients.forEach(record => {
      let columnIndex = 1;
      Object.values(record).forEach(value => {
        const cellValue = value !== null && value !== undefined ? String(value) : '';
        ws.cell(rowIndex, columnIndex++).string(cellValue);
      });
      rowIndex++;
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader("Content-Disposition", "attachment; filename=Relatorio_Clientes.xlsx");
    wb.write('Relatorio_Clientes.xlsx', res);

  } catch (err) {
    console.error("Erro ao gerar relatório de clientes:", err);
    res.status(500).send("Erro ao gerar planilha.");
  }
};


const ExportFinancials = async (req, res) => {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Financeiro_Potencial');
    try {
        const [receita] = await pool.query(
            `SELECT 
                c.plano, 
                p.valor, 
                COUNT(c.id_cliente) as total_clientes_ativos, 
                (p.valor * COUNT(c.id_cliente)) as receita_mensal_potencial 
             FROM clientes c
             JOIN planos p ON c.plano = p.nomeplano
             WHERE c.status = 1 
             GROUP BY c.plano, p.valor 
             ORDER BY receita_mensal_potencial DESC`
        );
        const headingColumnNames = ["Plano", "Valor Unitário", "Nº Clientes Ativos", "Receita Mensal Potencial"];
        
        let headingColumnIndex = 1;
        headingColumnNames.forEach(heading => {
            ws.cell(1, headingColumnIndex++).string(heading);
        });
        let rowIndex = 2;
        receita.forEach(record => {
            let columnIndex = 1;
            Object.values(record).forEach(value => {
                const cellValue = value !== null && value !== undefined ? String(value) : '';
                ws.cell(rowIndex, columnIndex++).string(cellValue);
            });
            rowIndex++;
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader("Content-Disposition", "attachment; filename=Relatorio_Financeiro_Potencial.xlsx");
        wb.write('Relatorio_Financeiro_Potencial.xlsx', res);
    } catch (err) {
        console.error("Erro ao gerar relatório financeiro:", err);
        res.status(500).send("Erro ao gerar planilha. Verifique se 'clientes.plano' e 'planos.nomeplano' coincidem.");
    }
};


const ExportNetworkPerformance = async (req, res) => {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Performance_Rede');
    try {
        const [categorias] = await pool.query(
            `SELECT titulo, COUNT(*) as total_chamados 
             FROM suportes 
             GROUP BY titulo 
             ORDER BY total_chamados DESC`
        );
        const headingColumnNames = ["Título do Chamado", "Total de Ocorrências"];
        
        let headingColumnIndex = 1;
        headingColumnNames.forEach(heading => {
            ws.cell(1, headingColumnIndex++).string(heading);
        });
        let rowIndex = 2;
        categorias.forEach(record => {
            let columnIndex = 1;
            Object.values(record).forEach(value => {
                const cellValue = value !== null && value !== undefined ? String(value) : '';
                ws.cell(rowIndex, columnIndex++).string(cellValue);
            });
            rowIndex++;
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader("Content-Disposition", "attachment; filename=Relatorio_Performance_Rede.xlsx");
        wb.write('Relatorio_Performance_Rede.xlsx', res);
    } catch (err) {
        console.error("Erro ao gerar relatório de performance:", err);
        res.status(500).send("Erro ao gerar planilha.");
    }
};


const ExportBusinessGrowth = async (req, res) => {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Crescimento');

    try {
        
        const [crescimento] = await pool.query(
            `SELECT DATE_FORMAT(data_nascimento, '%Y-%m') as mes_nascimento, COUNT(id_cliente) as total_clientes 
             FROM clientes 
             WHERE data_nascimento IS NOT NULL 
             GROUP BY mes_nascimento 
             ORDER BY mes_nascimento ASC`
        );

      
        const headingColumnNames = ["Mês (Nascimento)", "Total Clientes"];
        
        let headingColumnIndex = 1;
        headingColumnNames.forEach(heading => {
            ws.cell(1, headingColumnIndex++).string(heading);
        });
        let rowIndex = 2;
        crescimento.forEach(record => {
            let columnIndex = 1;
            Object.values(record).forEach(value => {
                const cellValue = value !== null && value !== undefined ? String(value) : '';
                ws.cell(rowIndex, columnIndex++).string(cellValue);
            });
            rowIndex++;
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader("Content-Disposition", "attachment; filename=Relatorio_Crescimento_Por_Nascimento.xlsx");
        wb.write('Relatorio_Crescimento_Por_Nascimento.xlsx', res);

    } catch (err) {
        console.error("Erro ao gerar relatório de crescimento:", err);
        res.status(500).send("Erro ao gerar planilha.");
    }
};

module.exports = { 
    ExportClients,
    ExportFinancials,
    ExportNetworkPerformance,
    ExportBusinessGrowth
};