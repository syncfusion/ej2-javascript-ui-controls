import { Input, InputObject, FloatLabelType } from '@syncfusion/ej2-inputs';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { NotifyPropertyChanges, INotifyPropertyChanged, Property, Event, EmitType } from '@syncfusion/ej2-base';
import { Component, EventHandler, attributes, formatUnit, ChildProperty, remove, L10n, extend } from '@syncfusion/ej2-base';
import { addClass, removeClass, detach, prepend, Complex, closest, setValue, getValue, compile, append } from '@syncfusion/ej2-base';
import { select, selectAll, isNullOrUndefined as isNOU, matches, Browser } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { Popup } from '@syncfusion/ej2-popups';
import { updateBlazorTemplate, resetBlazorTemplate, isBlazor} from '@syncfusion/ej2-base';
import { TreeView, NodeSelectEventArgs, DataBoundEventArgs, FieldsSettingsModel, NodeClickEventArgs } from '@syncfusion/ej2-navigations';
import { NodeCheckEventArgs, FailureEventArgs} from '@syncfusion/ej2-navigations';
import { DropDownTreeModel, FieldsModel, TreeSettingsModel } from './drop-down-tree-model';
/**
 * The DropDownTree component contains a list of predefined values from which you can
 * choose a single or multiple values.
 * ```html
 * <input type="text" tabindex="1" id="tree"> </input>
 * ```
 * ```typescript
 *   let dropDownTreeObj:DropDownTree = new DropDownTree();
 *   dropDownTreeObj.appendTo("#list");
 * ```
 */

const RTL: string = 'e-rtl';
const DROPDOWNTREE: string = 'e-ddt';
const HIDDENELEMENT: string = 'e-ddt-hidden';
const DROPDOWNICON: string = 'e-input-group-icon e-ddt-icon e-icons';
const SHOW_CHIP: string = 'e-show-chip';
const SHOW_CLEAR: string = 'e-show-clear';
const SHOW_DD_ICON: string = 'e-show-dd-icon';
const CHIP_INPUT: string = 'e-chip-input';
const INPUTFOCUS: string = 'e-input-focus';
const INPUTGROUP: string = 'e-input-group';
const ICONANIMATION: string = 'e-icon-anim';
const CLOSEICON_CLASS: string = 'e-clear-icon e-icons';
const CHIP_WRAPPER: string = 'e-chips-wrapper';
const CHIP_COLLECTION: string = 'e-chips-collection';
const CHIP: string = 'e-chips';
const CHIP_CONTENT: string = 'e-chipcontent';
const CHIP_CLOSE: string = 'e-chips-close';
const HIDEICON: string = 'e-icon-hide';
const POPUP_CLASS: string = 'e-ddt e-popup';
const POPUP_TREE: string = 'e-ddt e-treeview';
const PARENTITEM: string = 'e-list-parent';
const CONTENT: string = 'e-popup-content';
const DROPDOWN: string = 'e-dropdown';
const DISABLED: string = 'e-disabled';
const ICONS: string = 'e-icons';
const CHECKALLPARENT: string = 'e-selectall-parent';
const ALLTEXT: string = 'e-all-text';
const CHECKBOXFRAME: string = 'e-frame';
const CHECK: string = 'e-check';
const CHECKBOXWRAP: string = 'e-checkbox-wrapper';
const DDTICON: string = 'e-ddt-icon';
const FOOTER: string = 'e-ddt-footer';
const HEADER: string = 'e-ddt-header';
const NODATA: string = 'e-no-data';
const HEADERTEMPLATE_PROPERTY: string = 'HeaderTemplate';
const FOOTERTEMPLATE_PROPERTY: string = 'FooterTemplate';
const NORECORDSTEMPLATE_PROPERTY: string = 'NoRecordsTemplate';
const ACTIONFAILURETEMPLATE_PROPERTY: string = 'ActionFailureTemplate';

export class Fields extends ChildProperty<Fields> {

    /**
     * Binds the field settings for child nodes or mapping field for nested nodes objects that contain array of JSON objects.
     */
    @Property('child')
    public child: string | FieldsModel;

    /**
     * Specifies the array of JavaScript objects or instance of DataManager to populate the nodes.
     * @default []
     */
    @Property([])
    public dataSource: DataManager | { [key: string]: Object }[];

    /**
     * Specifies the mapping field for expand state of the DropDownTree node.
     */
    @Property('expanded')
    public expanded: string;

    /**
     * Specifies the mapping field for hasChildren to check whether a node has child nodes or not.
     */
    @Property('hasChildren')
    public hasChildren: string;

    /**
     * Specifies the mapping field for htmlAttributes to be added to the DropDownTree node.
     */
    @Property('htmlAttributes')
    public htmlAttributes: string;

    /**
     * Specifies the mapping field for icon class of each DropDownTree node that will be added before the text.
     */
    @Property('iconCss')
    public iconCss: string;

    /**
     * Specifies the mapping field for image URL of each DropDownTree node where image will be added before the text.
     */
    @Property('imageUrl')
    public imageUrl: string;

    /**
     * Specifies the parent ID field mapped in dataSource.
     */
    @Property('parentValue')
    public parentValue: string;

    /**
     * Defines the external [`Query`](http://ej2.syncfusion.com/documentation/data/api-query.html)
     * that will execute along with data processing.
     * @default null
     */
    @Property(null)
    public query: Query;

    /**
     * Specifies the mapping field for selected state of the DropDownTree node.
     */
    @Property('selected')
    public selected: string;

    /**
     * Specifies the table name used to fetch data from a specific table in the server.
     */
    @Property(null)
    public tableName: string;

    /**
     * Specifies the mapping field for text displayed as DropDownTree node's display text.
     */
    @Property('text')
    public text: string;

    /**
     * Specifies the mapping field for tooltip that will be displayed as hovering text of the DropDownTree node.
     */
    @Property('tooltip')
    public tooltip: string;

    /**
     * Specifies the ID field mapped in dataSource.
     */
    @Property('value')
    public value: string;
}

export class TreeSettings extends ChildProperty<TreeSettings> {
    /**
     * Allow us to specify the parent and child nodes to get auto check while we check or uncheck a node.
     * @default false
     */

    @Property(false)
    public autoCheck: boolean;

    /**
     * Specifies the action on which the node expands or collapses. The available actions are,
     * * `Auto` - In desktop, the expand/collapse operation happens when you double-click the node, and in mobile devices it
     * happens on single-click.
     * * `Click` - The expand/collapse operation happens when you single-click the node in both desktop and mobile devices.
     * * `DblClick` - The expand/collapse operation happens when you double-click the node in both desktop and mobile devices.
     * * `None` - The expand/collapse operation will not happen when you single-click or double-click the node in both desktop
     *  and mobile devices.
     * @default 'Auto'
     */
    @Property('Auto')
    public expandOn: ExpandOn;

    /**
     * By default, the load on demand (Lazy load) is set to false. By disabling this property, all the tree nodes are rendered at the
     * beginning itself.
     * @default false
     */
    @Property(false)
    public loadOnDemand: boolean;
}

export interface DdtChangeEventArgs {
    /**
     * If the event is triggered by interaction, it returns true. Otherwise, it returns false.
     */
    isInteracted: boolean;
    /**
     * Returns the component initial Value.
     */
    oldValue: string[];
    /**
     * Returns the updated component Values.
     */
    value: string[];
    /**
     * Specifies the original event arguments.
     */
    e: MouseEvent;
    /**
     * Returns the root element of the component.
     */
    element: HTMLElement;
}

export interface DdtBeforeOpenEventArgs {
    /**
     * Illustrates whether the current action needs to be prevented or not.
     */
    cancel: boolean;
}

export interface DdtPopupEventArgs {
    /**
     * Specifies the popup Object.
     */
    popup: Popup;
}

export interface DdtDataBoundEventArgs {
    /**
     * Return the DropDownTree data.
     */
    data: { [key: string]: Object }[];
}


export interface DdtFocusEventArgs {
    /**
     * Specifies the focus interacted.
     */
    isInteracted?: boolean;
    /**
     * Specifies the event.
     */
    event?: MouseEvent | FocusEvent | TouchEvent | KeyboardEvent;
}

export interface DdtSelectEventArgs {
    /**
     * Return the name of action like select or un-select.
     */
    action: string;
    /**
     * If the event is triggered by interaction, it returns true. Otherwise, it returns false.
     */
    isInteracted: boolean;
    /**
     * Return the currently selected TreeView node.
     */
    item: HTMLLIElement;
    /**
     * Return the currently selected node as JSON object from data source.
     */
    itemData: { [key: string]: Object };
}

export type Mode = 'Default' | 'Delimiter' | 'Box';

export type SortOrder = 'None' | 'Ascending' | 'Descending';

export type ExpandOn = 'Auto' | 'Click' | 'DblClick' | 'None';

@NotifyPropertyChanges
export class DropDownTree extends Component<HTMLElement> implements INotifyPropertyChanged {
    private inputEle: HTMLInputElement;
    private inputObj: InputObject;
    private hiddenElement: HTMLSelectElement;
    private isReverseUpdate: boolean;
    private checkSelectAll: boolean;
    private inputWrapper: HTMLElement;
    private popupDiv: HTMLElement;
    private tree: HTMLElement;
    private isPopupOpen: boolean;
    private inputFocus: boolean;
    private popupObj: Popup;
    private treeObj: TreeView;
    private overAllClear: HTMLElement;
    private isClearButtonClick: boolean;
    private isDocumentClick: boolean;
    private isFirstRender: boolean;
    private isInitialized: boolean;
    private treeDataType: number;
    private oldValue: string[];
    private removeValue: boolean;
    private currentValue: string[];
    private currentText: string;
    private treeItems: { [key: string]: Object }[];
    private isRemoteData: boolean;
    private selectedText: string[];
    private chipWrapper: HTMLElement;
    private chipCollection: HTMLElement;
    private isChipDelete: boolean;
    private checkAllParent: HTMLElement;
    private selectAllSpan: HTMLElement;
    private checkBoxElement: Element;
    private checkWrapper: HTMLElement;
    private isNodeSelected: boolean;
    private dataValue: string;
    private popupEle: HTMLElement;
    private isDynamicChange: boolean;
    private header: HTMLElement;
    private footer: HTMLElement;
    private headerTemplateId: string;
    private footerTemplateId: string;
    private l10n: L10n;
    private actionFailureTemplateId: string;
    private noRecordsTemplateId: string;
    private isBlazorPlatForm: boolean;

