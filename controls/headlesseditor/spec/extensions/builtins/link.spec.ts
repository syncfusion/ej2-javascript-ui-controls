/**
 * This spec file contains test cases for:
 * - Link Extension
 */

import {
    HeadlessEditor,
    paragraphExtension,
    TextNode,
    undoRedoExtension
} from '../../../src/index';

import { linkExtension } from '../../../src/extensions/builtins/link';

describe('Built-in: link', () => {
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
                                text: 'Visit Syncfusion',
                                marks: []
                            } as TextNode
                        ]
                    }
                ]
            },
            extensions: [
                paragraphExtension,
                linkExtension,
                undoRedoExtension
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

    it('should apply a link to selected text', () => {
        editor.commands.setSelection({
            from: 1,
            to: 17
        });

        expect(editor.commands.setLink({
            href: 'https://www.syncfusion.com'
        })).toBe(true);

        const html = editor.getHtml();

        expect(html).toContain('Visit Syncfusion');
        expect(html).toContain('<a');
        expect(html).toContain('href="https://www.syncfusion.com"');
        expect((editor.getDocument().children[0].children[0] as TextNode).marks).toEqual([{
            type: 'link',
            attrs: {
                href: 'https://www.syncfusion.com',
                title: null,
                target: null,
                rel: null
            }
        }]);
    });

    it('should replace selected text with trimmed display text', () => {
        editor.commands.setSelection({ from: 1, to: 17 });
        expect(editor.commands.setLink({
            href: 'https://example.com',
            displayText: '  Open Syncfusion  '
        })).toBe(true);

        expect(editor.getHtml()).toContain('<a href="https://example.com">Open Syncfusion</a>');
        expect(editor.getHtml()).not.toContain('Visit Syncfusion');
    });

    it('should keep the selection over the display text after applying a link', () => {
        editor.commands.setSelection({ from: 1, to: 17 });
        expect(editor.commands.setLink({
            href: 'https://example.com',
            displayText: 'Open Syncfusion'
        })).toBe(true);

        const selection: { from: number; to: number; empty: boolean } = editor.getSelection();
        expect(selection.empty).toBe(false);
        expect(selection.from).toBe(1);
        expect(selection.to).toBe(1 + 'Open Syncfusion'.length);
        // The restored range must cover exactly the linked text.
        expect(editor.getSelectionText()).toBe('Open Syncfusion');
        // Further formatting at the same range still works (selection is real).
        expect(editor.commands.setLink({
            href: 'https://example.org',
            displayText: 'Open Syncfusion'
        })).toBe(true);
        expect(editor.getHtml()).toContain('href="https://example.org"');
    });

    it('should update link attributes without adding duplicate anchors', () => {
        editor.commands.setSelection({ from: 1, to: 17 });
        editor.commands.setLink({ href: 'https://first.example' });
        editor.commands.setSelection({ from: 1, to: 17 });
        editor.commands.setLink({
            href: 'https://second.example',
            title: 'Updated',
            target: '_self',
            rel: 'nofollow'
        });

        const html = editor.getHtml();
        expect(html).toContain('href="https://second.example"');
        expect(html).not.toContain('https://first.example');
        expect((html.match(/<a /g) || []).length).toBe(1);
    });

    it('should remove a link while preserving selected text', () => {
        editor.commands.setSelection({ from: 1, to: 17 });
        editor.commands.setLink({ href: 'https://example.com' });
        expect(editor.commands.unsetLink()).toBe(true);

        expect(editor.getHtml()).toContain('Visit Syncfusion');
        expect(editor.getHtml()).not.toContain('<a');
        expect((editor.getDocument().children[0].children[0] as TextNode).marks).toEqual([]);
    });

    it('should link only the selected portion of the paragraph', () => {
        editor.commands.setSelection({ from: 1, to: 6 });
        editor.commands.setLink({ href: 'https://example.com' });

        expect(editor.getHtml()).toContain('<a href="https://example.com">Visit</a>');
        expect(editor.getHtml()).toContain(' Syncfusion');
    });

    it('should reject unsafe and empty URLs without changing the document', () => {
        const originalHtml = editor.getHtml();
        editor.commands.setSelection({ from: 1, to: 17 });

        for (const href of ['', '   ', 'javascript:alert(1)', 'DATA:text/html,x', 'random text']) {
            expect(editor.commands.setLink({ href })).toBe(false);
            expect(editor.getHtml()).toBe(originalHtml);
        }
    });

    it('should accept representative safe URL forms', () => {
        editor.commands.setSelection({ from: 1, to: 17 });

        for (const href of ['http://example.com', 'mailto:user@example.com', '/docs', '#section', 'example.com']) {
            expect(editor.commands.setLink({ href })).toBe(true);
            expect(editor.commands.unsetLink()).toBe(true);
        }
    });

    it('should preserve optional link attributes in HTML and document state', () => {
        editor.commands.setSelection({ from: 1, to: 17 });
        editor.commands.setLink({
            href: 'https://example.com',
            title: 'Example',
            target: '_blank',
            rel: 'noopener noreferrer'
        });

        const html = editor.getHtml();
        expect(html).toContain('title="Example"');
        expect(html).toContain('target="_blank"');
        expect(html).toContain('rel="noopener noreferrer"');
        expect((editor.getDocument().children[0].children[0] as TextNode).marks[0].attrs)
            .toEqual({
                href: 'https://example.com',
                title: 'Example',
                target: '_blank',
                rel: 'noopener noreferrer'
            });
    });

    it('should undo and redo link application', () => {
        const originalHtml = editor.getHtml();
        editor.commands.setSelection({ from: 1, to: 17 });
        editor.commands.setLink({ href: 'https://example.com' });
        const linkedHtml = editor.getHtml();

        expect(editor.commands.undo()).toBe(true);
        expect(editor.getHtml()).toBe(originalHtml);
        expect(editor.commands.redo()).toBe(true);
        expect(editor.getHtml()).toBe(linkedHtml);
    });

    it('should register the four link input rules with undo enabled', () => {
        const rules = linkExtension.config.inputRules!.call({} as any);

        expect(rules.length).toBe(4);
        expect(rules.map((rule) => rule.id)).toEqual([
            'link:markdown',
            'link:url',
            'link:www',
            'link:email'
        ]);
        expect(rules.every((rule) => rule.allowUndo === true)).toBe(true);
        expect(rules.every((rule) => rule.pattern.source.endsWith('$'))).toBe(true);
    });

    it('should handle markdown link input through the mounted view', () => {
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
                        text: 'Seed',
                        marks: []
                    } as TextNode]
                }]
            },
            enableInputRules: true,
            extensions: [paragraphExtension, linkExtension, undoRedoExtension]
        });
        editor.mount(container);

        const view: any = editor.integration.getView();
        let handled = false;
        view.someProp('handleTextInput', (handler: Function): void => {
            handled = handler(view, 1, 1, '[Syncfusion](https://www.syncfusion.com)') || handled;
        });

        expect(handled).toBe(true);
        expect(editor.getHtml()).toContain('<a href="https://www.syncfusion.com">Syncfusion</a>');
    });

    it('should apply the Mod-k keyboard shortcut through the mounted view', () => {
        const view: any = editor.integration.getView();
        editor.commands.setSelection({ from: 1, to: 17 });
        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'k',
            code: 'KeyK',
            ctrlKey: true,
            bubbles: true,
            cancelable: true
        }));

        expect(editor.getHtml()).not.toContain('<a');
    });

    it('should leave left-click editing behavior unchanged when openOnClick is disabled', () => {
        editor.commands.setSelection({ from: 1, to: 17 });
        editor.commands.setLink({ href: 'https://example.com' });
        const anchor = container.querySelector('a') as HTMLAnchorElement;
        const openSpy = spyOn(window, 'open').and.stub();
        const event = new MouseEvent('click', { button: 0, bubbles: true, cancelable: true });
        Object.defineProperty(event, 'target', { value: anchor });
        const view: any = editor.integration.getView();
        let handled = false;

        view.someProp('handleClick', (handler: Function): void => {
            handled = handler(view, 1, event) || handled;
        });

        expect(openSpy).not.toHaveBeenCalled();
        expect(handled).toBe(false);
        expect(event.defaultPrevented).toBe(false);
    });

    it('should ignore a left click whose target is not inside an anchor', () => {
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
                        text: 'Plain text',
                        marks: []
                    } as TextNode]
                }]
            },
            extensions: [paragraphExtension, linkExtension.configure({ openOnClick: true })]
        });
        editor.mount(container);

        const view: any = editor.integration.getView();
        const paragraph = container.querySelector('p') as HTMLElement;
        const event = new MouseEvent('click', { button: 0, bubbles: true, cancelable: true });
        Object.defineProperty(event, 'target', { value: paragraph });
        let handled = true;

        view.someProp('handleClick', (handler: Function): void => {
            handled = handler(view, 1, event);
        });

        expect(handled).toBe(false);
        expect(event.defaultPrevented).toBe(false);
    });

    it('should ignore a click with no event target', () => {
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
                        text: 'Plain text',
                        marks: []
                    } as TextNode]
                }]
            },
            extensions: [paragraphExtension, linkExtension.configure({ openOnClick: true })]
        });
        editor.mount(container);

        const event = new MouseEvent('click', { button: 0, bubbles: true, cancelable: true });
        Object.defineProperty(event, 'target', { value: null });
        const view: any = editor.integration.getView();
        let handled = true;

        view.someProp('handleClick', (handler: Function): void => {
            handled = handler(view, 1, event);
        });

        expect(handled).toBe(false);
        expect(event.defaultPrevented).toBe(false);
    });

    it('should ignore an anchor outside the editor root', () => {
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
                        text: 'Plain text',
                        marks: []
                    } as TextNode]
                }]
            },
            extensions: [paragraphExtension, linkExtension.configure({ openOnClick: true })]
        });
        editor.mount(container);

        const outside = document.createElement('a');
        outside.href = 'https://outside.example';
        document.body.appendChild(outside);
        const event = new MouseEvent('click', { button: 0, bubbles: true, cancelable: true });
        Object.defineProperty(event, 'target', { value: outside });
        const view: any = editor.integration.getView();
        let handled = true;

        view.someProp('handleClick', (handler: Function): void => {
            handled = handler(view, 1, event);
        });

        expect(handled).toBe(false);
        expect(event.defaultPrevented).toBe(false);
        outside.remove();
    });

    it('should ignore an in-editor anchor without an href', () => {
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
                        text: 'Open this link',
                        marks: []
                    } as TextNode]
                }]
            },
            extensions: [paragraphExtension, linkExtension.configure({ openOnClick: true })]
        });
        editor.mount(container);
        editor.commands.setSelection({ from: 1, to: 15 });
        editor.commands.setLink({ href: 'https://example.com' });

        const anchor = container.querySelector('a') as HTMLAnchorElement;
        anchor.removeAttribute('href');
        const event = new MouseEvent('click', { button: 0, bubbles: true, cancelable: true });
        Object.defineProperty(event, 'target', { value: anchor });
        const view: any = editor.integration.getView();
        const openSpy = spyOn(window, 'open').and.stub();
        let handled = true;

        view.someProp('handleClick', (handler: Function): void => {
            handled = handler(view, 1, event);
        });

        expect(handled).toBe(false);
        expect(openSpy).not.toHaveBeenCalled();
        expect(event.defaultPrevented).toBe(false);
    });

    it('should open an in-editor link and prevent the default event when enabled', () => {
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
                        text: 'Open this link',
                        marks: []
                    } as TextNode]
                }]
            },
            extensions: [paragraphExtension, linkExtension.configure({ openOnClick: true })]
        });
        editor.mount(container);
        editor.commands.setSelection({ from: 1, to: 15 });
        editor.commands.setLink({ href: 'https://example.com' });

        const anchor = container.querySelector('a') as HTMLAnchorElement;
        const event = new MouseEvent('click', { button: 0, bubbles: true, cancelable: true });
        Object.defineProperty(event, 'target', { value: anchor });
        const openSpy = spyOn(window, 'open').and.stub();
        const view: any = editor.integration.getView();
        let handled = false;

        view.someProp('handleClick', (handler: Function): void => {
            handled = handler(view, 1, event) || handled;
        });

        expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer');
        expect(event.defaultPrevented).toBe(true);
        expect(handled).toBe(true);
    });

    it('should honor a custom target when opening an enabled link', () => {
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
                        text: 'Open this link',
                        marks: []
                    } as TextNode]
                }]
            },
            extensions: [paragraphExtension, linkExtension.configure({ openOnClick: true })]
        });
        editor.mount(container);
        editor.commands.setSelection({ from: 1, to: 15 });
        editor.commands.setLink({ href: 'https://example.com', target: '_self' });

        const anchor = container.querySelector('a') as HTMLAnchorElement;
        const event = new MouseEvent('click', { button: 0, bubbles: true, cancelable: true });
        Object.defineProperty(event, 'target', { value: anchor });
        const openSpy = spyOn(window, 'open').and.stub();
        const view: any = editor.integration.getView();

        view.someProp('handleClick', (handler: Function): void => {
            handler(view, 1, event);
        });

        expect(openSpy).toHaveBeenCalledWith('https://example.com', '_self', 'noopener,noreferrer');
    });

    it('should reject read-only, missing-target, outside, and missing-href clicks', () => {
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
                        text: 'Open this link',
                        marks: []
                    } as TextNode]
                }]
            },
            readOnly: true,
            extensions: [paragraphExtension, linkExtension.configure({ openOnClick: true })]
        });
        editor.mount(container);
        editor.commands.setSelection({ from: 1, to: 15 });
        editor.commands.setLink({ href: 'https://example.com' });

        const anchor = container.querySelector('a') as HTMLAnchorElement;
        const outside = document.createElement('a');
        outside.href = 'https://outside.example';
        document.body.appendChild(outside);
        const openSpy = spyOn(window, 'open').and.stub();
        const view: any = editor.integration.getView();
        const invoke = (target: EventTarget | null): boolean => {
            const event = new MouseEvent('click', { button: 0, bubbles: true, cancelable: true });
            Object.defineProperty(event, 'target', { value: target });
            let handled = false;
            view.someProp('handleClick', (handler: Function): void => {
                handled = handler(view, 1, event) || handled;
            });
            return handled;
        };

        expect(invoke(anchor)).toBe(false);
        expect(invoke(null)).toBe(false);
        expect(invoke(outside)).toBe(false);
        outside.remove();
        anchor.removeAttribute('href');
        expect(invoke(anchor)).toBe(false);
        expect(openSpy).not.toHaveBeenCalled();
    });
    it('should expose independent defaults and the link name', () => {
        expect(linkExtension.name).toBe('link');
        const first = linkExtension.config.defineOptions!();
        const second = linkExtension.config.defineOptions!();

        expect(first).toEqual({ htmlAttributes: {}, openOnClick: false });
        expect(second).toEqual({ htmlAttributes: {}, openOnClick: false });
        expect(first).not.toBe(second);
    });

    it('should register one inclusive link mark with ordered attributes', () => {
        const marks = linkExtension.config.marks!();

        expect(marks.length).toBe(1);
        expect(marks[0].name).toBe('link');
        expect(marks[0].inclusive).toBe(true);
        expect(marks[0].attrs!.map((attribute) => ({
            name: attribute.name,
            type: attribute.type,
            default: attribute.default
        }))).toEqual([
            { name: 'href', type: 'string', default: '' },
            { name: 'title', type: 'string', default: null },
            { name: 'target', type: 'string', default: null },
            { name: 'rel', type: 'string', default: null }
        ]);
    });

    it('should register setLink and unsetLink commands in order', () => {
        expect(linkExtension.config.commands!().map((command) => command.name))
            .toEqual(['setLink', 'unsetLink']);
    });

    it('should render default and optional link DOM attributes', () => {
        const specs = linkExtension.config.domSpecs!.call({
            options: linkExtension.config.defineOptions!()
        } as any);

        expect(specs.marks.link.toDOM!({ href: 'https://example.com' }, true))
            .toEqual(['a', { href: 'https://example.com' }, 0]);
        expect(specs.marks.link.toDOM!({
            href: '/docs',
            title: 'Docs',
            target: '_blank',
            rel: 'noopener'
        }, true)).toEqual(['a', {
            href: '/docs',
            title: 'Docs',
            target: '_blank',
            rel: 'noopener'
        }, 0]);
    });

    it('should fall back to empty options and omit empty optional attributes', () => {
        const specs = linkExtension.config.domSpecs!.call({} as any);

        expect(specs.marks.link.toDOM!({ href: '', title: '', target: '', rel: '' }, true))
            .toEqual(['a', { href: '' }, 0]);
    });

    it('should reject non-left clicks without opening a link', () => {
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
                        text: 'Open this link',
                        marks: []
                    } as TextNode]
                }]
            },
            extensions: [paragraphExtension, linkExtension.configure({ openOnClick: true })]
        });
        editor.mount(container);
        editor.commands.setSelection({ from: 1, to: 15 });
        editor.commands.setLink({ href: 'https://example.com' });

        const anchor = container.querySelector('a') as HTMLAnchorElement;
        const openSpy = spyOn(window, 'open').and.stub();
        const event = new MouseEvent('click', { button: 2, bubbles: true, cancelable: true });
        const view: any = editor.integration.getView();
        let handled = false;
        view.someProp('handleClick', (handler: Function): void => {
            handled = handler(view, 1, event) || handled;
        });

        expect(openSpy).not.toHaveBeenCalled();
        expect(handled).toBe(false);
    });

    it('should treat missing options.openOnClick as disabled when compiling the plugin', () => {
        const plugin: any = linkExtension.config.plugins!.call(
            { options: { htmlAttributes: {}, openOnClick: undefined } } as any,
            { extensionName: 'link' }
        )[0];

        const view: any = { editable: () => true, dom: container };
        const anchor = document.createElement('a');
        anchor.href = 'https://example.com';
        container.appendChild(anchor);
        const event = new MouseEvent('click', { button: 0, bubbles: true, cancelable: true });
        Object.defineProperty(event, 'target', { value: anchor });
        const openSpy = spyOn(window, 'open').and.stub();

        const handled: boolean = plugin.props.handleClick(view, 1, event);

        expect(handled).toBe(false);
        expect(openSpy).not.toHaveBeenCalled();
        expect(event.defaultPrevented).toBe(false);
    });

    it('should fall back to default disabled openOnClick when options itself is missing', () => {
        const plugin: any = linkExtension.config.plugins!.call(
            { options: undefined } as any,
            { extensionName: 'link' }
        )[0];

        const view: any = { editable: () => true, dom: container };
        const anchor = document.createElement('a');
        anchor.href = 'https://example.com';
        container.appendChild(anchor);
        const event = new MouseEvent('click', { button: 0, bubbles: true, cancelable: true });
        Object.defineProperty(event, 'target', { value: anchor });
        const openSpy = spyOn(window, 'open').and.stub();

        const handled: boolean = plugin.props.handleClick(view, 1, event);

        expect(handled).toBe(false);
        expect(openSpy).not.toHaveBeenCalled();
        expect(event.defaultPrevented).toBe(false);
    });

    it('should register a href/title/target/rel parseDOM rule for the link mark', () => {
        const specs = linkExtension.config.domSpecs!.call({
            options: linkExtension.config.defineOptions!()
        } as any);

        const rules = specs.marks.link.parseDOM!;

        expect(rules).toBeDefined();
        expect(rules.length).toBe(1);

        const parseRule = rules[0];

        expect(parseRule.tag).toBe('a[href]');
        expect(typeof parseRule.getAttrs).toBe('function');
    });

    it('should expose the first link parseDOM rule as the anchor selector', () => {
        const specs = linkExtension.config.domSpecs!.call({
            options: linkExtension.config.defineOptions!()
        } as any);

        const parseRule = specs.marks.link.parseDOM![0];

        expect(parseRule.tag).toBe('a[href]');
        expect(typeof parseRule.getAttrs).toBe('function');
    });

    it('should return link attributes from getAttrs', () => {
        const specs = linkExtension.config.domSpecs!.call({
            options: linkExtension.config.defineOptions!()
        } as any);

        const parseRule = specs.marks.link.parseDOM![0];

        const attrs = parseRule.getAttrs!({
            getAttribute: (name: string) => {
                const values: Record<string, string> = {
                    href: 'https://example.com',
                    title: 'Example',
                    target: '_blank',
                    rel: 'noopener'
                };

                return values[name] || null;
            }
        } as any);

        expect(attrs).toEqual({
            href: 'https://example.com',
            title: 'Example',
            target: '_blank',
            rel: 'noopener'
        });
    });

    it('should return fallback values when link attributes are missing', () => {
        const specs = linkExtension.config.domSpecs!.call({
            options: linkExtension.config.defineOptions!()
        } as any);

        const parseRule = specs.marks.link.parseDOM![0];

        expect(parseRule.getAttrs!({
            getAttribute: () => null
        } as any)).toEqual({
            href: '',
            title: null,
            target: null,
            rel: null
        });
    });

    it('should expose the Mod-k keyboard shortcut', () => {
        const shortcuts = linkExtension.config.keyboardShortcuts!.call({
            editor
        } as any);

        expect(Object.keys(shortcuts)).toEqual([
            'Mod-k'
        ]);

        expect(typeof shortcuts['Mod-k']).toBe('function');
    });

    it('should contribute a single link plugin', () => {
        const plugins = linkExtension.config.plugins!.call({
            options: {
                htmlAttributes: {},
                openOnClick: false
            }
        } as any);

        expect(plugins.length).toBe(1);
    });

    it('should create a plugin with handleClick support', () => {
        const plugins: any = linkExtension.config.plugins!.call({
            options: {
                htmlAttributes: {},
                openOnClick: true
            }
        } as any);

        expect(plugins[0]).toBeDefined();
        expect(plugins[0].props).toBeDefined();
        expect(typeof plugins[0].props.handleClick).toBe('function');
    });

    it('should expose exactly one link mark definition', () => {
        const marks = linkExtension.config.marks!();

        expect(marks.length).toBe(1);
        expect(marks[0].name).toBe('link');
    });

    it('should expose exactly two link commands', () => {
        const commands = linkExtension.config.commands!();

        expect(commands.length).toBe(2);
        expect(commands.map(command => command.name)).toEqual([
            'setLink',
            'unsetLink'
        ]);
    });

    it('should expose four link attributes in order', () => {
        const attrs = linkExtension.config.marks!()[0].attrs!;

        expect(attrs.map(attr => attr.name)).toEqual([
            'href',
            'title',
            'target',
            'rel'
        ]);
    });

    it('should render only href when optional attributes are absent', () => {
        const specs = linkExtension.config.domSpecs!.call({
            options: {
                htmlAttributes: {}
            }
        } as any);

        expect(
            specs.marks.link.toDOM!({
                href: 'https://example.com'
            })
        ).toEqual([
            'a',
            {
                href: 'https://example.com'
            },
            0
        ]);
    });

    it('should merge configured htmlAttributes into rendered links', () => {
        const specs = linkExtension.config.domSpecs!.call({
            options: {
                htmlAttributes: {
                    class: 'custom-link'
                }
            }
        } as any);

        expect(
            specs.marks.link.toDOM!({
                href: 'https://example.com'
            })
        ).toEqual([
            'a',
            {
                class: 'custom-link',
                href: 'https://example.com'
            },
            0
        ]);
    });

    it('should expose the Mod-k keyboard shortcut', () => {
        const shortcuts = linkExtension.config.keyboardShortcuts!.call({
            editor
        } as any);

        expect(Object.keys(shortcuts)).toEqual([
            'Mod-k'
        ]);

        expect(typeof shortcuts['Mod-k']).toBe('function');
    });

    it('1053334 - Unset Link command does not remove the link when the cursor is placed inside linked text', () => {
        editor.commands.setSelection({ from: 1, to: 17 });
        editor.commands.setLink({
            href: 'https://example.com',
            target: '_blank'
        });
        expect(editor.getHtml()).toContain(
            '<a href="https://example.com" target="_blank">Visit Syncfusion</a>'
        );
        // Place the cursor inside the linked text without selecting it.
        editor.commands.setSelection({ from: 5, to: 5 });
        expect(editor.commands.unsetLink()).toBe(true);
        // Text should remain unchanged.
        expect(editor.getHtml()).toContain('Visit Syncfusion');
        // Link mark should be removed.
        expect(editor.getHtml()).not.toContain('<a');
        expect(
            (editor.getDocument().children[0].children[0] as TextNode).marks
        ).toEqual([]);
    });

    it('should remove a link when cursor is inside a linked text node that is not the first child', () => {
        editor.commands.setSelection({ from: 1, to: 14 });
        editor.commands.setLink({
            href: 'https://example.com'
        });
        // Place the cursor inside the linked text.
        editor.commands.setSelection({ from: 5, to: 5 });
        expect(editor.commands.unsetLink()).toBe(true);
        expect(editor.getHtml()).not.toContain('<a');
        expect(editor.getHtml()).toContain('Visit Syncfusion');
    });

    it('should not remove a link when cursor is inside an unlinked text node', () => {
        editor.commands.setSelection({ from: 4, to: 14 });
        editor.commands.setLink({
            href: 'https://example.com'
        });
        // Move the cursor to the unlinked text.
        editor.commands.setSelection({ from: 15, to: 15 });
        expect(editor.commands.unsetLink()).toBe(false);
        // The link should remain unchanged because the cursor is outside the link.
        expect(editor.getHtml()).toContain(
            '<a href="https://example.com">it Syncfus</a>'
        );
        // Move the cursor to the linked text.
        editor.commands.setSelection({ from: 5, to: 5 });
        expect(editor.commands.unsetLink()).toBe(true);
        // The link should remain unchanged because the cursor is outside the link.
        expect(editor.getHtml()).not.toContain(
            '<a href="https://example.com">it Syncfus</a>'
        );
    });
});