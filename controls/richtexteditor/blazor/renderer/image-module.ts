import { addClass, detach, EventHandler, KeyboardEventArgs, select, Browser } from '@syncfusion/ej2-base';
import { closest, removeClass, isNullOrUndefined as isNOU, createElement } from '@syncfusion/ej2-base';
import { FileInfo } from '@syncfusion/ej2-inputs';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import * as events from '../constant';
import { CLS_RTE_IMG_BOX_MARK, } from '../classes';
import * as classes from '../classes';
import { QuickToolbar } from '../actions/quick-toolbar';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { NodeSelection } from '../../src/selection/selection';
import { dispatchEvent, parseHtml, hasClass, convertToBlob, isIDevice } from '../util';
import { IImageNotifyArgs, IShowImageDialog, AfterImageDeleteEventArgs } from '../interfaces';
import { NotifyArgs, IShowPopupArgs, ResizeArgs, ImageDragEvent, IDropDownItemModel } from '../../src/rich-text-editor/base/interface';
import { IToolbarItemModel, OffsetPosition, IImageCommandsArgs, ActionBeginEventArgs } from '../../src/rich-text-editor/base/interface';

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
    private imgResizeDiv: HTMLElement;
    private quickToolObj: QuickToolbar;
    private inputUrl: HTMLInputElement;
    private imgUploadSave: NodeSelection;
    public droppedImage: HTMLImageElement;
    private uploadUrl: IImageCommandsArgs;
    private selectionObj: IImageNotifyArgs;
    private imgUploadSelectedParent: Node[];
    private resizeBtnStat: { [key: string]: boolean };
    private imgDupPos: { [key: string]: number | string };

    constructor(parent?: SfRichTextEditor) {
        this.parent = parent;
        this.rteId = parent.element.id;
        this.addEventListener();
    }
    protected addEventListener(): void {
        this.parent.observer.on(events.keyUp, this.onKeyUp, this);
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
        this.parent.observer.on(events.dropDownSelect, this.alignmentSelect, this);
        this.parent.observer.on(events.iframeMouseDown, this.onIframeMouseDown, this);
        this.parent.observer.on(events.imageToolbarAction, this.onToolbarAction, this);
        this.parent.observer.on(events.editAreaClick, this.editAreaClickHandler, this);
        this.parent.observer.on(events.insertCompleted, this.showImageQuickToolbar, this);
    }
    protected removeEventListener(): void {
        this.parent.observer.off(events.keyUp, this.onKeyUp);
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
        this.parent.observer.off(events.dropDownSelect, this.alignmentSelect);
        this.parent.observer.off(events.iframeMouseDown, this.onIframeMouseDown);
        this.parent.observer.off(events.imageToolbarAction, this.onToolbarAction);
        this.parent.observer.off(events.editAreaClick, this.editAreaClickHandler);
        this.parent.observer.off(events.insertCompleted, this.showImageQuickToolbar);
        let dropElement: HTMLElement | Document = this.parent.iframeSettings.enable ?
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
    private afterRender(): void {
        EventHandler.add(this.parent.getEditPanel(), Browser.touchEndEvent, this.imageClick, this);
        if (this.parent.insertImageSettings.resize) {
            EventHandler.add(this.parent.getEditPanel(), Browser.touchStartEvent, this.resizeStart, this);
            EventHandler.add(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick, this);
            EventHandler.add(this.parent.getEditPanel(), 'cut', this.onCutHandler, this);
        }
        let dropElement: HTMLElement | Document = this.parent.iframeSettings.enable ? this.parent.inputElement.ownerDocument :
            this.parent.inputElement;
        dropElement.addEventListener('drop', this.dragDrop.bind(this), true);
        dropElement.addEventListener('dragstart', this.dragStart.bind(this), true);
        dropElement.addEventListener('dragenter', this.dragOver.bind(this), true);
        dropElement.addEventListener('dragover', this.dragOver.bind(this), true);
    }
    private imageDialog(e: IImageNotifyArgs): void {
        this.parent.dotNetRef.invokeMethodAsync(events.closeImageDialog);
        this.uploadUrl = { url: '' };
        this.selectionObj = { selfImage: this, selection: e.selection, args: e.args, selectParent: e.selectParent };
        if ((!isNOU(this.parent.insertImageSettings.path) && this.parent.editorMode === 'Markdown')
            || this.parent.editorMode === 'HTML') {
            let iframe: boolean = this.parent.iframeSettings.enable;
            if (this.parent.editorMode === 'HTML' && (!iframe && isNOU(closest(e.selection.range.startContainer.parentNode, '#' +
                this.parent.getPanel().id))
                || (iframe && !hasClass(e.selection.range.startContainer.parentNode.ownerDocument.querySelector('body'), 'e-lib')))) {
                (this.parent.getEditPanel() as HTMLElement).focus();
                let range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
                this.imgUploadSave = this.parent.formatter.editorManager.nodeSelection.save(
                    range, this.parent.getDocument());
                this.imgUploadSelectedParent = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            } else {
                this.imgUploadSave = e.selection; this.imgUploadSelectedParent = e.selectParent;
            }
        }
        let obj: IShowImageDialog = { mode: (e.selectNode && e.selectNode[0].nodeName === 'IMG' ? 'Edit' : 'Insert') };
        this.parent.dotNetRef.invokeMethodAsync(events.showImageDialog, obj);
        if (this.quickToolObj) {
            this.quickToolObj.hideImageQTBar();
            if (!isNOU(e.selectParent as Node[])) { removeClass([e.selectParent[0] as HTMLElement], 'e-img-focus'); }
            this.quickToolObj.hideInlineQTBar();
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
        let startRange: Range = this.parent.getDocument().createRange();
        this.parent.formatter.editorManager.nodeSelection.setRange(this.parent.getDocument(), startRange);
        let elem: Element = this.parent.getDocument().elementFromPoint(x, y);
        let startNode: Node = (elem.childNodes.length > 0 ? elem.childNodes[0] : elem);
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
        let e: ImageDragEvent = this.imageDragArgs;
        if (this.parent.element.querySelector('.' + classes.CLS_IMG_RESIZE)) {
            detach(this.imgResizeDiv);
        }
        this.selectRange(this.imageDragArgs);
        if (this.dropFiles.length > 1) {
            return;
        }
        this.parent.observer.notify(events.drop, { args: e });
        let imgFiles: FileList = this.dropFiles;
        let fileName: string = imgFiles[0].name;
        let imgType: string = fileName.substring(fileName.lastIndexOf('.'));
        let allowedTypes: string[] = this.parent.insertImageSettings.allowedTypes as string[];
        for (let i: number = 0; i < allowedTypes.length; i++) {
            if (imgType.toLocaleLowerCase() === allowedTypes[i].toLowerCase()) {
                if (this.parent.insertImageSettings.saveUrl || isStream) {
                    this.onSelect(this.dropFiles);
                } else {
                    let args: NotifyArgs = { text: '', file: imgFiles[0] };
                    this.imagePaste(args);
                }
            }
        }
    }
    private insertDragImage(e: DragEvent, dropFiles: FileList): void {
        e.preventDefault();
        let activePopupElement: HTMLElement = this.parent.element.querySelector('' + classes.CLS_POPUP_OPEN);
        this.parent.observer.notify(events.drop, { args: e });
        if (activePopupElement) {
            activePopupElement.classList.add(classes.CLS_HIDE);
        }
        if (dropFiles.length <= 0) { //For internal image drag and drop
            let range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
            let imgElement: HTMLElement = this.parent.inputElement.ownerDocument.querySelector('.' + classes.CLS_RTE_DRAG_IMAGE);
            if (imgElement && imgElement.tagName === 'IMG') {
                if (imgElement.nextElementSibling) {
                    if (imgElement.nextElementSibling.classList.contains(classes.CLS_IMG_INNER)) {
                        range.insertNode(imgElement.parentElement.parentElement);
                    } else {
                        range.insertNode(imgElement);
                    }
                } else {
                    range.insertNode(imgElement);
                }
                imgElement.classList.remove(classes.CLS_RTE_DRAG_IMAGE);
                imgElement.addEventListener('load', () => {
                    this.parent.dotNetRef.invokeMethodAsync(events.actionCompleteEvent, null);
                });
                this.parent.formatter.editorManager.nodeSelection.Clear(this.parent.getDocument());
                let args: MouseEvent = e as MouseEvent;
                this.resizeStart(args as PointerEvent, imgElement);
                this.hideImageQuickToolbar();
            }
        }
    }
    private onSelect(dropFiles: FileList): void {
        let proxy: Image = this;
        let range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
        let validFiles: FileInfo = {
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
        let file: File = validFiles.rawFile as File;
        let reader: FileReader = new FileReader();
        reader.addEventListener('load', () => {
            let url: string = URL.createObjectURL(convertToBlob(reader.result as string));
            this.droppedImage.src = proxy.parent.insertImageSettings.saveFormat === 'Blob' ? url : reader.result as string;
        });
        if (file) {
            reader.readAsDataURL(file);
        }
        range.insertNode(this.droppedImage);
        range.selectNodeContents(this.droppedImage);
        this.parent.formatter.editorManager.nodeSelection.setRange(this.parent.getDocument(), range);
        this.droppedImage.addEventListener('load', () => {
            this.parent.dotNetRef.invokeMethodAsync(events.actionCompleteEvent, null);
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
            let proxy: Image = this;
            let reader: FileReader = new FileReader();
            if (args.args) { (args.args as KeyboardEvent).preventDefault(); }
            reader.addEventListener('load', (e: MouseEvent) => {
                let url: IImageCommandsArgs = {
                    cssClass: (proxy.parent.insertImageSettings.display === 'inline' ? classes.CLS_IMGINLINE : classes.CLS_IMGBREAK),
                    url: this.parent.insertImageSettings.saveFormat === 'Base64' || !isNOU(args.callBack) ?
                        reader.result as string : URL.createObjectURL(convertToBlob(reader.result as string)),
                    width: {
                        width: proxy.parent.insertImageSettings.width, minWidth: proxy.parent.insertImageSettings.minWidth,
                        maxWidth: proxy.getMaxWidth()
                    },
                    height: {
                        height: proxy.parent.insertImageSettings.height, minHeight: proxy.parent.insertImageSettings.minHeight,
                        maxHeight: proxy.parent.insertImageSettings.maxHeight
                    }
                };
                if (!isNOU(args.callBack)) {
                    args.callBack(url);
                    return;
                } else {
                    proxy.parent.formatter.process(proxy.parent, { item: { command: 'Images', subCommand: 'Image' } }, args.args, url);
                    this.showPopupToolBar(args, url);
                }
            });
            reader.readAsDataURL((args as NotifyArgs).file);
        }
    }
    private showPopupToolBar(e: NotifyArgs, url: IImageCommandsArgs): void {
        let imageSrc: string = 'img[src="' + url.url + '"]';
        let imageElement: Element = this.parent.inputElement.querySelector(imageSrc);
        let args: IShowPopupArgs = {
            args: e.args as MouseEvent,
            type: 'Images',
            isNotify: undefined,
            elements: imageElement
        };
        if (imageElement) {
            setTimeout(() => { this.showImageQuickToolbar(args); this.resizeStart(e.args as PointerEvent, imageElement); }, 0);
        }
    }
    private undoStack(args?: { [key: string]: string }): void {
        if (args.subCommand.toLowerCase() === 'undo' || args.subCommand.toLowerCase() === 'redo') {
            for (let i: number = 0; i < this.parent.formatter.getUndoRedoStack().length; i++) {
                let temp: Element = createElement('div');
                let contentElem: DocumentFragment = parseHtml(this.parent.formatter.getUndoRedoStack()[i].text);
                temp.appendChild(contentElem);
                let img: NodeListOf<HTMLElement> = temp.querySelectorAll('img');
                if (temp.querySelector('.' + classes.CLS_IMG_RESIZE) && img.length > 0) {
                    for (let j: number = 0; j < img.length; j++) { img[j].style.outline = ''; }
                    detach(temp.querySelector('.' + classes.CLS_IMG_RESIZE));
                    this.parent.formatter.getUndoRedoStack()[i].text = temp.innerHTML;
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
        EventHandler.add(this.parent.getDocument(), Browser.touchMoveEvent, this.resizing, this);
    }
    private resizeBtnInit(): { [key: string]: boolean } {
        return this.resizeBtnStat = { botLeft: false, botRight: false, topRight: false, topLeft: false };
    }
    private imgResizePos(e: HTMLImageElement, imgResizeDiv: HTMLElement): void {
        let pos: OffsetPosition = this.calcPos(e);
        let top: number = pos.top;
        let left: number = pos.left;
        let imgWid: number = e.width;
        let imgHgt: number = e.height;
        let borWid: number = (Browser.isDevice) ? (4 * parseInt((e.style.outline.slice(-3)), 10)) + 2 :
            (2 * parseInt((e.style.outline.slice(-3)), 10)) + 2; //span border width + image outline width
        let devWid: number = ((Browser.isDevice) ? 0 : 2);   // span border width
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
        let ignoreOffset: string[] = ['TD', 'TH', 'TABLE', 'A'];
        let parentOffset: OffsetPosition = { top: 0, left: 0 };
        let offset: OffsetPosition = elem.getBoundingClientRect();
        let doc: Document = elem.ownerDocument;
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
        return {
            top: offset.top - parentOffset.top,
            left: offset.left - parentOffset.left
        };
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
    private pixToPercent(expected: number, parentEle: Element): number {
        return expected / parseFloat(getComputedStyle(parentEle).width) * 100;
    }
    private imgDupMouseMove(width: string, height: string, e: PointerEvent | TouchEvent): void {
        let args: ResizeArgs = { requestType: 'Images' };
        if ((parseInt(this.parent.insertImageSettings.minWidth as string, 10) >= parseInt(width, 10) ||
            parseInt(this.getMaxWidth() as string, 10) <= parseInt(width, 10))) {
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
        this.parent.setContentHeight('', false);
    }
    private setAspectRatio(img: HTMLImageElement, expectedX: number, expectedY: number): void {
        if (isNOU(img.width)) { return; }
        let width: number = img.style.width !== '' ? parseInt(img.style.width, 10) : img.width;
        let height: number = img.style.height !== '' ? parseInt(img.style.height, 10) : img.height;
        if (width > height) {
            if (this.parent.insertImageSettings.resizeByPercent) {
                img.style.width = this.pixToPercent((width / height * expectedY), (img.previousElementSibling || img.parentElement)) + '%';
                img.style.height = null;
                img.removeAttribute('height');
            } else if (img.style.width !== '') {
                img.style.width = (width / height * expectedY) + 'px';
                img.style.height = expectedY + 'px';
            } else {
                img.setAttribute('width', (width / height * expectedY).toString());
                img.setAttribute('height', expectedY.toString());
            }
        } else if (height > width) {
            if (this.parent.insertImageSettings.resizeByPercent) {
                img.style.width = this.pixToPercent(expectedX, (img.previousElementSibling || img.parentElement)) + '%';
                img.style.height = null;
                img.removeAttribute('height');
            } else if (img.style.width !== '') {
                img.style.width = expectedX + 'px';
                img.style.height = (height / width * expectedX) + 'px';
            } else {
                img.setAttribute('width', expectedX.toString());
                img.setAttribute('height', (height / width * expectedX).toString());
            }
        } else {
            if (this.parent.insertImageSettings.resizeByPercent) {
                img.style.width = this.pixToPercent(expectedX, (img.previousElementSibling || img.parentElement)) + '%';
                img.style.height = null;
                img.removeAttribute('height');
            } else if (img.style.width !== '') {
                img.style.width = expectedX + 'px';
                img.style.height = expectedX + 'px';
            } else {
                img.setAttribute('width', expectedX.toString());
                img.setAttribute('height', expectedX.toString());
            }
        }
    }
    private getMaxWidth(): string | number {
        let maxWidth: string | number = this.parent.insertImageSettings.maxWidth as number;
        let imgPadding: number = 12;
        let imgResizeBorder: number = 2;
        let editEle: HTMLElement = this.parent.getEditPanel() as HTMLElement;
        let eleStyle: CSSStyleDeclaration = window.getComputedStyle(editEle);
        let editEleMaxWidth: number = editEle.offsetWidth - (imgPadding + imgResizeBorder +
            parseFloat(eleStyle.paddingLeft.split('px')[0]) + parseFloat(eleStyle.paddingRight.split('px')[0]) +
            parseFloat(eleStyle.marginLeft.split('px')[0]) + parseFloat(eleStyle.marginRight.split('px')[0]));
        return isNOU(maxWidth) ? editEleMaxWidth : maxWidth;
    }
    private cancelResizeAction(): void {
        EventHandler.remove(this.parent.getDocument(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.parent.getDocument(), Browser.touchEndEvent, this.resizeEnd);
        if (this.imgEle && this.imgResizeDiv && this.parent.getEditPanel().contains(this.imgResizeDiv)) {
            detach(this.imgResizeDiv);
            (this.imgEle as HTMLElement).style.outline = '';
            this.imgResizeDiv = null;
            this.pageX = null;
            this.pageY = null;
        }
    }
    private removeResizeEle(): void {
        EventHandler.remove(this.parent.getDocument(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.parent.getDocument(), Browser.touchEndEvent, this.resizeEnd);
        detach(this.parent.getEditPanel().querySelector('.e-img-resize'));
    }
    //#endregion
    //#region Quick toolbar related methods
    private editAreaClickHandler(e: IImageNotifyArgs): void {
        if (this.parent.readonly) {
            this.hideImageQuickToolbar();
            return;
        }
        let args: MouseEvent = e.args as MouseEvent;
        let showOnRightClick: boolean = this.parent.quickToolbarSettings.showOnRightClick as boolean;
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
            let target: HTMLElement = args.target as HTMLElement;
            let isPopupOpen: boolean;
            isPopupOpen = document.body.querySelector('#' + this.rteId + events.imageQuickPopup).classList.contains('e-rte-pop');
            if (target.nodeName === 'IMG' && this.parent.quickToolbarModule) {
                if (isPopupOpen) { return; }
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
        let type: string = 'ImageLink';
        if (e.type !== 'Images' || isNOU(this.parent.quickToolbarModule)) { return; }
        this.quickToolObj = this.parent.quickToolbarModule;
        let args: MouseEvent = e.args as MouseEvent;
        let target: HTMLElement = e.elements as HTMLElement;
        [].forEach.call(e.elements, (element: Element, index: number) => {
            if (index === 0) {
                target = <HTMLElement>element;
            }
        });
        if (target && !closest(target, 'a')) {
            type = 'Image';
        }
        if (target.nodeName === 'IMG') { addClass([target], ['e-img-focus']); }
        let pageY: number = (this.parent.iframeSettings.enable) ? window.pageYOffset +
            this.parent.element.getBoundingClientRect().top + args.clientY : args.pageY;
        if (this.parent.quickToolbarModule) {
            if (e.isNotify) {
                setTimeout(() => { this.quickToolObj.showImageQTBar(args.pageX, pageY, target, type); }, 400);
            } else {
                this.quickToolObj.showImageQTBar(args.pageX, pageY, target, type);
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
        let item: IToolbarItemModel = (args.args as ClickEventArgs).item as IToolbarItemModel;
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
        let target: string = (e.selectParent[0].parentNode as HTMLAnchorElement).target === '' ? '_self' : '_blank';
        this.parent.formatter.process(
            this.parent, e.args, e.args,
            {
                url: (e.selectParent[0].parentNode as HTMLAnchorElement).href, target: target, selectNode: e.selectNode,
                subCommand: ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand
            });
    }
    private editImgLink(e: NotifyArgs): void {
        let selectParentEle: HTMLElement = e.selectParent[0].parentNode as HTMLElement;
        let inputDetails: { [key: string]: string } = {
            url: (selectParentEle as HTMLAnchorElement).href, target: (selectParentEle as HTMLAnchorElement).target
        };
        this.insertImgLink(e, inputDetails);
    }
    private removeImgLink(e: NotifyArgs): void {
        if (Browser.isIE) { (this.parent.getEditPanel() as HTMLElement).focus(); }
        e.selection.restore();
        let isCapLink: boolean = (this.parent.getEditPanel().contains(this.captionEle) && select('a', this.captionEle)) ?
            true : false;
        let selectParent: Node[] = isCapLink ? [this.captionEle] : [e.selectNode[0].parentElement];
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
        let selectNode: HTMLElement = e.selectNode[0] as HTMLElement;
        if (selectNode.nodeName !== 'IMG') {
            return;
        }
        e.selection.restore();
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        this.cancelResizeAction();
        addClass([selectNode], 'e-rte-image');
        let subCommand: string = ((e.args as ClickEventArgs).item) ?
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
            let imgContain: HTMLElement = createElement('span', { className: 'e-img-wrap' });
            let imgInner: HTMLElement = createElement('span', { className: 'e-img-inner', attrs: { contenteditable: 'true' } });
            let parent: HTMLElement = e.selectNode[0].parentElement;
            if (parent.tagName === 'A') { parent.setAttribute('contenteditable', 'true'); }
            imgContain.appendChild(parent.tagName === 'A' ? parent : e.selectNode[0]);
            imgContain.appendChild(imgInner);
            /* tslint:disable */
            let imgCaption: string = this.parent.localeData['imageCaption'];
            /* tslint:enable */
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
        let regexp: RegExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi;
        return regexp.test(url);
    }
    public insertLink(url: string, target: string): void {
        if (this.selectionObj.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        let linkEle: HTMLElement = document.querySelector('.e-rte-img-dialog .e-img-link');
        if (url === '') {
            addClass([linkEle], 'e-error');
            (linkEle as HTMLInputElement).setSelectionRange(0, url.length);
            (linkEle as HTMLInputElement).focus();
            return;
        }
        if (!this.isUrl(url)) {
            url = 'http://' + url;
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
                    url: url, target: target, selectNode: this.selectionObj.selectNode,
                    subCommand: ((this.selectionObj.args as ClickEventArgs).item as IDropDownItemModel).subCommand
                });
            this.parent.dotNetRef.invokeMethodAsync(events.closeImageDialog);
            return;
        }
        this.parent.formatter.process(
            this.parent, this.selectionObj.args, this.selectionObj.args,
            {
                url: url, target: target, selectNode: this.selectionObj.selectNode,
                subCommand: ((this.selectionObj.args as ClickEventArgs).item as IDropDownItemModel).subCommand,
                selection: this.selectionObj.selection
            });
        let captionEle: Element = closest(this.selectionObj.selectNode[0], '.e-img-caption');
        if (captionEle) { (select('.e-img-inner', captionEle) as HTMLElement).focus(); }
        this.parent.dotNetRef.invokeMethodAsync(events.closeImageDialog);
    }
    private insertAltText(e: IImageNotifyArgs): void {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        let selectNodeAltValue: string = (e.selectNode[0] as HTMLElement).getAttribute('alt');
        let obj: IShowImageDialog = { mode: 'AltText', altText: ((selectNodeAltValue === null) ? '' : selectNodeAltValue) };
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
        this.parent.dotNetRef.invokeMethodAsync(events.closeImageDialog);
    }
    private deleteImg(e: IImageNotifyArgs, keyCode?: number): void {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        let args: AfterImageDeleteEventArgs = {
            src: (e.selectNode[0] as HTMLElement).getAttribute('src')
        };
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        e.selection.restore();
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
        if (isNOU(keyCode)) {
            this.parent.dotNetRef.invokeMethodAsync('AfterImageDeleteEvent', args);
        }
    }
    private imageSize(e: IImageNotifyArgs): void {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        let selectNode: HTMLImageElement = (e as IImageNotifyArgs).selectNode[0] as HTMLImageElement;
        let width: string | number = (selectNode.getAttribute('width') === 'auto' ||
            isNOU(selectNode.getAttribute('width'))) ? selectNode.width : selectNode.getClientRects()[0].width;
        let height: string | number = (selectNode.getAttribute('height') === 'auto' ||
            isNOU(selectNode.getAttribute('height'))) ? selectNode.height : selectNode.getClientRects()[0].height;
        let obj: IShowImageDialog = {
            mode: 'Dimension', width: width, height: height, maxWidth: this.getMaxWidth() as number
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
        this.parent.dotNetRef.invokeMethodAsync(events.closeImageDialog);
    }
    private alignmentSelect(e: ClickEventArgs): void {
        let item: IDropDownItemModel = e.item as IDropDownItemModel;
        if (!document.body.contains(document.body.querySelector('.e-rte-quick-toolbar')) || item.command !== 'Images') {
            return;
        }
        let range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
        let selectNodeEle: Node[] = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
        selectNodeEle = (selectNodeEle[0].nodeName === 'IMG') ? selectNodeEle : [this.imgEle];
        let args: IImageNotifyArgs = { args: e, selectNode: selectNodeEle };
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
        let subCommand: string = ((e.args as ClickEventArgs).item) ?
            ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand : type;
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    }
    private inline(e: IImageNotifyArgs): void {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        let subCommand: string = ((e.args as ClickEventArgs).item) ?
            ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand : 'Inline';
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    }
    private break(e: IImageNotifyArgs): void {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        let subCommand: string = ((e.args as ClickEventArgs).item) ?
            ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand : 'Break';
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    }
    //#endregion
    //#region Interop methods
    public dialogOpened(): void {
        let dialogContent: HTMLElement = this.parent.element.querySelector('.e-rte-img-dialog .e-img-content');
        if (isNOU(dialogContent)) { return; }
        if ((!isNOU(this.parent.insertImageSettings.path) && this.parent.editorMode === 'Markdown')
            || this.parent.editorMode === 'HTML') {
            (dialogContent.querySelector('#' + this.rteId + '_insertImage') as HTMLElement).focus();
        } else {
            (dialogContent.querySelector('.e-img-url') as HTMLElement).focus();
        }
    }
    public invokeImageBrowse(): void {
        (this.parent.element.querySelector('.e-rte-img-dialog .e-file-select-wrap button') as HTMLButtonElement).click();
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
            let url: string = this.parent.insertImageSettings.saveFormat === 'Base64' ? base64Str :
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
    }
    public insertImageUrl(): void {
        this.inputUrl = this.parent.element.querySelector('.e-rte-img-dialog .e-img-url');
        let url: string = this.inputUrl.value;
        if (this.isStreamUrl && this.modifiedUrl !== '') {
            this.uploadUrl.url = this.modifiedUrl;
            this.modifiedUrl = '';
        }
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        if (!isNOU(this.uploadUrl) && this.uploadUrl.url !== '') {
            this.uploadUrl.cssClass = this.parent.insertImageSettings.display === 'inline' ? classes.CLS_IMGINLINE : classes.CLS_IMGBREAK;
            this.parent.dotNetRef.invokeMethodAsync(events.closeImageDialog);
            this.parent.formatter.process(
                this.parent, this.selectionObj.args, (this.selectionObj.args as ClickEventArgs).originalEvent, this.uploadUrl);
            if (this.parent.getEditPanel().querySelector('.e-img-resize')) {
                (this.imgEle as HTMLElement).style.outline = '';
                this.removeResizeEle();
            }
        } else if (url !== '') {
            if (this.parent.editorMode === 'HTML' && isNOU(
                closest(this.selectionObj.selection.range.startContainer.parentNode, '#' + this.parent.getPanel().id))) {
                (this.parent.getEditPanel() as HTMLElement).focus();
                let range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
                this.selectionObj.selection = this.parent.formatter.editorManager.nodeSelection.save(range, this.parent.getDocument());
                this.selectionObj.selectParent = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            }
            let regex: RegExp = /[\w-]+.(jpg|png|jpeg|gif)/g;
            let matchUrl: string = (!isNOU(url.match(regex)) && this.parent.editorMode === 'HTML') ? url.match(regex)[0] : '';
            let value: IImageCommandsArgs = {
                cssClass: (this.parent.insertImageSettings.display === 'inline' ? classes.CLS_IMGINLINE : classes.CLS_IMGBREAK),
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
            this.parent.formatter.process(
                this.parent, this.selectionObj.args, (this.selectionObj.args as ClickEventArgs).originalEvent, value);
            this.parent.dotNetRef.invokeMethodAsync(events.closeImageDialog);
        }
    }
    //#endregion
    //#region Event handler methods
    private onCutHandler(): void {
        if (this.imgResizeDiv && this.parent.getEditPanel().contains(this.imgResizeDiv)) {
            this.cancelResizeAction();
        }
    }
    private onIframeMouseDown(): void {
        this.parent.dotNetRef.invokeMethodAsync(events.closeImageDialog);
    }
    private onDocumentClick(e: MouseEvent): void {
        let target: HTMLElement = <HTMLElement>e.target;
        if (target.nodeName === 'IMG') { this.imgEle = target as HTMLImageElement; }
        let dlgEle: HTMLElement = document.body.querySelector('#' + this.rteId + '_image.e-rte-img-dialog');
        if (!isNOU(dlgEle) && ((
            !closest(target, '#' + this.rteId + '_image') && this.parent.toolbarSettings.enable && this.parent.getToolbarElement() &&
            !this.parent.getToolbarElement().contains(e.target as Node)) ||
            (this.parent.getToolbarElement() && this.parent.getToolbarElement().contains(e.target as Node) &&
                !closest(target, '#' + this.rteId + '_toolbar_Image') &&
                !target.querySelector('#' + this.rteId + '_toolbar_Image')))
        ) {
            this.parent.dotNetRef.invokeMethodAsync(events.closeImageDialog);
            this.parent.isBlur = true;
            dispatchEvent(this.parent.element, 'focusout');
        }
        if ((e.target as HTMLElement).tagName !== 'IMG' && this.imgResizeDiv && !this.quickToolObj &&
            this.parent.getEditPanel().contains(this.imgResizeDiv)) {
            this.cancelResizeAction();
        }
        if (target.tagName !== 'IMG' && this.parent.getEditPanel().querySelector('.e-img-resize')) {
            this.removeResizeEle();
            this.parent.getEditPanel().querySelector('img').style.outline = '';
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
        let originalEvent: KeyboardEventArgs = event.args as KeyboardEventArgs;
        let range: Range;
        let save: NodeSelection;
        let selectNodeEle: Node[]; let selectParentEle: Node[]; this.deletedImg = []; let isCursor: boolean;
        let keyCodeValues: number[] = [27, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123,
            44, 45, 9, 16, 17, 18, 19, 20, 33, 34, 35, 36, 37, 38, 39, 40, 91, 92, 93, 144, 145, 182, 183];
        if (this.parent.editorMode === 'HTML') {
            range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
            isCursor = range.startContainer === range.endContainer && range.startOffset === range.endOffset;
        }
        if (!isCursor && this.parent.editorMode === 'HTML' && keyCodeValues.indexOf(originalEvent.which) < 0) {
            let nodes: Node[] = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
            for (let i: number = 0; i < nodes.length; i++) {
                if (nodes[i].nodeName === 'IMG') {
                    this.deletedImg.push(nodes[i]);
                }
            }
        }
        if (this.parent.editorMode === 'HTML' && ((originalEvent.which === 8 && originalEvent.code === 'Backspace') ||
            (originalEvent.which === 46 && originalEvent.code === 'Delete'))) {
            let isCursor: boolean = range.startContainer === range.endContainer && range.startOffset === range.endOffset;
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
            if (!originalEvent.ctrlKey && originalEvent.key && (originalEvent.key.length === 1 || originalEvent.action === 'enter') &&
                ((selectParentEle[0] as HTMLElement).tagName === 'IMG') && (selectParentEle[0] as HTMLElement).parentElement) {
                let prev: Node = ((selectParentEle[0] as HTMLElement).parentElement as HTMLElement).childNodes[0];
                if (this.parent.getEditPanel().querySelector('.e-img-resize')) {
                    this.removeResizeEle();
                }
                this.parent.formatter.editorManager.nodeSelection.setSelectionText(
                    this.parent.getDocument(), prev, prev, prev.textContent.length, prev.textContent.length);
                removeClass([selectParentEle[0] as HTMLElement], 'e-img-focus');
                this.quickToolObj.hideImageQTBar();
            }
        }
        if (originalEvent.ctrlKey && (originalEvent.keyCode === 89 || originalEvent.keyCode === 90)) {
            this.undoStack({ subCommand: (originalEvent.keyCode === 90 ? 'undo' : 'redo') });
        }
        if (originalEvent.keyCode === 8 || originalEvent.keyCode === 46) {
            if (selectNodeEle && selectNodeEle[0].nodeName === 'IMG' && selectNodeEle.length < 1) {
                originalEvent.preventDefault();
                let event: IImageNotifyArgs = {
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
            }
        }
        switch (originalEvent.action) {
            case 'escape':
                this.parent.dotNetRef.invokeMethodAsync(events.closeImageDialog);
                break;
            case 'insert-image':
                if (this.parent.editorMode === 'HTML') {
                    this.imageDialog({
                        args: {
                            item: { command: 'Images', subCommand: 'Image' } as IToolbarItemModel,
                            originalEvent: originalEvent
                        },
                        selectNode: selectNodeEle,
                        selection: save,
                        selectParent: selectParentEle
                    });
                } else {
                    this.imageDialog({
                        args: {
                            item: { command: 'Images', subCommand: 'Image' } as IToolbarItemModel,
                            originalEvent: originalEvent
                        },
                        member: 'image',
                        text: this.parent.formatter.editorManager.markdownSelection.getSelectedText(
                            this.parent.getEditPanel() as HTMLTextAreaElement),
                        module: 'Markdown',
                        name: 'insertImage'
                    });
                }
                originalEvent.preventDefault();
                break;
        }
    }
    private onKeyUp(event: NotifyArgs): void {
        if (!isNOU(this.deletedImg) && this.deletedImg.length > 0) {
            for (let i: number = 0; i < this.deletedImg.length; i++) {
                let args: AfterImageDeleteEventArgs = {
                    src: (this.deletedImg[i] as HTMLElement).getAttribute('src')
                };
                this.parent.dotNetRef.invokeMethodAsync('AfterImageDeleteEvent', args);
            }
        }
    }
    private resizeStart(e: PointerEvent | TouchEvent, ele?: Element): void {
        if (this.parent.readonly) {
            return;
        }
        let target: HTMLElement = ele ? ele as HTMLElement : e.target as HTMLElement;
        if ((target as HTMLElement).tagName === 'IMG') {
            this.parent.defaultResize(e as MouseEvent, false);
            let img: HTMLImageElement = target as HTMLImageElement;
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
            if ((target as HTMLElement).classList.contains('e-rte-topLeft')) { this.resizeBtnStat.topLeft = true; }
            if ((target as HTMLElement).classList.contains('e-rte-topRight')) { this.resizeBtnStat.topRight = true; }
            if ((target as HTMLElement).classList.contains('e-rte-botLeft')) { this.resizeBtnStat.botLeft = true; }
            if ((target as HTMLElement).classList.contains('e-rte-botRight')) { this.resizeBtnStat.botRight = true; }
            if (Browser.isDevice && this.parent.getEditPanel().contains(this.imgResizeDiv) &&
                !this.imgResizeDiv.classList.contains('e-mob-span')) {
                addClass([this.imgResizeDiv], 'e-mob-span');
            } else {
                let args: ResizeArgs = { requestType: 'Images' };
                // @ts-ignore-start
                this.parent.dotNetRef.invokeMethodAsync('ResizeStartEvent', args).then((resizeStartArgs: ResizeArgs) => {
                    // @ts-ignore-end
                    if (resizeStartArgs.cancel) {
                        this.cancelResizeAction();
                    }
                });
            }
            EventHandler.add(this.parent.getDocument(), Browser.touchEndEvent, this.resizeEnd, this);
        }
    }
    private resizing(e: PointerEvent | TouchEvent): void {
        if (this.imgEle.offsetWidth >= this.getMaxWidth()) {
            this.imgEle.style.maxHeight = this.imgEle.offsetHeight + 'px';
        }
        let pageX: number = this.getPointX(e);
        let pageY: number = this.getPointY(e);
        let mouseX: number = (this.resizeBtnStat.botLeft || this.resizeBtnStat.topLeft) ? -(pageX - this.pageX) : (pageX - this.pageX);
        let mouseY: number = (this.resizeBtnStat.topLeft || this.resizeBtnStat.topRight) ? -(pageY - this.pageY) : (pageY - this.pageY);
        let width: number = parseInt(this.imgDupPos.width as string, 10) + mouseX;
        let height: number = parseInt(this.imgDupPos.height as string, 10) + mouseY;
        this.pageX = pageX;
        this.pageY = pageY;
        if (this.resizeBtnStat.botRight) {
            this.imgDupMouseMove(width + 'px', height + 'px', e);
        } else if (this.resizeBtnStat.botLeft) {
            this.imgDupMouseMove(width + 'px', height + 'px', e);
        } else if (this.resizeBtnStat.topRight) {
            this.imgDupMouseMove(width + 'px', height + 'px', e);
        } else if (this.resizeBtnStat.topLeft) {
            this.imgDupMouseMove(width + 'px', height + 'px', e);
        }
    }
    private resizeEnd(e: PointerEvent | TouchEvent): void {
        this.resizeBtnInit();
        this.imgEle.parentElement.style.cursor = 'auto';
        if (Browser.isDevice) { removeClass([(e.target as HTMLElement).parentElement], 'e-mob-span'); }
        let args: ResizeArgs = { requestType: 'Images' };
        this.parent.dotNetRef.invokeMethodAsync('ResizeStopEvent', args);
        this.parent.formatter.editorManager.observer.on(events.checkUndo, this.undoStack, this);
        this.parent.formatter.saveData();
    }
    private dragStart(e: DragEvent): void | boolean {
        if ((e.target as HTMLElement).nodeName === 'IMG') {
            // @ts-ignore-start
            this.parent.dotNetRef.invokeMethodAsync('ActionBeginEvent', e).then((actionBeginArgs: ActionBeginEventArgs) => {
                // @ts-ignore-end
                if (actionBeginArgs.cancel) {
                    e.preventDefault();
                } else {
                    e.dataTransfer.effectAllowed = 'copyMove';
                    (e.target as HTMLElement).classList.add(classes.CLS_RTE_DRAG_IMAGE);
                }
            });
        } else {
            return true;
        }
    };
    private dragOver(e?: DragEvent): void | boolean {
        if ((Browser.info.name === 'edge' && e.dataTransfer.items[0].type.split('/')[0].indexOf('image') > -1) ||
            (Browser.isIE && e.dataTransfer.types[0] === 'Files')) {
            e.preventDefault();
        } else {
            return true;
        }
    };
    private dragEnter(e?: DragEvent): void {
        e.dataTransfer.dropEffect = 'copy';
        e.preventDefault();
    };
    private dragDrop(e: ImageDragEvent): void | boolean {
        this.imageDragArgs = e;
        this.dropFiles = e.dataTransfer.files;
        let imgElement: HTMLElement = this.parent.inputElement.ownerDocument.querySelector('.' + classes.CLS_RTE_DRAG_IMAGE);
        if (imgElement && imgElement.tagName === 'IMG') {
            e.preventDefault();
            if (e.dataTransfer.files.length <= 0) {
                // @ts-ignore-start
                this.parent.dotNetRef.invokeMethodAsync('ActionBeginEvent', e).then((actionBeginArgs: ActionBeginEventArgs) => {
                    // @ts-ignore-end
                    if (!actionBeginArgs.cancel) {
                        if (closest((e.target as HTMLElement), '#' + this.rteId + '_toolbar') ||
                            this.parent.inputElement.contentEditable === 'false') { return; }
                        if (this.parent.element.querySelector('.' + classes.CLS_IMG_RESIZE)) {
                            detach(this.imgResizeDiv);
                        }
                        this.selectRange(e);
                        let uploadArea: HTMLElement = this.parent.element.querySelector('.' + classes.CLS_DROPAREA) as HTMLElement;
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
        this.removeEventListener();
    }
}