    /**
     * Accepts the template and assigns it to the popup list content of the component
     * when the data fetch request from the remote server fails.
     * @default 'The Request Failed'
     */
    @Property('The Request Failed')
    public actionFailureTemplate: string;

    /**
     * Enables or disables multi-selection of nodes. To select multiple nodes:
     * * Select the nodes by holding down the CTRL key while clicking on the nodes.
     * * Select consecutive nodes by clicking the first node to select and hold down the **SHIFT** key
     * and click the last node to select.
     *
     * @default false
     */
    @Property(false)
    public allowMultiSelection: boolean;

    /**
     * By default, the DropDownTree component fires the change event while focus out the component.
     * If you want to fires the change event on every value selection and remove, then disable the changeOnBlur property. 
     * 
     * @default true
     */
    @Property(true)
    public changeOnBlur: boolean;

    /**
     * Sets CSS classes to the root element of the component that allows customization of appearance.
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Sets the delimiter character for ‘default’ , 'box'  ‘delimiter’ visibility modes
     * @default ","
     */
    @Property(',')
    public delimiterChar: string;

    /**
     *  Specifies a value that indicates whether the DropDownTree component is enabled or not.
     * @default true
     */
    @Property(true)
    public enabled: boolean;

    /**
     * Specifies the data source and mapping fields to render DropDownTree nodes.
     * @default {value: 'value', text: 'text', dataSource: [], child: 'child', parentValue: 'parentValue', hasChildren: 'hasChildren',
     *  expanded: 'expanded', htmlAttributes: 'htmlAttributes', iconCss: 'iconCss', imageUrl: 'imageUrl',
     *  query: null, selected: 'selected', tableName: null, tooltip: 'tooltip'}
     */
    @Complex<FieldsModel>({}, Fields)
    public fields: FieldsModel;

    /**
     * Specifies whether to display the floating label above the input element.
     * Possible values are:
     * * Never: The label will never float in the input when the placeholder is available.
     * * Always: The floating label will always float above the input.
     * * Auto: The floating label will float above the input after focusing or entering a value in the input.
     * @default Syncfusion.EJ2.Inputs.FloatLabelType.Never
     * @isEnumeration true
     */
    @Property('Never')
    public floatLabelType: FloatLabelType;

    /**
     * Accepts the template design and assigns it to the footer container of the popup list.
     * @default null
     */
    @Property(null)
    public footerTemplate: string;

    /**
     * Accepts the template design and assigns it to the header container of the popup list.
     * @default null
     */
    @Property(null)
    public headerTemplate: string;

    /**
     * Specifies a template to render customized content for all the nodes. If the `itemTemplate` property
     * is set, the template content overrides the displayed node text. The property accepts template string
     * [template string](http://ej2.syncfusion.com/documentation/base/template-engine.html)
     * or HTML element ID holding the content.
     * @default null
     */
    @Property(null)
    public itemTemplate: string;

    /**
     * Allows additional HTML attributes such as title, name, etc., and
     * accepts n number of attributes in a key-value pair format.
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string; };

    /**
     * configures visibility mode for component interaction when allowMultiSelection or showCheckBox is enabled
     * * Different modes are:
     * * Box : Selected items will be visualized in chip.
     * * Delimiter : Selected items will be visualized in text content.
     * * Default : On focus in, the component will act in box mode. on blur component will act in delimiter mode.
     */
    @Property('Default')
    public mode: Mode;

    /**
     * Accepts the template design and assigns it to popup list of component
     * when no data is available on the component.
     * @default 'No Records Found'
     */
    @Property('No Records Found')
    public noRecordsTemplate: string;

    /**
     * Specifies a short hint that describes the expected value of the DropDownTree component.
     * @default null
     */
    @Property(null)
    public placeholder: string;

    /**
     * Specifies the height of the popup list.
     * @default '300px'
     */
    @Property('300px')
    public popupHeight: string | number;

    /**
     * Specifies the width of the popup list. By default, the popup width sets based on the width of
     * the component.
     * @default '100%'
     */
    @Property('100%')
    public popupWidth: string | number;

    /**
     * When set to true, the user interactions on the component are disabled.
     * @default false
     */
    @Property(false)
    public readonly: boolean;

    /**
     * Allows you to either show or hide the selectAll option on the component.
     * @default false
     */
    @Property(false)
    public showSelectAll: boolean;
    /**
     * Specifies the selectAllText to be displayed on the component.
     * @default 'Select All'
     */
    @Property('Select All')
    public selectAllText: string;

    /**
     * Indicates that the nodes will display CheckBoxes in the DropDownTree.
     * The CheckBox will be displayed next to the expand/collapse icon of the node.
     * @default false
     */
    @Property(false)
    public showCheckBox: boolean;

    /**
     * Specifies whether to show or hide the clear button.
     * When the clear button is clicked, `value`, `text` properties are reset to null.
     * @default true
     */
    @Property(true)
    public showClearButton: boolean;

    /**
     * Allows you to either show or hide the DropDown button on the component
     * 
     * @default true
     */
    @Property(true)
    public showDropDownIcon: boolean;

    /**
     * Specifies a value that indicates whether the nodes are sorted in the ascending or descending order,
     * or are not sorted at all. The available types of sort order are,
     * * `None` - The nodes are not sorted.
     * * `Ascending` - The nodes are sorted in the ascending order.
     * * `Descending` - The nodes are sorted in the ascending order.
     * @default 'None'
     */
    @Property('None')
    public sortOrder: SortOrder;


    /**
     * Gets or sets the display text of the selected item in the component.
     * @default null
     */
    @Property(null)
    public text: string;

    /**
     * Configure the TreeView settings.
     * @default {autoCheck: false, loadOnDemand: true}
     */
    @Complex<TreeSettingsModel>({}, TreeSettings)
    public treeSettings: TreeSettingsModel;

    /**
     * Specifies the UnSelectAllText to be displayed on the component.
     * @default 'Unselect All'
     */
    @Property('Unselect All')
    public unSelectAllText: string;

    /**
     * Gets or sets the value of the selected item in the component.
     * @default null
     * @aspType Object
     */
    @Property(null)
    public value: string[];
    /**
     * Specifies the width of the component. By default, the component width sets based on the width of
     * its parent container. You can also set the width in pixel values.
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;

    /**
     * specifies the z-index value of the component popup element.
     * @default 1000
     */
    @Property(1000)
    public zIndex: number;

    /**
     * Triggers when the data fetch request from the remote server fails.
     * @event
     */
    @Event()
    public actionFailure: EmitType<Object>;

    /**
     * Fires when popup opens before animation.
     * @event
     */
    @Event()
    public beforeOpen: EmitType<DdtBeforeOpenEventArgs>;

    /**
     * Triggers when an item in a popup is selected or when the model value is changed by user.
     * @event
     */
    @Event()
    public change: EmitType<DdtChangeEventArgs>;
    /**
     * Fires when popup close after animation completion.
     * @event
     */
    @Event()
    public close: EmitType<DdtPopupEventArgs>;

    /**
     * Triggers when focus moves out from the component.
     * @event
     */
    @Event()
    public blur: EmitType<Object>;

    /**
     * Triggers when the DropDownTree control is created successfully.
     * @event
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Triggers when data source is populated in the DropDownTree.
     * @event
     */
    @Event()
    public dataBound: EmitType<DdtDataBoundEventArgs>;

    /**
     * Triggers when the DropDownTree control is destroyed successfully.
     * @event
     */
    @Event()
    public destroyed: EmitType<Object>;

    /**
     * Triggers when the component is focused.
     * @event
     */
    @Event()
    public focus: EmitType<DdtFocusEventArgs>;

    /**
     * Fires when popup opens after animation completion.
     * @event
     */
    @Event()
    public open: EmitType<DdtPopupEventArgs>;

    /**
     * Triggers when an item in the popup is selected by the user either with mouse/tap or with keyboard navigation.
     * @event
     */
    @Event()
    public select: EmitType<DdtSelectEventArgs>;

    constructor(options?: DropDownTreeModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
    }

    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     * @hidden
     */

    public getPersistData(): string {
        let keyEntity: string[] = ['value'];
        return this.addOnPersist(keyEntity);
    }

    /**
     * Initialize the event handler.
     * @private
     */
    protected preRender(): void {
        this.inputFocus = false;
        this.isPopupOpen = false;
        this.isFirstRender = true;
        this.isInitialized = false;
        this.currentText = null;
        this.currentValue = null;
        this.oldValue = null;
        this.removeValue = false;
        this.selectedText = [];
        this.treeItems = [];
        this.dataValue = null;
        this.isNodeSelected = false;
        this.isDynamicChange = false;
        this.isBlazorPlatForm = isBlazor();
        this.headerTemplateId = `${this.element.id}${HEADERTEMPLATE_PROPERTY}`;
        this.footerTemplateId = `${this.element.id}${FOOTERTEMPLATE_PROPERTY}`;
        this.actionFailureTemplateId = `${this.element.id}${ACTIONFAILURETEMPLATE_PROPERTY}`;
        this.noRecordsTemplateId = `${this.element.id}${NORECORDSTEMPLATE_PROPERTY}`;
    }

