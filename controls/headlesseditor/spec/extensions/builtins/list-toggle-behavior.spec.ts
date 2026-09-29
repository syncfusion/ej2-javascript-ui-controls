/**
 * spec/extensions/builtins/list-toggle-behavior.spec.ts
 *
 * Behavior-driven tests for list toggling covering the scenarios addressed by
 * the recent heading→list and collapsible-header restriction changes.
 *
 * Each test drives a single user flow end-to-end:
 *   selection → command execution → document model + rendered DOM
 *
 * Tests assert observable behavior (DOM output, document model, undo
 * cohesion) — never internals like step counts, normalize helpers, or
 * direct command object access.
 */
import {
    HeadlessEditor,
    paragraphExtension,
    headingExtension,
    blockquoteExtension,
    calloutExtension,
    collapsibleExtension,
    taskListExtension,
    undoRedoExtension,
    DocumentRoot,
    EditorNode,
    TextNode
} from '../../../src/index';
import { listExtension } from '../../../src/extensions/builtins/list';

// ── Shared document builders ─────────────────────────────────────────────────

function textNode(text: string): TextNode {
    return {
        id: crypto.randomUUID(),
        type: 'text',
        text,
        attrs: {},
        marks: [],
        children: []
    } as TextNode;
}

function paragraph(text: string): EditorNode {
    return {
        id: crypto.randomUUID(),
        type: 'paragraph',
        attrs: {},
        marks: [],
        children: [textNode(text)]
    } as EditorNode;
}

function namedTextNode(text: string, marksTypes: readonly string[] = []): TextNode {
    return {
        id: crypto.randomUUID(),
        type: 'text',
        text,
        attrs: {},
        marks: marksTypes.map((name) => ({ type: name, attrs: {} })),
        children: []
    } as TextNode;
}

function heading(text: string, level: number = 1): EditorNode {
    return {
        id: crypto.randomUUID(),
        type: 'heading',
        attrs: { level },
        marks: [],
        children: [textNode(text)]
    } as EditorNode;
}

function listItem(children: EditorNode[]): EditorNode {
    return {
        id: crypto.randomUUID(),
        type: 'listItem',
        attrs: {},
        marks: [],
        children
    } as EditorNode;
}

function bulletList(items: EditorNode[], attrs: Record<string, unknown> = {}): EditorNode {
    return {
        id: crypto.randomUUID(),
        type: 'bulletList',
        attrs: { listStyleType: 'disc', ...attrs },
        marks: [],
        children: items
    } as EditorNode;
}

function orderedList(items: EditorNode[], order: number = 1): EditorNode {
    return {
        id: crypto.randomUUID(),
        type: 'orderedList',
        attrs: { order, listStyleType: 'decimal' },
        marks: [],
        children: items
    } as EditorNode;
}

function blockquote(children: EditorNode[]): EditorNode {
    return {
        id: crypto.randomUUID(),
        type: 'blockquote',
        attrs: {},
        marks: [],
        children
    } as EditorNode;
}

function callout(children: EditorNode[], variant: string = 'info'): EditorNode {
    return {
        id: crypto.randomUUID(),
        type: 'callout',
        attrs: { variant },
        marks: [],
        children
    } as EditorNode;
}

function collapsibleHeader(child: EditorNode): EditorNode {
    return {
        id: crypto.randomUUID(),
        type: 'collapsibleHeader',
        attrs: {},
        marks: [],
        children: child.type === 'heading'
            || child.type === 'paragraph' ? [child] : []
    } as EditorNode;
}

function collapsibleBody(children: EditorNode[]): EditorNode {
    return {
        id: crypto.randomUUID(),
        type: 'collapsibleBody',
        attrs: {},
        marks: [],
        children
    } as EditorNode;
}

function collapsible(
    headerChild: EditorNode,
    bodyChildren: EditorNode[] = []
): EditorNode {
    return {
        id: crypto.randomUUID(),
        type: 'collapsible',
        attrs: { collapsed: false },
        marks: [],
        children: [
            collapsibleHeader(headerChild),
            collapsibleBody(bodyChildren)
        ]
    } as EditorNode;
}

function documentRoot(children: EditorNode[]): DocumentRoot {
    return {
        type: 'document',
        id: crypto.randomUUID(),
        schemaVersion: 1,
        attrs: {},
        marks: [],
        children
    } as DocumentRoot;
}

// ── Test editor factory ───────────────────────────────────────────────────────

interface TestEditor {
    editor: HeadlessEditor;
    container: HTMLElement;
    destroy(): void;
}

