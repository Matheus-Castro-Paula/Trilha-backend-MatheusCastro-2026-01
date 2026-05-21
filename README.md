# Desafio Trainee Back-End 2026/1 - Comp Júnior

Este repositório contém a API desenvolvida como desafio final da trilha de capacitação de Back-End do processo seletivo da Comp Júnior.

O projeto consiste em um sistema de catálogo de produtos onde usuários podem se cadastrar, fazer login, gerenciar produtos e deixar avaliações (reviews). O sistema conta com níveis de acesso diferenciados (Default e Admin) e ambiente totalmente conteinerizado.

---

## Funcionalidades

- Cadastro de usuários
- Login com JWT
- Controle de acesso (RBAC)
- CRUD de produtos
- Sistema de avaliações (Reviews)
- Recuperação de senha via e-mail
- Dockerização do banco de dados
- Proteção de rotas privadas
- Upload de imagens de produtos na nuvem (Cloudinary + Multer)

---

## Evolução do Projeto (Timeline)

O desenvolvimento foi dividido em fases estratégicas para garantir uma base sólida antes de avançar para as regras de negócio complexas:

- **Semanas 1-2 (Fundação e Infraestrutura):** O foco inicial foi a configuração do ambiente de desenvolvimento e a conteinerização do banco de dados MySQL utilizando Docker, garantindo a portabilidade do projeto. Realizei a modelagem do banco de dados relacional e a criação das Migrations e Models via Sequelize para as entidades `User`, `Product` e `Review`, estabelecendo corretamente os relacionamentos entre elas.

- **Semana 3 (Segurança e Autenticação):** Implementação do sistema de segurança da API. Utilizei JWT para controle de sessão e Bcrypt para a criptografia das senhas dos usuários. Também nesta fase, integrei o Nodemailer com o serviço Mailtrap para simular o fluxo de recuperação de senha por e-mail.

- **Semanas 4-5 (Regras de Negócio e CRUD):** Desenvolvimento da lógica principal da aplicação. Criei os controladores e rotas para o CRUD completo de todas as entidades. Foi implementado o sistema de RBAC (Role-Based Access Control), utilizando middlewares para validar se um usuário é comum ou administrador, protegendo as rotas de criação e exclusão de produtos e a gestão de avaliações alheias.

- **Semana 6 -Semana final- (Regras, Avaliações e Nuvem):** Criação de CTs (Casos de Testes) para testar e confirmar funcionalidades, refinamento de código de acordo com bugs encontrados e implementação de upload de imagens multipart na nuvem com Cloudinary e tratamento avançado de erros.

---

## Tecnologias e Ferramentas

As tecnologias foram escolhidas visando simplicidade, escalabilidade e alinhamento com os requisitos do desafio.

- **JavaScript:** linguagem principal utilizada no desenvolvimento da aplicação devido à sua integração natural com o ecossistema Node.js e ampla utilização no desenvolvimento web.
- **Node.js:** utilizado como ambiente de execução JavaScript no back-end, permitindo a construção de APIs rápidas e escaláveis.
- **Express.js:** framework utilizado para gerenciamento das rotas, middlewares e estruturação da API REST.
- **MySQL 8.0:** escolhido como banco de dados relacional para garantir persistência dos dados e relacionamento entre as entidades do sistema.
- **Sequelize:** utilizado como ORM para facilitar a manipulação do banco de dados, criação de migrations e gerenciamento dos relacionamentos entre tabelas.
- **Docker & Docker Compose:** utilizados para padronizar o ambiente de desenvolvimento e facilitar a execução do projeto em diferentes máquinas.
- **JWT (JSON Web Token):** utilizado para autenticação stateless e gerenciamento seguro de sessão dos usuários.
- **Bcrypt:** utilizado para criptografia das senhas armazenadas no banco de dados, aumentando a segurança da aplicação.
- **Nodemailer & Mailtrap:** utilizados para simular o fluxo de recuperação de senha via e-mail em ambiente de desenvolvimento.
- **Cloudinary & Multer:** utilizados para possibilitar a implementação de imagens nos produtos via nuvem.

