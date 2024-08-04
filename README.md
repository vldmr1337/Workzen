# Workzen API

## Tabela de Conteúdos

- [Sobre o Projeto](#sobre-o-projeto)
- [Começando](#começando)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
- [Uso](#uso)
- [Contribuição](#contribuição)
- [Licença](#licença)
- [Conecte-se Comigo](#conecte-se-comigo)
- [Linguagens e Ferramentas](#linguagens-e-ferramentas)

---

## Sobre o Projeto

A **Workzen API** é uma solução completa para o gerenciamento de usuários e criação de vagas, oferecendo funcionalidades como:

- **Registro de Usuários**: Cadastro seguro de novos usuários(talento e empresa).
- **Login**: Autenticação de usuários existentes(JWT).
- **Gerenciamento de Perfis**: Edição e atualização de informações de perfil(talento e empresa).
- **Envio de email**: Verificação e recuperação de conta a partir de link enviado por email.
- **Criação de vagas**: Criação de vagas, inscrição e visualização.

A API é desenvolvida usando **Node.js**, **Express**, e **MongoDB**, também utiliza bibliotecas como *Passport.js(Google OAuth2)* e *Multer(armazenamento de arquivos em memória)* garantindo escalabilidade e flexibilidade para integrar-se com aplicações frontend modernas.

## Começando

Para começar a utilizar o Workzen API, siga os passos abaixo:

### Pré-requisitos

Antes de instalar o projeto, certifique-se de ter os seguintes softwares instalados:

- [Node.js](https://nodejs.org/en/) (versão 12 ou superior)
- [MongoDB](https://www.mongodb.com/try/download/community) (instância local ou em nuvem)
- [Git](https://git-scm.com/)

### Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/vldmr1337/Workzen.git
   ```

2. Entre na pasta do projeto:

   ```bash
   cd Workzen
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Configure as variáveis de ambiente no arquivo `.env`:

   ```js
    PORT=3000
    DATABASE_URL=mongodb_database_url
    JWT_SECRET=secret_jwt
    PASSWORD=smtp_pass
    SMTP=smt_server
    SMTP_PORT=smtp_port
    USER=smtp_user
    REPLYTO_EMAIL=your_reply_mail
    EMAIL=your_sender_mail
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_secret
    GOOGLE_CALLBACK_URL=your_google_callback_url
    CLIENT_REDIRECT_URL=your_frontend_magic_link
    CLOUDINARY_CLOUD_NAME=cloudinary_name
    CLOUDINARY_API_KEY=cloudinary_key
    CLOUDINARY_API_SECRET=cloudinary_secret
   ```

5. Inicie o servidor:

   ```bash
   npm start
   ```

   Ou, para desenvolvimento com hot-reloading:

   ```bash
   npm run dev
   ```

6. Acesse a API em `http://localhost:3000`.

## Uso

Após a instalação, você pode interagir com a API usando ferramentas como [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/). Aqui estão alguns dos principais endpoints disponíveis:

- **Registro de Usuário**: `POST /v1/user/register`
- **Login de Usuário**: `POST /v1/user/login`
- **Perfil do Usuário**: `GET /v1/me`
- **Upload de Currículo**: `POST /v1/mail/send/verify`

> **Nota:** Para endpoints protegidos, é necessário enviar um token JWT válido no cabeçalho da requisição.

> **Aviso:** Você pode ler a documentação inteira, com todos os endpoints e métodos [aqui](https://documenter.getpostman.com/view/35401261/2sA3kYhyw9).

## Contribuição

Contribuições são bem-vindas! Se você deseja colaborar com o projeto, siga os passos abaixo:

1. Faça um fork do projeto.
2. Crie uma nova branch: `git checkout -b feature/nova-feature`.
3. Faça commit das suas alterações: `git commit -m 'Adiciona nova feature'`.
4. Envie para a branch principal: `git push origin feature/nova-feature`.
5. Abra um Pull Request.

## Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

## Conecte-se Comigo

Você pode entrar em contato comigo por e-mail: netok812@gmail.com

## Linguagens e Ferramentas

<p align="left">
  <a href="https://expressjs.com" target="_blank" rel="noreferrer">
    <img src="https://camo.githubusercontent.com/0cf2cd7f4fda85e059316eeadea02410f5ff870b522f4f065e23149e5cf4bb8e/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f457870726573732532306a732d3030303030303f7374796c653d666f722d7468652d6261646765266c6f676f3d65787072657373266c6f676f436f6c6f723d7768697465" alt="Express.js" />
  </a>
  <a href="https://git-scm.com/" target="_blank" rel="noreferrer">
    <img src="https://camo.githubusercontent.com/3d768e26ac10ba994a60ed19acd487895cc43a9cdd43e9305c2408b93136234d/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6769742d2532334630353033332e7376673f7374796c653d666f722d7468652d6261646765266c6f676f3d676974266c6f676f436f6c6f723d7768697465" alt="Git" />
  </a>
  <a href="https://www.mongodb.com/" target="_blank" rel="noreferrer">
    <img src="https://camo.githubusercontent.com/7e95531437f8c91626ae46cb69240160dfde5c39c1119c550cd174ba8a19e712/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4d6f6e676f44422d2532333465613934622e7376673f7374796c653d666f722d7468652d6261646765266c6f676f3d6d6f6e676f6462266c6f676f436f6c6f723d7768697465" alt="MongoDB" />
  </a>
  <a href="https://nodejs.org" target="_blank" rel="noreferrer">
    <img src="https://camo.githubusercontent.com/0d58facab1be74748c39244ff3d990ae8ddd765af40263ed006219154ba90649/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6e6f64652e6a732d3644413535463f7374796c653d666f722d7468652d6261646765266c6f676f3d6e6f64652e6a73266c6f676f436f6c6f723d7768697465" alt="Node.js"/>
  </a>
</p>


