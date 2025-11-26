# 🔥 Configuração das Regras de Segurança do Firestore

## ⚠️ PROBLEMA IDENTIFICADO
O erro **"Missing or insufficient permissions"** ocorre porque as regras de segurança do Firestore estão bloqueando o acesso às collections.

## 🚀 SOLUÇÃO RÁPIDA (2 minutos)

### Método 1: Via Console do Firebase (Recomendado)

1. **Acesse o Console do Firebase:**
   - https://console.firebase.google.com
   - Selecione seu projeto

2. **Navegue até Firestore Database:**
   - Menu lateral: `Firestore Database`
   - Aba superior: `Rules` (Regras)

3. **Substitua as regras atuais:**
   - **DELETE** todo o conteúdo atual
   - **COPIE e COLE** o conteúdo do arquivo `firestore.rules`
   - Clique em `Publish` (Publicar)

4. **Aguarde 1-2 minutos** para as regras propagarem

### Método 2: Via Firebase CLI

```bash
# Instalar Firebase CLI (se não tiver)
npm install -g firebase-tools

# Fazer login
firebase login

# Inicializar Firebase no projeto (se necessário)
firebase init firestore

# Deploy das regras
firebase deploy --only firestore:rules
```

## 📋 O que as Regras Permitem:

### Collection `militares`:
- ✅ **Leitura**: Todos podem ler (necessário para validação no cadastro)
- ❌ **Escrita**: Bloqueada (apenas via admin/migration)

### Collection `usuarios`:
- ✅ **Leitura**: Todos podem ler (necessário para login)
- ✅ **Criação**: Todos podem criar novos usuários (cadastro)
- ❌ **Atualização**: Bloqueada por segurança
- ❌ **Exclusão**: Bloqueada

### Collection `permutas`:
- ✅ **Leitura**: Todos podem ler
- ✅ **Criação**: Todos podem criar
- ✅ **Atualização**: Todos podem atualizar
- ❌ **Exclusão**: Bloqueada

## 🔒 Regras de Produção (Futuro)

Para produção, considere implementar:
1. Autenticação Firebase Auth
2. Regras baseadas em roles (admin/user)
3. Validação de campos obrigatórios
4. Limite de taxa de criação

## ⚡ Teste Rápido

Após aplicar as regras, teste:
1. Tente cadastrar um novo usuário
2. O modal de sucesso/erro deve aparecer
3. Tente fazer login com o usuário criado

## 🆘 Suporte

Se continuar com erro de permissões:
1. Verifique se as regras foram publicadas corretamente
2. Aguarde 2-3 minutos para propagação
3. Limpe o cache do navegador (Ctrl+F5)
4. Verifique o console do Firebase para erros

## 📝 Regras Atuais Simplificadas

As regras atuais são **permissivas para desenvolvimento**.
**NÃO USE EM PRODUÇÃO** sem adicionar autenticação adequada!

```javascript
// RESUMO DAS PERMISSÕES:
// militares: READ all, WRITE none
// usuarios: READ all, CREATE all, UPDATE none, DELETE none
// permutas: READ all, CREATE all, UPDATE all, DELETE none
```