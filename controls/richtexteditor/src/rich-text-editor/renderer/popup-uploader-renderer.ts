import { addClass, detach, extend, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';
import { BeforeUploadEventArgs, MetaData, SelectedEventArgs, SuccessEventArgs, FailureEventArgs, Uploader, UploadingEventArgs } from '@syncfusion/ej2-inputs';
import * as classes from '../base/classes';
import * as events from '../base/constant';
import { MediaType } from '../../common/types';
import { IRichTextEditor } from '../base/interface';
import { IShowPopupArgs } from '../../common/interface';
import { ImageInputSource, MediaInputSource  } from '../../common/enum';
import { ImageSuccessEventArgs, MediaSuccessEventArgs } from '../../common/interface';
import { CLS_IMG_FOCUS, CLS_AUD_FOCUS, CLS_VID_FOCUS} from '../../common/constant';


export class PopupUploader {
    private parent: IRichTextEditor;
    public popupObj: Popup;
    public uploadObj: Uploader;
    private rteID: string;
    private isDestroyed: boolean = false;
    private uploadCancelTime: number;
    private uploadFailureTime: number;
    private uploadSuccessTime: number;

    constructor(parent: IRichTextEditor) {
        this.parent = parent;
        this.rteID = parent.element.id;
    }

    /**
     * Creates and renders a popup for media upload
     *
     * @param {MediaType} type - Type of popup (Image, Video, Audio)
     * @param {HTMLElement} element - Element to append popup
     * @returns {Popup} - Returns the created popup
     * @hidden
     */
    public renderPopup(type: MediaType, element: HTMLElement): Popup {
        const popupElement: HTMLElement = this.parent.createElement('div');
        this.parent.rootContainer.appendChild(popupElement);

        const uploadEle: HTMLInputElement | HTMLElement = this.parent.createElement('input', {
            id: this.rteID + '_' + type.toLowerCase() + '_upload',
            attrs: { type: 'File', name: 'UploadFiles' }
        });

        // Create popup based on type
        this.popupObj = new Popup(popupElement, {
            relateTo: element,
            viewPortElement: this.parent.inputElement,
            zIndex: 10001,
            content: uploadEle,
            enableRtl: this.parent.enableRtl,
            height: '85px',
            width: '300px',
            actionOnScroll: 'none',
            close: () => {
                this.parent.isBlur = false;
                if (this.popupObj) {
                    this.popupObj.destroy();
                    detach(this.popupObj.element);
                    this.popupObj = null;
                }
                if (!this.parent.inlineMode.enable && this.parent.toolbarModule && this.parent.toolbarModule.baseToolbar) {
                    this.parent.toolbarModule.baseToolbar.toolbarObj.disable(false);
                }
            }
        });

        this.popupObj.element.style.display = 'none';
        addClass([this.popupObj.element], classes.CLS_POPUP_OPEN);
        addClass([this.popupObj.element], classes.CLS_RTE_UPLOAD_POPUP);

        // Add type-specific class
        switch (type) {
        case 'Images':
            this.popupObj.element.classList.add(classes.CLS_RTE_IMAGE_UPLOAD_POPUP);
            break;
        case 'Videos':
            this.popupObj.element.classList.add(classes.CLS_RTE_VIDEO_UPLOAD_POPUP);
            break;
        case 'Audios':
            this.popupObj.element.classList.add(classes.CLS_RTE_AUDIO_UPLOAD_POPUP);
            break;
        }

        if (!isNOU(this.parent.cssClass)) {
            addClass([this.popupObj.element], this.parent.cssClass.replace(/\s+/g, ' ').trim().split(' '));
        }

        return this.popupObj;
    }

    /**
     * Creates and initializes an uploader for the specified media type
     *
     * @param {MediaType} type - Type of media (Image, Video, Audio)
     * @param {DragEvent} dragEvent - Drag event data
     * @param {HTMLElement} [mediaElement] - Optional media element for upload
     * @param {HTMLElement} target - Target element to append uploader
     * @returns {Uploader} - Returns the created uploader
     * @hidden
     */
    public createUploader(type: MediaType, dragEvent: DragEvent, mediaElement: HTMLElement, target: HTMLElement): Uploader {
        let isUploading: boolean = false;
        let allowedExtensions: string = '';
        let saveUrl: string;
        let removeUrl: string;
        let maxFileSize: number;

        // Get settings based on type
        switch (type) {
        case 'Images':
            allowedExtensions = this.parent.insertImageSettings.allowedTypes.toString();
            saveUrl = this.parent.insertImageSettings.saveUrl;
            removeUrl = this.parent.insertImageSettings.removeUrl;
            maxFileSize = this.parent.insertImageSettings.maxFileSize;
            break;
        case 'Videos':
            allowedExtensions = this.parent.insertVideoSettings.allowedTypes.toString();
            saveUrl = this.parent.insertVideoSettings.saveUrl;
            removeUrl = this.parent.insertVideoSettings.removeUrl;
            maxFileSize = this.parent.insertVideoSettings.maxFileSize;
            break;
        case 'Audios':
            allowedExtensions = this.parent.insertAudioSettings.allowedTypes.toString();
            saveUrl = this.parent.insertAudioSettings.saveUrl;
            removeUrl = this.parent.insertAudioSettings.removeUrl;
            maxFileSize = this.parent.insertAudioSettings.maxFileSize;
            break;
        }

        // Create uploader with standard configuration
        this.uploadObj = new Uploader({
            asyncSettings: {
                saveUrl: saveUrl,
                removeUrl: removeUrl
            },
            cssClass: classes.CLS_RTE_DIALOG_UPLOAD + this.parent.getCssClass(true),
            dropArea: this.parent.element,
            allowedExtensions: allowedExtensions,
            maxFileSize: maxFileSize,
            multiple: false,
            enableRtl: this.parent.enableRtl,

            removing: () => {
                this.parent.inputElement.contentEditable = 'true';
                isUploading = false;
                if (mediaElement) {
                    detach(mediaElement);
                }
                if (this.popupObj) {
                    this.popupObj.close();
                }
            },
            canceling: () => {
                this.parent.inputElement.contentEditable = 'true';
                isUploading = false;
                if (mediaElement) {
                    detach(mediaElement);
                }
                if (this.popupObj) {
                    this.popupObj.close();
                }
                // Handle all media type quickToolbars
                if (this.parent.quickToolbarModule) {
                    if (type === 'Images' && this.parent.quickToolbarModule.imageQTBar) {
                        this.parent.quickToolbarModule.imageQTBar.hidePopup();
                    } else if (type === 'Videos' && this.parent.quickToolbarModule.videoQTBar) {
                        this.parent.quickToolbarModule.videoQTBar.hidePopup();
                    } else if (type === 'Audios' && this.parent.quickToolbarModule.audioQTBar) {
                        this.parent.quickToolbarModule.audioQTBar.hidePopup();
                    }
                }
                this.uploadCancelTime = setTimeout(() => {
                    if (this.uploadObj && !this.uploadObj.isDestroyed) {
                        this.uploadObj.destroy();
                    }
                }, 900);
            },
            beforeUpload: (args: BeforeUploadEventArgs) => {
                const eventName: string = type === 'Images' ? events.beforeImageUpload : events.beforeFileUpload;
                this.parent.trigger(eventName, args);
                if (!this.parent.inlineMode.enable && this.parent.toolbarModule && this.parent.toolbarModule.baseToolbar) {
                    this.parent.toolbarModule.baseToolbar.toolbarObj.disable(true);
                }
            },
            uploading: (args: UploadingEventArgs) => {
                if (!this.parent.isServerRendered) {
                    isUploading = true;
                    const eventName: string = type === 'Images' ? events.imageUploading : events.fileUploading;
                    this.parent.trigger(eventName, args, (uploadingArgs: UploadingEventArgs) => {
                        if (uploadingArgs.cancel) {
                            if (mediaElement && !isNOU(mediaElement)) {
                                detach(mediaElement);
                            }
                            if (this.popupObj && this.popupObj.element && !isNOU(this.popupObj.element)) {
                                detach(this.popupObj.element);
                            }
                        } else {
                            this.parent.inputElement.contentEditable = 'false';
                        }
                    });
                }
            },
            selected: (args: SelectedEventArgs) => {
                if (isUploading) {
                    args.cancel = true;
                }
            },
            failure: (args: FailureEventArgs) => {
                isUploading = false;
                this.parent.inputElement.contentEditable = 'true';
                const popupArgs: IShowPopupArgs = {
                    args: dragEvent as MouseEvent,
                    type: type,
                    isNotify: undefined,
                    elements: mediaElement
                };

                this.uploadFailureTime = setTimeout(() => {
                    this.uploadFailure(mediaElement, popupArgs, args);
                }, 900);
            },
            success: (args: SuccessEventArgs) => {
                if (args.operation === 'cancel') {
                    return;
                }
                isUploading = false;
                this.parent.inputElement.contentEditable = 'true';
                const popupArgs: IShowPopupArgs = {
                    args: dragEvent as MouseEvent,
                    type: type,
                    isNotify: undefined,
                    elements: mediaElement
                };
                let imageArgs: ImageSuccessEventArgs;
                let mediaArgs: MediaSuccessEventArgs;
                if (type === 'Images') {
                    imageArgs = {
                        e: args.e,
                        file: args.file,
                        statusText: args.statusText,
                        operation: args.operation,
                        response: args.response,
                        element: mediaElement,
                        detectImageSource: ImageInputSource.Dropped
                    };
                } else {
                    mediaArgs = {
                        e: args.e,
                        file: args.file,
                        statusText: args.statusText,
                        operation: args.operation,
                        response: args.response,
                        element: mediaElement,
                        detectMediaSource: MediaInputSource.Dropped
                    };
                }
                this.uploadSuccessTime = setTimeout(() => {
                    // Cast args based on the type of media
                    if (type === 'Images') {
                        this.uploadSuccess(mediaElement, dragEvent, popupArgs, imageArgs);
                    } else if (type === 'Videos' || type === 'Audios') {
                        this.uploadSuccess(mediaElement, dragEvent, popupArgs, mediaArgs);
                    }
                }, 900);
            }
        });
        this.uploadObj.appendTo(target);
        return this.uploadObj;
    }

    /**
     * Called when drop upload fails
     *
     * @param {HTMLElement} mediaEle - The media element
     * @param {IShowPopupArgs} args - Popup arguments
     * @param {FailureEventArgs} e - Failure event arguments
     * @returns {void}
     * @hidden
     */
    public uploadFailure(mediaEle: HTMLElement, args: IShowPopupArgs, e: FailureEventArgs): void {
        if (mediaEle) {
            detach(mediaEle);
        }
        if (this.popupObj) {
            this.popupObj.close();
        }
        // Trigger appropriate event based on type
        const eventName: string = args.type === 'Images' ? events.imageUploadFailed : events.fileUploadFailed;
        this.parent.trigger(eventName, e);
        if (this.uploadObj && !this.uploadObj.isDestroyed) {
            this.uploadObj.destroy();
        }
    }

    /**
     * Called when upload is successful
     *
     * @param {HTMLElement} mediaElement - The media element
     * @param {DragEvent} dragEvent - The drag event
     * @param {IShowPopupArgs} args - Popup arguments
     * @param {ImageSuccessEventArgs | MediaSuccessEventArgs} e - Success event arguments
     * @returns {void}
     * @hidden
     */
    public uploadSuccess(mediaElement: HTMLElement, dragEvent: DragEvent, args: IShowPopupArgs,
                         e: ImageSuccessEventArgs | MediaSuccessEventArgs): void {
        if (e.operation === 'cancel') {
            return;
        }
        mediaElement.style.opacity = '1';
        // Add appropriate class based on media type
        switch (args.type) {
        case 'Images':
            mediaElement.classList.add(CLS_IMG_FOCUS);
            break;
        case 'Videos':
        case 'Audios': {
            const focusClass: string = args.type === 'Videos' ? CLS_VID_FOCUS : CLS_AUD_FOCUS;
            mediaElement.classList.add(focusClass);
            break;
        }
        }
        // Trigger appropriate event based on type
        const eventName: string = args.type === 'Images' ? events.imageUploadSuccess : events.fileUploadSuccess;

        this.parent.trigger(eventName, e, (responseData: object) => {
            if (mediaElement && (responseData as MetaData).file) {
                const fileName: string = (responseData as MetaData).file.name;

                switch (args.type) {
                case 'Images':
                    if (!isNOU(this.parent.insertImageSettings.path)) {
                        const url: string = this.parent.insertImageSettings.path + fileName;
                        (mediaElement as HTMLImageElement).src = url;
                        mediaElement.setAttribute('alt', fileName);
                    }
                    break;
                case 'Videos':
                    if (!isNOU(this.parent.insertVideoSettings.path)) {
                        const url: string = this.parent.insertVideoSettings.path + fileName;
                        // Find source element and update its src attribute
                        const sourceElement: HTMLElement = mediaElement.querySelector('source');
                        if (sourceElement) {
                            sourceElement.setAttribute('src', url);

                            // Update MIME type
                            const fileExtension: string = fileName.split('.').pop().toLowerCase();
                            sourceElement.setAttribute('type', 'video/' + fileExtension);

                            // Reset opacity
                            mediaElement.style.opacity = '1';
                        }
                    }
                    break;
                case 'Audios':
                    if (!isNOU(this.parent.insertAudioSettings.path)) {
                        const url: string = this.parent.insertAudioSettings.path + fileName;
                        // Find source element and update its src attribute
                        const sourceElement: HTMLElement = mediaElement.querySelector('source');
                        if (sourceElement) {
                            sourceElement.setAttribute('src', url);

                            // Update MIME type
                            const fileExtension: string = fileName.split('.').pop().toLowerCase();
                            sourceElement.setAttribute('type', 'audio/' + fileExtension);

                            // Reset opacity and reload video
                            mediaElement.style.opacity = '1';
                            (mediaElement as HTMLAudioElement).load();
                        }
                    }
                    break;
                }
            }
        });
        if (this.popupObj) {
            this.popupObj.close();
        }
        if (this.uploadObj && !this.uploadObj.isDestroyed) {
            this.uploadObj.destroy();
        }

        // Show appropriate quick toolbar and handle element based on type
        if (args.type === 'Images') {
            this.parent.notify(events.insertCompleted, args);
            if (this.parent.insertImageSettings.resize) {
                this.parent.notify(events.resizeStart, {
                    event: (dragEvent as MouseEvent) as PointerEvent,
                    element: mediaElement
                }); }
        } else if (args.type === 'Videos') {
            this.parent.notify(events.insertCompleted, args);
            setTimeout(() => {
                this.parent.notify(events.resizeStart, {
                    event: (dragEvent as MouseEvent) as PointerEvent,
                    element: mediaElement as HTMLVideoElement
                });
            }, 100);
        } else if (args.type === 'Audios') {
            this.parent.notify(events.insertCompleted, args);
        }
    }

    /**
     * Refreshes popup position relative to element
     *
     * @param {HTMLElement} targetElement - Element to position popup relative to
     * @returns {void}
     * @hidden
     */
    public refreshPopup(targetElement: HTMLElement): void {
        const targetPosition: number = this.parent.iframeSettings.enable ?
            this.parent.element.offsetTop + targetElement.offsetTop : targetElement.offsetTop;
        const rtePosition: number = this.parent.element.offsetTop + this.parent.element.offsetHeight;
        if (targetPosition > rtePosition) {
            this.popupObj.offsetY = this.parent.iframeSettings.enable ? -30 : -65;
            this.popupObj.element.style.display = 'block';
        } else {
            if (this.popupObj) {
                this.popupObj.refreshPosition(targetElement);
                this.popupObj.element.style.display = 'block';
            }
        }
    }

    /**
     * Destroys popup and uploader
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        if (this.isDestroyed) { return; }

        if (!isNOU(this.uploadCancelTime)) {
            clearTimeout(this.uploadCancelTime);
            this.uploadCancelTime = null;
        }
        if (!isNOU(this.uploadFailureTime)) {
            clearTimeout(this.uploadFailureTime);
            this.uploadFailureTime = null;
        }
        if (!isNOU(this.uploadSuccessTime)) {
            clearTimeout(this.uploadSuccessTime);
            this.uploadSuccessTime = null;
        }

        if (this.popupObj && !this.popupObj.isDestroyed) {
            this.popupObj.destroy();
            detach(this.popupObj.element);
            this.popupObj = null;
        }
        if (this.uploadObj && !this.uploadObj.isDestroyed) {
            this.uploadObj.destroy();
            detach(this.uploadObj.element);
            this.uploadObj = null;
        }
        this.isDestroyed = true;
    }
}
