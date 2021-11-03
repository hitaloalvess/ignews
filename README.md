
<h1 align="center">
  <img alt="ignews" title="ignews" src=".github/logo.svg" width="400px" />
</h1>

<!-- <p align="center">
     <img src=".github/executandoAplicacao.gif" alt="watchMe demo" />
</p> -->

<p align="center">
  <a href="#-technologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-projeto">Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-como-usar?">Como usar?</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</p>

## 🚀 Tecnologias

Este projeto foi desenvolvido com as seguintes tecnologias:

- <a href="https://nextjs.org/">Next.js</a>
- <a href="https://prismic.io/">Prismic</a>
- <a href="https://stripe.com/">Stripe</a>
- <a href="https://fauna.com/">FaunaDB</a>
- <a href="https://sass-lang.com/">SASS</a>
- <a href="https://www.typescriptlang.org/">Typescript</a>
- <a href="https://yarnpkg.com/">Yarn</a>

## 💻 Projeto

<p>A aplicação ig.news é um blog de notícias, no qual usuários podem ter acesso aos conteúdos completos através de um sistema de assinatura.</p>
<p>Esse sistema é criado através de uma integração realizada com o gateway `Stripe` e `FaunaDB`, onde após o usuário preencher seus dados de pagamento e e o mesmo for aprovado, terá assim uma assinatura ativa e apta para visualizar todo o conteúdo do blog. Caso o usuário não deseje optar pela assinatura, ele terá um acesso limitado ao conteúdo de cada post.</p>
<p>As postagens são criadas e editadas através do Headless CMS `Prismic`, e integradas pelo front junto a aplicação.</p>
<p>No desenvolvimento de ig.news optou-se por utilizar recursos e ferramentas que o transformaram em uma aplicação Serveless, pois todo o processo que dependeria de um backend foi integrado totalmente dentro do front através das api routes do `Next.js` e sua arquitetura foi desenvolvida tendo como base o padrão JAMStack.</p>

## ⌨ Como usar?

Em primeiro lugar, clone o repositório:

```bash
# Clonando o repositório
git clone https://github.com/hitaloalvess/ignews.git

# ✅ Em sequência:

# Instale as dependências:
yarn install

#Copie o arquivo .env.local.example e altere seu nome para .env.local, e prencha as variáveis com seus respectivos valores:
cp .env.local.example .env.local

# Execute stripe listen para ouvir eventos do webhook
$ stripe listen --forward-to localhost:3000/api/webhooks

# Inicie o projeto no modo desenvolvedor
yarn dev
```

## :memo: License

Este projeto está sob a licença do MIT. Veja o [LICENSE](https://github.com/hitaloalvess/ignews/blob/main/LICENSE) para maiores informações.

---
Made with ♥ by Hitalo 🚀
