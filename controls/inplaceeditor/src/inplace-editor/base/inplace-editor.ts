import { Component, INotifyPropertyChanged, NotifyPropertyChanges, Property, Event, EmitType, select } from '@syncfusion/ej2-base';
import { detach, addClass, removeClass, EventHandler, setStyleAttribute, Complex, ModuleDeclaration } from '@syncfusion/ej2-base';
import { isNullOrUndefined as isNOU, closest, extend, L10n, compile, Browser, Touch, TapEventArgs } from '@syncfusion/ej2-base';
import { updateBlazorTemplate, resetBlazorTemplate, SanitizeHtmlHelper, getValue, isBlazor } from '@syncfusion/ej2-base';
import { DataManager, UrlAdaptor, Query, WebApiAdaptor, ODataV4Adaptor, ReturnOption, Predicate } from '@syncfusion/ej2-data';
import { Button, ButtonModel } from '@syncfusion/ej2-buttons';
import { RichTextEditorModel } from '@syncfusion/ej2-richtexteditor';
import { DatePicker, DatePickerModel, DateTimePicker, DateRange, RangeEventArgs } from '@syncfusion/ej2-calendars';
import { DateTimePickerModel, DateRangePickerModel, TimePickerModel } from '@syncfusion/ej2-calendars';
import { createSpinner, hideSpinner, SpinnerArgs, showSpinner} from '@syncfusion/ej2-popups';
import { Tooltip, TooltipEventArgs, TipPointerPosition } from '@syncfusion/ej2-popups';
import { NumericTextBox, NumericTextBoxModel, TextBox, TextBoxModel, SliderChangeEventArgs, ValidArgs } from '@syncfusion/ej2-inputs';
import { ColorPickerModel, FormValidator, MaskedTextBox, MaskedTextBoxModel, SliderModel } from '@syncfusion/ej2-inputs';
import { ChangeEventArgs as InputChangeEventArgs, ColorPickerEventArgs } from '@syncfusion/ej2-inputs';
import { AutoCompleteModel, ComboBoxModel, DropDownList, DropDownListModel, MultiSelectModel } from '@syncfusion/ej2-dropdowns';
import { MultiSelectChangeEventArgs, ChangeEventArgs as DropDownsChangeEventArgs } from '@syncfusion/ej2-dropdowns';
/* Inject modules */
import { Rte } from '../modules/rte';
import { Slider } from '../modules/slider';
import { ComboBox } from '../modules/combo-box';
import { TimePicker } from '../modules/time-picker';
import { MultiSelect } from '../modules/multi-select';
import { ColorPicker } from '../modules/color-picker';
import { AutoComplete } from '../modules/auto-complete';
import { DateRangePicker } from '../modules/date-range-picker';
/* Helper modules */
import * as events from './events';
import * as classes from './classes';
/* Models */
import { PopupSettings, modulesList, localeConstant } from './models';
import { InPlaceEditorModel } from './inplace-editor-model';
import { PopupSettingsModel } from './models-model';
/* Interface */
import { ActionBeginEventArgs, ActionEventArgs, FormEventArgs, ValidateEventArgs, IButton, BeginEditEventArgs } from './interface';
import { ChangeEventArgs, EndEditEventArgs } from './interface';
/* Interface */
import { parseValue, getCompValue, encode } from './util';

/**
 * Provides information about a SanitizeSelectors.
 */
export interface SanitizeSelectors {
    /** Returns the tags. */
    tags?: string[]
    /** Returns the attributes. */
    attributes?: SanitizeRemoveAttrs[]
}

/**
 * Provides information about a BeforeSanitizeHtml event.
 */
export interface BeforeSanitizeHtmlArgs {
    /** Illustrates whether the current action needs to be prevented or not. */
    cancel?: boolean
    /** It is a callback function and executed it before our inbuilt action. It should return HTML as a string.
     *
     * @function
     * @param {string} value - Returns the value.
     * @returns {string} - returns the string value
     */
    helper?: Function
    /** Returns the selectors object which carrying both tags and attributes selectors to block list of cross-site scripting attack.
     *  Also possible to modify the block list in this event.
     */
    selectors?: SanitizeSelectors
}

/**
 * Provides information about a SanitizeRemoveAttributes.
 */
export interface SanitizeRemoveAttrs {
    /** Defines the attribute name to sanitize */
    attribute?: string
    /** Defines the selector that sanitize the specified attributes within the selector */
    selector?: string
}

/**
 * Specifies the mode to be render while editing.
 */
export type RenderMode = 'Inline' | 'Popup';
/**
 * Specifies the action to be perform when user clicks outside the container, that is focus out of editable content.
 */
export type ActionBlur = 'Cancel' | 'Submit' | 'Ignore';
/**
 * Specifies the event action of input to enter edit mode instead of using edit icon.
 */
export type EditableType = 'Click' | 'DblClick' | 'EditIconClick';
/**
 * Specifies the value to be set when initial rendering.
 */
export type textOptionType = 'Never' | 'Always';
/**
 * Specifies the adaptor type that are used DataManager to communicate with DataSource.
 */
export type AdaptorType = 'UrlAdaptor' | 'ODataV4Adaptor' | 'WebApiAdaptor';
/**
 * Specifies the type of components that integrated with In-place editor to make it as editable.
 */
export type InputType = 'AutoComplete' | 'Color' | 'ComboBox' | 'Date' | 'DateRange' | 'DateTime' | 'DropDownList' |
'Mask' | 'MultiSelect' | 'Numeric' | 'RTE' | 'Slider' | 'Text' | 'Time';
type ComponentTypes = DatePicker | DateTimePicker | DropDownList | MaskedTextBox | NumericTextBox | TextBox;
type DropDownTypes = AutoCompleteModel | ComboBoxModel | DropDownListModel | MultiSelectModel;

