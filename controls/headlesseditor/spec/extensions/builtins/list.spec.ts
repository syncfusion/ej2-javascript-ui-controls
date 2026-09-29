/**
* This spec file contains test cases for:
* - List Extension
* - List Keymap Extension
*/

import {
    EditorNode,
    HeadlessEditor,
    paragraphExtension,
    TextNode
} from '../../../src/index';

import { listExtension } from '../../../src/extensions/builtins/list';
import { listKeymapExtension } from '../../../src/extensions/builtins/list-keymap';
import { boldExtension } from '../../../src/extensions/builtins/bold';
import { italicExtension } from '../../../src/extensions/builtins/italic';
import { headingExtension } from '../../../src/extensions/builtins/heading';
import { fontFamilyExtension } from '../../../src/extensions/builtins/font-family';
import { fontSizeExtension } from '../../../src/extensions/builtins/font-size';
import { fontColorExtension } from '../../../src/extensions/builtins/font-color';
import { backgroundColorExtension } from '../../../src/extensions/builtins/background-color';
import { textAlignExtension } from '../../../src/extensions/builtins/text-align';
import { textStyleExtension } from '../../../src/extensions/builtins/text-style';

describe('Built-in: list - real-time interactions', () => {
    function setCursorAtForEditor(editor: HeadlessEditor, root: HTMLElement, text: string, offset: number): void {
        const view: any = editor.integration.getView();
        const documentNode: any = view.state.doc;
        let targetPosition: number = -1;
        documentNode.descendants((node: any, position: number): boolean => {
            if (node.isText && node.text === text) {
                targetPosition = position;
                return false;
            }
            return true;
        });
        if (targetPosition === -1) {
            throw new Error(`setCursorAt: text not found in document: ${text}`);
        }
        const textNode: any = documentNode.nodeAt(targetPosition);
        const textLength: number = textNode ? textNode.nodeSize : 0;
        const finalPosition: number = targetPosition + Math.min(Math.max(0, offset), textLength);
        const SelectionConstructor: any = view.state.selection.constructor;
        view.dispatch(view.state.tr.setSelection(
            SelectionConstructor.create(documentNode, finalPosition, finalPosition)
        ));
        void root;
    }

    function selectTextRangeInEditor(editor: HeadlessEditor, text: string, fromOffset: number, toOffset: number): void {
        const view: any = editor.integration.getView();
        const documentNode: any = view.state.doc;
        let targetPosition: number = -1;
        documentNode.descendants((node: any, position: number): boolean => {
            if (node.isText && node.text === text) {
                targetPosition = position;
                return false;
            }
            return true;
        });
        if (targetPosition === -1) {
            throw new Error(`selectTextRange: text not found in document: ${text}`);
        }
        const textNode: any = documentNode.nodeAt(targetPosition);
        const textLength: number = textNode ? textNode.nodeSize : 0;
        const from: number = targetPosition + Math.min(Math.max(0, fromOffset), textLength);
        const to: number = targetPosition + Math.min(Math.max(0, toOffset), textLength);
        const SelectionConstructor: any = view.state.selection.constructor;
        view.dispatch(view.state.tr.setSelection(
            SelectionConstructor.create(documentNode, from, to)
        ));
    }

    const textNode = (text: string): any => ({
        type: 'text', id: crypto.randomUUID(), attrs: {}, children: [], text, marks: []
    });
    const paragraphNode = (text: string): any => ({
        type: 'paragraph', id: crypto.randomUUID(), attrs: {}, marks: [],
        children: text ? [textNode(text)] : []
    });
    const listItemNode = (...children: any[]): any => ({
        type: 'listItem', id: crypto.randomUUID(), attrs: {}, marks: [], children
    });
    const bulletListNode = (...items: any[]): any => ({
        type: 'bulletList', id: crypto.randomUUID(), attrs: { listStyleType: 'disc' }, marks: [], children: items
    });
    const orderedListNode = (...items: any[]): any => ({
        type: 'orderedList', id: crypto.randomUUID(), attrs: { order: 1, listStyleType: 'decimal' }, marks: [], children: items
    });
    const createListEditor = (children: any[]): HeadlessEditor => HeadlessEditor.create({
        document: {
            type: 'document', id: crypto.randomUUID(), schemaVersion: 1, attrs: {}, marks: [], children
        },
        extensions: [
            paragraphExtension,
            listExtension,
            listKeymapExtension,
            boldExtension,
            italicExtension,
            headingExtension,
            fontFamilyExtension,
            fontSizeExtension,
            fontColorExtension,
            backgroundColorExtension,
            textAlignExtension,
            textStyleExtension
        ]
    });

    it('should allow typing multiple words in a bullet list item', () => {
        const editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [{
                    type: 'bulletList',
                    id: crypto.randomUUID(),
                    attrs: { listStyleType: 'disc' },
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
                            children: []
                        }]
                    }]
                }]
            },
            extensions: [paragraphExtension, listExtension]
        });

        const container = document.createElement('div');
        document.body.appendChild(container);
        editor.mount(container);

        const view: any = editor.integration.getView();
        view.focus();

        // User types normal words into the empty bullet list item.
        view.dispatch(view.state.tr.insertText('Hello world from editor'));

        // The typed content should remain inside the same list item.
        expect(container.querySelector('ul')).not.toBeNull();
        expect(container.querySelectorAll('li').length).toBe(1);
        expect(container.querySelector('li')!.textContent)
            .toBe('Hello world from editor');

        editor.destroy();
        container.remove();
    });


    it('should continue typing at the end of an existing bullet list item', () => {
        const editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [{
                    type: 'bulletList',
                    id: crypto.randomUUID(),
                    attrs: { listStyleType: 'disc' },
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
                                text: 'Hello',
                                marks: []
                            } as TextNode]
                        }]
                    }]
                }]
            },
            extensions: [paragraphExtension, listExtension]
        });

        const container = document.createElement('div');
        document.body.appendChild(container);
        editor.mount(container);

        const view: any = editor.integration.getView();
        view.focus();

        // Place the cursor after the existing word.
        const endPosition = view.state.doc.content.size - 2;

        view.dispatch(
            view.state.tr.setSelection(
                (view.state.selection as any).constructor.create(
                    view.state.doc,
                    endPosition,
                    endPosition
                )
            )
        );

        // User continues typing more words.
        view.dispatch(view.state.tr.insertText(' world again'));

        // New text should be appended to the same list item.
        expect(container.querySelectorAll('li').length).toBe(1);
        expect(container.textContent).toContain('Hello world again');

        editor.destroy();
        container.remove();
    });


    it('should preserve list structure while typing words one after another', () => {
        const editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [{
                    type: 'bulletList',
                    id: crypto.randomUUID(),
                    attrs: { listStyleType: 'disc' },
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
                            children: []
                        }]
                    }]
                }]
            },
            extensions: [paragraphExtension, listExtension]
        });

        const container = document.createElement('div');
        document.body.appendChild(container);
        editor.mount(container);

        const view: any = editor.integration.getView();
        view.focus();

        // Simulate continuous typing instead of inserting the complete sentence at once.
        const words = ['Build', 'the', 'project', 'and', 'run', 'tests'];

        words.forEach((word, index) => {
            view.dispatch(
                view.state.tr.insertText(index === 0 ? word : ` ${word}`)
            );
        });

        // Every typed word should remain in the same bullet list item.
        expect(container.querySelector('ul')).not.toBeNull();
        expect(container.querySelectorAll('li').length).toBe(1);
        expect(container.textContent).toContain(
            'Build the project and run tests'
        );

        editor.destroy();
        container.remove();
    });

    it('should create separate content when typing after moving to another list item', () => {
        const editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [{
                    type: 'bulletList',
                    id: crypto.randomUUID(),
                    attrs: { listStyleType: 'disc' },
                    marks: [],
                    children: [
                        {
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
                                    text: 'First task',
                                    marks: []
                                } as TextNode]
                            }]
                        },
                        {
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
                                    text: 'Second task',
                                    marks: []
                                } as TextNode]
                            }]
                        }
                    ]
                }]
            },
            extensions: [paragraphExtension, listExtension]
        });

        const container = document.createElement('div');
        document.body.appendChild(container);
        editor.mount(container);

        const view: any = editor.integration.getView();
        view.focus();

        // Move the cursor into the second list item.
        const secondItemStart = 1 + view.state.doc.child(0).child(0).nodeSize;

        view.dispatch(
            view.state.tr.setSelection(
                (view.state.selection as any).constructor.create(
                    view.state.doc,
                    secondItemStart + 2,
                    secondItemStart + 2
                )
            )
        );

        // User types additional words in the second item.
        view.dispatch(view.state.tr.insertText('Updated '));

        const items = container.querySelectorAll('li');

        // The two list items must remain independent.
        expect(items.length).toBe(2);
        expect(items[0].textContent).toContain('First task');
        expect(items[1].textContent).toContain('Updated Second task');

        editor.destroy();
        container.remove();
    });

    it('should preserve list item boundaries when typing into different items', () => {
        const editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [{
                    type: 'bulletList',
                    id: crypto.randomUUID(),
                    attrs: { listStyleType: 'disc' },
                    marks: [],
                    children: [
                        {
                            type: 'listItem',
                            id: crypto.randomUUID(),
                            attrs: {},
                            marks: [],
                            children: [{
                                type: 'paragraph',
                                id: crypto.randomUUID(),
                                attrs: {},
                                marks: [],
                                children: []
                            }]
                        },
                        {
                            type: 'listItem',
                            id: crypto.randomUUID(),
                            attrs: {},
                            marks: [],
                            children: [{
                                type: 'paragraph',
                                id: crypto.randomUUID(),
                                attrs: {},
                                marks: [],
                                children: []
                            }]
                        }
                    ]
                }]
            },
            extensions: [paragraphExtension, listExtension]
        });

        const container = document.createElement('div');
        document.body.appendChild(container);
        editor.mount(container);

        const view: any = editor.integration.getView();
        view.focus();

        // Type content into the first item.
        view.dispatch(view.state.tr.insertText('Design page'));

        // Move to the second list item.
        const firstItemSize = view.state.doc.child(0).child(0).nodeSize;
        const secondItemPosition = 1 + firstItemSize + 1;

        view.dispatch(
            view.state.tr.setSelection(
                (view.state.selection as any).constructor.create(
                    view.state.doc,
                    secondItemPosition,
                    secondItemPosition
                )
            )
        );

        // Type completely different content into the second item.
        view.dispatch(view.state.tr.insertText('Write tests'));

        const items = container.querySelectorAll('li');

        expect(items.length).toBe(2);
        expect(items[0].textContent).toContain('Design page');
        expect(items[1].textContent).toContain('Write tests');

        editor.destroy();
        container.remove();
    });


    it('should retain nested list structure while typing inside the nested item', () => {
        const editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [{
                    type: 'bulletList',
                    id: crypto.randomUUID(),
                    attrs: { listStyleType: 'disc' },
                    marks: [],
                    children: [{
                        type: 'listItem',
                        id: crypto.randomUUID(),
                        attrs: {},
                        marks: [],
                        children: [
                            {
                                type: 'paragraph',
                                id: crypto.randomUUID(),
                                attrs: {},
                                marks: [],
                                children: [{
                                    type: 'text',
                                    id: crypto.randomUUID(),
                                    text: 'Parent item',
                                    marks: []
                                } as TextNode]
                            },
                            {
                                type: 'bulletList',
                                id: crypto.randomUUID(),
                                attrs: { listStyleType: 'circle' },
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
                                            text: 'Nested item',
                                            marks: []
                                        } as TextNode]
                                    }]
                                }]
                            }
                        ]
                    }]
                }]
            },
            extensions: [paragraphExtension, listExtension]
        });

        const container = document.createElement('div');
        document.body.appendChild(container);
        editor.mount(container);

        const view: any = editor.integration.getView();
        view.focus();

        // Find the nested text position and place the cursor at its end.
        let nestedPosition = -1;

        view.state.doc.descendants((node: any, pos: number) => {
            if (node.isText && node.text === 'Nested item') {
                nestedPosition = pos + node.nodeSize;
                return false;
            }
            return true;
        });

        view.dispatch(
            view.state.tr.setSelection(
                (view.state.selection as any).constructor.create(
                    view.state.doc,
                    nestedPosition,
                    nestedPosition
                )
            )
        );

        // User continues typing inside the nested list item.
        view.dispatch(view.state.tr.insertText(' details'));

        // The nested list must remain nested after editing its content.
        expect(container.querySelector('ul')).not.toBeNull();
        expect(container.querySelectorAll('ul').length).toBe(2);
        expect(container.textContent).toContain('Nested item details');

        editor.destroy();
        container.remove();
    });

    it('should indent a list item after typing content and pressing Tab', () => {
        // Type content in a top-level list item.
        // Press Tab to move the item into a nested list.
        // Verify the typed content remains in the indented item.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(listItemNode(paragraphNode('Setup project')), listItemNode(paragraphNode('Run tests')))
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();
        setCursorAtForEditor(editor, container, 'Run tests', 9);

        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Tab',
            bubbles: true,
            cancelable: true
        }));

        expect(view.state.doc.textContent).toContain('Run tests');
        expect(view.state.doc.toJSON().content).toBeDefined();

        editor.destroy();
        container.remove();
    });

    it('should outdent a nested list item after pressing Shift+Tab', () => {
        // Start with a nested list item.
        // Press Shift+Tab to move it back to the parent level.
        // Verify the item content is preserved after outdenting.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(listItemNode(
                paragraphNode('Parent task'),
                bulletListNode(listItemNode(paragraphNode('Child task')))
            ))
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();
        setCursorAtForEditor(editor, container, 'Child task', 10);

        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: true,
            bubbles: true,
            cancelable: true
        }));

        expect(view.state.doc.textContent).toContain('Parent task');
        expect(view.state.doc.textContent).toContain('Child task');

        editor.destroy();
        container.remove();
    });

    it('should keep the list item content when indenting after typing a second word', () => {
        // Type an additional word into the second list item.
        // Indent that item with Tab.
        // Verify both words remain together after indentation.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(listItemNode(paragraphNode('Build project')), listItemNode(paragraphNode('Run')))
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();
        setCursorAtForEditor(editor, container, 'Run', 3);

        view.dispatch(view.state.tr.insertText(' tests'));

        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Tab',
            bubbles: true,
            cancelable: true
        }));

        expect(view.state.doc.textContent).toContain('Run tests');

        editor.destroy();
        container.remove();
    });

    it('should preserve nested list content when typing after outdenting an item', () => {
        // Outdent the nested item first.
        // Then type additional content.
        // Verify the text remains associated with the same list item.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(listItemNode(
                paragraphNode('Main task'),
                bulletListNode(listItemNode(paragraphNode('Review code')))
            ))
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();
        setCursorAtForEditor(editor, container, 'Review code', 11);

        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: true,
            bubbles: true,
            cancelable: true
        }));

        view.dispatch(view.state.tr.insertText(' carefully'));

        expect(view.state.doc.textContent).toContain('Review code carefully');

        editor.destroy();
        container.remove();
    });

    it('should indent a list item into the previous list item after moving the cursor with ArrowUp', () => {
        // Move the cursor to the previous list item using ArrowUp.
        // Then place the cursor in the target item and indent it.
        // Verify the list still contains both pieces of content.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(listItemNode(paragraphNode('Design feature')), listItemNode(paragraphNode('Implement feature')))
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();
        setCursorAtForEditor(editor, container, 'Implement feature', 17);

        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'ArrowUp',
            bubbles: true,
            cancelable: true
        }));

        setCursorAtForEditor(editor, container, 'Implement feature', 17);

        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Tab',
            bubbles: true,
            cancelable: true
        }));

        expect(view.state.doc.textContent).toContain('Design feature');
        expect(view.state.doc.textContent).toContain('Implement feature');

        editor.destroy();
        container.remove();
    });

    it('should preserve ordered list numbering when indenting a later item', () => {
        // Start with an ordered list containing multiple items.
        // Indent the second item using Tab.
        // Verify that the ordered-list content is not lost.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            orderedListNode(
                listItemNode(paragraphNode('Install dependencies')),
                listItemNode(paragraphNode('Configure project')),
                listItemNode(paragraphNode('Run application'))
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();
        setCursorAtForEditor(editor, container, 'Configure project', 17);

        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Tab',
            bubbles: true,
            cancelable: true
        }));

        expect(view.state.doc.textContent).toContain('Install dependencies');
        expect(view.state.doc.textContent).toContain('Configure project');
        expect(view.state.doc.textContent).toContain('Run application');

        editor.destroy();
        container.remove();
    });

    it('should preserve bullet list content when converting an indented item back to top level', () => {
        // Create a nested bullet item.
        // Use Shift+Tab to return it to the parent level.
        // Verify the content remains unchanged.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(listItemNode(
                paragraphNode('Documentation'),
                bulletListNode(listItemNode(paragraphNode('Update README')))
            ))
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();
        setCursorAtForEditor(editor, container, 'Update README', 12);

        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: true,
            bubbles: true,
            cancelable: true
        }));

        expect(view.state.doc.textContent).toContain('Documentation');
        expect(view.state.doc.textContent).toContain('Update README');

        editor.destroy();
        container.remove();
    });

    it('should retain text when pressing Tab multiple times on a list item', () => {
        // Indent the same list item more than once.
        // Verify that repeated indentation does not remove its text.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(listItemNode(paragraphNode('Parent')), listItemNode(paragraphNode('Nested task')))
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();
        setCursorAtForEditor(editor, container, 'Nested task', 11);

        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Tab',
            bubbles: true,
            cancelable: true
        }));

        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Tab',
            bubbles: true,
            cancelable: true
        }));

        expect(view.state.doc.textContent).toContain('Nested task');

        editor.destroy();
        container.remove();
    });

    it('should retain text when moving a nested list item back using Shift+Tab twice', () => {
        // Start with a deeply nested list item.
        // Outdent it twice using Shift+Tab.
        // Verify the item text survives both structural changes.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(listItemNode(
                paragraphNode('Level one'),
                bulletListNode(listItemNode(
                    paragraphNode('Level two'),
                    bulletListNode(listItemNode(paragraphNode('Level three task')))
                ))
            ))
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();
        setCursorAtForEditor(editor, container, 'Level three task', 16);

        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: true,
            bubbles: true,
            cancelable: true
        }));

        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: true,
            bubbles: true,
            cancelable: true
        }));

        expect(view.state.doc.textContent).toContain('Level three task');

        editor.destroy();
        container.remove();
    });

    it('should split a list item when typing content and pressing Enter in the middle', () => {
        // Start with one list item containing existing text.
        // Move the cursor into the middle of the text and press Enter.
        // The content after the cursor should move into a new list item.
        const editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [{
                    type: 'bulletList',
                    id: crypto.randomUUID(),
                    attrs: { listStyleType: 'disc' },
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
                                text: 'Install project packages',
                                marks: []
                            } as TextNode]
                        }]
                    }]
                }]
            },
            extensions: [paragraphExtension, listExtension, listKeymapExtension]
        });

        const container = document.createElement('div');
        document.body.appendChild(container);
        editor.mount(container);

        const view: any = editor.integration.getView();
        view.focus();

        // Place the cursor after "Install".
        const textPosition = 1 + 1 + 1;
        view.dispatch(
            view.state.tr.setSelection(
                (view.state.selection as any).constructor.create(
                    view.state.doc,
                    textPosition + 7,
                    textPosition + 7
                )
            )
        );

        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            bubbles: true,
            cancelable: true
        }));

        const items = container.querySelectorAll('li');

        expect(items.length).toBe(2);
        expect(items[0].textContent).toContain('Install');
        expect(items[1].textContent).toContain('project packages');

        editor.destroy();
        container.remove();
    });



    it('should continue in a new list item after pressing Enter and typing a word', () => {
        // Press Enter at the end of the first list item.
        // Type new content into the newly created item.
        // Both items should remain separate list items.
        const editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [{
                    type: 'bulletList',
                    id: crypto.randomUUID(),
                    attrs: { listStyleType: 'disc' },
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
                                text: 'Install dependencies',
                                marks: []
                            } as TextNode]
                        }]
                    }]
                }]
            },
            extensions: [paragraphExtension, listExtension, listKeymapExtension]
        });

        const container = document.createElement('div');
        document.body.appendChild(container);
        editor.mount(container);

        const view: any = editor.integration.getView();
        view.focus();

        setCursorAtForEditor(editor, container, 'Install dependencies', 'Install dependencies'.length);

        // Create the next list item.
        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            bubbles: true,
            cancelable: true
        }));

        // Type into the newly created list item.
        view.dispatch(view.state.tr.insertText('Run tests'));

        const items = container.querySelectorAll('li');

        expect(items.length).toBe(2);
        expect(items[0].textContent).toContain('Install dependencies');
        expect(items[1].textContent).toContain('Run tests');

        editor.destroy();
        container.remove();
    });

    it('should split an ordered list item when pressing Enter in the middle of its text', () => {
        // Place the cursor inside an ordered list item.
        // Press Enter to split the item into two ordered list items.
        // Both portions of text should be preserved.
        const editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [{
                    type: 'orderedList',
                    id: crypto.randomUUID(),
                    attrs: { order: 1, listStyleType: 'decimal' },
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
                                text: 'Configure application settings',
                                marks: []
                            } as TextNode]
                        }]
                    }]
                }]
            },
            extensions: [paragraphExtension, listExtension, listKeymapExtension]
        });

        const container = document.createElement('div');
        document.body.appendChild(container);
        editor.mount(container);

        const view: any = editor.integration.getView();
        view.focus();

        const textPosition = view.state.doc.content.size - 2 - 12;

        view.dispatch(
            view.state.tr.setSelection(
                (view.state.selection as any).constructor.create(
                    view.state.doc,
                    textPosition,
                    textPosition
                )
            )
        );

        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            bubbles: true,
            cancelable: true
        }));

        const items = container.querySelectorAll('ol > li');

        expect(items.length).toBe(2);
        expect(container.textContent).toContain('Configure application');
        expect(container.textContent).toContain('settings');

        editor.destroy();
        container.remove();
    });

    it('should create another ordered list item after pressing Enter at the end', () => {
        // Move to the end of the ordered list item.
        // Press Enter and verify that a second ordered item is created.
        const editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [{
                    type: 'orderedList',
                    id: crypto.randomUUID(),
                    attrs: { order: 1, listStyleType: 'decimal' },
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
                                text: 'Build application',
                                marks: []
                            } as TextNode]
                        }]
                    }]
                }]
            },
            extensions: [paragraphExtension, listExtension, listKeymapExtension]
        });

        const container = document.createElement('div');
        document.body.appendChild(container);
        editor.mount(container);

        const view: any = editor.integration.getView();
        view.focus();

        setCursorAtForEditor(editor, container, 'Build application', 'Build application'.length);

        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            bubbles: true,
            cancelable: true
        }));

        const orderedList = container.querySelector('ol');

        expect(orderedList).not.toBeNull();
        expect(orderedList!.querySelectorAll(':scope > li').length).toBe(2);

        editor.destroy();
        container.remove();
    });

    it('should keep the first ordered list item number when adding a new item', () => {
        // Create an ordered list with a custom starting number.
        // Press Enter to create another item.
        // The ordered list should retain its numbering configuration.
        const editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [{
                    type: 'orderedList',
                    id: crypto.randomUUID(),
                    attrs: { order: 5, listStyleType: 'decimal' },
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
                                text: 'Release build',
                                marks: []
                            } as TextNode]
                        }]
                    }]
                }]
            },
            extensions: [paragraphExtension, listExtension, listKeymapExtension]
        });

        const container = document.createElement('div');
        document.body.appendChild(container);
        editor.mount(container);

        const view: any = editor.integration.getView();
        view.focus();

        setCursorAtForEditor(editor, container, 'Release build', 'Release build'.length);

        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            bubbles: true,
            cancelable: true
        }));

        const orderedList = container.querySelector('ol');

        expect(orderedList).not.toBeNull();
        expect(orderedList!.querySelectorAll(':scope > li').length).toBe(2);

        editor.destroy();
        container.remove();
    });

    it('should exit the list when pressing Enter on an empty list item', () => {
        // Start with an empty list item.
        // Press Enter again, which should exit the list.
        // Verify that a paragraph is created outside the list.
        const editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [{
                    type: 'bulletList',
                    id: crypto.randomUUID(),
                    attrs: { listStyleType: 'disc' },
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
                            children: []
                        }]
                    }]
                }]
            },
            extensions: [paragraphExtension, listExtension, listKeymapExtension]
        });

        const container = document.createElement('div');
        document.body.appendChild(container);
        editor.mount(container);

        const view: any = editor.integration.getView();
        view.focus();

        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            bubbles: true,
            cancelable: true
        }));

        expect(container.querySelector('ul')).toBeNull();
        expect(container.querySelector('p')).not.toBeNull();

        editor.destroy();
        container.remove();
    });

    it('should preserve the remaining list items when pressing Enter on an empty item', () => {
        // Keep one populated item and one empty item in the list.
        // Press Enter inside the empty item.
        // The existing populated list item must remain unchanged.
        const editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [{
                    type: 'bulletList',
                    id: crypto.randomUUID(),
                    attrs: { listStyleType: 'disc' },
                    marks: [],
                    children: [
                        {
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
                                    text: 'Existing task',
                                    marks: []
                                } as TextNode]
                            }]
                        },
                        {
                            type: 'listItem',
                            id: crypto.randomUUID(),
                            attrs: {},
                            marks: [],
                            children: [{
                                type: 'paragraph',
                                id: crypto.randomUUID(),
                                attrs: {},
                                marks: [],
                                children: []
                            }]
                        }
                    ]
                }]
            },
            extensions: [paragraphExtension, listExtension, listKeymapExtension]
        });

        const container = document.createElement('div');
        document.body.appendChild(container);
        editor.mount(container);

        const view: any = editor.integration.getView();
        view.focus();

        const firstItemSize = view.state.doc.child(0).child(0).nodeSize;
        const emptyItemPosition = 1 + firstItemSize + 2;

        view.dispatch(
            view.state.tr.setSelection(
                (view.state.selection as any).constructor.create(
                    view.state.doc,
                    emptyItemPosition,
                    emptyItemPosition
                )
            )
        );

        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            bubbles: true,
            cancelable: true
        }));

        expect(container.textContent).toContain('Existing task');

        editor.destroy();
        container.remove();
    });

    it('should create a new list item after pressing Enter and typing multiple words', () => {
        // Press Enter at the end of the existing list item.
        // Type multiple words into the newly created item.
        // Verify that the words stay inside the new list item.
        const editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [{
                    type: 'bulletList',
                    id: crypto.randomUUID(),
                    attrs: { listStyleType: 'disc' },
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
                                text: 'Prepare deployment',
                                marks: []
                            } as TextNode]
                        }]
                    }]
                }]
            },
            extensions: [paragraphExtension, listExtension, listKeymapExtension]
        });

        const container = document.createElement('div');
        document.body.appendChild(container);
        editor.mount(container);

        const view: any = editor.integration.getView();
        view.focus();

        setCursorAtForEditor(editor, container, 'Prepare deployment', 'Prepare deployment'.length);

        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            bubbles: true,
            cancelable: true
        }));

        view.dispatch(
            view.state.tr.insertText('Run deployment tests')
        );

        const items = container.querySelectorAll('li');

        expect(items.length).toBe(2);
        expect(items[0].textContent).toContain('Prepare deployment');
        expect(items[1].textContent).toContain('Run deployment tests');

        editor.destroy();
        container.remove();
    });

    it('should create a new empty list item when pressing Enter at the end of a list item', () => {
        const editor = HeadlessEditor.create({
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
                                marks: [],
                                children: [],
                                text: 'Create component'
                            } as TextNode]
                        }]
                    }]
                }]
            },
            extensions: [
                paragraphExtension,
                listExtension,
                listKeymapExtension
            ]
        });

        const container = document.createElement('div');
        document.body.appendChild(container);
        editor.mount(container);

        const view: any = editor.integration.getView();

        // Place the cursor at the end of the existing list item.
        setCursorAtForEditor(
            editor,
            container,
            'Create component',
            'Create component'.length
        );

        // Focus the editor before simulating the keyboard interaction.
        view.focus();

        // Press Enter at the end of the list item.
        const enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true
        });

        view.dom.dispatchEvent(enterEvent);

        // A new sibling list item should be created.
        const listItems = container.querySelectorAll('li');

        expect(listItems.length).toBe(2);

        // The first item should retain its content.
        expect(listItems[0].textContent).toBe('Create component');

        // The second item should be empty.
        expect(listItems[1].textContent).toBe('');
    });

    it('should insert a word at the beginning of a bullet list item', () => {
        // Place the cursor at the beginning of the existing list item.
        // Type a word and verify it is inserted without breaking the list item.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(
                listItemNode(paragraphNode('project setup'))
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(editor, container, 'project setup', 0);

        view.dispatch(view.state.tr.insertText('Initial '));

        const items = container.querySelectorAll('li');

        expect(items.length).toBe(1);
        expect(items[0].textContent).toBe('Initial project setup');

        editor.destroy();
        container.remove();
    });


    it('should insert a word in the middle of a bullet list item', () => {
        // Place the cursor between existing words.
        // Type additional content and verify the list structure remains unchanged.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(
                listItemNode(paragraphNode('Build application'))
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(editor, container, 'Build application', 5);

        view.dispatch(view.state.tr.insertText(' the'));

        const items = container.querySelectorAll('li');

        expect(items.length).toBe(1);
        expect(items[0].textContent).toBe('Build the application');

        editor.destroy();
        container.remove();
    });


    it('should delete a word from a bullet list item', () => {
        // Select the word "temporary" and delete it.
        // Verify that only the text changes and the list item remains intact.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(
                listItemNode(paragraphNode('Remove temporary file'))
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(editor, container, 'Remove temporary file', 7);

        const from = view.state.selection.from;
        const to = from + 'temporary'.length;

        view.dispatch(
            view.state.tr.delete(from, to)
        );

        const items = container.querySelectorAll('li');

        expect(items.length).toBe(1);
        expect(items[0].textContent).toContain('Remove ');
        expect(items[0].textContent).toContain(' file');

        editor.destroy();
        container.remove();
    });


    it('should delete text from the end of an ordered list item', () => {
        // Place the cursor at the end of an ordered list item.
        // Delete the final word and verify the ordered list is preserved.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            orderedListNode(
                listItemNode(paragraphNode('Run application now'))
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(
            editor,
            container,
            'Run application now',
            'Run application now'.length
        );

        const from = view.state.selection.from - 4;
        const to = view.state.selection.from;

        view.dispatch(
            view.state.tr.delete(from, to)
        );

        const orderedList = container.querySelector('ol');

        expect(orderedList).not.toBeNull();
        expect(orderedList!.querySelectorAll(':scope > li').length).toBe(1);
        expect(orderedList!.textContent).toContain('Run application');

        editor.destroy();
        container.remove();
    });


    it('should replace selected text with a new word in a bullet list item', () => {
        // Select an existing word and replace it with another word.
        // Verify the replacement stays inside the same list item.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(
                listItemNode(paragraphNode('Build website'))
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(editor, container, 'Build website', 0);

        const from = view.state.selection.from;
        const to = from + 'Build'.length;

        view.dispatch(
            view.state.tr
                .setSelection(
                    (view.state.selection as any).constructor.create(
                        view.state.doc,
                        from,
                        to
                    )
                )
                .insertText('Create')
        );

        const items = container.querySelectorAll('li');

        expect(items.length).toBe(1);
        expect(items[0].textContent).toBe('Create website');

        editor.destroy();
        container.remove();
    });


    it('should replace text in the middle of an ordered list item', () => {
        // Replace a word in the middle of an ordered list item.
        // Verify the ordered list and its item remain unchanged structurally.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            orderedListNode(
                listItemNode(paragraphNode('Configure test environment'))
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(
            editor,
            container,
            'Configure test environment',
            10
        );

        const from = view.state.selection.from;
        const to = from + 'test'.length;

        view.dispatch(
            view.state.tr
                .setSelection(
                    (view.state.selection as any).constructor.create(
                        view.state.doc,
                        from,
                        to
                    )
                )
                .insertText('build')
        );

        const orderedList = container.querySelector('ol');

        expect(orderedList).not.toBeNull();
        expect(orderedList!.querySelectorAll(':scope > li').length).toBe(1);
        expect(orderedList!.textContent).toContain('Configure build environment');

        editor.destroy();
        container.remove();
    });


    it('should continue typing in the second bullet list item after editing the first item', () => {
        // Type additional content into the first item.
        // Move to the second item and type different content.
        // Verify both list items remain independent.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(
                listItemNode(paragraphNode('Design page')),
                listItemNode(paragraphNode('Write tests'))
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(editor, container, 'Design page', 'Design page'.length);
        view.dispatch(view.state.tr.insertText(' today'));

        setCursorAtForEditor(editor, container, 'Write tests', 'Write tests'.length);
        view.dispatch(view.state.tr.insertText(' now'));

        const items = container.querySelectorAll('li');

        expect(items.length).toBe(2);
        expect(items[0].textContent).toBe('Design page today');
        expect(items[1].textContent).toBe('Write tests now');

        editor.destroy();
        container.remove();
    });


    it('should preserve nested list structure when inserting text into the middle of a nested item', () => {
        // Place the cursor inside the nested item.
        // Insert a word and verify the nested list remains nested.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(
                listItemNode(
                    paragraphNode('Main task'),
                    bulletListNode(
                        listItemNode(paragraphNode('Review code'))
                    )
                )
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(editor, container, 'Review code', 6);

        view.dispatch(view.state.tr.insertText(' the'));

        const lists = container.querySelectorAll('ul');
        const nestedItem = container.querySelectorAll('ul ul > li');

        expect(lists.length).toBe(2);
        expect(nestedItem.length).toBe(1);
        expect(nestedItem[0].textContent).toBe('Review the code');

        editor.destroy();
        container.remove();
    });


    it('should preserve ordered list numbering after deleting text from an item', () => {
        // Delete text from the second item of an ordered list.
        // Verify that the list still contains all items and numbering is preserved.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            orderedListNode(
                listItemNode(paragraphNode('Install dependencies')),
                listItemNode(paragraphNode('Configure application')),
                listItemNode(paragraphNode('Run application'))
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(
            editor,
            container,
            'Configure application',
            'Configure application'.length
        );

        const from = view.state.selection.from - 12;
        const to = view.state.selection.from;

        view.dispatch(
            view.state.tr.delete(from, to)
        );

        const orderedList = container.querySelector('ol');
        const items = container.querySelectorAll('ol > li');

        expect(orderedList).not.toBeNull();
        expect(items.length).toBe(3);
        expect(items[0].textContent).toContain('Install dependencies');
        expect(items[1].textContent).toContain('Configure');
        expect(items[2].textContent).toContain('Run application');

        editor.destroy();
        container.remove();
    });


    it('should type new content after deleting text from a bullet list item', () => {
        // Delete the final word from an item.
        // Type a replacement word and verify the item remains a single list item.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(
                listItemNode(paragraphNode('Deploy service today'))
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(
            editor,
            container,
            'Deploy service today',
            'Deploy service today'.length
        );

        const from = view.state.selection.from - 'today'.length;
        const to = view.state.selection.from;

        view.dispatch(
            view.state.tr.delete(from, to)
        );

        view.dispatch(
            view.state.tr.insertText('tomorrow')
        );

        const items = container.querySelectorAll('li');

        expect(items.length).toBe(1);
        expect(items[0].textContent).toBe('Deploy service tomorrow');

        editor.destroy();
        container.remove();
    });

    it('should insert text before an existing word in an ordered list item', () => {
        // Place the cursor before the existing word.
        // Type new text and verify the ordered list item remains intact.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            orderedListNode(
                listItemNode(paragraphNode('application setup'))
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(editor, container, 'application setup', 0);

        view.dispatch(view.state.tr.insertText('Initial '));

        const items = container.querySelectorAll('ol > li');

        expect(items.length).toBe(1);
        expect(items[0].textContent).toBe('Initial application setup');

        editor.destroy();
        container.remove();
    });


    it('should insert text between two words in an ordered list item', () => {
        // Place the cursor between the existing words.
        // Type additional text without changing the list structure.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            orderedListNode(
                listItemNode(paragraphNode('Install packages'))
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(editor, container, 'Install packages', 7);

        view.dispatch(view.state.tr.insertText(' required'));

        const items = container.querySelectorAll('ol > li');

        expect(items.length).toBe(1);
        expect(items[0].textContent).toBe('Install required packages');

        editor.destroy();
        container.remove();
    });


    it('should delete the first word from a bullet list item and preserve the item', () => {
        // Select the first word and delete it.
        // Verify that the remaining text stays inside the same bullet item.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(
                listItemNode(paragraphNode('Remove old files'))
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(editor, container, 'Remove old files', 0);

        const from = view.state.selection.from;
        const to = from + 'Remove'.length + 1;

        view.dispatch(view.state.tr.delete(from, to));

        const items = container.querySelectorAll('ul > li');

        expect(items.length).toBe(1);
        expect(items[0].textContent).toBe('old files');

        editor.destroy();
        container.remove();
    });


    it('should delete text from the middle of a nested list item', () => {
        // Delete a word from a nested list item.
        // Verify the nested item and its parent list remain unchanged structurally.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(
                listItemNode(
                    paragraphNode('Main task'),
                    bulletListNode(
                        listItemNode(paragraphNode('Review generated code'))
                    )
                )
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(
            editor,
            container,
            'Review generated code',
            7
        );

        const from = view.state.selection.from;
        const to = from + 'generated'.length + 1;

        view.dispatch(view.state.tr.delete(from, to));

        const nestedItems = container.querySelectorAll('ul ul > li');

        expect(nestedItems.length).toBe(1);
        expect(nestedItems[0].textContent).toBe('Review code');
        expect(container.querySelectorAll('ul').length).toBe(2);

        editor.destroy();
        container.remove();
    });


    it('should replace the complete text of a bullet list item with a new word', () => {
        // Select the complete list item text.
        // Replace it with new content and verify the list item is preserved.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(
                listItemNode(paragraphNode('Old task'))
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(editor, container, 'Old task', 0);

        const from = view.state.selection.from;
        const to = from + 'Old task'.length;

        view.dispatch(
            view.state.tr
                .setSelection(
                    (view.state.selection as any).constructor.create(
                        view.state.doc,
                        from,
                        to
                    )
                )
                .insertText('New task')
        );

        const items = container.querySelectorAll('ul > li');

        expect(items.length).toBe(1);
        expect(items[0].textContent).toBe('New task');

        editor.destroy();
        container.remove();
    });


    it('should replace the complete text of an ordered list item with multiple words', () => {
        // Replace the existing ordered-list item content with multiple words.
        // Verify that the ordered list still contains exactly one item.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            orderedListNode(
                listItemNode(paragraphNode('Old configuration'))
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(
            editor,
            container,
            'Old configuration',
            0
        );

        const from = view.state.selection.from;
        const to = from + 'Old configuration'.length;

        view.dispatch(
            view.state.tr
                .setSelection(
                    (view.state.selection as any).constructor.create(
                        view.state.doc,
                        from,
                        to
                    )
                )
                .insertText('New production configuration')
        );

        const orderedList = container.querySelector('ol');
        const items = container.querySelectorAll('ol > li');

        expect(orderedList).not.toBeNull();
        expect(items.length).toBe(1);
        expect(items[0].textContent).toBe('New production configuration');

        editor.destroy();
        container.remove();
    });


    it('should preserve multiple paragraphs inside a list item while typing', () => {
        // Start with a list item containing multiple paragraphs.
        // Type into the second paragraph and verify both paragraphs remain in the same item.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(
                listItemNode(
                    paragraphNode('Install dependencies'),
                    paragraphNode('Run tests')
                )
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(editor, container, 'Run tests', 'Run tests'.length);

        view.dispatch(view.state.tr.insertText(' successfully'));

        const items = container.querySelectorAll('ul > li');
        const paragraphs = container.querySelectorAll('li > p');

        expect(items.length).toBe(1);
        expect(paragraphs.length).toBe(2);
        expect(items[0].textContent).toContain('Install dependencies');
        expect(items[0].textContent).toContain('Run tests successfully');

        editor.destroy();
        container.remove();
    });


    it('should replace text in the second paragraph of a list item', () => {
        // Select text from the second paragraph.
        // Replace it while keeping both paragraphs inside the same list item.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(
                listItemNode(
                    paragraphNode('Prepare deployment'),
                    paragraphNode('Run deployment tests')
                )
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        let from: number = -1;
        let to: number = -1;
        view.state.doc.descendants((node: any, position: number): boolean => {
            if (node.isText && node.text === 'Run deployment tests') {
                from = position + 'Run '.length;
                to = from + 'deployment'.length;
                return false;
            }
            return true;
        });
        expect(from).toBeGreaterThan(0);

        view.dispatch(
            view.state.tr
                .setSelection(
                    (view.state.selection as any).constructor.create(
                        view.state.doc,
                        from,
                        to
                    )
                )
                .insertText('unit')
        );

        const items = container.querySelectorAll('ul > li');
        const paragraphs = container.querySelectorAll('li > p');

        expect(items.length).toBe(1);
        expect(paragraphs.length).toBe(2);
        expect(items[0].textContent).toContain('Prepare deployment');
        expect(items[0].textContent).toContain('Run unit tests');

        editor.destroy();
        container.remove();
    });


    it('should type into the first paragraph without changing a second paragraph', () => {
        // Type additional words into the first paragraph.
        // Verify that the second paragraph remains unchanged.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            orderedListNode(
                listItemNode(
                    paragraphNode('Build application'),
                    paragraphNode('Run application')
                )
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(
            editor,
            container,
            'Build application',
            'Build application'.length
        );

        view.dispatch(view.state.tr.insertText(' successfully'));

        const items = container.querySelectorAll('ol > li');
        const paragraphs = container.querySelectorAll('li > p');

        expect(items.length).toBe(1);
        expect(paragraphs.length).toBe(2);
        expect(paragraphs[0].textContent).toBe('Build application successfully');
        expect(paragraphs[1].textContent).toBe('Run application');

        editor.destroy();
        container.remove();
    });


    it('should preserve list structure when replacing text across a list item selection', () => {
        // Select text spanning the content of a list item.
        // Replace it with new words and verify the item remains part of the list.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(
                listItemNode(paragraphNode('Prepare release build'))
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(
            editor,
            container,
            'Prepare release build',
            0
        );

        const from = view.state.selection.from;
        const to = from + 'Prepare release'.length;

        view.dispatch(
            view.state.tr
                .setSelection(
                    (view.state.selection as any).constructor.create(
                        view.state.doc,
                        from,
                        to
                    )
                )
                .insertText('Finalize')
        );

        const items = container.querySelectorAll('ul > li');

        expect(items.length).toBe(1);
        expect(items[0].textContent).toContain('Finalize build');

        editor.destroy();
        container.remove();
    });

    it('should preserve the second paragraph when typing at the end of the first paragraph', () => {
        // Verify that typing into the first paragraph does not modify
        // the second paragraph of the same list item.
        const editor: HeadlessEditor = createListEditor([
            bulletListNode(
                listItemNode(
                    paragraphNode('Prepare'),
                    paragraphNode('Run tests')
                )
            )
        ]);

        const container: HTMLElement = document.createElement('div');
        document.body.appendChild(container);
        editor.mount(container);

        const view: any = editor.integration.getView();

        setCursorAtForEditor(editor, container, 'Prepare', 'Prepare'.length);

        view.dispatch(
            view.state.tr.insertText(' deployment')
        );

        const paragraphs: NodeListOf<HTMLParagraphElement> =
            container.querySelectorAll('li > p');

        expect(paragraphs.length).toBe(2);
        expect(paragraphs[0].textContent).toBe('Prepare deployment');
        expect(paragraphs[1].textContent).toBe('Run tests');
    });

    it('should keep an empty list item when all of its text is deleted', () => {
        // Verify that deleting the text does not remove the list item itself.
        const editor: HeadlessEditor = createListEditor([
            bulletListNode(
                listItemNode(
                    paragraphNode('Remove me')
                )
            )
        ]);

        const container: HTMLElement = document.createElement('div');
        document.body.appendChild(container);
        editor.mount(container);

        const view: any = editor.integration.getView();

        setCursorAtForEditor(editor, container, 'Remove me', 0);

        const from: number = view.state.selection.from;
        const to: number = from + 'Remove me'.length;

        view.dispatch(
            view.state.tr
                .setSelection(
                    view.state.selection.constructor.create(
                        view.state.doc,
                        from,
                        to
                    )
                )
                .deleteSelection()
        );

        const listItems: NodeListOf<HTMLLIElement> =
            container.querySelectorAll('ul > li');

        expect(listItems.length).toBe(1);
        expect(listItems[0].textContent).toBe('');
    });

    it('should allow typing into a list item after deleting all its text', () => {
        // Verify that an empty list item remains editable after its
        // previous content has been deleted.
        const editor: HeadlessEditor = createListEditor([
            bulletListNode(
                listItemNode(
                    paragraphNode('Old content')
                )
            )
        ]);

        const container: HTMLElement = document.createElement('div');
        document.body.appendChild(container);
        editor.mount(container);

        const view: any = editor.integration.getView();

        setCursorAtForEditor(editor, container, 'Old content', 0);

        const from: number = view.state.selection.from;
        const to: number = from + 'Old content'.length;

        view.dispatch(
            view.state.tr
                .setSelection(
                    view.state.selection.constructor.create(
                        view.state.doc,
                        from,
                        to
                    )
                )
                .deleteSelection()
        );

        view.dispatch(
            view.state.tr.insertText('New content')
        );

        expect(container.innerHTML).toContain('New content');
        expect(container.innerHTML).not.toContain('Old content');
    });

    it('should replace only the first character of a bullet list item', () => {
        // Verify that a small text replacement changes only the selected
        // character and preserves the remaining content.
        const editor: HeadlessEditor = createListEditor([
            bulletListNode(
                listItemNode(
                    paragraphNode('Build application')
                )
            )
        ]);

        const container: HTMLElement = document.createElement('div');
        document.body.appendChild(container);
        editor.mount(container);

        const view: any = editor.integration.getView();

        setCursorAtForEditor(editor, container, 'Build application', 0);

        const from: number = view.state.selection.from;
        const to: number = from + 1;

        view.dispatch(
            view.state.tr
                .setSelection(
                    view.state.selection.constructor.create(
                        view.state.doc,
                        from,
                        to
                    )
                )
                .insertText('Test')
        );

        expect(container.innerHTML).toContain('Testuild application');
        expect(container.innerHTML).not.toContain('Build application');
    });

    it('should replace only the last word of an ordered list item', () => {
        // Verify that replacing the final word does not affect the
        // preceding words or the ordered list structure.
        const editor: HeadlessEditor = createListEditor([
            orderedListNode(
                listItemNode(
                    paragraphNode('Build production')
                )
            )
        ]);

        const container: HTMLElement = document.createElement('div');
        document.body.appendChild(container);
        editor.mount(container);

        const view: any = editor.integration.getView();

        setCursorAtForEditor(editor, container, 'Build production', 'Build '.length);

        const from: number = view.state.selection.from;
        const to: number = from + 'production'.length;

        view.dispatch(
            view.state.tr
                .setSelection(
                    view.state.selection.constructor.create(
                        view.state.doc,
                        from,
                        to
                    )
                )
                .insertText('release')
        );

        expect(container.innerHTML).toContain('Build release');
        expect(container.innerHTML).not.toContain('Build production');
        expect(container.querySelectorAll('ol > li').length).toBe(1);
    });

    it('should type multiple words at the beginning of a nested ordered list item', () => {
        // Verify that inserting content at the beginning of a nested item
        // preserves its nesting and existing content.
        const editor: HeadlessEditor = createListEditor([
            bulletListNode(
                listItemNode(
                    paragraphNode('Parent'),
                    orderedListNode(
                        listItemNode(
                            paragraphNode('child task')
                        )
                    )
                )
            )
        ]);

        const container: HTMLElement = document.createElement('div');
        document.body.appendChild(container);
        editor.mount(container);

        const view: any = editor.integration.getView();

        setCursorAtForEditor(editor, container, 'child task', 0);

        view.dispatch(
            view.state.tr.insertText('Complete '));

        view.dispatch(
            view.state.tr.insertText('important '));

        const nestedItem: HTMLElement | null =
            container.querySelector('li ol > li');

        expect(nestedItem).not.toBeNull();
        expect(nestedItem!.textContent).toContain('Complete important child task');
    });

    it('should preserve a nested ordered list while typing in its item', () => {
        // Verify that editing text inside a nested ordered item does not
        // flatten or remove the nested ordered list.
        const editor: HeadlessEditor = createListEditor([
            bulletListNode(
                listItemNode(
                    paragraphNode('Main task'),
                    orderedListNode(
                        listItemNode(
                            paragraphNode('Install package')
                        ),
                        listItemNode(
                            paragraphNode('Run tests')
                        )
                    )
                )
            )
        ]);

        const container: HTMLElement = document.createElement('div');
        document.body.appendChild(container);
        editor.mount(container);

        const view: any = editor.integration.getView();

        setCursorAtForEditor(editor, container, 'Install package', 'Install package'.length);

        view.dispatch(
            view.state.tr.insertText(' now')
        );

        expect(container.innerHTML).toContain('Install package now');
        expect(container.innerHTML).toContain('Run tests');
        expect(container.querySelectorAll('li ol > li').length).toBe(2);
    });

    it('should delete text from a parent list item while preserving its nested list', () => {
        // Verify that deleting parent content does not delete the nested
        // child list.
        const editor: HeadlessEditor = createListEditor([
            bulletListNode(
                listItemNode(
                    paragraphNode('Parent content'),
                    bulletListNode(
                        listItemNode(
                            paragraphNode('Child content')
                        )
                    )
                )
            )
        ]);

        const container: HTMLElement = document.createElement('div');
        document.body.appendChild(container);
        editor.mount(container);

        const view: any = editor.integration.getView();

        setCursorAtForEditor(editor, container, 'Parent content', 0);

        const from: number = view.state.selection.from;
        const to: number = from + 'Parent content'.length;

        view.dispatch(
            view.state.tr
                .setSelection(
                    view.state.selection.constructor.create(
                        view.state.doc,
                        from,
                        to
                    )
                )
                .deleteSelection()
        );

        expect(container.innerHTML).toContain('Child content');
        expect(container.querySelectorAll('li ul > li').length).toBe(1);
    });

    it('should type into a parent list item while preserving its nested list', () => {
        // Verify that typing new parent content does not modify the
        // nested child list.
        const editor: HeadlessEditor = createListEditor([
            bulletListNode(
                listItemNode(
                    paragraphNode('Parent'),
                    bulletListNode(
                        listItemNode(
                            paragraphNode('Child')
                        )
                    )
                )
            )
        ]);

        const container: HTMLElement = document.createElement('div');
        document.body.appendChild(container);
        editor.mount(container);

        const view: any = editor.integration.getView();

        setCursorAtForEditor(editor, container, 'Parent', 'Parent'.length);

        view.dispatch(
            view.state.tr.insertText(' updated')
        );

        expect(container.innerHTML).toContain('Parent updated');
        expect(container.innerHTML).toContain('Child');
        expect(container.querySelectorAll('li ul > li').length).toBe(1);
    });

    it('should preserve other ordered list items when editing one item', () => {
        // Verify that modifying one ordered list item does not change
        // the content or boundaries of its sibling items.
        const editor: HeadlessEditor = createListEditor([
            orderedListNode(
                listItemNode(
                    paragraphNode('Build application')
                ),
                listItemNode(
                    paragraphNode('Run tests')
                ),
                listItemNode(
                    paragraphNode('Deploy application')
                )
            )
        ]);

        const container: HTMLElement = document.createElement('div');
        document.body.appendChild(container);
        editor.mount(container);

        const view: any = editor.integration.getView();

        setCursorAtForEditor(editor, container, 'Run tests', 'Run tests'.length);

        view.dispatch(
            view.state.tr.insertText(' successfully')
        );

        const items: NodeListOf<HTMLLIElement> =
            container.querySelectorAll('ol > li');

        expect(items.length).toBe(3);
        expect(items[0].textContent).toBe('Build application');
        expect(items[1].textContent).toBe('Run tests successfully');
        expect(items[2].textContent).toBe('Deploy application');
    });

    it('should preserve text when moving a nested list item back using Shift+Tab twice', () => {
        // Start with a deeply nested list item.
        // Outdent it twice and verify that the text is preserved.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(
                listItemNode(
                    paragraphNode('Parent'),
                    bulletListNode(
                        listItemNode(
                            paragraphNode('Child'),
                            bulletListNode(
                                listItemNode(
                                    paragraphNode('Deep child')
                                )
                            )
                        )
                    )
                )
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(editor, container, 'Deep child', 10);

        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: true,
            bubbles: true,
            cancelable: true
        }));

        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: true,
            bubbles: true,
            cancelable: true
        }));

        expect(view.state.doc.textContent).toContain('Parent');
        expect(view.state.doc.textContent).toContain('Child');
        expect(view.state.doc.textContent).toContain('Deep child');

        editor.destroy();
        container.remove();
    });

    it('should preserve list structure when editing text after selecting part of an item', () => {
        // Select part of a list item, replace it with new words,
        // and verify that the list structure remains unchanged.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(
                listItemNode(
                    paragraphNode('Build application')
                )
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(editor, container, 'Build application', 0);

        const from: number = view.state.selection.from;
        const to: number = from + 'Build'.length;

        view.dispatch(
            view.state.tr
                .setSelection(
                    (view.state.selection as any).constructor.create(
                        view.state.doc,
                        from,
                        to
                    )
                )
                .insertText('Test')
        );

        expect(view.state.doc.textContent).toContain('Test application');
        expect(container.querySelectorAll('li').length).toBe(1);

        editor.destroy();
        container.remove();
    });

    it('should preserve multiple list items when deleting content from one item', () => {
        // Delete the text from the first item and verify that the
        // second list item remains unchanged.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(
                listItemNode(paragraphNode('First task')),
                listItemNode(paragraphNode('Second task'))
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(editor, container, 'First task', 0);

        const from: number = view.state.selection.from;
        const to: number = from + 'First task'.length;

        view.dispatch(
            view.state.tr
                .setSelection(
                    (view.state.selection as any).constructor.create(
                        view.state.doc,
                        from,
                        to
                    )
                )
                .deleteSelection()
        );

        const items = container.querySelectorAll('li');

        expect(items.length).toBe(2);
        expect(items[0].textContent).toBe('');
        expect(items[1].textContent).toBe('Second task');

        editor.destroy();
        container.remove();
    });

    it('should preserve nested list content when deleting parent text', () => {
        // Delete only the parent text and verify that the nested
        // list and its content remain available.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(
                listItemNode(
                    paragraphNode('Parent task'),
                    bulletListNode(
                        listItemNode(
                            paragraphNode('Child task')
                        )
                    )
                )
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(editor, container, 'Parent task', 0);

        const from: number = view.state.selection.from;
        const to: number = from + 'Parent task'.length;

        view.dispatch(
            view.state.tr
                .setSelection(
                    (view.state.selection as any).constructor.create(
                        view.state.doc,
                        from,
                        to
                    )
                )
                .deleteSelection()
        );

        expect(view.state.doc.textContent).toContain('Child task');
        expect(container.querySelectorAll('li ul > li').length).toBe(1);

        editor.destroy();
        container.remove();
    });

    it('should append text to an ordered list item with a custom starting number', () => {
        // Verify that editing an ordered list item preserves its
        // custom list configuration.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [{
                    type: 'orderedList',
                    id: crypto.randomUUID(),
                    attrs: {
                        order: 5,
                        listStyleType: 'decimal'
                    },
                    marks: [],
                    children: [
                        listItemNode(
                            paragraphNode('Release build')
                        )
                    ]
                }]
            },
            extensions: [paragraphExtension, listExtension, listKeymapExtension]
        });

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(
            editor,
            container,
            'Release build',
            'Release build'.length
        );

        view.dispatch(
            view.state.tr.insertText(' ready')
        );

        expect(view.state.doc.textContent).toContain('Release build ready');
        expect(container.querySelector('ol')).not.toBeNull();
        expect(container.querySelectorAll('ol > li').length).toBe(1);

        editor.destroy();
        container.remove();
    });

    it('should preserve separate paragraphs when editing the first paragraph of a list item', () => {
        // Edit the first paragraph and verify that the second paragraph
        // remains a separate paragraph.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(
                listItemNode(
                    paragraphNode('Prepare deployment'),
                    paragraphNode('Run tests')
                )
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(
            editor,
            container,
            'Prepare deployment',
            'Prepare deployment'.length
        );

        view.dispatch(
            view.state.tr.insertText(' today')
        );

        const paragraphs = container.querySelectorAll('li > p');

        expect(paragraphs.length).toBe(2);
        expect(paragraphs[0].textContent).toBe('Prepare deployment today');
        expect(paragraphs[1].textContent).toBe('Run tests');

        editor.destroy();
        container.remove();
    });

    it('should replace text in a nested list item without affecting its parent item', () => {
        // Replace text inside the nested item and verify that the
        // parent list item remains unchanged.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(
                listItemNode(
                    paragraphNode('Parent task'),
                    bulletListNode(
                        listItemNode(
                            paragraphNode('Old child')
                        )
                    )
                )
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(editor, container, 'Old child', 0);

        const from: number = view.state.selection.from;
        const to: number = from + 'Old child'.length;

        view.dispatch(
            view.state.tr
                .setSelection(
                    (view.state.selection as any).constructor.create(
                        view.state.doc,
                        from,
                        to
                    )
                )
                .insertText('Updated child')
        );

        expect(view.state.doc.textContent).toContain('Parent task');
        expect(view.state.doc.textContent).toContain('Updated child');
        expect(view.state.doc.textContent).not.toContain('Old child');

        expect(container.querySelectorAll('li ul > li').length).toBe(1);

        editor.destroy();
        container.remove();
    });

    it('should preserve sibling nested items when editing one nested item', () => {
        // Edit one nested item and verify that its sibling nested item
        // remains unchanged.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(
                listItemNode(
                    paragraphNode('Parent'),
                    bulletListNode(
                        listItemNode(
                            paragraphNode('First child')
                        ),
                        listItemNode(
                            paragraphNode('Second child')
                        )
                    )
                )
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(
            editor,
            container,
            'First child',
            'First child'.length
        );

        view.dispatch(
            view.state.tr.insertText(' updated')
        );

        const nestedItems = container.querySelectorAll('li ul > li');

        expect(nestedItems.length).toBe(2);
        expect(nestedItems[0].textContent).toBe('First child updated');
        expect(nestedItems[1].textContent).toBe('Second child');

        editor.destroy();
        container.remove();
    });

    it('should preserve ordered list item boundaries when replacing middle content', () => {
        // Replace only the middle word of an ordered list item and verify
        // that the other ordered items remain independent.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            orderedListNode(
                listItemNode(
                    paragraphNode('Build production application')
                ),
                listItemNode(
                    paragraphNode('Run production tests')
                ),
                listItemNode(
                    paragraphNode('Deploy production build')
                )
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(
            editor,
            container,
            'Run production tests',
            'Run '.length
        );

        const from: number = view.state.selection.from;
        const to: number = from + 'production'.length;

        view.dispatch(
            view.state.tr
                .setSelection(
                    (view.state.selection as any).constructor.create(
                        view.state.doc,
                        from,
                        to
                    )
                )
                .insertText('unit')
        );

        const items = container.querySelectorAll('ol > li');

        expect(items.length).toBe(3);
        expect(items[0].textContent).toBe('Build production application');
        expect(items[1].textContent).toBe('Run unit tests');
        expect(items[2].textContent).toBe('Deploy production build');

        editor.destroy();
        container.remove();
    });

    it('should preserve list structure when typing after deleting part of a nested item', () => {
        // Delete part of a nested item's text and type replacement content.
        // Verify that the nested list remains intact.
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = createListEditor([
            bulletListNode(
                listItemNode(
                    paragraphNode('Main task'),
                    orderedListNode(
                        listItemNode(
                            paragraphNode('Run old tests')
                        )
                    )
                )
            )
        ]);

        editor.mount(container);
        const view: any = editor.integration.getView();

        setCursorAtForEditor(
            editor,
            container,
            'Run old tests',
            'Run '.length
        );

        const from: number = view.state.selection.from;
        const to: number = from + 'old'.length;

        view.dispatch(
            view.state.tr
                .setSelection(
                    (view.state.selection as any).constructor.create(
                        view.state.doc,
                        from,
                        to
                    )
                )
                .deleteSelection()
        );

        view.dispatch(
            view.state.tr.insertText('unit')
        );

        expect(view.state.doc.textContent).toContain('Main task');
        expect(view.state.doc.textContent).toContain('Run unit tests');
        expect(container.querySelectorAll('li ol > li').length).toBe(1);

        editor.destroy();
        container.remove();
    });

    it('should apply bold to text inside a bullet list item without changing the list structure', () => {
        // Apply bold to text inside a bullet list item and verify the item remains a list item.
        const editor: HeadlessEditor = createListEditor([
            bulletListNode(
                listItemNode(paragraphNode('Important task'))
            )
        ]);

        const root: HTMLElement = document.createElement('div');
        document.body.appendChild(root);
        editor.mount(root);
        setCursorAtForEditor(editor, root, 'Important task', 0);

        selectTextRangeInEditor(editor, 'Important task', 0, 'Important task'.length);
        expect(editor.commands.toggleBold()).toBe(true);

        expect(editor.getHtml()).toContain('<ul');
        expect(editor.getHtml()).toContain('<li');
        expect(editor.getHtml()).toContain('Important task');
        expect(editor.getActiveMarks()).toContain('bold');
        expect(editor.getActiveMarks()).not.toContain('color');

        const list: EditorNode = editor.getDocument().children[0];
        expect(list.type).toBe('bulletList');
        expect(list.children[0].type).toBe('listItem');
    });

    it('should apply font color to text inside an ordered list item and preserve numbering', () => {
        // Change the color of list content without affecting the ordered list.
        const editor: HeadlessEditor = createListEditor([
            orderedListNode(
                listItemNode(paragraphNode('Build application')),
                listItemNode(paragraphNode('Run tests'))
            )
        ]);

        const root: HTMLElement = document.createElement('div');
        document.body.appendChild(root);
        editor.mount(root);
        setCursorAtForEditor(editor, root, 'Build application', 0);

        selectTextRangeInEditor(editor, 'Build application', 0, 'Build application'.length);
        editor.commands.setColor({ color: '#ff0000' });

        expect(editor.getHtml()).toContain('<ol');
        expect(editor.getHtml()).toContain('Build application');
        expect(editor.getHtml()).toContain('Run tests');
        expect(editor.getActiveMarks()).toContain('textStyle');
        expect(editor.getHtml()).toContain('color: rgb(255, 0, 0)');

        const list: EditorNode = editor.getDocument().children[0];
        expect(list.type).toBe('orderedList');
        expect(list.children.length).toBe(2);
    });

    it('should combine bold and background color inside a bullet list item', () => {
        // Apply two inline formats to the same list item text.
        const editor: HeadlessEditor = createListEditor([
            bulletListNode(
                listItemNode(paragraphNode('Deploy service'))
            )
        ]);

        const root: HTMLElement = document.createElement('div');
        document.body.appendChild(root);
        editor.mount(root);
        setCursorAtForEditor(editor, root, 'Deploy service', 0);

        selectTextRangeInEditor(editor, 'Deploy service', 0, 'Deploy service'.length);
        expect(editor.commands.toggleBold()).toBe(true);

        selectTextRangeInEditor(editor, 'Deploy service', 0, 'Deploy service'.length);
        editor.commands.setHighlight({ color: '#ffff00' });

        expect(editor.getHtml()).toContain('<ul');
        expect(editor.getHtml()).toContain('<li');
        expect(editor.getHtml()).toContain('Deploy service');
        expect(editor.getActiveMarks()).toContain('bold');
        expect(editor.getActiveMarks()).toContain('textStyle');
        expect(editor.getHtml()).toContain('background-color: rgb(255, 255, 0)');

        const listItem: EditorNode = editor.getDocument().children[0].children[0];
        const textNode: EditorNode = listItem.children[0].children[0];

        expect(textNode.marks.length).toBeGreaterThanOrEqual(2);
    });

    it('should apply font family and font size to text inside an ordered list item', () => {
        // Change font properties of list content while preserving the ordered list item.
        const editor: HeadlessEditor = createListEditor([
            orderedListNode(
                listItemNode(paragraphNode('Release build'))
            )
        ]);

        const root: HTMLElement = document.createElement('div');
        document.body.appendChild(root);
        editor.mount(root);
        setCursorAtForEditor(editor, root, 'Release build', 0);

        selectTextRangeInEditor(editor, 'Release build', 0, 'Release build'.length);
        editor.commands.setFontFamily({ family: 'Arial' });

        selectTextRangeInEditor(editor, 'Release build', 0, 'Release build'.length);
        editor.commands.setFontSize({ size: '20px' });

        expect(editor.getHtml()).toContain('<ol');
        expect(editor.getHtml()).toContain('<li');
        expect(editor.getHtml()).toContain('Release build');
        expect(editor.getActiveMarks()).toContain('textStyle');
        expect(editor.getHtml()).toContain('Arial');
        expect(editor.getHtml()).toContain('20px');

        const list: EditorNode = editor.getDocument().children[0];
        expect(list.type).toBe('orderedList');
        expect(list.children[0].type).toBe('listItem');
    });

    it('should apply italic font style and bold to a nested list item', () => {
        // Apply inline formatting to nested list content without affecting the parent item.
        const editor: HeadlessEditor = createListEditor([
            bulletListNode(
                listItemNode(
                    paragraphNode('Parent task'),
                    bulletListNode(
                        listItemNode(paragraphNode('Nested task'))
                    )
                )
            )
        ]);

        const root: HTMLElement = document.createElement('div');
        document.body.appendChild(root);
        editor.mount(root);
        setCursorAtForEditor(editor, root, 'Nested task', 0);

        selectTextRangeInEditor(editor, 'Nested task', 0, 'Nested task'.length);
        expect(editor.commands.toggleBold()).toBe(true);

        selectTextRangeInEditor(editor, 'Nested task', 0, 'Nested task'.length);
        expect(editor.commands.toggleItalic()).toBe(true);

        expect(editor.getHtml()).toContain('Parent task');
        expect(editor.getHtml()).toContain('Nested task');
        expect(editor.getActiveMarks()).toContain('bold');
        expect(editor.getActiveMarks()).toContain('italic');
        expect(editor.getHtml()).toContain('<em');

        const parentItem: EditorNode = editor.getDocument().children[0].children[0];
        expect(parentItem.type).toBe('listItem');
        expect(parentItem.children[1].type).toBe('bulletList');
    });

    it('should apply text style and font color to only part of a list item', () => {
        // Format only part of the list item and keep the remaining text unchanged.
        const editor: HeadlessEditor = createListEditor([
            bulletListNode(
                listItemNode(paragraphNode('Prepare deployment'))
            )
        ]);

        const root: HTMLElement = document.createElement('div');
        document.body.appendChild(root);
        editor.mount(root);
        setCursorAtForEditor(editor, root, 'Prepare deployment', 0);

        selectTextRangeInEditor(editor, 'Prepare deployment', 0, 'Prepare deployment'.length);
        expect(editor.commands.toggleBold()).toBe(true);

        selectTextRangeInEditor(editor, 'Prepare deployment', 0, 'Prepare deployment'.length);
        editor.commands.setColor({ color: '#0000ff' });

        expect(editor.getHtml()).toContain('Prepare');
        expect(editor.getHtml()).toContain('deployment');
        expect(editor.getActiveMarks()).toContain('bold');
        expect(editor.getActiveMarks()).toContain('textStyle');
        expect(editor.getHtml()).toContain('color: rgb(0, 0, 255)');

        const list: EditorNode = editor.getDocument().children[0];
        expect(list.type).toBe('bulletList');
        expect(list.children[0].type).toBe('listItem');
    });

    it('should preserve nested list structure when applying background and font color', () => {
        // Apply multiple colors to nested content and verify both list levels remain intact.
        const editor: HeadlessEditor = createListEditor([
            bulletListNode(
                listItemNode(
                    paragraphNode('Main task'),
                    orderedListNode(
                        listItemNode(paragraphNode('Sub task'))
                    )
                )
            )
        ]);

        const root: HTMLElement = document.createElement('div');
        document.body.appendChild(root);
        editor.mount(root);
        setCursorAtForEditor(editor, root, 'Sub task', 0);

        selectTextRangeInEditor(editor, 'Sub task', 0, 'Sub task'.length);
        editor.commands.setColor({ color: '#ff0000' });

        selectTextRangeInEditor(editor, 'Sub task', 0, 'Sub task'.length);
        editor.commands.setHighlight({ color: '#ffff00' });

        expect(editor.getHtml()).toContain('Main task');
        expect(editor.getHtml()).toContain('Sub task');
        expect(editor.getHtml()).toContain('<ul');
        expect(editor.getHtml()).toContain('<ol');
        expect(editor.getActiveMarks()).toContain('textStyle');
        expect(editor.getHtml()).toContain('color: rgb(255, 0, 0)');
        expect(editor.getHtml()).toContain('background-color: rgb(255, 255, 0)');

        const parentItem: EditorNode = editor.getDocument().children[0].children[0];
        expect(parentItem.children[1].type).toBe('orderedList');
    });

    it('should preserve list item boundaries when applying heading and bold formatting', () => {
        // Apply block and inline formatting to a list item and verify its boundaries remain valid.
        const editor: HeadlessEditor = createListEditor([
            bulletListNode(
                listItemNode(paragraphNode('Feature implementation')),
                listItemNode(paragraphNode('Bug fixing'))
            )
        ]);

        const root: HTMLElement = document.createElement('div');
        document.body.appendChild(root);
        editor.mount(root);
        setCursorAtForEditor(editor, root, 'Feature implementation', 0);

        selectTextRangeInEditor(editor, 'Feature implementation', 0, 'Feature implementation'.length);
        expect(editor.commands.toggleBold()).toBe(true);

        editor.commands.setHeading({ level: 2 });

        expect(editor.getHtml()).toContain('Feature implementation');
        expect(editor.getHtml()).toContain('Bug fixing');
        expect(editor.getActiveMarks()).toContain('bold');

        const list: EditorNode = editor.getDocument().children[0];
        expect(list.type).toBe('bulletList');
        expect(list.children.length).toBe(2);
    });

    it('should preserve ordered list structure when combining bold, font size and alignment', () => {
        // Apply several formatting operations to an ordered list item.
        const editor: HeadlessEditor = createListEditor([
            orderedListNode(
                listItemNode(paragraphNode('Complete validation')),
                listItemNode(paragraphNode('Submit changes'))
            )
        ]);

        const root: HTMLElement = document.createElement('div');
        document.body.appendChild(root);
        editor.mount(root);
        setCursorAtForEditor(editor, root, 'Complete validation', 0);

        selectTextRangeInEditor(editor, 'Complete validation', 0, 'Complete validation'.length);
        expect(editor.commands.toggleBold()).toBe(true);

        selectTextRangeInEditor(editor, 'Complete validation', 0, 'Complete validation'.length);
        editor.commands.setFontSize({ size: '18px' });

        editor.commands.setTextAlign({ align: 'center' });

        expect(editor.getHtml()).toContain('<ol');
        expect(editor.getHtml()).toContain('Complete validation');
        expect(editor.getHtml()).toContain('Submit changes');
        expect(editor.getActiveMarks()).toContain('bold');
        expect(editor.getActiveMarks()).toContain('textStyle');
        expect(editor.getHtml()).toContain('18px');
        expect(editor.getHtml()).toContain('text-align: center');

        const list: EditorNode = editor.getDocument().children[0];
        expect(list.type).toBe('orderedList');
        expect(list.children.length).toBe(2);
    });

    it('should preserve the complete nested list while combining multiple formatting extensions', () => {
        // Apply multiple inline formats to nested text and verify the entire list hierarchy.
        const editor: HeadlessEditor = createListEditor([
            bulletListNode(
                listItemNode(
                    paragraphNode('Prepare release'),
                    orderedListNode(
                        listItemNode(paragraphNode('Build package')),
                        listItemNode(paragraphNode('Run tests'))
                    )
                ),
                listItemNode(paragraphNode('Publish release'))
            )
        ]);

        const root: HTMLElement = document.createElement('div');
        document.body.appendChild(root);
        editor.mount(root);
        setCursorAtForEditor(editor, root, 'Build package', 0);

        selectTextRangeInEditor(editor, 'Build package', 0, 'Build package'.length);
        expect(editor.commands.toggleBold()).toBe(true);

        selectTextRangeInEditor(editor, 'Build package', 0, 'Build package'.length);
        editor.commands.setColor({ color: '#ff0000' });

        selectTextRangeInEditor(editor, 'Build package', 0, 'Build package'.length);
        editor.commands.setHighlight({ color: '#ffff00' });

        selectTextRangeInEditor(editor, 'Build package', 0, 'Build package'.length);
        editor.commands.toggleItalic();

        expect(editor.getHtml()).toContain('Prepare release');
        expect(editor.getHtml()).toContain('Build package');
        expect(editor.getHtml()).toContain('Run tests');
        expect(editor.getHtml()).toContain('Publish release');
        expect(editor.getHtml()).toContain('<ul');
        expect(editor.getHtml()).toContain('<ol');
        expect(editor.getActiveMarks()).toContain('bold');
        expect(editor.getActiveMarks()).toContain('italic');
        expect(editor.getActiveMarks()).toContain('textStyle');
        expect(editor.getHtml()).toContain('color: rgb(255, 0, 0)');
        expect(editor.getHtml()).toContain('background-color: rgb(255, 255, 0)');
        expect(editor.getHtml()).toContain('<em');
        expect(editor.getHtml()).toContain('<strong');

        const rootList: EditorNode = editor.getDocument().children[0];
        const parentItem: EditorNode = rootList.children[0];
        const nestedList: EditorNode = parentItem.children[1];

        expect(rootList.type).toBe('bulletList');
        expect(parentItem.type).toBe('listItem');
        expect(nestedList.type).toBe('orderedList');
        expect(nestedList.children.length).toBe(2);
    });

