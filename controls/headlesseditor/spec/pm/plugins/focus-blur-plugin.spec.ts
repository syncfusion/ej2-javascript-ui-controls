import { PMEditorState, PMEditorView, PMPlugin } from '../../../src/pm/pm-guard';
import { PMSchemaAdapter } from '../../../src/pm/adapters/pm-schema-adapter';
import { DocumentMapper } from '../../../src/pm/adapters/document-mapper';
import { focusBlurPlugin } from '../../../src/pm/plugins/focus-blur-plugin';
import { EventBus } from '../../../src/events/event-bus';
import { FOCUS_ACQUIRED, FOCUS_LOST } from '../../../src/events/event-names';
import { builtInNodeDefs } from '../../fixtures/built-in-nodedefs';
import { builtInMarkDefs } from '../../fixtures/built-in-markdefs';
import { emptyDoc } from '../../fixtures/sample-documents';
import { DefaultDOMSpecRegistry } from '../../../src/pm/dom/dom-spec-registry';
import { DiagnosticsService } from '../../../src/diagnostics/index';
const domRegistry = DefaultDOMSpecRegistry.createDefault();
const diagnostics = new DiagnosticsService();
const adapter = new PMSchemaAdapter(domRegistry, diagnostics);
const pmSchema = adapter.compile({ nodes: builtInNodeDefs, marks: builtInMarkDefs });
const pmDoc = DocumentMapper.toPMDoc(emptyDoc, pmSchema);

/** Minimal IErrorReporter for constructing EventBus in tests */
const noopReporter = { error: () => undefined };

describe('focusBlurPlugin', () => {
    let container: HTMLElement;
    let view: PMEditorView;
    let eventBus: EventBus;
    let published: Array<{ type: string; payload: unknown }>;

    beforeEach(() => {
        published = [];
        eventBus = new EventBus(noopReporter);
        eventBus.subscribe(FOCUS_ACQUIRED, (event) => {
            published.push({ type: event.type, payload: event.payload });
        });
        eventBus.subscribe(FOCUS_LOST, (event) => {
            published.push({ type: event.type, payload: event.payload });
        });

        container = document.createElement('div');
        document.body.appendChild(container);

        const plugin: PMPlugin = focusBlurPlugin(eventBus);
        const state = PMEditorState.create({
            schema: pmSchema,
            doc: pmDoc,
            plugins: [plugin],
        });
        view = new PMEditorView(container, { state });
    });

    afterEach(() => {
        if (!view.isDestroyed) {
            view.destroy();
        }
        if (document.body.contains(container)) {
            document.body.removeChild(container);
        }
        eventBus.dispose();
    });

    it('emits FOCUS_ACQUIRED when the editor DOM receives focus', () => {
        view.dom.dispatchEvent(new Event('focus', { bubbles: false }));
        const focusEvents = published.filter(p => p.type === FOCUS_ACQUIRED);
        expect(focusEvents.length).toBe(1);
    });

    it('emits FOCUS_LOST when the editor DOM loses focus', () => {
        view.dom.dispatchEvent(new Event('blur', { bubbles: false }));
        const blurEvents = published.filter(p => p.type === FOCUS_LOST);
        expect(blurEvents.length).toBe(1);
    });

    it('emits FOCUS_ACQUIRED and FOCUS_LOST in correct order', () => {
        view.dom.dispatchEvent(new Event('focus', { bubbles: false }));
        view.dom.dispatchEvent(new Event('blur', { bubbles: false }));
        expect(published[0].type).toBe(FOCUS_ACQUIRED);
        expect(published[1].type).toBe(FOCUS_LOST);
    });

    it('removes DOM listeners on view.destroy() — no further events emitted', () => {
        view.destroy();

        // Emit events after destroy — they must not reach eventBus subscribers
        container.querySelector('[contenteditable]')?.dispatchEvent(new Event('focus', { bubbles: false }));
        container.querySelector('[contenteditable]')?.dispatchEvent(new Event('blur', { bubbles: false }));

        expect(published.filter(p => p.type === FOCUS_ACQUIRED).length).toBe(0);
        expect(published.filter(p => p.type === FOCUS_LOST).length).toBe(0);
    });

    it('emits multiple focus/blur cycles correctly', () => {
        view.dom.dispatchEvent(new Event('focus', { bubbles: false }));
        view.dom.dispatchEvent(new Event('blur', { bubbles: false }));
        view.dom.dispatchEvent(new Event('focus', { bubbles: false }));

        expect(published.filter(p => p.type === FOCUS_ACQUIRED).length).toBe(2);
        expect(published.filter(p => p.type === FOCUS_LOST).length).toBe(1);
    });
});
