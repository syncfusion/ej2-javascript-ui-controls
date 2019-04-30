import { Toolbar, HtmlEditor, RichTextEditor, Count, Link, Image, QuickToolbar } from './../../../../src/index';
import { renderRTE, destroy, dispatchEvent, setCursorPoint } from './../../render.spec';
import { detach, isNullOrUndefined } from '@syncfusion/ej2-base';

RichTextEditor.Inject(HtmlEditor);
RichTextEditor.Inject(Toolbar);
RichTextEditor.Inject(Link);
RichTextEditor.Inject(Count);
RichTextEditor.Inject(Image);
RichTextEditor.Inject(QuickToolbar);

describe('RTE SELECTION BASED - backgroundColor - ', () => {

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
            expect(rteObj.backgroundColor.default === '#ffff00').toBe(true);
        });
        it(' Test the default value of colorCode ', () => {
            expect(rteObj.backgroundColor.colorCode.Custom.length === 60).toBe(true);
        });

        it(' Test the default value of mode ', () => {
            expect(rteObj.backgroundColor.mode === 'Palette').toBe(true);
        });

        it(' Test the default value of columns ', () => {
            expect(rteObj.backgroundColor.columns === 10).toBe(true);
        });

        it(' Test the default value of modeSwitcher ', () => {
            expect(rteObj.backgroundColor.modeSwitcher === false).toBe(true);
        });
    });

    describe(' PROPERTIES - ', () => {
        describe(' toolbarSettings property - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            let toolbar: HTMLElement;
            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    value: '<p id="rte">RTE</p>',
                    toolbarSettings: {
                        items: ['BackgroundColor']
                    },
                    backgroundColor: {
                        colorCode: {
                            'Custom': ['', '#000000', '#ffff00', '#00ff00']
                        }
                    }
                });
                controlId = rteObj.element.id;
                toolbar = rteObj.element.querySelector('.e-rte-toolbar');
                done();
            });
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            })
            it(' Test the apply the background color to the selected node while click the toolbar item', (done) => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_BackgroundColor');
                item = (item.querySelector('.e-rte-color-content') as HTMLElement);
                dispatchEvent(item, 'mousedown');
                item.click();
                let span: HTMLSpanElement = pEle.querySelector('span');
                expect(span.style.backgroundColor === 'rgb(255, 255, 0)').toBe(true);
                done();
            });
        });
    });

    describe(' onPropertyChange - ', () => {
        describe(' change the backgroundColor.colorCode - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            let toolbar: HTMLElement;
            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    value: '<p id="rte">RTE</p>',
                    toolbarSettings: {
                        items: ['BackgroundColor']
                    },
                });
                rteObj.backgroundColor = {
                    colorCode: {
                        'Custom': ['', '#000000', '#ffff00', '#00ff00']
                    }
                };
                rteObj.dataBind();
                controlId = rteObj.element.id;
                toolbar = rteObj.element.querySelector('.e-rte-toolbar');
                done();
            });
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            })
            it(' Test the backgroundColor change dynamically ', (done) => {
                let popup: HTMLElement = document.querySelector('#' + controlId + '_toolbar_BackgroundColor-popup');
                let palette = popup.querySelectorAll(".e-rte-square-palette");
                expect(palette.length === 4).toBe(true);
                done();
            });
            it(' Test the backgroundColor default value change dynamically ', (done) => {
                rteObj.backgroundColor = {
                    default: '#00ff00'
                };
                rteObj.dataBind();
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_BackgroundColor');
                item = (item.querySelector('.e-rte-color-content') as HTMLElement);
                dispatchEvent(item, 'mousedown');
                item.click();
                let span: HTMLSpanElement = pEle.querySelector('span');
                expect(span.style.backgroundColor === 'rgb(0, 255, 0)').toBe(true);
                done();
            });
        });

        describe(' change the backgroundColor.modeSwitcher - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    value: '<p id="rte">RTE</p>',
                    toolbarSettings: {
                        items: ['BackgroundColor']
                    },
                });
                controlId = rteObj.element.id;
                done();
            });
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            })

            it(" Test the modeSwitcher element", () => {
                rteObj.backgroundColor = {
                    modeSwitcher: true
                };
                rteObj.dataBind();
                let popup: HTMLElement = document.querySelector('#' + controlId + '_toolbar_BackgroundColor-popup');
                let switchEle: HTMLElement = popup.querySelector(".e-mode-switch-btn");
                expect(!isNullOrUndefined(switchEle)).toBe(true);
            });
        });

        describe(' change the backgroundColor.mode - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    value: '<p id="rte">RTE</p>',
                    toolbarSettings: {
                        items: ['BackgroundColor']
                    },
                });

                controlId = rteObj.element.id;
                done();
            });
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            })

            it(" Test the mode as Picker", () => {
                rteObj.backgroundColor = {
                    mode: 'Picker'
                };
                rteObj.dataBind();
                let popup: HTMLElement = document.querySelector('#' + controlId + '_toolbar_BackgroundColor-popup');
                let container: HTMLElement = popup.querySelector(".e-hsv-container");
                expect(!isNullOrUndefined(container)).toBe(true);
            });
        });
        describe(' change the backgroundColor.columns - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    value: '<p id="rte">RTE</p>',
                    toolbarSettings: {
                        items: ['BackgroundColor']
                    },
                });

                controlId = rteObj.element.id;
                done();
            });
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            })

            it(" Test the columns", () => {
                rteObj.backgroundColor = {
                    columns: 12
                };
                rteObj.dataBind();
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_BackgroundColor');
                item = (item.querySelector('.e-icon-right') as HTMLElement);
                dispatchEvent(item, 'mousedown');
                item.click();
                dispatchEvent(item, 'mousedown');
                let popup: HTMLElement = document.querySelector('#' + controlId + '_toolbar_BackgroundColor-popup');
                let columns: any = popup.querySelector(".e-palette .e-row");
                expect(columns.querySelectorAll('.e-rte-square-palette').length === 12).toBe(true);
                expect((popup.querySelector('.e-container.e-color-palette') as HTMLElement).style.width !== '0px').toBe(true)
            });
        });
        describe(' change the backgroundColor.default - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    value: '<p id="rte">RTE</p>',
                    toolbarSettings: {
                        items: ['BackgroundColor']
                    },
                });

                controlId = rteObj.element.id;
                done();
            });
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            })

            it(" Test the default value", () => {
                rteObj.backgroundColor = {
                    default: '#33ff33'
                };
                rteObj.dataBind();
                let item: HTMLElement = document.querySelector('#' + controlId + '_toolbar_BackgroundColor');
                item = (item.querySelector('.e-rte-color-content .e-background-color') as HTMLElement);
                expect(item.style.borderBottomColor === 'rgb(51, 255, 51)').toBe(true);
            });
        });
    });
    describe(' PUBLIC METHODS - ', () => {
        describe(' getHtml and getText method - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            let toolbar: HTMLElement;
            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    value: '<p id="rte">RTE</p>',
                    toolbarSettings: {
                        items: ['BackgroundColor']
                    },
                    backgroundColor: {
                        colorCode: {
                            'Custom': ['', '#000000', '#ffff00', '#00ff00']
                        }
                    }
                });
                controlId = rteObj.element.id;
                toolbar = rteObj.element.querySelector('.e-rte-toolbar');
                done();
            });
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            })
            it(' Test the getHtml method after apply the background color ', (done) => {
                rteObj.focusIn();
                dispatchEvent((rteObj as any).inputElement, 'focusin');
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_BackgroundColor');
                item = (item.querySelector('.e-rte-color-content') as HTMLElement);
                dispatchEvent(item, 'mousedown');
                item.click();
                document.body.click();
                dispatchEvent(document.body, 'mousedown');
                (rteObj as any).isBlur = true;
                dispatchEvent((rteObj as any).inputElement, 'focusout');
                expect(rteObj.getHtml() === '<p id="rte"><span style="background-color: rgb(255, 255, 0);">RTE</span></p>').toBe(true);
                done();
            });
            it(' Test the getText method after apply the background color ', () => {
                expect(rteObj.getText() === 'RTE').toBe(true);
            });
        });

        describe(' showSourceCode - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            let toolbar: HTMLElement;
            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    value: '<p id="rte">RTE</p>',
                    toolbarSettings: {
                        items: ['BackgroundColor']
                    },
                    backgroundColor: {
                        colorCode: {
                            'Custom': ['', '#000000', '#ffff00', '#00ff00']
                        }
                    }
                });
                controlId = rteObj.element.id;
                toolbar = rteObj.element.querySelector('.e-rte-toolbar');
                done();
            });
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            })
            it(' Test the showSourceCode method after apply the background color ', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_BackgroundColor');
                item = (item.querySelector('.e-rte-color-content') as HTMLElement);
                dispatchEvent(item, 'mousedown');
                item.click();
                rteObj.showSourceCode();
                let textArea: HTMLTextAreaElement = rteObj.element.querySelector('.e-rte-srctextarea');
                expect(textArea.value === '<p id="rte"><span style="background-color: rgb(255, 255, 0);">RTE</span></p>').toBe(true);
            });
        });

        describe(' destroy - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            let element: HTMLElement;

            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    value: '<p id="rte">RTE</p>',
                    toolbarSettings: {
                        items: ['BackgroundColor']
                    },
                    backgroundColor: {
                        colorCode: {
                            'Custom': ['', '#000000', '#ffff00', '#00ff00']
                        }
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
            it(' Test the colorPicker element after destroy the component ', () => {
                rteObj.destroy();
                let popupEle: HTMLElement = document.getElementById(controlId + '_toolbar_BackgroundColor-popup')
                expect(isNullOrUndefined(popupEle)).toBe(true);
            });
        });
        describe(' refresh - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            let element: HTMLElement;

            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    value: '<p id="rte">RTE</p>',
                    toolbarSettings: {
                        items: ['BackgroundColor']
                    },
                    backgroundColor: {
                        colorCode: {
                            'Custom': ['', '#000000', '#ffff00', '#00ff00']
                        }
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
            it(' Test the colorPicker element after refresh the component ', () => {
                rteObj.refresh();
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_BackgroundColor');
                item = (item.querySelector('.e-rte-color-content') as HTMLElement);
                dispatchEvent(item, 'mousedown');
                item.click();
                let popupEle: HTMLElement = document.getElementById(controlId + '_toolbar_BackgroundColor-popup')
                expect(!isNullOrUndefined(popupEle)).toBe(true);
            });
        });
    });

    describe(' EVENTS - ', () => {

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
                        items: ['BackgroundColor']
                    },
                    backgroundColor: {
                        colorCode: {
                            'Custom': ['', '#000000', '#ffff00', '#00ff00']
                        }
                    }
                });
                controlId = rteObj.element.id;
                done();
            });
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            })
            it(' Test the actionBegin, actionComplete and toolbarClick events trigger after apply the background color and focusOut', () => {
                rteObj.focusIn();
                dispatchEvent((rteObj as any).inputElement, 'focusin');
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_BackgroundColor');
                item = (item.querySelector('.e-rte-color-content') as HTMLElement);
                dispatchEvent(item, 'mousedown');
                item.click();
                document.body.click();
                dispatchEvent(document.body, 'mousedown');
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