import * as ts from 'typescript';
import { ITestScenario } from '../interfaces/IDocumentationGenerator';
import { TestScenario } from '../models/TestScenario';

/**
 * Extractor que analiza el código fuente de los tests para generar escenarios BDD automáticamente
 */
export class CodeAnalysisExtractor {
  
  /**
   * Extrae escenarios BDD analizando directamente el código de los tests
   */
  public extractScenariosFromCode(filePath: string, sourceCode: string): ITestScenario[] {
    const scenarios: ITestScenario[] = [];
    
    try {
      const sourceFile = ts.createSourceFile(
        filePath,
        sourceCode,
        ts.ScriptTarget.Latest,
        true
      );
      
      const testCases = this.findTestCases(sourceFile);
      
      testCases.forEach(testCase => {
        const scenario = this.generateScenarioFromTestCase(testCase, filePath);
        if (scenario) {
          scenarios.push(scenario);
        }
      });
      
    } catch (error) {
      console.warn(`⚠️ Error analizando archivo ${filePath}:`, error);
    }
    
    return scenarios;
  }
  
  /**
   * Encuentra todos los casos de test en el archivo
   */
  private findTestCases(sourceFile: ts.SourceFile): TestCase[] {
    const testCases: TestCase[] = [];
    
    const visit = (node: ts.Node) => {
      if (ts.isCallExpression(node)) {
        const expression = node.expression;
        
        if (ts.isIdentifier(expression) && expression.text === 'test') {
          const testCase = this.parseTestCase(node);
          if (testCase) {
            testCases.push(testCase);
          }
        }
      }
      
      ts.forEachChild(node, visit);
    };
    
    visit(sourceFile);
    return testCases;
  }
  
  /**
   * Parsea un caso de test individual
   */
  private parseTestCase(node: ts.CallExpression): TestCase | null {
    if (node.arguments.length < 2) return null;
    
    const titleArg = node.arguments[0];
    const bodyArg = node.arguments[1];
    
    if (!ts.isStringLiteral(titleArg)) return null;
    if (!ts.isArrowFunction(bodyArg) && !ts.isFunctionExpression(bodyArg)) return null;
    
    const title = titleArg.text;
    const lineNumber = node.getSourceFile().getLineAndCharacterOfPosition(node.getStart()).line + 1;
    
    const actions = this.extractActions(bodyArg);
    const expectations = this.extractExpectations(bodyArg);
    
    return {
      title,
      lineNumber,
      actions,
      expectations
    };
  }
  
  /**
   * Extrae las acciones del test (métodos que no son expect)
   */
  private extractActions(functionNode: ts.ArrowFunction | ts.FunctionExpression): CodeAction[] {
    const actions: CodeAction[] = [];
    
    const visit = (node: ts.Node) => {
      if (ts.isCallExpression(node)) {
        const action = this.parseAction(node);
        if (action) {
          actions.push(action);
        }
      }
      
      ts.forEachChild(node, visit);
    };
    
    if (functionNode.body && ts.isBlock(functionNode.body)) {
      visit(functionNode.body);
    }
    
    return actions;
  }
  
  /**
   * Extrae las expectations del test (métodos expect)
   */
  private extractExpectations(functionNode: ts.ArrowFunction | ts.FunctionExpression): CodeExpectation[] {
    const expectations: CodeExpectation[] = [];
    
    const visit = (node: ts.Node) => {
      if (ts.isCallExpression(node)) {
        const expectation = this.parseExpectation(node);
        if (expectation) {
          expectations.push(expectation);
        }
      }
      
      ts.forEachChild(node, visit);
    };
    
    if (functionNode.body && ts.isBlock(functionNode.body)) {
      visit(functionNode.body);
    }
    
    return expectations;
  }
  
  /**
   * Parsea una acción individual
   */
  private parseAction(node: ts.CallExpression): CodeAction | null {
    const methodName = this.getMethodName(node);
    if (!methodName || this.isExpectation(methodName)) return null;
    
    const parameters = this.extractParameters(node);
    const description = this.generateActionDescription(methodName, parameters);
    
    return {
      methodName,
      parameters,
      description
    };
  }
  
