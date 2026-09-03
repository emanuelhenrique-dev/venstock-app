# 📦 Venstock

<p align="center">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/emanuelhenrique-dev/venstock-app" />
  
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/emanuelhenrique-dev/venstock-app" />
  
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/emanuelhenrique-dev/venstock-app" />

  <img alt="GitHub commit activity (branch)" src="https://img.shields.io/github/commit-activity/t/emanuelhenrique-dev/venstock-app">

  <a href="https://github.com/emanuelhenrique-dev/venstock-app/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/emanuelhenrique-dev/venstock-app" />
  </a>

  <a href="https://github.com/emanuelhenrique-dev/venstock-app/issues">
    <img alt="Repository issues" src="https://img.shields.io/github/issues/emanuelhenrique-dev/venstock-app" />
  </a>
</p>

<p align="center">
  <img alt="Venstock logo" src=".github/image01.png" width="22%" />
</p>

Venstock é um aplicativo mobile para pequenos comércios gerenciarem estoque, vendas, produtos e receitas com dados salvos localmente.

## 📲 Download e Projeto

<p align="center">
  <!-- <a href="https://drive.google.com/file/d/1nzie36gQSCJkbzuH5MmTNPsxxR_so1m8/view" target="_blank">
    <img src="https://img.shields.io/badge/Google_Drive-APK-yellow?style=for-the-badge&logo=googledrive&logoColor=white" alt="Download APK Google Drive" />
  </a> -->
  <a href="https://expo.dev/accounts/emanuelhenrique-dev/projects/venstock-app/builds/7d18649a-8400-4a50-afa4-5e93677255ee" target="_blank">
    <img src="https://img.shields.io/badge/Expo-Project-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Link do Projeto no Expo" />
  </a>
  <a href="https://expo.dev/accounts/emanuelhenrique-dev/projects/venstock-app/builds" target="_blank">
    <img src="https://img.shields.io/badge/EAS-Builds-green?style=for-the-badge&logo=android&logoColor=white" alt="Download APK via EAS" />
  </a>
</p>

## 🚀 Visão geral

O app foi desenvolvido para comerciantes que precisam de controle rápido e confiável do estoque e das vendas:

- Cadastro de categorias e produtos
- Ajuste de estoque e mínimo de reposição
- Registro de vendas e retiradas
- Busca por nome, código de barras e categoria
- Notificações locais para alertas de estoque baixo e carrinho
- Estatísticas e ranking de produtos mais vendidos
- Exportação e importação de dados de backup (JSON)

## 🧠 Tecnologias usadas

- React Native
- Expo SDK 54
- Expo Router
- TypeScript
- SQLite
- AsyncStorage
- Expo Notifications, Camera, Image Picker e sharing , etc
- React Native SVG e QRCode
- Zustand para estado global

## 📦 Funcionalidades atuais

- Cadastro, edição e exclusão de categorias
- Cadastro e edição de produtos com imagem, cor, descrição, código de barras e categoria
- Ajuste manual de estoque e mínimo de estoque
- Registro de transações de venda e retirada
- Visualização de histórico e exclusão de transações recentes
- Busca de produtos por nome ou código e filtro por estoque baixo
- Exibição de produtos categorizados e ranking dos produtos mais vendidos
- Notificações de estoque baixo e lembretes de carrinho
- Persistência offline usando SQLite

## 🧱 Estrutura do projeto

- `src/app/`: telas e rotas do Expo Router
- `src/components/`: componentes reutilizáveis como cards, formulários e scanner
- `src/database/`: hooks de acesso a SQLite para categorias, produtos e transações
- `src/hooks/`: hooks personalizados para autenticação, notificações e lembretes
- `src/services/`: lógica de alertas de estoque e notificações locais
- `src/store/`: estado global do carrinho com `zustand`
- `src/theme/`: cores, tipografia e estilos globais

## 📥 Como rodar

```bash
npm install
npm run android
```

## 💡 Observações

- O Venstock funciona offline, mantendo os dados salvos no dispositivo.
- A navegação é feita com Expo Router.
- O app usa câmera e galeria para imagens de produtos e perfil.
- O banco de dados local é gerenciado via SQLite.
- Pretendo fazer uma v2 com banco de dados online.

## 📝 Aprendizados

- Armazenamento local com SQLite e migrações
- Exportação, importação e preservação de integridade relacional em backups JSON
- Tratamento de dados legados e compatibilidade retroativa no banco de dados
- Formulários de produto com validações e captura de imagem
- Navegação moderna com Expo Router
- Integração com notificações nativas e permissões de dispositivo
- Estatísticas de vendas, gráficos interativos e análise de estoque em tempo real

<p align="center">
  <img src=".github/image02.png" width="23%" />
  <img src=".github/image03.png" width="23%" />
</p>
