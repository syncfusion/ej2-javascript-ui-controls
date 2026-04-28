/**
 * Enter Key spec
 */
import { Browser, createElement, detach } from '@syncfusion/ej2-base';
import { RichTextEditor} from './../../../../src/index';
import { renderRTE, destroy } from './../../render.spec';
import { NodeSelection } from './../../../../src/selection/index';
import { BACKSPACE_EVENT_INIT, ENTERKEY_EVENT_INIT } from '../../../constant.spec';

let keyboardEventArgs = new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT);

describe('Enter Key Tests', ()=> {

    describe('927528: Console error thrown when pressing enter at the beginning of text in the editor at firefox browser', () => {
        let defaultUserAgent = navigator.userAgent;
        let fireFox: string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0";
        let rteObj: RichTextEditor;
        beforeAll(() => {
            Browser.userAgent = fireFox;
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'P',
                value: `<p class="focusNode">hello</p>`
            });
        });

        it('Console error thrown when pressing enter key at the beginning of text at firefox browser', (done: DoneFn)=>{
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.focusNode').childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(document, startNode, startNode, 0, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                const expectedElem: string = `<p class="focusNode"><br></p><p class="focusNode"><br></p><p class="focusNode">hello</p>`;
                expect(rteObj.inputElement.innerHTML === expectedElem).toBe(true);
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
            Browser.userAgent = defaultUserAgent;
        });
    });

    describe('841897 - Enter key press submits the form when Rich Text Editor control is used inside the Form element', () => {
        let rteObj: RichTextEditor;
        let element: HTMLElement 
        beforeAll(() => {
            element = createElement('div', {
                id: "from-wrapper", innerHTML:
                    ` <form method="post">
                            <div id="defaultRTE">
                            </div>
                            <div id="submitbutton">
                                <button id="submitButton" type="submit">Submit</button>
                            </div>
                        </form>
                    ` });
            document.body.appendChild(element);
            rteObj = new RichTextEditor({
                enterKey:'DIV',
                shiftEnterKey:'BR',
                pasteCleanupSettings: {
                    prompt: true
                },
                toolbarSettings: {
                    items: [
                    "Undo",
                    "Redo",
                    "|",
                    "Bold",
                    "Italic",
                    "Underline",
                    "StrikeThrough"
                    ]
                },
                value: `<p class="focusNode"><br></p>`
            });
            rteObj.appendTo('#defaultRTE');
        });

        it('Enter key press submits the form when Rich Text Editor control is used inside the Form element', (done:DoneFn)=>{
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.focusNode')
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 0, 0);
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.setData('text/html', 'testing');
            const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
            rteObj.inputElement.dispatchEvent(pasteEvent);
            setTimeout(() => {
                var divElement = document.querySelector('.e-dialog');
                divElement.dispatchEvent(keyboardEventArgs);
                var keyEvent = new KeyboardEvent("keydown", { key: "Entre" ,code:"Entre"});
                divElement.dispatchEvent(keyEvent);
                rteObj.inputElement.dispatchEvent(keyboardEventArgs);
                setTimeout(() => {
                    const expectedElem: string = '<p class="focusNode"><br></p><div class="focusNode"><br></div>';
                    expect(rteObj.inputElement.innerHTML === expectedElem).toBe(true);
                    done();
                }, 100);
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
            detach(element);
        });
    });

    describe('EJ2-59705 - Console error thrown when pressing enter key at firefox browser', () => {
        let defaultUserAgent= navigator.userAgent;
        let fireFox: string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0";
        let rteObj: RichTextEditor;
        beforeAll(() => {
            Browser.userAgent = fireFox;
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'P',
                value: `<p class="focusNode"><br></p>`
            });
        });

        it('Console error thrown when pressing enter key at firefox browser', (done: DoneFn)=> {
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.focusNode');
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 0, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                const expectedElem: string = '<p class="focusNode"><br></p><p class="focusNode"><br></p><p class="focusNode"><br></p>';
                expect(rteObj.inputElement.innerHTML === expectedElem).toBe(true);
                done();
            }, 100);
        });

    afterAll(() => {
        destroy(rteObj);
        Browser.userAgent =defaultUserAgent;
    });
    });

    describe('Bug 998779: Multiple dividers added when pressing Enter after pasting from Word', () => {
        let defaultUserAgent = navigator.userAgent;
        let fireFox: string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0";
        let rteObj: RichTextEditor;
        beforeAll(() => {
            Browser.userAgent = fireFox;
            rteObj = renderRTE({
                enterKey: 'P',
                value: `<div style="border-top: none; border-right: none; border-left: none; border-bottom: 1.5pt solid rgb(204, 204, 204); padding: 0in 0in 1pt;"> <p style="margin: 0in 0in 8pt; line-height: 115%; font-size: 12pt; font-family: Aptos, sans-serif; border: none; padding: 0in;">&nbsp;</p> </div><p><br></p><p><br></p>`
            });
        });
        it('Enterkey should not add styles to the new p tag', function (): void {
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.childNodes[1];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 0, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            expect(rteObj.inputElement.innerHTML === `<div style="border-top: none; border-right: none; border-left: none; border-bottom: 1.5pt solid rgb(204, 204, 204); padding: 0in 0in 1pt;"><p style="margin: 0in 0in 8pt; line-height: 115%; font-size: 12pt; font-family: Aptos, sans-serif; border: none; padding: 0in;">&nbsp;</p></div><p><br></p><p><br></p><p><br></p><p><br></p>`).toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
            Browser.userAgent = defaultUserAgent;
        });
    });

    describe('Bug 998779: Multiple dividers added when pressing Enter after pasting from Word', () => {
        let defaultUserAgent = navigator.userAgent;
        let fireFox: string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0";
        let rteObj: RichTextEditor;
        beforeAll(() => {
            Browser.userAgent = fireFox;
            rteObj = renderRTE({
                enterKey: 'P',
                value: `<div style="border-top: none; border-right: none; border-left: none; border-bottom: 1.5pt solid rgb(204, 204, 204); padding: 0in 0in 1pt;"> <p style="margin: 0in 0in 8pt; line-height: 115%; font-size: 12pt; font-family: Aptos, sans-serif; border: none; padding: 0in;">&nbsp;</p> </div><p><br></p><p><br></p>`
            });
        });
        it('Enterkey should not add styles to the new p tag', function (): void {
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.childNodes[1];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 0, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            expect(rteObj.inputElement.innerHTML === `<div style="border-top: none; border-right: none; border-left: none; border-bottom: 1.5pt solid rgb(204, 204, 204); padding: 0in 0in 1pt;"><p style="margin: 0in 0in 8pt; line-height: 115%; font-size: 12pt; font-family: Aptos, sans-serif; border: none; padding: 0in;">&nbsp;</p></div><p><br></p><p><br></p><p><br></p><p><br></p>`).toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
            Browser.userAgent = defaultUserAgent;
        });
    });

    describe('927517: Link functionality breaks with enter action in Firefox browser.', () => {
        let defaultUserAgent= navigator.userAgent;
        let fireFox: string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0";
        let rteObj: RichTextEditor;
        beforeAll(() => {
            Browser.userAgent = fireFox;
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'P',
                value: `<p><a class="e-rte-anchor" href="http://d" title="http://d" target="_blank" aria-label="Open in new window">link</a>   3</p>`
            });
        });

        it('Link functionality breaks with enter action in Firefox browser', (done:DoneFn)=> {
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('p');
            new NodeSelection().setSelectionText(document, startNode.childNodes[1], startNode.childNodes[1], 1, 1);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML === '<p><a class="e-rte-anchor" href="http://d" title="http://d" target="_blank" aria-label="Open in new window">link</a> </p><p>3</p>').toBe(true);
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
            Browser.userAgent =defaultUserAgent;
        });
    });

    describe('EJ2-62544 - Enter key press after pressing backspace key on the start of the first list removes the previous content', () => {
        let defaultUserAgent= navigator.userAgent;
        let fireFox: string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0";
        let rteObj: RichTextEditor;
        beforeAll(() => {
            Browser.userAgent = fireFox;
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'P',
                value: `<p class="focusNode"><strong>hello</strong>﻿List 1</p><ol><li>List 2</li><li>List 3﻿<br></li></ol>`
            });
        });

        it('Enter key press after pressing backspace key on the start of the first list removes the previous content', (done:DoneFn)=> {
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.focusNode').childNodes[1];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 0, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                const expectedElem: string = '<p class="focusNode"><strong>hello</strong></p><p class="focusNode">﻿List 1</p><ol><li>List 2</li><li>List 3﻿<br></li></ol>';
                expect(rteObj.inputElement.innerHTML === expectedElem).toBe(true);
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
            Browser.userAgent =defaultUserAgent;
        });
    });

    describe('EJ2-57587 - Many BR are inserted after enter key after the shift + enter is pressed', () => {
        let defaultUserAgent= navigator.userAgent;
        let fireFox: string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0";
        let rteObj: RichTextEditor;
        beforeAll(() => {
            Browser.userAgent = fireFox;
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'P',
                value: `<p class="focusNode">Content 1<br></p>`
            });
        });

        it('Many BR are inserted after enter key after the shift + enter is pressed', (done:DoneFn)=> {
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.focusNode');
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode.childNodes[0], startNode.childNodes[0], 9, 9);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.querySelectorAll('p')[1].querySelectorAll('br').length === 1).toBe(true);
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
            Browser.userAgent =defaultUserAgent;
        });
    });

    describe('Bug 911192: Error thrown when pressing the Enter key after placing the cursor on an <hr> tag in the Rich Text Editor', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>Testing</p>'
            });
        });

        afterAll(() => {
            destroy(rteObj);
        });
        it('check insertHorizontalRule Executecommand for one line text while cursor placed at end of the line and press enter', (done: DoneFn) => {
            const nodetext: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext.childNodes[0], nodetext.childNodes[0].textContent.length);
            rteObj.executeCommand('insertHorizontalRule');
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<p>Testing</p><hr><p><br></p><p><br></p>');
                done();
            }, 100);
        });
        it('check insertHorizontalRule Executecommand for one line text while cursor placed at start of the line and press enter', (done: DoneFn) => {
            rteObj.inputElement.innerHTML = '<p>Testing</p>';
            const nodetext: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext.childNodes[0], 0);
            rteObj.executeCommand('insertHorizontalRule');
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<hr><p><br></p><p>Testing</p>');
                done();
            }, 100);
        });
        it('check insertHorizontalRule Executecommand for one line text while cursor placed at middle of the line and press enter', (done: DoneFn) => {
            rteObj.inputElement.innerHTML = '<p>Testing</p>';
            const nodetext: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext.childNodes[0], 4);
            rteObj.executeCommand('insertHorizontalRule');
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<p>Test</p><hr><p><br></p><p>ing</p>');
                done();
            }, 100);
        });
    });

    describe('Bug 917790: Link disappears on pressing "Enter" with CSS "white-space: pre-wrap" applied in Rich text editor', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p> <a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank">www.google.com</a> </p>'
            });
        });

        afterAll(() => {
            destroy(rteObj);
        });
        it('Check the link availability after pressing enter key at the end after space', (done: DoneFn) => {
            const whiteSpace: HTMLElement = rteObj.element.querySelector('.e-content') as HTMLElement;
            whiteSpace.style.whiteSpace = 'pre-wrap';
            rteObj.inputElement.innerHTML = '<p> <a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank">www.google.com</a> </p>';
            const nodetext: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext.childNodes[2], nodetext.childNodes[2].textContent.length);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.textContent.includes('www.google.com')).toBe(true);
                done();
            }, 100);
        });

        it('Check the link availability after pressing enter key at the end before space', (done: DoneFn) => {
            const whiteSpace: HTMLElement = rteObj.element.querySelector('.e-content') as HTMLElement;
            whiteSpace.style.whiteSpace = 'pre-wrap';
            rteObj.inputElement.innerHTML = '<p> <a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank">www.google.com</a> </p>';
            const nodetext: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext.childNodes[2], nodetext.childNodes[2].textContent.length-1);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.textContent.includes('www.google.com')).toBe(true);
                done();
            }, 100);
        });

        it('Check the link availability after pressing enter key at the start after space', (done: DoneFn) => {
            const whiteSpace: HTMLElement = rteObj.element.querySelector('.e-content') as HTMLElement;
            whiteSpace.style.whiteSpace = 'pre-wrap';
            rteObj.inputElement.innerHTML = '<p> <a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank">www.google.com</a> </p>';
            const nodetext: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext.childNodes[0], 1);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.textContent.includes('www.google.com')).toBe(true);
                done();
            }, 100);
        });

        it('Check the link availability after pressing enter key at the start before space', (done: DoneFn) => {
            const whiteSpace: HTMLElement = rteObj.element.querySelector('.e-content') as HTMLElement;
            whiteSpace.style.whiteSpace = 'pre-wrap';
            rteObj.inputElement.innerHTML = '<p> <a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank">www.google.com</a> </p>';
            const nodetext: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext.childNodes[0], 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.textContent.includes('www.google.com')).toBe(true);
                done();
            }, 100);
        });
    });

    describe('Bug 925863: When pressing Enter key after the link when text-wrap is applied, it removes the content in the editor', () => {
        let rteObj: RichTextEditor;
        let style: HTMLStyleElement;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p> <a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank">www.google.com</a> </p>'
            });
            style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = `
            .e-rte-content {
                white-space: pre-wrap;
                text-wrap: nowrap;
            }
        `;
            document.head.appendChild(style);
        });

    afterAll(() => {
        destroy(rteObj);
        detach(style);
    });
    it('Check the link availability after pressing enter key at the end after space', () => {
        rteObj.inputElement.innerHTML = '<p> <a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank">www.google.com</a> </p>';
        const nodetext: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext.childNodes[2], nodetext.childNodes[2].textContent.length);
        rteObj.inputElement.dispatchEvent(keyboardEventArgs);
        expect(rteObj.inputElement.textContent.includes('www.google.com')).toBe(true);
    });

    it('Check the link availability after pressing enter key at the end before space', () => {
        rteObj.inputElement.innerHTML = '<p> <a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank">www.google.com</a> </p>';
        const nodetext: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext.childNodes[2], nodetext.childNodes[2].textContent.length - 1);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.textContent.includes('www.google.com')).toBe(true);
    });
        it('Check the link availability after pressing enter key at the end before space', (done: DoneFn) => {
            rteObj.inputElement.innerHTML = '<p> <a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank">www.google.com</a> </p>';
            const nodetext: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext.childNodes[2], nodetext.childNodes[2].textContent.length - 1);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.textContent.includes('www.google.com')).toBe(true);
                done();
            }, 100);
        });

        it('Check the link availability after pressing enter key at the start after space', (done: DoneFn) => {
            rteObj.value = '<p> <a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank">www.google.com</a> </p>';
            const nodetext: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext.childNodes[0], 1);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.textContent.includes('www.google.com')).toBe(true);
                done();
            }, 100);
        });

        it('Check the link availability after pressing enter key at the start before space', (done: DoneFn) => {
            rteObj.value = '<p> <a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank">www.google.com</a> </p>';
            const nodetext: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext.childNodes[0], 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.textContent.includes('www.google.com')).toBe(true);
                done();
            }, 100);
        });
    });

    describe('When P configured - only image in the editor content', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let curDocument: Document;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                value: '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"> </p>'
            });
            rteEle = rteObj.element;
            curDocument = rteObj.contentModule.getDocument();
        });

        it('Press enter when cursor is after the image', (done: DoneFn) => {
            const startNode: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 1, 1);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                const expectedElem: string = '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p><p><br></p>';
                expect(rteObj.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 100);
        });

        it('Press enter when cursor is placed before the image', (done: DoneFn) => {
            rteObj.value = '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"> </p>';
            rteObj.dataBind();
            const startNode: any = rteObj.inputElement.childNodes[0].childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 0, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                const expectedElem: string = '<p><br></p><p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>';
                expect(rteObj.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 100);
        });

        it('When image is loaded as initial value and press enter after the image', (done: DoneFn) => {
            rteObj.value = '<img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;">';
            rteObj.inputElement.innerHTML = '<img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;">';
            rteObj.dataBind();
            const startNode: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 1, 1);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p><p><br></p>');
                done();
            }, 100);
        });

        it('When image is loaded as initial value and press enter before the image', (done: DoneFn) => {
            rteObj.value = '<img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;">';
            rteObj.inputElement.innerHTML = '<img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;">';
            rteObj.dataBind();
            const startNode: any = rteObj.inputElement.childNodes[0].childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 0, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                const expectedElem: string = '<p><br></p><p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>';
                expect(rteObj.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Bug 937059: Pressing Enter or Shift+Enter Removes Images in the Rich Text Editor', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let curDocument: Document;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                value: '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>'
            });
            rteEle = rteObj.element;
            curDocument = rteObj.contentModule.getDocument();
        });
        it('Press enter when cursor is after the image', (done: DoneFn) => {
            const startNode: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 1, 1);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p><p><br></p>');
                done();
            }, 100);
        });
        it('Press enter when cursor is before the image', (done: DoneFn) => {
            rteObj.value = '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>';
            rteObj.inputElement.innerHTML = '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>';
            rteObj.dataBind();
            const startNode: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 0, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<p><br></p><p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>');
                done();
            }, 100);
        });
        it('Press enter when selection has the image', (done: DoneFn) => {
            rteObj.value = '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>';
            rteObj.inputElement.innerHTML = '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>';
            rteObj.dataBind();
            const startNode: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 0, 1);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                const expectedElem: string = '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p><p><br></p>';
                expect(rteObj.inputElement.innerHTML === expectedElem).toBe(true);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Enter key support - Changing both APIs when content is empty and pressing enter ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'P'
            });
        });

        it('Changing both APIs when content is empty and pressing enter', (done: DoneFn) => {
            rteObj.enterKey = 'DIV';
            rteObj.dataBind();
            rteObj.focusIn();
            rteObj.shiftEnterKey = 'P';
            rteObj.dataBind();
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement;
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 0, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<div><br></div><div><br></div>');
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-54630 - Enter Removes the first line issue', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'P',
                value: `<p class="focusNode">The Rich Te<br>xt Editor content</p>`
            });
        });

        it('When shift enter is pressed at the middle and then pressing enter at the start of the second line', (done: DoneFn) => {
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.focusNode');
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode.childNodes[2], startNode.childNodes[2], 0, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.querySelectorAll('p').length === 2).toBe(true);
                const expectedElem: string = '<p class="focusNode">The Rich Te<br></p><p class="focusNode">xt Editor content</p>';
                expect(rteObj.inputElement.innerHTML === expectedElem).toBe(true);
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('CR Issue - Paste some content and then press enter twice at the start(top) ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'P',
                value: `<p><span style="box-sizing: border-box; font-size: 14.6667px; letter-spacing: 0.25px; font-family: &quot;Segoe UI&quot;, sans-serif; color: rgb(32, 31, 30); border: 1pt none windowtext; padding: 0in;"><span class="focusNode" style="box-sizing: border-box; border-style: initial;">We are able to reproduce the issue from our end and we have considered&nbsp;</span><span style="box-sizing: border-box; font-weight: 700;"><span style="box-sizing: border-box; border-style: initial;">“</span></span></span><span style="box-sizing: border-box; font-weight: 700; color: rgb(17, 17, 17); font-family: Calibri, sans-serif; font-size: 14.6667px; letter-spacing: 0.25px;"><span style="box-sizing: border-box; font-family: &quot;Segoe UI&quot;, sans-serif; color: black;">Page scrolls automatically when press enter key inside the editor</span></span><span style="box-sizing: border-box; font-weight: 700; color: rgb(17, 17, 17); font-family: Calibri, sans-serif; font-size: 14.6667px; letter-spacing: 0.25px;"><span style="box-sizing: border-box; font-family: &quot;Segoe UI&quot;, sans-serif; color: rgb(32, 31, 30); border: 1pt none windowtext; padding: 0in;">”</span><br style="box-sizing: border-box;"></span><span style="box-sizing: border-box; font-size: 14.6667px; letter-spacing: 0.25px; font-family: &quot;Segoe UI&quot;, sans-serif; color: rgb(32, 31, 30); border: 1pt none windowtext; padding: 0in;"><span style="box-sizing: border-box; border-style: initial;">as a bug from our end, and logged the report for the same and it will be included in our patch release on&nbsp;<span style="box-sizing: border-box; font-weight: 700;">12<span style="box-sizing: border-box; position: relative; font-size: 11px; line-height: 0; vertical-align: baseline; top: -0.5em;">th</span>&nbsp;October 2021.</span></span></span><br></p>`
            });
        });

        it('Paste some content and then press enter twice at the start(top)', (done: DoneFn) => {
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.focusNode');
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode.childNodes[0], startNode.childNodes[0], 0, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.querySelectorAll('p').length === 2).toBe(true);
                rteObj.inputElement.dispatchEvent(keyboardEventArgs);
                setTimeout(() => {
                    expect(rteObj.inputElement.querySelectorAll('p').length === 3).toBe(true);
                    done();
                }, 100);
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-55453 - New P tag not created when enter press ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'P',
                value: `<p class="focusNode">\n    The Rich Text Editor is a WYSIWYG ('what you see is what you get') editor useful to create and edit content and return the valid\n    <a href=\"https://blazor.syncfusion.com/documentation/rich-text-editor/editor-modes/#html-editor\">HTML markup</a> or\n    <a href=\"https://blazor.syncfusion.com/documentation/rich-text-editor/editor-modes/#markdown-editor\">markdown</a> of the content     \n</p><p><b>Toolbar</b>`
            });
        });

        it('Enter Key press two times creates one P tag and then moves the cursor to next line instead of the new P tag creation', (done: DoneFn) => {
            rteObj.dataBind();
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.focusNode');
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode.lastChild, startNode.lastChild, startNode.lastChild.textContent.length, startNode.lastChild.textContent.length);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.querySelectorAll('p').length === 3).toBe(true);
                rteObj.inputElement.dispatchEvent(keyboardEventArgs);
                setTimeout(() => {
                    expect(rteObj.inputElement.querySelectorAll('p').length === 4).toBe(true);
                    done();
                }, 100);
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Table Enter Key Testing', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'P',
                value: `<p>RTE Content</p><p>RTE Content</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="focusNode" style="width: 33.3333%;"><p class=''>RTE Content</p></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>`
            });
        });

        it('Enter Key testing in table when P is configured and P content is inside', (done: DoneFn) => {
            rteObj.value = '<p>RTE Content</p><p>RTE Content</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><p class="focusNode">RTE Content</p><p>test</p></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>';
            rteObj.inputElement.innerHTML = '<p>RTE Content</p><p>RTE Content</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><p class="focusNode">RTE Content</p><p>test</p></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>';
            rteObj.dataBind();
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.focusNode');
            const sel: void = new NodeSelection().setCursorPoint(
                document, startNode.childNodes[0], 11);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.querySelector('.focusNode').nextElementSibling.tagName === 'P').toBe(true);
                done();
            }, 100);
        });

        it('Enter Key testing in table when DIV is configured and P content is inside', (done: DoneFn) => {
            rteObj.enterKey = 'DIV';
            rteObj.value = '<p>RTE Content</p><p>RTE Content</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><p class="focusNode">RTE Content</p><p>test</p></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>';
            rteObj.inputElement.innerHTML = '<p>RTE Content</p><p>RTE Content</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><p class="focusNode">RTE Content</p><p>test</p></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>';
            rteObj.dataBind();
            const startNode: any = rteObj.inputElement.querySelector('.focusNode');
            const sel: void = new NodeSelection().setCursorPoint(
                document, startNode.childNodes[0], 11);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.querySelector('.focusNode').nextElementSibling.tagName === 'DIV').toBe(true);
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-54662 - Insert HTML after enter when cursor is placed before the P tag ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'P',
                value: `<p class="focusNode">Sample</p>`
            });
        });

        it('Insert HTML after enter when cursor is placed before the P tag', (done: DoneFn) => {
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.focusNode');
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode.childNodes[0], startNode.childNodes[0],
                startNode.childNodes[0].textContent.length, startNode.childNodes[0].textContent.length);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                (<any>rteObj).focusIn();
                (<any>rteObj).executeCommand(
                'insertHTML',
                `<p class="secondFocus">Sehr geehrte Frau Leider erreiche ich Sie nicht telefonisch. Wie mit Ihrer Assistentin telefonisch besprochen, sende ich Ihnen mein Anliegen per Email.</p>`);
                const startNode2: any = rteObj.inputElement.querySelector('.secondFocus');
                const sel2: void = new NodeSelection().setSelectionText(
                    document, startNode2.childNodes[0], startNode2.childNodes[0], 0, 0);
                rteObj.inputElement.dispatchEvent(keyboardEventArgs);
                setTimeout(() => {
                    expect(rteObj.getRange().startContainer.parentElement.classList.contains('secondFocus')).toBe(true)
                    done();
                }, 100);
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-55294 - Enter Key press at the start of the content when content have space in HTML ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'P',
                value: `<p class='focusNode'>\n    The Rich Text Editor is a WYSIWYG ('what you see is what you get') editor useful to create and edit content and return the valid\n    <a href=\"https://blazor.syncfusion.com/documentation/rich-text-editor/editor-modes/#html-editor\">HTML markup</a> or\n    <a href=\"https://blazor.syncfusion.com/documentation/rich-text-editor/editor-modes/#markdown-editor\">markdown</a> of the content\n</p>`
            });
        });

        it('Enter Key press at the start of the content when content have space in HTML', (done: DoneFn) => {
            rteObj.dataBind();
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.focusNode');
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode.childNodes[0], startNode.childNodes[0], 0, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.querySelectorAll('p').length === 2).toBe(true);
                expect(rteObj.inputElement.querySelectorAll('p')[0].querySelectorAll('br').length === 1).toBe(true);
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-54628 - Enter Key press read only mode', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                readonly: true,
                enterKey: 'P',
                value: `<p class='focusNode'>The Rich Text Editor</p>`
            });
        });

        it('Enter Key press read only mode', (done: DoneFn) => {
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.focusNode');
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode.childNodes[0], startNode.childNodes[0], 3, 3);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.querySelectorAll('p').length === 1).toBe(true);
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('BLAZ-18839 - Enter Key press after link make the first char in the next line as link when typing', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'P',
                value: `<p>RTE&nbsp;<a class="e-rte-anchor focusNode" href="http://Link" title="Link" target="_blank">Link</a></p>`
            });
        });

        it('Enter Key press after link make the first char in the next line as link when typing', (done: DoneFn) =>{
            rteObj.dataBind();
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.focusNode');
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode.childNodes[0], startNode.childNodes[0], 4, 4);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.querySelectorAll('p')[1].querySelectorAll('a').length === 0).toBe(true);
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-59670 - Enter Key press at the start of the image with caption', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'P',
                value: `<p class="focusNode"><span class="e-img-caption-container e-img-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><img src="blob:null/789e321d-7734-445f-831e-d62dc21a3ccf" class="e-rte-image e-resize" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"><span class="e-img-caption-text" contenteditable="true">Caption</span></span></span> </p>`
            });
        });

        it('EJ2-59670 - Enter Key press at the start of the image with caption', (done: DoneFn) => {
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.focusNode');
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 0, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.element.querySelectorAll('img').length === 1).toBe(true);
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-62208 - Enter Key press when the content is heading', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'P',
                value: `<h1 class="focusNode">Heading﻿﻿<br></h1>`
            });
        });

        it('Enter Key press at the start of the heading', (done: DoneFn) => {
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.focusNode').childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 0, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.element.querySelectorAll('h1').length === 2).toBe(true);
                done();
            }, 100);
        });

        it('Enter Key press at the middle of the heading', (done: DoneFn) => {
            rteObj.value = `<h1 class="focusNode">Heading﻿﻿<br></h1>`;
            rteObj.inputElement.innerHTML = `<h1 class="focusNode">Heading﻿﻿<br></h1>`;
            rteObj.dataBind();
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.focusNode').childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 4, 4);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML === '<h1 class="focusNode">Head</h1><h1 class="focusNode">ing﻿﻿<br></h1>').toBe(true);
                done();
            }, 100);
        });

        it('Enter Key press at the end of the heading', (done: DoneFn) => {
            rteObj.value = `<h1 class="focusNode">Heading1&#xFEFF;&#xFEFF;<br></h1>`;
            rteObj.inputElement.innerHTML = `<h1>Heading1&#xFEFF;&#xFEFF;<br></h1>`;
            rteObj.dataBind();
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.focusNode').childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 8, 8);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML === '<h1 class="focusNode">Heading1</h1><h1 class="focusNode">﻿﻿<br></h1>').toBe(true);
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-62206 - Enter Key press at the start of the line with multiple format', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'P',
                value: `<p><strong>&ZeroWidthSpace;<em>&ZeroWidthSpace;<span style="text-decoration: underline;">&ZeroWidthSpace;<span style="text-decoration: line-through;">&ZeroWidthSpace;<span style="background-color: rgb(255, 255, 0);" class="focusNode">&ZeroWidthSpace;d</span></span></span></em></strong></p>`
            });
        });

        it('EJ2-62206 - typing come content to remove the non zero width space', (done: DoneFn) => {
            rteObj.focusIn();
            let keyboardEventArgsLetter = {
                preventDefault: function () { },
                altKey: false,
                ctrlKey: false,
                shiftKey: false,
                char: '',
                key: '',
                charCode: 65,
                keyCode: 65,
                which: 65,
                code: 'A',
                action: 'a',
                type: 'keyup'
            };
            const startNode: any = rteObj.inputElement.querySelector('.focusNode');
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode.childNodes[0], startNode.childNodes[0], 2, 2);
            expect(rteObj.inputElement.innerHTML.length === 215).toBe(true);
            (<any>rteObj).keyUp(keyboardEventArgsLetter);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML.length === 210).toBe(true);
                done();
            }, 100);
        });

        it('EJ2-62206 - typing come content after pressing enter on empty multiple format first line', (done: DoneFn) => {
            rteObj.value = `<p><strong>&ZeroWidthSpace;<em>&ZeroWidthSpace;<span style="text-decoration: underline;">&ZeroWidthSpace;<span style="text-decoration: line-through;">&ZeroWidthSpace;<span style="background-color: rgb(255, 255, 0);">&ZeroWidthSpace;</span></span></span></em></strong></p><p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span class="focusNode" style="background-color: rgb(255, 255, 0);"><br></span></span></span></em></strong></p>`;
            rteObj.inputElement.innerHTML = `<p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);" class="focusNode">Hello</span></span></span></em></strong></p>`;
            rteObj.dataBind();
            rteObj.focusIn();
            let keyboardEventArgsLetter = {
                preventDefault: function () { },
                altKey: false,
                ctrlKey: false,
                shiftKey: false,
                char: '',
                key: '',
                charCode: 65,
                keyCode: 65,
                which: 65,
                code: 'A',
                action: 'a',
                type: 'keyup'
            };
            const startNode: any = rteObj.inputElement.querySelector('.focusNode');
            let textNode = document.createTextNode('');
            startNode.appendChild(textNode);
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 0, 0);
            (<any>rteObj).keyUp(keyboardEventArgsLetter);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML === `<p><strong>​<em>​<span style="text-decoration: underline;">​<span style="text-decoration: line-through;">​<span style="background-color: rgb(255, 255, 0);">​</span></span></span></em></strong></p><p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span class="focusNode" style="background-color: rgb(255, 255, 0);"><br></span></span></span></em></strong></p>`).toBe(true);
                done();
            }, 100);
        });

        it('EJ2-62206 - pressing enter at the start of the multiple format first line ', (done: DoneFn) => {
            rteObj.value = `<p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);" class="focusNode">Hello</span></span></span></em></strong></p>`;
            rteObj.inputElement.innerHTML = `<p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);" class="focusNode">Hello</span></span></span></em></strong></p>`;
            rteObj.dataBind();
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.focusNode').childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 0, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                const expectedElem: string = '<p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);" class="focusNode"><br></span></span></span></em></strong></p><p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);" class="focusNode">Hello</span></span></span></em></strong></p>';
                expect(rteObj.inputElement.innerHTML === expectedElem).toBe(true);
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Enter Key press just outside the table at the start', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'P',
                value: `<table class="e-rte-table focusNode" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
        });

        it('EJ2-62210 - Enter Key press just outside the table at the start when P is configured', (done: DoneFn) => {
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.focusNode');
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 0, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML === `<p><br></p><table class="e-rte-table focusNode" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>`).toBe(true);
                done();
            }, 100);
        });
        
        it('EJ2-62200 - Enter Key press just outside the table at the end of the table when P is configured', (done: DoneFn) => {
            rteObj.enterKey = 'P';
            rteObj.value = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>`;
            rteObj.inputElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>`;
            rteObj.dataBind();
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement;
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 1, 1);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML === `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p><br></p>`).toBe(true);
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe( 'EJ2-62198 Place holder displayed again when focusing out after pressing enter key on empty editor', () => {
        let rteObj: RichTextEditor;
        beforeEach( () => {
            rteObj = renderRTE( {
                height: '200px',
                enterKey: "P",
                value: '<p class="focusNode"><br></p>',
                placeholder: 'Enter Key Support Sample'
            } );
        } );
        afterEach( () => {
            destroy( rteObj );
        } );
        it( 'After Render Placeholder span element style.display should be block', () => {
            rteObj.focusIn();
            let spanElemement: HTMLElement = document.querySelector( '.e-rte-placeholder' );
            expect( spanElemement.classList.contains('e-placeholder-enabled') ).toBe( true );
            rteObj.focusOut();
            expect( spanElemement.classList.contains('e-placeholder-enabled') ).toBe( true );
        } );
        it( 'After One Enter key Press Placeholder span element style.display should be none', () => {
            rteObj.dataBind();
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector( '.focusNode' );
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 0, 0 );
           rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            let spanElemement: HTMLElement = document.querySelector( '.e-rte-placeholder' );
            expect( spanElemement.classList.contains('e-placeholder-enabled') ).toBe( false );
            rteObj.focusOut();
            expect( spanElemement.classList.contains('e-placeholder-enabled') ).toBe( false );
        } );
    } );

    describe('Enter Key press after pressing shift+enter in a line', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'P',
                value: `<p>line 1</p><p>line 2</p><p class="focusNode">line 3<br><br></p>`
            });
        });

        it('EJ2-62211 - Enter Key press after pressing shift+enter in a line', (done: DoneFn) => {
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.focusNode').childNodes[2];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 0, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                const expectedElem: string = '<p>line 1</p><p>line 2</p><p class="focusNode">line 3<br><br></p><p class="focusNode"><br></p>';
                expect(rteObj.inputElement.innerHTML === expectedElem).toBe(true);
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Enter Key press multiple whole lines', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'P',
                value: `<p class="startNode">Line 1</p><p>Line 2</p><p class="endNode">Line 3</p><p>Line 4</p>`
            });
        });

        it('EJ2-62202 - Enter Key press multiple line select as a whole', (done: DoneFn) => {
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.startNode').childNodes[0];
            const endNode: any = rteObj.inputElement.querySelector('.endNode').childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, endNode, 0, 6);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                const expectedElem: string = '<p class="endNode"><br></p><p class="endNode"><br></p><p>Line 4</p>';
                expect(rteObj.inputElement.innerHTML === expectedElem).toBe(true);
                done();
            }, 100);
        });

        it(' EJ2-62202 - Enter Key press multiple line select as a whole when multiple formats are applied', (done: DoneFn) => {
            rteObj.value = `<p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);" class="startNode">Line 1</span></span></span></em></strong></p><p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);">Line 2</span></span></span></em></strong></p><p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);" class="endNode">Line 3</span></span></span></em></strong></p><p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);">Line 4</span></span></span></em></strong></p>`;
            rteObj.inputElement.innerHTML = `<p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);" class="startNode">Line 1</span></span></span></em></strong></p><p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);">Line 2</span></span></span></em></strong></p><p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);" class="endNode">Line 3</span></span></span></em></strong></p><p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);">Line 4</span></span></span></em></strong></p>`;
            rteObj.dataBind();
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.startNode').childNodes[0];
            const endNode: any = rteObj.inputElement.querySelector('.endNode').childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, endNode, 0, 6);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML === `<p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);" class="endNode"><br></span></span></span></em></strong></p><p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);" class="endNode"><br></span></span></span></em></strong></p><p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);">Line 4</span></span></span></em></strong></p>`).toBe(true);
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('BLAZ-25076 - Enter Key press after after the video element', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'P',
                value: `<p class="focusNode">He<span class="e-video-wrap" contenteditable="false" title="movie.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="blob:null/abc6ccd2-601f-47c2-880d-110d93148793" type="video/mp4"></video></span><br>llo</p>`
            });
        });

        it('BLAZ-25076 - Enter Key press after after the video element', (done: DoneFn) => {
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.focusNode');
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 2, 2);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                const expectedElem: string = '<p class="focusNode">He<span class="e-video-wrap" contenteditable="false" title="movie.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="blob:null/abc6ccd2-601f-47c2-880d-110d93148793" type="video/mp4"></video></span></p><p class="focusNode"><br>llo</p>';
                expect(rteObj.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('BLAZ-25076 - Enter Key press after after the audio element', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'P',
                value: `<p class="focusNode">He<span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickelem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="blob:null/6d26d52f-18d7-4876-8fdf-2df84324842b" type="audio/mp3"></audio></span></span></p><p><br>llo</p>`
            });
        });

        it('BLAZ-25076 - Enter Key press after after the audio element', (done: DoneFn) => {
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.focusNode');
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 2, 2);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML === `<p class="focusNode">He<span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickelem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="blob:null/6d26d52f-18d7-4876-8fdf-2df84324842b" type="audio/mp3"></audio></span></span></p><p><br></p><p><br>llo</p>`).toBe(true);
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-63855 Table Enter Key Testing when frist element as inline element ', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'P',
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline e-resize e-img-focus" alt="icons8-delete-file-100.png" width="auto" height="auto" style="min-width: 0px; max-width: 1455px; min-height: 0px;"></td><td style="width: 33.3333%;" class=""><strong class="e-rte-strong-element">strong</strong></td><td style="width: 33.3333%;" class=""><span class="e-rte-span-element" style="font-size: 14pt;">span</span></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>`
            });
        });
        it('Enter Key testing in table when strong element in frist node of TD is configured', (done: DoneFn) => {
            rteObj.dataBind();
            const startNode: any = rteObj.inputElement.querySelector('.e-rte-image');
            const sel: void = new NodeSelection().setCursorPoint(document, startNode, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                const expectedElem: string = '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><p><br></p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline e-resize" alt="icons8-delete-file-100.png" width="auto" height="auto" style="min-width: 0px; max-width: 1455px; min-height: 0px;"></td><td style="width: 33.3333%;" class=""><strong class="e-rte-strong-element">strong</strong></td><td style="width: 33.3333%;" class=""><span class="e-rte-span-element" style="font-size: 14pt;">span</span></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>';
                expect(rteObj.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 100);
        });
        afterEach(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-64636 Duplicate text is created when deleting different nodes and pressing enter', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE( {
                height: '200px',
                enterKey: "P",
                value: '<p>Hello</p><p><span style="background-color: unset; text-align: inherit;" class="focusNode">Syncfusion</span><br></p>',
            } );
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it( 'Duplicate text is created when deleting different nodes and pressing enter', (done: DoneFn) => {
            rteObj.dataBind();
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.childNodes[1].childNodes[0].childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(document, startNode, 0);
            let cursorElem: HTMLElement;
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                const expectedElem: string = '<p>Hello</p><p><span style="background-color: unset; text-align: inherit;" class="focusNode"><br></span></p><p><span style="background-color: unset; text-align: inherit;" class="focusNode">Syncfusion</span><br></p>';
                expect(rteObj.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 100);
        });
    });

    describe('EJ2-65987 - Image duplicated when pressing enter',() => {
        let rteObj: RichTextEditor;
        let innerHTML: string = `<p><br></p><p>&nbsp;<img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline" alt="RTEImage-Feather.png" width="auto" height="auto" style="min-width: 0px; max-width: 1455px; min-height: 0px;"> </p>`;
        beforeAll(() => {
            rteObj = renderRTE({
                value: innerHTML
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('check image duplicated when pressing enter',(done: DoneFn) => {
            (rteObj as any).inputElement.focus();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document,(rteObj as any).inputElement.childNodes[0],(rteObj as any).inputElement.childNodes[0], 0, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML===`<p><br></p><p><br></p><p>&nbsp;<img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline" alt="RTEImage-Feather.png" width="auto" height="auto" style="min-width: 0px; max-width: 1455px; min-height: 0px;"></p>`).toBe(true);
                done();
            }, 100);
        });
    });

    describe('EJ2-65633 - Enter key Press when audio and video is focused',() => {
        let rteObj: RichTextEditor;
        let innerHTML: string = `<p><b>Get started Quick Toolbar to click on an audio</b></p><p>By using the quick toolbar, users can replace, display, and delete the selected an audio.</p><p>
        <span class="e-audio-wrap" contenteditable="false"><span class="e-clickelem"><audio controls="" class="e-rte-audio e-audio-inline">
            <source src="https://assets.mixkit.co/sfx/preview/mixkit-rain-and-thunder-storm-2390.mp3" type="audio/mp3">
        </audio></span></span><br>
    </p><p>Rich Text Editor allows inserting video and audio from online sources as well as the local 
        computers where you want to insert a video and audio in your content.</p><p><b>Get started Quick Toolbar to click on a video</b></p><p>By using the quick toolbar, users can replace,
        align, display, dimension, and delete the selected a video.</p><p>
        <span class="e-video-wrap" contenteditable="false"><video controls="" class="e-rte-video e-video-inline">
            <source src="https://www.w3schools.com/tags/movie.mp4" type="video/mp4">
        </video></span><br>
    </p>`;
        beforeAll(() => {
            rteObj = renderRTE({
                value: innerHTML
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('audio focus and enter key press',(done: DoneFn) => {
            (rteObj as any).inputElement.focus();
            let startNode = (rteObj as any).inputElement.querySelector('.e-audio-wrap');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode, startNode, 0, 1);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                const expectedElem: string = '<p><b>Get started Quick Toolbar to click on an audio</b></p><p>By using the quick toolbar, users can replace, display, and delete the selected an audio.</p><p><span class="e-audio-wrap" contenteditable="false"><span class="e-clickelem"><audio controls="" class="e-rte-audio e-audio-inline"><source src="https://assets.mixkit.co/sfx/preview/mixkit-rain-and-thunder-storm-2390.mp3" type="audio/mp3"></audio></span></span><br></p><p><br></p><p>Rich Text Editor allows inserting video and audio from online sources as well as the local computers where you want to insert a video and audio in your content.</p><p><b>Get started Quick Toolbar to click on a video</b></p><p>By using the quick toolbar, users can replace, align, display, dimension, and delete the selected a video.</p><p><span class="e-video-wrap" contenteditable="false"><video controls="" class="e-rte-video e-video-inline"><source src="https://www.w3schools.com/tags/movie.mp4" type="video/mp4"></video></span><br></p>'
                expect(rteObj.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 100);
        });

        it('video focus and enter key press',(done: DoneFn) => {
            rteObj.value = `<p><b>Get started Quick Toolbar to click on an audio</b></p><p>By using the quick toolbar, users can replace, display, and delete the selected an audio.</p><p>
            <span class="e-audio-wrap" contenteditable="false"><span class="e-clickelem"><audio controls="" class="e-rte-audio e-audio-inline">
                <source src="https://assets.mixkit.co/sfx/preview/mixkit-rain-and-thunder-storm-2390.mp3" type="audio/mp3">
            </audio></span></span><br>
        </p><p>Rich Text Editor allows inserting video and audio from online sources as well as the local 
            computers where you want to insert a video and audio in your content.</p><p><b>Get started Quick Toolbar to click on a video</b></p><p>By using the quick toolbar, users can replace,
            align, display, dimension, and delete the selected a video.</p><p>
            <span class="e-video-wrap" contenteditable="false"><video controls="" class="e-rte-video e-video-inline">
                <source src="https://www.w3schools.com/tags/movie.mp4" type="video/mp4">
            </video></span><br></p>`;
            rteObj.dataBind();
            (rteObj as any).inputElement.focus();
            let startNode = (rteObj as any).inputElement.querySelector('.e-video-wrap');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode, startNode, 0, 1);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                const expectedElem: string = '<p><b>Get started Quick Toolbar to click on an audio</b></p><p>By using the quick toolbar, users can replace, display, and delete the selected an audio.</p><p><span class="e-audio-wrap" contenteditable="false"><span class="e-clickelem"><audio controls="" class="e-rte-audio e-audio-inline"><source src="https://assets.mixkit.co/sfx/preview/mixkit-rain-and-thunder-storm-2390.mp3" type="audio/mp3"></audio></span></span><br></p><p>Rich Text Editor allows inserting video and audio from online sources as well as the local computers where you want to insert a video and audio in your content.</p><p><b>Get started Quick Toolbar to click on a video</b></p><p>By using the quick toolbar, users can replace, align, display, dimension, and delete the selected a video.</p><p><span class="e-video-wrap" contenteditable="false"><video controls="" class="e-rte-video e-video-inline"><source src="https://www.w3schools.com/tags/movie.mp4" type="video/mp4"></video></span><br></p><p><br></p>';
                expect(rteObj.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 100);
        });

        it('audio dynamically inserted and focus and enter key press',(done: DoneFn) => {
            rteObj.value = `<p><b>Get started Quick Toolbar to click on an audio</b></p><p>By using the quick toolbar, users can replace, dis<span class="e-audio-wrap" contenteditable="false" title="mixkit-rain-and-thunder-storm-2390.mp3"><span class="e-clickelem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="blob:null/72bb961a-c785-4d4a-b94d-9b5701292c3b" type="audio/mp3"></audio></span></span><br>play, and delete the selected an audio</p><p>Rich Text Editor allows inserting video and audio from online sources as well as the local 
            computers where you want to insert a video and audio in your content.</p><p><b>Get started Quick Toolbar to click on a video</b></p><p>By using the quick toolbar, users can replace,
            align, display, dimension, and delete the selected a video.</p>`;
            rteObj.dataBind();
            (rteObj as any).inputElement.focus();
            let startNode = (rteObj as any).inputElement.querySelector('.e-audio-wrap');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode, startNode, 0, 1);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                const expectedElem: string = '<p><b>Get started Quick Toolbar to click on an audio</b></p><p>By using the quick toolbar, users can replace, dis<span class="e-audio-wrap" contenteditable="false" title="mixkit-rain-and-thunder-storm-2390.mp3"><span class="e-clickelem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="blob:null/72bb961a-c785-4d4a-b94d-9b5701292c3b" type="audio/mp3"></audio></span></span><br>play, and delete the selected an audio</p><p><br></p><p>Rich Text Editor allows inserting video and audio from online sources as well as the local computers where you want to insert a video and audio in your content.</p><p><b>Get started Quick Toolbar to click on a video</b></p><p>By using the quick toolbar, users can replace, align, display, dimension, and delete the selected a video.</p>';
                expect(rteObj.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 100);
        });

        it('video dynamically inserted and focus and enter key press',(done: DoneFn) => {
            rteObj.value = `<p><b>Get started Quick Toolbar to click on an audio</b></p><p>By using the quick toolbar, users can replace, display, and delete the selected an audio.</p><p>Rich Text Editor allows inserting video and audio from online sources as well as the local 
            computers where you want to insert a video and audio in your content.</p><p><b>Get started Quick Toolbar to click on a video</b></p><p>By using the quick toolbar, users can replace,
            al<span class="e-video-wrap" contenteditable="false" title="movie.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="blob:null/0f59173c-61bf-42d9-84e9-bb9560da2714" type="video/mp4"></video></span><br>ign, display, dimension, and delete the selected a video.</p>`;
            rteObj.dataBind();
            (rteObj as any).inputElement.focus();
            let startNode = (rteObj as any).inputElement.querySelector('.e-video-wrap');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode, startNode, 0, 1);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                const expectedElem: string = '<p><b>Get started Quick Toolbar to click on an audio</b></p><p>By using the quick toolbar, users can replace, display, and delete the selected an audio.</p><p>Rich Text Editor allows inserting video and audio from online sources as well as the local computers where you want to insert a video and audio in your content.</p><p><b>Get started Quick Toolbar to click on a video</b></p><p>By using the quick toolbar, users can replace, al<span class="e-video-wrap" contenteditable="false" title="movie.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="blob:null/0f59173c-61bf-42d9-84e9-bb9560da2714" type="video/mp4"></video></span><br>ign, display, dimension, and delete the selected a video.</p><p><br></p>';
                expect(rteObj.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 100);
        });
    });

    describe('Bug 970807: Video Element Gets Removed on Pressing Enter Key After Selection ', () => {
        let rteObj: RichTextEditor;
        let innerHTML: string = `<p>testing</p><span class="e-video-wrap" style="display: block;"><span class="e-video-clickelem"><iframe src="https://www.youtube.com/embed/H55jAgs61Ps" width="560" height="315" loading="lazy" allowfullscreen="" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" spellcheck="false" frameborder="0" class="e-rte-video e-video-center e-resize e-video-wrap"></iframe></span></span>`;
        beforeAll(() => {
            rteObj = renderRTE({
                value: innerHTML,
                enableHtmlSanitizer: false
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('video focus and enter key press', (done: DoneFn) => {
            (rteObj as any).inputElement.focus();
            let startNode = (rteObj as any).inputElement.querySelector('.e-video-wrap');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode, startNode, 0, 1);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                const expectedElem: string = '<p>testing</p><p><span class="e-video-wrap" style="display: block;"><span class="e-video-clickelem"><iframe src="https://www.youtube.com/embed/H55jAgs61Ps" width="560" height="315" loading="lazy" allowfullscreen="" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" spellcheck="false" frameborder="0" class="e-rte-video e-video-center e-resize e-video-wrap">&ZeroWidthSpace;</iframe></span></span></p><p><br></p>';
                expect(rteObj.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 100);
        });
        it('video dynamically inserted and focus and enter key press', (done: DoneFn) => {
            rteObj.value = `<p>testing</p><span class="e-video-wrap" style="display: block;"><span class="e-video-clickelem"><iframe src="https://www.youtube.com/embed/H55jAgs61Ps" width="560" height="315" loading="lazy" allowfullscreen="" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" spellcheck="false" frameborder="0" class="e-rte-video e-video-center e-resize e-video-wrap"></iframe></span></span>`;
            rteObj.dataBind();
            (rteObj as any).inputElement.focus();
            let startNode = (rteObj as any).inputElement.querySelector('.e-video-wrap');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode, startNode, 0, 1);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                const expectedElem: string = '<p>testing</p><p><span class="e-video-wrap" style="display: block;"><span class="e-video-clickelem"><iframe src="https://www.youtube.com/embed/H55jAgs61Ps" width="560" height="315" loading="lazy" allowfullscreen="" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" spellcheck="false" frameborder="0" class="e-rte-video e-video-center e-resize e-video-wrap">&ZeroWidthSpace;</iframe></span></span></p><p><br></p>';
                expect(rteObj.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 100);
        });
    });

    describe("EJ2-64561- When press the enter key while the cursor focused before video, the video gets duplicated", () => {
        let rteObj : RichTextEditor;
        beforeAll( () =>{
            rteObj = renderRTE({
                value : `<p><span class="e-video-wrap" contenteditable="false"><video controls="" class="e-rte-video e-video-inline"><source src="https://www.w3schools.com/tags/movie.mp4" type="video/mp4"></video></span><br></p>`
            });
        });
        afterAll( () => {
            destroy(rteObj);
        });
        it( 'Test for Enter key press before video' , (done: DoneFn) =>{
            rteObj.focusIn();
            let range: Range = new Range();
            const contentElem : HTMLElement = document.body.querySelector('.e-content');
            range.setStart( contentElem.firstElementChild,0 );
            range.setEnd( contentElem.firstElementChild,0 );
            rteObj.formatter.editorManager.nodeSelection.setRange(document, range);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                const corrrectElemString : string = `<p><br></p><p><span class="e-video-wrap" contenteditable="false"><video controls="" class="e-rte-video e-video-inline"><source src="https://www.w3schools.com/tags/movie.mp4" type="video/mp4"></video></span><br></p>`;
                expect(rteObj.inputElement.innerHTML === corrrectElemString ).toBe(true);
                done();
            }, 100);
        });
    });
    describe("EJ2-64561- When press the enter key while the cursor focused before video, the video gets duplicated", () => {
        let rteObj : RichTextEditor;
        beforeAll( () =>{
            rteObj = renderRTE({
                value : `<p><span class="e-audio-wrap" style="width:300px; margin:0 auto;" contenteditable="false"><span class="e-clickelem"><audio controls="" class="e-rte-audio e-audio-inline"><source src="https://assets.mixkit.co/sfx/preview/mixkit-rain-and-thunder-storm-2390.mp3" type="audio/mp3"></audio></span></span><br></p>`
            });
        });
        afterAll( () => {
            destroy(rteObj);
        });
        it(' Test for Enter key press before audio', (done: DoneFn) => {
            rteObj.focusIn();
            let range: Range = new Range();
            const contentElem : HTMLElement = document.body.querySelector('.e-content');
            range.setStart( contentElem.firstElementChild,0 );
            range.setEnd( contentElem.firstElementChild,0 );
            rteObj.formatter.editorManager.nodeSelection.setRange(document, range);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                const corrrectElemString : string = `<p><br></p><p><span class="e-audio-wrap" style="width:300px; margin:0 auto;" contenteditable="false"><span class="e-clickelem"><audio controls="" class="e-rte-audio e-audio-inline"><source src="https://assets.mixkit.co/sfx/preview/mixkit-rain-and-thunder-storm-2390.mp3" type="audio/mp3"></audio></span></span><br></p>`;
                expect(rteObj.inputElement.innerHTML === corrrectElemString ).toBe(true);
                done();
            }, 100);
        });
    });
    describe("EJ2-67119 - List item gets removed when press the enterkey in list second item", () => {
        let rteObj : RichTextEditor;
        beforeAll( () =>{
            rteObj = renderRTE({
                value : `<ol><li><span class="e-video-wrap" contenteditable="false"><video controls="" class="e-rte-video e-video-inline">
                <source src="https://www.w3schools.com/tags/movie.mp4" type="video/mp4">
            </video></span><br></li><li>﻿﻿<br></li></ol>`
            });
        });
        it(' check for Enter key press end of the list', (done: DoneFn) => {
            rteObj.focusIn();
            let range: Range = new Range();
            const contentElem : HTMLElement = rteObj.inputElement.querySelectorAll("ol")[0].childNodes[1] as HTMLElement;
            range.setStart( contentElem,0 );
            range.setEnd( contentElem,0 );
            rteObj.formatter.editorManager.nodeSelection.setRange(document, range);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                const corrrectElemString : string = `<ol><li><span class="e-video-wrap" contenteditable="false"><video controls="" class="e-rte-video e-video-inline"><source src="https://www.w3schools.com/tags/movie.mp4" type="video/mp4"></video></span><br></li></ol><p><br></p>`;
                expect(rteObj.inputElement.innerHTML === corrrectElemString ).toBe(true);
                done();
            }, 100);
        });
        afterAll( () => {
            destroy(rteObj);
        });
    });
    describe("EJ2-68925 -The enter key is not working properly with Lists when pasting from MS Word", () => {
        let rteObj : RichTextEditor;
        beforeAll( () =>{
            rteObj = renderRTE({
                value : `<p><span>Content.</span></p><ul>
                <li><span>Point 1</span></li>
                <li><span>point2</span></li>
                </ul>`
            });
        });
        it(' check for Enter key press end of the list', (done: DoneFn) => {
            rteObj.focusIn();
            let cursorElem: HTMLElement;
            cursorElem = rteObj.inputElement.querySelector('ul li:nth-child(2)');
            const sel: void = new NodeSelection().setCursorPoint(document,cursorElem, 1);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                const corrrectElemString : string = `LI`;
                expect(rteObj.inputElement.lastChild.childNodes[1].nodeName === corrrectElemString ).toBe(true);
                done();
            }, 100);
        });
        afterAll( () => {
            destroy(rteObj);
        });
    });

    describe('843688 - The Enter key press before the video duplicates the video', function () {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        
        var innerHTML: string = "<p><b>Description:</b></p><p>The Rich Text Editor.</p><p> <br></p><p><b>Functional</b></p>";
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video']
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Press enter key curser places before the embaded video', (done: Function) => {
            const startNode: any = rteObj.inputElement.childNodes[2];
            let sel: void = new NodeSelection().setSelectionText(document, startNode, startNode, 1, 1);
            (<HTMLElement>document.querySelector('.e-video')as HTMLElement).parentElement.parentElement.click()
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-embed-video-url') as HTMLInputElement).value = '<iframe width="560" height="315" src="https://www.youtube.com/embed/H661HyVGu7I?si=ROQf-Grd6u37RlX6" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
            (dialogEle.querySelector('.e-embed-video-url') as HTMLElement).dispatchEvent(new Event("input"));
            (<HTMLElement>document.querySelector('.e-insertVideo') as HTMLElement).click();
            setTimeout(() => {
                sel = new NodeSelection().setSelectionText(document, startNode, startNode, 0, 0);
                rteObj.inputElement.dispatchEvent(keyboardEventArgs);
                expect(document.querySelectorAll('.e-video-clickelem').length === 1).toBe(true);
                done();
            },500);
        });
    });

    describe('843688 - The Enter key press before the video duplicates the video', function () {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        
        var innerHTML: string = "<p><b>Description:</b></p><p>The Rich Text Editor.</p><p> <br></p><p><b>Functional</b></p>";
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video']
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Press enter key curser places before the embaded video', (done: Function) => {
            const startNode: any = rteObj.inputElement.childNodes[2];
            let sel: void = new NodeSelection().setSelectionText(document, startNode, startNode, 1, 1);
            (<HTMLElement>document.querySelector('.e-video')as HTMLElement).parentElement.parentElement.click()
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-embed-video-url') as HTMLInputElement).value = '<iframe width="560" height="315" src="https://www.youtube.com/embed/H661HyVGu7I?si=ROQf-Grd6u37RlX6" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
            (dialogEle.querySelector('.e-embed-video-url') as HTMLElement).dispatchEvent(new Event("input"));
            (<HTMLElement>document.querySelector('.e-insertVideo') as HTMLElement).click();
            setTimeout(() => {
                sel = new NodeSelection().setSelectionText(document, startNode, startNode, 0, 0);
                rteObj.inputElement.dispatchEvent(keyboardEventArgs);
                expect(document.querySelectorAll('.e-video-clickelem').length === 1).toBe(true);
                done();
            },500);
        });
    });

    describe('843688 - The Enter key press before the video duplicates the video', function () {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        
        var innerHTML: string = "<p><b>Description:</b></p><p>The Rich Text Editor.</p><p> <br></p><p><b>Functional</b></p>";
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video']
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Press enter key curser places before the embaded video', (done: Function) => {
            const startNode: any = rteObj.inputElement.childNodes[2];
            let sel: void = new NodeSelection().setSelectionText(document, startNode, startNode, 1, 1);
            (<HTMLElement>document.querySelector('.e-video')as HTMLElement).parentElement.parentElement.click()
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-embed-video-url') as HTMLInputElement).value = '<iframe width="560" height="315" src="https://www.youtube.com/embed/H661HyVGu7I?si=ROQf-Grd6u37RlX6" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
            (dialogEle.querySelector('.e-embed-video-url') as HTMLElement).dispatchEvent(new Event("input"));
            (<HTMLElement>document.querySelector('.e-insertVideo') as HTMLElement).click();
            setTimeout(() => {
                sel = new NodeSelection().setSelectionText(document, startNode, startNode, 0, 0);
                rteObj.inputElement.dispatchEvent(keyboardEventArgs);
                expect(document.querySelectorAll('.e-video-clickelem').length === 1).toBe(true);
                done();
            },500);
        });
    });

    describe('849992 - When press the enter key at the last position at last audio getting duplicate . ', function () {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        
        var innerHTML: string = `<p><span class="e-audio-wrap" contenteditable="false" title="mixkit-rain-and-thunder-storm-2390.mp3"><span class="e-clickelem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="blob:https://ej2.syncfusion.com/bbc0d9c4-e49b-4f65-8ad3-89388fa0b965" type="audio/mp3"></audio></span></span><br></p>`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Audio']
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Press enter key curser places after the audio', (done: Function) => {
            const startNode: any = rteObj.inputElement.querySelector('p');
            let sel: void = new NodeSelection().setSelectionText(document, startNode, startNode, 1, 1);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-audio-wrap').length === 1).toBe(true);
                done();
            }, 100);
        });
    });

    describe('850231 - Enter key press does not copy the styles content of Previous block Node', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'P',
                value: `<p class="firstNode" style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Search" title="Google Search"><span style="color:#3366CC;">Google Search</span></a>&nbsp;–\na&nbsp;<a href="https://en.wikipedia.org/wiki/Search_engine" title="Search engine"><span style="color:#3366CC;">web search engine</span></a>&nbsp;and\nGoogle's core product.</span></p><p  class="focusNode" style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Alerts" title="Google Alerts"><span style="color:#3366CC;">Google Alerts</span></a>&nbsp;–\nan email notification service that sends alerts based on chosen search terms\nwhenever it finds new results. Alerts include web results, Google Groups\nresults, news and videos.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Assistant" title="Google Assistant"><span style="color:#3366CC;">Google Assistant</span></a>&nbsp;–\na&nbsp;<a href="https://en.wikipedia.org/wiki/Virtual_assistant"><span style="color:#3366CC;">virtual assistant</span></a>.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Books" title="Google Books"><span style="color:#3366CC;">Google Books</span></a>&nbsp;–\na search engine for books.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Dataset_Search" title="Google Dataset Search"><span style="color:#3366CC;">Google Dataset Search</span></a>&nbsp;–\nallows searching for datasets in data repositories and local and national\ngovernment websites.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Flights" title="Google Flights"><span style="color:#3366CC;">Google Flights</span></a>&nbsp;–\na search engine for flight tickets.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Images" title="Google Images"><span style="color:#3366CC;">Google Images</span></a>&nbsp;–\na search engine for images online.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Shopping" title="Google Shopping"><span style="color:#3366CC;">Google Shopping</span></a>&nbsp;–\na search engine to search for products across online shops.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Travel" title="Google Travel"><span style="color:#3366CC;">Google Travel</span></a>&nbsp;–\na trip planner service.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Videos" title="Google Videos"><span style="color:#3366CC;">Google Videos</span></a>&nbsp;–\na search engine for videos.</span></p><p><br></p>`
            });
        });
        it('Press enter at the start of the container', (done: DoneFn) => {
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.firstNode');
            const sel: void = new NodeSelection().setCursorPoint(
                document, startNode.childNodes[0], 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.querySelector('p').nextElementSibling.hasAttribute('style'));
                //Testing if undo is properly saved the data when enter click for the first time.
                const tempElem: HTMLElement = createElement('div');
                tempElem.appendChild(rteObj.formatter.editorManager.undoRedoManager.undoRedoStack[0].text as DocumentFragment)
                expect(tempElem.innerHTML === `<p class="firstNode" style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Search" title="Google Search"><span style="color:#3366CC;">Google Search</span></a>&nbsp;– a&nbsp;<a href="https://en.wikipedia.org/wiki/Search_engine" title="Search engine"><span style="color:#3366CC;">web search engine</span></a>&nbsp;and Google's core product.</span></p><p class="focusNode" style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Alerts" title="Google Alerts"><span style="color:#3366CC;">Google Alerts</span></a>&nbsp;– an email notification service that sends alerts based on chosen search terms whenever it finds new results. Alerts include web results, Google Groups results, news and videos.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Assistant" title="Google Assistant"><span style="color:#3366CC;">Google Assistant</span></a>&nbsp;– a&nbsp;<a href="https://en.wikipedia.org/wiki/Virtual_assistant"><span style="color:#3366CC;">virtual assistant</span></a>.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Books" title="Google Books"><span style="color:#3366CC;">Google Books</span></a>&nbsp;– a search engine for books.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Dataset_Search" title="Google Dataset Search"><span style="color:#3366CC;">Google Dataset Search</span></a>&nbsp;– allows searching for datasets in data repositories and local and national government websites.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Flights" title="Google Flights"><span style="color:#3366CC;">Google Flights</span></a>&nbsp;– a search engine for flight tickets.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Images" title="Google Images"><span style="color:#3366CC;">Google Images</span></a>&nbsp;– a search engine for images online.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Shopping" title="Google Shopping"><span style="color:#3366CC;">Google Shopping</span></a>&nbsp;– a search engine to search for products across online shops.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Travel" title="Google Travel"><span style="color:#3366CC;">Google Travel</span></a>&nbsp;– a trip planner service.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Videos" title="Google Videos"><span style="color:#3366CC;">Google Videos</span></a>&nbsp;– a search engine for videos.</span></p><p><br></p>`).toBe(true);
                done();
            }, 100);
        });
        it('Press enter at the middle of the container', (done: DoneFn) => {
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.firstNode');
            const sel: void = new NodeSelection().setCursorPoint(
                    document, startNode.childNodes[0], 2);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.querySelector('p').nextElementSibling.hasAttribute('style'));
                done();
            }, 100);
        });
        it('Press enter at the end of the container', (done: DoneFn) => {
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.focusNode');
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode.childNodes[0], startNode.childNodes[0], 0, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.querySelector('p').nextElementSibling.hasAttribute('style'));
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('868816 - The enter key is not working properly in the Rich Text Editor.', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'P',
                value: `<p class="firstNode"> </p> <table class="e-rte-table" style="width: 54.7572%; min-width: 0px; height: 109px;">
                <thead>
                    <tr>
                        <th class="">SNo<br></th>
                        <th class="">Task<br></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="width: 23.7179%;" class="">1</td>
                        <td style="width: 75.641%;" class="">Ensuring the Accessibility for the Rich Text Editor.</td>
                    </tr>
                    <tr>
                        <td style="width: 23.7179%;" class="">2</td>
                        <td style="width: 75.641%;" class="">Ensuring the Accessibility for the Kanban.<br></td>
                    </tr>
                </tbody>
            </table>
            <p class="focusNode"> </p>`
            });
        });
        it('Press enter at the end of the container', (done: DoneFn) => {
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.focusNode');
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode.childNodes[0], startNode.childNodes[0], 0, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.querySelector('.e-rte-table').nextElementSibling.getAttribute('style')).toBe(null);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('875888 - Enter the key after inserting the mention; its creating two new lines in the Rich Text Editor.', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                value: `<p>Hello <span contenteditable="false" class="e-mention-chip"><a href="mailto:maria@gmail.com" title="maria@gmail.com">@@Maria</a></span>&#8203;</p>
                <p>Welcome to the mention integration with rich text editor demo. Type <code>@@</code> character and tag user from the suggestion list. </p>`,
            });
        });
        it('Press enter at the end of the zeroWithSpace', (done: DoneFn) => {
            const nodetext: any = rteObj.inputElement.childNodes[0].childNodes[2];
            const sel: void = new NodeSelection().setCursorPoint(document, nodetext, nodetext.length - 1);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML.includes('\u200B')).toBe(true);
                const expectedElem: string = '<p>Hello <span contenteditable="false" class="e-mention-chip"><a href="mailto:maria@gmail.com" title="maria@gmail.com">@@Maria</a></span></p><p>​</p><p>Welcome to the mention integration with rich text editor demo. Type <code>@@</code> character and tag user from the suggestion list.</p>'
                expect(rteObj.inputElement.innerHTML === expectedElem).toBe(true);
                const sel: void = new NodeSelection().setCursorPoint(document, rteObj.inputElement.firstElementChild, 3);
                rteObj.inputElement.dispatchEvent(keyboardEventArgs);
                setTimeout(() => {
                    const expectedElem: string = '<p>Hello <span contenteditable="false" class="e-mention-chip"><a href="mailto:maria@gmail.com" title="maria@gmail.com">@@Maria</a></span></p><p><br></p><p>​</p><p>Welcome to the mention integration with rich text editor demo. Type <code>@@</code> character and tag user from the suggestion list.</p>';
                    expect(rteObj.inputElement.innerHTML === expectedElem).toBe(true);
                    done();
                }, 100);
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('878787 - The enter action is not working properly working with the table in the Rich Text Editor.', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                enterKey: 'P',
                saveInterval: 10,
                value: `<table class="e-rte-table focusNode" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table>`
            });
        });
        it('Enter action when the cursor is before the table.', function (done): void {
            rteObj.focusIn();
            const startNode = rteObj.inputElement.querySelector('.focusNode');
            const sel = new NodeSelection().setSelectionText(document, startNode.parentElement, startNode.parentElement, 0, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(((rteObj.inputElement.firstChild as HTMLElement).innerHTML === '<br>' && rteObj.inputElement.firstChild.nodeName === 'P')).toBe(true);
                done();
            }, 100);
        });
        it('Enter action when the cursor is after the table.', function (done) {
            rteObj.focusIn();
            var startNode = rteObj.inputElement.querySelector('.focusNode');
            var sel = new NodeSelection().setSelectionText(document, startNode.parentElement, startNode.parentElement, 2, 2);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML === '<p><br></p><table class="e-rte-table focusNode" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>').toBe(true);
                expect(((rteObj.inputElement.lastChild as HTMLElement).innerHTML === '<br>' && rteObj.inputElement.lastChild.nodeName === 'P')).toBe(true);
                done();
            }, 100);
        });
        it('Enter action when the cursor is after the table with the text.', function (done) {
            rteObj.focusIn();
            rteObj.inputElement.innerHTML = `<table class="e-rte-table focusNode" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p>awefqwefqwefqwefeqwfew</p>`;
            var startNode = rteObj.inputElement.querySelector('.focusNode');
            var sel = new NodeSelection().setSelectionText(document, startNode.parentElement, startNode.parentElement, 1, 1);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML === '<table class="e-rte-table focusNode" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p><br></p><p>awefqwefqwefqwefeqwfew</p>').toBe(true);
                done();
            }, 100);
        });
        it('Enter action between the two table', function (done) {
            rteObj.focusIn();
            rteObj.value = `<table class="e-rte-table focusNode" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>`;
            rteObj.dataBind();
            var startNode = rteObj.inputElement.querySelector('.focusNode');
            var sel = new NodeSelection().setSelectionText(document, startNode.parentElement, startNode.parentElement, 1, 1);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML === '<table class="e-rte-table focusNode" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p><br></p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>').toBe(true);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Handle Enter key press on HR element between headers', function () {
        let rteObj: RichTextEditor;
        beforeAll(function () {
            rteObj = renderRTE({
                value: '<h1>Header 1</h1><hr><h3>Header 3</h3>'
            });
        });
        afterAll(function () {
            destroy(rteObj);
        });
        it('Press the Enter key on the HR element between Header 1 and Header 3', (done: DoneFn) => {
            const nodetext: any = rteObj.inputElement.childNodes[1];
            const sel: void = new NodeSelection().setCursorPoint(document, nodetext, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<h1>Header 1</h1><hr><p><br></p><h3>Header 3</h3>');
                done();
            }, 100);
        });
    });

