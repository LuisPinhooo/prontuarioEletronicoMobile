# 🧪 Guia de Testes Rápidos

## ✅ Pré-requisitos

- [ ] Backend instalado: `npm install` na pasta `/backend`
- [ ] Frontend instalado: `npm install` na pasta `/frontend`
- [ ] Dependências JWT instaladas no backend: `npm install jsonwebtoken bcryptjs`
- [ ] AsyncStorage instalado no frontend: `npm install @react-native-async-storage/async-storage`
- [ ] Backend rodando: `npm run dev` (porta **3000**, não 3001)
- [ ] Frontend iniciado: `npm start` (escolha emulador)

---

## 🔐 1️⃣ Testar Autenticação JWT

### Via Postman/Insomnia

#### Teste 1: Login com Sucesso
```
POST http://localhost:3000/auth/login
Body (JSON):
{
  "email": "admin@local",
  "password": "123456"
}

✅ Resposta Esperada (200 OK):
{
  "error": false,
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@local"
  }
}
```

#### Teste 2: Login com Credenciais Erradas
```
POST http://localhost:3000/auth/login
Body (JSON):
{
  "email": "admin@local",
  "password": "senha_errada"
}

✅ Resposta Esperada (401 Unauthorized):
{
  "error": true,
  "message": "Credenciais inválidas"
}
```

#### Teste 3: Acessar Rota Protegida SEM Token (Deve Bloquear)
```
GET http://localhost:3000/getpacientes

✅ Resposta Esperada (401 Unauthorized):
{
  "error": true,
  "message": "Token não fornecido"
}
```

#### Teste 4: Acessar Rota Protegida COM Token (Deve Funcionar)
```
GET http://localhost:3000/getpacientes
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

✅ Resposta Esperada (200 OK):
{
  "error": false,
  "data": [...],
  "total": 0
}
```

