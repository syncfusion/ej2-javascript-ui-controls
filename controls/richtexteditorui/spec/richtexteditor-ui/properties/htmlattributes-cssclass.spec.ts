import { RichTextEditorUI } from '../../../src/richtexteditor-ui';
import { destroyRTE, renderRTE } from '../../base.spec';

describe('htmlAttributes properties', () => {
    describe('should apply custom htmlAttributes during initial render', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                htmlAttributes: {
                    title: 'Markdown editor',
                    'data-mode': 'rich-text',
                    tabindex: '1'
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should apply custom htmlAttributes during initial render', () => {
            const editorElement: HTMLElement = document.querySelector('.e-control.e-richtexteditor-ui') as HTMLElement;
            expect(editorElement.getAttribute('title')).toBe('Markdown editor');
            expect(editorElement.getAttribute('data-mode')).toBe('rich-text');
            expect(editor.inputElement.getAttribute('tabindex')).toBe('1');
        });
    });

    describe('should apply class and update state related attributes from htmlAttributes', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                htmlAttributes: {
                    class: 'html-editor',
                    readonly: 'readonly',
                    disabled: 'disabled'
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should apply class and update state related attributes from htmlAttributes', () => {
            const editorElement: HTMLElement = document.querySelector('.e-control.e-richtexteditor-ui') as HTMLElement;
            expect(editorElement.classList.contains('html-editor')).toBe(true);
            expect(editorElement.getAttribute('aria-disabled')).toBe('true');
            expect(editor.enable).toBe(false);
            expect(editor.readonly).toBe(true);
        });
    });

    describe('should merge updated htmlAttributes with the existing editor element', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                htmlAttributes: {
                    class: 'html-initial',
                    title: 'Initial title',
                    'data-state': 'initial'
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should merge updated htmlAttributes with the existing editor element', () => {
            editor.htmlAttributes = {
                class: 'html-updated',
                title: 'Updated title',
                'data-stage': 'draft'
            };
            editor.dataBind();
            const editorElement: HTMLElement = document.querySelector('.e-control.e-richtexteditor-ui') as HTMLElement;
            expect(editorElement.classList.contains('html-initial')).toBe(true);
            expect(editorElement.classList.contains('html-updated')).toBe(true);
            expect(editorElement.getAttribute('title')).toBe('Updated title');
            expect(editorElement.getAttribute('data-state')).toBe('initial');
            expect(editorElement.getAttribute('data-stage')).toBe('draft');
        });
    });

});

describe('cssClass properties', () => {
    describe('should apply a single cssClass during initial render', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ cssClass: 'editor-shell' });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should apply a single cssClass during initial render', () => {
            const editorElement: HTMLElement = document.querySelector('.e-control.e-richtexteditor-ui') as HTMLElement;
            expect(editorElement.classList.contains('editor-shell')).toBe(true);
        });
    });

    describe('should apply multiple cssClass values during initial render', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ cssClass: 'editor-shell editor-borderless' });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should apply multiple cssClass values during initial render', () => {
            const editorElement: HTMLElement = document.querySelector('.e-control.e-richtexteditor-ui') as HTMLElement;
            expect(editorElement.classList.contains('editor-shell')).toBe(true);
            expect(editorElement.classList.contains('editor-borderless')).toBe(true);
        });
    });

    describe('should replace previous cssClass values during runtime updates', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ cssClass: 'editor-shell editor-borderless' });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should replace previous cssClass values during runtime updates', () => {
            editor.cssClass = 'editor-focused editor-compact';
            editor.dataBind();
            const editorElement: HTMLElement = document.querySelector('.e-control.e-richtexteditor-ui') as HTMLElement;
            expect(editorElement.classList.contains('editor-shell')).toBe(false);
            expect(editorElement.classList.contains('editor-borderless')).toBe(false);
            expect(editorElement.classList.contains('editor-focused')).toBe(true);
            expect(editorElement.classList.contains('editor-compact')).toBe(true);
        });
    });

    describe('should keep htmlAttributes class while updating cssClass', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                htmlAttributes: { class: 'html-shell' },
                cssClass: 'editor-shell'
            });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should keep htmlAttributes class while updating cssClass', () => {
            editor.cssClass = 'editor-updated';
            editor.dataBind();
            const editorElement: HTMLElement = document.querySelector('.e-control.e-richtexteditor-ui') as HTMLElement;
            expect(editorElement.classList.contains('html-shell')).toBe(true);
            expect(editorElement.classList.contains('editor-shell')).toBe(false);
            expect(editorElement.classList.contains('editor-updated')).toBe(true);
        });
    });
});
