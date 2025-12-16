import { SuccessEventArgs } from "@syncfusion/ej2-inputs";
import { RichTextEditor } from "../../src";
import { IMG_BASE64, INSRT_IMG_EVENT_INIT } from "../constant.spec";
import { renderRTE, destroy, hostURL } from "./render.spec";
import { createElement } from "@syncfusion/ej2-base";
import { NodeSelection } from "../../src/selection/index";

export function getImageFIle(): File {
    const base64Data = IMG_BASE64;
    const bytecharacters = atob(base64Data);
    const byteNumbers = new Array(bytecharacters.length);
    for (let i = 0; i < bytecharacters.length; i++) {
        byteNumbers[i] = bytecharacters.charCodeAt(i);
    }
    const byteArray: Uint8Array = new Uint8Array(byteNumbers);
    const blob: Blob = new Blob([byteArray], { type: 'image/png' });
    const file: File = new File([blob], 'RTE-Feather.png', { type: 'image/png'});
    return file;
}

export function getImageUniqueFIle(): File {
    const number: number = Math.floor(100000 + secureRandom() * 900000);;
    const base64Data = IMG_BASE64;
    const bytecharacters = atob(base64Data);
    const baseName: string = 'RTE-Feather_';
    const byteNumbers = new Array(bytecharacters.length);
    for (let i = 0; i < bytecharacters.length; i++) {
        byteNumbers[i] = bytecharacters.charCodeAt(i);
    }
    const byteArray: Uint8Array = new Uint8Array(byteNumbers);
    const blob: Blob = new Blob([byteArray], { type: 'image/png' });
    const file: File = new File([blob], baseName + number.toString() + '.png', { type: 'image/png'});
    return file;
}

export function secureRandom(): number {
    const array: Uint32Array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] / (0xFFFFFFFF + 1);
}

export function getImageBlob(): Blob {
    const base64Data = IMG_BASE64;
    const bytecharacters = atob(base64Data);
    const byteNumbers = new Array(bytecharacters.length);
    for (let i = 0; i < bytecharacters.length; i++) {
        byteNumbers[i] = bytecharacters.charCodeAt(i);
    }
    const byteArray: Uint8Array = new Uint8Array(byteNumbers);
    const blob: Blob = new Blob([byteArray], { type: 'image/png' });
    return blob;
}
async function checkServiceStatus() {
    try {
        const response = await fetch(hostURL + 'api/Test');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.text();
        return data === '["value1","value2"]';
    } catch (error) {
        console.error('There was a problem with the service.   ' + hostURL + ' responded with error.');
        return false;
    }
}

const UPLOADER_TIME_OUT: number = 3500;

