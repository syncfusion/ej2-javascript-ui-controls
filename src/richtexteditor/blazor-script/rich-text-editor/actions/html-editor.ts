import { addClass, attributes, Browser, closest, detach, EventHandler, isNullOrUndefined as isNOU, isNullOrUndefined, KeyboardEventArgs, removeClass, MouseEventArgs } from '../../../base'; /*externalscript*/
import { ClickEventArgs } from '../../../navigations/src'; /*externalscript*/
import { hasAnyFormatting, isIDevice, removeClassWithAttr, scrollToCursor } from '../../src/common/util';
import { CodeBlockPosition, IHtmlKeyboardEvent } from '../../src/editor-manager/base/interface';
import { InsertHtml } from '../../src/editor-manager/plugin/inserthtml';
import { ActionBeginEventArgs, IDropDownItemModel, IToolbarItemModel, NotifyArgs } from '../../src/common/interface';
import { FontSizeModel, FormatPainterSettingsModel } from '../../src/models';
import { NodeSelection } from '../../src/selection/selection';
import * as classes from '../classes';
import { IToolbarOptions, IRenderer } from '../interfaces';
import * as events from '../constant';
import { HTMLFormatter } from '../formatter/html-formatter';
import { ToolsItem } from '../interfaces';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { getDefaultValue, getTextNodesUnder, sanitizeHelper } from '../util';
import { HtmlToolbarStatus } from './html-toolbar-status';
import { XhtmlValidation } from './xhtml-validation';
import * as CONSTANTS from './../../src/editor-manager/base/constant';

/**
 * `HtmlEditor` module is used to HTML editor
 */
export class HtmlEditor {
    private parent: SfRichTextEditor;
    private saveSelection: NodeSelection;
    private rangeCollection: Range[] = [];
    private rangeElement: Element;
    private tooltipTargetElement: Element;
    private oldRangeElement: Element;
    private deleteRangeElement: Element;
    private isImageDelete: Boolean = false;
    private isMention: boolean = false;
    private isPreviousNodeBrAfterBackSpace: boolean = false;
    private deleteOldRangeElement: Element;
    private nodeSelectionObj: NodeSelection;
    public toolbarUpdate: HtmlToolbarStatus;
    public xhtmlValidation: XhtmlValidation;
    private clickTimeout: number;
    private contentRenderer: IRenderer;

