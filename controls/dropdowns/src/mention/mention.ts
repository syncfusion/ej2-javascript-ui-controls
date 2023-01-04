import { KeyboardEvents, compile, Property, EventHandler, Animation, AnimationModel, KeyboardEventArgs, formatUnit, append, attributes } from '@syncfusion/ej2-base';
import { isNullOrUndefined, detach, Event, EmitType, Complex, addClass, removeClass, closest, isUndefined, getValue, NotifyPropertyChanges, Browser } from '@syncfusion/ej2-base';
import { FieldSettingsModel } from '../drop-down-base/drop-down-base-model';
import { FieldSettings, FilteringEventArgs, FilterType } from '../drop-down-base/drop-down-base';
import { DropDownBase, PopupEventArgs, SelectEventArgs, BeforeOpenEventArgs, dropDownBaseClasses } from '../drop-down-base/drop-down-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { MentionModel } from '../mention/mention-model';
import { SortOrder } from '@syncfusion/ej2-lists';
import { Popup, isCollide, createSpinner, showSpinner, hideSpinner, getZindexPartial } from '@syncfusion/ej2-popups';
import { highlightSearch, revertHighlightSearch } from '../common/highlight-search';

export interface MentionChangeEventArgs extends SelectEventArgs {
    /**
     * Specifies the selected value.
     *
     * @isGenericType true
     */
    value: number | string | boolean
    /**
     * Specifies the element of previous selected list item.
     */
    previousItem: HTMLLIElement
    /**
     * Specifies the previously selected item as a JSON Object from the data source.
     *
     */
    previousItemData: FieldSettingsModel
    /**
     * Specifies the component root element.
     */
    element: HTMLElement
}

/**
 * The Mention component is used to list someone or something based on user input in textarea, input,
 * or any other editable element from which the user can select.
 */
@NotifyPropertyChanges
export class Mention extends DropDownBase {
    private initRemoteRender: boolean;
    private inputElement: HTMLInputElement | HTMLTextAreaElement | HTMLElement;
    private popupObj: Popup;
    private isPopupOpen: boolean;
    private isSelected: boolean;
    private selectedLI: HTMLLIElement;
    private previousSelectedLI: HTMLElement;
    private previousItemData: { [key: string]: Object } | string | number | boolean;
    private activeIndex: number;
    private keyConfigure: { [key: string]: string };
    private isFiltered: boolean;
    private beforePopupOpen: boolean;
    private listHeight: string;
    private isListResetted: boolean;
    private range: Range;
    private displayTempElement: HTMLElement;
    private isCollided: boolean;
    private spinnerElement: HTMLElement;
    private spinnerTemplateElement: HTMLElement;
    private lineBreak: boolean;
    private selectedElementID : string;

    // Mention Options

    /**
     * Defines class/multiple classes separated by a space for the mention component.
     *
     * @default null
     */
    @Property(null)
    public cssClass: string;

    /**
     * Specifies the symbol or single character which triggers the search action in the mention component.
     *
     * @default '@'
     * @aspType char
     */
    @Property('@')
    public mentionChar: string;

    /**
     * Specifies whether to show the configured mentionChar with the text.
     *
     * @default false
     */
    @Property(false)
    public showMentionChar: boolean;

    /**
     * Defines whether to allow the space in the middle of mention while searching.
     * When disabled, the space ends the mention component search.
     *
     * @default false
     */
    @Property(false)
    public allowSpaces: boolean;

    /**
     * Specifies the custom suffix to append along with the mention component selected item while inserting.
     * You can append space or new line character as suffix.
     *
     * @default null
     */
    @Property(null)
    public suffixText: string;

    /**
     * Specifies the number of items in the suggestion list.
     *
     * @default 25
     * @aspType int
     */
    @Property(25)
    public suggestionCount: number;

    /**
     * Specifies the minimum length of user input to initiate the search action.
     * The default value is zero, where suggestion the list opened as soon as the user inputs the mention character.
     *
     * @default 0
     * @aspType int
     */
    @Property(0)
    public minLength: number;

    /**
     * Specifies the order to sort the data source. The possible sort orders are,
     * * `None` - The data source is not sorted.
     * * `Ascending` - The data source is sorted in ascending order.
     * * `Descending` - The data source is sorted in descending order.
     *
     * @default 'None'
     */
    @Property('None')
    public sortOrder: SortOrder;

    /**
     * Specifies whether the searches are case sensitive to find suggestions.
     *
     * @default true
     */
    @Property(true)
    public ignoreCase: boolean;

    /**
     * Specifies whether to highlight the searched characters on suggestion list items.
     *
     * @default false
     */
    @Property(false)
    public highlight: boolean;

    /**
     * Overrides the global culture and localization value for this component. Default global culture is ‘en-US’.
     *
     * @default 'en-US'
     */
    @Property()
    public locale: string;

    /**
     * Specifies the width of the popup in pixels/number/percentage. The number value is considered as pixels.
     *
     * @default 'auto'
     * @aspType string
     */
    @Property('auto')
    public popupWidth: string | number;

    /**
     * Specifies the height of the popup in pixels/number/percentage. The number value is considered as pixels.
     *
     * @default '300px'
     * @aspType string
     */
    @Property('300px')
    public popupHeight: string | number;

    /**
     * Specifies the template for the selected value from the suggestion list.
     *
     * @default null
     */
    @Property(null)
    public displayTemplate: string;

    /**
     * Specifies the template for the suggestion list.
     *
     * @default null
     */
    @Property(null)
    public itemTemplate: string;

    /**
     * Specifies the template for no matched item which is displayed when there are no items to display in the suggestion list.
     *
     * @default 'No records found'
     */
    @Property('No records found')
    public noRecordsTemplate: string;

    /**
     * Specifies the template for showing until data is loaded in the popup.
     *
     * @default null
     */
    @Property(null)
    public spinnerTemplate: string;

    /**
     * Specifies the target selector where the mention component needs to be displayed.
     * The mention component listens to the target's user input and displays suggestions as soon as the user inputs the mention character.
     *
     */
    @Property()
    public target: HTMLElement | string;

    /**
     * Accepts the list items either through local or remote service and binds it to the component.
     * It can be an array of JSON Objects or an instance of `DataManager`.
     *
     * @default []
     */
    @Property([])
    public dataSource: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[];

    /**
     * Specifies the external query, which can be customized and filtered against the data source.
     *
     * @default null
     */
    @Property(null)
    public query: Query;

    /**
     * Determines on which filter type, the component needs to be considered on search action.
     * and its supported data types are
     *
     * <table>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * FilterType<br/></td><td colSpan=1 rowSpan=1>
     * Description<br/></td><td colSpan=1 rowSpan=1>
     * Supported Types<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * StartsWith<br/></td><td colSpan=1 rowSpan=1>
     * Checks whether a value begins with the specified value.<br/></td><td colSpan=1 rowSpan=1>
     * String<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * EndsWith<br/></td><td colSpan=1 rowSpan=1>
     * Checks whether a value ends with a specified value.<br/><br/></td><td colSpan=1 rowSpan=1>
     * <br/>String<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * Contains<br/></td><td colSpan=1 rowSpan=1>
     * Checks whether a value contains with a specified value.<br/><br/></td><td colSpan=1 rowSpan=1>
     * <br/>String<br/></td></tr>
     * </table>
     *
     * The default value set to `Contains`, all the suggestion items which contain typed characters to listed in the suggestion popup.
     *
     * @default 'Contains'
     */
    @Property('Contains')
    public filterType: FilterType;

