import { addClass, Browser, closest, createElement, detach, EventHandler, isNullOrUndefined as isNOU, KeyboardEventArgs, removeClass } from '../../../base'; /*externalscript*/
import { ClickEventArgs } from '../../../navigations/src'; /*externalscript*/
import { ActionBeginEventArgs, IDropDownItemModel, IShowPopupArgs, IToolbarItemModel, NotifyArgs, DialogCloseEventArgs } from '../../editor-scripts/common/interface';
import { NodeSelection } from '../../editor-scripts/selection/selection';
import { QuickToolbar } from '../actions/quick-toolbar';
import * as classes from '../classes';
import * as events from '../constant';
import { IImageNotifyArgs } from '../interfaces';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { dispatchEvent } from '../util';
import { convertToBlob } from '../../editor-scripts/common/util';

/**
 * `ImportWord` module is used to handle Word document import actions.
 */
export class ImportWord {
    private rteId: string;
    private modifiedUrl: string;
    private isStreamUrl: boolean;
    private parent: SfRichTextEditor;
    private quickToolObj: QuickToolbar;
    private inputUrl: HTMLInputElement;
    private wordUploadSave: NodeSelection;
    private uploadUrl: { url: string; selection?: NodeSelection; fileName?: string; selectParent?: Node[] };
    private selectionObj: { 
        selfWord?: ImportWord; 
        selection?: NodeSelection; 
        args?: any; 
        selectParent?: Node[] 
    };
    private wordUploadSelectedParent: Node[];
    private buttonClickElement: HTMLElement;

    constructor(parent?: SfRichTextEditor) {
        this.parent = parent;
        this.rteId = parent.element.id;
        this.quickToolObj = this.parent.quickToolbarModule;
        this.addEventListener();
    }

    protected addEventListener(): void {
        this.parent.observer.on(events.destroy, this.destroy, this);
        this.parent.observer.on(events.docClick, this.docClick, this);
        this.parent.observer.on(events.importWord, this.wordDialog, this);
        this.parent.observer.on(events.initialEnd, this.afterRender, this);
        this.parent.observer.on(events.iframeMouseDown, this.onIframeMouseDown, this);
    }

    protected removeEventListener(): void {
        this.parent.observer.off(events.destroy, this.destroy);
        this.parent.observer.off(events.docClick, this.docClick);
        this.parent.observer.off(events.importWord, this.wordDialog);
        this.parent.observer.off(events.initialEnd, this.afterRender);
        this.parent.observer.off(events.iframeMouseDown, this.onIframeMouseDown);
    }
    private docClick(e: { [key: string]: object }): void {
        const target: HTMLElement = <HTMLElement>(e.args as MouseEvent).target;
        const currentDocument: Document = this.parent.iframeSettings.enable ? this.parent.getPanel().ownerDocument : this.parent.getDocument();
        const dlgEle: HTMLElement = currentDocument.querySelector('#' + this.rteId + '_import.e-rte-import-dialog');
        
        if (!isNOU(dlgEle) && ((
            !closest(target, '#' + this.rteId + '_import') && this.parent.toolbarSettings.enable && this.parent.getToolbarElement() &&
            !this.parent.getToolbarElement().contains(target as Node)) ||
            (this.parent.getToolbarElement() && this.parent.getToolbarElement().contains(target as Node) &&
                !closest(target, '#' + this.rteId + '_toolbar_ImportWord') &&
                !target.querySelector('#' + this.rteId + '_toolbar_ImportWord')))
        ) {
            const mouseEvent = e.args as MouseEvent;
            if (!(mouseEvent.offsetX > (target as HTMLElement).clientWidth || mouseEvent.offsetY > (target as HTMLElement).clientHeight)) {
                this.parent.dotNetRef.invokeMethodAsync(events.closeWordDialog, events.outsideClicked);
                this.parent.isBlur = true;
                if (Browser.isIE) {
                    dispatchEvent(this.parent.element, 'focusout');
                }
            }
        }
        if (this.parent.inlineMode.enable && !isNOU(target) && !isNOU(dlgEle) && (!closest(target, '#' + this.rteId + '_import'))) {
            this.parent.dotNetRef.invokeMethodAsync(events.closeWordDialog, events.outsideClicked);
        }
    }

    private afterRender(): void {
        // Add any event handlers needed after render
        EventHandler.add(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick, this);
    }

    public wordDialog(e: IImageNotifyArgs): void {
        const currentDocument: Document = this.parent.iframeSettings.enable ? this.parent.getPanel().ownerDocument : this.parent.getDocument();
        this.parent.dotNetRef.invokeMethodAsync(events.closeWordDialog, null);
        this.selectionObj = { selfWord: this, selection: e.selection, args: e.args, selectParent: e.selectParent };
        const iframe: boolean = this.parent.iframeSettings.enable;
        if ((!iframe && isNOU(closest(e.selection.range.startContainer.parentNode, '#' +
            this.parent.getPanel().id))
            || (iframe && isNOU(e.selection.range.startContainer.parentNode.ownerDocument.querySelector('body'))))) {
            (this.parent.getEditPanel() as HTMLElement).focus();
            const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(currentDocument);
            this.wordUploadSave = this.parent.formatter.editorManager.nodeSelection.save(
                range, currentDocument);
            this.wordUploadSelectedParent = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
        } else {
            this.wordUploadSave = e.selection; 
            this.wordUploadSelectedParent = e.selectParent;
        }
        this.parent.dotNetRef.invokeMethodAsync(events.showWordDialog);
        
        // Hide any active quicktoolbars
        if (this.quickToolObj) {
            this.quickToolObj.hideInlineQTBar();
            if (!isNOU(this.quickToolObj.textQTBar) && !isNOU(this.quickToolObj.textQTBar.element) && 
                this.quickToolObj.textQTBar.element.classList.contains('e-popup-open')) {
                this.quickToolObj.hideTextQTBar();
            }
        }
    }

