import { EditorManager, RichTextEditor } from "../../../src"
import { SPACE_EVENT_INIT } from "../../constant.spec";
import { destroy, renderRTE } from "../../rich-text-editor/render.spec";
import { Browser } from '@syncfusion/ej2-base';

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
            expect(window.getSelection().getRangeAt(0).endOffset).toBe(130);
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

    describe('Triple click selection testing', () => {
        let editor: RichTextEditor;
        let defaultUA: string = navigator.userAgent;
        let safari: string = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15";
        beforeEach(() => {
            Browser.userAgent = safari;
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
            Browser.userAgent = defaultUA;
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
            expect(window.getSelection().getRangeAt(0).endOffset).toBe(130);
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

    describe('1020260: Automatic Bullet List Creation When Using Hyphen-Space in Rich Text Editor Content when P tag is configured', () => {
        let editor: RichTextEditor;
        let defaultUA: string = navigator.userAgent;
        beforeEach(() => {
            editor = renderRTE( {
                value: ``
            });
        });
        afterEach(() => {
            destroy(editor);
        });
        it('space in middle/last of the paragraph, should not create list item', (done: Function) => {
            editor.focusIn();
            editor.inputElement.innerHTML = `<p>one two<strong>-​</strong></p>`;
            const pElement: HTMLElement = editor.inputElement.querySelector('p');
            const range: Range = new Range();
            range.setStart(pElement.lastChild.firstChild, 0);
            range.setEnd(pElement.lastChild.firstChild, 0);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
            editor.inputElement.dispatchEvent(spaceDownEvent);
            const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SPACE_EVENT_INIT);
            editor.inputElement.dispatchEvent(spaceUpEvent);
            setTimeout(() => {
                expect(editor.inputElement.querySelectorAll('li').length).toBe(0);
                done();
            }, 50);
        });
        it('Should create list item when its in the starting', (done: Function) => {
            editor.focusIn();
            editor.inputElement.innerHTML = `<p>-​</p>`;
            const pElement: HTMLElement = editor.inputElement.querySelector('p');
            const range: Range = new Range();
            range.setStart(pElement.firstChild, 1);
            range.setEnd(pElement.firstChild, 1);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
            editor.inputElement.dispatchEvent(spaceDownEvent);
            const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SPACE_EVENT_INIT);
            editor.inputElement.dispatchEvent(spaceUpEvent);
            setTimeout(() => {
                expect(editor.inputElement.querySelectorAll('li').length).toBe(1);
                done();
            }, 50);
        });
    });

    describe('1020260: Automatic Bullet List Creation When Using Hyphen-Space in Rich Text Editor Content when BR tag is configured', () => {
        let editor: RichTextEditor;
        let defaultUA: string = navigator.userAgent;
        beforeEach(() => {
            editor = renderRTE( {
                enterKey: 'BR'
            });
        });
        afterEach(() => {
            destroy(editor);
        });
        it('space in middle/last of the paragraph, should not create list item', (done: Function) => {
            editor.focusIn();
            editor.inputElement.innerHTML = `one two<strong>-​</strong>`;
            const pElement: HTMLElement = editor.inputElement.querySelector('strong');
            const range: Range = new Range();
            range.setStart(pElement.firstChild, 0);
            range.setEnd(pElement.firstChild, 0);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
            editor.inputElement.dispatchEvent(spaceDownEvent);
            const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SPACE_EVENT_INIT);
            editor.inputElement.dispatchEvent(spaceUpEvent);
            setTimeout(() => {
                expect(editor.inputElement.querySelectorAll('li').length).toBe(0);
                done();
            }, 50);
        });
        it('Should create list item when its in the starting', (done: Function) => {
            editor.focusIn();
            editor.inputElement.innerHTML = `-​`;
            const pElement: Node = editor.inputElement.firstChild;
            const range: Range = new Range();
            range.setStart(pElement, 1);
            range.setEnd(pElement, 1);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
            editor.inputElement.dispatchEvent(spaceDownEvent);
            const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SPACE_EVENT_INIT);
            editor.inputElement.dispatchEvent(spaceUpEvent);
            setTimeout(() => {
                expect(editor.inputElement.querySelectorAll('li').length).toBe(1);
                done();
            }, 50);
        });
        it('should create list item when range is after BR', (done: Function) => {
            editor.focusIn();
            editor.inputElement.innerHTML = `one two<br><strong>-​</strong>`;
            const pElement: HTMLElement = editor.inputElement.querySelector('strong');
            const range: Range = new Range();
            range.setStart(pElement.firstChild, 1);
            range.setEnd(pElement.firstChild, 1);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
            editor.inputElement.dispatchEvent(spaceDownEvent);
            const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SPACE_EVENT_INIT);
            editor.inputElement.dispatchEvent(spaceUpEvent);
            setTimeout(() => {
                expect(editor.inputElement.querySelectorAll('li').length).toBe(1);
                done();
            }, 50);
        });
        it('should create list item when range is after blockElement', (done: Function) => {
            editor.focusIn();
            editor.inputElement.innerHTML = `<h1>one two</h1><strong>-​</strong>`;
            const pElement: HTMLElement = editor.inputElement.querySelector('strong');
            const range: Range = new Range();
            range.setStart(pElement.firstChild, 1);
            range.setEnd(pElement.firstChild, 1);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
            editor.inputElement.dispatchEvent(spaceDownEvent);
            const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SPACE_EVENT_INIT);
            editor.inputElement.dispatchEvent(spaceUpEvent);
            setTimeout(() => {
                expect(editor.inputElement.querySelectorAll('li').length).toBe(1);
                done();
            }, 50);
        });
    });

    describe('Is Blazor value testing', () => {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({});
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should set the boolean to false in EJ2.', ()=> {
            expect((editor.formatter.editorManager as EditorManager).isBlazor).toBe(false);
        })
    });
});