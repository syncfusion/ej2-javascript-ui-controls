// tslint:disable-next-line:max-line-length
import { LayoutViewer, ContextElementInfo, TextPosition, ElementInfo, ErrorInfo, WCharacterFormat, SpecialCharacterInfo, SpaceCharacterInfo, TextSearchResults, TextInLineInfo, TextSearchResult, MatchResults } from '../index';
import { Dictionary } from '../../base/dictionary';
import { ElementBox, TextElementBox, ErrorTextElementBox, LineWidget, TableCellWidget } from '../viewer/page';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { BaselineAlignment } from '../../base/types';
/**
 * The spell checker module
 */
export class SpellChecker {

    private langIDInternal: number = 0;
    private spellSuggestionInternal: boolean = true;
    /**
     * @private
     */
    public errorWordCollection: Dictionary<string, ElementBox[]>;
    /**
     * @private
     */
    public ignoreAllItems: string[];
    /**
     * @private
     */
    public viewer: LayoutViewer;
    /**
     * @private
     */
    public currentContextInfo: ContextElementInfo;
    private removeUnderlineInternal: boolean = false;
    private spellCheckSuggestion: string[];
    /**
     * @private
     */
    public errorSuggestions: Dictionary<string, string[]>;
    /**
     * Gets module name.
     */
    private getModuleName(): string {
        return 'SpellChecker';
    }

    /**
     * Gets the languageID.
     * @aspType int
     * @blazorType int
     */
    public get languageID(): number {
        return isNullOrUndefined(this.langIDInternal) ? 0 : this.langIDInternal;
    }
    /**
     * Sets the languageID.
     * @aspType int
     * @blazorType int
     */
    public set languageID(value: number) {
        this.langIDInternal = value;
    }
    /**
     * Getter indicates whether suggestion enabled.
     * @aspType bool
     * @blazorType bool
     */
    public get allowSpellCheckAndSuggestion(): boolean {
        return this.spellSuggestionInternal;
    }
    /**
     * Setter to enable or disable suggestion
     * @aspType bool
     * @blazorType bool 
     */
    public set allowSpellCheckAndSuggestion(value: boolean) {
        this.spellSuggestionInternal = value;
    }
    /**
     * Getter indicates whether underline removed for mis-spelled word.
     * @aspType bool
     * @blazorType bool
     */
    public get removeUnderline(): boolean {
        return this.removeUnderlineInternal;
    }
    /**
     * Setter to enable or disable underline for mis-spelled word
     * @aspType bool
     * @blazorType bool
     */
    public set removeUnderline(value: boolean) {
        this.removeUnderlineInternal = value;
    }
    /**
     *
     */
    constructor(viewer: LayoutViewer) {
        this.viewer = viewer;
        this.errorWordCollection = new Dictionary<string, ElementBox[]>();
        this.errorSuggestions = new Dictionary<string, string[]>();
        this.ignoreAllItems = [];
    }
    /**
     * Method to manage replace logic
     * @private
     */
    public manageReplace(content: string, dialogElement?: ElementBox): void {
        this.viewer.triggerSpellCheck = true;
        let exactText: string = '';
        let elementInfo: ElementInfo;
        if (!isNullOrUndefined(dialogElement) && dialogElement instanceof ErrorTextElementBox) {
            let exactText: string = (dialogElement as ErrorTextElementBox).text;
            this.viewer.selection.start = (dialogElement as ErrorTextElementBox).start;
            this.viewer.selection.end = (dialogElement as ErrorTextElementBox).end;
            if (content !== 'Ignore Once') {
                content = this.manageSpecialCharacters(exactText, content);
                this.viewer.owner.editor.insertTextInternal(content, true);
                this.viewer.selection.start = this.viewer.selection.end;
                this.viewer.clearSelectionHighlight();
                return;
            } else {
                this.currentContextInfo = { 'text': exactText, 'element': dialogElement };
            }
        }
        if (!isNullOrUndefined(this.currentContextInfo) && this.currentContextInfo.element && content !== 'Ignore Once') {
            let elementBox: ElementBox = this.currentContextInfo.element;
            exactText = (this.currentContextInfo.element as TextElementBox).text;

            this.viewer.selection.start = (elementBox as ErrorTextElementBox).start;
            this.viewer.selection.end = (elementBox as ErrorTextElementBox).end;
        } else {
            this.handleReplace(content);
        }
        if (content !== 'Ignore Once') {
            this.viewer.owner.editor.insertTextInternal(content, true);
            if (!isNullOrUndefined(this.currentContextInfo)) {
                this.removeErrorsFromCollection(this.currentContextInfo);
            }
            this.viewer.selection.start = this.viewer.selection.end;
            this.viewer.clearSelectionHighlight();
        }
        //this.viewer.owner.errorWordCollection.remove(content);
        this.viewer.triggerSpellCheck = false;
    }
    /**
     * Method to handle replace logic
     * @param {string} content 
     * @private
     */
    public handleReplace(content: string): void {
        let startPosition: TextPosition = this.viewer.selection.start;
        let offset: number = startPosition.offset;
        let startIndex: number = 0;
        let startInlineObj: ElementInfo = (startPosition.currentWidget as LineWidget).getInline(offset, startIndex, false, true);
        let startOffset: number = startInlineObj.element.line.getOffset(startInlineObj.element, 0) + startInlineObj.element.length;
        if (startOffset === offset) {
            this.retrieveExactElementInfo(startInlineObj);
        }
        let exactText: string = (startInlineObj.element as TextElementBox).text;
        // tslint:disable-next-line:max-line-length
        let startPattern: RegExp = new RegExp('^[#\\@\\!\\~\\$\\%\\^\\&\\*\\(\\)\\-\\_\\+\\=\\{\\}\\[\\]\\:\\;\\"\'\\,\\<\\.\\>\\/\\?\\`\\s]+', 'g');
        let matches: RegExpExecArray[] = [];
        let matchInfo: RegExpExecArray;
        //tslint:disable no-conditional-assignment
        while (!isNullOrUndefined(matchInfo = startPattern.exec(exactText))) {
            matches.push(matchInfo);
        }
        if (content === 'Ignore Once') {
            this.handleIgnoreOnce(startInlineObj);
            return;
        }
        startPosition.offset = offset - startInlineObj.index;
        if (!isNullOrUndefined(matches) && matches.length > 0) {
            startPosition.offset += matches[0].toString().length;
        }
        // tslint:disable-next-line:max-line-length
        startPosition.location = this.viewer.owner.selection.getPhysicalPositionInternal((startPosition.currentWidget as LineWidget), startPosition.offset, true);
        // tslint:disable-next-line:max-line-length
        startPosition = this.viewer.owner.searchModule.textSearch.getTextPosition(startPosition.currentWidget as LineWidget, startPosition.offset.toString());
        //startPosition.location = this.owner.selection.getPhysicalPositionInternal(span.line, offset, true);
        startPosition.setPositionParagraph(startPosition.currentWidget as LineWidget, startPosition.offset);
        let index: number = (startPosition.offset + (startInlineObj.element as TextElementBox).length) - startPosition.offset;
        let endOffset: number = (startPosition.currentWidget as LineWidget).getOffset(startInlineObj.element, index);
        let lineWidget: LineWidget = startPosition.currentWidget as LineWidget;
        // tslint:disable-next-line:max-line-length
        let endPattern: RegExp = new RegExp('[#\\@\\!\\~\\$\\%\\^\\&\\*\\(\\)\\-\\_\\+\\=\\{\\}\\[\\]\\:\\;\\"\'\\,\\<\\.\\>\\/\\?\\s\\`]+$', 'g');
        matches = [];
        //tslint:disable no-conditional-assignment
        while (!isNullOrUndefined(matchInfo = endPattern.exec(exactText))) {
            matches.push(matchInfo);
        }
        if (!isNullOrUndefined(matches) && matches.length > 0) {
            endOffset -= matches[0].toString().length;
        }
        // tslint:disable-next-line:max-line-length
        this.viewer.selection.end = this.viewer.owner.searchModule.textSearch.getTextPosition(lineWidget, endOffset.toString());
        // tslint:disable-next-line:max-line-length
        this.viewer.selection.end.location = this.viewer.owner.selection.getPhysicalPositionInternal((startPosition.currentWidget as LineWidget), endOffset, true);
        this.viewer.selection.end.setPositionParagraph(lineWidget, endOffset);
        this.currentContextInfo = { 'element': startInlineObj.element, 'text': (startInlineObj.element as TextElementBox).text };
    }

