import { DropDownButton } from "@syncfusion/ej2-splitbuttons";
import { RichTextEditor } from "../../../src/rich-text-editor/base/rich-text-editor";
import { BASIC_MOUSE_EVENT_INIT } from "../../constant.spec";
import { destroy, renderRTE, setSelection, dispatchEvent } from "../render.spec";
import { getComponent } from "@syncfusion/ej2-base";

const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);

const MOUSEUP_EVENT: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);

describe('Dropdown Button', ()=> {

    describe('957697: Drop down value not updated for Formats, Font name items of the Quick toolbar.', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: '<p>Text content</p>',
                quickToolbarSettings: {
                    text: ['Formats', 'FontName']
                }
            })
        });
        afterAll(()=> {
            destroy(editor);
        });
        it('Should not have iconcss property configured for the formts and font family dropdown button.', (done: DoneFn)=> {
            editor.focusIn();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('p');
            setSelection(target.firstChild, 1, 2);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const quickToolbar: HTMLElement = document.querySelector('.e-rte-quick-toolbar');
                const formatDropDown: DropDownButton = getComponent(quickToolbar.querySelector('button'), 'dropdown-btn');
                expect(formatDropDown.iconCss).toBe('');
                const fontNameDropDown: DropDownButton = getComponent(quickToolbar.querySelectorAll('button')[1], 'dropdown-btn');
                expect(fontNameDropDown.iconCss).toBe('');
                done();
            }, 100);
        });
    });

    describe('Checking the customized NumberFormatListand BulletFormatList dropdownItems', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['NumberFormatList', 'BulletFormatList']
                },
                value: `<p id="rte">RichTextEditor</p>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
            done();
        });
        it(' Checking the sampleLevel numberFormatList items ', (done) => {
            rteObj.numberFormatList = {
                types: [
                    { text: 'Number', value: 'decimal' },
                    { text: 'UpperAlpha', value: 'upperAlpha' }
                ]
            }
            rteObj.dataBind();
            let format: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList').nextElementSibling) as HTMLElement;
            dispatchEvent(format, 'mousedown');
            dispatchEvent(format, 'mouseup');
            format.click();
            setTimeout(() => {
                let items: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList_dropdownbtn-popup .e-item');
                expect(items[0].textContent === 'Number').toBe(true);
                expect(items[1].textContent === 'UpperAlpha').toBe(true);
                done();
            }, 200)
        });
        it(' Checking the sampleLevel bulletFormatList items ', (done) => {
            rteObj.bulletFormatList = {
                types: [
                    { text: 'None', value: 'none' },
                    { text: 'Square', value: 'square' },
                ]
            }
            rteObj.dataBind();
            let format: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_BulletFormatList').nextElementSibling) as HTMLElement;
            dispatchEvent(format, 'mousedown');
            dispatchEvent(format, 'mouseup');
            format.click();
            setTimeout(() => {
                let items: any = document.querySelectorAll('#' + controlId + '_toolbar_BulletFormatList_dropdownbtn-popup .e-item');
                expect(items[0].textContent === 'None').toBe(true);
                expect(items[1].textContent === 'Square').toBe(true);
                done();
            }, 200)
        });
        afterAll((done: DoneFn) => {
            destroy(rteObj);
            done();
        });
    });

});
