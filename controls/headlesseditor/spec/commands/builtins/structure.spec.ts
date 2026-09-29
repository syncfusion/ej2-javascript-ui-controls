/**
 * spec/commands/builtins/structure.spec.ts
 *
 * Unit tests for all structure builtin commands:
 *   toggleBlockStructure (internal), duplicateNode, wrapNode, unwrapNode,
 *   transformNode, setHeading, setParagraph, toggleBlockQuote, toggleCallout,
 *   setCodeBlock, setHorizontalRule, setTextAlign
 */
import { countNodesOfType } from './helpers';
import { HeadlessEditor } from '../../../src/headless-editor/headless-editor';
import { NodeSelection } from '../../../src/pm/pm-guard';
import { indentCommand } from '../../../src/commands/builtins/structure/indent';
import {
    paragraphExtension,
    headingExtension,
    boldExtension,
    blockquoteExtension,
    calloutExtension,
    codeBlockExtension,
    horizontalRuleExtension,
    textAlignExtension,
    indentOutdentExtension,
    collapsibleExtension,
    taskListExtension,
    listExtension,
    tableExtension,
    imageExtension
} from '../../../src/extensions/builtins';
import {
    setTextAlignCommand as buildSetTextAlignCommand,
    unsetTextAlignCommand as buildUnsetTextAlignCommand,
    setHorizontalRuleCommand,
    setCodeBlockCommand,
    setParagraphCommand,
    setHeadingCommand,
    transformNodeCommand,
    inputRuleWrapCommand,
    collapseCommand,
    expandCommand,
    unwrapNodeCommand,
    wrapNodeCommand,
    duplicateNodeCommand,
    toggleBlockquoteCommand,
    toggleBlockStructureCommand,
    toggleCollapsibleCommand,
    outdentCommand
} from '../../../src/commands/builtins/structure/index';
import { NodeResolver } from '../../../src/commands/shared/node-resolver';
import { toggleCodeBlockCommand } from '../../../src/commands/builtins/structure/toggle-code-block';

const testExtensions = [
    paragraphExtension,
    headingExtension,
    boldExtension,
    blockquoteExtension,
    calloutExtension,
    codeBlockExtension,
    horizontalRuleExtension,
    textAlignExtension,
    indentOutdentExtension,
    collapsibleExtension,
    taskListExtension,
    listExtension,
    tableExtension,
    imageExtension
];

function buildParagraph(text: string = 'Sample text'): any {
    return {
        id: `para-${Math.random().toString(16).slice(2)}`,
        type: 'paragraph',
        attrs: {},
        marks: [],
        children: [
            {
                id: `text-${Math.random().toString(16).slice(2)}`,
                type: 'text',
                text,
                attrs: {},
                marks: [],
                children: []
            }
        ]
    };
}

function buildDocument(children: any[] = [buildParagraph()]): any {
    return {
        type: 'document',
        id: 'doc-structure-spec',
        schemaVersion: 1,
        attrs: {},
        marks: [],
        children
    };
}

function createTestEditor(doc: any = buildDocument()): { editor: HeadlessEditor; container: HTMLElement } {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const editor = HeadlessEditor.create({
        document: doc,
        extensions: testExtensions
    });
    editor.mount(container);

    return { editor, container };
}

function destroyTestEditor(test: { editor: HeadlessEditor; container: HTMLElement }): void {
    try {
        if (!test.editor.isDestroyed) {
            test.editor.destroy();
        }
    } catch {
        // already destroyed
    }

    if (test.container.parentNode) {
        test.container.parentNode.removeChild(test.container);
    }
}

function placeCursor(editor: HeadlessEditor, from: number = 1, to: number = 1): void {
    expect(editor.commands.setSelection({ from, to })).toBe(true);
}

function findFirstNode(editor: HeadlessEditor, typeName: string): any {
    let found: any = null;
    const walk = (node: any): boolean => {
        if (found) {
            return false;
        }
        if (node && node.type === typeName) {
            found = node;
            return false;
        }
        if (node && Array.isArray(node.children)) {
            for (const child of node.children) {
                if (walk(child) === false) {
                    return false;
                }
            }
        }
        return true;
    };

    editor.getDocument().children.forEach((node: any) => {
        if (!found) {
            walk(node);
        }
    });

    return found;
}

// Tests pin the command instances to the alignable-type set used by the
// extension's default. The default itself lives in text-align.ts; this
// list is duplicated here intentionally so the test stays self-documenting.
const ALIGNABLE_TYPES: readonly string[] = ['paragraph', 'heading'];
const setTextAlignCommand = buildSetTextAlignCommand(ALIGNABLE_TYPES);
const unsetTextAlignCommand = buildUnsetTextAlignCommand(ALIGNABLE_TYPES);

// ── toggleBlockStructure (internal) ──────────────────────────────────────────

describe('toggleBlockStructure via editor commands', () => {
    it('is available through the public editor command surface', () => {
        const { editor, container } = createTestEditor();
        placeCursor(editor);
        expect((editor.can() as any).toggleBlockQuote()).toBe(true);
        expect((editor.commands as any).toggleBlockQuote()).toBe(true);
        expect(findFirstNode(editor, 'blockquote')).not.toBeNull();
        destroyTestEditor({ editor, container });
    });

    it('should remove blockquote when toggleBlockQuote is executed inside a blockquote', () => {
        const doc = {
            id: 'doc-blockquote-toggle',
            type: 'document',
            schemaVersion: 1,
            attrs: {},
            marks: [],
            children: [
                {
                    id: 'blockquote-toggle',
                    type: 'blockquote',
                    attrs: {},
                    marks: [],
                    children: [
                        {
                            id: 'paragraph-toggle',
                            type: 'paragraph',
                            attrs: {},
                            marks: [],
                            children: [{
                                id: 'text-toggle',
                                type: 'text',
                                text: 'Quote',
                                attrs: {},
                                marks: [],
                                children: []
                            }]
                        }
                    ]
                }
            ]
        };

        const { editor, container } = createTestEditor(doc);

        placeCursor(editor, 2, 2);

        expect(editor.commands.toggleBlockQuote()).toBe(true);
        expect(findFirstNode(editor, 'blockquote')).toBeNull();

        destroyTestEditor({ editor, container });
    });

    it('should return false when base canExecute is undefined', () => {
        const original = toggleBlockStructureCommand.canExecute;

        try {
            (toggleBlockStructureCommand as any).canExecute = undefined;
            expect(toggleBlockquoteCommand.canExecute!({} as any)).toBe(false);
        } finally {
            (toggleBlockStructureCommand as any).canExecute = original;
        }
    });

    it('returns false and does not dispatch when the block type is unavailable', () => {
        const { editor, container } = createTestEditor();
        const pmState = (editor as any).integration.getState();
        const nodes = { ...pmState.schema.nodes };
        delete nodes.blockquote;
        const context = {
            pmState: { ...pmState, schema: { ...pmState.schema, nodes } },
            dispatch: jasmine.createSpy('dispatch')
        } as any;
        const payload = { blockType: 'blockquote' } as const;

        expect(toggleBlockStructureCommand.canExecute(context, payload)).toBe(false);
        toggleBlockStructureCommand.execute(context, payload);
        expect(context.dispatch).not.toHaveBeenCalled();

        destroyTestEditor({ editor, container });
    });

});

// ── duplicateNode ─────────────────────────────────────────────────────────────