    constructor(parent?: SfRichTextEditor) {
        this.parent = parent;
        this.xhtmlValidation = new XhtmlValidation(parent);
        this.addEventListener();
    }
    private addEventListener(): void {
        this.nodeSelectionObj = new NodeSelection(this.parent.inputElement);
        this.parent.observer.on(events.htmlToolbarClick, this.onToolbarClick, this);
        this.parent.observer.on(events.keyDown, this.onKeyDown, this);
        this.parent.observer.on(events.keyUp, this.onKeyUp, this);
        this.parent.observer.on(events.initialEnd, this.render, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
        this.parent.observer.on(events.selectAll, this.selectAll, this);
        this.parent.observer.on(events.selectRange, this.selectRange, this);
        this.parent.observer.on(events.getSelectedHtml, this.getSelectedHtml, this);
        this.parent.observer.on(events.selectionSave, this.onSelectionSave, this);
        this.parent.observer.on(events.selectionRestore, this.onSelectionRestore, this);
        this.parent.observer.on(events.readOnlyMode, this.updateReadOnly, this);
        this.parent.observer.on(events.paste, this.onPaste, this);
        this.parent.observer.on(events.tableclass, this.isTableClassAdded, this);
        this.parent.observer.on(events.onHandleFontsizeChange, this.onHandleFontsizeChange, this);
        this.parent.observer.on(events.hideToolTip, this.hideTooltip, this);
        this.parent.observer.on(events.beforeDropDownClose, this.mouseOutEventHandler, this);
    }

    private isTableClassAdded(): void  {
        const tableElement : NodeListOf<HTMLElement> = this.parent.inputElement.querySelectorAll('table');
        for (let i: number = 0; i < tableElement.length; i++) {
            if (tableElement[i as number].classList.length > 0 && tableElement[i as number].classList.contains('e-rte-custom-table')) {
                continue; // Skip the custom table class
            }
            if (!tableElement[i as number].classList.contains('e-rte-table') && !tableElement[i as number].classList.contains('e-rte-paste-table') ){
                tableElement[i as number].classList.add('e-rte-table');
            }
        }
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
        const currentDocument: Document = this.parent.getDocument();
        const range: Range = this.nodeSelectionObj.getRange(currentDocument);
        this.saveSelection = this.nodeSelectionObj.save(range, currentDocument);
    }
    private onSelectionRestore(e: IToolbarOptions): void {
        this.parent.isBlur = false;
        (this.parent.getEditPanel() as HTMLElement).focus({preventScroll: true});
        if (isNullOrUndefined(e.items) || e.items) {
            this.saveSelection.restore();
        }
    }
    private onKeyUp(e: NotifyArgs): void {
        const args: KeyboardEvent = e.args as KeyboardEvent;
        const restrictKeys: number[] = [8, 9, 13, 17, 18, 20, 27, 36, 37, 38, 39, 40, 44, 45, 46, 91,
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
            isMention = args.keyCode === 16 && mentionStartNode.textContent.charCodeAt(0) === 8203 &&
                !isNOU(mentionStartNode.previousSibling) && (mentionStartNode.previousSibling as HTMLElement).contentEditable === 'false';
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
                this.removeZeroWidthSpaces(range.startContainer, regEx);
                pointer = previousRange === 0 ? previousRange : previousRange - (previousLength - range.startContainer.textContent.length);
                this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                    this.parent.getDocument(), range.startContainer as Element, pointer);
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
                        this.removeZeroWidthSpaces(currentChild, regEx);
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
                const currentElement: Element | null = this.parent.inputElement.querySelector('.currentStartMark');
                const currentChildNode: NodeListOf<ChildNode> | [] = currentElement ? currentElement.childNodes : [];
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
                    this.parent.getDocument(),
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
                    this.parent.getDocument(), range.startContainer as Element, pointer);
            }
        }
        if (this.parent.editorMode === 'HTML') {
            switch ((e.args as MouseEvent).which) {
            case 46:
            case 8:
                // eslint-disable-next-line
                const childNodes: Element[] = <NodeListOf<Element> & Element[]>this.parent.getEditPanel().childNodes;
                if ((childNodes.length === 0) ||
                    (childNodes.length === 1 && childNodes[0].childNodes.length === 0 && (((childNodes[0] as Element).tagName === 'BR') ||
                    (((childNodes[0] as Element).tagName === 'P' || (childNodes[0] as Element).tagName === 'DIV') && childNodes[0].textContent === '')))) {
                    const node: Element = this.parent.getEditPanel();
                    if (this.parent.enterKey === 'DIV') {
                        node.innerHTML = '<div><br/></div>';
                    } else if (this.parent.enterKey === 'BR') {
                        node.innerHTML = '<br/>';
                    } else {
                        node.innerHTML = '<p><br/></p>';
                    }
                    this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                        this.parent.getDocument(), node.childNodes[0].parentElement as Element, 0);
                }
                break;
            }
        }
    }
    private removeZeroWidthSpaces(node: Node, regex: RegExp): void {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent !== null) {
                node.textContent = node.textContent.replace(regex, '');
            }
            return;
        }
        node.childNodes.forEach((child: ChildNode) => {
            this.removeZeroWidthSpaces(child, regex);
        });
    }
    private onKeyDown(e: NotifyArgs): void {
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
                const range: Range = this.nodeSelectionObj.getRange(this.parent.getDocument());
                const parentNode: Node[] = this.nodeSelectionObj.getParentNodeCollection(range);
                if (!((parentNode[0].nodeName === 'LI' || closest(parentNode[0] as HTMLElement, 'li') ||
                    closest(parentNode[0] as HTMLElement, 'table')))) {
                    args.preventDefault();
                    const selection: Range = this.parent.getDocument().getSelection().getRangeAt(0);
                    let alignmentNodes: Node[] = this.parent.formatter.editorManager.domNode.blockNodes();
                    if (this.parent.enterKey === 'BR') {
                        if (selection.startOffset !== selection.endOffset && selection.startOffset === 0) {
                            let save: NodeSelection = this.nodeSelectionObj.save(range, this.parent.getDocument());
                            this.parent.formatter.editorManager.domNode.setMarker(save);
                            alignmentNodes = this.parent.formatter.editorManager.domNode.blockNodes();
                            (this.parent.formatter.editorManager).domNode.convertToBlockNodes(alignmentNodes, false);
                            this.marginTabAdd(args.shiftKey, alignmentNodes);
                            save = (this.parent.formatter.editorManager).domNode.saveMarker(save);
                            save.restore();
                        }
                        else {
                            InsertHtml.Insert(this.parent.getDocument(), '&nbsp;&nbsp;&nbsp;&nbsp;', this.parent.element);
                            this.rangeCollection.push(this.nodeSelectionObj.getRange(this.parent.getDocument()));
                        }
                    } else {
                        if (selection.startOffset !== selection.endOffset && selection.startOffset === 0) {
                            this.marginTabAdd(args.shiftKey, alignmentNodes);
                        }
                        else {
                            InsertHtml.Insert(this.parent.getDocument(), '&nbsp;&nbsp;&nbsp;&nbsp;', this.parent.element);
                            this.rangeCollection.push(this.nodeSelectionObj.getRange(this.parent.getDocument()));
                        }
                    }
                }
            }
            this.parent.formatter.saveData(e);
        }
        if (((e as NotifyArgs).args as KeyboardEventArgs).action === 'space') {
            const currentRange: Range = this.parent.getRange();
            const editorValue: string = currentRange.startContainer.textContent.slice(0, currentRange.startOffset);
            const orderedList: boolean = this.isOrderedList(editorValue);
            const unOrderedList: boolean =  this.isUnOrderedList(editorValue);
            let hasSplitedText: boolean = false;
            if (orderedList || unOrderedList) {
                hasSplitedText = this.hasMultipleTextNode(currentRange);
                if (hasSplitedText && !this.isMention) {
                    let element: HTMLElement = currentRange.startContainer as HTMLElement;
                    element = this.parent.formatter.editorManager.domNode.getImmediateBlockNode(element) as HTMLElement;
                    if (element.childNodes.length > 0 && !element.innerHTML.includes('<br>')) {
                        hasSplitedText = false;
                    }
                }
            }
            if (!hasSplitedText && (orderedList && !unOrderedList || unOrderedList && !orderedList)) {
                const eventArgs: IHtmlKeyboardEvent = {
                    callBack: null,
                    event: ((e as NotifyArgs).args as KeyboardEventArgs),
                    name: 'keydown-handler',
                    enterKey: this.parent.enterKey,
                    shiftEnterKey: this.parent.shiftEnterKey
                };
                (this.parent.dotNetRef.invokeMethodAsync(
                    events.actionBeginEvent, { requestType: orderedList ? 'OL' : 'UL', cancel: false }) as unknown as Promise<ActionBeginEventArgs>).then((actionBeginArgs: ActionBeginEventArgs) => {
                    if (!actionBeginArgs.cancel) {
                        this.parent.formatter.editorManager.observer.notify(events.ON_BEGIN, eventArgs);
                        this.parent.dotNetRef.invokeMethodAsync(
                            events.actionCompleteEvent, {
                                editorMode: this.parent.editorMode, name: events.actionCompleteEvent, requestType: orderedList ? 'OL' : 'UL'
                            });
                    }
                });
            }
        }
        const regex: RegExp = /[^\w\s\\/\\.\\:]/g;
        if (((e as NotifyArgs).args as KeyboardEventArgs).action === 'space' ||
            ((e as NotifyArgs).args as KeyboardEventArgs).action === 'enter' ||
            ((e as NotifyArgs).args as KeyboardEventArgs).keyCode === 13 || regex.test(((e as NotifyArgs).args as KeyboardEventArgs).key)) {
            const currentRange: Range = this.parent.getRange();
            const currentElem: Node = currentRange.endContainer.nodeName === '#text' ?
                currentRange.endContainer.parentElement : currentRange.endContainer;
            const closestAnchorElem: Element = closest(currentElem, 'a');
            if (isNullOrUndefined(closestAnchorElem)) {
                this.spaceLink(args);
            }
            if (this.parent.editorMode === 'HTML') {
                this.parent.observer.notify(events.enterHandler, { args: (e.args as KeyboardEvent) });
                scrollToCursor(this.parent.getDocument(), this.parent.inputElement);
                const newRange: Range = this.parent.getRange();
                const newRangeGetBL: number = (newRange.startContainer.nodeName === '#text')
                    ? (newRange as Range).getBoundingClientRect().bottom
                    : (newRange.startContainer as Element).getBoundingClientRect().bottom;
                const parentGetBL: number = this.parent.element.getBoundingClientRect().bottom;
                if (!isNullOrUndefined(newRange.startContainer) && this.parent.height !== 'auto' && newRange.startContainer.nodeName !== '#text'
                    && !this.parent.iframeSettings.enable && (newRangeGetBL > parentGetBL)) {
                    this.parent.element.querySelector('.e-content').scrollTop += newRangeGetBL - parentGetBL;
                }
            }
        }
        if (Browser.info.name === 'chrome' && (!isNullOrUndefined(this.rangeElement) && !isNullOrUndefined(this.oldRangeElement) ||
                !isNullOrUndefined(this.deleteRangeElement) && !isNullOrUndefined(this.deleteOldRangeElement)) &&
                currentRange.startContainer.parentElement.tagName !== 'TD' && currentRange.startContainer.parentElement.tagName !== 'TH') {
            this.rangeElement = null;
            this.oldRangeElement = null;
            this.deleteRangeElement = null;
            this.deleteOldRangeElement = null;
            if ( !this.isImageDelete ){
                args.preventDefault();
            }
            args.preventDefault();
        }
    }

    private onHandleFontsizeChange(e: NotifyArgs): void {
        const keyboardArgs: KeyboardEventArgs = e.args as KeyboardEventArgs;
        const args: ActionBeginEventArgs = {
            name: 'dropDownSelect',
            item: {
                command: 'Font',
                subCommand: 'FontSize'
            }
        } as ActionBeginEventArgs;
        const items: IDropDownItemModel[] = (this.parent.fontSize as FontSizeModel).items;
        let activeElem: string;
        if (!isNOU(document.getElementById(this.parent.id + '_toolbar_FontSize')) && !isNOU(document.getElementById(this.parent.id + '_toolbar_FontSize').innerText) && document.getElementById(this.parent.id + '_toolbar_FontSize').innerText !== '') {
            activeElem = document.getElementById(this.parent.id + '_toolbar_FontSize').innerText;
        } else {
            let fontSizeValue: string;
            const selection: Selection = this.parent.getDocument().getSelection();
            if (selection && selection.focusNode && selection.focusNode.parentElement) {
                fontSizeValue = document.defaultView.getComputedStyle(selection.focusNode.parentElement, null).getPropertyValue('font-size');
            } else {
                fontSizeValue = (this.parent.fontSize as FontSizeModel).width;
            }
            fontSizeValue = isNOU(fontSizeValue) ? (this.parent.fontSize as FontSizeModel).width : fontSizeValue;
            const actualTxtFontValues: RegExpMatchArray = fontSizeValue.match(/^([\d.]+)(\D+)$/);
            const size: number = parseInt(actualTxtFontValues[1], 10);
            const unit: string = actualTxtFontValues[2];
            const defaultFontValues: RegExpMatchArray = items[0].value.match(/^([\d.]+)(\D+)$/);
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
        if (events.supportedUnits.indexOf(originalUnit) !== -1 || events.supportedUnits.indexOf(targetUnit) !== -1) {
            originalUnit = 'px';
        }
        const convertedValue: number = value * events.conversionFactors[originalUnit as string][targetUnit as string];
        return convertedValue;
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
        this.isMention = false;
        if (range && range.startContainer && range.startContainer.parentNode) {
            const parentNode: Node = range.startContainer.parentNode as Node;
            if ((range.startContainer as HTMLElement).previousElementSibling &&
                (range.startContainer as HTMLElement).previousElementSibling.classList.contains('e-mention-chip')
                && !((range.startContainer as HTMLElement).previousElementSibling as HTMLElement).isContentEditable) {
                this.isMention = true;
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
    //Determines if the cursor is truly at the start of a block element
    private isCursorAtBlockStart(range: Range): boolean {
        if (range.startOffset !== 0 || range.endOffset !== 0) {
            return false;
        }
        // Get the node where cursor is positioned
        const cursorNode: Node = range.startContainer;
        // If cursor is in a text node, check its parent
        const elementAtCursor: Element = cursorNode.nodeType === Node.TEXT_NODE ?
            cursorNode.parentElement : cursorNode as Element;
        // First, check if we're in a table cell - we don't want to handle these
        if (elementAtCursor.tagName === 'TD' || elementAtCursor.tagName === 'TH') {
            return false;
        }
        // Find the block-level ancestor
        const blockNode: Element = this.parent.formatter.editorManager.domNode.getImmediateBlockNode(elementAtCursor) as Element;
        // If cursor is directly in a block element at position 0, it's at the start
        if (cursorNode === blockNode && range.startOffset === 0) {
            return true;
        }
        // Otherwise, we need to check if the cursor is positioned at the absolute beginning of content
        let currentNode: Node = elementAtCursor;
        let previousContentFound: boolean = false;
        // Walk up the DOM tree until we reach the block parent
        while (currentNode && currentNode !== blockNode) {
            // Check if there's any previous sibling with content
            let sibling: Node = currentNode.previousSibling;
            while (sibling) {
                // Skip empty text nodes
                if (sibling.nodeType === Node.TEXT_NODE && (!sibling.textContent || !sibling.textContent.trim())) {
                    sibling = sibling.previousSibling;
                    continue;
                }
                // If we found any non-empty previous sibling, cursor is not at block start
                previousContentFound = true;
                break;
            }
            if (previousContentFound) {
                break;
            }
            // Move up to parent and check again
            currentNode = currentNode.parentNode;
        }
        // If we reached the block parent without finding previous content, cursor is at start
        return !previousContentFound;
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
        // Method to determine if cursor is truly at start
        const isCursorAtStart: boolean = this.isCursorAtBlockStart(currentRange);
        if (((e as NotifyArgs).args as KeyboardEventArgs).code === 'Backspace' &&
            ((e as NotifyArgs).args as KeyboardEventArgs).keyCode === 8 &&
            isCursorAtStart && currentRange.startContainer.textContent !== ' ' && currentRange.startContainer.nodeValue !== '\u00A0' &&
            this.parent.getSelection().length === 0 && currentRange.startContainer.textContent.length > 0 &&
            isPreviousNotContentEditable && isSelectedPositionNotStart) {
            if ((!this.parent.formatter.editorManager.domNode.isBlockNode(checkNode as Element) &&
                !isNOU(checkNode.previousSibling) && checkNode.previousSibling.nodeName === 'BR') ||
                (!isNOU(currentRange.startContainer.previousSibling) && currentRange.startContainer.previousSibling.nodeName === 'BR')) {
                return;
            }
            const immediateBlockNode: Node = this.parent.formatter.editorManager.domNode.
                getImmediateBlockNode(currentRange.startContainer);
            const blockNode: Node = immediateBlockNode !== this.parent.inputElement ? immediateBlockNode : currentRange.startContainer;
            const firstPosition: { node: Node; position: number } =
                this.parent.formatter.editorManager.nodeSelection.findFirstContentNode(blockNode);
            const cursorAtFirstPosition: boolean = firstPosition && firstPosition.node === (currentRange.startContainer.nodeName === 'CODE' ? currentRange.startContainer.firstChild : currentRange.startContainer) &&
                currentRange.startOffset === 0;
            const isBlockPreviousElement: { currentNode: Node, previousSibling: Node } | null =
                this.parent.formatter.editorManager.codeBlockObj.findParentOrPreviousSiblingCodeBlock(currentRange);
            const isCodeBlockElement: HTMLElement | null =
                this.parent.formatter.editorManager.codeBlockObj.isValidCodeBlockStructure(blockNode);
            if ((!isNOU(isBlockPreviousElement) && cursorAtFirstPosition) || (!isNOU(isCodeBlockElement) && cursorAtFirstPosition)) {
                return;
            }
            this.rangeElement = (this.getRootBlockNode(currentRange.startContainer) as HTMLElement);
            if (this.rangeElement.tagName === 'OL' || this.rangeElement.tagName === 'UL') {
                const liElement: HTMLElement = (this.getRangeLiNode(currentRange.startContainer) as HTMLElement);
                if (liElement.previousElementSibling && this.parent.inputElement.contains(liElement.previousElementSibling)
                    && liElement.previousElementSibling.childElementCount > 0) {
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
              (!isNullOrUndefined(this.rangeElement.previousElementSibling) && this.rangeElement.previousElementSibling.tagName === 'TABLE')) {
                return;
            } else {
                this.oldRangeElement = (this.rangeElement.previousElementSibling as HTMLElement);
            }
            const findBlockElement: Node[] = this.parent.formatter.editorManager.domNode.blockNodes();
            if (!isNOU(findBlockElement[0]) && currentRange.collapsed && currentRange.startOffset === 0 && currentRange.endOffset === 0 && (findBlockElement[0] as HTMLElement).style.marginLeft !== '') {
                (findBlockElement[0] as HTMLElement).style.marginLeft = (parseInt((findBlockElement[0] as HTMLElement).style.marginLeft, 10) <= 20) ? '' : (parseInt((findBlockElement[0] as HTMLElement).style.marginLeft, 10) - 20 + 'px');
            }
            const findBlockElementSibiling: HTMLElement = findBlockElement[0].previousSibling ?
                findBlockElement[0].previousSibling as HTMLElement : this.findPreviousElementSibling(findBlockElement[0] as HTMLElement);
            if (isNullOrUndefined(this.oldRangeElement) && isNullOrUndefined(findBlockElement[0].previousSibling)) {
                return;
            } else if (findBlockElementSibiling) {
                const prevSibling: HTMLElement = findBlockElementSibiling;
                const currentElement: HTMLElement = findBlockElement[0] as HTMLElement;
                if (prevSibling.textContent.trim()) {
                    this.removeLastBr(prevSibling);
                    const lastPosition: { node: Node; offset: number } | null = this.findLastTextPosition(prevSibling);
                    const cursorpointer: number = lastPosition.offset;
                    const lastChild: Element = lastPosition.node as Element;
                    const childNodes: Node[] = Array.from(currentElement.childNodes);
                    let save: NodeSelection = this.nodeSelectionObj.save(currentRange, this.parent.getDocument());
                    if (this.isPreviousNodeBrAfterBackSpace) {
                        this.parent.formatter.editorManager.domNode.setMarker(save);
                    }
                    const previousBlockElements: Node = this.parent.formatter.editorManager.domNode.getImmediateBlockNode(lastChild);
                    for (let i: number = 0; i < childNodes.length; i++) {
                        previousBlockElements.appendChild(childNodes[i as number].cloneNode(true));
                    }
                    if (this.isPreviousNodeBrAfterBackSpace) {
                        save = this.parent.formatter.editorManager.domNode.saveMarker(save);
                        save.restore();
                    } else {
                        this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                            this.parent.getDocument(),
                            lastChild,
                            cursorpointer
                        );
                    }
                    currentElement.parentNode.removeChild(currentElement);
                    (e.args as KeyboardEventArgs).preventDefault();
                } else {
                    prevSibling.parentNode.removeChild(prevSibling);
                }
            } else {
                if (this.oldRangeElement.tagName === 'OL' || this.oldRangeElement.tagName === 'UL') {
                    this.oldRangeElement = this.oldRangeElement.lastElementChild.lastElementChild ?
                        this.oldRangeElement.lastElementChild.lastElementChild :
                        this.oldRangeElement.lastElementChild;
                }
                let lastNode: Node = this.oldRangeElement.lastChild ? this.oldRangeElement.lastChild : this.oldRangeElement;
                while (lastNode.nodeType !== 3 && lastNode.nodeName !== '#text' &&
                    lastNode.nodeName !== 'BR' && !isNullOrUndefined(lastNode.lastChild)) {
                    lastNode = lastNode.lastChild;
                }
                if (lastNode.nodeName === 'IMG') {
                    this.parent.formatter.editorManager.nodeSelection.setCursorPoint(this.parent.getDocument(),
                                                                                     lastNode.parentElement as Element,
                                                                                     lastNode.parentElement.childNodes.length);
                }
                else{
                    this.parent.formatter.editorManager.nodeSelection.setCursorPoint(this.parent.getDocument(),
                                                                                     lastNode as Element, lastNode.textContent.length);
                }
                if (this.oldRangeElement.nodeName !== '#text' && this.oldRangeElement.querySelectorAll('BR').length === 1) {
                    const brElement: HTMLElement = this.oldRangeElement.querySelector('BR');
                    if (brElement && isNOU(brElement.nextSibling)) {
                        detach(this.oldRangeElement.querySelector('BR'));
                    }
                }
                if (!isNullOrUndefined(this.rangeElement) && this.oldRangeElement !== this.rangeElement) {
                    while (this.rangeElement.firstChild) {
                        if (this.oldRangeElement.nodeName === '#text'){
                            this.oldRangeElement.parentElement.appendChild(this.rangeElement.childNodes[0]);
                        }
                        else{
                            this.oldRangeElement.appendChild(this.rangeElement.childNodes[0]);
                        }
                    }
                    if (!isLiElement) {
                        detach(this.rangeElement);
                    } else {
                        detach(this.rangeElement.parentElement);
                    }
                    this.oldRangeElement.normalize();
                }
            }
        }
        if (((e as NotifyArgs).args as KeyboardEventArgs).code === 'Backspace' && ((e as NotifyArgs).args as KeyboardEventArgs).keyCode === 8 &&
            currentRange.startContainer.nodeType !== Node.TEXT_NODE) {
            const ChildNode: HTMLElement = !isNOU(currentRange.startContainer.childNodes[currentRange.startOffset - 1]) &&
                !isNOU((currentRange.startContainer.childNodes[currentRange.startOffset - 1] as HTMLElement).isContentEditable) &&
                !(currentRange.startContainer.childNodes[currentRange.startOffset - 1] as HTMLElement).isContentEditable ?
                currentRange.startContainer.childNodes[currentRange.startOffset - 1] as HTMLElement : null;
            const index: number = currentRange.startOffset > 1 ? currentRange.startOffset - 1 : 0;
            if (ChildNode) {
                ChildNode.remove();
                (e.args as KeyboardEventArgs).preventDefault();
            } else if ((checkNode && checkNode.textContent.trim() === '') ||
                (currentRange.startContainer.childNodes[index as number] &&
                    currentRange.startContainer.childNodes[index as number].textContent.trim() === '')) {
                const node: Node = checkNode && checkNode.textContent.trim() === '' ? checkNode : currentRange.startContainer.childNodes[index as number];
                if (hasAnyFormatting(node) && node.previousSibling && node.previousSibling.textContent.trim() === '') {
                    this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                        this.parent.getDocument(), node.previousSibling as HTMLElement, 0);
                    detach(node);
                    (e.args as KeyboardEventArgs).preventDefault();
                }
            }
        }
    }
    
    private findPreviousElementSibling(element: HTMLElement): HTMLElement {
        let current: HTMLElement = element;
        while (current) {
            const prevSibling: HTMLElement = current.previousElementSibling as HTMLElement;
            if (prevSibling) {
                return prevSibling;
            }
            current = current.parentElement;
            if (current && current === this.parent.inputElement) {
                return null;
            }
        }
        return null;
    }

    //Finds the last significant node within the given element.
    private getLastNode(node: Node): Node | null {
        while (node && node.lastChild) {
            node = node.lastChild;
        }
        // Skip empty text nodes by checking if the node is a text node and contains only whitespace.
        while (node && node.nodeType === Node.TEXT_NODE && !node.nodeValue.trim()) {
            node = node.previousSibling;
        }
        return node;
    }
    // Removes the last <br> element from the given element if it is the last meaningful node.
    private removeLastBr(element: HTMLElement): void {
        // Get the last meaningful node of the given element.
        const lastNode: Node = this.getLastNode(element);
        // If the last node is a <br> element, remove it from the DOM.
        if (lastNode && lastNode.nodeName === 'BR' && lastNode.parentNode) {
            this.isPreviousNodeBrAfterBackSpace = !isNOU(lastNode.previousSibling) &&
                lastNode.previousSibling.nodeName === 'BR' ? true : false;
            lastNode.parentNode.removeChild(lastNode);
        }
    }
    private findLastTextPosition(element: Node): { node: Node; offset: number } | null {
        if (element.nodeType === Node.TEXT_NODE) {
            return { node: element, offset: element.textContent ? element.textContent.length : 0 };
        }
        for (let i: number = element.childNodes.length - 1; i >= 0; i--) {
            const lastPosition: { node: Node; offset: number } | null = this.findLastTextPosition(element.childNodes[i as number]);
            if (lastPosition) {
                return lastPosition;
            }
        }
        return null;
    }
    private deleteCleanup(e: NotifyArgs, currentRange: Range): void {
        let isLiElement: boolean = false;
        let liElement: HTMLElement;
        let rootElement: HTMLElement;
        const codePos: CodeBlockPosition = this.parent.formatter.editorManager.codeBlockObj.getCodeBlockPosition(currentRange);
        if ((e.args as KeyboardEventArgs).code === 'Delete' && (!isNOU(this.parent.formatter.editorManager.codeBlockObj.isValidCodeBlockStructure(currentRange.startContainer)) ||
            (!isNOU(codePos.nextSiblingCodeBlockElement) && codePos.cursorAtLastPosition))) {
            return;
        }
        if (((e as NotifyArgs).args as KeyboardEventArgs).code === 'Delete' && ((e as NotifyArgs).args as KeyboardEventArgs).keyCode === 46 &&
            this.parent.getText().trim().replace(/(\r\n|\n|\r|\t)/gm, '').replace(/\u200B/g, '').length !== 0 && this.parent.getSelection().length === 0 && currentRange.startContainer.parentElement.tagName !== 'TD' &&
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
                    const nextHierarchySibling: HTMLElement = this.findNextHierarchySibling(liElement);
                    if (nextHierarchySibling) {
                        this.deleteOldRangeElement = this.getRangeElement(nextHierarchySibling);
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
                    if ( currentRange.startOffset === 0 && currentRange.endOffset === 1 &&
                        this.deleteRangeElement.childNodes[0] && this.deleteRangeElement.childNodes[0].nodeName === 'IMG' ) {
                        this.parent.formatter.editorManager.nodeSelection.setSelectionText(
                            this.parent.getDocument(), this.deleteRangeElement, this.deleteRangeElement, 0, 1 );
                        this.isImageDelete = true;
                    } else{
                        this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                            this.parent.getDocument(), this.deleteRangeElement, this.deleteRangeElement.childNodes.length );
                        this.isImageDelete = false;
                    }
                    const brNode: HTMLElement = this.deleteRangeElement.querySelector('BR');
                    const brLastChildNode: Node = this.deleteRangeElement.lastChild;
                    let brParentNode: Node;
                    if (brLastChildNode) {
                        brParentNode = brLastChildNode.parentNode;
                    }
                    if (brNode && brLastChildNode && brLastChildNode.nodeName === 'BR') {
                        detach(brLastChildNode);
                        if (!isNullOrUndefined(brParentNode) && brParentNode.childNodes.length === 0) {
                            detach(brParentNode);
                        }
                        if (!isNullOrUndefined(this.deleteRangeElement) && this.deleteOldRangeElement.tagName &&
                            (this.deleteOldRangeElement.tagName === 'OL' || this.deleteOldRangeElement.tagName === 'UL')
                            && this.deleteOldRangeElement !== this.deleteRangeElement
                            && !this.parent.getEditPanel().contains(this.deleteRangeElement)) {
                            const firstLi: HTMLElement = this.deleteOldRangeElement.querySelector('li');
                            if (firstLi) {
                                let textNode: Node = firstLi;
                                while (textNode && textNode.firstChild && textNode.firstChild.nodeType !== Node.TEXT_NODE) {
                                    textNode = textNode.firstChild;
                                }
                                if (textNode && textNode.firstChild && textNode.firstChild.nodeType === Node.TEXT_NODE) {
                                    this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                                        this.parent.getDocument(),
                                        textNode.firstChild as Element,
                                        0
                                    );
                                } else {
                                    this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                                        this.parent.getDocument(),
                                        firstLi,
                                        0
                                    );
                                }
                            } else {
                                this.parent.formatter.editorManager.nodeSelection.setSelectionText(
                                    this.parent.getDocument(),
                                    this.deleteOldRangeElement,
                                    this.deleteOldRangeElement,
                                    0,
                                    0
                                );
                            }
                        }
                        (e.args as KeyboardEventArgs).preventDefault();
                    }
                    const isResizeElem: boolean = this.deleteOldRangeElement.tagName !== 'SPAN' && this.deleteRangeElement.className === 'e-img-resize';
                    const delVal: boolean = (!isNOU(e.args) && !isNOU((e.args as KeyboardEventArgs).action) && (((e.args as KeyboardEventArgs).action)) === 'delete');
                    if ( !isNullOrUndefined( this.deleteRangeElement ) && ( this.deleteOldRangeElement.tagName !== 'OL' && this.deleteOldRangeElement.tagName !== 'UL'
                        && this.deleteOldRangeElement !== this.deleteRangeElement && (isResizeElem || delVal) && this.deleteOldRangeElement.tagName !== 'LI' )
                        && this.deleteOldRangeElement !== this.deleteRangeElement
                        && this.parent.getEditPanel().contains(this.deleteRangeElement)) {
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
                    if (currentRange && currentRange.startContainer && currentRange.startContainer.nodeType !== Node.TEXT_NODE && ((currentRange.startContainer as Element).querySelector('video') || (currentRange.startContainer as Element).querySelector('audio'))) {
                        this.nodeSelectionObj.restore();
                        const range: Range = this.nodeSelectionObj.getRange(this.parent.getDocument());
                        const save: NodeSelection = this.nodeSelectionObj.save(range, this.parent.getDocument());
                    }
                }
            } else {
                this.deleteRangeElement = null;
            }
        }
    }
    private findNextHierarchySibling(element: HTMLElement): HTMLElement | null {
        // Check if the element has a direct next sibling
        if (element.nodeName === 'LI') {
            // Case 1: Check for direct next sibling of the list item
            if (element.nextElementSibling) {
                return element.nextElementSibling as HTMLElement;
            }
            const parentElement: HTMLElement = element.parentElement;
            // Case 2: No direct sibling, check if the parent's next sibling is a list item
            if (parentElement.nextElementSibling && parentElement.nextElementSibling.nodeName === 'LI') {
                return parentElement.nextElementSibling as HTMLElement;
            }
            // Case 3: For nested lists, traverse up the hierarchy through parent lists
            if (parentElement.tagName === 'UL' || parentElement.tagName === 'OL') {
                const parentLi: HTMLElement = parentElement.parentElement;
                // Case 3.1: If parent list is inside another list item, check for its sibling
                if (parentLi && parentLi.nextElementSibling) {
                    return parentLi.nextElementSibling as HTMLElement;
                } else if (parentLi && parentLi.nodeName === 'LI') {
                    // Case 3.2: If parent list item exists but has no siblings, recursively check up the tree
                    return this.findNextHierarchySibling(parentLi);
                }
            }
            // No suitable next element found in the hierarchy
            return null;
        } else {
            // For non-list item elements, simply return next sibling
            return element.nextElementSibling as HTMLElement;
        }
    }
    private getCaretIndex(currentRange: Range, element: Element): number {
        let position: number = 0;
        if (this.parent.getDocument().getSelection().rangeCount !== 0) {
            const preCaretRange: Range = currentRange.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(currentRange.endContainer, currentRange.endOffset);
            position = preCaretRange.toString().length;
        }
        return position;
    }
    private getRangeElement(element: Element): Element {
        let rangeElement: Element;
        if (element.childNodes.length <= 1) {
            rangeElement = element.lastElementChild ? element.lastElementChild.tagName === 'BR' ?
                element.lastElementChild.previousElementSibling ? element.lastElementChild.previousElementSibling
                    : element : element.lastElementChild : element;
        } else {
            rangeElement = element;
        }
        return rangeElement;
    }
    private getRootBlockNode(rangeBlockNode: Node): Node {
        for (; rangeBlockNode && this.parent && this.parent.inputElement !== rangeBlockNode;
            rangeBlockNode = rangeBlockNode.parentElement) {
            if (rangeBlockNode.parentElement === this.parent.inputElement) {
                break;
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
        const regex: RegExp = new RegExp(/([^\S]|^)(((https?:\/\/)|(www\.))(\S+))/gi);
        if (e.text.match(regex)) {
            (e.args as KeyboardEvent).preventDefault();
            const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
            const saveSelection: NodeSelection = this.parent.formatter.editorManager.nodeSelection.save(
                range, this.parent.getDocument());
            const httpRegex: RegExp = new RegExp(/([^\S]|^)(((https?:\/\/)))/gi);
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
            const divElement: HTMLElement = document.createElement('div');
            divElement.setAttribute('class', 'pasteContent');
            divElement.style.display = 'inline';
            divElement.innerHTML = contentInnerElem;
            const paraElem: NodeListOf<HTMLParagraphElement> = divElement.querySelectorAll('span, p');
            for (let i: number = 0; i < paraElem.length; i++) {
                const splitTextContent: string[] = paraElem[i as number].innerHTML.split(' ');
                let resultSplitContent: string = '';
                for (let j: number = 0; j < splitTextContent.length; j++) {
                    if (splitTextContent[j as number].match(httpRegex) || splitTextContent[j as number].match(wwwRegex)) {
                        resultSplitContent += '<a className="e-rte-anchor" href="' + splitTextContent[j as number] +
                            '" title="' + splitTextContent[j as number] + '" target="_blank">' + splitTextContent[j as number] + ' </a>';
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
            // if (!isNullOrUndefined(this.parent.pasteCleanupModule)) {
            e.callBack(divElement.innerHTML);
            // } else {
            //     this.parent.executeCommand('insertHTML', divElement);
            // }
        }
    }
    private spaceLink(e?: KeyboardEvent): void {
        const range: Range = this.nodeSelectionObj.getRange(this.parent.getDocument());
        if (range.startContainer.nodeType === Node.TEXT_NODE) {
            const selectNodeEle: Node[] = this.nodeSelectionObj.getParentNodeCollection(range);
            const text: string = range.startContainer.textContent.substring(0, range.endOffset);
            const splitText: string[] = text.split(' ');
            let urlText: string = splitText[splitText.length - 1];
            const urlTextRange: number = range.startOffset - (text.length - splitText[splitText.length - 1].length);
            urlText = urlText.slice(0, urlTextRange);
            const regex: RegExp = new RegExp(/([^\S]|^)(((https?:\/\/)|(www\.))(\S+))/gi);
            if (selectNodeEle[0] && selectNodeEle[0].nodeName !== 'A' && urlText.match(regex)) {
                const selection: NodeSelection = this.nodeSelectionObj.save(
                    range, this.parent.getDocument());
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
    }
    private onToolbarClick(args: ClickEventArgs): void {
        let save: NodeSelection;
        let selectNodeEle: Node[];
        let selectParentEle: Node[];
        const item: IToolbarItemModel = args.item as IToolbarItemModel;
        let target: Element;
        if (item.subCommand !== 'CodeBlock'){
            target = args.originalEvent.target as Element;
        }
        const closestElement: Element = target && closest(target, '.' + classes.CLS_QUICK_POP);
        if (item.command === 'FormatPainter') {
            this.handleFormatPainterClick(args);
        }
        else {
            if (closestElement && !closestElement.classList.contains(classes.CLS_INLINE_POP)
                && !closestElement.classList.contains(classes.CLS_TEXT_POP)) {
                if (!(item.subCommand === 'SourceCode' || item.subCommand === 'Preview' ||
                    item.subCommand === 'FontColor' || item.subCommand === 'BackgroundColor')) {
                    if (isIDevice() && (item.command === 'Images' || item.command === 'Audios' ||  item.command === 'Videos')) { this.nodeSelectionObj.restore(); }
                    else if (item.command === 'Audios' && this.nodeSelectionObj.startNodeName.length !== 0) { this.nodeSelectionObj.restore(); }
                    const range: Range = this.nodeSelectionObj.getRange(this.parent.getDocument());
                    save = this.nodeSelectionObj.save(range, this.parent.getDocument());
                    selectNodeEle = this.nodeSelectionObj.getNodeCollection(range);
                    selectParentEle = this.nodeSelectionObj.getParentNodeCollection(range);
                }
                if (item.command === 'Images') {
                    this.parent.observer.notify(events.imageToolbarAction, {
                        member: 'image', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                    });
                }
                if (item.command === 'Audios') {
                    this.parent.observer.notify(events.audioToolbarAction, {
                        member: 'audio', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                    });
                }
                if (item.command === 'Videos') {
                    this.parent.observer.notify(events.videoToolbarAction, {
                        member: 'video', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
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
                    item.subCommand === 'FontColor' || item.subCommand === 'BackgroundColor' || item.subCommand === 'NumberFormatList' || item.subCommand === 'BulletFormatList')) {
                    const range: Range = this.nodeSelectionObj.getRange(this.parent.getDocument());
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
                case 'ImportWord':
                    (window as any).sfBlazor.instances['RT_Editor_import'].element.click();
                    break;
                case 'Image':
                    this.parent.observer.notify(events.insertImage, {
                        member: 'image', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                    });
                    break;
                case 'Audio':
                    this.parent.observer.notify(events.insertAudio, {
                        member: 'audio', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                    });
                    break;
                case 'Video':
                    this.parent.observer.notify(events.insertVideo, {
                        member: 'video', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
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
                case 'CodeBlock':
                    this.parent.observer.notify(events.onCodeBlock, { member: 'codeBlock', args: args });
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
        const currentDocument: Document = this.parent.iframeSettings.enable ? this.parent.getPanel().ownerDocument :
            this.parent.getDocument();
        let tooltipTarget: HTMLElement;
        const tooltipTargetItem: ToolsItem = args.item as ToolsItem;
        if (item.command === 'Lists') {
            if (item.subCommand === 'UL') {
                tooltipTarget = currentDocument.querySelector('.e-rte-bulletformatlist-dropdown');
            }
            else {
                tooltipTarget = currentDocument.querySelector('.e-rte-numberformatlist-dropdown');
            }
        }
        else {
            tooltipTarget = currentDocument.querySelector('.' + tooltipTargetItem.icon);
        }
        this.hideTooltip({ target: tooltipTarget, isButton: true });
    }
    private handleFormatPainterClick(args: ClickEventArgs): void {
        if ((args.originalEvent as MouseEventArgs).detail === 1) {
            clearTimeout(this.clickTimeout);
            this.clickTimeout = setTimeout(() => {
                this.parent.observer.notify(events.formatPainterClick, {
                    member: 'formatPainter', args: args
                });
            }, 200);
        } else {
            clearTimeout(this.clickTimeout);
            this.parent.observer.notify(events.formatPainterDoubleClick, {
                member: 'formatPainter', args: args
            });
        }
    }
    private hideTooltip(args: { [key: string]: HTMLElement | boolean }): void {
        const currentDocument: Document = this.parent.iframeSettings.enable ? this.parent.getPanel().ownerDocument :
            this.parent.getDocument();
        this.tooltipTargetElement = closest(args.target as HTMLElement, '[data-tooltip-id]');
        if (!isNullOrUndefined(this.tooltipTargetElement) && !isNullOrUndefined(currentDocument.querySelector('.e-tooltip-wrap'))) {
            this.tooltipTargetElement.setAttribute('data-title', this.tooltipTargetElement.getAttribute('title'));
            if (args.isButton) {
                EventHandler.add(this.tooltipTargetElement, 'mouseout', this.mouseOutEventHandler, this);
            }
            const mouseLeaveEvent: MouseEvent = new MouseEvent('mouseout', { bubbles: true, cancelable: true, view: window, relatedTarget: document.body });
            this.tooltipTargetElement.dispatchEvent(mouseLeaveEvent);
        }
    }
    private mouseOutEventHandler(): void {
        if (!isNullOrUndefined(this.tooltipTargetElement)) {
            EventHandler.remove(this.tooltipTargetElement, 'mouseout', this.mouseOutEventHandler);
        }
        else {
            const currentDocument: Document = this.parent.iframeSettings.enable ? this.parent.getPanel().ownerDocument :
                this.parent.getDocument();
            this.tooltipTargetElement = currentDocument.querySelector('[data-title]');
            this.tooltipTargetElement.setAttribute('title', this.tooltipTargetElement.getAttribute('data-title'));
        }
        this.tooltipTargetElement.removeAttribute('data-title');
    }
    /**
     * Renders the editor component and sets up formatter, toolbar, and styles.
     *
     * @returns {void} - No return value.
     */
    private render(): void {
        const editElement: HTMLTextAreaElement = this.parent.getEditPanel() as HTMLTextAreaElement;
        const options: { [key: string]: number } = {
            undoRedoSteps: this.parent.undoRedoSteps,
            undoRedoTimer: this.parent.undoRedoTimer
        };

        this.initializeFormatter(editElement, options);
        this.setupToolbar();
        this.applyInlineStyles(editElement);
        this.parent.observer.notify(events.bindOnEnd, {});
    }

    /* Initializes the formatter for the editor */
    private initializeFormatter(editElement: HTMLTextAreaElement, options: { [key: string]: number }): void {
        const formatterSettings: {
            currentDocument: Document;
            element: HTMLTextAreaElement;
            options: { [key: string]: number };
            formatPainterSettings: FormatPainterSettingsModel;
        } = {
            currentDocument: this.parent.getDocument(),
            element: editElement,
            options,
            formatPainterSettings: this.parent.formatPainterSettings
        };

        if (isNullOrUndefined(this.parent.formatter)) {
            this.parent.formatter = new HTMLFormatter(formatterSettings);
        } else {
            this.parent.formatter.updateFormatter(
                editElement,
                this.contentRenderer.getDocument(),
                options,
                this.parent.formatPainterSettings
            );
        }
    }

    /* Sets up the toolbar for the editor if enabled */
    private setupToolbar(): void {
        if (this.parent.toolbarSettings.enable) {
            this.toolbarUpdate = new HtmlToolbarStatus(this.parent);
        }
    }

    /* Applies inline styles based on configuration */
    private applyInlineStyles(editElement: HTMLTextAreaElement): void {
        if (this.parent.inlineMode.enable) {
            const { fontFamily, fontSize } = this.parent;
            if (!isNullOrUndefined(fontFamily.default)) {
                editElement.style.fontFamily = fontFamily.default;
            }
            if (!isNullOrUndefined(fontSize.default)) {
                editElement.style.fontSize = fontSize.default;
            }
        }
    }
    private selectAll(): void {
        const nodes: Node[] = getTextNodesUnder(
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
            this.parent.getDocument()
        ).toString());
    }
    private removeEventListener(): void {
        this.parent.observer.off(events.initialEnd, this.render);
        this.parent.observer.off(events.htmlToolbarClick, this.onToolbarClick);
        this.parent.observer.off(events.destroy, this.destroy);
        this.parent.observer.off(events.keyDown, this.onKeyDown);
        this.parent.observer.off(events.keyUp, this.onKeyUp);
        this.parent.observer.off(events.selectAll, this.selectAll);
        this.parent.observer.off(events.selectRange, this.selectRange);
        this.parent.observer.off(events.getSelectedHtml, this.getSelectedHtml);
        this.parent.observer.off(events.selectionSave, this.onSelectionSave);
        this.parent.observer.off(events.selectionRestore, this.onSelectionRestore);
        this.parent.observer.off(events.readOnlyMode, this.updateReadOnly);
        this.parent.observer.off(events.paste, this.onPaste);
        this.parent.observer.off(events.tableclass, this.isTableClassAdded);
        this.parent.observer.off(events.hideToolTip, this.hideTooltip);
        this.parent.observer.off(events.beforeDropDownClose, this.mouseOutEventHandler);
    }
    public destroy(): void {
        this.removeEventListener();
    }

    private tableSelectionKeyAction(e: NotifyArgs): void {
        const args: KeyboardEvent = e.args as KeyboardEvent;
        // Handle the space, enter and backspace keys when the table cells are selected.
        const tableCellSelectNodes: NodeListOf<Element> = this.parent.inputElement.querySelectorAll('.e-cell-select');
        for (let i: number = 0; i < tableCellSelectNodes.length; i++) {
            const currentCell: Element = tableCellSelectNodes[i as number];
            removeClassWithAttr([currentCell as HTMLElement], ['e-cell-select', 'e-multi-cells-select', 'e-cell-select-end']);
            if (i === 0) {
                if (args.keyCode === 32) {
                    currentCell.innerHTML = '&#8203;<br>';
                } else {
                    currentCell.innerHTML = '<br>';
                }
                this.nodeSelectionObj.setCursorPoint(this.parent.getDocument(), currentCell.firstChild as Element, 0);
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
