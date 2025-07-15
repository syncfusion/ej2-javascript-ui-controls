/**
 * Enter Key spec
 */
import { isNullOrUndefined, Browser, createElement, detach } from '@syncfusion/ej2-base';
import { EditorManager, RichTextEditor} from './../../../../src/index';
import { renderRTE, destroy } from './../../render.spec';
import { NodeSelection } from './../../../../src/selection/index';
import { ENTERKEY_EVENT_INIT } from '../../../constant.spec';

let keyboardEventArgs = {
    preventDefault: function () { },
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    char: '',
    key: '',
    charCode: 13,
    keyCode: 13,
    which: 13,
    code: 'Enter',
    action: 'enter',
    type: 'keydown'
};
let shiftkeyboarArgs = {
    preventDefault: function () { },
    altKey: false,
    ctrlKey: false,
    shiftKey: true,
    char: '',
    key: '',
    charCode: 13,
    keyCode: 13,
    which: 13,
    code: 'Enter',
    action: 'enter',
    type: 'keydown'
};
describe('927528: Console error thrown when pressing enter at the beginning of text in the editor at firefox browser', () => {
    let defaultUserAgent = navigator.userAgent;
    let fireFox: string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0";
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        Browser.userAgent = fireFox;
        rteObj = renderRTE({
            height: '200px',
            enterKey: 'P',
            value: `<p class="focusNode">hello</p>`
        });
        done();
    });

    it('Console error thrown when pressing enter key at the beginning of text at firefox browser', function (): void {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.focusNode').childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 0, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML === `<p><br></p><p><br></p><p class=\"focusNode\">hello</p>`).toBe(true);
    });

    afterAll(() => {
        destroy(rteObj);
        Browser.userAgent = defaultUserAgent;
    });
});
describe('841897 - Enter key press submits the form when Rich Text Editor control is used inside the Form element', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = {
        preventDefault: () => { },
        type: "keydown",
        stopPropagation: () => { },
        ctrlKey: false,
        shiftKey: false,
        action: null,
        which: 64,
        key: ""
      };
      let defaultString: string = `testing`;
      let element: HTMLElement 
    beforeAll((done: Function) => {
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
        done();
    });

    it('Enter key press submits the form when Rich Text Editor control is used inside the Form element', function (): void {
        rteObj.dataBind();
        rteObj.focusIn();
        keyBoardEvent.clipboardData = {
            getData: () => {
              return defaultString;
            },
            items: []
          };
        const startNode: any = rteObj.inputElement.querySelector('.focusNode')
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 0, 0);
        rteObj.onPaste(keyBoardEvent);
        var enterKeyEvent = new KeyboardEvent("keydown", { key: "Enter" ,code:"Enter"});
        var divElement = document.querySelector('.e-dialog');
        divElement.dispatchEvent(enterKeyEvent);
        var keyEvent = new KeyboardEvent("keydown", { key: "Entre" ,code:"Entre"});
        divElement.dispatchEvent(keyEvent);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML === `<div><br></div><p class="focusNode"><br></p>`).toBe(true);
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
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        Browser.userAgent = fireFox;
        rteObj = renderRTE({
            height: '200px',
            enterKey: 'P',
            value: `<p class="focusNode"><br></p>`
        });
        done();
    });

    it('Console error thrown when pressing enter key at firefox browser', function (): void {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.focusNode');
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 0, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML === `<p><br></p><p><br></p><p class=\"focusNode\"><br></p>`).toBe(true);
    });

    afterAll(() => {
        destroy(rteObj);
        Browser.userAgent =defaultUserAgent;
    });
});

describe('927517: Link functionality breaks with enter action in Firefox browser.', () => {
    let defaultUserAgent= navigator.userAgent;
    let fireFox: string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0";
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        Browser.userAgent = fireFox;
        rteObj = renderRTE({
            height: '200px',
            enterKey: 'P',
            value: `<p><a class="e-rte-anchor" href="http://d" title="http://d" target="_blank" aria-label="Open in new window">link</a>   3</p>`
        });
        done();
    });

    it('Link functionality breaks with enter action in Firefox browser', function (): void {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('p');
        new NodeSelection().setSelectionText(document, startNode.childNodes[1], startNode.childNodes[1], 1, 1);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML === '<p><a class="e-rte-anchor" href="http://d" title="http://d" target="_blank" aria-label="Open in new window">link</a> </p><p>3</p>').toBe(true);
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
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        Browser.userAgent = fireFox;
        rteObj = renderRTE({
            height: '200px',
            enterKey: 'P',
            value: `<p class="focusNode"><strong>hello</strong>﻿List 1</p><ol><li>List 2</li><li>List 3﻿<br></li></ol>`
        });
        done();
    });

    it('Enter key press after pressing backspace key on the start of the first list removes the previous content', function (): void {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.focusNode').childNodes[1];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 0, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML === `<p class="focusNode"><strong>hello</strong></p><p>﻿List 1</p><ol><li>List 2</li><li>List 3﻿<br></li></ol>`).toBe(true);
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
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        Browser.userAgent = fireFox;
        rteObj = renderRTE({
            height: '200px',
            enterKey: 'P',
            value: `<p class="focusNode">Content 1<br></p>`
        });
        done();
    });

    it('Many BR are inserted after enter key after the shift + enter is pressed', function (): void {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.focusNode');
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode.childNodes[0], startNode.childNodes[0], 9, 9);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.querySelectorAll('p')[1].querySelectorAll('br').length === 1).toBe(true);
    });

    afterAll(() => {
        destroy(rteObj);
        Browser.userAgent =defaultUserAgent;
    });
});

describe('Enter key support - Default Value -', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            enterKey: 'DIV'
        });
        done();
    });

    it('Default value when `DIV` is configured', function (): void {
        expect(rteObj.inputElement.innerHTML).toBe('<div><br></div>');
    });

    it('Default value when `BR` is configured', function (): void {
        rteObj.enterKey = 'BR';
        rteObj.dataBind();
        expect(rteObj.inputElement.innerHTML).toBe('<br>');
    });

    it('Default value when `P` is configured', function (): void {
        rteObj.enterKey = 'P';
        rteObj.dataBind();
        expect(rteObj.inputElement.innerHTML).toBe('<p><br></p>');
    });

    afterAll(() => {
        destroy(rteObj);
    });
});


describe('Enter key support - Source code - ', () => {
    let rteObj: RichTextEditor;
    let rteEle: HTMLElement;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            value: 'RTE Content',
            enterKey: 'DIV',
            toolbarSettings: {
                items: ['SourceCode']
            }
        });
        rteEle = rteObj.element;
        done();
    });

    it('Value when `DIV` is configured', function (): void {
        const sourceTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
        sourceTrgEle.click();
        expect((rteObj.element.querySelector('.e-rte-srctextarea') as any).value === '<div>RTE Content</div>').toBe(true);
        (rteObj.element.querySelector('.e-rte-srctextarea') as any).value = '';
        const previewTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
        previewTrgEle.click();
        expect(rteObj.inputElement.innerHTML).toBe('<div><br></div>');
    });

    it('Default value when `BR` is configured', function (): void {
        rteObj.value = 'RTE BR configured';
        rteObj.enterKey = 'BR';
        rteObj.dataBind();
        const sourceTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
        sourceTrgEle.click();
        expect(rteObj.inputElement.innerHTML).toBe('RTE BR configured');
        expect((rteObj.element.querySelector('.e-rte-srctextarea') as any).value === 'RTE BR configured').toBe(true);
        (rteObj.element.querySelector('.e-rte-srctextarea') as any).value = '';
        const previewTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
        previewTrgEle.click();
        expect(rteObj.inputElement.innerHTML).toBe('<br>');
    });

    it('Default value when `P` is configured', function (): void {
        rteObj.value = 'RTE P configured';
        rteObj.enterKey = 'P';
        rteObj.dataBind();
        const sourceTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
        sourceTrgEle.click();
        expect(rteObj.inputElement.innerHTML).toBe('<p>RTE P configured</p>');
        expect((rteObj.element.querySelector('.e-rte-srctextarea') as any).value === '<p>RTE P configured</p>').toBe(true);
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe('List revert with BR configured - ', () => {
    let rteObj: RichTextEditor;
    let rteEle: HTMLElement;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            value: 'RTE BR configured',
            enterKey: 'BR',
            toolbarSettings: {
                items: ['OrderedList', 'UnorderedList']
            }
        });
        rteEle = rteObj.element;
        done();
    });

    it('Default value when `BR` is configured with OL', function (): void {
        const orderListEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
        orderListEle.click();
        orderListEle.click();
        expect(rteObj.inputElement.innerHTML).toBe('RTE BR configured<br>');
    });

    it('Default value when `BR` is configured with UL', function (): void {
        const unorderListEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[1];
        unorderListEle.click();
        unorderListEle.click();
        expect(rteObj.inputElement.innerHTML).toBe('RTE BR configured<br>');
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe('Bug 911192: Error thrown when pressing the Enter key after placing the cursor on an <hr> tag in the Rich Text Editor', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: '<p>Testing</p>'
        });
        done();
    });

    afterAll(() => {
        destroy(rteObj);
    });
    it('check insertHorizontalRule Executecommand for one line text while cursor placed at end of the line and press enter', () => {
        const nodetext: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext.childNodes[0], nodetext.childNodes[0].textContent.length);
        rteObj.executeCommand('insertHorizontalRule');
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<p>Testing</p><hr><p><br></p><p><br></p>');
    });
    it('check insertHorizontalRule Executecommand for one line text while cursor placed at start of the line and press enter', () => {
        rteObj.inputElement.innerHTML = '<p>Testing</p>';
        const nodetext: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext.childNodes[0], 0);
        rteObj.executeCommand('insertHorizontalRule');
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<hr><p><br></p><p>Testing</p>');
    });
    it('check insertHorizontalRule Executecommand for one line text while cursor placed at middle of the line and press enter', () => {
        rteObj.inputElement.innerHTML = '<p>Testing</p>';
        const nodetext: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext.childNodes[0], 4);
        rteObj.executeCommand('insertHorizontalRule');
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<p>Test</p><hr><p><br></p><p>ing</p>');
    });
});

