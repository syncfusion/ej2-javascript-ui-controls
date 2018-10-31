/**
 * Service Locator spec
 */
import { RichTextEditor } from '../../../src/rich-text-editor/base/rich-text-editor';
import { renderRTE, destroy } from './../render.spec';

describe('ServiceLocator module', () => {
    let servFunc: Function = () => {
        return 'hi';
    };
    describe('Register and get service', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({});
            elem = rteObj.element;
            rteObj.serviceLocator.register('servFunc', servFunc);
        });

        it('getService testing', () => {
            let fn: Function = rteObj.serviceLocator.getService<Function>('servFunc');
            expect(fn()).toBe('hi');
        });

        it('Register and getService testing', () => {
            rteObj.serviceLocator.register('servFunc', servFunc);
            let fn: Function = rteObj.serviceLocator.getService<Function>('servFunc');
            expect(fn()).toBe('hi');
        });

        it('Check fallback', () => {
            expect(() => rteObj.serviceLocator.getService<Function>('mock')).toThrow('The service mock is not registered');
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

});