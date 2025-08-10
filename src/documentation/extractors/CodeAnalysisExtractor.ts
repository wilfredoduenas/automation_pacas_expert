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
    // Mapeos específicos para diferentes métodos
    if (methodName.includes('fillCredentialsPhone')) {
      if (parameters[0] === '' || parameters[0] === '""') {
        return 'el usuario borra la entrada del campo número de celular';
      }
      return `el usuario ingresa "${parameters[0]}" en el campo número de celular`;
    }
    
    if (methodName.includes('setupRulesTest')) {
      return 'el usuario se encuentra en la página de login';
    }
    
    if (methodName.includes('setupValidationTest')) {
      return 'el usuario se encuentra en la página';
    }
    
    if (methodName.includes('click')) {
      return `el usuario hace clic en ${parameters[0] || 'el elemento'}`;
    }
    
    if (methodName.includes('fill')) {
      return `el usuario completa el campo con "${parameters[0] || ''}"`;
    }
    
    if (methodName.includes('select')) {
      return `el usuario selecciona "${parameters[0] || ''}"`;
    }
    
    if (methodName.includes('navigate')) {
      return `el usuario navega a ${parameters[0] || 'la página'}`;
    }
    
    // Descripción genérica si no encuentra mapeo específico
    if (parameters.length > 0 && parameters[0] !== '') {
      return `el usuario ejecuta ${methodName} con "${parameters[0]}"`;
    } else {
      return `el usuario ejecuta ${methodName}`;
    }
  }
  
  /**
   * Genera descripción para expectations
   */
  private generateExpectationDescription(methodName: string, parameters: string[]): string {
    // Mapeos específicos para diferentes expectations
    if (methodName.includes('expectCredentialsPhoneErrorMessageToHaveText')) {
      return `se muestra el mensaje de error: "${parameters[0] || 'mensaje de error'}"`;
    }
    
    if (methodName.includes('expectCredentialsPhoneRequiredMessageVisible')) {
      return 'el mensaje de campo requerido debe estar visible';
    }
    
    if (methodName.includes('expectCredentialsPhoneRequiredMessageToHaveText')) {
      return `se muestra el mensaje de error: "${parameters[0] || 'mensaje requerido'}"`;
    }
    
    if (methodName.includes('expectCredentialsSignInButtonDisabled')) {
      return 'el botón de iniciar sesión debe estar deshabilitado';
    }
    
    if (methodName.includes('expectCredentialsSignInButtonEnabled')) {
      return 'el botón de iniciar sesión debe estar habilitado';
    }
    
    if (methodName.includes('expectVisible')) {
      return 'el elemento debe estar visible';
    }
    
    if (methodName.includes('expectToHaveText')) {
      return `debe mostrar el texto "${parameters[0] || 'texto'}"`;
    }
    
    if (methodName.includes('expectDisabled')) {
      return 'debe estar deshabilitado';
    }
    
    if (methodName.includes('expectEnabled')) {
      return 'debe estar habilitado';
    }
    
    if (methodName.includes('expectFocused')) {
      return 'debe tener el foco';
    }
    
    if (methodName.includes('expect') && parameters.length > 0) {
      return `debe cumplir ${methodName} con "${parameters[0]}"`;
    }
    
    // Descripción genérica para cualquier expectation
    return `debe cumplir ${methodName}`;
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
    
    // Si no hay expectations, generar basándose en el contexto del test
    if (thenSteps.length === 0) {
      const contextualExpectation = this.generateContextualExpectation(testCase.title, testCase.actions);
      thenSteps.push(contextualExpectation);
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
