import { Component, INotifyPropertyChanged, NotifyPropertyChanges, Property, Event, EmitType, select } from '@syncfusion/ej2-base';import { detach, addClass, removeClass, EventHandler, setStyleAttribute, Complex, ModuleDeclaration } from '@syncfusion/ej2-base';import { isNullOrUndefined as isNOU, closest, extend, L10n, compile, Browser, Touch, TapEventArgs } from '@syncfusion/ej2-base';import { updateBlazorTemplate, resetBlazorTemplate, SanitizeHtmlHelper, getValue, isBlazor } from '@syncfusion/ej2-base';import { DataManager, UrlAdaptor, Query, WebApiAdaptor, ODataV4Adaptor, ReturnOption, Predicate } from '@syncfusion/ej2-data';import { Button, ButtonModel } from '@syncfusion/ej2-buttons';import { RichTextEditorModel } from '@syncfusion/ej2-richtexteditor';import { DatePicker, DatePickerModel, DateTimePicker, DateRange, RangeEventArgs } from '@syncfusion/ej2-calendars';import { DateTimePickerModel, DateRangePickerModel, TimePickerModel } from '@syncfusion/ej2-calendars';import { createSpinner, hideSpinner, SpinnerArgs, showSpinner } from '@syncfusion/ej2-popups';import { Tooltip, TooltipEventArgs, TipPointerPosition } from '@syncfusion/ej2-popups';import { NumericTextBox, NumericTextBoxModel, TextBox, TextBoxModel, SliderChangeEventArgs } from '@syncfusion/ej2-inputs';import { ColorPickerModel, FormValidator, MaskedTextBox, MaskedTextBoxModel, SliderModel } from '@syncfusion/ej2-inputs';import { ChangeEventArgs as InputChangeEventArgs, ColorPickerEventArgs } from '@syncfusion/ej2-inputs';import { AutoCompleteModel, ComboBoxModel, DropDownList, DropDownListModel, MultiSelectModel } from '@syncfusion/ej2-dropdowns';import { MultiSelectChangeEventArgs, ChangeEventArgs as DropDownsChangeEventArgs } from '@syncfusion/ej2-dropdowns';import { Rte } from '../modules/rte';import { Slider } from '../modules/slider';import { ComboBox } from '../modules/combo-box';import { TimePicker } from '../modules/time-picker';import { MultiSelect } from '../modules/multi-select';import { ColorPicker } from '../modules/color-picker';import { AutoComplete } from '../modules/auto-complete';import { DateRangePicker } from '../modules/date-range-picker';import * as events from './events';import * as classes from './classes';import { PopupSettings, modulesList, localeConstant } from './models';import { PopupSettingsModel } from './models-model';import { ActionBeginEventArgs, ActionEventArgs, FormEventArgs, ValidateEventArgs, IButton, BeginEditEventArgs } from './interface';import { ChangeEventArgs } from './interface';import { parseValue, getCompValue } from './util';
import {RenderMode,AdaptorType,InputType,EditableType,textOptionType,ActionBlur,BeforeSanitizeHtmlArgs} from "./inplace-editor";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class InPlaceEditor
 */
export interface InPlaceEditorModel extends ComponentModel{

    /**
     * * Specifies the name of the field which is used to map data to the server. 
     * If name is not given, then component ID is taken as mapping field name.
     * 
     * {% codeBlock src='inplace-editor/name/index.md' %}{% endcodeBlock %}
     * 
     * @default ''
     */
    name?: string;

    /**
     * Specifies the display value for input when original input value is empty.
     * 
     * {% codeBlock src='inplace-editor/value/index.md' %}{% endcodeBlock %}
     * 
     * @default null
     * @isGenericType true
     */
    value?: string | number | Date | string[] | Date[] | number[];

    /**
     * Specifies the HTML element ID as a string that can be added as a editable field.
     * 
     * {% codeBlock src='inplace-editor/template/index.md' %}{% endcodeBlock %}
     * 
     * @default ''
     * @blazorType string
     */
    template?: string | HTMLElement;

    /**
     * Defines whether to allow the cross-scripting site or not.
     * @default true
     */
    enableHtmlSanitizer?: boolean;

    /**
     * Defines single/multiple classes (separated by space) to be used for customization of In-place editor.
     * @default ''
     */
    cssClass?: string;

    /**
     * Defines the unique primary key of editable field which can be used for saving data in data-base.
     * 
     * {% codeBlock src='inplace-editor/primary-key/index.md' %}{% endcodeBlock %}
     * 
     * @default ''
     */
    primaryKey?: string | number;

    /**
     * Sets the text to be shown when an element has 'Empty' value.
     * 
     * {% codeBlock src='inplace-editor/empty-text/index.md' %}{% endcodeBlock %}
     * 
     * @default 'Empty'
     */
    emptyText?: string;

    /**
     * Gets the url for server submit action.
     * 
     * {% codeBlock src='inplace-editor/url/index.md' %}{% endcodeBlock %}
     * 
     * @default ''
     */
    url?: string;

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
    mode?: RenderMode;

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
    adaptor?: AdaptorType;

    /**
     * Specifies the type of components that integrated with In-place editor to make it as editable.
     * 
     * {% codeBlock src='inplace-editor/type/index.md' %}{% endcodeBlock %}
     * 
     * @default 'Text'
     */
    type?: InputType;

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
    editableOn?: EditableType;

