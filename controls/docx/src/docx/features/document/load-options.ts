import { ResourceLimitOverrides } from '../../core/security/limits';
/**
 * Options for {@link WordDocument.open}, {@link WordDocument.openSync}, and
 * {@link WordDocument.openAsync}.
 *
 * @public
 */
export interface LoadOptions {
    /**
     * Overrides for ZIP and XML resource limits. Unspecified fields keep the
     * defaults in `.agent/policies/security.md`.
     * @private
     */
    readonly limits?: ResourceLimitOverrides;
}
