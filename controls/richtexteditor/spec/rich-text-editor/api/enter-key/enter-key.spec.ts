/**
 * Enter Key spec
 */
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { RichTextEditor} from './../../../../src/index';
import { renderRTE, destroy } from './../../render.spec';
import { NodeSelection } from './../../../../src/selection/index';

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
        expect(rteObj.inputElement.innerHTML).toBe('<div><strong><br></strong></div><div><strong>​Line 1</strong></div>');
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
        expect(rteObj.inputElement.innerHTML).toBe('<div><strong>​Line 1</strong></div><div><strong><br></strong></div><div><strong>Line 2</strong></div>');
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

    it('Press enter at the end of the line - Style Applied -', function (): void {
        rteObj.value = '<strong>​Line 1</strong>';
        rteObj.inputElement.innerHTML = '<strong>​Line 1</strong>';
        rteObj.dataBind();
        const nodetext: any = rteObj.inputElement.childNodes[0].childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext, nodetext.textContent.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<strong>​Line 1<br><br></strong>');
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
        expect(rteObj.inputElement.innerHTML).toBe('<strong><br>​Line 1</strong>');
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
        expect(rteObj.inputElement.innerHTML).toBe('<strong>​Li<br>ne 1</strong>');
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
        expect(rteObj.inputElement.innerHTML).toBe('<strong>​Line 1<br><br></strong><br><strong>Line 2​</strong>');
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
        expect(rteObj.inputElement.innerHTML).toBe('<strong>​Line 1</strong><br><strong>Li</strong><strong><br>ne 3​</strong>');
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
        expect(rteObj.inputElement.innerHTML).toBe('<p>RTE Content</p><br>');
    });

    it('Press enter by selecting few chars of the p tag', function (): void {
        rteObj.value = '<p>RTE Content</p>';
        rteObj.inputElement.innerHTML = '<p>RTE Content</p>';
        rteObj.dataBind();
        const nodetext: any = rteObj.inputElement.childNodes[0].childNodes[0];
        const sel: void = new NodeSelection().setSelectionText(
            document, nodetext, nodetext, 7, nodetext.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<p>RTE Con</p><br>');
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
        expect(rteObj.inputElement.innerHTML).toBe('<h1>Heading</h1><br>');
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
        expect(rteObj.inputElement.innerHTML).toBe('<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p><p> <br></p>');
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
            value: `<p>RTE Content</p><p>RTE Content</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><p class='focusNode'>RTE Content</p></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>`
        });
        done();
    });

    it('Enter Key testing in table when P is configured and P content is inside', function (): void {
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
        rteObj.value = '<p>RTE Content</p><p>RTE Content</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><p class="focusNode">RTE Content</p></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>';
        rteObj.inputElement.innerHTML = '<p>RTE Content</p><p>RTE Content</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><p class="focusNode">RTE Content</p></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>';
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
        expect(rteObj.inputElement.querySelector('.focusNode').nextElementSibling.tagName === 'BR').toBe(true);
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
            document, startNode.childNodes[0], startNode.childNodes[0], 5, 5);
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
