# GOCG Permutas - Sistema de Controle de Permutas de Serviço

Sistema de gerenciamento de permutas de serviço para militares do GOCG, desenvolvido com React, TypeScript, Firebase e Vercel.

## Tecnologias

- **Frontend**: React 19 + TypeScript
- **Estilização**: Tailwind CSS
- **Backend**: Firebase Firestore
- **Autenticação**: Sistema customizado com Firestore
- **Deploy**: Vercel
- **Build**: Vite

## Estrutura do Projeto

```
gocg-permutas/
├── components/           # Componentes React
│   ├── AdminDashboard.tsx
│   ├── UserDashboard.tsx
│   ├── LoginScreen.tsx
│   ├── PermutaRequestModal.tsx
│   ├── PermutaViewModal.tsx
│   ├── MilitarAdminModal.tsx
│   └── ...
├── contexts/            # Contextos React
│   ├── AppContext.tsx   # Estado global da aplicação
│   └── AuthContext.tsx  # Autenticação e usuários
├── firebase.ts          # Configuração do Firebase
├── migrate-data.ts      # Script de migração de dados
├── types.ts             # Tipos TypeScript
└── constants.ts         # Dados iniciais
```

## Configuração Local

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais do Firebase:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

### 3. Migrar Dados Iniciais para o Firebase

Execute o script de migração para popular o Firestore com os dados iniciais:

```bash
npm run migrate
```

Este script irá:
- Criar a coleção `militares` no Firestore
- Adicionar 93 militares com RG, nome, graduação, etc.
- Definir senha padrão como o RG de cada militar
- Atribuir a role `admin` ao militar com RG `12961` (J.SANTOS)

### 4. Executar em Desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`

## Credenciais de Acesso

### Admin
- **RG**: 12961
- **Senha**: 12961 (padrão)
- **Nome**: CAP J.SANTOS (GOCG)

### Usuários Regulares
- **RG**: Qualquer RG dos militares cadastrados
- **Senha**: O próprio RG (padrão)

**Nota**: Os usuários podem alterar suas senhas após o primeiro acesso.

## Deploy na Vercel

### 1. Conectar Repositório

1. Acesse [vercel.com](https://vercel.com)
2. Faça login e crie um novo projeto
3. Conecte seu repositório GitHub/GitLab

### 2. Configurar Variáveis de Ambiente

No painel da Vercel, em **Settings > Environment Variables**, adicione:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
```

### 3. Deploy

A Vercel detectará automaticamente que é um projeto Vite e configurará o build. O deploy será automático a cada push para a branch principal.

## Funcionalidades

### Usuários Regulares
- Login com RG e senha
- Cadastro de novos usuários
- Solicitar permutas de serviço
- Visualizar histórico de permutas

### Administradores
- Todas as funcionalidades de usuário regular
- Aprovar/Rejeitar permutas
- Gerar documentos (Nota GOCG)
- Gerenciar cadastro de militares
- Visualizar todas as permutas

## Estrutura de Dados

### Firestore Collections

#### militares
```typescript
{
  rg: string;           // ID do documento
  grad: string;         // Graduação (CAP, 1° TEN, etc.)
  quadro: string;       // Quadro (QOC, QOA)
  nome: string;         // Nome do militar
  unidade: string;      // Unidade de lotação
  senha: string;        // Senha (hash em produção)
  role: 'admin' | 'user'; // Papel do usuário
}
```

#### permutas
```typescript
{
  id: string;           // ID do documento
  data: string;         // Data do serviço (YYYY-MM-DD)
  funcao: string;       // Função (COMANDANTE 1º SOCORRO, etc.)
  militarEntraRg: string; // RG do militar que entra
  militarSaiRg: string;   // RG do militar que sai
  status: 'Pendente' | 'Aprovada' | 'Rejeitada';
}
```

## Scripts Disponíveis

```bash
npm run dev       # Servidor de desenvolvimento
npm run build     # Build de produção
npm run preview   # Preview do build
npm run migrate   # Migrar dados para Firestore
```

## Notas de Segurança

⚠️ **IMPORTANTE**: Este projeto armazena senhas em texto plano no Firestore para fins educacionais. Em produção, você deve:

1. Implementar hash de senhas (bcrypt, argon2)
2. Adicionar validação de força de senha
3. Implementar autenticação de dois fatores
4. Usar Firebase Authentication em vez de autenticação customizada
5. Adicionar rate limiting para prevenir ataques de força bruta

## Licença

Este projeto é de uso interno do GOCG.
# p-go
