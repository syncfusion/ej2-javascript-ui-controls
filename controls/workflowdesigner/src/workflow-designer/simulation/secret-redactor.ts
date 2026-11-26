const SECRET_KEYS: string[] = ['password', 'passwd', 'token', 'apikey', 'secret', 'authorization', 'credential', 'authref',
    'cookie', 'privatekey', 'signature', 'clientsecret', 'accesstoken', 'refreshtoken'];

/**
 * Whether a property name looks like it holds a secret. Separators and case are ignored, and a name
 * matches when it is, or ends with, one of the secret words (so `x-api-key`, `access_token` and
 * `Proxy-Authorization` match, while `tokenCount` does not).
 *
 * @param {string} key - The property name.
 * @returns {boolean} `true` for a secret-looking name.
 */
function isSecretKey(key: string): boolean {
    const normalized: string = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    return SECRET_KEYS.some((word: string) => normalized === word
        || (normalized.length > word.length && normalized.substring(normalized.length - word.length) === word));
}

/**
 * Redacts credentials and configured sensitive fields from logs and errors.
 *
 * @private
 */
export class SecretRedactor {
    /**
     * Redact.
     *
     * @param {Object} value The value.
     * @returns {Object} The result.
     * @private
     */
    public static redact(value: unknown): unknown {
        if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            return value;
        }
        if (Array.isArray(value)) {
            return value.map((item: unknown) => SecretRedactor.redact(item));
        }
        if (value && typeof value === 'object') {
            const result: Record<string, unknown> = {};
            Object.keys(value as Record<string, unknown>).forEach((key: string) => {
                if (isSecretKey(key)) {
                    result[`${key}`] = '[REDACTED]';
                } else {
                    result[`${key}`] = SecretRedactor.redact((value as Record<string, unknown>)[`${key}`]);
                }
            });
            return result;
        }
        return undefined;
    }
}
