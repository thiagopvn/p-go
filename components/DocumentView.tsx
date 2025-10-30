import React, { useState } from 'react';
import type { Permuta, Funcao } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { Footer } from './Footer';
import { saveAs } from 'file-saver';
import { Document, Packer, Table, TableCell, TableRow, Paragraph, TextRun, WidthType, AlignmentType, BorderStyle, VerticalAlign } from 'docx';

interface DocumentViewProps {
  permutas: Permuta[];
  onBack: () => void;
}

export const DocumentView: React.FC<DocumentViewProps> = ({ permutas, onBack }) => {
  const { marcarPermutasComoEnviadas } = useAppContext();
  const [marcandoEnviadas, setMarcandoEnviadas] = useState(false);
  const [jaEnviadas, setJaEnviadas] = useState(false);

  const formatMilitarString = (militar: Permuta['militarEntra']) => {
    return `${militar.grad} BM ${militar.quadro} ${militar.nome}`;
  };

  const formatRg = (rg: string) => {
    if (rg.length > 3) {
      return `${rg.slice(0, -3)}.${rg.slice(-3)}`;
    }
    return rg;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = async () => {
    const today = new Date();
    const noteNumber = `149/${today.getFullYear()}`;

    // Agrupar permutas por função
    const permutasByFuncao = permutas.reduce((acc, permuta) => {
      const funcao = permuta.funcao || "1º SOCORRO";
      if (!acc[funcao]) {
        acc[funcao] = [];
      }
      acc[funcao].push(permuta);
      return acc;
    }, {} as Record<string, Permuta[]>);

    // Ordenar permutas dentro de cada função por data
    Object.keys(permutasByFuncao).forEach(funcao => {
      permutasByFuncao[funcao].sort((a, b) =>
        new Date(a.data).getTime() - new Date(b.data).getTime()
      );
    });

    const funcaoOrder: Funcao[] = ["1º SOCORRO", "2º SOCORRO", "BUSCA E SALVAMENTO"];
    const orderedFuncoes = Object.keys(permutasByFuncao).sort((a, b) => {
      const indexA = funcaoOrder.indexOf(a as Funcao);
      const indexB = funcaoOrder.indexOf(b as Funcao);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    const docChildren: Array<Paragraph | Table> = [];

    // Título
    docChildren.push(
      new Paragraph({
        text: `ESCALA DE SERVIÇO – COMANDANTE DE SOCORRO – ALTERAÇÃO – ANEXO XX – NOTA GOCG ${noteNumber}`,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        style: 'heading1',
      })
    );

    // Criar tabelas para cada função
    orderedFuncoes.forEach((funcao, index) => {
      if (index > 0) {
        docChildren.push(
          new Paragraph({
            text: '',
            spacing: { before: 600 },
          })
        );
      }

      // Subtítulo da função
      docChildren.push(
        new Paragraph({
          text: funcao.toUpperCase(),
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          bold: true,
        })
      );

      const tableRows: TableRow[] = [];

      // Header row 1
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: 'ENTRA', alignment: AlignmentType.CENTER, bold: true })],
              columnSpan: 3,
              shading: { fill: 'd3d3d3' },
              verticalAlign: VerticalAlign.CENTER,
            }),
            new TableCell({
              children: [new Paragraph({ text: 'SAI', alignment: AlignmentType.CENTER, bold: true })],
              columnSpan: 2,
              shading: { fill: 'd3d3d3' },
              verticalAlign: VerticalAlign.CENTER,
            }),
          ],
        })
      );

      // Header row 2
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: 'DIA', alignment: AlignmentType.CENTER, bold: true })],
              shading: { fill: 'd3d3d3' },
              verticalAlign: VerticalAlign.CENTER,
            }),
            new TableCell({
              children: [new Paragraph({ text: 'MILITAR', alignment: AlignmentType.CENTER, bold: true })],
              shading: { fill: 'd3d3d3' },
              verticalAlign: VerticalAlign.CENTER,
            }),
            new TableCell({
              children: [new Paragraph({ text: 'RG', alignment: AlignmentType.CENTER, bold: true })],
              shading: { fill: 'd3d3d3' },
              verticalAlign: VerticalAlign.CENTER,
            }),
            new TableCell({
              children: [new Paragraph({ text: 'MILITAR', alignment: AlignmentType.CENTER, bold: true })],
              shading: { fill: 'd3d3d3' },
              verticalAlign: VerticalAlign.CENTER,
            }),
            new TableCell({
              children: [new Paragraph({ text: 'RG', alignment: AlignmentType.CENTER, bold: true })],
              shading: { fill: 'd3d3d3' },
              verticalAlign: VerticalAlign.CENTER,
            }),
          ],
        })
      );

      // Data rows
      permutasByFuncao[funcao].forEach((permuta) => {
        tableRows.push(
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    text: new Date(permuta.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                verticalAlign: VerticalAlign.CENTER,
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: formatMilitarString(permuta.militarEntra),
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                verticalAlign: VerticalAlign.CENTER,
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: formatRg(permuta.militarEntra.rg),
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                verticalAlign: VerticalAlign.CENTER,
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: formatMilitarString(permuta.militarSai),
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                verticalAlign: VerticalAlign.CENTER,
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: formatRg(permuta.militarSai.rg),
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                verticalAlign: VerticalAlign.CENTER,
              }),
            ],
          })
        );
      });

      docChildren.push(
        new Table({
          rows: tableRows,
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
        })
      );
    });

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 720,      // 1.27 cm (0.5 polegadas)
                right: 1440,   // 2.54 cm (1 polegada) - AUMENTADO
                bottom: 720,   // 1.27 cm (0.5 polegadas)
                left: 1440,    // 2.54 cm (1 polegada) - AUMENTADO
              },
            },
          },
          children: docChildren,
        },
      ],
      styles: {
        paragraphStyles: [
          {
            id: 'heading1',
            name: 'Heading 1',
            basedOn: 'Normal',
            next: 'Normal',
            run: {
              font: 'Arial',
              size: 24,
              bold: true,
            },
            paragraph: {
              alignment: AlignmentType.CENTER,
            },
          },
        ],
        default: {
          document: {
            run: {
              font: 'Arial',
              size: 24,
            },
          },
        },
      },
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `Escala_Permutas_${new Date().toISOString().split('T')[0]}.docx`;
    saveAs(blob, fileName);
  };

  const handleMarcarComoEnviadas = async () => {
    try {
      setMarcandoEnviadas(true);
      const permutaIds = permutas.map(p => p.id);
      await marcarPermutasComoEnviadas(permutaIds);
      setJaEnviadas(true);
      alert(`${permutas.length} permuta(s) marcada(s) como enviada(s) para a ajudância!`);
    } catch (error) {
      console.error('Erro ao marcar permutas como enviadas:', error);
      alert('Erro ao marcar permutas como enviadas. Tente novamente.');
    } finally {
      setMarcandoEnviadas(false);
    }
  };

  const today = new Date();
  const noteNumber = `149/${today.getFullYear()}`; // Example note number

  // Check if permutas is valid and not empty
  if (!permutas || permutas.length === 0) {
    return (
      <div className="bg-gray-200 min-h-screen p-8 pb-20">
        <div className="max-w-4xl mx-auto bg-white p-12 shadow-lg">
          <p className="text-center text-gray-600">Nenhuma permuta selecionada para gerar documento.</p>
          <div className="mt-8 flex justify-center">
            <button onClick={onBack} className="bg-gray-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-600 transition-colors">
              Voltar
            </button>
          </div>
        </div>
      </div>
      <Footer />
    );
  }

  // Debug: log permutas to check their structure
  console.log('Permutas recebidas:', permutas);
  console.log('Primeira permuta:', permutas[0]);

  // Group permutas by funcao
  const permutasByFuncao = permutas.reduce((acc, permuta) => {
    // Ensure funcao exists and is valid
    const funcao = permuta.funcao || "1º SOCORRO"; // Default to 1º SOCORRO if funcao is missing
    if (!acc[funcao]) {
      acc[funcao] = [];
    }
    acc[funcao].push(permuta);
    return acc;
  }, {} as Record<string, Permuta[]>);

  // Debug: log grouped permutas
  console.log('Permutas agrupadas por função:', permutasByFuncao);
  console.log('Funções encontradas:', Object.keys(permutasByFuncao));

  // Sort permutas within each function by date
  Object.keys(permutasByFuncao).forEach(funcao => {
    permutasByFuncao[funcao].sort((a, b) =>
      new Date(a.data).getTime() - new Date(b.data).getTime()
    );
  });

  // Define order of functions and get only the ones that have permutas
  const funcaoOrder: Funcao[] = ["1º SOCORRO", "2º SOCORRO", "BUSCA E SALVAMENTO"];
  const orderedFuncoes = Object.keys(permutasByFuncao).sort((a, b) => {
    const indexA = funcaoOrder.indexOf(a as Funcao);
    const indexB = funcaoOrder.indexOf(b as Funcao);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  console.log('Funções ordenadas para exibição:', orderedFuncoes);

  // If no functions were found, show error for debugging
  if (orderedFuncoes.length === 0) {
    console.error('Nenhuma função foi encontrada no agrupamento!');
    console.log('permutasByFuncao:', permutasByFuncao);
  }

  return (
    <div className="bg-gray-200 min-h-screen p-8 pb-20 print:p-0 print:bg-white">
      <div className="max-w-4xl mx-auto bg-white p-12 shadow-lg print:shadow-none" id="document-to-print">
        <div className="text-center font-serif text-black space-y-4 mb-10">
          <p className="text-lg font-bold">ESCALA DE SERVIÇO – COMANDANTE DE SOCORRO – ALTERAÇÃO – ANEXO XX – NOTA GOCG {noteNumber}</p>
        </div>

        {orderedFuncoes.length > 0 ? (
          orderedFuncoes.map((funcao, index) => (
            <div key={funcao} className={index > 0 ? 'mt-12' : ''}>
              <div className="text-center font-serif text-black mb-4">
                <p className="text-lg font-bold uppercase">{funcao}</p>
              </div>

              <table className="w-full border-collapse border border-black text-black">
                <thead>
                  <tr className="bg-gray-300">
                    <th colSpan={3} className="border border-black p-2 font-bold">ENTRA</th>
                    <th colSpan={2} className="border border-black p-2 font-bold">SAI</th>
                  </tr>
                  <tr className="bg-gray-300">
                    <th className="border border-black p-2 font-bold">DIA</th>
                    <th className="border border-black p-2 font-bold">MILITAR</th>
                    <th className="border border-black p-2 font-bold w-1/6">RG</th>
                    <th className="border border-black p-2 font-bold">MILITAR</th>
                    <th className="border border-black p-2 font-bold w-1/6">RG</th>
                  </tr>
                </thead>
                <tbody>
                  {permutasByFuncao[funcao] && permutasByFuncao[funcao].length > 0 ? (
                    permutasByFuncao[funcao].map((permuta) => (
                      <tr key={permuta.id}>
                        <td className="border border-black p-2 text-center">{new Date(permuta.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                        <td className="border border-black p-2 text-center">{formatMilitarString(permuta.militarEntra)}</td>
                        <td className="border border-black p-2 text-center">{formatRg(permuta.militarEntra.rg)}</td>
                        <td className="border border-black p-2 text-center">{formatMilitarString(permuta.militarSai)}</td>
                        <td className="border border-black p-2 text-center">{formatRg(permuta.militarSai.rg)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="border border-black p-2 text-center text-red-600">Erro: Nenhuma permuta encontrada para esta função</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <div className="text-center text-red-600 p-8">
            <p className="font-bold mb-2">Debug: Nenhuma função encontrada!</p>
            <p className="text-sm">Total de permutas: {permutas.length}</p>
            <p className="text-sm">Verifique o console do navegador (F12) para mais detalhes.</p>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto mt-8 flex justify-between items-center gap-4 print:hidden">
        <button onClick={onBack} className="bg-gray-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-600 transition-colors">
            Voltar
        </button>
        <div className="flex gap-4">
          <button
            onClick={handleMarcarComoEnviadas}
            disabled={marcandoEnviadas || jaEnviadas}
            className={`px-6 py-2 rounded-lg shadow-md transition-colors ${
              jaEnviadas
                ? 'bg-green-600 text-white cursor-not-allowed'
                : 'bg-yellow-600 text-white hover:bg-yellow-700'
            }`}
          >
            {jaEnviadas ? '✓ Marcadas como Enviadas' : marcandoEnviadas ? 'Marcando...' : 'Marcar como Enviadas'}
          </button>
          <button onClick={handleExportWord} className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors">
              Exportar Word
          </button>
          <button onClick={handlePrint} className="bg-brand-blue-dark text-white px-6 py-2 rounded-lg shadow-md hover:bg-brand-blue transition-colors">
              Imprimir / Salvar PDF
          </button>
        </div>
      </div>

      <Footer />

       <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #document-to-print, #document-to-print * {
              visibility: visible;
            }
            #document-to-print {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}</style>
    </div>
  );
};