---

## Estrutura de Pastas

O projeto segue a arquitetura MVC (Model-View-Controller) adaptada para APIs, garantindo uma separação clara de responsabilidades:

```text
projeto-trainee-backend-2026/
├── config/            # Configurações de conexão com o Banco de Dados
│   └── config.js
│
├── controllers/       # Lógica de negócio e controle das requisições
│   ├── authController.js
│   ├── productController.js
│   ├── reviewController.js
│   └── userController.js
│
├── docs/              # Documentação interativa da API
│   └── Projeto Trainee Back-End 2026-1.postman_collection.json
│
├── middlewares/       # Interceptadores (Autenticação e Controle de Acesso)
│   ├── authMiddleware.js
│   ├── isAdmin.js
│   └── uploadMiddleware.js
│
├── migrations/        # Versionamento e histórico de criação das tabelas
│   ├── 01-create-user-13042026.js
│   ├── 02-create-product-13042026.js
│   ├── 03-create-review-13042026.js
│   └── 04-create-uploadImagem-12052026.js
│
├── models/            # Representação das tabelas e relacionamentos (ORM)
│   ├── index.js
│   ├── product.js
│   ├── review.js
│   └── user.js
│
├── routes/            # Definição dos endpoints (URLs) da API
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── reviewRoutes.js
│   └── userRoutes.js
│
├── seeders/           # Scripts para popular o banco (Usuário Admin padrão)
│   └── 20260423205242-demo-admin.js
│
├── .env.example       # Arquivo exemplo do ".env"
├── .gitignore         # Arquivo para ignorar pastas e arquivos no GitHub
├── docker-compose.yml # Orquestrador de serviços do Docker
├── Dockerfile         # Receita de containerização da aplicação
├── index.js           # Ponto de entrada e inicialização do servidor
├── package.json       # Dependências e scripts do projeto
├── README.md          # Arquivo para documentar o projeto
├── yarn.lock          # Árvore de dependências (Yarn)
└── node_modules/      # Bibliotecas instaladas (Ignorado no GitHub)
```

---

## Regras de Negócio e Permissões

- **Usuário Default:** Pode gerenciar seus próprios dados, visualizar produtos e criar avaliações. Só pode deletar as **próprias** avaliações.
- **Usuário Admin:** Tem acesso total ao sistema. Pode criar/editar produtos e deletar a avaliação de **qualquer** usuário.

---

## Endpoints da API

Aqui está o resumo das rotas disponíveis. _(A documentação interativa completa está no arquivo do Postman)._

### 1. Autenticação (Auth)

| Método | Rota                    | Auth | Descrição                                           |
| :----- | :---------------------- | :--- | :-------------------------------------------------- |
| `POST` | `/auth`                 | Não  | Registra um novo usuário no sistema                 |
| `POST` | `/auth/login`           | Não  | Realiza login e retorna o Token JWT                 |
| `POST` | `/auth/forgot-password` | Não  | Simula envio de token de recuperação via e-mail     |
| `POST` | `/auth/reset-password`  | Não  | Altera a senha utilizando o token enviado por email |

### 2. Usuários (Users)

| Método   | Rota         | Auth        | Descrição                           |
| :------- | :----------- | :---------- | :---------------------------------- |
| `GET`    | `/users/me`  | Sim         | Lista usuário logado                |
| `GET`    | `/users`     | Sim (Admin) | Lista todos os usuários cadastrados |
| `GET`    | `/users/:id` | Sim (Admin) | Busca um usuário específico pelo ID |
| `PUT`    | `/users/:id` | Sim (Admin) | Atualiza os dados de um usuário     |
| `DELETE` | `/users/:id` | Sim (Admin) | Deleta um usuário do sistema        |

