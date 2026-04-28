/**
 * showCharCount spec
 */
import { detach, isNullOrUndefined } from '@syncfusion/ej2-base';
import { RichTextEditor } from './../../../../src/index';
import { renderRTE, destroy } from './../../render.spec';

describe('RTE COUNT - showCharCount and maxLength - ', () => {

    describe(' onPropertyChange - ', () => {
        describe(' showCharCount - ', () => {
            let rteObj: RichTextEditor;
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            });

            it(' Test the count value ', () => {
                rteObj = renderRTE({
                    value: '<p>RichTextEditor</p>'
                });
                rteObj.showCharCount = true;
                rteObj.maxLength = 50;
                rteObj.dataBind();
                let countEle: HTMLElement = rteObj.element.querySelector('.e-rte-character-count');
                expect(countEle.innerHTML === '14 / 50').toBe(true);
            });

            it(' Test the count value with error ', () => {
                rteObj = renderRTE({
                    value: '<p>RichTextEditor</p>'
                });
                rteObj.showCharCount = true;
                rteObj.maxLength = 10;
                rteObj.dataBind();
                let countEle: HTMLElement = rteObj.element.querySelector('.e-rte-character-count');
                expect(countEle.innerHTML === '14 / 10').toBe(true);
                expect(countEle.classList.contains('e-error')).toBe(true);
            });
        });
        describe(' valueTemplate - ', () => {
            let rteObj: RichTextEditor;
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            });

            it(' Test the count value ', () => {
                rteObj = renderRTE({
                    valueTemplate: '<p>RichTextEditor</p>'
                });
                rteObj.showCharCount = true;
                rteObj.maxLength = 50;
                rteObj.dataBind();
                let countEle: HTMLElement = rteObj.element.querySelector('.e-rte-character-count');
                expect(countEle.innerHTML === '14 / 50').toBe(true);
            });

            it(' Test the count value with error ', () => {
                rteObj = renderRTE({
                    valueTemplate: '<p>RichTextEditor</p>'
                });
                rteObj.showCharCount = true;
                rteObj.maxLength = 10;
                rteObj.dataBind();
                let countEle: HTMLElement = rteObj.element.querySelector('.e-rte-character-count');
                expect(countEle.innerHTML === '14 / 10').toBe(true);
                expect(countEle.classList.contains('e-error')).toBe(true);
            });
        });
    });
    describe(' PROPERTIES - ', () => {
        describe(' showCharCount - ', () => {
            let rteObj: RichTextEditor;
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            })

            it(' Test the count value ', () => {
                rteObj = renderRTE({
                    value: '<p>RichTextEditor</p>',
                    showCharCount: true,
                    maxLength: 50
                });
                expect(!isNullOrUndefined(rteObj.countModule)).toBe(true);
                let countEle: HTMLElement = rteObj.element.querySelector('.e-rte-character-count');
                expect(countEle.innerHTML === '14 / 50').toBe(true);
            });

            it(' Test the count value with maxLength ', () => {
                rteObj = renderRTE({
                    value: '<p>RichTextEditor</p>',
                    showCharCount: true,
                    maxLength: 10
                });
                let countEle: HTMLElement = rteObj.element.querySelector('.e-rte-character-count');
                expect(countEle.innerHTML === '14 / 10').toBe(true);
                expect(countEle.classList.contains('e-error')).toBe(true);
            });
        });
        describe(' valueTemplate - ', () => {
            let rteObj: RichTextEditor;
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            });

            it(' Test the count value ', () => {
                rteObj = renderRTE({
                    valueTemplate: '<p>RichTextEditor</p>',
                    maxLength: 50,
                    showCharCount: true,
                });
                let countEle: HTMLElement = rteObj.element.querySelector('.e-rte-character-count');
                expect(countEle.innerHTML === '14 / 50').toBe(true);
            });

            it(' Test the count value with error ', () => {
                rteObj = renderRTE({
                    valueTemplate: '<p>RichTextEditor</p>',
                    maxLength: 10,
                    showCharCount: true,
                });
                let countEle: HTMLElement = rteObj.element.querySelector('.e-rte-character-count');
                expect(countEle.innerHTML === '14 / 10').toBe(true);
                expect(countEle.classList.contains('e-error')).toBe(true);
            });
        });
    });
    describe(' PUBLIC METHODS - ', () => {
        describe(' refresh method - ', () => {
            let rteObj: RichTextEditor;
            beforeEach((done: Function) => {
                rteObj = renderRTE({
                    value: '<p>RichTextEditor</p>',
                    showCharCount: true,
                    maxLength: 50
                });
                done();
            });
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            });

            it(' Test - check the count value after refresh the component', () => {
                rteObj.maxLength = 10;
                rteObj.dataBind();
                rteObj.refresh();
                let countEle: HTMLElement = rteObj.element.querySelector('.e-rte-character-count');
                expect(countEle.innerHTML === '14 / 10').toBe(true);
                expect(countEle.classList.contains('e-error')).toBe(true);
            });
        });

        describe(' destroy method - ', () => {
            let rteObj: RichTextEditor;
            beforeEach((done: Function) => {
                rteObj = renderRTE({
                    value: '<p>RichTextEditor</p>',
                    showCharCount: true,
                    maxLength: 50
                });
                done();
            });
            afterEach((done: Function) => {
                detach(rteObj.element);
                done();
            });

            it(' Test - check the count element after destroy the component', () => {
                rteObj.destroy();
                let countEle: HTMLElement = rteObj.element.querySelector('.e-rte-character-count');
                expect(isNullOrUndefined(countEle)).toBe(true);
            });
        });
    });
});