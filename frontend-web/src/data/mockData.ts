import type { RawMaterial, BatchEntry, ProductionRequest, ScrapRecord, StockAlert, UserProfile } from '../types';

export const mockMaterials: RawMaterial[] = [
  {
    id: 'mat-001',
    code: 'HDPE-5502',
    name: 'Polietileno de Alta Densidad (HDPE)',
    type: 'RESINA',
    category: 'SOPLADO',
    density: 0.955,
    meltFlowIndex: 0.35,
    unit: 'KG',
    currentStockKg: 18450,
    minStockKg: 6000,
    maxCapacityKg: 25000,
    siloLocation: 'Silo A-01 (Exterior)',
    status: 'OPTIMO',
    colorCode: '#06b6d4',
    supplier: 'Braskem Química',
    lastUpdated: 'Hace 10 min',
  },
  {
    id: 'mat-002',
    code: 'PP-CP-0330',
    name: 'Polipropileno Copolímero (PP-CP)',
    type: 'RESINA',
    category: 'INYECCION',
    density: 0.905,
    meltFlowIndex: 30.0,
    unit: 'KG',
    currentStockKg: 3200,
    minStockKg: 5000,
    maxCapacityKg: 20000,
    siloLocation: 'Silo B-02 (Planta 1)',
    status: 'BAJO',
    colorCode: '#f59e0b',
    supplier: 'Petroquímica Andina',
    lastUpdated: 'Hace 25 min',
  },
  {
    id: 'mat-003',
    code: 'LDPE-FILM-2100',
    name: 'Polietileno de Baja Densidad (LDPE Film)',
    type: 'RESINA',
    category: 'EXTRUSION',
    density: 0.922,
    meltFlowIndex: 2.0,
    unit: 'KG',
    currentStockKg: 1500,
    minStockKg: 4000,
    maxCapacityKg: 18000,
    siloLocation: 'Silo C-01 (Nave Extrusión)',
    status: 'CRITICO',
    colorCode: '#ef4444',
    supplier: 'Dow Chemical',
    lastUpdated: 'Hace 5 min',
  },
  {
    id: 'mat-004',
    code: 'MB-AZUL-08',
    name: 'Masterbatch Concentrado Azul Cobalto',
    type: 'MASTERBATCH',
    category: 'INYECCION',
    density: 1.12,
    meltFlowIndex: 12.0,
    unit: 'KG',
    currentStockKg: 850,
    minStockKg: 300,
    maxCapacityKg: 2000,
    siloLocation: 'Almacén Seco R-04',
    status: 'OPTIMO',
    colorCode: '#3b82f6',
    supplier: 'Clariant Pigmentos',
    lastUpdated: 'Hace 2 horas',
  },
  {
    id: 'mat-005',
    code: 'REC-HDPE-MOL',
    name: 'Material Recuperado HDPE (Molido / Peletizado)',
    type: 'RECUPERADO',
    category: 'EXTRUSION',
    density: 0.950,
    meltFlowIndex: 0.45,
    unit: 'KG',
    currentStockKg: 5400,
    minStockKg: 2000,
    maxCapacityKg: 10000,
    siloLocation: 'Tolva Reciclaje R-01',
    status: 'OPTIMO',
    colorCode: '#10b981',
    supplier: 'Circuito Interno de Molino',
    lastUpdated: 'Hace 45 min',
  },
  {
    id: 'mat-006',
    code: 'AD-CACO3-80',
    name: 'Carga Mineral Carbonato de Calcio (CaCO3 80%)',
    type: 'ADITIVO',
    category: 'EXTRUSION',
    density: 1.70,
    meltFlowIndex: 1.5,
    unit: 'KG',
    currentStockKg: 4200,
    minStockKg: 1500,
    maxCapacityKg: 8000,
    siloLocation: 'Almacén Tolvas B-03',
    status: 'OPTIMO',
    colorCode: '#a855f7',
    supplier: 'Omya Minerales',
    lastUpdated: 'Ayer',
  }
];

