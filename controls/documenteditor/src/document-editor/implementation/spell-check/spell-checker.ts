/* eslint-disable */
import { LayoutViewer, ContextElementInfo, TextPosition, ElementInfo, ErrorInfo, WCharacterFormat, SpecialCharacterInfo, SpaceCharacterInfo, TextSearchResults, TextInLineInfo, TextSearchResult, MatchResults, SfdtExport, TextExport, WordSpellInfo, TextSearch } from '../index';
import { ServiceFailureArgs, XmlHttpRequestEventArgs, beforeXmlHttpRequestSend } from './../../index';
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
    /**
     * Every time rendering text elementbox we are checking the key length of the uniqueSpelledWords object. This causes performance issue So optimizing it.
     */
    private uniqueSpelledWordsCount: number = 0;
    private spellSuggestionInternal: boolean = true;
    /**
     * @private
     */
    public errorWordCollection: Dictionary<string, ElementBox[]>;
    /**
     * @private
     */
    public uniqueWordsCollection: Dictionary<string, boolean>;
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
    private combinedElements: TextElementBox[] = [];
    /**
     * @default 1000
     */
    private uniqueWordsCountInternal: number = 15000;
    /**
     * @private
     */
    public errorSuggestions: Dictionary<string, string[]>;

    private performOptimizedCheck: boolean = true;

    /**
     * @private
     */
    public isChangeAll: boolean = false;

    private textSearchResults: TextSearchResults;

    private ignoreUppercaseInternal: boolean = false;
    /**
     * Gets a value indicating whether to ignore words written in uppercase during spell check.
     */
    public get ignoreUppercase(): boolean {
        return this.ignoreUppercaseInternal;
    }

     /**
     * Sets a value indicating whether to ignore words written in uppercase during spell check.
     */
    public set ignoreUppercase(value: boolean) {
        this.ignoreUppercaseInternal = value;
    }

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
        this.documentHelper.owner.editorModule.reLayout(this.documentHelper.selection);
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
        this.documentHelper.owner.editorModule.reLayout(this.documentHelper.selection);
    }

    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
        this.errorWordCollection = new Dictionary<string, ElementBox[]>();
        this.uniqueWordsCollection = new Dictionary<string, boolean>();
        this.errorSuggestions = new Dictionary<string, string[]>();
        this.ignoreAllItems = [];
        this.uniqueSpelledWords = {};
        if (!isNullOrUndefined(this.documentHelper) && !isNullOrUndefined(this.documentHelper.owner)) {
            this.textSearchResults = new TextSearchResults(this.documentHelper.owner);
            this.uniqueKey = this.documentHelper.owner.element.id + '_' + this.createGuid();
        }
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
            this.documentHelper.selection.start = (dialogElement as ErrorTextElementBox).start.clone();
            this.documentHelper.selection.end = (dialogElement as ErrorTextElementBox).end.clone();
            if (content !== 'Ignore Once') {
                content = this.manageSpecialCharacters(exactText, content);
                this.documentHelper.owner.editorModule.insertTextInternal(content, true);
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

            this.documentHelper.selection.start = (elementBox as ErrorTextElementBox).start.clone();
            this.documentHelper.selection.end = (elementBox as ErrorTextElementBox).end.clone();
        } else {
            this.handleReplace(content);
        }
        if (content !== 'Ignore Once') {
            this.documentHelper.owner.editorModule.insertTextInternal(content, true);
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

        startPosition.location = this.documentHelper.owner.selectionModule.getPhysicalPositionInternal((startPosition.currentWidget as LineWidget), startPosition.offset, true);

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

        this.documentHelper.selection.end.location = this.documentHelper.owner.selectionModule.getPhysicalPositionInternal((startPosition.currentWidget as LineWidget), endOffset, true);
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
        if (this.documentHelper.owner && this.documentHelper.owner.editorModule) {
            this.documentHelper.owner.editor.initHistory('IgnoreOnce');
        }
        const textElement: TextElementBox = (startInlineObj.element as TextElementBox);
        // If text is split into multiple text elements, then we need to add ignoreOnceItems for all the text elements. So gets the start and end position of the text element and checks the same text exist which is in error element.
        if (!isNullOrUndefined(this.currentContextInfo) && this.currentContextInfo.element && this.currentContextInfo.element instanceof ErrorTextElementBox) {
            this.handleIgnoreOnceInternal(this.currentContextInfo.element, false);
        } else {
            const exactText: string = this.manageSpecialCharacters(textElement.text, undefined, true);
            if (textElement.ignoreOnceItems.indexOf(exactText) === -1) {
                textElement.ignoreOnceItems.push(exactText);
            }
        }
        this.documentHelper.owner.editorModule.reLayout(this.documentHelper.selection);
    }
    /**
     * Method to handle to ignore error Once intenral
     *
     * @private
     */
    public handleIgnoreOnceInternal(errorElement: ErrorTextElementBox, isundoing: boolean): void {
        const startPosition: TextPosition = errorElement.start;
        const endPosition: TextPosition = errorElement.end;
        let startInlineObj: ElementBox = (startPosition.currentWidget as LineWidget).getInline(startPosition.offset, 0, false, true).element;
        const endInlineObj: ElementBox = (endPosition.currentWidget as LineWidget).getInline(endPosition.offset, 0, false, true).element;
        while (true) {
            const exactText: string = this.manageSpecialCharacters(errorElement.text, undefined, true);
            const textIndex: number = (startInlineObj as TextElementBox).ignoreOnceItems.indexOf(exactText)
            if (isundoing) {
                if (textIndex !== -1) {
                    (startInlineObj as TextElementBox).ignoreOnceItems.splice(textIndex, 1);
                }
            } else {
                if (textIndex === -1) {
                    (startInlineObj as TextElementBox).ignoreOnceItems.push(exactText);
                }
            }
            if (startInlineObj === endInlineObj) {
                break;
            }
            startInlineObj = startInlineObj.nextNode;
        }
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
            this.documentHelper.owner.editorModule.reLayout(this.documentHelper.selection);
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
            if (!isNullOrUndefined(this.documentHelper)) {
                this.documentHelper.triggerSpellCheck = true;
                this.removeErrorsFromCollection(contextItem);
                this.ignoreAllItems.push(retrievedText);
                this.documentHelper.owner.editorModule.reLayout(this.documentHelper.selection, true);
                this.documentHelper.triggerSpellCheck = false;
            }
        });
    }
    /**
     * Method to append/remove special characters
     *
     * @private
     */

    public manageSpecialCharacters(exactText: string, replaceText: string, isRemove?: boolean): string {
        if (!isNullOrUndefined(exactText)) {
            let isRemoveSpecChar: boolean = false;
            if (isNullOrUndefined(replaceText)) {
                isRemoveSpecChar = true;
                replaceText = exactText;
            }

            const pattern: RegExp = new RegExp('^[#\\@\\!\\$\\%\\^\\&\\*\\(\\)\\-\\_\\+\\=\\{\\}\\[\\]\\:\\;\\"\\”\'\\,\\<\\.\\>\\/\\?\\`\\s\\’]+', 'g');
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

            const endPattern: RegExp = new RegExp('[#\\@\\!\\$\\%\\^\\&\\*\\(\\)\\-\\_\\+\\=\\{\\}\\[\\]\\:\\;\\"\\”\'\\,\\<\\>\\/\\?\\s\\`\\’]+$', 'g');
            matches = [];
            let originalText: string = replaceText;
            if (!isRemove) {
                originalText = exactText;
            }
            // eslint-disable  no-cond-assign
            while (!isNullOrUndefined(matchInfo = endPattern.exec(originalText))) {
                matches.push(matchInfo);
            }

            if (matches.length > 0) {
                for (let i: number = 0; i < matches.length; i++) {
                    /* eslint-disable @typescript-eslint/no-explicit-any */
                    const match: any = matches[i];
                    replaceText = (!isRemove) ? replaceText + match[0] : replaceText.slice(0, match.index);
                }
            }
            // if the text contains zero width characters, remove them.
            const zeroWidthPattern: RegExp = /[\u200B-\u200D\uFEFF]/g;
            replaceText = replaceText.replace(zeroWidthPattern, '');
        }

        return replaceText;
    }
    /**
     * Method to remove errors
     *
     * @private
     */
    public removeErrorsFromCollection(contextItem: ContextElementInfo): void {
        if (!isNullOrUndefined(contextItem.text) && this.errorWordCollection.containsKey(contextItem.text)) {
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
            this.documentHelper.selection.start = (currentElement as ErrorTextElementBox).start.clone();
            this.documentHelper.selection.end = (currentElement as ErrorTextElementBox).end.clone();
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
            this.spellCheckSuggestion.push(this.documentHelper.owner.contextMenuModule.locale.getConstant('Add to Dictionary'));
        } else {

            allsuggestions = (allsuggestions.length > 3 ) ? this.constructInlineMenu(allsuggestions) : allsuggestions;
            this.spellCheckSuggestion.push(this.documentHelper.owner.contextMenuModule.locale.getConstant('Add to Dictionary'));
        }
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const spellSuggestion: any = [];
        if (this.spellCheckSuggestion.length > 0) {
            for (const str of this.spellCheckSuggestion) {
                spellSuggestion.push(
                    {
                        text: str,
                        id: this.documentHelper.owner.element.id + '_contextmenu_otherSuggestions_spellcheck_' + (str === this.documentHelper.owner.contextMenuModule.locale.getConstant('Add to Dictionary') ? 'Add to Dictionary': str),
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
    public checktextElementHasErrors(text: string, element: TextElementBox, left: number): ErrorInfo {
        let hasError: boolean = false;
        const erroElements: any[] = [];
        text = text.replace(/[\s]+/g, '');
        if (!isNullOrUndefined(element.errorCollection) && element.errorCollection.length > 0) {

            if (!this.documentHelper.isScrollHandler && (element.isChangeDetected || element.paragraph.isChangeDetected) && !element.istextCombined) {
                this.updateStatusForGlobalErrors(element.errorCollection, element);
                element.errorCollection = [];
                element.isChangeDetected = true;
                return { 'errorFound': hasError, 'elements': erroElements };
            }
            for (let i: number = 0; i < element.errorCollection.length; i++) {
                if (this.handleErrorCollection(element.errorCollection[i])) {
                    hasError = true;
                    erroElements.push(element.errorCollection[i]);
                }
            }
        } else if (!this.documentHelper.isScrollHandler && element.paragraph.isChangeDetected) {
            element.isChangeDetected = true;
        } else if (!element.isChangeDetected && this.handleErrorCollection(element)) {
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
                            elements[j].isChangeDetected = true;

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
                    // If the cursor is in error element, then we need to retrieve the text from that error element.
                    if (errorElement.start.isExistBefore(this.documentHelper.selection.start) && errorElement.end.isExistAfter(this.documentHelper.selection.start)) {
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
            if (!this.uniqueWordsCollection.containsKey(text)) {
                this.uniqueWordsCollection.add(text, true);
            }
        }
    }
    private addCorrectWordCollection(text: string): void {
        text = this.manageSpecialCharacters(text, undefined, true);
        if (!this.uniqueWordsCollection.containsKey(text)) {
            this.uniqueWordsCollection.add(text, false);
        }
    }
    /**
     * @private
     */
    public isInUniqueWords(text: string): boolean {
        text = text.replace(/[\s]+/g, '');
        return this.uniqueWordsCollection.containsKey(text);
    }
    /**
     * @private
     */
    public isErrorWord(text: string): boolean {
        text = text.replace(/[\s]+/g, '');
        return this.uniqueWordsCollection.get(text);
    }
    /**
     * @private
     */
    public isCorrectWord(text: string): boolean {
        text = text.replace(/[\s]+/g, '');
        return !this.uniqueWordsCollection.get(text);
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
                if (copyElement[i].isChangeDetected) {
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

    public handleWordByWordSpellCheck(jsonObject: any, elementBox: TextElementBox, left: number, top: number, underlineY: number, baselineAlignment: BaselineAlignment, isSamePage: boolean, currentText?: string): void {
        if (isNullOrUndefined(currentText))
        {
            currentText = elementBox.text;
        }
        if (jsonObject.HasSpellingError && isSamePage) {
            this.addErrorCollection(currentText, elementBox, jsonObject.Suggestions);
            if (currentText === elementBox.text.trim()) {
                const backgroundColor: string = (elementBox.line.paragraph.containerWidget instanceof TableCellWidget) ? (elementBox.line.paragraph.containerWidget as TableCellWidget).cellFormat.shading.backgroundColor : this.documentHelper.backgroundColor;
                this.documentHelper.render.renderWavyLine(elementBox, left, top, underlineY, '#FF0000', 'Single', baselineAlignment, backgroundColor);
                elementBox.isSpellChecked = true;
            }
        } else {
            this.addCorrectWordCollection(currentText);
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
        const line: LineWidget = this.documentHelper.selection.getLineWidget(elementBox, 0);
        const index: number = line.children.indexOf(elementBox);
        let prevText: string = elementBox.text;
        if (this.combinedElements.indexOf(elementBox) === -1) {
            this.combinedElements.push(elementBox);
        }
        const difference: number = (isPrevious) ? 0 : 1;
        let prevCombined: boolean = false;
        let isPrevField: boolean = false;
        if (elementBox.text !== '\v') {
            if (checkPrevious) {
                let textElement: TextElementBox = undefined;
                for (let i: number = index - difference; i >= 0; i--) {
                    textElement = line.children[i] as TextElementBox;
                    if (!isNullOrUndefined(textElement) && textElement.revisionLength > 0 && textElement.getRevision(0).revisionType === "Deletion") {
                        break;
                    }
                    if (textElement instanceof TextElementBox && !isPrevField) {
                        if (prevText.indexOf(' ') !== 0 && textElement.text.lastIndexOf(' ') !== textElement.text.length - 1) {
                            prevCombined = !isNullOrUndefined(textToCombine) ? true : false;
                            currentText = textElement.text + currentText;
                            prevText = textElement.text;
                            isPrevField = false;
                            if (this.combinedElements.indexOf(textElement) === -1) {
                                this.combinedElements.push(textElement);
                            }
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
                    this.combinedElements.length = 0;
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
                    if (!isNullOrUndefined(element) && element.revisionLength > 0 && element.getRevision(0).revisionType === "Deletion") {
                        break;
                    }
                    if (element instanceof TextElementBox && !isPrevField) {
                        if (nextText.lastIndexOf(' ') !== nextText.length - 1 && element.text.indexOf(' ') !== 0) {
                            currentText += element.text;
                            nextText = element.text;
                            isPrevField = false;
                            this.combinedElements.push(element);
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

                if (currentElement.text !== '\f' && currentElement.text !== String.fromCharCode(14) && this.lookThroughNextLine(currentText, prevText, currentElement, underlineY, beforeIndex)) {
                    this.combinedElements.length = 0;
                    return true;
                }
            }
        }

        if (isCombined && callSpellChecker && !this.checkCombinedElementsBeIgnored(this.combinedElements, currentText)) {
            if (isPrevious || isNext) {
                for (let i: number = 0; i < this.combinedElements.length; i++) {
                    this.combinedElements[i].isChangeDetected = false;
                    if (i !== 0) {
                        this.combinedElements[i].istextCombined = true;
                        this.combinedElements[i].errorCollection = this.combinedElements[0].errorCollection;
                    }
                }
            } else {
                this.combinedElements.length = 0;
            }
            this.handleCombinedElements(elementBox, currentText, underlineY);
        }
        this.combinedElements.length = 0;
        return isCombined;
    }


    private lookThroughPreviousLine(currentText: string, prevText: string, currentElement: TextElementBox, underlineY: number, beforeIndex: number): boolean {

        if (!isNullOrUndefined(currentElement) && currentElement.indexInOwner === 0 && !isNullOrUndefined(currentElement.line.previousLine)) {
            const previousLine: LineWidget = currentElement.line.previousLine;
            const index: number = previousLine.children.length - 1;
            if (!isNullOrUndefined(previousLine.children[index]) && previousLine.children[index] instanceof TextElementBox) {
                const firstElement: TextElementBox = previousLine.children[index] as TextElementBox;
                if (!isNullOrUndefined(currentElement.text)) {
                    if (currentElement.text.indexOf(' ') !== 0 && firstElement.text.lastIndexOf(' ') !== firstElement.text.length - 1 && !(firstElement.text === '\v' || firstElement.text === '\t' || firstElement.text === '\f')) {
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

        if (elementBox instanceof TextElementBox && !isNullOrUndefined(elementBox) && elementBox.indexInOwner === elementBox.line.children.length - 1 && !isNullOrUndefined(elementBox.line.nextLine)) {
            const nextLine: LineWidget = elementBox.line.nextLine;
            if (!isNullOrUndefined(nextLine.children[0]) && nextLine.children[0] instanceof TextElementBox) {
                const firstElement: TextElementBox = nextLine.children[0] as TextElementBox;
                if (elementBox.text.lastIndexOf(' ') !== elementBox.text.length - 1 && firstElement.text.indexOf(' ') !== 0 && !(elementBox.text === '\v' || elementBox.text === '\t' || elementBox.text === '\f')) {
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
    public handleCombinedElements(elementBox: TextElementBox, currentText: string, underlineY: number): void {
        const splittedText: any[] = currentText.split(/[\s]+/);

        if (this.ignoreAllItems.indexOf(currentText) === -1 && elementBox instanceof TextElementBox && elementBox.ignoreOnceItems.indexOf(currentText) === -1) {
            if (splittedText.length > 1) {
                for (let i: number = 0; i < splittedText.length; i++) {
                    let currentText: string = splittedText[i];
                    currentText = this.manageSpecialCharacters(currentText, undefined, true);

                    this.documentHelper.render.handleUnorderedElements(currentText, elementBox, underlineY, i, 0, i === splittedText.length - 1, this.combinedElements);
                }
            } else {
                currentText = this.manageSpecialCharacters(currentText, undefined, true);
                this.documentHelper.render.handleUnorderedElements(currentText, elementBox, underlineY, 0, 0, true, this.combinedElements);
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
    public handleSplitWordSpellCheck(jsonObject: any, currentText: string, elementBox: TextElementBox, isSamePage: boolean, underlineY: number, iteration: number, markIndex: number, isLastItem?: boolean, combinedElements?: TextElementBox[]): void {
        if (jsonObject.HasSpellingError && elementBox.text !== ' ' && isSamePage) {
            const textSearch: TextSearch = this.documentHelper.owner.searchModule.textSearch;
            let matchResults: MatchResults = this.getMatchedResultsFromElement(elementBox, currentText);
            // Handled combined elements split to multiple lines when textResults is empty.
            // Only the first element will be rendered with wavy line. Other elements will be rendered in renderTextElementBox method in render Element.
            if (!isNullOrUndefined(combinedElements) && matchResults.textResults.length === 0 && combinedElements.length > 0) {
                const combinedElement: TextElementBox = combinedElements[0];
                matchResults = this.getMatchedResultsFromElement(combinedElement, combinedElement.text);
                markIndex = combinedElement.line.getOffset(this.getCombinedElement(combinedElement), 0);
                textSearch.updateMatchedTextLocation(matchResults.matches, matchResults.textResults, matchResults.elementInfo, 0, combinedElement, false, null, markIndex);
                this.handleMatchedResults(matchResults.textResults, combinedElement, underlineY, iteration, jsonObject.Suggestions, false, currentText, combinedElements);
            } else {
                markIndex = (elementBox.istextCombined) ? elementBox.line.getOffset(this.getCombinedElement(elementBox), 0) : markIndex;
                textSearch.updateMatchedTextLocation(matchResults.matches, matchResults.textResults, matchResults.elementInfo, 0, elementBox, false, null, markIndex);
                this.handleMatchedResults(matchResults.textResults, elementBox, underlineY, iteration, jsonObject.Suggestions, isLastItem);
            }
        } else {
            this.addCorrectWordCollection(currentText);
            if (isLastItem) {
                elementBox.isSpellChecked = true;
            }
        }
        this.updateUniqueWord([{ Text: currentText, HasSpellError: jsonObject.HasSpellingError }]);
    }


    private handleMatchedResults(results: TextSearchResults, elementBox: TextElementBox, wavyLineY: number, index: number, suggestions?: string[], isLastItem?: boolean, errorText?: string, combinedElements?: TextElementBox[]): void {
        if (results.length === 0 && isLastItem) {
            elementBox.isSpellChecked = true;
            return;
        }

        for (let i: number = 0; i < results.length; i++) {
            const span: ErrorTextElementBox = this.createErrorElementWithInfo(results.innerList[i], elementBox);
            // Updated the error text and text position for combined elements.
            if (!isNullOrUndefined(errorText)) {
                span.text = errorText;
                const startElement: TextElementBox = combinedElements[0];
                const endElement: TextElementBox = combinedElements[combinedElements.length - 1];
                // Set the start and end position for the error element when text is splitted into multiple lines.
                if (startElement && endElement) {
                    let offset: number = startElement.line.getOffset(startElement, 0);
                    let startPosition: TextPosition = new TextPosition(this.documentHelper.owner);
                    startPosition.setPositionParagraph(startElement.line, offset);
                    offset = endElement.line.getOffset(endElement, (endElement.length));
                    let endPosition: TextPosition = new TextPosition(this.documentHelper.owner);
                    endPosition.setPositionParagraph(endElement.line, offset);
                    span.start = startPosition;
                    span.end = endPosition;
                }
            }
            const color: string = '#FF0000';

            if (!isNullOrUndefined(elementBox.errorCollection) && !this.checkArrayHasSameElement(elementBox.errorCollection, span)) {
                elementBox.errorCollection.splice(index, 0, span);
            }
            this.addErrorCollection(span.text, span, suggestions);
            const elements: ElementBox[] = this.errorWordCollection.get(span.text);
            if (!isNullOrUndefined(elements) && elements.indexOf(elementBox) !== -1 && elements.indexOf(elementBox) !== elements.indexOf(span)) {
                elements.splice(elements.indexOf(elementBox), 1);
            }
            const backgroundColor: string = (elementBox.line.paragraph.containerWidget instanceof TableCellWidget) ? (elementBox.paragraph.containerWidget as TableCellWidget).cellFormat.shading.backgroundColor : this.documentHelper.backgroundColor;
            const para = elementBox.line.paragraph;
            let lineY = para.y;
            for (let i = 0; i < para.childWidgets.length; i++) {
                if (para.childWidgets[i] == elementBox.line) break;
                lineY += (para.childWidgets[i] as LineWidget).height;
            }
            if (elementBox.isRightToLeft) {
                this.documentHelper.render.renderWavyLine(span, span.end.location.x, lineY, wavyLineY, color, 'Single', elementBox.characterFormat.baselineAlignment, backgroundColor);
            } else {
                this.documentHelper.render.renderWavyLine(span, span.start.location.x, lineY, wavyLineY, color, 'Single', elementBox.characterFormat.baselineAlignment, backgroundColor);
            }
            if (isLastItem) {
                elementBox.isSpellChecked = true;
            }
        }
    }
    /**
     * Calls the spell checker service.
     * @private
     */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    public callSpellChecker(languageID: number, word: string, checkSpelling: boolean, checkSuggestion: boolean, addWord?: boolean, isByPage?: boolean): Promise<any> {
        const spellchecker: any = this;
        return new Promise((resolve: Function, reject: Function) => {
            if (!isNullOrUndefined(this)) {
                const httpRequest: XMLHttpRequest = new XMLHttpRequest();

                let service: string = this.documentHelper.owner.serviceUrl;
                service = (isByPage) ? service + this.documentHelper.owner.serverActionSettings.spellCheckByPage : service + this.documentHelper.owner.serverActionSettings.spellCheck;
                httpRequest.open('POST', service, true);
                httpRequest.setRequestHeader('Content-Type', 'application/json');
                let headers = this.documentHelper.owner.headers;
                /* eslint-disable @typescript-eslint/no-explicit-any */
                if (isByPage)
                {
                    word = word.replace(String.fromCharCode(160), ' ');
                }
                const spellCheckData: any = { LanguageID: languageID, TexttoCheck: word, CheckSpelling: checkSpelling, CheckSuggestion: checkSuggestion, AddWord: addWord, IgnoreUppercase: this.ignoreUppercase };
                const httprequestEventArgs: XmlHttpRequestEventArgs = { serverActionType: 'SpellCheck', headers: headers, timeout: 0, cancel: false, withCredentials: false };
                headers = httprequestEventArgs.headers;
                this.documentHelper.owner.trigger(beforeXmlHttpRequestSend, httprequestEventArgs);
                this.setCustomHeaders(httpRequest, httprequestEventArgs.headers);
                httpRequest.withCredentials = httprequestEventArgs.withCredentials;
                if (!httprequestEventArgs.cancel) {
                    httpRequest.send(JSON.stringify(spellCheckData));
                }
                httpRequest.onreadystatechange = () => {
                    if (httpRequest.readyState === 4) {
                        if (httpRequest.status === 200 || httpRequest.status === 304) {
                            resolve(httpRequest.response);
                        } else {
                            const result: ServiceFailureArgs= {
                                status: httpRequest.status.toString(),
                                statusText: httpRequest.responseText,
                                url: service
                            };
                            (result as any).name= 'onFailure';
                            if (!isNullOrUndefined(spellchecker.documentHelper)) {
                                spellchecker.documentHelper.owner.fireServiceFailure(result);
                            }
                            reject(httpRequest.response);
                        }
                    }
                };
            }
        }
        );
    }

    private setCustomHeaders(httpRequest: XMLHttpRequest, headers:object[]): void {
        if(!isNullOrUndefined(headers)) {
            for (let i: number = 0; i < headers.length; i++) {
                const header: Object = headers[i];
                for (const key of Object.keys(header)) {
                    httpRequest.setRequestHeader(key, header[key]);
                }
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
                        if (errorElements[j] instanceof ErrorTextElementBox && !errorElements[j].isChangeDetected) {
                            if ((isNullOrUndefined((errorElements[j] as ErrorTextElementBox).start.paragraph) || (errorElements[j] as ErrorTextElementBox).start.paragraph.indexInOwner === -1)) {
                                this.errorWordCollection.remove(errorWords.keys[i]);
                            }
                            else {
                                this.updateErrorElementTextBox(errorWords.keys[i], errorElements[j] as ErrorTextElementBox);
                            }
                        } else if (errorElements[j] instanceof TextElementBox) {
                            if (isNullOrUndefined((errorElements[j] as TextElementBox).paragraph) || (errorElements[j] as TextElementBox).paragraph.indexInOwner === -1) {
                                this.errorWordCollection.remove(errorWords.keys[i]);
                            }
                            else {
                                const matchResults: MatchResults = this.getMatchedResultsFromElement(errorElements[j]);
                                const results: TextSearchResults = matchResults.textResults;
    
                                const markIndex: number = (errorElements[j].isChangeDetected) ? (errorElements[j] as ErrorTextElementBox).start.offset : errorElements[j].line.getOffset(errorElements[j], 0);
    
                                this.documentHelper.owner.searchModule.textSearch.updateMatchedTextLocation(matchResults.matches, results, matchResults.elementInfo, 0, errorElements[j], false, null, markIndex);
                                for (let i: number = 0; i < results.length; i++) {
                                    const element: ErrorTextElementBox = this.createErrorElementWithInfo(results.innerList[i], errorElements[j]);
                                    this.updateErrorElementTextBox(element.text, element);
                                    break;
                                }
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
        let isUpdated: boolean = false;
        const text: string = this.documentHelper.selection.getTextInternal(result.start, result.end, false);
        if (errorElement instanceof ErrorTextElementBox && (isNullOrUndefined(result.start) || isNullOrUndefined(result.end) || isNullOrUndefined(text))) {
            element.text = errorElement.text;
            let line: LineWidget = errorElement.line;
            for (let i = 0; i < line.children.length; i++) {
                if (line.children[i] instanceof TextElementBox) {
                    let text: string = (line.children[i] as TextElementBox).text;
                    let exactText: string = errorElement.text;
                    if (text.indexOf(exactText) !== -1) {
                        errorElement.start.offset = text.indexOf(exactText);
                        errorElement.end.offset = errorElement.start.offset + exactText.length;
                        element.start = errorElement.start;
                        element.end = errorElement.end;
                        element.start.currentWidget = errorElement.line;
                        element.end.currentWidget = errorElement.line;
                        isUpdated = true;
                        break;
                    }
                }
            }
            if (!isUpdated) {
                element.text = errorElement.text;
                element.start = errorElement.start;
                element.end = errorElement.end;
                isUpdated = true;
            }
        }
        if (!isUpdated) {
            element.text = text;
            element.start = result.start;
            element.end = result.end;
        }
        element.height = errorElement.height;
        element.canTrigger = errorElement.canTrigger;
        element.characterFormat.copyFormat(errorElement.characterFormat);
        // element.width = this.documentHelper.textHelper.getWidth(element.text, errorElement.characterFormat, (errorElement as TextElementBox).scriptType);
        element.width = Math.abs(element.start.location.x - element.end.location.x);
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
        const textLineInfo: TextInLineInfo = this.documentHelper.owner.searchModule.textSearch.getElementInfo(line.children[0], 0, false, pattern, undefined, undefined, undefined, undefined, true);
        const text: string = textLineInfo.fullText;
        const matches: RegExpExecArray[] = [];
        const spans: any = textLineInfo.elementsWithOffset;
        let matchObject: RegExpExecArray;
        // eslint-disable  no-cond-assign
        while (!isNullOrUndefined(matchObject = pattern.exec(text))) {
            if (this.isChangeAll) {
                matchObject.index = spans.get(errorElement);
            }
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
        this.documentHelper.selection.start = element.start.clone();
        this.documentHelper.selection.end = element.end.clone();
        this.documentHelper.selection.highlight(errorElement.start.paragraph, errorElement.start, errorElement.end);
        this.documentHelper.owner.spellCheckDialogModule.updateSuggestionDialog(error, element);
    }

    /**
     * Method to retrieve space information in a text
     *
     * @private
     * @param {string} text - Specifies the text
     * @param {WCharacterFormat} characterFormat - Specifies the character format.
     * @returns {SpecialCharacterInfo} - Returs special character info.
     */
    public getWhiteSpaceCharacterInfo(elementBox: TextElementBox): SpaceCharacterInfo {
        let text: string = elementBox.text;
        let characterFormat: WCharacterFormat = elementBox.characterFormat;
        /* eslint-disable @typescript-eslint/no-explicit-any */
        let matchedText: any = [];
        let width: number = 0;
        let length: number = 0;
        matchedText = text.match(/[\s]+/);
        if (!isNullOrUndefined(matchedText) && matchedText.length > 0) {
            for (let i: number = 0; i < matchedText.length; i++) {
                width += this.documentHelper.textHelper.getWidth(matchedText[i], characterFormat, elementBox.scriptType);
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
    public getSpecialCharactersInfo(elementBox: TextElementBox): SpecialCharacterInfo {
        let text: string = elementBox.text;
        let characterFormat: WCharacterFormat = elementBox.characterFormat;
        /* eslint-disable @typescript-eslint/no-explicit-any */
        let matchedText: any = [];
        let beginingwidth: number = 0;
        let endWidth: number = 0;
        let length: number = 0;
        matchedText = text.match(/^[\#\@\!\~\$\%\^\&\*\(\)\-\_\+\=\{\}\[\]\:\;\"\'\,\<\.\>\/\?\`]*/);
        for (let i: number = 0; i < matchedText.length; i++) {
            if (!isNullOrUndefined(matchedText[i]) && matchedText[i].length > 0) {
                beginingwidth = this.documentHelper.textHelper.getWidth(matchedText[i], characterFormat, elementBox.scriptType);
            }
            length = matchedText.length;
        }

        matchedText = text.match(/[\#\@\!\~\$\%\^\&\*\(\)\-\_\+\=\{\}\[\]\:\;\"\'\,\<\.\>\/\?\`]*$/);
        for (let i: number = 0; i < matchedText.length; i++) {
            if (!isNullOrUndefined(matchedText[i]) && matchedText[i].length > 0) {
                endWidth = this.documentHelper.textHelper.getWidth(matchedText[i], characterFormat, elementBox.scriptType);
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
                    splittedElement.isChangeDetected = true;
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
            let index: number = sfdtExport.keywordIndex;
            sfdtExport.keywordIndex = 0;
            sfdtExport.Initialize(); 
            const document: any = sfdtExport.writePage(page, true);
            sfdtExport.keywordIndex = index;
            sfdtExport.blocks = [];
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
        this.getUniqueWordsFromLocalStorage();
        const totalCount: number = spelledWords.length + this.uniqueSpelledWordsCount;
        if (totalCount <= this.uniqueWordsCount) {
            for (let i: number = 0; i < spelledWords.length; i++) {
                this.checkForUniqueWords(spelledWords[i]);
            }
        }
        this.addUniqueWordsToLocalStorage();
    }
    public updateUniqueWord(spelledWords: any[]): void {
        this.uniqueSpelledWords = this.uniqueSpelledWords || {};
        const totalCount: number = spelledWords.length + this.uniqueSpelledWordsCount;
        if (totalCount <= this.uniqueWordsCount) {
            for (let i: number = 0; i < spelledWords.length; i++) {
                this.checkForUniqueWords(spelledWords[i]);
            }
        }
    }
    /**
     * @private
     * Get the item from local storage and assign it to uniqueSpelledWords.
     * @returns {void}
     */
    public getUniqueWordsFromLocalStorage(): void {
        if (!isNullOrUndefined(localStorage.getItem(this.uniqueKey))) {
            this.uniqueSpelledWords = JSON.parse(localStorage.getItem(this.uniqueKey));
        }
        this.uniqueSpelledWords = this.uniqueSpelledWords || {};
        this.uniqueSpelledWordsCount = Object.keys(this.uniqueSpelledWords).length;
    }
    /**
     * @private
     * set the uniqueSpelledWords to local storage.
     * @returns {void}
     */
    public addUniqueWordsToLocalStorage(): void {
        try {
            localStorage.setItem(this.uniqueKey, JSON.stringify(this.uniqueSpelledWords));
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                this.clearCache();
                localStorage.setItem(this.uniqueKey, JSON.stringify(this.uniqueSpelledWords));
            }
        }
        this.uniqueSpelledWords = {};
        this.uniqueSpelledWordsCount = 0;
    }
    private checkForUniqueWords(spellData: any): void {
        const identityMatched: boolean = this.uniqueSpelledWords[spellData.Text];
        if (!identityMatched) {
            this.uniqueSpelledWords[spellData.Text] = spellData.HasSpellError;
            this.uniqueSpelledWordsCount++;
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
        const uniqueWords: any = this.uniqueSpelledWords || {};
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
        this.uniqueWordsCollection = undefined;
        this.uniqueSpelledWords = {};
        this.textSearchResults = undefined;
        if (!isNullOrUndefined(localStorage.getItem(this.uniqueKey))) {
            localStorage.removeItem(this.uniqueKey);
        }
        this.documentHelper = undefined;
    }
}
