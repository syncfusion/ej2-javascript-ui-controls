import * as events from '../base/constant';
import { IRichTextEditor, IRenderer, ICssClassArgs } from '../base/interface';
import { PasteCleanupArgs } from '../base/interface';
import { Dialog, DialogModel, Popup } from '@syncfusion/ej2-popups';
import { RadioButton } from '@syncfusion/ej2-buttons';
import { RendererFactory } from '../services/renderer-factory';
import { isNullOrUndefined as isNOU, L10n, isNullOrUndefined, detach, extend, addClass, removeClass, getComponent } from '@syncfusion/ej2-base';
import { getUniqueID, Browser, closest} from '@syncfusion/ej2-base';
import { CLS_RTE_PASTE_KEEP_FORMAT, CLS_RTE_PASTE_REMOVE_FORMAT, CLS_RTE_PASTE_PLAIN_FORMAT } from '../base/classes';
import { CLS_RTE_PASTE_OK, CLS_RTE_PASTE_CANCEL, CLS_RTE_DIALOG_MIN_HEIGHT } from '../base/classes';
import { NodeSelection } from '../../selection/selection';
import * as EVENTS from './../../common/constant';
import { ServiceLocator } from '../services/service-locator';
import { RenderType } from '../base/enum';
import { ImageInputSource } from '../../common/enum';
import { ImageSuccessEventArgs, NotifyArgs, CropImageDataItem, IPasteModel } from '../../common/interface';
import { DialogRenderer } from '../renderer/dialog-renderer';
import { Uploader, MetaData, UploadingEventArgs, SelectedEventArgs, FileInfo, BeforeUploadEventArgs } from '@syncfusion/ej2-inputs';
import * as classes from '../base/classes';
import { IHtmlFormatterCallBack } from '../../common';
import { sanitizeHelper } from '../base/util';
import { cleanHTMLString, scrollToCursor } from '../../common/util';
import { PasteCleanupSettingsModel } from '../../models/models';
import { PasteCleanupAction } from '../../editor-manager/plugin/paste-clean-up-action';
import { PopupRootBound } from '../../rich-text-editor/base/interface';
import { PopupUploader } from '../renderer/popup-uploader-renderer';
/**
 * PasteCleanup module called when pasting content in RichTextEditor
 */
