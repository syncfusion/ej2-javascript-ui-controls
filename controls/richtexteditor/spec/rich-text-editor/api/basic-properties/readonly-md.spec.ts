/**
 * Markdown - readonly spec
 */
import { detach } from "@syncfusion/ej2-base";
import { RichTextEditor } from './../../../../src/index';
import { renderRTE, destroy } from './../../render.spec';

describe('RTE Markdown BASIC PROPERTIES - readonly - ', () => {

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
            expect(rteObj.readonly).toBe(false);
        });
    });
    describe(' PROPERTIES - ', () => {
        describe(' Enabled the readonly - ', () => {
            let rteObj: RichTextEditor;
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            })
            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    editorMode: "Markdown",
                    readonly: true
                });
                done();
            })

            it(' Test the RTE element class ', () => {
                expect(rteObj.element.classList.contains('e-rte-readonly')).toBe(true);
            });
            it(' Test the RTE content element readonly attribute ', () => {
                let editArea: HTMLElement = (rteObj as any).inputElement;
                expect(editArea.hasAttribute('readonly')).toBe(true);
            });
        });
    });

    describe(' onPropertyChange - ', () => {
        let rteObj: RichTextEditor;
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        })
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                editorMode: "Markdown",
            });
            rteObj.readonly = true;
            rteObj.dataBind();
            done();
        })

        it(' Test the RTE element class ', () => {
            expect(rteObj.element.classList.contains('e-rte-readonly')).toBe(true);
        });

        it(' Test the RTE content element readonly attribute ', () => {
            let editArea: HTMLElement = (rteObj as any).inputElement;
            expect(editArea.hasAttribute('readonly')).toBe(true);
        });

        it(' Test the RTE readonly false state', () => {
            rteObj.readonly = false;
            rteObj.dataBind();
            let editArea: HTMLElement = (rteObj as any).inputElement;
            expect(editArea.hasAttribute('readonly')).toBe(false);
        });
    });
    describe(' PUBLIC METHODS - ', () => {

        describe(' refresh - ', () => {
            let rteObj: RichTextEditor;
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            })

            it(' Test the readonly after refresh the component', () => {
                rteObj = renderRTE({
                    editorMode: "Markdown",
                });
                rteObj.readonly = true;
                rteObj.dataBind();
                rteObj.refresh();
                expect(rteObj.element.classList.contains('e-rte-readonly')).toBe(true);
                let editArea: HTMLElement = (rteObj as any).inputElement;
                expect(editArea.hasAttribute('readonly')).toBe(true);
            });
        });
        describe(' destroy - ', () => {
            let rteObj: RichTextEditor;
            afterEach((done: Function) => {
                detach(rteObj.element);
                done();
            })

            it(' Test the readonly class of root element after destroy the component', () => {
                rteObj = renderRTE({
                    editorMode: "Markdown",
                });
                rteObj.readonly = true;
                rteObj.dataBind();
                rteObj.destroy();
                expect(rteObj.element.classList.contains('e-rte-readonly')).toBe(false);
            });
        });
    });
});