/**
 * spec/commands/builtins/content.spec.ts
 *
 * Unit tests for all six content builtin commands:
 *   insertNode, deleteNode, moveNode, insertText, deleteText, replaceText
 */
import { buildIM, buildCtx, buildTwoParagraphDoc, emptyEditorDoc, textEditorDoc, findNodeIdByType, countNodesOfType } from './helpers';
import { insertNodeCommand } from '../../../src/commands/builtins/content/insert-node';
import { deleteNodeCommand } from '../../../src/commands/builtins/content/delete-node';
import { moveNodeCommand } from '../../../src/commands/builtins/content/move-node';
import { insertTextCommand } from '../../../src/commands/builtins/content/insert-text';
import { deleteTextCommand } from '../../../src/commands/builtins/content/delete-text';
import { replaceTextCommand } from '../../../src/commands/builtins/content/replace-text';
import { deleteRangeCommand } from '../../../src/commands/builtins/content/delete-range';
import { EditorNode, TextNode } from '../../../src/model/editor-node';
import { HeadlessEditor, paragraphExtension } from '../../../src';

// ── insertNode ────────────────────────────────────────────────────────────────

describe('insertNodeCommand', () => {
    it('has name "insertNode" and category "content"', () => {
        expect(insertNodeCommand.name).toBe('insertNode');
        expect(insertNodeCommand.meta?.category).toBe('content');
    });

    it('canExecute returns false when parentId is unknown', () => {
        const im = buildIM();
        const { ctx } = buildCtx(im);
        const payload = {
            parentId: 'non-existent-id',
            index: 0,
            node: { id: 'new-1', type: 'paragraph', attrs: {}, children: [], marks: [] } as EditorNode
        };
        // canExecute works against ctx.document (the EditorDoc snapshot)
        expect(insertNodeCommand.canExecute!(ctx, payload)).toBe(false);
    });

    it('canExecute returns false when index is out of bounds', () => {
        const im = buildIM();
        const { ctx } = buildCtx(im);
        // The root doc has id 'doc-spec-001' with 1 child paragraph
        const payload = {
            parentId: 'doc-spec-001',
            index: 99,
            node: { id: 'new-2', type: 'paragraph', attrs: {}, children: [], marks: [] } as EditorNode
        };
        expect(insertNodeCommand.canExecute!(ctx, payload)).toBe(false);
    });
});
// ── deleteNode ────────────────────────────────────────────────────────────────

describe('deleteNodeCommand', () => {
    it('has name "deleteNode" and category "content"', () => {
        expect(deleteNodeCommand.name).toBe('deleteNode');
        expect(deleteNodeCommand.meta?.category).toBe('content');
    });

    it('canExecute returns false for unknown nodeId', () => {
        const im = buildIM();
        const { ctx } = buildCtx(im);
        expect(deleteNodeCommand.canExecute!(ctx, { nodeId: 'ghost-id' })).toBe(false);
    });

    it('canExecute returns false for the root document node', () => {
        const im = buildIM();
        const { ctx } = buildCtx(im);
        expect(deleteNodeCommand.canExecute!(ctx, { nodeId: 'doc-spec-001' })).toBe(false);
    });

    it('execute dispatches a transaction for a valid node', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        deleteNodeCommand.execute(ctx, { nodeId: 'para-spec-001' });
        expect(dispatched.length).toBe(1);
    });
});

// ── moveNode ──────────────────────────────────────────────────────────────────

describe('moveNodeCommand', () => {
    it('has name "moveNode" and category "content"', () => {
        expect(moveNodeCommand.name).toBe('moveNode');
        expect(moveNodeCommand.meta?.category).toBe('content');
    });

    it('returns false when source node is not found', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        moveNodeCommand.execute(ctx, {
            nodeId: 'missing-node',
            newParentId: 'doc-spec-001',
            newIndex: 0
        });
        expect(dispatched.length).toBe(0);
    });
});

// ── insertText ────────────────────────────────────────────────────────────────

