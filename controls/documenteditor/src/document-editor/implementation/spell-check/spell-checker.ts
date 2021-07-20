/* eslint-disable */
import { LayoutViewer, ContextElementInfo, TextPosition, ElementInfo, ErrorInfo, WCharacterFormat, SpecialCharacterInfo, SpaceCharacterInfo, TextSearchResults, TextInLineInfo, TextSearchResult, MatchResults, SfdtExport, TextExport, WordSpellInfo } from '../index';
import { Dictionary } from '../../base/dictionary';
import { ElementBox, TextElementBox, ErrorTextElementBox, LineWidget, TableCellWidget, Page, FieldElementBox } from '../viewer/page';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { BaselineAlignment } from '../../base/types';
import { DocumentHelper } from '../viewer';
/**
 * The spell checker module
 */
export class SpellChecker {

    private langIDInternal: number = 0;
    /**
     * Specifies whether spell check has to be performed or not.
     */
    private enableSpellCheckInternal: boolean = true;
    /**
     * @private
     */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    public uniqueSpelledWords: any = {};
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
    public documentHelper: DocumentHelper;
    /**
     * @private
     */
    public currentContextInfo: ContextElementInfo;
    /**
     * @private
     */
    public uniqueKey: string = '';
    private removeUnderlineInternal: boolean = false;
    private spellCheckSuggestion: string[];
    /**
     * @default 1000
     */
    private uniqueWordsCountInternal: number = 10000;
    /**
     * @private
     */
    public errorSuggestions: Dictionary<string, string[]>;

    private performOptimizedCheck: boolean = false;

    private textSearchResults: TextSearchResults;

    /**
     * Gets module name.
     */
    private getModuleName(): string {
        return 'SpellChecker';
    }

    /**
     * Gets the boolean indicating whether optimized spell check to be performed.
     *
     * @aspType bool
     * @returns {boolean} Returns enableOptimizedSpellCheck
     */
    public get enableOptimizedSpellCheck(): boolean {
        return this.performOptimizedCheck;
    }

    /**
     * Sets the boolean indicating whether optimized spell check to be performed.
     *
     * @aspType bool
     */
    public set enableOptimizedSpellCheck(value: boolean) {
        this.performOptimizedCheck = value;
    }

    /**
     * Gets the spell checked Unique words.
     *
     * @aspType int
     */
    public get uniqueWordsCount(): number {
        return isNullOrUndefined(this.uniqueWordsCountInternal) ? 0 : this.uniqueWordsCountInternal;
    }
    /**
     * Sets the spell checked Unique words.
     *
     * @aspType int
     */
    public set uniqueWordsCount(value: number) {
        this.uniqueWordsCountInternal = value;
    }

