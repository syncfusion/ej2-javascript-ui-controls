import { HeadlessEditor, paragraphExtension, boldExtension, undoRedoExtension, basicExtensions, TextNode, EditorNode } from '../../../src/index';
import { inlineCodeExtension } from '../../../src/extensions/builtins/inline-code';

describe('HeadlessEditor Inline Code Formatting', () => {
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

    const mountEditor = (
        extensions: any[],
        text = 'Hello World',
        options: any = {}
    ): void => {
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
        mountEditor(
            [
                paragraphExtension,
                inlineCodeExtension,
                undoRedoExtension
            ],
            'Hello World',
            {
                enableInputRules: true
            }
        );
    });

    afterEach(() => {
        if (editor && !editor.isDestroyed) {
            editor.destroy();
        }
        container.remove();
    });

    describe('metadata', () => {
        const ctx = {} as any;

        it('should have correct name', () => {
            expect(inlineCodeExtension.name).toBe('inlineCode');
        });

        it('should expose independent default options', () => {
            const first = inlineCodeExtension.config.defineOptions!();
            const second = inlineCodeExtension.config.defineOptions!();
            expect(first).toEqual({ htmlAttributes: {} });
            expect(second).toEqual({ htmlAttributes: {} });
            expect(first).not.toBe(second);
        });

        it('should register one inclusive code mark', () => {
            const marks = inlineCodeExtension.config.marks!();
            expect(marks.length).toBe(1);
            expect(marks[0]).toEqual({
                name: 'code',
                inclusive: true
            });
        });

        it('should contribute toggleCodeMark command', () => {
            const commands = inlineCodeExtension.config.commands!();
            expect(commands.length).toBe(1);
            expect(commands[0].name).toBe('toggleCodeMark');
        });

        it('should register exactly one input rule', () => {
            const rules = inlineCodeExtension.config.inputRules!(ctx);
            expect(rules.length).toBe(1);
        });

        it('should register inline-code input rule', () => {
            const rules = inlineCodeExtension.config.inputRules!(ctx);
            expect(rules[0].id).toBe('mark:inline-code');
        });
    });

    describe('DOM specifications', () => {
        it('should expose code dom specs', () => {
            const specs = inlineCodeExtension.config.domSpecs!.call({ options: {} } as any);
            expect(specs.marks.code).toBeDefined();
        });

        it('should serialize code mark to code element', () => {
            const specs = inlineCodeExtension.config.domSpecs!.call({ options: { htmlAttributes: {} } } as any);
            expect(specs.marks.code.toDOM!()).toEqual(['code', {}, 0]);
        });

        it('should register code parseDOM rule', () => {
            const specs = inlineCodeExtension.config.domSpecs!.call({options: {}} as any);
            expect(specs.marks.code.parseDOM[0].tag).toBe('code');
        });

        it('should render configured html attributes', () => {
            const attrs = {
                class: 'inline-code',
                'data-testid': 'code'
            };
            const specs = inlineCodeExtension.config.domSpecs!.call({ options: { htmlAttributes: attrs } } as any);
            expect(specs.marks.code.toDOM!()).toEqual([
                'code',
                attrs,
                0
            ]);
        });

        it('should fall back to empty DOM attributes when options are absent', () => {
            let descriptor: unknown;
            expect(() => {
                const specs = inlineCodeExtension.config.domSpecs!.call({} as any);
                descriptor = specs.marks.code.toDOM!();
            }).not.toThrow();
            expect(descriptor).toEqual(['code', {}, 0]);
        });
    });

    describe('formatting behavior', () => {
        it('should apply inline code to selected text', () => {
            editor.commands.setSelection({ from: 1, to: 6 });
            expect(editor.commands.toggleCodeMark()).toBe(true);
            expect(editor.getHtml()).toContain('<code>Hello</code>');
        });

        it('should apply inline code only to selected range', () => {
            editor.commands.setSelection({from: 1, to: 6 });
            editor.commands.toggleCodeMark();
            expect(editor.getHtml()).toContain('<code>Hello</code>');
            expect(editor.getHtml()).toContain(' World');
        });

        it('should remove inline code when toggled twice', () => {
            editor.commands.setSelection({ from: 1, to: 6 });
            editor.commands.toggleCodeMark();
            editor.commands.toggleCodeMark();
            expect(editor.getHtml()).not.toContain('<code>');
        });

        it('should leave content unchanged for a collapsed selection', () => {
            const originalHtml = editor.getHtml();
            editor.commands.setSelection({ from: 6, to: 6 });
            editor.commands.toggleCodeMark();
            expect(editor.getHtml()).toBe(originalHtml);
        });

        it('should expose code mark through active marks', () => {
            editor.commands.setSelection({ from: 1, to: 6 });
            editor.commands.toggleCodeMark();
            expect(editor.getActiveMarks()).toContain('code');
        });

        it('should expose code mark through isMarkActive', () => {
            editor.commands.setSelection({ from: 1, to: 6});
            editor.commands.toggleCodeMark();
            expect(editor.isMarkActive('code')).toBe(true);
        });

        it('should apply code mark to document model', () => {
            editor.commands.setSelection({ from: 1, to: 6 });
            editor.commands.toggleCodeMark();
            const textNode: EditorNode = editor.getDocument().children[0].children[0];
            expect(textNode.marks).toEqual([
                {
                    type: 'code',
                    attrs: {}
                }
            ]);
        });
    });

    describe('input rules', () => {
        function applyInput(text: string): boolean {
            const editorView: any = editor.integration.getView();
            let handled = false;
            editor.commands.setSelection({ from: 1, to: 1 });
            editorView.someProp(
                'handleTextInput',
                (handler: Function) => {
                    handled =
                        handler(
                            editorView,
                            1,
                            1,
                            text
                        ) || handled;
                }
            );
            return handled;
        }

        it('should apply inline code using markdown syntax', () => {
            expect(applyInput('`code`')).toBe(true);
            expect(editor.getHtml()).toContain('<code>code</code>');
        });

        it('should reject empty inline code syntax', () => {
            expect(applyInput('``')).toBe(false);
        });

        it('should reject malformed syntax', () => {
            expect(applyInput('```')).toBe(false);
        });
    });

    describe('keyboard shortcuts', () => {
        it('should register Mod-` shortcut', () => {
            const shortcuts =
                inlineCodeExtension.config
                    .keyboardShortcuts!.call({
                        editor: {
                            commands: {
                                toggleCodeMark: () => true
                            }
                        }
                    } as any);
            expect(shortcuts['Mod-`']).toBeDefined();
        });

        it('should apply inline code through keyboard shortcut', () => {
            const editorView: any = editor.integration.getView();
            editor.commands.setSelection({ from: 1, to: 6 });
            editorView.dom.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: '`',
                    ctrlKey: true,
                    bubbles: true,
                    cancelable: true
                })
            );
            expect(editor.getHtml()).toContain('<code>Hello</code>');
        });
    });

    describe('undo redo', () => {
        it('should undo inline code formatting', () => {
            editor.commands.setSelection({ from: 1, to: 6 });
            editor.commands.toggleCodeMark();
            expect(editor.getHtml()).toContain('<code>');
            expect(editor.commands.undo()).toBe(true);
            expect(editor.getHtml()).not.toContain('<code>');
        });

        it('should redo inline code formatting', () => {
            editor.commands.setSelection({ from: 1, to: 6 });
            editor.commands.toggleCodeMark();
            const codeHtml = editor.getHtml();
            editor.commands.undo();
            expect(editor.commands.redo()).toBe(true);
            expect(editor.getHtml()).toBe(codeHtml);
        });

        it('should undo inline code and bold sequentially', () => {
            editor.destroy();
            mountEditor([
                paragraphExtension,
                inlineCodeExtension,
                boldExtension,
                undoRedoExtension
            ]);
            editor.commands.setSelection({ from: 1, to: 6 });
            editor.commands.toggleCodeMark();
            editor.commands.toggleBold();
            editor.commands.undo();
            expect(editor.getHtml()).toContain('<code>');
            editor.commands.undo();
            expect(editor.getHtml()).not.toContain('<code>');
        });

        it('should redo inline code and bold sequentially', () => {
            editor.destroy();
            mountEditor([
                paragraphExtension,
                inlineCodeExtension,
                boldExtension,
                undoRedoExtension
            ]);
            editor.commands.setSelection({ from: 1, to: 6 });
            editor.commands.toggleCodeMark();
            editor.commands.toggleBold();
            editor.commands.undo();
            editor.commands.undo();
            editor.commands.redo();
            expect(editor.getHtml()).toContain('<code>');
            editor.commands.redo();
            expect(editor.getHtml()).toContain('<strong>');
        });
    });

    describe('core preset integration', () => {
        it('should expose inline code formatting through core preset', () => {
            editor.destroy();
            mountEditor([
                basicExtensions
            ]);
            editor.commands.setSelection({ from: 1, to: 6 });
            editor.commands.toggleCodeMark();
            expect(editor.getHtml()).toContain('<code>Hello</code>');
        });
    });
});