/**
 * ```html
 * * The In-place editor control is used to edit an element in a place and to update the value in server.
 * <div id='element' />
 * <script>
 *   var editorObj = new InPlaceEditor();
 *   editorObj.appendTo('#element');
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class InPlaceEditor extends Component<HTMLElement> implements INotifyPropertyChanged {
    private tipObj: Tooltip;
    private touchModule: Touch;
    private loader: HTMLElement;
    private editEle: HTMLElement;
    private spinObj: SpinnerArgs;
    private formEle: HTMLElement;
    private valueEle: HTMLElement;
    private titleEle: HTMLElement;
    private editIcon: HTMLElement;
    private valueWrap: HTMLElement;
    private templateEle: HTMLElement;
    private containerEle: HTMLElement;
    private initRender: boolean;
    private inlineWrapper: HTMLElement;
    private isTemplate: boolean;
    private isVue: boolean;
    private formValidate: FormValidator;
    private componentObj: ComponentTypes;
    private isExtModule: boolean;
    private submitBtn: Button;
    private cancelBtn: Button;
    private isClearTarget: boolean;
    private beginEditArgs: BeginEditEventArgs;
    private btnElements: HTMLElement;
    private dataManager: DataManager;
    private oldValue: string | number | Date | string[] | Date[] | number[];
    private componentRoot: HTMLElement | HTMLInputElement;
    private dataAdaptor: UrlAdaptor | ODataV4Adaptor | WebApiAdaptor;
    private prevValue: string | number | Date | string[] | Date[] | number[];
    private divComponents: string[];
    private clearComponents: string[];
    private dateType: string[];
    private inputDataEle: string[];
    private dropDownEle: string[];
    private compPrevValue: string | string[] | number | number[] | boolean[] | Date | Date[] | DateRange;
    private moduleList: string[];
    private afterOpenEvent: EmitType<TooltipEventArgs>;
    private onScrollResizeHandler: EventListenerOrEventListenerObject;

    /**
     * @hidden
     */
    public printValue: string;
    /**
     * @hidden
     */
    public needsID: boolean;
    /**
     * @hidden
     */
    public atcModule: AutoComplete;
    /**
     * @hidden
     */
    public colorModule: ColorPicker;
    /**
     * @hidden
     */
    public comboBoxModule: ComboBox;
    /**
     * @hidden
     */
    public dateRangeModule: DateRangePicker;
    /**
     * @hidden
     */
    public multiSelectModule: MultiSelect;
    /**
     * @hidden
     */
    public rteModule: Rte;
    /**
     * @hidden
     */
    public sliderModule: Slider;
    /**
     * @hidden
     */
    public timeModule: TimePicker;
    /**
     * Specifies the name of the field which is used to map data to the server.
     * If name is not given, then component ID is taken as mapping field name.
     *
     * {% codeBlock src='inplace-editor/name/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     */
    @Property('')
    public name: string;
    /**
     * Specifies the display value for input when original input value is empty.
     *
     * {% codeBlock src='inplace-editor/value/index.md' %}{% endcodeBlock %}
     *
     * @default null
     * @isGenericType true
     */
    @Property(null)
    public value: string | number | Date | string[] | Date[] | number[];
    /**
     * Specifies the HTML element ID as a string that can be added as a editable field.
     *
     * {% codeBlock src='inplace-editor/template/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     * @blazorType string
     * @aspType string
     */
    @Property('')
    public template: string | HTMLElement | Function;
    /**
     * Defines whether to allow the cross-scripting site or not.
     *
     * @default true
     */
    @Property(true)
    public enableHtmlSanitizer: boolean;
    /**
     * It enables or disables the parsing of HTML string content into HTML DOM elements for In-place Editor.
     * If the value of the property is set to false, the In-place Editor value will be displayed as HTML string instead of HTML DOM elements.
     *
     * @default true
     */
    @Property(true)
    public enableHtmlParse: boolean;
    /**
     * Defines single/multiple classes (separated by space) to be used for customization of In-place editor.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;
    /**
     * Defines the unique primary key of editable field which can be used for saving data in data-base.
     *
     * {% codeBlock src='inplace-editor/primary-key/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     */
    @Property('')
    public primaryKey: string | number;
    /**
     * Sets the text to be shown when an element has 'Empty' value.
     *
     * {% codeBlock src='inplace-editor/empty-text/index.md' %}{% endcodeBlock %}
     *
     * @default 'Empty'
     */
    @Property('Empty')
    public emptyText: string;
    /**
     * Gets the url for server submit action.
     *
     * {% codeBlock src='inplace-editor/url/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     */
    @Property('')
    public url: string;
    /**
     * Specifies the mode to be render while editing. The possible modes are :
     *
     * - `Inline`: Editable content is displayed as inline text and ok/cancel buttons are displayed at right bottom corner of input.
     * - `Popup`: Editable content and ok/cancel buttons are displayed inside popup while editing.
     *
     * {% codeBlock src='inplace-editor/mode/index.md' %}{% endcodeBlock %}
     *
     * @default 'Popup'
     */
    @Property('Popup')
    public mode: RenderMode;
    /**
     * Specifies the adaptor type that are used DataManager to communicate with DataSource. The possible values are,
     *
     * - `UrlAdaptor`: Base adaptor for interacting with remote data services.
     * - `ODataV4Adaptor`: Used to interact with ODataV4 service.
     * - `WebApiAdaptor`: Used to interact with Web api created with OData endpoint.
     *
     * {% codeBlock src='inplace-editor/adaptor/index.md' %}{% endcodeBlock %}
     *
     * @default 'UrlAdaptor'
     */
    @Property('UrlAdaptor')
    public adaptor: AdaptorType;
    /**
     * Specifies the type of components that integrated with In-place editor to make it as editable.
     *
     * {% codeBlock src='inplace-editor/type/index.md' %}{% endcodeBlock %}
     *
     * @default 'Text'
     */
    @Property('Text')
    public type: InputType;
    /**
     * Specifies the event action of input to enter edit mode instead of using edit icon. The possible values are:
     *
     * - `Click`: Do the single click action on input to enter into the edit mode.
     * - `DblClick`: Do the single double click action on input to enter into the edit mode.
     * - `EditIconClick`: Disables the editing of event action of input and allows user to edit only through edit icon.
     *
     * {% codeBlock src='inplace-editor/editable-on/index.md' %}{% endcodeBlock %}
     *
     * @default 'Click'
     */
    @Property('Click')
    public editableOn: EditableType;
    /**
     * Specifies the option to be set on initial rendering. It is applicable for DropDownList,
     * AutoComplete, ComboBox, and MultiSelect component types.
     * The possible options are:
     *
     * - `Never`: The corresponding field value will never be set initially in the component.
     * - `Always`: The corresponding field value will be set initially in the component.
     *
     * @default 'Never'
     */
    @Property('Never')
    public textOption: textOptionType;
    /**
     * Specifies the action to be perform when user clicks outside the container, that is focus out of editable content.
     * The possible options are,
     *
     * - `Cancel`: Cancel's the editing and resets the old content.
     * - `Submit`: Submit the edited content to the server.
     * - `Ignore`: No action is perform with this type and allows to have many containers open.
     *
     * @default 'Submit'
     */
    @Property('Submit')
    public actionOnBlur: ActionBlur;
    /**
     * Enable or disable persisting component's state between page reloads. If enabled, following list of states will be persisted.
     * 1. value
     *
     * {% codeBlock src='inplace-editor/enable-persistence/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;
    /**
     * Specifies whether to enable editing mode or not.
     *
     * @default false
     */
    @Property(false)
    public disabled: boolean;
    /**
     * Used to show/hide the ok/cancel buttons of In-place editor.
     *
     * {% codeBlock src='inplace-editor/show-buttons/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public showButtons: boolean;
    /**
     * Specifies to show/hide the editing mode.
     *
     * {% codeBlock src='inplace-editor/enable-edit-mode/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public enableEditMode: boolean;
    /**
     * Sets to trigger the submit action with enter key pressing of input.
     *
     * {% codeBlock src='inplace-editor/submit-on-enter/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public submitOnEnter: boolean;
    /**
     * Specifies the object to customize popup display settings like positions, animation etc.
     *
     * {% codeBlock src='inplace-editor/popup-settings/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    @Complex<PopupSettingsModel>({}, PopupSettings)
    public popupSettings: PopupSettingsModel;
    /* eslint-disable */
    /**
     * Specifies the model object configuration for the integrated components like AutoComplete, DatePicker,NumericTextBox, etc.
     *
     * {% codeBlock src='inplace-editor/model/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property(null)
    public model: AutoCompleteModel | ColorPickerModel | ComboBoxModel | DatePickerModel | DateRangePickerModel | DateTimePickerModel | DropDownListModel | MaskedTextBoxModel | MultiSelectModel | NumericTextBoxModel | RichTextEditorModel | SliderModel | TextBoxModel | TimePickerModel;
    /* eslint-enable */
    /**
     * Used to customize the "Save" button UI appearance by defining Button model configuration.
     *
     * {% codeBlock src='inplace-editor/save-button/index.md' %}{% endcodeBlock %}
     *
     * @default { iconCss: 'e-icons e-save-icon' }
     */
    @Property({ iconCss: 'e-icons e-save-icon' })
    public saveButton: ButtonModel;
    /**
     * Used to customize the "Cancel" button UI appearance by defining Button model configuration.
     *
     * {% codeBlock src='inplace-editor/cancel-button/index.md' %}{% endcodeBlock %}
     *
     * @default { iconCss: 'e-icons e-cancel-icon' }
     */
    @Property({ iconCss: 'e-icons e-cancel-icon' })
    public cancelButton: ButtonModel;
    /**
     * Maps the validation rules for the input.
     *
     * {% codeBlock src='inplace-editor/validation-rules/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property(null)
    public validationRules: { [name: string]: { [rule: string]: Object } };
    /* eslint-disable */
    /**
     * The event will be fired once the component rendering is completed.
     *
     * @event 'event'
     * @blazorProperty 'Created'
     */
    @Event()
    public created: EmitType<Event>;
    /**
     * Event triggers before sanitize the value.
     * @event 
     * @blazorProperty 'OnSanitizeHtml'
     */
    @Event()
    public beforeSanitizeHtml: EmitType<BeforeSanitizeHtmlArgs>;
    /**
     * The event will be fired before the data submitted to the server.
     *
     * @event 'event'
     * @blazorProperty 'OnActionBegin'
     */
    @Event()
    public actionBegin: EmitType<ActionBeginEventArgs>;
    /**
     * The event will be fired when data submitted successfully to the server.
     *
     * @event 'event'
     * @blazorProperty 'OnActionSuccess'
     */
    @Event()
    public actionSuccess: EmitType<ActionEventArgs>;
    /**
     * The event will be fired when data submission failed.
     *
     * @event 'event'
     * @blazorProperty 'OnActionFailure'
     */
    @Event()
    public actionFailure: EmitType<ActionEventArgs>;
    /**
     * The event will be fired while validating current value.
     *
     * @event 'event'
     * @blazorProperty 'Validating'
     */
    @Event()
    public validating: EmitType<ValidateEventArgs>;
    /**
     * The event will be fired before changing the mode from default to edit mode.
     *
     * @event 'event'
     */
    @Event()
    public beginEdit: EmitType<BeginEditEventArgs>;
    /**
     * The event will be fired when the edit action is finished and begin to submit/cancel the current value.
     *
     * @event 'event'
     */
    @Event()
    public endEdit: EmitType<EndEditEventArgs>;
    /**
     * The event will be fired when the integrated component value has changed that render based on the `type` property
     * in the In-place editor.
     *
     * @event 'event'
     * @blazorProperty 'ValueChange'
     */
    @Event()
    public change: EmitType<ChangeEventArgs>;
    /**
     * Event triggers when click the submit button.
     *
     * @event 'event'
     * @blazorProperty 'SubmitClick'
     */
    @Event()
    public submitClick: EmitType<MouseEvent>;
    /**
     * Event triggers when click the cancel button.
     *
     * @event 'event'
     * @blazorProperty 'CancelClick'
     */
    @Event()
    public cancelClick: EmitType<MouseEvent>;
    /**
     * The event will be fired when the component gets destroyed.
     *
     * @event 'event'
     * @blazorProperty 'Destroyed'
     */
    @Event()
    public destroyed: EmitType<Event>;
    
    
    
    private initializeValue(): void{
        
        this.initRender=true;
        this.isTemplate=false;
        this.isVue=false;
        this.isExtModule=false;
        this.submitBtn=undefined;
        this.cancelBtn=undefined;
        this.isClearTarget=false;
        this.btnElements=undefined;
        this.dataManager=undefined;
        this.oldValue=undefined;
        this.divComponents = ['RTE', 'Slider'];
        this.clearComponents= ['AutoComplete', 'Mask', 'Text'];
        this.dateType = ['Date', 'DateTime', 'Time'];
        this.inputDataEle=['Date', 'DateTime', 'DateRange', 'Time', 'Numeric'];
        this.dropDownEle = ['AutoComplete', 'ComboBox', 'DropDownList', 'MultiSelect'];
        this.moduleList = ['AutoComplete', 'Color', 'ComboBox', 'DateRange', 'MultiSelect', 'RTE', 'Slider', 'Time'];
    }
    /**
     * Initialize the event handler
     *
     * @returns {void}
     * @private
     */
    protected preRender(): void {
        this.initializeValue();
        this.onScrollResizeHandler = this.scrollResizeHandler.bind(this);
        if (isNOU(this.model)) {
            this.setProperties({ model: {} }, true);
        }
        this.titleEle = this.createElement('div', { className: classes.TITLE });
        if (!isNOU(this.popupSettings.model) && this.popupSettings.model.afterOpen) {
            this.afterOpenEvent = this.popupSettings.model.afterOpen;
        }
    }
    /**
     * To Initialize the In-place editor rendering
     *
     * @returns {void}
     * @private
     */
    protected render(): void {
        if (isNOU(this.element.getAttribute('tabindex'))) {
            this.element.setAttribute('tabindex', '0');
        }
        this.checkIsTemplate();
        this.disable(this.disabled);
        this.updateAdaptor();
        this.appendValueElement();
        this.updateValue();
        this.textOption === 'Never' ?
            this.renderValue(this.checkValue(parseValue(this.type, this.value, this.model)))
            : this.renderInitialValue();
        this.wireEvents();
        this.setRtl(this.enableRtl);
        this.enableEditor(this.enableEditMode, true);
        this.setClass('add', this.cssClass);
        this.renderComplete();
    }
   
    /**
     * Initializes a new instance of the In-place editor class.
     *
     * @param {InPlaceEditorModel} options  - Specifies In-place editor model properties as options.
     * @param {string} element  - Specifies the element for which In-place editor applies.
     */
    public constructor(options?: InPlaceEditorModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
        this.needsID = true;
    }
    private setClass(action: string, val: string): void {
        if (!this.isEmpty(val)) {
            const allClassName: string[] = val.split(' ');
            for (let i: number = 0; i < allClassName.length; i++) {
                if (allClassName[i].trim() !== '') {
                    action === 'add' ? addClass([this.element], [allClassName[i]]) : removeClass([this.element], [allClassName[i]]);
                }
            }
        }
    }
    private appendValueElement(): void {
        this.valueWrap = this.createElement('div', { id: this.element.id + '_wrap', className: classes.VALUE_WRAPPER });
        if (!isBlazor()) {
            this.element.innerHTML = '';
        }
        this.valueEle = this.createElement('span', { className: classes.VALUE });
        this.editIcon = this.createElement('span', {
            className: classes.OVERLAY_ICON + ' ' + classes.ICONS,
            attrs: { 'title': this.getLocale({ editIcon: 'Click to edit' }, 'editIcon') }
        });
        this.valueWrap.appendChild(this.valueEle);
        this.valueWrap.appendChild(this.editIcon);
        this.element.appendChild(this.valueWrap);
    }
    private renderInitialValue(): void {
        if (['AutoComplete', 'ComboBox', 'DropDownList', 'MultiSelect'].indexOf(this.type) > -1
            && !isNOU(this.value) && !this.isEmpty(this.value.toString()) && !isNOU((this.model as DropDownTypes).fields)
            && !isNOU((this.model as DropDownTypes).dataSource)) {
            this.renderValue(this.getLocale({ loadingText: 'Loading...' }, 'loadingText'));
            this.valueWrap.classList.add(classes.LOAD);
            createSpinner({ target: this.valueWrap, width: 10 });
            showSpinner(this.valueWrap);
            this.getInitFieldMapValue();
        } else {
            this.renderValue(this.checkValue(parseValue(this.type, this.value, this.model)));
        }
    }
    private getInitFieldMapValue(): void {
        const model: DropDownTypes = this.model as DropDownTypes;
        const mText: string = model.fields.text;
        const mVal: string = model.fields.value;
        const query: Query = isNOU(model.query) ? new Query() : model.query;
        if (model.dataSource instanceof DataManager) {
            (model.dataSource as DataManager).executeQuery(this.getInitQuery(model, query)).then((e: ReturnOption) => {
                this.updateInitValue(mText, mVal, e.result as { [key: string]: object }[]);
            });
        } else {
            this.updateInitValue(mText, mVal, new DataManager(model.dataSource).executeLocal(
                this.getInitQuery(model, query)) as { [key: string]: object }[]);
        }
    }
    private getInitQuery(model: DropDownTypes, query: Query): Query {
        let predicate: Predicate;
        const mVal: string = model.fields.value;
        const value: string[] | number[] = this.value as string[] | number[];
        if (this.type !== 'MultiSelect' || typeof(this.value) !== 'object') {
            predicate = new Predicate(mVal, 'equal', this.value as string);
        } else {
            let i: number = 0;
            for (const val of value) {
                predicate = ((i === 0) ? predicate = new Predicate(mVal, 'equal', val) : predicate.or(mVal, 'equal', val));
                i++;
            }
        }
        return query.where(predicate);
    }
    private updateInitValue(mText: string, mVal: string, result: { [key: string]: object }[]): void {
        if (result.length <= 0) {
            return;
        }
        if (result.length === 1) {
            this.valueEle.innerHTML = this.checkValue(getValue((isNOU(mText) ? mVal : mText), result[0]));
        } else {
            const val: string[] = [];
            for (const obj of result) {
                val.push(getValue((isNOU(mText) ? mVal : mText), obj) as string);
            }
            this.valueEle.innerHTML = this.checkValue(val.toString());
        }
        hideSpinner(this.valueWrap);
        this.valueWrap.classList.remove(classes.LOAD);
    }
    private renderValue(val: string): void {
        this.enableHtmlSanitizer && this.type !== 'RTE' && this.type !== 'MultiSelect' ? this.valueEle.innerText = val :
            (this.valueEle.innerHTML = this.enableHtmlParse ? val : encode(val));
        if (this.type === 'Color') {
            setStyleAttribute(this.valueEle, { 'color': val });
        }
        if (this.mode === 'Inline') {
            if (this.isEditorOpen()) {
                removeClass([this.valueWrap], [classes.HIDE]);
            }
        }
    }
    private isEditorOpen(): boolean {
        if (this.isVue && (this.enableEditMode || (!isNOU(this.valueWrap) &&
        !(this.valueWrap.classList.contains(classes.HIDE) || this.valueWrap.classList.contains('e-tooltip'))))) {
            return false;
        } else {
            return true;
        }
    }
    private renderEditor(): void {
        this.prevValue = this.value;
        this.beginEditArgs = { mode: this.mode, cancelFocus: false, cancel: false };
        this.trigger('beginEdit', this.beginEditArgs);
        if (this.beginEditArgs.cancel) {
            return;
        }
        let tipOptions: object = undefined;
        const target: HTMLElement = <HTMLElement>select('.' + classes.VALUE_WRAPPER, this.element);
        if (this.editableOn !== 'EditIconClick') {
            target.parentElement.removeAttribute('title');
        }
        if (this.valueWrap.classList.contains(classes.OPEN)) {
            return;
        }
        if (this.mode === 'Inline') {
            addClass([this.valueWrap], [classes.HIDE]);
            this.inlineWrapper = this.createElement('div', { className: classes.INLINE });
            this.element.appendChild(this.inlineWrapper);
            if (['AutoComplete', 'ComboBox', 'DropDownList', 'MultiSelect'].indexOf(this.type) > -1) {
                this.checkRemoteData(this.model as AutoCompleteModel | ComboBoxModel | DropDownListModel | MultiSelectModel);
            } else {
                this.renderAndOpen();
            }
        } else {
            if (!isNOU(this.popupSettings.model) && this.popupSettings.model.afterOpen) {
                this.popupSettings.model.afterOpen = this.afterOpenHandler.bind(this);
            }
            const content: HTMLElement = this.createElement('div', { className: classes.POPUP });
            if (!this.isEmpty(this.popupSettings.title)) {
                this.titleEle.innerHTML = this.popupSettings.title;
                content.appendChild(this.titleEle);
            }
            tipOptions = {
                content: content, opensOn: 'Custom',
                enableRtl: this.enableRtl, cssClass: classes.ROOT_TIP,
                afterOpen: this.afterOpenHandler.bind(this)
            };
            content.appendChild(this.renderControl(document.body));
            extend(tipOptions, this.popupSettings.model, tipOptions, true);
            this.tipObj = new Tooltip(tipOptions);
            this.tipObj.appendTo(target);
            this.tipObj.open(target);
        }
        if (this.actionOnBlur !== 'Ignore') {
            this.wireDocEvent();
        }
        addClass([this.valueWrap], [classes.OPEN]);
        this.setProperties({ enableEditMode: true }, true);
        if ((this as any).isReact) {
            this.renderReactTemplates();
        }
    }

    private renderAndOpen(): void {
        this.renderControl(this.inlineWrapper);
        this.afterOpenHandler(null);
    }

    private checkRemoteData(model: AutoCompleteModel | ComboBoxModel | DropDownListModel | MultiSelectModel): void {
        if (model.dataSource instanceof DataManager) {
            model.dataBound = () => {
                this.afterOpenHandler(null);
            };
            this.renderControl(this.inlineWrapper);
            if ((isNOU(model.value) && isNOU(this.value)) || (model.value === this.value
                && (!isNOU(model.value) && (model.value as string[] | number[]).length === 0))) {
                this.showDropDownPopup();
            }
        } else {
            this.renderAndOpen();
        }
    }

    private showDropDownPopup(): void {
        if (this.type === 'DropDownList') {
            if (!(this.model as AutoCompleteModel | ComboBoxModel | DropDownListModel
            | MultiSelectModel).allowFiltering) {
                (this.componentObj as DropDownList).focusIn();
            }
            (this.componentObj as DropDownList).showPopup();
        } else {
            if (this.isExtModule) {
                this.notify(((this.type === 'MultiSelect') ? events.setFocus : events.showPopup), {});
            }
        }
    }

    private setAttribute(ele: HTMLElement, attr: string[]): void {
        const value: string = this.name && this.name.length !== 0 ? this.name : this.element.id;
        attr.forEach((val: string) => {
            ele.setAttribute(val, ((val === 'id') ? (value + '_editor') : value));
        });
    }
    private renderControl(target: HTMLElement): HTMLElement {
        let ele: HTMLElement | HTMLInputElement;
        this.containerEle = this.createElement('div', { className: classes.WRAPPER });
        this.loader = this.createElement('div', { className: classes.LOADING });
        this.formEle = this.createElement('form', { className: classes.FORM }) as HTMLFormElement;
        const ctrlGroupEle: HTMLElement = this.createElement('div', { className: classes.CTRL_GROUP });
        const inputWrap: HTMLElement = this.createElement('div', { className: classes.INPUT });
        target.appendChild(this.containerEle);
        this.loadSpinner();
        this.containerEle.appendChild(this.formEle);
        this.formEle.appendChild(ctrlGroupEle);
        if (this.isTemplate) {
            this.appendTemplate(inputWrap, this.template);
        } else {
            if (Array.prototype.indexOf.call(this.divComponents, this.type) > -1) {
                ele = this.createElement('div') as HTMLElement;
                this.setAttribute(ele, ['id']);
            } else {
                ele = this.createElement('input') as HTMLInputElement;
                this.setAttribute(ele, ['id', 'name']);
            }
            this.componentRoot = ele;
            inputWrap.appendChild(ele);
            inputWrap.appendChild(this.loader);
        }
        ctrlGroupEle.appendChild(inputWrap);
        ctrlGroupEle.appendChild(this.createElement('div', { className: classes.EDITABLE_ERROR }));
        this.appendButtons(this.formEle);
        if (!this.isTemplate) {
            this.renderComponent(ele);
        }
        this.removeSpinner();
        if (this.submitOnEnter) {
            this.wireEditorKeyDownEvent(this.containerEle);
        }
        return this.containerEle;
    }
    private appendButtons(trg: HTMLElement): void {
        if (this.showButtons && trg) {
            this.btnElements = this.renderButtons();
            trg.appendChild(this.btnElements);
            this.wireBtnEvents();
        }
    }
    private renderButtons(): HTMLElement {
        const btnWrap: HTMLElement = this.createElement('div', { className: classes.BUTTONS });
        const primary: string = (!isNOU(this.saveButton.content) && this.saveButton.content.length !== 0) ? (' ' + classes.PRIMARY) : '';
        this.submitBtn = this.createButtons({
            constant: 'save', type: 'submit', container: btnWrap,
            title: { save: 'Save' }, model: this.saveButton,
            className: classes.BTN_SAVE + primary
        });
        this.cancelBtn = this.createButtons({
            type: 'button', constant: 'cancel', title: { cancel: 'Cancel' },
            container: btnWrap, model: this.cancelButton,
            className: classes.BTN_CANCEL
        });
        return btnWrap;
    }
    private createButtons(args: IButton): Button {
        let btnObj: Button = undefined;
        if (Object.keys(args.model).length > 0) {
            const btnEle: HTMLButtonElement = <HTMLButtonElement>this.createElement('button', {
                className: args.className,
                attrs: { 'type': args.type, 'title': (args.constant=="save")? (isNOU(this.saveButton.content)?this.getLocale(args.title, args.constant):this.saveButton.content): (isNOU(this.cancelButton.content)?this.getLocale(args.title, args.constant):this.cancelButton.content)}
            });
            args.container.appendChild(btnEle);
            btnObj = new Button(args.model, btnEle);
        }
        return btnObj;
    }
    private renderComponent(ele: HTMLElement | HTMLInputElement): void {
        this.isExtModule = (Array.prototype.indexOf.call(this.moduleList, this.type) > -1) ? true : false;
        let classProp: string;
        if (!isNOU(this.model.cssClass)) {
            classProp = this.model.cssClass.indexOf(classes.ELEMENTS) < 0 ?
                this.model.cssClass === '' ? classes.ELEMENTS : this.model.cssClass + ' ' + classes.ELEMENTS :
                this.model.cssClass;
        } else {
            classProp = classes.ELEMENTS;
        }
        extend(this.model, this.model, {
            cssClass: classProp, enableRtl: this.enableRtl, locale: this.locale, change: this.changeHandler.bind(this)
        });
        if (!isNOU(this.value)) {
            this.updateModelValue(false);
        }
        if (this.isExtModule) {
            this.notify(events.render, { module: modulesList[this.type], target: ele, type: this.type });
        } else {
            if (isNOU((this.model as DropDownListModel).showClearButton) && !isBlazor()) {
                (this.model as DropDownListModel).showClearButton = true;
            }
            switch (this.type) {
            case 'Date':
                this.componentObj = new DatePicker(this.model as DatePickerModel);
                break;
            case 'DateTime':
                this.componentObj = new DateTimePicker(this.model as DateTimePickerModel);
                break;
            case 'DropDownList':
                this.componentObj = new DropDownList(this.model as DropDownListModel);
                break;
            case 'Mask':
                this.componentObj = new MaskedTextBox(this.model as MaskedTextBoxModel);
                break;
            case 'Numeric':
                if (this.model.value) {
                    const expRegex = new RegExp('[eE][\-+]?([0-9]+)');
                    if (expRegex.test(this.model.value as string)) {
                        this.model.value =  this.model.value;
                    } else {
                        this.model.value = (this.model.value as string).toString().replace(/[`~!@#$%^&*()_|\=?;:'",<>\{\}\[\]\\\/]/gi, '');
                    }
                }
                this.componentObj = new NumericTextBox(this.model as NumericTextBoxModel);
                break;
            case 'Text':
                this.componentObj = new TextBox(this.model as TextBoxModel);
                break;
            }
            this.componentObj.appendTo(ele as HTMLInputElement);
        }
    }
    private updateAdaptor(): void {
        switch (this.adaptor) {
        case 'UrlAdaptor':
            this.dataAdaptor = new UrlAdaptor;
            break;
        case 'WebApiAdaptor':
            this.dataAdaptor = new WebApiAdaptor;
            break;
        case 'ODataV4Adaptor':
            this.dataAdaptor = new ODataV4Adaptor;
            break;
        }
    }
    private loadSpinner(callType?: string): void {
        addClass([this.loader], [classes.SHOW]);
        if (callType === 'validate' && (this.type === 'RTE' || this.type === 'Color' || this.type === 'Slider')) {
            addClass([this.loader], [classes.RTE_SPIN_WRAP]);
            addClass([this.getEditElement()], [classes.CTRL_OVERLAY]);
            this.spinObj = { target: this.loader };
        } else {
            this.spinObj = { target: this.loader, width: Browser.isDevice ? '16px' : '14px' };
        }
        if (this.formEle) {
            addClass([this.formEle], [classes.LOAD]);
        }
        if (this.btnElements) {
            addClass([this.btnElements], [classes.HIDE]);
        }
        setStyleAttribute(this.loader, { 'width': '100%' });
        createSpinner(this.spinObj);
        showSpinner(this.spinObj.target);
    }
    private removeSpinner(callType?: string): void {
        this.loader.removeAttribute('style');
        hideSpinner(this.spinObj.target);
        detach(this.spinObj.target.firstChild);
        if (callType === 'submit' && (this.type === 'RTE' || this.type === 'Color' || this.type === 'Slider')) {
            removeClass([this.loader], [classes.RTE_SPIN_WRAP]);
            removeClass([this.getEditElement()], [classes.CTRL_OVERLAY]);
        }
        if (this.formEle) {
            removeClass([this.formEle], [classes.LOAD]);
        }
        if (this.btnElements) {
            removeClass([this.btnElements], [classes.HIDE]);
        }
        removeClass([this.loader], [classes.SHOW]);
    }
    private getEditElement(): Element {
        return select('.' + classes.ELEMENTS, this.formEle);
    }
     private getLocale(prop: object, val: string): string {
        return new L10n('inplace-editor', prop, this.locale).getConstant(val);
    }
    private checkValue(val: string): string {
        return (!this.isEmpty(val)) ? val : this.emptyText;
    }
    public extendModelValue(val: string | number | boolean | Date | DateRange | string[] | Date[] | number[] | boolean[]): void {
         const model: object = this.model;
        extend(model, { value: val });
        this.setProperties({ model: model }, true);
    }
    private updateValue(): void {
        this.oldValue = this.value;
        if (this.enableHtmlSanitizer && typeof(this.value) === 'string') {
            this.oldValue = this.sanitizeHelper(this.value);
        }
        if (!isNOU(this.value)) {
            this.setProperties({ value: getCompValue(this.type, this.oldValue) }, true);
            this.extendModelValue(getCompValue(this.type, this.oldValue));
        }
    }
    private updateModelValue(updateOldValue: boolean): void {
        if (this.type === 'MultiSelect' && !this.isEmpty(this.value as string[])) {
            this.model.value = !updateOldValue ? (<string[]>this.value).slice() : (<string[]>this.oldValue).slice();
        } else {
            this.model.value = !updateOldValue ? this.value : this.oldValue;
        }
    }
    public setValue(): void {
        if (this.isExtModule) {
            this.notify(events.update, { type: this.type });
        } else if (this.componentObj) {
            if (this.type === 'Numeric' && this.componentObj.value === null) {
                this.componentObj.setProperties({ value: null }, true);
            }
            this.setProperties({ value: this.componentObj.value }, true);
            this.extendModelValue(this.componentObj.value);
        }
    }
    private getDropDownsValue(display: boolean): string {
        let value: string;
        if (Array.prototype.indexOf.call(this.dropDownEle, this.type) > -1 && this.type !== 'MultiSelect') {
            value = display ? (select('.e-' + this.type.toLocaleLowerCase(), this.containerEle) as HTMLInputElement).value :
                this.value.toString();
        } else if (this.type === 'MultiSelect') {
            this.notify(events.accessValue, { type: this.type });
            value = display ? this.printValue : (this.value as string[] | number[]).join();
        }
        return value;
    }

    private getSendValue(): string {
        if (this.isEmpty(this.value as string)) {
            return '';
        }
        if (Array.prototype.indexOf.call(this.dropDownEle, this.type) > -1) {
            return this.getDropDownsValue(false);
        } else if (Array.prototype.indexOf.call(this.dateType, this.type) > -1) {
            return (<Date>this.value).toISOString();
        } else if (this.type === 'DateRange') {
            return (<Date[]>this.value)[0].toISOString() + ' - ' + (<Date[]>this.value)[1].toISOString();
        } else {
            return this.value.toString();
        }
    }
    private getRenderValue(): string {
        if (this.type === 'Mask' && (<string>this.componentObj.value).length !== 0) {
            return (this.componentObj as MaskedTextBox).getMaskedValue();
        } else if (Array.prototype.indexOf.call(this.inputDataEle, this.type) > -1) {
            return (this.componentRoot as HTMLInputElement).value;
        } else if (Array.prototype.indexOf.call(this.dropDownEle, this.type) > -1) {
            return this.getDropDownsValue(true);
        } else {
            return parseValue(this.type, this.value, this.model);
        }
    }
    private setRtl(value: boolean): void {
        value ? addClass([this.element], [classes.RTL]) : removeClass([this.element], [classes.RTL]);
    }
    private setFocus(): void {
        if (this.isTemplate) {
            return;
        }
        this.isExtModule ? this.notify(events.setFocus, {}) : this.componentObj.element.focus();
    }
    private removeEditor(isBlazorDestroy?: boolean): void {
        const blazorContain: string[] = Object.keys(window) as string[];
        if (isBlazor() && !this.isStringTemplate) {
            resetBlazorTemplate(this.element.id + 'template', 'Template');
        }
        let tipEle: HTMLElement;
        if (this.tipObj && this.formEle) {
            tipEle = <HTMLElement>closest(this.formEle, '.' + classes.ROOT_TIP);
            tipEle.classList.add(classes.HIDE);
        }
        this.unWireDocEvent();
        this.destroyComponents();
        this.formEle = undefined;
        if (!isNOU(select('.' + classes.INLINE, this.element))) {
            detach(this.inlineWrapper);
            this.inlineWrapper = undefined;
        } else if (this.tipObj) {
            if (this.type === 'MultiSelect') {
                EventHandler.remove(this.containerEle, 'mousedown', this.popMouseDown);
                EventHandler.remove(this.containerEle, 'click', this.popClickHandler);
            }
            this.tipObj.close();
            this.tipObj.destroy();
            this.tipObj = undefined;
        }
        this.containerEle = undefined;
        removeClass([this.valueWrap], [classes.OPEN, classes.HIDE]);
        if (!isBlazorDestroy) {
            this.setProperties({ enableEditMode: false }, true);
        }
        if (this.editableOn !== 'EditIconClick') {
            const titleConstant: string = (this.editableOn === 'DblClick') ? 'editAreaDoubleClick' : 'editAreaClick';
            if (!isNOU(this.valueWrap.parentElement)) {
                this.valueWrap.parentElement.setAttribute('title', this.getLocale(localeConstant[this.editableOn], titleConstant));
            }
        }
        if ((this as any).isReact) {
            this.clearTemplate();
        }
    }
    private destroyComponents(): void {
        if (this.showButtons) {
            this.destroyButtons();
        }
        if (this.isExtModule) {
            this.notify(events.destroyModules, {});
        } else {
            if (this.templateEle) {
                document.body.appendChild(this.templateEle);
                this.templateEle.style.display = 'none';
                this.templateEle = undefined;
            }
            if (!isNOU(this.componentObj)) {
                this.componentObj.destroy();
                this.componentObj = undefined;
            }
        }
        if (this.formValidate) {
            this.formValidate = undefined;
        }
        if (this.submitOnEnter && this.containerEle) {
            this.unWireEditorKeyDownEvent(this.containerEle);
        }
    }
    private destroyButtons(): void {
        if (!isNOU(this.submitBtn)) {
            EventHandler.remove(this.submitBtn.element, 'mousedown', this.submitHandler);
            EventHandler.remove(this.submitBtn.element, 'click', this.submitPrevent);
            EventHandler.remove(this.submitBtn.element, 'keydown', this.btnKeyDownHandler);
            this.submitBtn.destroy();
            this.submitBtn = undefined;
        }
        if (!isNOU(this.cancelBtn)) {
            EventHandler.remove(this.cancelBtn.element, 'mouseup', this.cancelBtnClick);
            EventHandler.remove(this.cancelBtn.element, 'keydown', this.btnKeyDownHandler);
            this.cancelBtn.destroy();
            this.cancelBtn = undefined;
        }
        this.btnElements = undefined;
    }
    private getQuery(params: { [key: string]: string | number }): Query {
        const query: Query = new Query();
        Object.keys(params).forEach((key: string) => {
            query.addParams(key, params[key] as string);
        });
        return query;
    }
    private sendValue(): void {
        const eventArgs: ActionBeginEventArgs = { data: { name: this.name, primaryKey: this.primaryKey, value: this.getSendValue() } };
        this.trigger('actionBegin', eventArgs, (actionBeginArgs: ActionBeginEventArgs) => {
            if (actionBeginArgs.cancel) {
                this.removeSpinner('submit');
                if (this.mode === 'Popup') {
                    this.updateArrow();
                }
            } else {
                if (!this.isEmpty(this.url) && !this.isEmpty(this.primaryKey as string)
                    && (this.initRender || (!this.initRender && this.prevValue !== this.value))) {
                    this.dataManager = new DataManager({ url: this.url, adaptor: this.dataAdaptor });
                    if (this.adaptor === 'UrlAdaptor') {
                        this.dataManager.executeQuery(
                            this.getQuery(actionBeginArgs.data), this.successHandler.bind(this), this.failureHandler.bind(this)
                        );
                    } else {
                        const crud: Promise<Object> = this.dataManager.insert(actionBeginArgs.data) as Promise<Object>;
                        crud.then((e: ReturnOption) => this.successHandler(e)).catch((e: ReturnOption) => this.failureHandler(e));
                    }
                } else {
                    const eventArg: ActionEventArgs = { data: {}, value: actionBeginArgs.data.value as string };
                    this.triggerSuccess(eventArg);
                }
                this.dataManager = undefined;
            }
        });
    }
    private isEmpty(value: string | string[]): boolean {
        return (!isNOU(value) && value.length !== 0) ? false : true;
    }
    private checkIsTemplate(): void {
        this.isTemplate = (!isNOU(this.template) && this.template !== '') ? true : false;
    }
    private templateCompile(trgEle: HTMLElement, tempStr: string | Function): void {
        let tempEle: HTMLElement[];
        const blazorContain: string[] = Object.keys(window) as string[];
        if (typeof tempStr === 'string') {
            tempStr = tempStr.trim();
        }
        const compiler: Function = compile(tempStr);
        if (!isNOU(compiler)) {
            const isString: boolean = (isBlazor() && typeof tempStr !== 'function' &&
            !this.isStringTemplate && (tempStr).indexOf('<div>Blazor') === 0) ?
                this.isStringTemplate : true;
            tempEle = compiler({}, this, 'template', this.element.id + 'template', isString);
        }
        if (!isNOU(compiler) && tempEle.length > 0) {
            [].slice.call(tempEle).forEach((el: HTMLElement): void => {
                trgEle.appendChild(el);
            });
            if (isBlazor() && !this.isStringTemplate && typeof tempStr !== 'function' &&
                (tempStr).indexOf('<div>Blazor') === 0) {
                updateBlazorTemplate(this.element.id + 'template', 'Template', this);
            }
        }
    }
    /**
     * @param {string} value - specifies the string value
     * @returns {string} - returns the string
     * @hidden
     */
    public sanitizeHelper(value: string): string {
        if (this.enableHtmlSanitizer) {
            const item: BeforeSanitizeHtmlArgs = SanitizeHtmlHelper.beforeSanitize();
            const beforeEvent: BeforeSanitizeHtmlArgs = {
                cancel: false,
                helper: null
            };
            extend(item, item, beforeEvent);
            this.trigger('beforeSanitizeHtml', item, (args: BeforeSanitizeHtmlArgs) => {
                if (item.cancel && !isNOU(item.helper)) {
                    value = item.helper(value);
                } else if (!item.cancel) {
                    value = SanitizeHtmlHelper.serializeValue(item, value);
                }
            });
        }
        return value;
    }
    private appendTemplate(trgEle: HTMLElement, tempStr: string | HTMLElement | Function): void {
        tempStr = typeof(tempStr) === 'string' ? this.sanitizeHelper(tempStr) : tempStr;
        this.setProperties({ template: tempStr }, true);
        if (typeof tempStr === 'function') {
            this.templateCompile(trgEle, tempStr);
        } else if (typeof tempStr === 'string' || isNOU((<HTMLElement>tempStr).innerHTML)) {
            if ((<string>tempStr)[0] === '.' || (<string>tempStr)[0] === '#') {
                if (document.querySelectorAll(<string>tempStr).length) {
                    this.templateEle = document.querySelector(<string>tempStr);
                    trgEle.appendChild(this.templateEle);
                    this.templateEle.style.display = '';
                } else {
                    this.templateCompile(trgEle, <string>tempStr);
                }
            } else {
                this.templateCompile(trgEle, <string>tempStr);
            }
        } else {
            this.templateEle = tempStr;
            trgEle.appendChild(this.templateEle);
        }
    }

    private disable(value: boolean): void {
        value ? addClass([this.element], [classes.DISABLE]) : removeClass([this.element], [classes.DISABLE]);
    }
    private enableEditor(val: boolean, isInit?: boolean): void {
        if (isInit && !val) { return; }
        (val) ? this.renderEditor() : this.cancelHandler('cancel');
    }
    private checkValidation(fromSubmit : boolean , isValidate?: boolean): void {
        let args: ValidateEventArgs;
        if (this.validationRules) {
            const rules: string[] = Object.keys(this.validationRules);
            let validationLength : number =  Object.keys(this.validationRules[rules[0]]).length;
            validationLength = 'validateHidden' in this.validationRules[rules[0]] ? validationLength - 1 : validationLength;
            let count : number = 0;
            this.formValidate = new FormValidator(this.formEle as HTMLFormElement, {
                rules: this.validationRules,
                validationBegin: (e: ValidArgs) => {
                    if (this.type ==='RTE') {
                        let ele : HTMLElement =document.createElement('div');
                        ele.innerHTML = e.value;
                        e.value = ele.innerText;
                    }
                },
                validationComplete: (e: FormEventArgs) => {
                    count = count + 1;
                    args = {
                        errorMessage: e.message,
                        data: { name: this.name, primaryKey: this.primaryKey, value: this.checkValue(this.getSendValue()) }
                    };
                    this.trigger('validating', args, (validateArgs: ValidateEventArgs) => {
                        if (e.status === 'failure') {
                            e.errorElement.innerText = validateArgs.errorMessage;
                            this.toggleErrorClass(true);
                        } else {
                            this.toggleErrorClass(false);
                        }
                        if (!isNOU(fromSubmit) && fromSubmit && (validationLength === count || e.status === 'failure')) {
                            fromSubmit = false;
                            this.afterValidation(isValidate);
                            count = 0;
                        }
                    });
                },
                customPlacement: (inputElement: HTMLElement, errorElement: HTMLElement) => {
                    if (this.formEle) {
                        select('.' + classes.EDITABLE_ERROR, this.formEle).appendChild(errorElement);
                    }
                }
            });
            count = 0;
            this.formValidate.validate();
        } else if (this.template !== '') {
            args = {
                errorMessage: '',
                data: { name: this.name, primaryKey: this.primaryKey, value: this.checkValue(this.getSendValue()) }
            };
            this.trigger('validating', args, (validateArgs: ValidateEventArgs) => {
                if (validateArgs.errorMessage) {
                    select('.' + classes.EDITABLE_ERROR, this.formEle).innerHTML = validateArgs.errorMessage;
                    this.toggleErrorClass(true);
                } else {
                    this.toggleErrorClass(false);
                }
                this.afterValidation(isValidate);
            });
        } else {
            this.afterValidation(isValidate);
        }
    }
    private afterValidation(isValidate: boolean): void {
        if (!this.formEle.classList.contains(classes.ERROR) && isValidate) {
            this.loadSpinner('validate');
            if (this.mode === 'Popup') {
                this.updateArrow();
            }
            this.sendValue();
        }
    }
    private toggleErrorClass(value: boolean): void {
        if (isNOU(this.formEle)) {
            return;
        }
        const inputEle: HTMLElement = <HTMLElement>select('.e-input-group', this.formEle);
        const errorClass: Function = (element: HTMLElement[], val: string, action: string) => {
            [].slice.call(element).forEach((ele: HTMLElement) => {
                if (ele) {
                    action === 'add' ? addClass([ele], [val]) : removeClass([ele], [val]);
                }
            });
        };
        errorClass([this.formEle, inputEle], classes.ERROR, value ? 'add' : 'remove');
    }
    private updateArrow(): void {
        const pos: TipPointerPosition = this.tipObj.tipPointerPosition;
        this.tipObj.tipPointerPosition = (pos === 'Middle') ? 'Auto' : 'Middle';
        this.tipObj.tipPointerPosition = pos;
        this.tipObj.dataBind();
    }
    private triggerSuccess(args: ActionEventArgs): void {
        const val: string = args.value;
        this.trigger('actionSuccess', args, (actionArgs: ActionEventArgs) => {
            this.oldValue = val;
            this.removeSpinner('submit');
            if (!actionArgs.cancel) {
                this.renderValue(this.checkValue((actionArgs.value !== val) ? actionArgs.value : this.getRenderValue()));
            }
            if (actionArgs.cancel && this.mode === 'Inline') {
                removeClass([this.valueWrap], [classes.HIDE]);
            }
            this.removeEditor();
        });
    }
    private triggerEndEdit(closeBeginBy: string): void {
        const endEditArgs = { cancel: false, mode: this.mode, action: closeBeginBy };
        this.trigger('endEdit', endEditArgs, (args: EndEditEventArgs) => {
            if (!args.cancel) {
                if (this.formEle && this.formEle.classList.contains(classes.ERROR)) {
                    this.updateModelValue(true);
                    this.setProperties({ value: this.oldValue }, true);
                }
                this.removeEditor();
            }
        });
    }
    private wireEvents(): void {
        this.wireEditEvent(this.editableOn);
        EventHandler.add(this.editIcon, 'click', this.clickHandler, this);
        EventHandler.add(this.element, 'keydown', this.valueKeyDownHandler, this);
        document.addEventListener('scroll', this.onScrollResizeHandler);
        window.addEventListener('resize', this.onScrollResizeHandler);
        if (Array.prototype.indexOf.call(this.clearComponents, this.type) > -1) {
            EventHandler.add(this.element, 'mousedown', this.mouseDownHandler, this);
        }
    }
    private wireDocEvent(): void {
        EventHandler.add(document, 'mousedown', this.docClickHandler, this);
    }
    private wireEditEvent(event: string): void {
        if (event === 'EditIconClick') {
            return;
        }
        const titleConstant: string = (event === 'Click') ? 'editAreaClick' : 'editAreaDoubleClick';
        this.element.setAttribute('title', this.getLocale(localeConstant[event], titleConstant));
        if (Browser.isDevice && Browser.isIos && event === 'DblClick') {
            this.touchModule = new Touch(this.valueWrap, { tap: this.doubleTapHandler.bind(this) });
        } else {
            EventHandler.add(this.valueWrap, event.toLowerCase(), this.clickHandler, this);
        }
    }
    private wireEditorKeyDownEvent(ele: HTMLElement): void {
        EventHandler.add(ele, 'keydown', this.enterKeyDownHandler, this);
    }
    private wireBtnEvents(): void {
        if (!isNOU(this.submitBtn)) {
            EventHandler.add(this.submitBtn.element, 'mousedown', this.submitHandler, this);
            EventHandler.add(this.submitBtn.element, 'click', this.submitPrevent, this);
            EventHandler.add(this.submitBtn.element, 'keydown', this.btnKeyDownHandler, this);
        }
        if (!isNOU(this.cancelBtn)) {
            EventHandler.add(this.cancelBtn.element, 'mouseup', this.cancelBtnClick, this);
            EventHandler.add(this.cancelBtn.element, 'keydown', this.btnKeyDownHandler, this);
        }
    }
    private cancelBtnClick(e: MouseEvent) : void {
        this.cancelHandler('cancel');
        this.trigger('cancelClick' , e);
    }
    private unWireEvents(): void {
        this.unWireEditEvent(this.editableOn);
        EventHandler.remove(this.editIcon, 'click', this.clickHandler);
        document.removeEventListener('scroll', this.onScrollResizeHandler);
        window.removeEventListener('resize', this.onScrollResizeHandler);
        EventHandler.remove(this.element, 'keydown', this.valueKeyDownHandler);
        if (Array.prototype.indexOf.call(this.clearComponents, this.type) > -1) {
            EventHandler.remove(this.element, 'mousedown', this.mouseDownHandler);
        }
    }
    private unWireDocEvent(): void {
        EventHandler.remove(document, 'mousedown', this.docClickHandler);
    }
    private unWireEditEvent(event: string): void {
        if (event === 'EditIconClick') {
            return;
        }
        this.element.removeAttribute('title');
        if (Browser.isDevice && Browser.isIos && event === 'DblClick') {
            this.touchModule.destroy();
            this.touchModule = undefined;
        } else {
            EventHandler.remove(this.valueWrap, event.toLowerCase(), this.clickHandler);
        }
    }
    private unWireEditorKeyDownEvent(ele: HTMLElement): void {
        EventHandler.remove(ele, 'keydown', this.enterKeyDownHandler);
    }
    private submitPrevent(e: Event): void {
        e.preventDefault();
    }
    private btnKeyDownHandler(e: KeyboardEvent): void {
        const trg: HTMLElement = <HTMLElement>e.target;
        if ((e.keyCode === 13 && e.which === 13) || (e.keyCode === 32 && e.which === 32)) {
            if (trg.classList.contains(classes.BTN_SAVE)) {
                this.save();
            } else if (trg.classList.contains(classes.BTN_CANCEL)) {
                this.cancelHandler('cancel');
            }
        }
        if (e.keyCode === 9 && e.shiftKey === false &&
        (isNOU((e.target as HTMLElement).nextElementSibling) ||
        (e.target as HTMLElement).nextElementSibling.tagName !== 'BUTTON')) {
            if (this.actionOnBlur === 'Submit') {
                this.save();
            } else if (this.actionOnBlur === 'Cancel') {
                this.cancelHandler('cancel');
            }
        }
    }
    private afterOpenHandler(e: TooltipEventArgs): void {
        if (this.mode === 'Popup' && this.type === 'MultiSelect') {
            EventHandler.add(this.containerEle, 'mousedown', this.popMouseDown, this);
            EventHandler.add(this.containerEle, 'click', this.popClickHandler, this);
        }
        if (this.mode === 'Popup' && !this.isEmpty(this.titleEle.innerHTML)) {
            e.element.classList.add(classes.TIP_TITLE);
        }
        if (this.type === 'RTE') {
            this.rteModule.refresh();
            this.setAttribute(<HTMLElement>select('.e-richtexteditor textarea', this.containerEle), ['name']);
        } else if (this.type === 'Slider') {
            this.sliderModule.refresh();
            this.setAttribute(<HTMLElement>select('.e-slider-input', this.containerEle), ['name']);
        }
        if (!this.beginEditArgs.cancelFocus) {
            if (this.mode === 'Inline' && (['AutoComplete', 'ComboBox', 'DropDownList', 'MultiSelect'].indexOf(this.type) > -1)
                && (this.model as AutoCompleteModel | ComboBoxModel | DropDownListModel
                | MultiSelectModel).dataSource instanceof DataManager) {
                this.showDropDownPopup();
            } else {
                this.setFocus();
            }
        }
        if (this.afterOpenEvent) {
            this.tipObj.setProperties({ afterOpen: this.afterOpenEvent }, true);
            this.tipObj.trigger('afterOpen', e);
        }
    }
    private popMouseDown(e: MouseEvent): void {
        const trgClass: DOMTokenList = (<Element>e.target).classList;
        if (trgClass.contains('e-chips-close') && !trgClass.contains('e-close-hooker')) {
            this.updateArrow();
        }
    }
    private doubleTapHandler(e: TapEventArgs): void {
        if (e.tapCount > 1) {
            this.clickHandler(e.originalEvent);
        }
    }
    private clickHandler(e: MouseEvent): void {
        if (this.editableOn !== 'EditIconClick') {
            e.stopPropagation();
        }
        this.renderEditor();
    }
    private submitHandler(e: MouseEvent): void {
        e.preventDefault();
        this.save();
        this.trigger('submitClick', e);
    }
    private cancelHandler(action: string): void {
        this.triggerEndEdit(action);
    }
    private popClickHandler(e: MouseEvent): void {
        const tipTarget: HTMLElement = <HTMLElement>select('.' + classes.VALUE_WRAPPER, this.element);
        if ((<Element>e.target).classList.contains('e-chips-close')) {
            this.tipObj.refresh(tipTarget);
        }
    }
    private successHandler(e: Object): void {
        this.initRender = false;
        const eventArgs: ActionEventArgs = { data: e, value: this.getSendValue() };
        this.triggerSuccess(eventArgs);
    }
    private failureHandler(e: Object): void {
        const eventArgs: ActionEventArgs = { data: e, value: this.getSendValue() };
        this.trigger('actionFailure', eventArgs, (args: ActionEventArgs) => {
            this.removeSpinner('submit');
            if (this.mode === 'Popup') {
                this.updateArrow();
            }
        });
    }
    private enterKeyDownHandler(e: KeyboardEvent): void {
        if (!closest(e.target as Element, '.' + classes.INPUT + ' .e-richtexteditor') && (!(e.currentTarget as Element).getElementsByTagName("textarea")[0])) {
            if ((e.keyCode === 13 && e.which === 13) && closest(e.target as Element, '.' + classes.INPUT)) {
                this.save();
                this.trigger('submitClick', e);
            } else if (e.keyCode === 27 && e.which === 27) {
                this.cancelHandler('cancel');
            }
        }
    }
    private valueKeyDownHandler(e: KeyboardEvent): void {
        if (e.keyCode === 9 && e.shiftKey === true && (e.target as HTMLElement).tagName !== 'BUTTON') {
            if (this.actionOnBlur === 'Submit') {
                this.save();
            } else if (this.actionOnBlur === 'Cancel') {
                this.cancelHandler('cancel');
            }
        }
        if ((e.keyCode === 13 && e.which === 13) && (e.target as Element).classList.contains(classes.ROOT) &&
            !this.valueWrap.classList.contains(classes.OPEN) && !this.element.classList.contains(classes.DISABLE)) {
            e.preventDefault();
            this.renderEditor();
        }
    }
    private mouseDownHandler(e: Event): void {
        if ((<Element>e.target).classList.contains('e-clear-icon')) {
            this.isClearTarget = true;
        }
    }
    private scrollResizeHandler(): void {
        if (this.mode === 'Popup' && this.tipObj && !(Browser.isDevice)) {
            this.triggerEndEdit('cancel');
        }
    }
    private docClickHandler(e: Event): void {
        const trg: Element = <Element>e.target;
        if (this.isClearTarget) {
            this.isClearTarget = false;
            return;
        }
        const relateRoot: Element = closest(trg, '.' + classes.ROOT);
        const relateTipRoot: Element = closest(trg, '.' + classes.ROOT_TIP);
        const relateElements: Element = closest(trg, '.' + classes.ELEMENTS);
        const relateRTEElements: Element = closest(trg, '.e-rte-elements');
        if ((!isNOU(relateRoot) && relateRoot.isEqualNode(this.element)) ||
            (!isNOU(relateTipRoot) && this.tipObj && (relateTipRoot.id.indexOf(this.valueWrap.id) > -1)) ||
            !isNOU(relateElements) || !isNOU(relateRTEElements) || trg.classList.contains('e-chips-close')) {
            return;
        } else {
            if (this.actionOnBlur === 'Submit') {
                this.save();
            } else if (this.actionOnBlur === 'Cancel') {
                this.cancelHandler('cancel');
            }
        }
    }
    private changeHandler(e: InputChangeEventArgs | ColorPickerEventArgs | MultiSelectChangeEventArgs | SliderChangeEventArgs |
    RangeEventArgs | DropDownsChangeEventArgs): void {
        const eventArgs: ChangeEventArgs = {
            previousValue: this.compPrevValue === undefined ? this.value : this.compPrevValue,
            value: (e as InputChangeEventArgs).value
        };
        if (this.type === 'AutoComplete' || this.type === 'ComboBox' || this.type === 'DropDownList') {
            eventArgs.itemData = (e as DropDownsChangeEventArgs).itemData;
            eventArgs.previousItemData = (e as DropDownsChangeEventArgs).previousItemData;
        }
        this.compPrevValue = eventArgs.value;
        this.trigger('change', eventArgs);
    }
    /**
     * Validate current editor value.
     *
     * @returns {void}
     */
    public validate(): void {
        this.checkValidation(true, false);
    }
    /**
     * Submit the edited input value to the server.
     *
     * @returns {void}
     */
    public save(): void {
        if (!this.formEle) {
            return;
        }
        this.element.focus();
        this.editEle = <HTMLElement>select('.' + classes.INPUT, this.formEle);
        let errEle: HTMLElement = null;
        errEle = <HTMLElement>select('.' + classes.ERROR, this.editEle);
        if (!this.isTemplate) {
            this.setValue();
        }
        const endEditArgs = { cancel: false, mode: this.mode, action: 'submit' };
        this.trigger('endEdit', endEditArgs, (args: EndEditEventArgs) => {
            if (!args.cancel) { this.checkValidation(true, true); }
        });
    }
    /**
     * Removes the control from the DOM and also removes all its related events.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.removeEditor(isBlazor());
        if (this.isExtModule) {
            this.notify(events.destroy, {});
        }
        this.unWireEvents();
        const classList: string[] = [classes.DISABLE, classes.RTL];
        classList.forEach((val: string): void => {
            removeClass([this.element], [val]);
        });
        while (this.element.firstElementChild) {
            this.element.removeChild(this.element.firstElementChild);
        }
        if (!(isBlazor() && this.isServerRendered)) {
            super.destroy();
        }
        if ((this as any).isReact) {
            this.clearTemplate();
        }
    }
    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string} - returns the string
     */

    protected getPersistData(): string {
        return this.addOnPersist(['value']);
    }
    /**
     * To provide the array of modules needed for component rendering
     *
     * @returns {ModuleDeclaration[]} - returns the module declaration
     * @hidden
     */
    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        modules.push({ member: modulesList[this.type], args: [this] });
        return modules;
    }
    /**
     * Returns the current module name.
     *
     * @returns {string} - returrns the string
     * @private
     */
    protected getModuleName(): string {
        return 'inplaceeditor';
    }
    /**
     * Gets called when the model property changes.The data that describes the old and new values of property that changed.
     *
     * @param  {InPlaceEditorModel} newProp - specifies the new property
     * @param  {InPlaceEditorModel} oldProp - specifies the old property
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: InPlaceEditorModel, oldProp: InPlaceEditorModel): void {
        let checkValidation: boolean = this.validationRules ? !isNOU(this.element.querySelectorAll('.' + classes.ERROR)) &&
            this.element.querySelectorAll('.' + classes.ERROR).length > 0 ? false : true : true;
        if (checkValidation) {
            if (this.isEditorOpen()) {
                const editModeChanged: boolean = 'enableEditMode' in newProp;
                if ((editModeChanged && oldProp.enableEditMode && !newProp.enableEditMode) || (!editModeChanged && this.enableEditMode)) {
                    this.triggerEndEdit('cancel');
                } else { this.removeEditor(); }
            }
            for (const prop of Object.keys(newProp)) {
                switch (prop) {
                case 'showButtons':
                    (newProp.showButtons) ? this.appendButtons(this.formEle) : this.destroyButtons();
                    break;
                case 'value':
                    this.updateValue();
                    this.textOption === 'Never' ? this.renderValue(this.checkValue(parseValue(this.type, this.value, this.model)))
                    : this.renderInitialValue();
                    break;
                case 'emptyText':
                    this.textOption === 'Never' ? this.renderValue(this.checkValue(parseValue(this.type, this.value, this.model)))
                    : this.renderInitialValue();
                    break;
                case 'template':
                    this.checkIsTemplate();
                    break;
                case 'disabled':
                    this.disable(newProp.disabled);
                    break;
                case 'enableRtl':
                    this.setRtl(newProp.enableRtl);
                    break;
                case 'cssClass':
                    this.setClass('remove', oldProp.cssClass);
                    this.setClass('add', newProp.cssClass);
                    break;
                case 'mode':
                    this.enableEditor(this.enableEditMode);
                    break;
                case 'enableEditMode':
                    this.enableEditor(newProp.enableEditMode);
                    break;
                case 'editableOn':
                    this.unWireEditEvent(oldProp.editableOn);
                    if (newProp.editableOn !== 'EditIconClick') { this.wireEditEvent(newProp.editableOn); }
                    break;
                }
            }
        }
    }
}
