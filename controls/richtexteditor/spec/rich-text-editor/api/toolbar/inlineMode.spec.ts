/**
 * Inline mode spec
 */
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { RichTextEditor } from './../../../../src/index';
import { renderRTE, destroy, dispatchEvent } from './../../render.spec';

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
                expect(tag.parentElement.style.textAlign === 'justify').toBe(true);
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
                expect(tag.parentElement.style.textAlign === 'right').toBe(true);
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
                expect(tag.parentElement.style.textAlign === 'center').toBe(true);
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
                expect(tag.parentElement.style.textAlign === 'left').toBe(true);
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

        it(' Test - enable as true the inline toolbar dynamically', (done) => {
            rteObj.inlineMode.enable = true;
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
                expect(tag.parentElement.style.textAlign === 'justify').toBe(true);
                document.body.click();
                dispatchEvent(document as any, 'mousedown')
                done();
            }, 200);
        });

        it(' Test - enable as false the inline toolbar dynamically', (done) => {
            rteObj.inlineMode.enable = false;
            rteObj.dataBind();
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            dispatchEvent(pEle, 'mouseup');
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-quick-popup').length).toBe(0);
                done();
            }, 200);
        });

        it(' Test - enable as true the inline toolbar dynamically', (done) => {
            rteObj.inlineMode.enable = true;
            rteObj.dataBind();
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            dispatchEvent(pEle, 'mouseup');
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-quick-popup').length > 0).toBe(true);
                done();
            }, 200);
        });
    });

    describe('EJ2-39369 - Inline toolbar Font Size not update in toolbar status', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                inlineMode: {
                    enable: true
                },
                toolbarSettings: {
                    items: ['FontName', 'FontSize']
                },
                value: `<p id="spanSize">The Rich Text Editor (RTE) control is an easy to render in client side.
                Customer easy to edit the contents and get the HTML content for the displayed content.<br></p>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
            done();
        });

        it('FontSize toolbar status', (done: Function) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#spanSize');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            dispatchEvent(pEle, 'mouseup');
            setTimeout(() => {
                let item: HTMLElement = document.querySelector('#' + controlId + '_quick_FontSize');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_quick_FontSize-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[3] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[3] as HTMLElement).click();
                rteObj.quickToolbarModule.hideInlineQTBar();
                setTimeout(()=>{
                    dispatchEvent(pEle, 'mouseup');
                    setTimeout(()=>{
                        let sizeSpan: HTMLElement = item.querySelector('.e-rte-dropdown-btn-text');
                        expect(sizeSpan.innerText === '14 pt').toBe(true);
                        done();
                    }, 200);
                }, 200);
            }, 200);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-49293 - Inline toolbar goes outside of window', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                inlineMode: {
                    enable: true
                },
                toolbarSettings: {
                    items: ['FontName', 'FontSize', 'Formats', 'Alignments', 'FontColor', 'BackgroundColor', 'NumberFormatList', 'BulletFormatList']
                },
                value: `<p id="spanSize">The Rich Text Editor (RTE) control is an easy to render in client side.
                Customer easy to edit the contents and get the HTML content for the displayed content.<br></p>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
            done();
        });

        it('Template class availability testing', (done: Function) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#spanSize');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            dispatchEvent(pEle, 'mouseup');
            setTimeout(() => {
                let fontNameItem: HTMLElement = document.querySelector('#' + controlId + '_quick_FontName').parentElement;
                expect(fontNameItem.classList.contains('e-rte-inline-template')).toBe(true);
                let formatsItem: HTMLElement = document.querySelector('#' + controlId + '_quick_Formats').parentElement;
                expect(formatsItem.classList.contains('e-rte-inline-template')).toBe(true);
                let alignmentsItem: HTMLElement = document.querySelector('#' + controlId + '_quick_Alignments').parentElement;
                expect(alignmentsItem.classList.contains('e-rte-inline-template')).toBe(true);
                let olItem: HTMLElement = document.querySelector('#' + controlId + '_quick_NumberFormatList').parentElement;
                expect(olItem.classList.contains('e-rte-inline-template')).toBe(true);
                let ulItem: HTMLElement = document.querySelector('#' + controlId + '_quick_BulletFormatList').parentElement;
                expect(ulItem.classList.contains('e-rte-inline-template')).toBe(true);
                let fontSizeItem: HTMLElement = document.querySelector('#' + controlId + '_quick_FontSize').parentElement;
                expect(fontSizeItem.classList.contains('e-rte-inline-size-template')).toBe(true);
                let fontColorItem: HTMLElement = document.querySelector('#' + controlId + '_quick_FontColor').parentElement;
                expect(fontColorItem.classList.contains('e-rte-inline-color-template')).toBe(true);
                let bgColorItem: HTMLElement = document.querySelector('#' + controlId + '_quick_BackgroundColor').parentElement;
                expect(bgColorItem.classList.contains('e-rte-inline-color-template')).toBe(true);
                done();
            }, 200);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });
});