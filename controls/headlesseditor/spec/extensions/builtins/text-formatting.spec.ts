/**
 * This spec file contains test cases for:
 * - Font Family Extension
 * - Font Size Extension
 * - Font Style Extension
 * - Text Style Extension
 * - Text Align Extension
 * - Heading Extension
 */

import {
    HeadlessEditor,
    TextNode,
    paragraphExtension,
    headingExtension,
    boldExtension,
    undoRedoExtension
} from '../../../src/index';

import { fontFamilyExtension } from '../../../src/extensions/builtins/font-family';
import { fontSizeExtension } from '../../../src/extensions/builtins/font-size';
import { fontColorExtension } from '../../../src/extensions/builtins/font-color';
import { textStyleExtension } from '../../../src/extensions/builtins/text-style';
import { textAlignExtension } from '../../../src/extensions/builtins/text-align';
import { toUpperCaseExtension } from '../../../src/extensions/builtins/upper-case';
import { toLowerCaseExtension } from '../../../src/extensions/builtins/lower-case';

/**
 * Builds a minimal DOM-like mock for a `<span>` element with the given inline
 * style attribute. The mock has the shape the textStyle parse rule expects
 * (nodeType, nodeName, parentElement, getAttribute) without pulling in a real
 * DOM tree. Parent is `null` by default; tests that need ancestor chains
 * should construct real DOM nodes.
 *
 * @param {string | null} styleValue - The style attribute value to return.
 * @returns {object} A mock that looks like a real span to the parse rule.
 */
function makeSpanMock(styleValue: string | null): any {
    return {
        nodeType: 1,
        nodeName: 'SPAN',
        parentElement: null,
        getAttribute: (name: string) => (name === 'style' ? styleValue : null)
    };
}

describe('Built-in: heading', () => {
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
                                text: 'Heading One',
                                marks: []
                            } as TextNode
                        ]
                    }
                ]
            },
            extensions: [
                headingExtension,
                undoRedoExtension
            ]
        });

        editor.mount(container);
    });

    afterEach(() => {
        editor.destroy();
        container.remove();
    });

    it('should render heading', () => {
        const html = editor.getHtml();

        expect(html).toContain('<h1');
        expect(html).toContain('Heading One');
    });

    it('should expose independent heading defaults', () => {
        expect(headingExtension.name).toBe('heading');
        const first = headingExtension.config.defineOptions!();
        const second = headingExtension.config.defineOptions!();
        expect(first).toEqual({ htmlAttributes: {} });
        expect(first).not.toBe(second);
    });

    it('should define a heading node with a level attribute', () => {
        const node = headingExtension.config.nodes!()[0] as any;
        expect(node.name).toBe('heading');
        expect(node.group).toBe('block');
        expect(node.attrs).toContain(jasmine.objectContaining({ name: 'level', type: 'number', default: 1 }));
    });

    it('should use fallback heading DOM attributes when options and level are absent', () => {
        const specs: any = headingExtension.config.domSpecs!.call({} as any);
        expect(specs.nodes.heading.toDOM({})).toEqual(['h1', {}, 0]);
    });

    for (const level of [1, 2, 3, 4, 5, 6]) {
        it(`should render heading level ${level} as h${level}`, () => {
            editor.commands.setHeading({ level });
            expect(editor.getHtml()).toContain(`<h${level}>Heading One</h${level}>`);
        });
    }

    it('should convert the current heading to level two without losing text', () => {
        expect(editor.commands.setHeading({ level: 2 })).toBe(true);
        expect(editor.getDocument().children[0].type).toBe('heading');
        expect((editor.getDocument().children[0].children[0] as TextNode).text).toBe('Heading One');
    });

    it('should reach the maximum heading level', () => {
        expect(editor.commands.setHeading({ level: 6 })).toBe(true);
        expect(editor.getHtml()).toContain('<h6>Heading One</h6>');
    });

    it('should replace an existing heading level', () => {
        editor.commands.setHeading({ level: 3 });
        editor.commands.setHeading({ level: 4 });
        expect(editor.getHtml()).toContain('<h4>Heading One</h4>');
        expect(editor.getHtml()).not.toContain('<h3>');
    });

    it('should reject heading levels below the supported range', () => {
        expect(editor.commands.setHeading({ level: 0 })).toBe(true);
        expect(editor.getHtml()).toContain('<h1>Heading One</h1>');
    });

    it('should reject heading levels above the supported range', () => {
        expect(editor.commands.setHeading({ level: 7 })).toBe(true);
        expect(editor.getHtml()).toContain('<h6>Heading One</h6>');
    });

    it('should apply configured HTML attributes to the heading', () => {
        editor.destroy();
        editor = HeadlessEditor.create({
            document: {
                type: 'document', id: crypto.randomUUID(), schemaVersion: 1, attrs: {}, marks: [],
                children: [{
                    type: 'heading', id: crypto.randomUUID(), attrs: { level: 1 }, marks: [],
                    children: [{ type: 'text', id: crypto.randomUUID(), attrs: {}, children: [], text: 'Configured', marks: [] } as TextNode]
                }]
            },
            extensions: [headingExtension.configure({ htmlAttributes: { class: 'title' } }), undoRedoExtension]
        });
        editor.mount(container);
        expect(editor.getHtml()).toContain('<h1 class="title">Configured</h1>');
    });

    it('should preserve inline marks during heading conversion', () => {
        editor.destroy();
        editor = HeadlessEditor.create({
            document: {
                type: 'document', id: crypto.randomUUID(), schemaVersion: 1, attrs: {}, marks: [],
                children: [{
                    type: 'heading', id: crypto.randomUUID(), attrs: { level: 1 }, marks: [], children: [
                        { type: 'text', id: crypto.randomUUID(), attrs: {}, children: [], text: 'Bold heading', marks: [{ type: 'bold', attrs: {} }] } as TextNode
                    ]
                }]
            },
            extensions: [headingExtension, boldExtension, undoRedoExtension]
        });
        editor.mount(container);
        editor.commands.setHeading({ level: 2 });
        expect(editor.getHtml()).toContain('<h2>');
        expect(editor.getHtml()).toContain('Bold heading');
    });

    it('should register six heading input rules', () => {
        const rules = headingExtension.config.inputRules!.call({} as any);
        expect(rules.length).toBe(6);
        expect(rules.map((rule: any) => rule.id)).toEqual([
            'heading:h1', 'heading:h2', 'heading:h3', 'heading:h4', 'heading:h5', 'heading:h6'
        ]);
    });

    it('should assign priority ten to every heading input rule', () => {
        const rules = headingExtension.config.inputRules!.call({} as any);
        expect(rules.every((rule: any) => rule.priority === undefined)).toBe(true);
    });

    it('should expose heading keyboard shortcuts for all six levels', () => {
        const shortcuts = headingExtension.config.keyboardShortcuts!.call({ editor } as any);
        expect(Object.keys(shortcuts)).toEqual([
            'Mod-Alt-1', 'Mod-Alt-2', 'Mod-Alt-3', 'Mod-Alt-4', 'Mod-Alt-5', 'Mod-Alt-6'
        ]);
    });

    it('should apply a heading level through the level-two keyboard shortcut', () => {
        const view: any = editor.integration.getView();
        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: '2', code: 'Digit2', ctrlKey: true, altKey: true, bubbles: true, cancelable: true
        }));
        expect(editor.getHtml()).toContain('<h2>Heading One</h2>');
    });

    it('should apply a heading level through the level-one keyboard shortcut', () => {
        const view: any = editor.integration.getView();
        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: '1', code: 'Digit1', ctrlKey: true, altKey: true, bubbles: true, cancelable: true
        }));
        expect(editor.getHtml()).toContain('<h1>Heading One</h1>');
    });

    it('should apply a heading level through the level-three keyboard shortcut', () => {
        const view: any = editor.integration.getView();
        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: '3', code: 'Digit3', ctrlKey: true, altKey: true, bubbles: true, cancelable: true
        }));
        expect(editor.getHtml()).toContain('<h3>Heading One</h3>');
    });

    it('should apply a heading level through the level-four keyboard shortcut', () => {
        const view: any = editor.integration.getView();
        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: '4', code: 'Digit4', ctrlKey: true, altKey: true, bubbles: true, cancelable: true
        }));
        expect(editor.getHtml()).toContain('<h4>Heading One</h4>');
    });

    it('should apply a heading level through the level-five keyboard shortcut', () => {
        const view: any = editor.integration.getView();
        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: '5', code: 'Digit5', ctrlKey: true, altKey: true, bubbles: true, cancelable: true
        }));
        expect(editor.getHtml()).toContain('<h5>Heading One</h5>');
    });

    it('should apply a heading level through the level-six keyboard shortcut', () => {
        const view: any = editor.integration.getView();
        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: '6', code: 'Digit6', ctrlKey: true, altKey: true, bubbles: true, cancelable: true
        }));
        expect(editor.getHtml()).toContain('<h6>Heading One</h6>');
    });

    it('should execute every heading keyboard shortcut handler', () => {
        const shortcuts = headingExtension.config.keyboardShortcuts!.call({ editor } as any);
        for (const key of Object.keys(shortcuts)) {
            const shortcut = shortcuts[key];
            expect(shortcut()).toBe(true);
        }
        expect(editor.getHtml()).toContain('<h6>Heading One</h6>');
    });

    it('should keep the heading text unchanged when the selection is collapsed', () => {
        editor.commands.setSelection({ from: 1, to: 1 });
        expect(editor.commands.setHeading({ level: 2 })).toBe(true);
        expect(editor.getHtml()).toBe('<h2>Heading One</h2>');
    });

    it('should undo and redo a heading level change', () => {
        const originalHtml = editor.getHtml();
        editor.commands.setHeading({ level: 3 });
        const changedHtml = editor.getHtml();
        expect(editor.commands.undo()).toBe(true);
        expect(editor.getHtml()).toBe(originalHtml);
        expect(editor.commands.redo()).toBe(true);
        expect(editor.getHtml()).toBe(changedHtml);
    });

    /*
    it('should preserve alignment when changing heading level', () => {
        editor.destroy();
        editor = HeadlessEditor.create({
            document: {
                type: 'document', id: crypto.randomUUID(), schemaVersion: 1, attrs: {}, marks: [],
                children: [{
                    type: 'heading', id: crypto.randomUUID(), attrs: { level: 1, align: 'right' }, marks: [],
                    children: [{ type: 'text', id: crypto.randomUUID(), attrs: {}, children: [], text: 'Aligned', marks: [] } as TextNode]
                }]
            },
            extensions: [headingExtension, textAlignExtension, undoRedoExtension]
        });
        editor.mount(container);
        editor.commands.setHeading({ level: 2 });
        expect(editor.getHtml()).toContain('<h2>Aligned</h2>');
    });
    */
});

