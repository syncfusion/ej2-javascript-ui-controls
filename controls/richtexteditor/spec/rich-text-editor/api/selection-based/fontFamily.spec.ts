/**
 * Font Family spec
 */
import { detach, isNullOrUndefined } from '@syncfusion/ej2-base';
import { RichTextEditor } from './../../../../src/index';
import { renderRTE, destroy, dispatchEvent } from './../../render.spec';

describe('RTE SELECTION BASED - fontFamily - ', () => {

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
            expect(rteObj.fontFamily.default === null).toBe(true);
        });
        it(' Test the default value of width ', () => {
            expect(rteObj.fontFamily.width === "72px").toBe(true);
        });

        it(' Test the default value of items ', () => {
            expect(rteObj.fontFamily.items.length === 8).toBe(true);
        });

    });

    describe(' toolbarSettings property - ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: '<p id="rte">RTE</p>',
                toolbarSettings: {
                    items: ['FontName']
                },
                fontFamily: {
                    items: [
                        { text: 'Segoe UI', value: 'Segoe UI', cssClass: 'e-segoe-ui' },
                        { text: 'Arial', value: 'Arial,Helvetica,sans-serif', cssClass: 'e-arial' },
                        { text: 'Georgia', value: 'Georgia,serif', cssClass: 'e-georgia' }
                    ]
                }
            });
            controlId = rteObj.element.id;
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        })
        it(' Test the apply the font family to the selected node while click the toolbar item', () => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontName');
            item.click();
            let popup: HTMLElement = document.getElementById(controlId + '_toolbar_FontName-popup');
            dispatchEvent((popup.querySelectorAll('.e-item')[1] as HTMLElement), 'mousedown');
            (popup.querySelectorAll('.e-item')[1] as HTMLElement).click()

            let span: HTMLSpanElement = pEle.querySelector('span');
            expect(span.style.fontFamily === 'Arial, Helvetica, sans-serif').toBe(true);
        });
    });

    describe(' EJ2-66999 - Font name dropdown not opened issue - ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: '<p id="rte">RTE</p>',
                toolbarSettings: {
                    items: ['FontName']
                },
                iframeSettings: {
                    enable: true
                },
                fontFamily: {
                    items: [
                        { text: 'Segoe UI', value: 'Segoe UI', cssClass: 'e-segoe-ui' },
                        { text: 'Arial', value: 'Arial,Helvetica,sans-serif', cssClass: 'e-arial' },
                        { text: 'Georgia', value: 'Georgia,serif', cssClass: 'e-georgia' }
                    ]
                }
            });
            controlId = rteObj.element.id;
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        })
        it(' EJ2-66999 - Font name dropdown not opened issue', () => {
            let pEle: HTMLElement = rteObj.inputElement.querySelector('#rte')
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontName');
            item.click();
            let popup: HTMLElement = document.getElementById(controlId + '_toolbar_FontName-popup');
            expect(popup.classList.contains('e-popup-open')).toBe(true);
        });
    });

    describe(' onPropertyChange - ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: '<p id="rte">RTE</p>',
                toolbarSettings: {
                    items: ['FontName']
                },
            });
            rteObj.fontFamily = {
                default: 'Segoe UI',
                width: "150px",
                items: [
                    { text: 'Segoe UI', value: 'Segoe UI', cssClass: 'e-segoe-ui' },
                    { text: 'Arial', value: 'Arial,Helvetica,sans-serif', cssClass: 'e-arial' },
                    { text: 'Georgia', value: 'Georgia,serif', cssClass: 'e-georgia' }
                ]
            };
            rteObj.dataBind();
            controlId = rteObj.element.id;
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        })
        it(' Test the fontFamily default value ', () => {
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontName');
            let items: HTMLElement = item.querySelector(".e-rte-dropdown-btn-text");
            expect(items.innerHTML === 'Segoe UI').toBe(true);
        });
        it(' Test the fontFamily width ', () => {
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontName');
            let items: HTMLElement = item.querySelector(".e-rte-dropdown-btn-text");
            expect(items.parentElement.style.width === '150px').toBe(true);
        });
        it(' Test the fontFamily change dynamically ', () => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontName');
            item.click();
            let popup: HTMLElement = document.getElementById(controlId + '_toolbar_FontName-popup');
            let items = popup.querySelectorAll(".e-item");
            expect(items.length === 3).toBe(true);
        });
    });
    describe(' public methods - ', () => {
        describe(' getHtml and getText method - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    value: '<p id="rte">RTE</p>',
                    toolbarSettings: {
                        items: ['FontName']
                    },
                    fontFamily: {
                        items: [
                            { text: 'Segoe UI', value: 'Segoe UI', cssClass: 'e-segoe-ui' },
                            { text: 'Arial', value: 'Arial,Helvetica,sans-serif', cssClass: 'e-arial' },
                            { text: 'Georgia', value: 'Georgia,serif', cssClass: 'e-georgia' }
                        ]
                    }
                });
                controlId = rteObj.element.id;
                done();
            });
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            })
            it(' Test the getHtml method after apply the fontFamily ', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontName');
                dispatchEvent(item, 'mousedown');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_FontName-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[1] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[1] as HTMLElement).click();
                dispatchEvent(document.body, 'mousedown');
                document.body.click();
                (rteObj as any).isBlur = true;
                dispatchEvent((rteObj as any).inputElement, 'focusout');
                expect(rteObj.getHtml() === '<p id="rte"><span style="font-family: Arial, Helvetica, sans-serif;">RTE</span></p>').toBe(true);
            });
            it(' Test the getText method after apply the fontFamily ', () => {
                expect(rteObj.getText() === 'RTE').toBe(true);
            });
        });

        describe(' showSourceCode method - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    value: '<p id="rte">RTE</p>',
                    toolbarSettings: {
                        items: ['FontName']
                    },
                    fontFamily: {
                        items: [
                            { text: 'Segoe UI', value: 'Segoe UI', cssClass: 'e-segoe-ui' },
                            { text: 'Arial', value: 'Arial,Helvetica,sans-serif', cssClass: 'e-arial' },
                            { text: 'Georgia', value: 'Georgia,serif', cssClass: 'e-georgia' }
                        ]
                    }
                });
                controlId = rteObj.element.id;
                done();
            });
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            })
            it(' Test the showSourceCode method after apply the fontFamily ', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontName');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_FontName-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[1] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[1] as HTMLElement).click();
                rteObj.showSourceCode();
                let textArea: HTMLTextAreaElement = rteObj.element.querySelector('.e-rte-srctextarea');
                expect(textArea.value === '<p id="rte"><span style="font-family: Arial, Helvetica, sans-serif;">RTE</span></p>').toBe(true);
            });
        });

        describe(' destroy method - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;

            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    value: '<p id="rte">RTE</p>',
                    toolbarSettings: {
                        items: ['FontName']
                    },
                    fontFamily: {
                        items: [
                            { text: 'Segoe UI', value: 'Segoe UI', cssClass: 'e-segoe-ui' },
                            { text: 'Arial', value: 'Arial,Helvetica,sans-serif', cssClass: 'e-arial' },
                            { text: 'Georgia', value: 'Georgia,serif', cssClass: 'e-georgia' }
                        ]
                    }
                });
                controlId = rteObj.element.id;
                done();
            });
            afterAll((done: Function) => {
                detach(rteObj.element);
                done();
            })
            it(' Test the fontFamily dropdown element after destroy the component ', () => {
                rteObj.destroy();
                let popupEle: HTMLElement = document.getElementById(controlId + '_toolbar_FontName-popup')
                expect(isNullOrUndefined(popupEle)).toBe(true);
            });
        });
        describe(' refresh method - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;

            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    value: '<p id="rte">RTE</p>',
                    toolbarSettings: {
                        items: ['FontName']
                    },
                    fontFamily: {
                        items: [
                            { text: 'Segoe UI', value: 'Segoe UI', cssClass: 'e-segoe-ui' },
                            { text: 'Arial', value: 'Arial,Helvetica,sans-serif', cssClass: 'e-arial' },
                            { text: 'Georgia', value: 'Georgia,serif', cssClass: 'e-georgia' }
                        ]
                    }
                });
                controlId = rteObj.element.id;
                done();
            });
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            })
            it(' Test the fontFamily dropdown after refresh the component ', () => {
                rteObj.refresh();
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontName');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_FontName-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[1] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[1] as HTMLElement).click();
                let popupEle: HTMLElement = document.getElementById(controlId + '_toolbar_FontName-popup')
                expect(!isNullOrUndefined(popupEle)).toBe(true);
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
            beforeAll((done: Function) => {
                actionBegin = jasmine.createSpy("actionBegin");
                actionComplete = jasmine.createSpy("actionComplete");
                toolbarClick = jasmine.createSpy('toolbarClick');
                changeSpy = jasmine.createSpy("change");
                rteObj = renderRTE({
                    change: changeSpy,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    toolbarClick: toolbarClick,
                    value: '<p id="rte">RTE</p>',
                    toolbarSettings: {
                        items: ['FontName']
                    },
                    fontFamily: {
                        items: [
                            { text: 'Segoe UI', value: 'Segoe UI', cssClass: 'e-segoe-ui' },
                            { text: 'Arial', value: 'Arial,Helvetica,sans-serif', cssClass: 'e-arial' },
                            { text: 'Georgia', value: 'Georgia,serif', cssClass: 'e-georgia' }
                        ]
                    }
                });
                controlId = rteObj.element.id;
                done();
            });
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            })
            it(' Test the actionBegin, actionComplete and toolbarClick events trigger after apply the fontFamily and focusOut', () => {
                rteObj.focusIn();
                dispatchEvent((rteObj as any).inputElement, 'focusin');
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontName');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_FontName-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[1] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[1] as HTMLElement).click();
                dispatchEvent(document.body, 'mousedown');
                document.body.click();
                (rteObj as any).isBlur = true;
                dispatchEvent((rteObj as any).inputElement, 'focusout');
                expect(actionBegin).toHaveBeenCalled();
                expect(actionComplete).toHaveBeenCalled();
                expect(toolbarClick).toHaveBeenCalled();
                expect(changeSpy).toHaveBeenCalled();
            });
        });
    });
});