import { Toolbar, HtmlEditor, RichTextEditor, Count, Link, Image, QuickToolbar, HTMLFormatter } from '../../../../src/index';
import { renderRTE, destroy, dispatchEvent, setCursorPoint } from '../../render.spec';
import { detach, isNullOrUndefined } from '@syncfusion/ej2-base';

RichTextEditor.Inject(HtmlEditor);
RichTextEditor.Inject(Toolbar);
RichTextEditor.Inject(Link);
RichTextEditor.Inject(Count);
RichTextEditor.Inject(Image);
RichTextEditor.Inject(QuickToolbar);

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
});
