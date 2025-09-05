import { closest, addClass, removeClass, Browser, select, extend, EventHandler } from '../../../base'; /*externalscript*/
import { KeyboardEventArgs, isNullOrUndefined as isNOU } from '../../../base'; /*externalscript*/
import { ClickEventArgs } from '../../../navigations/src'; /*externalscript*/
import * as events from '../constant';
import { dispatchEvent } from '../util';
import { isIDevice } from '../../editor-scripts/common/util';
import { QuickToolbar } from '../actions/quick-toolbar';
import { NotifyArgs, LinkFormModel, IImageNotifyArgs } from '../interfaces';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { NodeSelection } from '../../editor-scripts/selection/selection';
import { LinkCommand } from '../../editor-scripts/editor-manager/plugin/link';
import { IDropDownItemModel, DialogCloseEventArgs } from '../../editor-scripts/common/interface';
import { IToolbarItemModel, IShowPopupArgs } from '../../editor-scripts/common/interface';

/**
 * `Link` module is used to handle undo actions.
 */
export class Link {
    private rteId: string;
    private selectionObj: NotifyArgs;
    private parent: SfRichTextEditor;
    private quickToolObj: QuickToolbar;
    private linkQTPopupTime: number;
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
        this.parent.observer.on(events.bindOnEnd, this.bindOnEnd, this);
        this.parent.observer.on(events.selectionChangeMouseUp, this.editAreaClickHandler, this);
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
        this.parent.observer.off(events.bindOnEnd, this.bindOnEnd);
        this.parent.observer.off(events.selectionChangeMouseUp, this.editAreaClickHandler);
        EventHandler.remove(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick);
    }
    private bindOnEnd(): void {
        if (!this.parent.formatter.editorManager.linkObj) {
            this.parent.formatter.editorManager.linkObj = new LinkCommand(this.parent.formatter.editorManager);
        }
    }
    private linkDialog(e?: NotifyArgs, inputDetails?: { [key: string]: string }): void {
        const selectText: string = (this.parent.editorMode === 'HTML') ? e.selection.getRange(this.parent.getDocument()).toString() : e.text;
        if (!isNOU(inputDetails) && ((!isNOU(e.selectParent) && e.selectParent.length > 1) ||
            (!isNOU(e.selectNode) && e.selectNode.length > 1))) {
            inputDetails.text = selectText;
        }
        if (this.parent.editorMode === 'HTML' && (this.hasAnchorNodePresent(e.selectParent) || this.hasAnchorNodePresent(e.selectNode)) &&
            isNOU(inputDetails)) {
            this.editLink(e);
            return;
        }
        this.selectionObj = { selection: e.selection, selectParent: e.selectParent, args: e.args as MouseEvent };
        let model: LinkFormModel = { url: '', text: '', title: '', target: true };
        if (!isNOU(inputDetails)) {
            model = {
                url: inputDetails.url, text: inputDetails.text,
                title: inputDetails.title, target: (inputDetails.target !== '' ? true : false)
            };
        }
        if ((this.parent.editorMode === 'HTML' && isNOU(inputDetails) && ((!isNOU(selectText) && selectText !== '') &&
            (e.selection.range.startOffset === 0) || e.selection.range.startOffset !== e.selection.range.endOffset)) ||
            e.module === 'Markdown') { model.text = selectText; }
        EventHandler.add(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick, this);
        if (isNOU(select('.e-rte-link-dialog', this.parent.element))) {
            this.parent.dotNetRef.invokeMethodAsync('ShowLinkDialog', model, (!isNOU(inputDetails) ? 'Edit' : null));
        } else {
            this.parent.dotNetRef.invokeMethodAsync('CloseLinkDialog', null);
        }
        if (this.quickToolObj) {
            this.hideLinkQuickToolbar();
            this.quickToolObj.hideInlineQTBar();
            if (!isNOU(this.quickToolObj.textQTBar) && !isNOU(this.quickToolObj.textQTBar.element) && this.quickToolObj.textQTBar.element.classList.contains('e-popup-open')) {
                this.quickToolObj.hideTextQTBar();
            }
        }
    }
    private hasAnchorNodePresent(elements: Node[]): boolean {
        return !isNOU(elements) && elements.length > 0 &&
            elements.some((element: HTMLElement) => element && closest(element, 'a') !== null);
    }
    public insertLink(args: LinkFormModel): void {
        let linkTitle: string;
        let linkUrl: string = args.url.trim();
        let linkText: string = args.text;
        if (this.parent.editorMode === 'HTML') { linkTitle = args.title; }
        const target: string = args.target ? '_blank' : null;
        const linkLabel: string = args.target ? this.parent.localeData.linkAriaLabel : null;
        if (this.parent.editorMode === 'Markdown' && linkUrl === '') {
            linkUrl = 'https://';
        }
        if (linkUrl === '') { this.checkUrl(true); return; }
        if (this.parent.editorMode === 'Markdown') {
            linkText = (linkText.trim() !== '') ? linkText : '';
        } else {
            linkText = (linkText.trim() === '') ? linkUrl : linkText;
        }
        if (!this.isUrl(linkUrl)) {
            linkUrl = (!this.parent.enableAutoUrl) ? (linkUrl.indexOf('https') > -1 ? linkUrl : 'https://' + linkUrl) : linkUrl;
        } else {
            this.checkUrl(false);
        }
        if (this.parent.editorMode === 'HTML' && isNOU(
            closest(this.selectionObj.selection.range.startContainer.parentNode, '#' + this.parent.getPanel().id))) {
            (this.parent.getEditPanel() as HTMLElement).focus();
            if (Browser.isIE && this.parent.iframeSettings.enable) { this.selectionObj.selection.restore(); }
            const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
            this.selectionObj.selection = this.parent.formatter.editorManager.nodeSelection.save(
                range, this.parent.getDocument());
            this.selectionObj.selectParent = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
        }
        const value: NotifyArgs = {
            url: linkUrl, text: linkText, title: linkTitle, target: target, ariaLabel: linkLabel,
            selection: this.selectionObj.selection, selectParent: this.selectionObj.selectParent
        };
        (this.parent.dotNetRef.invokeMethodAsync('CloseLinkDialog', null) as unknown as Promise<DialogCloseEventArgs>).then(() => {
            const dialogElement: HTMLElement = this.parent.element.ownerDocument.querySelector('#' + this.rteId + '_rtelink');
            if (!isNOU(dialogElement)) {
                return;
            } else {
                if (isIDevice() && this.parent.iframeSettings.enable) {
                    (<HTMLIFrameElement>select('iframe', this.parent.element)).contentWindow.focus();
                }
                if (this.parent.editorMode === 'HTML') { this.selectionObj.selection.restore(); }
                if (this.parent.formatter.getUndoRedoStack().length === 0) {
                    this.parent.formatter.saveData();
                }
                let argsValue: KeyboardEvent | MouseEvent | ClickEventArgs | ClipboardEvent | TouchEvent | Object;
                if (!isNOU(this.selectionObj.args as KeyboardEvent) && (this.selectionObj.args as KeyboardEvent).code === 'KeyK') {
                    let event: KeyboardEventArgs = this.selectionObj.args as KeyboardEventArgs;
                    event = { ...event, target: null };
                    const argsVal: Object = { item: { command: 'Links', subCommand: 'CreateLink' } as IToolbarItemModel, originalEvent: event };
                    extend(this.selectionObj.args, argsVal, true);
                    argsValue = argsVal;
                } else {
                    argsValue = this.selectionObj.args;
                }
                this.parent.formatter.process(this.parent, argsValue, (!isNOU(this.selectionObj.args as ClickEventArgs) &&
                    (this.selectionObj.args as ClickEventArgs).originalEvent), value);
                (this.parent.getEditPanel() as HTMLElement).focus();
            }
        });
    }
    private isUrl(url: string): boolean {
        const regExp: RegExpConstructor = RegExp;
        const regexp: RegExp = new regExp('(ftp|http|https)://(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(/|/([\\w#!:.?+=&%@\\-\\/]))?', 'gi');
        return regexp.test(url);
    }
    private checkUrl(e: boolean): void {
        const linkUrl: HTMLInputElement = !isNOU(this.parent.element.querySelector('.e-rte-link-dialog .e-rte-linkurl')) ?
            this.parent.element.querySelector('.e-rte-link-dialog .e-rte-linkurl') : document.querySelector('.e-rte-elements.e-rte-link-dialog .e-rte-linkurl') ;
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
    private getAnchorNode(elements: Node[]): HTMLElement {
        for (const element of elements) {
            const anchorElement: HTMLElement = closest(element, 'a') as HTMLElement;
            if (anchorElement) {
                return anchorElement;
            }
        }
        return elements[0] as HTMLElement;
    }
    private openLink(e: NotifyArgs): void {
        const selectParentEle: HTMLElement = this.getAnchorNode(e.selectParent);
        if (selectParentEle.classList.contains('e-rte-anchor') || selectParentEle.tagName === 'A') {
            const sanitizedHTML: string = this.parent.htmlEditorModule.sanitizeHelper(selectParentEle.outerHTML);
            const tempEle: HTMLElement = document.createElement('div');
            tempEle.innerHTML = sanitizedHTML;
            this.parent.formatter.process(
                this.parent, e.args, e.args,
                {
                    url: (tempEle.firstChild as HTMLAnchorElement).href, text: selectParentEle.innerText,
                    target: (selectParentEle as HTMLAnchorElement).target === '' ? '_self' : '_blank', selectNode: e.selectNode,
                    subCommand: ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand
                });
            tempEle.remove();
        }
    }
    private editLink(e: NotifyArgs): void {
        const selectedNode: HTMLElement = this.getAnchorNode(e.selectNode);
        let selectParentEle: HTMLElement = this.getAnchorNode(e.selectParent);
        selectParentEle = selectedNode.nodeName === 'A' ? selectedNode : selectParentEle;
        if (selectParentEle.classList.contains('e-rte-anchor') || selectParentEle.tagName === 'A') {
            const inputDetails: { [key: string]: string } = {
                url: (selectParentEle as HTMLAnchorElement).getAttribute('href'), text: selectParentEle.innerText,
                title: selectParentEle.title, target: (selectParentEle as HTMLAnchorElement).target
            };
            this.linkDialog(e, inputDetails);
        }
    }
    private removeLink(e: NotifyArgs): void {
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        const selectParentEle: HTMLElement = this.getAnchorNode(e.selectParent);
        this.parent.formatter.process(
            this.parent, e.args, e.args,
            {
                selectNode: e.selectNode, selectParent: e.selectParent, selection: e.selection,
                text: selectParentEle.innerText,
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
        const item: IToolbarItemModel = (args.args as ClickEventArgs).item as IToolbarItemModel;
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
        const args: MouseEvent = e.args as MouseEvent;
        const showOnRightClick: boolean = this.parent.quickToolbarSettings.showOnRightClick as boolean;
        if (args.which === 2 || (showOnRightClick && args.which === 1) || (!showOnRightClick && args.which === 3)) { return; }
        if (this.parent.editorMode === 'HTML' && this.parent.quickToolbarModule) {
            let target: HTMLElement = args.target as HTMLElement;
            const isTargetDocument: boolean = target && ((target as HTMLElement).nodeName === 'HTML' || (target as HTMLElement).nodeName === '#document');
            const isTargetNotRteElements: boolean = !(target && (target as HTMLElement).nodeName !== '#text' &&
                (target as HTMLElement).nodeName !== '#document' && (target as HTMLElement).nodeName !== 'HTML' &&
                (target as HTMLElement).closest('.e-rte-elements'));
            if (isTargetDocument || (!this.parent.inputElement.contains(target as HTMLElement) && isTargetNotRteElements)) {
                const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
                target = range.commonAncestorContainer.parentElement;
            }
            target = this.getAnchorNode([target]);
            if (target.nodeName === 'A' && (target.childNodes.length > 0 && target.childNodes[0].nodeName !== 'IMG') &&
                ((e.args as MouseEvent).target as HTMLElement).nodeName !== 'IMG') {
                if ((e.args as MouseEvent).ctrlKey === false) {
                    this.showLinkQuickToolbar({
                        args: args,
                        isNotify: false,
                        type: 'Links',
                        elements: [args.target as Element]
                    } as IShowPopupArgs);
                }
                else {
                    const selection: NodeSelection = this.parent.formatter.editorManager.nodeSelection;
                    const range: Range = selection.getRange(this.parent.getDocument());
                    const args: object = {
                        args: {
                            item: {
                                subCommand: 'OpenLink',
                                command: 'Links',
                                name: ''
                            },
                            originalEvent: e.args
                        },
                        selectNode: selection.getNodeCollection(range),
                        selectParent: selection.getParentNodeCollection(range),
                        selection: selection.save(range, this.parent.getDocument())
                    };
                    this.openLink(args);
                }
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
            const parentTop: number = this.parent.element.getBoundingClientRect().top;
            const parentLeft: number = this.parent.element.getBoundingClientRect().left;
            const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
            const tbElement: HTMLElement = this.parent.getToolbarElement() as HTMLElement;
            const tbHeight: number = (tbElement) ? (tbElement.offsetHeight + this.parent.toolbarModule.getExpandTBarPopHeight()) : 0;
            let target: HTMLElement;
            [].forEach.call(e.elements, (element: Element, index: number) => {
                if (index === 0) {
                    target = ((element.nodeName === '#text') ? (element.parentNode) : element) as HTMLElement;
                }
            });
            if (e.isNotify) {
                const targetRect: ClientRect = target.getBoundingClientRect();
                const linkTop: number = targetRect.top;
                const linkLeft: number = targetRect.left;
                const linkPos: number = linkTop - parentTop;
                pageX = this.parent.iframeSettings.enable ? parentLeft + linkLeft : linkLeft;
                pageY = window.scrollY + (this.parent.iframeSettings.enable ?
                    (parentTop + tbHeight + linkTop) : (parentTop + linkPos));
                this.linkQTPopupTime = setTimeout(() => {
                    this.quickToolObj.showLinkQTBar(range.endContainer as HTMLElement, e.args as MouseEvent );
                }, 400);
            } else {
                let args: Touch | MouseEvent;
                args = (e.args as TouchEvent).touches ? (e.args as TouchEvent).changedTouches[0] : args = e.args as MouseEvent;
                pageX = this.parent.iframeSettings.enable ? window.scrollX + parentLeft + args.clientX : args.pageX;
                pageY = this.parent.iframeSettings.enable ? window.scrollY + parentTop + tbHeight + args.clientY : args.pageY;
                this.quickToolObj.showLinkQTBar(range.endContainer as HTMLElement, e.args as MouseEvent );
            }
        }
    }

    private hideLinkQuickToolbar(): void {
        if (this.quickToolObj) {
            this.quickToolObj.hideLinkQTBar();
        }
    }
    public showDialog(isExternal: boolean, event?: NotifyArgs): void {
        if (isExternal) {
            (this.parent.getEditPanel() as HTMLElement).focus();
        }
        if (this.parent.editorMode === 'HTML') {
            const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
            const save: NodeSelection = this.parent.formatter.editorManager.nodeSelection.save(
                range, this.parent.getDocument());
            const selectNodeEle: Node[] = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
            const selectParentEle: Node[] = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            const eventArgs: NotifyArgs = {
                args: (isExternal ? { item: { command: 'Links', subCommand: 'CreateLink' } as IToolbarItemModel,
                    originalEvent: undefined } : event.args),
                selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
            };
            this.linkDialog(eventArgs);
        } else {
            const textArea: HTMLTextAreaElement = this.parent.getEditPanel() as HTMLTextAreaElement;
            this.parent.formatter.editorManager.markdownSelection.save(textArea.selectionStart, textArea.selectionEnd);
            this.linkDialog({
                args: {
                    item: { command: 'Links', subCommand: 'Link' } as IToolbarItemModel,
                    originalEvent: isExternal ? undefined : event.args as KeyboardEventArgs
                },
                member: 'link',
                text: this.parent.formatter.editorManager.markdownSelection.getSelectedText(
                    this.parent.getEditPanel() as HTMLTextAreaElement),
                module: 'Markdown',
                name: 'insertLink'
            });
        }
    }
    private onKeyDown(event: NotifyArgs): void {
        const originalEvent: KeyboardEventArgs = event.args as KeyboardEventArgs;
        switch (originalEvent.action) {
        case 'escape':
            this.parent.dotNetRef.invokeMethodAsync('CloseLinkDialog', null);
            break;
        case 'insert-link':
            this.showDialog(false, event);
            originalEvent.preventDefault();
            break;
        }
    }
    private onDocumentClick(e: MouseEvent): void {
        const target: HTMLElement = <HTMLElement>e.target;
        const dlgId: string = '#' + this.rteId + '_rtelink';
        const tbEle: Element = this.parent.getToolbarElement();
        const tbEleId: string = '#' + this.rteId + '_toolbar_CreateLink';
        const linkDlgEle: Element = this.parent.element.querySelector(dlgId);
        const customDlgTrg: boolean = !isNOU(document.querySelector('.e-rte-link-dialog')) ? document.querySelector('.e-rte-link-dialog').classList.contains('e-rte-elements') : false;
        if ((!isNOU(linkDlgEle) || customDlgTrg) && ((!closest(target, dlgId) && this.parent.toolbarSettings.enable &&
            tbEle && !tbEle.contains(e.target as Node)) || (((tbEle && tbEle.contains(e.target as Node)) ||
                this.parent.inlineMode.enable && !closest(target, dlgId)) && !closest(target, tbEleId) && !target.querySelector(tbEleId)))
        ) {
            this.parent.dotNetRef.invokeMethodAsync('CloseLinkDialog', events.outsideClicked);
            EventHandler.remove(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick);
            this.parent.isBlur = true;
            if (Browser.isIE) { dispatchEvent(this.parent.element, 'focusout'); }
        }
    }
    private onIframeMouseDown(): void {
        this.parent.dotNetRef.invokeMethodAsync('CloseLinkDialog', null);
    }
    public destroy(): void {
        if (!isNOU(this.linkQTPopupTime)) {
            clearTimeout(this.linkQTPopupTime);
            this.linkQTPopupTime = null;
        }
        this.removeEventListener();
    }
}