  /**
   * Parsea una expectation individual
   */
  private parseExpectation(node: ts.CallExpression): CodeExpectation | null {
    const methodName = this.getMethodName(node);
    if (!methodName || !this.isExpectation(methodName)) return null;
    
    const parameters = this.extractParameters(node);
    const description = this.generateExpectationDescription(methodName, parameters);
    
    return {
      methodName,
      parameters,
      description
    };
  }
  
  /**
   * Obtiene el nombre del método de una llamada
   */
  private getMethodName(node: ts.CallExpression): string | null {
    let current: ts.Expression = node.expression;
    const parts: string[] = [];
    
    while (ts.isPropertyAccessExpression(current)) {
      parts.unshift(current.name.text);
      current = current.expression;
    }
    
    if (ts.isIdentifier(current)) {
      parts.unshift(current.text);
    }
    
    return parts.length > 0 ? parts.join('.') : null;
  }
  
  /**
   * Extrae los parámetros de una llamada a método
   */
  private extractParameters(node: ts.CallExpression): string[] {
    return node.arguments.map(arg => {
      if (ts.isStringLiteral(arg)) {
        return arg.text;
      } else if (ts.isNumericLiteral(arg)) {
        return arg.text;
      } else {
        return arg.getText();
      }
    });
  }
  
  /**
   * Determina si un método es una expectation
   */
  private isExpectation(methodName: string): boolean {
    return methodName.includes('expect') || 
           methodName.includes('toHave') || 
           methodName.includes('toBe') ||
           methodName.includes('Visible') ||
           methodName.includes('Disabled') ||
           methodName.includes('Enabled') ||
           methodName.includes('Error') ||
           methodName.includes('Message');
  }
  