#### Teste 5: Criar Novo Usuário (Registro)
```
POST http://localhost:3000/auth/register
Body (JSON):
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}

✅ Resposta Esperada (201 Created):
{
  "error": false,
  "message": "Usuário registrado com sucesso",
  "user": {
    "id": 2,
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

---

### Via App React Native

#### Teste 1: Login no App
1. **Abra o app**
2. **Tela de Login deve aparecer**
3. **Digite credenciais**:
   - Email: `admin@local`
   - Senha: `123456`
4. **Clique em "Entrar"**
5. **✅ Esperado**: 
   - Alert de sucesso (opcional)
   - Navegação para tela Home
   - Token salvo no AsyncStorage

#### Teste 2: Token Persistindo
1. **Feche o app completamente**
2. **Abra o app novamente**
3. **✅ Esperado**: 
   - Se token existe e é válido → Vai direto para Home
   - Se token não existe → Volta para Login

#### Teste 3: Acessar Telas Protegidas
1. **Após login, navegue para "Pacientes"**
2. **✅ Esperado**: Lista de pacientes carrega (mesmo vazia)
3. **Tente criar um paciente**
4. **✅ Esperado**: Paciente criado com sucesso

#### Teste 4: Token Expirado
1. **Faça login**
2. **Aguarde 24 horas (ou force expiração no código)**
3. **Tente acessar qualquer tela**
4. **✅ Esperado**: 
   - Erro 401
   - Mensagem "Sessão expirada"
   - Redirecionar para Login (se implementado)

---

## 🔄 2️⃣ Fluxo de Teste Completo (Com Autenticação)

### 1. Login
- **Ação**: Tela de Login → Digite credenciais → "Entrar"
- **Credenciais**: 
  - Email: `admin@local`
  - Senha: `123456`
- **✅ Esperado**: Token salvo + Navegação para Home

---

### 2. Criar Paciente (Com Token)
1. Menu → Pacientes → "Novo Paciente"
2. Preencha:
   - Nome: `João Silva`
   - CPF: `123.456.789-00`
   - Telefone: `(11) 99999-9999`
   - Email: `joao@email.com`
   - (outros campos opcionais)
3. **Clique em "Salvar Paciente"**
4. **✅ Esperado**: 
   - POST `/insertpaciente` com header `Authorization: Bearer <token>`
   - Alert "Paciente inserido com sucesso"
   - Volta para lista

---

### 3. Listar Pacientes (Com Token)
1. **Abra "Pacientes"**
2. **✅ Esperado**: 
   - GET `/getpacientes` com header `Authorization: Bearer <token>`
   - Card com "João Silva" e CPF "123.456.789-00"

---

### 4. Editar Paciente (Com Token)
1. **Clique no card do paciente**
2. **Mude algum campo** (ex: telefone → `(11) 88888-8888`)
3. **Clique em "Atualizar Paciente"**
4. **✅ Esperado**: 
   - PUT `/updatepaciente/1` com header `Authorization: Bearer <token>`
   - Alert "Paciente atualizado com sucesso"

---

### 5. Deletar Paciente (Com Token)
1. **Clique no ícone 🗑️**
2. **Confirme a deleção**
3. **✅ Esperado**: 
   - DELETE `/deletepaciente/1` com header `Authorization: Bearer <token>`
   - Card desaparece
   - Alert "Paciente removido com sucesso"

---

## 🏥 3️⃣ Testar Exames (Com Token)

### Criar Exame
1. Menu → Exames → "Novo Exame"
2. Preencha:
   - Nome: `Hemograma Completo`
   - Descrição: `Exame de sangue completo`
3. **Salvar**
4. **✅ Esperado**: 
   - POST `/insertexame` com token
   - Exame aparece na lista

### Listar/Editar/Deletar
- **Mesmo fluxo que Pacientes**
- **Todas as requisições com token JWT**

---

## 📋 4️⃣ Testar Requisições (Com Token)

### Criar Requisição
1. Menu → Requisições → "Nova Requisição"
2. Preencha:
   - **Paciente**: Selecione da lista (ex: João Silva)
   - **Exames**: Selecione múltiplos exames
3. **Salvar**
4. **✅ Esperado**: 
   - POST `/insertrequisicao` com token
   - Requisição na lista com status "Pendente"

### Buscar Requisição por ID
1. **Digite ID da requisição** na barra de busca
2. **✅ Esperado**: Filtra apenas requisição com aquele ID

---

## 📊 5️⃣ Testar Resultados (Com Token)

### Lançar Resultado
1. Menu → Resultados → "Lançar Resultado"
2. **Buscar requisição** (digite ID)
3. **Requisição carrega** com dados do paciente e exames
4. **Preencha resultados** para cada exame:
   - Resultado: `Hemoglobina: 14.5 g/dL - Normal`
   - Observações: `Dentro dos limites`
5. **Salvar**
6. **✅ Esperado**: 
   - POST `/insertresultado` com token
   - Alert "Resultados lançados com sucesso"

### Editar Resultado
1. Menu → Resultados → "Editar Resultado"
2. **Buscar requisição** (digite ID)
3. **Requisição carrega** com resultados já preenchidos
4. **Modifique** algum resultado
5. **Salvar**
6. **✅ Esperado**: 
   - PUT `/updateresultado/:id` com token
   - Alert "Resultados atualizados com sucesso"

---

## 🐛 6️⃣ Debug via Terminal

### Backend - Ver Requisições com Token
Quando fizer uma ação no app, você deve ver no terminal do backend:
```
🔍 Auth Header recebido: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
✅ Token válido! Usuário: { id: 1, email: 'admin@local', name: 'Admin', iat: ..., exp: ... }
GET /getpacientes 200
```

**Se token inválido:**
```
❌ Erro ao verificar token: invalid signature
GET /getpacientes 401
```

### Frontend - Ver Logs
Abra o console do emulador (Ctrl+M no Android) e procure por:
```
[API Call] POST http://localhost:3000/auth/login
Resposta da API de Login: { error: false, token: "eyJhbGc...", user: {...} }
[API Call] GET http://localhost:3000/getpacientes
```

---

## 🔧 7️⃣ Troubleshooting

### "Token não fornecido"
**Causa:** Você não fez login ou o token foi perdido  
**Solução:** 
- [ ] Fazer login novamente
- [ ] Verificar se `AsyncStorage.getItem('authToken')` retorna um token
- [ ] Verificar se apiService está adicionando o header `Authorization`

### "Token inválido ou expirado"
**Causa:** Token expirou (24h) ou JWT_SECRET diferente  
**Solução:** 
- [ ] Fazer login novamente
- [ ] Verificar se `JWT_SECRET` é o MESMO em:
  - `backend/controllers/AuthController.js`
  - `backend/middlewares/auth.js`

### "Sessão expirada"
**Causa:** Token expirou após 24 horas  
**Solução:** 
- [ ] Fazer login novamente
- [ ] (Futuro) Implementar refresh token

### "Falha ao conectar com a API"
**Causa:** Backend não está rodando ou porta errada  
**Solução:**
- [ ] Backend rodando? `npm run dev`
- [ ] Porta correta? **3000** (não 3001)
- [ ] API_URL correto no `apiService.js`?
  - **Emulador Android**: `http://10.0.2.2:3000`
  - **iOS Simulator**: `http://localhost:3000`
  - **Device Físico**: `http://<SEU_IP>:3000`

### "Formato de token inválido"
**Causa:** Token não está no formato `Bearer <token>`  
**Solução:**
- [ ] Verificar se apiService adiciona `Bearer ` antes do token
- [ ] Não adicionar espaços extras
- [ ] Token deve estar completo (3 partes separadas por `.`)

