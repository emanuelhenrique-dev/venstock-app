# 🎯 Target - Finance App

<p align="center">
  
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/emanuelhenrique-dev/target-expoRouter" />
  
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/emanuelhenrique-dev/target-expoRouter" />
  
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/emanuelhenrique-dev/target-expoRouter" />

  <img alt="GitHub commit activity (branch)" src="https://img.shields.io/github/commit-activity/t/emanuelhenrique-dev/target-expoRouter">

  <a href="https://github.com/emanuelhenrique-dev/target-expoRouter/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/emanuelhenrique-dev/target-expoRouter" />
  </a>

  <a href="https://github.com/emanuelhenrique-dev/target-expoRouter/issues">
    <img alt="Repository issues" src="https://img.shields.io/github/issues/emanuelhenrique-dev/target-expoRouter" />
  </a>
</p>

<p align="center">
  <img src=".github/image01.jpeg" width="25%" />
</p>

Aplicação mobile para controle de metas financeiras, permitindo o registro de entradas, saídas e cálculo automático de saldo com persistência de dados local.

## 📲 Download e Projeto

<p align="center">
  <a href="https://drive.google.com/file/d/1nzie36gQSCJkbzuH5MmTNPsxxR_so1m8/view" target="_blank">
    <img src="https://img.shields.io/badge/Google_Drive-APK-yellow?style=for-the-badge&logo=googledrive&logoColor=white" alt="Download APK Google Drive" />
  </a>
  <a href="https://expo.dev/accounts/emanuelhenrique-dev/projects/target" target="_blank">
    <img src="https://img.shields.io/badge/Expo-Project-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Link do Projeto no Expo" />
  </a>
  <a href="https://expo.dev/accounts/emanuelhenrique-dev/projects/target/builds" target="_blank">
    <img src="https://img.shields.io/badge/EAS-Builds-green?style=for-the-badge&logo=android&logoColor=white" alt="Download APK via EAS" />
  </a>
</p>

## 🚀 Tecnologias

- React Native
- Expo (v54 / Expo Router)
- TypeScript
- **SQLite** (expo-sqlite) para banco de dados local
- EAS Build (Android APK)
- React Navigation

## 📦 Funcionalidades

- **Persistência Offline:** Uso de banco de dados SQLite para manter os dados salvos no dispositivo.
- **Navegação Nativa:** Implementação de rotas usando Expo Router (File-based routing).
- **Gestão de Metas:** Cadastro de objetivos financeiros com monitoramento de transações.
- **Cálculo em Tempo Real:** Soma de entradas e saídas processada diretamente via queries SQL.

## 📝 Coisas aprendidas

Durante o desenvolvimento deste projeto mobile, as principais experiências foram:

- **Integração com Banco de Dados Nativo:** Configuração e manipulação de tabelas SQL dentro do ambiente mobile.
- **Ciclo de Build Mobile:** Uso do EAS CLI para compilar o projeto na nuvem e gerar um APK instalável.
- **Estrutura de Navegação:** Migração do conceito de navegação tradicional para o sistema de rotas baseado em arquivos do Expo Router.
- **Gestão de Dependências:** Resolução de conflitos de peer dependencies (React 19) em ambientes de build rigorosos.

## 📝 Persistência de Dados (SQLite)

Diferente de aplicações web que usam APIs, este projeto foca no uso do armazenamento local. O uso do `expo-sqlite` permitiu entender como realizar operações de CRUD diretamente no sistema de arquivos do aparelho:

```ts
// Exemplo de execução de Query SQL no projeto
const result = await db.execAsync(`
  INSERT INTO goals (name, target_value) 
  VALUES ('Viagem de Férias', 5000.00)
`);

// Busca dos detalhes da meta no banco
function show(id: number) {
  return database.getFirstAsync<TargetResponse>(
    `
      SELECT
        targets.id,
        targets.name,
        targets.amount,
        COALESCE (SUM(transactions.amount), 0) AS current,
        COALESCE ((SUM(transactions.amount) / targets.amount) * 100, 0) AS percentage,
        targets.created_at,
        targets.updated_at
      FROM targets
      LEFT JOIN transactions ON targets.id = transactions.target_id
      WHERE targets.id = ?
    `,
    [id]
  );
}
```

<p align="center">
  <img src=".github/image02.jpeg" width="20%" />
   <img src=".github/image03.jpeg" width="20%" />
</p>
