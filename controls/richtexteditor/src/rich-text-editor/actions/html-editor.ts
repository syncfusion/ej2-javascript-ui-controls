import * as events from '../base/constant';
import { IRichTextEditor, IToolbarItemModel, IColorPickerRenderArgs, IRenderer } from '../base/interface';
import { NotifyArgs, IToolbarOptions } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { isNullOrUndefined, closest, KeyboardEventArgs, attributes, removeClass, addClass } from '@syncfusion/ej2-base';
import { HTMLFormatter } from '../formatter/html-formatter';
import { RendererFactory } from '../services/renderer-factory';
import { RenderType } from '../base/enum';
import * as classes from '../base/classes';
import { HtmlToolbarStatus } from './html-toolbar-status';
import { IframeContentRender } from '../renderer/iframe-content-renderer';
import { ContentRender } from '../renderer/content-renderer';
import { ColorPickerInput } from './color-picker';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { NodeSelection } from '../../selection/selection';
import { InsertHtml } from '../../editor-manager/plugin/inserthtml';
import { getTextNodesUnder } from '../base/util';
import { isIDevice } from '../../common/util';
import { SanitizeHtmlHelper } from './sanitize-helper';
import { RichTextEditorModel } from '../base/rich-text-editor-model';

/**
 * `HtmlEditor` module is used to HTML editor
 */
export class HtmlEditor {
    private parent: IRichTextEditor;
    private locator: ServiceLocator;
    private contentRenderer: IRenderer;
    private renderFactory: RendererFactory;
    private toolbarUpdate: HtmlToolbarStatus;
    private colorPickerModule: ColorPickerInput;
    private nodeSelectionObj: NodeSelection;
    private rangeCollection: Range[] = [];
    private saveSelection: NodeSelection;
    private sanitize: SanitizeHtmlHelper;

    constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.locator = serviceLocator;
        this.renderFactory = this.locator.getService<RendererFactory>('rendererFactory');
        this.sanitize = new SanitizeHtmlHelper();
        this.addEventListener();
    }
    /**
     * Destroys the Markdown.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        this.removeEventListener();
    }

    /** 
     * @hidden
     */
    public sanitizeHelper(value: string): string {
        value = this.sanitize.initialize(value, this.parent);
        return value;
    }

    private addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.nodeSelectionObj = new NodeSelection();
        this.colorPickerModule = new ColorPickerInput(this.parent, this.locator);
        this.parent.on(events.initialLoad, this.instantiateRenderer, this);
        this.parent.on(events.htmlToolbarClick, this.onToolbarClick, this);
        this.parent.on(events.keyDown, this.onKeyDown, this);
        this.parent.on(events.renderColorPicker, this.renderColorPicker, this);
        this.parent.on(events.initialEnd, this.render, this);
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.selectAll, this.selectAll, this);
        this.parent.on(events.selectRange, this.selectRange, this);
        this.parent.on(events.getSelectedHtml, this.getSelectedHtml, this);
        this.parent.on(events.selectionSave, this.onSelectionSave, this);
        this.parent.on(events.selectionRestore, this.onSelectionRestore, this);
        this.parent.on(events.readOnlyMode, this.updateReadOnly, this);
        this.parent.on(events.paste, this.onPaste, this);
    }
    private updateReadOnly(): void {
        if (this.parent.readonly) {
            attributes(this.parent.contentModule.getEditPanel(), { contenteditable: 'false' });
            addClass([this.parent.element], classes.CLS_RTE_READONLY);
        } else {
            attributes(this.parent.contentModule.getEditPanel(), { contenteditable: 'true' });
            removeClass([this.parent.element], classes.CLS_RTE_READONLY);
        }
    }
    private onSelectionSave(): void {
        let currentDocument: Document = this.contentRenderer.getDocument();
        let range: Range = this.nodeSelectionObj.getRange(currentDocument);
        this.saveSelection = this.nodeSelectionObj.save(range, currentDocument);
    }

    private onSelectionRestore(e: IToolbarOptions): void {
        this.parent.isBlur = false;
        (this.contentRenderer.getEditPanel() as HTMLElement).focus();
        if (isNullOrUndefined(e.items) || e.items) {
            this.saveSelection.restore();
        }
    }

    private onKeyDown(e: NotifyArgs): void {
        if ((e.args as KeyboardEvent).keyCode === 9 && this.parent.enableTabKey) {
            let range: Range = this.nodeSelectionObj.getRange(this.contentRenderer.getDocument());
            let parentNode: Node[] = this.nodeSelectionObj.getParentNodeCollection(range);
            if (!((parentNode[0].nodeName === 'LI' || parentNode[0].nodeName === 'BR' || closest(parentNode[0] as HTMLElement, 'li')) &&
                range.startOffset === 0)) {
                (e.args as KeyboardEvent).preventDefault();
                if (!(e.args as KeyboardEvent).shiftKey) {
                    InsertHtml.Insert(this.contentRenderer.getDocument(), '&nbsp;&nbsp;&nbsp;&nbsp;');
                    this.rangeCollection.push(this.nodeSelectionObj.getRange(this.contentRenderer.getDocument()));
                } else if (this.rangeCollection.length > 0 &&
                    this.rangeCollection[this.rangeCollection.length - 1].startContainer.textContent.length === 4) {
                    let textCont: Node = this.rangeCollection[this.rangeCollection.length - 1].startContainer;
                    this.nodeSelectionObj.setSelectionText(
                        this.contentRenderer.getDocument(), textCont, textCont, 0, textCont.textContent.length);
                    InsertHtml.Insert(this.contentRenderer.getDocument(), document.createTextNode(''));
                    this.rangeCollection.pop();
                }
            }
        }
        if (((e as NotifyArgs).args as KeyboardEventArgs).action === 'space' ||
            ((e as NotifyArgs).args as KeyboardEventArgs).action === 'enter') {
            this.spaceLink(e.args as KeyboardEvent);
        }
    }
    private onPaste(e: NotifyArgs): void {
        let regex: RegExp = new RegExp(/([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi);
        if (e.text.match(regex)) {
            (e.args as KeyboardEvent).preventDefault();
            let range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            let saveSelection: NodeSelection = this.parent.formatter.editorManager.nodeSelection.save(
                range, this.parent.contentModule.getDocument());
            let firstElement: HTMLElement = this.parent.createElement('span');
            let httpRegex: RegExp = new RegExp(/([^\S]|^)(((https?\:\/\/)))/gi);
            let wwwRegex: RegExp = new RegExp(/([^\S]|^)(((www\.))(\S+))/gi);
            let httpText: string = '';
            if (e.text.match(httpRegex)) {
                firstElement.innerHTML = e.text.split('http')[0];
                httpText = 'http' + e.text.split('http')[1];
            } else if (e.text.match(wwwRegex)) {
                firstElement.innerHTML = e.text.split('www')[0];
                httpText = 'www' + e.text.split('www')[1];
            }
            let httpSplitText: string[] = httpText.split(' ');
            let splittedText: string = '';
            for (let i: number = 1; i < httpSplitText.length; i++) {
                splittedText = splittedText + ' ' + httpSplitText[i];
            }
            let lastElement: HTMLElement = this.parent.createElement('span');
            lastElement.innerHTML = splittedText;
            let anchor: HTMLElement = this.parent.createElement('a', {
                className: 'e-rte-anchor', attrs: {
                    href: httpSplitText[0],
                    title: httpSplitText[0]
                }
            });
            anchor.innerHTML = httpSplitText[0];
            let resultElement: HTMLElement = this.parent.createElement('span');
            if (firstElement.innerHTML !== '') {
                resultElement.appendChild(firstElement);
            }
            if (anchor.innerHTML !== '') {
                resultElement.appendChild(anchor);
            }
            if (lastElement.innerHTML !== '') {
                resultElement.appendChild(lastElement);
            }
            if (!isNullOrUndefined(this.parent.pasteCleanupModule)) {
                e.callBack(resultElement.innerHTML);
            } else {
                this.parent.executeCommand('insertHTML', resultElement);
            }
        }
    }
    private spaceLink(e?: KeyboardEvent): void {
        let range: Range = this.nodeSelectionObj.getRange(this.contentRenderer.getDocument());
        let selectNodeEle: Node[] = this.nodeSelectionObj.getParentNodeCollection(range);
        let text: string = range.startContainer.textContent;
        let splitText: string[] = text.split(' ');
        let urlText: string = splitText[splitText.length - 1];
        let urlTextRange: number = range.startOffset - (text.length - splitText[splitText.length - 1].length);
        urlText = urlText.slice(0, urlTextRange);
        let regex: RegExp = new RegExp(/([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi);
        if (selectNodeEle[0].nodeName !== 'A' && urlText.match(regex)) {
            let selection: NodeSelection = this.nodeSelectionObj.save(
                range, this.parent.contentModule.getDocument());
            let selectParent: Node[] = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            let value: NotifyArgs = {
                url: urlText,
                selection: selection, selectParent: selectParent,
                text: '',
                title: '',
                target: ''
            };
            this.parent.formatter.process(
                this.parent, {
                    item: {
                        'command': 'Links',
                        'subCommand': 'CreateLink'
                    }
                },
                e, value);
        }
    }
    private onToolbarClick(args: ClickEventArgs): void {
        let save: NodeSelection;
        let selectNodeEle: Node[];
        let selectParentEle: Node[];
        let item: IToolbarItemModel = args.item as IToolbarItemModel;
        let closestElement: Element = closest(args.originalEvent.target as Element, '.e-rte-quick-popup');
        if (closestElement && !closestElement.classList.contains('e-rte-inline-popup')) {
            if (!(item.subCommand === 'SourceCode' || item.subCommand === 'Preview' ||
                item.subCommand === 'FontColor' || item.subCommand === 'BackgroundColor')) {
                if (isIDevice() && item.command === 'Images') { this.nodeSelectionObj.restore(); }
                let range: Range = this.nodeSelectionObj.getRange(this.parent.contentModule.getDocument());
                save = this.nodeSelectionObj.save(range, this.parent.contentModule.getDocument());
                selectNodeEle = this.nodeSelectionObj.getNodeCollection(range);
                selectParentEle = this.nodeSelectionObj.getParentNodeCollection(range);
            }
            if (item.command === 'Images') {
                this.parent.notify(events.imageToolbarAction, {
                    member: 'image', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                });
            }
            if (item.command === 'Links') {
                this.parent.notify(events.linkToolbarAction, {
                    member: 'link', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                });
            }
            if (item.command === 'Table') {
                this.parent.notify(events.tableToolbarAction, {
                    member: 'table', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                });
            }
        } else {
            let linkDialog: Element = this.parent.element.querySelector('#' + this.parent.getID() + '_rtelink');
            let imageDialog: Element = this.parent.element.querySelector('#' + this.parent.getID() + '_image');
            if (!(item.subCommand === 'SourceCode' || item.subCommand === 'Preview' ||
                item.subCommand === 'FontColor' || item.subCommand === 'BackgroundColor')) {
                let range: Range = this.nodeSelectionObj.getRange(this.parent.contentModule.getDocument());
                if (isNullOrUndefined(linkDialog) && isNullOrUndefined(imageDialog)) {
                    save = this.nodeSelectionObj.save(range, this.parent.contentModule.getDocument());
                }
                selectNodeEle = this.nodeSelectionObj.getNodeCollection(range);
                selectParentEle = this.nodeSelectionObj.getParentNodeCollection(range);
            }
            switch (item.subCommand) {
                case 'Maximize':
                    this.parent.notify(events.enableFullScreen, { args: args });
                    break;
                case 'Minimize':
                    this.parent.notify(events.disableFullScreen, { args: args });
                    break;
                case 'CreateLink':
                    this.parent.notify(events.insertLink, {
                        member: 'link', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                    });
                    break;
                case 'Print':
                    this.parent.print();
                    break;
                case 'Image':
                    this.parent.notify(events.insertImage, {
                        member: 'image', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                    });
                    break;
                case 'CreateTable':
                    this.parent.notify(events.createTable, {
                        member: 'table', args: args, selection: save
                    });
                    break;
                case 'SourceCode':
                    this.parent.notify(events.sourceCode, { member: 'viewSource', args: args });
                    break;
                case 'Preview':
                    this.parent.notify(events.updateSource, { member: 'updateSource', args: args });
                    break;
                case 'FontColor':
                case 'BackgroundColor':
                    break;
                default:
                    this.parent.formatter.process(this.parent, args, args.originalEvent, null);
                    break;
            }
        }
    }
    private renderColorPicker(args: IColorPickerRenderArgs): void {
        this.colorPickerModule.renderColorPickerInput(args);
    }

    private instantiateRenderer(): void {
        if (this.parent.iframeSettings.enable) {
            this.renderFactory.addRenderer(RenderType.Content, new IframeContentRender(this.parent, this.locator));
        } else {
            this.renderFactory.addRenderer(RenderType.Content, new ContentRender(this.parent, this.locator));
        }
    }

    private removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.initialEnd, this.render);
        this.parent.off(events.modelChanged, this.onPropertyChanged);
        this.parent.off(events.htmlToolbarClick, this.onToolbarClick);
        this.parent.off(events.renderColorPicker, this.renderColorPicker);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.keyDown, this.onKeyDown);
        this.parent.off(events.initialLoad, this.instantiateRenderer);
        this.parent.off(events.selectAll, this.selectAll);
        this.parent.off(events.selectRange, this.selectRange);
        this.parent.off(events.getSelectedHtml, this.getSelectedHtml);
        this.parent.off(events.selectionSave, this.onSelectionSave);
        this.parent.off(events.selectionRestore, this.onSelectionRestore);
        this.parent.off(events.readOnlyMode, this.updateReadOnly);
        this.parent.off(events.paste, this.onPaste);
    }

    private render(): void {
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
        let editElement: HTMLTextAreaElement = this.contentRenderer.getEditPanel() as HTMLTextAreaElement;
        let option: { [key: string]: number } = { undoRedoSteps: this.parent.undoRedoSteps, undoRedoTimer: this.parent.undoRedoTimer };
        if (isNullOrUndefined(this.parent.formatter)) {
            let formatterClass: HTMLFormatter = new HTMLFormatter({
                currentDocument: this.contentRenderer.getDocument(),
                element: editElement,
                options: option
            });
            this.parent.setProperties({ formatter: formatterClass }, true);
        } else {
            this.parent.formatter.updateFormatter(editElement, this.contentRenderer.getDocument(), option);
        }
        if (this.parent.toolbarSettings.enable) {
            this.toolbarUpdate = new HtmlToolbarStatus(this.parent);
        }
        this.parent.notify(events.bindOnEnd, {});
    }

    /**
     * Called internally if any of the property value changed.
     * @hidden
     */
    protected onPropertyChanged(e: { [key: string]: RichTextEditorModel }): void {
        // On property code change here
        if (!isNullOrUndefined(e.newProp.formatter)) {
            let editElement: HTMLTextAreaElement = this.contentRenderer.getEditPanel() as HTMLTextAreaElement;
            let option: { [key: string]: number } = { undoRedoSteps: this.parent.undoRedoSteps, undoRedoTimer: this.parent.undoRedoTimer };
            this.parent.formatter.updateFormatter(editElement, this.contentRenderer.getDocument(), option);
        }
    }

    /**
     * For internal use only - Get the module name.
     */
    private getModuleName(): string {
        return 'htmlEditor';
    }

    /**
     * For selecting all content in RTE
     * @private
     */
    private selectAll(): void {
        let nodes: Node[] = getTextNodesUnder(
            this.parent.contentModule.getDocument(),
            (this.parent.contentModule.getEditPanel() as HTMLElement));
        this.parent.formatter.editorManager.nodeSelection.setSelectionText(
            this.parent.contentModule.getDocument(),
            nodes[0],
            nodes[nodes.length - 1],
            0,
            nodes[nodes.length - 1].textContent.length);
    }

    /**
     * For selecting all content in RTE
     * @private
     */
    private selectRange(e: NotifyArgs): void {
        this.parent.formatter.editorManager.nodeSelection.setRange(
            this.parent.contentModule.getDocument(),
            e.range);
    }

    /**
     * For get a selected text in RTE
     * @private
     */
    private getSelectedHtml(e: NotifyArgs): void {
        e.callBack(this.parent.formatter.editorManager.nodeSelection.getRange(
            this.parent.contentModule.getDocument(),
        ).toString());
    }
}
