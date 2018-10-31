import { LayoutViewer } from '../index';
import { TextSearchResults } from './text-search-results';
import { TextSearchResult } from './text-search-result';
import { createElement, isNullOrUndefined, L10n, setCulture } from '@syncfusion/ej2-base';
import { FindOption } from '../../base/types';
import { TextPosition } from '../selection/selection-helper';
import { HelperMethods } from '../editor/editor-helper';
import { CheckBox, ChangeEventArgs } from '@syncfusion/ej2-buttons';
import { Tab, SelectEventArgs } from '@syncfusion/ej2-navigations';

/**
 * Options Pane class.
 */
export class OptionsPane {
    private viewer: LayoutViewer;
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
    private isOptionsPane: Boolean = true;
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
    private findTabButtonHeader: HTMLElement;
    private replaceTabButtonHeader: HTMLElement;
    /**
     * @private
     */
    public isReplace: boolean = false;
    private localeValue: L10n;
    /**
     * Constructor for Options pane module
     * @param {LayoutViewer} layoutViewer 
     * @private
     */
    constructor(layoutViewer: LayoutViewer) {
        this.viewer = layoutViewer;
    }
    /**
     * Get the module name.
     */
    private getModuleName(): string {
        return 'OptionsPane';
    }
    /**
     * Initialize the options pane.
     * @param {L10n} localeValue - Specifies the localization based on culture.
     * @private
     */
    // tslint:disable:max-func-body-length
    public initOptionsPane(localeValue: L10n): void {
        let viewer: LayoutViewer = this.viewer;
        this.localeValue = localeValue;
        this.optionsPane = createElement('div', { className: 'e-de-op', styles: 'display:none;' });
        this.optionsPane.addEventListener('keydown', this.onKeyDownOnOptionPane);
        this.searchDiv = createElement('div', {
            className: this.viewer.owner.containerId + '_searchDiv e-de-op-header',
            innerHTML: localeValue.getConstant(this.searchText)
        });
        this.optionsPane.appendChild(this.searchDiv);
        // tslint:disable-next-line:max-line-length
        this.closeButton = createElement('button', { className: 'e-de-op-close-button e-de-op-icon-btn e-btn e-flat e-icon-btn', id: 'close' });
        this.optionsPane.appendChild(this.closeButton);
        let closeSpan: HTMLSpanElement = createElement('span', { className: 'e-de-op-close-icon e-btn-icon e-icons' });
        this.closeButton.appendChild(closeSpan);
        this.focusedElement.push(this.closeButton);
        this.findTab = createElement('div', { id: this.viewer.owner.containerId + '_findTabDiv', className: 'e-de-op-tab' });
        this.optionsPane.appendChild(this.findTab);
        let tabHeader: HTMLElement = createElement('div', { className: 'e-tab-header' });
        this.findTab.appendChild(tabHeader);
        this.findTabButton = createElement('div', { innerHTML: localeValue.getConstant(this.findPaneText) });
        this.focusedElement.push(this.findTabButtonHeader);
        tabHeader.appendChild(this.findTabButton);
        this.replaceTabButton = createElement('div', { innerHTML: localeValue.getConstant(this.replacePaneText) });
        this.focusedElement.push(this.replaceTabButtonHeader);
        tabHeader.appendChild(this.replaceTabButton);
        let tabContent: HTMLElement = createElement('div', { className: 'e-content' });
        let findTabContent: HTMLElement = createElement('div', { id: 'findTabContent' });
        tabContent.appendChild(findTabContent);
        this.findTabContentDiv = createElement('div', { className: 'e-de-search-tab-content' });
        this.searchTextBoxContainer = createElement('div', { className: 'e-input-group e-de-op-input-group' });
        this.findTabContentDiv.appendChild(this.searchTextBoxContainer);
        // tslint:disable-next-line:max-line-length
        this.searchInput = createElement('input', { className: 'e-input e-de-search-input', id: this.viewer.owner.containerId + '_option_search_text_box', attrs: { placeholder: 'Search for' }, styles: 'font-size:14px;' }) as HTMLInputElement;
        this.searchTextBoxContainer.appendChild(this.searchInput);
        this.searchIcon = createElement('span', {
            className: 'e-de-op-icon e-de-op-search-icon e-input-group-icon e-icon',
            id: this.viewer.owner.containerId + '_search-icon'
        });
        this.searchIcon.tabIndex = 0;
        this.searchTextBoxContainer.appendChild(this.searchIcon);
        this.focusedElement.push(this.searchIcon);
        // tslint:disable-next-line:max-line-length
        this.navigateToPreviousResult = createElement('span', { className: 'e-de-op-icon e-de-op-nav-btn e-arrow-up e-spin-up e-btn-icon e-icon e-input-group-icon' });
        this.navigateToPreviousResult.tabIndex = 0;
        this.searchTextBoxContainer.appendChild(this.navigateToPreviousResult);
        this.focusedElement.push(this.navigateToPreviousResult);
        // tslint:disable-next-line:max-line-length
        this.navigateToNextResult = createElement('span', { className: 'e-de-op-icon e-de-op-nav-btn e-arrow-down e-spin-down e-btn-icon e-icon e-input-group-icon' });
        this.navigateToNextResult.tabIndex = 0;
        this.searchTextBoxContainer.appendChild(this.navigateToNextResult);
        this.focusedElement.push(this.navigateToNextResult);
        let div: HTMLElement = createElement('div', { className: 'e-de-op-more-less' });
        this.matchInput = createElement('input', {
            attrs: { type: 'checkbox' },
            id: this.viewer.owner.containerId + '_matchCase'
        }) as HTMLInputElement;
        div.appendChild(this.matchInput);
        this.matchCase = new CheckBox({ label: 'Match case', checked: false, change: this.matchChange });
        this.matchCase.appendTo(this.matchInput);
        this.focusedElement.push(this.matchInput);
        this.matchInput.tabIndex = 0;
        this.wholeInput = createElement('input', {
            attrs: { type: 'checkbox' },
            id: this.viewer.owner.containerId + '_wholeWord',
        }) as HTMLInputElement;
        div.appendChild(this.wholeInput);
        this.wholeWord = new CheckBox({ label: 'Whole words', checked: false, change: this.wholeWordsChange });
        this.wholeWord.appendTo(this.wholeInput);
        this.focusedElement.push(this.wholeInput);
        this.wholeInput.tabIndex = 0;
        this.findTabContentDiv.appendChild(div);
        let replaceTabContent: HTMLElement = createElement('div');
        tabContent.appendChild(replaceTabContent);
        this.replaceTabContentDiv = createElement('div', { className: 'e-de-op-replacetabcontentdiv', styles: 'display:none;' });
        tabContent.appendChild(this.replaceTabContentDiv);
        this.findTabContentDiv.appendChild(this.replaceTabContentDiv);
        this.createReplacePane();
        this.findDiv = createElement('div', { className: 'findDiv', styles: 'height:250px;display:block;' });
        findTabContent.appendChild(this.findTabContentDiv);
        this.resultContainer = createElement('div', { styles: 'width:85%;display:block;', className: 'e-de-op-result-container' });
        this.findDiv.appendChild(this.resultContainer);
        // tslint:disable-next-line:max-line-length
        this.messageDiv = createElement('div', { className: this.viewer.owner.containerId + '_messageDiv e-de-op-msg', innerHTML: this.localeValue.getConstant(this.messageDivText), id: this.viewer.owner.containerId + '_search_status' });
        this.resultContainer.appendChild(this.messageDiv);
        // tslint:disable-next-line:max-line-length
        this.resultsListBlock = createElement('div', { id: this.viewer.owner.containerId + '_list_box_container', styles: 'display:none;width:270px;list-style:none;padding-right:5px;overflow:auto;', className: 'e-de-result-list-block' });
        this.findDiv.appendChild(this.resultsListBlock);
        this.findTabContentDiv.appendChild(this.findDiv);
        this.findTab.appendChild(tabContent);
        this.tabInstance = new Tab({ selected: this.selectedTabItem });
        this.tabInstance.appendTo(this.findTab);
        let findHeader: HTMLElement = this.tabInstance.element.getElementsByClassName('e-item e-toolbar-item')[0] as HTMLElement;
        this.findTabButtonHeader = findHeader.getElementsByClassName('e-tab-wrap')[0] as HTMLElement;
        this.findTabButtonHeader.classList.add('e-de-op-find-tab-header');
        this.findTabButtonHeader.tabIndex = 0;
        let replaceHeader: HTMLElement = this.tabInstance.element.getElementsByClassName('e-item e-toolbar-item')[1] as HTMLElement;
        this.replaceTabButtonHeader = replaceHeader.getElementsByClassName('e-tab-wrap')[0] as HTMLElement;
        this.replaceTabButtonHeader.classList.add('e-de-op-replace-tab-header');
        this.replaceTabButtonHeader.tabIndex = 0;
        this.onWireEvents();
    }
    /**
     * Create replace pane instances.
     */
    private createReplacePane(): void {
        this.replaceDiv = createElement('div');
        this.replaceTabContentDiv.appendChild(this.replaceDiv);
        this.replaceWith = createElement('input', {
            className: 'e-de-op-replacewith e-input', styles: 'font-size:14px;',
            attrs: { placeholder: 'Replace with' }
        }) as HTMLInputElement;
        this.replaceDiv.appendChild(this.replaceWith);
        let replaceButtonDiv: HTMLElement = createElement('div', { styles: 'text-align:right;', className: 'e-de-op-dlg-footer' });
        this.replaceDiv.appendChild(replaceButtonDiv);
        this.replaceButton = createElement('button', {
            className: 'e-control e-btn e-flat e-replace',
            styles: 'font-size:12px;margin-right:10px;',
            innerHTML: this.localeValue.getConstant(this.replaceButtonText)
        });
        replaceButtonDiv.appendChild(this.replaceButton);
        this.replaceAllButton = createElement('button', {
            className: 'e-control e-btn e-flat e-replaceall',
            styles: 'font-size:12px;',
            innerHTML: this.localeValue.getConstant(this.replaceAllButtonText)
        });
        replaceButtonDiv.appendChild(this.replaceAllButton);
        this.matchDiv = createElement('div', { styles: 'display:none;padding-top:10px;' });
        this.replaceDiv.appendChild(this.matchDiv);
        let emptyDiv6: HTMLElement = createElement('div', { className: 'e-de-op-search-replacediv' });
        this.replaceDiv.appendChild(emptyDiv6);
        this.occurrenceDiv = createElement('div', { styles: 'display:none;' });
        this.replaceDiv.appendChild(this.occurrenceDiv);
    }
    /**
     * Gets selected tab item which tab is selected.
     * @param {SelectEventArgs} args - Specifies which tab will be opened.
     * @private
     */
    public selectedTabItem = (args: SelectEventArgs): void => {
        if (args.previousIndex !== args.selectedIndex) {
            let previousTab: Element = document.querySelector('#e-content_' + args.previousIndex);
            let nextTab: Element = document.querySelector('#e-content_' + args.selectedIndex);
            nextTab.insertBefore(previousTab.firstElementChild, nextTab.firstChild);
        }
        if (args.selectedIndex === 0 && !isNullOrUndefined(document.querySelector('#e-content_' + args.selectedIndex))) {
            this.isOptionsPane = true;
            this.onFindPane();
        }
        if (args.selectedIndex === 1 && !isNullOrUndefined(document.querySelector('#e-content_' + args.selectedIndex))) {
            this.isOptionsPane = false;
            this.onReplacePane();
        }
    }
    private searchOptionChange = (): void => {
        this.clearSearchResultItems();
        this.viewer.owner.searchModule.clearSearchHighlight();
        let inputText: string = this.searchInput.value;
        if (inputText === '') {
            return;
        }
        let pattern: RegExp = this.viewer.owner.searchModule.textSearch.stringToRegex(inputText, this.findOption);
        let endSelection: TextPosition = this.viewer.selection.end;
        let selectionIndex: string = endSelection.getHierarchicalIndexInternal();
        this.results = this.viewer.owner.searchModule.textSearch.findAll(pattern, this.findOption, selectionIndex);
        if (this.results != null && this.results.length > 0) {
            this.navigateSearchResult();
        } else {
            this.viewer.renderVisiblePages();
            this.messageDiv.innerHTML = this.localeValue.getConstant('No matches');
            this.resultContainer.style.display = 'block';
            this.resultsListBlock.style.display = 'none';
            this.clearFocusElement();
            this.resultsListBlock.innerHTML = '';
        }
    }
    private navigateSearchResult(): void {
        this.viewer.owner.searchModule.navigate(this.results.innerList[this.results.currentIndex]);
        this.viewer.owner.searchModule.highlight(this.results);
        this.viewer.owner.searchModule.addFindResultView(this.results);
        this.resultsListBlock.style.display = 'block';
        this.resultContainer.style.display = 'block';
        let lists: string[] = this.viewer.owner.findResultsList;
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
        // tslint:disable-next-line:max-line-length
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
     * @param {ChangeEventArgs} args - Specifies the search options value.
     * @private
     */
    public wholeWordsChange = (args: ChangeEventArgs): void => {
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
     * @param {ChangeEventArgs} args - Specifies the search options value.
     * @private
     */
    public matchChange = (args: ChangeEventArgs): void => {
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
    /**
     * Apply find options based on regular value.
     * @param {ChangeEventArgs} args - Specifies the search options value.
     * @private
     */
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
    // tslint:enable:no-any 
    /**
     * Binding events from the element when optins pane creation.
     * @private
     */
    public onWireEvents = (): void => {
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
     * @private
     */
    public onKeyDownInternal(): void {
        // tslint:disable-next-line:max-line-length
        let inputElement: HTMLInputElement = document.getElementById(this.viewer.owner.containerId + '_option_search_text_box') as HTMLInputElement;
        inputElement.blur();
        let text: string = inputElement.value;
        if (text === '') {
            return;
        }
        if (text.length >= 1 && this.searchIcon.classList.contains('e-de-op-search-icon')) {
            this.searchIcon.classList.add('e-de-op-search-close-icon');
            this.searchIcon.classList.remove('e-de-op-search-icon');
        }
        let resultsContainerHeight: number = this.viewer.owner.getDocumentEditorElement().offsetHeight - 215;
        this.clearSearchResultItems();
        this.viewer.owner.searchModule.clearSearchHighlight();
        let pattern: RegExp = this.viewer.owner.searchModule.textSearch.stringToRegex(text, this.findOption);
        let endSelection: TextPosition = this.viewer.selection.end;
        let index: string = endSelection.getHierarchicalIndexInternal();
        this.results = this.viewer.owner.searchModule.textSearch.findAll(pattern, this.findOption, index);
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
            this.viewer.owner.searchModule.navigate(this.results.innerList[this.results.currentIndex]);
            this.viewer.owner.searchModule.highlight(results);
            this.viewer.owner.searchModule.addFindResultView(results);
            // if (this.isOptionsPane) {
            this.resultsListBlock.style.display = 'block';
            this.resultsListBlock.style.height = resultsContainerHeight + 'px';
            this.resultContainer.style.display = 'block';
            let list: string[] = this.viewer.owner.findResultsList;
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
            // tslint:disable-next-line:max-line-length
            this.messageDiv.innerHTML = this.localeValue.getConstant('Result') + ' ' + (currentIndex + 1) + ' ' + this.localeValue.getConstant('of') + ' ' + this.resultsListBlock.children.length;
            let listElement: HTMLElement = this.resultsListBlock.children[currentIndex] as HTMLElement;
            if (listElement.classList.contains('e-de-search-result-item')) {
                listElement.classList.remove('e-de-search-result-item');
                listElement.classList.add('e-de-search-result-hglt');
                listElement.children[0].classList.add('e-de-op-search-word-text');
            }
            this.navigateToNextResult.focus();
            this.focusedIndex = 6;
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
     * @private
     */
    public onFindPane = (): void => {
        this.replaceDiv.style.display = 'none';
        this.occurrenceDiv.style.display = 'none';
        if (!isNullOrUndefined(this.results) && this.results.length === 0) {
            this.resultsListBlock.innerHTML = '';
            this.resultsListBlock.style.display = 'none';
            this.messageDiv.innerHTML = this.localeValue.getConstant('No matches');
        }
        this.resultsListBlock.style.height = this.resultsListBlock.offsetHeight + this.replaceTabContentDiv.offsetHeight + 'px';
        this.replaceTabContentDiv.style.display = 'none';
        this.findDiv.style.display = 'block';
        this.messageDiv.style.display = 'block';
        this.focusedElement = [];
        // tslint:disable-next-line:max-line-length
        this.focusedElement.push(this.closeButton, this.findTabButtonHeader, this.replaceTabButtonHeader, this.searchInput, this.searchIcon, this.navigateToPreviousResult, this.navigateToNextResult, this.matchInput, this.wholeInput);
        this.focusedIndex = 3;
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
     * @private
     */
    public onReplacePane = (): void => {
        this.findDiv.style.display = 'block';
        this.replaceDiv.style.display = 'block';
        this.replaceTabContentDiv.style.display = 'block';
        this.resultsListBlock.style.height = this.resultsListBlock.offsetHeight - this.replaceTabContentDiv.offsetHeight + 'px';
        this.isOptionsPane = false;
        if (this.searchInput.value.length !== 0) {
            (this.replaceButton as HTMLButtonElement).disabled = false;
            (this.replaceAllButton as HTMLButtonElement).disabled = false;
        } else {
            (this.replaceButton as HTMLButtonElement).disabled = true;
            (this.replaceAllButton as HTMLButtonElement).disabled = true;
        }
        this.focusedElement = [];
        // tslint:disable-next-line:max-line-length
        this.focusedElement.push(this.closeButton, this.findTabButtonHeader, this.replaceTabButtonHeader, this.searchInput, this.searchIcon, this.navigateToPreviousResult, this.navigateToNextResult, this.matchInput, this.wholeInput, this.replaceWith, this.replaceButton, this.replaceAllButton);
        this.focusedIndex = 9;
        if (this.searchInput.value === '') {
            this.searchInput.select();
        } else {
            this.replaceWith.select();
        }
        this.getMessageDivHeight();
    }
    /**
     * Fires on key down on options pane.
     * @param {KeyboardEvent} event - Specifies the focus of current element.
     * @private
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
            // tslint:disable-next-line:max-line-length
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
                    if (this.focusedIndex > 8) {
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
     * @private
     */
    public onReplaceButtonClick = (): void => {
        let optionsPane: HTMLElement = this.optionsPane;
        let findText: string = this.searchInput.value;
        let replaceText: string = this.replaceWith.value;
        let results: TextSearchResults = this.viewer.owner.searchModule.textSearchResults;
        if (findText !== '' && !isNullOrUndefined(findText)) {
            if (this.viewer.owner.selection != null) {
                let selectionText: string = this.viewer.owner.selection.text;
                if (!this.viewer.owner.selection.isEmpty) {
                    if (this.viewer.owner.selection.isForward) {
                        this.viewer.owner.selection.selectContent(this.viewer.owner.selection.start, true);
                    } else {
                        this.viewer.owner.selection.selectContent(this.viewer.owner.selection.end, true);
                    }
                }
                if (!isNullOrUndefined(results) && !isNullOrUndefined(results.currentSearchResult)) {
                    let result: TextSearchResult = results.currentSearchResult;
                    this.viewer.owner.searchModule.navigate(result);
                    if (result.text === selectionText) {
                        let replace: string = isNullOrUndefined(replaceText) ? '' : replaceText;
                        this.viewer.owner.searchModule.replace(replace, result, results);
                        let pattern: RegExp = this.viewer.owner.searchModule.textSearch.stringToRegex(findText, this.findOption);
                        let endSelection: TextPosition = this.viewer.selection.end;
                        let index: string = endSelection.getHierarchicalIndexInternal();
                        // tslint:disable-next-line:max-line-length
                        this.viewer.owner.searchModule.textSearchResults = this.viewer.owner.searchModule.textSearch.findAll(pattern, this.findOption, index);
                        this.results = this.viewer.owner.searchModule.textSearchResults;
                        if (!isNullOrUndefined(this.results) && !isNullOrUndefined(this.results.currentSearchResult)) {
                            this.viewer.owner.searchModule.navigate(this.results.currentSearchResult);
                        } else {
                            this.messageDiv.style.display = 'block';
                            this.messageDiv.innerHTML = this.localeValue.getConstant(this.matchDivReplaceText);
                        }
                        this.viewer.owner.findResultsList = [];
                        if (!isNullOrUndefined(this.results) && this.results.innerList.length > 0) {
                            this.navigateSearchResult();
                        } else {
                            this.resultsListBlock.innerHTML = '';
                        }
                    }
                } else {
                    this.messageDiv.style.display = 'block';
                    this.messageDiv.innerHTML = this.localeValue.getConstant(this.matchDivReplaceText);
                }
            }
        }
    }
    /**
     * Fires on replace all.
     * @private
     */
    public onReplaceAllButtonClick = (): void => {
        this.replaceAll();
        this.resultsListBlock.style.display = 'none';
        this.messageDiv.innerHTML = '';
    }
    /**
     * Replace all.
     * @private
     */
    public replaceAll(): void {
        let optionsPane: HTMLElement = this.optionsPane;
        let findText: string = this.searchInput.value;
        let replaceText: string = this.replaceWith.value;
        if (findText !== '' && !isNullOrUndefined(findText)) {
            let pattern: RegExp = this.viewer.owner.searchModule.textSearch.stringToRegex(findText, this.findOption);
            let endSelection: TextPosition = this.viewer.selection.end;
            let index: string = endSelection.getHierarchicalIndexInternal();
            let results: TextSearchResults = this.viewer.owner.searchModule.textSearch.findAll(pattern, this.findOption, index);
            let replace: string = isNullOrUndefined(replaceText) ? '' : replaceText;
            let count: number = isNullOrUndefined(results) ? 0 : results.length;
            this.viewer.owner.searchModule.replaceAll(replace, results);
            this.matchDiv.style.display = 'block';
            this.matchDiv.innerHTML = this.localeValue.getConstant('All Done') + '!';
            this.occurrenceDiv.style.display = 'block';
            // tslint:disable-next-line:max-line-length
            this.occurrenceDiv.innerHTML = this.localeValue.getConstant('We replaced all') + ' ' + count + ' ' + this.localeValue.getConstant('instances') + ' ' + this.localeValue.getConstant('of') + ' "' + findText + '" ' + this.localeValue.getConstant('with') + ' "' + replaceText + '" ';
        }
    }
    /**
     * Fires on search icon.
     * @private
     */
    public searchIconClickInternal = (): void => {
        // tslint:disable:no-any 
        let inputElement: any = document.getElementById(this.viewer.owner.containerId + '_option_search_text_box');
        // tslint:enable:no-any
        let text: string = inputElement.value;
        if (text === '') {
            return;
        }
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
            this.viewer.owner.searchModule.clearSearchHighlight();
            this.viewer.renderVisiblePages();
            return;
        }
        if (this.searchIcon.classList.contains('e-de-op-search-icon') && text.length >= 1) {
            this.searchIcon.classList.add('e-de-op-search-close-icon');
            this.searchIcon.classList.remove('e-de-op-search-icon');
            this.onEnableDisableReplaceButton();
        }
        this.clearSearchResultItems();
        this.viewer.owner.searchModule.clearSearchHighlight();
        let patterns: RegExp = this.viewer.owner.searchModule.textSearch.stringToRegex(text, this.findOption);
        let endSelection: TextPosition = this.viewer.selection.end;
        let index: string = endSelection.getHierarchicalIndexInternal();
        this.results = this.viewer.owner.searchModule.textSearch.findAll(patterns, this.findOption, index);
        if (this.results != null && this.results.length > 0) {
            this.navigateSearchResult();
            this.getMessageDivHeight();
            let resultsContainerHeight: number = this.viewer.owner.getDocumentEditorElement().offsetHeight - 215;
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
     * @private
     */
    public navigateNextResultButtonClick = (): void => {
        if (document.getElementById(this.viewer.owner.containerId + '_list_box_container') != null &&
            document.getElementById(this.viewer.owner.containerId + '_list_box_container').style.display !== 'none') {
            if (this.results.currentIndex < this.results.length - 1) {
                this.results.currentIndex = this.results.currentIndex + 1;
                let currentelement: TextSearchResult = this.results.innerList[this.results.currentIndex];
                // tslint:disable-next-line:max-line-length
                this.messageDiv.innerHTML = this.localeValue.getConstant('Result') + ' ' + (this.results.currentIndex + 1) + ' ' + this.localeValue.getConstant('of') + ' ' + this.resultsListBlock.children.length;
                for (let i: number = 0; i < this.resultsListBlock.children.length; i++) {
                    let list: HTMLElement = this.resultsListBlock.children[i] as HTMLElement;
                    if (list.classList.contains('e-de-search-result-hglt')) {
                        list.classList.remove('e-de-search-result-hglt');
                        list.children[0].classList.remove('e-de-op-search-word-text');
                        list.classList.add('e-de-search-result-item');
                    }
                }
                let listElement: HTMLElement = this.resultsListBlock.children[this.results.currentIndex] as HTMLElement;
                if (listElement.classList.contains('e-de-search-result-item')) {
                    listElement.classList.remove('e-de-search-result-item');
                    listElement.classList.add('e-de-search-result-hglt');
                    listElement.children[0].classList.add('e-de-op-search-word-text');
                    this.scrollToPosition(listElement);
                }
                this.viewer.owner.searchModule.navigate(currentelement);
                this.viewer.owner.searchModule.highlight(this.results);
            } else {
                let currentelement: TextSearchResult = this.results.innerList[0];
                this.results.currentIndex = 0;
                // tslint:disable-next-line:max-line-length
                this.messageDiv.innerHTML = this.localeValue.getConstant('Result') + ' ' + (this.results.currentIndex + 1) + ' ' + this.localeValue.getConstant('of') + ' ' + this.resultsListBlock.children.length;
                for (let j: number = 0; j < this.resultsListBlock.children.length; j++) {
                    let lists: HTMLElement = this.resultsListBlock.children[j] as HTMLElement;
                    if (lists.classList.contains('e-de-search-result-hglt')) {
                        lists.classList.remove('e-de-search-result-hglt');
                        lists.children[0].classList.remove('e-de-op-search-word-text');
                        lists.classList.add('e-de-search-result-item');
                    }
                }
                let listElementsDiv: HTMLElement = this.resultsListBlock.children[this.results.currentIndex] as HTMLElement;
                if (listElementsDiv.classList.contains('e-de-search-result-item')) {
                    listElementsDiv.classList.remove('e-de-search-result-item');
                    listElementsDiv.classList.add('e-de-search-result-hglt');
                    listElementsDiv.children[0].classList.add('e-de-op-search-word-text');
                    this.scrollToPosition(listElementsDiv);
                }
                this.viewer.owner.searchModule.navigate(currentelement);
                this.viewer.owner.searchModule.highlight(this.results);
            }
            this.focusedIndex = this.focusedElement.indexOf(this.navigateToNextResult);
        }
    }
    /**
     * Fires on getting previous results.
     * @private
     */
    public navigatePreviousResultButtonClick = (): void => {
        if (document.getElementById(this.viewer.owner.containerId + '_list_box_container') != null &&
            document.getElementById(this.viewer.owner.containerId + '_list_box_container').style.display !== 'none') {
            if (this.results.currentIndex === 0) {
                this.results.currentIndex = this.results.length - 1;
                // tslint:disable-next-line:max-line-length
                this.messageDiv.innerHTML = this.localeValue.getConstant('Result') + ' ' + (this.results.length) + ' ' + this.localeValue.getConstant('of') + ' ' + this.resultsListBlock.children.length;
                for (let index: number = 0; index < this.resultsListBlock.children.length; index++) {
                    let list: HTMLElement = this.resultsListBlock.children[index] as HTMLElement;
                    if (list.classList.contains('e-de-search-result-hglt')) {
                        list.classList.remove('e-de-search-result-hglt');
                        list.children[0].classList.remove('e-de-op-search-word-text');
                        list.classList.add('e-de-search-result-item');
                    }
                }
                let liElement: HTMLElement = this.resultsListBlock.children[this.results.currentIndex] as HTMLElement;
                if (liElement.classList.contains('e-de-search-result-item')) {
                    liElement.classList.remove('e-de-search-result-item');
                    liElement.classList.add('e-de-search-result-hglt');
                    liElement.children[0].classList.add('e-de-op-search-word-text');
                    this.scrollToPosition(liElement);
                }
                let currentelement: TextSearchResult = this.results.innerList[this.results.currentIndex];
                this.viewer.owner.searchModule.navigate(currentelement);
                this.viewer.owner.searchModule.highlight(this.results);
            } else {
                // tslint:disable-next-line:max-line-length
                this.messageDiv.innerHTML = this.localeValue.getConstant('Result') + ' ' + (this.results.currentIndex) + ' ' + this.localeValue.getConstant('of') + ' ' + this.resultsListBlock.children.length;
                this.results.currentIndex = this.results.currentIndex - 1;
                for (let j: number = 0; j < this.resultsListBlock.children.length; j++) {
                    let list: HTMLElement = this.resultsListBlock.children[j] as HTMLElement;
                    if (list.classList.contains('e-de-search-result-hglt')) {
                        list.classList.remove('e-de-search-result-hglt');
                        list.children[0].classList.remove('e-de-op-search-word-text');
                        list.classList.add('e-de-search-result-item');
                    }
                }
                let listElements: HTMLElement = this.resultsListBlock.children[this.results.currentIndex] as HTMLElement;
                if (listElements.classList.contains('e-de-search-result-item')) {
                    listElements.classList.remove('e-de-search-result-item');
                    listElements.classList.add('e-de-search-result-hglt');
                    listElements.children[0].classList.add('e-de-op-search-word-text');
                    this.scrollToPosition(listElements);
                }
                let currentelement: TextSearchResult = this.results.innerList[this.results.currentIndex];
                this.viewer.owner.searchModule.navigate(currentelement);
                this.viewer.owner.searchModule.highlight(this.results);
            }
            this.focusedIndex = this.focusedElement.indexOf(this.navigateToPreviousResult);
        }
    }
    /**
     * Scrolls to position.
     * @param {HTMLElement} list - Specifies the list element.
     * @private
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
     * @param {KeyboardEvent} event - Speficies key down actions.
     * @private
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
            this.viewer.owner.searchModule.clearSearchHighlight();
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
     * @private
     */
    public clearFocusElement(): void {
        for (let i: number = 0; i < this.resultsListBlock.children.length; i++) {
            let index: number = this.focusedElement.indexOf(this.resultsListBlock.children[i] as HTMLElement);
            if (index !== -1) {
                this.focusedElement.splice(index, 1);
            }
        }
        this.focusedIndex = 0;
    }
    /**
     * Close the optios pane.
     * @private
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
     * @param {MouseEvent} args - Specifies which list was clicked.
     * @private
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
        // tslint:disable-next-line:max-line-length
        this.messageDiv.innerHTML = this.localeValue.getConstant('Result') + ' ' + (index + 1) + ' ' + this.localeValue.getConstant('of') + ' ' + this.resultsListBlock.children.length;
        this.viewer.owner.searchModule.navigate(currentelement);
        this.viewer.owner.searchModule.highlight(this.results);
        list.focus();
    }
    /**
     * Show or hide option pane based on boolean value.
     * @param {boolean} show - Specifies showing or hiding the options pane.
     * @private
     */
    public showHideOptionsPane(show: boolean): void {
        if (!isNullOrUndefined(this.viewer.owner.selectionModule)) {
            if (show) {
                this.localeValue = new L10n('documenteditor', this.viewer.owner.defaultLocale);
                this.localeValue.setLocale(this.viewer.owner.locale);
                setCulture(this.viewer.owner.locale);
                if (isNullOrUndefined(this.optionsPane)) {
                    this.initOptionsPane(this.localeValue);
                    //Add Option Pane
                    this.viewer.optionsPaneContainer.setAttribute('style', 'display:inline-flex');
                    // tslint:disable-next-line:max-line-length
                    this.viewer.optionsPaneContainer.insertBefore(this.viewer.owner.optionsPaneModule.optionsPane, this.viewer.viewerContainer);
                }
                this.optionsPane.style.display = 'block';
                if (this.viewer.owner.isReadOnlyMode) {
                    this.tabInstance.hideTab(1);
                } else {
                    this.tabInstance.hideTab(1, false);
                }
                if (this.isReplace && !this.viewer.owner.isReadOnlyMode) {
                    this.tabInstance.select(1);
                    this.isReplace = false;
                    this.isOptionsPane = false;
                } else {
                    this.tabInstance.select(0);
                }
                this.searchDiv.innerHTML = this.localeValue.getConstant(this.searchText);
                this.isOptionsPaneShow = true;
                // tslint:disable-next-line:max-line-length
                let textBox: HTMLInputElement = document.getElementById(this.viewer.owner.getDocumentEditorElement().id + '_option_search_text_box') as HTMLInputElement;
                let selectedText: string = this.viewer.owner.selection.text;
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
                this.viewer.selection.caret.style.display = 'none';
                this.focusedIndex = 3;
                this.focusedElement = [];
                if (this.isOptionsPane) {
                    // tslint:disable-next-line:max-line-length
                    this.focusedElement.push(this.closeButton, this.findTabButtonHeader, this.replaceTabButtonHeader, this.searchInput, this.searchIcon, this.navigateToPreviousResult, this.navigateToNextResult, this.matchInput, this.wholeInput);
                } else {
                    // tslint:disable-next-line:max-line-length
                    this.focusedElement.push(this.closeButton, this.findTabButtonHeader, this.replaceTabButtonHeader, this.searchInput, this.searchIcon, this.navigateToPreviousResult, this.navigateToNextResult, this.matchInput, this.wholeInput, this.replaceWith, this.replaceButton, this.replaceAllButton);
                }
                this.viewer.updateViewerSize();
            } else {
                if (!isNullOrUndefined(this.optionsPane)) {
                    this.clearSearchResultItems();
                    this.viewer.owner.searchModule.clearSearchHighlight();
                    this.isOptionsPaneShow = false;
                    let resultListBox: HTMLElement = document.getElementById(this.viewer.owner.containerId + '_list_box_container');
                    let message: HTMLElement = document.getElementById(this.viewer.owner.containerId + '_search_status');
                    if (!isNullOrUndefined(resultListBox) && !isNullOrUndefined(message)) {
                        resultListBox.style.display = 'none';
                        this.clearFocusElement();
                        resultListBox.innerHTML = '';
                        message.innerHTML = this.localeValue.getConstant('No matches');
                    }
                }
                this.viewer.updateViewerSize();
                if (!isNullOrUndefined(this.optionsPane)) {
                    if (this.optionsPane.style.display !== 'none') {
                        this.viewer.selection.updateCaretPosition();
                        this.optionsPane.style.display = 'none';
                    }
                }
                this.viewer.updateFocus();
                this.viewer.selection.caret.style.display = 'block';
            }
        }
    }

    /**
     * Clears search results.
     * @private
     */
    public clearSearchResultItems(): void {
        if (!isNullOrUndefined(this.viewer.owner.findResultsList)) {
            this.viewer.owner.findResultsList = [];
        }
    }
    /**
     * Dispose the internal objects which are maintained.
     * @private
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