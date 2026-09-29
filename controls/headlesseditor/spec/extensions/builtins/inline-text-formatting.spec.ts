/**
 * This spec file contains test cases for:
 * - Italic Extension
 * - Underline Extension
 * - Superscript Extension
 * - Subscript Extension
 * - Strikethrough Extension
 * - Uppercase Extension
 * - Lowercase Extension
 */

import {
    HeadlessEditor,
    paragraphExtension,
    TextNode,
    undoRedoExtension,
} from '../../../src/index';

import { italicExtension } from '../../../src/extensions/builtins/italic';
import { underlineExtension } from '../../../src/extensions/builtins/underline';
import { superscriptExtension } from '../../../src/extensions/builtins/superscript';
import { subscriptExtension } from '../../../src/extensions/builtins/subscript';
import { strikethroughExtension } from '../../../src/extensions/builtins/strikethrough';
import { toUpperCaseExtension } from '../../../src/extensions/builtins/upper-case';
import { toLowerCaseExtension } from '../../../src/extensions/builtins/lower-case';

describe('Built-in: italic', () => {
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
                        text: 'Italic Text',
                        marks: []
                    } as TextNode]
                }]
            },
            extensions: [
                paragraphExtension,
                italicExtension,
                undoRedoExtension
            ]
        });

        editor.mount(container);
    });

    afterEach(() => {
        editor.destroy();
        container.remove();
    });

    it('should apply italic formatting', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        editor.commands.toggleItalic();

        expect(editor.getHtml()).toContain('<em>');
    });

    it('should expose the italic name and a default { htmlAttributes: {} } factory', () => {
        expect(italicExtension.name).toBe('italic');
        const opts = italicExtension.config.defineOptions();
        expect(opts).toEqual({ htmlAttributes: {} });
    });

    it('should produce two independent option objects across repeated defineOptions() calls', () => {
        const a = italicExtension.config.defineOptions();
        const b = italicExtension.config.defineOptions();
        expect(a).not.toBe(b);
        expect(a).toEqual(b);
    });

    it('should register exactly one mark named italic with inclusive: true', () => {
        const marks = italicExtension.config.marks();
        expect(marks.length).toBe(1);
        expect(marks[0].name).toBe('italic');
        expect(marks[0].inclusive).toBe(true);
    });

    it('should contribute exactly one toggleItalic command with the matching meta', () => {
        const cmds: any[] = italicExtension.config.commands();
        expect(cmds.length).toBe(1);
        expect(cmds[0].name).toBe('toggleItalic');
        expect(cmds[0].meta).toEqual({ label: 'Italic', category: 'formatting', shortcut: 'Mod-i' });
    });

    it('should render <em>Italic Text</em> over a full-paragraph toggle and no other inline tags', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        editor.commands.toggleItalic();
        const html: string = editor.getHtml();
        expect(html).toContain('<em>Italic Text</em>');
        expect(html).not.toContain('<strong>');
        expect(html).not.toContain('<u>');
        expect(html).not.toContain('<sup>');
        expect(html).not.toContain('<sub>');
        expect(html).not.toContain('<s>');
    });

    it('should report isMarkActive("italic")=true and getActiveMarks() containing italic after toggle', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        editor.commands.toggleItalic();
        expect(editor.isMarkActive('italic')).toBe(true);
        expect(editor.getActiveMarks()).toContain('italic');
    });

    it('should toggle italic off on a second toggle and restore the exact original HTML', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        const before: string = editor.getHtml();
        editor.commands.toggleItalic();
        editor.commands.toggleItalic();
        expect(editor.getHtml()).toBe(before);
        expect(editor.isMarkActive('italic')).toBe(false);
    });

    it('should not add bold when italic is composed (bold requires boldExtension in extensions)', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        editor.commands.toggleItalic();
        const html: string = editor.getHtml();
        expect(html).toContain('<em>');
        expect(html).not.toContain('<strong>');
        expect(editor.isMarkActive('italic')).toBe(true);
        expect(editor.isMarkActive('bold')).toBe(false);
    });

    it('should produce a doc-model text node carrying marks=[{type:italic,attrs:{}}] after toggling', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        editor.commands.toggleItalic();
        const doc: any = (editor as any).getDocument();
        const para = doc.children[0];
        expect(para.children.length).toBe(1);
        expect(para.children[0].text).toBe('Italic Text');
        expect(para.children[0].marks).toEqual([{ type: 'italic', attrs: {} }]);
    });

    it('should return the doc model to marks=[] on the same single text node after a second toggle-off', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        editor.commands.toggleItalic();
        editor.commands.toggleItalic();
        const doc: any = (editor as any).getDocument();
        const para = doc.children[0];
        expect(para.children.length).toBe(1);
        expect(para.children[0].text).toBe('Italic Text');
        expect(para.children[0].marks).toEqual([]);
    });

    it('should let the Mod-i keyboard shortcut apply italic via toggleItalic and emit <em>', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        const scope = { editor: editor } as any;
        const shortcuts: any = italicExtension.config.keyboardShortcuts!.call(scope, {});
        const handler: () => boolean = shortcuts['Mod-i'];
        expect(handler()).toBe(true);
        expect(editor.getHtml()).toContain('<em>');
        expect(editor.isMarkActive('italic')).toBe(true);
    });

    it('should let the Mod-I keyboard shortcut apply italic on the same range', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        const scope = { editor: editor } as any;
        const shortcuts: any = italicExtension.config.keyboardShortcuts!.call(scope, {});
        const handler: () => boolean = shortcuts['Mod-I'];
        expect(handler()).toBe(true);
        expect(editor.getHtml()).toContain('<em>');
    });

    it('should produce an exact default descriptor ["em",{},0] from domSpecs when options.htmlAttributes is missing', () => {
        const domSpecs: any = (italicExtension.config as any).domSpecs.call({ options: undefined });
        const desc = domSpecs.marks.italic.toDOM();
        expect(desc).toEqual(['em', {}, 0]);
    });

    it('should produce the configured descriptor ["em",{class:"x"},0] when htmlAttributes is set', () => {
        const configured: any = italicExtension.config.domSpecs.call({
            options: { htmlAttributes: { class: 'x' } }
        } as any);
        const desc = configured.marks.italic.toDOM();
        expect(desc).toEqual(['em', { class: 'x' }, 0]);
    });

    it('should contribute two inputRules from the italic extension (mark:italic-star, mark:italic-underscore)', () => {
        const rules = italicExtension.config.inputRules!.call({ editor: editor } as any, {});
        expect(rules.length).toBe(2);
        expect(rules[0].id).toBe('mark:italic-star');
        expect(rules[0].pattern.source.endsWith('$')).toBe(true);
        expect(rules[1].id).toBe('mark:italic-underscore');
        expect(rules[1].pattern.source.endsWith('$')).toBe(true);
    });

    it('should emit two adjacent <em> runs for two consecutive italic toggles on adjacent selections', () => {
        editor.commands.setSelection({ from: 1, to: 7 });
        editor.commands.toggleItalic();
        editor.commands.setSelection({ from: 7, to: 12 });
        editor.commands.toggleItalic();
        const html: string = editor.getHtml();
        const doc: any = (editor as any).getDocument();
        const para = doc.children[0];
        const italicChildren = para.children.filter((c: any) =>
            (c.marks || []).some((m: any) => m.type === 'italic')
        );
        expect(italicChildren.length).toBe(2);
        expect((html.match(/<em>/g) || []).length).toBe(2);
    });
    it('should expose a font-style parseDOM rule on the italic mark', () => {
        const specs = italicExtension.config.domSpecs!.call({
            options: {}
        } as any);

        const rules = specs.marks.italic.parseDOM!;
        const fontStyleRule = rules[2] as { style: string; getAttrs?: Function };

        expect(fontStyleRule.style).toBe('font-style');
        expect(typeof fontStyleRule.getAttrs).toBe('function');
        expect(fontStyleRule.getAttrs('italic')).toBeNull();
        expect(fontStyleRule.getAttrs('normal')).toBe(false);
    });
});

