import {
    PMPlugin,
    keymap,
    PMCommand,
    baseKeymap,
    PMEditorState,
    PMEditorView,
    pmChainCommands,
    pmNewlineInCode,
    pmCreateParagraphNear,
    pmLiftEmptyBlock,
    pmSplitBlockKeepMarks
} from '../pm-guard';
import type { KeyboardShortcutHandler } from '../../extensions/types';

/**
 * Run each handler in sequence. Returns `true` on the first truthy result.
 * A handler returning `false` is treated as "not applicable here" — the
 * next handler runs. A thrown error is swallowed (logged via console.warn
 * to keep parity with the prior try/catch behavior) so one broken handler
 * cannot block the rest of the chain.
 *
 * Extension handlers are pre-bound closures with signature `() => boolean`.
 * `baseHandler` is included in the same array as a regular member; it is
 * already a `() => boolean` in the new shape.
 *
 * @param {Array} handlers - Ordered handler chain to run.
 * @returns {Function} A single handler that runs the chain.
 */
function chain(handlers: Array<() => boolean>): () => boolean {
    return (): boolean => {
        for (const handler of handlers) {
            try {
                if (handler()) {
                    return true;
                }
            } catch (error) {
                // Log and continue to the next handler in the chain.
                if (typeof console !== 'undefined' && console.warn) {
                    console.warn('Keymap handler threw:', error);
                }
            }
        }
        return false;
    };
}

/**
 * buildKeymapPlugin — adapts base keymaps and extension keyboard shortcut handlers into a PM keymap plugin.
 *
 * Chains two sources of keybindings by collision detection and handler fallback:
 *   1. `baseKeymap` — fundamental editor actions (Enter, Delete, Backspace, Mod-a, etc.)
 *      These are PM Command handlers with signature: (state, dispatch?, view?) => boolean
 *   2. Extension shortcuts — custom commands contributed by extensions (toggleBold, setHeading, etc.)
 *      These are pre-bound closures with signature: () => boolean
 *
 * Each extension key is a CHAIN of handlers (priority-sorted by the compiler).
 * When both sources define the same key (collision):
 *   - Every extension handler in the chain is tried in order (priority-sorted)
 *   - The first one returning `true` consumes the key
 *   - The base handler is appended as the FINAL fallback — it only runs if
 *     every extension handler returned `false`
 *   - This prevents extensions from silently destroying base functionality
 *
 * When only one source defines a key:
 *   - That handler chain is used as-is (no chaining needed)
 *
 * @param {Object} extensionShortcuts - Map of key strings to ordered chains of extension shortcut handlers.
 * @returns {PMPlugin} A PMPlugin produced by prosemirror-keymap, wrapping all keybindings with collision handling.
 * @hidden
 */
export function buildKeymapPlugin(
    extensionShortcuts: Record<string, KeyboardShortcutHandler[]>
): PMPlugin {
    const wrappedBindings: Record<string, PMCommand> = {};
    const enterHandler: PMCommand = pmChainCommands(
        pmNewlineInCode,
        pmCreateParagraphNear,
        pmLiftEmptyBlock,
        pmSplitBlockKeepMarks
    );

    // ── Step 1: Process baseKeymap keys, detecting collisions with extensionShortcuts ──
    for (const baseKey in baseKeymap) {
        if (!Object.prototype.hasOwnProperty.call(baseKeymap, baseKey)) {
            continue;
        }
        const baseHandler: PMCommand = baseKey === 'Enter'
            ? enterHandler
            : baseKeymap[`${baseKey}`] as PMCommand;
        const extensionHandlers: KeyboardShortcutHandler[] | undefined = extensionShortcuts[`${baseKey}`];

        if (extensionHandlers && extensionHandlers.length > 0) {
            // COLLISION DETECTED: chain extension handlers first, then base
            // handler as the universal fallback. The base handler is wrapped
            // in a closure that captures the current PM args so the chain
            // helper (which only knows about `() => boolean`) can call it.
            wrappedBindings[`${baseKey}`] = (state: PMEditorState, dispatch: (tr: any) => void, view: PMEditorView): boolean => {
                let baseInvoked: boolean = false;
                const baseAsZeroArg: () => boolean = (): boolean => {
                    baseInvoked = true;
                    return baseHandler(state, dispatch, view);
                };
                const chainFn: () => boolean = chain([
                    ...extensionHandlers,
                    baseAsZeroArg
                ]);
                const result: boolean = chainFn();
                // `baseInvoked` is captured for future diagnostics; ignored today.
                void baseInvoked;
                return result;
            };
        } else {
            // NO COLLISION: Use base handler as-is
            wrappedBindings[`${baseKey}`] = (state: PMEditorState, dispatch: (tr: any) => void, view: PMEditorView): boolean => {
                return baseHandler(state, dispatch, view);
            };
        }
    }

    // ── Step 2: Add extension-only shortcuts (keys not in baseKeymap) ──
    for (const extKey in extensionShortcuts) {
        if (!Object.prototype.hasOwnProperty.call(extensionShortcuts, extKey)) {
            continue;
        }
        // Skip if already processed in Step 1 (collision case)
        if (Object.prototype.hasOwnProperty.call(baseKeymap, extKey)) {
            continue;
        }

        const extensionHandlers: KeyboardShortcutHandler[] = extensionShortcuts[`${extKey}`];
        if (!extensionHandlers || extensionHandlers.length === 0) {
            continue;
        }
        const chainFn: () => boolean = chain(extensionHandlers);
        wrappedBindings[`${extKey}`] = (): boolean => {
            return chainFn();
        };
    }

    return keymap(wrappedBindings);
}
