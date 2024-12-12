import { addClass, attributes, Browser, closest, detach, isNullOrUndefined as isNOU, isNullOrUndefined, KeyboardEventArgs, L10n, MouseEventArgs, removeClass } from '@syncfusion/ej2-base';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { isIDevice, removeClassWithAttr, scrollToCursor } from '../../common/util';
import { EditorManager } from '../../editor-manager';
import { IHtmlKeyboardEvent } from '../../editor-manager/base/interface';
import { InsertHtml } from '../../editor-manager/plugin/inserthtml';
import { NodeSelection } from '../../selection/selection';
import { Toolbar } from '../actions/toolbar';
import * as classes from '../base/classes';
import * as CONSTANT from '../base/constant';
import * as events from '../base/constant';
import { RenderType } from '../base/enum';
import { ActionBeginEventArgs, IDropDownItemModel, IRenderer, IRichTextEditor, IToolbarItemModel, IToolbarOptions, NotifyArgs } from '../base/interface';
import { RichTextEditorModel } from '../base/rich-text-editor-model';
import { getDefaultValue, getTextNodesUnder, sanitizeHelper } from '../base/util';
import { HTMLFormatter } from '../formatter/html-formatter';
import { FontSizeModel } from '../models/models';
import { ContentRender } from '../renderer/content-renderer';
import { IframeContentRender } from '../renderer/iframe-content-renderer';
import { RendererFactory } from '../services/renderer-factory';
import { ServiceLocator } from '../services/service-locator';
import { ON_BEGIN } from './../../common/constant';
import { HtmlToolbarStatus } from './html-toolbar-status';
import { XhtmlValidation } from './xhtml-validation';

/**
 * `HtmlEditor` module is used to HTML editor
 */
export class HtmlEditor {
    private isDestroyed: boolean;
    private parent: IRichTextEditor;
    private locator: ServiceLocator;
    private contentRenderer: IRenderer;
    private renderFactory: RendererFactory;
    private toolbarUpdate: HtmlToolbarStatus;
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
    private isCopyAll: boolean;