describe('Bug 917790: Link disappears on pressing "Enter" with CSS "white-space: pre-wrap" applied in Rich text editor', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: '<p> <a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank">www.google.com</a> </p>'
        });
        done();
    });

    afterAll(() => {
        destroy(rteObj);
    });
    it('Check the link availability after pressing enter key at the end after space', () => {
        const whiteSpace: HTMLElement = rteObj.element.querySelector('.e-content') as HTMLElement;
        whiteSpace.style.whiteSpace = 'pre-wrap';
        const nodetext: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext.childNodes[2], nodetext.childNodes[2].textContent.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.textContent.includes('www.google.com')).toBe(true);
    });

    it('Check the link availability after pressing enter key at the end before space', () => {
        const whiteSpace: HTMLElement = rteObj.element.querySelector('.e-content') as HTMLElement;
        whiteSpace.style.whiteSpace = 'pre-wrap';
        rteObj.value = '<p> <a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank">www.google.com</a> </p>';
        const nodetext: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext.childNodes[2], nodetext.childNodes[2].textContent.length-1);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.textContent.includes('www.google.com')).toBe(true);
    });

    it('Check the link availability after pressing enter key at the start after space', () => {
        const whiteSpace: HTMLElement = rteObj.element.querySelector('.e-content') as HTMLElement;
        whiteSpace.style.whiteSpace = 'pre-wrap';
        rteObj.value = '<p> <a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank">www.google.com</a> </p>';
        const nodetext: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext.childNodes[0], 1);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.textContent.includes('www.google.com')).toBe(true);
    });

    it('Check the link availability after pressing enter key at the start before space', () => {
        const whiteSpace: HTMLElement = rteObj.element.querySelector('.e-content') as HTMLElement;
        whiteSpace.style.whiteSpace = 'pre-wrap';
        rteObj.value = '<p> <a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank">www.google.com</a> </p>';
        const nodetext: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext.childNodes[0], 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.textContent.includes('www.google.com')).toBe(true);
    });
});
describe('Bug 925863: When pressing Enter key after the link when text-wrap is applied, it removes the content in the editor', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    let style: HTMLStyleElement;
    beforeAll((done: Function) => {
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
        done();
    });

    afterAll(() => {
        destroy(rteObj);
        if (style) {
            style.innerHTML = '';
        }
    });
    it('Check the link availability after pressing enter key at the end after space', () => {
        const nodetext: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext.childNodes[2], nodetext.childNodes[2].textContent.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.textContent.includes('www.google.com')).toBe(true);
    });

    it('Check the link availability after pressing enter key at the end before space', () => {
        rteObj.value = '<p> <a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank">www.google.com</a> </p>';
        const nodetext: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext.childNodes[2], nodetext.childNodes[2].textContent.length - 1);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.textContent.includes('www.google.com')).toBe(true);
    });

    it('Check the link availability after pressing enter key at the start after space', () => {
        rteObj.value = '<p> <a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank">www.google.com</a> </p>';
        const nodetext: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext.childNodes[0], 1);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.textContent.includes('www.google.com')).toBe(true);
    });

    it('Check the link availability after pressing enter key at the start before space', () => {
        rteObj.value = '<p> <a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank">www.google.com</a> </p>';
        const nodetext: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext.childNodes[0], 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.textContent.includes('www.google.com')).toBe(true);
    });
});
describe('Enter key support - When `DIV` is configured', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            value: '<div>RTE Content</div>',
            enterKey: 'DIV'
        });
        done();
    });

    it('Press enter at the end of the line', function (): void {
        const nodetext: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext.childNodes[0], nodetext.childNodes[0].textContent.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<div>RTE Content</div><div><br></div>');
    });

    it('Press enter at the end of the line when styles are applied', function (): void {
        rteObj.value = '<div><strong>​Line 1</strong></div>';
        rteObj.inputElement.innerHTML = '<div><strong>​Line 1</strong></div>';
        rteObj.dataBind();
        const nodetext: any = rteObj.inputElement.childNodes[0].childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext.childNodes[0], nodetext.childNodes[0].textContent.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<div><strong>​Line 1</strong></div><div><strong><br></strong></div>');
    });

    it('Press enter at the start of the line', function (): void {
        rteObj.value = '<div>RTE Content</div>';
        rteObj.inputElement.innerHTML = '<div>RTE Content</div>';
        rteObj.dataBind();
        const nodetext: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext.childNodes[0], 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<div><br></div><div>RTE Content</div>');
    });

    it('Press enter at the start of the line when styles are applied', function (): void {
        rteObj.value = '<div><strong>​Line 1</strong></div>';
        rteObj.inputElement.innerHTML = '<div><strong>​Line 1</strong></div>';
        rteObj.dataBind();
        const nodetext: any = rteObj.inputElement.childNodes[0].childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext.childNodes[0], 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<div><br></div><div><strong>​Line 1</strong></div>');
    });

    it('Press enter at the middle of the line', function (): void {
        rteObj.value = '<div>RTE Content</div>';
        rteObj.inputElement.innerHTML = '<div>RTE Content</div>';
        rteObj.dataBind();
        const nodetext: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext.childNodes[0], 2);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<div>RT</div><div>E Content</div>');
    });

    it('Press enter at the middle of the line when styles are applied', function (): void {
        rteObj.value = '<div><strong>​Line 1</strong></div>';
        rteObj.inputElement.innerHTML = '<div><strong>​Line 1</strong></div>';
        rteObj.dataBind();
        const nodetext: any = rteObj.inputElement.childNodes[0].childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext.childNodes[0], 3);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<div><strong>​Li</strong></div><div><strong>ne 1</strong></div>');
    });

    it('When multiple lines - Press enter at the end of the first line', function (): void {
        rteObj.value = '<div>Line 1</div><div>Line 2</div>';
        rteObj.inputElement.innerHTML = '<div>Line 1</div><div>Line 2</div>';
        rteObj.dataBind();
        const nodetext: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext.childNodes[0], nodetext.childNodes[0].textContent.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<div>Line 1</div><div><br></div><div>Line 2</div>');
    });

    it('Multiple lines - Press enter at the end of the first line - Styles applied', function (): void {
        rteObj.value = '<div><strong>​Line 1</strong></div><div><strong>Line 2</strong></div>';
        rteObj.inputElement.innerHTML = '<div><strong>​Line 1</strong></div><div><strong>Line 2</strong></div>';
        rteObj.dataBind();
        const nodetext: any = rteObj.inputElement.childNodes[0].childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext.childNodes[0], nodetext.childNodes[0].textContent.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<div><strong>​Line 1</strong></div><div><strong><br></strong></div><div><strong>Line 2</strong></div>');
    });

    it('When multiple lines - Press enter at the start of the second line', function (): void {
        rteObj.value = '<div>Line 1</div><div>Line 2</div>';
        rteObj.inputElement.innerHTML = '<div>Line 1</div><div>Line 2</div>';
        rteObj.dataBind();
        const nodetext: any = rteObj.inputElement.childNodes[1];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext.childNodes[0], 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<div>Line 1</div><div><br></div><div>Line 2</div>');
    });

    it('Multiple lines - Press enter at the start of the second line - Styles applied', function (): void {
        rteObj.value = '<div><strong>​Line 1</strong></div><div><strong>Line 2</strong></div>';
        rteObj.inputElement.innerHTML = '<div><strong>​Line 1</strong></div><div><strong>Line 2</strong></div>';
        rteObj.dataBind();
        const nodetext: any = rteObj.inputElement.childNodes[1].childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext.childNodes[0], 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<div><strong>​Line 1</strong></div><div><br></div><div><strong>Line 2</strong></div>');
    });

    it('When multiple lines - Press enter by selecting the whole line 2', function (): void {
        rteObj.value = '<div>Line 1</div><div>Line 2</div><div>Line 3</div>';
        rteObj.inputElement.innerHTML = '<div>Line 1</div><div>Line 2</div><div>Line 3</div>';
        rteObj.dataBind();
        const selectNode: any = rteObj.inputElement.childNodes[1].childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, selectNode, selectNode, 0, selectNode.textContent.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<div>Line 1</div><div><br></div><div><br></div><div>Line 3</div>');
    });

    it('Multiple lines - Press enter by selecting the whole line 2 - Styles applied', function (): void {
        rteObj.value = '<div><strong>​Line 1</strong></div><div><strong>Line 2</strong></div><div><strong>Line 3</strong></div>';
        rteObj.inputElement.innerHTML = '<div><strong>​Line 1</strong></div><div><strong>Line 2</strong></div><div><strong>Line 3</strong></div>';
        rteObj.dataBind();
        const selectNode: any = rteObj.inputElement.childNodes[1].childNodes[0].childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, selectNode, selectNode, 0, selectNode.textContent.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<div><strong>​Line 1</strong></div><div><strong><br></strong></div><div><strong><br></strong></div><div><strong>Line 3</strong></div>');
    });

    it('When multiple lines - Press enter by selecting few chars from line 2 and few chars from line 3', function (): void {
        rteObj.value = '<div>Line 1</div><div>Line 2</div><div>Line 3</div>';
        rteObj.inputElement.innerHTML = '<div>Line 1</div><div>Line 2</div><div>Line 3</div>';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.childNodes[1].childNodes[0];
        const endNode: any = rteObj.inputElement.childNodes[2].childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, endNode, 2, 2);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<div>Line 1</div><div>Li</div><div>ne 3</div>');
    });

    it('Multiple lines - Press enter by selecting few chars from line 2 and few chars from line 3 - Styles applied', function (): void {
        rteObj.value = '<div><strong>​Line 1</strong></div><div><strong>Line 2</strong></div><div><strong>Line 3</strong></div>';
        rteObj.inputElement.innerHTML = '<div><strong>​Line 1</strong></div><div><strong>Line 2</strong></div><div><strong>Line 3</strong></div>';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.childNodes[1].childNodes[0].childNodes[0];
        const endNode: any = rteObj.inputElement.childNodes[2].childNodes[0].childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, endNode, 2, 2);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<div><strong>​Line 1</strong></div><div><strong>Li</strong></div><div><strong>ne 3</strong></div>');
    });

    it('When multiple lines - Press enter by selecting 2 empty lines - Coverage', function (): void {
        rteObj.value = '<div>Line 1</div><div><br></div><div><br></div><div>Line 2</div>';
        rteObj.inputElement.innerHTML = '<div>Line 1</div><div><br></div><div><br></div><div>Line 2</div>';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.childNodes[1].childNodes[0];
        const endNode: any = rteObj.inputElement.childNodes[2].childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, endNode, 0, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<div>Line 1</div><div><br></div><div><br></div><div>Line 2</div>');
    });

    it('Multiple lines - Press enter by selecting 2 empty lines - Styles applied - Coverage', function (): void {
        rteObj.value = '<div><strong>​Line 1</strong></div><div><strong><br></strong></div><div><strong><br></strong></div><div><strong>Line 2</strong></div>';
        rteObj.inputElement.innerHTML = '<div><strong>​Line 1</strong></div><div><strong><br></strong></div><div><strong><br></strong></div><div><strong>Line 2</strong></div>';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.childNodes[1].childNodes[0].childNodes[0];
        const endNode: any = rteObj.inputElement.childNodes[2].childNodes[0].childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, endNode, 0, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<div><strong>​Line 1</strong></div><div><strong><br></strong></div><div><strong><br></strong></div><div><strong>Line 2</strong></div>');
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe('Enter key support - When `BR` is configured', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            value: 'RTE Content',
            enterKey: 'BR'
        });
        done();
    });

    it('Press enter at the end of the line', function (): void {
        const nodetext: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext, nodetext.textContent.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('RTE Content<br><br>');
    });

    it('EJ2-58543 - Press enter at the end of the line twice to check the text node removed properly', function (): void {
        const nodetext: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext, nodetext.textContent.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        (<any>rteObj).keyDown(keyboardEventArgs);
        rteObj.formatter.saveData();
        expect(rteObj.inputElement.childNodes.length === 5).toBe(true);
    });

    it('Press enter at the end of the line - Style Applied -', function (): void {
        rteObj.value = '<strong>​Line 1</strong>';
        rteObj.inputElement.innerHTML = '<strong>​Line 1</strong>';
        rteObj.dataBind();
        const nodetext: any = rteObj.inputElement.childNodes[0].childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext, nodetext.textContent.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<strong>​Line 1</strong><br><strong>​</strong>');
    });

    it('Press enter by selecting whole line 1 - Style Applied -', function (): void {
        rteObj.value = '<strong>​Line 1</strong>';
        rteObj.inputElement.innerHTML = '<strong>​Line 1</strong>';
        rteObj.dataBind();
        const selectNode: any = rteObj.inputElement.childNodes[0].childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, selectNode, selectNode, 0, selectNode.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<strong>​</strong><br><strong>​</strong>');
    });

    it('Press enter at the start of the line', function (): void {
        rteObj.value = 'RTE Content';
        rteObj.inputElement.innerHTML = 'RTE Content';
        rteObj.dataBind();
        const nodetext: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<br>RTE Content');
    });

    it('Press enter at the start of the line - Style Applied -', function (): void {
        rteObj.value = '<strong>​Line 1</strong>';
        rteObj.inputElement.innerHTML = '<strong>​Line 1</strong>';
        rteObj.dataBind();
        const nodetext: any = rteObj.inputElement.childNodes[0].childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<br><strong>​Line 1</strong>');
    });

    it('Press enter at the middle of the line', function (): void {
        rteObj.value = 'RTE Content';
        rteObj.inputElement.innerHTML = 'RTE Content';
        rteObj.dataBind();
        const nodetext: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext, 2);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('RT<br>E Content');
    });

    it('Press enter at the middle of the line - Style Applied', function (): void {
        rteObj.value = '<strong>​Line 1</strong>';
        rteObj.inputElement.innerHTML = '<strong>​Line 1</strong>';
        rteObj.dataBind();
        const nodetext: any = rteObj.inputElement.childNodes[0].childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext, 3);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<strong>​Li</strong><br><strong>ne 1</strong>');
    });

    it('Multiple lines - Press enter at the end of the first line', function (): void {
        rteObj.value = 'Line 1<br>Line 2';
        rteObj.inputElement.innerHTML = 'Line 1<br>Line 2';
        rteObj.dataBind();
        const nodetext: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext, nodetext.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('Line 1<br><br>Line 2');
    });

    it('Multiple lines - Press enter at the end of the first line - Style Applied', function (): void {
        rteObj.value = '<strong>​Line 1</strong><br><strong>Line 2​</strong>';
        rteObj.inputElement.innerHTML = '<strong>​Line 1</strong><br><strong>Line 2​</strong>';
        rteObj.dataBind();
        const nodetext: any = rteObj.inputElement.childNodes[0].childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext, nodetext.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<strong>​Line 1</strong><br><strong>​</strong><br><strong>Line 2​</strong>');
    });

    it('Multiple lines - Press enter at the start of the second line', function (): void {
        rteObj.value = 'Line 1<br>Line 2';
        rteObj.inputElement.innerHTML = 'Line 1<br>Line 2';
        rteObj.dataBind();
        const nodetext: any = rteObj.inputElement.childNodes[2];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('Line 1<br><br>Line 2');
    });

    it('Multiple lines - Press enter at the start of the second line - Style Applied', function (): void {
        rteObj.value = '<strong>​Line 1</strong><br><strong>Line 2​</strong>';
        rteObj.inputElement.innerHTML = '<strong>​Line 1</strong><br><strong>Line 2​</strong>';
        rteObj.dataBind();
        const nodetext: any = rteObj.inputElement.childNodes[2].childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<strong>​Line 1</strong><br><strong>​</strong><br><strong>Line 2​</strong>');
    });

    it('Multiple lines - Press enter by selecting the whole line 2', function (): void {
        rteObj.value = 'Line 1<br>Line 2<br>Line 3';
        rteObj.inputElement.innerHTML = 'Line 1<br>Line 2<br>Line 3';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.childNodes[2];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 0, startNode.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('Line 1<br><br><br>Line 3');
    });

    it('Multiple lines - Press enter by selecting the whole line 2 - Style Applied', function (): void {
        rteObj.value = '<strong>​Line 1</strong><br><strong>Line 2</strong><br><strong>Line 3​</strong>';
        rteObj.inputElement.innerHTML = '<strong>​Line 1</strong><br><strong>Line 2</strong><br><strong>Line 3​</strong>';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.childNodes[2].childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 0, startNode.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<strong>​Line 1</strong><br><strong>​</strong><br><strong>​</strong><br><strong>Line 3​</strong>');
    });

    it('Multiple lines - Press enter by selecting few chars from line 2 and few chars from line 3', function (): void {
        rteObj.value = 'Line 1<br>Line 2<br>Line 3';
        rteObj.inputElement.innerHTML = 'Line 1<br>Line 2<br>Line 3';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.childNodes[2];
        const endNode: any = rteObj.inputElement.childNodes[4];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, endNode, 2, 2);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('Line 1<br>Li<br>ne 3');
    });

    it('Multiple lines - Press enter by selecting few chars from line 2 and few chars from line 3 - Styles Applied', function (): void {
        rteObj.value = '<strong>​Line 1</strong><br><strong>Line 2</strong><br><strong>Line 3​</strong>';
        rteObj.inputElement.innerHTML = '<strong>​Line 1</strong><br><strong>Line 2</strong><br><strong>Line 3​</strong>';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.childNodes[2].childNodes[0];
        const endNode: any = rteObj.inputElement.childNodes[4].childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, endNode, 2, 2);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<strong>​Line 1</strong><br><strong>Li</strong><br><strong>ne 3​</strong>');
    });

    it('Multiple lines - Press enter on empty line', function (): void {
        rteObj.value = 'Line 1<br><br>Line 2';
        rteObj.inputElement.innerHTML = 'Line 1<br><br>Line 2';
        rteObj.dataBind();
        const nodetext: any = rteObj.inputElement.childNodes[1];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('Line 1<br><br><br>Line 2');
    });

    it('Multiple lines - Press enter on empty line - Style Applied', function (): void {
        rteObj.value = '<strong>​Line 1</strong><br><strong>​</strong><br><strong>​</strong><br><strong>Line 2​</strong>';
        rteObj.inputElement.innerHTML = '<strong>​Line 1</strong><br><strong>​</strong><br><strong>​</strong><br><strong>Line 2​</strong>';
        rteObj.dataBind();
        const nodetext: any = rteObj.inputElement.childNodes[2].childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<strong>​Line 1</strong><br><strong>​</strong><br><strong>​</strong><br><strong>​</strong><br><strong>Line 2​</strong>');
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe('BR Configured - Apply parent based selection formats', () => {
    let rteObj: RichTextEditor;
    let rteEle: HTMLElement;
    let curDocument: Document;
    let mouseEventArgs: { [key: string]: HTMLElement };
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            value: 'RTE Content',
            enterKey: 'BR',
            toolbarSettings: {
                items: ['Formats']
            },
            format: {
                types: [
                    { text: 'Paragraph', value: 'P' },
                    { text: 'Code', value: 'Pre'},
                    { text: 'Quotation', value: 'BlockQuote'},
                    { text: 'Heading 1', value: 'H1' },
                    { text: 'Heading 2', value: 'H2' },
                    { text: 'Heading 3', value: 'H3' },
                    { text: 'Heading 4', value: 'H4' }
                ]
            }
        });
        rteEle = rteObj.element;
        curDocument = rteObj.contentModule.getDocument();
        done();
    });

    it('Apply H1 format when cursor at the end of the line', function (): void {
        const nodetext: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext, nodetext.textContent.length);
        const sourceTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
        (sourceTrgEle.childNodes[0] as HTMLElement).click();
        const popupElement: Element = curDocument.querySelectorAll('.e-rte-dropdown-popup.e-popup-open')[0];
        mouseEventArgs = {
            target: (popupElement.childNodes[0].childNodes[3] as HTMLElement)
        };
        (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<h1>RTE Content</h1>');
    });

    it('Apply H1 format when cursor at the end of the line - Style Applied', function (): void {
        rteObj.value = '<strong>​RTE Content</strong>';
        rteObj.inputElement.innerHTML = '<strong>​RTE Content</strong>';
        rteObj.dataBind();
        const nodetext: any = rteObj.inputElement.childNodes[0].childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext, nodetext.textContent.length);
        const sourceTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
        (sourceTrgEle.childNodes[0] as HTMLElement).click();
        const popupElement: Element = curDocument.querySelectorAll('.e-rte-dropdown-popup.e-popup-open')[0];
        mouseEventArgs = {
            target: (popupElement.childNodes[0].childNodes[3] as HTMLElement)
        };
        (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<h1><strong>​RTE Content</strong></h1>');
    });

    it('Apply H1 format when cursor at the start of the line', function (): void {
        rteObj.value = 'RTE Content';
        rteObj.inputElement.innerHTML = 'RTE Content';
        rteObj.dataBind();
        const nodetext: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext, 0);
        const sourceTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
        (sourceTrgEle.childNodes[0] as HTMLElement).click();
        const popupElement: Element = curDocument.querySelectorAll('.e-rte-dropdown-popup.e-popup-open')[0];
        mouseEventArgs = {
            target: (popupElement.childNodes[0].childNodes[3] as HTMLElement)
        };
        (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<h1>RTE Content</h1>');
    });

    it('Apply H2 format when cursor at the start of the second line', function (): void {
        rteObj.value = 'Line 1<br>Line 2';
        rteObj.inputElement.innerHTML = 'Line 1<br>Line 2';
        rteObj.dataBind();
        const nodetext: any = rteObj.inputElement.childNodes[2];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext, 0);
        const sourceTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
        (sourceTrgEle.childNodes[0] as HTMLElement).click();
        const popupElement: Element = curDocument.querySelectorAll('.e-rte-dropdown-popup.e-popup-open')[0];
        mouseEventArgs = {
            target: (popupElement.childNodes[0].childNodes[4] as HTMLElement)
        };
        (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('Line 1<h2>Line 2</h2>');
    });

    it('Apply H2 format when cursor at the start of the second line - Style Applied', function (): void {
        rteObj.value = '<strong>​Line 1</strong><br><strong>Line 2​</strong>';
        rteObj.inputElement.innerHTML = '<strong>​Line 1</strong><br><strong>Line 2​</strong>';
        rteObj.dataBind();
        const nodetext: any = rteObj.inputElement.childNodes[2];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext, 0);
        const sourceTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
        (sourceTrgEle.childNodes[0] as HTMLElement).click();
        const popupElement: Element = curDocument.querySelectorAll('.e-rte-dropdown-popup.e-popup-open')[0];
        mouseEventArgs = {
            target: (popupElement.childNodes[0].childNodes[4] as HTMLElement)
        };
        (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<strong>​Line 1</strong><h2><strong>Line 2​</strong></h2>');
    });

    it('Apply H3 format by selecting the whole second line', function (): void {
        rteObj.value = 'Line 1<br>Line 2<br>Line 3';
        rteObj.inputElement.innerHTML = 'Line 1<br>Line 2<br>Line 3';
        rteObj.dataBind();
        const selectNode: any = rteObj.inputElement.childNodes[2];
        const sel: void = new NodeSelection().setSelectionText(
            document, selectNode, selectNode, 0, selectNode.length);
        const sourceTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
        (sourceTrgEle.childNodes[0] as HTMLElement).click();
        const popupElement: Element = curDocument.querySelectorAll('.e-rte-dropdown-popup.e-popup-open')[0];
        mouseEventArgs = {
            target: (popupElement.childNodes[0].childNodes[5] as HTMLElement)
        };
        (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('Line 1<h3>Line 2</h3>Line 3');
    });

    it('Apply H3 format by selecting the whole second line - Style Applied', function (): void {
        rteObj.value = '<strong>​Line 1</strong><br><strong>Line 2</strong><br><strong>Line 3​</strong>';
        rteObj.inputElement.innerHTML = '<strong>​Line 1</strong><br><strong>Line 2</strong><br><strong>Line 3​</strong>';
        rteObj.dataBind();
        const selectNode: any = rteObj.inputElement.childNodes[2].childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, selectNode, selectNode, 0, selectNode.length);
        const sourceTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
        (sourceTrgEle.childNodes[0] as HTMLElement).click();
        const popupElement: Element = curDocument.querySelectorAll('.e-rte-dropdown-popup.e-popup-open')[0];
        mouseEventArgs = {
            target: (popupElement.childNodes[0].childNodes[5] as HTMLElement)
        };
        (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<strong>​Line 1</strong><h3><strong>Line 2</strong></h3><strong>Line 3​</strong>');
    });

    it('Apply H4 format by selecting the whole second line', function (): void {
        rteObj.value = 'Line 1<br>Line 2<br>Line 3';
        rteObj.inputElement.innerHTML = 'Line 1<br>Line 2<br>Line 3';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.childNodes[2];
        const endNode: any = rteObj.inputElement.childNodes[4];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, endNode, 2, 2);
        const sourceTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
        (sourceTrgEle.childNodes[0] as HTMLElement).click();
        const popupElement: Element = curDocument.querySelectorAll('.e-rte-dropdown-popup.e-popup-open')[0];
        mouseEventArgs = {
            target: (popupElement.childNodes[0].childNodes[6] as HTMLElement)
        };
        (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('Line 1<h4>Line 2</h4><h4>Line 3</h4>');
    });

    it('Apply H4 format by selecting the whole second line - Style Applied', function (): void {
        rteObj.value = '<strong>​Line 1</strong><br><strong>Line 2</strong><br><strong>Line 3​</strong>';
        rteObj.inputElement.innerHTML = '<strong>​Line 1</strong><br><strong>Line 2</strong><br><strong>Line 3​</strong>';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.childNodes[0].childNodes[0];
        const endNode: any = rteObj.inputElement.childNodes[4].childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, endNode, 2, 2);
        const sourceTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
        (sourceTrgEle.childNodes[0] as HTMLElement).click();
        const popupElement: Element = curDocument.querySelectorAll('.e-rte-dropdown-popup.e-popup-open')[0];
        mouseEventArgs = {
            target: (popupElement.childNodes[0].childNodes[6] as HTMLElement)
        };
        (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<h4><strong>​Line 1</strong></h4><h4><strong>Line 2</strong></h4><h4><strong>Line 3​</strong></h4>');
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe('Enter key support - When `BR` is configured', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            value: '<p>RTE Content</p>',
            enterKey: 'BR'
        });
        done();
    });

    it('Press enter at the end of the paragraph', function (): void {
        const nodetext: any = rteObj.inputElement.childNodes[0].childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext, nodetext.textContent.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<p>RTE Content<br><br></p>');
    });

    it('Press enter by selecting few chars of the p tag', function (): void {
        rteObj.value = '<p>RTE Content</p>';
        rteObj.inputElement.innerHTML = '<p>RTE Content</p>';
        rteObj.dataBind();
        const nodetext: any = rteObj.inputElement.childNodes[0].childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, nodetext, nodetext, 7, nodetext.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<p>RTE Con<br><br></p>');
    });

    it('Press enter by selecting all the three lines', function (): void {
        rteObj.value = 'Line 1<br>Line 2<br>Line 3';
        rteObj.inputElement.innerHTML = 'Line 1<br>Line 2<br>Line 3';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.childNodes[0];
        const endNode: any = rteObj.inputElement.childNodes[4];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, endNode, 0, endNode.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<br><br>');
    });

    it('Press enter by selecting second and the third lines fully', function (): void {
        rteObj.value = 'Line 1<br>Line 2<br>Line 3<br>Line 4';
        rteObj.inputElement.innerHTML = 'Line 1<br>Line 2<br>Line 3';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.childNodes[2];
        const endNode: any = rteObj.inputElement.childNodes[4];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, endNode, 0, endNode.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('Line 1<br><br><br>Line 4');
    });

    it('Press enter by selecting second and the third lines fully - Styles Applied', function (): void {
        rteObj.value = '<strong>​Line 1</strong><br><strong>Line 2</strong><br><strong>Line 3</strong><br><strong>Line 4​</strong>';
        rteObj.inputElement.innerHTML = '<strong>​Line 1</strong><br><strong>Line 2</strong><br><strong>Line 3</strong><br><strong>Line 4​</strong>';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.childNodes[2].childNodes[0];
        const endNode: any = rteObj.inputElement.childNodes[6].childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, endNode, 0, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<strong>​Line 1</strong><br><strong>​</strong><br><strong>Line 4​</strong>');
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe('Enter key support - When `DIV` is configured', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            value: '<div>RTE Content</div><div>RTE Content</div><div>RTE Content</div>',
            enterKey: 'DIV'
        });
        done();
    });

    it('Press enter by selecting few line from first line and few chars from third line', function (): void {
        const startNode: any = rteObj.inputElement.childNodes[0].childNodes[0];
        const endNode: any = rteObj.inputElement.childNodes[2].childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, endNode, 7, endNode.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<div>RTE Con</div><div><br></div>');
    });

    it('Press enter by selecting few line from first line and few chars from third line', function (): void {
        rteObj.value = '<div><strong>​Line 1</strong></div><div><strong>Line 2</strong></div><div><strong>Line 3</strong></div>';
        rteObj.inputElement.innerHTML = '<div><strong>​Line 1</strong></div><div><strong>Line 2</strong></div><div><strong>Line 3</strong></div>';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.childNodes[0].childNodes[0].childNodes[0];
        const endNode: any = rteObj.inputElement.childNodes[2].childNodes[0].childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, endNode, 4, endNode.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<div><strong>​Lin</strong></div><div><strong><br></strong></div>');
    });

    afterAll(() => {
        destroy(rteObj);
    });
});


