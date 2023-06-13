import * as events from '../base/constant';
import { IRichTextEditor, IToolbarItemModel, IColorPickerRenderArgs, IRenderer } from '../base/interface';
import { NotifyArgs, IToolbarOptions, ActionBeginEventArgs } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { isNullOrUndefined, closest, KeyboardEventArgs, attributes, removeClass, addClass, Browser, detach, MouseEventArgs } from '@syncfusion/ej2-base';
import { isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
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
import { IHtmlKeyboardEvent } from '../../editor-manager/base/interface';
import { getTextNodesUnder, sanitizeHelper, getDefaultValue } from '../base/util';
import { isIDevice } from '../../common/util';
import { RichTextEditorModel } from '../base/rich-text-editor-model';
import { XhtmlValidation } from './xhtml-validation';
import { ON_BEGIN } from './../../common/constant';
import { EditorManager } from '../../editor-manager';

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
    private rangeElement: Element;
    private oldRangeElement: Element;
    private deleteRangeElement: Element;
    private deleteOldRangeElement: Element;
    private isImageDelete: boolean = false;
    private saveSelection: NodeSelection;
    public xhtmlValidation: XhtmlValidation;
    private clickTimeout: number;

    public constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.locator = serviceLocator;
        this.renderFactory = this.locator.getService<RendererFactory>('rendererFactory');
        this.xhtmlValidation = new XhtmlValidation(parent);
        this.addEventListener();
    }
    /**
     * Destroys the Markdown.
     *
     * @function destroy
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public destroy(): void {
        this.removeEventListener();
    }

    /**
     * @param {string} value - specifies the string value
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public sanitizeHelper(value: string): string {
        value = sanitizeHelper(value, this.parent);
        return value;
    }

    private addEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.nodeSelectionObj = new NodeSelection();
        this.colorPickerModule = new ColorPickerInput(this.parent, this.locator);
        this.parent.on(events.initialLoad, this.instantiateRenderer, this);
        this.parent.on(events.htmlToolbarClick, this.onToolbarClick, this);
        this.parent.on(events.keyDown, this.onKeyDown, this);
        this.parent.on(events.keyUp, this.onKeyUp, this);
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
        this.parent.on(events.tableclass, this.isTableClassAdded, this);
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
        const currentDocument: Document = this.contentRenderer.getDocument();
        const range: Range = this.nodeSelectionObj.getRange(currentDocument);
        this.saveSelection = this.nodeSelectionObj.save(range, currentDocument);
    }

    private onSelectionRestore(e: IToolbarOptions): void {
        this.parent.isBlur = false;
        (this.contentRenderer.getEditPanel() as HTMLElement).focus();
        if (isNullOrUndefined(e.items) || e.items) {
            this.saveSelection.restore();
        }
    }

    private isTableClassAdded(): void  {
        const tableElement : NodeListOf<HTMLElement> = this.parent.inputElement.querySelectorAll('table');
        for (let i: number = 0; i < tableElement.length; i++) {
            if (!tableElement[i as number].classList.contains('e-rte-table')){
                tableElement[i as number].classList.add('e-rte-table');
            }
        }
    }

    private onKeyUp(e: NotifyArgs): void {
        const args: KeyboardEvent = e.args as KeyboardEvent;
        const restrictKeys: number[] = [8, 9, 13, 16, 17, 18, 20, 27, 37, 38, 39, 40, 44, 45, 46, 91,
            112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123];
        const range: Range = this.parent.getRange();
        // eslint-disable-next-line
        const regEx: RegExp = new RegExp(String.fromCharCode(8203), 'g');
        let pointer: number;
        let isRootParent: boolean = false;
        if (restrictKeys.indexOf(args.keyCode) < 0 && !args.shiftKey && !args.ctrlKey && !args.altKey) {
            pointer = range.startOffset;
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            range.startContainer.nodeName === '#text' ? range.startContainer.parentElement !== this.parent.inputElement ? range.startContainer.parentElement.classList.add('currentStartMark')
                : isRootParent = true : (range.startContainer as Element).classList.add('currentStartMark');
            if (range.startContainer.textContent.charCodeAt(0) === 8203) {
                const previousLength: number = range.startContainer.textContent.length;
                const previousRange: number = range.startOffset;
                range.startContainer.textContent = range.startContainer.textContent.replace(regEx, '');
                pointer = previousRange === 0 ? previousRange : previousRange - (previousLength - range.startContainer.textContent.length);
                this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                    this.parent.contentModule.getDocument(), range.startContainer as Element, pointer);
            }
            const previousLength: number = this.parent.inputElement.innerHTML.length;
            const currentLength: number = this.parent.inputElement.innerHTML.replace(regEx, '').length;
            let focusNode: Element = range.startContainer as Element;
            if (previousLength > currentLength && !isRootParent) {
                let currentChild: Element = this.parent.inputElement.firstChild as Element;
                while (!isNOU(currentChild) && currentChild.textContent.replace(regEx, '').trim().length > 0) {
                    currentChild.innerHTML = currentChild.innerHTML.replace(regEx, '');
                    currentChild = currentChild.nextElementSibling;
                }
                const currentChildNode : NodeListOf<ChildNode> = this.parent.inputElement.querySelector('.currentStartMark').childNodes;
                if (currentChildNode.length > 1) {
                    for (let i: number = 0; i < currentChildNode.length; i++) {
                        if (currentChildNode[i as number].nodeName === '#text' && currentChildNode[i as number].textContent.length === 0) {
                            detach(currentChildNode[i as number]);
                            i--;
                        }
                        if (focusNode.textContent.replace(regEx, '') === currentChildNode[i as number].textContent) {
                            pointer = focusNode.textContent.length > 1 ?
                                (focusNode.textContent === currentChildNode[i as number].textContent ? pointer :
                                pointer - (focusNode.textContent.length - focusNode.textContent.replace(regEx, '').length)) :
                                focusNode.textContent.length;
                            focusNode = currentChildNode[i as number] as Element;
                        }
                    }
                } else if (currentChildNode.length === 1) {
                    if (focusNode.textContent.replace(regEx, '') === currentChildNode[0].textContent) {
                        focusNode = currentChildNode[0] as Element;
                    }
                }
                this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                    this.parent.contentModule.getDocument(),
                    focusNode,
                    pointer);
            }
            const currentElem: Element = this.parent.inputElement.querySelector('.currentStartMark');
            if (!isNOU(currentElem)) {
                currentElem.classList.remove('currentStartMark');
                if (currentElem.getAttribute('class').trim() === '') {
                    currentElem.removeAttribute('class');
                }
            }
            if (!isNOU(range.startContainer.previousSibling) && !isNOU(range.startContainer.previousSibling.parentElement) &&
            range.startContainer.parentElement === range.startContainer.previousSibling.parentElement &&
            range.startContainer.previousSibling.textContent.charCodeAt(0) === 8203 &&
            range.startContainer.previousSibling.textContent.length <= 1) {
                range.startContainer.previousSibling.textContent = range.startContainer.previousSibling.textContent.replace(regEx, '');
            }
            if (range.endContainer.textContent.charCodeAt(range.endOffset) === 8203) {
                pointer = range.startOffset;
                range.endContainer.textContent = range.endContainer.textContent.replace(regEx, '');
                this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                    this.parent.contentModule.getDocument(), range.startContainer as Element, pointer);
            }
        }
    }

    private onKeyDown(e: NotifyArgs): void {
        let currentRange: Range;
        const args: KeyboardEvent = e.args as KeyboardEvent;
        if (Browser.info.name === 'chrome') {
            currentRange = this.parent.getRange();
            this.backSpaceCleanup(e, currentRange);
            this.deleteCleanup(e, currentRange);
        }
        if (args.keyCode === 9 && this.parent.enableTabKey) {
            if (!isNOU(args.target) && isNullOrUndefined(closest(args.target as Element, '.e-rte-toolbar'))) {
                const range: Range = this.nodeSelectionObj.getRange(this.contentRenderer.getDocument());
                const parentNode: Node[] = this.nodeSelectionObj.getParentNodeCollection(range);
                if (!((parentNode[0].nodeName === 'LI' || closest(parentNode[0] as HTMLElement, 'li') ||
                    closest(parentNode[0] as HTMLElement, 'table')) && range.startOffset === 0)) {
                    args.preventDefault();
                    if (!args.shiftKey) {
                        InsertHtml.Insert(this.contentRenderer.getDocument(), '&nbsp;&nbsp;&nbsp;&nbsp;');
                        this.rangeCollection.push(this.nodeSelectionObj.getRange(this.contentRenderer.getDocument()));
                    } else if (this.rangeCollection.length > 0 &&
                        this.rangeCollection[this.rangeCollection.length - 1].startContainer.textContent.length === 4) {
                        const textCont: Node = this.rangeCollection[this.rangeCollection.length - 1].startContainer;
                        this.nodeSelectionObj.setSelectionText(
                            this.contentRenderer.getDocument(), textCont, textCont, 0, textCont.textContent.length);
                        InsertHtml.Insert(this.contentRenderer.getDocument(), document.createTextNode(''));
                        this.rangeCollection.pop();
                    }
                }
            }
        }
        if (((e as NotifyArgs).args as KeyboardEventArgs).action === 'space' ||
            ((e as NotifyArgs).args as KeyboardEventArgs).action === 'enter' ||
            ((e as NotifyArgs).args as KeyboardEventArgs).keyCode === 13) {
            this.spaceLink(e.args as KeyboardEvent);
            if (this.parent.editorMode === 'HTML' && !this.parent.readonly) {
                const currentLength: number = this.parent.getText().trim().length;
                const selectionLength: number = this.parent.getSelection().length;
                const totalLength: number = (currentLength - selectionLength) + 1;
                if (!(this.parent.maxLength === -1 || totalLength <= this.parent.maxLength) &&
                ((e as NotifyArgs).args as KeyboardEventArgs).keyCode === 13) {
                    (e.args as KeyboardEvent).preventDefault();
                    return;
                } else {
                    this.parent.notify(events.enterHandler, { args: (e.args as KeyboardEvent) });
                }
            }
        }
        if (((e as NotifyArgs).args as KeyboardEventArgs).action === 'space') {
            const currentRange: Range = this.parent.getRange();
            const editorValue: string = currentRange.startContainer.textContent.slice(0, currentRange.startOffset);
            const orderedList: boolean = this.isOrderedList(editorValue);
            const unOrderedList: boolean =  this.isUnOrderedList(editorValue);
            if (orderedList && !unOrderedList || unOrderedList && !orderedList) {
                const eventArgs: IHtmlKeyboardEvent = {
                    callBack: null,
                    event: ((e as NotifyArgs).args as KeyboardEventArgs),
                    name: 'keydown-handler'
                };
                const actionBeginArgs: ActionBeginEventArgs = {
                    cancel: false,
                    item: { command: 'Lists', subCommand: orderedList ? 'OL' : 'UL' },
                    name: 'actionBegin',
                    originalEvent: ((e as NotifyArgs).args as KeyboardEventArgs),
                    requestType: orderedList ? 'OL' : 'UL'
                };
                this.parent.trigger(events.actionBegin, actionBeginArgs, (actionBeginArgs: ActionBeginEventArgs) => {
                    if (!actionBeginArgs.cancel) {
                        this.parent.formatter.editorManager.observer.notify(ON_BEGIN, eventArgs);
                        this.parent.trigger(events.actionComplete, {
                            editorMode: this.parent.editorMode,
                            elements: (this.parent.formatter.editorManager as EditorManager).domNode.blockNodes(),
                            event: ((e as NotifyArgs).args as KeyboardEventArgs),
                            name: events.actionComplete,
                            range: this.parent.getRange(),
                            requestType: orderedList ? 'OL' : 'UL'
                        });
                    }
                });
            }
        }
        if (Browser.info.name === 'chrome' && (!isNullOrUndefined(this.rangeElement) && !isNullOrUndefined(this.oldRangeElement) ||
        !isNullOrUndefined(this.deleteRangeElement) && !isNullOrUndefined(this.deleteOldRangeElement)) &&
        currentRange.startContainer.parentElement.tagName !== 'TD' && currentRange.startContainer.parentElement.tagName !== 'TH') {
            this.rangeElement = null;
            this.oldRangeElement = null;
            this.deleteRangeElement = null;
            this.deleteOldRangeElement = null;
            if (!this.isImageDelete) {
                args.preventDefault();
            }
            args.preventDefault();
        }
    }
    private isOrderedList(editorValue: string): boolean {
        editorValue = editorValue.replace(/\u200B/g, '');
        const olListStartRegex: RegExp[] = [/^[1]+[.]+$/, /^[i]+[.]+$/, /^[a]+[.]+$/];
        if (!isNullOrUndefined(editorValue)) {
            for (let i: number = 0; i < olListStartRegex.length; i++) {
                if (olListStartRegex[i as number].test(editorValue)) {
                    return true;
                }
            }
        }
        return false;
    }
    private isUnOrderedList(editorValue: string): boolean {
        editorValue = editorValue.replace(/\u200B/g, '');
        const ulListStartRegex: RegExp[] = [/^[*]$/, /^[-]$/ ];
        if (!isNullOrUndefined(editorValue)) {
            for (let i: number = 0; i < ulListStartRegex.length; i++) {
                if (ulListStartRegex[i as number].test(editorValue)) {
                    return true;
                }
            }
        }
        return false;
    }
    private backSpaceCleanup(e: NotifyArgs, currentRange: Range): void {
        let isLiElement: boolean = false;
        if (((e as NotifyArgs).args as KeyboardEventArgs).code === 'Backspace' && ((e as NotifyArgs).args as KeyboardEventArgs).keyCode === 8 && currentRange.startOffset === 0 &&
            currentRange.endOffset === 0 && this.parent.getSelection().length === 0 && currentRange.startContainer.textContent.length > 0 &&
            currentRange.startContainer.parentElement.tagName !== 'TD' && currentRange.startContainer.parentElement.tagName !== 'TH') {
            const checkNode: Node = currentRange.startContainer.nodeName === '#text' ? currentRange.startContainer.parentElement : currentRange.startContainer;
            if (!this.parent.formatter.editorManager.domNode.isBlockNode(checkNode as Element) &&
                !isNOU(checkNode.previousSibling) && checkNode.previousSibling.nodeName === 'BR') {
                return;
            }
            this.rangeElement = (this.getRootBlockNode(currentRange.startContainer) as HTMLElement);
            if (this.rangeElement.tagName === 'OL' || this.rangeElement.tagName === 'UL') {
                const liElement: HTMLElement = (this.getRangeLiNode(currentRange.startContainer) as HTMLElement);
                if (liElement.previousElementSibling && liElement.previousElementSibling.childElementCount > 0) {
                    this.oldRangeElement = liElement.previousElementSibling.lastElementChild.nodeName === 'BR' ?
                        liElement.previousElementSibling : liElement.previousElementSibling.lastElementChild;
                    if (!isNullOrUndefined(liElement.lastElementChild) && liElement.lastElementChild.nodeName !== 'BR') {
                        this.rangeElement = liElement.lastElementChild;
                        isLiElement = true;
                    } else {
                        this.rangeElement = liElement;
                    }
                }
            } else if (this.rangeElement === this.parent.inputElement || this.rangeElement.tagName === 'TABLE' ||
              (!isNullOrUndefined(this.rangeElement.previousElementSibling) && this.rangeElement.previousElementSibling.tagName === 'TABLE')) {
                return;
            } else {
                this.oldRangeElement = (this.rangeElement.previousElementSibling as HTMLElement);
            }
            if (isNullOrUndefined(this.oldRangeElement)) {
                return;
            } else {
                if (this.oldRangeElement.tagName === 'OL' || this.oldRangeElement.tagName === 'UL') {
                    this.oldRangeElement = this.oldRangeElement.lastElementChild.lastElementChild
                        ? this.oldRangeElement.lastElementChild.lastElementChild :
                        this.oldRangeElement.lastElementChild;
                }
                let lastNode: Node = this.oldRangeElement.lastChild;
                while (lastNode.nodeType !== 3 && lastNode.nodeName !== '#text' &&
                    lastNode.nodeName !== 'BR') {
                    lastNode = lastNode.lastChild;
                }
                this.parent.formatter.editorManager.nodeSelection.setCursorPoint(this.parent.contentModule.getDocument(),
                    // eslint-disable-next-line
                    lastNode as Element, lastNode.textContent.length);
                if (this.oldRangeElement.querySelectorAll('BR').length === 1) {
                    detach(this.oldRangeElement.querySelector('BR'));
                }
                if (!isNullOrUndefined(this.rangeElement) && this.oldRangeElement !== this.rangeElement) {
                    while (this.rangeElement.firstChild) {
                        this.oldRangeElement.appendChild(this.rangeElement.childNodes[0]);
                    }
                    // eslint-disable-next-line
                    !isLiElement ? detach(this.rangeElement) : detach(this.rangeElement.parentElement);
                    this.oldRangeElement.normalize();
                }
            }
        }
    }
    private deleteCleanup(e: NotifyArgs, currentRange: Range): void {
        let isLiElement: boolean = false;
        let liElement: HTMLElement;
        let rootElement: HTMLElement;
        if (((e as NotifyArgs).args as KeyboardEventArgs).code === 'Delete' && ((e as NotifyArgs).args as KeyboardEventArgs).keyCode === 46 &&
            this.parent.contentModule.getText().trim().length !== 0 && this.parent.getSelection().length === 0 && currentRange.startContainer.parentElement.tagName !== 'TD' &&
            currentRange.startContainer.parentElement.tagName !== 'TH') {
            this.deleteRangeElement = rootElement = (this.getRootBlockNode(currentRange.startContainer) as HTMLElement);
            if (this.deleteRangeElement.tagName === 'OL' || this.deleteRangeElement.tagName === 'UL') {
                liElement = (this.getRangeLiNode(currentRange.startContainer) as HTMLElement);
                if (liElement.nextElementSibling && liElement.nextElementSibling.childElementCount > 0
                    && !liElement.nextElementSibling.querySelector('BR')) {
                    if (!isNullOrUndefined(liElement.lastElementChild)) {
                        this.deleteRangeElement = liElement.lastElementChild;
                        isLiElement = true;
                    }
                    else {
                        this.deleteRangeElement = liElement;
                    }
                } else {
                    this.deleteRangeElement = this.getRangeElement(liElement);
                }
            }
            else if (this.deleteRangeElement.nodeType === 3 || (this.deleteRangeElement.tagName === 'TABLE' ||
            (!isNullOrUndefined(this.deleteRangeElement.nextElementSibling) && this.deleteRangeElement.nextElementSibling.tagName === 'TABLE'))) {
                return;
            }
            if (this.getCaretIndex(currentRange, this.deleteRangeElement) === this.deleteRangeElement.textContent.length) {
                if (!isNullOrUndefined(liElement)) {
                    if (isLiElement || !isNullOrUndefined(liElement.nextElementSibling)) {
                        this.deleteOldRangeElement = this.getRangeElement(liElement.nextElementSibling);
                    } else {
                        this.deleteOldRangeElement = rootElement.nextElementSibling;
                    }
                } else {
                    this.deleteOldRangeElement = this.deleteRangeElement.nextElementSibling;
                }
                if (isNullOrUndefined(this.deleteOldRangeElement)) {
                    return;
                }
                else {
                    if (currentRange.startOffset === 0 && currentRange.endOffset === 1 &&
                        this.deleteRangeElement.childNodes[0].nodeName === 'IMG') {
                        this.parent.formatter.editorManager.nodeSelection.setSelectionText(
                            this.parent.contentModule.getDocument(), this.deleteRangeElement, this.deleteRangeElement, 0, 1);
                        this.isImageDelete = true;
                    } else {
                        this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                            this.parent.contentModule.getDocument(), this.deleteRangeElement, this.deleteRangeElement.childNodes.length);
                        this.isImageDelete = false;
                    }
                    if (this.deleteRangeElement.querySelector('BR')) {
                        detach(this.deleteRangeElement.querySelector('BR'));
                    }
                    if (!isNullOrUndefined(this.deleteRangeElement) && (this.deleteOldRangeElement.tagName !== 'OL' && this.deleteOldRangeElement.tagName !== 'UL')
                        && this.deleteOldRangeElement !== this.deleteRangeElement) {
                        while (this.deleteOldRangeElement.firstChild) {
                            this.deleteRangeElement.appendChild(this.deleteOldRangeElement.childNodes[0]);
                        }
                        if (!isLiElement) {
                            detach(this.deleteOldRangeElement);
                        } else {
                            detach(this.deleteOldRangeElement.parentElement);
                        }
                        this.deleteRangeElement.normalize();
                    } else {
                        this.deleteRangeElement = null;
                        this.deleteOldRangeElement = null;
                    }
                }
            } else {
                this.deleteRangeElement = null;
            }
        }
    }
    private getCaretIndex(currentRange: Range, element: Element): number {
        let position: number = 0;
        if (this.parent.contentModule.getDocument().getSelection().rangeCount !== 0) {
            const preCaretRange: Range = currentRange.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(currentRange.endContainer, currentRange.endOffset);
            position = preCaretRange.toString().length;
        }
        return position;
    }
    private getRangeElement(element: Element): Element {
        const rangeElement: Element = element.lastElementChild ? element.lastElementChild.tagName === 'BR' ?
            element.lastElementChild.previousElementSibling ? element.lastElementChild.previousElementSibling
                : element : element.lastElementChild : element;
        return rangeElement;
    }
    private getRootBlockNode(rangeBlockNode: Node): Node {
        // eslint-disable-next-line
        for (; rangeBlockNode && this.parent && this.parent.inputElement !== rangeBlockNode; rangeBlockNode = rangeBlockNode) {
            if (rangeBlockNode.parentElement === this.parent.inputElement) {
                break;
            } else {
                rangeBlockNode = rangeBlockNode.parentElement;
            }
        }
        return rangeBlockNode;
    }
    private getRangeLiNode(rangeLiNode: Node): Node {
        let node: HTMLElement = rangeLiNode.parentElement;
        while (node !== this.parent.inputElement) {
            if (node.nodeType === 1 && node.tagName === 'LI') {
                break;
            }
            node = node.parentElement;
        }
        return node;
    }
    private onPaste(e: NotifyArgs): void {
        // eslint-disable-next-line
        const regex: RegExp = new RegExp(/([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi);
        if (e.text.match(regex)) {
            if (e.isWordPaste) {
                return;
            }
            (e.args as KeyboardEvent).preventDefault();
            const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            // eslint-disable-next-line
            const saveSelection: NodeSelection = this.parent.formatter.editorManager.nodeSelection.save(
                range, this.parent.contentModule.getDocument());
            // eslint-disable-next-line
            const httpRegex: RegExp = new RegExp(/([^\S]|^)(((https?\:\/\/)))/gi);
            const wwwRegex: RegExp = new RegExp(/([^\S]|^)(((www\.))(\S+))/gi);
            const enterSplitText: string[] = e.text.split('\n');
            let contentInnerElem: string = '';
            for (let i: number = 0; i < enterSplitText.length; i++) {
                if (enterSplitText[i as number].trim() === '') {
                    contentInnerElem += getDefaultValue(this.parent);
                } else {
                    let contentWithSpace: string = '';
                    let spaceBetweenContent: boolean = true;
                    const spaceSplit: string[] = enterSplitText[i as number].split(' ');
                    for (let j: number = 0; j < spaceSplit.length; j++) {
                        if (spaceSplit[j as number].trim() === '') {
                            contentWithSpace += spaceBetweenContent ? '&nbsp;' : ' ';
                        } else {
                            spaceBetweenContent = false;
                            contentWithSpace += spaceSplit[j as number] + ' ';
                        }
                    }
                    if (i === 0) {
                        contentInnerElem += '<span>' + contentWithSpace.trim() + '</span>';
                    } else {
                        contentInnerElem += '<p>' + contentWithSpace.trim() + '</p>';
                    }
                }
            }
            const divElement: HTMLElement = this.parent.createElement('div');
            divElement.setAttribute('class', 'pasteContent');
            divElement.style.display = 'inline';
            divElement.innerHTML = contentInnerElem.replace('&para', '&amp;para');
            const paraElem: NodeListOf<HTMLParagraphElement> = divElement.querySelectorAll('span, p');
            for (let i: number = 0; i < paraElem.length ; i++) {
                const splitTextContent: string[] = paraElem[i as number].innerHTML.split(' ');
                let resultSplitContent: string = '';
                for (let j: number = 0 ; j < splitTextContent.length; j++) {
                    if (splitTextContent[j as number].match(httpRegex) || splitTextContent[j as number].match(wwwRegex)) {
                        resultSplitContent += '<a className="e-rte-anchor" href="' + splitTextContent[j as number] +
                        '" title="' + splitTextContent[j as number] + '"target="_blank">' + splitTextContent[j as number] + ' </a>';
                    } else {
                        resultSplitContent += splitTextContent[j as number] + ' ';
                    }
                }
                paraElem[i as number].innerHTML = resultSplitContent.trim();
            }
            if (!isNullOrUndefined(this.parent.pasteCleanupModule)) {
                e.callBack(divElement.innerHTML);
            } else {
                this.parent.formatter.editorManager.execCommand('insertHTML', null, null, null, divElement);
            }
        }
    }
    private spaceLink(e?: KeyboardEvent): void {
        const range: Range = this.nodeSelectionObj.getRange(this.contentRenderer.getDocument());
        const selectNodeEle: Node[] = this.nodeSelectionObj.getParentNodeCollection(range);
        const text: string = range.startContainer.textContent.substr(0, range.endOffset);
        const splitText: string[] = text.split(' ');
        let urlText: string = splitText[splitText.length - 1];
        const urlTextRange: number = range.startOffset - (text.length - splitText[splitText.length - 1].length);
        urlText = urlText.slice(0, urlTextRange);
        // eslint-disable-next-line
        const regex: RegExp = new RegExp(/([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi);
        if (selectNodeEle[0].nodeName !== 'A' && urlText.match(regex)) {
            const selection: NodeSelection = this.nodeSelectionObj.save(
                range, this.parent.contentModule.getDocument());
            const url: string = urlText.indexOf('http') > -1 ? urlText : 'http://' + urlText;
            const selectParent: Node[] = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            const value: NotifyArgs = {
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
        const item: IToolbarItemModel = args.item as IToolbarItemModel;
        const closestElement: Element = closest(args.originalEvent.target as Element, '.e-rte-quick-popup');
        if (item.command !== 'FormatPainter') {
            if (closestElement && !closestElement.classList.contains('e-rte-inline-popup')) {
                if (!(item.subCommand === 'SourceCode' || item.subCommand === 'Preview' ||
                    item.subCommand === 'FontColor' || item.subCommand === 'BackgroundColor')) {
                    if (isIDevice() && item.command === 'Images') {
                        this.nodeSelectionObj.restore();
                    }
                    const range: Range = this.nodeSelectionObj.getRange(this.parent.contentModule.getDocument());
                    save = this.nodeSelectionObj.save(range, this.parent.contentModule.getDocument());
                    selectNodeEle = this.nodeSelectionObj.getNodeCollection(range);
                    selectParentEle = this.nodeSelectionObj.getParentNodeCollection(range);
                }
                if (item.command === 'Images') {
                    this.parent.notify(events.imageToolbarAction, {
                        member: 'image', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                    });
                }
                if (item.command === 'Audios') {
                    this.parent.notify(events.audioToolbarAction, {
                        member: 'audio', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                    });
                }
                if (item.command === 'Videos') {
                    this.parent.notify(events.videoToolbarAction, {
                        member: 'video', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
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
                const linkDialog: Element = document.getElementById(this.parent.getID() + '_rtelink');
                const imageDialog: Element = document.getElementById(this.parent.getID() + '_image');
                if (!(item.subCommand === 'SourceCode' || item.subCommand === 'Preview' ||
                    item.subCommand === 'FontColor' || item.subCommand === 'BackgroundColor')) {
                    const range: Range = this.nodeSelectionObj.getRange(this.parent.contentModule.getDocument());
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
                case 'RemoveLink':
                    this.parent.notify(events.unLink, {
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
                case 'Audio':
                    this.parent.notify(events.insertAudio, {
                        member: 'audio', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                    });
                    break;
                case 'Video':
                    this.parent.notify(events.insertVideo, {
                        member: 'video', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
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
                case 'File':
                    this.parent.notify(events.renderFileManager, {
                        member: 'fileManager', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                    });
                    break;
                default:
                    this.parent.formatter.process(this.parent, args, args.originalEvent, null);
                    break;
                }
            }
        } else{
            if ((args.originalEvent as MouseEventArgs).detail === 1 ) {
                clearTimeout(this.clickTimeout);
                this.clickTimeout = setTimeout(() => {
                    this.parent.notify( events.formatPainterClick, {
                        member: 'formatPainter', args: args
                    });
                }, 200);
            } else {
                clearTimeout(this.clickTimeout);
                this.parent.notify( events.formatPainterDoubleClick, {
                    member: 'formatPainter', args: args
                });
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
        if (this.parent.isDestroyed) {
            return;
        }
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
        this.parent.off(events.tableclass, this.isTableClassAdded);
    }

    private render(): void {
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
        const editElement: HTMLTextAreaElement = this.contentRenderer.getEditPanel() as HTMLTextAreaElement;
        const option: { [key: string]: number } = { undoRedoSteps: this.parent.undoRedoSteps, undoRedoTimer: this.parent.undoRedoTimer };
        if (isNullOrUndefined(this.parent.formatter)) {
            const formatterClass: HTMLFormatter = new HTMLFormatter({
                currentDocument: this.contentRenderer.getDocument(),
                element: editElement,
                options: option,
                formatPainterSettings: this.parent.formatPainterSettings
            });
            this.parent.setProperties({ formatter: formatterClass }, true);
        } else {
            this.parent.formatter.updateFormatter(editElement, this.contentRenderer.getDocument(), option);
        }
        if (this.parent.enableXhtml) {
            this.parent.notify(events.xhtmlValidation, {});
        }
        if (this.parent.toolbarSettings.enable) {
            this.toolbarUpdate = new HtmlToolbarStatus(this.parent);
        }
        if (this.parent.inlineMode.enable) {
            if (!isNullOrUndefined(this.parent.fontFamily.default)) {
                editElement.style.fontFamily = this.parent.fontFamily.default;
            }
            if (!isNullOrUndefined(this.parent.fontSize.default)) {
                editElement.style.fontSize = this.parent.fontSize.default;
            }
        }
        this.parent.notify(events.bindOnEnd, {});
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param {RichTextEditorModel} e - specifies the editor model
     * @returns {void}
     * @hidden
     * @deprecated
     */
    protected onPropertyChanged(e: { [key: string]: RichTextEditorModel }): void {
        // On property code change here
        if (!isNullOrUndefined(e.newProp.formatter)) {
            const editElement: HTMLTextAreaElement = this.contentRenderer.getEditPanel() as HTMLTextAreaElement;
            const option: { [key: string]: number } = { undoRedoSteps: this.parent.undoRedoSteps,
                undoRedoTimer: this.parent.undoRedoTimer };
            this.parent.formatter.updateFormatter(editElement, this.contentRenderer.getDocument(), option);
        }
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} - returns the string value
     * @hidden
     */
    private getModuleName(): string {
        return 'htmlEditor';
    }

    /**
     * For selecting all content in RTE
     *
     * @returns {void}
     * @private
     * @hidden
     */
    private selectAll(): void {
        const nodes: Node[] = getTextNodesUnder(
            this.parent.contentModule.getDocument(),
            (this.parent.contentModule.getEditPanel() as HTMLElement));
        if (nodes.length > 0) {
            this.parent.formatter.editorManager.nodeSelection.setSelectionText(
                this.parent.contentModule.getDocument(),
                nodes[0],
                nodes[nodes.length - 1],
                0,
                nodes[nodes.length - 1].textContent.length);
        }
    }

    /**
     * For selecting all content in RTE
     *
     * @param {NotifyArgs} e - specifies the notified arguments
     * @returns {void}
     * @private
     * @hidden
     */
    private selectRange(e: NotifyArgs): void {
        this.parent.formatter.editorManager.nodeSelection.setRange(
            this.parent.contentModule.getDocument(),
            e.range);
    }

    /**
     * For get a selected text in RTE
     *
     * @param {NotifyArgs} e - specifies the notified arguments
     * @returns {void}
     * @hidden
     */
    private getSelectedHtml(e: NotifyArgs): void {
        e.callBack(this.parent.formatter.editorManager.nodeSelection.getRange(
            this.parent.contentModule.getDocument()
        ).toString());
    }
}
