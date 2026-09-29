/**
 * spec/headless-editor/content-replace.spec.ts
 *
 * Tests for runtime full-content replacement:
 *   - `HeadlessEditor.setContent(html)` — HTML-form full replacement
 *   - `HeadlessEditor.setDocument(doc)` — structured-form full replacement
 *
 * Verifies the one-transaction replacement contract:
 *   - Full document body swapped in a single ReplaceStep
 *   - Events: contentChanged fires once; documentChanged fires with action 'Replaced'
 *   - History: replacement is a single undo step; undo() restores prior content
 *   - NodeView lifecycle: old NodeViews destroyed, new NodeViews created
 *   - Plugins remain alive (input rules still dispatch, selection sync still publishes)
 *   - Mounted DOM reflects the replaced content
 *   - All-or-nothing failure: invalid input preserves prior document, no events
 *   - Lifecycle: destroyed editor throws EditorLifecycleError
 */

import { HeadlessEditor } from '../../src/headless-editor/headless-editor';
import { EditorLifecycleError } from '../../src/errors/editor-lifecycle-error';
import {
    paragraphExtension,
    headingExtension,
    blockquoteExtension,
    boldExtension,
    codeBlockExtension,
    undoRedoExtension
} from '../../src/extensions/builtins';
import { defineExtension } from '../../src/extensions/define-extension';
import type { NodeViewConstructor, NodeViewDescriptor } from '../../src/extensions/types';
import { DocumentRoot, EditorNode, TextNode } from '../../src/model/editor-node';
import { ContentChangedPayload, DocumentChangedPayload } from '../../src/events/public-events/document-events';
import { DiagnosticsService } from '../../src/diagnostics/diagnostics-service';

/**
 * diagnostics is a private editor field; specs reach it through this cast to
 * spy on warnings. DiagnosticsService only records entries — it never writes
 * console output directly.
 */
function diagnosticsOf(editor: HeadlessEditor): DiagnosticsService {
    return (editor as unknown as { diagnostics: DiagnosticsService }).diagnostics;
}

const testExtensions: unknown[] = [
    paragraphExtension,
    headingExtension,
    blockquoteExtension,
    boldExtension,
    codeBlockExtension,
    undoRedoExtension
];

function buildDoc(children: EditorNode[]): DocumentRoot {
    return {
        id: crypto.randomUUID(),
        type: 'document',
        schemaVersion: 1,
        attrs: {},
        marks: [],
        children
    };
}

function paragraph(text: string): EditorNode {
    return {
        id: crypto.randomUUID(),
        type: 'paragraph',
        attrs: {},
        marks: [],
        children: text === ''
            ? []
            : [{ id: crypto.randomUUID(), type: 'text', text, attrs: {}, marks: [], children: [] } as EditorNode]
    } as EditorNode;
}

