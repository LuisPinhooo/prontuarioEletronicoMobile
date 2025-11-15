const { Pool } = require('pg');

const pool = new Pool({
  host: '127.0.0.1',
  port: 50000,
  user: 'postgres',
  password: '9090', // ← COLOCAR SUA SENHA DO POSTGRES
  database: 'prontuario_eletronico',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Testar conexão
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Erro ao conectar ao PostgreSQL:', err.stack);
  } else {
    console.log('✅ Conectado ao PostgreSQL na porta 50000');
    release();
  }
});

module.exports = pool;