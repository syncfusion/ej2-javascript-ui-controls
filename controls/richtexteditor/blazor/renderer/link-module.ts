import { closest, addClass, removeClass, Browser, select, extend, EventHandler } from '@syncfusion/ej2-base';
import { KeyboardEventArgs, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import * as events from '../constant';
import { dispatchEvent } from '../util';
import { isIDevice } from '../../src/common/util';
import { QuickToolbar } from '../actions/quick-toolbar';
import { NotifyArgs, LinkFormModel } from '../interfaces';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { NodeSelection } from '../../src/selection/selection';
import { IDropDownItemModel } from '../../src/rich-text-editor/base/interface';
import { IImageNotifyArgs, IToolbarItemModel, IShowPopupArgs } from '../../src/rich-text-editor/base/interface';

/**
 * `Link` module is used to handle undo actions.
 */
export class Link {
    private rteId: string;
    private selectionObj: NotifyArgs;
    private parent: SfRichTextEditor;
    private quickToolObj: QuickToolbar;
    constructor(parent?: SfRichTextEditor) {
        this.parent = parent;
        this.rteId = this.parent.element.id;
        this.addEventListener();
    }
    protected addEventListener(): void {
        this.parent.observer.on(events.destroy, this.destroy, this);
        this.parent.observer.on(events.keyDown, this.onKeyDown, this);
        this.parent.observer.on(events.unLink, this.removeLink, this);
        this.parent.observer.on(events.insertLink, this.linkDialog, this);
        this.parent.observer.on(events.linkToolbarAction, this.onToolbarAction, this);
        this.parent.observer.on(events.iframeMouseDown, this.onIframeMouseDown, this);
        this.parent.observer.on(events.editAreaClick, this.editAreaClickHandler, this);
        this.parent.observer.on(events.insertCompleted, this.showLinkQuickToolbar, this);
    }
    protected removeEventListener(): void {
        this.parent.observer.off(events.destroy, this.destroy);
        this.parent.observer.off(events.keyDown, this.onKeyDown);
        this.parent.observer.off(events.unLink, this.removeLink);
        this.parent.observer.off(events.insertLink, this.linkDialog);
        this.parent.observer.off(events.linkToolbarAction, this.onToolbarAction);
        this.parent.observer.off(events.iframeMouseDown, this.onIframeMouseDown);
        this.parent.observer.off(events.editAreaClick, this.editAreaClickHandler);
        this.parent.observer.off(events.insertCompleted, this.showLinkQuickToolbar);
        EventHandler.remove(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick);
    }
    private linkDialog(e?: NotifyArgs, inputDetails?: { [key: string]: string }): void {
        if (this.parent.editorMode === 'HTML' && (e.selectParent.length > 0 && !isNOU((e.selectParent[0] as HTMLElement).classList) &&
            (e.selectParent[0] as HTMLElement).classList.contains('e-rte-anchor')) && isNOU(inputDetails)) {
            this.editLink(e); return;
        }
        this.selectionObj = { selection: e.selection, selectParent: e.selectParent, args: e.args as MouseEvent };
        let model: LinkFormModel = { url: '', text: '', title: '', target: true };
        if (!isNOU(inputDetails)) {
            model = {
                url: inputDetails.url, text: inputDetails.text,
                title: inputDetails.title, target: (inputDetails.target !== '' ? true : false)
            };
        }
        let selectText: string = (this.parent.editorMode === 'HTML') ? e.selection.getRange(this.parent.getDocument()).toString() : e.text;
        if ((this.parent.editorMode === 'HTML' && isNOU(inputDetails) && ((!isNOU(selectText) && selectText !== '') &&
            (e.selection.range.startOffset === 0) || e.selection.range.startOffset !== e.selection.range.endOffset)) ||
            e.module === 'Markdown') { model.text = selectText; }
        EventHandler.add(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick, this);
        this.parent.dotNetRef.invokeMethodAsync('ShowLinkDialog', model, (!isNOU(inputDetails) ? 'Edit' : null));
        if (this.quickToolObj) {
            this.hideLinkQuickToolbar();
            this.quickToolObj.hideInlineQTBar();
        }
    }
    public insertLink(args: LinkFormModel): void {
        let linkTitle: string;
        let linkUrl: string = args.url;
        let linkText: string = args.text;
        if (this.parent.editorMode === 'HTML') { linkTitle = args.title; }
        let target: string = args.target ? '_blank' : null;
        if (linkUrl === '') { this.checkUrl(true); return; }
        if (!this.isUrl(linkUrl)) {
            linkText = (linkText === '') ? linkUrl : linkText;
            linkUrl = (!this.parent.enableAutoUrl) ? (linkUrl.indexOf('http') > -1 ? linkUrl : 'http://' + linkUrl) : linkUrl;
        } else {
            this.checkUrl(false);
        }
        if (this.parent.editorMode === 'HTML' && isNOU(
            closest(this.selectionObj.selection.range.startContainer.parentNode, '#' + this.parent.getPanel().id))) {
            (this.parent.getEditPanel() as HTMLElement).focus();
            if (Browser.isIE && this.parent.iframeSettings.enable) { this.selectionObj.selection.restore(); }
            let range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
            this.selectionObj.selection = this.parent.formatter.editorManager.nodeSelection.save(
                range, this.parent.getDocument());
            this.selectionObj.selectParent = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
        }
        let value: NotifyArgs = {
            url: linkUrl, text: linkText, title: linkTitle, target: target,
            selection: this.selectionObj.selection, selectParent: this.selectionObj.selectParent
        };
        this.parent.dotNetRef.invokeMethodAsync('CloseLinkDialog');
        if (isIDevice() && this.parent.iframeSettings.enable) {
            (<HTMLIFrameElement>select('iframe', this.parent.element)).contentWindow.focus();
        }
        if (this.parent.editorMode === 'HTML') { this.selectionObj.selection.restore(); }
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        let argsValue: KeyboardEvent | MouseEvent | ClickEventArgs | ClipboardEvent | TouchEvent | Object;
        if ((this.selectionObj.args as KeyboardEvent).code === 'KeyK') {
            let event: KeyboardEventArgs = this.selectionObj.args as KeyboardEventArgs;
            event = { ...event, target: null };
            let argsVal: Object = { item: { command: 'Links', subCommand: 'CreateLink' } as IToolbarItemModel, originalEvent: event };
            extend(this.selectionObj.args, argsVal, true);
            argsValue = argsVal;
        } else {
            argsValue = this.selectionObj.args;
        }
        this.parent.formatter.process(this.parent, argsValue, (this.selectionObj.args as ClickEventArgs).originalEvent, value);
        (this.parent.getEditPanel() as HTMLElement).focus();
    }
    private isUrl(url: string): boolean {
        let regexp: RegExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi;
        return regexp.test(url);
    }
    private checkUrl(e: boolean): void {
        let linkUrl: HTMLInputElement = this.parent.element.querySelector('.e-rte-link-dialog .e-rte-linkurl');
        if (e) {
            addClass([linkUrl], 'e-error');
            linkUrl.setSelectionRange(0, linkUrl.value.length);
            linkUrl.focus();
        } else {
            removeClass([linkUrl], 'e-error');
        }
    }
    public cancelDialog(): void {
        if (isIDevice()) {
            this.selectionObj.selection.restore();
        } else {
            (this.parent.getEditPanel() as HTMLElement).focus();
        }
    }
    public linkDialogClosed(): void {
        if (this.parent.editorMode === 'HTML') {
            this.selectionObj.selection.restore();
        } else {
            this.parent.formatter.editorManager.markdownSelection.restore(this.parent.getEditPanel() as HTMLTextAreaElement);
        }
    }
    private getAnchorNode(element: HTMLElement): HTMLElement {
        let selectParent: HTMLElement = closest(element, 'a') as HTMLElement;
        return <HTMLElement>(selectParent ? selectParent : element);
    }
    private openLink(e: NotifyArgs): void {
        let selectParentEle: HTMLElement = this.getAnchorNode(e.selectParent[0] as HTMLElement);
        if (selectParentEle.classList.contains('e-rte-anchor') || selectParentEle.tagName === 'A') {
            this.parent.formatter.process(
                this.parent, e.args, e.args,
                {
                    url: (selectParentEle as HTMLAnchorElement).href,
                    target: (selectParentEle as HTMLAnchorElement).target === '' ? '_self' : '_blank', selectNode: e.selectNode,
                    subCommand: ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand
                });
        }
    }
    private editLink(e: NotifyArgs): void {
        let selectedNode: HTMLElement = this.getAnchorNode(e.selectNode[0] as HTMLElement);
        let selectParentEle: HTMLElement = this.getAnchorNode(e.selectParent[0] as HTMLElement);
        selectParentEle = selectedNode.nodeName === 'A' ? selectedNode : selectParentEle;
        if (selectParentEle.classList.contains('e-rte-anchor') || selectParentEle.tagName === 'A') {
            let inputDetails: { [key: string]: string } = {
                url: (selectParentEle as HTMLAnchorElement).getAttribute('href'), text: selectParentEle.innerText,
                title: selectParentEle.title, target: (selectParentEle as HTMLAnchorElement).target,
            };
            this.linkDialog(e, inputDetails);
        }
    }
    private removeLink(e: NotifyArgs): void {
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        this.parent.formatter.process(
            this.parent, e.args, e.args,
            {
                selectNode: e.selectNode, selectParent: e.selectParent, selection: e.selection,
                subCommand: ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand
            });
        if (isIDevice() && this.parent.iframeSettings.enable) {
            (<HTMLIFrameElement>select('iframe', this.parent.element)).contentWindow.focus();
        } else {
            (this.parent.getEditPanel() as HTMLElement).focus();
        }
        this.hideLinkQuickToolbar();
    }
    private onToolbarAction(args: NotifyArgs): void {
        let item: IToolbarItemModel = (args.args as ClickEventArgs).item as IToolbarItemModel;
        switch (item.subCommand) {
            case 'OpenLink':
                this.openLink(args);
                break;
            case 'EditLink':
                this.editLink(args);
                break;
            case 'RemoveLink':
                this.removeLink(args);
                break;
        }
    }
    private editAreaClickHandler(e: IImageNotifyArgs): void {
        if (this.parent.readonly) {
            this.hideLinkQuickToolbar();
            return;
        }
        let args: MouseEvent = e.args as MouseEvent;
        let showOnRightClick: boolean = this.parent.quickToolbarSettings.showOnRightClick as boolean;
        if (args.which === 2 || (showOnRightClick && args.which === 1) || (!showOnRightClick && args.which === 3)) { return; }
        if (this.parent.editorMode === 'HTML' && this.parent.quickToolbarModule) {
            let target: HTMLElement = args.target as HTMLElement;
            target = this.getAnchorNode(target);
            let isPopupOpen: boolean;
            isPopupOpen = document.body.querySelector('#' + this.rteId + '_Link_Quick_Popup').classList.contains('e-rte-pop');
            if (target.nodeName === 'A' && (target.childNodes.length > 0 && target.childNodes[0].nodeName !== 'IMG') &&
                ((e.args as MouseEvent).target as HTMLElement).nodeName !== 'IMG') {
                if (isPopupOpen) { return; }
                this.showLinkQuickToolbar({
                    args: args,
                    isNotify: false,
                    type: 'Links',
                    elements: [args.target as Element]
                } as IShowPopupArgs);
            } else {
                this.hideLinkQuickToolbar();
            }
        }
    }
    private showLinkQuickToolbar(e: IShowPopupArgs): void {
        if ((e.args as KeyboardEventArgs).action !== 'enter' && (e.args as KeyboardEventArgs).action !== 'space') {
            let pageX: number;
            let pageY: number;
            if (e.type !== 'Links' || isNOU(this.parent.quickToolbarModule)) { return; }
            this.quickToolObj = this.parent.quickToolbarModule;
            let parentTop: number = this.parent.element.getBoundingClientRect().top;
            let parentLeft: number = this.parent.element.getBoundingClientRect().left;
            let range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
            let target: HTMLElement;
            [].forEach.call(e.elements, (element: Element, index: number) => {
                if (index === 0) {
                    target = ((element.nodeName === '#text') ? (element.parentNode) : element) as HTMLElement;
                }
            });
            if (e.isNotify) {
                let tbElement: HTMLElement = this.parent.getToolbarElement() as HTMLElement;
                let linkTop: number = target.getBoundingClientRect().top;
                let linkLeft: number = target.getBoundingClientRect().left;
                let linkPos: number = linkTop - parentTop;
                let tbHeight: number = (tbElement) ? (tbElement.offsetHeight + this.parent.toolbarModule.getExpandTBarPopHeight()) : 0;
                pageX = (this.parent.iframeSettings.enable) ? parentLeft + linkLeft : target.getBoundingClientRect().left;
                pageY = window.pageYOffset + ((this.parent.iframeSettings.enable) ?
                    (parentTop + tbHeight + linkTop) : (parentTop + linkPos));
            } else {
                let args: Touch | MouseEvent;
                args = (e.args as TouchEvent).touches ? (e.args as TouchEvent).changedTouches[0] : args = e.args as MouseEvent;
                pageX = (this.parent.iframeSettings.enable) ? window.pageXOffset + parentLeft + args.clientX : args.pageX;
                pageY = (this.parent.iframeSettings.enable) ? window.pageYOffset + parentTop + args.clientY : args.pageY;
            }
            this.quickToolObj.showLinkQTBar(pageX, pageY, range.endContainer as HTMLElement, 'Link');
        }
    }
    private hideLinkQuickToolbar(): void {
        if (this.quickToolObj) {
            this.quickToolObj.hideLinkQTBar();
        }
    }
    private onKeyDown(event: NotifyArgs): void {
        let originalEvent: KeyboardEventArgs = event.args as KeyboardEventArgs;
        switch (originalEvent.action) {
            case 'escape':
                this.parent.dotNetRef.invokeMethodAsync('CloseLinkDialog');
                break;
            case 'insert-link':
                if (this.parent.editorMode === 'HTML') {
                    let range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
                    let save: NodeSelection = this.parent.formatter.editorManager.nodeSelection.save(
                        range, this.parent.getDocument());
                    let selectNodeEle: Node[] = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
                    let selectParentEle: Node[] = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
                    let eventArgs: NotifyArgs = {
                        args: event.args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                    };
                    this.linkDialog(eventArgs);
                } else {
                    let textArea: HTMLTextAreaElement = this.parent.getEditPanel() as HTMLTextAreaElement;
                    this.parent.formatter.editorManager.markdownSelection.save(textArea.selectionStart, textArea.selectionEnd);
                    this.linkDialog({
                        args: {
                            item: { command: 'Links', subCommand: 'Link' } as IToolbarItemModel,
                            originalEvent: originalEvent
                        },
                        member: 'link',
                        text: this.parent.formatter.editorManager.markdownSelection.getSelectedText(
                            this.parent.getEditPanel() as HTMLTextAreaElement),
                        module: 'Markdown',
                        name: 'insertLink'
                    });
                }
                originalEvent.preventDefault();
                break;
        }
    }
    private onDocumentClick(e: MouseEvent): void {
        let target: HTMLElement = <HTMLElement>e.target;
        let dlgId: string = '#' + this.rteId + '_rtelink';
        let tbEle: Element = this.parent.getToolbarElement();
        let tbEleId: string = '#' + this.rteId + '_toolbar_CreateLink';
        let linkDlgEle: Element = this.parent.element.querySelector(dlgId);
        if (!isNOU(linkDlgEle) && ((!closest(target, dlgId) && this.parent.toolbarSettings.enable &&
            tbEle && !tbEle.contains(e.target as Node)) || (((tbEle && tbEle.contains(e.target as Node)) ||
                this.parent.inlineMode.enable && !closest(target, dlgId)) && !closest(target, tbEleId) && !target.querySelector(tbEleId)))
        ) {
            this.parent.dotNetRef.invokeMethodAsync('CloseLinkDialog');
            this.parent.isBlur = true;
            dispatchEvent(this.parent.element, 'focusout');
        }
    }
    private onIframeMouseDown(): void {
        this.parent.dotNetRef.invokeMethodAsync('CloseLinkDialog');
    }
    public destroy(): void {
        this.removeEventListener();
    }
}