describe('Enter key support - List ', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            value: '<ol><li>List 1</li><li><br></li></ol>',
            enterKey: 'P'
        });
        done();
    });

    it('Press enter by at the empty list by configuring the enter as P tag', function (): void {
        const startNode: any = rteObj.inputElement.childNodes[0].childNodes[1];
        const sel: void = new NodeSelection().setCursorPoint(
            document, startNode, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<ol><li>List 1</li></ol><p><br></p>');
    });

    it('Press enter by at the empty list by configuring the enter as DIV tag', function (): void {
        rteObj.enterKey = 'DIV'
        rteObj.value = '<ol><li>List 1</li><li><br></li></ol>';
        rteObj.inputElement.innerHTML = '<ol><li>List 1</li><li><br></li></ol>';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.childNodes[0].childNodes[1];
        const sel: void = new NodeSelection().setCursorPoint(
            document, startNode, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<ol><li>List 1</li></ol><div><br></div>');
    });

    it('Press enter by at the empty list by configuring the enter as BR tag', function (): void {
        rteObj.enterKey = 'BR'
        rteObj.value = '<ol><li>List 1</li><li><br></li></ol>';
        rteObj.inputElement.innerHTML = '<ol><li>List 1</li><li><br></li></ol>';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.childNodes[0].childNodes[1];
        const sel: void = new NodeSelection().setCursorPoint(
            document, startNode, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<ol><li>List 1</li></ol><br>');
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe('Enter key support - After Heading ', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            value: '<h1>Heading</h1>',
            enterKey: 'P'
        });
        done();
    });

    it('Press enter by at the end of the heading by configuring the enter as P tag', function (): void {
        const startNode: any = rteObj.inputElement.childNodes[0].childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, startNode, startNode.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<h1>Heading</h1><p><br></p>');
    });

    it('Press enter by at the end of the heading by configuring the enter as DIV tag', function (): void {
        rteObj.enterKey = 'DIV'
        rteObj.value = '<h1>Heading</h1>';
        rteObj.inputElement.innerHTML = '<h1>Heading</h1>';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.childNodes[0].childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, startNode, startNode.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<h1>Heading</h1><div><br></div>');
    });

    it('Press enter by at the end of the heading by configuring the enter as BR tag', function (): void {
        rteObj.enterKey = 'BR'
        rteObj.value = '<h1>Heading</h1>';
        rteObj.inputElement.innerHTML = '<h1>Heading</h1>';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.childNodes[0].childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, startNode, startNode.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<h1>Heading<br><br></h1>');
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe('BR Configured - Apply parent based selection formats', () => {
    let rteObj: RichTextEditor;
    let rteEle: HTMLElement;
    let curDocument: Document;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            value: 'RTE Content',
            enterKey: 'BR',
            toolbarSettings: {
                items: [ 'UnorderedList']
            }
        });
        rteEle = rteObj.element;
        curDocument = rteObj.contentModule.getDocument();
        done();
    });

    it('Apply List format when cursor at the end of the line', function (): void {
        const nodetext: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext, nodetext.textContent.length);
        const sourceTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
        (sourceTrgEle.childNodes[0] as HTMLElement).click();
        expect(rteObj.inputElement.innerHTML).toBe('<ul><li>RTE Content</li></ul>');
    });

    it('Apply List format by selecting multiple lines', function (): void {
        rteObj.value = 'List 1<br>List 2<br>List 3';
        rteObj.inputElement.innerHTML = 'List 1<br>List 2<br>List 3';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.childNodes[0];
        const endNode: any = rteObj.inputElement.childNodes[4];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, endNode, 0, endNode.length);
        const sourceTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
        (sourceTrgEle.childNodes[0] as HTMLElement).click();
        expect(rteObj.inputElement.innerHTML).toBe('<ul><li>List 1</li><li>List 2</li><li>List 3</li></ul>');
    });
    afterAll(() => {
        destroy(rteObj);
    });
});

