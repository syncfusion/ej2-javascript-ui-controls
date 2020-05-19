import { Input, InputObject, FloatLabelType, TextBox, InputEventArgs } from '@syncfusion/ej2-inputs';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { NotifyPropertyChanges, INotifyPropertyChanged, Property, Event, EmitType } from '@syncfusion/ej2-base';
import { Component, EventHandler, attributes, formatUnit, ChildProperty, remove, L10n, extend } from '@syncfusion/ej2-base';
import { addClass, removeClass, detach, prepend, Complex, closest, setValue, getValue, compile, append } from '@syncfusion/ej2-base';
import { select, selectAll, isNullOrUndefined as isNOU, matches, Browser, KeyboardEvents, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { DataManager, Query, DataUtil } from '@syncfusion/ej2-data';
import { Popup } from '@syncfusion/ej2-popups';
import { updateBlazorTemplate, resetBlazorTemplate, isBlazor} from '@syncfusion/ej2-base';
import { TreeView, NodeSelectEventArgs, DataBoundEventArgs, FieldsSettingsModel, NodeClickEventArgs } from '@syncfusion/ej2-navigations';
import { NodeCheckEventArgs, FailureEventArgs} from '@syncfusion/ej2-navigations';
import { DropDownTreeModel, FieldsModel, TreeSettingsModel } from './drop-down-tree-model';

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
const PARENTITEM: string = 'e-list-parent';
const CONTENT: string = 'e-popup-content';
const DROPDOWN: string = 'e-dropdown';
const DISABLED: string = 'e-disabled';
const ICONS: string = 'e-icons';
const CHECKALLPARENT: string = 'e-selectall-parent';
const CHECKALLHIDE: string = 'e-hide-selectall';
const BIGGER: string = 'e-bigger';
const SMALL: string = 'e-small';
const ALLTEXT: string = 'e-all-text';
const CHECKBOXFRAME: string = 'e-frame';
const CHECK: string = 'e-check';
const CHECKBOXWRAP: string = 'e-checkbox-wrapper';
const FILTERWRAP: string = 'e-filter-wrap';
const DDTICON: string = 'e-ddt-icon';
const FOOTER: string = 'e-ddt-footer';
const HEADER: string = 'e-ddt-header';
const NODATACONTAINER: string = 'e-ddt-nodata';
const NODATA: string = 'e-no-data';
const HEADERTEMPLATE: string = 'HeaderTemplate';
const FOOTERTEMPLATE: string = 'FooterTemplate';
const NORECORDSTEMPLATE: string = 'NoRecordsTemplate';
const ACTIONFAILURETEMPLATE: string = 'ActionFailureTemplate';

export type TreeFilterType = 'StartsWith' | 'EndsWith' | 'Contains';

export class Fields extends ChildProperty<Fields> {

    /**
     * This field specifies the child items or mapping field for the nested child items that contains an array of JSON objects.
     */
    @Property('child')
    public child: string | FieldsModel;

    /**
     * Specifies the array of JavaScript objects or instance of Data Manager to populate the dropdown tree items.
     * @default []
     */
    @Property([])
    public dataSource: DataManager | { [key: string]: Object }[];

    /**
     * This fields specifies the mapping field to define the expanded state of a Dropdown tree item.
     */
    @Property('expanded')
    public expanded: string;

    /**
     * This field specifies the mapping field to indicate whether the Dropdown tree item has children or not.
     */
    @Property('hasChildren')
    public hasChildren: string;

    /**
     * Specifies the mapping field for htmlAttributes to be added to the Dropdown Tree item.
     */
    @Property('htmlAttributes')
    public htmlAttributes: string;

    /**
     * Specifies the mapping field for icon class of each Dropdown Tree item that will be added before the text.
     */
    @Property('iconCss')
    public iconCss: string;

    /**
     * Specifies the mapping field for image URL of each Dropdown Tree item where image will be added before the text.
     */
    @Property('imageUrl')
    public imageUrl: string;

    /**
     * Specifies the parent value field mapped in the data source.
     */
    @Property('parentValue')
    public parentValue: string;

    /**
     * Defines the external [`Query`](http://ej2.syncfusion.com/documentation/data/api-query.html)
     * that will execute along with the data processing.
     * @default null
     */
    @Property(null)
    public query: Query;

    /**
     * Specifies the mapping field for the selected state of the Dropdown Tree item.
     */
    @Property('selected')
    public selected: string;

    /**
     * Specifies the table name used to fetch data from a specific table in the server.
     */
    @Property(null)
    public tableName: string;

    /**
     * Specifies the mapping field for text displayed as Dropdown Tree items display text.
     */
    @Property('text')
    public text: string;

    /**
     * Specifies the mapping field for tooltip that will be displayed as hovering text of the Dropdown Tree item.
     */
    @Property('tooltip')
    public tooltip: string;

    /**
     * Specifies the value(ID) field mapped in the data source.
     */
    @Property('value')
    public value: string;
}

export class TreeSettings extends ChildProperty<TreeSettings> {
    /**
     * Specifies whether the child and parent tree items check states are dependent over each other when checkboxes are enabled.
     * @default false
     */

    @Property(false)
    public autoCheck: boolean;

    /**
     * Specifies the action on which the parent items in the pop-up should expand or collapse. The available actions are
     * * `Auto` - In desktop, the expand or collapse operation happens when you double-click the node, 
     * and in mobile devices it happens on single-tap.
     * * `Click` - The expand or collapse operation happens when you perform single-click/tap 
     * on the pop-up item in both desktop and mobile devices.
     * * `DblClick` - The expand or collapse operation happens when you perform a double-click/tap 
     * on the pop-up item in both desktop and mobile devices.
     * * `None` - The expand or collapse operation will not happen when you perform single-click/tap 
     * or double-click/tap on the pop-up items in both desktop and mobile devices.
     * @default 'Auto'
     */
    @Property('Auto')
    public expandOn: ExpandOn;

    /**
     * By default, the load on demand (Lazy load) is set to false.
     * Enabling this property will render only the parent tree items in the popup and
     * the child items will be rendered on demand when expanding the corresponding parent node.
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
     * Returns the component previous values.
     */
    oldValue: string[];
    /**
     * Returns the updated component values.
     */
    value: string[];
    /**
     * Specifies the original event.
     */
    e: MouseEvent | KeyboardEvent;
    /**
     * Returns the root element of the component.
     */
    element: HTMLElement;
}

export interface DdtBeforeOpenEventArgs {
    /**
     * Determines whether the current action needs to be prevented or not.
     */
    cancel: boolean;
}

export interface DdtPopupEventArgs {
    /**
     * Specifies the pop-up object.
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
     * Specifies whether the element is interacted when focusing or not.
     */
    isInteracted?: boolean;
    /**
     * Specifies the original event.
     */
    event?: MouseEvent | FocusEvent | TouchEvent | KeyboardEvent;
}

export interface DdtFilteringEventArgs {
    /**
     * To prevent the internal filtering action.
     */
    preventDefaultAction: boolean;
    /**
     * Gets the `input` event arguments.
     */
    event: Event;
    /**
     * Determines whether the current action needs to be prevented or not.
     */
    cancel: boolean;
    /**
     * Filter text value.
     */
    text: string;
    /**
     * Gets or sets the fields of Dropdown Tree.
     */
    fields: FieldsModel;
}

export interface DdtSelectEventArgs {
    /**
     * Returns the name of action like select or unselect.
     */
    action: string;
    /**
     * If the event is triggered by interacting the Dropdown Tree, it returns true. Otherwise, it returns false.
     */
    isInteracted: boolean;
    /**
     * Returns the currently selected Dropdown item.
     */
    item: HTMLLIElement;
    /**
     * Return the currently selected item as JSON object from the data source.
     */
    itemData: { [key: string]: Object };
}

export interface DdtKeyPressEventArgs {
    /**
     * If you want to cancel this event then, set cancel as true. Otherwise, false.
     */
    cancel: boolean;
    /**
     * Return the actual event.
     */
    event: KeyboardEventArgs;
}

export type Mode = 'Default' | 'Delimiter' | 'Box';

export type SortOrder = 'None' | 'Ascending' | 'Descending';

export type ExpandOn = 'Auto' | 'Click' | 'DblClick' | 'None';

/**
 * The Dropdown Tree control allows you to select single or multiple values from hierarchical data in a tree-like structure.
 * It has several out-of-the-box features, such as data binding, check boxes, templates, filter,
 * UI customization, accessibility, and preselected values.
 * ```html
 *  <input type="text" id="tree"></input>
 * ```
 * ```typescript
 *  let ddtObj: DropDownTree = new DropDownTree();
 *  ddtObj.appendTo("#tree");
 * ```
 */

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
    private filterTimer: number = null;
    private filterContainer: HTMLElement;
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
    private noRecord: HTMLElement;
    private headerTemplateId: string;
    private footerTemplateId: string;
    private l10n: L10n;
    private actionFailureTemplateId: string;
    private noRecordsTemplateId: string;
    private isValueChange: boolean;
    private keyEventArgs: KeyboardEvent;
    private keyboardModule: KeyboardEvents;
    private keyConfigs: { [key: string]: string };
    private isBlazorPlatForm: boolean;

    private isFilteredData: boolean = false;
    private isFilterRestore: boolean = false;
    private treeData: { [key: string]: Object }[];
    private selectedData: { [key: string]: Object }[] = [];
    private filterObj: TextBox;
    private filterDelayTime: number = 300;
    private nestedTableUpdate: { flag: boolean, fields: FieldsModel };

    /**
     * Specifies the template that renders to the popup list content of the 
     * Dropdown Tree component when the data fetch request from the remote server fails.
     * @default 'The Request Failed'
     */
    @Property('The Request Failed')
    public actionFailureTemplate: string;

    /**
     * When allowFiltering is set to true, it shows the filter bar (search text box) of the component.
     * The filter action retrieves matched items through the **filtering** event based on the characters typed in the search text box.
     * If no match is found, the value of the **noRecordsTemplate** property will be displayed.
     * 
     * @default false
     */
    @Property(false)
    public allowFiltering: boolean;

    /**
     * Enables or disables the multi-selection of items. To select multiple items:
     * * Select the items by holding down the **CTRL** key when clicking on the items.
     * * Select consecutive items by clicking the first item to select and hold down the **SHIFT** key and click the last item to select.
     *
     * @default false
     */
    @Property(false)
    public allowMultiSelection: boolean;

    /**
     * By default, the Dropdown Tree component fires the change event while focusing out the component.
     * If you want to fire the change event on every value selection and remove, then disable this property.
     * 
     * @default true
     */
    @Property(true)
    public changeOnBlur: boolean;

    /**
     * Specifies the CSS classes to be added with the root and popup element of the Dropdown Tree component.
     * that allows customization of appearance.
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Defines the value separator character in the input element when multi-selection or checkbox is enabled in the Dropdown Tree.
     * The delimiter character is applicable only for **default** and **delimiter** visibility modes.
     * @default ","
     */
    @Property(',')
    public delimiterChar: string;

    /**
     * Specifies a value that indicates whether the Dropdown Tree component is enabled or not.
     * @default true
     */
    @Property(true)
    public enabled: boolean;

    /**
     * Specifies the data source and mapping fields to render Dropdown Tree items.
     * @default {value: 'value', text: 'text', dataSource: [], child: 'child', parentValue: 'parentValue', hasChildren: 'hasChildren',
     *  expanded: 'expanded', htmlAttributes: 'htmlAttributes', iconCss: 'iconCss', imageUrl: 'imageUrl',
     *  query: null, selected: 'selected', tableName: null, tooltip: 'tooltip'}
     */
    @Complex<FieldsModel>({}, Fields)
    public fields: FieldsModel;

    /**
     * Accepts the value to be displayed as a watermark text on the filter bar.
     * @default null
     */
    @Property(null)
    public filterBarPlaceholder: string;

    /**   
     * Determines on which filter type, the component needs to be considered on search action.
     * The **TreeFilterType** and its supported data types are,
     * 
     * <table> 
     * <tr> 
     * <td colSpan=1 rowSpan=1><b> 
     * TreeFilterType</b></td><td colSpan=1 rowSpan=1><b> 
     * Description</b></td><td colSpan=1 rowSpan=1><b> 
     * Supported Types</b></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * StartsWith<br/></td><td colSpan=1 rowSpan=1> 
     * Checks whether a value begins with the specified value.<br/></td><td colSpan=1 rowSpan=1> 
     * String<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * EndsWith<br/></td><td colSpan=1 rowSpan=1> 
     * Checks whether a value ends with the specified value.<br/></td><td colSpan=1 rowSpan=1> 
     * String<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * Contains<br/></td><td colSpan=1 rowSpan=1> 
     * Checks whether a value contains with specified value.<br/></td><td colSpan=1 rowSpan=1> 
     * String<br/></td></tr> 
     * </table>
     * 
     * The default value set to **StartsWith**, all the suggestion items which starts with typed characters to listed in the
     * suggestion popup.
     * @default 'StartsWith'
     */
    @Property('StartsWith')
    public filterType: TreeFilterType;

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
     * Specifies the template that renders a customized footer container at the bottom of the pop-up list.
     * By default, the footerTemplate will be null and there will be no footer container for the pop-up list.
     * @default null
     */
    @Property(null)
    public footerTemplate: string;

    /**
     * When **ignoreAccent** is set to true, then it ignores the diacritic characters or accents when filtering.
     */
    @Property(false)
    public ignoreAccent: boolean;

    /**
     * When set to false, consider the case-sensitive on performing the search to find suggestions. By default, consider the casing.
     * @default true
     */
    @Property(true)
    public ignoreCase: boolean;

    /**
     * Specifies the template that renders a customized header container at the top of the pop-up list.
     * By default, the headerTemplate will be null and there will be no header container for the pop-up list.
     * @default null
     */
    @Property(null)
    public headerTemplate: string;

    /**
     * Allows additional HTML attributes such as title, name, etc., and accepts n number of attributes in a key-value pair format.
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string; };

    /**
     * Specifies a template to render customized content for all the items. 
     * If the **itemTemplate** property is set, the template content overrides the displayed item text.
     * The property accepts [template string](http://ej2.syncfusion.com/documentation/base/template-engine.html)
     * or HTML element ID holding the content.
     * @default null
     */
    @Property(null)
    public itemTemplate: string;

    /**
     * Configures visibility mode for component interaction when allowMultiSelection or checkbox is enabled.
     * Different modes are:
     * * Box : Selected items will be visualized in chip.
     * * Delimiter : Selected items will be visualized in the text content.
     * * Default : On focus in component will act in the box mode. On blur component will act in the delimiter mode.
     */
    @Property('Default')
    public mode: Mode;

    /**
     * Specifies the template that renders a customized pop-up list content when there is no data available
     * to be displayed within the pop-up.
     * @default 'No Records Found'
     */
    @Property('No Records Found')
    public noRecordsTemplate: string;

    /**
     * Specifies a short hint that describes the expected value of the Dropdown Tree component.
     * @default null
     */
    @Property(null)
    public placeholder: string;

    /**
     * Specifies the height of the pop-up list.
     * @default '300px'
     */
    @Property('300px')
    public popupHeight: string | number;

    /**
     * Specifies the width of the popup list. By default, the popup width sets based on the width of the Dropdown Tree element.
     * @default '100%'
     */
    @Property('100%')
    public popupWidth: string | number;

    /**
     * When set to true, the user interactions on the component will be disabled.
     * @default false
     */
    @Property(false)
    public readonly: boolean;

    /**
     * Specifies whether to show or hide the selectAll checkbox in the pop-up which allows you to select all the items in the pop-up.
     * @default false
     */
    @Property(false)
    public showSelectAll: boolean;
    /**
     * Specifies the display text for the selectAll checkbox in the pop-up.
     * @default 'Select All'
     */
    @Property('Select All')
    public selectAllText: string;

    /**
     * Enables or disables the checkbox option in the Dropdown Tree component.
     * If enabled, the Checkbox will be displayed next to the expand or collapse icon of the tree items.
     * @default false
     */
    @Property(false)
    public showCheckBox: boolean;

    /**
     * Specifies whether to show or hide the clear icon in textbox.
     * When the clear button is clicked, `value`, `text` properties will be reset to null.
     * @default true
     */
    @Property(true)
    public showClearButton: boolean;

    /**
     * Specifies whether to show or hide the Dropdown button.
     * 
     * @default true
     */
    @Property(true)
    public showDropDownIcon: boolean;

    /**
     * Specifies a value that indicates whether the items are sorted in the ascending or descending order, or not sorted at all.
     * The available types of sort order are,
     * * `None` - The items are not sorted.
     * * `Ascending` - The items are sorted in the ascending order.
     * * `Descending` - The items are sorted in the descending order.
     * @default 'None'
     */
    @Property('None')
    public sortOrder: SortOrder;


    /**
     * Gets or sets the display text of the selected item which maps the data **text** field in the component.
     * @default null
     */
    @Property(null)
    public text: string;

    /**
     * Configures the pop-up tree settings.
     * @default {autoCheck: false, loadOnDemand: true}
     */
    @Complex<TreeSettingsModel>({}, TreeSettings)
    public treeSettings: TreeSettingsModel;

    /**
     * Specifies the display text for the unselect all checkbox in the pop-up.
     * @default 'Unselect All'
     */
    @Property('Unselect All')
    public unSelectAllText: string;

    /**
     * Gets or sets the value of selected item(s) which maps the data **value** field in the component.
     * @default null
     * @aspType Object
     */
    @Property(null)
    public value: string[];
    /**
     * Specifies the width of the component. By default, the component width sets based on the width of its parent container.
     * You can also set the width in pixel values.
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;

    /**
     * Specifies the z-index value of the pop-up element.
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
     * Triggers when the Dropdown Tree input element gets focus-out.
     * @event
     */
    @Event()
    public blur: EmitType<Object>;

    /**
     * Triggers when the Dropdown Tree is created successfully.
     * @event
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Triggers when data source is populated in the Dropdown Tree.
     * @event
     */
    @Event()
    public dataBound: EmitType<DdtDataBoundEventArgs>;

    /**
     * Triggers when the Dropdown Tree is destroyed successfully.
     * @event
     */
    @Event()
    public destroyed: EmitType<Object>;

    /**
     * Triggers on typing a character in the filter bar when the **allowFiltering** is enabled.
     * 
     * @event
     * @blazorProperty 'Filtering'
     */
    @Event()
    public filtering: EmitType<DdtFilteringEventArgs>;

    /**
     * Triggers when the Dropdown Tree input element is focused.
     * @event
     */
    @Event()
    public focus: EmitType<DdtFocusEventArgs>;

    /**
     * Triggers when key press is successful. It helps to customize the operations at key press.
     * @event
     */
    @Event()
    public keyPress: EmitType<DdtKeyPressEventArgs>;

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
        this.headerTemplateId = `${this.element.id}${HEADERTEMPLATE}`;
        this.footerTemplateId = `${this.element.id}${FOOTERTEMPLATE}`;
        this.actionFailureTemplateId = `${this.element.id}${ACTIONFAILURETEMPLATE}`;
        this.noRecordsTemplateId = `${this.element.id}${NORECORDSTEMPLATE}`;
        this.keyConfigs = {
            escape: 'escape',
            altUp: 'alt+uparrow',
            altDown: 'alt+downarrow',
            tab: 'tab',
            shiftTab: 'shift+tab',
            end: 'end',
            enter: 'enter',
            home: 'home',
            moveDown: 'downarrow',
            moveLeft: 'leftarrow',
            moveRight: 'rightarrow',
            moveUp: 'uparrow',
            ctrlDown: 'ctrl+downarrow',
            ctrlUp: 'ctrl+uparrow',
            ctrlEnter: 'ctrl+enter',
            ctrlHome: 'ctrl+home',
            ctrlEnd: 'ctrl+end',
            shiftDown: 'shift+downarrow',
            shiftUp: 'shift+uparrow',
            shiftEnter: 'shift+enter',
            shiftHome: 'shift+home',
            shiftEnd: 'shift+end',
            csDown: 'ctrl+shift+downarrow',
            csUp: 'ctrl+shift+uparrow',
            csEnter: 'ctrl+shift+enter',
            csHome: 'ctrl+shift+home',
            csEnd: 'ctrl+shift+end',
            space: 'space',
            ctrlA: 'ctrl+A'
        };
    }

    /**
     * To Initialize the control rendering
     * @private
     */
    public render(): void {
        this.ensureAutoCheck();
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
        this.wireTreeEvents();
        this.popupDiv.style.display = 'none';
        this.renderTree();
        this.isRemoteData = this.fields.dataSource instanceof DataManager;
        if (!this.isRemoteData) {
            this.setTreeValue();
            this.setTreeText();
            this.updateHiddenValue();
            this.setSelectedValue();
        }
        if ((this.allowMultiSelection || this.showCheckBox) && this.mode !== 'Delimiter') {
            this.createChip();
        }
        this.wireEvents();
        this.oldValue = this.value;
        this.isInitialized = true;
        this.renderComplete();
    }

    private ensureAutoCheck(): void {
        if (this.allowFiltering && this.treeSettings.autoCheck) {
            this.setProperties({ treeSettings: { autoCheck: false } }, true);
        }
    }

    private hideCheckAll(flag: boolean): void {
        let checkAllEle : HTMLElement = !isNOU(this.popupEle) ? (this.popupEle.querySelector('.' + CHECKALLPARENT) as HTMLElement) : null;
        if (!isNOU(checkAllEle)) {
            if (flag && !checkAllEle.classList.contains(CHECKALLHIDE)) {
                addClass([checkAllEle], CHECKALLHIDE);
            } else if (!flag && checkAllEle.classList.contains(CHECKALLHIDE)) {
                removeClass([checkAllEle], CHECKALLHIDE);
            }
        }
    }

    private renderFilter(): void {
        this.filterContainer = this.createElement('div', {
            id: this.element.id + '_filter_wrap',
            className: FILTERWRAP
        });
        let filterInput: HTMLElement = this.createElement('input', {
            id: this.element.id + '_filter',
            attrs: { autocomplete: 'off', 'aria-label': this.filterBarPlaceholder }
        });
        this.filterContainer.appendChild(filterInput);
        prepend([this.filterContainer], this.popupEle);
        this.filterObj = new TextBox({
            value: '',
            showClearButton: true,
            placeholder: this.filterBarPlaceholder,
            input: this.filterChangeHandler.bind(this),
        });
        this.filterObj.appendTo('#' + this.element.id + '_filter');
    }
    private filterChangeHandler(args?: InputEventArgs): void {
        if (!isNOU(args.value)) {
            window.clearTimeout(this.filterTimer);
            this.filterTimer = window.setTimeout(() => { this.filterHandler(args.value, args.event); }, this.filterDelayTime);
        }
    }

    private filterHandler(value: string, event: Event): void {
        if (!this.isFilteredData) { this.treeData = this.treeObj.getTreeData(); }
        let filterFields: FieldsModel = this.cloneFields(this.fields);
        let args: DdtFilteringEventArgs = {
            cancel: false,
            preventDefaultAction: false,
            event: event,
            text: value,
            fields: filterFields
        };
        this.trigger('filtering', args, (args: DdtFilteringEventArgs) => {
            if (!args.cancel) {
                let flag: boolean = false;
                let fields: FieldsModel;
                this.isFilteredData = true;
                if (value === '') {
                    this.isFilteredData = false;
                    this.isFilterRestore = true;
                    fields = this.cloneFields(this.fields);
                } else if (args.preventDefaultAction) {
                    fields = args.fields;
                } else {
                    if (this.treeDataType === 1) {
                        fields = this.selfReferencefilter(value, args.fields);
                    } else {
                        if (this.fields.dataSource instanceof DataManager) {
                            flag = true;
                        } else {
                            fields = this.nestedFilter(value, args.fields);
                        }
                    }
                }
                this.hideCheckAll(this.isFilteredData);
                if (flag) { return; }
                this.treeObj.fields = this.getTreeFields(fields);
                this.treeObj.dataBind();
            }
        });
    }

    private nestedFilter(value: string, filteredFields: FieldsModel): FieldsModel {
        let matchedDataSource: { [key: string]: Object }[] = [];
        for (let i: number = 0; i < this.treeData.length; i++) {
            let filteredChild: { [key: string]: Object } = this.nestedChildFilter(value, this.treeData[i]);
            if (!isNOU(filteredChild)) { matchedDataSource.push(filteredChild); }
        }
        filteredFields.dataSource = matchedDataSource;
        return filteredFields;
    }

    private nestedChildFilter(value: string, node: { [key: string]: Object }): { [key: string]: Object } {
        let children: { [key: string]: Object }[] = <{ [key: string]: Object }[]>node[this.fields.child as string];
        if (isNOU(children)) {
            return (this.isMatchedNode(value, node)) ? node : null;
        } else {
            let matchedChildren: { [key: string]: Object }[] = [];
            for (let i: number = 0; i < children.length; i++) {
                let filteredChild: { [key: string]: Object } = this.nestedChildFilter(value, children[i]);
                if (!isNOU(filteredChild)) { matchedChildren.push(filteredChild); }
            }
            if (matchedChildren.length !== 0) {
                node[this.fields.child as string] = matchedChildren;
                return node;
            } else {
                node[this.fields.child as string] = null;
                return (this.isMatchedNode(value, node)) ? node : null;
            }
        }
    }

    private selfReferencefilter(value: string, filteredFields: FieldsModel): FieldsModel {
        let matchedData: { [key: string]: Object }[] = [];
        let matchedDataSource: { [key: string]: Object }[] = [];
        for (let i: number = 0; i < this.treeData.length; i++) {
            if (this.isMatchedNode(value, this.treeData[i])) {
                matchedData.push(this.treeData[i]);
            }
        }
        for (let i: number = 0; i < matchedData.length; i++) {
            if (matchedDataSource.indexOf(matchedData[i]) === -1) {
                matchedDataSource.push(matchedData[i]);
                let parentId: object = matchedData[i][this.fields.parentValue];
                while (!isNOU(parentId)) {
                    let parent: { [key: string]: Object } = null;
                    for (let j: number = 0; j < this.treeData.length; j++) {
                        let value: object = this.treeData[j][this.fields.value];
                        if (!isNOU(value) && (value === parentId)) {
                            parent = this.treeData[j];
                            break;
                        }
                    }
                    if (!isNOU(parent) && (matchedDataSource.indexOf(parent) === -1)) {
                        matchedDataSource.push(parent);
                        parentId = parent[this.fields.parentValue];
                    } else {
                        break;
                    }
                }
            }
        }
        filteredFields.dataSource = matchedDataSource;
        return filteredFields;
    }

    private isMatchedNode(value: string, node: { [key: string]: Object }): boolean {
        let checkValue: string = node[this.fields.text] as string;
        if (this.ignoreCase) {
            checkValue = checkValue.toLowerCase();
            value = value.toLowerCase();
        }
        if (this.ignoreAccent) {
            checkValue = DataUtil.ignoreDiacritics(checkValue) as string;
            value = DataUtil.ignoreDiacritics(value) as string;
        }
        if (this.filterType === 'StartsWith') {
            return checkValue.slice(0, value.length) === value;
        } else if (this.filterType === 'EndsWith') {
            return checkValue.slice(-value.length) === value;
        } else {
            return checkValue.indexOf(value) !== -1;
        }
    }

    /* To wire events for the dropdown tree */
    private wireEvents(): void {
        EventHandler.add(this.inputWrapper, 'mouseup', this.dropDownClick, this);
        EventHandler.add(this.inputWrapper, 'focus', this.focusIn, this);
        EventHandler.add(this.inputWrapper, 'blur', this.focusOut, this);
        EventHandler.add(this.inputWrapper, 'mousemove', this.mouseIn, this);
        EventHandler.add(this.inputWrapper, 'mouseout', this.onMouseLeave, this);
        EventHandler.add(this.overAllClear, 'mousedown', this.clearAll, this);
        EventHandler.add(<HTMLElement & Window>window, 'resize', this.windowResize, this);
        this.keyboardModule = new KeyboardEvents(
            this.inputWrapper,
            {
                keyAction: this.keyActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown',
            }
        );
    }

    private wireTreeEvents(): void {
        this.keyboardModule = new KeyboardEvents(
            this.tree,
            {
                keyAction: this.treeAction.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown',
            }
        );
    }

    private wireCheckAllWrapperEvents(): void {
        this.keyboardModule = new KeyboardEvents(
            this.checkAllParent,
            {
                keyAction: this.checkAllAction.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown',
            }
        );
    }

    /* To unwire events for the dropdown tree */
    private unWireEvents(): void {
        EventHandler.remove(this.inputWrapper, 'mouseup', this.dropDownClick);
        EventHandler.remove(this.inputWrapper, 'focus', this.focusIn);
        EventHandler.remove(this.inputWrapper, 'blur', this.focusOut);
        EventHandler.remove(this.inputWrapper, 'mousemove', this.mouseIn);
        EventHandler.remove(this.inputWrapper, 'mouseout', this.onMouseLeave);
        EventHandler.remove(this.overAllClear, 'mousedown', this.clearAll);
        EventHandler.remove(<HTMLElement & Window>window, 'resize', this.windowResize);
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
        if (!this.enabled || this.readonly || !this.inputFocus) {
            return;
        }
        if ((Browser.isIE || Browser.info.name === 'edge') && (e.target === this.inputWrapper)) {
            return;
        }
        let target: HTMLElement = <HTMLElement>e.relatedTarget;
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
        }
        if (this.changeOnBlur) {
            this.triggerChangeEvent(event);
        }
        this.removeValue = false;
        this.oldValue = this.value;
        this.trigger('blur');
    }

    private triggerChangeEvent(event?: MouseEvent | KeyboardEvent): void {
        let isEqual: boolean = this.compareValues(this.oldValue, this.value);
        if ((!isEqual || this.isChipDelete) && !this.removeValue) {
            let eventArgs: DdtChangeEventArgs = {
                e: event,
                oldValue: this.oldValue,
                value: this.value,
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
            if (this.chipWrapper && (this.value && this.value.length !== 0)) {
                removeClass([this.chipWrapper], HIDEICON);
                addClass([this.inputWrapper], SHOW_CHIP);
                addClass([this.inputEle], CHIP_INPUT);
            }
            if (this.popupObj) {
                this.popupObj.refreshPosition();
            }
        }
        let args: DdtFocusEventArgs = { isInteracted: e ? true : false, event: e };
        this.trigger('focus', args);
    }

    private treeAction(e: KeyboardEventArgs): void {
        let eventArgs: DdtKeyPressEventArgs = {
            cancel: false,
            event: e,
        };
        this.trigger('keyPress', eventArgs, (observedArgs: DdtKeyPressEventArgs) => {
            if (!observedArgs.cancel) {
                switch (e.action) {
                    case 'escape':
                    case 'altUp':
                        this.inputWrapper.focus();
                        e.preventDefault();
                        if (this.isPopupOpen) {
                            this.hidePopup();
                        }
                        break;
                    case 'tab':
                    case 'shiftTab':
                        if (this.isPopupOpen) {
                            this.hidePopup();
                        }
                        break;
                    case 'enter':
                    case 'ctrlEnter':
                    case 'shiftEnter':
                    case 'csEnter':
                        if (!this.showCheckBox) {
                            this.isValueChange = true;
                            this.keyEventArgs = e;
                        }
                        break;
                    case 'space':
                        this.isValueChange = true;
                        this.keyEventArgs = e;
                        break;
                    case 'ctrlA':
                        if (this.allowMultiSelection) {
                            this.selectAll(true);
                        }
                        break;
                    case 'moveRight':
                    case 'moveLeft':
                    case 'shiftDown':
                    case 'moveDown':
                    case 'ctrlDown':
                    case 'csDown':
                    case 'shiftUp':
                    case 'moveUp':
                    case 'ctrlUp':
                    case 'csUp':
                    case 'home':
                    case 'shiftHome':
                    case 'ctrlHome':
                    case 'csHome':
                    case 'end':
                    case 'shiftEnd':
                    case 'ctrlEnd':
                    case 'csEnd':
                }
            } else {
                e.stopImmediatePropagation();
            }
        });
    }

    private keyActionHandler(e: KeyboardEventArgs): void {
        let eventArgs: DdtKeyPressEventArgs = {
            cancel: false,
            event: e,
        };
        this.trigger('keyPress', eventArgs, (observedArgs: DdtKeyPressEventArgs) => {
            if (!observedArgs.cancel) {
                switch (e.action) {
                    case 'escape':
                    case 'altUp':
                    case 'shiftTab':
                    case 'tab':
                        if (this.isPopupOpen) {
                            this.hidePopup();
                        }
                        break;
                    case 'altDown':
                        if (!this.isPopupOpen) {
                            this.showPopup();
                            e.preventDefault();
                        }
                        break;
                    case 'moveDown':
                        if (this.showSelectAll && this.showCheckBox) {
                            this.checkAllParent.focus();
                        }
                        break;
                }
            }
        });
    }

    private checkAllAction(e: KeyboardEventArgs): void {
        let eventArgs: DdtKeyPressEventArgs = {
            cancel: false,
            event: e,
        };
        this.trigger('keyPress', eventArgs, (observedArgs: DdtKeyPressEventArgs) => {
            if (!observedArgs.cancel) {
                switch (e.action) {
                    case 'space':
                        this.clickHandler(e);
                        break;
                    case 'moveDown':
                        this.treeObj.element.focus();
                }
            }
        });
    }

    private windowResize(): void {
        if (this.popupObj) {
            this.popupObj.setProperties({ width: this.setWidth() });
            this.popupObj.refreshPosition();
        }
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
        if (this.allowMultiSelection || this.showCheckBox) {
            return this.mode === 'Box' ? true : (this.mode === 'Default' && this.inputFocus) ? true : false;
        } else {
            return false;
        }
    }

    private createSelectAllWrapper(): void {
        this.checkAllParent = this.createElement('div', {
            className: CHECKALLPARENT,  attrs: { 'tabindex': '0' }
        });
        this.selectAllSpan = this.createElement('span', {
            className: ALLTEXT
        });
        this.selectAllSpan.textContent = '';
        let ele: Element = closest(this.element, '.' + BIGGER);
        let touchClass: string = isNOU(ele) ? '' : SMALL;
        this.checkBoxElement = createCheckBox(this.createElement, true, { cssClass: touchClass });
        this.checkBoxElement.setAttribute('role', 'checkbox');
        this.checkAllParent.appendChild(this.checkBoxElement);
        this.checkAllParent.appendChild(this.selectAllSpan);
        this.setLocale();
        EventHandler.add(this.checkAllParent, 'mouseup', this.clickHandler, this);
        this.wireCheckAllWrapperEvents();
    }

    private clickHandler(e: MouseEvent| KeyboardEvent): void {
        let target: EventTarget;
        if ((e.currentTarget && (e.currentTarget as HTMLElement).classList.contains(CHECKALLPARENT))) {
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
        wrapper: HTMLElement | Element, state: string, e?: MouseEvent | KeyboardEvent): void {
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
        this.ensurePlaceHolder();
        ariaState = state === 'check' ? 'true' : 'false';
        if (!isNOU(ariaState)) {
            wrapper.setAttribute('aria-checked', ariaState);
        }
    }

    private setLocale(unSelect?: boolean): void {
        if (!this.selectAllSpan) {return; }
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
                    this.setProperties({ enabled: false }, true);
                    this.setEnable();
                } else if (htmlAttr === 'readonly' && !isNOU(this.htmlAttributes[htmlAttr])) {
                    this.setProperties({ readonly: true }, true);
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
            fields: this.getTreeFields(this.fields),
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
        if (this.isFilteredData) {
            this.filterObj.value = '';
            this.treeObj.fields = this.getTreeFields(this.fields);
            this.isFilterRestore = true;
            this.isFilteredData = false;
            this.hideCheckAll(false);
        }
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
                if (this.allowFiltering) { this.renderFilter(); }
                if (this.showCheckBox && this.showSelectAll && (!this.popupDiv.classList.contains(NODATA))) {
                    this.createSelectAllWrapper();
                    this.popupEle.insertBefore(this.checkAllParent, this.popupDiv);
                }
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
                if (!(this.showCheckBox && this.showSelectAll) && (!this.popupDiv.classList.contains(NODATA)
                                                                            && this.treeItems.length > 0)) {
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
        if (this.isFirstRender) {return; }
        let popupHeight: string =  this.getHeight();
        this.popupEle.style.maxHeight = popupHeight;
        if (this.allowFiltering) {
            let height: number = Math.round(this.filterContainer.getBoundingClientRect().height);
            popupHeight = formatUnit(parseInt(popupHeight, 10) - height + 'px');
        }
        if (this.headerTemplate) {
            let height: number = Math.round(this.header.getBoundingClientRect().height);
            popupHeight = formatUnit(parseInt(popupHeight, 10) - height + 'px');
        }
        if (this.showCheckBox && this.showSelectAll) {
            let height: number = Math.round(this.checkAllParent.getBoundingClientRect().height);
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
        let isFilter: Element = closest(target, '.' + FILTERWRAP);
        if ((this.isPopupOpen && (this.inputWrapper.contains(target) || isTree || isFilter)) ||
            ((this.allowMultiSelection || this.showCheckBox) && (this.isPopupOpen && target.classList.contains(CHIP_CLOSE) ||
                (this.isPopupOpen && (target.classList.contains(CHECKALLPARENT) || target.classList.contains(ALLTEXT)
                 || target.classList.contains(CHECKBOXFRAME)))))) {
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
            this.hideCheckAll(true);
        } else if (this.popupDiv.classList.contains(NODATA) && this.treeItems.length >= 1) {
            removeClass([this.popupDiv], NODATA);
            this.hideCheckAll(false);
        }
        this.treeDataType = this.getTreeDataType(this.treeItems, this.fields);
        if (this.isFirstRender && this.isRemoteData) {
            this.setTreeValue();
            this.setTreeText();
            this.updateHiddenValue();
            this.setSelectedValue();
            this.treeObj.element.focus();
        }
        let eventArgs: DdtDataBoundEventArgs = { data: args.data };
        this.trigger('dataBound', eventArgs);
        if (this.isFilteredData) { this.treeObj.expandAll(); }
        if (this.isFilterRestore) {
            this.restoreFilterSelection();
            this.isFilterRestore = false;
        }
    }

    private restoreFilterSelection(): void {
        if (this.showCheckBox) {
            this.treeObj.checkedNodes = this.value ? this.value : [];
        } else {
            this.treeObj.selectedNodes = this.value ? this.value : [];
        }
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
            if (this.inputWrapper && this.inputWrapper.classList.contains(INPUTFOCUS)) {
                removeClass([this.inputWrapper], [INPUTFOCUS]);
            }
            this.inputEle.setAttribute('aria-disabled', 'true');
            this.inputWrapper.setAttribute('aria-disabled', 'true');
        }
    }
    private cloneFields(fields: FieldsModel): FieldsModel {
        let clonedField: FieldsModel = {
            dataSource: fields.dataSource, value: fields.value, text: fields.text, parentValue: fields.parentValue,
            child: this.cloneChildField(fields.child), hasChildren: fields.hasChildren, expanded: fields.expanded,
            iconCss: fields.iconCss, imageUrl: fields.imageUrl, htmlAttributes: fields.htmlAttributes, query: fields.query,
            selected: fields.selected, tableName: fields.tableName, tooltip: fields.tooltip
        };
        return clonedField;
    }
    private cloneChildField(fields: FieldsModel | string): string | FieldsModel {
        if (typeof fields === 'string') {
            return fields;
        } else {
            let clonedField: FieldsModel = {
                dataSource: fields.dataSource, value: fields.value, text: fields.text, parentValue: fields.parentValue,
                child: (fields.child ? this.cloneChildField(fields.child) : null), hasChildren: fields.hasChildren,
                expanded: fields.expanded, iconCss: fields.iconCss, imageUrl: fields.imageUrl, htmlAttributes: fields.htmlAttributes,
                query: fields.query, selected: fields.selected, tableName: fields.tableName, tooltip: fields.tooltip
            };
            return clonedField;
        }
    }

    private getTreeFields(fields: FieldsModel): FieldsSettingsModel {
        let treeFields: FieldsSettingsModel = {
            dataSource: fields.dataSource, id: fields.value, text: fields.text, parentID: fields.parentValue,
            child: this.getTreeChildren(fields.child), hasChildren: fields.hasChildren, expanded: fields.expanded,
            iconCss: fields.iconCss, imageUrl: fields.imageUrl, isChecked: fields.selected,
            htmlAttributes: fields.htmlAttributes, query: fields.query, selected: fields.selected,
            tableName: fields.tableName, tooltip: fields.tooltip
        };
        return treeFields;
    }

    private getTreeChildren(mapper: FieldsModel | string): FieldsSettingsModel | string {
        if (typeof mapper === 'string') {
            return mapper;
        } else if (!isNOU(mapper)) {
            let childFields: FieldsSettingsModel | string;
            mapper = this.getActualProperties(mapper) as FieldsModel;
            childFields = mapper;
            if (mapper.value) {
                childFields.id = mapper.value;
            }
            if (mapper.parentValue) {
                childFields.parentID = mapper.parentValue;
            }
            if (mapper.child) {
                childFields.child = this.getTreeChildren(mapper.child);
            }
            if (mapper.selected && this.showCheckBox) {
                childFields.isChecked = mapper.selected;
            }
            return childFields;
        }
        return null;
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
        this.treeObj.fields = this.getTreeFields(this.fields);
        this.treeObj.dataBind();
    }
    private getEventArgs(args: NodeCheckEventArgs | NodeSelectEventArgs): DdtSelectEventArgs {
        let checkData: { [key: string]: Object }[] = (args as NodeCheckEventArgs).data;
        let selectData: { [key: string]: Object } = (args as NodeSelectEventArgs).nodeData;
        let state: string;
        if (this.showCheckBox) {
            if (args.action === 'check') {
                state = 'select';
            } else if (args.action === 'uncheck') {
                state = 'un-select';
            }
        }
        let eventArgs: DdtSelectEventArgs = {
            action: this.showCheckBox ? state : args.action,
            isInteracted: args.isInteracted,
            item: args.node,
            itemData: this.showCheckBox ? checkData[0] : selectData
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

    private updateHiddenValue(): void {
        if (this.allowMultiSelection || this.showCheckBox) {
            return;
        }
        if (this.value && this.value.length) {
            this.hiddenElement.innerHTML = '<option selected value ="' + this.value[0] + '">' + this.text + '</option>';
        } else {
            this.hiddenElement.innerHTML = '';
        }
    }

    /* Triggers when the tree node is selected */
    private onNodeSelected(args: NodeSelectEventArgs): void {
        if (this.showCheckBox) {
            return;
        }
        let selectedText: string;
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
                this.updateHiddenValue();
                this.showOverAllClear();
                this.hidePopup();
                this.isNodeSelected = true;
            } else if (this.allowMultiSelection) {
                this.setMultiSelect();
            }
        }
        let eventArgs: DdtSelectEventArgs = this.getEventArgs(args);
        this.trigger('select', eventArgs);
        if (this.isValueChange && !this.changeOnBlur) {
            this.triggerChangeEvent(this.keyEventArgs);
            this.isValueChange = false;
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
            this.ensurePlaceHolder();
        }
        if (!this.changeOnBlur && (this.allowMultiSelection || this.showCheckBox)) {
            this.triggerChangeEvent(args.event);
        }
    }

    private onNodeChecked(args: NodeCheckEventArgs): void {
        let eventArgs: DdtSelectEventArgs = this.getEventArgs(args);
        this.trigger('select', eventArgs);
        if (this.isFilteredData && args.action === 'uncheck') {
            let id: string = getValue('id', args.data[0]).toString();
            this.removeSelectedData(id , true);
        }
        if (!this.isChipDelete && args.isInteracted) {
            this.setMultiSelect();
            this.ensurePlaceHolder();
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
            if (!this.inputWrapper.contains(this.overAllClear)) {
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
        } else if (this.inputEle.classList.contains(CHIP_INPUT)) {
            removeClass([this.inputEle], CHIP_INPUT);
            if (this.chipWrapper) {
                addClass([this.chipWrapper], HIDEICON);
                removeClass([this.inputWrapper], SHOW_CHIP);
            }
        }
    }

    private ensurePlaceHolder(): void {
        if (this.value && this.value.length === 0) {
            removeClass([this.inputEle], CHIP_INPUT);
            if (this.chipWrapper) {
                addClass([this.chipWrapper], HIDEICON);
            }
        }
    }
    private ensureClearIconPosition(floatLabelType: FloatLabelType): void {
        if (floatLabelType !== 'Never') {
            this.inputWrapper.insertBefore(this.overAllClear, this.inputObj.buttons[0]);
        }
    }

    private setMultiSelectValue(newValues: string[]): void {
        if (!this.isFilteredData) {
            this.setProperties({ value: newValues }, true);
            if (newValues && newValues.length !== 0 && !this.showCheckBox) {
                this.treeObj.selectedNodes = this.value.slice();
                this.treeObj.dataBind();
            }
        } else {
            let selectedValues: string[] = isNOU(this.value) ? [] : this.value;
            for (let i: number = 0; i < newValues.length; i++) {
                if (isNOU(this.value) || this.value.indexOf(newValues[i]) === -1) {
                    selectedValues.push(newValues[i]);
                }
            }
            this.setProperties({ value: selectedValues }, true);
        }
    }

    private setMultiSelect(): void {
        if (this.showCheckBox && !this.isDynamicChange) {
            this.setMultiSelectValue(this.treeObj.checkedNodes);
        } else {
            let ddtValue: string[] = this.allowMultiSelection ? (this.showCheckBox ? this.treeObj.checkedNodes
                : this.treeObj.selectedNodes) : (this.value ? (this.showCheckBox ? this.value : [this.value[0]]) : null);
            this.setMultiSelectValue(ddtValue);
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

    private getSelectedData(value: string): { [key: string]: Object } {
        let data: { [key: string]: Object } = null;
        if (this.isFilteredData) {
            for (let i: number = 0; i < this.selectedData.length; i++) {
                if (getValue(this.treeSettings.loadOnDemand ? this.fields.value : 'id', this.selectedData[i]).toString() === value) {
                    data = this.selectedData[i];
                    break;
                }
            }
        }
        if (isNOU(data)) {
            if (this.treeSettings.loadOnDemand) {
                data = this.treeObj.getTreeData(value)[0];
            } else {
                data = this.treeObj.getNode(value);
            }
            if (!isNOU(data)) { this.selectedData.push(data); }
        }
        return data;
    }

    private removeSelectedData(value: string, muteOnChange: boolean): void {
        let selectedValues: string[] = isNOU(this.value) ? [] : this.value.slice();
        selectedValues.splice(selectedValues.indexOf(value), 1);
        this.setProperties({ value: selectedValues }, muteOnChange);
        for (let i: number = 0; i < this.selectedData.length; i++) {
            if (getValue(this.treeSettings.loadOnDemand ? this.fields.value : 'id', this.selectedData[i]).toString() === value) {
                this.selectedData.splice(i, 1);
                break;
            }
        }
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
        if (!this.isFilteredData) { this.selectedData = []; }
        if (!isNOU(this.value)) {
            for (let i: number = 0, len: number = this.value.length; i < len; i++) {
                selectedData = this.getSelectedData(this.value[i]);
                text = getValue(this.treeSettings.loadOnDemand ? this.fields.text : 'text', selectedData);
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
        }
        let isValid: boolean = this.getValidMode();
        if (this.mode !== 'Box' && (this.allowMultiSelection || this.showCheckBox) && !isValid) {
            if (this.chipWrapper) {
                addClass([this.chipWrapper], HIDEICON);
                removeClass([this.inputWrapper], SHOW_CHIP);
            }
        }
        Input.setValue(this.dataValue, this.inputEle, this.floatLabelType);
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
        if (this.isFirstRender) {return; }
        if (state && !this.popupEle.contains(this.checkAllParent) && this.showCheckBox) {
            this.createSelectAllWrapper();
            this.popupEle.insertBefore(this.checkAllParent, this.popupDiv);
        } else if (this.popupEle.contains(this.checkAllParent)) {
            detach(this.checkAllParent);
            this.checkAllParent = null;
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
        this.popupEle.insertBefore(this.header, this.checkAllParent ? this.checkAllParent : this.popupDiv);
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
        this.removeSelectedData(value, true);
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
        this.ensurePlaceHolder();
    }

    private resetValue(isDynamicChange?: boolean): void {
        Input.setValue(null, this.inputEle, this.floatLabelType);
        this.oldValue = this.value;
        this.dataValue = null;
        this.setProperties({ value: [] }, true);
        this.setProperties({ text: null }, true);
        this.selectedData = [];
        setValue('selectedNodes', [], this.treeObj);
        this.hiddenElement.innerHTML = '';
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
            this.ensurePlaceHolder();
        }
    }

    private clearCheckAll(): void {
        if (this.showSelectAll && this.value.length === 0) {
            this.setLocale(false);
        }
    }

    private selectAllItems(state: boolean): void {
        if (this.showCheckBox) {
            state ? this.treeObj.checkAll() : this.treeObj.uncheckAll();
            this.checkSelectAll = true;
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
            this.ensureAutoCheck();
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
        if (this.noRecord) {
            this.noRecord.innerHTML = '';
        } else {
            this.noRecord = this.createElement('div');
            addClass([this.noRecord], NODATACONTAINER);
            prepend([this.noRecord], this.popupDiv);
        }
        if (this.noRecordsTemplate !== 'No Records Found' || this.actionFailureTemplate !== 'The Request Failed') {
            let template: string = actionFailure ? this.actionFailureTemplate : this.noRecordsTemplate;
            let compiledString: Function;
            let templateId: string = actionFailure ? this.actionFailureTemplateId : this.noRecordsTemplateId;
            compiledString = this.templateComplier(template);
            for (let item of compiledString({}, null, null, templateId, this.isStringTemplate)) {
                this.noRecord.appendChild(item);
            }
            this.ddtupdateBlazorTemplates(!actionFailure, actionFailure);
        } else {
            let l10nLocale: Object = { noRecordsTemplate: 'No Records Found', actionFailureTemplate: 'The Request Failed'};
            this.l10n = new L10n(this.getModuleName(), l10nLocale, this.locale);
            this.noRecord.innerHTML = actionFailure ?
            this.l10n.getConstant('actionFailureTemplate') : this.l10n.getConstant('noRecordsTemplate');
        }
    }

    private ddtupdateBlazorTemplates(noRecord: boolean, action: boolean, header?: boolean, footer?: boolean, isEmpty?: boolean): void {
        if (!this.isStringTemplate) {
            if (this.noRecordsTemplate && noRecord) {
                updateBlazorTemplate(this.noRecordsTemplateId, NORECORDSTEMPLATE, this, isEmpty);
            }
            if (this.actionFailureTemplate && action) {
                updateBlazorTemplate(this.actionFailureTemplateId, ACTIONFAILURETEMPLATE, this, isEmpty);
            }
            if (header) {
                updateBlazorTemplate(this.headerTemplateId, HEADERTEMPLATE, this);
            }
            if (footer) {
                updateBlazorTemplate(this.footerTemplateId, FOOTERTEMPLATE, this);
            }
        }
    }

    private ddtresetBlazorTemplates( noRecord: boolean, action: boolean, header?: boolean, footer?: boolean): void {
        if (!this.isStringTemplate) {
            if (this.noRecordsTemplate && noRecord) {
                resetBlazorTemplate(this.noRecordsTemplateId, NORECORDSTEMPLATE);
            }
            if (this.actionFailureTemplate && action) {
                resetBlazorTemplate(this.actionFailureTemplateId, ACTIONFAILURETEMPLATE);
            }
            if (header) {
                resetBlazorTemplate(this.headerTemplateId, HEADERTEMPLATE);
            }
            if (footer) {
                resetBlazorTemplate(this.footerTemplateId, FOOTERTEMPLATE);
            }
        }
    }

    private updateRecordTemplate(action?: boolean): void {
        if (this.treeItems && this.treeItems.length <= 0) {
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

    private updateAllowFiltering(state: boolean): void {
        if (!this.isFirstRender) {
            if (state) {
                this.renderFilter();
            } else {
                this.destroyFilter();
            }
        }
        this.ensureAutoCheck();
    }

    private updateFilterPlaceHolder(): void {
        if (this.filterObj) {
            this.filterObj.placeholder = this.filterBarPlaceholder;
            this.filterObj.element.setAttribute('aria-label', this.filterBarPlaceholder);
        }
    }

    private updateValue(value: string[]): void {
        if (isNOU(value) || value.length === 0) {
            this.resetValue(true);
        } else {
            this.setTreeValue();
        }
        this.updateHiddenValue();
    }

    private updateText(text: string): void {
        if (isNOU(text)) {
            this.resetValue();
        } else {
            this.setTreeText();
        }
        this.updateHiddenValue();
    }

    private updateModelMode(): void {
        let validMode: boolean = this.allowMultiSelection ? true : (this.showCheckBox ? true : false);
        if (!validMode) { return; }
        this.updateMode();
        this.setMultiSelect();
    }

    /**
     * Dynamically change the value of properties.
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
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
                case 'allowFiltering':
                    this.updateAllowFiltering(newProp.allowFiltering);
                    break;
                case 'filterBarPlaceholder':
                    this.updateFilterPlaceHolder();
                    break;
                case 'value': this.updateValue(newProp.value); break;
                case 'text': this.updateText(newProp.text); break;
                case 'allowMultiSelection': this.updateMultiSelection(newProp.allowMultiSelection); break;
                case 'mode': this.updateModelMode(); break;
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
                        this.updatePopupHeight();
                    }
                    break;
                case 'showCheckBox':
                    this.updateCheckBoxState(newProp.showCheckBox);
                    this.updatePopupHeight();
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
                        this.popupObj.dataBind();
                    }
                    break;
                case 'headerTemplate': this.updateTemplate(); break;
                case 'footerTemplate': this.updateTemplate(); break;
                case 'itemTemplate':
                    this.treeObj.nodeTemplate = newProp.itemTemplate;
                    this.treeObj.dataBind();
                    break;
                case 'noRecordsTemplate': this.updateRecordTemplate(); break;
                case 'actionFailureTemplate':
                    this.updateRecordTemplate(true);
                    break;
                case 'htmlAttributes': this.setHTMLAttributes(); break;
            }
        }
    }

    /**
     * Allows you to clear the selected values from the Dropdown Tree component.
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
     * Removes the component from the DOM and detaches all its related event handlers. Also, it removes the attributes and classes.
     * @method destroy
     * @return {void}.
     */
    public destroy(): void {
        this.ddtresetBlazorTemplates( true, true, true, true);
        this.unWireEvents();
        this.setCssClass(null, this.cssClass);
        this.resetValue();
        this.treeObj.destroy();
        this.destroyFilter();
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

    private destroyFilter(): void {
        if (this.filterObj) {
            this.filterObj.destroy();
            detach(this.filterObj.element);
            detach(this.filterContainer);
            this.filterObj = null;
        }
    }

    /**
     * Ensures visibility of the Dropdown Tree item by using item value or item element.
     * If many Dropdown Tree items are present, and we are in need to find a particular item, then the `ensureVisible` property 
     * helps you to bring the item to visibility by expanding the Dropdown Tree and scrolling to the specific item.
     * @param  {string | Element} item - Specifies the value of Dropdown Tree item/ Dropdown Tree item element.
     */
    public ensureVisible(item: string | Element): void {
        this.treeObj.ensureVisible(item);
    }

    /**
     * To get the updated data of source of the Dropdown Tree.
     * @param  {string | Element} item - Specifies the value of Dropdown Tree item/ Dropdown Tree item element.
     * @returns { { [key: string]: Object }[] }.
     */
    public getData(item?: string | Element): { [key: string]: Object }[] {
        return this.treeObj.getTreeData(item);
    }

    /**
     * Close the Dropdown tree pop-up.
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
            if (this.inputFocus) {
                this.inputWrapper.focus();
            }
            this.trigger('close', eventArgs);
        }
    }

    /**
     * Based on the state parameter, entire list item will be selected or deselected.
     * parameter
     * `true`   - Selects entire Dropdown Tree items.
     * `false`  - Unselects entire Dropdown Tree items.
     * @returns void
     */
    public selectAll(state: boolean): void {
        this.selectAllItems(state);
    }

    /**
     * Opens the popup that displays the Dropdown Tree items.
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