    /**
     * Defines the fields of the Mention to map with the data source and binds the data to the component.
     * * text - Specifies the text that maps the text filed from the data source for each list item.
     * * value - Specifies the value that maps the value filed from the data source for each list item.
     * * iconCss - Specifies the iconCss that map the icon class filed from the data source for each list item.
     * * groupBy - Specifies the groupBy that groups the list items with its related items by mapping groupBy field.
     *
     * @default
     * {
     *  text: null, value: null, iconCss: null, groupBy: null
     * }
     */
    @Complex<FieldSettingsModel>({ text: null, value: null, iconCss: null, groupBy: null }, FieldSettings)
    public fields: FieldSettingsModel;

    /**
     * Triggers before fetching data from the remote server.
     *
     * @event actionBegin
     */
    @Event()
    public actionBegin: EmitType<Object>;

    /**
     * Triggers after data is fetched successfully from the remote server.
     *
     * @event actionComplete
     */
    @Event()
    public actionComplete: EmitType<Object>;

    /**
     * Triggers when the data fetch request from the remote server fails.
     *
     * @event actionFailure
     */
    @Event()
    public actionFailure: EmitType<Object>;

    /**
     * Triggers when an item in a popup is selected and updated in an editor.
     *
     * @event change
     */
    @Event()
    public change: EmitType<MentionChangeEventArgs>;

    /**
     * Triggers before the popup is opened.
     *
     * @event beforeOpen
     */
    @Event()
    public beforeOpen: EmitType<PopupEventArgs>;

    /**
     * Triggers after the popup opens.
     *
     * @event opened
     */
    @Event()
    public opened: EmitType<PopupEventArgs>;

    /**
     * Triggers after the popup is closed.
     *
     * @event closed
     */
    @Event()
    public closed: EmitType<PopupEventArgs>;

    /**
     * Triggers when an item in the popup is selected by the user either with the mouse/tap or with keyboard navigation.
     *
     * @event select
     */
    @Event()
    public select: EmitType<SelectEventArgs>;

    /**
     * Triggers on typing a character in the component.
     *
     * @event filtering
     */
    @Event()
    public filtering: EmitType<FilteringEventArgs>;

    /**
     * Triggers when the component is created.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Triggers when the component is destroyed.
     *
     * @event destroyed
     */
    @Event()
    public destroyed: EmitType<Object>;

    /**
     * * Constructor for creating the widget
     *
     * @param {MentionModel} options - Specifies the MentionComponent model.
     * @param {string | HTMLElement} element - Specifies the element to render as component.
     * @private
     */
    public constructor(options?: MentionModel, element?: string | HTMLElement) {
        super(options, element);
    }

    /**
     * When property value changes happened, then onPropertyChanged method will execute the respective changes in this component.
     *
     * @param {MentionModel} newProp - Returns the dynamic property value of the component.
     * @param {MentionModel} oldProp - Returns the previous property value of the component.
     * @private
     * @returns {void}
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public onPropertyChanged(newProp: MentionModel, oldProp: MentionModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'minLength':
                this.minLength = newProp.minLength;
                break;
            case 'suffixText':
                this.suffixText = newProp.suffixText;
                break;
            case 'allowSpaces':
                this.allowSpaces = newProp.allowSpaces;
                break;
            case 'mentionChar':
                this.mentionChar = newProp.mentionChar;
                break;
            case 'showMentionChar':
                this.showMentionChar = newProp.showMentionChar;
                break;
            case 'cssClass': this.updateCssClass(newProp.cssClass, oldProp.cssClass); break;
            }
        }
    }

    private updateCssClass(newClass: string, oldClass: string): void {
        if (!isNullOrUndefined(oldClass)) {
            oldClass = (oldClass.replace(/\s+/g, ' ')).trim();
        }
        if (!isNullOrUndefined(newClass)) {
            newClass = (newClass.replace(/\s+/g, ' ')).trim();
        }
        this.setCssClass(newClass, [this.inputElement], oldClass);
        if (this.popupObj) {
            this.setCssClass(newClass, [this.popupObj.element], oldClass);
        }
    }

    private setCssClass(cssClass: string, elements: Element[] | NodeList, oldClass?: string): void {
        if (!isNullOrUndefined(oldClass) && oldClass !== '') {
            removeClass(elements, oldClass.split(' '));
        }
        if (!isNullOrUndefined(cssClass) && cssClass !== '') {
            addClass(elements, cssClass.split(' '));
        }
    }

    private initializeData(): void {
        this.isSelected = false;
        this.isFiltered = false;
        this.beforePopupOpen = false;
        this.initRemoteRender = false;
        this.isListResetted = false;
        this.isPopupOpen = false;
        this.isCollided = false;
        this.lineBreak = false;
        this.keyConfigure = {
            tab: 'tab',
            enter: '13',
            escape: '27',
            end: '35',
            home: '36',
            down: '40',
            up: '38',
            pageUp: '33',
            pageDown: '34',
            open: 'alt+40',
            close: 'shift+tab',
            hide: 'alt+38',
            space: '32'
        };
    }

    /**
     * Execute before render the list items
     *
     * @private
     * @returns {void}
     */
    protected preRender(): void {
        this.initializeData();
        super.preRender();
    }

    /**
     * To Initialize the control rendering
     *
     * @private
     * @returns {void}
     */
    public render(): void {
        this.inputElement = !isNullOrUndefined(this.target) ? ((typeof this.target) === 'string') ?
        <HTMLElement>document.querySelector(<string>this.target) : <HTMLElement>this.target : this.element;
        if (this.isContentEditable(this.inputElement)) {
            this.inputElement.setAttribute('contenteditable', 'true');
            addClass([this.inputElement], ['e-mention']);
            if (isNullOrUndefined(this.target)) {
                addClass([this.inputElement], ['e-editable-element']);
            }
        }
        this.queryString = this.elementValue();
        this.wireEvent();
    }

    private wireEvent(): void {
        EventHandler.add(this.inputElement, 'keyup', this.onKeyUp, this);
        this.bindCommonEvent();
    }

    private unWireEvent(): void {
        EventHandler.remove(this.inputElement, 'keyup', this.onKeyUp);
        this.unBindCommonEvent();
    }

    private bindCommonEvent(): void {
        if (!Browser.isDevice) {
            this.keyboardModule = new KeyboardEvents(
                this.inputElement, {
                    keyAction: this.keyActionHandler.bind(this), keyConfigs: this.keyConfigure, eventName: 'keydown'
                });
        }
    }

    /**
     * Hides the spinner loader.
     *
     * @private
     * @returns {void}
     */
    public hideSpinner(): void {
        this.hideWaitingSpinner();
    }

    private hideWaitingSpinner(): void {
        if (!isNullOrUndefined(this.spinnerElement)) {
            hideSpinner(this.spinnerElement);
        }
        if (!isNullOrUndefined(this.spinnerTemplate) && !isNullOrUndefined(this.spinnerTemplateElement)) {
            detach(this.spinnerTemplateElement);
        }
    }

    /**
     * Shows the spinner loader.
     *
     * @returns {void}
     */
    private showWaitingSpinner(): void {
        if (!isNullOrUndefined(this.popupObj)) {
            if (isNullOrUndefined(this.spinnerTemplate) && isNullOrUndefined(this.spinnerElement)) {
                this.spinnerElement = this.popupObj.element;
                createSpinner(
                    {
                        target: this.spinnerElement,
                        width: Browser.isDevice ? '16px' : '14px'
                    },
                    this.createElement);
                showSpinner(this.spinnerElement);
            }
            if (!isNullOrUndefined(this.spinnerTemplate)) {
                this.setSpinnerTemplate();
            }
        }
    }

