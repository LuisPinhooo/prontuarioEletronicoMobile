# 📊 ARQUITETURA DO PROJETO

## 🏗️ Estrutura de Pastas

```
prontuarioEletronicoMobile/
│
├─ backend/
│  ├─ index.js (SERVIDOR EXPRESS)
│  ├─ package.json
│  │
│  ├─ controllers/
│  │  ├─ AuthController.js ← NOVO (Autenticação)
│  │  ├─ PacienteController.js
│  │  ├─ ExameController.js
│  │  ├─ RequisicaoController.js
│  │  └─ ResultadoController.js
│  │
│  ├─ middlewares/ ← NOVO
│  │  └─ auth.js (Validação JWT)
│  │
│  └─ routes/
│     ├─ auth.js ← NOVO (Login/Register)
│     ├─ pacientes.js
│     ├─ exames.js
│     ├─ requisicoes.js
│     └─ resultados.js
│
├─ frontend/
│  ├─ package.json
│  ├─ app.json
│  ├─ App.js
│  │
│  └─ src/
│     ├─ services/
│     │  └─ apiService.js (com JWT)
│     │
│     ├─ pages/
│     │  ├─ Login.js ← NOVO (Autenticação)
│     │  ├─ Home.js
│     │  ├─ Pacientes.js
│     │  ├─ CadastroPacientes.js
│     │  ├─ Exames.js
│     │  ├─ CadastroExames.js
│     │  ├─ Requisicoes.js
│     │  ├─ CadastroRequisicoes.js
│     │  ├─ Resultados.js
│     │  ├─ ListaResultados.js
│     │  └─ LancamentoResultados.js
│     │
│     └─ components/
│        ├─ Header/
│        ├─ Menu/
│        └─ Common/
│           ├─ FormField/
│           ├─ ItemList/
│           ├─ PageHeader/
│           ├─ SelectField/
│           └─ ActionButtons/
│
└─ documentos/
   ├─ README_FINAL.md
   ├─ BACKEND_FRONTEND_COMPLETO.md
   ├─ TESTES_RAPIDOS.md
   ├─ CRIACAO_TABELAS_BANCO.txt
   └─ ARQUITETURA.md (ESTE ARQUIVO)
```

---

## 🔐 Arquitetura de Autenticação (JWT)

