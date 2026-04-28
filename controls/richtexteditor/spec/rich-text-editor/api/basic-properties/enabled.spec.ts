/**
 * enabled spec
 */
import { detach } from '@syncfusion/ej2-base';
import { RichTextEditor } from './../../../../src/index';
import { renderRTE, destroy } from './../../render.spec';

describe('RTE BASIC PROPERTIES - enabled - ', () => {

    describe(' PUBLIC METHODS - ', () => {
        describe(' refresh - ', () => {
            let rteObj: RichTextEditor;
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            })

            it(' Test the e-disabled class to root element after refresh the component', () => {
                rteObj = renderRTE({
                    enabled: false
                });
                rteObj.refresh();
                expect(rteObj.element.classList.contains('e-disabled')).toBe(true);
            });
        });
        describe(' destroy - ', () => {
            let rteObj: RichTextEditor;
            afterEach((done: Function) => {
                detach(rteObj.element);
                done();
            })

            it(' Test the remove the e-disabled class from root element after destroy the component', () => {
                rteObj = renderRTE({
                    enabled: false
                });
                let element: HTMLElement = rteObj.element;
                rteObj.destroy();
                expect(element.classList.contains('e-disabled')).toBe(false);
                expect(element.hasAttribute('aria-disabled')).toBe(false);
            });
        });
    });
});