describe('insertTextCommand', () => {
    it('has name "insertText" and category "content"', () => {
        expect(insertTextCommand.name).toBe('insertText');
        expect(insertTextCommand.meta?.category).toBe('content');
    });

    it('canExecute returns false for empty string', () => {
        const im = buildIM();
        const { ctx } = buildCtx(im);
        expect(insertTextCommand.canExecute!(ctx, { text: '' })).toBe(false);
    });

    it('execute dispatches a transaction for a non-empty string', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        insertTextCommand.execute(ctx, { text: 'Hello' });
        expect(dispatched.length).toBe(1);
    });

    it('execute with "at" position returns false for unknown nodeId', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        insertTextCommand.execute(ctx, {
            text: 'Hi',
            at: { nodeId: 'missing-node', offset: 0 }
        });
        expect(dispatched.length).toBe(0);
    });
});

// ── deleteText ────────────────────────────────────────────────────────────────

describe('deleteTextCommand', () => {
    it('has name "deleteText" and category "content"', () => {
        expect(deleteTextCommand.name).toBe('deleteText');
        expect(deleteTextCommand.meta?.category).toBe('content');
    });

    it('returns false when nodeId is not found', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        deleteTextCommand.execute(ctx, {
            from: { nodeId: 'missing', offset: 0 },
            to: { nodeId: 'missing', offset: 1 }
        });
        expect(dispatched.length).toBe(0);
    });
});

// ── replaceText ───────────────────────────────────────────────────────────────

describe('replaceTextCommand', () => {
    it('has name "replaceText" and category "content"', () => {
        expect(replaceTextCommand.name).toBe('replaceText');
        expect(replaceTextCommand.meta?.category).toBe('content');
    });

    it('returns false when nodeId is not found', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        replaceTextCommand.execute(ctx, {
            text: 'replacement',
            from: { nodeId: 'missing', offset: 0 },
            to: { nodeId: 'missing', offset: 1 }
        });
        expect(dispatched.length).toBe(0);
    });
});

// ── deleteRange ───────────────────────────────────────────────────────────────