it('should apply italic and bold to a nested list item', () => {
    // Apply two inline formats to nested list content and preserve both list levels.
    const editor: HeadlessEditor = createListEditor([
        bulletListNode(
            listItemNode(
                paragraphNode('Parent task'),
                bulletListNode(
                    listItemNode(paragraphNode('Nested task'))
                )
            )
        )
    ]);

    const root: HTMLElement = document.createElement('div');
    document.body.appendChild(root);
    editor.mount(root);

    setCursorAtForEditor(editor, root, 'Nested task', 0);

    selectTextRangeInEditor(editor, 'Nested task', 0, 'Nested task'.length);
    expect(editor.commands.toggleBold()).toBe(true);

    selectTextRangeInEditor(editor, 'Nested task', 0, 'Nested task'.length);
    expect(editor.commands.toggleItalic()).toBe(true);

    expect(editor.getHtml()).toContain('Parent task');
    expect(editor.getHtml()).toContain('Nested task');
    expect(editor.getHtml()).toContain('<strong');
    expect(editor.getHtml()).toContain('<em');
    expect(editor.getActiveMarks()).toContain('bold');
    expect(editor.getActiveMarks()).toContain('italic');

    const list: EditorNode = editor.getDocument().children[0];
    expect(list.type).toBe('bulletList');
    expect(list.children[0].type).toBe('listItem');

    const nestedList: EditorNode = list.children[0].children[1];
    expect(nestedList.type).toBe('bulletList');
    expect(nestedList.children[0].type).toBe('listItem');
});

