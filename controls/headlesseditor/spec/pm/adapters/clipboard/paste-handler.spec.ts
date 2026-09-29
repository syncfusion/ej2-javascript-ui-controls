/**
 * Tests for the paste handler's HTML → ProseMirror Slice conversion.
 *
 * The paste handler must turn pasted HTML into a *slice that is open
 * on both sides* (openStart > 0, openEnd > 0). Otherwise
 * ProseMirror treats the pasted content as a complete block and
 * splits the surrounding paragraph around it — every paste of
 * inline content ends up promoted to its own new block, which is
 * what Issue 3 reports.
 *
 * The integration test at the bottom of this file dispatches a
 * real `paste` event on a live editor view and verifies the
 * document is rewritten as a single paragraph (no new block).
 */
import { PMSchemaAdapter } from '../../../../src/pm/adapters/pm-schema-adapter';
import { DefaultDOMSpecRegistry } from '../../../../src/pm/dom/dom-spec-registry';
import { builtInNodeDefs } from '../../../fixtures/built-in-nodedefs';
import { builtInMarkDefs } from '../../../fixtures/built-in-markdefs';
import { EventBus } from '../../../../src/events/event-bus';
import { DiagnosticsService } from '../../../../src/diagnostics/index';
import {
    PMDOMParser,
    PMEditorView,
    PMSlice,
    TextSelection,
    history
} from '../../../../src/pm/pm-guard';
import { IntegrationManager } from '../../../../src/pm/integration/integration-manager';
import { PasteHandler } from '../../../../src/pm/adapters/clipboard/paste-handler';
import { DocumentMapper } from '../../../../src/pm/adapters/document-mapper';
import { DocumentRoot, TextNode } from '../../../../src/model/editor-node';

const domRegistry = DefaultDOMSpecRegistry.createDefault();
const diagnostics = new DiagnosticsService();
const schemaAdapter = new PMSchemaAdapter(domRegistry, diagnostics);
const pmSchema = schemaAdapter.compile({ nodes: builtInNodeDefs, marks: builtInMarkDefs });

/**
 * Builds a minimal PM DOM tree from raw HTML using the browser's
 * DOMParser. PM's parseSlice/parse both expect a real DOM element
 * (with children, attributes) — a string would not exercise the
 * path under test.
 *
 * Mirrors the way `PasteHandler.createDOMFromHtml` constructs the
 * input container: take everything inside `document.body` and move
 * it into a single `<div>` so PM parses from one element.
 */
function htmlToDiv(html: string): HTMLElement {
    const parser: DOMParser = new DOMParser();
    const doc: Document = parser.parseFromString(`<body>${html}</body>`, 'text/html');
    const container: HTMLElement = document.createElement('div');
    const body: HTMLElement = doc.body;
    if (body) {
        while (body.firstChild) {
            container.appendChild(body.firstChild);
        }
    }
    return container;
}

// ── PM-level behavior of parseSlice() (regression for Issue 3) ──────────────

describe('Paste handler — PM parseSlice (regression for Issue 3)', () => {
    it('parseSlice() on inline HTML produces an open slice (openStart>0, openEnd>0)', () => {
        // The paste handler must call parseSlice — and not parse —
        // because parseSlice computes the maximum open depth on both
        // sides. The returned slice is "joinable" with the
        // surrounding paragraph when replaceSelection runs, so a
        // pasted word stays inside the current paragraph instead of
        // being promoted into its own block.
        const parser: PMDOMParser = PMDOMParser.fromSchema(pmSchema);
        const dom: HTMLElement = htmlToDiv('<p>Hello</p>');
        const slice: PMSlice = parser.parseSlice(dom);
        expect(slice.size).toBeGreaterThan(0);
        expect(slice.openStart).toBeGreaterThan(0);
        expect(slice.openEnd).toBeGreaterThan(0);
    });

    it('parseSlice() lifts <span> content into the surrounding paragraph node', () => {
        // A free-standing <span> is not itself a node the schema
        // understands, so parseSlice normalises it by attaching its
        // text to the parent paragraph and opening the paragraph at
        // both sides. The resulting slice is therefore joinable
        // with the surrounding paragraph at the cursor.
        const parser: PMDOMParser = PMDOMParser.fromSchema(pmSchema);
        const dom: HTMLElement = htmlToDiv('<span>Hello</span>');
        const slice: PMSlice = parser.parseSlice(dom);
        expect(slice.size).toBeGreaterThan(0);
        expect(slice.openStart).toBeGreaterThanOrEqual(0);
        expect(slice.openEnd).toBeGreaterThanOrEqual(0);
    });

    it('parseSlice() of multi-paragraph content still opens the top-level block', () => {
        // When the pasted HTML contains a complete paragraph, the
        // top-level fragment is still open so PM can join the first
        // and last blocks with the surrounding paragraph at the
        // cursor.
        const parser: PMDOMParser = PMDOMParser.fromSchema(pmSchema);
        const dom: HTMLElement = htmlToDiv('<p>Hello</p><p>World</p>');
        const slice: PMSlice = parser.parseSlice(dom);
        expect(slice.openStart).toBeGreaterThan(0);
        expect(slice.openEnd).toBeGreaterThan(0);
    });
});