    /**
     * Method to retrieve exact element info
     * @param {ElementInfo} startInlineObj 
     * @private
     */
    public retrieveExactElementInfo(startInlineObj: ElementInfo): void {
        let nextElement: ElementBox = startInlineObj.element.nextElement;
        // tslint:disable-next-line:max-line-length
        startInlineObj.element = (!isNullOrUndefined(nextElement) && nextElement instanceof TextElementBox) ? startInlineObj.element.nextElement : startInlineObj.element;
    }

    /**
     * Method to handle to ignore error Once 
     * @param {ElementInfo} startInlineObj 
     * @private
     */
    public handleIgnoreOnce(startInlineObj: ElementInfo): void {
        let textElement: TextElementBox = (startInlineObj.element as TextElementBox);
        let exactText: string = '';
        if (!isNullOrUndefined(this.currentContextInfo) && this.currentContextInfo.element) {
            exactText = (this.currentContextInfo.element as TextElementBox).text;
        } else {
            exactText = textElement.text;
        }
        exactText = this.manageSpecialCharacters(exactText, undefined, true);
        if (textElement.ignoreOnceItems.indexOf(exactText) === -1) {
            textElement.ignoreOnceItems.push(exactText);
        }
        this.viewer.owner.editor.reLayout(this.viewer.selection);
    }

    /**
     * Method to handle ignore all items
     * @private
     */
    public handleIgnoreAllItems(contextElement?: ContextElementInfo): void {
        let contextItem: ContextElementInfo = (!isNullOrUndefined(contextElement)) ? contextElement : this.retriveText();
        let retrievedText: string = this.manageSpecialCharacters(contextItem.text, undefined, true);
        if (this.ignoreAllItems.indexOf(retrievedText) === -1) {
            this.ignoreAllItems.push(retrievedText);
            this.removeErrorsFromCollection(contextItem);
            this.viewer.triggerSpellCheck = true;
            this.viewer.owner.editor.reLayout(this.viewer.selection);
            this.viewer.triggerSpellCheck = false;
            this.viewer.clearSelectionHighlight();
        }
    }

