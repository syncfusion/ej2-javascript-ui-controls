import { addClass, detach, extend, isNullOrUndefined as isNOU, getComponent, getUniqueID } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';
import { BeforeUploadEventArgs, MetaData, SelectedEventArgs, SuccessEventArgs, FailureEventArgs, Uploader, UploadingEventArgs, FileInfo } from '@syncfusion/ej2-inputs';
import * as classes from '../base/classes';
import * as events from '../base/constant';
import { MediaType } from '../../common/types';
import { IRichTextEditor } from '../base/interface';
import { PopupRootBound } from '../../rich-text-editor/base/interface';
import { IShowPopupArgs } from '../../common/interface';
import { ImageInputSource, MediaInputSource  } from '../../common/enum';
import { ImageSuccessEventArgs, MediaSuccessEventArgs } from '../../common/interface';
import { CLS_IMG_FOCUS, CLS_AUD_FOCUS, CLS_VID_FOCUS} from '../../common/constant';
import { PasteCleanup } from '../actions';


export class PopupUploader {
    private parent: IRichTextEditor;
    private rteID: string;
    private isDestroyed: boolean = false;
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
        popupElement.setAttribute('id', getUniqueID(this.rteID + '_' + type.toLowerCase() + '_upload_popup'));
        this.parent.rootContainer.appendChild(popupElement);
        const boundObj: PopupRootBound = { popupRoot: popupElement, self: this };
        const uploadEle: HTMLInputElement | HTMLElement = this.parent.createElement('input', {
            id: getUniqueID(this.rteID + '_' + type.toLowerCase() + '_upload'),
            attrs: { type: 'File', name: 'UploadFiles' }
        });

        // Create popup based on type
        const popup: Popup = new Popup(popupElement, {
            relateTo: element,
            viewPortElement: this.parent.inputElement,
            zIndex: 10001,
            content: uploadEle,
            enableRtl: this.parent.enableRtl,
            height: '85px',
            width: '300px',
            actionOnScroll: 'none',
            close: this.onPopupClose.bind(boundObj)
        });

        popup.element.style.display = 'none';
        addClass([popup.element], classes.CLS_POPUP_OPEN);
        addClass([popup.element], classes.CLS_RTE_UPLOAD_POPUP);

        // Add type-specific class
        switch (type) {
        case 'Images':
            popup.element.classList.add(classes.CLS_RTE_IMAGE_UPLOAD_POPUP);
            break;
        case 'Videos':
            popup.element.classList.add(classes.CLS_RTE_VIDEO_UPLOAD_POPUP);
            break;
        case 'Audios':
            popup.element.classList.add(classes.CLS_RTE_AUDIO_UPLOAD_POPUP);
            break;
        }

        if (!isNOU(this.parent.cssClass)) {
            addClass([popup.element], this.parent.cssClass.replace(/\s+/g, ' ').trim().split(' '));
        }