xdescribe('Test case with online service', () => {

    describe('901364 - After image delete is called multiple times when the CTRL + A is pressed multiple times. CASE 1:', ()=> {

        let editor: RichTextEditor;
        let imageSuccess: boolean = false;
        let imageRemove: boolean = false;
        let imageRemoveEvent: boolean  = false;
        let imageBeforeUpload: boolean = false;
        let isServerOnline: boolean = false;
        beforeAll(async (done: DoneFn) => {
            isServerOnline= await checkServiceStatus();
            editor = renderRTE({
                insertImageSettings: {
                    saveUrl: hostURL + 'api/RichTextEditor/SaveFile',
                    removeUrl: hostURL + 'api/RichTextEditor/DeleteFile',
                    path: hostURL + 'RichTextEditor/'
                },
                imageRemoving: (args: any) => {
                    imageRemoveEvent = true;
                },
                imageUploadSuccess: (args: SuccessEventArgs) => {
                    if (args.operation === 'upload') {
                        imageSuccess = true;
                    } else if (args.operation === 'remove') {
                        imageRemove = true;
                    }
                },
                beforeImageUpload: (args: any) => {
                    imageBeforeUpload = true;
                }
            });
            done();
        });
        afterAll((done: DoneFn) => {
            destroy(editor);
            done();
        });
        it('Should call the success and then the removing event.',(done: DoneFn) => {
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', INSRT_IMG_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', INSRT_IMG_EVENT_INIT));
            setTimeout(() => {
                const dialogElem: HTMLElement = editor.element.querySelector('.e-rte-img-dialog');
                const inputElem: HTMLInputElement = dialogElem.querySelector('input.e-uploader');
                const file: File = getImageUniqueFIle();
                const dataTransfer: DataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                inputElem.files = dataTransfer.files;
                if (!isServerOnline) {
                    console.warn('The service is offline. So, the test case is skipped.');
                    done();
                } else {
                    inputElem.dispatchEvent(new Event('change', {
                        bubbles: true,
                        cancelable: true,
                        composed: true,
                        view: window
                    } as EventInit));
                    setTimeout(() => {
                        (dialogElem.querySelector('.e-insertImage') as HTMLElement).click();
                        setTimeout(() => {
                            expect(imageBeforeUpload).toBe(true);
                            expect(imageSuccess).toBe(true);
                            expect(imageRemove).toBe(false);
                            expect(imageRemoveEvent).toBe(false);
                            expect(editor.inputElement.querySelectorAll('img').length).toBe(1);
                            done();
                        }, 100);
                    }, UPLOADER_TIME_OUT);
                }
            }, 100);
        });
    });

    describe('901364 - After image delete is called multiple times when the CTRL + A is pressed multiple times. CASE 2:', ()=> {

        let editor: RichTextEditor;
        let imageSuccess: boolean = false;
        let imageRemove: boolean = false;
        let imageRemoveEvent: boolean  = false;
        let imageBeforeUpload: boolean = false;
        let isServerOnline: boolean = false;
        beforeAll(async (done: DoneFn) => {
            isServerOnline= await checkServiceStatus();
            editor = renderRTE({
                insertImageSettings: {
                    saveUrl: hostURL + 'api/RichTextEditor/SaveFile',
                    removeUrl: hostURL + 'api/RichTextEditor/DeleteFile',
                    path: hostURL + 'RichTextEditor/'
                },
                imageRemoving: (args: any) => {
                    imageRemoveEvent = true;
                },
                imageUploadSuccess: (args: SuccessEventArgs) => {
                    if (args.operation === 'upload') {
                        imageSuccess = true;
                    } else if (args.operation === 'remove') {
                        imageRemove = true;
                    }
                },
                beforeImageUpload: (args: any) => {
                    imageBeforeUpload = true;
                }
            });
            done();
        });
        afterAll((done: DoneFn) => {
            destroy(editor);
            done();
        });
        it('Should not call the success should call the removing event.',(done: DoneFn) => {
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', INSRT_IMG_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', INSRT_IMG_EVENT_INIT));
            setTimeout(() => {
                const dialogElem: HTMLElement = editor.element.querySelector('.e-rte-img-dialog');
                const inputElem: HTMLInputElement = dialogElem.querySelector('input.e-uploader');
                const file: File = getImageUniqueFIle();
                const dataTransfer: DataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                inputElem.files = dataTransfer.files;
                if (!isServerOnline) {
                    console.warn('The service is offline. So, the test case is skipped.');
                    done();
                } else {
                    inputElem.dispatchEvent(new Event('change', {
                        bubbles: true,
                        cancelable: true,
                        composed: true,
                        view: window
                    } as EventInit));
                    setTimeout(() => {
                        (dialogElem.querySelector('.e-cancel') as HTMLElement).click();
                        setTimeout(() => {
                            expect(imageBeforeUpload).toBe(true);
                            expect(imageRemoveEvent).toBe(true);
                            expect(editor.inputElement.querySelectorAll('img').length).toBe(0);
                            done();
                        }, 100);
                    }, UPLOADER_TIME_OUT);
                }
            }, 100);
        });
    });

    describe('882579 - Pasted Blob images are not uploaded to the server in RichTextEditor', () => {
        let editor: RichTextEditor;
        const content: string = '\n\n\x3C!--StartFragment--><img src="" class="e-rte-image e-imginline" alt="QuickFormatToolbarImage" width="auto" height="auto" style="box-sizing: border-box; border: 0px; vertical-align: bottom; cursor: pointer; display: inline-block; float: none; margin: auto 5px; max-width: 946px; position: relative; padding: 1px; z-index: 1000; color: rgb(33, 37, 41); font-family: system-ui, -apple-system, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, arial, &quot;Noto Sans&quot;, &quot;Liberation Sans&quot;, sans-serif, &quot;apple color emoji&quot;, &quot;Segoe UI emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto color emoji&quot;; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; min-width: 0px; min-height: 0px;">\x3C!--EndFragment-->\n\n'
        let isServerOnline: boolean = false;
        beforeAll(async (done: DoneFn) => {
            isServerOnline = await checkServiceStatus();
            editor = renderRTE({
                pasteCleanupSettings: {
                    keepFormat: true
                },
                insertImageSettings: {
                    saveUrl: hostURL + 'api/RichTextEditor/SaveFile',
                    path: hostURL + 'RichTextEditor/'
                },
            });
            done();
        });

        afterAll(() => {
            destroy(editor);
        });

        it ('CASE 1: DIV - Should paste the image wiht the Blob URL in the Clip board data to Base64 and POST into the Save URL.', (done: DoneFn) => {
            editor.focusIn();
            const blobURL = URL.createObjectURL(getImageBlob());
            const contenElem = createElement('div', { innerHTML: content });
            const imgElement: HTMLImageElement = contenElem.querySelector('img') as HTMLImageElement;
            imgElement.src = blobURL;
            const dataTransfer = new DataTransfer();
            dataTransfer.setData('text/html', contenElem.innerHTML);
            if (!isServerOnline) {
                console.warn('The service is offline. So, the test case is skipped.');
                done();
            } else {
                const pasteEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
                editor.inputElement.dispatchEvent(pasteEvent);
                setTimeout(() => {
                    expect(editor.inputElement.querySelector('img').src.includes('base64')).toBe(true);
                    URL.revokeObjectURL(blobURL);
                    done();
                }, 50);
            }
        });
    });

    describe('908236: Web URL is disabled and not able to enter URL after uploading and deleting the image in Insert image pop up.', () => {
        let editor: RichTextEditor;
        let isServerOnline: boolean = false;
        beforeAll(async (done: Function) => {
            isServerOnline = await checkServiceStatus();
            editor = renderRTE({
                insertImageSettings: {
                    saveUrl: hostURL + 'api/RichTextEditor/SaveFile',
                    path: hostURL + 'RichTextEditor/'
                }
            });
            done();
        });
        afterAll((done: Function) => {
            destroy(editor);
            done();
        })
        it(' Input url is not disabled when delete button is clicked ', (done) => {
            let imageDialogShortCut: KeyboardEvent = new KeyboardEvent('keydown', INSRT_IMG_EVENT_INIT);
            editor.inputElement.dispatchEvent(imageDialogShortCut);
            imageDialogShortCut = new KeyboardEvent('keyup', INSRT_IMG_EVENT_INIT);
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', INSRT_IMG_EVENT_INIT));
            setTimeout(() => {
                expect((editor.element.querySelector('.e-img-url') as HTMLInputElement).disabled).toBe(false);
                const dialogElem: HTMLElement = editor.element.querySelector('.e-rte-img-dialog');
                const dataTransfer: DataTransfer = new DataTransfer();
                const file: File = getImageUniqueFIle();
                dataTransfer.items.add(file);
                const inputElem: HTMLInputElement = dialogElem.querySelector('input.e-uploader');
                inputElem.files = dataTransfer.files;
                if (!isServerOnline) {
                    console.warn('The service is offline. So, the test case is skipped.');
                    done();
                } else {
                    inputElem.dispatchEvent(new Event('change', {
                        bubbles: true,
                        cancelable: true,
                        composed: true,
                        view: window
                    } as EventInit));
                    setTimeout(() => {
                        expect((editor.element.querySelector('.e-img-url') as HTMLInputElement).disabled).toBe(true);
                        (editor.element.querySelector('.e-file-delete-btn') as HTMLElement).click();
                        setTimeout(() => {
                            expect((editor.element.querySelector('.e-img-url') as HTMLInputElement).disabled).toBe(false);
                            done();
                        }, 100);
                    }, UPLOADER_TIME_OUT);
                }
            }, 100);
        });
    });

    describe('882579 - Pasted Blob images are not uploaded to the server in RichTextEditor', () => {
        let editor: RichTextEditor;
        let isServerOnline: boolean = false;
        const content: string = '\n\n\x3C!--StartFragment--><img src="" class="e-rte-image e-imginline" alt="QuickFormatToolbarImage" width="auto" height="auto" style="box-sizing: border-box; border: 0px; vertical-align: bottom; cursor: pointer; display: inline-block; float: none; margin: auto 5px; max-width: 946px; position: relative; padding: 1px; z-index: 1000; color: rgb(33, 37, 41); font-family: system-ui, -apple-system, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, arial, &quot;Noto Sans&quot;, &quot;Liberation Sans&quot;, sans-serif, &quot;apple color emoji&quot;, &quot;Segoe UI emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto color emoji&quot;; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; min-width: 0px; min-height: 0px;">\x3C!--EndFragment-->\n\n'
        beforeAll(async (done: DoneFn) => {
            isServerOnline = await checkServiceStatus();
            editor = renderRTE({
                pasteCleanupSettings: {
                    keepFormat: true
                },
                insertImageSettings: {
                    saveUrl: hostURL + 'api/RichTextEditor/SaveFile',
                    path: hostURL + 'RichTextEditor/'
                },
                iframeSettings: {
                    enable: true
                }
            });
            done();
        });

        afterAll(() => {
            destroy(editor);
        });

        it ('CASE 2: IFRAME - Should paste the image wiht the Blob URL in the Clip board data to Base64 and POST into the Save URL.', (done: DoneFn) => {
            editor.focusIn();
            const blobURL = URL.createObjectURL(getImageBlob());
            const contenElem = createElement('div', { innerHTML: content });
            const imgElement: HTMLImageElement = contenElem.querySelector('img') as HTMLImageElement;
            imgElement.src = blobURL;
            const dataTransfer = new DataTransfer();
            dataTransfer.setData('text/html', contenElem.innerHTML);
            if (!isServerOnline) {
                console.warn('The service is offline. So, the test case is skipped.');
                done();
            } else {
                const pasteEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
                editor.inputElement.dispatchEvent(pasteEvent);
                setTimeout(() => {
                    expect(editor.inputElement.querySelector('img').src.includes('base64')).toBe(true);
                    URL.revokeObjectURL(blobURL);
                    done();
                }, 50);
            }
        });
    });

    describe('Image Upload success when dropped into the editor CASE 1 : Inline.', ()=> {
        let editor: RichTextEditor;
        let isServerOnline: boolean = false;
        beforeAll(async(done: DoneFn)=> {
            isServerOnline = await checkServiceStatus();
            editor = renderRTE({
                insertImageSettings: {
                    saveUrl: hostURL + 'api/RichTextEditor/SaveFile',
                    path: hostURL + 'RichTextEditor/',
                }
            });
            done();
        });
        afterAll((done: DoneFn)=> {
            destroy(editor);
            done();
        });
        it('Should upload the image when dropped into the editor.', (done: DoneFn)=> {
            editor.focusIn();
            const file: File = getImageFIle();
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            const paragraph: HTMLElement = editor.inputElement.querySelector('p');
            const clientRect: DOMRect = paragraph.getBoundingClientRect() as DOMRect;
            const eventInit: DragEventInit = { 
                dataTransfer: dataTransfer,
                clientX: clientRect.x,
                clientY: clientRect.y,
                bubbles: true,
                cancelable: true,
                composed: true
            };
            const dropEvent: DragEvent = new DragEvent('drop', eventInit);
            editor.inputElement.querySelector('p').dispatchEvent(dropEvent);
            if (!isServerOnline) {
                console.warn('The service is offline. So, the test case is skipped.');
                done();
            } else {
                setTimeout(() => {
                    expect(editor.inputElement.querySelectorAll('img').length).toBe(1);
                    expect(editor.inputElement.querySelector('img').classList.contains('e-imginline')).toBe(true);
                    expect(editor.inputElement.querySelector('img').src).toBe(`${hostURL} RichTextEditor/RTE-Feather.png`);
                    done();
                }, UPLOADER_TIME_OUT);
            }
        });
    });

    describe('Rename images in success event- ', () => {
        let rteObj: RichTextEditor;
        let isServerOnline: boolean = false;
        beforeAll(async () => {
            isServerOnline = await checkServiceStatus();
            rteObj = renderRTE({
                imageUploadSuccess: function (args : any) {
                    args.file.name = 'rte_image';
                    var filename : any = document.querySelectorAll(".e-file-name")[0];
                    filename.innerHTML = args.file.name.replace(document.querySelectorAll(".e-file-type")[0].innerHTML, '');
                    filename.title = args.file.name;
                },
                insertImageSettings: {
                    saveUrl: hostURL + 'api/RichTextEditor/SaveFile',
                    path: hostURL + 'RichTextEditor/'
                }
            });
        })
        afterAll(() => {
            destroy(rteObj);
        })
        it('Check name after renamed', (done) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[11] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).imageModule.uploadObj.onSelectFiles(eventArgs);
            setTimeout(() => {
                expect(document.querySelectorAll(".e-file-name")[0].innerHTML).toBe('rte_image');
                done();
            }, UPLOADER_TIME_OUT);
        });
    });

    describe('Image Upload success when dropped into the editor CASE 2: Break.', ()=> {
        let editor: RichTextEditor;
        let isServerOnline: boolean = false;
        beforeAll(async(done: DoneFn)=> {
            isServerOnline = await checkServiceStatus();
            editor = renderRTE({
                insertImageSettings: {
                    saveUrl: hostURL + 'api/RichTextEditor/SaveFile',
                    path: hostURL + 'RichTextEditor/',
                    display: 'break'
                }
            });
            done();
        });
        afterAll((done: DoneFn)=> {
            destroy(editor);
            done();
        });
        it('Should upload the image when dropped into the editor.', (done: DoneFn)=> {
            editor.focusIn();
            const file: File = getImageFIle();
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            const paragraph: HTMLElement = editor.inputElement.querySelector('p');
            const clientRect: DOMRect = paragraph.getBoundingClientRect() as DOMRect;
            const eventInit: DragEventInit = { 
                dataTransfer: dataTransfer,
                clientX: clientRect.x,
                clientY: clientRect.y,
                bubbles: true,
                cancelable: true,
                composed: true
            };
            const dropEvent: DragEvent = new DragEvent('drop', eventInit);
            editor.inputElement.querySelector('p').dispatchEvent(dropEvent);
            if (!isServerOnline) {
                console.warn('The service is offline. So, the test case is skipped.');
                done();
            } else {
                setTimeout(() => {
                    expect(editor.inputElement.querySelectorAll('img').length).toBe(1);
                    expect(editor.inputElement.querySelector('img').classList.contains('e-imgbreak')).toBe(true);
                    expect(editor.inputElement.querySelector('img').src).toBe(`${hostURL}RichTextEditor/RTE-Feather.png`);
                    done();
                }, UPLOADER_TIME_OUT);
            }
        });
    });

    describe('Paste Image into the editor CASE 1: Inline.', ()=> {
        let editor: RichTextEditor;
        let isServerOnline: boolean = false;
        beforeAll(async(done: DoneFn)=> {
            isServerOnline = await checkServiceStatus();
            editor = renderRTE({
                insertImageSettings: {
                    saveUrl: hostURL + 'api/RichTextEditor/SaveFile',
                    path: hostURL + 'RichTextEditor/',
                }
            });
            done();
        });
        afterAll((done: DoneFn)=> {
            destroy(editor);
            done();
        });
        it('Should upload the image when pasted into the editor.', (done: DoneFn)=> {
            editor.focusIn();
            const file: File = getImageUniqueFIle();
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
            editor.inputElement.dispatchEvent(pasteEvent);
            if (!isServerOnline) {
                console.warn('The service is offline. So, the test case is skipped.');
                done();
            } else {
                setTimeout(() => {
                    expect(editor.inputElement.querySelectorAll('img').length).toBe(1);
                    expect(editor.inputElement.querySelector('img').classList.contains('e-imginline')).toBe(true);
                    expect(editor.inputElement.querySelector('img').src.indexOf(hostURL) > -1).toBe(true);
                    done();
                }, UPLOADER_TIME_OUT);
            }
        });
    });

    describe('Paste Image into the editor CASE 2: Break.', ()=> {
        let editor: RichTextEditor;
        let isServerOnline: boolean = false;
        beforeAll(async(done: DoneFn)=> {
            isServerOnline = await checkServiceStatus();
            editor = renderRTE({
                insertImageSettings: {
                    saveUrl: hostURL + 'api/RichTextEditor/SaveFile',
                    path: hostURL + 'RichTextEditor/',
                    display: 'break'
                }
            });
            done();
        });
        afterAll((done: DoneFn)=> {
            destroy(editor);
            done();
        });
        it('Should upload the image when pasted into the editor.', (done: DoneFn)=> {
            editor.focusIn();
            const file: File = getImageUniqueFIle();
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
            editor.inputElement.dispatchEvent(pasteEvent);
            if (!isServerOnline) {
                console.warn('The service is offline. So, the test case is skipped.');
                done();
            } else {
                setTimeout(() => {
                    expect(editor.inputElement.querySelectorAll('img').length).toBe(1);
                    expect(editor.inputElement.querySelector('img').classList.contains('e-imgbreak')).toBe(true);
                    expect(editor.inputElement.querySelector('img').src.indexOf(hostURL) > -1).toBe(true);
                    done();
                }, UPLOADER_TIME_OUT);
            }
        });
    });
});