    private keyActionHandler(e: KeyboardEventArgs): void {
        const isNavigation: boolean = (e.action === 'down' || e.action === 'up' || e.action === 'pageUp' || e.action === 'pageDown'
            || e.action === 'home' || e.action === 'end');
        const isTabAction: boolean = e.action === 'tab' || e.action === 'close';
        if (this.list === undefined && !this.isRequested && !isTabAction && e.action !== 'escape') {
            this.renderList();
        }
        if (isNullOrUndefined(this.list) || (!isNullOrUndefined(this.liCollections) &&
            isNavigation && this.liCollections.length === 0) || this.isRequested) {
            return;
        }
        if (e.action === 'escape') {
            e.preventDefault();
        }
        this.isSelected = e.action === 'escape' ? false : this.isSelected;
        switch (e.action) {
        case 'down':
        case 'up':
            this.updateUpDownAction(e);
            break;
        case 'tab':
            if (this.isPopupOpen) {
                e.preventDefault();
                const li: Element = this.list.querySelector('.' + dropDownBaseClasses.selected);
                if (li) {
                    this.setSelection(li, e);
                }
                if (this.isPopupOpen) { this.hidePopup(e); }
            }
            break;
        case 'enter':
            if (this.isPopupOpen) {
                e.preventDefault();
                if (this.popupObj && this.popupObj.element.contains(this.selectedLI)) {
                    this.setValue(e);
                }
            }
            break;
        case 'escape':
            if (this.isPopupOpen) {
                this.hidePopup(e);
            }
            break;
        }
    }

    private updateUpDownAction(e: KeyboardEventArgs): void {
        const focusEle: Element = this.list.querySelector('.' + dropDownBaseClasses.focus);
        if (this.isSelectFocusItem(focusEle)) {
            this.setSelection(focusEle, e);
        } else if (!isNullOrUndefined(this.liCollections)) {
            const li: Element = this.list.querySelector('.' + dropDownBaseClasses.selected);
            if (!isNullOrUndefined(li)) {
                const value: string | number | boolean = this.getFormattedValue(li.getAttribute('data-value'));
                this.activeIndex = this.getIndexByValue(value);
            }
            let index: number = e.action === 'down' ? this.activeIndex + 1 : this.activeIndex - 1;
            let startIndex: number = 0;
            startIndex = e.action === 'down' && isNullOrUndefined(this.activeIndex) ? 0 : this.liCollections.length - 1;
            index = index < 0 ? this.liCollections.length - 1 : index === this.liCollections.length ? 0 : index;
            const nextItem: Element = isNullOrUndefined(this.activeIndex) ?
                this.liCollections[startIndex as number] : this.liCollections[index as number];
            if (!isNullOrUndefined(nextItem)) {
                this.setSelection(nextItem, e);
            }
        }
        if (this.isPopupOpen) {
            e.preventDefault();
        }
    }

    private isSelectFocusItem(element: Element): boolean {
        return !isNullOrUndefined(element);
    }

    private unBindCommonEvent(): void {
        if (!Browser.isDevice) {
            this.keyboardModule.destroy();
        }
    }

    private onKeyUp(e: KeyboardEventArgs): void {
        let rangetextContent: string[];
        if (this.isContentEditable(this.inputElement)) {
            this.range = this.getCurrentRange();
            rangetextContent = this.range.startContainer.textContent.split('');
        }
        let currentRange: string = this.getTextRange();
	    const lastWordRange: string = this.getLastLetter(currentRange);
        // eslint-disable-next-line security/detect-non-literal-regexp
        const Regex: RegExp = new RegExp(this.mentionChar, 'g');
        const charRegex: RegExp = new RegExp('[a-zA-Z]', 'g');
        if (e.key === 'Shift' || e.keyCode === 37 || e.keyCode === 39) {
            if ((e.keyCode === 37 || e.keyCode === 39) && !isNullOrUndefined(currentRange) &&
                currentRange.indexOf(this.mentionChar) === -1 && this.isPopupOpen) {
                this.hidePopup();
            }
            return;
        }
        if ((!currentRange || !lastWordRange) || e.code === 'Enter' || e.keyCode === 27 ||
            (lastWordRange.match(Regex) && lastWordRange.match(Regex).length > 1) ||
            (this.isContentEditable(this.inputElement) && this.range.startContainer &&
            (this.range.startContainer as HTMLElement).previousElementSibling && this.range.startContainer.textContent.split('').length > 0 &&
            (rangetextContent.length === 1 || rangetextContent[rangetextContent.length - 2].indexOf('') === -1 ||
            this.range.startContainer.nodeType === 1))) {
            if (this.allowSpaces && currentRange && currentRange.trim() !== '' && charRegex.test(currentRange) && currentRange.indexOf(this.mentionChar) !== -1
                && !this.isMatchedText() && (currentRange.length > 1 && currentRange.replace(/\u00A0/g, ' ').charAt(currentRange.length - 2) !== ' ') &&
                (this.list && this.list.querySelectorAll('ul').length > 0)) {
                this.queryString = currentRange.substring(currentRange.lastIndexOf(this.mentionChar) + 1).replace('\u00a0', ' ');
                this.searchLists(e);
            } else if (this.isPopupOpen && (!this.allowSpaces || !lastWordRange)) {
                this.hidePopup();
                this.lineBreak = true;
            }
            return;
        }
        this.queryString = lastWordRange.replace(this.mentionChar, '');
        if (this.mentionChar.charCodeAt(0) === lastWordRange.charCodeAt(0) &&
            this.queryString !== '' && e.keyCode !== 38 && e.keyCode !== 40 && !this.lineBreak) {
            this.searchLists(e);
            if (!this.isPopupOpen && this.queryString.length >= this.minLength) {
                if (!this.isContentEditable(this.inputElement)) {
                    this.showPopup();
                } else if (this.isContentEditable(this.inputElement) && this.range && this.range.startContainer !== this.inputElement && e.keyCode !== 9) {
                    this.showPopup();
                }
            }
        } else if (lastWordRange.indexOf(this.mentionChar) === 0 && !this.isPopupOpen && e.keyCode !== 8 && (!this.popupObj ||
            (isNullOrUndefined(this.target) && !document.body.contains(this.popupObj.element) ||
            !isNullOrUndefined(this.target) && document.body.contains(this.popupObj.element)))) {
            if (this.initRemoteRender && this.list && this.list.classList.contains('e-nodata')) {
                this.searchLists(e);
            }
            this.resetList(this.dataSource, this.fields);
            if (isNullOrUndefined(this.list)) {
                this.initValue();
            }
            if (!this.isPopupOpen && e.keyCode !== 38 && e.keyCode !== 40) {
                this.showPopup();
                if (this.initRemoteRender && this.list.querySelectorAll('li').length === 0) { this.showWaitingSpinner(); }
                this.lineBreak = false;
            }
        } else if (this.allowSpaces && this.queryString !== '' && currentRange && currentRange.trim() !== '' && currentRange.replace('\u00a0', ' ').lastIndexOf(' ') < currentRange.length - 1 &&
            e.keyCode !== 38 && e.keyCode !== 40 && e.keyCode !== 8) {
            this.queryString = currentRange.substring(currentRange.lastIndexOf(this.mentionChar) + 1).replace('\u00a0', ' ');
            this.searchLists(e);
        } else if (this.queryString === '' && this.isPopupOpen && e.keyCode !== 38 && e.keyCode !== 40) {
            this.searchLists(e);
            if(!this.isListResetted) {
                this.resetList(this.dataSource, this.fields);
            }
        }
        this.isListResetted = false;
    }