export class PasteCleanup {
    private parent: IRichTextEditor;
    private pasteObj: PasteCleanupAction;
    private renderFactory: RendererFactory;
    private locator: ServiceLocator;
    private contentModule: IRenderer;
    private i10n: L10n;
    private saveSelection: NodeSelection;
    private nodeSelectionObj: NodeSelection;
    private dialogRenderObj: DialogRenderer;
    private dialogObj: Dialog;
    private keepRadioButton : RadioButton;
    private cleanRadioButton : RadioButton;
    private plainTextRadioButton : RadioButton;
    private isNotFromHtml: boolean = false;
    private containsHtml: boolean = false;
    private cropImageData: CropImageDataItem[] = [];
    private fireFoxUploadTime: number;
    private refreshPopupTime: number;
    private failureTime: number;
    private plainTextContent: string = '';
    private isDestroyed: boolean;
    public constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.locator = serviceLocator;
        this.renderFactory = this.locator.getService<RendererFactory>('rendererFactory');
        this.i10n = serviceLocator.getService<L10n>('rteLocale');
        this.dialogRenderObj = serviceLocator.getService<DialogRenderer>('dialogRenderObject');
        this.addEventListener();
        this.isDestroyed = false;
    }

    private addEventListener(): void {
        this.nodeSelectionObj = new NodeSelection(this.parent.inputElement);
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.pasteClean, this.pasteClean, this);
        this.parent.on(events.bindOnEnd, this.bindOnEnd, this);
        this.parent.on(events.bindCssClass, this.setCssClass, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.docClick, this.docClick, this);
        this.parent.on(events.updateProperty, this.updatePasteCleanupProperty, this);
    }

    private destroy(): void {
        if (this.isDestroyed) { return; }
        if (this.fireFoxUploadTime) { clearTimeout(this.fireFoxUploadTime); this.fireFoxUploadTime = null; }
        if (this.refreshPopupTime) { clearTimeout(this.refreshPopupTime); this.refreshPopupTime = null; }
        if (this.failureTime) { clearTimeout(this.failureTime); this.failureTime = null; }
        this.removeEventListener();
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
        if (this.keepRadioButton && !this.keepRadioButton.isDestroyed){
            this.keepRadioButton.destroy();
            this.keepRadioButton = null;
        }
        if (this.cleanRadioButton && !this.cleanRadioButton.isDestroyed){
            this.cleanRadioButton.destroy();
            this.cleanRadioButton = null;
        }
        if (this.plainTextRadioButton && !this.plainTextRadioButton.isDestroyed){
            this.plainTextRadioButton.destroy();
            this.plainTextRadioButton = null;
        }
        this.isDestroyed = true;
        this.plainTextContent = '';
    }
    private removeEventListener(): void {
        this.parent.off(events.pasteClean, this.pasteClean);
        this.parent.off(events.bindCssClass, this.setCssClass);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.docClick, this.docClick);
        this.parent.off(events.bindOnEnd, this.bindOnEnd);
        this.parent.off(events.updateProperty, this.updatePasteCleanupProperty);
    }

    /*
     * Initializes the PasteCleanupAction  object in the editor manager after editor initialization is complete.
     * This method binds the paste cleanup module to the editor's formatter for handling paste cleanup related operations.
     */
    private bindOnEnd(): void {
        if (this.parent.editorMode === 'HTML' && this.parent.formatter && this.parent.formatter.editorManager
            && this.parent.contentModule) {
            const pasteModel: IPasteModel = this.getPasteCleanupModel();
            this.parent.formatter.editorManager.pasteObj = this.pasteObj =
                new PasteCleanupAction(this.parent.formatter.editorManager, pasteModel);
        }
    }

    /* Creates and returns a paste cleanup model with editor configuration and callback methods */
    private getPasteCleanupModel(): IPasteModel {
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
                if (!this.contentModule) {
                    return this.parent.contentModule.getDocument();
                }
                return this.contentModule.getDocument();
            },
            // Method for retrieving the editable element object of the content module
            getEditPanel: () => {
                if (!this.contentModule) {
                    return this.parent.contentModule.getEditPanel();
                }
                return this.contentModule.getEditPanel();
            },
            updateValue: () => {
                this.parent.updateValue();
            },
            imageUpload: () => {
                this.imgUploading(this.parent.inputElement);
            },
            getCropImageData: () => {
                return this.getCropImageData();
            }
        };
        return pasteModel;
    }

    /* Updates the paste cleanup object with the latest editor configuration settings */
    private updatePasteCleanupProperty(): void {
        const pasteModel: IPasteModel = this.getPasteCleanupModel();
        if (!isNullOrUndefined(this.pasteObj)) {
            this.pasteObj.updatePasteCleanupModel(pasteModel);
        }
    }

    /**
     * Handles the paste cleanup operation when content is pasted into the editor
     *
     * @param {NotifyArgs} e - The notification arguments containing event data
     * @returns {void}
     */
    private pasteClean(e?: NotifyArgs): void {
        const args: { [key: string]: string | NotifyArgs } = {
            requestType: 'Paste',
            editorMode: this.parent.editorMode,
            event: e
        };
        let value: string = null;
        let imageproperties: string | object;
        const allowedTypes: string[] = this.parent.insertImageSettings.allowedTypes;
        // Extract clipboard data if available
        if (e.args && !isNOU((e.args as ClipboardEvent).clipboardData)) {
            value = (e.args as ClipboardEvent).clipboardData.getData('text/html');
            // Store plain text content for later use
            if ((e.args as ClipboardEvent).clipboardData.getData('text/plain')) {
                this.plainTextContent = (e.args as ClipboardEvent).clipboardData.getData('text/plain');
            }
        }
        // Process only if we have args, value, and in HTML mode
        if (e.args && value !== null && this.parent.editorMode === 'HTML') {
            const shouldContinue: boolean = this.processHtmlPaste(e, value, args, allowedTypes, imageproperties);
            if (!shouldContinue) {
                return; // Stop processing if indicated
            }
        }
    }

    /* Processes HTML content from paste operation */
    private processHtmlPaste(
        e: NotifyArgs, value: string,
        args: { [key: string]: string | NotifyArgs },
        allowedTypes: string[],
        imageproperties: string | object
    ): boolean {
        let processedValue: string = value;
        let shouldContinue: boolean = true;
        // Handle empty HTML content (plain text or image)
        if (value.length === 0) {
            const result: { value: string, shouldContinue: boolean } =
                this.handleEmptyHtmlValue(e, value, args, allowedTypes, imageproperties);
            processedValue = result.value;
            shouldContinue = result.shouldContinue;
            if (!shouldContinue) {
                return false; // Stop processing
            }
        } else if (value.length > 0) { // Handle non-empty HTML content
            processedValue = this.handleNonEmptyHtmlValue(e, value, args);
        }
        // Remove base tags from content
        if (processedValue !== null && processedValue !== '') {
            processedValue = processedValue.replace(/<base[^>]*>/g, '');
        }
        this.prepareAndInsertContent(e, processedValue, args);
        return true;
    }

    /* Handles case when HTML value is empty but may contain plain text or images */
    private handleEmptyHtmlValue(
        e: NotifyArgs, value: string,
        args: { [key: string]: string | NotifyArgs },
        allowedTypes: string[],
        imageproperties: string | object
    ): { value: string, shouldContinue: boolean } {
        const htmlRegex: RegExp = new RegExp(/<\/[a-z][\s\S]*>/i);
        let processedValue: string = (e.args as ClipboardEvent).clipboardData.getData('text/plain');
        this.parent.trigger(events.beforePasteCleanup, {value : processedValue});
        this.isNotFromHtml = processedValue !== '' ? true : false;
        processedValue = processedValue.replace(/</g, '&lt;');
        processedValue = processedValue.replace(/>/g, '&gt;');
        this.containsHtml = htmlRegex.test(processedValue);
        this.plainTextContent = processedValue;
        // Check for image file in clipboard
        const file: File = this.pasteObj.extractFileFromClipboard(e);
        // Validate image type if file exists
        if (file) {
            const fileNameParts: string = file.name;
            const imgType: string = fileNameParts.substring(fileNameParts.lastIndexOf('.'));
            if (this.isInvalidImageType(imgType, allowedTypes)) {
                (e.args as ClipboardEvent).preventDefault();
                return { value: processedValue, shouldContinue: false }; // Signal to stop processing
            }
        }
        // Process paste with potential image
        const result: { value: string, shouldContinue: boolean } =
            this.processPasteWithImage(e, file, processedValue, args, imageproperties, htmlRegex);
        return result;
    }

    /* Checks if image type is not in allowed types */
    private isInvalidImageType(imgType: string, allowedTypes: string[]): boolean {
        return allowedTypes.every((type: string) => type.toLowerCase() !== imgType);
    }

    /* Processes paste operation that may contain an image */
    private processPasteWithImage(
        e: NotifyArgs, file: File, value: string,
        args: { [key: string]: string | NotifyArgs },
        imageproperties: string | object,
        htmlRegex: RegExp
    ): { value: string, shouldContinue: boolean } {
        let processedValue: string = value;
        //let shouldContinue: boolean = true;
        this.parent.notify(events.paste, {
            file: file,
            args: e.args,
            text: processedValue,
            callBack: (b: string | object) => {
                imageproperties = b;
                if (typeof (imageproperties) === 'object') {
                    this.parent.formatter.editorManager.execCommand(
                        'Images',
                        'Image',
                        e.args,
                        this.imageFormatting.bind(this, args),
                        'pasteCleanup',
                        imageproperties,
                        'pasteCleanupModule');
                } else {
                    processedValue = imageproperties as string;
                }
            }
        });
        // Format plain text with line breaks if not HTML
        if (!htmlRegex.test(processedValue)) {
            const divElement: HTMLElement = this.parent.createElement('div');
            divElement.innerHTML = this.pasteObj.splitBreakLine(processedValue);
            processedValue = divElement.innerHTML;
        }
        return { value: processedValue, shouldContinue: true };
    }

    /* Handles non-empty HTML content */
    private handleNonEmptyHtmlValue(
        e: NotifyArgs, value: string,
        args: { [key: string]: string | NotifyArgs }
    ): string {
        let processedValue: string = value;
        this.parent.trigger(events.beforePasteCleanup, {value : processedValue});
        this.parent.formatter.editorManager.observer.notify(EVENTS.MS_WORD_CLEANUP, {
            args: e.args,
            text: e.text,
            allowedStylePropertiesArray: this.parent.pasteCleanupSettings.allowedStyleProps,
            callBack: (a: string, cropImageData: CropImageDataItem[], pasteTableSource?: string) => {
                args.pasteTableSource = pasteTableSource;
                processedValue = a.trim();
                this.cropImageData = cropImageData;
            }
        });
        return processedValue;
    }

    /* Prepares and inserts content into the editor */
    private prepareAndInsertContent(
        e: NotifyArgs, value: string,
        args: { [key: string]: string | NotifyArgs }
    ): void {
        this.contentModule = this.renderFactory.getRenderer(RenderType.Content);
        const currentDocument: Document = this.contentModule.getDocument();
        const range: Range = this.nodeSelectionObj.getRange(currentDocument);
        this.saveSelection = this.nodeSelectionObj.save(range, currentDocument);
        // Process content through temp div
        const tempDivElem: HTMLElement = this.parent.createElement('div') as HTMLElement;
        tempDivElem.innerHTML = value;
        // Handle unsupported images
        this.processUnsupportedImages(tempDivElem);
        const processedValue: string = tempDivElem.innerHTML;
        // Check if content is not empty
        const isValueNotEmpty: boolean = tempDivElem.textContent !== '' ||
            !isNOU(tempDivElem.querySelector('img')) ||
            !isNOU(tempDivElem.querySelector('table'));
        // Clean up resize elements
        let finalValue: string = processedValue;
        this.parent.notify(events.cleanupResizeElements, {
            value: processedValue,
            callBack: (currentValue: string) => {
                finalValue = currentValue;
            }
        });
        // Removes the \n from the value
        finalValue = cleanHTMLString(finalValue, this.parent.element);
        // Handle paste based on settings
        this.handlePasteBasedOnSettings(e, finalValue, args, isValueNotEmpty);
    }

    /* Processes unsupported images in pasted content */
    private processUnsupportedImages(tempDivElem: HTMLElement): void {
        const unsupportedImg: NodeListOf<HTMLImageElement> = tempDivElem.querySelectorAll('.e-rte-image-unsupported');
        for (let index: number = 0; index < unsupportedImg.length; index++) {
            unsupportedImg[index as number].setAttribute('alt', this.i10n.getConstant('unsupportedImage'));
            unsupportedImg[index as number].classList.remove('e-rte-image-unsupported');
        }
    }

    /* Handles paste based on editor settings */
    private handlePasteBasedOnSettings(
        e: NotifyArgs, value: string,
        args: { [key: string]: string | NotifyArgs },
        isValueNotEmpty: boolean
    ): void {
        if (this.parent.pasteCleanupSettings.prompt && !e.isPlainPaste) {
            if (isValueNotEmpty) {
                (e.args as ClipboardEvent).preventDefault();
                this.pasteDialog(value, args);
            }
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

    /* Processes and uploads images from pasted content */
    private imgUploading(elm: HTMLElement): void {
        const allImgElm: NodeListOf<HTMLImageElement> = elm.querySelectorAll('.pasteContent_Img');
        // Handle image upload if save URL is configured and images exist
        if (this.parent.insertImageSettings.saveUrl && allImgElm.length > 0) {
            this.processImagesWithSaveUrl(allImgElm);
        } else if (this.parent.insertImageSettings.saveFormat === 'Blob') {
            // Convert to blob format if specified
            this.pasteObj.getBlob(allImgElm);
        }
        // Clean up temporary CSS classes from images
        this.cleanupImageClasses(elm, allImgElm);
    }

    /* Processes images when save URL is configured */
    private processImagesWithSaveUrl(allImgElm: NodeListOf<HTMLImageElement>): void {
        const base64Src: string[] = [];
        const imgName: string[] = [];
        const uploadImg: Element[] = [];
        // Collect base64 images
        for (let i: number = 0; i < allImgElm.length; i++) {
            const imgSrc: string = allImgElm[i as number].getAttribute('src');
            if (!isNOU(imgSrc) && imgSrc.split(',')[0].indexOf('base64') >= 0) {
                base64Src.push(imgSrc);
                imgName.push(getUniqueID('rte_image'));
                uploadImg.push(allImgElm[i as number]);
            }
        }
        // Convert base64 to files
        const fileList: File[] = [];
        for (let i: number = 0; i < base64Src.length; i++) {
            fileList.push(this.pasteObj.base64ToFile(base64Src[i as number], imgName[i as number]));
        }
        // Upload each file
        for (let i: number = 0; i < fileList.length; i++) {
            this.uploadMethod(fileList[i as number], uploadImg[i as number]);
        }
        // Convert to blob if needed
        if (isNOU(this.parent.insertImageSettings.path) &&
            this.parent.insertImageSettings.saveFormat === 'Blob') {
            this.pasteObj.getBlob(allImgElm);
        }
    }

    /* Removes temporary CSS classes from processed images */
    private cleanupImageClasses(elm: HTMLElement, allImgElm: NodeListOf<HTMLImageElement>): void {
        const allImgElmId: NodeListOf<Element> = elm.querySelectorAll('.pasteContent_Img');
        for (let i: number = 0; i < allImgElmId.length; i++) {
            allImgElmId[i as number].classList.remove('pasteContent_Img');
            // Remove class attribute if empty
            if (allImgElmId[i as number].getAttribute('class').trim() === '') {
                allImgElm[i as number].removeAttribute('class');
            }
        }
    }

    /* Enables or disables the toolbar based on state */
    private toolbarEnableDisable(state: boolean): void {
        if (!this.parent.inlineMode.enable && this.parent.toolbarModule && this.parent.toolbarModule.baseToolbar) {
            if (state) {
                // To disable toolbar items
                this.parent.toolbarModule.baseToolbar.toolbarObj.disable(state);
            } else {
                const mediaPopups: NodeListOf<Element> = this.parent.element.querySelectorAll('.e-rte-upload-popup');
                if (mediaPopups.length === 0) {
                    //To enable Toolbar items
                    this.parent.toolbarModule.baseToolbar.toolbarObj.disable(state);
                }
            }
        }
    }

    /* Handles the upload process for an image file */
    private uploadMethod(file: File, imgElem: Element): void {
        this.pasteObj.setImageOpacity(imgElem);
        const popupObj: Popup = this.createPopupObject(imgElem, file);
        this.createUploader(imgElem, popupObj, file);
        this.hideFileSelectWrapper(popupObj);
    }

    /* Creates and configures the popup object */
    private createPopupObject(imgElem: Element, file: File): Popup {
        const popupEle: HTMLElement = this.pasteObj.createPopupElement();
        popupEle.setAttribute('id', getUniqueID(this.parent.getID() + '_upload_popup'));
        const boundObj: PopupRootBound = { popupRoot: popupEle, self: this };
        const contentEle: HTMLInputElement | HTMLElement = this.parent.createElement('input', {
            id: getUniqueID(this.parent.getID() + '_upload'), attrs: { type: 'File', name: 'UploadFiles' }
        });
        const popup: Popup = new Popup(popupEle, {
            relateTo: imgElem as HTMLElement,
            height: '85px',
            width: '300px',
            content: contentEle,
            viewPortElement: this.parent.inputElement,
            enableRtl: this.parent.enableRtl,
            zIndex: 10001,
            close: this.onPopupClose.bind(boundObj)
        });
        this.configurePopupStyles(popup);
        this.schedulePopupRefresh(imgElem, file, popup);
        return popup;
    }

    /* Handle uploader popup close behavior */
    private onPopupClose(): void {
        const currentPopupElem: HTMLElement = (this as unknown as PopupRootBound).popupRoot;
        const currentPasteCleanupObj: PopupUploader | PasteCleanup = (this as unknown as PopupRootBound).self;
        if (!isNOU(currentPopupElem) && !isNOU(currentPasteCleanupObj)) {
            const popupObj: Popup = getComponent(currentPopupElem, 'popup') as Popup;
            (currentPasteCleanupObj as PasteCleanup).parent.isBlur = false;
            if (isNOU(popupObj)) { return; }
            const uploaderObj : Uploader = (currentPasteCleanupObj as PasteCleanup).getUploaderInstance(currentPopupElem);
            if (isNOU(uploaderObj)) { return; }
            uploaderObj.destroy();
            popupObj.destroy();
            detach(currentPopupElem);
        }
    }

    /* To get the uploader object from popup element */
    private getUploaderInstance(element: HTMLElement): Uploader {
        const currentUploader: HTMLElement = element.querySelector('.e-uploader') as HTMLElement;
        return getComponent(currentUploader, 'uploader');
    }

    /* Configures popup styles and CSS classes */
    private configurePopupStyles(popup: Popup): void {
        if (isNOU(popup) || isNOU(popup.element)) { return; }
        popup.element.style.display = 'none';
        addClass([popup.element], [classes.CLS_POPUP_OPEN, classes.CLS_RTE_UPLOAD_POPUP]);
        if (!isNOU(this.parent.cssClass)) {
            addClass([popup.element], this.parent.cssClass.replace(/\s+/g, ' ').trim().split(' '));
        }
    }

    /* Schedules popup refresh based on file size */
    private schedulePopupRefresh(imgElem: Element, file: File, popupObj: Popup): void {
        const timeOut: number = file.size > 1000000 ? 300 : 100;
        this.refreshPopupTime = setTimeout(() => {
            this.refreshPopup(imgElem as HTMLElement, popupObj);
        }, timeOut);
    }

    /* Creates and configures the uploader component */
    private createUploader(imgElem: Element, popup: Popup, file: File): Uploader {
        const uploadObj: Uploader = new Uploader({
            asyncSettings: {
                saveUrl: this.parent.insertImageSettings.saveUrl,
                removeUrl: this.parent.insertImageSettings.removeUrl
            },
            cssClass: classes.CLS_RTE_DIALOG_UPLOAD,
            allowedExtensions: this.parent.insertImageSettings.allowedTypes.toString(),
            success: (e: ImageSuccessEventArgs) => {
                this.popupClose(popup, imgElem, e);
            },
            uploading: (e: UploadingEventArgs) => this.handleUploading(e, imgElem, popup),
            beforeUpload: (args: BeforeUploadEventArgs) => this.handleBeforeUpload(args),
            failure: (e: Object) => this.handleFailure(e, imgElem, popup),
            canceling: () => this.handleCanceling(imgElem, popup),
            selected: (e: SelectedEventArgs) => { e.cancel = true; },
            removing: () => this.handleRemoving(imgElem, popup)
        });
        uploadObj.appendTo(popup.element.childNodes[0] as HTMLElement);
        this.initializeUpload(file, uploadObj);
        return uploadObj;
    }

    /* Handles the uploading event */
    private handleUploading(e: UploadingEventArgs, imgElem: Element, popupObj: Popup): void {
        if (!this.parent.isServerRendered) {
            this.parent.trigger(events.imageUploading, e, (imageUploadingArgs: UploadingEventArgs) => {
                if (imageUploadingArgs.cancel) {
                    if (!isNullOrUndefined(imgElem)) {
                        detach(imgElem);
                    }
                    if (!isNullOrUndefined(popupObj.element)) {
                        detach(popupObj.element);
                    }
                }
            });
        }
    }

    /* Handles the beforeUpload event */
    private handleBeforeUpload(args: BeforeUploadEventArgs): void {
        this.parent.trigger(events.beforeImageUpload, args);
        this.toolbarEnableDisable(true);
    }

    /* Handles upload failure */
    private handleFailure(e: Object, imgElem: Element, popupObj: Popup): void {
        this.failureTime = setTimeout(() => {
            this.uploadFailure(imgElem, popupObj, e);
        }, 900);
    }

    /* Handles upload cancellation */
    private handleCanceling(imgElem: Element, popupObj: Popup): void {
        if (imgElem.nextSibling && imgElem.nextSibling.textContent === ' ') {
            detach(imgElem.nextSibling);
        }
        detach(imgElem);
        popupObj.close();
    }

    /* Handles file removal */
    private handleRemoving(imgElem: Element, popupObj: Popup): void {
        if (imgElem.nextSibling && imgElem.nextSibling.textContent === ' ') {
            detach(imgElem.nextSibling);
        }
        detach(imgElem);
        popupObj.close();
    }

    /* Initializes the upload process */
    private initializeUpload(file: File, uploadObj: Uploader): void {
        const fileInfo: FileInfo[] = [{
            name: file.name,
            rawFile: file,
            size: file.size,
            type: file.type,
            status: 'Ready to Upload',
            validationMessages: { minSize: '', maxSize: ''},
            statusCode: '1'
        }];
        uploadObj.createFileList(fileInfo);
        uploadObj.upload(fileInfo);
    }

    /* Hides the file select wrapper */
    private hideFileSelectWrapper(popupObj: Popup): void {
        if (isNOU(popupObj) || isNOU(popupObj.element)) { return; }
        const fileSelectWrap: HTMLElement = popupObj.element.getElementsByClassName('e-file-select-wrap')[0] as HTMLElement;
        if (fileSelectWrap) {
            fileSelectWrap.style.display = 'none';
        }
    }

    /* Handles image upload failure */
    private uploadFailure(imgElem: Element, popupObj: Popup, e: Object): void {
        if ((this.parent && this.parent.isDestroyed) || isNOU(popupObj)) {
            return;
        }
        detach(imgElem);
        popupObj.close();
        this.parent.trigger(events.imageUploadFailed, e);
    }

    /* Handles popup close after successful upload */
    private popupClose(popupObj: Popup, imgElem: Element, e: ImageSuccessEventArgs): void {
        this.prepareEventArgs(e, imgElem);
        this.handleUploadStatus(e, imgElem);
        this.scheduleCleanup(popupObj, imgElem);
    }

    /* Prepares event arguments for upload events */
    private prepareEventArgs(e: ImageSuccessEventArgs, imgElem: Element): void {
        e.element = imgElem as HTMLElement;
        e.detectImageSource = ImageInputSource.Pasted;
    }

    /* Handles different upload status codes */
    private handleUploadStatus(e: ImageSuccessEventArgs, imgElem: Element): void {
        const element: FileInfo = e.file;
        if (isNOU(element)) { return; }
        if (element.statusCode === '2') {
            this.handleSuccessfulUpload(e, imgElem);
        } else if (element.statusCode === '5') {
            this.handleImageRemoval(e);
        }
    }

    /* Handles successful image upload */
    private handleSuccessfulUpload(e: ImageSuccessEventArgs, imgElem: Element): void {
        this.parent.trigger(events.imageUploadSuccess, e, (e: object) => {
            if (!isNullOrUndefined(this.parent.insertImageSettings.path)) {
                const url: string = this.parent.insertImageSettings.path + (e as MetaData).file.name;
                this.updateImageSource(imgElem, url, (e as MetaData).file.name);
            }
        });
    }

    /* Updates image source after successful upload */
    private updateImageSource(imgElem: Element, url: string, altText: string): void {
        // Handle detached images with ID
        if (!this.parent.inputElement.contains(imgElem) && imgElem.id) {
            const imgHtmlElems: NodeListOf<HTMLElement> = this.parent.inputElement.querySelectorAll('#' + imgElem.id);
            this.updateDetachedImages(imgHtmlElems, url, altText);
        } else {
            (imgElem as HTMLImageElement).src = url;
            imgElem.setAttribute('alt', altText);
        }
    }

    /* Updates detached images by ID */
    private updateDetachedImages(imgHtmlElems: NodeListOf<HTMLElement>, url: string, altText: string): void {
        for (let i: number = 0; i < imgHtmlElems.length; i++) {
            const imgHtmlElem: HTMLElement = imgHtmlElems[i as number];
            if (imgHtmlElem && imgHtmlElem.style && imgHtmlElem.style.opacity === '0.5') {
                (imgHtmlElem as HTMLImageElement).src = url;
                imgHtmlElem.setAttribute('alt', altText);
            }
        }
    }

    /* Handles image removal */
    private handleImageRemoval(e: ImageSuccessEventArgs): void {
        this.parent.trigger(events.imageRemoving, e, (e: object) => {
            if (!isNullOrUndefined((e as { element: HTMLImageElement }).element.src)) {
                (e as { element: HTMLImageElement }).element.src = '';
            }
        });
    }

    /* Schedules cleanup after upload completion */
    private scheduleCleanup(popupObj: Popup, imgElem: Element): void {
        popupObj.close();
        this.resetImageOpacity(imgElem);
        this.toolbarEnableDisable(false);
    }

    /* Resets image opacity after upload */
    private resetImageOpacity(imgElem: Element): void {
        if (!this.parent.inputElement.contains(imgElem) && (imgElem.id || (imgElem as HTMLImageElement).alt)) {
            this.resetDetachedImageOpacity(imgElem);
        } else {
            (imgElem as HTMLElement).style.opacity = '1';
        }
    }

    /* Resets opacity for detached images */
    private resetDetachedImageOpacity(imgElem: Element): void {
        const selector: string | null = imgElem.id ?
            `#${imgElem.id}` :
            `[alt="${(imgElem as HTMLImageElement).alt}"]`;
        if (selector) {
            const imgHtmlElems: NodeListOf<HTMLElement> = this.parent.inputElement.querySelectorAll(selector);
            for (let i: number = 0; i < imgHtmlElems.length; i++) {
                const imgHtmlElem: HTMLElement = imgHtmlElems[i as number];
                if (imgHtmlElem && imgHtmlElem.style && imgHtmlElem.style.opacity === '0.5') {
                    (imgHtmlElem as HTMLImageElement).style.opacity = '1';
                }
            }
        }
    }

    /* Refreshes popup position relative to image */
    private refreshPopup(imageElement: HTMLElement, popupObj: Popup): void {
        const imgPosition: number = this.calculateImagePosition(imageElement);
        const rtePosition: number = this.parent.element.offsetTop + this.parent.element.offsetHeight;
        if (imgPosition > rtePosition) {
            this.positionPopupAtTop(popupObj);
        } else {
            this.positionPopupAtImage(popupObj, imageElement);
        }
    }

    /* Calculates image position considering iframe */
    private calculateImagePosition(imageElement: HTMLElement): number {
        return this.parent.iframeSettings.enable ?
            this.parent.element.offsetTop + imageElement.offsetTop :
            imageElement.offsetTop;
    }

    /* Positions popup at the top of editor */
    private positionPopupAtTop(popupObj: Popup): void {
        popupObj.offsetY = this.parent.iframeSettings.enable ? -30 : -65;
        popupObj.element.style.display = 'block';
    }

    /* Positions popup relative to image */
    private positionPopupAtImage(popupObj: Popup, imageElement: HTMLElement): void {
        if (popupObj) {
            popupObj.refreshPosition(imageElement);
            popupObj.element.style.display = 'block';
        }
    }

    /* Method for image formatting when pasting */
    private imageFormatting(pasteArgs: Object, imgElement: { [key: string]: Element[] }): void {
        const imgElem: Element = imgElement.elements[0];
        if (!isNOU(imgElem.getAttribute('src'))) {
            imgElem.classList.add('pasteContent_Img');
        }
        const imageElement: HTMLElement = this.parent.createElement('span');
        imageElement.appendChild(imgElem);
        const imageValue: string = imageElement.innerHTML;
        this.contentModule = this.renderFactory.getRenderer(RenderType.Content);
        const currentDocument: Document = this.contentModule.getDocument();
        const range: Range = this.nodeSelectionObj.getRange(currentDocument);
        this.saveSelection = this.nodeSelectionObj.save(range, currentDocument);
        const settings: PasteCleanupSettingsModel = this.parent.pasteCleanupSettings;
        if (settings.prompt) {
            this.pasteDialog(imageValue, pasteArgs);
        } else if (settings.plainText) {
            this.plainFormatting(imageValue, pasteArgs);
        } else if (settings.keepFormat) {
            this.formatting(imageValue, false, pasteArgs);
        } else {
            this.formatting(imageValue, true, pasteArgs);
        }
    }

    /* Renders radio buttons for paste formatting options. */
    private radioRender(): void {
        this.keepRadioButton = new RadioButton({ label: this.i10n.getConstant('keepFormat'),
            name: 'pasteOption', checked: true });
        this.keepRadioButton .isStringTemplate = true;
        const keepFormatElement: HTMLElement = this.parent.element.querySelector('#keepFormating');
        this.keepRadioButton.appendTo(keepFormatElement);
        this.cleanRadioButton = new RadioButton({ label: this.i10n.getConstant('cleanFormat'), name: 'pasteOption' });
        this.cleanRadioButton.isStringTemplate = true;
        const cleanFormatElement: HTMLElement = this.parent.element.querySelector('#cleanFormat');
        this.cleanRadioButton.appendTo(cleanFormatElement);
        this.plainTextRadioButton = new RadioButton({ label: this.i10n.getConstant('plainText'), name: 'pasteOption' });
        this.plainTextRadioButton.isStringTemplate = true;
        const plainTextElement: HTMLElement = this.parent.element.querySelector('#plainTextFormat');
        this.plainTextRadioButton.appendTo(plainTextElement);
    }

    private selectFormatting(
        value: string, args: Object,
        keepChecked: boolean, cleanChecked: boolean
    ): void {
        if (keepChecked) {
            this.formatting(value, false, args);
        } else if (cleanChecked) {
            this.formatting(value, true, args);
        } else {
            this.plainFormatting(value, args);
        }
    }

    /* Shows the dialog for paste formatting options. */
    private pasteDialog(value: string, args: object): void {
        this.dialogObj = this.dialogRenderObj.render(this.getDialogModel(value, args));
        let rteDialogWrapper: HTMLElement | null = this.parent.element.querySelector('#' + this.parent.getID() + '_pasteCleanupDialog');
        if (rteDialogWrapper && rteDialogWrapper.innerHTML !== '') {
            this.destroyDialog(rteDialogWrapper);
        }
        if (!rteDialogWrapper) {
            rteDialogWrapper = this.parent.createElement('div', {
                id: this.parent.getID() + '_pasteCleanupDialog'
            }) as HTMLElement;
            this.parent.rootContainer.appendChild(rteDialogWrapper);
        }
        this.dialogObj.appendTo(rteDialogWrapper);
        this.radioRender();
        this.dialogObj.show();
        this.setCssClass({ cssClass: this.parent.getCssClass() });
    }

    /* Returns the dialog model configuration. */
    private getDialogModel(value: string, args: object): DialogModel {
        return {
            buttons: [
                this.getOkButton(value, args),
                this.getCancelButton()
            ],
            header: this.i10n.getConstant('pasteFormat'),
            content: this.getDialogContent(),
            target: this.parent.element,
            width: '300px',
            height: '265px',
            cssClass: CLS_RTE_DIALOG_MIN_HEIGHT,
            isModal: Browser.isDevice as boolean,
            visible: false
        };
    }

    /* Creates the OK button configuration for the dialog. */
    private getOkButton(value: string, args: object): Object {
        return {
            click: (): void => {
                if (!this.dialogObj.isDestroyed) {
                    const keepChecked: boolean = !!(this.parent.element.querySelector('#keepFormating') as HTMLInputElement).checked;
                    const cleanChecked: boolean = !!(this.parent.element.querySelector('#cleanFormat') as HTMLInputElement).checked;
                    this.closeDialog();
                    this.selectFormatting(value, args, keepChecked, cleanChecked);
                }
            },
            buttonModel: {
                isPrimary: true,
                cssClass: 'e-flat ' + CLS_RTE_PASTE_OK,
                content: this.i10n.getConstant('pasteDialogOk')
            }
        };
    }

    /* Creates the Cancel button configuration for the dialog. */
    private getCancelButton(): Object {
        return {
            click: (): void => {
                if (!this.dialogObj.isDestroyed) {
                    this.closeDialog();
                }
            },
            buttonModel: {
                cssClass: 'e-flat ' + CLS_RTE_PASTE_CANCEL,
                content: this.i10n.getConstant('pasteDialogCancel')
            }
        };
    }

    /* Closes and destroys the dialog. */
    private closeDialog(): void {
        this.dialogObj.hide();
        const dialogRef: Dialog = this.dialogObj;
        this.dialogRenderObj.close(dialogRef);
        this.dialogObj.destroy();
    }

    /* Returns the HTML content for the dialog. */
    private getDialogContent(): string {
        return `${this.i10n.getConstant('pasteFormatContent')}<br/><div>
            <div class="e-rte-radio-keep-format">
                <input type="radio" class="${CLS_RTE_PASTE_KEEP_FORMAT}" id="keepFormating"/>
            </div>
            <div class="e-rte-radio-remove-format">
                <input type="radio" class="${CLS_RTE_PASTE_REMOVE_FORMAT}" id="cleanFormat"/>
            </div>
            <div class="e-rte-radio-plain-format">
                <input type="radio" class="${CLS_RTE_PASTE_PLAIN_FORMAT}" id="plainTextFormat"/>
            </div>
        </div>`;
    }

    /* Updates CSS classes on a component. */
    private updateCss(currentObj: Dialog | Uploader | RadioButton, e: ICssClassArgs) : void {
        if (currentObj && e.cssClass) {
            if (isNullOrUndefined(e.oldCssClass)) {
                currentObj.setProperties({ cssClass: (currentObj.cssClass + ' ' + e.cssClass).trim() });
            } else {
                currentObj.setProperties({ cssClass: (currentObj.cssClass.replace(e.oldCssClass, '').trim() + ' ' + e.cssClass).trim() });
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/tslint/config
    private setCssClass(e: ICssClassArgs) {
        const mediaPopups: NodeListOf<Element> = this.parent.element.querySelectorAll('.e-rte-upload-popup');
        for (let i: number = 0; i < mediaPopups.length; i++) {
            const uploader: Uploader = this.getUploaderInstance(mediaPopups[i as number] as HTMLElement);
            if (uploader && !uploader.isDestroyed) {
                this.updateCss(uploader, e);
            }
            const popup: Popup = getComponent(mediaPopups[i as number] as HTMLElement, 'popup') as Popup;
            if (popup && !popup.isDestroyed && e.cssClass) {
                if (e.oldCssClass) {
                    removeClass([popup.element], e.oldCssClass);
                }
                addClass([popup.element], e.cssClass);
            }
        }
        this.updateCss(this.dialogObj, e);
        this.updateCss(this.plainTextRadioButton, e);
        this.updateCss(this.cleanRadioButton, e);
        this.updateCss(this.keepRadioButton, e);
    }

    /* Removes the dialog container and its child elements. */
    private destroyDialog(rteDialogWrapper: HTMLElement): void {
        const rteDialogContainer: HTMLElement = this.parent.element.querySelector('.e-rte-dialog-minheight');
        if (rteDialogContainer) {
            detach(rteDialogContainer);
        }
        while (rteDialogWrapper.firstChild) {
            detach(rteDialogWrapper.firstChild as HTMLElement);
        }
    }

    /* Handles document click to hide dialog if clicked outside. */
    private docClick(e: { [key: string]: object }): void {
        const target: HTMLElement = (e.args as MouseEvent).target as HTMLElement;
        if (
            target &&
            target.classList &&
            this.dialogObj &&
            !closest(target, `[id='${this.dialogObj.element.id}']`) &&
            !target.classList.contains('e-toolbar-item')
        ) {
            this.dialogObj.hide();
        }
    }

    /* Processes and sanitizes pasted content based on cleanup settings, image handling, sanitization, and custom callbacks. */
    private formatting(value: string, clean: boolean, args: Object): void {
        let clipBoardElem: HTMLElement = this.parent.createElement(
            'div', { className: 'pasteContent', styles: 'display:inline;' }
        ) as HTMLElement;
        // If plain text paste contains HTML, split lines appropriately
        if (this.isNotFromHtml && this.containsHtml) {
            value = this.pasteObj.splitBreakLine(value);
        }
        clipBoardElem.innerHTML = value;
        clipBoardElem = this.pasteObj.cleanAppleClass(clipBoardElem);
        // Remove denied tags and attributes as per settings
        clipBoardElem = this.pasteObj.cleanupDeniedTagsAndAttributes(clipBoardElem, clean);
        // Restrict allowed CSS style properties if configured
        if (this.parent.pasteCleanupSettings.allowedStyleProps !== null) {
            clipBoardElem = this.pasteObj.allowedStyle(clipBoardElem);
        }
        this.saveSelection.restore();
        let newText: string = clipBoardElem.innerHTML;
        if (this.parent.enableHtmlSanitizer) { // Sanitize innerHTML and ensure ampersands
            newText = clipBoardElem.innerHTML.split('&').join('&amp;');
        }
        clipBoardElem.innerHTML = sanitizeHelper(newText, this.parent);
        this.pasteObj.setImageClassAndProps(clipBoardElem);
        // Handle pasted <picture> elements if present
        if (this.pasteObj.hasPictureElement(clipBoardElem)) {
            this.pasteObj.processPictureElement(clipBoardElem);
        }
        // Process paste content, image conversion & emit callbacks if present
        if (this.pasteObj.hasContentToPaste(clipBoardElem)) {
            this.handlePastedImagesAndEvents(clipBoardElem, value, args);
        }
    }

    private handlePastedImagesAndEvents(clipBoardElem: HTMLElement, value: string, args: Object): void {
        // Based on the information in your clipboard, the function below is refactored for better readability.
        const tempWrapperElem: HTMLElement = this.parent.createElement('div') as HTMLElement;
        tempWrapperElem.innerHTML = value;
        const filesData: FileInfo[] = this.pasteObj.collectBase64ImageFiles(tempWrapperElem);
        this.parent.trigger(
            events.afterPasteCleanup,
            { value: clipBoardElem.innerHTML, filesData: filesData },
            (updatedArgs: PasteCleanupArgs) => { value = updatedArgs.value; }
        );
        clipBoardElem.innerHTML = this.parent.addAnchorAriaLabel(value);
        clipBoardElem = this.pasteObj.addTableClass(clipBoardElem, (args as NotifyArgs).pasteTableSource);
        this.execPasteCommand(clipBoardElem, args);
        this.parent.notify(events.autoResize, {});
        scrollToCursor(this.parent.contentModule.getDocument(), this.parent.inputElement);
        this.pasteObj.removeTempClass();
        this.parent.notify(events.toolbarRefresh, {});
        this.pasteObj.cropImageHandler(this.parent.inputElement);
    }

    private execPasteCommand(clipBoardElem: HTMLElement, args: Object): void {
        this.parent.formatter.editorManager.execCommand(
            'inserthtml',
            'pasteCleanup',
            args,
            (returnArgs: IHtmlFormatterCallBack) => {
                extend(args, {
                    elements: returnArgs.elements, imageElements: returnArgs.imgElem
                }, true);
                this.parent.formatter.onSuccess(this.parent, args);
            },
            clipBoardElem, null, null, this.parent.enterKey
        );
    }

    private getCropImageData(): CropImageDataItem[] {
        return this.cropImageData;
    }

    /* Handles the pasting of plain text content into the rich text editor. */
    private plainFormatting(value: string, args: Object): void {
        const clipBoardElem: HTMLElement = this.parent.createElement(
            'div', { className: 'pasteContent'}
        ) as HTMLElement;
        this.plainTextContent = this.plainTextContent.replace(/</g, '&lt;');
        this.plainTextContent = this.plainTextContent.replace(/>/g, '&gt;');
        const sanitizedContent: string = sanitizeHelper(this.plainTextContent, this.parent);
        const splitContent: string = this.pasteObj.splitBreakLine(sanitizedContent);
        clipBoardElem.innerHTML = splitContent;
        if (clipBoardElem.textContent.trim() !== '') {
            this.saveSelection.restore();
            this.parent.trigger(
                events.afterPasteCleanup,
                { value : clipBoardElem.innerHTML, filesData: null },
                (updatedArgs: PasteCleanupArgs) => { value = updatedArgs.value; }
            );
            clipBoardElem.innerHTML = value;
            this.parent.formatter.editorManager.execCommand(
                'inserthtml',
                'pasteCleanup',
                args,
                (returnArgs: IHtmlFormatterCallBack) => {
                    extend(args, { elements: returnArgs.elements, imageElements: returnArgs.imgElem }, true);
                    this.parent.formatter.onSuccess(this.parent, args);
                },
                clipBoardElem, null, null, this.parent.enterKey
            );
            this.pasteObj.removeTempClass();
        } else {
            this.saveSelection.restore();
            extend(args, { elements: [] }, true);
            this.parent.formatter.onSuccess(this.parent, args);
        }
    }


    /**
     * For internal use only - Get the module name.
     *
     * @returns {void}
     * @hidden
     */
    private getModuleName(): string {
        return 'pasteCleanup';
    }
}