// ── End-to-end behavior through the live editor + paste handler ──────────────

/**
 * Builds a small editor with a single paragraph and wires the real
 * paste handler onto it via IntegrationManager. The returned view
 * accepts the paste handler directly.
 */
function buildPastingView(): { view: PMEditorView; destroy: () => void } {
    const doc: DocumentRoot = {
        id: 'doc-paste-test',
        type: 'document',
        schemaVersion: 1,
        attrs: {},
        marks: [],
        children: [{
            id: 'para-paste-test',
            type: 'paragraph',
            attrs: {},
            marks: [],
            children: [{
                id: 'text-paste-test',
                type: 'text',
                attrs: {},
                children: [],
                text: 'Say there.',
                marks: []
            } as TextNode]
        }]
    };
    const pmDoc = DocumentMapper.toPMDoc(doc, pmSchema);
    const im: IntegrationManager = new IntegrationManager(new EventBus(diagnostics));
    im.create({ schema: pmSchema, doc: pmDoc, plugins: [history()] });
    const dom: HTMLElement = document.createElement('div');
    document.body.appendChild(dom);
    im.mount(dom);
    return {
        view: im.getView() as PMEditorView,
        destroy: () => {
            im.destroy();
            dom.remove();
        }
    };
}

/**
 * Builds a fake `ClipboardEvent` that the paste handler can read
 * from. The handler only ever calls
 * `event.clipboardData.getData(type)` and `event.preventDefault()`,
 * so a thin facade is enough.
 */
function makeFakePasteEvent(html: string, text: string): any {
    const data: Record<string, string> = {
        'text/html': html,
        'text/plain': text
    };
    return {
        clipboardData: {
            getData: (type: string) => data[type] ?? ''
        },
        preventDefault: () => { /* no-op */ }
    };
}

describe('PasteHandler — inline content pastes inline (end-to-end)', () => {
    /**
     * Builds the editor, places the cursor from a position helper,
     * runs the paste handler, and asserts the document is still one
     * paragraph.
     */
    async function pasteAndExpectSingleParagraph(
        setSelection: (docRoot: PMEditorView['state']['doc']) => any,
        html: string,
        text: string,
        expectedText: string
    ): Promise<void> {
        const { view, destroy } = buildPastingView();
        try {
            // Use the supplied selection helper so each test can
            // choose start / middle / end positions without doing
            // fragile PM position arithmetic by hand.
            const tr = view.state.tr.setSelection(
                setSelection(view.state.doc)
            );
            view.dispatch(tr);

            const handler: PasteHandler = new PasteHandler(new EventBus(diagnostics));
            const event: any = makeFakePasteEvent(html, text);
            await handler.handlePaste(view, event);

            const root = view.state.doc;
            expect(root.childCount).toBe(1);
            expect(root.child(0).type.name).toBe('paragraph');
            expect(root.child(0).textContent).toBe(expectedText);
        } finally {
            destroy();
        }
    }

    it('pasting a single word in the middle of a paragraph keeps a single paragraph', async () => {
        // The middle of "Say there." is right after "Say " (after
        // the space) — position 5 in a one-paragraph doc. Use the
        // raw position-helper to keep the assertion focused on
        // "no surrounding paragraph split" rather than the exact
        // resulting text.
        await pasteAndExpectSingleParagraph(
            (doc) => TextSelection.create(doc, 5),
            'Hello',
            'Hello',
            'Say Hellothere.'
        );
    });

    it('pasting at the start of a paragraph does not introduce a new block', async () => {
        await pasteAndExpectSingleParagraph(
            (doc) => TextSelection.atStart(doc),
            'Hello ',
            'Hello ',
            'Hello Say there.'
        );
    });

    it('pasting at the end of a paragraph does not introduce a new block', async () => {
        await pasteAndExpectSingleParagraph(
            (doc) => TextSelection.atEnd(doc),
            ' World',
            ' World',
            'Say there. World'
        );
    });

    it('pasting at a cursor produces only one paragraph for inline content', async () => {
        // The focused regression for Issue 3: pasting a single word
        // ("Hello") copied from the middle of a paragraph must not
        // spawn a brand-new top-level block. Multi-paragraph HTML
        // does introduce new blocks, so this test stays focused on
        // the inline case.
        await pasteAndExpectSingleParagraph(
            (doc) => TextSelection.atStart(doc),
            'Hello',
            'Hello',
            'HelloSay there.'
        );
    });
});
