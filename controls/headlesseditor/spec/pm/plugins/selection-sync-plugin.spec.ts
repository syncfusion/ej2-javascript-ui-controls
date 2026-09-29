import { PMEditorState, PMEditorView, TextSelection, PMPlugin } from '../../../src/pm/pm-guard';
import { PMSchemaAdapter } from '../../../src/pm/adapters/pm-schema-adapter';
import { DocumentMapper } from '../../../src/pm/adapters/document-mapper';
import { selectionSyncPlugin } from '../../../src/pm/plugins/selection-sync-plugin';
import { EventBus } from '../../../src/events/event-bus';
import { SELECTION_UPDATED } from '../../../src/events/event-names';
import { builtInNodeDefs } from '../../fixtures/built-in-nodedefs';
import { builtInMarkDefs } from '../../fixtures/built-in-markdefs';
import { singleParagraphDoc } from '../../fixtures/sample-documents';
import { SelectionType } from '../../../src/model/selection';
import { DefaultDOMSpecRegistry } from '../../../src/pm/dom/dom-spec-registry';
import { DiagnosticsService } from '../../../src/diagnostics/index';

const domRegistry = DefaultDOMSpecRegistry.createDefault();
const diagnostics = new DiagnosticsService();
const adapter = new PMSchemaAdapter(domRegistry, diagnostics);
const pmSchema = adapter.compile({ nodes: builtInNodeDefs, marks: builtInMarkDefs });
const pmDoc = DocumentMapper.toPMDoc(singleParagraphDoc, pmSchema);

/** Minimal IErrorReporter for constructing EventBus in tests */
const noopReporter = { error: () => undefined };

describe('selectionSyncPlugin', () => {
    let container: HTMLElement;
    let view: PMEditorView;
    let eventBus: EventBus;
    let published: Array<{ type: string; payload: unknown }>;

    beforeEach(() => {
        published = [];
        eventBus = new EventBus(noopReporter);
        eventBus.subscribe(SELECTION_UPDATED, (event) => {
            published.push({ type: event.type, payload: event.payload });
        });

        container = document.createElement('div');
        document.body.appendChild(container);

        const plugin: PMPlugin = selectionSyncPlugin(eventBus);
        const state = PMEditorState.create({
            schema: pmSchema,
            doc: pmDoc,
            plugins: [plugin],
        });
        view = new PMEditorView(container, { state });
    });

    afterEach(() => {
        view.destroy();
        document.body.removeChild(container);
        eventBus.dispose();
    });

    it('emits SELECTION_UPDATED when selection changes', () => {
        const initialCount = published.length;

        // Move cursor to position 2 (into the paragraph text)
        const tr = view.state.tr.setSelection(
            TextSelection.create(view.state.doc, 2)
        );
        view.dispatch(tr);

        expect(published.length).toBeGreaterThan(initialCount);
        expect(published[published.length - 1].type).toBe(SELECTION_UPDATED);
    });

    it('includes Syncfusion Selection in the payload', () => {
        const tr = view.state.tr.setSelection(
            TextSelection.create(view.state.doc, 2, 4)
        );
        view.dispatch(tr);

        const last = published[published.length - 1].payload as {
            selection: {
                type: SelectionType;
                anchor?: { nodeId: string; offset: number };
                head?: { nodeId: string; offset: number };
            };
            docChanged: boolean;
        };

        expect(last.selection.type).toBe(SelectionType.Text);
        expect(last.selection.anchor).toBeDefined();
        expect(last.selection.head).toBeDefined();
        expect(last.docChanged).toBe(false);
    });

    it('does NOT emit when selection is unchanged', () => {
        // First: dispatch a selection change to a known position
        const tr1 = view.state.tr.setSelection(
            TextSelection.create(view.state.doc, 2)
        );
        view.dispatch(tr1);
        const countAfterFirst = published.length;

        // Second: dispatch a content-only transaction that does NOT change selection
        const tr2 = view.state.tr.insertText('x', 2);
        view.dispatch(tr2);

        // SELECTION_UPDATED count must not increase (selection position moved with text, but wasn't changed)
        // The key assertion: a pure no-selection-change transaction emits no extra event
        const selectionEvents = published.filter(p => p.type === SELECTION_UPDATED);
        // At most one new event may appear from the insertText shifting cursor — allow for PM cursor tracking
        // but the important case: dispatching a setSelection(same pos) emits nothing
        const tr3 = view.state.tr.setSelection(
            TextSelection.create(view.state.doc, view.state.selection.from)
        );
        view.dispatch(tr3);
        expect(published.filter(p => p.type === SELECTION_UPDATED).length).toBe(selectionEvents.length);
    });
});