describe('Built-in: underline', () => {
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
                        text: 'Underline Text',
                        marks: []
                    } as TextNode]
                }]
            },
            extensions: [
                paragraphExtension,
                underlineExtension,
                undoRedoExtension
            ]
        });

        editor.mount(container);
    });

    afterEach(() => {
        editor.destroy();
        container.remove();
    });

    it('should apply underline formatting', () => {
        editor.commands.setSelection({ from: 1, to: 15 });
        editor.commands.toggleUnderline();

        const html = editor.getHtml();

        expect(html).toContain('<u>');
        expect(html).toContain('Underline Text');
    });

    it('should expose the underline name and a default { htmlAttributes: {} } factory', () => {
        expect(underlineExtension.name).toBe('underline');
        const opts = underlineExtension.config.defineOptions();
        expect(opts).toEqual({ htmlAttributes: {} });
    });

    it('should register exactly one mark named underline with inclusive: true', () => {
        const marks = underlineExtension.config.marks();
        expect(marks.length).toBe(1);
        expect(marks[0].name).toBe('underline');
        expect(marks[0].inclusive).toBe(true);
    });

    it('should contribute exactly one toggleUnderline command with the matching meta', () => {
        const cmds: any[] = underlineExtension.config.commands();
        expect(cmds.length).toBe(1);
        expect(cmds[0].name).toBe('toggleUnderline');
        expect(cmds[0].meta).toEqual({ label: 'Underline', category: 'formatting', shortcut: 'Mod-u' });
    });

    it('should render <u>Underline Text</u> over a full-paragraph toggle and no other inline tags', () => {
        editor.commands.setSelection({ from: 1, to: 15 });
        editor.commands.toggleUnderline();
        const html: string = editor.getHtml();
        expect(html).toContain('<u>Underline Text</u>');
        expect(html).not.toContain('<strong>');
        expect(html).not.toContain('<em>');
        expect(html).not.toContain('<sup>');
        expect(html).not.toContain('<sub>');
        expect(html).not.toContain('<s>');
    });

    it('should report isMarkActive("underline")=true after a full-paragraph toggle', () => {
        editor.commands.setSelection({ from: 1, to: 15 });
        editor.commands.toggleUnderline();
        expect(editor.isMarkActive('underline')).toBe(true);
        expect(editor.getActiveMarks()).toContain('underline');
    });

    it('should toggle underline off on a second toggle and restore the exact original HTML', () => {
        editor.commands.setSelection({ from: 1, to: 15 });
        const before: string = editor.getHtml();
        editor.commands.toggleUnderline();
        editor.commands.toggleUnderline();
        expect(editor.getHtml()).toBe(before);
        expect(editor.isMarkActive('underline')).toBe(false);
    });

    it('should undo a full-paragraph toggle and restore the original HTML via undoRedoExtension', () => {
        editor.commands.setSelection({ from: 1, to: 15 });
        const before: string = editor.getHtml();
        editor.commands.toggleUnderline();
        expect(editor.getHtml()).toContain('<u>');
        const undoResult: boolean = editor.commands.undo();
        expect(undoResult).toBe(true);
        expect(editor.getHtml()).toBe(before);
    });

    it('should let the Mod-u keyboard shortcut apply underline via toggleUnderline and emit <u>', () => {
        editor.commands.setSelection({ from: 1, to: 15 });
        const scope = { editor: editor } as any;
        const shortcuts: any = underlineExtension.config.keyboardShortcuts!.call(scope, {});
        const handler: () => boolean = shortcuts['Mod-u'];
        expect(handler()).toBe(true);
        expect(editor.getHtml()).toContain('<u>Underline Text</u>');
    });

    it('should let the Mod-U keyboard shortcut apply underline on the same range', () => {
        editor.commands.setSelection({ from: 1, to: 15 });
        const scope = { editor: editor } as any;
        const shortcuts: any = underlineExtension.config.keyboardShortcuts!.call(scope, {});
        const handler: () => boolean = shortcuts['Mod-U'];
        expect(handler()).toBe(true);
        expect(editor.getHtml()).toContain('<u>');
    });

    it('should produce an exact default descriptor ["u",{},0] from domSpecs when options.htmlAttributes is missing', () => {
        const domSpecs: any = (underlineExtension.config as any).domSpecs.call({ options: undefined });
        const desc = domSpecs.marks.underline.toDOM();
        expect(desc).toEqual(['u', {}, 0]);
    });

    it('should produce the configured descriptor ["u",{class:"x"},0] when htmlAttributes is set', () => {
        const configured: any = underlineExtension.config.domSpecs.call({
            options: { htmlAttributes: { class: 'x' } }
        } as any);
        const desc = configured.marks.underline.toDOM();
        expect(desc).toEqual(['u', { class: 'x' }, 0]);
    });

    it('should contribute one inputRule (mark:underline) with a $-anchored pattern', () => {
        const rules = underlineExtension.config.inputRules!.call({ editor: editor } as any, {});
        expect(rules.length).toBe(1);
        expect(rules[0].id).toBe('mark:underline');
        expect(rules[0].pattern.source.endsWith('$')).toBe(true);
    });

    it('should produce a doc-model text node carrying marks=[{type:underline,attrs:{}}] after toggling', () => {
        editor.commands.setSelection({ from: 1, to: 15 });
        editor.commands.toggleUnderline();
        const doc: any = (editor as any).getDocument();
        const para = doc.children[0];
        expect(para.children.length).toBe(1);
        expect(para.children[0].text).toBe('Underline Text');
        expect(para.children[0].marks).toEqual([{ type: 'underline', attrs: {} }]);
    });

    it('should return the doc model to marks=[] on the same text node after a second toggle-off', () => {
        editor.commands.setSelection({ from: 1, to: 15 });
        editor.commands.toggleUnderline();
        editor.commands.toggleUnderline();
        const doc: any = (editor as any).getDocument();
        const para = doc.children[0];
        expect(para.children.length).toBe(1);
        expect(para.children[0].text).toBe('Underline Text');
        expect(para.children[0].marks).toEqual([]);
    });

    it('should emit two adjacent <u> runs for two consecutive underline toggles on adjacent selections', () => {
        editor.commands.setSelection({ from: 1, to: 10 });
        editor.commands.toggleUnderline();
        editor.commands.setSelection({ from: 10, to: 15 });
        editor.commands.toggleUnderline();
        const html: string = editor.getHtml();
        const doc: any = (editor as any).getDocument();
        const para = doc.children[0];
        const underlineChildren = para.children.filter((c: any) =>
            (c.marks || []).some((m: any) => m.type === 'underline')
        );
        expect(underlineChildren.length).toBe(2);
        expect((html.match(/<u>/g) || []).length).toBe(2);
    });

    it('should expose a text-decoration parseDOM rule on the underline mark', () => {
        const specs = underlineExtension.config.domSpecs!.call({
            options: {}
        } as any);

        const rules = specs.marks.underline.parseDOM!;
        const textDecorationRule = rules[1] as { style: string; getAttrs?: Function };

        expect(rules.length).toBe(2);
        expect(rules[0]).toEqual({ tag: 'u' });
        expect(textDecorationRule.style).toBe('text-decoration');
        expect(typeof textDecorationRule.getAttrs).toBe('function');
        expect(textDecorationRule.getAttrs('underline')).toBeNull();
        expect(textDecorationRule.getAttrs('none')).toBe(false);
    });

});