    /**
     * To Initialize the control rendering
     * @private
     */
    public render(): void {
        if (this.element.tagName === 'INPUT') {
            this.inputEle = this.element as HTMLInputElement;
            if (isNOU(this.inputEle.getAttribute('role'))) {
                this.inputEle.setAttribute('role', 'textbox');
            }
            if (isNOU(this.inputEle.getAttribute('type'))) {
                this.inputEle.setAttribute('type', 'text');
            }
        } else {
            this.inputEle = this.createElement('input', { attrs: { role: 'textbox', type: 'text' } }) as HTMLInputElement;
            this.element.parentElement.insertBefore(this.inputEle, this.element);
        }
        this.inputObj = Input.createInput(
            {
                element: this.inputEle,
                floatLabelType: this.floatLabelType,
                buttons: this.showDropDownIcon ? [DROPDOWNICON] : null,
                properties: {
                    readonly: true,
                    placeholder: this.placeholder,
                    enabled: this.enabled,
                    cssClass: this.cssClass,
                    enableRtl: this.enableRtl,
                },
            },
            this.createElement
        );
        this.inputWrapper = this.inputObj.container;
        if (!this.inputWrapper.classList.contains(INPUTGROUP)) {
            this.inputWrapper.classList.add(INPUTGROUP);
        }
        if (this.showDropDownIcon) {
            this.inputWrapper.classList.add(SHOW_DD_ICON);
        }
        if (this.element.tagName === this.getDirective()) {
            this.element.appendChild(this.inputWrapper);
        }
        this.createHiddenElement();
        this.createClearIcon();
        this.inputWrapper.classList.add(DROPDOWNTREE);
        this.setElementWidth(this.width);
        this.setAttributes();
        this.updateDataAttribute();
        this.setHTMLAttributes();
        this.popupDiv = this.createElement('div', { className: CONTENT, attrs: { 'tabindex': '0' } });
        this.popupDiv.classList.add(DROPDOWN);
        this.tree = this.createElement('div', { id: this.element.id + '_tree', });
        this.popupDiv.appendChild(this.tree);
        document.body.appendChild(this.popupDiv);
        this.popupDiv.style.display = 'none';
        this.renderTree();
        this.isRemoteData = this.fields.dataSource instanceof DataManager;
        if (!this.isRemoteData) {
            this.setTreeValue();
            this.setTreeText();
            this.setSelectedValue();
        }
        if ((this.allowMultiSelection || this.showCheckBox) && this.mode !== 'Delimiter') {
            this.createChip();
        }
        if (this.showCheckBox && this.showSelectAll) {
            this.createSelectAllWrapper();
            this.popupDiv.insertBefore(this.checkAllParent, this.tree);
        }
        this.wireEvents();
        this.oldValue = this.value;
        this.isInitialized = true;
        this.renderComplete();
    }

    /* To wire events for the dropdown tree */
    private wireEvents(): void {
        EventHandler.add(this.inputWrapper, 'mouseup', this.dropDownClick, this);
        EventHandler.add(this.inputWrapper, 'focus', this.focusIn, this);
        EventHandler.add(this.inputWrapper, 'blur', this.focusOut, this);
        EventHandler.add(this.inputWrapper, 'mousemove', this.mouseIn, this);
        EventHandler.add(this.inputWrapper, 'mouseout', this.onMouseLeave, this);
        EventHandler.add(this.overAllClear, 'mousedown', this.clearAll, this);
    }

    /* To unwire events for the dropdown tree */
    private unWireEvents(): void {
        EventHandler.remove(this.inputWrapper, 'mouseup', this.dropDownClick);
        EventHandler.remove(this.inputWrapper, 'focus', this.focusIn);
        EventHandler.remove(this.inputWrapper, 'blur', this.focusOut);
        EventHandler.remove(this.inputWrapper, 'mousemove', this.mouseIn);
        EventHandler.remove(this.inputWrapper, 'mouseout', this.onMouseLeave);
        EventHandler.remove(this.overAllClear, 'mousedown', this.clearAll);
    }

    /* Trigger when the dropdown is clicked */
    private dropDownClick(e: MouseEvent): void {
        if (!this.enabled || this.readonly) {
            return;
        }
        if (this.isClearButtonClick) {
            this.isClearButtonClick = false;
            return;
        }
        if (this.isPopupOpen) {
            this.hidePopup();
        } else {
            this.focusIn(e);
            this.renderPopup();
        }
        this.showOverAllClear();
    }

    private mouseIn(): void {
        if (this.enabled || !this.readonly) {
            this.showOverAllClear();
        }
    }

    private onMouseLeave(): void {
        if (!this.inputFocus) {
            addClass([this.overAllClear], HIDEICON);
            removeClass([this.inputWrapper], SHOW_CLEAR);
        }
    }

    protected getDirective(): string {
        return 'EJS-DROPDOWNTREE';
    }

    private focusOut(e: MouseEvent): void {
        if (!this.enabled || this.readonly) {
            return;
        }
        if ((Browser.isIE || Browser.info.name === 'edge') && (e.target === this.inputWrapper)) {
            return;
        }
        let target: HTMLElement = <HTMLElement>e.relatedTarget;
        if (isNOU(target) && document.activeElement !== this.inputEle && this.isDocumentClick) {
            this.hidePopup();
        }
        if ((target !== this.inputEle) && (isNOU(target)) && (e.target !== this.inputWrapper || !this.isPopupOpen)) {
            this.onFocusOut(e);
        }
    }

    private onFocusOut(event?: MouseEvent): void {
        this.inputFocus = false;
        if (this.isPopupOpen) {
            this.hidePopup();
        }
        if (this.isClearButtonClick) {
            this.isClearButtonClick = false;
        }
        if (this.showClearButton) {
            addClass([this.overAllClear], HIDEICON);
            removeClass([this.inputWrapper], SHOW_CLEAR);
        }
        removeClass([this.inputWrapper], [INPUTFOCUS]);
        if ((this.allowMultiSelection || this.showCheckBox) && this.mode !== 'Delimiter') {
            let isValue: boolean = this.value ? (this.value.length ? true : false) : false;
            if (this.chipWrapper && (this.mode === 'Default') || (this.mode === 'Box' && !isValue)) {
                addClass([this.chipWrapper], HIDEICON);
                removeClass([this.inputWrapper], SHOW_CHIP);
                removeClass([this.inputEle], CHIP_INPUT);
            }
            if (this.mode === 'Default') {
                Input.setValue(this.dataValue, this.inputEle, this.floatLabelType);
            }
        }
        if (this.changeOnBlur) {
            this.triggerChangeEvent(event);
        }
        this.removeValue = false;
        this.oldValue = this.value;
        this.trigger('blur');
    }

    private triggerChangeEvent(event?: MouseEvent): void {
        let isEqual: boolean = this.compareValues(this.oldValue, this.value);
        if ((!isEqual || this.isChipDelete) && !this.removeValue) {
            let eventArgs: DdtChangeEventArgs = {
                e: event,
                oldValue: <string[]>this.oldValue,
                value: <string[]>this.value,
                isInteracted: event ? true : false,
                element: this.element
            };
            this.trigger('change', eventArgs);
        }
    }

    private compareValues(oldValue: string[], newValue: string[]): boolean {
        if (oldValue === null || oldValue.length === 0) {
            let isValid: boolean = oldValue === null ? ((newValue === oldValue) ? true : false) :
                (oldValue.length === 0 ? (newValue === oldValue) : false);
            return isValid;
        } else if (oldValue.length !== newValue.length) {
            return false;
        }
        for (let i: number = 0; i < oldValue.length; i++) {
            if (oldValue[i] !== newValue[i]) {
                return false;
            }
        }
        return true;
    }

    private focusIn(e?: FocusEvent | MouseEvent | KeyboardEvent | TouchEvent): void {
        if (!this.enabled || this.readonly || this.inputFocus) {
            return;
        }
        this.showOverAllClear();
        this.inputFocus = true;
        addClass([this.inputWrapper], [INPUTFOCUS]);
        if ((this.allowMultiSelection || this.showCheckBox) && this.mode === 'Default' && this.inputFocus) {
            if (this.chipWrapper) {
                removeClass([this.chipWrapper], HIDEICON);
                addClass([this.inputWrapper], SHOW_CHIP);
                addClass([this.inputEle], CHIP_INPUT);
            }
            if (this.popupObj) {
                this.popupObj.refreshPosition();
            }
            Input.setValue(null, this.inputEle, this.floatLabelType);
        }
        let args: DdtFocusEventArgs = { isInteracted: e ? true : false, event: e };
        this.trigger('focus', args);
    }

    protected getAriaAttributes(): { [key: string]: string } {
        let disable: string = this.enabled ? 'false' : 'true';
        return {
            'aria-disabled': disable,
            'aria-owns': this.element.id + '_options',
            'role': 'listbox',
            'aria-haspopup': 'true',
            'aria-expanded': 'false',
            'aria-activedescendant': 'null',
            'aria-labelledby': this.hiddenElement.id
        };
    }

    private createHiddenElement(): void {
        this.hiddenElement = this.createElement('select', {
            attrs: { 'aria-hidden': 'true', 'tabindex': '-1', 'class': HIDDENELEMENT }
        }) as HTMLSelectElement;
        prepend([this.hiddenElement], this.inputWrapper);
        this.validationAttribute();
    }

    private createClearIcon(): void {
        this.overAllClear = this.createElement('span', {
            className: CLOSEICON_CLASS
        });
        addClass([this.overAllClear], HIDEICON);
        removeClass([this.inputWrapper], SHOW_CLEAR);
        if (this.showClearButton) {
            this.inputWrapper.insertBefore(this.overAllClear, this.inputObj.buttons[0]);
        }
    }

    private validationAttribute(): void {
        let name: string = this.inputEle.getAttribute('name') ? this.inputEle.getAttribute('name') : this.inputEle.getAttribute('id');
        this.hiddenElement.setAttribute('name', name);
        this.inputEle.removeAttribute('name');
        let attributes: string[] = ['required', 'aria-required', 'form'];
        for (let i: number = 0; i < attributes.length; i++) {
            let attr: string = this.inputEle.getAttribute(attributes[i]);
            if (attr) {
            this.hiddenElement.setAttribute(attributes[i], attr);
            this.inputEle.removeAttribute(attributes[i]);
            }
        }
    }

    private createChip(): void {
        if (!this.inputWrapper.contains(this.chipWrapper)) {
            this.chipWrapper = this.createElement('span', {
                className: CHIP_WRAPPER,
            });
            this.chipCollection = this.createElement('span', {
                className: CHIP_COLLECTION
            });
            this.chipWrapper.appendChild(this.chipCollection);
            this.inputWrapper.insertBefore(this.chipWrapper, this.hiddenElement);
            addClass([this.inputWrapper], SHOW_CHIP);
            let isValid: boolean = this.getValidMode();
            if (isValid && this.value !== null) {
                addClass([this.inputEle], CHIP_INPUT);
            } else if (this.value === null) {
                addClass([this.chipWrapper], HIDEICON);
            }
        }
    }

    private getValidMode(): boolean {
        let isValidMode: boolean = this.mode === 'Box' ? true : (this.mode === 'Default' && this.inputFocus) ? true : false;
        return isValidMode;
    }

    private createSelectAllWrapper(): void {
        this.checkAllParent = this.createElement('div', {
            className: CHECKALLPARENT
        });
        this.selectAllSpan = this.createElement('span', {
            className: ALLTEXT
        });
        this.selectAllSpan.textContent = '';
        this.checkBoxElement = createCheckBox(this.createElement, true);
        this.checkBoxElement.setAttribute('role', 'checkbox');
        this.checkAllParent.appendChild(this.checkBoxElement);
        this.checkAllParent.appendChild(this.selectAllSpan);
        this.setLocale();
        EventHandler.add(this.checkAllParent, 'mousedown', this.clickHandler, this);
    }

