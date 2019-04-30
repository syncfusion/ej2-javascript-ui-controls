import { Toolbar, HtmlEditor, RichTextEditor, Count, Link, Image, QuickToolbar } from './../../../../src/index';
import { renderRTE, destroy, dispatchEvent, setCursorPoint } from './../../render.spec';
import { detach, isNullOrUndefined } from '@syncfusion/ej2-base';

RichTextEditor.Inject(HtmlEditor);
RichTextEditor.Inject(Toolbar);
RichTextEditor.Inject(Link);
RichTextEditor.Inject(Count);
RichTextEditor.Inject(Image);
RichTextEditor.Inject(QuickToolbar);

describe(' Inline Quick Toolbar - ', () => {
    describe(' inlineMode property - ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: '<span id="rte">RTE</span>',
                inlineMode: {
                    enable: true
                }
            });
            controlId = rteObj.element.id;
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });

        it(' Test - Click the Alignments item - justify', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            dispatchEvent(pEle, 'mouseup');
            setTimeout(() => {
                let item: HTMLElement = document.querySelector('#' + controlId + '_quick_Alignments');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_quick_Alignments-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[3] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[3] as HTMLElement).click()
                let tag: HTMLElement = rteObj.element.querySelector('#rte');
                expect(tag.style.textAlign === 'justify').toBe(true);
                document.body.click();
                dispatchEvent(document as any, 'mousedown')
                done();
            }, 200);
        });

        it(' Test - Click the Alignments item - right', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            dispatchEvent(pEle, 'mouseup');
            setTimeout(() => {
                let item: HTMLElement = document.querySelector('#' + controlId + '_quick_Alignments');
                item.click();
                expect(item.childNodes.length === 2).toBe(true);
                expect(!isNullOrUndefined(item.querySelector('.e-justify-full'))).toBe(true);
                let popup: HTMLElement = document.getElementById(controlId + '_quick_Alignments-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[2] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[2] as HTMLElement).click()
                let tag: HTMLElement = rteObj.element.querySelector('#rte');
                expect(tag.style.textAlign === 'right').toBe(true);
                document.body.click();
                dispatchEvent(document as any, 'mousedown')
                done();
            }, 200);
        });

        it(' Test - Click the Alignments item - center', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            dispatchEvent(pEle, 'mouseup');
            setTimeout(() => {
                let item: HTMLElement = document.querySelector('#' + controlId + '_quick_Alignments');
                item.click();
                expect(item.childNodes.length === 2).toBe(true);
                expect(!isNullOrUndefined(item.querySelector('.e-justify-right'))).toBe(true);
                let popup: HTMLElement = document.getElementById(controlId + '_quick_Alignments-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[1] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[1] as HTMLElement).click()
                let tag: HTMLElement = rteObj.element.querySelector('#rte');
                expect(tag.style.textAlign === 'center').toBe(true);
                document.body.click();
                dispatchEvent(document as any, 'mousedown')
                done();
            }, 200);
        });

        it(' Test - Click the Alignments item - left', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            dispatchEvent(pEle, 'mouseup');
            setTimeout(() => {
                let item: HTMLElement = document.querySelector('#' + controlId + '_quick_Alignments');
                item.click();
                expect(item.childNodes.length === 2).toBe(true);
                expect(!isNullOrUndefined(item.querySelector('.e-justify-center'))).toBe(true);
                let popup: HTMLElement = document.getElementById(controlId + '_quick_Alignments-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[0] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[0] as HTMLElement).click()
                let tag: HTMLElement = rteObj.element.querySelector('#rte');
                expect(tag.style.textAlign === 'left').toBe(true);
                document.body.click();
                dispatchEvent(document as any, 'mousedown')
                done();
            }, 200);
        });

        it(' EJ2-20295: - showFullscreen method ', (done) => {
            rteObj.showFullScreen();
            let rteEle: HTMLElement = rteObj.element;
            setTimeout(() => {
                expect(rteEle.classList.contains("e-rte-full-screen")).toBe(true);
                done();
            }, 200);
        });
    });
    describe(' inlineMode property onPropertyChange- ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: '<span id="rte">RTE</span>'
            });
            controlId = rteObj.element.id;
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });

        it(' Test - enable the inline toolbar dynamically', (done) => {
            rteObj.inlineMode.enable=true;
            rteObj.dataBind();
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            dispatchEvent(pEle, 'mouseup');
            setTimeout(() => {
                let item: HTMLElement = document.querySelector('#' + controlId + '_quick_Alignments');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_quick_Alignments-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[3] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[3] as HTMLElement).click()
                let tag: HTMLElement = rteObj.element.querySelector('#rte');
                expect(tag.style.textAlign === 'justify').toBe(true);
                document.body.click();
                dispatchEvent(document as any, 'mousedown')
                done();
            }, 200);
        });

    });

});