    private isMatchedText(): boolean {
        let isMatched: boolean = false;
        for (let i: number = 0; i < (this.liCollections && this.liCollections.length); i++) {
            if (this.getTextRange() &&
            this.getTextRange().substring(this.getTextRange().lastIndexOf(this.mentionChar) + 1).replace('\u00a0', ' ').trim() === this.liCollections[i as number].getAttribute('data-value').toLowerCase()) {
                isMatched = true;
            }
        }
        return isMatched;
    }

    private getCurrentRange(): Range {
        this.range = this.inputElement.ownerDocument.getSelection().getRangeAt(0);
        return this.range;
    }

    private searchLists(e: KeyboardEventArgs | MouseEvent): void {
        this.isDataFetched = false;
        if (isNullOrUndefined(this.list)) {
            super.render();
            this.unWireListEvents();
            this.wireListEvents();
        }
        if (e.type !== 'mousedown' && ((<KeyboardEventArgs>e).keyCode === 40 || (<KeyboardEventArgs>e).keyCode === 38)) {
            this.queryString = this.queryString === '' ? null : this.queryString;
            this.beforePopupOpen = true;
            this.resetList(this.dataSource, this.fields);
            return;
        }
        this.isSelected = false;
        this.activeIndex = null;
        const eventArgs: { [key: string]: Object } = {
            preventDefaultAction: false,
            text: this.queryString,
            updateData: (
                dataSource: { [key: string]: Object }[] | DataManager | string[] | number[], query?: Query,
                fields?: FieldSettingsModel) => {
                if (eventArgs.cancel) {
                    return;
                }
                this.isFiltered = true;
                this.filterAction(dataSource, query, fields);
            },
            cancel: false
        };
        this.trigger('filtering', eventArgs, (eventArgs: FilteringEventArgs) => {
            if (!eventArgs.cancel && !this.isFiltered && !eventArgs.preventDefaultAction) {
                this.filterAction(this.dataSource, null, this.fields);
            }
        });
    }