describe('deleteRangeCommand', () => {
    // Document: <para>Hello /heading</para> — doc positions: "Hello " spans 1..7, "/heading" spans 7..15.
    const DOC_TEXT = 'Hello /heading';

    it('has name "deleteRange" and category "content"', () => {
        expect(deleteRangeCommand.name).toBe('deleteRange');
        expect(deleteRangeCommand.meta?.category).toBe('content');
    });

    it('canExecute returns true for a valid in-bounds range', () => {
        const im = buildIM(textEditorDoc(DOC_TEXT));
        const { ctx } = buildCtx(im);
        expect(deleteRangeCommand.canExecute!(ctx, { from: 7, to: 15 })).toBe(true);
    });

    it('execute dispatches one transaction and removes the range content', () => {
        const im = buildIM(textEditorDoc(DOC_TEXT));
        const { ctx, dispatched } = buildCtx(im);
        deleteRangeCommand.execute(ctx, { from: 7, to: 15 });
        expect(dispatched.length).toBe(1);
        expect(im.getState().doc.textContent).toBe('Hello ');
    });

    it('sets the selection at the mapped position after deletion', () => {
        const im = buildIM(textEditorDoc(DOC_TEXT));
        const { ctx, dispatched } = buildCtx(im);
        deleteRangeCommand.execute(ctx, { from: 7, to: 15 });
        expect(dispatched.length).toBe(1);
        const selection = im.getState().selection;
        expect(selection.from).toBe(7);
        expect(selection.to).toBe(7);
        expect(selection.empty).toBe(true);
    });

    it('collapsed range (from === to) dispatches a cursor-only transaction', () => {
        const im = buildIM(textEditorDoc(DOC_TEXT));
        const { ctx, dispatched } = buildCtx(im);
        deleteRangeCommand.execute(ctx, { from: 4, to: 4 });
        expect(dispatched.length).toBe(1);
        expect(im.getState().doc.textContent).toBe(DOC_TEXT);
        expect(im.getState().selection.from).toBe(4);
        expect(im.getState().selection.empty).toBe(true);
    });

    it('does not dispatch for non-integer positions', () => {
        const im = buildIM(textEditorDoc(DOC_TEXT));
        const { ctx, dispatched } = buildCtx(im);
        expect(deleteRangeCommand.canExecute!(ctx, { from: NaN, to: 5 } as any)).toBe(false);
        deleteRangeCommand.execute(ctx, { from: NaN, to: 5 } as any);
        expect(dispatched.length).toBe(0);
    });

    it('does not dispatch for a missing payload', () => {
        const im = buildIM(textEditorDoc(DOC_TEXT));
        const { ctx, dispatched } = buildCtx(im);
        expect(deleteRangeCommand.canExecute!(ctx, undefined as any)).toBe(false);
        deleteRangeCommand.execute(ctx, undefined as any);
        expect(dispatched.length).toBe(0);
    });

    it('does not dispatch for an out-of-bound "to" position', () => {
        const im = buildIM(textEditorDoc(DOC_TEXT));
        const { ctx, dispatched } = buildCtx(im);
        const maxPos = im.getState().doc.content.size;
        const payload = { from: 0, to: maxPos + 100 };
        expect(deleteRangeCommand.canExecute!(ctx, payload)).toBe(false);
        deleteRangeCommand.execute(ctx, payload);
        expect(dispatched.length).toBe(0);
        expect(im.getState().doc.textContent).toBe(DOC_TEXT);
    });

    it('does not dispatch for a reversed range', () => {
        const im = buildIM(textEditorDoc(DOC_TEXT));
        const { ctx, dispatched } = buildCtx(im);
        const payload = { from: 10, to: 5 };
        expect(deleteRangeCommand.canExecute!(ctx, payload)).toBe(false);
        deleteRangeCommand.execute(ctx, payload);
        expect(dispatched.length).toBe(0);
        expect(im.getState().doc.textContent).toBe(DOC_TEXT);
    });

    it('does not dispatch for a negative "from" position', () => {
        const im = buildIM(textEditorDoc(DOC_TEXT));
        const { ctx, dispatched } = buildCtx(im);
        const payload = { from: -1, to: 5 };
        expect(deleteRangeCommand.canExecute!(ctx, payload)).toBe(false);
        deleteRangeCommand.execute(ctx, payload);
        expect(dispatched.length).toBe(0);
    });

    it('deletes a range at the beginning of a paragraph', () => {
        // Paragraph holds "Hello /heading": delete "Hello " (1..7) first.
        const im = buildIM(textEditorDoc(DOC_TEXT));
        const { ctx, dispatched } = buildCtx(im);
        deleteRangeCommand.execute(ctx, { from: 1, to: 7 });
        expect(dispatched.length).toBe(1);
        expect(im.getState().doc.textContent).toBe('/heading');
        expect(im.getState().selection.from).toBe(1);
    });

    it('deletes a range at the end of a paragraph', () => {
        const im = buildIM(textEditorDoc(DOC_TEXT));
        const { ctx, dispatched } = buildCtx(im);
        deleteRangeCommand.execute(ctx, { from: 5, to: 15 });
        expect(dispatched.length).toBe(1);
        expect(im.getState().doc.textContent).toBe('Hell');
        expect(im.getState().selection.from).toBe(5);
    });

    it('deletes a range spanning two text nodes within a paragraph', () => {
        // <para><text>Hello world</text></para> is one text node in the fixture helper;
        // build two-paragraph variant for a cross-node range: join via second paragraph.
        const doc = buildTwoParagraphDoc('Hello ', 'world');
        const im = buildIM(doc);
        const { ctx, dispatched } = buildCtx(im);
        const docSize = im.getState().doc.content.size;
        // Delete from inside paragraph 1 to the end of document.
        deleteRangeCommand.execute(ctx, { from: 3, to: docSize - 1 });
        expect(dispatched.length).toBe(1);
        expect(im.getState().doc.textContent).toBe('He');
    });
});

