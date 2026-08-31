import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  CheckCircle2, 
  Layers, 
  Scale, 
  Printer,
  FileText
} from 'lucide-react';
import { rawMaterialsApi, scrapApi, entriesApi } from '../services/api';
import type { RawMaterial, ScrapRecord, BatchEntry } from '../types';

export const ReportsView: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('Agosto 2026');
  const [reportType, setReportType] = useState<'balance' | 'scrap' | 'entries'>('balance');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [scrapList, setScrapList] = useState<ScrapRecord[]>([]);
  const [entriesList, setEntriesList] = useState<BatchEntry[]>([]);

  useEffect(() => {
    Promise.all([
      rawMaterialsApi.getAll(),
      scrapApi.getAll(),
      entriesApi.getAll()
    ]).then(([matRes, scrRes, entRes]) => {
      setMaterials(matRes.data);
      setScrapList(scrRes.data);
      setEntriesList(entRes.data);
    });
  }, []);

  const handleExport = (format: 'CSV' | 'PDF') => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      // Generar archivo CSV para descarga real en el navegador
      let csvContent = 'data:text/csv;charset=utf-8,';
      if (reportType === 'balance') {
        csvContent += 'Codigo,Materia Prima,Tipo,Silo,Stock Actual (kg),Minimo Alerta (kg),Estado\n';
        materials.forEach(m => {
          csvContent += `"${m.code}","${m.name}","${m.type}","${m.siloLocation}",${m.currentStockKg},${m.minStockKg},"${m.status}"\n`;
        });
      } else if (reportType === 'scrap') {
        csvContent += 'Orden,Linea,Materia Prima Usada (kg),Producto Conforme (kg),Scrap Molino (kg),Desecho (kg),% Merma,Causa\n';
        scrapList.forEach(s => {
          csvContent += `"${s.orderNumber}","${s.machineLine}",${s.rawMaterialUsedKg},${s.finishedProductKg},${s.recoverableScrapKg},${s.discardScrapKg},${s.scrapPercentage},"${s.cause}"\n`;
        });
      } else {
        csvContent += 'Codigo Entrada,Materia Prima,Proveedor,Lote,Factura,Silo Destino,Peso Neto (kg)\n';
        entriesList.forEach(e => {
          csvContent += `"${e.entryCode}","${e.materialName}","${e.supplierName}","${e.supplierBatch}","${e.invoiceNumber}","${e.siloDestination}",${e.quantityKg}\n`;
        });
      }
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `PlastControl_${reportType}_${selectedMonth.replace(' ', '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 600);
  };


  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <FileSpreadsheet className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Métricas & Cierres Contables</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white font-outfit">
            Reportes & Balance Mensual de Materia Prima
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Generación de balances de masa, auditoría de entradas en báscula, consumo en líneas y exportación a formatos estándar.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExport('CSV')}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generando Archivo...' : 'Exportar a CSV / Excel'}</span>
          </button>
        </div>
      </div>

      {/* Selector de Reporte */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setReportType('balance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              reportType === 'balance'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Balance de Silos & Stock
          </button>
          <button
            onClick={() => setReportType('scrap')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              reportType === 'scrap'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Análisis de Merma & Desperdicio
          </button>
          <button
            onClick={() => setReportType('entries')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              reportType === 'entries'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Historial de Recepciones
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
          >
            <option value="Agosto 2026">Agosto 2026 (Actual)</option>
            <option value="Julio 2026">Julio 2026</option>
            <option value="Junio 2026">Junio 2026</option>
          </select>
        </div>
      </div>

      {/* Report Table Preview */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-white text-base font-outfit">
              {reportType === 'balance' && 'Vista Previa: Balance Consolidado de Silos'}
              {reportType === 'scrap' && 'Vista Previa: Registro de Balance de Masa & Mermas'}
              {reportType === 'entries' && 'Vista Previa: Entradas de Materia Prima por Báscula'}
            </h3>
            <p className="text-xs text-slate-400">Período de auditoría: {selectedMonth}</p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-teal-400 font-bold">
            Auditoría PlastControl
          </span>
        </div>

        {reportType === 'balance' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[10px] uppercase font-bold text-slate-500 bg-slate-950">
                <tr>
                  <th className="py-2.5 px-3">Código</th>
                  <th className="py-2.5 px-3">Materia Prima</th>
                  <th className="py-2.5 px-3">Silo</th>
                  <th className="py-2.5 px-3 text-right">Stock Actual</th>
                  <th className="py-2.5 px-3 text-right">Stock Mínimo</th>
                  <th className="py-2.5 px-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {mockMaterials.map(m => (
                  <tr key={m.id} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-mono text-cyan-400">{m.code}</td>
                    <td className="py-2.5 px-3 font-bold text-white">{m.name}</td>
                    <td className="py-2.5 px-3 text-slate-400">{m.siloLocation}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-white">{m.currentStockKg.toLocaleString()} kg</td>
                    <td className="py-2.5 px-3 text-right text-slate-400">{m.minStockKg.toLocaleString()} kg</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.status === 'OPTIMO' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'scrap' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[10px] uppercase font-bold text-slate-500 bg-slate-950">
                <tr>
                  <th className="py-2.5 px-3">Orden</th>
                  <th className="py-2.5 px-3">Línea</th>
                  <th className="py-2.5 px-3 text-right">Alimentado (kg)</th>
                  <th className="py-2.5 px-3 text-right">Conforme (kg)</th>
                  <th className="py-2.5 px-3 text-right">Scrap Molino (kg)</th>
                  <th className="py-2.5 px-3 text-right">% Merma</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {mockScrap.map(s => (
                  <tr key={s.id} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-mono text-amber-400 font-bold">{s.orderNumber}</td>
                    <td className="py-2.5 px-3 text-white">{s.machineLine}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-white">{s.rawMaterialUsedKg.toLocaleString()} kg</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400">{s.finishedProductKg.toLocaleString()} kg</td>
                    <td className="py-2.5 px-3 text-right text-cyan-400">+{s.recoverableScrapKg.toLocaleString()} kg</td>
                    <td className="py-2.5 px-3 text-right font-bold text-amber-400">{s.scrapPercentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'entries' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[10px] uppercase font-bold text-slate-500 bg-slate-950">
                <tr>
                  <th className="py-2.5 px-3">Código</th>
                  <th className="py-2.5 px-3">Materia Prima</th>
                  <th className="py-2.5 px-3">Proveedor</th>
                  <th className="py-2.5 px-3">Lote Fabricante</th>
                  <th className="py-2.5 px-3 text-right">Cantidad (kg)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {mockEntries.map(e => (
                  <tr key={e.id} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-mono text-cyan-400">{e.entryCode}</td>
                    <td className="py-2.5 px-3 font-bold text-white">{e.materialName}</td>
                    <td className="py-2.5 px-3 text-slate-300">{e.supplierName}</td>
                    <td className="py-2.5 px-3 font-mono text-purple-300">{e.supplierBatch}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-400">+{e.quantityKg.toLocaleString()} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
