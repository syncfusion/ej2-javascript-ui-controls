/**
 * HTML - readonly spec
 */
import { detach, createElement } from "@syncfusion/ej2-base";
import { RichTextEditor } from './../../../../src/index';
import { renderRTE, destroy } from './../../render.spec';

describe('RTE BASIC PROPERTIES - readonly - ', () => {

    describe(' PUBLIC METHODS - ', () => {

        describe(' destroy - ', () => {
            let rteObj: RichTextEditor;
            afterEach((done: Function) => {
                detach(rteObj.element);
                done();
            })

            it(' Test the readonly class of root element after destroy the component', () => {
                rteObj = renderRTE({ });
                rteObj.readonly = true;
                rteObj.dataBind();
                rteObj.destroy();
                expect(rteObj.element.classList.contains('e-rte-readonly')).toBe(false);
            });
        });

        describe(' selectAll - ', () => {
            let rteObj: RichTextEditor;
            let newEle: HTMLElement = createElement('span');
            afterEach((done: Function) => {
                destroy(rteObj);
                if(document.querySelector('span')) { detach(newEle); }
                done();
            })

            it(' Test the selection in readonly mode', () => {
                rteObj = renderRTE({
                    value: "<p>RichTextEditor</p>"
                });
                let ele: HTMLElement = rteObj.element;
                newEle.innerHTML = "<p>OutSide node</p>";
                ele.parentElement.appendChild(newEle);
                rteObj.selectAll();
                expect(rteObj.getSelection()).toEqual("RichTextEditor");
                document.body.click();
                rteObj.readonly = true;
                rteObj.dataBind();
                rteObj.selectAll();
                expect(rteObj.getSelection()).toBe("RichTextEditor");
            });
            it(' When no content in Rich Text Editor', () => {
                rteObj = renderRTE({
                    value: ''
                });
                rteObj.selectAll();
                expect(rteObj.getSelection()).toEqual('');
            });
        });
    });
});