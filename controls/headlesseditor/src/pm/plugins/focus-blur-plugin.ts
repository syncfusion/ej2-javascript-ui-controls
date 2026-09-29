import { PMPlugin, PMEditorView } from '../pm-guard';
import { EventBus } from '../../events/event-bus';
import { FOCUS_ACQUIRED, FOCUS_LOST } from '../../events/event-names';

/**
 * focusBlurPlugin — bridges DOM focus/blur events to the EventBus.
 *
 * Binds `focus` and `blur` DOM listeners on `editorView.dom` inside the
 * plugin's `view` spec. Removes them on destroy to avoid memory leaks.
 *
 * IME/composition events are handled inside PM's own input pipeline and are
 * not bridged here. The only lifecycle events that cross the PM → EventBus
 * boundary are `focus` and `blur` — the name accurately reflects permanent scope.
 *
 * This plugin is assembled by `EditorBuilder.buildPlugins()` and is never
 * exported from `src/index.ts`.
 *
 * @hidden
 * @param {EventBus} eventBus - The EventBus instance to publish focus/blur events to.
 * @returns {PMPlugin} A configured ProseMirror plugin.
 */
export function focusBlurPlugin(eventBus: EventBus): PMPlugin {
    return new PMPlugin({
        view(editorView: PMEditorView): { destroy(): void } {
            const onFocus: () => void = (): void => {
                eventBus.publish({ type: FOCUS_ACQUIRED, payload: {} });
            };
            const onBlur: () => void = (): void => {
                eventBus.publish({ type: FOCUS_LOST, payload: {} });
            };

            editorView.dom.addEventListener('focus', onFocus);
            editorView.dom.addEventListener('blur', onBlur);

            return {
                destroy(): void {
                    editorView.dom.removeEventListener('focus', onFocus);
                    editorView.dom.removeEventListener('blur', onBlur);
                }
            };
        }
    });
}