    public constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.locator = serviceLocator;
        this.renderFactory = this.locator.getService<RendererFactory>('rendererFactory');
        this.xhtmlValidation = new XhtmlValidation(parent);
        this.addEventListener();
        this.isDestroyed = false;
        this.isCopyAll = false;
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
        if (this.isDestroyed) { return; }
        if (this.clickTimeout) {
            clearTimeout(this.clickTimeout);
            this.clickTimeout = null;
        }
        this.removeEventListener();
        this.locator = null;
        this.contentRenderer = null;
        this.renderFactory = null;
        this.toolbarUpdate = null;
        this.nodeSelectionObj = null;
        this.isCopyAll = null;
        if (this.rangeCollection.length > 0) {
            this.rangeCollection = [];
        }
        if (this.rangeElement) { this.rangeElement = null; }
        if (this.oldRangeElement) { this.oldRangeElement = null; }
        if (this.deleteRangeElement) { this.deleteRangeElement = null; }
        if (this.deleteOldRangeElement) { this.deleteOldRangeElement = null; }
        if (this.saveSelection) { this.saveSelection = null; }
        if (this.xhtmlValidation) { this.xhtmlValidation = null; }
        this.isDestroyed = true;
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
        this.nodeSelectionObj = new NodeSelection(this.parent.inputElement);
        this.parent.on(events.initialLoad, this.instantiateRenderer, this);
        this.parent.on(events.htmlToolbarClick, this.onToolbarClick, this);
        this.parent.on(events.keyDown, this.onKeyDown, this);
        this.parent.on(events.keyUp, this.onKeyUp, this);
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
        this.parent.on(events.onHandleFontsizeChange, this.onHandleFontsizeChange, this);
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
        (this.contentRenderer.getEditPanel() as HTMLElement).focus({preventScroll: true});
        if (isNullOrUndefined(e.items) || e.items) {
            this.saveSelection.restore();
        }
    }

    private isTableClassAdded(): void  {
        const tableElement : NodeListOf<HTMLElement> = this.parent.inputElement.querySelectorAll('table');
        for (let i: number = 0; i < tableElement.length; i++) {
            // e-rte-table class is added to the table element for styling.
            // e-rte-paste-table class is added for pasted table element from MS Word and other sources such as Web will not have any styles.
            // e-rte-custom-table class is added for custom table element will not have any styles.
            if (!tableElement[i as number].classList.contains('e-rte-table') && !tableElement[i as number].classList.contains('e-rte-paste-table')
                && !tableElement[i as number].classList.contains('e-rte-custom-table')){
                tableElement[i as number].classList.add('e-rte-table');
            }
        }
    }

    private onHandleFontsizeChange(e: NotifyArgs): void {
        const keyboardArgs: KeyboardEventArgs = e.args as KeyboardEventArgs;
        const args: ActionBeginEventArgs = { name: 'dropDownSelect' };
        args.item = {
            command: 'Font',
            subCommand: 'FontSize'
        } as IDropDownItemModel;
        const items: IDropDownItemModel[] = (this.parent.fontSize as FontSizeModel).items;
        let activeElem: string;
        if (this.parent.toolbarModule && (this.parent.toolbarModule as Toolbar).dropDownModule &&
            (this.parent.toolbarModule as Toolbar).dropDownModule.fontSizeDropDown && !isNOU((this.parent.toolbarModule as Toolbar).dropDownModule.fontSizeDropDown.activeElem[0].textContent) && (this.parent.toolbarModule as Toolbar).dropDownModule.fontSizeDropDown.activeElem[0].textContent !== '') {
            activeElem = this.parent.toolbarModule.dropDownModule.fontSizeDropDown.activeElem[0].textContent;
        } else {
            let fontSizeValue: string;
            const selection: Selection = this.parent.contentModule.getDocument().getSelection();
            if (selection && selection.focusNode && selection.focusNode.parentElement) {
                fontSizeValue = document.defaultView.getComputedStyle(selection.focusNode.parentElement, null).getPropertyValue('font-size');
            } else {
                fontSizeValue = (this.parent.fontSize as FontSizeModel).width;
            }
            fontSizeValue = isNOU(fontSizeValue) ? (this.parent.fontSize as FontSizeModel).width : fontSizeValue;
            const actualTxtFontValues: RegExpMatchArray = fontSizeValue.match(/^([\d.]+)(\D+)$/);
            const size: number = parseInt(actualTxtFontValues[1], 10);
            const unit: string = actualTxtFontValues[2];
            const defaultFontValues: RegExpMatchArray = items[1].value.match(/^([\d.]+)(\D+)$/);
            if (defaultFontValues[2] === unit) {
                const index: number = items.findIndex(({ value }: { value: string }) => parseInt(value, 10) >= size);
                activeElem = items[index as number].text;
            } else {
                const convertedSize: number = this.convertFontSize(size, unit, defaultFontValues[2]);
                const index: number = items.findIndex(({ value }: { value: string }) => parseInt(value, 10) >= convertedSize);
                activeElem = items[index as number].text;
            }
        }
        const fontIndex: number = items.findIndex((size: IDropDownItemModel) => size.text === (activeElem === 'Font Size' ? 'Default' : activeElem));
        if (keyboardArgs.action === 'increase-fontsize' && fontIndex !== -1) {
            if (fontIndex >= items.length - 1) {
                const fontValues: RegExpMatchArray = items[fontIndex as number].value.match(/^([\d.]+)(\D+)$/);
                if (fontValues) {
                    const size: number = parseInt(fontValues[1], 10);
                    const unit: string = fontValues[2];
                    const roundedSize: number = size % 10 === 0 ? Math.ceil((size + 1) / 10) * 10 : Math.ceil(size / 10) * 10;
                    (args.item as IDropDownItemModel).value = roundedSize.toLocaleString() + unit;
                    (args.item as IDropDownItemModel).text = roundedSize.toLocaleString() + ' ' + unit;
                }
                this.parent.fontSize.items.push(args.item);
            } else {
                (args.item as IDropDownItemModel).value = items[fontIndex + 1].value;
                (args.item as IDropDownItemModel).text = items[fontIndex + 1].text;
            }
        } else if (keyboardArgs.action === 'decrease-fontsize' && fontIndex !== -1 && fontIndex > 0) {
            (args.item as IDropDownItemModel).value = items[fontIndex - 1].value;
            (args.item as IDropDownItemModel).text = items[fontIndex - 1].text;
        }
        else {
            if (fontIndex >= 0 && fontIndex < items.length && items[fontIndex as number]) {
                (args.item as IDropDownItemModel).value = items[fontIndex as number].value;
                (args.item as IDropDownItemModel).text = items[fontIndex as number].text;
            }
        }
        this.parent.formatter.process(this.parent, args, keyboardArgs);
    }

    private convertFontSize(value: number, originalUnit: string, targetUnit: string): number {
        if (CONSTANT.supportedUnits.indexOf(originalUnit) !== -1 || CONSTANT.supportedUnits.indexOf(targetUnit) !== -1) {
            originalUnit = 'px';
        }
        const convertedValue: number = value * CONSTANT.conversionFactors[originalUnit as string][targetUnit as string];
        return convertedValue;
    }

    private onKeyUp(e: NotifyArgs): void {
        const args: KeyboardEvent = e.args as KeyboardEvent;
        const restrictKeys: number[] = [8, 9, 13, 17, 18, 20, 27, 37, 38, 39, 40, 44, 45, 46, 91,
            112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123];
        const range: Range = this.parent.getRange();
        const regEx: RegExp = new RegExp('\u200B', 'g');
        const isEmptyNode: boolean = range.startContainer === range.endContainer && range.startOffset === range.endOffset &&
            range.startOffset === 1 && range.startContainer.textContent.length === 1 &&
            range.startContainer.textContent.charCodeAt(0) === 8203 &&
            range.startContainer.textContent.replace(regEx, '').length === 0;
        let isMention: boolean = false;
        if (range.startContainer === range.endContainer &&
            range.startOffset === range.endOffset && (range.startContainer !== this.parent.inputElement && range.startOffset !== 0)) {
            const mentionStartNode: Node = range.startContainer.nodeType === 3 ?
                range.startContainer : range.startContainer.childNodes[range.startOffset - 1];
            isMention = args.keyCode === 16 &&
                mentionStartNode.textContent.charCodeAt(0) === 8203 &&
                !isNOU(mentionStartNode.previousSibling) && (mentionStartNode.previousSibling as HTMLElement).contentEditable === 'false';
        }
        if (this.isCopyAll) {
            return;
        }
        let pointer: number;
        let isRootParent: boolean = false;
        if (restrictKeys.indexOf(args.keyCode) < 0 && !args.shiftKey && !args.ctrlKey && !args.altKey && !isEmptyNode && !isMention) {
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
                if (focusNode.textContent.trim().length !== 0 && focusNode.previousSibling) {
                    const tempSpan: HTMLElement = document.createElement('span');
                    tempSpan.className = 'tempSpan';
                    range.insertNode(tempSpan);
                }
                let currentChild: Element = this.parent.inputElement.firstChild as Element;
                while (!isNOU(currentChild)) {
                    if (currentChild.nodeName === '#text') {
                        currentChild = currentChild.nextElementSibling;
                        continue;
                    }
                    if (currentChild.textContent.replace(regEx, '').trim().length > 0 && currentChild.textContent.includes('\u200B')) {
                        currentChild.innerHTML = currentChild.innerHTML.replace(regEx, '');
                    }
                    currentChild = currentChild.nextElementSibling;
                }
                let tempSpanToRemove: Element = this.parent.inputElement.querySelector('.tempSpan');
                if (tempSpanToRemove && tempSpanToRemove.previousSibling && focusNode.textContent.trim().length !== 0) {
                    focusNode = tempSpanToRemove.previousSibling as Element;
                    pointer = tempSpanToRemove.previousSibling.textContent.length;
                    const parentElement: HTMLElement | null = tempSpanToRemove.parentNode as HTMLElement | null;
                    parentElement.removeChild(tempSpanToRemove);
                    tempSpanToRemove = null;
                }
                const currentChildNode : NodeListOf<ChildNode> = this.parent.inputElement.querySelector('.currentStartMark').childNodes;
                if (currentChildNode.length > 1) {
                    for (let i: number = 0; i < currentChildNode.length; i++) {
                        if (currentChildNode[i as number].nodeName === '#text' && currentChildNode[i as number].textContent.length === 0) {
                            detach(currentChildNode[i as number]);
                            i--;
                        }
                        if (!isNOU(currentChildNode[i as number]) && focusNode.textContent.replace(regEx, '') === currentChildNode[i as number].textContent) {
                            const iscursorLeft: boolean = pointer <= focusNode.textContent.indexOf('\u200B');
                            pointer = focusNode.textContent.length > 1 ?
                                ((focusNode.textContent === currentChildNode[i as number].textContent || iscursorLeft) ? pointer :
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
        if ((e.args as KeyboardEventArgs).ctrlKey && (e.args as KeyboardEventArgs).keyCode === 65) {
            this.isCopyAll = true;
        }
        else {
            this.isCopyAll = false;
        }
        let currentRange: Range;
        const args: KeyboardEvent = e.args as KeyboardEvent;
        if (this.parent.inputElement.querySelectorAll('.e-cell-select').length > 1 && (args.keyCode === 8 || args.keyCode === 32 || args.keyCode === 13)) {
            this.tableSelectionKeyAction(e);
            this.parent.autoResize();
            return;
        }
        if (Browser.info.name === 'chrome') {
            currentRange = this.parent.getRange();
            this.backSpaceCleanup(e, currentRange);
            this.deleteCleanup(e, currentRange);
        }
        if (args.keyCode === 9 && this.parent.enableTabKey) {
            this.parent.formatter.saveData(e);
            if (!isNOU(args.target) && isNullOrUndefined(closest(args.target as Element, '.e-rte-toolbar'))) {
                const range: Range = this.nodeSelectionObj.getRange(this.contentRenderer.getDocument());
                const parentNode: Node[] = this.nodeSelectionObj.getParentNodeCollection(range);
                if (!((parentNode[0].nodeName === 'LI' || closest(parentNode[0] as HTMLElement, 'li') ||
                    closest(parentNode[0] as HTMLElement, 'table')))) {
                    args.preventDefault();
                    const selection: Range = this.contentRenderer.getDocument().getSelection().getRangeAt(0);
                    let alignmentNodes: Node[] = this.parent.formatter.editorManager.domNode.blockNodes();
                    if (this.parent.enterKey === 'BR') {
                        if (selection.startOffset !== selection.endOffset && selection.startOffset === 0) {
                            let save: NodeSelection = this.nodeSelectionObj.save(range, this.contentRenderer.getDocument());
                            this.parent.formatter.editorManager.domNode.setMarker(save);
                            alignmentNodes = this.parent.formatter.editorManager.domNode.blockNodes();
                            (this.parent.formatter.editorManager as EditorManager).domNode.convertToBlockNodes(alignmentNodes, false);
                            this.marginTabAdd(args.shiftKey, alignmentNodes);
                            save = (this.parent.formatter.editorManager as EditorManager).domNode.saveMarker(save);
                            save.restore();
                        }
                        else {
                            InsertHtml.Insert(this.contentRenderer.getDocument(), '&nbsp;&nbsp;&nbsp;&nbsp;');
                            this.rangeCollection.push(this.nodeSelectionObj.getRange(this.contentRenderer.getDocument()));
                        }
                    } else {
                        if (!args.shiftKey) {
                            if (selection.startOffset !== selection.endOffset && selection.startOffset === 0) {
                                this.marginTabAdd(args.shiftKey, alignmentNodes);
                            }
                            else {
                                InsertHtml.Insert(this.contentRenderer.getDocument(), '&nbsp;&nbsp;&nbsp;&nbsp;');
                                this.rangeCollection.push(this.nodeSelectionObj.getRange(this.contentRenderer.getDocument()));
                            }
                        } else if (this.rangeCollection.length > 0 &&
                            this.rangeCollection[this.rangeCollection.length - 1].startContainer.textContent.length === 4) {
                            const textCont: Node = this.rangeCollection[this.rangeCollection.length - 1].startContainer;
                            this.nodeSelectionObj.setSelectionText(
                                this.contentRenderer.getDocument(), textCont, textCont, 0, textCont.textContent.length);
                            InsertHtml.Insert(this.contentRenderer.getDocument(), document.createTextNode(''));
                            this.rangeCollection.pop();
                        } else {
                            this.marginTabAdd(args.shiftKey, alignmentNodes);
                        }
                    }
                }
            }
            this.parent.formatter.saveData(e);
        }
        // Prevents the link from being added when a space, enter, or parenthesis key is pressed.
        // This ensures that parentheses are not mistakenly included as part of the URL.
        const regex: RegExp = /[^\w\s\\/\\.\\:]/g;
        if (((e as NotifyArgs).args as KeyboardEventArgs).action === 'space' || ((e as NotifyArgs).args as KeyboardEventArgs).action === 'enter' || ((e as NotifyArgs).args as KeyboardEventArgs).keyCode === 13 || regex.test(((e as NotifyArgs).args as KeyboardEventArgs).key)) {
            this.spaceLink(e.args as KeyboardEvent);
            if (this.parent.editorMode === 'HTML' && !this.parent.readonly) {
                const currentLength: number = this.parent.getText().trim().replace(/(\r\n|\n|\r|\t)/gm, '').replace(/\u200B/g, '').length;
                const selectionLength: number = this.parent.getSelection().length;
                const totalLength: number = (currentLength - selectionLength) + 1;
                if (!(this.parent.maxLength === -1 || totalLength <= this.parent.maxLength) &&
                ((e as NotifyArgs).args as KeyboardEventArgs).keyCode === 13) {
                    (e.args as KeyboardEvent).preventDefault();
                    return;
                } else {
                    this.parent.notify(events.enterHandler, { args: e.args });
                    scrollToCursor(this.parent.contentModule.getDocument(), this.parent.inputElement);
                }
            }
        }
        if (((e as NotifyArgs).args as KeyboardEventArgs).action === 'space') {
            const currentRange: Range = this.parent.getRange();
            const editorValue: string = currentRange.startContainer.textContent.slice(0, currentRange.startOffset);
            const orderedList: boolean = this.isOrderedList(editorValue);
            const unOrderedList: boolean =  this.isUnOrderedList(editorValue);
            let hasSplitedText: boolean = false;
            if (orderedList || unOrderedList) {
                hasSplitedText = this.hasMultipleTextNode(currentRange);
            }
            if (!hasSplitedText && (orderedList && !unOrderedList || unOrderedList && !orderedList)) {
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
        this.parent.autoResize();
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
    private hasMultipleTextNode(range: Range): boolean {
        if (range && range.startContainer && range.startContainer.parentNode) {
            const parentNode: Node = range.startContainer.parentNode as Node;
            if ((range.startContainer as HTMLElement).previousElementSibling &&
                (range.startContainer as HTMLElement).previousElementSibling.classList.contains('e-mention-chip')
                && !((range.startContainer as HTMLElement).previousElementSibling as HTMLElement).isContentEditable) {
                return true;
            }
            if (this.parent.enterKey === 'BR' || closest(parentNode, 'table')) {
                return false;
            }
            const childNodes: NodeListOf<ChildNode> = parentNode.childNodes;
            const textNodes: ChildNode[] = [];
            for (let i: number = 0; i < childNodes.length; i++) {
                const node: ChildNode = childNodes[i as number];
                if (node && node.nodeType === Node.TEXT_NODE) {
                    textNodes.push(node);
                    if (textNodes.length > 1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    private backSpaceCleanup(e: NotifyArgs, currentRange: Range): void {
        let isLiElement: boolean = false;
        let isPreviousNotContentEditable: boolean = true;
        if (!isNOU(currentRange.startContainer.previousSibling) &&
        currentRange.startContainer.previousSibling.nodeName === 'SPAN') {
            isPreviousNotContentEditable = (currentRange.startContainer.previousSibling as HTMLElement).contentEditable === 'false' ? false : true;
        }
        const checkNode: Node = currentRange.startContainer.nodeName === '#text' ? currentRange.startContainer.parentElement : currentRange.startContainer;
        const isSelectedPositionNotStart: boolean = closest(currentRange.startContainer.nodeName === '#text' ? currentRange.startContainer.parentElement : currentRange.startContainer, 'li') ?
            checkNode.nodeName !== 'li' && isNOU(checkNode.previousSibling) : true;
        if (((e as NotifyArgs).args as KeyboardEventArgs).code === 'Backspace' && ((e as NotifyArgs).args as KeyboardEventArgs).keyCode === 8 && currentRange.startOffset === 0 &&
            currentRange.endOffset === 0 && this.parent.getSelection().length === 0 && currentRange.startContainer.textContent.length > 0 &&
            currentRange.startContainer.parentElement.tagName !== 'TD' && currentRange.startContainer.parentElement.tagName !== 'TH' &&
            isPreviousNotContentEditable && isSelectedPositionNotStart) {
            if ((!this.parent.formatter.editorManager.domNode.isBlockNode(checkNode as Element) &&
                !isNOU(checkNode.previousSibling) && checkNode.previousSibling.nodeName === 'BR') ||
                (!isNOU(currentRange.startContainer.previousSibling) && currentRange.startContainer.previousSibling.nodeName === 'BR')) {
                return;
            }
            this.rangeElement = (this.getRootBlockNode(currentRange.startContainer) as HTMLElement);
            if (this.rangeElement.tagName === 'OL' || this.rangeElement.tagName === 'UL') {
                const liElement: HTMLElement = (this.getRangeLiNode(currentRange.startContainer) as HTMLElement);
                if (liElement.previousElementSibling && liElement.previousElementSibling.childElementCount > 0) {
                    this.oldRangeElement = liElement.previousElementSibling.lastElementChild.nodeName === 'BR' ?
                        liElement.previousElementSibling : liElement.previousElementSibling.lastChild as HTMLElement;
                    if (!isNOU(liElement.lastElementChild) && liElement.lastElementChild.nodeName !== 'BR' &&
                    isNOU(liElement.lastElementChild.previousSibling) && liElement.lastChild.nodeName !== '#text') {
                        this.rangeElement = liElement.lastElementChild;
                        isLiElement = true;
                    } else {
                        this.rangeElement = liElement;
                    }
                }
            } else if (this.rangeElement === this.parent.inputElement || this.rangeElement.tagName === 'TABLE' ||
              (!isNOU(this.rangeElement.previousElementSibling) && this.rangeElement.previousElementSibling.tagName === 'TABLE')) {
                return;
            } else {
                this.oldRangeElement = (this.rangeElement.previousElementSibling as HTMLElement);
            }
            const findBlockElement: Node[] = this.parent.formatter.editorManager.domNode.blockNodes();
            if (!isNOU(findBlockElement[0]) && currentRange.collapsed && currentRange.startOffset === 0 && currentRange.endOffset === 0 && (findBlockElement[0] as HTMLElement).style.marginLeft !== '') {
                (findBlockElement[0] as HTMLElement).style.marginLeft = (parseInt((findBlockElement[0] as HTMLElement).style.marginLeft, 10) <= 20) ? '' : (parseInt((findBlockElement[0] as HTMLElement).style.marginLeft, 10) - 20 + 'px');
            }
            if (isNOU(this.oldRangeElement)) {
                return;
            } else {
                if (this.oldRangeElement.tagName === 'OL' || this.oldRangeElement.tagName === 'UL') {
                    this.oldRangeElement = this.oldRangeElement.lastElementChild.lastElementChild
                        ? this.oldRangeElement.lastElementChild.lastElementChild :
                        this.oldRangeElement.lastElementChild;
                }
                let lastNode: Node = this.oldRangeElement.lastChild ? this.oldRangeElement.lastChild : this.oldRangeElement;
                while (lastNode.nodeType !== 3 && lastNode.nodeName !== '#text' &&
                    lastNode.nodeName !== 'BR' && !isNOU(lastNode.lastChild)) {
                    lastNode = lastNode.lastChild;
                }
                if (lastNode.nodeName === 'IMG') {
                    this.parent.formatter.editorManager.nodeSelection.setCursorPoint(this.parent.contentModule.getDocument(),
                                                                                     lastNode.parentElement as Element,
                                                                                     lastNode.parentElement.childNodes.length);
                }
                else {
                    this.parent.formatter.editorManager.nodeSelection.setCursorPoint(this.parent.contentModule.getDocument(),
                        // eslint-disable-next-line
                        lastNode as Element, lastNode.textContent.length);
                }
                let checkParent : boolean = false;
                if (this.oldRangeElement && this.oldRangeElement.nodeName !== '#text' && this.oldRangeElement.querySelectorAll('BR').length === 1) {
                    const brElement: HTMLElement = this.oldRangeElement.querySelector('BR');
                    if (brElement) {
                        const brParentElement: HTMLElement = brElement.parentNode as HTMLElement | null;
                        const currentState: string = this.oldRangeElement.innerHTML;
                        this.parent.formatter.saveData(currentState);
                        detach(brElement);
                        if (brParentElement && brParentElement.childNodes.length === 0) {
                            detach(brParentElement);
                            checkParent = true;
                        }
                    }
                }
                if (!isNOU(this.rangeElement) && this.oldRangeElement !== this.rangeElement && !checkParent) {
                    while (this.rangeElement.firstChild) {
                        if (this.oldRangeElement.nodeName === '#text') {
                            this.oldRangeElement.parentElement.appendChild(this.rangeElement.childNodes[0]);
                        }
                        else {
                            this.oldRangeElement.appendChild(this.rangeElement.childNodes[0]);
                        }
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
            this.parent.contentModule.getText().trim().replace(/(\r\n|\n|\r|\t)/gm, '').replace(/\u200B/g, '').length !== 0 && this.parent.getSelection().length === 0 && currentRange.startContainer.parentElement.tagName !== 'TD' &&
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
            let isImgWithEmptyBlockNode: boolean = false;
            if (this.deleteRangeElement.querySelectorAll('img').length > 0 && this.deleteRangeElement.textContent.trim() === '') {
                isImgWithEmptyBlockNode = true;
            }
            if (this.getCaretIndex(currentRange, this.deleteRangeElement) === this.deleteRangeElement.textContent.length &&
                !isImgWithEmptyBlockNode) {
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
                    const brNode: HTMLElement = this.deleteRangeElement.querySelector('BR');
                    const brLastChildNode: Node = this.deleteRangeElement.lastChild;
                    let brParentNode: Node;
                    if (brLastChildNode) {
                        brParentNode = brLastChildNode.parentNode;
                    }
                    if (brNode && brNode.classList.contains('e-rte-image-remove-focus')) {
                        removeClass([brNode], ['e-rte-image-focus']);
                        return;
                    } else if (brNode && brLastChildNode && brLastChildNode.nodeName === 'BR') {
                        detach(brLastChildNode);
                        if (!isNullOrUndefined(brParentNode) && brParentNode.childNodes.length === 0) {
                            detach(brParentNode);
                        }
                        (e.args as KeyboardEventArgs).preventDefault();
                    }
                    if (!isNullOrUndefined(this.deleteRangeElement) && (this.deleteOldRangeElement.tagName !== 'OL' && this.deleteOldRangeElement.tagName !== 'UL')
                        && this.deleteOldRangeElement !== this.deleteRangeElement
                        && this.parent.contentModule.getEditPanel().contains(this.deleteRangeElement)) {
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
                        resultSplitContent += '<a class="e-rte-anchor" href="' + splitTextContent[j as number] +
                        '" title="' + splitTextContent[j as number] + '" target="_blank"' + ' aria-label="' + this.parent.serviceLocator.getService<L10n>('rteLocale').getConstant('linkAriaLabel') + '">' + splitTextContent[j as number] + ' </a>';
                    } else {
                        resultSplitContent += splitTextContent[j as number] + ' ';
                    }
                }
                paraElem[i as number].innerHTML = resultSplitContent.trim();
            }
            const anchorElement: Node = divElement.childNodes[0];
            if (!isNullOrUndefined(anchorElement) && !isNullOrUndefined(anchorElement.childNodes[0]) && anchorElement.nodeName === 'SPAN' && anchorElement.childNodes[0].nodeName === 'A') {
                divElement.innerHTML = divElement.innerHTML.replace('<span>', '').replace('</span>', '');
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
        if (selectNodeEle[0] && selectNodeEle[0].nodeName !== 'A' && urlText.match(regex)) {
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
        const target: HTMLElement = args.originalEvent.target as HTMLElement;
        this.parent.notify(events.closeTooltip, {target: target});
        if (item.command !== 'FormatPainter') {
            if (closestElement && !closestElement.classList.contains('e-rte-inline-popup') && !closestElement.classList.contains('e-rte-text-popup')) {
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
                    item.subCommand === 'FontColor' || item.subCommand === 'BackgroundColor' || item.subCommand === 'NumberFormatList' || item.subCommand === 'BulletFormatList')) {
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
                case 'EmojiPicker':
                    this.parent.notify(events.emojiPicker, { member: 'emojiPicker', args: args });
                    break;
                case 'ImportWord':
                    this.parent.notify(events.onImport, {});
                    break;
                case 'ExportWord':
                    this.parent.notify(events.onExport, { member: 'ExportWord', args: args });
                    break;
                case 'ExportPdf':
                    this.parent.notify(events.onExport, { member: 'ExportPdf', args: args });
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

    private instantiateRenderer(): void {
        if (this.parent.iframeSettings.enable) {
            this.renderFactory.addRenderer(RenderType.Content, new IframeContentRender(this.parent));
        } else {
            this.renderFactory.addRenderer(RenderType.Content, new ContentRender(this.parent));
        }
    }

    private removeEventListener(): void {
        this.parent.off(events.initialEnd, this.render);
        this.parent.off(events.modelChanged, this.onPropertyChanged);
        this.parent.off(events.htmlToolbarClick, this.onToolbarClick);
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
        if (!isNOU(e) && !isNOU(e.newProp.toolbarSettings) && !isNOU(e.newProp.toolbarSettings.enable)) {
            this.toolbarUpdate = new HtmlToolbarStatus(this.parent);
        }
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

    private tableSelectionKeyAction(e: NotifyArgs): void {
        const args: KeyboardEvent = e.args as KeyboardEvent;
        // Handle the space, enter and backspace keys when the table cells are selected.
        const tableCellSelectNodes: NodeListOf<Element> = this.parent.inputElement.querySelectorAll('.e-cell-select');
        for (let i: number = 0; i < tableCellSelectNodes.length; i++) {
            const currentCell: Element = tableCellSelectNodes[i as number];
            removeClassWithAttr([currentCell as HTMLElement],
                                [classes.CLS_TABLE_SEL, classes.CLS_TABLE_MULTI_CELL, classes.CLS_TABLE_SEL_END]);
            if (i === 0) {
                if (args.keyCode === 32) {
                    currentCell.innerHTML = '&#8203;<br>';
                } else {
                    currentCell.innerHTML = '<br>';
                }
                this.nodeSelectionObj.setCursorPoint(this.parent.contentModule.getDocument(), currentCell.firstChild as Element, 0);
            } else {
                currentCell.innerHTML = '<br>';
            }
        }
    }
    private marginTabAdd(val: boolean, alignmentNodes: Node[]): void {
        for (let index: number = 0; index < alignmentNodes.length; index++) {
            const element: HTMLElement = alignmentNodes[index as number] as HTMLElement;
            if (element.closest('li')) {
                continue;
            }
            if (element.style.marginLeft) {
                let count: number = parseInt(element.style.marginLeft, 10);
                if (val) {
                    count -= 20;
                } else {
                    count += 20;
                }
                element.style.marginLeft = count.toString() + 'px';
                if (element.style.marginLeft === '0px'){
                    element.removeAttribute('style');
                }
            }
            else if (!val) {
                element.style.marginLeft = '20px';
            }
        }
    }
}