    private clickHandler(e: MouseEvent): void {
        let target: EventTarget;
        if ((e.currentTarget as HTMLElement).classList.contains(this.checkAllParent.className)) {
            target = (e.currentTarget as HTMLElement).firstElementChild.lastElementChild;
        } else {
            target = <Element>e.target;
        }
        this.checkWrapper = closest((target as HTMLElement), '.' + CHECKBOXWRAP) as HTMLElement;
        if (!isNOU(this.checkWrapper)) {
            let checkElement: Element = select('.' + CHECKBOXFRAME, this.checkWrapper);
            this.changeState(this.checkWrapper, checkElement.classList.contains(CHECK) ? 'uncheck' : 'check', e);
        }
        e.preventDefault();
    }

    private changeState(
        wrapper: HTMLElement | Element, state: string, e?: MouseEvent): void {
        let ariaState: string;
        let frameSpan: Element = wrapper.getElementsByClassName(CHECKBOXFRAME)[0];
        if (state === 'check' && !frameSpan.classList.contains(CHECK)) {
            frameSpan.classList.add(CHECK);
            ariaState = 'true';
            if (!this.isReverseUpdate) {
                this.treeObj.checkAll();
                if (!this.changeOnBlur) {
                    this.triggerChangeEvent(e);
                }
            }
            this.setLocale(true);
        } else if (state === 'uncheck' && (frameSpan.classList.contains(CHECK))) {
            frameSpan.classList.remove(CHECK);
            ariaState = 'false';
            if (!this.isReverseUpdate) {
                this.treeObj.uncheckAll();
                if (!this.changeOnBlur) {
                    this.triggerChangeEvent(e);
                }
            }
            this.setLocale(false);
        }
        this.setMultiSelect();
        ariaState = state === 'check' ? 'true' : 'false';
        if (!isNOU(ariaState)) {
            wrapper.setAttribute('aria-checked', ariaState);
        }
    }

    private setLocale(unSelect?: boolean): void {
        if (!this.selectAllSpan) {
            return;
        }
        if (this.selectAllText !== 'Select All' || this.unSelectAllText !== 'Unselect All') {
            let template: string = unSelect ? this.unSelectAllText : this.selectAllText;
            let compiledString: Function;
            this.selectAllSpan.textContent = '';
            compiledString = compile(template);
            for (let item of compiledString({}, null, null, null, !this.isStringTemplate)) {
                this.selectAllSpan.textContent = item.textContent;
            }
        } else {
            this.selectAllSpan.textContent = unSelect ? this.unSelectAllText : this.selectAllText;
        }
    }

    private setAttributes(): void {
        this.element.removeAttribute('tabindex');
        let id: string = this.element.getAttribute('id');
        this.hiddenElement.id = id + '_hidden';
        this.inputWrapper.setAttribute('tabindex', '0');
        attributes(this.inputWrapper, this.getAriaAttributes());
    }

    private setHTMLAttributes(): void {
        if (Object.keys(this.htmlAttributes).length) {
            for (let htmlAttr of Object.keys(this.htmlAttributes)) {
                if (htmlAttr === 'class') {
                    this.inputWrapper.classList.add(this.htmlAttributes[htmlAttr]);
                } else if (htmlAttr === 'disabled' && this.htmlAttributes[htmlAttr] === 'disabled') {
                    this.enabled = false;
                    this.setEnable();
                } else if (htmlAttr === 'readonly' && !isNOU(this.htmlAttributes[htmlAttr])) {
                    this.readonly = true;
                    this.dataBind();
                } else if (htmlAttr === 'style') {
                    this.inputWrapper.setAttribute('style', this.htmlAttributes[htmlAttr]);
                } else {
                    let defaultAttr: string[] = ['title', 'id', 'placeholder', 'aria-placeholder',
                    'role', 'autocorrect', 'autocomplete', 'autocapitalize', 'spellcheck', 'minlength', 'maxlength'];
                    let validateAttr: string[] = ['name', 'required'];
                    if (htmlAttr.indexOf('data') === 0 || validateAttr.indexOf(htmlAttr) > -1) {
                        this.hiddenElement.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                    } else if (defaultAttr.indexOf(htmlAttr) > -1) {
                        htmlAttr === 'placeholder' ? Input.setPlaceholder(this.htmlAttributes[htmlAttr], this.inputEle) :
                            this.inputEle.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                    } else {
                        this.inputWrapper.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                    }
                }
            }
        }
    }

    private updateDataAttribute() : void {
        let value: { [key: string]: string; } = this.htmlAttributes;
        let invalidAttr: string[] = ['class', 'style', 'id', 'type'];
        let attr: { [key: string]: string; } = {};
        for (let a: number = 0; a < this.element.attributes.length; a++) {
            if (invalidAttr.indexOf(this.element.attributes[a].name) === -1 &&
            !( this.element.attributes[a].name === 'readonly')) {
                attr[this.element.attributes[a].name] = this.element.getAttribute(this.element.attributes[a].name);
            }
        }
        extend(attr, value, attr);
        this.setProperties({ htmlAttributes: attr }, true);
    }

    private showOverAllClear(): void {
        if (!this.enabled || this.readonly) {
            return;
        }
        if (this.overAllClear) {
            let isValue: boolean = this.value ? (this.value.length ? true : false) : false;
            if (isValue && this.showClearButton) {
                removeClass([this.overAllClear], HIDEICON);
                addClass([this.inputWrapper], SHOW_CLEAR);
            } else {
                addClass([this.overAllClear], HIDEICON);
                removeClass([this.inputWrapper], SHOW_CLEAR);
            }
        }
    }

    private setTreeValue(): void {
        if (this.value !== null && this.value.length !== 0) {
            let data: { [key: string]: Object };
            if (this.showCheckBox || this.allowMultiSelection) {
                for (let i: number = 0; i < this.value.length; i++) {
                    data = this.treeObj.getTreeData(this.value[i])[0];
                    if (isNOU(data)) {
                        this.value.splice(this.value.indexOf(this.value[i]), 1);
                    }
                }
                if (this.value.length !== 0) {
                    this.setValidValue();
                }
            } else {
                data = this.treeObj.getTreeData(this.value[0])[0];
                if (!isNOU(data)) {
                    this.setProperties({ text: data[this.fields.text] }, true);
                    this.setValidValue();
                } else {
                    this.setProperties({ value: this.currentValue }, true);
                }
            }
        }
    }

    private setTreeText(): void {
        if (this.value !== null && !this.isInitialized) {
            return;
        }
        if (this.text !== null) {
            let data: { [key: string]: Object };
            let valArr: string[] = [];
            if (this.showCheckBox || this.allowMultiSelection) {
                let textArr: string[] = this.text.split(this.delimiterChar);
                for (let i: number = 0; i < textArr.length; i++) {
                    data = this.getItems(textArr[i]);
                    if (!isNOU(data)) {
                        valArr.push(data[this.fields.value].toString());
                    }
                }
                if (valArr.length !== 0) {
                    this.oldValue = this.value;
                    this.setProperties({ value: valArr }, true);
                    this.setValidValue();
                } else {
                    this.setProperties({ text: this.currentText }, true);
                }
            } else {
                data = this.getItems(this.text);
                if (!isNOU(data)) {
                    this.oldValue = this.value;
                    this.setProperties({ value: [data[this.fields.value].toString()] }, true);
                    this.setValidValue();
                } else {
                    this.setProperties({ text: this.currentText }, true);
                }
            }
        }
    }

    private setSelectedValue(): void {
        if (this.value != null) {
            return;
        }
        if (!this.isInitialized) {
            this.oldValue = this.value;
            if (this.treeObj.selectedNodes.length > 0 && !this.showCheckBox) {
                this.setProperties({ value: this.treeObj.selectedNodes }, true);
                if (this.allowMultiSelection) {
                    this.updateMode();
                }
            } else if (this.showCheckBox && this.treeObj.checkedNodes) {
                if (this.treeObj.checkedNodes.length > 0) {
                    this.setProperties({ value: this.treeObj.checkedNodes }, true);
                    setValue('selectedNodes', [], this.treeObj);
                    this.treeObj.dataBind();
                    this.updateMode();
                }
            }
            this.updateSelectedValues();
            this.currentText = this.text;
            this.currentValue = this.value;
        }
    }

    private setValidValue(): void {
        if (!this.showCheckBox && !this.allowMultiSelection) {
            Input.setValue(this.text, this.inputEle, this.floatLabelType);
            let id: string = this.value[0].toString();
            if (this.treeObj.selectedNodes[0] !== id) {
                setValue('selectedNodes', [id], this.treeObj);
            }
        } else {
            if (this.showCheckBox) {
                this.treeObj.checkedNodes = this.value.slice();
                setValue('selectedNodes', [], this.treeObj);
                this.treeObj.dataBind();
                this.setMultiSelect();
            } else {
                this.treeObj.selectedNodes = this.value.slice();
                this.selectedText = [];
                this.updateSelectedValues();
            }
            this.treeObj.dataBind();
        }
        this.currentText = this.text;
        this.currentValue = this.value;
        if (this.isInitialized) {
            this.triggerChangeEvent();
        }
    }

    private getItems(givenText: string): { [key: string]: Object } {
        let data: { [key: string]: Object };
        if (this.treeDataType === 1) {
            for (let i: number = 0; i < this.treeItems.length; i++) {
                let text: Object = getValue(this.fields.text, this.treeItems[i]);
                if (!isNOU(this.treeItems[i]) && !isNOU(text) && text === givenText) {
                    data = this.treeItems[i];
                    break;
                }
            }
        } else {
            data = this.getNestedItems(this.treeItems, this.fields, givenText);
        }
        return data;
    }