    /**
     * Gets the languageID.
     *
     * @aspType int
     */
    public get languageID(): number {
        return isNullOrUndefined(this.langIDInternal) ? 0 : this.langIDInternal;
    }
    /**
     * Sets the languageID.
     *
     * @aspType int
     */
    public set languageID(value: number) {
        this.langIDInternal = value;
    }
    /**
     * Getter indicates whether suggestion enabled.
     *
     * @aspType bool
     */
    public get allowSpellCheckAndSuggestion(): boolean {
        return this.spellSuggestionInternal;
    }
    /**
     * Setter to enable or disable suggestion
     *
     * @aspType bool
     */
    public set allowSpellCheckAndSuggestion(value: boolean) {
        this.spellSuggestionInternal = value;
    }
    /**
     * Getter indicates whether underline removed for mis-spelled word.
     *
     * @aspType bool
     */
    public get removeUnderline(): boolean {
        return this.removeUnderlineInternal;
    }
    /**
     * Setter to enable or disable underline for mis-spelled word
     *
     * @aspType bool
     */
    public set removeUnderline(value: boolean) {
        this.removeUnderlineInternal = value;
        this.documentHelper.owner.editor.reLayout(this.documentHelper.selection);
    }
    /**
     * Getter indicates whether spell check has to be performed or not.
     *
     * @aspType bool
     */
    public get enableSpellCheck(): boolean {
        return this.enableSpellCheckInternal;
    }
    /**
     * Setter to enable or disable spell check has to be performed or not
     *
     * @aspType bool
     */
    public set enableSpellCheck(value: boolean) {
        this.enableSpellCheckInternal = value;
        this.documentHelper.owner.editor.reLayout(this.documentHelper.selection);
    }

    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
        this.errorWordCollection = new Dictionary<string, ElementBox[]>();
        this.errorSuggestions = new Dictionary<string, string[]>();
        this.ignoreAllItems = [];
        this.uniqueSpelledWords = {};
        this.textSearchResults = new TextSearchResults(this.documentHelper.owner);
        this.uniqueKey = this.documentHelper.owner.element.id + '_' + this.createGuid();
    }
    private get viewer(): LayoutViewer {
        return this.documentHelper.owner.viewer;
    }
    /**
     * Method to manage replace logic
     *
     * @private
     */
    public manageReplace(content: string, dialogElement?: ElementBox): void {
        this.documentHelper.triggerSpellCheck = true;
        let exactText: string = '';
        let elementInfo: ElementInfo;
        if (!isNullOrUndefined(dialogElement) && dialogElement instanceof ErrorTextElementBox) {
            const exactText: string = (dialogElement as ErrorTextElementBox).text;
            this.documentHelper.selection.start = (dialogElement as ErrorTextElementBox).start;
            this.documentHelper.selection.end = (dialogElement as ErrorTextElementBox).end;
            if (content !== 'Ignore Once') {
                content = this.manageSpecialCharacters(exactText, content);
                this.documentHelper.owner.editor.insertTextInternal(content, true);
                this.documentHelper.selection.start.setPositionInternal(this.documentHelper.selection.end);
                this.documentHelper.clearSelectionHighlight();
                return;
            } else {
                this.currentContextInfo = { 'text': exactText, 'element': dialogElement };
            }
        }
        if (!isNullOrUndefined(this.currentContextInfo) && this.currentContextInfo.element && content !== 'Ignore Once') {
            const elementBox: ElementBox = this.currentContextInfo.element;
            exactText = (this.currentContextInfo.element as TextElementBox).text;

            this.documentHelper.selection.start = (elementBox as ErrorTextElementBox).start;
            this.documentHelper.selection.end = (elementBox as ErrorTextElementBox).end;
        } else {
            this.handleReplace(content);
        }
        if (content !== 'Ignore Once') {
            this.documentHelper.owner.editor.insertTextInternal(content, true);
            if (!isNullOrUndefined(this.currentContextInfo)) {
                this.removeErrorsFromCollection(this.currentContextInfo);
            }
            this.documentHelper.selection.start.setPositionInternal(this.documentHelper.selection.end);
            this.documentHelper.clearSelectionHighlight();
        }
        //this.documentHelper.owner.errorWordCollection.remove(content);
        this.documentHelper.triggerSpellCheck = false;
    }
    /**
     * Method to handle replace logic
     *
     * @private
     */
    public handleReplace(content: string): void {
        let startPosition: TextPosition = this.documentHelper.selection.start;
        const offset: number = startPosition.offset;
        const startIndex: number = 0;
        const startInlineObj: ElementInfo = (startPosition.currentWidget as LineWidget).getInline(offset, startIndex, false, true);
        const startOffset: number = startInlineObj.element.line.getOffset(startInlineObj.element, 0) + startInlineObj.element.length;
        if (startOffset === offset) {
            this.retrieveExactElementInfo(startInlineObj);
        }
        const exactText: string = (startInlineObj.element as TextElementBox).text;

        const startPattern: RegExp = new RegExp('^[#\\@\\!\\~\\$\\%\\^\\&\\*\\(\\)\\-\\_\\+\\=\\{\\}\\[\\]\\:\\;\\"\'\\,\\<\\.\\>\\/\\?\\`\\s]+', 'g');
        let matches: RegExpExecArray[] = [];
        let matchInfo: RegExpExecArray;
        // eslint-disable  no-cond-assign
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

        startPosition.location = this.documentHelper.owner.selection.getPhysicalPositionInternal((startPosition.currentWidget as LineWidget), startPosition.offset, true);

        startPosition = this.documentHelper.owner.searchModule.textSearch.getTextPosition(startPosition.currentWidget as LineWidget, startPosition.offset.toString());
        //startPosition.location = this.owner.selection.getPhysicalPositionInternal(span.line, offset, true);
        startPosition.setPositionParagraph(startPosition.currentWidget as LineWidget, startPosition.offset);
        const index: number = (startPosition.offset + (startInlineObj.element as TextElementBox).length) - startPosition.offset;
        let endOffset: number = (startPosition.currentWidget as LineWidget).getOffset(startInlineObj.element, index);
        const lineWidget: LineWidget = startPosition.currentWidget as LineWidget;

        const endPattern: RegExp = new RegExp('[#\\@\\!\\~\\$\\%\\^\\&\\*\\(\\)\\-\\_\\+\\=\\{\\}\\[\\]\\:\\;\\"\'\\,\\<\\.\\>\\/\\?\\s\\`]+$', 'g');
        matches = [];
        // eslint-disable  no-cond-assign
        while (!isNullOrUndefined(matchInfo = endPattern.exec(exactText))) {
            matches.push(matchInfo);
        }
        if (!isNullOrUndefined(matches) && matches.length > 0) {
            endOffset -= matches[0].toString().length;
        }

        this.documentHelper.selection.end = this.documentHelper.owner.searchModule.textSearch.getTextPosition(lineWidget, endOffset.toString());

        this.documentHelper.selection.end.location = this.documentHelper.owner.selection.getPhysicalPositionInternal((startPosition.currentWidget as LineWidget), endOffset, true);
        this.documentHelper.selection.end.setPositionParagraph(lineWidget, endOffset);
        this.currentContextInfo = { 'element': startInlineObj.element, 'text': (startInlineObj.element as TextElementBox).text };
    }

    /**
     * Method to retrieve exact element info
     *
     * @private
     */
    public retrieveExactElementInfo(startInlineObj: ElementInfo): void {
        const nextElement: ElementBox = startInlineObj.element.nextElement;
        if (!isNullOrUndefined(nextElement) && nextElement instanceof TextElementBox) {
            let nextTextElBox: TextElementBox = nextElement as TextElementBox;
            if (nextTextElBox.text.trim() != "") {
                startInlineObj.element = nextElement
            }
        }
    }

    /**
     * Method to handle to ignore error Once
     *
     * @private
     */
    public handleIgnoreOnce(startInlineObj: ElementInfo): void {
        const textElement: TextElementBox = (startInlineObj.element as TextElementBox);
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
        this.documentHelper.owner.editor.reLayout(this.documentHelper.selection);
    }

    /**
     * Method to handle ignore all items
     *
     * @private
     */
    public handleIgnoreAllItems(contextElement?: ContextElementInfo): void {
        const contextItem: ContextElementInfo = (!isNullOrUndefined(contextElement)) ? contextElement : this.retriveText();
        const retrievedText: string = this.manageSpecialCharacters(contextItem.text, undefined, true);
        if (this.ignoreAllItems.indexOf(retrievedText) === -1) {
            this.ignoreAllItems.push(retrievedText);
            this.removeErrorsFromCollection(contextItem);
            this.documentHelper.triggerSpellCheck = true;
            this.documentHelper.owner.editor.reLayout(this.documentHelper.selection);
            this.documentHelper.triggerSpellCheck = false;
            this.documentHelper.clearSelectionHighlight();
        }
    }

    /**
     * Method to handle dictionary
     *
     * @private
     */
    public handleAddToDictionary(contextElement?: ContextElementInfo): void {
        const contextItem: ContextElementInfo = (!isNullOrUndefined(contextElement)) ? contextElement : this.retriveText();
        const retrievedText: string = this.manageSpecialCharacters(contextItem.text, undefined, true);

        /* eslint-disable @typescript-eslint/no-explicit-any */
        this.callSpellChecker(this.languageID, retrievedText, false, false, true).then((data: any) => {
            this.documentHelper.triggerSpellCheck = true;
            this.removeErrorsFromCollection(contextItem);
            this.ignoreAllItems.push(retrievedText);
            this.documentHelper.owner.editor.reLayout(this.documentHelper.selection, true);
            this.documentHelper.triggerSpellCheck = false;
        });
    }
    /**
     * Method to append/remove special characters
     *
     * @private
     */

    public manageSpecialCharacters(exactText: string, replaceText: string, isRemove?: boolean): string {
        if (!isNullOrUndefined(exactText)) {
            if (isNullOrUndefined(replaceText)) {
                replaceText = exactText;
            }

            const pattern: RegExp = new RegExp('^[#\\@\\!\\~\\$\\%\\^\\&\\*\\(\\)\\-\\_\\+\\=\\{\\}\\[\\]\\:\\;\\"\\”\'\\,\\<\\.\\>\\/\\?\\`\\s]+', 'g');
            let matches: RegExpExecArray[] = [];
            let matchInfo: RegExpExecArray;
            // eslint-disable  no-cond-assign
            while (!isNullOrUndefined(matchInfo = pattern.exec(exactText))) {
                matches.push(matchInfo);
            }

            if (matches.length > 0) {
                for (let i: number = 0; i < matches.length; i++) {
                    /* eslint-disable @typescript-eslint/no-explicit-any */
                    const match: any[] = matches[i];
                    replaceText = (!isRemove) ? match[0] + replaceText : replaceText.replace(match[0], '');
                }
            }

            const endPattern: RegExp = new RegExp('[#\\@\\!\\~\\$\\%\\^\\&\\*\\(\\)\\-\\_\\+\\=\\{\\}\\[\\]\\:\\;\\"\\”\'\\,\\<\\.\\>\\/\\?\\s\\`]+$', 'g');
            matches = [];
            // eslint-disable  no-cond-assign
            while (!isNullOrUndefined(matchInfo = endPattern.exec(replaceText))) {
                matches.push(matchInfo);
            }

            if (matches.length > 0) {
                for (let i: number = 0; i < matches.length; i++) {
                    /* eslint-disable @typescript-eslint/no-explicit-any */
                    const match: any = matches[i];
                    replaceText = (!isRemove) ? replaceText + match[0] : replaceText.slice(0, match.index);
                }
            }
        }

        return replaceText;
    }
    /**
     * Method to remove errors
     *
     * @private
     */
    public removeErrorsFromCollection(contextItem: ContextElementInfo): void {
        if (this.errorWordCollection.containsKey(contextItem.text)) {
            const textElement: ElementBox[] = this.errorWordCollection.get(contextItem.text);
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
     *
     * @private
     */
    public retriveText(): ContextElementInfo {
        let exactText: string;
        let currentElement: ElementBox;
        if (!isNullOrUndefined(this.currentContextInfo) && this.currentContextInfo.element) {
            currentElement = this.currentContextInfo.element;
            exactText = (this.currentContextInfo.element as TextElementBox).text;
            this.documentHelper.selection.start = (currentElement as ErrorTextElementBox).start;
            this.documentHelper.selection.end = (currentElement as ErrorTextElementBox).end;
        } else {
            const startPosition: TextPosition = this.documentHelper.selection.start;
            const offset: number = startPosition.offset;
            const startIndex: number = 0;
            const startInlineObj: ElementInfo = (startPosition.currentWidget as LineWidget).getInline(offset, startIndex);
            currentElement = startInlineObj.element;
            exactText = (startInlineObj.element as TextElementBox).text;
        }

        return { 'text': exactText, 'element': currentElement };
    }
    /**
     * Method to handle suggestions
     *
     * @private
     */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    public handleSuggestions(allsuggestions: any): string[] {
        this.spellCheckSuggestion = [];
        if (allsuggestions.length === 0) {
            this.spellCheckSuggestion.push(this.documentHelper.owner.contextMenu.locale.getConstant('Add to Dictionary'));
        } else {

            allsuggestions = (allsuggestions.length === 5) ? this.constructInlineMenu(allsuggestions) : allsuggestions;
            this.spellCheckSuggestion.push(this.documentHelper.owner.contextMenu.locale.getConstant('Add to Dictionary'));
        }
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const spellSuggestion: any = [];
        if (this.spellCheckSuggestion.length > 0) {
            for (const str of this.spellCheckSuggestion) {
                spellSuggestion.push(
                    {
                        text: str,
                        id: this.documentHelper.owner.element.id + '_contextmenu_otherSuggestions_spellcheck_' + str,
                        iconCss: ''
                    });

            }
        }

        return spellSuggestion;
    }

    /**
     * Method to check whether text element has errors
     *
     * @private
     */
    public checktextElementHasErrors(text: string, element: any, left: number): ErrorInfo {
        let hasError: boolean = false;
        const erroElements: any[] = [];
        text = text.replace(/[\s]+/g, '');
        if (!isNullOrUndefined(element.errorCollection) && element.errorCollection.length > 0) {

            if (!this.documentHelper.isScrollHandler && (element.ischangeDetected || element.paragraph.isChangeDetected)) {
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
        } else if (!this.documentHelper.isScrollHandler && element.paragraph.isChangeDetected) {
            element.ischangeDetected = true;
        } else if (!element.ischangeDetected && this.handleErrorCollection(element)) {
            hasError = true;
            erroElements.push(element);
        }
        return { 'errorFound': hasError, 'elements': erroElements };
    }

    private updateStatusForGlobalErrors(erroElements: ErrorTextElementBox[], parentElement: ElementBox): void {
        if (erroElements.length > 0) {
            for (let i: number = 0; i < erroElements.length; i++) {
                const exactText: string = this.manageSpecialCharacters(erroElements[i].text, undefined, true);
                if (this.errorWordCollection.containsKey(exactText)) {
                    const elements: ElementBox[] = this.errorWordCollection.get(exactText);
                    for (let j: number = 0; j < elements.length; j++) {
                        if (elements[j] instanceof ErrorTextElementBox && elements[j] === erroElements[i]) {
                            elements[j].ischangeDetected = true;

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
     *
     * @param {string} errorInElement
     * @private
     */
    public handleErrorCollection(errorInElement: TextElementBox): boolean {
        const errors: Dictionary<string, ElementBox[]> = this.errorWordCollection;
        const exactText: string = this.manageSpecialCharacters(errorInElement.text, undefined, true);
        if (errors.containsKey(exactText) && errorInElement.length > 1) {
            const ignoreAllIndex: number = this.ignoreAllItems.indexOf(exactText);
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
    /* eslint-disable @typescript-eslint/no-explicit-any */
    private constructInlineMenu(inlineSuggestion: any[]): any[] {
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
     *
     * @private
     */
    public findCurretText(): ContextElementInfo {
        const insertPosition: TextPosition = this.documentHelper.selection.start;
        /* eslint-disable @typescript-eslint/no-explicit-any */
        let element: any;
        /* eslint-disable @typescript-eslint/no-explicit-any */
        let inlineObj: any = insertPosition.currentWidget.getInline(this.documentHelper.selection.start.offset, 0);
        let text: string;
        if (!isNullOrUndefined(inlineObj.element)) {
            if (!isNullOrUndefined(inlineObj.element.errorCollection) && inlineObj.element.errorCollection.length > 0) {
                for (let i: number = 0; i < inlineObj.element.errorCollection.length; i++) {
                    const errorElement: ErrorTextElementBox = inlineObj.element.errorCollection[i];

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
                inlineObj = insertPosition.currentWidget.getInline(this.documentHelper.selection.start.offset + 1, 0);
                text = inlineObj.element.text;
            }
        }

        return { 'text': text, 'element': element };
    }
    private addErrorCollection(text: string, elementToCompare: ElementBox, suggestions: string[]): void {
        text = this.manageSpecialCharacters(text, undefined, true);
        if (this.errorWordCollection.containsKey(text)) {
            const errorElements: ElementBox[] = this.errorWordCollection.get(text);
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

    private compareErrorTextElement(errorElement: ErrorTextElementBox, errorCollection: ElementBox[]): boolean {
        const copyElement: ElementBox[] = [];
        let isChanged: boolean = false;
        for (let i: number = 0; i < errorCollection.length; i++) {
            copyElement.push(errorCollection[i]);
        }
        const length: number = errorCollection.length;
        for (let i: number = 0; i < length; i++) {
            if (copyElement[i] instanceof ErrorTextElementBox) {
                if (copyElement[i].ischangeDetected) {
                    const exactText: string = this.manageSpecialCharacters((copyElement[i] as TextElementBox).text, undefined, true);
                    isChanged = true;

                    this.removeErrorsFromCollection({ 'element': copyElement[i], 'text': exactText });
                } else {
                    const currentElement: ErrorTextElementBox = copyElement[i] as ErrorTextElementBox;

                    if (errorElement.start.offset === currentElement.start.offset && errorElement.end.offset === currentElement.end.offset) {
                        return true;
                    }
                }
            }
        }

        if (isChanged) {

            this.errorWordCollection.add(this.manageSpecialCharacters(errorElement.text, undefined, true), [errorElement]);
        }

        return false;
    }

    /**
     * Method to compare text elements
     *
     * @private
     */
    public compareTextElement(errorElement: TextElementBox, errorCollection: ElementBox[]): boolean {
        for (let i: number = 0; i < errorCollection.length; i++) {
            if (errorCollection[i] instanceof TextElementBox) {
                const currentElement: TextElementBox = errorCollection[i] as TextElementBox;
                if (currentElement === errorElement) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Method to handle Word by word spell check
     *
     * @private
     */

    public handleWordByWordSpellCheck(jsonObject: any, elementBox: TextElementBox, left: number, top: number, underlineY: number, baselineAlignment: BaselineAlignment, isSamePage: boolean): void {
        if (jsonObject.HasSpellingError && isSamePage) {
            this.addErrorCollection(elementBox.text, elementBox, jsonObject.Suggestions);

            const backgroundColor: string = (elementBox.line.paragraph.containerWidget instanceof TableCellWidget) ? (elementBox.line.paragraph.containerWidget as TableCellWidget).cellFormat.shading.backgroundColor : this.documentHelper.backgroundColor;
            this.documentHelper.render.renderWavyLine(elementBox, left, top, underlineY, '#FF0000', 'Single', baselineAlignment, backgroundColor);
            elementBox.isSpellChecked = true;
        } else {
            elementBox.isSpellChecked = true;
        }
    }

    /**
     * Method to check errors for combined elements
     *
     * @private
     */

    public checkElementCanBeCombined(elementBox: TextElementBox, underlineY: number, beforeIndex: number, callSpellChecker: boolean, textToCombine?: string, isNext?: boolean, isPrevious?: boolean, canCombine?: boolean): boolean {
        let currentText: string = isNullOrUndefined(textToCombine) ? '' : textToCombine;
        let isCombined: boolean = isNullOrUndefined(canCombine) ? false : canCombine;
        const checkPrevious: boolean = !isNullOrUndefined(isPrevious) ? isPrevious : true;
        const checkNext: boolean = !isNullOrUndefined(isNext) ? isNext : true;
        const combinedElements: TextElementBox[] = [];
        const line: LineWidget = this.documentHelper.selection.getLineWidget(elementBox, 0);
        const index: number = line.children.indexOf(elementBox);
        let prevText: string = elementBox.text;
        combinedElements.push(elementBox);
        const difference: number = (isPrevious) ? 0 : 1;
        let prevCombined: boolean = false;
        let isPrevField: boolean = false;
        if (elementBox.text !== '\v') {
            if (checkPrevious) {
                let textElement: TextElementBox = undefined;
                for (let i: number = index - difference; i >= 0; i--) {
                    textElement = line.children[i] as TextElementBox;
                    if (textElement instanceof TextElementBox && !isPrevField) {
                        if (prevText.indexOf(' ') !== 0 && textElement.text.lastIndexOf(' ') !== textElement.text.length - 1) {
                            prevCombined = !isNullOrUndefined(textToCombine) ? true : false;
                            currentText = textElement.text + currentText;
                            prevText = textElement.text;
                            isPrevField = false;
                            combinedElements.push(textElement);
                            isCombined = true;
                        } else if (!isNullOrUndefined(textElement)) {
                            textElement = textElement.nextElement as TextElementBox;
                            break;
                        }
                    } else if (textElement instanceof FieldElementBox && textElement.fieldType !== 1) {
                        isPrevField = true;
                    }
                }
                const currentElement: TextElementBox = (isCombined) ? textElement : elementBox;
                if (this.lookThroughPreviousLine(currentText, prevText, currentElement, underlineY, beforeIndex)) {
                    return true;
                }
            }
            if (isPrevious) {
                currentText = (prevCombined) ? currentText : elementBox.text + currentText;
            } else {
                currentText += elementBox.text;
            }
            isPrevField = false;
            let nextText: string = elementBox.text;
            if (checkNext) {
                let canCombine: boolean = false;
                let element: TextElementBox = undefined;
                for (let i: number = index + 1; i < line.children.length; i++) {
                    element = (line.children[i] as TextElementBox);
                    if (element instanceof TextElementBox && !isPrevField) {
                        if (nextText.lastIndexOf(' ') !== nextText.length - 1 && element.text.indexOf(' ') !== 0) {
                            currentText += element.text;
                            nextText = element.text;
                            isPrevField = false;
                            combinedElements.push(element);
                            canCombine = true;
                            isCombined = true;
                        } else if (!isNullOrUndefined(element)) {
                            element = element.previousElement as TextElementBox;
                            break;
                        }
                    } else if (element instanceof FieldElementBox && element.fieldType !== 2) {
                        isPrevField = true;
                    }
                }
                const currentElement: TextElementBox = (canCombine) ? element : elementBox;

                if (currentElement.text !== '\f' && this.lookThroughNextLine(currentText, prevText, currentElement, underlineY, beforeIndex)) {
                    return true;
                }
            }
        }

        if (isCombined && callSpellChecker && !this.checkCombinedElementsBeIgnored(combinedElements, currentText)) {
            this.handleCombinedElements(elementBox, currentText, underlineY, beforeIndex);
        }
        return isCombined;
    }


    private lookThroughPreviousLine(currentText: string, prevText: string, currentElement: TextElementBox, underlineY: number, beforeIndex: number): boolean {

        if (!isNullOrUndefined(currentElement) && currentElement.indexInOwner === 0 && !isNullOrUndefined(currentElement.line.previousLine)) {
            const previousLine: LineWidget = currentElement.line.previousLine;
            const index: number = previousLine.children.length - 1;
            if (!isNullOrUndefined(previousLine.children[index]) && previousLine.children[index] instanceof TextElementBox) {
                const firstElement: TextElementBox = previousLine.children[index] as TextElementBox;
                if (!isNullOrUndefined(currentElement.text)) {
                    if (currentElement.text.indexOf(' ') !== 0 && firstElement.text.lastIndexOf(' ') !== firstElement.text.length - 1) {
                        currentText = (currentText.length > 0) ? currentText : prevText;
                        this.checkElementCanBeCombined(firstElement, underlineY, beforeIndex, true, currentText, false, true, true);
                        return true;
                    }
                }
            }
        }

        return false;
    }

    private lookThroughNextLine(currentText: string, prevText: string, elementBox: TextElementBox, underlineY: number, beforeIndex: number): boolean {

        if (!isNullOrUndefined(elementBox) && elementBox.indexInOwner === elementBox.line.children.length - 1 && !isNullOrUndefined(elementBox.line.nextLine)) {
            const nextLine: LineWidget = elementBox.line.nextLine;
            if (!isNullOrUndefined(nextLine.children[0]) && nextLine.children[0] instanceof TextElementBox) {
                const firstElement: TextElementBox = nextLine.children[0] as TextElementBox;
                if (elementBox.text.lastIndexOf(' ') !== elementBox.text.length - 1 && firstElement.text.indexOf(' ') !== 0) {
                    currentText = (currentText.length > 0) ? currentText : prevText;
                    this.checkElementCanBeCombined(firstElement, underlineY, beforeIndex, true, currentText, true, false, true);
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Method to handle combined elements
     *
     * @param {TextElementBox} elementBox
     * @param {string} currentText
     * @param {number} underlineY
     * @param {number} beforeIndex
     * @private
     */
    public handleCombinedElements(elementBox: TextElementBox, currentText: string, underlineY: number, beforeIndex: number): void {
        elementBox.istextCombined = true;
        const splittedText: any[] = currentText.split(/[\s]+/);

        if (this.ignoreAllItems.indexOf(currentText) === -1 && elementBox instanceof TextElementBox && elementBox.ignoreOnceItems.indexOf(currentText) === -1) {
            if (splittedText.length > 1) {
                for (let i: number = 0; i < splittedText.length; i++) {
                    let currentText: string = splittedText[i];
                    currentText = this.manageSpecialCharacters(currentText, undefined, true);

                    this.documentHelper.render.handleUnorderedElements(currentText, elementBox, underlineY, i, 0, i === splittedText.length - 1, beforeIndex);
                }
            } else {
                currentText = this.manageSpecialCharacters(currentText, undefined, true);
                this.documentHelper.render.handleUnorderedElements(currentText, elementBox, underlineY, 0, 0, true, beforeIndex);
            }
        }
    }

    /**
     * Method to check error element collection has unique element
     *
     * @param {ErrorTextElementBox[]} errorCollection
     * @param {ErrorTextElementBox} elementToCheck
     * @private
     */
    public checkArrayHasSameElement(errorCollection: ErrorTextElementBox[], elementToCheck: ErrorTextElementBox): boolean {
        for (let i: number = 0; i < errorCollection.length; i++) {
            const errorText: ErrorTextElementBox = errorCollection[i];

            if ((errorText.start.location.x === elementToCheck.start.location.x) && (errorText.start.location.y === elementToCheck.start.location.y)) {
                return true;
            }
        }

        return false;
    }
    /**
     * @private
     */
    public handleSplitWordSpellCheck(jsonObject: any, currentText: string, elementBox: TextElementBox, isSamePage: boolean, underlineY: number, iteration: number, markIndex: number, isLastItem?: boolean): void {
        if (jsonObject.HasSpellingError && elementBox.text !== ' ' && isSamePage) {
            const matchResults: MatchResults = this.getMatchedResultsFromElement(elementBox, currentText);

            markIndex = (elementBox.istextCombined) ? elementBox.line.getOffset(this.getCombinedElement(elementBox), 0) : markIndex;

            this.documentHelper.owner.searchModule.textSearch.updateMatchedTextLocation(matchResults.matches, matchResults.textResults, matchResults.elementInfo, 0, elementBox, false, null, markIndex);
            this.handleMatchedResults(matchResults.textResults, elementBox, underlineY, iteration, jsonObject.Suggestions, isLastItem);
        } else if (isLastItem) {
            elementBox.isSpellChecked = true;
        }
        this.updateUniqueWords([{ Text: currentText, HasSpellError: jsonObject.HasSpellingError }]);
    }


    private handleMatchedResults(results: TextSearchResults, elementBox: TextElementBox, wavyLineY: number, index: number, suggestions?: string[], isLastItem?: boolean): void {
        if (results.length === 0 && isLastItem) {
            elementBox.isSpellChecked = true;
            return;
        }

        for (let i: number = 0; i < results.length; i++) {
            const span: ErrorTextElementBox = this.createErrorElementWithInfo(results.innerList[i], elementBox);
            const color: string = '#FF0000';

            if (!isNullOrUndefined(elementBox.errorCollection) && !this.checkArrayHasSameElement(elementBox.errorCollection, span)) {
                elementBox.errorCollection.splice(index, 0, span);
            }
            this.addErrorCollection(span.text, span, suggestions);

            const backgroundColor: string = (elementBox.line.paragraph.containerWidget instanceof TableCellWidget) ? (elementBox.paragraph.containerWidget as TableCellWidget).cellFormat.shading.backgroundColor : this.documentHelper.backgroundColor;
            this.documentHelper.render.renderWavyLine(span, span.start.location.x, span.start.location.y - elementBox.margin.top, wavyLineY, color, 'Single', elementBox.characterFormat.baselineAlignment, backgroundColor);
            if (isLastItem) {
                elementBox.isSpellChecked = true;
            }
        }
    }
    /**
     * Calls the spell checker service
     * @private
     */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    public callSpellChecker(languageID: number, word: string, checkSpelling: boolean, checkSuggestion: boolean, addWord?: boolean, isByPage?: boolean): Promise<any> {
        const spellchecker: any = this;
        return new Promise((resolve: Function, reject: Function) => {
            if (!isNullOrUndefined(this)) {
                const httpRequest: XMLHttpRequest = new XMLHttpRequest();

                let service: string = this.documentHelper.owner.serviceUrl + this.documentHelper.owner.serverActionSettings.spellCheck;
                service = (isByPage) ? service + 'ByPage' : service;
                httpRequest.open('POST', service, true);
                httpRequest.setRequestHeader('Content-Type', 'application/json');
                this.setCustomHeaders(httpRequest);

                /* eslint-disable @typescript-eslint/no-explicit-any */
                const spellCheckData: any = { LanguageID: languageID, TexttoCheck: word, CheckSpelling: checkSpelling, CheckSuggestion: checkSuggestion, AddWord: addWord };
                httpRequest.send(JSON.stringify(spellCheckData));
                httpRequest.onreadystatechange = () => {
                    if (httpRequest.readyState === 4) {
                        if (httpRequest.status === 200 || httpRequest.status === 304) {
                            resolve(httpRequest.response);
                        } else {
                            const result: any = {
                                name: 'onFailure',
                                status: httpRequest.status,
                                statusText: httpRequest.responseText,
                                url: service
                            };
                            spellchecker.documentHelper.owner.fireServiceFailure(result);
                            reject(httpRequest.response);
                        }
                    }
                };
            }
        }
        );
    }

    private setCustomHeaders(httpRequest: XMLHttpRequest): void {
        for (let i: number = 0; i < this.documentHelper.owner.headers.length; i++) {
            const header: Object = this.documentHelper.owner.headers[i];
            for (const key of Object.keys(header)) {
                httpRequest.setRequestHeader(key, header[key]);
            }
        }
    }
    /**
     * Method to check for next error
     *
     * @private
     * @returns {void}
     */
    public checkForNextError(): void {
        if (!isNullOrUndefined(this.viewer)) {
            const errorWords: Dictionary<string, ElementBox[]> = this.errorWordCollection;
            if (errorWords.length > 0) {
                for (let i: number = 0; i < errorWords.length; i++) {
                    const errorElements: ElementBox[] = errorWords.get(errorWords.keys[i]);
                    for (let j: number = 0; j < errorElements.length; j++) {
                        if (errorElements[j] instanceof ErrorTextElementBox && !errorElements[j].ischangeDetected) {
                            this.updateErrorElementTextBox(errorWords.keys[i], errorElements[j] as ErrorTextElementBox);
                        } else if (errorElements[j] instanceof TextElementBox) {
                            const matchResults: MatchResults = this.getMatchedResultsFromElement(errorElements[j]);
                            const results: TextSearchResults = matchResults.textResults;

                            const markIndex: number = (errorElements[j].ischangeDetected) ? (errorElements[j] as ErrorTextElementBox).start.offset : errorElements[j].line.getOffset(errorElements[j], 0);

                            this.documentHelper.owner.searchModule.textSearch.updateMatchedTextLocation(matchResults.matches, results, matchResults.elementInfo, 0, errorElements[j], false, null, markIndex);
                            for (let i: number = 0; i < results.length; i++) {
                                const element: ErrorTextElementBox = this.createErrorElementWithInfo(results.innerList[i], errorElements[j]);
                                this.updateErrorElementTextBox(element.text, element);
                                break;
                            }
                        }
                        break;
                    }
                    break;
                }
            } else {
                this.documentHelper.clearSelectionHighlight();
            }
        }
    }
    /**
     * Method to create error element with matched results
     *
     * @param {TextSearchResult} result
     * @param {ElementBox} errorElement
     * @private
     */
    public createErrorElementWithInfo(result: TextSearchResult, errorElement: ElementBox): ErrorTextElementBox {
        const element: ErrorTextElementBox = new ErrorTextElementBox();
        element.text = result.text;
        element.start = result.start;
        element.end = result.end;
        element.height = errorElement.height;
        element.canTrigger = errorElement.canTrigger;
        element.characterFormat.copyFormat(errorElement.characterFormat);
        element.width = this.documentHelper.textHelper.getWidth(element.text, errorElement.characterFormat);
        return element;
    }
    /**
     * Method to get matched results from element box
     *
     * @private
     * @param {ElementBox} errorElement - Specifies the error element box.
     * @param {string} currentText - Specifies the current text
     * @returns {MatchResults} - Returns match results info.
     */
    public getMatchedResultsFromElement(errorElement: ElementBox, currentText?: string): MatchResults {
        const line: LineWidget = (errorElement as TextElementBox).line;

        const pattern: RegExp = this.documentHelper.owner.searchModule.textSearch.stringToRegex((isNullOrUndefined(currentText)) ? (errorElement as TextElementBox).text : currentText, 'CaseSensitive');
        this.textSearchResults.clearResults();
        const results: TextSearchResults = this.textSearchResults;
        const textLineInfo: TextInLineInfo = this.documentHelper.owner.searchModule.textSearch.getElementInfo(line.children[0], 0, false);
        const text: string = textLineInfo.fullText;
        const matches: RegExpExecArray[] = [];
        const spans: any = textLineInfo.elementsWithOffset;
        let matchObject: RegExpExecArray;
        // eslint-disable  no-cond-assign
        while (!isNullOrUndefined(matchObject = pattern.exec(text))) {
            matches.push(matchObject);
        }
        return { 'matches': matches, 'elementInfo': spans, 'textResults': results };
    }
    /**
     * Method to update error element information
     *
     * @private
     * @param {string} error - Specifies the error word.
     * @param {ErrorTextElementBox} errorElement - Specifies the error element box.
     * @returns {void}
     */
    public updateErrorElementTextBox(error: string, errorElement: ErrorTextElementBox): void {
        const element: ErrorTextElementBox = errorElement;
        this.documentHelper.clearSelectionHighlight();
        this.documentHelper.selection.start = element.start;
        this.documentHelper.selection.end = element.end;
        this.documentHelper.selection.highlight(errorElement.start.paragraph, errorElement.start, errorElement.end);
        this.documentHelper.owner.spellCheckDialog.updateSuggestionDialog(error, element);
    }

    /**
     * Method to retrieve space information in a text
     *
     * @private
     * @param {string} text - Specifies the text
     * @param {WCharacterFormat} characterFormat - Specifies the character format.
     * @returns {SpecialCharacterInfo} - Returs special character info.
     */
    public getWhiteSpaceCharacterInfo(text: string, characterFormat: WCharacterFormat): SpaceCharacterInfo {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        let matchedText: any = [];
        let width: number = 0;
        let length: number = 0;
        matchedText = text.match(/[\s]+/);
        if (!isNullOrUndefined(matchedText) && matchedText.length > 0) {
            for (let i: number = 0; i < matchedText.length; i++) {
                width += this.documentHelper.textHelper.getWidth(matchedText[i], characterFormat);
                length += matchedText[i].length;
            }

        }
        return { 'width': width, 'wordLength': length, 'isBeginning': (!isNullOrUndefined(matchedText) && matchedText.index === 0) };
    }

    /**
     * Retrieve Special character info
     *
     * @private
     * @param {string} text - Specifies the text
     * @param {WCharacterFormat} characterFormat - Specifies the character format.
     * @returns {SpecialCharacterInfo} - Returs special character info.
     */
    public getSpecialCharactersInfo(text: string, characterFormat: WCharacterFormat): SpecialCharacterInfo {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        let matchedText: any = [];
        let beginingwidth: number = 0;
        let endWidth: number = 0;
        let length: number = 0;
        matchedText = text.match(/^[\#\@\!\~\$\%\^\&\*\(\)\-\_\+\=\{\}\[\]\:\;\"\'\,\<\.\>\/\?\`]*/);
        for (let i: number = 0; i < matchedText.length; i++) {
            if (!isNullOrUndefined(matchedText[i]) && matchedText[i].length > 0) {
                beginingwidth = this.documentHelper.textHelper.getWidth(matchedText[i], characterFormat);
            }
            length = matchedText.length;
        }

        matchedText = text.match(/[\#\@\!\~\$\%\^\&\*\(\)\-\_\+\=\{\}\[\]\:\;\"\'\,\<\.\>\/\?\`]*$/);
        for (let i: number = 0; i < matchedText.length; i++) {
            if (!isNullOrUndefined(matchedText[i]) && matchedText[i].length > 0) {
                endWidth = this.documentHelper.textHelper.getWidth(matchedText[i], characterFormat);
            }
            length = matchedText.length;
        }
        return { 'beginningWidth': beginingwidth, 'endWidth': endWidth, 'wordLength': length };
    }

    /**
     * Method to retrieve next available combined element
     *
     * @private
     * @param {ElementBox} element - Specified the element.
     * @returns {ElementBox} - Returns combined element.
     */
    public getCombinedElement(element: ElementBox): ElementBox {
        let prevElement: ElementBox = element;
        while (!isNullOrUndefined(element) && element instanceof TextElementBox && (element as TextElementBox).istextCombined) {
            prevElement = element;
            element = element.previousElement;
        }

        return prevElement;
    }

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
     *
     * @private
     * @param {TextElementBox} currentElement - Specifies current element.
     * @param {TextElementBox} splittedElement - Specifies splitted element.
     * @returns {void}
     */
    public updateSplittedElementError(currentElement: TextElementBox, splittedElement: TextElementBox): void {
        const errorCount: number = currentElement.errorCollection.length;
        if (errorCount > 0) {
            const errorCollection: ErrorTextElementBox[] = [];
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
     * @param {Page} page - Specifies the page.
     * @returns {string} - Returns page content.
     */
    public getPageContent(page: Page): string {
        let content: string = '';
        if (this.documentHelper.owner.sfdtExportModule) {
            const sfdtExport: SfdtExport = this.documentHelper.owner.sfdtExportModule;
            sfdtExport.Initialize();
            const document: any = sfdtExport.writePage(page);
            if (this.documentHelper.owner.textExportModule) {
                const textExport: TextExport = this.documentHelper.owner.textExportModule;
                textExport.pageContent = '';
                textExport.setDocument(document);
                textExport.writeInternal();
                content = textExport.pageContent;
            }
        }
        return content;
    }

    /**
     * @private
     * @param {any[]} spelledWords - Specifies spelledWords
     * @returns {void}
     */
    public updateUniqueWords(spelledWords: any[]): void {
        if (!isNullOrUndefined(localStorage.getItem(this.uniqueKey))) {
            this.uniqueSpelledWords = JSON.parse(localStorage.getItem(this.uniqueKey));
        }
        this.uniqueSpelledWords = this.uniqueSpelledWords || {};
        const totalCount: number = spelledWords.length + Object.keys(this.uniqueSpelledWords).length;
        if (totalCount <= this.uniqueWordsCount) {
            for (let i: number = 0; i < spelledWords.length; i++) {
                this.checkForUniqueWords(spelledWords[i]);
            }
        }
        localStorage.setItem(this.uniqueKey, JSON.stringify(this.uniqueSpelledWords));
        this.uniqueSpelledWords = {};
    }
    private checkForUniqueWords(spellData: any): void {
        const identityMatched: boolean = this.uniqueSpelledWords[spellData.Text];
        if (!identityMatched) {
            this.uniqueSpelledWords[spellData.Text] = spellData.HasSpellError;
        }
    }
    /**
     * Method to clear cached words for spell check
     *
     * @returns {void}
     */
    public clearCache(): void {
        if (!isNullOrUndefined(localStorage.getItem(this.uniqueKey))) {
            localStorage.removeItem(this.uniqueKey);
        }
    }

    private createGuid(): string {
        let dateTime: number = new Date().getTime();
        const uuid: string = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char: string): string => {
            const randNo: number = (dateTime + Math.random() * 16) % 16 | 0;
            dateTime = Math.floor(dateTime / 16);
            return (char === 'x' ? randNo : (randNo & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
    /**
     * Check spelling in page data
     *
     * @private
     * @param {string} wordToCheck - Specifies wordToCheck
     * @returns {WordSpellInfo} - Retruns WordSpellInfo
     */
    public checkSpellingInPageInfo(wordToCheck: string): WordSpellInfo {
        const hasError: boolean = false;
        const elementPresent: boolean = false;
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const uniqueWords: any = JSON.parse(localStorage.getItem(this.uniqueKey));
        if (!isNullOrUndefined(uniqueWords)) {
            if (!isNullOrUndefined(uniqueWords[wordToCheck])) {
                return { hasSpellError: uniqueWords[wordToCheck], isElementPresent: true };
            }
        }
        return { hasSpellError: hasError, isElementPresent: elementPresent };
    }
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.errorWordCollection = undefined;
        this.ignoreAllItems = undefined;
        this.errorSuggestions = undefined;
        this.uniqueSpelledWords = {};
        this.textSearchResults = undefined;
        if (!isNullOrUndefined(localStorage.getItem(this.uniqueKey))) {
            localStorage.removeItem(this.uniqueKey);
        }
    }
}
