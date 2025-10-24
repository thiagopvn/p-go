import * as functions from 'firebase-functions/v1';
import { Resend } from 'resend';
import { generateEmailHTML, generateEmailSubject, PermutaEmailData } from './emailTemplate';

// Inicializar Resend com a chave da API
// Usando a chave do .env para testes
const resend = new Resend(process.env.RESEND_API_KEY || 're_Dn9eooB7_8TPHgWKe35VmxjbsUKTN3Mn6');

interface SendPermutaEmailRequest {
  email: string;
  permuta: PermutaEmailData;
}

interface SendPermutaEmailResponse {
  success: boolean;
  message: string;
  emailId?: string;
}

export const sendPermutaEmail = functions
  .region('southamerica-east1') // São Paulo region
  .https.onCall(async (data: SendPermutaEmailRequest, context: functions.https.CallableContext): Promise<SendPermutaEmailResponse> => {
    try {
      // Validação dos dados de entrada
      if (!data.email || !data.permuta) {
        return {
          success: false,
          message: 'Dados inválidos: email e permuta são obrigatórios'
        };
      }

      // Validação básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return {
          success: false,
          message: 'Email inválido'
        };
      }

      // Gerar HTML e assunto do email
      const htmlContent = generateEmailHTML(data.permuta);
      const subject = generateEmailSubject(data.permuta);

      // Enviar email usando Resend
      const emailData = await resend.emails.send({
        from: 'GOCG Permutas <noreply@gocgpermutas.com.br>',
        to: data.email,
        subject: subject,
        html: htmlContent,
      });

      const emailId = emailData.data?.id || 'unknown';

      console.log('Email enviado com sucesso:', {
        emailId: emailId,
        destinatario: data.email,
        permutaData: data.permuta.data,
        permutaFuncao: data.permuta.funcao
      });

      return {
        success: true,
        message: 'Email enviado com sucesso',
        emailId: emailId
      };
    } catch (error) {
      console.error('Erro ao enviar email:', error);

      // Tratamento de erros específicos do Resend
      if (error instanceof Error) {
        return {
          success: false,
          message: `Erro ao enviar email: ${error.message}`
        };
      }

      return {
        success: false,
        message: 'Erro desconhecido ao enviar email'
      };
    }
  });
