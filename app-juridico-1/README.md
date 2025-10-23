# Projeto App Jurídico

Este projeto é uma aplicação web para gerenciamento de funcionários, documentos e eventos, desenvolvida com Node.js e React. A aplicação é dividida em duas partes principais: o servidor (backend) e o frontend.

## Estrutura do Projeto

```
app-juridico
├── server                # Código do servidor
│   ├── src               # Código fonte do servidor
│   ├── package.json      # Dependências e scripts do servidor
│   ├── .env.example      # Exemplo de variáveis de ambiente
│   ├── README.md         # Documentação do servidor
│   └── Dockerfile        # Instruções para construir a imagem Docker do servidor
├── react-frontend         # Código do frontend
│   ├── src               # Código fonte do frontend
│   ├── package.json      # Dependências e scripts do frontend
│   ├── .env.example      # Exemplo de variáveis de ambiente para o frontend
│   └── README.md         # Documentação do frontend
├── db                    # Scripts do banco de dados
│   ├── schema.sql       # Esquema do banco de dados
│   ├── migrations        # Migrações do banco de dados
│   └── README.md         # Documentação sobre o banco de dados
├── uploads               # Diretório para uploads de arquivos
│   └── .gitkeep          # Mantém o diretório no controle de versão
├── .gitignore            # Arquivos e diretórios a serem ignorados pelo Git
└── README.md             # Documentação geral do projeto
```

## Tecnologias Utilizadas

- **Backend**: Node.js, Express, JWT para autenticação.
- **Frontend**: React, React Router.
- **Banco de Dados**: PostgreSQL.
- **Gerenciamento de Arquivos**: Multer para uploads.

## Como Executar o Projeto

### Backend

1. Navegue até o diretório do servidor:
   ```
   cd server
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Crie um arquivo `.env` com as variáveis de ambiente necessárias, usando o arquivo `.env.example` como referência.

4. Inicie o servidor:
   ```
   npm start
   ```

### Frontend

1. Navegue até o diretório do frontend:
   ```
   cd react-frontend
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Inicie a aplicação React:
   ```
   npm start
   ```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## Licença

Este projeto está licenciado sob a MIT License.