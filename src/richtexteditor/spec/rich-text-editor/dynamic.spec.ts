import { RichTextEditor } from "../../src/rich-text-editor/base/rich-text-editor";
import { A_KEY_EVENT_INIT, BASIC_MOUSE_EVENT_INIT } from "../constant.spec";
import { destroy, renderRTE, setCursorPoint } from "./render.spec";
import { isNullOrUndefined } from '@syncfusion/ej2-base';

const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);

const MOUSEUP_EVENT: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);

describe('Flaky Test cases', () => {
    describe('EJ2-46060: EJ2CORE-606: 8203 character not removed after start typing', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE({
                value: `<p><strong id='focusNode'>​r</strong></p>`
            });
        });
        it(' Removes the NBSP when A Key is pressed.', (done: Function) => {
            rteObj.focusIn();
            expect((rteObj.element.querySelector('.e-content') as HTMLElement).innerText.search(/\u200B/g) === 0).toBe(true);
            const focusNode = document.getElementById('focusNode');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, focusNode.childNodes[0], focusNode.childNodes[0], 1, 1);
            const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', A_KEY_EVENT_INIT);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', A_KEY_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(keyDownEvent);
            rteObj.inputElement.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                expect((rteObj.element.querySelector('.e-content') as HTMLElement).innerText.search(/\u200B/g) === -1).toBe(true);
                expect((rteObj.element.querySelector('.e-content') as HTMLElement).innerText === 'a').toBe(false);
                expect((rteObj.element.querySelector('.e-content') as HTMLElement).innerHTML).toBe(`<p><strong id="focusNode">r</strong></p>`);
                done();
            }, 100)
        });
        afterEach(() => {
            destroy(rteObj);
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
})