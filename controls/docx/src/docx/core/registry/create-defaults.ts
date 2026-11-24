/**
 * Feature-owned default state attached when {@link WordDocument.create} builds a
 * fresh, empty document (for example Word's own default `settings.xml`
 * content). Mirrors the shape of the owning module, but runs
 * once at construction time instead of on every save, and never runs for
 * `WordDocument.fromPackage` / `WordDocument.openSync` — a loaded package that has no
 * state for a given feature keeps round-tripping without gaining any.
 *
 * @private
 */
import { FeatureMultiPackagePart } from '../../features/document/feature-multi-package-part';
import { FeaturePackageLevelPart } from '../../features/document/feature-package-level-part';
import { FeaturePackagePart } from '../../features/document/feature-package-part';
import { FeatureId } from './feature-registry';
/**
 * @private
 * Minimal document surface required to attach a create-time default part. */
export interface FeatureCreateDefaultsTarget {
    setFeaturePart(id: FeatureId, part: FeaturePackagePart | FeatureMultiPackagePart | FeaturePackageLevelPart): void;
}
/**
 * @private
 */
export interface FeatureCreateDefaultHandler {
    readonly featureId: FeatureId;
    attachCreateDefault(document: FeatureCreateDefaultsTarget): void;
}
const handlers: FeatureCreateDefaultHandler[] = [];
/**
 * @returns {void} Nothing is returned.
 * @private
 * Test hook
 */
export function resetFeatureCreateDefaultHandlers(): void {
    handlers.length = 0;
}
/**
 * @param {FeatureCreateDefaultHandler} handler - The handler.
 * @returns {void} Nothing is returned.
 * @private
 */
export function registerFeatureCreateDefaultHandler(handler: FeatureCreateDefaultHandler): void {
    handlers.push(handler);
}
/**
 * @param {FeatureCreateDefaultsTarget} document - The document.
 * @returns {void} Nothing is returned.
 * @private
 * Run every registered feature create-default pass, in registration order.
 */
export function attachFeatureCreateDefaults(document: FeatureCreateDefaultsTarget): void {
    for (const handler of handlers) {
        handler.attachCreateDefault(document);
    }
}
