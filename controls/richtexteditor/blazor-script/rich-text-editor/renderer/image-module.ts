import { addClass, Browser, closest, createElement, detach, EventHandler, isNullOrUndefined as isNOU, KeyboardEventArgs, removeClass, select } from '../../../base'; /*externalscript*/
import { FileInfo } from '../../../inputs/src'; /*externalscript*/
import { ClickEventArgs } from '../../../navigations/src'; /*externalscript*/
import { ImageOrTableCursor } from '../../src/common';
import { imageResizeFactor } from '../../src/common/config';
import { IImageResizeFactor, ImageDimension } from '../../src/common/interface';
import { isIDevice } from '../../src/common/util';
import { ActionBeginEventArgs, IDropDownItemModel, IImageCommandsArgs, ImageDragEvent, IShowPopupArgs, IToolbarItemModel, NotifyArgs, OffsetPosition, ResizeArgs, DialogCloseEventArgs } from '../../src/common/interface';
import { NodeSelection } from '../../src/selection/selection';
import { QuickToolbar } from '../actions/quick-toolbar';
import * as classes from '../classes';
import { CLS_RTE_IMG_BOX_MARK } from '../classes';
import * as events from '../constant';
import { AfterImageDeleteEventArgs, IImageNotifyArgs, IShowImageDialog } from '../interfaces';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { dispatchEvent, parseHtml } from '../util';
import { convertToBlob } from '../../src/common/util';
import { ImageCommand } from '../../src/editor-manager/plugin/image';

/**
 * `Image` module is used to handle image actions.
 */
export class Image {
    private rteId: string;
    private dropFiles: FileList;
    private modifiedUrl: string;
    private isStreamUrl: boolean;
    private pageX: number = null;
    private pageY: number = null;
    private deletedImg: Node[] = [];
    private captionEle: HTMLElement;
    public imageDragArgs: DragEvent;
    private parent: SfRichTextEditor;
    private imgEle: HTMLImageElement;
    public imgResizeDiv: HTMLElement;
    private quickToolObj: QuickToolbar;
    private inputUrl: HTMLInputElement;
    private imgUploadSave: NodeSelection;
    public droppedImage: HTMLImageElement;
    private uploadUrl: IImageCommandsArgs;
    private selectionObj: IImageNotifyArgs;
    private imgUploadSelectedParent: Node[];
    private prevSelectedImgEle: HTMLImageElement;
    private resizeBtnStat: { [key: string]: boolean };
    private imgDupPos: { [key: string]: number | string };
    private buttonClickElement: HTMLElement;
    private removingImgName: string;
    private currentResizeHandler: string;
    private aspectRatio: number;