```
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (React Native)                   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │               Login.js (Tela de Login)               │  │
│  │                                                       │  │
│  │  [Email: admin@local]                                │  │
│  │  [Senha: 123456]                                     │  │
│  │  [Botão Entrar]                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│         ↓                                                   │
│  apiService.login(email, password)                         │
│         ↓                                                   │
│  POST /auth/login                                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                    HTTP POST
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Express.js)                      │
│                   http://localhost:3000                     │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         AuthController.login()                       │  │
│  │                                                       │  │
│  │  1. Busca usuário pelo email                         │  │
│  │  2. Compara senha com hash (bcrypt)                  │  │
│  │  3. Gera token JWT (expira em 24h)                   │  │
│  │  4. Retorna: { token, user }                         │  │
│  └──────────────────────────────────────────────────────┘  │
│         ↓                                                   │
│  Response: { error: false, token: "eyJhbGc...", user }     │
└────────────────────────┬────────────────────────────────────┘
                         │
                    JSON Response
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (React Native)                   │
│                                                             │
│  AsyncStorage.setItem('authToken', token)                  │
│  navigation.replace('Home')                                │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │       Todas as próximas requisições                  │  │
│  │       incluem o token no header:                     │  │
│  │       Authorization: Bearer eyJhbGc...               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Dados Completo (Com Autenticação)

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React Native)                │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Login      │    │  Pacientes   │    │   Exames     │  │
│  │              │    │              │    │              │  │
│  │ Email        │    │ Lista        │    │ Lista        │  │
│  │ Senha        │    │ Novo +       │    │ Novo +       │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         ↓                   ↓                    ↓           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            apiService.js (HTTP Client)              │   │
│  │                                                      │   │
│  │  - login(email, password) [SEM TOKEN]               │   │
│  │  - getPacientes() [COM TOKEN]                       │   │
│  │  - createPaciente(data) [COM TOKEN]                 │   │
│  │  - updatePaciente(id, data) [COM TOKEN]             │   │
│  │  - deletePaciente(id) [COM TOKEN]                   │   │
│  │  - getExames() [COM TOKEN]                          │   │
│  │  - ... etc                                          │   │
│  │                                                      │   │
│  │  Adiciona automaticamente:                          │   │
│  │  Authorization: Bearer <token>                      │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                    HTTP (fetch)
                    Headers: Authorization
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Express.js)                      │
│                   http://localhost:3000                     │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                      index.js                         │  │
│  │                  (Express Server)                     │  │
│  │                                                       │  │
│  │  - CORS habilitado                                   │  │
│  │  - Body-parser JSON                                  │  │
│  │  - Middleware de autenticação aplicado               │  │
│  └──────────────────────────────────────────────────────┘  │
│         ↓                                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Middleware auth.js (Validação JWT)           │  │
│  │                                                       │  │
│  │  1. Pega token do header Authorization               │  │
│  │  2. Verifica formato: Bearer <token>                 │  │
│  │  3. jwt.verify(token, JWT_SECRET)                    │  │
│  │  4. Se válido: next() (continua)                     │  │
│  │  5. Se inválido: 401 Unauthorized                    │  │
│  └──────────────────────────────────────────────────────┘  │
│         ↓              ↓               ↓              ↓     │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐ │
│  │ /auth      │ │ /pacientes │ │ /exames    │ │ /req...  │ │
│  │ (público)  │ │ (protegido)│ │ (protegido)│ │(protegido│ │
│  │            │ │            │ │            │ │          │ │
│  │ login      │ │ get        │ │ get        │ │ get      │ │
│  │ register   │ │ create     │ │ create     │ │ create   │ │
│  │            │ │ update     │ │ update     │ │ update   │ │
│  │            │ │ delete     │ │ delete     │ │ delete   │ │
│  └────────────┘ └────────────┘ └────────────┘ └──────────┘ │
│         ↓              ↓               ↓              ↓     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          CONTROLLERS (Lógica de Negócio)            │   │
│  │                                                      │   │
│  │  - AuthController (login/register)                  │   │
│  │  - PacienteController                               │   │
│  │  - ExameController                                  │   │
│  │  - RequisicaoController                             │   │
│  │  - ResultadoController                              │   │
│  │                                                      │   │
│  │  Cada um com: listarTodos, buscarPorId, criar,      │   │
│  │              atualizar, deletar                     │   │
│  └─────────────────────────────────────────────────────┘   │
│         ↓              ↓               ↓              ↓     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         DADOS EM MEMÓRIA (Arrays JavaScript)         │   │
│  │                                                      │   │
│  │  let users = [                                      │   │
│  │    { id: 1, email: "admin@local", password: hash }  │   │
│  │  ];                                                 │   │
│  │                                                      │   │
│  │  let pacientes = [                                  │   │
│  │    { id: 1, nome: "João", cpf: "..." },             │   │
│  │    ...                                              │   │
│  │  ];                                                 │   │
│  │                                                      │   │
│  │  let exames = [...];                                │   │
│  │  let requisicoes = [...];                           │   │
│  │  let resultados = [...];                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  (SEM BANCO DE DADOS - Dados perdidos ao reiniciar)       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔗 Endpoints Disponíveis

### 🔓 Autenticação (Rotas Públicas - NÃO requerem token)
```
POST /auth/login
  Body: { email, password }
  Response: { error, token, user }
  Exemplo:
    Body: { "email": "admin@local", "password": "123456" }
    Response: { 
      "error": false,
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": { "id": 1, "name": "Admin", "email": "admin@local" }
    }

POST /auth/register
  Body: { name, email, password }
  Response: { error, message, user }
  Nota: Endpoint funcional, mas sem tela no frontend ainda
```

### 🔒 Pacientes (Rotas Protegidas - REQUEREM token)
```
GET /getpacientes
  Headers: Authorization: Bearer <token>
  Response: { error, data: [{...}], total }

GET /getpacientes/:id
  Headers: Authorization: Bearer <token>
  Response: { error, paciente: {...} }

