/**
 * Markdown - showCharCount spec
 */
import { detach, isNullOrUndefined } from '@syncfusion/ej2-base';
import { RichTextEditor } from './../../../../src/index';
import { renderRTE, destroy } from './../../render.spec';

describe('RTE Markdown COUNT - showCharCount and maxLength - ', () => {

    describe(' Default value  - ', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                editorMode: "Markdown",
            });
            done();
        })
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        })
        it(' Test the default value ', () => {
            expect(rteObj.showCharCount === false).toBe(true);
        });
    });

    describe(' onPropertyChange - ', () => {
        describe(' showCharCount - ', () => {
            let rteObj: RichTextEditor;
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            });

            it(' Test the count value ', () => {
                rteObj = renderRTE({
                    editorMode: "Markdown",
                    value: 'RichTextEditor'
                });
                rteObj.showCharCount = true;
                rteObj.maxLength = 50;
                rteObj.dataBind();
                let countEle: HTMLElement = rteObj.element.querySelector('.e-rte-character-count');
                expect(countEle.innerHTML === '14 / 50').toBe(true);
            });

            it(' Test the count value with error ', () => {
                rteObj = renderRTE({
                    editorMode: "Markdown",
                    value: 'RichTextEditor'
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
            })

            it(' Test the count value ', () => {
                rteObj = renderRTE({
                    editorMode: "Markdown",
                    valueTemplate: 'RichTextEditor'
                });
                rteObj.showCharCount = true;
                rteObj.maxLength = 50;
                rteObj.dataBind();
                let countEle: HTMLElement = rteObj.element.querySelector('.e-rte-character-count');
                expect(countEle.innerHTML === '14 / 50').toBe(true);
            });

            it(' Test the count value with error ', () => {
                rteObj = renderRTE({
                    editorMode: "Markdown",
                    valueTemplate: 'RichTextEditor'
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
                    editorMode: "Markdown",
                    value: 'RichTextEditor',
                    showCharCount: true,
                    maxLength: 50
                });
                expect(!isNullOrUndefined(rteObj.countModule)).toBe(true);
                let countEle: HTMLElement = rteObj.element.querySelector('.e-rte-character-count');
                expect(countEle.innerHTML === '14 / 50').toBe(true);
            });

            it(' Test the count value with maxLength ', () => {
                rteObj = renderRTE({
                    editorMode: "Markdown",
                    value: 'RichTextEditor',
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
            })

            it(' Test the count value ', () => {
                rteObj = renderRTE({
                    editorMode: "Markdown",
                    valueTemplate: 'RichTextEditor',
                    maxLength: 50,
                    showCharCount: true,
                });
                let countEle: HTMLElement = rteObj.element.querySelector('.e-rte-character-count');
                expect(countEle.innerHTML === '14 / 50').toBe(true);
            });

            it(' Test the count value with error ', () => {
                rteObj = renderRTE({
                    editorMode: "Markdown",
                    valueTemplate: 'RichTextEditor',
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
                    editorMode: "Markdown",
                    value: 'RichTextEditor',
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
                    editorMode: "Markdown",
                    value: 'RichTextEditor',
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