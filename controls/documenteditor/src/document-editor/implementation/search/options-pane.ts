import { LayoutViewer, DocumentHelper } from '../index';
import { TextSearchResults } from './text-search-results';
import { TextSearchResult } from './text-search-result';
import { createElement, isNullOrUndefined, L10n, classList } from '@syncfusion/ej2-base';
import { FindOption } from '../../base/types';
import { TextPosition } from '../selection/selection-helper';
import { HelperMethods } from '../editor/editor-helper';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { Tab, SelectEventArgs, TabItemModel } from '@syncfusion/ej2-navigations';

/**
 * Options Pane class.
 */
export class OptionsPane {
    private documentHelper: DocumentHelper;
    /**
     * @private
     */
    public optionsPane: HTMLElement;
    /**
     * @private
     */
    public isOptionsPaneShow: boolean = false;
    private resultsListBlock: HTMLElement;
    private messageDiv: HTMLElement;
    private results: TextSearchResults;
    private searchInput: HTMLInputElement;
    private searchDiv: HTMLElement;
    private searchTextBoxContainer: HTMLElement;
    private replaceWith: HTMLInputElement;
    private findDiv: HTMLElement;
    private replaceDiv: HTMLElement;
    private replaceButton: HTMLElement;
    private replaceAllButton: HTMLElement;
    private occurrenceDiv: HTMLElement;
    private findOption: FindOption = 'None';
    private matchCase: CheckBox = undefined;
    private wholeWord: CheckBox = undefined;
    // private regular: CheckBox = undefined;
    private searchText: string = 'Navigation';
    private resultsText: string = 'Results';
    private messageDivText: string = 'No matches';
    private replaceButtonText: string = 'Replace';
    private replaceAllButtonText: string = 'Replace All';
    private focusedIndex: number = -1;
    private focusedElement: HTMLElement[] = [];
    private resultContainer: HTMLElement;
    private navigateToPreviousResult: HTMLElement;
    private navigateToNextResult: HTMLElement;
    private closeButton: HTMLElement;
    private isOptionsPane: boolean = true;
    private findTab: HTMLElement;
    private findTabButton: HTMLElement;
    private replaceTabButton: HTMLElement;
    private searchIcon: HTMLSpanElement;
    private matchDiv: HTMLElement;
    private replacePaneText: string = 'Replace';
    private findPaneText: string = 'Find';
    private matchDivReplaceText: string = 'No matches';
    private matchInput: HTMLInputElement;
    private wholeInput: HTMLInputElement;
    private regularInput: HTMLInputElement;
    /**
     * @private
     */
    public tabInstance: Tab = undefined;
    private findTabContentDiv: HTMLElement;
    private replaceTabContentDiv: HTMLElement;
    /**
     * @private
     */
    public isReplace: boolean = false;
    private localeValue: L10n;

    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }
    private get viewer(): LayoutViewer {
        return this.documentHelper.owner.viewer;
    }

    private getModuleName(): string {
        return 'OptionsPane';
    }
    /**
     * Initialize the options pane.
     *
     * @private
     * @param {L10n} localeValue - Specifies the localization based on culture.
     * @param {boolean} isRtl - Specifies the Rtl.
     * @returns {void}
     */
    /* eslint-disable  */
    public initOptionsPane(localeValue: L10n, isRtl?: boolean): void {
        let viewer: LayoutViewer = this.viewer;
        this.localeValue = localeValue;
        this.optionsPane = createElement('div', { className: 'e-de-op', styles: 'display:none;' });
        this.optionsPane.addEventListener('keydown', this.onKeyDownOnOptionPane);
        this.searchDiv = createElement('div', {
            className: this.documentHelper.owner.containerId + '_searchDiv e-de-op-header',
            innerHTML: localeValue.getConstant(this.searchText)
        });
        this.optionsPane.appendChild(this.searchDiv);
        this.closeButton = createElement('button', {
            className: 'e-de-op-close-button e-de-close-icon e-de-op-icon-btn e-btn e-flat e-icon-btn', id: 'close',
            attrs: { type: 'button' }
        });
        this.optionsPane.appendChild(this.closeButton);
        let closeSpan: HTMLSpanElement = createElement('span', { className: 'e-de-op-close-icon e-de-close-icon e-btn-icon e-icons' });
        this.closeButton.appendChild(closeSpan);
        this.focusedElement.push(this.closeButton);
        //Find tab header
        this.findTab = createElement('div', { id: this.documentHelper.owner.containerId + '_findTabDiv', className: 'e-de-op-tab' });
        this.optionsPane.appendChild(this.findTab);
        this.findTabButton = createElement('div', { innerHTML: localeValue.getConstant(this.findPaneText) });
        this.replaceTabButton = createElement('div', { innerHTML: localeValue.getConstant(this.replacePaneText) });
        let findTabContent: HTMLElement = createElement('div');
        this.findTabContentDiv = createElement('div', { className: 'e-de-search-tab-content' });
        this.searchTextBoxContainer = createElement('div', { className: 'e-input-group e-de-op-input-group' });
        this.findTabContentDiv.appendChild(this.searchTextBoxContainer);
        this.searchInput = createElement('input', { className: 'e-input e-de-search-input', id: this.documentHelper.owner.containerId + '_option_search_text_box', attrs: { placeholder: localeValue.getConstant('Search for') } }) as HTMLInputElement;
        this.searchTextBoxContainer.appendChild(this.searchInput);
        this.searchIcon = createElement('span', {
            className: 'e-de-op-icon e-de-op-search-icon e-input-group-icon e-icon',
            id: this.documentHelper.owner.containerId + '_search-icon'
        });
        this.searchIcon.tabIndex = 0;
        this.searchTextBoxContainer.appendChild(this.searchIcon);
        this.focusedElement.push(this.searchIcon);
        this.navigateToPreviousResult = createElement('span', { className: 'e-de-op-icon e-de-op-nav-btn e-arrow-up e-spin-up e-btn-icon e-icon e-input-group-icon' });
        this.navigateToPreviousResult.tabIndex = 0;
        this.searchTextBoxContainer.appendChild(this.navigateToPreviousResult);
        this.focusedElement.push(this.navigateToPreviousResult);
        this.navigateToNextResult = createElement('span', { className: 'e-de-op-icon e-de-op-nav-btn e-arrow-down e-spin-down e-btn-icon e-icon e-input-group-icon' });
        this.navigateToNextResult.tabIndex = 0;
        this.searchTextBoxContainer.appendChild(this.navigateToNextResult);
        this.focusedElement.push(this.navigateToNextResult);
        let div: HTMLElement = createElement('div', { className: 'e-de-op-more-less' });
        this.matchInput = createElement('input', {
            attrs: { type: 'checkbox' },
            id: this.documentHelper.owner.containerId + '_matchCase'
        }) as HTMLInputElement;
        div.appendChild(this.matchInput);
        this.matchCase = new CheckBox({ label: localeValue.getConstant('Match case'), enableRtl: isRtl, checked: false, change: this.matchChange.bind(this) });
        this.matchCase.appendTo(this.matchInput);
        this.focusedElement.push(this.matchInput);
        this.matchInput.tabIndex = 0;
        let wholeWordLabel: string;
        if (isRtl) {
            wholeWordLabel = '_e-de-rtl';
        } else {
            wholeWordLabel = '_e-de-ltr';
        }
        this.wholeInput = createElement('input', {
            attrs: { type: 'checkbox' },
            id: this.documentHelper.owner.containerId + '_wholeWord' + wholeWordLabel
        }) as HTMLInputElement;
        div.appendChild(this.wholeInput);
        this.wholeWord = new CheckBox({ label: localeValue.getConstant('Whole words'), enableRtl: isRtl, checked: false, change: this.wholeWordsChange.bind(this) });
        this.wholeWord.appendTo(this.wholeInput);
        this.focusedElement.push(this.wholeInput);
        this.wholeInput.tabIndex = 0;
        this.findTabContentDiv.appendChild(div);
        //Replace tab
        let replaceTabContent: HTMLElement = createElement('div');
        this.replaceTabContentDiv = createElement('div', { className: 'e-de-op-replacetabcontentdiv', styles: 'display:none;' });
        this.findTabContentDiv.appendChild(this.replaceTabContentDiv);
        this.createReplacePane(isRtl);
        this.findDiv = createElement('div', { className: 'findDiv', styles: 'display:block;' });
        findTabContent.appendChild(this.findTabContentDiv);
        this.resultContainer = createElement('div', { styles: 'width:85%;display:block;', className: 'e-de-op-result-container' });
        this.findDiv.appendChild(this.resultContainer);
        this.messageDiv = createElement('div', { className: this.documentHelper.owner.containerId + '_messageDiv e-de-op-msg', innerHTML: this.localeValue.getConstant(this.messageDivText), id: this.documentHelper.owner.containerId + '_search_status' });
        this.resultContainer.appendChild(this.messageDiv);
        this.resultsListBlock = createElement('div', { id: this.documentHelper.owner.containerId + '_list_box_container', styles: 'display:none;width:270px;list-style:none;padding-right:5px;overflow:auto;', className: 'e-de-result-list-block' });
        this.findDiv.appendChild(this.resultsListBlock);
        this.findTabContentDiv.appendChild(this.findDiv);
        let items: TabItemModel[] = [
            { header: { text: this.findTabButton }, content: findTabContent },
            { header: { text: this.replaceTabButton }, content: replaceTabContent }] as TabItemModel[];
        this.tabInstance = new Tab({ items: items, enableRtl: isRtl, selected: this.selectedTabItem.bind(this) });
        this.tabInstance.isStringTemplate = true;
        this.tabInstance.appendTo(this.findTab);
        this.onWireEvents();
        if (isRtl) {
            this.optionsPane.classList.add('e-de-rtl');
            this.closeButton.classList.add('e-de-rtl');
            this.searchDiv.classList.add('e-de-rtl');
        }
    }
    private createReplacePane(isRtl?: boolean): void {
        this.replaceDiv = createElement('div');
        this.replaceTabContentDiv.appendChild(this.replaceDiv);
        this.replaceWith = createElement('input', {
            className: 'e-de-op-replacewith e-input',
            attrs: { placeholder: this.localeValue.getConstant('Replace with') }
        }) as HTMLInputElement;
        this.replaceDiv.appendChild(this.replaceWith);
        let replaceButtonDivTextAlign: string;
        let replaceButtonMargin: string;
        if (isRtl) {
            replaceButtonDivTextAlign = 'text-align:left';
            replaceButtonMargin = 'margin-left:10px';
        } else {
            replaceButtonDivTextAlign = 'text-align:right';
            replaceButtonMargin = 'margin-right:10px';
        }
        let replaceButtonDiv: HTMLElement = createElement('div', { styles: replaceButtonDivTextAlign, className: 'e-de-op-dlg-footer' });
        this.replaceDiv.appendChild(replaceButtonDiv);
        this.replaceButton = createElement('button', {
            className: 'e-control e-btn e-flat e-replace',
            styles: replaceButtonMargin,
            innerHTML: this.localeValue.getConstant(this.replaceButtonText),
            attrs: { type: 'button' }
        });
        replaceButtonDiv.appendChild(this.replaceButton);
        this.replaceAllButton = createElement('button', {
            className: 'e-control e-btn e-flat e-replaceall',
            innerHTML: this.localeValue.getConstant(this.replaceAllButtonText),
            attrs: { type: 'button' }
        });
        replaceButtonDiv.appendChild(this.replaceAllButton);
        this.matchDiv = createElement('div', { styles: 'display:none;padding-top:10px;' });
        this.replaceDiv.appendChild(this.matchDiv);
        let emptyDiv6: HTMLElement = createElement('div', { className: 'e-de-op-search-replacediv' });
        this.replaceDiv.appendChild(emptyDiv6);
        this.occurrenceDiv = createElement('div', { styles: 'display:none;' });
        this.replaceDiv.appendChild(this.occurrenceDiv);
    }

    private selectedTabItem(args: SelectEventArgs): void {
        let contentParent: Element = this.findTab.getElementsByClassName('e-content').item(0);
        if (args.previousIndex !== args.selectedIndex) {
            let previousTab: Element = contentParent.children[0];
            let nextTab: Element = contentParent.children[1];
            let element: HTMLElement = previousTab.firstElementChild as HTMLElement;
            if (element) {
                if (element.parentElement) {
                    element.parentElement.removeChild(element);
                }
                nextTab.appendChild(element);
            }
        }
        let selectedElement: Element = contentParent.children[0];
        if (!isNullOrUndefined(selectedElement)) {
            if (args.selectedIndex === 0) {
                this.isOptionsPane = true;
                this.onFindPane();
            } else {
                this.isOptionsPane = false;
                this.onReplacePane();
            }
        }
    }
    /**
     * @returns {void}
     */
    private searchOptionChange = (): void => {
        this.clearSearchResultItems();
        this.documentHelper.owner.searchModule.clearSearchHighlight();
        let inputText: string = this.searchInput.value;
        if (inputText === '') {
            return;
        }
        let pattern: RegExp = this.documentHelper.owner.searchModule.textSearch.stringToRegex(inputText, this.findOption);
        let endSelection: TextPosition = this.documentHelper.selection.end;
        let selectionIndex: string = endSelection.getHierarchicalIndexInternal();
        this.results = this.documentHelper.owner.searchModule.textSearch.findAll(pattern, this.findOption, selectionIndex);
        if (this.results != null && this.results.length > 0) {
            this.navigateSearchResult(false);
        } else {
            this.viewer.renderVisiblePages();
            this.messageDiv.innerHTML = this.localeValue.getConstant('No matches');
            this.resultContainer.style.display = 'block';
            this.resultsListBlock.style.display = 'none';
            this.clearFocusElement();
            this.resultsListBlock.innerHTML = '';
        }
    }
    private navigateSearchResult(navigate: boolean): void {
        if (navigate) {
            this.documentHelper.owner.searchModule.navigate(this.results.innerList[this.results.currentIndex]);
        }
        this.documentHelper.owner.searchModule.highlight(this.results);
        this.documentHelper.owner.searchModule.addFindResultView(this.results);
        this.resultsListBlock.style.display = 'block';
        this.resultContainer.style.display = 'block';
        let lists: string[] = this.documentHelper.owner.findResultsList;
        let text: string = '';
        for (let i: number = 0; i < lists.length; i++) {
            text += lists[i];
        }
        this.clearFocusElement();
        this.resultsListBlock.innerHTML = text;
        for (let i: number = 0; i < this.resultsListBlock.children.length; i++) {
            this.focusedElement.push(this.resultsListBlock.children[i] as HTMLElement);
        }
        let currentIndexValue: number = this.results.currentIndex;
        this.messageDiv.innerHTML = this.localeValue.getConstant('Result') + ' ' + (currentIndexValue + 1) + ' ' + this.localeValue.getConstant('of') + ' ' + this.resultsListBlock.children.length;
        let listElement: HTMLElement = this.resultsListBlock.children[currentIndexValue] as HTMLElement;
        if (listElement.classList.contains('e-de-search-result-item')) {
            listElement.classList.remove('e-de-search-result-item');
            listElement.classList.add('e-de-search-result-hglt');
            listElement.children[0].classList.add('e-de-op-search-word-text');
            this.scrollToPosition(listElement);
        }
    }
    /**
     * Apply find option based on whole words value.
     *
     * @private
     * @returns {void}
     */
    public wholeWordsChange(): void {
        if (this.matchInput.checked && this.wholeInput.checked) {
            this.findOption = 'CaseSensitiveWholeWord';
        } else if (this.matchInput.checked && !(this.wholeInput.checked)) {
            this.findOption = 'CaseSensitive';
        } else if (!(this.matchInput.checked) && this.wholeInput.checked) {
            this.findOption = 'WholeWord';
        } else {
            this.findOption = 'None';
        }
        this.searchOptionChange();
    }
    /**
     * Apply find option based on match value.
     *
     * @private
     * @returns {void}
     */
    public matchChange(): void {
        if (this.matchInput.checked && this.wholeInput.checked) {
            this.findOption = 'CaseSensitiveWholeWord';
        } else if (!(this.matchInput.checked) && this.wholeInput.checked) {
            this.findOption = 'WholeWord';
        } else if (this.matchInput.checked && !(this.wholeInput.checked)) {
            this.findOption = 'CaseSensitive';
        } else {
            this.findOption = 'None';
        }
        this.searchOptionChange();
    }
    // /**
    //  * Apply find options based on regular value.
    //  * @param {ChangeEventArgs} args - Specifies the search options value.
    //  * @private
    //  */
    // public regularChange = (args: ChangeEventArgs): void => {
    //     if (args.checked) {
    //         this.matchCase.element.parentElement.parentElement.classList.add('e-checkbox-disabled');
    //         this.wholeWord.element.parentElement.parentElement.classList.add('e-checkbox-disabled');
    //         this.matchCase.checked = false;
    //         this.wholeWord.checked = false;
    //         this.findOption = 'None';
    //         this.onKeyDownInternal();
    //     } else {
    //         this.matchCase.element.parentElement.parentElement.classList.remove('e-checkbox-disabled');
    //         this.wholeWord.element.parentElement.parentElement.classList.remove('e-checkbox-disabled');
    //     }
    // }
    /* eslint-enable @typescript-eslint/no-explicit-any */
    /**
     * Binding events from the element when optins pane creation.
     *
     * @private
     * @returns {void}
     */
    public onWireEvents(): void {
        this.searchIcon.addEventListener('click', this.searchIconClickInternal);
        this.navigateToNextResult.addEventListener('click', this.navigateNextResultButtonClick);
        this.navigateToPreviousResult.addEventListener('click', this.navigatePreviousResultButtonClick);
        this.searchInput.addEventListener('keydown', this.onKeyDown);
        this.searchInput.addEventListener('keyup', this.onEnableDisableReplaceButton);
        this.resultsListBlock.addEventListener('click', this.resultListBlockClick);
        this.closeButton.addEventListener('click', this.close);
        this.replaceButton.addEventListener('click', this.onReplaceButtonClick);
        this.replaceAllButton.addEventListener('click', this.onReplaceAllButtonClick);
    }
    /**
     * Fires on key down actions done.
     *
     * @private
     * @returns {void}
     */
    public onKeyDownInternal(): void {
        let inputElement: HTMLInputElement = document.getElementById(this.documentHelper.owner.containerId + '_option_search_text_box') as HTMLInputElement;
        inputElement.blur();
        let text: string = inputElement.value;
        if (text === '') {
            return;
        }
        if (text.length >= 1 && this.searchIcon.classList.contains('e-de-op-search-icon')) {
            this.searchIcon.classList.add('e-de-op-search-close-icon');
            this.searchIcon.classList.remove('e-de-op-search-icon');
        }
        let height: number = this.isOptionsPane ? 215 : 292;
        let resultsContainerHeight: number = this.documentHelper.owner.getDocumentEditorElement().offsetHeight - height;
        this.clearSearchResultItems();
        this.documentHelper.owner.searchModule.clearSearchHighlight();
        let pattern: RegExp = this.documentHelper.owner.searchModule.textSearch.stringToRegex(text, this.findOption);
        let endSelection: TextPosition = this.documentHelper.selection.end;
        let index: string = endSelection.getHierarchicalIndexInternal();
        this.results = this.documentHelper.owner.searchModule.textSearch.findAll(pattern, this.findOption, index);
        let results: TextSearchResults = this.results;
        if (isNullOrUndefined(results)) {
            this.viewer.renderVisiblePages();
        }
        if (results != null && results.length > 0) {
            if ((this.focusedElement.indexOf(this.navigateToPreviousResult) === -1) && this.isOptionsPane) {
                this.focusedElement.push(this.navigateToPreviousResult);
            }
            if ((this.focusedElement.indexOf(this.navigateToNextResult) === -1) && this.isOptionsPane) {
                this.focusedElement.push(this.navigateToNextResult);
            }
            this.documentHelper.owner.searchModule.navigate(this.results.innerList[this.results.currentIndex]);
            this.documentHelper.owner.searchModule.highlight(results);
            this.documentHelper.owner.searchModule.addFindResultView(results);
            // if (this.isOptionsPane) {
            this.resultsListBlock.style.display = 'block';
            this.resultsListBlock.style.height = resultsContainerHeight + 'px';
            this.resultContainer.style.display = 'block';
            let list: string[] = this.documentHelper.owner.findResultsList;
            let text: string = '';
            this.clearFocusElement();
            this.resultsListBlock.innerHTML = '';
            for (let i: number = 0; i < list.length; i++) {
                text += list[i];
            }
            this.resultsListBlock.innerHTML = text;
            for (let i: number = 0; i < this.resultsListBlock.children.length; i++) {
                this.focusedElement.push(this.resultsListBlock.children[i] as HTMLElement);
            }
            let lists: HTMLCollection = this.resultsListBlock.children;
            let currentIndex: number = this.results.currentIndex;
            this.messageDiv.innerHTML = this.localeValue.getConstant('Result') + ' ' + (currentIndex + 1) + ' ' + this.localeValue.getConstant('of') + ' ' + this.resultsListBlock.children.length;
            let listElement: HTMLElement = this.resultsListBlock.children[currentIndex] as HTMLElement;
            if (listElement.classList.contains('e-de-search-result-item')) {
                listElement.classList.remove('e-de-search-result-item');
                listElement.classList.add('e-de-search-result-hglt');
                listElement.children[0].classList.add('e-de-op-search-word-text');
            }
            this.navigateToNextResult.focus();
            this.focusedIndex = this.focusedElement.indexOf(this.navigateToNextResult);
            this.getMessageDivHeight();
            // } else {
            //this.focusedIndex = 4;
            // }
        } else {
            this.messageDiv.innerHTML = this.localeValue.getConstant('No matches');
            this.resultContainer.style.display = 'block';
            this.resultsListBlock.style.display = 'none';
            this.clearFocusElement();
            this.resultsListBlock.innerHTML = '';
        }
    }
    /**
     * Enable find pane only.
     *
     * @private
     * @returns {void}
     */
    public onFindPane(): void {
        this.replaceDiv.style.display = 'none';
        this.occurrenceDiv.style.display = 'none';
        if (!isNullOrUndefined(this.results) && this.results.length === 0) {
            this.resultsListBlock.innerHTML = '';
            this.resultsListBlock.style.display = 'none';
            this.messageDiv.innerHTML = this.localeValue.getConstant('No matches');
        }
        let height: number = this.isOptionsPane ? 215 : 292;
        let resultsContainerHeight: number = this.documentHelper.owner.getDocumentEditorElement().offsetHeight - height;
        this.resultsListBlock.style.height = resultsContainerHeight + 'px';
        this.replaceTabContentDiv.style.display = 'none';
        this.findDiv.style.display = 'block';
        this.messageDiv.style.display = 'block';
        this.focusedElement = [];
        this.focusedElement.push(this.closeButton, this.searchInput, this.searchIcon, this.navigateToPreviousResult, this.navigateToNextResult, this.matchInput, this.wholeInput);
        this.focusedIndex = 1;
        this.searchInput.select();
        this.getMessageDivHeight();
    }
    private getMessageDivHeight(): void {
        if (!this.isOptionsPane && this.messageDiv.classList.contains('e-de-op-msg')) {
            this.messageDiv.classList.add('e-de-op-replace-messagediv');
            this.messageDiv.classList.remove('e-de-op-msg');
        } else if (this.isOptionsPane && this.messageDiv.classList.contains('e-de-op-replace-messagediv')) {
            this.messageDiv.classList.add('e-de-op-msg');
            this.messageDiv.classList.remove('e-de-op-replace-messagediv');
        }
    }
    /**
     * @returns {void}
     */
    private onEnableDisableReplaceButton = (): void => {
        if (this.searchInput.value.length !== 0) {
            (this.replaceButton as HTMLButtonElement).disabled = false;
            (this.replaceAllButton as HTMLButtonElement).disabled = false;
        } else {
            (this.replaceButton as HTMLButtonElement).disabled = true;
            (this.replaceAllButton as HTMLButtonElement).disabled = true;
        }
    }
    /**
     * Enable replace pane only.
     *
     * @private
     * @returns {void}
     */
    public onReplacePane(): void {
        this.findDiv.style.display = 'block';
        this.replaceDiv.style.display = 'block';
        this.replaceTabContentDiv.style.display = 'block';
        let height: number = this.isOptionsPane ? 215 : 292;
        let resultsContainerHeight: number = this.documentHelper.owner.getDocumentEditorElement().offsetHeight - height;
        this.resultsListBlock.style.height = resultsContainerHeight + 'px';
        this.isOptionsPane = false;
        if (this.searchInput.value.length !== 0) {
            (this.replaceButton as HTMLButtonElement).disabled = false;
            (this.replaceAllButton as HTMLButtonElement).disabled = false;
        } else {
            (this.replaceButton as HTMLButtonElement).disabled = true;
            (this.replaceAllButton as HTMLButtonElement).disabled = true;
        }
        this.focusedElement = [];
        this.focusedElement.push(this.closeButton, this.searchInput, this.searchIcon, this.navigateToPreviousResult, this.navigateToNextResult, this.matchInput, this.wholeInput, this.replaceWith, this.replaceButton, this.replaceAllButton);
        this.focusedIndex = 1;
        if (this.searchInput.value === '') {
            this.searchInput.select();
        } else {
            this.replaceWith.select();
        }
        this.getMessageDivHeight();
    }
    /**
     * Fires on key down on options pane.
     * 
     * @private
     * @param {KeyboardEvent} event - Specifies the focus of current element.
     * @returns {void}
     */
    public onKeyDownOnOptionPane = (event: KeyboardEvent): void => {
        // if (event.keyCode === 70) {
        //     event.preventDefault();
        //     return;
        // }
        if (event.keyCode === 9) {
            event.preventDefault();
            let focusIndex: number = undefined;
            if (event.shiftKey) {
                focusIndex = (this.focusedIndex === 0 || isNullOrUndefined(this.focusedIndex)) ?
                    this.focusedElement.length - 1 : this.focusedIndex - 1;
            } else {
                focusIndex = (this.focusedElement.length - 1 === this.focusedIndex || isNullOrUndefined(this.focusedIndex)) ?
                    0 : this.focusedIndex + 1;
            }
            let element: HTMLElement = this.focusedElement[focusIndex];
            element.focus();
            if (element instanceof HTMLInputElement) {
                element.select();
            }
            this.focusedIndex = focusIndex;
            if (element instanceof HTMLLIElement) {
                this.scrollToPosition(element);
            }
        } else if (event.keyCode === 13) {
            this.hideMatchDiv();
            if (event.target !== this.searchInput && event.target !== this.closeButton) {
                event.preventDefault();
                let index: number = this.focusedElement.indexOf(event.target as HTMLElement);
                if (index !== -1) {
                    let list: HTMLLIElement = this.focusedElement[index] as HTMLLIElement;
                    list.click();
                    list.focus();
                    this.focusedIndex = index;
                }
            }
        } else if (event.keyCode === 40 || event.keyCode === 38) {
            if (this.resultsListBlock.style.display !== 'none') {
                let index: number;
                let element: HTMLElement;
                if (event.keyCode === 40) {
                    if (this.focusedIndex > 7) {
                        if (this.focusedIndex + 1 < this.focusedElement.length) {
                            element = this.focusedElement[this.focusedIndex + 1];
                            element.focus();
                            this.focusedIndex = this.focusedIndex + 1;
                        }
                    } else {
                        index = (this.focusedElement.length - this.resultsListBlock.children.length) + this.results.currentIndex + 1;
                        if (index < this.focusedElement.length) {
                            element = this.focusedElement[index];
                            element.focus();
                            this.focusedIndex = index;
                        }
                    }
                } else {
                    if (this.focusedIndex > 6) {
                        index = this.focusedIndex - 1;
                        element = this.focusedElement[index];
                        element.focus();
                        this.focusedIndex = index;
                    }
                }
            }
        }
    }
    /**
     * Fires on replace.
     *
     * @private
     * @returns {void}
     */
    public onReplaceButtonClick = (): void => {
        let optionsPane: HTMLElement = this.optionsPane;
        let findText: string = this.searchInput.value;
        let replaceText: string = this.replaceWith.value;
        let results: TextSearchResults = this.documentHelper.owner.searchModule.textSearchResults;
        if (findText !== '' && !isNullOrUndefined(findText)) {
            if (this.documentHelper.owner.selection != null) {
                let selectionText: string = this.documentHelper.owner.selection.text;
                if (!this.documentHelper.owner.selection.isEmpty) {
                    if (this.documentHelper.owner.selection.isForward) {
                        this.documentHelper.owner.selection.selectContent(this.documentHelper.owner.selection.start, true);
                    } else {
                        this.documentHelper.owner.selection.selectContent(this.documentHelper.owner.selection.end, true);
                    }
                }
                if (!isNullOrUndefined(results) && !isNullOrUndefined(results.currentSearchResult)) {
                    let result: TextSearchResult = results.currentSearchResult;
                    this.documentHelper.owner.searchModule.navigate(result);
                    if (result.text === selectionText) {
                        let replace: string = isNullOrUndefined(replaceText) ? '' : replaceText;
                        this.documentHelper.owner.searchModule.replace(replace, result, results);
                        let pattern: RegExp = this.documentHelper.owner.searchModule.textSearch.stringToRegex(findText, this.findOption);
                        let endSelection: TextPosition = this.documentHelper.selection.end;
                        let index: string = endSelection.getHierarchicalIndexInternal();
                        this.results = this.documentHelper.owner.searchModule.textSearch.findAll(pattern, this.findOption, index);
                        if (!isNullOrUndefined(this.results) && !isNullOrUndefined(this.results.currentSearchResult)) {
                            this.documentHelper.owner.searchModule.navigate(this.results.currentSearchResult);
                        } else {
                            this.messageDiv.style.display = 'block';
                            this.messageDiv.innerHTML = this.localeValue.getConstant(this.matchDivReplaceText);
                        }
                        this.documentHelper.owner.findResultsList = [];
                        if (!isNullOrUndefined(this.results) && this.results.innerList.length > 0) {
                            this.navigateSearchResult(true);
                        } else {
                            this.resultsListBlock.innerHTML = '';
                        }
                    } else {
                        this.documentHelper.owner.search.findAll(findText, this.findOption);
                    }
                } else {
                    this.documentHelper.owner.search.findAll(findText, this.findOption);
                    this.messageDiv.style.display = 'block';
                    this.messageDiv.innerHTML = this.localeValue.getConstant(this.matchDivReplaceText);
                }
            }
        }
    }
    /**
     * Fires on replace all.
     *
     * @private
     * @returns {void}
     */
    public onReplaceAllButtonClick = (): void => {
        this.replaceAll();
        this.resultsListBlock.style.display = 'none';
        this.messageDiv.innerHTML = '';
    }
    /**
     * Replace all.
     *
     * @private
     * @returns {void}
     */
    public replaceAll(): void {
        let optionsPane: HTMLElement = this.optionsPane;
        let findText: string = this.searchInput.value;
        let replaceText: string = this.replaceWith.value;
        if (findText !== '' && !isNullOrUndefined(findText)) {
            let pattern: RegExp = this.documentHelper.owner.searchModule.textSearch.stringToRegex(findText, this.findOption);
            let endSelection: TextPosition = this.documentHelper.selection.end;
            let index: string = endSelection.getHierarchicalIndexInternal();
            let results: TextSearchResults = this.documentHelper.owner.searchModule.textSearch.findAll(pattern, this.findOption, index);
            let replace: string = isNullOrUndefined(replaceText) ? '' : replaceText;
            let count: number = isNullOrUndefined(results) ? 0 : results.length;
            this.documentHelper.owner.searchModule.replaceAll(replace, results);
            this.matchDiv.style.display = 'block';
            this.matchDiv.innerHTML = this.localeValue.getConstant('All Done') + '!';
            this.occurrenceDiv.style.display = 'block';
            this.occurrenceDiv.innerHTML = this.localeValue.getConstant('We replaced all') + ' ' + count + ' ' + this.localeValue.getConstant('instances') + ' ' + this.localeValue.getConstant('of') + ' "' + findText + '" ' + this.localeValue.getConstant('with') + ' "' + replaceText + '" ';
        }
    }
    private hideMatchDiv(): void {
        this.matchDiv.style.display = 'none';
        this.occurrenceDiv.style.display = 'none';
    }
    /**
     * Fires on search icon.
     * 
     * @private
     * @returns {void}
     */
    public searchIconClickInternal = (): void => {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        let inputElement: any = document.getElementById(this.documentHelper.owner.containerId + '_option_search_text_box');
        /* eslint-enable @typescript-eslint/no-explicit-any */
        let text: string = inputElement.value;
        if (text === '') {
            return;
        }
        this.hideMatchDiv();
        if (this.searchIcon.classList.contains('e-de-op-search-close-icon')) {
            this.searchIcon.classList.add('e-de-op-search-icon');
            this.searchIcon.classList.remove('e-de-op-search-close-icon');
            inputElement.value = '';
            this.messageDiv.innerHTML = this.localeValue.getConstant('No matches');
            this.resultContainer.style.display = 'block';
            this.resultsListBlock.style.display = 'none';
            this.matchDiv.style.display = 'none';
            this.occurrenceDiv.style.display = 'none';
            this.onEnableDisableReplaceButton();
            this.clearFocusElement();
            this.resultsListBlock.innerHTML = '';
            this.clearSearchResultItems();
            this.documentHelper.owner.searchModule.clearSearchHighlight();
            this.viewer.renderVisiblePages();
            return;
        }
        if (this.searchIcon.classList.contains('e-de-op-search-icon') && text.length >= 1) {
            this.searchIcon.classList.add('e-de-op-search-close-icon');
            this.searchIcon.classList.remove('e-de-op-search-icon');
            this.onEnableDisableReplaceButton();
        }
        this.clearSearchResultItems();
        this.documentHelper.owner.searchModule.clearSearchHighlight();
        let patterns: RegExp = this.documentHelper.owner.searchModule.textSearch.stringToRegex(text, this.findOption);
        let endSelection: TextPosition = this.documentHelper.selection.end;
        let index: string = endSelection.getHierarchicalIndexInternal();
        this.results = this.documentHelper.owner.searchModule.textSearch.findAll(patterns, this.findOption, index);
        if (this.results != null && this.results.length > 0) {
            let start: TextPosition = this.results.innerList[this.results.currentIndex].start;
            let end: TextPosition = this.results.innerList[this.results.currentIndex].end;
            this.documentHelper.scrollToPosition(start, end, true);
            this.navigateSearchResult(false);
            this.getMessageDivHeight();
            let height: number = this.isOptionsPane ? 215 : 292;
            let resultsContainerHeight: number = this.documentHelper.owner.getDocumentEditorElement().offsetHeight - height;
            this.resultsListBlock.style.height = resultsContainerHeight + 'px';
        } else {
            this.messageDiv.innerHTML = this.localeValue.getConstant('No matches');
            this.resultContainer.style.display = 'block';
            this.resultsListBlock.style.display = 'none';
            this.clearFocusElement();
            this.resultsListBlock.innerHTML = '';
        }
    }
    /**
     * Fires on getting next results.
     *
     * @private
     * @returns {void}
     */
    public navigateNextResultButtonClick = (): void => {
        if (document.getElementById(this.documentHelper.owner.containerId + '_list_box_container') != null &&
            document.getElementById(this.documentHelper.owner.containerId + '_list_box_container').style.display !== 'none') {
            let selectionEnd: TextPosition = this.documentHelper.owner.selection.end;
            let nextResult: TextSearchResult;
            let currentIndex: number = 0;
            if (selectionEnd.isExistAfter(this.results.currentSearchResult.start)) {
                currentIndex = this.results.currentIndex;
            }
            for (let i: number = currentIndex; i < this.results.length; i++) {
                let result: TextSearchResult = this.results.innerList[i];
                if (selectionEnd.isExistBefore(result.start) || selectionEnd.isAtSamePosition(result.start)) {
                    nextResult = result;
                    this.results.currentIndex = i;
                    break;
                }
            }
            if (isNullOrUndefined(nextResult)) {
                this.results.currentIndex = 0;
                nextResult = this.results.innerList[0];
            }
            this.messageDiv.innerHTML = this.localeValue.getConstant('Result') + ' ' + (this.results.currentIndex + 1) + ' ' + this.localeValue.getConstant('of') + ' ' + this.resultsListBlock.children.length;
            this.updateListItems(nextResult);
            this.focusedIndex = this.focusedElement.indexOf(this.navigateToNextResult);
        }
    }
    private updateListItems(textSearchResult: TextSearchResult): void {
        let searchElements: HTMLCollectionOf<Element> = this.resultsListBlock.getElementsByClassName('e-de-search-result-hglt');
        for (let j: number = 0; j < searchElements.length; j++) {
            let list: HTMLElement = searchElements[j] as HTMLElement;
            classList(list, ['e-de-search-result-item'], ['e-de-search-result-hglt']);
            classList(list.children[0], [], ['e-de-op-search-word-text']);
        }
        let listElement: HTMLElement = this.resultsListBlock.children[this.results.currentIndex] as HTMLElement;
        classList(listElement, ['e-de-search-result-hglt'], ['e-de-search-result-item']);
        classList(listElement.children[0], ['e-de-op-search-word-text'], []);
        this.scrollToPosition(listElement);
        this.documentHelper.owner.searchModule.navigate(textSearchResult);
        this.documentHelper.owner.searchModule.highlight(this.results);
    }
    /**
     * Fires on getting previous results.
     *
     * @private
     * @returns {void}
     */
    public navigatePreviousResultButtonClick = (): void => {
        if (document.getElementById(this.documentHelper.owner.containerId + '_list_box_container') != null &&
            document.getElementById(this.documentHelper.owner.containerId + '_list_box_container').style.display !== 'none') {
            let previousResult: TextSearchResult;
            let selectionStart: TextPosition = this.documentHelper.owner.selection.start;
            let currentIndex: number = this.results.currentIndex;
            if (selectionStart.isExistAfter(this.results.currentSearchResult.start)) {
                currentIndex = this.results.length - 1;
            }
            for (let i: number = currentIndex; i >= 0; i--) {
                let result: TextSearchResult = this.results.innerList[i];
                if (selectionStart.isExistAfter(result.start) || this.documentHelper.owner.selection.end.isAtSamePosition(result.start)) {
                    previousResult = result;
                    this.results.currentIndex = i;
                    break;
                }
            }
            if (isNullOrUndefined(previousResult)) {
                this.results.currentIndex = this.results.length - 1;
                previousResult = this.results.innerList[this.results.currentIndex];
            }
            this.messageDiv.innerHTML = this.localeValue.getConstant('Result') + ' ' + (this.results.currentIndex + 1) + ' ' + this.localeValue.getConstant('of') + ' ' + this.resultsListBlock.children.length;
            this.updateListItems(previousResult);
            this.focusedIndex = this.focusedElement.indexOf(this.navigateToPreviousResult);
        }
    }
    /**
     * Scrolls to position.
     *
     * @private 
     * @param {HTMLElement} list - Specifies the list element.
     * @returns {void}
     */
    public scrollToPosition(list: HTMLElement): void {
        let rect: ClientRect = list.getBoundingClientRect();
        let top: number;
        if (rect.top > 0) {
            top = rect.top - list.parentElement.getBoundingClientRect().top;
            if ((list.parentElement.offsetHeight - top) <= list.offsetHeight) {
                if (Math.ceil(top + list.offsetHeight) === list.parentElement.scrollHeight) {
                    list.parentElement.scrollTop = top;
                }
                list.parentElement.scrollTop = list.parentElement.scrollTop + (list.parentElement.offsetHeight / 100) * 30;
            } else if (top < 0) {
                list.parentElement.scrollTop = list.parentElement.scrollTop - (list.parentElement.offsetHeight / 100) * 30;
            }
        } else {
            list.parentElement.scrollTop = 0;
        }
    }
    /**
     * Fires on key down
     *
     * @private
     * @param {KeyboardEvent} event - Speficies key down actions.
     * @returns {void}
     */
    public onKeyDown = (event: KeyboardEvent): void => {
        let code: number = event.which || event.keyCode;
        if (code === 13 && event.keyCode !== 9 && event.keyCode !== 40) {
            event.preventDefault();
            this.findDiv.style.height = '';
            this.onKeyDownInternal();
        } else if (code === 8 && (this.searchInput.value.length === 0)) {
            this.resultContainer.style.display = 'block';
        } else if (event.keyCode !== 9 && event.keyCode !== 40 && event.keyCode !== 27) {
            this.documentHelper.owner.searchModule.clearSearchHighlight();
            this.clearSearchResultItems();
            this.viewer.renderVisiblePages();
            this.resultsListBlock.style.display = 'none';
            this.messageDiv.innerHTML = this.localeValue.getConstant('No matches');
            this.resultContainer.style.display = 'none';
            this.clearFocusElement();
            this.resultsListBlock.innerHTML = '';
            if (this.searchIcon.classList.contains('e-de-op-search-close-icon')) {
                this.searchIcon.classList.add('e-de-op-search-icon');
                this.searchIcon.classList.remove('e-de-op-search-close-icon');
            }
        } else if (code === 27 && event.keyCode === 27) {
            this.showHideOptionsPane(false);
        }
    }
    /**
     * Clear the focus elements.
     *
     * @private
     * @returns {void}
     */
    public clearFocusElement(): void {
        for (let i: number = 0; i < this.resultsListBlock.children.length; i++) {
            let index: number = this.focusedElement.indexOf(this.resultsListBlock.children[i] as HTMLElement);
            if (index !== -1) {
                this.focusedElement.splice(index, 1);
            }
        }
        this.focusedIndex = 1;
    }
    /**
     * Close the optios pane.
     *
     * @private
     * @returns {void}
     */
    public close = (): void => {
        this.clearFocusElement();
        this.showHideOptionsPane(false);
        this.resultsListBlock.innerHTML = '';
        this.focusedIndex = 1;
        this.isOptionsPane = true;
    }
    /**
     * Fires on results list block.
     *
     * @private
     * @param {MouseEvent} args - Specifies which list was clicked.
     * @returns {void}
     */
    public resultListBlockClick = (args: MouseEvent): void => {
        let currentlist: EventTarget = args.target;
        let element: HTMLCollection = this.resultsListBlock.children;
        let index: number = 0;
        for (let i: number = 0; i < element.length; i++) {
            let list: HTMLElement = element[i] as HTMLElement;
            if (list.classList.contains('e-de-search-result-hglt')) {
                list.classList.remove('e-de-search-result-hglt');
                list.children[0].classList.remove('e-de-op-search-word-text');
                list.classList.add('e-de-search-result-item');
            }
        }
        let list: HTMLElement;
        for (let i: number = 0; i < element.length; i++) {
            if (currentlist === element[i]) {
                index = i;
                list = element[i] as HTMLElement;
                if (list.classList.contains('e-de-search-result-item')) {
                    list.classList.remove('e-de-search-result-item');
                    list.classList.add('e-de-search-result-hglt');
                    list.children[0].classList.add('e-de-op-search-word-text');
                    this.focusedIndex = this.focusedElement.indexOf(list);
                }
            }
        }
        let currentelement: TextSearchResult = this.results.innerList[index];
        this.results.currentIndex = index;
        this.messageDiv.innerHTML = this.localeValue.getConstant('Result') + ' ' + (index + 1) + ' ' + this.localeValue.getConstant('of') + ' ' + this.resultsListBlock.children.length;
        this.documentHelper.owner.searchModule.navigate(currentelement);
        this.documentHelper.owner.searchModule.highlight(this.results);
        if (list) {
            list.focus();
        }
    }
    /**
     * Show or hide option pane based on boolean value.
     *
     * @private
     * @param {boolean} show - Specifies showing or hiding the options pane.
     * @returns {void}
     */
    public showHideOptionsPane(show: boolean): void {
        if (!isNullOrUndefined(this.documentHelper.owner.selectionModule)) {
            if (show) {
                this.localeValue = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
                this.localeValue.setLocale(this.documentHelper.owner.locale);
                if (isNullOrUndefined(this.optionsPane)) {
                    this.initOptionsPane(this.localeValue, this.documentHelper.owner.enableRtl);
                    //Add Option Pane
                    let isRtl: boolean = this.documentHelper.owner.enableRtl;
                    let optionsPaneContainerStyle: string;
                    if (isRtl) {
                        optionsPaneContainerStyle = 'display:inline-flex;direction:rtl;';
                    } else {
                        optionsPaneContainerStyle = 'display:inline-flex;';
                    }
                    this.documentHelper.optionsPaneContainer.setAttribute('style', optionsPaneContainerStyle);
                    this.documentHelper.optionsPaneContainer.insertBefore(this.documentHelper.owner.optionsPaneModule.optionsPane, this.documentHelper.viewerContainer);
                }
                this.optionsPane.style.display = 'block';
                if (this.documentHelper.owner.isReadOnlyMode) {
                    this.tabInstance.hideTab(1);
                } else {
                    this.tabInstance.hideTab(1, false);
                }
                if (this.isReplace && !this.documentHelper.owner.isReadOnlyMode) {
                    this.tabInstance.select(1);
                    this.isReplace = false;
                    this.isOptionsPane = false;
                } else {
                    this.tabInstance.select(0);
                }
                this.searchDiv.innerHTML = this.localeValue.getConstant(this.searchText);
                this.isOptionsPaneShow = true;
                let textBox: HTMLInputElement = document.getElementById(this.documentHelper.owner.getDocumentEditorElement().id + '_option_search_text_box') as HTMLInputElement;
                let selectedText: string = this.documentHelper.owner.selection.text;
                if (!isNullOrUndefined(selectedText)) {
                    let char: string[] = ['\v', '\r'];
                    let index: number = HelperMethods.indexOfAny(selectedText, char);
                    selectedText = index < 0 ? selectedText : selectedText.substring(0, index);
                }
                textBox.value = selectedText;
                textBox.select();
                this.messageDiv.innerHTML = '';
                if (this.searchIcon.classList.contains('e-de-op-search-close-icon')) {
                    this.searchIcon.classList.add('e-de-op-search-icon');
                    this.searchIcon.classList.remove('e-de-op-search-close-icon');
                }
                this.documentHelper.selection.caret.style.display = 'none';
                this.focusedIndex = 1;
                this.focusedElement = [];
                if (this.isOptionsPane) {
                    this.focusedElement.push(this.closeButton, this.searchInput, this.searchIcon, this.navigateToPreviousResult, this.navigateToNextResult, this.matchInput, this.wholeInput);
                } else {
                    this.focusedElement.push(this.closeButton, this.searchInput, this.searchIcon, this.navigateToPreviousResult, this.navigateToNextResult, this.matchInput, this.wholeInput, this.replaceWith, this.replaceButton, this.replaceAllButton);
                }
                this.documentHelper.updateViewerSize();
            } else {
                if (!isNullOrUndefined(this.optionsPane)) {
                    this.clearSearchResultItems();
                    this.documentHelper.owner.searchModule.clearSearchHighlight();
                    this.isOptionsPaneShow = false;
                    let resultListBox: HTMLElement = document.getElementById(this.documentHelper.owner.containerId + '_list_box_container');
                    let message: HTMLElement = document.getElementById(this.documentHelper.owner.containerId + '_search_status');
                    if (!isNullOrUndefined(resultListBox) && !isNullOrUndefined(message)) {
                        resultListBox.style.display = 'none';
                        this.clearFocusElement();
                        resultListBox.innerHTML = '';
                        message.innerHTML = this.localeValue.getConstant('No matches');
                    }
                }
                this.documentHelper.updateViewerSize();
                if (!isNullOrUndefined(this.optionsPane)) {
                    if (this.optionsPane.style.display !== 'none') {
                        this.documentHelper.selection.updateCaretPosition();
                        this.optionsPane.style.display = 'none';
                    }
                }
                this.documentHelper.updateFocus();
                this.documentHelper.selection.caret.style.display = 'block';
            }
        }
    }

    /**
     * Clears search results.
     *
     * @private
     * @returns {void}
     */
    public clearSearchResultItems(): void {
        if (!isNullOrUndefined(this.documentHelper.owner.findResultsList)) {
            this.documentHelper.owner.findResultsList = [];
        }
    }
    /**
     * Dispose the internal objects which are maintained.
     *
     * @private
     * @returns {void}
     */
    public destroy(): void {
        if (this.optionsPane) {
            this.optionsPane.innerHTML = '';
            this.optionsPane = undefined;
        }
        if (this.resultsListBlock) {
            this.resultsListBlock.innerHTML = '';
            this.resultsListBlock = undefined;
        }
        if (this.messageDiv) {
            this.messageDiv.innerHTML = '';
            this.messageDiv = undefined;
        }
        if (this.resultContainer) {
            this.resultContainer.innerHTML = '';
        }
        this.resultContainer = undefined;
        if (this.searchInput) {
            this.searchInput.value = '';
            this.searchInput = undefined;
        }
        if (this.searchDiv) {
            this.searchDiv.innerHTML = '';
            this.searchDiv = undefined;
        }
        if (this.searchTextBoxContainer) {
            this.searchTextBoxContainer.innerHTML = '';
            this.searchTextBoxContainer = undefined;
        }
        if (this.replaceWith) {
            this.replaceWith.innerHTML = '';
            this.replaceWith = undefined;
        }
        if (this.findDiv) {
            this.findDiv.innerHTML = '';
            this.findDiv = undefined;
        }
        if (this.replaceButton) {
            this.replaceButton.innerHTML = '';
            this.replaceButton = undefined;
        }
        if (this.replaceAllButton) {
            this.replaceAllButton.innerHTML = '';
            this.replaceAllButton = undefined;
        }
        if (this.matchInput) {
            this.matchInput.innerHTML = '';
            this.matchCase = undefined;
        }
        if (this.wholeInput) {
            this.wholeInput.innerHTML = '';
            this.wholeWord = undefined;
        }
        // if (this.regularInput) {
        //     this.regularInput.innerHTML = '';
        //     this.regular = undefined;
        // }
        if (!isNullOrUndefined(this.results)) {
            this.results.destroy();
        }
        if (this.focusedElement) {
            this.focusedElement = [];
        }
        this.focusedElement = undefined;
        this.destroyInternal();
    }
    /**
     * Dispose the internal objects which are maintained.
     *
     * @returns {void}
     */
    private destroyInternal(): void {
        if (this.searchText) {
            this.searchText = undefined;
        }
        if (this.resultsText) {
            this.resultsText = undefined;
        }
        if (this.messageDivText) {
            this.messageDivText = undefined;
        }
        if (this.replaceButtonText) {
            this.replaceButtonText = undefined;
        }
        if (this.replaceAllButtonText) {
            this.replaceAllButtonText = undefined;
        }
    }
}