function setupEditor(content: DocumentRoot, extensions: any[] = []): TestEditor {
    const container: HTMLElement = document.createElement('div');
    document.body.appendChild(container);

    const editor: HeadlessEditor = HeadlessEditor.create({
        document: content,
        extensions: [
            paragraphExtension,
            headingExtension,
            listExtension,
            blockquoteExtension,
            calloutExtension,
            collapsibleExtension,
            taskListExtension,
            ...extensions
        ]
    });
    editor.mount(container);

    return {
        editor,
        container,
        destroy(): void {
            if (!editor.isDestroyed) {
                editor.destroy();
            }
            container.remove();
        }
    };
}

// ── Selection helpers ───────────────────────────────────────────────────────
// Toggle commands operate at the block boundary: any selection covering the
// target block does the right thing. When the cursor must land inside a
// specific node (e.g. collapsibleHeader vs collapsibleBody), we use
// ProseMirror's own `descendants` walk to find the matching text node.

function selectAll(editor: HeadlessEditor): void {
    const size: number = (editor.integration.getState() as any).doc.content.size;
    editor.commands.setSelection({ from: 0, to: size });
}

function selectTextMatching(editor: HeadlessEditor, text: string): void {
    let found: { from: number; to: number } | null = null;
    (editor.integration.getState() as any).doc.descendants(
        (node: any, pos: number): boolean => {
            if (node.isText && node.text === text) {
                found = { from: pos, to: pos + node.nodeSize };
                return false;
            }
            return true;
        }
    );
    if (!found) {
        throw new Error(`No text node with text "${text}" in document`);
    }
    editor.commands.setSelection(found);
}

// ── Document introspection helpers ────────────────────────────────────────────

function getFirstChild(doc: DocumentRoot): EditorNode {
    return doc.children[0];
}

function collectTypes(node: EditorNode): string[] {
    const acc: string[] = [(node as any).type];
    for (const child of node.children ?? []) {
        acc.push(...collectTypes(child));
    }
    return acc;
}

