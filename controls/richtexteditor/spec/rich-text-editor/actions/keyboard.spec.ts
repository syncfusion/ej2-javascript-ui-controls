/**
 * KeyBoard spec
 */
import { createElement, detach } from '@syncfusion/ej2-base';
import { KeyboardEvents } from './../../../src/rich-text-editor/actions/keyboard';
import { htmlKeyConfig } from './../../../src/common/config';

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
        id: 'editor',
        styles: 'width:200px;height:200px'
    });
    beforeAll(() => {
        document.body.appendChild(textArea);
        keyObj = new KeyboardEvents(textArea, { keyConfigs: htmlKeyConfig });
    });
    afterAll(() => {
        keyObj.destroy();
        detach(textArea);
    });
    it('KeyBoard', () => {
        (keyObj as any).keyPressHandler(keyboardEventArgs);
    });
    it('KeyBoard - onPropertyChanged method call', () => {
        (keyObj as any).onPropertyChanged ({}, {});
    });
});