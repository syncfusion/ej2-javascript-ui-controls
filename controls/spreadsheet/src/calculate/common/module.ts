import { ModuleDeclaration } from '@syncfusion/ej2-base';
import { Calculate } from '../base/index';

/**
 * Represents the getModules function.
 * @param {Calculate} context
 */
export function getModules(context: Calculate): ModuleDeclaration[] {
    let modules: ModuleDeclaration[] = [];
    if (context.includeBasicFormulas) {
        modules.push({
            member: 'basic-formulas',
            args: [context]
        });
    }
    return modules;
}