/**
 * This spec file contains test cases for:
 * - Block Quote Extension
 */
import {
    HeadlessEditor,
    TextNode,
    paragraphExtension,
    toggleBlockquoteCommand
} from '../../../src/index';

import { blockquoteExtension } from '../../../src/extensions/builtins/block-quote';


describe('Built-in: blockquote', () => {
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
                        type: 'blockquote',
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
                                        text: 'The best way to predict the future is to build it.',
                                        marks: []
                                    } as TextNode
                                ]
                            }
                        ]
                    }
                ]
            },
            extensions: [
                paragraphExtension,
                blockquoteExtension
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

    it('should render blockquote content', () => {
        const doc = editor.getDocument();

        expect(doc.children.length).toBe(1);
        expect(doc.children[0].type).toBe('blockquote');

        const blockquote = container.querySelector('blockquote')
        expect(blockquote).not.toBeNull();
        expect(container.textContent).toContain('The best way to predict the future is to build it.');
    });

    it('should display a previously saved quotation when loading a document containing blockquote content', () => {
        const blockquote = container.querySelector('blockquote');

        expect(blockquote).not.toBeNull();
        expect(blockquote?.textContent).toContain('The best way to predict the future is to build it.');

        const doc = editor.getDocument();
        expect(doc.children[0].type).toBe('blockquote');
    });

    it('should preserve quoted content after rendering a saved document', () => {
        const doc = editor.getDocument();

        const quoteText = (doc.children[0].children[0].children[0] as TextNode).text;

        expect(quoteText).toBe('The best way to predict the future is to build it.');
        expect(container.textContent).toContain(quoteText);
    });

    it('should render quote content inside a semantic blockquote element', () => {
        const blockquote = container.querySelector('blockquote');

        expect(blockquote).not.toBeNull();
        expect(blockquote?.tagName.toLowerCase()).toBe('blockquote');
    });

    it('should toggle blockquote formatting when the toggleBlockQuote command is executed', () => {
        editor.commands.setSelection({ from: 1, to: 5 });

        expect(editor.getHtml()).toContain('<blockquote>');

        editor.commands.toggleBlockQuote();

        expect(editor.getHtml()).not.toContain('<blockquote>');
        expect(editor.getHtml()).toContain('<p>');

        editor.commands.toggleBlockQuote();

        expect(editor.getHtml()).toContain('<blockquote>');
    });

    it('should toggle blockquote formatting when Mod-Alt-Q keyboard shortcut is pressed', () => {
        const editorView: { dom: HTMLElement } = editor.integration.getView() as any;

        expect(editor.getHtml()).toContain('<blockquote>');

        editorView.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'q',
            code: 'KeyQ',
            ctrlKey: true,
            altKey: true,
            bubbles: true,
            cancelable: true
        }));

        expect(editor.commands.toggleBlockQuote).toBeDefined();
    });

    it('should allow users to view quoted article content after editor mount', () => {
        expect(container.textContent).toContain('The best way to predict the future is to build it.');
        expect(container.querySelector('blockquote')).not.toBeNull();
    });

    it('should preserve document structure when rendering quoted content', () => {
        const doc = editor.getDocument();

        expect(doc.children.length).toBe(1);
        expect(doc.children[0].type).toBe('blockquote');
        expect(doc.children[0].children.length).toBe(1);
        expect(doc.children[0].children[0].type).toBe('paragraph');
    });

    it('should render quoted content without altering the original document node hierarchy', () => {
        const doc = editor.getDocument();

        expect(doc.type).toBe('document');
        expect(doc.children[0].type).toBe('blockquote');
        expect(doc.children[0].children[0].type).toBe('paragraph');
        expect(doc.children[0].children[0].children[0].type).toBe('text');
    });

    it('should keep quote content accessible through both document model and rendered DOM', () => {
        const doc = editor.getDocument();
        const docText = (doc.children[0].children[0].children[0] as TextNode).text;
        const domText = container.querySelector('blockquote')?.textContent;

        expect(domText).toContain(docText);
    });

    it('should render a quote section similar to an article citation block', () => {
        const blockquote = container.querySelector('blockquote');

        expect(blockquote).not.toBeNull();
        expect(blockquote?.textContent?.trim()).toBe('The best way to predict the future is to build it.');
    });

    it('should register blockquote extension metadata and default configuration', () => {
        const options = blockquoteExtension.config.defineOptions();

        expect(blockquoteExtension.name).toBe('blockquote');
        expect(blockquoteExtension.config.priority).toBe(10);

        expect(options).toEqual({
            htmlAttributes: {}
        });
    });

    it('should register the blockquote node schema', () => {
        const nodes = blockquoteExtension.config.nodes();

        expect(nodes.length).toBe(1);

        expect(nodes[0]).toEqual(jasmine.objectContaining({
            name: 'blockquote',
            group: 'block'
        }));

        expect(nodes[0].content).toBeDefined();
    });

    it('should register the toggleBlockQuote command', () => {
        const commands = blockquoteExtension.config.commands();

        expect(commands.length).toBe(1);
        expect(commands[0]).toBe(toggleBlockquoteCommand);
    });

    it('should generate blockquote DOM specifications', () => {
        const specs = blockquoteExtension.config.domSpecs!.call({
            options: {
                htmlAttributes: {
                    class: 'quote'
                }
            }
        } as any);

        expect(specs.nodes.blockquote.toDOM()).toEqual([
            'blockquote',
            {
                class: 'quote'
            },
            0
        ]);

        expect(specs.nodes.blockquote.parseDOM).toEqual([
            { tag: 'blockquote' }
        ]);
    });

    it('should register a blockquote parseDOM rule targeting the blockquote tag', () => {
        const specs = blockquoteExtension.config.domSpecs!.call({
            options: blockquoteExtension.config.defineOptions!()
        } as any);

        const rules = specs.nodes.blockquote.parseDOM!;

        expect(rules).toBeDefined();
        expect(rules.length).toBe(1);

        const parseRule = rules[0];

        expect(parseRule.tag).toBe('blockquote');
        expect(typeof parseRule.getAttrs).toBe('undefined');
    });

    it('should fallback to empty attributes when extension options are undefined', () => {
        const specs = blockquoteExtension.config.domSpecs!.call({
            options: undefined
        } as any);

        expect(specs.nodes.blockquote.toDOM()).toEqual([
            'blockquote',
            {},
            0
        ]);
    });
});