### 3. Produtos (Products)

| Método   | Rota            | Auth        | Descrição                             |
| :------- | :-------------- | :---------- | :------------------------------------ |
| `GET`    | `/products`     | Não         | Lista todos os produtos               |
| `GET`    | `/products/:id` | Não         | Busca um produto específico pelo id   |
| `POST`   | `/products`     | Sim (Admin) | Cria um novo produto                  |
| `PUT`    | `/products/:id` | Sim (Admin) | Atualiza as informações de um produto |
| `DELETE` | `/products/:id` | Sim (Admin) | Exclui um produto do catálogo         |

### 4. Avaliações (Reviews)

| Método   | Rota                          | Auth | Descrição                                                                 |
| :------- | :---------------------------- | :--- | :------------------------------------------------------------------------ |
| `GET`    | `/reviews/product/:productId` | Sim  | Lista todas as avaliações de um produto                                   |
| `POST`   | `/reviews`                    | Sim  | Cria uma avaliação vinculada a um produto e usuário                       |
| `PUT`    | `/reviews/:id`                | Sim  | Atualiza uma avaliação de algum produto específico                        |
| `DELETE` | `/reviews/:id`                | Sim  | Deleta uma avaliação (_User deleta a própria, Admin deleta qualquer uma_) |

---

## Como rodar o projeto localmente

O projeto foi configurado para subir a aplicação completa (API + Banco de Dados) via Docker de forma unificada, permitindo a execução das migrations localmente com facilidade.

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/Matheus-Castro-Paula/Trilha-backend-MatheusCastro-2026-01.git
   cd Trilha-backend-MatheusCastro-2026-01
   ```

2. **Instale as dependências:**
   - (Necessário para rodar os comandos do Sequelize localmente na sua máquina)

   ```bash
   yarn install
   ```

3. **Configuração de Ambiente:**
   - Crie um arquivo `.env` na raiz do projeto copiando o modelo `.env.example`.
   - Preencha com as suas credenciais (JWT Secret, Mailtrap e Cloudinary).
   - **Importante:** Mantenha o `DB_HOST=127.0.0.1` no seu `.env` local para as migrations funcionarem perfeitamente. O Docker já está configurado para sobrescrever essa variável internamente de forma automática.

4. **Suba a infraestrutura (API e Banco de Dados via Docker):**
   - Você pode optar por rodar qualquer um desses dois comandos abaixo:
   - O primeiro constrói a imagem do container e deixa o terminal livre para próximos comandos, devido ao fato de rodar o cotêiner em segundo plano.
   - Já o segundo constrói a imagem do container e ocupa aquele terminal para mostrar os Logs da API, tendo que abrir um segundo terminal para rodar os próximos comandos.

   ```bash
   docker compose up -d --build
   ```

   - **OU**

   ```bash
   docker compose up --build
   ```

   - **!! Nota !! :** Após executar estes comandos, aguarde cerca de 15 a 20 segundos antes de ir para o próximo passo. Esse é o tempo necessário para o servidor do MySQL inicializar completamente dentro do contêiner e estar pronto para receber as conexões.

5. **Execute as Migrations e Seeders:**

   ```bash
   yarn sequelize-cli db:migrate
   yarn sequelize-cli db:seed:all
   ```

   - A API estará rodando em `http://localhost:3000` e pronta para receber requisições.

## Como testar a API (Postman)

A documentação interativa com requisições prontas está na pasta raiz do projeto.

1. Abra o Postman e importe o arquivo `Projeto Trainee Back-End 2026-1.postman_collection.json`.
2. A coleção é inteligente: ao disparar o `POST Login`, o Postman captura o seu token automaticamente e injeta em todas as rotas privadas. Basta sair testando sem precisar copiar e colar tokens manualmente.

### Desenvolvido por Matheus de Castro Paula durante o processo trainee 2026/1.
