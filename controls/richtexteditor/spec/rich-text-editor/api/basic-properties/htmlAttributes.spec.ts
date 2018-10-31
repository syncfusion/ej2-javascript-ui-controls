import { Toolbar, HtmlEditor, RichTextEditor, Link, Image, QuickToolbar } from './../../../../src/index';
import { renderRTE, destroy } from './../../render.spec';
import { isNullOrUndefined, detach } from '@syncfusion/ej2-base';

RichTextEditor.Inject(HtmlEditor);
RichTextEditor.Inject(Toolbar);
RichTextEditor.Inject(Link);
RichTextEditor.Inject(Image);
RichTextEditor.Inject(QuickToolbar);

describe('RTE BASIC PROPERTIES - htmlAttributes - ', () => {

    describe(' PUBLIC METHODS - ', () => {

        describe(' destroy - ', () => {
            let rteObj: RichTextEditor;
            afterEach((done: Function) => {
                detach(rteObj.element);
                done();
            })
            it(' Test the remove the class attribute value after destroy the component ', () => {
                rteObj = renderRTE({
                    htmlAttributes: {
                        class: 'custom-style'
                    }
                });
                let ele: HTMLElement = rteObj.element;
                rteObj.destroy();
                expect(ele.classList.contains('custom-style')).toBe(false);
            });
        });
    });

});