describe('duplicateNode via editor commands', () => {
    it('returns false for unknown nodeId', () => {
        const { editor, container } = createTestEditor();
        expect((editor.can() as any).duplicateNode({ nodeId: 'ghost-id' })).toBe(false);
        expect((editor.commands as any).duplicateNode({ nodeId: 'ghost-id' })).toBe(false);
        destroyTestEditor({ editor, container });
    });

    it('does not duplicate the document root', () => {
        const { editor, container } = createTestEditor();
        const payload = { nodeId: 'doc-structure-spec' };

        expect((editor.can() as any).duplicateNode(payload)).toBe(false);
        expect((editor.commands as any).duplicateNode(payload)).toBe(false);

        destroyTestEditor({ editor, container });
    });

    it('duplicates a valid node and updates the document', () => {
        const { editor, container } = createTestEditor();
        const before = countNodesOfType((editor as any).integration, 'paragraph');
        const target = findFirstNode(editor, 'paragraph');
        expect(target).not.toBeNull();

        const result = (editor.commands as any).duplicateNode({ nodeId: target.id });
        expect(result).toBe(true);
        expect(countNodesOfType((editor as any).integration, 'paragraph')).toBe(before + 1);
        destroyTestEditor({ editor, container });
    });

    it('returns without dispatch for a document-root target', () => {
        const { editor, container } = createTestEditor();
        const context = {
            document: editor.getDocument(),
            pmState: (editor as any).integration.getState(),
            dispatch: jasmine.createSpy('dispatch')
        } as any;

        duplicateNodeCommand.execute(context, { nodeId: editor.getDocument().id });

        expect(context.dispatch).not.toHaveBeenCalled();
        destroyTestEditor({ editor, container });
    });

    it('returns without dispatch when the target is absent from the PM document', () => {
        const first = createTestEditor();
        const second = createTestEditor();
        const target = findFirstNode(first.editor, 'paragraph');
        const context = {
            document: first.editor.getDocument(),
            pmState: (second.editor as any).integration.getState(),
            dispatch: jasmine.createSpy('dispatch')
        } as any;

        duplicateNodeCommand.execute(context, { nodeId: target.id });

        expect(context.dispatch).not.toHaveBeenCalled();
        destroyTestEditor(first);
        destroyTestEditor(second);
    });

    it('returns without dispatch when the target has no parent', () => {
        const { editor, container } = createTestEditor();
        const target = findFirstNode(editor, 'paragraph');
        const context = {
            document: editor.getDocument(),
            pmState: (editor as any).integration.getState(),
            dispatch: jasmine.createSpy('dispatch')
        } as any;
        spyOn(NodeResolver, 'findParent').and.returnValue(undefined);

        duplicateNodeCommand.execute(context, { nodeId: target.id });

        expect(context.dispatch).not.toHaveBeenCalled();
        destroyTestEditor({ editor, container });
    });

    it('clones marked text with the duplicated node', () => {
        const markedParagraph = buildParagraph('Marked text');
        markedParagraph.children[0].marks = [{ type: 'bold', attrs: {} }];
        const { editor, container } = createTestEditor(buildDocument([markedParagraph]));

        expect((editor.commands as any).duplicateNode({ nodeId: markedParagraph.id })).toBe(true);

        const document = editor.getDocument();
        const original = document.children[0];
        const duplicate = document.children[1];
        expect(duplicate.id).not.toBe(original.id);
        expect(duplicate.children.length).toBe(1);
        expect((duplicate.children[0] as any).marks[0].type).toBe('bold');
        expect((duplicate.children[0] as any).marks[0].attrs).toEqual({});
        expect((duplicate.children[0] as any).id).not.toBe((original.children[0] as any).id);

        destroyTestEditor({ editor, container });
    });

    it('clones marks on the duplicated non-text node', () => {
        const markedParagraph = buildParagraph('Marked paragraph');
        markedParagraph.marks = [{ type: 'bold', attrs: {} }];
        const document = buildDocument([markedParagraph]);
        const { editor, container } = createTestEditor(document);
        const context = {
            document,
            pmState: (editor as any).integration.getState(),
            dispatch: jasmine.createSpy('dispatch')
        } as any;

        duplicateNodeCommand.execute(context, { nodeId: markedParagraph.id });

        expect(context.dispatch).toHaveBeenCalled();
        destroyTestEditor({ editor, container });
    });

    it('stops scanning PM descendants after locating the duplicate target', () => {
        const { editor, container } = createTestEditor();
        const target = findFirstNode(editor, 'paragraph');
        const pmState = (editor as any).integration.getState();
        const context = {
            document: editor.getDocument(),
            pmState,
            dispatch: jasmine.createSpy('dispatch')
        } as any;
        spyOn(pmState.doc, 'descendants').and.callFake((callback: any): void => {
            expect(callback({ attrs: { id: target.id }, nodeSize: 2 }, 4)).toBe(false);
            expect(callback({ attrs: undefined }, 5)).toBe(false);
        });

        duplicateNodeCommand.execute(context, { nodeId: target.id });

        expect(context.dispatch).toHaveBeenCalled();
        destroyTestEditor({ editor, container });
    });
});

// ── wrapNode ──────────────────────────────────────────────────────────────────

describe('wrapNode via editor commands', () => {
    it('wraps a node when the target node exists', () => {
        const { editor, container } = createTestEditor();
        const target = findFirstNode(editor, 'paragraph');
        const result = (editor.commands as any).wrapNode({ nodeId: target.id, wrapperType: 'blockquote' });

        expect(result).toBe(true);
        expect(findFirstNode(editor, 'blockquote')).not.toBeNull();

        destroyTestEditor({ editor, container });
    });

    it('returns false when the target node does not exist', () => {
        const { editor, container } = createTestEditor();
        const payload = { nodeId: 'missing-node', wrapperType: 'blockquote' };

        expect((editor.can() as any).wrapNode(payload)).toBe(false);
        expect((editor.commands as any).wrapNode(payload)).toBe(false);

        destroyTestEditor({ editor, container });
    });

    it('returns without dispatch when execute cannot find the target', () => {
        const { editor, container } = createTestEditor();
        const context = {
            document: editor.getDocument(),
            pmState: (editor as any).integration.getState(),
            dispatch: jasmine.createSpy('dispatch')
        } as any;

        wrapNodeCommand.execute(context, {
            nodeId: 'missing-node',
            wrapperType: 'blockquote'
        });

        expect(context.dispatch).not.toHaveBeenCalled();
        destroyTestEditor({ editor, container });
    });

    it('returns false when the wrapper type does not exist', () => {
        const { editor, container } = createTestEditor();
        const target = findFirstNode(editor, 'paragraph');

        expect((editor.can() as any).wrapNode({ nodeId: target.id, wrapperType: 'unknownWrapper' })).toBe(false);
        expect((editor.commands as any).wrapNode({ nodeId: target.id, wrapperType: 'unknownWrapper' })).toBe(false);

        destroyTestEditor({ editor, container });
    });

    it('returns false when attempting to wrap the document node', () => {
        const { editor, container } = createTestEditor();

        const documentNode = editor.getDocument();

        expect((editor.can() as any).wrapNode({ nodeId: documentNode.id, wrapperType: 'blockquote' })).toBe(false);
        expect((editor.commands as any).wrapNode({ nodeId: documentNode.id, wrapperType: 'blockquote' })).toBe(false);

        destroyTestEditor({ editor, container });
    });

    it('returns without dispatch when the target is absent from the PM document', () => {
        const first = createTestEditor();
        const second = createTestEditor();
        const target = findFirstNode(first.editor, 'paragraph');
        const context = {
            document: first.editor.getDocument(),
            pmState: (second.editor as any).integration.getState(),
            dispatch: jasmine.createSpy('dispatch')
        } as any;

        wrapNodeCommand.execute(context, {
            nodeId: target.id,
            wrapperType: 'blockquote'
        });

        expect(context.dispatch).not.toHaveBeenCalled();
        destroyTestEditor(first);
        destroyTestEditor(second);
    });

    it('returns without dispatch when the wrapper type is unavailable', () => {
        const { editor, container } = createTestEditor();
        const target = findFirstNode(editor, 'paragraph');
        const pmState = (editor as any).integration.getState();
        const context = {
            document: editor.getDocument(),
            pmState: {
                ...pmState,
                schema: { ...pmState.schema, nodes: {} }
            },
            dispatch: jasmine.createSpy('dispatch')
        } as any;

        wrapNodeCommand.execute(context, {
            nodeId: target.id,
            wrapperType: 'blockquote'
        });

        expect(context.dispatch).not.toHaveBeenCalled();
        destroyTestEditor({ editor, container });
    });

    it('returns without dispatch when the matched PM node cannot be read', () => {
        const { editor, container } = createTestEditor();
        const target = findFirstNode(editor, 'paragraph');
        const pmState = (editor as any).integration.getState();
        spyOn(pmState.doc, 'nodeAt').and.returnValue(null);
        const context = {
            document: editor.getDocument(),
            pmState,
            dispatch: jasmine.createSpy('dispatch')
        } as any;

        wrapNodeCommand.execute(context, {
            nodeId: target.id,
            wrapperType: 'blockquote'
        });

        expect(context.dispatch).not.toHaveBeenCalled();
        destroyTestEditor({ editor, container });
    });

    it('stops scanning descendants after locating the target', () => {
        const { editor, container } = createTestEditor();
        const target = findFirstNode(editor, 'paragraph');
        const pmState = (editor as any).integration.getState();
        let targetPos = -1;
        let targetPmNode: any;
        pmState.doc.descendants((node: any, pos: number) => {
            if (node.attrs && node.attrs.id === target.id) {
                targetPos = pos;
                targetPmNode = node;
                return false;
            }
            return true;
        });
        const context = {
            document: editor.getDocument(),
            pmState,
            dispatch: jasmine.createSpy('dispatch')
        } as any;
        spyOn(pmState.doc, 'descendants').and.callFake((callback: any): void => {
            expect(callback(targetPmNode, targetPos)).toBe(false);
            expect(callback({ attrs: undefined }, targetPos + 1)).toBe(false);
        });

        wrapNodeCommand.execute(context, {
            nodeId: target.id,
            wrapperType: 'blockquote'
        });

        expect(context.dispatch).toHaveBeenCalled();
        destroyTestEditor({ editor, container });
    });
});

// ── unwrapNode ────────────────────────────────────────────────────────────────

describe('unwrapNode via editor commands', () => {
    it('unwraps a wrapper node when it exists', () => {
        const { editor, container } = createTestEditor();
        const target = findFirstNode(editor, 'paragraph');
        const wrapResult = (editor.commands as any).wrapNode({ nodeId: target.id, wrapperType: 'blockquote' });
        expect(wrapResult).toBe(true);

        const wrapped = findFirstNode(editor, 'blockquote');
        expect(wrapped).not.toBeNull();
        const unwrapResult = (editor.commands as any).unwrapNode({ nodeId: wrapped.id });
        expect(unwrapResult).toBe(true);
        expect(findFirstNode(editor, 'blockquote')).toBeNull();
        destroyTestEditor({ editor, container });
    });

    it('returns false when the target node does not exist', () => {
        const { editor, container } = createTestEditor();
        const payload = { nodeId: 'missing-node' };

        expect((editor.can() as any).unwrapNode(payload)).toBe(false);
        expect((editor.commands as any).unwrapNode(payload)).toBe(false);

        destroyTestEditor({ editor, container });
    });

    it('deletes a leaf node when unwrapping a node with no children', () => {
        const horizontalRule = {
            id: 'horizontal-rule-to-delete',
            type: 'horizontalRule',
            attrs: {},
            marks: [],
            children: []
        };
        const { editor, container } = createTestEditor(buildDocument([horizontalRule]));

        expect((editor.can() as any).unwrapNode({ nodeId: horizontalRule.id })).toBe(true);
        expect((editor.commands as any).unwrapNode({ nodeId: horizontalRule.id })).toBe(true);
        expect(findFirstNode(editor, 'horizontalRule')).toBeNull();

        destroyTestEditor({ editor, container });
    });

    it('returns without dispatch when asked to unwrap the document root', () => {
        const { editor, container } = createTestEditor();
        const context = {
            document: editor.getDocument(),
            pmState: (editor as any).integration.getState(),
            dispatch: jasmine.createSpy('dispatch')
        } as any;

        unwrapNodeCommand.execute(context, { nodeId: editor.getDocument().id });

        expect(context.dispatch).not.toHaveBeenCalled();
        destroyTestEditor({ editor, container });
    });

    it('returns without dispatch when the target is absent from the PM document', () => {
        const first = createTestEditor();
        const second = createTestEditor();
        const target = findFirstNode(first.editor, 'paragraph');
        const context = {
            document: first.editor.getDocument(),
            pmState: (second.editor as any).integration.getState(),
            dispatch: jasmine.createSpy('dispatch')
        } as any;

        unwrapNodeCommand.execute(context, { nodeId: target.id });

        expect(context.dispatch).not.toHaveBeenCalled();
        destroyTestEditor(first);
        destroyTestEditor(second);
    });

    it('stops scanning after the target is found', () => {
        const { editor, container } = createTestEditor();
        const target = findFirstNode(editor, 'paragraph');
        const pmState = (editor as any).integration.getState();
        const originalDescendants = pmState.doc.descendants.bind(pmState.doc);
        spyOn(pmState.doc, 'descendants').and.callFake((callback: (node: any, pos: number) => boolean): void => {
            originalDescendants((node: any, pos: number): boolean => {
                const result = callback(node, pos);
                if (node.attrs?.id === target.id) {
                    callback(node, pos + node.nodeSize);
                }
                return result;
            });
        });
        const context = {
            document: editor.getDocument(),
            pmState,
            dispatch: jasmine.createSpy('dispatch')
        } as any;

        unwrapNodeCommand.execute(context, { nodeId: target.id });

        expect(context.dispatch).toHaveBeenCalled();
        destroyTestEditor({ editor, container });
    });
});