it('should apply text style and font color to text inside a bullet list item', () => {
    // Apply bold and color to list content while keeping the list item intact.
    const editor: HeadlessEditor = createListEditor([
        bulletListNode(
            listItemNode(paragraphNode('Prepare deployment'))
        )
    ]);

    const root: HTMLElement = document.createElement('div');
    document.body.appendChild(root);
    editor.mount(root);

    setCursorAtForEditor(editor, root, 'Prepare deployment', 0);

    selectTextRangeInEditor(editor, 'Prepare deployment', 0, 'Prepare deployment'.length);
    expect(editor.commands.toggleBold()).toBe(true);

    selectTextRangeInEditor(editor, 'Prepare deployment', 0, 'Prepare deployment'.length);
    editor.commands.setColor({ color: '#0000ff' });

    expect(editor.getHtml()).toContain('Prepare deployment');
    expect(editor.getHtml()).toContain('color: rgb(0, 0, 255)');
    expect(editor.getActiveMarks()).toContain('bold');
    expect(editor.getActiveMarks()).toContain('textStyle');

    const list: EditorNode = editor.getDocument().children[0];
    expect(list.type).toBe('bulletList');
    expect(list.children[0].type).toBe('listItem');

    const paragraph: EditorNode = list.children[0].children[0];
    const text: EditorNode = paragraph.children[0];

    expect(text.marks.length).toBeGreaterThanOrEqual(2);
});

