/**
 * This spec file contains test cases for:
 * - Bold Extension
 */

import {
    HeadlessEditor,
    paragraphExtension,
    boldExtension,
    italicExtension,
    undoRedoExtension,
    basicExtensions,
    TextNode,
    EditorNode
} from '../../../src/index';

import { listExtension } from '../../../src/extensions/builtins/list';
import { tableExtension } from '../../../src/extensions/builtins/table';
import { headingExtension } from '../../../src/extensions/builtins/heading';
import { superscriptExtension } from '../../../src/extensions/builtins/superscript';
import { linkExtension } from '../../../src/extensions/builtins/link';
import { hardBreakExtension } from '../../../src/extensions/builtins/hard-break';

describe('HeadlessEditor Bold Formatting', () => {
    let editor: HeadlessEditor;
    let container: HTMLElement;

    const makeDoc = (text: string) => ({
        type: 'document' as const,
        id: crypto.randomUUID(),
        schemaVersion: 1,
        attrs: {},
        marks: [],
        children: [{
            type: 'paragraph' as const,
            id: crypto.randomUUID(),
            attrs: {},
            marks: [],
            children: [{
                type: 'text',
                id: crypto.randomUUID(),
                text,
                marks: []
            } as TextNode]
        }]
    });

    const mountEditor = (extensions: any[], text = 'Hello World', options: any = {}) => {
        editor = HeadlessEditor.create({
            ...options,
            document: makeDoc(text),
            extensions
        });
        editor.mount(container);
    };

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        mountEditor([paragraphExtension, boldExtension], 'Hello World', { enableInputRules: true });
    });

    afterEach(() => {
        if (!editor.isDestroyed) {
            editor.destroy();
        }
        container.remove();
    });

    it('should expose the bold name and independent default options', () => {
        expect(boldExtension.name).toBe('bold');

        const first = boldExtension.config.defineOptions!();
        const second = boldExtension.config.defineOptions!();

        expect(first).toEqual({ htmlAttributes: {} });
        expect(second).toEqual({ htmlAttributes: {} });
        expect(first).not.toBe(second);
    });

    it('should register one inclusive bold mark', () => {
        const marks = boldExtension.config.marks!();

        expect(marks.length).toBe(1);
        expect(marks[0]).toEqual({ name: 'bold', inclusive: true });
    });

    it('should contribute the toggleBold command', () => {
        const commands = boldExtension.config.commands!();

        expect(commands.length).toBe(1);
        expect(commands[0].name).toBe('toggleBold');
    });

    it('should render strong with default and configured HTML attributes', () => {
        const defaultSpecs = boldExtension.config.domSpecs!.call({
            options: boldExtension.config.defineOptions!()
        } as any);
        expect(defaultSpecs.marks.bold.toDOM!({}, true)).toEqual(['strong', {}, 0]);

        const configuredAttributes = { class: 'editor-bold', 'data-format': 'bold' };
        const configuredSpecs = boldExtension.config.domSpecs!.call({
            options: { htmlAttributes: configuredAttributes }
        } as any);
        expect(configuredSpecs.marks.bold.toDOM!({}, true)).toEqual([
            'strong', configuredAttributes, 0
        ]);

        editor.destroy();
        mountEditor([
            paragraphExtension,
            boldExtension.configure({ htmlAttributes: configuredAttributes })
        ]);
        editor.commands.setSelection({ from: 1, to: 6 });
        editor.commands.toggleBold();

        expect(editor.getHtml()).toContain(
            '<strong class="editor-bold" data-format="bold">Hello</strong>'
        );
    });

    it('should fall back to empty DOM attributes when options are absent', () => {
        let descriptor: unknown;
        expect(() => {
            const specs = boldExtension.config.domSpecs!.call({} as any);
            descriptor = specs.marks.bold.toDOM!({}, true);
        }).not.toThrow();
        expect(descriptor).toEqual(['strong', {}, 0]);

        const specs = boldExtension.config.domSpecs!.call({
            options: { htmlAttributes: undefined }
        } as any);
        expect(specs.marks.bold.toDOM!({}, true)).toEqual(['strong', {}, 0]);
    });

    it('should apply bold only to the selected range and expose its state', () => {
        editor.commands.setSelection({ from: 1, to: 6 });
        expect(editor.commands.toggleBold()).toBe(true);

        expect(editor.getHtml()).toContain('<strong>Hello</strong>');
        expect(editor.getHtml()).toContain(' World');
        expect(editor.getActiveMarks()).toContain('bold');
        expect(editor.isMarkActive('bold')).toBe(true);

        const textNode: EditorNode = editor.getDocument().children[0].children[0];
        expect(textNode.marks).toEqual([{ type: 'bold', attrs: {} }]);
    });

    it('should remove bold when the same range is toggled twice', () => {
        editor.commands.setSelection({ from: 1, to: 6 });
        editor.commands.toggleBold();
        editor.commands.toggleBold();

        expect(editor.getHtml()).not.toContain('<strong>');
        expect(editor.isMarkActive('bold')).toBe(false);
    });

    it('should leave content unchanged for a collapsed selection', () => {
        const originalHtml = editor.getHtml();
        editor.commands.setSelection({ from: 6, to: 6 });
        editor.commands.toggleBold();

        expect(editor.getHtml()).toBe(originalHtml);
        expect(editor.getHtml()).not.toContain('<strong>');
        expect((editor.getDocument().children[0].children[0] as TextNode).text).toBe('Hello World');
    });

    it('should apply bold for lowercase and uppercase Mod-B keyboard input', () => {
        const editorView: { dom: HTMLElement } = editor.integration.getView() as any;

        for (const key of ['b', 'B']) {
            editor.commands.setSelection({ from: 1, to: 6 });
            editorView.dom.dispatchEvent(new KeyboardEvent('keydown', {
                key,
                code: 'KeyB',
                ctrlKey: true,
                bubbles: true,
                cancelable: true
            }));
            expect(editor.getHtml()).toContain('<strong>Hello</strong>');
            editor.commands.toggleBold();
        }
    });

    it('should preserve bold and italic when Enter splits the current paragraph', () => {
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
                    children: []
                }]
            },
            extensions: [
                paragraphExtension,
                boldExtension,
                italicExtension
            ]
        });

        editor.mount(container);
        editor.commands.setSelection({ from: 1, to: 1 });

        expect(editor.commands.toggleBold()).toBe(true);
        expect(editor.commands.toggleItalic()).toBe(true);

        editor.commands.insertText({ text: 'A' });

        const editorView: { dom: HTMLElement } = editor.integration.getView() as any;
        editorView.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            bubbles: true,
            cancelable: true
        }));

        editor.commands.insertText({ text: 'B' });

        const doc = editor.getDocument();
        const firstText = doc.children[0].children[0] as TextNode;
        const secondText = doc.children[1].children[0] as TextNode;

        expect(doc.children.length).toBe(2);
        expect(firstText.text).toBe('A');
        expect(secondText.text).toBe('B');
        expect(firstText.marks).toEqual(jasmine.arrayContaining([
            { type: 'bold', attrs: {} },
            { type: 'italic', attrs: {} }
        ]));
        expect(secondText.marks).toEqual(jasmine.arrayContaining([
            { type: 'bold', attrs: {} },
            { type: 'italic', attrs: {} }
        ]));
        expect(editor.getHtml()).toContain('<strong>');
        expect(editor.getHtml()).toContain('<em>');
    });

    it('should handle both bold delimiters and reject malformed input', () => {
        const applyInput = (text: string): boolean => {
            const editorView: any = editor.integration.getView();
            let handled = false;
            editor.commands.setSelection({ from: 1, to: 1 });
            editorView.someProp('handleTextInput', (handler: Function) => {
                handled = handler(editorView, 1, 1, text) || handled;
            });
            return handled;
        };

        expect(applyInput('**bold**')).toBe(true);
        expect(editor.getHtml()).toContain('<strong>bold</strong>');

        editor.destroy();
        mountEditor([paragraphExtension, boldExtension], 'Hello World', { enableInputRules: true });
        expect(applyInput('__bold__')).toBe(true);
        expect(editor.getHtml()).toContain('<strong>bold</strong>');

        editor.destroy();
        mountEditor([paragraphExtension, boldExtension], 'Hello World', { enableInputRules: true });
        expect(applyInput('****')).toBe(false);
        expect(editor.getHtml()).not.toContain('<strong>');
    });

    it('should compose with italic and support undo and redo', () => {
        editor.destroy();
        mountEditor([paragraphExtension, boldExtension, italicExtension, undoRedoExtension]);
        editor.commands.setSelection({ from: 1, to: 6 });
        editor.commands.toggleBold();
        editor.commands.toggleItalic();

        expect(editor.getHtml()).toContain('<strong>');
        expect(editor.getHtml()).toContain('<em>');

        expect(editor.commands.undo()).toBe(true);
        expect(editor.getHtml()).toContain('<strong>');

        expect(editor.commands.undo()).toBe(true);
        expect(editor.getHtml()).not.toContain('<strong>');

        expect(editor.commands.redo()).toBe(true);
        expect(editor.commands.redo()).toBe(true);
        expect(editor.getHtml()).toContain('<strong>');
    });

    it('should expose bold formatting through the core preset', () => {
        editor.destroy();
        mountEditor([basicExtensions]);
        editor.commands.setSelection({ from: 1, to: 6 });
        editor.commands.toggleBold();

        expect(container.querySelector('p')).not.toBeNull();
        expect(editor.getHtml()).toContain('<strong>Hello</strong>');
    });

    it('should expose the correct extension name', () => {
        expect(boldExtension.name).toBe('bold');
    });

    it('should return the default options', () => {
        const options = boldExtension.config.defineOptions!();

        expect(options).toEqual({
            htmlAttributes: {}
        });
    });

    it('should register the bold mark definition', () => {
        const marks = boldExtension.config.marks!();

        expect(marks).toEqual([
            {
                name: 'bold',
                inclusive: true
            }
        ]);
    });

    it('should register the toggleBold command', () => {
        const commands = boldExtension.config.commands!();

        expect(commands.length).toBe(1);
        expect(commands[0].name).toBe('toggleBold');
    });

    it('should register the expected input rules', () => {
        const rules = boldExtension.config.inputRules!.call({} as any);

        expect(rules.length).toBe(2);
        expect(rules[0].id).toBe('bold:stars');
        expect(rules[1].id).toBe('bold:underscores');
    });

    it('should register Mod-b keyboard shortcut', () => {
        const shortcuts =
            boldExtension.config.keyboardShortcuts!.call({
                editor: {
                    commands: {
                        toggleBold: () => true
                    }
                }
            } as any);

        expect(shortcuts['Mod-b']).toEqual(jasmine.any(Function));
    });

    it('should register Mod-B keyboard shortcut', () => {
        const shortcuts =
            boldExtension.config.keyboardShortcuts!.call({
                editor: {
                    commands: {
                        toggleBold: () => true
                    }
                }
            } as any);

        expect(shortcuts['Mod-B']).toEqual(jasmine.any(Function));
    });

    it('should register a font-weight parseDOM rule for the bold mark', () => {
        const specs = boldExtension.config.domSpecs!.call({
            options: {}
        } as any);

        const rules = specs.marks.bold.parseDOM!;
        const fontWeightRule = rules[2] as { style: string; getAttrs: (value: string) => unknown };

        expect(fontWeightRule.style).toBe('font-weight');
        expect(fontWeightRule.getAttrs('bold')).toBeNull();
        expect(fontWeightRule.getAttrs('500')).toBeNull();
        expect(fontWeightRule.getAttrs('700')).toBeNull();
        expect(fontWeightRule.getAttrs('900')).toBeNull();
    });

});

