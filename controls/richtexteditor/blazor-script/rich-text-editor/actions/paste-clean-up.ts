import { getUniqueID, Browser, detach, extend, addClass, createElement, isNullOrUndefined as isNOU, closest } from '../../../base'; /*externalscript*/
import { Popup } from '../../../popups/src'; /*externalscript*/
import { MetaData, UploadingEventArgs, SelectedEventArgs, FileInfo, BeforeUploadEventArgs, UploaderModel } from '../../../inputs/src'; /*externalscript*/
import * as events from '../constant';
import * as classes from '../classes';
import { sanitizeHelper } from '../util';
import { MS_WORD_CLEANUP } from '../constant';
import { IHtmlFormatterCallBack } from '../../src/common';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { NodeSelection } from '../../src/selection/selection';
import { CLS_RTE_DIALOG_UPLOAD } from '../classes';
import { CLS_RTE_IMAGE, CLS_IMGINLINE, CLS_IMGBREAK } from '../classes';
import { NotifyArgs, ImageUploadingEventArgs, CleanupResizeElemArgs, ImageSuccessEventArgs, IPasteModel, CropImageDataItem } from '../../src/common/interface';
import { RteUploader } from '../renderer/uploader';
import { cleanHTMLString, scrollToCursor } from '../../src/common/util';
import { ImageInputSource } from '../../src/common/enum';
import { PasteCleanupAction } from '../../src/editor-manager/plugin/paste-clean-up-action';
/**
 * PasteCleanup module for handling content pasted into the RichTextEditor
 */
export class PasteCleanup {
    private pasteObj: PasteCleanupAction;
    private popupObj: Popup;
    private currentArgs: Object;
    private rawFile: FileInfo[];
    private currentValue: string;
    private preRTEHeight: string;
    private newRTEHeight: string;
    private uploadObj: RteUploader;
    private uploadImgElem: Element;
    private uploadImgElements: Map<string, Element> = new Map()
    private parent: SfRichTextEditor;
    private saveSelection: NodeSelection;
    private containsHtml: boolean = false;
    private cropImageData: CropImageDataItem[] = [];
    private refreshPopupTime: number;
    private isNotFromHtml: boolean = false;
    private nodeSelectionObj: NodeSelection;
    private pastedValue: string = '';
    private isClipboardHTMLDataNull: boolean = false;

    private inlineNode: string[] = ['a', 'abbr', 'acronym', 'audio', 'b', 'bdi', 'bdo', 'big', 'br', 'button',
        'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'font', 'i', 'iframe', 'img', 'input',
        'ins', 'kbd', 'label', 'map', 'mark', 'meter', 'noscript', 'object', 'output', 'picture', 'progress',
        'q', 'ruby', 's', 'samp', 'script', 'select', 'slot', 'small', 'span', 'strong', 'sub', 'sup', 'svg',
        'template', 'textarea', 'time', 'u', 'tt', 'var', 'video', 'wbr'];
    private blockNode: string[] = ['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'address', 'blockquote', 'button', 'center', 'dd', 'dir', 'dl', 'dt', 'fieldset',
        'frameset', 'hr', 'iframe', 'isindex', 'li', 'map', 'menu', 'noframes', 'noscript',
        'object', 'ol', 'pre', 'td', 'tr', 'th', 'tbody', 'tfoot', 'thead', 'table', 'ul',
        'header', 'article', 'nav', 'footer', 'section', 'aside', 'main', 'figure', 'figcaption'];

    /* Creates an instance of PasteCleanup */
    constructor(parent?: SfRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }

