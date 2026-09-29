/**
 * spec/commands/builtins/list.spec.ts
 *
 * Unit tests for all list builtin commands:
 *   toggleListType (internal), sinkListItem (internal), liftListItem (internal),
 *   splitListItem (internal), toggleBulletList, toggleOrderedList, toggleTaskList,
 *   indentListItem, outdentListItem
 */
import { buildIM, buildCtx, countNodesOfType } from './helpers';
import { toggleListTypeCommand } from '../../../src/commands/builtins/list/toggle-list-type';
import { sinkListItemCommand } from '../../../src/commands/builtins/list/sink-list-item';
import { liftListItemCommand } from '../../../src/commands/builtins/list/lift-list-item';
import { splitListItemCommand } from '../../../src/commands/builtins/list/split-list-item';
import { toggleBulletListCommand } from '../../../src/commands/builtins/list/toggle-bullet-list';
import { toggleOrderedListCommand } from '../../../src/commands/builtins/list/toggle-ordered-list';
import { toggleTaskListCommand } from '../../../src/commands/builtins/list/toggle-task-list';
import { indentListItemCommand } from '../../../src/commands/builtins/list/indent-list-item';
import { outdentListItemCommand } from '../../../src/commands/builtins/list/outdent-list-item';
import { taskListExtension } from '../../../src/extensions/builtins/task-list';
import { HeadlessEditor, listExtension, paragraphExtension, TextNode } from '../../../src';

// ── toggleListType (internal) ─────────────────────────────────────────────────

describe('toggleListTypeCommand (internal)', () => {
    it('has name "toggleListType" and category "list"', () => {
        expect(toggleListTypeCommand.name).toBe('toggleListType');
        expect(toggleListTypeCommand.meta?.category).toBe('list');
    });

    it('canExecute returns false for unknown listType', () => {
        const im = buildIM();
        const { ctx } = buildCtx(im);
        expect(toggleListTypeCommand.canExecute!(ctx, { listType: 'unknownList' as any })).toBe(false);
    });

    it('canExecute returns true for listType "bullet"', () => {
        const im = buildIM();
        const { ctx } = buildCtx(im);
        expect(toggleListTypeCommand.canExecute!(ctx, { listType: 'bullet' })).toBe(true);
    });

    it('execute wraps current paragraph in a bulletList', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        toggleListTypeCommand.execute(ctx, { listType: 'bullet' });
        expect(dispatched.length).toBe(1);
        expect(countNodesOfType(im, 'bulletList')).toBeGreaterThan(0);
    });
});

// ── sinkListItem (internal) ───────────────────────────────────────────────────

describe('sinkListItemCommand (internal)', () => {
    it('has name "sinkListItem" and category "list"', () => {
        expect(sinkListItemCommand.name).toBe('sinkListItem');
        expect(sinkListItemCommand.meta?.category).toBe('list');
    });

    it('execute returns false when not inside a list', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        // No list — pmSinkListItem will return false
        sinkListItemCommand.execute(ctx, undefined as any);
        expect(dispatched.length).toBe(0);
    });
});

// ── liftListItem (internal) ───────────────────────────────────────────────────

describe('liftListItemCommand (internal)', () => {
    it('has name "liftListItem" and category "list"', () => {
        expect(liftListItemCommand.name).toBe('liftListItem');
        expect(liftListItemCommand.meta?.category).toBe('list');
    });

    it('execute returns false when not inside a list', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        liftListItemCommand.execute(ctx, undefined as any);
        expect(dispatched.length).toBe(0);
    });
});

// ── splitListItem (internal) ─────────────────────────────────────────────────

describe('splitListItemCommand (internal)', () => {
    it('has name "splitListItem" and category "list"', () => {
        expect(splitListItemCommand.name).toBe('splitListItem');
        expect(splitListItemCommand.meta?.category).toBe('list');
    });

    it('canExecute returns false when not inside a list item', () => {
        const im = buildIM();
        const { ctx } = buildCtx(im);
        expect(splitListItemCommand.canExecute!(ctx, undefined as any)).toBe(false);
    });

    it('execute returns without dispatching when not inside a list item', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        splitListItemCommand.execute(ctx, undefined as any);
        expect(dispatched.length).toBe(0);
    });
});

