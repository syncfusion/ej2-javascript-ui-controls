import { addClass, detach, EventHandler, L10n, isNullOrUndefined, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { Browser, closest, removeClass } from '@syncfusion/ej2-base';
import { IImageCommandsArgs, IRenderer, IDropDownItemModel, IToolbarItemModel, OffsetPosition } from '../base/interface';
import { IRichTextEditor, IImageNotifyArgs, NotifyArgs, IShowPopupArgs, ResizeArgs } from '../base/interface';
import * as events from '../base/constant';
import * as classes from '../base/classes';
import { ServiceLocator } from '../services/service-locator';
import { NodeSelection } from '../../selection/selection';
import { Uploader, SelectedEventArgs, MetaData, NumericTextBox } from '@syncfusion/ej2-inputs';
import { Dialog } from '@syncfusion/ej2-popups';
import { Button, CheckBox, ChangeEventArgs } from '@syncfusion/ej2-buttons';
import { InsertHtml } from './../../editor-manager/plugin/inserthtml';
import { RendererFactory } from '../services/renderer-factory';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { RenderType } from '../base/enum';
import { dispatchEvent } from '../base/util';
/**
 * `Image` module is used to handle image actions.
 */
export class Image {
    public element: HTMLElement;
    private rteID: string;
    private parent: IRichTextEditor;
    public dialogObj: Dialog;
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
    private pageX: number = null;
    private pageY: number = null;
    constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.rteID = parent.element.id;
        this.i10n = serviceLocator.getService<L10n>('rteLocale');
        this.rendererFactory = serviceLocator.getService<RendererFactory>('rendererFactory');
        this.addEventListener();
    }

    protected addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.keyDown, this.onKeyDown, this);
        this.parent.on(events.insertImage, this.insertImage, this);
        this.parent.on(events.insertCompleted, this.showImageQuickToolbar, this);
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
        this.parent.on(events.paste, this.imagePaste, this);
    }

    protected removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.keyDown, this.onKeyDown);
        this.parent.off(events.insertImage, this.insertImage);
        this.parent.off(events.insertCompleted, this.showImageQuickToolbar);
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
        this.parent.off(events.paste, this.imagePaste);
        if (!isNullOrUndefined(this.contentModule)) {
            EventHandler.remove(this.contentModule.getEditPanel(), 'click', this.imageClick);
            this.parent.formatter.editorManager.observer.off(events.checkUndo, this.undoStack);
            if (this.parent.insertImageSettings.resize) {
                EventHandler.remove(this.parent.contentModule.getEditPanel(), Browser.touchStartEvent, this.resizeStart);
                EventHandler.remove(this.contentModule.getDocument(), 'mousedown', this.onDocumentClick);
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
        EventHandler.add(this.contentModule.getEditPanel(), 'click', this.imageClick, this);
        if (this.parent.insertImageSettings.resize) {
            EventHandler.add(this.parent.contentModule.getEditPanel(), Browser.touchStartEvent, this.resizeStart, this);
            EventHandler.add(this.contentModule.getDocument(), 'mousedown', this.onDocumentClick, this);
        }
    }

    private undoStack(args?: { [key: string]: string }): void {
        if (args.subCommand.toLowerCase() === 'undo' || args.subCommand.toLowerCase() === 'redo') {
            for (let i: number = 0; i < this.parent.formatter.getUndoRedoStack().length; i++) {
                let temp: Element = this.parent.createElement('div');
                let contentElem: DocumentFragment = document.createRange().createContextualFragment(
                    this.parent.formatter.getUndoRedoStack()[i].text);
                temp.appendChild(contentElem);
                let img: NodeListOf<HTMLElement> = temp.querySelectorAll('img');
                if (temp.querySelector('.e-img-resize') && img.length > 0) {
                    for (let j: number = 0; j < img.length; j++) { img[j].style.outline = ''; }
                    detach(temp.querySelector('.e-img-resize'));
                    this.parent.formatter.getUndoRedoStack()[i].text = temp.innerHTML;
                }
            }
        }
    }

    private resizeEnd(e: PointerEvent | TouchEvent): void {
        this.resizeBtnInit();
        this.imgEle.parentElement.style.cursor = 'auto';
        if (Browser.isDevice) { removeClass([(e.target as HTMLElement).parentElement], 'e-mob-span'); }
        let args: ResizeArgs = { event: e, requestType: 'images' };
        this.parent.trigger(events.resizeStop, args);
        let pageX: number = this.getPointX(e);
        let pageY: number = (this.parent.iframeSettings.enable) ? window.pageYOffset +
            this.parent.element.getBoundingClientRect().top + (e as PointerEvent).clientY : (e as PointerEvent).pageY;
        this.parent.formatter.editorManager.observer.on(events.checkUndo, this.undoStack, this);
        this.parent.formatter.saveData();
    }

    private resizeStart(e: PointerEvent | TouchEvent): void {
        if ((e.target as HTMLElement).tagName === 'IMG') {
            this.parent.preventDefaultResize(e as MouseEvent);
            let img: HTMLImageElement = e.target as HTMLImageElement;
            if (this.imgResizeDiv && this.contentModule.getEditPanel().contains(this.imgResizeDiv)) { detach(this.imgResizeDiv); }
            this.imageResize(img);
        }
        if ((e.target as HTMLElement).classList.contains('e-rte-imageboxmark')) {
            if (this.parent.formatter.getUndoRedoStack().length === 0) {
                this.parent.formatter.saveData();
            }
            this.pageX = this.getPointX(e);
            this.pageY = this.getPointY(e);
            e.preventDefault();
            e.stopImmediatePropagation();
            this.resizeBtnInit();
            if (this.quickToolObj) { this.quickToolObj.imageQTBar.hidePopup(); }
            if ((e.target as HTMLElement).classList.contains('e-rte-topLeft')) { this.resizeBtnStat.topLeft = true; }
            if ((e.target as HTMLElement).classList.contains('e-rte-topRight')) { this.resizeBtnStat.topRight = true; }
            if ((e.target as HTMLElement).classList.contains('e-rte-botLeft')) { this.resizeBtnStat.botLeft = true; }
            if ((e.target as HTMLElement).classList.contains('e-rte-botRight')) { this.resizeBtnStat.botRight = true; }
            if (Browser.isDevice && this.contentModule.getEditPanel().contains(this.imgResizeDiv) &&
                !this.imgResizeDiv.classList.contains('e-mob-span')) {
                addClass([this.imgResizeDiv], 'e-mob-span');
            } else {
                let args: ResizeArgs = { event: e, requestType: 'images' };
                this.parent.trigger(events.resizeStart, args);
                if (args.cancel) {
                    this.cancelResizeAction();
                    return;
                }
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
            } else {
                this.contentModule.getEditPanel().setAttribute('contenteditable', 'true');
            }
        }
        if ((e.target as HTMLElement).tagName === 'A' ||
            (e.target as HTMLElement).parentElement.tagName === 'A') {
            e.preventDefault();
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
        if (Browser.isDevice) { addClass([this.imgResizeDiv], 'e-mob-rte'); }
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

    private calcPos(elem: HTMLElement): OffsetPosition {
        let parentOffset: OffsetPosition = { top: 0, left: 0 };
        let offset: OffsetPosition = elem.getBoundingClientRect();
        let doc: Document = elem.ownerDocument;
        let offsetParent: Node = ((elem.offsetParent && elem.offsetParent.classList.contains('e-img-caption')) ?
            closest(elem, '.e-control') : elem.offsetParent) || doc.documentElement;
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
    private setAspectRatio(img: HTMLImageElement, expectedX: number, expectedY: number): void {
        if (isNullOrUndefined(img.width)) { return; }
        let width: number = img.style.width !== '' ? parseInt(img.style.width, 10) : img.width;
        let height: number = img.style.height !== '' ? parseInt(img.style.height, 10) : img.height;
        if (width > height) {
            if (this.parent.insertImageSettings.resizeByPercent) {
                img.style.width = this.pixToPerc((width / height * expectedY), (img.previousElementSibling || img.parentElement)) + '%';
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
                img.style.width = this.pixToPerc(expectedX, (img.previousElementSibling || img.parentElement)) + '%';
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
        let args: ResizeArgs = { event: e, requestType: 'images' };
        this.parent.trigger(events.onResize, args);
        if (args.cancel) {
            this.cancelResizeAction();
            return;
        }
        if ((parseInt(this.parent.insertImageSettings.minWidth as string, 10) >= parseInt(width, 10) ||
            parseInt(this.parent.insertImageSettings.maxWidth as string, 10) <= parseInt(width, 10))) {
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
    private resizing(e: PointerEvent | TouchEvent): void {
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
        let item: IToolbarItemModel = (args.args as ClickEventArgs).item as IToolbarItemModel;
        switch (item.subCommand) {
            case 'Replace':
                this.parent.notify(events.insertImage, args);
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
        let target: string = (e.selectParent[0].parentNode as HTMLAnchorElement).target === '' ? '_self' : '_blank';
        window.open((e.selectParent[0].parentNode as HTMLAnchorElement).href, target);
    }

    private editImgLink(e: NotifyArgs): void {
        let selectParentEle: HTMLElement = e.selectParent[0].parentNode as HTMLElement;
        let linkUpdate: string = this.i10n.getConstant('dialogUpdate');
        let inputDetails: { [key: string]: string } = {
            url: (selectParentEle as HTMLAnchorElement).href, target: (selectParentEle as HTMLAnchorElement).target,
            header: 'Edit Link', btnText: linkUpdate
        };
        this.insertImgLink(e, inputDetails);
    }
    private removeImgLink(e: NotifyArgs): void {
        e.selection.restore();
        let insertEle: HTMLElement = (this.contentModule.getEditPanel().contains(this.captionEle) && closest(this.captionEle, 'a')) ?
            this.captionEle : e.selectNode[0] as HTMLElement;
        detach(closest(e.selectParent[0], 'a'));
        InsertHtml.Insert(this.parent.contentModule.getDocument(), insertEle);
        this.parent.formatter.saveData();
        if (this.quickToolObj && document.body.contains(this.quickToolObj.imageQTBar.element)) {
            this.quickToolObj.imageQTBar.hidePopup();
            if (!isNullOrUndefined(e.selectParent as Node[])) { removeClass([e.selectParent[0] as HTMLElement], 'e-img-focus'); }
        }
    }
    private onKeyDown(event: NotifyArgs): void {
        let originalEvent: KeyboardEventArgs = event.args as KeyboardEventArgs;
        let range: Range;
        let save: NodeSelection;
        let selectNodeEle: Node[];
        let selectParentEle: Node[];
        if (!isNullOrUndefined(this.parent.formatter.editorManager.nodeSelection)) {
            range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            save = this.parent.formatter.editorManager.nodeSelection.save(
                range, this.parent.contentModule.getDocument());
            selectNodeEle = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
            selectParentEle = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            if (!originalEvent.ctrlKey && originalEvent.key && (originalEvent.key.length === 1 || originalEvent.action === 'enter') &&
                ((selectParentEle[0] as HTMLElement).tagName === 'IMG') && (selectParentEle[0] as HTMLElement).parentElement) {
                let prev: Node = ((selectParentEle[0] as HTMLElement).parentElement as HTMLElement).childNodes[0];
                if (this.contentModule.getEditPanel().querySelector('.e-img-resize')) {
                    this.remvoeResizEle();
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
            if (selectNodeEle && selectNodeEle[0].nodeName === 'IMG') {
                originalEvent.preventDefault();
                this.deleteImg({ selectNode: selectNodeEle, selection: save, selectParent: selectParentEle });
            }
            if (this.contentModule.getEditPanel().querySelector('.e-img-resize')) {
                this.remvoeResizEle();
            }
        }
        switch (originalEvent.action) {
            case 'escape':
                if (!isNullOrUndefined(this.dialogObj)) {
                    this.dialogObj.close();
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
    private alignmentSelect(e: ClickEventArgs): void {
        let item: IDropDownItemModel = e.item as IDropDownItemModel;
        if (!document.body.contains(document.body.querySelector('.e-rte-quick-toolbar')) || item.command !== 'Images') {
            return;
        }
        let range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
        let selectNodeEle: Node[] = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
        selectNodeEle = (selectNodeEle[0].nodeName === 'IMG') ? selectNodeEle : [this.imgEle];
        let args: IImageNotifyArgs = { args: e, selectNode: selectNodeEle };
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        switch (item.subCommand) {
            case 'JustifyLeft':
                this.justifyImageLeft(args);
                break;
            case 'JustifyCenter':
                this.justifyImageCenter(args);
                break;
            case 'JustifyRight':
                this.justifyImageRight(args);
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
        let items: NodeListOf<Element> = this.quickToolObj.imageQTBar.toolbarElement.querySelectorAll('.e-toolbar-item');
        for (let i: number = 0; i < items.length; i++) {
            if (items[i].getAttribute('title') === this.i10n.getConstant('openLink') ||
                items[i].getAttribute('title') === this.i10n.getConstant('editLink') ||
                items[i].getAttribute('title') === this.i10n.getConstant('removeLink')) {
                addClass([items[i]], 'e-link-groups');
                (items[i] as HTMLElement).style.display = 'none';
            } else if (items[i].getAttribute('title') === 'Insert Link') {
                (items[i] as HTMLElement).style.display = '';
            } else if (items[i].classList.contains('e-rte-horizontal-separator')) {
                separator = items[i] as HTMLElement;
                detach(items[i]);
            }
        }
        let newItems: NodeListOf<Element> = this.quickToolObj.imageQTBar.toolbarElement.querySelectorAll(
            '.e-toolbar-item:not(.e-link-groups)');
        this.quickToolObj.imageQTBar.addQTBarItem(['-'], Math.round(newItems.length / 2));
    }

    private showImageQuickToolbar(e: IShowPopupArgs): void {
        if (e.type !== 'Images' || isNullOrUndefined(this.parent.quickToolbarModule)
            || isNullOrUndefined(this.parent.quickToolbarModule.imageQTBar)) { return; }
        this.quickToolObj = this.parent.quickToolbarModule;
        let args: MouseEvent = e.args as MouseEvent;
        let target: HTMLElement;
        [].forEach.call(e.elements, (element: Element, index: number) => {
            if (index === 0) {
                target = <HTMLElement>element;
            }
        });
        if (target && !closest(target, 'a')) {
            this.imageWithLinkQTBarItemUpdate();
        }
        if (target.nodeName === 'IMG') { addClass([target], ['e-img-focus']); }
        let pageY: number = (this.parent.iframeSettings.enable) ? window.pageYOffset +
            this.parent.element.getBoundingClientRect().top + args.clientY : args.pageY;
        if (this.parent.quickToolbarModule.imageQTBar) {
            if (e.isNotify) {
                setTimeout(() => { this.quickToolObj.imageQTBar.showPopup(args.pageX, pageY, target as Element); }, 400);
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
        let args: MouseEvent = e.args as MouseEvent;
        if (args.which === 2 || args.which === 3) { return; }
        if (this.parent.editorMode === 'HTML' && this.parent.quickToolbarModule && this.parent.quickToolbarModule.imageQTBar) {
            this.quickToolObj = this.parent.quickToolbarModule;
            let target: HTMLElement = args.target as HTMLElement;
            this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
            let isPopupOpen: boolean = this.quickToolObj.imageQTBar.element.classList.contains('e-rte-pop');
            if (target.nodeName === 'IMG' && this.parent.quickToolbarModule) {
                if (isPopupOpen) { return; }
                this.parent.formatter.editorManager.nodeSelection.Clear(this.contentModule.getDocument());
                this.parent.formatter.editorManager.nodeSelection.setSelectionContents(this.contentModule.getDocument(), target);
                addClass([target], 'e-img-focus');
                let items: NodeListOf<Element> = this.quickToolObj.imageQTBar.toolbarElement.querySelectorAll('.e-toolbar-item');
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
                            separator = items[i] as HTMLElement;
                            detach(items[i]);
                        }
                    }
                    let newItems: NodeListOf<Element> = this.quickToolObj.imageQTBar.toolbarElement.querySelectorAll(
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
            let linkWrap: HTMLElement = this.parent.createElement('div', { className: 'e-img-linkwrap' });
            let linkUrl: string = this.i10n.getConstant('linkurl');
            let content: string = '<div class="e-rte-field">' +
                '<input type="text" data-role ="none" class="e-input e-img-link" spellcheck="false" placeholder="' + linkUrl + '"/></div>' +
                '<div class="e-rte-label"></div>' + '<div class="e-rte-field">' +
                '<input type="checkbox" class="e-rte-linkTarget"  data-role ="none"></div>';
            let contentElem: DocumentFragment = document.createRange().createContextualFragment(content);
            linkWrap.appendChild(contentElem);
            let linkTarget: HTMLInputElement = linkWrap.querySelector('.e-rte-linkTarget') as HTMLInputElement;
            let inputLink: HTMLElement = linkWrap.querySelector('.e-img-link') as HTMLElement;
            let target: string = '';
            let linkOpenLabel: string = this.i10n.getConstant('linkOpenInNewWindow');
            this.checkBoxObj = new CheckBox({
                label: linkOpenLabel, checked: true, enableRtl: this.parent.enableRtl, change: (e: ChangeEventArgs) => {
                    if (e.checked) {
                        target = '_blank';
                    } else {
                        target = '';
                    }
                }
            });
            this.checkBoxObj.createElement = this.parent.createElement;
            this.checkBoxObj.appendTo(linkTarget);
            let linkUpdate: string = this.i10n.getConstant('dialogUpdate');
            let linkargs: IImageNotifyArgs = {
                selfImage: this, selection: e.selection,
                selectNode: e.selectNode, selectParent: e.selectParent, link: inputLink, target: target
            };
            this.dialogObj.setProperties({
                height: 'initial', width: '290px', header: 'Insert Link', content: linkWrap, position: { X: 'center', Y: 'center' },
                buttons: [{
                    click: (e: MouseEvent) => { this.insertlink(linkargs); },
                    buttonModel: {
                        content: linkUpdate, cssClass: 'e-flat e-update-link', isPrimary: true
                    }
                }]
            });
            if (!isNullOrUndefined(inputDetails)) {
                (inputLink as HTMLInputElement).value = inputDetails.url;
                (inputDetails.target) ? this.checkBoxObj.checked = true : this.checkBoxObj.checked = false;
                this.dialogObj.header = inputDetails.header;
            }
            this.dialogObj.element.style.maxHeight = 'none';
            (this.dialogObj.content as HTMLElement).querySelector('input').focus();
        }
    }

    private insertAltText(e: IImageNotifyArgs): void {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        this.imagDialog(e);
        let altText: string = this.i10n.getConstant('altText');
        if (!isNullOrUndefined(this.dialogObj)) {
            let altWrap: HTMLElement = this.parent.createElement('div', { className: 'e-img-altwrap' });
            let altHeader: string = this.i10n.getConstant('alternateHeader');
            let linkUpdate: string = this.i10n.getConstant('dialogUpdate');
            let getAlt: string = ((e.selectNode[0] as HTMLElement).getAttribute('alt') === null) ? '' :
                (e.selectNode[0] as HTMLElement).getAttribute('alt');
            let content: string = '<div class="e-rte-field">' +
                '<input type="text" spellcheck="false" value="' + getAlt + '" class="e-input e-img-alt" placeholder="' + altText + '"/>' +
                '</div>';
            let contentElem: DocumentFragment = document.createRange().createContextualFragment(content);
            altWrap.appendChild(contentElem);
            let inputAlt: HTMLElement = altWrap.querySelector('.e-img-alt') as HTMLElement;
            let altArgs: IImageNotifyArgs = { selfImage: this, selection: e.selection, selectNode: e.selectNode, alt: inputAlt };
            this.dialogObj.setProperties({
                height: 'initial', width: '290px', header: altHeader, content: altWrap, position: { X: 'center', Y: 'center' },
                buttons: [{
                    click: (e: MouseEvent) => { this.insertAlt(altArgs); },
                    buttonModel: {
                        content: linkUpdate, cssClass: 'e-flat e-update-alt', isPrimary: true
                    }
                }]
            });
            this.dialogObj.element.style.maxHeight = 'none';
            (this.dialogObj.content as HTMLElement).querySelector('input').focus();
        }
    }

    private insertAlt(e: IImageNotifyArgs): void {
        if (!isNullOrUndefined(e.alt)) {
            e.selection.restore();
            if (this.parent.formatter.getUndoRedoStack().length === 0) {
                this.parent.formatter.saveData();
            }
            let altText: string = (e.alt as HTMLInputElement).value;
            (e.selectNode[0] as HTMLElement).setAttribute('alt', altText);
            this.dialogObj.hide({ returnValue: false } as Event);
            this.parent.formatter.saveData();
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
        e.selection.restore();
        if (e.selfImage.parent.formatter.getUndoRedoStack().length === 0) {
            e.selfImage.parent.formatter.saveData();
        }
        if (e.selectNode[0].parentElement.nodeName === 'A') {
            (e.selectNode[0].parentElement as HTMLAnchorElement).href = url;
            (e.selectNode[0].parentElement as HTMLAnchorElement).target = e.target;
            e.selfImage.parent.formatter.saveData();
            e.selfImage.dialogObj.hide({ returnValue: true } as Event);
            return;
        }
        let anchor: HTMLElement = this.parent.createElement('a', {
            attrs: {
                href: url,
                target: '_blank'
            }
        });
        anchor.appendChild(e.selectNode[0]);
        InsertHtml.Insert(this.contentModule.getDocument(), anchor);
        e.selfImage.parent.formatter.saveData();
        e.selfImage.dialogObj.hide({ returnValue: false } as Event);
    }
    private isUrl(url: string): boolean {
        let regexp: RegExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi;
        return regexp.test(url);
    }
    private deleteImg(e: IImageNotifyArgs): void {
        let selectNode: HTMLElement = e.selectNode[0] as HTMLElement;
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        e.selection.restore();
        if (closest(selectNode, 'a')) {
            detach(closest(selectNode, 'a'));
        } else if (!isNullOrUndefined(closest(selectNode, '.' + classes.CLS_CAPTION))) {
            detach(closest(selectNode, '.' + classes.CLS_CAPTION));
        } else {
            detach(selectNode);
        }
        if (this.quickToolObj && document.body.contains(this.quickToolObj.imageQTBar.element)) {
            this.quickToolObj.imageQTBar.hidePopup();
        }
        this.cancelResizeAction();
        this.parent.formatter.saveData();
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
        if (!isNullOrUndefined(closest(selectNode, '.' + classes.CLS_CAPTION))) {
            detach(closest(selectNode, '.' + classes.CLS_CAPTION));
            if (selectNode.parentElement.tagName === 'A') {
                InsertHtml.Insert(this.contentModule.getDocument(), selectNode.parentElement);
            } else {
                InsertHtml.Insert(this.contentModule.getDocument(), selectNode);
            }
        } else {
            this.captionEle = this.parent.createElement('span', {
                className: classes.CLS_CAPTION,
                attrs: { contenteditable: 'false', draggable: 'false' }
            });
            let imgWrap: HTMLElement = this.parent.createElement('span', { className: 'e-img-wrap' });
            let imgInner: HTMLElement = this.parent.createElement('span', { className: 'e-img-inner', attrs: { contenteditable: 'true' } });
            imgWrap.appendChild(e.selectNode[0]);
            imgWrap.appendChild(imgInner);
            let imgCaption: string = this.i10n.getConstant('imageCaption');
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
            InsertHtml.Insert(this.contentModule.getDocument(), this.captionEle);
            this.parent.formatter.editorManager.nodeSelection.setSelectionText(
                this.contentModule.getDocument(),
                imgInner.childNodes[0], imgInner.childNodes[0], 0, imgInner.childNodes[0].textContent.length);
        }
        this.parent.formatter.saveData();
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
            let imgSizeHeader: string = this.i10n.getConstant('imageSizeHeader');
            let linkUpdate: string = this.i10n.getConstant('dialogUpdate');
            let dialogContent: HTMLElement = this.imgsizeInput(e);
            let selectObj: IImageNotifyArgs = { selfImage: this, selection: e.selection, selectNode: e.selectNode };
            this.dialogObj.setProperties({
                height: 'initial', width: '290px', header: imgSizeHeader, content: dialogContent, position: { X: 'center', Y: 'center' },
                buttons: [{
                    click: this.insertSize.bind(selectObj),
                    buttonModel: {
                        content: linkUpdate, cssClass: 'e-flat e-update-size', isPrimary: true
                    }
                }]
            });
            this.dialogObj.element.style.maxHeight = 'none';
            (this.dialogObj.content as HTMLElement).querySelector('input').focus();
        }
    }
    private break(e: IImageNotifyArgs): void {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        let selectNode: HTMLElement = e.selectNode[0] as HTMLElement;
        selectNode.removeAttribute('class');
        addClass([selectNode], classes.CLS_IMGBREAK);
        addClass([selectNode], 'e-rte-image');
        if (!isNullOrUndefined(closest(selectNode, '.' + classes.CLS_CAPTION))) {
            removeClass([closest(selectNode, '.' + classes.CLS_CAPTION)], classes.CLS_CAPINLINE);
            removeClass([closest(selectNode, '.' + classes.CLS_CAPTION)], classes.CLS_IMGCENTER);
            removeClass([closest(selectNode, '.' + classes.CLS_CAPTION)], classes.CLS_IMGLEFT);
            removeClass([closest(selectNode, '.' + classes.CLS_CAPTION)], classes.CLS_IMGRIGHT);
            addClass([closest(selectNode, '.' + classes.CLS_CAPTION)], classes.CLS_IMGBREAK);
        }
        this.parent.formatter.saveData();
    }
    private inline(e: IImageNotifyArgs): void {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        let selectNode: HTMLElement = e.selectNode[0] as HTMLElement;
        selectNode.removeAttribute('class');
        addClass([selectNode], 'e-rte-image');
        addClass([selectNode], classes.CLS_IMGINLINE);
        if (!isNullOrUndefined(closest(selectNode, '.' + classes.CLS_CAPTION))) {
            removeClass([closest(selectNode, '.' + classes.CLS_CAPTION)], classes.CLS_IMGBREAK);
            removeClass([closest(selectNode, '.' + classes.CLS_CAPTION)], classes.CLS_IMGCENTER);
            removeClass([closest(selectNode, '.' + classes.CLS_CAPTION)], classes.CLS_IMGLEFT);
            removeClass([closest(selectNode, '.' + classes.CLS_CAPTION)], classes.CLS_IMGRIGHT);
            addClass([closest(selectNode, '.' + classes.CLS_CAPTION)], classes.CLS_CAPINLINE);
        }
        this.parent.formatter.saveData();
    }

    private justifyImageLeft(e: IImageNotifyArgs): void {
        let selectNode: HTMLElement = e.selectNode[0] as HTMLElement;
        selectNode.removeAttribute('class');
        addClass([selectNode], 'e-rte-image');
        if (!isNullOrUndefined(closest(selectNode, '.' + classes.CLS_CAPTION))) {
            removeClass([closest(selectNode, '.' + classes.CLS_CAPTION)], classes.CLS_IMGRIGHT);
            addClass([closest(selectNode, '.' + classes.CLS_CAPTION)], classes.CLS_IMGLEFT);
        }
        if (selectNode.parentElement.nodeName === 'A') {
            removeClass([selectNode.parentElement], classes.CLS_IMGRIGHT);
            addClass([selectNode.parentElement], classes.CLS_IMGLEFT);
        } else {
            addClass([selectNode], classes.CLS_IMGLEFT);
        }
        this.parent.formatter.saveData();
    }
    private justifyImageRight(e: IImageNotifyArgs): void {
        let selectNode: HTMLElement = e.selectNode[0] as HTMLElement;
        selectNode.removeAttribute('class');
        addClass([selectNode], 'e-rte-image');
        if (!isNullOrUndefined(closest(selectNode, '.' + classes.CLS_CAPTION))) {
            removeClass([closest(selectNode, '.' + classes.CLS_CAPTION)], classes.CLS_IMGLEFT);
            addClass([closest(selectNode, '.' + classes.CLS_CAPTION)], classes.CLS_IMGRIGHT);
        }
        if (selectNode.parentElement.nodeName === 'A') {
            removeClass([selectNode.parentElement], classes.CLS_IMGLEFT);
            addClass([selectNode.parentElement], classes.CLS_IMGRIGHT);
        } else {
            addClass([selectNode], classes.CLS_IMGRIGHT);
        }
        this.parent.formatter.saveData();
    }
    private justifyImageCenter(e: IImageNotifyArgs): void {
        let selectNode: HTMLElement = e.selectNode[0] as HTMLElement;
        selectNode.removeAttribute('class');
        addClass([selectNode], 'e-rte-image');
        if (!isNullOrUndefined(closest(selectNode, '.' + classes.CLS_CAPTION))) {
            removeClass([closest(selectNode, '.' + classes.CLS_CAPTION)], classes.CLS_IMGLEFT);
            removeClass([closest(selectNode, '.' + classes.CLS_CAPTION)], classes.CLS_IMGRIGHT);
            addClass([closest(selectNode, '.' + classes.CLS_CAPTION)], classes.CLS_IMGCENTER);
        }
        if (selectNode.parentElement.nodeName === 'A') {
            removeClass([selectNode.parentElement], classes.CLS_IMGLEFT);
            removeClass([selectNode.parentElement], classes.CLS_IMGRIGHT);
            addClass([selectNode.parentElement], classes.CLS_IMGCENTER);
        } else {
            addClass([selectNode], classes.CLS_IMGCENTER);
        }
        this.parent.formatter.saveData();
    }
    private imagDialog(e: IImageNotifyArgs): void {
        if (this.dialogObj) {
            this.dialogObj.hide({ returnValue: true } as Event);
            return;
        }
        let imgDialog: HTMLElement = this.parent.createElement('div', { className: 'e-rte-img-dialog', id: this.rteID + '_image' });
        this.parent.element.appendChild(imgDialog);
        let imgInsert: string = this.i10n.getConstant('dialogInsert');
        let imglinkCancel: string = this.i10n.getConstant('dialogCancel');
        let imgHeader: string = this.i10n.getConstant('imageHeader');
        let selection: NodeSelection = e.selection;
        let selectObj: IImageNotifyArgs = { selfImage: this, selection: e.selection, args: e.args };
        this.dialogObj = new Dialog({
            header: imgHeader,
            cssClass: classes.CLS_RTE_ELEMENTS,
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            showCloseIcon: true, closeOnEscape: true, width: (Browser.isDevice) ? '290px' : '340px', height: 'initial',
            position: { X: 'center', Y: (Browser.isDevice) ? 'center' : 'top' },
            isModal: (Browser.isDevice as boolean),
            buttons: [{
                click: this.insertImageUrl.bind(selectObj),
                buttonModel: { content: imgInsert, cssClass: 'e-flat e-insertImage', isPrimary: true }
            },
            {
                click: (e: MouseEvent) => { this.cancelDialog(e); },
                buttonModel: { cssClass: 'e-flat e-cancel', content: imglinkCancel }
            }],
            target: (Browser.isDevice) ? document.body : this.parent.element,
            animationSettings: { effect: 'None' },
            close: (event: { [key: string]: object }) => {
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
                this.dialogObj = null;
            },
        });
        this.dialogObj.createElement = this.parent.createElement;
        this.dialogObj.appendTo(imgDialog);
        imgDialog.style.maxHeight = 'none';
        if (this.quickToolObj) {
            if (this.quickToolObj.imageQTBar && document.body.contains(this.quickToolObj.imageQTBar.element)) {
                this.quickToolObj.imageQTBar.hidePopup();
                if (!isNullOrUndefined(e.selectParent as Node[])) { removeClass([e.selectParent[0] as HTMLElement], 'e-img-focus'); }
            }
            if (this.quickToolObj.inlineQTBar && document.body.contains(this.quickToolObj.inlineQTBar.element)) {
                this.quickToolObj.inlineQTBar.hidePopup();
            }
        }
    }

    private cancelDialog(e: MouseEvent): void {
        this.parent.isBlur = false;
        this.dialogObj.hide({ returnValue: true } as Event);
    }

    private onDocumentClick(e: MouseEvent): void {
        let target: HTMLElement = <HTMLElement>e.target;
        if (target.nodeName === 'IMG') { this.imgEle = target as HTMLImageElement; }
        if (!isNullOrUndefined(this.dialogObj) && ((
            !closest(target, '#' + this.dialogObj.element.id) && this.parent.toolbarSettings.enable && this.parent.getToolbarElement() &&
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
        if (target.tagName !== 'IMG' && this.contentModule.getEditPanel().querySelector('.e-img-resize')) {
            this.remvoeResizEle();
            this.contentModule.getEditPanel().querySelector('img').style.outline = '';
        }
    }

    private remvoeResizEle(): void {
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchEndEvent, this.resizeEnd);
        detach(this.contentModule.getEditPanel().querySelector('.e-img-resize'));
    }

    private imageUrlPopup(e: IImageNotifyArgs): HTMLElement {
        let imgUrl: HTMLElement = this.parent.createElement('div', { className: 'imgUrl' });
        let placeUrl: string = this.i10n.getConstant('imageUrl');
        this.inputUrl = this.parent.createElement('input', {
            className: 'e-input e-img-url',
            attrs: { placeholder: placeUrl, spellcheck: 'false' }
        });
        imgUrl.appendChild(this.inputUrl);
        return imgUrl;
    }

    private insertImageUrl(e: MouseEvent): void {
        let proxy: Image = (this as IImageNotifyArgs).selfImage;
        let url: string = (proxy.inputUrl as HTMLInputElement).value;
        if (proxy.parent.formatter.getUndoRedoStack().length === 0) {
            proxy.parent.formatter.saveData();
        }
        if (!isNullOrUndefined(proxy.uploadUrl) && proxy.uploadUrl.url !== '') {
            proxy.uploadUrl.cssClass = (proxy.parent.insertImageSettings.display === 'inline' ?
                classes.CLS_IMGINLINE : classes.CLS_IMGBREAK);
            proxy.parent.formatter.process(
                proxy.parent, (this as IImageNotifyArgs).args,
                ((this as IImageNotifyArgs).args as ClickEventArgs).originalEvent, proxy.uploadUrl);
            proxy.dialogObj.hide({ returnValue: false } as Event);
            proxy.uploadUrl.url = '';
        } else if (url !== '') {
            if (proxy.parent.editorMode === 'HTML' && isNullOrUndefined(
                closest(
                    (this as IImageNotifyArgs).selection.range.startContainer.parentNode, '#' + proxy.contentModule.getPanel().id))) {
                (proxy.contentModule.getEditPanel() as HTMLElement).focus();
                let range: Range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.contentModule.getDocument());
                (this as IImageNotifyArgs).selection = proxy.parent.formatter.editorManager.nodeSelection.save(
                    range, proxy.contentModule.getDocument());
                (this as IImageNotifyArgs).selectParent = proxy.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            }
            let regex: RegExp = /[\w-]+.(jpg|png|jpeg|gif)/g;
            let matchUrl: string = (!isNullOrUndefined(url.match(regex)) && proxy.parent.editorMode === 'HTML') ? url.match(regex)[0] : '';
            let value: IImageCommandsArgs = {
                cssClass: (proxy.parent.insertImageSettings.display === 'inline' ? classes.CLS_IMGINLINE : classes.CLS_IMGBREAK),
                url: url, selection: (this as IImageNotifyArgs).selection, altText: matchUrl,
                selectParent: (this as IImageNotifyArgs).selectParent, width: {
                    width: proxy.parent.insertImageSettings.width, minWidth: proxy.parent.insertImageSettings.minWidth,
                    maxWidth: proxy.parent.insertImageSettings.maxWidth
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
        let selectNode: HTMLImageElement = (e as IImageNotifyArgs).selectNode[0] as HTMLImageElement;
        let imgHeight: string = this.i10n.getConstant('imageHeight');
        let imgWidth: string = this.i10n.getConstant('imageWidth');
        let imgSizeWrap: HTMLElement = this.parent.createElement('div', { className: 'e-img-sizewrap' });
        let widthVal: string | number = (selectNode.getAttribute('width') === 'auto' ||
            isNullOrUndefined(selectNode.getAttribute('width'))) ? selectNode.width : selectNode.getClientRects()[0].width;
        let heightVal: string | number = (selectNode.getAttribute('height') === 'auto' ||
            isNullOrUndefined(selectNode.getAttribute('height'))) ? selectNode.height : selectNode.getClientRects()[0].height;
        let content: string = '<div class="e-rte-label"><label>' + imgWidth +
            '</label></div><div class="e-rte-field"><input type="text" data-role ="none" id="imgwidth" class="e-img-width" value=' +
            widthVal
            + ' /></div>' +
            '<div class="e-rte-label">' + '<label>' + imgHeight + '</label></div><div class="e-rte-field"> ' +
            '<input type="text" data-role ="none" id="imgheight" class="e-img-height" value=' +
            heightVal
            + ' /></div>';
        let contentElem: DocumentFragment = document.createRange().createContextualFragment(content);
        imgSizeWrap.appendChild(contentElem);
        let widthNum: NumericTextBox = new NumericTextBox({
            format: '###.### px', min: this.parent.insertImageSettings.minWidth as number,
            max: this.parent.insertImageSettings.maxWidth as number,
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        widthNum.createElement = this.parent.createElement;
        widthNum.appendTo(imgSizeWrap.querySelector('#imgwidth') as HTMLElement);
        let heightNum: NumericTextBox = new NumericTextBox({
            format: '###.### px', min: this.parent.insertImageSettings.minHeight as number,
            max: this.parent.insertImageSettings.maxHeight as number,
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        heightNum.createElement = this.parent.createElement;
        heightNum.appendTo(imgSizeWrap.querySelector('#imgheight') as HTMLElement);
        return imgSizeWrap;
    }

    private insertSize(e: MouseEvent): void {
        let selectNode: HTMLImageElement = (this as IImageNotifyArgs).selectNode[0] as HTMLImageElement;
        (this as IImageNotifyArgs).selection.restore();
        if ((this as IImageNotifyArgs).selfImage.parent.formatter.getUndoRedoStack().length === 0) {
            (this as IImageNotifyArgs).selfImage.parent.formatter.saveData();
        }
        let dialogEle: Element = (this as IImageNotifyArgs).selfImage.dialogObj.element;
        selectNode.style.height = '';
        selectNode.style.width = '';
        selectNode.width = parseFloat((dialogEle.querySelector('.e-img-width') as HTMLInputElement).value);
        selectNode.height = parseFloat((dialogEle.parentElement.querySelector('.e-img-height') as HTMLInputElement).value);
        if (this.imgResizeDiv) { (this as IImageNotifyArgs).selfImage.imgResizePos(selectNode, this.imgResizeDiv); }
        (this as IImageNotifyArgs).selfImage.dialogObj.hide({ returnValue: true } as Event);
        (this as IImageNotifyArgs).selfImage.parent.formatter.saveData();
    }

    private insertImage(e: IImageNotifyArgs): void {
        this.imagDialog(e);
        if (!isNullOrUndefined(this.dialogObj)) {
            let dialogContent: HTMLElement = this.parent.createElement('div', { className: 'e-img-content' });
            if ((!isNullOrUndefined(this.parent.insertImageSettings.path) && this.parent.editorMode === 'Markdown')
                || this.parent.editorMode === 'HTML') {
                dialogContent.appendChild(this.imgUpload(e));
            }
            let linkHeader: HTMLElement = this.parent.createElement('div', { className: 'e-linkheader' });
            let linkHeaderText: string = this.i10n.getConstant('imageLinkHeader');
            if (this.parent.editorMode === 'HTML') {
                linkHeader.innerHTML = linkHeaderText;
            } else {
                linkHeader.innerHTML = this.i10n.getConstant('mdimageLink');
            }
            dialogContent.appendChild(linkHeader);
            dialogContent.appendChild(this.imageUrlPopup(e));
            if (e.selectNode && e.selectNode[0].nodeName === 'IMG') {
                this.dialogObj.setProperties({ header: 'Edit Image', content: dialogContent }, false);
                this.dialogObj.element.querySelector('.e-insertImage').textContent = 'Update';
            } else {
                this.dialogObj.setProperties({ content: dialogContent }, false);
            }
            this.dialogObj.element.style.maxHeight = 'none';
            if ((!isNullOrUndefined(this.parent.insertImageSettings.path) && this.parent.editorMode === 'Markdown')
                || this.parent.editorMode === 'HTML') {
                (dialogContent.querySelector('#' + this.rteID + '_insertImage') as HTMLElement).focus();
            } else {
                (dialogContent.querySelector('.e-img-url') as HTMLElement).focus();
            }
        }
    }

    private imgUpload(e: IImageNotifyArgs): HTMLElement {
        let save: NodeSelection;
        let selectParent: Node[];
        let proxy: this = this;
        if (proxy.parent.editorMode === 'HTML' &&
            isNullOrUndefined(closest(e.selection.range.startContainer.parentNode, '#' + this.contentModule.getPanel().id))) {
            (this.contentModule.getEditPanel() as HTMLElement).focus();
            let range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            save = this.parent.formatter.editorManager.nodeSelection.save(
                range, this.parent.contentModule.getDocument());
            selectParent = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
        } else {
            save = e.selection;
            selectParent = e.selectParent;
        }
        let uploadParentEle: HTMLElement = this.parent.createElement('div', { className: 'e-img-uploadwrap e-droparea' });
        let deviceImgUpMsg: string = this.i10n.getConstant('imageDeviceUploadMessage');
        let imgUpMsg: string = this.i10n.getConstant('imageUploadMessage');
        let span: HTMLElement = this.parent.createElement('span', { className: 'e-droptext' });
        span.innerHTML = (Browser.isDevice) ? deviceImgUpMsg : imgUpMsg;
        let btnEle: HTMLElement = this.parent.createElement('button', {
            className: 'e-browsebtn', id: this.rteID + '_insertImage',
            attrs: { autofocus: 'true', type: 'button' }
        });
        span.appendChild(btnEle);
        uploadParentEle.appendChild(span);
        let browserMsg: string = this.i10n.getConstant('browse');
        let button: Button = new Button({ content: browserMsg, enableRtl: this.parent.enableRtl });
        button.createElement = this.parent.createElement;
        button.appendTo(btnEle);
        let btnClick: HTMLElement = (Browser.isDevice) ? span : btnEle;
        EventHandler.add(btnClick, 'click', this.fileSelect, this);
        let uploadEle: HTMLInputElement | HTMLElement = this.parent.createElement('input', {
            id: this.rteID + '_upload', attrs: { type: 'File', name: 'UploadFiles' }
        });
        uploadParentEle.appendChild(uploadEle);
        let altText: string;
        this.uploadObj = new Uploader({
            asyncSettings: {
                saveUrl: this.parent.insertImageSettings.saveUrl,
            },
            dropArea: span,
            multiple: false,
            enableRtl: this.parent.enableRtl,
            allowedExtensions: this.parent.insertImageSettings.allowedTypes.toString(),
            selected: (e: SelectedEventArgs) => {
                altText = e.filesData[0].name;
                if (this.parent.editorMode === 'HTML' && isNullOrUndefined(this.parent.insertImageSettings.path)) {
                    let reader: FileReader = new FileReader();
                    reader.addEventListener('load', (e: MouseEvent) => {
                        let url: string = URL.createObjectURL(proxy.url(reader.result as string));
                        proxy.uploadUrl = {
                            url: url, selection: save, altText: altText, selectParent: selectParent,
                            width: {
                                width: proxy.parent.insertImageSettings.width, minWidth: proxy.parent.insertImageSettings.minWidth,
                                maxWidth: proxy.parent.insertImageSettings.maxWidth
                            },
                            height: {
                                height: proxy.parent.insertImageSettings.height, minHeight: proxy.parent.insertImageSettings.minHeight,
                                maxHeight: proxy.parent.insertImageSettings.maxHeight
                            }
                        };
                        proxy.inputUrl.setAttribute('disabled', 'true');
                    });
                    reader.readAsDataURL(e.filesData[0].rawFile as Blob);
                }
            },
            success: (e: Object) => {
                if (!isNullOrUndefined(this.parent.insertImageSettings.path)) {
                    let url: string = this.parent.insertImageSettings.path + (e as MetaData).file.name;
                    let value: IImageCommandsArgs = { url: url, selection: save };
                    proxy.uploadUrl = {
                        url: url, selection: save, altText: altText, selectParent: selectParent,
                        width: {
                            width: proxy.parent.insertImageSettings.width, minWidth: proxy.parent.insertImageSettings.minWidth,
                            maxWidth: proxy.parent.insertImageSettings.maxWidth
                        },
                        height: {
                            height: proxy.parent.insertImageSettings.height, minHeight: proxy.parent.insertImageSettings.minHeight,
                            maxHeight: proxy.parent.insertImageSettings.maxHeight
                        }
                    };
                    proxy.inputUrl.setAttribute('disabled', 'true');
                }
            },
            removing: () => {
                proxy.inputUrl.removeAttribute('disabled');
                proxy.uploadUrl.url = '';
            }
        });
        this.uploadObj.createElement = this.parent.createElement;
        this.uploadObj.appendTo(uploadEle);
        return uploadParentEle;
    }
    private fileSelect(): boolean {
        document.body.getElementsByClassName('e-file-select-wrap')[0].querySelector('button').click();
        return false;
    }
    private imagePaste(args: NotifyArgs): void {
        let proxy: Image = this;
        let reader: FileReader = new FileReader();
        reader.addEventListener('load', (e: MouseEvent) => {
            let url: IImageCommandsArgs = {
                cssClass: (proxy.parent.insertImageSettings.display === 'inline' ? classes.CLS_IMGINLINE : classes.CLS_IMGBREAK),
                url: URL.createObjectURL(proxy.url(reader.result as string)),
                width: {
                    width: proxy.parent.insertImageSettings.width, minWidth: proxy.parent.insertImageSettings.minWidth,
                    maxWidth: proxy.parent.insertImageSettings.maxWidth
                },
                height: {
                    height: proxy.parent.insertImageSettings.height, minHeight: proxy.parent.insertImageSettings.minHeight,
                    maxHeight: proxy.parent.insertImageSettings.maxHeight
                }
            };
            proxy.parent.formatter.process(proxy.parent, { item: { command: 'Images', subCommand: 'Image' } }, args.args, url);
        });
        reader.readAsDataURL((args as NotifyArgs).file);
    }
    private url(dataurl: string): Blob {
        let arr: string[] = dataurl.split(',');
        let mime: string = arr[0].match(/:(.*?);/)[1];
        let bstr: string = atob(arr[1]);
        let n: number = bstr.length;
        let u8arr: Uint8Array = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        this.removeEventListener();
    }
    /**
     * For internal use only - Get the module name.
     */
    private getModuleName(): string {
        return 'image';
    }
}