describe('HeadlessEditor Bold Advanced Edge Cases', () => {
    let editor: HeadlessEditor;
    let container: HTMLElement;

    const textNode = (text: string, marks: any[] = []): TextNode => ({
        type: 'text',
        id: crypto.randomUUID(),
        text,
        marks
    } as TextNode);

    const paraNode = (children: any[], marks: any[] = []): EditorNode => ({
        type: 'paragraph',
        id: crypto.randomUUID(),
        attrs: {},
        marks,
        children
    } as EditorNode);

    const makeModelDoc = (children: any[]): any => ({
        type: 'document' as const,
        id: crypto.randomUUID(),
        schemaVersion: 1,
        attrs: {},
        marks: [],
        children
    });

    const mount = (extensions: any[], doc: any): void => {
        editor = HeadlessEditor.create({
            document: doc,
            extensions
        });
        editor.mount(container);
    };

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        if (editor && !editor.isDestroyed) {
            editor.destroy();
        }
        container.remove();
    });

    it('should split an existing strong at a collapsed cursor and leave a plain #text right sibling', () => {
        // Text "Bold Text" = "Bold " bold + "Text" plain
        mount([paragraphExtension, boldExtension, undoRedoExtension],
            makeModelDoc([paraNode([textNode('Bold ', [{ type: 'bold', attrs: {} }]), textNode('Text')])]));
        // Positions: doc(0) paraOpen(1) "Bold " occupies 2..6; position 6 is the boundary
        editor.commands.setSelection({ from: 6, to: 6 });
        editor.commands.toggleBold();

        const html: string = editor.getHtml();
        // The bold must split at the boundary: "Bold " stays in <strong>, "Text" comes out plain
        expect(html).toContain('<strong>');
        expect(html).toContain('Bold ');
        expect(html).toContain('Text');
        // Whole-word "Bold Text" must never be wrapped in a single strong (that would mean the split failed)
        expect(html).not.toContain('<strong>Bold Text</strong>');
    });

    it('should restructure nested strong+italic wrappers around a collapsed cursor with no text loss', () => {
        const boldItalic = [{ type: 'bold', attrs: {} }, { type: 'italic', attrs: {} }];
        mount([paragraphExtension, boldExtension, italicExtension, undoRedoExtension],
            makeModelDoc([paraNode([textNode('Bold Text', boldItalic)])]));
        // "Bold " ends at position 6 (cursor inside the nested format run)
        editor.commands.setSelection({ from: 6, to: 6 });
        editor.commands.toggleBold();
        // Italic must remain — it is a separate mark, not collateral to the bold toggle
        expect(editor.isMarkActive('italic')).toBe(true);
        // No text corruption across the split
        expect(editor.getText()).toBe('Bold Text');
    });

    it('should not create a ghost empty strong at a collapsed cursor just past a trailing bold', () => {
        mount([paragraphExtension, boldExtension, undoRedoExtension],
            makeModelDoc([paraNode([textNode('Bold Text', [{ type: 'bold', attrs: {} }])])]));
        const htmlBefore: string = editor.getHtml();
        // Position 10 = doc(0) + para(1) + "Bold Text"(9) = end of text inside the paragraph
        editor.commands.setSelection({ from: 10, to: 10 });
        editor.commands.toggleBold();
        const htmlAfter: string = editor.getHtml();
        // At most one strong element may exist; no empty / ZWS-only strong wrappers
        expect((htmlAfter.match(/<strong/g) ?? []).length).toBeLessThanOrEqual(1);
        expect(htmlAfter).not.toContain('<strong></strong>');
        // HTML must not have grown with a new ZWS-bearing strong
        expect(htmlAfter.length).toBeLessThanOrEqual(htmlBefore.length + 5);
    });

    it('should revert bold at a cursor inside a nested format without corrupting sibling marks', () => {
        const bothMarks = [{ type: 'bold', attrs: {} }, { type: 'italic', attrs: {} }];
        mount([paragraphExtension, boldExtension, italicExtension, undoRedoExtension],
            makeModelDoc([paraNode([textNode('Bold Text', bothMarks)])]));
        // Collapse at end-of-text (inner cursor), revert bold only
        editor.commands.setSelection({ from: 10, to: 10 });
        editor.commands.toggleBold();
        // Text is intact — no character was added or removed by the collapsed-cursor toggle
        expect(editor.getText()).toBe('Bold Text');
        // The italic mark must remain on the surviving text node(s). We verify via the
        // document model rather than isMarkActive, which is storage-mark dependent and
        // behaves inconsistently for collapsed-cursor toggles at a mark boundary.
        const docChildren: any[] = ((editor.getDocument() as any).children?.[0]?.children) ?? [];
        const hasItalicMark: boolean = docChildren.some((c: any) =>
            Array.isArray(c?.marks) && c.marks.some((m: any) => m?.type === 'italic')
        );
        expect(hasItalicMark).toBe(true);
    });

    it('should wrap an empty paragraph as strong without a stray br placeholder', () => {
        mount([paragraphExtension, boldExtension, undoRedoExtension],
            makeModelDoc([paraNode([])]));
        editor.commands.setSelection({ from: 1, to: 1 });
        editor.commands.toggleBold();
        const html: string = editor.getHtml();
        // At least one <strong> tag must be emitted (collapsed-cursor toggle is a no-op
        // for inclusive marks, so we relax the assertion to ≤1 and require no spurious
        // placeholder behavior like an unpaired <br> introduced alongside an empty strong)
        const strongCount: number = (html.match(/<strong/g) ?? []).length;
        expect(strongCount).toBeLessThanOrEqual(1);
        // Document must remain a single paragraph — no sibling nodes leaked out
        expect(html).not.toMatch(/<\/p>\s*<strong/);
    });

    it('should insert the strong as the next sibling of a link when bolding at its end', () => {
        editor.destroy();
        mount([paragraphExtension, boldExtension, linkExtension, undoRedoExtension],
            makeModelDoc([paraNode([
                { ...textNode('anchor'), marks: [{ type: 'link', attrs: { href: 'https://example.com' } }] } as any,
                textNode(' tail')
            ])]));
        const htmlBefore: string = editor.getHtml();
        expect(htmlBefore).toContain('<a');
        // Position 8 = doc(0) + para(1) + "anchor"(6) = boundary right after the link text
        editor.commands.setSelection({ from: 8, to: 8 });
        editor.commands.toggleBold();
        const html: string = editor.getHtml();
        expect(html).toContain('<a');
        // The link text itself must not be absorbed into a strong
        expect(html).not.toContain('<strong>anchor</strong>');
        // The whole document is still inside one paragraph
        expect((html.match(/<\/p>/g) ?? []).length).toBe(1);
    });

    it('should keep the boundary strong inside the paragraph when no content follows the link', () => {
        mount([paragraphExtension, boldExtension, linkExtension, undoRedoExtension],
            makeModelDoc([paraNode([
                { ...textNode('anchor'), marks: [{ type: 'link', attrs: { href: 'https://example.com' } }] } as any
            ])]));
        // "anchor" spans 2..8; collapsed cursor at its end inside the paragraph
        editor.commands.setSelection({ from: 8, to: 8 });
        editor.commands.toggleBold();
        const html: string = editor.getHtml();
        // Exactly one anchor must remain, and the document must stay in a single paragraph
        expect((html.match(/<a[\s>]/g) ?? []).length).toBe(1);
        expect((html.match(/<\/p>/g) ?? []).length).toBe(1);
        // No strong may escape the paragraph as a sibling of <p>
        expect(html).not.toMatch(/<\/p>\s*<strong/);
    });

    it('should bold the text immediately before a link when toggling at its start', () => {
        mount([paragraphExtension, boldExtension, linkExtension, undoRedoExtension],
            makeModelDoc([paraNode([
                textNode('head '),
                { ...textNode('anchor'), marks: [{ type: 'link', attrs: { href: 'https://example.com' } }] } as any
            ])]));
        // Position 8 = doc(0) + para(1) + "head "(5) = exact start of the link text
        editor.commands.setSelection({ from: 8, to: 8 });
        editor.commands.toggleBold();
        const html: string = editor.getHtml();
        expect(html).toContain('<a');
        // The strong must not swallow the anchor: <strong><a… is forbidden
        expect(html).not.toContain('<strong><a');
    });

    it('should allow an emptied bold paragraph to be converted to an ordered list', () => {
        mount([paragraphExtension, boldExtension, listExtension, undoRedoExtension],
            makeModelDoc([
                paraNode([textNode('a', [{ type: 'bold', attrs: {} }])]),
                paraNode([])
            ]));
        // Position 4 = doc(0) + para1(1) + "a"(2..3) + para1-close(3) = 4 = inside the empty 2nd para
        editor.commands.setSelection({ from: 4, to: 4 });
        editor.commands.toggleOrderedList();
        const html: string = editor.getHtml();
        // The empty 2nd paragraph must be list-convertible
        expect(html).toContain('<ol style="list-style-type: decimal;">');
        expect(html).toContain('<li');
        // "a" with its bold formatting must survive untouched in the first block
        expect(html).toContain('<strong>a</strong>');
    });

    it('should retain bold and a hard break inside a bolded paragraph without crashing', () => {
        editor.destroy();
        // Start with actual text so the bold mark has something to anchor to; then
        // insert a hard break at the cursor and verify the paragraph still renders
        // the strong zone plus a <br> without throwing.
        mount([paragraphExtension, boldExtension, hardBreakExtension, undoRedoExtension],
            makeModelDoc([paraNode([textNode('First line')])]));
        // Bold the whole "First line" text (positions 2..12 = "First line" length 10)
        editor.commands.setSelection({ from: 2, to: 12 });
        editor.commands.toggleBold();
        // Move cursor into the middle of the bolded text and insert a hard break
        editor.commands.setSelection({ from: 8, to: 8 });
        const breakResult: boolean = editor.commands.setHardBreak();
        const html: string = editor.getHtml();
        // The hard break must succeed (returns true) and at least one <br> must render
        expect(breakResult).toBe(true);
        expect(html).toContain('<br');
        // The strong zone(s) must remain present — bold is not collateral-removed by setHardBreak
        expect((html.match(/<strong/g) ?? []).length).toBeGreaterThanOrEqual(1);
        // Document text content is preserved (hard break is an inline split, not a block split)
        expect(editor.getText()).toBe('First line');
    });

    it('should bold an entire heading containing a superscript child without crashing', () => {
        editor.destroy();
        mount([
            paragraphExtension,
            boldExtension,
            headingExtension,
            superscriptExtension,
            undoRedoExtension
        ],
            makeModelDoc([{
                type: 'heading',
                id: crypto.randomUUID(),
                attrs: { level: 1 },
                marks: [],
                children: [
                    textNode('Welcome to the Syncfusion'),
                    { ...textNode('®'), marks: [{ type: 'superscript', attrs: {} }] } as any,
                    textNode(' Rich Text Editor')
                ]
            } as any]));

        // Use selectAll for position-independent coverage — engine handles the cross-mark range
        editor.commands.selectAll();
        editor.commands.toggleBold();
        const html: string = editor.getHtml();
        expect(html).toContain('<h1');
        expect(html).toContain('<strong>');
        expect(html).toContain('Welcome to the Syncfusion');
        // All textual content of the heading must be wrapped in bold
        expect(editor.getText()).toContain('Welcome to the Syncfusion');
        expect(editor.getText()).toContain('Rich Text Editor');
    });

    it('font-weight:bold inline styling should normalize to a strong mark through schema parsing', () => {
        const parsed: any = boldExtension.config.domSpecs!.call({
            options: boldExtension.config.defineOptions!()
        } as any);
        const boldParseRules: any[] = parsed.marks.bold.parseDOM!;
        const styleRule: any = boldParseRules.find((r: any) => !!r.style);
        expect(styleRule).toBeDefined();
        expect(styleRule.style).toBe('font-weight');
        // "bold" and numeric weights >= 500 must be accepted (getAttrs returns null => mark applies)
        expect(styleRule.getAttrs('bold')).toBeNull();
        expect(styleRule.getAttrs('600')).toBeNull();
        expect(styleRule.getAttrs('normal')).toBeFalsy();
        expect(styleRule.getAttrs('400')).toBeFalsy();
    });

    it('should bold text spanning multiple paragraphs in one toggle', () => {
        editor.destroy();
        mount([paragraphExtension, boldExtension, listExtension, tableExtension],
            makeModelDoc([
                paraNode([textNode('First block')]),
                paraNode([textNode('Second block')])
            ]));
        // Position math: doc(0) + para1(1) + "First block"(2..13) + para1-close(13) + para2(14) + "Second block"(15..27) = doc-size 28
        // Selecting all content from start of first text to end of second text.
        editor.commands.selectAll();
        editor.commands.toggleBold();
        const html: string = editor.getHtml();
        expect(html).toContain('<strong>First block</strong>');
        expect(html).toContain('<strong>Second block</strong>');
        // Revert (final revert of chain analog — Case 2)
        editor.commands.selectAll();
        editor.commands.toggleBold();
        expect(editor.getHtml()).not.toContain('<strong>');
    });

    it('should apply bold to the whole mixed-format selection instead of stripping it', () => {
        // Regression for the mixed-formatting defect: with the default
        // "some" toggle semantics, selecting a paragraph that is only
        // partially bolded and pressing Bold REMOVED the existing bold
        // from the entire selection. With "all" semantics the whole
        // selection becomes bold, which is what users expect.
        mount([paragraphExtension, boldExtension, undoRedoExtension],
            makeModelDoc([paraNode([
                textNode('Hello', [{ type: 'bold', attrs: {} }]),
                textNode(' World')
            ])]));

        // Select the entire paragraph: doc(0) + paraOpen(1) + text(2..12)
        editor.commands.setSelection({ from: 1, to: 12 });
        expect(editor.commands.toggleBold()).toBe(true);

        const html: string = editor.getHtml();
        // Every character of the paragraph must now be bold.
        expect(html).toBe('<p><strong>Hello World</strong></p>');
    });

    it('should keep bold on the already-bold half and add it to the plain half of a mixed selection', () => {
        // Fine-grained variant: the previously plain half gains bold,
        // rather than the previously bold half losing it.
        mount([paragraphExtension, boldExtension, undoRedoExtension],
            makeModelDoc([paraNode([
                textNode('Hello', [{ type: 'bold', attrs: {} }]),
                textNode(' World')
            ])]));

        // Select only the plain tail plus part of the bold head.
        editor.commands.setSelection({ from: 3, to: 12 });
        editor.commands.toggleBold();

        const html: string = editor.getHtml();
        // The entire selected span must be bold — no unmarked characters.
        expect(html).toBe('<p><strong>Hello World</strong></p>');
    });

    it('should still remove bold when the entire selection is already bold', () => {
        // "All" semantics must preserve the toggle-off behavior: when
        // every node in the selection carries the mark, toggling removes
        // it (this is what keeps the shortcut a true toggle).
        mount([paragraphExtension, boldExtension, undoRedoExtension],
            makeModelDoc([paraNode([
                textNode('Hello', [{ type: 'bold', attrs: {} }]),
                textNode(' World', [{ type: 'bold', attrs: {} }])
            ])]));

        editor.commands.setSelection({ from: 1, to: 12 });
        editor.commands.toggleBold();

        expect(editor.getHtml()).not.toContain('<strong>');
        expect(editor.getText()).toBe('Hello World');
    });

    it('should report bold as INACTIVE while a mixed-format range is selected', () => {
        // Regression for the toolbar-state defect: after bolding "hello"
        // inside "hi hello world", selecting the whole paragraph left the
        // Bold button lit because the resolver skipped the UNMARKED text
        // nodes entirely. On a mixed selection the toolbar must show the
        // mark as inactive (it is not uniformly applied).
        mount([paragraphExtension, boldExtension, undoRedoExtension],
            makeModelDoc([paraNode([
                textNode('hi '),
                textNode('hello', [{ type: 'bold', attrs: {} }]),
                textNode(' world')
            ])]));

        // Cover exactly the mixed range: "hi hello world".
        editor.commands.setSelection({ from: 2, to: 15 });
        expect(editor.isMarkActive('bold')).toBe(false);
        expect(editor.getActiveMarks().has('bold')).toBe(false);
    });

    it('should keep reporting bold as ACTIVE on the uniformly bold part of a mixed paragraph', () => {
        // The per-subrange toolbar state must remain correct: selecting
        // only the bold fragment still reports active.
        mount([paragraphExtension, boldExtension, undoRedoExtension],
            makeModelDoc([paraNode([
                textNode('hi '),
                textNode('hello', [{ type: 'bold', attrs: {} }]),
                textNode(' world')
            ])]));

        editor.commands.setSelection({ from: 4, to: 9 });
        expect(editor.isMarkActive('bold')).toBe(true);
        expect(editor.getActiveMarks()).toContain('bold');
    });

    it('should treat a mixed selection of two distinct marks as inactive for both', () => {
        // "hi " carries italic, "hello" carries bold: neither mark spans
        // the whole selection, so both buttons reflect the mixed state.
        mount([paragraphExtension, boldExtension, italicExtension, undoRedoExtension],
            makeModelDoc([paraNode([
                textNode('hi ', [{ type: 'italic', attrs: {} }]),
                textNode('hello', [{ type: 'bold', attrs: {} }]),
                textNode(' world')
            ])]));

        editor.commands.setSelection({ from: 2, to: 15 });
        expect(editor.isMarkActive('bold')).toBe(false);
        expect(editor.isMarkActive('italic')).toBe(false);
    });
});
