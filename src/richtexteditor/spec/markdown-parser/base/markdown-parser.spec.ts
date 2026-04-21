import { RichTextEditor } from "../../../src/rich-text-editor/base";
import { DialogType } from "../../../src/common/enum";
import { renderRTE } from "../../rich-text-editor/render.spec";

describe('Markdown Parser base module ', () => {
    let editor: RichTextEditor;
    let originalError: jasmine.Spy;
    let originalWarn: jasmine.Spy;
    beforeAll(() => {
        originalError = jasmine.createSpy('error');
        originalWarn = jasmine.createSpy('warn');
        editor = renderRTE({
            editorMode: 'Markdown'
        });
    });
    afterAll(() => {
        editor.destroy();
    });
    it('Calling the image show dialog programmatically', () => {
        editor.showDialog(DialogType.InsertImage);
        expect(document.body.querySelector('.e-rte-img-dialog')).not.toBe(null);
    });
    it('copy and cut via clipBoardHandler should not log console errors in Markdown', (done) => {
        const textAreaEle = editor.inputElement as HTMLTextAreaElement;
        textAreaEle.value = 'Hello Markdown!';
        textAreaEle.focus();
        //Copy
        textAreaEle.selectionStart = 0;
        textAreaEle.selectionEnd = 5;
        const dtCopy = new DataTransfer();
        const copyEvent = new ClipboardEvent('copy', { clipboardData: dtCopy } as ClipboardEventInit);
        expect(() => editor.clipBoardHandler(copyEvent)).not.toThrow();
        //Cut
        textAreaEle.selectionStart = 6;
        textAreaEle.selectionEnd = 14;
        const dtCut = new DataTransfer();
        const cutEvent = new ClipboardEvent('cut', { clipboardData: dtCut } as ClipboardEventInit);
        expect(() => editor.clipBoardHandler(cutEvent)).not.toThrow();
        // Assert: no console errors/warnings were logged
        setTimeout(function () {
            expect(originalError).not.toHaveBeenCalled();
            expect(originalWarn).not.toHaveBeenCalled();
            done();
        }, 100);
    });
});