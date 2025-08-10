# � Test Documentation Generator

## 🎯 **¿Qué es?**

Un sistema automatizado que lee tus tests de Playwright y genera documentación profesional en formato BDD/Gherkin **sin modificar ni afectar la ejecución de tus tests**.

## ✨ **Características**

- 🔍 **Extrae automáticamente** escenarios BDD de comentarios en tests
- 📝 **Genera documentación** en formato Markdown profesional  
- 🚀 **No afecta la ejecución** de tests existentes
- ⚡ **Ejecutable a demanda** con comandos simples
- 🏗️ **Respeta principios SOLID** y buenas prácticas
- 📊 **Incluye estadísticas** y métricas de cobertura

## 🚀 **Uso Rápido**

```bash
# Generar toda la documentación
npm run generate-docs

# Generar por tipo específico
npm run generate-docs:validation
npm run generate-docs:rules  
npm run generate-docs:e2e
```

## 📁 **Archivos Generados**

El sistema crea documentación en `docs/test-scenarios/`:

```
docs/test-scenarios/
├── all-scenarios.md          # Todos los tests
├── validation-scenarios.md   # Tests de validación
├── rules-scenarios.md        # Tests de reglas de negocio
└── e2e-scenarios.md         # Tests End-to-End
```
- **📊 Estadísticas** de cobertura y completitud
- **🗂️ Organización** por tipos de test (validation, rules, e2e)
- **🎨 Documentación** profesional en Markdown
- **⚡ Ejecución independiente** - no afecta tests existentes

## 🏗️ Arquitectura SOLID

El sistema está diseñado siguiendo los principios SOLID:

- **SRP**: Cada clase tiene una responsabilidad única
- **OCP**: Extensible para nuevos formatos y extractores
- **LSP**: Interfaces intercambiables
- **ISP**: Interfaces segregadas por responsabilidad
- **DIP**: Depende de abstracciones, no de implementaciones

## 🚀 Uso

### Generar toda la documentación
```bash
npm run generate-docs
```

### Generar documentación específica
```bash
# Solo tests de validación
npm run generate-docs:validation

# Solo reglas de negocio
npm run generate-docs:rules

# Solo tests E2E
npm run generate-docs:e2e
```

### Uso programático
```typescript
import { TestDocumentationGenerator } from './src/documentation/generators/TestDocumentationGenerator';
import { DocumentationConfig } from './src/documentation/models/TestScenario';

const generator = new TestDocumentationGenerator();
const config = DocumentationConfig.createComplete();
generator.configure(config);

await generator.generateDocumentation('./tests', './docs/scenarios');
```

## 📁 Estructura Generada

```
docs/
├── test-scenarios/
│   ├── validation-scenarios.md    # Tests de validación
│   ├── rules-scenarios.md         # Reglas de negocio
│   ├── e2e-scenarios.md          # Tests end-to-end
│   └── all-scenarios.md          # Documentación completa
```

## 🔧 Configuración

### Configuración Básica
```typescript
const config = DocumentationConfig.createDefault();
```

### Configuración Completa
```typescript
const config = new DocumentationConfig(
  true,    // includeTimestamp
  true,    // includeTestMetadata
  true,    // includeCodeSnippets
  'both',  // outputFormat: 'markdown' | 'html' | 'both'
  './templates/custom.md', // templatePath (opcional)
  ['Test Coverage', 'Performance Notes'] // customSections
);
```

## 📝 Formato de Comentarios BDD

Para que el sistema extraiga correctamente los escenarios, usa este formato en tus tests:

```typescript
test("Verificar login exitoso", async ({ page }) => {
  /**
   * Dado que el usuario tiene credenciales válidas
   */
  const validCredentials = { user: "test@test.com", password: "123456" };

  /**
   * Cuando el usuario ingresa sus credenciales
   */
  await loginPage.fillCredentials(validCredentials);
  await loginPage.clickLogin();

  /**
   * Entonces debe acceder al dashboard exitosamente
   */
  await expect(page).toHaveURL("/dashboard");
  await expect(dashboardPage.welcomeMessage).toBeVisible();
});
```

## 🎨 Salida Generada

El sistema genera documentación como esta:

```markdown
# 📋 Documentación de Tests - automation_pacas_expert

## 📊 Resumen Ejecutivo
| Métrica | Valor |
|---------|--------|
| **Total de Tests** | 15 |
| **Escenarios Completos** | 12 |
| **Tasa de Completitud** | 80% |

## 🔍 Tests de Validación
- ✅ **Presencia de elementos en la página de registro** (register-validation.spec.ts)

## ⚖️ Tests de Reglas de Negocio
- ✅ **Verificar que el calendario muestre por defecto el año correcto** (register-rules.spec.ts)

## 📝 Escenarios Detallados

### 1. Verificar login exitoso
**Archivo:** `login-validation.spec.ts` | **Línea:** 15

\`\`\`gherkin
Feature: Validación de Login
  Scenario: Verificar login exitoso
    Given el usuario tiene credenciales válidas
    When el usuario ingresa sus credenciales
    Then debe acceder al dashboard exitosamente
\`\`\`
```

## 🔄 Extensibilidad

### Agregar nuevo formato de salida
```typescript
class PDFFormatter implements IFormatter {
  async format(scenarios: ITestScenario[]): Promise<string> {
    // Implementar generación de PDF
  }
  
  getFileExtension(): string {
    return '.pdf';
  }
}

// Usar
const generator = new TestDocumentationGenerator();
generator.setFormatter(new PDFFormatter());
```

### Agregar nuevo extractor
```typescript
class CustomExtractor implements IScenarioExtractor {
  async extractScenarios(filePath: string): Promise<ITestScenario[]> {
    // Implementar extracción personalizada
  }
  
  canProcess(filePath: string): boolean {
    return filePath.endsWith('.custom.ts');
  }
}
```

## 📈 Beneficios

1. **📖 Documentación siempre actualizada** - Se genera desde el código fuente
2. **🚀 Proceso automatizado** - Un comando genera toda la documentación
3. **🔍 Visibilidad de cobertura** - Identifica tests incompletos
4. **👥 Comunicación mejorada** - Formato legible para stakeholders
5. **🛠️ Mantenimiento reducido** - No hay documentación manual que mantener

## 🎯 Integración con CI/CD

Agrega a tu pipeline:

```yaml
- name: Generate Test Documentation
  run: |
    npm install
    npm run generate-docs
    
- name: Upload Documentation
  uses: actions/upload-artifact@v3
  with:
    name: test-documentation
    path: docs/
```

## 🤝 Contribuir

Para agregar nuevas funcionalidades:

1. Extiende las interfaces apropiadas (`IFormatter`, `IScenarioExtractor`)
2. Implementa la nueva funcionalidad
3. Agrega tests en `tests/documentation/`
4. Actualiza esta documentación

---

> 💡 **Tip**: Ejecuta `npm run generate-docs` después de agregar nuevos tests para mantener la documentación actualizada.
