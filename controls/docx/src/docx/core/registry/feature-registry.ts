import { DocxError } from '../errors/docx-error';

/**
 * Stable feature module identifier (e.g. `tables`). Branded so it is not mixed
 * with relationship or style IDs.
 */
export type FeatureId = string & { readonly __brand: 'FeatureId' };

export function featureId(value: string): FeatureId {
    if (value.length === 0 || !/^[a-z][a-z0-9-]*$/.test(value)) {
        throw new DocxError('feature/invalid-id', `Invalid feature id: ${value}`);
    }
    return value as FeatureId;
}

/**
 *  Internal feature registration interface. Not part of the public API.
 *
 * @private
 */
export interface FeatureRegistration {
    readonly id: FeatureId;
}

const registrations: Map<string, FeatureRegistration> = new Map<string, FeatureRegistration>();

/**
 * @returns {void} Nothing is returned.
 *  Test hook. Not part of the public API.
 *
 * @private
 */
export function resetFeatureRegistry(): void {
    registrations.clear();
}

/**
 * @param {FeatureRegistration} registration - The registration.
 * @returns {void} Nothing is returned.
 *  Internal feature registration. Not part of the public API.
 *
 * @private
 */
export function registerFeature(registration: FeatureRegistration): void {
    registrations.set(registration.id, registration);
}

/**
 * @param {string} id - The id.
 * @returns {FeatureRegistration} The result.
 *  Internal feature lookup. Not part of the public API.
 * Require a registered feature. Unknown ids throw `UNKNOWN_FEATURE`
 *
 * @private
 */
export function ensureFeature(id: string): FeatureRegistration {
    const found: FeatureRegistration = registrations.get(id);
    if (found === undefined) {
        throw new DocxError('feature/not-registered', `Feature is not registered: ${id}`);
    }
    return found;
}

/**
 * @param {string} id - The id.
 * @returns {boolean} The result.
 *  Internal feature query. Not part of the public API.
 *
 * @private
 */
export function isFeatureRegistered(id: string): boolean {
    return registrations.has(id);
}
