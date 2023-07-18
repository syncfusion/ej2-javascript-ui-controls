import { addClass, detach, EventHandler, L10n, isNullOrUndefined, KeyboardEventArgs, Ajax } from '@syncfusion/ej2-base';
import { Browser, closest, removeClass, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import {
    IAudioCommandsArgs, IRenderer, IDropDownItemModel, IToolbarItemModel, AfterMediaDeleteEventArgs, ImageUploadingEventArgs
} from '../base/interface';
import { IRichTextEditor, IImageNotifyArgs, NotifyArgs, IShowPopupArgs } from '../base/interface';
import * as events from '../base/constant';
import * as classes from '../base/classes';
import { ServiceLocator } from '../services/service-locator';
import { NodeSelection } from '../../selection/selection';
import { Uploader, SelectedEventArgs, MetaData, FileInfo, BeforeUploadEventArgs } from '@syncfusion/ej2-inputs';
import { RemovingEventArgs, UploadingEventArgs, ProgressEventArgs } from '@syncfusion/ej2-inputs';
import { Dialog, DialogModel } from '@syncfusion/ej2-popups';
import { Button } from '@syncfusion/ej2-buttons';
import { RendererFactory } from '../services/renderer-factory';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { RenderType } from '../base/enum';
import { dispatchEvent, hasClass, convertToBlob } from '../base/util';
import { DialogRenderer } from './dialog-renderer';
import { isIDevice } from '../../common/util';

/**
 * `Audio` module is used to handle audio actions.
 */
export class Audio {
    public element: HTMLElement;
    private rteID: string;
    private parent: IRichTextEditor;
    public dialogObj: Dialog;
    public uploadObj: Uploader;
    private i10n: L10n;
    private inputUrl: HTMLElement;
    private uploadUrl: IAudioCommandsArgs;
    private contentModule: IRenderer;
    private rendererFactory: RendererFactory;
    private quickToolObj: IRenderer;
    private audEle: HTMLAudioElement;
    private isAudioUploaded: boolean = false;
    private isAllowedTypes: boolean = true;
    private dialogRenderObj: DialogRenderer;
    private deletedAudio: Node[] = [];
    private removingAudioName: string;
    private prevSelectedAudEle: HTMLAudioElement;
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
        this.parent.on(events.destroy, this.removeEventListener, this);
    }

    protected removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.keyDown, this.onKeyDown);
        this.parent.off(events.keyUp, this.onKeyUp);
        this.parent.off(events.insertAudio, this.insertingAudio);
        this.parent.off(events.initialEnd, this.afterRender);
        this.parent.off(events.dynamicModule, this.afterRender);
        this.parent.off(events.showAudioDialog, this.showDialog);
        this.parent.off(events.closeAudioDialog, this.closeDialog);
        this.parent.off(events.audioToolbarAction, this.onToolbarAction);
        this.parent.off(events.dropDownSelect, this.alignmentSelect);
        this.parent.off(events.audioDelete, this.deleteAudio);
        this.parent.off(events.editAreaClick, this.editAreaClickHandler);
        this.parent.off(events.insertCompleted, this.showAudioQuickToolbar);
        this.parent.off(events.destroy, this.removeEventListener);
        if (!isNullOrUndefined(this.contentModule)) {
            EventHandler.remove(this.parent.contentModule.getEditPanel(), Browser.touchStartEvent, this.touchStart);
            EventHandler.remove(this.contentModule.getEditPanel(), Browser.touchEndEvent, this.audioClick);
            EventHandler.remove(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick);
        }
    }

    private afterRender(): void {
        this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
        EventHandler.add(this.parent.contentModule.getEditPanel(), Browser.touchStartEvent, this.touchStart, this);
        EventHandler.add(this.contentModule.getEditPanel(), Browser.touchEndEvent, this.audioClick, this);
        EventHandler.add(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick, this);
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
            !isNOU(range.startContainer.nextSibling) && range.startContainer.nextSibling.nodeName === 'IMG') {
            this.deletedAudio.push(range.startContainer.nextSibling);
        } else if (range.startContainer.nodeName !== '#text' && !isNOU(range.startContainer.childNodes[range.startOffset]) &&
            this.isAudioElem(range.startContainer.childNodes[range.startOffset] as HTMLElement)) {
            this.deletedAudio.push(range.startContainer.childNodes[range.startOffset]);
        }
    }

    private undoStack(args?: { [key: string]: string }): void {
        if (args.subCommand.toLowerCase() === 'undo' || args.subCommand.toLowerCase() === 'redo') {
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
            for (let i: number = 0; i < this.deletedAudio.length - 1; i++) {
                const args: AfterMediaDeleteEventArgs = {
                    element: (this.deletedAudio[i as number] as HTMLElement).querySelector('audio'),
                    src: (this.deletedAudio[i as number] as HTMLElement).querySelector('source').getAttribute('src')
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
                removeClass([selectParentEle[0] as HTMLElement], classes.CLS_AUD_FOCUS);
                this.quickToolObj.audioQTBar.hidePopup();
            }
        }
        if (originalEvent.ctrlKey && (originalEvent.keyCode === 89 || originalEvent.keyCode === 90)) {
            this.undoStack({ subCommand: (originalEvent.keyCode === 90 ? 'undo' : 'redo') });
        }
        if (originalEvent.keyCode === 8 || originalEvent.keyCode === 46) {
            if (selectNodeEle && this.isAudioElem(selectNodeEle[0] as HTMLElement) && selectNodeEle.length < 1) {
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
                this.audioRemovePost(src as string);
            }
            if (this.parent.editorMode !== 'Markdown') {
                if (range.startContainer.nodeType === 3) {
                    if (originalEvent.code === 'Backspace') {
                        if ((range.startContainer as HTMLElement).previousElementSibling && range.startOffset === 0 &&
                            (range.startContainer as HTMLElement).previousElementSibling.classList.contains(classes.CLS_AUDIOWRAP)) {
                            detach((range.startContainer as HTMLElement).previousElementSibling);
                        }
                    } else {
                        if ((range.startContainer as HTMLElement).nextElementSibling &&
                            range.endContainer.textContent.length === range.endOffset &&
                            (range.startContainer as HTMLElement).nextElementSibling.classList.contains(classes.CLS_AUDIOWRAP)) {
                            detach((range.startContainer as HTMLElement).nextElementSibling);
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

    private showDialog(): void {
        this.openDialog(false);
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
            this.parent, e.args, e.args,
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
                this.contentModule.getEditPanel().setAttribute('contenteditable', 'false');
                (e.target as HTMLElement).focus();
            } else {
                if (!this.parent.readonly) {
                    this.contentModule.getEditPanel().setAttribute('contenteditable', 'true');
                }
            }
        }
        if (this.isAudioElem(e.target as HTMLElement)) {
            this.audEle = (e.target as HTMLElement).querySelector('audio') as HTMLAudioElement;
            e.preventDefault();
        }
    }

    private onDocumentClick(e: MouseEvent): void {
        const target: HTMLElement = <HTMLElement>e.target;
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
                this.dialogObj.hide({ returnValue: true } as Event);
                this.parent.isBlur = true;
                dispatchEvent(this.parent.element, 'focusout');
            }
            /* eslint-enable */
        }
        if (this.contentModule.getEditPanel().querySelector('.' + classes.CLS_AUD_FOCUS)) {
            if (!this.isAudioElem(e.target as HTMLElement) && !isNOU(this.audEle)) {
                this.audEle.style.outline = '';
            } else if (!isNOU(this.prevSelectedAudEle) && this.prevSelectedAudEle !== target) {
                this.prevSelectedAudEle.style.outline = '';
            }
        }
    }

    private alignmentSelect(e: ClickEventArgs): void {
        const item: IDropDownItemModel = e.item as IDropDownItemModel;
        if (!document.body.contains(document.body.querySelector('.e-rte-quick-toolbar')) || item.command !== 'Audios') {
            return;
        }
        const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
        let selectNodeEle: Node[] = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
        selectNodeEle = [this.audEle];
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
            removeClass([(selectNodeEle[0] as HTMLElement)], classes.CLS_AUD_FOCUS);
        }
    }

    private break(e: IImageNotifyArgs): void {
        if (e.selectNode[0].nodeName !== 'AUDIO') {
            return;
        }
        const subCommand: string = ((e.args as ClickEventArgs).item) ?
            ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand : 'Break';
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    }
    private inline(e: IImageNotifyArgs): void {
        if (e.selectNode[0].nodeName !== 'AUDIO') {
            return;
        }
        const subCommand: string = ((e.args as ClickEventArgs).item) ?
            ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand : 'Inline';
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    }

    private editAreaClickHandler(e: IImageNotifyArgs): void {
        if (this.parent.readonly) {
            this.hideAudioQuickToolbar();
            return;
        }
        const args: MouseEvent = e.args as MouseEvent;
        const showOnRightClick: boolean = this.parent.quickToolbarSettings.showOnRightClick;
        if (args.which === 2 || (showOnRightClick && args.which === 1) || (!showOnRightClick && args.which === 3)) {
            if ((showOnRightClick && args.which === 1) && !isNullOrUndefined((args.target as HTMLElement)) &&
                this.isAudioElem(args.target as HTMLElement)) {
                this.parent.formatter.editorManager.nodeSelection.Clear(this.contentModule.getDocument());
                this.parent.formatter.editorManager.nodeSelection.setSelectionContents(
                    this.contentModule.getDocument(), args.target as Node);
            }
            return;
        }
        if (this.parent.editorMode === 'HTML' && this.parent.quickToolbarModule && this.parent.quickToolbarModule.audioQTBar) {
            this.quickToolObj = this.parent.quickToolbarModule;
            const target: HTMLElement = args.target as HTMLElement;
            this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
            const isPopupOpen: boolean = this.quickToolObj.audioQTBar.element.classList.contains('e-rte-pop');
            if (this.isAudioElem(target) && this.parent.quickToolbarModule) {
                if (isPopupOpen) {
                    return;
                }
                this.parent.formatter.editorManager.nodeSelection.Clear(this.contentModule.getDocument());
                this.parent.formatter.editorManager.nodeSelection.setSelectionContents(this.contentModule.getDocument(), target);
                if (isIDevice()) {
                    this.parent.notify(events.selectionSave, e);
                }
                target.querySelector('audio').style.outline = '2px solid #4a90e2';
                this.showAudioQuickToolbar({ args: args, type: 'Audios', elements: [args.target as Element] } as IShowPopupArgs);
            } else {
                this.hideAudioQuickToolbar();
            }
        }
    }

    private isAudioElem(target: HTMLElement): boolean {
        if (target && target.nodeType !== 3 && target.nodeName !== 'BR' && (target.classList &&
            (target.classList.contains(classes.CLS_AUDIOWRAP) || target.classList.contains(classes.CLS_CLICKELEM)))) {
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
        const args: MouseEvent = e.args as MouseEvent;
        let target: HTMLElement = e.elements as HTMLElement;
        [].forEach.call(e.elements, (element: Element, index: number) => {
            if (index === 0) {
                target = <HTMLElement>element;
            }
        });
        if (this.isAudioElem(target)) {
            addClass([target.querySelector('audio')], [classes.CLS_AUD_FOCUS]);
            target.querySelector('audio').style.outline = '2px solid #4a90e2';
        }
        if (this.parent.quickToolbarModule.audioQTBar) {
            if (e.isNotify) {
                setTimeout(() => {
                    this.parent.formatter.editorManager.nodeSelection.Clear(this.contentModule.getDocument());
                    this.parent.formatter.editorManager.nodeSelection.setSelectionContents(this.contentModule.getDocument(), target);
                    this.quickToolObj.audioQTBar.showPopup(args.pageX - 50, target.getBoundingClientRect().top + 34, target as Element);
                }, 400);
            } else {
                this.quickToolObj.audioQTBar.showPopup(args.pageX - 50, target.getBoundingClientRect().top + 34, target as Element);
            }
        }
    }

    public hideAudioQuickToolbar(): void {
        if (!isNullOrUndefined(this.contentModule.getEditPanel().querySelector('.' + classes.CLS_AUD_FOCUS))) {
            removeClass([this.contentModule.getEditPanel().querySelector('.' + classes.CLS_AUD_FOCUS)], classes.CLS_AUD_FOCUS);
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

    public insertAudio(e: IImageNotifyArgs): void {
        if (this.dialogObj) {
            this.dialogObj.hide({ returnValue: true } as Event);
            return;
        }
        const audioDialog: HTMLElement = this.parent.createElement('div', { className: 'e-rte-audio-dialog', id: this.rteID + '_audio' });
        this.parent.element.appendChild(audioDialog);
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
            position: { X: 'center', Y: (Browser.isDevice) ? 'center' : 'top' },
            isModal: (Browser.isDevice as boolean),
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
        }
    }

    // eslint-disable-next-line
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
            asyncSettings: { saveUrl: this.parent.insertAudioSettings.saveUrl, removeUrl: this.parent.insertAudioSettings.removeUrl },
            dropArea: span, multiple: false, enableRtl: this.parent.enableRtl,
            allowedExtensions: this.parent.insertAudioSettings.allowedTypes.toString(),
            selected: (e: SelectedEventArgs) => {
                proxy.isAudioUploaded = true;
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
            proxy.parent.formatter.process(
                proxy.parent, (this as IImageNotifyArgs).args,
                ((this as IImageNotifyArgs).args as ClickEventArgs).originalEvent, proxy.uploadUrl);
            proxy.uploadUrl.url = '';
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
            const name: string = proxy.parent.editorMode === 'HTML' ? url.split('/')[url.split('/').length - 1] : '';
            const value: IAudioCommandsArgs = {
                cssClass: (proxy.parent.insertAudioSettings.layoutOption === 'Inline' ? classes.CLS_AUDIOINLINE : classes.CLS_AUDIOBREAK),
                url: url, selection: (this as IImageNotifyArgs).selection, fileName: name,
                selectParent: (this as IImageNotifyArgs).selectParent
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
        this.prevSelectedAudEle = undefined;
        this.removeEventListener();
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
