/**
 * Safe expression evaluation for `{{$.path}}` and raw `$.path` values.
 * Supports dotted identifiers and bracket keys (including spaces):
 *   $.input.response.Price
 *   $.input.response["Delivery date"]
 * Does not use eval and rejects prototype traversal and function invocation.
 */
import { L10n } from '@syncfusion/ej2-base';
import { LocaleContext } from '../localization/locale-context';
import { localeDefaults } from '../localization/locale-defaults';

/** Path body after `$`: dots, brackets, quotes, spaces inside brackets. */
// `+` (not `*`) so `$.` alone is rejected — `normalizePath('$')` must return null.
const PATH_BODY: string = '(?:\\.[A-Za-z0-9_]+|\\[(?:\'[^\']*\'|"[^"]*"|[^\\]]+)\\])+';
const LOOSE_PATH_BODY: string = '(?:\\.[A-Za-z0-9_]+|\\[(?:\'[^\']*\'|"[^"]*"|[^\\]]+)\\])*';
const EXPRESSION_INNER: RegExp = new RegExp('\\{\\{\\s*(\\$' + LOOSE_PATH_BODY + ')\\s*\\}\\}', 'g');
const FULL_EXPRESSION: RegExp = new RegExp('^\\{\\{\\s*(\\$' + PATH_BODY + ')\\s*\\}\\}$');
const RAW_PATH_PATTERN: RegExp = new RegExp('^\\$' + PATH_BODY + '$');
// Lowercased to support case-insensitive comparison against the lowercased
// segment read from segments(), so `$.input.function` is rejected.
const FORBIDDEN_SEGMENTS: string[] = ['__proto__', 'prototype', 'constructor', 'globalthis', 'window', 'document', 'function'];
const SECRET_SEGMENTS: string[] = ['password', 'token', 'apikey', 'secret', 'authorization', 'credential', 'authref', 'credentialref'];

/**
 * Expression Evaluator.
 *
 * @private
 */
export class ExpressionEvaluator {


    /**
     * Resolves a translation key against the shared L10n instance.
     * Diagnostic codes (`EXPRESSION_SYNTAX`) live on the caller's
     * `WorkflowValidationMessage.code` and never travel through this method.
     *
     * @param {string} key - The localization key to resolve.
     * @param {L10n} l10n - Optional localization provider.
     * @returns {string} The translated string, or the English fallback.
     * @private
     */
    private static t(key: string, l10n?: L10n): string {
        return LocaleContext.text(key, localeDefaults[`${key}`], l10n);
    }

