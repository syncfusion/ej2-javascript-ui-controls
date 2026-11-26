import { L10n } from '@syncfusion/ej2-base';
import { ServiceLocator } from '../service';
import { LocaleContext } from '../../localization/locale-context';

/**
 * Resolve the live L10n instance for a static structured editor.
 *
 * Resolution order (first non-null wins):
 *  1. `overrideL10n` — per-render override threaded through the editor's
 *     `render(host, ..., l10n?)` signature. Used by callers that want a
 *     one-shot translation (e.g. snapshot previews) without disturbing the
 *     shared mirror.
 *  2. `locator?.getService<L10n>('localization')` — the canonical, host-owned
 *     instance. Always reflects the most recent `L10n` produced by the
 *     designer (initial render + every `setLocale()` re-register). This is
 *     the path that keeps structured editors in lockstep with the rest of
 *     the shell on runtime locale changes.
 *  3. `fallbackL10n` — the editor's static mirror snapshot, set by the
 *     host's `Editor.setLocale(l10n, locator)` call. Survives when no
 *     `ServiceLocator` is reachable (defensive default for static editors
 *     instantiated outside the standard property-panel flow, e.g. unit
 *     tests, custom hosts).
 *
 * Returns `undefined` only when none of the three sources has a L10n. Callers
 * should fall back to the bundled English table (or the literal key) in that
 * case.
 *
 * @param {ServiceLocator | undefined} locator The shared service locator.
 * @param {L10n | undefined} fallbackL10n The static mirror snapshot.
 * @param {L10n | undefined} overrideL10n The per-render override.
 * @returns {L10n | undefined} The live L10n instance, or `undefined`.
 * @private
 */
export function resolveEditorL10n(
    locator: ServiceLocator | undefined,
    fallbackL10n: L10n | undefined,
    overrideL10n?: L10n
): L10n | undefined {
    if (overrideL10n) {
        return overrideL10n;
    }
    // The designer instance currently handling the user's interaction.
    const current: L10n | undefined = LocaleContext.current();
    if (current) {
        return current;
    }
    if (locator) {
        const fromLocator: L10n = locator.getService<L10n>('localization');
        if (fromLocator) {
            return fromLocator;
        }
    }
    return fallbackL10n;
}
