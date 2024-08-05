import { Component, INotifyPropertyChanged, NotifyPropertyChanges, getComponent, MouseEventArgs, Browser, compile, append, ModuleDeclaration, Draggable, remove } from '@syncfusion/ej2-base';import { Property, ChildProperty, Complex, L10n, closest, extend, isNullOrUndefined, Collection, cldrData } from '@syncfusion/ej2-base';import { getInstance, addClass, removeClass, rippleEffect, detach, classList } from '@syncfusion/ej2-base';import { Internationalization, DateFormatOptions, KeyboardEventArgs, getUniqueID, select } from '@syncfusion/ej2-base';import { Button, CheckBox, RadioButton, ChangeEventArgs as ButtonChangeEventArgs, RadioButtonModel } from '@syncfusion/ej2-buttons';import { DropDownList, ChangeEventArgs as DropDownChangeEventArgs, FieldSettingsModel, CheckBoxSelection, DropDownTreeModel, DropDownTree, DdtFilteringEventArgs } from '@syncfusion/ej2-dropdowns';import { MultiSelect, MultiSelectChangeEventArgs, PopupEventArgs, MultiSelectModel, DropDownListModel } from '@syncfusion/ej2-dropdowns';import { EmitType, Event, EventHandler, getValue, Animation, BaseEventArgs } from '@syncfusion/ej2-base';import { Query, Predicate, DataManager, Deferred } from '@syncfusion/ej2-data';import { TextBox, NumericTextBox, InputEventArgs, ChangeEventArgs as InputChangeEventArgs } from '@syncfusion/ej2-inputs';import { TextBoxModel, NumericTextBoxModel } from '@syncfusion/ej2-inputs';import { DatePicker, ChangeEventArgs as CalendarChangeEventArgs, DatePickerModel } from '@syncfusion/ej2-calendars';import { DropDownButton, ItemModel, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';import { Tooltip, createSpinner, showSpinner, hideSpinner, TooltipEventArgs } from '@syncfusion/ej2-popups';import { compile as templateCompiler, getNumericObject } from '@syncfusion/ej2-base';
import {TemplateColumn,Validation,FormatObject,ActionEventArgs,ChangeEventArgs,RuleChangeEventArgs,DragEventArgs,DropEventArgs,FieldMode,DisplayMode,SortDirection} from "./query-builder";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Columns
 */
export interface ColumnsModel {

    /**
     * Specifies the fields in columns.
     *
     * @default null
     */
    field?: string;

    /**
     * Specifies the labels name in columns.
     *
     * @default null
     */
    label?: string;

    /**
     * Specifies the types in columns field.
     *
     * @default null
     */
    type?: string;

    /**
     * Specifies the values in columns or bind the values from sub controls.
     *
     * @default null
     */
    values?: string[] | number[] | boolean[];

    /**
     * Specifies the operators in columns.
     *
     * @default null
     */
    operators?: { [key: string]: Object }[];

    /**
     * Specifies the rule template for the field with any other widgets.
     *
     * @default null
     * @aspType string
     */
    ruleTemplate?: string | Function;

    /**
     * Specifies the template for value field such as slider or any other widgets.
     *
     * @default null
     */
    template?: TemplateColumn | string | Function;

    /**
     * Specifies the validation for columns (text, number and date).
     *
     * @default  { isRequired: true , min: 0, max: Number.MAX_VALUE }
     */
    validation?: Validation;

    /**
     * Specifies the date format for columns.
     *
     * @aspType string
     * @blazorType string
     * @default null
     */
    format?: string | FormatObject;

    /**
     * Specifies the step value(numeric textbox) for columns.
     *
     * @default null
     */
    step?: number;

    /**
     * Specifies the default value for columns.
     *
     * @default null
     */
    value?:  string[] | number[] | string | number | boolean | Date;

    /**
     * Specifies the category for columns.
     *
     * @default null
     */
    category?: string;

    /**
     * Specifies the sub fields in columns.
     *
     * @default null
     */
    columns?: ColumnsModel[];

}

/**
 * Interface for a class Rule
 */
export interface RuleModel {

    /**
     * Specifies the condition value in group.
     *
     * @default null
     */
    condition?: string;

    /**
     * Specifies the rules in group.
     *
     * @default []
     */
    rules?: RuleModel[];

    /**
     * Specifies the field value in group.
     *
     * @default null
     */
    field?: string;

    /**
     * Specifies the label value in group.
     *
     * @default null
     */
    label?: string;

    /**
     * Specifies the type value in group.
     *
     * @default null
     */
    type?: string;

    /**
     * Specifies the operator value in group.
     *
     * @default null
     */
    operator?: string;

    /**
     * Specifies the sub controls value in group.
     *
     * @default null
     */
    value?: string[] | number[] | string | number | boolean;

    /**
     * Specifies whether not condition is true/false.
     *
     * @default false
     */
    not?: boolean;

    /**
     * Specifies whether rule is locked or not.
     *
     * @default null
     */
    isLocked?: boolean;

}

/**
 * Interface for a class Value
 */
export interface ValueModel {

    /**
     * Specifies the property for NumericTextBox value.
     *
     * @default null
     */
    numericTextBoxModel?: NumericTextBoxModel;

    /**
     * Specifies the property for MultiSelect value.
     *
     * @default null
     */
    multiSelectModel?: MultiSelectModel;

    /**
     *  Specifies the property for DatePicker value.
     *
     * @default null
     */
    datePickerModel?: DatePickerModel;

    /**
     *  Specifies the TextBox value.
     *
     * @default null
     */
    textBoxModel?: TextBoxModel;

    /**
     * Specifies the RadioButton value.
     *
     * @default null
     */
    radioButtonModel?: RadioButtonModel;

}

/**
 * Interface for a class ShowButtons
 */
export interface ShowButtonsModel {

    /**
     * Specifies the boolean value in ruleDelete that the enable/disable the buttons in rule.
     *
     * @default false
     */
    cloneRule?: boolean;

    /**
     * Specifies the boolean value in ruleDelete that the enable/disable the buttons in rule.
     *
     * @default false
     */
    cloneGroup?: boolean;

    /**
     * Specifies the boolean value in ruleDelete that the enable/disable the buttons in rule.
     *
     * @default false
     */
    lockRule?: boolean;

    /**
     * Specifies the boolean value in ruleDelete that the enable/disable the buttons in rule.
     *
     * @default false
     */
    lockGroup?: boolean;

    /**
     * Specifies the boolean value in ruleDelete that the enable/disable the buttons in rule.
     *
     * @default true
     */
    ruleDelete?: boolean;

    /**
     * Specifies the boolean value in groupInsert that the enable/disable the buttons in group.
     *
     * @default true
     */
    groupInsert?: boolean;

    /**
     * Specifies the boolean value in groupDelete that the enable/disable the buttons in group.
     *
     * @default true
     */
    groupDelete?: boolean;

}

/**
 * Interface for a class QueryBuilder
 */
export interface QueryBuilderModel extends ComponentModel{

    /**
     * Triggers when the component is created.
     *
     * @event created
     * @blazorProperty 'Created'
     */
    created?: EmitType<Event>;

    /**
     * Triggers when field, operator, value is change.
     *
     * @event actionBegin
     * @blazorProperty 'OnActionBegin'
     */
    actionBegin?: EmitType<ActionEventArgs>;

    /**
     * Triggers before the condition (And/Or), field, operator, value is changed.
     *
     * @event beforeChange
     * @blazorProperty 'OnValueChange'
     */
    beforeChange?: EmitType<ChangeEventArgs>;

    /**
     * Triggers when changing the condition(AND/OR), field, value, operator is changed.
     *
     * @event change
     * @blazorProperty 'Changed'
     */
    change?: EmitType<ChangeEventArgs>;

    /**
     * Triggers when dataBound to the Query Builder.
     *
     * @event dataBound
     * @blazorProperty 'dataBound'
     */
    dataBound?: EmitType<Object>;

    /**
     * Triggers when changing the condition(AND/OR), field, value, operator is changed
     *
     * @event ruleChange
     * @blazorProperty 'RuleChanged'
     */
    ruleChange?: EmitType<RuleChangeEventArgs>;

    /**
     * Triggers when rule/ group dragging starts.
     *
     *
     */
    dragStart?: EmitType<DragEventArgs>;

    /**
     * Triggers when rule/ group are dragged (moved) continuously.
     *
     *
     */
    drag?: EmitType<DragEventArgs>;

    /**
     * Triggers when rule/ group are dropped on to the target rule/ group.
     *
     *
     */
    drop?: EmitType<DropEventArgs>;

    /**
     * Specifies the showButtons settings of the query builder component.
     * The showButtons can be enable Enables or disables the ruleDelete, groupInsert, and groupDelete buttons.
     *
     * @default { ruleDelete: true , groupInsert: true, groupDelete: true }
     */
    showButtons?: ShowButtonsModel;

    /**
     * Shows or hides the filtered query.
     *
     * @default false
     */
    summaryView?: boolean;

    /**
     * Enables or disables the validation.
     *
     * @default false
     */
    allowValidation?: boolean;

    /**
     * Specifies the fieldMode as DropDownList or DropDownTree.
     *
     * @default 'Default'
     */
    fieldMode?: FieldMode;

    /**
     * Specifies columns to create filters.
     *
     * @default {}
     */
    columns?: ColumnsModel[];

    /**
     * Specifies the property for field.
     *
     *  @default null
     */
    fieldModel?: DropDownListModel | DropDownTreeModel;

    /**
     * Specifies the property for operator.
     *
     *  @default null
     */
    operatorModel?: DropDownListModel;

    /**
     * Specifies the property for value.
     *
     * @default null
     */
    valueModel?: ValueModel;

    /**
     * Specifies the template for the header with any other widgets.
     *
     * @default null
     * @aspType string
     */
    headerTemplate?: string | Function;

    /**
     * Defines class or multiple classes, which are separated by a space in the QueryBuilder element.
     * You can add custom styles to the QueryBuilder using the cssClass property.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Binds the column name from data source in query-builder.
     * The `dataSource` is an array of JavaScript objects.
     *
     * @default []
     */
    dataSource?: Object[] | Object | DataManager;

    /**
     * Specifies the displayMode as Horizontal or Vertical.
     *
     * @default 'Horizontal'
     */
    displayMode?: DisplayMode;

    /**
     * Enable or disable persisting component's state between page reloads.
     * If enabled, filter states will be persisted.
     *
     * @default false.
     */
    enablePersistence?: boolean;

    /**
     * Specifies the sort direction of the field names.
     *
     * @default 'Default'
     */
    sortDirection?: SortDirection;

    /**
     * Specifies the maximum group count or restricts the group count.
     *
     * @default 5
     */
    maxGroupCount?: number;

    /**
     * Specifies the height of the query builder.
     *
     * @default 'auto'
     */
    height?: string;

    /**
     * Specifies the width of the query builder.
     *
     * @default 'auto'
     */
    width?: string;

    /**
     * If match case is set to true, the grid filters the records with exact match.
     * if false, it filters case insensitive records (uppercase and lowercase letters treated the same).
     *
     * @default false
     */
    matchCase?: boolean;

    /**
     * If immediateModeDelay is set by particular number, the rule Change event is triggered after that period.
     *
     * @default 0
     */
    immediateModeDelay?: number;

    /**
     * Enables/Disables the not group condition in query builder.
     *
     * @default false
     */
    enableNotCondition?: boolean;

    /**
     * When set to true, the user interactions on the component are disabled.
     *
     * @default false
     */
    readonly?: boolean;

    /**
     * Specifies a boolean value whether enable / disable the new rule adding while adding new groups.
     *
     * @remarks
     * If this property is true, the empty rule is inserted while inserting new group.
     * If set to false, the group is inserted without any rule.
     * @default true
     */
    addRuleToNewGroups?: boolean;

    /**
     * Specifies a boolean value whether enable / disable the auto selection with the first value for the field.
     *
     * @remarks
     * If this property is true, the field dropdown list will render with the first value of the dropdown list.
     * If set to false, the dropdown list render with placeholder.
     * @default false
     */
    autoSelectField?: boolean;

    /**
     * Specifies a boolean value whether enable / disable the auto selection with the first value for the operator.
     *
     * @remarks
     * If this property is true, the operator dropdown list will render with the first value of the dropdown list.
     * If set to false, the dropdown list render with placeholder.
     * @default true
     */
    autoSelectOperator?: boolean;

    /**
     * Specifies the separator string for column.
     *
     * @default ''
     */
    separator?: string;

    /**
     * Specifies whether to enable separate connectors between rules/groups.
     *
     * @remarks
     * When this property is set to true, each rule/group will have its own connector, allowing them to be connected independently with different connectors.
     * When set to false, will result in connectors being shared between rules/groups, possibly connecting them with the same connector.
     *
     * @default false
     *
     */
    enableSeparateConnector?: boolean;

    /**
     * Defines rules in the QueryBuilder.
     * Specifies the initial rule, which is JSON data.
     *
     * @default {}
     */
    rule?: RuleModel;

    /**
     * Specifies a boolean value whether to enable / disable the drag and drop support to move the rules/ groups.
     *
     * @remarks
     * If this property is true, the drag handle will be rendered in front of the rule/ group element to perform, drag and drop.
     * If set to false, the drag handle element is not rendered.
     * @default false
     */
    allowDragAndDrop?: boolean;

}