    private getNestedItems(data: { [key: string]: Object }[], field: FieldsModel, givenText: string): { [key: string]: Object } {
        let newData: { [key: string]: Object };
        for (let i: number = 0, objlen: number = data.length; i < objlen; i++) {
            let dataId: Object = getValue(this.fields.text, data[i]);
            if (data[i] && dataId && dataId.toString() === givenText) {
                return data[i];
            } else if (typeof field.child === 'string' && !isNOU(getValue(field.child, data[i]))) {
                let childData: Object = getValue(field.child, data[i]);
                newData = this.getNestedItems(<{ [key: string]: Object }[]>childData, this.getChildType(field), givenText);
                if (newData !== undefined) {
                    break;
                }
            } else if (this.fields.dataSource instanceof DataManager && !isNOU(getValue('child', data[i]))) {
                let child: string = 'child';
                newData = this.getNestedItems(<{ [key: string]: Object }[]>getValue(child, data[i]), this.getChildType(field), givenText);
                if (newData !== undefined) {
                    break;
                }
            }
        }
        return newData;
    }

    private getChildType(mapper: FieldsModel): FieldsModel {
        return (typeof mapper.child === 'string' || isNOU(mapper.child)) ? mapper : mapper.child;
    }

    /* To render the treeview */
    private renderTree(): void {
        this.treeObj = new TreeView({
            fields: this.getFields(),
            enableRtl: this.enableRtl,
            nodeSelected: this.onNodeSelected.bind(this),
            nodeChecked: this.onNodeChecked.bind(this),
            nodeChecking: this.beforeCheck.bind(this),
            actionFailure: this.onActionFailure.bind(this),
            nodeClicked: this.onNodeClicked.bind(this),
            dataBound: this.OnDataBound.bind(this),
            allowMultiSelection: this.allowMultiSelection,
            showCheckBox: this.showCheckBox,
            autoCheck: this.treeSettings.autoCheck,
            sortOrder: this.sortOrder,
            expandOn: this.treeSettings.expandOn,
            loadOnDemand: this.treeSettings.loadOnDemand,
            nodeSelecting: this.onBeforeSelect.bind(this),
            nodeTemplate: this.itemTemplate
        });
        this.treeObj.appendTo('#' + this.tree.id);
    }

    /* To render the popup element */
    private renderPopup(): void {
        let isCancelled: boolean = false;
        let args: DdtBeforeOpenEventArgs = { cancel: false };
        this.trigger('beforeOpen', args, (args: DdtBeforeOpenEventArgs) => {
            if (!args.cancel) {
                addClass([this.inputWrapper], [ICONANIMATION]);
                if (this.isFirstRender) {
                    this.popupEle = this.createElement('div', {
                        id: this.element.id + '_popup', className: POPUP_CLASS + ' ' + (this.cssClass != null ? this.cssClass : '')
                    });
                    document.body.appendChild(this.popupEle);
                    this.createPopup(this.popupEle);
                } else {
                    this.popupEle = this.popupObj.element;
                }
            } else {
                isCancelled = true;
            }
            if (this.isFirstRender && !isCancelled) {
                prepend([this.popupDiv], this.popupEle);
                this.popupDiv.style.display = 'block';
                if (this.headerTemplate) { this.setHeaderTemplate(); }
                if (this.footerTemplate) { this.setFooterTemplate(); }
                this.isFirstRender = false;
            }
            if (!isCancelled) {
                attributes(this.inputWrapper, { 'aria-expanded': 'true' });
                this.popupObj.show();
                this.popupObj.refreshPosition();
                this.popupEle.style.display = 'block';
                this.updatePopupHeight();
                if (!this.showCheckBox && (!this.popupDiv.classList.contains(NODATA) && this.treeItems.length > 0)) {
                    this.treeObj.element.focus();
                }
                if (this.checkSelectAll && this.checkBoxElement) {
                    let wrap: HTMLElement = closest((this.checkBoxElement as HTMLElement), '.' + CHECKBOXWRAP) as HTMLElement;
                    this.changeState(wrap, 'check');
                    this.checkSelectAll = false;
                }
                let eventArgs: DdtPopupEventArgs = { popup: this.popupObj };
                this.trigger('open', eventArgs);
            }
        });
    }

    private updatePopupHeight(): void {
        let popupHeight: string =  this.getHeight();
        this.popupEle.style.maxHeight = popupHeight;
        if (this.headerTemplate) {
            let height: number = Math.round(this.header.getBoundingClientRect().height);
            popupHeight = formatUnit(parseInt(popupHeight, 10) - height + 'px');
        }
        if (this.footerTemplate) {
            let height: number = Math.round(this.footer.getBoundingClientRect().height);
            popupHeight = formatUnit(parseInt(popupHeight, 10) - height + 'px');
        }
        let border: number = parseInt(window.getComputedStyle(this.popupEle).borderTopWidth, 10);
        border = border + parseInt(window.getComputedStyle(this.popupEle).borderBottomWidth, 10);
        popupHeight = formatUnit(parseInt(popupHeight, 10) - border + 'px');
        this.popupDiv.style.maxHeight = popupHeight;
        this.updateTreeHeight();
    }

    private updateTreeHeight(): void {
        let treeHeight: string = this.popupDiv.style.maxHeight;
        if (this.showCheckBox && this.showSelectAll) {
            let height: number = Math.round(this.checkAllParent.getBoundingClientRect().height);
            treeHeight = formatUnit(parseInt(treeHeight, 10) - height + 'px');
        }
        this.tree.style.maxHeight = treeHeight;
    }

    private createPopup(element: HTMLElement): void {
        if (this.isFirstRender) {
            this.popupObj = new Popup(element, {
                width: this.setWidth(),
                targetType: 'relative',
                relateTo: this.inputWrapper,
                zIndex: this.zIndex,
                enableRtl: this.enableRtl,
                position: { X: 'left', Y: 'bottom' },
                close: () => {
                    this.isPopupOpen = false;
                },
                open: () => {
                    EventHandler.add(document, 'mousedown', this.onDocumentClick, this);
                    this.isPopupOpen = true;
                },
            });
        }
    }

    /* To calculate the width when change via set model */
    private setElementWidth(inputWidth: string | number): void {
        let ddElement: HTMLElement = this.inputWrapper;
        if (!isNOU(inputWidth)) {
            if (typeof inputWidth === 'number') {
                ddElement.style.width = formatUnit(inputWidth);
            } else if (typeof inputWidth === 'string') {
                ddElement.style.width = (inputWidth.match(/px|%|em/)) ? (inputWidth) :
                    (formatUnit(inputWidth));
            }
        }
    }

    /* To calculate the width of the popup */
    private setWidth(): string {
        let width: string = formatUnit(this.popupWidth);
        if (width.indexOf('%') > -1) {
            let inputWidth: number = this.inputWrapper.offsetWidth * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        } else if (typeof this.popupWidth === 'string') {
            width = (this.popupWidth.match(/px|em/)) ? (this.popupWidth) : width;
        }
        return width;
    }

    /* To calculate the height of the popup */
    private getHeight(): string {
        let height: string = formatUnit(this.popupHeight);
        if (height.indexOf('%') > -1) {
            // Will set the height of the popup according to the view port height
            let viewPortHeight: number = document.documentElement.clientHeight * parseFloat(height) / 100;
            height = viewPortHeight.toString() + 'px';
        } else if (typeof this.popupHeight === 'string') {
            height = (this.popupHeight.match(/px|em/)) ? (this.popupHeight) : height;
        }
        return height;
    }

    private onDocumentClick(e: MouseEvent): void {
        let target: HTMLElement = <HTMLElement>e.target;
        let isTree: Element = closest(target, '.' + PARENTITEM);
        if ((this.isPopupOpen && (this.inputWrapper.contains(target) || isTree)) || ((this.allowMultiSelection || this.showCheckBox) &&
        (this.isPopupOpen && (target.classList.contains(CHIP_CLOSE)) || target.classList.contains(ALLTEXT)) || (this.isPopupOpen &&
            (target.classList.contains(CHECKALLPARENT) || target.classList.contains(CHECKBOXFRAME))))) {
            this.isDocumentClick = false;
        } else if (!this.inputWrapper.contains(target)) {
            let isScroller: boolean = target.classList.contains(DROPDOWN) ? true :
                (matches(target, '.e-ddt .e-popup') || matches(target, '.e-ddt .e-treeview'));
            if (!isScroller && this.inputFocus) {
                this.focusOut(e);
            }
        }
    }

    private onActionFailure(e: FailureEventArgs): void {
        this.trigger('actionFailure', e);
        this.l10nUpdate(true);
        addClass([this.popupDiv], NODATA);
    }

    private OnDataBound(args: DataBoundEventArgs): void {
        this.treeItems = args.data;
        if (this.treeItems.length <= 0) {
            this.l10nUpdate();
            addClass([this.popupDiv], NODATA);
        } else if (this.popupDiv.classList.contains(NODATA) && this.treeItems.length >= 1) {
            removeClass([this.popupDiv], NODATA);
        }
        this.treeDataType = this.getTreeDataType(this.treeItems, this.fields);
        if (this.isFirstRender && this.isRemoteData) {
            this.setTreeValue();
            this.setTreeText();
            this.setSelectedValue();
            this.treeObj.element.focus();
        }
        let eventArgs: DdtDataBoundEventArgs = { data: args.data };
        this.trigger('dataBound', eventArgs);
    }

    /* To set cssclass for the dropdowntree */
    private setCssClass(newClass: string, oldClass: string): void {
        let elements: HTMLElement[] = this.popupObj ? [this.inputWrapper, this.popupObj.element] : [this.inputWrapper];
        if (!isNOU(oldClass) && oldClass !== '') {
            removeClass(elements, oldClass.split(' '));
        }
        if (!isNOU(newClass) && newClass !== '') {
            addClass(elements, newClass.split(' '));
        }
    }

    private setEnableRTL(state: boolean): void {
        if (state) {
            this.inputWrapper.classList.add(RTL);
        } else {
            this.inputWrapper.classList.remove(RTL);
        }
        if (this.popupObj) {
            this.popupObj.enableRtl = state;
            this.popupObj.dataBind();
        }
        if (this.treeObj) {
            this.treeObj.enableRtl = state;
            this.treeObj.dataBind();
        }
    }

    /* To set enable property */
    private setEnable(): void {
        Input.setEnabled(this.enabled, this.inputEle);
        if (this.enabled) {
            removeClass([this.inputWrapper], DISABLED);
            this.inputEle.setAttribute('aria-disabled', 'false');
            this.inputWrapper.setAttribute('aria-disabled', 'false');
        } else {
            if (this.isPopupOpen) {
                this.hidePopup();
            }
            addClass([this.inputWrapper], DISABLED);
            let isFocus: boolean = this.inputWrapper ? (this.inputWrapper.classList.contains(INPUTFOCUS) ? true : false ) : false;
            if (isFocus) {
                removeClass([this.inputWrapper], [INPUTFOCUS]);
            }
            this.inputEle.setAttribute('aria-disabled', 'true');
            this.inputWrapper.setAttribute('aria-disabled', 'true');
        }
    }

