import { Toolbar, MarkdownEditor, Count, RichTextEditor, Link, Image, QuickToolbar } from './../../../../src/index';
import { renderRTE, destroy } from './../../render.spec';
import { detach, isNullOrUndefined } from '@syncfusion/ej2-base';

RichTextEditor.Inject(MarkdownEditor);
RichTextEditor.Inject(Toolbar);
RichTextEditor.Inject(Link);
RichTextEditor.Inject(Count);
RichTextEditor.Inject(Image);



describe('RTE Markdown FOCUS and BLUR EVENTS - ', () => {

    describe(' focus event - ', () => {
        let rteObj: RichTextEditor;
        let focusSpy: jasmine.Spy = jasmine.createSpy('onFocus');
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                editorMode: "Markdown",
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
                editorMode: "Markdown",
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