describe('setContent() — full HTML replacement', () => {
    let editor: HeadlessEditor;
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        editor = HeadlessEditor.create({
            extensions: testExtensions as never,
            content: '<p>original</p>'
        });
        editor.mount(container);
    });

    afterEach(() => {
        if (editor && !editor.isDestroyed) {
            editor.destroy();
        }
        if (container.parentNode) {
            container.parentNode.removeChild(container);
        }
    });

    it('replaces the full document content', () => {
        const result: boolean = editor.setContent('<h1>New Title</h1><p>Fresh content.</p>');

        expect(result).toBe(true);
        expect(editor.getDocument().children.length).toBe(2);
        expect(editor.getDocument().children[0].type).toBe('heading');
        expect(editor.getText()).toContain('Fresh content.');
    });

    it('round-trips through getHtml()', () => {
        const original: string = '<p>hello <strong>world</strong></p>';
        editor.setContent(original);
        const html: string = editor.getHtml();

        editor.setContent(html);
        expect(editor.getHtml()).toBe(html);
    });

    it('fires contentChanged once with the post-change document', () => {
        let fireCount: number = 0;
        let lastDoc: DocumentRoot | EditorNode | null = null;
        editor.on<ContentChangedPayload>('contentChanged', (payload: ContentChangedPayload): void => {
            fireCount += 1;
            lastDoc = payload.document;
        });

        editor.setContent('<p>replaced</p>');

        // Lock the event contract: the payload is the POST-change document,
        // not the pre-replace tree.
        expect(fireCount).toBe(1);
        expect(lastDoc!.type).toBe('document');
        expect(lastDoc!.children.length).toBe(1);
        expect(lastDoc!.children[0].type).toBe('paragraph');
        expect(lastDoc!.children[0].children.length).toBe(1);
        expect((lastDoc!.children[0].children[0] as TextNode).text).toBe('replaced');
    });

    it('fires documentChanged with action "Replaced"', () => {
        let action: string | null = null;
        editor.on<DocumentChangedPayload>('documentChanged', (payload: DocumentChangedPayload): void => {
            action = payload.action;
        });

        editor.setContent('<p>replaced</p>');

        expect(action).toBe('Replaced');
    });

    it('fires no events when input is rejected', () => {
        let fireCount: number = 0;
        editor.on('contentChanged', (): void => { fireCount += 1; });
        const warnSpy = spyOn(diagnosticsOf(editor), 'warn');

        // Non-string input is rejected deterministically.
        const result: boolean = editor.setContent(null as never);

        expect(result).toBe(false);
        expect(fireCount).toBe(0);
        expect(warnSpy).toHaveBeenCalled();
        expect(editor.getText()).toBe('original');
    });

    it('rejects a document body that violates the root content rule (no events, doc preserved)', () => {
        let fireCount: number = 0;
        editor.on('contentChanged', (): void => { fireCount += 1; });
        const warnSpy = spyOn(diagnosticsOf(editor), 'warn');

        // document node type is content: block+ — an empty children array
        // cannot map. Whatever fails first (NodeType.create or the
        // replaceWith no-step guard), the contract is identical.
        const result: boolean = editor.setDocument(buildDoc([]));

        expect(result).toBe(false);
        expect(fireCount).toBe(0);
        expect(warnSpy).toHaveBeenCalled();
        expect(editor.getText()).toBe('original');
    });

    it('lenient parse: unknown HTML tags are dropped, not rejected', () => {
        // PM's HTML parsing is lenient by design: tags without parseDOM rules
        // are unwrapped and their children parsed. There is no
        // deterministic-string catch-path for setContent with a valid schema
        // — the catch is defensive. This spec locks the actual behavior:
        // unknown tags vanish, known children survive.
        const result: boolean = editor.setContent('<customwrapper><p>kept</p></customwrapper>');

        expect(result).toBe(true);
        expect(editor.getText()).toBe('kept');
    });

    it('works on an unmounted editor (dispatch is view-optional)', () => {
        const unmounted: HeadlessEditor = HeadlessEditor.create({
            extensions: testExtensions as never,
            content: '<p>before</p>'
        });

        const result: boolean = unmounted.setContent('<p>after</p>');

        expect(result).toBe(true);
        expect(unmounted.getText()).toBe('after');
        expect(() => unmounted.getDocument()).not.toThrow();
        unmounted.destroy();
    });
});

describe('setDocument() — full structured replacement', () => {
    let editor: HeadlessEditor;
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        editor = HeadlessEditor.create({
            extensions: testExtensions as never,
            content: '<p>original</p>'
        });
        editor.mount(container);
    });

    afterEach(() => {
        if (editor && !editor.isDestroyed) {
            editor.destroy();
        }
        if (container.parentNode) {
            container.parentNode.removeChild(container);
        }
    });

    it('replaces the full document content', () => {
        const doc: DocumentRoot = buildDoc([
            paragraph('structured one'),
            { id: crypto.randomUUID(), type: 'heading', attrs: { level: 2 }, marks: [], children: [] }
        ]);

        const result: boolean = editor.setDocument(doc);

        expect(result).toBe(true);
        expect(editor.getDocument().children.length).toBe(2);
        expect(editor.getText()).toContain('structured one');
    });

    it('preserves the supplied root id', () => {
        const rootId: string = crypto.randomUUID();
        const doc: DocumentRoot = buildDoc([paragraph('kept')]);
        doc.id = rootId;

        editor.setDocument(doc);

        expect(editor.getDocument().id).toBe(rootId);
    });

    it('returns false and preserves content on unknown node type', () => {
        let fireCount: number = 0;
        editor.on('contentChanged', (): void => { fireCount += 1; });
        const warnSpy = spyOn(diagnosticsOf(editor), 'warn');

        const badDoc: DocumentRoot = buildDoc([
            { id: crypto.randomUUID(), type: 'warpDrive', attrs: {}, marks: [], children: [] }
        ]);

        const result: boolean = editor.setDocument(badDoc);

        expect(result).toBe(false);
        expect(fireCount).toBe(0);
        expect(warnSpy).toHaveBeenCalled();
        expect(editor.getText()).toBe('original');
    });

    it('returns false and preserves content on null payload', () => {
        const warnSpy = spyOn(diagnosticsOf(editor), 'warn');

        const result: boolean = editor.setDocument(null as never);

        expect(result).toBe(false);
        expect(warnSpy).toHaveBeenCalled();
        expect(editor.getText()).toBe('original');
    });
});

