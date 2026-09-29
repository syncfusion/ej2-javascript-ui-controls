/**
 * Creates immutable extension definitions.
 *
 */

import type { ExtensionConfig, ExtensionDefinition } from './types';

/**
 * Creates an immutable extension definition from the given configuration.
 *
 * @param {ExtensionConfig} config - Extension configuration.
 * @returns {ExtensionDefinition} Immutable extension definition.
 */
export function defineExtension<TOptions extends object = object>
(config: ExtensionConfig<TOptions>): ExtensionDefinition<TOptions> {
    // Validate the extension name.
    if (!config.name.trim()) {
        throw new Error('Extension name cannot be empty.');
    }

    // Create the immutable extension definition.
    const definition: ExtensionDefinition<TOptions> = {
        // Unique extension name.
        name: config.name,
        // Store the original configuration.
        config: config,
        /**
         * Creates a new extension with updated options.
         *
         * Existing options are preserved and the supplied options override them.
         *
         * @param {Partial<TOptions>} options - Option overrides.
         * @returns {ExtensionDefinition} New configured extension.
         */
        configure(options: Partial<TOptions>): ExtensionDefinition<TOptions> {
            // Merge the option values with the supplied options.
            const updatedConfig: ExtensionConfig<TOptions> = {
                ...config,
                defineOptions: (): TOptions => ({
                    ...(config.defineOptions?.() ?? {}),
                    ...options
                }) as TOptions
            };
            // Return a new immutable extension.
            return defineExtension(updatedConfig);
        },
        /**
         * Creates a new extension by overriding its configuration.
         *
         * @param {Partial<ExtensionConfig<TOptions>>} overrides - Configuration overrides.
         * @returns {ExtensionDefinition} New extension definition.
         */
        extend(overrides: Partial<ExtensionConfig<TOptions>>): ExtensionDefinition<TOptions> {
            // Merge the current configuration with the overrides.
            const updatedConfig: ExtensionConfig<TOptions> = {
                ...config,
                ...overrides
            };
            if (config.keyboardShortcuts && overrides.keyboardShortcuts) {
                const parentShortcuts: ExtensionConfig<TOptions>['keyboardShortcuts'] = config.keyboardShortcuts;
                const overrideShortcuts: ExtensionConfig<TOptions>['keyboardShortcuts'] = overrides.keyboardShortcuts;
                updatedConfig.keyboardShortcuts = function (this: unknown, ...args: unknown[]): Record<string, () => boolean> {
                    const ctx: unknown = args[0];
                    type ShortcutMapFn = (...a: unknown[]) => Record<string, () => boolean>;
                    const parentMap: Record<string, () => boolean> =
                        (parentShortcuts as ShortcutMapFn).call(this, ctx) ?? {};
                    const overrideMap: Record<string, () => boolean> =
                        (overrideShortcuts as ShortcutMapFn).call(this, ctx) ?? {};
                    return { ...parentMap, ...overrideMap };
                } as ExtensionConfig<TOptions>['keyboardShortcuts'];
            }
            // Return a new immutable extension.
            return defineExtension(updatedConfig);
        }
    };
    // Prevent runtime modification of the definition.
    return Object.freeze(definition);
}