describe('Built-in: strikethrough', () => {
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
                        text: 'Strike Text',
                        marks: []
                    } as TextNode]
                }]
            },
            extensions: [
                paragraphExtension,
                strikethroughExtension,
                undoRedoExtension
            ]
        });

        editor.mount(container);
    });

    afterEach(() => {
        editor.destroy();
        container.remove();
    });

    it('should apply strikethrough formatting', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        editor.commands.toggleStrikethrough();

        const html = editor.getHtml();

        expect(html).toContain('Strike Text');
        expect(html).toContain('<s>');
    });

    it('should expose the strikethrough name and a default { htmlAttributes: {} } factory', () => {
        expect(strikethroughExtension.name).toBe('strikethrough');
        const opts = strikethroughExtension.config.defineOptions();
        expect(opts).toEqual({ htmlAttributes: {} });
    });

    it('should register exactly one mark named strikethrough with inclusive: true', () => {
        const marks = strikethroughExtension.config.marks();
        expect(marks.length).toBe(1);
        expect(marks[0].name).toBe('strikethrough');
        expect(marks[0].inclusive).toBe(true);
    });

    it('should contribute exactly one toggleStrikethrough command with the matching meta', () => {
        const cmds: any[] = strikethroughExtension.config.commands();
        expect(cmds.length).toBe(1);
        expect(cmds[0].name).toBe('toggleStrikethrough');
        expect(cmds[0].meta).toEqual({
            label: 'Strikethrough',
            category: 'formatting',
            shortcut: 'Mod-Shift-x'
        });
    });

    it('should render <s>Strike Text</s> over a full-paragraph toggle and no other inline tags', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        editor.commands.toggleStrikethrough();
        const html: string = editor.getHtml();
        expect(html).toContain('<s>Strike Text</s>');
        expect(html).not.toContain('<strong>');
        expect(html).not.toContain('<em>');
        expect(html).not.toContain('<u>');
        expect(html).not.toContain('<sup>');
        expect(html).not.toContain('<sub>');
    });

    it('should report isMarkActive("strikethrough")=true after a full-paragraph toggle', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        editor.commands.toggleStrikethrough();
        expect(editor.isMarkActive('strikethrough')).toBe(true);
        expect(editor.getActiveMarks()).toContain('strikethrough');
    });

    it('should toggle strikethrough off on a second toggle and restore the exact original HTML', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        const before: string = editor.getHtml();
        editor.commands.toggleStrikethrough();
        editor.commands.toggleStrikethrough();
        expect(editor.getHtml()).toBe(before);
        expect(editor.isMarkActive('strikethrough')).toBe(false);
    });

    it('should report editor.can("toggleStrikethrough") = true over a non-collapsed selection', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        expect(editor.can().toggleStrikethrough()).toBe(true);
    });

    it('should undo a full-paragraph toggle and restore the original HTML via undoRedoExtension', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        const before: string = editor.getHtml();
        editor.commands.toggleStrikethrough();
        expect(editor.getHtml()).toContain('<s>');
        const undoResult: boolean = editor.commands.undo();
        expect(undoResult).toBe(true);
        expect(editor.getHtml()).toBe(before);
    });

    it('should let the Mod-Shift-x keyboard shortcut apply strikethrough via toggleStrikethrough and emit <s>', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        const scope = { editor: editor } as any;
        const shortcuts: any = strikethroughExtension.config.keyboardShortcuts!.call(scope, {});
        expect(Object.keys(shortcuts)).toEqual(['Mod-Shift-x']);
        const handler: () => boolean = shortcuts['Mod-Shift-x'];
        expect(handler()).toBe(true);
        expect(editor.getHtml()).toContain('<s>Strike Text</s>');
    });

    it('should produce an exact default descriptor ["s",{},0] from domSpecs when options.htmlAttributes is missing', () => {
        const domSpecs: any = (strikethroughExtension.config as any).domSpecs.call({ options: undefined });
        const desc = domSpecs.marks.strikethrough.toDOM();
        expect(desc).toEqual(['s', {}, 0]);
    });

    it('should produce the configured descriptor ["s",{class:"x"},0] when htmlAttributes is set', () => {
        const configured: any = strikethroughExtension.config.domSpecs.call({
            options: { htmlAttributes: { class: 'x' } }
        } as any);
        const desc = configured.marks.strikethrough.toDOM();
        expect(desc).toEqual(['s', { class: 'x' }, 0]);
    });

    it('should contribute one inputRule (mark:strikethrough) with a $-anchored pattern', () => {
        const rules = strikethroughExtension.config.inputRules!.call({ editor: editor } as any, {});
        expect(rules.length).toBe(1);
        expect(rules[0].id).toBe('mark:strikethrough');
        expect(rules[0].pattern.source.endsWith('$')).toBe(true);
    });

    it('should produce a doc-model text node carrying marks=[{type:strikethrough,attrs:{}}] after toggling', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        editor.commands.toggleStrikethrough();
        const doc: any = (editor as any).getDocument();
        const para = doc.children[0];
        expect(para.children.length).toBe(1);
        expect(para.children[0].text).toBe('Strike Text');
        expect(para.children[0].marks).toEqual([{ type: 'strikethrough', attrs: {} }]);
    });

    it('should return the doc model to marks=[] on the same text node after a second toggle-off', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        editor.commands.toggleStrikethrough();
        editor.commands.toggleStrikethrough();
        const doc: any = (editor as any).getDocument();
        const para = doc.children[0];
        expect(para.children.length).toBe(1);
        expect(para.children[0].text).toBe('Strike Text');
        expect(para.children[0].marks).toEqual([]);
    });

    it('should emit two adjacent <s> runs for two consecutive strikethrough toggles on adjacent selections', () => {
        editor.commands.setSelection({ from: 1, to: 7 });
        editor.commands.toggleStrikethrough();
        editor.commands.setSelection({ from: 7, to: 12 });
        editor.commands.toggleStrikethrough();
        const html: string = editor.getHtml();
        const doc: any = (editor as any).getDocument();
        const para = doc.children[0];
        const strikeChildren = para.children.filter((c: any) =>
            (c.marks || []).some((m: any) => m.type === 'strikethrough')
        );
        expect(strikeChildren.length).toBe(2);
        expect((html.match(/<s>/g) || []).length).toBe(2);
    });

    it('should expose a text-decoration parseDOM rule on the strikethrough mark', () => {
        const specs = strikethroughExtension.config.domSpecs!.call({
            options: {}
        } as any);

        const rules = specs.marks.strikethrough.parseDOM!;
        const textDecorationRule = rules[2] as {
            style: string;
            getAttrs: (value: string) => unknown;
        };

        expect(rules.length).toBe(3);
        expect(rules[0]).toEqual({ tag: 's' });
        expect(rules[1]).toEqual({ tag: 'del' });
        expect(textDecorationRule.style).toBe('text-decoration');
        expect(typeof textDecorationRule.getAttrs).toBe('function');
        expect(textDecorationRule.getAttrs('line-through')).toBeNull();
        expect(textDecorationRule.getAttrs('underline')).toBe(false);
    });

});

