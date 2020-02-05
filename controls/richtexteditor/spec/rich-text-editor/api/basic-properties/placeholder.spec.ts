/**
 * placeholder spec
 */
import { RichTextEditor } from './../../../../src/index';
import { renderRTE, destroy, dispatchEvent, dispatchKeyEvent } from './../../render.spec';

describe('RTE Markdown BASIC PROPERTIES - placeholder - ', () => {

    describe(' Default value  - ', () => {
        let rteObj: RichTextEditor;
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        })
        it(' Test the default value ', () => {
            rteObj = renderRTE({
                editorMode: "Markdown",
            });
            expect(rteObj.placeholder === null).toBe(true);
        });
    });
    describe(' PUBLIC METHODS - ', () => {
        describe(' refresh - ', () => {
            let rteObj: RichTextEditor;
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            })
            it(' Test the placeholder element persist after refresh the component ', () => {
                rteObj = renderRTE({
                    editorMode: "Markdown",
                    placeholder: 'Write a content'
                });
                rteObj.refresh();
                expect(rteObj.placeholder === 'Write a content').toBe(true);
                expect((rteObj as any).inputElement.placeholder === 'Write a content').toBe(true);
            });
        });

        describe('getText methods - ', () => {
            let rteObj: RichTextEditor;
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            });
            it(' Test the getText method ', () => {
                rteObj = renderRTE({
                    editorMode: "Markdown",
                    placeholder: 'Write a content'
                });
                expect(rteObj.getText() === '').toBe(true);
            });
        });
    });

    describe(' PROPERTIES - ', () => {

        describe(' Set the placeholder at initial - ', () => {
            let rteObj: RichTextEditor;
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            })
            it(' Test the placeholder element and class ', () => {
                rteObj = renderRTE({
                    editorMode: "Markdown",
                    placeholder: 'Write a content'
                });
                expect(rteObj.placeholder === 'Write a content').toBe(true);
                expect((rteObj as any).inputElement.placeholder === 'Write a content').toBe(true);
            });

            it(' Test the placeholder element disable while value exist ', () => {
                rteObj = renderRTE({
                    editorMode: "Markdown",
                    placeholder: 'Write a content',
                    value: "RTE"
                });
                expect((rteObj as any).inputElement.value === 'RTE').toBe(true);
            });

            it(' Test the placeholder element disable while valueTemplate exist ', () => {
                rteObj = renderRTE({
                    editorMode: "Markdown",
                    placeholder: 'Write a content',
                    valueTemplate: "RTE"
                });
                expect((rteObj as any).inputElement.value === 'RTE').toBe(true);
            });

            it(' Test the placeholder element disable while change the value dynamically ', () => {
                rteObj = renderRTE({
                    editorMode: "Markdown",
                    placeholder: 'Write a content'
                });
                dispatchEvent((rteObj as any).inputElement, 'focusin');
                (rteObj as any).inputElement.value = "RTE";
                dispatchKeyEvent((rteObj as any).inputElement, 'keyup', { 'key': 'a', 'keyCode': 65 });
                dispatchEvent((rteObj as any).inputElement, 'focusout');
                expect((rteObj as any).inputElement.value === 'RTE').toBe(true);

                dispatchEvent((rteObj as any).inputElement, 'focusin');
                (rteObj as any).inputElement.value = "";
                dispatchKeyEvent((rteObj as any).inputElement, 'keyup', { 'key': 'a', 'keyCode': 65 });
                dispatchEvent((rteObj as any).inputElement, 'focusout');
                expect((rteObj as any).inputElement.value === '').toBe(true);
            });
        });
    });

    describe(' onPropertyChange - ', () => {
        let rteObj: RichTextEditor;
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        })
        it(' Test the placeholder element and class ', () => {
            rteObj = renderRTE({
                editorMode: "Markdown",
            });
            rteObj.placeholder = 'Write a content';
            rteObj.dataBind();
            expect(rteObj.placeholder === 'Write a content').toBe(true);
            expect((rteObj as any).inputElement.placeholder === 'Write a content').toBe(true);
        });

        it(' Test the placeholder element disable while value exist ', () => {
            rteObj = renderRTE({
                editorMode: "Markdown",
                value: "RTE"
            });
            rteObj.placeholder = 'Write a content';
            rteObj.dataBind();
            expect((rteObj as any).inputElement.value === 'RTE').toBe(true);
        });

        it(' Test the placeholder element disable while valueTemplate exist ', () => {
            rteObj = renderRTE({
                editorMode: "Markdown",
                valueTemplate: "RTE"
            });
            rteObj.placeholder = 'Write a content';
            rteObj.dataBind();
            expect((rteObj as any).inputElement.value === 'RTE').toBe(true);
        });

        it(' Test the placeholder element disable while value type dynamically and focus out ', () => {
            rteObj = renderRTE({
                editorMode: "Markdown",
            });
            rteObj.placeholder = 'Write a content';
            rteObj.dataBind();
            dispatchEvent((rteObj as any).inputElement, 'focusin');
            (rteObj as any).inputElement.value = "RTE";
            dispatchKeyEvent((rteObj as any).inputElement, 'keyup', { 'key': 'a', 'keyCode': 65 });
            dispatchEvent((rteObj as any).inputElement, 'focusout');
            expect((rteObj as any).inputElement.value === 'RTE').toBe(true);

            dispatchEvent((rteObj as any).inputElement, 'focusin');
            (rteObj as any).inputElement.value = "";
            dispatchKeyEvent((rteObj as any).inputElement, 'keyup', { 'key': 'a', 'keyCode': 65 });
            dispatchEvent((rteObj as any).inputElement, 'focusout');
            expect((rteObj as any).inputElement.value === '').toBe(true);
        });
    });
});