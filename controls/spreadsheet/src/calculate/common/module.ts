import { ModuleDeclaration } from '@syncfusion/ej2-base';
import { Calculate } from '../base/index';

/**
 * Represents the getModules function.
 *
 * @param {Calculate} context - specify the context
 * @returns {ModuleDeclaration[]} - Represents the getModules function.
 */
export function getModules(context: Calculate): ModuleDeclaration[] {
    const modules: ModuleDeclaration[] = [];
    if (context.includeBasicFormulas) {
        modules.push({
            member: 'basic-formulas',
            args: [context]
        });
    }
    return modules;
}
