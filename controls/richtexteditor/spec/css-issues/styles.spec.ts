/**
 * RTE - CSS related spec
 */
import { RichTextEditor } from "../../src/rich-text-editor/index";
import { renderRTE, destroy } from "./../rich-text-editor/render.spec";

describe("RichTextEditor Styles changes", () => {
    let styleEle: HTMLLinkElement = document.createElement('link');
    styleEle.rel = 'stylesheet'; 
    styleEle.href = 'https://cdn.syncfusion.com/ej2/material.css';

    beforeEach(() => {
        document.body.appendChild(styleEle);
    });

    afterEach(() => {
        styleEle.remove();
    });

    describe("EJ2-15894 - RTE maximized window hide the bottom", () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let originalTimeout: number;
        beforeEach(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: [ "Bold", "FullScreen" ]
                }
            });
            rteEle = rteObj.element;
        });

        afterEach(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            styleEle.remove();
            destroy(rteObj);
        });

        it("FullScreen toolbar click testing", (done) => {
            setTimeout(():void => {
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[1];
                trgEle.click();
                expect(window.getComputedStyle(rteEle.querySelector('.e-rte-content')).height).not.toEqual('100%');
                done();
            }, 2000);
        });
    });
});