/**
 * KeyBoard spec
 */
import { createElement, detach } from '@syncfusion/ej2-base';
import { KeyboardEvents } from './../../../src/rich-text-editor/actions/keyboard';
import { htmlKeyConfig } from './../../../src/common/config';
import { RichTextEditor } from "../../../src/rich-text-editor";
import { INSRT_IMG_EVENT_INIT } from "../../constant.spec";
import { destroy, renderRTE } from "../render.spec";
import { NodeSelection } from '../../../src/selection/index';

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

describe('982113 - Dynamic Property changes for keyConfig', () => {
    let rteObj: RichTextEditor;
    beforeAll(() => {
        rteObj = renderRTE({
            keyConfig: { 'bold': 'ctrl+g' },
            value: '<p id="pnode1">Sample</p>' +
                '<p id="pnode4">Sample</p>' +
                '<p id="pnode2">Sample</p>' +
                '<p id="pnode3">Sample</p>'
        });
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('Dynamic Property changes for keyConfig', () => {
        rteObj.keyConfig = { bold: 'ctrl+g' };
        rteObj.dataBind();
        let nodeSelection: NodeSelection = new NodeSelection();
        let node: HTMLElement = document.getElementById("pnode1");
        nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 1, 1);
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'g', stopPropagation: () => { }, shiftKey: false, which: 71 };
        keyBoardEvent.charCode = 71;
        keyBoardEvent.keyCode = 71;
        keyBoardEvent.bubbles = true;
        rteObj.inputElement.dispatchEvent(new KeyboardEvent('keydown', keyBoardEvent));
        expect(node.childNodes[0].nodeName.toLocaleLowerCase()).toBe('strong');

    });
});

describe('RTE Keyboard shortcut testing', () => {
    let rteObj: RichTextEditor;
    describe('Insert Image Shortcut testing', () => {
        beforeAll((done: Function) => {
            rteObj = renderRTE({});
            done();
        });
        afterAll((done: Function) => {
            rteObj.destroy();
            done();
        });
        it('Check the dialog is open or not', () => {
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(new KeyboardEvent('keydown', INSRT_IMG_EVENT_INIT));
            rteObj.inputElement.dispatchEvent(new KeyboardEvent('keyup', INSRT_IMG_EVENT_INIT));
            expect(rteObj.element.querySelector('.e-rte-img-dialog')).not.toBe(null);
        });
    });
});

describe('Markdown Keyboard shortcut testing', () => {
    let rteObj: RichTextEditor;
    describe('Insert Image Shortcut testing', () => {
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                editorMode: 'Markdown'
            });
            done();
        });
        afterAll((done: Function) => {
            rteObj.destroy();
            done();
        });
        it('Check the dialog is open or not', () => {
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(new KeyboardEvent('keydown', INSRT_IMG_EVENT_INIT));
            rteObj.inputElement.dispatchEvent(new KeyboardEvent('keyup', INSRT_IMG_EVENT_INIT));
            expect(rteObj.element.querySelector('.e-rte-img-dialog')).not.toBe(null);
        });
    });
});