    private getFields(): FieldsSettingsModel {
        let treeFields: FieldsSettingsModel = {
            dataSource: this.fields.dataSource, id: this.fields.value, text: this.fields.text, parentID: this.fields.parentValue,
            child: this.getChildren(this.fields.child), hasChildren: this.fields.hasChildren, expanded: this.fields.expanded,
            iconCss: this.fields.iconCss, imageUrl: this.fields.imageUrl, isChecked: this.fields.selected,
            htmlAttributes: this.fields.htmlAttributes, query: this.fields.query, selected: this.fields.selected,
            tableName: this.fields.tableName, tooltip: this.fields.tooltip
        };
        return treeFields;
    }

    private getChildren(mapper: FieldsModel | string): FieldsSettingsModel | string {
        let childFields: FieldsSettingsModel | string;
        if (typeof this.fields.child === 'string') {
            childFields = this.fields.child;
        } else if (!isNOU(mapper)) {
            mapper = this.getActualProperties(mapper) as FieldsSettingsModel;
            childFields = mapper;
            if (mapper.value) {
                childFields.id = mapper.value;
            }
            if (mapper.parentValue) {
                childFields.parentID = mapper.parentValue;
            }
            if (mapper.child) {
                childFields.child = this.getChildren(mapper.child);
            }
            if (mapper.selected && this.showCheckBox) {
                childFields.isChecked = mapper.selected;
            }
        }
        return childFields;
    }

    private getTreeDataType(ds: { [key: string]: Object }[], field: FieldsModel): number {
        if (this.fields.dataSource instanceof DataManager) {
            for (let i: number = 0; i < ds.length; i++) {
                if ((typeof field.child === 'string') && isNOU(getValue(field.child, ds[i]))) {
                    return 1;
                }
            }
            return 2;
        }
        for (let i: number = 0, len: number = ds.length; i < len; i++) {
            if ((typeof field.child === 'string') && !isNOU(getValue(field.child, ds[i]))) {
                return 2;
            }
            if (!isNOU(getValue(field.parentValue, ds[i])) || !isNOU(getValue(field.hasChildren, ds[i]))) {
                return 1;
            }
        }
        return 1;
    }

    /* Triggers when the tree fields is changed dynamically */
    private setFields(): void {
        this.resetValue();
        this.treeObj.fields = this.getFields();
        this.treeObj.dataBind();
    }
    private getEventArgs(args: NodeCheckEventArgs | NodeSelectEventArgs): DdtSelectEventArgs {
        let checkData: { [key: string]: Object }[] = (args as NodeCheckEventArgs).data;
        let selectData: { [key: string]: Object } = (args as NodeSelectEventArgs).nodeData;
        let eventArgs: DdtSelectEventArgs = {
            action: this.showCheckBox ? (args.action === 'check' ? 'select' : args.action === 'uncheck' ? 'un-select' : args.action)
                : args.action,
            isInteracted: args.isInteracted,
            item: args.node,
            itemData: this.showCheckBox ? (checkData ? checkData[0] : selectData) : selectData
        };
        return eventArgs;
    }

    private onBeforeSelect(args: NodeSelectEventArgs): void {
        if (args.isInteracted) {
            this.oldValue = this.value ? this.value.slice() : this.value;
            if (this.value === null) {
                this.setProperties({ value: [] }, true);
            }
        }
    }

    /* Triggers when the tree node is selected */
    private onNodeSelected(args: NodeSelectEventArgs): void {
        if (this.showCheckBox) {
            return;
        }
        let selectedText: string;
        let eventArgs: DdtSelectEventArgs = this.getEventArgs(args);
        this.trigger('select', eventArgs);
        if (args.isInteracted) {
            let id: string = getValue('id', args.nodeData).toString();
            if (!this.allowMultiSelection) {
                this.hiddenElement.innerHTML = '';
                this.setProperties({ value: [id] }, true);
                if (this.itemTemplate) {
                    selectedText = getValue('text', this.treeObj.getNode(id));
                } else {
                    selectedText = getValue('text', args.nodeData).toString();
                }
                Input.setValue(selectedText, this.inputEle, this.floatLabelType);
                this.setProperties({ text: selectedText }, true);
                this.currentText = this.text;
                this.currentValue = this.value;
                attributes(this.inputWrapper, { 'aria-describedby': this.element.id });
                attributes(this.inputWrapper, { 'aria-activedescendant': id.toString() });
                this.hiddenElement.innerHTML += '<option selected value ="' + this.value[0] + '">' + this.text + '</option>';
                this.showOverAllClear();
                this.hidePopup();
                this.isNodeSelected = true;
            } else if (this.allowMultiSelection) {
                this.setMultiSelect();
            }
        }
    }

    private onNodeClicked(args: NodeClickEventArgs): void {
        if (!this.changeOnBlur && this.isNodeSelected) {
            this.triggerChangeEvent(args.event);
            this.isNodeSelected = false;
        }
        let target: Element = <Element>args.event.target;
        if ((target.classList.contains('e-fullrow') || target.classList.contains('e-list-text')) && this.showCheckBox) {
            let getNodeDetails: { [key: string]: Object } = this.treeObj.getNode(args.node);
            if (getNodeDetails.isChecked === 'true') {
                this.treeObj.uncheckAll([args.node]);
            } else {
                this.treeObj.checkAll([args.node]);
            }
            this.setMultiSelect();
        }
        if (!this.changeOnBlur && (this.allowMultiSelection || this.showCheckBox)) {
            this.triggerChangeEvent(args.event);
        }
    }

    private onNodeChecked(args: NodeCheckEventArgs): void {
        let eventArgs: DdtSelectEventArgs = this.getEventArgs(args);
        this.trigger('select', eventArgs);
        if (!this.isChipDelete && args.isInteracted) {
            this.setMultiSelect();
        }
        if (this.showSelectAll && this.checkBoxElement) {
            let nodes: NodeList = this.treeObj.element.querySelectorAll('li');
            let checkedNodes: NodeList = this.treeObj.element.querySelectorAll('li .e-checkbox-wrapper[aria-checked=true]');
            let wrap: HTMLElement = closest((this.checkBoxElement as HTMLElement), '.' + CHECKBOXWRAP) as HTMLElement;
            if (wrap && args.action === 'uncheck') {
                this.isReverseUpdate = true;
                this.changeState(wrap, 'uncheck');
                this.isReverseUpdate = false;
            } else if (wrap && args.action === 'check' && checkedNodes.length === nodes.length) {
                this.isReverseUpdate = true;
                this.changeState(wrap, 'check');
                this.isReverseUpdate = false;
            }
        }
    }

    private beforeCheck(args: NodeCheckEventArgs): void {
        if (args.isInteracted) {
            this.oldValue = this.value ? this.value.slice() : this.value;
        }
    }

    private updateClearButton(state: boolean): void {
        if (state) {
            let isClearIcon: boolean = this.overAllClear ? (this.inputWrapper.contains(this.overAllClear) ? true : false) : false;
            if (!isClearIcon) {
                this.inputEle.parentElement.insertBefore(this.overAllClear, this.inputEle.nextSibling);
            } else {
                removeClass([this.overAllClear], HIDEICON);
                addClass([this.inputWrapper], SHOW_CLEAR);
            }
        } else {
            addClass([this.overAllClear], HIDEICON);
            removeClass([this.inputWrapper], SHOW_CLEAR);
        }
        if ((this.allowMultiSelection || this.showCheckBox) && this.chipWrapper) {
            let chipClose: Element[] = selectAll('.' + CHIP_CLOSE, this.chipWrapper);
            for (let i: number = 0; i < chipClose.length; i++) {
                if (!state) {
                    addClass([chipClose[i]], HIDEICON);
                } else {
                    removeClass([chipClose[i]], HIDEICON);
                }
            }
        }
    }

    private updateDropDownIconState(state: boolean): void {
        let spinIcon: Element = select('.' + DDTICON, this.inputWrapper);
        if (state) {
            if (!spinIcon) {
                Input.appendSpan(DROPDOWNICON, this.inputWrapper, this.createElement);
            } else {
                removeClass([spinIcon], HIDEICON);
            }
            addClass([this.inputWrapper], SHOW_DD_ICON);
        } else {
            addClass([spinIcon], HIDEICON);
            removeClass([this.inputWrapper], SHOW_DD_ICON);
        }
    }

    private updateMode(): void {
        if (this.mode !== 'Delimiter') {
            if (!this.inputWrapper.contains(this.chipWrapper)) {
                this.createChip();
            }
            Input.setValue(null, this.inputEle, this.floatLabelType);
            let isValid: boolean = this.getValidMode();
            if (this.chipWrapper.classList.contains(HIDEICON) && isValid) {
                removeClass([this.chipWrapper], HIDEICON);
                addClass([this.inputWrapper], SHOW_CHIP);
            } else if (!isValid) {
                addClass([this.chipWrapper], HIDEICON);
                removeClass([this.inputWrapper], SHOW_CHIP);
            }
            let isValue: boolean = this.value !== null ? (this.value.length !== 0 ? true : false) : false;
            if (isValid && isValue) {
                addClass([this.inputEle], CHIP_INPUT);
            } else {
                removeClass([this.inputEle], CHIP_INPUT);
            }
        } else if (this.inputEle.classList.contains(CHIP)) {
            removeClass([this.inputEle], CHIP_INPUT);
            if (this.chipWrapper) {
                addClass([this.chipWrapper], HIDEICON);
                removeClass([this.inputWrapper], SHOW_CHIP);
            }
        }
    }

    private ensureClearIconPosition(floatLabelType: FloatLabelType): void {
        if (floatLabelType !== 'Never') {
            this.inputWrapper.insertBefore(this.overAllClear, this.inputObj.buttons[0]);
        }
    }

