// Importar biblioteca de conexão com banco de dados PostgreSQL
const { Pool } = require('pg');

// Criar pool de conexões com as credenciais do PostgreSQL
const pool = new Pool({
  host: '127.0.0.1', // IP do servidor PostgreSQL
  port: 50000, // Porta do PostgreSQL
  user: 'postgres', // Usuário do banco
  password: '9090', // Senha do banco
  database: 'prontuario_eletronico', // Nome do banco de dados
  max: 10, // Máximo de conexões simultâneas
  idleTimeoutMillis: 30000, // Timeout para conexão ociosa
  connectionTimeoutMillis: 2000, // Timeout para criar conexão
});

// Testar a conexão com o banco de dados
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Erro ao conectar ao PostgreSQL:', err.stack);
  } else {
    console.log('✅ Conectado ao PostgreSQL na porta 50000');
    release();
  }
});

module.exports = pool;