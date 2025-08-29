# TO DO App

# 📋 Task Manager API

Uma API RESTful completa para gerenciamento de tarefas com sistema de autenticação JWT. Construída com **Node.js**, **Fastify** e **MySQL**.

## ✨ Funcionalidades

### 🔐 **Autenticação**
- Registro de usuários com hash bcrypt
- Login com JWT token
- Middleware de autenticação para rotas protegidas

### ✅ **Gerenciamento de Tarefas**
- ➕ Criar tarefas
- 📖 Listar tarefas do usuário
- ✏️ Editar tarefas
- 🗑️ Excluir tarefas
- ✔️ Marcar como concluída/pendente

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Fastify** - Framework web rápido e eficiente  
- **MySQL** - Banco de dados relacional
- **JWT** - Autenticação via tokens
- **bcrypt** - Hash de senhas
- **CORS** - Suporte a requisições cross-origin

## 🗂️ Estrutura do Projeto

```
projeto/
├── 📁 controllers/
│   ├── authController.js      # Lógica de autenticação
│   └── tasksController.js     # CRUD de tarefas
├── 📁 routes/
│   ├── authRoutes.js          # Rotas de auth
│   └── tasksRoutes.js         # Rotas de tarefas
├── 📁 middleware/
│   └── auth.js                # Middleware JWT
├── server.js                  # Servidor principal
├── db.js                      # Configuração do banco
└── README.md
```

## 🚀 Como Executar

### 📋 **Pré-requisitos**
- Node.js v18+ 
- MySQL v8+
- npm ou yarn

### ⚙️ **Instalação**

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/task-manager-api.git
cd task-manager-api
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure o banco de dados:**
```bash
# Crie um banco MySQL
CREATE DATABASE task_manager;

# Execute os scripts SQL (veja seção Database Setup)
```

4. **Configure as variáveis de ambiente:**
```bash
# Crie um arquivo .env (opcional)
DB_HOST=localhost
DB_USER=root  
DB_PASSWORD=sua_senha
DB_NAME=task_manager
JWT_SECRET=sua_chave_secreta
PORT=3000
```

5. **Execute o servidor:**
```bash
npm start
# ou para desenvolvimento:
npm run dev
```

O servidor estará rodando em `http://localhost:3000` 🚀

## 🗄️ Database Setup

### **Tabelas necessárias:**

```sql
-- Tabela de usuários
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de tarefas
CREATE TABLE tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 📚 Documentação da API

### 🔐 **Autenticação**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/auth/register` | Cadastrar usuário |
| `POST` | `/auth/login` | Fazer login |

### ✅ **Tarefas**

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| `GET` | `/tasks` | Listar tarefas | ✅ |
| `POST` | `/tasks` | Criar tarefa | ✅ |
| `PUT` | `/tasks/:id` | Atualizar tarefa | ✅ |
| `DELETE` | `/tasks/:id` | Excluir tarefa | ✅ |
| `PATCH` | `/tasks/:id/toggle` | Alternar status | ✅ |

## 🔧 Exemplos de Uso

### **1. Registrar usuário**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "joao", "password": "123456"}'
```

### **2. Fazer login**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "joao", "password": "123456"}'
```

### **3. Criar tarefa**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Estudar Node.js", "description": "Aprender Fastify framework"}'
```

### **4. Listar tarefas**
```bash
curl -X GET http://localhost:3000/tasks \
  -H "Authorization: Bearer SEU_TOKEN"
```

### **5. Marcar tarefa como concluída**
```bash
curl -X PATCH http://localhost:3000/tasks/1/toggle \
  -H "Authorization: Bearer SEU_TOKEN"
```

## 📦 Dependências

```json
{
  "fastify": "^4.x",
  "@fastify/cors": "^8.x", 
  "jsonwebtoken": "^9.x",
  "bcrypt": "^5.x",
  "mysql2": "^3.x"
}
```

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).

## 👨‍💻 Autor

[@Dayarauujo](https://github.com/Dayarauujo)

