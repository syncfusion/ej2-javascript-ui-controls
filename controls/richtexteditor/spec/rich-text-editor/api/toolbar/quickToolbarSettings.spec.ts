import { Toolbar, HtmlEditor, RichTextEditor, Count, Link, Image, QuickToolbar } from './../../../../src/index';
import { renderRTE, destroy, dispatchEvent, setCursorPoint } from './../../render.spec';
import { detach, isNullOrUndefined } from '@syncfusion/ej2-base';

RichTextEditor.Inject(HtmlEditor);
RichTextEditor.Inject(Toolbar);
RichTextEditor.Inject(Link);
RichTextEditor.Inject(Count);
RichTextEditor.Inject(Image);
RichTextEditor.Inject(QuickToolbar);

describe('RTE TOOLBAR - quickToolbarSettings - ', () => {
    describe(' quickToolbarSettings property - actionOnScroll - none ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeEach((done: Function) => {
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });

        it(' Test - not hide the quick toolbar while scrolling ', (done) => {
            rteObj = renderRTE({
                value: `<p><img id="image" alt="Logo" src="https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png" style="width: 300px;">`,
                height: 800
            });
            rteObj.quickToolbarSettings = {
                actionOnScroll: 'none'
            };
            rteObj.dataBind();
            controlId = rteObj.element.id;
            let image: HTMLElement = rteObj.element.querySelector("#image");
            setCursorPoint(image, 0);
            dispatchEvent(image, 'mousedown');
            image.click();
            dispatchEvent(image, 'mouseup');
            setTimeout(() => {
                window.scrollTo(0, 100);
                setTimeout(function () {
                    expect(!isNullOrUndefined(document.querySelector(".e-rte-quick-toolbar"))).toBe(true);
                    done();
                }, 100);
            }, 100);
        });
    })
    describe(' quickToolbarSettings property - actionOnScroll - hide ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeEach((done: Function) => {
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });
        it(' Test - hide the quick toolbar while scrolling ', (done) => {
            rteObj = renderRTE({
                value: `<p><img id="image" alt="Logo" src="https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png" style="width: 300px;">`,
                height: 800,
                quickToolbarSettings: { actionOnScroll: 'none' }
            });
            controlId = rteObj.element.id;
            rteObj.quickToolbarSettings = { actionOnScroll: 'hide' };
            rteObj.dataBind();
            let image: HTMLElement = rteObj.element.querySelector("#image");
            setCursorPoint(image, 0);
            dispatchEvent(image, 'mousedown');
            image.click();
            dispatchEvent(image, 'mouseup');
            setTimeout(() => {
                window.scrollTo(0, 100);
                setTimeout(function () {
                    expect(isNullOrUndefined(document.querySelector(".e-rte-quick-toolbar"))).toBe(true);
                    done();
                }, 100);
            }, 100);
        });
    })
})