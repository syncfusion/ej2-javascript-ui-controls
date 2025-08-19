import { DropDownButton } from "@syncfusion/ej2-splitbuttons";
import { RichTextEditor } from "../../../src/rich-text-editor/base/rich-text-editor";
import { BASIC_MOUSE_EVENT_INIT } from "../../constant.spec";
import { destroy, renderRTE, setSelection } from "../render.spec";
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

});