        return popup;
    }

    /**
     * Creates and initializes an uploader for the specified media type
     *
     * @param {MediaType} type - Type of media (Image, Video, Audio)
     * @param {DragEvent} dragEvent - Drag event data
     * @param {HTMLElement} [mediaElement] - Optional media element for upload
     * @param {HTMLElement} target - Target element to append uploader
     * @param {Popup} popup - Uploader popup object
     * @returns {Uploader} - Returns the created uploader
     * @hidden
     */
    public createUploader(
        type: MediaType, dragEvent: DragEvent, mediaElement: HTMLElement, target: HTMLElement, popup: Popup): Uploader {
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
        const uploader: Uploader = new Uploader({
            asyncSettings: {
                saveUrl: saveUrl,
                removeUrl: removeUrl
            },
            cssClass: classes.CLS_RTE_DIALOG_UPLOAD + this.parent.getCssClass(true),
            allowedExtensions: allowedExtensions,
            maxFileSize: maxFileSize,
            multiple: false,
            enableRtl: this.parent.enableRtl,

            removing: () => {
                isUploading = false;
                if (mediaElement) {
                    detach(mediaElement);
                }
                if (popup) {
                    popup.close();
                    this.enableToolbarItems();
                }
            },
            canceling: () => {
                isUploading = false;
                if (mediaElement) {
                    detach(mediaElement);
                }
                if (popup) {
                    popup.close();
                    this.enableToolbarItems();
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
                            if (popup && popup.element && !isNOU(popup.element)) {
                                detach(popup.element);
                            }
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
                const popupArgs: IShowPopupArgs = {
                    args: dragEvent as MouseEvent,
                    type: type,
                    isNotify: undefined,
                    elements: mediaElement
                };

                this.uploadFailureTime = setTimeout(() => {
                    this.uploadFailure(mediaElement, popupArgs, args, popup);
                }, 900);
            },
            success: (args: SuccessEventArgs) => {
                if (args.operation === 'cancel') {
                    return;
                }
                isUploading = false;
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
                        this.uploadSuccess(mediaElement, dragEvent, popupArgs, imageArgs, popup);
                    } else if (type === 'Videos' || type === 'Audios') {
                        this.uploadSuccess(mediaElement, dragEvent, popupArgs, mediaArgs, popup);
                    }
                }, 900);
            }
        });
        uploader.appendTo(target);
        const file: File = dragEvent.dataTransfer.files[0];
        const fileInfo: FileInfo[] = [{
            name: file.name,
            rawFile: file,
            size: file.size,
            type: file.type,
            status: 'Ready to Upload',
            validationMessages: { minSize: '', maxSize: ''},
            statusCode: '1'
        }];
        uploader.createFileList(fileInfo);
        uploader.upload(fileInfo);
        return uploader;
    }

    /**
     * Called when drop upload fails
     *
     * @param {HTMLElement} mediaEle - The media element
     * @param {IShowPopupArgs} args - Popup arguments
     * @param {FailureEventArgs} e - Failure event arguments
     * @param {Popup} popup - Uploader popup object
     * @returns {void}
     * @hidden
     */
    public uploadFailure(mediaEle: HTMLElement, args: IShowPopupArgs, e: FailureEventArgs, popup: Popup): void {
        // Trigger appropriate event based on type
        const eventName: string = args.type === 'Images' ? events.imageUploadFailed : events.fileUploadFailed;
        this.parent.trigger(eventName, e);
        if (!isNOU(mediaEle) && !isNOU(popup)) {
            detach(mediaEle);
            popup.close();
            this.enableToolbarItems();
        } else {
            return;
        }
    }

    /**
     * Called when upload is successful
     *
     * @param {HTMLElement} mediaElement - The media element
     * @param {DragEvent} dragEvent - The drag event
     * @param {IShowPopupArgs} args - Popup arguments
     * @param {ImageSuccessEventArgs | MediaSuccessEventArgs} e - Success event arguments
     * @param {Popup} popup - Uploader popup object
     * @returns {void}
     * @hidden
     */
    public uploadSuccess(mediaElement: HTMLElement, dragEvent: DragEvent, args: IShowPopupArgs,
                         e: ImageSuccessEventArgs | MediaSuccessEventArgs, popup: Popup): void {
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
        if (popup) {
            popup.close();
            this.enableToolbarItems();
        }

        // Show appropriate quick toolbar and handle element based on type
        if (args.type === 'Images') {
            this.parent.notify(events.insertCompleted, args);
            if (this.parent.insertImageSettings.resize) {
                this.parent.notify(events.resizeStart, {
                    event: (dragEvent as MouseEvent) as PointerEvent,
                    target: mediaElement
                }); }
        } else if (args.type === 'Videos') {
            this.parent.notify(events.insertCompleted, args);
            setTimeout(() => {
                this.parent.notify(events.resizeStart, {
                    event: (dragEvent as MouseEvent) as PointerEvent,
                    target: mediaElement as HTMLVideoElement
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
     * @param {Popup} popup - Uploader popup object
     * @returns {void}
     * @hidden
     */
    public refreshPopup(targetElement: HTMLElement, popup: Popup): void {
        const targetPosition: number = this.parent.iframeSettings.enable ?
            this.parent.element.offsetTop + targetElement.offsetTop : targetElement.offsetTop;
        const rtePosition: number = this.parent.element.offsetTop + this.parent.element.offsetHeight;
        if (targetPosition > rtePosition) {
            popup.offsetY = this.parent.iframeSettings.enable ? -30 : -65;
            popup.element.style.display = 'block';
        } else {
            if (popup) {
                popup.refreshPosition(targetElement);
                popup.element.style.display = 'block';
            }
        }
    }

    private enableToolbarItems(): void {
        const mediaPopups: NodeListOf<Element> = this.parent.element.querySelectorAll('.e-rte-upload-popup');
        if (!this.parent.inlineMode.enable && this.parent.toolbarModule &&
            this.parent.toolbarModule.baseToolbar && mediaPopups.length === 0) {
            this.parent.toolbarModule.baseToolbar.toolbarObj.disable(false);
        }
    }

    private onPopupClose(): void {
        const currentPopupElem : HTMLElement = (this as unknown as PopupRootBound).popupRoot;
        const currentPopupUploderObj : PopupUploader | PasteCleanup = (this as unknown as PopupRootBound).self;
        if (!isNOU(currentPopupElem ) && !isNOU(currentPopupUploderObj )) {
            const popupObj: Popup = getComponent(currentPopupElem , 'popup') as Popup;
            (currentPopupUploderObj  as PopupUploader).parent.isBlur = false;
            if (isNOU(popupObj)) { return; }
            const uploaderObj: Uploader = (currentPopupUploderObj as PopupUploader).getUploaderInstance(currentPopupElem);
            if (isNOU(uploaderObj)) { return; }
            uploaderObj.destroy();
            popupObj.destroy();
            detach(currentPopupElem);
        }
    }

    private getUploaderInstance(element: HTMLElement): Uploader {
        const currentUploader: HTMLElement = element.querySelector('.e-uploader') as HTMLElement;
        return getComponent(currentUploader, 'uploader');
    }

    /**
     * Destroys popup and uploader
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        if (this.isDestroyed) { return; }
        if (!isNOU(this.uploadFailureTime)) {
            clearTimeout(this.uploadFailureTime);
            this.uploadFailureTime = null;
        }
        if (!isNOU(this.uploadSuccessTime)) {
            clearTimeout(this.uploadSuccessTime);
            this.uploadSuccessTime = null;
        }
        const mediaPopups: NodeListOf<Element> = this.parent.element.querySelectorAll('.e-rte-upload-popup');
        for (let i: number = 0; i < mediaPopups.length; i++) {
            const uploader: Uploader = this.getUploaderInstance(mediaPopups[i as number] as HTMLElement);
            if (uploader && !uploader.isDestroyed) {
                uploader.destroy();
            }
            const popup: Popup = getComponent(mediaPopups[i as number] as HTMLElement, 'popup') as Popup;
            if (popup && !popup.isDestroyed) {
                popup.destroy();
            }
        }
        this.isDestroyed = true;
    }
}
