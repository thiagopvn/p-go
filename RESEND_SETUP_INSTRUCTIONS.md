# Como Configurar o Resend para Envio de Emails

## ⚠️ IMPORTANTE: Limitação do Domínio de Teste

**Atualmente configurado:** `onboarding@resend.dev` (domínio de teste)

**Limitação:** Com o domínio de teste, emails **só podem ser enviados para**:
- ✅ `thiagosantoscbmerj@gmail.com` (email do dono da conta Resend)
- ❌ Outros emails **NÃO funcionarão**

**Para enviar para qualquer email:** Você precisa verificar um domínio próprio (veja Passo 3 abaixo).

---

## Passo 1: Criar/Renovar API Key no Resend

1. Acesse: https://resend.com/api-keys
2. Faça login com sua conta
3. Clique em **"Create API Key"**
4. Configurações:
   - **Name**: `GOCG Permutas Production`
   - **Permission**: `Sending access` (suficiente para enviar emails)
   - **Domain**: `All domains` (ou selecione onboarding@resend.dev)
5. Clique em **"Add"**
6. **COPIE A CHAVE** (você só verá uma vez!)
   - Formato: `re_xxxxxxxxxxxxxxxxxxxx`

## Passo 2: Configurar no Firebase Functions

### Opção A: Usando arquivo .env (Local + Deploy)

1. Edite o arquivo: `functions/.env`
   ```bash
   RESEND_API_KEY=re_SUA_NOVA_CHAVE_AQUI
   ```

2. Deploy da função:
   ```bash
   cd functions
   npm run build
   cd ..
   firebase deploy --only functions
   ```

### Opção B: Usando Firebase Config (NÃO RECOMENDADO - será descontinuado)

```bash
firebase functions:config:set resend.api_key="re_SUA_NOVA_CHAVE_AQUI"
firebase deploy --only functions
```

## Passo 3: Verificar Domínio Próprio (Para Uso em Produção)

### Por que verificar um domínio?

Com domínio de teste (`onboarding@resend.dev`), você só pode enviar para seu próprio email.
Para enviar para qualquer usuário, você precisa de um domínio verificado.

### Como verificar um domínio:

#### Opção A: Comprar domínio novo (~R$ 30-40/ano)

**Provedores recomendados:**
- **Registro.br** (para .br): https://registro.br - ~R$ 40/ano
- **Hostinger**: https://hostinger.com.br - .com a partir de R$ 30/ano
- **GoDaddy**: https://godaddy.com

**Passos após comprar:**

1. **Adicionar no Resend:**
   - Acesse: https://resend.com/domains
   - Clique em "Add Domain"
   - Digite seu domínio: `gocgpermutas.com.br` (exemplo)

2. **Copiar registros DNS:**
   O Resend vai mostrar 3 registros:
   ```
   Tipo: TXT
   Nome: @
   Valor: v=spf1 include:_spf.resend.com ~all

   Tipo: CNAME
   Nome: resend._domainkey
   Valor: resend._domainkey.resend.com

   Tipo: MX (opcional, para receber emails)
   Nome: @
   Valor: feedback-smtp.resend.com
   Prioridade: 10
   ```

3. **Adicionar registros no provedor:**
   - Entre no painel do seu provedor (Registro.br, Hostinger, etc)
   - Vá em "DNS" ou "Gerenciar DNS"
   - Adicione os 3 registros acima
   - Salve

4. **Aguardar verificação:**
   - Pode levar de 1h até 48h
   - O Resend verifica automaticamente
   - Você receberá email quando verificado

5. **Atualizar código:**
   ```typescript
   from: 'GOCG Permutas <noreply@seudominio.com.br>'
   ```

   Depois:
   ```bash
   cd functions
   npm run build
   cd ..
   firebase deploy --only functions
   ```

#### Opção B: Usar domínio da GOCG (se disponível)

Se a GOCG tem domínio próprio (ex: `gocg.mil.br`):

1. Você precisa de acesso ao DNS do domínio
2. Entre em contato com o administrador de TI
3. Peça para adicionar os registros DNS do Resend
4. Use: `noreply@gocg.mil.br`

---

## Passo 4: Remover chave hardcoded do código

A chave `re_Dn9eooB7_8TPHgWKe35VmxjbsUKTN3Mn6` está exposta no código.

**IMPORTANTE:** Após gerar nova chave:
1. Revogue a chave antiga em: https://resend.com/api-keys
2. Use apenas variáveis de ambiente

## Passo 4: Verificar funcionamento

1. Faça deploy: `firebase deploy --only functions`
2. Verifique logs: `firebase functions:log --only sendPermutaEmail`
3. Teste enviando um email na aplicação
4. Verifique emails enviados em: https://resend.com/emails

## Troubleshooting

### Email não chega?

1. **Verifique spam/lixeira** do email de destino
2. **Verifique logs**:
   ```bash
   firebase functions:log --only sendPermutaEmail
   ```
3. **Verifique dashboard Resend**:
   - https://resend.com/emails
   - Veja se o email foi enviado
   - Veja status de entrega

### Erro "Invalid API Key"?

- A chave foi revogada ou está incorreta
- Gere uma nova em: https://resend.com/api-keys
- Atualize no `.env` e faça deploy

### EmailId retorna "unknown"?

- Significa que o Resend retornou um erro
- Verifique os logs do Firebase para ver o erro exato
- Provavelmente é API key inválida ou limite excedido

## Limites do Resend (Plano Gratuito)

- ✅ **3.000 emails/mês grátis**
- ✅ **100 emails/dia grátis**
- ✅ Domínio de teste: `onboarding@resend.dev`

Se precisar de mais, veja planos em: https://resend.com/pricing