describe('967217: Cursor position and scroll behavior with multiple line breaks in RichTextEditor', () => {
    let rteObj: RichTextEditor;
    
    beforeAll(() => {
        rteObj = renderRTE({
            height: '200px',
            value: '<p>Initial content</p>'
        });
    });
    
    afterAll(() => {
        destroy(rteObj);
    });
    
    it('should scroll to show cursor when pressing enter multiple times', (done: Function) => {
        rteObj.focusIn();
        let textNode: Element = rteObj.inputElement.querySelector('p').firstChild as Element;
        rteObj.formatter.editorManager.nodeSelection.setCursorPoint(
            document, 
            textNode, 
            textNode.textContent.length
        );
        const enterKeyEvent = new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(enterKeyEvent);
        setTimeout(() => {
            rteObj.inputElement.dispatchEvent(enterKeyEvent);
            setTimeout(() => {
                rteObj.inputElement.dispatchEvent(enterKeyEvent);
                setTimeout(() => {
                    const selection = window.getSelection();
                    const range = selection.getRangeAt(0);
                    const cursorRect = range.getBoundingClientRect();
                    const editableElem = rteObj.contentModule.getEditPanel() as HTMLElement;
                    const containerRect = editableElem.getBoundingClientRect();
                    const cursorTop = cursorRect.top - containerRect.top;
                    const containerHeight = editableElem.clientHeight;
                    expect(cursorTop).toBeLessThan(containerHeight);
                    done();
                }, 100);
            }, 100);
        }, 100);
    });
});

