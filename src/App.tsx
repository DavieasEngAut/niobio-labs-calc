import { useState, useRef } from 'react';
import { calculateWireGauge, type CalculationInput, type CalculationResult } from './electricalCalculations';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function App() {
  const [inputs, setInputs] = useState<CalculationInput & { cliente: string; obra: string }>({
    voltage: 220,
    current: 0,
    distance: 0,
    allowedDropPercentage: 4,
    cliente: '',
    obra: ''
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleCalculate = () => {
    setResult(calculateWireGauge(inputs));
  };

  const downloadPDF = async () => {
    try {
      if (!reportRef.current) return;

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: "#111827",
        onclone: (clonedDoc) => {
          const elements = clonedDoc.querySelectorAll('*');
          elements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            const style = window.getComputedStyle(el);
            if (style.color.includes('okl')) htmlEl.style.color = "#ffffff";
            if (style.backgroundColor.includes('okl')) htmlEl.style.backgroundColor = "#1f2937";
            if (style.borderColor.includes('okl')) htmlEl.style.borderColor = "#3b82f6";
          });
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();

      // CABEÇALHO DO RELATÓRIO
      pdf.setFontSize(18);
      pdf.setTextColor(59, 130, 246);
      pdf.text("NIOBIO LABS - MEMORIAL DE CÁLCULO", 105, 20, { align: 'center' });
      
      pdf.setFontSize(11);
      pdf.setTextColor(100);
      pdf.text(`Cliente: ${inputs.cliente || '---'}`, 20, 35);
      pdf.text(`Obra: ${inputs.obra || '---'}`, 20, 42);
      pdf.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 49);

      // PARÂMETROS TÉCNICOS NO TOPO
      pdf.setFontSize(10);
      pdf.setTextColor(150);
      pdf.text(`Tensão: ${inputs.voltage}V | Corrente: ${inputs.current}A | Distância: ${inputs.distance}m`, 20, 58);

      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * (pdfWidth - 40)) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 20, 65, pdfWidth - 40, imgHeight);

      pdf.save(`Relatorio_NiobioLabs_${inputs.cliente || 'Tecnico'}.pdf`);
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar PDF. Verifique o console.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-800">
        
        <div className="bg-blue-600 p-6 text-center">
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">Niobio Labs</h1>
          <p className="text-blue-100 text-sm font-medium uppercase tracking-widest">Cálculo de Engenharia</p>
        </div>

        <div className="p-8 space-y-6">
          {/* Dados do Cliente */}
          <div className="grid grid-cols-1 gap-4">
            <input 
              type="text" placeholder="Nome do Cliente"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setInputs({...inputs, cliente: e.target.value})}
            />
            <input 
              type="text" placeholder="Local da Obra"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setInputs({...inputs, obra: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase italic">Tensão (V)</label>
              <select 
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={inputs.voltage}
                onChange={(e) => setInputs({...inputs, voltage: Number(e.target.value)})}
              >
                <option value={127}>127 V</option>
                <option value={220}>220 V</option>
                <option value={380}>380 V</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase italic">Queda Máx (%)</label>
              <input 
                type="number" value={inputs.allowedDropPercentage}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setInputs({...inputs, allowedDropPercentage: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase italic">Corrente (A)</label>
              <input 
                type="number" placeholder="Ex: 30"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setInputs({...inputs, current: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase italic">Distância (m)</label>
              <input 
                type="number" placeholder="Ex: 50"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setInputs({...inputs, distance: Number(e.target.value)})}
              />
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg uppercase tracking-widest"
          >
            Calcular e Gerar
          </button>

          {result && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              {/* ÁREA DE RESULTADO COMPLETA */}
              <div ref={reportRef} className={`p-6 rounded-2xl border-2 ${result.isFeasible ? 'bg-green-900/10 border-green-500/30' : 'bg-red-900/10 border-red-500/30'}`}>
                <div className="mb-4 border-b border-gray-800 pb-2">
                   <span className="text-[10px] font-bold uppercase text-gray-500 tracking-tighter">Bitola Sugerida:</span>
                   <div className="flex items-baseline gap-2">
                      <span className={`text-5xl font-black ${result.isFeasible ? 'text-green-400' : 'text-red-400'}`}>
                        {result.suggestedGauge.toFixed(1).replace('.', ',')}
                      </span>
                      <span className="text-xl font-bold text-gray-500">mm²</span>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                  <div>
                    <p className="text-[9px] font-bold text-gray-500 uppercase italic">Queda Real</p>
                    <p className="font-mono font-bold text-green-400">{result.actualDropPercentage}%</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-500 uppercase italic">Perda de Tensão</p>
                    <p className="font-mono font-bold text-green-400">{result.actualDropVolts} V</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-500 uppercase italic">Seção Exata</p>
                    <p className="font-mono text-xs text-gray-400">{result.calculatedMinSection} mm²</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-500 uppercase italic">Tensão Calc.</p>
                    <p className="font-mono text-xs text-gray-400">{inputs.voltage} V</p>
                  </div>
                </div>
              </div>

              <button
                onClick={downloadPDF}
                className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl border border-gray-700 transition-all text-xs uppercase"
              >
                📥 Baixar Memorial Completo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}