describe('Built-in: superscript', () => {
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
                        text: 'x2',
                        marks: []
                    } as TextNode]
                }]
            },
            extensions: [
                paragraphExtension,
                superscriptExtension,
                undoRedoExtension
            ]
        });

        editor.mount(container);
    });

    afterEach(() => {
        editor.destroy();
        container.remove();
    });

    it('should apply superscript formatting', () => {
        editor.commands.setSelection({ from: 2, to: 3 });
        editor.commands.toggleSuperscript();

        expect(editor.getHtml()).toContain('<sup>');
    });

    it('should expose the superscript name and a default { htmlAttributes: {} } factory', () => {
        expect(superscriptExtension.name).toBe('superscript');
        const opts = superscriptExtension.config.defineOptions();
        expect(opts).toEqual({ htmlAttributes: {} });
    });

    it('should register exactly one mark named superscript with inclusive: false', () => {
        const marks = superscriptExtension.config.marks();
        expect(marks.length).toBe(1);
        expect(marks[0].name).toBe('superscript');
        expect(marks[0].inclusive).toBe(false);
    });

    it('should contribute exactly one toggleSuperscript command with the matching meta', () => {
        const cmds: any[] = superscriptExtension.config.commands();
        expect(cmds.length).toBe(1);
        expect(cmds[0].name).toBe('toggleSuperscript');
        expect(cmds[0].meta).toEqual({
            label: 'Superscript',
            category: 'formatting',
            shortcut: 'Mod-Shift-.'
        });
    });

    it('should render <sup>x2</sup> over a full-paragraph toggle and no other inline tags', () => {
        editor.commands.setSelection({ from: 1, to: 3 });
        editor.commands.toggleSuperscript();
        const html: string = editor.getHtml();
        expect(html).toContain('<sup>x2</sup>');
        expect(html).not.toContain('<strong>');
        expect(html).not.toContain('<em>');
        expect(html).not.toContain('<u>');
        expect(html).not.toContain('<sub>');
        expect(html).not.toContain('<s>');
    });

    it('should report isMarkActive("superscript")=true after a full-paragraph toggle', () => {
        editor.commands.setSelection({ from: 1, to: 3 });
        editor.commands.toggleSuperscript();
        expect(editor.isMarkActive('superscript')).toBe(true);
        expect(editor.getActiveMarks()).toContain('superscript');
    });

    it('should toggle superscript off on a second toggle and restore the exact original HTML', () => {
        editor.commands.setSelection({ from: 1, to: 3 });
        const before: string = editor.getHtml();
        editor.commands.toggleSuperscript();
        editor.commands.toggleSuperscript();
        expect(editor.getHtml()).toBe(before);
        expect(editor.isMarkActive('superscript')).toBe(false);
    });

    it('should report editor.can("toggleSuperscript") = true over a non-collapsed selection', () => {
        editor.commands.setSelection({ from: 1, to: 3 });
        expect(editor.can().toggleSuperscript()).toBe(true);
    });

    it('should undo a full-paragraph toggle and restore the original HTML via undoRedoExtension', () => {
        editor.commands.setSelection({ from: 1, to: 3 });
        const before: string = editor.getHtml();
        editor.commands.toggleSuperscript();
        expect(editor.getHtml()).toContain('<sup>');
        const undoResult: boolean = editor.commands.undo();
        expect(undoResult).toBe(true);
        expect(editor.getHtml()).toBe(before);
    });

    it('should let the Mod-. keyboard shortcut apply superscript via toggleSuperscript and emit <sup>', () => {
        editor.commands.setSelection({ from: 1, to: 3 });
        const scope = { editor: editor } as any;
        const shortcuts: any = superscriptExtension.config.keyboardShortcuts!.call(scope, {});
        expect(Object.keys(shortcuts)).toEqual(['Mod-.']);
        const handler: () => boolean = shortcuts['Mod-.'];
        expect(handler()).toBe(true);
        expect(editor.getHtml()).toContain('<sup>x2</sup>');
    });

    it('should produce an exact default descriptor ["sup",{},0] from domSpecs when options.htmlAttributes is missing', () => {
        const domSpecs: any = (superscriptExtension.config as any).domSpecs.call({ options: undefined });
        const desc = domSpecs.marks.superscript.toDOM();
        expect(desc).toEqual(['sup', {}, 0]);
    });

    it('should produce the configured descriptor ["sup",{class:"x"},0] when htmlAttributes is set', () => {
        const configured: any = superscriptExtension.config.domSpecs.call({
            options: { htmlAttributes: { class: 'x' } }
        } as any);
        const desc = configured.marks.superscript.toDOM();
        expect(desc).toEqual(['sup', { class: 'x' }, 0]);
    });

    it('should contribute one inputRule (mark:superscript) with a $-anchored pattern', () => {
        const rules = superscriptExtension.config.inputRules!.call({ editor: editor } as any, {});
        expect(rules.length).toBe(1);
        expect(rules[0].id).toBe('mark:superscript');
        expect(rules[0].pattern.source.endsWith('$')).toBe(true);
        expect(rules[0].allowUndo).toBe(true);
    });

    it('should produce a doc-model text node carrying marks=[{type:superscript,attrs:{}}] after toggling', () => {
        editor.commands.setSelection({ from: 1, to: 3 });
        editor.commands.toggleSuperscript();
        const doc: any = (editor as any).getDocument();
        const para = doc.children[0];
        expect(para.children.length).toBe(1);
        expect(para.children[0].text).toBe('x2');
        expect(para.children[0].marks).toEqual([{ type: 'superscript', attrs: {} }]);
    });

    it('should return the doc model to marks=[] on the same text node after a second toggle-off', () => {
        editor.commands.setSelection({ from: 1, to: 3 });
        editor.commands.toggleSuperscript();
        editor.commands.toggleSuperscript();
        const doc: any = (editor as any).getDocument();
        const para = doc.children[0];
        expect(para.children.length).toBe(1);
        expect(para.children[0].text).toBe('x2');
        expect(para.children[0].marks).toEqual([]);
    });

    it('should toggle only the selected range so a partial selection leaves the rest plain (inclusive: false)', () => {
        editor.commands.setSelection({ from: 2, to: 3 });
        editor.commands.toggleSuperscript();
        const html: string = editor.getHtml();
        expect(html).toContain('<sup>2</sup>');
        expect(html).not.toContain('<sup>x2</sup>');
        const doc: any = (editor as any).getDocument();
        const para = doc.children[0];
        const superscriptChildren = para.children.filter((c: any) =>
            (c.marks || []).some((m: any) => m.type === 'superscript')
        );
        expect(superscriptChildren.length).toBe(1);
        expect(superscriptChildren[0].text).toBe('2');
    });

});