describe('When P configured - only image in the editor content', () => {
    let rteObj: RichTextEditor;
    let rteEle: HTMLElement;
    let curDocument: Document;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            value: '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"> </p>'
        });
        rteEle = rteObj.element;
        curDocument = rteObj.contentModule.getDocument();
        done();
    });

    it('Press enter when cursor is after the image', function (): void {
        const startNode: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 1, 1);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p><p><br></p>');
    });

    it('Press enter when cursor is placed before the image', function (): void {
        rteObj.value = '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"> </p>';
        rteObj.inputElement.innerHTML = '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"> </p>';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.childNodes[0].childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 0, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<p><br></p><p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"> </p>');
    });

    it('When image is loaded as initial value and press enter after the image', function (): void {
        rteObj.value = '<img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;">';
        rteObj.inputElement.innerHTML = '<img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;">';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 1, 1);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p><p><br></p>');
    });

    it('When image is loaded as initial value and press enter before the image', function (): void {
        rteObj.value = '<img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;">';
        rteObj.inputElement.innerHTML = '<img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;">';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.childNodes[0].childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 0, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<p><br></p><p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>');
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe('Bug 937059: Pressing Enter or Shift+Enter Removes Images in the Rich Text Editor', () => {
    let rteObj: RichTextEditor;
    let rteEle: HTMLElement;
    let curDocument: Document;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            value: '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>'
        });
        rteEle = rteObj.element;
        curDocument = rteObj.contentModule.getDocument();
        done();
    });
    it('Press enter when cursor is after the image', function (): void {
        const startNode: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 1, 1);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p><p><br></p>');
    });
    it('Press enter when cursor is before the image', function (): void {
        rteObj.value = '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>';
        rteObj.inputElement.innerHTML = '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 0, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<p><br></p><p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>');
    });
    it('Press enter when cursor is at the image', function (): void {
        rteObj.value = '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>';
        rteObj.inputElement.innerHTML = '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 0, 1);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p><p><br></p>');
    });
    it('Press shift enter when cursor is after the image', function (): void {
        rteObj.value = '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>';
        rteObj.inputElement.innerHTML = '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 1, 1);
        (<any>rteObj).keyDown(shiftkeyboarArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p><br><br>');
    });
    it('Press shift enter when cursor is before the image', function (): void {
        rteObj.value = '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>';
        rteObj.inputElement.innerHTML = '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 0, 0);
        (<any>rteObj).keyDown(shiftkeyboarArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<p><br><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>');
    });
    it('Press shift enter when cursor is at the image', function (): void {
        rteObj.value = '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>';
        rteObj.inputElement.innerHTML = '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 0, 1);
        (<any>rteObj).keyDown(shiftkeyboarArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<br><p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>');
    });
    afterAll(() => {
        destroy(rteObj);
    });
});

describe('916641: Shift+Enter before an audio element', () => {
    let rteObj: RichTextEditor;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: `<p><span class="e-audio-wrap" contenteditable="false" title="RTE-Audio.wav"><span class="e-clickelem"><audio class="e-rte-audio e-audio-inline" controls="" style="outline: rgb(74, 144, 226) solid 2px;"><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Audio.wav" type="audio/wav"></audio></span></span> </p>`
        });
        done();
    });
    it('should insert a <br> when Shift+Enter is pressed before an audio element', () => {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 0, 0);
        (<any>rteObj).keyDown({ ...shiftkeyboarArgs, keyCode: 13 });
        expect(window.getSelection().getRangeAt(0).startContainer.nodeName === 'BR').toBe(true);
    });
    afterAll(() => {
        destroy(rteObj);
    });
});