// ── toggleBulletList ──────────────────────────────────────────────────────────

describe('toggleBulletListCommand', () => {
    it('has name "toggleBulletList", label "Bullet List", category "list"', () => {
        expect(toggleBulletListCommand.name).toBe('toggleBulletList');
        expect(toggleBulletListCommand.meta?.label).toBe('Bullet List');
        expect(toggleBulletListCommand.meta?.category).toBe('list');
    });

    it('canExecute returns true in normal paragraph context', () => {
        const im = buildIM();
        const { ctx } = buildCtx(im);
        expect(toggleBulletListCommand.canExecute!(ctx, undefined as any)).toBe(true);
    });

    it('canExecute defaults to false when the internal guard is unavailable', () => {
        const originalCanExecute = toggleListTypeCommand.canExecute;
        (toggleListTypeCommand as any).canExecute = undefined;

        try {
            expect(toggleBulletListCommand.canExecute!({} as any, undefined as any)).toBe(false);
        } finally {
            (toggleListTypeCommand as any).canExecute = originalCanExecute;
        }
    });

    it('execute forwards omitted and false keepMarks payload values', () => {
        const originalExecute = toggleListTypeCommand.execute;
        const payloads: any[] = [];
        (toggleListTypeCommand as any).execute = (_ctx: any, payload: any) => payloads.push(payload);

        try {
            toggleBulletListCommand.execute({} as any, undefined);
            toggleBulletListCommand.execute({} as any, { keepMarks: false });
        } finally {
            (toggleListTypeCommand as any).execute = originalExecute;
        }

        expect(payloads).toEqual([
            { listType: 'bullet', keepMarks: undefined },
            { listType: 'bullet', keepMarks: false }
        ]);
    });

    it('execute wraps selection in bulletList and dispatches', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        toggleBulletListCommand.execute(ctx, undefined as any);
        expect(dispatched.length).toBe(1);
        expect(countNodesOfType(im, 'bulletList')).toBeGreaterThan(0);
    });
});

// ── toggleOrderedList ─────────────────────────────────────────────────────────

describe('toggleOrderedListCommand', () => {
    it('has name "toggleOrderedList", label "Ordered List"', () => {
        expect(toggleOrderedListCommand.name).toBe('toggleOrderedList');
        expect(toggleOrderedListCommand.meta?.label).toBe('Ordered List');
    });
});

// ── toggleTaskList ────────────────────────────────────────────────────────────

describe('toggleTaskListCommand', () => {
    it('has name "toggleTaskList", label "Task List"', () => {
        expect(toggleTaskListCommand.name).toBe('toggleTaskList');
        expect(toggleTaskListCommand.meta?.label).toBe('Task List');
    });
});

// ── toggleTaskChecked ─────────────────────────────────────────────────────────

