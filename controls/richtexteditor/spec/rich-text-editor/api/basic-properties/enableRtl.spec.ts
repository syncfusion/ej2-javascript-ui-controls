/**
 * enableRtl spec
 */
import { detach, } from '@syncfusion/ej2-base';
import { RichTextEditor, IRenderer, QuickToolbar } from './../../../../src/index';
import { renderRTE, destroy, dispatchEvent, setCursorPoint } from './../../render.spec';

function getQTBarModule(rteObj: RichTextEditor): QuickToolbar {
    return rteObj.quickToolbarModule;
}

describe('RTE BASIC PROPERTIES - enableRtl - ', () => {

    describe(' PUBLIC METHODS - ', () => {
        describe(' destroy - ', () => {
            let rteObj: RichTextEditor;
            afterEach((done: Function) => {
                detach(rteObj.element);
                done();
            })

            it(' Test the e-rtl class remove from root element after destroy the component', () => {
                rteObj = renderRTE({
                    enableRtl: true
                });
                let element: HTMLElement = rteObj.element;
                rteObj.destroy();
                expect(element.classList.contains('e-rtl')).toBe(false);
            });
        });
    });
    describe(' PROPERTIES - ', () => {

        describe(' Inline quick toolbar ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    inlineMode: {
                        enable: true,
                        onSelection: false
                    },
                    toolbarSettings: {
                        enable: true,
                        items: ['Bold', 'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
                            'Formats', 'Alignments', 'CreateLink', 'Image']
                    },
                    quickToolbarSettings: { enable: true },
                    value: `<p id="inline">Inline</p>`
                });
                controlId = rteObj.element.id;
                rteObj.enableRtl = true;
                rteObj.dataBind();
                done();
            });

            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            });

            it(' Test the e-rtl class to inline toolbar ', (done) => {
                let paragraph: HTMLElement = rteObj.element.querySelector("#inline");
                setCursorPoint(paragraph, 0);
                dispatchEvent(paragraph, 'mouseup');
                setTimeout(() => {
                    expect(document.querySelector(".e-rte-quick-toolbar").classList.contains('e-rtl')).toBe(true);
                    done();
                }, 500);
            });

            it(' Test the e-rtl class to font family of dropdown component ', (done) => {
                let item: HTMLElement = document.querySelector('#' + controlId + '_quick_FontName');
                expect(item.classList.contains('e-rtl')).toBe(true);
                item.click();
                let dropDown: HTMLElement = document.getElementById(controlId + "_quick_FontName-popup");
                expect(dropDown.classList.contains('e-rtl')).toBe(true);
                item.click();
                done();
            });

            it(' Test the e-rtl class to font size of dropdown component ', (done) => {
                let item: HTMLElement = document.querySelector('#' + controlId + '_quick_FontSize');
                expect(item.classList.contains('e-rtl')).toBe(true);
                item.click();
                let dropDown: HTMLElement = document.getElementById(controlId + "_quick_FontSize-popup");
                expect(dropDown.classList.contains('e-rtl')).toBe(true);
                item.click();
                done();
            });

            it(' Test the e-rtl class to font color of colorpicker component ', (done) => {
                let item: HTMLElement = document.querySelector('#' + controlId + '_quick_FontColor');
                expect(item.classList.contains('e-rtl')).toBe(true);
                item.click();
                let dropDown: HTMLElement = document.getElementById(controlId + "_quick_FontColor-popup");
                expect(dropDown.querySelector('.e-rte-fontcolor-colorpicker').classList.contains('e-rtl')).toBe(false);
                item.click();
                done();
            });

            it(' Test the e-rtl class to background color of colorpicker component ', (done) => {
                let item: HTMLElement = document.querySelector('#' + controlId + '_quick_BackgroundColor');
                expect(item.classList.contains('e-rtl')).toBe(true);
                item.click();
                let dropDown: HTMLElement = document.getElementById(controlId + "_quick_BackgroundColor-popup");
                expect(dropDown.querySelector('.e-rte-backgroundcolor-colorpicker').classList.contains('e-rtl')).toBe(false);
                item.click();
                done();
            });

            it(' Test the e-rtl class to formats of dropdown component ', (done) => {
                let item: HTMLElement = document.querySelector('#' + controlId + '_quick_Formats');
                expect(item.classList.contains('e-rtl')).toBe(true);
                item.click();
                let dropDown: HTMLElement = document.getElementById(controlId + "_quick_Formats-popup");
                expect(dropDown.classList.contains('e-rtl')).toBe(true);
                item.click();
                done();
            });

            it(' Test the e-rtl class to alignments of dropdown component ', (done) => {
                let item: HTMLElement = document.querySelector('#' + controlId + '_quick_Alignments');
                expect(item.classList.contains('e-rtl')).toBe(true);
                item.click();
                let dropDown: HTMLElement = document.getElementById(controlId + "_quick_Alignments-popup");
                expect(dropDown.classList.contains('e-rtl')).toBe(true);
                item.click();
                done();
            });

            it(' Test the e-rtl class to link dialog ', (done) => {
                let button: HTMLElement = document.querySelector("#" + controlId + '_quick_CreateLink');
                let toolItem: HTMLElement = button.parentElement;
                toolItem.click();
                let dropDown: HTMLElement = document.getElementById(controlId + "_rtelink");
                expect(dropDown.classList.contains('e-rtl')).toBe(true);
                let cancelBtn: HTMLElement = dropDown.querySelectorAll('button')[2];
                cancelBtn.click();
                done();
            });

            it(' Test the e-rtl class to image dialog ', (done) => {
                let paragraph: HTMLElement = rteObj.element.querySelector("#inline");
                setCursorPoint(paragraph, 0);
                dispatchEvent(paragraph, 'mouseup');
                setTimeout(() => {
                    let button: HTMLElement = document.querySelector("#" + controlId + '_quick_Image');
                    let toolItem: HTMLElement = button.parentElement;
                    toolItem.click();
                    let dropDown: HTMLElement = document.getElementById(controlId + "_image");
                    expect(dropDown.classList.contains('e-rtl')).toBe(true);
                    let cancelBtn: HTMLElement = dropDown.querySelector('.e-cancel');
                    cancelBtn.click();
                    done();
                }, 500);
            });
        });
    });

    describe(' onPropertyChange :- ', () => {

        describe(' toolbarSettings property - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        enable: true,
                        items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
                            'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
                            'LowerCase', 'UpperCase', '|',
                            'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
                            'Outdent', 'Indent', '|',
                            'CreateLink', 'Image', '|', 'ClearFormat', 'Print',
                            'SourceCode', 'FullScreen', '|', 'Undo', 'Redo']
                    }
                });
                controlId = rteObj.element.id;
                rteObj.enableRtl = true;
                rteObj.dataBind();
                done();
            });

            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            });

            it(' Test the e-rtl class to toolbar target element ', () => {
                expect(rteObj.element.querySelector('.e-rte-toolbar').classList.contains('e-rtl')).toBe(true);
            });

            it(' Test the e-rtl class to font family of dropdown component ', () => {
                let dropDown: HTMLElement = document.getElementById(controlId + "_toolbar_FontName-popup");
                expect(dropDown.classList.contains('e-rtl')).toBe(true);
            });

            it(' Test the e-rtl class to font size of dropdown component ', () => {
                let dropDown: HTMLElement = document.getElementById(controlId + "_toolbar_FontSize-popup");
                expect(dropDown.classList.contains('e-rtl')).toBe(true);
            });

            it(' Test the e-rtl class to font color of colorpicker component ', () => {
                let dropDown: HTMLElement = document.getElementById(controlId + "_toolbar_FontColor-popup");
                expect(dropDown.querySelector('.e-rte-fontcolor-colorpicker').classList.contains('e-rtl')).toBe(true);
            });

            it(' Test the e-rtl class to background color of colorpicker component ', () => {
                let dropDown: HTMLElement = document.getElementById(controlId + "_toolbar_BackgroundColor-popup");
                expect(dropDown.querySelector('.e-rte-backgroundcolor-colorpicker').classList.contains('e-rtl')).toBe(true);
            });

            it(' Test the e-rtl class to formats of dropdown component ', () => {
                let dropDown: HTMLElement = document.getElementById(controlId + "_toolbar_Formats-popup");
                expect(dropDown.classList.contains('e-rtl')).toBe(true);
            });

            it(' Test the e-rtl class to alignments of dropdown component ', () => {
                let dropDown: HTMLElement = document.getElementById(controlId + "_toolbar_Alignments-popup");
                expect(dropDown.classList.contains('e-rtl')).toBe(true);
            });

            it(' Test the e-rtl class to link dialog ', () => {
                let button: HTMLElement = rteObj.element.querySelector("#" + controlId + '_toolbar_CreateLink');
                let toolItem: HTMLElement = button.parentElement;
                toolItem.click();
                let dropDown: HTMLElement = document.getElementById(controlId + "_rtelink");
                expect(dropDown.classList.contains('e-rtl')).toBe(true);
                dispatchEvent(document as any, 'mousedown')
            });

            it(' Test the e-rtl class to image dialog ', () => {
                let button: HTMLElement = rteObj.element.querySelector("#" + controlId + '_toolbar_Image');
                let toolItem: HTMLElement = button.parentElement;
                toolItem.click();
                let dropDown: HTMLElement = document.getElementById(controlId + "_image");
                expect(dropDown.classList.contains('e-rtl')).toBe(true);
            });
        });

        describe(' Inline quick toolbar ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    inlineMode: {
                        enable: true,
                        onSelection: false
                    },
                    toolbarSettings: {
                        enable: true,
                        items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
                            'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
                            'LowerCase', 'UpperCase', '|',
                            'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
                            'Outdent', 'Indent', '|',
                            'CreateLink', 'Image', '|', 'ClearFormat', 'Print',
                            'SourceCode', 'FullScreen', '|', 'Undo', 'Redo']
                    },
                    quickToolbarSettings: { enable: true },
                    value: `<p id="inline">Inline</p>`
                });
                controlId = rteObj.element.id;
                rteObj.enableRtl = true;
                rteObj.dataBind();
                done();
            });

            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            });

            it(' Test the e-rtl class to inline toolbar ', (done) => {
                let paragraph: HTMLElement = rteObj.element.querySelector("#inline");
                setCursorPoint(paragraph, 0);
                dispatchEvent(paragraph, 'mouseup');
                setTimeout(() => {
                    expect(document.querySelector(".e-rte-quick-toolbar").classList.contains('e-rtl')).toBe(true);
                    done();
                }, 500);
            });

            it(' Test the e-rtl class to font family of dropdown component ', (done) => {
                let paragraph: HTMLElement = rteObj.element.querySelector("#inline");
                setCursorPoint(paragraph, 0);
                dispatchEvent(paragraph, 'mouseup');
                setTimeout(() => {
                    expect(document.querySelector(".e-rte-quick-toolbar").classList.contains('e-rtl')).toBe(true);
                    let item: HTMLElement = document.querySelector('#' + controlId + '_quick_FontName');
                    expect(item.classList.contains('e-rtl')).toBe(true);
                    item.click();
                    let dropDown: HTMLElement = document.getElementById(controlId + "_quick_FontName-popup");
                    expect(dropDown.classList.contains('e-rtl')).toBe(true);
                    done();
                }, 500);
            });

            it(' Test the e-rtl class to font size of dropdown component ', (done) => {
                let paragraph: HTMLElement = rteObj.element.querySelector("#inline");
                setCursorPoint(paragraph, 0);
                dispatchEvent(paragraph, 'mouseup');
                setTimeout(() => {
                    expect(document.querySelector(".e-rte-quick-toolbar").classList.contains('e-rtl')).toBe(true);
                    let item: HTMLElement = document.querySelector('#' + controlId + '_quick_FontSize');
                    expect(item.classList.contains('e-rtl')).toBe(true);
                    item.click();
                    let dropDown: HTMLElement = document.getElementById(controlId + "_quick_FontSize-popup");
                    expect(dropDown.classList.contains('e-rtl')).toBe(true);
                    done();
                }, 500);
            });

            it(' Test the e-rtl class to font color of colorpicker component ', (done) => {
                let paragraph: HTMLElement = rteObj.element.querySelector("#inline");
                setCursorPoint(paragraph, 0);
                dispatchEvent(paragraph, 'mouseup');
                setTimeout(() => {
                    expect(document.querySelector(".e-rte-quick-toolbar").classList.contains('e-rtl')).toBe(true);
                    let item: HTMLElement = document.querySelector('#' + controlId + '_quick_FontColor');
                    expect(item.classList.contains('e-rtl')).toBe(true);
                    item.click();
                    let dropDown: HTMLElement = document.getElementById(controlId + "_quick_FontColor-popup");
                    expect(dropDown.querySelector('.e-rte-fontcolor-colorpicker').classList.contains('e-rtl')).toBe(false);
                    item.click();
                    done();
                }, 500);
            });

            it(' Test the e-rtl class to background color of colorpicker component ', (done) => {
                let paragraph: HTMLElement = rteObj.element.querySelector("#inline");
                setCursorPoint(paragraph, 0);
                dispatchEvent(paragraph, 'mouseup');
                setTimeout(() => {
                    expect(document.querySelector(".e-rte-quick-toolbar").classList.contains('e-rtl')).toBe(true);
                    let item: HTMLElement = document.querySelector('#' + controlId + '_quick_BackgroundColor');
                    expect(item.classList.contains('e-rtl')).toBe(true);
                    item.click();
                    let dropDown: HTMLElement = document.getElementById(controlId + "_quick_BackgroundColor-popup");
                    expect(dropDown.querySelector('.e-rte-backgroundcolor-colorpicker').classList.contains('e-rtl')).toBe(false);
                    done();
                }, 500);
            });

            it(' Test the e-rtl class to formats of dropdown component ', (done) => {
                let paragraph: HTMLElement = rteObj.element.querySelector("#inline");
                setCursorPoint(paragraph, 0);
                dispatchEvent(paragraph, 'mouseup');
                setTimeout(() => {
                    expect(document.querySelector(".e-rte-quick-toolbar").classList.contains('e-rtl')).toBe(true);
                    let item: HTMLElement = document.querySelector('#' + controlId + '_quick_Formats');
                    expect(item.classList.contains('e-rtl')).toBe(true);
                    item.click();
                    let dropDown: HTMLElement = document.getElementById(controlId + "_quick_Formats-popup");
                    expect(dropDown.classList.contains('e-rtl')).toBe(true);
                    done();
                }, 500);
            });

            it(' Test the e-rtl class to alignments of dropdown component ', (done) => {
                let paragraph: HTMLElement = rteObj.element.querySelector("#inline");
                setCursorPoint(paragraph, 0);
                dispatchEvent(paragraph, 'mouseup');
                setTimeout(() => {
                    expect(document.querySelector(".e-rte-quick-toolbar").classList.contains('e-rtl')).toBe(true);
                    let item: HTMLElement = document.querySelector('#' + controlId + '_quick_Alignments');
                    expect(item.classList.contains('e-rtl')).toBe(true);
                    item.click();
                    let dropDown: HTMLElement = document.getElementById(controlId + "_quick_Alignments-popup");
                    expect(dropDown.classList.contains('e-rtl')).toBe(true);
                    done();
                }, 500);
            });

            it(' Test the e-rtl class to link dialog ', (done) => {
                let paragraph: HTMLElement = rteObj.element.querySelector("#inline");
                setCursorPoint(paragraph, 0);
                dispatchEvent(paragraph, 'mouseup');
                setTimeout(() => {
                    expect(document.querySelector(".e-rte-quick-toolbar").classList.contains('e-rtl')).toBe(true);
                    let button: HTMLElement = document.querySelector("#" + controlId + '_quick_CreateLink');
                    let toolItem: HTMLElement = button.parentElement;
                    toolItem.click();
                    let dropDown: HTMLElement = document.getElementById(controlId + "_rtelink");
                    expect(dropDown.classList.contains('e-rtl')).toBe(true);
                    let cancelBtn: HTMLElement = dropDown.querySelectorAll('button')[2];
                    cancelBtn.click();
                    done();
                }, 500);
            });

            it(' Test the e-rtl class to image dialog ', (done) => {
                let paragraph: HTMLElement = rteObj.element.querySelector("#inline");
                setCursorPoint(paragraph, 0);
                dispatchEvent(paragraph, 'mouseup');
                setTimeout(() => {
                    let button: HTMLElement = document.querySelector("#" + controlId + '_quick_Image');
                    let toolItem: HTMLElement = button.parentElement;
                    toolItem.click();
                    setTimeout(() => {
                        let dropDown: HTMLElement = document.getElementById(controlId + "_image");
                        expect(dropDown.classList.contains('e-rtl')).toBe(true);
                        let cancelBtn: HTMLElement = dropDown.querySelector('.e-cancel');
                        cancelBtn.click();
                        done();
                    }, 200);
                }, 500);
            });
        });
    });
    describe(' Quick toolbar item with RTL testing', () => {
        let rteObj: RichTextEditor;
        let trg: HTMLElement;
        let QTBarModule: IRenderer;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: `<p><img id="imageTarget" alt="Logo" src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" style="width: 300px; height: 100px;"></p>`
            });
            trg = <HTMLElement>rteObj.element.querySelectorAll(".e-content")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            QTBarModule = getQTBarModule(rteObj);
            done();
        });

        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });

        it(' Test the e-rtl class to image quick toolbar item ', (done) => {
            let imgTrg: Element = document.querySelector('#imageTarget');
            QTBarModule.imageQTBar.showPopup(200, 1, imgTrg);
            setTimeout(() => {
                rteObj.enableRtl = true;
                rteObj.dataBind();
                expect(document.querySelector(".e-rte-quick-toolbar").classList.contains('e-rtl')).toBe(true);
                done();
            }, 500);
        });
    });
});