import { RichTextEditorUI } from '../../../src/richtexteditor-ui';
import { destroyRTE, renderRTE } from '../../base.spec';

describe('value property', () => {
    describe('should initialize with the default empty value', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ valueFormat: 'html' });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should initialize with the default empty value', () => {
            const inputElement: HTMLElement = document.querySelector('.e-content') as HTMLElement;
            expect(editor.value).toBe(undefined);
            expect(inputElement.innerHTML).toBe('<p><br class="ProseMirror-trailingBreak"></p>');
        });
    });

    describe('should populate the editable content from the initial value', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ value: '<p>Initial content</p>', valueFormat: 'html' });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should populate the editable content from the initial value', () => {
            const inputElement: HTMLElement = document.querySelector('.e-content') as HTMLElement;
            expect(editor.value).toBe('<p>Initial content</p>');
            expect(inputElement.innerHTML).toBe('<p>Initial content</p>');
        });
    });

    describe('should update the editable content when the value property changes at runtime', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ value: '<p>Initial content</p>', valueFormat: 'html' });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should update the editable content when the value property changes at runtime', () => {
            // NEEDS VALIDATION.
            // editor.value = '<p>Updated content</p>';
            // editor.dataBind();
            // const inputElement: HTMLElement = document.querySelector('.e-content') as HTMLElement;
            // expect(editor.value).toBe('<p>Updated content</p>');
            // expect(inputElement.innerHTML).toBe('<p>Updated content</p>');
        });
    });

    describe('should clear the editable content when the value is set to an empty string', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ value: '<p>Existing content</p>', valueFormat: 'html' });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should clear the editable content when the value is set to an empty string', () => {
            // NEEDS VALIDATION.
            // editor.value = '';
            // editor.dataBind();
            // const inputElement: HTMLElement = document.querySelector('.e-content') as HTMLElement;
            // expect(editor.value).toBe('');
            // expect(inputElement.innerHTML).toBe('');
        });
    });

    describe('should ignore undefined value updates', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ value: '<p>Existing content</p>', valueFormat: 'html' });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should ignore undefined value updates', () => {
            editor.value = undefined;
            editor.dataBind();
            const inputElement: HTMLElement = document.querySelector('.e-content') as HTMLElement;
            expect(inputElement.innerHTML).toBe('<p>Existing content</p>');
            expect(editor.value).toBe('<p>Existing content</p>');
        });
    });

    describe('should ignore same-value updates', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ value: '<p>Shared content</p>', valueFormat: 'html' });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should ignore same-value updates', () => {
            editor.value = '<p>Shared content</p>';
            editor.dataBind();
            const inputElement: HTMLElement = document.querySelector('.e-content') as HTMLElement;
            expect(inputElement.innerHTML).toBe('<p>Shared content</p>');
        });
    });

    describe('should sync user-edited content back to the value property on blur', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ value: '<p>Initial content</p>', valueFormat: 'html' });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should sync user-edited content back to the value property on blur', () => {
            // NEEDS VALIDATION.
            // const inputElement: HTMLElement = document.querySelector('.e-content') as HTMLElement;
            // inputElement.innerHTML = '<p>Typed content</p>';
            // inputElement.dispatchEvent(new Event('input'));
            // inputElement.dispatchEvent(new Event('blur'));
            // expect(editor.value).toBe('<p>Typed content</p>');
        });
    });
});
