# Configuração do EmailJS

EmailJS permite enviar emails diretamente do frontend sem precisar de servidor ou domínio verificado!

## Passo 1: Criar conta no EmailJS

1. Acesse: https://www.emailjs.com/
2. Clique em **"Sign Up"** (criar conta gratuita)
3. Confirme seu email

## Passo 2: Adicionar Serviço de Email

1. No dashboard do EmailJS, vá em **"Email Services"**
2. Clique em **"Add New Service"**
3. Escolha seu provedor de email:
   - **Gmail** (recomendado - gratuito)
   - Outlook
   - Yahoo
   - Outros

4. **Para Gmail:**
   - Clique em "Gmail"
   - Dê um nome: "GOCG Permutas"
   - Clique em **"Connect Account"**
   - Faça login com sua conta Gmail
   - Autorize o EmailJS
   - Clique em **"Create Service"**

5. **COPIE o Service ID** (algo como: `service_xxxxxxx`)

## Passo 3: Criar Template de Email

1. Vá em **"Email Templates"**
2. Clique em **"Create New Template"**
3. Configure o template:

**Template Settings:**
- **Template Name**: `Confirmacao Permuta`
- **Subject**: `Confirmação de Permuta - {{permuta_data}}`

**Template Content (Email Body):**
```html
<h2 style="color: #1e40af;">Confirmação de Permuta de Serviço</h2>

<div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h3>✅ Permuta Confirmada</h3>
  <p><strong>Data:</strong> {{permuta_data}}</p>
  <p><strong>Função:</strong> {{permuta_funcao}}</p>
</div>

<div style="display: flex; gap: 20px; margin: 20px 0;">
  <div style="flex: 1; background: #d1fae5; padding: 15px; border-radius: 8px;">
    <h4 style="color: #059669;">✓ ENTRA</h4>
    <p><strong>{{militar_entra_grad}} {{militar_entra_quadro}} {{militar_entra_nome}}</strong></p>
    <p>RG: {{militar_entra_rg}}</p>
    <p>Unidade: {{militar_entra_unidade}}</p>
    <p>Status: {{status_entra}}</p>
  </div>

  <div style="flex: 1; background: #fee2e2; padding: 15px; border-radius: 8px;">
    <h4 style="color: #dc2626;">✗ SAI</h4>
    <p><strong>{{militar_sai_grad}} {{militar_sai_quadro}} {{militar_sai_nome}}</strong></p>
    <p>RG: {{militar_sai_rg}}</p>
    <p>Unidade: {{militar_sai_unidade}}</p>
    <p>Status: {{status_sai}}</p>
  </div>
</div>

<div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
  <p style="margin: 0; font-size: 12px; color: #92400e;">
    <strong>Observação Importante:</strong> Conforme entendimento do STJ, o e-mail é considerado
    documento válido para instruir ação judicial (REsp 1.381.603/MS).
  </p>
</div>

<p style="font-size: 12px; color: #6b7280; margin-top: 30px;">
  Este email foi gerado automaticamente pelo sistema GOCG Permutas.
</p>
```

4. Clique em **"Save"**
5. **COPIE o Template ID** (algo como: `template_xxxxxxx`)

## Passo 4: Obter Public Key

1. Vá em **"Account"** → **"General"**
2. Encontre **"Public Key"**
3. **COPIE a Public Key** (algo como: `AbCdEfGhIjKlMnOp`)

## Passo 5: Configurar no Projeto

Você precisará adicionar 3 valores no arquivo `.env.local`:

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=AbCdEfGhIjKlMnOp
```

**Substitua pelos valores copiados nos passos anteriores!**

## Limites do Plano Gratuito

✅ **200 emails/mês grátis**
✅ Sem necessidade de domínio verificado
✅ Funciona direto do frontend
✅ Suporta Gmail, Outlook, Yahoo, etc.

Para mais emails: https://www.emailjs.com/pricing

## Troubleshooting

### Email não chega?

1. **Verifique spam/lixeira**
2. **Verifique se as credenciais estão corretas** no `.env.local`
3. **Veja o console do navegador** (F12) para erros
4. **Verifique limite do plano**: https://dashboard.emailjs.com/admin

### Erro 403?

- A Public Key está incorreta
- Verifique se copiou corretamente

### Erro 412?

- O Template ID ou Service ID está incorreto
- Verifique se criou o template corretamente

## Próximos Passos

Após configurar, o código enviará emails automaticamente quando uma permuta for confirmada!
