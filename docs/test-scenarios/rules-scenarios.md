# 📋 Documentación de Tests - automation_pacas_expert

**Versión:** 1.0.0  
**Generado:** 10 de agosto de 2025, 10:31

---

## 📑 Tabla de Contenidos
- [Resumen Ejecutivo](#resumen-ejecutivo)
- [Escenarios por Tipo](#escenarios-por-tipo)
  - [Tests de Reglas de Negocio](#tests-de-reglas-de-negocio)
- [Escenarios Detallados](#escenarios-detallados)

## 📊 Resumen Ejecutivo
| Métrica | Valor |
|---------|--------|
| **Total de Tests** | 14 |
| **Escenarios Completos** | 14 |
| **Tasa de Completitud** | 100% |
| **Tests de Reglas de Negocio** | 14 tests |

## 🗂️ Escenarios por Tipo
### ⚖️ Tests de Reglas de Negocio
**Total de tests:** 14

- ✅ **Verificar que el botón de iniciar sesión esté habilitado al ingresar un número de celular válido** (_login-rules.spec.ts_)
- ✅ **Verificar que al ingresar un número de celular que inicie con un dígito distinto de 9, el botón de iniciar sesión esté deshabilitado y se muestre un mensaje de error** (_login-rules.spec.ts_)
- ✅ **Verificar que al ingresar un número de celular que no cumple con la longitud mínima, se muestre un mensaje de error** (_login-rules.spec.ts_)
- ✅ **Verificar que al ingresar letras en el campo de número de celular, se ignoren** (_login-rules.spec.ts_)
- ✅ **Verificar que al ingresar un número de celular que contenga letras, las letras sean ignoradas** (_login-rules.spec.ts_)
- ✅ **Verificar que al ingresar caracteres especiales en el campo de número de celular, se ignoren** (_login-rules.spec.ts_)
- ✅ **Verificar que al ingresar un número de celular que no cumple con el formato y borrar la entrada, se muestre un mensaje de error** (_login-rules.spec.ts_)
- ✅ **Verificar que al hacer clic en el link cambiaste el número de celular, se muestre el popup: Te ayudaremos** (_login-rules.spec.ts_)
- ✅ **Verificar que el calendario muestre por defecto el año y mes correcto para mayoría de edad** (_register-rules.spec.ts_)
- ✅ **Verificar que no se pueden navegar a meses futuros que harían que el usuario tenga menos de 18 años** (_register-rules.spec.ts_)
- ✅ **Verificar que se puede seleccionar una fecha válida que hace que el usuario tenga más de 18 años** (_register-rules.spec.ts_)
- ✅ **Verificar que no se puede seleccionar fecha que hace que el usuario tenga exactamente 17 años, 11 meses y 29 días** (_register-rules.spec.ts_)
- ✅ **Verificar que se puede navegar entre meses usando las flechas del calendario** (_register-rules.spec.ts_)
- ✅ **Verificar que se puede cerrar el calendario sin seleccionar una fecha** (_register-rules.spec.ts_)

## 📝 Escenarios Detallados
### ⚖️ Tests de Reglas de Negocio
#### 1. Verificar que el botón de iniciar sesión esté habilitado al ingresar un número de celular válido
**Archivo:** `login-rules.spec.ts` | **Línea:** 56
```gherkin
Feature: Reglas de negocio de la página de login

  Scenario: Verificar que el botón de iniciar sesión esté habilitado al ingresar un número de celular válido
    Given el usuario se encuentra en la página de login
    When el usuario ingresa un número de celular válido
    Then el botón de iniciar sesión debe estar habilitado
```
---
#### 2. Verificar que al ingresar un número de celular que inicie con un dígito distinto de 9, el botón de iniciar sesión esté deshabilitado y se muestre un mensaje de error
**Archivo:** `login-rules.spec.ts` | **Línea:** 111
```gherkin
Feature: Reglas de negocio de la página de login

  Scenario: Verificar que al ingresar un número de celular que inicie con un dígito distinto de 9, el botón de iniciar sesión esté deshabilitado y se muestre un mensaje de error
    Given el usuario se encuentra en la página de login
    When el usuario ingresa un número de celular que inicia con un dígito distinto de 9
    Then el mensaje de error general del teléfono debe estar visible.
```
---
#### 3. Verificar que al ingresar un número de celular que no cumple con la longitud mínima, se muestre un mensaje de error
**Archivo:** `login-rules.spec.ts` | **Línea:** 142
```gherkin
Feature: Reglas de negocio de la página de login

  Scenario: Verificar que al ingresar un número de celular que no cumple con la longitud mínima, se muestre un mensaje de error
    Given el usuario se encuentra en la página de login
    When el usuario ingresa un número de celular que no cumple con la longitud mínima
    Then el mensaje de error general del teléfono debe estar visible.
```
---
#### 4. Verificar que al ingresar letras en el campo de número de celular, se ignoren
**Archivo:** `login-rules.spec.ts` | **Línea:** 173
```gherkin
Feature: Reglas de negocio de la página de login

  Scenario: Verificar que al ingresar letras en el campo de número de celular, se ignoren
    Given el usuario se encuentra en la página de login
    When el usuario ingresa letras en el campo de número de celular
    Then el valor del campo de número de celular debe ser vacío
```
---
#### 5. Verificar que al ingresar un número de celular que contenga letras, las letras sean ignoradas
**Archivo:** `login-rules.spec.ts` | **Línea:** 200
```gherkin
Feature: Reglas de negocio de la página de login

  Scenario: Verificar que al ingresar un número de celular que contenga letras, las letras sean ignoradas
    Given el usuario se encuentra en la página de login
    When el usuario ingresa un número de celular que contiene letras
    Then el valor del campo de número de celular debe ser solo numérico
```
---
#### 6. Verificar que al ingresar caracteres especiales en el campo de número de celular, se ignoren
**Archivo:** `login-rules.spec.ts` | **Línea:** 224
```gherkin
Feature: Reglas de negocio de la página de login

  Scenario: Verificar que al ingresar caracteres especiales en el campo de número de celular, se ignoren
    Given el usuario se encuentra en la página de login
    When el usuario ingresa caracteres especiales en el campo de número de celular
    Then el valor del campo de número de celular debe ser solo numérico
```
---
#### 7. Verificar que al ingresar un número de celular que no cumple con el formato y borrar la entrada, se muestre un mensaje de error
**Archivo:** `login-rules.spec.ts` | **Línea:** 248
```gherkin
Feature: Reglas de negocio de la página de login

  Scenario: Verificar que al ingresar un número de celular que no cumple con el formato y borrar la entrada, se muestre un mensaje de error
    Given el usuario se encuentra en la página de login
    When el usuario ingresa un número de celular que no cumple con el formato
    Then el mensaje de error de formato debe estar visible.
```
---
#### 8. Verificar que al hacer clic en el link cambiaste el número de celular, se muestre el popup: Te ayudaremos
**Archivo:** `login-rules.spec.ts` | **Línea:** 294
```gherkin
Feature: Reglas de negocio de la página de login

  Scenario: Verificar que al hacer clic en el link cambiaste el número de celular, se muestre el popup: Te ayudaremos
    Given el usuario se encuentra en la página de login
    When el usuario hace clic en el link "cambiaste el número de celular"
    Then se debe mostrar el popup: Te ayudaremos a resolverlo
```
---
#### 9. Verificar que el calendario muestre por defecto el año y mes correcto para mayoría de edad
**Archivo:** `register-rules.spec.ts` | **Línea:** 24
```gherkin
Feature: Reglas de negocio de la página de registro

  Scenario: Verificar que el calendario muestre por defecto el año y mes correcto para mayoría de edad
    Given el usuario se encuentra en la página de registro
    When el usuario hace clic en el selector de fecha de nacimiento
    Then el calendario debe estar visible
```
---
#### 10. Verificar que no se pueden navegar a meses futuros que harían que el usuario tenga menos de 18 años
**Archivo:** `register-rules.spec.ts` | **Línea:** 52
```gherkin
Feature: Reglas de negocio de la página de registro

  Scenario: Verificar que no se pueden navegar a meses futuros que harían que el usuario tenga menos de 18 años
    Given el usuario se encuentra en la página de registro
    When el usuario abre el selector de fecha de nacimiento
    Then el calendario debe estar visible
```
---
#### 11. Verificar que se puede seleccionar una fecha válida que hace que el usuario tenga más de 18 años
**Archivo:** `register-rules.spec.ts` | **Línea:** 81
```gherkin
Feature: Reglas de negocio de la página de registro

  Scenario: Verificar que se puede seleccionar una fecha válida que hace que el usuario tenga más de 18 años
    Given el usuario se encuentra en la página de registro
    When el usuario abre el selector de fecha de nacimiento
    Then la fecha debe ser seleccionada correctamente y el calendario debe cerrarse
```
---
#### 12. Verificar que no se puede seleccionar fecha que hace que el usuario tenga exactamente 17 años, 11 meses y 29 días
**Archivo:** `register-rules.spec.ts` | **Línea:** 104
```gherkin
Feature: Reglas de negocio de la página de registro

  Scenario: Verificar que no se puede seleccionar fecha que hace que el usuario tenga exactamente 17 años, 11 meses y 29 días
    Given el usuario se encuentra en la página de registro
    When el usuario abre el selector de fecha de nacimiento
    Then esa fecha específica debe estar deshabilitada
```
---
#### 13. Verificar que se puede navegar entre meses usando las flechas del calendario
**Archivo:** `register-rules.spec.ts` | **Línea:** 127
```gherkin
Feature: Reglas de negocio de la página de registro

  Scenario: Verificar que se puede navegar entre meses usando las flechas del calendario
    Given el usuario se encuentra en la página de registro
    When el usuario abre el selector de fecha de nacimiento
    When hace clic en la flecha para ir al mes siguiente
    Then el calendario debe mostrar el mes anterior
    Then el calendario debe regresar al mes original
```
---
#### 14. Verificar que se puede cerrar el calendario sin seleccionar una fecha
**Archivo:** `register-rules.spec.ts` | **Línea:** 164
```gherkin
Feature: Reglas de negocio de la página de registro

  Scenario: Verificar que se puede cerrar el calendario sin seleccionar una fecha
    Given el usuario se encuentra en la página de registro
    When el usuario abre el selector de fecha de nacimiento
    When el usuario cierra el calendario
    Then el calendario debe estar visible
    Then el calendario debe estar oculto
```
---

---

## 🔧 Información Técnica

- **Framework:** Playwright + TypeScript
- **Patrón:** Page Object Model (POM)
- **Principios:** SOLID
- **Formato BDD:** Gherkin

> 📄 **Documentación generada automáticamente** por Test Documentation Generator  
> Para actualizar esta documentación, ejecute: `npm run generate-docs`