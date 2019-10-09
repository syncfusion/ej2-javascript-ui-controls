/**
 * Renderer Factory spec
 */
import { RichTextEditor } from '../../../src/rich-text-editor/base/rich-text-editor';
import { RenderType } from '../../../src/rich-text-editor/base/enum';
import { RendererFactory } from '../../../src/rich-text-editor/services/renderer-factory';
import { renderRTE, destroy } from './../render.spec';

describe('RendererFactory module', () => {
    describe('Register and get service', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    enable: false
                }
            });
            elem = rteObj.element;
        });

        it('Check fallback', () => {
            expect(() => rteObj.serviceLocator.getService<RendererFactory>('rendererFactory').getRenderer(RenderType.Toolbar)).toThrow('The renderer Toolbar is not found');
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

});