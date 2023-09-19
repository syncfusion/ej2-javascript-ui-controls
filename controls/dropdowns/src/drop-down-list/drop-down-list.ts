// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path='../drop-down-base/drop-down-base-model.d.ts'/>
import { EventHandler, Property, Event, compile, EmitType, KeyboardEvents, append, select, ModuleDeclaration } from '@syncfusion/ej2-base';
import { attributes, isNullOrUndefined, getUniqueID, formatUnit, isUndefined, getValue } from '@syncfusion/ej2-base';
import { Animation, AnimationModel, Browser, KeyboardEventArgs, NotifyPropertyChanges } from '@syncfusion/ej2-base';
import { addClass, removeClass, closest, prepend, detach, classList } from '@syncfusion/ej2-base';
import { Popup, isCollide, createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { IInput, Input, InputObject, FloatLabelType } from '@syncfusion/ej2-inputs';
import { incrementalSearch, resetIncrementalSearchValues } from '../common/incremental-search';
import { DropDownBase, dropDownBaseClasses, SelectEventArgs, FilteringEventArgs, PopupEventArgs } from '../drop-down-base/drop-down-base';
import { FocusEventArgs, ResultData, BeforeOpenEventArgs } from '../drop-down-base/drop-down-base';
import { FieldSettingsModel } from '../drop-down-base/drop-down-base-model';
import { DropDownListModel } from '../drop-down-list';
import { DataManager, Query, Predicate, DataOptions } from '@syncfusion/ej2-data';
import {VirtualScroll, Offsets, ScrollDirection, SentinelType, VirtualInfo} from '../common/virtual-scroll';
import { Skeleton } from '@syncfusion/ej2-notifications';

export interface ChangeEventArgs extends SelectEventArgs {
    /**
     * Returns the selected value
     *
     * @isGenericType true
     */
    value: number | string | boolean
    /**
     * Returns the previous selected list item
     */
    previousItem: HTMLLIElement
    /**
     * Returns the previous selected item as JSON Object from the data source.
     *
     */
    previousItemData: FieldSettingsModel
    /**
     * Returns the root element of the component.
     */
    element: HTMLElement
    /**
     * Specifies the original event arguments.
     */
    event: MouseEvent | KeyboardEvent | TouchEvent
}

export interface GeneratedData {
    [key: string]: Object
}[];
// don't use space in classnames
export const dropDownListClasses: DropDownListClassList = {
    root: 'e-dropdownlist',
    hover: dropDownBaseClasses.hover,
    selected: dropDownBaseClasses.selected,
    rtl: dropDownBaseClasses.rtl,
    li: dropDownBaseClasses.li,
    disable: dropDownBaseClasses.disabled,
    base: dropDownBaseClasses.root,
    focus: dropDownBaseClasses.focus,
    content: dropDownBaseClasses.content,
    input: 'e-input-group',
    inputFocus: 'e-input-focus',
    icon: 'e-input-group-icon e-ddl-icon',
    iconAnimation: 'e-icon-anim',
    value: 'e-input-value',
    device: 'e-ddl-device',
    backIcon: 'e-input-group-icon e-back-icon e-icons',
    filterBarClearIcon: 'e-input-group-icon e-clear-icon e-icons',
    filterInput: 'e-input-filter',
    filterParent: 'e-filter-parent',
    mobileFilter: 'e-ddl-device-filter',
    footer: 'e-ddl-footer',
    header: 'e-ddl-header',
    clearIcon: 'e-clear-icon',
    clearIconHide: 'e-clear-icon-hide',
    popupFullScreen: 'e-popup-full-page',
    disableIcon: 'e-ddl-disable-icon',
    hiddenElement: 'e-ddl-hidden',
    virtualList: 'e-list-item e-virtual-list',
};


const inputObject: InputObject = {
    container: null,
    buttons: []
};

/**
 * The DropDownList component contains a list of predefined values from which you can
 * choose a single value.
 * ```html
 * <input type="text" tabindex="1" id="list"> </input>
 * ```
 * ```typescript
 *   let dropDownListObj:DropDownList = new DropDownList();
 *   dropDownListObj.appendTo("#list");
 * ```
 */

@NotifyPropertyChanges
export class DropDownList extends DropDownBase implements IInput {
    protected inputWrapper: InputObject;
    protected inputElement: HTMLInputElement;
    private valueTempElement: HTMLSpanElement;
    private listObject: HTMLElement;
    private header: HTMLElement;
    private footer: HTMLElement;
    protected selectedLI: HTMLElement;
    protected previousSelectedLI: HTMLElement;
    protected previousItemData: { [key: string]: Object } | string | number | boolean;
    private listHeight: string;
    private listItemHeight: number;
    private skeletonCount: number = 32;
    protected hiddenElement: HTMLSelectElement;
    protected isPopupOpen: boolean;
    private isDocumentClick: boolean;
    protected isInteracted: boolean;
    private isFilterFocus: boolean;
    protected beforePopupOpen: boolean;
    protected initial: boolean;
    private initRemoteRender: boolean;
    private searchBoxHeight: number;
    private popupObj: Popup;
    private popupContentElement: HTMLElement;
    private backIconElement: Element;
    private clearIconElement: Element;
    private containerStyle: ClientRect;
    protected previousValue: string | number | boolean;
    protected activeIndex: number;
    protected filterInput: HTMLInputElement;
    private searchKeyModule: KeyboardEvents;
    private tabIndex: string;
    private isNotSearchList: boolean;
    protected isTyped: boolean;
    protected isSelected: boolean;
    protected preventFocus: boolean;
    protected preventAutoFill: boolean;
    protected queryString: string;
    protected isValidKey: boolean;
    protected typedString: string;
    protected isEscapeKey: boolean;
    private isPreventBlur: boolean;
    protected isTabKey: boolean;
    private actionCompleteData: ActionCompleteData;
    private actionData: ActionCompleteData;
    protected prevSelectPoints: { [key: string]: number };
    protected isSelectCustom: boolean;
    protected isDropDownClick: boolean;
    protected preventAltUp: boolean;
    private searchKeyEvent: KeyboardEventArgs;
    private keyboardEvent: KeyboardEventArgs;
    private filterInputObj: InputObject;
    protected spinnerElement: HTMLElement;
    protected keyConfigure: { [key: string]: string };
    protected isCustomFilter: boolean;
    private isSecondClick: boolean;
    protected isListSearched: boolean = false;
    protected preventChange: boolean = false;
    protected isAngular: boolean = false;
    protected selectedElementID: string;
    protected itemCount: number = 10;
    private virtualListHeight: number = 0;
    private virtualItemCount: number;
    private isVirtualScrolling: boolean = false;
    private observer: VirtualScroll;
    protected isPreventScrollAction: boolean = false;
    private scrollPreStartIndex: number = 0;
    private isScrollActionTriggered: boolean = false;
    protected previousStartIndex: number = 0;
    private isMouseScrollAction: boolean = false;
    private isKeyBoardAction: boolean = false;
    private isUpwardScrolling: boolean = false;
    private containerElementRect: ClientRect;
    protected previousEndIndex: number; 
    private previousInfo: VirtualInfo;
    protected startIndex: number = 0;
    private currentPageNumber: number = 0;
    private pageCount: number = 0;
    private isPreventKeyAction: boolean = false;
    protected virtualItemStartIndex: number;
    private virtualItemEndIndex: number;
    private generatedDataObject: GeneratedData = {};
    protected virtualListInfo: VirtualInfo = {
        currentPageNumber: null,
        direction: null,
        sentinelInfo: {},
        offsets: {},
        startIndex: 0,
        endIndex: 0,
    };
    protected viewPortInfo: VirtualInfo = {
        currentPageNumber: null,
        direction: null,
        sentinelInfo: {},
        offsets: {},
        startIndex: 0,
        endIndex: 0,
    };
    private selectedValueInfo: VirtualInfo = {
        currentPageNumber: null,
        direction: null,
        sentinelInfo: {},
        offsets: {},
        startIndex: 0,
        endIndex: 0,
    };

    /**
     * Sets CSS classes to the root element of the component that allows customization of appearance.
     *
     * @default null
     */
    @Property(null)
    public cssClass: string;
    /**
     * Specifies the width of the component. By default, the component width sets based on the width of
     * its parent container. You can also set the width in pixel values.
     *
     * @default '100%'
     * @aspType string
     */
    @Property('100%')
    public width: string | number;
    /**
     * Specifies a value that indicates whether the component is enabled or not.
     *
     * @default true
     * @deprecated
     */
    @Property(true)
    public enabled: boolean;
    /**
     * Enable or disable persisting component's state between page reloads.
     * If enabled, following list of states will be persisted.
     * 1. value
     *
     * @default false
     * @deprecated
     */
    @Property(false)
    public enablePersistence: boolean;
    /**
     * Specifies the height of the popup list.
     * > For more details about the popup configuration refer to
     * [`Popup Configuration`](../../drop-down-list/getting-started#configure-the-popup-list) documentation.
     *
     * @default '300px'
     * @aspType string
     */
    @Property('300px')
    public popupHeight: string | number;
    /**
     * Specifies the width of the popup list. By default, the popup width sets based on the width of
     * the component.
     * > For more details about the popup configuration refer to
     * [`Popup Configuration`](../../drop-down-list/getting-started#configure-the-popup-list) documentation.
     *
     * @default '100%'
     * @aspType string
     */
    @Property('100%')
    public popupWidth: string | number;
    /**
     * Specifies a short hint that describes the expected value of the DropDownList component.
     *
     * @default null
     */
    @Property(null)
    public placeholder: string;
    /**
     * Accepts the value to be displayed as a watermark text on the filter bar.
     *
     * @default null
     */
    @Property(null)
    public filterBarPlaceholder: string;
    /**
     * Allows additional HTML attributes such as title, name, etc., and
     * accepts n number of attributes in a key-value pair format.
     *
     * {% codeBlock src='dropdownlist/htmlAttributes/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string };
    /**
     * Accepts the external `Query`
     * that execute along with data processing.
     *
     * {% codeBlock src='dropdownlist/query/index.md' %}{% endcodeBlock %}
     *
     * @default null
     * @deprecated
     */
    @Property(null)
    public query: Query;
    /**
     * Accepts the template design and assigns it to the selected list item in the input element of the component.
     * For more details about the available template options refer to
     * [`Template`](../../drop-down-list/templates) documentation.
     *
     * We have built-in `template engine`
     * which provides options to compile template string into a executable function.
     * For EX: We have expression evolution as like ES6 expression string literals.
     *
     * @default null
     * @aspType string
     */
    @Property(null)
    public valueTemplate: string | Function;
    /**
     * Accepts the template design and assigns it to the header container of the popup list.
     * > For more details about the available template options refer to [`Template`](../../drop-down-list/templates) documentation.
     *
     * @default null
     * @aspType string
     */
    @Property(null)
    public headerTemplate: string | Function;
    /**
     * Accepts the template design and assigns it to the footer container of the popup list.
     * > For more details about the available template options refer to [`Template`](../../drop-down-list/templates) documentation.
     *
     * @default null
     * @aspType string
     */
    @Property(null)
    public footerTemplate: string | Function;
    /**
     * When allowFiltering is set to true, show the filter bar (search box) of the component.
     * The filter action retrieves matched items through the `filtering` event based on
     * the characters typed in the search TextBox.
     *
     * If no match is found, the value of the `noRecordsTemplate` property will be displayed.
     * > For more details about the filtering refer to [`Filtering`](../../drop-down-list/filtering) documentation.
     *
     * {% codeBlock src="dropdownlist/allow-filtering-api/index.ts" %}{% endcodeBlock %}
     *
     * {% codeBlock src="dropdownlist/allow-filtering-api/index.html" %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public allowFiltering: boolean;
    /**
     * When set to true, the user interactions on the component are disabled.
     *
     * @default false
     */
    @Property(false)
    public readonly: boolean;
    /**
     * Defines whether to enable virtual scrolling in the component. 
     *
     * @default false
     */
    @Property(false)
    public enableVirtualization: boolean;
    /**
     * Gets or sets the display text of the selected item in the component.
     *
     * @default null
     */
    @Property(null)
    public text: string;
    /**
     * Gets or sets the value of the selected item in the component.
     *
     * @default null
     * @isGenericType true
     */
    @Property(null)
    public value: number | string | boolean;
    /**
     * Gets or sets the index of the selected item in the component.
     *
     * {% codeBlock src="dropdownlist/index-api/index.ts" %}{% endcodeBlock %}
     *
     * {% codeBlock src="dropdownlist/index-api/index.html" %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property(null)
    public index: number;
    /**
     * Specifies whether to display the floating label above the input element.
     * Possible values are:
     * * Never: The label will never float in the input when the placeholder is available.
     * * Always: The floating label will always float above the input.
     * * Auto: The floating label will float above the input after focusing or entering a value in the input.
     *
     * {% codeBlock src="dropdownlist/float-label-type-api/index.ts" %}{% endcodeBlock %}
     *
     * {% codeBlock src="dropdownlist/float-label-type-api/index.html" %}{% endcodeBlock %}
     *
     * @default Syncfusion.EJ2.Inputs.FloatLabelType.Never
     * @aspType Syncfusion.EJ2.Inputs.FloatLabelType
     * @isEnumeration true
     */
    @Property('Never')
    public floatLabelType: FloatLabelType;
    /**
     * Specifies whether to show or hide the clear button.
     * When the clear button is clicked, `value`, `text`, and `index` properties are reset to null.
     *
     * @default false
     */
    @Property(false)
    public showClearButton: boolean;
    /**
     * Triggers on typing a character in the filter bar when the
     * [`allowFiltering`](./#allowfiltering)
     * is enabled.
     * > For more details about the filtering refer to [`Filtering`](../../drop-down-list/filtering) documentation.
     *
     * @event filtering
     */
    @Event()
    public filtering: EmitType<FilteringEventArgs>;

    /**
     * Triggers when an item in a popup is selected or when the model value is changed by user.
     * Use change event to
     * [`Configure the Cascading DropDownList`](../../drop-down-list/how-to/cascading)
     *
     * @event change
     */
    @Event()
    public change: EmitType<ChangeEventArgs>;
    /**
     * Triggers when the popup before opens.
     *
     * @event beforeOpen
     */
    @Event()
    public beforeOpen: EmitType<Object>;
    /**
     * Triggers when the popup opens.
     *
     * @event open
     */
    @Event()
    public open: EmitType<PopupEventArgs>;
    /**
     * Triggers when the popup is closed.
     *
     * @event close
     */
    @Event()
    public close: EmitType<PopupEventArgs>;
    /**
     * Triggers when focus moves out from the component.
     *
     * @event blur
     */
    @Event()
    public blur: EmitType<Object>;
    /**
     * Triggers when the component is focused.
     *
     * @event focus
     */
    @Event()
    public focus: EmitType<Object>;

    /**
     * * Constructor for creating the DropDownList component.
     *
     * @param {DropDownListModel} options - Specifies the DropDownList model.
     * @param {string | HTMLElement} element - Specifies the element to render as component.
     * @private
     */
    public constructor(options?: DropDownListModel, element?: string | HTMLElement) {
        super(options, element);
    }

    /**
     * Initialize the event handler.
     *
     * @private
     * @returns {void}
     */
    protected preRender(): void {
        this.valueTempElement = null;
        this.element.style.opacity = '0';
        this.initializeData();
        super.preRender();
        this.activeIndex = this.index;
        this.queryString = '';
    }

    private initializeData(): void {
        this.isPopupOpen = false;
        this.isDocumentClick = false;
        this.isInteracted = false;
        this.isFilterFocus = false;
        this.beforePopupOpen = false;
        this.initial = true;
        this.initRemoteRender = false;
        this.isNotSearchList = false;
        this.isTyped = false;
        this.isSelected = false;
        this.preventFocus = false;
        this.preventAutoFill = false;
        this.isValidKey = false;
        this.typedString = '';
        this.isEscapeKey = false;
        this.isPreventBlur = false;
        this.isTabKey = false;
        this.actionCompleteData = { isUpdated: false };
        this.actionData = { isUpdated: false };
        this.prevSelectPoints = {};
        this.isSelectCustom = false;
        this.isDropDownClick = false;
        this.preventAltUp = false;
        this.isCustomFilter = false;
        this.isSecondClick = false;
        this.previousValue = null;
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
        this.viewPortInfo = {
            currentPageNumber: null,
            direction: null,
            sentinelInfo: {},
            offsets: {},
            startIndex: 0,
            endIndex: this.itemCount,
        };
    }

    protected setZIndex(): void {
        if (this.popupObj) {
            this.popupObj.setProperties({ 'zIndex': this.zIndex });
        }
    }

    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        if (this.enableVirtualization) {
            modules.push({ args: [this], member: 'VirtualScroll' });
        }
        return modules;
    }

    protected renderList(e?: MouseEvent | KeyboardEventArgs | TouchEvent, isEmptyData?: boolean): void {
        super.render(e, isEmptyData);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.totalItemCount = this.dataSource && (this.dataSource as any).length ? (this.dataSource as any).length : 0;
        this.unWireListEvents();
        this.wireListEvents();
    }

    private floatLabelChange(): void {
        if (this.getModuleName() === 'dropdownlist' && this.floatLabelType === 'Auto') {
            const floatElement: HTMLElement = <HTMLElement>this.inputWrapper.container.querySelector('.e-float-text');
            if (this.inputElement.value !== '' || this.isInteracted) {
                classList(floatElement, ['e-label-top'], ['e-label-bottom']);
            } else {
                classList(floatElement, ['e-label-bottom'], ['e-label-top']);
            }
        }
    }

    protected resetHandler(e: MouseEvent): void {
        e.preventDefault();
        this.clearAll(e);
        if (this.enableVirtualization) {
            this.list.scrollTop = 0;
            this.virtualListInfo = null;
            this.previousStartIndex = 0;
            this.previousEndIndex = 0;
        }
    }

    protected resetFocusElement(): void {
        this.removeHover();
        this.removeSelection();
        this.removeFocus();
        this.list.scrollTop = 0;
        if (this.getModuleName() !== 'autocomplete' && !isNullOrUndefined(this.ulElement)) {
            let li: Element = this.ulElement.querySelector('.' + dropDownListClasses.li);
            if(this.enableVirtualization){
                li = this.liCollections[this.skeletonCount];
            }
            if (li) {
                li.classList.add(dropDownListClasses.focus);
            }
        }
    }

    protected clearAll(e?: MouseEvent | KeyboardEventArgs | TouchEvent, properties?: DropDownListModel): void {
        this.previousItemData = (!isNullOrUndefined(this.itemData)) ? this.itemData : null;
        if (isNullOrUndefined(properties) || (!isNullOrUndefined(properties) &&
            (isNullOrUndefined(properties.dataSource) ||
                (!(properties.dataSource instanceof DataManager) && properties.dataSource.length === 0)))) {
            this.isActive = true;
            this.resetSelection(properties);
        }
        const dataItem: { [key: string]: string } = this.getItemData();
        if (this.previousValue === dataItem.value) {
            return;
        }
        this.onChangeEvent(e);
        this.checkAndResetCache();
        if (this.enableVirtualization) {
            this.updateInitialData();
        }
    }

    private resetSelection(properties?: DropDownListModel): void {
        if (this.list) {
            if ((!isNullOrUndefined(properties) &&
                (isNullOrUndefined(properties.dataSource) ||
                    (!(properties.dataSource instanceof DataManager) && properties.dataSource.length === 0)))) {
                this.selectedLI = null;
                this.actionCompleteData.isUpdated = false;
                this.actionCompleteData.ulElement = null;
                this.actionCompleteData.list = null;
                this.resetList(properties.dataSource);
            } else {
                if (this.allowFiltering && this.getModuleName() !== 'autocomplete'
                    && !isNullOrUndefined(this.actionCompleteData.ulElement) && !isNullOrUndefined(this.actionCompleteData.list) && 
                    this.actionCompleteData.list.length > 0) {
                    this.onActionComplete(this.actionCompleteData.ulElement.cloneNode(true) as HTMLElement, this.actionCompleteData.list);
                }
                this.resetFocusElement();
            }
        }
        if (!isNullOrUndefined(this.hiddenElement)) {
            this.hiddenElement.innerHTML = '';
        }
        if (!isNullOrUndefined(this.inputElement)) {
            this.inputElement.value = '';
        }
        this.value = null;
        this.itemData = null;
        this.text = null;
        this.index = null;
        this.activeIndex = null;
        this.item = null;
        this.queryString = '';
        if (this.valueTempElement) {
            detach(this.valueTempElement);
            this.inputElement.style.display = 'block';
            this.valueTempElement = null;
        }
        this.setSelection(null, null);
        this.isSelectCustom = false;
        this.updateIconState();
        this.cloneElements();
    }
    private setHTMLAttributes(): void {
        if (Object.keys(this.htmlAttributes).length) {
            for (const htmlAttr of Object.keys(this.htmlAttributes)) {
                if (htmlAttr === 'class') {
                    const updatedClassValue: string = (this.htmlAttributes[`${htmlAttr}`].replace(/\s+/g, ' ')).trim();
                    if (updatedClassValue !== '') {
                        addClass([this.inputWrapper.container], updatedClassValue.split(' '));
                    }
                } else if (htmlAttr === 'disabled' && this.htmlAttributes[`${htmlAttr}`] === 'disabled') {
                    this.enabled = false;
                    this.setEnable();
                } else if (htmlAttr === 'readonly' && !isNullOrUndefined(this.htmlAttributes[`${htmlAttr}`])) {
                    this.readonly = true;
                    this.dataBind();
                } else if (htmlAttr === 'style') {
                    this.inputWrapper.container.setAttribute('style', this.htmlAttributes[`${htmlAttr}`]);
                } else if (htmlAttr === 'aria-label') {
                    if ((this.getModuleName() === 'autocomplete' || this.getModuleName() === 'combobox') && !this.readonly) {
                        this.inputElement.setAttribute('aria-label', this.htmlAttributes[`${htmlAttr}`]);
                    }
                    else if (this.getModuleName() === 'dropdownlist') {
                        this.inputWrapper.container.setAttribute('aria-label', this.htmlAttributes[`${htmlAttr}`]);
                    }
                } else {
                    const defaultAttr: string[] = ['title', 'id', 'placeholder',
                        'role', 'autocomplete', 'autocapitalize', 'spellcheck', 'minlength', 'maxlength'];
                    const validateAttr: string[] = ['name', 'required'];
                    if (this.getModuleName() === 'autocomplete' || this.getModuleName() === 'combobox') {
                        defaultAttr.push('tabindex');
                    }
                    if (validateAttr.indexOf(htmlAttr) > -1 || htmlAttr.indexOf('data') === 0) {
                        this.hiddenElement.setAttribute(htmlAttr, this.htmlAttributes[`${htmlAttr}`]);
                    } else if (defaultAttr.indexOf(htmlAttr) > -1) {
                        if (htmlAttr === 'placeholder') {
                            Input.setPlaceholder(this.htmlAttributes[`${htmlAttr}`], this.inputElement);
                        } else {
                            this.inputElement.setAttribute(htmlAttr, this.htmlAttributes[`${htmlAttr}`]);
                        }
                    } else {
                        this.inputWrapper.container.setAttribute(htmlAttr, this.htmlAttributes[`${htmlAttr}`]);
                    }
                }
            }
        }
        if (this.getModuleName() === 'autocomplete' || this.getModuleName() === 'combobox') {
            this.inputWrapper.container.removeAttribute('tabindex');
        }
    }

    protected getAriaAttributes(): { [key: string]: string } {
        return {
            'aria-disabled': 'false',
            'role': 'combobox',
            'aria-expanded': 'false',
            'aria-live': 'polite',
            'aria-labelledby': this.hiddenElement.id
        };
    }

    protected setEnableRtl(): void {
        Input.setEnableRtl(this.enableRtl, [this.inputElement.parentElement]);
        if (this.popupObj) {
            this.popupObj.enableRtl = this.enableRtl;
            this.popupObj.dataBind();
        }
    }

    private setEnable(): void {
        Input.setEnabled(this.enabled, this.inputElement);
        if (this.enabled) {
            removeClass([this.inputWrapper.container], dropDownListClasses.disable);
            this.inputElement.setAttribute('aria-disabled', 'false');
            this.targetElement().setAttribute('tabindex', this.tabIndex);
        } else {
            this.hidePopup();
            addClass([this.inputWrapper.container], dropDownListClasses.disable);
            this.inputElement.setAttribute('aria-disabled', 'true');
            this.targetElement().tabIndex = -1;
        }
    }
    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string} Returns the persisted data of the component.
     */
    protected getPersistData(): string {
        return this.addOnPersist(['value']);
    }

    protected getLocaleName(): string {
        return 'drop-down-list';
    }

    private preventTabIndex(element: HTMLElement): void {
        if (this.getModuleName() === 'dropdownlist') {
            element.tabIndex = -1;
        }
    }

    protected targetElement(): HTMLElement | HTMLInputElement {
        return !isNullOrUndefined(this.inputWrapper) ? this.inputWrapper.container : null;
    }

    protected getNgDirective(): string {
        return 'EJS-DROPDOWNLIST';
    }

    protected getElementByText(text: string): Element {
        return this.getElementByValue(this.getValueByText(text));
    }

    protected getElementByValue(value: string | number | boolean): Element {
        let item: Element;
        const listItems: Element[] = this.getItems();
        for (const liItem of listItems) {
            if (this.getFormattedValue(liItem.getAttribute('data-value')) === value) {
                item = liItem;
                break;
            }
        }
        return item;
    }

    private initValue(): void {
        this.viewPortInfo.startIndex = this.virtualItemStartIndex = 0;
        this.viewPortInfo.endIndex = this.virtualItemEndIndex = this.itemCount;
        this.renderList();
        if (this.dataSource instanceof DataManager) {
            this.initRemoteRender = true;
        } else {
            this.updateValues();
        }
    }

    protected updateValues(): void {
        this.selectedValueInfo = this.viewPortInfo;
        if (!isNullOrUndefined(this.value)) {
            this.setSelection(this.getElementByValue(this.value), null);
        } else if (this.text && isNullOrUndefined(this.value)) {
            const element: Element = this.getElementByText(this.text);
            if (isNullOrUndefined(element)) {
                this.setProperties({ text: null });
                return;
            } else {
                this.setSelection(element, null);
            }
        } else {
            this.setSelection(this.liCollections[this.activeIndex], null);
        }
        this.setHiddenValue();
        Input.setValue(this.text, this.inputElement, this.floatLabelType, this.showClearButton);
    }

    protected onBlurHandler(e: MouseEvent): void {
        if (!this.enabled) {
            return;
        }
        const target: HTMLElement = <HTMLElement>e.relatedTarget;
        const currentTarget: HTMLElement = <HTMLElement>e.target;
        const isPreventBlur: boolean = this.isPreventBlur;
        this.isPreventBlur = false;
        //IE 11 - issue
        if (isPreventBlur && !this.isDocumentClick && this.isPopupOpen && (!isNullOrUndefined(currentTarget) ||
            !this.isFilterLayout() && isNullOrUndefined(target))) {
            if (this.getModuleName() === 'dropdownlist' && this.allowFiltering && this.isPopupOpen) {
                this.filterInput.focus();
            } else {
                this.targetElement().focus();
            }
            return;
        }
        if (this.isDocumentClick || (!isNullOrUndefined(this.popupObj)
            && document.body.contains(this.popupObj.element) &&
            this.popupObj.element.classList.contains(dropDownListClasses.mobileFilter))) {
            if (!this.beforePopupOpen) {
                this.isDocumentClick = false;
            }
            return;
        }
        if (((this.getModuleName() === 'dropdownlist' && !this.isFilterFocus && target !== this.inputElement)
            && (document.activeElement !== target || (document.activeElement === target &&
                currentTarget.classList.contains(dropDownListClasses.inputFocus)))) ||
            (isNullOrUndefined(target) && this.getModuleName() === 'dropdownlist' && this.allowFiltering &&
                currentTarget !== this.inputWrapper.container) || this.getModuleName() !== 'dropdownlist' &&
            !this.inputWrapper.container.contains(target) || this.isTabKey) {
            this.isDocumentClick = this.isPopupOpen ? true : false;
            this.focusOutAction(e);
            this.isTabKey = false;
        }
        if (this.isRequested && !this.isPopupOpen && !this.isPreventBlur) {
            this.isActive = false;
            this.beforePopupOpen = false;
        }
    }

    protected focusOutAction(e?: MouseEvent | KeyboardEventArgs): void {
        this.isInteracted = false;
        this.focusOut(e);
        this.onFocusOut();
    }

    protected onFocusOut(): void {
        if (!this.enabled) {
            return;
        }
        if (this.isSelected) {
            this.isSelectCustom = false;
            this.onChangeEvent(null);
        }
        this.floatLabelChange();
        this.dispatchEvent(this.hiddenElement as HTMLElement, 'change');
        if (this.getModuleName() === 'dropdownlist' && this.element.tagName !== 'INPUT') {
            this.dispatchEvent(this.inputElement as HTMLElement, 'blur');
        }
        if (this.inputWrapper.clearButton) {
            addClass([this.inputWrapper.clearButton], dropDownListClasses.clearIconHide);
        }
        this.trigger('blur');
    }

    protected onFocus(e?: FocusEvent | MouseEvent | KeyboardEvent | TouchEvent): void {
        if (!this.isInteracted) {
            this.isInteracted = true;
            const args: FocusEventArgs = { isInteracted: e ? true : false, event: e };
            this.trigger('focus', args);
        }
        this.updateIconState();
    }

    private resetValueHandler(e: Event): void {
        const formElement: HTMLFormElement = closest(this.inputElement, 'form') as HTMLFormElement;
        if (formElement && e.target === formElement) {
            const val: string = (this.element.tagName === this.getNgDirective()) ? null : this.inputElement.getAttribute('value');
            this.text = val;
        }
    }

    protected wireEvent(): void {
        EventHandler.add(this.inputWrapper.container, 'mousedown', this.dropDownClick, this);
        EventHandler.add(this.inputWrapper.container, 'focus', this.focusIn, this);
        EventHandler.add(this.inputWrapper.container, 'keypress', this.onSearch, this);
        EventHandler.add(<HTMLElement & Window>window, 'resize',this.windowResize, this);
        this.bindCommonEvent();
    }

    protected bindCommonEvent(): void {
        EventHandler.add(this.targetElement(), 'blur', this.onBlurHandler, this);
        const formElement: HTMLFormElement = closest(this.inputElement, 'form') as HTMLFormElement;
        if (formElement) {
            EventHandler.add(formElement, 'reset', this.resetValueHandler, this);
        }
        if (!Browser.isDevice) {
            this.keyboardModule = new KeyboardEvents(
                this.targetElement(), {
                keyAction: this.keyActionHandler.bind(this), keyConfigs: this.keyConfigure, eventName: 'keydown'
            });
        } else {
            this.keyboardModule = new KeyboardEvents(
                this.targetElement(), {
                keyAction: this.mobileKeyActionHandler.bind(this), keyConfigs: this.keyConfigure, eventName: 'keydown'
            });
        }
        this.bindClearEvent();
    }

    protected windowResize(): void {
        if (this.isPopupOpen) {
           this.popupObj.refreshPosition(this.inputWrapper.container);
        }
    }

    private bindClearEvent(): void {
        if (this.showClearButton) {
            EventHandler.add(this.inputWrapper.clearButton, 'mousedown', this.resetHandler, this);
        }
    }
    

    protected unBindCommonEvent(): void {
        if (!isNullOrUndefined(this.inputWrapper) && this.targetElement()) {
            EventHandler.remove(this.targetElement(), 'blur', this.onBlurHandler);
        }
        const formElement: HTMLFormElement = this.inputElement && closest(this.inputElement, 'form') as HTMLFormElement;
        if (formElement) {
            EventHandler.remove(formElement, 'reset', this.resetValueHandler);
        }
        if (!Browser.isDevice) {
            this.keyboardModule.destroy();
        }
        if (this.showClearButton) {
            EventHandler.remove(this.inputWrapper.clearButton, 'mousedown', this.resetHandler);
        }
    }

    protected updateIconState(): void {
        if (this.showClearButton) {
            if (this.inputElement.value !== '' && !this.readonly) {
                removeClass([this.inputWrapper.clearButton], dropDownListClasses.clearIconHide);
            } else {
                addClass([this.inputWrapper.clearButton], dropDownListClasses.clearIconHide);
            }
        }
    }
    /**
     * Event binding for list
     *
     * @returns {void}
     */
    private wireListEvents(): void {
        if (!isNullOrUndefined(this.list)) {
            EventHandler.add(this.list, 'click', this.onMouseClick, this);
            EventHandler.add(this.list, 'mouseover', this.onMouseOver, this);
            EventHandler.add(this.list, 'mouseout', this.onMouseLeave, this);
        }
    }

    private onSearch(e: KeyboardEventArgs): void {
        if (e.charCode !== 32 && e.charCode !== 13) {
            if (this.list === undefined) {
                this.renderList();
            }
            this.searchKeyEvent = e;
            this.onServerIncrementalSearch(e);
        }
    }

    private onServerIncrementalSearch(e: KeyboardEventArgs): void {
        if (!this.isRequested && !isNullOrUndefined(this.list) &&
            !isNullOrUndefined(this.list.querySelector('li')) && this.enabled && !this.readonly) {
            this.incrementalSearch(e);
        }
    }

    protected onMouseClick(e: MouseEvent): void {
        const target: Element = <Element>e.target;
        this.keyboardEvent = null;
        const li: HTMLElement = <HTMLElement>closest(target, '.' + dropDownBaseClasses.li);
        if (!this.isValidLI(li)) {
            return;
        }
        this.setSelection(li, e);
        if (Browser.isDevice && this.isFilterLayout()) {
            history.back();
        } else {
            const delay: number = 100;
            this.closePopup(delay, e);
        }
    }

    private onMouseOver(e: MouseEvent): void {
        const currentLi: HTMLElement = <HTMLElement>closest(<Element>e.target, '.' + dropDownBaseClasses.li);
        this.setHover(currentLi);
    }

    private setHover(li: HTMLElement): void {
        if (this.enabled && this.isValidLI(li) && !li.classList.contains(dropDownBaseClasses.hover)) {
            this.removeHover();
            addClass([li], dropDownBaseClasses.hover);
        }
    }

    private onMouseLeave(): void {
        this.removeHover();
    }

    protected removeHover(): void {
        if (this.list) {
            const hoveredItem: Element[] = <NodeListOf<Element> & Element[]>this.list.querySelectorAll('.' + dropDownBaseClasses.hover);
            if (hoveredItem && hoveredItem.length) {
                removeClass(hoveredItem, dropDownBaseClasses.hover);
            }
        }
    }

    protected isValidLI(li: Element | HTMLElement): boolean {
        return (li && li.hasAttribute('role') && li.getAttribute('role') === 'option');
    }

    protected incrementalSearch(e: KeyboardEventArgs): void {
        if (this.liCollections.length > 0) {
            const li: Element =
                incrementalSearch(e.charCode, this.liCollections, this.activeIndex, true, this.element.id);
            if (!isNullOrUndefined(li)) {
                this.setSelection(li, e);
                this.setScrollPosition();
            }
        }
    }
    /**
     * Hides the spinner loader.
     *
     * @returns {void}
     */
    public hideSpinner(): void {
        if (!isNullOrUndefined(this.spinnerElement)) {
            hideSpinner(this.spinnerElement);
            removeClass([this.spinnerElement], dropDownListClasses.disableIcon);
            this.spinnerElement.innerHTML = '';
            this.spinnerElement = null;
        }
    }
    /**
     * Shows the spinner loader.
     *
     * @returns {void}
     */
    public showSpinner(): void {
        if (isNullOrUndefined(this.spinnerElement)) {
            this.spinnerElement = Browser.isDevice && !isNullOrUndefined(this.filterInputObj) && this.filterInputObj.buttons[1] ||
                !isNullOrUndefined(this.filterInputObj) && this.filterInputObj.buttons[0] || this.inputWrapper.buttons[0];
            addClass([this.spinnerElement], dropDownListClasses.disableIcon);
            createSpinner(
                {
                    target: this.spinnerElement,
                    width: Browser.isDevice ? '16px' : '14px'
                },
                this.createElement);
            showSpinner(this.spinnerElement);
        }
    }
    protected keyActionHandler(e: KeyboardEventArgs): void {
        if (!this.enabled) {
            return;
        }
        this.keyboardEvent = e;
        if (this.isPreventKeyAction && this.enableVirtualization) {
            e.preventDefault();
        }
        const preventAction: boolean = e.action === 'pageUp' || e.action === 'pageDown';
        const preventHomeEnd: boolean = this.getModuleName() !== 'dropdownlist' && (e.action === 'home' || e.action === 'end');
        this.isEscapeKey = e.action === 'escape';
        this.isTabKey = !this.isPopupOpen && e.action === 'tab';
        const isNavigation: boolean = (e.action === 'down' || e.action === 'up' || e.action === 'pageUp' || e.action === 'pageDown'
            || e.action === 'home' || e.action === 'end');
        if ((this.isEditTextBox() || preventAction || preventHomeEnd) && !this.isPopupOpen) {
            return;
        }
        if (!this.readonly) {
            const isTabAction: boolean = e.action === 'tab' || e.action === 'close';
            if (isNullOrUndefined(this.list) && !this.isRequested && !isTabAction && e.action !== 'escape') {
                this.searchKeyEvent = e;
                this.renderList(e);
            }
            if (isNullOrUndefined(this.list) || (!isNullOrUndefined(this.liCollections) &&
                isNavigation && this.liCollections.length === 0) || this.isRequested) {
                return;
            }
            if ((isTabAction && this.getModuleName() !== 'autocomplete') && this.isPopupOpen
                || e.action === 'escape') {
                e.preventDefault();
            }
            this.isSelected = e.action === 'escape' ? false : this.isSelected;
            this.isTyped = (isNavigation || e.action === 'escape') ? false : this.isTyped;
            switch (e.action) {
                case 'down':
                case 'up':
                    this.updateUpDownAction(e);
                    break;
                case 'pageUp':
                    this.pageUpSelection(this.activeIndex - this.getPageCount(), e);
                    e.preventDefault();
                    break;
                case 'pageDown':
                    this.pageDownSelection(this.activeIndex + this.getPageCount(), e);
                    e.preventDefault();
                    break;
                case 'home':
                    this.isMouseScrollAction = true;
                    this.updateHomeEndAction(e);
                    break;
                case 'end':
                    this.isMouseScrollAction = true;
                    this.updateHomeEndAction(e);
                    break;
                case 'space':
                    if (this.getModuleName() === 'dropdownlist') {
                        if (!this.beforePopupOpen) {
                            this.showPopup();
                        }
                    }
                    break;
                case 'open':
                    this.showPopup(e);
                    break;
                case 'hide':
                    this.preventAltUp = this.isPopupOpen;
                    this.hidePopup(e);
                    this.focusDropDown(e);
                    break;
                case 'enter':
                    this.selectCurrentItem(e);
                    break;
                case 'tab':
                    this.selectCurrentValueOnTab(e);
                    break;
                case 'escape':
                case 'close':
                    if (this.isPopupOpen) {
                        this.hidePopup(e);
                        this.focusDropDown(e);
                    }
                    break;
            }
        }
    }

    private updateUpDownAction(e: KeyboardEventArgs, isVirtualKeyAction?: boolean): void {
        const focusEle: Element = this.list.querySelector('.' + dropDownListClasses.focus);
        if (this.isSelectFocusItem(focusEle) && !isVirtualKeyAction) {
            this.setSelection(focusEle, e);
            if (this.enableVirtualization) {
                let selectedLiOffsetTop = this.virtualListInfo && this.virtualListInfo.startIndex ? this.selectedLI.offsetTop + (this.virtualListInfo.startIndex * this.selectedLI.offsetHeight) : this.selectedLI.offsetTop;
                this.list.scrollTop = selectedLiOffsetTop - (this.list.querySelectorAll('.e-virtual-list').length * this.selectedLI.offsetHeight);
            }
        } else if (!isNullOrUndefined(this.liCollections)) {
            let virtualIndex = this.activeIndex;
            let index: number = e.action === 'down' ? this.activeIndex + 1 : this.activeIndex - 1;
            index = isVirtualKeyAction ? virtualIndex : index;
            let startIndex: number = 0;
            if (this.getModuleName() === 'autocomplete') {
                startIndex = e.action === 'down' && isNullOrUndefined(this.activeIndex) ? 0 : this.liCollections.length - 1;
                index = index < 0 ? this.liCollections.length - 1 : index === this.liCollections.length ? 0 : index;
            }
            let nextItem: Element;
            if (this.getModuleName() !== 'autocomplete' || this.getModuleName() === 'autocomplete' && this.isPopupOpen) {
                if (!this.enableVirtualization) {
                    nextItem = isNullOrUndefined(this.activeIndex) ? this.liCollections[startIndex as number]
                        : this.liCollections[index as number];
                }
                else {
                    if (!isVirtualKeyAction) {
                        nextItem = isNullOrUndefined(this.activeIndex) ? this.liCollections[this.skeletonCount]
                            : this.liCollections[index as number];
                        nextItem = !isNullOrUndefined(nextItem) && !nextItem.classList.contains('e-virtual-list') ? nextItem : null;
                    }
                    else {
                        if (this.getModuleName() === 'autocomplete') {
                            var value = this.selectedLI.dataset.value;
                            nextItem = this.getElementByValue(value);
                        } else {
                            nextItem = this.getElementByValue(this.getItemData().value);
                        }
                    }
                }
            }
            if (!isNullOrUndefined(nextItem)) {
                this.setSelection(nextItem, e);
            }
        }
        e.preventDefault();
    }

    private updateHomeEndAction(e: KeyboardEventArgs, isVirtualKeyAction?: boolean): void {
        if (this.getModuleName() === 'dropdownlist') {
            let findLi: number = 0;
            if (e.action === 'home') {
                findLi = 0;
                if (this.enableVirtualization) {
                    findLi = this.skeletonCount;
                }
            } else {
                findLi = this.getItems().length - 1;
            }
            e.preventDefault();
            if (this.activeIndex === findLi) {
                if(isVirtualKeyAction){
                    this.setSelection(this.liCollections[findLi as number], e);
                }
                return;
            }
            this.setSelection(this.liCollections[findLi as number], e);
        }
    }

    protected selectCurrentValueOnTab(e: KeyboardEventArgs): void {
        if (this.getModuleName() === 'autocomplete') {
            this.selectCurrentItem(e);
        } else {
            if (this.isPopupOpen) {
                this.hidePopup(e);
                this.focusDropDown(e);
            }
        }
    }

    protected mobileKeyActionHandler(e: KeyboardEventArgs): void {
        if (!this.enabled) {
            return;
        }
        if ((this.isEditTextBox()) && !this.isPopupOpen) {
            return;
        }
        if (!this.readonly) {
            if (this.list === undefined && !this.isRequested) {
                this.searchKeyEvent = e;
                this.renderList();
            }
            if (isNullOrUndefined(this.list) || (!isNullOrUndefined(this.liCollections) &&
                this.liCollections.length === 0) || this.isRequested) {
                return;
            }
            if (e.action === 'enter') {
                this.selectCurrentItem(e);
            }
        }
    }

    private handleVirtualKeyboardActions(e: KeyboardEventArgs, pageCount: number): void {
        switch (e.action) {
            case 'down':
            case 'up':
                if (this.itemData != null || this.getModuleName() === 'autocomplete') {
                    this.updateUpDownAction(e, true);
                }
                break;
            case 'pageUp':
                let count = (pageCount * 2) - 4;
                this.activeIndex = Math.round(count);
                this.pageUpSelection(this.activeIndex - this.getPageCount(), e, true);
                e.preventDefault();
                break;
            case 'pageDown':
                this.activeIndex = 1;
                this.pageDownSelection(this.activeIndex + this.getPageCount(), e, true);
                e.preventDefault();
                break;
            case 'home':
                this.isMouseScrollAction = true;
                this.updateHomeEndAction(e, true);
                break;
            case 'end':
                this.isMouseScrollAction = true;
                this.updateHomeEndAction(e, true);
                break;
        }
        this.keyboardEvent = null;
    }

    protected selectCurrentItem(e: KeyboardEventArgs): void {
        if (this.isPopupOpen) {
            const li: Element = this.list.querySelector('.' + dropDownListClasses.focus);
            if (li) {
                this.setSelection(li, e);
                this.isTyped = false;
            }
            if (this.isSelected) {
                this.isSelectCustom = false;
                this.onChangeEvent(e);
            }
            this.hidePopup(e);
            this.focusDropDown(e);
        } else {
            this.showPopup();
        }
    }

    protected isSelectFocusItem(element: Element): boolean {
        return !isNullOrUndefined(element);
    }

    private getPageCount(returnExactCount?: boolean): number {
        const liHeight: string = this.list.classList.contains(dropDownBaseClasses.noData) ? null :
            getComputedStyle(this.getItems()[0], null).getPropertyValue('height');
        let pageCount = Math.round(this.list.getBoundingClientRect().height / parseInt(liHeight, 10));
        return returnExactCount? pageCount : Math.round(pageCount);
    }

    private pageUpSelection(steps: number, event: KeyboardEventArgs, isVirtualKeyAction?: boolean): void {
        let previousItem: Element = steps >= 0 ? this.liCollections[steps + 1] : this.liCollections[0];
        if ((this.enableVirtualization && this.activeIndex == null) || isVirtualKeyAction) {
            previousItem = steps >= 0 ? this.liCollections[steps + this.skeletonCount + 1] : this.liCollections[0];
        }
        if(!isNullOrUndefined(previousItem) && previousItem.classList.contains('e-virtual-list')){
            previousItem = this.liCollections[this.skeletonCount];
        }
        this.setSelection(previousItem, event);
    }

    private pageDownSelection(steps: number, event: KeyboardEventArgs, isVirtualKeyAction?: boolean): void {
        const list: Element[] = this.getItems();
        let previousItem: Element = steps <= list.length ? this.liCollections[steps - 1] : this.liCollections[list.length - 1];
        if ((this.enableVirtualization && this.activeIndex == null) || isVirtualKeyAction) {
            previousItem = steps <= list.length ? this.liCollections[steps + this.skeletonCount - 1] : this.liCollections[list.length - 1];
        }
        this.setSelection(previousItem, event);
    }

    protected unWireEvent(): void {
        if (!isNullOrUndefined(this.inputWrapper)) {
            EventHandler.remove(this.inputWrapper.container, 'mousedown', this.dropDownClick);
            EventHandler.remove(this.inputWrapper.container, 'keypress', this.onSearch);
            EventHandler.remove(this.inputWrapper.container, 'focus', this.focusIn);
            EventHandler.remove(<HTMLElement & Window>window, 'resize', this.windowResize);
        }
        this.unBindCommonEvent();
    }
    /**
     * Event un binding for list items.
     *
     * @returns {void}
     */
    private unWireListEvents(): void {
        if (this.list) {
            EventHandler.remove(this.list, 'click', this.onMouseClick);
            EventHandler.remove(this.list, 'mouseover', this.onMouseOver);
            EventHandler.remove(this.list, 'mouseout', this.onMouseLeave);
        }
    }

    protected checkSelector(id: string): string {
        return '[id="' + id.replace(/(:|\.|\[|\]|,|=|@|\\|\/|#)/g, '\\$1') + '"]';
    }
    protected onDocumentClick(e: MouseEvent): void {
        const target: HTMLElement = <HTMLElement>e.target;
        if (!(!isNullOrUndefined(this.popupObj) && closest(target, this.checkSelector(this.popupObj.element.id))) &&
            !isNullOrUndefined(this.inputWrapper) && !this.inputWrapper.container.contains(e.target as Node)) {
            if (this.inputWrapper.container.classList.contains(dropDownListClasses.inputFocus) || this.isPopupOpen) {
                this.isDocumentClick = true;
                const isActive: boolean = this.isRequested;
                this.isInteracted = false;
                this.hidePopup(e);
                if (!isActive) {
                    this.onFocusOut();
                    this.inputWrapper.container.classList.remove(dropDownListClasses.inputFocus);
                }
            }
        } else if (target !== this.inputElement && !(this.allowFiltering && target === this.filterInput)
            && !(this.getModuleName() === 'combobox' &&
                !this.allowFiltering && Browser.isDevice && target === this.inputWrapper.buttons[0])) {
            this.isPreventBlur = (Browser.isIE || Browser.info.name === 'edge') && (document.activeElement === this.targetElement() ||
                document.activeElement === this.filterInput);
            e.preventDefault();
        }
    }

    private activeStateChange(): void {
        if (this.isDocumentClick) {
            this.hidePopup();
            this.onFocusOut();
            this.inputWrapper.container.classList.remove(dropDownListClasses.inputFocus);
        }
    }

    private focusDropDown(e?: MouseEvent | KeyboardEventArgs | TouchEvent): void {
        if (!this.initial && this.isFilterLayout()) {
            this.focusIn(e);
        }
    }

    protected dropDownClick(e: MouseEvent): void {
        if (e.which === 3 || e.button === 2) {
            return;
        }
        this.keyboardEvent = null;
        if (this.targetElement().classList.contains(dropDownListClasses.disable) || this.inputWrapper.clearButton === e.target) {
            return;
        }
        const target: HTMLElement = <HTMLElement>e.target;
        if (target !== this.inputElement && !(this.allowFiltering && target === this.filterInput) && this.getModuleName() !== 'combobox') {
            e.preventDefault();
        }
        if (!this.readonly) {
            if (this.isPopupOpen) {
                this.hidePopup(e);
                if (this.isFilterLayout()) {
                    this.focusDropDown(e);
                }
            } else {
                this.focusIn(e);
                this.floatLabelChange();
                this.queryString = this.inputElement.value.trim() === '' ? null : this.inputElement.value;
                this.isDropDownClick = true;
                this.showPopup(e);
            }
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const proxy: this = this;
            // eslint-disable-next-line max-len
            const duration: number = (this.element.tagName === this.getNgDirective() && this.itemTemplate) ? 500 : 100;
            if (!this.isSecondClick) {
                setTimeout(() => {
                    proxy.cloneElements(); proxy.isSecondClick = true;
                }, duration);
            }
        } else {
            this.focusIn(e);
        }
    }
    protected cloneElements(): void {
        if (this.list) {
            let ulElement: HTMLElement = this.list.querySelector('ul');
            if (ulElement) {
                ulElement = ulElement.cloneNode ? (ulElement.cloneNode(true) as HTMLElement) : ulElement;
                this.actionCompleteData.ulElement = ulElement;
            }
        }
    }
    protected updateSelectedItem(
        li: Element,
        e: MouseEvent | KeyboardEvent | TouchEvent,
        preventSelect?: boolean,
        isSelection?: boolean): void {
        this.removeSelection();
        li.classList.add(dropDownBaseClasses.selected);
        this.removeHover();
        const value: string | number | boolean = li.getAttribute('data-value') !== "null" ? this.getFormattedValue(li.getAttribute('data-value')) : null;
        const selectedData: string | number | boolean | {
            [key: string]: Object
        } = this.getDataByValue(value);
        if (!this.initial && !preventSelect && !isNullOrUndefined(e)) {
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
                    this.selectEventCallback(li, e, preventSelect, selectedData, value);
                    if (isSelection) {
                        this.setSelectOptions(li, e);
                    }
                }
            });
        } else {
            this.selectEventCallback(li, e, preventSelect, selectedData, value);
            if (isSelection) {
                this.setSelectOptions(li, e);
            }
        }
    }

    private selectEventCallback(
        li: Element,
        e: MouseEvent | KeyboardEvent | TouchEvent,
        preventSelect?: boolean,
        selectedData?: string | number | boolean | { [key: string]: Object },
        value?: string | number | boolean): void {
        this.previousItemData = (!isNullOrUndefined(this.itemData)) ? this.itemData : null;
        if(this.itemData != selectedData){
            this.previousValue = (!isNullOrUndefined(this.itemData))? typeof this.itemData == "object" ? this.checkFieldValue(this.itemData as any, this.fields.value.split('.')): this.itemData: null;
        }
        this.item = li as HTMLLIElement;
        this.itemData = selectedData;
        const focusedItem: Element = this.list.querySelector('.' + dropDownBaseClasses.focus);
        if (focusedItem) {
            removeClass([focusedItem], dropDownBaseClasses.focus);
        }
        li.setAttribute('aria-selected', 'true');
        this.activeIndex = this.getIndexByValue(value);
    }

    protected activeItem(li: Element): void {
        if (this.isValidLI(li) && !li.classList.contains(dropDownBaseClasses.selected)) {
            this.removeSelection();
            li.classList.add(dropDownBaseClasses.selected);
            this.removeHover();
            li.setAttribute('aria-selected', 'true');
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected setValue(e?: KeyboardEventArgs): boolean {
        const dataItem: { [key: string]: string } = this.getItemData();
        if (dataItem.value === null) {
            Input.setValue(null, this.inputElement, this.floatLabelType, this.showClearButton);
        } else {
            Input.setValue(dataItem.text, this.inputElement, this.floatLabelType, this.showClearButton);
        }
        if (this.valueTemplate && this.itemData !== null) {
            this.setValueTemplate();
        } else if (!isNullOrUndefined(this.valueTempElement) && this.inputElement.previousSibling === this.valueTempElement) {
            detach(this.valueTempElement);
            this.inputElement.style.display = 'block';
        }
        const clearIcon: string = dropDownListClasses.clearIcon;
        const isFilterElement: boolean = this.isFiltering() && this.filterInput && (this.getModuleName() === 'combobox');
        const clearElement: HTMLElement = isFilterElement && this.filterInput.parentElement.querySelector('.' + clearIcon);
        if (this.isFiltering() && clearElement) {
            clearElement.style.removeProperty('visibility');
        }
        if (this.previousValue === dataItem.value) {
            this.isSelected = false;
            return true;
        } else {
            this.isSelected = !this.initial ? true : false;
            this.isSelectCustom = false;
            if (this.getModuleName() === 'dropdownlist') {
                this.updateIconState();
            }
            return false;
        }
    }

    protected setSelection(li: Element, e: MouseEvent | KeyboardEventArgs | TouchEvent): void {
        if (this.isValidLI(li) && (!li.classList.contains(dropDownBaseClasses.selected) || (this.isPopupOpen && this.isSelected
            && li.classList.contains(dropDownBaseClasses.selected)))) {
            this.updateSelectedItem(li, e, false, true);
        } else {
            this.setSelectOptions(li, e);
            if (this.enableVirtualization) {
                const fields: string = (this.fields.value) ? this.fields.value : '';
                const getItem: any = <{ [key: string]: Object }[] | string[] | number[] | boolean[]>new DataManager(
                    this.dataSource as DataOptions | JSON[]).executeLocal(new Query().where(new Predicate(fields, 'equal', this.value)));

                if (getItem && getItem.length > 0) {
                    this.itemData = getItem[0];
                    this.setProperties({ 'text': getItem[0].text, 'value': getItem[0].value }, true);
                }
            }
        }
    }
    private setSelectOptions(li: Element, e?: MouseEvent | KeyboardEventArgs | KeyboardEvent | TouchEvent): void {
        if (this.list) {
            this.removeHover();
        }
        this.previousSelectedLI = (!isNullOrUndefined(this.selectedLI)) ? this.selectedLI : null;
        this.selectedLI = li as HTMLElement;
        if (this.setValue(e as KeyboardEventArgs)) {
            return;
        }
        if ((!this.isPopupOpen && !isNullOrUndefined(li)) || (this.isPopupOpen && !isNullOrUndefined(e) &&
            (e.type !== 'keydown' || e.type === 'keydown' && (e as KeyboardEventArgs).action === 'enter'))) {
            this.isSelectCustom = false;
            this.onChangeEvent(e);
        }
        if (this.isPopupOpen && !isNullOrUndefined(this.selectedLI) && this.itemData !== null && (!e || e.type !== 'click')) {
            this.setScrollPosition(e as KeyboardEventArgs);
        }
        if (Browser.info.name !== 'mozilla') {
            if (this.targetElement()) {
                attributes(this.targetElement(), { 'aria-describedby': this.inputElement.id !== '' ? this.inputElement.id : this.element.id });
                this.targetElement().removeAttribute('aria-live');
            }
        }
        if (this.isPopupOpen && !isNullOrUndefined(this.ulElement) && !isNullOrUndefined(this.ulElement.getElementsByClassName('e-item-focus')[0])) {
            attributes(this.targetElement(), { 'aria-activedescendant': this.ulElement.getElementsByClassName('e-item-focus')[0].id });
        } else if (this.isPopupOpen && !isNullOrUndefined(this.ulElement) && !isNullOrUndefined(this.ulElement.getElementsByClassName('e-active')[0])) {
            attributes(this.targetElement(), { 'aria-activedescendant': this.ulElement.getElementsByClassName('e-active')[0].id });
        }
    }

    private dropdownCompiler(dropdownTemplate: string | Function): boolean {
        let checkTemplate: boolean = false;
        if (typeof dropdownTemplate !== 'function' && dropdownTemplate) {
            try {
                checkTemplate = (document.querySelectorAll(dropdownTemplate).length) ? true : false;

            } catch (exception) {
                checkTemplate = false;
            }
        }
        return checkTemplate;
    }

    private setValueTemplate(): void {
        let compiledString: Function;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((this as any).isReact) {
            this.clearTemplate(['valueTemplate']);
            if (this.valueTempElement) {
                detach(this.valueTempElement);
                this.inputElement.style.display = 'block';
                this.valueTempElement = null;
            }
        }
        if (!this.valueTempElement) {
            this.valueTempElement = this.createElement('span', { className: dropDownListClasses.value });
            this.inputElement.parentElement.insertBefore(this.valueTempElement, this.inputElement);
            this.inputElement.style.display = 'none';
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(this as any).isReact) {
            this.valueTempElement.innerHTML = '';
        }
        const valuecheck: boolean = this.dropdownCompiler(this.valueTemplate);
        if (typeof this.valueTemplate !== 'function' && valuecheck) {
            compiledString = compile(document.querySelector(this.valueTemplate).innerHTML.trim());
        } else {
            compiledString = compile(this.valueTemplate);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const valueCompTemp: any = compiledString(
            this.itemData, this, 'valueTemplate', this.valueTemplateId, this.isStringTemplate, null, this.valueTempElement);
        if (valueCompTemp && valueCompTemp.length > 0) {
            append(valueCompTemp, this.valueTempElement);
        }
        this.renderReactTemplates();
    }

    protected removeSelection(): void {
        if (this.list) {
            const selectedItems: Element[] = <NodeListOf<Element> &
                Element[]>this.list.querySelectorAll('.' + dropDownBaseClasses.selected);
            if (selectedItems.length) {
                removeClass(selectedItems, dropDownBaseClasses.selected);
                selectedItems[0].removeAttribute('aria-selected');
            }
        }
    }

    protected getItemData(): { [key: string]: string } {
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
    /**
     * To trigger the change event for list.
     *
     * @param {MouseEvent | KeyboardEvent | TouchEvent} eve - Specifies the event arguments.
     * @returns {void}
     */
    protected onChangeEvent(eve: MouseEvent | KeyboardEvent | TouchEvent): void {
        const dataItem: { [key: string]: string } = this.getItemData();
        const index: number = this.isSelectCustom ? null : this.activeIndex;
        this.setProperties({ 'index': index, 'text': dataItem.text, 'value': dataItem.value }, true);
        this.detachChangeEvent(eve);
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

    protected detachChangeEvent(eve: MouseEvent | KeyboardEvent | TouchEvent): void {
        this.isSelected = false;
        this.previousValue = this.value;
        this.activeIndex = this.index;
        this.typedString = !isNullOrUndefined(this.text) ? this.text : '';
        if (!this.initial) {
            const items: FieldSettingsModel = this.detachChanges(this.itemData);
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
            this.setHiddenValue();
            const eventArgs: ChangeEventArgs = {
                e: eve,
                item: this.item,
                itemData: items,
                previousItem: this.previousSelectedLI as HTMLLIElement,
                previousItemData: preItems,
                isInteracted: eve ? true : false,
                value: this.value,
                element: this.element,
                event: eve
            };
            if (this.isAngular && this.preventChange) {
                this.preventChange = false;
            } else {
                this.trigger('change', eventArgs);
            }
        }
        if ((isNullOrUndefined(this.value) || this.value === '') && this.floatLabelType !== 'Always') {
            removeClass([this.inputWrapper.container], 'e-valid-input');
        }
    }

    protected setHiddenValue(): void {
        if (!isNullOrUndefined(this.value)) {
            if (this.hiddenElement.querySelector('option')) {
                const selectedElement: HTMLElement = this.hiddenElement.querySelector('option');
                selectedElement.textContent = this.text;
                selectedElement.setAttribute('value', this.value.toString());
            } else {
                if (!isNullOrUndefined(this.hiddenElement)) {
                    this.hiddenElement.innerHTML = '<option selected>' + this.text + '</option>';
                    const selectedElement: HTMLElement = this.hiddenElement.querySelector('option');
                    selectedElement.setAttribute('value', this.value.toString());
                }
            }
        } else {
            this.hiddenElement.innerHTML = '';
        }
    }
    /**
     * Filter bar implementation
     *
     * @param {KeyboardEventArgs} e - Specifies the event arguments.
     * @returns {void}
     */
    protected onFilterUp(e: KeyboardEventArgs): void {
        if (!(e.ctrlKey && e.keyCode === 86) && (this.isValidKey || e.keyCode === 40 || e.keyCode === 38)) {
            this.isValidKey = false;
            switch (e.keyCode) {
                case 38:  //up arrow
                case 40:  //down arrow
                    if (this.getModuleName() === 'autocomplete' && !this.isPopupOpen && !this.preventAltUp && !this.isRequested) {
                        this.preventAutoFill = true;
                        this.searchLists(e);
                    } else {
                        this.preventAutoFill = false;
                    }
                    this.preventAltUp = false;
                    if (this.getModuleName() === 'autocomplete' && !isNullOrUndefined(this.ulElement) && !isNullOrUndefined(this.ulElement.getElementsByClassName('e-item-focus')[0])) {
                        attributes(this.targetElement(), { 'aria-activedescendant': this.ulElement.getElementsByClassName('e-item-focus')[0].id });
                    }
                    e.preventDefault();
                    break;
                case 46:  //delete
                case 8:   //backspace
                    this.typedString = this.filterInput.value;
                    if (!this.isPopupOpen && this.typedString !== '' || this.isPopupOpen && this.queryString.length > 0) {
                        this.preventAutoFill = true;
                        this.searchLists(e);
                    } else if (this.typedString === '' && this.queryString === '' && this.getModuleName() !== 'autocomplete') {
                        this.preventAutoFill = true;
                        this.searchLists(e);
                    } else if (this.typedString === '') {
                        if (this.list) {
                            this.resetFocusElement();
                        }
                        this.activeIndex = null;
                        if (this.getModuleName() !== 'dropdownlist') {
                            this.preventAutoFill = true;
                            this.searchLists(e);
                            if (this.getModuleName() === 'autocomplete') {
                                this.hidePopup();
                            }
                        }
                    }
                    e.preventDefault();
                    break;
                default:
                    this.typedString = this.filterInput.value;
                    this.preventAutoFill = false;
                    this.searchLists(e);
                    if (this.enableVirtualization) {
                        this.getFilteringSkeletonCount();
                    }
                    break;
            }
        } else {
            this.isValidKey = false;
        }
    }
    protected getFilteringSkeletonCount(): void {
        const difference: number = this.dataCount - this.viewPortInfo.endIndex;
        const currentSkeletonCount: number = this.skeletonCount;
        this.getSkeletonCount(true);
        this.skeletonCount = this.dataCount > this.itemCount * 2 ? this.skeletonCount : difference > this.skeletonCount ? this.skeletonCount : difference > 0 ? difference : 0;
        if (!this.list.classList.contains(dropDownBaseClasses.noData)) {
            const isSkeletonCountChange: boolean = currentSkeletonCount !== this.skeletonCount;
            if(currentSkeletonCount !== this.skeletonCount){
                this.UpdateSkeleton(true,Math.abs(currentSkeletonCount - this.skeletonCount));
            }
            else{
                this.UpdateSkeleton();
            }
            this.liCollections = <HTMLElement[] & NodeListOf<Element>>this.list.querySelectorAll('.e-list-item');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.list.getElementsByClassName('e-virtual-ddl')[0] as any).style = this.GetVirtualTrackHeight();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.list.getElementsByClassName('e-virtual-ddl-content')[0] as any).style = this.getTransformValues();
        }
    }

    protected getSkeletonCount(retainSkeleton?: boolean): void {
        this.virtualListHeight = this.listHeight != null ? parseInt(this.listHeight, 10) : this.virtualListHeight;
        const actualCount: number = this.virtualListHeight > 0 ? Math.floor(this.virtualListHeight / this.listItemHeight) : 0;
        this.skeletonCount = actualCount * 2 < this.itemCount ? this.itemCount : actualCount * 2;
        this.itemCount = retainSkeleton ? this.itemCount : this.skeletonCount;
        this.skeletonCount = Math.floor(this.skeletonCount / 2) + 2;
    }
    
    
    protected onFilterDown(e: KeyboardEventArgs): void {
        switch (e.keyCode) {
            case 13:  //enter
                break;
            case 40: //down arrow
            case 38: //up arrow
                this.queryString = this.filterInput.value;
                e.preventDefault();
                break;
            case 9: //tab
                if (this.isPopupOpen && this.getModuleName() !== 'autocomplete') {
                    e.preventDefault();
                }
                break;
            default:
                this.prevSelectPoints = this.getSelectionPoints();
                this.queryString = this.filterInput.value;
                break;
        }
    }

    protected removeFillSelection(): void {
        if (this.isInteracted) {
            const selection: { [key: string]: number } = this.getSelectionPoints();
            this.inputElement.setSelectionRange(selection.end, selection.end);
        }
    }
    protected getQuery(query: Query): Query {
        let filterQuery: Query;
        if (!this.isCustomFilter && this.allowFiltering && this.filterInput) {
            filterQuery = query ? query.clone() : this.query ? this.query.clone() : new Query();
            const filterType: string = this.typedString === '' ? 'contains' : this.filterType;
            const dataType: string = <string>this.typeOfData(this.dataSource as { [key: string]: Object }[]).typeof;
            if (!(this.dataSource instanceof DataManager) && dataType === 'string' || dataType === 'number') {
                filterQuery.where('', filterType, this.typedString, this.ignoreCase, this.ignoreAccent);
            } else {
                const fields: string = (this.fields.text) ? this.fields.text : '';
                filterQuery.where(fields, filterType, this.typedString, this.ignoreCase, this.ignoreAccent);
            }
        } else {
            filterQuery = query ? query.clone() : this.query ? this.query.clone() : new Query();
        }
        if (this.enableVirtualization && (this.viewPortInfo.endIndex != 0)) {
            var takeValue = this.getTakeValue();
            if (this.allowFiltering) {
                filterQuery.skip(this.virtualItemStartIndex);
            }
            filterQuery.take(takeValue);
            filterQuery.requiresCount();
        }
        return filterQuery;
    }

    protected getSelectionPoints(): { [key: string]: number } {
        const input: HTMLInputElement = <HTMLInputElement>this.inputElement;
        return { start: Math.abs(input.selectionStart), end: Math.abs(input.selectionEnd) };
    }

    protected searchLists(e: KeyboardEventArgs | MouseEvent): void {
        this.isTyped = true;
        this.activeIndex = null;
        this.isListSearched = true;
        if (this.filterInput.parentElement.querySelector('.' + dropDownListClasses.clearIcon)) {
            const clearElement: HTMLElement = <HTMLElement>
                this.filterInput.parentElement.querySelector('.' + dropDownListClasses.clearIcon);
            clearElement.style.visibility = this.filterInput.value === '' ? 'hidden' : 'visible';
        }
        this.isDataFetched = false;
        if (this.isFiltering()) {
            this.checkAndResetCache();
            const eventArgs: FilteringEventArgs = {
                preventDefaultAction: false,
                text: this.filterInput.value,
                updateData: (
                    dataSource: { [key: string]: Object }[] | DataManager | string[] | number[], query?: Query,
                    fields?: FieldSettingsModel) => {
                    if (eventArgs.cancel) {
                        return;
                    }
                    this.isCustomFilter = true;
                    this.filteringAction(dataSource, query, fields);
                },
                baseEventArgs: e,
                cancel: false
            };
            this.trigger('filtering', eventArgs, (eventArgs: FilteringEventArgs) => {
                if (!eventArgs.cancel && !this.isCustomFilter && !eventArgs.preventDefaultAction) {
                    this.filteringAction(this.dataSource, null, this.fields);
                }
            });
        }
    }
    /**
     * To filter the data from given data source by using query
     *
     * @param {Object[] | DataManager } dataSource - Set the data source to filter.
     * @param {Query} query - Specify the query to filter the data.
     * @param {FieldSettingsModel} fields - Specify the fields to map the column in the data table.
     * @returns {void}
     * @deprecated
     */
    public filter(
        dataSource: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[],
        query?: Query, fields?: FieldSettingsModel): void {
        this.isCustomFilter = true;
        this.filteringAction(dataSource, query, fields);
    }
    private filteringAction(
        dataSource: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[],
        query?: Query, fields?: FieldSettingsModel): void {
        if (!isNullOrUndefined(this.filterInput)) {
            this.beforePopupOpen = (!this.isPopupOpen && this.getModuleName() === 'combobox' && this.filterInput.value === '') ?
                false : true;
            let isNoData = this.list.classList.contains(dropDownBaseClasses.noData);
            if (this.filterInput.value.trim() === '' && !this.itemTemplate) {
                this.actionCompleteData.isUpdated = false;
                this.isTyped = false;
                if (!isNullOrUndefined(this.actionCompleteData.ulElement) && !isNullOrUndefined(this.actionCompleteData.list)) {
                    if (this.enableVirtualization) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        this.totalItemCount = this.dataSource && (this.dataSource as any).length ? (this.dataSource as any).length : 0;
                        this.resetList(dataSource, fields, query);
                        if (isNoData && !this.list.classList.contains(dropDownBaseClasses.noData)) {
                            if (!this.list.querySelector('.e-virtual-ddl-content')) {
                                this.list.appendChild(this.createElement('div', {
                                    className: 'e-virtual-ddl-content',
                                    styles: this.getTransformValues()
                                })).appendChild(this.list.querySelector('.e-list-parent'));
                            }
                            if (!this.list.querySelector('.e-virtual-ddl')) {
                                var virualElement = this.createElement('div', {
                                    id: this.element.id + '_popup', className: 'e-virtual-ddl', styles: this.GetVirtualTrackHeight()
                                });
                                document.getElementsByClassName('e-popup')[0].querySelector('.e-dropdownbase').appendChild(virualElement);
                            }
                        }
                    }
                    this.onActionComplete(this.actionCompleteData.ulElement, this.actionCompleteData.list);
                }
                this.isTyped = true;
                if (!isNullOrUndefined(this.itemData) && this.getModuleName() === 'dropdownlist') {
                    this.focusIndexItem();
                    this.setScrollPosition();
                }
                this.isNotSearchList = true;
            } else {
                this.isNotSearchList = false;
                query = (this.filterInput.value.trim() === '') ? null : query;
                if (this.enableVirtualization && this.isFiltering() && this.isTyped) {
                    this.isPreventScrollAction = true;
                    this.list.scrollTop = 0;
                    this.previousStartIndex = 0;
                    this.virtualListInfo = null;
                }
                this.resetList(dataSource, fields, query);
                if (this.enableVirtualization && isNoData && !this.list.classList.contains(dropDownBaseClasses.noData)) {
                    if (!this.list.querySelector('.e-virtual-ddl-content')) {
                        this.list.appendChild(this.createElement('div', {
                            className: 'e-virtual-ddl-content',
                            styles: this.getTransformValues()
                        })).appendChild(this.list.querySelector('.e-list-parent'));
                    }
                    if (!this.list.querySelector('.e-virtual-ddl')) {
                        var virualElement = this.createElement('div', {
                            id: this.element.id + '_popup', className: 'e-virtual-ddl', styles: this.GetVirtualTrackHeight()
                        });
                        document.getElementsByClassName('e-popup')[0].querySelector('.e-dropdownbase').appendChild(virualElement);
                    }
                }
            }
            if (this.enableVirtualization) {
                this.getFilteringSkeletonCount();
            }
            this.renderReactTemplates();
        }
    }
    protected setSearchBox(popupElement: HTMLElement): InputObject {
        if (this.isFiltering()) {
            const parentElement: HTMLElement = popupElement.querySelector('.' + dropDownListClasses.filterParent) ?
                popupElement.querySelector('.' + dropDownListClasses.filterParent) : this.createElement('span', {
                    className: dropDownListClasses.filterParent
                });
            this.filterInput = <HTMLInputElement>this.createElement('input', {
                attrs: { type: 'text' },
                className: dropDownListClasses.filterInput
            });
            this.element.parentNode.insertBefore(this.filterInput, this.element);
            let backIcon: boolean = false;
            if (Browser.isDevice) {
                backIcon = true;
            }
            this.filterInputObj = Input.createInput(
                {
                    element: this.filterInput,
                    buttons: backIcon ?
                        [dropDownListClasses.backIcon, dropDownListClasses.filterBarClearIcon] : [dropDownListClasses.filterBarClearIcon],
                    properties: { placeholder: this.filterBarPlaceholder }
                },
                this.createElement
            );
            if (!isNullOrUndefined(this.cssClass)) {
                if (this.cssClass.split(' ').indexOf('e-outline') !== -1) {
                    addClass([this.filterInputObj.container], 'e-outline');
                } else if (this.cssClass.split(' ').indexOf('e-filled') !== -1) {
                    addClass([this.filterInputObj.container], 'e-filled');
                }
            }
            append([this.filterInputObj.container], parentElement);
            prepend([parentElement], popupElement);
            attributes(this.filterInput, {
                'aria-disabled': 'false',
                'role': 'combobox',
                'autocomplete': 'off',
                'autocapitalize': 'off',
                'spellcheck': 'false'
            });
            this.clearIconElement = this.filterInput.parentElement.querySelector('.' + dropDownListClasses.clearIcon);
            if (!Browser.isDevice && this.clearIconElement) {
                EventHandler.add(this.clearIconElement, 'click', this.clearText, this);
                (this.clearIconElement as HTMLElement).style.visibility = 'hidden';
            }
            if (!Browser.isDevice) {
                this.searchKeyModule = new KeyboardEvents(this.filterInput, {
                    keyAction: this.keyActionHandler.bind(this),
                    keyConfigs: this.keyConfigure,
                    eventName: 'keydown'
                });
            } else {
                this.searchKeyModule = new KeyboardEvents(this.filterInput, {
                    keyAction: this.mobileKeyActionHandler.bind(this),
                    keyConfigs: this.keyConfigure,
                    eventName: 'keydown'
                });
            }
            EventHandler.add(this.filterInput, 'input', this.onInput, this);
            EventHandler.add(this.filterInput, 'keyup', this.onFilterUp, this);
            EventHandler.add(this.filterInput, 'keydown', this.onFilterDown, this);
            EventHandler.add(this.filterInput, 'blur', this.onBlurHandler, this);
            EventHandler.add(this.filterInput, 'paste', this.pasteHandler, this);
            return this.filterInputObj;
        } else {
            return inputObject;
        }
    }

    protected onInput(e: KeyboardEventArgs): void {
        this.isValidKey = true;
        if(this.getModuleName() === 'combobox') { this.updateIconState(); }
        // For filtering works in mobile firefox.
        if (Browser.isDevice && Browser.info.name === 'mozilla') {
            this.typedString = this.filterInput.value;
            this.preventAutoFill = true;
            this.searchLists(e as KeyboardEventArgs);
        }
    }

    protected pasteHandler(e: KeyboardEventArgs): void {
        setTimeout((): void => {
            this.typedString = this.filterInput.value;
            this.searchLists(e);
        });
    }

    protected onActionFailure(e: Object): void {
        super.onActionFailure(e);
        if (this.beforePopupOpen) {
            this.renderPopup();
        }
    }
    private UpdateSkeleton(isSkeletonCountChange?: boolean, skeletonCount?: number): void {
        let isContainSkeleton = this.list.querySelector('.e-virtual-ddl-content');
        let isContainVirtualList = this.list.querySelector('.e-virtual-list');
        if (isContainSkeleton && (!isContainVirtualList || isSkeletonCountChange) && this.enableVirtualization) {
            const totalSkeletonCount: number = isSkeletonCountChange ? skeletonCount : this.skeletonCount;
            for (let i = 0; i < totalSkeletonCount; i++) {
                const liElement = this.createElement('li', { className: dropDownListClasses.virtualList, styles: 'overflow: inherit' });

                let skeleton: Skeleton = new Skeleton({
                    shape: "Text",
                    height: "10px",
                    width: "95%",
                    cssClass: "e-skeleton-text",
                });
                skeleton.appendTo(this.createElement('div'));
                liElement.appendChild(skeleton.element);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                isContainSkeleton.firstChild.insertBefore(liElement, (isContainSkeleton.firstChild as any).children[0]);
            }
        }
    }

    protected getTakeValue(): number {
        return this.allowFiltering && this.getModuleName() === 'dropdownlist' && Browser.isDevice ? Math.round(window.outerHeight / this.listItemHeight) : this.itemCount;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected onActionComplete(ulElement: HTMLElement, list: { [key: string]: Object }[], e?: Object, isUpdated?: boolean): void {
        if (this.dataSource instanceof DataManager && !isNullOrUndefined(e)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.totalItemCount = (e as any).count;
        }
        if (this.isNotSearchList && !this.enableVirtualization) {
            this.isNotSearchList = false;
            return;
        }
        let tempItemCount = this.itemCount;
        if (this.isActive || !isNullOrUndefined(ulElement)) {
            const selectedItem: HTMLElement = this.selectedLI ? <HTMLElement>this.selectedLI.cloneNode(true) : null;
            super.onActionComplete(ulElement, list, e);
            this.skeletonCount = this.totalItemCount != 0 && this.totalItemCount < (this.itemCount * 2) ? 0 : this.skeletonCount;
            this.updateSelectElementData(this.allowFiltering);
            if (this.isRequested && !isNullOrUndefined(this.searchKeyEvent) && this.searchKeyEvent.type === 'keydown') {
                this.isRequested = false;
                this.keyActionHandler(this.searchKeyEvent);
                this.searchKeyEvent = null;
            }
            if (this.isRequested && !isNullOrUndefined(this.searchKeyEvent)) {
                this.incrementalSearch(this.searchKeyEvent);
                this.searchKeyEvent = null;
            }
            if (!this.enableVirtualization) {
                this.list.scrollTop = 0;
            }
            if (!isNullOrUndefined(ulElement)) {
                attributes(ulElement, { 'id': this.element.id + '_options', 'role': 'listbox', 'aria-hidden': 'false' });
            }
            if (this.initRemoteRender) {
                this.initial = true;
                this.activeIndex = this.index;
                this.initRemoteRender = false;
                if (this.value && this.dataSource instanceof DataManager) {
                    const checkField: string = isNullOrUndefined(this.fields.value) ? this.fields.text : this.fields.value;
                    const fieldValue: string[] = this.fields.value.split('.');
                    const checkVal: boolean = list.some((x: { [key: string]: boolean | string | number }) =>
                        isNullOrUndefined(x[checkField as string]) && fieldValue.length > 1 ?
                            this.checkFieldValue(x, fieldValue) === this.value : x[checkField as string] === this.value);
                    if (!checkVal) {
                        this.dataSource.executeQuery(this.getQuery(this.query).where(new Predicate(checkField, 'equal', this.value)))
                            .then((e: Object) => {
                                if ((e as ResultData).result.length > 0) {
                                    this.addItem((e as ResultData).result, list.length);
                                    this.updateValues();
                                } else {
                                    this.updateValues();
                                }
                            });
                    } else {
                        this.updateValues();
                    }
                } else {
                    this.updateValues();
                }
                this.initial = false;
            }
            else if (this.getModuleName() === 'autocomplete' && this.value) {
                this.setInputValue();
            }
            if (this.getModuleName() !== 'autocomplete' && this.isFiltering() && !this.isTyped) {
                if (!this.actionCompleteData.isUpdated || ((!this.isCustomFilter
                    && !this.isFilterFocus) || (isNullOrUndefined(this.itemData) && this.allowFiltering)
                    && ((this.dataSource instanceof DataManager)
                        || (!isNullOrUndefined(this.dataSource) && !isNullOrUndefined(this.dataSource.length) &&
                            this.dataSource.length !== 0)))) {
                    if (this.itemTemplate && this.element.tagName === 'EJS-COMBOBOX' && this.allowFiltering) {
                        setTimeout(
                            () => {
                                this.updateActionCompleteDataValues(ulElement, list);
                            },
                            0);
                    } else {
                        this.updateActionCompleteDataValues(ulElement, list);
                    }
                }
                if(!this.enableVirtualization){
                    this.addNewItem(list, selectedItem);
                }
                if (!isNullOrUndefined(this.itemData) || (isNullOrUndefined(this.itemData) && this.enableVirtualization)) {
                    this.focusIndexItem();
                }
                if(this.enableVirtualization){
                    this.updateActionCompleteDataValues(ulElement, list);
                }
            } else if (this.enableVirtualization && this.getModuleName() !== 'autocomplete' && !this.isFiltering()) {
                const value: string | number = this.getItemData().value;
                this.activeIndex = this.getIndexByValue(value);
                const element: HTMLElement = this.findListElement(this.list, 'li', 'data-value', value);
                this.selectedLI = element;
            }
            else if(this.enableVirtualization && this.getModuleName() === 'autocomplete'){
                this.activeIndex = this.skeletonCount
            }
            if (this.beforePopupOpen) {
                this.renderPopup(e);
                if (this.enableVirtualization) {
                    if (!this.list.querySelector('.e-virtual-list')) {
                        this.UpdateSkeleton();
                        this.liCollections = <HTMLElement[] & NodeListOf<Element>>this.list.querySelectorAll('.e-list-item');
                    }
                }
                if (this.enableVirtualization && tempItemCount != this.itemCount) {
                    this.resetList(this.dataSource, this.fields);
                }
            }
            
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private checkFieldValue(list: { [key: string]: boolean | string | number }, fieldValue: string[]): any {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let checkField: any = list;
        fieldValue.forEach((value: string) => {
            checkField = checkField[value as string];
        });
        return checkField;
    }

    private updateActionCompleteDataValues(ulElement: HTMLElement, list: { [key: string]: Object }[]): void {
        this.actionCompleteData = { ulElement: ulElement.cloneNode(true) as HTMLElement, list: list, isUpdated: true };
        if (this.actionData.list !== this.actionCompleteData.list && this.actionCompleteData.ulElement && this.actionCompleteData.list) {
            this.actionData = this.actionCompleteData;
        }
    }

    private addNewItem(listData: { [key: string]: Object }[], newElement: HTMLElement): void {
        if (!isNullOrUndefined(this.itemData) && !isNullOrUndefined(newElement)) {
            const value: string | number = this.getItemData().value;
            const isExist: boolean = listData.some((data: { [key: string]: Object }) => {
                return (((typeof data === 'string' || typeof data === 'number') && data === value) ||
                    (getValue(this.fields.value, data) === value));
            });
            if (!isExist) {
                this.addItem(this.itemData);
            }
        }
    }

    protected updateActionCompleteData(li: HTMLElement, item: { [key: string]: Object }, index?: number): void {
        if (this.getModuleName() !== 'autocomplete' && this.actionCompleteData.ulElement) {
            if (this.itemTemplate && this.element.tagName === 'EJS-COMBOBOX' && this.allowFiltering) {
                setTimeout(
                    () => {
                        this.actionCompleteDataUpdate(li, item, index);
                    },
                    0);
            } else {
                this.actionCompleteDataUpdate(li, item, index);
            }
        }
    }

    private actionCompleteDataUpdate(li: HTMLElement, item: { [key: string]: Object }, index?: number): void {
        if (index !== null) {
            this.actionCompleteData.ulElement.
                insertBefore(li.cloneNode(true), this.actionCompleteData.ulElement.childNodes[index as number]);
        } else {
            this.actionCompleteData.ulElement.appendChild(li.cloneNode(true));
        }
        if (this.isFiltering() && this.actionCompleteData.list.indexOf(item) < 0) {
            this.actionCompleteData.list.push(item);
        }
    }

    private focusIndexItem(): void {
        const value: string | number = this.getItemData().value;
        this.activeIndex = this.getIndexByValue(value);
        const element: HTMLElement = this.findListElement(this.list, 'li', 'data-value', value);
        this.selectedLI = element;
        this.activeItem(element);
        if (!(this.enableVirtualization && isNullOrUndefined(element))) {
            this.removeFocus();
        }
    }

    protected updateSelection(): void {
        const selectedItem: Element = this.list.querySelector('.' + dropDownBaseClasses.selected);
        if (selectedItem) {
            this.setProperties({ 'index': this.getIndexByValue(selectedItem.getAttribute('data-value')) });
            this.activeIndex = this.index;
        } else {
            this.removeFocus();
            this.list.querySelector('.' + dropDownBaseClasses.li).classList.add(dropDownListClasses.focus);
        }
    }

    private updateSelectionList(): void {
        let selectedItem: HTMLElement = this.list && this.list.querySelector('.' + 'e-active');
        if (!selectedItem && !isNullOrUndefined(this.value)) {
            var findEle = this.findListElement(this.list, 'li', 'data-value', this.value);
            if (findEle)
            {
                findEle.classList.add('e-active');
            }
        }
    }

    protected checkAndResetCache(): void {
        if (this.enableVirtualization) {
            this.generatedDataObject = {};
          this.virtualItemStartIndex = this.virtualItemEndIndex = 0;
          this.viewPortInfo = { currentPageNumber: null,
            direction: null,
            sentinelInfo: {},
            offsets: {},
            startIndex: 0,
            endIndex: this.itemCount, };
          this.selectedValueInfo = null;
        }
      }
      

    protected removeFocus(): void {
        const highlightedItem: Element[] = <NodeListOf<Element> & Element[]>this.list.querySelectorAll('.' + dropDownListClasses.focus);
        if (highlightedItem && highlightedItem.length) {
            removeClass(highlightedItem, dropDownListClasses.focus);
        }
    }
    protected getTransformValues(): string {
        let translateY: number = this.viewPortInfo.startIndex * this.listItemHeight;
        translateY = translateY - (this.skeletonCount * this.listItemHeight);
        translateY = this.viewPortInfo.startIndex === 0 && this.listData && this.listData.length === 0 ? 0 : translateY;
        const styleText: string = `transform: translate(0px, ${translateY}px);`;
        return styleText;
    }
    protected GetVirtualTrackHeight(): string {
        const height: number = this.totalItemCount === this.viewPortInfo.endIndex ? this.totalItemCount * this.listItemHeight - this.itemCount * this.listItemHeight : this.totalItemCount * this.listItemHeight;
        const heightDimension: string = `height: ${height - this.itemCount * this.listItemHeight}px;`;
        return heightDimension;
    }

    protected renderPopup(e?: MouseEvent | KeyboardEventArgs | TouchEvent | Object): void {
        if (this.popupObj && document.body.contains(this.popupObj.element)) {
            this.refreshPopup();
            return;
        }
        const args: BeforeOpenEventArgs = { cancel: false };
        this.trigger('beforeOpen', args, (args: BeforeOpenEventArgs) => {
            if (!args.cancel) {
                const popupEle: HTMLElement = this.createElement('div', {
                    id: this.element.id + '_popup', className: 'e-ddl e-popup ' + (this.cssClass !== null ? this.cssClass : '')
                });
                const searchBox: InputObject = this.setSearchBox(popupEle);
                this.listHeight = formatUnit(this.popupHeight);
                if (this.headerTemplate) {
                    this.setHeaderTemplate(popupEle);
                }
                append([this.list], popupEle);
                if (this.footerTemplate) {
                    this.setFooterTemplate(popupEle);
                }
                document.body.appendChild(popupEle);
                if(this.enableVirtualization && !this.list.classList.contains(dropDownBaseClasses.noData)){
                    if(!this.list.querySelector('.e-virtual-ddl-content')){
                        this.list.appendChild(this.createElement('div', {
                            className: 'e-virtual-ddl-content',
                            styles: this.getTransformValues()
                        })).appendChild(this.list.querySelector('.e-list-parent'));
                    }
                    else{
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (this.list.getElementsByClassName('e-virtual-ddl-content')[0] as any).style = this.getTransformValues();
                    }
                    this.UpdateSkeleton();
                    this.liCollections = <HTMLElement[] & NodeListOf<Element>>this.list.querySelectorAll('.' + dropDownBaseClasses.li);
                    this.virtualItemCount = this.itemCount;
                    if(!this.list.querySelector('.e-virtual-ddl')){
                        var virualElement = this.createElement('div', {
                            id: this.element.id + '_popup', className: 'e-virtual-ddl', styles: this.GetVirtualTrackHeight()});
                        popupEle.querySelector('.e-dropdownbase').appendChild(virualElement);
                    }
                    else{
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (this.list.getElementsByClassName('e-virtual-ddl')[0] as any).style = this.GetVirtualTrackHeight();
                    }
                }
                popupEle.style.visibility = 'hidden';
                if (this.popupHeight !== 'auto') {
                    this.searchBoxHeight = 0;
                    if (!isNullOrUndefined(searchBox.container) && this.getModuleName() !== 'combobox' && this.getModuleName() !== 'autocomplete') {
                        this.searchBoxHeight = (searchBox.container.parentElement).getBoundingClientRect().height;
                        this.listHeight = (parseInt(this.listHeight, 10) - (this.searchBoxHeight)).toString() + 'px';
                    }
                    if (this.headerTemplate) {
                        this.header = this.header ? this.header : popupEle.querySelector('.e-ddl-header');
                        const height: number = Math.round(this.header.getBoundingClientRect().height);
                        this.listHeight = (parseInt(this.listHeight, 10) - (height + this.searchBoxHeight)).toString() + 'px';
                    }
                    if (this.footerTemplate) {
                        this.footer = this.footer ? this.footer : popupEle.querySelector('.e-ddl-footer');
                        const height: number = Math.round(this.footer.getBoundingClientRect().height);
                        this.listHeight = (parseInt(this.listHeight, 10) - (height + this.searchBoxHeight)).toString() + 'px';
                    }
                    this.list.style.maxHeight = (parseInt(this.listHeight, 10) - 2).toString() + 'px'; // due to box-sizing property
                    popupEle.style.maxHeight = formatUnit(this.popupHeight);
                } else {
                    popupEle.style.height = 'auto';
                }
                let offsetValue: number = 0;
                let left: number;
                this.isPreventScrollAction = true;
                if (!isNullOrUndefined(this.selectedLI) && (!isNullOrUndefined(this.activeIndex) && this.activeIndex >= 0)) {
                    this.setScrollPosition();
                } else if(this.enableVirtualization){
                    this.setScrollPosition();
                } else {
                    this.list.scrollTop = 0;
                }
                if (Browser.isDevice && (!this.allowFiltering && (this.getModuleName() === 'dropdownlist' ||
                    (this.isDropDownClick && this.getModuleName() === 'combobox')))) {
                    offsetValue = this.getOffsetValue(popupEle);
                    const firstItem: HTMLElement = this.isEmptyList() ? this.list : this.liCollections[0];
                    if (!isNullOrUndefined(this.inputElement)) {
                        left = -(parseInt(getComputedStyle(firstItem).textIndent, 10) -
                            parseInt(getComputedStyle(this.inputElement).paddingLeft, 10) +
                            parseInt(getComputedStyle(this.inputElement.parentElement).borderLeftWidth, 10));
                    }
                }
                this.getFocusElement();
                this.createPopup(popupEle, offsetValue, left);
                this.popupContentElement = this.popupObj.element.querySelector('.e-content');
                this.checkCollision(popupEle);
                if (Browser.isDevice) {
                    this.popupObj.element.classList.add(dropDownListClasses.device);
                    if (this.getModuleName() === 'dropdownlist' || (this.getModuleName() === 'combobox'
                        && !this.allowFiltering && this.isDropDownClick)) {
                        this.popupObj.collision = { X: 'fit', Y: 'fit' };
                    }
                    if (this.isFilterLayout()) {
                        this.popupObj.element.classList.add(dropDownListClasses.mobileFilter);
                        this.popupObj.position = { X: 0, Y: 0 };
                        this.popupObj.dataBind();
                        attributes(this.popupObj.element, { style: 'left:0px;right:0px;top:0px;bottom:0px;' });
                        addClass([document.body, this.popupObj.element], dropDownListClasses.popupFullScreen);
                        this.setSearchBoxPosition();
                        this.backIconElement = searchBox.container.querySelector('.e-back-icon');
                        this.clearIconElement = searchBox.container.querySelector('.' + dropDownListClasses.clearIcon);
                        EventHandler.add(this.backIconElement, 'click', this.clickOnBackIcon, this);
                        EventHandler.add(this.clearIconElement, 'click', this.clearText, this);
                    }
                }
                popupEle.style.visibility = 'visible';
                addClass([popupEle], 'e-popup-close');
                const scrollParentElements: HTMLElement[] = this.popupObj.getScrollableParent(this.inputWrapper.container);
                for (const element of scrollParentElements) {
                    EventHandler.add(element, 'scroll', this.scrollHandler, this);
                }
                if (!isNullOrUndefined(this.list)) {
                    this.unWireListEvents(); this.wireListEvents();
                }
                this.selectedElementID = this.selectedLI ? this.selectedLI.id : null;
                if(this.enableVirtualization){
                    this.notify("bindScrollEvent", {
                        module: "VirtualScroll",
                        component: this.getModuleName(),
                        enable: this.enableVirtualization,
                    });
                    setTimeout(() => {
                        if (this.value) {
                            this.updateSelectionList()
                            if (this.selectedValueInfo && this.viewPortInfo && this.viewPortInfo.offsets.top) {
                                this.list.scrollTop = this.viewPortInfo.offsets.top;
                            } else {
                                this.scrollBottom(true, true);
                            }

                        }
                    }, 5);
                }
                attributes(this.targetElement(), { 'aria-expanded': 'true', 'aria-owns': this.element.id + '_options' });
                this.inputElement.setAttribute('aria-expanded', 'true');
                const inputParent: HTMLElement = this.isFiltering() ? this.filterInput.parentElement : this.inputWrapper.container;
                addClass([inputParent], [dropDownListClasses.inputFocus]);
                const animModel: AnimationModel = { name: 'FadeIn', duration: 100 };
                this.beforePopupOpen = true;
                const popupInstance: Popup = this.popupObj;
                const eventArgs: PopupEventArgs = { popup: popupInstance, event: e, cancel: false, animation: animModel };
                this.trigger('open', eventArgs, (eventArgs: PopupEventArgs) => {
                    if (!eventArgs.cancel) {
                        if (!isNullOrUndefined(this.inputWrapper)) {
                            addClass([this.inputWrapper.container], [dropDownListClasses.iconAnimation]);
                        }
                        this.renderReactTemplates();
                        if (!isNullOrUndefined(this.popupObj)) {
                            this.popupObj.show(new Animation(eventArgs.animation), (this.zIndex === 1000) ? this.element : null);
                        }
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
    private checkCollision(popupEle: HTMLElement): void {
        if (!Browser.isDevice || (Browser.isDevice && !(this.getModuleName() === 'dropdownlist' || this.isDropDownClick))) {
            const collision: string[] = isCollide(popupEle);
            if (collision.length > 0) {
                popupEle.style.marginTop = -parseInt(getComputedStyle(popupEle).marginTop, 10) + 'px';
            }
            this.popupObj.resolveCollision();
        }
    }
    private getOffsetValue(popupEle: HTMLElement): number {
        const popupStyles: CSSStyleDeclaration = getComputedStyle(popupEle);
        const borderTop: number = parseInt(popupStyles.borderTopWidth, 10);
        const borderBottom: number = parseInt(popupStyles.borderBottomWidth, 10);
        return this.setPopupPosition(borderTop + borderBottom);
    }
    private createPopup(element: HTMLElement, offsetValue: number, left: number): void {
        this.popupObj = new Popup(element, {
            width: this.setWidth(), targetType: 'relative',
            relateTo: this.inputWrapper.container, collision: { X: 'flip', Y: 'flip' }, offsetY: offsetValue,
            enableRtl: this.enableRtl, offsetX: left, 
            position: this.enableRtl ? { X: 'right', Y: 'bottom' } : { X: 'left', Y: 'bottom' },
            zIndex: this.zIndex,
            close: () => {
                if (!this.isDocumentClick) {
                    this.focusDropDown();
                }
                // eslint-disable-next-line
                if ((this as any).isReact) { this.clearTemplate(['headerTemplate', 'footerTemplate']); }
                this.isNotSearchList = false;
                this.isDocumentClick = false;
                this.destroyPopup();
                if (this.isFiltering() && this.actionCompleteData.list && this.actionCompleteData.list[0]) {
                    this.isActive = true;
                    this.onActionComplete(this.actionCompleteData.ulElement, this.actionCompleteData.list, null, true);
                }
            },
            open: () => {
                EventHandler.add(document, 'mousedown', this.onDocumentClick, this);
                this.isPopupOpen = true;
                const actionList: HTMLElement = this.actionCompleteData && this.actionCompleteData.ulElement &&
                    this.actionCompleteData.ulElement.querySelector('li');
                const ulElement: HTMLElement = this.list.querySelector('ul li');
                if (!isNullOrUndefined(this.ulElement) && !isNullOrUndefined(this.ulElement.getElementsByClassName('e-item-focus')[0])) {
                    attributes(this.targetElement(), { 'aria-activedescendant': this.ulElement.getElementsByClassName('e-item-focus')[0].id });
                } else if (!isNullOrUndefined(this.ulElement) && !isNullOrUndefined(this.ulElement.getElementsByClassName('e-active')[0])) {
                    attributes(this.targetElement(), { 'aria-activedescendant': this.ulElement.getElementsByClassName('e-active')[0].id });
                }
                if (this.isFiltering() && this.itemTemplate && (this.element.tagName === this.getNgDirective()) &&
                    (actionList && ulElement && actionList.textContent !== ulElement.textContent) &&
                    this.element.tagName !== 'EJS-COMBOBOX') {
                    this.cloneElements();
                }
                if (this.isFilterLayout()) {
                    removeClass([this.inputWrapper.container], [dropDownListClasses.inputFocus]);
                    this.isFilterFocus = true;
                    this.filterInput.focus();
                    if (this.inputWrapper.clearButton) {
                        addClass([this.inputWrapper.clearButton], dropDownListClasses.clearIconHide);
                    }
                }
                this.activeStateChange();
            },
            targetExitViewport: () => {
                if (!Browser.isDevice) {
                    this.hidePopup();
                }
            }
        });
    }
    private isEmptyList(): boolean {
        return !isNullOrUndefined(this.liCollections) && this.liCollections.length === 0;
    }

    protected getFocusElement(): void {
        // combo-box used this method
    }

    private isFilterLayout(): boolean {
        return this.getModuleName() === 'dropdownlist' && this.allowFiltering;
    }

    private scrollHandler(): void {
        if (Browser.isDevice && ((this.getModuleName() === 'dropdownlist' &&
            !this.isFilterLayout()) || (this.getModuleName() === 'combobox' && !this.allowFiltering && this.isDropDownClick))) {
            this.hidePopup();
        }
    }

    private setSearchBoxPosition(): void {
        const searchBoxHeight: number = this.filterInput.parentElement.getBoundingClientRect().height;
        this.popupObj.element.style.maxHeight = '100%';
        this.popupObj.element.style.width = '100%';
        this.list.style.maxHeight = (window.innerHeight - searchBoxHeight) + 'px';
        this.list.style.height = (window.innerHeight - searchBoxHeight) + 'px';
        const clearElement: Element = this.filterInput.parentElement.querySelector('.' + dropDownListClasses.clearIcon);
        detach(this.filterInput);
        clearElement.parentElement.insertBefore(this.filterInput, clearElement);
    }

    private setPopupPosition(border?: number): number {
        let offsetValue: number;
        const popupOffset: number = border;
        const selectedLI: HTMLElement = <HTMLElement>this.list.querySelector('.' + dropDownListClasses.focus) || this.selectedLI;
        const firstItem: HTMLElement = this.isEmptyList() ? this.list : this.liCollections[0];
        const lastItem: HTMLElement = this.isEmptyList() ? this.list : this.liCollections[this.getItems().length - 1];
        const liHeight: number = firstItem.getBoundingClientRect().height;
        this.listItemHeight = liHeight;
        const listHeight: number = this.list.offsetHeight / 2;
        const height: number = isNullOrUndefined(selectedLI) ? firstItem.offsetTop : selectedLI.offsetTop;
        const lastItemOffsetValue: number = lastItem.offsetTop;
        if (lastItemOffsetValue - listHeight < height && !isNullOrUndefined(this.liCollections) &&
            this.liCollections.length > 0 && !isNullOrUndefined(selectedLI)) {
            const count: number = this.list.offsetHeight / liHeight;
            const paddingBottom: number = parseInt(getComputedStyle(this.list).paddingBottom, 10);
            offsetValue = (count - (this.liCollections.length - this.activeIndex)) * liHeight - popupOffset + paddingBottom;
            this.list.scrollTop = selectedLI.offsetTop;
        } else if (height > listHeight && !this.enableVirtualization) {
            offsetValue = listHeight - liHeight / 2;
            this.list.scrollTop = height - listHeight + liHeight / 2;
        } else {
            offsetValue = height;
        }
        const inputHeight: number = this.inputWrapper.container.offsetHeight;
        offsetValue = offsetValue + liHeight + popupOffset - ((liHeight - inputHeight) / 2);
        return -offsetValue;
    }

    private setWidth(): string {
        let width: string = formatUnit(this.popupWidth);
        if (width.indexOf('%') > -1) {
            const inputWidth: number = this.inputWrapper.container.offsetWidth * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        if (Browser.isDevice && (!this.allowFiltering && (this.getModuleName() === 'dropdownlist' ||
            (this.isDropDownClick && this.getModuleName() === 'combobox')))) {
            const firstItem: HTMLElement = this.isEmptyList() ? this.list : this.liCollections[0];
            width = (parseInt(width, 10) + (parseInt(getComputedStyle(firstItem).textIndent, 10) -
                parseInt(getComputedStyle(this.inputElement).paddingLeft, 10) +
                parseInt(getComputedStyle(this.inputElement.parentElement).borderLeftWidth, 10)) * 2) + 'px';
        }
        return width;
    }

    private scrollBottom(isInitial?: boolean, isInitialSelection: boolean = false, keyAction: string = null): void {
        if (isNullOrUndefined(this.selectedLI) && this.enableVirtualization) {
            this.selectedLI = this.list.querySelector('.' + dropDownBaseClasses.li);
            if(!isNullOrUndefined(this.selectedLI) && this.selectedLI.classList.contains('e-virtual-list')) {
                this.selectedLI = this.liCollections[this.skeletonCount];
            }
        }
        if (!isNullOrUndefined(this.selectedLI)) {
            this.isUpwardScrolling = false;
            let virtualListCount: number = this.list.querySelectorAll('.e-virtual-list').length;
            let lastElementValue: string = this.list.querySelector('li:last-of-type') ? this.list.querySelector('li:last-of-type').getAttribute('data-value') : null;
            let selectedLiOffsetTop: number = this.virtualListInfo  && this.virtualListInfo.startIndex ? this.selectedLI.offsetTop + (this.virtualListInfo.startIndex * this.selectedLI.offsetHeight) : this.selectedLI.offsetTop;
            const currentOffset: number = this.list.offsetHeight;
            let nextBottom: number = selectedLiOffsetTop - (virtualListCount * this.selectedLI.offsetHeight) + this.selectedLI.offsetHeight - this.list.scrollTop;
            let nextOffset: number = this.list.scrollTop + nextBottom - currentOffset;
            let isScrollerCHanged: boolean = false;
            let isScrollTopChanged: boolean = false;
            nextOffset = isInitial ? nextOffset + parseInt(getComputedStyle(this.list).paddingTop, 10) * 2 : nextOffset + parseInt(getComputedStyle(this.list).paddingTop, 10);
            let boxRange: number = selectedLiOffsetTop - (virtualListCount * this.selectedLI.offsetHeight) + this.selectedLI.offsetHeight - this.list.scrollTop;
            boxRange = this.fields.groupBy && !isNullOrUndefined(this.fixedHeaderElement) ?
                boxRange - this.fixedHeaderElement.offsetHeight : boxRange;
            if (this.activeIndex === 0 && !this.enableVirtualization) {
                this.list.scrollTop = 0;
                isScrollerCHanged = this.isKeyBoardAction;
            } else if (nextBottom > currentOffset || !(boxRange > 0 && this.list.offsetHeight > boxRange)) {
                let currentElementValue: string = this.selectedLI ? this.selectedLI.getAttribute('data-value') : null;
                var liCount = keyAction == "pageDown" ? this.getPageCount() - 2 : 1;
                if (!this.enableVirtualization || this.isKeyBoardAction || isInitialSelection) {
                    if (this.isKeyBoardAction && this.enableVirtualization && lastElementValue && currentElementValue === lastElementValue && keyAction != "end"  && !this.isVirtualScrolling) {
                        this.isPreventKeyAction = true;
                        this.list.scrollTop += this.selectedLI.offsetHeight * liCount;
                        this.isPreventKeyAction = this.IsScrollerAtEnd() ? false : this.isPreventKeyAction;
                        this.isKeyBoardAction = false;
                        this.isPreventScrollAction = false;
                    }
                    else if (this.enableVirtualization && keyAction == "end") {
                        this.isPreventKeyAction = false;
                        this.isKeyBoardAction = false;   
                        this.isPreventScrollAction = false;
                        this.list.scrollTop = this.list.scrollHeight;
                       
                    } else {
                        if (keyAction == "pageDown" && this.enableVirtualization && !this.isVirtualScrolling) {
                            this.isPreventKeyAction = false;
                            this.isKeyBoardAction = false;
                            this.isPreventScrollAction = false;
                            nextOffset = nextOffset + (this.selectedLI.offsetHeight * liCount);
                        }
                       
                      this.list.scrollTop = nextOffset;
                    }
                }
                else {
                    this.list.scrollTop = this.virtualListInfo && this.virtualListInfo.startIndex ? this.virtualListInfo.startIndex * this.listItemHeight : 0;
                }
                isScrollerCHanged = this.isKeyBoardAction;
                isScrollTopChanged = true;
            }
            this.isKeyBoardAction = isScrollerCHanged;
        }
    }

    private scrollTop(keyAction: string = null): void {
        if (!isNullOrUndefined(this.selectedLI)) {
            let virtualListCount: number = this.list.querySelectorAll('.e-virtual-list').length;
            let selectedLiOffsetTop: number = (this.virtualListInfo && this.virtualListInfo.startIndex) ? this.selectedLI.offsetTop + (this.virtualListInfo.startIndex * this.selectedLI.offsetHeight) : this.selectedLI.offsetTop;
            let nextOffset: number = selectedLiOffsetTop - (virtualListCount * this.selectedLI.offsetHeight) - this.list.scrollTop;
            let firstElementValue: string = this.list.querySelector('li.e-list-item:not(.e-virtual-list)') ? this.list.querySelector('li.e-list-item:not(.e-virtual-list)').getAttribute('data-value') : null;
            nextOffset = this.fields.groupBy && !isNullOrUndefined(this.fixedHeaderElement) ?
                nextOffset - this.fixedHeaderElement.offsetHeight : nextOffset;
            let boxRange: number = (selectedLiOffsetTop - (virtualListCount * this.selectedLI.offsetHeight) + this.selectedLI.offsetHeight - this.list.scrollTop);
            let isPageUpKeyAction: boolean = this.enableVirtualization && this.getModuleName() === 'autocomplete' && nextOffset <= 0 ;
            if (this.activeIndex === 0 && !this.enableVirtualization) {
                this.list.scrollTop = 0;
            } else if (nextOffset < 0 || isPageUpKeyAction) {
                var currentElementValue = this.selectedLI ? this.selectedLI.getAttribute('data-value') : null;
                var liCount = keyAction == "pageUp" ? this.getPageCount() - 2 : 1;
                if (this.enableVirtualization && this.isKeyBoardAction && firstElementValue && currentElementValue === firstElementValue && keyAction != "home"  && !this.isVirtualScrolling) {
                    this.isUpwardScrolling = true;
                    this.isPreventKeyAction = true;
                    this.list.scrollTop -= this.selectedLI.offsetHeight * liCount;
                    this.isPreventKeyAction = this.list.scrollTop != 0 ? this.isPreventKeyAction : false;
                    this.isKeyBoardAction = false;
                    this.isPreventScrollAction = false;
                }
                else if (this.enableVirtualization && keyAction == "home") {
                    this.isPreventScrollAction = false;
                    this.isPreventKeyAction = true;
                    this.isKeyBoardAction = false;
                    this.list.scrollTo(0, 0);
                }
                else {
                    if (keyAction == "pageUp" && this.enableVirtualization && !this.isVirtualScrolling) {
                        this.isPreventKeyAction = false;
                        this.isKeyBoardAction = false;
                        this.isPreventScrollAction = false;
                        nextOffset = nextOffset - (this.selectedLI.offsetHeight * liCount);
                    }
                    this.list.scrollTop = this.list.scrollTop + nextOffset;
                }
            } else if (!(boxRange > 0 && this.list.offsetHeight > boxRange)) {
                this.list.scrollTop = this.selectedLI.offsetTop - (this.fields.groupBy && !isNullOrUndefined(this.fixedHeaderElement) ?
                    this.fixedHeaderElement.offsetHeight : 0);
            }
        }
    }

    private IsScrollerAtEnd = function () {
        return this.list && this.list.scrollTop + this.list.clientHeight >= this.list.scrollHeight;
    }

    protected isEditTextBox(): boolean {
        return false;
    }

    protected isFiltering(): boolean {
        return this.allowFiltering;
    }

    protected isPopupButton(): boolean {
        return true;
    }

    protected setScrollPosition(e?: KeyboardEventArgs): void {
        this.isPreventScrollAction = true;
        if (!isNullOrUndefined(e)) {
            switch (e.action) {
                case 'pageDown':
                case 'down':
                case 'end':
                    this.isKeyBoardAction = true;
                    this.scrollBottom(false, false, e.action)
                    break;
                default:
                    this.isKeyBoardAction = e.action == 'up' || e.action == 'pageUp' || e.action == 'open';
                    this.scrollTop(e.action)
                    break;
            }
        } else {
            this.scrollBottom(true);
        }
        this.isKeyBoardAction = false;
    }

    private clearText(): void {
        this.filterInput.value = this.typedString = '';
        this.searchLists(null);
        if(this.enableVirtualization){
            this.list.scrollTop = 0;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.totalItemCount = this.dataCount = this.dataSource && (this.dataSource as any).length ? (this.dataSource as any).length : 0;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if(this.list.getElementsByClassName('e-virtual-ddl')[0] as any){
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (this.list.getElementsByClassName('e-virtual-ddl')[0] as any).style = this.GetVirtualTrackHeight();
            }
            this.getSkeletonCount();
            this.UpdateSkeleton();
            this.liCollections = <HTMLElement[] & NodeListOf<Element>>this.list.querySelectorAll('.e-list-item');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if(this.list.getElementsByClassName('e-virtual-ddl-content')[0] as any){
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (this.list.getElementsByClassName('e-virtual-ddl-content')[0] as any).style = this.getTransformValues();
            }
        }
    }

    private setEleWidth(width: string | number): void {
        if (!isNullOrUndefined(width)) {
            if (typeof width === 'number') {
                this.inputWrapper.container.style.width = formatUnit(width);
            } else if (typeof width === 'string') {
                this.inputWrapper.container.style.width = (width.match(/px|%|em/)) ? <string>(width) : <string>(formatUnit(width));
            }
        }
    }

    private closePopup(delay: number, e: MouseEvent | KeyboardEventArgs | TouchEvent): void {
        let isFilterValue = !isNullOrUndefined(this.filterInput) && !isNullOrUndefined(this.filterInput.value) && this.filterInput.value !== '';
        const typedString: string = this.getModuleName() === 'combobox' ? this.typedString : null;
        this.isTyped = false;
        if (!(this.popupObj && document.body.contains(this.popupObj.element) && this.beforePopupOpen)) {
            return;
        }
        this.keyboardEvent = null;
        EventHandler.remove(document, 'mousedown', this.onDocumentClick);
        this.isActive = false;
        this.filterInputObj = null;
        this.isDropDownClick = false;
        this.preventAutoFill = false;
        const scrollableParentElements: HTMLElement[] = this.popupObj.getScrollableParent(this.inputWrapper.container);
        for (const element of scrollableParentElements) {
            EventHandler.remove(element, 'scroll', this.scrollHandler);
        }
        if (Browser.isDevice && this.isFilterLayout()) {
            removeClass([document.body, this.popupObj.element], dropDownListClasses.popupFullScreen);
        }
        if (this.isFilterLayout()) {
            if (!Browser.isDevice) {
                this.searchKeyModule.destroy();
                if (this.clearIconElement) {
                    EventHandler.remove(this.clearIconElement, 'click', this.clearText);
                }
            }
            if (this.backIconElement) {
                EventHandler.remove(this.backIconElement, 'click', this.clickOnBackIcon);
                EventHandler.remove(this.clearIconElement, 'click', this.clearText);
            }
            if (!isNullOrUndefined(this.filterInput)) {
                EventHandler.remove(this.filterInput, 'input', this.onInput);
                EventHandler.remove(this.filterInput, 'keyup', this.onFilterUp);
                EventHandler.remove(this.filterInput, 'keydown', this.onFilterDown);
                EventHandler.remove(this.filterInput, 'blur', this.onBlurHandler);
                EventHandler.remove(this.filterInput, 'paste', this.pasteHandler);
            }
            this.filterInput = null;
        }
        attributes(this.targetElement(), { 'aria-expanded': 'false' });
        this.inputElement.setAttribute('aria-expanded', 'false');
        this.targetElement().removeAttribute('aria-owns');
        this.targetElement().removeAttribute('aria-activedescendant');
        this.inputWrapper.container.classList.remove(dropDownListClasses.iconAnimation);
        if (this.isFiltering()) {
            this.actionCompleteData.isUpdated = false;
        }
        if (this.enableVirtualization)
            {
                if ((this.value == null || this.isTyped))
                {
                    this.viewPortInfo.endIndex = this.viewPortInfo && this.viewPortInfo.endIndex > 0 ? this.viewPortInfo.endIndex : this.itemCount;
                    if (this.getModuleName() === 'autocomplete'||  (this.getModuleName() === 'dropdownlist' && !isNullOrUndefined(this.typedString) && this.typedString != "") || (this.getModuleName() === 'combobox' && this.allowFiltering && !isNullOrUndefined(this.typedString) && this.typedString != ""))
                    {
                       this.checkAndResetCache();
                    }
                }
                else if(this.getModuleName() === 'autocomplete')
                {
                    this.checkAndResetCache();
                }
                if((this.getModuleName() === 'dropdownlist' || this.getModuleName() === 'combobox') && !(this.skeletonCount==0))
                {
                    this.getSkeletonCount(true);
                }
            }
        this.beforePopupOpen = false;
        const animModel: AnimationModel = {
            name: 'FadeOut',
            duration: 100,
            delay: delay ? delay : 0
        };
        const popupInstance: Popup = this.popupObj;
        const eventArgs: PopupEventArgs = { popup: popupInstance, cancel: false, animation: animModel, event: e || null };
        this.trigger('close', eventArgs, (eventArgs: PopupEventArgs) => {
            if (!isNullOrUndefined(this.popupObj) &&
                !isNullOrUndefined(this.popupObj.element.querySelector('.e-fixed-head'))) {
                const fixedHeader: HTMLElement = this.popupObj.element.querySelector('.e-fixed-head');
                fixedHeader.parentNode.removeChild(fixedHeader);
                this.fixedHeaderElement = null;
            }
            if (!eventArgs.cancel) {
                if (this.getModuleName() === 'autocomplete') {
                    this.rippleFun();
                }
                if (this.isPopupOpen) {
                    this.popupObj.hide(new Animation(eventArgs.animation));
                } else {
                    this.destroyPopup();
                }
            }
        });
        if((this as any).isReact && this.isFiltering() && this.itemTemplate != null){
            (this as any).actionCompleteData.ulElement = this.ulElement.cloneNode(true);
        }
        const dataSourceCount: number = this.dataSource && (this.dataSource as any).length ? (this.dataSource as any).length : 0;
        if (this.enableVirtualization && this.isFiltering() && this.value != null && isFilterValue && this.totalItemCount !== dataSourceCount) {
            this.updateInitialData();
            this.checkAndResetCache();
        }
    }

    private updateInitialData(): void {
    let currentData : any[]= this.selectData;
        let ulElement = this.renderItems(currentData, this.fields);
        this.list.scrollTop = 0;
        this.virtualListInfo = {
            currentPageNumber: null,
            direction: null,
            sentinelInfo: {},
            offsets: {},
            startIndex: 0,
            endIndex: 0,
        };
        if(this.getModuleName() === 'combobox'){
            this.typedString = "";
        }
        this.previousStartIndex = 0;
        this.previousEndIndex = 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.totalItemCount = this.dataCount = this.dataSource && (this.dataSource as any).length ? (this.dataSource as any).length : 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if(this.list.getElementsByClassName('e-virtual-ddl')[0] as any){
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.list.getElementsByClassName('e-virtual-ddl')[0] as any).style = this.GetVirtualTrackHeight();
        }
        this.getSkeletonCount();
        this.UpdateSkeleton();
        this.listData = currentData;
        this.updateActionCompleteDataValues(ulElement, currentData);
        this.liCollections = <HTMLElement[] & NodeListOf<Element>>this.list.querySelectorAll('.e-list-item');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if(this.list.getElementsByClassName('e-virtual-ddl-content')[0] as any){
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.list.getElementsByClassName('e-virtual-ddl-content')[0] as any).style = this.getTransformValues();
        }
    }

    private destroyPopup(): void {
        this.isPopupOpen = false;
        this.isFilterFocus = false;
        if(this.popupObj)
        {
            this.popupObj.destroy();
            detach(this.popupObj.element);
        }
    }

    private clickOnBackIcon(): void {
        this.hidePopup();
        this.focusIn();
    }
    /**
     * To Initialize the control rendering
     *
     * @private
     * @returns {void}
     */
    public render(): void {
        if (this.element.tagName === 'INPUT') {
            this.inputElement = this.element as HTMLInputElement;
            if (isNullOrUndefined(this.inputElement.getAttribute('role'))) {
                this.inputElement.setAttribute('role', 'combobox');
            }
            if (isNullOrUndefined(this.inputElement.getAttribute('type'))) {
                this.inputElement.setAttribute('type', 'text');
            }
            this.inputElement.setAttribute('aria-expanded', 'false');
        } else {
            this.inputElement = this.createElement('input', { attrs: { role: 'combobox', type: 'text' } }) as HTMLInputElement;
            if (this.element.tagName !== this.getNgDirective()) {
                this.element.style.display = 'none';
            }
            this.element.parentElement.insertBefore(this.inputElement, this.element);
            this.preventTabIndex(this.inputElement);
        }
        let updatedCssClassValues: string = this.cssClass;
        if (!isNullOrUndefined(this.cssClass) && this.cssClass !== '') {
            updatedCssClassValues = (this.cssClass.replace(/\s+/g, ' ')).trim();
        }
        if (!isNullOrUndefined(closest(this.element, 'fieldset') as HTMLFieldSetElement) && (closest(this.element, 'fieldset') as HTMLFieldSetElement).disabled) {
            this.enabled = false;
        }
        this.inputWrapper = Input.createInput(
            {
                element: <HTMLInputElement>this.inputElement,
                buttons: this.isPopupButton() ? [dropDownListClasses.icon] : null,
                floatLabelType: this.floatLabelType,
                properties: {
                    readonly: this.getModuleName() === 'dropdownlist' ? true : this.readonly,
                    placeholder: this.placeholder,
                    cssClass: updatedCssClassValues,
                    enabled: this.enabled,
                    enableRtl: this.enableRtl,
                    showClearButton: this.showClearButton
                }
            },
            this.createElement
        );
        if (this.element.tagName === this.getNgDirective()) {
            this.element.appendChild(this.inputWrapper.container);
        } else {
            this.inputElement.parentElement.insertBefore(this.element, this.inputElement);
        }
        this.hiddenElement = this.createElement('select', {
            attrs: { 'aria-hidden': 'true', 'tabindex': '-1', 'class': dropDownListClasses.hiddenElement }
        }) as HTMLSelectElement;
        prepend([this.hiddenElement], this.inputWrapper.container);
        this.validationAttribute(this.element, this.hiddenElement);
        this.setReadOnly();
        this.setFields();
        this.inputWrapper.container.style.width = formatUnit(this.width);
        this.inputWrapper.container.classList.add('e-ddl');
        if (this.floatLabelType === 'Auto') {
            Input.calculateWidth(this.inputElement, this.inputWrapper.container);
        }
        if (!isNullOrUndefined(this.inputWrapper.buttons[0]) && this.inputWrapper.container.getElementsByClassName('e-float-text-content')[0] && this.floatLabelType !== 'Never') {
            this.inputWrapper.container.getElementsByClassName('e-float-text-content')[0].classList.add('e-icon');
        }
        this.wireEvent();
        this.tabIndex = this.element.hasAttribute('tabindex') ? this.element.getAttribute('tabindex') : '0';
        this.element.removeAttribute('tabindex');
        const id: string = this.element.getAttribute('id') ? this.element.getAttribute('id') : getUniqueID('ej2_dropdownlist');
        this.element.id = id;
        this.hiddenElement.id = id + '_hidden';
        this.targetElement().setAttribute('tabindex', this.tabIndex);
        if((this.getModuleName() === 'autocomplete' || this.getModuleName() === 'combobox') && !this.readonly){
            this.inputElement.setAttribute('aria-label', this.getModuleName());
        }else if (this.getModuleName() === 'dropdownlist'){
            attributes(this.targetElement(), { 'aria-label': this.getModuleName()});
        }
        attributes(this.targetElement(), this.getAriaAttributes());
        this.updateDataAttribute(this.htmlAttributes);
        this.setHTMLAttributes();
        if (this.targetElement() === this.inputElement) {
            this.inputElement.removeAttribute('aria-labelledby');
        }
        if (this.value !== null || this.activeIndex !== null || this.text !== null) {
            if(this.enableVirtualization){
                this.listItemHeight = this.getListHeight();
                this.getSkeletonCount();
                this.updateVirtualizationProperties(this.itemCount, this.allowFiltering);
            }
            this.initValue();
            this.selectedValueInfo = this.viewPortInfo;
            if (this.enableVirtualization) {
                this.activeIndex = this.activeIndex + this.skeletonCount;
            }
        } else if (this.element.tagName === 'SELECT' && (<HTMLSelectElement>this.element).options[0]) {
            const selectElement: HTMLSelectElement = <HTMLSelectElement>this.element;
            this.value = selectElement.options[selectElement.selectedIndex].value;
            this.text = isNullOrUndefined(this.value) ? null : selectElement.options[selectElement.selectedIndex].textContent;
            this.initValue();
        }
        this.setEnabled();
        this.preventTabIndex(this.element);
        if (!this.enabled) {
            this.targetElement().tabIndex = -1;
        }
        this.initial = false;
        this.element.style.opacity = '';
        this.inputElement.onselect = (e: UIEvent) => {
            e.stopImmediatePropagation();
        };
        this.inputElement.onchange = (e: UIEvent) => {
            e.stopImmediatePropagation();
        };
        if (this.element.hasAttribute('autofocus')) {
            this.focusIn();
        }
        if (!isNullOrUndefined(this.text)) {
            this.inputElement.setAttribute('value', this.text);
        }
        if (this.element.hasAttribute('data-val')) {
            this.element.setAttribute('data-val', 'false');
        }
        const floatLabelElement: HTMLElement = <HTMLElement>this.inputWrapper.container.getElementsByClassName('e-float-text')[0];
        if (!isNullOrUndefined(this.element.id) && this.element.id !== '' && !isNullOrUndefined(floatLabelElement)) {
            floatLabelElement.id = 'label_' + this.element.id.replace(/ /g, '_');
            attributes(this.inputElement, { 'aria-labelledby': floatLabelElement.id });
        }
        this.renderComplete();
        this.listItemHeight = this.getListHeight();
        this.getSkeletonCount();
        if(this.enableVirtualization){
            this.updateVirtualizationProperties(this.itemCount, this.allowFiltering);
        }
        this.viewPortInfo.startIndex = this.virtualItemStartIndex = 0;
        this.viewPortInfo.endIndex = this.virtualItemEndIndex = this.viewPortInfo.startIndex > 0 ? this.viewPortInfo.endIndex : this.itemCount;
    }

    private getListHeight(): number {
        let listParent: HTMLElement = this.createElement('div', {
            className: 'e-dropdownbase'
        });
        let item: HTMLElement = this.createElement('li', {
            className: 'e-list-item'
        });
        let listParentHeight: string = formatUnit(this.popupHeight);
        listParent.style.height = (parseInt(listParentHeight, 10)).toString() + 'px'; 
        listParent.appendChild(item);
        document.body.appendChild(listParent);
        this.virtualListHeight = listParent.getBoundingClientRect().height;
        let listItemHeight: number = Math.ceil(item.getBoundingClientRect().height);
        listParent.remove();
        return listItemHeight;
    }

    private setFooterTemplate(popupEle: HTMLElement): void {
        let compiledString: Function;
        if (this.footer) {
            if ((this as any).isReact && typeof this.footerTemplate === 'function') {
                this.clearTemplate(['footerTemplate']);
            } else {
                this.footer.innerHTML = '';
            }
        } else {
            this.footer = this.createElement('div');
            addClass([this.footer], dropDownListClasses.footer);
        }
        const footercheck: boolean = this.dropdownCompiler(this.footerTemplate);
        if (typeof this.footerTemplate !== 'function' && footercheck) {
            compiledString = compile(select(this.footerTemplate, document).innerHTML.trim());
        } else {
            compiledString = compile(this.footerTemplate);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const footerCompTemp: any = compiledString(
            {}, this, 'footerTemplate', this.footerTemplateId, this.isStringTemplate, null, this.footer);
        if (footerCompTemp && footerCompTemp.length > 0) {
            append(footerCompTemp, this.footer);
        }
        append([this.footer], popupEle);
    }

    private setHeaderTemplate(popupEle: HTMLElement): void {
        let compiledString: Function;
        if (this.header) {
            this.header.innerHTML = '';
        } else {
            this.header = this.createElement('div');
            addClass([this.header], dropDownListClasses.header);
        }
        const headercheck: boolean = this.dropdownCompiler(this.headerTemplate);
        if (typeof this.headerTemplate !== 'function' && headercheck) {
            compiledString = compile(select(this.headerTemplate, document).innerHTML.trim());
        } else {
            compiledString = compile(this.headerTemplate);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const headerCompTemp: any = compiledString(
            {}, this, 'headerTemplate', this.headerTemplateId, this.isStringTemplate, null, this.header);
        if (headerCompTemp && headerCompTemp.length) {
            append(headerCompTemp, this.header);
        }
        const contentEle: Element = popupEle.querySelector('div.e-content');
        popupEle.insertBefore(this.header, contentEle);
    }

    /**
     * Sets the enabled state to DropDownBase.
     *
     * @returns {void}
     */
    protected setEnabled(): void {
        this.element.setAttribute('aria-disabled', (this.enabled) ? 'false' : 'true');
    }

    protected setOldText(text: string): void {
        this.text = text;
    }

    protected setOldValue(value: string | number | boolean): void {
        this.value = value;
    }

    protected refreshPopup(): void {
        if (!isNullOrUndefined(this.popupObj) && document.body.contains(this.popupObj.element) &&
            ((this.allowFiltering && !(Browser.isDevice && this.isFilterLayout())) || this.getModuleName() === 'autocomplete')) {
            removeClass([this.popupObj.element], 'e-popup-close');
            this.popupObj.refreshPosition(this.inputWrapper.container);
            this.popupObj.resolveCollision();
        }
    }
    protected checkData(newProp?: DropDownListModel): void {
        if (newProp.dataSource && !isNullOrUndefined(Object.keys(newProp.dataSource)) && this.itemTemplate && this.allowFiltering &&
            !(this.isListSearched && (newProp.dataSource instanceof DataManager))) {
            this.list = null;
            this.actionCompleteData = { ulElement: null, list: null, isUpdated: false };
        }
        this.isListSearched = false;
        const isChangeValue: boolean = Object.keys(newProp).indexOf('value') !== -1 && isNullOrUndefined(newProp.value);
        const isChangeText: boolean = Object.keys(newProp).indexOf('text') !== -1 && isNullOrUndefined(newProp.text);
        if (this.getModuleName() !== 'autocomplete' && this.allowFiltering && (isChangeValue || isChangeText)) {
            this.itemData = null;
        }
        if (this.allowFiltering && newProp.dataSource && !isNullOrUndefined(Object.keys(newProp.dataSource))) {
            this.actionCompleteData = { ulElement: null, list: null, isUpdated: false };
            this.actionData = this.actionCompleteData;
            this.itemData = null;
        } else if (this.allowFiltering && newProp.query && !isNullOrUndefined(Object.keys(newProp.query))) {
            this.actionCompleteData = this.getModuleName() === 'combobox' ?
                { ulElement: null, list: null, isUpdated: false } : this.actionCompleteData;
            this.actionData = this.actionCompleteData;
        }
    }
    protected updateDataSource(props?: DropDownListModel): void {
        if (this.inputElement.value !== '' || (!isNullOrUndefined(props) && (isNullOrUndefined(props.dataSource)
            || (!(props.dataSource instanceof DataManager) && props.dataSource.length === 0)))) {
            this.clearAll(null, props);
        }
        if ((this.fields.groupBy && props.fields) && !this.isGroupChecking && this.list) {
            EventHandler.remove(this.list, 'scroll', this.setFloatingHeader);
            EventHandler.add(this.list, 'scroll', this.setFloatingHeader, this);
        }
        if (!(!isNullOrUndefined(props) && (isNullOrUndefined(props.dataSource)
            || (!(props.dataSource instanceof DataManager) && props.dataSource.length === 0))) || !(props.dataSource === [])) {
            this.typedString = '';
            this.resetList(this.dataSource);
        }
        if (!this.isCustomFilter && !this.isFilterFocus && document.activeElement !== this.filterInput) {
            this.checkCustomValue();
        }
    }
    protected checkCustomValue(): void {
        this.itemData = this.getDataByValue(this.value);
        const dataItem: { [key: string]: string } = this.getItemData();
        this.setProperties({ 'text': dataItem.text, 'value': dataItem.value });
    }
    private updateInputFields(): void {
        if (this.getModuleName() === 'dropdownlist') {
            Input.setValue(this.text, this.inputElement, this.floatLabelType, this.showClearButton);
        }
    }
    /**
     * Dynamically change the value of properties.
     *
     * @private
     * @param {DropDownListModel} newProp - Returns the dynamic property value of the component.
     * @param {DropDownListModel} oldProp - Returns the previous previous value of the component.
     * @returns {void}
     */
    public onPropertyChanged(newProp: DropDownListModel, oldProp: DropDownListModel): void {
        if (this.getModuleName() === 'dropdownlist') {
            this.checkData(newProp);
            this.setUpdateInitial(['fields', 'query', 'dataSource'], newProp as { [key: string]: string });
        }
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
                case 'query':
                case 'dataSource': 
                    this.getSkeletonCount();
                    this.checkAndResetCache();
                    break;
                case 'htmlAttributes': this.setHTMLAttributes();
                    break;
                case 'width': this.setEleWidth(newProp.width); Input.calculateWidth(this.inputElement, this.inputWrapper.container); break;
                case 'placeholder': Input.setPlaceholder(newProp.placeholder, this.inputElement as HTMLInputElement); break;
                case 'filterBarPlaceholder':
                    if (this.filterInput) {
                        Input.setPlaceholder(newProp.filterBarPlaceholder, this.filterInput as HTMLInputElement);
                    }
                    break;
                case 'readonly':
                    if (this.getModuleName() !== 'dropdownlist') {
                        Input.setReadonly(newProp.readonly, this.inputElement as HTMLInputElement);
                    }
                    this.setReadOnly();
                    break;
                case 'cssClass': this.setCssClass(newProp.cssClass, oldProp.cssClass); Input.calculateWidth(this.inputElement, this.inputWrapper.container); break;
                case 'enableRtl': this.setEnableRtl(); break;
                case 'enabled': this.setEnable(); break;
                case 'text': if (newProp.text === null) {
                    this.clearAll(); break;
                }
                    if (!this.list) {
                        if (this.dataSource instanceof DataManager) {
                            this.initRemoteRender = true;
                        }
                        this.renderList();
                    }
                    if (!this.initRemoteRender) {
                        const li: Element = this.getElementByText(newProp.text);
                        if (!this.checkValidLi(li)) {
                            if (this.liCollections && this.liCollections.length === 100 &&
                                this.getModuleName() === 'autocomplete' && this.listData.length > 100) {
                                this.setSelectionData(newProp.text, oldProp.text, 'text');
                            } else if (newProp.text && this.dataSource instanceof DataManager) {
                                const listLength: number = this.getItems().length;
                                const checkField: string = isNullOrUndefined(this.fields.text) ? this.fields.value : this.fields.text;
                                this.typedString = '';
                                this.dataSource.executeQuery(this.getQuery(this.query).where(new Predicate(checkField, 'equal', newProp.text)))
                                    .then((e: Object) => {
                                        if ((e as ResultData).result.length > 0) {
                                            this.addItem((e as ResultData).result, listLength);
                                            this.updateValues();
                                        } else {
                                            this.setOldText(oldProp.text);
                                        }
                                    });
                            } else if (this.getModuleName() === 'autocomplete') {
                                this.setInputValue(newProp, oldProp);
                            } else {
                                this.setOldText(oldProp.text);
                            }
                        }
                        this.updateInputFields();
                    }
                    break;
                case 'value': if (newProp.value === null) {
                    this.clearAll(); break;
                }
                    this.notify('beforeValueChange', { newProp: newProp }); // gird component value type change
                    if (!this.list) {
                        if (this.dataSource instanceof DataManager) {
                            this.initRemoteRender = true;
                        }
                        this.renderList();
                    }
                    if (!this.initRemoteRender) {
                        const item: Element = this.getElementByValue(newProp.value);
                        if (!this.checkValidLi(item)) {
                            if (this.liCollections && this.liCollections.length === 100 &&
                                this.getModuleName() === 'autocomplete' && this.listData.length > 100) {
                                this.setSelectionData(newProp.value, oldProp.value, 'value');
                            } else if (newProp.value && this.dataSource instanceof DataManager) {
                                const listLength: number = this.getItems().length;
                                const checkField: string = isNullOrUndefined(this.fields.value) ? this.fields.text : this.fields.value;
                                this.typedString = '';
                                this.dataSource.executeQuery(this.getQuery(this.query).where(new Predicate(checkField, 'equal', newProp.value)))
                                    .then((e: Object) => {
                                        if ((e as ResultData).result.length > 0) {
                                            this.addItem((e as ResultData).result, listLength);
                                            this.updateValues();
                                        } else {
                                            this.setOldValue(oldProp.value);
                                        }
                                    });
                            } else if (this.getModuleName() === 'autocomplete') {
                                this.setInputValue(newProp, oldProp);
                            } else {
                                this.setOldValue(oldProp.value);
                            }
                        }
                        this.updateInputFields();
                        this.preventChange = this.isAngular && this.preventChange ? !this.preventChange : this.preventChange;
                    }
                    break;
                case 'index': if (newProp.index === null) {
                    this.clearAll(); break;
                }
                    if (!this.list) {
                        if (this.dataSource instanceof DataManager) {
                            this.initRemoteRender = true;
                        }
                        this.renderList();
                    }
                    if (!this.initRemoteRender && this.liCollections) {
                        const element: Element = this.liCollections[newProp.index] as Element;
                        if (!this.checkValidLi(element)) {
                            if (this.liCollections && this.liCollections.length === 100 &&
                                this.getModuleName() === 'autocomplete' && this.listData.length > 100) {
                                this.setSelectionData(newProp.index, oldProp.index, 'index');
                            } else {
                                this.index = oldProp.index;
                            }
                        }
                        this.updateInputFields();
                    }
                    break;
                case 'footerTemplate': if (this.popupObj) {
                    this.setFooterTemplate(this.popupObj.element);
                } break;
                case 'headerTemplate': if (this.popupObj) {
                    this.setHeaderTemplate(this.popupObj.element);
                } break;
                case 'valueTemplate':
                    if (!isNullOrUndefined(this.itemData) && this.valueTemplate !== null) {
                        this.setValueTemplate();
                    } break;
                case 'allowFiltering':
                    if (this.allowFiltering) {
                        this.actionCompleteData = {
                            ulElement: this.ulElement,
                            list: this.listData as { [key: string]: Object }[], isUpdated: true
                        };
                        this.actionData = this.actionCompleteData;
                        this.updateSelectElementData(this.allowFiltering);
                    }
                    break;
                case 'floatLabelType':
                    Input.removeFloating(this.inputWrapper);
                    Input.addFloating(this.inputElement, newProp.floatLabelType, this.placeholder, this.createElement);
                    if (!isNullOrUndefined(this.inputWrapper.buttons[0]) && this.inputWrapper.container.getElementsByClassName('e-float-text-overflow')[0] && this.floatLabelType !== 'Never') {
                        this.inputWrapper.container.getElementsByClassName('e-float-text-overflow')[0].classList.add('e-icon');
                    }
                    break;
                case 'showClearButton':
                    if(!this.inputWrapper.clearButton){
                        Input.setClearButton(newProp.showClearButton, this.inputElement, this.inputWrapper, null, this.createElement);
                        this.bindClearEvent();
                    }
                    break;
                default: {
                    // eslint-disable-next-line max-len
                    const ddlProps: { [key: string]: Object } = this.getPropObject(prop, <{ [key: string]: string }>newProp, <{ [key: string]: string }>oldProp);
                    super.onPropertyChanged(ddlProps.newProperty, ddlProps.oldProperty);
                }
                    break;
            }
        }
    }

    private checkValidLi(element: Element): boolean {
        if (this.isValidLI(element)) {
            this.setSelection(element, null);
            return true;
        }
        return false;
    }

    private setSelectionData(
        newProp: number | string | boolean,
        oldProp: number | string | boolean,
        prop: string
    ): void {
        let li: Element;
        this.updateListValues = (): void => {
            if (prop === 'text') {
                li = this.getElementByText(newProp as string);
                if (!this.checkValidLi(li)) {
                    this.setOldText(oldProp as string);
                }
            } else if (prop === 'value') {
                li = this.getElementByValue(newProp);
                if (!this.checkValidLi(li)) {
                    this.setOldValue(oldProp);
                }
            } else if (prop === 'index') {
                li = this.liCollections[newProp as number] as Element;
                if (!this.checkValidLi(li)) {
                    this.index = oldProp as number;
                }
            }
        };
    }

    protected setReadOnly(): void {
        if (this.readonly) {
            addClass([this.inputWrapper.container], ['e-readonly']);
        } else {
            removeClass([this.inputWrapper.container], ['e-readonly']);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected setInputValue(newProp?: any, oldProp?: any): void {
    }

    private setCssClass(newClass: string, oldClass: string): void {
        if (!isNullOrUndefined(oldClass)) {
            oldClass = (oldClass.replace(/\s+/g, ' ')).trim();
        }
        if (!isNullOrUndefined(newClass)) {
            newClass = (newClass.replace(/\s+/g, ' ')).trim();
        }
        Input.setCssClass(newClass, [this.inputWrapper.container], oldClass);
        if (this.popupObj) {
            Input.setCssClass(newClass, [this.popupObj.element], oldClass);
        }
    }
    /**
     * Return the module name of this component.
     *
     * @private
     * @returns {string} Return the module name of this component.
     */
    public getModuleName(): string {
        return 'dropdownlist';
    }
    /* eslint-disable valid-jsdoc, jsdoc/require-param */
    /**
     * Opens the popup that displays the list of items.
     *
     * @returns {void}
     */
    public showPopup(e?: MouseEvent | KeyboardEventArgs | TouchEvent): void {
        /* eslint-enable valid-jsdoc, jsdoc/require-param */
        if (!this.enabled) {
            return;
        }
        if((this as any).isReact && this.getModuleName() === 'combobox' && this.itemTemplate && this.isCustomFilter && this.isAddNewItemTemplate){
            this.renderList();
            this.isAddNewItemTemplate = false;
        }
        if (this.isFiltering() && this.dataSource instanceof DataManager && (this.actionData.list !== this.actionCompleteData.list) &&
            this.actionData.list && this.actionData.ulElement) {
            this.actionCompleteData = this.actionData;
            this.onActionComplete(this.actionCompleteData.ulElement, this.actionCompleteData.list, null, true);
        }
        if (this.beforePopupOpen) {
            this.refreshPopup();
            return;
        }
        this.beforePopupOpen = true;
        if (this.isFiltering() && !this.isActive && this.actionCompleteData.list && this.actionCompleteData.list[0]) {
            this.isActive = true;
            this.onActionComplete(this.actionCompleteData.ulElement, this.actionCompleteData.list, null, true);
        } else if (isNullOrUndefined(this.list) || !isUndefined(this.list) && (this.list.classList.contains(dropDownBaseClasses.noData) ||
            this.list.querySelectorAll('.' + dropDownBaseClasses.li).length <= 0)) {
            this.renderList(e);
        }
        if (this.enableVirtualization && this.listData && this.listData.length) {
            if (!isNullOrUndefined(this.value) && (this.getModuleName() === 'dropdownlist' || this.getModuleName() === 'combobox')) {
                this.removeHover();
            }
            if (!this.beforePopupOpen) {
                this.notify("setCurrentViewDataAsync", {
                    module: "VirtualScroll",
                });
            }
        }
        this.invokeRenderPopup(e);
        if (this.enableVirtualization && !this.allowFiltering && this.selectedValueInfo != null && this.selectedValueInfo.startIndex > 0 && this.value != null)
        {
            this.notify("dataProcessAsync", {
                module: "VirtualScroll",
                isOpen: true,
            });
        }
    }

    private invokeRenderPopup(e?: MouseEvent | KeyboardEventArgs | TouchEvent): void {
        if (Browser.isDevice && this.isFilterLayout()) {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const proxy: this = this;
            window.onpopstate = () => {
                proxy.hidePopup();
            };
            history.pushState({}, '');
        }

        if (!isNullOrUndefined(this.list) && (!isNullOrUndefined(this.list.children[0]) ||
            this.list.classList.contains(dropDownBaseClasses.noData))) {
            this.renderPopup(e);
        }
    }

    protected renderHightSearch(): void {
        // update high light search
    }
    /* eslint-disable valid-jsdoc, jsdoc/require-param */
    /**
     * Hides the popup if it is in an open state.
     *
     * @returns {void}
     */
    public hidePopup(e?: MouseEvent | KeyboardEventArgs | TouchEvent): void {
        /* eslint-enable valid-jsdoc, jsdoc/require-param */
        if (this.isEscapeKey && this.getModuleName() === 'dropdownlist') {
            if (!isNullOrUndefined(this.inputElement)) {
                Input.setValue(this.text, this.inputElement, this.floatLabelType, this.showClearButton);
            }
            this.isEscapeKey = false;
            if (!isNullOrUndefined(this.index)) {
                const element: HTMLElement = this.findListElement(this.ulElement, 'li', 'data-value', this.value);
                this.selectedLI = this.liCollections[this.index] || element;
                if (this.selectedLI) {
                    this.updateSelectedItem(this.selectedLI, null, true);
                    if (this.valueTemplate && this.itemData !== null) {
                        this.setValueTemplate();
                    }
                }
            } else {
                this.resetSelection();
            }
        }
        this.closePopup(0, e);
        const dataItem: { [key: string]: string } = this.getItemData();
        const isSelectVal: boolean = !isNullOrUndefined(this.selectedLI);
        if (this.inputElement && this.inputElement.value.trim() === '' && !this.isInteracted && (this.isSelectCustom ||
            isSelectVal && this.inputElement.value !== dataItem.text)) {
            this.isSelectCustom = false;
            this.clearAll(e);
        }
    }
    /* eslint-disable valid-jsdoc, jsdoc/require-param */
    /**
     * Sets the focus on the component for interaction.
     *
     * @returns {void}
     */
    public focusIn(e?: FocusEvent | MouseEvent | KeyboardEvent | TouchEvent): void {
        if (!this.enabled) {
            return;
        }
        if (this.targetElement().classList.contains(dropDownListClasses.disable)) {
            return;
        }
        let isFocused: boolean = false;
        if (this.preventFocus && Browser.isDevice) {
            this.inputWrapper.container.tabIndex = 1;
            this.inputWrapper.container.focus();
            this.preventFocus = false;
            isFocused = true;
        }
        if (!isFocused) {
            this.targetElement().focus();
        }
        addClass([this.inputWrapper.container], [dropDownListClasses.inputFocus]);
        this.onFocus(e);
        if (this.floatLabelType === 'Auto') {
            Input.calculateWidth(this.inputElement, this.inputWrapper.container);
        }
    }
    /**
     * Moves the focus from the component if the component is already focused.
     *
     * @returns {void}
     */
    public focusOut(e?: MouseEvent | KeyboardEventArgs): void {
        /* eslint-enable valid-jsdoc, jsdoc/require-param */
        if (!this.enabled) {
            return;
        }
        if (!this.enableVirtualization && this.getModuleName() === 'combobox') {
            this.isTyped = true;
        }
        this.hidePopup(e);
        if (this.targetElement()) {
            this.targetElement().blur();
        }
        removeClass([this.inputWrapper.container], [dropDownListClasses.inputFocus]);
        if (this.floatLabelType === 'Auto' && this.inputElement.value === '') {
            Input.calculateWidth(this.inputElement, this.inputWrapper.container);
        }
    }
    /**
     * Removes the component from the DOM and detaches all its related event handlers. Also it removes the attributes and classes.
     *
     * @method destroy
     * @returns {void}
     */
    public destroy(): void {
        this.isActive = false;
        resetIncrementalSearchValues(this.element.id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((this as any).isReact) {
            this.clearTemplate();
        }
        this.hidePopup();
        this.unWireEvent();
        if (this.list) {
            this.unWireListEvents();
        }
        if (this.element && !this.element.classList.contains('e-' + this.getModuleName())) {
            return;
        }
        if (this.inputElement) {
            const attrArray: string[] = ['readonly', 'aria-disabled', 'placeholder', 'aria-labelledby',
                'aria-expanded', 'autocomplete', 'aria-readonly', 'autocapitalize',
                'spellcheck', 'aria-autocomplete', 'aria-live', 'aria-describedby', 'aria-label'];
            for (let i: number = 0; i < attrArray.length; i++) {
                this.inputElement.removeAttribute(attrArray[i as number]);
            }
            this.inputElement.setAttribute('tabindex', this.tabIndex);
            this.inputElement.classList.remove('e-input');
            Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
        }
        this.element.style.display = 'block';
        if (this.inputWrapper.container.parentElement.tagName === this.getNgDirective()) {
            detach(this.inputWrapper.container);
        } else {
            this.inputWrapper.container.parentElement.insertBefore(this.element, this.inputWrapper.container);
            detach(this.inputWrapper.container);
        }
        this.hiddenElement = null;
        this.inputWrapper = null;
        this.keyboardModule = null;
        this.ulElement = null;
        this.list = null;
        this.popupObj = null;
        this.popupContentElement = null;
        this.rippleFun = null;
        this.selectedLI = null;
        this.liCollections = null;
        this.item = null;
        this.inputWrapper = null;
        this.footer = null;
        this.header = null;
        this.previousSelectedLI = null;
        this.valueTempElement = null;
        this.actionData.ulElement = null;
        if (this.inputElement && !isNullOrUndefined(this.inputElement.onchange)) {
            this.inputElement.onchange = null;
        }
        if (this.isAngular) {
            this.inputElement = null;
        }
        super.destroy();
    }
    /* eslint-disable valid-jsdoc, jsdoc/require-returns-description */
    /**
     * Gets all the list items bound on this component.
     *
     * @returns {Element[]}
     */
    public getItems(): Element[] {
        if (!this.list) {
            if (this.dataSource instanceof DataManager) {
                this.initRemoteRender = true;
            }
            this.renderList();
        }
        return this.ulElement ? super.getItems() : [];
    }
    /**
     * Gets the data Object that matches the given value.
     *
     * @param { string | number } value - Specifies the value of the list item.
     * @returns {Object}
     */
    public getDataByValue(value: string | number | boolean)
        : { [key: string]: Object } | string | number | boolean {
        return super.getDataByValue(value);
    }
    /* eslint-enable valid-jsdoc, jsdoc/require-returns-description */
    /**
     * Allows you to clear the selected values from the component.
     *
     * @returns {void}
     */
    public clear(): void {
        this.value = null;
    }
}
type ScrollArg = { direction: string, sentinel: SentinelType, offset: Offsets, focusElement: HTMLElement };

export interface DropDownListClassList {
    root: string
    hover: string
    selected: string
    rtl: string
    base: string
    disable: string
    input: string
    inputFocus: string
    li: string
    icon: string
    iconAnimation: string
    value: string
    focus: string
    device: string
    backIcon: string
    filterBarClearIcon: string
    filterInput: string
    filterParent: string
    mobileFilter: string
    footer: string
    header: string
    clearIcon: string
    clearIconHide: string
    popupFullScreen: string
    disableIcon: string
    hiddenElement: string
    content: string
    virtualList: string
}
interface ActionCompleteData {
    ulElement?: HTMLElement
    list?: { [key: string]: Object }[]
    isUpdated: boolean
}