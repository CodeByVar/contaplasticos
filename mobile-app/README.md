# 📱 App Móvil — PlastControl (Planta & Almacén)
**Responsable:** Persona 3 / C  
**Tecnología:** React Native (Expo) + TypeScript + Axios

---

## 📋 Plan de Trabajo para Persona 3 (2 Semanas)

### Semana 1: Pantallas Base y Flujos Clave
- **Día 1**: Setup del proyecto Expo y estructura de navegación (React Navigation).
- **Día 2**: Pantalla de Login conectando al endpoint de Persona 1 (`POST /api/auth/login`).
- **Día 3**: Pantalla de Consulta de Stock en Silos y Filtro de Resinas.
- **Día 4**: Pantalla de Registro de Entradas en Báscula (Almacén).
- **Día 5**: Pantalla de Solicitud de Materia Prima para Extrusión / Inyección.
- **Día 6-7**: Pantalla para Registro de Consumo y Mermas desde Planta.

### Semana 2: Pulido y Notificaciones
- **Día 8-9**: Pantalla de Alertas de Stock Crítico y Notificaciones Push.
- **Día 10**: Pruebas en emulador y dispositivo real (Expo Go).
- **Día 11-14**: Testing cruzado e integración completa con el Backend (Persona 1) y Web (Persona 2).

---

## 🚀 Cómo Iniciar la App Móvil

1. **Instalar dependencias**:
   ```bash
   cd mobile-app
   npm install
   ```

2. **Iniciar Expo**:
   ```bash
   npx expo start
   ```

3. **Probar en tu celular**:
   - Escanea el código QR con la app **Expo Go** (Android / iOS).
