import { addClass, Browser, closest, createElement, detach, EventHandler, formatUnit, isNullOrUndefined as isNOU, KeyboardEventArgs, removeClass } from '../../../base'; /*externalscript*/
import { ClickEventArgs } from '../../../navigations/src'; /*externalscript*/
import { isIDevice } from '../../editor-scripts/common/util';
import { IDropDownItemModel, IShowPopupArgs, IToolbarItemModel, IVideoCommandsArgs, NotifyArgs, OffsetPosition, ResizeArgs, DialogCloseEventArgs } from '../../editor-scripts/common/interface';
import { NodeSelection } from '../../editor-scripts/selection/selection';
import { QuickToolbar } from '../actions/quick-toolbar';
import * as classes from '../classes';
import { CLS_RTE_VID_BOX_MARK } from '../classes';
import * as events from '../constant';
import { IImageNotifyArgs, IShowVideoDialog, MediaDeletedEventArgs } from '../interfaces';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { dispatchEvent, parseHtml } from '../util';
import { convertToBlob } from '../../editor-scripts/common/util';
import { VideoCommand } from '../../editor-scripts/editor-manager/plugin/video';

/**
 * `Video` module is used to handle video actions.
 */
export class Video {
    private rteId: string;
    private modifiedUrl: string;
    private isStreamUrl: boolean;
    private pageX: number = null;
    private pageY: number = null;
    private mouseX: number = null;
    private deletedVid: Node[] = [];
    public videoDragArgs: DragEvent;
    private parent: SfRichTextEditor;
    private vidEle: HTMLVideoElement | HTMLIFrameElement;
    public vidResizeDiv: HTMLElement;
    private quickToolObj: QuickToolbar;
    private inputUrl: HTMLInputElement;
    private embedInputUrl: HTMLInputElement;
    private vidUploadSave: NodeSelection;
    private uploadUrl: IVideoCommandsArgs;
    private selectionObj: IImageNotifyArgs;
    private vidUploadSelectedParent: Node[];
    private removingVideoName: string;
    private prevSelectedVidEle: HTMLVideoElement | HTMLIFrameElement;
    private resizeBtnStat: { [key: string]: boolean };
    private vidDupPos: { [key: string]: number | string };
    private buttonClickElement: HTMLElement