describe('Built-in: content — insertNodeCommand complete coverage', () => {
    let container: HTMLElement;
    let editor: any;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        if (editor && !editor.integration?.isDestroyed) {
            editor.destroy();
        }
        container.remove();
    });

    it('should successfully execute insertNode and cover the entire position lookup pipeline inside a rendered editor', () => {
        // 1. Render a live editor instance populated with a target paragraph node
        editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [
                    {
                        type: 'paragraph',
                        id: 'parent-target-id', // Unique tracking id
                        attrs: { id: 'parent-target-id' }, // Ensures node.attrs['id'] matches during doc walk
                        marks: [],
                        children: [
                            {
                                type: 'text',
                                id: crypto.randomUUID(),
                                attrs: {},
                                children: [],
                                text: 'Initial Content',
                                marks: []
                            } as TextNode
                        ]
                    }
                ]
            },
            extensions: [paragraphExtension]
        });
        editor.mount(container);

        // Verify the initial DOM layout state
        expect(container.textContent).toContain('Initial Content');

        // 2. Dispatch the command via the public editor commands pipeline interface
        // This natively routes through canExecute (Line 19) and evaluate lines 25-55
        const result = editor.commands.insertNode({
            parentId: 'parent-target-id',
            index: 1,
            node: {
                type: 'paragraph',
                id: crypto.randomUUID(),
                attrs: {},
                children: [
                    {
                        type: 'text',
                        id: crypto.randomUUID(),
                        attrs: {},
                        children: [],
                        text: ' - Successfully Inserted Node Natively!',
                        marks: []
                    }
                ]
            }
        });

        // 3. Assert execution results and DOM updates
        expect(result).not.toBe(false);
        expect(container.textContent).toContain('Initial Content - Successfully Inserted Node Natively!');
    });

    it('should successfully execute moveNode and cover all transaction pipelines inside a rendered editor', () => {
        // 1. Render a live editor instance containing a source node and a target parent node
        editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [
                    {
                        type: 'paragraph',
                        id: 'source-node-id', // Node to be moved
                        attrs: { id: 'source-node-id' }, // Essential for the ProseMirror doc descendants walk
                        marks: [],
                        children: [
                            {
                                type: 'text',
                                id: crypto.randomUUID(),
                                attrs: {},
                                children: [],
                                text: 'Node to move',
                                marks: []
                            } as TextNode
                        ]
                    },
                    {
                        type: 'paragraph',
                        id: 'target-parent-id', // Destination parent node
                        attrs: { id: 'target-parent-id' }, // Essential for tracking insertPos mapping
                        marks: [],
                        children: [
                            {
                                type: 'text',
                                id: crypto.randomUUID(),
                                attrs: {},
                                children: [],
                                text: 'Target parent content',
                                marks: []
                            } as TextNode
                        ]
                    }
                ]
            },
            extensions: [paragraphExtension]
        });
        editor.mount(container);
        // Verify initial layout state positions
        expect(container.textContent).toContain('Node to moveTarget parent content');
        // 2. Dispatch the moveNode command via the public editor command interface
        // Setting newIndex to 1 appends the node AFTER 'Target parent content'
        const result = editor.commands.moveNode({
            nodeId: 'source-node-id',
            newParentId: 'target-parent-id',
            newIndex: 1 
        });
        // 3. Assert successful execution outcome metrics and verify DOM structure shift
        expect(result).not.toBe(false);
        expect(container.textContent).toContain('Target parent contentNode to move');
    });

    it('should successfully execute replaceText and cover all transaction pipelines inside a rendered editor', () => {
        // 1. Render a live editor instance populated with a target paragraph node
        editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [
                    {
                        type: 'paragraph',
                        id: 'text-target-id', // Assigning a stable nodeId for mapping lookup coordinates
                        attrs: { id: 'text-target-id' },
                        marks: [],
                        children: [
                            {
                                type: 'text',
                                id: crypto.randomUUID(),
                                attrs: {},
                                children: [],
                                text: 'Initial Word',
                                marks: []
                            } as TextNode
                        ]
                    }
                ]
            },
            extensions: [paragraphExtension]
        });
        editor.mount(container);

        // Verify the initial layout state inside the DOM surface
        expect(container.textContent).toContain('Initial Word');

        // 2. Dispatch the replaceText command via the public editor commands pipeline interface
        // This natively walks past line 9 (canExecute), maps stable positions, checks boundaries, and updates tr
        const result = editor.commands.replaceText({
            from: { nodeId: 'text-target-id', offset: 8 }, // Targets right before "Word"
            to: { nodeId: 'text-target-id', offset: 12 },   // Captures through the end of "Word"
            text: 'Text Replaced Natively!'
        });

        // 3. Assert successful execution outcome metrics and verify DOM updates
        expect(result).not.toBe(false);
        expect(container.textContent).toContain('Initial Text Replaced Natively!');
        expect(container.textContent).not.toContain('Word');
    });
});