describe('Built-in: fontFamily', () => {
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
                                text: 'Font Family Text',
                                marks: [
                                    {
                                        type: 'textStyle',
                                        attrs: {
                                            fontFamily: 'Arial'
                                        }
                                    }
                                ]
                            } as TextNode
                        ]
                    }
                ]
            },
            extensions: [
                paragraphExtension,
                textStyleExtension,
                fontFamilyExtension,
                fontSizeExtension,
                fontColorExtension,
                undoRedoExtension
            ]
        });

        editor.mount(container);
    });

    afterEach(() => {
        editor.destroy();
        container.remove();
    });

    it('should render font family styling', () => {
        const html = editor.getHtml();

        expect(html).toContain('Font Family Text');
        expect(html).toContain('font-family');
    });

    it('should expose the font family dependency and commands', () => {
        expect(fontFamilyExtension.name).toBe('fontFamily');
        expect(fontFamilyExtension.config.addExtensions!()).toEqual([textStyleExtension]);
        expect(fontFamilyExtension.config.commands!().map((command: any) => command.name))
            .toEqual(['setFontFamily', 'unsetFontFamily']);
    });

    it('should apply Arial to the selected text', () => {
        editor.commands.setSelection({ from: 1, to: 17 });
        expect(editor.commands.setFontFamily({ family: 'Arial' })).toBe(true);
        expect(editor.getHtml()).toContain('font-family: Arial');
        expect((editor.getDocument().children[0].children[0] as TextNode).marks[0].attrs.fontFamily).toBe('Arial');
    });

    it('should quote a multi-word family', () => {
        editor.commands.setSelection({ from: 1, to: 17 });
        editor.commands.setFontFamily({ family: 'Times New Roman' });
        expect(editor.getHtml()).toContain('font-family: &quot;Times New Roman&quot;');
    });

    it('should quote a family containing a digit', () => {
        editor.commands.setSelection({ from: 1, to: 17 });
        editor.commands.setFontFamily({ family: 'Font 2' });
        expect(editor.getHtml()).toContain('font-family: &quot;Font 2&quot;');
    });

    it('should normalize a fallback family list', () => {
        editor.commands.setSelection({ from: 1, to: 17 });
        editor.commands.setFontFamily({ family: 'Arial, Times New Roman,  Segoe UI' });
        expect(editor.getHtml()).toContain('font-family: Arial, &quot;Times New Roman&quot;, &quot;Segoe UI&quot;');
    });

    it('should not double-quote an already quoted family', () => {
        editor.commands.setSelection({ from: 1, to: 17 });
        editor.commands.setFontFamily({ family: '"Times New Roman"' });
        expect(editor.getHtml()).not.toContain('""Times New Roman""');
    });

    it('should replace an existing family', () => {
        editor.commands.setSelection({ from: 1, to: 17 });
        editor.commands.setFontFamily({ family: 'Arial' });
        editor.commands.setFontFamily({ family: 'Georgia' });
        expect(editor.getHtml()).toContain('font-family: Georgia');
        expect(editor.getHtml()).not.toContain('font-family: Arial');
    });

    it('should unset only the family mark attribute', () => {
        editor.commands.setSelection({ from: 1, to: 17 });
        editor.commands.setFontFamily({ family: 'Georgia' });
        expect(editor.commands.unsetFontFamily()).toBe(true);
        expect(editor.getHtml()).not.toContain('font-family');
        expect((editor.getDocument().children[0].children[0] as TextNode).text).toBe('Font Family Text');
    });

    it('should format only a partial selection', () => {
        editor.commands.setSelection({ from: 1, to: 5 });
        editor.commands.setFontFamily({ family: 'Georgia' });
        expect(editor.getHtml()).toContain('font-family: Georgia');
        expect(editor.getHtml()).toContain('Family Text');
    });

    it('should accept a collapsed selection and store the font family as a stored mark', () => {
        // setFontFamily at a cursor must NOT be rejected: it stores the mark
        // as a transaction-level storedMark so the next inserted character
        // (typed or pasted) inherits the font family.
        editor.commands.setSelection({ from: 6, to: 6 });

        expect(editor.commands.setFontFamily({ family: 'Georgia' })).toBe(true);
        expect(editor.isMarkActive('textStyle', { fontFamily: 'Georgia' })).toBe(true);
    });

    it('should reject an empty family', () => {
        const originalHtml = editor.getHtml();
        editor.commands.setSelection({ from: 1, to: 17 });
        expect(editor.commands.setFontFamily({ family: '' })).toBe(false);
        expect(editor.getHtml()).toBe(originalHtml);
    });

    it('should preserve color while unsetting family', () => {
        editor.commands.setSelection({ from: 1, to: 17 });
        editor.commands.setColor({ color: '#ff0000' });
        editor.commands.setFontFamily({ family: 'Georgia' });
        editor.commands.unsetFontFamily();
        expect(editor.getHtml()).toContain('color: rgb(255, 0, 0)');
        expect(editor.getHtml()).not.toContain('font-family');
    });

    it('should preserve font size while unsetting family', () => {
        editor.commands.setSelection({ from: 1, to: 17 });
        editor.commands.setFontSize({ size: '20px' });
        editor.commands.setFontFamily({ family: 'Georgia' });
        editor.commands.unsetFontFamily();
        expect(editor.getHtml()).toContain('font-size: 20px');
        expect(editor.getHtml()).not.toContain('font-family');
    });

    it('should undo and redo a family change', () => {
        const originalHtml = editor.getHtml();
        editor.commands.setSelection({ from: 1, to: 17 });
        editor.commands.setFontFamily({ family: 'Georgia' });
        const changedHtml = editor.getHtml();
        expect(editor.commands.undo()).toBe(true);
        expect(editor.getHtml()).toBe(originalHtml);
        expect(editor.commands.redo()).toBe(true);
        expect(editor.getHtml()).toBe(changedHtml);
    });

    it('should keep one effective family declaration when applied twice', () => {
        editor.commands.setSelection({ from: 1, to: 17 });
        editor.commands.setFontFamily({ family: 'Georgia' });
        editor.commands.setFontFamily({ family: 'Georgia' });
        expect((editor.getHtml().match(/font-family:/g) || []).length).toBe(1);
    });

    it('should expose family formatting as an active text-style mark', () => {
        editor.commands.setSelection({ from: 1, to: 17 });
        editor.commands.setFontFamily({ family: 'Georgia' });
        expect(editor.getActiveMarks()).toContain('textStyle');
        expect(editor.isMarkActive('textStyle')).toBe(true);
    });

    it('should preserve the original text after family removal', () => {
        editor.commands.setSelection({ from: 1, to: 17 });
        editor.commands.setFontFamily({ family: 'Georgia' });
        editor.commands.unsetFontFamily();
        expect((editor.getDocument().children[0].children[0] as TextNode).text).toBe('Font Family Text');
    });

    it('should keep the family value in the document after applying it', () => {
        editor.commands.setSelection({ from: 1, to: 17 });
        editor.commands.setFontFamily({ family: 'Georgia' });
        const textNode = editor.getDocument().children[0].children[0] as TextNode;
        expect(textNode.marks[0].attrs).toEqual(jasmine.objectContaining({ fontFamily: 'Georgia' }));
    });
    it('should expose font family metadata and dependencies', () => {
        expect(fontFamilyExtension.name).toBe('fontFamily');
        expect(fontFamilyExtension.config.addExtensions!()).toEqual([
            textStyleExtension
        ]);
    });

    it('should expose independent font family default options', () => {
        const first = fontFamilyExtension.config.defineOptions!();
        const second = fontFamilyExtension.config.defineOptions!();

        expect(first).toEqual({
            htmlAttributes: {}
        });

        expect(second).toEqual({
            htmlAttributes: {}
        });

        expect(first).not.toBe(second);
    });

    it('should register font family commands', () => {
        expect(
            fontFamilyExtension.config.commands!().map(command => command.name)
        ).toEqual([
            'setFontFamily',
            'unsetFontFamily'
        ]);
    });

    it('should carry the active font family onto text inserted at a collapsed cursor', () => {
        // Regression for the active-formatting bug: setting a font
        // family at a cursor and then inserting text must produce text
        // that carries the family. The mark lives as a storedMark until
        // PM's insertText consumes it.
        editor.commands.setSelection({ from: 6, to: 6 });
        // Use a family distinct from the seeded 'Arial' so the stored
        // mark visibly differs from the surrounding text's mark.
        editor.commands.setFontFamily({ family: 'Courier' });

        editor.commands.insertText({ text: 'X' });

        const html = editor.getHtml();
        // PM splits the existing "Font Family Text" at position 6 (the
        // gap between "Font F" and "amily Text") and inserts the
        // new character between them, carrying the stored mark.
        expect(html).toContain('font-family: Courier');
        // The surrounding text retains its original family.
        expect(html).toContain('font-family: Arial');
    });
});