// ── transformNode ─────────────────────────────────────────────────────────────

describe('transformNode via editor commands', () => {
    it('currently throws because the command expects an unavailable integration reference', () => {
        const { editor, container } = createTestEditor();
        const target = findFirstNode(editor, 'paragraph');
        const payload = { nodeId: target.id, newType: 'heading' };

        expect(() => (editor.can() as any).transformNode(payload)).toThrowError(TypeError);
        expect(() => (editor.commands as any).transformNode(payload)).toThrowError(TypeError);
        destroyTestEditor({ editor, container });
    });

    it('transforms a paragraph when an integration reference is supplied', () => {
        const { editor, container } = createTestEditor();
        const target = findFirstNode(editor, 'paragraph');
        const dispatch = jasmine.createSpy('dispatch');
        const context = {
            document: editor.getDocument(),
            editor: { imRef: (editor as any).integration },
            dispatch
        } as any;
        const payload = {
            nodeId: target.id,
            newType: 'heading',
            newAttrs: { level: 2 }
        };

        expect(transformNodeCommand.canExecute(context, payload)).toBe(true);
        expect((transformNodeCommand as any).execute(context, payload)).toBe(true);
        expect(dispatch).toHaveBeenCalled();

        destroyTestEditor({ editor, container });
    });

    it('returns false for an unknown target or target type', () => {
        const { editor, container } = createTestEditor();
        const context = {
            document: editor.getDocument(),
            editor: { imRef: (editor as any).integration },
            dispatch: jasmine.createSpy('dispatch')
        } as any;

        expect(transformNodeCommand.canExecute(context, {
            nodeId: 'missing-node',
            newType: 'heading'
        })).toBe(false);
        expect((transformNodeCommand as any).execute(context, {
            nodeId: 'missing-node',
            newType: 'heading'
        })).toBe(false);

        const target = findFirstNode(editor, 'paragraph');
        expect(transformNodeCommand.canExecute(context, {
            nodeId: target.id,
            newType: 'missing-type'
        })).toBe(false);
        expect((transformNodeCommand as any).execute(context, {
            nodeId: target.id,
            newType: 'missing-type'
        })).toBe(false);

        destroyTestEditor({ editor, container });
    });

    it('uses empty attributes when newAttrs is omitted', () => {
        const { editor, container } = createTestEditor();
        const target = findFirstNode(editor, 'paragraph');
        const dispatch = jasmine.createSpy('dispatch');
        const context = {
            document: editor.getDocument(),
            editor: { imRef: (editor as any).integration },
            dispatch
        } as any;

        expect((transformNodeCommand as any).execute(context, {
            nodeId: target.id,
            newType: 'heading'
        })).toBe(true);
        expect(dispatch).toHaveBeenCalled();

        destroyTestEditor({ editor, container });
    });

    it('returns false when the target is absent from the PM document', () => {
        const first = createTestEditor();
        const second = createTestEditor();
        const target = findFirstNode(first.editor, 'paragraph');
        const context = {
            document: first.editor.getDocument(),
            editor: { imRef: (second.editor as any).integration },
            dispatch: jasmine.createSpy('dispatch')
        } as any;

        expect((transformNodeCommand as any).execute(context, {
            nodeId: target.id,
            newType: 'heading'
        })).toBe(false);

        destroyTestEditor(first);
        destroyTestEditor(second);
    });

    it('returns false when the matched PM node cannot be read', () => {
        const { editor, container } = createTestEditor();
        const target = findFirstNode(editor, 'paragraph');
        const pmState = (editor as any).integration.getState();
        const documentNode = {
            descendants: (callback: (node: any, pos: number) => boolean): void => {
                callback({ attrs: { id: target.id } }, 1);
            },
            nodeAt: (): null => null
        };
        const context = {
            document: editor.getDocument(),
            editor: {
                imRef: {
                    getState: (): any => ({
                        ...pmState,
                        schema: pmState.schema,
                        doc: documentNode
                    })
                }
            },
            dispatch: jasmine.createSpy('dispatch')
        } as any;

        expect((transformNodeCommand as any).execute(context, {
            nodeId: target.id,
            newType: 'heading'
        })).toBe(false);

        destroyTestEditor({ editor, container });
    });

    it('handles PM nodes without attributes and stops after finding the target', () => {
        const { editor, container } = createTestEditor();
        const target = findFirstNode(editor, 'paragraph');
        const pmState = (editor as any).integration.getState();
        const context = {
            document: editor.getDocument(),
            editor: { imRef: (editor as any).integration },
            dispatch: jasmine.createSpy('dispatch')
        } as any;
        const descriptors = [
            { attrs: null },
            { attrs: { id: target.id } },
            { attrs: { id: 'ignored-after-target' } }
        ];
        spyOn(pmState.doc, 'descendants').and.callFake((callback: (node: any, pos: number) => boolean): void => {
            descriptors.forEach((node, index) => callback(node, index));
        });

        expect((transformNodeCommand as any).execute(context, {
            nodeId: target.id,
            newType: 'heading'
        })).toBe(true);
        expect(context.dispatch).toHaveBeenCalled();

        destroyTestEditor({ editor, container });
    });
});

// ── inputRuleTransform ───────────────────────────────────────────────────────

describe('inputRuleTransform via editor commands', () => {
    it('is exposed through the editor facade and accepts a registered node type', () => {
        const { editor, container } = createTestEditor();
        const payload = { nodeType: 'heading', attrs: { level: 2 }, matchStart: 0, matchEnd: 0 };

        expect((editor.can() as any).inputRuleTransform(payload)).toBe(true);
        expect((editor.commands as any).inputRuleTransform(payload)).toBe(true);
        expect(findFirstNode(editor, 'heading')).not.toBeNull();

        destroyTestEditor({ editor, container });
    });
});

// ── inputRuleInsert ──────────────────────────────────────────────────────────

describe('inputRuleInsert via editor commands', () => {
    it('inserts a heading for a non-code-block input rule', () => {
        const { editor, container } = createTestEditor();
        const payload = {
            nodeType: 'heading',
            attrs: { level: 2 },
            matchStart: 0,
            matchEnd: 0
        };

        expect((editor.can() as any).inputRuleInsert(payload)).toBe(true);
        expect((editor.commands as any).inputRuleInsert(payload)).toBe(true);

        const heading = findFirstNode(editor, 'heading');
        expect(heading).not.toBeNull();
        expect(heading.attrs.level).toBe(2);

        destroyTestEditor({ editor, container });
    });
});

// ── inputRuleWrap ────────────────────────────────────────────────────────────

