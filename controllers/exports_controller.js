const xl = require('excel4node');
const pool = require('../config/db');
const wb = new xl.Workbook();
const ws = wb.addWorksheet('Clientes');

const ExportClients = async (req, res) => {
  try {
    const [Clients] = await pool.query(
      `SELECT id_cliente, cpf, nome_completo, data_nascimento, rg, telefone, email, cep, 
      rua, numero, nome_rede, senha_rede, plano, vencimento 
       FROM clientes`
    );

    // cabecalho da tabela
    const headingColumnNames = [
      "id_cliente", "cpf", "nome_completo", "data_nascimento", "rg", "telefone",
      "email", "cep", "rua", "numero", "nome_rede", "senha_rede", "plano", "vencimento"
    ];

    // colocando o cabecalho
    let headingColumnIndex = 1;
    headingColumnNames.forEach(heading => {
      ws.cell(1, headingColumnIndex++).string(heading);
    });

    // colocando os dados
    let rowIndex = 2;
    Clients.forEach(record => {
      let columnIndex = 1;
      Object.values(record).forEach(value => {
        ws.cell(rowIndex, columnIndex++)
          .string(value ? value.toString() : "");
      });
      rowIndex++;
    });

    // forcando para fazer o download do arquivo
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Clients.xlsx"
    );

    wb.write('Clients.xlsx', res);

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao gerar planilha.");
  }
};

module.exports = { ExportClients };