describe('Built-in: subscript', () => {
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
                        text: 'H2O',
                        marks: []
                    } as TextNode]
                }]
            },
            extensions: [
                paragraphExtension,
                subscriptExtension,
                undoRedoExtension
            ]
        });

        editor.mount(container);
    });

    afterEach(() => {
        editor.destroy();
        container.remove();
    });

    it('should apply subscript formatting', () => {
        editor.commands.setSelection({ from: 2, to: 3 });
        editor.commands.toggleSubscript();
        expect(editor.getHtml()).toContain('<sub>');
    });

    it('should expose the subscript name and a default { htmlAttributes: {} } factory', () => {
        expect(subscriptExtension.name).toBe('subscript');
        const opts = subscriptExtension.config.defineOptions();
        expect(opts).toEqual({ htmlAttributes: {} });
    });

    it('should register exactly one mark named subscript with inclusive: false', () => {
        const marks = subscriptExtension.config.marks();
        expect(marks.length).toBe(1);
        expect(marks[0].name).toBe('subscript');
        expect(marks[0].inclusive).toBe(false);
    });

    it('should contribute exactly one toggleSubscript command with the matching meta', () => {
        const cmds: any[] = subscriptExtension.config.commands();
        expect(cmds.length).toBe(1);
        expect(cmds[0].name).toBe('toggleSubscript');
        expect(cmds[0].meta).toEqual({
            label: 'Subscript',
            category: 'formatting',
            shortcut: 'Mod-Shift-,'
        });
    });

    it('should render <sub>H2O</sub> over a full-paragraph toggle and no other inline tags', () => {
        editor.commands.setSelection({ from: 1, to: 4 });
        editor.commands.toggleSubscript();
        const html: string = editor.getHtml();
        expect(html).toContain('<sub>H2O</sub>');
        expect(html).not.toContain('<strong>');
        expect(html).not.toContain('<em>');
        expect(html).not.toContain('<u>');
        expect(html).not.toContain('<sup>');
        expect(html).not.toContain('<s>');
    });

    it('should report isMarkActive("subscript")=true after a full-paragraph toggle', () => {
        editor.commands.setSelection({ from: 1, to: 4 });
        editor.commands.toggleSubscript();
        expect(editor.isMarkActive('subscript')).toBe(true);
        expect(editor.getActiveMarks()).toContain('subscript');
    });

    it('should toggle subscript off on a second toggle and restore the exact original HTML', () => {
        editor.commands.setSelection({ from: 1, to: 4 });
        const before: string = editor.getHtml();
        editor.commands.toggleSubscript();
        editor.commands.toggleSubscript();
        expect(editor.getHtml()).toBe(before);
        expect(editor.isMarkActive('subscript')).toBe(false);
    });

    it('should report editor.can("toggleSubscript") = true over a non-collapsed selection', () => {
        editor.commands.setSelection({ from: 1, to: 4 });
        expect(editor.can().toggleSubscript()).toBe(true);
    });

    it('should undo a full-paragraph toggle and restore the original HTML via undoRedoExtension', () => {
        editor.commands.setSelection({ from: 1, to: 4 });
        const before: string = editor.getHtml();
        editor.commands.toggleSubscript();
        expect(editor.getHtml()).toContain('<sub>');
        const undoResult: boolean = editor.commands.undo();
        expect(undoResult).toBe(true);
        expect(editor.getHtml()).toBe(before);
    });

    it('should let the Mod-, keyboard shortcut apply subscript via toggleSubscript and emit <sub>', () => {
        editor.commands.setSelection({ from: 1, to: 4 });
        const scope = { editor: editor } as any;
        const shortcuts: any = subscriptExtension.config.keyboardShortcuts!.call(scope, {});
        expect(Object.keys(shortcuts)).toEqual(['Mod-,']);
        const handler: () => boolean = shortcuts['Mod-,'];
        expect(handler()).toBe(true);
        expect(editor.getHtml()).toContain('<sub>H2O</sub>');
    });

    it('should produce an exact default descriptor ["sub",{},0] from domSpecs when options.htmlAttributes is missing', () => {
        const domSpecs: any = (subscriptExtension.config as any).domSpecs.call({ options: undefined });
        const desc = domSpecs.marks.subscript.toDOM();
        expect(desc).toEqual(['sub', {}, 0]);
    });

    it('should produce the configured descriptor ["sub",{class:"x"},0] when htmlAttributes is set', () => {
        const configured: any = subscriptExtension.config.domSpecs.call({
            options: { htmlAttributes: { class: 'x' } }
        } as any);
        const desc = configured.marks.subscript.toDOM();
        expect(desc).toEqual(['sub', { class: 'x' }, 0]);
    });

    it('should contribute one inputRule (mark:subscript) and per source the pattern is not $-anchored', () => {
        const rules = subscriptExtension.config.inputRules!.call({ editor: editor } as any, {});
        expect(rules.length).toBe(1);
        expect(rules[0].id).toBe('mark:subscript');
        expect(rules[0].pattern.source.endsWith('$')).toBe(false);
        expect(rules[0].allowUndo).toBe(true);
    });

    it('should produce a doc-model text node carrying marks=[{type:subscript,attrs:{}}] after toggling', () => {
        editor.commands.setSelection({ from: 1, to: 4 });
        editor.commands.toggleSubscript();
        const doc: any = (editor as any).getDocument();
        const para = doc.children[0];
        expect(para.children.length).toBe(1);
        expect(para.children[0].text).toBe('H2O');
        expect(para.children[0].marks).toEqual([{ type: 'subscript', attrs: {} }]);
    });

    it('should return the doc model to marks=[] on the same text node after a second toggle-off', () => {
        editor.commands.setSelection({ from: 1, to: 4 });
        editor.commands.toggleSubscript();
        editor.commands.toggleSubscript();
        const doc: any = (editor as any).getDocument();
        const para = doc.children[0];
        expect(para.children.length).toBe(1);
        expect(para.children[0].text).toBe('H2O');
        expect(para.children[0].marks).toEqual([]);
    });

    it('should toggle only the selected range so a partial selection leaves the rest plain (inclusive: false)', () => {
        editor.commands.setSelection({ from: 2, to: 3 });
        editor.commands.toggleSubscript();
        const html: string = editor.getHtml();
        expect(html).toContain('<sub>2</sub>');
        expect(html).not.toContain('<sub>H2O</sub>');
        const doc: any = (editor as any).getDocument();
        const para = doc.children[0];
        const subscriptChildren = para.children.filter((c: any) =>
            (c.marks || []).some((m: any) => m.type === 'subscript')
        );
        expect(subscriptChildren.length).toBe(1);
        expect(subscriptChildren[0].text).toBe('2');
    });

});