describe('968970 - Enter key as BR breaks the content when pressing Enter in RichTextEditor', function () {
    let rteObj: RichTextEditor;
    beforeAll(function (done) {
        rteObj = renderRTE({
            enterKey:'BR',
            value: "Hey,<br><br>Thanks for getting in touch. Do you have a copy of what the customer printed, or can you replicate the issue on your end?<br><br>We could definitely go down the track of building a custom report for printing if you would like more control over the layout. Please see the image below for reference.<br><br><img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' class='e-rte-image e-img-inline'>",
        });
        done();
    });
    afterAll(function () {
        destroy(rteObj);
    });
    it('When enter key as and RTE content has image element enter action was not working', () => {
        const nodetext: any = rteObj.inputElement.childNodes[3];
        const sel: void = new NodeSelection().setCursorPoint(document, nodetext, 28);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('Hey,<br><br>Thanks for getting in touch.<br>&nbsp;Do you have a copy of what the customer printed, or can you replicate the issue on your end?<br><br>We could definitely go down the track of building a custom report for printing if you would like more control over the layout. Please see the image below for reference.<br><br><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline">');
    });
});

describe('1003541 - Enter key pressing before the empty text character should create a new element with &nbsp', function () {
    let rteObj: RichTextEditor;
    beforeAll(function () {
        rteObj = renderRTE({
            value: '<p>The Editor</p>'
        });
    });
    afterAll(function () {
        destroy(rteObj);
    });
    it('When enter key as and RTE content has image element enter action was not working', (done: Function) => {
        const nodetext: any = rteObj.inputElement.childNodes[0].firstChild;
        const sel: void = new NodeSelection().setCursorPoint(document, nodetext, 3);
        rteObj.inputElement.dispatchEvent(new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT));
        rteObj.inputElement.dispatchEvent(new KeyboardEvent('keyup', ENTERKEY_EVENT_INIT));
        setTimeout(() => {
            expect(rteObj.inputElement.innerHTML).toBe('<p>The</p><p>&nbsp;Editor</p>');
            done();
        }, 100);
    });
    it('When backspace is pressed before the empty text character', (done: Function) => {
        rteObj.inputElement.innerHTML = '<p>The</p><p>&nbsp;Editor</p>';
        const nodetext: any = rteObj.inputElement.childNodes[1];
        const sel: void = new NodeSelection().setCursorPoint(document, nodetext, 0);
        const backSpaceKeyDown: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
        const backSpaceKeyUp: KeyboardEvent = new KeyboardEvent('keyup', BACKSPACE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(backSpaceKeyDown);
        rteObj.inputElement.dispatchEvent(backSpaceKeyUp);
        setTimeout(() => {
            expect(rteObj.inputElement.innerHTML).toBe('<p>The&nbsp;Editor</p>');
            done();
        }, 100);
    });
    it('When enter is pressed before the empty text character in list', (done: Function) => {
        rteObj.inputElement.innerHTML = '<ol><li>The Editor</li></ol>';
        const nodetext: any = rteObj.inputElement.querySelector('li').childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(document, nodetext, 3);
        rteObj.inputElement.dispatchEvent(new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT));
        rteObj.inputElement.dispatchEvent(new KeyboardEvent('keyup', ENTERKEY_EVENT_INIT));
        setTimeout(() =>{
            expect(rteObj.inputElement.innerHTML).toBe('<ol><li>The</li><li>&nbsp;Editor</li></ol>');
            done();
        }, 100);
    })
});