export const mockEntries: BatchEntry[] = [
  {
    id: 'ent-01',
    entryCode: 'ENT-2026-089',
    materialId: 'mat-001',
    materialName: 'Polietileno de Alta Densidad (HDPE)',
    supplierName: 'Braskem Química',
    supplierBatch: 'BRK-8921-X',
    quantityKg: 8000,
    invoiceNumber: 'F001-92384',
    siloDestination: 'Silo A-01',
    qualityCertificatePassed: true,
    receivedBy: 'Rodrigo Alarcón (Almacén)',
    createdAt: 'Hoy, 09:15 AM'
  },
  {
    id: 'ent-02',
    entryCode: 'ENT-2026-088',
    materialId: 'mat-004',
    materialName: 'Masterbatch Azul Cobalto',
    supplierName: 'Clariant Pigmentos',
    supplierBatch: 'CLR-AZ-4410',
    quantityKg: 500,
    invoiceNumber: 'F002-11029',
    siloDestination: 'Almacén Seco R-04',
    qualityCertificatePassed: true,
    receivedBy: 'Rodrigo Alarcón (Almacén)',
    createdAt: 'Ayer, 04:30 PM'
  }
];

export const mockRequests: ProductionRequest[] = [
  {
    id: 'req-01',
    orderNumber: 'OP-EXT-402',
    line: 'Línea de Extrusión 03',
    processType: 'EXTRUSION',
    productName: 'Rollo Film Termocontraíble 50um',
    requiredMaterials: [
      { materialName: 'LDPE Film 2100', quantityKg: 800 },
      { materialName: 'Recuperado HDPE', quantityKg: 200 }
    ],
    requestedBy: 'Ing. Marcos Vedia (Producción)',
    status: 'PENDIENTE',
    createdAt: 'Hace 20 min'
  },
  {
    id: 'req-02',
    orderNumber: 'OP-INJ-115',
    line: 'Inyectora Negri Bossi 320T',
    processType: 'INYECCION',
    productName: 'Tapa Rosca 28mm PCO1881',
    requiredMaterials: [
      { materialName: 'PP Copolímero 0330', quantityKg: 1200 },
      { materialName: 'Masterbatch Azul Cobalto', quantityKg: 24 }
    ],
    requestedBy: 'Ing. Marcos Vedia (Producción)',
    status: 'APROBADA',
    createdAt: 'Hace 2 horas'
  }
];

export const mockScrap: ScrapRecord[] = [
  {
    id: 'scr-01',
    orderNumber: 'OP-EXT-399',
    machineLine: 'Extrusora Coex 3 Capas',
    rawMaterialUsedKg: 1250,
    finishedProductKg: 1180,
    recoverableScrapKg: 55,
    discardScrapKg: 15,
    scrapPercentage: 5.6,
    cause: 'Calibración de espesor de arranque',
    operator: 'Jorge Soliz',
    createdAt: 'Hoy, 11:00 AM'
  },
  {
    id: 'scr-02',
    orderNumber: 'OP-INJ-112',
    machineLine: 'Inyectora 320T',
    rawMaterialUsedKg: 900,
    finishedProductKg: 875,
    recoverableScrapKg: 20,
    discardScrapKg: 5,
    scrapPercentage: 2.7,
    cause: 'Coladas y bebederos de molde',
    operator: 'Daniel Vargas',
    createdAt: 'Ayer, 06:10 PM'
  }
];

export const mockAlerts: StockAlert[] = [
  {
    id: 'alt-01',
    materialName: 'Polietileno de Baja Densidad (LDPE Film)',
    silo: 'Silo C-01 (Nave Extrusión)',
    currentKg: 1500,
    minKg: 4000,
    severity: 'CRITICAL',
    timestamp: 'Hace 15 min'
  },
  {
    id: 'alt-02',
    materialName: 'Polipropileno Copolímero (PP-CP)',
    silo: 'Silo B-02 (Planta 1)',
    currentKg: 3200,
    minKg: 5000,
    severity: 'WARNING',
    timestamp: 'Hace 45 min'
  }
];

export const mockUsers: UserProfile[] = [
  {
    id: 'u-01',
    name: 'Carlos Mendoza',
    email: 'admin@plastcontrol.com',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    shift: 'General / 24h'
  },
  {
    id: 'u-02',
    name: 'Rodrigo Alarcón',
    email: 'almacen@plastcontrol.com',
    role: 'ALMACEN',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    shift: 'Turno Mañana (07:00 - 15:00)'
  },
  {
    id: 'u-03',
    name: 'Ing. Marcos Vedia',
    email: 'produccion@plastcontrol.com',
    role: 'PRODUCCION',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    shift: 'Turno Rotativo Planta'
  }
];
