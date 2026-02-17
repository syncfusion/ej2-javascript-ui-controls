import { addClass, detach, EventHandler, L10n, isNullOrUndefined, KeyboardEventArgs, Ajax, MouseEventArgs } from '@syncfusion/ej2-base';
import { Browser, closest, removeClass, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { AfterMediaDeleteEventArgs, SlashMenuItemSelectArgs, IQuickToolbar, IRenderer } from '../base/interface';
import { IRichTextEditor, IImageNotifyArgs } from '../base/interface';
import { IDropDownItemModel, IToolbarItemModel, NotifyArgs, IShowPopupArgs, IAudioCommandsArgs, MediaDropEventArgs, ActionBeginEventArgs } from '../../common/interface';
import * as events from '../base/constant';
import * as classes from '../base/classes';
import { CLS_AUD_FOCUS } from '../../common/constant';
import { ServiceLocator } from '../services/service-locator';
import { NodeSelection } from '../../selection/selection';
import { Uploader, SelectedEventArgs, MetaData, FileInfo, BeforeUploadEventArgs } from '@syncfusion/ej2-inputs';
import { RemovingEventArgs, UploadingEventArgs, ProgressEventArgs } from '@syncfusion/ej2-inputs';
import { Dialog, DialogModel, Popup } from '@syncfusion/ej2-popups';
import { Button } from '@syncfusion/ej2-buttons';
import { RendererFactory } from '../services/renderer-factory';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { RenderType } from '../base/enum';
import { dispatchEvent, hasClass } from '../base/util';
import { DialogRenderer } from './dialog-renderer';
import { isIDevice, convertToBlob} from '../../common/util';
import { AudioCommand } from '../../editor-manager/plugin/audio';
import { PopupUploader } from './popup-uploader-renderer';
import * as EVENTS from './../../common/constant';
/**
 * `Audio` module is used to handle audio actions.
 */
export class Audio {
    public element: HTMLElement;
    private rteID: string;
    private parent: IRichTextEditor;
    public dialogObj: Dialog;
    public uploadObj: Uploader;
    private popupObj: Popup;
    public popupUploaderObj: PopupUploader;
    private button: Button
    private i10n: L10n;
    private inputUrl: HTMLElement;
    private uploadUrl: IAudioCommandsArgs;
    private contentModule: IRenderer;
    private rendererFactory: RendererFactory;
    private quickToolObj: IQuickToolbar;
    private audEle: HTMLAudioElement;
    private isAudioUploaded: boolean = false;
    private isAllowedTypes: boolean = true;
    private dialogRenderObj: DialogRenderer;
    private deletedAudio: Node[] = [];
    private removingAudioName: string;
    private prevSelectedAudEle: HTMLAudioElement;
    private showPopupTime: number;
    private isDestroyed: boolean;
    private docClick: EventListenerOrEventListenerObject
    private audioDragPopupTime: number;
    private showAudioQTbarTime: number;
    public isAudioRemoved: boolean;
    public isAudioClicked: boolean;

    private constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.rteID = parent.element.id;
        this.i10n = serviceLocator.getService<L10n>('rteLocale');
        this.rendererFactory = serviceLocator.getService<RendererFactory>('rendererFactory');
        this.dialogRenderObj = serviceLocator.getService<DialogRenderer>('dialogRenderObject');
        this.popupUploaderObj = serviceLocator.getService<PopupUploader>('popupUploaderObject');
        this.addEventListener();
        this.docClick = this.onDocumentClick.bind(this);
        this.isDestroyed = false;
    }

    protected addEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.keyDown, this.onKeyDown, this);
        this.parent.on(events.keyUp, this.onKeyUp, this);
        this.parent.on(events.insertAudio, this.insertingAudio, this);
        this.parent.on(events.initialEnd, this.afterRender, this);
        this.parent.on(events.dynamicModule, this.afterRender, this);
        this.parent.on(events.showAudioDialog, this.showDialog, this);
        this.parent.on(events.closeAudioDialog, this.closeDialog, this);
        this.parent.on(events.audioToolbarAction, this.onToolbarAction, this);
        this.parent.on(events.dropDownSelect, this.alignmentSelect, this);
        this.parent.on(events.audioDelete, this.deleteAudio, this);
        this.parent.on(events.editAreaClick, this.editAreaClickHandler, this);
        this.parent.on(events.insertCompleted, this.showAudioQuickToolbar, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.iframeMouseDown, this.closeDialog, this);
        this.parent.on(events.bindOnEnd, this.bindOnEnd, this);
    }

    protected removeEventListener(): void {
        this.parent.off(events.keyDown, this.onKeyDown);
        this.parent.off(events.keyUp, this.onKeyUp);
        this.parent.off(events.insertAudio, this.insertingAudio);
        this.parent.off(events.initialEnd, this.afterRender);
        this.parent.off(events.dynamicModule, this.afterRender);
        this.parent.off(events.showAudioDialog, this.showDialog);
        this.parent.off(events.closeAudioDialog, this.closeDialog);
        this.parent.off(events.bindOnEnd, this.bindOnEnd);
        this.parent.off(events.audioToolbarAction, this.onToolbarAction);
        this.parent.off(events.dropDownSelect, this.alignmentSelect);
        this.parent.off(events.audioDelete, this.deleteAudio);
        this.parent.off(events.editAreaClick, this.editAreaClickHandler);
        this.parent.off(events.insertCompleted, this.showAudioQuickToolbar);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.iframeMouseDown, this.closeDialog);
        this.parent.off(EVENTS.touchStart, this.touchStart);
        this.parent.off(EVENTS.touchEnd, this.audioClick);
        this.parent.off(EVENTS.dropEvent, this.dragDrop);
        this.parent.off(EVENTS.dragEnter, this.dragEnter);
        this.parent.off(EVENTS.dragOver, this.dragOver);
        if (!isNullOrUndefined(this.contentModule)) {
            (this.parent.element.ownerDocument as Document).removeEventListener('mousedown', this.docClick);
            this.docClick = null;
        }
    }

    private bindOnEnd(): void {
        if (!this.parent.formatter.editorManager.audioObj) {
            this.parent.formatter.editorManager.audioObj = new AudioCommand(this.parent.formatter.editorManager);
        }
    }

    private afterRender(): void {
        this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
        const dropElement: HTMLElement | Document = this.parent.iframeSettings.enable ?
            this.parent.inputElement.ownerDocument : this.parent.inputElement;
        this.parent.on(EVENTS.dropEvent, this.dragDrop, this);
        this.parent.on(EVENTS.dragEnter, this.dragEnter, this);
        this.parent.on(EVENTS.dragOver, this.dragOver, this);
        this.parent.on(EVENTS.touchStart,  this.touchStart, this);
        this.parent.on(EVENTS.touchEnd, this.audioClick, this);
        (this.parent.element.ownerDocument as Document).addEventListener('mousedown', this.docClick);
    }

    private checkAudioBack(range: Range): void {
        if (range.startContainer.nodeName === '#text' && range.startOffset === 0 &&
            !isNOU(range.startContainer.previousSibling) && this.isAudioElem(range.startContainer.previousSibling as HTMLElement)) {
            this.deletedAudio.push(range.startContainer.previousSibling);
        } else if (range.startContainer.nodeName !== '#text' && !isNOU(range.startContainer.childNodes[range.startOffset - 1]) &&
            this.isAudioElem(range.startContainer.childNodes[range.startOffset - 1] as HTMLElement)) {
            this.deletedAudio.push(range.startContainer.childNodes[range.startOffset - 1]);
        }
    }
    private checkAudioDel(range: Range): void {
        if (range.startContainer.nodeName === '#text' && range.startOffset === range.startContainer.textContent.length &&
            !isNOU(range.startContainer.nextSibling) && range.startContainer.nextSibling.nodeName === 'AUDIO') {
            this.deletedAudio.push(range.startContainer.nextSibling);
        } else if (range.startContainer.nodeName !== '#text' && !isNOU(range.startContainer.childNodes[range.startOffset]) &&
            this.isAudioElem(range.startContainer.childNodes[range.startOffset] as HTMLElement)) {
            this.deletedAudio.push(range.startContainer.childNodes[range.startOffset]);
        }
    }

    private undoStack(args?: { [key: string]: string }): void {
        if ((args.subCommand.toLowerCase() === 'undo' || args.subCommand.toLowerCase() === 'redo') && this.parent.editorMode === 'HTML') {
            for (let i: number = 0; i < this.parent.formatter.getUndoRedoStack().length; i++) {
                const temp: Element = this.parent.createElement('div');
                const contentElem: DocumentFragment = this.parent.formatter.getUndoRedoStack()[i as number].text as DocumentFragment;
                temp.appendChild(contentElem.cloneNode(true));
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private touchStart(e: PointerEvent | TouchEvent, ele?: Element): void {
        if (this.parent.readonly) {
            return;
        }
        this.prevSelectedAudEle = this.audEle;
    }

    private onToolbarAction(args: NotifyArgs): void {
        if (isIDevice()) {
            this.parent.notify(events.selectionRestore, {});
        }
        const item: IToolbarItemModel = (args.args as ClickEventArgs).item as IToolbarItemModel;
        switch (item.subCommand) {
        case 'AudioReplace':
            this.parent.notify(events.insertAudio, args);
            break;
        case 'AudioRemove':
            this.parent.notify(events.audioDelete, args);
            break;
        }
    }

    // eslint-disable-next-line
    private onKeyUp(event: NotifyArgs): void {
        if (!isNOU(this.deletedAudio) && this.deletedAudio.length > 0) {
            for (let i: number = 0; i < this.deletedAudio.length; i++) {
                const elem: HTMLElement = this.deletedAudio[i as number] as HTMLElement;
                const srcElem: HTMLElement = elem.tagName === 'SOURCE' ? elem : elem.querySelector('source');
                const args: AfterMediaDeleteEventArgs = {
                    element: (this.deletedAudio[i as number] as HTMLElement).querySelector('audio'),
                    src: srcElem.getAttribute('src')
                };
                this.parent.trigger(events.afterMediaDelete, args);
            }
        }
    }

    private onKeyDown(event: NotifyArgs): void {
        const originalEvent: KeyboardEventArgs = event.args as KeyboardEventArgs;
        let range: Range;
        let save: NodeSelection;
        let selectNodeEle: Node[];
        let selectParentEle: Node[];
        this.deletedAudio = [];
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
                if (this.isAudioElem(nodes[i as number] as HTMLElement)) {
                    this.deletedAudio.push(nodes[i as number]);
                }
            }
        }
        if (this.parent.editorMode === 'HTML' && ((originalEvent.which === 8 && originalEvent.code === 'Backspace') ||
            (originalEvent.which === 46 && originalEvent.code === 'Delete'))) {
            const isCursor: boolean = range.startContainer === range.endContainer && range.startOffset === range.endOffset;
            if ((originalEvent.which === 8 && originalEvent.code === 'Backspace' && isCursor)) {
                this.checkAudioBack(range);
            } else if ((originalEvent.which === 46 && originalEvent.code === 'Delete' && isCursor)) {
                this.checkAudioDel(range);
            }
        }
        if (!isNullOrUndefined(this.parent.formatter.editorManager.nodeSelection) &&
            originalEvent.code !== 'KeyK') {
            range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            selectNodeEle = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
            selectParentEle = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            if (!originalEvent.ctrlKey && originalEvent.key && (originalEvent.key.length === 1 || originalEvent.action === 'enter') &&
                (this.isAudioElem(selectParentEle[0] as HTMLElement)) && (selectParentEle[0] as HTMLElement).parentElement) {
                const prev: Node = ((selectParentEle[0] as HTMLElement).parentElement as HTMLElement).childNodes[0];
                this.parent.formatter.editorManager.nodeSelection.setSelectionText(
                    this.contentModule.getDocument(), prev, prev, prev.textContent.length, prev.textContent.length);
                removeClass([selectParentEle[0] as HTMLElement], CLS_AUD_FOCUS);
                this.quickToolObj.audioQTBar.hidePopup();
            }
        }
        if (originalEvent.ctrlKey && (originalEvent.keyCode === 89 || originalEvent.keyCode === 90)) {
            this.undoStack({ subCommand: (originalEvent.keyCode === 90 ? 'undo' : 'redo') });
        }
        if (originalEvent.keyCode === 8 || originalEvent.keyCode === 46) {
            if (selectNodeEle && selectNodeEle[0]) {
                // Is Audio element selected to delete
                const isAudioSelected: boolean = this.isAudioElem(selectNodeEle[0] as HTMLElement);
                // Is Delete Key is pressed to remove audio
                const isAudioDeleteKeyPress: boolean = originalEvent.keyCode === 46 &&
                    ((selectNodeEle[0].nextSibling as HTMLElement) &&
                    this.isAudioElem(selectNodeEle[0].nextSibling as HTMLElement) &&
                    (range.startOffset === range.endOffset) &&
                    (range.startContainer.textContent.length === range.startOffset));
                // Is Backspace key is pressed to remove audio
                const isAudioBackSpaceKeyPress: boolean = originalEvent.keyCode === 8 &&
                    ((selectNodeEle[0].previousSibling as HTMLElement) &&
                    this.isAudioElem(selectNodeEle[0].previousSibling as HTMLElement) &&
                    (range.startOffset === range.endOffset) && range.startOffset === 0);
                if ((isAudioSelected || isAudioBackSpaceKeyPress || isAudioDeleteKeyPress)) {
                    if (!isNullOrUndefined(this.parent.formatter.editorManager.nodeSelection))
                    {save = this.parent.formatter.editorManager.nodeSelection.save(range, this.parent.contentModule.getDocument()); }
                    originalEvent.preventDefault();
                    const event: IImageNotifyArgs = {
                        selectNode: selectNodeEle, selection: save, selectParent: selectParentEle,
                        args: {
                            item: { command: 'Audios', subCommand: 'AudioRemove' } as IToolbarItemModel,
                            originalEvent: originalEvent
                        }
                    };
                    this.deleteAudio(event, originalEvent.keyCode);
                }
            }
        }
        this.isAudioRemoved = false;
        switch (originalEvent.action) {
        case 'escape':
            if (!isNullOrUndefined(this.dialogObj)) {
                this.dialogObj.close();
            }
            break;
        case 'backspace':
        case 'delete':
            for (let i: number = 0; i < this.deletedAudio.length; i++) {
                const src: string = (this.deletedAudio[i as number] as HTMLAudioElement).src;
                if (!isNullOrUndefined(src) && src !== '') {
                    this.audioRemovePost(src as string);
                }
            }
            if (this.parent.editorMode !== 'Markdown' && range.startContainer === range.endContainer && range.startOffset === range.endOffset) {
                if (range.startContainer.nodeType === 3) {
                    if (originalEvent.code === 'Backspace') {
                        if ((range.startContainer as HTMLElement).previousElementSibling && range.startOffset === 0 &&
                            (range.startContainer as HTMLElement).previousElementSibling.classList.contains(classes.CLS_AUDIOWRAP)) {
                            detach((range.startContainer as HTMLElement).previousElementSibling);
                            this.isAudioRemoved = true;
                        }
                    } else {
                        if ((range.startContainer as HTMLElement).nextElementSibling &&
                            range.endContainer.textContent.length === range.endOffset &&
                            (range.startContainer as HTMLElement).nextElementSibling.classList.contains(classes.CLS_AUDIOWRAP)) {
                            detach((range.startContainer as HTMLElement).nextElementSibling);
                            this.isAudioRemoved = true;
                        }
                    }
                } else if (range.startContainer.nodeType === 1 && ((range.startContainer as HTMLElement).classList &&
                    ((range.startContainer as HTMLElement).classList.contains(classes.CLS_AUDIOWRAP) ||
                    (range.startContainer as HTMLElement).classList.contains(classes.CLS_CLICKELEM) ||
                    (range.startContainer as HTMLElement).classList.contains(classes.CLS_VID_CLICK_ELEM)))) {
                    detach((range.startContainer as HTMLElement));
                }
            }
            break;
        case 'insert-audio':
            if (!isNullOrUndefined(this.parent.formatter.editorManager.nodeSelection))
            {save = this.parent.formatter.editorManager.nodeSelection.save(range, this.parent.contentModule.getDocument()); }
            this.openDialog(true, originalEvent, save, selectNodeEle, selectParentEle);
            originalEvent.preventDefault();
            break;
        }
        if (originalEvent.ctrlKey && originalEvent.key === 'a') {
            this.handleSelectAll();
        }
    }

    private handleSelectAll(): void {
        const audioFocusNodes: NodeListOf<Element> = this.parent.inputElement.querySelectorAll('.' + CLS_AUD_FOCUS);
        removeClass(audioFocusNodes, CLS_AUD_FOCUS);
    }

    private openDialog(
        isInternal?: boolean, event?: KeyboardEventArgs | MouseEventArgs,
        selection?: NodeSelection, ele?: Node[], parentEle?: Node[]
    ): void {
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
            this.insertAudio({
                args: {
                    item: { command: 'Audios', subCommand: 'Audio' } as IToolbarItemModel,
                    originalEvent: event,
                    name: !isInternal ? 'showDialog' : null
                },
                selectNode: selectNodeEle,
                selection: save,
                selectParent: selectParentEle
            });
        }
    }

    private showDialog(args?: SlashMenuItemSelectArgs): void {
        if (!isNOU(args.originalEvent)) {
            this.openDialog(false, args.originalEvent as MouseEventArgs);
        } else {
            this.openDialog(false);
        }
    }

    private closeDialog(): void {
        if (this.dialogObj) { this.dialogObj.hide({ returnValue: true } as Event); }
    }

    private deleteAudio(e: IImageNotifyArgs, keyCode?: number): void {
        if (!this.isAudioElem(e.selectNode[0] as HTMLElement)) { return; }
        if (this.audEle) {
            if (e.selectNode[0].nodeType === 3) {
                e.selectNode[0] = this.audEle;
            } else if (this.isAudioElem(e.selectNode[0] as HTMLElement)) {
                e.selectNode[0] = (e.selectNode[0] as HTMLElement).classList.contains(classes.CLS_AUDIOWRAP) ? e.selectNode[0] :
                    (e.selectNode[0] as HTMLElement).parentElement;
            }
        }
        const args: AfterMediaDeleteEventArgs = {
            element: (e.selectNode[0] as HTMLElement).querySelector('audio'),
            src: (e.selectNode[0] as HTMLElement).querySelector('source').getAttribute('src')
        };
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        e.selection.restore();
        this.parent.formatter.process(
            this.parent, e.args, (e.args as ClickEventArgs),
            {
                selectNode: e.selectNode,
                subCommand: ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand
            });
        this.audioRemovePost(args.src);
        if (this.quickToolObj && document.body.contains(this.quickToolObj.audioQTBar.element)) {
            this.quickToolObj.audioQTBar.hidePopup();
        }
        if (isNullOrUndefined(keyCode)) {
            this.parent.trigger(events.afterMediaDelete, args);
        }
    }

    private audioRemovePost(src: string): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: Audio = this;
        let absoluteUrl: string = '';
        if (isNOU(this.parent.insertAudioSettings.removeUrl) || this.parent.insertAudioSettings.removeUrl === '') { return; }
        if (src.indexOf('http://') > -1 || src.indexOf('https://') > -1) {
            absoluteUrl = src;
        } else {
            absoluteUrl = new URL(src, document.baseURI).href;
        }
        this.removingAudioName = absoluteUrl.replace(/^.*[\\/]/, '');
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
        const removeUrl: string = this.parent.insertAudioSettings.removeUrl;
        if (isNOU(removeUrl) || removeUrl === '') { return; }
        const file: File = new File([response], this.removingAudioName);
        const ajax: Ajax = new Ajax(removeUrl, 'POST', true, null);
        const formData: FormData = new FormData();
        formData.append('UploadFiles', file);
        ajax.send(formData);
    }

    private audioClick(e: MouseEvent): void {
        if (Browser.isDevice) {
            if (this.isAudioElem(e.target as HTMLElement)) {
                (e.target as HTMLElement).focus();
                this.isAudioClicked = true;
            } else {
                if (!this.parent.readonly && !this.parent.videoModule.isVideoClicked && !this.parent.imageModule.isImageClicked) {
                    this.isAudioClicked = false;
                }
            }
        }
        if (this.isAudioElem(e.target as HTMLElement) && !this.parent.userAgentData.isSafari()) {
            this.audEle = (e.target as HTMLElement).querySelector('audio') as HTMLAudioElement;
            e.preventDefault();
        }
    }

    private onDocumentClick(e: MouseEvent): void {
        const target: HTMLElement = <HTMLElement>e.target;
        if (isNOU(this.contentModule.getEditPanel())) {
            return;
        }
        if (this.isAudioElem(target)) {
            this.audEle = (target as HTMLElement).querySelector('audio') as HTMLAudioElement;
        }
        if (!isNullOrUndefined(this.dialogObj) && ((
            // eslint-disable-next-line
            !closest(target, '[id=' + "'" + this.dialogObj.element.id + "'" + ']') && this.parent.toolbarSettings.enable && this.parent.getToolbarElement() &&
            !this.parent.getToolbarElement().contains(e.target as Node)) ||
            (this.parent.getToolbarElement() && this.parent.getToolbarElement().contains(e.target as Node) &&
            !closest(target, '#' + this.parent.getID() + '_toolbar_Audio') &&
            !target.querySelector('#' + this.parent.getID() + '_toolbar_Audio')))
        ) {
            /* eslint-disable */
            if (e.offsetX > (e.target as HTMLElement).clientWidth || e.offsetY > (e.target as HTMLElement).clientHeight) {
            } else {
                this.parent.notify(events.documentClickClosedBy, { closedBy: "outside click" });
                this.dialogObj.hide({ returnValue: true } as Event);
                this.parent.isBlur = true;
                dispatchEvent(this.parent.element, 'focusout');
            }
            /* eslint-enable */
        }
        if (!this.isAudioElem(target)) {
            if (!isNOU(this.audEle) && this.audEle.style.outline !== '') {
                this.audEle.style.outline = '';
            } else if (!isNOU(this.prevSelectedAudEle) && this.prevSelectedAudEle.style.outline !== '') {
                this.prevSelectedAudEle.style.outline = '';
            }
        }
        if (this.parent.inlineMode.enable && target && this.dialogObj && !closest(target, '#' + this.dialogObj.element.id)) {
            this.dialogObj.hide();
        }
    }

    private alignmentSelect(e: ClickEventArgs): void {
        const item: IDropDownItemModel = e.item as IDropDownItemModel;
        if (!document.body.contains(document.body.querySelector('.e-rte-quick-toolbar')) || item.command !== 'Audios') {
            return;
        }
        const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
        let selectNodeEle: Node[] = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
        if (this.audEle) {
            selectNodeEle = [this.audEle];
        }
        const args: IImageNotifyArgs = { args: e, selectNode: selectNodeEle };
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        switch (item.subCommand) {
        case 'Inline':
            this.inline(args);
            break;
        case 'Break':
            this.break(args);
            break;
        }
        if (this.quickToolObj && document.body.contains(this.quickToolObj.audioQTBar.element)) {
            this.quickToolObj.audioQTBar.hidePopup();
            removeClass([(selectNodeEle[0] as HTMLElement)], CLS_AUD_FOCUS);
        }
    }

    private break(e: IImageNotifyArgs): void {
        if (e.selectNode[0].nodeName !== 'AUDIO') {
            return;
        }
        const subCommand: string = ((e.args as ClickEventArgs).item && ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand) ?
            ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand : 'Break';
        this.parent.formatter.process(this.parent, e.args, (e.args as ClickEventArgs).originalEvent,
                                      { selectNode: e.selectNode, subCommand: subCommand });
    }
    private inline(e: IImageNotifyArgs): void {
        if (e.selectNode[0].nodeName !== 'AUDIO') {
            return;
        }
        const subCommand: string = ((e.args as ClickEventArgs).item && ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand) ?
            ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand : 'Inline';
        this.parent.formatter.process(this.parent, e.args, (e.args as ClickEventArgs).originalEvent,
                                      { selectNode: e.selectNode, subCommand: subCommand });
    }

    private editAreaClickHandler(e: IImageNotifyArgs): void {
        if (this.parent.readonly) {
            this.hideAudioQuickToolbar();
            return;
        }
        const args: MouseEvent = e.args as MouseEvent;
        const target: HTMLElement = args.target as HTMLElement;
        const showOnRightClick: boolean = this.parent.quickToolbarSettings.showOnRightClick;
        if (args.which === 2 || (showOnRightClick && args.which === 1) || (!showOnRightClick && args.which === 3)) {
            if ((showOnRightClick && args.which === 1) && !isNullOrUndefined((target as HTMLElement)) &&
                this.isAudioElem(target as HTMLElement)) {
                this.parent.formatter.editorManager.nodeSelection.Clear(this.contentModule.getDocument());
                this.parent.formatter.editorManager.nodeSelection.setSelectionContents(
                    this.contentModule.getDocument(), target as Node);
            }
            if (this.isAudioElem(target) && target.querySelector('audio')) {
                target.querySelector('audio').style.outline = '2px solid #4a90e2';
            }
            return;
        }
        if (this.parent.editorMode === 'HTML' && this.parent.quickToolbarModule && this.parent.quickToolbarModule.audioQTBar) {
            this.quickToolObj = this.parent.quickToolbarModule;
            this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
            if (this.isAudioElem(target) && this.parent.quickToolbarModule) {
                this.parent.formatter.editorManager.nodeSelection.Clear(this.contentModule.getDocument());
                this.parent.formatter.editorManager.nodeSelection.setSelectionContents(this.contentModule.getDocument(), target);
                if (isIDevice()) {
                    this.parent.notify(events.selectionSave, e);
                }
                this.showAudioQuickToolbar({ args: args, type: 'Audios', elements: [args.target as Element] } as IShowPopupArgs);
            } else {
                this.hideAudioQuickToolbar();
            }
        }
    }

    private isAudioElem(target: HTMLElement): boolean {
        if (target && target.nodeType !== 3 && target.nodeName !== 'BR' && (target.classList &&
            (target.classList.contains(classes.CLS_AUDIOWRAP) || target.classList.contains('e-rte-audio') || target.classList.contains(classes.CLS_CLICKELEM)))) {
            return true;
        } else {
            return false;
        }
    }

    private showAudioQuickToolbar(e: IShowPopupArgs): void {
        if (e.type !== 'Audios' || isNullOrUndefined(this.parent.quickToolbarModule)
            || isNullOrUndefined(this.parent.quickToolbarModule.audioQTBar) || isNullOrUndefined(e.args)) {
            return;
        }
        this.quickToolObj = this.parent.quickToolbarModule;
        let target: HTMLElement = e.elements as HTMLElement;
        [].forEach.call(e.elements, (element: Element, index: number) => {
            if (index === 0) {
                target = <HTMLElement>element;
            }
        });
        if (this.isAudioElem(target)) {
            const audioElem: HTMLElement = target.tagName === 'AUDIO' ? target : target.querySelector('audio');
            addClass([audioElem], [CLS_AUD_FOCUS]);
            audioElem.style.outline = '2px solid #4a90e2';
            this.audEle = audioElem as HTMLAudioElement;
        }
        if (this.parent.quickToolbarModule.audioQTBar) {
            if (e.isNotify) {
                this.showPopupTime = setTimeout(() => {
                    this.parent.formatter.editorManager.nodeSelection.Clear(this.contentModule.getDocument());
                    this.parent.formatter.editorManager.nodeSelection.setSelectionContents(this.contentModule.getDocument(), target);
                    this.quickToolObj.audioQTBar.showPopup(target as Element, e.args as MouseEvent);
                }, this.parent.element.dataset.rteUnitTesting === 'true' ? 0 : 400);
            } else {
                this.quickToolObj.audioQTBar.showPopup(target as Element, e.args as MouseEvent);
            }
        }
    }

    public hideAudioQuickToolbar(): void {
        if (!isNullOrUndefined(this.contentModule.getEditPanel().querySelector('.' + CLS_AUD_FOCUS))) {
            removeClass([this.contentModule.getEditPanel().querySelector('.' + CLS_AUD_FOCUS)], CLS_AUD_FOCUS);
            if (!isNOU(this.audEle)) {
                this.audEle.style.outline = '';
            }
            if (this.quickToolObj && this.quickToolObj.audioQTBar && document.body.contains(this.quickToolObj.audioQTBar.element)) {
                this.quickToolObj.audioQTBar.hidePopup();
            }
        }
    }

    private insertingAudio(e: IImageNotifyArgs): void {
        this.insertAudio(e);
        if (!isNullOrUndefined(this.dialogObj)) {
            this.dialogObj.element.style.maxHeight = 'inherit';
            const dialogContent: HTMLElement = this.dialogObj.element.querySelector('.e-audio-content');
            if (!isNullOrUndefined(this.parent.insertAudioSettings.path) || this.parent.editorMode === 'HTML') {
                (document.getElementById(this.rteID + '_insertAudio') as HTMLElement).focus();
            } else {
                (dialogContent.querySelector('.e-audio-url') as HTMLElement).focus();
            }
        }
    }

    private clearDialogObj(): void {
        if (this.uploadObj && !this.uploadObj.isDestroyed) {
            this.uploadObj.destroy();
            detach(this.uploadObj.element);
            this.uploadObj = null;
        }
        if (this.button && !this.button.isDestroyed) {
            this.button.destroy();
            detach(this.button.element);
            this.button = null;
        }
        if (this.dialogObj && !this.dialogObj.isDestroyed) {
            this.dialogObj.destroy();
            detach(this.dialogObj.element);
            this.dialogObj = null;
        }
    }

    public insertAudio(e: IImageNotifyArgs): void {
        if (this.dialogObj) {
            this.dialogObj.hide({ returnValue: true } as Event);
            return;
        }
        const audioDialog: HTMLElement = this.parent.createElement('div', { className: 'e-rte-audio-dialog', id: this.rteID + '_audio' });
        this.parent.rootContainer.appendChild(audioDialog);
        const audioInsert: string = this.i10n.getConstant('dialogInsert');
        const audiolinkCancel: string = this.i10n.getConstant('dialogCancel');
        const audioHeader: string = this.i10n.getConstant('audioHeader');
        const selection: NodeSelection = e.selection;
        const selectObj: IImageNotifyArgs = { selfAudio: this, selection: e.selection, args: e.args, selectParent: e.selectParent };
        const dialogModel: DialogModel = {
            header: audioHeader,
            cssClass: classes.CLS_RTE_ELEMENTS,
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            showCloseIcon: true, closeOnEscape: true, width: (Browser.isDevice) ? '290px' : '340px',
            isModal: (Browser.isDevice as boolean),
            position: { X: 'center', Y: (Browser.isDevice) ? 'center' : 'top' },
            buttons: [{
                click: this.insertAudioUrl.bind(selectObj),
                buttonModel: { content: audioInsert, cssClass: 'e-flat e-insertAudio', isPrimary: true, disabled: true }
            },
            {
                click: (e: MouseEvent) => {
                    this.cancelDialog(e);
                },
                buttonModel: { cssClass: 'e-flat e-cancel', content: audiolinkCancel }
            }],
            target: (Browser.isDevice) ? document.body : this.parent.element,
            animationSettings: { effect: 'None' },
            close: (event: { [key: string]: object }) => {
                if (this.isAudioUploaded) {
                    if (this.dialogObj.element.querySelector('.e-file-abort-btn') as HTMLElement) {
                        (this.dialogObj.element.querySelector('.e-file-abort-btn') as HTMLElement).click();
                    } else {
                        this.uploadObj.remove();
                    }
                }
                this.parent.isBlur = false;
                if (event && !isNOU(event.event) && (event.event as { [key: string]: string }).returnValue) {
                    if (this.parent.editorMode === 'HTML') {
                        selection.restore();
                    }
                }
                this.clearDialogObj();
                this.dialogRenderObj.close(event);
            }
        };
        const dialogContent: HTMLElement = this.parent.createElement('div', { className: 'e-audio-content' });
        if (!isNullOrUndefined(this.parent.insertAudioSettings.path) || this.parent.editorMode === 'HTML') {
            dialogContent.appendChild(this.audioUpload(e));
        }
        const linkHeader: HTMLElement = this.parent.createElement('div', { className: 'e-audioheader' });
        const linkHeaderText: string = this.i10n.getConstant('audioLinkHeader');
        if (this.parent.editorMode === 'HTML') {
            linkHeader.innerHTML = linkHeaderText;
        }
        dialogContent.appendChild(linkHeader);
        dialogContent.appendChild(this.audioUrlPopup(e));
        if (e.selectNode && e.selectNode[0].nodeType === 1 && this.isAudioElem(e.selectNode[0] as HTMLElement)) {
            dialogModel.header = this.parent.localeObj.getConstant('editAudioHeader');
            dialogModel.content = dialogContent;
        } else {
            dialogModel.content = dialogContent;
        }
        this.dialogObj = this.dialogRenderObj.render(dialogModel);
        this.dialogObj.createElement = this.parent.createElement;
        this.dialogObj.appendTo(audioDialog);
        if (e.selectNode && e.selectNode[0].nodeType === 1 && this.isAudioElem((e.selectNode[0] as HTMLElement)) && (e.name === 'insertAudio')) {
            this.dialogObj.element.querySelector('.e-insertAudio').textContent = this.parent.localeObj.getConstant('dialogUpdate');
        }
        audioDialog.style.maxHeight = 'inherit';
        if (this.quickToolObj) {
            if (this.quickToolObj.audioQTBar && document.body.contains(this.quickToolObj.audioQTBar.element)) {
                this.quickToolObj.audioQTBar.hidePopup();
            }
            if (this.quickToolObj.inlineQTBar && document.body.contains(this.quickToolObj.inlineQTBar.element)) {
                this.quickToolObj.inlineQTBar.hidePopup();
            }
            if (this.quickToolObj.textQTBar && this.parent.element.ownerDocument.body.contains(this.quickToolObj.textQTBar.element)) {
                this.quickToolObj.textQTBar.hidePopup();
            }
        }
    }

    private audioUrlPopup(e: IImageNotifyArgs): HTMLElement {
        const audioUrl: HTMLElement = this.parent.createElement('div', { className: 'audioUrl' });
        const placeUrl: string = this.i10n.getConstant('audioUrl');
        this.inputUrl = this.parent.createElement('input', {
            className: 'e-input e-audio-url',
            attrs: { placeholder: placeUrl, spellcheck: 'false', 'aria-label': this.i10n.getConstant('audioLinkHeader')}
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
        if (e.selectNode && this.isAudioElem(e.selectNode[0] as HTMLElement)) {
            const regex: RegExp = new RegExp(/([^\S]|^)(((https?:\/\/)|(www\.))(\S+))/gi);
            const sourceElement: HTMLSourceElement = (e.selectNode[0] as HTMLElement).querySelector('source');
            (this.inputUrl as HTMLInputElement).value = sourceElement.src.match(regex) ? sourceElement.src : '';
        }
        audioUrl.appendChild(this.inputUrl);
        return audioUrl;
    }

    private audioUpload(e: IImageNotifyArgs): HTMLElement {
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
        const uploadParentEle: HTMLElement = this.parent.createElement('div', { className: 'e-aud-uploadwrap e-droparea' });
        const deviceAudioUpMsg: string = this.i10n.getConstant('audioDeviceUploadMessage');
        const audioUpMsg: string = this.i10n.getConstant('audioUploadMessage');
        const span: HTMLElement = this.parent.createElement('span', { className: 'e-droptext' });
        const spanMsg: HTMLElement = this.parent.createElement('span', {
            className: 'e-rte-upload-text', innerHTML: ((Browser.isDevice) ? deviceAudioUpMsg : audioUpMsg)
        });
        span.appendChild(spanMsg);
        const btnEle: HTMLElement = this.parent.createElement('button', {
            className: 'e-browsebtn', id: this.rteID + '_insertAudio', attrs: { autofocus: 'true', type: 'button' }
        });
        span.appendChild(btnEle); uploadParentEle.appendChild(span);
        const browserMsg: string = this.i10n.getConstant('browse');
        this.button = new Button({ content: browserMsg, enableRtl: this.parent.enableRtl });
        this.button.isStringTemplate = true; this.button.createElement = this.parent.createElement;
        this.button.appendTo(btnEle);
        const btnClick: HTMLElement = (Browser.isDevice) ? span : btnEle;
        EventHandler.add(btnClick, 'click', this.fileSelect, this);
        const uploadEle: HTMLInputElement | HTMLElement = this.parent.createElement('input', {
            id: this.rteID + '_upload', attrs: { type: 'File', name: 'UploadFiles' }
        });
        uploadParentEle.appendChild(uploadEle);
        let fileName: string;
        let selectArgs: SelectedEventArgs;
        this.uploadObj = new Uploader({
            asyncSettings: { saveUrl: this.parent.insertAudioSettings.saveUrl, removeUrl: this.parent.insertAudioSettings.removeUrl },
            dropArea: span, multiple: false, enableRtl: this.parent.enableRtl,
            allowedExtensions: this.parent.insertAudioSettings.allowedTypes.toString(),
            maxFileSize: this.parent.insertAudioSettings.maxFileSize,
            selected: (e: SelectedEventArgs) => {
                proxy.isAudioUploaded = true;
                selectArgs = e;
                this.parent.trigger(events.fileSelected, selectArgs, (selectArgs: SelectedEventArgs) => {
                    if (!selectArgs.cancel) {
                        if (isNOU(selectArgs.filesData[0])) {
                            return;
                        }
                        this.checkExtension(selectArgs.filesData[0]); fileName = selectArgs.filesData[0].name;
                        if (this.parent.editorMode === 'HTML' && isNullOrUndefined(this.parent.insertAudioSettings.path)) {
                            const reader: FileReader = new FileReader();
                            // eslint-disable-next-line
                            reader.addEventListener('load', (e: MouseEvent) => {
                                const url: string = this.parent.insertAudioSettings.saveFormat === 'Base64' ? reader.result as string :
                                    URL.createObjectURL(convertToBlob(reader.result as string));
                                proxy.uploadUrl = {
                                    url: url, selection: save, fileName: fileName,
                                    selectParent: selectParent
                                };
                                proxy.inputUrl.setAttribute('disabled', 'true');
                                if (isNullOrUndefined(proxy.parent.insertAudioSettings.saveUrl) && this.isAllowedTypes
                                    && !isNullOrUndefined(this.dialogObj)) {
                                    (this.dialogObj.getButtons(0) as Button).element.removeAttribute('disabled');
                                }
                            });
                            reader.readAsDataURL(selectArgs.filesData[0].rawFile as Blob);
                        }
                    }
                });
            },
            beforeUpload: (args: BeforeUploadEventArgs) => {
                this.parent.trigger(events.beforeFileUpload, args);
            },
            uploading: (e: UploadingEventArgs) => {
                if (!this.parent.isServerRendered) {
                    this.parent.trigger(events.fileUploading, e);
                }
            },
            success: (e: Object) => {
                this.parent.trigger(events.fileUploadSuccess, e, (e: object) => {
                    if (!isNullOrUndefined(this.parent.insertAudioSettings.path)) {
                        const url: string = this.parent.insertAudioSettings.path + (e as MetaData).file.name;
                        // eslint-disable-next-line
                        const value: IAudioCommandsArgs = { url: url, selection: save };
                        proxy.uploadUrl = {
                            url: url, selection: save, fileName: fileName, selectParent: selectParent
                        };
                        proxy.inputUrl.setAttribute('disabled', 'true');
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
                    proxy.isAudioUploaded = false;
                    (this.dialogObj.getButtons(0) as Button).element.disabled = true;
                    proxy.inputUrl.removeAttribute('disabled'); if (proxy.uploadUrl) {
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

    private dragEnter(e?: DragEvent): void {
        e.dataTransfer.dropEffect = 'copy';
        e.preventDefault();
    }

    private dragOver(e?: DragEvent): void | boolean {
        if ((Browser.info.name === 'edge' && e.dataTransfer.items[0].type.split('/')[0].indexOf('audio') > -1) ||
            (Browser.isIE && e.dataTransfer.types[0] === 'Files')) {
            e.preventDefault();
        } else {
            return true;
        }
    }

    /**
     * Used to set range When drop an audio
     *
     * @param {MediaDropEventArgs} args - specifies the audio arguments.
     * @returns {void}
     */
    private dragDrop(args: MediaDropEventArgs): void {
        if (args.dataTransfer.files.length > 0 && args.dataTransfer.files[0].type.startsWith('audio')) {
            this.parent.trigger(events.beforeMediaDrop, args, (e: MediaDropEventArgs) => {
                const isAudioOrFileDrop: boolean = e.dataTransfer.files.length > 0;
                if (!e.cancel && isAudioOrFileDrop) {
                    if (closest((e.target as HTMLElement), '#' + this.parent.getID() + '_toolbar') ||
                        this.parent.inputElement.contentEditable === 'false') {
                        e.preventDefault();
                        return;
                    }
                    e.preventDefault();
                    let range: Range;
                    if (this.contentModule.getDocument().caretRangeFromPoint) {
                        range = this.contentModule.getDocument().caretRangeFromPoint(e.clientX, e.clientY);
                    } else if ((e.rangeParent)) {
                        range = this.contentModule.getDocument().createRange();
                        range.setStart(e.rangeParent, e.rangeOffset);
                    } else {
                        range = this.getDropRange(e.clientX, e.clientY);
                    }
                    this.parent.notify(events.selectRange, { range: range });
                    const uploadArea: HTMLElement = this.parent.element.querySelector('.' + classes.CLS_DROPAREA) as HTMLElement;
                    if (uploadArea) {
                        return;
                    }
                    this.insertDragAudio(e as DragEvent);
                } else {
                    if (isAudioOrFileDrop) {
                        e.preventDefault();
                    }
                }
            });
        }
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

    private insertDragAudio(e: DragEvent): void {
        e.preventDefault();
        const activePopupElement: HTMLElement = this.parent.element.querySelector('' + classes.CLS_POPUP_OPEN);
        this.parent.notify(events.drop, { args: e });
        if (activePopupElement) {
            activePopupElement.classList.add(classes.CLS_HIDE);
        }

        const actionBeginArgs: ActionBeginEventArgs = {
            requestType: 'Audios',
            name: 'AudioDragAndDrop',
            cancel: false,
            originalEvent: e
        };

        if (e.dataTransfer.files.length > 0) { // For external audio drag and drop
            if (e.dataTransfer.files.length > 1) {
                return;
            }
            const audioFiles: FileList = e.dataTransfer.files;
            const fileName: string = audioFiles[0].name;
            const audioType: string = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
            const allowedTypes: string[] = this.parent.insertAudioSettings.allowedTypes;
            for (let i: number = 0; i < allowedTypes.length; i++) {
                if (audioType.toLowerCase() === allowedTypes[i as number].toLowerCase()) {
                    if (this.parent.insertAudioSettings.saveUrl) {
                        this.onSelect(e);
                    } else {
                        this.parent.trigger(events.actionBegin, actionBeginArgs, (actionBeginArgs: ActionBeginEventArgs) => {
                            if (!actionBeginArgs.cancel) {
                                const args: NotifyArgs = { args: e, text: '', file: audioFiles[0] };
                                e.preventDefault();
                                this.audioPaste(args);
                            } else {
                                actionBeginArgs.originalEvent.preventDefault();
                            }
                        });
                    }
                }
            }
        }
    }

    private onSelect(args: DragEvent): void {
        const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
        const selection: NodeSelection = this.parent.formatter.editorManager.nodeSelection.save(
            range, this.parent.contentModule.getDocument());

        const file: File = args.dataTransfer.files[0];

        const audioCommand: IAudioCommandsArgs = {
            cssClass: (this.parent.insertAudioSettings.layoutOption === 'Inline' ? classes.CLS_AUDIOINLINE : classes.CLS_AUDIOBREAK),
            url: this.parent.insertAudioSettings.path + file.name,
            selection: selection,
            fileName: file.name.replace(/\.[a-zA-Z0-9]+$/, '')
        };

        const actionBeginArgs: ActionBeginEventArgs = {
            requestType: 'Audios',
            name: 'AudioDragAndDrop',
            cancel: false,
            originalEvent: args,
            itemCollection: audioCommand
        };

        this.parent.trigger(events.actionBegin, actionBeginArgs, (actionBeginArgs: ActionBeginEventArgs) => {
            if (!actionBeginArgs.cancel) {
                // Use formatter to create properly wrapped audio
                this.parent.formatter.process(
                    this.parent,
                    { item: { command: 'Audios', subCommand: 'Audio' } },
                    args,
                    actionBeginArgs.itemCollection
                );

                // Find the inserted audio
                const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
                const audioElement: HTMLAudioElement = (range.commonAncestorContainer as HTMLElement).querySelector('audio');
                if (audioElement) {
                    audioElement.style.opacity = '0.5';

                    // Set up upload for the drag-dropped audio
                    this.uploadMethod(args, audioElement);
                }
            } else {
                actionBeginArgs.originalEvent.preventDefault();
            }
        });
    }


    /**
     * Rendering uploader and popup for drag and drop
     *
     * @param {DragEvent} dragEvent - specifies the event.
     * @param {HTMLAudioElement} audioElement - specifies the element.
     * @returns {void}
     */
    private uploadMethod(dragEvent: DragEvent, audioElement: HTMLAudioElement): void {
        this.popupObj = this.popupUploaderObj.renderPopup('Audios', audioElement);
        const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
        const timeOut: number = dragEvent.dataTransfer.files[0].size > 1000000 ? 300 : 100;
        this.audioDragPopupTime = setTimeout(() => {
            this.popupUploaderObj.refreshPopup(audioElement, this.popupObj);
        }, timeOut);
        this.uploadObj = this.popupUploaderObj.createUploader(
            'Audios', dragEvent, audioElement, this.popupObj.element.childNodes[0] as HTMLElement, this.popupObj);
        (this.popupObj.element.querySelector('.e-rte-dialog-upload .e-file-select-wrap') as HTMLElement).style.display = 'none';
        range.selectNodeContents(audioElement);
        this.parent.formatter.editorManager.nodeSelection.setRange(this.contentModule.getDocument(), range);
    }

    private audioPaste(args: NotifyArgs): void {
        if (args.text.length === 0 && !isNOU((args as NotifyArgs).file)) {
            // eslint-disable-next-line
            const proxy: Audio = this;
            const reader: FileReader = new FileReader();
            (args.args as KeyboardEvent).preventDefault();
            reader.addEventListener('load', (e: MouseEvent) => {
                const file: File = (args as NotifyArgs).file as File;
                const url: string = this.parent.insertAudioSettings.saveFormat === 'Base64' || !isNOU(args.callBack) ?
                    reader.result as string : URL.createObjectURL(convertToBlob(reader.result as string));
                const audioCommandArgs: IAudioCommandsArgs = {
                    cssClass: (proxy.parent.insertAudioSettings.layoutOption === 'Inline' ?
                        classes.CLS_AUDIOINLINE : classes.CLS_AUDIOBREAK),
                    url: url,
                    fileName: file.name
                };
                if (!isNOU(args.callBack)) {
                    args.callBack(audioCommandArgs);
                    return;
                } else {
                    proxy.parent.formatter.process(
                        proxy.parent,
                        { item: { command: 'Audios', subCommand: 'Audio' } },
                        args.args,
                        audioCommandArgs
                    );
                }
            });
            reader.readAsDataURL((args as NotifyArgs).file);
        }
    }

    // eslint-disable-next-line
    private cancelDialog(e: MouseEvent): void {
        this.parent.isBlur = false;
        this.dialogObj.hide({ returnValue: true } as Event);
        if (this.isAudioUploaded) {
            this.uploadObj.removing();
        }
    }

    // eslint-disable-next-line
    private insertAudioUrl(e: MouseEvent): void {
        const proxy: Audio = (this as IImageNotifyArgs).selfAudio;
        //let audioSelectParent: Node = proxy.uploadUrl.selectParent[0];
        proxy.isAudioUploaded = false;
        const url: string = (proxy.inputUrl as HTMLInputElement).value;
        if (proxy.parent.formatter.getUndoRedoStack().length === 0) {
            proxy.parent.formatter.saveData();
        }
        if (!isNullOrUndefined(proxy.uploadUrl) && proxy.uploadUrl.url !== '') {
            proxy.uploadUrl.cssClass = (proxy.parent.insertAudioSettings.layoutOption === 'Inline' ?
                classes.CLS_AUDIOINLINE : classes.CLS_AUDIOBREAK);
            proxy.dialogObj.hide({ returnValue: false } as Event);
            if (proxy.dialogObj !== null) {
                return;
            }
            proxy.parent.formatter.process(
                proxy.parent, (this as IImageNotifyArgs).args,
                ((this as IImageNotifyArgs).args as ClickEventArgs).originalEvent, proxy.uploadUrl);
            proxy.uploadUrl.url = '';
        } else if (url !== '') {
            if (proxy.parent.editorMode === 'HTML' && isNullOrUndefined(
                closest(
                    // eslint-disable-next-line
                    (this as IImageNotifyArgs).selection.range.startContainer.parentNode, '[id=' + "'" + proxy.contentModule.getPanel().id + "'" + ']')) && !(proxy.parent.iframeSettings.enable)) {
                (proxy.contentModule.getEditPanel() as HTMLElement).focus();
                const range: Range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.contentModule.getDocument());
                (this as IImageNotifyArgs).selection = proxy.parent.formatter.editorManager.nodeSelection.save(
                    range, proxy.contentModule.getDocument());
                (this as IImageNotifyArgs).selectParent = proxy.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            }
            const name: string = proxy.parent.editorMode === 'HTML' ? url.split('/')[url.split('/').length - 1] : '';
            const value: IAudioCommandsArgs = {
                cssClass: (proxy.parent.insertAudioSettings.layoutOption === 'Inline' ? classes.CLS_AUDIOINLINE : classes.CLS_AUDIOBREAK),
                url: url, selection: (this as IImageNotifyArgs).selection, fileName: name,
                selectParent: (this as IImageNotifyArgs).selectParent
            };
            proxy.dialogObj.hide({ returnValue: false } as Event);
            if (proxy.dialogObj !== null) {
                return;
            }
            proxy.parent.formatter.process(
                proxy.parent, (this as IImageNotifyArgs).args, ((this as IImageNotifyArgs).args as ClickEventArgs).originalEvent, value);
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
        if (this.isDestroyed) { return; }
        this.prevSelectedAudEle = undefined;
        if (this.showPopupTime){
            clearTimeout(this.showPopupTime);
            this.showPopupTime = null;
        }
        this.removeEventListener();
        this.clearDialogObj();
        this.isDestroyed = true;
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {void}
     * @hidden
     */
    private getModuleName(): string {
        return 'audio';
    }
}