describe('Enter key support - Changing both APIs when content is empty and pressing enter ', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            enterKey: 'P'
        });
        done();
    });

    it('Changing both APIs when content is empty and pressing enter', function (): void {
        rteObj.enterKey = 'DIV';
        rteObj.dataBind();
        rteObj.focusIn();
        rteObj.shiftEnterKey = 'P';
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement;
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 0, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<div><br></div><div><br></div>');
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe('EJ2-54630 - Enter Removes the first line issue', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            enterKey: 'P',
            value: `<p class="focusNode">The Rich Te<br>xt Editor content</p>`
        });
        done();
    });

    it('When shift enter is pressed at the middle and then pressing enter at the start of the second line', function (): void {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.focusNode');
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode.childNodes[2], startNode.childNodes[2], 0, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.querySelectorAll('p').length === 2).toBe(true);
        expect(rteObj.inputElement.innerHTML === '<p class="focusNode">The Rich Te<br></p><p>xt Editor content</p>').toBe(true);
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe('CR Issue - Paste some content and then press enter twice at the start(top) ', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            enterKey: 'P',
            value: `<p><span style="box-sizing: border-box; font-size: 14.6667px; letter-spacing: 0.25px; font-family: &quot;Segoe UI&quot;, sans-serif; color: rgb(32, 31, 30); border: 1pt none windowtext; padding: 0in;"><span class="focusNode" style="box-sizing: border-box; border-style: initial;">We are able to reproduce the issue from our end and we have considered&nbsp;</span><span style="box-sizing: border-box; font-weight: 700;"><span style="box-sizing: border-box; border-style: initial;">“</span></span></span><span style="box-sizing: border-box; font-weight: 700; color: rgb(17, 17, 17); font-family: Calibri, sans-serif; font-size: 14.6667px; letter-spacing: 0.25px;"><span style="box-sizing: border-box; font-family: &quot;Segoe UI&quot;, sans-serif; color: black;">Page scrolls automatically when press enter key inside the editor</span></span><span style="box-sizing: border-box; font-weight: 700; color: rgb(17, 17, 17); font-family: Calibri, sans-serif; font-size: 14.6667px; letter-spacing: 0.25px;"><span style="box-sizing: border-box; font-family: &quot;Segoe UI&quot;, sans-serif; color: rgb(32, 31, 30); border: 1pt none windowtext; padding: 0in;">”</span><br style="box-sizing: border-box;"></span><span style="box-sizing: border-box; font-size: 14.6667px; letter-spacing: 0.25px; font-family: &quot;Segoe UI&quot;, sans-serif; color: rgb(32, 31, 30); border: 1pt none windowtext; padding: 0in;"><span style="box-sizing: border-box; border-style: initial;">as a bug from our end, and logged the report for the same and it will be included in our patch release on&nbsp;<span style="box-sizing: border-box; font-weight: 700;">12<span style="box-sizing: border-box; position: relative; font-size: 11px; line-height: 0; vertical-align: baseline; top: -0.5em;">th</span>&nbsp;October 2021.</span></span></span><br></p>`
        });
        done();
    });

    it('Paste some content and then press enter twice at the start(top)', function (): void {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.focusNode');
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode.childNodes[0], startNode.childNodes[0], 0, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.querySelectorAll('p').length === 2).toBe(true);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.querySelectorAll('p').length === 3).toBe(true);
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe('EJ2-55453 - New P tag not created when enter press ', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            enterKey: 'P',
            value: `<p class="focusNode">\n    The Rich Text Editor is a WYSIWYG ('what you see is what you get') editor useful to create and edit content and return the valid\n    <a href=\"https://blazor.syncfusion.com/documentation/rich-text-editor/editor-modes/#html-editor\">HTML markup</a> or\n    <a href=\"https://blazor.syncfusion.com/documentation/rich-text-editor/editor-modes/#markdown-editor\">markdown</a> of the content     \n</p><p><b>Toolbar</b>`
        });
        done();
    });

    it('Enter Key press two times creates one P tag and then moves the cursor to next line instead of the new P tag creation', function (): void {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.focusNode');
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode.lastChild, startNode.lastChild, startNode.lastChild.textContent.length, startNode.lastChild.textContent.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.querySelectorAll('p').length === 3).toBe(true);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.querySelectorAll('p').length === 4).toBe(true);
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe('Table Enter Key Testing', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            enterKey: 'P',
            value: `<p>RTE Content</p><p>RTE Content</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="focusNode" style="width: 33.3333%;"><p class=''>RTE Content</p></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>`
        });
        done();
    });

    it('Enter Key testing in table when P is configured and P content is inside', function (): void {
        rteObj.value = '<p>RTE Content</p><p>RTE Content</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><p class="focusNode">RTE Content</p><p>test</p></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>';
        rteObj.inputElement.innerHTML = '<p>RTE Content</p><p>RTE Content</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><p class="focusNode">RTE Content</p><p>test</p></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>';
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.focusNode');
        const sel: void = new NodeSelection().setCursorPoint(
            document, startNode.childNodes[0], 11);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.querySelector('.focusNode').nextElementSibling.tagName === 'P').toBe(true);
    });

    it('Enter Key testing in table when DIV is configured and P content is inside', function (): void {
        rteObj.enterKey = 'DIV';
        rteObj.value = '<p>RTE Content</p><p>RTE Content</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><p class="focusNode">RTE Content</p><p>test</p></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>';
        rteObj.inputElement.innerHTML = '<p>RTE Content</p><p>RTE Content</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><p class="focusNode">RTE Content</p><p>test</p></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.querySelector('.focusNode');
        const sel: void = new NodeSelection().setCursorPoint(
            document, startNode.childNodes[0], 11);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.querySelector('.focusNode').nextElementSibling.tagName === 'DIV').toBe(true);
    });

    it('Enter Key testing in table when BR is configured and P content is inside', function (): void {
        rteObj.enterKey = 'BR';
        rteObj.value = '<p>RTE Content</p><p>RTE Content</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><p class="focusNode">RTE Content</p></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>';
        rteObj.inputElement.innerHTML = '<p>RTE Content</p><p>RTE Content</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><p class="focusNode">RTE Content</p></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>';
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.querySelector('.focusNode');
        const sel: void = new NodeSelection().setCursorPoint(
            document, startNode.childNodes[0], 11);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.querySelector('.focusNode').lastElementChild.tagName === 'BR').toBe(true);
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe('EJ2-54662 - Insert HTML after enter when cursor is placed before the P tag ', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            enterKey: 'P',
            value: `<p class="focusNode">Sample</p>`
        });
        done();
    });

    it('Insert HTML after enter when cursor is placed before the P tag', function (): void {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.focusNode');
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode.childNodes[0], startNode.childNodes[0],
            startNode.childNodes[0].textContent.length, startNode.childNodes[0].textContent.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        (<any>rteObj).keyDown(keyboardEventArgs);
        (<any>rteObj).focusIn();
        (<any>rteObj).executeCommand(
        'insertHTML',
        `<p class="secondFocus">Sehr geehrte Frau Leider erreiche ich Sie nicht telefonisch. Wie mit Ihrer Assistentin telefonisch besprochen, sende ich Ihnen mein Anliegen per Email.</p>`);
        const startNode2: any = rteObj.inputElement.querySelector('.secondFocus');
        const sel2: void = new NodeSelection().setSelectionText(
            document, startNode2.childNodes[0], startNode2.childNodes[0], 0, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(((<any>rteObj).getRange().startContainer as HTMLElement).classList.contains('secondFocus')).toBe(true)
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe('EJ2-55294 - Enter Key press at the start of the content when content have space in HTML ', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            enterKey: 'P',
            value: `<p class='focusNode'>\n    The Rich Text Editor is a WYSIWYG ('what you see is what you get') editor useful to create and edit content and return the valid\n    <a href=\"https://blazor.syncfusion.com/documentation/rich-text-editor/editor-modes/#html-editor\">HTML markup</a> or\n    <a href=\"https://blazor.syncfusion.com/documentation/rich-text-editor/editor-modes/#markdown-editor\">markdown</a> of the content\n</p>`
        });
        done();
    });

    it('Enter Key press at the start of the content when content have space in HTML', function (): void {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.focusNode');
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode.childNodes[0], startNode.childNodes[0], 0, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.querySelectorAll('p').length === 2).toBe(true);
        expect(rteObj.inputElement.querySelectorAll('p')[0].querySelectorAll('br').length === 1).toBe(true);
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe('EJ2-54628 - Enter Key press read only mode', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            readonly: true,
            enterKey: 'P',
            value: `<p class='focusNode'>The Rich Text Editor</p>`
        });
        done();
    });

    it('Enter Key press read only mode', function (): void {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.focusNode');
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode.childNodes[0], startNode.childNodes[0], 3, 3);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.querySelectorAll('p').length === 1).toBe(true);
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe('BLAZ-18839 - Enter Key press after link make the first char in the next line as link when typing', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            enterKey: 'P',
            value: `<p>RTE&nbsp;<a class="e-rte-anchor focusNode" href="http://Link" title="Link" target="_blank">Link</a></p>`
        });
        done();
    });

    it('Enter Key press after link make the first char in the next line as link when typing', function (): void {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.focusNode');
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode.childNodes[0], startNode.childNodes[0], 4, 4);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.querySelectorAll('p')[1].querySelectorAll('a').length === 0).toBe(true);
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe('EJ2-59670 - Enter Key press at the start of the image with caption', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            enterKey: 'P',
            value: `<p class="focusNode"><span class="e-img-caption e-rte-img-caption e-caption-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><img src="blob:null/789e321d-7734-445f-831e-d62dc21a3ccf" class="e-rte-image e-imginline e-resize" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"><span class="e-img-inner" contenteditable="true">Caption</span></span></span> </p>`
        });
        done();
    });

    it('EJ2-59670 - Enter Key press at the start of the image with caption', function (): void {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.focusNode');
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 0, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.element.querySelectorAll('img').length === 1).toBe(true);
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe('EJ2-62208 - Enter Key press when the content is heading', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            enterKey: 'P',
            value: `<h1 class="focusNode">Heading﻿﻿<br></h1>`
        });
        done();
    });

    it('Enter Key press at the start of the heading', function (): void {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.focusNode').childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 0, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.element.querySelectorAll('h1').length === 2).toBe(true);
    });

    it('Enter Key press at the middle of the heading', function (): void {
        rteObj.value = `<h1 class="focusNode">Heading﻿﻿<br></h1>`;
        rteObj.inputElement.innerHTML = `<h1 class="focusNode">Heading﻿﻿<br></h1>`;
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.focusNode').childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 4, 4);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML === '<h1 class="focusNode">Head</h1><h1 class="focusNode">ing﻿﻿<br></h1>').toBe(true);
    });

    it('Enter Key press at the end of the heading', function (): void {
        rteObj.value = `<h1 class="focusNode">Heading1&#xFEFF;&#xFEFF;<br></h1>`;
        rteObj.inputElement.innerHTML = `<h1>Heading1&#xFEFF;&#xFEFF;<br></h1>`;
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.focusNode').childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 8, 8);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML === '<h1 class="focusNode">Heading1</h1><p>﻿﻿<br><br></p>').toBe(true);
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe('EJ2-62206 - Enter Key press at the start of the line with multiple format', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            enterKey: 'P',
            value: `<p><strong>&ZeroWidthSpace;<em>&ZeroWidthSpace;<span style="text-decoration: underline;">&ZeroWidthSpace;<span style="text-decoration: line-through;">&ZeroWidthSpace;<span style="background-color: rgb(255, 255, 0);" class="focusNode">&ZeroWidthSpace;d</span></span></span></em></strong></p>`
        });
        done();
    });

    it('EJ2-62206 - typing come content to remove the non zero width space', function (): void {
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
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode.childNodes[0], startNode.childNodes[0], 2, 2);
        expect(rteObj.inputElement.innerHTML.length === 215).toBe(true);
        (<any>rteObj).keyUp(keyboardEventArgsLetter);
        expect(rteObj.inputElement.innerHTML.length === 210).toBe(true);
    });

    it('EJ2-62206 - typing come content after pressing enter on empty multiple format first line', function (): void {
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
        expect(rteObj.inputElement.innerHTML === `<p><strong>​<em>​<span style="text-decoration: underline;">​<span style="text-decoration: line-through;">​<span style="background-color: rgb(255, 255, 0);">​</span></span></span></em></strong></p><p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span class="focusNode" style="background-color: rgb(255, 255, 0);"><br></span></span></span></em></strong></p>`).toBe(true);
    });

    it('EJ2-62206 - pressing enter at the start of the multiple format first line ', function (): void {
        rteObj.value = `<p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);" class="focusNode">Hello</span></span></span></em></strong></p>`;
        rteObj.inputElement.innerHTML = `<p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);" class="focusNode">Hello</span></span></span></em></strong></p>`;
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.focusNode').childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 0, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML === '<p><br></p><p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);" class="focusNode">Hello</span></span></span></em></strong></p>').toBe(true);
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe('Enter Key press just outside the table at the start', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            enterKey: 'P',
            value: `<table class="e-rte-table focusNode" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>`
        });
        done();
    });

    it('EJ2-62210 - Enter Key press just outside the table at the start when P is configured', function (): void {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.focusNode');
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 0, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML === `<p><br></p><table class="e-rte-table focusNode" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>`).toBe(true);
    });

    it(' Enter Key press just outside the table at the start when BR is configured', function (): void {
        rteObj.enterKey = 'BR';
        rteObj.value = `<table class="e-rte-table focusNode" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>`;
        rteObj.inputElement.innerHTML = `<table class="e-rte-table focusNode" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>`;
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.focusNode');
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 0, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML === `<br><table class="e-rte-table focusNode" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>`).toBe(true);
    });
    
    it('EJ2-62200 - Enter Key press just outside the table at the end of the table when P is configured', function (): void {
        rteObj.enterKey = 'P';
        rteObj.value = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>`;
        rteObj.inputElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>`;
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement;
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 1, 1);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML === `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p><br></p>`).toBe(true);
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe( 'EJ2-62198 Place holder displayed again when focusing out after pressing enter key on empty editor', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
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
        rteObj.dataBind();
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
        ( <any>rteObj ).keyDown( keyboardEventArgs );
        let spanElemement: HTMLElement = document.querySelector( '.e-rte-placeholder' );
        expect( spanElemement.classList.contains('e-placeholder-enabled') ).toBe( false );
        rteObj.focusOut();
        expect( spanElemement.classList.contains('e-placeholder-enabled') ).toBe( false );
    } );
} );

