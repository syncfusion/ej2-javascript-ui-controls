import { HeadlessEditor, TextNode, paragraphExtension, headingExtension, undoRedoExtension } from '../../../src/index';
import { horizontalRuleExtension } from '../../../src/extensions/builtins/horizontal-rule';
import { listExtension } from '../../../src/extensions/builtins/list';
import { tableExtension } from '../../../src/extensions/builtins/table';

describe('Built-in: horizontalRule metadata', () => {
    const scope = { options: { htmlAttributes: {} } } as any;
    const ctx = {} as any;
    const getNodes = () =>
        horizontalRuleExtension.config.nodes!.call(scope, ctx);
    const getCommands = () =>
        horizontalRuleExtension.config.commands!.call(scope, ctx);
    const getInputRules = () =>
        horizontalRuleExtension.config.inputRules!.call(scope, ctx);
    const getDomSpecs = () =>
        horizontalRuleExtension.config.domSpecs!.call(scope);

    it('should have correct name', () => {
        expect(horizontalRuleExtension.name).toBe('horizontalRule');
    });

    it('should expose setHorizontalRule command', () => {
        const names = getCommands().map((c: { name: string }) => c.name);
        expect(names).toContain('setHorizontalRule');
    });

    it('should register horizontalRule node definition', () => {
        expect(getNodes().some((n: { name: string }) => n.name === 'horizontalRule')).toBe(true);
    });

    it('should register horizontalRule as a block leaf node', () => {
        const node = getNodes().find((n: { name: string }) => n.name === 'horizontalRule');
        expect(node).toBeDefined();
        expect(node.group).toBe('block');
        expect(node.leaf).toBe(true);
    });

    it('should provide default extension options', () => {
        expect(horizontalRuleExtension.config.defineOptions!()).toEqual({htmlAttributes: {}});
    });

    it('should register three input rules', () => {
        expect(getInputRules().length).toBe(3);
    });

    it('should register dash divider input rule', () => {
        expect(getInputRules().some((r: { id: string }) => r.id === 'divider:dash')).toBe(true);
    });

    it('should register asterisk divider input rule', () => {
        expect(getInputRules().some((r: { id: string }) => r.id === 'divider:asterisk')).toBe(true);
    });

    it('should register underscore divider input rule', () => {
        expect(getInputRules().some((r: { id: string }) => r.id === 'divider:underscore')).toBe(true);
    });

    it('should expose horizontalRule dom specs', () => {
        expect(getDomSpecs().nodes.horizontalRule).toBeDefined();
    });

    it('should serialize horizontalRule to hr element', () => {
        const output = getDomSpecs().nodes.horizontalRule.toDOM();
        expect(output[0]).toBe('hr');
    });

    it('should register hr parseDOM rule', () => {
        expect(getDomSpecs().nodes.horizontalRule.parseDOM[0].tag).toBe('hr');
    });

    it('should pass custom html attributes to DOM output', () => {
        const domSpecs = horizontalRuleExtension.config.domSpecs!.call({
                options: {
                    htmlAttributes: {
                        class: 'divider',
                        role: 'separator',
                        'data-testid': 'horizontal-rule'
                    }
                }
            } as any);
        const output = domSpecs.nodes.horizontalRule.toDOM();
        expect(output).toEqual([
            'hr',
            {
                class: 'divider',
                role: 'separator',
                'data-testid': 'horizontal-rule'
            }
        ]);
    });
});

