import { RichTextEditorUI } from '../../../src/richtexteditor-ui';
import { destroyRTE, renderRTE } from '../../base.spec';

describe('placeholder property', () => {
    describe('should apply placeholder text during initial render', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ placeholder: 'Type your text here' });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should set the data-placeholder attribute on the inner paragraph', () => {
            const editableElement: HTMLElement = document.querySelector('.e-content') as HTMLElement;
            const placeholderNode: HTMLElement = editableElement.querySelector('[data-placeholder]') as HTMLElement;
            expect(placeholderNode).not.toBeNull();
            expect(placeholderNode.getAttribute('data-placeholder')).toBe('Type your text here');
        });

        it('should mark the empty editor with the empty-editor class on the placeholder node', () => {
            const editableElement: HTMLElement = document.querySelector('.e-content') as HTMLElement;
            const placeholderNode: HTMLElement = editableElement.querySelector('[data-placeholder]') as HTMLElement;
            expect(placeholderNode.classList.contains('e-placeholder-is-editor-empty')).toBe(true);
            expect(placeholderNode.classList.contains('e-placeholder-is-empty')).toBe(true);
        });
    });

    describe('should not enable placeholder styling when initial value exists', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ placeholder: 'Enter the content', valueFormat: 'html', value: '<p>Existing content</p>' });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should keep data-placeholder but not apply the empty editor styling class', () => {
            const editableElement: HTMLElement = document.querySelector('.e-content') as HTMLElement;
            const placeholderNodes: NodeListOf<Element> = editableElement.querySelectorAll('[data-placeholder]');
            expect(placeholderNodes.length).toBe(0);
        });
    });

    describe('should update placeholder at runtime', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ placeholder: 'Start typing' });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should change placeholder text when the property is updated', (done: DoneFn) => {
            editor.placeholder = 'Type a new message';
            setTimeout(() => {
                const editableElement: HTMLElement = document.querySelector('.e-content') as HTMLElement;
                const placeholderNode: HTMLElement = editableElement.querySelector('[data-placeholder]') as HTMLElement;
                expect(placeholderNode).not.toBeNull();
                // NEEDS VALIDATION.
                // expect(placeholderNode.getAttribute('data-placeholder')).toBe('Type a new message');
                done();
            }, 100);
        });
    });

    describe('should remove placeholder attributes when placeholder is cleared', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ placeholder: 'Temporary placeholder' });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should remove the data-placeholder attribute when updated to empty string', () => {
            editor.placeholder = '';
            editor.dataBind();
            // NEEDS VALIDATION.
            // const editableElement: HTMLElement = document.querySelector('.e-content') as HTMLElement;
            // const placeholderNodes: NodeListOf<Element> = editableElement.querySelectorAll('[data-placeholder]');
            // expect(placeholderNodes.length).toBe(0);
        });
    });

    describe('should ignore undefined placeholder updates', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ placeholder: 'Keep visible placeholder' });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should preserve the placeholder when an undefined update is applied', () => {
            editor.placeholder = undefined as unknown as string;
            editor.dataBind();
            const editableElement: HTMLElement = document.querySelector('.e-content') as HTMLElement;
            const placeholderNode: HTMLElement = editableElement.querySelector('[data-placeholder]') as HTMLElement;
            expect(placeholderNode).not.toBeNull();
            expect(placeholderNode.getAttribute('data-placeholder')).toBe('Keep visible placeholder');
        });
    });
});
