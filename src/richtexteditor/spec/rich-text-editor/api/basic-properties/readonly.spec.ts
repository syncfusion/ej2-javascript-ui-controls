import { Toolbar, HtmlEditor, RichTextEditor, Link, Image, QuickToolbar } from './../../../../src/index';
import { renderRTE, destroy, dispatchEvent } from './../../render.spec';
import { detach, createElement } from "@syncfusion/ej2-base";

RichTextEditor.Inject(HtmlEditor);
RichTextEditor.Inject(Toolbar);
RichTextEditor.Inject(Link);
RichTextEditor.Inject(Image);
RichTextEditor.Inject(QuickToolbar);

describe('RTE BASIC PROPERTIES - readonly - ', () => {

    describe(' PUBLIC METHODS - ', () => {

        describe(' destroy - ', () => {
            let rteObj: RichTextEditor;
            afterEach((done: Function) => {
                detach(rteObj.element);
                done();
            })

            it(' Test the readonly class of root element after destroy the component', () => {
                rteObj = renderRTE({
                });
                rteObj.readonly = true;
                rteObj.dataBind();
                let ele: HTMLElement = rteObj.element;
                rteObj.destroy();
                expect(rteObj.element.classList.contains('e-rte-readonly')).toBe(false);
            });
        });

        describe(' selectAll - ', () => {
            let rteObj: RichTextEditor;
            afterEach((done: Function) => {
                detach(rteObj.element);
                done();
            })

            it(' Test the selection in readonly mode', () => {
                rteObj = renderRTE({
                    value: "<p>RichTextEditor</p>"
                });
                let ele: HTMLElement = rteObj.element;
                let newEle: HTMLElement = createElement('span');
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
        });
    });
});