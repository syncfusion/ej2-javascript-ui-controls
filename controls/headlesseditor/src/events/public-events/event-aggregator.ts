import { EventBus } from '../event-bus';
import { IDisposable } from '../types';
import { DisposableCollection } from '../disposable-collection';

import { TransactionAppliedPayload, SelectionUpdatedPayload, RendererInitializedPayload } from '../internal/document-events';
import { TRANSACTION_APPLIED, SELECTION_UPDATED, SCHEMA_LOADED, RENDERER_INITIALIZED, FOCUS_ACQUIRED, FOCUS_LOST } from '../event-names';

import {
    CONTENT_CHANGED,
    SELECTION_CHANGED,
    DOCUMENT_CHANGED,
    FOCUS,
    BLUR,
    CREATED,
    EDITOR_DESTROYED
} from './index';

import { EditorEvent } from '../editor-event';
import { DocumentRoot, EditorNode } from '../../model/editor-node';
import { Selection } from '../../model/selection';
import type { DocumentChangedPayload, DocumentChangeAction } from './document-events';
import { ChangeAnalyzer } from '../../pm/adapters/change-analyzer';
import type { IdGenerator } from '../../utils/id-generator';

// ── EventAggregator ───────────────────────────────────────────────────────────

/**
 * EventAggregator — subscribes to internal infrastructure events and publishes
 * the corresponding semantic public events onto the same EventBus.
 *
 * This is the single place that implements the aggregation mapping defined in
 * the event-catalog spec.
 *
 * Bootstrap: instantiate after EventBus is ready; call `dispose()` on editor teardown.
 *
 * @hidden
 */
export class EventAggregator implements IDisposable {
    private readonly bus: EventBus;
    private readonly subscriptions: DisposableCollection;

    /** Getter passed in to retrieve current document state for contentChanged payloads. */
    private readonly getDocument: () => DocumentRoot;
    /** Getter passed in to retrieve current selection for contentChanged payloads. */
    private readonly getSelection: () => Selection;
    /** Getter passed in to retrieve the IdGenerator for ChangeAnalyzer. */
    private readonly getIdGen: () => IdGenerator;

    /** Tracks whether SchemaLoaded has fired (used for documentLoaded aggregation). */
    private schemaLoaded: boolean = false;
    /** Tracks whether RendererInitialized has fired (used for documentLoaded aggregation). */
    private rendererInitialized: boolean = false;

    constructor(
        bus: EventBus,
        getDocument: () => DocumentRoot,
        getSelection: () => Selection,
        getIdGen: () => IdGenerator
    ) {
        this.bus = bus;
        this.getDocument = getDocument;
        this.getSelection = getSelection;
        this.getIdGen = getIdGen;
        this.subscriptions = new DisposableCollection();
        this.registerAggregations();
    }

    private registerAggregations(): void {
        // ── contentChanged + documentChanged: fire when a doc-mutating transaction completes ────
        this.subscriptions.add(
            this.bus.subscribe<TransactionAppliedPayload>(
                TRANSACTION_APPLIED,
                (event: EditorEvent<TransactionAppliedPayload>) => {
                    if (!event.payload.docChanged) {
                        return;
                    }

                    const currentDocument: DocumentRoot = this.getDocument();
                    const currentSelection: Selection = this.getSelection();

                    // Publish contentChanged for backward compatibility
                    this.bus.publish<{ document: DocumentRoot; selection: Selection }>({
                        type: CONTENT_CHANGED,
                        payload: {
                            document: currentDocument,
                            selection: currentSelection
                        }
                    });

                    // Analyze the change and publish documentChanged with semantic action
                    if (event.payload.beforeDoc && event.payload.afterDoc) {
                        const changeAnalysis: ReturnType<typeof ChangeAnalyzer.analyzeChange> = ChangeAnalyzer.analyzeChange(
                            {
                                transaction: event.payload.transaction,
                                beforeDoc: event.payload.beforeDoc,
                                afterDoc: event.payload.afterDoc
                            },
                            this.getIdGen()
                        );

                        const changePayload: DocumentChangedPayload = {
                            ...changeAnalysis,
                            document: currentDocument,
                            selection: currentSelection
                        };

                        this.bus.publish<DocumentChangedPayload>({
                            type: DOCUMENT_CHANGED,
                            payload: changePayload
                        });
                    }
                }
            )
        );

        // ── selectionChanged: fires on selection-only transactions ─────────────
        this.subscriptions.add(
            this.bus.subscribe<SelectionUpdatedPayload>(
                SELECTION_UPDATED,
                (event: EditorEvent<SelectionUpdatedPayload>) => {
                    if (event.payload.docChanged) {
                        return; // contentChanged covers this case
                    }
                    this.bus.publish<{ selection: Selection }>({
                        type: SELECTION_CHANGED,
                        payload: { selection: event.payload.selection }
                    });
                }
            )
        );

        // ── documentLoaded: fires once both SchemaLoaded + RendererInitialized ──
        this.subscriptions.add(
            this.bus.subscribe(SCHEMA_LOADED, () => {
                this.schemaLoaded = true;
            })
        );

        this.subscriptions.add(
            this.bus.subscribe<RendererInitializedPayload>(RENDERER_INITIALIZED, () => {
                this.rendererInitialized = true;
            })
        );

        // ── focus / blur ───────────────────────────────────────────────────────
        this.subscriptions.add(
            this.bus.subscribe(FOCUS_ACQUIRED, () => {
                this.bus.publish<Record<string, never>>({ type: FOCUS, payload: {} });
            })
        );

        this.subscriptions.add(
            this.bus.subscribe(FOCUS_LOST, () => {
                this.bus.publish<Record<string, never>>({ type: BLUR, payload: {} });
            })
        );
    }

    /**
     * Publishes `created`. Called by the editor after full init.
     *
     * @returns {void}
     * @hidden
     */
    public publishEditorCreated(): void {
        this.bus.publish<Record<string, never>>({ type: CREATED, payload: {} });
    }

    /**
     * Publishes `destroyed`. Called by the editor before teardown begins.
     *
     * @returns {void}
     * @hidden
     */
    public publishEditorDestroyed(): void {
        this.bus.publish<Record<string, never>>({ type: EDITOR_DESTROYED, payload: {} });
    }

    /**
     * Releases all internal subscriptions.
     *
     * @returns {void}
     * @hidden
     */
    public dispose(): void {
        this.subscriptions.dispose();
    }
}
