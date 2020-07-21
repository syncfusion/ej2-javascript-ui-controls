/**
 * Font color spec
 */
import { isNullOrUndefined, detach } from '@syncfusion/ej2-base';
import { RichTextEditor } from './../../../../src/index';
import { renderRTE, destroy, dispatchEvent } from './../../render.spec';

describe('RTE SELECTION BASED - fontColor - ', () => {

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
            expect(rteObj.fontColor.default === '#ff0000').toBe(true);
        });
        it(' Test the default value of colorCode ', () => {
            expect(rteObj.fontColor.colorCode.Custom.length === 60).toBe(true);
        });

        it(' Test the default value of mode ', () => {
            expect(rteObj.fontColor.mode === 'Palette').toBe(true);
        });

        it(' Test the default value of columns ', () => {
            expect(rteObj.fontColor.columns === 10).toBe(true);
        });

        it(' Test the default value of modeSwitcher ', () => {
            expect(rteObj.fontColor.modeSwitcher === false).toBe(true);
        });
    });

    describe(' toolbarSettings property - ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: '<p id="rte">RTE</p>',
                toolbarSettings: {
                    items: ['fontColor']
                },
                fontColor: {
                    default: '#ffff00',
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
        it(' Test the apply the font color to the selected node while click the toolbar item', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontColor');
            item = (item.querySelector('.e-rte-color-content') as HTMLElement);
            dispatchEvent(item, 'mousedown');
            item.click();
            dispatchEvent(item, 'mousedown');
            let span: HTMLSpanElement = pEle.querySelector('span');
            expect(span.style.color === 'rgb(255, 255, 0)').toBe(true);
            done();
        });
    });

    describe(' onPropertyChange - ', () => {
        describe(' change the fontColor.colorCode - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    value: '<p id="rte">RTE</p>',
                    toolbarSettings: {
                        items: ['FontColor']
                    },
                });
                rteObj.fontColor = {
                    colorCode: {
                        'Custom': ['', '#000000', '#ffff00', '#00ff00']
                    }
                };
                rteObj.dataBind();
                controlId = rteObj.element.id;
                done();
            });
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            })
            it(' Test the FontColor change dynamically ', (done) => {
                let popup: HTMLElement = document.querySelector('#' + controlId + '_toolbar_FontColor-popup');
                let palette = popup.querySelectorAll(".e-rte-square-palette");
                expect(palette.length === 4).toBe(true);
                done();
            });
            it(' Test the FontColor default value change dynamically ', (done) => {
                rteObj.fontColor = {
                    default: '#00ff00'
                };
                rteObj.dataBind();
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontColor');
                item = (item.querySelector('.e-rte-color-content') as HTMLElement);
                dispatchEvent(item, 'mousedown');
                item.click();
                let span: HTMLSpanElement = pEle.querySelector('span');
                expect(span.style.color === 'rgb(0, 255, 0)').toBe(true);
                done();
            });
        });

        describe(' change the fontColor.modeSwitcher - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    value: '<p id="rte">RTE</p>',
                    toolbarSettings: {
                        items: ['FontColor']
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
                rteObj.fontColor = {
                    modeSwitcher: true
                };
                rteObj.dataBind();
                let popup: HTMLElement = document.querySelector('#' + controlId + '_toolbar_FontColor-popup');
                let switchEle: HTMLElement = popup.querySelector(".e-mode-switch-btn");
                expect(!isNullOrUndefined(switchEle)).toBe(true);
            });
        });

        describe(' change the fontColor.mode - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    value: '<p id="rte">RTE</p>',
                    toolbarSettings: {
                        items: ['FontColor']
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
                rteObj.fontColor = {
                    mode: 'Picker'
                };
                rteObj.dataBind();
                let popup: HTMLElement = document.querySelector('#' + controlId + '_toolbar_FontColor-popup');
                let container: HTMLElement = popup.querySelector(".e-hsv-container");
                expect(!isNullOrUndefined(container)).toBe(true);
            });
        });
        describe(' change the fontColor.columns - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    value: '<p id="rte">RTE</p>',
                    toolbarSettings: {
                        items: ['FontColor']
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
                rteObj.fontColor = {
                    columns: 12
                };
                rteObj.dataBind();
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontColor');
                item = (item.querySelector('.e-icon-right') as HTMLElement);
                dispatchEvent(item, 'mousedown');
                item.click();
                dispatchEvent(item, 'mousedown');
                let popup: HTMLElement = document.querySelector('#' + controlId + '_toolbar_FontColor-popup');
                let columns: any = popup.querySelector(".e-palette .e-row");
                expect(columns.querySelectorAll('.e-rte-square-palette').length === 12).toBe(true);
                expect((popup.querySelector('.e-container.e-color-palette') as HTMLElement).style.width !== '0px').toBe(true)
            });
        });
        describe(' change the fontColor.default - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    value: '<p id="rte">RTE</p>',
                    toolbarSettings: {
                        items: ['FontColor']
                    },
                });
                rteObj.fontColor = {
                    default: '#bf8f00'
                };
                rteObj.dataBind();
                controlId = rteObj.element.id;
                done();
            });
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            })

            it(" Test the default value", () => {
                let item: HTMLElement = document.querySelector('#' + controlId + '_toolbar_FontColor');
                item = (item.querySelector('.e-rte-color-content .e-font-color') as HTMLElement);
                expect(item.style.borderBottomColor === 'rgb(191, 143, 0)').toBe(true);
            });
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
                        items: ['fontColor']
                    },
                    fontColor: {
                        default: '#ffff00',
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
            it(' Test the getHtml method after apply the font color ', (done) => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontColor');
                item = (item.querySelector('.e-rte-color-content') as HTMLElement);
                dispatchEvent(item, 'mousedown');
                item.click();
                dispatchEvent(document.body, 'mousedown');
                document.body.click();
                (rteObj as any).isBlur = true;
                dispatchEvent((rteObj as any).inputElement, 'focusout');
                expect(rteObj.getHtml() === '<p id="rte"><span style="color: rgb(255, 255, 0); text-decoration: inherit;">RTE</span></p>').toBe(true);
                done();
            });
            it(' Test the getText method after apply the background color ', () => {
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
                        items: ['fontColor']
                    },
                    fontColor: {
                        default: '#ffff00',
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
            it(' Test the showSourceCode method after apply the background color ', (done) => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontColor');
                item = (item.querySelector('.e-rte-color-content') as HTMLElement);
                dispatchEvent(item, 'mousedown');
                item.click();
                rteObj.showSourceCode();
                let textArea: HTMLTextAreaElement = rteObj.element.querySelector('.e-rte-srctextarea');
                expect(textArea.value === '<p id="rte"><span style="color: rgb(255, 255, 0); text-decoration: inherit;">RTE</span></p>').toBe(true);
                done();
            });
        });

        describe(' destroy method - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;

            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    value: '<p id="rte">RTE</p>',
                    toolbarSettings: {
                        items: ['fontColor']
                    },
                    fontColor: {
                        default: '#ffff00',
                        colorCode: {
                            'Custom': ['', '#000000', '#ffff00', '#00ff00']
                        }
                    }
                });
                controlId = rteObj.element.id;
                done();
            });
            afterAll((done: Function) => {
                detach(rteObj.element);
                done();
            })
            it(' Test the colorPicker element after destroy the component ', () => {
                rteObj.destroy();
                let popupEle: HTMLElement = document.getElementById(controlId + '_toolbar_FontColor-popup')
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
                        items: ['fontColor']
                    },
                    fontColor: {
                        default: '#ffff00',
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
            it(' Test the colorPicker element after refresh the component ', (done) => {
                rteObj.refresh();
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontColor');
                item = (item.querySelector('.e-rte-color-content') as HTMLElement);
                dispatchEvent(item, 'mousedown');
                item.click();
                let popupEle: HTMLElement = document.getElementById(controlId + '_toolbar_FontColor-popup')
                expect(!isNullOrUndefined(popupEle)).toBe(true);
                done();
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
                        items: ['fontColor']
                    },
                    fontColor: {
                        default: '#ffff00',
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
            it(' Test the actionBegin, actionComplete and toolbarClick events trigger after apply the background color and focusOut', (done) => {
                rteObj.focusIn();
                dispatchEvent((rteObj as any).inputElement, 'focusin');
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontColor');
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
                done();
            });
        });
    });
    describe('font color in table-', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: "<p><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in\n                client side.</p><table class=\"e-rte-table\" style=\"width: 100%;\"><thead><tr><th class=\"e-cell-select\"><br></th><th><br></th></tr></thead><tbody><tr><td style=\"width: 50%;\" class=\"\">Rich Text Editor</td><td style=\"width: 50%;\"><br></td></tr><tr><td style=\"width: 50%;\"><br></td><td style=\"width: 50%;\"><br></td></tr></tbody></table>\n                ",
                toolbarSettings: {
                    items: ['fontColor']
                },
                fontColor: {
                    default: '#ffff00',
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
        it(' Test the apply the font color to the selected node while click the toolbar item', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('td');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontColor');
            item = (item.querySelector('.e-rte-color-content') as HTMLElement);
            dispatchEvent(item, 'mousedown');
            item.click();
            dispatchEvent(item, 'mousedown');
            let span: HTMLSpanElement = pEle.querySelector('span');
            expect(span.style.color === 'rgb(255, 255, 0)').toBe(true);
            done();
        });
    });

    describe('EJ2-41061 - Issue with selecting the transparent color from the FontColor in Rich Text Editor ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: '<p id="rte">RTE</p>',
                toolbarSettings: {
                    items: ['FontColor', 'BackgroundColor']
                },
                fontColor: {
                    default: '',
                    colorCode: {
                        'Custom': ['', '#000000', '#ffff00', '#00ff00']
                    },
                    modeSwitcher: true
                },
                backgroundColor: {
                    default: '',
                    colorCode: {
                        'Custom': ['', '#000000', '#ffff00', '#00ff00']
                    },
                    modeSwitcher: true
                }
            });
            controlId = rteObj.element.id;
            rteObj.focusIn();
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        })
        it(' Test the FontColor ', (done) => {
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontColor');
            (item.querySelector('.e-btn-icon.e-caret') as HTMLElement).click();
            let fontColorPopup: Element = document.querySelector('#' + controlId + '_toolbar_FontColor-popup');
            expect(fontColorPopup.classList.contains('e-popup-open')).toBe(true);
            expect(fontColorPopup.querySelector('.e-custom-palette .e-row > .e-selected').getAttribute('aria-label')).toBe('');
            expect(fontColorPopup.querySelector('.e-custom-palette .e-row > .e-selected').classList.contains('e-nocolor-item')).toBe(true);
            (fontColorPopup.querySelector('.e-mode-switch-btn') as HTMLElement).click();
            expect(fontColorPopup.querySelectorAll('.e-custom-palette').length > 0).toBe(false);
            expect(fontColorPopup.querySelectorAll('.e-color-picker').length > 0).toBe(true);
            done();
        });
        it(' Test the BackgroundColor ', (done) => {
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_BackgroundColor');
            (item.querySelector('.e-btn-icon.e-caret') as HTMLElement).click();
            let bgColorPopup: Element = document.querySelector('#' + controlId +'_toolbar_BackgroundColor-popup');
            expect(bgColorPopup.classList.contains('e-popup-open')).toBe(true);
            expect(bgColorPopup.querySelector('.e-custom-palette .e-row > .e-selected').getAttribute('aria-label')).toBe('');
            expect(bgColorPopup.querySelector('.e-custom-palette .e-row > .e-selected').classList.contains('e-nocolor-item')).toBe(true);
            (bgColorPopup.querySelector('.e-mode-switch-btn') as HTMLElement).click();
            expect(bgColorPopup.querySelectorAll('.e-custom-palette').length > 0).toBe(false);
            expect(bgColorPopup.querySelectorAll('.e-color-picker').length > 0).toBe(true);
            done();
        });
    });
});