it('should preserve nested ordered list structure when applying colors', () => {
    // Apply foreground and background colors to nested ordered-list content.
    const editor: HeadlessEditor = createListEditor([
        bulletListNode(
            listItemNode(
                paragraphNode('Main task'),
                orderedListNode(
                    listItemNode(paragraphNode('Sub task'))
                )
            )
        )
    ]);

    const root: HTMLElement = document.createElement('div');
    document.body.appendChild(root);
    editor.mount(root);

    setCursorAtForEditor(editor, root, 'Sub task', 0);

    selectTextRangeInEditor(editor, 'Sub task', 0, 'Sub task'.length);
    editor.commands.setColor({ color: '#ff0000' });

    selectTextRangeInEditor(editor, 'Sub task', 0, 'Sub task'.length);
    editor.commands.setHighlight({ color: '#ffff00' });

    expect(editor.getHtml()).toContain('Main task');
    expect(editor.getHtml()).toContain('Sub task');
    expect(editor.getHtml()).toContain('<ul');
    expect(editor.getHtml()).toContain('<ol');
    expect(editor.getHtml()).toContain('color: rgb(255, 0, 0)');
    expect(editor.getHtml()).toContain('background-color: rgb(255, 255, 0)');
    expect(editor.getActiveMarks()).toContain('textStyle');

    const list: EditorNode = editor.getDocument().children[0];
    expect(list.type).toBe('bulletList');
    expect(list.children[0].type).toBe('listItem');

    const nestedList: EditorNode = list.children[0].children[1];
    expect(nestedList.type).toBe('orderedList');
    expect(nestedList.children[0].type).toBe('listItem');
});

