/**
 * Popup Uploader Renderer spec
 */
import { RichTextEditor } from '../../../src/index';
import { renderRTE, destroy } from "../render.spec";
import { PopupUploader } from '../../../src/rich-text-editor/renderer/popup-uploader-renderer';
import { Browser, detach, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';
import { Uploader } from '@syncfusion/ej2-inputs';
import * as baseModule from '@syncfusion/ej2-base';
import { getImageUniqueFIle, secureRandom } from '../../rich-text-editor/online-service.spec';
import { AUDIO_WAV_BASE64, VIDEO_WEBM_BASE64 } from "../../constant.spec";

export function getMediaUniqueFIle(data: string, mimeType: string, fileName: string): File {
    const number: number = Math.floor(100000 + secureRandom() * 900000);;
    const base64Data = data;
    const bytecharacters = atob(base64Data);
    const baseName: string = 'RTE-Feather_';
    const byteNumbers = new Array(bytecharacters.length);
    for (let i = 0; i < bytecharacters.length; i++) {
        byteNumbers[i] = bytecharacters.charCodeAt(i);
    }
    const byteArray: Uint8Array = new Uint8Array(byteNumbers);
    const blob: Blob = new Blob([byteArray], { type: mimeType });
    const file: File = new File([blob], fileName, { type: mimeType});
    return file;
}

describe('PopupUploader Renderer', () => {
    describe('Constructor initialization and rendering', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let popupUploaderObj: PopupUploader;

        beforeAll((done: Function) => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Image', 'Video', 'Audio']
                },
                insertImageSettings: {
                    allowedTypes: ['.jpeg', '.jpg', '.png'],
                    display: 'inline',
                    width: '300px',
                    height: '200px',
                    saveFormat: 'Base64',
                    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    path: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/'
                },
                insertVideoSettings: {
                    allowedTypes: ['.mp4', '.webm', '.ogv'],
                    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    path: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/'
                },
                insertAudioSettings: {
                    allowedTypes: ['.mp3', '.wav', '.ogg'],
                    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    path: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/'
                }
            });
            rteEle = rteObj.element;

            setTimeout(() => {
                popupUploaderObj = (rteObj as any).serviceLocator.getService('popupUploaderObject');
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });

        it('PopupUploader service should be registered and accessible', () => {
            expect(popupUploaderObj).toBeDefined();
            expect(popupUploaderObj instanceof PopupUploader).toBe(true);
        });

        it('PopupUploader should have parent reference', () => {
            expect((popupUploaderObj as any).parent).toBe(rteObj);
        });

        it('PopupUploader should have rteID property matching parent element id', () => {
            expect((popupUploaderObj as any).rteID).toBe(rteObj.element.id);
        });
    });

    describe('Render popup', () => {
        let rteObj: RichTextEditor;
        let popupUploaderObj: PopupUploader;
        let mediaElement: HTMLImageElement;
        let popupObj: Popup;

        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image', 'Video', 'Audio']
                },
                insertImageSettings: {
                    allowedTypes: ['.jpeg', '.jpg', '.png'],
                    saveFormat: 'Base64'
                }
            });

            setTimeout(() => {
                popupUploaderObj = (rteObj as any).serviceLocator.getService('popupUploaderObject');
                mediaElement = document.createElement('img');
                mediaElement.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
                mediaElement.style.width = '100px';
                mediaElement.style.height = '100px';
                rteObj.inputElement.appendChild(mediaElement);
                done();
            }, 100);
        });

        afterAll(() => {
            if (popupObj && !popupObj.isDestroyed) {
                popupObj.destroy();
                detach(popupObj.element);
            }
            destroy(rteObj);
        });

        it('renderPopup should create and return a popup for image upload', () => {
            popupObj = popupUploaderObj.renderPopup('Images', mediaElement);
            expect(popupObj).toBeDefined();
            expect(popupObj instanceof Popup).toBe(true);
            expect(popupObj.element.classList.contains('e-popup-open')).toBe(true);
            expect(popupObj.element.classList.contains('e-rte-upload-popup')).toBe(true);
            expect(popupObj.element.classList.contains('e-image-upload-popup')).toBe(true);
        });

        it('renderPopup should create and return a popup for video upload', () => {
            if (popupObj) {
                popupObj.destroy();
            }
            const videoElement = document.createElement('video');
            videoElement.style.width = '200px';
            videoElement.style.height = '150px';
            rteObj.inputElement.appendChild(videoElement);

            popupObj = popupUploaderObj.renderPopup('Videos', videoElement);
            expect(popupObj).toBeDefined();
            expect(popupObj instanceof Popup).toBe(true);
            expect(popupObj.element.classList.contains('e-popup-open')).toBe(true);
            expect(popupObj.element.classList.contains('e-rte-upload-popup')).toBe(true);
            expect(popupObj.element.classList.contains('e-video-upload-popup')).toBe(true);
        });

        it('renderPopup should create and return a popup for audio upload', () => {
            if (popupObj) {
                popupObj.destroy();
            }
            const audioElement = document.createElement('audio');
            audioElement.style.width = '200px';
            audioElement.style.height = '50px';
            rteObj.inputElement.appendChild(audioElement);

            popupObj = popupUploaderObj.renderPopup('Audios', audioElement);
            expect(popupObj).toBeDefined();
            expect(popupObj instanceof Popup).toBe(true);
            expect(popupObj.element.classList.contains('e-popup-open')).toBe(true);
            expect(popupObj.element.classList.contains('e-rte-upload-popup')).toBe(true);
            expect(popupObj.element.classList.contains('e-audio-upload-popup')).toBe(true);
        });

        it('renderPopup should apply cssClass from parent component', () => {
            if (popupObj) {
                popupObj.destroy();
            }

            rteObj.cssClass = 'custom-rte-class test-class';
            rteObj.dataBind();

            popupObj = popupUploaderObj.renderPopup('Images', mediaElement);
            expect(popupObj.element.classList.contains('custom-rte-class')).toBe(true);
            expect(popupObj.element.classList.contains('test-class')).toBe(true);
        });
    });

    describe('Create uploader', () => {
        let rteObj: RichTextEditor;
        let popupUploaderObj: PopupUploader;
        let mediaElement: HTMLImageElement;
        let uploadObj: Uploader;
        let popupObj: Popup;
        let mockDragEvent: DragEvent;

        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image', 'Video', 'Audio']
                },
                insertImageSettings: {
                    allowedTypes: ['.jpeg', '.jpg', '.png'],
                    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
                }
            });

            setTimeout(() => {
                popupUploaderObj = (rteObj as any).serviceLocator.getService('popupUploaderObject');
                mediaElement = document.createElement('img');
                mediaElement.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
                mediaElement.style.width = '100px';
                mediaElement.style.height = '100px';
                rteObj.inputElement.appendChild(mediaElement);

                const imageFile = getImageUniqueFIle();
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(imageFile);

                const dragEventInit: DragEventInit = {
                    dataTransfer: dataTransfer
                };
                mockDragEvent = new DragEvent('drop', dragEventInit);

                popupObj = popupUploaderObj.renderPopup('Images', mediaElement);
                done();
            }, 100);
        });

        afterAll(() => {
            if (uploadObj && !uploadObj.isDestroyed) {
                uploadObj.destroy();
            }
            if (popupObj && !popupObj.isDestroyed) {
                popupObj.destroy();
            }
            destroy(rteObj);
        });

        it('createUploader should create and return an uploader for image upload', () => {
            uploadObj = popupUploaderObj.createUploader('Images', mockDragEvent, mediaElement, popupObj.element, popupObj);
            expect(uploadObj).toBeDefined();
            expect(uploadObj instanceof Uploader).toBe(true);
            expect(uploadObj.allowedExtensions).toBe(rteObj.insertImageSettings.allowedTypes.toString());
            expect(uploadObj.asyncSettings.saveUrl).toBe(rteObj.insertImageSettings.saveUrl);
            expect(uploadObj.asyncSettings.removeUrl).toBe(rteObj.insertImageSettings.removeUrl);
        });

        it('createUploader should create and return an uploader for video upload', () => {
            if (uploadObj && !uploadObj.isDestroyed) {
                uploadObj.destroy();
            }

            const videoElement = document.createElement('video');
            videoElement.style.width = '200px';
            videoElement.style.height = '150px';
            rteObj.inputElement.appendChild(videoElement);

            uploadObj = popupUploaderObj.createUploader('Videos', mockDragEvent, videoElement, popupObj.element, popupObj);
            expect(uploadObj).toBeDefined();
            expect(uploadObj instanceof Uploader).toBe(true);
            expect(uploadObj.allowedExtensions).toBe(rteObj.insertVideoSettings.allowedTypes.toString());
            expect(uploadObj.asyncSettings.saveUrl).toBe(rteObj.insertVideoSettings.saveUrl);
            expect(uploadObj.asyncSettings.removeUrl).toBe(rteObj.insertVideoSettings.removeUrl);
        });

        it('createUploader should create and return an uploader for audio upload', () => {
            if (uploadObj && !uploadObj.isDestroyed) {
                uploadObj.destroy();
            }

            const audioElement = document.createElement('audio');
            audioElement.style.width = '200px';
            audioElement.style.height = '50px';
            rteObj.inputElement.appendChild(audioElement);

            uploadObj = popupUploaderObj.createUploader('Audios', mockDragEvent, audioElement, popupObj.element, popupObj);
            expect(uploadObj).toBeDefined();
            expect(uploadObj instanceof Uploader).toBe(true);
            expect(uploadObj.allowedExtensions).toBe(rteObj.insertAudioSettings.allowedTypes.toString());
            expect(uploadObj.asyncSettings.saveUrl).toBe(rteObj.insertAudioSettings.saveUrl);
            expect(uploadObj.asyncSettings.removeUrl).toBe(rteObj.insertAudioSettings.removeUrl);
        });
        it('should handle success event with different media types', (done) => {

            const imageElement = document.createElement('img');
            const videoElement = document.createElement('video');
            const audioElement = document.createElement('audio');

            const successArgs = {
                e: {
                    currentTarget: { response: '{ "file": { "name": "test-file.jpg" } }' }
                },
                file: {
                    name: 'test-file.jpg',
                    rawFile: new File(['test'], 'test-file.jpg', { type: 'image/jpeg' }),
                    size: 1024,
                    status: 'success',
                    statusCode: '200',
                    type: 'image/jpeg',
                    validationMessages: {}
                },
                operation: 'upload'
            };

            const videoPopupArgs = {
                args: mockDragEvent,
                type: 'Videos',
                elements: videoElement,
                isNotify: false
            };

            const audioPopupArgs = {
                args: mockDragEvent,
                type: 'Audios',
                elements: audioElement,
                isNotify: false
            };

            const imagePopupArgs = {
                args: mockDragEvent,
                type: 'Images',
                elements: imageElement,
                isNotify: false
            };

            // Spy on methods that might be called inside uploadSuccess
            spyOn(rteObj, 'trigger').and.returnValue(true);
            spyOn(rteObj, 'notify').and.returnValue(true);

            // Add detection properties to test their handling
            (successArgs as any).detectMediaSource = 'URL';

            // Directly call uploadSuccess for video
            popupUploaderObj.uploadSuccess(videoElement, mockDragEvent, videoPopupArgs, successArgs, popupObj);

            //detectMediaSource variable is changed before uploadSuccess method calling so commenting this
            // Verify the detectMediaSource was changed
            // expect((successArgs as any).detectMediaSource).toBe('Dropped');

            // Test audio handling
            (successArgs as any).detectMediaSource = 'URL';
            popupUploaderObj.uploadSuccess(audioElement, mockDragEvent, audioPopupArgs, successArgs, popupObj);
            //detectMediaSource variable is changed before uploadSuccess method calling so commenting this
            // expect((successArgs as any).detectMediaSource).toBe('Dropped');

            // Test image handling
            (successArgs as any).detectImageSource = 'URL';
            popupUploaderObj.uploadSuccess(imageElement, mockDragEvent, imagePopupArgs, successArgs, popupObj);
            //detectMediaSource variable is changed before uploadSuccess method calling so commenting this
            // expect((successArgs as any).detectImageSource).toBe('Dropped');

            done();
        });
        it('should handle selected event when isUploading is true', () => {
            // Create image element
            const imageElement = document.createElement('img');
            const popupObj = popupUploaderObj.renderPopup('Images', imageElement);
            const uploadObj = popupUploaderObj.createUploader('Images', mockDragEvent, imageElement, popupObj.element, popupObj);

            // Create args for selected event
            const selectedArgs = {
                cancel: false,
                filesData: [{
                    name: 'test-image.jpg',
                    size: 1024,
                    type: 'image/jpeg'
                }]
            };

            // First trigger uploading to set isUploading flag
            uploadObj.trigger('uploading', {
                file: {
                    name: 'test-image.jpg',
                    size: 1024,
                    type: 'image/jpeg'
                },
                cancel: false
            });

            // Now trigger selected event
            uploadObj.trigger('selected', selectedArgs);

            // Verify cancel flag was set to true
            expect(selectedArgs.cancel).toBe(true);

            // Clean up
            if (!uploadObj.isDestroyed) {
                uploadObj.destroy();
            }
            if (!popupObj.isDestroyed) {
                popupObj.destroy();
            }
        });

        it('should handle success event with cancel operation', () => {
            // Create image element
            const imageElement = document.createElement('img');
            const popupObj = popupUploaderObj.renderPopup('Images', imageElement);
            const uploadObj = popupUploaderObj.createUploader('Images', mockDragEvent, imageElement, popupObj.element, popupObj);

            // Spy on uploadSuccess method
            const uploadSuccessSpy = spyOn(popupUploaderObj, 'uploadSuccess').and.callThrough();

            // Create success args with cancel operation
            const cancelSuccessArgs = {
                e: {
                    currentTarget: { response: '{}' }
                },
                file: {
                    name: 'test-image.jpg',
                    rawFile: new File(['test'], 'test-image.jpg', { type: 'image/jpeg' }),
                    size: 1024,
                    status: 'success',
                    statusCode: '200',
                    type: 'image/jpeg',
                    validationMessages: {}
                },
                operation: 'cancel'
            };

            // Trigger success with cancel operation
            uploadObj.trigger('success', cancelSuccessArgs);

            // Wait for any potential timeout
            jasmine.clock().install();
            jasmine.clock().tick(1000);

            // Verify uploadSuccess was not called
            expect(uploadSuccessSpy).not.toHaveBeenCalled();

            // Clean up
            jasmine.clock().uninstall();
            uploadSuccessSpy.calls.reset();
            if (!uploadObj.isDestroyed) {
                uploadObj.destroy();
            }
            if (!popupObj.isDestroyed) {
                popupObj.destroy();
            }
        });

        it('should test success handler for each media type', (done) => {
            // Create elements for each media type with proper structure
            const imageElement = document.createElement('img');
            const videoElement = document.createElement('video');
            const sourceVideoElem = document.createElement('source');
            videoElement.appendChild(sourceVideoElem);
            const audioElement = document.createElement('audio');
            const sourceAudioElem = document.createElement('source');
            audioElement.appendChild(sourceAudioElem);

            // Create popups for each type
            const imagePopup = popupUploaderObj.renderPopup('Images', imageElement);
            const videoPopup = popupUploaderObj.renderPopup('Videos', videoElement);
            const audioPopup = popupUploaderObj.renderPopup('Audios', audioElement);

            // Create uploaders
            const imageUploader = popupUploaderObj.createUploader('Images', mockDragEvent, imageElement, imagePopup.element, popupObj);
            const videoUploader = popupUploaderObj.createUploader('Videos', mockDragEvent, videoElement, videoPopup.element, popupObj);
            const audioUploader = popupUploaderObj.createUploader('Audios', mockDragEvent, audioElement, audioPopup.element, popupObj);

            // Spy on uploadSuccess method to see when it's called
            const uploadSuccessSpy = spyOn(popupUploaderObj, 'uploadSuccess').and.callThrough();

            // Create success args for each type
            const imageSuccessArgs = {
                e: { currentTarget: { response: '{ "file": { "name": "image.jpg" } }' } },
                file: {
                    name: 'image.jpg',
                    rawFile: new File(['test'], 'image.jpg', { type: 'image/jpeg' }),
                    size: 1024,
                    status: 'success',
                    statusCode: '200',
                    type: 'image/jpeg',
                    validationMessages: {}
                },
                operation: 'upload'
            };

            const videoSuccessArgs = {
                e: { currentTarget: { response: '{ "file": { "name": "video.mp4" } }' } },
                file: {
                    name: 'video.mp4',
                    rawFile: new File(['test'], 'video.mp4', { type: 'video/mp4' }),
                    size: 2048,
                    status: 'success',
                    statusCode: '200',
                    type: 'video/mp4',
                    validationMessages: {}
                },
                operation: 'upload'
            };

            const audioSuccessArgs = {
                e: { currentTarget: { response: '{ "file": { "name": "audio.mp3" } }' } },
                file: {
                    name: 'audio.mp3',
                    rawFile: new File(['test'], 'audio.mp3', { type: 'audio/mp3' }),
                    size: 1536,
                    status: 'success',
                    statusCode: '200',
                    type: 'audio/mp3',
                    validationMessages: {}
                },
                operation: 'upload'
            };

            // path settings to test that branch
            rteObj.insertImageSettings.path = 'images/';
            rteObj.insertVideoSettings.path = 'videos/';
            rteObj.insertAudioSettings.path = 'audios/';

            // Mock trigger method to return expected values
            spyOn(rteObj, 'trigger').and.callFake((eventName: any, args: any, callback: Function) => {
            if (callback && ['imageUploadSuccess', 'fileUploadSuccess'].indexOf(eventName) !== -1) {                    
                callback({ file: { name: args.file.name } });
                }
                return true;
            });

            // Test each uploader's success handler
            setTimeout(() => {
                imageUploader.trigger('success', imageSuccessArgs);
                videoUploader.trigger('success', videoSuccessArgs);
                audioUploader.trigger('success', audioSuccessArgs);

                // Give time for timeout handlers to execute
                setTimeout(() => {
                    // Check if source elements were updated
                    expect(imageElement.getAttribute('src')).toContain('image.jpg');
                    expect(sourceVideoElem.getAttribute('src')).toContain('video.mp4');
                    expect(sourceAudioElem.getAttribute('src')).toContain('audio.mp3');

                    // Clean up
                    if (!imageUploader.isDestroyed) imageUploader.destroy();
                    if (!videoUploader.isDestroyed) videoUploader.destroy();
                    if (!audioUploader.isDestroyed) audioUploader.destroy();
                    if (!imagePopup.isDestroyed) imagePopup.destroy();
                    if (!videoPopup.isDestroyed) videoPopup.destroy();
                    if (!audioPopup.isDestroyed) audioPopup.destroy();

                    done();
                }, 1000);
            }, 0);
        });
    });

    describe('Handling upload methods - success, failure, refresh', () => {
        let rteObj: RichTextEditor;
        let popupUploaderObj: PopupUploader;
        let mediaElement: HTMLImageElement;
        let uploadObj: Uploader;
        let popupObj: Popup;
        let mockDragEvent: DragEvent;

        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image', 'Video', 'Audio']
                },
                insertImageSettings: {
                    allowedTypes: ['.jpeg', '.jpg', '.png'],
                    path: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/'
                }
            });
            jasmine.getEnv().allowRespy(true);

            setTimeout(() => {
                popupUploaderObj = (rteObj as any).serviceLocator.getService('popupUploaderObject');

                // Create image element
                mediaElement = document.createElement('img');
                mediaElement.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
                mediaElement.style.width = '100px';
                mediaElement.style.height = '100px';
                rteObj.inputElement.appendChild(mediaElement);

                const file = new File(['dummy content'], 'test-image.jpg', { type: 'image/jpeg' });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);

                const dragEventInit: DragEventInit = {
                    dataTransfer: dataTransfer
                };
                mockDragEvent = new DragEvent('drop', dragEventInit);

                popupObj = popupUploaderObj.renderPopup('Images', mediaElement);
                done();
            }, 100);
        });

        afterAll(() => {
            if (uploadObj && !uploadObj.isDestroyed) {
                uploadObj.destroy();
            }
            if (popupObj && !popupObj.isDestroyed) {
                popupObj.destroy();
            }
            destroy(rteObj);
        });

        it('refreshPopup should update popup position when target element is below rte position', () => {
            const originalOffsetTop = rteObj.element.offsetTop;
            const originalTargetOffsetTop = mediaElement.offsetTop;

            // Mock values to ensure target is below rte position
            Object.defineProperty(rteObj.element, 'offsetTop', { value: 100, configurable: true });
            Object.defineProperty(mediaElement, 'offsetTop', { value: 500, configurable: true });

            popupUploaderObj.refreshPopup(mediaElement, popupObj);

            expect(popupObj.offsetY).toBeLessThan(0);
            expect(popupObj.element.style.display).toBe('block');

            Object.defineProperty(rteObj.element, 'offsetTop', { value: originalOffsetTop, configurable: true });
            Object.defineProperty(mediaElement, 'offsetTop', { value: originalTargetOffsetTop, configurable: true });
        });

        it('refreshPopup should update popup position when target element is within rte position', () => {
            const spy = spyOn(popupObj, 'refreshPosition').and.callThrough();

            popupUploaderObj.refreshPopup(mediaElement, popupObj);

            expect(spy).toHaveBeenCalledWith(mediaElement);
            expect(popupObj.element.style.display).toBe('block');

            spy.calls.reset();
        });

        it('uploadSuccess should update media element for video and trigger appropriate event', (done: Function) => {
            // Create video element
            const videoElement = document.createElement('video');
            const sourceElement = document.createElement('source');
            videoElement.appendChild(sourceElement);
            videoElement.style.opacity = '0.5';
            rteObj.inputElement.appendChild(videoElement);

            // Create a complete success event args mock for video
            const successArgs = {
                e: {
                    currentTarget: { response: '{ "file": { "name": "test-video.mp4" } }' }
                },
                file: {
                    name: 'test-video.mp4',
                    rawFile: new File(['dummy video content'], 'test-video.mp4', { type: 'video/mp4' }),
                    size: 2048,
                    status: 'success',
                    statusCode: '200',
                    type: 'video/mp4',
                    validationMessages: {}
                },
                operation: 'upload'
            };

            // Create showPopup args
            const popupArgs = {
                args: mockDragEvent,
                type: 'Videos',
                elements: videoElement,
                isNotify: false
            };

            // Spy on the parent's trigger method
            const triggerSpy = spyOn(rteObj, 'trigger').and.callThrough();
            const notifySpy = spyOn(rteObj, 'notify').and.callThrough();

            popupUploaderObj.uploadSuccess(videoElement, mockDragEvent, popupArgs, successArgs, popupObj);

            expect(videoElement.style.opacity).toBe('1');
            expect(videoElement.classList.contains('e-video-focus')).toBe(true);
            expect(triggerSpy).toHaveBeenCalledWith('fileUploadSuccess', jasmine.any(Object), jasmine.any(Function));

            setTimeout(() => {
                expect(notifySpy).toHaveBeenCalledWith('insertCompleted', jasmine.any(Object));
                expect(notifySpy).toHaveBeenCalledWith('resizeStart', jasmine.any(Object));
                done();
            }, 200);
        });

        it('uploadSuccess should update media element for audio and trigger appropriate event', (done: Function) => {
            const audioElement = document.createElement('audio');
            const sourceElement = document.createElement('source');
            audioElement.appendChild(sourceElement);
            audioElement.style.opacity = '0.5';
            rteObj.inputElement.appendChild(audioElement);

            // Create a complete success event args mock for audio
            const successArgs = {
                e: {
                    currentTarget: { response: '{ "file": { "name": "test-audio.mp3" } }' }
                },
                file: {
                    name: 'test-audio.mp3',
                    rawFile: new File(['dummy audio content'], 'test-audio.mp3', { type: 'audio/mp3' }),
                    size: 1536,
                    status: 'success',
                    statusCode: '200',
                    type: 'audio/mp3',
                    validationMessages: {}
                },
                operation: 'upload'
            };

            // Create showPopup args
            const popupArgs = {
                args: mockDragEvent,
                type: 'Audios',
                elements: audioElement,
                isNotify: false
            };

            // Setup insertAudioSettings with path to ensure source update occurs
            const originalPath = rteObj.insertAudioSettings.path;
            rteObj.insertAudioSettings.path = "https://example.com/";

            // Create spies
            const triggerSpy = spyOn(rteObj, 'trigger').and.callFake((eventName: any, args: any, callback: Function) => {
                if (eventName === 'fileUploadSuccess' && callback) {
                    callback({
                        file: { name: "test-audio.mp3" }
                    });
                }
                return true;
            });

            // Create a mock DragEvent
            const dragEventInit: DragEventInit = {
                dataTransfer: new DataTransfer()
            };
            const audioFile = getMediaUniqueFIle(AUDIO_WAV_BASE64, 'audio/mpeg', 'song.mp3');
            dragEventInit.dataTransfer.items.add(audioFile);
            mockDragEvent = new DragEvent('drop', dragEventInit);

            const notifySpy = spyOn(rteObj, 'notify').and.callThrough();
            const loadSpy = spyOn(HTMLAudioElement.prototype, 'load').and.callThrough();

            popupUploaderObj.uploadSuccess(audioElement, mockDragEvent, popupArgs, successArgs, popupObj);

            expect(audioElement.style.opacity).toBe('1');
            expect(audioElement.classList.contains('e-audio-focus')).toBe(true);
            expect(triggerSpy).toHaveBeenCalledWith('fileUploadSuccess', jasmine.any(Object), jasmine.any(Function));

            setTimeout(() => {
                expect(notifySpy).toHaveBeenCalledWith('insertCompleted', jasmine.any(Object));
                expect(loadSpy).toHaveBeenCalled();

                // Restore original path
                rteObj.insertAudioSettings.path = originalPath;
                done();
            }, 300); // Increased timeout for stability
        });

        it('uploadFailure should detach media element and close popup', () => {
            if (!popupObj || popupObj.isDestroyed) {
                popupObj = popupUploaderObj.renderPopup('Images', mediaElement);
            }

            // Create complete failure event args
            const failureArgs = {
                e: {
                    currentTarget: {
                        status: 400,
                        response: 'Error uploading file'
                    }
                },
                file: {
                    name: 'test-image.jpg',
                    rawFile: new File(['dummy content'], 'test-image.jpg', { type: 'image/jpeg' }),
                    size: 1024,
                    status: 'failed',
                    statusCode: '400',
                    type: 'image/jpeg',
                    validationMessages: { minSize: 'File size too small' }
                },
                operation: 'upload'
            };

            // Create showPopup args
            const popupArgs = {
                args: mockDragEvent,
                type: 'Images',
                elements: mediaElement,
                isNotify: false
            };

            // Add media element to DOM to test detach
            rteObj.inputElement.appendChild(mediaElement);

            const popupCloseSpy = spyOn(popupObj, 'close').and.callThrough();
            const triggerSpy = spyOn(rteObj, 'trigger').and.callThrough();

            //for coverage purpose
            popupUploaderObj.uploadFailure(null, popupArgs, failureArgs, null);

            popupUploaderObj.uploadFailure(mediaElement, popupArgs, failureArgs, popupObj);

            expect(popupCloseSpy).toHaveBeenCalled();
            expect(triggerSpy).toHaveBeenCalledWith('imageUploadFailed', failureArgs);
        });
        it('should handle iframe settings when refreshPopup is called', () => {
            // First ensure popupObj is initialized
            if (!popupObj || popupObj.isDestroyed) {
                popupObj = popupUploaderObj.renderPopup('Images', mediaElement);
            }

            // Mock iframe settings
            rteObj.iframeSettings = { enable: true };
            rteObj.dataBind();

            // Reset any previous display style
            popupObj.element.style.display = 'none';

            // Create spy
            const refreshPositionSpy = spyOn(popupObj, 'refreshPosition').and.callThrough();

            popupUploaderObj.refreshPopup(mediaElement, popupObj);

            expect(popupObj.element.style.display).toBe('block');

            if (!refreshPositionSpy.calls.count()) {
                expect(popupObj.offsetY).toBeDefined();
            }
        });

        it('uploadSuccess should handle response without path for image', (done: Function) => {
            // Create success event args
            const successArgs = {
                e: {
                    currentTarget: { response: '{ "file": { "name": "no-path-image.jpg" } }' }
                },
                file: {
                    name: 'no-path-image.jpg',
                    rawFile: new File(['test'], 'no-path-image.jpg', { type: 'image/jpeg' }),
                    size: 1024,
                    status: 'success',
                    statusCode: '200',
                    type: 'image/jpeg',
                    validationMessages: {}
                },
                operation: 'upload'
            };

            const popupArgs = {
                args: mockDragEvent,
                type: 'Images',
                elements: mediaElement,
                isNotify: false
            };

            // Remove path from settings
            const originalPath = rteObj.insertImageSettings.path;
            rteObj.insertImageSettings.path = undefined;
            rteObj.dataBind();

            // Set detectImageSource to test this property
            (successArgs as any).detectImageSource = undefined;

            popupUploaderObj.uploadSuccess(mediaElement, mockDragEvent, popupArgs, successArgs, popupObj);

            setTimeout(() => {
                //detectMediaSource variable is changed before uploadSuccess method calling so commenting this
                //expect((successArgs as any).detectImageSource).toBeDefined();
                // Reset path
                rteObj.insertImageSettings.path = originalPath;
                rteObj.dataBind();
                done();
            }, 100);
        });

        it('uploadFailure should handle different media types', () => {
            // Test with video element
            const videoElement = document.createElement('video');
            const videoSource = document.createElement('source');
            videoElement.appendChild(videoSource);
            rteObj.inputElement.appendChild(videoElement);

            const failureArgs = {
                e: {
                    currentTarget: {
                        status: 400,
                        response: 'Error uploading video'
                    }
                },
                file: {
                    name: 'test-video.mp4',
                    rawFile: new File(['test'], 'test-video.mp4', { type: 'video/mp4' }),
                    size: 2048,
                    status: 'failed',
                    statusCode: '400',
                    type: 'video/mp4',
                    validationMessages: {}
                },
                operation: 'upload'
            };

            const popupArgs = {
                args: mockDragEvent,
                type: 'Videos',
                elements: videoElement,
                isNotify: false
            };

            const triggerSpy = spyOn(rteObj, 'trigger').and.callThrough();

            popupUploaderObj.uploadFailure(videoElement, popupArgs, failureArgs, popupObj);

            expect(triggerSpy).toHaveBeenCalledWith('fileUploadFailed', failureArgs);
        });

        it('createUploader should handle upload events', (done: Function) => {
            if (!popupObj || popupObj.isDestroyed) {
                // Create a new popup first
                popupObj = popupUploaderObj.renderPopup('Images', mediaElement);
            }

            // Create uploader
            uploadObj = popupUploaderObj.createUploader('Images', mockDragEvent, mediaElement, popupObj.element, popupObj);

            // Spy on parent methods, but don't call through to allow proper checking
            const triggerSpy = spyOn(rteObj, 'trigger').and.returnValue(true);

            // Mock upload event arguments
            const beforeUploadArgs = {
                cancel: false,
                customFormData: [] as any,
                name: 'beforeUpload'
            };

            const uploadingArgs = {
                file: {
                    name: 'test-image.jpg',
                    size: 1024,
                    type: 'image/jpeg'
                },
                cancel: false,
                name: 'uploading'
            };

            const removingArgs = {
                filesData: [{
                    name: 'test-image.jpg',
                    size: 1024,
                    type: 'image/jpeg'
                }]
            };

            // Trigger events
            uploadObj.trigger('beforeUpload', beforeUploadArgs);
            uploadObj.trigger('uploading', uploadingArgs);
            uploadObj.trigger('removing', removingArgs);

            // Check expectations with less strict matching
            expect(triggerSpy).toHaveBeenCalledWith('beforeImageUpload', jasmine.objectContaining(beforeUploadArgs));
            expect(triggerSpy).toHaveBeenCalledWith('imageUploading', jasmine.objectContaining(uploadingArgs), jasmine.any(Function));

            // Check parent's inputElement instead of mediaElement
            expect(rteObj.inputElement.contentEditable).toBe('true');

            done();
        });

        it('createUploader should handle canceling event', () => {
            if (!popupObj || popupObj.isDestroyed) {
                // Create a new popup first
                popupObj = popupUploaderObj.renderPopup('Images', mediaElement);
            }

            // Create a mock DragEvent
            const dragEventInit: DragEventInit = {
                dataTransfer: new DataTransfer()
            };
            const imageFile = getImageUniqueFIle();
            dragEventInit.dataTransfer.items.add(imageFile);
            mockDragEvent = new DragEvent('drop', dragEventInit);

            // Create uploader
            uploadObj = popupUploaderObj.createUploader('Images', mockDragEvent, mediaElement, popupObj.element, popupObj);

            // Set mediaElement as uploaded to test canceling
            mediaElement.style.opacity = '0.5';

            // Spy on popup close
            const popupCloseSpy = spyOn(popupObj, 'close').and.callThrough();

            // Trigger canceling event
            uploadObj.trigger('canceling');

            // Check the parent.inputElement instead of mediaElement
            expect(rteObj.inputElement.contentEditable).toBe('true');
            expect(popupCloseSpy).toHaveBeenCalled();
        });

        it('createUploader should handle failure event', (done) => {
            if (!popupObj || popupObj.isDestroyed) {
                popupObj = popupUploaderObj.renderPopup('Images', mediaElement);
            }
            const uploadFailureSpy = spyOn(popupUploaderObj, 'uploadFailure').and.callThrough();
            const uploadObj = popupUploaderObj.createUploader('Images', mockDragEvent, mediaElement, popupObj.element, popupObj);

            const failureArgs = {
                e: {
                    currentTarget: {
                        status: 400,
                        response: 'Error uploading file'
                    }
                },
                file: {
                    name: 'test-image.jpg',
                    rawFile: new File(['dummy content'], 'test-image.jpg', { type: 'image/jpeg' }),
                    size: 1024,
                    status: 'failed',
                    statusCode: '400',
                    type: 'image/jpeg',
                    validationMessages: {}
                },
                operation: 'upload',
                name: 'failure',
                cancel: false
            };

            // Trigger the failure event
            uploadObj.trigger('failure', failureArgs);

            // Wait for the timeout in the failure handler
            setTimeout(() => {
                try {
                    // Verify the uploadFailure method was called
                    expect(uploadFailureSpy).toHaveBeenCalled();

                    // Clean up
                    if (uploadObj && !uploadObj.isDestroyed) {
                        uploadObj.destroy();
                    }
                    done();
                } catch (e) {
                    done.fail(e);
                }
            }, 1000);
        });

        it('createUploader should handle success event', (done: Function) => {
            if (!popupObj || popupObj.isDestroyed) {
                // Create a new popup first
                popupObj = popupUploaderObj.renderPopup('Images', mediaElement);
            }

            // First stub the uploadSuccess method
            const uploadSuccessSpy = spyOn(popupUploaderObj, 'uploadSuccess').and.callThrough();

            // Create uploader after spying
            uploadObj = popupUploaderObj.createUploader('Images', mockDragEvent, mediaElement, popupObj.element, popupObj);

            // Create success event args
            const successArgs = {
                e: {
                    currentTarget: { response: '{ "file": { "name": "test-image.jpg" } }' }
                },
                file: {
                    name: 'test-image.jpg',
                    rawFile: new File(['dummy content'], 'test-image.jpg', { type: 'image/jpeg' }),
                    size: 1024,
                    status: 'success',
                    statusCode: '200',
                    type: 'image/jpeg',
                    validationMessages: {}
                },
                operation: 'upload'
            };

            uploadObj.trigger('success', successArgs);

            // Use done callback to properly handle the async expectation
            setTimeout(() => {
                expect(uploadSuccessSpy).toHaveBeenCalled();
                done(); // Call done to indicate the test is complete
            }, 1000); // Add a timeout to let any async operations complete
        });

        // Test different types in uploadSuccess
        it('uploadSuccess should handle different media types with/without path', () => {
            // Test video element with no path
            const videoElement = document.createElement('video');
            const videoSource = document.createElement('source');
            videoElement.appendChild(videoSource);

            // Create success args
            const videoSuccessArgs = {
                e: {
                    currentTarget: { response: '{ "file": { "name": "test-video.mp4" } }' }
                },
                file: {
                    name: 'test-video.mp4',
                    rawFile: new File(['test video content'], 'test-video.mp4', { type: 'video/mp4' }),
                    size: 2048,
                    status: 'success',
                    statusCode: '200',
                    type: 'video/mp4',
                    validationMessages: {}
                },
                operation: 'upload'
            };

            const videoPopupArgs = {
                args: mockDragEvent,
                type: 'Videos',
                elements: videoElement,
                isNotify: false
            };

            // Remove path from settings to test that code path
            const originalVideoPath = rteObj.insertVideoSettings.path;
            rteObj.insertVideoSettings.path = undefined;
            rteObj.dataBind();

            // Call uploadSuccess
            popupUploaderObj.uploadSuccess(videoElement, mockDragEvent, videoPopupArgs, videoSuccessArgs, popupObj);

            // Reset path
            rteObj.insertVideoSettings.path = originalVideoPath;
            rteObj.dataBind();

            // Test audio element with no path
            const audioElement = document.createElement('audio');
            const audioSource = document.createElement('source');
            audioElement.appendChild(audioSource);

            // Create success args
            const audioSuccessArgs = {
                e: {
                    currentTarget: { response: '{ "file": { "name": "test-audio.mp3" } }' }
                },
                file: {
                    name: 'test-audio.mp3',
                    rawFile: new File(['test audio content'], 'test-audio.mp3', { type: 'audio/mp3' }),
                    size: 1536,
                    status: 'success',
                    statusCode: '200',
                    type: 'audio/mp3',
                    validationMessages: {}
                },
                operation: 'upload'
            };

            const audioPopupArgs = {
                args: mockDragEvent,
                type: 'Audios',
                elements: audioElement,
                isNotify: false
            };

            const originalAudioPath = rteObj.insertAudioSettings.path;
            rteObj.insertAudioSettings.path = undefined;
            rteObj.dataBind();

            // Call uploadSuccess
            popupUploaderObj.uploadSuccess(audioElement, mockDragEvent, audioPopupArgs, audioSuccessArgs, popupObj);

            // Reset path
            rteObj.insertAudioSettings.path = originalAudioPath;
            rteObj.dataBind();
        });

        it('should test the response callback in uploadSuccess', (done: Function) => {
            // Create image element
            const imgElement = document.createElement('img');
            imgElement.style.opacity = '0.5';

            // Create success args
            const successArgs = {
                e: {
                    currentTarget: { response: '{ "file": { "name": "response-test.jpg" } }' }
                },
                file: {
                    name: 'response-test.jpg',
                    rawFile: new File(['test content'], 'response-test.jpg', { type: 'image/jpeg' }),
                    size: 1024,
                    status: 'success',
                    statusCode: '200',
                    type: 'image/jpeg',
                    validationMessages: {}
                },
                operation: 'upload'
            };

            const popupArgs = {
                args: mockDragEvent,
                type: 'Images',
                elements: imgElement,
                isNotify: false
            };

            // Spy on trigger and mock its behavior to call the callback
            spyOn(rteObj, 'trigger').and.callFake((eventName: string, args: any, callback: Function) => {
                if (eventName === 'imageUploadSuccess') {
                    // Call the callback with response data to test that path
                    callback({
                        file: { name: 'callback-test.jpg' }
                    });

                    // Verify src was updated
                    expect(imgElement.src).toBeTruthy();
                    expect(imgElement.getAttribute('alt')).toBe('callback-test.jpg');
                    done();
                }
                return true;
            });

            // Ensure path is set
            rteObj.insertImageSettings.path = 'https://example.com/';
            rteObj.dataBind();

            // Call uploadSuccess
            popupUploaderObj.uploadSuccess(imgElement, mockDragEvent, popupArgs, successArgs, popupObj);
        });

        it('should test specific path conditions and file extension handling in uploadSuccess', () => {
            // Create video element with source
            const videoElement = document.createElement('video');
            const sourceElement = document.createElement('source');
            videoElement.appendChild(sourceElement);
            videoElement.style.opacity = '0.5';

            // Create success args with MP4 extension
            const successArgs = {
                e: {
                    currentTarget: { response: '{ "file": { "name": "test-video.mp4" } }' }
                },
                file: {
                    name: 'test-video.mp4',
                    rawFile: new File(['test video content'], 'test-video.mp4', { type: 'video/mp4' }),
                    size: 2048,
                    status: 'success',
                    statusCode: '200',
                    type: 'video/mp4',
                    validationMessages: {}
                },
                operation: 'upload'
            };

            const popupArgs = {
                args: mockDragEvent,
                type: 'Videos',
                elements: videoElement,
                isNotify: false
            };

            // Mock trigger to call callback
            spyOn(rteObj, 'trigger').and.callFake((eventName: string, args: any, callback: Function) => {
                if (eventName === 'fileUploadSuccess') {
                    callback({
                        file: { name: 'test-video.mp4' }
                    });

                    // Check if MIME type was correctly set based on file extension
                    const source = videoElement.querySelector('source');
                    expect(source.getAttribute('type')).toBe('video/mp4');
                    expect(source.getAttribute('src')).toContain('test-video.mp4');
                }
                return true;
            });

            // Ensure path is set
            rteObj.insertVideoSettings.path = 'https://example.com/videos/';
            rteObj.dataBind();

            // Call uploadSuccess
            popupUploaderObj.uploadSuccess(videoElement, mockDragEvent, popupArgs, successArgs, popupObj);

            // Now test with a different extension
            const webmSuccessArgs = {
                e: {
                    currentTarget: { response: '{ "file": { "name": "test-video.webm" } }' }
                },
                file: {
                    name: 'test-video.webm',
                    rawFile: new File(['test video content'], 'test-video.webm', { type: 'video/webm' }),
                    size: 2048,
                    status: 'success',
                    statusCode: '200',
                    type: 'video/webm',
                    validationMessages: {}
                },
                operation: 'upload'
            };

            // Call uploadSuccess again with webm file
            popupUploaderObj.uploadSuccess(videoElement, mockDragEvent, popupArgs, webmSuccessArgs, popupObj);
        });

        it('should verify detach is called in uploadFailure', () => {
            // Create element and add to DOM
            const imgElement = document.createElement('img');
            rteObj.inputElement.appendChild(imgElement);

            // Create failure args
            const failureArgs = {
                e: {
                    currentTarget: {
                        status: 400,
                        response: 'Error uploading file'
                    }
                },
                file: {
                    name: 'test-image.jpg',
                    rawFile: new File(['dummy content'], 'test-image.jpg', { type: 'image/jpeg' }),
                    size: 1024,
                    status: 'failed',
                    statusCode: '400',
                    type: 'image/jpeg',
                    validationMessages: {}
                },
                operation: 'upload'
            };

            const popupArgs = {
                args: mockDragEvent,
                type: 'Images',
                elements: imgElement,
                isNotify: false
            };

            // Spy on detach
            const detachSpy = spyOn(baseModule, 'detach').and.callThrough();

            // Call uploadFailure
            popupUploaderObj.uploadFailure(imgElement, popupArgs, failureArgs, popupObj);

            // Verify detach was called with the element
            expect(detachSpy).toHaveBeenCalledWith(imgElement);
        });
        it('should cover detectMediaSource and detectMediaSource branches in uploadSuccess', () => {
            // Create video element
            const videoElement = document.createElement('video');
            const videoSource = document.createElement('source');
            videoElement.appendChild(videoSource);

            // Create success args with detectMediaSource property
            const videoSuccessArgs = {
                e: {
                    currentTarget: { response: '{ "file": { "name": "test-video.mp4" } }' }
                },
                file: {
                    name: 'test-video.mp4',
                    rawFile: new File(['test video content'], 'test-video.mp4', { type: 'video/mp4' }),
                    size: 2048,
                    status: 'success',
                    statusCode: '200',
                    type: 'video/mp4',
                    validationMessages: {} // Add this missing property
                },
                operation: 'upload',
                detectMediaSource: 'URL'
            };

            const videoPopupArgs = {
                args: mockDragEvent,
                type: 'Videos',
                elements: videoElement,
                isNotify: false
            };

            // Call uploadSuccess
            popupUploaderObj.uploadSuccess(videoElement, mockDragEvent, videoPopupArgs, videoSuccessArgs, popupObj);

            // Verify detectMediaSource was updated
            //detectMediaSource variable is changed before uploadSuccess method calling so commenting this
            // expect(videoSuccessArgs.detectMediaSource).toBe('Dropped');

            // Create audio element
            const audioElement = document.createElement('audio');
            const audioSource = document.createElement('source');
            audioElement.appendChild(audioSource);

            // Create success args with detectMediaSource property
            const audioSuccessArgs = {
                e: {
                    currentTarget: { response: '{ "file": { "name": "test-audio.mp3" } }' }
                },
                file: {
                    name: 'test-audio.mp3',
                    rawFile: new File(['test audio content'], 'test-audio.mp3', { type: 'audio/mp3' }),
                    size: 1536,
                    status: 'success',
                    statusCode: '200',
                    type: 'audio/mp3',
                    validationMessages: {} // Add this missing property
                },
                operation: 'upload',
                detectMediaSource: 'URL'
            };

            const audioPopupArgs = {
                args: mockDragEvent,
                type: 'Audios',
                elements: audioElement,
                isNotify: false
            };

            // Call uploadSuccess
            popupUploaderObj.uploadSuccess(audioElement, mockDragEvent, audioPopupArgs, audioSuccessArgs, popupObj);

            //detectMediaSource variable is changed before uploadSuccess method calling so commenting this
            // Verify detectMediaSource was updated
            // expect(audioSuccessArgs.detectMediaSource).toBe('Dropped');

            // Also test image
            const imageElement = document.createElement('img');

            // Create success args with detectImageSource property
            const imageSuccessArgs = {
                e: {
                    currentTarget: { response: '{ "file": { "name": "test-image.jpg" } }' }
                },
                file: {
                    name: 'test-image.jpg',
                    rawFile: new File(['test image content'], 'test-image.jpg', { type: 'image/jpeg' }),
                    size: 1024,
                    status: 'success',
                    statusCode: '200',
                    type: 'image/jpeg',
                    validationMessages: {}
                },
                operation: 'upload',
                detectImageSource: 'URL'
            };

            const imagePopupArgs = {
                args: mockDragEvent,
                type: 'Images',
                elements: imageElement,
                isNotify: false
            };

            // Call uploadSuccess
            popupUploaderObj.uploadSuccess(imageElement, mockDragEvent, imagePopupArgs, imageSuccessArgs, popupObj);

            //detectMediaSource variable is changed before uploadSuccess method calling so commenting this
            // Verify detectImageSource was updated
            // expect(imageSuccessArgs.detectImageSource).toBe('Dropped');
        });
    });

    describe('Destroy popupuploader objects', () => {
        let rteObj: RichTextEditor;
        let popupUploaderObj: PopupUploader;
        let mediaElement: HTMLImageElement;
        let uploadObj: Uploader;
        let imageModuleRef: any;
        let popupObj: Popup;
        let mockDragEvent: DragEvent;

        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image', 'Video', 'Audio']
                },
                insertImageSettings: {
                    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    path: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/'
                },
            });

            setTimeout(() => {
                popupUploaderObj = (rteObj as any).serviceLocator.getService('popupUploaderObject');
                imageModuleRef = (rteObj as any).imageModule;

                // Create image element
                mediaElement = document.createElement('img');
                mediaElement.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
                rteObj.inputElement.appendChild(mediaElement);

                const imageFile = getImageUniqueFIle();
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(imageFile);
                // Create mock event for drag drop with all necessary properties
                const dropEvent = new MouseEvent('drop', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: 100,
                    clientY: 100
                }) as any;

                // Add required properties for dragDrop
                Object.defineProperty(dropEvent, 'dataTransfer', {
                    value: dataTransfer,
                    writable: true
                });
                imageModuleRef.uploadMethod(dropEvent, mediaElement)

                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });

        it('destroy should clean up all resources properly', () => {
            // Setup some timeout properties for testing cleanup
            (popupUploaderObj as any).uploadFailureTime = setTimeout(() => { }, 1000);
            (popupUploaderObj as any).uploadSuccessTime = setTimeout(() => { }, 1000);

            // Create spy for clearTimeout
            const clearTimeoutSpy = spyOn(window, 'clearTimeout').and.callThrough();

            expect((popupUploaderObj as any).isDestroyed).toBe(false);

            // Call destroy
            popupUploaderObj.destroy();

            // Verify timers are cleared
            expect(clearTimeoutSpy).toHaveBeenCalledTimes(2);
            expect((popupUploaderObj as any).uploadFailureTime).toBeNull();
            expect((popupUploaderObj as any).uploadSuccessTime).toBeNull();

            // Verify isDestroyed flag
            expect((popupUploaderObj as any).isDestroyed).toBe(true);

            // Call destroy again to verify it handles multiple calls correctly
            popupUploaderObj.destroy();
        });
    });

    describe('Integration with Image Module', () => {
        let rteObj: RichTextEditor;
        let popupUploaderObj: PopupUploader;
        let imageModuleRef: any;
        let imageUploadEvent: boolean = false;
        let imageSuccessEvent: boolean = false;

        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image']
                },
                insertImageSettings: {
                    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    path: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/'
                },
                imageUploadSuccess: (args: any) => {
                    imageSuccessEvent = true;
                }
            });

            setTimeout(() => {
                popupUploaderObj = (rteObj as any).serviceLocator.getService('popupUploaderObject');
                imageModuleRef = (rteObj as any).imageModule;
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });

        it('Image drag and drop using PopupUploader', (done: Function) => {
            // Create an image element and simulate drag and drop
            const imageFile = new File(['dummy content'], 'test-image.jpg', { type: 'image/jpeg' });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(imageFile);

            // Create mock event for drag drop
            const dropEvent = new MouseEvent('drop', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: 100,
                clientY: 100
            }) as any;

            // Add required properties for dragDrop
            dropEvent.dataTransfer = dataTransfer;

            // range functions for proper drag drop handling
            spyOn(rteObj.contentModule.getDocument(), 'caretRangeFromPoint').and.returnValue(document.createRange());

            // Spy on uploadMethod
            const uploadMethodSpy = spyOn(imageModuleRef, 'uploadMethod').and.callThrough();

            // Trigger the drop event
            rteObj.contentModule.getEditPanel().dispatchEvent(dropEvent);

            setTimeout(() => {
                expect(uploadMethodSpy).toHaveBeenCalled();
                expect(uploadMethodSpy.calls.mostRecent().args[0]).toEqual(jasmine.any(Object));
                expect(uploadMethodSpy.calls.mostRecent().args[1]).toEqual(jasmine.any(HTMLImageElement));
                done();
            }, 300);
        });
    });

    describe('Integration with Video Module', () => {
        let rteObj: RichTextEditor;
        let popupUploaderObj: PopupUploader;
        let videoModuleRef: any;
        let videoUploadEvent: boolean = false;
        let videoSuccessEvent: boolean = false;

        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Video']
                },
                insertVideoSettings: {
                    allowedTypes: ['.mp4', '.webm'],
                    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    path: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/'
                },
                fileUploadSuccess: (args: any) => {
                    videoSuccessEvent = true;
                }
            });

            setTimeout(() => {
                popupUploaderObj = (rteObj as any).serviceLocator.getService('popupUploaderObject');
                videoModuleRef = (rteObj as any).videoModule;
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });

        it('Video drag and drop should using PopupUploader', (done: Function) => {
            // Ensure videoModuleRef is available
            expect(rteObj.videoModule).toBeDefined();
            videoModuleRef = (rteObj as any).videoModule;

            // Create a video file and simulate drag and drop
            const videoFile = new File(['dummy video content'], 'test-video.mp4', { type: 'video/mp4' });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(videoFile);

            // Create mock event for drag drop with all necessary properties
            const dropEvent = new MouseEvent('drop', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: 100,
                clientY: 100
            }) as any;

            // Add required properties for dragDrop
            Object.defineProperty(dropEvent, 'dataTransfer', {
                value: dataTransfer,
                writable: true
            });

            // range functions for proper drag drop handling
            spyOn(rteObj.contentModule.getDocument(), 'caretRangeFromPoint').and.returnValue(document.createRange());

            // Setup spies
            const uploadMethodSpy = spyOn(videoModuleRef, 'uploadMethod').and.callThrough();
            const renderPopupSpy = spyOn(popupUploaderObj, 'renderPopup').and.callThrough();
            const createUploaderSpy = spyOn(popupUploaderObj, 'createUploader').and.callThrough();

            // Create video element first
            const videoElement = document.createElement('video');

            // Call uploadMethod directly - this is more reliable than event dispatch
            videoModuleRef.uploadMethod(dropEvent, videoElement);
            try {
                // Since we called uploadMethod directly, it should have been called
                expect(uploadMethodSpy).toHaveBeenCalled();
                expect(uploadMethodSpy.calls.mostRecent().args[0]).toBe(dropEvent);
                expect(uploadMethodSpy.calls.mostRecent().args[1]).toBe(videoElement);

                // Check if popup methods were called
                expect(renderPopupSpy).toHaveBeenCalled();
                expect(createUploaderSpy).toHaveBeenCalled();

                // Check for popup element
                const popupElement = document.querySelector('.e-rte-video-upload-popup, .e-rte-upload-popup');
                expect(popupElement).not.toBeNull();

                done();
            } catch (e) {
                const error = new Error(e instanceof Error ? e.message : String(e));
                done(error);
            }
        });

        describe('Integration with Audio Module', () => {
            let rteObj: RichTextEditor;
            let popupUploaderObj: PopupUploader;
            let audioModuleRef: any;
            let audioSuccessEvent: boolean = false;

            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Audio']
                    },
                    insertAudioSettings: {
                        allowedTypes: ['.mp3', '.wav'],
                        saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                        path: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/'
                    },
                    fileUploadSuccess: (args: any) => {
                        audioSuccessEvent = true;
                    }
                });

                setTimeout(() => {
                    popupUploaderObj = (rteObj as any).serviceLocator.getService('popupUploaderObject');
                    audioModuleRef = (rteObj as any).audioModule;
                    done();
                }, 100);
            });

            afterAll(() => {
                destroy(rteObj);
            });

            it('Audio drag and drop using PopupUploader', (done: Function) => {
                // Ensure audioModuleRef is available
                expect(rteObj.audioModule).toBeDefined();
                audioModuleRef = (rteObj as any).audioModule;

                // Create an audio file and simulate drag and drop
                const audioFile = new File(['dummy audio content'], 'test-audio.mp3', { type: 'audio/mp3' });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(audioFile);

                // Create mock event for drag drop with all necessary properties
                const dropEvent = new MouseEvent('drop', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: 100,
                    clientY: 100
                }) as any;

                Object.defineProperty(dropEvent, 'dataTransfer', {
                    value: dataTransfer,
                    writable: true
                });

                // Setup spies
                const uploadMethodSpy = spyOn(audioModuleRef, 'uploadMethod').and.callThrough();
                const renderPopupSpy = spyOn(popupUploaderObj, 'renderPopup').and.callThrough();
                const createUploaderSpy = spyOn(popupUploaderObj, 'createUploader').and.callThrough();

                // Create audio element first
                const audioElement = document.createElement('audio');

                audioModuleRef.uploadMethod(dropEvent, audioElement);
                try {
                    // Since we called uploadMethod directly, it should have been called
                    expect(uploadMethodSpy).toHaveBeenCalled();
                    expect(uploadMethodSpy.calls.mostRecent().args[0]).toBe(dropEvent);
                    expect(uploadMethodSpy.calls.mostRecent().args[1]).toBe(audioElement);

                    // Check if popup methods were called
                    expect(renderPopupSpy).toHaveBeenCalled();
                    expect(createUploaderSpy).toHaveBeenCalled();

                    // Check for popup element
                    const popupElement = document.querySelector('.e-rte-audio-upload-popup, .e-rte-upload-popup');
                    expect(popupElement).not.toBeNull();

                    done();
                } catch (e) {
                    const error = new Error(e instanceof Error ? e.message : String(e));
                    done(error);
                }
            });
        });

        describe('PopupUploader - Error Handling', () => {
            let rteObj: RichTextEditor;
            let popupUploaderObj: PopupUploader;
            let mockDragEvent: DragEvent;

            beforeAll((done: Function) => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Image', 'Video', 'Audio']
                    }
                });

                setTimeout(() => {
                    popupUploaderObj = (rteObj as any).serviceLocator.getService('popupUploaderObject');

                    // Create a mock DragEvent
                    const dragEventInit: DragEventInit = {
                        dataTransfer: new DataTransfer()
                    };
                    mockDragEvent = new DragEvent('drop', dragEventInit);

                    done();
                }, 100);
            });

            afterAll(() => {
                destroy(rteObj);
            });

            it('should handle uploadSuccess with cancel operation', () => {
                const videoElement = document.createElement('video');
                const sourceElement = document.createElement('source');
                videoElement.appendChild(sourceElement);

                // Create success args with cancel operation
                const successArgs = {
                    e: {
                        currentTarget: { response: '{}' }
                    },
                    file: {
                        name: 'test-video.mp4',
                        rawFile: new File(['test'], 'test-video.mp4', { type: 'video/mp4' }),
                        size: 1024,
                        status: 'canceled',
                        statusCode: '0',
                        type: 'video/mp4',
                        validationMessages: {}
                    },
                    operation: 'cancel'
                };

                const popupArgs = {
                    args: mockDragEvent,
                    type: 'Videos',
                    elements: videoElement,
                    isNotify: false
                };

                // Create a mock DragEvent
                const dragEventInit: DragEventInit = {
                    dataTransfer: new DataTransfer()
                };
                const imageFile = getImageUniqueFIle();
                dragEventInit.dataTransfer.items.add(imageFile);
                mockDragEvent = new DragEvent('drop', dragEventInit);

                const popupObj = popupUploaderObj.renderPopup('Videos', videoElement);

                // No actions should be performed for cancel operation
                const triggerSpy = spyOn(rteObj, 'trigger').and.callThrough();
                const notifySpy = spyOn(rteObj, 'notify').and.callThrough();

                popupUploaderObj.uploadSuccess(videoElement, mockDragEvent, popupArgs, successArgs, popupObj);

                // Verify no events were triggered
                expect(triggerSpy).not.toHaveBeenCalled();
                expect(notifySpy).not.toHaveBeenCalled();
            });

            it('should handle destroy when already destroyed', () => {
                // First destroy
                popupUploaderObj.destroy();
                expect((popupUploaderObj as any).isDestroyed).toBe(true);

                // Create spy
                const clearTimeoutSpy = spyOn(window, 'clearTimeout').and.callThrough();

                // Second destroy - should do nothing
                popupUploaderObj.destroy();

                // Verify clearTimeout was not called again
                expect(clearTimeoutSpy).not.toHaveBeenCalled();
            });

            it('should handle browser-specific logic in createUploader', () => {
                // Save original browser.isIE value
                const originalIsIE = Browser.isIE;

                // Create a mock DragEvent
                const dragEventInit: DragEventInit = {
                    dataTransfer: new DataTransfer()
                };
                const imageFile = getImageUniqueFIle();
                dragEventInit.dataTransfer.items.add(imageFile);
                mockDragEvent = new DragEvent('drop', dragEventInit);

                const mediaElement = document.createElement('img');
                const popupObj = popupUploaderObj.renderPopup('Images', mediaElement);

                // Create uploader with IE browser mock
                const uploader = popupUploaderObj.createUploader('Images', mockDragEvent, mediaElement, popupObj.element, popupObj);

                // Trigger removing event
                uploader.trigger('removing');

                // Restore original browser.isIE
                Object.defineProperty(Browser, 'isIE', { value: originalIsIE, configurable: true });

                // Clean up
                if (!uploader.isDestroyed) {
                    uploader.destroy();
                }
            });
            it('should handle canceling with quickToolbarModule for different media types', () => {
                // Create elements
                const imageElement = document.createElement('img');
                const videoElement = document.createElement('video');
                const audioElement = document.createElement('audio');

                // Setup mock quickToolbarModule with type assertion
                rteObj.quickToolbarModule = {
                    imageQTBar: { hidePopup: jasmine.createSpy('imageHidePopup') },
                    videoQTBar: { hidePopup: jasmine.createSpy('videoHidePopup') },
                    audioQTBar: { hidePopup: jasmine.createSpy('audioHidePopup') }
                } as any;

                // Create a mock DragEvent
                const dragEventInit: DragEventInit = {
                    dataTransfer: new DataTransfer()
                };
                const imageFile = getImageUniqueFIle();
                dragEventInit.dataTransfer.items.add(imageFile);
                mockDragEvent = new DragEvent('drop', dragEventInit);

                // Create popup and uploader for each media type
                const imagePopup = popupUploaderObj.renderPopup('Images', imageElement);
                const imageUploader = popupUploaderObj.createUploader('Images', mockDragEvent, imageElement, imagePopup.element, imagePopup);

                // Trigger canceling for Images
                imageUploader.trigger('canceling');

                // Verify imageQTBar.hidePopup was called
                expect(rteObj.quickToolbarModule.imageQTBar.hidePopup).toHaveBeenCalled();

                // Reset for Videos
                imageUploader.destroy();
                imagePopup.destroy();

                const videoFile = getMediaUniqueFIle(VIDEO_WEBM_BASE64, 'video/mp4', 'movie.mp4');
                dragEventInit.dataTransfer.items.add(videoFile);
                mockDragEvent = new DragEvent('drop', dragEventInit);

                const videoPopup = popupUploaderObj.renderPopup('Videos', videoElement);
                const videoUploader = popupUploaderObj.createUploader('Videos', mockDragEvent, videoElement, videoPopup.element, videoPopup);

                // Trigger canceling for Videos
                videoUploader.trigger('canceling');

                // Verify videoQTBar.hidePopup was called
                expect(rteObj.quickToolbarModule.videoQTBar.hidePopup).toHaveBeenCalled();

                // Reset for Audios
                videoUploader.destroy();
                videoPopup.destroy();

                const audioFile = getMediaUniqueFIle(AUDIO_WAV_BASE64, 'audio/mpeg', 'song.mp3');
                dragEventInit.dataTransfer.items.add(audioFile);
                mockDragEvent = new DragEvent('drop', dragEventInit);

                const audioPopup = popupUploaderObj.renderPopup('Audios', audioElement);
                const audioUploader = popupUploaderObj.createUploader('Audios', mockDragEvent, audioElement, audioPopup.element, audioPopup);

                // Trigger canceling for Audios
                audioUploader.trigger('canceling');

                // Verify audioQTBar.hidePopup was called
                expect(rteObj.quickToolbarModule.audioQTBar.hidePopup).toHaveBeenCalled();

                // Clean up
                audioUploader.destroy();
                audioPopup.destroy();

                // Remove mock quickToolbarModule
                rteObj.quickToolbarModule = undefined;
            });
        });
    });
});