POST /insertpaciente
  Headers: Authorization: Bearer <token>
  Body: { pnome, pcpf, pemail, ... }
  Response: { error, message, paciente }

PUT /updatepaciente/:id
  Headers: Authorization: Bearer <token>
  Body: { pnome, pcpf, ... }
  Response: { error, message, paciente }

DELETE /deletepaciente/:id
  Headers: Authorization: Bearer <token>
  Response: { error, message }
```

### 🔒 Exames (Rotas Protegidas)
```
GET /getexames
GET /getexames/:id
POST /insertexame
PUT /updateexame/:id
DELETE /deleteexame/:id

Todas requerem: Headers: Authorization: Bearer <token>
```

### 🔒 Requisições (Rotas Protegidas)
```
GET /getrequisicoes
GET /getrequisicoes/:id
GET /getrequisicoes/paciente/:pacienteId
POST /insertrequisicao
PUT /updaterequisicao/:id
DELETE /deleterequisicao/:id

Todas requerem: Headers: Authorization: Bearer <token>
```

### 🔒 Resultados (Rotas Protegidas)
```
GET /getresultados
GET /getresultados/:id
GET /getresultados/requisicao/:requisicaoId
POST /insertresultado
PUT /updateresultado/:id
DELETE /deleteresultado/:id

Todas requerem: Headers: Authorization: Bearer <token>
```

---

## 🎯 Tela Principal vs Dados Backend

```
┌─────────────────────────────────────────────────────────┐
│                   FRONTEND TELAS                        │
│                                                         │
│  Login.js ─────────────────→ POST /auth/login          │
│                             → Salva token no AsyncStorage│
│                                                         │
│  Pacientes.js ─────────────→ GET /getpacientes         │
│                             → setPacientes(result.data) │
│                                                         │
│  CadastroPacientes.js ─────→ POST /insertpaciente      │
│                             → PUT /updatepaciente/:id   │
│                                                         │
│  Exames.js ────────────────→ GET /getexames            │
│                             → DELETE /deleteexame/:id   │
│                                                         │
│  Requisicoes.js ───────────→ GET /getrequisicoes       │
│                             → POST /insertrequisicao    │
│                                                         │
│  ListaResultados.js ───────→ GET /getresultados        │
│                             → DELETE /deleteresultado   │
│                                                         │
│  LancamentoResultados.js ──→ POST /insertresultado     │
│                             → PUT /updateresultado/:id  │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Ciclo de Vida Completo - Exemplo: Login + Criar Paciente

```
1. App inicia
   └─ Verifica AsyncStorage por token
   └─ Se não tem token → Login.js
   └─ Se tem token → Home.js

2. User digita credenciais no Login.js
   └─ handleLogin()
   └─ apiService.login("admin@local", "123456")

3. POST /auth/login (SEM TOKEN)
   └─ AuthController.login()
   └─ Busca usuário "admin@local"
   └─ bcrypt.compare(password, hashedPassword)
   └─ jwt.sign({ id, email, name }, SECRET, { expiresIn: '24h' })
   └─ Retorna { token: "eyJhb...", user: {...} }

4. Frontend recebe token
   └─ AsyncStorage.setItem('authToken', token)
   └─ navigation.replace('Home')

5. User está na Home, clica em "Pacientes"
   └─ navigation.navigate("Pacientes")

6. Pacientes.js carrega
   └─ useFocusEffect → carregarPacientes()
   └─ apiService.getPacientes()

7. apiService pega token do AsyncStorage
   └─ AsyncStorage.getItem('authToken')
   └─ Adiciona header: Authorization: Bearer eyJhb...
   └─ GET /getpacientes (COM TOKEN)

8. Backend recebe requisição
   └─ Middleware auth.js intercepta
   └─ Extrai token do header
   └─ jwt.verify(token, SECRET)
   └─ Token válido → next() (libera)
   └─ Token inválido → 401 Unauthorized

9. PacienteController.listarTodos()
   └─ Retorna array de pacientes
   └─ Response: { error: false, data: [...], total: 10 }

10. Frontend atualiza UI
   └─ setPacientes(result.data)
   └─ ItemList re-renderiza

11. User clica em "Novo Paciente"
   └─ navigation.navigate("CadastroPacientes")
   └─ Preenche formulário
   └─ Clica em "Salvar"

12. POST /insertpaciente (COM TOKEN)
   └─ Middleware valida token
   └─ PacienteController.criar()
   └─ Valida CPF único
   └─ Cria novo objeto
   └─ pacientes.push(novoPaciente)

13. Response: { error: false, message: "Sucesso", paciente }
   └─ Alert("Paciente cadastrado!")
   └─ navigation.goBack() → Volta para Pacientes.js

14. useFocusEffect dispara novamente
   └─ GET /getpacientes (COM TOKEN)
   └─ Lista atualiza com novo paciente
```

