# Instrucciones de Uso - Test Runner

## 🚀 Inicio Rápido

### 1. Compilar TypeScript
```bash
cd src/test-runner
npm run build
```

### 2. Iniciar el Servidor
```bash
# Opción 1: Usando Node.js directamente
node dist/server.js

# Opción 2: Especificar workspace y puerto
node dist/server.js "C:\Users\reyss\Videos\playwritgh\automation_pacas_expert" 3000

# Opción 3: Usar el script de inicio
node start.js
```

### 3. Abrir la Interfaz
Abrir el navegador en: `http://localhost:3000`

## 📁 Estructura Actual

### ✅ **Implementado**
- ✅ **Servidor HTTP**: Node.js nativo sin dependencias externas
- ✅ **Interfaz Web**: HTML5 + CSS + JavaScript profesional
- ✅ **Descubrimiento de Tests**: Detecta automáticamente archivos `.spec.ts`
- ✅ **Agrupación**: Organiza por E2E, Rules, Validation
- ✅ **API REST**: Endpoints para obtener y refrescar tests
- ✅ **Diseño Professional**: Poppins + Material Icons
- ✅ **Responsive**: Funciona en desktop y móvil

### 🔄 **En Desarrollo**
- 🔄 **Ejecución de Tests**: Actualmente simula ejecución
- 🔄 **WebSocket**: Usando polling por ahora
- 🔄 **Resultados en Tiempo Real**: Próximamente

## 🎯 **Funcionalidades Actuales**

### **Panel Principal**
- ✅ Lista todos los tests encontrados
- ✅ Agrupación por tipos (E2E, Rules, Validation)
- ✅ Búsqueda y filtros
- ✅ Selección múltiple
- ✅ Configuración de navegador y workers

### **API Disponible**
- `GET /api/test-groups` - Obtener todos los grupos de tests
- `POST /api/refresh-tests` - Refrescar lista de tests
- Próximamente: `POST /api/execute-tests`

### **Interfaz Visual**
- ✅ Diseño profesional sin emojis
- ✅ Material Icons consistentes
- ✅ Fuente Poppins
- ✅ Notificaciones del sistema
- ✅ Modo responsivo

## 🛠️ **Desarrollo y Testing**

### **Compilación**
```bash
# Compilar una vez
npm run build

# Compilar y watch
npm run watch
```

### **Estructura de Archivos**
```
src/test-runner/
├── server.ts              # Servidor principal
├── start.js               # Script de inicio
├── interfaces/            # Contratos TypeScript
├── models/               # Modelos de datos
├── services/             # Lógica de negocio
└── web/                  # Frontend
    ├── index.html        # Interfaz principal
    ├── styles/main.css   # Estilos profesionales
    └── scripts/          # JavaScript
```

## 🌐 **API Endpoints**

### **GET /api/test-groups**
Devuelve todos los grupos de tests encontrados:
```json
[
  {
    "type": "e2e",
    "displayName": "E2E Tests",
    "icon": "integration_instructions",
    "totalTests": 5,
    "files": [...]
  }
]
```

### **POST /api/refresh-tests**
Refresca la lista de tests y devuelve los grupos actualizados.

## 🎨 **Características de Diseño**

- **Tipografía**: Google Fonts Poppins
- **Iconos**: Material Icons (sin emojis)
- **Colores**: Paleta azul/gris profesional
- **Layout**: CSS Grid + Flexbox
- **Responsive**: Mobile-first design

## ⚡ **Performance**

- **Sin dependencias externas**: Solo Node.js nativo
- **Lazy loading**: Carga eficiente de tests
- **Polling optimizado**: Actualización cada 5 segundos
- **Cache inteligente**: Evita recarga innecesaria

## 🔧 **Próximas Implementaciones**

1. **Ejecución Real de Tests**
   - Integración con Playwright CLI
   - Progreso en tiempo real
   - Logs detallados

2. **WebSocket Completo**
   - Comunicación bidireccional
   - Eventos en tiempo real
   - Mejor experiencia de usuario

3. **Resultados Avanzados**
   - Screenshots automáticos
   - Reportes detallados
   - Métricas de performance

4. **Configuración Avanzada**
   - Perfiles de ejecución
   - Variables de entorno
   - Configuración por proyecto

## 🐛 **Troubleshooting**

### **Error: Cannot find module**
```bash
# Instalar dependencias de desarrollo
npm install
```

### **Puerto ya en uso**
```bash
# Usar puerto diferente
node dist/server.js . 8080
```

### **Tests no aparecen**
- Verificar que existan archivos `.spec.ts` en `tests/`
- Usar el botón "Refrescar" en la interfaz
- Revisar la consola del navegador

## 📞 **Soporte**

El test runner está en desarrollo activo. Las funcionalidades básicas están implementadas y la ejecución de tests se agregará en la próxima iteración.

**Estado Actual**: ✅ **Funcional para visualización y gestión de tests**
**Próximo**: 🔄 **Ejecución completa de tests con Playwright**
