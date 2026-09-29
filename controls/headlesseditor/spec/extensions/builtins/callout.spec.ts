/**
 * This spec file contains test cases for:
 * - Callout Extension
 */
import {
    HeadlessEditor,
    paragraphExtension,
    TextNode,
    undoRedoExtension
} from '../../../src/index';

import { calloutExtension } from '../../../src/extensions/builtins/callout';

describe('Built-in: callout', () => {
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
                        type: 'callout',
                        id: crypto.randomUUID(),
                        attrs: {
                            variant: 'info'
                        },
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
                                        text: 'Please review the document before publishing.',
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
                calloutExtension,
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

    it('should render an informational callout block', () => {
        const callout = container.querySelector(
            '[data-type="callout"]'
        ) as HTMLElement;

        expect(callout).not.toBeNull();
        expect(callout.getAttribute('data-variant')).toBe('info');
        expect(callout.textContent).toContain(
            'Please review the document before publishing.'
        );
    });

    it('should define default options without exposing a configurable variants API', () => {
        const options = calloutExtension.config.defineOptions!();

        expect(options.defaultVariant).toBe('info');
        expect(options.htmlAttributes).toEqual({});
        // The six built-in variants are part of the library's closed
        // set and are NOT exposed as a configurable option. Customers
        // who need a custom variant must extend the Callout extension
        // via `defineOptions()` and `nodeViews()`.
        expect((options as Record<string, unknown>)['variants']).toBeUndefined();
    });

    it('should preserve configured options without changing the base extension', () => {
        const configured = calloutExtension.configure({
            defaultVariant: 'note',
            htmlAttributes: { class: 'editor-callout' }
        });
        const options = configured.config.defineOptions!();

        expect(options.defaultVariant).toBe('note');
        expect(options.htmlAttributes).toEqual({ class: 'editor-callout' });
        expect(calloutExtension.config.defineOptions!().defaultVariant).toBe('info');
    });

    it('should render a library SVG for each of the six predefined variants', () => {
        const builtIn: readonly string[] = ['info', 'warning', 'note', 'success', 'error', 'tip'];
        const options = calloutExtension.config.defineOptions!();
        const views = calloutExtension.config.nodeViews!.call({ options } as any);

        for (const name of builtIn) {
            const descriptor: { dom: HTMLElement } = views.callout({ variant: name }, undefined, () => 1);
            const icon: HTMLElement = descriptor.dom.firstElementChild as HTMLElement;
            expect(icon.querySelector('svg')).not.toBeNull();
        }
    });

    it('should register the toggleCallout command', () => {
        const commands = calloutExtension.config.commands!();

        expect(commands.length).toBe(1);
        expect(commands[0].name).toBe('toggleCallout');
        expect(commands[0].meta?.category).toBe('structure');
    });

    it('should serialize a configured variant and HTML attributes', () => {
        const domSpecs = calloutExtension.config.domSpecs!.call({
            options: {
                htmlAttributes: { class: 'editor-callout', 'data-test': 'yes' },
                defaultVariant: 'info'
            }
        } as any);

        expect(domSpecs.nodes!.callout.toDOM!({ variant: 'warning' })).toEqual([
            'div',
            {
                class: 'editor-callout',
                'data-test': 'yes',
                'data-type': 'callout',
                'data-variant': 'warning'
            },
            0
        ]);
    });

    it('should use the configured default for missing and non-string variants', () => {
        const domSpecs = calloutExtension.config.domSpecs!.call({
            options: { defaultVariant: 'note' }
        } as any);
        const toDOM = domSpecs.nodes!.callout.toDOM!;

        expect(toDOM({})).toEqual(['div', {
            'data-type': 'callout', 'data-variant': 'note'
        }, 0]);
        expect(toDOM({ variant: 4 })).toEqual(['div', {
            'data-type': 'callout', 'data-variant': 'note'
        }, 0]);
    });

    it('should use safe defaults when the DOM scope has no options', () => {
        const domSpecs = calloutExtension.config.domSpecs!.call({} as any);

        expect(domSpecs.nodes!.callout.toDOM!({})).toEqual([
            'div', { 'data-type': 'callout', 'data-variant': 'info' }, 0
        ]);
    });

    it('should create the expected NodeView structure and SVG icon', () => {
        const options = calloutExtension.config.defineOptions!();
        const views = calloutExtension.config.nodeViews!.call({ options } as any);
        const descriptor = views.callout({ variant: 'info' }, undefined, () => 1);
        const icon = descriptor.dom.querySelector('div.e-callout-icon')!;

        expect(descriptor.dom.getAttribute('data-type')).toBe('callout');
        expect(descriptor.dom.getAttribute('data-variant')).toBe('info');
        expect(icon.getAttribute('contenteditable')).toBe('false');
        expect(icon.className).toBe('e-callout-icon');
        // Icon markup is a single SVG whose first path matches the
        // library-defined info icon (#008AA9 fill).
        expect(icon.querySelector('svg')).not.toBeNull();
        expect((icon.querySelector('svg path') as SVGPathElement).getAttribute('fill')).toBe('#008AA9');
        expect(descriptor.contentDOM!.className).toBe('e-callout-content');
        expect(descriptor.dom.children.length).toBe(2);
    });

    it('should use explicit, default, and unknown variant icon behavior', () => {
        const options = calloutExtension.config.defineOptions!();
        const views = calloutExtension.config.nodeViews!.call({ options } as any);
        const warning = views.callout({ variant: 'warning' }, undefined, () => 1);
        const missing = views.callout({ variant: null }, undefined, () => 1);
        const unknown = views.callout({ variant: 'unknown' }, undefined, () => 1);

        // Each variant button carries only the base icon class and the
        // SVG that matches its name. Unknown variants fall back to info.
        expect((warning.dom.firstElementChild as HTMLElement).className).toBe('e-callout-icon');
        expect(((warning.dom.firstElementChild as HTMLElement).querySelector('svg path') as SVGPathElement).getAttribute('fill')).toBe('#BC4B09');
        expect(missing.dom.getAttribute('data-variant')).toBe('info');
        expect((missing.dom.firstElementChild as HTMLElement).className).toBe('e-callout-icon');
        expect(((missing.dom.firstElementChild as HTMLElement).querySelector('svg path') as SVGPathElement).getAttribute('fill')).toBe('#008AA9');
        expect(unknown.dom.getAttribute('data-variant')).toBe('unknown');
        expect((unknown.dom.firstElementChild as HTMLElement).className).toBe('e-callout-icon');
        expect((unknown.dom.firstElementChild as HTMLElement).innerHTML).toBe('');
    });

    it('should update the NodeView variant, icon SVG, and return true', () => {
        const options = calloutExtension.config.defineOptions!();
        const views = calloutExtension.config.nodeViews!.call({ options } as any);
        const descriptor = views.callout({ variant: 'info' }, undefined, () => 1);

        expect(descriptor.update!({ variant: 'error' })).toBe(true);
        expect(descriptor.dom.getAttribute('data-variant')).toBe('error');
        let iconEl: HTMLElement = descriptor.dom.firstElementChild as HTMLElement;
        expect(iconEl.className).toBe('e-callout-icon');
        expect(((iconEl.querySelector('svg path') as SVGPathElement).getAttribute('fill'))).toBe('#D13438');
        descriptor.update!({ variant: undefined });
        expect(descriptor.dom.getAttribute('data-variant')).toBe('info');
        iconEl = descriptor.dom.firstElementChild as HTMLElement;
        expect(iconEl.className).toBe('e-callout-icon');
        expect(((iconEl.querySelector('svg path') as SVGPathElement).getAttribute('fill'))).toBe('#008AA9');
    });

    it('should contribute exact input rules and dispatch their payloads', () => {
        const rules = calloutExtension.config.inputRules!.call({} as any);
        const dispatch = jasmine.createSpy('dispatchCommand').and.returnValue(true);

        expect(rules.length).toBe(2);
        expect(rules.map(rule => rule.id)).toEqual(['callout:exclaim', 'callout:colon']);
        expect(rules[0].pattern.test('!!! ')).toBe(true);
        expect(rules[0].pattern.test('!! ')).toBe(false);
        rules[0].handler({
            dispatchCommand: dispatch,
            match: '!!! '.match(rules[0].pattern)!,
            start: 3,
            end: 7,
            nodeAt: null,
            selection: {} as any
        });
        expect(dispatch).toHaveBeenCalledWith('inputRuleWrap', {
            nodeType: 'callout', attrs: { variant: 'info' }, matchStart: 3, matchEnd: 7
        });

        expect(rules[1].pattern.test('::: ')).toBe(true);
        expect(rules[1].pattern.test(':: ')).toBe(false);
        rules[1].handler({
            dispatchCommand: dispatch,
            match: '::: '.match(rules[1].pattern)!,
            start: 3,
            end: 7,
            nodeAt: null,
            selection: {} as any
        });
        expect(dispatch).toHaveBeenCalledWith('inputRuleWrap', {
            nodeType: 'callout', attrs: { variant: 'note' }, matchStart: 3, matchEnd: 7
        });
    });

    it('should register and execute the Mod-Shift-c shortcut', () => {
        const toggleCallout = jasmine.createSpy('toggleCallout').and.returnValue(true);
        const shortcuts = calloutExtension.config.keyboardShortcuts!.call({
            editor: { commands: { toggleCallout } }
        } as any);

        expect(Object.keys(shortcuts)).toEqual(['Mod-Shift-c']);
        expect(shortcuts['Mod-Shift-c']()).toBe(true);
        expect(toggleCallout).toHaveBeenCalledTimes(1);
    });

    it('should render the warning SVG when scope options are missing and a known variant is requested', () => {
        const views = calloutExtension.config.nodeViews!.call({} as any);
        const descriptor = views.callout({ variant: 'warning' }, undefined, () => 1);
        const icon = descriptor.dom.firstElementChild as HTMLElement;

        expect(descriptor.dom.getAttribute('data-variant')).toBe('warning');
        expect(icon.className).toBe('e-callout-icon');
        expect(((icon.querySelector('svg path') as SVGPathElement).getAttribute('fill'))).toBe('#BC4B09');
    });

    it('should fall back to the default info SVG when the requested variant is not registered', () => {
        const options = calloutExtension.config.defineOptions!();
        const views = calloutExtension.config.nodeViews!.call({ options } as any);
        const unknown = views.callout({ variant: 'mystery' }, undefined, () => 1);
        const icon = unknown.dom.firstElementChild as HTMLElement;

        // The data-variant attribute reflects the stored name. Unknown
        // variants have no registered SVG icon.
        expect(unknown.dom.getAttribute('data-variant')).toBe('mystery');
        expect(icon.className).toBe('e-callout-icon');
        expect(icon.innerHTML).toBe('');
    });

    it('should re-render the default info SVG when update receives an unknown variant', () => {
        const options = calloutExtension.config.defineOptions!();
        const views = calloutExtension.config.nodeViews!.call({ options } as any);
        const descriptor = views.callout({ variant: 'info' }, undefined, () => 1);
        const updateOk: boolean = descriptor.update!({ variant: 'mystery' });
        const icon = descriptor.dom.firstElementChild as HTMLElement;

        expect(updateOk).toBe(true);
        expect(descriptor.dom.getAttribute('data-variant')).toBe('mystery');
        expect(icon.className).toBe('e-callout-icon');
        expect(icon.innerHTML).toBe('');
    });

    it('should fall back to the configured default variant in domSpecs when defaultVariant is omitted', () => {
        const domSpecs = calloutExtension.config.domSpecs!.call({
            options: { htmlAttributes: {} }
        } as any);

        expect(domSpecs.nodes!.callout.toDOM!({})).toEqual([
            'div', { 'data-type': 'callout', 'data-variant': 'info' }, 0
        ]);
    });

    it('should preserve the callout variant through undo and redo', () => {
        const localContainer: HTMLElement = document.createElement('div');
        document.body.appendChild(localContainer);
        const localEditor: HeadlessEditor = HeadlessEditor.create({
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
                                text: 'Please review the document before publishing.',
                                marks: []
                            } as TextNode
                        ]
                    }
                ]
            },
            extensions: [
                paragraphExtension,
                calloutExtension,
                undoRedoExtension
            ]
        });
        localEditor.mount(localContainer);
        localEditor.commands.setSelection({ from: 1, to: 13 });

        expect(localEditor.commands.toggleCallout({ variant: 'error' })).toBe(true);
        expect(
            localContainer.querySelector('[data-type="callout"]')!.getAttribute('data-variant')
        ).toBe('error');
        expect(localEditor.commands.undo()).toBe(true);
        expect(localEditor.getHtml()).not.toContain('data-variant="error"');
        expect(localEditor.commands.redo()).toBe(true);
        expect(
            localContainer.querySelector('[data-type="callout"]')!.getAttribute('data-variant')
        ).toBe('error');

        if (!localEditor.isDestroyed) {
            localEditor.destroy();
        }
        localContainer.remove();
    });

    it('should not match near-miss input patterns for either callout rule', () => {
        const rules = calloutExtension.config.inputRules!.call({} as any);
        const exclaim = rules.find(rule => rule.id === 'callout:exclaim')!;
        const colon = rules.find(rule => rule.id === 'callout:colon')!;

        expect(exclaim.pattern.test('!! ')).toBe(false);
        expect(exclaim.pattern.test('!!!! ')).toBe(false);
        expect(exclaim.pattern.test('! ')).toBe(false);
        expect(exclaim.pattern.test('!!!')).toBe(false);

        expect(colon.pattern.test(':: ')).toBe(false);
        expect(colon.pattern.test(':::: ')).toBe(false);
        expect(colon.pattern.test(': ')).toBe(false);
        expect(colon.pattern.test(':::')).toBe(false);
    });

    it('should use the configured default info variant when nodeViews receives options without a defaultVariant', () => {
        const views = calloutExtension.config.nodeViews!.call({
            options: { htmlAttributes: {} }
        } as any);
        const descriptor = views.callout({ variant: null }, undefined, () => 1);
        const icon = descriptor.dom.firstElementChild as HTMLElement;

        expect(descriptor.dom.getAttribute('data-variant')).toBe('info');
        expect(icon.className).toBe('e-callout-icon');
        expect(((icon.querySelector('svg path') as SVGPathElement).getAttribute('fill'))).toBe('#008AA9');
    });

    it('should use the configured default variant when domSpecs receives options without a defaultVariant', () => {
        const domSpecs = calloutExtension.config.domSpecs!.call({
            options: { htmlAttributes: { class: 'editor-callout' } }
        } as any);

        expect(domSpecs.nodes!.callout.toDOM!({})).toEqual([
            'div', {
                class: 'editor-callout',
                'data-type': 'callout',
                'data-variant': 'info'
            }, 0
        ]);
    });

    it('should re-render the default warning SVG when update receives an explicit non-string variant', () => {
        const views = calloutExtension.config.nodeViews!.call({
            options: { defaultVariant: 'warning' }
        } as any);
        const descriptor = views.callout({ variant: 'info' }, undefined, () => 1);
        const updateOk: boolean = descriptor.update!({ variant: 7 as any });
        const icon = descriptor.dom.firstElementChild as HTMLElement;

        expect(updateOk).toBe(true);
        expect(descriptor.dom.getAttribute('data-variant')).toBe('warning');
        expect(icon.className).toBe('e-callout-icon');
        expect(((icon.querySelector('svg path') as SVGPathElement).getAttribute('fill'))).toBe('#BC4B09');
    });
    it('should expose the correct extension name', () => {
        expect(calloutExtension.name).toBe('callout');
    });

    it('should expose the configured priority', () => {
        expect(calloutExtension.config.priority).toBe(10);
    });

    it('should register the callout node definition', () => {
        const nodes = calloutExtension.config.nodes!();

        expect(nodes.length).toBe(1);
        expect(nodes[0].name).toBe('callout');
        expect(nodes[0].group).toBe('block');
    });

    it('should register the variant attribute', () => {
        const nodes = calloutExtension.config.nodes!();

        expect(nodes[0].attrs).toEqual([
            {
                name: 'variant',
                type: 'string',
                default: 'info'
            }
        ]);
    });

    it('should preserve the callout node in the document schema', () => {
        const doc = editor.getDocument();

        expect(doc.children[0].type).toBe('callout');
        expect(doc.children[0].attrs.variant).toBe('info');
    });

    it('should contain a paragraph child in the schema', () => {
        const doc = editor.getDocument();

        expect(doc.children[0].children[0].type).toBe('paragraph');
    });

    it('should serialize callout html correctly', () => {
        const html = editor.getHtml();

        expect(html).toContain('data-type="callout"');
        expect(html).toContain('data-variant="info"');
    });

    it('should provide a dom spec for callout', () => {
        const specs = calloutExtension.config.domSpecs!.call({
            options: {}
        } as any);

        expect(specs.nodes!.callout).toBeDefined();
        expect(specs.nodes!.callout.toDOM).toEqual(jasmine.any(Function));
    });

    it('should provide a node view for callout', () => {
        const views = calloutExtension.config.nodeViews!.call({
            options: calloutExtension.config.defineOptions!()
        } as any);

        expect(views.callout).toEqual(jasmine.any(Function));
    });

    it('should register the expected keyboard shortcut key', () => {
        const shortcuts =
            calloutExtension.config.keyboardShortcuts!.call({
                editor: {
                    commands: {
                        toggleCallout: () => true
                    }
                }
            } as any);

        expect(Object.keys(shortcuts)).toEqual(['Mod-Shift-c']);
    });

    it('should register the expected input rule identifiers', () => {
        const rules =
            calloutExtension.config.inputRules!.call({} as any);

        expect(rules.map(rule => rule.id)).toEqual([
            'callout:exclaim',
            'callout:colon'
        ]);
    });
});