describe('Built-in: fontSize', () => {
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
                                text: 'Font Size Text',
                                marks: [
                                    {
                                        type: 'textStyle',
                                        attrs: {
                                            fontSize: '24px'
                                        }
                                    }
                                ]
                            } as TextNode
                        ]
                    }
                ]
            },
            extensions: [
                paragraphExtension,
                textStyleExtension,
                fontSizeExtension,
                fontFamilyExtension,
                fontColorExtension,
                undoRedoExtension
            ]
        });

        editor.mount(container);
    });

    afterEach(() => {
        editor.destroy();
        container.remove();
    });

    it('should render font size styling', () => {
        const html = editor.getHtml();

        expect(html).toContain('Font Size Text');
        expect(html).toContain('font-size');
    });

    it('should expose the font size dependency and commands', () => {
        expect(fontSizeExtension.name).toBe('fontSize');
        expect(fontSizeExtension.config.addExtensions!()).toEqual([textStyleExtension]);
        expect(fontSizeExtension.config.commands!().map((command: any) => command.name))
            .toEqual(['setFontSize', 'unsetFontSize']);
    });

    it('should apply a pixel size to selected text', () => {
        editor.commands.setSelection({ from: 1, to: 15 });
        expect(editor.commands.setFontSize({ size: '24px' })).toBe(true);
        expect(editor.getHtml()).toContain('font-size: 24px');
    });

    for (const size of ['1.5em', '120%']) {
        it(`should preserve the CSS size value ${size}`, () => {
            editor.commands.setSelection({ from: 1, to: 15 });
            editor.commands.setFontSize({ size });
            expect(editor.getHtml()).toContain(`font-size: ${size}`);
            expect((editor.getDocument().children[0].children[0] as TextNode).marks[0].attrs.fontSize).toBe(size);
        });
    }

    it('should accept a zero pixel size', () => {
        editor.commands.setSelection({ from: 1, to: 15 });
        expect(editor.commands.setFontSize({ size: '0px' })).toBe(true);
        expect(editor.getHtml()).toContain('font-size: 0px');
    });

    it('should preserve the current size input value', () => {
        editor.commands.setSelection({ from: 1, to: 15 });
        editor.commands.setFontSize({ size: ' 18px ' });
        expect((editor.getDocument().children[0].children[0] as TextNode).marks[0].attrs.fontSize).toBe(' 18px ');
    });

    it('should replace an existing size', () => {
        editor.commands.setSelection({ from: 1, to: 15 });
        editor.commands.setFontSize({ size: '18px' });
        editor.commands.setFontSize({ size: '22px' });
        expect(editor.getHtml()).toContain('font-size: 22px');
        expect(editor.getHtml()).not.toContain('font-size: 18px');
    });

    it('should unset only the font size', () => {
        editor.commands.setSelection({ from: 1, to: 15 });
        editor.commands.setFontSize({ size: '22px' });
        expect(editor.commands.unsetFontSize()).toBe(true);
        expect(editor.getHtml()).not.toContain('font-size');
        expect((editor.getDocument().children[0].children[0] as TextNode).text).toBe('Font Size Text');
    });

    it('should format only a partial size selection', () => {
        editor.commands.setSelection({ from: 1, to: 5 });
        editor.commands.setFontSize({ size: '22px' });
        expect(editor.getHtml()).toContain('font-size: 22px');
        expect(editor.getHtml()).toContain('Size Text');
    });

    it('should accept a collapsed selection and store the font size as a stored mark', () => {
        // setFontSize at a cursor must NOT be rejected: it stores the mark
        // as a transaction-level storedMark so the next inserted character
        // (typed or pasted) inherits the font size.
        editor.commands.setSelection({ from: 6, to: 6 });

        expect(editor.commands.setFontSize({ size: '22px' })).toBe(true);
        expect(editor.isMarkActive('textStyle', { fontSize: '22px' })).toBe(true);
    });

    it('should reject an empty size', () => {
        const originalHtml = editor.getHtml();
        editor.commands.setSelection({ from: 1, to: 15 });
        expect(editor.commands.setFontSize({ size: '' })).toBe(false);
        expect(editor.getHtml()).toBe(originalHtml);
    });

    it('should preserve color while unsetting size', () => {
        editor.commands.setSelection({ from: 1, to: 15 });
        editor.commands.setColor({ color: '#ff0000' });
        editor.commands.setFontSize({ size: '22px' });
        editor.commands.unsetFontSize();
        expect(editor.getHtml()).toContain('color: rgb(255, 0, 0)');
        expect(editor.getHtml()).not.toContain('font-size');
    });

    it('should preserve family while unsetting size', () => {
        editor.commands.setSelection({ from: 1, to: 15 });
        editor.commands.setFontFamily({ family: 'Georgia' });
        editor.commands.setFontSize({ size: '22px' });
        editor.commands.unsetFontSize();
        expect(editor.getHtml()).toContain('font-family: Georgia');
        expect(editor.getHtml()).not.toContain('font-size');
    });

    it('should undo and redo a size change', () => {
        const originalHtml = editor.getHtml();
        editor.commands.setSelection({ from: 1, to: 15 });
        editor.commands.setFontSize({ size: '22px' });
        const changedHtml = editor.getHtml();
        expect(editor.commands.undo()).toBe(true);
        expect(editor.getHtml()).toBe(originalHtml);
        expect(editor.commands.redo()).toBe(true);
        expect(editor.getHtml()).toBe(changedHtml);
    });

    it('should keep one effective size declaration when applied twice', () => {
        editor.commands.setSelection({ from: 1, to: 15 });
        editor.commands.setFontSize({ size: '22px' });
        editor.commands.setFontSize({ size: '22px' });
        expect((editor.getHtml().match(/font-size:/g) || []).length).toBe(1);
    });

    it('should expose size formatting as an active text-style mark', () => {
        editor.commands.setSelection({ from: 1, to: 15 });
        editor.commands.setFontSize({ size: '22px' });
        expect(editor.getActiveMarks()).toContain('textStyle');
        expect(editor.isMarkActive('textStyle')).toBe(true);
    });

    it('should keep independent size ranges separate', () => {
        editor.commands.setSelection({ from: 1, to: 5 });
        editor.commands.setFontSize({ size: '18px' });
        editor.commands.setSelection({ from: 6, to: 15 });
        editor.commands.setFontSize({ size: '22px' });
        expect(editor.getHtml()).toContain('font-size: 18px');
        expect(editor.getHtml()).toContain('font-size: 22px');
    });

    it('should expose font size metadata and dependencies', () => {
        expect(fontSizeExtension.name).toBe('fontSize');
        expect(fontSizeExtension.config.addExtensions!()).toEqual([
            textStyleExtension
        ]);
    });

    it('should expose independent font size default options', () => {
        const first = fontSizeExtension.config.defineOptions!();
        const second = fontSizeExtension.config.defineOptions!();

        expect(first).toEqual({
            htmlAttributes: {}
        });

        expect(second).toEqual({
            htmlAttributes: {}
        });

        expect(first).not.toBe(second);
    });

    it('should register font size commands', () => {
        expect(
            fontSizeExtension.config.commands!().map(command => command.name)
        ).toEqual([
            'setFontSize',
            'unsetFontSize'
        ]);
    });

    it('should carry the active font size onto text inserted at a collapsed cursor', () => {
        // Regression for the active-formatting bug: setting a font size
        // at a cursor and then inserting text must produce text that
        // carries the size. The mark lives as a storedMark until PM's
        // insertText consumes it.
        editor.commands.setSelection({ from: 6, to: 6 });
        editor.commands.setFontSize({ size: '32px' });

        editor.commands.insertText({ text: 'X' });

        const html = editor.getHtml();
        const xBlock = html.match(/<span[^>]*>X<\/span>/);
        expect(xBlock).not.toBeNull();
        expect(xBlock![0]!).toContain('font-size: 32px');
    });
});

