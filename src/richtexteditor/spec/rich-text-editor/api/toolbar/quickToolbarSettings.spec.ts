/**
 * Quick Toolbar Settings spec
 */
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { RichTextEditor } from './../../../../src/index';
import { renderRTE, destroy, dispatchEvent, setCursorPoint } from './../../render.spec';

describe('RTE TOOLBAR - quickToolbarSettings - ', () => {
    describe(' quickToolbarSettings property - actionOnScroll - none ', () => {
        let rteObj: RichTextEditor;
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
                }, 500);
            }, 500);
        });
    });
    describe(' quickToolbarSettings property - actionOnScroll - hide ', () => {
        let rteObj: RichTextEditor;
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
                }, 500);
            }, 500);
        });
    });
});