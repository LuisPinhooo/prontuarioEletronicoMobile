# 🧪 Guia de Testes Rápidos

## ✅ Pré-requisitos

- [ ] Backend instalado: `npm install` na pasta `/backend`
- [ ] Frontend instalado: `npm install` na pasta `/frontend`
- [ ] Backend rodando: `node index.js` (porta 3001)
- [ ] Frontend iniciado: `npm start` (escolha emulador)

---

## 🔄 Fluxo de Teste Completo

### 1️⃣ Login
- **Ação**: Clique em "Entrar" na tela de Login
- **Credenciais**: 
  - Email: `admin@local`
  - Senha: `123456`
- **Esperado**: Navegação para Home com sucesso

---

### 2️⃣ Criar Paciente
1. Navigate → Menu → Pacientes
2. Clique em "Novo Paciente"
3. Preencha os campos:
   - Nome: `João Silva`
   - CPF: `123.456.789-00`
   - Outros campos opcionais
4. Clique em "Salvar Paciente"
5. **Esperado**: Alert "Paciente inserido com sucesso" + volta para lista

### 3️⃣ Listar Pacientes
1. Abra Pacientes → deve mostrar o paciente criado em #2
2. **Esperado**: Card com nome "João Silva" e CPF "123.456.789-00"

### 4️⃣ Editar Paciente
1. Clique no card do paciente criado
2. Mude algum campo (ex: telefone)
3. Clique em "Atualizar Paciente"
4. **Esperado**: Alert "Paciente atualizado com sucesso"

### 5️⃣ Deletar Paciente
1. Clique no ícone 🗑️ no card
2. Confirme a deleção
3. **Esperado**: Card desaparece, alert "Paciente removido com sucesso"

---

## 🏥 Testar Exames

### Criar Exame
1. Menu → Exames
2. Clique em "Novo Exame"
3. Preencha:
   - Nome: `Hemograma Completo`
   - Descrição: `Exame de sangue completo`
4. Salvar
5. **Esperado**: Exame aparece na lista

### Listar/Editar/Deletar
- Mesmo fluxo que Pacientes

---

## 📋 Testar Requisições

### Criar Requisição
1. Menu → Requisições
2. "Nova Requisição"
3. Preencha:
   - ID do Paciente: `1` (do paciente criado)
   - Tipo de Exame: `Hemograma`
   - Prioridade: `Alta`
4. Salvar
5. **Esperado**: Requisição na lista com status "Pendente"

---

## 📊 Testar Resultados

### Lançar Resultado
1. Menu → Resultados (ou Home → "Editar Resultados")
2. Clique em "Novo Resultado" (se houver botão)
3. OU: Clique num resultado existente para editar
4. Preencha:
   - ID do Exame: `1`
   - ID do Paciente: `1`
   - Valores: `Normal - RBC 4.5 milhões`
   - Observacoes: `Dentro dos limites`
5. Salvar
6. **Esperado**: Resultado aparece na lista

---

## 🐛 Debug via Terminal

### Backend - Ver Requisições
Quando fizer uma ação no app, você deve ver no terminal do backend:
```
GET /getpacientes
POST /insertpaciente
PUT /updatepaciente/1
DELETE /deletepaciente/1
```

### Frontend - Ver Logs
Abra o console do emulador (Ctrl+M no Android) e procure por:
- "Buscando pacientes..."
- "Resposta: {error:false, data:[...]}"
- Erros de conexão

---

## 🔧 Troubleshooting

### "Falha ao conectar com a API"
- [ ] Backend está rodando?
- [ ] Porta 3001 está correta?
- [ ] API_URL em apiService.js está `http://localhost:3001`?
- [ ] Se usar device físico, use IP local em vez de localhost

### "Erro internal do servidor"
- [ ] Verifique os logs no terminal do backend
- [ ] Valide que os campos são enviados com nomes corretos (p + fieldName)

### Dados não aparecem na lista
- [ ] Clique na tela novamente ou use back+forward
- [ ] useFocusEffect deve recarregar ao entrar na tela
- [ ] Verifique os logs do backend

### Campos não salvam
- [ ] Valore rificados os nomes dos campos no controller (pnome, pcpf, etc)
- [ ] Validações no handleSalvar estão passando?
- [ ] Response está retornando `error: false`?

---

## 📊 Endpoints Completos

### Pacientes
- `GET /getpacientes` - Listar todos
- `GET /getpacientes/:id` - Buscar por ID
- `POST /insertpaciente` - Criar
- `PUT /updatepaciente/:id` - Atualizar
- `DELETE /deletepaciente/:id` - Deletar

### Exames
- `GET /getexames` - Listar todos
- `GET /getexames/:id` - Buscar por ID
- `POST /insertexame` - Criar
- `PUT /updateexame/:id` - Atualizar
- `DELETE /deleteexame/:id` - Deletar

### Requisições
- `GET /getrequisicoes` - Listar todos
- `GET /getrequisicoes/:id` - Buscar por ID
- `GET /getrequisicoes/paciente/:pacienteId` - Listar por paciente
- `POST /insertrequisicao` - Criar
- `PUT /updaterequisicao/:id` - Atualizar
- `DELETE /deleterequisicao/:id` - Deletar

### Resultados
- `GET /getresultados` - Listar todos
- `GET /getresultados/:id` - Buscar por ID
- `GET /getresultados/exame/:exameId` - Listar por exame
- `POST /insertresultado` - Criar
- `PUT /updateresultado/:id` - Atualizar
- `DELETE /deleteresultado/:id` - Deletar

### Auth
- `POST /auth/login` - Login
- `POST /auth/register` - Registrar usuário
- `GET /health` - Verificar se API está online

---

## 💡 Dicas

1. **Sempre manter 2 terminais abertos**: Um para backend, outro para testes
2. **Usar `useFocusEffect`**: Garante que dados sejam recarregados ao entrar na tela
3. **console.log no backend**: Ajuda a ver exatamente o que está chegando
4. **Testar endpoints com curl** antes de testar no app
5. **Limpar cache do app** se tiver problemas: Delete app e reinstale

---

## ✨ Resumo das Telas

| Tela | Funcionalidade | Backend |
|------|---------------|---------|
| **Login** | Autentica usuário | `/auth/login` |
| **Pacientes** | Lista + CRUD | `/getpacientes`, `/insertpaciente`, etc |
| **Exames** | Lista + CRUD | `/getexames`, `/insertexame`, etc |
| **Requisições** | Lista + CRUD | `/getrequisicoes`, `/insertrequisicao`, etc |
| **Resultados** | Lista + CRUD | `/getresultados`, `/insertresultado`, etc |

---

## 🎯 Checklist Final

- [ ] Backend iniciado com sucesso
- [ ] Frontend iniciado com sucesso
- [ ] Login funcionando
- [ ] Consegue criar paciente
- [ ] Consegue listar pacientes
- [ ] Consegue editar paciente
- [ ] Consegue deletar paciente
- [ ] Mesmo para Exames, Requisições e Resultados
- [ ] Sem erros no console

**Se tudo passa ✅ = Pronto para desenvolvimento!**