describe('Enter Key press after pressing shift+enter in a line', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            enterKey: 'P',
            value: `<p>line 1</p><p>line 2</p><p class="focusNode">line 3<br><br></p>`
        });
        done();
    });

    it('EJ2-62211 - Enter Key press after pressing shift+enter in a line', function (): void {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.focusNode').childNodes[2];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 0, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML === `<p>line 1</p><p>line 2</p><p class="focusNode">line 3<br></p><p><br></p>`).toBe(true);
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe('Enter Key press multiple whole lines', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            enterKey: 'P',
            value: `<p class="startNode">Line 1</p><p>Line 2</p><p class="endNode">Line 3</p><p>Line 4</p>`
        });
        done();
    });

    it('EJ2-62202 - Enter Key press multiple line select as a whole', function (): void {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.startNode').childNodes[0];
        const endNode: any = rteObj.inputElement.querySelector('.endNode').childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, endNode, 0, 6);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML === `<p><br></p><p class="endNode"><br></p><p>Line 4</p>`).toBe(true);
    });

    it(' EJ2-62202 - Enter Key press multiple line select as a whole when multiple formats are applied', function (): void {
        rteObj.value = `<p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);" class="startNode">Line 1</span></span></span></em></strong></p><p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);">Line 2</span></span></span></em></strong></p><p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);" class="endNode">Line 3</span></span></span></em></strong></p><p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);">Line 4</span></span></span></em></strong></p>`;
        rteObj.inputElement.innerHTML = `<p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);" class="startNode">Line 1</span></span></span></em></strong></p><p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);">Line 2</span></span></span></em></strong></p><p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);" class="endNode">Line 3</span></span></span></em></strong></p><p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);">Line 4</span></span></span></em></strong></p>`;
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.startNode').childNodes[0];
        const endNode: any = rteObj.inputElement.querySelector('.endNode').childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, endNode, 0, 6);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML === `<p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);" class="endNode"><br></span></span></span></em></strong></p><p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);" class="endNode"><br></span></span></span></em></strong></p><p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="background-color: rgb(255, 255, 0);">Line 4</span></span></span></em></strong></p>`).toBe(true);
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe('Enter Key press multiple line when BR configured', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            enterKey: 'BR',
            value: `Line 1<br>Line 2<br>Line 3<br>Line 4<br>Line 5`
        });
        done();
    });

    it('EJ2-62201 - Enter Key press multiple line when start is at one line which is in middle and end is a whole line', function (): void {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.childNodes[4];
        const endNode: any = rteObj.inputElement.childNodes[6];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, endNode, 1, 6);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML === `Line 1<br>Line 2<br>L<br><br>Line 5`).toBe(true);
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe('BLAZ-25076 - Enter Key press after after the video element', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            enterKey: 'P',
            value: `<p class="focusNode">He<span class="e-video-wrap" contenteditable="false" title="movie.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="blob:null/abc6ccd2-601f-47c2-880d-110d93148793" type="video/mp4"></video></span><br>llo</p>`
        });
        done();
    });

    it('BLAZ-25076 - Enter Key press after after the video element', function (): void {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.focusNode');
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 2, 2);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML === `<p class="focusNode">He<span class="e-video-wrap" contenteditable="false" title="movie.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="blob:null/abc6ccd2-601f-47c2-880d-110d93148793" type="video/mp4"></video></span></p><p><br>llo</p>`).toBe(true);
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe('BLAZ-25076 - Enter Key press after after the audio element', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            enterKey: 'P',
            value: `<p class="focusNode">He<span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickelem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="blob:null/6d26d52f-18d7-4876-8fdf-2df84324842b" type="audio/mp3"></audio></span></span></p><p><br>llo</p>`
        });
        done();
    });

    it('BLAZ-25076 - Enter Key press after after the audio element', function (): void {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.focusNode');
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 2, 2);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML === `<p class="focusNode">He<span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickelem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="blob:null/6d26d52f-18d7-4876-8fdf-2df84324842b" type="audio/mp3"></audio></span></span></p><p><br></p><p><br>llo</p>`).toBe(true);
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe( 'EJ2-62200 Cursor position is wrong when pressing enter in the empty line when BR is configured as enter key.', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeEach( () => {
        rteObj = renderRTE( {
            height: '200px',
            enterKey: "BR",
            value: 'Text',
        } );
    } );
    afterEach( () => {
        destroy( rteObj );
    } );
    it( 'Enter at start of Text', () => {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.childNodes[ 0 ];
        const sel: void = new NodeSelection().setCursorPoint(
            document, startNode, 0 );
        let cursorElem: HTMLElement;
        ( <any>rteObj ).keyDown( keyboardEventArgs );
        cursorElem = document.querySelector( 'br' );
        expect( cursorElem.nextSibling.textContent === "Text" ).toBe( true );
    } );
    it( 'Enter at start of Empty node with Text as next', () => {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.childNodes[ 0 ];
        const sel: void = new NodeSelection().setCursorPoint(
            document, startNode, 0 );
        let cursorElem: HTMLElement;
        ( <any>rteObj ).keyDown( keyboardEventArgs );
        cursorElem = rteObj.inputElement.childNodes[ 0 ] as HTMLElement;
        const sel2: void = new NodeSelection().setCursorPoint(
            document, cursorElem, 0 );
        ( <any>rteObj ).keyDown( keyboardEventArgs );
        expect( cursorElem.previousElementSibling === null && cursorElem.textContent.length === 0 ).toBe( true );
    } );
} );

describe('EJ2-63855 Table Enter Key Testing when frist element as inline element ', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeEach((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            enterKey: 'P',
            value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-resize e-img-focus" alt="icons8-delete-file-100.png" width="auto" height="auto" style="min-width: 0px; max-width: 1455px; min-height: 0px;"></td><td style="width: 33.3333%;" class=""><strong class="e-rte-strong-element">strong</strong></td><td style="width: 33.3333%;" class=""><span class="e-rte-span-element" style="font-size: 14pt;">span</span></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>`
        });
        done();
    });
    it('Enter Key testing in table when strong element in frist node of TD is configured', function (): void {
        rteObj.dataBind();
        const startNode: any = rteObj.inputElement.querySelector('.e-rte-image');
        const sel: void = new NodeSelection().setCursorPoint(document, startNode, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML === '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-resize e-img-focus" alt="icons8-delete-file-100.png" width="auto" height="auto" style="min-width: 0px; max-width: 1455px; min-height: 0px;"></td><td style="width: 33.3333%;" class=""><strong class="e-rte-strong-element">strong</strong></td><td style="width: 33.3333%;" class=""><span class="e-rte-span-element" style="font-size: 14pt;">span</span></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>').toBe(true);
    });
    afterEach(() => {
        destroy(rteObj);
    });
});

describe( 'EJ2-64636 Duplicate text is created when deleting different nodes and pressing enter', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
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
    it( 'Duplicate text is created when deleting different nodes and pressing enter', () => {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.childNodes[1].childNodes[0].childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(document, startNode, 0);
        let cursorElem: HTMLElement;
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML === `<p>Hello</p><p><br></p><p><span style="background-color: unset; text-align: inherit;" class="focusNode">Syncfusion</span><br></p>` ).toBe(true);
    });
});

describe( '874048 Pressing enter key when the cursor is focused on the image caption', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeEach(() => {
        rteObj = renderRTE( {
            height: '200px',
            enterKey: "P",
            value: '<p>RTE content&nbsp;<span class="e-img-caption e-rte-img-caption e-caption-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline" alt="ASmall_Image" width="auto" height="auto" style="min-width: 0px; max-width: 1085px; min-height: 0px;"><span class="e-img-inner" contenteditable="true">Caption</span></span></span>  with image</p>',
        } );
    });
    afterEach(() => {
        destroy(rteObj);
    });
    it( 'Pressing enter key when the cursor is focused on the image caption', () => {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.e-img-inner');
        const sel: void = new NodeSelection().setCursorPoint(document, startNode.childNodes[0], 2);
        let cursorElem: HTMLElement;
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML === `<p>RTE content&nbsp;<span class="e-img-caption e-rte-img-caption e-caption-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline" alt="ASmall_Image" width="auto" height="auto" style="min-width: 0px; max-width: 1085px; min-height: 0px;"><span class="e-img-inner" contenteditable="true">Caption</span></span></span> with image</p>`).toBe(true);
    });
});

