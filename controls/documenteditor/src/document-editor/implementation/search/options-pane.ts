import { LayoutViewer, DocumentHelper, TableOfContentsSettings, ParagraphWidget, HistoryInfo } from '../index';
import { TextSearchResults } from './text-search-results';
import { TextSearchResult } from './text-search-result';
import { createElement, isNullOrUndefined, L10n, classList } from '@syncfusion/ej2-base';
import { FindOption } from '../../base/types';
import { TextPosition } from '../selection/selection-helper';
import { HelperMethods } from '../editor/editor-helper';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { Tab, SelectEventArgs, TabItemModel, TreeView, NodeClickEventArgs } from '@syncfusion/ej2-navigations';
import { SanitizeHtmlHelper } from '@syncfusion/ej2-base';

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
    private treeviewDiv: HTMLElement;
    private checkboxDiv: HTMLElement;
    private findOption: FindOption = 'None';
    private matchCase: CheckBox = undefined;
    private wholeWord: CheckBox = undefined;
    private treeviewObject: TreeView;
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
    private headingTabButton: HTMLElement;
    private replaceTabButton: HTMLElement;
    private searchIcon: HTMLSpanElement;
    private matchDiv: HTMLElement;
    private tabDiv: HTMLDivElement
    private replacePaneText: string = 'Replace';
    private findPaneText: string = 'Find';
    private headingPaneText: string = 'Heading';
    private matchDivReplaceText: string = 'No matches';
    private matchInput: HTMLInputElement;
    private wholeInput: HTMLInputElement;
    private regularInput: HTMLInputElement;
    /**
     * @private
     */
    public data: { [key: string]: Object; }[] ;
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
    /**
     * @private
     */
    public isUpdateHeading: boolean = false;
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
        //parent
        this.findTab = createElement('div', { id: this.documentHelper.owner.containerId + '_findTabDiv', className: 'e-de-op-tab' });
        this.optionsPane.appendChild(this.findTab);
        //head
        this.searchDiv = createElement('div', {
            className: 'e-de-op-header',
            innerHTML: localeValue.getConstant(this.searchText)
        });
        this.findTab.appendChild(this.searchDiv);
        this.closeButton = createElement('button', {
            className: 'e-de-op-close-button e-de-close-icon e-de-op-icon-btn e-btn e-flat e-icon-btn', id: 'close',
            attrs: { type: 'button' }
        });
        this.closeButton.setAttribute('aria-label', localeValue.getConstant('Close'));
        this.findTab.appendChild(this.closeButton);
        let closeSpan: HTMLSpanElement = createElement('span', { className: 'e-de-op-close-icon e-de-close-icon e-btn-icon e-icons' });
        this.closeButton.appendChild(closeSpan);
        this.focusedElement.push(this.closeButton);
        // tab
        this.tabDiv = createElement('div') as HTMLDivElement;
        this.findTab.appendChild(this.tabDiv);
        this.findTabButton = createElement('div', { innerHTML: localeValue.getConstant(this.findPaneText) });
        this.replaceTabButton = createElement('div', { innerHTML: localeValue.getConstant(this.replacePaneText) });
        this.headingTabButton = createElement('div', { innerHTML: localeValue.getConstant(this.headingPaneText) });
        let items: TabItemModel[] = [
            { header: { text: this.headingTabButton } },
            { header: { text: this.findTabButton } },
            { header: { text: this.replaceTabButton } }] as TabItemModel[];
        this.tabInstance = new Tab({ items: items, enableRtl: isRtl, selected: this.selectedTabItem.bind(this) });
        this.tabInstance.isStringTemplate = true;
        this.tabInstance.appendTo(this.tabDiv);
        //search
        this.findTabContentDiv = createElement('div', { className: 'e-de-search-tab-content', styles: 'display:none;' });
        this.findTab.appendChild(this.findTabContentDiv);
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
        //match
        this.checkboxDiv = createElement('div', { className: 'e-de-op-more-less', styles: 'display:none' });
        this.matchInput = createElement('input', {
            attrs: { type: 'checkbox' },
            id: this.documentHelper.owner.containerId + '_matchCase'
        }) as HTMLInputElement;
        this.checkboxDiv.appendChild(this.matchInput);
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
        this.checkboxDiv.appendChild(this.wholeInput);
        this.wholeWord = new CheckBox({ label: localeValue.getConstant('Whole words'), enableRtl: isRtl, checked: false, change: this.wholeWordsChange.bind(this) });
        this.wholeWord.appendTo(this.wholeInput);
        this.focusedElement.push(this.wholeInput);
        this.wholeInput.tabIndex = 0;
        this.findTab.appendChild(this.checkboxDiv);
        //Replace tab
        this.replaceTabContentDiv = createElement('div', { className: 'e-de-op-replacetabcontentdiv', styles: 'display:none;' });
        this.findTab.appendChild(this.replaceTabContentDiv);
        this.createReplacePane(isRtl);
        //container
        this.resultContainer = createElement('div', { styles: 'width:85%;display:none;', className: 'e-de-op-result-container' });
        this.findTab.appendChild(this.resultContainer);
        this.messageDiv = createElement('div', { className: this.documentHelper.owner.containerId + '_messageDiv e-de-op-msg', innerHTML: this.localeValue.getConstant(this.messageDivText), id: this.documentHelper.owner.containerId + '_search_status' });
        this.resultContainer.appendChild(this.messageDiv);
        //resultblock-finding
        let resultDiv: HTMLDivElement = createElement('div', { id: this.documentHelper.owner.containerId + '_resultDiv' }) as HTMLDivElement;
        this.optionsPane.appendChild(resultDiv);
        this.findDiv = createElement('div', { className: 'findDiv', styles: 'display:none;' });
        resultDiv.appendChild(this.findDiv);
        this.resultsListBlock = createElement('div', { id: this.documentHelper.owner.containerId + '_list_box_container', styles: 'display:none;width:270px;list-style:none;padding-right:5px;overflow:auto;', className: 'e-de-result-list-block' });
        this.findDiv.appendChild(this.resultsListBlock);
        //tree view
        this.treeviewDiv = createElement('div', { className: 'e-de-scrollbar-hide', styles: 'height:375px;overflow:auto;padding-top:5px', id: this.documentHelper.owner.containerId + '_treeDiv' });
        this.initHeadingTab();
        this.onWireEvents();
        if (isRtl) {
            this.optionsPane.classList.add('e-de-rtl');
            this.closeButton.classList.add('e-de-rtl');
            this.searchDiv.classList.add('e-de-rtl');
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public updateHeadingTab(): void {
        if (!isNullOrUndefined(this.treeviewDiv)) {
            this.isUpdateHeading = true;
            this.treeviewDiv.innerHTML = '';
            this.data = this.dataForTreeview();
            this.initHeadingTab();
            this.isUpdateHeading = false;
        }
    }
    /**
     * Initialize the heading tab with the values.
     *
     * @private
     * @returns {void}
     */
    public initHeadingTab(): void {
        let tree = createElement('div', { id: 'tree' });
        if (!isNullOrUndefined(this.data) && this.data.length>0) {
            this.treeviewObject = new TreeView({
                fields: { dataSource: this.data, id: 'id', text: 'name', parentID: 'pid', hasChildren: 'hasChild', tooltip: 'tooltipText' },
                nodeClicked: this.nodeClick.bind(this),
                cssClass: 'e-de-custom-treeview',
            });
            if (!isNullOrUndefined(this.treeviewDiv)) {
                this.treeviewDiv.innerHTML = "";
                this.treeviewObject.appendTo(tree);
                this.treeviewDiv.appendChild(tree);
                if (!isNullOrUndefined(this.findTab)) {
                    this.findTab.appendChild(this.treeviewDiv);
                }
            }
        } else {
            if (!isNullOrUndefined(this.treeviewDiv)) {
                this.treeviewDiv.innerHTML = this.localeValue.getConstant('No Headings');
                this.findTab.appendChild(this.treeviewDiv);
            }
        }

    }
    private nodeClick(args: NodeClickEventArgs): void {
        let targetNodeId: any = this.treeviewObject.selectedNodes[0];
        if(!isNullOrUndefined(targetNodeId))
        this.documentHelper.selection.navigateBookmark(this.data[(targetNodeId - 1)].hyperlink.toString(), true);
    }
    /**
     * Data source for tree view.
     *
     * @private
     * @returns {{ [key: string]: Object; }[]}
     */
    public dataForTreeview(): { [key: string]: Object; }[] {
        this.data = [];
        let datas: ParagraphWidget[] = this.createDataSourceForTreeview();
        this.documentHelper.blockToShift = undefined;
        const data: { [key: string]: Object }[] = [];
        if (!isNullOrUndefined(this.treeviewDiv)) {
            let index = 1;
            if (!isNullOrUndefined(datas) && datas.length > 0) {
                for (let i = 0; i < datas.length; i++) {
                    let parentId: Number = null;
                    if (datas[i].paragraphFormat.outlineLevel !== "Level1" && i > 0) {
                        var currentIndex = i - 1;
                        if (datas[i].paragraphFormat.outlineLevel === datas[i - 1].paragraphFormat.outlineLevel) {
                            parentId = data[currentIndex].pid as Number;
                        }
                        else if (Number(datas[i].paragraphFormat.outlineLevel.substr(5, 1)) > Number(datas[currentIndex].paragraphFormat.outlineLevel.substr(5, 1))) {
                            parentId = data[currentIndex].id as Number;
                            data[currentIndex].hasChild = true;
                            data[currentIndex].expanded = true;
                        }
                        else {
                            currentIndex--;
                            while (currentIndex > 0) {
                                if (Number(datas[i].paragraphFormat.outlineLevel.substr(5, 1)) > Number(datas[currentIndex].paragraphFormat.outlineLevel.substr(5, 1))) {
                                    parentId = data[currentIndex].id as Number;
                                    data[currentIndex].hasChild = true;
                                    data[currentIndex].expanded = true;
                                    break;
                                }
                                else if (Number(datas[i].paragraphFormat.outlineLevel.substr(5, 1)) === Number(datas[currentIndex].paragraphFormat.outlineLevel.substr(5, 1))) {
                                    parentId = data[currentIndex].pid as Number;
                                    break;
                                }
                                currentIndex--;
                            }
                        }

                    }
                    const widget: any = datas[i].childWidgets[0];
                    let name: string;
                    let tooltipText: string;
                    let text: string;
                    if (isNullOrUndefined(widget.children[3])) {
                        name = widget.children[0].text;
                        tooltipText = widget.children[0].text;
                        let value = index;
                        text = 'Toc00000000' + value;
                        index++;
                    }
                    else {
                        tooltipText = widget.children[3].text;
                        name = widget.children[3].text;
                        text = widget.children[1].text;
                    }

                    const newItem: { [key: string]: Object } = {
                        pid: parentId,
                        id: i + 1,
                        name: name,
                        hyperlink: text.length > 15 ? text.substring(15, text.length - 2) : text,
                        tooltipText: tooltipText,
                    };
                    data.push(newItem);
                }
            }
        }
        return data;
    }
    private createDataSourceForTreeview(): ParagraphWidget[] {
        let headingPaneSettings: TableOfContentsSettings = {
            startLevel: 1,
            endLevel: 9,
            includeOutlineLevels: true,
            includeHyperlink: true,
        };
        let startPosition : TextPosition = this.documentHelper.selection.start.clone();
        let endPosition : TextPosition = this.documentHelper.selection.end.clone();
        this.documentHelper.owner.editor.initComplexHistory('TOC');
        let code: string = undefined;
        // Build TOC field code based on parameter
        code = this.constructHeadingFieldCode(headingPaneSettings);
        let widgets: ParagraphWidget[] = this.documentHelper.owner.editorModule.buildToc(this.validateHeadingSettings(headingPaneSettings), code, false, true, true);
        if (this.documentHelper.owner.editorHistory) {
            this.documentHelper.owner.editorHistory.updateComplexHistory();
            if (this.documentHelper.owner.editorHistory.undoStack.length > 1
                && !isNullOrUndefined((this.documentHelper.owner.editorHistory.undoStack[this.documentHelper.owner.editorHistory.undoStack.length - 1] as HistoryInfo).modifiedActions)) {
                this.documentHelper.owner.editorHistory.undoStack.pop();
            }
        }
        this.documentHelper.selection.selectPosition(startPosition,endPosition);
        return widgets;
    }
    private validateHeadingSettings(navigationSettings: TableOfContentsSettings): TableOfContentsSettings {
        if (isNullOrUndefined(navigationSettings.startLevel) || navigationSettings.startLevel < 1) {
            navigationSettings.startLevel = 1;
        }
        if (isNullOrUndefined(navigationSettings.endLevel) || navigationSettings.endLevel < navigationSettings.endLevel) {
            navigationSettings.endLevel = navigationSettings.startLevel > 3 ? navigationSettings.startLevel : 3;
        }
        if (isNullOrUndefined(navigationSettings.includeHyperlink)) {
            navigationSettings.includeHyperlink = false;
        }
        if (isNullOrUndefined(navigationSettings.includePageNumber)) {
            navigationSettings.includePageNumber = false;
        }
        if (isNullOrUndefined(navigationSettings.rightAlign)) {
            navigationSettings.rightAlign = false;
        }
        if (isNullOrUndefined(navigationSettings.levelSettings)) {
            navigationSettings.levelSettings = {};
        }
        return navigationSettings;
    }
    private constructHeadingFieldCode(navigationSettings: TableOfContentsSettings): string {
        let headingFieldCode: string = 'TOC';
        //appends styles level

        if (!isNullOrUndefined(navigationSettings.startLevel) && navigationSettings.startLevel !== 0 && !isNullOrUndefined(navigationSettings.endLevel) && navigationSettings.endLevel !== 0) {
            headingFieldCode = headingFieldCode + ' \\o "' + navigationSettings.startLevel + '-' + navigationSettings.endLevel + '"';
        }
        if (navigationSettings.includePageNumber && !navigationSettings.rightAlign) {
            headingFieldCode = headingFieldCode + ' \\p " "';
        }
        if (!navigationSettings.includePageNumber) {
            headingFieldCode = headingFieldCode + ' \\n';
        }
        if (navigationSettings.includeHyperlink) {
            headingFieldCode = headingFieldCode + ' \\h \\z';
        }
        if (navigationSettings.includeOutlineLevels) {
            headingFieldCode = headingFieldCode + ' \\u';
        }
        const tSwitch: string = this.constructTSwitch(navigationSettings);
        if (tSwitch.length > 6) {
            headingFieldCode = headingFieldCode + tSwitch;
        }
        return headingFieldCode;
    }

    private constructTSwitch(navigationSettings: TableOfContentsSettings): string {
        let tSwitch: string = '';
        const prefix: string = ' \\t ';
        if (!isNullOrUndefined(navigationSettings.levelSettings)) {
            for (const key of Object.keys(navigationSettings.levelSettings)) {
                tSwitch = tSwitch + key + ',' + navigationSettings.levelSettings[key].toString() + ',';
            }
        }
        tSwitch = tSwitch.slice(0, -1);
        tSwitch = prefix + '"' + tSwitch + '"';
        return tSwitch;
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
        this.replaceButton.setAttribute('aria-label', this.localeValue.getConstant(this.replaceButtonText));
        this.replaceAllButton = createElement('button', {
            className: 'e-control e-btn e-flat e-replaceall',
            innerHTML: this.localeValue.getConstant(this.replaceAllButtonText),
            attrs: { type: 'button' }
        });
        replaceButtonDiv.appendChild(this.replaceAllButton);
        this.replaceAllButton.setAttribute('aria-label', this.localeValue.getConstant(this.replaceAllButtonText));
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
                this.isOptionsPane = false;
                this.onHeadingPane();
            }
            else if (args.selectedIndex === 1) {
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
        let resultsContainerHeight = this.optionsPane.offsetHeight - this.findTab.offsetHeight;
        this.resultsListBlock.style.height = resultsContainerHeight + 'px';
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
        let resultsContainerHeight: number = this.optionsPane.offsetHeight - this.findTab.offsetHeight;
        this.resultsListBlock.style.height = resultsContainerHeight + 'px';
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
        if (isNullOrUndefined(inputElement)) {
            return;
        }
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
            this.resultContainer.style.display = 'block';
            this.resultsListBlock.style.display = 'block';
            let resultsContainerHeight: number = this.optionsPane.offsetHeight - this.findTab.offsetHeight;
            this.resultsListBlock.style.height = resultsContainerHeight + 'px';
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
     * Enable Heading pane only.
     *
     * @private
     * @returns {void}
     */
    public onHeadingPane(): void {
        this.treeviewDiv.style.display = 'block';
        this.refreshHeadingPaneHeight();
        this.messageDiv.classList.remove('e-de-op-msg');
        this.messageDiv.classList.remove('e-de-op-replace-messagediv');
        this.replaceDiv.style.display = 'none';
        this.occurrenceDiv.style.display = 'none';
        this.findDiv.style.display = 'none';
        this.findTabContentDiv.style.display = 'none';
        this.checkboxDiv.style.display = 'none';
        this.resultContainer.style.display = 'none';

    }
    /**
     * @private
     * @returns {void} 
     */
    public refreshHeadingPaneHeight(): void {
        if (!isNullOrUndefined(this.optionsPane) && !isNullOrUndefined(this.searchDiv) && !isNullOrUndefined(this.tabDiv)) {
            const computedStyle = window.getComputedStyle(this.searchDiv);
            const marginBottom: number = parseFloat(computedStyle.marginBottom);
            let resultsContainerHeight: number = this.optionsPane.offsetHeight - (marginBottom + this.searchDiv.offsetHeight + this.tabDiv.offsetHeight);
            this.treeviewDiv.style.height = resultsContainerHeight + 'px';
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
        this.treeviewDiv.style.display = 'none';
        this.findDiv.style.display = 'block';
        this.findTabContentDiv.style.display = 'block';
        this.checkboxDiv.style.display = 'block';
        this.resultContainer.style.display = 'block';
        if (!isNullOrUndefined(this.results) && this.results.length === 0) {
            this.resultsListBlock.innerHTML = '';
            this.resultsListBlock.style.display = 'none';
            this.messageDiv.innerHTML = this.localeValue.getConstant('No matches');
        }
        let height: number = this.isOptionsPane ? 215 : 292;
        let resultsContainerHeight: number = this.optionsPane.offsetHeight - (this.findTab.offsetHeight - this.replaceTabContentDiv.offsetHeight);
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
        if (!isNullOrUndefined(this.searchInput.value) && this.searchInput.value.match(/[!\@\#$%\^&*\(\)_\-+\=\[\]\{\};:"\|,.<>\/?`~\s\\؟°÷×،؛]/) && this.searchInput.value !== "") {
            this.wholeWord.checked = false;
            this.wholeWord.disabled = true;
        } else {
            this.wholeWord.disabled = false;
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
        this.findDiv.style.display = 'block';
        this.treeviewDiv.style.display = 'none';
        this.findTabContentDiv.style.display = 'block';
        this.checkboxDiv.style.display = 'block';
        this.resultContainer.style.display = 'block';
        let height: number = this.isOptionsPane ? 215 : 292;
        let resultsContainerHeight: number = this.optionsPane.offsetHeight - this.findTab.offsetHeight;
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
            if (this.documentHelper.owner.selectionModule != null) {
                let selectionText: string = this.documentHelper.owner.selectionModule.text;
                if (!this.documentHelper.owner.selectionModule.isEmpty) {
                    if (this.documentHelper.owner.selectionModule.isForward) {
                        this.documentHelper.owner.selectionModule.selectContent(this.documentHelper.owner.selectionModule.start, true);
                    } else {
                        this.documentHelper.owner.selectionModule.selectContent(this.documentHelper.owner.selectionModule.end, true);
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
                        this.documentHelper.owner.searchModule.findAll(findText, this.findOption);
                    }
                } else {
                    this.documentHelper.owner.searchModule.findAll(findText, this.findOption);
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
        this.documentHelper.updateFocus();
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
            this.documentHelper.layout.isReplacingAll = false;
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
            let resultsContainerHeight: number = this.optionsPane.offsetHeight - this.findTab.offsetHeight;
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
            let selectionEnd: TextPosition = this.documentHelper.owner.selectionModule.end;
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
            let selectionStart: TextPosition = this.documentHelper.owner.selectionModule.start;
            let currentIndex: number = this.results.currentIndex;
            if (selectionStart.isExistAfter(this.results.currentSearchResult.start)) {
                currentIndex = this.results.length - 1;
            }
            for (let i: number = currentIndex; i >= 0; i--) {
                let result: TextSearchResult = this.results.innerList[i];
                if (selectionStart.isExistAfter(result.start) || this.documentHelper.owner.selectionModule.end.isAtSamePosition(result.start)) {
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
            this.documentHelper.owner.documentEditorSettings.showNavigationPane = false;
            this.documentHelper.updateFocus();
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
        this.documentHelper.owner.documentEditorSettings.showNavigationPane = false;
        this.resultsListBlock.innerHTML = '';
        this.focusedIndex = 1;
        this.isOptionsPane = true;
        this.documentHelper.updateFocus();
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
            this.documentHelper.owner.fireOptionPaneChange(show);
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
                    this.tabInstance.hideTab(2);
                } else {
                    this.tabInstance.hideTab(2, false);
                }
                if (this.isReplace && !this.documentHelper.owner.isReadOnlyMode) {
                    this.tabInstance.select(2);
                    this.isReplace = false;
                    this.isOptionsPane = false;
                } else {
                    this.tabInstance.select(1);
                }
                let treeViewResult: HTMLElement = document.getElementById(this.documentHelper.owner.containerId + '_treeDiv');
                if (!isNullOrUndefined(treeViewResult)) {
                    treeViewResult.innerHTML = '';
                    this.data = this.dataForTreeview();
                    this.initHeadingTab();
                }
                this.searchDiv.innerHTML = this.localeValue.getConstant(this.searchText);
                this.isOptionsPaneShow = true;
                let textBox: HTMLInputElement = document.getElementById(this.documentHelper.owner.getDocumentEditorElement().id + '_option_search_text_box') as HTMLInputElement;
                let selectedText: string = this.documentHelper.owner.selectionModule.text;
                if (!isNullOrUndefined(selectedText)) {
                    let char: string[] = ['\v', '\r'];
                    let index: number = HelperMethods.indexOfAny(selectedText, char);
                    selectedText = index < 0 ? selectedText : selectedText.substring(0, index);
                }
                textBox.value = selectedText;
                textBox.select();
                if (!isNullOrUndefined(textBox.value) && textBox.value.match(/[!\@\#$%\^&*\(\)_\-+\=\[\]\{\};:"\|,.<>\/?`~\s\\؟°÷×،؛]/) && textBox.value !== "") {
                    this.wholeInput.checked = false;
                    this.wholeWord.disabled = true;
                } else {
                    this.wholeWord.disabled = false;
                }
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
                    if (!isNullOrUndefined(this.documentHelper.owner.searchModule)) {
                        this.documentHelper.owner.searchModule.clearSearchHighlight();
                    }
                    this.isOptionsPaneShow = false;
                    let resultListBox: HTMLElement = document.getElementById(this.documentHelper.owner.containerId + '_list_box_container');
                    let message: HTMLElement = document.getElementById(this.documentHelper.owner.containerId + '_search_status');
                    if (!isNullOrUndefined(resultListBox) && !isNullOrUndefined(message)) {
                        resultListBox.style.display = 'none';
                        this.clearFocusElement();
                        resultListBox.innerHTML = '';
                        message.innerHTML = this.localeValue.getConstant('No matches');
                    }
                    let treeViewResult: HTMLElement = document.getElementById(this.documentHelper.owner.containerId + '_treeDiv');
                    if (!isNullOrUndefined(treeViewResult)) {
                        treeViewResult.innerHTML = '';
                    }
                }
                this.documentHelper.updateViewerSize();
                if (!isNullOrUndefined(this.optionsPane)) {
                    if (this.optionsPane.style.display !== 'none') {
                        this.documentHelper.selection.updateCaretPosition();
                        this.optionsPane.style.display = 'none';
                    }
                }
                if (this.documentHelper.owner.enableAutoFocus) {
                    this.documentHelper.updateFocus();
                }
                if (this.documentHelper.owner.enableAutoFocus) {
                    this.documentHelper.selection.caret.style.display = 'block';
                }
            }
            this.documentHelper.owner.triggerResize();
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
        if (this.treeviewDiv) {
            this.treeviewDiv.innerHTML = '';
            this.treeviewDiv = undefined;
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
        this.documentHelper = undefined;
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
        if(this.tabDiv) {
            this.tabDiv = undefined;
        }
    }
}