describe('inputRuleWrap via editor commands', () => {
    it('wraps the current paragraph in a blockquote', () => {
        const { editor, container } = createTestEditor();
        const pmState = (editor as any).integration.getState();
        const dispatch = jasmine.createSpy('dispatch');
        const payload = {
            nodeType: 'blockquote',
            matchStart: 1,
            matchEnd: 1
        };
        const context = { pmState, dispatch } as any;

        expect(inputRuleWrapCommand.canExecute(context, payload)).toBe(true);
        inputRuleWrapCommand.execute(context, payload);
        expect(dispatch).toHaveBeenCalled();

        destroyTestEditor({ editor, container });
    });

    it('returns without dispatch when the target node type is unavailable', () => {
        const { editor, container } = createTestEditor();
        const pmState = (editor as any).integration.getState();
        const dispatch = jasmine.createSpy('dispatch');
        const context = {
            pmState: { ...pmState, schema: { ...pmState.schema, nodes: {} } },
            dispatch
        } as any;

        inputRuleWrapCommand.execute(context, {
            nodeType: 'missing-node',
            matchStart: 0,
            matchEnd: 0
        });

        expect(dispatch).not.toHaveBeenCalled();
        destroyTestEditor({ editor, container });
    });

    it('returns without dispatch when the target node cannot wrap the block', () => {
        const { editor, container } = createTestEditor();
        const dispatch = jasmine.createSpy('dispatch');
        const context = {
            pmState: (editor as any).integration.getState(),
            dispatch
        } as any;

        inputRuleWrapCommand.execute(context, {
            nodeType: 'paragraph',
            matchStart: 0,
            matchEnd: 0
        });

        expect(dispatch).not.toHaveBeenCalled();
        destroyTestEditor({ editor, container });
    });

    it('returns without dispatch when findWrapping returns no wrapper', () => {
        const { editor, container } = createTestEditor();
        const dispatch = jasmine.createSpy('dispatch');
        const context = {
            pmState: (editor as any).integration.getState(),
            dispatch
        } as any;

        inputRuleWrapCommand.execute(context, {
            nodeType: 'image',
            matchStart: 1,
            matchEnd: 1
        });

        expect(dispatch).not.toHaveBeenCalled();
        destroyTestEditor({ editor, container });
    });

    it('marks generated task items as checked when the input rule is checked', () => {
        const { editor, container } = createTestEditor();
        const dispatch = jasmine.createSpy('dispatch');
        const context = {
            pmState: (editor as any).integration.getState(),
            dispatch
        } as any;
        const payload = {
            nodeType: 'taskList',
            attrs: { checked: true },
            matchStart: 1,
            matchEnd: 1
        };

        expect(inputRuleWrapCommand.canExecute(context, payload)).toBe(true);
        inputRuleWrapCommand.execute(context, payload);

        expect(dispatch).toHaveBeenCalled();
        destroyTestEditor({ editor, container });
    });

    it('wraps a task list without marking items when checked is false', () => {
        const { editor, container } = createTestEditor();
        const dispatch = jasmine.createSpy('dispatch');
        const context = {
            pmState: (editor as any).integration.getState(),
            dispatch
        } as any;

        inputRuleWrapCommand.execute(context, {
            nodeType: 'taskList',
            attrs: { checked: false },
            matchStart: 1,
            matchEnd: 1
        });

        expect(dispatch).toHaveBeenCalled();
        destroyTestEditor({ editor, container });
    });

    it('wraps a task list without checking items when attrs are omitted', () => {
        const { editor, container } = createTestEditor();
        const dispatch = jasmine.createSpy('dispatch');
        const context = {
            pmState: (editor as any).integration.getState(),
            dispatch
        } as any;

        inputRuleWrapCommand.execute(context, {
            nodeType: 'taskList',
            matchStart: 1,
            matchEnd: 1
        });

        expect(dispatch).toHaveBeenCalled();
        destroyTestEditor({ editor, container });
    });

    it('wraps a task list when attributes are omitted', () => {
        const { editor, container } = createTestEditor();
        const dispatch = jasmine.createSpy('dispatch');
        const context = {
            pmState: (editor as any).integration.getState(),
            dispatch
        } as any;

        inputRuleWrapCommand.execute(context, {
            nodeType: 'taskList',
            matchStart: 1,
            matchEnd: 1
        });

        expect(dispatch).toHaveBeenCalled();
        destroyTestEditor({ editor, container });
    });

    it('joins the new wrapper with an adjacent wrapper of the same type', () => {
        const firstBlockquote = {
            id: 'input-rule-first-quote',
            type: 'blockquote',
            attrs: {},
            marks: [],
            children: [buildParagraph('First')]
        };
        const secondParagraph = buildParagraph('Second');
        const { editor, container } = createTestEditor(
            buildDocument([firstBlockquote, secondParagraph])
        );
        const pmState = (editor as any).integration.getState();
        let secondParagraphPos = -1;
        pmState.doc.descendants((node: any, pos: number) => {
            if (node.attrs?.id === secondParagraph.id) {
                secondParagraphPos = pos;
                return false;
            }
            return true;
        });
        const context = {
            pmState,
            dispatch: jasmine.createSpy('dispatch')
        } as any;

        inputRuleWrapCommand.execute(context, {
            nodeType: 'blockquote',
            matchStart: secondParagraphPos + 1,
            matchEnd: secondParagraphPos + 1
        });

        expect(context.dispatch).toHaveBeenCalled();
        destroyTestEditor({ editor, container });
    });
});

// ── collapse ──────────────────────────────────────────────────────────────────

describe('collapse command', () => {
    it('returns false and does not dispatch for an explicit non-collapsible position', () => {
        const { editor, container } = createTestEditor();
        const context = {
            pmState: (editor as any).integration.getState(),
            dispatch: jasmine.createSpy('dispatch')
        } as any;

        expect(collapseCommand.canExecute(context, { pos: 1 })).toBe(false);
        collapseCommand.execute(context, { pos: 1 });
        expect(context.dispatch).not.toHaveBeenCalled();

        destroyTestEditor({ editor, container });
    });

    it('collapses a collapsible through the public editor command surface', () => {
        const collapsible = {
            id: 'collapsible-for-collapse-command',
            type: 'collapsible',
            attrs: { collapsed: false },
            marks: [],
            children: [
                {
                    id: 'collapsible-header-for-collapse-command',
                    type: 'collapsibleHeader',
                    attrs: {},
                    marks: [],
                    children: [buildParagraph('Header')]
                },
                {
                    id: 'collapsible-body-for-collapse-command',
                    type: 'collapsibleBody',
                    attrs: {},
                    marks: [],
                    children: [buildParagraph('Body')]
                }
            ]
        };
        const { editor, container } = createTestEditor(buildDocument([collapsible]));

        const target = findFirstNode(editor, 'collapsible');
        expect(target).not.toBeNull();

        let collapsiblePos = -1;
        (editor as any).integration.getState().doc.descendants((node: any, pos: number) => {
            if (node.type.name === 'collapsible') {
                collapsiblePos = pos;
                return false;
            }
            return true;
        });

        expect(collapsiblePos).toBeGreaterThanOrEqual(0);
        const collapsibleContentPos = collapsiblePos + 1;
        expect((editor.can() as any).collapse({ pos: collapsibleContentPos })).toBe(true);
        expect((editor.commands as any).collapse({ pos: collapsibleContentPos })).toBe(true);
        expect(findFirstNode(editor, 'collapsible').attrs.collapsed).toBe(true);

        destroyTestEditor({ editor, container });
    });

    it('returns without dispatch when the collapsible node cannot be read', () => {
        const context = {
            pmState: {
                doc: {
                    resolve: (): any => ({
                        depth: 0,
                        node: (): any => ({ type: { name: 'collapsible' } }),
                        before: (): number => 1
                    }),
                    nodeAt: (): null => null
                }
            },
            dispatch: jasmine.createSpy('dispatch')
        } as any;

        collapseCommand.execute(context, { pos: 1 });

        expect(context.dispatch).not.toHaveBeenCalled();
    });
});

// ── expand ────────────────────────────────────────────────────────────────────

describe('expand command', () => {
    it('expands a collapsed collapsible through the public editor command surface', () => {
        const collapsible = {
            id: 'collapsible-for-expand-command',
            type: 'collapsible',
            attrs: { collapsed: true },
            marks: [],
            children: [
                {
                    id: 'collapsible-header-for-expand-command',
                    type: 'collapsibleHeader',
                    attrs: {},
                    marks: [],
                    children: [buildParagraph('Header')]
                },
                {
                    id: 'collapsible-body-for-expand-command',
                    type: 'collapsibleBody',
                    attrs: {},
                    marks: [],
                    children: [buildParagraph('Body')]
                }
            ]
        };
        const { editor, container } = createTestEditor(buildDocument([collapsible]));
        const pmState = (editor as any).integration.getState();
        let collapsiblePos = -1;
        pmState.doc.descendants((node: any, pos: number) => {
            if (node.type.name === 'collapsible') {
                collapsiblePos = pos;
                return false;
            }
            return true;
        });
        const positionInsideCollapsible = collapsiblePos + 1;

        expect((editor.can() as any).expand({ pos: positionInsideCollapsible })).toBe(true);
        expect((editor.commands as any).expand({ pos: positionInsideCollapsible })).toBe(true);
        expect(findFirstNode(editor, 'collapsible').attrs.collapsed).toBe(false);

        destroyTestEditor({ editor, container });
    });

    it('returns false and does not dispatch for a non-collapsible explicit position', () => {
        const { editor, container } = createTestEditor();
        const context = {
            pmState: (editor as any).integration.getState(),
            dispatch: jasmine.createSpy('dispatch')
        } as any;

        expect(expandCommand.canExecute(context, { pos: 1 })).toBe(false);
        expandCommand.execute(context, { pos: 1 });
        expect(context.dispatch).not.toHaveBeenCalled();

        destroyTestEditor({ editor, container });
    });

    it('returns without dispatch when the collapsible node cannot be read', () => {
        const context = {
            pmState: {
                doc: {
                    resolve: (): any => ({
                        depth: 0,
                        node: (): any => ({ type: { name: 'collapsible' } }),
                        before: (): number => 1
                    }),
                    nodeAt: (): null => null
                }
            },
            dispatch: jasmine.createSpy('dispatch')
        } as any;

        expandCommand.execute(context, { pos: 1 });
        expect(context.dispatch).not.toHaveBeenCalled();
    });
});

// ── splitBlock ────────────────────────────────────────────────────────────────

describe('splitBlock via editor commands', () => {
    it('splits the current paragraph at the cursor position', () => {
        const { editor, container } = createTestEditor(
            buildDocument([buildParagraph('Sample text')])
        );

        // Place the cursor after "Sample".
        placeCursor(editor, 7, 7);

        expect((editor.can() as any).splitBlock()).toBe(true);
        expect((editor.commands as any).splitBlock()).toBe(true);

        const document = editor.getDocument();
        expect(document.children.length).toBe(2);
        expect(document.children[0].type).toBe('paragraph');
        expect(document.children[1].type).toBe('paragraph');
        expect((document.children[0].children[0] as any).text).toBe('Sample');
        expect((document.children[1].children[0] as any).text).toBe(' text');

        destroyTestEditor({ editor, container });
    });
});

// ── indent ────────────────────────────────────────────────────────────────────

