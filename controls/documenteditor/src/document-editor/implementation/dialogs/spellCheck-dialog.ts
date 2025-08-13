/* eslint-disable */
import { L10n, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { TextSearchResults } from '../index';
import { Button } from '@syncfusion/ej2-buttons';
import { ListView, SelectEventArgs } from '@syncfusion/ej2-lists';
import { ElementBox, TextElementBox, ErrorTextElementBox } from '../viewer/page';
import { DocumentEditor } from '../../document-editor';
import { MatchResults } from '../editor/editor-helper';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { DocumentHelper } from '../viewer';
/**
 * Spell check dialog
 * @private
 */
export class SpellCheckDialog {
    private target: HTMLElement;
    private elementBox: ElementBox;
    /**
     * @private
     */
    public localValue: L10n;
    private errorText: string;
    private spellingListView: ListView;
    private suggestionListView: ListView;
    private selectedText: string;
    public documentHelper: DocumentHelper;
    private isSpellChecking: boolean;

    private textContainer: HTMLElement;
    private spellContainer: HTMLElement;
    private listviewDiv: HTMLElement;
    private buttonDiv: HTMLElement;
    private ignoreButtonElement: HTMLElement;
    private ignorebutton: Button;
    private ignoreAllButtonElement: HTMLElement;
    private ignoreAllbutton: Button;
    private addDictButtonElement: HTMLElement;
    private addDictButton: Button;
    private suggestionDiv: HTMLElement;
    private suggestionContainer: HTMLElement;
    private suggestListDiv: HTMLElement;
    private suggestBtnContainder: HTMLElement;
    private changeButtonElement: HTMLElement;
    private changeButton: Button;
    private changeAllButtonElement: HTMLElement;
    private changeAllbutton: Button;

    private ignoreClickHandler: EventListenerOrEventListenerObject = this.onIgnoreClick.bind(this);
    private ignoreAllClickHandler: EventListenerOrEventListenerObject = this.onIgnoreAllClick.bind(this);
    private addToDictClickHandler: EventListenerOrEventListenerObject = this.onAddToDictClick.bind(this);
    private selectHandlerClickHandler: EventListener = this.onSelectHandlerClick.bind(this);
    private changeButtonClickHandler: EventListenerOrEventListenerObject = this.onChangeButtonClick.bind(this);
    private onChangeAllButtonClickHandler: EventListenerOrEventListenerObject = this.onChangeAllButtonClick.bind(this);

    /**
     * @param {DocumentHelper} documentHelper - Specifies the document helper.
     * @private
     */
    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
        if (this.documentHelper) {
            createSpinner({ target: this.documentHelper.dialog.element, cssClass: 'e-spin-overlay' });
        }
    }

    private get parent(): DocumentEditor {
        return this.documentHelper.owner;
    }

    private getModuleName(): string {
        return 'SpellCheckDialog';
    }
    private onSelectHandlerClick(args: SelectEventArgs): void {
        this.selectHandler(args);
    }
    /**
     * @param {SelectEventArgs} args - Specifies the event args.
     * @returns {void}
     */
    private selectHandler = (args: SelectEventArgs): void => {
        this.selectedText = args.text;
    };
    /**
     * @private
     * @returns {void}
     */
    public onCancelButtonClick = (): void => {
        this.documentHelper.clearSelectionHighlight();
        this.documentHelper.hideDialog();
    };
    private onIgnoreClick(): void {
        this.onIgnoreClicked();
    }
    /**
     * @private
     * @returns {void}
     */
    public onIgnoreClicked = (): void => {
        if (!isNullOrUndefined(this.elementBox)) {
            showSpinner(this.documentHelper.dialog.element);
            this.isSpellChecking = true;
            this.parent.spellCheckerModule.manageReplace('Ignore Once', this.elementBox);
            this.removeErrors();
            this.parent.spellCheckerModule.checkForNextError();
            // this.documentHelper.hideDialog();
            hideSpinner(this.documentHelper.dialog.element);
        }
    };

    private removeErrors(): void {
        if (!isNullOrUndefined(this.errorText) && this.parent.spellCheckerModule.errorWordCollection.containsKey(this.errorText)) {
            const textElement: ElementBox[] = this.parent.spellCheckerModule.errorWordCollection.get(this.errorText);
            textElement.splice(0, 1);
            if (textElement.length === 0) {
                this.parent.spellCheckerModule.errorWordCollection.remove(this.errorText);
            }
        }

        if (this.parent.spellCheckerModule.errorWordCollection.length === 0) {
            this.documentHelper.hideDialog();
        }
    }
    private onIgnoreAllClick(): void {
        this.onIgnoreAllClicked();
    }
    /**
     * @private
     * @returns {void}
     */
    public onIgnoreAllClicked = (): void => {
        if (!isNullOrUndefined(this.elementBox)) {
            showSpinner(this.documentHelper.dialog.element);
            const text: string = (this.elementBox as TextElementBox).text;
            this.parent.spellCheckerModule.handleIgnoreAllItems({ element: this.elementBox, text: text });
            this.parent.spellCheckerModule.checkForNextError();
            // this.documentHelper.hideDialog();
            hideSpinner(this.documentHelper.dialog.element);
        }
    };
    private onAddToDictClick(): void {
        this.addToDictClicked();
    }
    /**
     * @private
     * @returns {void}
     */
    public addToDictClicked = (): void => {
        if (!isNullOrUndefined(this.elementBox)) {
            showSpinner(this.documentHelper.dialog.element);
            this.parent.spellCheckerModule.handleAddToDictionary({ element: this.elementBox, text: (this.elementBox as TextElementBox).text });
            if (this.parent.spellCheckerModule.errorWordCollection.containsKey(this.errorText)) {
                this.parent.spellCheckerModule.errorWordCollection.remove(this.errorText);
            }
            this.parent.spellCheckerModule.checkForNextError();
            this.documentHelper.hideDialog();
        }
    };
    private onChangeButtonClick(): void {
        this.changeButtonClicked();
    }
    /**
     * @private
     * @returns {void}
     */
    public changeButtonClicked = (): void => {
        if (!isNullOrUndefined(this.selectedText)) {
            this.isSpellChecking = true;
            showSpinner(this.documentHelper.dialog.element);
            this.parent.spellCheckerModule.manageReplace(this.selectedText, this.elementBox);
            this.removeErrors();
            this.parent.spellCheckerModule.checkForNextError();
            hideSpinner(this.documentHelper.dialog.element);
            this.selectedText = undefined;
        }
    };
    private onChangeAllButtonClick(): void {
        this.changeAllButtonClicked();
    }
    /**
     * @private
     * @returns {void}
     */
    public changeAllButtonClicked = (): void => {
        if (!isNullOrUndefined(this.selectedText)) {
            this.isSpellChecking = true;
            this.parent.spellCheckerModule.isChangeAll = true;
            showSpinner(this.documentHelper.dialog.element);
            const elements: ElementBox[] = this.parent.spellCheckerModule.errorWordCollection.get(this.errorText);
            for (let i: number = elements.length - 1; i >= 0; i--) {
                if (elements[i] instanceof ErrorTextElementBox && !elements[i].isChangeDetected) {
                    this.parent.spellCheckerModule.manageReplace(this.selectedText, elements[i]);
                } else if (elements[i] instanceof TextElementBox) {
                    const matchResults: MatchResults = this.parent.spellCheckerModule.getMatchedResultsFromElement(elements[i]);
                    const results: TextSearchResults = matchResults.textResults;
                    const markIndex: number = (elements[i].isChangeDetected) ?
                        (elements[i] as ErrorTextElementBox).start.offset : elements[i].line.getOffset(elements[i], 0);
                    this.parent.searchModule.textSearch.updateMatchedTextLocation(matchResults.matches, results, matchResults.elementInfo,
                        0, elements[i], false, null, markIndex);
                    for (let j: number = 0; j < results.length; j++) {
                        const element: ElementBox = this.parent.spellCheckerModule.createErrorElementWithInfo(results.innerList[j], elements[i]);
                        this.parent.spellCheckerModule.manageReplace(this.selectedText, element);
                    }
                }
            }
            if (this.parent.spellCheckerModule.errorWordCollection.containsKey(this.errorText)) {
                this.parent.spellCheckerModule.errorWordCollection.remove(this.errorText);
            }
            this.parent.spellCheckerModule.checkForNextError();
            this.documentHelper.hideDialog();
            hideSpinner(this.documentHelper.dialog.element);
            this.parent.spellCheckerModule.isChangeAll = false;
            this.selectedText = undefined;
        }
    };
    /**
     * @private
     * @param {string} error - Specifies error element box.
     * @param {ElementBox} elementbox - Specifies the element box.
     * @returns {void}
     */
    public show(error?: string, elementbox?: ElementBox): void {
        this.target = undefined;
        this.localValue = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        this.localValue.setLocale(this.documentHelper.owner.locale);
        if (!this.target) {
            this.updateSuggestionDialog(error, elementbox);
        }
    }
    /**
     * @private
     * @param {string} error - Specifies error element box.
     * @param {ElementBox} elementbox - Specifies the element box.
     * @returns {void}
     */
    public updateSuggestionDialog(error: string, elementBox: ElementBox): void {
        this.elementBox = elementBox;
        let suggestions: string[];
        if (this.isSpellChecking) {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            this.parent.spellCheckerModule.callSpellChecker(this.parent.spellCheckerModule.languageID, error, false, true).then((data: any) => {
                /* eslint-disable @typescript-eslint/no-explicit-any */
                const jsonObject: any = JSON.parse(data);
                suggestions = jsonObject.Suggestions;
                this.isSpellChecking = false;
                this.handleRetrievedSuggestion(error, suggestions);
            });
        } else {
            error = this.parent.spellCheckerModule.manageSpecialCharacters(error, undefined, true);
            suggestions = this.parent.spellCheckerModule.errorSuggestions.containsKey(error) ?
                this.parent.spellCheckerModule.errorSuggestions.get(error) : [];
            this.handleRetrievedSuggestion(error, suggestions);
        }
    }


    private handleRetrievedSuggestion(error: string, suggestions: string[]): void {
        error = this.parent.spellCheckerModule.manageSpecialCharacters(error, undefined, true);
        this.initSpellCheckDialog(this.localValue, error, suggestions);
        if (this.documentHelper.selection.caret.style.display !== 'none') {
            this.documentHelper.selection.caret.style.display = 'none';
        }

        this.documentHelper.dialog.header = this.localValue.getConstant('Spelling Editor');
        this.documentHelper.dialog.height = 'auto';
        this.documentHelper.dialog.width = 'auto';
        this.documentHelper.dialog.content = this.target;
        this.documentHelper.dialog.beforeOpen = this.documentHelper.updateFocus;
        this.documentHelper.dialog.buttons = [{
            click: this.onCancelButtonClick,
            buttonModel: { content: this.localValue.getConstant('Cancel'), cssClass: 'e-control e-flat', isPrimary: true }
        }];
        this.documentHelper.dialog.dataBind();
        this.documentHelper.dialog.show();
        hideSpinner(this.documentHelper.dialog.element);
    }
    /**
     * @private
     * @param {L10n} localValue - Specifies the locale value.
     * @param {string} error - Specifies the error text.
     * @param {string[]} suggestion - Specifies the suggestion.
     * @param {boolean} isRtl - Specifies the is rtl
     * @returns {void}
     */
    public initSpellCheckDialog(localValue: L10n, error?: string, suggestion?: string[],isRtl?: boolean): void {
        const id: string = this.documentHelper.owner.containerId + '_add_SpellCheck';
        this.target = createElement('div', { id: id, className: 'e-de-insert-spellchecker' });
        this.errorText = error;
        this.textContainer = createElement('div', {
            className: 'e-de-dlg-sub-header', innerHTML: localValue.getConstant('Spelling')
        });
        this.target.appendChild(this.textContainer);

        this.spellContainer = createElement('div', { className: 'e-de-spellcheck-error-container' });

        this.listviewDiv = createElement('div', { className: 'e-de-dlg-spellcheck-listview' });

        this.spellContainer.appendChild(this.listviewDiv);
        this.spellingListView = new ListView({
            dataSource: [error],
            cssClass: 'e-dlg-spellcheck-listitem'
        });

        this.spellingListView.appendTo(this.listviewDiv);

        this.buttonDiv = createElement('div', { className: 'e-de-spellcheck-btncontainer' });
        this.spellContainer.appendChild(this.buttonDiv);
        this.ignoreButtonElement = createElement('button', { innerHTML: localValue.getConstant('Ignore') });
        this.buttonDiv.appendChild(this.ignoreButtonElement);
        this.ignoreButtonElement.setAttribute('aria-label', localValue.getConstant('Ignore'));
        this.ignorebutton = new Button({ cssClass: 'e-control e-de-ok-button e-de-spellcheck-btn' });
        this.ignorebutton.appendTo(this.ignoreButtonElement);
        this.ignoreButtonElement.addEventListener('click', this.ignoreClickHandler);

        this.ignoreAllButtonElement = createElement('button', { innerHTML: localValue.getConstant('Ignore All') });
        this.ignoreAllButtonElement.setAttribute('aria-label', localValue.getConstant('Ignore All'));
        this.buttonDiv.appendChild(this.ignoreAllButtonElement);
        this.ignoreAllbutton = new Button({ cssClass: 'e-control e-de-ok-button e-de-spellcheck-btn' });
        this.ignoreAllbutton.appendTo(this.ignoreAllButtonElement);
        this.ignoreAllButtonElement.addEventListener('click', this.ignoreAllClickHandler);
        this.addDictButtonElement = createElement('button', { innerHTML: localValue.getConstant('Add to Dictionary') });
        this.addDictButtonElement.setAttribute('aria-label', localValue.getConstant('Add to Dictionary'));
        this.buttonDiv.appendChild(this.addDictButtonElement);
        this.addDictButton = new Button({ cssClass: 'e-control e-de-ok-button e-de-spellcheck-btn' });
        this.addDictButton.appendTo(this.addDictButtonElement);
        this.addDictButtonElement.addEventListener('click', this.addToDictClickHandler);
        this.target.appendChild(this.spellContainer);
        this.suggestionDiv = createElement('div', {
            className: 'e-de-dlg-sub-header', innerHTML: localValue.getConstant('Suggestions')
        });

        this.target.appendChild(this.suggestionDiv);
        this.suggestionContainer = createElement('div', { className: 'e-de-spellcheck-suggestion-container' });
        this.target.appendChild(this.suggestionContainer);
        this.suggestListDiv = createElement('div', { className: 'e-de-dlg-spellcheck-listview' });
        this.suggestListDiv.setAttribute('aria-label', localValue.getConstant('Suggestions')); 
        this.suggestionContainer.appendChild(this.suggestListDiv);
        this.suggestionListView = new ListView({
            dataSource: suggestion,
            cssClass: 'e-dlg-spellcheck-listitem'
        });

        this.suggestionListView.appendTo(this.suggestListDiv);
        this.suggestionListView.addEventListener('select', this.selectHandlerClickHandler);
        this.suggestBtnContainder = createElement('div', { className: 'e-de-spellcheck-btncontainer' });
        this.suggestionContainer.appendChild(this.suggestBtnContainder);

        this.changeButtonElement = createElement('button', { innerHTML: localValue.getConstant('Change')});
        this.changeButtonElement.setAttribute('aria-label', localValue.getConstant('Change'));
        this.suggestBtnContainder.appendChild(this.changeButtonElement);
        this.changeButton = new Button({ cssClass: 'e-control e-de-ok-button e-de-spellcheck-btn' });
        this.changeButton.appendTo(this.changeButtonElement);
        this.changeButtonElement.addEventListener('click', this.changeButtonClickHandler);
        this.changeAllButtonElement = createElement('button', { innerHTML: localValue.getConstant('Change All')});
        this.changeAllButtonElement.setAttribute('aria-label', localValue.getConstant('Change All'));
        this.suggestBtnContainder.appendChild(this.changeAllButtonElement);
        this.changeAllbutton = new Button({ cssClass: 'e-control e-de-ok-button e-de-spellcheck-btn' });
        this.changeAllbutton.appendTo(this.changeAllButtonElement);
        this.changeAllButtonElement.addEventListener('click', this.onChangeAllButtonClickHandler);
        if (isNullOrUndefined(suggestion) || suggestion.length === 0) {
            this.changeButton.disabled = true;
            this.changeAllbutton.disabled = true;
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        if (this.target) {
            this.target.remove();
            this.target = undefined;
        }
        if (this.elementBox) {
            this.elementBox.destroy();
            this.elementBox = undefined;
        }
        this.documentHelper = undefined;
        if (this.spellingListView) {
            this.spellingListView.destroy();
            this.spellingListView = undefined;
        }
        if (this.suggestionListView) {
            this.suggestionListView.destroy();
            this.suggestionListView = undefined;
        }
        this.selectedText = undefined;
        this.removeEvents();
        this.removeElements();
    }
    private removeEvents(): void {
        if (this.ignoreButtonElement) {
            this.ignoreButtonElement.removeEventListener('click', this.ignoreClickHandler);
        }
        if (this.ignoreAllButtonElement) {
            this.ignoreAllButtonElement.removeEventListener('click', this.ignoreAllClickHandler);
        }
        if (this.addDictButtonElement) {
            this.addDictButtonElement.removeEventListener('click', this.addToDictClickHandler);
        }
        if (this.changeButtonElement) {
            this.changeButtonElement.removeEventListener('click', this.changeButtonClickHandler);
        }
        if (this.changeAllButtonElement) {
            this.changeAllButtonElement.removeEventListener('click', this.onChangeAllButtonClickHandler);
        }
        if (this.suggestionListView) {
            this.suggestionListView.removeEventListener('select', this.selectHandlerClickHandler);
        }
    }
    private removeElements(): void {
        if (this.textContainer) {
            this.textContainer.remove();
            this.textContainer = undefined;
        }
        if (this.spellContainer) {
            this.spellContainer.remove();
            this.spellContainer = undefined;
        }
        if (this.listviewDiv) {
            this.listviewDiv.remove();
            this.listviewDiv = undefined;
        }
        if (this.buttonDiv) {
            this.buttonDiv.remove();
            this.buttonDiv = undefined;
        }
        if (this.ignoreButtonElement) {
            this.ignoreButtonElement.remove();
            this.ignoreButtonElement = undefined;
        }
        if (this.ignorebutton) {
            this.ignorebutton.destroy();
            this.ignorebutton = undefined;
        }
        if (this.ignoreAllButtonElement) {
            this.ignoreAllButtonElement.remove();
            this.ignoreAllButtonElement = undefined;
        }
        if (this.ignoreAllbutton) {
            this.ignoreAllbutton.destroy();
            this.ignoreAllbutton = undefined;
        }
        if (this.addDictButtonElement) {
            this.addDictButtonElement.remove();
            this.addDictButtonElement = undefined;
        }
        if (this.addDictButton) {
            this.addDictButton.destroy();
            this.addDictButton = undefined;
        }
        if (this.suggestionDiv) {
            this.suggestionDiv.remove();
            this.suggestionDiv = undefined;
        }
        if (this.suggestionContainer) {
            this.suggestionContainer.remove();
            this.suggestionContainer = undefined;
        }
        if (this.suggestListDiv) {
            this.suggestListDiv.remove();
            this.suggestListDiv = undefined;
        }
        if (this.suggestBtnContainder) {
            this.suggestBtnContainder.remove();
            this.suggestBtnContainder = undefined;
        }
        if (this.changeButtonElement) {
            this.changeButtonElement.remove();
            this.changeButtonElement = undefined;
        }
        if (this.changeButton) {
            this.changeButton.destroy();
            this.changeButton = undefined;
        }
        if (this.changeAllButtonElement) {
            this.changeAllButtonElement.remove();
            this.changeAllButtonElement = undefined;
        }
        if (this.changeAllbutton) {
            this.changeAllbutton.destroy();
            this.changeAllbutton = undefined;
        }
    }
}
