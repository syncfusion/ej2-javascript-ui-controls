import {
    PMSchema,
    PMNode,
    PMEditorState,
    PMEditorView,
    PMTransaction,
    PMPlugin,
    DirectEditorProps
} from '../pm-guard';
import { EditorLifecycleError } from '../../errors/editor-lifecycle-error';
import { PositionAdapter } from '../adapters/position-adapter';
import { EventBus } from '../../events/event-bus';
import { RENDERER_INITIALIZED, TRANSACTION_APPLIED } from '../../events/event-names';

export interface PMConfig {
    schema: PMSchema;
    doc: PMNode;
    plugins?: PMPlugin[];
}

/**
 * IntegrationManager — the single holder of PM state within `src/pm/`.
 *
 * Lifecycle:
 *   create()  → PMEditorState ready; NO DOM, NO view
 *   mount()   → PMEditorView created (DOM required)
 *   unmount() → view destroyed; state preserved
 *   destroy() → everything released; object unusable
 *
 */
export class IntegrationManager {
    private _pmState: PMEditorState | undefined = undefined;
    private _pmView: PMEditorView | undefined = undefined;
    private _destroyed: boolean = false;
    private _created: boolean = false;

    /** Optional EventBus for emitting lifecycle events. Provided by Editor.create(). */
    private readonly eventBus?: EventBus;

    /** PM-agnostic position cache; invalidated after every dispatch. */
    positionAdapter: PositionAdapter = new PositionAdapter();

    /**
     * Optional post-dispatch hook. Editor.create() wires the SelectionManager
     * here so that snapshots referencing removed nodes are marked stale.
     * The hook must be a no-op-safe callback; not invoked when the editor
     * is destroyed.
     */
    postDispatchHook: (() => void) | undefined = undefined;

    /**
     * @param {EventBus} eventBus Optional EventBus. When provided, lifecycle events
     *   (`RENDERER_INITIALIZED`) are published on mount/unmount.
     */
    constructor(eventBus?: EventBus) {
        this.eventBus = eventBus;
    }

    // ── Lifecycle ────────────────────────────────────────────────────────────

    public create(config: PMConfig): void {
        this._assertNotDestroyed();
        this._pmState = PMEditorState.create({
            schema: config.schema,
            doc: config.doc,
            plugins: config.plugins ?? []
        });
        this._created = true;
    }

    /**
     * Adds additional plugins to the PM EditorState. Used to inject the
     * keymap plugin AFTER the Editor is fully constructed before the view is mounted.
     *
     * Uses PM's built-in `EditorState.reconfigure({ plugins })` so that
     * existing state fields are preserved and new plugins are appended.
     *
     * The view (if already mounted) is updated in place.
     *
     * @param {PMPlugin[]} additionalPlugins - Plugins to append to the existing list.
     * @returns {void}
     */
    public addPlugins(additionalPlugins: PMPlugin[]): void {
        this._assertNotDestroyed();
        if (!this._pmState) {
            throw new EditorLifecycleError('Cannot add plugins before initial create()');
        }
        const existingPlugins: readonly PMPlugin[] = this._pmState.plugins;
        this._pmState = this._pmState.reconfigure({
            plugins: [...existingPlugins, ...additionalPlugins]
        });
        if (this._pmView) {
            this._pmView.updateState(this._pmState);
        }
    }

    /**
     * Creates a PMEditorView and attaches it to `container`.
     *
     * @param {HTMLElement} container  The DOM element to mount into.
     * @param {Partial<DirectEditorProps>} viewProps  Optional additional `DirectEditorProps` spread after the
     *                   invariant props (`state`, `dispatchTransaction`). Caller-supplied
     *                   `state` or `dispatchTransaction` are ignored — invariant props win.
     * @returns {void}
     */
    public mount(container: HTMLElement, viewProps?: Partial<DirectEditorProps>): void {
        this._assertNotDestroyed();
        if (!this._created || !this._pmState) {
            throw new EditorLifecycleError('Editor not initialized');
        }
        if (this._pmView) {
            throw new EditorLifecycleError('Editor already mounted');
        }

        const props: DirectEditorProps = {
            // Spread caller props first so invariant props (state, dispatchTransaction) always win
            ...viewProps,
            state: this._pmState,
            dispatchTransaction: (tr: PMTransaction): void => {
                this.dispatch(tr);
            }
        };

        try {
            container.classList.add('e-headless-editor');
            this._pmView = new PMEditorView(container, props);
        } catch (e) {
            // PM's EditorView constructor can throw if the container is invalid
            this._pmView = undefined;
            const msg: string = e instanceof Error ? e.message : String(e);
            throw new EditorLifecycleError(`Editor mount failed: ${msg}`);
        }

        (this.eventBus as EventBus).publish({ type: RENDERER_INITIALIZED, payload: { container } });
    }

    public unmount(): void {
        if (!this._pmView) { return; } // no-op
        this._pmView.destroy();
        this._pmView = undefined;
    }

    public destroy(): void {
        if (this._destroyed) { return; } // idempotent
        this.unmount();
        this._pmState = undefined;
        this._created = false;
        this._destroyed = true;
        this.postDispatchHook = undefined;
    }

