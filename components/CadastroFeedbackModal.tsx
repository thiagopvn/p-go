import React from 'react';

interface CadastroFeedbackModalProps {
  isOpen: boolean;
  isSuccess: boolean;
  errorMessage?: string;
  onClose: () => void;
}

export const CadastroFeedbackModal: React.FC<CadastroFeedbackModalProps> = ({
  isOpen,
  isSuccess,
  errorMessage,
  onClose
}) => {
  // Debug log
  console.log('CadastroFeedbackModal - isOpen:', isOpen, 'isSuccess:', isSuccess, 'errorMessage:', errorMessage);

  if (!isOpen) return null;

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/5521967586628', '_blank');
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative mx-auto border-0 w-full max-w-md shadow-2xl rounded-2xl bg-white">
        <div className="p-8">
          <div className="text-center">
            {/* Ícone de Sucesso ou Erro */}
            <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 ${
              isSuccess ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {isSuccess ? (
                <svg className="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>

            {/* Título */}
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {isSuccess ? 'Cadastro Realizado com Sucesso!' : 'Erro no Cadastro'}
            </h3>

            {/* Conteúdo */}
            {isSuccess ? (
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Seu cadastro foi concluído com sucesso!
                </p>
                <p className="text-sm text-gray-600">
                  Você já pode fazer login com seu RG e senha.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  {errorMessage || 'Ocorreu um erro ao realizar o cadastro.'}
                </p>

                {/* Box de contato para erros */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mt-4">
                  <p className="text-sm font-semibold text-brand-blue-dark mb-2">
                    Caso o problema persista, entre em contato:
                  </p>
                  <p className="text-lg font-bold text-brand-blue-dark">
                    2º Ten Thiago Santos
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    Desenvolvedor do Sistema
                  </p>
                  <button
                    onClick={handleWhatsAppClick}
                    className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-sm w-full"
                  >
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    WhatsApp: (21) 96758-6628
                  </button>
                </div>
              </div>
            )}

            {/* Botão de Fechar */}
            <button
              onClick={onClose}
              className={`w-full px-6 py-3 font-semibold rounded-lg transition-all duration-200 shadow-sm mt-6 ${
                isSuccess
                  ? 'bg-brand-blue-dark hover:bg-brand-blue text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              {isSuccess ? 'OK' : 'Fechar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};