  /**
   * Genera descripción para acciones
   */
  private generateActionDescription(methodName: string, parameters: string[]): string {
    // Análisis del nombre del método para extraer la acción real
    const lowerMethod = methodName.toLowerCase();
    
    // ============ SETUP Y CONFIGURACIÓN ============
    if (lowerMethod.includes('setuprulestest') || lowerMethod.includes('setupregisterrulestest')) {
      if (lowerMethod.includes('register')) {
        return 'el usuario se encuentra en la página de registro';
      }
      return 'el usuario se encuentra en la página de login';
    }
    
    if (lowerMethod.includes('setupvalidationtest') || lowerMethod.includes('setupregistervalidationtest')) {
      if (lowerMethod.includes('register')) {
        return 'el usuario se encuentra en la página de registro';
      }
      return 'el usuario se encuentra en la página';
    }
    
    if (lowerMethod.includes('documentationconfig.createdefault')) {
      return 'el usuario configura el generador de documentación';
    }
    
    if (lowerMethod.includes('extractor.canprocess')) {
      return 'el usuario verifica que se pueden procesar archivos de test';
    }
    
    if (lowerMethod.includes('formatter.getfileextension')) {
      return 'el usuario verifica el formato de salida de documentación';
    }
    
    // ============ NAVEGACIÓN ============
    if (lowerMethod.includes('goto') || lowerMethod.includes('navigate')) {
      if (lowerMethod.includes('home')) {
        return 'el usuario navega a la página de inicio';
      }
      if (lowerMethod.includes('login')) {
        return 'el usuario navega a la página de login';
      }
      if (lowerMethod.includes('register')) {
        return 'el usuario navega a la página de registro';
      }
      return 'el usuario navega a la página correspondiente';
    }
    
    // ============ INTERACCIONES CON CAMPOS ============
    if (lowerMethod.includes('fillcredentialsphone')) {
      const value = parameters[0]?.replace(/['"]/g, '') || '';
      if (value === '' || value === '""') {
        return 'el usuario borra la entrada del campo número de celular';
      }
      return `el usuario ingresa "${value}" en el campo número de celular`;
    }
    
    if (lowerMethod.includes('fill')) {
      const value = parameters[0]?.replace(/['"]/g, '') || '';
      if (lowerMethod.includes('phone')) {
        return `el usuario ingresa "${value}" en el campo número de celular`;
      }
      if (lowerMethod.includes('email')) {
        return `el usuario ingresa "${value}" en el campo de email`;
      }
      if (lowerMethod.includes('password')) {
        return `el usuario ingresa "${value}" en el campo de contraseña`;
      }
      if (lowerMethod.includes('name')) {
        return `el usuario ingresa "${value}" en el campo de nombre`;
      }
      return `el usuario completa el campo con "${value}"`;
    }
    
    // ============ OBTENER VALORES ============
    if (lowerMethod.includes('getcredentialsphonevalue')) {
      return 'el usuario verifica el valor del campo número de celular';
    }
    
    if (lowerMethod.includes('getvalue') || lowerMethod.includes('get') && lowerMethod.includes('value')) {
      if (lowerMethod.includes('phone')) {
        return 'el usuario verifica el valor del campo número de celular';
      }
      return 'el usuario verifica el valor del campo';
    }
    
    // ============ CLICS Y SELECCIONES ============
    if (lowerMethod.includes('click')) {
      if (lowerMethod.includes('button')) {
        return 'el usuario hace clic en el botón';
      }
      if (lowerMethod.includes('calendar')) {
        return 'el usuario hace clic en el calendario';
      }
      if (lowerMethod.includes('date')) {
        return 'el usuario selecciona una fecha';
      }
      const element = parameters[0]?.replace(/['"]/g, '') || 'el elemento';
      return `el usuario hace clic en ${element}`;
    }
    
    if (lowerMethod.includes('select')) {
      const value = parameters[0]?.replace(/['"]/g, '') || '';
      if (lowerMethod.includes('date')) {
        return `el usuario selecciona la fecha "${value}"`;
      }
      return `el usuario selecciona "${value}"`;
    }
    
    // ============ VALIDACIONES DE ELEMENTOS ============
    if (lowerMethod.includes('validateloginpageelements')) {
      return 'el usuario verifica que todos los elementos de login están presentes';
    }
    
    if (lowerMethod.includes('validateregisterpageelements')) {
      return 'el usuario verifica que todos los elementos de registro están presentes';
    }
    
    if (lowerMethod.includes('validate') && lowerMethod.includes('elements')) {
      return 'el usuario verifica que todos los elementos están presentes';
    }
    
    // ============ VERIFICACIONES DE PÁGINA ============
    if (lowerMethod.includes('verifymenu')) {
      return 'el usuario verifica los elementos del menú';
    }
    
    if (lowerMethod.includes('verifycarousel')) {
      return 'el usuario verifica los elementos del carrusel';
    }
    
    if (lowerMethod.includes('verifyexpert')) {
      return 'el usuario verifica la sección de expertos';
    }
    
    if (lowerMethod.includes('verifybenefits')) {
      return 'el usuario verifica la sección de beneficios';
    }
    
    if (lowerMethod.includes('verifycourses')) {
      return 'el usuario verifica la sección de cursos';
    }
    
    if (lowerMethod.includes('verifynews')) {
      return 'el usuario verifica la sección de noticias';
    }
    
    if (lowerMethod.includes('verifyprefooter')) {
      return 'el usuario verifica la sección antes del pie de página';
    }
    
    if (lowerMethod.includes('verifyfooter')) {
      return 'el usuario verifica el pie de página';
    }
    
    if (lowerMethod.includes('verify')) {
      return 'el usuario verifica los elementos correspondientes';
    }
    
    // ============ MENSAJES DE CONSOLA ============
    if (lowerMethod.includes('console.log')) {
      const message = parameters[0]?.replace(/['"]/g, '') || '';
      if (message.includes('✅')) {
        return 'el sistema confirma que está listo para usar';
      }
      if (message.includes('💡')) {
        return 'el sistema muestra información sobre cómo generar documentación';
      }
      return 'el sistema muestra un mensaje informativo';
    }
    
    // ============ ACCIONES DE CALENDARIO ============
    if (lowerMethod.includes('opendatepicker') || lowerMethod.includes('opendate')) {
      return 'el usuario abre el calendario';
    }
    
    if (lowerMethod.includes('calendar')) {
      if (lowerMethod.includes('open') || lowerMethod.includes('show')) {
        return 'el usuario abre el calendario';
      }
      if (lowerMethod.includes('close')) {
        return 'el usuario cierra el calendario';
      }
      if (lowerMethod.includes('navigate')) {
        return 'el usuario navega en el calendario';
      }
      return 'el usuario interactúa con el calendario';
    }
    
    // ============ VALIDACIONES ESPECÍFICAS ============
    if (lowerMethod.includes('datehelper.validateenableddays') || 
        lowerMethod.includes('validateenableddays') || 
        (lowerMethod.includes('validate') && lowerMethod.includes('enabled') && lowerMethod.includes('days'))) {
      return 'se verifican los días habilitados para mayor de edad';
    }
    
    if (lowerMethod.includes('datehelper.validatemonthrestrictions') || 
        lowerMethod.includes('validatemonthrestrictions')) {
      return 'se verifica que no se puede navegar a meses restringidos';
    }
    
    if (lowerMethod.includes('datehelper.validatevaliddateselection') || 
        lowerMethod.includes('validatevaliddateselection')) {
      return 'se verifica que se puede seleccionar una fecha válida';
    }
    
    if (lowerMethod.includes('datehelper.validateinvaliddaterestriction') || 
        lowerMethod.includes('validateinvaliddaterestriction') ||
        lowerMethod.includes('validateinvalidfecharestriction')) {
      return 'se verifica que no se puede seleccionar una fecha inválida';
    }
    
    // ============ ACCIONES GENÉRICAS ============
    if (lowerMethod.includes('create')) {
      return 'el usuario crea un elemento';
    }
    
    if (lowerMethod.includes('open')) {
      return 'el usuario abre un elemento';
    }
    
    if (lowerMethod.includes('close')) {
      return 'el usuario cierra un elemento';
    }
    
    if (lowerMethod.includes('clear')) {
      return 'el usuario limpia el campo';
    }
    
    if (lowerMethod.includes('press')) {
      const key = parameters[0]?.replace(/['"]/g, '') || '';
      return `el usuario presiona la tecla ${key}`;
    }
    
    if (lowerMethod.includes('wait')) {
      return 'el usuario espera a que se complete la acción';
    }
    
    // ============ FALLBACK INTELIGENTE ============
    // Si no encontramos un mapeo específico, intentamos extraer el significado del nombre del método
    
    // Remover prefijos comunes como page objects y CommonTestSteps
    let cleanMethod = methodName
      .replace(/^(homePage|loginPage|registerPage|page)\./, '')
      .replace(/^CommonTestSteps\./, '')
      .replace(/^DateHelper\./, '');
    
    // Mapeos específicos para métodos comunes antes del procesamiento general
    const specificMappings: { [key: string]: string } = {
      'openDatePicker': 'abre el calendario',
      'validateEnabledDays': 'se verifican los días habilitados para mayor de edad',
      'validateMonthRestrictions': 'se verifica que no se puede navegar a meses restringidos',
      'validateValidDateSelection': 'se verifica que se puede seleccionar una fecha válida',
      'validateInvalidDateRestriction': 'se verifica que no se puede seleccionar una fecha inválida',
      'expectCalendarVisible': 'verifica que el calendario está visible',
      'expectCalendarHidden': 'verifica que el calendario está oculto',
      'clickDate': 'selecciona una fecha',
      'clickNextMonth': 'navega al mes siguiente',
      'clickPrevMonth': 'navega al mes anterior',
      'clickCurrentDateHeader': 'hace clic en el encabezado de fecha actual',
      'clearDate': 'limpia la fecha seleccionada',
      'selectDate': 'selecciona una fecha'
    };
    
    if (specificMappings[cleanMethod]) {
      return `el usuario ${specificMappings[cleanMethod]}`;
    }
    
    // Convertir camelCase a palabras
    const words = cleanMethod
      .replace(/([A-Z])/g, ' $1')
      .toLowerCase()
      .trim()
      .split(' ');
    
    // Mapear palabras técnicas a lenguaje natural
    const wordMappings: { [key: string]: string } = {
      'get': 'obtiene',
      'set': 'establece',
      'check': 'verifica',
      'verify': 'verifica',
      'validate': 'valida',
      'ensure': 'asegura',
      'test': 'prueba',
      'assert': 'confirma',
      'expect': 'verifica que',
      'click': 'hace clic en',
      'fill': 'completa',
      'type': 'escribe en',
      'select': 'selecciona',
      'choose': 'elige',
      'toggle': 'alterna',
      'enable': 'habilita',
      'disable': 'deshabilita',
      'show': 'muestra',
      'hide': 'oculta',
      'open': 'abre',
      'close': 'cierra',
      'submit': 'envía',
      'cancel': 'cancela',
      'confirm': 'confirma',
      'accept': 'acepta',
      'reject': 'rechaza',
      'date': 'fecha',
      'picker': 'selector',
      'calendar': 'calendario',
      'enabled': 'habilitados',
      'disabled': 'deshabilitados',
      'days': 'días',
      'months': 'meses',
      'years': 'años'
    };
    
    const translatedWords = words.map(word => wordMappings[word] || word);
    
    // Si tenemos parámetros, incluirlos de manera natural
    if (parameters.length > 0 && parameters[0] !== '') {
      const param = parameters[0].replace(/['"]/g, '');
      return `el usuario ${translatedWords.join(' ')} con "${param}"`;
    }
    
    return `el usuario ${translatedWords.join(' ')}`;
  }
  
  /**
   * Genera descripción para expectations
   */
  private generateExpectationDescription(methodName: string, parameters: string[]): string {
    // Mapeos específicos para validaciones de campo de celular
    if (methodName.includes('expectCredentialsPhoneErrorMessageToHaveText')) {
      return `se muestra el mensaje de error: "${parameters[0] || 'mensaje de error'}"`;
    }
    
    if (methodName.includes('expectCredentialsPhoneErrorMessageVisible')) {
      return 'se muestra un mensaje de error en el campo número de celular';
    }
    
    if (methodName.includes('expectCredentialsPhoneMinLengthMessageVisible')) {
      return 'se muestra el mensaje de longitud mínima';
    }
    
    if (methodName.includes('expectCredentialsPhoneMinLengthMessageToHaveText')) {
      return `se muestra el mensaje: "${parameters[0] || 'mensaje de longitud'}"`;
    }
    
    if (methodName.includes('expectCredentialsPhoneRequiredMessageVisible')) {
      return 'se muestra el mensaje de campo requerido';
    }
    
    if (methodName.includes('expectCredentialsPhoneRequiredMessageToHaveText')) {
      return `se muestra el mensaje: "${parameters[0] || 'campo requerido'}"`;
    }
    
    if (methodName.includes('expectCredentialsPhoneFocused')) {
      return 'el campo número de celular debe tener el foco';
    }
    
    // Mapeos para botones de login
    if (methodName.includes('expectCredentialsSignInButtonDisabled')) {
      return 'el botón de iniciar sesión debe estar deshabilitado';
    }
    
    if (methodName.includes('expectCredentialsSignInButtonEnabled')) {
      return 'el botón de iniciar sesión debe estar habilitado';
    }
    
    // Mapeos para botones de acceso alternativo
    if (methodName.includes('expectAlternativeAccessRegisterButtonEnabled')) {
      return 'el botón de registrarse debe estar habilitado';
    }
    
    if (methodName.includes('expectAlternativeAccessGuestButtonEnabled')) {
      return 'el botón de ingresar como invitado debe estar habilitado';
    }
    
    // Mapeos para popup de cambio de teléfono
    if (methodName.includes('expectChangePhonePopupHeadingVisible')) {
      return 'se muestra el encabezado del popup de ayuda';
    }
    
    if (methodName.includes('expectChangePhonePopupMessageVisible')) {
      return 'se muestra el mensaje del popup de ayuda';
    }
    
    if (methodName.includes('expectChangePhonePopupButtonVisible')) {
      return 'se muestra el botón del popup de ayuda';
    }
    
    if (methodName.includes('expectChangePhonePopupHeadingToHaveText')) {
      return `el popup muestra el título: "${parameters[0] || 'título del popup'}"`;
    }
    
    // Mapeos para calendario
    if (methodName.includes('expectCalendarVisible')) {
      return 'el calendario debe estar visible';
    }
    
    if (methodName.includes('expectCalendarHidden')) {
      return 'el calendario debe estar oculto';
    }
    
    if (methodName.includes('expectDateSelected')) {
      return 'la fecha debe estar seleccionada correctamente';
    }
    
    // Mapeos para validaciones de fecha
    if (methodName.includes('validateEnabledDays')) {
      return 'se validan los días habilitados para mayor de edad';
    }
    
    if (methodName.includes('validateMonthRestrictions')) {
      return 'se validan las restricciones de navegación entre meses';
    }
    
    if (methodName.includes('validateValidDateSelection')) {
      return 'se valida que la fecha seleccionada cumple con mayoría de edad';
    }
    
    if (methodName.includes('validateInvalidDateRestriction')) {
      return 'se valida que no se puede seleccionar fecha de menor de edad';
    }
    
    // Mapeos genéricos para estados comunes
    if (methodName.includes('expectVisible')) {
      return 'el elemento debe estar visible';
    }
    
    if (methodName.includes('expectHidden')) {
      return 'el elemento debe estar oculto';
    }
    
    if (methodName.includes('expectDisabled')) {
      return 'el elemento debe estar deshabilitado';
    }
    
    if (methodName.includes('expectEnabled')) {
      return 'el elemento debe estar habilitado';
    }
    
    if (methodName.includes('expectFocused')) {
      return 'el elemento debe tener el foco';
    }
    
    if (methodName.includes('expectToHaveText')) {
      return `debe mostrar el texto: "${parameters[0] || 'texto esperado'}"`;
    }
    
    if (methodName.includes('toHaveText')) {
      return `debe mostrar el texto: "${parameters[0] || 'texto esperado'}"`;
    }
    
    // Mapeos para expectativas generales de Playwright
    if (methodName.includes('toBe')) {
      if (parameters[0]) {
        return `el valor debe ser: "${parameters[0]}"`;
      }
      return 'se debe verificar el resultado esperado';
    }
    
    if (methodName.includes('toBeDefined')) {
      return 'el elemento debe estar definido';
    }
    
    if (methodName.includes('resolves.toBe')) {
      return 'la promesa debe resolverse con el valor esperado';
    }
    
    // Omitir expectativas muy técnicas
    if (methodName.includes('expect(') && 
        (methodName.includes('generator') || 
         methodName.includes('extractor') ||
         methodName.includes('formatter'))) {
      return ''; // Será filtrado después
    }
    
    // Descripción genérica para cualquier expectation no mapeada
    if (methodName.includes('expect')) {
      return 'se verifica el resultado esperado';
    }
    
    return 'el resultado debe ser correcto';
  }
  
  /**
   * Genera un escenario BDD a partir de un caso de test
   */
  private generateScenarioFromTestCase(testCase: TestCase, filePath: string): ITestScenario | null {
    const givenSteps: string[] = [];
    const whenSteps: string[] = [];
    const thenSteps: string[] = [];
    
    // Dado (Given) - Precondiciones basadas en setup
    const setupAction = testCase.actions.find(action => 
      action.methodName.includes('setup') || action.methodName.includes('navigate')
    );
    
    if (setupAction) {
      givenSteps.push(setupAction.description);
    } else {
      givenSteps.push('el usuario se encuentra en la aplicación');
    }
    
    // Cuando (When) - Acciones principales
    const mainActions = testCase.actions.filter(action => 
      !action.methodName.includes('setup') && !action.methodName.includes('navigate')
    );
    
    mainActions.forEach((action) => {
      whenSteps.push(action.description);
    });
    
    // Si no hay acciones principales, agregar una genérica
    if (whenSteps.length === 0) {
      whenSteps.push('el usuario ejecuta la acción correspondiente');
    }
    
    // Entonces (Then) - Expectations
    testCase.expectations.forEach((expectation) => {
      thenSteps.push(expectation.description);
    });
    
    // Generar expectativa contextual basada en el título del test
    const contextualExpectation = this.generateContextualExpectation(testCase.title, testCase.actions);
    
    // Si no hay expectations, usar la contextual como única expectativa
    if (thenSteps.length === 0) {
      thenSteps.push(contextualExpectation);
    } else {
      // Si hay expectations y la contextual es más específica que el comportamiento genérico, reemplazar o agregar
      const hasGenericExpectation = thenSteps.some(step => 
        step.includes('se debe verificar el resultado esperado') || 
        step.includes('el comportamiento del sistema debe ser el correcto')
      );
      
      if (hasGenericExpectation && !contextualExpectation.includes('el comportamiento del sistema debe ser el correcto')) {
        // Agregar la expectativa contextual como el paso principal
        thenSteps.unshift(contextualExpectation);
      }
    }
    
    // Crear el escenario con todos los parámetros requeridos
    const scenario = new TestScenario(
      testCase.title,                          // testName
      testCase.title,                          // description
      this.generateFeatureName(filePath),      // feature
      testCase.title,                          // scenario
      givenSteps,                             // given
      whenSteps,                              // when
      thenSteps,                              // then
      filePath,                               // filePath
      testCase.lineNumber,                    // lineNumber
      this.getTestType(filePath),             // testType
      [],                                     // tags
      { 
        generatedFromCode: true,              // metadata
        generatedSteps: true,                 // Para identificar pasos generados automáticamente
        hasExplicitBDD: false                 // No tiene BDD explícito, es generado
      }
    );
    
    return scenario;
  }
  
  /**
   * Genera el nombre del feature basado en el archivo
   */
  private generateFeatureName(filePath: string): string {
    const fileName = filePath.split('/').pop()?.replace('.spec.ts', '') || '';
    const parts = fileName.split('-');
    
    const featureMappings: { [key: string]: string } = {
      'login': 'Funcionalidad de Login',
      'register': 'Funcionalidad de Registro',
      'home': 'Página de Inicio',
      'validation': 'Validación de Elementos',
      'rules': 'Reglas de Negocio'
    };
    
    for (const [key, value] of Object.entries(featureMappings)) {
      if (fileName.includes(key)) {
        return value;
      }
    }
    
    return `Funcionalidad de ${parts[0] || 'Test'}`;
  }
  
  /**
   * Determina el tipo de test basado en la ruta del archivo
   */
  private getTestType(filePath: string): 'validation' | 'rules' | 'e2e' {
    if (filePath.includes('validation')) return 'validation';
    if (filePath.includes('rules')) return 'rules';
    if (filePath.includes('e2e')) return 'e2e';
    return 'validation';
  }
  
  /**
   * Genera una expectativa contextual basada en el nombre del test y las acciones
   */
  private generateContextualExpectation(testTitle: string, actions: CodeAction[]): string {
    const title = testTitle.toLowerCase();
    
    // Casos específicos identificados
    if (title.includes('demostrar generación de documentación')) {
      return 'el generador de documentación debe estar configurado correctamente';
    }
    
    if (title.includes('letras en el campo de número') && title.includes('ignoren')) {
      return 'las letras deben ser ignoradas y el campo debe permanecer vacío';
    }
    
    if (title.includes('número de celular que contenga letras') && title.includes('ignoradas')) {
      return 'las letras deben ser ignoradas y solo deben mantenerse los números';
    }
    
    // Expectativas para tests de foco
    if (title.includes('foco')) {
      return 'el campo número de celular debe tener el foco';
    }
    
    // Expectativas para tests de botones
    if (title.includes('deshabilitado') && title.includes('botón')) {
      if (title.includes('iniciar sesión')) {
        return 'el botón de iniciar sesión debe estar deshabilitado';
      }
      return 'el botón correspondiente debe estar deshabilitado';
    }
    
    if (title.includes('habilitado') && title.includes('botón')) {
      if (title.includes('iniciar sesión')) {
        return 'el botón de iniciar sesión debe estar habilitado';
      }
      if (title.includes('registrarse')) {
        return 'el botón de registrarse debe estar habilitado';
      }
      if (title.includes('invitado')) {
        return 'el botón de ingresar como invitado debe estar habilitado';
      }
      return 'el botón correspondiente debe estar habilitado';
    }
    
    // Expectativas para tests de mensajes de error
    if (title.includes('mensaje de error') || title.includes('muestre un mensaje')) {
      if (title.includes('longitud')) {
        return 'se debe mostrar un mensaje de error sobre la longitud mínima';
      }
      if (title.includes('formato')) {
        return 'se debe mostrar un mensaje de error sobre el formato';
      }
      return 'se debe mostrar el mensaje de error correspondiente';
    }
    
    // Expectativas para tests de ignorar caracteres
    if (title.includes('ignoren') || title.includes('ignoradas')) {
      if (title.includes('letras')) {
        return 'las letras deben ser ignoradas y no aparecer en el campo';
      }
      if (title.includes('caracteres especiales')) {
        return 'los caracteres especiales deben ser ignorados';
      }
      return 'los caracteres no válidos deben ser ignorados';
    }
    
    // Expectativas para tests de calendario
    if (title.includes('calendario')) {
      if (title.includes('muestre') && title.includes('defecto')) {
        return 'el calendario debe mostrar el año y mes correcto para usuarios de mayoría de edad';
      }
      if (title.includes('navegar') && title.includes('meses futuros')) {
        return 'no se debe permitir navegar a meses que resultarían en menor de edad';
      }
      if (title.includes('navegar') && title.includes('flechas')) {
        return 'se debe poder navegar entre meses usando las flechas de navegación';
      }
      if (title.includes('cerrar') && title.includes('sin seleccionar')) {
        return 'el calendario debe cerrarse correctamente sin seleccionar fecha';
      }
    }
    
    // Expectativas para tests de selección de fecha
    if (title.includes('seleccionar') && title.includes('fecha')) {
      if (title.includes('válida') && title.includes('más de 18')) {
        return 'se debe poder seleccionar una fecha que haga al usuario mayor de edad';
      }
      if (title.includes('no se puede') && title.includes('17 años')) {
        return 'no se debe permitir seleccionar fechas que resulten en menor de edad';
      }
      return 'la selección de fecha debe funcionar correctamente';
    }
    
    // Expectativas para tests de popup
    if (title.includes('popup') || title.includes('ayuda')) {
      return 'se debe mostrar el popup de ayuda con la información correcta';
    }
    
    // Expectativas para tests de validación de elementos
    if (title.includes('presencia') || title.includes('elementos')) {
      return 'todos los elementos de la página deben estar presentes y visibles';
    }
    
    // Análisis de acciones para contexto adicional
    const hasValidation = actions.some(action => 
      action.methodName.includes('validate') || action.methodName.includes('verify')
    );
    
    if (hasValidation) {
      return 'las validaciones deben ejecutarse correctamente';
    }
    
    // Expectativa genérica pero más específica que antes
    return 'el comportamiento del sistema debe ser el correcto';
  }
}

// Interfaces auxiliares
interface TestCase {
  title: string;
  lineNumber: number;
  actions: CodeAction[];
  expectations: CodeExpectation[];
}

interface CodeAction {
  methodName: string;
  parameters: string[];
  description: string;
}

interface CodeExpectation {
  methodName: string;
  parameters: string[];
  description: string;
}