describe('EJ2-65987 - Image duplicated when pressing enter',() => {
    let rteObj: RichTextEditor;
    let innerHTML: string = `<p><br></p><p>&nbsp;<img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline" alt="RTEImage-Feather.png" width="auto" height="auto" style="min-width: 0px; max-width: 1455px; min-height: 0px;"> </p>`;
    beforeAll(() => {
        rteObj = renderRTE({
            value: innerHTML
        });
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('check image duplicated when pressing enter',() => {
        (rteObj as any).inputElement.focus();
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document,(rteObj as any).inputElement.childNodes[0].firstChild,(rteObj as any).inputElement.childNodes[0].firstChild, 0, 0);
        (rteObj as any).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML==`<p><br></p><p><br></p><p>&nbsp;<img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline" alt="RTEImage-Feather.png" width="auto" height="auto" style="min-width: 0px; max-width: 1455px; min-height: 0px;"> </p>`).toBe(true);
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
    it('audio focus and enter key press',() => {
        (rteObj as any).inputElement.focus();
        let startNode = (rteObj as any).inputElement.querySelector('.e-audio-wrap');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode, startNode, 0, 1);
        (rteObj as any).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML==`<p><b>Get started Quick Toolbar to click on an audio</b></p><p>By using the quick toolbar, users can replace, display, and delete the selected an audio.</p><p><br></p><p><span class="e-audio-wrap" contenteditable="false"><span class="e-clickelem"><audio controls="" class="e-rte-audio e-audio-inline"> <source src="https://assets.mixkit.co/sfx/preview/mixkit-rain-and-thunder-storm-2390.mp3" type="audio/mp3"> </audio></span></span><br> </p><p>Rich Text Editor allows inserting video and audio from online sources as well as the local computers where you want to insert a video and audio in your content.</p><p><b>Get started Quick Toolbar to click on a video</b></p><p>By using the quick toolbar, users can replace, align, display, dimension, and delete the selected a video.</p><p> <span class="e-video-wrap" contenteditable="false"><video controls="" class="e-rte-video e-video-inline"> <source src="https://www.w3schools.com/tags/movie.mp4" type="video/mp4"> </video></span><br> </p>`).toBe(true);
    });

    it('video focus and enter key press',() => {
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
        (rteObj as any).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML==`<p><b>Get started Quick Toolbar to click on an audio</b></p><p>By using the quick toolbar, users can replace, display, and delete the selected an audio.</p><p> <span class="e-audio-wrap" contenteditable="false"><span class="e-clickelem"><audio controls="" class="e-rte-audio e-audio-inline"> <source src="https://assets.mixkit.co/sfx/preview/mixkit-rain-and-thunder-storm-2390.mp3" type="audio/mp3"> </audio></span></span><br> </p><p>Rich Text Editor allows inserting video and audio from online sources as well as the local computers where you want to insert a video and audio in your content.</p><p><b>Get started Quick Toolbar to click on a video</b></p><p>By using the quick toolbar, users can replace, align, display, dimension, and delete the selected a video.</p><p><br></p><p><span class="e-video-wrap" contenteditable="false"><video controls="" class="e-rte-video e-video-inline"> <source src="https://www.w3schools.com/tags/movie.mp4" type="video/mp4"> </video></span><br></p>`).toBe(true);
    });

    it('audio dynamically inserted and focus and enter key press',() => {
        rteObj.value = `<p><b>Get started Quick Toolbar to click on an audio</b></p><p>By using the quick toolbar, users can replace, dis<span class="e-audio-wrap" contenteditable="false" title="mixkit-rain-and-thunder-storm-2390.mp3"><span class="e-clickelem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="blob:null/72bb961a-c785-4d4a-b94d-9b5701292c3b" type="audio/mp3"></audio></span></span><br>play, and delete the selected an audio</p><p>Rich Text Editor allows inserting video and audio from online sources as well as the local 
        computers where you want to insert a video and audio in your content.</p><p><b>Get started Quick Toolbar to click on a video</b></p><p>By using the quick toolbar, users can replace,
        align, display, dimension, and delete the selected a video.</p>`;
        rteObj.dataBind();
        (rteObj as any).inputElement.focus();
        let startNode = (rteObj as any).inputElement.querySelector('.e-audio-wrap');
         rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode, startNode, 0, 1);
        (rteObj as any).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML==`<p><b>Get started Quick Toolbar to click on an audio</b></p><p>By using the quick toolbar, users can replace, dis</p><p><span class="e-audio-wrap" contenteditable="false" title="mixkit-rain-and-thunder-storm-2390.mp3"><span class="e-clickelem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="blob:null/72bb961a-c785-4d4a-b94d-9b5701292c3b" type="audio/mp3"></audio></span></span><br>play, and delete the selected an audio</p><p>Rich Text Editor allows inserting video and audio from online sources as well as the local computers where you want to insert a video and audio in your content.</p><p><b>Get started Quick Toolbar to click on a video</b></p><p>By using the quick toolbar, users can replace, align, display, dimension, and delete the selected a video.</p>`).toBe(true);
    });

    it('video dynamically inserted and focus and enter key press',() => {
        rteObj.value = `<p><b>Get started Quick Toolbar to click on an audio</b></p><p>By using the quick toolbar, users can replace, display, and delete the selected an audio.</p><p>Rich Text Editor allows inserting video and audio from online sources as well as the local 
        computers where you want to insert a video and audio in your content.</p><p><b>Get started Quick Toolbar to click on a video</b></p><p>By using the quick toolbar, users can replace,
        al<span class="e-video-wrap" contenteditable="false" title="movie.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="blob:null/0f59173c-61bf-42d9-84e9-bb9560da2714" type="video/mp4"></video></span><br>ign, display, dimension, and delete the selected a video.</p>`;
        rteObj.dataBind();
        (rteObj as any).inputElement.focus();
        let startNode = (rteObj as any).inputElement.querySelector('.e-video-wrap');
         rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode, startNode, 0, 1);
        (rteObj as any).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML==`<p><b>Get started Quick Toolbar to click on an audio</b></p><p>By using the quick toolbar, users can replace, display, and delete the selected an audio.</p><p>Rich Text Editor allows inserting video and audio from online sources as well as the local computers where you want to insert a video and audio in your content.</p><p><b>Get started Quick Toolbar to click on a video</b></p><p>By using the quick toolbar, users can replace, al</p><p><span class="e-video-wrap" contenteditable="false" title="movie.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="blob:null/0f59173c-61bf-42d9-84e9-bb9560da2714" type="video/mp4"></video></span><br>ign, display, dimension, and delete the selected a video.</p>`).toBe(true);
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
    it( 'Test for Enter key press before video' , () =>{
        rteObj.focusIn();
        let range: Range = new Range();
        const contentElem : HTMLElement = document.body.querySelector('.e-content');
        range.setStart( contentElem.firstElementChild,0 );
        range.setEnd( contentElem.firstElementChild,0 );
        rteObj.formatter.editorManager.nodeSelection.setRange(document, range);
        (rteObj as any).keyDown(keyboardEventArgs);
        const corrrectElemString : string = `<p><br></p><p><span class="e-video-wrap" contenteditable="false"><video controls="" class="e-rte-video e-video-inline"><source src="https://www.w3schools.com/tags/movie.mp4" type="video/mp4"></video></span><br></p>`;
        expect(rteObj.inputElement.innerHTML === corrrectElemString ).toBe(true);
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
    it(' Test for Enter key press before audio', () => {
        rteObj.focusIn();
        let range: Range = new Range();
        const contentElem : HTMLElement = document.body.querySelector('.e-content');
        range.setStart( contentElem.firstElementChild,0 );
        range.setEnd( contentElem.firstElementChild,0 );
        rteObj.formatter.editorManager.nodeSelection.setRange(document, range);
        (rteObj as any).keyDown(keyboardEventArgs);
        const corrrectElemString : string = `<p><br></p><p><span class="e-audio-wrap" style="width:300px; margin:0 auto;" contenteditable="false"><span class="e-clickelem"><audio controls="" class="e-rte-audio e-audio-inline"><source src="https://assets.mixkit.co/sfx/preview/mixkit-rain-and-thunder-storm-2390.mp3" type="audio/mp3"></audio></span></span><br></p>`;
        expect(rteObj.inputElement.innerHTML === corrrectElemString ).toBe(true);
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
    it(' check for Enter key press end of the list', () => {
        rteObj.focusIn();
        let range: Range = new Range();
        const contentElem : HTMLElement = rteObj.inputElement.querySelectorAll("ol")[0].childNodes[1] as HTMLElement;
        range.setStart( contentElem,0 );
        range.setEnd( contentElem,0 );
        rteObj.formatter.editorManager.nodeSelection.setRange(document, range);
        (rteObj as any).keyDown(keyboardEventArgs);
        const corrrectElemString : string = `<ol><li><span class="e-video-wrap" contenteditable="false"><video controls="" class="e-rte-video e-video-inline"> <source src="https://www.w3schools.com/tags/movie.mp4" type="video/mp4"> </video></span><br></li></ol><p><br></p>`;
        expect(rteObj.inputElement.innerHTML === corrrectElemString ).toBe(true);
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
    it(' check for Enter key press end of the list', () => {
        rteObj.dataBind();
        rteObj.focusIn();
        let cursorElem: HTMLElement;
        cursorElem = rteObj.inputElement.querySelector('ul li:nth-child(2)');
        const sel: void = new NodeSelection().setCursorPoint(document,cursorElem, 1);
        (rteObj as any).keyDown(keyboardEventArgs);
        const corrrectElemString : string = `LI`;
        expect(rteObj.inputElement.lastChild.childNodes[1].nodeName === corrrectElemString ).toBe(true);
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
        (<HTMLElement>document.querySelector('[title="Insert Video (Ctrl+Alt+V)"]')as HTMLElement).click()
        let dialogEle: any = rteObj.element.querySelector('.e-dialog');
        (dialogEle.querySelector('.e-embed-video-url') as HTMLInputElement).value = '<iframe width="560" height="315" src="https://www.youtube.com/embed/H661HyVGu7I?si=ROQf-Grd6u37RlX6" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
        (dialogEle.querySelector('.e-embed-video-url') as HTMLElement).dispatchEvent(new Event("input"));
        (<HTMLElement>document.querySelector('.e-insertVideo') as HTMLElement).click();
        setTimeout(() => {
            sel = new NodeSelection().setSelectionText(document, startNode, startNode, 0, 0);
            (<any>rteObj).keyDown(keyboardEventArgs);
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
        (<HTMLElement>document.querySelector('[title="Insert Video (Ctrl+Alt+V)"]')as HTMLElement).click()
        let dialogEle: any = rteObj.element.querySelector('.e-dialog');
        (dialogEle.querySelector('.e-embed-video-url') as HTMLInputElement).value = '<iframe width="560" height="315" src="https://www.youtube.com/embed/H661HyVGu7I?si=ROQf-Grd6u37RlX6" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
        (dialogEle.querySelector('.e-embed-video-url') as HTMLElement).dispatchEvent(new Event("input"));
        (<HTMLElement>document.querySelector('.e-insertVideo') as HTMLElement).click();
        setTimeout(() => {
            sel = new NodeSelection().setSelectionText(document, startNode, startNode, 0, 0);
            (<any>rteObj).keyDown(keyboardEventArgs);
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
        (<HTMLElement>document.querySelector('[title="Insert Video (Ctrl+Alt+V)"]')as HTMLElement).click()
        let dialogEle: any = rteObj.element.querySelector('.e-dialog');
        (dialogEle.querySelector('.e-embed-video-url') as HTMLInputElement).value = '<iframe width="560" height="315" src="https://www.youtube.com/embed/H661HyVGu7I?si=ROQf-Grd6u37RlX6" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
        (dialogEle.querySelector('.e-embed-video-url') as HTMLElement).dispatchEvent(new Event("input"));
        (<HTMLElement>document.querySelector('.e-insertVideo') as HTMLElement).click();
        setTimeout(() => {
            sel = new NodeSelection().setSelectionText(document, startNode, startNode, 0, 0);
            (<any>rteObj).keyDown(keyboardEventArgs);
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
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(document.querySelectorAll('.e-audio-wrap').length === 1).toBe(true);
        done();
    });
});

describe('850231 - Enter key press does not copy the styles content of Previous block Node', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            enterKey: 'P',
            value: `<p class="firstNode" style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Search" title="Google Search"><span style="color:#3366CC;">Google Search</span></a>&nbsp;–\na&nbsp;<a href="https://en.wikipedia.org/wiki/Search_engine" title="Search engine"><span style="color:#3366CC;">web search engine</span></a>&nbsp;and\nGoogle's core product.</span></p><p  class="focusNode" style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Alerts" title="Google Alerts"><span style="color:#3366CC;">Google Alerts</span></a>&nbsp;–\nan email notification service that sends alerts based on chosen search terms\nwhenever it finds new results. Alerts include web results, Google Groups\nresults, news and videos.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Assistant" title="Google Assistant"><span style="color:#3366CC;">Google Assistant</span></a>&nbsp;–\na&nbsp;<a href="https://en.wikipedia.org/wiki/Virtual_assistant"><span style="color:#3366CC;">virtual assistant</span></a>.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Books" title="Google Books"><span style="color:#3366CC;">Google Books</span></a>&nbsp;–\na search engine for books.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Dataset_Search" title="Google Dataset Search"><span style="color:#3366CC;">Google Dataset Search</span></a>&nbsp;–\nallows searching for datasets in data repositories and local and national\ngovernment websites.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Flights" title="Google Flights"><span style="color:#3366CC;">Google Flights</span></a>&nbsp;–\na search engine for flight tickets.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Images" title="Google Images"><span style="color:#3366CC;">Google Images</span></a>&nbsp;–\na search engine for images online.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Shopping" title="Google Shopping"><span style="color:#3366CC;">Google Shopping</span></a>&nbsp;–\na search engine to search for products across online shops.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Travel" title="Google Travel"><span style="color:#3366CC;">Google Travel</span></a>&nbsp;–\na trip planner service.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Videos" title="Google Videos"><span style="color:#3366CC;">Google Videos</span></a>&nbsp;–\na search engine for videos.</span></p><p><br></p>`
        });
        done();
    });
    it('Press enter at the start of the container', function (): void {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.firstNode');
        const sel: void = new NodeSelection().setCursorPoint(
            document, startNode.childNodes[0], 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.querySelector('p').nextElementSibling.hasAttribute('style'));
        //Testing if undo is properly saved the data when enter click for the first time.
        const tempElem: HTMLElement = createElement('div');
        tempElem.appendChild(rteObj.formatter.editorManager.undoRedoManager.undoRedoStack[0].text as DocumentFragment)
        expect(tempElem.innerHTML === `<p class="firstNode" style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Search" title="Google Search"><span style="color:#3366CC;">Google Search</span></a>&nbsp;– a&nbsp;<a href="https://en.wikipedia.org/wiki/Search_engine" title="Search engine"><span style="color:#3366CC;">web search engine</span></a>&nbsp;and Google's core product.</span></p><p class="focusNode" style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Alerts" title="Google Alerts"><span style="color:#3366CC;">Google Alerts</span></a>&nbsp;– an email notification service that sends alerts based on chosen search terms whenever it finds new results. Alerts include web results, Google Groups results, news and videos.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Assistant" title="Google Assistant"><span style="color:#3366CC;">Google Assistant</span></a>&nbsp;– a&nbsp;<a href="https://en.wikipedia.org/wiki/Virtual_assistant"><span style="color:#3366CC;">virtual assistant</span></a>.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Books" title="Google Books"><span style="color:#3366CC;">Google Books</span></a>&nbsp;– a search engine for books.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Dataset_Search" title="Google Dataset Search"><span style="color:#3366CC;">Google Dataset Search</span></a>&nbsp;– allows searching for datasets in data repositories and local and national government websites.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Flights" title="Google Flights"><span style="color:#3366CC;">Google Flights</span></a>&nbsp;– a search engine for flight tickets.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Images" title="Google Images"><span style="color:#3366CC;">Google Images</span></a>&nbsp;– a search engine for images online.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Shopping" title="Google Shopping"><span style="color:#3366CC;">Google Shopping</span></a>&nbsp;– a search engine to search for products across online shops.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Travel" title="Google Travel"><span style="color:#3366CC;">Google Travel</span></a>&nbsp;– a trip planner service.</span></p><p style="margin-bottom:1.2pt;\nline-height:200%;background:white;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.5pt;line-height:\n200%;font-family:&quot;Arial&quot;,sans-serif;\ncolor:#202122;"><a href="https://en.wikipedia.org/wiki/Google_Videos" title="Google Videos"><span style="color:#3366CC;">Google Videos</span></a>&nbsp;– a search engine for videos.</span></p><p><br></p>`).toBe(true);
    });
    it('Press enter at the middle of the container', function (): void {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.firstNode');
        const sel: void = new NodeSelection().setCursorPoint(
                document, startNode.childNodes[0], 2);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.querySelector('p').nextElementSibling.hasAttribute('style'));
    });
    it('Press enter at the end of the container', function (): void {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.focusNode');
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode.childNodes[0], startNode.childNodes[0], 0, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.querySelector('p').nextElementSibling.hasAttribute('style'));
    });
    afterAll(() => {
        destroy(rteObj);
    });
});

describe('868816 - The enter key is not working properly in the Rich Text Editor.', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
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
        done();
    });
    it('Press enter at the end of the container', function (): void {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.querySelector('.focusNode');
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode.childNodes[0], startNode.childNodes[0], 0, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.querySelector('.e-rte-table').nextElementSibling.getAttribute('style')).toBe(null);
    });
    afterAll(() => {
        destroy(rteObj);
    });
});

