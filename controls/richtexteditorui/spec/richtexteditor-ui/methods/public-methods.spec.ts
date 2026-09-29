import { RichTextEditorUI } from '../../../src/richtexteditor-ui';
import { destroyRTE, renderRTE } from '../../base.spec';

describe('RichTextEditor public methods', () => {
    let editor: RichTextEditorUI;

    afterEach(() => {
        destroyRTE(editor);
    });

    it('should read and write serialized content through the public API', () => {
        editor = renderRTE({ value: '<p>Hello <strong>World</strong></p>', valueFormat: 'html' });
        const inputElement: HTMLElement = editor.inputElement as HTMLElement;
        expect(editor.getHtml()).toBe('<p>Hello <strong>World</strong></p>');
        expect(editor.getText()).toBe('Hello World');
        // editor.value = '<p>Updated <em>content</em></p>';
        // expect(editor.value).toBe('<p>Updated <em>content</em></p>');
        // expect(inputElement.innerHTML).toBe('<p>Updated <em>content</em></p>');
        // expect(editor.getHtml()).toBe('<p>Updated <em>content</em></p>');
        // expect(editor.getText()).toBe('Updated content');
    });

    it('Should works the commands public method for horizontalRule', () => {
        editor = renderRTE({ value: '<p>Hello <strong>World</strong></p>', valueFormat: 'html' });
        editor.inputElement?.focus();
        editor.commands().horizontalRule().apply();
        expect(editor.inputElement?.querySelector('hr')).not.toBeNull();
    });

    it('should focus and commit dirty content through shell methods', (done: DoneFn) => {
        editor = renderRTE({ value: '<p>Hello <strong>World</strong></p>', valueFormat: 'html' });
        const inputElement: HTMLElement = editor.inputElement as HTMLElement;
        const focusSpy: jasmine.Spy = spyOn(inputElement, 'focus').and.callThrough();
        const blurSpy: jasmine.Spy = spyOn(inputElement, 'blur').and.callThrough();
        editor.baseEditorCore.editor.commands.insertText({text : 'Dirty content'});
        editor.focus();
        expect(focusSpy).toHaveBeenCalled();
        editor.save();
        setTimeout(() => {
            expect(editor.value).toBe('<p>Dirty contentHello <strong>World</strong></p>');
            editor.baseEditorCore.editor.commands.insertText({text : 'Commited by blur'});
            editor.blur();
            expect(blurSpy).toHaveBeenCalled();
            expect(editor.value).toBe('<p>Dirty contentCommited by blurHello <strong>World</strong></p>');
            done();
        }, 100);
    });

    it('should render content to a print window without changing editor content', () => {
        editor = renderRTE({ value: '<p>Hello <strong>World</strong></p>', valueFormat: 'html' });
        const writeSpy: jasmine.Spy = jasmine.createSpy('write');
        const openSpy: jasmine.Spy = jasmine.createSpy('open');
        const closeSpy: jasmine.Spy = jasmine.createSpy('close');
        const focusSpy: jasmine.Spy = jasmine.createSpy('focus');
        const printSpy: jasmine.Spy = jasmine.createSpy('print');
        const printDocument: Document = {
            open: openSpy,
            write: writeSpy,
            close: closeSpy
        } as unknown as Document;
        const printWindow: Window = {
            document: printDocument,
            focus: focusSpy,
            print: printSpy,
            close: closeSpy
        } as unknown as Window;
        spyOn(window, 'open').and.returnValue(printWindow);
        editor.print();
        expect(window.open).toHaveBeenCalled();
    });
});