it('should apply font family and font size to an ordered list item', () => {
    // Apply font properties to list text and preserve the ordered list.
    const editor: HeadlessEditor = createListEditor([
        orderedListNode(
            listItemNode(paragraphNode('Release build')),
            listItemNode(paragraphNode('Run tests'))
        )
    ]);

    const root: HTMLElement = document.createElement('div');
    document.body.appendChild(root);
    editor.mount(root);

    setCursorAtForEditor(editor, root, 'Release build', 0);

    selectTextRangeInEditor(editor, 'Release build', 0, 'Release build'.length);
    editor.commands.setFontFamily({ family: 'Arial' });

    selectTextRangeInEditor(editor, 'Release build', 0, 'Release build'.length);
    editor.commands.setFontSize({ size: '20px' });

    expect(editor.getHtml()).toContain('<ol');
    expect(editor.getHtml()).toContain('Release build');
    expect(editor.getHtml()).toContain('Run tests');
    expect(editor.getHtml()).toContain('Arial');
    expect(editor.getHtml()).toContain('20px');
    expect(editor.getActiveMarks()).toContain('textStyle');

    const list: EditorNode = editor.getDocument().children[0];
    expect(list.type).toBe('orderedList');
    expect(list.children.length).toBe(2);
    expect(list.children[0].type).toBe('listItem');
    expect(list.children[1].type).toBe('listItem');
});

it('should preserve bold formatting when applying alignment to an ordered list item', () => {
    // Apply inline formatting and paragraph alignment to the same list item.
    const editor: HeadlessEditor = createListEditor([
        orderedListNode(
            listItemNode(paragraphNode('Complete validation')),
            listItemNode(paragraphNode('Submit changes'))
        )
    ]);

    const root: HTMLElement = document.createElement('div');
    document.body.appendChild(root);
    editor.mount(root);

    setCursorAtForEditor(editor, root, 'Complete validation', 0);

    selectTextRangeInEditor(editor, 'Complete validation', 0, 'Complete validation'.length);
    expect(editor.commands.toggleBold()).toBe(true);

    setCursorAtForEditor(editor, root, 'Complete validation', 0);
    editor.commands.setTextAlign({ align: 'center' });

    expect(editor.getHtml()).toContain('<ol');
    expect(editor.getHtml()).toContain('Complete validation');
    expect(editor.getHtml()).toContain('Submit changes');
    expect(editor.getHtml()).toContain('text-align: center');
    expect(editor.getActiveMarks()).toContain('bold');

    const list: EditorNode = editor.getDocument().children[0];
    expect(list.type).toBe('orderedList');
    expect(list.children.length).toBe(2);
});

it('should preserve list structure when applying bold and heading formatting', () => {
    // Apply inline formatting and heading formatting to the first list item.
    const editor: HeadlessEditor = createListEditor([
        bulletListNode(
            listItemNode(paragraphNode('Feature implementation')),
            listItemNode(paragraphNode('Bug fixing'))
        )
    ]);

    const root: HTMLElement = document.createElement('div');
    document.body.appendChild(root);
    editor.mount(root);

    setCursorAtForEditor(editor, root, 'Feature implementation', 0);

    selectTextRangeInEditor(editor, 'Feature implementation', 0, 'Feature implementation'.length);
    expect(editor.commands.toggleBold()).toBe(true);

    setCursorAtForEditor(editor, root, 'Feature implementation', 0);
    editor.commands.setHeading({ level: 2 });

    expect(editor.getHtml()).toContain('Feature implementation');
    expect(editor.getHtml()).toContain('Bug fixing');
    expect(editor.getActiveMarks()).toContain('bold');

    const list: EditorNode = editor.getDocument().children[0];
    expect(list.type).toBe('bulletList');
    expect(list.children.length).toBe(2);
    expect(list.children[0].type).toBe('listItem');
    expect(list.children[1].type).toBe('listItem');
});

it('should preserve nested list structure when combining bold color and highlight', () => {
    // Apply three inline formats to nested ordered-list content.
    const editor: HeadlessEditor = createListEditor([
        bulletListNode(
            listItemNode(
                paragraphNode('Prepare release'),
                orderedListNode(
                    listItemNode(paragraphNode('Build package')),
                    listItemNode(paragraphNode('Run tests'))
                )
            )
        )
    ]);

    const root: HTMLElement = document.createElement('div');
    document.body.appendChild(root);
    editor.mount(root);

    setCursorAtForEditor(editor, root, 'Build package', 0);

    selectTextRangeInEditor(editor, 'Build package', 0, 'Build package'.length);
    expect(editor.commands.toggleBold()).toBe(true);

    selectTextRangeInEditor(editor, 'Build package', 0, 'Build package'.length);
    editor.commands.setColor({ color: '#ff0000' });

    selectTextRangeInEditor(editor, 'Build package', 0, 'Build package'.length);
    editor.commands.setHighlight({ color: '#ffff00' });

    expect(editor.getHtml()).toContain('Prepare release');
    expect(editor.getHtml()).toContain('Build package');
    expect(editor.getHtml()).toContain('Run tests');
    expect(editor.getHtml()).toContain('<ul');
    expect(editor.getHtml()).toContain('<ol');
    expect(editor.getHtml()).toContain('<strong');
    expect(editor.getHtml()).toContain('color: rgb(255, 0, 0)');
    expect(editor.getHtml()).toContain('background-color: rgb(255, 255, 0)');
    expect(editor.getActiveMarks()).toContain('bold');
    expect(editor.getActiveMarks()).toContain('textStyle');

    const rootList: EditorNode = editor.getDocument().children[0];
    expect(rootList.type).toBe('bulletList');

    const parentItem: EditorNode = rootList.children[0];
    expect(parentItem.type).toBe('listItem');

    const nestedList: EditorNode = parentItem.children[1];
    expect(nestedList.type).toBe('orderedList');
    expect(nestedList.children.length).toBe(2);
    expect(nestedList.children[0].type).toBe('listItem');
    expect(nestedList.children[1].type).toBe('listItem');
});

it('should preserve ordered list items when formatting only one nested item', () => {
    // Format one nested item and verify its sibling remains unchanged.
    const editor: HeadlessEditor = createListEditor([
        bulletListNode(
            listItemNode(
                paragraphNode('Parent task'),
                orderedListNode(
                    listItemNode(paragraphNode('Build package')),
                    listItemNode(paragraphNode('Run tests'))
                )
            )
        )
    ]);

    const root: HTMLElement = document.createElement('div');
    document.body.appendChild(root);
    editor.mount(root);

    setCursorAtForEditor(editor, root, 'Build package', 0);

    selectTextRangeInEditor(editor, 'Build package', 0, 'Build package'.length);
    expect(editor.commands.toggleBold()).toBe(true);

    expect(editor.getHtml()).toContain('Build package');
    expect(editor.getHtml()).toContain('Run tests');
    expect(editor.getActiveMarks()).toContain('bold');

    const rootList: EditorNode = editor.getDocument().children[0];
    const parentItem: EditorNode = rootList.children[0];
    const nestedList: EditorNode = parentItem.children[1];

    expect(rootList.type).toBe('bulletList');
    expect(parentItem.type).toBe('listItem');
    expect(nestedList.type).toBe('orderedList');
    expect(nestedList.children.length).toBe(2);
    expect(nestedList.children[0].type).toBe('listItem');
    expect(nestedList.children[1].type).toBe('listItem');
});

