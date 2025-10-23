# README do Servidor

Este projeto é um servidor backend desenvolvido com Node.js e Express, destinado a gerenciar funcionalidades relacionadas a funcionários, documentos e eventos.

## Estrutura do Projeto

- **server/src/server.js**: Ponto de entrada da aplicação. Configura o servidor Express, define middlewares e rotas.
- **server/src/routes/**: Contém as definições das rotas da aplicação.
  - **index.js**: Agrupa as rotas principais.
  - **auth.routes.js**: Rotas relacionadas à autenticação (login, registro).
  - **employees.routes.js**: Rotas para gerenciar funcionários (criação, edição, listagem).
  - **documents.routes.js**: Rotas para gerenciar documentos (upload, download).
  - **eventos.routes.js**: Rotas para gerenciar eventos (criação, validação).
  
- **server/src/controllers/**: Contém as funções que tratam as requisições.
  - **auth.controller.js**: Funções para autenticação.
  - **employees.controller.js**: Funções para gerenciamento de funcionários.
  - **documents.controller.js**: Funções para gerenciamento de documentos.
  - **eventos.controller.js**: Funções para gerenciamento de eventos.

- **server/src/middlewares/**: Contém middlewares para autenticação e tratamento de erros.
  - **auth.js**: Middleware de autenticação.
  - **error.js**: Middleware de tratamento de erros.

- **server/src/services/**: Contém funções de serviço para manipulação de dados.
  - **jwt.service.js**: Funções para manipulação de tokens JWT.
  - **storage.service.js**: Funções para gerenciamento de armazenamento de arquivos.
  - **employees.service.js**: Funções para manipulação de dados de funcionários.
  - **documents.service.js**: Funções para manipulação de dados de documentos.
  - **eventos.service.js**: Funções para manipulação de dados de eventos.

- **server/src/utils/**: Contém funções utilitárias.
  - **validators.js**: Funções de validação de dados.
  - **id.js**: Funções para geração e manipulação de IDs.

- **server/src/config/**: Contém configurações da aplicação.
  - **env.js**: Carrega variáveis de ambiente.
  - **multer.js**: Configura o middleware multer para uploads.

## Instalação

1. Clone o repositório.
2. Navegue até o diretório do servidor: `cd server`.
3. Instale as dependências: `npm install`.
4. Crie um arquivo `.env` baseado no `.env.example` e configure as variáveis de ambiente.
5. Inicie o servidor: `npm start`.

## Docker

Para construir a imagem Docker do servidor, utilize o comando:

```
docker build -t nome-da-imagem .
```

E para rodar o container:

```
docker run -p 3000:3000 nome-da-imagem
```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## Licença

Este projeto está licenciado sob a MIT License.