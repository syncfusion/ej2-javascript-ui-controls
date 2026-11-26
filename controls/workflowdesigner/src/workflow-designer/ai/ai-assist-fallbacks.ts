import { localeDefaults } from '../localization/locale-defaults';

/**
 * Shared English fallback chrome for the AI Assist UI.
 *
 * Both `AIAssistController` (floating button, question card, fallback
 * panel) and `AIAssistSettingsDialog` (configuration dialog) resolve
 * their visible DOM text through this table when the L10n bundle does
 * not supply a translation. Persisted workflow JSON properties, the
 * `WorkflowAIAssistTransportMode` enum values (`Direct`, `Server`),
 * the diagnostic tokens (`provider`, `model`, `serverUrl`,
 * `credential`), and the user-authored `promptSuggestions` array are
 * NOT localised.
 *
 * @private
 */
export const AI_ASSIST_FALLBACKS: { [key: string]: string } = localeDefaults;

/**
 * Format a `key` carrying `{0}` / `{1}` placeholders.
 *
 * @param {string} value The value.
 * @param {string[]} args The args.
 * @returns {string} The formatted value.
 * @private
 */
export function aiAssistFormatTemplate(value: string, args: string[]): string {
    return args.reduce<string>((acc: string, arg: string, index: number) => {
        return acc.replace('{' + index + '}', arg);
    }, value);
}
