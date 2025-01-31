# OctoWave - Plataforma de Atendimentos com WhatsApp

OctoWave é uma plataforma inovadora de atendimento que integra WhatsApp, permitindo comunicação eficiente entre empresas e clientes. Criado por Gabriel, o sistema oferece uma solução completa com WebSockets, Prisma e tRPC, garantindo alta performance e segurança na transmissão de dados.

## Recursos

- 🧙‍♂️ **E2E type safety** com [tRPC](https://trpc.io)
- ⚡ **Full-stack React** com Next.js
- ⚡ **Suporte a WebSockets e Subscriptions**
- ⚡ **Banco de dados com Prisma**
- 🔐 **Autenticação** via [next-auth](https://next-auth.js.org/)
- ⚙️ **Extensões para VSCode**
- 🎨 **ESLint + Prettier** para código padronizado
- 💚 **CI com GitHub Actions**:
  - ✅ Testes E2E com [Playwright](https://playwright.dev/)
  - ✅ Linting automático

## Configuração

```bash
pnpm create next-app --example https://github.com/trpc/trpc --example-path examples/next-prisma-websockets-starter octowave
cd octowave
pnpm i
pnpm dx
```

## Arquivos Importantes

| Caminho | Descrição |
|---------|------------|
| [./prisma/schema.prisma](./prisma/schema.prisma) | Esquema do banco de dados Prisma |
| [./src/api/trpc/[trpc].tsx](./src/api/trpc/[trpc].tsx) | Manipulador de respostas do tRPC |
| [./src/server/routers](./src/server/routers) | Roteadores tRPC da aplicação |

## Comandos

```bash
pnpm build      # Geração do prisma + migrações + build do Next.js
pnpm db-nuke    # Reseta o banco de dados local
pnpm dev        # Inicia o servidor Next.js e WebSocket
pnpm dx         # Inicia o PostgreSQL, aplica migrações e seeds, e inicia o Next.js
pnpm test-dev   # Executa testes E2E em ambiente de desenvolvimento
pnpm test-start # Executa testes E2E após o build
pnpm test:unit  # Executa testes unitários com Vitest
pnpm test:e2e   # Executa testes E2E completos
```

---
Criado por **[Gabriel Oliveira](https://github.com/polabiel)**.
