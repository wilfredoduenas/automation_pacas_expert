# 📋 Documentación de Tests - automation_pacas_expert

**Versión:** 1.0.0  
**Generado:** 10 de agosto de 2025, 11:42

---

## 📑 Tabla de Contenidos
- [Resumen Ejecutivo](#resumen-ejecutivo)
- [Escenarios por Tipo](#escenarios-por-tipo)
  - [Tests de Reglas de Negocio](#tests-de-reglas-de-negocio)
- [Escenarios Detallados](#escenarios-detallados)

## 📊 Resumen Ejecutivo
| Métrica | Valor |
|---------|--------|
| **Total de Tests** | 18 |
| **Escenarios Completos** | 18 |
| **Tasa de Completitud** | 100% |
| **Tests con BDD Explícito** | 0 |
| **Tasa de BDD Explícito** | 0% |
| **Tests de Reglas de Negocio** | 18 tests (0 con BDD) |

**Leyenda:**
- ✅ Test mapeado completamente
- ⚠️ Test incompleto o sin pasos BDD
- 🔄 Pasos BDD generados automáticamente

## 🗂️ Escenarios por Tipo
### ⚖️ Tests de Reglas de Negocio
**Total de tests:** 18

- ✅ 🔄 **Verificar que el campo número de celular tenga el foco al abrir la página** (_login-rules.spec.ts_)
- ✅ 🔄 **Verificar que el botón de iniciar sesión esté deshabilitado al abrir la página** (_login-rules.spec.ts_)
- ✅ 🔄 **Verificar que el botón de iniciar sesión esté habilitado al ingresar un número de celular válido** (_login-rules.spec.ts_)
- ✅ 🔄 **Verificar que el botón de registrarse en la sección de acceso alternativo esté habilitado** (_login-rules.spec.ts_)
- ✅ 🔄 **Verificar que el botón de ingresar como invitado esté habilitado** (_login-rules.spec.ts_)
- ✅ 🔄 **Verificar que al ingresar un número de celular que inicie con un dígito distinto de 9, el botón de iniciar sesión esté deshabilitado y se muestre un mensaje de error** (_login-rules.spec.ts_)
- ✅ 🔄 **Verificar que al ingresar un número de celular que no cumple con la longitud mínima, se muestre un mensaje de error** (_login-rules.spec.ts_)
- ✅ 🔄 **Verificar que al ingresar letras en el campo de número de celular, se ignoren** (_login-rules.spec.ts_)
- ✅ 🔄 **Verificar que al ingresar un número de celular que contenga letras, las letras sean ignoradas** (_login-rules.spec.ts_)
- ✅ 🔄 **Verificar que al ingresar caracteres especiales en el campo de número de celular, se ignoren** (_login-rules.spec.ts_)
- ✅ 🔄 **Verificar que al ingresar un número de celular que no cumple con el formato y borrar la entrada, se muestre un mensaje de error** (_login-rules.spec.ts_)
- ✅ 🔄 **Verificar que al hacer clic en el link cambiaste el número de celular, se muestre el popup: Te ayudaremos** (_login-rules.spec.ts_)
- ✅ 🔄 **Verificar que el calendario muestre por defecto el año y mes correcto para mayoría de edad** (_register-rules.spec.ts_)
- ✅ 🔄 **Verificar que no se pueden navegar a meses futuros que harían que el usuario tenga menos de 18 años** (_register-rules.spec.ts_)
- ✅ 🔄 **Verificar que se puede seleccionar una fecha válida que hace que el usuario tenga más de 18 años** (_register-rules.spec.ts_)
- ✅ 🔄 **Verificar que no se puede seleccionar fecha que hace que el usuario tenga exactamente 17 años, 11 meses y 29 días** (_register-rules.spec.ts_)
- ✅ 🔄 **Verificar que se puede navegar entre meses usando las flechas del calendario** (_register-rules.spec.ts_)
- ✅ 🔄 **Verificar que se puede cerrar el calendario sin seleccionar una fecha** (_register-rules.spec.ts_)

## 📝 Escenarios Detallados
### ⚖️ Tests de Reglas de Negocio
#### 1. 🔄 Verificar que el campo número de celular tenga el foco al abrir la página
**Archivo:** `login-rules.spec.ts` | **Línea:** 20 | **Estado:** pasos generados automáticamente
```gherkin
# Escenario generado automáticamente basado en el nombre del test
Feature: Funcionalidad de Login

  Scenario: Verificar que el campo número de celular tenga el foco al abrir la página
    Given el usuario se encuentra en la página de login
    When el usuario ejecuta la acción correspondiente
    Then debe cumplir loginPage.expectCredentialsPhoneFocused
```
> 🔄 **Pasos generados automáticamente** - Considere agregar comentarios BDD explícitos para mejorar la documentación
---
#### 2. 🔄 Verificar que el botón de iniciar sesión esté deshabilitado al abrir la página
**Archivo:** `login-rules.spec.ts` | **Línea:** 27 | **Estado:** pasos generados automáticamente
```gherkin
# Escenario generado automáticamente basado en el nombre del test
Feature: Funcionalidad de Login

  Scenario: Verificar que el botón de iniciar sesión esté deshabilitado al abrir la página
    Given el usuario se encuentra en la página de login
    When el usuario ejecuta la acción correspondiente
    Then el botón de iniciar sesión debe estar deshabilitado
```
> 🔄 **Pasos generados automáticamente** - Considere agregar comentarios BDD explícitos para mejorar la documentación
---
#### 3. 🔄 Verificar que el botón de iniciar sesión esté habilitado al ingresar un número de celular válido
**Archivo:** `login-rules.spec.ts` | **Línea:** 34 | **Estado:** pasos generados automáticamente
```gherkin
# Escenario generado automáticamente basado en el nombre del test
Feature: Funcionalidad de Login

  Scenario: Verificar que el botón de iniciar sesión esté habilitado al ingresar un número de celular válido
    Given el usuario se encuentra en la página de login
    When el usuario ingresa "987654321" en el campo número de celular
    Then el botón de iniciar sesión debe estar habilitado
```
> 🔄 **Pasos generados automáticamente** - Considere agregar comentarios BDD explícitos para mejorar la documentación
---
#### 4. 🔄 Verificar que el botón de registrarse en la sección de acceso alternativo esté habilitado
**Archivo:** `login-rules.spec.ts` | **Línea:** 42 | **Estado:** pasos generados automáticamente
```gherkin
# Escenario generado automáticamente basado en el nombre del test
Feature: Funcionalidad de Login

  Scenario: Verificar que el botón de registrarse en la sección de acceso alternativo esté habilitado
    Given el usuario se encuentra en la página de login
    When el usuario ejecuta la acción correspondiente
    Then debe cumplir loginPage.expectAlternativeAccessRegisterButtonEnabled
```
> 🔄 **Pasos generados automáticamente** - Considere agregar comentarios BDD explícitos para mejorar la documentación
---
#### 5. 🔄 Verificar que el botón de ingresar como invitado esté habilitado
**Archivo:** `login-rules.spec.ts` | **Línea:** 49 | **Estado:** pasos generados automáticamente
```gherkin
# Escenario generado automáticamente basado en el nombre del test
Feature: Funcionalidad de Login

  Scenario: Verificar que el botón de ingresar como invitado esté habilitado
    Given el usuario se encuentra en la página de login
    When el usuario ejecuta la acción correspondiente
    Then debe cumplir loginPage.expectAlternativeAccessGuestButtonEnabled
```
> 🔄 **Pasos generados automáticamente** - Considere agregar comentarios BDD explícitos para mejorar la documentación
---
#### 6. 🔄 Verificar que al ingresar un número de celular que inicie con un dígito distinto de 9, el botón de iniciar sesión esté deshabilitado y se muestre un mensaje de error
**Archivo:** `login-rules.spec.ts` | **Línea:** 56 | **Estado:** pasos generados automáticamente
```gherkin
# Escenario generado automáticamente basado en el nombre del test
Feature: Funcionalidad de Login

  Scenario: Verificar que al ingresar un número de celular que inicie con un dígito distinto de 9, el botón de iniciar sesión esté deshabilitado y se muestre un mensaje de error
    Given el usuario se encuentra en la página de login
    When el usuario ingresa "123456789" en el campo número de celular
    Then debe cumplir loginPage.expectCredentialsPhoneErrorMessageVisible
    And se muestra el mensaje de error: "Número de celular debe iniciar en 9"
    And el botón de iniciar sesión debe estar deshabilitado
```
> 🔄 **Pasos generados automáticamente** - Considere agregar comentarios BDD explícitos para mejorar la documentación
---
#### 7. 🔄 Verificar que al ingresar un número de celular que no cumple con la longitud mínima, se muestre un mensaje de error
**Archivo:** `login-rules.spec.ts` | **Línea:** 68 | **Estado:** pasos generados automáticamente
```gherkin
# Escenario generado automáticamente basado en el nombre del test
Feature: Funcionalidad de Login

  Scenario: Verificar que al ingresar un número de celular que no cumple con la longitud mínima, se muestre un mensaje de error
    Given el usuario se encuentra en la página de login
    When el usuario ingresa "9878" en el campo número de celular
    Then debe cumplir loginPage.expectCredentialsPhoneMinLengthMessageVisible
    And debe cumplir loginPage.expectCredentialsPhoneMinLengthMessageToHaveText con "Debe tener al menos 9 caracteres"
    And el botón de iniciar sesión debe estar deshabilitado
```
> 🔄 **Pasos generados automáticamente** - Considere agregar comentarios BDD explícitos para mejorar la documentación
---
#### 8. 🔄 Verificar que al ingresar letras en el campo de número de celular, se ignoren
**Archivo:** `login-rules.spec.ts` | **Línea:** 80 | **Estado:** pasos generados automáticamente
```gherkin
# Escenario generado automáticamente basado en el nombre del test
Feature: Funcionalidad de Login

  Scenario: Verificar que al ingresar letras en el campo de número de celular, se ignoren
    Given el usuario se encuentra en la página de login
    When el usuario ingresa "abc" en el campo número de celular
    And el usuario ejecuta loginPage.getCredentialsPhoneValue
    Then debe cumplir resolves.toBe
    And debe cumplir expect con "loginPage.getCredentialsPhoneValue()"
    And el botón de iniciar sesión debe estar deshabilitado
```
> 🔄 **Pasos generados automáticamente** - Considere agregar comentarios BDD explícitos para mejorar la documentación
---
#### 9. 🔄 Verificar que al ingresar un número de celular que contenga letras, las letras sean ignoradas
**Archivo:** `login-rules.spec.ts` | **Línea:** 89 | **Estado:** pasos generados automáticamente
```gherkin
# Escenario generado automáticamente basado en el nombre del test
Feature: Funcionalidad de Login

  Scenario: Verificar que al ingresar un número de celular que contenga letras, las letras sean ignoradas
    Given el usuario se encuentra en la página de login
    When el usuario ingresa "9876abc" en el campo número de celular
    And el usuario ejecuta loginPage.getCredentialsPhoneValue
    Then debe cumplir resolves.toBe
    And debe cumplir expect con "loginPage.getCredentialsPhoneValue()"
```
> 🔄 **Pasos generados automáticamente** - Considere agregar comentarios BDD explícitos para mejorar la documentación
---
#### 10. 🔄 Verificar que al ingresar caracteres especiales en el campo de número de celular, se ignoren
**Archivo:** `login-rules.spec.ts` | **Línea:** 98 | **Estado:** pasos generados automáticamente
```gherkin
# Escenario generado automáticamente basado en el nombre del test
Feature: Funcionalidad de Login

  Scenario: Verificar que al ingresar caracteres especiales en el campo de número de celular, se ignoren
    Given el usuario se encuentra en la página de login
    When el usuario ingresa "9876!@#$" en el campo número de celular
    And el usuario ejecuta loginPage.getCredentialsPhoneValue
    Then debe cumplir resolves.toBe
    And debe cumplir expect con "loginPage.getCredentialsPhoneValue()"
    And el botón de iniciar sesión debe estar deshabilitado
```
> 🔄 **Pasos generados automáticamente** - Considere agregar comentarios BDD explícitos para mejorar la documentación
---
#### 11. 🔄 Verificar que al ingresar un número de celular que no cumple con el formato y borrar la entrada, se muestre un mensaje de error
**Archivo:** `login-rules.spec.ts` | **Línea:** 107 | **Estado:** pasos generados automáticamente
```gherkin
# Escenario generado automáticamente basado en el nombre del test
Feature: Funcionalidad de Login

  Scenario: Verificar que al ingresar un número de celular que no cumple con el formato y borrar la entrada, se muestre un mensaje de error
    Given el usuario se encuentra en la página de login
    When el usuario ingresa "1234" en el campo número de celular
    And el usuario borra la entrada del campo número de celular
    Then se muestra el mensaje de error: "Número de celular debe iniciar en 9"
    And el mensaje de campo requerido debe estar visible
    And se muestra el mensaje de error: "Número de celular es requerido"
    And el botón de iniciar sesión debe estar deshabilitado
```
> 🔄 **Pasos generados automáticamente** - Considere agregar comentarios BDD explícitos para mejorar la documentación
---
#### 12. 🔄 Verificar que al hacer clic en el link cambiaste el número de celular, se muestre el popup: Te ayudaremos
**Archivo:** `login-rules.spec.ts` | **Línea:** 124 | **Estado:** pasos generados automáticamente
```gherkin
# Escenario generado automáticamente basado en el nombre del test
Feature: Funcionalidad de Login

  Scenario: Verificar que al hacer clic en el link cambiaste el número de celular, se muestre el popup: Te ayudaremos
    Given el usuario se encuentra en la página de login
    When el usuario hace clic en el elemento
    Then debe cumplir loginPage.expectChangePhonePopupHeadingVisible
    And debe cumplir loginPage.expectChangePhonePopupMessageVisible
    And debe cumplir loginPage.expectChangePhonePopupButtonVisible
    And debe cumplir loginPage.expectChangePhonePopupHeadingToHaveText con "¡Te ayudaremos a resolverlo!"
```
> 🔄 **Pasos generados automáticamente** - Considere agregar comentarios BDD explícitos para mejorar la documentación
---
#### 13. 🔄 Verificar que el calendario muestre por defecto el año y mes correcto para mayoría de edad
**Archivo:** `register-rules.spec.ts` | **Línea:** 21 | **Estado:** pasos generados automáticamente
```gherkin
# Escenario generado automáticamente basado en el nombre del test
Feature: Funcionalidad de Registro

  Scenario: Verificar que el calendario muestre por defecto el año y mes correcto para mayoría de edad
    Given el usuario ejecuta CommonTestSteps.setupRegisterRulesTest con "page"
    When el usuario ejecuta registerPage.openDatePicker
    Then debe cumplir registerPage.expectCalendarVisible
    And debe cumplir DateHelper.validateEnabledDays
```
> 🔄 **Pasos generados automáticamente** - Considere agregar comentarios BDD explícitos para mejorar la documentación
---
#### 14. 🔄 Verificar que no se pueden navegar a meses futuros que harían que el usuario tenga menos de 18 años
**Archivo:** `register-rules.spec.ts` | **Línea:** 30 | **Estado:** pasos generados automáticamente
```gherkin
# Escenario generado automáticamente basado en el nombre del test
Feature: Funcionalidad de Registro

  Scenario: Verificar que no se pueden navegar a meses futuros que harían que el usuario tenga menos de 18 años
    Given el usuario ejecuta CommonTestSteps.setupRegisterRulesTest con "page"
    When el usuario ejecuta registerPage.openDatePicker
    And el usuario hace clic en el elemento
    And el usuario ejecuta DateHelper.validateMonthRestrictions con "registerPage"
    Then debe cumplir registerPage.expectCalendarVisible
```
> 🔄 **Pasos generados automáticamente** - Considere agregar comentarios BDD explícitos para mejorar la documentación
---
#### 15. 🔄 Verificar que se puede seleccionar una fecha válida que hace que el usuario tenga más de 18 años
**Archivo:** `register-rules.spec.ts` | **Línea:** 40 | **Estado:** pasos generados automáticamente
```gherkin
# Escenario generado automáticamente basado en el nombre del test
Feature: Funcionalidad de Registro

  Scenario: Verificar que se puede seleccionar una fecha válida que hace que el usuario tenga más de 18 años
    Given el usuario ejecuta CommonTestSteps.setupRegisterRulesTest con "page"
    When el usuario ejecuta registerPage.openDatePicker
    And el usuario ejecuta DateHelper.validateValidDateSelection con "registerPage"
    Then se debe poder seleccionar una fecha que haga al usuario mayor de edad
```
> 🔄 **Pasos generados automáticamente** - Considere agregar comentarios BDD explícitos para mejorar la documentación
---
#### 16. 🔄 Verificar que no se puede seleccionar fecha que hace que el usuario tenga exactamente 17 años, 11 meses y 29 días
**Archivo:** `register-rules.spec.ts` | **Línea:** 48 | **Estado:** pasos generados automáticamente
```gherkin
# Escenario generado automáticamente basado en el nombre del test
Feature: Funcionalidad de Registro

  Scenario: Verificar que no se puede seleccionar fecha que hace que el usuario tenga exactamente 17 años, 11 meses y 29 días
    Given el usuario ejecuta CommonTestSteps.setupRegisterRulesTest con "page"
    When el usuario ejecuta registerPage.openDatePicker
    And el usuario ejecuta DateHelper.validateInvalidDateRestriction con "registerPage"
    Then no se debe permitir seleccionar fechas que resulten en menor de edad
```
> 🔄 **Pasos generados automáticamente** - Considere agregar comentarios BDD explícitos para mejorar la documentación
---
#### 17. 🔄 Verificar que se puede navegar entre meses usando las flechas del calendario
**Archivo:** `register-rules.spec.ts` | **Línea:** 56 | **Estado:** pasos generados automáticamente
```gherkin
# Escenario generado automáticamente basado en el nombre del test
Feature: Funcionalidad de Registro

  Scenario: Verificar que se puede navegar entre meses usando las flechas del calendario
    Given el usuario ejecuta CommonTestSteps.setupRegisterRulesTest con "page"
    When el usuario ejecuta registerPage.openDatePicker
    Then debe cumplir registerPage.expectCalendarVisible
    And debe cumplir registerPage.expectCalendarVisible
```
> 🔄 **Pasos generados automáticamente** - Considere agregar comentarios BDD explícitos para mejorar la documentación
---
#### 18. 🔄 Verificar que se puede cerrar el calendario sin seleccionar una fecha
**Archivo:** `register-rules.spec.ts` | **Línea:** 67 | **Estado:** pasos generados automáticamente
```gherkin
# Escenario generado automáticamente basado en el nombre del test
Feature: Funcionalidad de Registro

  Scenario: Verificar que se puede cerrar el calendario sin seleccionar una fecha
    Given el usuario ejecuta CommonTestSteps.setupRegisterRulesTest con "page"
    When el usuario ejecuta registerPage.openDatePicker
    And el usuario ejecuta registerPage.closeDatePicker
    Then debe cumplir registerPage.expectCalendarVisible
    And debe cumplir registerPage.expectCalendarHidden
```
> 🔄 **Pasos generados automáticamente** - Considere agregar comentarios BDD explícitos para mejorar la documentación
---

---

## 🔧 Información Técnica

- **Framework:** Playwright + TypeScript
- **Patrón:** Page Object Model (POM)
- **Principios:** SOLID
- **Formato BDD:** Gherkin

> 📄 **Documentación generada automáticamente** por Test Documentation Generator  
> Para actualizar esta documentación, ejecute: `npm run generate-docs`