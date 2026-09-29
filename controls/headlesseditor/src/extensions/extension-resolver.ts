/**
 * Extension flattener that resolves nested extensions and removes duplicates.
 *
 * @module extensions/extension-resolver
 */

import type { ExtensionDefinition, ExtensionScope, FlattenedExtension } from './types';

/**
 * Flattens nested extensions into a single list with registration order.
 */
export class ExtensionResolver {
    /**
     * Resolves the supplied extensions into a final registration order.
     *
     * @param {ExtensionDefinition[]} extensions - Extensions to resolve.
     * @returns {FlattenedExtension[]} Flattened extensions in registration order.
     * @hidden
     */
    public resolve(extensions: readonly ExtensionDefinition<object>[]): FlattenedExtension[] {
        // Flatten nested extensions and remove duplicates.
        const flattenedExtensions: FlattenedExtension[] = this.flatten(extensions);
        // Return the flattened extensions.
        return flattenedExtensions;
    }

    /**
     * Collects all extensions and their child extensions into a single list,
     * removes duplicate extensions, and preserves registration order.
     *
     * @param {ExtensionDefinition[]} extensions - Root extensions (may include presets)
     * @returns {FlattenedExtension[]} Flattened extensions with registration order
     */
    private flatten(extensions: readonly ExtensionDefinition<object>[]): FlattenedExtension[] {
        // Stores the final flattened list of extensions.
        const flattenedExtensions: FlattenedExtension[] = [];
        // Tracks processed extensions to avoid duplicates.
        const processedExtensionNames: Set<string> = new Set<string>();
        // Registration order assigned when an extension is first encountered.
        let registrationOrder: number = 0;
        // Type definition for the recursive flattening function.
        type FlattenRecursive = (extensionsToProcess: readonly ExtensionDefinition<object>[]) => void;
        // Recursively processes extensions and their child extensions.
        const flattenRecursive: FlattenRecursive = (extensionsToProcess: readonly ExtensionDefinition<object>[]): void => {
            // Traverse the current set of extensions.
            for (const extension of extensionsToProcess) {
                const name: string = extension.name;
                // Add the extension only if it hasn't been processed already.
                if (!processedExtensionNames.has(name)) {
                    processedExtensionNames.add(name);
                    // Add the extension with its registration order.
                    flattenedExtensions.push({
                        definition: extension,
                        registrationOrder: registrationOrder++
                    });
                }
                // Check whether the current extension contributes additional extensions.
                const addExtensionsFn: ((this: ExtensionScope<object>) =>
                readonly ExtensionDefinition<object>[]) | undefined = extension.config.addExtensions;
                if (addExtensionsFn) {
                    // Create the scope passed to addExtensions().
                    const scope: ExtensionScope<object> = {
                        name: extension.name,
                        options: extension.config.defineOptions?.() ?? {}
                    };
                    // Retrieve extensions contributed by the current extension.
                    const childExtensions: readonly ExtensionDefinition<object>[] = addExtensionsFn.call(scope);
                    // Recursively process child extensions
                    if (childExtensions.length > 0) {
                        flattenRecursive(childExtensions);
                    }
                }
            }
        };
        // Start flattening from the root extensions.
        flattenRecursive(extensions);
        // Return the flattened extension list.
        return flattenedExtensions;
    }
}