describe('setContent() / setDocument() — history integration', () => {
    let editor: HeadlessEditor;
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        editor = HeadlessEditor.create({
            extensions: testExtensions as never,
            content: '<p>original</p>'
        });
        editor.mount(container);
    });

    afterEach(() => {
        if (editor && !editor.isDestroyed) {
            editor.destroy();
        }
        if (container.parentNode) {
            container.parentNode.removeChild(container);
        }
    });

    it('replacement is a single undo step; undo() restores prior content', () => {
        editor.setContent('<h1>replacement</h1><p>new body</p>');

        // Dispatch pointer before undo so exactly one history entry exists
        // beyond the initial state.
        expect(editor.execute('undo')).toBe(true);
        expect(editor.getText()).toBe('original');

        expect(editor.execute('redo')).toBe(true);
        expect(editor.getText()).toContain('replacement');
    });

    it('setDocument() is also a single undo step', () => {
        editor.setDocument(buildDoc([paragraph('structured replacement')]));

        expect(editor.execute('undo')).toBe(true);
        expect(editor.getText()).toBe('original');
    });
});

describe('setContent() — NodeView lifecycle (mounted)', () => {
    let createdCount: number;
    let destroyedCount: number;
    let editor: HeadlessEditor;
    let container: HTMLElement;

    beforeEach(() => {
        createdCount = 0;
        destroyedCount = 0;
        container = document.createElement('div');
        document.body.appendChild(container);

        // Probe extension: a paragraph NodeView that counts create/destroy.
        const probeExtension = defineExtension({
            name: 'nv-probe',
            nodeViews(): Record<string, NodeViewConstructor> {
                return {
                    paragraph: (): NodeViewDescriptor => {
                        createdCount += 1;
                        return {
                            dom: document.createElement('p'),
                            contentDOM: document.createElement('span'),
                            destroy(): void {
                                destroyedCount += 1;
                            }
                        };
                    }
                };
            }
        });

        editor = HeadlessEditor.create({
            extensions: [...(testExtensions as never[]), probeExtension as never],
            content: '<p>one</p><p>two</p>'
        });
        editor.mount(container);
    });

    afterEach(() => {
        if (editor && !editor.isDestroyed) {
            editor.destroy();
        }
        if (container.parentNode) {
            container.parentNode.removeChild(container);
        }
    });

    it('destroys old NodeViews and creates new NodeViews on replace', () => {
        const createdBefore: number = createdCount;
        const destroyedBefore: number = destroyedCount;

        editor.setContent('<p>alpha</p><p>beta</p><p>gamma</p>');

        // Every paragraph NodeView from the old document is destroyed; the
        // new document's paragraphs get fresh NodeViews.
        expect(destroyedCount).toBe(destroyedBefore + 2);
        expect(createdCount).toBe(createdBefore + 3);
    });
});

