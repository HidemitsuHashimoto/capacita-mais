# Capacíta+

Portal web de capacitação profissional e empreendedora inclusiva, alinhado ao ODS 8 (trabalho decente e crescimento econômico).

Visitantes exploram a landing, o catálogo e as páginas dos cursos. Contas autenticadas podem se inscrever (quando há vaga), estudar as aulas, acompanhar o progresso e emitir um certificado ao concluir 100% do curso.

Stack: Next.js 15 (App Router) + TypeScript, Prisma + SQLite, Tailwind CSS.

## Pré-requisitos

- Node.js 20+
- npm

## Configuração local

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run db:seed
npm run dev
```

O app sobe em [http://localhost:3000](http://localhost:3000). O banco SQLite fica em `prisma/dev.db`.

## Variáveis de ambiente

| Variável       | Uso |
| -------------- | --- |
| `DATABASE_URL` | URL do Prisma. Local: `file:./dev.db` |
| `AUTH_SECRET`  | Segredo HMAC do cookie `capacita_session` |

Não commite o arquivo `.env`.

## Contas de demonstração

| Perfil | E-mail | Senha |
| ------ | ------ | ----- |
| Aluna  | `ana.demo@capacita.local` | `Demo@12345` |
| Admin  | `admin@capacita.local` | `Admin@12345` |

Ana não está inscrita no curso demonstração **Primeiros passos para empreender** (`/courses/primeiros-passos-empreender`). Esse é o caminho feliz: entrar, inscrever, concluir as 2 aulas e emitir o certificado.

Entre com a conta Admin e abra `/admin` para cadastrar, editar e excluir cursos e aulas. O link **Admin** no cabeçalho só aparece para quem tem perfil de administrador.

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção
- `npm start` — servidor de produção
- `npm run db:seed` — recria os dados de demonstração
- `npx prisma migrate dev` — cria/aplica migrations

## Deploy (Vercel)

O projeto é um app Next.js único (front + server actions). SQLite em arquivo não é adequado no filesystem efêmero da Vercel. Para produção, use [Turso](https://turso.tech/) (libSQL) com o adapter do Prisma e as mesmas variáveis `DATABASE_URL` e `AUTH_SECRET`.
