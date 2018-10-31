/**
 * KeyBoard renderer spec
 */
import { KeyboardEvents } from './../../../src/rich-text-editor/actions/keyboard';
import { createElement } from '@syncfusion/ej2-base';


import { renderRTE, destroy } from "./../render.spec";

let keyboardEventArgs = {
    preventDefault: function () { },
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    char: '',
    key: '',
    charCode: 22,
    keyCode: 22,
    which: 22,
    code: 22,
    action: ''
};
describe('KeyBoard', () => {
    let keyObj: KeyboardEvents;
    let textArea: HTMLTextAreaElement = <HTMLTextAreaElement>createElement('textarea', {
        id: 'markdown-editor',
        styles: 'width:200px;height:200px'
    });
    beforeAll(() => {
        document.body.appendChild(textArea);
        keyObj = new KeyboardEvents(textArea);
    });
    it('KeyBoard', () => {
        (keyObj as any).keyPressHandler(keyboardEventArgs);
    })
});