    /**
     * Specifies the option to be set on initial rendering. It is applicable for DropDownList,
     * AutoComplete, ComboBox, and MultiSelect component types.
     * The possible options are:
     * 
     * - `Never`: The corresponding field value will never be set initially in the component.
     * - `Always`: The corresponding field value will be set initially in the component.
     * @default 'Never'
     */
    textOption?: textOptionType;

    /**
     * Specifies the action to be perform when user clicks outside the container, that is focus out of editable content.
     * The possible options are,
     * 
     * - `Cancel`: Cancel's the editing and resets the old content.
     * - `Submit`: Submit the edited content to the server.
     * - `Ignore`: No action is perform with this type and allows to have many containers open.
     * @default 'Submit'
     */
    actionOnBlur?: ActionBlur;

    /**
     * Enable or disable persisting component's state between page reloads. If enabled, following list of states will be persisted.
     * 1. value
     * 
     * {% codeBlock src='inplace-editor/enable-persistence/index.md' %}{% endcodeBlock %}
     * 
     * @default false
     */
    enablePersistence?: boolean;

    /**
     * Specifies whether to enable editing mode or not.
     * @default false
     */
    disabled?: boolean;

    /**
     * Used to show/hide the ok/cancel buttons of In-place editor.
     * 
     * {% codeBlock src='inplace-editor/show-buttons/index.md' %}{% endcodeBlock %}
     * 
     * @default true
     */
    showButtons?: boolean;

    /**
     * Specifies to show/hide the editing mode.
     * 
     * {% codeBlock src='inplace-editor/enable-edit-mode/index.md' %}{% endcodeBlock %}
     * 
     * @default false
     */
    enableEditMode?: boolean;

    /**
     * Sets to trigger the submit action with enter key pressing of input.
     * 
     * {% codeBlock src='inplace-editor/submit-on-enter/index.md' %}{% endcodeBlock %}
     * 
     * @default true
     */
    submitOnEnter?: boolean;

    /**
     * Specifies the object to customize popup display settings like positions, animation etc.
     * 
     * {% codeBlock src='inplace-editor/popup-settings/index.md' %}{% endcodeBlock %}
     * 
     * @default {}
     */
    popupSettings?: PopupSettingsModel;

    /**
     * Specifies the model object configuration for the integrated components like AutoComplete, DatePicker,NumericTextBox, etc.
     * 
     * {% codeBlock src='inplace-editor/model/index.md' %}{% endcodeBlock %}
     * 
     * @default null
     */
    model?: AutoCompleteModel | ColorPickerModel | ComboBoxModel | DatePickerModel | DateRangePickerModel | DateTimePickerModel | DropDownListModel | MaskedTextBoxModel | MultiSelectModel | NumericTextBoxModel | RichTextEditorModel | SliderModel | TextBoxModel | TimePickerModel;

    /**
     * Used to customize the "Save" button UI appearance by defining Button model configuration.
     *
     * {% codeBlock src='inplace-editor/save-button/index.md' %}{% endcodeBlock %}
     *
     * @default { iconCss: 'e-icons e-save-icon' }
     */
    saveButton?: ButtonModel;

    /**
     * Used to customize the "Cancel" button UI appearance by defining Button model configuration.
     * 
     * {% codeBlock src='inplace-editor/cancel-button/index.md' %}{% endcodeBlock %}
     * 
     * @default { iconCss: 'e-icons e-cancel-icon' }
     */
    cancelButton?: ButtonModel;

    /**
     * Maps the validation rules for the input.
     * 
     * {% codeBlock src='inplace-editor/validation-rules/index.md' %}{% endcodeBlock %}
     * 
     * @default null
     */
    validationRules?: { [name: string]: { [rule: string]: Object } };

    /**
     * The event will be fired once the component rendering is completed.
     * @event
     * @blazorProperty 'Created'
     */
    created?: EmitType<Event>;

    /**
     * Event triggers before sanitize the value.
     * @event 
     * @blazorProperty 'OnSanitizeHtml'
     */
    beforeSanitizeHtml?: EmitType<BeforeSanitizeHtmlArgs>;

    /**
     * The event will be fired before the data submitted to the server.
     * @event
     * @blazorProperty 'OnActionBegin'
     */
    actionBegin?: EmitType<ActionBeginEventArgs>;

    /**
     * The event will be fired when data submitted successfully to the server.
     * @event
     * @blazorProperty 'OnActionSuccess'
     */
    actionSuccess?: EmitType<ActionEventArgs>;

    /**
     * The event will be fired when data submission failed.
     * @event
     * @blazorProperty 'OnActionFailure'
     */
    actionFailure?: EmitType<ActionEventArgs>;

    /**
     * The event will be fired while validating current value.
     * @event
     * @blazorProperty 'Validating'
     */
    validating?: EmitType<ValidateEventArgs>;

    /**
     * The event will be fired before changing the mode from default to edit mode.
     * @event
     */
    beginEdit?: EmitType<BeginEditEventArgs>;

    /**
     * The event will be fired when the integrated component value has changed that render based on the `type` property
     * in the In-place editor.
     * @event
     * @blazorProperty 'ValueChange'
     */
    change?: EmitType<ChangeEventArgs>;

    /**
     * Event triggers when click the submit button.
     * @event 
     * @blazorProperty 'SubmitClick'
     */
    submitClick?: EmitType<MouseEvent>;

    /**
     * Event triggers when click the cancel button.
     * @event 
     * @blazorProperty 'CancelClick'
     */
    cancelClick?: EmitType<MouseEvent>;

    /**
     * The event will be fired when the component gets destroyed.
     * @event
     * @blazorProperty 'Destroyed'
     */
    destroyed?: EmitType<Event>;

}