function findNode(node: EditorNode, typeName: string): EditorNode | null {
    if ((node as any).type === typeName) {
        return node;
    }
    for (const child of node.children ?? []) {
        const hit: EditorNode | null = findNode(child, typeName);
        if (hit) {
            return hit;
        }
    }
    return null;
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('List toggle behaviors', () => {

    describe('when toggling a heading to a bullet list', () => {
        it('should convert the heading to a paragraph inside a bullet list', () => {
            const te: TestEditor = setupEditor(documentRoot([heading('Item')]));
            try {
                selectTextMatching(te.editor, 'Item');

                const ok: boolean = te.editor.commands.toggleBulletList();
                expect(ok).toBe(true);

                const doc: DocumentRoot = te.editor.getDocument();
                expect(doc.children.length).toBe(1);
                const ul: EditorNode = doc.children[0];
                expect((ul as any).type).toBe('bulletList');
                expect(ul.children.length).toBe(1);
                const li: EditorNode = ul.children[0];
                expect((li as any).type).toBe('listItem');
                expect(li.children.length).toBe(1);
                expect((li.children[0] as any).type).toBe('paragraph');
                expect((li.children[0] as EditorNode).children[0] as any)
                    .toEqual(jasmine.objectContaining({ text: 'Item' }));

                const ulEl: HTMLElement | null = te.container.querySelector('ul');
                const pEl: HTMLElement | null = te.container.querySelector('li > p');
                expect(ulEl).not.toBeNull();
                expect(pEl).not.toBeNull();
                expect(pEl!.textContent).toBe('Item');
            } finally {
                te.destroy();
            }
        });
    });

    describe('when toggling a heading to an ordered list', () => {
        it('should convert the heading into an ordered list with the heading text', () => {
            const te: TestEditor = setupEditor(documentRoot([heading('Item')]));
            try {
                selectTextMatching(te.editor, 'Item');

                const ok: boolean = te.editor.commands.toggleOrderedList();
                expect(ok).toBe(true);

                const doc: DocumentRoot = te.editor.getDocument();
                const ol: EditorNode = doc.children[0];
                expect((ol as any).type).toBe('orderedList');
                expect(((ol.children[0].children[0].children[0] as any).text)).toBe('Item');

                const olEl: HTMLElement | null = te.container.querySelector('ol');
                expect(olEl).not.toBeNull();
                expect(te.container.querySelector('ol > li > p')!.textContent).toBe('Item');
            } finally {
                te.destroy();
            }
        });
    });

    describe('when toggling a heading inside a blockquote', () => {
        it('should preserve the blockquote and produce a bullet list inside it', () => {
            const te: TestEditor = setupEditor(documentRoot([blockquote([heading('Item')])]));
            try {
                selectTextMatching(te.editor, 'Item');

                const ok: boolean = te.editor.commands.toggleBulletList();
                expect(ok).toBe(true);

                const doc: DocumentRoot = te.editor.getDocument();
                expect(doc.children.length).toBe(1);
                const bq: EditorNode = doc.children[0];
                expect((bq as any).type).toBe('blockquote');
                expect(bq.children.some((c) => (c as any).type === 'bulletList')).toBe(true);
                expect(findNode(bq, 'heading')).toBeNull();

                const bqEl: HTMLElement | null = te.container.querySelector('blockquote');
                expect(bqEl).not.toBeNull();
                const ulInBq: HTMLElement | null = bqEl!.querySelector('ul');
                expect(ulInBq).not.toBeNull();
                expect(ulInBq!.querySelector('li > p')!.textContent).toBe('Item');
            } finally {
                te.destroy();
            }
        });
    });

    describe('when toggling a heading inside a callout', () => {
        it('should preserve the callout and convert the heading to a bullet list inside it', () => {
            const te: TestEditor = setupEditor(documentRoot([
                callout([heading('Item')], 'info')
            ]));
            try {
                selectTextMatching(te.editor, 'Item');

                const ok: boolean = te.editor.commands.toggleBulletList();
                expect(ok).toBe(true);

                const doc: DocumentRoot = te.editor.getDocument();
                expect(doc.children.length).toBe(1);
                const cal: EditorNode = doc.children[0];
                expect((cal as any).type).toBe('callout');
                expect(cal.children.some((c) => (c as any).type === 'bulletList')).toBe(true);

                const calEl: HTMLElement | null = te.container.querySelector('[data-type="callout"]');
                expect(calEl).not.toBeNull();
                const ulInCal: HTMLElement | null = calEl!.querySelector('ul');
                expect(ulInCal).not.toBeNull();
                expect(ulInCal!.querySelector('li > p')!.textContent).toBe('Item');
            } finally {
                te.destroy();
            }
        });
    });

    describe('when toggling a paragraph to a bullet list', () => {
        it('should wrap the paragraph directly (regression: existing behavior)', () => {
            const te: TestEditor = setupEditor(documentRoot([paragraph('Item')]));
            try {
                selectTextMatching(te.editor, 'Item');

                const ok: boolean = te.editor.commands.toggleBulletList();
                expect(ok).toBe(true);

                const doc: DocumentRoot = te.editor.getDocument();
                expect((doc.children[0] as any).type).toBe('bulletList');
                const li: EditorNode = doc.children[0].children[0];
                expect((li as any).type).toBe('listItem');
                expect((li.children[0] as any).type).toBe('paragraph');
                expect((li.children[0].children[0] as any).text).toBe('Item');
            } finally {
                te.destroy();
            }
        });
    });

    describe('when toggling an existing bullet list off', () => {
        it('should lift the list back into a paragraph', () => {
            const te: TestEditor = setupEditor(documentRoot([
                bulletList([listItem([paragraph('Item')])])
            ]));
            try {
                selectTextMatching(te.editor, 'Item');

                const ok: boolean = te.editor.commands.toggleBulletList();
                expect(ok).toBe(true);

                const doc: DocumentRoot = te.editor.getDocument();
                expect(findNode(doc.children[0], 'bulletList')).toBeNull();
                expect((doc.children[0].children[0] as any).text).toBe('Item');
            } finally {
                te.destroy();
            }
        });
    });

    describe('when converting between list types', () => {
        it('should convert a bullet list to an ordered list while preserving items', () => {
            const te: TestEditor = setupEditor(documentRoot([
                bulletList([
                    listItem([paragraph('Alpha')]),
                    listItem([paragraph('Beta')])
                ])
            ]));
            try {
                selectTextMatching(te.editor, 'Alpha');

                const ok: boolean = te.editor.commands.toggleOrderedList();
                expect(ok).toBe(true);

                const doc: DocumentRoot = te.editor.getDocument();
                const ol: EditorNode = doc.children[0];
                expect((ol as any).type).toBe('orderedList');
                expect(ol.children.length).toBe(2);
                expect((ol.children[0].children[0].children[0] as any).text).toBe('Alpha');
                expect((ol.children[1].children[0].children[0] as any).text).toBe('Beta');
            } finally {
                te.destroy();
            }
        });

        it('should convert an ordered list to a bullet list while preserving items', () => {
            const te: TestEditor = setupEditor(documentRoot([
                orderedList([
                    listItem([paragraph('First')]),
                    listItem([paragraph('Second')])
                ])
            ]));
            try {
                selectTextMatching(te.editor, 'First');

                const ok: boolean = te.editor.commands.toggleBulletList();
                expect(ok).toBe(true);

                const doc: DocumentRoot = te.editor.getDocument();
                const ul: EditorNode = doc.children[0];
                expect((ul as any).type).toBe('bulletList');
                expect(ul.children.length).toBe(2);
                expect((ul.children[0].children[0].children[0] as any).text).toBe('First');
                expect((ul.children[1].children[0].children[0] as any).text).toBe('Second');
            } finally {
                te.destroy();
            }
        });
    });

    describe('when the cursor is inside a collapsibleHeader containing a heading', () => {
        it('should reject toggleBulletList and leave the heading untouched', () => {
            const te: TestEditor = setupEditor(documentRoot([
                collapsible(heading('Header text'), [])
            ]));
            try {
                const beforeDoc: DocumentRoot = te.editor.getDocument();
                const beforeTypes: string[] = collectTypes(getFirstChild(beforeDoc));
                expect(beforeTypes).toContain('heading');
                expect(beforeTypes).not.toContain('bulletList');

                selectTextMatching(te.editor, 'Header text');

                const allowed: boolean = te.editor.can().toggleBulletList();
                expect(allowed).toBe(false);

                const result: boolean = te.editor.commands.toggleBulletList();
                expect(result).toBe(false);

                const afterDoc: DocumentRoot = te.editor.getDocument();
                const afterTypes: string[] = collectTypes(getFirstChild(afterDoc));
                expect(afterTypes).toContain('heading');
                expect(afterTypes).not.toContain('bulletList');
            } finally {
                te.destroy();
            }
        });
    });

    describe('when the cursor is inside a collapsibleHeader containing a paragraph', () => {
        it('should reject toggleBulletList and leave the paragraph untouched', () => {
            const te: TestEditor = setupEditor(documentRoot([
                collapsible(paragraph('Header text'), [])
            ]));
            try {
                selectTextMatching(te.editor, 'Header text');

                const allowed: boolean = te.editor.can().toggleBulletList();
                expect(allowed).toBe(false);

                const result: boolean = te.editor.commands.toggleBulletList();
                expect(result).toBe(false);

                const afterDoc: DocumentRoot = te.editor.getDocument();
                expect(findNode(getFirstChild(afterDoc), 'bulletList')).toBeNull();
                expect(findNode(getFirstChild(afterDoc), 'paragraph')).not.toBeNull();
            } finally {
                te.destroy();
            }
        });
    });

    describe('when the cursor is inside a collapsibleBody', () => {
        it('should allow bullet list toggling on a paragraph in the body', () => {
            const te: TestEditor = setupEditor(documentRoot([
                collapsible(heading('Header text'), [paragraph('Body text')])
            ]));
            try {
                selectTextMatching(te.editor, 'Body text');

                const allowed: boolean = te.editor.can().toggleBulletList();
                expect(allowed).toBe(true);

                const ok: boolean = te.editor.commands.toggleBulletList();
                expect(ok).toBe(true);

                const doc: DocumentRoot = te.editor.getDocument();
                const col: EditorNode = doc.children[0];
                expect((col as any).type).toBe('collapsible');
                const body: EditorNode = col.children[1];
                expect((body as any).type).toBe('collapsibleBody');
                expect(body.children.some((c) => (c as any).type === 'bulletList')).toBe(true);
                const header: EditorNode = col.children[0];
                expect((header as any).type).toBe('collapsibleHeader');
                expect(findNode(header, 'heading')).not.toBeNull();
            } finally {
                te.destroy();
            }
        });
    });

    describe('single dispatch property', () => {
        it('should perform the heading-to-list transformation as a single undoable transaction', () => {
            // Single-dispatch contract: the toggle's normalize + wrap
            // operations are committed in one transactional step. With
            // undoRedoExtension installed, exactly one undo restores the
            // pre-toggle state — never an intermediate "paragraph" state.
            const te: TestEditor = setupEditor(
                documentRoot([heading('Item')]),
                [undoRedoExtension]
            );
            try {
                selectTextMatching(te.editor, 'Item');

                const ok: boolean = te.editor.commands.toggleBulletList();
                expect(ok).toBe(true);

                const docBeforeUndo: DocumentRoot = te.editor.getDocument();
                const typesBeforeUndo: string[] = collectTypes(getFirstChild(docBeforeUndo));
                expect(typesBeforeUndo).toContain('bulletList');
                expect(typesBeforeUndo).not.toContain('heading');

                expect(te.editor.commands.undo()).toBe(true);
                const docAfterUndo: DocumentRoot = te.editor.getDocument();
                expect(findNode(getFirstChild(docAfterUndo), 'heading')).not.toBeNull();
                expect(findNode(getFirstChild(docAfterUndo), 'bulletList')).toBeNull();
            } finally {
                te.destroy();
            }
        });
    });
});