describe('toggleTaskCheckedCommand', () => {
    function createTaskEditor(): { editor: HeadlessEditor; container: HTMLElement } {
        const container = document.createElement('div');
        document.body.appendChild(container);
        const editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: 'task-doc',
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [{
                    type: 'taskList',
                    id: 'task-list',
                    attrs: {},
                    marks: [],
                    children: [
                        {
                            type: 'taskItem',
                            id: 'task-1',
                            attrs: { checked: false },
                            marks: [],
                            children: [{
                                type: 'paragraph',
                                id: 'task-1-paragraph',
                                attrs: {},
                                marks: [],
                                children: [{
                                    type: 'text',
                                    id: 'task-1-text',
                                    attrs: {},
                                    marks: [],
                                    children: [],
                                    text: 'First task'
                                } as TextNode]
                            }]
                        },
                        {
                            type: 'taskItem',
                            id: 'task-2',
                            attrs: { checked: true },
                            marks: [],
                            children: [{
                                type: 'paragraph',
                                id: 'task-2-paragraph',
                                attrs: {},
                                marks: [],
                                children: [{
                                    type: 'text',
                                    id: 'task-2-text',
                                    attrs: {},
                                    marks: [],
                                    children: [],
                                    text: 'Second task'
                                } as TextNode]
                            }]
                        }
                    ]
                }]
            },
            extensions: [paragraphExtension, taskListExtension]
        });
        editor.mount(container);
        return { editor, container };
    }

    it('toggles the selected task item when payload is omitted', () => {
        const { editor, container } = createTaskEditor();

        try {
            editor.commands.setSelection({ from: 3, to: 3 });
            expect(editor.commands.toggleTaskChecked()).toBe(true);
            expect(editor.getDocument().children[0].children[0].attrs['checked']).toBe(true);
        } finally {
            editor.destroy();
            container.remove();
        }
    });

    it('cannot execute when the selection is outside a task item', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        const editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: 'paragraph-doc',
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [{
                    type: 'paragraph',
                    id: 'paragraph-1',
                    attrs: {},
                    marks: [],
                    children: []
                }]
            },
            extensions: [paragraphExtension, taskListExtension]
        });
        editor.mount(container);

        try {
            expect(editor.commands.toggleTaskChecked()).toBe(false);
        } finally {
            editor.destroy();
            container.remove();
        }
    });

    it('toggles the task item at an explicit position', () => {
        const { editor, container } = createTaskEditor();
        const taskItemPositions: number[] = [];
        editor.integration.getState().doc.descendants((node, pos) => {
            if (node.type.name === 'taskItem') {
                taskItemPositions.push(pos);
            }
            return true;
        });

        try {
            expect(editor.commands.toggleTaskChecked({ pos: taskItemPositions[1] })).toBe(true);
            expect(editor.getDocument().children[0].children[1].attrs['checked']).toBe(false);
        } finally {
            editor.destroy();
            container.remove();
        }
    });

    it('rejects an invalid explicit position and leaves the document unchanged', () => {
        const { editor, container } = createTaskEditor();

        try {
            expect(editor.commands.toggleTaskChecked({ pos: 0 })).toBe(false);
            expect(editor.getDocument().children[0].children[0].attrs['checked']).toBe(false);
        } finally {
            editor.destroy();
            container.remove();
        }
    });
});

// ── indentListItem ────────────────────────────────────────────────────────────

describe('indentListItemCommand', () => {
    it('has name "indentListItem" and category "list"', () => {
        expect(indentListItemCommand.name).toBe('indentListItem');
        expect(indentListItemCommand.meta?.category).toBe('list');
    });

    it('execute returns false outside a list (nothing to sink)', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        indentListItemCommand.execute(ctx, undefined as any);
        expect(dispatched.length).toBe(0);
    });

    it('canExecute defaults to true when sinkListItem has no canExecute guard', () => {
        const originalCanExecute = sinkListItemCommand.canExecute;
        (sinkListItemCommand as any).canExecute = undefined;

        try {
            expect(indentListItemCommand.canExecute({} as any, undefined as any)).toBe(true);
        } finally {
            (sinkListItemCommand as any).canExecute = originalCanExecute;
        }
    });
});

// ── outdentListItem ───────────────────────────────────────────────────────────

describe('outdentListItemCommand', () => {
    it('has name "outdentListItem" and category "list"', () => {
        expect(outdentListItemCommand.name).toBe('outdentListItem');
        expect(outdentListItemCommand.meta?.category).toBe('list');
    });

    it('execute returns false outside a list (nothing to lift)', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        outdentListItemCommand.execute(ctx, undefined as any);
        expect(dispatched.length).toBe(0);
    });
});

