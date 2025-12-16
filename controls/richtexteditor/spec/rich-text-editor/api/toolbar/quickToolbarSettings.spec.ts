/**
 * Quick Toolbar Settings spec
 */
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { RichTextEditor } from './../../../../src/index';
import { renderRTE, destroy, dispatchEvent, setCursorPoint } from './../../render.spec';
import { BASIC_MOUSE_EVENT_INIT } from '../../../constant.spec';

const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);

const MOUSEUP_EVENT: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);

describe('RTE TOOLBAR - quickToolbarSettings - ', () => {
    describe(' quickToolbarSettings property - actionOnScroll - none ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            document.body.style.height = '150vh';
            rteObj = renderRTE({
                value: `<p><img id="image" alt="Logo" src="https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png" style="width: 300px;">`,
                height: 800
            });
        });
        afterAll(() => {
            destroy(rteObj);
            document.body.style.height = '';
        });

        it(' Test - not hide the quick toolbar while scrolling ', (done) => {
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            setTimeout(() => {
                let image: HTMLElement = rteObj.element.querySelector("#image");
                setCursorPoint(image, 0);
                image.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    window.scrollTo(0, 100);
                    setTimeout(function () {
                        expect(!isNullOrUndefined(document.querySelector(".e-rte-quick-toolbar"))).toBe(true);
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });
    });

    describe(' quickToolbarSettings property - actionOnScroll - hide ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            document.body.style.height = '150vh';
            rteObj = renderRTE({
                value: `<p><img id="image" alt="Logo" src="https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png" style="width: 300px;">`,
                height: 800,
                quickToolbarSettings: { actionOnScroll: 'hide' }
            });
        });
        afterAll(() => {
            destroy(rteObj);
            document.body.style.height = '';
        });
        it(' Test - hide the quick toolbar while scrolling ', (done) => {
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            setTimeout(() => {
                let image: HTMLElement = rteObj.element.querySelector("#image");
                setCursorPoint(image, 0);
                image.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    window.scrollTo(0, 100);
                    setTimeout(function () {
                        expect(isNullOrUndefined(document.querySelector(".e-rte-quick-toolbar"))).toBe(true);
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });
    });
});