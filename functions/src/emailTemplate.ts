export interface PermutaEmailData {
  data: string;
  funcao: string;
  militarEntra: {
    grad: string;
    quadro: string;
    nome: string;
    rg: string;
    unidade: string;
  };
  militarSai: {
    grad: string;
    quadro: string;
    nome: string;
    rg: string;
    unidade: string;
  };
  confirmadaPorMilitarEntra: boolean;
  confirmadaPorMilitarSai: boolean;
  dataConfirmacao: string;
}

export const generateEmailHTML = (permuta: PermutaEmailData): string => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      timeZone: 'UTC',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmação de Permuta de Serviço - GOCG</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            line-height: 1.6;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .header {
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
            opacity: 0.5;
        }

        .header-content {
            position: relative;
            z-index: 1;
        }

        .logo-badge {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
        }

        .logo-badge svg {
            width: 48px;
            height: 48px;
        }

        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .header p {
            font-size: 16px;
            opacity: 0.95;
            font-weight: 500;
        }

        .content {
            padding: 40px 30px;
        }

        .success-badge {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 30px;
            box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
        }

        .success-badge-icon {
            width: 60px;
            height: 60px;
            margin: 0 auto 15px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .success-badge h2 {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .success-badge p {
            font-size: 14px;
            opacity: 0.95;
        }

        .info-card {
            background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 25px;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
        }

        .info-row:last-child {
            border-bottom: none;
        }

        .info-label {
            font-size: 14px;
            color: #6b7280;
            font-weight: 600;
        }

        .info-value {
            font-size: 14px;
            color: #111827;
            font-weight: 700;
        }

        .funcao-badge {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 700;
            display: inline-block;
        }

        .militares-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 25px;
        }

        .militar-card {
            background: white;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            padding: 20px;
            position: relative;
            overflow: hidden;
        }

        .militar-card.entra {
            border-color: #10b981;
        }

        .militar-card.sai {
            border-color: #ef4444;
        }

        .militar-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
        }

        .militar-card.entra::before {
            background: linear-gradient(90deg, #10b981 0%, #059669 100%);
        }

        .militar-card.sai::before {
            background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
        }

        .militar-label {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .militar-label.entra {
            color: #10b981;
        }

        .militar-label.sai {
            color: #ef4444;
        }

        .militar-detail {
            font-size: 13px;
            margin-bottom: 8px;
            color: #374151;
        }

        .militar-detail strong {
            color: #111827;
            font-weight: 700;
        }

        .confirmacao-status {
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            font-weight: 600;
        }

        .confirmacao-status.confirmado {
            color: #10b981;
        }

        .confirmacao-status.pendente {
            color: #f59e0b;
        }

        .legal-notice {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-left: 4px solid #f59e0b;
            border-radius: 8px;
            padding: 20px;
            margin-top: 30px;
        }

        .legal-notice-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 12px;
        }

        .legal-notice-icon {
            width: 24px;
            height: 24px;
            color: #d97706;
        }

        .legal-notice h3 {
            font-size: 14px;
            font-weight: 700;
            color: #92400e;
        }

        .legal-notice p {
            font-size: 13px;
            color: #78350f;
            line-height: 1.6;
        }

        .footer {
            background: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }

        .footer p {
            font-size: 13px;
            color: #6b7280;
            margin-bottom: 8px;
        }

        .footer-logo {
            font-size: 18px;
            font-weight: 800;
            color: #1e3a8a;
            margin-top: 15px;
        }

        @media only screen and (max-width: 600px) {
            body {
                padding: 10px;
            }

            .militares-grid {
                grid-template-columns: 1fr;
            }

            .header {
                padding: 30px 20px;
            }

            .content {
                padding: 30px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="header-content">
                <div class="logo-badge">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                </div>
                <h1>Permuta de Serviço Confirmada</h1>
                <p>Grupo de Operações Corpo de Guardas</p>
            </div>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Success Badge -->
            <div class="success-badge">
                <div class="success-badge-icon">
                    <svg fill="white" width="36" height="36" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                </div>
                <h2>Assinatura Eletrônica Registrada</h2>
                <p>Confirmado em ${formatDateTime(permuta.dataConfirmacao)}</p>
            </div>

            <!-- Info Card -->
            <div class="info-card">
                <div class="info-row">
                    <span class="info-label">Data do Serviço</span>
                    <span class="info-value">${formatDate(permuta.data)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Função</span>
                    <span class="funcao-badge">${permuta.funcao}</span>
                </div>
            </div>

            <!-- Militares Grid -->
            <div class="militares-grid">
                <!-- Militar que Entra -->
                <div class="militar-card entra">
                    <div class="militar-label entra">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                        MILITAR QUE ENTRA
                    </div>
                    <div class="militar-detail"><strong>${permuta.militarEntra.grad} ${permuta.militarEntra.quadro}</strong></div>
                    <div class="militar-detail">${permuta.militarEntra.nome}</div>
                    <div class="militar-detail">RG: ${permuta.militarEntra.rg}</div>
                    <div class="militar-detail">${permuta.militarEntra.unidade}</div>
                    <div class="confirmacao-status ${permuta.confirmadaPorMilitarEntra ? 'confirmado' : 'pendente'}">
                        ${permuta.confirmadaPorMilitarEntra ? '✓ Confirmado' : '⏳ Pendente'}
                    </div>
                </div>

                <!-- Militar que Sai -->
                <div class="militar-card sai">
                    <div class="militar-label sai">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                        </svg>
                        MILITAR QUE SAI
                    </div>
                    <div class="militar-detail"><strong>${permuta.militarSai.grad} ${permuta.militarSai.quadro}</strong></div>
                    <div class="militar-detail">${permuta.militarSai.nome}</div>
                    <div class="militar-detail">RG: ${permuta.militarSai.rg}</div>
                    <div class="militar-detail">${permuta.militarSai.unidade}</div>
                    <div class="confirmacao-status ${permuta.confirmadaPorMilitarSai ? 'confirmado' : 'pendente'}">
                        ${permuta.confirmadaPorMilitarSai ? '✓ Confirmado' : '⏳ Pendente'}
                    </div>
                </div>
            </div>

            <!-- Legal Notice -->
            <div class="legal-notice">
                <div class="legal-notice-header">
                    <svg class="legal-notice-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                    </svg>
                    <h3>Validade Jurídica</h3>
                </div>
                <p>
                    Conforme entendimento do Superior Tribunal de Justiça (STJ), o e-mail é considerado
                    documento válido para instruir ação judicial, conforme jurisprudência consolidada
                    (REsp 1.381.603/MS). Este documento possui validade legal e comprova a assinatura
                    eletrônica da permuta de serviço.
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Este é um e-mail automático. Por favor, não responda.</p>
            <p>Gerado automaticamente pelo Sistema de Permutas GOCG</p>
            <div class="footer-logo">GOCG PERMUTAS</div>
        </div>
    </div>
</body>
</html>
  `;
};

export const generateEmailSubject = (permuta: PermutaEmailData): string => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      timeZone: 'UTC',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return `Confirmação de Permuta - ${permuta.funcao} - ${formatDate(permuta.data)}`;
};
