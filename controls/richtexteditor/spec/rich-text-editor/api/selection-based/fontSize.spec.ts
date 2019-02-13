import { Toolbar, HtmlEditor, RichTextEditor, Count, Link, Image, QuickToolbar } from './../../../../src/index';
import { renderRTE, destroy, dispatchEvent, setCursorPoint } from './../../render.spec';
import { detach, isNullOrUndefined } from '@syncfusion/ej2-base';

RichTextEditor.Inject(HtmlEditor);
RichTextEditor.Inject(Toolbar);
RichTextEditor.Inject(Link);
RichTextEditor.Inject(Count);
RichTextEditor.Inject(Image);
RichTextEditor.Inject(QuickToolbar);

describe('RTE SELECTION BASED - fontSize - ', () => {

    describe(' Default value  - ', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
            });
            done();
        })
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        })
        it(' Test the default value ', () => {
            expect(rteObj.fontSize.default === null).toBe(true);
        });
        it(' Test the default value of width ', () => {
            expect(rteObj.fontSize.width === "35px").toBe(true);
        });

        it(' Test the default value of items ', () => {
            expect(rteObj.fontSize.items.length === 7).toBe(true);
        });

    });

    describe(' toolbarSettings property - ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: '<p id="rte">RTE</p>',
                toolbarSettings: {
                    items: ['FontSize']
                },
                fontSize: {
                    items: [
                        { text: '8 pt', value: '8pt' },
                        { text: '10 pt', value: '10pt' },
                        { text: '12 pt', value: '12pt' },
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
        it(' Test the apply the font size to the selected node while click the toolbar item', () => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontSize');
            item.click();
            let popup: HTMLElement = document.getElementById(controlId + '_toolbar_FontSize-popup');
            dispatchEvent((popup.querySelectorAll('.e-item')[0] as HTMLElement), 'mousedown');
            (popup.querySelectorAll('.e-item')[0] as HTMLElement).click();
            let span: HTMLSpanElement = pEle.querySelector('span');
            expect(span.style.fontSize === '8pt').toBe(true);
        });
    });

    describe(' onPropertyChange - ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: '<p id="rte">RTE</p>',
                toolbarSettings: {
                    items: ['FontSize']
                },
            });
            rteObj.fontSize = {
                default: '8pt',
                width: '150px',
                items: [
                    { text: '8 pt', value: '8pt' },
                    { text: '10 pt', value: '10pt' },
                    { text: '12 pt', value: '12pt' },
                ]
            };
            rteObj.dataBind();
            controlId = rteObj.element.id;
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
        it(' Test the fontSize default value ', () => {
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontSize');
            let items: HTMLElement = item.querySelector(".e-rte-dropdown-btn-text");
            expect(items.innerHTML === '8 pt').toBe(true);
        });
        it(' Test the fontSize width ', () => {
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontSize');
            let items: HTMLElement = item.querySelector(".e-rte-dropdown-btn-text");
            expect(items.parentElement.style.width === '150px').toBe(true);
        });

        it(' Test the fontSize change dynamically ', () => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontSize');
            item.click();
            let popup: HTMLElement = document.getElementById(controlId + '_toolbar_FontSize-popup');
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
                        items: ['FontSize']
                    },
                    fontSize: {
                        items: [
                            { text: '8 pt', value: '8pt' },
                            { text: '10 pt', value: '10pt' },
                            { text: '12 pt', value: '12pt' },
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
            it(' Test the getHtml method after apply the fontSize ', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontSize');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_FontSize-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[0] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[0] as HTMLElement).click();
                document.body.focus();
                (rteObj as any).isBlur = true;
                dispatchEvent((rteObj as any).inputElement, 'focusout');
                expect(rteObj.getHtml() === '<p id="rte"><span style="font-size: 8pt;">RTE</span></p>').toBe(true);
            });
            it(' Test the getText method after apply the fontSize ', () => {
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
                        items: ['FontSize']
                    },
                    fontSize: {
                        items: [
                            { text: '8 pt', value: '8pt' },
                            { text: '10 pt', value: '10pt' },
                            { text: '12 pt', value: '12pt' },
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
            it(' Test the showSourceCode method after apply the fontSize ', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontSize');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_FontSize-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[0] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[0] as HTMLElement).click();
                rteObj.showSourceCode();
                let textArea: HTMLTextAreaElement = rteObj.element.querySelector('.e-rte-srctextarea');
                expect(textArea.value === '<p id="rte"><span style="font-size: 8pt;">RTE</span></p>').toBe(true);
            });
        });

        describe(' destroy method - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            let element: HTMLElement;

            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    value: '<p id="rte">RTE</p>',
                    toolbarSettings: {
                        items: ['FontSize']
                    },
                    fontSize: {
                        items: [
                            { text: '8 pt', value: '8pt' },
                            { text: '10 pt', value: '10pt' },
                            { text: '12 pt', value: '12pt' },
                        ]
                    }
                });
                controlId = rteObj.element.id;
                element = rteObj.element;
                done();
            });
            afterAll((done: Function) => {
                detach(element);
                done();
            })
            it(' Test the fontSize dropdown element after destroy the component ', () => {
                rteObj.destroy();
                let popupEle: HTMLElement = document.getElementById(controlId + '_toolbar_FontSize-popup')
                expect(isNullOrUndefined(popupEle)).toBe(true);
            });
        });
        describe(' refresh method - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            let element: HTMLElement;

            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    value: '<p id="rte">RTE</p>',
                    toolbarSettings: {
                        items: ['FontSize']
                    },
                    fontSize: {
                        items: [
                            { text: '8 pt', value: '8pt' },
                            { text: '10 pt', value: '10pt' },
                            { text: '12 pt', value: '12pt' },
                        ]
                    }
                });
                controlId = rteObj.element.id;
                element = rteObj.element;
                done();
            });
            afterAll((done: Function) => {
                detach(element);
                done();
            })
            it(' Test the fontSize dropdown after refresh the component ', () => {
                rteObj.refresh();
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontSize');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_FontSize-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[0] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[0] as HTMLElement).click();
                let popupEle: HTMLElement = document.getElementById(controlId + '_toolbar_FontSize-popup')
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
                        items: ['FontSize']
                    },
                    fontSize: {
                        items: [
                            { text: '8 pt', value: '8pt' },
                            { text: '10 pt', value: '10pt' },
                            { text: '12 pt', value: '12pt' },
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
            it(' Test the actionBegin, actionComplete and toolbarClick events trigger after apply the fontSize and focusOut', () => {
                rteObj.focusIn();
                dispatchEvent((rteObj as any).inputElement, 'focusin');
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontSize');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_FontSize-popup');
                dispatchEvent((popup.querySelectorAll('.e-item')[0] as HTMLElement), 'mousedown');
                (popup.querySelectorAll('.e-item')[0] as HTMLElement).click();
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