describe('875888 - Enter the key after inserting the mention; its creating two new lines in the Rich Text Editor.', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            value: `<p>Hello <span contenteditable="false" class="e-mention-chip"><a href="mailto:maria@gmail.com" title="maria@gmail.com">@@Maria</a></span>&#8203;</p>
            <p>Welcome to the mention integration with rich text editor demo. Type <code>@@</code> character and tag user from the suggestion list. </p>`,
        });
        done();
    });
    it('Press enter at the end of the zeroWithSpace', function (): void {
        const nodetext: any = rteObj.inputElement.childNodes[0].childNodes[2];
        const sel: void = new NodeSelection().setCursorPoint(document, nodetext, nodetext.length - 1);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML.includes('\u200B')).toBe(false);
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe('878787 - The enter action is not working properly working with the table in the Rich Text Editor.', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            enterKey: 'P',
            saveInterval: 10,
            value: `<table class="e-rte-table focusNode" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table>`
        });
        done();
    });
    it('Enter action when the cursor is before the table.', function (done): void {
        rteObj.focusIn();
        const startNode = rteObj.inputElement.querySelector('.focusNode');
        const sel = new NodeSelection().setSelectionText(document, startNode.parentElement, startNode.parentElement, 0, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(((rteObj.inputElement.firstChild as HTMLElement).innerHTML === '<br>' && rteObj.inputElement.firstChild.nodeName === 'P')).toBe(true);
        done();
    });
    it('Enter action when the cursor is after the table.', function (done) {
        rteObj.focusIn();
        var startNode = rteObj.inputElement.querySelector('.focusNode');
        var sel = new NodeSelection().setSelectionText(document, startNode.parentElement, startNode.parentElement, 2, 2);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML === '<p><br></p><table class="e-rte-table focusNode" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>').toBe(true);
        expect(((rteObj.inputElement.lastChild as HTMLElement).innerHTML === '<br>' && rteObj.inputElement.lastChild.nodeName === 'P')).toBe(true);
        done();
    });
    it('Enter action when the cursor is after the table with the text.', function (done) {
        rteObj.focusIn();
        rteObj.value = `<table class="e-rte-table focusNode" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p>awefqwefqwefqwefeqwfew</p>`;
        rteObj.dataBind();
        var startNode = rteObj.inputElement.querySelector('.focusNode');
        var sel = new NodeSelection().setSelectionText(document, startNode.parentElement, startNode.parentElement, 1, 1);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML === '<table class="e-rte-table focusNode" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p><br></p><p>awefqwefqwefqwefeqwfew</p>').toBe(true);
        done();
    });
    it('Enter action between the two table', function (done) {
        rteObj.focusIn();
        rteObj.value = `<table class="e-rte-table focusNode" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>`;
        rteObj.dataBind();
        var startNode = rteObj.inputElement.querySelector('.focusNode');
        var sel = new NodeSelection().setSelectionText(document, startNode.parentElement, startNode.parentElement, 1, 1);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML === '<table class="e-rte-table focusNode" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p><br></p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>').toBe(true);
        done();
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});

describe('Bug 880237: Bullet list not working properly and throws script error when we use enterKey as "BR" in RichTextEditor', () => {
    let rteObj: RichTextEditor;
    let rteEle: HTMLElement;
    let domSelection: NodeSelection = new NodeSelection();
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: `<ul><li level="1" style="list-style-type: disc;margin-bottom:0in;">One</li><li level="1" style="list-style-type: disc;margin-bottom:0in;">Two</li><li level="1" style="list-style-type: disc;margin-bottom:0in;">Three</li><li level="1" style="list-style-type: disc;margin-bottom:0in;">Four</li></ul>`,
            enterKey: 'BR',
            toolbarSettings: {
                items: ['OrderedList', 'UnorderedList']
            }
        });
        rteEle = rteObj.element;
        done();
    });
    it('Default value when `BR` is configured with UL', function (): void {
        const unorderListEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[1];
        let startElement = rteObj.inputElement.querySelector('ul');
        domSelection.setSelectionText(document, startElement.childNodes[0], startElement.childNodes[3], 0, 1);
        unorderListEle.click();
        unorderListEle.click();
        unorderListEle.click();
        unorderListEle.click();
        expect(!isNullOrUndefined(rteObj.inputElement.querySelector('ul'))).toBe(true);
    });
    it('Default value when `BR` is configured with UL and with more inline tags', function (): void {
        rteObj.value=`<ul><li>One&nbsp;<strong>asdasd</strong></li><li>Two&nbsp;<strong>asdasd</strong></li><li>Three&nbsp;<strong>asdasd</strong></li><li>Four&nbsp;<strong>asdasd</strong></li></ul>`;
        rteObj.dataBind();
        const unorderListEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[1];
        let startElement = rteObj.inputElement.querySelector('ul');
        domSelection.setSelectionText(document, startElement.childNodes[0], startElement.childNodes[3], 0, 1);
        unorderListEle.click();
        unorderListEle.click();
        unorderListEle.click();
        unorderListEle.click();
        expect(!isNullOrUndefined(rteObj.inputElement.querySelector('ul'))).toBe(true);
    });
    it('Default value when `BR` is configured , applying list without selecting', function (): void {
        rteObj.value=`<ul><li>hello&nbsp;<strong>world&nbsp;</strong>&nbsp;this is&nbsp;<strong>&nbsp;ME&nbsp;</strong></li></ul>`;
        rteObj.dataBind();
        const unorderListEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[1];
        unorderListEle.click();
        unorderListEle.click();
        unorderListEle.click();
        unorderListEle.click();
        expect(!isNullOrUndefined(rteObj.inputElement.querySelector('ul'))).toBe(true);
    });
    afterAll(() => {
        destroy(rteObj);
    });
});

describe('884734 : Pasted images get duplicated when using enterKey as BR in RichTextEditor', () => {
    let editor: RichTextEditor
    beforeEach((done: DoneFn) => {
        editor = renderRTE({
            enterKey: 'BR',
            value: `<img alt="image 1" src="/base/spec/content/image/RTEImage-Feather.png" style="width: 450px; height: 300px;" />`
        });
        done();
    });
    afterEach((done: DoneFn) => {
        destroy(editor);
        done();
    });
    it ('Case 1 The cursot at the start of the image', (done: DoneFn) => {
        editor.focusIn();
        const range: Range = document.createRange();
        range.setStart(editor.inputElement.querySelector('img'), 0);
        range.setEnd(editor.inputElement.querySelector('img'), 0);
        const selection: Selection = document.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT));
        editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', ENTERKEY_EVENT_INIT));
        setTimeout(() => {
            expect(window.getSelection().getRangeAt(0).startContainer.nodeName === 'IMG').toBe(true);
            done();
        }, 100);
    });
    it ('Case 2 The cursot at the end of the image', (done: DoneFn) => {
        editor.focusIn();
        const range: Range = document.createRange();
        range.setStart(editor.inputElement, 1);
        range.setEnd(editor.inputElement, 1);
        const selection: Selection = document.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT));
        editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', ENTERKEY_EVENT_INIT));
        setTimeout(() => {
            expect(window.getSelection().getRangeAt(0).startContainer.nodeName === 'BR').toBe(true);
            done();
        }, 100);
    });
    it ('Case 3 The cursot at the start of the image, Multiple enter action', (done: DoneFn) => {
        editor.focusIn();
        const range: Range = document.createRange();
        range.setStart(editor.inputElement.querySelector('img'), 0);
        range.setEnd(editor.inputElement.querySelector('img'), 0);
        const selection: Selection = document.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT));
        editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', ENTERKEY_EVENT_INIT));
        editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT));
        editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', ENTERKEY_EVENT_INIT));
        editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT));
        editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', ENTERKEY_EVENT_INIT));
        setTimeout(() => {
            expect(window.getSelection().getRangeAt(0).startContainer.nodeName === 'IMG').toBe(true);
            done();
        }, 100);
    });
});
describe('924578 - A script error hinders the use of the Enter+Shift key combination to insert a new line after an image, leading to a disrupted user experience', () => {
    let rteObj: RichTextEditor;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: `<p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 50%" class="e-rte-image e-imginline"><br></p>`
        });
        done();
    });
    it('When shift enter is pressed at the middle and then pressing enter at the start of the second line', function (): void {
        rteObj.dataBind();
        rteObj.focusIn();
        const startNode: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, startNode, startNode, 1, 1);
        (<any>rteObj).keyDown(shiftkeyboarArgs);
        expect(rteObj.inputElement.innerHTML===`<p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 50%" class="e-rte-image e-imginline"><br><br></p>`).toBe(true)
    });
    afterAll(() => {
        destroy(rteObj);
    });
});

describe('936623 - Cursor moves to next node instead of creating new element on Enter key press in Rich Text Editor', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            value: `In Rich text Editor, the enter key and shift + enter key actions can be customized using the enterKey and shiftEnterKey APIs. And the possible values are as follows:<ul><li>P - When 'P' is configured, pressing enter or shift + enter will create a 'p' tag</li><li>DIV - When 'DIV' is configured, pressing enter or shift + enter will create a 'div' tag</li><li>BR - When 'BR' is configured, pressing enter or shift + enter will create a 'br' tag</li></ul>`,
            enterKey: "BR",
            shiftEnterKey: "P",
        });
        done();
    });

    it('Press the enter key at the end of the P tag the BR element was created', function (): void {
        const nodetext: any = rteObj.inputElement.childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext, nodetext.textContent.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe(`In Rich text Editor, the enter key and shift + enter key actions can be customized using the enterKey and shiftEnterKey APIs. And the possible values are as follows:<br><br><ul><li>P - When 'P' is configured, pressing enter or shift + enter will create a 'p' tag</li><li>DIV - When 'DIV' is configured, pressing enter or shift + enter will create a 'div' tag</li><li>BR - When 'BR' is configured, pressing enter or shift + enter will create a 'br' tag</li></ul>`);
    });
    afterAll(() => {
        destroy(rteObj);
    });
});

describe('Handle Enter key press on HR element between headers', function () {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll(function (done) {
        rteObj = renderRTE({
            value: '<h1>Header 1</h1><hr><h3>Header 3</h3>'
        });
        done();
    });
    afterAll(function () {
        destroy(rteObj);
    });
    it('Press the Enter key on the HR element between Header 1 and Header 3', () => {
        const nodetext: any = rteObj.inputElement.childNodes[1];
        const sel: void = new NodeSelection().setCursorPoint(document, nodetext, 0);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<h1>Header 1</h1><hr><p><br></p><h3>Header 3</h3>');
    });
});

describe('968970 - Enter key as BR breaks the content when pressing Enter in RichTextEditor', function () {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = false;
    beforeAll(function (done) {
        rteObj = renderRTE({
            enterKey:'BR',
            value: "Hey,<br><br>Thanks for getting in touch. Do you have a copy of what the customer printed, or can you replicate the issue on your end?<br><br>We could definitely go down the track of building a custom report for printing if you would like more control over the layout. Please see the image below for reference.<br><br><img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' class='e-rte-image e-imginline'>",
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
        expect(rteObj.inputElement.innerHTML).toBe('Hey,<br><br>Thanks for getting in touch.<br> Do you have a copy of what the customer printed, or can you replicate the issue on your end?<br><br>We could definitely go down the track of building a custom report for printing if you would like more control over the layout. Please see the image below for reference.<br><br><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline">');
    });
});