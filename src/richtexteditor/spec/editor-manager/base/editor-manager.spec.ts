import { RichTextEditor } from "../../../src"
import { destroy, renderRTE } from "../../rich-text-editor/render.spec";

describe('Base Editor Manager', () => {
    describe('Triple click selection testing', () => {
        let editor: RichTextEditor;
        beforeEach(() => {
            editor = renderRTE( {
                value: `<p>The Rich Text Editor is a WYSIWYG ("what you see is what you get") editor useful to create and edit content and return the valid <a href='https://ej2.syncfusion.com/home/' target='_blank'>HTML markup</a> or <a href='https://ej2.syncfusion.com/home/' target='_blank'>markdown</a> of the content</p>
                <ol>
                <li>
                    <p>The Toolbar contains commands to align the text, insert a link, insert an image, insert list, undo/redo operations, HTML view, etc </p>
                </li>
                <li>
                    <p>The Toolbar is fully customizable </p>
                </li>
                </ol>
                <p>List types:</p><ul><li>Ordered List</li><li>Unordered List</li></ul>`
            } );
        });
        afterEach(() => {
            destroy(editor);
        });
        it('Triple click selection testing Case 1:', () => {
            editor.focusIn();
            const pElement: HTMLElement = editor.inputElement.querySelector('p');
            const range: Range = new Range();
            range.setStart(pElement.firstChild, 0);
            range.setEnd(pElement.firstChild, 20);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            const mouseDownEvent: MouseEvent = new MouseEvent('mousedown', {
                view: window,
                bubbles: true,
                cancelable: true,
                detail: 3,
                target: pElement,
                srcElement: pElement
            } as EventInit);
            pElement.dispatchEvent(mouseDownEvent);
            expect(window.getSelection().getRangeAt(0).startContainer.nodeType === 3).toBe(true);
            expect(window.getSelection().getRangeAt(0).endContainer.nodeType).not.toBe(1);
            expect(window.getSelection().getRangeAt(0).endOffset).toBe(15);
            expect(window.getSelection().getRangeAt(0).startOffset).toBe(0);
        });
        it('Triple click selection testing Case 2:', () => {
            editor.focusIn();
            const liElement: HTMLElement = editor.inputElement.querySelector('ol li');
            const range: Range = new Range();
            range.setStart(liElement.firstChild, 0);
            range.setEnd(liElement.firstChild, 2);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            const mouseDownEvent: MouseEvent = new MouseEvent('mousedown', {
                view: window,
                bubbles: true,
                cancelable: true,
                detail: 3,
                target: liElement,
                srcElement: liElement
            } as EventInit);
            liElement.dispatchEvent(mouseDownEvent);
            expect(window.getSelection().getRangeAt(0).startContainer.nodeType === 3).toBe(true);
            expect(window.getSelection().getRangeAt(0).endContainer.nodeType).not.toBe(1);
            expect(window.getSelection().getRangeAt(0).endOffset).toBe(2);
            expect(window.getSelection().getRangeAt(0).startOffset).toBe(0);
        });
        it('Triple click selection testing Case 3:', () => {
            editor.focusIn();
            const liElement: HTMLElement = editor.inputElement.querySelector('ul li');
            const range: Range = new Range();
            range.setStart(liElement.firstChild, 0);
            range.setEnd(liElement.firstChild, 2);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            const mouseDownEvent: MouseEvent = new MouseEvent('mousedown', {
                view: window,
                bubbles: true,
                cancelable: true,
                detail: 3,
                target: liElement,
                srcElement: liElement
            } as EventInit);
            liElement.dispatchEvent(mouseDownEvent);
            expect(window.getSelection().getRangeAt(0).startContainer.nodeType === 3).toBe(true);
            expect(window.getSelection().getRangeAt(0).endContainer.nodeType).not.toBe(1);
            expect(window.getSelection().getRangeAt(0).endOffset).toBe(12);
            expect(window.getSelection().getRangeAt(0).startOffset).toBe(0);
        });
    });
});