    private setMultiSelect(): void {
        if (this.showCheckBox && !this.isDynamicChange) {
            this.setProperties({ value: this.treeObj.checkedNodes }, true);
        } else {
            let ddtValue: string[] = this.allowMultiSelection ? (this.showCheckBox ? this.treeObj.checkedNodes
                : this.treeObj.selectedNodes) : (this.value ? (this.showCheckBox ? this.value : [this.value[0]]) : null);
            this.setProperties({ value: ddtValue }, true);
            if (this.showCheckBox && this.value !== null) {
                this.treeObj.checkedNodes = this.value;
                this.treeObj.dataBind();
            }
        }
        this.selectedText = [];
        let checkSelection: boolean = this.allowMultiSelection ? true : (this.showCheckBox ? true : false);
        if (this.inputWrapper.contains(this.chipWrapper) && !checkSelection) {
            removeClass([this.inputEle], CHIP_INPUT);
            detach(this.chipWrapper);
        }
        let isValid: boolean = this.getValidMode();
        if (isValid && this.value !== null) {
            addClass([this.inputEle], CHIP_INPUT);
            if (this.chipWrapper) {
                removeClass([this.chipWrapper], HIDEICON);
            }
        }
        let isValue: boolean = this.value ? (this.value.length ? true : false) : false;
        if (this.chipWrapper && (this.mode === 'Box' && !isValue)) {
            addClass([this.chipWrapper], HIDEICON);
            removeClass([this.inputEle], CHIP_INPUT);
        }
        this.updateSelectedValues();
    }

    private updateSelectedValues(): void {
        this.dataValue = '';
        let temp: string;
        let text: string;
        let textValue: string = '';
        let selectedData: { [key: string]: Object };
        this.hiddenElement.innerHTML = '';
        if ((!this.isChipDelete || this.treeSettings.autoCheck) && (this.inputWrapper.contains(this.chipWrapper))) {
            this.chipCollection.innerHTML = '';
        }
        if (!isNOU(this.value)) {
            let val: string[] = this.value.slice();
            for (let i: number = 0, len: number = this.value.length; i < len; i++) {
                if (this.treeSettings.loadOnDemand) {
                    selectedData = this.treeObj.getTreeData(this.value[i])[0];
                    text = getValue(this.fields.text, selectedData);
                } else {
                    selectedData = this.treeObj.getNode(this.value[i]);
                    text = getValue('text', selectedData);
                }
                if (text === '') {
                    let index: number = val.indexOf(val[i]);
                    val.splice(index, 1);
                    continue;
                }
                this.selectedText.push(text);
                temp = this.selectedText[this.selectedText.length - 1];
                if (this.selectedText.length > 1) {
                    this.dataValue += (this.delimiterChar + ' ' + temp);
                    textValue += (',' + temp);
                    this.setProperties({ text: textValue }, true);
                } else {
                    this.dataValue += temp;
                    textValue += temp;
                }
                if (this.mode !== 'Delimiter' && (!this.isChipDelete || this.treeSettings.autoCheck) &&
                            (this.allowMultiSelection || this.showCheckBox)) {
                    this.setChipValues(temp, this.value[i]);
                }
                this.hiddenElement.innerHTML += '<option selected value ="' + this.value[i] + '">' +
                                        this.selectedText[this.selectedText.length - 1] + '</option>';
            }
            this.setProperties({ value: val }, true);
        }
        let isValid: boolean = this.getValidMode();
        if (this.mode !== 'Box' && (this.allowMultiSelection || this.showCheckBox) && !isValid) {
            if (this.chipWrapper) {
                addClass([this.chipWrapper], HIDEICON);
                removeClass([this.inputWrapper], SHOW_CHIP);
            }
            Input.setValue(this.dataValue, this.inputEle, this.floatLabelType);
        } else if (!this.allowMultiSelection || !this.showCheckBox) {
            Input.setValue(this.dataValue, this.inputEle, this.floatLabelType);
        }
        if (textValue === '') {
            this.setProperties({ text: null }, true);
        } else {
            this.setProperties({ text: textValue }, true);
        }
        if (this.showClearButton && this.inputFocus) {
            this.showOverAllClear();
        }
        if ((this.allowMultiSelection || this.showCheckBox) && this.popupObj) {
            this.popupObj.refreshPosition();
        }
        this.currentText = this.text;
        this.currentValue = this.value;
    }
    private setChipValues(text: string, value: string): void {
        if (!this.inputWrapper.contains(this.chipWrapper)) {
            this.createChip();
        }
        let chip: HTMLElement = this.createElement('span', {
            className: CHIP,
            attrs: { 'data-value': <string>value }
        });
        let chipContent: HTMLElement = this.createElement('span', { className: CHIP_CONTENT });
        let chipClose: HTMLElement = this.createElement('span', { className: CHIP_CLOSE + ' ' + ICONS });
        chipContent.innerHTML = text;
        chip.appendChild(chipContent);
        this.chipCollection.appendChild(chip);
        if (this.showClearButton) {
            chip.appendChild(chipClose);
            EventHandler.add(chipClose, 'mousedown', this.removeChip, this);
        }
    }

    private setSelectAllWrapper(state: boolean): void {
        if (state && !this.popupDiv.contains(this.checkAllParent) && this.showCheckBox) {
            this.createSelectAllWrapper();
            prepend([this.checkAllParent], this.popupDiv);
        } else if (this.popupDiv.contains(this.checkAllParent)) {
            detach(this.checkAllParent);
        }
    }

    private setHeaderTemplate(): void {
        let compiledString: Function;
        if (this.header) {
            this.header.innerHTML = '';
        } else {
            this.header = this.createElement('div');
            addClass([this.header], HEADER);
        }
        compiledString = this.templateComplier(this.headerTemplate);
        for (let item of compiledString({}, null, null, this.headerTemplateId, this.isStringTemplate)) {
            this.header.appendChild(item);
        }
        this.ddtupdateBlazorTemplates(false, false, true, false);
        this.popupEle.insertBefore(this.header, this.popupDiv);
    }

    private templateComplier(template: string): Function {
        if (template) {
            let e: Object;
            try {
                if (document.querySelectorAll(template).length) {
                    return compile(document.querySelector(template).innerHTML.trim());
                }
            } catch (e) {
                return compile(template);
            }
        }
        return compile(template);
    }


    private setFooterTemplate(): void {
        let compiledString: Function;
        if (this.footer) {
            this.footer.innerHTML = '';
        } else {
            this.footer = this.createElement('div');
            addClass([this.footer], FOOTER);
        }
        compiledString = this.templateComplier(this.footerTemplate);
        for (let item of compiledString({}, null, null, this.footerTemplateId, this.isStringTemplate)) {
            this.footer.appendChild(item);
        }
        this.ddtupdateBlazorTemplates(false, false, false, true);
        append([this.footer], this.popupEle);
    }

    private clearAll(e?: MouseEvent): void {
        if (!this.enabled || this.readonly) {
            return;
        }
        this.resetValue();
        this.showOverAllClear();
        if ((this.allowMultiSelection || this.showCheckBox) && this.popupObj) {
            this.popupObj.refreshPosition();
        }
        if (e) {
            this.isClearButtonClick = true;
        }
        if (!this.changeOnBlur) {
            this.triggerChangeEvent(e);
        }
    }

    private removeChip(e: MouseEvent): void {
        if (!this.enabled || this.readonly) {
            return;
        }
        let element: HTMLElement = (<HTMLElement>e.target).parentElement;
        let value: string = element.getAttribute('data-value');
        if (this.chipCollection) {
            if (element) {
                remove(element);
            }
        }
        this.isChipDelete = true;
        this.isClearButtonClick = true;
        this.value.splice(this.value.indexOf(value), 1);
        this.selectedText = [];
        if (this.allowMultiSelection) {
            this.treeObj.selectedNodes = this.value.slice();
            this.updateSelectedValues();
        }
        if (this.showCheckBox) {
            this.treeObj.uncheckAll([value]);
            this.clearCheckAll();
            this.setMultiSelect();
        }
        this.triggerChangeEvent(e);
        this.isChipDelete = false;
    }

    private resetValue(isDynamicChange?: boolean): void {
        Input.setValue(null, this.inputEle, this.floatLabelType);
        this.oldValue = this.value;
        this.dataValue = null;
        this.setProperties({ value: [] }, true);
        this.setProperties({ text: null }, true);
        setValue('selectedNodes', [], this.treeObj);
        if (this.showCheckBox) {
            this.treeObj.uncheckAll();
            this.setMultiSelect();
            this.clearCheckAll();
        }
        if (this.oldValue === null && !isDynamicChange) {
            this.removeValue = true;
        } else if (isDynamicChange) {
            this.triggerChangeEvent();
        }
        if ((this.allowMultiSelection || this.showCheckBox) && this.chipWrapper) {
            this.chipCollection.innerHTML = '';
        }
    }

    private clearCheckAll(): void {
        if (this.showSelectAll && this.value.length === 0 && this.checkWrapper) {
            let frameSpan: Element = this.checkWrapper.getElementsByClassName(CHECKBOXFRAME)[0];
            if (frameSpan.classList.contains(CHECK)) {
                removeClass([frameSpan], CHECK);
            }
            this.setLocale(false);
        }
    }

    private checkForSelectAll(state: boolean, e?: MouseEvent): void {
        if (this.checkWrapper) {
            this.changeState(this.checkWrapper, !state ? 'uncheck' : 'check', e);
        } else {
            this.checkSelectAll = true;
        }
    }

    private selectAllItems(state: boolean): void {
        if (this.showCheckBox) {
            state ? this.treeObj.checkAll() : this.treeObj.uncheckAll();
            this.checkForSelectAll(state);
        } else if (this.allowMultiSelection) {
            if (!state) {
                this.treeObj.selectedNodes = [];
            } else {
                let li: HTMLElement[] = selectAll('li', this.treeObj.element);
                let id: string;
                let arr: string[] = [];
                for (let i: number = 0; i < li.length; i++) {
                    id = li[i].getAttribute('data-uid').toString();
                    arr.push(id);
                }
                this.treeObj.selectedNodes = arr;
            }
        }
        this.updateMode();
        this.setMultiSelect();
    }

    private updateTreeSettings(prop: DropDownTreeModel): void {
        let value: string = Object.keys(prop.treeSettings)[0];
        if (value === 'autoCheck') {
            this.treeObj.autoCheck = this.treeSettings.autoCheck;
        } else if (value === 'loadOnDemand') {
            this.treeObj.loadOnDemand = this.treeSettings.loadOnDemand;
        } else if (value === 'expandOn') {
            this.treeObj.expandOn = this.treeSettings.expandOn;
            this.treeObj.dataBind();
            return;
        }
        this.treeObj.dataBind();
        this.setMultiSelect();
    }