describe('indent via editor commands', () => {
    it('increments the current paragraph indent', () => {
        const { editor, container } = createTestEditor();
        placeCursor(editor);

        expect((editor.can() as any).indent()).toBe(true);
        expect((editor.commands as any).indent()).toBe(true);

        const paragraph = findFirstNode(editor, 'paragraph');
        expect(paragraph.attrs.indent).toBe(1);

        destroyTestEditor({ editor, container });
    });

    it('increments an existing paragraph indent by one level', () => {
        const paragraph = buildParagraph();
        paragraph.attrs.indent = 2;

        const { editor, container } = createTestEditor(
            buildDocument([paragraph])
        );
        placeCursor(editor);

        expect((editor.commands as any).indent()).toBe(true);
        expect(findFirstNode(editor, 'paragraph').attrs.indent).toBe(3);

        destroyTestEditor({ editor, container });
    });

    it('increments the indent of a heading block', () => {
        const heading = {
            id: 'heading-indent-test',
            type: 'heading',
            attrs: { level: 2 },
            marks: [],
            children: [{
                id: 'heading-indent-text-test',
                type: 'text',
                text: 'Heading',
                attrs: {},
                marks: [],
                children: []
            }]
        };

        const { editor, container } = createTestEditor(
            buildDocument([heading])
        );
        placeCursor(editor);

        expect((editor.can() as any).indent()).toBe(true);
        expect((editor.commands as any).indent()).toBe(true);
        expect(findFirstNode(editor, 'heading').attrs.indent).toBe(1);

        destroyTestEditor({ editor, container });
    });

    it('delegates list-item indentation and skips its plain block child', () => {
        const list = {
            id: 'indent-list',
            type: 'bulletList',
            attrs: {},
            marks: [],
            children: [
                {
                    id: 'indent-list-item-one',
                    type: 'listItem',
                    attrs: {},
                    marks: [],
                    children: [buildParagraph('First')]
                },
                {
                    id: 'indent-list-item-two',
                    type: 'listItem',
                    attrs: {},
                    marks: [],
                    children: [buildParagraph('Second')]
                }
            ]
        };
        const { editor, container } = createTestEditor(buildDocument([list]));
        const pmState = (editor as any).integration.getState();
        let secondParagraphPos = -1;
        pmState.doc.descendants((node: any, pos: number) => {
            if (node.attrs?.id === list.children[1].children[0].id) {
                secondParagraphPos = pos;
                return false;
            }
            return true;
        });
        expect(secondParagraphPos).toBeGreaterThanOrEqual(0);
        placeCursor(editor, secondParagraphPos + 1, secondParagraphPos + 1);

        expect((editor.can() as any).indent()).toBe(true);
        expect((editor.commands as any).indent()).toBe(true);

        destroyTestEditor({ editor, container });
    });

    it('does not dispatch when the selected node has no indent handler', () => {
        const horizontalRule = {
            id: 'indent-unsupported-node',
            type: 'horizontalRule',
            attrs: {},
            marks: [],
            children: []
        };
        const { editor, container } = createTestEditor(buildDocument([horizontalRule]));
        const pmState = (editor as any).integration.getState();
        let horizontalRulePos = -1;
        pmState.doc.descendants((node: any, pos: number) => {
            if (node.type.name === 'horizontalRule') {
                horizontalRulePos = pos;
                return false;
            }
            return true;
        });
        const dispatch = jasmine.createSpy('dispatch');
        const context = {
            pmState: {
                ...pmState,
                tr: pmState.tr,
                selection: NodeSelection.create(pmState.doc, horizontalRulePos)
            },
            dispatch
        } as any;

        indentCommand.execute(context);

        expect(dispatch).not.toHaveBeenCalled();
        destroyTestEditor({ editor, container });
    });

    it('indents the containing block for an inline image inside a paragraph', () => {
        const transaction = {
            docChanged: false,
            setNodeMarkup: jasmine.createSpy('setNodeMarkup').and.callFake(() => transaction)
        };
        const imageNode = { attrs: { inline: true }, type: { name: 'image', isInline: true } };
        const paragraphNode = { attrs: {}, type: { name: 'paragraph' } };
        const context = {
            pmState: {
                selection: { from: 1, to: 2 },
                schema: {},
                tr: transaction,
                doc: {
                    nodesBetween: (from: number, to: number, callback: any): void => callback(imageNode, 1),
                    resolve: (): any => ({
                        depth: 1,
                        node: (depth: number): any => depth === 1
                            ? paragraphNode
                            : { type: { name: 'doc' } },
                        start: (): number => 1
                    }),
                    nodeAt: jasmine.createSpy('nodeAt').and.returnValue(paragraphNode)
                }
            },
            dispatch: jasmine.createSpy('dispatch')
        } as any;

        indentCommand.execute(context);

        expect(transaction.setNodeMarkup).toHaveBeenCalledWith(1, undefined, { indent: 1 });
    });

    it('returns unchanged when a table cell has no first child node', () => {
        const transaction = {
            docChanged: false
        };
        const tableCell = {
            type: { name: 'tableCell' },
            attrs: {},
            childCount: 1,
            firstChild: undefined
        };
        const context = {
            pmState: {
                selection: { from: 1, to: 1 },
                schema: {},
                tr: transaction,
                doc: {
                    nodesBetween: (from: number, to: number, callback: any): void => callback(tableCell, 1)
                }
            },
            dispatch: jasmine.createSpy('dispatch')
        } as any;

        indentCommand.execute(context);

        expect(context.dispatch).not.toHaveBeenCalled();
    });

    it('indents an inline image itself when no block ancestor is found', () => {
        const transaction = {
            docChanged: false,
            setNodeMarkup: jasmine.createSpy('setNodeMarkup').and.callFake(() => transaction)
        };
        const imageNode = { attrs: { inline: true }, type: { name: 'image', isInline: true } };
        const context = {
            pmState: {
                selection: { from: 1, to: 2 },
                schema: {},
                tr: transaction,
                doc: {
                    nodesBetween: (from: number, to: number, callback: any): void => callback(imageNode, 1),
                    resolve: (): any => ({
                        depth: 0,
                        node: (): any => imageNode,
                        start: (): number => 1
                    })
                }
            },
            dispatch: jasmine.createSpy('dispatch')
        } as any;

        indentCommand.execute(context);

        expect(transaction.setNodeMarkup).toHaveBeenCalledWith(1, undefined, { inline: true, indent: 1 });
        expect(context.dispatch).not.toHaveBeenCalled();
    });

    it('does not change the transaction when an inline image ancestor cannot be read', () => {
        const transaction = {
            docChanged: false,
            setNodeMarkup: jasmine.createSpy('setNodeMarkup')
        };
        const imageNode = { attrs: { inline: true }, type: { name: 'image', isInline: true } };
        const context = {
            pmState: {
                selection: { from: 1, to: 2 },
                schema: {},
                tr: transaction,
                doc: {
                    nodesBetween: (from: number, to: number, callback: any): void => callback(imageNode, 1),
                    resolve: (): any => ({
                        depth: 0,
                        node: (): any => ({ type: { name: 'paragraph' }, isInline: false }),
                        start: (): number => 3
                    }),
                    nodeAt: jasmine.createSpy('nodeAt').and.returnValue(null)
                }
            },
            dispatch: jasmine.createSpy('dispatch')
        } as any;

        indentCommand.execute(context);

        expect(transaction.setNodeMarkup).not.toHaveBeenCalled();
        expect(context.dispatch).not.toHaveBeenCalled();
    });

    it('returns without changing the transaction when a table cell is empty', () => {
        const tableCell = {
            id: 'empty-table-cell',
            type: 'tableCell',
            attrs: {},
            marks: [],
            children: []
        };

        const { editor, container } = createTestEditor(
            buildDocument([tableCell])
        );

        const pmState = (editor as any).integration.getState();
        let cellPos = -1;
        pmState.doc.descendants((node: any, pos: number) => {
            if (node.type.name === 'tableCell') {
                cellPos = pos;
                return false;
            }
            return true;
        });
        expect(cellPos).toBeGreaterThanOrEqual(0);
        const validCellPos = Math.max(cellPos + 1, 1);
        placeCursor(editor, validCellPos, validCellPos);

        expect((editor.commands as any).indent()).toBe(false);

        destroyTestEditor({ editor, container });
    });

    it('returns without changing the transaction when the table cell has no paragraph as its first child', () => {
        const tableCell = {
            id: 'table-cell-non-paragraph',
            type: 'tableCell',
            attrs: {},
            marks: [],
            children: [{
                id: 'table-cell-heading',
                type: 'heading',
                attrs: { level: 2 },
                marks: [],
                children: [{
                    id: 'table-cell-heading-text',
                    type: 'text',
                    text: 'Heading',
                    attrs: {},
                    marks: [],
                    children: []
                }]
            }]
        };

        const { editor, container } = createTestEditor(
            buildDocument([tableCell])
        );

        const pmState = (editor as any).integration.getState();
        let cellPos = -1;
        pmState.doc.descendants((node: any, pos: number) => {
            if (node.type.name === 'tableCell') {
                cellPos = pos;
                return false;
            }
            return true;
        });
        expect(cellPos).toBeGreaterThanOrEqual(0);
        const validCellPos = Math.max(cellPos + 1, 1);
        placeCursor(editor, validCellPos, validCellPos);

        expect((editor.commands as any).indent()).toBe(false);

        destroyTestEditor({ editor, container });
    });

    it('increments the paragraph inside a table cell', () => {
        const tableCell = {
            id: 'table-cell-paragraph',
            type: 'tableCell',
            attrs: {},
            marks: [],
            children: [
                buildParagraph()
            ]
        };

        const { editor, container } = createTestEditor(
            buildDocument([tableCell])
        );

        placeCursor(editor);

        expect((editor.commands as any).indent()).toBe(true);
        expect((editor.commands as any).indent()).toBe(true);

        destroyTestEditor({ editor, container });
    });

    it('handles an inline image when indenting', () => {
        const image = {
            id: 'inline-image-indent',
            type: 'image',
            attrs: {
                inline: true,
                src: 'https://example.com/image.png',
                alt: 'inline image',
                display: 'inline'
            },
            marks: [],
            children: []
        };

        const { editor, container } = createTestEditor(
            buildDocument([image])
        );

        const pmState = (editor as any).integration.getState();
        let imagePos = -1;
        pmState.doc.descendants((node: any, pos: number) => {
            if (node.type.name === 'image') {
                imagePos = pos;
                return false;
            }
            return true;
        });
        expect(imagePos).toBeGreaterThanOrEqual(0);
        (editor as any).integration.dispatch(
            (editor as any).integration.getState().tr.setSelection(
                NodeSelection.create((editor as any).integration.getState().doc, imagePos)
            )
        );

        expect((editor.commands as any).indent()).toBe(true);

        destroyTestEditor({ editor, container });
    });

    it('handles a non-inline image when indenting', () => {
        const image = {
            id: 'block-image-indent',
            type: 'image',
            attrs: {
                inline: false,
                src: 'https://example.com/image.png',
                alt: 'block image',
                display: 'block'
            },
            marks: [],
            children: []
        };

        const { editor, container } = createTestEditor(
            buildDocument([image])
        );

        const pmState = (editor as any).integration.getState();
        let imagePos = -1;
        pmState.doc.descendants((node: any, pos: number) => {
            if (node.type.name === 'image') {
                imagePos = pos;
                return false;
            }
            return true;
        });
        expect(imagePos).toBeGreaterThanOrEqual(0);
        (editor as any).integration.dispatch(
            (editor as any).integration.getState().tr.setSelection(
                NodeSelection.create((editor as any).integration.getState().doc, imagePos)
            )
        );

        expect((editor.commands as any).indent()).toBe(true);

        destroyTestEditor({ editor, container });
    });
});

