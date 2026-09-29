import { RichTextEditorUI } from '../../../src/richtexteditor-ui';
import { destroyRTE, renderRTE } from '../../base.spec';

describe('enableRtl property', () => {
    describe('should set default left-to-right direction on initial render', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should apply dir="ltr" when enableRtl is not enabled', () => {
            const editorElement: HTMLElement = editor.inputElement;
            expect(editorElement.getAttribute('dir')).toBe('ltr');
            expect(editor.enableRtl).toBe(false);
        });
    });

    describe('should apply right-to-left direction when enableRtl is true', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ enableRtl: true });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should set dir="rtl" on the editor host element', () => {
            const editorElement: HTMLElement = editor.inputElement;
            expect(editorElement.getAttribute('dir')).toBe('rtl');
            expect(editor.enableRtl).toBe(true);
        });
    });

    describe('should update the direction when enableRtl changes at runtime', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ enableRtl: true });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should switch the dir attribute when enableRtl is disabled at runtime', () => {
            editor.enableRtl = false;
            editor.dataBind();
            const editorElement: HTMLElement = editor.inputElement;
            expect(editorElement.getAttribute('dir')).toBe('ltr');
            expect(editor.enableRtl).toBe(false);
        });
    });

    describe('should preserve the dir attribute when enableRtl remains unchanged', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ enableRtl: false });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should keep dir="ltr" after applying the same enableRtl value', () => {
            editor.enableRtl = false;
            editor.dataBind();
            const editorElement: HTMLElement = editor.inputElement;
            expect(editorElement.getAttribute('dir')).toBe('ltr');
        });
    });
});
