import { PMPlugin, PMEditorView, PMEditorState } from '../pm-guard';
import { EventBus } from '../../events/event-bus';
import { SELECTION_UPDATED } from '../../events/event-names';
import { PositionAdapter, SelectionAdapter } from '../adapters';
import { Selection } from '../../model/selection';

/**
 * selectionSyncPlugin — bridges PM selection changes to the EventBus.
 *
 * On every `view.update()`, compares the new selection to the previous one.
 * If they differ, emits `SELECTION_UPDATED` on the provided EventBus.
 *
 * This plugin has no PM state and no side-effects beyond the emit.
 * It is assembled by `EditorBuilder.buildPlugins()` and is never exported
 * from `src/index.ts`.
 *
 * @hidden
 * @param {EventBus} eventBus - The EventBus instance to publish selection events to.
 * @returns {PMPlugin} A configured ProseMirror plugin.
 */
export function selectionSyncPlugin(eventBus: EventBus): PMPlugin {
    return new PMPlugin({
        view(): { update(view: PMEditorView, prevState: PMEditorState): void } {
            const positionAdapter: PositionAdapter = new PositionAdapter();
            const selectionAdapter: SelectionAdapter = new SelectionAdapter(positionAdapter);
            return {
                update(view: PMEditorView, prevState: PMEditorState): void {
                    if (prevState.selection.eq(view.state.selection)) {
                        return;
                    }

                    const selection: Selection = selectionAdapter.fromPMSelection(
                        view.state.selection,
                        view.state.doc
                    );
                    if (!selection) {
                        return;
                    }
                    eventBus.publish({
                        type: SELECTION_UPDATED,
                        payload: {
                            selection,
                            docChanged: !prevState.doc.eq(view.state.doc)
                        }
                    });
                }
            };
        }
    });
}