describe('when Tab is pressed in the second list item', () => {
    it('creates a nested child list and moves the item into it', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: 'doc',
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [{
                    type: 'bulletList',
                    id: 'list-1',
                    attrs: {},
                    marks: [],
                    children: [
                        {
                            type: 'listItem',
                            id: 'item-1',
                            attrs: {},
                            marks: [],
                            children: [{
                                type: 'paragraph',
                                id: 'p1',
                                attrs: {},
                                marks: [],
                                children: [{
                                    type: 'text',
                                    id: 't1',
                                    attrs: {},
                                    marks: [],
                                    children: [],
                                    text: 'Item 1'
                                } as TextNode]
                            }]
                        },
                        {
                            type: 'listItem',
                            id: 'item-2',
                            attrs: {},
                            marks: [],
                            children: [{
                                type: 'paragraph',
                                id: 'p2',
                                attrs: {},
                                marks: [],
                                children: [{
                                    type: 'text',
                                    id: 't2',
                                    attrs: {},
                                    marks: [],
                                    children: [],
                                    text: 'Item 2'
                                } as TextNode]
                            }]
                        }
                    ]
                }]
            },
            extensions: [paragraphExtension, listExtension]
        });

        editor.mount(container);

        try {
            let secondListItemPos = -1;

            editor.integration.getState().doc.descendants((node, pos) => {
                if (node.attrs?.id === 'item-2') {
                    secondListItemPos = pos;
                    return false;
                }
                return true;
            });

            expect(secondListItemPos).toBeGreaterThan(-1);

            // Place cursor inside the second list item.
            editor.commands.setSelection({
                from: secondListItemPos + 2,
                to: secondListItemPos + 2
            });

            // Simulates the Tab key behavior.
            expect(editor.commands.indentListItem()).toBe(true);

            const doc = editor.getDocument();
            const rootList = doc.children[0];
            const firstItem = rootList.children[0];
            const nestedList = firstItem.children.find(
                child => child.type === 'bulletList'
            );
            expect(nestedList).toBeDefined();
            expect(nestedList?.children.length).toBe(1);

            const nestedItem = nestedList?.children[0];
            const textNode = nestedItem?.children[0]?.children[0] as TextNode;
            expect(textNode.text).toBe('Item 2');
        } finally {
            editor.destroy();
            container.remove();
        }
    });
});

describe('list keyboard behavior', () => {
    let container: HTMLElement;
    let editor: HeadlessEditor;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);

        editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: 'doc',
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [{
                    type: 'bulletList',
                    id: 'list-1',
                    attrs: {},
                    marks: [],
                    children: [{
                        type: 'listItem',
                        id: 'item-1',
                        attrs: {},
                        marks: [],
                        children: [{
                            type: 'paragraph',
                            id: 'p1',
                            attrs: {},
                            marks: [],
                            children: [{
                                type: 'text',
                                id: 't1',
                                attrs: {},
                                marks: [],
                                children: [],
                                text: 'list'
                            } as TextNode]
                        }]
                    }]
                }]
            },
            extensions: [paragraphExtension, listExtension]
        });
        editor.mount(container);
    });

    afterEach(() => {
        editor.destroy();
        container.remove();
    });

    it('1053297 - Pressing Enter After Removing an Empty List Item Creates a Nested Paragraph', () => {
        let textPos = -1;
        editor.integration.getState().doc.descendants((node, pos) => {
            if (node.type.name === 'text' && node.text === 'list') {
                textPos = pos + node.nodeSize;
                return false;
            }
            return true;
        });
        expect(textPos).toBeGreaterThan(-1);
        // Cursor at the end of "list".
        editor.commands.setSelection({
            from: textPos,
            to: textPos
        });
        // Enter -> creates an empty second list item.
        expect(editor.commands.splitListItem()).toBe(true);
        let doc = editor.getDocument();
        expect(doc.children[0].type).toBe('bulletList');
        expect(doc.children[0].children.length).toBe(2);
        // First Backspace -> empty list item is lifted out of the list.
        expect(editor.commands.outdentListItem()).toBe(true);
        doc = editor.getDocument();
        expect(doc.children.length).toBe(2);
        expect(doc.children[0].type).toBe('bulletList');
        expect(doc.children[0].children.length).toBe(1);
        expect(doc.children[1].type).toBe('paragraph');
        // Second Backspace -> empty paragraph is removed.
        expect(editor.commands.joinListBackward()).toBe(true);
        doc = editor.getDocument();
        expect(doc.children.length).toBe(1);
        expect(doc.children[0].type).toBe('bulletList');
        expect(doc.children[0].children.length).toBe(1);
        // Regression check:
        // The cursor must be inside the paragraph of the last list item.
        const state = editor.integration.getState();
        expect(state.selection.$from.parent.type.name).toBe('paragraph');
        // Enter -> must create a second list item.
        expect(editor.commands.splitListItem()).toBe(true);
        doc = editor.getDocument();
        const list = doc.children[0];
        expect(list.type).toBe('bulletList');
        expect(list.children.length).toBe(2);
        expect(list.children[0].type).toBe('listItem');
        expect(list.children[1].type).toBe('listItem');
        expect(list.children[0].children.length).toBe(1);
        expect(list.children[1].children.length).toBe(1);
        expect(list.children[0].children[0].type).toBe('paragraph');
        expect(list.children[1].children[0].type).toBe('paragraph');
    });
});