describe('Built-in: uppercase', () => {
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
                        text: 'hello world',
                        marks: []
                    } as TextNode]
                }]
            },
            extensions: [
                paragraphExtension,
                toUpperCaseExtension,
                undoRedoExtension
            ]
        });

        editor.mount(container);
    });

    afterEach(() => {
        editor.destroy();
        container.remove();
    });

    it('should convert selected text to uppercase', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        editor.commands.toUpperCase();
        expect(editor.getText()).toContain('HELLO WORLD');
    });

    it('should expose the uppercase name and a default { htmlAttributes: {} } factory', () => {
        expect(toUpperCaseExtension.name).toBe('toUpperCase');
        const opts = toUpperCaseExtension.config.defineOptions();
        expect(opts).toEqual({ htmlAttributes: {} });
    });

    it('should revert to uppercase(...)() throwing or returning gracefully when marks() is not contributed', () => {
        const marksFn = (toUpperCaseExtension as any).config.marks;
        if (typeof marksFn === 'function') {
            expect(marksFn()).toEqual([]);
        } else {
            expect(marksFn).toBeUndefined();
        }
    });

    it('should contribute exactly one toUpperCase command with the matching meta', () => {
        const cmds: any[] = toUpperCaseExtension.config.commands();
        expect(cmds.length).toBe(1);
        expect(cmds[0].name).toBe('toUpperCase');
        expect(cmds[0].meta).toEqual({
            label: 'UPPERCASE',
            category: 'formatting',
            shortcut: 'Mod-Shift-u'
        });
    });

    it('should uppercase the full selected text', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        editor.commands.toUpperCase();
        expect(editor.getText()).toBe('HELLO WORLD');
    });

    it('should uppercase only the selected range when only a partial selection is made', () => {
        editor.commands.setSelection({ from: 1, to: 7 });
        editor.commands.toUpperCase();
        expect(editor.getText()).toBe('HELLO world');
    });

    it('should be idempotent: a second uppercase on the same range leaves the text unchanged', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        editor.commands.toUpperCase();
        editor.commands.toUpperCase();
        expect(editor.getText()).toBe('HELLO WORLD');
    });

    it('should leave the document unchanged when called with a collapsed selection', () => {
        editor.commands.setSelection({ from: 5, to: 5 });
        const before: string = editor.getText();
        editor.commands.toUpperCase();
        expect(editor.getText()).toBe(before);
    });

    it('should early-bail silently when called with a collapsed selection (from === to, no transformation)', () => {
        editor.commands.setSelection({ from: 5, to: 5 });
        const before: string = editor.getText();
        editor.commands.toUpperCase();
        expect(editor.getText()).toBe(before);
    });

    it('should restore the original text via undoRedoExtension', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        const before: string = editor.getText();
        editor.commands.toUpperCase();
        expect(editor.getText()).toBe('HELLO WORLD');
        const undoResult: boolean = editor.commands.undo();
        expect(undoResult).toBe(true);
        expect(editor.getText()).toBe(before);
    });

    it('should reapply the uppercased text via redo', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        editor.commands.toUpperCase();
        editor.commands.undo();
        editor.commands.redo();
        expect(editor.getText()).toBe('HELLO WORLD');
    });

    it('should uppercase letters but preserve a non-letter substring (the space) across two partial calls', () => {
        editor.commands.setSelection({ from: 1, to: 6 });
        editor.commands.toUpperCase();
        editor.commands.setSelection({ from: 7, to: 12 });
        editor.commands.toUpperCase();
        expect(editor.getText()).toBe('HELLO WORLD');
    });

    it('should expose the correct uppercase extension name', () => {
        expect(toUpperCaseExtension.name).toBe('toUpperCase');
    });

    it('should return default uppercase options', () => {
        expect(
            toUpperCaseExtension.config.defineOptions!()
        ).toEqual({
            htmlAttributes: {}
        });
    });

    it('should return independent uppercase option objects', () => {
        const first = toUpperCaseExtension.config.defineOptions!();
        const second = toUpperCaseExtension.config.defineOptions!();

        expect(first).not.toBe(second);
        expect(first).toEqual(second);
    });

    it('should register the toUpperCase command', () => {
        const commands = toUpperCaseExtension.config.commands!();

        expect(commands.length).toBe(1);
        expect(commands[0].name).toBe('toUpperCase');
    });

    it('should expose the uppercase command through the editor', () => {
        expect(typeof editor.commands.toUpperCase).toBe('function');
    });

});

