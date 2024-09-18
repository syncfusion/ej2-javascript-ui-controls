import { SuccessEventArgs } from "@syncfusion/ej2-inputs";
import { RichTextEditor } from "../../src";
import { IMG_BASE64, INSRT_IMG_EVENT_INIT } from "../constant.spec";
import { renderRTE, destroy, hostURL } from "./render.spec";


function getImageFIle(): File {
    const base64Data = IMG_BASE64;
    const bytecharacters = atob(base64Data);
    const byteNumbers = new Array(bytecharacters.length);
    for (let i = 0; i < bytecharacters.length; i++) {
        byteNumbers[i] = bytecharacters.charCodeAt(i);
    }
    const byteArray: Uint8Array = new Uint8Array(byteNumbers);
    const blob: Blob = new Blob([byteArray], { type: 'image/png' });
    const file: File = new File([blob], 'RTE-Feather.png');
    return file;
}


describe('Test case with online service', () => {
    let isOnline: boolean = false;
    beforeEach(async () => {
        try {
            const response = await fetch(hostURL + 'api/Test');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.text();
            isOnline = data === '["value1","value2"]';
        } catch (error) {
            console.error('There was a problem with the service. Service status offline.', error);
            isOnline = false;
        }
    });
    describe('901364 - After image delete is called multiple times when the CTRL + A is pressed multiple times.', ()=> {
        let editor: RichTextEditor;
        let imageSuccess: boolean = false;
        let imageRemove: boolean = false;
        let imageRemoveEvent: boolean  = false;
        let imageBeforeUpload: boolean = false;
        beforeEach((done: DoneFn) => {
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
        afterEach((done: DoneFn) => {
            destroy(editor);
            done();
        });
        it('Should call the success and then the removing event.',(done: DoneFn) => {
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', INSRT_IMG_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', INSRT_IMG_EVENT_INIT));
            setTimeout(() => {
                const dialogElem: HTMLElement = editor.element.querySelector('.e-rte-img-dialog');
                const inputElem: HTMLInputElement = dialogElem.querySelector('input.e-uploader');
                const file: File = getImageFIle();
                const dataTransfer: DataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                inputElem.files = dataTransfer.files;
                inputElem.dispatchEvent(new Event('change', {
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    view: window
                } as EventInit));
                if (isOnline) {
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
                    }, 2000);
                } else {
                    console.warn('The service is offline. So, the test case is skipped.');
                    done();
                }
            }, 100);
        });

        it('Should not call the success should call the removing event.',(done: DoneFn) => {
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', INSRT_IMG_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', INSRT_IMG_EVENT_INIT));
            setTimeout(() => {
                const dialogElem: HTMLElement = editor.element.querySelector('.e-rte-img-dialog');
                const inputElem: HTMLInputElement = dialogElem.querySelector('input.e-uploader');
                const file: File = getImageFIle();
                const dataTransfer: DataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                inputElem.files = dataTransfer.files;
                inputElem.dispatchEvent(new Event('change', {
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    view: window
                } as EventInit));
                if (isOnline) {
                    setTimeout(() => {
                        (dialogElem.querySelector('.e-cancel') as HTMLElement).click();
                        setTimeout(() => {
                            expect(imageBeforeUpload).toBe(true);
                            expect(imageRemoveEvent).toBe(true);
                            expect(editor.inputElement.querySelectorAll('img').length).toBe(0);
                            done();
                        }, 100);
                    }, 100);
                } else {
                    console.warn('The service is offline. So, the test case is skipped.');
                    done();
                }
            }, 100);
        });
    });

});