    // ── Transaction dispatch ─────────────────────────────────────────────────

    /**
     * Applies a PM transaction.
     * - Throws `EditorLifecycleError` if destroyed.
     * - Silently discards stale transactions (tr.before !== currentState.doc).
     *
     * @param {PMTransaction} tr - The PM transaction to apply.
     * @returns {void}
     */
    public dispatch(tr: PMTransaction): void {
        this._assertNotDestroyed();
        if (!this._pmState) { return; }

        // Stale transaction guard: discard if built from an outdated state
        if (tr.before !== this._pmState.doc) {
            return; // silent no-op
        }

        // State update
        this._pmState = this._pmState.apply(tr);

        // UI update
        if (this._pmView) {
            this._pmView.updateState(this._pmState);
        }

        // Invalidate position cache so the next toPMPosition walks the new doc
        this.positionAdapter.invalidateCache();

        // Notify the EventAggregator that a transaction was committed
        this.eventBus.publish({
            type: TRANSACTION_APPLIED,
            payload: {
                docChanged: tr.docChanged,
                transaction: tr,
                ...(tr.docChanged && {
                    beforeDoc: tr.before,
                    afterDoc: this._pmState.doc
                })
            }
        });

        // Allow the SelectionManager to mark its held snapshot stale if the
        // transaction invalidated any referenced nodeId.
        if (this.postDispatchHook) {
            try {
                this.postDispatchHook();
            } catch {
                // intentional — selection bookkeeping must never break dispatch
            }
        }
    }

    // ── State access (internal) ──────────────────────────────────────────────

    /**
     * Returns the current PM editor state.
     *
     * NOT exported from src/index.ts.
     *
     * @returns {PMEditorState} The current PM editor state.
     * @hidden
     */
    public getState(): PMEditorState {
        this._assertNotDestroyed();
        if (!this._pmState) {
            throw new EditorLifecycleError('Editor not initialized');
        }
        return this._pmState;
    }

    /**
     * Returns the current PM editor view.
     *
     * NOT exported from src/index.ts.
     *
     * @returns {PMEditorView} The current PM editor view.
     * @hidden
     */
    public getView(): PMEditorView {
        this._assertNotDestroyed();
        if (!this._pmView) {
            throw new EditorLifecycleError('Editor not initialized');
        }
        return this._pmView;
    }

    public get isMounted(): boolean {
        return this._pmView !== undefined;
    }

    public get isDestroyed(): boolean {
        return this._destroyed;
    }

    /**
     * Refocuses the PM view and forces `selectionToDOM()` to run.
     *
     * This is needed after a selection-only restore transaction: because
     * ProseMirror's `updateStateInner` only calls `selectionToDOM` when
     * `state.selection.eq(prev.selection)` is false OR the document changed,
     * a no-op restore (PM state already holds the correct positions) never
     * re-renders the DOM selection that the browser cleared on blur.
     *
     * Calling `view.focus()` bypasses that guard and unconditionally syncs
     * the PM state selection back to the DOM, then returns focus to the editor.
     *
     * No-op when the view is not mounted.
     *
     * @param {boolean} afterUpdate Whether to wait for the updated caption to render before focusing.
     * @returns {void}
     * @hidden
     */
    public focusView(afterUpdate: boolean = false): void {
        if (!this._pmView) { return; }

        if (afterUpdate) {
            requestAnimationFrame((): void => {
                // Caption commands need focus after the image NodeView renders its updated figcaption.
                if (this._pmView) {
                    this.focusView();
                }
            });
            return;
        }

        const active: Element | null = document.activeElement;
        if (active && active !== document.body && this._pmView.dom.contains(active)) {
            let node: Element | null = active;
            while (node && node !== this._pmView.dom) {
                if ((node as HTMLElement).contentEditable === 'false') {
                    return; // Widget owns focus — do not redirect it
                }
                node = node.parentElement;
            }
        }
        this._pmView.focus();
    }

    // ── Guards ────────────────────────────────────────────────────────────────

    private _assertNotDestroyed(): void {
        if (this._destroyed) {
            throw new EditorLifecycleError('Editor has been destroyed');
        }
    }

    /**
     * Returns the current nesting depth of the given list type at the active
     * selection.
     *
     * The outermost list of that type has a depth of `0`, and each nested list
     * of the same type increases the depth by `1`.
     *
     * Examples:
     * - Not in a list of that type → `0`
     * - Top-level list item → `0`
     * - List nested inside another list of the same type → `1`
     * - Third-level nested list → `2`
     *
     * @param {'ordered' | 'bullet'} listType - The logical list type to measure.
     * @returns {number} The current nesting depth relative to the outermost
     * list of that type.
     * @hidden
     */
    public getCurrentListDepth(listType: 'ordered' | 'bullet'): number {
        const state: PMEditorState = this._pmState;
        const nodeTypeName: string = listType === 'ordered' ? 'orderedList' : 'bulletList';
        const { $from } = state.selection;
        let depth: number = 0;
        for (let i: number = $from.depth; i >= 0; i--) {
            const node: PMNode = $from.node(i);
            if (node.type.name === nodeTypeName) {
                depth++;
            }
        }
        return Math.max(0, depth - 1);
    }
}