describe('Built-in: horizontalRule rendering and integration', () => {
    let editor: HeadlessEditor;
    let container: HTMLElement;

    function textNode(text: string): TextNode {
        return {
            type: 'text',
            id: crypto.randomUUID(),
            attrs: {},
            children: [],
            text,
            marks: []
        } as TextNode;
    }

    function paragraph(text: string): any {
        return {
            type: 'paragraph',
            id: crypto.randomUUID(),
            attrs: {},
            marks: [],
            children: [textNode(text)]
        };
    }

    function heading(text: string): any {
        return {
            type: 'heading',
            id: crypto.randomUUID(),
            attrs: {
                level: 1
            },
            marks: [],
            children: [textNode(text)]
        };
    }

    function horizontalRule(): any {
        return {
            type: 'horizontalRule',
            id: crypto.randomUUID(),
            attrs: {},
            marks: [],
            children: []
        };
    }

    function createEditor(children: any[]): void {
        container = document.createElement('div');
        document.body.appendChild(container);
        editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children
            },
            extensions: [
                paragraphExtension,
                headingExtension,
                horizontalRuleExtension,
                listExtension,
                tableExtension,
                undoRedoExtension
            ]
        });
        editor.mount(container);
    }

    afterEach(() => {
        if (editor && !editor.isDestroyed) {
            editor.destroy();
        }
        if (container) {
            container.remove();
        }
    });

    it('should render horizontalRule as the only block element', () => {
        createEditor([horizontalRule()]);
        expect(editor.getHtml()).toContain('<hr');
    });

    it('should render horizontalRule before a paragraph', () => {
        createEditor([
            horizontalRule(),
            paragraph('Paragraph Content')
        ]);
        const html = editor.getHtml();
        expect(html).toContain('<hr');
        expect(html).toContain('Paragraph Content');
    });

    it('should render horizontalRule after a paragraph', () => {
        createEditor([
            paragraph('Paragraph Content'),
            horizontalRule()
        ]);
        const html = editor.getHtml();
        expect(html).toContain('<hr');
        expect(html).toContain('Paragraph Content');
    });

    it('should render horizontalRule between two paragraphs', () => {
        createEditor([
            paragraph('Paragraph One'),
            horizontalRule(),
            paragraph('Paragraph Two')
        ]);
        const html = editor.getHtml();
        expect(html).toContain('Paragraph One');
        expect(html).toContain('Paragraph Two');
        expect(html).toContain('<hr');
    });

    it('should render horizontalRule between heading and paragraph', () => {
        createEditor([
            heading('Heading One'),
            horizontalRule(),
            paragraph('Paragraph One')
        ]);
        const html = editor.getHtml();
        expect(html).toContain('Heading One');
        expect(html).toContain('Paragraph One');
        expect(html).toContain('<hr');
    });

    it('should render multiple horizontal rules', () => {
        createEditor([
            horizontalRule(),
            horizontalRule()
        ]);
        const html = editor.getHtml();
        expect((html.match(/<hr/g) || []).length).toBe(2);
    });

    it('should render horizontalRule after bullet list', () => {
        createEditor([
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
                            paragraph('Bullet Item')
                        ]
                    }
                ]
            },
            horizontalRule(),
            paragraph('After List')
        ]);
        const html = editor.getHtml();
        expect(html).toContain('<ul');
        expect(html).toContain('<hr');
        expect(html).toContain('After List');
    });

    it('should render horizontalRule before bullet list', () => {
        createEditor([
            horizontalRule(),
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
                            paragraph('Bullet Item')
                        ]
                    }
                ]
            }
        ]);
        const html = editor.getHtml();
        expect(html).toContain('<hr');
        expect(html).toContain('<ul');
    });

    it('should render horizontalRule between two bullet lists', () => {
        createEditor([
            {
                type: 'bulletList',
                id: crypto.randomUUID(),
                attrs: {},
                marks: [],
                children: [{
                    type: 'listItem',
                    id: crypto.randomUUID(),
                    attrs: {},
                    marks: [],
                    children: [paragraph('List One')]
                }]
            },
            horizontalRule(),
            {
                type: 'bulletList',
                id: crypto.randomUUID(),
                attrs: {},
                marks: [],
                children: [{
                    type: 'listItem',
                    id: crypto.randomUUID(),
                    attrs: {},
                    marks: [],
                    children: [paragraph('List Two')]
                }]
            }
        ]);
        const html = editor.getHtml();
        expect(html).toContain('List One');
        expect(html).toContain('List Two');
        expect(html).toContain('<hr');
    });

    it('should render horizontalRule inside list item', () => {
        createEditor([
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
                            paragraph('Top Content'),
                            horizontalRule(),
                            paragraph('Bottom Content')
                        ]
                    }
                ]
            }
        ]);
        const html = editor.getHtml();
        expect(html).toContain('Top Content');
        expect(html).toContain('Bottom Content');
        expect(html).toContain('<hr');
    });

    it('should insert a horizontalRule at the cursor when setHorizontalRule is invoked', () => {
        createEditor([paragraph('Before'), paragraph('After')]);
        // End of "Before" inside the first paragraph (paragraph(1) + "Before"(1..7))
        editor.commands.setSelection({ from: 8, to: 8 });
        editor.commands.setHorizontalRule();

        const html: string = editor.getHtml();
        expect(html).toContain('<hr');
        expect(html).toContain('Before');
        expect(html).toContain('After');
    });
});