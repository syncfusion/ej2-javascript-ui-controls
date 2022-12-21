import { addClass, detach, EventHandler, L10n, isNullOrUndefined, KeyboardEventArgs, Ajax, formatUnit } from '@syncfusion/ej2-base';
import { Browser, closest, removeClass, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import {
    IVideoCommandsArgs, IRenderer, IDropDownItemModel, IToolbarItemModel, OffsetPosition, AfterMediaDeleteEventArgs, ImageUploadingEventArgs
} from '../base/interface';
import { IRichTextEditor, IImageNotifyArgs, NotifyArgs, IShowPopupArgs, ResizeArgs } from '../base/interface';
import * as events from '../base/constant';
import * as classes from '../base/classes';
import { ServiceLocator } from '../services/service-locator';
import { NodeSelection } from '../../selection/selection';
import { Uploader, SelectedEventArgs, MetaData, TextBox, InputEventArgs, FileInfo, BeforeUploadEventArgs } from '@syncfusion/ej2-inputs';
import { RemovingEventArgs, UploadingEventArgs, ProgressEventArgs } from '@syncfusion/ej2-inputs';
import { Dialog, DialogModel } from '@syncfusion/ej2-popups';
import { Button, RadioButton } from '@syncfusion/ej2-buttons';
import { RendererFactory } from '../services/renderer-factory';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { RenderType } from '../base/enum';
import { dispatchEvent, parseHtml, hasClass, convertToBlob } from '../base/util';
import { DialogRenderer } from './dialog-renderer';
import { isIDevice } from '../../common/util';

export class Video {
    public element: HTMLElement;
    private rteID: string;
    private parent: IRichTextEditor;
    public dialogObj: Dialog;
    public uploadObj: Uploader;
    private i10n: L10n;
    private inputUrl: HTMLElement;
    private embedInputUrl: HTMLElement;
    private uploadUrl: IVideoCommandsArgs;
    private contentModule: IRenderer;
    private rendererFactory: RendererFactory;
    private quickToolObj: IRenderer;
    private vidResizeDiv: HTMLElement;
    private vidDupPos: { [key: string]: number | string };
    private resizeBtnStat: { [key: string]: boolean };
    private videoEle: HTMLVideoElement | HTMLIFrameElement;
    private prevSelectedVidEle: HTMLVideoElement | HTMLIFrameElement;
    private isVideoUploaded: boolean = false;
    private isAllowedTypes: boolean = true;
    private pageX: number = null;
    private pageY: number = null;
    private dialogRenderObj: DialogRenderer;
    private deletedVid: Node[] = [];
    private changedWidthValue: string;
    private changedHeightValue: string;
    private inputWidthValue: string;
    private inputHeightValue: string;
    private removingVideoName: string;
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
        this.parent.on(events.insertVideo, this.insertingVideo, this);
        this.parent.on(events.initialEnd, this.afterRender, this);
        this.parent.on(events.dynamicModule, this.afterRender, this);
        this.parent.on(events.windowResize, this.onWindowResize, this);
        this.parent.on(events.showVideoDialog, this.showDialog, this);
        this.parent.on(events.closeVideoDialog, this.closeDialog, this);
        this.parent.on(events.dropDownSelect, this.alignmentSelect, this);
        this.parent.on(events.videoDelete, this.deleteVideo, this);
        this.parent.on(events.videoToolbarAction, this.onToolbarAction, this);
        this.parent.on(events.editAreaClick, this.editAreaClickHandler, this);
        this.parent.on(events.iframeMouseDown, this.onIframeMouseDown, this);
        this.parent.on(events.videoSize, this.videoSize, this);
        this.parent.on(events.insertCompleted, this.showVideoQuickToolbar, this);
        this.parent.on(events.clearDialogObj, this.clearDialogObj, this);
        this.parent.on(events.destroy, this.removeEventListener, this);
    }

    protected removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.keyDown, this.onKeyDown);
        this.parent.off(events.keyUp, this.onKeyUp);
        this.parent.off(events.insertVideo, this.insertingVideo);
        this.parent.off(events.windowResize, this.onWindowResize);
        this.parent.off(events.initialEnd, this.afterRender);
        this.parent.off(events.dynamicModule, this.afterRender);
        this.parent.off(events.showVideoDialog, this.showDialog);
        this.parent.off(events.closeVideoDialog, this.closeDialog);
        this.parent.off(events.dropDownSelect, this.alignmentSelect);
        this.parent.off(events.videoDelete, this.deleteVideo);
        this.parent.off(events.videoToolbarAction, this.onToolbarAction);
        this.parent.off(events.editAreaClick, this.editAreaClickHandler);
        this.parent.off(events.iframeMouseDown, this.onIframeMouseDown);
        this.parent.off(events.videoSize, this.videoSize);
        this.parent.off(events.insertCompleted, this.showVideoQuickToolbar);
        this.parent.off(events.clearDialogObj, this.clearDialogObj);
        this.parent.off(events.destroy, this.removeEventListener);
        if (!isNullOrUndefined(this.contentModule)) {
            EventHandler.remove(this.contentModule.getEditPanel(), Browser.touchEndEvent, this.videoClick);
            this.parent.formatter.editorManager.observer.off(events.checkUndo, this.undoStack);
            if (this.parent.insertVideoSettings.resize) {
                EventHandler.remove(this.parent.contentModule.getEditPanel(), Browser.touchStartEvent, this.resizeStart);
                EventHandler.remove(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick);
                EventHandler.remove(this.contentModule.getEditPanel(), 'cut', this.onCutHandler);
            }
        }
    }

    private afterRender(): void {
        this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
        EventHandler.add(this.contentModule.getEditPanel(), Browser.touchEndEvent, this.videoClick, this);
        if (this.parent.insertVideoSettings.resize) {
            EventHandler.add(this.parent.contentModule.getEditPanel(), Browser.touchStartEvent, this.resizeStart, this);
            EventHandler.add(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick, this);
            EventHandler.add(this.contentModule.getEditPanel(), 'cut', this.onCutHandler, this);
        }
    }

    private clearDialogObj(): void {
        if (this.dialogObj) {
            this.dialogObj.destroy();
            detach(this.dialogObj.element);
            this.dialogObj = null;
        }
    }

    // eslint-disable-next-line
    private onKeyUp(event: NotifyArgs): void {
        if (!isNOU(this.deletedVid) && this.deletedVid.length > 0) {
            for (let i: number = 0; i < this.deletedVid.length; i++) {
                const args: AfterMediaDeleteEventArgs = {
                    element: this.deletedVid[i as number],
                    src: (this.deletedVid[i as number] as HTMLElement).tagName !== 'IFRAME' ? (this.deletedVid[i as number] as HTMLVideoElement).querySelector('source').getAttribute('src') :
                        (this.deletedVid[i as number] as HTMLIFrameElement).src
                };
                this.parent.trigger(events.afterMediaDelete, args);
            }
        }
    }

    private undoStack(args?: { [key: string]: string }): void {
        if (args.subCommand.toLowerCase() === 'undo' || args.subCommand.toLowerCase() === 'redo') {
            for (let i: number = 0; i < this.parent.formatter.getUndoRedoStack().length; i++) {
                const temp: Element = this.parent.createElement('div');
                const contentElem: DocumentFragment = parseHtml(this.parent.formatter.getUndoRedoStack()[i as number].text);
                temp.appendChild(contentElem);
                const vid: NodeListOf<HTMLElement> = temp.querySelectorAll('video');
                if (temp.querySelector('.e-vid-resize') && vid.length > 0) {
                    for (let j: number = 0; j < vid.length; j++) {
                        vid[j as number].style.outline = '';
                    }
                    detach(temp.querySelector('.e-vid-resize'));
                    this.parent.formatter.getUndoRedoStack()[i as number].text = temp.innerHTML;
                }
            }
        }
    }

    private onIframeMouseDown(): void {
        if (this.dialogObj) {
            this.dialogObj.hide({ returnValue: true } as Event);
        }
    }

    private videoSize(e: IImageNotifyArgs): void {
        if (e.selectNode[0].nodeName !== 'VIDEO' && !this.isEmbedVidElem((e.selectNode[0] as HTMLElement))) {
            return;
        }
        this.insertVideo(e);
        if (!isNullOrUndefined(this.dialogObj)) {
            const vidSizeHeader: string = this.i10n.getConstant('videoSizeHeader');
            const linkUpdate: string = this.i10n.getConstant('dialogUpdate');
            const dialogContent: HTMLElement = this.vidsizeInput(e);
            const selectObj: IImageNotifyArgs = { args: e.args, selfVideo: this, selection: e.selection, selectNode: e.selectNode };
            this.dialogObj.setProperties({
                height: 'inherit', width: '290px', header: vidSizeHeader, content: dialogContent, position: { X: 'center', Y: 'center' },
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

    private vidsizeInput(e: IImageNotifyArgs): HTMLElement {
        const selectNode: HTMLVideoElement = (e as IImageNotifyArgs).selectNode[0] as HTMLVideoElement;
        const vidHeight: string = this.i10n.getConstant('videoHeight');
        const vidWidth: string = this.i10n.getConstant('videoWidth');
        const vidSizeWrap: HTMLElement = this.parent.createElement('div', { className: 'e-video-sizewrap' });
        const widthVal: string = isNullOrUndefined(this.changedWidthValue) && (selectNode.style.width.toString() === 'auto' ||
            selectNode.style.width !== '') ? selectNode.style.width : !isNullOrUndefined(this.changedWidthValue) ?
                this.changedWidthValue : (parseInt(selectNode.getClientRects()[0].width.toString(), 10)).toString();
        const heightVal: string = isNullOrUndefined(this.changedHeightValue) && (selectNode.style.height.toString() === 'auto' ||
            selectNode.style.height !== '') ? selectNode.style.height : !isNullOrUndefined(this.changedHeightValue) ?
                this.changedHeightValue : (parseInt(selectNode.getClientRects()[0].height.toString(), 10)).toString();
        this.changedWidthValue = null;
        this.changedHeightValue = null;
        const content: string = '<div class="e-rte-label"><label>' + vidWidth +
            '</label></div><div class="e-rte-field"><input type="text" id="vidwidth" class="e-vid-width" value=' +
            widthVal
            + ' /></div>' +
            '<div class="e-rte-label">' + '<label>' + vidHeight + '</label></div><div class="e-rte-field"> ' +
            '<input type="text" id="vidheight" class="e-vid-height" value=' +
            heightVal
            + ' /></div>';
        const contentElem: DocumentFragment = parseHtml(content);
        vidSizeWrap.appendChild(contentElem);
        const widthNum: TextBox = new TextBox({
            value: formatUnit(widthVal as string),
            enableRtl: this.parent.enableRtl,
            input: (e: InputEventArgs) => {
                this.inputWidthValue = formatUnit((e.value));
            }
        });
        widthNum.createElement = this.parent.createElement;
        widthNum.appendTo(vidSizeWrap.querySelector('#vidwidth') as HTMLElement);
        const heightNum: TextBox = new TextBox({
            value: formatUnit(heightVal as string),
            enableRtl: this.parent.enableRtl,
            input: (e: InputEventArgs) => {
                this.inputHeightValue = formatUnit((e.value));
            }
        });
        heightNum.createElement = this.parent.createElement;
        heightNum.appendTo(vidSizeWrap.querySelector('#vidheight') as HTMLElement);
        return vidSizeWrap;
    }

    private insertSize(e: IImageNotifyArgs): void {
        e.selection.restore();
        const proxy: Video = e.selfVideo;
        if (proxy.parent.formatter.getUndoRedoStack().length === 0) {
            proxy.parent.formatter.saveData();
        }
        const dialogEle: Element = proxy.dialogObj.element;
        this.changedWidthValue = this.inputWidthValue;
        this.changedHeightValue = this.inputHeightValue;
        const width: string = (dialogEle.querySelector('.e-vid-width') as HTMLInputElement).value;
        const height: string = (dialogEle.parentElement.querySelector('.e-vid-height') as HTMLInputElement).value;
        proxy.parent.formatter.process(
            this.parent, e.args, e.args,
            {
                width: width, height: height, selectNode: e.selectNode,
                subCommand: ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand
            });
        if (this.vidResizeDiv) {
            e.selectNode[0] = ((e.selectNode[0] as HTMLElement).tagName === 'VIDEO' || (e.selectNode[0] as HTMLElement).tagName === 'IFRAME') ?
                e.selectNode[0] : (e.selectNode[0] as HTMLElement).querySelector('iframe');
            proxy.vidResizePos(e.selectNode[0] as HTMLVideoElement, this.vidResizeDiv);
        }
        proxy.dialogObj.hide({ returnValue: true } as Event);
    }

    private resizeEnd(e: PointerEvent | TouchEvent): void {
        this.resizeBtnInit();
        this.videoEle.parentElement.style.cursor = 'auto';
        if (Browser.isDevice) {
            removeClass([(e.target as HTMLElement).parentElement], 'e-mob-span');
        }
        const args: ResizeArgs = { event: e, requestType: 'videos' };
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
        const target: HTMLElement = ele ? ele as HTMLElement : !this.isEmbedVidElem(e.target as HTMLElement) ? e.target as HTMLElement : (e.target as HTMLElement).querySelector('iframe');
        this.prevSelectedVidEle = this.videoEle;
        if ((target as HTMLElement).tagName === 'VIDEO' || (target as HTMLElement).tagName === 'IFRAME') {
            this.parent.preventDefaultResize(e as MouseEvent);
            const videoElem: HTMLVideoElement = target as HTMLVideoElement;
            if (this.vidResizeDiv && this.contentModule.getEditPanel().contains(this.vidResizeDiv)) {
                detach(this.vidResizeDiv);
            }
            this.videoResize(videoElem);
        }
        if ((target as HTMLElement).classList.contains('e-rte-videoboxmark')) {
            if (this.parent.formatter.getUndoRedoStack().length === 0) {
                this.parent.formatter.saveData();
            }
            this.pageX = this.getPointX(e);
            this.pageY = this.getPointY(e);
            e.preventDefault();
            e.stopImmediatePropagation();
            this.resizeBtnInit();
            if (this.quickToolObj) {
                this.quickToolObj.videoQTBar.hidePopup();
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
            if (Browser.isDevice && this.contentModule.getEditPanel().contains(this.vidResizeDiv) &&
                !this.vidResizeDiv.classList.contains('e-mob-span')) {
                addClass([this.vidResizeDiv], 'e-mob-span');
            } else {
                const args: ResizeArgs = { event: e, requestType: 'videos' };
                this.parent.trigger(events.resizeStart, args, (resizeStartArgs: ResizeArgs) => {
                    if (resizeStartArgs.cancel) {
                        this.cancelResizeAction();
                    }
                });
            }
            EventHandler.add(this.contentModule.getDocument(), Browser.touchEndEvent, this.resizeEnd, this);
        }
    }

    private videoClick(e: MouseEvent): void {
        if (Browser.isDevice) {
            if (((e.target as HTMLElement).tagName === 'VIDEO' || this.isEmbedVidElem((e.target as HTMLElement)))) {
                this.contentModule.getEditPanel().setAttribute('contenteditable', 'false');
                (e.target as HTMLElement).focus();
            } else {
                if (!this.parent.readonly) {
                    this.contentModule.getEditPanel().setAttribute('contenteditable', 'true');
                }
            }
        }
        if ((e.target as HTMLElement).tagName === 'VIDEO' || this.isEmbedVidElem((e.target as HTMLElement))) {
            e.preventDefault();
        }
    }

    private onCutHandler(): void {
        if (this.vidResizeDiv && this.contentModule.getEditPanel().contains(this.vidResizeDiv)) {
            this.cancelResizeAction();
        }
    }

    private videoResize(e: HTMLVideoElement): void {
        this.resizeBtnInit();
        this.videoEle = e;
        addClass([this.videoEle], 'e-resize');
        this.vidResizeDiv = this.parent.createElement('span', { className: 'e-vid-resize', id: this.rteID + '_vidResize' });
        this.vidResizeDiv.appendChild(this.parent.createElement('span', {
            className: 'e-rte-videoboxmark e-rte-topLeft', styles: 'cursor: nwse-resize'
        }));
        this.vidResizeDiv.appendChild(this.parent.createElement('span', {
            className: 'e-rte-videoboxmark e-rte-topRight', styles: 'cursor: nesw-resize'
        }));
        this.vidResizeDiv.appendChild(this.parent.createElement('span', {
            className: 'e-rte-videoboxmark e-rte-botLeft', styles: 'cursor: nesw-resize'
        }));
        this.vidResizeDiv.appendChild(this.parent.createElement('span', {
            className: 'e-rte-videoboxmark e-rte-botRight', styles: 'cursor: nwse-resize'
        }));
        if (Browser.isDevice) {
            addClass([this.vidResizeDiv], 'e-mob-rte');
        }
        e.style.outline = '2px solid #4a90e2';
        this.vidResizePos(e, this.vidResizeDiv);
        this.resizeVidDupPos(e);
        this.contentModule.getEditPanel().appendChild(this.vidResizeDiv);
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

    private vidResizePos(e: HTMLVideoElement | HTMLIFrameElement, vidResizeDiv: HTMLElement): void {
        if (isNullOrUndefined(vidResizeDiv)) { return; }
        const pos: OffsetPosition = this.calcPos(e);
        const top: number = pos.top;
        const left: number = pos.left;
        const vidWid: string | number = e.width !== 0 && e.width !== 'auto' && e.width !== 'NaN' ? e.width : e.getBoundingClientRect().width;
        const vidHgt: string | number = e.height !== 0 && e.height !== 'auto' && e.height !== 'NaN' ? e.height : e.getBoundingClientRect().height;
        const borWid: number = (Browser.isDevice) ? (4 * parseInt((e.style.outline.slice(-3)), 10)) + 2 :
            (2 * parseInt((e.style.outline.slice(-3)), 10)) + 2; //span border width + video outline width
        const devWid: number = ((Browser.isDevice) ? 0 : 2); // span border width
        (vidResizeDiv.querySelector('.e-rte-botLeft') as HTMLElement).style.left = (left - borWid) + 'px';
        (vidResizeDiv.querySelector('.e-rte-botLeft') as HTMLElement).style.top = ((parseInt(vidHgt.toString(), 10) - borWid) + top) + 'px';
        (vidResizeDiv.querySelector('.e-rte-botRight') as HTMLElement).style.left = ((parseInt(vidWid.toString(), 10) - (borWid - devWid)) + left) + 'px';
        (vidResizeDiv.querySelector('.e-rte-botRight') as HTMLElement).style.top = ((parseInt(vidHgt.toString(), 10) - borWid) + top) + 'px';
        (vidResizeDiv.querySelector('.e-rte-topRight') as HTMLElement).style.left = ((parseInt(vidWid.toString(), 10) - (borWid - devWid)) + left) + 'px';
        (vidResizeDiv.querySelector('.e-rte-topRight') as HTMLElement).style.top = (top - (borWid)) + 'px';
        (vidResizeDiv.querySelector('.e-rte-topLeft') as HTMLElement).style.left = (left - borWid) + 'px';
        (vidResizeDiv.querySelector('.e-rte-topLeft') as HTMLElement).style.top = (top - borWid) + 'px';
    }

    private calcPos(elem: HTMLElement): OffsetPosition {
        const ignoreOffset: string[] = ['TD', 'TH', 'TABLE', 'A'];
        let parentOffset: OffsetPosition = { top: 0, left: 0 };
        let elementOffset: OffsetPosition;
        const doc: Document = elem.ownerDocument;
        let offsetParent: Node = ((elem.offsetParent && (elem.offsetParent.classList.contains('e-video-clickelem') ||
        ignoreOffset.indexOf(elem.offsetParent.tagName) > -1)) ? closest(elem, '#' + this.parent.getID() + '_rte-edit-view') : elem.offsetParent) || doc.documentElement;
        while (offsetParent &&
                (offsetParent === doc.body || offsetParent === doc.documentElement) &&
                (<HTMLElement>offsetParent).style.position === 'static') {
            offsetParent = offsetParent.parentNode;
        }
        if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
            parentOffset = (<HTMLElement>offsetParent).getBoundingClientRect();
        }
        if (elem && elem.nodeType === 1 && elem.tagName === 'IFRAME') {
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
    private setAspectRatio(vid: HTMLVideoElement | HTMLIFrameElement, expectedX: number, expectedY: number, e: ResizeArgs): void {
        const vidEleStyle: CSSStyleDeclaration | HTMLIFrameElement = getComputedStyle(vid);
        if (isNullOrUndefined(vidEleStyle)) {
            return;
        }
        // eslint-disable-next-line
        const width: string | number = vidEleStyle.width !== '' ? vidEleStyle.width.match(/^\d+(\.\d*)?%$/g) ? parseFloat(vidEleStyle.width) :
            parseInt(vidEleStyle.width, 10) : vid.style.width !== '' ? vid.style.width : vid.width;
        const height: string | number = vidEleStyle.height !== '' ? parseInt(vidEleStyle.height, 10) : vid.style.height !== '' ? vid.style.height : vid.height;
        if (width > height) {
            vid.style.minWidth = this.parent.insertVideoSettings.minWidth === 0 ? '140px' : formatUnit(this.parent.insertVideoSettings.minWidth);
            vid.style.minHeight = this.parent.insertVideoSettings.minHeight === 0 ? '50px' : formatUnit(this.parent.insertVideoSettings.minHeight);
            if (this.parent.insertVideoSettings.resizeByPercent) {
                if (parseInt('' + vid.getBoundingClientRect().width + '', 10) !== 0 && parseInt('' + width + '', 10) !== 0) {
                    const percentageValue: number = this.pixToPerc(
                        (parseInt(width.toString(), 10) / parseInt(height.toString(), 10) * expectedY),
                        (vid.previousElementSibling || vid.parentElement));
                    vid.style.width = Math.min(
                        Math.round((percentageValue / vid.getBoundingClientRect().width) * expectedX * 100) / 100, 100) + '%';
                } else {
                    vid.style.width = this.pixToPerc(parseInt(width.toString(), 10) / parseInt(height.toString(), 10) * expectedY, (vid.previousElementSibling || vid.parentElement)) + '%';
                }
                vid.style.height = null;
                vid.removeAttribute('height');
            } else if ((vid.style.width === '' && vid.style.height !== '') || (vidEleStyle.width === '' && vidEleStyle.height !== '')) {
                vid.style.height = expectedY + 'px';
            } else if ((vid.style.width !== '' && vid.style.height === '') || (vidEleStyle.width !== '' && vidEleStyle.height === '')) {
                const currentWidth: number = ((parseInt(width.toString(), 10) / parseInt(height.toString(), 10) * expectedY) +
                    parseInt(width.toString(), 10) / parseInt(height.toString(), 10)) <
                    (this.parent.inputElement.getBoundingClientRect().right - 32) ?
                    ((parseInt(width.toString(), 10) / parseInt(height.toString(), 10) * expectedY) +
                    parseInt(width.toString(), 10) / parseInt(height.toString(), 10)) :
                    (this.parent.inputElement.getBoundingClientRect().right - 32);
                vid.style.width = currentWidth.toString() + 'px';
            } else if (vid.style.width !== '' || vidEleStyle.width !== '') {
                const currentWidth: number = (parseInt(width.toString(), 10) / parseInt(height.toString(), 10) * expectedY) <
                    (this.parent.inputElement.getBoundingClientRect().right - 32) ?
                    (parseInt(width.toString(), 10) / parseInt(height.toString(), 10) * expectedY) :
                    (this.parent.inputElement.getBoundingClientRect().right - 32);
                vid.style.width = currentWidth + 'px';
                vid.style.height = expectedY + 'px';
            } else {
                vid.setAttribute('width', (parseInt(((parseInt(width.toString(), 10) / parseInt(height.toString(), 10) * expectedY) + parseInt(width.toString(), 10) / parseInt(height.toString(), 10)).toString(), 10)).toString());
            }
        } else if (height > width) {
            if (this.parent.insertVideoSettings.resizeByPercent) {
                if (parseInt('' + vid.getBoundingClientRect().width + '', 10) !== 0 && parseInt('' + width + '', 10) !== 0) {
                    vid.style.width = Math.min(Math.round((parseInt(width.toString(), 10) / vid.getBoundingClientRect().width) * expectedX * 100) / 100, 100) + '%';
                } else {
                    vid.style.width = this.pixToPerc((expectedX / parseInt(height.toString(), 10) * expectedY), (vid.previousElementSibling || vid.parentElement)) + '%';
                }
                vid.style.height = null;
                vid.removeAttribute('height');
            } else if (vid.style.width !== '' || vidEleStyle.width !== '') {
                vid.style.width = expectedX + 'px';
                vid.style.height = (parseInt(height.toString(), 10) / parseInt(width.toString(), 10) * expectedX) + 'px';
            } else {
                vid.setAttribute('width', this.resizeBtnStat.botRight ? (this.getPointX(e.event as PointerEvent) - vid.getBoundingClientRect().left).toString() : expectedX.toString());
            }
        } else {
            if (this.parent.insertVideoSettings.resizeByPercent) {
                vid.style.width = this.pixToPerc(expectedX, (vid.previousElementSibling || vid.parentElement)) + '%';
                vid.style.height = null;
                vid.removeAttribute('height');
            } else {
                vid.style.width = expectedX + 'px';
                vid.style.height = expectedX + 'px';
            }
        }
    }
    private pixToPerc(expected: number, parentEle: Element): number {
        return expected / parseFloat(getComputedStyle(parentEle).width) * 100;
    }
    private vidDupMouseMove(width: string, height: string, e: PointerEvent | TouchEvent): void {
        const args: ResizeArgs = { event: e, requestType: 'videos' };
        this.parent.trigger(events.onResize, args, (resizingArgs: ResizeArgs) => {
            if (resizingArgs.cancel) {
                this.cancelResizeAction();
            } else {
                if ((parseInt(this.parent.insertVideoSettings.minWidth as string, 10) >= parseInt(width, 10) ||
                    (parseInt(this.parent.getInsertVidMaxWidth() as string, 10) <= parseInt(width, 10) &&
                    isNOU(this.videoEle.style.width)))) {
                    return;
                }
                if (!this.parent.insertVideoSettings.resizeByPercent &&
                    (parseInt(this.parent.insertVideoSettings.minHeight as string, 10) >= parseInt(height, 10) ||
                        parseInt(this.parent.insertVideoSettings.maxHeight as string, 10) <= parseInt(height, 10))) {
                    return;
                }
                this.videoEle.parentElement.style.cursor = 'pointer';
                this.setAspectRatio(this.videoEle, parseInt(width, 10), parseInt(height, 10), args);
                this.resizeVidDupPos(this.videoEle);
                this.vidResizePos(this.videoEle, this.vidResizeDiv);
                this.parent.setContentHeight('', false);
            }
        });
    }
    private resizing(e: PointerEvent | TouchEvent): void {
        if (this.videoEle.offsetWidth >= this.parent.getInsertVidMaxWidth()) {
            this.videoEle.style.maxHeight = this.videoEle.offsetHeight + 'px';
        }
        const pageX: number = this.getPointX(e);
        const pageY: number = this.getPointY(e);
        const mouseX: number = (this.resizeBtnStat.botLeft || this.resizeBtnStat.topLeft) ? -(pageX - this.pageX) : (pageX - this.pageX);
        const mouseY: number = (this.resizeBtnStat.topLeft || this.resizeBtnStat.topRight) ? -(pageY - this.pageY) : (pageY - this.pageY);
        const width: number = parseInt(this.vidDupPos.width as string, 10) + mouseX;
        const height: number = parseInt(this.vidDupPos.height as string, 10) + mouseY;
        this.pageX = pageX;
        this.pageY = pageY;
        if (this.resizeBtnStat.botRight) {
            this.vidDupMouseMove(width + 'px', height + 'px', e);
        } else if (this.resizeBtnStat.botLeft) {
            this.vidDupMouseMove(width + 'px', height + 'px', e);
        } else if (this.resizeBtnStat.topRight) {
            this.vidDupMouseMove(width + 'px', height + 'px', e);
        } else if (this.resizeBtnStat.topLeft) {
            this.vidDupMouseMove(width + 'px', height + 'px', e);
        }

    }

    private cancelResizeAction(): void {
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchEndEvent, this.resizeEnd);
        if (this.videoEle && this.vidResizeDiv && this.contentModule.getEditPanel().contains(this.vidResizeDiv)) {
            detach(this.vidResizeDiv);
            (this.videoEle as HTMLElement).style.outline = '';
            this.vidResizeDiv = null;
            this.pageX = null;
            this.pageY = null;
        }
    }
    private resizeVidDupPos(e: HTMLVideoElement | HTMLIFrameElement): void {
        this.vidDupPos = {
            width: (e.style.width !== '' && (this.parent.insertVideoSettings &&
                !this.parent.insertVideoSettings.resizeByPercent)) ? this.videoEle.style.width : e.width !== 'auto' &&  e.width !== 0 && e.width !== 'NaN' ? e.width + 'px' : parseInt(getComputedStyle(e).width, 10) + 'px',
            height: (e.style.height !== '') ? this.videoEle.style.height : e.height !== 'auto' && e.height !== 0 &&  e.height !== 'NaN' ? e.height + 'px' : parseInt(getComputedStyle(e).height, 10) + 'px'
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
        case 'VideoReplace':
            this.parent.notify(events.insertVideo, args);
            break;
        case 'VideoRemove':
            this.parent.notify(events.videoDelete, args);
            break;
        case 'VideoDimension':
            this.parent.notify(events.videoSize, args);
        }
    }

    private onKeyDown(event: NotifyArgs): void {
        const originalEvent: KeyboardEventArgs = event.args as KeyboardEventArgs;
        let range: Range;
        let save: NodeSelection;
        let selectNodeEle: Node[];
        let selectParentEle: Node[];
        this.deletedVid = [];
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
                if (nodes[i as number].nodeName === 'VIDEO' || nodes[i as number].nodeName === 'IFRAME') {
                    this.deletedVid.push(nodes[i as number]);
                }
            }
        }
        if (this.parent.editorMode === 'HTML' && ((originalEvent.which === 8 && originalEvent.code === 'Backspace') ||
            (originalEvent.which === 46 && originalEvent.code === 'Delete'))) {
            const isCursor: boolean = range.startContainer === range.endContainer && range.startOffset === range.endOffset;
            if ((originalEvent.which === 8 && originalEvent.code === 'Backspace' && isCursor)) {
                this.checkVideoBack(range);
            } else if ((originalEvent.which === 46 && originalEvent.code === 'Delete' && isCursor)) {
                this.checkVideoDel(range);
            }
        }
        if (!isNullOrUndefined(this.parent.formatter.editorManager.nodeSelection) &&
            originalEvent.code !== 'KeyK') {
            range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            save = this.parent.formatter.editorManager.nodeSelection.save(range, this.parent.contentModule.getDocument());
            selectNodeEle = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
            selectParentEle = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            if (!originalEvent.ctrlKey && originalEvent.key && (originalEvent.key.length === 1 || originalEvent.action === 'enter') &&
                (((selectParentEle[0] as HTMLElement).tagName === 'VIDEO' || this.isEmbedVidElem(selectParentEle[0] as HTMLElement))) &&
                (selectParentEle[0] as HTMLElement).parentElement) {
                const prev: Node = ((selectParentEle[0] as HTMLElement).parentElement as HTMLElement).childNodes[0];
                if (this.contentModule.getEditPanel().querySelector('.e-vid-resize')) {
                    this.removeResizeEle();
                }
                this.parent.formatter.editorManager.nodeSelection.setSelectionText(
                    this.contentModule.getDocument(), prev, prev, prev.textContent.length, prev.textContent.length);
                removeClass([selectParentEle[0] as HTMLElement], classes.CLS_VID_FOCUS);
                this.quickToolObj.videoQTBar.hidePopup();
            }
        }
        if (originalEvent.ctrlKey && (originalEvent.keyCode === 89 || originalEvent.keyCode === 90)) {
            this.undoStack({ subCommand: (originalEvent.keyCode === 90 ? 'undo' : 'redo') });
        }
        if (originalEvent.keyCode === 8 || originalEvent.keyCode === 46) {
            if (selectNodeEle && (selectNodeEle[0].nodeName === 'VIDEO' || this.isEmbedVidElem(selectNodeEle[0] as HTMLElement)) && selectNodeEle.length < 1) {
                originalEvent.preventDefault();
                const event: IImageNotifyArgs = {
                    selectNode: selectNodeEle, selection: save, selectParent: selectParentEle,
                    args: {
                        item: { command: 'Videos', subCommand: 'VideoRemove' } as IToolbarItemModel,
                        originalEvent: originalEvent
                    }
                };
                this.deleteVideo(event, originalEvent.keyCode);
            }
            if (this.parent.contentModule.getEditPanel().querySelector('.e-vid-resize')) {
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
            for (let i: number = 0; i < this.deletedVid.length; i++) {
                const src: string = (this.deletedVid[i as number] as HTMLVideoElement).src;
                this.videoRemovePost(src as string);
            }
            if (this.parent.editorMode !== 'Markdown') {
                if (range.startContainer.nodeType === 3) {
                    if (originalEvent.code === 'Backspace') {
                        if ((range.startContainer as HTMLElement).previousElementSibling && range.startOffset === 0 &&
                            (range.startContainer as HTMLElement).previousElementSibling.classList.contains(classes.CLS_VIDEOWRAP)) {
                            detach((range.startContainer as HTMLElement).previousElementSibling);
                        }
                    } else {
                        if ((range.startContainer as HTMLElement).nextElementSibling &&
                            range.endContainer.textContent.length === range.endOffset &&
                            (range.startContainer as HTMLElement).nextElementSibling.classList.contains(classes.CLS_VIDEOWRAP)) {
                            detach((range.startContainer as HTMLElement).nextElementSibling);
                        }
                    }
                } else if (range.startContainer.nodeType === 1 && ((range.startContainer as HTMLElement).classList &&
                    (range.startContainer as HTMLElement).classList.contains(classes.CLS_VIDEOWRAP))) {
                    detach(range.startContainer as HTMLElement);
                }
            }
            break;
        case 'insert-video':
            this.openDialog(true, originalEvent, save, selectNodeEle, selectParentEle);
            originalEvent.preventDefault();
            break;
        }
    }

    private openDialog(isInternal?: boolean, event?: KeyboardEventArgs, selection?: NodeSelection, ele?: Node[], parentEle?: Node[]): void {
        let range: Range;
        let save: NodeSelection;
        let selectNodeEle: Node[];
        let selectParentEle: Node[];
        if (!isInternal && !isNOU(this.parent.formatter.editorManager.nodeSelection)) {
            range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            save = this.parent.formatter.editorManager.nodeSelection.save(
                range, this.parent.contentModule.getDocument());
            selectNodeEle = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
            selectParentEle = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
        } else {
            save = selection;
            selectNodeEle = ele;
            selectParentEle = parentEle;
        }
        if (this.parent.editorMode === 'HTML') {
            this.insertVideo({
                args: {
                    item: { command: 'Videos', subCommand: 'Video' } as IToolbarItemModel,
                    originalEvent: event
                },
                selectNode: selectNodeEle,
                selection: save,
                selectParent: selectParentEle
            });
        }
    }

    private showDialog(): void {
        this.openDialog(false);
    }
    private closeDialog(): void {
        if (this.dialogObj) { this.dialogObj.hide({ returnValue: true } as Event); }
    }

    private checkVideoBack(range: Range): void {
        if (range.startContainer.nodeName === '#text' && range.startOffset === 0 &&
            !isNOU(range.startContainer.previousSibling) && (range.startContainer.previousSibling.nodeName === 'VIDEO' ||
            this.isEmbedVidElem(range.startContainer.previousSibling as HTMLElement))) {
            this.deletedVid.push(range.startContainer.previousSibling);
        } else if (range.startContainer.nodeName !== '#text' && !isNOU(range.startContainer.childNodes[range.startOffset - 1]) &&
            (range.startContainer.childNodes[range.startOffset - 1].nodeName === 'VIDEO' ||
            this.isEmbedVidElem(range.startContainer.childNodes[range.startOffset - 1] as HTMLElement))) {
            this.deletedVid.push(range.startContainer.childNodes[range.startOffset - 1]);
        }
    }

    private checkVideoDel(range: Range): void {
        if (range.startContainer.nodeName === '#text' && range.startOffset === range.startContainer.textContent.length &&
            !isNOU(range.startContainer.nextSibling) && (range.startContainer.nextSibling.nodeName === 'VIDEO' ||
            this.isEmbedVidElem(range.startContainer.nextSibling as HTMLElement))) {
            this.deletedVid.push(range.startContainer.nextSibling);
        } else if (range.startContainer.nodeName !== '#text' && !isNOU(range.startContainer.childNodes[range.startOffset]) &&
            (range.startContainer.childNodes[range.startOffset].nodeName === 'VIDEO' ||
            this.isEmbedVidElem(range.startContainer.childNodes[range.startOffset] as HTMLElement))) {
            this.deletedVid.push(range.startContainer.childNodes[range.startOffset]);
        }
    }

    private alignmentSelect(e: ClickEventArgs): void {
        const item: IDropDownItemModel = e.item as IDropDownItemModel;
        if (!document.body.contains(document.body.querySelector('.e-rte-quick-toolbar')) || item.command !== 'Videos') {
            return;
        }
        const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
        let selectNodeEle: Node[] = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
        selectNodeEle = (selectNodeEle[0].nodeName === 'VIDEO') ? selectNodeEle : [this.videoEle];
        const args: IImageNotifyArgs = { args: e, selectNode: selectNodeEle };
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        switch (item.subCommand) {
        case 'JustifyLeft':
        case 'JustifyCenter':
        case 'JustifyRight':
            this.alignVideo(args, item.subCommand);
            break;
        case 'Inline':
            this.inline(args);
            break;
        case 'Break':
            this.break(args);
            break;
        }
        if (this.quickToolObj && document.body.contains(this.quickToolObj.videoQTBar.element)) {
            this.quickToolObj.videoQTBar.hidePopup();
            removeClass([selectNodeEle[0] as HTMLElement], classes.CLS_VID_FOCUS);
        }
        this.cancelResizeAction();
    }

    private deleteVideo(e: IImageNotifyArgs, keyCode?: number): void {
        if (e.selectNode[0].nodeName !== 'VIDEO' && !this.isEmbedVidElem(e.selectNode[0] as HTMLElement)) { return; }
        if (this.isEmbedVidElem(e.selectNode[0] as HTMLElement)) {
            e.selectNode[0] = (e.selectNode[0] as HTMLElement).classList.contains(classes.CLS_VID_CLICK_ELEM) ? e.selectNode[0] :
                (e.selectNode[0] as HTMLElement).parentElement;
        }
        const args: AfterMediaDeleteEventArgs = {
            element: !this.isEmbedVidElem(e.selectNode[0] as HTMLElement) ? (e.selectNode[0] as HTMLElement).querySelector('iframe') :
                (e.selectNode[0] as HTMLElement),
            src: !this.isEmbedVidElem(e.selectNode[0] as HTMLElement) ? (e.selectNode[0] as HTMLElement).querySelector('source').getAttribute('src') :
                (e.selectNode[0] as HTMLElement).querySelector('iframe').getAttribute('src')
        };
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        e.selection.restore();
        this.parent.formatter.process(
            this.parent, e.args, e.args,
            {
                selectNode: e.selectNode,
                subCommand: ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand
            });
        this.videoRemovePost(args.src);
        if (this.quickToolObj && document.body.contains(this.quickToolObj.videoQTBar.element)) {
            this.quickToolObj.videoQTBar.hidePopup();
        }
        this.cancelResizeAction();
        if (isNullOrUndefined(keyCode)) {
            this.parent.trigger(events.afterMediaDelete, args);
        }
    }

    private videoRemovePost(src: string): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: Video = this;
        let absoluteUrl: string = '';
        if (isNOU(this.parent.insertVideoSettings.removeUrl) || this.parent.insertVideoSettings.removeUrl === '') { return; }
        if (src.indexOf('http://') > -1 || src.indexOf('https://') > -1) {
            absoluteUrl = src;
        } else {
            absoluteUrl = new URL(src, document.baseURI).href;
        }
        // eslint-disable-next-line no-useless-escape
        this.removingVideoName = absoluteUrl.replace(/^.*[\\\/]/, '');
        const xhr: XMLHttpRequest = new XMLHttpRequest();
        // eslint-disable-next-line @typescript-eslint/tslint/config
        xhr.addEventListener('readystatechange', function() {
            if (this.readyState === 4 && this.status === 200) {
                proxy.triggerPost(this.response);
            }
        });
        xhr.open('GET', absoluteUrl);
        xhr.responseType = 'blob';
        xhr.send();
    }

    private triggerPost(response: Blob): void {
        const removeUrl: string = this.parent.insertVideoSettings.removeUrl;
        if (isNOU(removeUrl) || removeUrl === '') { return; }
        const file: File = new File([response], this.removingVideoName);
        const ajax: Ajax = new Ajax(removeUrl, 'POST', true, null);
        const formData: FormData = new FormData();
        formData.append('UploadFiles', file);
        ajax.send(formData);
    }

    private onDocumentClick(e: MouseEvent): void {
        const target: HTMLElement = <HTMLElement>e.target;
        if (target.nodeName === 'VIDEO' || this.isEmbedVidElem(target)) {
            this.videoEle = !this.isEmbedVidElem(target) ? (target as HTMLVideoElement) : target.querySelector('iframe');
        }
        if (!isNullOrUndefined(this.dialogObj) && ((
            // eslint-disable-next-line
            !closest(target, '[id=' + "'" + this.dialogObj.element.id + "'" + ']') && this.parent.toolbarSettings.enable && this.parent.getToolbarElement() &&
            !this.parent.getToolbarElement().contains(e.target as Node)) ||
            (this.parent.getToolbarElement() && this.parent.getToolbarElement().contains(e.target as Node) &&
            !closest(target, '#' + this.parent.getID() + '_toolbar_Video') &&
            !target.querySelector('#' + this.parent.getID() + '_toolbar_Video')))
        ) {
            /* eslint-disable */
            if (e.offsetX > (e.target as HTMLVideoElement).clientWidth || e.offsetY > (e.target as HTMLVideoElement).clientHeight) {
            } else {
                this.dialogObj.hide({ returnValue: true } as Event);
                this.parent.isBlur = true;
                dispatchEvent(this.parent.element, 'focusout');
            }
            /* eslint-enable */
        }
        // if (((e.target as HTMLElement).tagName !== 'VIDEO' || !this.isEmbedVidElem(e.target as HTMLElement)) && this.vidResizeDiv && !(this.quickToolObj &&
        //     this.quickToolObj.videoQTBar && this.quickToolObj.videoQTBar.element.contains(e.target as HTMLElement)) &&
        //     this.contentModule.getEditPanel().contains(this.vidResizeDiv)) {
        //     this.cancelResizeAction();
        // }
        if (this.contentModule.getEditPanel().querySelector('.e-vid-resize')) {
            if (target.tagName !== 'VIDEO' && !this.isEmbedVidElem(target)) { this.removeResizeEle(); }
            if ((target.tagName !== 'VIDEO' && !this.isEmbedVidElem(target)) && !isNOU(this.videoEle)) {
                this.videoEle.style.outline = '';
            } else if (!isNOU(this.prevSelectedVidEle) &&
            this.prevSelectedVidEle !== ((target.tagName === 'IFRAME' || target.tagName === 'VIDEO') ? target : target.querySelector('iframe'))) {
                this.prevSelectedVidEle.style.outline = '';
            }
        }
    }
    private removeResizeEle(): void {
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchEndEvent, this.resizeEnd);
        detach(this.contentModule.getEditPanel().querySelector('.e-vid-resize'));
    }

    private onWindowResize(): void {
        if (!isNOU(this.contentModule) && !isNOU(this.contentModule.getEditPanel().querySelector('.e-vid-resize'))) {
            this.cancelResizeAction();
        }
    }

    private break(e: IImageNotifyArgs): void {
        if (e.selectNode[0].nodeName !== 'VIDEO' && !this.isEmbedVidElem(e.selectNode[0] as HTMLElement)) {
            return;
        }
        const subCommand: string = ((e.args as ClickEventArgs).item) ?
            ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand : 'Break';
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    }

    private inline(e: IImageNotifyArgs): void {
        if (e.selectNode[0].nodeName !== 'VIDEO' && !this.isEmbedVidElem(e.selectNode[0] as HTMLElement)) {
            return;
        }
        const subCommand: string = ((e.args as ClickEventArgs).item) ?
            ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand : 'Inline';
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    }

    private alignVideo(e: IImageNotifyArgs, type: string): void {
        const subCommand: string = ((e.args as ClickEventArgs).item) ?
            ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand : type;
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    }

    private editAreaClickHandler(e: IImageNotifyArgs): void {
        if (this.parent.readonly) {
            this.hideVideoQuickToolbar();
            return;
        }
        const args: MouseEvent = e.args as MouseEvent;
        const showOnRightClick: boolean = this.parent.quickToolbarSettings.showOnRightClick;
        if (args.which === 2 || (showOnRightClick && args.which === 1) || (!showOnRightClick && args.which === 3)) {
            if ((showOnRightClick && args.which === 1) && !isNullOrUndefined((args.target as HTMLElement)) &&
                ((args.target as HTMLElement).tagName === 'VIDEO' || this.isEmbedVidElem((args.target as HTMLElement)))) {
                this.parent.formatter.editorManager.nodeSelection.Clear(this.contentModule.getDocument());
                this.parent.formatter.editorManager.nodeSelection.setSelectionContents(
                    this.contentModule.getDocument(), args.target as Node);
            }
            return;
        }
        if (this.parent.editorMode === 'HTML' && this.parent.quickToolbarModule && this.parent.quickToolbarModule.videoQTBar) {
            this.quickToolObj = this.parent.quickToolbarModule;
            const target: HTMLElement = args.target as HTMLElement;
            this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
            const isPopupOpen: boolean = this.quickToolObj.videoQTBar.element.classList.contains('e-rte-pop');
            if ((target.nodeName === 'VIDEO' || this.isEmbedVidElem(target)) && this.parent.quickToolbarModule) {
                if (isPopupOpen) {
                    return;
                }
                this.parent.formatter.editorManager.nodeSelection.Clear(this.contentModule.getDocument());
                this.parent.formatter.editorManager.nodeSelection.setSelectionContents(this.contentModule.getDocument(), target);
                if (isIDevice()) {
                    this.parent.notify(events.selectionSave, e);
                }
                addClass([!this.isEmbedVidElem(target) ? target : target.querySelector('iframe')], classes.CLS_VID_FOCUS);
                this.showVideoQuickToolbar({ args: args, type: 'Videos', elements: [args.target as Element] } as IShowPopupArgs);
            } else {
                this.hideVideoQuickToolbar();
            }
        }
    }

    private showVideoQuickToolbar(e: IShowPopupArgs): void {
        if (e.type !== 'Videos' || e.args.detail === 2 || isNullOrUndefined(this.parent.quickToolbarModule)
            || isNullOrUndefined(this.parent.quickToolbarModule.videoQTBar) || isNullOrUndefined(e.args)) {
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
        if (target.tagName === 'VIDEO' || this.isEmbedVidElem(target)) {
            addClass([(!this.isEmbedVidElem(target) || target.tagName === 'IFRAME') ? target : target.querySelector('iframe')], [classes.CLS_VID_FOCUS]);
        }
        const pageY: number = (this.parent.iframeSettings.enable) ? window.pageYOffset +
                this.parent.element.getBoundingClientRect().top + args.clientY : args.pageY;
        if (this.parent.quickToolbarModule.videoQTBar) {
            if (e.isNotify) {
                setTimeout(() => {
                    this.parent.formatter.editorManager.nodeSelection.Clear(this.contentModule.getDocument());
                    this.parent.formatter.editorManager.nodeSelection.setSelectionContents(this.contentModule.getDocument(), target);
                    this.quickToolObj.videoQTBar.showPopup(
                        args.pageX - 50, pageY + (target.getBoundingClientRect().height / 2) - target.offsetTop, target as Element);
                }, 400);
            } else {
                this.quickToolObj.videoQTBar.showPopup(args.pageX - 50, pageY + (
                    target.getBoundingClientRect().height / 2) - target.offsetTop, target as Element);
            }
        }
    }

    public hideVideoQuickToolbar(): void {
        if (!isNullOrUndefined(this.contentModule.getEditPanel().querySelector('.' + classes.CLS_VID_FOCUS))) {
            removeClass([this.contentModule.getEditPanel().querySelector('.' + classes.CLS_VID_FOCUS)], classes.CLS_VID_FOCUS);
            if (!isNOU(this.videoEle)) {
                this.videoEle.style.outline = '';
            }
            if (!isNOU(this.contentModule.getEditPanel().querySelector('.e-vid-resize'))) {
                detach(this.contentModule.getEditPanel().querySelector('.e-vid-resize'));
            }
            if (this.quickToolObj && this.quickToolObj.videoQTBar && document.body.contains(this.quickToolObj.videoQTBar.element)) {
                this.quickToolObj.videoQTBar.hidePopup();
            }
        }
    }

    private isEmbedVidElem(target: HTMLElement): boolean {
        if ((target && target.nodeType !== 3 && target.nodeName !== 'BR' && (target.classList && target.classList.contains(classes.CLS_VID_CLICK_ELEM))) ||
        (target && target.nodeName === 'IFRAME')) {
            return true;
        } else {
            return false;
        }
    }

    private insertingVideo(e: IImageNotifyArgs): void {
        this.insertVideo(e);
        if (!isNullOrUndefined(this.dialogObj)) {
            this.dialogObj.element.style.maxHeight = 'inherit';
            const dialogContent: HTMLElement = this.dialogObj.element.querySelector('.e-video-content');
            if (!isNullOrUndefined(this.parent.insertVideoSettings.path) || this.parent.editorMode === 'HTML') {
                (document.getElementById(this.rteID + '_insertVideo') as HTMLElement).focus();
            } else {
                (dialogContent.querySelector('.e-video-url') as HTMLElement).focus();
            }
        }
    }

    public insertVideo(e: IImageNotifyArgs): void {
        if (this.dialogObj) {
            this.dialogObj.hide({ returnValue: true } as Event);
            return;
        }
        const videoDialog: HTMLElement = this.parent.createElement('div', { className: 'e-rte-video-dialog', id: this.rteID + '_video' });
        this.parent.element.appendChild(videoDialog);
        const videoInsert: string = this.i10n.getConstant('dialogInsert');
        const videolinkCancel: string = this.i10n.getConstant('dialogCancel');
        const videoHeader: string = this.i10n.getConstant('videoHeader');
        const selection: NodeSelection = e.selection;
        const selectObj: IImageNotifyArgs = { selfVideo: this, selection: e.selection, args: e.args, selectParent: e.selectParent };
        const dialogModel: DialogModel = {
            header: videoHeader,
            cssClass: classes.CLS_RTE_ELEMENTS,
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            showCloseIcon: true, closeOnEscape: true, width: (Browser.isDevice) ? '290px' : '340px',
            position: { X: 'center', Y: (Browser.isDevice) ? 'center' : 'top' },
            isModal: (Browser.isDevice as boolean),
            buttons: [{
                click: this.insertVideoUrl.bind(selectObj),
                buttonModel: { content: videoInsert, cssClass: 'e-flat e-insertVideo', isPrimary: true, disabled: true }
            },
            {
                click: (e: MouseEvent) => {
                    this.cancelDialog(e);
                },
                buttonModel: { cssClass: 'e-flat e-cancel', content: videolinkCancel }
            }],
            target: (Browser.isDevice) ? document.body : this.parent.element,
            animationSettings: { effect: 'None' },
            close: (event: { [key: string]: object }) => {
                if (this.isVideoUploaded) {
                    this.uploadObj.removing();
                }
                this.parent.isBlur = false;
                if (event && (event.event as { [key: string]: string }).returnValue) {
                    if (this.parent.editorMode === 'HTML') {
                        selection.restore();
                    }
                }
                this.dialogObj.destroy();
                detach(this.dialogObj.element);
                this.dialogRenderObj.close(event);
                this.dialogObj = null;
            }
        };
        const dialogContent: HTMLElement = this.parent.createElement('div', { className: 'e-video-content' });
        if (!isNullOrUndefined(this.parent.insertVideoSettings.path) || this.parent.editorMode === 'HTML') {
            dialogContent.appendChild(this.videoUpload(e));
        }
        const linkHeader: HTMLElement = this.parent.createElement('div', { className: 'e-videoheader' });
        const embedLinkHeader: HTMLElement = this.parent.createElement('div', { className: 'e-embed-videoheader' });
        const linkHeaderText: string = this.i10n.getConstant('videoLinkHeader');
        const embedLinkHeaderText: string = this.i10n.getConstant('embedVideoLinkHeader');
        if (this.parent.editorMode === 'HTML') {
            linkHeader.innerHTML = linkHeaderText;
            embedLinkHeader.innerHTML = embedLinkHeaderText;
        }
        dialogContent.appendChild(this.urlPopup(e));
        if (e.selectNode && e.selectNode[0].nodeType === 1 && ((e.selectNode[0] as HTMLElement).tagName === 'VIDEO' || this.isEmbedVidElem((e.selectNode[0] as HTMLElement)))) {
            dialogModel.header = this.parent.localeObj.getConstant('editVideoHeader');
            dialogModel.content = dialogContent;
        } else {
            dialogModel.content = dialogContent;
        }
        this.dialogObj = this.dialogRenderObj.render(dialogModel);
        this.dialogObj.createElement = this.parent.createElement;
        this.dialogObj.appendTo(videoDialog);
        if (e.selectNode && e.selectNode[0].nodeType === 1 && ((e.selectNode[0] as HTMLElement).tagName === 'VIDEO' || this.isEmbedVidElem((e.selectNode[0] as HTMLElement)))
        && (e.name === 'insertVideo')) {
            this.dialogObj.element.querySelector('.e-insertVideo').textContent = this.parent.localeObj.getConstant('dialogUpdate');
        }
        videoDialog.style.maxHeight = 'inherit';
        if (this.quickToolObj) {
            if (this.quickToolObj.videoQTBar && document.body.contains(this.quickToolObj.videoQTBar.element)) {
                this.quickToolObj.videoQTBar.hidePopup();
                if (!isNullOrUndefined(e.selectParent as Node[])) {
                    removeClass([e.selectParent[0] as HTMLElement], classes.CLS_VID_FOCUS);
                }
            }
            if (this.quickToolObj.inlineQTBar && document.body.contains(this.quickToolObj.inlineQTBar.element)) {
                this.quickToolObj.inlineQTBar.hidePopup();
            }
        }
    }

    // eslint-disable-next-line
    private urlPopup(e: IImageNotifyArgs): HTMLElement {
        const videoUrl: HTMLElement = this.parent.createElement('div', { className: 'e-video-url-wrap' });
        const urlContent: HTMLElement = this.parent.createElement('div', { id: 'urlcontent' });
        const placeUrl: string = this.i10n.getConstant('videoUrl');
        const content: string = '<input id="embedURL" type="radio">' + '<input id="webURL" type="radio" >';
        const contentElem: DocumentFragment = parseHtml(content);
        videoUrl.appendChild(contentElem);
        videoUrl.appendChild(urlContent);
        this.embedInputUrl = this.parent.createElement('textarea', {
            className: 'e-input e-embed-video-url',
            attrs: { placeholder: 'Paste Embed URL here', type: 'text', tabindex: '-1', 'aria-label': this.i10n.getConstant('embedVideoLinkHeader') }
        });
        this.embedInputUrl.addEventListener('keyup', () => {
            if (!isNOU(this.embedInputUrl)) {
                if ((this.embedInputUrl as HTMLInputElement).value.length === 0) {
                    (this.dialogObj.getButtons(0) as Button).element.disabled = true;
                } else {
                    (this.dialogObj.getButtons(0) as Button).element.removeAttribute('disabled');
                }
            }
        });
        this.inputUrl = this.parent.createElement('input', {
            className: 'e-input e-video-url',
            attrs: { placeholder: placeUrl, spellcheck: 'false' }
        });
        this.inputUrl.addEventListener('input', () => {
            if (!isNOU(this.inputUrl)) {
                if ((this.inputUrl as HTMLInputElement).value.length === 0) {
                    (this.dialogObj.getButtons(0) as Button).element.disabled = true;
                } else {
                    (this.dialogObj.getButtons(0) as Button).element.removeAttribute('disabled');
                }
            }
        });
        const embedUrlBtn: RadioButton = new RadioButton({
            label: 'Embed URL',
            checked: true,
            name: 'URL',
            created: () => {
                urlContent.appendChild(this.embedInputUrl);
            },
            change: () => {
                urlContent.innerHTML = '';
                (this.inputUrl as HTMLInputElement).value = '';
                urlContent.appendChild(this.embedInputUrl);
            }
        });
        embedUrlBtn.appendTo((videoUrl.querySelector('#embedURL') as HTMLElement));
        const webUrlBtn: RadioButton = new RadioButton({
            label: 'Web URL',
            name: 'URL',
            change: () => {
                urlContent.innerHTML = '';
                (this.embedInputUrl as HTMLTextAreaElement).value = '';
                urlContent.appendChild(this.inputUrl);
            }
        });
        webUrlBtn.appendTo((videoUrl.querySelector('#webURL') as HTMLElement));
        return videoUrl;
    }

    private videoUpload(e: IImageNotifyArgs): HTMLElement {
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
        const uploadParentEle: HTMLElement = this.parent.createElement('div', { className: 'e-vid-uploadwrap e-droparea' });
        const deviceVideoUpMsg: string = this.i10n.getConstant('videoDeviceUploadMessage');
        const videoUpMsg: string = this.i10n.getConstant('videoUploadMessage');
        const span: HTMLElement = this.parent.createElement('span', { className: 'e-droptext' });
        const spanMsg: HTMLElement = this.parent.createElement('span', {
            className: 'e-rte-upload-text', innerHTML: ((Browser.isDevice) ? deviceVideoUpMsg : videoUpMsg)
        });
        span.appendChild(spanMsg);
        const btnEle: HTMLElement = this.parent.createElement('button', {
            className: 'e-browsebtn', id: this.rteID + '_insertVideo', attrs: { autofocus: 'true', type: 'button' }
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
        let fileName: string;
        let rawFile: FileInfo[];
        let selectArgs: SelectedEventArgs;
        let filesData: FileInfo[];
        let beforeUploadArgs: ImageUploadingEventArgs;
        this.uploadObj = new Uploader({
            asyncSettings: { saveUrl: this.parent.insertVideoSettings.saveUrl, removeUrl: this.parent.insertVideoSettings.removeUrl },
            dropArea: span, multiple: false, enableRtl: this.parent.enableRtl,
            allowedExtensions: this.parent.insertVideoSettings.allowedTypes.toString(),
            selected: (e: SelectedEventArgs) => {
                proxy.isVideoUploaded = true;
                selectArgs = e;
                filesData = e.filesData;
                if (this.parent.isServerRendered) {
                    selectArgs = JSON.parse(JSON.stringify(e));
                    e.cancel = true;
                    rawFile = e.filesData;
                    selectArgs.filesData = rawFile;
                }
                this.parent.trigger(events.fileSelected, selectArgs, (selectArgs: SelectedEventArgs) => {
                    if (!selectArgs.cancel) {
                        this.checkExtension(selectArgs.filesData[0]); fileName = selectArgs.filesData[0].name;
                        if (this.parent.editorMode === 'HTML' && isNullOrUndefined(this.parent.insertVideoSettings.path)) {
                            const reader: FileReader = new FileReader();
                            // eslint-disable-next-line
                            reader.addEventListener('load', (e: MouseEvent) => {
                                const url: string = this.parent.insertVideoSettings.saveFormat === 'Base64' ? reader.result as string :
                                    URL.createObjectURL(convertToBlob(reader.result as string));
                                proxy.uploadUrl = {
                                    url: url, selection: save, fileName: fileName,
                                    selectParent: selectParent
                                };
                                proxy.inputUrl.setAttribute('disabled', 'true');
                                proxy.embedInputUrl.setAttribute('disabled', 'true');
                                if (isNullOrUndefined(proxy.parent.insertVideoSettings.saveUrl) && this.isAllowedTypes
                                    && !isNullOrUndefined(this.dialogObj)) {
                                    (this.dialogObj.getButtons(0) as Button).element.removeAttribute('disabled');
                                }
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
                    this.parent.trigger(events.fileUploading, beforeUploadArgs, (beforeUploadArgs: ImageUploadingEventArgs) => {
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
                    this.parent.trigger(events.beforeFileUpload, args);
                }
            },
            uploading: (e: UploadingEventArgs) => {
                if (!this.parent.isServerRendered) {
                    this.parent.trigger(events.fileUploading, e);
                }
            },
            success: (e: Object) => {
                this.parent.trigger(events.fileUploadSuccess, e, (e: object) => {
                    if (!isNullOrUndefined(this.parent.insertVideoSettings.path)) {
                        const url: string = this.parent.insertVideoSettings.path + (e as MetaData).file.name;
                        // eslint-disable-next-line
                        const value: IVideoCommandsArgs = { url: url, selection: save };
                        proxy.uploadUrl = {
                            url: url, selection: save, fileName: fileName, selectParent: selectParent,
                            width: {
                                width: proxy.parent.insertVideoSettings.width, minWidth: proxy.parent.insertVideoSettings.minWidth,
                                maxWidth: proxy.parent.getInsertImgMaxWidth()
                            },
                            height: {
                                height: proxy.parent.insertVideoSettings.height, minHeight: proxy.parent.insertVideoSettings.minHeight,
                                maxHeight: proxy.parent.insertVideoSettings.maxHeight
                            }
                        };
                        //proxy.inputUrl.setAttribute('disabled', 'true');
                        proxy.embedInputUrl.setAttribute('disabled', 'true');
                    }
                    if ((e as ProgressEventArgs).operation === 'upload' && !isNullOrUndefined(this.dialogObj)) {
                        (this.dialogObj.getButtons(0) as Button).element.removeAttribute('disabled');
                    }
                });
            },
            failure: (e: object) => {
                this.parent.trigger(events.fileUploadFailed, e);
            },
            removing: () => {
                // eslint-disable-next-line
                this.parent.trigger(events.fileRemoving, e, (e: RemovingEventArgs) => {
                    proxy.isVideoUploaded = false;
                    (this.dialogObj.getButtons(0) as Button).element.disabled = true;
                    //proxy.inputUrl.removeAttribute('disabled');
                    proxy.embedInputUrl.removeAttribute('disabled'); if (proxy.uploadUrl) {
                        proxy.uploadUrl.url = '';
                    }
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
                this.isAllowedTypes = false;
            } else {
                this.isAllowedTypes = true;
            }
        }
    }

    private fileSelect(): boolean {
        this.dialogObj.element.getElementsByClassName('e-file-select-wrap')[0].querySelector('button').click();
        return false;
    }

    // eslint-disable-next-line
    private cancelDialog(e: MouseEvent): void {
        this.parent.isBlur = false;
        this.dialogObj.hide({ returnValue: true } as Event);
        if (this.isVideoUploaded) {
            this.uploadObj.removing();
        }
    }

    // eslint-disable-next-line
    private insertVideoUrl(e: MouseEvent): void {
        const proxy: Video = (this as IImageNotifyArgs).selfVideo;
        //let audioSelectParent: Node = proxy.uploadUrl.selectParent[0];
        proxy.isVideoUploaded = false;
        const url: string = (proxy.inputUrl as HTMLInputElement).value;
        const embedUrl: string = (proxy.embedInputUrl as HTMLTextAreaElement).value;
        if (proxy.parent.formatter.getUndoRedoStack().length === 0) {
            proxy.parent.formatter.saveData();
        }
        if (!isNullOrUndefined(proxy.uploadUrl) && proxy.uploadUrl.url !== '') {
            proxy.uploadUrl.cssClass = (proxy.parent.insertVideoSettings.layoutOption === 'Inline' ?
                classes.CLS_VIDEOINLINE : classes.CLS_VIDEOBREAK);
            proxy.dialogObj.hide({ returnValue: false } as Event);
            proxy.parent.formatter.process(
                proxy.parent, (this as IImageNotifyArgs).args,
                ((this as IImageNotifyArgs).args as ClickEventArgs).originalEvent, proxy.uploadUrl);
            proxy.uploadUrl.url = '';
        } else if (proxy.parent.editorMode === 'HTML' && (url !== '' || embedUrl !== '')) {
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
            const name: string =  url !== '' ? url.split('/')[url.split('/').length - 1] : embedUrl;
            const value: IVideoCommandsArgs = {
                cssClass: (proxy.parent.insertVideoSettings.layoutOption === 'Inline' ? classes.CLS_VIDEOINLINE : classes.CLS_VIDEOBREAK),
                url: url, selection: (this as IImageNotifyArgs).selection, fileName: name, isEmbedUrl: embedUrl !== '' ? true : false,
                selectParent: (this as IImageNotifyArgs).selectParent, width: {
                    width: proxy.parent.insertVideoSettings.width, minWidth: proxy.parent.insertVideoSettings.minWidth,
                    maxWidth: proxy.parent.getInsertImgMaxWidth()
                },
                height: {
                    height: proxy.parent.insertVideoSettings.height, minHeight: proxy.parent.insertVideoSettings.minHeight,
                    maxHeight: proxy.parent.insertVideoSettings.maxHeight
                }
            };
            proxy.parent.formatter.process(
                proxy.parent, (this as IImageNotifyArgs).args, ((this as IImageNotifyArgs).args as ClickEventArgs).originalEvent, value);
            proxy.dialogObj.hide({ returnValue: false } as Event);
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
        this.prevSelectedVidEle = undefined;
        this.removeEventListener();
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {void}
     * @hidden
     */
    private getModuleName(): string {
        return 'video';
    }
}