it('should preserve list item content when applying multiple font styles', () => {
    // Apply font family, size and italic formatting to one ordered list item.
    const editor: HeadlessEditor = createListEditor([
        orderedListNode(
            listItemNode(paragraphNode('Application build')),
            listItemNode(paragraphNode('Application test'))
        )
    ]);

    const root: HTMLElement = document.createElement('div');
    document.body.appendChild(root);
    editor.mount(root);

    setCursorAtForEditor(editor, root, 'Application build', 0);

    selectTextRangeInEditor(editor, 'Application build', 0, 'Application build'.length);
    editor.commands.setFontFamily({ family: 'Arial' });

    selectTextRangeInEditor(editor, 'Application build', 0, 'Application build'.length);
    editor.commands.setFontSize({ size: '18px' });

    selectTextRangeInEditor(editor, 'Application build', 0, 'Application build'.length);
    expect(editor.commands.toggleItalic()).toBe(true);

    expect(editor.getHtml()).toContain('<ol');
    expect(editor.getHtml()).toContain('Application build');
    expect(editor.getHtml()).toContain('Application test');
    expect(editor.getHtml()).toContain('Arial');
    expect(editor.getHtml()).toContain('18px');
    expect(editor.getHtml()).toContain('<em');
    expect(editor.getActiveMarks()).toContain('italic');
    expect(editor.getActiveMarks()).toContain('textStyle');

    const list: EditorNode = editor.getDocument().children[0];
    expect(list.type).toBe('orderedList');
    expect(list.children.length).toBe(2);
});

it('should preserve the complete list hierarchy when formatting a nested item with multiple marks', () => {
    // Apply bold, italic, color and highlight to deeply nested content.
    const editor: HeadlessEditor = createListEditor([
        bulletListNode(
            listItemNode(
                paragraphNode('Main task'),
                orderedListNode(
                    listItemNode(
                        paragraphNode('Build package'),
                        bulletListNode(
                            listItemNode(paragraphNode('Run tests'))
                        )
                    )
                )
            )
        )
    ]);

    const root: HTMLElement = document.createElement('div');
    document.body.appendChild(root);
    editor.mount(root);

    setCursorAtForEditor(editor, root, 'Run tests', 0);

    selectTextRangeInEditor(editor, 'Run tests', 0, 'Run tests'.length);
    expect(editor.commands.toggleBold()).toBe(true);

    selectTextRangeInEditor(editor, 'Run tests', 0, 'Run tests'.length);
    expect(editor.commands.toggleItalic()).toBe(true);

    selectTextRangeInEditor(editor, 'Run tests', 0, 'Run tests'.length);
    editor.commands.setColor({ color: '#0000ff' });

    selectTextRangeInEditor(editor, 'Run tests', 0, 'Run tests'.length);
    editor.commands.setHighlight({ color: '#ffff00' });

    expect(editor.getHtml()).toContain('Main task');
    expect(editor.getHtml()).toContain('Build package');
    expect(editor.getHtml()).toContain('Run tests');
    expect(editor.getHtml()).toContain('<ul');
    expect(editor.getHtml()).toContain('<ol');
    expect(editor.getHtml()).toContain('<strong');
    expect(editor.getHtml()).toContain('<em');
    expect(editor.getHtml()).toContain('color: rgb(0, 0, 255)');
    expect(editor.getHtml()).toContain('background-color: rgb(255, 255, 0)');
    expect(editor.getActiveMarks()).toContain('bold');
    expect(editor.getActiveMarks()).toContain('italic');
    expect(editor.getActiveMarks()).toContain('textStyle');

    const rootList: EditorNode = editor.getDocument().children[0];
    expect(rootList.type).toBe('bulletList');

    const firstItem: EditorNode = rootList.children[0];
    expect(firstItem.type).toBe('listItem');

    const orderedList: EditorNode = firstItem.children[1];
    expect(orderedList.type).toBe('orderedList');

    const orderedItem: EditorNode = orderedList.children[0];
    expect(orderedItem.type).toBe('listItem');

    const nestedBulletList: EditorNode = orderedItem.children[1];
    expect(nestedBulletList.type).toBe('bulletList');
    expect(nestedBulletList.children.length).toBe(1);
    expect(nestedBulletList.children[0].type).toBe('listItem');
});

    
});

describe('Built-in: list', () => {
    let editor: HeadlessEditor;
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);

        editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [
                    {
                        type: 'bulletList',
                        id: crypto.randomUUID(),
                        attrs: {},
                        marks: [],
                        children: [
                            {
                                type: 'listItem',
                                id: crypto.randomUUID(),
                                attrs: {},
                                marks: [],
                                children: [
                                    {
                                        type: 'paragraph',
                                        id: crypto.randomUUID(),
                                        attrs: {},
                                        marks: [],
                                        children: [
                                            {
                                                type: 'text',
                                                id: crypto.randomUUID(),
                                                text: 'First bullet item',
                                                marks: []
                                            } as TextNode
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            extensions: [
                paragraphExtension,
                listExtension
            ]
        });

        editor.mount(container);
    });

    afterEach(() => {
        if (!editor.isDestroyed) {
            editor.destroy();
        }

        container.remove();
    });

    it('should render a bullet list item', () => {
        const list = container.querySelector('ul');
        const item = container.querySelector('li');

        expect(list).not.toBeNull();
        expect(item).not.toBeNull();
        expect(item.textContent).toContain('First bullet item');
        // The default listStyleType is serialized as an inline CSS style.
        expect(list!.getAttribute('style')).toContain('list-style-type: disc');
    });
    it('should expose stable metadata and independent default options', () => {
        expect(listExtension.name).toBe('list');
        expect(listExtension.config.priority).toBe(10);
        const first = listExtension.config.defineOptions!();
        const second = listExtension.config.defineOptions!();
        expect(first).toEqual({ htmlAttributes: {}, itemHtmlAttributes: {} });
        expect(second).toEqual({ htmlAttributes: {}, itemHtmlAttributes: {} });
        expect(first).not.toBe(second);
    });

    it('should contribute the exact list node definitions', () => {
        const nodes = listExtension.config.nodes!();
        const [bulletList, orderedList, listItem] = nodes;
        expect(nodes.length).toBe(3);
        expect(nodes.map(node => node.name)).toEqual(['bulletList', 'orderedList', 'listItem']);
        expect(bulletList.content).toBeDefined();
        expect(orderedList.content).toBeDefined();
        expect(listItem.content).toBeDefined();
        expect(bulletList.attrs).toEqual([
            { name: 'listStyleType', type: 'string', default: 'disc' }
        ]);
        expect(orderedList.attrs).toEqual([
            { name: 'order', type: 'number', default: 1 },
            { name: 'listStyleType', type: 'string', default: 'decimal' }
        ]);
        expect(listItem.attrs?.[0]).toEqual({ name: 'align', type: 'string', default: null });
    });

    it('should render default, configured, and conditional DOM descriptors', () => {
        const defaults = listExtension.config.domSpecs!.call({ options: {} } as any).nodes;
        expect(defaults.bulletList.toDOM({ listStyleType: 'disc' })).toEqual([
            'ul', { style: 'list-style-type: disc' }, 0
        ]);
        expect(defaults.orderedList.toDOM({ order: 1, listStyleType: 'decimal' })).toEqual([
            'ol', { style: 'list-style-type: decimal' }, 0
        ]);
        expect(defaults.listItem.toDOM({})).toEqual(['li', {}, 0]);

        const absentOptions = listExtension.config.domSpecs!.call({} as any).nodes;
        expect(absentOptions.bulletList.toDOM({ listStyleType: 'disc' })).toEqual([
            'ul', { style: 'list-style-type: disc' }, 0
        ]);
        expect(absentOptions.listItem.toDOM({})).toEqual(['li', {}, 0]);

        const listAttrs = { class: 'compact-list' };
        const itemAttrs = { class: 'compact-item' };
        const specs = listExtension.config.domSpecs!.call({
            options: { htmlAttributes: listAttrs, itemHtmlAttributes: itemAttrs }
        } as any).nodes;
        expect(specs.bulletList.toDOM({ listStyleType: 'circle' })).toEqual([
            'ul', { class: 'compact-list', style: 'list-style-type: circle' }, 0
        ]);
        expect(specs.orderedList.toDOM({ order: 1, listStyleType: 'decimal' })).toEqual([
            'ol', { class: 'compact-list', style: 'list-style-type: decimal' }, 0
        ]);
        expect(specs.orderedList.toDOM({ order: 3, listStyleType: 'lower-alpha' })).toEqual([
            'ol', { class: 'compact-list', start: '3', style: 'list-style-type: lower-alpha' }, 0
        ]);
        // Non-string or empty listStyleType values emit no style declaration.
        expect(specs.bulletList.toDOM({ listStyleType: null })).toEqual(['ul', listAttrs, 0]);
        expect(specs.orderedList.toDOM({ order: 1, listStyleType: undefined })).toEqual(
            ['ol', listAttrs, 0]
        );
        expect(specs.listItem.toDOM({})).toEqual(['li', itemAttrs, 0]);
        expect(specs.listItem.toDOM({ align: 'center' })).toEqual([
            'li', { class: 'compact-item', style: 'text-align: center' }, 0
        ]);
        expect(specs.listItem.toDOM({ align: 'invalid' })).toEqual(['li', itemAttrs, 0]);
    });

    it('should parse listStyleType from inline CSS, legacy type attribute, and defaults', () => {
        // Import each HTML snippet the way a customer loads content — through
        // EditorConfig.content — and read the resulting document model.
        const importHtml = (html: string): Record<string, unknown> => {
            const importContainer = document.createElement('div');
            document.body.appendChild(importContainer);
            const importEditor = HeadlessEditor.create({
                content: html,
                extensions: [paragraphExtension, listExtension]
            });
            importEditor.mount(importContainer);
            try {
                let attrs: Record<string, unknown> | null = null;
                const walk = (node: any): void => {
                    if (attrs || node.type !== 'bulletList' && node.type !== 'orderedList') {
                        if (!attrs) { (node.children ?? []).forEach(walk); }
                        return;
                    }
                    attrs = node.attrs;
                };
                walk(importEditor.getDocument() as any);
                return attrs!;
            } finally {
                if (!importEditor.isDestroyed) { importEditor.destroy(); }
                importContainer.remove();
            }
        };

        // Inline CSS wins and passes through CSS values untouched.
        expect(importHtml('<ul style="list-style-type: square"><li>x</li></ul>'))
            .toEqual({ listStyleType: 'square' });
        // Legacy <ul type> is normalized like <ol type>.
        expect(importHtml('<ul type="a"><li>x</li></ul>'))
            .toEqual({ listStyleType: 'lower-alpha' });
        // No style info falls back to the bullet default.
        expect(importHtml('<ul><li>x</li></ul>')).toEqual({ listStyleType: 'disc' });

        // start attribute maps to order, CSS style to listStyleType.
        expect(importHtml('<ol start="5" style="list-style-type: lower-roman"><li>x</li></ol>'))
            .toEqual({ order: 5, listStyleType: 'lower-roman' });
        // Legacy <ol type> values convert to their CSS equivalents.
        expect(importHtml('<ol type="1"><li>x</li></ol>')).toEqual({ order: 1, listStyleType: 'decimal' });
        expect(importHtml('<ol type="a"><li>x</li></ol>')).toEqual({ order: 1, listStyleType: 'lower-alpha' });
        expect(importHtml('<ol type="A"><li>x</li></ol>')).toEqual({ order: 1, listStyleType: 'upper-alpha' });
        expect(importHtml('<ol type="i"><li>x</li></ol>')).toEqual({ order: 1, listStyleType: 'lower-roman' });
        expect(importHtml('<ol type="I"><li>x</li></ol>')).toEqual({ order: 1, listStyleType: 'upper-roman' });
        // Combined legacy inputs resolve both attributes.
        expect(importHtml('<ol start="3" type="I"><li>x</li></ol>'))
            .toEqual({ order: 3, listStyleType: 'upper-roman' });
        // Bare <ol> falls back to both defaults.
        expect(importHtml('<ol><li>x</li></ol>')).toEqual({ order: 1, listStyleType: 'decimal' });
        // Unrecognized values pass through untouched (extensibility).
        expect(importHtml('<ol style="list-style-type: custom-marker"><li>x</li></ol>'))
            .toEqual({ order: 1, listStyleType: 'custom-marker' });
    });

    it('should create styled lists when the user types markdown triggers', () => {
        // User journey: the user types "- " / "* " / "+ " / "42. " at the
        // start of a paragraph — the same path live typing takes.
        const typeViaInputRule = (
            importEditor: HeadlessEditor,
            importContainer: HTMLElement,
            trigger: string
        ): void => {
            importEditor.commands.setSelection({ from: 1, to: 1 });
            const view: any = importEditor.integration.getView();
            let handled: boolean = false;
            view.someProp('handleTextInput', (handler: Function): void => {
                handled = handler(view, 1, 1, trigger) || handled;
            });
            expect(handled).toBe(true);

            const list = importContainer.querySelector('ul, ol');
            expect(list).not.toBeNull();
            expect(list!.getAttribute('style')).not.toBeNull();
        };

        const typeTrigger = (trigger: string): void => {
            const typeContainer = document.createElement('div');
            document.body.appendChild(typeContainer);
            const typeEditor = HeadlessEditor.create({
                content: '<p> </p>',
                extensions: [paragraphExtension, listExtension],
                enableInputRules: true
            });
            typeEditor.mount(typeContainer);
            try {
                typeViaInputRule(typeEditor, typeContainer, trigger);
            } finally {
                if (!typeEditor.isDestroyed) { typeEditor.destroy(); }
                typeContainer.remove();
            }
        };

        typeTrigger('- ');
        typeTrigger('* ');
        typeTrigger('+ ');
    });

    it('should capture the ordered-list start number when the user types "42. "', () => {
        const typeContainer = document.createElement('div');
        document.body.appendChild(typeContainer);
        const typeEditor = HeadlessEditor.create({
            content: '<p> </p>',
            extensions: [paragraphExtension, listExtension],
            enableInputRules: true
        });
        typeEditor.mount(typeContainer);

        try {
            typeEditor.commands.setSelection({ from: 1, to: 1 });
            const view: any = typeEditor.integration.getView();
            let handled: boolean = false;
            view.someProp('handleTextInput', (handler: Function): void => {
                handled = handler(view, 1, 1, '42. ') || handled;
            });
            expect(handled).toBe(true);

            // Model: order captured from the typed number.
            let listAttrs: Record<string, unknown> | null = null;
            const walk = (node: any): void => {
                if (listAttrs || (node.type !== 'orderedList')) {
                    if (!listAttrs) { (node.children ?? []).forEach(walk); }
                    return;
                }
                listAttrs = node.attrs;
            };
            walk(typeEditor.getDocument() as any);
            expect(listAttrs!['order']).toBe(42);
            expect(listAttrs!['listStyleType']).toBe('decimal');

            // DOM: the number is visible via start and the style via CSS.
            const ol = typeContainer.querySelector('ol');
            expect(ol!.getAttribute('start')).toBe('42');
            expect(ol!.getAttribute('style')).toContain('list-style-type: decimal');
        } finally {
            if (!typeEditor.isDestroyed) { typeEditor.destroy(); }
            typeContainer.remove();
        }
    });

    it('should register all list commands including the style setters', () => {
        const commands = listExtension.config.commands!();
        expect(commands.map((command: any) => command.name)).toEqual([
            'toggleBulletList', 'toggleOrderedList', 'toggleListType', 'splitListItem',
            'indentListItem', 'outdentListItem', 'joinListBackward', 'deleteListItem',
            'setOrderedListType', 'setBulletListType'
        ]);
    });

    it('should render an ordered list with start and list-style-type styles', () => {
        const orderedEditor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [
                    {
                        type: 'orderedList',
                        id: crypto.randomUUID(),
                        attrs: { order: 3, listStyleType: 'upper-roman' },
                        marks: [],
                        children: [
                            {
                                type: 'listItem',
                                id: crypto.randomUUID(),
                                attrs: {},
                                marks: [],
                                children: [
                                    {
                                        type: 'paragraph',
                                        id: crypto.randomUUID(),
                                        attrs: {},
                                        marks: [],
                                        children: [
                                            {
                                                type: 'text',
                                                id: crypto.randomUUID(),
                                                text: 'Item text',
                                                marks: []
                                            } as TextNode
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            extensions: [paragraphExtension, listExtension]
        });

        const orderedContainer = document.createElement('div');
        document.body.appendChild(orderedContainer);
        orderedEditor.mount(orderedContainer);

        try {
            const ordered = orderedContainer.querySelector('ol');
            expect(ordered).not.toBeNull();
            expect(ordered!.getAttribute('start')).toBe('3');
            expect(ordered!.getAttribute('style')).toContain('list-style-type: upper-roman');
            // order=1 omits the start attribute entirely.
        } finally {
            if (!orderedEditor.isDestroyed) { orderedEditor.destroy(); }
            orderedContainer.remove();
        }
    });

    it('should omit the start attribute when order is 1', () => {
        const orderedEditor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [
                    {
                        type: 'orderedList',
                        id: crypto.randomUUID(),
                        attrs: { order: 1, listStyleType: 'decimal' },
                        marks: [],
                        children: [
                            {
                                type: 'listItem',
                                id: crypto.randomUUID(),
                                attrs: {},
                                marks: [],
                                children: [
                                    {
                                        type: 'paragraph',
                                        id: crypto.randomUUID(),
                                        attrs: {},
                                        marks: [],
                                        children: [
                                            {
                                                type: 'text',
                                                id: crypto.randomUUID(),
                                                text: 'First',
                                                marks: []
                                            } as TextNode
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            extensions: [paragraphExtension, listExtension]
        });

        const orderedContainer = document.createElement('div');
        document.body.appendChild(orderedContainer);
        orderedEditor.mount(orderedContainer);

        try {
            const ordered = orderedContainer.querySelector('ol');
            expect(ordered).not.toBeNull();
            expect(ordered!.hasAttribute('start')).toBe(false);
            expect(ordered!.getAttribute('style')).toContain('list-style-type: decimal');
        } finally {
            if (!orderedEditor.isDestroyed) { orderedEditor.destroy(); }
            orderedContainer.remove();
        }
    });

    it('should register all list commands in order', () => {
        expect(listExtension.config.commands!().map(command => command.name)).toEqual([
            'toggleBulletList',
            'toggleOrderedList',
            'toggleListType',
            'splitListItem',
            'indentListItem',
            'outdentListItem',
            'joinListBackward',
            'deleteListItem',
            'setOrderedListType',
            'setBulletListType'
        ]);
    });

    it('should expose nine list commands', () => {
        expect(listExtension.config.commands!().length).toBe(10);
    });

    it('should expose list keyboard shortcuts', () => {
        const shortcuts = listExtension.config.keyboardShortcuts!.call({
            editor
        } as any);

        expect(Object.keys(shortcuts)).toEqual([
            'Mod-Shift-8',
            'Mod-Shift-9'
        ]);

        expect(typeof shortcuts['Mod-Shift-8']).toBe('function');
        expect(typeof shortcuts['Mod-Shift-9']).toBe('function');
    });

    it('should parse ordered list start attribute', () => {
        const parseRule = listExtension.config.domSpecs!.call({
            options: {}
        } as any).nodes.orderedList.parseDOM![0];

        expect(parseRule.tag).toBe('ol');
        expect(typeof parseRule.getAttrs).toBe('function');

        expect(
            parseRule.getAttrs!({
                getAttribute: (attr: string) => attr === 'start' ? '5' : null
            } as any)
        ).toEqual({
            order: 5,
            listStyleType: 'decimal'
        });
    });

    it('should default ordered list start value to 1 when start attribute is missing', () => {
        const parseRule = listExtension.config.domSpecs!.call({
            options: {}
        } as any).nodes.orderedList.parseDOM![0];

        expect(
            parseRule.getAttrs!({
                getAttribute: () => null
            } as any)
        ).toEqual({
            order: 1,
            listStyleType: 'decimal'
        });
    });

    it('should default ordered list start attribute to one', () => {
        const parseRule = listExtension.config.domSpecs!.call({
            options: {}
        } as any).nodes.orderedList.parseDOM![0];

        expect(parseRule.tag).toBe('ol');
        expect(typeof parseRule.getAttrs).toBe('function');
    });

    it('should register parseDOM rules with getAttrs for bullet, ordered, and listItem nodes', () => {
        const nodes = listExtension.config.domSpecs!.call({
            options: {}
        } as any).nodes;

        const bulletRule = nodes.bulletList.parseDOM![0];
        const orderedRule = nodes.orderedList.parseDOM![0];
        const listItemRule = nodes.listItem.parseDOM![0];

        expect(bulletRule.tag).toBe('ul');
        expect(typeof bulletRule.getAttrs).toBe('function');

        expect(orderedRule.tag).toBe('ol');
        expect(typeof orderedRule.getAttrs).toBe('function');

        expect(listItemRule.tag).toBe('li');
        expect(typeof listItemRule.getAttrs).toBe('function');
    });

    it('should expose parseDOM rules for all list nodes', () => {
        const nodes = listExtension.config.domSpecs!.call({
            options: {}
        } as any).nodes;

        expect(nodes.bulletList.parseDOM![0].tag).toBe('ul');
        expect(nodes.orderedList.parseDOM![0].tag).toBe('ol');
        expect(nodes.listItem.parseDOM![0].tag).toBe('li');
    });

    it('should expose bullet list parseDOM rule', () => {
        const node = listExtension.config.domSpecs!.call({
            options: {}
        } as any).nodes.bulletList;

        expect(node.parseDOM![0].tag).toBe('ul');
        expect(typeof node.parseDOM![0].getAttrs).toBe('function');
        expect(
            node.parseDOM![0].getAttrs!({
                getAttribute: () => null
            } as any)
        ).toEqual({ listStyleType: 'disc' });
    });

    it('should apply a bullet list through the Mod-Shift-8 keyboard shortcut', () => {
        editor.destroy();

        editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
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
                        text: 'First item',
                        marks: []
                    } as TextNode]
                }]
            },
            extensions: [
                paragraphExtension,
                listExtension
            ]
        });

        editor.mount(container);

        editor.commands.setSelection({
            from: 1,
            to: 11
        });

        const view: any = editor.integration.getView();

        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: '8',
            code: 'Digit8',
            ctrlKey: true,
            shiftKey: true,
            bubbles: true,
            cancelable: true
        }));

        expect(container.querySelector('ul')).not.toBeNull();
        expect(container.textContent).toContain('First item');
    });

    it('should render ordered list with custom start and type', () => {
        const descriptor = listExtension.config.domSpecs!.call({
            options: {}
        } as any).nodes.orderedList.toDOM({
            order: 10,
            listStyleType: 'upper-alpha'
        });

        expect(descriptor).toEqual([
            'ol',
            {
                start: '10',
                style: 'list-style-type: upper-alpha'
            },
            0
        ]);
    });

    it('should render ordered list without extra attributes for defaults', () => {
        const descriptor = listExtension.config.domSpecs!.call({
            options: {}
        } as any).nodes.orderedList.toDOM({
            order: 1,
            listStyleType: 'decimal'
        });

        expect(descriptor).toEqual([
            'ol',
            { style: 'list-style-type: decimal' },
            0
        ]);
    });

    it('should expose the list extension metadata', () => {
        expect(listExtension.name).toBe('list');
        expect(listExtension.config.priority).toBe(10);
    });

    it('should return independent default option objects', () => {
        const first = listExtension.config.defineOptions!();
        const second = listExtension.config.defineOptions!();

        expect(first).toEqual({
            htmlAttributes: {},
            itemHtmlAttributes: {}
        });

        expect(second).toEqual({
            htmlAttributes: {},
            itemHtmlAttributes: {}
        });

        expect(first).not.toBe(second);
    });

    it('should contribute exactly three list node definitions', () => {
        const nodes = listExtension.config.nodes!();

        expect(nodes.length).toBe(3);
        expect(nodes.map(node => node.name)).toEqual([
            'bulletList',
            'orderedList',
            'listItem'
        ]);
    });

    it('should render a default bullet list dom descriptor', () => {
        const descriptor = listExtension.config.domSpecs!.call({
            options: {}
        } as any).nodes.bulletList.toDOM({ listStyleType: 'disc' });

        expect(descriptor).toEqual([
            'ul',
            { style: 'list-style-type: disc' },
            0
        ]);
    });

    it('should render a default list item dom descriptor', () => {
        const descriptor = listExtension.config.domSpecs!.call({
            options: {}
        } as any).nodes.listItem.toDOM({});

        expect(descriptor).toEqual([
            'li',
            {},
            0
        ]);
    });

    it('should expose four list input rules', () => {
        const rules = listExtension.config.inputRules!({} as any);

        expect(rules.length).toBe(4);

        expect(rules.map(rule => rule.id)).toEqual([
            'list:bullet-dash',
            'list:bullet-star',
            'list:bullet-plus',
            'list:ordered'
        ]);
    });

    it('should apply an ordered list through the Mod-Shift-9 keyboard shortcut', () => {
        editor.destroy();

        editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
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
                        text: 'First item',
                        marks: []
                    } as TextNode]
                }]
            },
            extensions: [
                paragraphExtension,
                listExtension
            ]
        });

        editor.mount(container);

        editor.commands.setSelection({
            from: 1,
            to: 11
        });

        const view: any = editor.integration.getView();

        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: '9',
            code: 'Digit9',
            ctrlKey: true,
            shiftKey: true,
            bubbles: true,
            cancelable: true
        }));

        expect(container.querySelector('ol')).not.toBeNull();
        expect(container.textContent).toContain('First item');
    });


});

