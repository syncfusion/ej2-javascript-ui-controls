/**
 * Parent based format spec
 */
import { detach, isNullOrUndefined } from '@syncfusion/ej2-base';
import { RichTextEditor } from './../../../../src/index';
import { renderRTE, destroy, dispatchEvent, setCursorPoint } from './../../render.spec';

describe('RTE PARENT BASED - formats - ', () => {

    describe(' Default value  - ', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({ });
            done();
        })
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        })
        it(' Test the default value ', () => {
            expect(rteObj.format.default === null).toBe(true);
        });
        it(' Test the default value of width ', () => {
            expect(rteObj.format.width === "65px").toBe(true);
        });

        it(' Test the default value of items ', () => {
            expect(rteObj.format.types.length === 7).toBe(true);
        });
    });
    describe(' PROPERTIES - ', () => {
        describe(' toolbarSettings property - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            beforeEach((done: Function) => {
                rteObj = renderRTE({
                    value: '<span id="rte">RTE</span>',
                    toolbarSettings: {
                        items: ['Formats']
                    }
                });
                controlId = rteObj.element.id;
                done();
            });
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            });

            it(' Test - apply the "P" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[0] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[0] as HTMLElement).click()
                let tag: HTMLElement = rteObj.element.querySelector('#rte');
                expect(tag.tagName === 'P').toBe(true);
            });

            it(' Test - apply the "Code" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[1] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[1] as HTMLElement).click()
                let tag: HTMLElement = rteObj.element.querySelector('#rte');
                expect(tag.tagName === 'PRE').toBe(true);
            });

            it(' Test - apply the "Quotation" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[2] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[2] as HTMLElement).click()
                let tag: HTMLElement = rteObj.element.querySelector('#rte');
                expect(tag.tagName === 'BLOCKQUOTE').toBe(true);
            });
            it(' Test - apply the "H1" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[3] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[3] as HTMLElement).click()
                let tag: HTMLElement = rteObj.element.querySelector('#rte');
                expect(tag.tagName === 'H1').toBe(true);
            });
            it(' Test - apply the "H2" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[4] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[4] as HTMLElement).click()
                let code: HTMLElement = rteObj.element.querySelector('#rte');
                expect(code.tagName === 'H2').toBe(true);
            });
            it(' Test - apply the "H3" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[5] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[5] as HTMLElement).click()
                let code: HTMLElement = rteObj.element.querySelector('#rte');
                expect(code.tagName === 'H3').toBe(true);
            });
            it(' Test - apply the "H4" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[6] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[6] as HTMLElement).click()
                let code: HTMLElement = rteObj.element.querySelector('#rte');
                expect(code.tagName === 'H4').toBe(true);
            });
        });

        describe(' format property - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            beforeEach((done: Function) => {
                rteObj = renderRTE({
                    value: '<span id="rte">RTE</span>',
                    toolbarSettings: {
                        items: ['Formats']
                    },
                    format: {
                        types: [
                            { text: 'Heading 1', value: 'H1', cssClass: 'e-h1' },
                            { text: 'Heading 2', value: 'H2', cssClass: 'e-h2' },
                            { text: 'Heading 3', value: 'H3', cssClass: 'e-h3' },
                            { text: 'Heading 4', value: 'H4', cssClass: 'e-h4' },
                            { text: 'Heading 5', value: 'H5', cssClass: 'e-h5' },
                            { text: 'Heading 6', value: 'H6', cssClass: 'e-h6' }

                        ],
                        default: 'Heading 1'
                    }
                });
                controlId = rteObj.element.id;
                done();
            });
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            });

            it(' Test - apply the "H1" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[0] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[0] as HTMLElement).click()
                let tag: HTMLElement = rteObj.element.querySelector('#rte');
                expect(tag.tagName === 'H1').toBe(true);
            });
            it(' Test - apply the "H2" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[1] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[1] as HTMLElement).click()
                let code: HTMLElement = rteObj.element.querySelector('#rte');
                expect(code.tagName === 'H2').toBe(true);
            });
            it(' Test - apply the "H3" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[2] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[2] as HTMLElement).click()
                let code: HTMLElement = rteObj.element.querySelector('#rte');
                expect(code.tagName === 'H3').toBe(true);
            });
            it(' Test - apply the "H4" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[3] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[3] as HTMLElement).click()
                let code: HTMLElement = rteObj.element.querySelector('#rte');
                expect(code.tagName === 'H4').toBe(true);
            });
            it(' Test - apply the "H5" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[4] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[4] as HTMLElement).click()
                let code: HTMLElement = rteObj.element.querySelector('#rte');
                expect(code.tagName === 'H5').toBe(true);
            });
            it(' Test - apply the "H6" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[5] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[5] as HTMLElement).click()
                let code: HTMLElement = rteObj.element.querySelector('#rte');
                expect(code.tagName === 'H6').toBe(true);
            });
        });

        describe(' inlineMode property - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            beforeEach((done: Function) => {
                rteObj = renderRTE({
                    value: '<span id="rte">RTE</span>',
                    inlineMode: {
                        enable: true,
                        onSelection: false
                    },
                    toolbarSettings: {
                        items: ['Formats']
                    }
                });
                controlId = rteObj.element.id;
                done();
            });
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            });

            it(' Test - apply the "P" format to selected node', (done) => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                setCursorPoint(pEle, 0);
                dispatchEvent(pEle, 'mouseup');
                setTimeout(() => {
                    let item: HTMLElement = document.getElementById(controlId + '_quick_Formats');
                    item.click();
                    let popup: HTMLElement = document.getElementById(controlId + '_quick_Formats-popup');
                    dispatchEvent((popup.querySelectorAll('.e-item')[0] as HTMLElement), 'mousedown');
                    (popup.querySelectorAll('.e-item')[0] as HTMLElement).click()
                    let tag: HTMLElement = rteObj.element.querySelector('#rte');
                    expect(tag.tagName === 'P').toBe(true);
                    done();
                }, 500);
            });

            it(' Test - apply the "Code" format to selected node', (done) => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                setCursorPoint(pEle, 0);
                dispatchEvent(pEle, 'mouseup');
                setTimeout(() => {
                    let item: HTMLElement = document.getElementById(controlId + '_quick_Formats');
                    item.click();
                    let popup: HTMLElement = document.getElementById(controlId + '_quick_Formats-popup');
                    dispatchEvent((popup.querySelectorAll('.e-item')[1] as HTMLElement), 'mousedown');
                    (popup.querySelectorAll('.e-item')[1] as HTMLElement).click()
                    let tag: HTMLElement = rteObj.element.querySelector('#rte');
                    expect(tag.tagName === 'PRE').toBe(true);
                    done();
                }, 500);
            });

            it(' Test - apply the "Quotation" format to selected node', (done) => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                setCursorPoint(pEle, 0);
                dispatchEvent(pEle, 'mouseup');
                setTimeout(() => {
                    let item: HTMLElement = document.getElementById(controlId + '_quick_Formats');
                    item.click();
                    let popup: HTMLElement = document.getElementById(controlId + '_quick_Formats-popup');
                    dispatchEvent((popup.querySelectorAll('.e-item')[2] as HTMLElement), 'mousedown');
                    (popup.querySelectorAll('.e-item')[2] as HTMLElement).click()
                    let tag: HTMLElement = rteObj.element.querySelector('#rte');
                    expect(tag.tagName === 'BLOCKQUOTE').toBe(true);
                    done();
                }, 500);
            });
            it(' Test - apply the "H1" format to selected node', (done) => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                setCursorPoint(pEle, 0);
                dispatchEvent(pEle, 'mouseup');
                setTimeout(() => {
                    let item: HTMLElement = document.getElementById(controlId + '_quick_Formats');
                    item.click();
                    let popup: HTMLElement = document.getElementById(controlId + '_quick_Formats-popup');
                    dispatchEvent((popup.querySelectorAll('.e-item')[3] as HTMLElement), 'mousedown');
                    (popup.querySelectorAll('.e-item')[3] as HTMLElement).click()
                    let tag: HTMLElement = rteObj.element.querySelector('#rte');
                    expect(tag.tagName === 'H1').toBe(true);
                    done();
                }, 500);
            });
            it(' Test - apply the "H2" format to selected node', (done) => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                setCursorPoint(pEle, 0);
                dispatchEvent(pEle, 'mouseup');
                setTimeout(() => {
                    let item: HTMLElement = document.getElementById(controlId + '_quick_Formats');
                    item.click();
                    let popup: HTMLElement = document.getElementById(controlId + '_quick_Formats-popup');
                    dispatchEvent((popup.querySelectorAll('.e-item')[4] as HTMLElement), 'mousedown');
                    (popup.querySelectorAll('.e-item')[4] as HTMLElement).click()
                    let tag: HTMLElement = rteObj.element.querySelector('#rte');
                    expect(tag.tagName === 'H2').toBe(true);
                    done();
                }, 500);
            });
            it(' Test - apply the "H3" format to selected node', (done) => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                setCursorPoint(pEle, 0);
                dispatchEvent(pEle, 'mouseup');
                setTimeout(() => {
                    let item: HTMLElement = document.getElementById(controlId + '_quick_Formats');
                    item.click();
                    let popup: HTMLElement = document.getElementById(controlId + '_quick_Formats-popup');
                    dispatchEvent((popup.querySelectorAll('.e-item')[5] as HTMLElement), 'mousedown');
                    (popup.querySelectorAll('.e-item')[5] as HTMLElement).click()
                    let tag: HTMLElement = rteObj.element.querySelector('#rte');
                    expect(tag.tagName === 'H3').toBe(true);
                    done();
                }, 500);
            });
            it(' Test - apply the "H4" format to selected node', (done) => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                setCursorPoint(pEle, 0);
                dispatchEvent(pEle, 'mouseup');
                setTimeout(() => {
                    let item: HTMLElement = document.getElementById(controlId + '_quick_Formats');
                    item.click();
                    let popup: HTMLElement = document.getElementById(controlId + '_quick_Formats-popup');
                    dispatchEvent((popup.querySelectorAll('.e-item')[6] as HTMLElement), 'mousedown');
                    (popup.querySelectorAll('.e-item')[6] as HTMLElement).click()
                    let tag: HTMLElement = rteObj.element.querySelector('#rte');
                    expect(tag.tagName === 'H4').toBe(true);
                    done();
                }, 500);
            });
        });
    });

    describe(' onPropertyChange - ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: '<span id="rte">RTE</span>',
                toolbarSettings: {
                    items: ['Formats']
                }
            });
            rteObj.format = {
                types: [
                    { text: 'Heading 1', value: 'H1', cssClass: 'e-h1' },
                    { text: 'Heading 2', value: 'H2', cssClass: 'e-h2' },
                    { text: 'Heading 3', value: 'H3', cssClass: 'e-h3' },
                    { text: 'Heading 4', value: 'H4', cssClass: 'e-h4' },
                    { text: 'Heading 5', value: 'H5', cssClass: 'e-h5' },
                    { text: 'Heading 6', value: 'H6', cssClass: 'e-h6' }
                ],
                default: 'Heading 1'
            };
            rteObj.dataBind();
            controlId = rteObj.element.id;
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        })
        it(' Test the fontSize default value ', () => {
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
            let items: HTMLElement = item.querySelector(".e-rte-dropdown-btn-text");
            expect(items.innerHTML === 'Heading 1').toBe(true);
        });
        it(' Test - apply the "H1" format to selected node', () => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
            item.click();
            let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
            dispatchEvent((popup.querySelectorAll('.e-item')[0] as HTMLElement), 'mousedown');
            (popup.querySelectorAll('.e-item')[0] as HTMLElement).click()
            let tag: HTMLElement = rteObj.element.querySelector('#rte');
            expect(tag.tagName === 'H1').toBe(true);
        });
        it(' Test - apply the "H2" format to selected node', () => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
            item.click();
            let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
            dispatchEvent((popup.querySelectorAll('.e-item')[1] as HTMLElement), 'mousedown');
            (popup.querySelectorAll('.e-item')[1] as HTMLElement).click()
            let code: HTMLElement = rteObj.element.querySelector('#rte');
            expect(code.tagName === 'H2').toBe(true);
        });
        it(' Test - apply the "H3" format to selected node', () => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
            item.click();
            let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
            dispatchEvent((popup.querySelectorAll('.e-item')[2] as HTMLElement), 'mousedown');
            (popup.querySelectorAll('.e-item')[2] as HTMLElement).click()
            let code: HTMLElement = rteObj.element.querySelector('#rte');
            expect(code.tagName === 'H3').toBe(true);
        });
        it(' Test - apply the "H4" format to selected node', () => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
            item.click();
            let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
            dispatchEvent((popup.querySelectorAll('.e-item')[3] as HTMLElement), 'mousedown');
            (popup.querySelectorAll('.e-item')[3] as HTMLElement).click()
            let code: HTMLElement = rteObj.element.querySelector('#rte');
            expect(code.tagName === 'H4').toBe(true);
        });
        it(' Test - apply the "H5" format to selected node', () => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
            item.click();
            let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
            dispatchEvent((popup.querySelectorAll('.e-item')[4] as HTMLElement), 'mousedown');
            (popup.querySelectorAll('.e-item')[4] as HTMLElement).click()
            let code: HTMLElement = rteObj.element.querySelector('#rte');
            expect(code.tagName === 'H5').toBe(true);
        });
        it(' Test - apply the "H6" format to selected node', () => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
            item.click();
            let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
            dispatchEvent((popup.querySelectorAll('.e-item')[5] as HTMLElement), 'mousedown');
            (popup.querySelectorAll('.e-item')[5] as HTMLElement).click()
            let code: HTMLElement = rteObj.element.querySelector('#rte');
            expect(code.tagName === 'H6').toBe(true);
        });
    });
    describe(' public methods - ', () => {
        describe(' getHtml and getText method - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            beforeEach((done: Function) => {
                rteObj = renderRTE({
                    value: '<span id="rte">RTE</span>',
                    toolbarSettings: {
                        items: ['Formats']
                    }
                });
                controlId = rteObj.element.id;
                done();
            });
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            });

            it(' Test - apply the "P" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                dispatchEvent((rteObj as any).inputElement, 'focusin');
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[0] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[0] as HTMLElement).click();
                dispatchEvent(document.body, 'mousedown');
                dispatchEvent((rteObj as any).inputElement, 'focusout');
                expect(rteObj.getHtml() === '<p id="rte">RTE</p>').toBe(true);
                expect(rteObj.getText() === 'RTE').toBe(true);
            });

            it(' Test - apply the "Code" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                dispatchEvent((rteObj as any).inputElement, 'focusin');
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[1] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[1] as HTMLElement).click();
                dispatchEvent(document.body, 'mousedown');
                dispatchEvent((rteObj as any).inputElement, 'focusout');
                expect(rteObj.getHtml() === '<pre id="rte">RTE</pre>').toBe(true);
                expect(rteObj.getText() === 'RTE').toBe(true);
            });

            it(' Test - apply the "Quotation" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                dispatchEvent((rteObj as any).inputElement, 'focusin');
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[2] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[2] as HTMLElement).click();
                dispatchEvent(document.body, 'mousedown');
                dispatchEvent((rteObj as any).inputElement, 'focusout');
                expect(rteObj.getHtml() === '<blockquote id="rte">RTE</blockquote>').toBe(true);
                expect(rteObj.getText() === 'RTE').toBe(true);
            });
            it(' Test - apply the "H1" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                dispatchEvent((rteObj as any).inputElement, 'focusin');
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[3] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[3] as HTMLElement).click();
                dispatchEvent(document.body, 'mousedown');
                dispatchEvent((rteObj as any).inputElement, 'focusout');
                expect(rteObj.getHtml() === '<h1 id="rte">RTE</h1>').toBe(true);
                expect(rteObj.getText() === 'RTE').toBe(true);
            });
            it(' Test - apply the "H2" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                dispatchEvent((rteObj as any).inputElement, 'focusin');
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[4] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[4] as HTMLElement).click();
                dispatchEvent(document.body, 'mousedown');
                dispatchEvent((rteObj as any).inputElement, 'focusout');
                expect(rteObj.getHtml() === '<h2 id="rte">RTE</h2>').toBe(true);
                expect(rteObj.getText() === 'RTE').toBe(true);
            });
            it(' Test - apply the "H3" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                dispatchEvent((rteObj as any).inputElement, 'focusin');
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[5] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[5] as HTMLElement).click();
                dispatchEvent(document.body, 'mousedown');
                dispatchEvent((rteObj as any).inputElement, 'focusout');
                expect(rteObj.getHtml() === '<h3 id="rte">RTE</h3>').toBe(true);
                expect(rteObj.getText() === 'RTE').toBe(true);
            });
            it(' Test - apply the "H4" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                dispatchEvent((rteObj as any).inputElement, 'focusin');
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[6] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[6] as HTMLElement).click();
                dispatchEvent(document.body, 'mousedown');
                dispatchEvent((rteObj as any).inputElement, 'focusout');
                expect(rteObj.getHtml() === '<h4 id="rte">RTE</h4>').toBe(true);
                expect(rteObj.getText() === 'RTE').toBe(true);
            });
        });
        
        describe(' showSourceCode method - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            beforeEach((done: Function) => {
                rteObj = renderRTE({
                    value: '<span id="rte">RTE</span>',
                    toolbarSettings: {
                        items: ['Formats']
                    }
                });
                controlId = rteObj.element.id;
                done();
            });
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            });

            it(' Test - apply the "P" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                dispatchEvent((rteObj as any).inputElement, 'focusin');
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[0] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[0] as HTMLElement).click();
                rteObj.showSourceCode();
                let textArea: HTMLTextAreaElement = rteObj.element.querySelector('.e-rte-srctextarea');
                expect(textArea.value === '<p id="rte">RTE</p>').toBe(true);
            });

            it(' Test - apply the "Code" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                dispatchEvent((rteObj as any).inputElement, 'focusin');
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[1] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[1] as HTMLElement).click();
                rteObj.showSourceCode();
                let textArea: HTMLTextAreaElement = rteObj.element.querySelector('.e-rte-srctextarea');
                expect(textArea.value === '<pre id="rte">RTE</pre>').toBe(true);
            });

            it(' Test - apply the "Quotation" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                dispatchEvent((rteObj as any).inputElement, 'focusin');
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[2] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[2] as HTMLElement).click();
                rteObj.showSourceCode();
                let textArea: HTMLTextAreaElement = rteObj.element.querySelector('.e-rte-srctextarea');
                expect(textArea.value === '<blockquote id="rte">RTE</blockquote>').toBe(true);
            });
            it(' Test - apply the "H1" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                dispatchEvent((rteObj as any).inputElement, 'focusin');
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[3] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[3] as HTMLElement).click();
                rteObj.showSourceCode();
                let textArea: HTMLTextAreaElement = rteObj.element.querySelector('.e-rte-srctextarea');
                expect(textArea.value === '<h1 id="rte">RTE</h1>').toBe(true);
            });

            it(' Test - apply the "H2" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                dispatchEvent((rteObj as any).inputElement, 'focusin');
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[4] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[4] as HTMLElement).click();
                rteObj.showSourceCode();
                let textArea: HTMLTextAreaElement = rteObj.element.querySelector('.e-rte-srctextarea');
                expect(textArea.value === '<h2 id="rte">RTE</h2>').toBe(true);
            });

            it(' Test - apply the "H3" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                dispatchEvent((rteObj as any).inputElement, 'focusin');
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[5] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[5] as HTMLElement).click();
                rteObj.showSourceCode();
                let textArea: HTMLTextAreaElement = rteObj.element.querySelector('.e-rte-srctextarea');
                expect(textArea.value === '<h3 id="rte">RTE</h3>').toBe(true);
            });

            it(' Test - apply the "H4" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                dispatchEvent((rteObj as any).inputElement, 'focusin');
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[6] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[6] as HTMLElement).click();
                rteObj.showSourceCode();
                let textArea: HTMLTextAreaElement = rteObj.element.querySelector('.e-rte-srctextarea');
                expect(textArea.value === '<h4 id="rte">RTE</h4>').toBe(true);
            });
        });

        describe(' destroy method - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;

            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    value: '<span id="rte">RTE</span>',
                    toolbarSettings: {
                        items: ['Formats']
                    }
                });
                controlId = rteObj.element.id;
                done();
            });
            afterAll((done: Function) => {
                detach(rteObj.element);
                done();
            })
            it(' Test the formats dropdown element after destroy the component ', () => {
                rteObj.destroy();
                let popupEle: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup')
                expect(isNullOrUndefined(popupEle)).toBe(true);
            });
        });
        describe(' refresh method - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;

            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    value: '<span id="rte">RTE</span>',
                    toolbarSettings: {
                        items: ['Formats']
                    }
                });
                controlId = rteObj.element.id;
                done();
            });
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            })
            it(' Test the Formats dropdown after refresh the component ', () => {
                rteObj.format = {
                    default: 'Heading 1',
                    types: [{ text: 'Heading 1', value: 'H1', cssClass: 'e-h1' },
                    { text: 'Heading 2', value: 'H2', cssClass: 'e-h2' },
                    { text: 'Heading 3', value: 'H3', cssClass: 'e-h3' }]
                };
                rteObj.dataBind();
                rteObj.refresh();
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                dispatchEvent((rteObj as any).inputElement, 'focusin');
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                expect(popup.querySelectorAll('.e-item').length === 3).toBe(true);
                dispatchEvent((popup.querySelectorAll('.e-item')[0] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[0] as HTMLElement).click();
                let tag: HTMLElement = rteObj.element.querySelector('#rte');
                expect(tag.tagName === 'H1').toBe(true);
            });
        });
        describe(' selectAll method- ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            beforeEach((done: Function) => {
                rteObj = renderRTE({
                    value: '<span id="rte">RTE</span>',
                    toolbarSettings: {
                        items: ['Formats']
                    }
                });
                controlId = rteObj.element.id;
                done();
            });
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            });

            it(' Test - apply the "P" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.selectAll();
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[0] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[0] as HTMLElement).click()
                let tag: HTMLElement = rteObj.element.querySelector('#rte');
                expect(tag.tagName === 'P').toBe(true);
            });

            it(' Test - apply the "Code" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.selectAll();
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[1] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[1] as HTMLElement).click()
                let tag: HTMLElement = rteObj.element.querySelector('#rte');
                expect(tag.tagName === 'PRE').toBe(true);
            });

            it(' Test - apply the "Quotation" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.selectAll();
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[2] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[2] as HTMLElement).click()
                let tag: HTMLElement = rteObj.element.querySelector('#rte');
                expect(tag.tagName === 'BLOCKQUOTE').toBe(true);
            });
            it(' Test - apply the "H1" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.selectAll();
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[3] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[3] as HTMLElement).click()
                let tag: HTMLElement = rteObj.element.querySelector('#rte');
                expect(tag.tagName === 'H1').toBe(true);
            });
            it(' Test - apply the "H2" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.selectAll();
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[4] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[4] as HTMLElement).click()
                let code: HTMLElement = rteObj.element.querySelector('#rte');
                expect(code.tagName === 'H2').toBe(true);
            });
            it(' Test - apply the "H3" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.selectAll();
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[5] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[5] as HTMLElement).click()
                let code: HTMLElement = rteObj.element.querySelector('#rte');
                expect(code.tagName === 'H3').toBe(true);
            });
            it(' Test - apply the "H4" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.selectAll();
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[6] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[6] as HTMLElement).click()
                let code: HTMLElement = rteObj.element.querySelector('#rte');
                expect(code.tagName === 'H4').toBe(true);
            });
        });
    });

    describe(' Events - ', () => {
        describe(' change, actionBegin, actionComplete and toolbarClick events - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            let actionBegin: any;
            let actionComplete: any;
            let toolbarClick: any;
            let changeSpy: any;
            beforeEach((done: Function) => {
                changeSpy = null;
                actionComplete = null;
                actionBegin = null;
                toolbarClick = null;
                actionBegin = jasmine.createSpy("actionBegin");
                actionComplete = jasmine.createSpy("actionComplete");
                toolbarClick = jasmine.createSpy('toolbarClick');
                changeSpy = jasmine.createSpy("change");
                rteObj = renderRTE({
                    change: changeSpy,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    toolbarClick: toolbarClick,
                    value: '<span id="rte">RTE</span>',
                    toolbarSettings: {
                        items: ['Formats']
                    }
                });
                controlId = rteObj.element.id;
                done();
            });
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            })
            it(' Test - apply the "P" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                dispatchEvent((rteObj as any).inputElement, 'focusin');
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[0] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[0] as HTMLElement).click();
                dispatchEvent(document.body, 'mousedown');
                dispatchEvent((rteObj as any).inputElement, 'focusout');
                expect(actionBegin).toHaveBeenCalled();
                expect(actionComplete).toHaveBeenCalled();
                expect(toolbarClick).toHaveBeenCalled();
                expect(changeSpy).toHaveBeenCalled();
            });

            it(' Test - apply the "Code" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                dispatchEvent((rteObj as any).inputElement, 'focusin');
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[1] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[1] as HTMLElement).click();
                dispatchEvent(document.body, 'mousedown');
                dispatchEvent((rteObj as any).inputElement, 'focusout');
                expect(actionBegin).toHaveBeenCalled();
                expect(actionComplete).toHaveBeenCalled();
                expect(toolbarClick).toHaveBeenCalled();
                expect(changeSpy).toHaveBeenCalled();
            });

            it(' Test - apply the "Quotation" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                dispatchEvent((rteObj as any).inputElement, 'focusin');
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[2] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[2] as HTMLElement).click();
                dispatchEvent(document.body, 'mousedown');
                dispatchEvent((rteObj as any).inputElement, 'focusout');
                expect(actionBegin).toHaveBeenCalled();
                expect(actionComplete).toHaveBeenCalled();
                expect(toolbarClick).toHaveBeenCalled();
                expect(changeSpy).toHaveBeenCalled();
            });
            it(' Test - apply the "H1" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                dispatchEvent((rteObj as any).inputElement, 'focusin');
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[3] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[3] as HTMLElement).click();
                dispatchEvent(document.body, 'mousedown');
                dispatchEvent((rteObj as any).inputElement, 'focusout');
                expect(actionBegin).toHaveBeenCalled();
                expect(actionComplete).toHaveBeenCalled();
                expect(toolbarClick).toHaveBeenCalled();
                expect(changeSpy).toHaveBeenCalled();
            });
            it(' Test - apply the "H2" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                dispatchEvent((rteObj as any).inputElement, 'focusin');
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[4] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[4] as HTMLElement).click();
                dispatchEvent(document.body, 'mousedown');
                dispatchEvent((rteObj as any).inputElement, 'focusout');
                expect(actionBegin).toHaveBeenCalled();
                expect(actionComplete).toHaveBeenCalled();
                expect(toolbarClick).toHaveBeenCalled();
                expect(changeSpy).toHaveBeenCalled();
            });
            it(' Test - apply the "H3" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                dispatchEvent((rteObj as any).inputElement, 'focusin');
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[5] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[5] as HTMLElement).click();
                dispatchEvent(document.body, 'mousedown');
                dispatchEvent((rteObj as any).inputElement, 'focusout');
                expect(actionBegin).toHaveBeenCalled();
                expect(actionComplete).toHaveBeenCalled();
                expect(toolbarClick).toHaveBeenCalled();
                expect(changeSpy).toHaveBeenCalled();
            });
            it(' Test - apply the "H4" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                dispatchEvent((rteObj as any).inputElement, 'focusin');
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[6] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[6] as HTMLElement).click();
                dispatchEvent(document.body, 'mousedown');
                dispatchEvent((rteObj as any).inputElement, 'focusout');
                expect(actionBegin).toHaveBeenCalled();
                expect(actionComplete).toHaveBeenCalled();
                expect(toolbarClick).toHaveBeenCalled();
                expect(changeSpy).toHaveBeenCalled();
            });
        });
    });
    describe(' EJ2-23764 - Console error occurs when using the toolbar in RTE- ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: '<p id="bold-format">RTE</p>',
                toolbarSettings: {
                    items: ['Bold', 'Formats']
                },
                format: {
                    types: [
                        { text: 'Heading 1', value: 'H1', cssClass: 'e-h1' },
                        { text: 'Heading 2', value: 'H2', cssClass: 'e-h2' },
                        { text: 'Heading 3', value: 'H3', cssClass: 'e-h3' },
                        { text: 'Heading 4', value: 'H4', cssClass: 'e-h4' },
                        { text: 'Heading 5', value: 'H5', cssClass: 'e-h5' },
                        { text: 'Heading 6', value: 'H6', cssClass: 'e-h6' }
    
                    ],
                    default: 'Heading 1'
                }
            });
            controlId = rteObj.element.id;
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });
    
        it(' Test - apply bold and then apply the "H1" format without select node', (done) => {
            let tag: HTMLElement = rteObj.element.querySelector('#bold-format');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, tag.childNodes[0], tag.childNodes[0], 0, 0);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Bold');
            item.click();
            item = document.getElementById(controlId + '_toolbar_Formats');
            item.click();
            setTimeout(() => {
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[0] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[0] as HTMLElement).click()
                let tag: HTMLElement = rteObj.element.querySelector('#bold-format');
                expect(tag.tagName).toEqual('H1');
                done();
            }, 200);
        });
    });
});