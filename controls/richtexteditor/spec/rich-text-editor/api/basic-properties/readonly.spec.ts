import { Toolbar, HtmlEditor, RichTextEditor, Link, Image, QuickToolbar } from './../../../../src/index';
import { renderRTE, destroy, dispatchEvent } from './../../render.spec';
import { detach } from "@syncfusion/ej2-base";

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
    });
});