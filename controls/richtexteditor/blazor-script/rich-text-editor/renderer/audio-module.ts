import { addClass, Browser, closest, createElement, detach, EventHandler, isNullOrUndefined as isNOU, KeyboardEventArgs, removeClass } from '../../../base'; /*externalscript*/
import { ClickEventArgs } from '../../../navigations/src'; /*externalscript*/
import { isIDevice } from '../../editor-scripts/common/util';
import { IAudioCommandsArgs, IDropDownItemModel, IShowPopupArgs, IToolbarItemModel, NotifyArgs, DialogCloseEventArgs } from '../../editor-scripts/common/interface';
import { NodeSelection } from '../../editor-scripts/selection/selection';
import { QuickToolbar } from '../actions/quick-toolbar';
import * as classes from '../classes';
import * as events from '../constant';
import { IImageNotifyArgs, IShowAudioDialog, MediaDeletedEventArgs } from '../interfaces';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { dispatchEvent, parseHtml } from '../util';
import { convertToBlob } from '../../editor-scripts/common/util';
import { AudioCommand } from '../../editor-scripts/editor-manager/plugin/audio';

/**
 * `Audio` module is used to handle audio actions.
 */
export class Audio {
    private rteId: string;
    private modifiedUrl: string;
    private isStreamUrl: boolean;
    private deletedAud: Node[] = [];
    public audioDragArgs: DragEvent;
    private parent: SfRichTextEditor;
    private audEle: HTMLAudioElement;
    private quickToolObj: QuickToolbar;
    private inputUrl: HTMLInputElement;
    private audUploadSave: NodeSelection;
    private uploadUrl: IAudioCommandsArgs;
    private selectionObj: IImageNotifyArgs;
    private audUploadSelectedParent: Node[];
    private prevSelectedAudEle: HTMLAudioElement;
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
        this.parent.observer.on(events.audioDelete, this.deleteAud, this);
        this.parent.observer.on(events.initialEnd, this.afterRender, this);
        this.parent.observer.on(events.insertAudio, this.audioDialog, this);
        this.parent.observer.on(events.dropDownSelect, this.alignmentSelect, this);
        this.parent.observer.on(events.iframeMouseDown, this.onIframeMouseDown, this);
        this.parent.observer.on(events.audioToolbarAction, this.onToolbarAction, this);
        this.parent.observer.on(events.editAreaClick, this.editAreaClickHandler, this);
        this.parent.observer.on(events.insertCompleted, this.showAudioQuickToolbar, this);
        this.parent.observer.on(events.bindOnEnd, this.bindOnEnd, this);
    }
    protected removeEventListener(): void {
        this.parent.observer.off(events.keyUp, this.onKeyUp);
        this.parent.observer.off(events.docClick, this.docClick);
        this.parent.observer.off(events.destroy, this.destroy);
        this.parent.observer.off(events.keyDown, this.onKeyDown);
        this.parent.observer.off(events.dropDownSelect, this.alignmentSelect);
        this.parent.observer.off(events.iframeMouseDown, this.onIframeMouseDown);
        this.parent.observer.off(events.audioToolbarAction, this.onToolbarAction);
        this.parent.observer.off(events.editAreaClick, this.editAreaClickHandler);
        this.parent.observer.off(events.insertCompleted, this.showAudioQuickToolbar);
        this.parent.observer.off(events.bindOnEnd, this.bindOnEnd);
        if (!isNOU(this.parent.getEditPanel())) {
            EventHandler.remove(this.parent.getEditPanel(), Browser.touchEndEvent, this.audioClick);
            this.parent.formatter.editorManager.observer.off(events.checkUndo, this.undoStack);
            EventHandler.remove(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick);
        }
    }
    private bindOnEnd(): void {
        if (!this.parent.formatter.editorManager.audioObj) {
            this.parent.formatter.editorManager.audioObj = new AudioCommand(this.parent.formatter.editorManager);
        }
    }
    private docClick(e: { [key: string]: object }): void {
        const target: HTMLElement = <HTMLElement>(e.args as MouseEvent).target;
        const closestEle: Element = closest(target, 'audio');
        const isExist: boolean = closestEle && this.parent.getEditPanel().contains(closestEle) ? true : false;
        if (target && target.tagName !== 'audio' && !isExist &&
            closest(target, '.e-rte-quick-popup') === null && target.offsetParent &&
            !target.offsetParent.classList.contains('e-quick-dropdown') &&
            !target.offsetParent.classList.contains('e-rte-backgroundcolor-dropdown') && !closest(target, '.e-rte-dropdown-popup')
            && !closest(target, '.e-rte-elements')) {
            this.hideAudioQuickToolbar();
        }
    }
    private afterRender(): void {
        EventHandler.add(this.parent.getEditPanel(), Browser.touchEndEvent, this.audioClick, this);
        EventHandler.add(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick, this);
    }

    private isAudioElem(target: HTMLElement): boolean {
        if (target && target.nodeType !== 3 && target.nodeName !== 'BR' && (target.classList &&
            (target.classList.contains('e-audio-wrap') || target.classList.contains('e-rte-audio') || target.classList.contains('e-clickelem')))) {
            return true;
        } else {
            return false;
        }
    }
    private audioDialog(e: IImageNotifyArgs): void {
        this.parent.dotNetRef.invokeMethodAsync(events.closeAudioDialog, null);
        this.uploadUrl = { url: '' };
        this.selectionObj = { selfAudio: this, selection: e.selection, args: e.args, selectParent: e.selectParent };
        if (!isNOU(this.parent.insertAudioSettings.path) || this.parent.editorMode === 'HTML') {
            const iframe: boolean = this.parent.iframeSettings.enable;
            if (this.parent.editorMode === 'HTML' && (!iframe && isNOU(closest(e.selection.range.startContainer.parentNode, '#' +
                this.parent.getPanel().id))
                || (iframe && isNOU(e.selection.range.startContainer.parentNode.ownerDocument.querySelector('body'))))) {
                (this.parent.getEditPanel() as HTMLElement).focus();
                const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
                this.audUploadSave = this.parent.formatter.editorManager.nodeSelection.save(
                    range, this.parent.getDocument());
                this.audUploadSelectedParent = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            } else {
                this.audUploadSave = e.selection; this.audUploadSelectedParent = e.selectParent;
            }
        }
        let obj: IShowAudioDialog;
        if (e.selectNode && this.isAudioElem(e.selectNode[0] as HTMLElement)) {
            const regex: RegExp = new RegExp('([^\\S]|^)(((https?:\\/\\/)|(www\\.))(\\S+))', 'gi');
            if ((e.selectNode[0] as HTMLElement).querySelector('source').src.match(regex)) {
                obj = { mode: 'Edit', url: (e.selectNode[0] as HTMLElement).querySelector('source').src };
            } else {
                obj = { mode: 'Edit', url: '' };
            }
        } else {
            obj = { mode: 'Insert' };
        }
        this.parent.dotNetRef.invokeMethodAsync(events.showAudioDialog, obj);
        if (this.quickToolObj) {
            this.quickToolObj.hideAudioQTBar();
            if (!isNOU(e.selectParent as Node[])) { removeClass([e.selectParent[0] as HTMLElement], classes.CLS_AUD_FOCUS); }
            this.quickToolObj.hideInlineQTBar();
            if (!isNOU(this.quickToolObj.textQTBar) && !isNOU(this.quickToolObj.textQTBar.element) && this.quickToolObj.textQTBar.element.classList.contains('e-popup-open')) {
                this.quickToolObj.hideTextQTBar();
            }
        }
    }
    private checkAudioBack(range: Range): void {
        if (range.startContainer.nodeName === '#text' && range.startOffset === 0 &&
            !isNOU(range.startContainer.previousSibling) && this.isAudioElem(range.startContainer.previousSibling as HTMLElement)) {
            this.deletedAud.push(range.startContainer.previousSibling);
        } else if (range.startContainer.nodeName !== '#text' && !isNOU(range.startContainer.childNodes[range.startOffset - 1]) &&
            this.isAudioElem(range.startContainer.childNodes[range.startOffset - 1] as HTMLElement)) {
            this.deletedAud.push(range.startContainer.childNodes[range.startOffset - 1]);
        }
    }
    private checkAudioDel(range: Range): void {
        if (range.startContainer.nodeName === '#text' && range.startOffset === range.startContainer.textContent.length &&
            !isNOU(range.startContainer.nextSibling) && this.isAudioElem(range.startContainer.nextSibling as HTMLElement)) {
            this.deletedAud.push(range.startContainer.nextSibling);
        } else if (range.startContainer.nodeName !== '#text' && !isNOU(range.startContainer.childNodes[range.startOffset]) &&
            this.isAudioElem(range.startContainer.childNodes[range.startOffset]  as HTMLElement)) {
            this.deletedAud.push(range.startContainer.childNodes[range.startOffset]);
        }
    }
    private undoStack(args?: { [key: string]: string }): void {
        if (args.subCommand.toLowerCase() === 'undo' || args.subCommand.toLowerCase() === 'redo') {
            for (let i: number = 0; i < this.parent.formatter.getUndoRedoStack().length; i++) {
                const temp: Element = createElement('div');
                const contentElem: DocumentFragment = parseHtml(this.parent.formatter.getUndoRedoStack()[i as number].text);
                temp.appendChild(contentElem);
            }
        }
    }
    //#endregion
    //#region Quick toolbar related methods
    private editAreaClickHandler(e: IImageNotifyArgs): void {
        if (this.parent.readonly) {
            this.hideAudioQuickToolbar();
            return;
        }
        const args: MouseEvent = e.args as MouseEvent;
        const target: HTMLElement = args.target as HTMLElement;
        const showOnRightClick: boolean = this.parent.quickToolbarSettings.showOnRightClick as boolean;
        if (args.which === 2 || (showOnRightClick && args.which === 1) || (!showOnRightClick && args.which === 3)) {
            if ((showOnRightClick && args.which === 1) && !isNOU((target as HTMLElement)) &&
            this.isAudioElem(target as HTMLElement)) {
                this.parent.formatter.editorManager.nodeSelection.Clear(this.parent.getDocument());
                this.parent.formatter.editorManager.nodeSelection.setSelectionContents(
                    this.parent.getDocument(), target as Node);
            }
            if (this.isAudioElem(target) && target.querySelector('audio')) {
                target.querySelector('audio').style.outline = '2px solid #4a90e2';
            }
            return;
        }
        if (this.parent.editorMode === 'HTML' && this.parent.quickToolbarModule) {
            this.quickToolObj = this.parent.quickToolbarModule;
            if (this.isAudioElem(target) && this.parent.quickToolbarModule) {
                this.parent.formatter.editorManager.nodeSelection.Clear(this.parent.getDocument());
                this.parent.formatter.editorManager.nodeSelection.setSelectionContents(this.parent.getDocument(), target);
                if (isIDevice()) { this.parent.observer.notify(events.selectionSave, e); }
                this.showAudioQuickToolbar({ args: args, type: 'Audios', elements: [args.target as Element] } as IShowPopupArgs);
            } else {
                this.hideAudioQuickToolbar();
            }
        }
    }
    private showAudioQuickToolbar(e: IShowPopupArgs): void {
        let type: string = 'AudioLink';
        if (e.type !== 'Audios' || isNOU(this.parent.quickToolbarModule)) { return; }
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
        if (this.isAudioElem(target)) {
            const audioElem: HTMLElement = target.tagName === 'AUDIO' ? target : target.querySelector('audio');
            this.audEle = audioElem as HTMLAudioElement;
            addClass([audioElem], [classes.CLS_AUD_FOCUS]);
            audioElem.style.outline = '2px solid #4a90e2';
        }
        if (target && !closest(target, 'a')) {
            type = 'Audio';
        }
        if (this.isAudioElem(target)) { addClass([target], [classes.CLS_AUD_FOCUS]); }
        const pageX: number = this.parent.iframeSettings.enable ? window.scrollX + parentRect.left + args.clientX : args.pageX;
        const pageY: number = this.parent.iframeSettings.enable ? window.scrollY + parentRect.top +
            tbHeight + args.clientY : args.pageY;
        if (this.quickToolObj) {
            if (e.isNotify) {
                setTimeout(() => {
                    this.parent.formatter.editorManager.nodeSelection.Clear( this.parent.getDocument() );
                    this.parent.formatter.editorManager.nodeSelection.setSelectionContents( this.parent.getDocument(), target );
                    this.quickToolObj.showAudioQTBar(target, e.args as MouseEvent);
                }, 400);
            } else {
                this.quickToolObj.showAudioQTBar(target, e.args as MouseEvent);
            }
        }
    }
    public hideAudioQuickToolbar(): void {
        if (!isNOU(this.parent.getEditPanel().querySelector('.' + classes.CLS_AUD_FOCUS))) {
            removeClass([this.parent.getEditPanel().querySelector('.' + classes.CLS_AUD_FOCUS)], classes.CLS_AUD_FOCUS);
            if (!isNOU(this.audEle)) {
                this.audEle.style.outline = '';
            }
            if (this.quickToolObj) {
                this.quickToolObj.hideAudioQTBar();
            }
        }
    }
    private onToolbarAction(args: NotifyArgs): void {
        if (this.quickToolObj) {
            this.quickToolObj.hideAudioQTBar();
            removeClass([args.selectNode[0] as HTMLElement], classes.CLS_AUD_FOCUS);
        }
        this.selectionObj = args;
        if (isIDevice()) { this.parent.observer.notify(events.selectionRestore, {}); }
        const item: IToolbarItemModel = (args.args as ClickEventArgs).item as IToolbarItemModel;
        switch (item.subCommand) {
        case 'AudioReplace':
            this.parent.observer.notify(events.insertAudio, args);
            break;
        case 'AudioRemove':
            this.parent.observer.notify(events.audioDelete, args);
            break;
        }
    }
    private isUrl(url: string): boolean {
        const regExp: RegExpConstructor = RegExp;
        const regexp: RegExp = new regExp('(ftp|http|https)://(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(/|/([\\w#!:.?+=&%@\\-\\/]))?', 'gi');
        return regexp.test(url);
    }
    private deleteAud(e: IImageNotifyArgs, keyCode?: number): void {
        if (!this.isAudioElem(e.selectNode[0] as HTMLElement)) {
            return;
        }
        const args: MediaDeletedEventArgs = {
            src: (e.selectNode[0] as HTMLElement).getAttribute('src')
        };
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        e.selection.restore();
        this.parent.formatter.process(
            this.parent, e.args, e.args,
            {
                selectNode: e.selectNode,
                captionClass: classes.CLS_CAPTION,
                subCommand: ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand
            });
        if (this.quickToolObj) {
            this.quickToolObj.hideAudioQTBar();
        }
        if (isNOU(keyCode) && this.parent.mediaDeleteEnabled) {
            this.parent.dotNetRef.invokeMethodAsync('MediaDeleted', args);
        }
    }
    private alignmentSelect(e: ClickEventArgs): void {
        const item: IDropDownItemModel = e.item as IDropDownItemModel;
        if (!document.body.contains(document.body.querySelector('.e-rte-quick-toolbar')) || item.command !== 'Audios') {
            return;
        }
        const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
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
        if (this.quickToolObj) {
            this.quickToolObj.hideAudioQTBar();
            removeClass([selectNodeEle[0] as HTMLElement], classes.CLS_AUD_FOCUS);
        }
    }
    private inline(e: IImageNotifyArgs): void {
        if (e.selectNode[0].nodeName !== 'AUDIO') {
            return;
        }
        const subCommand: string = ((e.args as ClickEventArgs).item) ?
            ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand : 'Inline';
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    }
    private break(e: IImageNotifyArgs): void {
        if (e.selectNode[0].nodeName !== 'AUDIO') {
            return;
        }
        const subCommand: string = ((e.args as ClickEventArgs).item) ?
            ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand : 'Break';
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    }
    private audioBrowseClick(): void {
        (document.getElementById(this.rteId + '_audio').querySelector('.e-rte-audio-dialog .e-file-select-wrap button') as HTMLButtonElement).click();
    }
    //#endregion
    //#region Interop methods
    public dialogOpened(): void {
        const dialogContent: HTMLElement = Browser.isDevice ? document.getElementById(this.rteId + '_audio').querySelector('.e-audio-content') :
            !isNOU(this.parent.element.querySelector('.e-rte-audio-dialog .e-audio-content')) ? this.parent.element.querySelector('.e-rte-audio-dialog .e-audio-content') : document.getElementById(this.rteId + '_audio').querySelector('.e-audio-content');
        if (isNOU(dialogContent)) { return; }
        const spanElement: HTMLElement = document.getElementById(this.rteId + '_dropText');
        const buttonElement: HTMLElement = document.getElementById(this.rteId + '_insertAudio');
        this.buttonClickElement = Browser.isDevice ? spanElement : buttonElement;
        EventHandler.add(this.buttonClickElement, 'click', this.audioBrowseClick, this);
        if ((!isNOU(this.parent.insertAudioSettings.path) && this.parent.editorMode === 'Markdown')
            || this.parent.editorMode === 'HTML') {
            (dialogContent.querySelector('#' + this.rteId + '_insertAudio') as HTMLElement).focus();
        } else {
            (dialogContent.querySelector('.e-audio-url') as HTMLElement).focus();
        }
    }
    public fileSelected(): void {
        if (this.inputUrl) { this.inputUrl.setAttribute('disabled', 'true'); }
    }
    public fileUploadSuccess(url: string, fileName: string): void {
        this.inputUrl = this.parent.element.querySelector('.e-rte-audio-dialog .e-audio-url');
        if (!isNOU(this.parent.insertAudioSettings.path)) {
            this.uploadUrl = {
                url: url, selection: this.audUploadSave, fileName: fileName, selectParent: this.audUploadSelectedParent
            };
            if (this.inputUrl) { this.inputUrl.setAttribute('disabled', 'true'); }
        }
    }
    public fileUploadComplete(base64Str: string, fileName: string): void {
        this.inputUrl = this.parent.element.querySelector('.e-rte-audio-dialog .e-audio-url');
        if (this.parent.editorMode === 'HTML' && isNOU(this.parent.insertAudioSettings.path)) {
            const url: string = this.parent.insertAudioSettings.saveFormat === 'Base64' ? base64Str :
                URL.createObjectURL(convertToBlob(base64Str));
            this.uploadUrl = {
                url: url, selection: this.audUploadSave, fileName: fileName, selectParent: this.audUploadSelectedParent
            };
            if (this.inputUrl) { this.inputUrl.setAttribute('disabled', 'true'); }
        }
    }
    public fileUploadChange(url: string, isStream: boolean): void {
        this.modifiedUrl = url;
        this.isStreamUrl = isStream;
    }
    public fileRemoving(): void {
        this.inputUrl.removeAttribute('disabled');
        if (this.uploadUrl) { this.uploadUrl.url = ''; }
    }
    public dialogClosed(): void {
        if (this.parent.editorMode === 'HTML') {
            this.selectionObj.selection.restore();
        } else {
            this.parent.formatter.editorManager.markdownSelection.restore(this.parent.getEditPanel() as HTMLTextAreaElement);
        }
        if (this.buttonClickElement) { EventHandler.remove(this.buttonClickElement, 'click', this.audioBrowseClick); }
    }
    public insertAudioUrl(): void {
        const dialogElement: Element = this.parent.element.ownerDocument.querySelector('#' + this.rteId + '_audio');
        if  (!Browser.isDevice) {
            this.inputUrl = !isNOU(this.parent.element.querySelector('.e-rte-audio-dialog .e-audio-url')) ?
                this.parent.element.querySelector('.e-rte-audio-dialog .e-audio-url') : dialogElement.querySelector('.e-rte-elements .e-rte-audio-dialog .e-audio-url');
        } else {
            this.inputUrl = this.parent.inputElement.ownerDocument.querySelector('#' + this.rteId + '_Audio').querySelector('.e-rte-audio-dialog .e-audio-url');
        }
        const url: string = this.inputUrl.value;
        if (this.isStreamUrl && this.modifiedUrl !== '') {
            this.uploadUrl.url = this.modifiedUrl;
            this.modifiedUrl = '';
        }
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        if (!isNOU(this.uploadUrl) && this.uploadUrl.url !== '') {
            this.uploadUrl.cssClass = this.parent.insertAudioSettings.layoutOption.toLowerCase() === 'inline' ? classes.CLS_AUDINLINE : classes.CLS_AUDBREAK;
            (this.parent.dotNetRef.invokeMethodAsync(events.closeAudioDialog, null) as unknown as Promise<DialogCloseEventArgs>)
                .then(() => {
                    const dialogElement: HTMLElement = this.parent.element.ownerDocument.querySelector('#' + this.rteId + '_audio');
                    if (!isNOU(dialogElement)) {
                        return;
                    } else {
                        this.parent.formatter.process(
                            this.parent, this.selectionObj.args, (this.selectionObj.args as ClickEventArgs).originalEvent, this.uploadUrl);
                    }
                });
        } else if (url !== '') {
            if (this.parent.editorMode === 'HTML' && isNOU(
                closest(this.selectionObj.selection.range.startContainer.parentNode, '#' + this.parent.getPanel().id)) && !(this.parent.iframeSettings.enable)) {
                (this.parent.getEditPanel() as HTMLElement).focus();
                const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
                this.selectionObj.selection = this.parent.formatter.editorManager.nodeSelection.save(range, this.parent.getDocument());
                this.selectionObj.selectParent = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            }
            const name: string = this.parent.editorMode === 'HTML' ? url.split('/')[url.split('/').length - 1] : '';
            const value: IAudioCommandsArgs = {
                cssClass: (this.parent.insertAudioSettings.layoutOption.toLowerCase() === 'inline' ? classes.CLS_AUDINLINE : classes.CLS_AUDBREAK),
                url: url, selection: this.selectionObj.selection,  fileName: name, selectParent: this.selectionObj.selectParent
            };
            (this.parent.dotNetRef.invokeMethodAsync(events.closeAudioDialog, null) as unknown as Promise<DialogCloseEventArgs>)
                .then(() => {
                    const dialogElement: HTMLElement = this.parent.element.ownerDocument.querySelector('#' + this.rteId + '_audio');
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
            this.audioDialog({
                args: {
                    item: { command: 'Audios', subCommand: 'Audio' } as IToolbarItemModel,
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
    private onIframeMouseDown(e: MouseEvent): void {
        this.parent.dotNetRef.invokeMethodAsync(events.closeAudioDialog, null);
        this.onDocumentClick(e);
    }
    private onDocumentClick(e: MouseEvent): void {
        const target: HTMLElement = <HTMLElement>e.target;
        if (this.isAudioElem(target)) { this.audEle = (target as HTMLElement).querySelector('audio') as HTMLAudioElement; }
        const dlgEle: HTMLElement = document.body.querySelector('#' + this.rteId + '_audio.e-rte-audio-dialog');
        if (!isNOU(dlgEle) && ((
            !closest(target, '#' + this.rteId + '_audio') && this.parent.toolbarSettings.enable && this.parent.getToolbarElement() &&
            !this.parent.getToolbarElement().contains(e.target as Node)) ||
            (this.parent.getToolbarElement() && this.parent.getToolbarElement().contains(e.target as Node) &&
                !closest(target, '#' + this.rteId + '_toolbar_Audio') &&
                !target.querySelector('#' + this.rteId + '_toolbar_Audio')))
        ) {
            if (!(e.offsetX > (e.target as HTMLAudioElement).clientWidth || e.offsetY > (e.target as HTMLAudioElement).clientHeight)) {
                this.parent.dotNetRef.invokeMethodAsync(events.closeAudioDialog, events.outsideClicked);
                this.parent.isBlur = true;
                if (Browser.isIE) { dispatchEvent(this.parent.element, 'focusout'); }
            }
        }
        if (!this.isAudioElem(target)) {
            if (!isNOU(this.audEle) && this.audEle.style.outline !== '') {
                this.audEle.style.outline = '';
            } else if (!isNOU(this.prevSelectedAudEle) && this.prevSelectedAudEle.style.outline !== '') {
                this.prevSelectedAudEle.style.outline = '';
            }
        }
        if (this.parent.inlineMode.enable && !isNOU(target) && !isNOU(dlgEle) && (!closest(target, '#' + this.rteId + '_audio'))) {
            this.parent.dotNetRef.invokeMethodAsync(events.closeAudioDialog, events.outsideClicked);
        }
    }
    private audioClick(e: MouseEvent): void {
        if (Browser.isDevice) {
            if ((this.isAudioElem(e.target as HTMLElement) &&
                (e.target as HTMLElement).parentElement.tagName === 'A') ||
                (this.isAudioElem(e.target as HTMLElement))) {
                this.parent.getEditPanel().setAttribute('contenteditable', 'false');
                (e.target as HTMLElement).focus();
            } else {
                if (!this.parent.readonly) {
                    this.parent.getEditPanel().setAttribute('contenteditable', 'true');
                }
            }
        }
        if (this.isAudioElem(e.target as HTMLElement) &&
            (e.target as HTMLElement).parentElement.tagName === 'A') {
            e.preventDefault();
        }
    }
    private onKeyDown(event: NotifyArgs): void {
        const originalEvent: KeyboardEventArgs = event.args as KeyboardEventArgs;
        let range: Range;
        let save: NodeSelection;
        let selectNodeEle: Node[]; let selectParentEle: Node[]; this.deletedAud = []; let isCursor: boolean;
        const keyCodeValues: number[] = [27, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123,
            44, 45, 9, 16, 17, 18, 19, 20, 33, 34, 35, 36, 37, 38, 39, 40, 91, 92, 93, 144, 145, 182, 183];
        if (this.parent.editorMode === 'HTML') {
            range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
            isCursor = range.startContainer === range.endContainer && range.startOffset === range.endOffset;
        }
        if (!isCursor && this.parent.editorMode === 'HTML' && keyCodeValues.indexOf(originalEvent.which) < 0) {
            const nodes: Node[] = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
            for (let i: number = 0; i < nodes.length; i++) {
                if (this.isAudioElem(nodes[i as number] as HTMLElement)) {
                    this.deletedAud.push(nodes[i as number]);
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
                (this.isAudioElem(selectParentEle[0] as HTMLElement)) && (selectParentEle[0] as HTMLElement).parentElement) {
                const prev: Node = ((selectParentEle[0] as HTMLElement).parentElement as HTMLElement).childNodes[0];
                this.parent.formatter.editorManager.nodeSelection.setSelectionText(
                    this.parent.getDocument(), prev, prev, prev.textContent.length, prev.textContent.length);
                removeClass([selectParentEle[0] as HTMLElement], classes.CLS_AUD_FOCUS);
                this.quickToolObj.hideAudioQTBar();
                if (!isNOU(this.audEle)) {
                    this.audEle.style.outline = '';
                }
            }
        }
        if (originalEvent.ctrlKey && (originalEvent.keyCode === 89 || originalEvent.keyCode === 90)) {
            this.undoStack({ subCommand: (originalEvent.keyCode === 90 ? 'undo' : 'redo') });
        }
        if (originalEvent.keyCode === 8 || originalEvent.keyCode === 46) {
            if (selectNodeEle && (this.isAudioElem(selectNodeEle[0] as HTMLElement) ||
                (originalEvent.keyCode === 46 && (selectNodeEle[0].nextSibling as HTMLElement) &&
                this.isAudioElem(selectNodeEle[0].nextSibling as HTMLElement)) ||
                (originalEvent.keyCode === 8 && (selectNodeEle[0].previousSibling as HTMLElement) &&
                this.isAudioElem(selectNodeEle[0].previousSibling as HTMLElement))) &&
                selectNodeEle.length <= 2 && selectNodeEle[0].nodeName !== '#text') {
                originalEvent.preventDefault();
                const event: IImageNotifyArgs = {
                    selectNode: selectNodeEle, selection: save, selectParent: selectParentEle,
                    args: {
                        item: { command: 'Audios', subCommand: 'Remove' } as IToolbarItemModel,
                        originalEvent: originalEvent
                    }
                };
                this.deleteAud(event, originalEvent.keyCode);
            }
        }
        switch (originalEvent.action) {
        case 'escape':
            this.parent.dotNetRef.invokeMethodAsync(events.closeAudioDialog, null);
            break;
        case 'backspace':
        case 'delete':
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
            this.showDialog(false, originalEvent, save, selectNodeEle, selectParentEle);
            originalEvent.preventDefault();
            break;
        }
        if (originalEvent.ctrlKey && originalEvent.key === 'a') {
            this.handleSelectAll();
        }
    }

    private handleSelectAll(): void {
        const audioFocusNodes: NodeListOf<Element> = this.parent.inputElement.querySelectorAll('.' + classes.CLS_AUD_FOCUS);
        removeClass(audioFocusNodes, classes.CLS_AUD_FOCUS);
    }

    private onKeyUp(event: NotifyArgs): void {
        if (!isNOU(this.deletedAud) && this.deletedAud.length > 0) {
            for (let i: number = 0; i < this.deletedAud.length; i++) {
                const elem: HTMLElement = this.deletedAud[i as number] as HTMLElement;
                const srcElem: HTMLElement = elem.tagName === 'SOURCE' ? elem : elem.querySelector('source');
                const args: MediaDeletedEventArgs = {
                    src: srcElem.getAttribute('src')
                };
                if (this.parent.mediaDeleteEnabled) { this.parent.dotNetRef.invokeMethodAsync('MediaDeleted', args); }
            }
        }
    }
    //#endregion
    public destroy(): void {
        this.prevSelectedAudEle = undefined;
        this.removeEventListener();
    }
}