// ── outdent ───────────────────────────────────────────────────────────────────

describe('outdent via editor commands', () => {
    it('decrements the current paragraph indent to zero', () => {
        const paragraph = buildParagraph();
        paragraph.attrs.indent = 1;
        const { editor, container } = createTestEditor(buildDocument([paragraph]));
        placeCursor(editor);

        expect((editor.can() as any).outdent()).toBe(true);
        expect((editor.commands as any).outdent()).toBe(true);

        const updatedParagraph = findFirstNode(editor, 'paragraph');
        expect(updatedParagraph.attrs.indent).toBe(0);

        destroyTestEditor({ editor, container });
    });

    it('is unavailable when the current paragraph is already at root indent', () => {
        const { editor, container } = createTestEditor();
        placeCursor(editor);

        expect((editor.can() as any).outdent()).toBe(false);
        expect(findFirstNode(editor, 'paragraph').attrs.indent).toBe(0);

        destroyTestEditor({ editor, container });
    });

    it('outdents the paragraph inside a table cell', () => {
        const paragraph = buildParagraph();
        paragraph.attrs.indent = 2;
        const tableCell = {
            id: 'outdent-table-cell',
            type: 'tableCell',
            attrs: {},
            marks: [],
            children: [paragraph]
        };
        const { editor, container } = createTestEditor(buildDocument([tableCell]));
        placeCursor(editor, 2, 2);

        expect((editor.can() as any).outdent()).toBe(true);
        expect((editor.commands as any).outdent()).toBe(true);
        expect(findFirstNode(editor, 'paragraph').attrs.indent).toBe(1);

        destroyTestEditor({ editor, container });
    });

    it('outdents a block image through editor commands', () => {
        const image = {
            id: 'outdent-block-image',
            type: 'image',
            attrs: {
                inline: false,
                indent: 2,
                src: 'https://example.com/image.png',
                alt: 'block image',
                display: 'block'
            },
            marks: [],
            children: []
        };
        const { editor, container } = createTestEditor(buildDocument([image]));
        const pmState = (editor as any).integration.getState();
        let imagePos = -1;
        pmState.doc.descendants((node: any, pos: number) => {
            if (node.type.name === 'image') {
                imagePos = pos;
                return false;
            }
            return true;
        });
        (editor as any).integration.dispatch(
            pmState.tr.setSelection(NodeSelection.create(pmState.doc, imagePos))
        );

        expect((editor.can() as any).outdent()).toBe(true);
        expect((editor.commands as any).outdent()).toBe(true);
        expect(findFirstNode(editor, 'image').attrs.indent).toBe(1);

        destroyTestEditor({ editor, container });
    });

    it('outdents the containing block for an inline image', () => {
        const transaction = {
            docChanged: false,
            setNodeMarkup: jasmine.createSpy('setNodeMarkup').and.callFake(() => transaction)
        };
        const imageNode = { attrs: { inline: true }, type: { name: 'image', isInline: true } };
        const paragraphNode = { attrs: { indent: 2 }, type: { name: 'paragraph' } };
        const context = {
            pmState: {
                selection: { from: 1, to: 2 },
                schema: {},
                tr: transaction,
                doc: {
                    nodesBetween: (from: number, to: number, callback: any): void => callback(imageNode, 1),
                    resolve: (): any => ({
                        depth: 1,
                        node: (depth: number): any => depth === 1
                            ? paragraphNode
                            : { type: { name: 'doc' } },
                        start: (): number => 1
                    }),
                    nodeAt: jasmine.createSpy('nodeAt').and.returnValue(paragraphNode)
                }
            },
            dispatch: jasmine.createSpy('dispatch')
        } as any;

        outdentCommand.execute(context);

        expect(transaction.setNodeMarkup).toHaveBeenCalledWith(1, undefined, { indent: 1 });
    });

    it('leaves the transaction unchanged when a table cell has no first child', () => {
        const transaction = { docChanged: false };
        const tableCell = {
            type: { name: 'tableCell' },
            attrs: {},
            childCount: 1,
            firstChild: undefined
        };
        const context = {
            pmState: {
                selection: { from: 1, to: 1 },
                schema: {},
                tr: transaction,
                doc: {
                    nodesBetween: (from: number, to: number, callback: any): void => callback(tableCell, 1)
                }
            },
            dispatch: jasmine.createSpy('dispatch')
        } as any;

        outdentCommand.execute(context);

        expect(context.dispatch).not.toHaveBeenCalled();
    });

    it('leaves the transaction unchanged when an inline image ancestor is missing', () => {
        const transaction = { docChanged: false };
        const imageNode = { attrs: { inline: true, indent: 1 }, type: { name: 'image', isInline: true } };
        const context = {
            pmState: {
                selection: { from: 1, to: 2 },
                schema: {},
                tr: transaction,
                doc: {
                    nodesBetween: (from: number, to: number, callback: any): void => callback(imageNode, 1),
                    resolve: (): any => ({
                        depth: 0,
                        node: (): any => ({ type: { name: 'paragraph' }, isInline: false }),
                        start: (): number => 3
                    }),
                    nodeAt: jasmine.createSpy('nodeAt').and.returnValue(null)
                }
            },
            dispatch: jasmine.createSpy('dispatch')
        } as any;

        outdentCommand.execute(context);

        expect(context.dispatch).not.toHaveBeenCalled();
    });

    it('falls back to outdenting the inline image when every ancestor is inline', () => {
        const transaction = {
            docChanged: false,
            setNodeMarkup: jasmine.createSpy('setNodeMarkup').and.callFake(() => transaction)
        };
        const imageNode = { attrs: { inline: true, indent: 1 }, type: { name: 'image', isInline: true } };
        const context = {
            pmState: {
                selection: { from: 1, to: 2 },
                schema: {},
                tr: transaction,
                doc: {
                    nodesBetween: (from: number, to: number, callback: any): void => callback(imageNode, 1),
                    resolve: (): any => ({
                        depth: 0,
                        node: (): any => imageNode
                    })
                }
            },
            dispatch: jasmine.createSpy('dispatch')
        } as any;

        outdentCommand.execute(context);

        expect(transaction.setNodeMarkup).toHaveBeenCalledWith(1, undefined, { inline: true, indent: 0 });
    });

    it('leaves the transaction unchanged for empty or non-paragraph table cells', () => {
        for (const tableCell of [
            { type: { name: 'tableCell' }, childCount: 0, firstChild: undefined },
            { type: { name: 'tableCell' }, childCount: 1, firstChild: { type: { name: 'heading' } } }
        ]) {
            const context = {
                pmState: {
                    selection: { from: 1, to: 1 },
                    schema: {},
                    tr: { docChanged: false },
                    doc: {
                        nodesBetween: (from: number, to: number, callback: any): void => callback(tableCell, 1)
                    }
                },
                dispatch: jasmine.createSpy('dispatch')
            } as any;

            outdentCommand.execute(context);

            expect(context.dispatch).not.toHaveBeenCalled();
        }
    });
});

// ── setHeading ────────────────────────────────────────────────────────────────

describe('setHeading via editor commands', () => {
    it('canExecute returns true for level 1', () => {
        const { editor, container } = createTestEditor();
        placeCursor(editor);
        expect(editor.can().setHeading({ level: 1 })).toBe(true);
        destroyTestEditor({ editor, container });
    });

    it('changes the current block to heading level 2', () => {
        const { editor, container } = createTestEditor();
        placeCursor(editor);
        expect(editor.commands.setHeading({ level: 2 })).toBe(true);
        expect(findFirstNode(editor, 'heading')).not.toBeNull();
        destroyTestEditor({ editor, container });
    });

    it('returns false and does not dispatch when heading is unavailable', () => {
        const { editor, container } = createTestEditor();
        const pmState = (editor as any).integration.getState();
        const nodes = { ...pmState.schema.nodes };
        delete nodes.heading;
        const context = {
            pmState: { ...pmState, schema: { ...pmState.schema, nodes } },
            dispatch: jasmine.createSpy('dispatch')
        } as any;

        expect(setHeadingCommand.canExecute(context, { level: 2 })).toBe(false);
        setHeadingCommand.execute(context, { level: 2 });
        expect(context.dispatch).not.toHaveBeenCalled();

        destroyTestEditor({ editor, container });
    });
});