    /**
     * Validate Syntax.
     *
     * @param {string} value The value.
     * @returns {string} The result.
     * @private
     */
    public static validateSyntax(value: string): string | null {
        if (value.indexOf('{{') === -1 && value.indexOf('$.') !== 0) {
            return null;
        }
        if (RAW_PATH_PATTERN.test(value)) {
            return ExpressionEvaluator.validatePath(value);
        }
        const opens: number = (value.match(/\{\{/g) || []).length;
        const closes: number = (value.match(/\}\}/g) || []).length;
        if (opens !== closes) {
            return ExpressionEvaluator.t('validationExpressionUnbalanced');
        }
        EXPRESSION_INNER.lastIndex = 0;
        let match: RegExpExecArray | null = EXPRESSION_INNER.exec(value);
        let found: boolean = false;
        while (match) {
            found = true;
            const error: string | null = ExpressionEvaluator.validatePath(match[1]);
            if (error) {
                return error;
            }
            match = EXPRESSION_INNER.exec(value);
        }
        // Spaced dotted keys like {{$.input.response.Delivery date}} are invalid
        // unless normalized; still report when delimiters exist but no path matched.
        if (!found && value.indexOf('{{') !== -1) {
            const looseWrapped: RegExpExecArray | null = /^\{\{\s*(\$[^}]+?)\s*\}\}$/.exec(value.trim());
            if (looseWrapped) {
                const normalized: string | null = ExpressionEvaluator.tryLoosePath(looseWrapped[1].trim());
                if (normalized) {
                    return ExpressionEvaluator.validatePath(normalized);
                }
            }
            return ExpressionEvaluator.t('validationExpressionSyntax');
        }
        return null;
    }

    /**
     * Resolve.
     *
     * @param {Object} value The value.
     * @param {Object} context The context.
     * @returns {Object} The result.
     * @private
     */
    public static resolve(value: unknown, context: unknown): unknown {
        if (typeof value !== 'string') {
            return value;
        }
        const trimmed: string = value.trim();
        if (RAW_PATH_PATTERN.test(trimmed)) {
            return ExpressionEvaluator.readPath(trimmed, context);
        }
        if (trimmed.indexOf('{{') === -1) {
            // Try to parse JSON literals (arrays, objects, booleans, null, numbers)
            // This allows direct literals like [1,2,3], {"key":"value"}, true, false, 123, etc.
            if ((trimmed.startsWith('[') && trimmed.endsWith(']')) ||
                (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
                trimmed === 'true' ||
                trimmed === 'false' ||
                trimmed === 'null' ||
                (!isNaN(Number(trimmed)) && trimmed !== '')) {
                try {
                    return JSON.parse(trimmed);
                } catch (e) {
                    // If JSON parsing fails, fall through to other logic
                }
            }
            // Tolerant fallback: dotted path with spaces, e.g. $.input.response.Delivery date
            const loose: string | null = ExpressionEvaluator.tryLoosePath(trimmed);
            if (loose) {
                return ExpressionEvaluator.readPath(loose, context);
            }
            return value;
        }
        const full: RegExpExecArray | null = FULL_EXPRESSION.exec(trimmed);
        if (full) {
            return ExpressionEvaluator.readPath(full[1], context);
        }
        // Whole-string expression with spaced segments (legacy suggestions).
        const looseWrapped: RegExpExecArray | null = /^\{\{\s*(\$[^}]+?)\s*\}\}$/.exec(trimmed);
        if (looseWrapped) {
            const normalized: string | null = ExpressionEvaluator.tryLoosePath(looseWrapped[1].trim());
            if (normalized) {
                return ExpressionEvaluator.readPath(normalized, context);
            }
        }
        return value.replace(EXPRESSION_INNER, (_all: string, path: string) => {
            try {
                const resolved: unknown = ExpressionEvaluator.readPath(path, context);
                return resolved === undefined || resolved === null ? '' : String(resolved);
            } catch (_error) {
                return '';
            }
        });
    }

    /**
     * Resolve Deep.
     *
     * @param {Object} value The value.
     * @param {Object} context The context.
     * @returns {Object} The result.
     * @private
     */
    public static resolveDeep(value: unknown, context: unknown): unknown {
        if (typeof value === 'string') {
            return ExpressionEvaluator.resolve(value, context);
        }
        if (Array.isArray(value)) {
            return value.map((item: unknown) => ExpressionEvaluator.resolveDeep(item, context));
        }
        if (value && typeof value === 'object') {
            const result: Record<string, unknown> = {};
            Object.keys(value as Record<string, unknown>).forEach((key: string) => {
                // Expression keys are copied from user-provided object data.
                // eslint-disable-next-line security/detect-object-injection
                result[key] = ExpressionEvaluator.resolveDeep((value as Record<string, unknown>)[key], context);
            });
            return result;
        }
        return value;
    }

    /**
     * Validate Path.
     *
     * @param {string} path The path.
     * @returns {string} The result.
     * @private
     */
    public static validatePath(path: string): string | null {
        if (path.charAt(0) !== '$') {
            return ExpressionEvaluator.t('validationExpressionRoot');
        }
        const segments: string[] = ExpressionEvaluator.segments(path);
        for (let i: number = 0; i < segments.length; i++) {
            const segment: string = segments[parseInt(i.toString(), 10)].toLowerCase();
            if (FORBIDDEN_SEGMENTS.indexOf(segment) !== -1) {
                return ExpressionEvaluator.t('validationExpressionForbidden');
            }
            if (SECRET_SEGMENTS.indexOf(segment) !== -1) {
                return ExpressionEvaluator.t('validationExpressionSecret');
            }
        }
        const roots: string[] = ['input', 'previousStep', 'nodes', 'loop', 'variables'];
        if (segments.length === 0 || roots.indexOf(segments[0]) === -1) {
            // Name the bad root and list the valid ones; hand-typed item paths
            // are the common mistake, so point to the current-item path.
            return ExpressionEvaluator.t('validationExpressionUnknownRoot')
                .replace('{0}', segments.length ? segments[0] : '')
                .replace('{1}', roots.join(', '));
        }
        return null;
    }

    /**
     * Read Path.
     *
     * @param {string} path The path.
     * @param {Object} context The context.
     * @returns {Object} The result.
     * @private
     */
    public static readPath(path: string, context: unknown): unknown {
        if (ExpressionEvaluator.validatePath(path)) {
            throw new Error('Invalid expression path.');
        }
        const segments: string[] = ExpressionEvaluator.segments(path);
        let current: unknown = context;
        for (let i: number = 0; i < segments.length; i++) {
            if (!current || typeof current !== 'object') {
                return undefined;
            }
            const segment: string = segments[parseInt(i.toString(), 10)];
            if (Object.prototype.hasOwnProperty.call(current, segment)) {
                // Path segments are validated user-provided object keys.
                // eslint-disable-next-line security/detect-object-injection
                current = (current as Record<string, unknown>)[segment];
            } else {
                return undefined;
            }
        }
        if (typeof current === 'function') {
            return undefined;
        }
        return current;
    }

    /**
     * Split `$.a.b["c d"].e` into ['a','b','c d','e'].
     * Also accepts unquoted bracket keys: $.a[b c]
     *
     * @param {string} path - Expression path to split.
     * @returns {string[]} Path segments.
     * @private
     */
    public static segments(path: string): string[] {
        const trimmed: string = path.charAt(0) === '$' ? path.substring(1) : path;
        const parts: string[] = [];
        const re: RegExp = /\.([A-Za-z0-9_]+)|\[(?:'([^']*)'|"([^"]*)"|([^\]]+))\]/g;
        let match: RegExpExecArray | null = re.exec(trimmed);
        while (match) {
            const part: string = match[1] || match[2] || match[3] || (match[4] ? match[4].trim() : '');
            if (part) {
                parts.push(part);
            }
            match = re.exec(trimmed);
        }
        return parts;
    }

    /**
     * Encode a single path segment: identifier stays dotted, otherwise bracket-quoted.
     *
     * @param {string} key - Path segment to encode.
     * @returns {string} Encoded path segment.
     * @private
     */
    public static encodeSegment(key: string): string {
        if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
            return '.' + key;
        }
        const escaped: string = String(key).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        return '["' + escaped + '"]';
    }

    /**
     * Joins a root path and dynamic path segments.
     *
     * @param {string} root - Root expression path.
     * @param {string[]} keys - Path segments to append.
     * @returns {string} Combined expression path.
     * @private
     */
    public static joinPath(root: string, ...keys: string[]): string {
        let path: string = root;
        for (let i: number = 0; i < keys.length; i++) {
            path += ExpressionEvaluator.encodeSegment(keys[parseInt(i.toString(), 10)]);
        }
        return path;
    }

    /**
     * Normalize a path string (optional `{{ }}` wrapper) into a readable `$.…` form.
     * Converts legacy spaced dotted tails into bracket keys when needed.
     * Example: {{$.input.response.Ticket ID}} → $.input.response["Ticket ID"]
     *
     * @param {string} value - Path value to normalize.
     * @returns {string | null} Normalized expression path, when valid.
     * @private
     */
    public static normalizePath(value: string): string | null {
        if (!value || typeof value !== 'string') {
            return null;
        }
        let trimmed: string = value.trim();
        const wrapped: RegExpExecArray | null = /^\{\{\s*(.+?)\s*\}\}$/.exec(trimmed);
        if (wrapped) {
            trimmed = wrapped[1].trim();
        }
        if (!trimmed || trimmed.charAt(0) !== '$') {
            return null;
        }
        if (RAW_PATH_PATTERN.test(trimmed)) {
            return trimmed;
        }
        return ExpressionEvaluator.tryLoosePath(trimmed);
    }

    /**
     * Convert legacy spaced dotted paths into bracket form when possible.
     * Example: $.input.response.Delivery date → $.input.response["Delivery date"]
     * Example: $.input.response.Ticket ID → $.input.response["Ticket ID"]
     *
     * Important: the first word of a spaced key (Ticket) is a valid identifier, so a
     * naive "prefix + remainder after space" split would produce Ticket["ID"]. Instead,
     * when remainder starts with whitespace, fold the last segment + remainder into one key.
     *
     * @param {string} value - Legacy path value to convert.
     * @returns {string | null} Converted expression path, when valid.
     */
    private static tryLoosePath(value: string): string | null {
        if (!value || value.charAt(0) !== '$') {
            return null;
        }
        if (RAW_PATH_PATTERN.test(value)) {
            return value;
        }
        const body: string = value.substring(1);
        const re: RegExp = /\.([A-Za-z0-9_]+)|\[(?:'([^']*)'|"([^"]*)"|([^\]]+))\]/g;
        const parts: string[] = [];
        let lastIndex: number = 0;
        let match: RegExpExecArray | null = re.exec(body);
        while (match) {
            if (match.index !== lastIndex) {
                break;
            }
            const part: string = match[1] || match[2] || match[3] || (match[4] ? match[4].trim() : '');
            if (part) {
                parts.push(part);
            }
            lastIndex = re.lastIndex;
            match = re.exec(body);
        }
        const remainder: string = body.substring(lastIndex);
        if (!remainder) {
            return parts.length > 0 ? ExpressionEvaluator.joinPath('$', ...parts) : null;
        }
        // "Ticket ID" → last dotted token was "Ticket", remainder is " ID".
        // "order-id" → last dotted token was "order", remainder is "-id": the same single key.
        if (/^[^.[]/.test(remainder) && parts.length > 0) {
            const key: string = (parts[parts.length - 1] + remainder).replace(/^\s+|\s+$/g, '');
            if (!key) {
                return null;
            }
            const prefixParts: string[] = parts.slice(0, -1);
            const combined: string = ExpressionEvaluator.joinPath('$', ...prefixParts, key);
            if (ExpressionEvaluator.segments(combined).length > 0) {
                return combined;
            }
            return null;
        }
        // Non-space leftover after a valid prefix (rare): treat as one trailing key.
        const rest: string = remainder.replace(/^\./, '').replace(/^\s+|\s+$/g, '');
        if (rest && parts.length > 0) {
            const combined: string = ExpressionEvaluator.joinPath('$', ...parts, rest);
            if (ExpressionEvaluator.segments(combined).length > 0) {
                return combined;
            }
        }
        return null;
    }
}