    /**
     * Method to handle dictionary
     * @private
     */
    public handleAddToDictionary(contextElement?: ContextElementInfo): void {
        let contextItem: ContextElementInfo = (!isNullOrUndefined(contextElement)) ? contextElement : this.retriveText();
        let retrievedText: string = this.manageSpecialCharacters(contextItem.text, undefined, true);
        // tslint:disable-next-line:max-line-length
        /* tslint:disable:no-any */
        this.CallSpellChecker(this.languageID, retrievedText, false, false, true).then((data: any) => {
            this.viewer.triggerSpellCheck = true;
            this.removeErrorsFromCollection(contextItem);
            this.ignoreAllItems.push(retrievedText);
            this.viewer.owner.editor.reLayout(this.viewer.selection, true);
            this.viewer.triggerSpellCheck = false;
        });
    }
    /**
     * Method to append/remove special characters
     * @param {string} exactText 
     * @param {boolean} isRemove 
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public manageSpecialCharacters(exactText: string, replaceText: string, isRemove?: boolean): string {
        if (!isNullOrUndefined(exactText)) {
            if (isNullOrUndefined(replaceText)) {
                replaceText = exactText;
            }
            // tslint:disable-next-line:max-line-length
            let pattern: RegExp = new RegExp('^[#\\@\\!\\~\\$\\%\\^\\&\\*\\(\\)\\-\\_\\+\\=\\{\\}\\[\\]\\:\\;\\"\'\\,\\<\\.\\>\\/\\?\\`\\s]+', 'g');
            let matches: RegExpExecArray[] = [];
            let matchInfo: RegExpExecArray;
            //tslint:disable no-conditional-assignment
            while (!isNullOrUndefined(matchInfo = pattern.exec(exactText))) {
                matches.push(matchInfo);
            }

            if (matches.length > 0) {
                for (let i: number = 0; i < matches.length; i++) {
                    /* tslint:disable:no-any */
                    let match: any[] = matches[i];
                    replaceText = (!isRemove) ? match[0] + replaceText : replaceText.replace(match[0], '');
                }
            }
            // tslint:disable-next-line:max-line-length
            let endPattern: RegExp = new RegExp('[#\\@\\!\\~\\$\\%\\^\\&\\*\\(\\)\\-\\_\\+\\=\\{\\}\\[\\]\\:\\;\\"\'\\,\\<\\.\\>\\/\\?\\s\\`]+$', 'g');
            matches = [];
            //tslint:disable no-conditional-assignment
            while (!isNullOrUndefined(matchInfo = endPattern.exec(exactText))) {
                matches.push(matchInfo);
            }

            if (matches.length > 0) {
                for (let i: number = 0; i < matches.length; i++) {
                    /* tslint:disable:no-any */
                    let match: any[] = matches[i];
                    replaceText = (!isRemove) ? replaceText + match[0] : replaceText.replace(match[0], '');
                }
            }
        }

        return replaceText;
    }
    /**
     * Method to remove errors
     * @param {ContextElementInfo} contextItem 
     * @private
     */
    public removeErrorsFromCollection(contextItem: ContextElementInfo): void {
        if (this.errorWordCollection.containsKey(contextItem.text)) {
            let textElement: ElementBox[] = this.errorWordCollection.get(contextItem.text);
            if (textElement.indexOf(contextItem.element) >= 0) {
                textElement.splice(0, 1);
            }
            if (textElement.length === 0) {
                this.errorWordCollection.remove(contextItem.text);
            }
        }
    }

    /**
     * Method to retrieve exact text
     * @private
     */
    public retriveText(): ContextElementInfo {
        let exactText: string;
        let currentElement: ElementBox;
        if (!isNullOrUndefined(this.currentContextInfo) && this.currentContextInfo.element) {
            currentElement = this.currentContextInfo.element;
            exactText = (this.currentContextInfo.element as TextElementBox).text;
            this.viewer.selection.start = (currentElement as ErrorTextElementBox).start;
            this.viewer.selection.end = (currentElement as ErrorTextElementBox).end;
        } else {
            let startPosition: TextPosition = this.viewer.selection.start;
            let offset: number = startPosition.offset;
            let startIndex: number = 0;
            let startInlineObj: ElementInfo = (startPosition.currentWidget as LineWidget).getInline(offset, startIndex);
            currentElement = startInlineObj.element;
            exactText = (startInlineObj.element as TextElementBox).text;
        }

        return { 'text': exactText, 'element': currentElement };
    }
    /**
     * Method to handle suggestions
     * @param {any} jsonObject 
     * @param {PointerEvent} event 
     * @private
     */
    /* tslint:disable:no-any */
    public handleSuggestions(allsuggestions: any, event: PointerEvent): string[] {
        this.spellCheckSuggestion = [];
        if (allsuggestions.length === 0) {
            this.spellCheckSuggestion.push('Add To Dictionary');
        } else {
            // tslint:disable-next-line:max-line-length
            allsuggestions = (allsuggestions.length === 5) ? this.constructInlineMenu(allsuggestions) : allsuggestions;
            this.spellCheckSuggestion.push('Add To Dictionary');
        }
        /* tslint:disable:no-any */
        let spellSuggestion: any = [];
        if (this.spellCheckSuggestion.length > 0) {
            for (let str of this.spellCheckSuggestion) {
                spellSuggestion.push(
                    {
                        text: str,
                        id: this.viewer.owner.element.id + '_contextmenu_otherSuggestions_spellcheck_' + str,
                        iconCss: ''
                    });

            }
        }

        return spellSuggestion;
    }

    /**
     * Method to check whether text element has errors
     * @param {string} text 
     * @param {any} element 
     * @param {number} left 
     * @private
     */
    public checktextElementHasErrors(text: string, element: any, left: number): ErrorInfo {
        let hasError: boolean = false;
        let erroElements: any[] = [];
        text = text.replace(/[\s]+/g, '');
        if (!isNullOrUndefined(element.errorCollection) && element.errorCollection.length > 0) {
            // tslint:disable-next-line:max-line-length
            if (!this.viewer.isScrollHandler && (element.ischangeDetected || element.paragraph.isChangeDetected)) {
                this.updateStatusForGlobalErrors(element.errorCollection, element);
                element.errorCollection = [];
                element.ischangeDetected = true;
                return { 'errorFound': hasError, 'elements': erroElements };
            }
            for (let i: number = 0; i < element.errorCollection.length; i++) {
                if (this.handleErrorCollection(element.errorCollection[i])) {
                    hasError = true;
                    erroElements.push(element.errorCollection[i]);
                }
            }
        } else if (!this.viewer.isScrollHandler && element.paragraph.isChangeDetected) {
            element.ischangeDetected = true;
        } else if (!element.ischangeDetected && this.handleErrorCollection(element)) {
            hasError = true;
            erroElements.push(element);
        }
        return { 'errorFound': hasError, 'elements': erroElements };
    }

    /**
     * Method to update status for error elements
     * @param {ErrorTextElementBox[]} erroElements 
     */
    private updateStatusForGlobalErrors(erroElements: ErrorTextElementBox[], parentElement: ElementBox): void {
        if (erroElements.length > 0) {
            for (let i: number = 0; i < erroElements.length; i++) {
                let exactText: string = this.manageSpecialCharacters(erroElements[i].text, undefined, true);
                if (this.errorWordCollection.containsKey(exactText)) {
                    let elements: ElementBox[] = this.errorWordCollection.get(exactText);
                    for (let j: number = 0; j < elements.length; j++) {
                        if (elements[j] instanceof ErrorTextElementBox && elements[j] === erroElements[i]) {
                            elements[j].ischangeDetected = true;
                            // tslint:disable-next-line:max-line-length
                            (elements[j] as ErrorTextElementBox).start.offset = parentElement.line.getOffset((parentElement as TextElementBox).istextCombined ? this.getCombinedElement(parentElement) : parentElement, 0);
                            elements[j].line = parentElement.line;
                            break;
                        }
                    }
                }
            }
        }
    }

    /**
     * Method to handle document error collection.
     * @param {string} errorInElement 
     * @private
     */
    public handleErrorCollection(errorInElement: TextElementBox): boolean {
        let errors: Dictionary<string, ElementBox[]> = this.errorWordCollection;
        let exactText: string = this.manageSpecialCharacters(errorInElement.text, undefined, true);
        if (errors.containsKey(exactText) && errorInElement.length > 1) {
            let ignoreAllIndex: number = this.ignoreAllItems.indexOf(exactText);
            if (ignoreAllIndex > -1) {
                if (errors.containsKey(exactText)) {
                    errors.remove(exactText);
                }
                return false;
            }
            return true;
        }

        return false;
    }
    /**
     * Method to construct inline menu
     */
    /* tslint:disable:no-any */
    private constructInlineMenu(inlineSuggestion: any[]): any[] {
        /* tslint:disable:no-any */
        for (let i: number = inlineSuggestion.length - 1; i > 0; i--) {
            if (inlineSuggestion.length > 3) {
                this.spellCheckSuggestion.push(inlineSuggestion[i]);
                inlineSuggestion.pop();
            }
        }

        return inlineSuggestion;
    }
    /**
     * Method to retrieve error element text
     * @private
     */
    public findCurretText(): ContextElementInfo {
        let insertPosition: TextPosition = this.viewer.selection.start;
        /* tslint:disable:no-any */
        let element: any;
        /* tslint:disable:no-any */
        let inlineObj: any = insertPosition.currentWidget.getInline(this.viewer.selection.start.offset, 0);
        let text: string;
        if (!isNullOrUndefined(inlineObj.element)) {
            if (!isNullOrUndefined(inlineObj.element.errorCollection) && inlineObj.element.errorCollection.length > 0) {
                for (let i: number = 0; i < inlineObj.element.errorCollection.length; i++) {
                    let errorElement: ErrorTextElementBox = inlineObj.element.errorCollection[i];
                    // tslint:disable-next-line:max-line-length
                    if (errorElement.start.location.x <= insertPosition.location.x && errorElement.end.location.x >= insertPosition.location.x) {
                        text = errorElement.text;
                        element = errorElement;
                        break;
                    }
                }
            } else {
                text = inlineObj.element.text;
            }

            if (text === ' ') {
                inlineObj = insertPosition.currentWidget.getInline(this.viewer.selection.start.offset + 1, 0);
                text = inlineObj.element.text;
            }
        }

        return { 'text': text, 'element': element };
    }

    /**
     * Method to add error word in document error collection
     * @param text 
     * @param element 
     */
    private addErrorCollection(text: string, elementToCompare: ElementBox, suggestions: string[]): void {
        text = this.manageSpecialCharacters(text, undefined, true);
        if (this.errorWordCollection.containsKey(text)) {
            let errorElements: ElementBox[] = this.errorWordCollection.get(text);
            if (elementToCompare instanceof ErrorTextElementBox) {
                if (!this.compareErrorTextElement(elementToCompare, errorElements)) {
                    errorElements.push(elementToCompare);
                }
            } else if (elementToCompare instanceof TextElementBox) {
                if (!this.compareTextElement(elementToCompare, errorElements)) {
                    errorElements.push(elementToCompare);
                }
            }
        } else {
            if (!isNullOrUndefined(suggestions) && suggestions.length > 0) {
                this.errorSuggestions.add(text, suggestions);
            }
            this.errorWordCollection.add(text, [elementToCompare]);
        }
    }

    /**
     * Method to compare error text elements
     * @param {ErrorTextElementBox} errorElement 
     * @param {ElementBox[]} errorCollection 
     */
    private compareErrorTextElement(errorElement: ErrorTextElementBox, errorCollection: ElementBox[]): boolean {
        let copyElement: ElementBox[] = [];
        let isChanged: boolean = false;
        for (let i: number = 0; i < errorCollection.length; i++) {
            copyElement.push(errorCollection[i]);
        }
        let length: number = errorCollection.length;
        for (let i: number = 0; i < length; i++) {
            if (copyElement[i] instanceof ErrorTextElementBox) {
                if (copyElement[i].ischangeDetected) {
                    let exactText: string = this.manageSpecialCharacters((copyElement[i] as TextElementBox).text, undefined, true);
                    isChanged = true;
                    // tslint:disable-next-line:max-line-length
                    this.removeErrorsFromCollection({ 'element': copyElement[i], 'text': exactText });
                } else {
                    let currentElement: ErrorTextElementBox = copyElement[i] as ErrorTextElementBox;
                    // tslint:disable-next-line:max-line-length
                    if (errorElement.start.offset === currentElement.start.offset && errorElement.end.offset === currentElement.end.offset) {
                        return true;
                    }
                }
            }
        }

        if (isChanged) {
            // tslint:disable-next-line:max-line-length
            this.errorWordCollection.add(this.manageSpecialCharacters(errorElement.text, undefined, true), [errorElement]);
        }

        return false;
    }

    /**
     * Method to compare text elements
     * @param {TextElementBox} errorElement 
     * @param {ElementBox[]} errorCollection 
     * @private
     */
    public compareTextElement(errorElement: TextElementBox, errorCollection: ElementBox[]): boolean {
        for (let i: number = 0; i < errorCollection.length; i++) {
            if (errorCollection[i] instanceof TextElementBox) {
                let currentElement: TextElementBox = errorCollection[i] as TextElementBox;
                if (currentElement === errorElement) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Method to handle Word by word spell check
     * @param {any} jsonObject 
     *  @param {TextElementBox} elementBox 
     * @param {number} left 
     * @param {number} top 
     * @param {number} underlineY 
     * @param {BaselineAlignment} baselineAlignment 
     * @param {boolean} isSamePage 
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public handleWordByWordSpellCheck(jsonObject: any, elementBox: TextElementBox, left: number, top: number, underlineY: number, baselineAlignment: BaselineAlignment, isSamePage: boolean): void {
        if (jsonObject.HasSpellingError && isSamePage) {
            this.addErrorCollection(elementBox.text, elementBox, jsonObject.Suggestions);
             // tslint:disable-next-line:max-line-length
            let backgroundColor: string = (elementBox.line.paragraph.containerWidget instanceof TableCellWidget) ? (elementBox.line.paragraph.containerWidget as TableCellWidget).cellFormat.shading.backgroundColor : this.viewer.backgroundColor;
            this.viewer.render.renderWavyline(elementBox, left, top, underlineY, '#FF0000', 'Single', baselineAlignment, backgroundColor);
            elementBox.isSpellChecked = true;
        } else {
            elementBox.isSpellChecked = true;
        }
    }

    /**
     * Method to check errors for combined elements
     * @param {TextElementBox} elementBox 
     * @param {number} underlineY 
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public checkElementCanBeCombined(elementBox: TextElementBox, underlineY: number, beforeIndex: number, callSpellChecker: boolean): boolean {
        let currentText: string = '';
        let isCombined: boolean = false;
        let combinedElements: TextElementBox[] = [];
        let line: LineWidget = this.viewer.selection.getLineWidget(elementBox, 0);
        let index: number = line.children.indexOf(elementBox);
        let prevText: string = elementBox.text;
        combinedElements.push(elementBox);
        for (let i: number = index - 1; i >= 0; i--) {
            if (line.children[i] instanceof TextElementBox) {
                let textElement: TextElementBox = line.children[i] as TextElementBox;
                if (prevText.indexOf(' ') !== 0 && textElement.text.lastIndexOf(' ') !== textElement.text.length - 1) {
                    currentText = textElement.text + currentText;
                    prevText = textElement.text;
                    combinedElements.push(textElement);
                    isCombined = true;
                } else if (!isNullOrUndefined(textElement)) {
                    break;
                }
            }
        }

        currentText += elementBox.text;
        let nextText: string = elementBox.text;
        for (let i: number = index + 1; i < line.children.length; i++) {
            if (line.children[i] instanceof TextElementBox) {
                let element: TextElementBox = (line.children[i] as TextElementBox);
                if (nextText.lastIndexOf(' ') !== nextText.length - 1 && element.text.indexOf(' ') !== 0) {
                    currentText += element.text;
                    nextText = element.text;
                    combinedElements.push(element);
                    isCombined = true;
                } else if (!isNullOrUndefined(element)) {
                    break;
                }
            }
        }

        if (isCombined && callSpellChecker && !this.checkCombinedElementsBeIgnored(combinedElements, currentText)) {
            this.handleCombinedElements(elementBox, currentText, underlineY, beforeIndex);
        }

        return isCombined;
    }

    /**
     * Method to handle combined elements
     * @param {TextElementBox} elementBox 
     * @param {string} currentText 
     * @param {number} underlineY 
     * @param {number} beforeIndex 
     * @private
     */
    public handleCombinedElements(elementBox: TextElementBox, currentText: string, underlineY: number, beforeIndex: number): void {
        elementBox.istextCombined = true;
        let splittedText: any[] = currentText.split(/[\s]+/);
        if (this.ignoreAllItems.indexOf(currentText) === -1 && elementBox.ignoreOnceItems.indexOf(currentText) === -1) {
            if (splittedText.length > 1) {
                for (let i: number = 0; i < splittedText.length; i++) {
                    let currentText: string = splittedText[i];
                    // tslint:disable-next-line:max-line-length
                    this.viewer.render.handleUnorderdElements(currentText, elementBox, underlineY, i, 0, i === splittedText.length - 1, beforeIndex);
                }
            } else {
                this.viewer.render.handleUnorderdElements(currentText, elementBox, underlineY, 0, 0, true, beforeIndex);
            }
        }
    }

    /**
     * Method to check error element collection has unique element
     * @param {ErrorTextElementBox[]} errorCollection 
     * @param {ErrorTextElementBox} elementToCheck 
     * @private
     */
    public CheckArrayHasSameElement(errorCollection: ErrorTextElementBox[], elementToCheck: ErrorTextElementBox): boolean {
        for (let i: number = 0; i < errorCollection.length; i++) {
            let errorText: ErrorTextElementBox = errorCollection[i];
            // tslint:disable-next-line:max-line-length
            if ((errorText.start.location.x === elementToCheck.start.location.x) && (errorText.start.location.y === elementToCheck.start.location.y)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Method to handle splitted and combined words for spell check.
     * @param {any} jsonObject 
     * @param {string} currentText 
     * @param {ElementBox} elementBox 
     * @param {boolean} isSamePage 
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public handleSplitWordSpellCheck(jsonObject: any, currentText: string, elementBox: TextElementBox, isSamePage: boolean, underlineY: number, iteration: number, markIndex: number, isLastItem?: boolean): void {
        if (jsonObject.HasSpellingError && elementBox.text !== ' ' && isSamePage) {
            let matchResults: MatchResults = this.getMatchedResultsFromElement(elementBox, currentText);
            // tslint:disable-next-line:max-line-length
            markIndex = (elementBox.istextCombined) ? elementBox.line.getOffset(this.getCombinedElement(elementBox), 0) : markIndex;
            // tslint:disable-next-line:max-line-length
            this.viewer.owner.searchModule.textSearch.updateMatchedTextLocation(matchResults.matches, matchResults.textResults, matchResults.elementInfo, 0, elementBox, false, null, markIndex);
            this.handleMatchedResults(matchResults.textResults, elementBox, underlineY, iteration, jsonObject.Suggestions, isLastItem);
        } else if (isLastItem) {
            elementBox.isSpellChecked = true;
        }
    }

    /**
     * Method to include matched results in element box and to render it
     * @param {TextSearchResults} results 
     * @param {TextElementBox} elementBox 
     * @param {number} wavyLineY 
     * @param {number} index 
     */
    // tslint:disable-next-line:max-line-length
    private handleMatchedResults(results: TextSearchResults, elementBox: TextElementBox, wavyLineY: number, index: number, suggestions?: string[], isLastItem?: boolean): void {
        if (results.length === 0 && isLastItem) {
            elementBox.isSpellChecked = true;
            return;
        }

        for (let i: number = 0; i < results.length; i++) {
            let span: ErrorTextElementBox = this.createErrorElementWithInfo(results.innerList[i], elementBox);
            let color: string = '#FF0000';
            // tslint:disable-next-line:max-line-length
            if (!isNullOrUndefined(elementBox.errorCollection) && !this.CheckArrayHasSameElement(elementBox.errorCollection, span)) {
                elementBox.errorCollection.splice(index, 0, span);
            }
            this.addErrorCollection(span.text, span, suggestions);
            // tslint:disable-next-line:max-line-length
            let backgroundColor: string = (elementBox.line.paragraph.containerWidget instanceof TableCellWidget) ? (elementBox.paragraph.containerWidget as TableCellWidget).cellFormat.shading.backgroundColor : this.viewer.backgroundColor;
            this.viewer.render.renderWavyline(span, span.start.location.x, span.start.location.y - elementBox.margin.top, wavyLineY, color, 'Single', elementBox.characterFormat.baselineAlignment, backgroundColor);
            if (isLastItem) {
                elementBox.isSpellChecked = true;
            }
        }
    }
    /**
     * Calls the spell checker service
     * @param {number} languageID 
     * @param {string} word 
     * @param {boolean} checkSpellingAndSuggestion 
     * @param {boolean} addWord 
     * @private
     */
    /* tslint:disable:no-any */
    // tslint:disable-next-line:max-line-length
    public CallSpellChecker(languageID: number, word: string, checkSpelling: boolean, checkSuggestion: boolean, addWord?: boolean): Promise<any> {
        return new Promise((resolve: Function, reject: Function) => {
            if (!isNullOrUndefined(this)) {
                let httpRequest: XMLHttpRequest = new XMLHttpRequest();
                // tslint:disable-next-line:max-line-length
                httpRequest.open('POST', this.viewer.owner.serviceUrl + this.viewer.owner.serverActionSettings.spellCheck, true);
                httpRequest.setRequestHeader('Content-Type', 'application/json');
                httpRequest.onreadystatechange = () => {
                    if (httpRequest.readyState === 4) {
                        if (httpRequest.status === 200 || httpRequest.status === 304) {
                            resolve(httpRequest.response);
                        } else {
                            reject(httpRequest.response);
                        }
                    }
                };
                // tslint:disable-next-line:max-line-length
                /* tslint:disable:no-any */
                let spellCheckData: any = { LanguageID: languageID, TexttoCheck: word, CheckSpelling: checkSpelling, CheckSuggestion: checkSuggestion, AddWord: addWord };
                httpRequest.send(JSON.stringify(spellCheckData));
            }
        }
        );
    }
    /**
     * Method to check for next error
     * @private
     */
    public checkForNextError(): void {
        if (!isNullOrUndefined(this.viewer)) {
            let errorWords: Dictionary<string, ElementBox[]> = this.errorWordCollection;
            if (errorWords.length > 0) {
                for (let i: number = 0; i < errorWords.length; i++) {
                    let errorElements: ElementBox[] = errorWords.get(errorWords.keys[i]);
                    for (let j: number = 0; j < errorElements.length; j++) {
                        if (errorElements[j] instanceof ErrorTextElementBox && !errorElements[j].ischangeDetected) {
                            this.updateErrorElementTextBox(errorWords.keys[i], errorElements[j] as ErrorTextElementBox);
                        } else if (errorElements[j] instanceof TextElementBox) {
                            let matchResults: MatchResults = this.getMatchedResultsFromElement(errorElements[j]);
                            let results: TextSearchResults = matchResults.textResults;
                            // tslint:disable-next-line:max-line-length
                            let markIndex: number = (errorElements[j].ischangeDetected) ? (errorElements[j] as ErrorTextElementBox).start.offset : errorElements[j].line.getOffset(errorElements[j], 0);
                            // tslint:disable-next-line:max-line-length
                            this.viewer.owner.searchModule.textSearch.updateMatchedTextLocation(matchResults.matches, results, matchResults.elementInfo, 0, errorElements[j], false, null, markIndex);
                            for (let i: number = 0; i < results.length; i++) {
                                let element: ErrorTextElementBox = this.createErrorElementWithInfo(results.innerList[i], errorElements[j]);
                                this.updateErrorElementTextBox(element.text, element);
                                break;
                            }
                        }
                        break;
                    }
                    break;
                }
            } else {
                this.viewer.clearSelectionHighlight();
            }
        }
    }
    /**
     * Method to create error element with matched results
     * @param {TextSearchResult} result  
     * @param {ElementBox} errorElement 
     * @private
     */
    public createErrorElementWithInfo(result: TextSearchResult, errorElement: ElementBox): ErrorTextElementBox {
        let element: ErrorTextElementBox = new ErrorTextElementBox();
        element.text = result.text;
        element.start = result.start;
        element.end = result.end;
        element.height = errorElement.height;
        element.canTrigger = errorElement.canTrigger;
        element.characterFormat.copyFormat(errorElement.characterFormat);
        element.width = this.viewer.textHelper.getWidth(element.text, errorElement.characterFormat);
        return element;
    }
    /**
     * Method to get matched results from element box
     * @param {ElementBox} errorElement 
     * @private
     */
    public getMatchedResultsFromElement(errorElement: ElementBox, currentText?: string): MatchResults {
        let line: LineWidget = (errorElement as TextElementBox).line;
        // tslint:disable-next-line:max-line-length
        let pattern: RegExp = this.viewer.owner.searchModule.textSearch.stringToRegex((isNullOrUndefined(currentText)) ? (errorElement as TextElementBox).text : currentText, 'CaseSensitive');
        this.viewer.owner.searchModule.textSearchResults.clearResults();
        // tslint:disable-next-line:max-line-length
        let results: TextSearchResults = this.viewer.owner.searchModule.textSearchResults;
        let textLineInfo: TextInLineInfo = this.viewer.owner.searchModule.textSearch.getElementInfo(line.children[0], 0, false);
        let text: string = textLineInfo.fullText;
        let matches: RegExpExecArray[] = [];
        let spans: any = textLineInfo.elementsWithOffset;
        let matchObject: RegExpExecArray;
        //tslint:disable no-conditional-assignment
        while (!isNullOrUndefined(matchObject = pattern.exec(text))) {
            matches.push(matchObject);
        }
        return { 'matches': matches, 'elementInfo': spans, 'textResults': results };
    }
    /**
     * Method to update error element information
     * @param {string} error 
     * @param {ErrorTextElementBox} errorElement 
     * @private
     */
    public updateErrorElementTextBox(error: string, errorElement: ErrorTextElementBox): void {
        let element: ErrorTextElementBox = errorElement;
        this.viewer.clearSelectionHighlight();
        this.viewer.selection.start = element.start;
        this.viewer.selection.end = element.end;
        this.viewer.selection.highlight(errorElement.start.paragraph, errorElement.start, errorElement.end);
        this.viewer.owner.spellCheckDialog.updateSuggestionDialog(error, element);
    }

    /**
     * Method to retrieve space information in a text
     * @param {string} text 
     * @param {WCharacterFormat} characterFormat 
     * @private
     */
    public getWhiteSpaceCharacterInfo(text: string, characterFormat: WCharacterFormat): SpaceCharacterInfo {
        /* tslint:disable:no-any */
        let matchedText: any = [];
        let width: number = 0;
        let length: number = 0;
        matchedText = text.match(/[\s]+/);
        if (!isNullOrUndefined(matchedText) && matchedText.length > 0) {
            for (let i: number = 0; i < matchedText.length; i++) {
                width += this.viewer.textHelper.getWidth(matchedText[i], characterFormat);
                length += matchedText[i].length;
            }

        }
        return { 'width': width, 'wordLength': length, 'isBeginning': (!isNullOrUndefined(matchedText) && matchedText.index === 0) };
    }

    /**
     * Retrieve Special character info
     * @param {string} text 
     * @param {WCharacterFormat} characterFormat 
     * @private
     */
    public getSpecialCharactersInfo(text: string, characterFormat: WCharacterFormat): SpecialCharacterInfo {
        /* tslint:disable:no-any */
        let matchedText: any = [];
        let beginingwidth: number = 0;
        let endWidth: number = 0;
        let length: number = 0;
        matchedText = text.match(/^[\#\@\!\~\$\%\^\&\*\(\)\-\_\+\=\{\}\[\]\:\;\"\'\,\<\.\>\/\?\`]*/);
        for (let i: number = 0; i < matchedText.length; i++) {
            if (!isNullOrUndefined(matchedText[i]) && matchedText[i].length > 0) {
                beginingwidth = this.viewer.textHelper.getWidth(matchedText[i], characterFormat);
            }
            length = matchedText.length;
        }

        matchedText = text.match(/[\#\@\!\~\$\%\^\&\*\(\)\-\_\+\=\{\}\[\]\:\;\"\'\,\<\.\>\/\?\`]*$/);
        for (let i: number = 0; i < matchedText.length; i++) {
            if (!isNullOrUndefined(matchedText[i]) && matchedText[i].length > 0) {
                endWidth = this.viewer.textHelper.getWidth(matchedText[i], characterFormat);
            }
            length = matchedText.length;
        }
        return { 'beginningWidth': beginingwidth, 'endWidth': endWidth, 'wordLength': length };
    }

    /**
     * Method to retrieve next available combined element
     * @param {ElementBox} element 
     * @private
     */
    public getCombinedElement(element: ElementBox): ElementBox {
        let prevElement: ElementBox = element;
        while (!isNullOrUndefined(element) && element instanceof TextElementBox && (element as TextElementBox).istextCombined) {
            prevElement = element;
            element = element.previousElement;
        }

        return prevElement;
    }
    /**
     * Method to retrieve next available combined element
     * @param {ElementBox} element 
     */
    private checkCombinedElementsBeIgnored(elements: TextElementBox[], exactText: string): boolean {
        exactText = this.manageSpecialCharacters(exactText, undefined, true);
        for (let i: number = 0; i < elements.length; i++) {
            if (elements[i].ignoreOnceItems.indexOf(exactText) !== -1) {
                return true;
            }
        }

        return false;
    }
    /**
     * Method to update error collection
     * @param {TextElementBox} currentElement 
     * @param {TextElementBox} splittedElement
     * @private 
     */
    public updateSplittedElementError(currentElement: TextElementBox, splittedElement: TextElementBox): void {
        let errorCount: number = currentElement.errorCollection.length;
        if (errorCount > 0) {
            let errorCollection: ErrorTextElementBox[] = [];
            for (let i: number = 0; i < errorCount; i++) {
                errorCollection.push(currentElement.errorCollection[i]);
            }
            for (let i: number = 0; i < errorCount; i++) {
                if (currentElement.text.indexOf(errorCollection[i].text) === -1) {
                    splittedElement.ischangeDetected = true;
                    currentElement.errorCollection.splice(0, 1);
                }
            }
        }
    }
    /**
     * @private
     */
    public destroy(): void {
        this.errorWordCollection = undefined;
        this.ignoreAllItems = undefined;
        this.errorSuggestions = undefined;
    }

}