---

## 📦 Dependências Instaladas

### Backend (`/backend/package.json`)
```json
{
  "dependencies": {
    "body-parser": "^1.20.3",
    "cors": "^2.8.5",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "nodemon": "^3.1.11"
  }
}
```

### Frontend (`/frontend/package.json`)
```json
{
  "dependencies": {
    "react": "...",
    "react-native": "...",
    "expo": "...",
    "@react-navigation/native": "...",
    "@react-navigation/native-stack": "...",
    "@react-native-async-storage/async-storage": "^1.19.0"
  }
}
```

---

## ⚙️ Configurações Importantes

### Backend - index.js
```javascript
const PORT = process.env.PORT || 3000; // ← PORTA 3000
const JWT_SECRET = 'meu-segredo-super-seguro-para-prontuario';

app.use(cors());
app.use(bodyParser.json());

// Rotas públicas (não precisam de token)
app.use('/auth', authRoutes);

// Rotas protegidas (precisam de token)
app.use(authMiddleware, pacientesRoutes);
app.use(authMiddleware, examesRoutes);
app.use(authMiddleware, requisicoeRoutes);
app.use(authMiddleware, resultadosRoutes);
```

### Middleware - auth.js
```javascript
const JWT_SECRET = 'meu-segredo-super-seguro-para-prontuario'; // ← MESMO SEGREDO

jwt.verify(token, JWT_SECRET, (err, decoded) => {
  if (err) return res.status(401).json({ error: true, message: 'Token inválido' });
  req.user = decoded;
  next();
});
```

### Frontend - apiService.js
```javascript
const API_URL = 'http://localhost:3000'; // ← PORTA 3000

// Adiciona token automaticamente (exceto /auth)
if (!endpoint.startsWith('/auth')) {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }
}

// Configurações por plataforma:
// Emulator Android: 'http://10.0.2.2:3000'
// iOS Simulator: 'http://localhost:3000'
// Device Físico: 'http://<SEU_IP>:3000'
```

---

## 🎬 Resumo Visual de Execução

```
┌──────────────────────────┐      ┌──────────────────────────┐
│   Terminal 1: Backend    │      │   Terminal 2: Frontend   │
│                          │      │                          │
│  $ npm run dev           │      │  $ npm start             │
│                          │      │                          │
│  ✅ API on port 3000     │      │  ✅ Expo running         │
│  🔐 Auth: /auth          │      │                          │
│  📋 Master: admin@local  │      │  App carrega Login.js    │
│                          │      │                          │
│  Listening for requests  │      │  User faz login          │
│  (awaits fetch calls     │      │  Token salvo             │
│   with JWT validation)   │      │  Home.js carrega         │
└──────────────────────────┘      └──────────────────────────┘
           │                                    │
           │        POST /auth/login            │
           │←────────────────────────────────────│
           │                                    │
           │  Response: { token, user }        │
           │────────────────────────────────────→│
           │                                    │
           │    GET /getpacientes               │
           │    Header: Bearer <token>          │
           │←────────────────────────────────────│
           │                                    │
           │  Middleware valida token           │
           │  Response: { data: [...] }        │
           │────────────────────────────────────→│
           │                                    │
        Updates                             Updates
        console.log                         UI state
```

---

## 🔐 Segurança Implementada