    constructor(parent?: SfRichTextEditor) {
        this.parent = parent;
        this.rteId = parent.element.id;
        this.addEventListener();
    }
    protected addEventListener(): void {
        this.parent.observer.on(events.keyUp, this.onKeyUp, this);
        this.parent.observer.on(events.docClick, this.docClick, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
        this.parent.observer.on(events.keyDown, this.onKeyDown, this);
        this.parent.observer.on(events.videoSize, this.videoSize, this);
        this.parent.observer.on(events.videoDelete, this.deleteVid, this);
        this.parent.observer.on(events.initialEnd, this.afterRender, this);
        this.parent.observer.on(events.insertVideo, this.videoDialog, this);
        this.parent.observer.on(events.windowResize, this.onWindowResize, this);
        this.parent.observer.on(events.dropDownSelect, this.alignmentSelect, this);
        this.parent.observer.on(events.iframeMouseDown, this.onIframeMouseDown, this);
        this.parent.observer.on(events.videoToolbarAction, this.onToolbarAction, this);
        this.parent.observer.on(events.editAreaClick, this.editAreaClickHandler, this);
        this.parent.observer.on(events.insertCompleted, this.showVideoQuickToolbar, this);
        this.parent.observer.on(events.bindOnEnd, this.bindOnEnd, this);
    }
    protected removeEventListener(): void {
        this.parent.observer.off(events.keyUp, this.onKeyUp);
        this.parent.observer.off(events.docClick, this.docClick);
        this.parent.observer.off(events.destroy, this.destroy);
        this.parent.observer.off(events.keyDown, this.onKeyDown);
        this.parent.observer.off(events.videoSize, this.videoSize);
        this.parent.observer.off(events.videoDelete, this.deleteVid);
        this.parent.observer.off(events.initialEnd, this.afterRender);
        this.parent.observer.off(events.insertVideo, this.videoDialog);
        this.parent.observer.off(events.windowResize, this.onWindowResize);
        this.parent.observer.off(events.dropDownSelect, this.alignmentSelect);
        this.parent.observer.off(events.iframeMouseDown, this.onIframeMouseDown);
        this.parent.observer.off(events.videoToolbarAction, this.onToolbarAction);
        this.parent.observer.off(events.editAreaClick, this.editAreaClickHandler);
        this.parent.observer.off(events.insertCompleted, this.showVideoQuickToolbar);
        this.parent.observer.off(events.bindOnEnd, this.bindOnEnd);
        if (!isNOU(this.parent.getEditPanel())) {
            EventHandler.remove(this.parent.getEditPanel(), Browser.touchEndEvent, this.videoClick);
            this.parent.formatter.editorManager.observer.off(events.checkUndo, this.undoStack);
            if (this.parent.insertVideoSettings.resize) {
                EventHandler.remove(this.parent.getEditPanel(), Browser.touchStartEvent, this.resizeStart);
                EventHandler.remove(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick);
                EventHandler.remove(this.parent.getEditPanel(), 'cut', this.onCutHandler);
            }
        }
    }
    private bindOnEnd(): void {
        if (!this.parent.formatter.editorManager.videoObj) {
            this.parent.formatter.editorManager.videoObj = new VideoCommand(this.parent.formatter.editorManager);
        }
    }
    private docClick(e: { [key: string]: object }): void {
        const target: HTMLElement = <HTMLElement>(e.args as MouseEvent).target;
        const closestEle: Element = closest(target, 'video');
        const isExist: boolean = closestEle && this.parent.getEditPanel().contains(closestEle) ? true : false;
        if (target && target.tagName !== 'video' && !isExist &&
            closest(target, '.e-rte-quick-popup') === null && target.offsetParent &&
            !target.offsetParent.classList.contains('e-quick-dropdown') &&
            !target.offsetParent.classList.contains('e-rte-backgroundcolor-dropdown') && !closest(target, '.e-rte-dropdown-popup')
            && !closest(target, '.e-rte-elements')) {
            this.hideVideoQuickToolbar();
        }
    }
    private afterRender(): void {
        EventHandler.add(this.parent.getEditPanel(), Browser.touchEndEvent, this.videoClick, this);
        if (this.parent.insertVideoSettings.resize) {
            EventHandler.add(this.parent.getEditPanel(), Browser.touchStartEvent, this.resizeStart, this);
            EventHandler.add(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick, this);
            EventHandler.add(this.parent.getEditPanel(), 'cut', this.onCutHandler, this);
        }
    }

    public isEmbedVidElem(target: HTMLElement): boolean {
        if ((target && target.nodeType !== 3 && target.nodeName !== 'BR' && (target.classList && (target.classList.contains(classes.CLS_VID_CLICK_ELEM) ||
            target.classList.contains('e-embed-video-wrap')))) || target.nodeName === 'IFRAME') {
            return true;
        } else {
            return false;
        }
    }

    private videoDialog(e: IImageNotifyArgs): void {
        this.parent.dotNetRef.invokeMethodAsync(events.closeVideoDialog, null);
        this.uploadUrl = { url: '' };
        this.selectionObj = { selfVideo: this, selection: e.selection, args: e.args, selectParent: e.selectParent };
        if (!isNOU(this.parent.insertVideoSettings.path) || this.parent.editorMode === 'HTML') {
            const iframe: boolean = this.parent.iframeSettings.enable;
            if (this.parent.editorMode === 'HTML' && (!iframe && isNOU(closest(e.selection.range.startContainer.parentNode, '#' +
                this.parent.getPanel().id))
                || (iframe && isNOU(e.selection.range.startContainer.parentNode.ownerDocument.querySelector('body'))))) {
                (this.parent.getEditPanel() as HTMLElement).focus();
                const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
                this.vidUploadSave = this.parent.formatter.editorManager.nodeSelection.save(
                    range, this.parent.getDocument());
                this.vidUploadSelectedParent = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            } else {
                this.vidUploadSave = e.selection; this.vidUploadSelectedParent = e.selectParent;
            }
        }
        let obj: IShowVideoDialog;
        if (e.selectNode && (((e.selectNode[0] as HTMLElement) && (e.selectNode[0] as HTMLElement).nodeType !== 3 &&
            (e.selectNode[0] as HTMLElement).nodeName !== 'BR' &&
            ((e.selectNode[0] as HTMLElement).classList &&
            (e.selectNode[0] as HTMLElement).classList.contains(classes.CLS_VID_CLICK_ELEM))) ||
            (e.selectNode[0] as HTMLElement).nodeName === 'IFRAME' || (e.selectNode[0] as HTMLElement).nodeName === 'VIDEO')) {
            const regex: RegExp = new RegExp('([^\\S]|^)(((https?:\\/\\/)|(www\\.))(\\S+))', 'gi');
            if ((e.selectNode[0] as HTMLElement).querySelector('source').src.match(regex)) {
                obj = { mode: 'Edit', url: (e.selectNode[0] as HTMLElement).querySelector('source').src };
            } else {
                obj = { mode: 'Edit', url: '' };
            }
        } else {
            obj = { mode: 'Insert' };
        }
        this.parent.dotNetRef.invokeMethodAsync(events.showVideoDialog, obj);
        if (this.quickToolObj) {
            this.quickToolObj.hideVideoQTBar();
            if (!isNOU(e.selectParent as Node[])) { removeClass([e.selectParent[0] as HTMLElement], classes.CLS_VID_FOCUS); }
            this.quickToolObj.hideInlineQTBar();
            if (!isNOU(this.quickToolObj.textQTBar) && !isNOU(this.quickToolObj.textQTBar.element) && this.quickToolObj.textQTBar.element.classList.contains('e-popup-open')) {
                this.quickToolObj.hideTextQTBar();
            }
        }
    }
    private isVideoWrapElem(target: HTMLElement): boolean {
        if (target && target.classList && target.classList.contains(classes.CLS_VIDEOWRAP)) {
            return true;
        }
        return false;
    }
    private checkVideoBack(range: Range): void {
        if (range.startContainer.nodeName === '#text' && range.startOffset === 0 &&
            !isNOU(range.startContainer.previousSibling) && (range.startContainer.previousSibling.nodeName === 'VIDEO' ||
            this.isEmbedVidElem(range.startContainer.previousSibling as HTMLElement) ||
            this.isVideoWrapElem(range.startContainer.previousSibling as HTMLElement))) {
            this.deletedVid.push(range.startContainer.previousSibling);
        } else if (range.startContainer.nodeName !== '#text' && !isNOU(range.startContainer.childNodes[range.startOffset - 1]) &&
            this.isEmbedVidElem(range.startContainer.childNodes[range.startOffset - 1] as HTMLElement) ||
            this.isVideoWrapElem(range.startContainer.childNodes[range.startOffset - 1] as HTMLElement)) {
            this.deletedVid.push(range.startContainer.childNodes[range.startOffset - 1]);
        }
    }
    private checkVideoDel(range: Range): void {
        if (range.startContainer.nodeName === '#text' && range.startOffset === range.startContainer.textContent.length &&
            !isNOU(range.startContainer.nextSibling) && (range.startContainer.nextSibling.nodeName === 'VIDEO' ||
            this.isEmbedVidElem(range.startContainer.nextSibling as HTMLElement) ||
            this.isVideoWrapElem(range.startContainer.nextSibling as HTMLElement))) {
            this.deletedVid.push(range.startContainer.nextSibling);
        } else if (range.startContainer.nodeName !== '#text' && !isNOU(range.startContainer.childNodes[range.startOffset]) &&
            (range.startContainer.childNodes[range.startOffset].nodeName === 'VIDEO' ||
            this.isEmbedVidElem(range.startContainer.childNodes[range.startOffset] as HTMLElement) ||
            this.isVideoWrapElem(range.startContainer.childNodes[range.startOffset] as HTMLElement))) {
            this.deletedVid.push(range.startContainer.childNodes[range.startOffset]);
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
    private undoStack(args?: { [key: string]: string }): void {
        if (args.subCommand.toLowerCase() === 'undo' || args.subCommand.toLowerCase() === 'redo') {
            for (let i: number = 0; i < this.parent.formatter.getUndoRedoStack().length; i++) {
                const temp: Element = createElement('div');
                const contentElem: DocumentFragment = parseHtml(this.parent.formatter.getUndoRedoStack()[i as number].text);
                temp.appendChild(contentElem);
                const video: NodeListOf<HTMLElement> = temp.querySelectorAll('video');
                if (temp.querySelector('.' + classes.CLS_VID_RESIZE) && video && video.length > 0) {
                    for (let j: number = 0; j < video.length; j++) { video[j as number].style.outline = ''; }
                    detach(temp.querySelector('.' + classes.CLS_VID_RESIZE));
                    this.parent.formatter.getUndoRedoStack()[i as number].text = temp.innerHTML;
                }
            }
        }
    }
    //#region Resize methods
    private videoResize(e: HTMLVideoElement): void {
        this.resizeBtnInit();
        this.vidEle = e;
        addClass([this.vidEle], 'e-resize');
        this.vidResizeDiv = createElement('span', { className: classes.CLS_VID_RESIZE, id: this.rteId + events.vidResizeId });
        this.vidResizeDiv.appendChild(createElement('span', {
            className: CLS_RTE_VID_BOX_MARK + ' e-rte-topLeft', styles: 'cursor: nwse-resize'
        }));
        this.vidResizeDiv.appendChild(createElement('span', {
            className: CLS_RTE_VID_BOX_MARK + ' e-rte-topRight', styles: 'cursor: nesw-resize'
        }));
        this.vidResizeDiv.appendChild(createElement('span', {
            className: CLS_RTE_VID_BOX_MARK + ' e-rte-botLeft', styles: 'cursor: nesw-resize'
        }));
        this.vidResizeDiv.appendChild(createElement('span', {
            className: CLS_RTE_VID_BOX_MARK + ' e-rte-botRight', styles: 'cursor: nwse-resize'
        }));
        if (Browser.isDevice) { addClass([this.vidResizeDiv], 'e-mob-rte'); }
        e.style.outline = '2px solid #4a90e2';
        this.vidResizePos(e, this.vidResizeDiv);
        this.resizeVidDupPos(e);
        this.parent.getEditPanel().appendChild(this.vidResizeDiv);
        if (this.parent.element.style.height === 'auto') {
            this.vidResizePos(e, this.vidResizeDiv);
        }
        EventHandler.add(this.parent.getDocument(), Browser.touchMoveEvent, this.resizing, this);
    }
    private resizeBtnInit(): { [key: string]: boolean } {
        return this.resizeBtnStat = { botLeft: false, botRight: false, topRight: false, topLeft: false };
    }
    private vidResizePos(e: HTMLVideoElement | HTMLIFrameElement, vidResizeDiv: HTMLElement): void {
        const pos: OffsetPosition = this.calcPos(e);
        const top: number = pos.top;
        const left: number = pos.left;
        const vidWid: string | number = e.width !== 0 && !isNOU(e.width) && e.width !== 'auto' ? e.width : e.getBoundingClientRect().width;
        const vidHgt: string | number = e.height !== 0 && !isNOU(e.height) && e.height !== 'auto' ? e.height : e.getBoundingClientRect().height;
        const borWid: number = (Browser.isDevice) ? (4 * parseInt((e.style.outline.slice(-3)), 10)) + 2 :
            (2 * parseInt((e.style.outline.slice(-3)), 10)) + 2; //span border width + video outline width
        const devWid: number = ((Browser.isDevice) ? 0 : 2);   // span border width
        (vidResizeDiv.querySelector('.e-rte-botLeft') as HTMLElement).style.left = (left - borWid) + 'px';
        (vidResizeDiv.querySelector('.e-rte-botLeft') as HTMLElement).style.top = ((parseInt(vidHgt.toString(), 10) - borWid) + top) + 'px';
        (vidResizeDiv.querySelector('.e-rte-botRight') as HTMLElement).style.left = ((parseInt(vidWid.toString(), 10) - (borWid - devWid)) + left) + 'px';
        (vidResizeDiv.querySelector('.e-rte-botRight') as HTMLElement).style.top = ((parseInt(vidHgt.toString(), 10) - borWid) + top) + 'px';
        (vidResizeDiv.querySelector('.e-rte-topRight') as HTMLElement).style.left = ((parseInt(vidWid.toString(), 10) - (borWid - devWid)) + left) + 'px';
        (vidResizeDiv.querySelector('.e-rte-topRight') as HTMLElement).style.top = (top - (borWid)) + 'px';
        (vidResizeDiv.querySelector('.e-rte-topLeft') as HTMLElement).style.left = (left - borWid) + 'px';
        (vidResizeDiv.querySelector('.e-rte-topLeft') as HTMLElement).style.top = (top - borWid) + 'px';
    }
    private resizeVidDupPos(e: HTMLVideoElement | HTMLIFrameElement): void {
        this.vidDupPos = {
            width: (e.style.width !== '') ? this.vidEle.style.width : e.width !== 0 && !isNOU(e.width) && e.width !== 'auto' ? e.width + 'px' : parseInt(getComputedStyle(e).width, 10) + 'px',
            height: (e.style.height !== '') ? this.vidEle.style.height : e.height !== 0 && !isNOU(e.height) && e.height !== 'auto' ? e.height + 'px' : parseInt(getComputedStyle(e).height, 10) + 'px'
        };
    }
    private calcPos(elem: HTMLElement): OffsetPosition {
        const ignoreOffset: string[] = ['TD', 'TH', 'TABLE', 'A'];
        let parentOffset: OffsetPosition = { top: 0, left: 0 };
        let elementOffset: OffsetPosition;
        const doc: Document = elem.ownerDocument;
        let offsetParent: Node = ((elem.offsetParent && (elem.offsetParent.classList.contains('e-video-clickelem') ||
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
    private vidDupMouseMove(width: string, height: string, e: PointerEvent | TouchEvent): void {
        const args: ResizeArgs = { requestType: 'Videos' };
        if (parseInt(this.parent.insertVideoSettings.minWidth as string, 10) >= parseInt(width, 10) ||
            (isNOU(this.parent.insertVideoSettings.maxWidth) ? false :
                parseInt(this.parent.insertVideoSettings.maxWidth as string, 10) <= parseInt(width, 10))) {
            return;
        }
        if (!this.parent.insertVideoSettings.resizeByPercent &&
            (parseInt(this.parent.insertVideoSettings.minHeight as string, 10) >= parseInt(height, 10) ||
                parseInt(this.parent.insertVideoSettings.maxHeight as string, 10) <= parseInt(height, 10))) {
            return;
        }
        this.vidEle.parentElement.style.cursor = 'pointer';
        this.setAspectRatio(this.vidEle, parseInt(width, 10), parseInt(height, 10), e);
        this.resizeVidDupPos(this.vidEle);
        this.vidResizePos(this.vidEle, this.vidResizeDiv);
    }
    private setAspectRatio(vid: HTMLVideoElement | HTMLIFrameElement, expectedX: number, expectedY: number,
                           e: PointerEvent | TouchEvent): void {
        const vidEleStyle: CSSStyleDeclaration | HTMLIFrameElement = getComputedStyle(vid);
        if (isNOU(vidEleStyle)) { return; }
        const regExp: RegExpConstructor = RegExp;
        let width: string | number = vidEleStyle.width !== '' ? vidEleStyle.width.match(new regExp('^\\d+(\\.\\d*)?%$', 'g')) ? parseFloat(vidEleStyle.width) :
            parseInt(vidEleStyle.width, 10) : vid.style.width !== '' ? parseInt(vid.style.width, 10) : vid.width;
        let height: string | number = vidEleStyle.height !== '' ? parseInt(vidEleStyle.height, 10) : vid.style.height !== '' ? parseInt(vid.style.height, 10) : vid.height;
        width = width.toString().match(new regExp('\\b\\d+(\\.\\d*)?(%|$)\\b', 'g')) ? parseFloat(width.toString()) :
            parseInt(width.toString(), 10);
        height = height.toString().match(new regExp('\\b\\d+(\\.\\d*)?(%|$)\\b', 'g')) ? parseFloat(height.toString()) : parseInt(height.toString(), 10);
        if (width > height) {
            vid.style.minWidth = parseInt(this.parent.insertVideoSettings.minWidth.toString(), 10) === 0 ? '200px' : formatUnit(this.parent.insertVideoSettings.minWidth);
            vid.style.minHeight = parseInt(this.parent.insertVideoSettings.minHeight.toString(), 10) === 0 ? '90px' : formatUnit(this.parent.insertVideoSettings.minHeight);
            if (this.parent.insertVideoSettings.resizeByPercent) {
                this.updateVidEleWidth(vid, width, height, expectedX, expectedY);
            } else if ((vid.style.width === '' && vid.style.height !== '') || (vidEleStyle.width === '' && vidEleStyle.height !== '')) {
                vid.style.height = expectedY + 'px';
            } else if ((vid.style.width !== '' && vid.style.height === '') || (vidEleStyle.width !== '' && vidEleStyle.height === '')) {
                vid.style.width = ((width / height * expectedY) + width / height).toString() + 'px';
            } else if (vid.style.width !== '' || vidEleStyle.width !== '') {
                vid.style.width = (width / height * expectedY) + 'px';
                vid.style.height = expectedY + 'px';
            } else {
                vid.setAttribute('width', (parseInt(((width / height * expectedY) + width / height).toString(), 10)).toString());
            }
        } else if (height > width) {
            if (this.parent.insertVideoSettings.resizeByPercent) {
                this.updateVidEleWidth(vid, width, height, expectedX, expectedY);
            } else if (vid.style.width !== '' || vidEleStyle.width !== '') {
                vid.style.width = expectedX + 'px';
                vid.style.height = (height / width * expectedX) + 'px';
            } else {
                vid.setAttribute('width', this.resizeBtnStat.botRight ? (this.getPointX(e) - vid.getBoundingClientRect().left).toString() : expectedX.toString());
            }
        } else {
            if (this.parent.insertVideoSettings.resizeByPercent) {
                vid.style.width = this.pixToPercent(expectedX, (vid.previousElementSibling || vid.parentElement)) + '%';
                vid.style.height = null;
                vid.removeAttribute('height');
            } else {
                vid.style.width = expectedX + 'px';
                vid.style.height = expectedX + 'px';
            }
        }
    }
    private updateVidEleWidth(vid: HTMLVideoElement | HTMLIFrameElement, width: number, height: number,
                              expectedX: number, expectedY: number): void {
        if (parseInt('' + vid.getBoundingClientRect().width + '', 10) !== 0 && parseInt('' + width + '', 10) !== 0) {
            const original: number = vid.offsetWidth + this.mouseX;
            const finalWidthByPerc: number = (original / vid.offsetWidth) * (parseFloat(vid.style.width).toString() === 'NaN' ? (vid.offsetWidth / (parseFloat(getComputedStyle(this.parent.element).width)) * 100) : parseFloat(vid.style.width));
            vid.style.width = ((finalWidthByPerc > 3) ? finalWidthByPerc : 3) + '%';
        } else {
            if (width > height) {
                vid.style.width = this.pixToPercent(width / height * expectedY, (vid.previousElementSibling || vid.parentElement)) + '%';
            } else {
                vid.style.width = this.pixToPercent((expectedX / height * expectedY), (vid.previousElementSibling || vid.parentElement)) + '%';
            }
        }
        vid.style.height = null;
        vid.removeAttribute('height');
    }
    public getMaxWidth(): string | number {
        const maxWidth: string | number = this.parent.insertVideoSettings.maxWidth as number;
        const vidPadding: number = 12;
        const vidResizeBorder: number = 2;
        const editEle: HTMLElement = this.parent.getEditPanel() as HTMLElement;
        const eleStyle: CSSStyleDeclaration = window.getComputedStyle(editEle);
        const editEleMaxWidth: number = editEle.offsetWidth - (vidPadding + vidResizeBorder +
            parseFloat(eleStyle.paddingLeft.split('px')[0]) + parseFloat(eleStyle.paddingRight.split('px')[0]) +
            parseFloat(eleStyle.marginLeft.split('px')[0]) + parseFloat(eleStyle.marginRight.split('px')[0]));
        return isNOU(maxWidth) ? editEleMaxWidth : maxWidth;
    }
    public cancelResizeAction(): void {
        EventHandler.remove(this.parent.getDocument(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.parent.getDocument(), Browser.touchEndEvent, this.resizeEnd);
        if (this.vidEle && this.vidResizeDiv && this.parent.getEditPanel().contains(this.vidResizeDiv)) {
            detach(this.vidResizeDiv);
            (this.vidEle as HTMLElement).style.outline = '';
            this.vidResizeDiv = null;
            this.pageX = null;
            this.pageY = null;
        }
    }
    private removeResizeEle(): void {
        EventHandler.remove(this.parent.getDocument(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.parent.getDocument(), Browser.touchEndEvent, this.resizeEnd);
        detach(this.parent.getEditPanel().querySelector('.e-vid-resize'));
    }

    private onWindowResize(): void {
        if (!isNOU(this.parent) && !isNOU(this.parent.getEditPanel().querySelector('.e-vid-resize'))) {
            this.cancelResizeAction();
        }
    }
    //#endregion
    //#region Quick toolbar related methods
    private editAreaClickHandler(e: IImageNotifyArgs): void {
        if (this.parent.readonly) {
            this.hideVideoQuickToolbar();
            return;
        }
        const args: MouseEvent = e.args as MouseEvent;
        const showOnRightClick: boolean = this.parent.quickToolbarSettings.showOnRightClick as boolean;
        if (args.which === 2 || (showOnRightClick && args.which === 1) || (!showOnRightClick && args.which === 3)) {
            if ((showOnRightClick && args.which === 1) && !isNOU((args.target as HTMLElement)) &&
                ((args.target as HTMLElement).tagName === 'VIDEO' || this.isEmbedVidElem(args.target as HTMLElement))) {
                this.parent.formatter.editorManager.nodeSelection.Clear(this.parent.getDocument());
                this.parent.formatter.editorManager.nodeSelection.setSelectionContents(
                    this.parent.getDocument(), args.target as Node);
            }
            return;
        }
        if (this.parent.editorMode === 'HTML' && this.parent.quickToolbarModule) {
            this.quickToolObj = this.parent.quickToolbarModule;
            const target: HTMLElement = args.target as HTMLElement;
            if ((target.nodeName === 'VIDEO' || this.isEmbedVidElem(target)) && this.parent.quickToolbarModule) {
                this.parent.formatter.editorManager.nodeSelection.Clear(this.parent.getDocument());
                this.parent.formatter.editorManager.nodeSelection.setSelectionContents(this.parent.getDocument(), target);
                if (isIDevice()) { this.parent.observer.notify(events.selectionSave, e); }
                addClass([!this.isEmbedVidElem(target) ? target : target.querySelector('iframe')], classes.CLS_VID_FOCUS);
                this.showVideoQuickToolbar({ args: args, type: 'Videos', elements: [args.target as Element] } as IShowPopupArgs);
            } else {
                this.hideVideoQuickToolbar();
            }
        }
    }
    private showVideoQuickToolbar(e: IShowPopupArgs): void {
        let type: string = 'VideoLink';
        if (e.type !== 'Videos' || e.args.detail === 2 || isNOU(this.parent.quickToolbarModule)) { return; }
        this.quickToolObj = this.parent.quickToolbarModule;
        const args: MouseEvent = e.args as MouseEvent;
        let target: HTMLElement = e.elements as HTMLElement;
        const parentRect: ClientRect = this.parent.element.getBoundingClientRect();
        const tbElement: HTMLElement = this.parent.getToolbarElement() as HTMLElement;
        const tbHeight: number = (tbElement) ? (tbElement.offsetHeight + this.parent.toolbarModule.getExpandTBarPopHeight()) : 0;
        [].forEach.call(e.elements, (element: Element, index: number) => {
            if (index === 0) {
                target = <HTMLElement>element;
            }
        });
        if (target && !closest(target, 'a')) {
            type = 'Video';
        }
        if (target.tagName === 'VIDEO' || this.isEmbedVidElem(target)) {
            addClass([(!this.isEmbedVidElem(target) || target.tagName === 'IFRAME') ? target : target.querySelector('iframe')], [classes.CLS_VID_FOCUS]);
        }
        const pageX: number = this.parent.iframeSettings.enable ? window.scrollX + parentRect.left + args.clientX : args.pageX;
        const pageY: number = this.parent.iframeSettings.enable ? window.scrollY + parentRect.top +
            tbHeight + args.clientY : args.pageY;
        if (this.quickToolObj) {
            if (e.isNotify) {
                setTimeout(() => {
                    this.parent.formatter.editorManager.nodeSelection.Clear( this.parent.getDocument() );
                    this.parent.formatter.editorManager.nodeSelection.setSelectionContents( this.parent.getDocument(), target );
                    this.quickToolObj.showVideoQTBar(target, e.args as MouseEvent);
                    if (this.parent.insertVideoSettings.resize === true) {
                        this.resizeStart(e.args as PointerEvent, target);
                    }
                }, 400);
            } else {
                this.quickToolObj.showVideoQTBar(target, e.args as MouseEvent);
            }
        }
    }
    public hideVideoQuickToolbar(): void {
        if (!isNOU(this.parent.getEditPanel().querySelector('.' + classes.CLS_VID_FOCUS))) {
            removeClass([this.parent.getEditPanel().querySelector('.' + classes.CLS_VID_FOCUS)], classes.CLS_VID_FOCUS);
            if (this.quickToolObj) {
                this.quickToolObj.hideVideoQTBar();
            }
        }
    }
    private onToolbarAction(args: NotifyArgs): void {
        if (this.quickToolObj) {
            this.quickToolObj.hideVideoQTBar();
            removeClass([args.selectNode[0] as HTMLElement], classes.CLS_VID_FOCUS);
        }
        this.selectionObj = args;
        if (isIDevice()) { this.parent.observer.notify(events.selectionRestore, {}); }
        const item: IToolbarItemModel = (args.args as ClickEventArgs).item as IToolbarItemModel;
        switch (item.subCommand) {
        case 'VideoReplace':
            this.parent.observer.notify(events.insertVideo, args);
            break;
        case 'VideoRemove':
            this.parent.observer.notify(events.videoDelete, args);
            break;
        case 'VideoDimension':
            this.parent.observer.notify(events.videoSize, args);
            break;
        }
    }
    private deleteVid(e: IImageNotifyArgs, keyCode?: number): void {
        if (e.selectNode[0].nodeName !== 'VIDEO' && !this.isEmbedVidElem(e.selectNode[0] as HTMLElement)) {
            return;
        }
        const args: MediaDeletedEventArgs = {
            src: (e.selectNode[0] as HTMLElement).getAttribute('src')
        };
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        e.selection.restore();
        if (this.parent.getEditPanel().querySelector('.e-vid-resize')) {
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
            this.quickToolObj.hideVideoQTBar();
        }
        this.cancelResizeAction();
        if (isNOU(keyCode) && this.parent.mediaDeleteEnabled) {
            this.parent.dotNetRef.invokeMethodAsync('MediaDeleted', args);
        }
    }
    private videoSize(e: IImageNotifyArgs): void {
        if (e.selectNode[0].nodeName !== 'VIDEO' && !this.isEmbedVidElem(e.selectNode[0] as HTMLElement)) {
            return;
        }
        const selectNode: HTMLVideoElement = (e as IImageNotifyArgs).selectNode[0] as HTMLVideoElement;
        const isEmbedVidElemWidth: string = this.isEmbedVidElem(selectNode) && e.selectNode[1] ? (e.selectNode[1] as HTMLElement).style.width : '';
        let width: string = (selectNode.style.width.toString() === 'auto' ||
            selectNode.style.width.toString()) ? selectNode.style.width.toString() :
            isEmbedVidElemWidth !== '' ? isEmbedVidElemWidth : (parseInt(selectNode.getClientRects()[0].width.toString(), 10)).toString();
        const isEmbedVidElemHeight: string = this.isEmbedVidElem(selectNode) && e.selectNode[1] ? (e.selectNode[1] as HTMLElement).style.height : '';
        let height: string = (selectNode.style.height.toString() === 'auto' ||
            selectNode.style.height.toString()) ? selectNode.style.height.toString() :
            isEmbedVidElemHeight !== '' ? isEmbedVidElemHeight : (parseInt(selectNode.getClientRects()[0].height.toString(), 10).toString());
        if (selectNode.style.width === '' && isEmbedVidElemWidth === '') {
            width = 'auto';
        }
        if (selectNode.style.height === '' && isEmbedVidElemHeight === '') {
            height = 'auto';
        }
        const obj: IShowVideoDialog = {
            mode: 'Dimension', width: width, height: height, maxWidth: parseFloat(this.getMaxWidth() as string)
        };
        this.parent.dotNetRef.invokeMethodAsync(events.showVideoDialog, obj);
    }
    public insertVideoSize(width: number, height: number): void {
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
        if (this.vidResizeDiv) { this.vidResizePos(this.selectionObj.selectNode[0] as HTMLVideoElement, this.vidResizeDiv); }
        this.parent.dotNetRef.invokeMethodAsync(events.closeVideoDialog, null);
    }
    private alignmentSelect(e: ClickEventArgs): void {
        const item: IDropDownItemModel = e.item as IDropDownItemModel;
        if (!document.body.contains(document.body.querySelector('.e-rte-quick-toolbar')) || item.command !== 'Videos') {
            return;
        }
        const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
        let selectNodeEle: Node[] = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
        selectNodeEle = (this.isEmbedVidElem(selectNodeEle[0] as HTMLElement)) ? selectNodeEle : [this.vidEle];
        const args: IImageNotifyArgs = { args: e, selectNode: selectNodeEle };
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        switch (item.subCommand) {
        case 'JustifyLeft':
            this.alignVideo(args, 'JustifyLeft');
            break;
        case 'JustifyCenter':
            this.alignVideo(args, 'JustifyCenter');
            break;
        case 'JustifyRight':
            this.alignVideo(args, 'JustifyRight');
            break;
        case 'Inline':
            this.inline(args);
            break;
        case 'Break':
            this.break(args);
            break;
        }
        if (this.quickToolObj) {
            this.quickToolObj.hideVideoQTBar();
            removeClass([selectNodeEle[0] as HTMLElement], classes.CLS_VID_FOCUS);
        }
        this.cancelResizeAction();
    }
    private alignVideo(e: IImageNotifyArgs, type: string): void {
        const subCommand: string = ((e.args as ClickEventArgs).item) ?
            ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand : type;
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
    private break(e: IImageNotifyArgs): void {
        if (e.selectNode[0].nodeName !== 'VIDEO' && !this.isEmbedVidElem(e.selectNode[0] as HTMLElement)) {
            return;
        }
        const subCommand: string = ((e.args as ClickEventArgs).item) ?
            ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand : 'Break';
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    }
    private videoBrowseClick(): void {
        (document.getElementById(this.rteId + '_video').querySelector('.e-rte-video-dialog .e-file-select-wrap button') as HTMLButtonElement).click();
    }
    //#endregion
    //#region Interop methods
    public dialogOpened(): void {
        const dialogContent: HTMLElement = Browser.isDevice ? document.getElementById(this.rteId + '_video').querySelector('.e-video-content') :
            !isNOU(this.parent.element.querySelector('.e-rte-video-dialog .e-video-content')) ? this.parent.element.querySelector('.e-rte-video-dialog .e-video-content') : document.getElementById(this.rteId + '_video').querySelector('.e-video-content');
        if (isNOU(dialogContent)) { return; }
        const spanElement: HTMLElement = document.getElementById(this.rteId + '_dropText');
        const buttonElement: HTMLElement = document.getElementById(this.rteId + '_insertVideo');
        this.buttonClickElement = Browser.isDevice ? spanElement : buttonElement;
        EventHandler.add(this.buttonClickElement, 'click', this.videoBrowseClick, this);
        if (!isNOU(this.parent.insertVideoSettings.path) || this.parent.editorMode === 'HTML') {
            (dialogContent.querySelector('#' + this.rteId + '_insertVideo') as HTMLElement).focus();
        } else {
            (dialogContent.querySelector('.e-video-url') as HTMLElement).focus();
        }
    }
    public fileSelected(): void {
        if (this.inputUrl) { this.inputUrl.setAttribute('disabled', 'true'); }
        if (this.embedInputUrl) { this.embedInputUrl.setAttribute('disabled', 'true'); }
    }
    public fileUploadSuccess(url: string, fileName: string): void {
        this.inputUrl = this.parent.element.querySelector('.e-rte-video-dialog .e-video-url');
        this.embedInputUrl = this.parent.element.querySelector('.e-rte-video-dialog .e-embed-video-url');
        if (!isNOU(this.parent.insertVideoSettings.path)) {
            this.uploadUrl = {
                url: url, selection: this.vidUploadSave, fileName: fileName, selectParent: this.vidUploadSelectedParent,
                width: {
                    width: this.parent.insertVideoSettings.width, minWidth: this.parent.insertVideoSettings.minWidth,
                    maxWidth: this.getMaxWidth()
                }, height: {
                    height: this.parent.insertVideoSettings.height, minHeight: this.parent.insertVideoSettings.minHeight,
                    maxHeight: this.parent.insertVideoSettings.maxHeight
                }
            };
            if (this.inputUrl) { this.inputUrl.setAttribute('disabled', 'true'); }
            if (this.embedInputUrl) { this.embedInputUrl.setAttribute('disabled', 'true'); }
        }
    }
    public fileUploadComplete(base64Str: string, fileName: string): void {
        this.inputUrl = this.parent.element.querySelector('.e-rte-video-dialog .e-video-url');
        if (this.parent.editorMode === 'HTML' && isNOU(this.parent.insertVideoSettings.path)) {
            const url: string = this.parent.insertVideoSettings.saveFormat === 'Base64' ? base64Str :
                URL.createObjectURL(convertToBlob(base64Str));
            this.uploadUrl = {
                url: url, selection: this.vidUploadSave, fileName: fileName, selectParent: this.vidUploadSelectedParent,
                width: {
                    width: this.parent.insertVideoSettings.width, minWidth: this.parent.insertVideoSettings.minWidth,
                    maxWidth: this.getMaxWidth()
                }, height: {
                    height: this.parent.insertVideoSettings.height, minHeight: this.parent.insertVideoSettings.minHeight,
                    maxHeight: this.parent.insertVideoSettings.maxHeight
                }
            };
            if (this.inputUrl) { this.inputUrl.setAttribute('disabled', 'true'); }
            if (this.embedInputUrl) { this.embedInputUrl.setAttribute('disabled', 'true'); }
        }
    }
    public fileUploadChange(url: string, isStream: boolean): void {
        this.modifiedUrl = url;
        this.isStreamUrl = isStream;
    }
    public fileRemoving(): void {
        this.inputUrl.removeAttribute('disabled');
        this.embedInputUrl.removeAttribute('disabled');
        if (this.uploadUrl) { this.uploadUrl.url = ''; }
    }
    public dialogClosed(): void {
        if (this.parent.editorMode === 'HTML') {
            this.selectionObj.selection.restore();
        }
        if (this.buttonClickElement) { EventHandler.remove(this.buttonClickElement, 'click', this.videoBrowseClick); }
    }
    public insertVideoUrl(): void {
        const dialogElement: Element = this.parent.element.ownerDocument.querySelector('#' + this.rteId + '_video');
        if  (!Browser.isDevice) {
            this.inputUrl = !isNOU(this.parent.element.querySelector('.e-rte-video-dialog .e-video-url')) ?
                this.parent.element.querySelector('.e-rte-video-dialog .e-video-url') : dialogElement.querySelector('.e-rte-elements .e-rte-video-dialog .e-video-url');
            this.embedInputUrl = !isNOU(this.parent.element.querySelector('.e-rte-video-dialog .e-embed-video-url')) ?
                this.parent.element.querySelector('.e-rte-video-dialog .e-embed-video-url') : dialogElement.querySelector('.e-rte-elements .e-rte-video-dialog .e-embed-video-url');
        } else {
            this.inputUrl = this.parent.inputElement.ownerDocument.querySelector('#' + this.rteId + '_video').querySelector('.e-rte-video-dialog .e-video-url');
            this.embedInputUrl = this.parent.inputElement.ownerDocument.querySelector('#' + this.rteId + '_video').querySelector('.e-rte-video-dialog .e-embed-video-url');
        }
        let url: string;
        if (!isNOU(this.inputUrl)) { url = this.inputUrl.value; }
        let embedUrl: string;
        if (!isNOU(this.embedInputUrl)) { embedUrl = this.embedInputUrl.value; }
        if (this.isStreamUrl && this.modifiedUrl !== '') {
            this.uploadUrl.url = this.modifiedUrl;
            this.modifiedUrl = '';
        }
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        if (!isNOU(this.uploadUrl) && this.uploadUrl.url !== '') {
            this.uploadUrl.cssClass = this.parent.insertVideoSettings.layoutOption.toLowerCase() === 'inline' ? classes.CLS_VIDINLINE : classes.CLS_VIDBREAK;
            (this.parent.dotNetRef.invokeMethodAsync(events.closeVideoDialog, null) as unknown as Promise<DialogCloseEventArgs>)
                .then(() => {
                    const dialogElement: HTMLElement = this.parent.element.ownerDocument.querySelector('#' + this.rteId + '_video');
                    if (!isNOU(dialogElement)) {
                        return;
                    } else {
                        this.uploadUrl.isEmbedUrl = false;
                        this.parent.formatter.process(
                            this.parent, this.selectionObj.args, (this.selectionObj.args as ClickEventArgs).originalEvent, this.uploadUrl);
                        if (this.parent.getEditPanel().querySelector('.e-video-resize')) {
                            (this.vidEle as HTMLElement).style.outline = '';
                            this.removeResizeEle();
                        }
                    }
                });
        } else if (this.parent.editorMode === 'HTML' && (!isNOU(url) || !isNOU(embedUrl))) {
            if (this.parent.editorMode === 'HTML' && isNOU(
                closest(this.selectionObj.selection.range.startContainer.parentNode, '#' + this.parent.getPanel().id))) {
                (this.parent.getEditPanel() as HTMLElement).focus();
                const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
                this.selectionObj.selection = this.parent.formatter.editorManager.nodeSelection.save(range, this.parent.getDocument());
                this.selectionObj.selectParent = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            }
            const name: string = !isNOU(url) ? url.split('/')[url.split('/').length - 1] : embedUrl;
            const value: IVideoCommandsArgs = {
                cssClass: (this.parent.insertVideoSettings.layoutOption.toLowerCase() === 'inline' ? classes.CLS_VIDINLINE : classes.CLS_VIDBREAK),
                url: url, selection: this.selectionObj.selection, fileName: name, isEmbedUrl: !isNOU(embedUrl) ? true : false,
                selectParent: this.selectionObj.selectParent, width: {
                    width: this.parent.insertVideoSettings.width, minWidth: this.parent.insertVideoSettings.minWidth,
                    maxWidth: this.getMaxWidth()
                },
                height: {
                    height: this.parent.insertVideoSettings.height, minHeight: this.parent.insertVideoSettings.minHeight,
                    maxHeight: this.parent.insertVideoSettings.maxHeight
                }
            };
            (this.parent.dotNetRef.invokeMethodAsync(events.closeVideoDialog, null) as unknown as Promise<DialogCloseEventArgs>)
                .then(() => {
                    const dialogElement: HTMLElement = this.parent.element.ownerDocument.querySelector('#' + this.rteId + '_video');
                    if (!isNOU(dialogElement)) {
                        return;
                    } else{
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
            this.videoDialog({
                args: {
                    item: { command: 'Videos', subCommand: 'Video' } as IToolbarItemModel,
                    originalEvent: isExternal ? undefined : event,
                    name: isExternal ? 'showDialog' : null
                },
                selectNode: selectNodeEle,
                selection: save,
                selectParent: selectParentEle
            });
        }
    }
    //#endregion
    //#region Event handler methods
    private onCutHandler(): void {
        if (this.vidResizeDiv && this.parent.getEditPanel().contains(this.vidResizeDiv)) {
            this.cancelResizeAction();
        }
    }
    private onIframeMouseDown(e: MouseEvent): void {
        this.parent.dotNetRef.invokeMethodAsync(events.closeVideoDialog, null);
        this.onDocumentClick(e);
    }
    private onDocumentClick(e: MouseEvent): void {
        const target: HTMLElement = <HTMLElement>e.target;
        if (target.nodeName === 'VIDEO' || this.isEmbedVidElem(target)) {
            this.vidEle = !this.isEmbedVidElem(target) ? (target as HTMLVideoElement) : target.querySelector('iframe');
        }
        const dlgEle: HTMLElement = document.body.querySelector('#' + this.rteId + '_video.e-rte-video-dialog');
        if (!isNOU(dlgEle) && ((
            !closest(target, '#' + this.rteId + '_video') && this.parent.toolbarSettings.enable && this.parent.getToolbarElement() &&
            !this.parent.getToolbarElement().contains(e.target as Node)) ||
            (this.parent.getToolbarElement() && this.parent.getToolbarElement().contains(e.target as Node) &&
                !closest(target, '#' + this.rteId + '_toolbar_Video') &&
                !target.querySelector('#' + this.rteId + '_toolbar_Video')))
        ) {
            if (!(e.offsetX > (e.target as HTMLVideoElement).clientWidth || e.offsetY > (e.target as HTMLVideoElement).clientHeight)) {
                this.parent.dotNetRef.invokeMethodAsync(events.closeVideoDialog, events.outsideClicked);
                this.parent.isBlur = true;
                if (Browser.isIE) {
                    dispatchEvent(this.parent.element, 'focusout');
                }
            }
        }
        if (this.parent.getEditPanel().querySelector('.e-vid-resize')) {
            if (target.tagName !== 'VIDEO' && !this.isEmbedVidElem(target)) { this.removeResizeEle(); }
            if ((target.tagName !== 'VIDEO' && !this.isEmbedVidElem(target)) && !isNOU(this.vidEle)) {
                this.vidEle.style.outline = '';
            } else if (!isNOU(this.prevSelectedVidEle) &&
            this.prevSelectedVidEle !== ((target.tagName === 'IFRAME' || target.tagName === 'VIDEO') ? target : target.querySelector('iframe'))) {
                this.prevSelectedVidEle.style.outline = '';
            }
        }
        if (this.parent.inlineMode.enable && !isNOU(target) && !isNOU(dlgEle) && (!closest(target, '#' + this.rteId + '_video'))) {
            this.parent.dotNetRef.invokeMethodAsync(events.closeVideoDialog, events.outsideClicked);
        }
    }
    private videoClick(e: MouseEvent): void {
        if (Browser.isDevice) {
            if (((e.target as HTMLElement).tagName === 'VIDEO' || this.isEmbedVidElem(e.target as HTMLElement))) {
                this.parent.getEditPanel().setAttribute('contenteditable', 'false');
                (e.target as HTMLElement).focus();
            } else {
                if (!this.parent.readonly) {
                    this.parent.getEditPanel().setAttribute('contenteditable', 'true');
                }
            }
        }
        if ((e.target as HTMLElement).tagName === 'VIDEO' || this.isEmbedVidElem(e.target as HTMLElement) && !this.parent.userAgentData.isSafari()) {
            e.preventDefault();
        }
    }
    private onKeyDown(event: NotifyArgs): void {
        const originalEvent: KeyboardEventArgs = event.args as KeyboardEventArgs;
        let range: Range;
        let save: NodeSelection;
        let selectNodeEle: Node[]; let selectParentEle: Node[]; this.deletedVid = []; let isCursor: boolean;
        const keyCodeValues: number[] = [27, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123,
            44, 45, 9, 16, 17, 18, 19, 20, 33, 34, 35, 36, 37, 38, 39, 40, 91, 92, 93, 144, 145, 182, 183];
        if (this.parent.editorMode === 'HTML') {
            range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
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
                ((selectParentEle[0] as HTMLElement).tagName === 'VIDEO' || this.isEmbedVidElem(selectParentEle[0] as HTMLElement)) && (selectParentEle[0] as HTMLElement).parentElement) {
                const prev: Node = ((selectParentEle[0] as HTMLElement).parentElement as HTMLElement);
                if (this.parent.getEditPanel().querySelector('.e-vid-resize')) {
                    this.removeResizeEle();
                }
                removeClass([selectParentEle[0] as HTMLElement], classes.CLS_VID_FOCUS);
                if (this.quickToolObj) {
                    this.quickToolObj.hideVideoQTBar();
                }
                if (!isNOU(this.vidEle)) {
                    this.vidEle.style.outline = '';
                }
            }
        }
        if (originalEvent.ctrlKey && (originalEvent.keyCode === 89 || originalEvent.keyCode === 90)) {
            this.undoStack({ subCommand: (originalEvent.keyCode === 90 ? 'undo' : 'redo') });
        }
        if (originalEvent.keyCode === 8 || originalEvent.keyCode === 46) {
            if (selectNodeEle && selectNodeEle[0] &&
                ((selectNodeEle[0].nodeName === 'VIDEO' || this.isEmbedVidElem(selectNodeEle[0] as HTMLElement)) ||
                (originalEvent.keyCode === 46 && (selectNodeEle[0].nextSibling as HTMLElement) &&
                ((selectNodeEle[0].nextSibling as HTMLElement).className === 'e-video-wrap' || this.isEmbedVidElem(selectNodeEle[0].nextSibling as HTMLElement))) ||
                (originalEvent.keyCode === 8 && (selectNodeEle[0].previousSibling as HTMLElement) &&
                ((selectNodeEle[0].previousSibling as HTMLElement).className === 'e-video-wrap' || this.isEmbedVidElem(selectNodeEle[0].previousSibling as HTMLElement)))) &&
                selectNodeEle.length <= 2 && selectNodeEle[0].nodeName !== '#text') {
                originalEvent.preventDefault();
                const event: IImageNotifyArgs = {
                    selectNode: selectNodeEle, selection: save, selectParent: selectParentEle,
                    args: {
                        item: { command: 'Videos', subCommand: 'Remove' } as IToolbarItemModel,
                        originalEvent: originalEvent
                    }
                };
                this.deleteVid(event, originalEvent.keyCode);
            }
            if (this.parent.getEditPanel().querySelector('.e-vid-resize')) {
                this.removeResizeEle();
            }
        }
        switch (originalEvent.action) {
        case 'escape':
            this.parent.dotNetRef.invokeMethodAsync(events.closeVideoDialog, null);
            break;
        case 'insert-video':
            this.showDialog(false, originalEvent, save, selectNodeEle, selectParentEle);
            originalEvent.preventDefault();
            break;
        case 'backspace':
        case 'delete':
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
                } else if (range.startContainer.nodeType === 1 &&
                    !isNOU((range.startContainer as HTMLElement).querySelector('.e-video-wrap')) && originalEvent.code === 'Delete') {
                    detach((range.startContainer as HTMLElement).querySelector('.e-video-wrap'));
                }
            }
            break;
        }
        if (originalEvent.ctrlKey && originalEvent.key === 'a') {
            this.handleSelectAll();
        }
    }

    private handleSelectAll(): void {
        this.cancelResizeAction();
        const videoFocusNodes : NodeList = this.parent.inputElement.querySelectorAll('.' + classes.CLS_VID_FOCUS);
        removeClass(videoFocusNodes, classes.CLS_VID_FOCUS);
    }

    private onKeyUp(event: NotifyArgs): void {
        if (!isNOU(this.deletedVid) && this.deletedVid.length > 0) {
            for (let i: number = 0; i < this.deletedVid.length; i++) {
                const args: MediaDeletedEventArgs = {
                    src: (this.deletedVid[i as number] as HTMLElement).getAttribute('src')
                };
                if (this.parent.mediaDeleteEnabled) { this.parent.dotNetRef.invokeMethodAsync('MediaDeleted', args); }
            }
        }
    }
    private resizeStart(e: PointerEvent | TouchEvent, ele?: Element): void {
        if (this.parent.readonly) {
            return;
        }
        const target: HTMLElement = ele ? ele as HTMLElement : !this.isEmbedVidElem(e.target as HTMLElement) ? e.target as HTMLElement : (e.target as HTMLElement).querySelector('iframe');
        this.prevSelectedVidEle = this.vidEle;
        if ((target as HTMLElement).tagName === 'VIDEO' || (target as HTMLElement).tagName === 'IFRAME') {
            this.parent.preventDefaultResize(e as MouseEvent, false);
            const video: HTMLVideoElement = target as HTMLVideoElement;
            if (this.vidResizeDiv && this.parent.getEditPanel().contains(this.vidResizeDiv)) { detach(this.vidResizeDiv); }
            this.videoResize(video);
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
            if (this.quickToolObj) { this.quickToolObj.hideVideoQTBar(); }
            if ((target as HTMLElement).classList.contains('e-rte-topLeft')) { this.resizeBtnStat.topLeft = true; }
            if ((target as HTMLElement).classList.contains('e-rte-topRight')) { this.resizeBtnStat.topRight = true; }
            if ((target as HTMLElement).classList.contains('e-rte-botLeft')) { this.resizeBtnStat.botLeft = true; }
            if ((target as HTMLElement).classList.contains('e-rte-botRight')) { this.resizeBtnStat.botRight = true; }
            if (Browser.isDevice && this.parent.getEditPanel().contains(this.vidResizeDiv) &&
                !this.vidResizeDiv.classList.contains('e-mob-span')) {
                addClass([this.vidResizeDiv], 'e-mob-span');
            } else {
                const args: ResizeArgs = { requestType: 'Videos' };
                if (this.parent.onResizeStartEnabled) {
                    (this.parent.dotNetRef.invokeMethodAsync('ResizeStartEvent', args) as unknown as Promise<ResizeArgs>).then((resizeStartArgs: ResizeArgs) => {
                        if (resizeStartArgs.cancel) { this.cancelResizeAction(); }
                    });
                }
            }
            EventHandler.add(this.parent.getDocument(), Browser.touchEndEvent, this.resizeEnd, this);
        }
    }
    private resizing(e: PointerEvent | TouchEvent): void {
        if (this.vidEle.offsetWidth >= this.getMaxWidth()) {
            this.vidEle.style.maxHeight = this.vidEle.offsetHeight + 'px';
        }
        const pageX: number = this.getPointX(e);
        const pageY: number = this.getPointY(e);
        const mouseX: number = (this.resizeBtnStat.botLeft || this.resizeBtnStat.topLeft) ? -(pageX - this.pageX) : (pageX - this.pageX);
        const mouseY: number = (this.resizeBtnStat.topLeft || this.resizeBtnStat.topRight) ? -(pageY - this.pageY) : (pageY - this.pageY);
        const width: number = parseInt(this.vidDupPos.width as string, 10) + mouseX;
        const height: number = parseInt(this.vidDupPos.height as string, 10) + mouseY;
        this.pageX = pageX;
        this.pageY = pageY;
        this.mouseX = mouseX;
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
    private resizeEnd(e: PointerEvent | TouchEvent): void {
        this.resizeBtnInit();
        this.vidEle.parentElement.style.cursor = 'auto';
        if (Browser.isDevice) { removeClass([(e.target as HTMLElement).parentElement], 'e-mob-span'); }
        const args: ResizeArgs = { requestType: 'Videos' };
        if (this.parent.onResizeStopEnabled) { this.parent.dotNetRef.invokeMethodAsync('ResizeStopEvent', args); }
        this.parent.formatter.editorManager.observer.on(events.checkUndo, this.undoStack, this);
        this.parent.formatter.saveData();
    }
    //#endregion
    public destroy(): void {
        this.prevSelectedVidEle = undefined;
        this.removeEventListener();
    }
}