describe('1011052 - Enter key pressing before the empty text character should create a new element with &nbsp', function () {
    let rteObj: RichTextEditor;
    beforeAll(function () {
        rteObj = renderRTE({
            value: '<table class="e-rte-table"><thead><tr><th>Action</th><th>Shortcut</th></tr></thead><tbody><tr><td>Bulleted List</td><td>Start a line with <code>*</code> or <code>-</code> followed by a space</td></tr><tr><td>Numbered List</td><td>Start a line with <code>1.</code> or <code>i.</code> followed by a space</td></tr><tr><td>Checklist / To-do</td><td>Start a line with <code>[ ]</code> or <code>[x]</code> followed by a space</td></tr><tr><td>Headings (H1 to H6)</td><td>Use <code>#</code>, <code>##</code>, <code>###</code>, <code>####</code>, <code>#####</code>, or <code>######</code> followed by a space</td></tr><tr><td>Block Quote</td><td>Start a line with <code>&gt;</code> followed by a space</td></tr><tr><td>Code Block</td><td><p class="focus">Start a line with <code>```</code> followed by a space</p></td></tr><tr><td>Horizontal Line</td><td>Start a line with <code>---</code> followed by a space</td></tr><tr><td>Bold Text</td><td>Type <code>**text**</code> or <code>__text__</code></td></tr><tr><td>Italic Text</td><td>Type <code>*text*</code> or <code>_text_</code></td></tr><tr><td>Inline Code</td><td>Type <code>`text`</code></td></tr><tr><td>Strikethrough</td><td>Type <code>~~text~~</code></td></tr></tbody></table>'
        });
    });
    afterAll(function () {
        destroy(rteObj);
    });
    it('When enter action is performed inside the table', (done: Function) => {
        const nodetext: any = rteObj.inputElement.querySelector('.focus').lastChild;
        const sel: void = new NodeSelection().setCursorPoint(document, nodetext, 9);
        rteObj.inputElement.dispatchEvent(new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT));
        rteObj.inputElement.dispatchEvent(new KeyboardEvent('keyup', ENTERKEY_EVENT_INIT));
        setTimeout(() => {
            expect(rteObj.inputElement.querySelectorAll('td')[11].outerHTML).toBe('<td class="e-cell-select"><p class="focus">Start a line with <code>```</code> followed</p><p class="focus">&nbsp;by a space</p></td>');
            done();
        }, 100);
    });
});

    describe('998614: Console error when pressing Enter before a character that comes before an audio element in Rich Text Editor', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            // Paragraph content: a character 'x' followed by an inline audio
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'P',
                value: `<h1 class="focusNode">W<span class="e-audio-wrap" contenteditable="false" title="RTE-Audio.wav"><span class="e-clickelem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="blob:http://127.0.0.1:5500/d63a175d-7bcc-43a9-974e-1ba873ff4bdc" type="audio/wav"></audio></span></span> elcome</h1>`        });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Pressing Enter before the leading character should not throw and should split heading', (done: DoneFn) => {
            rteObj.focusIn();
            // Place caret BEFORE the first character 'W' (offset 0 in the first text node of H1)
            const h1Node: HTMLElement = rteObj.inputElement.querySelector('.focusNode') as HTMLElement;
            const firstText: HTMLElement = h1Node.firstChild as HTMLElement; // 'W'
            expect(firstText && firstText.nodeType === Node.TEXT_NODE).toBe(true);
            new NodeSelection().setCursorPoint(document, firstText, 0);
            (rteObj as any).keyDown(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.element.querySelectorAll('h1').length === 2).toBe(true);
                expect(rteObj.element.querySelectorAll('.e-audio-wrap').length).toBe(1);
                done();
            }, 100);
        });
    });
});// Add Tests above in this describe.