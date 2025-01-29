/**
 * RTE - Image Browser module spec
 */
import { detach, isNullOrUndefined, Browser } from "@syncfusion/ej2-base";
import { IRenderer, RichTextEditor, QuickToolbar, PasteCleanup, ImageSuccessEventArgs } from "../../../src/rich-text-editor/index";
import { ActionBeginEventArgs } from "../../../src/rich-text-editor/index";
import { renderRTE, destroy } from "./../render.spec";
import { Popup } from "@syncfusion/ej2-popups";
import { Uploader } from "@syncfusion/ej2-inputs";

let hostUrl: string = 'https://ej2-aspcore-service.azurewebsites.net/';

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
                        url: hostUrl + 'api/FileManager/FileOperations',
                        getImageUrl: hostUrl + 'api/FileManager/GetImage',
                        uploadUrl: hostUrl + 'api/FileManager/Upload'
                    }
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('FileManager class availability testing', (done: Function) => {
            (rteObj.element.querySelector('.e-toolbar-item button') as HTMLElement).click();
            fileEle = document.body.querySelector('.e-rte-file-manager-dialog .e-filemanager');
            expect(isNullOrUndefined(fileEle)).toBe(false);
            setTimeout(() => {
                done();
            }, 500);
        });
        it('image - fileSelect as true', () => {
            (rteObj.fileManagerModule as any).fileObj.trigger('fileSelect', { fileDetails: { filterPath: '\\Pictures', isFile: true, type: '.png' } });
            expect((document.body.querySelector('.e-rte-file-manager-dialog .e-input.e-img-url') as HTMLInputElement).value).toContain('https://ej2-aspcore-service.azurewebsites.net/api/FileManager/GetImage?path=/Pictures');
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
                        url: hostUrl + 'api/FileManager/FileOperations',
                        getImageUrl: hostUrl + 'api/FileManager/GetImage',
                        uploadUrl: hostUrl + 'api/FileManager/Upload'
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
            fileEle = document.body.querySelector('.e-rte-file-manager-dialog .e-filemanager');
            expect(isNullOrUndefined(fileEle)).toBe(false);
            setTimeout(() => {
                done();
            }, 500);
        });
        it('image - fileSelect as true', () => {
            (rteObj.fileManagerModule as any).fileObj.trigger('fileSelect', { fileDetails: { filterPath: '\\Pictures', isFile: true, type: '.png' } });
            expect((document.body.querySelector('.e-rte-file-manager-dialog .e-input.e-img-url') as HTMLInputElement).value).toContain('https://ej2-aspcore-service.azurewebsites.net/api/FileManager/GetImage?path=/Pictures');
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

    describe('931520 - PasteCleanup - popupClose method', () => {
        let rteObj: RichTextEditor;
        let pasteCleanup: PasteCleanup;
        let popupObj: Popup;
        let uploadObj: Uploader;
        let imgElem: HTMLImageElement;
        let e: ImageSuccessEventArgs;

        beforeEach(() => {
            rteObj = renderRTE({
                value: '<p>RTE content</p>',
                toolbarSettings: {
                    items: ['Image']
                },
                inlineMode: {
                    enable: true
                }
            });
            pasteCleanup = (rteObj as any).pasteCleanupModule;
            popupObj = new Popup(rteObj.element, {
                height: '85px',
                width: '300px'
            });
            uploadObj = new Uploader();
            imgElem = document.createElement('img');
            e = {
                element: imgElem,
                file: { statusCode: '2', name: 'test.png' } as any
            } as unknown as ImageSuccessEventArgs;
        });

        afterEach(() => {
            destroy(rteObj);
        });

        it('PasteCleanup - popupClose method', (done: Function) => {
            (pasteCleanup as any).popupClose(popupObj, uploadObj, imgElem, e);
            rteObj.insertImageSettings.path = "/test/";
            (pasteCleanup as any).popupClose(popupObj, uploadObj, imgElem, e);
            (pasteCleanup as any).popupClose(popupObj, uploadObj, imgElem, {
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
                        url: hostUrl + 'api/FileManager/FileOperations',
                        getImageUrl: hostUrl + 'api/FileManager/GetImage',
                        uploadUrl: hostUrl + 'api/FileManager/Upload'
                    }
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('FileManager class availability testing', (done: Function) => {
            (rteObj.element.querySelector('.e-toolbar-item button') as HTMLElement).click();
            fileEle = document.body.querySelector('.e-rte-file-manager-dialog .e-filemanager');
            expect(isNullOrUndefined(fileEle)).toBe(false);
            setTimeout(() => {
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
                        url: hostUrl + 'api/FileManager/FileOperations',
                        getImageUrl: hostUrl + 'api/FileManager/GetImage',
                        uploadUrl: hostUrl + 'api/FileManager/Upload'
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
        let QTBarModule: IRenderer;

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
                        url: hostUrl + 'api/FileManager/FileOperations',
                        getImageUrl: hostUrl + 'api/FileManager/GetImage',
                        uploadUrl: hostUrl + 'api/FileManager/Upload'
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
            QTBarModule.imageQTBar.showPopup(0, 0, trg);
            setTimeout(() => {
                let pop: Element = document.body.querySelector('.e-rte-quick-popup');
                expect(isNullOrUndefined(pop)).toBe(false);
                (pop.querySelector('.e-toolbar-item button') as HTMLElement).click();
                setTimeout(() => {
                    fileEle = document.body.querySelector('.e-rte-file-manager-dialog .e-filemanager');
                    expect(isNullOrUndefined(fileEle)).toBe(false);
                    done();
                }, 500);
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
                        url: hostUrl + 'api/FileManager/FileOperations',
                        getImageUrl: hostUrl + 'api/FileManager/GetImage',
                        uploadUrl: hostUrl + 'api/FileManager/Upload'
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
            fileEle = document.body.querySelector('.e-rte-file-manager-dialog');
            expect(isNullOrUndefined(fileEle)).toBe(false);
            rteObj.fileManagerModule.onDocumentClick({ target: ele });
            setTimeout(() => {
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
                        url: hostUrl + 'api/FileManager/FileOperations',
                        getImageUrl: hostUrl + 'api/FileManager/GetImage',
                        uploadUrl: hostUrl + 'api/FileManager/Upload'
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
            fileEle = document.body.querySelector('.e-rte-file-manager-dialog .e-filemanager');
            expect(isNullOrUndefined(fileEle)).toBe(false);
            setTimeout(() => {
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
        let rteObj: RichTextEditor;
        let trg: HTMLElement;
        let rteEle: HTMLElement;
        let QTBarModule: IRenderer;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FileManager']
                },
                fileManagerSettings: {
                    enable: true,
                    path: '/Pictures/Employees',
                    ajaxSettings: {
                        url: hostUrl + 'api/FileManager/FileOperations',
                        getImageUrl: hostUrl + 'api/FileManager/GetImage',
                        uploadUrl: hostUrl + 'api/FileManager/Upload'
                    }
                },
                actionBegin: onActionBegin,
            });
             function onActionBegin(e: ActionBeginEventArgs) {
                 if (e.requestType === 'File' || e.requestType === 'Replace') {
                     const url: string = e.itemCollection.url;
                     if (url.indexOf('?path') > -1) {
                         const newURL: string = url.replace('?path=', '');
                         e.itemCollection.url = newURL;
                     }
                 }
             }
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
        it('Check the image src when insert image', (done: Function) => {
            setTimeout(() => {
            (rteObj.element.querySelector('.e-toolbar-item button') as HTMLElement).click();
            (rteObj.fileManagerModule as any).fileObj.trigger('fileSelect', { fileDetails: {  filterPath: '\\Pictures\\Employees', name: 'Adam.png', isFile: true, type: '.png' } });
            let insertBtn: HTMLButtonElement = document.body.querySelector('.e-rte-file-manager-dialog button.e-primary');
            insertBtn.click();
            let imageElement: HTMLImageElement = document.body.querySelector('.e-rte-image');
            expect(imageElement.src).toBe('https://ej2-aspcore-service.azurewebsites.net/api/FileManager/GetImage/Pictures/EmployeesAdam.png');
            done();
        }, 500);
        });
        it('Check the image src when replace image', (done: Function) => {
            rteObj.value = '<img src="https://ej2-aspcore-service.azurewebsites.net/api/FileManager/GetImage/Pictures/Employees/Adam.png" class="e-rte-image" />';
            rteObj.dataBind();
            let imageElement: HTMLImageElement = rteObj.element.querySelector('.e-content .e-rte-image') as HTMLImageElement;
            rteObj.formatter.editorManager.nodeSelection.setSelectionNode(document, imageElement);
            QTBarModule.imageQTBar.showPopup(0, 0, imageElement);
            setTimeout(() => {
                let pop: Element = document.body.querySelector('.e-rte-quick-popup');
                (pop.querySelector('.e-toolbar-item button') as HTMLElement).click();
                (rteObj.fileManagerModule as any).fileObj.trigger('fileSelect', { fileDetails: { filterPath: '\\Pictures\\Employees', name: 'Andrew.png', isFile: true, type: '.png' } });
                let insertBtn: HTMLButtonElement = document.body.querySelector('.e-rte-file-manager-dialog button.e-primary');
                insertBtn.click();
                let imageElement: HTMLImageElement = document.body.querySelector('.e-rte-image');
                expect(imageElement.src).toBe('https://ej2-aspcore-service.azurewebsites.net/api/FileManager/GetImage/Pictures/EmployeesAndrew.png');
                done();
            }, 500);
        });
    });
});