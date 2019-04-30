/**
 * InPlace-Editor spec document
 */
import { isNullOrUndefined as isNOU, select, selectAll, createElement, Browser } from '@syncfusion/ej2-base';
import { InPlaceEditor } from '../../src/inplace-editor/base/index';
import * as classes from '../../src/inplace-editor/base/classes';
import { renderEditor, destroy, triggerKeyBoardEvent, safariMobileUA } from './../render.spec';
import { profile, inMB, getMemoryProfile } from './../common.spec';

describe('CR ISSUE InPlace-Editor Control', () => {

    describe('EJ2-23937: Toolbar fails to render properly in RTE In-Place Editor when afterOpen is set.', () => {
        let ele: HTMLElement;
        let editorObj: InPlaceEditor;
        let valueEle: HTMLElement;
        let isAfterOpen: Boolean = false;
        beforeEach(() => {
            let element: HTMLElement = createElement('div', { id: 'EJ2-23937-element' });
            document.body.appendChild(element);
            editorObj = new InPlaceEditor({
                mode: 'Popup',
                type: 'RTE',
                value: 'RichTextEditor',
                name: 'TextEditor',
                popupSettings: {
                    title: 'Edit',
                    model: {
                        width: 300,
                        afterOpen: function (e) {
                            isAfterOpen = true;
                        }
                    }
                }
            });
            editorObj.appendTo('#EJ2-23937-element');
        })
        afterEach((): void => {
            destroy(editorObj);
        });
        it(' Trigger the after open event ', (done) => {
            ele = editorObj.element;
            expect(editorObj.mode).toEqual('Popup');
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            setTimeout(() => {
                expect(selectAll('.' + classes.ROOT_TIP, document.body).length === 1).toEqual(true);
                expect(isAfterOpen).toEqual(true);
                done()
            },200);
        })
    })
})
