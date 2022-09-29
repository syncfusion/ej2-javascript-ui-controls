/**
 * IFrame - Focus Blur event spec
 */
import { RichTextEditor} from '../../../../src/index';
import { renderRTE, destroy } from '../../render.spec';

describe('RTE IFRAME FOCUS and BLUR EVENTS - ', () => {

    describe(' focus event - ', () => {
        let rteObj: RichTextEditor;
        let focusSpy: jasmine.Spy = jasmine.createSpy('onFocus');
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                },
                focus: focusSpy
            });
            done();
        })
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        })
        it(' Test the component focus ', () => {
            rteObj.focusIn();
            expect(rteObj.element.classList.contains('e-focused')).toBe(true);
            expect(focusSpy).toHaveBeenCalled();
        });
    });

    describe(' blur event - ', () => {
        let rteObj: RichTextEditor;
        let blurSpy: jasmine.Spy = jasmine.createSpy('onBlur');
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                },
                blur: blurSpy
            });
            done();
        })
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        })
        it(' Test the component blur ', () => {
            rteObj.focusIn();
            expect(rteObj.element.classList.contains('e-focused')).toBe(true);
            rteObj.focusOut();
            expect(blurSpy).toHaveBeenCalled();
        });
    });
    
    describe(' change event when save interval is 0- ', () => {
        let rteObj: RichTextEditor;
        let blurSpy: jasmine.Spy = jasmine.createSpy('onBlur');
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                },
                saveInterval: 0,
                change: blurSpy
            });
            done();
        })
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        })
        it(' change event when save interval is 0 and pressing tab key after changing value ', () => {
            rteObj.focusIn();
            rteObj.value = "<p>Hello</p>";
            rteObj.dataBind();
            expect(rteObj.element.classList.contains('e-focused')).toBe(true);
            let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, key: 'Tab', stopPropagation: () => { }, shiftKey: false, which: 9};
            (rteObj as any).keyDown(keyBoardEvent);
            let e: EventListenerOrEventListenerObject;
            (rteObj as any).blurHandler({} as FocusEvent);
            expect(blurSpy).toHaveBeenCalled();
        });
    });
});