    constructor(parent?: SfRichTextEditor) {
        this.parent = parent;
        this.rteId = parent.element.id;
        this.addEventListener();
    }
    protected addEventListener(): void {
        this.parent.observer.on(events.keyUp, this.onKeyUp, this);
        this.parent.observer.on(events.docClick, this.docClick, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
        this.parent.observer.on(events.paste, this.imagePaste, this);
        this.parent.observer.on(events.keyDown, this.onKeyDown, this);
        this.parent.observer.on(events.imageSize, this.imageSize, this);
        this.parent.observer.on(events.imageCaption, this.caption, this);
        this.parent.observer.on(events.imageDelete, this.deleteImg, this);
        this.parent.observer.on(events.imageAlt, this.insertAltText, this);
        this.parent.observer.on(events.initialEnd, this.afterRender, this);
        this.parent.observer.on(events.imageLink, this.insertImgLink, this);
        this.parent.observer.on(events.insertImage, this.imageDialog, this);
        this.parent.observer.on(events.windowResize, this.onWindowResize, this);
        this.parent.observer.on(events.dropDownSelect, this.alignmentSelect, this);
        this.parent.observer.on(events.iframeMouseDown, this.onIframeMouseDown, this);
        this.parent.observer.on(events.imageToolbarAction, this.onToolbarAction, this);
        this.parent.observer.on(events.editAreaClick, this.editAreaClickHandler, this);
        this.parent.observer.on(events.insertCompleted, this.showImageQuickToolbar, this);
        this.parent.observer.on(events.bindOnEnd, this.bindOnEnd, this);
    }
    protected removeEventListener(): void {
        this.parent.observer.off(events.keyUp, this.onKeyUp);
        this.parent.observer.off(events.docClick, this.docClick);
        this.parent.observer.off(events.destroy, this.destroy);
        this.parent.observer.off(events.paste, this.imagePaste);
        this.parent.observer.off(events.keyDown, this.onKeyDown);
        this.parent.observer.off(events.imageSize, this.imageSize);
        this.parent.observer.off(events.imageCaption, this.caption);
        this.parent.observer.off(events.imageDelete, this.deleteImg);
        this.parent.observer.off(events.imageAlt, this.insertAltText);
        this.parent.observer.off(events.initialEnd, this.afterRender);
        this.parent.observer.off(events.imageLink, this.insertImgLink);
        this.parent.observer.off(events.insertImage, this.imageDialog);
        this.parent.observer.off(events.windowResize, this.onWindowResize);
        this.parent.observer.off(events.dropDownSelect, this.alignmentSelect);
        this.parent.observer.off(events.iframeMouseDown, this.onIframeMouseDown);
        this.parent.observer.off(events.imageToolbarAction, this.onToolbarAction);
        this.parent.observer.off(events.editAreaClick, this.editAreaClickHandler);
        this.parent.observer.off(events.insertCompleted, this.showImageQuickToolbar);
        this.parent.observer.off(events.bindOnEnd, this.bindOnEnd);
        const dropElement: HTMLElement | Document = this.parent.iframeSettings.enable ?
            this.parent.inputElement.ownerDocument : this.parent.inputElement;
        dropElement.removeEventListener('drop', this.dragDrop.bind(this), true);
        dropElement.removeEventListener('dragstart', this.dragStart.bind(this), true);
        dropElement.removeEventListener('dragenter', this.dragEnter.bind(this), true);
        dropElement.removeEventListener('dragover', this.dragOver.bind(this), true);
        if (!isNOU(this.parent.getEditPanel())) {
            EventHandler.remove(this.parent.getEditPanel(), Browser.touchEndEvent, this.imageClick);
            this.parent.formatter.editorManager.observer.off(events.checkUndo, this.undoStack);
            if (this.parent.insertImageSettings.resize) {
                EventHandler.remove(this.parent.getEditPanel(), Browser.touchStartEvent, this.resizeStart);
                EventHandler.remove(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick);
                EventHandler.remove(this.parent.getEditPanel(), 'cut', this.onCutHandler);
            }
        }
    }
    private bindOnEnd(): void {
        if (!this.parent.formatter.editorManager.imgObj) {
            this.parent.formatter.editorManager.imgObj = new ImageCommand(this.parent.formatter.editorManager);
        }
    }
    private docClick(e: { [key: string]: object }): void {
        const target: HTMLElement = <HTMLElement>(e.args as MouseEvent).target;
        const closestEle: Element = closest(target, 'img');
        const isExist: boolean = closestEle && this.parent.getEditPanel().contains(closestEle) ? true : false;
        if (target && target.tagName !== 'IMG' && !isExist &&
            closest(target, '.e-rte-quick-popup') === null && target.offsetParent &&
            !target.offsetParent.classList.contains('e-quick-dropdown') &&
            !target.offsetParent.classList.contains('e-rte-backgroundcolor-dropdown') && !closest(target, '.e-rte-dropdown-popup')
            && !closest(target, '.e-rte-elements')) {
            this.hideImageQuickToolbar();
        }
    }
    private afterRender(): void {
        EventHandler.add(this.parent.getEditPanel(), Browser.touchEndEvent, this.imageClick, this);
        if (this.parent.insertImageSettings.resize) {
            EventHandler.add(this.parent.getEditPanel(), Browser.touchStartEvent, this.resizeStart, this);
            EventHandler.add(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick, this);
            EventHandler.add(this.parent.getEditPanel(), 'cut', this.onCutHandler, this);
        }
        const dropElement: HTMLElement | Document = this.parent.iframeSettings.enable ? this.parent.inputElement.ownerDocument :
            this.parent.inputElement;
        dropElement.addEventListener('drop', this.dragDrop.bind(this), true);
        dropElement.addEventListener('dragstart', this.dragStart.bind(this), true);
        dropElement.addEventListener('dragenter', this.dragEnter.bind(this), true);
        dropElement.addEventListener('dragover', this.dragOver.bind(this), true);
    }
    private imageDialog(e: IImageNotifyArgs): void {
        this.parent.dotNetRef.invokeMethodAsync(events.closeImageDialog, null);
        this.uploadUrl = { url: '' };
        this.selectionObj = { selfImage: this, selection: e.selection, args: e.args, selectParent: e.selectParent };
        if ((!isNOU(this.parent.insertImageSettings.path) && this.parent.editorMode === 'Markdown')
            || this.parent.editorMode === 'HTML') {
            const iframe: boolean = this.parent.iframeSettings.enable;
            if (this.parent.editorMode === 'HTML' && (!iframe && isNOU(closest(e.selection.range.startContainer.parentNode, '#' +
                this.parent.getPanel().id))
                || (iframe && isNOU(e.selection.range.startContainer.parentNode.ownerDocument.querySelector('body'))))) {
                (this.parent.getEditPanel() as HTMLElement).focus();
                const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
                this.imgUploadSave = this.parent.formatter.editorManager.nodeSelection.save(
                    range, this.parent.getDocument());
                this.imgUploadSelectedParent = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            } else {
                this.imgUploadSave = e.selection; this.imgUploadSelectedParent = e.selectParent;
            }
        }
        let obj: IShowImageDialog;
        if (e.selectNode && e.selectNode[0].nodeName === 'IMG') {
            const regex: RegExp = new RegExp('([^\\S]|^)(((https?:\\/\\/)|(www\\.))(\\S+))', 'gi');
            obj = {
                mode: 'Edit',
                url: (e.selectNode[0] as HTMLImageElement).src.match(regex) ? (e.selectNode[0] as HTMLImageElement).src : ''
            };
        } else {
            obj = { mode: 'Insert' };
        }
        this.parent.dotNetRef.invokeMethodAsync(events.showImageDialog, obj);
        if (this.quickToolObj) {
            this.quickToolObj.hideImageQTBar();
            if (!isNOU(e.selectParent as Node[])) { removeClass([e.selectParent[0] as HTMLElement], 'e-img-focus'); }
            this.quickToolObj.hideInlineQTBar();
            if (!isNOU(this.quickToolObj.textQTBar) && !isNOU(this.quickToolObj.textQTBar.element) && this.quickToolObj.textQTBar.element.classList.contains('e-popup-open')) {
                this.quickToolObj.hideTextQTBar();
            }
        }
    }
    private checkImageBack(range: Range): void {
        if (range.startContainer.nodeName === '#text' && range.startOffset === 0 &&
            !isNOU(range.startContainer.previousSibling) && range.startContainer.previousSibling.nodeName === 'IMG') {
            this.deletedImg.push(range.startContainer.previousSibling);
        } else if (range.startContainer.nodeName !== '#text' && !isNOU(range.startContainer.childNodes[range.startOffset - 1]) &&
            range.startContainer.childNodes[range.startOffset - 1].nodeName === 'IMG') {
            this.deletedImg.push(range.startContainer.childNodes[range.startOffset - 1]);
        }
    }
    private checkImageDel(range: Range): void {
        if (range.startContainer.nodeName === '#text' && range.startOffset === range.startContainer.textContent.length &&
            !isNOU(range.startContainer.nextSibling) && range.startContainer.nextSibling.nodeName === 'IMG') {
            this.deletedImg.push(range.startContainer.nextSibling);
        } else if (range.startContainer.nodeName !== '#text' && !isNOU(range.startContainer.childNodes[range.startOffset]) &&
            range.startContainer.childNodes[range.startOffset].nodeName === 'IMG') {
            this.deletedImg.push(range.startContainer.childNodes[range.startOffset]);
        }
    }
    private getDropRange(x: number, y: number): Range {
        const startRange: Range = this.parent.getDocument().createRange();
        this.parent.formatter.editorManager.nodeSelection.setRange(this.parent.getDocument(), startRange);
        const elem: Element = this.parent.getDocument().elementFromPoint(x, y);
        const startNode: Node = (elem.childNodes.length > 0 ? elem.childNodes[0] : elem);
        let startCharIndexCharacter: number = 0;
        if ((this.parent.inputElement.firstChild as HTMLElement).innerHTML === '<br>') {
            startRange.setStart(startNode, startCharIndexCharacter);
            startRange.setEnd(startNode, startCharIndexCharacter);
        } else {
            let rangeRect: ClientRect;
            do {
                startCharIndexCharacter++;
                startRange.setStart(startNode, startCharIndexCharacter);
                startRange.setEnd(startNode, startCharIndexCharacter + 1);
                rangeRect = startRange.getBoundingClientRect();
            } while (rangeRect.left < x && startCharIndexCharacter < (startNode as Text).length - 1);
        }
        return startRange;
    }
    private selectRange(e: ImageDragEvent): void {
        let range: Range;
        if (this.parent.getDocument().caretRangeFromPoint) { //For chrome
            range = this.parent.getDocument().caretRangeFromPoint(e.clientX, e.clientY);
        } else if ((e.rangeParent)) { //For mozilla firefox
            range = this.parent.getDocument().createRange();
            range.setStart(e.rangeParent, e.rangeOffset);
        } else {
            range = this.getDropRange(e.clientX, e.clientY); //For internet explorer
        }
        this.parent.observer.notify(events.selectRange, { range: range });
    }
    public imageDropInitialized(isStream: boolean): void {
        const e: ImageDragEvent = this.imageDragArgs;
        if (this.parent.element.querySelector('.' + classes.CLS_IMG_RESIZE)) {
            detach(this.imgResizeDiv);
        }
        this.selectRange(this.imageDragArgs);
        if (this.dropFiles.length > 1) {
            return;
        }
        this.parent.observer.notify(events.drop, { args: e });
        const imgFiles: FileList = this.dropFiles;
        const fileName: string = imgFiles[0].name;
        const imgType: string = fileName.substring(fileName.lastIndexOf('.'));
        const allowedTypes: string[] = this.parent.insertImageSettings.allowedTypes as string[];
        for (let i: number = 0; i < allowedTypes.length; i++) {
            if (imgType.toLocaleLowerCase() === allowedTypes[i as number].toLowerCase()) {
                if (this.parent.insertImageSettings.saveUrl || isStream) {
                    this.onSelect(this.dropFiles);
                } else {
                    const args: NotifyArgs = { text: '', file: imgFiles[0] };
                    this.imagePaste(args);
                }
            }
        }
    }
    private insertDragImage(e: DragEvent, dropFiles: FileList): void {
        e.preventDefault();
        const activePopupElement: HTMLElement = this.parent.element.querySelector('' + classes.CLS_POPUP_OPEN);
        this.parent.observer.notify(events.drop, { args: e });
        if (activePopupElement) {
            activePopupElement.classList.add(classes.CLS_HIDE);
        }
        const insideRTEImageElem: HTMLElement = this.parent.inputElement.ownerDocument.querySelector('.' + classes.CLS_RTE_DRAG_IMAGE);
        //For internal image drag and drop
        if (dropFiles.length <= 0 || !isNOU(insideRTEImageElem)) {
            const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
            const imgElement: HTMLElement = this.parent.inputElement.ownerDocument.querySelector('.' + classes.CLS_RTE_DRAG_IMAGE);
            if (imgElement && imgElement.tagName === 'IMG') {
                const imgCaption: Element = imgElement.closest('.e-rte-img-caption');
                if (!isNOU(imgCaption)) {
                    range.insertNode(imgCaption);
                } else {
                    const anchorElement: HTMLElement = imgElement.closest('a');
                    //To check if the anchor has only one image element
                    const isAnchorValid: boolean = anchorElement && anchorElement.tagName === 'A' &&
                        this.hasOnlyImage(anchorElement);
                    if (isAnchorValid) {
                        range.insertNode(anchorElement);
                    } else {
                        range.insertNode(imgElement);
                    }
                }
                imgElement.classList.remove(classes.CLS_RTE_DRAG_IMAGE);
                imgElement.addEventListener('load', () => {
                    if (this.parent.actionCompleteEnabled) { this.parent.dotNetRef.invokeMethodAsync(events.actionCompleteEvent, null); }
                });
                this.parent.formatter.editorManager.nodeSelection.Clear(this.parent.getDocument());
                const args: MouseEvent = e as MouseEvent;
                if (this.parent.insertImageSettings.resize) {
                    this.resizeStart(args as PointerEvent, imgElement);
                }
                this.hideImageQuickToolbar();
            }
        }
    }
    private hasOnlyImage(anchor: HTMLElement): boolean {
        let imageFound: boolean = false;
        for (let i: number = 0; i < anchor.childNodes.length; i++) {
            const currentNode: Node = anchor.childNodes[i as number];
            if (currentNode.nodeType === Node.TEXT_NODE) {
                const text: string = currentNode.textContent.replace(/[\u200B\u200C\u200D]/g, '').trim(); // Remove zero-width spaces
                if (text !== '') {
                    return false; // Found non-empty text node, so it's invalid
                }
            } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
                if ((currentNode as HTMLElement).tagName === 'IMG') {
                    if (imageFound) {
                        return false; // Found more than one image, so it's invalid
                    }
                    imageFound = true;
                } else {
                    return false; // Found a non-image element, so it's invalid
                }
            }
        }
        return imageFound; // Return true only if exactly one img was found
    }
    private onSelect(dropFiles: FileList): void {
        const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
        const validFiles: FileInfo = {
            name: '',
            size: 0,
            status: '',
            statusCode: '',
            type: '',
            rawFile: dropFiles[0],
            validationMessages: {}
        };
        this.droppedImage = <HTMLImageElement>createElement('IMG');
        this.droppedImage.style.opacity = '0.5';
        this.droppedImage.classList.add(classes.CLS_RTE_IMAGE);
        this.droppedImage.classList.add(classes.CLS_IMGINLINE);
        this.droppedImage.classList.add(classes.CLS_RESIZE);
        const file: File = validFiles.rawFile as File;
        const reader: FileReader = new FileReader();
        reader.addEventListener('load', () => {
            const url: string = URL.createObjectURL(convertToBlob(reader.result as string));
            this.droppedImage.src = this.parent.insertImageSettings.saveFormat === 'Blob' ? url : reader.result as string;
        });
        if (file) {
            reader.readAsDataURL(file);
        }
        range.insertNode(this.droppedImage);
        range.selectNodeContents(this.droppedImage);
        this.parent.formatter.editorManager.nodeSelection.setRange(this.parent.getDocument(), range);
        this.droppedImage.addEventListener('load', () => {
            if (this.parent.actionCompleteEnabled) { this.parent.dotNetRef.invokeMethodAsync(events.actionCompleteEvent, null); }
        });
    }
    public removeDroppedImage(): void {
        detach(this.droppedImage);
    }
    public dropUploadSuccess(url: string, altText: string): void {
        this.droppedImage.style.opacity = '1';
        this.droppedImage.classList.add(classes.CLS_IMG_FOCUS);
        this.droppedImage.src = url;
        this.droppedImage.alt = altText;
        this.showImageQuickToolbar({
            args: this.imageDragArgs as MouseEvent, type: 'Images', isNotify: undefined, elements: this.droppedImage
        });
        this.resizeStart((this.imageDragArgs as MouseEvent) as PointerEvent, this.droppedImage);
    }
    public dropUploadChange(url: string, isStream: boolean): void {
        if (isStream) {
            this.droppedImage.src = url;
            this.droppedImage.style.opacity = '1';
        }
    }
    private imagePaste(args: NotifyArgs): void {
        if (args.text.length === 0 && !isNOU((args as NotifyArgs).file)) {
            const reader: FileReader = new FileReader();
            if (args.args) { (args.args as KeyboardEvent).preventDefault(); }
            reader.addEventListener('load', (e: MouseEvent) => {
                const url: IImageCommandsArgs = {
                    cssClass: (this.parent.insertImageSettings.display.toLowerCase() === 'inline' ? classes.CLS_IMGINLINE : classes.CLS_IMGBREAK),
                    url: this.parent.insertImageSettings.saveFormat === 'Base64' || !isNOU(args.callBack) ?
                        reader.result as string : URL.createObjectURL(convertToBlob(reader.result as string)),
                    width: {
                        width: this.parent.insertImageSettings.width, minWidth: this.parent.insertImageSettings.minWidth,
                        maxWidth: this.getMaxWidth()
                    },
                    height: {
                        height: this.parent.insertImageSettings.height, minHeight: this.parent.insertImageSettings.minHeight,
                        maxHeight: this.parent.insertImageSettings.maxHeight
                    }
                };
                if (!isNOU(args.callBack)) {
                    args.callBack(url);
                    return;
                } else {
                    this.parent.formatter.process(this.parent, { item: { command: 'Images', subCommand: 'Image' } }, args.args, url);
                    this.showPopupToolBar(args, url);
                }
            });
            reader.readAsDataURL((args as NotifyArgs).file);
        }
    }
    private showPopupToolBar(e: NotifyArgs, url: IImageCommandsArgs): void {
        const imageSrc: string = 'img[src="' + url.url + '"]';
        const imageElement: Element = this.parent.inputElement.querySelector(imageSrc);
        const args: IShowPopupArgs = {
            args: e.args as MouseEvent,
            type: 'Images',
            isNotify: undefined,
            elements: imageElement
        };
        if (imageElement) {
            setTimeout(() => { this.showImageQuickToolbar(args);
                if (this.parent.insertImageSettings.resize) {
                    this.resizeStart(e.args as PointerEvent, imageElement);
                }
            }, 0);
        }
    }
    private undoStack(args?: { [key: string]: string }): void {
        if (args.subCommand.toLowerCase() === 'undo' || args.subCommand.toLowerCase() === 'redo') {
            for (let i: number = 0; i < this.parent.formatter.getUndoRedoStack().length; i++) {
                const temp: Element = createElement('div');
                const contentElem: DocumentFragment = parseHtml(this.parent.formatter.getUndoRedoStack()[i as number].text);
                temp.appendChild(contentElem);
                const img: NodeListOf<HTMLElement> = temp.querySelectorAll('img');
                if (temp.querySelector('.' + classes.CLS_IMG_RESIZE) && img.length > 0) {
                    for (let j: number = 0; j < img.length; j++) { img[j as number].style.outline = ''; }
                    detach(temp.querySelector('.' + classes.CLS_IMG_RESIZE));
                    this.parent.formatter.getUndoRedoStack()[i as number].text = temp.innerHTML;
                }
            }
        }
    }
    //#region Resize methods
    private imageResize(e: HTMLImageElement): void {
        this.resizeBtnInit();
        this.imgEle = e;
        addClass([this.imgEle], 'e-resize');
        this.imgResizeDiv = createElement('span', { className: classes.CLS_IMG_RESIZE, id: this.rteId + events.imgResizeId });
        this.imgResizeDiv.appendChild(createElement('span', {
            className: CLS_RTE_IMG_BOX_MARK + ' e-rte-topLeft', styles: 'cursor: nwse-resize'
        }));
        this.imgResizeDiv.appendChild(createElement('span', {
            className: CLS_RTE_IMG_BOX_MARK + ' e-rte-topRight', styles: 'cursor: nesw-resize'
        }));
        this.imgResizeDiv.appendChild(createElement('span', {
            className: CLS_RTE_IMG_BOX_MARK + ' e-rte-botLeft', styles: 'cursor: nesw-resize'
        }));
        this.imgResizeDiv.appendChild(createElement('span', {
            className: CLS_RTE_IMG_BOX_MARK + ' e-rte-botRight', styles: 'cursor: nwse-resize'
        }));
        if (Browser.isDevice) { addClass([this.imgResizeDiv], 'e-mob-rte'); }
        e.style.outline = '2px solid #4a90e2';
        this.imgResizePos(e, this.imgResizeDiv);
        this.resizeImgDupPos(e);
        this.parent.getEditPanel().appendChild(this.imgResizeDiv);
        if (this.parent.element.style.height === 'auto') {
            this.imgResizePos(e, this.imgResizeDiv);
        }
    }
    private resizeBtnInit(): { [key: string]: boolean } {
        this.aspectRatio = null;
        this.currentResizeHandler = null;
        return this.resizeBtnStat = { botLeft: false, botRight: false, topRight: false, topLeft: false };
    }
    private imgResizePos(e: HTMLImageElement, imgResizeDiv: HTMLElement): void {
        const pos: OffsetPosition = this.calcPos(e);
        const top: number = pos.top;
        const left: number = pos.left;
        const imgWid: number = e.getBoundingClientRect().width;
        const imgHgt: number = e.getBoundingClientRect().height;
        const borWid: number = (Browser.isDevice) ? (4 * parseInt((e.style.outline.slice(-3)), 10)) + 2 :
            (2 * parseInt((e.style.outline.slice(-3)), 10)) + 2; //span border width + image outline width
        const devWid: number = ((Browser.isDevice) ? 0 : 2);   // span border width
        (imgResizeDiv.querySelector('.e-rte-botLeft') as HTMLElement).style.left = (left - borWid) + 'px';
        (imgResizeDiv.querySelector('.e-rte-botLeft') as HTMLElement).style.top = ((imgHgt - borWid) + top) + 'px';
        (imgResizeDiv.querySelector('.e-rte-botRight') as HTMLElement).style.left = ((imgWid - (borWid - devWid)) + left) + 'px';
        (imgResizeDiv.querySelector('.e-rte-botRight') as HTMLElement).style.top = ((imgHgt - borWid) + top) + 'px';
        (imgResizeDiv.querySelector('.e-rte-topRight') as HTMLElement).style.left = ((imgWid - (borWid - devWid)) + left) + 'px';
        (imgResizeDiv.querySelector('.e-rte-topRight') as HTMLElement).style.top = (top - (borWid)) + 'px';
        (imgResizeDiv.querySelector('.e-rte-topLeft') as HTMLElement).style.left = (left - borWid) + 'px';
        (imgResizeDiv.querySelector('.e-rte-topLeft') as HTMLElement).style.top = (top - borWid) + 'px';
    }
    private resizeImgDupPos(e: HTMLImageElement): void {
        this.imgDupPos = {
            width: (e.style.height !== '') ? this.imgEle.style.width : e.width + 'px',
            height: (e.style.height !== '') ? this.imgEle.style.height : e.height + 'px'
        };
    }
    private calcPos(elem: HTMLElement): OffsetPosition {
        const ignoreOffset: string[] = ['TD', 'TH', 'TABLE', 'A'];
        let parentOffset: OffsetPosition = { top: 0, left: 0 };
        let elementOffset: OffsetPosition;
        const doc: Document = elem.ownerDocument;
        let offsetParent: Node = ((elem.offsetParent && (elem.offsetParent.classList.contains('e-img-caption') ||
            ignoreOffset.indexOf(elem.offsetParent.tagName) > -1)) ?
            closest(elem, '#' + this.rteId + '_rte-edit-view') : elem.offsetParent) || doc.documentElement;
        while (offsetParent &&
            (offsetParent === doc.body || offsetParent === doc.documentElement) &&
            (<HTMLElement>offsetParent).style.position === 'static') {
            offsetParent = offsetParent.parentNode;
        }
        if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
            parentOffset = (<HTMLElement>offsetParent).getBoundingClientRect();
        }
        if (elem.offsetParent && (elem.offsetParent.classList.contains('e-img-caption'))) {
            elementOffset = elem.getBoundingClientRect();
            return {
                top: elementOffset.top - parentOffset.top,
                left: elementOffset.left - parentOffset.left
            };
        } else {
            return {
                top: elem.offsetTop,
                left: elem.offsetLeft
            };
        }
    }
    private getPointX(e: PointerEvent | TouchEvent): number {
        if ((e as TouchEvent).touches && (e as TouchEvent).touches.length) {
            return (e as TouchEvent).touches[0].pageX;
        } else {
            return (e as PointerEvent).pageX;
        }
    }
    private getPointY(e: PointerEvent | TouchEvent): number {
        if ((e as TouchEvent).touches && (e as TouchEvent).touches.length) {
            return (e as TouchEvent).touches[0].pageY;
        } else {
            return (e as PointerEvent).pageY;
        }
    }

    private imgDupMouseMove(width: string, height: string, e: PointerEvent | TouchEvent): void {
        const args: ResizeArgs = { requestType: 'Images' };
        if ((parseInt(this.parent.insertImageSettings.minWidth as string, 10) >= parseInt(width, 10) ||
            parseInt(this.getMaxWidth() as string, 10) <= parseInt(width, 10)
            && isNOU(this.imgEle.style.width))) {
            return;
        }
        if (!this.parent.insertImageSettings.resizeByPercent &&
            (parseInt(this.parent.insertImageSettings.minHeight as string, 10) >= parseInt(height, 10) ||
                parseInt(this.parent.insertImageSettings.maxHeight as string, 10) <= parseInt(height, 10))) {
            return;
        }
        this.imgEle.parentElement.style.cursor = 'pointer';
        this.setAspectRatio(this.imgEle, parseInt(width, 10), parseInt(height, 10));
        this.resizeImgDupPos(this.imgEle);
        this.imgResizePos(this.imgEle, this.imgResizeDiv);
    }
    private setAspectRatio(img: HTMLImageElement, expectedX: number, expectedY: number): void {
        if (isNOU(img.width)) {
            return;
        }
        const width: number = img.width;
        const height: number = img.height;
        const sameHeightWidth: boolean = (width === height);
        const factor: string = this.parent.insertImageSettings.resizeByPercent ? '%' : 'px';
        const emptyStyleDimension: boolean = (img.style.width === '' && img.style.height === '');
        if (!sameHeightWidth && !emptyStyleDimension) {
            if (img.style.width !== '' && img.style.height !== '') {
                if (this.parent.insertImageSettings.resizeByPercent) {
                    this.setImageWidth(img, expectedX, factor);
                    this.removeImageHeight(img);
                } else {
                    this.setImageWidth(img, expectedX, factor);
                    this.setImageHeight(img, expectedY, factor);
                }
            } else if (img.style.width !== '') {
                if (this.parent.insertImageSettings.resizeByPercent) {
                    this.setImageWidth(img, expectedX, factor);
                    this.removeImageHeight(img);
                } else {
                    this.setImageWidth(img, expectedX, factor);
                }
            } else if (img.style.height !== '') {
                if (this.parent.insertImageSettings.resizeByPercent) {
                    this.setImageWidth(img, expectedX, factor);
                    this.removeImageHeight(img);
                } else {
                    this.setImageHeight(img, expectedY, factor);
                }
            }
        } else {
            this.setImageWidth(img, expectedX, factor);
            if (this.parent.insertImageSettings.resizeByPercent) {
                this.removeImageHeight(img);
            } else {
                this.setImageHeight(img, expectedY, factor);
            }
        }
    }
    public getMaxWidth(): string | number {
        const maxWidth: string | number = this.parent.insertImageSettings.maxWidth as number;
        const imgPadding: number = 12;
        const imgResizeBorder: number = 2;
        const editEle: HTMLElement = this.parent.getEditPanel() as HTMLElement;
        const eleStyle: CSSStyleDeclaration = window.getComputedStyle(editEle);
        const editEleMaxWidth: number = editEle.offsetWidth - (imgPadding + imgResizeBorder +
            parseFloat(eleStyle.paddingLeft.split('px')[0]) + parseFloat(eleStyle.paddingRight.split('px')[0]) +
            parseFloat(eleStyle.marginLeft.split('px')[0]) + parseFloat(eleStyle.marginRight.split('px')[0]));
        return isNOU(maxWidth) ? editEleMaxWidth : maxWidth;
    }
    public cancelResizeAction(): void {
        EventHandler.remove(this.parent.getDocument(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.parent.getDocument(), Browser.touchEndEvent, this.resizeEnd);
        if (this.imgEle && this.imgResizeDiv && this.parent.getEditPanel().contains(this.imgResizeDiv)) {
            detach(this.imgResizeDiv);
            (this.imgEle as HTMLElement).style.outline = '';
            this.imgResizeDiv = null;
            this.pageX = null;
            this.pageY = null;
            this.currentResizeHandler = null;
            this.aspectRatio = null;
        }
    }
    private removeResizeEle(): void {
        EventHandler.remove(this.parent.getDocument(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.parent.getDocument(), Browser.touchEndEvent, this.resizeEnd);
        detach(this.parent.getEditPanel().querySelector('.e-img-resize'));
    }

    private onWindowResize(): void {
        if (!isNOU(this.parent) && !isNOU(this.parent.getEditPanel().querySelector('.e-img-resize'))) {
            this.cancelResizeAction();
        }
    }
    //#endregion
    //#region Quick toolbar related methods
    private editAreaClickHandler(e: IImageNotifyArgs): void {
        if (this.parent.readonly) {
            this.hideImageQuickToolbar();
            return;
        }
        const args: MouseEvent = e.args as MouseEvent;
        const showOnRightClick: boolean = this.parent.quickToolbarSettings.showOnRightClick as boolean;
        if (args.which === 2 || (showOnRightClick && args.which === 1) || (!showOnRightClick && args.which === 3)) {
            if ((showOnRightClick && args.which === 1) && !isNOU((args.target as HTMLElement)) &&
                (args.target as HTMLElement).tagName === 'IMG') {
                this.parent.formatter.editorManager.nodeSelection.Clear(this.parent.getDocument());
                this.parent.formatter.editorManager.nodeSelection.setSelectionContents(
                    this.parent.getDocument(), args.target as Node);
            }
            return;
        }
        if (this.parent.editorMode === 'HTML' && this.parent.quickToolbarModule) {
            this.quickToolObj = this.parent.quickToolbarModule;
            const target: HTMLElement = args.target as HTMLElement;
            if (target.nodeName === 'IMG' && this.parent.quickToolbarModule) {
                this.parent.formatter.editorManager.nodeSelection.Clear(this.parent.getDocument());
                this.parent.formatter.editorManager.nodeSelection.setSelectionContents(this.parent.getDocument(), target);
                if (isIDevice()) { this.parent.observer.notify(events.selectionSave, e); }
                addClass([target], 'e-img-focus');
                this.showImageQuickToolbar({ args: args, type: 'Images', elements: [args.target as Element] } as IShowPopupArgs);
            } else {
                this.hideImageQuickToolbar();
            }
        }
    }
    private showImageQuickToolbar(e: IShowPopupArgs): void {
        if (e.type !== 'Images' || isNOU(this.parent.quickToolbarModule)) { return; }
        this.quickToolObj = this.parent.quickToolbarModule;
        let target: HTMLElement = e.elements as HTMLElement;
        [].forEach.call(e.elements, (element: Element, index: number) => {
            if (index === 0) {
                target = <HTMLElement>element;
            }
        });
        const imageQuickToolbarElem: HTMLElement = document.body.querySelector('#' + this.parent.id + '_image_toolbar');
        if (!isNOU(imageQuickToolbarElem.querySelector('.e-insert-link'))) {
            if (target.closest('a')) {
                imageQuickToolbarElem.classList.add('e-link-enabled');
            } else if (imageQuickToolbarElem.classList.contains('e-link-enabled')) {
                imageQuickToolbarElem.classList.remove('e-link-enabled');
            }
        }
        if (target.nodeName === 'IMG') {
            addClass([target], ['e-img-focus']);
        }
        if (this.quickToolObj) {
            if (e.isNotify) {
                setTimeout(() => {
                    this.parent.formatter.editorManager.nodeSelection.Clear( this.parent.getDocument() );
                    this.parent.formatter.editorManager.nodeSelection.setSelectionContents( this.parent.getDocument(), target );
                    this.quickToolObj.showImageQTBar(target as HTMLElement, e.args as MouseEvent);
                    if (this.parent.insertImageSettings.resize) {
                        this.resizeStart(e.args as PointerEvent, target);
                    }
                }, 400);
            } else {
                this.quickToolObj.showImageQTBar(target as HTMLElement, e.args as MouseEvent);
            }
        }
    }
    private hideImageQuickToolbar(): void {
        if (!isNOU(this.parent.getEditPanel().querySelector('.e-img-focus'))) {
            removeClass([this.parent.getEditPanel().querySelector('.e-img-focus')], 'e-img-focus');
            if (this.quickToolObj) {
                this.quickToolObj.hideImageQTBar();
            }
        }
    }
    private onToolbarAction(args: NotifyArgs): void {
        if (this.quickToolObj) {
            this.quickToolObj.hideImageQTBar();
            removeClass([args.selectNode[0] as HTMLElement], 'e-img-focus');
        }
        this.selectionObj = args;
        if (isIDevice()) { this.parent.observer.notify(events.selectionRestore, {}); }
        const item: IToolbarItemModel = (args.args as ClickEventArgs).item as IToolbarItemModel;
        switch (item.subCommand) {
        case 'Replace':
            this.parent.observer.notify(events.insertImage, args);
            break;
        case 'Caption':
            this.parent.observer.notify(events.imageCaption, args);
            break;
        case 'InsertLink':
            this.parent.observer.notify(events.imageLink, args);
            break;
        case 'AltText':
            this.parent.observer.notify(events.imageAlt, args);
            break;
        case 'Remove':
            this.parent.observer.notify(events.imageDelete, args);
            break;
        case 'Dimension':
            this.parent.observer.notify(events.imageSize, args);
            break;
        case 'OpenImageLink':
            this.openImgLink(args);
            break;
        case 'EditImageLink':
            this.editImgLink(args);
            break;
        case 'RemoveImageLink':
            this.removeImgLink(args);
            break;
        }
    }
    private openImgLink(e: NotifyArgs): void {
        const sanitizedHTML: string = this.parent.htmlEditorModule.sanitizeHelper(
            (e.selectParent[0].parentNode as HTMLAnchorElement).outerHTML);
        const tempEle: HTMLElement = document.createElement('div');
        tempEle.innerHTML = sanitizedHTML;
        const target: string = (e.selectParent[0].parentNode as HTMLAnchorElement).target === '' ? '_self' : '_blank';
        this.parent.formatter.process(
            this.parent, e.args, e.args,
            {
                url: (tempEle.firstChild as HTMLAnchorElement).href, target: target, selectNode: e.selectNode,
                subCommand: ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand
            });
        tempEle.remove();
    }
    private editImgLink(e: NotifyArgs): void {
        const selectParentEle: HTMLElement = e.selectParent[0].parentNode as HTMLElement;
        const inputDetails: { [key: string]: string } = {
            url: (selectParentEle as HTMLAnchorElement).href, target: (selectParentEle as HTMLAnchorElement).target
        };
        this.insertImgLink(e, inputDetails);
    }
    private removeImgLink(e: NotifyArgs): void {
        if (Browser.isIE) { (this.parent.getEditPanel() as HTMLElement).focus(); }
        e.selection.restore();
        const isCapLink: boolean = (this.parent.getEditPanel().contains(this.captionEle) && select('a', this.captionEle)) ?
            true : false;
        const selectParent: Node[] = isCapLink ? [this.captionEle] : [e.selectNode[0].parentElement];
        this.parent.formatter.process(
            this.parent, e.args, e.args,
            {
                insertElement: e.selectNode[0] as HTMLElement, selectParent: selectParent, selection: e.selection,
                subCommand: ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand
            });
        if (this.quickToolObj) {
            this.quickToolObj.hideImageQTBar();
            if (!isNOU(e.selectParent as Node[])) { removeClass([e.selectParent[0] as HTMLElement], 'e-img-focus'); }
        }
        if (isCapLink) { (select('.e-img-inner', this.captionEle) as HTMLElement).focus(); }
    }
    private caption(e: IImageNotifyArgs): void {
        const selectNode: HTMLElement = e.selectNode[0] as HTMLElement;
        if (selectNode.nodeName !== 'IMG') {
            return;
        }
        e.selection.restore();
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        this.cancelResizeAction();
        addClass([selectNode], 'e-rte-image');
        const subCommand: string = ((e.args as ClickEventArgs).item) ?
            ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand : 'Caption';
        if (!isNOU(closest(selectNode, '.' + classes.CLS_CAPTION))) {
            detach(closest(selectNode, '.' + classes.CLS_CAPTION));
            if (Browser.isIE) {
                (this.parent.getEditPanel() as HTMLElement).focus();
                e.selection.restore();
            }
            if (selectNode.parentElement.tagName === 'A') {
                this.parent.formatter.process(
                    this.parent, e.args, e.args,
                    { insertElement: selectNode.parentElement, selectNode: e.selectNode, subCommand: subCommand });
            } else {
                this.parent.formatter.process(
                    this.parent, e.args, e.args, { insertElement: selectNode, selectNode: e.selectNode, subCommand: subCommand });
            }
        } else {
            this.captionEle = createElement('span', {
                className: classes.CLS_CAPTION + ' ' + classes.CLS_RTE_CAPTION,
                attrs: { contenteditable: 'false', draggable: 'false' }
            });
            const imgContain: HTMLElement = createElement('span', { className: 'e-img-wrap' });
            const imgInner: HTMLElement = createElement('span', { className: 'e-img-inner', attrs: { contenteditable: 'true' } });
            const parent: HTMLElement = e.selectNode[0].parentElement;
            if (parent.tagName === 'A') { parent.setAttribute('contenteditable', 'true'); }
            imgContain.appendChild(parent.tagName === 'A' ? parent : e.selectNode[0]);
            imgContain.appendChild(imgInner);
            /* eslint-disable */
            let imgCaption: string = this.parent.localeData['imageCaption'];
            /* eslint-enable */
            imgInner.innerHTML = imgCaption;
            this.captionEle.appendChild(imgContain);
            if (selectNode.classList.contains(classes.CLS_IMGINLINE)) {
                addClass([this.captionEle], classes.CLS_CAPINLINE);
            }
            if (selectNode.classList.contains(classes.CLS_IMGBREAK)) {
                addClass([this.captionEle], classes.CLS_IMGBREAK);
            }
            if (selectNode.classList.contains(classes.CLS_IMGLEFT)) {
                addClass([this.captionEle], classes.CLS_IMGLEFT);
            }
            if (selectNode.classList.contains(classes.CLS_IMGRIGHT)) {
                addClass([this.captionEle], classes.CLS_IMGRIGHT);
            }
            if (selectNode.classList.contains(classes.CLS_IMGCENTER)) {
                addClass([this.captionEle], classes.CLS_IMGCENTER);
            }
            this.parent.formatter.process(
                this.parent, e.args, e.args, { insertElement: this.captionEle, selectNode: e.selectNode, subCommand: subCommand });
            this.parent.formatter.editorManager.nodeSelection.setSelectionText(
                this.parent.getDocument(),
                imgInner.childNodes[0], imgInner.childNodes[0], 0, imgInner.childNodes[0].textContent.length);
        }
        if (this.quickToolObj) {
            this.quickToolObj.hideImageQTBar();
            removeClass([selectNode as HTMLElement], 'e-img-focus');
        }
    }
    private insertImgLink(e: IImageNotifyArgs, inputDetails?: { [key: string]: string }): void {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        let obj: IShowImageDialog;
        if (!isNOU(inputDetails)) {
            obj = { mode: 'EditLink', newWindow: inputDetails.target ? true : false, url: inputDetails.url };
        } else {
            obj = { mode: 'InsertLink', newWindow: true, url: '' };
        }
        this.parent.dotNetRef.invokeMethodAsync(events.showImageDialog, obj);
    }
    private isUrl(url: string): boolean {
        const regExp: RegExpConstructor = RegExp;
        const regexp: RegExp = new regExp('(ftp|http|https)://(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(/|/([\\w#!:.?+=&%@\\-\\/]))?', 'gi');
        return regexp.test(url);
    }
    public insertLink(url: string, target: string, ariaLabel: string): void {
        if (this.selectionObj.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        const linkEle: HTMLElement = document.querySelector('.e-rte-img-dialog .e-img-link');
        if (url === '') {
            addClass([linkEle], 'e-error');
            (linkEle as HTMLInputElement).setSelectionRange(0, url.length);
            (linkEle as HTMLInputElement).focus();
            return;
        }
        if (!this.isUrl(url)) {
            if (!this.parent.enableAutoUrl) {
                url = url.indexOf('http') > -1 ? url : 'http://' + url;
            }
        } else {
            removeClass([linkEle], 'e-error');
        }
        if (this.parent.editorMode === 'HTML') { this.selectionObj.selection.restore(); }
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        if (this.selectionObj.selectNode[0].parentElement.nodeName === 'A') {
            this.parent.formatter.process(
                this.parent, this.selectionObj.args, this.selectionObj.args,
                {
                    url: url, target: target, ariaLabel: ariaLabel, selectNode: this.selectionObj.selectNode,
                    subCommand: ((this.selectionObj.args as ClickEventArgs).item as IDropDownItemModel).subCommand
                });
            this.parent.dotNetRef.invokeMethodAsync(events.closeImageDialog, null);
            return;
        }
        this.parent.formatter.process(
            this.parent, this.selectionObj.args, this.selectionObj.args,
            {
                url: url, target: target, ariaLabel: ariaLabel, selectNode: this.selectionObj.selectNode,
                subCommand: ((this.selectionObj.args as ClickEventArgs).item as IDropDownItemModel).subCommand,
                selection: this.selectionObj.selection
            });
        const captionEle: Element = closest(this.selectionObj.selectNode[0], '.e-img-caption');
        if (captionEle) { (select('.e-img-inner', captionEle) as HTMLElement).focus(); }
        this.parent.dotNetRef.invokeMethodAsync(events.closeImageDialog, null);
    }
    private insertAltText(e: IImageNotifyArgs): void {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        const selectNodeAltValue: string = (e.selectNode[0] as HTMLElement).getAttribute('alt');
        const obj: IShowImageDialog = { mode: 'AltText', altText: ((selectNodeAltValue === null) ? '' : selectNodeAltValue) };
        this.parent.dotNetRef.invokeMethodAsync(events.showImageDialog, obj);
    }
    public insertAlt(altText: string): void {
        this.selectionObj.selection.restore();
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        this.parent.formatter.process(
            this.parent, this.selectionObj.args, this.selectionObj.args,
            {
                altText: altText, selectNode: this.selectionObj.selectNode,
                subCommand: ((this.selectionObj.args as ClickEventArgs).item as IDropDownItemModel).subCommand
            });
        this.parent.dotNetRef.invokeMethodAsync(events.closeImageDialog, null);
    }
    private deleteImg(e: IImageNotifyArgs, keyCode?: number): void {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        const args: AfterImageDeleteEventArgs = {
            src: (e.selectNode[0] as HTMLElement).getAttribute('src')
        };
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        let restoreStartElement: Node = e.selection.range.startContainer;
        if (e.selection.range.startContainer.nodeName === 'SPAN' &&
            (restoreStartElement as HTMLElement).classList.contains('e-img-wrap') &&
            (restoreStartElement as HTMLElement).parentElement.classList.contains('e-img-caption') ) {
            restoreStartElement = (restoreStartElement as HTMLElement).parentElement;
            if (!isNOU(restoreStartElement.previousSibling)) {
                let lastNode: Node = restoreStartElement.previousSibling;
                while (lastNode.nodeName !== '#text' && lastNode.nodeName !== 'BR') {
                    lastNode = lastNode.lastChild;
                }
                this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                    this.parent.getDocument(), lastNode as Element,
                    lastNode.nodeName !== 'BR' ? lastNode.textContent.length : 0);
            } else if (!isNOU(restoreStartElement.nextSibling)) {
                let firstNode: Node = restoreStartElement.nextSibling;
                while (firstNode.nodeName !== '#text' && firstNode.nodeName !== 'BR') {
                    firstNode = firstNode.firstChild;
                }
                this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                    this.parent.getDocument(), firstNode as Element, 0);
            }
        } else {
            e.selection.restore();
        }
        if (this.parent.getEditPanel().querySelector('.e-img-resize')) {
            this.removeResizeEle();
        }
        this.parent.formatter.process(
            this.parent, e.args, e.args,
            {
                selectNode: e.selectNode,
                captionClass: classes.CLS_CAPTION,
                subCommand: ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand
            });
        if (this.quickToolObj) {
            this.quickToolObj.hideImageQTBar();
        }
        this.cancelResizeAction();
        if (isNOU(keyCode) && this.parent.imageDeleteEnabled) {
            this.parent.dotNetRef.invokeMethodAsync('AfterImageDeleteEvent', args);
        }
    }

    private imageSize(e: IImageNotifyArgs): void {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        const selectNode: HTMLImageElement = (e as IImageNotifyArgs).selectNode[0] as HTMLImageElement;
        let width: string = (selectNode.style.width.toString() === 'auto' ||
            selectNode.style.width.toString()) ? selectNode.style.width.toString() :
            (parseInt(selectNode.getClientRects()[0].width.toString(), 10)).toString();
        let height: string = (selectNode.style.height.toString() === 'auto' ||
            selectNode.style.height.toString()) ? selectNode.style.height.toString() :
            (parseInt(selectNode.getClientRects()[0].height.toString(), 10).toString());
        if (selectNode.style.width === '' && width === '') {
            width = 'auto';
        }
        if (selectNode.style.height === '' && height === '') {
            height = 'auto';
        }
        const obj: IShowImageDialog = {
            mode: 'Dimension', width: width, height: height, maxWidth: parseFloat(this.getMaxWidth() as string)
        };
        this.parent.dotNetRef.invokeMethodAsync(events.showImageDialog, obj);
    }
    public insertSize(width: number, height: number): void {
        this.selectionObj.selection.restore();
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        this.parent.formatter.process(
            this.parent, this.selectionObj.args, this.selectionObj.args,
            {
                width: width, height: height, selectNode: this.selectionObj.selectNode,
                subCommand: ((this.selectionObj.args as ClickEventArgs).item as IDropDownItemModel).subCommand
            });
        if (this.imgResizeDiv) { this.imgResizePos(this.selectionObj.selectNode[0] as HTMLImageElement, this.imgResizeDiv); }
        this.parent.dotNetRef.invokeMethodAsync(events.closeImageDialog, null);
    }
    private alignmentSelect(e: ClickEventArgs): void {
        const item: IDropDownItemModel = e.item as IDropDownItemModel;
        if (!document.body.contains(document.body.querySelector('.e-rte-quick-toolbar')) || item.command !== 'Images') {
            return;
        }
        const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
        let selectNodeEle: Node[] = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
        selectNodeEle = (selectNodeEle[0].nodeName === 'IMG') ? selectNodeEle : [this.imgEle];
        const args: IImageNotifyArgs = { args: e, selectNode: selectNodeEle };
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        switch (item.subCommand) {
        case 'JustifyLeft':
            this.alignImage(args, 'JustifyLeft');
            break;
        case 'JustifyCenter':
            this.alignImage(args, 'JustifyCenter');
            break;
        case 'JustifyRight':
            this.alignImage(args, 'JustifyRight');
            break;
        case 'Inline':
            this.inline(args);
            break;
        case 'Break':
            this.break(args);
            break;
        }
        if (this.quickToolObj) {
            this.quickToolObj.hideImageQTBar();
            removeClass([selectNodeEle[0] as HTMLElement], 'e-img-focus');
        }
        this.cancelResizeAction();
    }
    private alignImage(e: IImageNotifyArgs, type: string): void {
        const subCommand: string = ((e.args as ClickEventArgs).item) ?
            ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand : type;
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    }
    private inline(e: IImageNotifyArgs): void {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        const subCommand: string = ((e.args as ClickEventArgs).item) ?
            ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand : 'Inline';
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    }
    private break(e: IImageNotifyArgs): void {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        const subCommand: string = ((e.args as ClickEventArgs).item) ?
            ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand : 'Break';
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    }
    private imageBrowseClick(): void {
        (document.getElementById(this.rteId + '_image').querySelector('.e-rte-img-dialog .e-file-select-wrap button') as HTMLButtonElement).click();
    }
    //#endregion
    //#region Interop methods
    public dialogOpened(): void {
        const dialogContent: HTMLElement = Browser.isDevice ? document.getElementById(this.rteId + '_image').querySelector('.e-img-content') :
            !isNOU(this.parent.element.querySelector('.e-rte-img-dialog .e-img-content')) ? this.parent.element.querySelector('.e-rte-img-dialog .e-img-content') : document.querySelector('.e-rte-elements .e-rte-img-dialog .e-img-content');
        if (isNOU(dialogContent)) { return; }
        const spanElement: HTMLElement = document.getElementById(this.rteId + '_dropText');
        const buttonElement: HTMLElement = document.getElementById(this.rteId + '_insertImage');
        this.buttonClickElement = Browser.isDevice ? spanElement : buttonElement;
        EventHandler.add(this.buttonClickElement, 'click', this.imageBrowseClick, this);
        if ((!isNOU(this.parent.insertImageSettings.path) && this.parent.editorMode === 'Markdown')
            || this.parent.editorMode === 'HTML') {
            (dialogContent.querySelector('#' + this.rteId + '_insertImage') as HTMLElement).focus();
        } else {
            (dialogContent.querySelector('.e-img-url') as HTMLElement).focus();
        }
    }
    public imageSelected(): void {
        this.inputUrl.setAttribute('disabled', 'true');
    }
    public imageUploadSuccess(url: string, altText: string): void {
        this.inputUrl = this.parent.element.querySelector('.e-rte-img-dialog .e-img-url');
        if (!isNOU(this.parent.insertImageSettings.path)) {
            this.uploadUrl = {
                url: url, selection: this.imgUploadSave, altText: altText, selectParent: this.imgUploadSelectedParent,
                width: {
                    width: this.parent.insertImageSettings.width, minWidth: this.parent.insertImageSettings.minWidth,
                    maxWidth: this.getMaxWidth()
                }, height: {
                    height: this.parent.insertImageSettings.height, minHeight: this.parent.insertImageSettings.minHeight,
                    maxHeight: this.parent.insertImageSettings.maxHeight
                }
            };
            this.inputUrl.setAttribute('disabled', 'true');
        }
    }
    public imageUploadComplete(base64Str: string, altText: string): void {
        if (this.parent.editorMode === 'HTML' && isNOU(this.parent.insertImageSettings.path)) {
            const url: string = this.parent.insertImageSettings.saveFormat === 'Base64' ? base64Str :
                URL.createObjectURL(convertToBlob(base64Str));
            this.uploadUrl = {
                url: url, selection: this.imgUploadSave, altText: altText, selectParent: this.imgUploadSelectedParent,
                width: {
                    width: this.parent.insertImageSettings.width, minWidth: this.parent.insertImageSettings.minWidth,
                    maxWidth: this.getMaxWidth()
                }, height: {
                    height: this.parent.insertImageSettings.height, minHeight: this.parent.insertImageSettings.minHeight,
                    maxHeight: this.parent.insertImageSettings.maxHeight
                }
            };
            this.inputUrl.setAttribute('disabled', 'true');
        }
    }
    public imageUploadChange(url: string, isStream: boolean): void {
        this.modifiedUrl = url;
        this.isStreamUrl = isStream;
    }
    public removing(): void {
        this.inputUrl.removeAttribute('disabled');
        if (this.uploadUrl) { this.uploadUrl.url = ''; }
    }
    public dialogClosed(): void {
        if (this.parent.editorMode === 'HTML') {
            this.selectionObj.selection.restore();
        } else {
            this.parent.formatter.editorManager.markdownSelection.restore(this.parent.getEditPanel() as HTMLTextAreaElement);
        }
        if (this.buttonClickElement) { EventHandler.remove(this.buttonClickElement, 'click', this.imageBrowseClick); }
    }
    public insertImageUrl(): void {
        const dialogElement: Element = this.parent.element.ownerDocument.querySelector('#' + this.rteId + '_image');
        if  (!Browser.isDevice) {
            this.inputUrl = !isNOU(this.parent.element.querySelector('.e-rte-img-dialog .e-img-url')) ?
                this.parent.element.querySelector('.e-rte-img-dialog .e-img-url') : dialogElement.querySelector('.e-rte-elements.e-rte-img-dialog .e-img-url');
        } else {
            this.inputUrl = this.parent.inputElement.ownerDocument.querySelector('#' + this.rteId + '_image').querySelector('.e-rte-img-dialog .e-img-url');
        }
        let url: string = this.inputUrl.value;
        const insertImageBtn: HTMLElement = !isNOU(dialogElement) ? dialogElement.querySelector('.e-rte-img-dialog .e-insertImage') : null;
        if (insertImageBtn && insertImageBtn.classList.contains('e-updateImage')) {
            const args: AfterImageDeleteEventArgs = {
                src: this.inputUrl.value
            };
            if (this.parent.imageDeleteEnabled) {
                this.parent.dotNetRef.invokeMethodAsync('AfterImageDeleteEvent', args);
            }
        }
        if (this.parent.editorMode === 'Markdown' && url === '') {
            url = 'http://';
        }
        if (this.isStreamUrl && this.modifiedUrl !== '') {
            this.uploadUrl.url = this.modifiedUrl;
            this.modifiedUrl = '';
        }
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        (this.selectionObj.args as ActionBeginEventArgs).item.subCommand = !isNOU(insertImageBtn) && (insertImageBtn as HTMLElement).innerHTML === 'Update' ? 'Replace' : (this.selectionObj.args as ActionBeginEventArgs).item.subCommand;
        if (!isNOU(this.uploadUrl) && this.uploadUrl.url !== '') {
            this.uploadUrl.cssClass = this.parent.insertImageSettings.display.toLowerCase() === 'inline' ? classes.CLS_IMGINLINE : classes.CLS_IMGBREAK;
            (this.parent.dotNetRef.invokeMethodAsync(events.closeImageDialog, null) as unknown as Promise<DialogCloseEventArgs>)
                .then(() => {
                    const dialogElement: HTMLElement = this.parent.element.ownerDocument.querySelector('#' + this.rteId + '_image');
                    if (!isNOU(dialogElement)) {
                        return;
                    } else {
                        this.parent.formatter.process(
                            this.parent, this.selectionObj.args, (this.selectionObj.args as ClickEventArgs).originalEvent, this.uploadUrl);
                        if (this.parent.getEditPanel().querySelector('.e-img-resize')) {
                            (this.imgEle as HTMLElement).style.outline = '';
                            this.removeResizeEle();
                        }
                    }
                });
        } else if (url !== '') {
            if (this.parent.editorMode === 'HTML' && isNOU(
                closest(this.selectionObj.selection.range.startContainer.parentNode, '#' + this.parent.getPanel().id))) {
                (this.parent.getEditPanel() as HTMLElement).focus();
                const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
                this.selectionObj.selection = this.parent.formatter.editorManager.nodeSelection.save(range, this.parent.getDocument());
                this.selectionObj.selectParent = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            }
            const regex: RegExp = /[\w-]+.(jpg|png|jpeg|gif)/g;
            const matchUrl: string = (!isNOU(url.match(regex)) && this.parent.editorMode === 'HTML') ? url.match(regex)[0] : '';
            const value: IImageCommandsArgs = {
                cssClass: (this.parent.insertImageSettings.display.toLowerCase() === 'inline' ? classes.CLS_IMGINLINE : classes.CLS_IMGBREAK),
                url: url, selection: this.selectionObj.selection, altText: matchUrl,
                selectParent: this.selectionObj.selectParent, width: {
                    width: this.parent.insertImageSettings.width, minWidth: this.parent.insertImageSettings.minWidth,
                    maxWidth: this.getMaxWidth()
                },
                height: {
                    height: this.parent.insertImageSettings.height, minHeight: this.parent.insertImageSettings.minHeight,
                    maxHeight: this.parent.insertImageSettings.maxHeight
                }
            };
            (this.parent.dotNetRef.invokeMethodAsync(events.closeImageDialog, null) as unknown as Promise<DialogCloseEventArgs>)
                .then(() => {
                    const dialogElement: HTMLElement = this.parent.element.ownerDocument.querySelector('#' + this.rteId + '_image');
                    if (!isNOU(dialogElement)) {
                        return;
                    } else {
                        this.parent.formatter.process(
                            this.parent, this.selectionObj.args, (this.selectionObj.args as ClickEventArgs).originalEvent, value);
                    }
                });
        }
    }
    public showDialog(isExternal: boolean, event?: KeyboardEventArgs, selection?: NodeSelection, ele?: Node[], parentEle?: Node[]): void {
        let range: Range;
        let save: NodeSelection;
        let selectNodeEle: Node[];
        let selectParentEle: Node[];
        if (isExternal && !isNOU(this.parent.formatter.editorManager.nodeSelection)) {
            range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
            save = this.parent.formatter.editorManager.nodeSelection.save(
                range, this.parent.getDocument());
            selectNodeEle = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
            selectParentEle = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
        } else {
            save = selection;
            selectNodeEle = ele;
            selectParentEle = parentEle;
        }
        if (this.parent.editorMode === 'HTML') {
            this.imageDialog({
                args: {
                    item: { command: 'Images', subCommand: 'Image' } as IToolbarItemModel,
                    originalEvent: isExternal ? undefined : event,
                    name: isExternal ? 'showDialog' : null
                },
                selectNode: selectNodeEle,
                selection: save,
                selectParent: selectParentEle
            });
        } else {
            this.imageDialog({
                args: {
                    item: { command: 'Images', subCommand: 'Image' } as IToolbarItemModel,
                    originalEvent: isExternal ? undefined : event
                },
                member: 'image',
                text: this.parent.formatter.editorManager.markdownSelection.getSelectedText(
                    this.parent.getEditPanel() as HTMLTextAreaElement),
                module: 'Markdown',
                name: 'insertImage'
            });
        }
    }
    //#endregion
    //#region Event handler methods
    private onCutHandler(): void {
        if (this.imgResizeDiv && this.parent.getEditPanel().contains(this.imgResizeDiv)) {
            this.cancelResizeAction();
        }
    }
    private onIframeMouseDown(e: MouseEvent): void {
        this.parent.dotNetRef.invokeMethodAsync(events.closeImageDialog, null);
        this.onDocumentClick(e);
    }
    private onDocumentClick(e: MouseEvent): void {
        const target: HTMLElement = <HTMLElement>e.target;
        if (target.nodeName === 'IMG') { this.imgEle = target as HTMLImageElement; }
        const dlgEle: HTMLElement = document.body.querySelector('#' + this.rteId + '_image.e-rte-img-dialog');
        if (!isNOU(dlgEle) && ((
            !closest(target, '#' + this.rteId + '_image') && this.parent.toolbarSettings.enable && this.parent.getToolbarElement() &&
            !this.parent.getToolbarElement().contains(e.target as Node)) ||
            (this.parent.getToolbarElement() && this.parent.getToolbarElement().contains(e.target as Node) &&
                !closest(target, '#' + this.rteId + '_toolbar_Image') &&
                !target.querySelector('#' + this.rteId + '_toolbar_Image')))
        ) {
            if (!(e.offsetX > (e.target as HTMLImageElement).clientWidth || e.offsetY > (e.target as HTMLImageElement).clientHeight)) {
                this.parent.dotNetRef.invokeMethodAsync(events.closeImageDialog, events.outsideClicked);
                this.parent.isBlur = true;
                if (Browser.isIE) {
                    dispatchEvent(this.parent.element, 'focusout');
                }
            }
        }
        if ((e.target as HTMLElement).tagName !== 'IMG' && this.imgResizeDiv && !this.quickToolObj &&
            this.parent.getEditPanel().contains(this.imgResizeDiv)) {
            this.cancelResizeAction();
        }
        if (this.parent.getEditPanel().querySelector('.e-img-resize')) {
            if (target.tagName !== 'IMG') { this.removeResizeEle(); }
            if (target.tagName !== 'IMG' && !isNOU(this.imgEle)) {
                this.imgEle.style.outline = '';
            } else if (!isNOU(this.prevSelectedImgEle) && this.prevSelectedImgEle !== target) {
                this.prevSelectedImgEle.style.outline = '';
            }
        }
        if (this.parent.inlineMode.enable && !isNOU(target) && !isNOU(dlgEle) && (!closest(target, '#' + this.rteId + '_image'))) {
            this.parent.dotNetRef.invokeMethodAsync(events.closeImageDialog, events.outsideClicked);
        }
    }
    private imageClick(e: MouseEvent): void {
        if (Browser.isDevice) {
            if (((e.target as HTMLElement).tagName === 'IMG' &&
                (e.target as HTMLElement).parentElement.tagName === 'A') ||
                ((e.target as Element).tagName === 'IMG')) {
                this.parent.getEditPanel().setAttribute('contenteditable', 'false');
                (e.target as HTMLElement).focus();
            } else {
                if (!this.parent.readonly) {
                    this.parent.getEditPanel().setAttribute('contenteditable', 'true');
                }
            }
        }
        if ((e.target as HTMLElement).tagName === 'IMG' &&
            (e.target as HTMLElement).parentElement.tagName === 'A') {
            e.preventDefault();
        }
    }
    private onKeyDown(event: NotifyArgs): void {
        const originalEvent: KeyboardEventArgs = event.args as KeyboardEventArgs;
        let range: Range;
        let save: NodeSelection;
        let selectNodeEle: Node[];
        let selectParentEle: Node[];
        this.deletedImg = [];
        let isCursor: boolean;
        const keyCodeValues: number[] = [27, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123,
            44, 45, 9, 16, 17, 18, 19, 20, 33, 34, 35, 36, 37, 38, 39, 40, 91, 92, 93, 144, 145, 182, 183];
        if (this.parent.editorMode === 'HTML') {
            range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
            isCursor = range.startContainer === range.endContainer && range.startOffset === range.endOffset;
        }
        if (!isCursor && this.parent.editorMode === 'HTML' && keyCodeValues.indexOf(originalEvent.which) < 0) {
            const nodes: Node[] = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
            for (let i: number = 0; i < nodes.length; i++) {
                if (nodes[i as number].nodeName === 'IMG') {
                    this.deletedImg.push(nodes[i as number]);
                }
            }
        }
        if (this.parent.editorMode === 'HTML' && ((originalEvent.which === 8 && originalEvent.code === 'Backspace') ||
            (originalEvent.which === 46 && originalEvent.code === 'Delete'))) {
            const isCursor: boolean = range.startContainer === range.endContainer && range.startOffset === range.endOffset;
            if ((originalEvent.which === 8 && originalEvent.code === 'Backspace' && isCursor)) {
                this.checkImageBack(range);
            } else if ((originalEvent.which === 46 && originalEvent.code === 'Delete' && isCursor)) {
                this.checkImageDel(range);
            }
        }
        if (!isNOU(this.parent.formatter.editorManager.nodeSelection) &&
            originalEvent.code !== 'KeyK') {
            range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
            save = this.parent.formatter.editorManager.nodeSelection.save(
                range, this.parent.getDocument());
            selectNodeEle = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
            selectParentEle = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            if (!originalEvent.ctrlKey && originalEvent.key && (originalEvent.key.length === 1 || originalEvent.action === 'enter' ||
                originalEvent.keyCode === 37 || originalEvent.keyCode === 38 || originalEvent.keyCode === 39 ||
                originalEvent.keyCode === 40) &&
                ((selectParentEle[0] as HTMLElement).tagName === 'IMG') && (selectParentEle[0] as HTMLElement).parentElement) {
                if (this.parent.getEditPanel().querySelector('.e-img-resize')) {
                    this.removeResizeEle();
                }
                removeClass([selectParentEle[0] as HTMLElement], 'e-img-focus');
                if (this.quickToolObj) {
                    this.quickToolObj.hideImageQTBar();
                }
                if (!isNOU(this.imgEle)) {
                    this.imgEle.style.outline = '';
                }
            }
        }
        if (originalEvent.ctrlKey && (originalEvent.keyCode === 89 || originalEvent.keyCode === 90)) {
            this.undoStack({ subCommand: (originalEvent.keyCode === 90 ? 'undo' : 'redo') });
        }
        if ((originalEvent.keyCode === 8 || originalEvent.keyCode === 46) && this.parent.editorMode === 'HTML') {
            const eleCurPosition: ImageOrTableCursor = this.getImageCursorPosition(range);
            if (selectNodeEle && selectNodeEle[0] && selectNodeEle[0].nodeName === 'IMG' && ((eleCurPosition.start && originalEvent.keyCode === 46)
                || (originalEvent.keyCode === 8 && eleCurPosition.end))) {
                originalEvent.preventDefault();
                const event: IImageNotifyArgs = {
                    selectNode: selectNodeEle, selection: save, selectParent: selectParentEle,
                    args: {
                        item: { command: 'Images', subCommand: 'Remove' } as IToolbarItemModel,
                        originalEvent: originalEvent
                    }
                };
                this.deleteImg(event, originalEvent.keyCode);
            }
            if (this.parent.getEditPanel().querySelector('.e-img-resize')) {
                this.removeResizeEle();
            } else if (this.parent.getEditPanel().querySelector('.e-rte-imageboxmark')) {
                this.parent.getEditPanel().querySelectorAll('.e-rte-imageboxmark').forEach((element: Element) => element && detach(element));
            }
        }
        switch (originalEvent.action) {
        case 'escape':
            this.parent.dotNetRef.invokeMethodAsync(events.closeImageDialog, null);
            break;
        case 'backspace':
        case 'delete':
            if (this.parent.editorMode !== 'Markdown') {
                if (range.startContainer.nodeType === 3) {
                    if (originalEvent.code === 'Backspace') {
                        if ((range.startContainer as HTMLElement).previousElementSibling && range.startOffset === 0 &&
                                    (range.startContainer as HTMLElement).previousElementSibling.classList.contains(classes.CLS_CAPTION) &&
                                    (range.startContainer as HTMLElement).previousElementSibling.classList.contains(classes.CLS_CAPINLINE))
                        {
                            detach((range.startContainer as HTMLElement).previousElementSibling);
                        }
                    } else {
                        if ((range.startContainer as HTMLElement).nextElementSibling &&
                                    range.endContainer.textContent.length === range.endOffset &&
                                    (range.startContainer as HTMLElement).nextElementSibling.classList.contains(classes.CLS_CAPTION) &&
                                    (range.startContainer as HTMLElement).nextElementSibling.classList.contains(classes.CLS_CAPINLINE)) {
                            detach((range.startContainer as HTMLElement).nextElementSibling);
                        }
                    }
                } else if (range.startContainer.nodeType === 1) {
                    if ((range.startContainer as HTMLElement).querySelector('.' + classes.CLS_CAPTION + '.' + classes.CLS_CAPINLINE)) {
                        detach((range.startContainer as HTMLElement).querySelector('.' + classes.CLS_CAPTION + '.' + classes.CLS_CAPINLINE));
                    } else if ((range.startContainer as HTMLElement).querySelector('.' + classes.CLS_CAPTION + '.' + classes.CLS_IMGBREAK)) {
                        detach((range.startContainer as HTMLElement).querySelector('.' + classes.CLS_CAPTION + '.' + classes.CLS_IMGBREAK));
                    } else if ((range.startContainer as HTMLElement).classList.contains('e-img-wrap') && closest((range.startContainer as HTMLElement), '.' + classes.CLS_CAPTION)) {
                        const parentElem: HTMLElement = (range.startContainer as HTMLElement).parentElement.parentElement;
                        detach(closest((range.startContainer as HTMLElement), '.' + classes.CLS_CAPTION));
                        if (parentElem && parentElem.textContent.trim() === '') {
                            const brElem: HTMLElement = createElement('br');
                            brElem.classList.add('e-rte-image-remove-focus');
                            parentElem.appendChild(brElem);
                        }
                    }
                }
            }
            break;
        case 'insert-image':
            this.showDialog(false, originalEvent, save, selectNodeEle, selectParentEle);
            originalEvent.preventDefault();
            break;
        }
        if (originalEvent.ctrlKey && originalEvent.key === 'a') {
            this.handleSelectAll();
        }
    }

    private isImageCurStartOrEnd(range: Range, isStart: boolean): boolean {
        const customHandlerElements: string[] = ['IMG'];
        const startContainer: Element = range.startContainer as Element;
        const startOffset: number = range.startOffset;
        if (range.collapsed && (startContainer.nodeType === 1) && (startContainer as HTMLElement).isContentEditable) {
            const isCursor: boolean = isStart ? startContainer.childNodes[startOffset as number] &&
                (customHandlerElements.indexOf((startContainer.childNodes[startOffset as number] as HTMLElement).nodeName) > -1) :
                startContainer.childNodes[startOffset - 1] &&
                (customHandlerElements.indexOf((startContainer.childNodes[startOffset - 1] as HTMLElement).nodeName) > -1);
            return isCursor ? isCursor : false;
        }
        return false;
    }

    private getImageCursorPosition(range: Range): ImageOrTableCursor {
        const start: boolean = this.isImageCurStartOrEnd(range, true);
        const end: boolean = this.isImageCurStartOrEnd(range, false);
        return { start, startName: '', end, endName: '' };
    }

    private handleSelectAll(): void {
        this.cancelResizeAction();
        const imgFocusNodes: NodeListOf<Element> = this.parent.inputElement.querySelectorAll('.' + classes.CLS_IMG_FOCUS);
        removeClass(imgFocusNodes, classes.CLS_IMG_FOCUS);
    }

    private onKeyUp(event: NotifyArgs): void {
        if (!isNOU(this.deletedImg) && this.deletedImg.length > 0) {
            for (let i: number = this.deletedImg.length - 1; i >= 0; i--) {
                const args: AfterImageDeleteEventArgs = {
                    src: (this.deletedImg[i as number] as HTMLElement).getAttribute('src')
                };
                if (this.parent.imageDeleteEnabled) { this.parent.dotNetRef.invokeMethodAsync('AfterImageDeleteEvent', args); }
                this.deletedImg.splice(i, 1);
            }
        }
    }
    private resizeStart(e: PointerEvent | TouchEvent, ele?: Element): void {
        if (this.parent.readonly) {
            return;
        }
        const target: HTMLElement = ele ? ele as HTMLElement : e.target as HTMLElement;
        this.prevSelectedImgEle = this.imgEle;
        if ((target as HTMLElement).tagName === 'IMG') {
            this.parent.preventDefaultResize(e as MouseEvent, false);
            const img: HTMLImageElement = target as HTMLImageElement;
            if (this.imgResizeDiv && this.parent.getEditPanel().contains(this.imgResizeDiv)) { detach(this.imgResizeDiv); }
            this.imageResize(img);
        }
        if ((target as HTMLElement).classList.contains('e-rte-imageboxmark')) {
            if (this.parent.formatter.getUndoRedoStack().length === 0) {
                this.parent.formatter.saveData();
            }
            this.pageX = this.getPointX(e);
            this.pageY = this.getPointY(e);
            e.preventDefault();
            e.stopImmediatePropagation();
            this.resizeBtnInit();
            if (this.quickToolObj) { this.quickToolObj.hideImageQTBar(); }
            const handlers: string[] = ['topLeft', 'topRight', 'botLeft', 'botRight'];
            for (let i: number = 0; i < handlers.length; i++) {
                const handler: string = handlers[i as number];
                if ((target as HTMLElement).classList.contains('e-rte-' + handler)) {
                    this.resizeBtnStat[handler as string] = true;
                    this.currentResizeHandler = handler;
                    this.aspectRatio = this.findAspectRatio(this.imgEle);
                    break; // Exit the loop once a match is found
                }
            }
            if (Browser.isDevice && this.parent.getEditPanel().contains(this.imgResizeDiv) &&
                !this.imgResizeDiv.classList.contains('e-mob-span')) {
                addClass([this.imgResizeDiv], 'e-mob-span');
            } else {
                const args: ResizeArgs = { requestType: 'Images' };
                if (this.parent.onResizeStartEnabled) {
                    (this.parent.dotNetRef.invokeMethodAsync('ResizeStartEvent', args) as unknown as Promise<ResizeArgs>).then((resizeStartArgs: ResizeArgs) => {
                        if (resizeStartArgs.cancel) { this.cancelResizeAction(); }
                    });
                }
            }
            EventHandler.add(this.parent.getDocument(), Browser.touchMoveEvent, this.resizing, this);
            EventHandler.add(this.parent.getDocument(), Browser.touchEndEvent, this.resizeEnd, this);
        }
    }

    private findAspectRatio(image: HTMLImageElement): number {
        return image.clientWidth / image.clientHeight;
    }

    private getResizeFactor(value: string): number[] {
        return imageResizeFactor[value as keyof IImageResizeFactor];
    }

    private setImageWidth(img: HTMLImageElement, value: number, suffix: string): void {
        img.style.width = this.getImageDimension(value, img) + suffix;
        if (!this.parent.insertImageSettings.resizeByPercent) {
            img.setAttribute('width', value.toString());
        }
    }

    private setImageHeight(img: HTMLImageElement, value: number, suffix: string): void {
        img.style.height = this.getImageDimension(value, img) + suffix;
        if (!this.parent.insertImageSettings.resizeByPercent) {
            img.setAttribute('height', value.toString());
        }
    }

    private removeImageHeight(img: HTMLImageElement): void {
        img.style.height = '';
        img.removeAttribute('height');
    }

    private getImageDimension(value: number, img: HTMLImageElement): number {
        if (this.parent.insertImageSettings.resizeByPercent) {
            const rootElem: Element = img.parentElement || img.previousElementSibling;
            return this.pixToPerc(value, rootElem);
        } else {
            return value;
        }
    }

    private adjustDimensionsByAspectRatio(width: number, height: number, aspectRatio: number): ImageDimension {
        height = Math.round(width / aspectRatio);
        width = Math.round(height * aspectRatio);
        return { width: width, height: height };
    }

    private pixToPerc(expected: number, parentEle: Element): number {
        return expected / parseFloat(getComputedStyle(parentEle).width) * 100;
    }

    private resizing(e: PointerEvent | TouchEvent): void {
        if (!this.parent) { this.cancelResizeAction(); return; }
        if (this.resizeBtnStat.botRight || this.resizeBtnStat.botLeft || this.resizeBtnStat.topRight || this.resizeBtnStat.topLeft) {
            if (this.parent.iframeSettings.enable) {
                const resizeFactor: number[] = this.getResizeFactor(this.currentResizeHandler);
                const currentScreenX: number = this.getPointX(e);
                const currentScreenY: number = this.getPointY(e);
                const currentWidth: number  = this.imgEle.clientWidth;
                const currentHeight: number = this.imgEle.clientHeight;
                const deltaX: number = currentScreenX - this.pageX;
                const deltaY: number = currentScreenY - this.pageY;
                const width: number = deltaX * resizeFactor[0] + currentWidth;
                const height: number = deltaY * resizeFactor[1] + currentHeight;
                const dimensions: ImageDimension = this.adjustDimensions(width, height, deltaX, deltaY, this.aspectRatio);
                this.pageX = currentScreenX;
                this.pageY = currentScreenY;
                this.imgDupMouseMove(dimensions.width + 'px', dimensions.height + 'px', e);
                this.parent.autoResize();
            } else {
                const pageX: number = this.getPointX(e);
                const pageY: number = this.getPointY(e);
                const resizeFactor: number[] = this.getResizeFactor(this.currentResizeHandler);
                const diffX: number = (pageX - this.pageX);
                const diffY: number = (pageY - this.pageY);
                const currentWidth: number  = this.imgEle.clientWidth;
                const currentHeight: number = this.imgEle.clientHeight;
                const width: number = diffX * resizeFactor[0] + currentWidth;
                const height: number = diffY * resizeFactor[1] + currentHeight;
                const dimensions: ImageDimension = this.adjustDimensions(width, height, diffX, diffY, this.aspectRatio);
                this.pageX = pageX;
                this.pageY = pageY;
                this.imgDupMouseMove(dimensions.width + 'px', dimensions.height + 'px', e);
            }
        }
    }

    private adjustDimensions (width: number, height: number, diffX: number, diffY: number, aspectRatio: number): ImageDimension {
        width = (width < 16) ? 16 : width;
        height = (height < 16) ? 16 : height;
        const dimensions: { width: number, height: number } = this.adjustDimensionsByAspectRatio(width, height, aspectRatio);
        return dimensions;
    }

    private resizeEnd(e: PointerEvent | TouchEvent): void {
        this.resizeBtnInit();
        this.imgEle.parentElement.style.cursor = 'auto';
        if (Browser.isDevice) { removeClass([(e.target as HTMLElement).parentElement], 'e-mob-span'); }
        const args: ResizeArgs = { requestType: 'Images' };
        if (this.parent.onResizeStopEnabled) { this.parent.dotNetRef.invokeMethodAsync('ResizeStopEvent', args); }
        this.parent.formatter.editorManager.observer.on(events.checkUndo, this.undoStack, this);
        this.parent.formatter.saveData();
        EventHandler.remove(this.parent.getDocument(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.parent.getDocument(), Browser.touchEndEvent, this.resizeEnd);
    }
    private dragStart(e: DragEvent): void | boolean {
        if ((e.target as HTMLElement).nodeName === 'IMG') {
            e.dataTransfer.effectAllowed = 'copyMove';
            (e.target as HTMLElement).classList.add(classes.CLS_RTE_DRAG_IMAGE);
        } else {
            return true;
        }
    }
    private dragOver(e?: DragEvent): void | boolean {
        if ((Browser.info.name === 'edge' && e.dataTransfer.items[0].type.split('/')[0].indexOf('image') > -1) ||
            (Browser.isIE && e.dataTransfer.types[0] === 'Files')) {
            e.preventDefault();
        } else {
            return true;
        }
    }
    private dragEnter(e?: DragEvent): void {
        e.dataTransfer.dropEffect = 'copy';
        e.preventDefault();
    }
    private dragDrop(e: ImageDragEvent): void | boolean {
        this.imageDragArgs = e;
        this.dropFiles = e.dataTransfer.files;
        const imgElement: HTMLElement = this.parent.inputElement.ownerDocument.querySelector('.' + classes.CLS_RTE_DRAG_IMAGE);
        if (imgElement && imgElement.tagName === 'IMG') {
            e.preventDefault();
            e.stopPropagation();
            if (e.dataTransfer.files.length <= 0 || imgElement) {
                (this.parent.dotNetRef.invokeMethodAsync('ActionBeginEvent', e) as unknown as Promise<ActionBeginEventArgs>).then((actionBeginArgs: ActionBeginEventArgs) => {
                    if (!actionBeginArgs.cancel) {
                        if (closest((e.target as HTMLElement), '#' + this.rteId + '_toolbar') ||
                            this.parent.inputElement.contentEditable === 'false') { return; }
                        if (this.parent.element.querySelector('.' + classes.CLS_IMG_RESIZE)) {
                            detach(this.imgResizeDiv);
                        }
                        this.selectRange(e);
                        const uploadArea: HTMLElement = this.parent.element.querySelector('.' + classes.CLS_DROPAREA) as HTMLElement;
                        if (uploadArea) { return; }
                        this.insertDragImage(e as DragEvent, this.dropFiles);
                    }
                });
            }
        } else {
            return true;
        }
    }
    //#endregion
    public destroy(): void {
        this.prevSelectedImgEle = undefined;
        this.removeEventListener();
    }
}