describe('Built-in: lowercase', () => {
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
                        text: 'HELLO WORLD',
                        marks: []
                    } as TextNode]
                }]
            },
            extensions: [
                paragraphExtension,
                toLowerCaseExtension,
                undoRedoExtension
            ]
        });

        editor.mount(container);
    });

    afterEach(() => {
        editor.destroy();
        container.remove();
    });

    it('should convert selected text to lowercase', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        editor.commands.toLowerCase();
        expect(editor.getText()).toContain('hello world');
    });

    it('should expose the lowercase name and a default { htmlAttributes: {} } factory', () => {
        expect(toLowerCaseExtension.name).toBe('toLowerCase');
        const opts = toLowerCaseExtension.config.defineOptions();
        expect(opts).toEqual({ htmlAttributes: {} });
    });

    it('should not contribute any marks for the toLowerCase command-only extension', () => {
        const marksFn = (toLowerCaseExtension as any).config.marks;
        if (typeof marksFn === 'function') {
            expect(marksFn()).toEqual([]);
        } else {
            expect(marksFn).toBeUndefined();
        }
    });

    it('should contribute exactly one toLowerCase command with the matching meta', () => {
        const cmds: any[] = toLowerCaseExtension.config.commands();
        expect(cmds.length).toBe(1);
        expect(cmds[0].name).toBe('toLowerCase');
        expect(cmds[0].meta).toEqual({
            label: 'lowercase',
            category: 'formatting',
            shortcut: 'Mod-Shift-l'
        });
    });

    it('should lowercase the full selected text', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        editor.commands.toLowerCase();
        expect(editor.getText()).toBe('hello world');
    });

    it('should lowercase only the selected range when only a partial selection is made', () => {
        editor.commands.setSelection({ from: 7, to: 12 });
        editor.commands.toLowerCase();
        expect(editor.getText()).toBe('HELLO world');
    });

    it('should be idempotent: a second lowercase on the same range leaves the text unchanged', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        editor.commands.toLowerCase();
        editor.commands.toLowerCase();
        expect(editor.getText()).toBe('hello world');
    });

    it('should leave the document unchanged when called with a collapsed selection', () => {
        editor.commands.setSelection({ from: 5, to: 5 });
        const before: string = editor.getText();
        editor.commands.toLowerCase();
        expect(editor.getText()).toBe(before);
    });

    it('should early-bail silently when called with a collapsed selection (from === to, no transformation)', () => {
        editor.commands.setSelection({ from: 5, to: 5 });
        const before: string = editor.getText();
        editor.commands.toLowerCase();
        expect(editor.getText()).toBe(before);
    });

    it('should restore the original text via undoRedoExtension', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        const before: string = editor.getText();
        editor.commands.toLowerCase();
        expect(editor.getText()).toBe('hello world');
        const undoResult: boolean = editor.commands.undo();
        expect(undoResult).toBe(true);
        expect(editor.getText()).toBe(before);
    });

    it('should reapply the lowercased text via redo', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        editor.commands.toLowerCase();
        editor.commands.undo();
        editor.commands.redo();
        expect(editor.getText()).toBe('hello world');
    });

    it('should expose the correct lowercase extension name', () => {
        expect(toLowerCaseExtension.name).toBe('toLowerCase');
    });

    it('should return default lowercase options', () => {
        expect(
            toLowerCaseExtension.config.defineOptions!()
        ).toEqual({
            htmlAttributes: {}
        });
    });

    it('should return independent lowercase option objects', () => {
        const first = toLowerCaseExtension.config.defineOptions!();
        const second = toLowerCaseExtension.config.defineOptions!();

        expect(first).not.toBe(second);
        expect(first).toEqual(second);
    });

    it('should register the toLowerCase command', () => {
        const commands = toLowerCaseExtension.config.commands!();

        expect(commands.length).toBe(1);
        expect(commands[0].name).toBe('toLowerCase');
    });

    it('should expose the lowercase command through the editor', () => {
        expect(typeof editor.commands.toLowerCase).toBe('function');
    });

});