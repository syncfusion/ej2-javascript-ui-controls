import { L10n } from '@syncfusion/ej2-base';
import { localeDefaults } from './locale-defaults';

/**
 * The localization of the Workflow Designer instance whose code is currently running.
 *
 * Several helpers (expression and schedule evaluators, request executors and the property-panel
 * editors) are shared by all instances on a page. Instead of a global locale that the last
 * instance overwrites, each instance makes itself current at every synchronous entry point: its
 * public methods, each step of a run, and every user event inside its element (capture-phase
 * listeners run before any editor handler). JavaScript runs each of those segments to completion,
 * so the current locale always belongs to the instance that is executing. Code that resumes after
 * an `await` must capture the translator at entry (see `ApiRequestExecutor.execute`) or rebind.
 *
 * @private
 */
export class LocaleContext {
    private static active: L10n | undefined;

    /**
     * Makes the given localization current.
     *
     * @param {L10n} [l10n] - The instance localization.
     * @returns {void}
     */
    public static set(l10n?: L10n): void {
        LocaleContext.active = l10n;
    }

    /**
     * Returns the current localization, if any.
     *
     * @returns {L10n | undefined} The current localization.
     */
    public static current(): L10n | undefined {
        return LocaleContext.active;
    }

    /**
     * Resolves a key in the current localization, falling back to the given default.
     *
     * @param {string} key - The locale key.
     * @param {string} [fallback] - Text used when the key isn't localized; defaults to the built-in English.
     * @param {L10n} [l10n] - A localization captured earlier; defaults to the current one.
     * @returns {string} The localized text.
     */
    public static text(key: string, fallback?: string, l10n?: L10n): string {
        const source: L10n | undefined = l10n || LocaleContext.active;
        if (source) {
            const value: string = source.getConstant(key);
            if (value) {
                return value;
            }
        }
        return fallback || localeDefaults[`${key}`] || key;
    }
}