// ── setParagraph ──────────────────────────────────────────────────────────────

describe('setParagraph via editor commands', () => {
    it('converts a heading back to a paragraph', () => {
        const { editor, container } = createTestEditor();
        placeCursor(editor);
        expect(editor.commands.setHeading({ level: 1 })).toBe(true);
        expect(editor.commands.setParagraph()).toBe(true);
        expect(findFirstNode(editor, 'paragraph')).not.toBeNull();
        destroyTestEditor({ editor, container });
    });

    it('returns false and does not dispatch when paragraph is unavailable', () => {
        const { editor, container } = createTestEditor();
        const pmState = (editor as any).integration.getState();
        const nodes = { ...pmState.schema.nodes };
        delete nodes.paragraph;
        const context = {
            pmState: { ...pmState, schema: { ...pmState.schema, nodes } },
            dispatch: jasmine.createSpy('dispatch')
        } as any;

        expect(setParagraphCommand.canExecute(context)).toBe(false);
        setParagraphCommand.execute(context);
        expect(context.dispatch).not.toHaveBeenCalled();

        destroyTestEditor({ editor, container });
    });
});

// ── toggleBlockQuote ─────────────────────────────────────────────────────────────

describe('toggleBlockQuote via editor commands', () => {
    it('toggles the selected paragraph into a blockquote', () => {
        const { editor, container } = createTestEditor();
        placeCursor(editor);
        expect(editor.commands.toggleBlockQuote()).toBe(true);
        expect(findFirstNode(editor, 'blockquote')).not.toBeNull();
        destroyTestEditor({ editor, container });
    });
});

// ── toggleCallout ─────────────────────────────────────────────────────────────

describe('toggleCallout via editor commands', () => {
    it('toggles a block into a callout with the default variant', () => {
        const { editor, container } = createTestEditor();
        placeCursor(editor);
        expect(editor.commands.toggleCallout()).toBe(true);
        const callout = findFirstNode(editor, 'callout');
        expect(callout).not.toBeNull();
        expect(callout.attrs.variant).toBe('info');
        destroyTestEditor({ editor, container });
    });
});

// ── setCodeBlock ──────────────────────────────────────────────────────────────

describe('setCodeBlock via editor commands', () => {
    it('converts the current block to a code block', () => {
        const { editor, container } = createTestEditor();
        placeCursor(editor);
        expect(editor.commands.setCodeBlock()).toBe(true);
        expect(findFirstNode(editor, 'codeBlock')).not.toBeNull();
        destroyTestEditor({ editor, container });
    });
});

// ── toggleCodeBlock ──────────────────────────────────────────────────────────

describe('toggleCodeBlock via editor commands', () => {
    it('uses the default payload to convert a paragraph into a code block', () => {
        const { editor, container } = createTestEditor();
        placeCursor(editor);

        expect((editor.commands as any).toggleCodeBlock()).toBe(true);
        expect(findFirstNode(editor, 'codeBlock')).not.toBeNull();

        destroyTestEditor({ editor, container });
    });

    it('passes an explicit payload through canExecute and execute', () => {
        const { editor, container } = createTestEditor();
        placeCursor(editor);
        const context = { pmState: (editor as any).integration.getState() } as any;
        const payload = { language: 'javascript' };
        context.dispatch = jasmine.createSpy('dispatch');

        expect(toggleCodeBlockCommand.canExecute(context, payload)).toBe(true);
        toggleCodeBlockCommand.execute(context, payload);

        expect(context.dispatch).toHaveBeenCalled();
        destroyTestEditor({ editor, container });
    });

    it('delegates to setParagraph when toggling an existing code block', () => {
        const { editor, container } = createTestEditor();
        placeCursor(editor);
        expect((editor.commands as any).setCodeBlock()).toBe(true);
        expect((editor.commands as any).toggleCodeBlock()).toBe(true);

        expect(findFirstNode(editor, 'codeBlock')).toBeNull();
        expect(findFirstNode(editor, 'paragraph')).not.toBeNull();

        destroyTestEditor({ editor, container });
    });

    it('returns false when the codeBlock type is unavailable', () => {
        const { editor, container } = createTestEditor();
        const pmState = (editor as any).integration.getState();
        const nodes = { ...pmState.schema.nodes };
        delete nodes.codeBlock;

        expect(toggleCodeBlockCommand.canExecute({
            pmState: { ...pmState, schema: { ...pmState.schema, nodes } }
        } as any, undefined as any)).toBe(false);

        destroyTestEditor({ editor, container });
    });

    it('falls back to false when setCodeBlock has no canExecute method', () => {
        const original = setCodeBlockCommand.canExecute;
        const { editor, container } = createTestEditor();
        const context = { pmState: (editor as any).integration.getState() } as any;

        try {
            (setCodeBlockCommand as any).canExecute = undefined;
            expect(toggleCodeBlockCommand.canExecute(context, undefined as any)).toBe(false);
        } finally {
            (setCodeBlockCommand as any).canExecute = original;
            destroyTestEditor({ editor, container });
        }
    });

    it('falls back to false when setParagraph has no canExecute method', () => {
        const original = setParagraphCommand.canExecute;
        const { editor, container } = createTestEditor();
        placeCursor(editor);
        expect((editor.commands as any).setCodeBlock()).toBe(true);
        const context = { pmState: (editor as any).integration.getState() } as any;

        try {
            (setParagraphCommand as any).canExecute = undefined;
            expect(toggleCodeBlockCommand.canExecute(context, undefined as any)).toBe(false);
        } finally {
            (setParagraphCommand as any).canExecute = original;
            destroyTestEditor({ editor, container });
        }
    });
});

// ── toggleCollapsible ──────────────────────────────────────────────────────────

