import { L10n, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { TextSearchResults } from '../index';
import { Button } from '@syncfusion/ej2-buttons';
import { ListView } from '@syncfusion/ej2-lists';
import { ElementBox, TextElementBox, ErrorTextElementBox } from '../viewer/page';
import { DocumentEditor } from '../../document-editor';
import { MatchResults } from '../editor/editor-helper';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { DocumentHelper } from '../viewer';
/**
 * Spell check dialog
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

    constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
        createSpinner({ target: this.documentHelper.dialog.element, cssClass: 'e-spin-overlay' });
    }
    /**
     * Gets the spell checker
     * @private
     */
    get parent(): DocumentEditor {
        return this.documentHelper.owner;
    }

    private getModuleName(): string {
        return 'SpellCheckDialog';
    }
    /* tslint:disable:no-any */
    private selectHandler = (args: any): void => {
        this.selectedText = args.text;
    }
    /**
     * @private
     */
    public onCancelButtonClick = (): void => {
        this.documentHelper.clearSelectionHighlight();
        this.documentHelper.hideDialog();
    }
    /**
     * @private
     */
    public onIgnoreClicked = (): void => {
        if (!isNullOrUndefined(this.elementBox)) {
            showSpinner(this.documentHelper.dialog.element);
            this.parent.spellChecker.manageReplace('Ignore Once', this.elementBox);
            this.removeErrors();
            this.parent.spellChecker.checkForNextError();
        }
    }

    /**
     * Method to remove errors
     */
    private removeErrors(): void {
        if (!isNullOrUndefined(this.errorText) && this.parent.spellChecker.errorWordCollection.containsKey(this.errorText)) {
            let textElement: ElementBox[] = this.parent.spellChecker.errorWordCollection.get(this.errorText);
            textElement.splice(0, 1);
            if (textElement.length === 0) {
                this.parent.spellChecker.errorWordCollection.remove(this.errorText);
            }
        }

        if (this.parent.spellChecker.errorWordCollection.length === 0) {
            this.documentHelper.hideDialog();
        }
    }

    /**
     * @private
     */
    public onIgnoreAllClicked = (): void => {
        if (!isNullOrUndefined(this.elementBox)) {
            showSpinner(this.documentHelper.dialog.element);
            let text: string = (this.elementBox as TextElementBox).text;
            this.parent.spellChecker.handleIgnoreAllItems({ element: this.elementBox, text: text });
            this.parent.spellChecker.checkForNextError();
        }
    }
    /**
     * @private
     */
    public addToDictClicked = (): void => {
        if (!isNullOrUndefined(this.elementBox)) {
            showSpinner(this.documentHelper.dialog.element);
            // tslint:disable-next-line:max-line-length
            this.parent.spellChecker.handleAddToDictionary({ element: this.elementBox, text: (this.elementBox as TextElementBox).text });
            if (this.parent.spellChecker.errorWordCollection.containsKey(this.errorText)) {
                this.parent.spellChecker.errorWordCollection.remove(this.errorText);
            }
            this.parent.spellChecker.checkForNextError();
        }
    }
    /**
     * @private
     */
    public changeButtonClicked = (): void => {
        if (!isNullOrUndefined(this.selectedText)) {
            this.isSpellChecking = true;
            showSpinner(this.documentHelper.dialog.element);
            this.parent.spellChecker.manageReplace(this.selectedText, this.elementBox);
            this.removeErrors();
            this.parent.spellChecker.checkForNextError();
            this.documentHelper.dialog.content = '';
        }
    }
    /**
     * @private
     */
    public changeAllButtonClicked = (): void => {
        if (!isNullOrUndefined(this.selectedText)) {
            this.isSpellChecking = true;
            showSpinner(this.documentHelper.dialog.element);
            let elements: ElementBox[] = this.parent.spellChecker.errorWordCollection.get(this.errorText);
            for (let i: number = 0; i < elements.length; i++) {
                if (elements[i] instanceof ErrorTextElementBox && !elements[i].ischangeDetected) {
                    this.parent.spellChecker.manageReplace(this.selectedText, elements[i]);
                } else if (elements[i] instanceof TextElementBox) {
                    let matchResults: MatchResults = this.parent.spellChecker.getMatchedResultsFromElement(elements[i]);
                    let results: TextSearchResults = matchResults.textResults;
                    // tslint:disable-next-line:max-line-length
                    let markIndex: number = (elements[i].ischangeDetected) ? (elements[i] as ErrorTextElementBox).start.offset : elements[i].line.getOffset(elements[i], 0);
                    // tslint:disable-next-line:max-line-length
                    this.parent.searchModule.textSearch.updateMatchedTextLocation(matchResults.matches, results, matchResults.elementInfo, 0, elements[i], false, null, markIndex);
                    for (let j: number = 0; j < results.length; j++) {
                        let element: ElementBox = this.parent.spellChecker.createErrorElementWithInfo(results.innerList[j], elements[i]);
                        this.parent.spellChecker.manageReplace(this.selectedText, element);
                    }
                }
            }
            if (this.parent.spellChecker.errorWordCollection.containsKey(this.errorText)) {
                this.parent.spellChecker.errorWordCollection.remove(this.errorText);
            }
            this.parent.spellChecker.checkForNextError();
            this.documentHelper.dialog.content = '';
        }
    }
    /**
     * @private
     */
    public show(error?: string, elementbox?: ElementBox, callSpellChecker?: boolean): void {
        this.target = undefined;
        this.localValue = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        this.localValue.setLocale(this.documentHelper.owner.locale);
        if (!this.target) {
            this.updateSuggestionDialog(error, elementbox, callSpellChecker);
        }
    }
    /**
     * @private
     */
    public updateSuggestionDialog(error: string, elementBox: ElementBox, callSpellChecker?: boolean): void {
        this.elementBox = elementBox;
        let suggestions: string[];
        if (this.isSpellChecking) {
            // tslint:disable-next-line:max-line-length
            /* tslint:disable:no-any */
            this.parent.spellChecker.CallSpellChecker(this.parent.spellChecker.languageID, error, false, true).then((data: any) => {
                /* tslint:disable:no-any */
                let jsonObject: any = JSON.parse(data);
                suggestions = jsonObject.Suggestions;
                this.isSpellChecking = false;
                this.handleRetrievedSuggestion(error, suggestions);
            });
        } else {
            error = this.parent.spellChecker.manageSpecialCharacters(error, undefined, true);
            // tslint:disable-next-line:max-line-length
            suggestions = this.parent.spellChecker.errorSuggestions.containsKey(error) ? this.parent.spellChecker.errorSuggestions.get(error) : [];
            this.handleRetrievedSuggestion(error, suggestions);
        }
    }

    /**
     * Method to handle retrieved suggestions from server side
     * @param {string} error 
     * @param {any} jsonObject 
     */
    /* tslint:disable:no-any */
    private handleRetrievedSuggestion(error: string, suggestions: string[]): void {
        error = this.parent.spellChecker.manageSpecialCharacters(error, undefined, true);
        this.initSpellCheckDialog(this.localValue, error, suggestions);
        if (this.documentHelper.selection.caret.style.display !== 'none') {
            this.documentHelper.selection.caret.style.display = 'none';
        }

        this.documentHelper.dialog.header = 'Spelling Editor';
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
     */
    public initSpellCheckDialog(localValue: L10n, error?: string, suggestion?: string[]): void {
        let instance: SpellCheckDialog = this;
        let id: string = this.documentHelper.owner.containerId + '_add_SpellCheck';
        this.target = createElement('div', { id: id, className: 'e-de-insert-spellchecker' });
        this.errorText = error;
        let textContainer: HTMLElement = createElement('div', {
            className: 'e-de-dlg-spellchecker-subheader', innerHTML: localValue.getConstant('Spelling')
        });
        this.target.appendChild(textContainer);

        let spellContainer: HTMLElement = createElement('div', { className: 'e-de-spellcheck-error-container' });

        let listviewDiv: HTMLElement = createElement('div', { className: 'e-de-dlg-spellcheck-listview', id: 'styles_listview' });

        spellContainer.appendChild(listviewDiv);
        this.spellingListView = new ListView({
            dataSource: [error],
            cssClass: 'e-dlg-spellcheck-listitem',
        });

        this.spellingListView.appendTo(listviewDiv);

        let buttonDiv: HTMLElement = createElement('div', { className: 'e-de-spellcheck-btncontainer' });
        spellContainer.appendChild(buttonDiv);

        let ignoreButtonElement: HTMLElement = createElement('button', { innerHTML: localValue.getConstant('Ignore'), id: 'ignore' });
        buttonDiv.appendChild(ignoreButtonElement);
        let ignorebutton: Button = new Button({ cssClass: 'e-de-spellcheck-btn' });
        ignorebutton.appendTo(ignoreButtonElement);
        ignoreButtonElement.addEventListener('click', this.onIgnoreClicked);

        let ignoreAllButtonElement: HTMLElement = createElement('button', { innerHTML: localValue.getConstant('Ignore all'), id: 'new' });
        buttonDiv.appendChild(ignoreAllButtonElement);
        let ignoreAllbutton: Button = new Button({ cssClass: 'e-de-spellcheck-btn' });
        ignoreAllbutton.appendTo(ignoreAllButtonElement);
        ignoreAllButtonElement.addEventListener('click', this.onIgnoreAllClicked);
        // tslint:disable-next-line:max-line-length
        let addDictButtonElement: HTMLElement = createElement('button', { innerHTML: localValue.getConstant('Add to Dictionary'), id: 'new' });
        buttonDiv.appendChild(addDictButtonElement);
        let addDictButton: Button = new Button({ cssClass: 'e-de-spellcheck-btn' });
        addDictButton.appendTo(addDictButtonElement);
        addDictButtonElement.addEventListener('click', this.addToDictClicked);
        this.target.appendChild(spellContainer);
        let suggestionDiv: HTMLElement = createElement('div', {
            className: 'e-de-dlg-spellchecker-subheaderbtm', innerHTML: localValue.getConstant('Suggestions')
        });

        this.target.appendChild(suggestionDiv);

        let suggestionContainer: HTMLElement = createElement('div', { className: 'e-de-spellcheck-suggestion-container' });
        this.target.appendChild(suggestionContainer);
        let suggestListDiv: HTMLElement = createElement('div', { className: 'e-de-dlg-spellcheck-listview' });
        suggestionContainer.appendChild(suggestListDiv);
        this.suggestionListView = new ListView({
            dataSource: suggestion,
            cssClass: 'e-dlg-spellcheck-listitem',
        });

        this.suggestionListView.appendTo(suggestListDiv);
        this.suggestionListView.addEventListener('select', this.selectHandler);
        let suggestBtnContainder: HTMLElement = createElement('div', { className: 'e-de-spellcheck-btncontainer' });
        suggestionContainer.appendChild(suggestBtnContainder);

        let changeButtonElement: HTMLElement = createElement('button', { innerHTML: localValue.getConstant('Change'), id: 'Change' });
        suggestBtnContainder.appendChild(changeButtonElement);
        let changeButton: Button = new Button({ cssClass: 'e-de-spellcheck-btn' });
        changeButton.appendTo(changeButtonElement);
        changeButtonElement.addEventListener('click', this.changeButtonClicked);
        // tslint:disable-next-line:max-line-length
        let changeAllButtonElement: HTMLElement = createElement('button', { innerHTML: localValue.getConstant('Change All'), id: 'Change All' });
        suggestBtnContainder.appendChild(changeAllButtonElement);
        let changeAllbutton: Button = new Button({ cssClass: 'e-de-spellcheck-btn' });
        changeAllbutton.appendTo(changeAllButtonElement);
        changeAllButtonElement.addEventListener('click', this.changeAllButtonClicked);
        if (isNullOrUndefined(suggestion) || suggestion.length === 0) {
            changeButton.disabled = true;
            changeAllbutton.disabled = true;
        }
    }
    /**
     * @private
     */
    public destroy(): void {
        if (this.target) {
            this.target.remove();
            this.target = undefined;
        }
        if (this.spellingListView) {
            this.spellingListView.destroy();
            this.spellingListView = undefined;
        }
        if (this.suggestionListView) {
            this.suggestionListView.destroy();
            this.suggestionListView = undefined;
        }
    }
}
