import { addClass, detach, EventHandler, L10n, isNullOrUndefined, KeyboardEventArgs, select, isBlazor, Ajax } from '@syncfusion/ej2-base';
import { Browser, closest, removeClass, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import {
    IImageCommandsArgs, IRenderer, IDropDownItemModel, IToolbarItemModel, OffsetPosition, ImageSuccessEventArgs,
    ImageDropEventArgs, ActionBeginEventArgs, ActionCompleteEventArgs, AfterImageDeleteEventArgs, ImageUploadingEventArgs
} from '../base/interface';
import { IRichTextEditor, IImageNotifyArgs, NotifyArgs, IShowPopupArgs, ResizeArgs } from '../base/interface';
import * as events from '../base/constant';
import * as classes from '../base/classes';
import { ServiceLocator } from '../services/service-locator';
import { NodeSelection } from '../../selection/selection';
import { Uploader, SelectedEventArgs, MetaData, NumericTextBox, FileInfo, BeforeUploadEventArgs } from '@syncfusion/ej2-inputs';
import { RemovingEventArgs, UploadingEventArgs } from '@syncfusion/ej2-inputs';
import { Dialog, DialogModel, Popup } from '@syncfusion/ej2-popups';
import { Button, CheckBox, ChangeEventArgs } from '@syncfusion/ej2-buttons';
import { RendererFactory } from '../services/renderer-factory';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { RenderType } from '../base/enum';
import { dispatchEvent, parseHtml, hasClass, convertToBlob } from '../base/util';
import { DialogRenderer } from './dialog-renderer';
import { isIDevice } from '../../common/util';
/**
 * `Image` module is used to handle image actions.
 */
export class Image {
    public element: HTMLElement;
    private rteID: string;
    private parent: IRichTextEditor;
    public dialogObj: Dialog;
    private popupObj: Popup;
    public uploadObj: Uploader;
    private i10n: L10n;
    private inputUrl: HTMLElement;
    private captionEle: HTMLElement;
    private checkBoxObj: CheckBox;
    private uploadUrl: IImageCommandsArgs;
    private contentModule: IRenderer;
    private rendererFactory: RendererFactory;
    private quickToolObj: IRenderer;
    private imgResizeDiv: HTMLElement;
    private imgDupPos: { [key: string]: number | string };
    private resizeBtnStat: { [key: string]: boolean };
    private imgEle: HTMLImageElement;
    private prevSelectedImgEle: HTMLImageElement;
    private isImgUploaded: boolean = false;
    private pageX: number = null;
    private pageY: number = null;
    private dialogRenderObj: DialogRenderer;
    private deletedImg: Node[] = [];
    private constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.rteID = parent.element.id;
        this.i10n = serviceLocator.getService<L10n>('rteLocale');
        this.rendererFactory = serviceLocator.getService<RendererFactory>('rendererFactory');
        this.dialogRenderObj = serviceLocator.getService<DialogRenderer>('dialogRenderObject');
        this.addEventListener();
    }

    protected addEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.keyDown, this.onKeyDown, this);
        this.parent.on(events.keyUp, this.onKeyUp, this);
        this.parent.on(events.insertImage, this.insertImage, this);
        this.parent.on(events.windowResize, this.onWindowResize, this);
        this.parent.on(events.insertCompleted, this.showImageQuickToolbar, this);
        this.parent.on(events.clearDialogObj, this.clearDialogObj, this);
        this.parent.on(events.imageToolbarAction, this.onToolbarAction, this);
        this.parent.on(events.imageCaption, this.caption, this);
        this.parent.on(events.imageDelete, this.deleteImg, this);
        this.parent.on(events.imageLink, this.insertImgLink, this);
        this.parent.on(events.imageAlt, this.insertAltText, this);
        this.parent.on(events.editAreaClick, this.editAreaClickHandler, this);
        this.parent.on(events.iframeMouseDown, this.onIframeMouseDown, this);
        this.parent.on(events.imageSize, this.imageSize, this);
        this.parent.on(events.dropDownSelect, this.alignmentSelect, this);
        this.parent.on(events.initialEnd, this.afterRender, this);
        this.parent.on(events.dynamicModule, this.afterRender, this);
        this.parent.on(events.paste, this.imagePaste, this);
        this.parent.on(events.destroy, this.removeEventListener, this);
    }

    protected removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.keyDown, this.onKeyDown);
        this.parent.off(events.keyUp, this.onKeyUp);
        this.parent.off(events.windowResize, this.onWindowResize);
        this.parent.off(events.insertImage, this.insertImage);
        this.parent.off(events.insertCompleted, this.showImageQuickToolbar);
        this.parent.off(events.clearDialogObj, this.clearDialogObj);
        this.parent.off(events.imageCaption, this.caption);
        this.parent.off(events.imageToolbarAction, this.onToolbarAction);
        this.parent.off(events.imageDelete, this.deleteImg);
        this.parent.off(events.imageLink, this.insertImgLink);
        this.parent.off(events.imageAlt, this.insertAltText);
        this.parent.off(events.editAreaClick, this.editAreaClickHandler);
        this.parent.off(events.iframeMouseDown, this.onIframeMouseDown);
        this.parent.off(events.imageSize, this.imageSize);
        this.parent.off(events.dropDownSelect, this.alignmentSelect);
        this.parent.off(events.initialEnd, this.afterRender);
        this.parent.off(events.dynamicModule, this.afterRender);
        this.parent.off(events.paste, this.imagePaste);
        this.parent.off(events.destroy, this.removeEventListener);
        const dropElement: HTMLElement | Document = this.parent.iframeSettings.enable ? this.parent.inputElement.ownerDocument
            : this.parent.inputElement;
        dropElement.removeEventListener('drop', this.dragDrop.bind(this), true);
        dropElement.removeEventListener('dragstart', this.dragStart.bind(this), true);
        dropElement.removeEventListener('dragenter', this.dragEnter.bind(this), true);
        dropElement.removeEventListener('dragover', this.dragOver.bind(this), true);
        if (!isNullOrUndefined(this.contentModule)) {
            EventHandler.remove(this.contentModule.getEditPanel(), Browser.touchEndEvent, this.imageClick);
            this.parent.formatter.editorManager.observer.off(events.checkUndo, this.undoStack);
            if (this.parent.insertImageSettings.resize) {
                EventHandler.remove(this.parent.contentModule.getEditPanel(), Browser.touchStartEvent, this.resizeStart);
                EventHandler.remove(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick);
                EventHandler.remove(this.contentModule.getEditPanel(), 'cut', this.onCutHandler);
            }
        }
    }
    private onIframeMouseDown(): void {
        if (this.dialogObj) {
            this.dialogObj.hide({ returnValue: true } as Event);
        }
    }
    private afterRender(): void {
        this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
        EventHandler.add(this.contentModule.getEditPanel(), Browser.touchEndEvent, this.imageClick, this);
        if (this.parent.insertImageSettings.resize) {
            EventHandler.add(this.parent.contentModule.getEditPanel(), Browser.touchStartEvent, this.resizeStart, this);
            EventHandler.add(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick, this);
            EventHandler.add(this.contentModule.getEditPanel(), 'cut', this.onCutHandler, this);
        }
        const dropElement: HTMLElement | Document = this.parent.iframeSettings.enable ? this.parent.inputElement.ownerDocument :
            this.parent.inputElement;
        dropElement.addEventListener('drop', this.dragDrop.bind(this), true);
        dropElement.addEventListener('dragstart', this.dragStart.bind(this), true);
        dropElement.addEventListener('dragenter', this.dragOver.bind(this), true);
        dropElement.addEventListener('dragover', this.dragOver.bind(this), true);
    }

    private undoStack(args?: { [key: string]: string }): void {
        if (args.subCommand.toLowerCase() === 'undo' || args.subCommand.toLowerCase() === 'redo') {
            for (let i: number = 0; i < this.parent.formatter.getUndoRedoStack().length; i++) {
                const temp: Element = this.parent.createElement('div');
                const contentElem: DocumentFragment = parseHtml(this.parent.formatter.getUndoRedoStack()[i].text);
                temp.appendChild(contentElem);
                const img: NodeListOf<HTMLElement> = temp.querySelectorAll('img');
                if (temp.querySelector('.e-img-resize') && img.length > 0) {
                    for (let j: number = 0; j < img.length; j++) {
                        img[j].style.outline = '';
                    }
                    detach(temp.querySelector('.e-img-resize'));
                    this.parent.formatter.getUndoRedoStack()[i].text = temp.innerHTML;
                }
            }
        }
    }

    private resizeEnd(e: PointerEvent | TouchEvent): void {
        this.resizeBtnInit();
        this.imgEle.parentElement.style.cursor = 'auto';
        if (Browser.isDevice) {
            removeClass([(e.target as HTMLElement).parentElement], 'e-mob-span');
        }
        const args: ResizeArgs = isBlazor() ? { requestType: 'images' } : { event: e, requestType: 'images' };
        this.parent.trigger(events.resizeStop, args);
        /* eslint-disable */
        let pageX: number = this.getPointX(e);
        let pageY: number = (this.parent.iframeSettings.enable) ? window.pageYOffset +
            this.parent.element.getBoundingClientRect().top + (e as PointerEvent).clientY : (e as PointerEvent).pageY;
        /* eslint-enable */
        this.parent.formatter.editorManager.observer.on(events.checkUndo, this.undoStack, this);
        this.parent.formatter.saveData();
    }

    private resizeStart(e: PointerEvent | TouchEvent, ele?: Element): void {
        if (this.parent.readonly) {
            return;
        }
        const target: HTMLElement = ele ? ele as HTMLElement : e.target as HTMLElement;
        this.prevSelectedImgEle = this.imgEle;
        if ((target as HTMLElement).tagName === 'IMG') {
            this.parent.preventDefaultResize(e as MouseEvent);
            const img: HTMLImageElement = target as HTMLImageElement;
            if (this.imgResizeDiv && this.contentModule.getEditPanel().contains(this.imgResizeDiv)) {
                detach(this.imgResizeDiv);
            }
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
            if (this.quickToolObj) {
                this.quickToolObj.imageQTBar.hidePopup();
            }
            if ((target as HTMLElement).classList.contains('e-rte-topLeft')) {
                this.resizeBtnStat.topLeft = true;
            }
            if ((target as HTMLElement).classList.contains('e-rte-topRight')) {
                this.resizeBtnStat.topRight = true;
            }
            if ((target as HTMLElement).classList.contains('e-rte-botLeft')) {
                this.resizeBtnStat.botLeft = true;
            }
            if ((target as HTMLElement).classList.contains('e-rte-botRight')) {
                this.resizeBtnStat.botRight = true;
            }
            if (Browser.isDevice && this.contentModule.getEditPanel().contains(this.imgResizeDiv) &&
                !this.imgResizeDiv.classList.contains('e-mob-span')) {
                addClass([this.imgResizeDiv], 'e-mob-span');
            } else {
                const args: ResizeArgs = isBlazor() ? { requestType: 'images' } : { event: e, requestType: 'images' };
                this.parent.trigger(events.resizeStart, args, (resizeStartArgs: ResizeArgs) => {
                    if (resizeStartArgs.cancel) {
                        this.cancelResizeAction();
                    }
                });
            }
            EventHandler.add(this.contentModule.getDocument(), Browser.touchEndEvent, this.resizeEnd, this);
        }
    }
    private imageClick(e: MouseEvent): void {
        if (Browser.isDevice) {
            if (((e.target as HTMLElement).tagName === 'IMG' &&
                (e.target as HTMLElement).parentElement.tagName === 'A') ||
                ((e.target as Element).tagName === 'IMG')) {
                this.contentModule.getEditPanel().setAttribute('contenteditable', 'false');
                (e.target as HTMLElement).focus();
            } else {
                if (!this.parent.readonly) {
                    this.contentModule.getEditPanel().setAttribute('contenteditable', 'true');
                }
            }
        }
        if ((e.target as HTMLElement).tagName === 'IMG' &&
            (e.target as HTMLElement).parentElement.tagName === 'A') {
            e.preventDefault();
        }
    }

    private onCutHandler(): void {
        if (this.imgResizeDiv && this.contentModule.getEditPanel().contains(this.imgResizeDiv)) {
            this.cancelResizeAction();
        }
    }

    private imageResize(e: HTMLImageElement): void {
        this.resizeBtnInit();
        this.imgEle = e;
        addClass([this.imgEle], 'e-resize');
        this.imgResizeDiv = this.parent.createElement('span', { className: 'e-img-resize', id: this.rteID + '_imgResize' });
        this.imgResizeDiv.appendChild(this.parent.createElement('span', {
            className: 'e-rte-imageboxmark e-rte-topLeft', styles: 'cursor: nwse-resize'
        }));
        this.imgResizeDiv.appendChild(this.parent.createElement('span', {
            className: 'e-rte-imageboxmark e-rte-topRight', styles: 'cursor: nesw-resize'
        }));
        this.imgResizeDiv.appendChild(this.parent.createElement('span', {
            className: 'e-rte-imageboxmark e-rte-botLeft', styles: 'cursor: nesw-resize'
        }));
        this.imgResizeDiv.appendChild(this.parent.createElement('span', {
            className: 'e-rte-imageboxmark e-rte-botRight', styles: 'cursor: nwse-resize'
        }));
        if (Browser.isDevice) {
            addClass([this.imgResizeDiv], 'e-mob-rte');
        }
        e.style.outline = '2px solid #4a90e2';
        this.imgResizePos(e, this.imgResizeDiv);
        this.resizeImgDupPos(e);
        this.contentModule.getEditPanel().appendChild(this.imgResizeDiv);
        EventHandler.add(this.contentModule.getDocument(), Browser.touchMoveEvent, this.resizing, this);
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

    private imgResizePos(e: HTMLImageElement, imgResizeDiv: HTMLElement): void {
        const pos: OffsetPosition = this.calcPos(e);
        const top: number = pos.top;
        const left: number = pos.left;
        const imgWid: number = e.width;
        const imgHgt: number = e.height;
        const borWid: number = (Browser.isDevice) ? (4 * parseInt((e.style.outline.slice(-3)), 10)) + 2 :
            (2 * parseInt((e.style.outline.slice(-3)), 10)) + 2; //span border width + image outline width
        const devWid: number = ((Browser.isDevice) ? 0 : 2); // span border width
        (imgResizeDiv.querySelector('.e-rte-botLeft') as HTMLElement).style.left = (left - borWid) + 'px';
        (imgResizeDiv.querySelector('.e-rte-botLeft') as HTMLElement).style.top = ((imgHgt - borWid) + top) + 'px';
        (imgResizeDiv.querySelector('.e-rte-botRight') as HTMLElement).style.left = ((imgWid - (borWid - devWid)) + left) + 'px';
        (imgResizeDiv.querySelector('.e-rte-botRight') as HTMLElement).style.top = ((imgHgt - borWid) + top) + 'px';
        (imgResizeDiv.querySelector('.e-rte-topRight') as HTMLElement).style.left = ((imgWid - (borWid - devWid)) + left) + 'px';
        (imgResizeDiv.querySelector('.e-rte-topRight') as HTMLElement).style.top = (top - (borWid)) + 'px';
        (imgResizeDiv.querySelector('.e-rte-topLeft') as HTMLElement).style.left = (left - borWid) + 'px';
        (imgResizeDiv.querySelector('.e-rte-topLeft') as HTMLElement).style.top = (top - borWid) + 'px';
    }

    private calcPos(elem: HTMLElement): OffsetPosition {
        const ignoreOffset: string[] = ['TD', 'TH', 'TABLE', 'A'];
        let parentOffset: OffsetPosition = { top: 0, left: 0 };
        const doc: Document = elem.ownerDocument;
        let offsetParent: Node = ((elem.offsetParent && (elem.offsetParent.classList.contains('e-img-caption') ||
                ignoreOffset.indexOf(elem.offsetParent.tagName) > -1)) ?
            closest(elem, '#' + this.parent.getID() + '_rte-edit-view') : elem.offsetParent) || doc.documentElement;
        while (offsetParent &&
                (offsetParent === doc.body || offsetParent === doc.documentElement) &&
                (<HTMLElement>offsetParent).style.position === 'static') {
            offsetParent = offsetParent.parentNode;
        }
        if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
            // eslint-disable-next-line
            parentOffset = (<HTMLElement>offsetParent).getBoundingClientRect();
        }
        return {
            top: elem.offsetTop,
            left: elem.offsetLeft
        };
    }
    private setAspectRatio(img: HTMLImageElement, expectedX: number, expectedY: number): void {
        if (isNullOrUndefined(img.width)) {
            return;
        }
        const width: number = img.style.width !== '' ? img.style.width.match(/^\d+(\.\d*)?%$/g) ? parseFloat(img.style.width) :
        parseInt(img.style.width, 10) : img.width;
        const height: number = img.style.height !== '' ? parseInt(img.style.height, 10) : img.height;
        if (width > height) {
            img.style.minWidth = '20px';
            if (this.parent.insertImageSettings.resizeByPercent) {
                if (parseInt('' + img.getBoundingClientRect().width + '') !== 0 && parseInt('' + width + '') !== 0) {
                    const percentageValue = this.pixToPerc((width / height * expectedY), (img.previousElementSibling || img.parentElement));
                    img.style.width = Math.min(Math.round((percentageValue / img.getBoundingClientRect().width) * expectedX * 100) / 100, 100) + '%';
                } else {
                    img.style.width = this.pixToPerc((width / height * expectedY), (img.previousElementSibling || img.parentElement)) + '%';
                }
                img.style.height = null;
                img.removeAttribute('height');
            } else if (img.style.width !== '') {
                img.style.width = (width / height * expectedY) + 'px';
                img.style.height = expectedY + 'px';
            } else {
                img.setAttribute('width', ((width / height * expectedY) + width / height).toString());
            }
        } else if (height > width) {
            if (this.parent.insertImageSettings.resizeByPercent) {
                if (parseInt('' + img.getBoundingClientRect().width + '') !== 0 && parseInt('' + width + '') !== 0) {
                    img.style.width = Math.min(Math.round((width / img.getBoundingClientRect().width) * expectedX * 100) / 100, 100) + '%';
                } else {
                    img.style.width = this.pixToPerc((expectedX / height * expectedY), (img.previousElementSibling || img.parentElement)) + '%';
                }
                img.style.height = null;
                img.removeAttribute('height');
            } else if (img.style.width !== '') {
                img.style.width = expectedX + 'px';
                img.style.height = (height / width * expectedX) + 'px';
            } else {
                img.setAttribute('width', expectedX.toString());
            }
        } else {
            if (this.parent.insertImageSettings.resizeByPercent) {
                img.style.width = this.pixToPerc(expectedX, (img.previousElementSibling || img.parentElement)) + '%';
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
    private pixToPerc(expected: number, parentEle: Element): number {
        return expected / parseFloat(getComputedStyle(parentEle).width) * 100;
    }
    private imgDupMouseMove(width: string, height: string, e: PointerEvent | TouchEvent): void {
        const args: ResizeArgs = isBlazor() ? { requestType: 'images' } : { event: e, requestType: 'images' };
        this.parent.trigger(events.onResize, args, (resizingArgs: ResizeArgs) => {
            if (resizingArgs.cancel) {
                this.cancelResizeAction();
            } else {
                if ((parseInt(this.parent.insertImageSettings.minWidth as string, 10) >= parseInt(width, 10) ||
                    (parseInt(this.parent.getInsertImgMaxWidth() as string, 10) <= parseInt(width, 10) &&
                    isNOU(this.imgEle.style.width)))) {
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
        });
    }
    private resizing(e: PointerEvent | TouchEvent): void {
        if (this.imgEle.offsetWidth >= this.parent.getInsertImgMaxWidth()) {
            this.imgEle.style.maxHeight = this.imgEle.offsetHeight + 'px';
        }
        const pageX: number = this.getPointX(e);
        const pageY: number = this.getPointY(e);
        const mouseX: number = (this.resizeBtnStat.botLeft || this.resizeBtnStat.topLeft) ? -(pageX - this.pageX) : (pageX - this.pageX);
        const mouseY: number = (this.resizeBtnStat.topLeft || this.resizeBtnStat.topRight) ? -(pageY - this.pageY) : (pageY - this.pageY);
        const width: number = parseInt(this.imgDupPos.width as string, 10) + mouseX;
        const height: number = parseInt(this.imgDupPos.height as string, 10) + mouseY;
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

    private cancelResizeAction(): void {
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchEndEvent, this.resizeEnd);
        if (this.imgEle && this.imgResizeDiv && this.contentModule.getEditPanel().contains(this.imgResizeDiv)) {
            detach(this.imgResizeDiv);
            (this.imgEle as HTMLElement).style.outline = '';
            this.imgResizeDiv = null;
            this.pageX = null;
            this.pageY = null;
        }
    }
    private resizeImgDupPos(e: HTMLImageElement): void {
        this.imgDupPos = {
            width: (e.style.height !== '') ? this.imgEle.style.width : e.width + 'px',
            height: (e.style.height !== '') ? this.imgEle.style.height : e.height + 'px'
        };
    }

    private resizeBtnInit(): { [key: string]: boolean } {
        return this.resizeBtnStat = { botLeft: false, botRight: false, topRight: false, topLeft: false };
    }
    private onToolbarAction(args: NotifyArgs): void {
        if (isIDevice()) {
            this.parent.notify(events.selectionRestore, {});
        }
        const item: IToolbarItemModel = (args.args as ClickEventArgs).item as IToolbarItemModel;
        switch (item.subCommand) {
        case 'Replace':
            if (this.parent.fileManagerSettings.enable) {
                this.parent.notify(events.renderFileManager, args);
            } else { this.parent.notify(events.insertImage, args); }
            break;
        case 'Caption':
            this.parent.notify(events.imageCaption, args);
            break;
        case 'InsertLink':
            this.parent.notify(events.imageLink, args);
            break;
        case 'AltText':
            this.parent.notify(events.imageAlt, args);
            break;
        case 'Remove':
            this.parent.notify(events.imageDelete, args);
            break;
        case 'Dimension':
            this.parent.notify(events.imageSize, args);
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
        const target: string = (e.selectParent[0].parentNode as HTMLAnchorElement).target === '' ? '_self' : '_blank';
        this.parent.formatter.process(
            this.parent, e.args, e.args,
            {
                url: (e.selectParent[0].parentNode as HTMLAnchorElement).href, target: target, selectNode: e.selectNode,
                subCommand: ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand
            });
    }

    private editImgLink(e: NotifyArgs): void {
        const selectParentEle: HTMLElement = e.selectParent[0].parentNode as HTMLElement;
        const linkUpdate: string = this.i10n.getConstant('dialogUpdate');
        const inputDetails: { [key: string]: string } = {
            url: (selectParentEle as HTMLAnchorElement).href, target: (selectParentEle as HTMLAnchorElement).target,
            header: 'Edit Link', btnText: linkUpdate
        };
        this.insertImgLink(e, inputDetails);
    }
    private removeImgLink(e: NotifyArgs): void {
        if (Browser.isIE) {
            (this.contentModule.getEditPanel() as HTMLElement).focus();
        }
        e.selection.restore();
        const isCapLink: boolean = (this.contentModule.getEditPanel().contains(this.captionEle) && select('a', this.captionEle)) ?
            true : false;
        const selectParent: Node[] = isCapLink ? [this.captionEle] : [e.selectNode[0].parentElement];
        this.parent.formatter.process(
            this.parent, e.args, e.args,
            {
                insertElement: e.selectNode[0] as HTMLElement, selectParent: selectParent, selection: e.selection,
                subCommand: ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand
            });
        if (this.quickToolObj && document.body.contains(this.quickToolObj.imageQTBar.element)) {
            this.quickToolObj.imageQTBar.hidePopup();
            if (!isNullOrUndefined(e.selectParent as Node[])) {
                removeClass([e.selectParent[0] as HTMLElement], 'e-img-focus');
            }
        }
        if (isCapLink) {
            (select('.e-img-inner', this.captionEle) as HTMLElement).focus();
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
            range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            isCursor = range.startContainer === range.endContainer && range.startOffset === range.endOffset;
        }
        if (!isCursor && this.parent.editorMode === 'HTML' && keyCodeValues.indexOf(originalEvent.which) < 0) {
            const nodes: Node[] = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
            for (let i: number = 0; i < nodes.length; i++) {
                if (nodes[i].nodeName === 'IMG') {
                    this.deletedImg.push(nodes[i]);
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
        if (!isNullOrUndefined(this.parent.formatter.editorManager.nodeSelection) &&
            originalEvent.code !== 'KeyK') {
            range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            save = this.parent.formatter.editorManager.nodeSelection.save(range, this.parent.contentModule.getDocument());
            selectNodeEle = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
            selectParentEle = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            if (!originalEvent.ctrlKey && originalEvent.key && (originalEvent.key.length === 1 || originalEvent.action === 'enter') &&
                ((selectParentEle[0] as HTMLElement).tagName === 'IMG') && (selectParentEle[0] as HTMLElement).parentElement) {
                const prev: Node = ((selectParentEle[0] as HTMLElement).parentElement as HTMLElement).childNodes[0];
                if (this.contentModule.getEditPanel().querySelector('.e-img-resize')) {
                    this.removeResizeEle();
                }
                this.parent.formatter.editorManager.nodeSelection.setSelectionText(
                    this.contentModule.getDocument(), prev, prev, prev.textContent.length, prev.textContent.length);
                removeClass([selectParentEle[0] as HTMLElement], 'e-img-focus');
                this.quickToolObj.imageQTBar.hidePopup();
            }
        }
        if (originalEvent.ctrlKey && (originalEvent.keyCode === 89 || originalEvent.keyCode === 90)) {
            this.undoStack({ subCommand: (originalEvent.keyCode === 90 ? 'undo' : 'redo') });
        }
        if (originalEvent.keyCode === 8 || originalEvent.keyCode === 46) {
            if (selectNodeEle && selectNodeEle[0].nodeName === 'IMG' && selectNodeEle.length < 1) {
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
            if (this.parent.contentModule.getEditPanel().querySelector('.e-img-resize')) {
                this.removeResizeEle();
            }
        }
        if (originalEvent.code === 'Backspace') {
            originalEvent.action = 'backspace';
        }
        switch (originalEvent.action) {
        case 'escape':
            if (!isNullOrUndefined(this.dialogObj)) {
                this.dialogObj.close();
            }
            break;
        case 'backspace':
        case 'delete':
            for (let i: number = 0; i < this.deletedImg.length; i++) {
                const src: string = (this.deletedImg[i] as HTMLImageElement).src;
                this.imageRemovePost(src as string);
            }
            break;
        case 'insert-image':
            if (this.parent.editorMode === 'HTML') {
                this.insertImage({
                    args: {
                        item: { command: 'Images', subCommand: 'Image' } as IToolbarItemModel,
                        originalEvent: originalEvent
                    },
                    selectNode: selectNodeEle,
                    selection: save,
                    selectParent: selectParentEle
                });
            } else {
                this.insertImage({
                    args: {
                        item: { command: 'Images', subCommand: 'Image' } as IToolbarItemModel,
                        originalEvent: originalEvent
                    },
                    member: 'image',
                    text: this.parent.formatter.editorManager.markdownSelection.getSelectedText(
                        this.parent.contentModule.getEditPanel() as HTMLTextAreaElement),
                    module: 'Markdown',
                    name: 'insertImage'
                });
            }
            originalEvent.preventDefault();
            break;
        }
    }
    // eslint-disable-next-line
    private onKeyUp(event: NotifyArgs): void {
        if (!isNOU(this.deletedImg) && this.deletedImg.length > 0) {
            for (let i: number = 0; i < this.deletedImg.length; i++) {
                const args: AfterImageDeleteEventArgs = {
                    element: this.deletedImg[i],
                    src: (this.deletedImg[i] as HTMLElement).getAttribute('src')
                };
                this.parent.trigger(events.afterImageDelete, args);
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
    private alignmentSelect(e: ClickEventArgs): void {
        const item: IDropDownItemModel = e.item as IDropDownItemModel;
        if (!document.body.contains(document.body.querySelector('.e-rte-quick-toolbar')) || item.command !== 'Images') {
            return;
        }
        const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
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
        if (this.quickToolObj && document.body.contains(this.quickToolObj.imageQTBar.element)) {
            this.quickToolObj.imageQTBar.hidePopup();
            removeClass([selectNodeEle[0] as HTMLElement], 'e-img-focus');
        }
        this.cancelResizeAction();
    }

    private imageWithLinkQTBarItemUpdate(): void {
        let separator: HTMLElement;
        const items: NodeListOf<Element> = this.quickToolObj.imageQTBar.toolbarElement.querySelectorAll('.e-toolbar-item');
        for (let i: number = 0; i < items.length; i++) {
            if (items[i].getAttribute('title') === this.i10n.getConstant('openLink') ||
                items[i].getAttribute('title') === this.i10n.getConstant('editLink') ||
                items[i].getAttribute('title') === this.i10n.getConstant('removeLink')) {
                addClass([items[i]], 'e-link-groups');
                (items[i] as HTMLElement).style.display = 'none';
            } else if (items[i].getAttribute('title') === 'Insert Link') {
                (items[i] as HTMLElement).style.display = '';
            } else if (items[i].classList.contains('e-rte-horizontal-separator')) {
                // eslint-disable-next-line
                separator = items[i] as HTMLElement;
                detach(items[i]);
            }
        }
        const newItems: NodeListOf<Element> = this.quickToolObj.imageQTBar.toolbarElement.querySelectorAll(
            '.e-toolbar-item:not(.e-link-groups)');
        this.quickToolObj.imageQTBar.addQTBarItem(['-'], Math.round(newItems.length / 2));
    }

    private showImageQuickToolbar(e: IShowPopupArgs): void {
        if (e.type !== 'Images' || isNullOrUndefined(this.parent.quickToolbarModule)
            || isNullOrUndefined(this.parent.quickToolbarModule.imageQTBar)) {
            return;
        }
        this.quickToolObj = this.parent.quickToolbarModule;
        const args: MouseEvent = e.args as MouseEvent;
        let target: HTMLElement = e.elements as HTMLElement;
        [].forEach.call(e.elements, (element: Element, index: number) => {
            if (index === 0) {
                target = <HTMLElement>element;
            }
        });
        if (target && !closest(target, 'a')) {
            this.imageWithLinkQTBarItemUpdate();
        }
        if (target.nodeName === 'IMG') {
            addClass([target], ['e-img-focus']);
        }
        const pageY: number = (this.parent.iframeSettings.enable) ? window.pageYOffset +
                this.parent.element.getBoundingClientRect().top + args.clientY : args.pageY;
        if (this.parent.quickToolbarModule.imageQTBar) {
            if (e.isNotify) {
                setTimeout(() => {
                    this.quickToolObj.imageQTBar.showPopup(args.pageX, pageY, target as Element);
                }, 400);
            } else {
                this.quickToolObj.imageQTBar.showPopup(args.pageX, pageY, target as Element);
            }
        }
    }

    private hideImageQuickToolbar(): void {
        if (!isNullOrUndefined(this.contentModule.getEditPanel().querySelector('.e-img-focus'))) {
            removeClass([this.contentModule.getEditPanel().querySelector('.e-img-focus')], 'e-img-focus');
            if (this.quickToolObj && this.quickToolObj.imageQTBar && document.body.contains(this.quickToolObj.imageQTBar.element)) {
                this.quickToolObj.imageQTBar.hidePopup();
            }
        }
    }

    private editAreaClickHandler(e: IImageNotifyArgs): void {
        if (this.parent.readonly) {
            this.hideImageQuickToolbar();
            return;
        }
        const args: MouseEvent = e.args as MouseEvent;
        const showOnRightClick: boolean = this.parent.quickToolbarSettings.showOnRightClick;
        if (args.which === 2 || (showOnRightClick && args.which === 1) || (!showOnRightClick && args.which === 3)) {
            if ((showOnRightClick && args.which === 1) && !isNullOrUndefined((args.target as HTMLElement)) &&
                (args.target as HTMLElement).tagName === 'IMG') {
                this.parent.formatter.editorManager.nodeSelection.Clear(this.contentModule.getDocument());
                this.parent.formatter.editorManager.nodeSelection.setSelectionContents(
                    this.contentModule.getDocument(), args.target as Node);
            }
            return;
        }
        if (this.parent.editorMode === 'HTML' && this.parent.quickToolbarModule && this.parent.quickToolbarModule.imageQTBar) {
            this.quickToolObj = this.parent.quickToolbarModule;
            const target: HTMLElement = args.target as HTMLElement;
            this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
            const isPopupOpen: boolean = this.quickToolObj.imageQTBar.element.classList.contains('e-rte-pop');
            if (target.nodeName === 'IMG' && this.parent.quickToolbarModule) {
                if (isPopupOpen) {
                    return;
                }
                this.parent.formatter.editorManager.nodeSelection.Clear(this.contentModule.getDocument());
                this.parent.formatter.editorManager.nodeSelection.setSelectionContents(this.contentModule.getDocument(), target);
                if (isIDevice()) {
                    this.parent.notify(events.selectionSave, e);
                }
                addClass([target], 'e-img-focus');
                const items: NodeListOf<Element> = this.quickToolObj.imageQTBar.toolbarElement.querySelectorAll('.e-toolbar-item');
                let separator: HTMLElement;
                if (closest(target, 'a')) {
                    for (let i: number = 0; i < items.length; i++) {
                        if (items[i].getAttribute('title') === this.i10n.getConstant('openLink') ||
                            items[i].getAttribute('title') === this.i10n.getConstant('editLink') ||
                            items[i].getAttribute('title') === this.i10n.getConstant('removeLink')) {
                            (items[i] as HTMLElement).style.display = '';
                            removeClass([items[i]], 'e-link-groups');
                        } else if (items[i].getAttribute('title') === 'Insert Link') {
                            (items[i] as HTMLElement).style.display = 'none';
                        } else if (items[i].classList.contains('e-rte-horizontal-separator')) {
                            // eslint-disable-next-line
                            separator = items[i] as HTMLElement;
                            detach(items[i]);
                        }
                    }
                    const newItems: NodeListOf<Element> = this.quickToolObj.imageQTBar.toolbarElement.querySelectorAll(
                        '.e-toolbar-item:not(.e-link-groups)');
                    this.quickToolObj.imageQTBar.addQTBarItem(['-'], Math.round(newItems.length / 2));
                } else if (!closest(target, 'a')) {
                    this.imageWithLinkQTBarItemUpdate();
                }
                this.showImageQuickToolbar({ args: args, type: 'Images', elements: [args.target as Element] } as IShowPopupArgs);
            } else {
                this.hideImageQuickToolbar();
            }
        }
    }

    private insertImgLink(e: IImageNotifyArgs, inputDetails?: { [key: string]: string }): void {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        this.imagDialog(e);
        if (!isNullOrUndefined(this.dialogObj)) {
            const linkWrap: HTMLElement = this.parent.createElement('div', { className: 'e-img-linkwrap' });
            const linkUrl: string = this.i10n.getConstant('linkurl');
            const content: string = '<div class="e-rte-field">' +
                '<input type="text" data-role ="none" class="e-input e-img-link" spellcheck="false" placeholder="' + linkUrl + '"/></div>' +
                '<div class="e-rte-label"></div>' + '<div class="e-rte-field">' +
                '<input type="checkbox" class="e-rte-linkTarget"  data-role ="none"></div>';
            const contentElem: DocumentFragment = parseHtml(content);
            linkWrap.appendChild(contentElem);
            const linkTarget: HTMLInputElement = linkWrap.querySelector('.e-rte-linkTarget') as HTMLInputElement;
            const inputLink: HTMLElement = linkWrap.querySelector('.e-img-link') as HTMLElement;
            const linkOpenLabel: string = this.i10n.getConstant('linkOpenInNewWindow');
            this.checkBoxObj = new CheckBox({
                label: linkOpenLabel, checked: true, enableRtl: this.parent.enableRtl, change: (e: ChangeEventArgs) => {
                    if (e.checked) {
                        target = '_blank';
                    } else {
                        target = null;
                    }
                }
            });
            this.checkBoxObj.isStringTemplate = true;
            this.checkBoxObj.createElement = this.parent.createElement;
            this.checkBoxObj.appendTo(linkTarget);
            let target: string = this.checkBoxObj.checked ? '_blank' : null;
            const linkUpdate: string = this.i10n.getConstant('dialogUpdate');
            const linkargs: IImageNotifyArgs = {
                args: e.args,
                selfImage: this, selection: e.selection,
                selectNode: e.selectNode, selectParent: e.selectParent, link: inputLink, target: target
            };
            this.dialogObj.setProperties({
                height: 'inherit',
                width: '290px',
                header: this.parent.localeObj.getConstant('imageInsertLinkHeader'),
                content: linkWrap,
                position: { X: 'center', Y: 'center' },
                buttons: [{
                    // eslint-disable-next-line
                    click: (e: MouseEvent) => {
                        this.insertlink(linkargs);
                    },
                    buttonModel: {
                        content: linkUpdate, cssClass: 'e-flat e-update-link', isPrimary: true
                    }
                }]
            });
            if (!isNullOrUndefined(inputDetails)) {
                (inputLink as HTMLInputElement).value = inputDetails.url;
                // eslint-disable-next-line
                (inputDetails.target) ? this.checkBoxObj.checked = true : this.checkBoxObj.checked = false;
                this.dialogObj.header = inputDetails.header;
            }
            this.dialogObj.element.style.maxHeight = 'inherit';
            (this.dialogObj.content as HTMLElement).querySelector('input').focus();
        }
    }

    private insertAltText(e: IImageNotifyArgs): void {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        this.imagDialog(e);
        const altText: string = this.i10n.getConstant('altText');
        if (!isNullOrUndefined(this.dialogObj)) {
            const altWrap: HTMLElement = this.parent.createElement('div', { className: 'e-img-altwrap' });
            const altHeader: string = this.i10n.getConstant('alternateHeader');
            const linkUpdate: string = this.i10n.getConstant('dialogUpdate');
            const getAlt: string = ((e.selectNode[0] as HTMLElement).getAttribute('alt') === null) ? '' :
                (e.selectNode[0] as HTMLElement).getAttribute('alt');
            const content: string = '<div class="e-rte-field">' +
                '<input type="text" spellcheck="false" value="' + getAlt + '" class="e-input e-img-alt" placeholder="' + altText + '"/>' +
                '</div>';
            const contentElem: DocumentFragment = parseHtml(content);
            altWrap.appendChild(contentElem);
            const inputAlt: HTMLElement = altWrap.querySelector('.e-img-alt') as HTMLElement;
            const altArgs: IImageNotifyArgs = {
                args: e.args, selfImage: this, selection: e.selection, selectNode: e.selectNode,
                alt: inputAlt
            };
            this.dialogObj.setProperties({
                height: 'inherit', width: '290px', header: altHeader, content: altWrap, position: { X: 'center', Y: 'center' },
                buttons: [{
                    // eslint-disable-next-line
                    click: (e: MouseEvent) => {
                        this.insertAlt(altArgs);
                    },
                    buttonModel: {
                        content: linkUpdate, cssClass: 'e-flat e-update-alt', isPrimary: true
                    }
                }]
            });
            this.dialogObj.element.style.maxHeight = 'inherit';
            (this.dialogObj.content as HTMLElement).querySelector('input').focus();
        }
    }

    private insertAlt(e: IImageNotifyArgs): void {
        if (!isNullOrUndefined(e.alt)) {
            e.selection.restore();
            if (this.parent.formatter.getUndoRedoStack().length === 0) {
                this.parent.formatter.saveData();
            }
            const altText: string = (e.alt as HTMLInputElement).value;
            this.parent.formatter.process(
                this.parent, e.args, e.args,
                {
                    altText: altText, selectNode: e.selectNode,
                    subCommand: ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand
                });
            this.dialogObj.hide({ returnValue: false } as Event);
        }
    }

    private insertlink(e: IImageNotifyArgs): void {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        let url: string = (e.link as HTMLInputElement).value;
        if (url === '') {
            addClass([e.link], 'e-error');
            (e.link as HTMLInputElement).setSelectionRange(0, url.length);
            (e.link as HTMLInputElement).focus();
            return;
        }
        if (!this.isUrl(url)) {
            url = 'http://' + url;
        } else {
            removeClass([e.link], 'e-error');
        }
        const proxy: Image = e.selfImage;
        if (proxy.parent.editorMode === 'HTML') {
            e.selection.restore();
        }
        if (proxy.parent.formatter.getUndoRedoStack().length === 0) {
            proxy.parent.formatter.saveData();
        }
        if (e.selectNode[0].parentElement.nodeName === 'A') {
            proxy.parent.formatter.process(
                proxy.parent, e.args, e.args,
                {
                    url: url, target: proxy.checkBoxObj.checked ? '_blank' : null, selectNode: e.selectNode,
                    subCommand: ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand
                });
            proxy.dialogObj.hide({ returnValue: true } as Event);
            return;
        }
        proxy.parent.formatter.process(
            proxy.parent, e.args, e.args,
            {
                url: url, target: proxy.checkBoxObj.checked ? '_blank' : null, selectNode: e.selectNode,
                subCommand: ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand, selection: e.selection
            });
        const captionEle: Element = closest(e.selectNode[0], '.e-img-caption');
        if (captionEle) {
            (select('.e-img-inner', captionEle) as HTMLElement).focus();
        }
        if (captionEle) { (select('.e-img-inner', captionEle) as HTMLElement).focus(); }
        proxy.dialogObj.hide({ returnValue: false } as Event);
    }
    private isUrl(url: string): boolean {
        // eslint-disable-next-line
        const regexp: RegExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi;
        return regexp.test(url);
    }
    private deleteImg(e: IImageNotifyArgs, keyCode?: number): void {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        const args: AfterImageDeleteEventArgs = {
            element: e.selectNode[0],
            src: (e.selectNode[0] as HTMLElement).getAttribute('src')
        };
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        e.selection.restore();
        if (this.contentModule.getEditPanel().querySelector('.e-img-resize')) {
            this.removeResizeEle();
        }
        this.parent.formatter.process(
            this.parent, e.args, e.args,
            {
                selectNode: e.selectNode,
                captionClass: classes.CLS_CAPTION,
                subCommand: ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand
            });
        this.imageRemovePost(args.src as string);
        if (this.quickToolObj && document.body.contains(this.quickToolObj.imageQTBar.element)) {
            this.quickToolObj.imageQTBar.hidePopup();
        }
        this.cancelResizeAction();
        if (isNullOrUndefined(keyCode)) {
            this.parent.trigger(events.afterImageDelete, args);
        }
    }
    private imageRemovePost(src: string): void {
        const removeUrl: string = this.parent.insertImageSettings.removeUrl;
        if (isNOU(removeUrl) || removeUrl === '') { return; }
        const ajax: Ajax = new Ajax(removeUrl, 'POST', true, null);
        const formData: FormData = new FormData();
        formData.append(name, src as string);
        ajax.send(formData);
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
        if (!isNullOrUndefined(closest(selectNode, '.' + classes.CLS_CAPTION))) {
            detach(closest(selectNode, '.' + classes.CLS_CAPTION));
            if (Browser.isIE) {
                (this.contentModule.getEditPanel() as HTMLElement).focus();
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
            this.captionEle = this.parent.createElement('span', {
                className: classes.CLS_CAPTION + ' ' + classes.CLS_RTE_CAPTION,
                attrs: { contenteditable: 'false', draggable: 'false', style: 'width:' + this.parent.insertImageSettings.width }
            });
            const imgWrap: HTMLElement = this.parent.createElement('span', { className: 'e-img-wrap' });
            const imgInner: HTMLElement = this.parent.createElement('span', { className: 'e-img-inner',
                attrs: { contenteditable: 'true' } });
            const parent: HTMLElement = e.selectNode[0].parentElement;
            if (parent.tagName === 'A') {
                parent.setAttribute('contenteditable', 'true');
            }
            imgWrap.appendChild(parent.tagName === 'A' ? parent : e.selectNode[0]);
            imgWrap.appendChild(imgInner);
            const imgCaption: string = this.i10n.getConstant('imageCaption');
            imgInner.innerHTML = imgCaption;
            this.captionEle.appendChild(imgWrap);
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
                this.contentModule.getDocument(),
                imgInner.childNodes[0], imgInner.childNodes[0], 0, imgInner.childNodes[0].textContent.length);
        }
        if (this.quickToolObj && document.body.contains(this.quickToolObj.imageQTBar.element)) {
            this.quickToolObj.imageQTBar.hidePopup();
            removeClass([selectNode as HTMLElement], 'e-img-focus');
        }
    }
    private imageSize(e: IImageNotifyArgs): void {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        this.imagDialog(e);
        if (!isNullOrUndefined(this.dialogObj)) {
            const imgSizeHeader: string = this.i10n.getConstant('imageSizeHeader');
            const linkUpdate: string = this.i10n.getConstant('dialogUpdate');
            const dialogContent: HTMLElement = this.imgsizeInput(e);
            const selectObj: IImageNotifyArgs = { args: e.args, selfImage: this, selection: e.selection, selectNode: e.selectNode };
            this.dialogObj.setProperties({
                height: 'inherit', width: '290px', header: imgSizeHeader, content: dialogContent, position: { X: 'center', Y: 'center' },
                buttons: [{
                    // eslint-disable-next-line
                    click: (e: MouseEvent) => {
                        this.insertSize(selectObj);
                    },
                    buttonModel: {
                        content: linkUpdate, cssClass: 'e-flat e-update-size', isPrimary: true
                    }
                }]
            });
            this.dialogObj.element.style.maxHeight = 'inherit';
            (this.dialogObj.content as HTMLElement).querySelector('input').focus();
        }
    }
    private break(e: IImageNotifyArgs): void {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        const subCommand: string = ((e.args as ClickEventArgs).item) ?
            ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand : 'Break';
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
    private alignImage(e: IImageNotifyArgs, type: string): void {
        const subCommand: string = ((e.args as ClickEventArgs).item) ?
            ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand : type;
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    }
    private clearDialogObj(): void {
        if (this.dialogObj) {
            this.dialogObj.destroy();
            detach(this.dialogObj.element);
            this.dialogObj = null;
        }
    }
    private imagDialog(e: IImageNotifyArgs): void {
        if (this.dialogObj) {
            this.dialogObj.hide({ returnValue: true } as Event);
            return;
        }
        const imgDialog: HTMLElement = this.parent.createElement('div', { className: 'e-rte-img-dialog', id: this.rteID + '_image' });
        this.parent.element.appendChild(imgDialog);
        const imgInsert: string = this.i10n.getConstant('dialogInsert');
        const imglinkCancel: string = this.i10n.getConstant('dialogCancel');
        const imgHeader: string = this.i10n.getConstant('imageHeader');
        const selection: NodeSelection = e.selection;
        const selectObj: IImageNotifyArgs = { selfImage: this, selection: e.selection, args: e.args, selectParent: e.selectParent };
        const dialogModel: DialogModel = {
            header: imgHeader,
            cssClass: classes.CLS_RTE_ELEMENTS,
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            showCloseIcon: true, closeOnEscape: true, width: (Browser.isDevice) ? '290px' : '340px', height: 'inherit',
            position: { X: 'center', Y: (Browser.isDevice) ? 'center' : 'top' },
            isModal: (Browser.isDevice as boolean),
            buttons: [{
                click: this.insertImageUrl.bind(selectObj),
                buttonModel: { content: imgInsert, cssClass: 'e-flat e-insertImage', isPrimary: true }
            },
            {
                click: (e: MouseEvent) => {
                    this.cancelDialog(e);
                },
                buttonModel: { cssClass: 'e-flat e-cancel', content: imglinkCancel }
            }],
            target: (Browser.isDevice) ? document.body : this.parent.element,
            animationSettings: { effect: 'None' },
            close: (event: { [key: string]: object }) => {
                if (this.isImgUploaded) {
                    this.uploadObj.removing();
                }
                this.parent.isBlur = false;
                if (event && (event.event as { [key: string]: string }).returnValue) {
                    if (this.parent.editorMode === 'HTML') {
                        selection.restore();
                    } else {
                        this.parent.formatter.editorManager.markdownSelection.restore(
                            this.parent.contentModule.getEditPanel() as HTMLTextAreaElement);
                    }
                }
                this.dialogObj.destroy();
                detach(this.dialogObj.element);
                this.dialogRenderObj.close(event);
                this.dialogObj = null;
            }
        };
        const dialogContent: HTMLElement = this.parent.createElement('div', { className: 'e-img-content' });
        if ((!isNullOrUndefined(this.parent.insertImageSettings.path) && this.parent.editorMode === 'Markdown')
            || this.parent.editorMode === 'HTML') {
            dialogContent.appendChild(this.imgUpload(e));
        }
        const linkHeader: HTMLElement = this.parent.createElement('div', { className: 'e-linkheader' });
        const linkHeaderText: string = this.i10n.getConstant('imageLinkHeader');
        if (this.parent.editorMode === 'HTML') {
            linkHeader.innerHTML = linkHeaderText;
        } else {
            linkHeader.innerHTML = this.i10n.getConstant('mdimageLink');
        }
        dialogContent.appendChild(linkHeader);
        dialogContent.appendChild(this.imageUrlPopup(e));
        if (e.selectNode && e.selectNode[0].nodeName === 'IMG') {
            dialogModel.header = this.parent.localeObj.getConstant('editImageHeader');
            dialogModel.content = dialogContent;
        } else {
            dialogModel.content = dialogContent;
        }
        this.dialogObj = this.dialogRenderObj.render(dialogModel);
        this.dialogObj.createElement = this.parent.createElement;
        this.dialogObj.appendTo(imgDialog);
        if (isNullOrUndefined(this.dialogObj)) { return; }
        if (e.selectNode && e.selectNode[0].nodeName === 'IMG' && (e.name === 'insertImage')) {
            this.dialogObj.element.querySelector('.e-insertImage').textContent = this.parent.localeObj.getConstant('dialogUpdate');
        }
        imgDialog.style.maxHeight = 'inherit';
        if (this.quickToolObj) {
            if (this.quickToolObj.imageQTBar && document.body.contains(this.quickToolObj.imageQTBar.element)) {
                this.quickToolObj.imageQTBar.hidePopup();
                if (!isNullOrUndefined(e.selectParent as Node[])) {
                    removeClass([e.selectParent[0] as HTMLElement], 'e-img-focus');
                }
            }
            if (this.quickToolObj.inlineQTBar && document.body.contains(this.quickToolObj.inlineQTBar.element)) {
                this.quickToolObj.inlineQTBar.hidePopup();
            }
        }
    }

    // eslint-disable-next-line
    private cancelDialog(e: MouseEvent): void {
        this.parent.isBlur = false;
        this.dialogObj.hide({ returnValue: true } as Event);
        if (this.isImgUploaded) {
            this.uploadObj.removing();
        }
    }

    private onDocumentClick(e: MouseEvent): void {
        const target: HTMLElement = <HTMLElement>e.target;
        if (target.nodeName === 'IMG') {
            this.imgEle = target as HTMLImageElement;
        }
        if (!isNullOrUndefined(this.dialogObj) && ((
            // eslint-disable-next-line
            !closest(target, '[id=' + "'" + this.dialogObj.element.id + "'" + ']') && this.parent.toolbarSettings.enable && this.parent.getToolbarElement() &&
            !this.parent.getToolbarElement().contains(e.target as Node)) ||
            (this.parent.getToolbarElement() && this.parent.getToolbarElement().contains(e.target as Node) &&
            !closest(target, '#' + this.parent.getID() + '_toolbar_Image') &&
            !target.querySelector('#' + this.parent.getID() + '_toolbar_Image')))
        ) {
            this.dialogObj.hide({ returnValue: true } as Event);
            this.parent.isBlur = true;
            dispatchEvent(this.parent.element, 'focusout');
        }
        if ((e.target as HTMLElement).tagName !== 'IMG' && this.imgResizeDiv && !(this.quickToolObj &&
            this.quickToolObj.imageQTBar && this.quickToolObj.imageQTBar.element.contains(e.target as HTMLElement)) &&
            this.contentModule.getEditPanel().contains(this.imgResizeDiv)) {
            this.cancelResizeAction();
        }
        if (this.contentModule.getEditPanel().querySelector('.e-img-resize')) {
            if (target.tagName !== 'IMG') { this.removeResizeEle(); }
            if (target.tagName !== 'IMG' && !isNOU(this.imgEle)) {
                this.imgEle.style.outline = '';
            } else if (!isNOU(this.prevSelectedImgEle) && this.prevSelectedImgEle !== target) {
                this.prevSelectedImgEle.style.outline = '';
            }
        }
    }

    private removeResizeEle(): void {
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchEndEvent, this.resizeEnd);
        detach(this.contentModule.getEditPanel().querySelector('.e-img-resize'));
    }

    private onWindowResize(): void {
        if (!isNOU(this.contentModule) && !isNOU(this.contentModule.getEditPanel().querySelector('.e-img-resize'))) {
            this.cancelResizeAction();
        }
    }

    // eslint-disable-next-line
    private imageUrlPopup(e: IImageNotifyArgs): HTMLElement {
        const imgUrl: HTMLElement = this.parent.createElement('div', { className: 'imgUrl' });
        const placeUrl: string = this.i10n.getConstant('imageUrl');
        this.inputUrl = this.parent.createElement('input', {
            className: 'e-input e-img-url',
            attrs: { placeholder: placeUrl, spellcheck: 'false' }
        });
        imgUrl.appendChild(this.inputUrl);
        return imgUrl;
    }

    // eslint-disable-next-line
    private insertImageUrl(e: MouseEvent): void {
        const proxy: Image = (this as IImageNotifyArgs).selfImage;
        proxy.isImgUploaded = false;
        const url: string = (proxy.inputUrl as HTMLInputElement).value;
        if (proxy.parent.formatter.getUndoRedoStack().length === 0) {
            proxy.parent.formatter.saveData();
        }
        if (!isNullOrUndefined(proxy.uploadUrl) && proxy.uploadUrl.url !== '') {
            proxy.uploadUrl.cssClass = (proxy.parent.insertImageSettings.display === 'inline' ?
                classes.CLS_IMGINLINE : classes.CLS_IMGBREAK);
            proxy.dialogObj.hide({ returnValue: false } as Event);
            proxy.parent.formatter.process(
                proxy.parent, (this as IImageNotifyArgs).args,
                ((this as IImageNotifyArgs).args as ClickEventArgs).originalEvent, proxy.uploadUrl);
            proxy.uploadUrl.url = '';
            if (proxy.contentModule.getEditPanel().querySelector('.e-img-resize')) {
                (proxy.imgEle as HTMLElement).style.outline = '';
                proxy.removeResizeEle();
            }
        } else if (url !== '') {
            if (proxy.parent.editorMode === 'HTML' && isNullOrUndefined(
                closest(
                    // eslint-disable-next-line
                    (this as IImageNotifyArgs).selection.range.startContainer.parentNode, '[id=' + "'" + proxy.contentModule.getPanel().id + "'" + ']'))) {
                (proxy.contentModule.getEditPanel() as HTMLElement).focus();
                const range: Range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.contentModule.getDocument());
                (this as IImageNotifyArgs).selection = proxy.parent.formatter.editorManager.nodeSelection.save(
                    range, proxy.contentModule.getDocument());
                (this as IImageNotifyArgs).selectParent = proxy.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            }
            const regex: RegExp = /[\w-]+.(jpg|png|jpeg|gif)/g;
            const matchUrl: string = (!isNullOrUndefined(url.match(regex)) && proxy.parent.editorMode === 'HTML') ? url.match(regex)[0] : '';
            const value: IImageCommandsArgs = {
                cssClass: (proxy.parent.insertImageSettings.display === 'inline' ? classes.CLS_IMGINLINE : classes.CLS_IMGBREAK),
                url: url, selection: (this as IImageNotifyArgs).selection, altText: matchUrl,
                selectParent: (this as IImageNotifyArgs).selectParent, width: {
                    width: proxy.parent.insertImageSettings.width, minWidth: proxy.parent.insertImageSettings.minWidth,
                    maxWidth: proxy.parent.getInsertImgMaxWidth()
                },
                height: {
                    height: proxy.parent.insertImageSettings.height, minHeight: proxy.parent.insertImageSettings.minHeight,
                    maxHeight: proxy.parent.insertImageSettings.maxHeight
                }
            };
            proxy.parent.formatter.process(
                proxy.parent, (this as IImageNotifyArgs).args, ((this as IImageNotifyArgs).args as ClickEventArgs).originalEvent, value);
            proxy.dialogObj.hide({ returnValue: false } as Event);
        }
    }

    private imgsizeInput(e: IImageNotifyArgs): HTMLElement {
        const selectNode: HTMLImageElement = (e as IImageNotifyArgs).selectNode[0] as HTMLImageElement;
        const imgHeight: string = this.i10n.getConstant('imageHeight');
        const imgWidth: string = this.i10n.getConstant('imageWidth');
        const imgSizeWrap: HTMLElement = this.parent.createElement('div', { className: 'e-img-sizewrap' });
        const widthVal: string | number = (selectNode.getAttribute('width') === 'auto' ||
            isNullOrUndefined(selectNode.getAttribute('width'))) ? selectNode.width : selectNode.getClientRects()[0].width;
        const heightVal: string | number = (selectNode.getAttribute('height') === 'auto' ||
            isNullOrUndefined(selectNode.getAttribute('height'))) ? selectNode.height : selectNode.getClientRects()[0].height;
        const content: string = '<div class="e-rte-label"><label>' + imgWidth +
            '</label></div><div class="e-rte-field"><input type="text" data-role ="none" id="imgwidth" class="e-img-width" value=' +
            widthVal
            + ' /></div>' +
            '<div class="e-rte-label">' + '<label>' + imgHeight + '</label></div><div class="e-rte-field"> ' +
            '<input type="text" data-role ="none" id="imgheight" class="e-img-height" value=' +
            heightVal
            + ' /></div>';
        const contentElem: DocumentFragment = parseHtml(content);
        imgSizeWrap.appendChild(contentElem);
        const widthNum: NumericTextBox = new NumericTextBox({
            format: '###.### px', min: this.parent.insertImageSettings.minWidth as number,
            max: this.parent.getInsertImgMaxWidth() as number,
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        widthNum.isStringTemplate = true;
        widthNum.createElement = this.parent.createElement;
        widthNum.appendTo(imgSizeWrap.querySelector('#imgwidth') as HTMLElement);
        const heightNum: NumericTextBox = new NumericTextBox({
            format: '###.### px', min: this.parent.insertImageSettings.minHeight as number,
            max: this.parent.insertImageSettings.maxHeight as number,
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        heightNum.isStringTemplate = true;
        heightNum.createElement = this.parent.createElement;
        heightNum.appendTo(imgSizeWrap.querySelector('#imgheight') as HTMLElement);
        return imgSizeWrap;
    }

    private insertSize(e: IImageNotifyArgs): void {
        e.selection.restore();
        const proxy: Image = e.selfImage;
        if (proxy.parent.formatter.getUndoRedoStack().length === 0) {
            proxy.parent.formatter.saveData();
        }
        const dialogEle: Element = proxy.dialogObj.element;
        const width: number = parseFloat((dialogEle.querySelector('.e-img-width') as HTMLInputElement).value);
        const height: number = parseFloat((dialogEle.parentElement.querySelector('.e-img-height') as HTMLInputElement).value);
        proxy.parent.formatter.process(
            this.parent, e.args, e.args,
            {
                width: width, height: height, selectNode: e.selectNode,
                subCommand: ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand
            });
        if (this.imgResizeDiv) {
            proxy.imgResizePos(e.selectNode[0] as HTMLImageElement, this.imgResizeDiv);
        }
        proxy.dialogObj.hide({ returnValue: true } as Event);
    }

    private insertImage(e: IImageNotifyArgs): void {
        this.imagDialog(e);
        if (!isNullOrUndefined(this.dialogObj)) {
            this.dialogObj.element.style.maxHeight = 'inherit';
            const dialogContent: HTMLElement = this.dialogObj.element.querySelector('.e-img-content');
            if (((!isNullOrUndefined(this.parent.insertImageSettings.path) && this.parent.editorMode === 'Markdown')
                || this.parent.editorMode === 'HTML')) {
                (document.getElementById(this.rteID + '_insertImage') as HTMLElement).focus();
            } else {
                (dialogContent.querySelector('.e-img-url') as HTMLElement).focus();
            }
        }
    }

    private imgUpload(e: IImageNotifyArgs): HTMLElement {
        let save: NodeSelection;
        let selectParent: Node[];
        // eslint-disable-next-line
        const proxy: this = this;
        const iframe: boolean = proxy.parent.iframeSettings.enable;
        if (proxy.parent.editorMode === 'HTML' && (!iframe && isNullOrUndefined(closest(e.selection.range.startContainer.parentNode, '[id='
        // eslint-disable-next-line
        + "'" + this.parent.contentModule.getPanel().id + "'" + ']'))
            || (iframe && !hasClass(e.selection.range.startContainer.parentNode.ownerDocument.querySelector('body'), 'e-lib')))) {
            (this.contentModule.getEditPanel() as HTMLElement).focus();
            const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            save = this.parent.formatter.editorManager.nodeSelection.save(
                range, this.parent.contentModule.getDocument());
            selectParent = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
        } else {
            save = e.selection; selectParent = e.selectParent;
        }
        const uploadParentEle: HTMLElement = this.parent.createElement('div', { className: 'e-img-uploadwrap e-droparea' });
        const deviceImgUpMsg: string = this.i10n.getConstant('imageDeviceUploadMessage');
        const imgUpMsg: string = this.i10n.getConstant('imageUploadMessage');
        const span: HTMLElement = this.parent.createElement('span', { className: 'e-droptext' });
        const spanMsg: HTMLElement = this.parent.createElement('span', {
            className: 'e-rte-upload-text', innerHTML: ((Browser.isDevice) ? deviceImgUpMsg : imgUpMsg)
        });
        span.appendChild(spanMsg);
        const btnEle: HTMLElement = this.parent.createElement('button', {
            className: 'e-browsebtn', id: this.rteID + '_insertImage', attrs: { autofocus: 'true', type: 'button' }
        });
        span.appendChild(btnEle); uploadParentEle.appendChild(span);
        const browserMsg: string = this.i10n.getConstant('browse');
        const button: Button = new Button({ content: browserMsg, enableRtl: this.parent.enableRtl });
        button.isStringTemplate = true; button.createElement = this.parent.createElement;
        button.appendTo(btnEle);
        const btnClick: HTMLElement = (Browser.isDevice) ? span : btnEle;
        EventHandler.add(btnClick, 'click', this.fileSelect, this);
        const uploadEle: HTMLInputElement | HTMLElement = this.parent.createElement('input', {
            id: this.rteID + '_upload', attrs: { type: 'File', name: 'UploadFiles' }
        });
        uploadParentEle.appendChild(uploadEle);
        let altText: string;
        let rawFile: FileInfo[];
        let selectArgs: SelectedEventArgs;
        let filesData: FileInfo[];
        let beforeUploadArgs: ImageUploadingEventArgs;
        this.uploadObj = new Uploader({
            asyncSettings: { saveUrl: this.parent.insertImageSettings.saveUrl, removeUrl: this.parent.insertImageSettings.removeUrl },
            dropArea: span, multiple: false, enableRtl: this.parent.enableRtl,
            allowedExtensions: this.parent.insertImageSettings.allowedTypes.toString(),
            selected: (e: SelectedEventArgs) => {
                proxy.isImgUploaded = true;
                selectArgs = e;
                filesData = e.filesData;
                if (this.parent.isServerRendered) {
                    selectArgs = JSON.parse(JSON.stringify(e));
                    e.cancel = true;
                    rawFile = e.filesData;
                    selectArgs.filesData = rawFile;
                }
                this.parent.trigger(events.imageSelected, selectArgs, (selectArgs: SelectedEventArgs) => {
                    if (!selectArgs.cancel) {
                        this.checkExtension(selectArgs.filesData[0]); altText = selectArgs.filesData[0].name;
                        if (this.parent.editorMode === 'HTML' && isNullOrUndefined(this.parent.insertImageSettings.path)) {
                            const reader: FileReader = new FileReader();
                            // eslint-disable-next-line
                            reader.addEventListener('load', (e: MouseEvent) => {
                                const url: string = this.parent.insertImageSettings.saveFormat === 'Base64' ? reader.result as string :
                                    URL.createObjectURL(convertToBlob(reader.result as string));
                                proxy.uploadUrl = {
                                    url: url, selection: save, altText: altText,
                                    selectParent: selectParent,
                                    width: {
                                        width: proxy.parent.insertImageSettings.width, minWidth: proxy.parent.insertImageSettings.minWidth,
                                        maxWidth: proxy.parent.getInsertImgMaxWidth()
                                    }, height: {
                                        height: proxy.parent.insertImageSettings.height,
                                        minHeight: proxy.parent.insertImageSettings.minHeight,
                                        maxHeight: proxy.parent.insertImageSettings.maxHeight
                                    }
                                };
                                proxy.inputUrl.setAttribute('disabled', 'true');
                            });
                            reader.readAsDataURL(selectArgs.filesData[0].rawFile as Blob);
                        }
                        if (this.parent.isServerRendered) {
                            /* eslint-disable */
                            (this.uploadObj as any)._internalRenderSelect(selectArgs, rawFile);
                            /* eslint-enable */
                        }
                    }
                });
            },
            beforeUpload: (args: BeforeUploadEventArgs) => {
                if (this.parent.isServerRendered) {
                    beforeUploadArgs = JSON.parse(JSON.stringify(args));
                    beforeUploadArgs.filesData = filesData;
                    args.cancel = true;
                    this.parent.trigger(events.imageUploading, beforeUploadArgs, (beforeUploadArgs: ImageUploadingEventArgs) => {
                        if (beforeUploadArgs.cancel) {
                            return;
                        }
                        /* eslint-disable */
                        (this.uploadObj as any).currentRequestHeader = beforeUploadArgs.currentRequest ?
                        beforeUploadArgs.currentRequest : (this.uploadObj as any).currentRequestHeader;
                       (this.uploadObj as any).customFormDatas = beforeUploadArgs.customFormData && beforeUploadArgs.customFormData.length > 0 ?
                       beforeUploadArgs.customFormData : (this.uploadObj as any).customFormDatas;
                        (this.uploadObj as any).uploadFiles(rawFile, null);
                        /* eslint-enable */
                    });
                } else {
                    this.parent.trigger(events.beforeImageUpload, args);
                }
            },
            uploading: (e: UploadingEventArgs) => {
                if (!this.parent.isServerRendered) {
                    this.parent.trigger(events.imageUploading, e);
                }
            },
            success: (e: Object) => {
                this.parent.trigger(events.imageUploadSuccess, e, (e: object) => {
                    if (!isNullOrUndefined(this.parent.insertImageSettings.path)) {
                        const url: string = this.parent.insertImageSettings.path + (e as MetaData).file.name;
                        // eslint-disable-next-line
                        const value: IImageCommandsArgs = { url: url, selection: save };
                        proxy.uploadUrl = {
                            url: url, selection: save, altText: altText, selectParent: selectParent,
                            width: {
                                width: proxy.parent.insertImageSettings.width, minWidth: proxy.parent.insertImageSettings.minWidth,
                                maxWidth: proxy.parent.getInsertImgMaxWidth()
                            }, height: {
                                height: proxy.parent.insertImageSettings.height, minHeight: proxy.parent.insertImageSettings.minHeight,
                                maxHeight: proxy.parent.insertImageSettings.maxHeight
                            }
                        };
                        proxy.inputUrl.setAttribute('disabled', 'true');
                    }
                });
            },
            failure: (e: object) => {
                this.parent.trigger(events.imageUploadFailed, e);
            },
            removing: () => {
                // eslint-disable-next-line
                this.parent.trigger(events.imageRemoving, e, (e: RemovingEventArgs) => {
                    proxy.isImgUploaded = false;
                    proxy.inputUrl.removeAttribute('disabled'); if (proxy.uploadUrl) {
                        proxy.uploadUrl.url = '';
                    }
                    (this.dialogObj.getButtons(0) as Button).element.removeAttribute('disabled');
                });
            }
        });
        this.uploadObj.isStringTemplate = true; this.uploadObj.createElement = this.parent.createElement;
        this.uploadObj.appendTo(uploadEle); return uploadParentEle;
    }
    private checkExtension(e: FileInfo): void {
        if (this.uploadObj.allowedExtensions) {
            if (this.uploadObj.allowedExtensions.toLocaleLowerCase().indexOf(('.' + e.type).toLocaleLowerCase()) === -1) {
                (this.dialogObj.getButtons(0) as Button).element.setAttribute('disabled', 'disabled');
            } else {
                (this.dialogObj.getButtons(0) as Button).element.removeAttribute('disabled');
            }
        }
    }
    private fileSelect(): boolean {
        this.dialogObj.element.getElementsByClassName('e-file-select-wrap')[0].querySelector('button').click();
        return false;
    }
    private dragStart(e: DragEvent): void | boolean {
        if ((e.target as HTMLElement).nodeName === 'IMG') {
            this.parent.trigger(events.actionBegin, e, (actionBeginArgs: ActionBeginEventArgs) => {
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
    }

    private dragEnter(e?: DragEvent): void {
        e.dataTransfer.dropEffect = 'copy';
        e.preventDefault();
    }
    private dragOver(e?: DragEvent): void | boolean {
        if ((Browser.info.name === 'edge' && e.dataTransfer.items[0].type.split('/')[0].indexOf('image') > -1) ||
            (Browser.isIE && e.dataTransfer.types[0] === 'Files')) {
            e.preventDefault();
        } else {
            return true;
        }
    }

    /**
     * Used to set range When drop an image
     *
     * @param {ImageDropEventArgs} args - specifies the image arguments.
     * @returns {void}
     */
    private dragDrop(args: ImageDropEventArgs): void {
        this.parent.trigger(events.beforeImageDrop, args, (e: ImageDropEventArgs) => {
            const imgElement: HTMLElement = this.parent.inputElement.ownerDocument.querySelector('.' + classes.CLS_RTE_DRAG_IMAGE);
            const isImgOrFileDrop: boolean = (imgElement && imgElement.tagName === 'IMG') || e.dataTransfer.files.length > 0;
            if (!e.cancel && isImgOrFileDrop) {
                this.parent.trigger(events.actionBegin, e, (actionBeginArgs: ActionBeginEventArgs) => {
                    if (actionBeginArgs.cancel) {
                        e.preventDefault();
                    } else {
                        if (closest((e.target as HTMLElement), '#' + this.parent.getID() + '_toolbar') ||
                            this.parent.inputElement.contentEditable === 'false') {
                            e.preventDefault();
                            return;
                        }
                        if (this.parent.element.querySelector('.' + classes.CLS_IMG_RESIZE)) {
                            detach(this.imgResizeDiv);
                        }
                        e.preventDefault();
                        let range: Range;
                        if (this.contentModule.getDocument().caretRangeFromPoint) { //For chrome
                            range = this.contentModule.getDocument().caretRangeFromPoint(e.clientX, e.clientY);
                        } else if ((e.rangeParent)) { //For mozilla firefox
                            range = this.contentModule.getDocument().createRange();
                            range.setStart(e.rangeParent, e.rangeOffset);
                        } else {
                            range = this.getDropRange(e.clientX, e.clientY); //For internet explorer
                        }
                        this.parent.notify(events.selectRange, { range: range });
                        const uploadArea: HTMLElement = this.parent.element.querySelector('.' + classes.CLS_DROPAREA) as HTMLElement;
                        if (uploadArea) {
                            return;
                        }
                        this.insertDragImage(e as DragEvent);
                    }
                });
            } else {
                if (isImgOrFileDrop) {
                    e.preventDefault();
                }
            }
        });
    }

    /**
     * Used to calculate range on internet explorer
     *
     * @param {number} x - specifies the x range.
     * @param {number} y - specifies the y range.
     * @returns {void}
     */
    private getDropRange(x: number, y: number): Range {
        const startRange: Range = this.contentModule.getDocument().createRange();
        this.parent.formatter.editorManager.nodeSelection.setRange(this.contentModule.getDocument(), startRange);
        const elem: Element = this.contentModule.getDocument().elementFromPoint(x, y);
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

    private insertDragImage(e: DragEvent): void {
        e.preventDefault();
        const activePopupElement: HTMLElement = this.parent.element.querySelector('' + classes.CLS_POPUP_OPEN);
        this.parent.notify(events.drop, { args: e });
        if (activePopupElement) {
            activePopupElement.classList.add(classes.CLS_HIDE);
        }
        if (e.dataTransfer.files.length > 0) { //For external image drag and drop
            if (e.dataTransfer.files.length > 1) {
                return;
            }
            const imgFiles: FileList = e.dataTransfer.files;
            const fileName: string = imgFiles[0].name;
            const imgType: string = fileName.substring(fileName.lastIndexOf('.'));
            const allowedTypes: string[] = this.parent.insertImageSettings.allowedTypes;
            for (let i: number = 0; i < allowedTypes.length; i++) {
                if (imgType.toLocaleLowerCase() === allowedTypes[i].toLowerCase()) {
                    if (this.parent.insertImageSettings.saveUrl) {
                        this.onSelect(e);
                    } else {
                        const args: NotifyArgs = { args: e, text: '', file: imgFiles[0] };
                        e.preventDefault();
                        this.imagePaste(args);
                    }
                }
            }
        } else { //For internal image drag and drop
            const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            const imgElement: HTMLElement = this.parent.inputElement.ownerDocument.querySelector('.' + classes.CLS_RTE_DRAG_IMAGE);
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
                const imgArgs: ActionCompleteEventArgs = { elements: [imgElement] };
                imgElement.addEventListener('load', () => {
                    this.parent.trigger(events.actionComplete, imgArgs);
                });
                this.parent.formatter.editorManager.nodeSelection.Clear(this.contentModule.getDocument());
                const args: MouseEvent = e as MouseEvent;
                this.resizeStart(args as PointerEvent, imgElement);
                this.hideImageQuickToolbar();
            }
        }
    }

    private onSelect(args: DragEvent): void {
        // eslint-disable-next-line
        const proxy: Image = this;
        const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
        const parentElement: HTMLElement = this.parent.createElement('ul', { className: classes.CLS_UPLOAD_FILES });
        this.parent.element.appendChild(parentElement);
        const validFiles: FileInfo = {
            name: '',
            size: 0,
            status: '',
            statusCode: '',
            type: '',
            rawFile: args.dataTransfer.files[0],
            validationMessages: {}
        };
        const imageTag: HTMLImageElement = <HTMLImageElement>this.parent.createElement('IMG');
        imageTag.style.opacity = '0.5';
        imageTag.classList.add(classes.CLS_RTE_IMAGE);
        imageTag.classList.add(classes.CLS_IMGINLINE);
        imageTag.classList.add(classes.CLS_RESIZE);
        const file: File = validFiles.rawFile as File;
        const reader: FileReader = new FileReader();
        reader.addEventListener('load', () => {
            const url: string = URL.createObjectURL(convertToBlob(reader.result as string));
            imageTag.src = proxy.parent.insertImageSettings.saveFormat === 'Blob' ? url : reader.result as string;
        });
        if (file) {
            reader.readAsDataURL(file);
        }
        range.insertNode(imageTag);
        this.uploadMethod(args, imageTag);
        const e: ActionCompleteEventArgs = { elements: [imageTag] };
        imageTag.addEventListener('load', () => {
            this.parent.trigger(events.actionComplete, e);
        });

    }

    /**
     * Rendering uploader and popup for drag and drop
     *
     * @param {DragEvent} dragEvent - specifies the event.
     * @param {HTMLImageElement} imageElement - specifies the element.
     * @returns {void}
     */
    private uploadMethod(dragEvent: DragEvent, imageElement: HTMLImageElement): void {
        let isUploading: boolean = false;
        // eslint-disable-next-line
        const proxy: Image = this;
        const popupEle: HTMLElement = this.parent.createElement('div');
        this.parent.element.appendChild(popupEle);
        const uploadEle: HTMLInputElement | HTMLElement = this.parent.createElement('input', {
            id: this.rteID + '_upload', attrs: { type: 'File', name: 'UploadFiles' }
        });
        const offsetY: number = this.parent.iframeSettings.enable ? -50 : -90;
        this.popupObj = new Popup(popupEle, {
            relateTo: imageElement,
            height: '85px',
            width: '300px',
            offsetY: offsetY,
            content: uploadEle,
            viewPortElement: this.parent.element,
            position: { X: 'center', Y: 'top' },
            enableRtl: this.parent.enableRtl,
            zIndex: 10001,
            // eslint-disable-next-line
            close: (event: { [key: string]: object }) => {
                this.parent.isBlur = false;
                this.popupObj.destroy();
                detach(this.popupObj.element);
                this.popupObj = null;
            }
        });
        this.popupObj.element.style.display = 'none';
        addClass([this.popupObj.element], classes.CLS_POPUP_OPEN);
        addClass([this.popupObj.element], classes.CLS_RTE_UPLOAD_POPUP);
        const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
        const timeOut: number = dragEvent.dataTransfer.files[0].size > 1000000 ? 300 : 100;
        setTimeout(() => {
            proxy.refreshPopup(imageElement);
        }, timeOut);
        let rawFile: FileInfo[];
        let beforeUploadArgs: ImageUploadingEventArgs;
        this.uploadObj = new Uploader({
            asyncSettings: {
                saveUrl: this.parent.insertImageSettings.saveUrl,
                removeUrl: this.parent.insertImageSettings.removeUrl
            },
            cssClass: classes.CLS_RTE_DIALOG_UPLOAD,
            dropArea: this.parent.element,
            allowedExtensions: this.parent.insertImageSettings.allowedTypes.toString(),
            removing: () => {
                this.parent.inputElement.contentEditable = 'true';
                isUploading = false;
                detach(imageElement);
                this.popupObj.close();
            },
            canceling: () => {
                this.parent.inputElement.contentEditable = 'true';
                isUploading = false;
                detach(imageElement);
                this.popupObj.close();
            },
            beforeUpload: (args: BeforeUploadEventArgs) => {
                if (this.parent.isServerRendered) {
                    beforeUploadArgs = JSON.parse(JSON.stringify(args));
                    beforeUploadArgs.filesData = rawFile;
                    isUploading = true;
                    args.cancel = true;
                    this.parent.trigger(events.imageUploading, beforeUploadArgs, (beforeUploadArgs: ImageUploadingEventArgs) => {
                        if (beforeUploadArgs.cancel) {
                            return;
                        }
                        /* eslint-disable */
                        (this.uploadObj as any).currentRequestHeader = beforeUploadArgs.currentRequest ?
                        beforeUploadArgs.currentRequest : (this.uploadObj as any).currentRequestHeader;
                       (this.uploadObj as any).customFormDatas = beforeUploadArgs.customFormData && beforeUploadArgs.customFormData.length > 0 ?
                       beforeUploadArgs.customFormData : (this.uploadObj as any).customFormDatas;
                        (this.uploadObj as any).uploadFiles(rawFile, null);
                        this.parent.inputElement.contentEditable = 'false';
                        /* eslint-enable */
                    });
                } else {
                    this.parent.trigger(events.beforeImageUpload, args);
                }
            },
            uploading: (e: UploadingEventArgs) => {
                if (!this.parent.isServerRendered) {
                    isUploading = true;
                    this.parent.trigger(events.imageUploading, e);
                    this.parent.inputElement.contentEditable = 'false';
                }
            },
            selected: (e: SelectedEventArgs) => {
                if (isUploading) {
                    e.cancel = true;
                }
                if (this.parent.isServerRendered) {
                    rawFile = e.filesData;
                }
            },
            failure: (e: Object) => {
                isUploading = false;
                this.parent.inputElement.contentEditable = 'true';
                const args: IShowPopupArgs = {
                    args: dragEvent as MouseEvent,
                    type: 'Images',
                    isNotify: undefined,
                    elements: imageElement
                };
                setTimeout(() => {
                    this.uploadFailure(imageElement, args, e);
                }, 900);
            },
            success: (e: ImageSuccessEventArgs) => {
                isUploading = false;
                this.parent.inputElement.contentEditable = 'true';
                const args: IShowPopupArgs = {
                    args: dragEvent as MouseEvent,
                    type: 'Images',
                    isNotify: undefined,
                    elements: imageElement
                };
                setTimeout(() => {
                    this.uploadSuccess(imageElement, dragEvent, args, e);
                }, 900);
            }
        });
        this.uploadObj.appendTo(this.popupObj.element.childNodes[0] as HTMLElement);
        (this.popupObj.element.querySelector('.e-rte-dialog-upload .e-file-select-wrap') as HTMLElement).style.display = 'none';
        range.selectNodeContents(imageElement);
        this.parent.formatter.editorManager.nodeSelection.setRange(this.contentModule.getDocument(), range);
    }
    private refreshPopup(imageElement: HTMLElement): void {
        const imgPosition: number = this.parent.iframeSettings.enable ? this.parent.element.offsetTop +
            imageElement.offsetTop : imageElement.offsetTop;
        const rtePosition: number = this.parent.element.offsetTop + this.parent.element.offsetHeight;
        if (imgPosition > rtePosition) {
            this.popupObj.relateTo = this.parent.inputElement;
            this.popupObj.offsetY = this.parent.iframeSettings.enable ? -30 : -65;
            this.popupObj.element.style.display = 'block';
        } else {
            if (this.popupObj) {
                this.popupObj.refreshPosition(imageElement);
                this.popupObj.element.style.display = 'block';
            }
        }
    }

    /**
     * Called when drop image upload was failed
     *
     * @param {HTMLElement} imgEle - specifies the image element.
     * @param {IShowPopupArgs} args - specifies the arguments.
     * @param {Object} e - specfies the object.
     * @returns {void}
     */
    private uploadFailure(imgEle: HTMLElement, args: IShowPopupArgs, e: Object): void {
        detach(imgEle);
        if (this.popupObj) {
            this.popupObj.close();
        }
        this.parent.trigger(events.imageUploadFailed, e);
        this.uploadObj.destroy();
    }
    /**
     * Called when drop image upload was successful
     *
     * @param {HTMLElement} imageElement - specifies the image element.
     * @param {DragEvent} dragEvent - specifies the drag event.
     * @param {IShowPopupArgs} args - specifies the arguments.
     * @param {ImageSuccessEventArgs} e - specifies the success event.
     * @returns {void}
     */
    private uploadSuccess(imageElement: HTMLElement, dragEvent: DragEvent, args: IShowPopupArgs, e: ImageSuccessEventArgs): void {
        imageElement.style.opacity = '1';
        imageElement.classList.add(classes.CLS_IMG_FOCUS);
        e.element = imageElement;
        this.parent.trigger(events.imageUploadSuccess, e, (e: object) => {
            if (!isNullOrUndefined(this.parent.insertImageSettings.path)) {
                const url: string = this.parent.insertImageSettings.path + (e as MetaData).file.name;
                (imageElement as HTMLImageElement).src = url;
                imageElement.setAttribute('alt', (e as MetaData).file.name);
            }
        });
        if (this.popupObj) {
            this.popupObj.close();
            this.uploadObj.destroy();
        }
        this.showImageQuickToolbar(args);
        this.resizeStart((dragEvent as MouseEvent) as PointerEvent, imageElement);
    }

    private imagePaste(args: NotifyArgs): void {
        if (args.text.length === 0 && !isNullOrUndefined((args as NotifyArgs).file)) {
            // eslint-disable-next-line
            const proxy: Image = this;
            const reader: FileReader = new FileReader();
            (args.args as KeyboardEvent).preventDefault();
            // eslint-disable-next-line
            reader.addEventListener('load', (e: MouseEvent) => {
                const url: IImageCommandsArgs = {
                    cssClass: (proxy.parent.insertImageSettings.display === 'inline' ? classes.CLS_IMGINLINE : classes.CLS_IMGBREAK),
                    url: this.parent.insertImageSettings.saveFormat === 'Base64' || !isNullOrUndefined(args.callBack) ?
                        reader.result as string : URL.createObjectURL(convertToBlob(reader.result as string)),
                    width: {
                        width: proxy.parent.insertImageSettings.width, minWidth: proxy.parent.insertImageSettings.minWidth,
                        maxWidth: proxy.parent.getInsertImgMaxWidth()
                    },
                    height: {
                        height: proxy.parent.insertImageSettings.height, minHeight: proxy.parent.insertImageSettings.minHeight,
                        maxHeight: proxy.parent.insertImageSettings.maxHeight
                    }
                };
                if (!isNullOrUndefined(args.callBack)) {
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
        const imageSrc: string = 'img[src="' + url.url + '"]';
        const imageElement: Element = this.parent.inputElement.querySelector(imageSrc);
        this.parent.quickToolbarModule.createQTBar('Image', 'MultiRow', this.parent.quickToolbarSettings.image, RenderType.ImageToolbar);
        const args: IShowPopupArgs = {
            args: e.args as MouseEvent,
            type: 'Images',
            isNotify: undefined,
            elements: imageElement
        };
        if (imageElement) {
            setTimeout(() => {
                this.showImageQuickToolbar(args); this.resizeStart(e.args as PointerEvent, imageElement);
            }, 0);
        }
    }

    /* eslint-disable */
    /**
     * Destroys the ToolBar.
     * 
     * @method destroy
     * @returns {void}
     * @hidden
     * @deprecated
     */
    /* eslint-enable */
    public destroy(): void {
        this.prevSelectedImgEle = undefined;
        this.removeEventListener();
    }
    /**
     * For internal use only - Get the module name.
     *
     * @returns {void}
     */
    private getModuleName(): string {
        return 'image';
    }
}