describe('toggleCollapsibleCommand', () => {
    describe('canExecute', () => {

        it('returns true when all required node types are available', () => {
            const { editor, container } = createTestEditor();

            const context = {
                pmState: (editor as any).integration.getState(),
                dispatch: jasmine.createSpy('dispatch')
            } as any;

            expect(
                toggleCollapsibleCommand.canExecute(context, {
                    triggerType: 'paragraph'
                })
            ).toBe(true);

            destroyTestEditor({ editor, container });
        });

        it('returns false when collapsible node type is unavailable', () => {
            const { editor, container } = createTestEditor();

            const pmState = (editor as any).integration.getState();
            const nodes = { ...pmState.schema.nodes };

            delete nodes.collapsible;

            const context = {
                pmState: {
                    ...pmState,
                    schema: {
                        ...pmState.schema,
                        nodes
                    }
                },
                dispatch: jasmine.createSpy('dispatch')
            } as any;

            expect(
                toggleCollapsibleCommand.canExecute(context, {
                    triggerType: 'paragraph'
                })
            ).toBe(false);

            destroyTestEditor({ editor, container });
        });

        it('returns false when collapsibleHeader node type is unavailable', () => {
            const { editor, container } = createTestEditor();

            const pmState = (editor as any).integration.getState();
            const nodes = { ...pmState.schema.nodes };

            delete nodes.collapsibleHeader;

            const context = {
                pmState: {
                    ...pmState,
                    schema: {
                        ...pmState.schema,
                        nodes
                    }
                },
                dispatch: jasmine.createSpy('dispatch')
            } as any;

            expect(
                toggleCollapsibleCommand.canExecute(context, {
                    triggerType: 'paragraph'
                })
            ).toBe(false);

            destroyTestEditor({ editor, container });
        });

        it('returns false when collapsibleBody node type is unavailable', () => {
            const { editor, container } = createTestEditor();

            const pmState = (editor as any).integration.getState();
            const nodes = { ...pmState.schema.nodes };

            delete nodes.collapsibleBody;

            const context = {
                pmState: {
                    ...pmState,
                    schema: {
                        ...pmState.schema,
                        nodes
                    }
                },
                dispatch: jasmine.createSpy('dispatch')
            } as any;

            expect(
                toggleCollapsibleCommand.canExecute(context, {
                    triggerType: 'paragraph'
                })
            ).toBe(false);

            destroyTestEditor({ editor, container });
        });

        it('returns false when the requested trigger node type is unavailable', () => {
            const { editor, container } = createTestEditor();

            const pmState = (editor as any).integration.getState();
            const nodes = { ...pmState.schema.nodes };

            delete nodes.paragraph;

            const context = {
                pmState: {
                    ...pmState,
                    schema: {
                        ...pmState.schema,
                        nodes
                    }
                },
                dispatch: jasmine.createSpy('dispatch')
            } as any;

            expect(
                toggleCollapsibleCommand.canExecute(context, {
                    triggerType: 'paragraph'
                })
            ).toBe(false);

            destroyTestEditor({ editor, container });
        });
    });

    describe('execute', () => {
        it('creates a collapsible using the editor command', () => {
            const { editor, container } = createTestEditor();

            editor.commands.toggleCollapsible({
                triggerType: 'paragraph'
            });

            const pmState = (editor as any).integration.getState();

            expect(pmState.doc.firstChild?.type.name).toBe('collapsible');

            destroyTestEditor({ editor, container });
        });

        it('deletes an empty collapsible and returns when toggled', () => {
            const { editor, container } = createTestEditor();

            // First create the collapsible through the public command.
            editor.commands.toggleCollapsible({
                triggerType: 'paragraph'
            });

            const pmState = (editor as any).integration.getState();

            expect(pmState.doc.firstChild?.type.name).toBe('collapsible');

            // Move the selection to a valid position inside the collapsible.
            let innerParagraphPos = -1;
            const collapsibleState = (editor as any).integration.getState();
            collapsibleState.doc.descendants((node: any, pos: number) => {
                if (node.type.name === 'paragraph') {
                    innerParagraphPos = pos;
                    return false;
                }
                return true;
            });
            expect(innerParagraphPos).toBeGreaterThan(0);
            placeCursor(editor, innerParagraphPos, innerParagraphPos);

            // Toggle through the public editor command.
            // This enters unwrapCollapsible().
            editor.commands.toggleCollapsible({
                triggerType: 'paragraph'
            });

            const updatedState = (editor as any).integration.getState();

            expect(
                updatedState.doc.firstChild?.type.name
            ).not.toBe('collapsible');

            destroyTestEditor({ editor, container });
        });

        it('deletes a collapsible when its slots have no hoisted children', () => {
            const collapsibleNode = {
                nodeSize: 6,
                content: {
                    forEach: (callback: (slotNode: any) => void): void => {
                        callback({ content: { forEach: (): void => undefined } });
                    }
                }
            };
            const transaction = {
                delete: jasmine.createSpy('delete').and.returnValue({})
            };
            const context = {
                pmState: {
                    selection: {
                        $from: {
                            depth: 1,
                            node: (depth: number): any => depth === 1
                                ? { type: { name: 'collapsible' } }
                                : { type: { name: 'doc' } },
                            before: jasmine.createSpy('before').and.returnValue(3)
                        }
                    },
                    doc: {
                        nodeAt: jasmine.createSpy('nodeAt').and.returnValue(collapsibleNode)
                    },
                    tr: transaction
                },
                dispatch: jasmine.createSpy('dispatch')
            } as any;

            toggleCollapsibleCommand.execute(context, { triggerType: 'paragraph' });

            expect(transaction.delete).toHaveBeenCalledWith(3, 9);
            expect(context.dispatch).toHaveBeenCalled();
        });

        it('returns without dispatch when nodeAt returns null at the resolved collapsible position', () => {
            const { editor, container } = createTestEditor();

            // Build a real collapsible first so findCollapsibleAncestorPos resolves
            // to a valid document position.
            editor.commands.toggleCollapsible({ triggerType: 'paragraph' });
            const pmState = (editor as any).integration.getState();
            expect(pmState.doc.firstChild?.type.name).toBe('collapsible');

            // Place the selection inside the trigger so the unwrap path is taken.
            let innerParagraphPos = -1;
            pmState.doc.descendants((node: any, pos: number) => {
                if (node.type.name === 'paragraph') {
                    innerParagraphPos = pos;
                    return false;
                }
                return true;
            });
            placeCursor(editor, innerParagraphPos, innerParagraphPos);

            // Spy nodeAt before the next execute so we capture it.
            spyOn(pmState.doc, 'nodeAt').and.returnValue(null);

            const dispatchSpy = jasmine.createSpy('dispatch');
            const context = { pmState, dispatch: dispatchSpy } as any;

            // Toggle forces the unwrap branch; nodeAt returning null must short-circuit.
            toggleCollapsibleCommand.execute(context, { triggerType: 'paragraph' });

            expect(dispatchSpy).not.toHaveBeenCalled();
            destroyTestEditor({ editor, container });
        });

        it('1052868 - keeps the cursor inside the trigger text when wrapping from a 4th-position cursor', () => {
            const { editor, container } = createTestEditor();

            // Place cursor at position 4 (inside the text 'Sample text')
            placeCursor(editor, 4, 4);

            const stateBefore = (editor as any).integration.getState();
            const positionBefore = stateBefore.selection.from;
            expect(positionBefore).toBe(4);

            // Execute wrap — this triggers the bug if selection-restore is broken
            expect(editor.commands.toggleCollapsible({ triggerType: 'paragraph' })).toBe(true);

            const stateAfter = (editor as any).integration.getState();
            expect(stateAfter.doc.firstChild?.type.name).toBe('collapsible');

            // Bug symptom: cursor jumps to position 2 (the collapsible wrapper boundary)
            // Fixed: cursor should stay inside the trigger text, not at position 2
            const cursorPos = stateAfter.selection.from;
            expect(cursorPos).not.toBe(2);

            // Verify cursor is inside text by checking the parent has text content
            const $from = stateAfter.selection.$from;
            const ancestor = $from.parent;
            expect(ancestor.textContent).toContain('Sample');

            destroyTestEditor({ editor, container });
        });
    });
});


// ── setHorizontalRule ─────────────────────────────────────────────────────────

describe('setHorizontalRule via editor commands', () => {
    it('inserts a horizontal rule node into the document', () => {
        const { editor, container } = createTestEditor();
        placeCursor(editor);
        expect(editor.can().setHorizontalRule()).toBe(true);
        expect(editor.commands.setHorizontalRule()).toBe(true);
        expect(findFirstNode(editor, 'horizontalRule')).not.toBeNull();
        destroyTestEditor({ editor, container });
    });

    it('reports the command as unavailable when horizontalRule is not registered', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = HeadlessEditor.create({
            document: buildDocument(),
            extensions: testExtensions.filter(extension => extension !== horizontalRuleExtension)
        });

        editor.mount(container);

        placeCursor(editor);

        expect(editor.can().setHorizontalRule()).toBe(false);
        expect(() => editor.commands.setHorizontalRule()).toThrowError(/Unknown command/);

        destroyTestEditor({ editor, container });
    });

    it('does not dispatch when the PM schema has no horizontalRule type', () => {
        const { editor, container } = createTestEditor();
        const pmState = (editor as any).integration.getState();
        const nodes = { ...pmState.schema.nodes };
        delete nodes.horizontalRule;
        const dispatch = jasmine.createSpy('dispatch');
        const context = {
            pmState: {
                ...pmState,
                schema: { ...pmState.schema, nodes }
            },
            dispatch
        } as any;

        setHorizontalRuleCommand.execute(context);

        expect(dispatch).not.toHaveBeenCalled();
        destroyTestEditor({ editor, container });
    });
});

// ── setTextAlign ──────────────────────────────────────────────────────────────

describe('setTextAlign via editor commands', () => {
    it('canExecute returns true for "center"', () => {
        const { editor, container } = createTestEditor();
        placeCursor(editor);
        expect(editor.can().setTextAlign({ align: 'center' })).toBe(true);
        destroyTestEditor({ editor, container });
    });

    it('accepts all valid alignment values and updates the document', () => {
        for (const align of ['left', 'center', 'right', 'justify'] as const) {
            const { editor, container } = createTestEditor();
            placeCursor(editor);
            expect(editor.commands.setTextAlign({ align })).toBe(true);
            const paragraph = findFirstNode(editor, 'paragraph');
            expect(paragraph.attrs.align).toBe(align);
            destroyTestEditor({ editor, container });
        }
    });

    it('aligns the paragraph target inside a list item', () => {
        const { editor, container } = createTestEditor();
        placeCursor(editor);

        expect((editor.commands as any).toggleBulletList()).toBe(true);
        expect((editor.commands as any).setTextAlign({ align: 'center' })).toBe(true);

        const listItem = findFirstNode(editor, 'listItem');
        expect(listItem).not.toBeNull();
        expect(listItem.children[0].attrs.align).toBe('center');

        destroyTestEditor({ editor, container });
    });

    it('aligns the list item when no child block is alignable', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        const editor = HeadlessEditor.create({
            document: buildDocument(),
            extensions: [
                paragraphExtension,
                listExtension,
                textAlignExtension.configure({ types: ['listItem'] })
            ]
        });
        editor.mount(container);
        placeCursor(editor);

        expect((editor.commands as any).toggleBulletList()).toBe(true);
        expect((editor.commands as any).setTextAlign({ align: 'right' })).toBe(true);

        const listItem = findFirstNode(editor, 'listItem');
        expect(listItem).not.toBeNull();
        expect(listItem.attrs.align).toBe('right');

        destroyTestEditor({ editor, container });
    });
});

// ── unsetTextAlign ────────────────────────────────────────────────────────────

describe('unsetTextAlign via editor commands', () => {
    it('clears the align attribute using the real editor state', () => {
        const { editor, container } = createTestEditor();
        placeCursor(editor);
        expect(editor.commands.setTextAlign({ align: 'justify' })).toBe(true);
        expect(editor.can().unsetTextAlign()).toBe(true);
        expect(editor.commands.unsetTextAlign()).toBe(true);

        const paragraph = findFirstNode(editor, 'paragraph');
        expect(paragraph.attrs.align === undefined || paragraph.attrs.align === null || paragraph.attrs.align === 'none').toBe(true);
        destroyTestEditor({ editor, container });
    });

    it('clears alignment from the paragraph target inside a list item', () => {
        const { editor, container } = createTestEditor();
        placeCursor(editor);

        expect((editor.commands as any).toggleBulletList()).toBe(true);
        expect((editor.commands as any).setTextAlign({ align: 'center' })).toBe(true);
        expect((editor.commands as any).unsetTextAlign()).toBe(true);

        const listItem = findFirstNode(editor, 'listItem');
        expect(listItem.children[0].attrs.align === undefined || listItem.children[0].attrs.align === null).toBe(true);
        destroyTestEditor({ editor, container });
    });

    it('clears alignment from the list item when no child block is alignable', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        const editor = HeadlessEditor.create({
            document: buildDocument(),
            extensions: [
                paragraphExtension,
                listExtension,
                textAlignExtension.configure({ types: ['listItem'] })
            ]
        });
        editor.mount(container);
        placeCursor(editor);

        expect((editor.commands as any).toggleBulletList()).toBe(true);
        expect((editor.commands as any).setTextAlign({ align: 'right' })).toBe(true);
        expect((editor.commands as any).unsetTextAlign()).toBe(true);

        const listItem = findFirstNode(editor, 'listItem');
        expect(listItem.attrs.align === undefined || listItem.attrs.align === null).toBe(true);
        destroyTestEditor({ editor, container });
    });
});