describe('Built-in: toggleListTypeCommand - nested list scenarios', () => {
    let editor: HeadlessEditor;
    let container: HTMLElement;

    const createNestedListEditor = (): void => {
        editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [{
                    type: 'bulletList',
                    id: crypto.randomUUID(),
                    attrs: {},
                    marks: [],
                    children: [{
                        type: 'listItem',
                        id: crypto.randomUUID(),
                        attrs: {},
                        marks: [],
                        children: [{
                            type: 'paragraph',
                            id: crypto.randomUUID(),
                            attrs: {},
                            marks: [],
                            children: [{
                                type: 'text',
                                id: crypto.randomUUID(),
                                attrs: {},
                                children: [],
                                text: 'list1',
                                marks: []
                            } as TextNode]
                        }, {
                            type: 'bulletList',
                            id: crypto.randomUUID(),
                            attrs: {},
                            marks: [],
                            children: [{
                                type: 'listItem',
                                id: crypto.randomUUID(),
                                attrs: {},
                                marks: [],
                                children: [{
                                    type: 'paragraph',
                                    id: crypto.randomUUID(),
                                    attrs: {},
                                    marks: [],
                                    children: [{
                                        type: 'text',
                                        id: crypto.randomUUID(),
                                        attrs: {},
                                        children: [],
                                        text: 'list2',
                                        marks: []
                                    } as TextNode]
                                }]
                            }]
                        }]
                    }]
                }]
            },
            extensions: [
                paragraphExtension,
                listExtension,
                taskListExtension
            ]
        });
        editor.mount(container);
    };

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        createNestedListEditor();
    });

    afterEach(() => {
        if (!editor.isDestroyed) {
            editor.destroy();
        }

        container.remove();
    });

    describe('1053089 - Nested Bulleted List Is Not Converted to Ordered List When Applying Ordered List to Entire Selection', () => {
        it('should convert the outer and nested lists to ordered, back to bullet, and then to task lists', () => {
            // First convert the initial bullet list to ordered list.
            let document = editor.integration.getState().doc;
            let listFrom = -1;
            let listTo = -1;
            document.descendants((node, pos) => {
                if (node.type.name === 'bulletList' && listFrom === -1) {
                    listFrom = pos;
                    listTo = pos + node.nodeSize;
                    return false;
                }

                return true;
            });
            expect(listFrom).toBeGreaterThan(-1);
            expect(listTo).toBeGreaterThan(listFrom);
            editor.commands.setSelection({
                from: listFrom + 1,
                to: listTo - 1
            });
            expect(editor.commands.toggleOrderedList()).toBe(true);
            // Get the updated document after the first conversion.
            document = editor.integration.getState().doc;
            let orderedListFrom = -1;
            let orderedListTo = -1;
            document.descendants((node, pos) => {
                if (node.type.name === 'orderedList' && orderedListFrom === -1) {
                    orderedListFrom = pos;
                    orderedListTo = pos + node.nodeSize;
                    return false;
                }
                return true;
            });
            expect(orderedListFrom).toBeGreaterThan(-1);
            expect(orderedListTo).toBeGreaterThan(orderedListFrom);
            // Select the complete outer ordered list again.
            editor.commands.setSelection({
                from: orderedListFrom + 1,
                to: orderedListTo - 1
            });
            // Convert ordered list back to bullet list.
            expect(editor.commands.toggleBulletList()).toBe(true);
            let updatedDocument = editor.getDocument();
            let rootList = updatedDocument.children[0];
            // Outer list should now be bullet.
            expect(rootList.type).toBe('bulletList');
            let rootItem = rootList.children[0];
            // Nested list should also be bullet.
            let nestedList = rootItem.children.find(
                child => child.type === 'bulletList'
            );
            expect(nestedList).toBeDefined();
            expect(nestedList?.children.length).toBe(1);
            // Nested ordered list should no longer exist.
            expect(
                rootItem.children.some(child => child.type === 'orderedList')
            ).toBe(false);
            // Text should remain unchanged.
            let nestedItem = nestedList?.children[0];
            let textNode = nestedItem?.children[0]?.children[0] as TextNode;
            expect(textNode.text).toBe('list2');
            // -------------------------------------------------------------
            // Convert the complete bullet-list hierarchy to a task list.
            // -------------------------------------------------------------
            // Re-read the ProseMirror document because the previous
            // transformation may have changed node positions.
            document = editor.integration.getState().doc;
            let bulletListFrom = -1;
            let bulletListTo = -1;
            document.descendants((node, pos) => {
                if (node.type.name === 'bulletList' && bulletListFrom === -1) {
                    bulletListFrom = pos;
                    bulletListTo = pos + node.nodeSize;
                    return false;
                }
                return true;
            });
            expect(bulletListFrom).toBeGreaterThan(-1);
            expect(bulletListTo).toBeGreaterThan(bulletListFrom);
            // Select the complete outer bullet list, including the nested list.
            editor.commands.setSelection({
                from: bulletListFrom + 1,
                to: bulletListTo - 1
            });
            // Convert the bullet-list hierarchy to a task-list hierarchy.
            expect(editor.commands.toggleTaskList()).toBe(true);
            updatedDocument = editor.getDocument();
            rootList = updatedDocument.children[0];
            // Outer list should now be a task list.
            expect(rootList.type).toBe('taskList');
            rootItem = rootList.children[0];
            // Outer item should now be a task item.
            expect(rootItem.type).toBe('taskItem');
            // Nested list should also be converted to a task list.
            nestedList = rootItem.children.find(
                child => child.type === 'taskList'
            );
            expect(nestedList).toBeDefined();
            expect(nestedList?.children.length).toBe(1);
            // Nested item should now be a task item.
            nestedItem = nestedList?.children[0];
            expect(nestedItem?.type).toBe('taskItem');
            // Text should remain unchanged after task-list conversion.
            textNode = nestedItem?.children[0]?.children[0] as TextNode;
            expect(textNode.text).toBe('list2');
            // No bullet or ordered list should remain in the hierarchy.
            expect(
                rootItem.children.some(child => child.type === 'bulletList')
            ).toBe(false);
            expect(
                rootItem.children.some(child => child.type === 'orderedList')
            ).toBe(false);
        });
    });
});