    /* Attaches event listeners to the parent component's observer */
    private addEventListener(): void {
        this.nodeSelectionObj = new NodeSelection(this.parent.inputElement);
        this.parent.observer.on(events.success, this.success, this);
        this.parent.observer.on(events.failure, this.failure, this);
        this.parent.observer.on(events.selected, this.selected, this);
        this.parent.observer.on(events.uploading, this.uploading, this);
        this.parent.observer.on(events.pasteClean, this.pasteClean, this);
        this.parent.observer.on(events.removing, this.cancelingAndRemoving, this);
        this.parent.observer.on(events.canceling, this.cancelingAndRemoving, this);
        this.parent.observer.on(events.beforePasteUpload, this.beforeImageUpload, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
        this.parent.observer.on(events.afterPasteCleanUp, this.pasteUpdatedValue, this);
        this.parent.observer.on(events.docClick, this.docClick, this);
        this.parent.observer.on(events.bindOnEnd, this.bindOnEnd, this);
    }

    /* Cleans up resources and removes event listeners */
    private destroy(): void {
        if (this.refreshPopupTime) { clearTimeout(this.refreshPopupTime); this.refreshPopupTime = null; }
        this.removeEventListener();
    }

    /* Removes all event listeners from the parent component's observer */
    private removeEventListener(): void {
        this.parent.observer.off(events.success, this.success);
        this.parent.observer.off(events.failure, this.failure);
        this.parent.observer.off(events.selected, this.selected);
        this.parent.observer.off(events.uploading, this.uploading);
        this.parent.observer.off(events.pasteClean, this.pasteClean);
        this.parent.observer.off(events.removing, this.cancelingAndRemoving);
        this.parent.observer.off(events.canceling, this.cancelingAndRemoving);
        this.parent.observer.off(events.beforePasteUpload, this.beforeImageUpload);
        this.parent.observer.off(events.destroy, this.destroy);
        this.parent.observer.off(events.afterPasteCleanUp, this.pasteUpdatedValue);
        this.parent.observer.off(events.docClick, this.docClick);
        this.parent.observer.off(events.bindOnEnd, this.bindOnEnd);
    }
    /*
     * Initializes the PasteCleanupAction  object in the editor manager after editor initialization is complete.
     * This method binds the paste cleanup module to the editor's formatter for handling paste cleanup related operations.
     */
    private bindOnEnd(): void {
        if (this.parent.editorMode === 'HTML' && this.parent.formatter && this.parent.formatter.editorManager) {
            // Create TableCommand with table model containing required methods
            const pasteModel: IPasteModel = {
                rteElement: this.parent.element,
                enterKey: this.parent.enterKey,
                rootContainer: this.parent.rootContainer,
                enableXhtml: this.parent.enableXhtml,
                iframeSettings: this.parent.iframeSettings,
                pasteCleanupSettings: this.parent.pasteCleanupSettings,
                insertImageSettings: this.parent.insertImageSettings,
                // Retrieves the maximum allowed width for an image within the editor.
                getInsertImgMaxWidth: () => {
                    return this.parent.getInsertImgMaxWidth();
                },
                // Method for retrieving the document object of the content module
                getDocument: () => {
                    return this.parent.getDocument();
                },
                // Method for retrieving the editable element object of the content module
                getEditPanel: () => {
                    return this.parent.getEditPanel();
                },
                // Updates the editor value
                updateValue: () => {
                    this.parent.updateValueData();
                },
                // Handles image uploading
                imageUpload: () => {
                    this.imgUploading(this.parent.inputElement);
                },
                // Returns crop image data
                getCropImageData: () => {
                    return this.getCropImageData();
                }
            };
            this.parent.formatter.editorManager.pasteObj = this.pasteObj =
                new PasteCleanupAction(this.parent.formatter.editorManager, pasteModel);
        }
    }

    /* Returns the current crop image data */
    private getCropImageData(): CropImageDataItem[] {
        return this.cropImageData;
    }

    /* Handles the paste cleanup process for content pasted into the editor */
    private pasteClean(e?: NotifyArgs): void {
        this.isClipboardHTMLDataNull = false;
        const args: { [key: string]: string | NotifyArgs } = {
            requestType: 'Paste',
            editorMode: this.parent.editorMode,
            event: e
        };
        // Early return if required conditions aren't met
        if (!e.args || this.parent.editorMode !== 'HTML') {
            return;
        }
        // Extract clipboard data
        let value: string = null;
        if (!isNOU((e.args as ClipboardEvent).clipboardData)) {
            value = (e.args as ClipboardEvent).clipboardData.getData('text/html');
        }
        let file: File;
        if (value !== null) {
            if (value.length === 0) {
                // Define the type for the result
                const result: { value: string; file: File } = this.handlePlainTextPaste(e, args);
                value = result.value;
                file = result.file;
            } else if (value.length > 0) {
                value = this.handleHtmlPaste(e, args, value);
            }
        }
        this.processPastedValue(e, args, value, file);
    }

    /* Handles plain text paste from clipboard */
    private handlePlainTextPaste(e: NotifyArgs, args: Record<string, string | NotifyArgs>): { value: string; file: File } {
        const htmlRegex: RegExp = new RegExp(/<\/[a-z][\s\S]*>/i);
        // Get plain text from clipboard
        let value: string = (e.args as ClipboardEvent).clipboardData.getData('text/plain');
        // Invoke before paste cleanup if enabled
        if (this.parent.beforePasteCleanupEnabled) {
            this.parent.dotNetRef.invokeMethodAsync('BeforePasteCleanUp', { value });
        }
        this.isNotFromHtml = value !== '' ? true : false;
        // Escape HTML characters
        value = value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        this.containsHtml = htmlRegex.test(value);
        // Extract file from clipboard if present
        const file: File = this.pasteObj.extractFileFromClipboard(e);
        // Notify paste event
        value = this.notifyPasteEvent(e, args, value, file);
        // Handle non-HTML content
        if (!htmlRegex.test(value)) {
            const divElement: HTMLElement = createElement('div');
            divElement.innerHTML = this.pasteObj.splitBreakLine(value);
            value = divElement.innerHTML;
            this.isClipboardHTMLDataNull = true;
        }
        return { value, file };
    }

    /* Notifies the paste event and processes callbacks */
    private notifyPasteEvent(e: NotifyArgs, args: object, value: string, file: File): string {
        let imageproperties: string | object;
        let resultValue: string = value;
        this.parent.observer.notify(events.paste, {
            file: file,
            args: e.args,
            text: value,
            callBack: (b: string | object) => {
                imageproperties = b;
                if (typeof imageproperties === 'object') {
                    this.parent.formatter.editorManager.execCommand(
                        'Images',
                        'Image',
                        e.args,
                        this.imageFormatting.bind(this, args),
                        'pasteCleanup',
                        imageproperties,
                        'pasteCleanupModule'
                    );
                } else {
                    resultValue = imageproperties as string;
                }
            }
        });
        return resultValue;
    }

    /* Handles HTML content pasted from clipboard */
    private handleHtmlPaste(e: NotifyArgs, args: Record<string, string | NotifyArgs>, value: string): string {
        // Invoke before paste cleanup if enabled
        if (this.parent.beforePasteCleanupEnabled) {
            this.parent.dotNetRef.invokeMethodAsync('BeforePasteCleanUp', { value });
        }
        // Notify MS Word cleanup
        this.parent.formatter.editorManager.observer.notify(MS_WORD_CLEANUP, {
            args: e.args,
            text: e.text,
            allowedStylePropertiesArray: this.parent.pasteCleanupSettings.allowedStyleProps,
            callBack: (a: string, cropImageData: Record<string, string | boolean | number>[], pasteTableSource?: string) => {
                value = a.trim();
                args.pasteTableSource = pasteTableSource;
                this.cropImageData = cropImageData;
            }
        });
        return value;
    }

    /* Processes the pasted value and determines how to handle it */
    private processPastedValue(e: NotifyArgs, args: Record<string, string | NotifyArgs>, value: string, file: File): void {
        // Remove base tags
        if (value !== null && value !== '') {
            value = value.replace(/<base[^>]*>/g, '');
        }
        // Save current selection
        const currentDocument: Document = this.parent.getDocument();
        const range: Range = this.nodeSelectionObj.getRange(currentDocument);
        this.saveSelection = this.nodeSelectionObj.save(range, currentDocument);
        // Check if value is not empty
        const tempDivElem: HTMLElement = createElement('div');
        tempDivElem.innerHTML = value;
        const isValueNotEmpty: boolean = tempDivElem.textContent !== '' ||
            !isNOU(tempDivElem.querySelector('img')) || !isNOU(tempDivElem.querySelector('table'));
        // Cleanup resize elements
        value = this.cleanupResizeElements(value);
        // Clean HTML string
        if (!isNOU(value)) {
            value = cleanHTMLString(value, this.parent.element);
        }
        // Determine paste handling method based on settings
        this.determinePasteHandlingMethod(e, args, value, isValueNotEmpty, file);
    }

    /* Cleans up resize elements in the pasted content */
    private cleanupResizeElements(value: string): string {
        let resultValue: string = value;
        this.parent.observer.notify(events.cleanupResizeElements, {
            value: value,
            callBack: (currentValue: string) => {
                resultValue = currentValue;
            }
        } as CleanupResizeElemArgs);
        return resultValue;
    }

    /* Determines which paste handling method to use based on settings and content */
    private determinePasteHandlingMethod(
        e: NotifyArgs,
        args: Record<string, string | NotifyArgs>,
        value: string,
        isValueNotEmpty: boolean,
        file: File
    ): void {
        const isFirefox: boolean = Browser.userAgent.indexOf('Firefox') !== -1;
        if (this.parent.pasteCleanupSettings.prompt && !e.isPlainPaste) {
            if (isValueNotEmpty) {
                (e.args as ClipboardEvent).preventDefault();
                this.pasteDialog(value, args);
            } else if (isFirefox && isNOU(file)) {
                this.fireFoxImageUpload();
            }
        } else if (!isValueNotEmpty && !this.parent.pasteCleanupSettings.plainText && isFirefox) {
            (e.args as ClipboardEvent).preventDefault();
            this.fireFoxImageUpload();
        } else if (this.parent.pasteCleanupSettings.plainText) {
            (e.args as ClipboardEvent).preventDefault();
            this.plainFormatting(value, args);
        } else if (this.parent.pasteCleanupSettings.keepFormat || e.isPlainPaste) {
            (e.args as ClipboardEvent).preventDefault();
            this.formatting(value, false, args);
        } else {
            (e.args as ClipboardEvent).preventDefault();
            this.formatting(value, true, args);
        }
    }

    /* Handles special case for Firefox image uploads */
    private fireFoxImageUpload(): void {
        setTimeout(() => {
            if (Browser.userAgent.indexOf('Firefox') === -1) {
                return;
            }
            // Get current focus node
            let currentFocusNode: Node = this.nodeSelectionObj.getRange(document).startContainer;
            if (currentFocusNode.nodeName !== '#text') {
                currentFocusNode = currentFocusNode.childNodes[this.nodeSelectionObj.getRange(document).startOffset];
            }
            // Check if previous sibling is an image
            if (currentFocusNode.previousSibling && currentFocusNode.previousSibling.nodeName === 'IMG') {
                const imgElement: HTMLElement = currentFocusNode.previousSibling as HTMLElement;
                imgElement.classList.add('pasteContent_Img');
                imgElement.classList.add(CLS_RTE_IMAGE);
                // Set display mode class
                if (this.parent.insertImageSettings.display.toLowerCase() === 'inline') {
                    imgElement.classList.add(CLS_IMGINLINE);
                } else {
                    imgElement.classList.add(CLS_IMGBREAK);
                }
                this.pasteObj.setImageProperties(imgElement as HTMLImageElement);
            }
            this.imgUploading(this.parent.inputElement);
        }, 500);
    }

    /* Processes and uploads images found in pasted content */
    private imgUploading(elm: HTMLElement): void {
        const allImgElm: NodeListOf<HTMLImageElement> =
            elm.querySelectorAll('.' + classes.CLS_PASTED_CONTENT_IMG);
        // Process images if save URL is configured and images exist
        if (this.parent.insertImageSettings.saveUrl && allImgElm.length > 0) {
            this.processImagesForUpload(allImgElm);
        } else if (this.parent.insertImageSettings.saveFormat === 'Blob') {
            this.pasteObj.getBlob(allImgElm);
        }
        // Clean up temporary CSS classes
        this.cleanupImageClasses(elm);
    }

    /* Processes images for upload by extracting base64 data and creating files */
    private processImagesForUpload(allImgElm: NodeListOf<HTMLImageElement>): void {
        const base64Src: string[] = [];
        const imgName: string[] = [];
        const uploadImg: Element[] = [];
        // Collect base64 images
        for (let i: number = 0; i < allImgElm.length; i++) {
            const imgSrc: string = allImgElm[i as number].getAttribute('src');
            if (imgSrc && imgSrc.split(',')[0].indexOf('base64') >= 0) {
                base64Src.push(imgSrc);
                imgName.push(getUniqueID('rte_image'));
                uploadImg.push(allImgElm[i as number]);
            }
        }
        // Convert base64 to files and upload
        const fileList: File[] = this.createFilesFromBase64(base64Src, imgName);
        this.uploadFiles(fileList, uploadImg);
        // Handle blob format if needed
        if ((isNOU(this.parent.insertImageSettings.saveUrl) || isNOU(this.parent.insertImageSettings.path)) &&
            this.parent.insertImageSettings.saveFormat === 'Blob') {
            this.pasteObj.getBlob(allImgElm);
        }
    }

    /* Creates File objects from base64 image data */
    private createFilesFromBase64(base64Src: string[], imgName: string[]): File[] {
        const fileList: File[] = [];
        for (let i: number = 0; i < base64Src.length; i++) {
            fileList.push(this.pasteObj.base64ToFile(base64Src[i as number], imgName[i as number]));
        }
        return fileList;
    }

    /* Uploads files and associates them with image elements */
    private uploadFiles(fileList: File[], uploadImg: Element[]): void {
        for (let i: number = 0; i < fileList.length; i++) {
            this.uploadMethod(fileList[i as number], uploadImg[i as number]);
        }
    }

    /* Removes temporary CSS classes from image elements */
    private cleanupImageClasses(elm: HTMLElement): void {
        const allImgElmId: NodeListOf<Element> = elm.querySelectorAll('.' + classes.CLS_PASTED_CONTENT_IMG);
        for (let i: number = 0; i < allImgElmId.length; i++) {
            allImgElmId[i as number].classList.remove(classes.CLS_PASTED_CONTENT_IMG);
            // Remove class attribute if empty
            if (allImgElmId[i as number].getAttribute('class').trim() === '') {
                allImgElmId[i as number].removeAttribute('class');
            }
        }
    }

    /* Uploads a single file and associates it with an image element */
    private uploadMethod(fileList: File, imgElem: Element): void {
        this.uploadImgElem = imgElem;
        this.pasteObj.setImageOpacity(this.uploadImgElem);
        // Create popup for upload progress
        const popupEle: HTMLElement = this.pasteObj.createPopupElement();
        const uploadEle: HTMLElement = this.createUploadElement();
        // Create popup and configure uploader
        this.createPopupObject(popupEle, imgElem, fileList);
        this.configureUploader(fileList);
    }

    /* Creates an upload element for the file input */
    private createUploadElement(): HTMLElement {
        const uploadEle: HTMLElement = document.createElement('div');
        document.body.appendChild(uploadEle);
        uploadEle.style.display = 'none';
        return uploadEle;
    }

    /* Configures the uploader with the file to be uploaded */
    private configureUploader(fileList: File): void {
        // Reset raw file
        this.rawFile = undefined;
        // Create uploader options
        const uploaderOptions: UploaderModel = {
            asyncSettings: {
                saveUrl: this.parent.insertImageSettings.saveUrl
            },
            cssClass: CLS_RTE_DIALOG_UPLOAD,
            enableRtl: this.parent.enableRtl,
            allowedExtensions: this.parent.insertImageSettings.allowedTypes.toString()
        };
        // Initialize uploader
        this.uploadObj = new RteUploader(
            uploaderOptions,
            this.popupObj.element.childNodes[0] as HTMLInputElement,
            this.parent
        );
        // Create file data for upload
        /* eslint-disable */
        const fileData: any = [{
            name: fileList.name,
            rawFile: fileList,
            size: fileList.size,
            type: fileList.type,
            validationMessages: { minSize: '', maxSize: '' },
            statusCode: '1'
        }];
        // Configure uploader with file data
        this.uploadObj.createFileList(fileData);
        this.uploadObj.filesData.push(fileData[0]);
        /* eslint-enable */
        this.rawFile = fileData;
        // Start upload
        this.uploadObj.upload(fileData);
        // Hide file select wrapper
        this.hideFileSelectWrapper();
    }

    /* Hides the file select wrapper element in the popup */
    private hideFileSelectWrapper(): void {
        const fileSelectWrap: HTMLElement = this.popupObj.element.getElementsByClassName(
            classes.CLS_FILE_SELECT_WRAP
        )[0] as HTMLElement;
        if (fileSelectWrap) {
            fileSelectWrap.style.display = 'none';
        }
        const selectWrapToDetach: HTMLElement = this.popupObj.element.querySelector(
            '.' + CLS_RTE_DIALOG_UPLOAD + ' .' + classes.CLS_FILE_SELECT_WRAP
        ) as HTMLElement;
        if (selectWrapToDetach) {
            detach(selectWrapToDetach);
        }
    }

    /* Creates and configures the popup object for image upload progress */
    private createPopupObject(popupEle: HTMLElement, imgElem: Element, file: File): void {
        const contentEle: HTMLInputElement | HTMLElement = createElement('input', {
            id: this.parent.element.id + '_upload',
            attrs: { type: 'File', name: 'UploadFiles' }
        });
        // Create popup with configuration
        this.popupObj = new Popup(popupEle, {
            relateTo: imgElem as HTMLElement,
            height: '85px',
            width: '300px',
            collision: { X: 'fit', Y: 'fit' },
            content: contentEle,
            viewPortElement: this.parent.getPanel() as HTMLElement,
            position: { X: 'center', Y: 'top' },
            enableRtl: this.parent.enableRtl,
            zIndex: 10001,
            close: (event: { [key: string]: object }) => {
                this.parent.isBlur = false;
                this.popupObj.destroy();
                detach(this.popupObj.element);
            }
        });
        // Apply styles and schedule refresh
        this.configurePopupStyles();
        this.schedulePopupRefresh(imgElem, file);
    }

    /* Configures popup styles and CSS classes */
    private configurePopupStyles(): void {
        if (this.popupObj && this.popupObj.element) {
            this.popupObj.element.style.display = 'none';
            addClass(
                [this.popupObj.element],
                [classes.CLS_POPUP_OPEN, classes.CLS_RTE_UPLOAD_POPUP]
            );
        }
    }

    /* Schedules popup refresh based on file size */
    private schedulePopupRefresh(imgElem: Element, file: File): void {
        const timeOut: number = file.size > 1000000 ? 300 : 100;
        this.refreshPopupTime = setTimeout(() => {
            this.refreshPopup(imgElem as HTMLElement, this.popupObj);
        }, timeOut);
    }

    /* Handles the uploading event */
    private uploading(e: UploadingEventArgs): void {
        this.parent.inputElement.contentEditable = 'false';
    }

    /* Handles successful upload completion */
    private success(e: ImageSuccessEventArgs): void {
        if (e && e.file && e.file.name && this.uploadImgElements.has(e.file.name)) {
            this.uploadImgElem = this.uploadImgElements.get(e.file.name);
        }
        this.popupClose(this.popupObj, this.uploadImgElem, e);
    }

    /* Handles upload failure */
    private failure(e: Object): void {
        setTimeout(() => {
            this.uploadFailure(this.uploadImgElem, this.popupObj, e);
        }, 900);
    }

    /* Handles file selection */
    private selected(e: SelectedEventArgs): void {
        if (e && e.filesData) {
            this.rawFile = e.filesData;
        }
    }

    /* Handles cancellation and removal of uploads */
    private cancelingAndRemoving(e: object): void {
        this.parent.inputElement.contentEditable = 'true';
        if (this.uploadImgElem && this.uploadImgElem.nextSibling &&
            this.uploadImgElem.nextSibling.textContent === ' ') {
            detach(this.uploadImgElem.nextSibling);
        }
        if (this.uploadImgElem) {
            detach(this.uploadImgElem);
        }
        if (this.popupObj) {
            this.popupObj.close();
        }
    }

    /* Handles image upload preparation */
    /* eslint-disable */
    private beforeImageUpload(args: BeforeUploadEventArgs): any {
        if (!this.parent.beforeUploadImageEnabled) {
            this.handleNonEnabledUpload(args);
            return;
        }
        return this.handleEnabledUpload(args);
    }

    /* Handles upload when beforeUploadImage is not enabled */
    private handleNonEnabledUpload(args: BeforeUploadEventArgs): void {
        if (isNOU(this.parent.insertImageSettings.saveUrl)) {
            this.popupClose(this.popupObj, this.uploadImgElem, null);
        } else {
            this.parent.observer.notify(events.beforePasteUploadCallBack, args);
        }
    }

    /* Handles upload when beforeUploadImage is enabled */
    private handleEnabledUpload(args: BeforeUploadEventArgs): Promise<void> {
        const beforeUploadArgs: ImageUploadingEventArgs = JSON.parse(JSON.stringify(args));
        beforeUploadArgs.filesData = this.rawFile;
        return new Promise((resolve: Function) => {
            (this.parent.dotNetRef.invokeMethodAsync(
                events.beforeUpload, beforeUploadArgs) as unknown as Promise<ImageUploadingEventArgs>
            ).then((responseArgs: ImageUploadingEventArgs) => {
                if (responseArgs.cancel) {
                    return;
                }
                if (this.uploadObj) {
                    (this.uploadObj as any).currentRequestHeader = args.currentRequest ?
                        args.currentRequest : (this.uploadObj as any).currentRequestHeader;
                    (this.uploadObj as any).customFormDatas = args.customFormData && args.customFormData.length > 0 ?
                        args.customFormData : (this.uploadObj as any).customFormDatas;
                }
                if (isNOU(this.parent.insertImageSettings.saveUrl)) {
                    this.popupClose(this.popupObj, this.uploadImgElem, null);
                } else {
                    this.parent.observer.notify(events.beforePasteUploadCallBack, args);
                }
                resolve();
            });
        });
    }
    /* eslint-enable */

    /* Handles upload failure */
    private uploadFailure(imgElem: Element, popupObj: Popup, e: object): void {
        this.parent.inputElement.contentEditable = 'true';
        if (imgElem) {
            detach(imgElem);
        }
        if (popupObj) {
            popupObj.close();
        }
        if (this.parent.onImageUploadFailedEnabled) {
            this.parent.dotNetRef.invokeMethodAsync(events.pasteImageUploadFailed, e);
        }
        if (this.uploadObj) {
            this.uploadObj.destroy();
            this.uploadObj = undefined;
        }
    }

    /* Closes popup and handles successful upload */
    private popupClose(popupObj: Popup, imgElem: Element, e: ImageSuccessEventArgs): void {
        this.parent.inputElement.contentEditable = 'true';
        if (e) {
            e.detectImageSource = ImageInputSource.Pasted;
            if (!isNOU(this.parent.insertImageSettings.saveUrl) && this.parent.onImageUploadSuccessEnabled) {
                this.handleSuccessCallback(imgElem, e);
            } else {
                this.pasteUploadSuccessCallback(imgElem, e);
            }
        }
        if (popupObj) {
            popupObj.close();
        }
        if (imgElem) {
            (imgElem as HTMLElement).style.opacity = '1';
        }
        if (this.uploadObj) {
            this.uploadObj.destroy();
            this.uploadObj = undefined;
        }
    }

    /* Handles success callback for image upload */
    private handleSuccessCallback(imgElem: Element, e: ImageSuccessEventArgs): void {
        (this.parent.dotNetRef.invokeMethodAsync(
            events.pasteImageUploadSuccess, e) as unknown as Promise<ImageSuccessEventArgs>
        ).then((args: ImageSuccessEventArgs) => {
            this.pasteUploadSuccessCallback(imgElem, e, args);
        });
    }

    /* Handles document click events for paste dialog */
    private docClick(e: Record<string, object>): void {
        const target: HTMLElement = (e.args as MouseEvent).target as HTMLElement;
        const dlgId: string = '#' + this.parent.element.id + '_pasteCleanupDialog';
        const pasteDlgEle: Element = this.parent.element.querySelector(dlgId);
        if (target && target.classList &&
            !isNOU(pasteDlgEle) && !closest(target, dlgId)) {
            this.parent.dotNetRef.invokeMethodAsync('ClosePasteDialog', events.outsideClicked);
        }
    }

    /* Updates image source after successful upload */
    private pasteUploadSuccessCallback(
        imgElem: Element, e: object, args?: ImageSuccessEventArgs
    ): void {
        if (isNOU(this.parent.insertImageSettings.path)) {
            return;
        }
        if (!isNOU(args) && !isNOU(args.file) && !isNOU(args.file.name)) {
            this.updateImageSource(imgElem as HTMLImageElement, args.file.name);
        } else if (e && (e as MetaData).file && (e as MetaData).file.name) {
            this.updateImageSource(imgElem as HTMLImageElement, (e as MetaData).file.name);
        }
    }

    /* Updates image source and alt attribute */
    private updateImageSource(imgElement: HTMLImageElement, fileName: string): void {
        const url: string = this.parent.insertImageSettings.path + fileName;
        imgElement.src = url;
        imgElement.setAttribute('alt', fileName);
    }

    /* Refreshes popup position relative to the image element */
    private refreshPopup(imageElement: HTMLElement, popupObj: Popup): void {
        if (!popupObj || !imageElement) {
            return;
        }
        const imgPosition: number = this.calculateImagePosition(imageElement);
        const rtePosition: number = this.parent.element.offsetTop + this.parent.element.offsetHeight;
        if (imgPosition > rtePosition) {
            this.positionPopupAboveEditor(popupObj);
        } else {
            this.positionPopupAtImage(popupObj, imageElement);
        }
    }

    /* Calculates the vertical position of the image */
    private calculateImagePosition(imageElement: HTMLElement): number {
        return this.parent.iframeSettings.enable
            ? this.parent.element.offsetTop + imageElement.offsetTop
            : imageElement.offsetTop;
    }

    /* Positions popup above the editor */
    private positionPopupAboveEditor(popupObj: Popup): void {
        popupObj.relateTo = this.parent.inputElement;
        popupObj.offsetY = this.parent.iframeSettings.enable ? -30 : -65;
        popupObj.element.style.display = 'block';
    }

    /* Positions popup at the image location */
    private positionPopupAtImage(popupObj: Popup, imageElement: HTMLElement): void {
        popupObj.refreshPosition(imageElement);
        popupObj.element.style.display = 'block';
    }

    /* Formats pasted image content */
    private imageFormatting(
        pasteArgs: object,
        imgElement: { [key: string]: Element[] }
    ): void {
        // Add class to identify pasted content image
        imgElement.elements[0].classList.add(classes.CLS_PASTED_CONTENT_IMG);
        // Create container for the image
        const imageElement: HTMLElement = createElement('span');
        imageElement.appendChild(imgElement.elements[0]);
        const imageValue: string = imageElement.innerHTML;
        // Save current selection
        this.saveCurrentSelection();
        // Reset clipboard HTML data flag
        this.isClipboardHTMLDataNull = false;
        // Handle formatting based on settings
        this.handleImageFormattingBySettings(imageValue, pasteArgs);
    }

    /* Saves the current selection state */
    private saveCurrentSelection(): void {
        const currentDocument: Document = document;
        const range: Range = this.nodeSelectionObj.getRange(currentDocument);
        this.saveSelection = this.nodeSelectionObj.save(range, currentDocument);
    }

    /* Determines formatting method based on paste settings */
    private handleImageFormattingBySettings(imageValue: string, pasteArgs: object): void {
        if (this.parent.pasteCleanupSettings.prompt) {
            this.pasteDialog(imageValue, pasteArgs);
        } else if (this.parent.pasteCleanupSettings.plainText) {
            this.plainFormatting(imageValue, pasteArgs);
        } else if (this.parent.pasteCleanupSettings.keepFormat) {
            this.formatting(imageValue, false, pasteArgs);
        } else {
            this.formatting(imageValue, true, pasteArgs);
        }
    }

    /* Applies selected formatting option to pasted content */
    public selectFormatting(option: string): void {
        // Restore original height if needed
        this.restoreOriginalHeight();
        // Apply selected formatting
        this.applySelectedFormatting(option);
    }

    /* Restores the original editor height */
    private restoreOriginalHeight(): void {
        if (this.newRTEHeight !== '') {
            (this.parent.element as HTMLElement).style.height = this.preRTEHeight;
        }
    }

    /* Applies the selected formatting option */
    private applySelectedFormatting(option: string): void {
        switch (option) {
        case 'KeepFormat':
            this.formatting(this.currentValue, false, this.currentArgs);
            break;
        case 'CleanFormat':
            this.formatting(this.currentValue, true, this.currentArgs);
            break;
        case 'PlainTextFormat':
            this.plainFormatting(this.currentValue, this.currentArgs);
            break;
        }
    }

    /* Opens paste dialog with content options */
    private pasteDialog(value: string, args: object): void {
        // Store current values
        this.currentValue = value;
        this.currentArgs = args;
        // Save original height
        this.preRTEHeight = this.parent.height.toString();
        this.newRTEHeight = '';
        // Adjust height if needed
        this.adjustEditorHeight();
        // Open paste dialog
        this.parent.openPasteDialog();
    }

    /* Adjusts editor height for paste dialog if needed */
    private adjustEditorHeight(): void {
        if (this.parent.element.offsetHeight < 265) {
            this.newRTEHeight = (265 + 40).toString();
        }
        if (this.newRTEHeight !== '') {
            (this.parent.element as HTMLElement).style.height = this.newRTEHeight + 'px';
        }
    }

    /* Applies formatting to pasted content based on clean parameter */
    private formatting(value: string, clean: boolean, args: object): void {
        // Create container for pasted content
        let clipBoardElem: HTMLElement = this.createClipboardElement(value);
        // Process and clean the content
        clipBoardElem = this.processClipboardContent(clipBoardElem, clean);
        this.saveSelection.restore();
        clipBoardElem = this.sanitizeClipboardContent(clipBoardElem);
        this.processSpecialElements(clipBoardElem);
        // Handle content if available
        if (this.pasteObj.hasContentToPaste(clipBoardElem)) {
            this.handleContentToPaste(clipBoardElem, value);
        }
    }

    /* Creates a clipboard element with the given content */
    private createClipboardElement(value: string): HTMLElement {
        const clipBoardElem: HTMLElement = createElement(
            'div', { className: 'pasteContent', styles: 'display:inline;' }
        ) as HTMLElement;
        // Handle line breaks for plain text with HTML
        if (this.isNotFromHtml && this.containsHtml) {
            value = this.pasteObj.splitBreakLine(value);
        }
        // Set content with accessibility enhancements
        clipBoardElem.innerHTML = this.parent.addAnchorAriaLabel(value);
        return clipBoardElem;
    }

    /* Processes and cleans the clipboard content */
    private processClipboardContent(clipBoardElem: HTMLElement, clean: boolean): HTMLElement {
        // Clean Apple-specific classes
        clipBoardElem = this.pasteObj.cleanAppleClass(clipBoardElem);
        // Remove denied tags and attributes
        clipBoardElem = this.pasteObj.cleanupDeniedTagsAndAttributes(clipBoardElem, clean);
        // Apply style restrictions if configured
        if (this.parent.pasteCleanupSettings.allowedStyleProps !== null) {
            clipBoardElem = this.pasteObj.allowedStyle(clipBoardElem);
        }
        return clipBoardElem;
    }

    /* Sanitizes the clipboard content */
    private sanitizeClipboardContent(clipBoardElem: HTMLElement): HTMLElement {
        let newText: string = clipBoardElem.innerHTML;
        // Handle ampersands for HTML sanitizer
        if (this.parent.enableHtmlSanitizer) {
            newText = clipBoardElem.innerHTML.split('&').join('&amp;');
        }
        // Apply sanitization
        clipBoardElem.innerHTML = sanitizeHelper(newText, this.parent);
        return clipBoardElem;
    }

    /* Processes special elements in the clipboard content */
    private processSpecialElements(clipBoardElem: HTMLElement): void {
        // Set image classes and properties
        this.pasteObj.setImageClassAndProps(clipBoardElem);
        // Handle picture elements if present
        if (this.pasteObj.hasPictureElement(clipBoardElem)) {
            this.pasteObj.processPictureElement(clipBoardElem);
        }
    }

    /* Handles content to paste based on settings */
    private handleContentToPaste(clipBoardElem: HTMLElement, value: string): void {
        if (this.parent.afterPasteCleanupEnabled) {
            this.handleAfterPasteCleanup(clipBoardElem, value);
        } else {
            this.pasteUpdatedValue(clipBoardElem.innerHTML);
        }
    }

    /* Handles after-paste cleanup process */
    private handleAfterPasteCleanup(clipBoardElem: HTMLElement, value: string): void {
        const tempWrapperElem: HTMLElement = createElement('div') as HTMLElement;
        tempWrapperElem.innerHTML = clipBoardElem.innerHTML;
        // Collect base64 image files
        const filesData: FileInfo[] = this.pasteObj.collectBase64ImageFiles(tempWrapperElem);
        // Set pasted value based on image presence
        if (filesData.length > 0) {
            this.pastedValue = value;
        } else {
            this.pastedValue = '';
        }
        // Get final value
        const finalValue: string = clipBoardElem.innerHTML;
        // Invoke after paste cleanup
        this.parent.dotNetRef.invokeMethodAsync('AfterPasteCleanUp', { value: finalValue, filesData });
    }

    /* Updates the editor with the pasted value */
    private pasteUpdatedValue(args: NotifyArgs | string): void {
        // Determine the value to use
        const value: string = this.determineValueToUse(args);
        // Create and prepare clipboard element
        const clipBoardElem: HTMLElement = this.prepareClipboardElement(args, value);
        // Execute insert HTML command
        this.executeInsertHtmlCommand(args, clipBoardElem);
        // Perform post-paste operations
        this.performPostPasteOperations();
    }

    /* Determines the value to use for pasting */
    private determineValueToUse(args: NotifyArgs | string): string {
        if (this.parent.afterPasteCleanupEnabled) {
            return this.pastedValue === '' ? (args as NotifyArgs).text : this.pastedValue;
        }
        return args as string;
    }

    /* Prepares the clipboard element for insertion */
    private prepareClipboardElement(args: NotifyArgs | string, value: string): HTMLElement {
        let clipBoardElem: HTMLElement = createElement(
            'div', { className: 'pasteContent', styles: 'display:inline;' }
        ) as HTMLElement;
        clipBoardElem.innerHTML = value;
        // Add table class if needed
        if (typeof args !== 'string' && (args as NotifyArgs).pasteTableSource) {
            clipBoardElem = this.pasteObj.addTableClass(
                clipBoardElem,
                (args as NotifyArgs).pasteTableSource
            );
        }
        return clipBoardElem;
    }

    /* Executes the insert HTML command */
    private executeInsertHtmlCommand(args: NotifyArgs | string, clipBoardElem: HTMLElement): void {
        this.parent.formatter.editorManager.execCommand(
            'inserthtml',
            'pasteCleanup',
            args,
            (returnArgs: IHtmlFormatterCallBack) => {
                if (typeof args === 'string') {
                    args = {
                        text: args as string,
                        name: 'afterPasteCleanUp'
                    };
                }
                // Extend args with return values
                extend(
                    args,
                    {
                        elements: returnArgs.elements,
                        imageElements: returnArgs.imgElem,
                        requestType: 'Paste'
                    },
                    true
                );
                // Call success handler
                this.parent.formatter.onSuccess(this.parent, args);
            },
            clipBoardElem, null, null, this.parent.enterKey
        );
    }

    /* Performs operations after paste is complete */
    private performPostPasteOperations(): void {
        scrollToCursor(this.parent.getDocument(), this.parent.inputElement);
        this.pasteObj.removeTempClass();
        this.parent.observer.notify(events.toolbarRefresh, {});
        this.pasteObj.cropImageHandler(this.parent.inputElement);
    }

    /* Adds temporary class to all child elements */
    private addTempClass(clipBoardElem: HTMLElement): void {
        const allChild: HTMLCollection = clipBoardElem.children;
        for (let i: number = 0; i < allChild.length; i++) {
            allChild[i as number].classList.add(classes.CLS_RTE_PASTE_CONTENT);
        }
    }

    /* Formats pasted content as plain text */
    private plainFormatting(value: string, args: object): void {
        // Create container for pasted content
        const clipBoardElem: HTMLElement = this.createPlainTextContainer(value);
        // Process content to plain text
        this.processToPlainText(clipBoardElem);
        // Handle content if not empty
        if (clipBoardElem.textContent.trim() !== '') {
            this.handleNonEmptyPlainText(clipBoardElem, args, value);
        } else {
            this.handleEmptyPlainText(args);
        }
    }

    /* Creates a container for plain text content */
    private createPlainTextContainer(value: string): HTMLElement {
        const clipBoardElem: HTMLElement = createElement(
            'div', { className: 'pasteContent', styles: 'display:inline;' }
        ) as HTMLElement;
        clipBoardElem.innerHTML = value;
        return clipBoardElem;
    }

    /* Processes content to plain text by removing formatting */
    private processToPlainText(clipBoardElem: HTMLElement): void {
        // Remove inline elements
        this.detachInlineElements(clipBoardElem);
        // Extract text content
        this.getTextContent(clipBoardElem);
    }

    /* Handles non-empty plain text content */
    private handleNonEmptyPlainText(clipBoardElem: HTMLElement, args: object, value: string): void {
        // Process first element if needed
        this.processFirstElement(clipBoardElem);
        // Clean up and prepare content
        this.prepareCleanPlainText(clipBoardElem);
        // Format based on enter key setting
        clipBoardElem = this.formatBasedOnEnterKey(clipBoardElem);
        // Insert content
        this.insertPlainTextContent(clipBoardElem, args, value);
    }

    /* Processes the first element in the clipboard */
    private processFirstElement(clipBoardElem: HTMLElement): void {
        if (isNOU(clipBoardElem.firstElementChild) ||
            clipBoardElem.firstElementChild.tagName === 'BR') {
            return;
        }
        const firstElm: Element | Node = clipBoardElem.firstElementChild;
        if (isNOU(clipBoardElem.firstElementChild)) {
            return;
        }
        const spanElm: HTMLElement = createElement('span') as HTMLElement;
        this.moveChildNodesToSpan(firstElm, spanElm, clipBoardElem);
        // Remove first element if empty
        if (!firstElm.hasChildNodes()) {
            detach(firstElm);
        }
    }

    /* Moves child nodes from first element to a span element  */
    private moveChildNodesToSpan(
        firstElm: Element | Node,
        spanElm: HTMLElement,
        clipBoardElem: HTMLElement
    ): void {
        for (let i: number = 0, j: number = 0; i < firstElm.childNodes.length; i++, j++) {
            const currentNode: Node = firstElm.childNodes[i as number];
            if (currentNode.nodeName === '#text') {
                // Handle text nodes
                spanElm.appendChild(currentNode);
                clipBoardElem.insertBefore(spanElm, clipBoardElem.firstElementChild);
                i--;
            } else if (currentNode.nodeName !== '#text' && j === 0) {
                // Handle first non-text node
                this.moveNestedChildNodes(currentNode, spanElm, clipBoardElem);
                i--;
            } else {
                // Stop processing after first non-text node
                break;
            }
        }
    }

    /* Moves nested child nodes to the span element */
    private moveNestedChildNodes(
        node: Node,
        spanElm: HTMLElement,
        clipBoardElem: HTMLElement
    ): void {
        for (let k: number = 0; k < node.childNodes.length; k++) {
            spanElm.appendChild(node.childNodes[k as number]);
            clipBoardElem.insertBefore(spanElm, clipBoardElem.firstElementChild);
            k--;
        }
    }

    /* Prepares clean plain text by removing empty elements and comments */
    private prepareCleanPlainText(clipBoardElem: HTMLElement): void {
        this.removeEmptyElements(clipBoardElem);
        this.saveSelection.restore();
        clipBoardElem.innerHTML = sanitizeHelper(clipBoardElem.innerHTML, this.parent);
        this.addTempClass(clipBoardElem);
        this.removingComments(clipBoardElem);
    }

    /* Formats content based on enter key setting */
    private formatBasedOnEnterKey(clipBoardElem: HTMLElement): HTMLElement {
        if (this.parent.enterKey === 'BR' && !this.isClipboardHTMLDataNull) {
            // Convert to BR-based content
            return this.reframeToBrContent(clipBoardElem);
        } else if (this.parent.enterKey === 'DIV') {
            // Convert P tags to DIV tags
            clipBoardElem.innerHTML = clipBoardElem.innerHTML
                .replace(/<p class="pasteContent_RTE">/g, '<div>')
                .replace(/<\/p>/g, '</div>');
        }
        return clipBoardElem;
    }

    /* Inserts plain text content into the editor */
    private insertPlainTextContent(
        clipBoardElem: HTMLElement,
        args: object,
        value: string
    ): void {
        if (this.parent.afterPasteCleanupEnabled) {
            // Use after paste cleanup
            const finalValue: string = clipBoardElem.innerHTML;
            const filesData: FileInfo[] = [];
            this.parent.dotNetRef.invokeMethodAsync('AfterPasteCleanUp', { value: finalValue, filesData });
        } else {
            // Insert directly
            this.pasteUpdatedValue(clipBoardElem.innerHTML);
        }
    }

    /* Handles empty plain text content */
    private handleEmptyPlainText(args: object): void {
        this.saveSelection.restore();
        extend(args, { elements: [] }, true);
        this.parent.formatter.onSuccess(this.parent, args);
    }

    /* Removes HTML comments from element */
    private removingComments(elm: HTMLElement): void {
        if (!elm) {
            return;
        }
        let innerElement: string = elm.innerHTML;
        innerElement = innerElement.replace(/<!--[\s\S]*?-->/g, '');
        elm.innerHTML = innerElement;
    }

    /* Converts content to use BR elements for line breaks */
    private reframeToBrContent(clipBoardElem: HTMLElement): HTMLElement {
        const newClipBoardElem: HTMLElement = createElement(
            'div', { className: 'pasteContent', styles: 'display:inline;' }
        ) as HTMLElement;
        // Process each child node
        while (!isNOU(clipBoardElem.firstChild)) {
            this.processNodeForBrContent(clipBoardElem.firstChild as HTMLElement, newClipBoardElem);
        }
        return newClipBoardElem;
    }

    /* Processes a node for BR content conversion */
    private processNodeForBrContent(currentNode: HTMLElement, newClipBoardElem: HTMLElement): void {
        const brElem: HTMLElement = createElement('br') as HTMLElement;
        if (currentNode.nodeName === '#text') {
            // Handle text nodes
            this.handleTextNodeForBr(currentNode, newClipBoardElem, brElem);
        } else {
            // Handle element nodes
            this.handleElementNodeForBr(currentNode, newClipBoardElem, brElem);
        }
    }

    /* Handles text node for BR content conversion */
    private handleTextNodeForBr(
        currentNode: HTMLElement,
        newClipBoardElem: HTMLElement,
        brElem: HTMLElement
    ): void {
        const isNextSibPresent: boolean = !isNOU(currentNode.nextSibling);
        newClipBoardElem.appendChild(currentNode);
        if (isNextSibPresent) {
            newClipBoardElem.appendChild(brElem);
        }
    }

    /* Handles element node for BR content conversion */
    private handleElementNodeForBr(
        currentNode: HTMLElement,
        newClipBoardElem: HTMLElement,
        brElem: HTMLElement
    ): void {
        const isCurrentNodeBRElm: boolean = currentNode.nodeName === 'BR';
        if (isCurrentNodeBRElm) {
            // Keep BR elements
            newClipBoardElem.appendChild(currentNode);
        } else if (currentNode.childNodes.length > 0) {
            // Move first child
            newClipBoardElem.appendChild(currentNode.childNodes[0]);
        }
        // Add BR if there's a next sibling
        if (!isNOU(currentNode) && !isNOU(currentNode.nextSibling)) {
            newClipBoardElem.appendChild(brElem);
        }
        // Remove original node if not a BR
        if (!isCurrentNodeBRElm && !isNOU(currentNode)) {
            detach(currentNode);
        }
    }

    /* Extracts text content from block elements and removes all attributes */
    private getTextContent(clipBoardElem: HTMLElement): void {
        // Process all block nodes
        this.processBlockNodes(clipBoardElem);
        // Remove all attributes from all elements
        this.removeAllAttributes(clipBoardElem);
    }

    /* Processes all block nodes to extract their text content */
    private processBlockNodes(clipBoardElem: HTMLElement): void {
        for (let i: number = 0; i < this.blockNode.length; i++) {
            const blockElements: NodeListOf<Element> = clipBoardElem.querySelectorAll(this.blockNode[i as number]);
            this.processBlockElements(blockElements);
        }
    }

    /* Processes a collection of block elements */
    private processBlockElements(blockElements: NodeListOf<Element>): void {
        for (let j: number = 0; j < blockElements.length; j++) {
            const currentBlock: Element = blockElements[j as number];
            let parentElement: HTMLElement = null;
            let previousNodeType: string = '';
            // Process each child node in the block
            for (let k: number = 0; k < currentBlock.childNodes.length; k++) {
                const childNode: Node = currentBlock.childNodes[k as number];
                if (this.shouldMoveNodeToParent(childNode)) {
                    // Move node to parent level
                    parentElement = this.moveNodeToParent(childNode);
                    k--; // Adjust index since we're removing nodes
                } else {
                    // Handle other nodes
                    parentElement = this.handleOtherNode(childNode, previousNodeType);
                    k--; // Adjust index since we're removing nodes
                    previousNodeType = 'text';
                }
            }
            // Remove the now-empty parent element
            if (parentElement) {
                detach(parentElement);
            }
        }
    }

    /* Determines if a node should be moved directly to its parent */
    private shouldMoveNodeToParent(node: Node): boolean {
        // Move DIV, P, or empty text nodes directly to parent
        return node.nodeName === 'DIV' || node.nodeName === 'P' ||
            (node.nodeName === '#text' &&
                node.nodeValue.replace(/\u00a0/g, '&nbsp;') !== '&nbsp;' &&
                node.textContent.trim() === '');
    }

    /* Moves a node to its parent's parent */
    private moveNodeToParent(node: Node): HTMLElement {
        const parentElement: HTMLElement = node.parentElement;
        if (parentElement && parentElement.parentElement) {
            parentElement.parentElement.insertBefore(node, parentElement);
        }
        return parentElement;
    }

    /* Handles nodes that shouldn't be moved directly to parent */
    private handleOtherNode(node: Node, previousNodeType: string): HTMLElement {
        const parentElement: HTMLElement = node.parentElement;
        if (previousNodeType === 'text' && parentElement && parentElement.previousElementSibling) {
            // Append to previous element if previous node was text
            parentElement.previousElementSibling.appendChild(node);
        } else if (parentElement && parentElement.parentElement) {
            // Create new div and insert before parent
            const divElement: HTMLElement = createElement('div', { id: 'newDiv' });
            divElement.appendChild(node);
            parentElement.parentElement.insertBefore(divElement, parentElement);
        }
        return parentElement;
    }

    /* Removes all attributes from all elements */
    private removeAllAttributes(clipBoardElem: HTMLElement): void {
        const allElements: NodeListOf<Element> = clipBoardElem.querySelectorAll('*');
        for (let i: number = 0; i < allElements.length; i++) {
            this.removeAllAttributesFromElement(allElements[i as number]);
        }
    }

    /* Removes all attributes from a single element */
    private removeAllAttributesFromElement(element: Element): void {
        const attributes: NamedNodeMap = element.attributes;
        for (let j: number = 0; j < attributes.length; j++) {
            const attributeName: string = attributes[j as number].name;
            element.removeAttribute(attributeName);
            j--; // Adjust index since we're removing attributes
        }
    }

    /* Removes inline elements and moves their content up to parent level */
    private detachInlineElements(clipBoardElem: HTMLElement): void {
        for (let i: number = 0; i < this.inlineNode.length; i++) {
            const inlineElements: NodeListOf<Element> = clipBoardElem.querySelectorAll(this.inlineNode[i as number]);
            this.processInlineElements(clipBoardElem, inlineElements);
        }
    }

    /* Processes a collection of inline elements */
    private processInlineElements(clipBoardElem: HTMLElement, inlineElements: NodeListOf<Element>): void {
        for (let j: number = 0; j < inlineElements.length; j++) {
            const currentElement: Element = inlineElements[j as number];
            // Skip first child if it's a span
            if (this.shouldSkipElement(clipBoardElem, currentElement)) {
                continue;
            }
            this.moveChildrenToParent(currentElement);
        }
    }

    /* Determines if an element should be skipped during processing */
    private shouldSkipElement(clipBoardElem: HTMLElement, element: Element): boolean {
        return element === clipBoardElem.firstChild && element.nodeName === 'SPAN';
    }

    /* Moves children of an element to its parent and removes the original element */
    private moveChildrenToParent(element: Element): void {
        let parentElement: HTMLElement = null;
        for (let k: number = 0; k < element.childNodes.length; k++) {
            const childNode: Node = element.childNodes[k as number];
            parentElement = childNode.parentElement;
            if (parentElement && parentElement.parentElement) {
                parentElement.parentElement.insertBefore(childNode, parentElement);
                k--; // Adjust index since we're removing nodes
            }
        }
        // Remove the now-empty parent element
        if (parentElement) {
            detach(parentElement);
        }
    }

    /* Recursively finds the highest empty parent element that should be removed */
    private findDetachEmptyElem(element: Element): HTMLElement {
        // Base case: no parent element
        const parent: HTMLElement = element.parentElement;
        if (isNOU(element.parentElement)) {
            return null;
        }
        const isEmptyParent: boolean = parent.textContent.trim() === '';
        const isNotPasteContent: boolean = parent.getAttribute('class') !== 'pasteContent';
        if (isEmptyParent && isNotPasteContent) {
            // Recursively check higher up the tree
            return this.findDetachEmptyElem(parent);
        } else {
            // This is the element to remove
            return element as HTMLElement;
        }
    }
    /* Removes all empty elements except BR tags */
    private removeEmptyElements(element: HTMLElement): void {
        if (!element) {
            return;
        }
        // Find all empty elements
        const emptyElements: NodeListOf<Element> = element.querySelectorAll(':empty');
        // Process each empty element
        for (let i: number = 0; i < emptyElements.length; i++) {
            this.processEmptyElement(emptyElements[i as number]);
        }
    }

    /* Processes a single empty element */
    private processEmptyElement(emptyElement: Element): void {
        // Skip BR tags as they're meaningful even when empty
        if (emptyElement.tagName === 'BR') {
            return;
        }
        // Find the highest empty parent to remove
        const detachableElement: HTMLElement = this.findDetachEmptyElem(emptyElement);
        // Remove the element if found
        if (detachableElement) {
            detach(detachableElement);
        }
    }
}