    private filterAction(
        dataSource: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[],
        query?: Query, fields?: FieldSettingsModel): void {
        this.beforePopupOpen = true;
        if (this.queryString.length >= this.minLength) {
            this.resetList(dataSource, fields, query);
            this.isListResetted = true;
        } else {
            if (this.isPopupOpen) { this.hidePopup(); }
            this.beforePopupOpen = false;
        }
        this.setDataIndex();
        this.renderReactTemplates();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected onActionComplete(ulElement: HTMLElement, list: { [key: string]: Object }[], e?: Object, isUpdated?: boolean): void {
        super.onActionComplete(ulElement, list, e);
        if (this.isActive) {
            if (!isNullOrUndefined(ulElement)) {
                attributes(ulElement, { 'id': this.inputElement.id + '_options', 'role': 'listbox', 'aria-hidden': 'false' });
            }
            let focusItem: HTMLLIElement = ulElement.querySelector('.' + dropDownBaseClasses.li);
            if (focusItem) {
                focusItem.classList.add(dropDownBaseClasses.selected);
                this.selectedLI = focusItem;
                const value: string | number | boolean = this.getFormattedValue(focusItem.getAttribute('data-value'));
                this.selectEventCallback(focusItem, this.getDataByValue(value), value, true);
            }
        }
    }
    private setDataIndex(): void {
        for (let i: number = 0; this.liCollections && i < this.liCollections.length; i++) {
            this.liCollections[i as number].setAttribute('data-index', i.toString());
        }
    }

    protected listOption(dataSource: { [key: string]: Object }[], fieldsSettings: FieldSettingsModel): FieldSettingsModel {
        const fields: { [key: string]: Object } = <{ [key: string]: Object }>super.listOption(dataSource, fieldsSettings);
        if (isNullOrUndefined(fields.itemCreated)) {
            fields.itemCreated = (e: { [key: string]: HTMLElement }) => {
                if (this.highlight) {
                    if (this.inputElement.tagName === this.getNgDirective() && this.itemTemplate) {
                        setTimeout((): void => {
                            highlightSearch(e.item, this.queryString, this.ignoreCase, this.filterType);
                        }, 0);
                    } else {
                        highlightSearch(e.item, this.queryString, this.ignoreCase, this.filterType);
                    }
                }
            };
        } else {
            const itemCreated: Function = <Function>fields.itemCreated;
            fields.itemCreated = (e: { [key: string]: HTMLElement }) => {
                if (this.highlight) {
                    highlightSearch(e.item, this.queryString, this.ignoreCase, this.filterType);
                }
                itemCreated.apply(this, [e]);
            };
        }
        return fields;
    }

    private elementValue(): string {
        if (!this.isContentEditable(this.inputElement)) {
            return (this.inputElement as HTMLInputElement | HTMLTextAreaElement).value.replace(this.mentionChar, '');
        } else {
            return (this.inputElement as HTMLElement).textContent.replace(this.mentionChar, '');
        }
    }

    protected getQuery(query: Query): Query {
        const filterQuery: Query = query ? query.clone() : this.query ? this.query.clone() : new Query();
        const filterType: string = (this.queryString === '' && !isNullOrUndefined(this.elementValue())) ? 'equal' : this.filterType;
        const queryString: string = (this.queryString === '' && !isNullOrUndefined(this.elementValue())) ?
            this.elementValue() : this.queryString;
        if (this.isFiltered) {
            return filterQuery;
        }
        if (this.queryString !== null && this.queryString !== '') {
            const dataType: string = <string>this.typeOfData(this.dataSource as { [key: string]: Object }[]).typeof;
            if (!(this.dataSource instanceof DataManager) && dataType === 'string' || dataType === 'number') {
                filterQuery.where('', filterType, queryString, this.ignoreCase, this.ignoreAccent);
            } else {
                const mapping: string = !isNullOrUndefined(this.fields.text) ? this.fields.text : '';
                filterQuery.where(mapping, filterType, queryString, this.ignoreCase, this.ignoreAccent);
            }
        }
        if (!isNullOrUndefined(this.suggestionCount)) {
            // Since defualt value of suggestioncount is 25, checked the condition
            if (this.suggestionCount !== 25) {
                for (let queryElements: number = 0; queryElements < filterQuery.queries.length; queryElements++) {
                    if (filterQuery.queries[queryElements as number].fn === 'onTake') {
                        filterQuery.queries.splice(queryElements, 1);
                    }
                }
            }
            filterQuery.take(this.suggestionCount);
        }
        return filterQuery;
    }

    private renderHightSearch(): void {
        if (this.highlight) {
            for (let i: number = 0; i < this.liCollections.length; i++) {
                const isHighlight: HTMLElement = this.ulElement.querySelector('.e-active');
                if (!isHighlight) {
                    revertHighlightSearch(this.liCollections[i as number]);
                    highlightSearch(this.liCollections[i as number], this.queryString, this.ignoreCase, this.filterType);
                }
            }
        }
    }

    private getTextRange(): string {
        let text: string;
        if (!this.isContentEditable(this.inputElement)) {
            const component: HTMLInputElement | HTMLTextAreaElement = (this.inputElement as HTMLInputElement | HTMLTextAreaElement);
            if (!isNullOrUndefined(component)) {
                const startPos: number = component.selectionStart;
                if (component.value && startPos >= 0) {
                    text = component.value.substring(0, startPos);
                }
            }
        } else {
            if (this.range) {
                const selectedElem: Node = this.range.startContainer;
                if (!isNullOrUndefined(selectedElem)) {
                    const workingNodeContent: string = selectedElem.textContent;
                    const selectStartOffset: number = this.range.startOffset;
                    if (workingNodeContent && selectStartOffset >= 0) {
                        text = workingNodeContent.substring(0, selectStartOffset);
                    }
                }
            }
        }
        return text;
    }

    private getLastLetter(text: string): string {
        if (isNullOrUndefined(text)) {return ''; }
        const textValue: string = text.replace(/\u00A0/g, ' ');
        const words: string[] = textValue.split(/\s+/);
        const wordCnt: number = words.length - 1;
        return words[wordCnt as number].trim();
    }

    private isContentEditable(element: HTMLInputElement | HTMLTextAreaElement | HTMLElement): boolean {
        return element && element.nodeName !== 'INPUT' && element.nodeName !== 'TEXTAREA';
    }

    /**
     * Opens the popup that displays the list of items.
     *
     * @returns {void}
     */
    public showPopup(): void {
        this.beforePopupOpen = true;
        if (isNullOrUndefined(this.list)) {
            this.initValue();
        }
        this.renderPopup();
        attributes(this.inputElement, { 'aria-activedescendant': this.selectedElementID});
        if (this.selectedElementID == null)
        {
            this.inputElement.removeAttribute('aria-activedescendant');
        }
    }

    /* eslint-disable valid-jsdoc, jsdoc/require-param */
    /**
     * Hides the popup if it is in an open state.
     *
     * @returns {void}
     */
    public hidePopup(e?: MouseEvent | KeyboardEventArgs): void {
        this.removeSelection();
        this.closePopup(0, e);
    }

    private closePopup(delay: number, e: MouseEvent | KeyboardEventArgs): void {
        if (!(this.popupObj && document.body.contains(this.popupObj.element) && this.beforePopupOpen)) {
            return;
        }
        EventHandler.remove(document, 'mousedown', this.onDocumentClick);
        this.inputElement.removeAttribute('aria-owns');
        this.inputElement.removeAttribute('aria-activedescendant');
        this.beforePopupOpen = false;
        const animModel: AnimationModel = {
            name: 'FadeOut',
            duration: 100,
            delay: delay ? delay : 0
        };
        const popupInstance: Popup = this.popupObj;
        const eventArgs: PopupEventArgs = { popup: popupInstance, cancel: false, animation: animModel , event: e || null};
        this.trigger('closed', eventArgs, (eventArgs: PopupEventArgs) => {
            if (!eventArgs.cancel && this.popupObj) {
                if (this.isPopupOpen) {
                    this.popupObj.hide(new Animation(eventArgs.animation));
                } else {
                    this.destroyPopup();
                }
            }
        });
    }

    private renderPopup(): void {
        const args: BeforeOpenEventArgs = { cancel: false };
        this.trigger('beforeOpen', args, (args: BeforeOpenEventArgs) => {
            if (!args.cancel) {
                let popupEle: HTMLElement;
                if (isNullOrUndefined(this.target)) {
                    popupEle = this.createElement('div', {
                        id: this.inputElement.id + '_popup', className: 'e-mention e-popup ' + (this.cssClass != null ? this.cssClass : '')
                    });
                } else {
                    popupEle = this.element;
                    if (this.cssClass != null) { addClass([popupEle], this.cssClass.split(' ')); }
                }
                if (!isNullOrUndefined(this.target)) {
                    popupEle.id = this.inputElement.id + '_popup';
                    addClass([popupEle], ['e-mention' , 'e-popup',  'e-popup-close']);
                }
                this.listHeight = formatUnit(this.popupHeight);
                if (!isNullOrUndefined(this.list.querySelector('li')) && !this.initRemoteRender) {
                    const li: HTMLLIElement = this.list.querySelector('.' + dropDownBaseClasses.focus);
                    if (!isNullOrUndefined(li)) {
                        this.selectedLI = li;
                        const value: string | number | boolean = this.getFormattedValue(li.getAttribute('data-value'));
                        this.selectEventCallback(li, this.getDataByValue(value), value, true);
                    }
                }
                append([this.list], popupEle);
                if ((!this.popupObj || !document.body.contains(this.popupObj.element)) ||
                 !document.contains(popupEle) && isNullOrUndefined(this.target)) {
                    document.body.appendChild(popupEle);
                }
                let coordinates: { [key: string]: number };
                popupEle.style.visibility = 'hidden';
                this.setHeight(popupEle);
                const offsetValue: number = 0;
                const left: number = 0;
                this.initializePopup(popupEle, offsetValue, left);
                this.checkCollision(popupEle);
                popupEle.style.visibility = 'visible';
                if (!isNullOrUndefined(this.list)) {
                    this.unWireListEvents(); this.wireListEvents();
                }
                this.selectedElementID = this.selectedLI ? this.selectedLI.id : null;
                attributes(this.inputElement, { 'aria-owns': this.inputElement.id + '_options', 'aria-activedescendant': this.selectedElementID });
                if (this.selectedElementID == null)
                {
                    this.inputElement.removeAttribute('aria-activedescendant');
                }
                const animModel: AnimationModel = { name: 'FadeIn', duration: 100 };
                this.beforePopupOpen = true;
                const popupInstance: Popup = this.popupObj;
                const eventArgs: PopupEventArgs = { popup: popupInstance, cancel: false, animation: animModel };
                this.trigger('opened', eventArgs, (eventArgs: PopupEventArgs) => {
                    if (!eventArgs.cancel) {
                        this.renderReactTemplates();
                        this.popupObj.show(new Animation(eventArgs.animation), (this.zIndex === 1000) ? this.inputElement : null);
                        if (isNullOrUndefined(this.getTriggerCharPosition())) { return; }
                        coordinates = this.getCoordinates(this.inputElement, this.getTriggerCharPosition());
                        if (!this.isCollided) {
                            popupEle.style.cssText = 'top: '.concat(coordinates.top.toString(), 'px;\n left: ').concat(coordinates.left.toString(), 'px;\nposition: absolute;\n display: block;');
                        } else {
                            popupEle.style.left = formatUnit(coordinates.left);
                            this.isCollided = false;
                        }
                        popupEle.style.width = this.popupWidth !== '100%' && !isNullOrUndefined(this.popupWidth) ? formatUnit(this.popupWidth) : 'auto';
                        this.setHeight(popupEle);
                        popupEle.style.zIndex = this.zIndex === 1000 ? getZindexPartial(popupEle).toString() : this.zIndex.toString();
                    } else {
                        this.beforePopupOpen = false;
                        this.destroyPopup();
                    }
                });
            } else {
                this.beforePopupOpen = false;
            }
        });
    }

    private setHeight(popupEle: HTMLElement): void {
        if (this.popupHeight !== 'auto') {
            this.list.style.maxHeight = (parseInt(this.listHeight, 10) - 2).toString() + 'px'; // due to box-sizing property
            popupEle.style.maxHeight = formatUnit(this.popupHeight);
        } else {
            popupEle.style.height = 'auto';
        }
    } 

    private checkCollision(popupEle: HTMLElement): void {
        if (!Browser.isDevice || (Browser.isDevice && !(this.getModuleName() === 'mention'))) {
            const collision: string[] = isCollide(popupEle);
            if (collision.length > 0) {
                popupEle.style.marginTop = -parseInt(getComputedStyle(popupEle).marginTop, 10) + 'px';
                this.isCollided = true;
            }
            this.popupObj.resolveCollision();
        }
    }

    private getTriggerCharPosition(): number  {
        let mostRecentTriggerCharPos: number;
        const currentRange: string = this.getTextRange();
        if (currentRange !== undefined && currentRange !== null) {
            mostRecentTriggerCharPos = 0;
            const idx: number = currentRange.lastIndexOf(this.mentionChar);
            if (idx >= mostRecentTriggerCharPos) {
                mostRecentTriggerCharPos = idx;
            }
        }
        return mostRecentTriggerCharPos;
    }

    private initializePopup(element: HTMLElement, offsetValue: number, left: number): void {
        this.popupObj = new Popup(element, {
            width: this.setWidth(), targetType: 'relative',
            relateTo: this.inputElement, collision: { X: 'flip', Y: 'flip' }, offsetY: offsetValue,
            enableRtl: this.enableRtl, offsetX: left, position: { X: 'top', Y: 'left' }, actionOnScroll: 'hide',
            zIndex: this.zIndex,
            close: () => {
                this.destroyPopup();
            },
            open: () => {
                EventHandler.add(document, 'mousedown', this.onDocumentClick, this);
                this.isPopupOpen = true;
                this.setDataIndex();
            }
        });
    }

    private setWidth(): string {
        let width: string = formatUnit(this.popupWidth);
        if (width.indexOf('%') > -1) {
            const inputWidth: number = this.inputElement.offsetWidth * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        return width;
    }

    private destroyPopup(): void {
        this.isPopupOpen = false;
        this.popupObj.destroy();
        if (isNullOrUndefined(this.target)) {
            detach(this.popupObj.element);
        } else {
            this.popupObj.element.innerHTML = '';
            this.popupObj.element.removeAttribute('style');
            this.popupObj.element.removeAttribute('aria-disabled');
        }
    }

    private onDocumentClick(e: MouseEvent): void {
        const target: HTMLElement = <HTMLElement>e.target;
        if (!(!isNullOrUndefined(this.popupObj) && closest(target, '#' + this.popupObj.element.id))) {
            this.hidePopup(e);
        }
    }

    private getCoordinates(element: HTMLInputElement | HTMLTextAreaElement | HTMLElement, position: number): { [key: string]: number } {
        const properties: string[] = ['direction', 'boxSizing', 'width', 'height', 'overflowX', 'overflowY', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize', 'fontSizeAdjust', 'lineHeight', 'fontFamily', 'textAlign', 'textTransform', 'textIndent', 'textDecoration', 'letterSpacing', 'wordSpacing'];
        let div: HTMLElement;
        let span: HTMLElement;
        let range: Range;
        let globalRange: Range;
        let coordinates: { [key: string]: number };
        let computed: CSSStyleDeclaration;
        let rect: ClientRect;
        if (!this.isContentEditable(this.inputElement)) {
            div = this.createElement('div', { className: 'e-form-mirror-div'});
            document.body.appendChild(div);
            computed = getComputedStyle((element as HTMLInputElement | HTMLTextAreaElement));
            div.style.position = 'absolute';
            div.style.visibility = 'hidden';
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            properties.forEach((prop: any) => {
                // eslint-disable-next-line security/detect-object-injection
                div.style[prop] = computed[prop];
            });
            div.textContent = (element as HTMLInputElement | HTMLTextAreaElement).value.substring(0, position);
            if (this.inputElement.nodeName === 'INPUT') {
                div.textContent = div.textContent.replace(/\s/g, '\u00a0');
            }
            span = this.createElement('span');
            span.textContent = (element as HTMLInputElement | HTMLTextAreaElement).value.substring(position) || '.';
            div.appendChild(span);
            rect = (element as HTMLInputElement | HTMLTextAreaElement).getBoundingClientRect();
        } else {
            const selectedNodePosition: number = this.getTriggerCharPosition();
            globalRange = this.range;
            range = document.createRange();
            range.setStart(globalRange.startContainer, selectedNodePosition);
            range.setEnd(globalRange.startContainer, selectedNodePosition);
            range.collapse(false);
            rect = range.getBoundingClientRect();
        }
        const doc: HTMLElement = document.documentElement;
        const windowLeft: number = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        const windowTop: number = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
        if (!this.isContentEditable(this.inputElement)) {
            coordinates = {
                top: rect.top + windowTop + span.offsetTop + parseInt(computed.borderTopWidth, 10) +
                    parseInt(computed.fontSize, 10) + 3 - (element as HTMLInputElement | HTMLTextAreaElement).scrollTop,
                left: rect.left + windowLeft + span.offsetLeft + parseInt(computed.borderLeftWidth, 10)
            };
            document.body.removeChild(div);
        } else {
            coordinates = {
                top: rect.top + windowTop + parseInt(getComputedStyle(this.inputElement).fontSize, 10),
                left: rect.left + windowLeft
            };
        }
        return coordinates;
    }

    private initValue(): void {
        this.renderList();
        if (this.dataSource instanceof DataManager) {
            this.initRemoteRender = true;
        } else {
            this.updateValues();
        }
    }

    private updateValues(): void {
        const li: HTMLElement = this.list.querySelector('.' + dropDownBaseClasses.focus);
        if (!isNullOrUndefined(li)) {
            this.setSelection(li, null);
        }
    }

    protected renderList(): void {
        super.render();
        this.unWireListEvents();
        this.wireListEvents();
    }

    /**
     * Event binding for list
     *
     * @returns {void}
     */
    private wireListEvents(): void {
        EventHandler.add(this.list, 'click', this.onMouseClick, this);
        EventHandler.add(this.list, 'mouseover', this.onMouseOver, this);
        EventHandler.add(this.list, 'mouseout', this.onMouseLeave, this);
    }

    /**
     * Event un binding for list items.
     *
     * @returns {void}
     */
    private unWireListEvents(): void {
        EventHandler.remove(this.list, 'click', this.onMouseClick);
        EventHandler.remove(this.list, 'mouseover', this.onMouseOver);
        EventHandler.remove(this.list, 'mouseout', this.onMouseLeave);
    }

    private onMouseClick(e: MouseEvent): void {
        const target: Element = <Element>e.target;
        const li: HTMLElement = <HTMLElement>closest(target, '.' + dropDownBaseClasses.li);
        if (!this.isValidLI(li)) {
            return;
        }
        this.setSelection(li, e);
        const delay: number = 100;
        this.closePopup(delay, e);
        this.inputElement.focus();
    }

    private updateSelectedItem(
        li: Element,
        e: MouseEvent | KeyboardEvent | TouchEvent,
        preventSelect?: boolean,
        isSelection?: boolean): void {
        this.removeSelection();
        li.classList.add(dropDownBaseClasses.selected);
        this.removeHover();
        const value: string | number | boolean = this.getFormattedValue(li.getAttribute('data-value'));
        const selectedData: string | number | boolean | {
            [key: string]: Object
        } = this.getDataByValue(value);
        if (!preventSelect && !isNullOrUndefined(e)) {
            const items: FieldSettingsModel = this.detachChanges(selectedData);
            this.isSelected = true;
            const eventArgs: SelectEventArgs = {
                e: e,
                item: li as HTMLLIElement,
                itemData: items,
                isInteracted: e ? true : false,
                cancel: false
            };
            this.trigger('select', eventArgs, (eventArgs: SelectEventArgs) => {
                if (eventArgs.cancel) {
                    li.classList.remove(dropDownBaseClasses.selected);
                } else {
                    this.selectEventCallback(li, selectedData, value);
                    if (isSelection) {
                        this.setSelectOptions(li, e);
                    }
                }
            });
        } else {
            this.selectEventCallback(li, selectedData, value);
            if (isSelection) {
                this.setSelectOptions(li, e);
            }
        }
    }

    private setSelection(li: Element, e: MouseEvent | KeyboardEventArgs | TouchEvent): void {
        if (this.isValidLI(li) && (!li.classList.contains(dropDownBaseClasses.selected) || (this.isPopupOpen && this.isSelected
            && li.classList.contains(dropDownBaseClasses.selected)))) {
            this.updateSelectedItem(li, e, false, true);
        } else {
            this.setSelectOptions(li, e);
        }
    }

    private setSelectOptions(li: Element, e?: MouseEvent | KeyboardEventArgs | KeyboardEvent | TouchEvent): void {
        if (this.list) {
            this.removeHover();
        }
        this.previousSelectedLI = (!isNullOrUndefined(this.selectedLI)) ? this.selectedLI : null;
        this.selectedLI = li as HTMLLIElement;
        if (this.isPopupOpen && !isNullOrUndefined(this.selectedLI)) {
            this.setScrollPosition(e as KeyboardEventArgs);
        }
        if (e && ((e as KeyboardEventArgs).keyCode === 38 || (e as KeyboardEventArgs).keyCode === 40)) { return; }
        if (isNullOrUndefined(e) || this.setValue(e as KeyboardEventArgs)) {
            return;
        }
    }

    private setScrollPosition(e?: KeyboardEventArgs): void {
        if (!isNullOrUndefined(e)) {
            switch (e.action) {
            case 'pageDown':
            case 'down':
            case 'end':
                this.scrollBottom();
                break;
            default:
                this.scrollTop();
                break;
            }
        } else {
            this.scrollBottom(true);
        }
    }

    private scrollBottom(isInitial?: boolean): void {
        if (!isNullOrUndefined(this.selectedLI)) {
            const currentOffset: number = this.list.offsetHeight;
            const nextBottom: number = this.selectedLI.offsetTop + this.selectedLI.offsetHeight - this.list.scrollTop;
            let nextOffset: number = this.list.scrollTop + nextBottom - currentOffset;
            nextOffset = isInitial ? nextOffset + parseInt(getComputedStyle(this.list).paddingTop, 10) * 2 : nextOffset;
            const boxRange: number = this.selectedLI.offsetTop + this.selectedLI.offsetHeight - this.list.scrollTop;
            if (this.activeIndex === 0) {
                this.list.scrollTop = 0;
            } else if (nextBottom > currentOffset || !(boxRange > 0 && this.list.offsetHeight > boxRange)) {
                this.list.scrollTop = nextOffset;
            }
        }
    }

    private scrollTop(): void {
        if (!isNullOrUndefined(this.selectedLI)) {
            let nextOffset: number = this.selectedLI.offsetTop - this.list.scrollTop;
            nextOffset = this.fields.groupBy && nextOffset;
            const boxRange: number = (this.selectedLI.offsetTop + this.selectedLI.offsetHeight - this.list.scrollTop);
            if (this.activeIndex === 0) {
                this.list.scrollTop = 0;
            } else if (nextOffset < 0) {
                this.list.scrollTop = this.list.scrollTop + nextOffset;
            } else if (!(boxRange > 0 && this.list.offsetHeight > boxRange)) {
                this.list.scrollTop = this.selectedLI.offsetTop;
            }
        }
    }

    private selectEventCallback(
        li: Element,
        selectedData?: string | number | boolean | { [key: string]: Object },
        value?: string | number | boolean, selectLi?: boolean): void {
        this.previousItemData = (!isNullOrUndefined(this.itemData)) ? this.itemData : null;
        this.item = li as HTMLLIElement;
        this.itemData = selectedData;
        const focusedItem: Element = this.list.querySelector('.' + dropDownBaseClasses.focus);
        if (focusedItem) {
            removeClass([focusedItem], dropDownBaseClasses.focus);
        }
        if (selectLi) {
            addClass([li], dropDownBaseClasses.selected);
        }
        li.setAttribute('aria-selected', 'true');
        this.activeIndex = this.getIndexByValue(value);
    }

    private detachChanges(value: string | number | boolean | {
        [key: string]: Object
    }): FieldSettingsModel {
        let items: FieldSettingsModel;
        if (typeof value === 'string' ||
            typeof value === 'boolean' ||
            typeof value === 'number') {
            items = Object.defineProperties({}, {
                value: {
                    value: value,
                    enumerable: true
                },
                text: {
                    value: value,
                    enumerable: true
                }
            });
        } else {
            items = value;
        }
        return items;
    }

    private setValue(e?: KeyboardEventArgs | MouseEvent): boolean {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(this as any).isReact) {
            if (!isNullOrUndefined(this.displayTemplate)) {
                this.setDisplayTemplate();
            }
            this.updateMentionValue(e);
            return true;
        }
        else {
            if (!isNullOrUndefined(this.displayTemplate)) {
                this.setDisplayTemplate(e);
            } else {
                this.updateMentionValue(e);
            }
            return true;
        }
    }

    private updateMentionValue(e?: KeyboardEventArgs | MouseEvent): void {
        const dataItem: { [key: string]: string } = this.getItemData();
        let textSuffix: string;
        let value: string;
        let endPos: number;
        let range: Range;
        let globalRange: Range;
        const selection: Selection = this.inputElement.ownerDocument.getSelection();
        const startPos: number = this.getTriggerCharPosition();
        textSuffix = typeof this.suffixText === 'string' ? this.suffixText : '';
        if (dataItem.text !== null) {
            value = this.mentionVal(dataItem.text);
        }
        if (!this.isContentEditable(this.inputElement)) {
            const myField: HTMLInputElement | HTMLTextAreaElement = this.inputElement as HTMLInputElement | HTMLTextAreaElement;
            const currentTriggerSnippet: string =
             this.getTextRange().substring(startPos + this.mentionChar.length, this.getTextRange().length);
            value += textSuffix;
            endPos = startPos + this.mentionChar.length;
            endPos += currentTriggerSnippet.length;
            myField.value = myField.value.substring(0, startPos) + value + myField.value.substring(endPos, myField.value.length);
            myField.selectionStart = startPos + value.length;
            myField.selectionEnd = startPos + value.length;
            if (this.isPopupOpen) { this.hidePopup(); }
            this.onChangeEvent(e);
        } else {
            endPos = this.getTriggerCharPosition() + this.mentionChar.length;
            if (this.range && (this.range.startContainer.textContent.trim() !== this.mentionChar)) {
                endPos = this.range.endOffset;
            }
            globalRange = this.range;
            range = document.createRange();
            range.setStart(globalRange.startContainer, startPos);
            range.setEnd(globalRange.startContainer, endPos);
            range.deleteContents();
            const element: HTMLElement = this.createElement('div');
            element.innerHTML = value;
            const frag: DocumentFragment = document.createDocumentFragment();
            let node: Node;
            let lastNode: Node;
            // eslint-disable-next-line no-cond-assign
            while (node = element.firstChild) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            }
            if (this.isPopupOpen) { this.hidePopup(); }
            this.onChangeEvent(e);
        }
    }

    private mentionVal(value: string): string {
        const showChar: string = this.showMentionChar ? this.mentionChar : '';
        if (!isNullOrUndefined(this.displayTemplate) && !isNullOrUndefined(this.displayTempElement)) {
            value = this.displayTempElement.innerHTML;
        }
        if (this.isContentEditable(this.inputElement)) {
            return '<span contenteditable="false" class="e-mention-chip">' + showChar + value + '</span>'.concat(typeof this.suffixText === 'string' ? this.suffixText : ' ');
        } else {
            return showChar + value;
        }
    }

    private setDisplayTemplate(e?: KeyboardEventArgs | MouseEvent): void {
        let compiledString: Function;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((this as any).isReact) {
            this.clearTemplate(['displayTemplate']);
            if (this.displayTempElement) {
                detach(this.displayTempElement);
                this.displayTempElement = null;
            }
        }
        if (!this.displayTempElement) {
            this.displayTempElement = this.createElement('div');
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(this as any).isReact) {
            this.displayTempElement.innerHTML = '';
        }
        compiledString = compile(this.displayTemplate);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const displayCompTemp: any = compiledString(
            this.itemData, this, 'displayTemplate', this.displayTemplateId, this.isStringTemplate, null, this.displayTempElement);
        if (displayCompTemp && displayCompTemp.length > 0) {
            for (let i: number = 0; i < displayCompTemp.length; i++) {
                this.displayTempElement.appendChild(displayCompTemp[i as number]);
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(this as any).isReact) {
            this.renderTemplates();
        } else {
            this.renderTemplates(() => {
                this.updateMentionValue(e);
            });
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private renderTemplates(callBack?: any): void {
        this.renderReactTemplates(callBack);
    }

    private setSpinnerTemplate(): void {
        let compiledString: Function;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((this as any).isReact) {
            this.clearTemplate(['spinnerTemplate']);
            if (this.spinnerTemplateElement) {
                detach(this.spinnerTemplateElement);
                this.spinnerTemplateElement = null;
            }
        }
        if (!this.spinnerTemplateElement) {
            this.spinnerTemplateElement = this.createElement('div');
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(this as any).isReact) {
            this.spinnerTemplateElement.innerHTML = '';
        }
        compiledString = compile(this.spinnerTemplate);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const spinnerCompTemp: any = compiledString(
            null, this, 'spinnerTemplate', this.spinnerTemplateId, this.isStringTemplate, null, this.spinnerTemplateElement);
        if (spinnerCompTemp && spinnerCompTemp.length > 0) {
            for (let i: number = 0; i < spinnerCompTemp.length; i++) {
                this.spinnerTemplateElement.appendChild(spinnerCompTemp[i as number]);
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(this as any).isReact) {
            this.renderTemplates();
            this.popupObj.element.appendChild(this.spinnerTemplateElement);
        }
        else {
            this.renderTemplates(() => {
                this.popupObj.element.appendChild(this.spinnerTemplateElement);
            });
        }
    }

    private onChangeEvent(eve: MouseEvent | KeyboardEvent | TouchEvent): void {
        this.isSelected = false;
        const items: FieldSettingsModel = this.detachMentionChanges(this.itemData);
        let preItems: FieldSettingsModel;
        if (typeof this.previousItemData === 'string' ||
            typeof this.previousItemData === 'boolean' ||
            typeof this.previousItemData === 'number') {
            preItems = Object.defineProperties({}, {
                value: {
                    value: this.previousItemData,
                    enumerable: true
                },
                text: {
                    value: this.previousItemData,
                    enumerable: true
                }
            });
        } else {
            preItems = this.previousItemData;
        }
        const eventArgs: MentionChangeEventArgs = {
            e: eve,
            item: this.item,
            itemData: items,
            previousItem: this.previousSelectedLI as HTMLLIElement,
            previousItemData: preItems,
            isInteracted: eve ? true : false,
            value: this.item.innerHTML,
            element: this.inputElement
        };
        this.trigger('change', eventArgs);
    }

    private detachMentionChanges(value: string | number | boolean | {
        [key: string]: Object
    }): FieldSettingsModel {
        let items: FieldSettingsModel;
        if (typeof value === 'string' ||
            typeof value === 'boolean' ||
            typeof value === 'number') {
            items = Object.defineProperties({}, {
                value: {
                    value: value,
                    enumerable: true
                },
                text: {
                    value: value,
                    enumerable: true
                }
            });
        } else {
            items = value;
        }
        return items;
    }

    private getItemData(): { [key: string]: string } {
        const fields: FieldSettingsModel = this.fields;
        let dataItem: { [key: string]: string | Object } | string | boolean | number = null;
        dataItem = this.itemData;
        let dataValue: string;
        let dataText: string;
        if (!isNullOrUndefined(dataItem)) {
            dataValue = getValue(fields.value, dataItem);
            dataText = getValue(fields.text, dataItem);
        }
        const value: string = <string>(!isNullOrUndefined(dataItem) &&
            !isUndefined(dataValue) ? dataValue : dataItem);
        const text: string = <string>(!isNullOrUndefined(dataItem) &&
            !isUndefined(dataValue) ? dataText : dataItem);
        return { value: value, text: text };
    }

    private removeSelection(): void {
        if (this.list) {
            const selectedItems: Element[] = <NodeListOf<Element> &
            Element[]>this.list.querySelectorAll('.' + dropDownBaseClasses.selected);
            if (selectedItems.length) {
                removeClass(selectedItems, dropDownBaseClasses.selected);
                selectedItems[0].removeAttribute('aria-selected');
            }
        }
    }

    private onMouseOver(e: MouseEvent): void {
        const currentLi: HTMLElement = <HTMLElement>closest(<Element>e.target, '.' + dropDownBaseClasses.li);
        this.setHover(currentLi);
    }

    private setHover(li: HTMLElement): void {
        if (this.isValidLI(li) && !li.classList.contains(dropDownBaseClasses.hover)) {
            this.removeHover();
            addClass([li], dropDownBaseClasses.hover);
        }
    }

    private removeHover(): void {
        if (this.list) {
            const hoveredItem: Element[] = <NodeListOf<Element> & Element[]>this.list.querySelectorAll('.' + dropDownBaseClasses.hover);
            if (hoveredItem && hoveredItem.length) {
                removeClass(hoveredItem, dropDownBaseClasses.hover);
            }
        }
    }

    private isValidLI(li: Element | HTMLElement): boolean {
        return (li && li.hasAttribute('role') && li.getAttribute('role') === 'option');
    }

    private onMouseLeave(): void {
        this.removeHover();
    }

    /**
     * Search the entered text and show it in the suggestion list if available.
     *
     * @returns {void}
     */
    public search(text: string, positionX: number, positionY: number): void {
        if (this.isContentEditable(this.inputElement)) {
            this.range = this.getCurrentRange();
        }
        const currentRange: string = this.getTextRange();
	    const lastWordRange: string = this.getLastLetter(currentRange);
        if ((this.ignoreCase && (text === lastWordRange || text === lastWordRange.toLowerCase()))
            || !this.ignoreCase && text === lastWordRange) {
            this.resetList(this.dataSource, this.fields);
        } else {
            if (this.isPopupOpen) {
                this.hidePopup();
            }
            return;
        }
        if (isNullOrUndefined(this.list)) {
            this.renderList();
            this.renderPopup();
        }
        else {
            this.showPopup();
        }
        this.popupObj.element.style.left = formatUnit(positionX);
        this.popupObj.element.style.top = formatUnit(positionY);
    }

    /**
     * Removes the component from the DOM and detaches all its related event handlers. Also it removes the attributes and classes.
     *
     * @method destroy
     * @returns {void}
     */
    public destroy(): void {
        this.hidePopup();
        this.unWireEvent();
        if (this.list) {
            this.unWireListEvents();
        }
        if (this.inputElement && !this.inputElement.classList.contains('e-' + this.getModuleName())) {
            return;
        }
        super.destroy();
    }

    protected getLocaleName(): string {
        return 'mention';
    }

    protected getNgDirective(): string {
        return 'EJS-MENTION';
    }

    /**
     * Return the module name of this component.
     *
     * @private
     * @returns {string} Return the module name of this component.
     */
    public getModuleName(): string {
        return 'mention';
    }
}