    private updateCheckBoxState(checkBox: boolean): void {
        this.treeObj.showCheckBox = checkBox;
        this.treeObj.dataBind();
        this.isDynamicChange = true;
        this.setSelectAllWrapper(this.showSelectAll);
        if (this.showSelectAll) {
            this.setLocale();
        }
        if (this.showCheckBox) {
            this.updateMode();
        }
        this.setMultiSelect();
        this.isDynamicChange = false;
    }


    private updateTemplate(): void {
        if (this.popupObj) {
            this.popupObj.destroy();
            if (this.isPopupOpen) {
                this.hidePopup();
                this.isFirstRender = true;
                this.renderPopup();
            } else {
                this.isFirstRender = true;
            }
        }
    }

    private l10nUpdate(actionFailure?: boolean): void {
        let ele: Element = this.popupDiv;
        if (this.noRecordsTemplate !== 'No Records Found' || this.actionFailureTemplate !== 'The Request Failed') {
            let template: string = actionFailure ? this.actionFailureTemplate : this.noRecordsTemplate;
            let compiledString: Function;
            let templateId: string = actionFailure ? this.actionFailureTemplateId : this.noRecordsTemplateId;
            ele.innerHTML = '';
            compiledString = this.templateComplier(template);
            for (let item of compiledString({}, null, null, templateId, this.isStringTemplate)) {
                ele.appendChild(item);
            }
            this.ddtupdateBlazorTemplates(!actionFailure, actionFailure);
        } else {
            let l10nLocale: Object = { noRecordsTemplate: 'No Records Found', actionFailureTemplate: 'The Request Failed'};
            this.l10n = new L10n(this.getModuleName(), l10nLocale, this.locale);
            ele.innerHTML = actionFailure ?
            this.l10n.getConstant('actionFailureTemplate') : this.l10n.getConstant('noRecordsTemplate');
        }
    }

    private ddtupdateBlazorTemplates(noRecord: boolean, action: boolean, header?: boolean, footer?: boolean, isEmpty?: boolean): void {
        if (!this.isStringTemplate) {
            if (this.noRecordsTemplate && noRecord) {
                updateBlazorTemplate(this.noRecordsTemplateId, NORECORDSTEMPLATE_PROPERTY, this, isEmpty);
            }
            if (this.actionFailureTemplate && action) {
                updateBlazorTemplate(this.actionFailureTemplateId, ACTIONFAILURETEMPLATE_PROPERTY, this, isEmpty);
            }
            if (header) {
                updateBlazorTemplate(this.headerTemplateId, HEADERTEMPLATE_PROPERTY, this);
            }
            if (footer) {
                updateBlazorTemplate(this.footerTemplateId, FOOTERTEMPLATE_PROPERTY, this);
            }
        }
    }

    private ddtresetBlazorTemplates( noRecord: boolean, action: boolean, header?: boolean, footer?: boolean): void {
        if (!this.isStringTemplate) {
            if (this.noRecordsTemplate && noRecord) {
                resetBlazorTemplate(this.noRecordsTemplateId, NORECORDSTEMPLATE_PROPERTY);
            }
            if (this.actionFailureTemplate && action) {
                resetBlazorTemplate(this.actionFailureTemplateId, ACTIONFAILURETEMPLATE_PROPERTY);
            }
            if (header) {
                resetBlazorTemplate(this.headerTemplateId, HEADERTEMPLATE_PROPERTY);
            }
            if (footer) {
                resetBlazorTemplate(this.footerTemplateId, FOOTERTEMPLATE_PROPERTY);
            }
        }
    }

    private updateRecordTemplate(action? : boolean): void {
        let isEmptyData: boolean = this.treeItems ? (this.treeItems.length <= 0 ? true : false) : true;
        if (isEmptyData) {
            this.l10nUpdate(action);
            this.updateTemplate();
        }
    }

    private updateMultiSelection(state: boolean): void {
        this.treeObj.allowMultiSelection = state;
        this.treeObj.dataBind();
        if (this.allowMultiSelection) {
            this.updateMode();
        }
        this.setMultiSelect();
    }

    /**
     * Dynamically change the value of properties.
     * @private
     */
    public onPropertyChanged(newProp: DropDownTreeModel, oldProp: DropDownTreeModel): void {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'width': this.setElementWidth(newProp.width);
                    if (this.popupObj) {
                        this.popupObj.element.style.width = this.setWidth();
                    }
                    break;
                case 'placeholder': Input.setPlaceholder(newProp.placeholder, this.inputEle); break;
                case 'cssClass': this.setCssClass(newProp.cssClass, oldProp.cssClass); break;
                case 'enableRtl': this.setEnableRTL(this.enableRtl); break;
                case 'fields': this.setFields(); break;
                case 'readonly': Input.setReadonly(newProp.readonly, this.inputEle); break;
                case 'enabled': this.setEnable(); break;
                case 'floatLabelType':
                    Input.removeFloating(this.inputObj);
                    Input.addFloating(this.inputEle, newProp.floatLabelType, this.placeholder, this.createElement);
                    this.ensureClearIconPosition(newProp.floatLabelType);
                    break;
                case 'showClearButton': this.updateClearButton(newProp.showClearButton); break;
                case 'value':
                    if (isNOU(newProp.value) || newProp.value.length === 0) {
                        this.resetValue(true);
                    } else {
                        this.setTreeValue();
                    }
                    break;
                case 'text':
                    if (isNOU(newProp.text)) {
                        this.resetValue();
                    } else {
                        this.setTreeText();
                    }
                    break;
                case 'allowMultiSelection': this.updateMultiSelection(newProp.allowMultiSelection); break;
                case 'mode':
                    let validMode: boolean = this.allowMultiSelection ? true : (this.showCheckBox ? true : false);
                    if (!validMode) { return; }
                    this.updateMode();
                    this.setMultiSelect();
                    break;
                case 'delimiterChar':
                    if (this.mode === 'Box') { return; }
                    if (this.showCheckBox || this.allowMultiSelection) {
                        this.setMultiSelect();
                    }
                    break;
                case 'selectAllText':
                    if (this.showCheckBox && this.showSelectAll) { this.setLocale(); }
                    break;
                case 'unSelectAllText':
                    if (this.showCheckBox && this.showSelectAll) { this.setLocale(false); }
                    break;
                case 'showSelectAll':
                    if (this.showCheckBox) {
                        this.setSelectAllWrapper(newProp.showSelectAll);
                        this.updateTreeHeight();
                    }
                    break;
                case 'showCheckBox':
                    this.updateCheckBoxState(newProp.showCheckBox);
                    this.updateTreeHeight();
                    break;
                case 'treeSettings':
                    this.updateTreeSettings(newProp);
                    break;
                case 'sortOrder':
                    this.treeObj.sortOrder = newProp.sortOrder;
                    this.treeObj.dataBind();
                    break;
                case 'showDropDownIcon': this.updateDropDownIconState(newProp.showDropDownIcon); break;
                case 'popupWidth':
                    if (this.popupObj) {
                        this.popupObj.element.style.width = this.setWidth();
                    }
                    break;
                case 'popupHeight':
                    if (this.popupObj) {
                        this.updatePopupHeight();
                    }
                    break;
                case 'zIndex':
                    if (this.popupObj) {
                        this.popupObj.zIndex = newProp.zIndex;
                    }
                    break;
                case 'headerTemplate': this.updateTemplate(); break;
                case 'footerTemplate': this.updateTemplate(); break;
                case 'itemTemplate':
                    this.treeObj.nodeTemplate = newProp.itemTemplate;
                    this.treeObj.dataBind();
                    break;
                case 'noRecordsTemplate':
                    this.updateRecordTemplate();
                    break;
                case 'actionFailureTemplate':
                    this.updateRecordTemplate(true);
                    break;
            }
        }
    }

    /**
     * Allows you to clear the selected values from the DropDownTree component
     * @method clear
     * @return {void}.
     */
    public clear(): void {
        this.clearAll();
        if (this.inputFocus) {
            this.onFocusOut();
        } else {
            if (this.changeOnBlur) {
                this.triggerChangeEvent();
            }
            this.removeValue = false;
        }
    }

    /**
     * Removes the component from the DOM and detaches all its related event handlers. Also it removes the attributes and classes.
     * @method destroy
     * @return {void}.
     */
    public destroy(): void {
        this.ddtresetBlazorTemplates( true, true, true, true);
        this.unWireEvents();
        this.setCssClass(null, this.cssClass);
        this.resetValue();
        this.treeObj.destroy();
        if (this.popupObj) {
            this.popupObj.destroy();
            detach(this.popupObj.element);
        }
        if (this.element.tagName !== this.getDirective()) {
            this.inputWrapper.parentElement.insertBefore(this.element, this.inputWrapper);
        }
        detach(this.inputWrapper);
        detach(this.popupDiv);
        this.element.classList.remove('e-input');
        super.destroy();

    }

    /**
     * Ensures visibility of the DropDownTree node by using node ID or node element.
     * When many DropDownTree nodes are present and we need to find a particular node, `ensureVisible` property
     * helps to bring the node to visibility by expanding the DropDownTree and scrolling to the specific node.
     * @param  {string | Element} item - Specifies ID of TreeView node/TreeView nodes.
     */
    public ensureVisible(item: string | Element): void {
        this.treeObj.ensureVisible(item);
    }

    /**
     * To get the updated data source of DropDownTree
     * @param  {string | Element} item - Specifies ID of TreeView node/TreeView node.
     * @returns { { [key: string]: Object }[] }.
     */
    public getData(item?: string | Element): { [key: string]: Object }[] {
        return this.treeObj.getTreeData(item);
    }

    /**
     * Close the popup that displays the tree items.
     * @returns void.
     */
    public hidePopup(): void {
        let eventArgs: DdtPopupEventArgs = { popup: this.popupObj };
        this.inputWrapper.classList.remove(ICONANIMATION);
        if (this.popupEle) {
            this.popupEle.style.display = 'none';
        }
        attributes(this.inputWrapper, { 'aria-expanded': 'false' });
        if (this.popupObj && this.isPopupOpen) {
            this.popupObj.hide();
            this.trigger('close', eventArgs);
        }
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

    /**
     * Opens the popup that displays the tree items.
     * @returns void.
     */
    public showPopup(): void {
        if (!this.enabled || this.readonly || this.isPopupOpen) {
            return;
        }
        this.renderPopup();
        this.focusIn();
    }

    /**
     * Return the module name.
     * @private
     */
    public getModuleName(): string {
        return 'dropdowntree';
    }
}