describe('Built-in: listKeymap', () => {
    let editor: HeadlessEditor;
    let container: HTMLElement;

    function setCursorAt(root: HTMLElement, text: string, offset: number): void {
        const walker: TreeWalker = document.createTreeWalker(
            root, NodeFilter.SHOW_TEXT
        );
        let targetNode: Node | null = null;
        let node: Node | null;
        while ((node = walker.nextNode()) !== null) {
            if (node.nodeValue === text) {
                targetNode = node;
                break;
            }
        }
        if (!targetNode) {
            throw new Error(`setCursorAt: text not found in DOM: ${text}`);
        }

        const view: any = editor.integration.getView();
        const doc: any = view.state.doc;
        let targetPos: number = -1;
        doc.descendants((n: any, p: number): boolean => {
            if (targetPos !== -1) {
                return false;
            }
            if (n.isText && n.text === text) {
                targetPos = p;
                return false;
            }
            return true;
        });
        if (targetPos === -1) {
            throw new Error(`setCursorAt: text not found in PM doc: ${text}`);
        }

        const textNode: any = doc.nodeAt(targetPos);
        const textLength: number = textNode ? textNode.nodeSize : 0;
        const safeOffset: number = Math.min(Math.max(0, offset), textLength);
        const finalPos: number = targetPos + safeOffset;
        const SelCtor: any = (view.state.selection as any).constructor;
        const sel = SelCtor.create(doc, finalPos, finalPos);
        view.dispatch(view.state.tr.setSelection(sel));
    }

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);

        editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [
                    {
                        type: 'bulletList',
                        id: crypto.randomUUID(),
                        attrs: {},
                        marks: [],
                        children: [
                            {
                                type: 'listItem',
                                id: crypto.randomUUID(),
                                attrs: {},
                                marks: [],
                                children: [
                                    {
                                        type: 'paragraph',
                                        id: crypto.randomUUID(),
                                        attrs: {},
                                        marks: [],
                                        children: [
                                            {
                                                type: 'text',
                                                id: crypto.randomUUID(),
                                                attrs: {},
                                                children: [],
                                                text: 'Parent Item',
                                                marks: []
                                            } as TextNode
                                        ]
                                    },
                                    {
                                        type: 'bulletList',
                                        id: crypto.randomUUID(),
                                        attrs: {},
                                        marks: [],
                                        children: [
                                            {
                                                type: 'listItem',
                                                id: crypto.randomUUID(),
                                                attrs: {},
                                                marks: [],
                                                children: [
                                                    {
                                                        type: 'paragraph',
                                                        id: crypto.randomUUID(),
                                                        attrs: {},
                                                        marks: [],
                                                        children: [
                                                            {
                                                                type: 'text',
                                                                id: crypto.randomUUID(),
                                                                attrs: {},
                                                                children: [],
                                                                text: 'Nested Item',
                                                                marks: []
                                                            } as TextNode
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            extensions: [
                paragraphExtension,
                listExtension,
                listKeymapExtension
            ]
        });

        editor.mount(container);
    });

    afterEach(() => {
        if (editor && !editor.isDestroyed) {
            editor.destroy();
        }

        container.remove();
    });

    it('should preserve nested list structure and content', () => {
        const doc = editor.getDocument();

        expect(doc.children.length).toBe(1);
        expect(doc.children[0].type).toBe('bulletList');

        expect(container.textContent).toContain(
            'Parent Item'
        );

        expect(container.textContent).toContain(
            'Nested Item'
        );

        const rootList = doc.children[0];

        expect(rootList.children.length).toBe(1);

        expect(
            rootList.children[0].children[1].type
        ).toBe('bulletList');
    });

    it('should expose the listKeymap extension name, priority, and default listTypes', () => {
        expect(listKeymapExtension.name).toBe('listKeymap');
        expect(listKeymapExtension.config.priority).toBe(5);

        const options = listKeymapExtension.config.defineOptions!();
        expect(options.listTypes).toBeDefined();
        expect(options.listTypes!.length).toBe(2);

        const itemNames = options.listTypes!.map(entry => entry.itemName);
        expect(itemNames).toEqual(['listItem', 'taskItem']);

        const listItemEntry = options.listTypes!.find(entry => entry.itemName === 'listItem')!;
        expect(Array.from(listItemEntry.wrapperNames)).toEqual(['bulletList', 'orderedList']);

        const taskItemEntry = options.listTypes!.find(entry => entry.itemName === 'taskItem')!;
        expect(Array.from(taskItemEntry.wrapperNames)).toEqual(['taskList']);
    });

    it('should split the current list item into a new sibling when Enter is pressed at the end of the item', () => {
        editor.destroy();

        editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [
                    {
                        type: 'bulletList',
                        id: crypto.randomUUID(),
                        attrs: {},
                        marks: [],
                        children: [
                            {
                                type: 'listItem',
                                id: crypto.randomUUID(),
                                attrs: {},
                                marks: [],
                                children: [
                                    {
                                        type: 'paragraph',
                                        id: crypto.randomUUID(),
                                        attrs: {},
                                        marks: [],
                                        children: [
                                            {
                                                type: 'text',
                                                id: crypto.randomUUID(),
                                                attrs: {},
                                                children: [],
                                                text: 'Only',
                                                marks: []
                                            } as TextNode
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            extensions: [
                paragraphExtension,
                listExtension,
                listKeymapExtension
            ]
        });

        editor.mount(container);

        setCursorAt(container, 'Only', 4);

        const view: any = editor.integration.getView();
        view.focus();
        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            bubbles: true,
            cancelable: true
        }));

        const doc = editor.getDocument();
        const rootList = doc.children[0];

        expect(rootList.children.length).toBe(2);
        expect(rootList.children[0].type).toBe('listItem');
        expect(rootList.children[1].type).toBe('listItem');

        expect((rootList.children[0].children[0].children[0] as TextNode).text).toBe('Only');
        expect(rootList.children[1].children[0].type).toBe('paragraph');
        expect(rootList.children[1].children[0].children.length).toBe(0);

        expect(container.querySelectorAll('li').length).toBe(2);
    });

    it('should merge a paragraph that follows a list into the list\'s last item when Backspace is pressed at the start of the paragraph', () => {
        editor.destroy();

        editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [
                    {
                        type: 'bulletList',
                        id: crypto.randomUUID(),
                        attrs: {},
                        marks: [],
                        children: [
                            {
                                type: 'listItem',
                                id: crypto.randomUUID(),
                                attrs: {},
                                marks: [],
                                children: [
                                    {
                                        type: 'paragraph',
                                        id: crypto.randomUUID(),
                                        attrs: {},
                                        marks: [],
                                        children: [
                                            {
                                                type: 'text',
                                                id: crypto.randomUUID(),
                                                attrs: {},
                                                children: [],
                                                text: 'A',
                                                marks: []
                                            } as TextNode
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: 'paragraph',
                        id: crypto.randomUUID(),
                        attrs: {},
                        marks: [],
                        children: [
                            {
                                type: 'text',
                                id: crypto.randomUUID(),
                                attrs: {},
                                children: [],
                                text: 'B',
                                marks: []
                            } as TextNode
                        ]
                    }
                ]
            },
            extensions: [
                paragraphExtension,
                listExtension,
                listKeymapExtension
            ]
        });

        editor.mount(container);

        setCursorAt(container, 'B', 0);

        const view: any = editor.integration.getView();
        view.focus();
        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Backspace',
            code: 'Backspace',
            bubbles: true,
            cancelable: true
        }));

        const doc = editor.getDocument();

        expect(doc.children.length).toBe(1);
        expect(doc.children[0].type).toBe('bulletList');

        const rootList = doc.children[0];
        expect(rootList.children.length).toBe(1);
        expect((rootList.children[0].children[0].children[0] as TextNode).text).toBe('AB');
    });

    it('should indent the current list item when Tab is pressed', () => {
        editor.destroy();

        editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [
                    {
                        type: 'bulletList',
                        id: crypto.randomUUID(),
                        attrs: {},
                        marks: [],
                        children: [
                            {
                                type: 'listItem',
                                id: crypto.randomUUID(),
                                attrs: {},
                                marks: [],
                                children: [
                                    {
                                        type: 'paragraph',
                                        id: crypto.randomUUID(),
                                        attrs: {},
                                        marks: [],
                                        children: [
                                            {
                                                type: 'text',
                                                id: crypto.randomUUID(),
                                                attrs: {},
                                                children: [],
                                                text: 'Only',
                                                marks: []
                                            } as TextNode
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            extensions: [
                paragraphExtension,
                listExtension,
                listKeymapExtension
            ]
        });

        editor.mount(container);

        setCursorAt(container, 'Only', 0);

        const view: any = editor.integration.getView();
        view.focus();
        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Tab',
            code: 'Tab',
            shiftKey: false,
            bubbles: true,
            cancelable: true
        }));

        const doc = editor.getDocument();
        const rootList = doc.children[0];
        const outerItem = rootList.children[0];

        expect(rootList.children.length).toBe(1);
        expect(rootList.children[0].type).toBe('listItem');

        expect((rootList.children[0].children[0].children[0] as TextNode).text).toBe('Only');

        expect(container.querySelectorAll('ul').length).toBe(1);
        expect(container.querySelectorAll('li').length).toBe(1);
    });


    it('should outdent the current list item when Backspace is pressed at the start of its first child', () => {
        setCursorAt(container, 'Nested Item', 0);

        const view: any = editor.integration.getView();
        view.focus();
        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Backspace',
            code: 'Backspace',
            bubbles: true,
            cancelable: true
        }));

        const doc = editor.getDocument();
        const rootList = doc.children[0];

        expect(rootList.children.length).toBe(2);
        expect(rootList.children[0].type).toBe('listItem');
        expect(rootList.children[1].type).toBe('listItem');
        expect(container.textContent).toContain('Parent Item');
        expect(container.textContent).toContain('Nested Item');

        expect(container.querySelectorAll('ul').length).toBeGreaterThan(0);
        expect(container.querySelectorAll('li').length).toBeGreaterThan(0);
    });


    it('should treat Mod-Backspace identically to Backspace for list outdenting', () => {
        setCursorAt(container, 'Nested Item', 0);

        const view: any = editor.integration.getView();
        view.focus();
        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Backspace',
            code: 'Backspace',
            ctrlKey: true,
            bubbles: true,
            cancelable: true
        }));

        const doc = editor.getDocument();
        const rootList = doc.children[0];

        expect(rootList.children.length).toBe(2);
        expect(rootList.children[0].type).toBe('listItem');
        expect(rootList.children[1].type).toBe('listItem');

        expect(container.textContent).toContain('Parent Item');

        expect(container.textContent).toContain('Nested Item');
        expect(container.querySelectorAll('ul').length).toBeGreaterThan(0);
        expect(container.querySelectorAll('li').length).toBeGreaterThan(0);
    });

    it('should join the next list item into the current one when Delete is pressed at the end of the current item', () => {
        editor.destroy();

        editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [
                    {
                        type: 'bulletList',
                        id: crypto.randomUUID(),
                        attrs: {},
                        marks: [],
                        children: [
                            {
                                type: 'listItem',
                                id: crypto.randomUUID(),
                                attrs: {},
                                marks: [],
                                children: [
                                    {
                                        type: 'paragraph',
                                        id: crypto.randomUUID(),
                                        attrs: {},
                                        marks: [],
                                        children: [
                                            {
                                                type: 'text',
                                                id: crypto.randomUUID(),
                                                attrs: {},
                                                children: [],
                                                text: 'A',
                                                marks: []
                                            } as TextNode
                                        ]
                                    }
                                ]
                            },
                            {
                                type: 'listItem',
                                id: crypto.randomUUID(),
                                attrs: {},
                                marks: [],
                                children: [
                                    {
                                        type: 'paragraph',
                                        id: crypto.randomUUID(),
                                        attrs: {},
                                        marks: [],
                                        children: [
                                            {
                                                type: 'text',
                                                id: crypto.randomUUID(),
                                                attrs: {},
                                                children: [],
                                                text: 'B',
                                                marks: []
                                            } as TextNode
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            extensions: [
                paragraphExtension,
                listExtension,
                listKeymapExtension
            ]
        });

        editor.mount(container);

        setCursorAt(container, 'A', 1);

        const view: any = editor.integration.getView();
        view.focus();
        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Delete',
            code: 'Delete',
            bubbles: true,
            cancelable: true
        }));

        const doc = editor.getDocument();
        const rootList = doc.children[0];

        expect(rootList.children.length).toBe(1);
        expect((rootList.children[0].children[0].children[0] as TextNode).text).toBe('BA');
    });

    it('should fall through to base keymap when Delete is pressed at the end of the last item', () => {
        editor.destroy();

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
                                text: 'Only',
                                marks: []
                            } as TextNode]
                        }]
                    }]
                }]
            },
            extensions: [
                paragraphExtension,
                listExtension,
                listKeymapExtension
            ]
        });

        editor.mount(container);

        setCursorAt(container, 'Only', 4);

        const view: any = editor.integration.getView();
        view.focus();
        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Delete',
            code: 'Delete',
            bubbles: true,
            cancelable: true
        }));

        const doc = editor.getDocument();
        expect(doc.children.length).toBe(1);
        expect(doc.children[0].type).toBe('bulletList');
        expect(doc.children[0].children.length).toBe(1);
    });

    it('should fall through to base keymap when Enter is pressed in a non-list paragraph', () => {
        editor.destroy();

        editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
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
                        text: 'hello',
                        marks: []
                    } as TextNode]
                }]
            },
            extensions: [
                paragraphExtension,
                listExtension,
                listKeymapExtension
            ]
        });

        editor.mount(container);

        setCursorAt(container, 'hello', 2);

        const view: any = editor.integration.getView();
        view.focus();
        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            bubbles: true,
            cancelable: true
        }));

        const doc = editor.getDocument();
        expect(doc.children.length).toBe(2);
        expect(doc.children[0].type).toBe('paragraph');
        expect(doc.children[1].type).toBe('paragraph');
    });

    it('should fall through to base keymap when Tab is pressed in a non-list paragraph', () => {
        editor.destroy();

        editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
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
                        text: 'hi',
                        marks: []
                    } as TextNode]
                }]
            },
            extensions: [
                paragraphExtension,
                listExtension,
                listKeymapExtension
            ]
        });

        editor.mount(container);

        setCursorAt(container, 'hi', 0);

        const view: any = editor.integration.getView();
        view.focus();
        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Tab',
            code: 'Tab',
            shiftKey: false,
            bubbles: true,
            cancelable: true
        }));

        const doc = editor.getDocument();
        expect(doc.children.length).toBe(1);
        expect(doc.children[0].type).toBe('paragraph');
    });

    it('should mirror Delete behaviour when Mod-Delete is pressed', () => {
        editor.destroy();

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
                    children: [
                        {
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
                                    text: 'A',
                                    marks: []
                                } as TextNode]
                            }]
                        },
                        {
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
                                    text: 'B',
                                    marks: []
                                } as TextNode]
                            }]
                        }
                    ]
                }]
            },
            extensions: [
                paragraphExtension,
                listExtension,
                listKeymapExtension
            ]
        });

        editor.mount(container);

        setCursorAt(container, 'A', 1);

        const view: any = editor.integration.getView();
        view.focus();
        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Delete',
            code: 'Delete',
            ctrlKey: true,
            bubbles: true,
            cancelable: true
        }));

        const doc = editor.getDocument();
        const rootList = doc.children[0];
        expect(rootList.children.length).toBe(1);
    });

    it('should return false when Shift-Tab cannot outdent a list item', () => {
        const outdentListItem = jasmine
            .createSpy('outdentListItem')
            .and.returnValue(false);

        const shortcuts = listKeymapExtension.config.keyboardShortcuts.call({
            options: undefined,
            editor: {
                commands: {
                    indentListItem: jasmine.createSpy('indentListItem'),
                    outdentListItem,
                    joinListBackward: jasmine.createSpy('joinListBackward'),
                    deleteListItem: jasmine.createSpy('deleteListItem'),
                    splitListItem: jasmine.createSpy('splitListItem')
                }
            }
        } as any);

        const result = shortcuts['Shift-Tab']();

        expect(result).toBe(false);
        expect(outdentListItem).toHaveBeenCalled();
    });


    it('should fall back to DEFAULT_LIST_TYPES when no listTypes option is provided', () => {
        const editor2: any = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
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
                        text: 'hi',
                        marks: []
                    } as TextNode]
                }]
            },
            extensions: [
                paragraphExtension,
                listExtension,
                {
                    ...listKeymapExtension
                }
            ]
        });

        const container2 = document.createElement('div');
        document.body.appendChild(container2);
        editor2.mount(container2);

        const shortcuts = listKeymapExtension.config.keyboardShortcuts!.call({
            editor: editor2,
            options: {}
        } as any);

        expect(typeof shortcuts['Backspace']).toBe('function');
        expect(typeof shortcuts['Mod-Backspace']).toBe('function');
        expect(typeof shortcuts['Delete']).toBe('function');
        expect(typeof shortcuts['Mod-Delete']).toBe('function');
        expect(typeof shortcuts['Tab']).toBe('function');
        expect(typeof shortcuts['Shift-Tab']).toBe('function');
        expect(typeof shortcuts['Enter']).toBe('function');

        editor2.destroy();
        container2.remove();
    });

    it('should invoke indent and outdent commands through Tab and Shift-Tab shortcuts', () => {
        const indentListItem = jasmine
            .createSpy('indentListItem')
            .and.returnValue(true);

        const outdentListItem = jasmine
            .createSpy('outdentListItem')
            .and.returnValue(true);

        const shortcuts = listKeymapExtension.config.keyboardShortcuts.call({
            options: undefined,
            editor: {
                commands: {
                    indentListItem,
                    outdentListItem,
                    joinListBackward: jasmine.createSpy('joinListBackward'),
                    deleteListItem: jasmine.createSpy('deleteListItem'),
                    splitListItem: jasmine.createSpy('splitListItem')
                }
            }
        } as any);

        const tabResult = shortcuts['Tab']();
        const shiftTabResult = shortcuts['Shift-Tab']();

        expect(tabResult).toBe(true);
        expect(shiftTabResult).toBe(true);

        expect(indentListItem).toHaveBeenCalled();
        expect(outdentListItem).toHaveBeenCalled();
    });

    it('should fall through when Backspace is pressed in the middle of paragraph text', () => {
        editor.destroy();

        editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
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
                        text: 'hello',
                        marks: []
                    } as TextNode]
                }]
            },
            extensions: [
                paragraphExtension,
                listExtension,
                listKeymapExtension
            ]
        });

        editor.mount(container);

        setCursorAt(container, 'hello', 3);

        const view: any = editor.integration.getView();
        view.focus();
        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Backspace',
            code: 'Backspace',
            bubbles: true,
            cancelable: true
        }));

        const doc = editor.getDocument();
        expect(doc.children.length).toBe(1);
        expect(doc.children[0].type).toBe('paragraph');
        expect((doc.children[0].children[0] as TextNode).text).toBe('hello');
    });

    // ── Regression: listItem group fix + listStyleType preservation ──────

    function createThreeItemStyleListEditor(root: HTMLElement): HeadlessEditor {
        const createEditor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [
                    {
                        type: 'bulletList',
                        id: crypto.randomUUID(),
                        attrs: { listStyleType: 'circle' },
                        marks: [],
                        children: [
                            {
                                type: 'listItem',
                                id: crypto.randomUUID(),
                                attrs: {},
                                marks: [],
                                children: [
                                    {
                                        type: 'paragraph',
                                        id: crypto.randomUUID(),
                                        attrs: {},
                                        marks: [],
                                        children: [
                                            {
                                                type: 'text',
                                                id: crypto.randomUUID(),
                                                attrs: {},
                                                children: [],
                                                text: 'First bullet item',
                                                marks: []
                                            } as TextNode
                                        ]
                                    }
                                ]
                            },
                            {
                                type: 'listItem',
                                id: crypto.randomUUID(),
                                attrs: {},
                                marks: [],
                                children: [
                                    {
                                        type: 'paragraph',
                                        id: crypto.randomUUID(),
                                        attrs: {},
                                        marks: [],
                                        children: [
                                            {
                                                type: 'text',
                                                id: crypto.randomUUID(),
                                                attrs: {},
                                                children: [],
                                                text: 'Second bullet item',
                                                marks: []
                                            } as TextNode
                                        ]
                                    }
                                ]
                            },
                            {
                                type: 'listItem',
                                id: crypto.randomUUID(),
                                attrs: {},
                                marks: [],
                                children: [
                                    {
                                        type: 'paragraph',
                                        id: crypto.randomUUID(),
                                        attrs: {},
                                        marks: [],
                                        children: [
                                            {
                                                type: 'text',
                                                id: crypto.randomUUID(),
                                                attrs: {},
                                                children: [],
                                                text: 'Third bullet item',
                                                marks: []
                                            } as TextNode
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            extensions: [
                paragraphExtension,
                listExtension,
                listKeymapExtension
            ]
        });

        createEditor.mount(root);
        return createEditor;
    }

    function pressTab(shift: boolean): void {
        const view: any = editor.integration.getView();
        view.focus();
        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Tab',
            code: 'Tab',
            shiftKey: shift,
            bubbles: true,
            cancelable: true
        }));
    }

    it('should preserve list style type and restore the original structure when an indented list item is outdented', () => {
        editor.destroy();
        editor = createThreeItemStyleListEditor(container);
        setCursorAt(container, 'Second bullet item', 0);

        // Initial state: one circle-styled list with three items.
        let doc = editor.getDocument();
        expect(doc.children.length).toBe(1);
        expect(doc.children[0].type).toBe('bulletList');
        expect(doc.children[0].attrs['listStyleType']).toBe('circle');
        expect(doc.children[0].children.length).toBe(3);

        // Press Tab — the second item nests under the first.
        pressTab(false);

        doc = editor.getDocument();
        expect(doc.children.length).toBe(1);
        expect(doc.children[0].type).toBe('bulletList');
        expect(doc.children[0].attrs['listStyleType']).toBe('circle');

        const outerList = doc.children[0];
        // Outer list keeps exactly two items: first and third remain siblings.
        expect(outerList.children.length).toBe(2);
        expect((outerList.children[0].children[0].children[0] as TextNode).text).toBe('First bullet item');
        expect((outerList.children[1].children[0].children[0] as TextNode).text).toBe('Third bullet item');

        // The first item now ends with a newly created nested list holding the second item.
        const nestedList = outerList.children[0].children[1];
        expect(nestedList.type).toBe('bulletList');
        expect(nestedList.attrs['listStyleType']).toBe('disc');
        expect(nestedList.children.length).toBe(1);
        expect((nestedList.children[0].children[0].children[0] as TextNode).text).toBe('Second bullet item');

        // DOM agrees with the model: one nested ul, two li in the outer list.
        const uls = container.querySelectorAll('ul');
        expect(uls.length).toBe(2);
        expect(uls[0].getAttribute('style')).toContain('list-style-type: circle');
        expect(uls[1].getAttribute('style')).toContain('list-style-type: disc');

        // Press Shift+Tab — the second item returns to the outer list.
        pressTab(true);

        doc = editor.getDocument();
        expect(doc.children.length).toBe(1);
        const restoredList = doc.children[0];
        expect(restoredList.type).toBe('bulletList');
        expect(restoredList.attrs['listStyleType']).toBe('circle');
        expect(restoredList.children.length).toBe(3);
        expect((restoredList.children[0].children[0].children[0] as TextNode).text).toBe('First bullet item');
        expect((restoredList.children[1].children[0].children[0] as TextNode).text).toBe('Second bullet item');
        expect((restoredList.children[2].children[0].children[0] as TextNode).text).toBe('Third bullet item');

        // Each restored item is a direct listItem child (no leftover nested list).
        expect(restoredList.children.filter(child => child.type === 'bulletList').length).toBe(0);

        // No nested ul survives in the DOM.
        expect(container.querySelectorAll('ul').length).toBe(1);
        expect(container.querySelectorAll('li').length).toBe(3);
        expect(container.querySelector('ul')!.getAttribute('style')).toContain('list-style-type: circle');
    });

    it('should lift only the focused list item when outdenting a top-level list item', () => {
        editor.destroy();
        editor = createThreeItemStyleListEditor(container);
        setCursorAt(container, 'Second bullet item', 0);

        // Nest the second item, then outdent it back to the top level.
        pressTab(false);
        pressTab(true);

        let doc = editor.getDocument();
        expect(doc.children[0].children.length).toBe(3);

        // Press Shift+Tab again — only the focused second item may move.
        pressTab(true);

        doc = editor.getDocument();

        // The second item left the list as a sibling paragraph.
        const liftedTexts: string[] = [];
        doc.children.forEach(child => {
            if (child.type === 'paragraph') {
                liftedTexts.push((child.children[0] as TextNode).text);
            }
        });
        expect(liftedTexts).toEqual(['Second bullet item']);

        // First and third items stay in the circle-styled bullet list.
        const lists = doc.children.filter(child => child.type === 'bulletList');
        expect(lists.length).toBe(2);
        expect(lists[0].attrs['listStyleType']).toBe('circle');
        expect(lists[0].children.length).toBe(1);
        expect((lists[0].children[0].children[0].children[0] as TextNode).text).toBe('First bullet item');
        expect(lists[1].children.length).toBe(1);
        expect((lists[1].children[0].children[0].children[0] as TextNode).text).toBe('Third bullet item');

        // DOM: exactly two ul (still circle-styled) holding li, plus a paragraph.
        expect(container.querySelectorAll('ul').length).toBe(2);
        expect(container.querySelectorAll('li').length).toBe(2);
        expect(container.querySelector('ul')!.getAttribute('style')).toContain('list-style-type: circle');
        expect(container.querySelectorAll('p')[1]!.textContent).toBe('Second bullet item');
    });
});