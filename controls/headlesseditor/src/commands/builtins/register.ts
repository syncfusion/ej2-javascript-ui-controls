/**
 * register.ts — Registers all built-in commands into a CommandRegistry.
 *
 * Call this once during editor initialization, before any extensions are loaded.
 */
import { CommandRegistry } from '../registry';
import { defaultInjectableCommands } from './default-commands';

/**
 * Registers framework-level internal commands.
 *
 * Internal commands are editor infrastructure and are always
 * available regardless of enabled extensions.
 *
 * @param {CommandRegistry} registry - Target registry.
 * @returns {void}
 */
export function registerInternalCommands(registry: CommandRegistry): void {

    for (const command of defaultInjectableCommands) {
        registry.register(command, 'builtin');
    }
}