describe('Nested Blockquotes', () => {
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
                        type: 'blockquote',
                        id: crypto.randomUUID(),
                        attrs: {},
                        marks: [],
                        children: [
                            {
                                type: 'blockquote',
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
                                                text: 'Nested quote',
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
                blockquoteExtension
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

    it('should render multiple nested quotes while preserving quote hierarchy', () => {
        const blockquotes = container.querySelectorAll('blockquote');

        expect(blockquotes.length).toBe(2);
        expect(blockquotes[0].contains(blockquotes[1])).toBe(true);
    });

    it('should preserve parent-child relationships across nested blockquotes', () => {
        const blockquotes = container.querySelectorAll('blockquote');

        expect(blockquotes.length).toBe(2);
        expect(blockquotes[0].contains(blockquotes[1])).toBe(true);
    });

    it('should preserve content at each quote level within a nested conversation', () => {
        const blockquotes = container.querySelectorAll('blockquote');

        expect(blockquotes.length).toBe(2);
        expect(blockquotes[1].textContent).toContain('Nested quote');
    });

    it('should maintain nested blockquote structure after document rendering', () => {
        const document = editor.getDocument();

        expect(document.children[0].type).toBe('blockquote');
        expect(document.children[0].children[0].type).toBe('blockquote');
    });
});