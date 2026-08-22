import React, { useState, useEffect } from 'react';
import { 
  TrendingDown, 
  Scale, 
  PlusCircle, 
  RotateCcw, 
  AlertTriangle, 
  PieChart, 
  CheckCircle2, 
  Flame, 
  Recycle,
  Sparkles
} from 'lucide-react';
import { scrapApi, rawMaterialsApi } from '../services/api';
import type { ScrapRecord, RawMaterial } from '../types';

export const ScrapControlView: React.FC = () => {
  const [scrapList, setScrapList] = useState<ScrapRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Form State
  const [calcUsed, setCalcUsed] = useState<number>(1000);
  const [calcGood, setCalcGood] = useState<number>(930);
  const [calcRecoverable, setCalcRecoverable] = useState<number>(50);
  const [calcDiscard, setCalcDiscard] = useState<number>(20);
  const [calcCause, setCalcCause] = useState<string>('Calibración y purga de cambio de color');
  const [calcLine, setCalcLine] = useState<string>('Línea de Extrusión 02');
  const [calcOrder, setCalcOrder] = useState<string>('OP-2026-440');

  const loadData = async () => {
    setIsLoading(true);
    const res = await scrapApi.getAll();
    setScrapList(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalUsed = scrapList.reduce((acc, s) => acc + s.rawMaterialUsedKg, 0);
  const totalGood = scrapList.reduce((acc, s) => acc + s.finishedProductKg, 0);
  const totalRecoverable = scrapList.reduce((acc, s) => acc + s.recoverableScrapKg, 0);
  const totalDiscard = scrapList.reduce((acc, s) => acc + s.discardScrapKg, 0);
  const avgScrapPct = totalUsed > 0 ? (((totalUsed - totalGood) / totalUsed) * 100).toFixed(2) : '0';

  const handleAddScrap = async (e: React.FormEvent) => {
    e.preventDefault();
    await scrapApi.create({
      productionOrderId: calcOrder,
      consumedRawMaterialKg: Number(calcUsed),
      producedGoodKg: Number(calcGood),
      scrapRecoverableKg: Number(calcRecoverable),
      scrapDiscardKg: Number(calcDiscard),
      cause: calcCause,
      machineLine: calcLine
    });
    loadData();
  };

  const currentScrapPct = calcUsed > 0 
    ? (((calcUsed - calcGood) / calcUsed) * 100).toFixed(2)
    : '0';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Scale className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Eficiencia & Balance</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white font-outfit">
            Control de Merma (Scrap) & Balance de Masas
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Ecuación de balance: Materia Prima Alimentada = Producto Bueno + Scrap Recuperable (Molino) + Purga / Desecho.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400">Total Alimentado</span>
            <div className="text-xl font-extrabold text-white mt-0.5">{totalUsed.toLocaleString()} kg</div>
            <span className="text-[10px] text-slate-500">Materia prima procesada</span>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Scale className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400">Producto Conforme</span>
            <div className="text-xl font-extrabold text-emerald-400 mt-0.5">{totalGood.toLocaleString()} kg</div>
            <span className="text-[10px] text-emerald-400/80 font-medium">
              {totalUsed > 0 ? ((totalGood / totalUsed) * 100).toFixed(1) : 0}% rendimiento
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400">Scrap para Molino</span>
            <div className="text-xl font-extrabold text-cyan-400 mt-0.5">+{totalRecoverable.toLocaleString()} kg</div>
            <span className="text-[10px] text-cyan-400/80 font-medium">Reincorporado a tolva</span>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Recycle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400">Desecho Purga Contaminada</span>
            <div className="text-xl font-extrabold text-rose-400 mt-0.5">{totalDiscard.toLocaleString()} kg</div>
            <span className="text-[10px] text-rose-400/80 font-medium">{avgScrapPct}% merma promedio</span>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Flame className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Calculator & History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Formulario Calculador */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            Registro de Balance de Producción
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Ingresa los pesajes al cierre del lote o turno de extrusión / inyección.
          </p>

          <form onSubmit={handleAddScrap} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Orden de Producción</label>
                <input
                  type="text"
                  required
                  value={calcOrder}
                  onChange={(e) => setCalcOrder(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Línea de Proceso</label>
                <input
                  type="text"
                  required
                  value={calcLine}
                  onChange={(e) => setCalcLine(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-cyan-400 mb-1">
                1. Materia Prima Alimentada a Tolva (kg)
              </label>
              <input
                type="number"
                required
                value={calcUsed}
                onChange={(e) => setCalcUsed(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-cyan-500/50 text-white font-bold"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-emerald-400 mb-1">
                  2. Prod. Conforme (kg)
                </label>
                <input
                  type="number"
                  required
                  value={calcGood}
                  onChange={(e) => setCalcGood(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-cyan-400 mb-1">
                  3. Scrap Molible (kg)
                </label>
                <input
                  type="number"
                  required
                  value={calcRecoverable}
                  onChange={(e) => setCalcRecoverable(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-rose-400 mb-1">
                  4. Purga Desecho (kg)
                </label>
                <input
                  type="number"
                  required
                  value={calcDiscard}
                  onChange={(e) => setCalcDiscard(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Causa Principal de la Merma</label>
              <input
                type="text"
                required
                value={calcCause}
                onChange={(e) => setCalcCause(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            {/* Live Calculation Box */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Indicador de Merma:</span>
                <span className="text-xs text-slate-300">Merma no aprovechable + scrap</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-amber-400">{currentScrapPct}%</span>
                <span className="text-[10px] text-slate-400 block">
                  ({(calcUsed - calcGood)} kg merma)
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
            >
              Registrar Balance & Actualizar Stock Recuperado
            </button>
          </form>
        </div>

        {/* Historial de Mermas */}
        <div className="lg:col-span-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-amber-400" />
            Historial de Cierres de Lote & Merma
          </h3>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {scrapList.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-amber-400">{s.orderNumber}</span>
                    <span className="text-[10px] text-slate-500">{s.createdAt}</span>
                  </div>
                  <div className="text-white font-semibold text-sm mb-1">{s.machineLine}</div>
                  <p className="text-xs text-slate-400 mb-2">Causa: <span className="text-slate-200">{s.cause}</span></p>

                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-center">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Alimentado</span>
                      <strong className="text-white">{s.rawMaterialUsedKg} kg</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Molino (+Stock)</span>
                      <strong className="text-cyan-400">+{s.recoverableScrapKg} kg</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">% Merma</span>
                      <strong className="text-amber-400">{s.scrapPercentage}%</strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