describe('1052868 - cross-type list conversion preserves selection', () => {
    function createListEditor(initialListType: 'bulletList' | 'orderedList'): {
        editor: HeadlessEditor;
        container: HTMLElement;
    } {
        const container = document.createElement('div');
        document.body.appendChild(container);
        const items = [
            { id: 'item-a', text: 'First line' },
            { id: 'item-b', text: 'Second line' },
            { id: 'item-c', text: 'Third line' }
        ];
        const children = items.map(({ id, text }) => ({
            type: 'listItem',
            id,
            attrs: {},
            marks: [],
            children: [{
                type: 'paragraph',
                id: id + '-p',
                attrs: {},
                marks: [],
                children: [{ type: 'text', id: id + '-t', attrs: {}, marks: [], children: [], text } as TextNode]
            }]
        }));
        const editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: 'doc-cross-list',
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [{
                    type: initialListType,
                    id: 'list-1',
                    attrs: {},
                    marks: [],
                    children
                }]
            },
            extensions: [paragraphExtension, listExtension]
        });
        editor.mount(container);
        return { editor, container };
    }

    it('ordered → bullet keeps a collapsed cursor at the same character offset', () => {
        const { editor, container } = createListEditor('orderedList');

        try {
            // Locate the second list item's paragraph and place the cursor
            // several characters deep — clearly inside text — so a successful
            // selection-restore leaves the cursor in 'Second line' text.
            let secondItemParaPos = -1;
            editor.integration.getState().doc.descendants((node: any, pos: number) => {
                if (node.type.name === 'paragraph' && node.attrs?.id === 'item-b-p') {
                    secondItemParaPos = pos;
                    return false;
                }
                return true;
            });
            expect(secondItemParaPos).toBeGreaterThan(0);
            const cursorInPara = secondItemParaPos + 4; // inside 'Secon|d line'
            editor.commands.setSelection({ from: cursorInPara, to: cursorInPara });

            const beforeFrom = editor.integration.getState().selection.from;
            const beforeTo   = editor.integration.getState().selection.to;
            expect(beforeFrom).toBe(cursorInPara);
            expect(beforeTo).toBe(cursorInPara);

            // Convert ordered → unordered list.
            expect(editor.commands.toggleBulletList()).toBe(true);

            const doc = editor.getDocument();
            expect(doc.children[0].type).toBe('bulletList');

            const afterFrom = editor.integration.getState().selection.from;
            const afterTo   = editor.integration.getState().selection.to;
            // The conversion kept the list numerically identical, so the
            // selection offsets remain valid inside the new structure.
            expect(afterFrom).toBe(beforeFrom);
            expect(afterTo).toBe(beforeTo);
            expect(afterFrom).toBe(afterTo);

            // Sanity-check the cursor still sits inside the original text.
            const $from = editor.integration.getState().selection.$from;
            expect($from.parent.isTextblock).toBe(true);
            expect($from.parent.textContent).toContain('Second');
        } finally {
            editor.destroy();
            container.remove();
        }
    });

    it('bullet → ordered keeps a ranged selection across multiple items', () => {
        const { editor, container } = createListEditor('bulletList');

        try {
            // Place a ranged selection that covers parts of item-a and item-b.
            let firstItemPos = -1;
            let secondItemPos = -1;
            editor.integration.getState().doc.descendants((node: any, pos: number) => {
                if (node.type.name === 'listItem') {
                    const id = node.attrs?.id;
                    if (id === 'item-a') { firstItemPos = pos; }
                    if (id === 'item-b') { secondItemPos = pos; return false; }
                }
                return true;
            });
            expect(firstItemPos).toBeGreaterThan(0);
            expect(secondItemPos).toBeGreaterThan(firstItemPos);

            const rangeFrom = firstItemPos + 3;   // inside 'Fir|st line'
            const rangeTo   = secondItemPos + 4;  // inside 'Seco|nd line'
            editor.commands.setSelection({ from: rangeFrom, to: rangeTo });

            const beforeFrom = editor.integration.getState().selection.from;
            const beforeTo   = editor.integration.getState().selection.to;
            expect(beforeFrom).toBe(rangeFrom);
            expect(beforeTo).toBe(rangeTo);

            // Convert bullet → ordered list.
            expect(editor.commands.toggleOrderedList()).toBe(true);

            const doc = editor.getDocument();
            expect(doc.children[0].type).toBe('orderedList');

            const afterFrom = editor.integration.getState().selection.from;
            const afterTo   = editor.integration.getState().selection.to;
            // Same numeric shape is preserved across the conversion so the
            // user's range still covers content in two distinct list items.
            expect(afterFrom).toBe(beforeFrom);
            expect(afterTo).toBe(beforeTo);
            expect(afterFrom < afterTo).toBe(true);
        } finally {
            editor.destroy();
            container.remove();
        }
    });
});