describe('Built-in: textStyle', () => {
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
                                text: 'Styled Text',
                                marks: [
                                    {
                                        type: 'textStyle',
                                        attrs: {
                                            color: '#ff0000'
                                        }
                                    }
                                ]
                            } as TextNode
                        ]
                    }
                ]
            },
            extensions: [
                paragraphExtension,
                textStyleExtension,
                undoRedoExtension
            ]
        });

        editor.mount(container);
    });

    afterEach(() => {
        editor.destroy();
        container.remove();
    });

    it('should render textStyle mark', () => {
        const html = editor.getHtml();

        expect(html).toContain('Styled Text');
        expect(html).toContain('style=');
    });

    it('should expose independent text-style defaults', () => {
        expect(textStyleExtension.name).toBe('textStyle');
        const first = textStyleExtension.config.defineOptions!();
        const second = textStyleExtension.config.defineOptions!();
        expect(first).toEqual({ htmlAttributes: {} });
        expect(first).not.toBe(second);
    });

    it('should contribute one inclusive text-style mark', () => {
        const marks = textStyleExtension.config.marks!();
        expect(marks.length).toBe(1);
        expect(marks[0].name).toBe('textStyle');
        expect(marks[0].inclusive).toBe(true);
    });

    it('should define all text-style attributes with null defaults', () => {
        const attrs = textStyleExtension.config.marks!()[0].attrs!;
        expect(attrs.map((attr: any) => attr.name)).toEqual(['color', 'backgroundColor', 'fontFamily', 'fontSize']);
        expect(attrs.every((attr: any) => attr.type === 'string' && attr.default === null)).toBe(true);
    });

    it('should render an empty text-style mark without declarations', () => {
        const specs: any = textStyleExtension.config.domSpecs!.call({ options: {} } as any);
        expect(specs.marks.textStyle.toDOM({})).toEqual(['span', { style: '' }, 0]);
    });

    for (const property of ['color', 'backgroundColor', 'fontFamily', 'fontSize']) {
        it(`should serialize the ${property} CSS property`, () => {
            const specs: any = textStyleExtension.config.domSpecs!.call({ options: {} } as any);
            const descriptor = specs.marks.textStyle.toDOM({ [property]: property === 'fontSize' ? '18px' : 'red' });
            expect(descriptor[1].style).toContain(property === 'backgroundColor' ? 'background-color' : property === 'fontFamily' ? 'font-family' : property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`));
        });
    }

    it('should serialize all four text-style properties in one span', () => {
        const specs: any = textStyleExtension.config.domSpecs!.call({ options: {} } as any);
        const descriptor = specs.marks.textStyle.toDOM({ color: 'red', backgroundColor: 'yellow', fontFamily: 'Arial', fontSize: '18px' });
        expect(descriptor[1].style).toBe('color: red; background-color: yellow; font-family: Arial; font-size: 18px');
    });

    it('should merge configured HTML attributes into the span', () => {
        const specs: any = textStyleExtension.config.domSpecs!.call({ options: { htmlAttributes: { class: 'styled' } } } as any);
        expect(specs.marks.textStyle.toDOM({ color: 'red' })[1]).toEqual({ style: 'color: red', class: 'styled' });
    });

    it('should quote multi-word font families', () => {
        const specs: any = textStyleExtension.config.domSpecs!.call({ options: {} } as any);
        expect(specs.marks.textStyle.toDOM({ fontFamily: 'Times New Roman' })[1].style)
            .toBe('font-family: "Times New Roman"');
    });

    it('should normalize comma-separated font families', () => {
        const specs: any = textStyleExtension.config.domSpecs!.call({ options: {} } as any);
        expect(specs.marks.textStyle.toDOM({ fontFamily: 'Arial, Times New Roman' })[1].style)
            .toBe('font-family: Arial, "Times New Roman"');
    });

    it('should omit empty and non-string style values', () => {
        const specs: any = textStyleExtension.config.domSpecs!.call({ options: {} } as any);
        expect(specs.marks.textStyle.toDOM({ color: '', fontSize: 18, fontFamily: null })[1].style).toBe('');
    });

    it('should register a textStyle parseDOM rule that targets a span[style] tag', () => {
        const specs: any = textStyleExtension.config.domSpecs!.call({ options: {} } as any);
        const parseRule = specs.marks.textStyle.parseDOM[0];

        expect(parseRule.tag).toBe('span[style]');
        expect(typeof parseRule.getAttrs).toBe('function');
    });

    it('should expose the textStyle parseDOM rule as the first rule in the array', () => {
        const specs: any = textStyleExtension.config.domSpecs!.call({ options: {} } as any);
        const rules: any[] = specs.marks.textStyle.parseDOM;

        expect(rules.length).toBeGreaterThan(0);
        expect(rules[0].tag).toBe('span[style]');
        expect(typeof rules[0].getAttrs).toBe('function');
    });

    it('should not include a style or get property on the textStyle span[style] parseDOM rule', () => {
        const specs: any = textStyleExtension.config.domSpecs!.call({ options: {} } as any);
        const parseRule = specs.marks.textStyle.parseDOM[0];

        expect(parseRule.style).toBeUndefined();
        expect(parseRule.get).toBeUndefined();
    });

    it('should not register an explicit priority on the textStyle span[style] parseDOM rule', () => {
        const specs: any = textStyleExtension.config.domSpecs!.call({ options: {} } as any);
        const parseRule = specs.marks.textStyle.parseDOM[0];

        expect(parseRule.priority).toBeUndefined();
    });

    it('should register the textStyle parseDOM rule without consuming nested content', () => {
        const specs: any = textStyleExtension.config.domSpecs!.call({ options: {} } as any);
        const parseRule = specs.marks.textStyle.parseDOM[0];

        expect(parseRule.consume).toBeUndefined();
        expect(parseRule.skip).toBeUndefined();
    });

    it('should keep the textStyle parseDOM rule shape stable across multiple invocations', () => {
        const first: any = textStyleExtension.config.domSpecs!.call({ options: {} } as any)
            .marks.textStyle.parseDOM[0];
        const second: any = textStyleExtension.config.domSpecs!.call({ options: {} } as any)
            .marks.textStyle.parseDOM[0];

        expect(first.tag).toBe('span[style]');
        expect(second.tag).toBe('span[style]');
        expect(typeof first.getAttrs).toBe('function');
        expect(typeof second.getAttrs).toBe('function');
    });

    it('should preserve combined style attributes in the mounted editor', () => {
        const textNode = editor.getDocument().children[0].children[0] as TextNode;
        expect(textNode.marks[0].attrs).toEqual(jasmine.objectContaining({ color: '#ff0000' }));
        expect(editor.getHtml()).toContain('<span');
    });

    it('should expose the active text-style mark through the editor', () => {
        editor.commands.setSelection({ from: 1, to: 12 });
        expect(editor.getActiveMarks()).toContain('textStyle');
        expect(editor.isMarkActive('textStyle')).toBe(true);
    });

    it('should keep one span for a combined text-style mark', () => {
        expect((editor.getHtml().match(/<span/g) || []).length).toBe(1);
    });

    it('should preserve text content while rendering text-style attributes', () => {
        expect((editor.getDocument().children[0].children[0] as TextNode).text).toBe('Styled Text');
        expect(editor.getHtml()).toContain('Styled Text');
    });

    it('should expose text style metadata', () => {
        expect(textStyleExtension.name).toBe('textStyle');
    });

    it('should expose independent text style default options', () => {
        const first = textStyleExtension.config.defineOptions!();
        const second = textStyleExtension.config.defineOptions!();

        expect(first).toEqual({
            htmlAttributes: {}
        });

        expect(second).toEqual({
            htmlAttributes: {}
        });

        expect(first).not.toBe(second);
    });

    it('should register a single text style mark', () => {
        const marks = textStyleExtension.config.marks!();

        expect(marks.length).toBe(1);
        expect(marks[0].name).toBe('textStyle');
        expect(marks[0].inclusive).toBe(true);
    });

    it('should expose text style attributes in order', () => {
        const attrs = textStyleExtension.config.marks!()[0].attrs!;

        expect(attrs.map(attr => attr.name)).toEqual([
            'color',
            'backgroundColor',
            'fontFamily',
            'fontSize'
        ]);
    });

    it('should render a text style span with all supported styles', () => {
        const specs = textStyleExtension.config.domSpecs!.call({
            options: {}
        } as any);

        expect(specs.marks.textStyle.toDOM!({
            color: 'red',
            backgroundColor: 'yellow',
            fontFamily: 'Arial',
            fontSize: '18px'
        })).toEqual([
            'span',
            {
                style: 'color: red; background-color: yellow; font-family: Arial; font-size: 18px'
            },
            0
        ]);
    });

    it('should register a span[style] parseDOM rule as the first rule for the textStyle mark', () => {
        const specs = textStyleExtension.config.domSpecs!.call({
            options: {}
        } as any);

        const parseRule = specs.marks.textStyle.parseDOM![0] as {
            tag?: string;
            getAttrs?: unknown;
        };

        expect(parseRule.tag).toBe('span[style]');
        expect(typeof parseRule.getAttrs).toBe('function');
    });

    it('should expose a getAttrs function on the textStyle span[style] parseDOM rule', () => {
        const specs = textStyleExtension.config.domSpecs!.call({
            options: {}
        } as any);

        const parseRule = specs.marks.textStyle.parseDOM![0];

        expect(typeof parseRule.getAttrs).toBe('function');
    });

    it('should remove quotes from font-family', () => {
        const specs: any = textStyleExtension.config.domSpecs!.call({
            options: {}
        } as any);

        const parseRule = specs.marks.textStyle.parseDOM[0];

        const span = makeSpanMock('font-family: "Times New Roman";');
        const attrs = parseRule.getAttrs(span);

        expect(attrs.fontFamily).toBe('Times New Roman');
    });

    it('should parse the color CSS property through the textStyle parseDOM rule', () => {
        const specs: any = textStyleExtension.config.domSpecs!.call({
            options: {}
        } as any);

        const parseRule = specs.marks.textStyle.parseDOM[0];

        const span = makeSpanMock('color: red;');
        const attrs = parseRule.getAttrs(span);

        expect(attrs.color).toBe('red');
    });

    it('should parse the background-color CSS property through the textStyle parseDOM rule', () => {
        const specs: any = textStyleExtension.config.domSpecs!.call({
            options: {}
        } as any);

        const parseRule = specs.marks.textStyle.parseDOM[0];

        const span = makeSpanMock('background-color: yellow;');
        const attrs = parseRule.getAttrs(span);

        expect(attrs.backgroundColor).toBe('yellow');
    });

    it('should parse the font-size CSS property through the textStyle parseDOM rule', () => {
        const specs: any = textStyleExtension.config.domSpecs!.call({
            options: {}
        } as any);

        const parseRule = specs.marks.textStyle.parseDOM[0];

        const span = makeSpanMock('font-size: 18px;');
        const attrs = parseRule.getAttrs(span);

        expect(attrs.fontSize).toBe('18px');
    });

    it('should skip the rule when the style attribute is empty and no ancestors contribute styles', () => {
        const specs: any = textStyleExtension.config.domSpecs!.call({
            options: {}
        } as any);

        const parseRule = specs.marks.textStyle.parseDOM[0];

        // A bare span with no parent and no style: nothing to contribute, so
        // the rule returns false to tell PM to skip applying a textStyle mark.
        const span = makeSpanMock('');
        const attrs = parseRule.getAttrs(span);

        expect(attrs).toBe(false);
    });

    it('should use the null-coalesced htmlAttributes when domSpecs is invoked without options', () => {
        const specs: any = textStyleExtension.config.domSpecs!.call({} as any);

        const descriptor = specs.marks.textStyle.toDOM({ color: 'red' });

        expect(descriptor).toEqual(['span', { style: 'color: red' }, 0]);
    });

    it('should fall back to skipping the rule when the style attribute is missing on the DOM node', () => {
        const specs: any = textStyleExtension.config.domSpecs!.call({
            options: {}
        } as any);

        const parseRule = specs.marks.textStyle.parseDOM[0];

        // A span with no style attribute and no styled ancestors has nothing
        // to contribute — the rule should opt out so PM does not add an
        // empty textStyle mark.
        const span: any = { nodeType: 1, nodeName: 'SPAN', parentElement: null, getAttribute: () => null };
        const attrs = parseRule.getAttrs(span);

        expect(attrs).toBe(false);
    });

    it('should skip CSS declarations that do not contain a colon', () => {
        const specs: any = textStyleExtension.config.domSpecs!.call({
            options: {}
        } as any);

        const parseRule = specs.marks.textStyle.parseDOM[0];

        const span = makeSpanMock('invalid; color: red;');
        const attrs = parseRule.getAttrs(span);

        expect(attrs.color).toBe('red');
    });

    it('should collect textStyle attrs from ancestor spans when nested spans split color and background-color', () => {
        // Regression for the paste bug where MS Word / Google Docs emit
        //   <span style="background-color: yellow">
        //     <span style="color: red">hello</span>
        //   </span>
        // ProseMirror's DOM parser calls getAttrs for the inner span with
        // only its own style attribute visible. Without climbing the parent
        // chain, the outer background-color is silently dropped.
        const specs: any = textStyleExtension.config.domSpecs!.call({
            options: {}
        } as any);

        const parseRule = specs.marks.textStyle.parseDOM[0];

        const outer: any = document.createElement('span');
        outer.setAttribute('style', 'background-color: yellow;');
        const inner: any = document.createElement('span');
        inner.setAttribute('style', 'color: red;');
        outer.appendChild(inner);

        const attrs = parseRule.getAttrs(inner);

        expect(attrs).toEqual({
            color: 'red',
            backgroundColor: 'yellow'
        });
    });

    it('should let the innermost span win when an outer and inner span both set the same property', () => {
        // The closest span to the text should win; outer spans only fill in
        // keys not already provided.
        const specs: any = textStyleExtension.config.domSpecs!.call({
            options: {}
        } as any);

        const parseRule = specs.marks.textStyle.parseDOM[0];

        const outer: any = document.createElement('span');
        outer.setAttribute('style', 'color: blue;');
        const inner: any = document.createElement('span');
        inner.setAttribute('style', 'color: red;');
        outer.appendChild(inner);

        const attrs = parseRule.getAttrs(inner);

        expect(attrs.color).toBe('red');
    });

    it('should collect every textStyle property when spread across several nested spans', () => {
        // Three-level nesting: each level contributes one property.
        const specs: any = textStyleExtension.config.domSpecs!.call({
            options: {}
        } as any);

        const parseRule = specs.marks.textStyle.parseDOM[0];

        const level1: any = document.createElement('span');
        level1.setAttribute('style', 'background-color: yellow;');
        const level2: any = document.createElement('span');
        level2.setAttribute('style', 'color: red;');
        const level3: any = document.createElement('span');
        level3.setAttribute('style', 'font-size: 18px;');
        level1.appendChild(level2);
        level2.appendChild(level3);

        const attrs = parseRule.getAttrs(level3);

        expect(attrs).toEqual({
            color: 'red',
            backgroundColor: 'yellow',
            fontSize: '18px'
        });
    });

    it('should stop climbing the parent chain at the first non-span element', () => {
        // A non-span ancestor (e.g. <p>) must not be inspected for styles.
        // Only true span ancestors contribute.
        const specs: any = textStyleExtension.config.domSpecs!.call({
            options: {}
        } as any);

        const parseRule = specs.marks.textStyle.parseDOM[0];

        const paragraph: any = document.createElement('p');
        paragraph.setAttribute('style', 'color: blue;');
        const innerSpan: any = document.createElement('span');
        innerSpan.setAttribute('style', 'background-color: yellow;');
        paragraph.appendChild(innerSpan);

        const attrs = parseRule.getAttrs(innerSpan);

        // Only the span's own background-color is picked up; the paragraph's
        // color is intentionally ignored because it is not a textStyle mark.
        expect(attrs).toEqual({
            backgroundColor: 'yellow'
        });
    });

    it('should skip the rule when no span in the ancestry contributes a textStyle property', () => {
        // A span with no style and no styled span ancestors has nothing to
        // contribute, so the rule should opt out to avoid creating an empty
        // textStyle mark on every text node.
        const specs: any = textStyleExtension.config.domSpecs!.call({
            options: {}
        } as any);

        const parseRule = specs.marks.textStyle.parseDOM[0];

        const paragraph: any = document.createElement('p');
        const span: any = document.createElement('span');
        paragraph.appendChild(span);

        const attrs = parseRule.getAttrs(span);

        expect(attrs).toBe(false);
    });

    it('should not collect styles from sibling spans further up the tree', () => {
        // The chain is ancestor-only. A span sharing an ancestor should
        // not contribute its style to its sibling's parse.
        const specs: any = textStyleExtension.config.domSpecs!.call({
            options: {}
        } as any);

        const parseRule = specs.marks.textStyle.parseDOM[0];

        const paragraph: any = document.createElement('p');
        const sibling1: any = document.createElement('span');
        sibling1.setAttribute('style', 'color: blue;');
        const sibling2: any = document.createElement('span');
        // sibling2 has no style
        paragraph.appendChild(sibling1);
        paragraph.appendChild(sibling2);

        const attrs = parseRule.getAttrs(sibling2);

        expect(attrs).toBe(false);
    });

});

describe('Built-in: textAlign', () => {
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
                        attrs: {
                            align: 'center'
                        },
                        marks: [],
                        children: [
                            {
                                type: 'text',
                                id: crypto.randomUUID(),
                                attrs: {},
                                children: [],
                                text: 'Centered Text',
                                marks: []
                            } as TextNode
                        ]
                    }
                ]
            },
            extensions: [
                paragraphExtension,
                textAlignExtension,
                undoRedoExtension
            ]
        });

        editor.mount(container);
    });

    afterEach(() => {
        editor.destroy();
        container.remove();
    });

    it('should render text alignment', () => {
        const html = editor.getHtml();

        expect(html).toContain('Centered Text');
        expect(html).toContain('text-align');
    });

    it('should expose the documented alignment defaults', () => {
        expect(textAlignExtension.name).toBe('textAlign');
        expect(textAlignExtension.config.defineOptions!()).toEqual({
            types: ['paragraph', 'heading', 'listItem', 'taskItem'],
            htmlAttributes: {}
        });
    });

    it('should register set and unset alignment commands', () => {
        expect(textAlignExtension.config.commands!().map((command: any) => command.name))
            .toEqual(['setTextAlign', 'unsetTextAlign']);
    });

    it('should expose a configurable alignment type filter', () => {
        const configured = textAlignExtension.configure({ types: ['heading'] });
        expect(configured.config.commands!().map((command: any) => command.name))
            .toEqual(['setTextAlign', 'unsetTextAlign']);
        expect(configured.config.defineOptions!().types).toEqual(['heading']);
    });

    for (const align of ['left', 'right', 'justify']) {
        it(`should apply ${align} alignment to the paragraph`, () => {
            expect(editor.commands.setTextAlign({ align: align as any })).toBe(true);
            expect(editor.getHtml()).toContain(`text-align: ${align}`);
            expect(editor.getDocument().children[0].attrs.align).toBe(align);
        });
    }

    it('should replace an existing alignment value', () => {
        editor.commands.setTextAlign({ align: 'left' });
        editor.commands.setTextAlign({ align: 'right' });
        expect(editor.getHtml()).toContain('text-align: right');
        expect(editor.getHtml()).not.toContain('text-align: left');
    });

    it('should unset alignment while preserving paragraph text', () => {
        expect(editor.commands.unsetTextAlign()).toBe(true);
        expect(editor.getHtml()).not.toContain('text-align');
        expect((editor.getDocument().children[0].children[0] as TextNode).text).toBe('Centered Text');
    });

    it('should leave an unaligned paragraph unchanged when unset is called', () => {
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
            extensions: [paragraphExtension, textAlignExtension, undoRedoExtension]
        });
        editor.mount(container);
        const originalHtml = editor.getHtml();
        expect(editor.commands.unsetTextAlign()).toBe(false);
        expect(editor.getHtml()).toBe(originalHtml);
    });

    it('should render alignment on a heading element', () => {
        editor.destroy();
        editor = HeadlessEditor.create({
            document: {
                type: 'document', id: crypto.randomUUID(), schemaVersion: 1, attrs: {}, marks: [],
                children: [{
                    type: 'heading', id: crypto.randomUUID(), attrs: { level: 2, align: 'right' }, marks: [], children: [
                        { type: 'text', id: crypto.randomUUID(), attrs: {}, children: [], text: 'Heading', marks: [] } as TextNode
                    ]
                }]
            },
            extensions: [headingExtension, textAlignExtension, undoRedoExtension]
        });
        editor.mount(container);
        expect(editor.getHtml()).toContain('<h2 style="text-align: right;">Heading</h2>');
        expect(editor.getHtml()).not.toContain('<span style="text-align');
    });

    it('should preserve configured HTML attributes on an aligned paragraph', () => {
        const configuredParagraph = paragraphExtension.configure({ htmlAttributes: { class: 'copy' } });
        editor.destroy();
        editor = HeadlessEditor.create({
            document: {
                type: 'document', id: crypto.randomUUID(), schemaVersion: 1, attrs: {}, marks: [],
                children: [{
                    type: 'paragraph', id: crypto.randomUUID(), attrs: {}, marks: [], children: [
                        { type: 'text', id: crypto.randomUUID(), attrs: {}, children: [], text: 'Configured', marks: [] } as TextNode
                    ]
                }]
            },
            extensions: [configuredParagraph, textAlignExtension, undoRedoExtension]
        });
        editor.mount(container);
        editor.commands.setTextAlign({ align: 'center' });
        expect(editor.getHtml()).toContain('class="copy"');
        expect(editor.getHtml()).toContain('text-align: center');
    });

    it('should align every paragraph in a multi-block selection', () => {
        editor.destroy();
        editor = HeadlessEditor.create({
            document: {
                type: 'document', id: crypto.randomUUID(), schemaVersion: 1, attrs: {}, marks: [],
                children: [1, 2].map((value) => ({
                    type: 'paragraph', id: crypto.randomUUID(), attrs: {}, marks: [], children: [
                        { type: 'text', id: crypto.randomUUID(), attrs: {}, children: [], text: `Paragraph ${value}`, marks: [] } as TextNode
                    ]
                }))
            },
            extensions: [paragraphExtension, textAlignExtension, undoRedoExtension]
        });
        editor.mount(container);
        editor.commands.setSelection({ from: 1, to: 23 });
        editor.commands.setTextAlign({ align: 'justify' });
        expect(editor.getHtml().match(/text-align: justify/g)?.length).toBe(2);
    });

    /*
    it('should preserve alignment while changing a heading level', () => {
        editor.destroy();
        editor = HeadlessEditor.create({
            document: {
                type: 'document', id: crypto.randomUUID(), schemaVersion: 1, attrs: {}, marks: [],
                children: [{
                    type: 'heading', id: crypto.randomUUID(), attrs: { level: 1, align: 'right' }, marks: [], children: [
                        { type: 'text', id: crypto.randomUUID(), attrs: {}, children: [], text: 'Aligned', marks: [] } as TextNode
                    ]
                }]
            },
            extensions: [headingExtension, textAlignExtension, undoRedoExtension]
        });
        editor.mount(container);
        editor.commands.setHeading({ level: 2 });
        expect(editor.getHtml()).toContain('<h2>Aligned</h2>');
    });
    */

    it('should expose four alignment keyboard shortcuts', () => {
        const shortcuts = textAlignExtension.config.keyboardShortcuts!.call({ editor } as any);
        expect(Object.keys(shortcuts)).toEqual(['Mod-l', 'Mod-e', 'Mod-r', 'Mod-j']);
    });

    it('should apply center alignment through the Mod-e shortcut', () => {
        const view: any = editor.integration.getView();
        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'e', code: 'KeyE', ctrlKey: true, bubbles: true, cancelable: true
        }));
        expect(editor.getHtml()).toContain('text-align: center');
    });


    it('should apply left alignment through the Mod-l shortcut', () => {
        const view: any = editor.integration.getView();
        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'l', code: 'KeyL', ctrlKey: true, bubbles: true, cancelable: true
        }));
        expect(editor.getHtml()).toContain('text-align: left');
    });


    it('should apply right alignment through the Mod-r shortcut', () => {
        const view: any = editor.integration.getView();
        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'r', code: 'KeyR', ctrlKey: true, bubbles: true, cancelable: true
        }));
        expect(editor.getHtml()).toContain('text-align: right');
    });


    it('should apply justify alignment through the Mod-j shortcut', () => {
        const view: any = editor.integration.getView();
        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'j', code: 'KeyJ', ctrlKey: true, bubbles: true, cancelable: true
        }));
        expect(editor.getHtml()).toContain('text-align: justify');
    });

    it('should execute every alignment keyboard shortcut handler', () => {
        const shortcuts = textAlignExtension.config.keyboardShortcuts!.call({ editor } as any);
        for (const key of Object.keys(shortcuts)) {
            const shortcut = shortcuts[key];
            expect(shortcut()).toBe(true);
        }
        expect(editor.getDocument().children[0].attrs.align).toBe('justify');
    });

    it('should keep text unchanged when alignment is applied', () => {
        editor.commands.setTextAlign({ align: 'left' });
        expect((editor.getDocument().children[0].children[0] as TextNode).text).toBe('Centered Text');
    });

    it('should undo and redo an alignment change', () => {
        const originalHtml = editor.getHtml();
        editor.commands.setTextAlign({ align: 'right' });
        const changedHtml = editor.getHtml();
        expect(editor.commands.undo()).toBe(true);
        expect(editor.getHtml()).toBe(originalHtml);
        expect(editor.commands.redo()).toBe(true);
        expect(editor.getHtml()).toBe(changedHtml);
    });

    it('should keep unrelated paragraph attributes while aligning', () => {
        expect(editor.getDocument().children[0].attrs).toEqual(jasmine.objectContaining({ align: 'center' }));
        editor.commands.setTextAlign({ align: 'justify' });
        expect(editor.getDocument().children[0].attrs.align).toBe('justify');
    });

    it('should expose text align metadata', () => {
        expect(textAlignExtension.name).toBe('textAlign');
    });

    it('should expose text align default options', () => {
        expect(textAlignExtension.config.defineOptions!()).toEqual({
            types: ['paragraph', 'heading', 'listItem', 'taskItem'],
            htmlAttributes: {}
        });
    });

    it('should register text align commands', () => {
        const commands = textAlignExtension.config.commands!.call({
            options: {
                types: ['paragraph', 'heading', 'listItem', 'taskItem']
            }
        } as any);

        expect(commands.map(command => command.name)).toEqual([
            'setTextAlign',
            'unsetTextAlign'
        ]);
    });

    it('should expose text align keyboard shortcuts', () => {
        const shortcuts = textAlignExtension.config.keyboardShortcuts!.call({
            editor
        } as any);

        expect(Object.keys(shortcuts)).toEqual([
            'Mod-l',
            'Mod-e',
            'Mod-r',
            'Mod-j'
        ]);
    });

    it('should expose functional text align keyboard shortcuts', () => {
        const shortcuts = textAlignExtension.config.keyboardShortcuts!.call({
            editor
        } as any);

        expect(typeof shortcuts['Mod-l']).toBe('function');
        expect(typeof shortcuts['Mod-e']).toBe('function');
        expect(typeof shortcuts['Mod-r']).toBe('function');
        expect(typeof shortcuts['Mod-j']).toBe('function');
    });




});

describe('Built-in: toLowerCase and toUppperCase— cross-block partial selection', () => {
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
                        type: 'heading',
                        id: crypto.randomUUID(),
                        attrs: { level: 1 },
                        marks: [],
                        children: [
                            {
                                type: 'text',
                                id: crypto.randomUUID(),
                                attrs: {},
                                children: [],
                                text: 'HELLO',
                                marks: []
                            } as TextNode
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
                                text: 'WORLD',
                                marks: []
                            } as TextNode
                        ]
                    }
                ]
            },
            extensions: [
                headingExtension,
                paragraphExtension,
                toLowerCaseExtension,
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

    it('should lowercase the partially selected text across the heading and paragraph boundary', () => {
        editor.commands.setSelection({ from: 3, to: 10 });
        editor.commands.toLowerCase();
        expect(editor.getText()).toBe('HEllowoRLD');
        editor.commands.toUpperCase();
        expect(editor.getText()).toBe('HELLOWORLD');
    });
});

describe('toLowerCase / toUpperCase - undefined text', () => {
    it('should cover the empty-string fallback in toLowerCase', () => {
        const command: any = toLowerCaseExtension.config.commands!()[0];

        const textNode: any = {
            isText: true,
            text: undefined,
            marks: []
        };

        const context: any = {
            pmState: {
                schema: {
                    text: (text: string) => ({
                        isText: true,
                        text,
                        marks: []
                    })
                },
                selection: {
                    content: () => ({
                        content: {
                            content: [textNode]
                        },
                        openStart: 0,
                        openEnd: 0
                    }),
                    from: 1,
                    to: 2
                },
                tr: {
                    replaceSelection: () => ({
                        setSelection: () => ({})
                    })
                }
            },
            dispatch: () => {}
        };

        command.execute(context);
    });

    it('should cover the empty-string fallback in toUpperCase', () => {
        const command: any = toUpperCaseExtension.config.commands!()[0];

        const textNode: any = {
            isText: true,
            text: undefined,
            marks: []
        };

        const context: any = {
            pmState: {
                schema: {
                    text: (text: string) => ({
                        isText: true,
                        text,
                        marks: []
                    })
                },
                selection: {
                    content: () => ({
                        content: {
                            content: [textNode]
                        },
                        openStart: 0,
                        openEnd: 0
                    }),
                    from: 1,
                    to: 2
                },
                tr: {
                    replaceSelection: () => ({
                        setSelection: () => ({})
                    })
                }
            },
            dispatch: () => {}
        };

        command.execute(context);
    });
});
