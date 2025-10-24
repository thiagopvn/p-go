import emailjs from '@emailjs/browser';
import type { Permuta } from '../types';

interface SendPermutaEmailParams {
  email: string;
  permuta: Permuta;
}

export const sendPermutaEmailViaEmailJS = async ({ email, permuta }: SendPermutaEmailParams): Promise<{success: boolean, message: string}> => {
  try {
    // Verificar se as credenciais do EmailJS estão configuradas
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error('❌ EmailJS não configurado. Verifique as variáveis de ambiente.');
      return {
        success: false,
        message: 'EmailJS não está configurado. Veja EMAILJS_SETUP.md para instruções.'
      };
    }

    console.log('📧 [EmailJS] Iniciando envio de email para:', email);

    // Formatar data
    const dataFormatada = new Date(permuta.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

    // Preparar parâmetros do template
    const templateParams = {
      to_email: email,
      permuta_data: dataFormatada,
      permuta_funcao: permuta.funcao,

      // Militar que ENTRA
      militar_entra_grad: permuta.militarEntra.grad,
      militar_entra_quadro: permuta.militarEntra.quadro,
      militar_entra_nome: permuta.militarEntra.nome,
      militar_entra_rg: permuta.militarEntra.rg,
      militar_entra_unidade: permuta.militarEntra.unidade,
      status_entra: permuta.confirmadaPorMilitarEntra ? '✓ Confirmado' : '⏳ Pendente',

      // Militar que SAI
      militar_sai_grad: permuta.militarSai.grad,
      militar_sai_quadro: permuta.militarSai.quadro,
      militar_sai_nome: permuta.militarSai.nome,
      militar_sai_rg: permuta.militarSai.rg,
      militar_sai_unidade: permuta.militarSai.unidade,
      status_sai: permuta.confirmadaPorMilitarSai ? '✓ Confirmado' : '⏳ Pendente',
    };

    console.log('📝 [EmailJS] Parâmetros do template preparados');

    // Enviar email usando EmailJS
    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );

    console.log('✅ [EmailJS] Email enviado com sucesso! Response:', response);

    return {
      success: true,
      message: 'Email enviado com sucesso!'
    };

  } catch (error) {
    console.error('❌ [EmailJS] Erro ao enviar email:', error);

    let errorMessage = 'Erro desconhecido ao enviar email';

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'text' in error) {
      errorMessage = (error as any).text || errorMessage;
    }

    return {
      success: false,
      message: `Erro ao enviar email: ${errorMessage}`
    };
  }
};
