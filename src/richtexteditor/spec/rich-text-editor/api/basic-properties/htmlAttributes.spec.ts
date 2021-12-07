/**
 * htmlAttributes spec
 */
import { detach } from '@syncfusion/ej2-base';
import { RichTextEditor } from './../../../../src/index';
import { renderRTE } from './../../render.spec';

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