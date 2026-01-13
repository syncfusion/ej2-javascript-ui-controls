/**
 * RTE - Image Browser module spec
 */
import { detach, isNullOrUndefined, Browser } from "@syncfusion/ej2-base";
import { IQuickToolbar, RichTextEditor, QuickToolbar, PasteCleanup } from "../../../src/rich-text-editor/index";
import { ActionBeginEventArgs, ImageSuccessEventArgs } from "../../../src/common/interface";
import { renderRTE, destroy, setCursorPoint, hostURL } from "./../render.spec";
import { Popup } from "@syncfusion/ej2-popups";
import { Uploader } from "@syncfusion/ej2-inputs";
import { BASIC_MOUSE_EVENT_INIT } from "../../constant.spec";
import { PopupUploader } from '../../../src/rich-text-editor/renderer/popup-uploader-renderer';
import { getImageUniqueFIle } from '../../rich-text-editor/online-service.spec';


function getQTBarModule(rteObj: RichTextEditor): QuickToolbar {
    return rteObj.quickToolbarModule;
}

describe('FileManager module', () => {
    describe('FileManager render test', () => {
        let rteObj: RichTextEditor;
        let fileEle: HTMLElement;

        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FileManager']
                },
                fileManagerSettings: {
                    enable: true,
                    path: '/Pictures/Food',
                    ajaxSettings: {
                        url: hostURL + 'api/RichTextEditor/FileOperations',
                        getImageUrl: hostURL + 'api/RichTextEditor/GetImage',
                        uploadUrl: hostURL + 'api/RichTextEditor/Upload'
                    }
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('FileManager class availability testing', (done: Function) => {
            (rteObj.element.querySelector('.e-toolbar-item button') as HTMLElement).click();
            setTimeout(() => {
                fileEle = document.body.querySelector('.e-rte-file-manager-dialog .e-filemanager');
                expect(isNullOrUndefined(fileEle)).toBe(false);
                done();
            }, 500);
        });
        it('image - fileSelect as true', () => {
            (rteObj.fileManagerModule as any).fileObj.trigger('fileSelect', { fileDetails: { filterPath: '\\Pictures', isFile: true, type: '.png' } });
            expect((document.body.querySelector('.e-rte-file-manager-dialog .e-input.e-img-url') as HTMLInputElement).value).toContain('https://ej2services.syncfusion.com/js/development/api/RichTextEditor/GetImage?path=/Pictures');
        });
        it('image FileSelect as false', () => {
            (rteObj.fileManagerModule as any).fileObj.trigger('fileSelect', { fileDetails: { isFile: false, type: '.png' } });
            expect((document.body.querySelector('.e-rte-file-manager-dialog .e-input.e-img-url') as HTMLInputElement).value).toBe('');
        });
        it('insert image button click test', () => {
            let inputUrl: HTMLInputElement = (document.body.querySelector('.e-rte-file-manager-dialog .e-input.e-img-url') as HTMLInputElement);
            inputUrl.value = 'https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png';
            let insertBtn: HTMLButtonElement = document.body.querySelector('.e-rte-file-manager-dialog button.e-primary');
            insertBtn.removeAttribute('disabled');
            insertBtn.click();
            expect(rteObj.element.querySelectorAll('.e-content img').length).toBe(1);
        });
        it('cancel button click testing', (done: Function) => {
            (rteObj.element.querySelector('.e-toolbar-item button') as HTMLElement).click();
            fileEle = document.body.querySelector('.e-rte-file-manager-dialog .e-filemanager');
            expect(isNullOrUndefined(fileEle)).toBe(false);
            setTimeout(() => {
                (document.body.querySelector('.e-rte-file-manager-dialog button.e-cancel') as HTMLElement).click();
                fileEle = document.body.querySelector('.e-rte-file-manager-dialog .e-filemanager');
                expect(isNullOrUndefined(fileEle)).toBe(true);
                done();
            }, 500);
        });
    });

    describe('Mobile - FileManager render test', () => {
        let rteObj: RichTextEditor;
        let fileEle: HTMLElement;
        let mobileUA: string = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36";
        let defaultUA: string = navigator.userAgent;

        beforeAll(() => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FileManager']
                },
                fileManagerSettings: {
                    enable: true,
                    path: '/Pictures/Food',
                    ajaxSettings: {
                        url: hostURL + 'api/RichTextEditor/FileOperations',
                        getImageUrl: hostURL + 'api/RichTextEditor/GetImage',
                        uploadUrl: hostURL + 'api/RichTextEditor/Upload'
                    }
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
            Browser.userAgent = defaultUA;
        });
        it('FileManager class availability testing', (done: Function) => {
            (rteObj.element.querySelector('.e-toolbar-item button') as HTMLElement).click();
            setTimeout(() => {
                fileEle = document.body.querySelector('.e-rte-file-manager-dialog .e-filemanager');
                expect(isNullOrUndefined(fileEle)).toBe(false);
                done();
            }, 500);
        });
        it('image - fileSelect as true', () => {
            (rteObj.fileManagerModule as any).fileObj.trigger('fileSelect', { fileDetails: { filterPath: '\\Pictures', isFile: true, type: '.png' } });
            expect((document.body.querySelector('.e-rte-file-manager-dialog .e-input.e-img-url') as HTMLInputElement).value).toContain('https://ej2services.syncfusion.com/js/development/api/RichTextEditor/GetImage?path=/Pictures');
        });
        it('image FileSelect as false', () => {
            (rteObj.fileManagerModule as any).fileObj.trigger('fileSelect', { fileDetails: { isFile: false, type: '.png' } });
            expect((document.body.querySelector('.e-rte-file-manager-dialog .e-input.e-img-url') as HTMLInputElement).value).toBe('');
        });
        it('insert image button click test', () => {
            let inputUrl: HTMLInputElement = (document.body.querySelector('.e-rte-file-manager-dialog .e-input.e-img-url') as HTMLInputElement);
            inputUrl.value = 'https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png';
            let insertBtn: HTMLButtonElement = document.body.querySelector('.e-rte-file-manager-dialog button.e-primary');
            insertBtn.removeAttribute('disabled');
            insertBtn.click();
            setTimeout(() => {
                expect(rteObj.element.querySelectorAll('.e-content img').length).toBe(1);
            }, 100);
        });
        it('cancel button click testing', (done: Function) => {
            (rteObj.element.querySelector('.e-toolbar-item button') as HTMLElement).click();
            setTimeout(() => {
                fileEle = document.body.querySelector('.e-rte-file-manager-dialog .e-filemanager');
                expect(isNullOrUndefined(fileEle)).toBe(false);
                let cancelBtn: HTMLButtonElement = document.body.querySelector('.e-rte-file-manager-dialog button.e-cancel');
                cancelBtn.click();
                setTimeout(() => {
                    fileEle = document.body.querySelector('.e-rte-file-manager-dialog .e-filemanager');
                    expect(isNullOrUndefined(fileEle)).toBe(true);
                    done();
                }, 100);
            }, 500);
        });
    });

    describe('931520 - PasteCleanup - popupClose method', () => {
        let rteObj: RichTextEditor;
        let pasteCleanup: PasteCleanup;
        let popupObj: Popup;
        let uploadObj: Uploader;
        let imgElem: HTMLImageElement;
        let e: ImageSuccessEventArgs;
        let popupUploaderObj: PopupUploader;
        let mockDragEvent: DragEvent;

        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: '<p>RTE content</p>',
                toolbarSettings: {
                    items: ['Image']
                },
                inlineMode: {
                    enable: true
                }
            });
            setTimeout(() => {
                popupUploaderObj = (rteObj as any).serviceLocator.getService('popupUploaderObject');
                imgElem = document.createElement('img');
                const imageFile = getImageUniqueFIle();
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(imageFile);

                const dragEventInit: DragEventInit = {
                    dataTransfer: dataTransfer
                };
                mockDragEvent = new DragEvent('drop', dragEventInit);
                e = {
                    element: imgElem,
                    file: { statusCode: '2', name: 'test.png' } as any
                } as unknown as ImageSuccessEventArgs;
                pasteCleanup = (rteObj as any).pasteCleanupModule;
                popupObj = popupUploaderObj.renderPopup('Images', imgElem);
                uploadObj = popupUploaderObj.createUploader('Images', mockDragEvent, imgElem, popupObj.element, popupObj);
                    done();
            }, 100);
        });

        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });

        it('PasteCleanup - popupClose method', (done: Function) => {
            (pasteCleanup as any).popupClose(popupObj, imgElem, e);
            rteObj.insertImageSettings.path = "/test/";
            (pasteCleanup as any).popupClose(popupObj, imgElem, e);
            (pasteCleanup as any).popupClose(popupObj, imgElem, {
                element: imgElem,
                file: { statusCode: '3', name: 'test.png' }
            });
            done();
        });
    });

    describe('Empty url with insert image testing', () => {
        let rteObj: RichTextEditor;
        let fileEle: HTMLElement;

        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FileManager']
                },
                fileManagerSettings: {
                    enable: true,
                    path: '/Pictures/Food',
                    ajaxSettings: {
                        url: hostURL + 'api/RichTextEditor/FileOperations',
                        getImageUrl: hostURL + 'api/RichTextEditor/GetImage',
                        uploadUrl: hostURL + 'api/RichTextEditor/Upload'
                    }
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('FileManager class availability testing', (done: Function) => {
            (rteObj.element.querySelector('.e-toolbar-item button') as HTMLElement).click();
            setTimeout(() => {
                fileEle = document.body.querySelector('.e-rte-file-manager-dialog .e-filemanager');
                expect(isNullOrUndefined(fileEle)).toBe(false);
                done();
            }, 500);
        });
        it('Empty url - insert image button click test', () => {
            (document.body.querySelector('.e-rte-file-manager-dialog button.e-primary') as HTMLElement).click();
            expect(rteObj.element.querySelectorAll('.e-content img').length).toBe(0);
        });
    });

    describe('EJ2-59865 - css class dependency component', () => {
        let rteObj: RichTextEditor;

        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FileManager']
                },
                cssClass: 'customClass',
                fileManagerSettings: {
                    enable: true,
                    path: '/Pictures/Food',
                    ajaxSettings: {
                        url: hostURL + 'api/RichTextEditor/FileOperations',
                        getImageUrl: hostURL + 'api/RichTextEditor/GetImage',
                        uploadUrl: hostURL + 'api/RichTextEditor/Upload'
                    }
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('css class dependency initial load and dynamic change', (done: Function) => {
            (rteObj.element.querySelector('.e-toolbar-item button') as HTMLElement).click();
            expect(document.body.querySelector('.e-rte-file-manager-dialog').classList.contains('customClass'));
            rteObj.cssClass = 'changedClass';
            rteObj.dataBind();
            expect(document.body.querySelector('.e-rte-file-manager-dialog').classList.contains('changedClass'));
            setTimeout(() => {
                done();
            }, 500);
        });
    });

    describe('Open FileManager while replace image', () => {
        let trg: HTMLElement;
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let fileEle: HTMLElement;
        let QTBarModule: IQuickToolbar;

        beforeAll(() => {
            rteObj = renderRTE({
                value: '<img src="https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png" />',
                toolbarSettings: {
                    items: ['FileManager']
                },
                fileManagerSettings: {
                    enable: true,
                    path: '/Pictures/Food',
                    ajaxSettings: {
                        url: hostURL + 'api/RichTextEditor/FileOperations',
                        getImageUrl: hostURL + 'api/RichTextEditor/GetImage',
                        uploadUrl: hostURL + 'api/RichTextEditor/Upload'
                    }
                }
            });
            rteEle = rteObj.element;
            trg = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            QTBarModule = getQTBarModule(rteObj);
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Image toolbar open test', (done: Function) => {
            let trg: HTMLElement = <HTMLElement>rteObj.element.querySelectorAll(".e-content img")[0];
            rteObj.formatter.editorManager.nodeSelection.setSelectionNode(document, trg);
            const target: HTMLElement = rteObj.inputElement.querySelector('img');
            const MOUSEUP_EVENT: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                let pop: Element = document.body.querySelector('.e-rte-quick-popup');
                expect(isNullOrUndefined(pop)).toBe(false);
                (pop.querySelectorAll('.e-toolbar-item')[12] as HTMLElement).click();
                setTimeout(() => {
                    fileEle = document.body.querySelector('.e-rte-file-manager-dialog .e-filemanager');
                    expect(isNullOrUndefined(fileEle)).toBe(false);
                    done();
                }, 1000);
            }, 500);
        });
    });
    describe('Document click testing', () => {
        let ele: Element;
        let rteObj: any;
        let fileEle: HTMLElement;

        beforeAll(() => {
            ele = document.createElement('button');
            ele.id = 'myBtn';
            document.body.appendChild(ele);
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FileManager']
                },
                fileManagerSettings: {
                    enable: true,
                    path: '/Pictures/Food',
                    ajaxSettings: {
                        url: hostURL + 'api/RichTextEditor/FileOperations',
                        getImageUrl: hostURL + 'api/RichTextEditor/GetImage',
                        uploadUrl: hostURL + 'api/RichTextEditor/Upload'
                    }
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
            detach(ele);
        });
        it('FileManager class availability testing', (done: Function) => {
            (rteObj.element.querySelector('.e-toolbar-item button') as HTMLElement).click();
            setTimeout(() => {
                fileEle = document.body.querySelector('.e-rte-file-manager-dialog');
                expect(isNullOrUndefined(fileEle)).toBe(false);
                rteObj.fileManagerModule.onDocumentClick({ target: ele });
                // Should Dialog close on document click
                fileEle = document.body.querySelector('.e-rte-file-manager-dialog');
                expect(isNullOrUndefined(fileEle)).toBe(true);
                done();
            }, 500);
        });
    });
    describe('Outside node selection with image insert testing', () => {
        let ele: Element;
        let rteObj: any;
        let rteEle: HTMLElement;
        let fileEle: HTMLElement;

        beforeAll(() => {
            ele = document.createElement('div');
            ele.id = 'myDiv';
            document.body.appendChild(ele);
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FileManager']
                },
                fileManagerSettings: {
                    enable: true,
                    path: '/Pictures/Food',
                    ajaxSettings: {
                        url: hostURL + 'api/RichTextEditor/FileOperations',
                        getImageUrl: hostURL + 'api/RichTextEditor/GetImage',
                        uploadUrl: hostURL + 'api/RichTextEditor/Upload'
                    }
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
            detach(ele);
        });
        it('FileManager class availability testing', (done: Function) => {
            (rteObj.element.querySelector('.e-toolbar-item button') as HTMLElement).click();
            setTimeout(() => {
                fileEle = document.body.querySelector('.e-rte-file-manager-dialog .e-filemanager');
                expect(isNullOrUndefined(fileEle)).toBe(false);
                done();
            }, 500);
        });
        
        it('insert image button click test', () => {
            let range = document.createRange();
            range.setStart(ele, 0);
            range.setEnd(ele, 0);
            rteObj.fileManagerModule.selectObj.selection.range = range;
            let inputUrl: HTMLInputElement = (document.body.querySelector('.e-rte-file-manager-dialog .e-input.e-img-url') as HTMLInputElement);
            inputUrl.value = 'https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png';
            let insertBtn: HTMLButtonElement = document.body.querySelector('.e-rte-file-manager-dialog button.e-primary');
            insertBtn.removeAttribute('disabled');
            insertBtn.click();
            expect(rteObj.element.querySelectorAll('.e-content img').length).toBe(1);
        });
    });

    describe('929530: Image src not updated when the action begin event argument are changed.', () => {
        let editor: RichTextEditor;
        function onActionBegin(e: ActionBeginEventArgs) {
            if (e.requestType === 'File' || e.requestType === 'Replace') {
                const url: string = e.itemCollection.url;
                if (url.indexOf('?path') > -1) {
                    const newURL: string = url.replace('?path=', '');
                    e.itemCollection.url = newURL;
                }
            }
        }
        beforeAll(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['FileManager']
                },
                fileManagerSettings: {
                    enable: true,
                    path: '/Pictures/Employees',
                    ajaxSettings: {
                        url: hostURL + 'api/RichTextEditor/FileOperations',
                        getImageUrl: hostURL + 'api/RichTextEditor/GetImage',
                        uploadUrl: hostURL + 'api/RichTextEditor/Upload'
                    }
                },
                actionBegin: onActionBegin,
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Check the image src when insert image', (done: Function) => {
            const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            (editor.element.querySelector('.e-toolbar-item button') as HTMLElement).click();
            setTimeout(() => {
                (editor.fileManagerModule as any).fileObj.trigger('fileSelect', { fileDetails: {  filterPath: '\\Pictures\\Employees\\', name: 'Adam.png', isFile: true, type: '.png' } });
                let insertBtn: HTMLButtonElement = document.body.querySelector('.e-rte-file-manager-dialog button.e-primary');
                insertBtn.click();
                setTimeout(() => {
                    let imageElement: HTMLImageElement = document.body.querySelector('.e-rte-image');
                    expect(imageElement.src).toBe('https://ej2services.syncfusion.com/js/development/api/RichTextEditor/GetImage/Pictures/Employees/Adam.png');
                    done();
                }, 100);
            }, 500);
        });
        it('Check the image src when replace image', (done: Function) => {
            editor.inputElement.innerHTML = '<img src="https://ej2services.syncfusion.com/js/development/api/RichTextEditor/GetImage/Pictures/Employees/Adam.png" class="e-rte-image" />';
            let imageElement: HTMLImageElement = editor.element.querySelector('.e-content .e-rte-image') as HTMLImageElement;
            editor.formatter.editorManager.nodeSelection.setSelectionNode(document, imageElement);
            const target: HTMLElement = editor.inputElement.querySelector('img');
            const MOUSEUP_EVENT: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                let pop: Element = document.body.querySelector('.e-rte-quick-popup');
                (pop.querySelectorAll('.e-toolbar-item')[12] as HTMLElement).click();
                setTimeout(() => {
                    (editor.fileManagerModule as any).fileObj.trigger('fileSelect', { fileDetails: { filterPath: '\\Pictures\\Employees\\', name: 'Andrew.png', isFile: true, type: '.png' } });
                    let insertBtn: HTMLButtonElement = document.body.querySelector('.e-rte-file-manager-dialog button.e-primary');
                    insertBtn.click();
                    setTimeout(() => {
                        let imageElement: HTMLImageElement = document.body.querySelector('.e-rte-image');
                        expect(imageElement.src).toBe('https://ej2services.syncfusion.com/js/development/api/RichTextEditor/GetImage/Pictures/Employees/Andrew.png');
                        done();
                    }, 100);
                }, 100);
            }, 500);
        });
    });
});