### JWT (JSON Web Token)
```
Token gerado no login:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBsb2NhbCIsIm5hbWUiOiJBZG1pbiIsImlhdCI6MTYzMTYxMjAwMCwiZXhwIjoxNjMxNjk4NDAwfQ.MIuk7TsILX9DB397mSjnM8GkycDiPGPtmrbIOwww4wA

Header: { "alg": "HS256", "typ": "JWT" }
Payload: { "id": 1, "email": "admin@local", "name": "Admin", "iat": ..., "exp": ... }
Signature: HMACSHA256(base64(header) + "." + base64(payload), JWT_SECRET)
```

### Senhas (bcrypt)
```
Senha em texto: "123456"
Hash armazenado: "$2a$10$X7qZ9YvZ9YvZ9YvZ9YvZ9e..."

bcrypt.compare("123456", hash) → true ou false
```

### Middleware de Proteção
```
Requisição → Middleware auth.js → Controller
          ↓
    Se token válido: next()
    Se token inválido: 401
    Se sem token: 401
```

---

## ✨ Funcionalidades Implementadas

### Autenticação
- ✅ Login com JWT
- ✅ Registro de novos usuários (backend pronto, sem tela)
- ✅ Middleware de validação de token
- ✅ Token salvo no AsyncStorage
- ✅ Token adicionado automaticamente nas requisições
- ✅ Tratamento de sessão expirada (24h)
- ✅ Usuário master para testes (admin@local / 123456)

### CRUD Completo
- ✅ Pacientes (Create, Read, Update, Delete)
- ✅ Exames (Create, Read, Update, Delete)
- ✅ Requisições (Create, Read, Update, Delete)
- ✅ Resultados (Create, Read, Update, Delete)

### Interface
- ✅ Tela de Login
- ✅ Busca por ID em Requisições e Resultados
- ✅ Seleção de paciente e exames em Requisições
- ✅ Carregamento automático de dados da requisição em Resultados
- ✅ Proteção de rotas (sem token = sem acesso)

---

## 📝 Notas Importantes

1. **Dados em Memória**: Todos os dados são armazenados em arrays JavaScript. Ao reiniciar o servidor, os dados são perdidos. **Próximo passo: Implementar SQLite**

2. **Usuário Master**: 
   - Email: `admin@local`
   - Senha: `123456`
   - Existe apenas para testes. Em produção, usar banco de dados

3. **JWT_SECRET**: 
   - Atual: `meu-segredo-super-seguro-para-prontuario`
   - Em produção, usar variável de ambiente `.env`
   - Deve ser o MESMO em AuthController e auth.js

4. **Token expira em 24h**: Após esse período, usuário precisa fazer login novamente

5. **Porta 3000**: Backend roda na porta 3000 (não 3001)

6. **Registro sem tela**: Endpoint `/auth/register` existe no backend mas não tem tela no frontend ainda. Criar usuários via Postman

7. **AsyncStorage**: Token é salvo localmente no dispositivo e persiste entre sessões

---

## 🔧 Próximas Melhorias

- [ ] Implementar banco de dados SQLite
- [ ] Adicionar funcionalidade de Logout (limpar AsyncStorage)
- [ ] Tratamento de sessão expirada com redirecionamento automático
- [ ] Criar tela de cadastro de usuários no frontend
- [ ] Adicionar refresh token (renovar token sem novo login)
- [ ] Validação mais robusta de dados (regex, etc)
- [ ] Testes automatizados (Jest, Supertest)
- [ ] Variáveis de ambiente (.env) para JWT_SECRET
- [ ] Logs estruturados (Winston, Morgan)
- [ ] Rate limiting (proteção contra brute force)

---

## ✨ Conclusão

Você tem agora:
- ✅ Backend com 5 módulos de negócio (Auth + 4 CRUDs)
- ✅ Frontend com 10 páginas funcionais (Login + 9 telas)
- ✅ API RESTful completa com autenticação JWT
- ✅ Middleware de segurança validando tokens
- ✅ Comunicação frontend-backend totalmente protegida
- ✅ Padrão consistente em todo projeto
- ✅ Pronto para adicionar banco de dados SQLite
- ✅ Pronto para adicionar novas features

**Sistema de autenticação funcionando 100%! 🔐🚀**

**Bom desenvolvimento! 🎉**