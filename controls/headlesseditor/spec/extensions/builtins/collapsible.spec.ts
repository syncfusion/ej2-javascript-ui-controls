/**
 * This spec file contains test cases for:
 * - Collapsible Extension
 */

import {
    HeadlessEditor,
    TextNode,
    paragraphExtension,
    headingExtension,
    undoRedoExtension
} from '../../../src/index';

import { collapsibleExtension } from '../../../src/extensions/builtins/collapsible';

describe('Built-in: collapsible', () => {
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
                        type: 'collapsible',
                        id: crypto.randomUUID(),
                        attrs: {
                            collapsed: false
                        },
                        marks: [],
                        children: [
                            {
                                type: 'collapsibleHeader',
                                id: crypto.randomUUID(),
                                attrs: {},
                                marks: [],
                                children: [
                                    {
                                        type: 'heading',
                                        id: crypto.randomUUID(),
                                        attrs: {
                                            level: 1
                                        },
                                        marks: [],
                                        children: [
                                            {
                                                type: 'text',
                                                id: crypto.randomUUID(),
                                                attrs: {},
                                                children: [],
                                                text: 'Click to expand/collapse',
                                                marks: []
                                            } as TextNode
                                        ]
                                    }
                                ]
                            },
                            {
                                type: 'collapsibleBody',
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
                                                text: 'This is collapsible body content.',
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
                headingExtension,
                collapsibleExtension,
                undoRedoExtension
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

    it('should render collapsible header and body content', () => {
        const html = editor.getHtml();

        expect(html).toContain('Click to expand/collapse');
        expect(html).toContain('This is collapsible body content.');

        expect(container.textContent).toContain(
            'Click to expand/collapse'
        );

        expect(container.textContent).toContain(
            'This is collapsible body content.'
        );
    });

    it('should expose the collapsible name, priority, and independent defaults', () => {
        expect(collapsibleExtension.name).toBe('collapsible');
        expect(collapsibleExtension.config.priority).toBe(10);
        const first = collapsibleExtension.config.defineOptions!();
        const second = collapsibleExtension.config.defineOptions!();
        expect(first).toEqual({
            htmlAttributes: {}
        });
        expect(first).not.toBe(second);
    });

    it('should preserve configured options without changing the base extension', () => {
        const configured = collapsibleExtension.configure({
            htmlAttributes: { class: 'editor-collapsible' }
        });

        expect(configured.config.defineOptions!()).toEqual({
            htmlAttributes: { class: 'editor-collapsible' }
        });
        expect(collapsibleExtension.config.defineOptions!().htmlAttributes).toEqual({});
    });

    it('should define the three collapsible nodes and their attributes', () => {
        const nodes = collapsibleExtension.config.nodes!();
        expect(nodes.map((node: any) => node.name)).toEqual([
            'collapsible', 'collapsibleHeader', 'collapsibleBody'
        ]);
        expect(nodes[0].group).toBe('block');
        expect(nodes[0].attrs).toEqual([
            { name: 'collapsed', type: 'boolean', default: false }
        ]);
    });

    it('should define the header choice and body block content contracts', () => {
        const nodes = collapsibleExtension.config.nodes!() as any[];
        expect(nodes[0].content._tree.children.map((child: any) => child.name))
            .toEqual(['collapsibleHeader', 'collapsibleBody']);
        expect(nodes[1].content._tree.children.map((child: any) => child.name))
            .toEqual(['heading', 'paragraph']);
        expect(nodes[2].content._tree).toEqual(jasmine.objectContaining({
            kind: 'group',
            name: 'block',
            quantifier: 'zeroOrMore'
        }));
    });

    it('should register the three collapsible commands', () => {
        expect(collapsibleExtension.config.commands!().map((command: any) => command.name))
            .toEqual(['toggleCollapsible', 'collapse', 'expand']);
    });

    it('should register all collapsible keyboard shortcuts', () => {
        const shortcuts = collapsibleExtension.config.keyboardShortcuts!.call({ editor } as any);
        expect(Object.keys(shortcuts)).toEqual(['Mod-Alt-[', 'Mod-Alt-,', 'Mod-Alt-.']);
    });

    it('should serialize expanded and collapsed fallback DOM states', () => {
        const specs: any = collapsibleExtension.config.domSpecs!.call({ options: {} } as any);
        expect(specs.nodes.collapsible.toDOM({ collapsed: false })).toEqual([
            'div', { 'data-type': 'collapsible', 'data-collapsed': 'false' }, 0
        ]);
        expect(specs.nodes.collapsible.toDOM({ collapsed: true })).toEqual([
            'div', { 'data-type': 'collapsible', 'data-collapsed': 'true' }, 0
        ]);
    });

    it('should treat only boolean true as collapsed in fallback DOM', () => {
        const specs: any = collapsibleExtension.config.domSpecs!.call({ options: {} } as any);
        expect(specs.nodes.collapsible.toDOM({ collapsed: 'true' })[1]['data-collapsed']).toBe('false');
        expect(specs.nodes.collapsible.toDOM({ collapsed: 1 })[1]['data-collapsed']).toBe('false');
    });

    it('should merge custom attributes and protect required fallback attributes', () => {
        const specs: any = collapsibleExtension.config.domSpecs!.call({
            options: {
                htmlAttributes: {
                    class: 'editor-collapsible',
                    'data-type': 'wrong',
                    'data-collapsed': 'wrong'
                }
            }
        } as any);
        expect(specs.nodes.collapsible.toDOM({ collapsed: true })[1]).toEqual({
            class: 'editor-collapsible',
            'data-type': 'collapsible',
            'data-collapsed': 'true'
        });
    });

    it('should serialize header and body fallback DOM specs', () => {
        const specs: any = collapsibleExtension.config.domSpecs!.call({ options: {} } as any);
        expect(specs.nodes.collapsibleHeader.toDOM()).toEqual([
            'div', { 'data-role': 'collapsible-header' }, 0
        ]);
        expect(specs.nodes.collapsibleBody.toDOM()).toEqual([
            'div', { 'data-role': 'collapsible-body-content' }, 0
        ]);
    });

    it('should create an expanded outer NodeView with a content container', () => {
        const views = collapsibleExtension.config.nodeViews!.call({ options: {} } as any);
        const descriptor = views.collapsible({ collapsed: false }, undefined, () => 1);
        expect(descriptor.dom.getAttribute('data-type')).toBe('collapsible');
        expect(descriptor.dom.getAttribute('data-collapsed')).toBe('false');
        expect(descriptor.contentDOM).toBe(descriptor.dom.querySelector('[data-role="collapsible-content"]'));
    });

    it('should create a collapsed outer NodeView with custom attributes', () => {
        const views = collapsibleExtension.config.nodeViews!.call({
            options: { htmlAttributes: { class: 'custom' } }
        } as any);
        const descriptor = views.collapsible({ collapsed: true }, undefined, () => 1);
        expect(descriptor.dom.getAttribute('data-collapsed')).toBe('true');
        expect(descriptor.dom.getAttribute('class')).toBe('custom');
    });

    it('should update outer NodeView body visibility in both directions', () => {
        const views = collapsibleExtension.config.nodeViews!.call({ options: {} } as any);
        const descriptor = views.collapsible({ collapsed: false }, undefined, () => 1);
        const body = document.createElement('div');
        body.setAttribute('data-role', 'collapsible-body-content');
        descriptor.contentDOM!.appendChild(body);

        expect(descriptor.update!({ collapsed: true })).toBe(true);
        expect(descriptor.dom.getAttribute('data-collapsed')).toBe('true');
        expect(body.style.display).toBe('none');
        expect(descriptor.update!({ collapsed: false })).toBe(true);
        expect(descriptor.dom.getAttribute('data-collapsed')).toBe('false');
        expect(body.style.display).toBe('');
    });

    it('should update outer NodeView when body and button are absent', () => {
        const views = collapsibleExtension.config.nodeViews!.call({ options: {} } as any);
        const descriptor = views.collapsible({ collapsed: false }, undefined, () => 1);
        expect(descriptor.update!({ collapsed: true })).toBe(true);
        expect(descriptor.dom.getAttribute('data-collapsed')).toBe('true');
    });

    it('should synchronize the toggle button SVG during outer NodeView updates', () => {
        const views = collapsibleExtension.config.nodeViews!.call({ options: {} } as any);
        const descriptor = views.collapsible({ collapsed: false }, undefined, () => 1);
        // Simulate the button rendered into the header child NodeView.
        const button = document.createElement('button');
        button.className = 'e-toggle-btn';
        button.innerHTML = '<svg data-icon="expand"></svg>';
        descriptor.dom.appendChild(button);

        descriptor.update!({ collapsed: true });
        // update() should swap the icon to the "collapse" SVG.
        expect(button.querySelector('svg')).not.toBeNull();
        expect(button.querySelector('svg path')?.getAttribute('fill')).toBe('#424242');
        descriptor.update!({ collapsed: false });
        expect(button.querySelector('svg')).not.toBeNull();
        expect(button.querySelector('svg path')?.getAttribute('fill')).toBe('#424242');
    });

    it('should create an expanded header NodeView with a non-editable button and an "expand" SVG icon', () => {
        const views = collapsibleExtension.config.nodeViews!.call({
            options: {}
        } as any);
        const descriptor = views.collapsibleHeader({}, undefined, () => undefined);
        const button = descriptor.dom.querySelector('button') as HTMLButtonElement;
        expect(descriptor.dom.getAttribute('data-role')).toBe('collapsible-header');
        expect(button.getAttribute('contenteditable')).toBe('false');
        expect(button.className).toBe('e-toggle-btn');
        expect(button.querySelector('svg')).not.toBeNull();
        expect(descriptor.contentDOM!.className).toBe('e-collapsible-header-content');
    });

    it('should initialize a header button with the "collapse" SVG from a collapsed ancestor', () => {
        const views = collapsibleExtension.config.nodeViews!.call({ options: {} } as any);
        const view = {
            state: {
                doc: {
                    resolve: () => ({
                        depth: 2,
                        node: (depth: number) => depth === 1
                            ? { type: { name: 'collapsible' }, attrs: { collapsed: true } }
                            : { type: { name: 'collapsibleHeader' }, attrs: {} }
                    })
                }
            }
        };
        const descriptor = views.collapsibleHeader({}, view, () => 2);
        const button = descriptor.dom.querySelector('button') as HTMLButtonElement;
        expect(button.className).toBe('e-toggle-btn');
        expect(button.querySelector('svg')).not.toBeNull();
    });

    it('should fall back to the "expand" SVG when ancestor context is unavailable', () => {
        const views = collapsibleExtension.config.nodeViews!.call({ options: {} } as any);
        const noView = views.collapsibleHeader({}, undefined, () => 1);
        const noPosition = views.collapsibleHeader({}, {} as any, () => undefined);
        for (const descriptor of [noView, noPosition]) {
            const button = descriptor.dom.querySelector('button') as HTMLButtonElement;
            expect(button.className).toBe('e-toggle-btn');
            expect(button.querySelector('svg')).not.toBeNull();
        }
    });

    it('should fall back to the "expand" SVG when no collapsible ancestor is found', () => {
        const views = collapsibleExtension.config.nodeViews!.call({ options: {} } as any);
        const descriptor = views.collapsibleHeader({}, {
            state: {
                doc: {
                    resolve: () => ({
                        depth: 1,
                        node: () => ({ type: { name: 'paragraph' }, attrs: {} })
                    })
                }
            }
        } as any, () => 1);
        const button = descriptor.dom.querySelector('button') as HTMLButtonElement;
        expect(button.className).toBe('e-toggle-btn');
        expect(button.querySelector('svg')).not.toBeNull();
    });

    it('should create a body NodeView with itself as content DOM', () => {
        const views = collapsibleExtension.config.nodeViews!.call({} as any);
        const descriptor = views.collapsibleBody({}, undefined, () => undefined);
        expect(descriptor.dom.getAttribute('data-role')).toBe('collapsible-body-content');
        expect(descriptor.dom.className).toBe('e-collapsible-body-content');
        expect(descriptor.contentDOM).toBe(descriptor.dom);
    });

    it('should return true from header update and remove its click listener on destroy', () => {
        const collapse = jasmine.createSpy('collapse').and.returnValue(true);
        const expand = jasmine.createSpy('expand').and.returnValue(true);
        const views = collapsibleExtension.config.nodeViews!.call({
            editor: { commands: { collapse, expand } }
        } as any);
        const descriptor = views.collapsibleHeader({}, undefined, () => 7);
        expect(descriptor.update!({})).toBe(true);
        descriptor.destroy!();
        (descriptor.dom.querySelector('button') as HTMLButtonElement).click();
        expect(collapse).not.toHaveBeenCalled();
        expect(expand).not.toHaveBeenCalled();
    });

    it('should collapse and expand through the mounted public commands', () => {
        expect(editor.commands.collapse()).toBe(true);
        expect(editor.getDocument().children[0].attrs.collapsed).toBe(true);
        expect(container.querySelector('[data-type="collapsible"]')!.getAttribute('data-collapsed')).toBe('true');
        expect(editor.commands.expand()).toBe(true);
        expect(editor.getDocument().children[0].attrs.collapsed).toBe(false);
        expect(container.querySelector('[data-type="collapsible"]')!.getAttribute('data-collapsed')).toBe('false');
    });

    it('should preserve header and body text when collapsing and expanding', () => {
        editor.commands.collapse();
        editor.commands.expand();
        expect(editor.getHtml()).toContain('Click to expand/collapse');
        expect(editor.getHtml()).toContain('This is collapsible body content.');
    });

    it('should collapse and expand from the header button click', () => {
        const button = container.querySelector('.e-toggle-btn') as HTMLButtonElement;
        button.click();
        expect(editor.getDocument().children[0].attrs.collapsed).toBe(true);
        button.click();
        expect(editor.getDocument().children[0].attrs.collapsed).toBe(false);
    });

    it('should return false for collapse and expand outside a collapsible', () => {
        editor.destroy();
        editor = HeadlessEditor.create({
            document: {
                type: 'document', id: crypto.randomUUID(), schemaVersion: 1, attrs: {}, marks: [],
                children: [{
                    type: 'paragraph', id: crypto.randomUUID(), attrs: {}, marks: [], children: [
                        { type: 'text', id: crypto.randomUUID(), attrs: {}, children: [], text: 'Plain', marks: [] } as TextNode
                    ]
                }]
            },
            extensions: [paragraphExtension, headingExtension, collapsibleExtension, undoRedoExtension]
        });
        editor.mount(container);
        expect(editor.commands.collapse()).toBe(false);
        expect(editor.commands.expand()).toBe(false);
    });

    it('should wrap a paragraph with the public toggle command', () => {
        editor.destroy();
        editor = HeadlessEditor.create({
            document: {
                type: 'document', id: crypto.randomUUID(), schemaVersion: 1, attrs: {}, marks: [],
                children: [{
                    type: 'paragraph', id: crypto.randomUUID(), attrs: {}, marks: [], children: [
                        { type: 'text', id: crypto.randomUUID(), attrs: {}, children: [], text: 'Wrap me', marks: [] } as TextNode
                    ]
                }]
            },
            extensions: [paragraphExtension, headingExtension, collapsibleExtension]
        });
        editor.mount(container);
        expect(editor.commands.toggleCollapsible({ triggerType: 'paragraph' })).toBe(true);
        expect(editor.getDocument().children[0].type).toBe('collapsible');
        expect(editor.getHtml()).toContain('Wrap me');
    });

    it('should wrap a heading trigger at the requested level', () => {
        editor.destroy();
        editor = HeadlessEditor.create({
            document: {
                type: 'document', id: crypto.randomUUID(), schemaVersion: 1, attrs: {}, marks: [],
                children: [{
                    type: 'paragraph', id: crypto.randomUUID(), attrs: {}, marks: [], children: [
                        { type: 'text', id: crypto.randomUUID(), attrs: {}, children: [], text: 'Heading trigger', marks: [] } as TextNode
                    ]
                }]
            },
            extensions: [paragraphExtension, headingExtension, collapsibleExtension]
        });
        editor.mount(container);
        editor.commands.toggleCollapsible({ triggerType: 'heading', level: 2 });
        expect(editor.getHtml()).toContain('<h2>Heading trigger</h2>');
    });

    it('should unwrap an existing collapsible and hoist its content', () => {
        expect(editor.commands.toggleCollapsible({ triggerType: 'paragraph' })).toBe(true);
        expect(editor.getDocument().children[0].type).toBe('heading');
        expect(editor.getHtml()).toContain('Click to expand/collapse');
    });

    it('should restore collapsible state through undo and redo', () => {
        editor.commands.collapse();
        expect(editor.commands.undo()).toBe(true);
        expect(editor.getDocument().children[0].attrs.collapsed).toBe(false);
        expect(editor.commands.redo()).toBe(true);
        expect(editor.getDocument().children[0].attrs.collapsed).toBe(true);
    });

    it('should invoke the three keyboard shortcut handlers with their public commands', () => {
        const toggleCollapsible = jasmine.createSpy('toggleCollapsible').and.returnValue(true);
        const collapse = jasmine.createSpy('collapse').and.returnValue(true);
        const expand = jasmine.createSpy('expand').and.returnValue(true);
        const shortcuts = collapsibleExtension.config.keyboardShortcuts!.call({
            editor: { commands: { toggleCollapsible, collapse, expand } }
        } as any);

        expect(shortcuts['Mod-Alt-[']()).toBe(true);
        expect(shortcuts['Mod-Alt-,']()).toBe(true);
        expect(shortcuts['Mod-Alt-.']()).toBe(true);
        expect(toggleCollapsible).toHaveBeenCalledWith({ triggerType: 'paragraph' });
        expect(collapse).toHaveBeenCalledTimes(1);
        expect(expand).toHaveBeenCalledTimes(1);
    });

    it('should expose the correct extension name', () => {
        expect(collapsibleExtension.name).toBe('collapsible');
    });

    it('should expose the configured priority', () => {
        expect(collapsibleExtension.config.priority).toBe(10);
    });

    it('should register all collapsible node definitions', () => {
        const nodes = collapsibleExtension.config.nodes!();

        expect(nodes.length).toBe(3);
        expect(nodes.map(node => node.name)).toEqual([
            'collapsible',
            'collapsibleHeader',
            'collapsibleBody'
        ]);
    });

    it('should register the collapsed attribute definition', () => {
        const nodes = collapsibleExtension.config.nodes!();

        expect(nodes[0].attrs).toEqual([
            {
                name: 'collapsed',
                type: 'boolean',
                default: false
            }
        ]);
    });

    it('should register all collapsible commands', () => {
        const commands = collapsibleExtension.config.commands!();

        expect(commands.map(command => command.name)).toEqual([
            'toggleCollapsible',
            'collapse',
            'expand'
        ]);
    });

    it('should preserve collapsible node in document schema', () => {
        const doc = editor.getDocument();

        expect(doc.children[0].type).toBe('collapsible');
        expect(doc.children[0].attrs.collapsed).toBe(false);
    });

    it('should preserve collapsibleHeader node in document schema', () => {
        const doc = editor.getDocument();

        expect(doc.children[0].children[0].type).toBe(
            'collapsibleHeader'
        );
    });

    it('should preserve collapsibleBody node in document schema', () => {
        const doc = editor.getDocument();

        expect(doc.children[0].children[1].type).toBe(
            'collapsibleBody'
        );
    });

    it('should preserve heading node inside collapsible header', () => {
        const doc = editor.getDocument();

        expect(
            doc.children[0]
                .children[0]
                .children[0]
                .type
        ).toBe('heading');
    });

    it('should preserve paragraph node inside collapsible body', () => {
        const doc = editor.getDocument();

        expect(
            doc.children[0]
                .children[1]
                .children[0]
                .type
        ).toBe('paragraph');
    });

    it('should serialize collapsible html attributes', () => {
        const html = editor.getHtml();

        expect(html).toContain('data-type="collapsible"');
        expect(html).toContain('data-collapsed="false"');
    });

    it('should serialize collapsible header content', () => {
        const html = editor.getHtml();

        expect(html).toContain('Click to expand/collapse');
    });

    it('should serialize collapsible body content', () => {
        const html = editor.getHtml();

        expect(html).toContain('This is collapsible body content.');
    });

    it('should expose dom spec definitions for all nodes', () => {
        const specs = collapsibleExtension.config.domSpecs!.call({
            options: {}
        } as any);

        expect(specs.nodes!.collapsible).toBeDefined();
        expect(specs.nodes!.collapsibleHeader).toBeDefined();
        expect(specs.nodes!.collapsibleBody).toBeDefined();
    });

    it('should expose node view definitions for all nodes', () => {
        const views = collapsibleExtension.config.nodeViews!.call({
            options: {}
        } as any);

        expect(views.collapsible).toEqual(jasmine.any(Function));
        expect(views.collapsibleHeader).toEqual(jasmine.any(Function));
        expect(views.collapsibleBody).toEqual(jasmine.any(Function));
    });

    it('should create collapsible DOM spec renderer', () => {
        const specs: any = collapsibleExtension.config.domSpecs!.call({
            options: {}
        } as any);

        expect(
            specs.nodes.collapsible.toDOM
        ).toEqual(jasmine.any(Function));
    });

    it('should create collapsibleHeader DOM spec renderer', () => {
        const specs: any = collapsibleExtension.config.domSpecs!.call({
            options: {}
        } as any);

        expect(
            specs.nodes.collapsibleHeader.toDOM
        ).toEqual(jasmine.any(Function));
    });

    it('should create collapsibleBody DOM spec renderer', () => {
        const specs: any = collapsibleExtension.config.domSpecs!.call({
            options: {}
        } as any);

        expect(
            specs.nodes.collapsibleBody.toDOM
        ).toEqual(jasmine.any(Function));
    });

    it('should update schema after collapse command', () => {
        editor.commands.collapse();

        const doc = editor.getDocument();

        expect(doc.children[0].attrs.collapsed).toBe(true);
    });

    it('should update html after collapse command', () => {
        editor.commands.collapse();

        expect(editor.getHtml()).toContain(
            'data-collapsed="true"'
        );
    });

    it('should update schema after expand command', () => {
        editor.commands.collapse();
        editor.commands.expand();

        const doc = editor.getDocument();

        expect(doc.children[0].attrs.collapsed).toBe(false);
    });

    it('should update html after expand command', () => {
        editor.commands.collapse();
        editor.commands.expand();

        expect(editor.getHtml()).toContain(
            'data-collapsed="false"'
        );
    });
});
