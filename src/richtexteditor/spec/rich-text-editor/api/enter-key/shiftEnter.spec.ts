/**
 * Enter Key spec
 */
import { RichTextEditor} from './../../../../src/index';
import { renderRTE, destroy } from './../../render.spec';
import { NodeSelection } from './../../../../src/selection/index';

let keyboardEventArgs = {
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

describe('Shift Enter key support - When `P` is configured', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = true;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            value: '<div>RTE Content</div>',
            shiftEnterKey: 'P'
        });
        done();
    });

    it('Press shift enter at the end of the div tag', function (): void {
        const nodetext: any = rteObj.inputElement.childNodes[0].childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext, nodetext.textContent.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<div>RTE Content</div><p><br></p>');
    });

    afterAll(() => {
        destroy(rteObj);
    });
});

describe('Shift Enter key support - When `DIV` is configured', () => {
    let rteObj: RichTextEditor;
    keyboardEventArgs.shiftKey = true;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            height: '200px',
            value: '<div>RTE Content</div>',
            shiftEnterKey: 'DIV'
        });
        done();
    });

    it('Press shift enter at the end of the div tag', function (): void {
        const nodetext: any = rteObj.inputElement.childNodes[0].childNodes[0];
        const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext, nodetext.textContent.length);
        (<any>rteObj).keyDown(keyboardEventArgs);
        expect(rteObj.inputElement.innerHTML).toBe('<div>RTE Content</div><div><br></div>');
    });

    afterAll(() => {
        destroy(rteObj);
    });
});
