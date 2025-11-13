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
│  │  ├─ PacienteController.js
│  │  ├─ ExameController.js
│  │  ├─ RequisicaoController.js
│  │  └─ ResultadoController.js
│  │
│  └─ routes/
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
│     │  └─ apiService.js
│     │
│     ├─ pages/
│     │  ├─ Login.js
│     │  ├─ Pacientes.js
│     │  ├─ CadastroPacientes.js
│     │  ├─ Exames.js
│     │  ├─ CadastroExames.js
│     │  ├─ Requisicoes.js
│     │  ├─ CadastroRequisicoes.js
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
   ├─ README_FINAL.md (COMECE AQUI)
   ├─ BACKEND_FRONTEND_COMPLETO.md
   ├─ TESTES_RAPIDOS.md
   ├─ TROUBLESHOOTING.md
   └─ ARQUITETURA.md (ESTE ARQUIVO)
```

---

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React Native)                │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Login      │    │  Pacientes   │    │   Exames     │  │
│  │              │    │              │    │              │  │
│  │ E-mail       │    │ Lista        │    │ Lista        │  │
│  │ Senha        │    │ Novo +       │    │ Novo +       │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         ↓                   ↓                    ↓           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            apiService.js (HTTP Client)              │   │
│  │                                                      │   │
│  │  - login(email, password)                           │   │
│  │  - getPacientes()                                   │   │
│  │  - createPaciente(data)                             │   │
│  │  - updatePaciente(id, data)                         │   │
│  │  - deletePaciente(id)                               │   │
│  │  - getExames()                                      │   │
│  │  - ... etc                                          │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                    HTTP (fetch)
                    POST/GET/PUT/DELETE
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Express.js)                      │
│                   http://localhost:3001                     │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                      index.js                         │  │
│  │                  (Express Server)                     │  │
│  │                                                       │  │
│  │  - CORS habilitado                                   │  │
│  │  - Morgan logging                                    │  │
│  │  - Body-parser JSON                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│         ↓              ↓               ↓              ↓     │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐ │
│  │ /auth      │ │ /pacientes │ │ /exames    │ │ /req...  │ │
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

### Autenticação
```
POST /auth/login
  Body: { email, password }
  Response: { error, token, user }

POST /auth/register
  Body: { name, email, password }
  Response: { error, message, user }
```

### Pacientes
```
GET /getpacientes
  Response: { error, data: [{...}], total }

GET /getpacientes/:id
  Response: { error, paciente: {...} }

POST /insertpaciente
  Body: { pnome, pcpf, pemail, ... }
  Response: { error, message, paciente }

PUT /updatepaciente/:id
  Body: { pnome, pcpf, ... }
  Response: { error, message, paciente }

DELETE /deletepaciente/:id
  Response: { error, message }
```

### Exames
```
GET /getexames
GET /getexames/:id
POST /insertexame
PUT /updateexame/:id
DELETE /deleteexame/:id
```

### Requisições
```
GET /getrequisicoes
GET /getrequisicoes/:id
GET /getrequisicoes/paciente/:pacienteId
POST /insertrequisicao
PUT /updaterequisicao/:id
DELETE /deleterequisicao/:id
```

### Resultados
```
GET /getresultados
GET /getresultados/:id
GET /getresultados/exame/:exameId
POST /insertresultado
PUT /updateresultado/:id
DELETE /deleteresultado/:id
```

---

## 🎯 Tela Principal vs Dados Backend

```
┌─────────────────────────────────────────────────────────┐
│                   FRONTEND TELAS                        │
│                                                         │
│  Pacientes.js ─────────────→ GET /getpacientes        │
│                             → setExame(result.data)    │
│                                                        │
│  CadastroPacientes.js ─────→ POST /insertpaciente      │
│                             → PUT /updatepaciente/:id  │
│                                                        │
│  Exames.js ────────────────→ GET /getexames           │
│                             → DELETE /deleteexame/:id  │
│                                                        │
│  Requisicoes.js ───────────→ GET /getrequisicoes      │
│                             → POST /insertrequisicao   │
│                                                        │
│  ListaResultados.js ───────→ GET /getresultados       │
│                             → DELETE /deleteresultado  │
│                                                        │
│  LancamentoResultados.js ──→ POST /insertresultado    │
│                             → PUT /updateresultado/:id │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Ciclo de Vida - Exemplo: Criar Paciente

```
1. User clica em "Novo Paciente"
   └─ navigation.navigate("CadastroPacientes")

2. Página CadastroPacientes abre
   └─ useState para formData

3. User preenche o formulário
   └─ handleInputChange atualiza state

4. User clica em "Salvar"
   └─ Validação: nome e CPF obrigatórios

5. Envia POST /insertpaciente
   └─ apiService.createPaciente(data)
   └─ Fetch com Body JSON

6. Backend recebe em PacienteController.criar()
   └─ Valida dados
   └─ Cria novo objeto com ID único
   └─ Adiciona ao array pacientes[]
   └─ Retorna { error: false, message, paciente }

7. Frontend recebe response
   └─ result.error === false → Alert "Sucesso"
   └─ navigation.goBack() → Volta para Pacientes.js

8. useFocusEffect em Pacientes.js dispara
   └─ carregarPacientes() chamado
   └─ GET /getpacientes
   └─ setPacientes(result.data)

9. Lista atualiza com novo paciente
   └─ Componente ItemList re-renderiza
```

---

## 📦 Dependências Instaladas

### Backend (`/backend/package.json`)
```json
{
  "dependencies": {
    "body-parser": "^1.20.3",
    "cors": "^2.8.5",
    "dotenv": "^16.6.1",
    "express": "^4.21.2",
    "morgan": "^1.10.1"
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
    "@react-native-async-storage/async-storage": "..."
  }
}
```

---

## ⚙️ Configurações Importantes

### Backend - index.js
```javascript
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));
```

### Frontend - apiService.js
```javascript
const API_URL = 'http://localhost:3001';

// Emulator Android
'http://10.0.2.2:3001'

// iOS Simulator
'http://localhost:3001'

// Device Físico
'http://<SEU_IP>:3001'
```

---

## 🎬 Resumo Visual de Execução

```
┌──────────────────────────┐      ┌──────────────────────────┐
│   Terminal 1: Backend    │      │   Terminal 2: Frontend   │
│                          │      │                          │
│  $ node index.js         │      │  $ npm start             │
│                          │      │                          │
│  ✅ API on 3001          │      │  Emulator running        │
│                          │      │                          │
│  Listening for requests  │      │  App carrega login       │
│  (awaits fetch calls)    │      │                          │
└──────────────────────────┘      └──────────────────────────┘
           │                                    │
           │                                    │
           └────────────── HTTP ───────────────→│
                        fetch()
                        
           │←────────── JSON Response ──────────┘
           │                                    │
        Updates                             Updates
        console.log                         UI state
```

---

## ✨ Conclusão

Você tem agora:
- ✅ Backend com 4 módulos de negócio
- ✅ Frontend com 9 páginas funcionais
- ✅ API RESTful completa
- ✅ Comunicação frontend-backend
- ✅ Padrão consistente em todo projeto
- ✅ Pronto para adicionar novas features

**Bom desenvolvimento! 🚀**