    public dialogOpened(): void {
        const currentDocument: Document = this.parent.iframeSettings.enable ? this.parent.getPanel().ownerDocument : this.parent.getDocument();
        const dialogContent: HTMLElement = Browser.isDevice ? currentDocument.getElementById(this.rteId + '_import').querySelector('.e-import-content') :
            !isNOU(this.parent.element.querySelector('.e-rte-import-dialog .e-import-content')) ? 
            this.parent.element.querySelector('.e-rte-import-dialog .e-import-content') : 
            currentDocument.querySelector('.e-rte-elements .e-rte-import-dialog .e-import-content');
        
        if (isNOU(dialogContent)) { return; }
        
        const spanElement: HTMLElement = currentDocument.getElementById(this.rteId + '_dropText');
        const buttonElement: HTMLElement = currentDocument.getElementById(this.rteId + '_importWord');
        this.buttonClickElement = Browser.isDevice ? spanElement : buttonElement;
        
        EventHandler.add(this.buttonClickElement, 'click', this.wordBrowseClick, this);
        (dialogContent.querySelector('#' + this.rteId + '_importWord') as HTMLElement).focus();
    }

    public dialogClosed(): void {
        this.selectionObj.selection.restore();
        if (this.buttonClickElement) { 
            EventHandler.remove(this.buttonClickElement, 'click', this.wordBrowseClick); 
        }
    }

    private wordBrowseClick(): void {
        const currentDocument: Document = this.parent.iframeSettings.enable ? this.parent.getPanel().ownerDocument : this.parent.getDocument();
        (currentDocument.getElementById(this.rteId + '_import').querySelector('.e-rte-import-dialog .e-file-select-wrap button') as HTMLButtonElement).click();
    }

    private onIframeMouseDown(e: MouseEvent): void {
        this.onDocumentClick(e);
    }

    private onDocumentClick(e: MouseEvent): void {
        const target: HTMLElement = <HTMLElement>e.target;
        const currentDocument: Document = this.parent.iframeSettings.enable ? this.parent.getPanel().ownerDocument : this.parent.getDocument();
        const dlgEle: HTMLElement = currentDocument.body.querySelector('#' + this.rteId + '_import.e-rte-import-dialog');
        
        if (!isNOU(dlgEle) && ((
            !closest(target, '#' + this.rteId + '_import') && this.parent.toolbarSettings.enable && this.parent.getToolbarElement() &&
            !this.parent.getToolbarElement().contains(e.target as Node)) ||
            (this.parent.getToolbarElement() && this.parent.getToolbarElement().contains(e.target as Node) &&
                !closest(target, '#' + this.rteId + '_toolbar_ImportWord') &&
                !target.querySelector('#' + this.rteId + '_toolbar_ImportWord')))
        ) {
            if (!(e.offsetX > (e.target as HTMLElement).clientWidth || e.offsetY > (e.target as HTMLElement).clientHeight)) {
                this.parent.dotNetRef.invokeMethodAsync(events.closeWordDialog, events.outsideClicked);
                this.parent.isBlur = true;
                if (Browser.isIE) {
                    dispatchEvent(this.parent.element, 'focusout');
                }
            }
        }
        
        if (this.parent.inlineMode.enable && !isNOU(target) && !isNOU(dlgEle) && (!closest(target, '#' + this.rteId + '_import'))) {
            this.parent.dotNetRef.invokeMethodAsync(events.closeWordDialog, events.outsideClicked);
        }
    }

    public showDialog(isExternal: boolean): void {
        let range: Range;
        let save: NodeSelection;
        let selectNodeEle: Node[];
        let selectParentEle: Node[];
        const currentDocument: Document = this.parent.iframeSettings.enable ? this.parent.getPanel().ownerDocument : this.parent.getDocument();

        if (isExternal && !isNOU(this.parent.formatter.editorManager.nodeSelection)) {
            range = this.parent.formatter.editorManager.nodeSelection.getRange(currentDocument);
            save = this.parent.formatter.editorManager.nodeSelection.save(
                range, currentDocument);
            selectNodeEle = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
            selectParentEle = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
        }
        this.wordDialog({
            args: {
                item: { command: 'ImportWord', subCommand: 'ImportWord' } as IToolbarItemModel,
                originalEvent: isExternal ? undefined : event,
                name: isExternal ? 'showDialog' : null
            },
            selectNode: selectNodeEle,
            selection: save,
            selectParent: selectParentEle
        });
    }

    public destroy(): void {
        this.removeEventListener();
        EventHandler.remove(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick);
    }
}