describe('setContent() — plugins remain alive (mounted)', () => {
    let editor: HeadlessEditor;
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        editor = HeadlessEditor.create({
            extensions: testExtensions as never,
            content: '<p>original</p>'
        });
        editor.mount(container);
    });

    afterEach(() => {
        if (editor && !editor.isDestroyed) {
            editor.destroy();
        }
        if (container.parentNode) {
            container.parentNode.removeChild(container);
        }
    });

    it('keymap and command plugins still dispatch after replace', () => {
        editor.setContent('<p>alpha</p><p>beta</p>');

        // A command dispatched through the live command pipeline after the
        // replacement proves the keymap + command plugins are still wired.
        const result: boolean = editor.execute('setHeading', { level: 2 });

        expect(result).toBe(true);
        expect(editor.getDocument().children[0].type).toBe('heading');
    });

    it('selection sync still publishes selectionChanged after replace', () => {
        let selectionFired: boolean = false;
        editor.setContent('<p>alpha</p><p>beta</p>');
        editor.on('selectionChanged', (): void => { selectionFired = true; });

        // Move the cursor via setSelection builtin command.
        editor.execute('setSelection', { from: 2, to: 2 });

        expect(selectionFired).toBe(true);
    });

    it('paste/drop handlers remain attached to the view after replace (AC11)', () => {
        // The paste/drop wiring lives in buildViewProps() and is registered on
        // the view at mount() — it must survive setContent's in-place view
        // update. Probing the live view's registered props (the same
        // someProp technique used by the existing extension specs) proves
        // the handlers are still attached without synthesizing events.
        editor.setContent('<p>alpha</p><p>beta</p>');

        const view: { someProp: (prop: string, fn: (handler: unknown) => void) => void } =
            editor.integration.getView() as never;

        let hasPaste: boolean = false;
        let hasDrop: boolean = false;
        view.someProp('handlePaste', (handler: unknown): void => {
            if (typeof handler === 'function') { hasPaste = true; }
        });
        view.someProp('handleDrop', (handler: unknown): void => {
            if (typeof handler === 'function') { hasDrop = true; }
        });

        expect(hasPaste).toBe(true);
        expect(hasDrop).toBe(true);
    });

    it('held selection snapshot goes stale after replace (AC8)', () => {
        // saveSelection references nodeIds of the pre-replace document; the
        // full replacement removes those nodes, so the snapshot is marked
        // stale by the IntegrationManager postDispatchHook and restoration
        // must reject with false rather than resurrecting dead positions.
        editor.execute('setSelection', { from: 2, to: 2 });
        editor.saveSelection();

        editor.setContent('<p>completely different</p>');

        const restored: boolean = editor.restoreSelection();
        expect(restored).toBe(false);
    });
});

describe('setContent() — mounted DOM, selection, readOnly, lifecycle', () => {
    let editor: HeadlessEditor;
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        editor = HeadlessEditor.create({
            extensions: testExtensions as never,
            content: '<p>original</p>'
        });
        editor.mount(container);
    });

    afterEach(() => {
        if (editor && !editor.isDestroyed) {
            editor.destroy();
        }
        if (container.parentNode) {
            container.parentNode.removeChild(container);
        }
    });

    it('mounted DOM reflects replaced content', () => {
        editor.setContent('<h1>New Title</h1><blockquote>quoted</blockquote>');

        const pm: Element | null = container.querySelector('.ProseMirror');
        expect(pm).not.toBeNull();
        expect(pm!.innerHTML).toContain('<h1>');
        expect(pm!.innerHTML).toContain('New Title');
        expect(pm!.innerHTML.toLowerCase()).toContain('blockquote');
    });

    it('resets selection to document start', () => {
        editor.setContent('<p>alpha</p><p>beta</p>');

        const selection: { from: number; to: number; empty: boolean } = editor.getSelection();

        expect(selection.from).toBe(1);
        expect(selection.to).toBe(1);
        expect(selection.empty).toBe(true);
        expect(editor.getSelectionText()).toBe('');
    });

    it('empty string resets to a single empty paragraph', () => {
        const result: boolean = editor.setContent('   ');

        expect(result).toBe(true);
        const doc: DocumentRoot = editor.getDocument();
        expect(doc.children.length).toBe(1);
        expect(doc.children[0].type).toBe('paragraph');
        expect(editor.getText()).toBe('');
    });

    it('replaces even in readOnly mode (programmatic semantics)', () => {
        editor.setOptions({ readOnly: true });

        const result: boolean = editor.setContent('<p>read-only replacement</p>');

        expect(result).toBe(true);
        expect(editor.getText()).toContain('read-only replacement');
    });

    it('throws EditorLifecycleError after destroy()', () => {
        const container3: HTMLElement = document.createElement('div');
        document.body.appendChild(container3);
        const doomed: HeadlessEditor = HeadlessEditor.create({ extensions: testExtensions as never });
        doomed.mount(container3);
        doomed.destroy();

        expect(() => doomed.setContent('<p>late</p>')).toThrowError(EditorLifecycleError);
        document.body.removeChild(container3);
    });
});