### Dados não aparecem na lista
**Causa:** Token não está sendo enviado  
**Solução:**
- [ ] Fazer login primeiro
- [ ] Verificar logs do backend (deve mostrar token válido)
- [ ] `useFocusEffect` deve recarregar ao entrar na tela

### Login não funciona
**Causa:** Credenciais erradas ou backend não está rodando  
**Solução:**
- [ ] Usar `admin@local` / `123456`
- [ ] Backend rodando na porta 3000
- [ ] Verificar console do backend por erros

---

## 📊 8️⃣ Endpoints Completos (Todos Requerem Token, Exceto /auth)

### 🔓 Auth (Rotas Públicas - NÃO requerem token)
```
POST /auth/login
  Body: { email, password }
  Response: { error, token, user }

POST /auth/register
  Body: { name, email, password }
  Response: { error, message, user }

GET /auth/verify
  Headers: Authorization: Bearer <token>
  Response: { error, message, user }
```

### 🔒 Pacientes (Rotas Protegidas - REQUEREM token)
```
GET /getpacientes
  Headers: Authorization: Bearer <token>
  Response: { error, data, total }

GET /getpacientes/:id
  Headers: Authorization: Bearer <token>
  Response: { error, paciente }

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

### 🔒 Exames (Protegidas)
```
GET /getexames
GET /getexames/:id
POST /insertexame
PUT /updateexame/:id
DELETE /deleteexame/:id

Todas requerem: Headers: Authorization: Bearer <token>
```

### 🔒 Requisições (Protegidas)
```
GET /getrequisicoes
GET /getrequisicoes/:id
GET /getrequisicoes/paciente/:pacienteId
POST /insertrequisicao
PUT /updaterequisicao/:id
DELETE /deleterequisicao/:id

Todas requerem: Headers: Authorization: Bearer <token>
```

### 🔒 Resultados (Protegidas)
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

## 💡 9️⃣ Dicas

1. **Sempre fazer login antes de testar outras telas**
2. **Manter 2 terminais abertos**: Backend + Frontend
3. **Verificar token no AsyncStorage**: Use React Native Debugger
4. **Token expira em 24h**: Fazer novo login se passar esse tempo
5. **JWT_SECRET deve ser IGUAL** em AuthController e auth.js
6. **Usar Postman** para testar endpoints antes do app
7. **Verificar logs do backend** para ver se token está sendo validado
8. **console.log no frontend** para ver se token está sendo enviado

---

## ✨ 🔟 Resumo das Telas (Com Autenticação)

| Tela | Funcionalidade | Backend | Token? |
|------|---------------|---------|--------|
| **Login** | Autentica usuário | `/auth/login` | ❌ Não |
| **Home** | Menu principal | - | ✅ Sim (salvo) |
| **Pacientes** | Lista + CRUD | `/getpacientes`, etc | ✅ Sim |
| **Exames** | Lista + CRUD | `/getexames`, etc | ✅ Sim |
| **Requisições** | Lista + CRUD | `/getrequisicoes`, etc | ✅ Sim |
| **Resultados** | Lista + CRUD | `/getresultados`, etc | ✅ Sim |

---

## 🎯 Checklist Final

### Backend
- [ ] Backend iniciado com sucesso (`npm run dev`)
- [ ] Porta 3000 (não 3001)
- [ ] AuthController criado
- [ ] Middleware auth.js criado
- [ ] JWT_SECRET igual em ambos
- [ ] Rotas protegidas com middleware
- [ ] Login funciona no Postman
- [ ] Token válido permite acesso
- [ ] Token inválido bloqueia (401)

### Frontend
- [ ] Frontend iniciado com sucesso (`npm start`)
- [ ] AsyncStorage instalado
- [ ] Login.js funcional
- [ ] apiService adiciona token automaticamente
- [ ] API_URL correto (porta 3000)
- [ ] Login funciona no app
- [ ] Token salvo no AsyncStorage
- [ ] Consegue acessar telas protegidas após login
- [ ] Sem erros no console

### Funcionalidades
- [ ] Consegue fazer login
- [ ] Consegue criar paciente (com token)
- [ ] Consegue listar pacientes (com token)
- [ ] Consegue editar paciente (com token)
- [ ] Consegue deletar paciente (com token)
- [ ] Mesmo para Exames, Requisições e Resultados
- [ ] Sem token = bloqueado (401)
- [ ] Com token = funcionando

**Se tudo passa ✅ = Sistema com autenticação JWT funcionando perfeitamente! 🔐🚀**

---

## 🎉 Conclusão

Você tem agora:
- ✅ Autenticação JWT REAL (não mock)
- ✅ Login funcional no app
- ✅ Token salvando no AsyncStorage
- ✅ Middleware validando todas as rotas
- ✅ Rotas protegidas (sem token = bloqueado)
- ✅ CRUD completo funcionando com autenticação
- ✅ Sistema pronto para desenvolvimento

**Bom teste! 🧪✨**