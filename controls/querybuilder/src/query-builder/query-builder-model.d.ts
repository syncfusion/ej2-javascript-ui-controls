import { Component, INotifyPropertyChanged, NotifyPropertyChanges, getComponent, MouseEventArgs, Browser } from '@syncfusion/ej2-base';import { Property, ChildProperty, Complex, L10n, closest, extend, isNullOrUndefined } from '@syncfusion/ej2-base';import { getInstance, addClass, removeClass, rippleEffect, detach, classList } from '@syncfusion/ej2-base';import { Internationalization, DateFormatOptions } from '@syncfusion/ej2-base';import { Button, RadioButton, ChangeEventArgs as ButtonChangeEventArgs } from '@syncfusion/ej2-buttons';import { DropDownList, ChangeEventArgs, FieldSettingsModel, CheckBoxSelection } from '@syncfusion/ej2-dropdowns';import { MultiSelect, MultiSelectChangeEventArgs } from '@syncfusion/ej2-dropdowns';import { EmitType, Event, EventHandler, getValue, Animation } from '@syncfusion/ej2-base';import { Query, Predicate, DataManager, Deferred } from '@syncfusion/ej2-data';import { TextBox, NumericTextBox, InputEventArgs, ChangeEventArgs as InputChangeEventArgs } from '@syncfusion/ej2-inputs';import { DatePicker, ChangeEventArgs as CalendarChangeEventArgs } from '@syncfusion/ej2-calendars';import { DropDownButton, ItemModel, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';import { Tooltip } from '@syncfusion/ej2-popups';
import {TemplateColumn,Validation,DisplayMode,SortDirection} from "./query-builder";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Columns
 */
export interface ColumnsModel {

    /**
     * Specifies the fields in columns.
     * @default null
     */
    field?: string;

    /**
     * Specifies the labels name in columns
     * @default null
     */
    label?: string;

    /**
     * Specifies the types in columns field
     * @default null
     */
    type?: string;

    /**
     * Specifies the values in columns or bind the values from sub controls.
     * @default null
     */
    values?: string[] | number[];

    /**
     * Specifies the operators in columns.
     * @default null
     */
    operators?: { [key: string]: Object }[];

    /**
     * Specifies the template for value field such as slider or any other widgets.
     * @default null
     */
    template?: TemplateColumn;

    /**
     * Specifies the validation for columns (text, number and date).
     * @default  { isRequired: true , min: 0, max: Number.MAX_VALUE }
     */
    validation?: Validation;

    /**
     * Specifies the date format for columns.
     * @default null
     */
    format?: string;

    /**
     * Specifies the step value(numeric textbox) for columns.
     * @default null
     */
    step?: number;

}

/**
 * Interface for a class Rules
 */
export interface RulesModel {

    /**
     * Specifies the condition value in group.
     * @default 'and'
     */
    condition?: string;

    /**
     * Specifies the rules in group.
     * @default 'rule'
     */
    rules?: RulesModel[];

    /**
     * Specifies the field value in group.
     * @default null
     */
    field?: string;

    /**
     * Specifies the label value in group.
     * @default null
     */
    label?: string;

    /**
     * Specifies the type value in group.
     * @default null
     */
    type?: string;

    /**
     * Specifies the operator value in group.
     * @default null
     */
    operator?: string;

    /**
     * Specifies the sub controls value in group.
     * @default null
     */
    value?: string[] | number[] | string | number;

}

/**
 * Interface for a class Rule
 */
export interface RuleModel {

    /**
     * Specifies the condition value in group.
     * @default 'and'
     */
    condition?: string;

    /**
     * Specifies the initial rule, which is JSON data.
     * @default 'rule'
     */
    rules?: RulesModel[];

}

/**
 * Interface for a class ShowButtons
 */
export interface ShowButtonsModel {

    /**
     * Specifies the boolean value in ruleDelete that the enable/disable the buttons in rule.
     * @default true
     */
    ruleDelete?: boolean;

    /**
     * Specifies the boolean value in groupInsert that the enable/disable the buttons in group.
     * @default true
     */
    groupInsert?: boolean;

    /**
     * Specifies the boolean value in groupDelete that the enable/disable the buttons in group.
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
     * @event 
     */
    created?: EmitType<Object>;

    /**
     * Triggers before the condition (And/Or) is changed.
     * @event
     */
    beforeConditionChange?: EmitType<Object>;

    /**
     * Triggers before the field is changed.
     * @event
     */
    beforeFieldChange?: EmitType<Object>;

    /**
     * Triggers before the operator is changed. (e.g., equal, less etc.).
     * @event
     */
    beforeOperatorChange?: EmitType<Object>;

    /**
     * Triggers before the value is changed.
     * @event
     */
    beforeValueChange?: EmitType<Object>;

    /**
     * Triggers when changing the condition(AND/OR) in button group.
     * @event
     */
    conditionChanged?: EmitType<Object>;

    /**
     * Triggers when changing the fields using the drop-down list.
     * @event
     */
    fieldChanged?: EmitType<Object>;

    /**
     * Triggers when changing the rule value.
     * @event
     */
    valueChanged?: EmitType<Object>;

    /**
     * Triggers when changing the operator value.
     * @event
     */
    operatorChanged?: EmitType<Object>;

    /**
     * Triggers when deleting a group.
     * @event
     */
    groupDelete?: EmitType<Object>;

    /**
     * Triggers when deleting the rule.
     * @event
     */
    ruleDelete?: EmitType<Object>;

    /**
     * Triggers when adding a Group.
     * @event
     */
    groupInsert?: EmitType<Object>;

    /**
     * Triggers when adding the rule.
     * @event
     */
    ruleInsert?: EmitType<Object>;

    /**
     * Specifies the showButtons settings of the query builder component.
     * The showButtons can be enable Enables or disables the ruleDelete, groupInsert, and groupDelete buttons.
     * @default { ruleDelete: true , groupInsert: true, groupDelete: true }
     */
    showButtons?: ShowButtonsModel;

    /**
     * Shows or hides the filtered query.
     * @default false
     */
    summaryView?: boolean;

    /**
     * Enables or disables the validation.
     * @default false
     */
    allowValidation?: boolean;

    /**
     * Specifies columns to create filters.
     * @default {}
     */
    columns?: ColumnsModel[];

    /**
     * Defines class or multiple classes, which are separated by a space in the QueryBuilder element.
     * You can add custom styles to the QueryBuilder using the cssClass property.
     * @default ''
     */
    cssClass?: string;

    /**
     * Binds the column name from data source in query-builder.
     * The `dataSource` is an array of JavaScript objects.
     * @default []
     */
    dataSource?: Object[] | Object | DataManager;

    /**
     * Specifies the displayMode as Horizontal or Vertical.
     * @default 'Horizontal'
     */
    displayMode?: DisplayMode;

    /**
     * Enables or disables the RTL support it is extended from the component class.
     * @default false.
     */
    enableRtl?: boolean;

    /**
     * Enable or disable persisting component's state between page reloads. 
     * If enabled, filter states will be persisted.
     * @default false.
     */
    enablePersistence?: boolean;

    /**
     * Specifies the sort direction of the field names.
     * @default 'Default'
     */
    sortDirection?: SortDirection;

    /**
     * Specifies the maximum group count or restricts the group count.
     * @default 5
     */
    maxGroupCount?: number;

    /**
     * Specifies the height of the query builder.
     * @default 'auto'
     */
    height?: string;

    /**
     * Specifies the width of the query builder.
     * @default 'auto'
     */
    width?: string;

    /**
     * Defines rules in the QueryBuilder.
     * Specifies the initial rule, which is JSON data.
     * @default {}
     */
    rule?: RuleModel;

}