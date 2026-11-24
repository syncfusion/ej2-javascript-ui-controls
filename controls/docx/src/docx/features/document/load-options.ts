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
     *
     * @private
     */
    readonly limits?: ResourceLimitOverrides;
    /**
     * Specifies the password used to open an encrypted document. The password is ignored for a document that is not encrypted.
     * The password is not stored in error messages or in public properties of the document.
     *
     * @example
     * const document = await Document.openAsync(data, { password: 'syncfusion' });
     * @public
     */
    readonly password?: string;
}
