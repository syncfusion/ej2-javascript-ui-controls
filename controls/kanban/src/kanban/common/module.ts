import { ModuleDeclaration } from '@syncfusion/ej2-base';
import { Kanban } from '../base/kanban';

/**
 * Inject WebMcpAdapter module when enableWebMcp is true.
 * Called from pushBasicModules() to conditionally register the adapter.
 *
 * @param {Kanban} context - The Kanban component instance
 * @param {ModuleDeclaration[]} modules - Array of modules to be registered
 * @returns {void}
 *
 */
export function pushBasicModules(context: Kanban, modules: ModuleDeclaration[]): void {
    if (context.enableWebMcp) {
        modules.push({ member: 'WebMcpAdapter', args: [context] });
    }
}
