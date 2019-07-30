/// <reference path='../drop-down-base/drop-down-base-model.d.ts'/>
import { DropDownBase, SelectEventArgs, dropDownBaseClasses, PopupEventArgs, FilteringEventArgs } from '../drop-down-base/drop-down-base';
import { ResultData, FocusEventArgs, BeforeOpenEventArgs } from '../drop-down-base/drop-down-base';
import { FieldSettingsModel } from '../drop-down-base/drop-down-base-model';
import { Popup, createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { IInput, FloatLabelType } from '@syncfusion/ej2-inputs';
import { attributes, setValue } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, extend } from '@syncfusion/ej2-base';
import { EventHandler, Property, Event, compile, L10n, EmitType, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { Animation, AnimationModel, Browser, prepend } from '@syncfusion/ej2-base';
import { MultiSelectModel } from '../multi-select';
import { Search } from '../common/incremental-search';
import { append, addClass, removeClass, setStyleAttribute, closest, detach, remove, select } from '@syncfusion/ej2-base';
import { getUniqueID, formatUnit, isNullOrUndefined, isUndefined, ModuleDeclaration } from '@syncfusion/ej2-base';
/* tslint:disable */
import { DataManager, Query, Predicate } from '@syncfusion/ej2-data';
import { SortOrder } from '@syncfusion/ej2-lists';
import { CheckBoxSelection } from './checkbox-selection';
import { createFloatLabel, removeFloating, floatLabelFocus, floatLabelBlur } from './float-label';
import { IMulitSelect } from './interface';
export interface RemoveEventArgs extends SelectEventArgs { }
/* tslint:enable */
const FOCUS: string = 'e-input-focus';
const DISABLED: string = 'e-disabled';
const OVER_ALL_WRAPPER: string = 'e-multiselect e-input-group';
const ELEMENT_WRAPPER: string = 'e-multi-select-wrapper';
const ELEMENT_MOBILE_WRAPPER: string = 'e-mob-wrapper';
const HIDE_LIST: string = 'e-hide-listitem';
const DELIMITER_VIEW: string = 'e-delim-view';
const CHIP_WRAPPER: string = 'e-chips-collection';
const CHIP: string = 'e-chips';
const CHIP_CONTENT: string = 'e-chipcontent';
const CHIP_CLOSE: string = 'e-chips-close';
const CHIP_SELECTED: string = 'e-chip-selected';
const SEARCHBOX_WRAPPER: string = 'e-searcher';
const DELIMITER_VIEW_WRAPPER: string = 'e-delimiter';
const ZERO_SIZE: string = 'e-zero-size';
const REMAIN_WRAPPER: string = 'e-remain';
const CLOSEICON_CLASS: string = 'e-chips-close e-close-hooker';
const DELIMITER_WRAPPER: string = 'e-delim-values';
const POPUP_WRAPPER: string = 'e-ddl e-popup e-multi-select-list-wrapper';
const INPUT_ELEMENT: string = 'e-dropdownbase';
const RTL_CLASS: string = 'e-rtl';
const CLOSE_ICON_HIDE: string = 'e-close-icon-hide';
const MOBILE_CHIP: string = 'e-mob-chip';
const FOOTER: string = 'e-ddl-footer';
const HEADER: string = 'e-ddl-header';
const DISABLE_ICON: string = 'e-ddl-disable-icon';
const SPINNER_CLASS: string = 'e-ms-spinner-icon';
const HIDDEN_ELEMENT: string = 'e-multi-hidden';
const destroy: string = 'destroy';
const dropdownIcon: string = 'e-input-group-icon e-ddl-icon';
const iconAnimation: string = 'e-icon-anim';
const TOTAL_COUNT_WRAPPER: string = 'e-delim-total';
const BOX_ELEMENT: string = 'e-multiselect-box';
const FILTERPARENT: string = 'e-filter-parent';
/**
 * The Multiselect allows the user to pick a more than one value from list of predefined values.
 * ```html
 * <select id="list">
 *      <option value='1'>Badminton</option>
 *      <option value='2'>Basketball</option>
 *      <option value='3'>Cricket</option>
 *      <option value='4'>Football</option>
 *      <option value='5'>Tennis</option>
 * </select>
 * ```
 * ```typescript
 * <script>
 *   var multiselectObj = new Multiselect();
 *   multiselectObj.appendTo("#list");
 * </script>
 * ```
 */

@NotifyPropertyChanges
export class MultiSelect extends DropDownBase implements IInput {
    private spinnerElement: HTMLElement;
    private selectAllAction: Function;
    private setInitialValue: Function;
    private setDynValue: boolean;
    private listCurrentOptions: { [key: string]: Object };
    private targetInputElement: HTMLInputElement | string;
    private selectAllHeight?: number;
    private searchBoxHeight?: number;
    private mobFilter?: boolean;
    private isFiltered: boolean;
    private isFirstClick: boolean;
    private focused: boolean;
    private initial: boolean;
    private backCommand: boolean;
    private keyAction: boolean;

    /**
     * Specifies a Boolean value that indicates the whether the grouped list items are 
     * allowed to check by checking the group header in checkbox mode.
     * By default, there is no checkbox provided for group headers.
     * This property allows you to render checkbox for group headers and to select 
     * all the grouped items at once
     * @default false
     */
    @Property(false)
    public enableGroupCheckBox: boolean;


    /**
     * Sets the CSS classes to root element of this component which helps to customize the
     * complete styles.
     * @default null
     */
    @Property(null)
    public cssClass: string;
    /**
     * Gets or sets the width of the component. By default, it sizes based on its parent.
     * container dimension.
     * @default '100%'
     * @aspType string
     * @blazorType string
     */
    @Property('100%')
    public width: string | number;
    /**
     * Gets or sets the height of the popup list. By default it renders based on its list item.
     * > For more details about the popup configuration refer to 
     * [`Popup Configuration`](../../multi-select/getting-started/#configure-the-popup-list) documentation.
     * 
     * @default '300px'
     * @aspType string
     * @blazorType string
     */
    @Property('300px')
    public popupHeight: string | number;
    /**
     * Gets or sets the width of the popup list and percentage values has calculated based on input width.
     * > For more details about the popup configuration refer to 
     * [`Popup Configuration`](../../multi-select/getting-started/#configure-the-popup-list) documentation.
     * 
     * @default '100%'
     * @aspType string
     * @blazorType string
     */
    @Property('100%')
    public popupWidth: string | number;
    /**
     * Gets or sets the placeholder in the component to display the given information
     * in input when no item selected. 
     * @default null
     */
    @Property(null)
    public placeholder: string;
    /**
     * Accepts the value to be displayed as a watermark text on the filter bar. 
     * @default null
     */
    @Property(null)
    public filterBarPlaceholder: string;
    /**
     * Gets or sets the additional attribute to `HtmlAttributes` property in MultiSelect,
     * which helps to add attribute like title, name etc, input should be key value pair.
     * 
     * {% codeBlock src="multiselect/html-attributes-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="multiselect/html-attributes-api/index.html" %}{% endcodeBlock %}
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string; };
    /**
     * Accepts the template design and assigns it to the selected list item in the input element of the component.
     * For more details about the available template options refer to 
     * [`Template`](../../multi-select/templates) documentation.
     * 
     * We have built-in `template engine`
     * which provides options to compile template string into a executable function. 
     * For EX: We have expression evolution as like ES6 expression string literals.
     * @default null
     */
    @Property(null)
    public valueTemplate: string;
    /**
     * Accepts the template design and assigns it to the header container of the popup list.
     * > For more details about the available template options refer to [`Template`](../../multi-select/templates) documentation.
     * 
     * @default null
     */
    @Property(null)
    public headerTemplate: string;
    /**
     * Accepts the template design and assigns it to the footer container of the popup list.
     * > For more details about the available template options refer to [`Template`](../../multi-select/templates) documentation.
     * 
     * @default null
     */
    @Property(null)
    public footerTemplate: string;
    /**
     * Accepts the template design and assigns it to each list item present in the popup.
     * > For more details about the available template options refer to [`Template`](../../multi-select/templates) documentation.
     * 
     * We have built-in `template engine`
     * which provides options to compile template string into a executable function. 
     * For EX: We have expression evolution as like ES6 expression string literals.
     * @default null
     */
    @Property(null)
    public itemTemplate: string;
    /**
     * To enable the filtering option in this component. 
     * Filter action performs when type in search box and collect the matched item through `filtering` event.
     * If searching character does not match, `noRecordsTemplate` property value will be shown.
     * 
     * {% codeBlock src="multiselect/allow-filtering-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="multiselect/allow-filtering-api/index.html" %}{% endcodeBlock %}
     * 
     * @default null
     */
    @Property(null)
    public allowFiltering: boolean;
    /**
     * Allows user to add a 
     * [`custom value`](../../multi-select/custom-value), the value which is not present in the suggestion list.
     * @default false
     */
    @Property(false)
    public allowCustomValue: boolean;
    /**
     * Enables close icon with the each selected item.
     * @default true
     */
    @Property(true)
    public showClearButton: boolean;
    /**
     * Sets limitation to the value selection.
     * based on the limitation, list selection will be prevented.
     * @default 1000
     * @blazorType int
     */
    @Property(1000)
    public maximumSelectionLength: number;
    /**
     * Gets or sets the `readonly` to input or not. Once enabled, just you can copy or highlight 
     * the text however tab key action will perform.
     * 
     * @default false
     */
    @Property(false)
    public readonly: boolean;
    /**
     * Selects the list item which maps the data `text` field in the component.
     * @default null
     */
    @Property(null)
    public text: string;
    /**
     * Selects the list item which maps the data `value` field in the component.
     * @default null
     * @isGenericType true
     */
    @Property(null)
    public value: number[] | string[] | boolean[];
    /**
     * Hides the selected item from the list item.
     * @default true
     */
    @Property(true)
    public hideSelectedItem: boolean;
    /**
     * Based on the property, when item get select popup visibility state will changed.
     * @default true
     */
    @Property(true)
    public closePopupOnSelect: boolean;
    /**
     * configures visibility mode for component interaction.
     * 
     *   - `Box` - selected items will be visualized in chip.
     * 
     *   - `Delimiter` - selected items will be visualized in text content.
     * 
     *   - `Default` - on `focus in` component will act in `box` mode.
     *    on `blur` component will act in `delimiter` mode.
     * 
     *   - `CheckBox` - The 'checkbox' will be visualized in list item.
     * 
     * {% codeBlock src="multiselect/visual-mode-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="multiselect/visual-mode-api/index.html" %}{% endcodeBlock %}
     * 
     * @default Default
     */
    @Property('Default')
    public mode: visualMode;
    /**
     * Sets the delimiter character for 'default' and 'delimiter' visibility modes.
     * @default ','
     */
    @Property(',')
    public delimiterChar: string;
    /**
     * Sets [`case sensitive`](../../multi-select/filtering/#case-sensitive-filtering)
     * option for filter operation.
     * @default true
     */
    @Property(true)
    public ignoreCase: boolean;
    /**
     * Allows you to either show or hide the DropDown button on the component
     * 
     * @default false
     */
    @Property(false)
    public showDropDownIcon: boolean;
    /**
     * Specifies whether to display the floating label above the input element.
     * Possible values are:
     * * Never: The label will never float in the input when the placeholder is available.
     * * Always: The floating label will always float above the input.
     * * Auto: The floating label will float above the input after focusing or entering a value in the input.
     * 
     * @default Syncfusion.EJ2.Inputs.FloatLabelType.Never
     * @aspType Syncfusion.EJ2.Inputs.FloatLabelType
     * @isEnumeration true
     * @blazorType Syncfusion.EJ2.Inputs.FloatLabelType
     */
    @Property('Never')
    public floatLabelType: FloatLabelType;
    /**
     * Allows you to either show or hide the selectAll option on the component.
     * 
     * @default false
     */
    @Property(false)
    public showSelectAll: boolean;
    /**
     * Specifies the selectAllText to be displayed on the component.
     * 
     * @default 'select All'
     */
    @Property('Select All')
    public selectAllText: string;
    /**
     * Specifies the UnSelectAllText to be displayed on the component.
     * 
     * @default 'select All'
     */
    @Property('Unselect All')
    public unSelectAllText: string;
    /**
     * Reorder the selected items in popup visibility state.
     * 
     * @default true
     */
    @Property(true)
    public enableSelectionOrder: boolean;
    /**
     * Whether to automatically open the popup when the control is clicked.
     * @default true
     */
    @Property(true)
    public openOnClick: boolean;
    /**
     * Fires each time when selection changes happened in list items after model and input value get affected.
     * @event
     * @blazorProperty 'ValueChange'
     */
    @Event()
    public change: EmitType<MultiSelectChangeEventArgs>;
    /**
     * Fires before the selected item removed from the widget.
     * @event
     * @blazorProperty 'OnValueRemove'
     */
    @Event()
    public removing: EmitType<RemoveEventArgs>;
    /**
     * Fires after the selected item removed from the widget.
     * @event
     * @blazorProperty 'ValueRemoved'
     */
    @Event()
    public removed: EmitType<RemoveEventArgs>;
    /**
     * Fires after select all process completion.
     * @event
     * @blazorProperty 'SelectedAll'
     */
    @Event()
    public selectedAll: EmitType<ISelectAllEventArgs>;
    /**
     * Fires when popup opens before animation.
     * @event
     * @blazorProperty 'OnOpen'
     * @blazorType BeforeOpenEventArgs
     */
    @Event()
    public beforeOpen: EmitType<Object>;
    /**
     * Fires when popup opens after animation completion.
     * @event
     * @blazorProperty 'Opened'
     */
    @Event()
    public open: EmitType<PopupEventArgs>;
    /**
     * Fires when popup close after animation completion.
     * @event
     * @blazorProperty 'OnClose'
     */
    @Event()
    public close: EmitType<PopupEventArgs>;
    /**
     * Event triggers when the input get focus-out.
     * @event
     */
    @Event()
    public blur: EmitType<Object>;
    /**
     * Event triggers when the input get focused.
     * @event
     */
    @Event()
    public focus: EmitType<Object>;
    /**
     * Event triggers when the chip selection.
     * @event
     * @blazorProperty 'ChipSelected'
     */
    @Event()
    public chipSelection: EmitType<Object>;
    /**
     * Triggers event,when user types a text in search box.
     * > For more details about filtering, refer to [`Filtering`](../../multi-select/filtering) documentation.
     * 
     * @event
     * @blazorProperty 'Filtering'
     */
    @Event()
    public filtering: EmitType<FilteringEventArgs>;
    /**
     * Fires before set the selected item as chip in the component.
     * > For more details about chip customization refer [`Chip Customization`](../../multi-select/chip-customization)
     * 
     * @event
     * @blazorProperty 'OnChipTag'
     */
    @Event()
    public tagging: EmitType<TaggingEventArgs>;
    /**
     * Triggers when the [`customValue`](../../multi-select/custom-value) is selected.
     * @event
     * @blazorProperty 'CustomValueSpecifier'
     */
    @Event()
    public customValueSelection: EmitType<CustomValueEventArgs>;
    /**
     * Constructor for creating the DropDownList widget.
     */
    constructor(option?: MultiSelectModel, element?: string | HTMLElement) {
        super(option, element);
    };
    private isValidKey: boolean = false;
    private mainList: HTMLElement;
    public ulElement: HTMLElement;
    private mainData: { [key: string]: Object }[] | string[] | number[] | boolean[];
    private mainListCollection: HTMLElement[];
    private customValueFlag: boolean;
    private inputElement: HTMLInputElement;
    private componentWrapper: HTMLDivElement;
    private overAllWrapper: HTMLDivElement;
    private searchWrapper: HTMLElement;
    private viewWrapper: HTMLElement;
    private chipCollectionWrapper: HTMLElement;
    private overAllClear: HTMLElement;
    private dropIcon: HTMLElement;
    private hiddenElement: HTMLSelectElement;
    private delimiterWrapper: HTMLElement;
    private popupObj: Popup;
    private inputFocus: boolean;
    private header: HTMLElement;
    private footer: HTMLElement;
    private initStatus: boolean;
    private popupWrapper: HTMLDivElement;
    private keyCode: number;
    private beforePopupOpen: boolean;
    private remoteCustomValue: boolean;
    private filterAction: boolean;
    private remoteFilterAction: boolean;
    private selectAllEventData: FieldSettingsModel[] = [];
    private selectAllEventEle: HTMLLIElement[] = [];
    private filterParent: HTMLElement;
    private removeIndex: number;
    private enableRTL(state: boolean): void {
        if (state) {
            this.overAllWrapper.classList.add(RTL_CLASS);
        } else {
            this.overAllWrapper.classList.remove(RTL_CLASS);
        }
        if (this.popupObj) {
            this.popupObj.enableRtl = state;
            this.popupObj.dataBind();
        }
    }

    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
        if (this.mode === 'CheckBox') {
            this.isGroupChecking = this.enableGroupCheckBox;
            if (this.enableGroupCheckBox) {
                let prevOnChange: boolean = this.isProtectedOnChange;
                this.isProtectedOnChange = true;
                this.enableSelectionOrder = false;
                this.isProtectedOnChange = prevOnChange;
            }
            this.allowCustomValue = false;
            this.hideSelectedItem = false;
            this.closePopupOnSelect = false;
            modules.push({
                member: 'CheckBoxSelection',
                args: [this]
            });
        }
        return modules;
    }
    private updateHTMLAttribute(): void {
        if (Object.keys(this.htmlAttributes).length) {
            for (let htmlAttr of Object.keys(this.htmlAttributes)) {
                switch (htmlAttr) {
                    case 'class':
                        this.overAllWrapper.classList.add(this.htmlAttributes[htmlAttr]);
                        this.popupWrapper.classList.add(this.htmlAttributes[htmlAttr]);
                        break;
                    case 'disabled':
                        this.enable(false);
                        break;
                    case 'placeholder':
                        if (!this.placeholder) {
                            this.inputElement.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                            this.setProperties({placeholder: this.inputElement.placeholder}, true);
                            this.refreshPlaceHolder();
                        }
                        break;
                    default:
                        let defaultAttr: string[] = ['id'];
                        let validateAttr: string[] = ['name', 'required', 'aria-required', 'form'];
                        let containerAttr: string[] = ['title', 'role', 'style', 'class'];
                        if (defaultAttr.indexOf(htmlAttr) > -1) {
                            this.element.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                        } else if (htmlAttr.indexOf('data') === 0 || validateAttr.indexOf(htmlAttr) > -1) {
                            this.hiddenElement.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                        } else if (containerAttr.indexOf(htmlAttr) > -1) {
                            this.overAllWrapper.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                        } else {
                            this.inputElement.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                        }
                        break;
                }
            }
        }
    }

    private updateReadonly(state: boolean): void {
        if (state || this.mode === 'CheckBox') {
            this.inputElement.setAttribute('readonly', 'true');
        } else {
            this.inputElement.removeAttribute('readonly');
        }
    }

    private updateClearButton(state: boolean): void {
        if (state) {
            if (this.overAllClear.parentNode) {
                this.overAllClear.style.display = '';
            } else {
                this.componentWrapper.appendChild(this.overAllClear);
            }
            this.componentWrapper.classList.remove(CLOSE_ICON_HIDE);
        } else {
            this.overAllClear.style.display = 'none';
            this.componentWrapper.classList.add(CLOSE_ICON_HIDE);
        }
    }
    private updateCssClass(): void {
        if (this.cssClass) {
            this.popupWrapper.classList.add(this.cssClass);
            this.overAllWrapper.classList.add(this.cssClass);
        }
    }
    private onPopupShown(): void {
        let listItems: NodeListOf<Element>;
        let mainListItems: NodeListOf<Element>;
        if (Browser.isDevice && (this.mode === 'CheckBox' && this.allowFiltering)) {
            let proxy: this = this;
            window.onpopstate = () => {
                proxy.hidePopup();
                proxy.inputElement.focus();
            };
            history.pushState({}, '');
        }
        let animModel: AnimationModel = { name: 'FadeIn', duration: 100 };
        let eventArgs: PopupEventArgs = { popup: this.popupObj, cancel: false, animation: animModel };
        this.trigger('open', eventArgs, (eventArgs: PopupEventArgs) => {
            if (!eventArgs.cancel) {
                this.focusAtFirstListItem();
                document.body.appendChild(this.popupObj.element);
                if (this.mode === 'CheckBox' || this.showDropDownIcon) {
                    addClass([this.overAllWrapper], [iconAnimation]);
                }
                this.refreshPopup();
                this.popupObj.show(eventArgs.animation, (this.zIndex === 1000) ? this.element : null);
                attributes(this.inputElement, { 'aria-expanded': 'true' });
                if (this.isFirstClick) {
                    this.loadTemplate();
                }
            }
        });
    }
    private updateListItems(listItems: NodeListOf<Element> , mainListItems: NodeListOf<Element>): void {
        for (let i: number = 0; i < listItems.length; i++) {
            this.findGroupStart(listItems[i] as HTMLElement);
            this.findGroupStart(mainListItems[i] as HTMLElement);
        }
    }
    private loadTemplate(): void {
        this.refreshListItems(null);
        if (this.mode === 'CheckBox') { this.removeFocus(); }
        this.notify('reOrder', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', e: this });

    }
    private setScrollPosition(): void {
        if (((!this.hideSelectedItem && this.mode !== 'CheckBox') || (this.mode === 'CheckBox' && !this.enableSelectionOrder)) &&
            (!isNullOrUndefined(this.value) && ( this.value.length > 0 ))) {
            let valueEle: HTMLElement = this.findListElement(
                (this.hideSelectedItem ? this.ulElement : this.list),
                'li',
                'data-value',
                this.value[this.value.length - 1]);
            if (!isNullOrUndefined(valueEle)) {
                this.scrollBottom(valueEle);
            }
        }
    }
    private focusAtFirstListItem(): void {
        if (this.ulElement && this.ulElement.querySelector('li.'
            + dropDownBaseClasses.li)) {
            let element: HTMLElement;
            if (this.mode === 'CheckBox') {
                this.removeFocus();
                return;
            } else {
                element = <HTMLElement>this.ulElement.querySelector('li.'
                    + dropDownBaseClasses.li + ':not(.'
                    + HIDE_LIST + ')');
            }
            if (element !== null) {
                this.removeFocus();
                this.addListFocus(element);
            }
        }
    }
    private focusAtLastListItem(data: string): void {
        let activeElement: { [key: string]: Element | number };
        if (data) {
            activeElement = Search(data, this.liCollections, 'StartsWith', this.ignoreCase);
        } else {
            if (this.value && this.value.length) {
                Search(<string>this.value[this.value.length - 1], this.liCollections, 'StartsWith', this.ignoreCase);
            } else {
                activeElement = null;
            }
        }
        if (activeElement && activeElement.item !== null) {
            this.addListFocus((<HTMLElement>activeElement.item));
            this.scrollBottom((<HTMLElement>activeElement.item), <number>activeElement.index);
        }
    }

    protected getAriaAttributes(): { [key: string]: string } {
        let ariaAttributes: { [key: string]: string } = {
            'aria-disabled': 'false',
            'aria-owns': this.element.id + '_options',
            'role': 'textbox',
            'aria-multiselectable': 'true',
            'aria-activedescendant': 'null',
            'aria-haspopup': 'true',
            'aria-expanded': 'false'
        };
        return ariaAttributes;
    }
    private updateListARIA(): void {
        attributes(this.ulElement, { 'id': this.element.id + '_options', 'role': 'listbox', 'aria-hidden': 'false' });
        let disableStatus: boolean = (this.inputElement.disabled) ? true : false;
        attributes(this.inputElement, this.getAriaAttributes());
        if (disableStatus) {
            attributes(this.inputElement, { 'aria-disabled': 'true' });
        }
        this.ensureAriaDisabled((disableStatus) ? 'true' : 'false');
    }
    private ensureAriaDisabled(status: string): void {
        if (this.htmlAttributes && this.htmlAttributes['aria-disabled']) {
            let attr: { [key: string]: string; } = this.htmlAttributes;
            extend(attr, {'aria-disabled' : status }, attr);
            this.setProperties({ htmlAttributes: attr }, true);
        }
    }
    private removelastSelection(e: KeyboardEventArgs): void {
        let elements: NodeListOf<Element>;
        elements = <NodeListOf<HTMLElement>>
            this.chipCollectionWrapper.querySelectorAll('span.' + CHIP);
        let value: string = elements[elements.length - 1].getAttribute('data-value');
        if (!isNullOrUndefined(this.value)) {
            this.tempValues = <string[]>this.value.slice();
        }
        this.removeValue(value, e);
        this.removeChipSelection();
        this.updateDelimeter(this.delimiterChar);
        this.makeTextBoxEmpty();
        if (this.mainList && this.listData) {
            this.refreshSelection();
        }
        this.checkPlaceholderSize();
    }
    protected onActionFailure(e: Object): void {
        super.onActionFailure(e);
        this.renderPopup();
        this.onPopupShown();
    }
    protected targetElement(): string {
        this.targetInputElement = this.inputElement;
        if (this.mode === 'CheckBox' && this.allowFiltering) {
            this.notify('targetElement', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox' });
        }
        return this.targetInputElement.value;
    }

    private getForQuery(valuecheck: string[]): Query {
        let predicate: Predicate;
        let field: string = isNullOrUndefined(this.fields.value) ? this.fields.text : this.fields.value;
        for (let i: number = 0; i < valuecheck.length; i++) {
            if (i === 0) {
                predicate = new Predicate(field, 'equal', (valuecheck[i] as string));
            } else {
                predicate = predicate.or(field, 'equal', (valuecheck[i] as string));
            }
        }
        return this.getQuery(this.query).where(predicate);
    }
    protected onActionComplete(
        ulElement: HTMLElement,
        list: { [key: string]: Object }[] | number[] | boolean[] | string[],
        e?: Object, isUpdated?: boolean): void {
        super.onActionComplete(ulElement, list, e);
        let proxy: MultiSelect = this;
        let valuecheck: string[] = [];
        if (!isNullOrUndefined(this.value) && !this.allowCustomValue) {
            for (let i: number = 0; i < this.value.length; i++) {
                let checkEle: Element = this.findListElement(
                    ((this.allowFiltering && !isNullOrUndefined(this.mainList)) ? this.mainList : ulElement),
                    'li',
                    'data-value',
                    proxy.value[i]);
                if (!checkEle) {
                    valuecheck.push(proxy.value[i] as string);
                }
            }
        }
        if (valuecheck.length > 0 && this.dataSource instanceof DataManager && !isNullOrUndefined(this.value)) {
            (this.dataSource as DataManager).executeQuery(this.getForQuery(valuecheck)).then((e: Object) => {
                proxy.addItem((e as ResultData).result, list.length);
                proxy.updateActionList(ulElement, list, e);
            });
        } else {
            this.updateActionList(ulElement, list, e);
        }
    }

    private updateActionList(
        ulElement: HTMLElement,
        list: { [key: string]: Object }[] | number[] | boolean[] | string[],
        e?: Object, isUpdated?: boolean): void {
        if (this.mode === 'CheckBox' && this.showSelectAll) {
            this.notify('selectAll', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox' });
        }
        if (!this.mainList && !this.mainData) {
            this.mainList = ulElement.cloneNode ? <HTMLElement>ulElement.cloneNode(true) : ulElement;
            this.mainData = list;
            this.mainListCollection = this.liCollections;
        } else if (!isNullOrUndefined(this.mainData) && this.mainData.length === 0) {
            this.mainData = list;
        }
        if ((this.remoteCustomValue || list.length <= 0) && this.allowCustomValue && this.inputFocus && this.allowFiltering) {
            this.checkForCustomValue(this.tempQuery, this.fields);
            return;
        }
        if (this.value && this.value.length && ((this.mode !== 'CheckBox' && this.inputElement.value !== '') ||
            this.mode === 'CheckBox')) {
            this.refreshSelection();
        }
        this.updateListARIA();
        this.unwireListEvents();
        this.wireListEvents();
        if (!isNullOrUndefined(this.setInitialValue)) { this.setInitialValue(); }
        if (!isNullOrUndefined(this.selectAllAction)) { this.selectAllAction(); }
        if (this.setDynValue) {
            if (!isNullOrUndefined(this.text) && (isNullOrUndefined(this.value) || this.value.length === 0)) {
                this.initialTextUpdate();
            }
            this.initialValueUpdate();
            this.initialUpdate();
            this.refreshPlaceHolder();
            this.updateValueState(null, this.value, null);
        }
        this.renderPopup();
        if (this.beforePopupOpen) {
            this.beforePopupOpen = false;
            this.onPopupShown();
        }
    }
    private refreshSelection(): void {
        let value: string | number | boolean;
        let element: HTMLElement;
        let className: string = this.hideSelectedItem ?
            HIDE_LIST :
            dropDownBaseClasses.selected;
        if (!isNullOrUndefined(this.value)) {
            for (let index: number = 0; !isNullOrUndefined(this.value[index]); index++) {
                value = this.value[index];
                element = this.findListElement(this.list, 'li', 'data-value', value);
                if (element) {
                    addClass([element], className);
                    if (this.hideSelectedItem && element.previousSibling
                        && element.previousElementSibling.classList.contains(dropDownBaseClasses.group)
                        && (!element.nextElementSibling ||
                            element.nextElementSibling.classList.contains(dropDownBaseClasses.group))) {
                        addClass([element.previousElementSibling], className);
                    }
                    if (this.hideSelectedItem && this.fields.groupBy && !element.previousElementSibling.classList.contains(HIDE_LIST)) {
                        this.hideGroupItem(value);
                    }
                    if (this.hideSelectedItem && element.classList.contains(dropDownBaseClasses.focus)) {
                        removeClass([element], dropDownBaseClasses.focus);
                        let listEle: NodeListOf<Element> = element.parentElement.querySelectorAll('.' +
                            dropDownBaseClasses.li + ':not(.' + HIDE_LIST + ')');
                        if (listEle.length > 0) {
                            addClass([listEle[0]], dropDownBaseClasses.focus);
                        } else {
                            this.ulElement = this.ulElement.cloneNode ? <HTMLElement>this.ulElement.cloneNode(true) : this.ulElement;
                            this.l10nUpdate();
                            addClass([this.list], dropDownBaseClasses.noData);
                        }
                    }
                    element.setAttribute('aria-selected', 'true');
                    if (this.mode === 'CheckBox' && element.classList.contains('e-active')) {
                        let ariaValue: string | null = element.firstElementChild.getAttribute('aria-checked');
                        if (isNullOrUndefined(ariaValue) || ariaValue === 'false') {
                            let args: { [key: string]: Object | string } = {
                                module: 'CheckBoxSelection',
                                enable: this.mode === 'CheckBox',
                                li: element,
                                e: null
                            };
                            this.notify('updatelist', args);
                        }
                    }
                }
            }
        }
        this.checkSelectAll();
        this.checkMaxSelection();
    }

    private hideGroupItem(value: string | number | boolean): void {
        let element: HTMLElement;
        let element1: HTMLElement;
        let className: string = this.hideSelectedItem ?
            HIDE_LIST :
            dropDownBaseClasses.selected;
        element1 = element = this.findListElement(this.ulElement, 'li', 'data-value', value);
        let i: number = 0;
        let j: number = 0;
        let temp: boolean = true;
        let temp1: boolean = true;
        do {
            if (element && element.previousElementSibling
                && (!element.previousElementSibling.classList.contains(HIDE_LIST) &&
                    element.previousElementSibling.classList.contains(dropDownBaseClasses.li))) {
                temp = false;
            }
            if (!temp || !element || (element.previousElementSibling
                && element.previousElementSibling.classList.contains(dropDownBaseClasses.group))) {
                i = 10;
            } else {
                element = element.previousElementSibling as HTMLElement;
            }
            if (element1 && element1.nextElementSibling
                && (!element1.nextElementSibling.classList.contains(HIDE_LIST) &&
                    element1.nextElementSibling.classList.contains(dropDownBaseClasses.li))) {
                temp1 = false;
            }
            if (!temp1 || !element1 || (element1.nextElementSibling
                && element1.nextElementSibling.classList.contains(dropDownBaseClasses.group))) {
                j = 10;
            } else {
                element1 = element1.nextElementSibling as HTMLElement;
            }
        }
        while (i < 10 || j < 10);
        if (temp && temp1 && !element.previousElementSibling.classList.contains(HIDE_LIST)) {
            addClass([element.previousElementSibling], className);
        } else if (temp && temp1 && element.previousElementSibling.classList.contains(HIDE_LIST)) {
            removeClass([element.previousElementSibling], className);
        }
    }
    private checkSelectAll(): void {
        let groupItemLength: number = this.list.querySelectorAll('li.e-list-group-item.e-active').length;
        let listItem: NodeListOf<Element> = this.list.querySelectorAll('li.e-list-item');
        let searchCount: number = this.list.querySelectorAll('li.' + dropDownBaseClasses.li).length;
        let searchActiveCount: number = this.list.querySelectorAll('li.' + dropDownBaseClasses.selected).length;
        if (this.enableGroupCheckBox && !isNullOrUndefined(this.fields.groupBy)) {
            searchActiveCount = searchActiveCount - groupItemLength;
        }
        if ((searchCount === searchActiveCount) && (this.mode === 'CheckBox' && this.showSelectAll)) {
            this.notify('checkSelectAll', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', value: 'check' });
        }
        if ((searchCount !== searchActiveCount) && (this.mode === 'CheckBox' && this.showSelectAll)) {
            this.notify('checkSelectAll', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', value: 'uncheck' });
        }
        if (this.enableGroupCheckBox && this.fields.groupBy && !this.enableSelectionOrder) {
            for (let i: number = 0; i < listItem.length; i++) {
                this.findGroupStart(listItem[i] as HTMLElement);
            }
        }
    }
    private openClick(e: KeyboardEventArgs): void {
        if (!this.openOnClick && this.mode !== 'CheckBox') {
            if (this.targetElement() !== '') {
                this.showPopup();
            } else {
                this.hidePopup();
            }
        } else if (!this.openOnClick && this.mode === 'CheckBox' && !this.isPopupOpen()) {
            this.showPopup();
        }
    }
    private KeyUp(e: KeyboardEventArgs): void {
        if (this.mode === 'CheckBox' && !this.openOnClick) {
            let char: string = String.fromCharCode(e.keyCode);
            let isWordCharacter: Object = char.match(/\w/);
            if (!isNullOrUndefined(isWordCharacter)) {
                this.isValidKey = true;
            }
        }
        this.isValidKey = (this.isPopupOpen() && e.keyCode === 8) || this.isValidKey;
        if (this.isValidKey) {
            this.isValidKey = false;
            this.expandTextbox();
            this.showOverAllClear();
            switch (e.keyCode) {
                default:
                    if (!this.isPopupOpen() && this.openOnClick) {
                        this.showPopup();
                    }
                    this.openClick(e);
                    if (this.checkTextLength() && !this.allowFiltering && (e.keyCode !== 8)) {
                        this.focusAtFirstListItem();
                    } else {
                        let text: string = this.targetElement();
                        this.keyCode = e.keyCode;
                        if (this.allowFiltering) {
                            let eventArgs: { [key: string]: Object } = {
                                preventDefaultAction: false,
                                text: this.targetElement(),
                                updateData: (
                                    dataSource: {
                                        [key: string]: Object
                                    }[] | DataManager | string[] | number[], query?: Query, fields?: FieldSettingsModel) => {
                                    if (eventArgs.cancel) { return; }
                                    this.isFiltered = true;
                                    this.remoteFilterAction = true;
                                    this.dataUpdater(dataSource, query, fields);
                                },
                                event: e,
                                cancel: false
                            };
                            this.trigger('filtering', eventArgs, (eventArgs: FilteringEventArgs) => {
                                if (!eventArgs.cancel) {
                                    if (!this.isFiltered && !eventArgs.preventDefaultAction) {
                                        this.filterAction = true;
                                        this.dataUpdater(this.dataSource, null, this.fields);
                                    }
                                }
                            });
                        } else if (this.allowCustomValue) {
                            let query: Query = new Query();
                            query = (text !== '') ? query.where(
                                this.fields.text, 'startswith', text, this.ignoreCase, this.ignoreAccent) : query;
                            this.dataUpdater(this.mainData, query, this.fields);
                            break;
                        } else {
                            let liCollections: HTMLElement[];
                            liCollections = <HTMLElement[] & NodeListOf<Element>>
                                this.list.querySelectorAll('li.' + dropDownBaseClasses.li + ':not(.e-hide-listitem)');
                            let activeElement: { [key: string]: Element | number } =
                                Search(this.targetElement(), liCollections, 'StartsWith', this.ignoreCase);

                            if (activeElement && activeElement.item !== null) {
                                this.addListFocus((<HTMLElement>activeElement.item));
                                this.list.scrollTop =
                                    (<HTMLElement>activeElement.item).offsetHeight * (<number>activeElement.index);
                            } else if (this.targetElement() !== '') {
                                this.removeFocus();
                            } else {
                                this.focusAtFirstListItem();
                            }
                        }
                    }
            }
        }
    }
    protected getQuery(query: Query): Query {
        let filterQuery: Query = query ? query.clone() : this.query ? this.query.clone() : new Query();
        if (this.filterAction) {
            if (this.targetElement() !== null) {
                let dataType: string = <string>this.typeOfData(this.dataSource as { [key: string]: Object; }[]).typeof;
                if (!(this.dataSource instanceof DataManager) && dataType === 'string' || dataType === 'number') {
                    filterQuery.where('', 'startswith', this.targetElement(), this.ignoreCase, this.ignoreAccent);
                } else {
                    let fields: FieldSettingsModel = this.fields;
                    filterQuery.where(
                        !isNullOrUndefined(fields.text) ? fields.text : '',
                        'startswith', this.targetElement(), this.ignoreCase, this.ignoreAccent);
                }
            }
            return filterQuery;
        } else {
            return query ? query : this.query ? this.query : new Query();
        }

    }

    private dataUpdater(
        dataSource: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[],
        query?: Query, fields?: FieldSettingsModel): void {
        this.isDataFetched = false;
        if (this.targetElement().trim() === '') {
            let list: HTMLElement = this.mainList.cloneNode ? <HTMLElement>this.mainList.cloneNode(true) : this.mainList;
            if (this.backCommand) {
                this.remoteCustomValue = false;
                this.onActionComplete(list, this.mainData);
                if (this.value && this.value.length) {
                    this.refreshSelection();
                }
                if (this.keyCode !== 8) {
                    this.focusAtFirstListItem();
                }
                this.notify('reOrder', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', e: this });
            }
        } else {
            this.resetList(dataSource, fields, query);
            if (this.allowCustomValue) {
                if (!(dataSource instanceof DataManager)) {
                    this.checkForCustomValue(query, fields);
                } else {
                    this.remoteCustomValue = true;
                    this.tempQuery = query;
                }
            }
        }
        this.refreshPopup();
        if (this.mode === 'CheckBox') {
            this.removeFocus();
        }
    }
    private tempQuery: Query;
    private tempValues: string[] | number[] | boolean[];
    private checkForCustomValue(query?: Query, fields?: FieldSettingsModel): void {
        let dataChecks: boolean = !this.getValueByText(this.inputElement.value, this.ignoreCase);
        if (this.allowCustomValue && dataChecks) {
            let value: string = this.inputElement.value;
            let customData: Object | string = (!isNullOrUndefined(this.mainData) && this.mainData.length > 0) ?
                (this.mainData as { [key: string]: Object; }[])[0] : this.mainData;
            if (typeof (customData) !== 'string') {
                let dataItem: { [key: string]: string | Object } = {};
                setValue(fields.text, value, dataItem);
                setValue(fields.value, value, dataItem);
                let tempData: [{ [key: string]: Object }] = JSON.parse(JSON.stringify(this.listData));
                tempData.splice(0, 0, dataItem);
                this.resetList(tempData, fields ? fields : this.fields, query);
            } else {
                let tempData: string[] = [this.inputElement.value];
                this.resetList(tempData, fields ? fields : this.fields);
            }
        }
        if (this.value && this.value.length) {
            this.refreshSelection();
        }
    }
    protected getNgDirective(): string {
        return 'EJS-MULTISELECT';
    }
    private wrapperClick(e: MouseEvent): void {
        this.setDynValue = false;
        if (!this.enabled) {
            return;
        }
        if ((<HTMLElement>e.target) === this.overAllClear) {
            e.preventDefault();
            return;
        }
        if (!this.inputFocus) {
            this.inputElement.focus();
        }
        if (!this.readonly) {
            if (e.target && (<HTMLElement>e.target).classList.toString().indexOf(CHIP_CLOSE) !== -1) {
                if (this.isPopupOpen()) {
                    this.refreshPopup();
                }
                return;
            }
            if (!this.isPopupOpen() &&
            (this.openOnClick || (this.showDropDownIcon && e.target && (<HTMLElement>e.target).className === dropdownIcon))) {
                this.showPopup();
            } else {
                this.hidePopup();
                if (this.mode === 'CheckBox') {
                    this.showOverAllClear();
                    this.inputFocus = true;
                    if (!this.overAllWrapper.classList.contains(FOCUS)) {
                        this.overAllWrapper.classList.add(FOCUS);
                    }
                }
            }
        }
        e.preventDefault();
    }
    private enable(state: boolean): void {
        if (state) {
            this.overAllWrapper.classList.remove(DISABLED);
            this.inputElement.removeAttribute('disabled');
            attributes(this.inputElement, { 'aria-disabled': 'false' });
            this.ensureAriaDisabled('false');
        } else {
            this.overAllWrapper.classList.add(DISABLED);
            this.inputElement.setAttribute('disabled', 'true');
            attributes(this.inputElement, { 'aria-disabled': 'true' });
            this.ensureAriaDisabled('true');
        }
        if (this.enabled !== state) {
            this.enabled = state;
        }
        this.hidePopup();
    }
    private scrollFocusStatus: boolean = false;
    private keyDownStatus: boolean = false;
    private onBlur(eve?: MouseEvent): void {
        let target: HTMLElement;
        if (!isNullOrUndefined(eve)) {
            target = <HTMLElement>eve.relatedTarget;
        }
        if (this.popupObj && document.body.contains(this.popupObj.element) && this.popupObj.element.contains(target)) {
            if (this.mode !== 'CheckBox') { this.inputElement.focus(); }
            return;
        }
        if (this.mode === 'CheckBox' && Browser.isIE && !isNullOrUndefined(eve)) {
            this.inputFocus = false;
            this.overAllWrapper.classList.remove(FOCUS);
            return;
        }
        if (this.scrollFocusStatus) {
            if (!isNullOrUndefined(eve)) {
                eve.preventDefault();
            }
            this.inputElement.focus();
            this.scrollFocusStatus = false;
            return;
        }
        this.inputFocus = false;
        this.overAllWrapper.classList.remove(FOCUS);
        if (this.mode !== 'Box' && this.mode !== 'CheckBox') {
            this.refreshListItems(null);
            this.updateDelimView();
        }
        this.updateValueState(eve, this.value, this.tempValues);
        this.dispatchEvent(this.hiddenElement as HTMLElement, 'change');
        this.overAllClear.style.display = 'none';
        if (this.isPopupOpen()) {
            this.DropDownBaseresetBlazorTemplates(false, false, true, true, false, true, true);
            this.hidePopup();
        }
        this.makeTextBoxEmpty();
        this.trigger('blur');
        this.focused = true;
        if (Browser.isDevice && this.mode !== 'Delimiter' && this.mode !== 'CheckBox') {
            this.removeChipFocus();
        }
        this.removeChipSelection();
        this.refreshInputHight();
        floatLabelBlur(
            this.overAllWrapper,
            this.componentWrapper,
            this.value,
            this.floatLabelType,
            this.placeholder
        );
        this.refreshPlaceHolder();
        if ((this.allowFiltering || (this.enableSelectionOrder === true && this.mode === 'CheckBox'))
            && !isNullOrUndefined(this.mainList)) {
            this.ulElement = this.mainList;
        }
        this.checkPlaceholderSize();
    }
    private checkPlaceholderSize(): void {
        if (this.showDropDownIcon) {
            let downIconWidth: number = this.dropIcon.offsetWidth +
                parseInt(window.getComputedStyle(this.dropIcon).marginRight, 10);
            this.setPlaceholderSize(downIconWidth);
        }
    }
    private setPlaceholderSize(downIconWidth: number): void {
        if (isNullOrUndefined(this.value) || this.value.length === 0) {
            this.searchWrapper.style.width = ('calc(100% - ' + (downIconWidth + 10)) + 'px';
        } else if (!isNullOrUndefined(this.value)) {
            this.searchWrapper.removeAttribute('style');
        }
    }
    private refreshInputHight(): void {
        if ((!this.value || !this.value.length) && (isNullOrUndefined(this.text) || this.text === '')) {
            this.searchWrapper.classList.remove(ZERO_SIZE);
        } else {
            this.searchWrapper.classList.add(ZERO_SIZE);
        }
    }
    private validateValues(newValue: string[] | number[] | boolean[], oldValue: string[] | number[] | boolean[]): boolean {
        return JSON.stringify((newValue as string[]).slice().sort()) !== JSON.stringify((oldValue as string[]).slice().sort());
    }
    private updateValueState(
        event: KeyboardEventArgs | MouseEvent,
        newVal: string[] | number[] | boolean[],
        oldVal: string[] | number[] | boolean[]): void {
        let newValue: string[] | number[] | boolean[] = newVal ? newVal : <string[]>[];
        let oldValue: string[] | number[] | boolean[] = oldVal ? oldVal : <string[]>[];
        if (this.initStatus && this.validateValues(newValue, oldValue)) {
            let eventArgs: MultiSelectChangeEventArgs = {
                e: event,
                oldValue: <string[]>oldVal,
                value: <string[]>newVal,
                isInteracted: event ? true : false,
                element: this.element
            };
            this.trigger('change', eventArgs);
            this.updateTempValue();
        }
    }
    private updateTempValue(): void {
        if (!this.value) {
            this.tempValues = this.value;
        } else {
            this.tempValues = <string[]>this.value.slice();
        }
    }
    private getPagingCount(): number {
        let height: string = this.list.classList.contains(dropDownBaseClasses.noData) ? null :
            getComputedStyle(this.getItems()[0], null).getPropertyValue('height');
        return Math.round(this.list.offsetHeight / parseInt(height, 10));
    }

    private pageUpSelection(steps: number): void {
        let collection: NodeListOf<Element> = <NodeListOf<HTMLElement>>this.list.querySelectorAll('li.'
            + dropDownBaseClasses.li + ':not(.' + HIDE_LIST + ')' + ':not(.e-reorder-hide)');
        let previousItem: Element;
        previousItem = steps >= 0 ? collection[steps + 1] : collection[0];
        this.addListFocus(<HTMLElement>previousItem);
        this.scrollBottom(<HTMLElement>previousItem, this.getIndexByValue(previousItem.getAttribute('data-value')));
    };

    private pageDownSelection(steps: number): void {
        let list: Element[] = this.getItems();
        let collection: NodeListOf<Element> = <NodeListOf<HTMLElement>>this.list.querySelectorAll('li.'
            + dropDownBaseClasses.li + ':not(.' + HIDE_LIST + ')' + ':not(.e-reorder-hide)');
        let previousItem: Element;
        previousItem = steps <= collection.length ? collection[steps - 1] : collection[collection.length - 1];
        this.addListFocus(<HTMLElement>previousItem);
        this.scrollBottom(<HTMLElement>previousItem, this.getIndexByValue(previousItem.getAttribute('data-value')));
    }
    public getItems(): Element[] {
        if (!this.list) {
            super.render();
        }
        return this.ulElement ? ((<HTMLElement[] & NodeListOf<Element>>
            this.ulElement.querySelectorAll('.' + dropDownBaseClasses.li)).length > 0 &&
            <HTMLElement[] & NodeListOf<Element>>this.ulElement.querySelectorAll('.' + dropDownBaseClasses.li
                + ':not(.' + HIDE_LIST + ')')) : null;

    }
    private focusInHandler(e?: FocusEvent | MouseEvent | KeyboardEvent | TouchEvent): boolean {
        if (this.enabled) {
            this.showOverAllClear();
            this.inputFocus = true;
            if (this.value && this.value.length) {
                if (this.mode !== 'Delimiter' && this.mode !== 'CheckBox') {
                    this.chipCollectionWrapper.style.display = '';
                } else {
                    this.showDelimWrapper();
                }
                if (this.mode !== 'CheckBox') {
                    this.viewWrapper.style.display = 'none';
                }
            }
            if (this.mode !== 'CheckBox') {
                this.searchWrapper.classList.remove(ZERO_SIZE);
            }
            this.checkPlaceholderSize();
            if (this.focused) {
                let args: FocusEventArgs = { isInteracted: e ? true : false, event: e };
                this.trigger('focus', args);
                this.focused = false;
            }
            if (!this.overAllWrapper.classList.contains(FOCUS)) {
                this.overAllWrapper.classList.add(FOCUS);
            }
            floatLabelFocus(this.overAllWrapper, this.componentWrapper);
            if (this.isPopupOpen()) {
                this.refreshPopup();
            }
            return true;
        } else {
            return false;
        }
    }
    private showDelimWrapper(): void {
        if (this.mode === 'CheckBox') {
            this.viewWrapper.style.display = '';
        } else {
            this.delimiterWrapper.style.display = '';
        }
        this.componentWrapper.classList.add(DELIMITER_VIEW_WRAPPER);
    }
    private hideDelimWrapper(): void {
        this.delimiterWrapper.style.display = 'none';
        this.componentWrapper.classList.remove(DELIMITER_VIEW_WRAPPER);
    }
    private expandTextbox(): void {
        let size: number = 5;
        if (this.placeholder) {
            size = size > this.inputElement.placeholder.length ? size : this.inputElement.placeholder.length;
        }
        if (this.inputElement.value.length > size) {
            this.inputElement.size = this.inputElement.value.length;
        } else {
            this.inputElement.size = size;
        }
    }
    private isPopupOpen(): boolean {
        return ((this.popupWrapper !== null) && (this.popupWrapper.parentElement !== null));
    }
    private refreshPopup(): void {
        if (this.popupObj && this.mobFilter) {
            this.popupObj.setProperties({ width: this.calcPopupWidth() });
            this.popupObj.refreshPosition(this.overAllWrapper);
        }
    }
    private checkTextLength(): boolean {
        return this.targetElement().length < 1;
    }
    private popupKeyActions(e: KeyboardEventArgs): void {
        switch (e.keyCode) {
            case 38:
                this.hidePopup();
                if (this.mode === 'CheckBox') { this.inputElement.focus(); }
                e.preventDefault();
                break;
            case 40:
                if (!this.isPopupOpen()) {
                    this.showPopup();
                    e.preventDefault();
                }
                break;
        }
    }

    private updateAriaAttribute(): void {
        let focusedItem: HTMLElement = <HTMLElement>this.list.querySelector('.' + dropDownBaseClasses.focus);
        if (!isNullOrUndefined(focusedItem)) {
            this.inputElement.setAttribute('aria-activedescendant', focusedItem.id);
        }
    }

    private homeNavigation(isHome: boolean): void {
        this.removeFocus();
        let scrollEle: NodeListOf<HTMLElement> = this.ulElement.querySelectorAll('li.' + dropDownBaseClasses.li
        + ':not(.' + HIDE_LIST + ')' + ':not(.e-reorder-hide)');
        if (scrollEle.length > 0) {
            let element: HTMLElement = scrollEle[(isHome) ? 0 : (scrollEle.length - 1)];
            element.classList.add(dropDownBaseClasses.focus);
            this.scrollBottom(element);
        }
    }

    private onKeyDown(e: KeyboardEventArgs): void {
        if (this.readonly || !this.enabled && this.mode !== 'CheckBox') { return; }
        this.keyDownStatus = true;
        if (e.keyCode > 111 && e.keyCode < 124) { return; }
        if (e.altKey) {
            this.popupKeyActions(e);
            return;
        } else if (this.isPopupOpen()) {
            let focusedItem: Element = this.list.querySelector('.' + dropDownBaseClasses.focus);
            let activeIndex: number;
            switch (e.keyCode) {
                case 36:
                case 35:
                    this.homeNavigation((e.keyCode === 36) ? true : false);
                    break;
                case 33:
                    e.preventDefault();
                    if (focusedItem) {
                        this.getIndexByValue(focusedItem.getAttribute('data-value'));
                        this.pageUpSelection(activeIndex - this.getPagingCount());
                        this.updateAriaAttribute();
                    }
                    return;
                case 34:
                    e.preventDefault();
                    if (focusedItem) {
                        this.getIndexByValue(focusedItem.getAttribute('data-value'));
                        this.pageDownSelection(activeIndex + this.getPagingCount());
                        this.updateAriaAttribute();
                    }
                    return;
                case 38:
                    this.arrowUp(e);
                    break;
                case 40:
                    this.arrowDown(e);
                    break;
                case 27:
                    e.preventDefault();
                    this.hidePopup();
                    if (this.mode === 'CheckBox') { this.inputElement.focus(); }
                    return;
                case 13:
                    e.preventDefault();
                    if (this.mode !== 'CheckBox') { this.selectByKey(e); }
                    this.checkPlaceholderSize();
                    return;
                case 32:
                    this.spaceKeySelection(e);
                    return;
                case 9:
                    e.preventDefault();
                    this.hidePopup();
                    this.inputElement.focus();
                    this.overAllWrapper.classList.add(FOCUS);
            }
        } else {
            switch (e.keyCode) {
                case 13:
                case 9:
                case 16:
                case 17:
                case 20:
                    return;
                case 40:
                    if (this.openOnClick) { this.showPopup(); }
                    break;
                case 27:
                    e.preventDefault();
                    this.escapeAction();
                    return;
            }
        }
        if (this.checkTextLength()) {
            this.keyNavigation(e);
        }
        if (this.mode === 'CheckBox' && this.enableSelectionOrder) { this.checkBackCommand(e); }
        this.expandTextbox();
        this.refreshPopup();
    }
    private arrowDown(e: KeyboardEventArgs): void {
        e.preventDefault();
        this.moveByList(1);
        this.keyAction = true;
        if (document.activeElement.classList.contains('e-input-filter')
        || (this.mode === 'CheckBox' && !this.allowFiltering && document.activeElement !== this.list)) {
            this.list.focus();
            EventHandler.add(this.list, 'keydown', this.onKeyDown, this);
        }
        this.updateAriaAttribute();
    }
    private arrowUp(e: KeyboardEventArgs): void {
        e.preventDefault();
        this.keyAction = true;
        let list: NodeListOf<Element> = <NodeListOf<HTMLElement>>this.list.querySelectorAll('li.'
            + dropDownBaseClasses.li
            + ':not(.' + HIDE_LIST + ')' + ':not(.e-reorder-hide)');
        if (this.enableGroupCheckBox && this.mode === 'CheckBox' && !isNullOrUndefined(this.fields.groupBy)) {
            list = this.list.querySelectorAll('li.'
            + dropDownBaseClasses.li + ',li.' + dropDownBaseClasses.group
            + ':not(.' + HIDE_LIST + ')' + ':not(.e-reorder-hide)');
        }
        let focuseElem: Element = <HTMLElement>this.list.querySelector('li.' + dropDownBaseClasses.focus);
        let index: number = Array.prototype.slice.call(list).indexOf(focuseElem);
        if (index <= 0 && (this.mode === 'CheckBox' && this.allowFiltering)) {
            this.keyAction = false;
            this.notify('inputFocus', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', value: 'focus' });
        } else {
            this.list.focus();
        }
        this.moveByList(-1);
        this.updateAriaAttribute();
    }
    private spaceKeySelection(e: KeyboardEventArgs): void {
        if (this.mode === 'CheckBox') {
            if (!document.activeElement.classList.contains('e-input-filter')) {
                e.preventDefault();
                this.keyAction = true;
                this.list.focus();
            }
            this.selectByKey(e);
        }
        this.checkPlaceholderSize();
    }
    private checkBackCommand(e: KeyboardEventArgs): void {
        if (e.keyCode === 8 && this.targetElement() === '') {
            this.backCommand = false;
        } else {
            this.backCommand = true;
        }
    }
    private keyNavigation(e: KeyboardEventArgs): void {
        if ((this.mode !== 'Delimiter' && this.mode !== 'CheckBox') && this.value && this.value.length) {
            switch (e.keyCode) {
                case 37: //left arrow  
                    e.preventDefault();
                    this.moveBy(-1, e);
                    break;
                case 39: //right arrow  
                    e.preventDefault();
                    this.moveBy(1, e);
                    break;
                case 8:
                    this.removelastSelection(e);
                    break;
                case 46: //del
                    this.removeSelectedChip(e);
                    break;
            }
        } else if (e.keyCode === 8 && this.mode === 'Delimiter') {
            if (this.value && this.value.length) {
                e.preventDefault();
                let temp: string | number | boolean = this.value[this.value.length - 1];
                this.removeValue(temp, e);
                this.updateDelimeter(this.delimiterChar);
                this.focusAtLastListItem(<string>temp);
            }
        }
    }
    private selectByKey(e: KeyboardEventArgs): void {
        this.removeChipSelection();
        this.selectListByKey(e);
        if (this.hideSelectedItem) {
            this.focusAtFirstListItem();
        }
    }
    private escapeAction(): void {
        let temp: string[] | number[] = this.tempValues ? <string[]>this.tempValues.slice() : <string[]>[];
        if (this.value && this.validateValues(this.value, temp)) {
            if (this.mode !== 'CheckBox') {
                this.value = temp;
                this.initialValueUpdate();
            }
            if (this.mode !== 'Delimiter' && this.mode !== 'CheckBox') {
                this.chipCollectionWrapper.style.display = '';
            } else {
                this.showDelimWrapper();
            }
            this.refreshPlaceHolder();
            if (this.value.length) {
                this.showOverAllClear();
            } else {
                this.hideOverAllClear();
            }
        }
        this.makeTextBoxEmpty();
    }
    private scrollBottom(selectedLI: HTMLElement, activeIndex?: number): void {
        let currentOffset: number = this.list.offsetHeight;
        let nextBottom: number = selectedLI.offsetTop + selectedLI.offsetHeight - this.list.scrollTop;
        let nextOffset: number = this.list.scrollTop + nextBottom - currentOffset;
        let boxRange: number = (selectedLI.offsetTop + selectedLI.offsetHeight - this.list.scrollTop);
        boxRange = this.fields.groupBy && !isUndefined(this.fixedHeaderElement) ?
            boxRange - this.fixedHeaderElement.offsetHeight : boxRange;
        if (activeIndex === 0) {
            this.list.scrollTop = 0;
        } else if (nextBottom > currentOffset) {
            this.list.scrollTop = nextOffset;
        } else if (!(boxRange > 0 && this.list.offsetHeight > boxRange)) {
            this.list.scrollTop = nextOffset;
        }
    }
    private scrollTop(selectedLI: HTMLElement, activeIndex: number): void {
        let nextOffset: number = selectedLI.offsetTop - this.list.scrollTop;
        let nextBottom: number = selectedLI.offsetTop + selectedLI.offsetHeight - this.list.scrollTop;
        nextOffset = this.fields.groupBy && !isUndefined(this.fixedHeaderElement) ?
            nextOffset - this.fixedHeaderElement.offsetHeight : nextOffset;
        let boxRange: number = (selectedLI.offsetTop + selectedLI.offsetHeight - this.list.scrollTop);
        if (activeIndex === 0) {
            this.list.scrollTop = 0;
        } else if (nextOffset < 0) {
            this.list.scrollTop = this.list.scrollTop + nextOffset;
        } else if (!(boxRange > 0 && this.list.offsetHeight > boxRange)) {
            this.list.scrollTop = selectedLI.offsetTop - (this.fields.groupBy && !isUndefined(this.fixedHeaderElement) ?
                this.fixedHeaderElement.offsetHeight : 0);
        }
    }
    private selectListByKey(e: KeyboardEventArgs): void {
        let li: HTMLElement = <HTMLElement>this.list.querySelector('li.' + dropDownBaseClasses.focus);
        let limit: number = this.value && this.value.length ? this.value.length : 0;
        let target : HTMLElement;
        if (li !== null) {
            if (li.classList.contains('e-active')) {
                limit = limit - 1;
            }
            if (this.isValidLI(li) && limit < this.maximumSelectionLength) {
                this.updateListSelection(li, e);
                this.addListFocus(<HTMLElement>li);
                if (this.mode === 'CheckBox') {
                    this.updateDelimView();
                    this.updateDelimeter(this.delimiterChar);
                    this.refreshInputHight();
                    if (this.enableGroupCheckBox && !isNullOrUndefined(this.fields.groupBy)) {
                        (target as Element) = li.firstElementChild.lastElementChild;
                        this.findGroupStart(target);
                    }
                } else {
                    this.updateDelimeter(this.delimiterChar);
                }
                this.makeTextBoxEmpty();
                if (this.mode !== 'CheckBox') {
                    this.refreshListItems(li.textContent);
                }
                this.refreshPopup();
            }else {
                if (!this.isValidLI(li) && limit < this.maximumSelectionLength) {
                    (target as Element) = li.firstElementChild.lastElementChild;
                    target.classList.contains('e-check') ? this.selectAllItem(false, e, li) : this.selectAllItem(true, e, li);
                }
            }
            this.refreshSelection();
            if (this.closePopupOnSelect) {
                this.hidePopup();
            }
        }
        this.refreshPlaceHolder();
    }
    private refreshListItems(data: string): void {
        if ((this.allowFiltering || (this.mode === 'CheckBox' && this.enableSelectionOrder === true)
            || this.allowCustomValue) && this.mainList && this.listData) {
            let list: HTMLElement;
            if (this.sortOrder === 'Descending' || this.sortOrder === 'Ascending') {
                list = this.ulElement.cloneNode ? <HTMLElement>this.ulElement.cloneNode(true) : this.ulElement;
            } else {
                list = this.mainList.cloneNode ? <HTMLElement>this.mainList.cloneNode(true) : this.mainList;
            }
            this.onActionComplete(list, this.mainData);
            this.focusAtLastListItem(data);
            if (this.value && this.value.length) {
                this.refreshSelection();
            }
        }
    }
    private removeSelectedChip(e: KeyboardEventArgs): void {
        let selectedElem: Element = <HTMLElement>this.chipCollectionWrapper.querySelector('span.' + CHIP_SELECTED);
        let temp: Element;
        if (selectedElem !== null) {
            if (!isNullOrUndefined(this.value)) {
                this.tempValues = <string[]>this.value.slice();
            }
            temp = selectedElem.nextElementSibling;
            if (temp !== null) {
                this.removeChipSelection();
                this.addChipSelection(temp, e);
            }
            this.removeValue(selectedElem.getAttribute('data-value'), e);
            this.makeTextBoxEmpty();
        }
        if (this.closePopupOnSelect) {
            this.hidePopup();
        }
        this.checkPlaceholderSize();
    }
    private moveByTop(state: boolean): void {
        let elements: NodeListOf<Element> = <NodeListOf<HTMLElement>>this.list.querySelectorAll('li.' + dropDownBaseClasses.li);
        let index: number;
        if (elements.length > 1) {
            this.removeFocus();
            index = state ? 0 : (elements.length - 1);
            this.addListFocus(<HTMLElement>elements[index]);
            this.scrollBottom(<HTMLElement>elements[index], index);
        }
        this.updateAriaAttribute();
    }
    private moveByList(position: number): void {
        if (this.list) {
            let elements: NodeListOf<Element> = <NodeListOf<HTMLElement>>this.list.querySelectorAll('li.'
                + dropDownBaseClasses.li
                + ':not(.' + HIDE_LIST + ')' + ':not(.e-reorder-hide)');
            if (this.mode === 'CheckBox' && this.enableGroupCheckBox && !isNullOrUndefined(this.fields.groupBy)) {
                elements = this.list.querySelectorAll('li.'
                + dropDownBaseClasses.li + ',li.' + dropDownBaseClasses.group
                + ':not(.' + HIDE_LIST + ')' + ':not(.e-reorder-hide)');
            }
            let selectedElem: Element = <HTMLElement>this.list.querySelector('li.' + dropDownBaseClasses.focus);
            let temp: number = -1;
            if (elements.length) {
                for (let index: number = 0; index < elements.length; index++) {
                    if (elements[index] === selectedElem) {
                        temp = index;
                        break;
                    }
                }
                if (position > 0) {
                    if (temp < (elements.length - 1)) {
                        this.removeFocus();
                        this.addListFocus(<HTMLElement>elements[++temp]);
                        this.updateCheck(elements[temp]);
                        this.scrollBottom(<HTMLElement>elements[temp], temp);
                    }
                } else {
                    if (temp > 0) {
                        this.removeFocus();
                        this.addListFocus(<HTMLElement>elements[--temp]);
                        this.updateCheck(elements[temp]);
                        this.scrollTop(<HTMLElement>elements[temp], temp);
                    }
                }

            }
        }
    }
    private updateCheck(element: Element): void {
        if (this.mode === 'CheckBox' && this.enableGroupCheckBox  &&
            !isNullOrUndefined(this.fields.groupBy)) {
            let checkElement: Element = element.firstElementChild.lastElementChild;
            if (checkElement.classList.contains('e-check')) {
                element.classList.add('e-active');
            } else {
                element.classList.remove('e-active');
            }
        }
    }
    private moveBy(position: number, e?: KeyboardEventArgs): void {
        let elements: NodeListOf<Element>;
        let selectedElem: Element;
        let temp: Element;
        elements = <NodeListOf<HTMLElement>>this.chipCollectionWrapper.querySelectorAll('span.' + CHIP);
        selectedElem = <HTMLElement>this.chipCollectionWrapper.querySelector('span.' + CHIP_SELECTED);
        if (selectedElem === null) {
            if (position < 0) {
                this.addChipSelection(elements[elements.length - 1], e);
            }
        } else {
            if (position < 0) {
                temp = selectedElem.previousElementSibling;
                if (temp !== null) {
                    this.removeChipSelection();
                    this.addChipSelection(temp, e);
                }
            } else {
                temp = selectedElem.nextElementSibling;
                this.removeChipSelection();
                if (temp !== null) {
                    this.addChipSelection(temp, e);
                }
            }
        }
    }
    private chipClick(e: MouseEvent): void {
        if (this.enabled) {
            let elem: HTMLElement = <HTMLElement>closest(<HTMLElement>e.target, '.' + CHIP);
            this.removeChipSelection();
            this.addChipSelection(elem, e);
        }
    }
    private removeChipSelection(): void {
        if (this.chipCollectionWrapper) {
            this.removeChipFocus();
        }
    }
    private addChipSelection(element: Element, e?: MouseEvent | KeyboardEventArgs): void {
        addClass([element], CHIP_SELECTED);
        this.trigger('chipSelection', e);
    }
    private onChipRemove(e: MouseEvent): void {
        if (e.which === 3 || e.button === 2) { return; }
        if (this.enabled && !this.readonly) {
            let element: HTMLElement = (<HTMLElement>e.target).parentElement;
            let customVal: string | number | boolean = element.getAttribute('data-value');
            let value: string | number | boolean = this.getFormattedValue(customVal);
            if (this.allowCustomValue && (( customVal !== 'false' && value === false ) ||
            (!isNullOrUndefined(value) && value.toString() === 'NaN'))) {
                value = customVal;
            }
            if (this.isPopupOpen() && this.mode !== 'CheckBox') {
                this.hidePopup();
            }
            if (!this.inputFocus) {
                this.inputElement.focus();
            }
            this.removeValue(value, e);
            if (isNullOrUndefined(this.findListElement(this.list, 'li', 'data-value', value)) && this.mainList && this.listData) {
                let list: HTMLElement = this.mainList.cloneNode ? <HTMLElement>this.mainList.cloneNode(true) : this.mainList;
                this.onActionComplete(list, this.mainData);
            }
            this.updateDelimeter(this.delimiterChar);
            if (this.placeholder && this.floatLabelType === 'Never') {
                this.makeTextBoxEmpty();
                this.checkPlaceholderSize();
            } else {
                this.inputElement.value = '';
            }
            e.preventDefault();
        }
    }
    private makeTextBoxEmpty(): void {
        this.inputElement.value = '';
        this.refreshPlaceHolder();
    }
    private refreshPlaceHolder(): void {
        if (this.placeholder && this.floatLabelType === 'Never') {
            if ((this.value && this.value.length) || (!isNullOrUndefined(this.text) && this.text !== '')) {
                this.inputElement.placeholder = '';
            } else {
                this.inputElement.placeholder = this.placeholder;
            }
        } else {
            this.setFloatLabelType();
        }
        this.expandTextbox();
    }
    private removeValue(
        value: string | number | boolean,
        eve: MouseEvent | KeyboardEventArgs,
        length?: number,
        isClearAll?: boolean): void {
        let index: number = (this.value as string[]).indexOf(this.getFormattedValue(<string>value) as string);
        let isValueTemp: boolean = (this.valueTemplate) ? true : false;
        this.DropDownBaseresetBlazorTemplates(false, false, false, false, isValueTemp, false, false);
        if (index === -1 && this.allowCustomValue && !isNullOrUndefined(value)) {
            index = (this.value as string[]).indexOf(value.toString());
        }
        let className: string = this.hideSelectedItem ?
            HIDE_LIST :
            dropDownBaseClasses.selected;
        if (index !== -1) {
            let element: HTMLElement = this.findListElement(this.list, 'li', 'data-value', value);
            let val: FieldSettingsModel = this.getDataByValue(value) as FieldSettingsModel;
            let eventArgs: RemoveEventArgs = {
                e: eve,
                item: <HTMLLIElement>element,
                itemData: val,
                isInteracted: eve ? true : false,
                cancel: false
            };
            this.trigger('removing', eventArgs, (eventArgs: RemoveEventArgs) => {
                if (eventArgs.cancel) {
                    this.removeIndex++;
                } else {
                    let removeVal: number[] | string[] | boolean[] = this.value.slice(0);
                    removeVal.splice(index, 1);
                    this.setProperties({ value: <[number | string]>[].concat([], removeVal) }, true);
                    if (element !== null) {
                        let hideElement: HTMLElement = this.findListElement(this.mainList, 'li', 'data-value', value);
                        element.setAttribute('aria-selected', 'false');
                        removeClass([element], className);
                        if (hideElement) {
                            hideElement.setAttribute('aria-selected', 'false');
                            removeClass([element, hideElement], className);
                        }
                        this.notify('activeList', {
                            module: 'CheckBoxSelection',
                            enable: this.mode === 'CheckBox', li: element,
                            e: this, index: index
                        });
                        this.notify('updatelist', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', li: element, e: eve });
                        attributes(this.inputElement, { 'aria-activedescendant': element.id });
                        if ((this.value.length !== this.mainData.length) && (this.mode === 'CheckBox' && this.showSelectAll)) {
                            this.notify(
                                'checkSelectAll',
                                { module: 'CheckBoxSelection',
                                enable: this.mode === 'CheckBox',
                                value: 'uncheck' });
                        }
                    }
                    if (this.hideSelectedItem && this.fields.groupBy) { this.hideGroupItem(value); }
                    this.updateMainList(true, <string>value);
                    this.removeChip(value);
                    this.updateChipStatus();
                    let limit: number = this.value && this.value.length ? this.value.length : 0;
                    if (limit < this.maximumSelectionLength) {
                        let collection: NodeListOf<Element> = <NodeListOf<HTMLElement>>this.list.querySelectorAll('li.'
                            + dropDownBaseClasses.li + ':not(.e-active)');
                        removeClass(collection, 'e-disable');
                    }
                    this.trigger('removed', eventArgs);
                    if (length) {
                        this.selectAllEventData.push(val);
                        this.selectAllEventEle.push(<HTMLLIElement>element);
                    }
                    if (length === 1) {
                        let args: ISelectAllEventArgs = {
                            event: eve,
                            items: this.selectAllEventEle,
                            itemData: this.selectAllEventData,
                            isInteracted: eve ? true : false,
                            isChecked: false
                        };
                        this.trigger('selectedAll', args);
                        this.selectAllEventData = [];
                        this.selectAllEventEle = [];
                    }
                    if (isClearAll) { this.clearAllCallback(eve as MouseEvent); }
                }
            });
        }
    }
    private updateMainList(state: boolean, value: string): void {
        if (this.allowFiltering || this.mode === 'CheckBox') {
            let element2: HTMLElement = this.findListElement(this.mainList, 'li', 'data-value', value);
            if (element2) {
                if (state) {
                    element2.setAttribute('aria-selected', 'false');
                    removeClass([element2], this.hideSelectedItem ?
                        HIDE_LIST :
                        dropDownBaseClasses.selected);
                    if (this.mode === 'CheckBox') {
                        element2.firstElementChild.setAttribute('aria-checked', 'false');
                        removeClass([element2.firstElementChild.lastElementChild], 'e-check');
                    }
                } else {
                    element2.setAttribute('aria-selected', 'true');
                    addClass([element2], this.hideSelectedItem ?
                        HIDE_LIST :
                        dropDownBaseClasses.selected);
                    if (this.mode === 'CheckBox') {
                        element2.firstElementChild.setAttribute('aria-checked', 'true');
                        addClass([element2.firstElementChild.lastElementChild], 'e-check');
                    }
                }
            }
        }
    }
    private removeChip(value: string | number | boolean): void {
        if (this.chipCollectionWrapper) {
            let element: HTMLElement = this.findListElement(this.chipCollectionWrapper, 'span', 'data-value', value);
            if (element) {
                remove(element);
            }
        }

    }
    private updateChipStatus(): void {
        if (this.value.length) {
            if (!isNullOrUndefined(this.chipCollectionWrapper)) {
                (this.chipCollectionWrapper.style.display = '');
            }
            if (this.mode === 'Delimiter' || this.mode === 'CheckBox') {
                this.showDelimWrapper();
            }
            this.showOverAllClear();
        } else {
            if (!isNullOrUndefined(this.chipCollectionWrapper)) {
                this.chipCollectionWrapper.style.display = 'none';
            }
            if (!isNullOrUndefined(this.delimiterWrapper)) {
                (this.delimiterWrapper.style.display = 'none');
            }
            this.hideOverAllClear();
        }
    }
    private addValue(value: string | number | boolean, text: string, eve: MouseEvent | KeyboardEventArgs): void {
        if (!this.value) {
            this.value = <string[]>[];
        }
        this.setProperties({ value: <[number | string]>[].concat([], this.value, [value]) }, true);
        let element: HTMLElement = this.findListElement(this.list, 'li', 'data-value', value);
        this.removeFocus();
        if (element) {
            this.addListFocus(element);
            this.addListSelection(element);
        }
        if (this.mode !== 'Delimiter' && this.mode !== 'CheckBox') {
            this.addChip(text, value, eve);
        }
        if (this.hideSelectedItem && this.fields.groupBy) { this.hideGroupItem(value); }
        this.updateChipStatus();
        this.checkMaxSelection();
    }
    private checkMaxSelection(): void {
        let limit: number = this.value && this.value.length ? this.value.length : 0;
        if (limit === this.maximumSelectionLength) {
            let collection: NodeListOf<Element> = <NodeListOf<HTMLElement>>this.list.querySelectorAll('li.'
                + dropDownBaseClasses.li + ':not(.e-active)');
            addClass(collection, 'e-disable');
        }
    }
    private dispatchSelect(
        value: string | number | boolean,
        eve: MouseEvent | KeyboardEventArgs,
        element: HTMLElement,
        isNotTrigger: boolean,
        length?: number): void {
        if (this.initStatus && !isNotTrigger) {
            let val: FieldSettingsModel = this.getDataByValue(value) as FieldSettingsModel;
            let eventArgs: SelectEventArgs = {
                e: eve,
                item: <HTMLLIElement>element,
                itemData: val,
                isInteracted: eve ? true : false,
                cancel: false
            };
            this.trigger('select', eventArgs, (eventArgs: SelectEventArgs) => {
                if (!eventArgs.cancel) {
                    if (length) {
                        this.selectAllEventData.push(val);
                        this.selectAllEventEle.push(<HTMLLIElement>element);
                    }
                    if (length === 1) {
                        let args: ISelectAllEventArgs = {
                            event: eve,
                            items: this.selectAllEventEle,
                            itemData: this.selectAllEventData,
                            isInteracted: eve ? true : false,
                            isChecked: true
                        };
                        this.trigger('selectedAll', args);
                        this.selectAllEventData = [];
                    }
                    this.updateListSelectEventCallback(value, element, eve);
                }
            });
        }
    }
    private addChip(text: string, value: string | number | boolean, e?: MouseEvent | KeyboardEventArgs): void {
        if (this.chipCollectionWrapper) {
            this.getChip(text, value, e);
        }
    }
    private removeChipFocus(): void {
        let elements: NodeListOf<Element>;
        let closeElements: NodeListOf<Element>;
        elements = <NodeListOf<HTMLElement>>
            this.chipCollectionWrapper.querySelectorAll('span.' + CHIP);
        closeElements = <NodeListOf<HTMLElement>>
            this.chipCollectionWrapper.querySelectorAll('span.' + CHIP_CLOSE.split(' ')[0]);
        removeClass(elements, CHIP_SELECTED);
        if (Browser.isDevice) {
            for (let index: number = 0; index < closeElements.length; index++) {
                (<HTMLElement>closeElements[index]).style.display = 'none';
            }
        }

    }
    private onMobileChipInteraction(e: MouseEvent): void {
        let chipElem: HTMLElement = <HTMLElement>closest(<HTMLElement>e.target, '.' + CHIP);
        let chipClose: HTMLElement = <HTMLElement>chipElem.querySelector('span.' + CHIP_CLOSE.split(' ')[0]);
        if (this.enabled && !this.readonly) {
            if (!chipElem.classList.contains(CHIP_SELECTED)) {
                this.removeChipFocus();
                chipClose.style.display = '';
                chipElem.classList.add(CHIP_SELECTED);
            }
            this.refreshPopup();
            e.preventDefault();
        }
    }
    private getChip(
        data: string, value: string | number | boolean,
        e?: MouseEvent | KeyboardEventArgs): void {
        let itemData: { [key: string]: Object } | string | boolean | number = { text: value, value: value };
        let chip: HTMLElement = this.createElement('span', {
            className: CHIP,
            attrs: { 'data-value': <string>value, 'title': data }
        });
        let chipContent: HTMLElement = this.createElement('span', { className: CHIP_CONTENT });
        let chipClose: HTMLElement = this.createElement('span', { className: CHIP_CLOSE });
        if (this.mainData) {
            itemData = this.getDataByValue(value);
        }
        if (this.valueTemplate && !isNullOrUndefined(itemData)) {
            this.DropDownBaseresetBlazorTemplates(false, false, false, false, true, false, false);
            let compiledString: Function = compile(this.valueTemplate);
            for (let item of compiledString(itemData, null, null, this.valueTemplateId, this.isStringTemplate)) {
                chipContent.appendChild(item);
            }
            this.DropDownBaseupdateBlazorTemplates(false, false, false, false, true, false, false);
        } else {
            chipContent.innerHTML = data;
        }
        chip.appendChild(chipContent);
        let eventArgs: { [key: string]: Object } = {
            isInteracted: e ? true : false,
            itemData: itemData,
            e: e,
            setClass: (classes: string) => {
                addClass([chip], classes);
            },
            cancel: false
        };
        this.trigger('tagging', eventArgs, (eventArgs: TaggingEventArgs) => {
            if (!eventArgs.cancel) {
                if (Browser.isDevice) {
                    chip.classList.add(MOBILE_CHIP);
                    append([chipClose], chip);
                    chipClose.style.display = 'none';
                    EventHandler.add(chip, 'click', this.onMobileChipInteraction, this);
                } else {
                    EventHandler.add(chip, 'mousedown', this.chipClick, this);
                    if (this.showClearButton) {
                        chip.appendChild(chipClose);
                    }
                }
                EventHandler.add(chipClose, 'mousedown', this.onChipRemove, this);
                this.chipCollectionWrapper.appendChild(chip as HTMLElement);
            }
        });
    }
    private calcPopupWidth(): string {
        let width: string = formatUnit(this.popupWidth);
        if (width.indexOf('%') > -1) {
            let inputWidth: number = (this.componentWrapper.offsetWidth) * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        return width;
    }
    private mouseIn(): void {
        if (this.enabled && !this.readonly) {
            this.showOverAllClear();
        }
    }
    private mouseOut(): void {
        if (!this.inputFocus) {
            this.overAllClear.style.display = 'none';
        }
    }

    protected listOption(dataSource: { [key: string]: Object }[], fields: FieldSettingsModel): FieldSettingsModel {
        let iconCss: boolean = isNullOrUndefined(fields.iconCss) ? false : true;
        let fieldProperty: Object = (fields as FieldSettingsModel & { properties: Object }).properties;
        this.listCurrentOptions = (fields.text !== null || fields.value !== null) ? {
            fields: fieldProperty, showIcon: iconCss, ariaAttributes: { groupItemRole: 'presentation' }
        } : { fields: { value: 'text' } as Object };
        extend(this.listCurrentOptions, this.listCurrentOptions, fields, true);
        if (this.mode === 'CheckBox') {
            this.notify('listoption', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', dataSource, fieldProperty });
        }
        return this.listCurrentOptions;
    }

    private renderPopup(): void {
        if (!this.list) { super.render(); }
        if (!this.popupObj) {
            let args: BeforeOpenEventArgs = { cancel: false };
            this.trigger('beforeOpen', args, (args: BeforeOpenEventArgs) => {
                if (!args.cancel) {
                    document.body.appendChild(this.popupWrapper);
                    let checkboxFilter: HTMLElement = this.popupWrapper.querySelector('.' + FILTERPARENT);
                    if (this.mode === 'CheckBox' && !this.allowFiltering && checkboxFilter && this.filterParent) {
                        checkboxFilter.remove();
                        this.filterParent = null;
                    }
                    let overAllHeight: number = parseInt(<string>this.popupHeight, 10);
                    this.popupWrapper.style.visibility = 'hidden';
                    if (this.headerTemplate) {
                        this.setHeaderTemplate();
                        overAllHeight -= this.header.offsetHeight;
                    }
                    append([this.list], this.popupWrapper);
                    if (this.footerTemplate) {
                        this.setFooterTemplate();
                        overAllHeight -= this.footer.offsetHeight;
                    }
                    if (this.mode === 'CheckBox' && this.showSelectAll) {
                        this.notify('selectAll', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox' });
                        overAllHeight -= this.selectAllHeight;
                    } else if (this.mode === 'CheckBox' && !this.showSelectAll && (!this.headerTemplate || !this.footerTemplate)) {
                        this.notify('selectAll', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox' });
                        overAllHeight = parseInt(<string>this.popupHeight, 10);
                    } else if (this.mode === 'CheckBox' && !this.showSelectAll) {
                        this.notify('selectAll', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox' });
                        overAllHeight = parseInt(<string>this.popupHeight, 10);
                        if (this.headerTemplate && this.header) { overAllHeight -= this.header.offsetHeight; }
                        if (this.footerTemplate && this.footer) { overAllHeight -= this.footer.offsetHeight; }
                    }
                    if (this.mode === 'CheckBox') {
                        let args: { [key: string]: Object | string } = {
                            module: 'CheckBoxSelection',
                            enable: this.mode === 'CheckBox',
                            popupElement: this.popupWrapper
                        };
                        if (this.allowFiltering) {
                            this.notify('searchBox', args);
                            overAllHeight -= this.searchBoxHeight;
                        }
                        addClass([this.popupWrapper], 'e-checkbox');
                    }
                    if (this.popupHeight !== 'auto') {
                        this.list.style.maxHeight = formatUnit(overAllHeight);
                        this.popupWrapper.style.maxHeight = formatUnit(this.popupHeight);
                    } else { this.list.style.maxHeight = formatUnit(this.popupHeight); }
                    this.popupObj = new Popup(this.popupWrapper, {
                        width: this.calcPopupWidth(), targetType: 'relative', position: { X: 'left', Y: 'bottom' },
                        relateTo: this.overAllWrapper, collision: { X: 'flip', Y: 'flip' }, offsetY: 1,
                        enableRtl: this.enableRtl, zIndex: this.zIndex,
                        close: () => {
                            if (this.popupObj.element.parentElement) {
                                this.popupObj.unwireScrollEvents();
                                detach(this.popupObj.element);
                            }
                        },
                        open: () => {
                            if (!this.isFirstClick) {
                                let ulElement: HTMLElement = this.list.querySelector('ul');
                                if (ulElement) {
                                    let isBlazor: boolean = (Object.keys(window) as string[]).indexOf('Blazor') >= 0;
                                    if (this.itemTemplate && (this.mode === 'CheckBox') && isBlazor) {
                                        setTimeout(
                                            (): void => {
                                                this.mainList = this.ulElement;
                                            },
                                            0
                                        );
                                    } else {
                                        this.mainList = ulElement.cloneNode ? (ulElement.cloneNode(true) as HTMLElement) : ulElement;
                                    }
                                }
                                this.isFirstClick = true;
                            }
                            this.popupObj.wireScrollEvents();
                            this.loadTemplate();
                            this.setScrollPosition();
                            if (this.allowFiltering) {
                                this.notify(
                                    'inputFocus',
                                    {
                                        module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', value: 'focus'
                                    });
                            }
                        }
                    });
                    this.popupObj.close();
                    this.popupWrapper.style.visibility = '';
                    if (this.mode === 'CheckBox' && Browser.isDevice && this.allowFiltering) {
                        this.notify('deviceSearchBox', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox' });
                    }
                }
            });
        }
    }
    private setHeaderTemplate(): void {
        let compiledString: Function;
        if (this.header) {
            this.header.remove();
        }
        this.header = this.createElement('div');
        addClass([this.header], HEADER);
        compiledString = compile(this.headerTemplate);
        let elements: [Element] = compiledString({}, null, null, this.headerTemplateId, this.isStringTemplate);
        for (let temp: number = 0; temp < elements.length; temp++) {
            this.header.appendChild(elements[temp]);
        }
        this.DropDownBaseupdateBlazorTemplates(false, false, false, false, false, true, false);
        if (this.mode === 'CheckBox' && this.showSelectAll) {
            prepend([this.header], this.popupWrapper);
        } else {
            append([this.header], this.popupWrapper);
        }
        EventHandler.add(this.header, 'mousedown', this.onListMouseDown, this);
    }
    private setFooterTemplate(): void {
        let compiledString: Function;
        if (this.footer) {
            this.footer.remove();
        }
        this.footer = this.createElement('div');
        addClass([this.footer], FOOTER);
        compiledString = compile(this.footerTemplate);
        let elements: [Element] = compiledString({}, null, null, this.footerTemplateId, this.isStringTemplate);
        for (let temp: number = 0; temp < elements.length; temp++) {
            this.footer.appendChild(elements[temp]);
        }
        this.DropDownBaseupdateBlazorTemplates(false, false, false, false, false, false, true);
        append([this.footer], this.popupWrapper);
        EventHandler.add(this.footer, 'mousedown', this.onListMouseDown, this);
    }
    private ClearAll(e: MouseEvent): void {
        if (this.enabled && !this.readonly) {
            let temp: string | number | boolean;
            if (this.value) {
                this.removeIndex = 0;
                for (temp = this.value[this.removeIndex]; this.removeIndex < this.value.length; temp = this.value[this.removeIndex]) {
                    this.removeValue(temp, e, null, true);
                }
            } else {
                this.clearAllCallback(e);
            }
        }
    }
    private clearAllCallback(e: MouseEvent): void {
        let tempValues: string[] | number[] = this.value ? <string[]>this.value.slice() : <string[]>[];
        if (this.mainList && this.listData && this.allowFiltering) {
            let list: HTMLElement = this.mainList.cloneNode ? <HTMLElement>this.mainList.cloneNode(true) : this.mainList;
            this.onActionComplete(list, this.mainData);
        }
        this.focusAtFirstListItem();
        this.updateDelimeter(this.delimiterChar);
        if (this.mode !== 'Box' && (!this.inputFocus || this.mode === 'CheckBox')) {
            this.updateDelimView();
        }
        this.makeTextBoxEmpty();
        this.checkPlaceholderSize();
        if (this.isPopupOpen()) {
            this.refreshPopup();
        }
        if (!this.inputFocus) {
            this.updateValueState(e, this.value, tempValues);
            if (this.mode !== 'CheckBox') {
                this.inputElement.focus();
            }
        }
        if (this.mode === 'CheckBox') {
            this.refreshPlaceHolder();
            this.refreshInputHight();
        }
        if (this.mode === 'CheckBox' && this.enableGroupCheckBox && !isNullOrUndefined(this.fields.groupBy)) {
            this.updateListItems(this.list.querySelectorAll('li.e-list-item'), this.mainList.querySelectorAll('li.e-list-item'));
        }
        e.preventDefault();
    }
    private windowResize(): void {
        this.refreshPopup();
        if ((!this.inputFocus || this.mode === 'CheckBox') && this.viewWrapper && this.viewWrapper.parentElement) {
            this.updateDelimView();
        }
    }
    private resetValueHandler(e: Event): void {
        let formElement: HTMLFormElement = closest(this.inputElement, 'form') as HTMLFormElement;
        if (formElement && e.target === formElement) {
            let textVal: string = (this.element.tagName === this.getNgDirective()) ? null : this.element.getAttribute('data-initial-value');
            this.text = textVal;
        }
    }
    protected wireEvent(): void {
        EventHandler.add(this.componentWrapper, 'mousedown', this.wrapperClick, this);
        EventHandler.add(<HTMLElement & Window>window, 'resize', this.windowResize, this);
        EventHandler.add(this.inputElement, 'focus', this.focusInHandler, this);
        EventHandler.add(this.inputElement, 'keydown', this.onKeyDown, this);
        EventHandler.add(this.inputElement, 'keyup', this.KeyUp, this);
        if (this.mode !== 'CheckBox') { EventHandler.add(this.inputElement, 'input', this.onInput, this); }
        EventHandler.add(this.inputElement, 'blur', this.onBlur, this);
        EventHandler.add(this.componentWrapper, 'mousemove', this.mouseIn, this);
        let formElement: HTMLFormElement = closest(this.inputElement, 'form') as HTMLFormElement;
        if (formElement) {
            EventHandler.add(formElement, 'reset', this.resetValueHandler, this);
        }
        EventHandler.add(this.componentWrapper, 'mouseout', this.mouseOut, this);
        EventHandler.add(this.overAllClear, 'mouseup', this.ClearAll, this);
    }
    private onInput(): void {
        if (this.keyDownStatus) {
            this.isValidKey = true;
        } else {
            this.isValidKey = false;
        }
        this.keyDownStatus = false;
    }
    protected preRender(): void {
        if (this.allowFiltering === null) {
            this.allowFiltering = (this.mode === 'CheckBox') ? true : false;
        }
        this.initializeData();
        this.updateDataAttribute(this.htmlAttributes);
        super.preRender();
    }
    protected getLocaleName(): string {
        return 'multi-select';
    };
    private initializeData(): void {
        this.mainListCollection = [];
        this.beforePopupOpen = false;
        this.filterAction = false;
        this.remoteFilterAction = false;
        this.isFirstClick = false;
        this.mobFilter = true;
        this.isFiltered = false;
        this.focused = true;
        this.initial = true;
        this.backCommand = true;
    }

    private updateData(delimiterChar: string): void {
        let data: string = '';
        let delim: boolean = this.mode === 'Delimiter' || this.mode === 'CheckBox';
        let text: string[] = <string[]>[];
        let temp: string;
        let tempData: Object = this.listData;
        this.listData = this.mainData;
        this.hiddenElement.innerHTML = '';
        if (!isNullOrUndefined(this.value)) {
            for (let index: number = 0; !isNullOrUndefined(this.value[index]); index++) {
                if (this.listData) {
                    temp = this.getTextByValue(this.value[index]);
                } else {
                    temp = <string>this.value[index];
                }
                data += temp + delimiterChar + ' ';
                text.push(temp);
                this.hiddenElement.innerHTML += '<option selected value ="' + this.value[index] + '">' + index + '</option>';
            }
        }
        this.setProperties({ text: text.toString() }, true);
        if (delim) {
            this.delimiterWrapper.innerHTML = data;
        }
        this.listData = <{ [key: string]: Object }[]>tempData;
    }
    private initialTextUpdate(): void {
        if (!isNullOrUndefined(this.text)) {
            let textArr: string[] = this.text.split(this.delimiterChar);
            let textVal: string[] | number[] | boolean[] = [];
            for (let index: number = 0; textArr.length > index; index++) {
                let val: string | boolean | number = this.getValueByText(textArr[index]);
                if (!isNullOrUndefined(val)) {
                    (<string[]>textVal).push(val as string);
                } else if ( this.allowCustomValue ) {
                    (<string[]>textVal).push(textArr[index] as string);
                }
            }
            if (textVal && textVal.length) {
                this.setProperties({ value: textVal }, true);
            }
        } else {
            this.setProperties({ value: null }, true);
        }
    }
    protected renderList(isEmptyData?: boolean): void {
        super.render(isEmptyData);
        this.wireListEvents();
    }
    private initialValueUpdate(): void {
        if (this.list) {
            let text: string;
            let textField: string;
            let valueField: string | number;
            let element: HTMLElement;
            let value: string | number | boolean;
            if (this.chipCollectionWrapper) {
                this.chipCollectionWrapper.innerHTML = '';
            }
            this.removeListSelection();
            if (!isNullOrUndefined(this.value)) {
                for (let index: number = 0; !isNullOrUndefined(this.value[index]); index++) {
                    value = this.value[index];
                    element = this.findListElement( this.hideSelectedItem ? this.ulElement : this.list, 'li', 'data-value', value);
                    text = this.getTextByValue(value);
                    if ((element && (element.getAttribute('aria-selected') !== 'true')) ||
                        (element && (element.getAttribute('aria-selected') === 'true' && this.hideSelectedItem) &&
                            (this.mode === 'Box' || this.mode === 'Default'))) {
                        this.addChip(text, value);
                        this.addListSelection(element);
                    } else if (value && this.allowCustomValue) {
                        let indexItem: number = this.listData.length;
                        let newValue: { [key: string]: string | Object } = {};
                        setValue(this.fields.text, value, newValue);
                        setValue(this.fields.value, value, newValue);
                        let noDataEle: HTMLElement = this.popupWrapper.querySelector('.' + dropDownBaseClasses.noData);
                        this.addItem(newValue, indexItem);
                        if (this.popupWrapper.contains(noDataEle)) {
                            this.list.setAttribute('style', noDataEle.getAttribute('style'));
                            this.popupWrapper.replaceChild(this.list, noDataEle);
                            this.wireListEvents();
                        }
                        this.addChip(text, value);
                        this.addListSelection(element);
                    }
                }
            }
            if (this.mode === 'CheckBox') {
                this.updateDelimView();
                this.updateValueState(null, this.value, this.tempValues);
                this.updateDelimeter(this.delimiterChar);
                this.refreshInputHight();
            } else {
                this.updateDelimeter(this.delimiterChar);
            }
            if (this.mode === 'CheckBox' && this.showSelectAll && (isNullOrUndefined(this.value) || !this.value.length)) {
                this.notify('checkSelectAll', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', value: 'uncheck' });
            }
            if (!this.inputFocus) {
                if (this.mode === 'Box') {
                    this.chipCollectionWrapper.style.display = '';
                } else if (this.mode === 'Delimiter' || this.mode === 'CheckBox') {
                    this.showDelimWrapper();
                }
            }
        }
    }
    protected updateActionCompleteData(li: HTMLElement, item: { [key: string]: Object }): void {
        if (this.value && (this.value as string[]).indexOf(li.getAttribute('data-value')) > -1) {
            this.mainList = this.ulElement;
            addClass([li], HIDE_LIST);
        }
    }
    protected isValidLI(li: Element | HTMLElement): boolean {
        return (li && !li.classList.contains(dropDownBaseClasses.disabled) && !li.classList.contains(dropDownBaseClasses.group) &&
            li.classList.contains(dropDownBaseClasses.li));
    };
    protected updateListSelection(li: Element, e: MouseEvent | KeyboardEventArgs, length?: number): void {
        let customVal: string | number | boolean = li.getAttribute('data-value');
        let value: string | number | boolean = this.getFormattedValue(customVal);
        if (this.allowCustomValue && (( customVal !== 'false' && value === false ) ||
        (!isNullOrUndefined(value) && value.toString() === 'NaN'))) {
            value = customVal;
        }
        let text: string = this.getTextByValue(value);
        this.removeHover();
        if (!this.value || (this.value as string[]).indexOf(value as string) === -1) {
            this.dispatchSelect(value, e, <HTMLElement>li, (li.getAttribute('aria-selected') === 'true'), length);
        } else {
            this.removeValue(value, e, length);
        }
    }
    private updateListSelectEventCallback(value: string | number | boolean, li: Element, e: MouseEvent | KeyboardEventArgs): void {
        let text: string = this.getTextByValue(value);
        if ((this.allowCustomValue || this.allowFiltering) && !this.findListElement(this.mainList, 'li', 'data-value', value)) {
            let temp: HTMLElement = <HTMLElement>li.cloneNode(true);
            let data: Object = this.getDataByValue(value);
            append([temp], this.mainList);
            (this.mainData as { [key: string]: object }[]).push(data as { [key: string]: object });
            let eventArgs: CustomValueEventArgs = {
                newData: data,
                cancel: false
            };
            this.trigger('customValueSelection', eventArgs, (eventArgs: CustomValueEventArgs) => {
                if (!eventArgs.cancel) {
                    this.remoteCustomValue = false;
                    this.addValue(value, text, e);
                }
            });
        } else {
            this.remoteCustomValue = false;
            this.addValue(value, text, e);
        }
    }
    protected removeListSelection(): void {
        let className: string = this.hideSelectedItem ?
            HIDE_LIST :
            dropDownBaseClasses.selected;
        let selectedItems: Element[] = <NodeListOf<Element> & Element[]>this.list.querySelectorAll('.' + className);
        let temp: number = selectedItems.length;
        if (selectedItems && selectedItems.length) {
            removeClass(selectedItems, className);
            while (temp > 0) {
                selectedItems[temp - 1].setAttribute('aria-selected', 'false');
                temp--;
            }
        }
        if (!isNullOrUndefined(this.mainList)) {
            let selectItems: Element[] = <NodeListOf<Element> & Element[]>this.mainList.querySelectorAll('.' + className);
            let temp1: number = selectItems.length;
            if (selectItems && selectItems.length) {
                removeClass(selectItems, className);
                while (temp1 > 0) {
                    selectItems[temp1 - 1].setAttribute('aria-selected', 'false');
                    if (this.mode === 'CheckBox') {
                        if (selectedItems && (selectedItems.length > (temp1 - 1))) {
                            selectedItems[temp1 - 1].firstElementChild.setAttribute('aria-checked', 'false');
                            removeClass([selectedItems[temp1 - 1].firstElementChild.lastElementChild], 'e-check');
                        }
                        selectItems[temp1 - 1].firstElementChild.setAttribute('aria-checked', 'false');
                        removeClass([selectItems[temp1 - 1].firstElementChild.lastElementChild], 'e-check');
                    }
                    temp1--;
                }
            }
        }
    };
    private removeHover(): void {
        let hoveredItem: Element[] = <NodeListOf<Element> & Element[]>this.list.querySelectorAll('.' + dropDownBaseClasses.hover);
        if (hoveredItem && hoveredItem.length) {
            removeClass(hoveredItem, dropDownBaseClasses.hover);
        }
    };
    private removeFocus(): void {
        if (this.list) {
            let hoveredItem: Element[] = <NodeListOf<Element> & Element[]>this.list.querySelectorAll('.' + dropDownBaseClasses.focus);
            let mainlist: Element[] = <NodeListOf<Element> & Element[]>this.mainList.querySelectorAll('.' + dropDownBaseClasses.focus);
            if (hoveredItem && hoveredItem.length) {
                removeClass(hoveredItem, dropDownBaseClasses.focus);
                removeClass(mainlist, dropDownBaseClasses.focus);
            }
        }
    };
    private addListHover(li: HTMLElement): void {
        if (this.enabled && this.isValidLI(li)) {
            this.removeHover();
            addClass([li], dropDownBaseClasses.hover);
        } else {
            if ((li !== null && li.classList.contains('e-list-group-item')) && this.enableGroupCheckBox && this.mode === 'CheckBox'
            && !isNullOrUndefined(this.fields.groupBy)) {
                this.removeHover();
                addClass([li], dropDownBaseClasses.hover);
            }
        }
    };
    private addListFocus(element: HTMLElement): void {
        if (this.enabled && this.isValidLI(element)) {
            this.removeFocus();
            addClass([element], dropDownBaseClasses.focus);
        } else {
            if (this.enableGroupCheckBox && this.mode === 'CheckBox' && !isNullOrUndefined(this.fields.groupBy)) {
                addClass([element], dropDownBaseClasses.focus);
            }
        }
    }
    private addListSelection(element: HTMLElement): void {
        let className: string = this.hideSelectedItem ?
            HIDE_LIST :
            dropDownBaseClasses.selected;
        if (this.isValidLI(element) && !element.classList.contains(dropDownBaseClasses.hover)) {
            addClass([element], className);
            this.updateMainList(false, <string>element.getAttribute('data-value'));
            element.setAttribute('aria-selected', 'true');
            if (this.mode === 'CheckBox') {
                let ariaCheck: string | null = element.firstElementChild.getAttribute('aria-checked');
                if (ariaCheck === 'false' || isNullOrUndefined(ariaCheck)) {
                    this.notify('updatelist', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', li: element, e: this });
                }
            }
            this.notify('activeList', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', li: element, e: this });
            if (this.chipCollectionWrapper !== null) {
                this.removeChipSelection();
            }
            attributes(this.inputElement, { 'aria-activedescendant': element.id });
        }
    }
    private updateDelimeter(delimChar: string): void {
        this.updateData(delimChar);
    }
    private onMouseClick(e: MouseEvent): void {
        this.scrollFocusStatus = false;
        let target: Element = <Element>e.target;
        let li: HTMLElement = <HTMLElement>closest(target, '.' + dropDownBaseClasses.li);
        let listElement : Element;
        if (!li && this.enableGroupCheckBox && this.mode === 'CheckBox' && this.fields.groupBy) {
            target = target.classList.contains('e-list-group-item') ? target.firstElementChild.lastElementChild
            : <Element>e.target;
            if (target.classList.contains('e-check')) {
                this.selectAllItem(false, e);
                target.classList.remove('e-check');
                target.classList.remove('e-stop');
                target.setAttribute('aria-selected', 'false');
            } else {
                this.selectAllItem(true, e);
                target.classList.remove('e-stop');
                target.classList.add('e-check');
                target.setAttribute('aria-selected', 'true');
            }
            this.refreshSelection();
        } else {
            if (this.isValidLI(li)) {
                let limit: number = this.value && this.value.length ? this.value.length : 0;
                if (li.classList.contains('e-active')) {
                    limit = limit - 1;
                }
                if (limit < this.maximumSelectionLength) {
                    this.updateListSelection(li, e);
                    this.addListFocus(<HTMLElement>li);
                    if ((this.allowCustomValue || this.allowFiltering) && this.mainList && this.listData) {
                        if (this.mode !== 'CheckBox') {
                            this.focusAtLastListItem(<string>li.getAttribute('data-value'));
                        }
                        this.refreshSelection();
                    } else {
                        this.makeTextBoxEmpty();
                    }
                }
                if (this.mode === 'CheckBox') {
                    this.updateDelimView();
                    this.updateDelimeter(this.delimiterChar);
                    this.refreshInputHight();
                } else {
                    this.updateDelimeter(this.delimiterChar);
                }
                this.checkSelectAll();
                this.refreshPopup();
                if (this.hideSelectedItem) {
                    this.focusAtFirstListItem();
                }
                if (this.closePopupOnSelect) {
                    this.hidePopup();
                } else {
                    e.preventDefault();
                }
                this.makeTextBoxEmpty();
            } else {
                e.preventDefault();
            }
            if (this.mode !== 'CheckBox') {
                this.refreshListItems(isNullOrUndefined(li) ? null : li.textContent);
            }
            this.refreshPlaceHolder();
            this.checkPlaceholderSize();
            this.findGroupStart(target as HTMLElement);
        }
    }
    private findGroupStart(target: HTMLElement): void {
        if (this.enableGroupCheckBox && this.mode === 'CheckBox' && !isNullOrUndefined(this.fields.groupBy)) {
            let count: number = 0;
            let liChecked : number = 0;
            let liUnchecked : number = 0;
            let groupValues: number[];
            if (this.itemTemplate && !target.getElementsByClassName('e-frame').length) {
                while (!target.getElementsByClassName('e-frame').length) {
                    target = target.parentElement;
                }
            }
            if (target.classList.contains('e-frame')) {
                target = target.parentElement.parentElement;
            }
            groupValues = this.findGroupAttrtibutes(target, liChecked, liUnchecked, count, 0);
            groupValues = this.findGroupAttrtibutes(target, groupValues[0], groupValues[1], groupValues[2], 1);
            while (!target.classList.contains('e-list-group-item')) {
                if (target.classList.contains('e-list-icon')) {
                    target = target.parentElement;
                }
                (target as Element) = target.previousElementSibling;
                if (target == null) {
                    break;
                }
            }
            this.updateCheckBox(target, groupValues[0], groupValues[1], groupValues[2]);
        }
    }

    private findGroupAttrtibutes(listElement: Element, checked: number, unChecked: number, count: number, position: number): number[] {
        while (!listElement.classList.contains('e-list-group-item')) {
            if (listElement.classList.contains('e-list-icon')) {
                listElement = listElement.parentElement;
            }
            if (listElement.getElementsByClassName('e-frame')[0].classList.contains('e-check') &&
            listElement.classList.contains('e-list-item')) {
                checked++;
            } else if (listElement.classList.contains('e-list-item')) {
                unChecked++;
            }
            count++;
            (listElement as Element) = position ? listElement.nextElementSibling : listElement.previousElementSibling;
            if (listElement == null) {
                break;
            }
        }
        return [checked, unChecked, count];
    }
    private updateCheckBox(groupHeader: Element, checked: number, unChecked: number, count: number): void {
        if (groupHeader === null) {
            return;
        }
        let checkBoxElement : Element = groupHeader.getElementsByClassName('e-frame')[0];
        if (count === checked) {
            checkBoxElement.classList.remove('e-stop');
            checkBoxElement.classList.add('e-check');
            groupHeader.setAttribute('aria-selected', 'true');
        } else if (count === unChecked) {
            checkBoxElement.classList.remove('e-check');
            checkBoxElement.classList.remove('e-stop');
            groupHeader.setAttribute('aria-selected', 'false');
        } else {
            checkBoxElement.classList.remove('e-check');
            checkBoxElement.classList.add('e-stop');
            groupHeader.setAttribute('aria-selected', 'false');
        }
    }
    private onMouseOver(e: MouseEvent): void {
        let currentLi: HTMLElement = <HTMLElement>closest(<Element>e.target, '.' + dropDownBaseClasses.li);
        if (currentLi === null && this.mode === 'CheckBox' && !isNullOrUndefined(this.fields.groupBy)
            && this.enableGroupCheckBox) {
            currentLi = <HTMLElement>closest(<Element>e.target, '.' + dropDownBaseClasses.group);
        }
        this.addListHover(currentLi);
    }
    private onMouseLeave(e: MouseEvent): void {
        this.removeHover();
    }
    private onListMouseDown(e: MouseEvent): void {
        e.preventDefault();
        this.scrollFocusStatus = true;
    }
    private onDocumentClick(e: MouseEvent): void {
        if (this.mode !== 'CheckBox') {
            let target: HTMLElement = <HTMLElement>e.target;
            if (!(!isNullOrUndefined(this.popupObj) && closest(target, '#' + this.popupObj.element.id)) &&
                !this.overAllWrapper.contains(e.target as Node)) {
                this.scrollFocusStatus = false;
            } else {
                this.scrollFocusStatus = (Browser.isIE || Browser.info.name === 'edge') && (document.activeElement === this.inputElement);
            }
        }
    }
    private wireListEvents(): void {
        EventHandler.add(document, 'mousedown', this.onDocumentClick, this);
        EventHandler.add(this.list, 'mousedown', this.onListMouseDown, this);
        EventHandler.add(this.list, 'mouseup', this.onMouseClick, this);
        EventHandler.add(this.list, 'mouseover', this.onMouseOver, this);
        EventHandler.add(this.list, 'mouseout', this.onMouseLeave, this);
    };
    private unwireListEvents(): void {
        EventHandler.remove(document, 'mousedown', this.onDocumentClick);
        if (this.list) {
            EventHandler.remove(this.list, 'mousedown', this.onListMouseDown);
            EventHandler.remove(this.list, 'mouseup', this.onMouseClick);
            EventHandler.remove(this.list, 'mouseover', this.onMouseOver);
            EventHandler.remove(this.list, 'mouseout', this.onMouseLeave);

        }
    };
    private hideOverAllClear(): void {
        if (!this.value || !this.value.length || this.inputElement.value === '') {
            this.overAllClear.style.display = 'none';
        }
    }
    private showOverAllClear(): void {
        if (((this.value && this.value.length) || this.inputElement.value !== '') && this.showClearButton && this.readonly !== true) {
            this.overAllClear.style.display = '';
        } else {
            this.overAllClear.style.display = 'none';
        }
    }

    /**
     * Sets the focus to widget for interaction.
     * @returns void
     */
    public focusIn(): void {
        if (document.activeElement !== this.inputElement && this.enabled) {
            this.inputElement.focus();
        }
    }

    /**
     * Remove the focus from widget, if the widget is in focus state. 
     * @returns void
     */
    public focusOut(): void {
        if (document.activeElement === this.inputElement && this.enabled) {
            this.inputElement.blur();
        }
    }
    /**
     * Shows the spinner loader.
     * @returns void.
     */
    public showSpinner(): void {
        if (isNullOrUndefined(this.spinnerElement)) {
            if (this.overAllClear.style.display !== 'none') {
                this.spinnerElement = this.overAllClear;
            } else {
                this.spinnerElement = this.createElement('span', { className: CLOSEICON_CLASS + ' ' + SPINNER_CLASS });
                this.componentWrapper.appendChild(this.spinnerElement);
            }
            createSpinner({ target: this.spinnerElement, width: Browser.isDevice ? '16px' : '14px' }, this.createElement);
            addClass([this.spinnerElement], DISABLE_ICON);
            showSpinner(this.spinnerElement);
        }
    }
    /**
     * Hides the spinner loader.
     * @returns void.
     */
    public hideSpinner(): void {
        if (!isNullOrUndefined(this.spinnerElement)) {
            hideSpinner(this.spinnerElement);
            removeClass([this.spinnerElement], DISABLE_ICON);
            if (this.spinnerElement.classList.contains(SPINNER_CLASS)) {
                detach(this.spinnerElement);
            } else {
                this.spinnerElement.innerHTML = '';
            }
            this.spinnerElement = null;
        }
    }
    private updateDelimView(): void {
        if (this.delimiterWrapper) {
            this.hideDelimWrapper();
        }
        if (this.chipCollectionWrapper) {
            this.chipCollectionWrapper.style.display = 'none';
        }
        this.viewWrapper.style.display = '';
        this.viewWrapper.style.width = '';
        this.viewWrapper.classList.remove(TOTAL_COUNT_WRAPPER);
        if (this.value && this.value.length) {
            let data: string = '';
            let temp: string;
            let tempData: string;
            let tempIndex: number = 1;
            let wrapperleng: number;
            let remaining: number;
            let downIconWidth: number = 0;
            let overAllContainer: number;
            this.viewWrapper.innerHTML = '';
            let l10nLocale: Object = {
                noRecordsTemplate: 'No Records Found',
                actionFailureTemplate: 'The Request Failed',
                overflowCountTemplate: '+${count} more..',
                totalCountTemplate: '${count} selected'
            };
            let l10n: L10n = new L10n(this.getLocaleName(), {}, this.locale);
            if (l10n.getConstant('actionFailureTemplate') === '') {
                l10n = new L10n('dropdowns', l10nLocale, this.locale);
            }
            let remainContent: string = l10n.getConstant('overflowCountTemplate');
            let raminElement: HTMLElement = this.createElement('span', {
                className: REMAIN_WRAPPER
            });
            let compiledString: Function = compile(remainContent);
            let totalCompiledString: Function = compile(l10n.getConstant('totalCountTemplate'));
            raminElement.appendChild(compiledString({ 'count': this.value.length })[0]);
            this.viewWrapper.appendChild(raminElement);
            let remainSize: number = raminElement.offsetWidth;
            remove(raminElement);
            if (this.showDropDownIcon) {
                downIconWidth = this.dropIcon.offsetWidth +
                    parseInt(window.getComputedStyle(this.dropIcon).marginRight, 10);
            }
            if (!isNullOrUndefined(this.value)) {
                for (let index: number = 0; !isNullOrUndefined(this.value[index]); index++) {
                    data += (index === 0) ? '' : this.delimiterChar + ' ';
                    temp = this.getOverflowVal(index);
                    data += temp;
                    temp = this.viewWrapper.innerHTML;
                    this.viewWrapper.innerHTML = data;
                    wrapperleng = this.viewWrapper.offsetWidth +
                        parseInt(window.getComputedStyle(this.viewWrapper).paddingRight, 10);
                    overAllContainer = this.componentWrapper.offsetWidth -
                        parseInt(window.getComputedStyle(this.componentWrapper).paddingLeft, 10) -
                        parseInt(window.getComputedStyle(this.componentWrapper).paddingRight, 10);
                    if ((wrapperleng + downIconWidth) > overAllContainer) {
                        if (tempData !== undefined && tempData !== '') {
                            temp = tempData;
                            index = tempIndex + 1;
                        }
                        this.viewWrapper.innerHTML = temp;
                        remaining = this.value.length - index;
                        wrapperleng = this.viewWrapper.offsetWidth;
                        while (((wrapperleng + remainSize + downIconWidth) > overAllContainer) && wrapperleng !== 0
                            && this.viewWrapper.innerHTML !== '') {
                            let textArr: string[] = this.viewWrapper.innerHTML.split(this.delimiterChar);
                            textArr.pop();
                            this.viewWrapper.innerHTML = textArr.join(this.delimiterChar);
                            remaining++;
                            wrapperleng = this.viewWrapper.offsetWidth;
                        }
                        break;
                    } else if ((wrapperleng + remainSize + downIconWidth) <= overAllContainer) {
                        tempData = data;
                        tempIndex = index;
                    } else if (index === 0) {
                        tempData = '';
                        tempIndex = -1;
                    }
                }
            }
            if (remaining > 0) {
                let totalWidth: number = overAllContainer - downIconWidth;
                this.viewWrapper.appendChild(
                    this.updateRemainTemplate( raminElement, this.viewWrapper, remaining, compiledString, totalCompiledString, totalWidth)
                );
                this.updateRemainWidth(this.viewWrapper, totalWidth);
                this.updateRemainingText(raminElement, downIconWidth, remaining, compiledString, totalCompiledString);
            }
        } else {
            this.viewWrapper.innerHTML = '';
            this.viewWrapper.style.display = 'none';
        }
    }
    private updateRemainWidth(viewWrapper: HTMLElement, totalWidth: number): void {
        if (viewWrapper.classList.contains(TOTAL_COUNT_WRAPPER) && totalWidth < (viewWrapper.offsetWidth +
            parseInt(window.getComputedStyle(viewWrapper).paddingLeft, 10)
            + parseInt(window.getComputedStyle(viewWrapper).paddingLeft, 10))) {
            viewWrapper.style.width = totalWidth + 'px';
        }
    }
    private updateRemainTemplate(
        raminElement: HTMLElement,
        viewWrapper: HTMLElement,
        remaining: number,
        compiledString: Function,
        totalCompiledString: Function,
        totalWidth?: number): HTMLElement {
        if (viewWrapper.firstChild && viewWrapper.firstChild.nodeType === 3 && viewWrapper.firstChild.nodeValue === '') {
            viewWrapper.removeChild(viewWrapper.firstChild);
        }
        raminElement.innerHTML = '';
        raminElement.appendChild(
            (viewWrapper.firstChild && viewWrapper.firstChild.nodeType === 3) ?
            compiledString({ 'count': remaining })[0] :
            totalCompiledString({ 'count': remaining })[0]);
        if (viewWrapper.firstChild && viewWrapper.firstChild.nodeType === 3) {
            viewWrapper.classList.remove(TOTAL_COUNT_WRAPPER);
        } else {
            viewWrapper.classList.add(TOTAL_COUNT_WRAPPER);
            this.updateRemainWidth(viewWrapper, totalWidth);
        }
        return raminElement;
    }
    private updateRemainingText(
        raminElement: HTMLElement,
        downIconWidth: number,
        remaining: number,
        compiledString: Function,
        totalCompiledString: Function): void {
        let overAllContainer: number = this.componentWrapper.offsetWidth -
            parseInt(window.getComputedStyle(this.componentWrapper).paddingLeft, 10) -
            parseInt(window.getComputedStyle(this.componentWrapper).paddingRight, 10);
        let wrapperleng: number = this.viewWrapper.offsetWidth + parseInt(window.getComputedStyle(this.viewWrapper).paddingRight, 10);
        if (((wrapperleng + downIconWidth) >= overAllContainer) && wrapperleng !== 0 && this.viewWrapper.firstChild &&
            this.viewWrapper.firstChild.nodeType === 3) {
            while (((wrapperleng + downIconWidth) > overAllContainer)  && wrapperleng !== 0 && this.viewWrapper.firstChild &&
                this.viewWrapper.firstChild.nodeType === 3) {
                let textArr: string[] = (this.viewWrapper.firstChild as Text).nodeValue.split(this.delimiterChar);
                textArr.pop();
                this.viewWrapper.firstChild.nodeValue = textArr.join(this.delimiterChar);
                if (this.viewWrapper.firstChild.nodeValue === '') {
                    this.viewWrapper.removeChild(this.viewWrapper.firstChild);
                }
                remaining++;
                wrapperleng = this.viewWrapper.offsetWidth;
            }
            let totalWidth: number = overAllContainer - downIconWidth;
            this.updateRemainTemplate( raminElement, this.viewWrapper, remaining, compiledString, totalCompiledString, totalWidth);
        }
    }
    private getOverflowVal(index: number): string {
        let temp: string;
        if (this.mainData && this.mainData.length) {
            if (this.mode === 'CheckBox') {
                let newTemp: { [key: string]: Object }[] | number[] | boolean[] | string[] = this.listData;
                this.listData = this.mainData;
                temp = this.getTextByValue(this.value[index]);
                this.listData = newTemp;
            } else {
                temp = this.getTextByValue(this.value[index]);
            }
        } else {
            temp = <string>this.value[index];
        }
        return temp;
    }
    private unWireEvent(): void {
        EventHandler.remove(this.componentWrapper, 'mousedown', this.wrapperClick);
        EventHandler.remove(<HTMLElement & Window>window, 'resize', this.windowResize);
        EventHandler.remove(this.inputElement, 'focus', this.focusInHandler);
        EventHandler.remove(this.inputElement, 'keydown', this.onKeyDown);
        if (this.mode !== 'CheckBox') { EventHandler.remove(this.inputElement, 'input', this.onInput); }
        EventHandler.remove(this.inputElement, 'keyup', this.KeyUp);
        let formElement: HTMLFormElement = closest(this.inputElement, 'form') as HTMLFormElement;
        if (formElement) {
            EventHandler.remove(formElement, 'reset', this.resetValueHandler);
        }
        EventHandler.remove(this.inputElement, 'blur', this.onBlur);
        EventHandler.remove(this.componentWrapper, 'mousemove', this.mouseIn);
        EventHandler.remove(this.componentWrapper, 'mouseout', this.mouseOut);
        EventHandler.remove(this.overAllClear, 'mousedown', this.ClearAll);
    }
    private selectAllItem(state: boolean, event?: MouseEvent | KeyboardEventArgs, list? : HTMLElement): void {
        let li: HTMLElement[] & NodeListOf<Element>;
        li = <HTMLElement[] & NodeListOf<Element>>this.list.querySelectorAll(state ?
            'li.e-list-item:not([aria-selected="true"]):not(.e-reorder-hide)' :
            'li.e-list-item[aria-selected="true"]:not(.e-reorder-hide)');
        if (this.enableGroupCheckBox && this.mode === 'CheckBox' && !isNullOrUndefined(this.fields.groupBy)) {
            let target: Element = <Element>event.target;
            target = ((event as KeyboardEvent).keyCode === 32) ? list : target;
            target = (target.classList.contains('e-frame')) ? target.parentElement.parentElement : target;
            if (target.classList.contains('e-list-group-item')) {
                let listElement : Element = target.nextElementSibling;
                if (isNullOrUndefined(listElement)) {
                    return;
                }
                while (listElement.classList.contains('e-list-item')) {
                    if (state) {
                        if (!listElement.firstElementChild.lastElementChild.classList.contains('e-check')) {
                            this.updateListSelection(listElement, event);
                        }
                    } else {
                        if (listElement.firstElementChild.lastElementChild.classList.contains('e-check')) {
                            this.updateListSelection(listElement, event);
                        }
                    }
                    listElement = listElement.nextElementSibling;
                    if (listElement == null) {
                        break;
                    }
                }
                if (target.classList.contains('e-list-group-item')) {
                    let focusedElement: Element = this.list.getElementsByClassName('e-item-focus')[0];
                    if (focusedElement) {
                        focusedElement.classList.remove('e-item-focus');
                    }
                    state ? target.classList.add('e-active') : target.classList.remove('e-active');
                    target.classList.add('e-item-focus');
                }
                this.textboxValueUpdate();
                this.checkPlaceholderSize();
            } else if (target.classList.contains('e-selectall-parent') || target.parentElement.classList.contains('e-selectall-parent')) {
                this.updateValue(event, li);
            }
        } else {
            this.updateValue(event, li);
        }
    }
    private updateValue (event: MouseEvent | KeyboardEventArgs, li : NodeListOf<HTMLElement>| HTMLElement[]): void {
        let length: number = li.length;
        if (li && li.length) {
            let index: number = 0;
            while (index < length && index <= 50) {
                this.updateListSelection(li[index], event, length - index);
                this.findGroupStart(li[index]);
                index++;
            }
            if (length > 50) {
                setTimeout(
                    (): void => {
                        while (index < length) {
                            this.updateListSelection(li[index], event, length - index);
                            this.findGroupStart(li[index]);
                            index++;
                        }
                        this.textboxValueUpdate();
                    },
                    0
                );
            }
        }
        this.textboxValueUpdate();
        this.checkPlaceholderSize();
    }
    private textboxValueUpdate(): void {
        if (this.mode !== 'Box' && !this.isPopupOpen()) {
            this.updateDelimView();
        } else {
            this.searchWrapper.classList.remove(ZERO_SIZE);
        }
        if (this.mode === 'CheckBox') {
            this.updateDelimView();
            this.updateDelimeter(this.delimiterChar);
            this.refreshInputHight();
        } else {
            this.updateDelimeter(this.delimiterChar);
        }
        this.refreshPlaceHolder();
    }
    protected setZIndex(): void {
        if (this.popupObj) {
            this.popupObj.setProperties({ 'zIndex': this.zIndex });
        }
    }
    protected updateDataSource(prop?: MultiSelectModel): void {
        if (isNullOrUndefined(this.list)) {
            this.renderPopup();
        } else {
            this.resetList(this.dataSource);
        }
        if (this.value && this.value.length) {
            this.setProperties({ 'value': this.value });
            this.refreshSelection();
        }
    }
    private onLoadSelect(): void {
        this.setDynValue = true;
        this.renderPopup();
    }
    protected selectAllItems(state: boolean, event?: MouseEvent): void {
        if (isNullOrUndefined(this.list)) {
            this.selectAllAction = () => {
                if (this.mode === 'CheckBox' && this.showSelectAll) {
                    let args: { [key: string]: Object | string } = {
                        module: 'CheckBoxSelection',
                        enable: this.mode === 'CheckBox',
                        value: state ? 'check' : 'uncheck'
                    };
                    this.notify('checkSelectAll', args);
                }
                this.selectAllItem(state, event);
                this.selectAllAction = null;
            };
            super.render();
        } else {
            this.selectAllAction = null;
            if (this.mode === 'CheckBox' && this.showSelectAll) {
                let args: { [key: string]: Object | string } = {
                    value: state ? 'check' : 'uncheck',
                    enable: this.mode === 'CheckBox',
                    module: 'CheckBoxSelection'
                };
                this.notify('checkSelectAll', args);
            }
            this.selectAllItem(state, event);
        }
    }
    /**
     * Get the properties to be maintained in the persisted state.
     */
    protected getPersistData(): string {
        return this.addOnPersist(['value']);
    };

    /**
     * Dynamically change the value of properties. 
     * @private
     */
    public onPropertyChanged(newProp: MultiSelectModel, oldProp: MultiSelectModel): void {
        if (newProp.dataSource && !isNullOrUndefined(Object.keys(newProp.dataSource))) {
            this.mainList = null;
            this.mainData = null;
            this.isFirstClick = false;
        }
        if (this.getModuleName() === 'multiselect') {
            this.setUpdateInitial(['fields', 'query', 'dataSource'], newProp as { [key: string]: string; });
        }
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'query':
                case 'dataSource':
                    if (this.mode === 'CheckBox' && this.showSelectAll) {
                        if (!isNullOrUndefined(this.popupObj)) {
                            this.popupObj.destroy();
                            this.popupObj = null;
                        }
                        this.renderPopup();
                    }
                    break;
                case 'htmlAttributes': this.updateHTMLAttribute();
                    break;
                case 'showClearButton': this.updateClearButton(newProp.showClearButton);
                    break;
                case 'text':
                    this.updateVal(this.value, this.value, 'text');
                    break;
                case 'value':
                    this.updateVal(this.value, oldProp.value, 'value');
                    break;
                case 'width':
                    setStyleAttribute(this.overAllWrapper, { 'width': formatUnit(newProp.width) });
                    this.popupObj.setProperties({ width: this.calcPopupWidth() });
                    break;
                case 'placeholder': this.refreshPlaceHolder();
                    break;
                case 'filterBarPlaceholder':
                    if (this.allowFiltering) {
                        this.notify('filterBarPlaceholder', { filterBarPlaceholder: newProp.filterBarPlaceholder });
                    }
                    break;
                case 'delimiterChar':
                    if (this.mode !== 'Box') { this.updateDelimView(); }
                    this.updateData(newProp.delimiterChar);
                    break;
                case 'cssClass':
                    this.popupWrapper.classList.remove(oldProp.cssClass);
                    this.overAllWrapper.classList.remove(oldProp.cssClass);
                    this.updateCssClass();
                    break;
                case 'enableRtl':
                    this.enableRTL(newProp.enableRtl);
                    super.onPropertyChanged(newProp, oldProp);
                    break;
                case 'readonly':
                    this.updateReadonly(newProp.readonly);
                    this.hidePopup();
                    break;
                case 'enabled':
                    this.hidePopup();
                    this.enable(newProp.enabled);
                    break;
                case 'showSelectAll':
                    if (this.popupObj) {
                        this.popupObj.destroy();
                        this.popupObj = null;
                    }
                    this.renderPopup();
                    break;
                case 'showDropDownIcon':
                    this.dropDownIcon();
                    break;
                case 'floatLabelType':
                    this.setFloatLabelType();
                    break;
                case 'enableSelectionOrder':
                    break;
                case 'selectAllText':
                    this.notify('selectAllText', false);
                    break;
                case 'popupHeight':
                case 'headerTemplate':
                case 'footerTemplate':
                    this.reInitializePoup();
                    break;
                case 'allowFiltering':
                    if (this.mode === 'CheckBox' && this.popupObj) {
                        this.reInitializePoup();
                    }
                    break;
                default:
                    let msProps: { [key: string]: Object };
                    msProps = this.getPropObject(prop, <{ [key: string]: string; }>newProp, <{ [key: string]: string; }>oldProp);
                    super.onPropertyChanged(msProps.newProperty, msProps.oldProperty);
                    break;
            }
        }
    }
    private reInitializePoup(): void {
        if (this.popupObj) {
            this.popupObj.destroy();
            this.popupObj = null;
        }
        this.renderPopup();
    }
    private updateVal(
        newProp: string[] | boolean[] | number[],
        oldProp: string[] | boolean[] | number[],
        prop: string): void {
        if (!this.list) {
            this.onLoadSelect();
        } else if (!this.inputFocus) {
            if (prop === 'text') {
                this.initialTextUpdate();
                newProp = this.value;
            }
            this.initialValueUpdate();
            if (this.mode !== 'Box') { this.updateDelimView(); }
            this.refreshInputHight();
            this.refreshPlaceHolder();
            this.updateValueState(null, newProp, oldProp);
            this.checkPlaceholderSize();
        }
    }
    /**
     * Hides the popup, if the popup in a open state.
     * @returns void
     */
    public hidePopup(): void {
        let delay: number = 100;
        if (this.isPopupOpen()) {
            let animModel: AnimationModel = {
                name: 'FadeOut',
                duration: 100,
                delay: delay ? delay : 0
            };
            let eventArgs: PopupEventArgs = { popup: this.popupObj, cancel: false, animation: animModel };
            this.trigger('close', eventArgs, (eventArgs: PopupEventArgs) => {
                if (!eventArgs.cancel) {
                    this.beforePopupOpen = false;
                    this.overAllWrapper.classList.remove(iconAnimation);
                    this.popupObj.hide(new Animation(eventArgs.animation));
                    attributes(this.inputElement, { 'aria-expanded': 'false' });
                    if (this.allowFiltering) {
                        this.notify('inputFocus', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', value: 'clear' });
                    }
                    this.popupObj.hide();
                    removeClass([document.body, this.popupObj.element], 'e-popup-full-page');
                    EventHandler.remove(this.list, 'keydown', this.onKeyDown);
                }
            });
        }
    }
    /**
     * Shows the popup, if the popup in a closed state.
     * @returns void
     */
    public showPopup(): void {
        if (!this.enabled) {
            return;
        }
        if (!this.ulElement) {
            this.beforePopupOpen = true;
            super.render();
            return;
        }
        let mainLiLength: number = this.ulElement.querySelectorAll('li.' + 'e-list-item').length;
        let liLength: number = this.ulElement.querySelectorAll('li.'
            + dropDownBaseClasses.li + '.' + HIDE_LIST).length;
        if (mainLiLength > 0 && (mainLiLength === liLength) && (liLength === this.mainData.length)) {
            this.beforePopupOpen = false;
            return;
        }
        this.onPopupShown();
    }
    /**
     * Based on the state parameter, entire list item will be selected/deselected.
     * parameter
     * `true`   - Selects entire list items.
     * `false`  - Un Selects entire list items.
     * @returns void
     */
    public selectAll(state: boolean): void {
        this.selectAllItems(state);
    }

    public getModuleName(): string {
        return 'multiselect';
    };
    /**
     * To Initialize the control rendering
     * @private
     */
    public render(): void {
        this.setDynValue = this.initStatus = false;
        this.searchWrapper = this.createElement('span', { className: SEARCHBOX_WRAPPER + ' ' + ((this.mode === 'Box') ? BOX_ELEMENT : '')});
        this.viewWrapper = this.createElement('span', { className: DELIMITER_VIEW + ' ' + DELIMITER_WRAPPER, styles: 'display:none;' });
        this.overAllClear = this.createElement('span', {
            className: CLOSEICON_CLASS, styles: 'display:none;'
        });
        this.componentWrapper = this.createElement('div', { className: ELEMENT_WRAPPER }) as HTMLDivElement;
        this.overAllWrapper = this.createElement('div', { className: OVER_ALL_WRAPPER }) as HTMLDivElement;
        if (this.mode === 'CheckBox') { addClass([this.overAllWrapper], 'e-checkbox'); }
        if (Browser.isDevice) {
            this.componentWrapper.classList.add(ELEMENT_MOBILE_WRAPPER);
        }
        this.overAllWrapper.style.width = formatUnit(this.width);
        this.overAllWrapper.appendChild(this.componentWrapper);
        this.popupWrapper = this.createElement('div', { id: this.element.id + '_popup', className: POPUP_WRAPPER }) as HTMLDivElement;
        if (this.mode === 'Delimiter' || this.mode === 'CheckBox') {
            this.delimiterWrapper = this.createElement('span', { className: DELIMITER_WRAPPER, styles: 'display:none' });
            this.componentWrapper.appendChild(this.delimiterWrapper);
        } else {
            this.chipCollectionWrapper = this.createElement('span', {
                className: CHIP_WRAPPER,
                styles: 'display:none'
            });
            this.componentWrapper.appendChild(this.chipCollectionWrapper);
        }
        if (this.mode !== 'Box') {
            this.componentWrapper.appendChild(this.viewWrapper);
        }
        this.componentWrapper.appendChild(this.searchWrapper);
        if (this.showClearButton && !Browser.isDevice) {
            this.componentWrapper.appendChild(this.overAllClear);
        } else {
            this.componentWrapper.classList.add(CLOSE_ICON_HIDE);
        }
        this.dropDownIcon();
        this.inputElement = this.createElement('input', {
            className: INPUT_ELEMENT,
            attrs: {
                spellcheck: 'false',
                type: 'text',
                autocomplete: 'off',
                tabindex: '0'
            }
        }) as HTMLInputElement;
        if (this.element.tagName !== this.getNgDirective()) {
            this.element.style.display = 'none';
        }
        if (this.element.tagName === this.getNgDirective()) {
            this.element.appendChild(this.overAllWrapper);
            this.searchWrapper.appendChild(this.inputElement);
        } else {
            this.element.parentElement.insertBefore(this.overAllWrapper, this.element);
            this.searchWrapper.appendChild(this.inputElement);
            this.searchWrapper.appendChild(this.element);
            this.element.removeAttribute('tabindex');
        }
        if (this.floatLabelType !== 'Never') {
            createFloatLabel(
                this.overAllWrapper, this.searchWrapper,
                this.element, this.inputElement,
                this.value, this.floatLabelType, this.placeholder
            );
        } else if (this.floatLabelType === 'Never') {
            this.refreshPlaceHolder();
        }
        this.element.style.opacity = '';
        let id: string = this.element.getAttribute('id') ? this.element.getAttribute('id') : getUniqueID('ej2_dropdownlist');
        this.element.id = id;
        this.hiddenElement = this.createElement('select', {
            attrs: { 'aria-hidden': 'true', 'class': HIDDEN_ELEMENT, 'tabindex': '-1', 'multiple': '' }
        }) as HTMLSelectElement;
        this.componentWrapper.appendChild(this.hiddenElement);
        this.validationAttribute(this.element, this.hiddenElement);
        if (this.mode !== 'CheckBox') { this.hideOverAllClear(); }
        this.wireEvent();
        this.enable(this.enabled);
        this.enableRTL(this.enableRtl);
        this.checkInitialValue();
    }
    private checkInitialValue(): void {
        let isData: boolean = this.dataSource instanceof Array ? (this.dataSource.length > 0)
                : !isNullOrUndefined(this.dataSource);
        if (!(this.value && this.value.length) &&
            isNullOrUndefined(this.text) &&
            !isData &&
            this.element.tagName === 'SELECT' &&
            (<HTMLSelectElement>this.element).options.length > 0) {
            let optionsElement: HTMLOptionsCollection = (<HTMLSelectElement>this.element).options;
            let valueCol: string[] = [];
            let textCol: string = '';
            for (let index: number = 0, optionsLen: number = optionsElement.length; index < optionsLen; index++) {
                let opt: HTMLOptionElement = optionsElement[index];
                if (!isNullOrUndefined(opt.getAttribute('selected'))) {
                    (opt.getAttribute('value')) ? valueCol.push(opt.getAttribute('value')) : textCol += (opt.text + this.delimiterChar);
                }
            }
            if (valueCol.length > 0) {
                this.setProperties({value: valueCol}, true);
            } else if (textCol !== '') {
                this.setProperties({text: textCol}, true);
            }
            if (valueCol.length > 0 || textCol !== '') {
                this.refreshInputHight();
                this.refreshPlaceHolder();
            }
        }
        if ((this.value && this.value.length) || !isNullOrUndefined(this.text)) { this.renderPopup(); }
        if (!isNullOrUndefined(this.text) && (isNullOrUndefined(this.value) || this.value.length === 0)) { this.initialTextUpdate(); }
        if (this.value && this.value.length) {
            if (!(this.dataSource instanceof DataManager)) {
                this.initialValueUpdate();
                this.initialUpdate();
            } else {
                this.setInitialValue = () => {
                    this.initStatus = false;
                    this.initialValueUpdate();
                    this.initialUpdate();
                    this.setInitialValue = null;
                    this.initStatus = true;
                };
            }
        } else {
            this.initialUpdate();
        }
        this.initStatus = true;
        this.checkAutoFocus();
        if (!isNullOrUndefined(this.text)) {
            this.element.setAttribute('data-initial-value', this.text);
        }
    }
    private checkAutoFocus(): void {
        if (this.element.hasAttribute('autofocus')) {
            this.inputElement.focus();
        }
    }
    private setFloatLabelType(): void {
        removeFloating(
            this.overAllWrapper,
            this.componentWrapper,
            this.searchWrapper,
            this.inputElement,
            this.value,
            this.floatLabelType,
            this.placeholder
        );
        if (this.floatLabelType !== 'Never') {
            createFloatLabel(
                this.overAllWrapper,
                this.searchWrapper,
                this.element,
                this.inputElement,
                this.value,
                this.floatLabelType,
                this.placeholder
            );
        }
    }
    private dropDownIcon(): void {
        if (this.showDropDownIcon) {
            this.dropIcon = this.createElement('span', { className: dropdownIcon });
            this.componentWrapper.appendChild(this.dropIcon);
            addClass([this.componentWrapper], ['e-down-icon']);
        } else {
            if (!isNullOrUndefined(this.dropIcon)) {
                this.dropIcon.parentElement.removeChild(this.dropIcon);
                removeClass([this.componentWrapper], ['e-down-icon']);
            }
        }
    }
    private initialUpdate(): void {
        if (this.mode !== 'Box') {
            this.updateDelimView();
        }
        this.updateCssClass();
        this.updateHTMLAttribute();
        this.updateReadonly(this.readonly);
        this.refreshInputHight();
        this.checkPlaceholderSize();
    }
    /**
     * Removes the component from the DOM and detaches all its related event handlers. Also it removes the attributes and classes.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        if (this.popupObj) {
            this.popupObj.hide();
        }
        this.notify(destroy, {});
        this.unwireListEvents();
        this.unWireEvent();
        this.list = null;
        this.popupObj = null;
        this.mainList = null;
        this.mainData = null;
        super.destroy();
        let temp: string[] = ['readonly', 'aria-disabled', 'aria-placeholder', 'placeholder'];
        let length: number = temp.length;
        while (length > 0) {
            this.inputElement.removeAttribute(temp[length - 1]);
            length--;
        }
        this.element.removeAttribute('data-initial-value');
        this.element.style.display = 'block';
        if (this.overAllWrapper.parentElement) {
            if (this.overAllWrapper.parentElement.tagName === this.getNgDirective()) {
                remove(this.overAllWrapper);
            } else {
                this.overAllWrapper.parentElement.insertBefore(this.element, this.overAllWrapper);
                remove(this.overAllWrapper);
            }
        }
    };
}
export interface CustomValueEventArgs {
    /**
     * Gets the newly added data.
     * @isGenericType true
     */
    newData: Object;
    /**
     * Illustrates whether the current action needs to be prevented or not.
     */
    cancel: boolean;
}

export interface TaggingEventArgs {
    /**
     * If the event is triggered by interaction, it returns true. Otherwise, it returns false.
     */
    isInteracted: boolean;
    /**
     * Returns the selected item as JSON Object from the data source.
     * @isGenericType true
     */
    itemData: FieldSettingsModel;
    /**
     * Specifies the original event arguments.
     */
    e: MouseEvent | KeyboardEvent | TouchEvent;
    /**
     * To set the classes to chip element
     * @param  { string } classes - Specify the classes to chip element.
     * @return {void}.
     */
    setClass: Function;
    /**
     * Illustrates whether the current action needs to be prevented or not.
     */
    cancel: boolean;
}
export interface MultiSelectChangeEventArgs {
    /**
     * If the event is triggered by interaction, it returns true. Otherwise, it returns false.
     */
    isInteracted: boolean;
    /**
     * Returns the component initial Value.
     * @isGenericType true
     */
    oldValue: number[] | string[] | boolean[];
    /**
     * Returns the updated component Values.
     * @isGenericType true
     */
    value: number[] | string[] | boolean[];
    /**
     * Specifies the original event arguments.
     */
    e: MouseEvent | KeyboardEvent | TouchEvent;
    /**
     * Returns the root element of the component.
     */
    element: HTMLElement;
}
export type visualMode = 'Default' | 'Delimiter' | 'Box' | 'CheckBox';

export interface ISelectAllEventArgs {
    /**
     * If the event is triggered by interaction, it returns true. Otherwise, it returns false.
     */
    isInteracted: boolean;
    /**
     * Returns the selected list items.
     */
    items: HTMLLIElement[];
    /**
     * Returns the selected items as JSON Object from the data source.
     * @isGenericType true
     */
    itemData: FieldSettingsModel[];
    /**
     * Specifies the original event arguments.
     */
    event: MouseEvent | KeyboardEvent | TouchEvent;
    /**
     * Specifies whether it is selectAll or deSelectAll.
     */
    isChecked?: boolean;

}
