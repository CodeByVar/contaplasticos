# 🏭 PlastControl — Sistema de Control de Materia Prima para Fábrica de Plásticos

Sistema integral de gestión de inventario de materias primas (resinas vírgenes, recuperadas, masterbatch y aditivos), balance de masa y reducción de merma (scrap) para plantas de extrusión, inyección y soplado.

---

## 👥 Estructura del Equipo y Responsabilidades (Plan de 2 Semanas)

| Rol | Responsable | Directorio | Tecnología | Alcance |
| :--- | :--- | :--- | :--- | :--- |
| **Persona 1 (Backend)** | Compañero A | `/backend` | NestJS + Prisma + PostgreSQL/MySQL | API REST, Autenticación JWT, Lógica de Merma, Cron de Alertas y Reportes PDF/Excel |
| **Persona 2 (Frontend Web)** | **Tú (Activo)** | `/frontend-web` | React + Vite + TailwindCSS + TypeScript | Landing Page, Dashboard, Catálogo de Silos, Gestión de Entradas, Balance de Merma |
| **Persona 3 (App Móvil)** | Compañero C | `/mobile-app` | React Native (Expo) + Axios | App móvil para registro en báscula, solicitud desde planta y consulta de silos |

---

## 📁 Estructura del Monorepo

```
SistemaContable/
├── README.md                      # Documentación maestra del proyecto
├── API.md                         # Contrato de endpoints API REST (para sincronización)
├── docker-compose.yml             # Base de datos PostgreSQL para desarrollo
├── .gitignore                     # Exclusiones de Git unificadas
│
├── frontend-web/                  # 🌟 Persona 2: Frontend Web (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/            # Hero, Features, InteractiveDemo, RoleSimulator, etc.
│   │   ├── data/                  # Datos mock de polímeros (HDPE, PP, LDPE)
│   │   ├── types/                 # Tipos TypeScript compartidos
│   │   ├── App.tsx
│   │   └── index.css
│   └── README.md
│
├── backend/                       # 🛠️ Persona 1: Backend API (NestJS + Prisma)
│   ├── prisma/schema.prisma       # Modelos de BD (MateriaPrima, Lote, Movimientos, Merma)
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
└── mobile-app/                    # 📱 Persona 3: App Móvil (Expo / React Native)
    ├── app.json
    ├── package.json
    └── README.md
```

---

## 🚀 Cómo Iniciar Cada Módulo

### 1. 🌐 Frontend Web (Persona 2)
```bash
cd frontend-web
npm install
npm run dev
```
Abre en tu navegador `http://localhost:5173`.

### 2. 🛠️ Backend API (Persona 1)
```bash
cd backend
npm install
# Iniciar BD con Docker:
docker compose up -d
# Migrar BD e iniciar NestJS:
npx prisma migrate dev --name init
npm run start:dev
```

### 3. 📱 App Móvil (Persona 3)
```bash
cd mobile-app
npm install
npx expo start
```

---

## 🔗 Contrato de Integración API

Consulta el archivo [`API.md`](./API.md) para ver los payloads, tipos y endpoints acordados entre Backend, Web y Móvil para avanzar en paralelo sin dependencias bloqueantes.

---

## 🤝 Flujo de Trabajo en GitHub para el Equipo

1. **Clonar el repositorio**:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd SistemaContable
   ```
2. **Crear una rama para tu feature**:
   ```bash
   git checkout -b feature/modulo-nombre
   ```
3. **Subir cambios y abrir Pull Request**:
   ```bash
   git add .
   git commit -m "feat: implementado modulo X"
   git push origin feature/modulo-nombre
   ```
