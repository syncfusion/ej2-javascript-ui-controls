import { isNullOrUndefined, closest, KeyboardEventArgs, attributes, removeClass, addClass } from '@syncfusion/ej2-base';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import * as events from '../constant';
import * as classes from '../classes';
import { sanitizeHelper } from '../util';
import { isIDevice } from '../../src/common/util';
import { XhtmlValidation } from './xhtml-validation';
import { HtmlToolbarStatus } from './html-toolbar-status';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { HTMLFormatter } from '../formatter/html-formatter';
import { NodeSelection } from '../../src/selection/selection';
import { InsertHtml } from '../../src/editor-manager/plugin/inserthtml';
import { getTextNodesUnder } from '../../src/rich-text-editor/base/util';
import { NotifyArgs, IToolbarOptions, IToolbarItemModel } from '../../src/rich-text-editor/base/interface';

/**
 * `HtmlEditor` module is used to HTML editor
 */
export class HtmlEditor {
    private parent: SfRichTextEditor;
    private saveSelection: NodeSelection;
    private rangeCollection: Range[] = [];
    private nodeSelectionObj: NodeSelection;
    private toolbarUpdate: HtmlToolbarStatus;
    public xhtmlValidation: XhtmlValidation;

    constructor(parent?: SfRichTextEditor) {
        this.parent = parent;
        this.xhtmlValidation = new XhtmlValidation(parent);
        this.addEventListener();
    }
    private addEventListener(): void {
        this.nodeSelectionObj = new NodeSelection();
        this.parent.observer.on(events.htmlToolbarClick, this.onToolbarClick, this);
        this.parent.observer.on(events.keyDown, this.onKeyDown, this);
        this.parent.observer.on(events.initialEnd, this.render, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
        this.parent.observer.on(events.selectAll, this.selectAll, this);
        this.parent.observer.on(events.selectRange, this.selectRange, this);
        this.parent.observer.on(events.getSelectedHtml, this.getSelectedHtml, this);
        this.parent.observer.on(events.selectionSave, this.onSelectionSave, this);
        this.parent.observer.on(events.selectionRestore, this.onSelectionRestore, this);
        this.parent.observer.on(events.readOnlyMode, this.updateReadOnly, this);
        this.parent.observer.on(events.paste, this.onPaste, this);
    }
    public sanitizeHelper(value: string): string {
        value = sanitizeHelper(value, this.parent);
        return value;
    }
    private updateReadOnly(): void {
        if (this.parent.readonly) {
            attributes(this.parent.getEditPanel(), { contenteditable: 'false' });
            addClass([this.parent.element], classes.CLS_RTE_READONLY);
        } else {
            attributes(this.parent.getEditPanel(), { contenteditable: 'true' });
            removeClass([this.parent.element], classes.CLS_RTE_READONLY);
        }
    }
    private onSelectionSave(): void {
        let currentDocument: Document = this.parent.getDocument();
        let range: Range = this.nodeSelectionObj.getRange(currentDocument);
        this.saveSelection = this.nodeSelectionObj.save(range, currentDocument);
    }
    private onSelectionRestore(e: IToolbarOptions): void {
        this.parent.isBlur = false;
        (this.parent.getEditPanel() as HTMLElement).focus();
        if (isNullOrUndefined(e.items) || e.items) {
            this.saveSelection.restore();
        }
    }
    private onKeyDown(e: NotifyArgs): void {
        if ((e.args as KeyboardEvent).keyCode === 9 && this.parent.enableTabKey) {
            let range: Range = this.nodeSelectionObj.getRange(this.parent.getDocument());
            let parentNode: Node[] = this.nodeSelectionObj.getParentNodeCollection(range);
            if (!((parentNode[0].nodeName === 'LI' || closest(parentNode[0] as HTMLElement, 'li') ||
                closest(parentNode[0] as HTMLElement, 'table')) && range.startOffset === 0)) {
                (e.args as KeyboardEvent).preventDefault();
                if (!(e.args as KeyboardEvent).shiftKey) {
                    InsertHtml.Insert(this.parent.getDocument(), '&nbsp;&nbsp;&nbsp;&nbsp;');
                    this.rangeCollection.push(this.nodeSelectionObj.getRange(this.parent.getDocument()));
                } else if (this.rangeCollection.length > 0 &&
                    this.rangeCollection[this.rangeCollection.length - 1].startContainer.textContent.length === 4) {
                    let textCont: Node = this.rangeCollection[this.rangeCollection.length - 1].startContainer;
                    this.nodeSelectionObj.setSelectionText(
                        this.parent.getDocument(), textCont, textCont, 0, textCont.textContent.length);
                    InsertHtml.Insert(this.parent.getDocument(), document.createTextNode(''));
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
            let range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
            let saveSelection: NodeSelection = this.parent.formatter.editorManager.nodeSelection.save(
                range, this.parent.getDocument());
            let httpRegex: RegExp = new RegExp(/([^\S]|^)(((https?\:\/\/)))/gi);
            let wwwRegex: RegExp = new RegExp(/([^\S]|^)(((www\.))(\S+))/gi);
            let enterSplitText: string[] = e.text.split('\n');
            let contentInnerElem: string = '';
            for (let i: number = 0; i < enterSplitText.length; i++) {
                if (enterSplitText[i].trim() === '') {
                    contentInnerElem += '<p><br></p>';
                } else {
                    let contentWithSpace: string = '';
                    let spaceBetweenContent: boolean = true;
                    let spaceSplit: string[] = enterSplitText[i].split(' ');
                    for (let j: number = 0; j < spaceSplit.length; j++) {
                        if (spaceSplit[j].trim() === '') {
                            contentWithSpace += spaceBetweenContent ? '&nbsp;' : ' ';
                        } else {
                            spaceBetweenContent = false;
                            contentWithSpace += spaceSplit[j] + ' ';
                        }
                    }
                    if (i === 0) {
                        contentInnerElem += '<span>' + contentWithSpace.trim() + '</span>';
                    } else {
                        contentInnerElem += '<p>' + contentWithSpace.trim() + '</p>';
                    }
                }
            }
            let divElement: HTMLElement = document.createElement('div');
            divElement.setAttribute('class', 'pasteContent');
            divElement.style.display = 'inline';
            divElement.innerHTML = contentInnerElem;
            let paraElem: NodeListOf<HTMLParagraphElement> = divElement.querySelectorAll('span, p');
            for (let i: number = 0; i < paraElem.length; i++) {
                let splitTextContent: string[] = paraElem[i].innerHTML.split(' ');
                let resultSplitContent: string = '';
                for (let j: number = 0; j < splitTextContent.length; j++) {
                    if (splitTextContent[j].match(httpRegex) || splitTextContent[j].match(wwwRegex)) {
                        resultSplitContent += '<a className="e-rte-anchor" href="' + splitTextContent[j] +
                            '" title="' + splitTextContent[j] + '">' + splitTextContent[j] + ' </a>';
                    } else {
                        resultSplitContent += splitTextContent[j] + ' ';
                    }
                }
                paraElem[i].innerHTML = resultSplitContent.trim();
            }
            // if (!isNullOrUndefined(this.parent.pasteCleanupModule)) {
            e.callBack(divElement.innerHTML);
            // } else {
            //     this.parent.executeCommand('insertHTML', divElement);
            // }
        }
    }
    private spaceLink(e?: KeyboardEvent): void {
        let range: Range = this.nodeSelectionObj.getRange(this.parent.getDocument());
        let selectNodeEle: Node[] = this.nodeSelectionObj.getParentNodeCollection(range);
        let text: string = range.startContainer.textContent.substr(0, range.endOffset);
        let splitText: string[] = text.split(' ');
        let urlText: string = splitText[splitText.length - 1];
        let urlTextRange: number = range.startOffset - (text.length - splitText[splitText.length - 1].length);
        urlText = urlText.slice(0, urlTextRange);
        let regex: RegExp = new RegExp(/([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi);
        if (selectNodeEle[0].nodeName !== 'A' && urlText.match(regex)) {
            let selection: NodeSelection = this.nodeSelectionObj.save(
                range, this.parent.getDocument());
            let url: string = urlText.indexOf('http') > -1 ? urlText : 'http://' + urlText;
            let selectParent: Node[] = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            let value: NotifyArgs = {
                url: url,
                selection: selection, selectParent: selectParent,
                text: urlText,
                title: '',
                target: '_blank'
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
        let closestElement: Element = closest(args.originalEvent.target as Element, '.' + classes.CLS_QUICK_POP);
        if (closestElement && !closestElement.classList.contains(classes.CLS_INLINE_POP)) {
            if (!(item.subCommand === 'SourceCode' || item.subCommand === 'Preview' ||
                item.subCommand === 'FontColor' || item.subCommand === 'BackgroundColor')) {
                if (isIDevice() && item.command === 'Images') { this.nodeSelectionObj.restore(); }
                let range: Range = this.nodeSelectionObj.getRange(this.parent.getDocument());
                save = this.nodeSelectionObj.save(range, this.parent.getDocument());
                selectNodeEle = this.nodeSelectionObj.getNodeCollection(range);
                selectParentEle = this.nodeSelectionObj.getParentNodeCollection(range);
            }
            if (item.command === 'Images') {
                this.parent.observer.notify(events.imageToolbarAction, {
                    member: 'image', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                });
            }
            if (item.command === 'Links') {
                this.parent.observer.notify(events.linkToolbarAction, {
                    member: 'link', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                });
            }
            if (item.command === 'Table') {
                this.parent.observer.notify(events.tableToolbarAction, {
                    member: 'table', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                });
            }
        } else {
            if (!(item.subCommand === 'SourceCode' || item.subCommand === 'Preview' ||
                item.subCommand === 'FontColor' || item.subCommand === 'BackgroundColor')) {
                let range: Range = this.nodeSelectionObj.getRange(this.parent.getDocument());
                save = this.nodeSelectionObj.save(range, this.parent.getDocument());
                selectNodeEle = this.nodeSelectionObj.getNodeCollection(range);
                selectParentEle = this.nodeSelectionObj.getParentNodeCollection(range);
            }
            switch (item.subCommand) {
                case 'Maximize':
                    this.parent.observer.notify(events.enableFullScreen, { args: args });
                    break;
                case 'Minimize':
                    this.parent.observer.notify(events.disableFullScreen, { args: args });
                    break;
                case 'CreateLink':
                    this.parent.observer.notify(events.insertLink, {
                        member: 'link', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                    });
                    break;
                case 'RemoveLink':
                    this.parent.observer.notify(events.unLink, {
                        member: 'link', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                    });
                    break;
                case 'Print':
                    this.parent.print();
                    break;
                case 'Image':
                    this.parent.observer.notify(events.insertImage, {
                        member: 'image', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                    });
                    break;
                case 'CreateTable':
                    this.parent.observer.notify(events.createTable, {
                        member: 'table', args: args, selection: save
                    });
                    break;
                case 'SourceCode':
                    this.parent.observer.notify(events.sourceCode, { member: 'viewSource', args: args });
                    break;
                case 'Preview':
                    this.parent.observer.notify(events.updateSource, { member: 'updateSource', args: args });
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
    private render(): void {
        let editElement: HTMLTextAreaElement = this.parent.getEditPanel() as HTMLTextAreaElement;
        let option: { [key: string]: number } = { undoRedoSteps: this.parent.undoRedoSteps, undoRedoTimer: this.parent.undoRedoTimer };
        this.parent.formatter = new HTMLFormatter({
            currentDocument: this.parent.getDocument(),
            element: editElement,
            options: option
        });
        if (this.parent.toolbarSettings.enable) {
            this.toolbarUpdate = new HtmlToolbarStatus(this.parent);
        }
        this.parent.observer.notify(events.bindOnEnd, {});
    }
    private selectAll(): void {
        let nodes: Node[] = getTextNodesUnder(
            this.parent.getDocument(),
            (this.parent.getEditPanel() as HTMLElement));
        if (nodes.length > 0) {
            this.parent.formatter.editorManager.nodeSelection.setSelectionText(
                this.parent.getDocument(),
                nodes[0],
                nodes[nodes.length - 1],
                0,
                nodes[nodes.length - 1].textContent.length);
        }
    }
    private selectRange(e: NotifyArgs): void {
        this.parent.formatter.editorManager.nodeSelection.setRange(
            this.parent.getDocument(),
            e.range);
    }
    private getSelectedHtml(e: NotifyArgs): void {
        e.callBack(this.parent.formatter.editorManager.nodeSelection.getRange(
            this.parent.getDocument(),
        ).toString());
    }
    private removeEventListener(): void {
        this.parent.observer.off(events.initialEnd, this.render);
        this.parent.observer.off(events.htmlToolbarClick, this.onToolbarClick);
        this.parent.observer.off(events.destroy, this.destroy);
        this.parent.observer.off(events.keyDown, this.onKeyDown);
        this.parent.observer.off(events.selectAll, this.selectAll);
        this.parent.observer.off(events.selectRange, this.selectRange);
        this.parent.observer.off(events.getSelectedHtml, this.getSelectedHtml);
        this.parent.observer.off(events.selectionSave, this.onSelectionSave);
        this.parent.observer.off(events.selectionRestore, this.onSelectionRestore);
        this.parent.observer.off(events.readOnlyMode, this.updateReadOnly);
        this.parent.observer.off(events.paste, this.onPaste);
    }
    public destroy(): void {
        this.removeEventListener();
    }
}