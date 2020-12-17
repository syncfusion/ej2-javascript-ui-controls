import { Component, INotifyPropertyChanged, NotifyPropertyChanges, getComponent, MouseEventArgs, Browser } from '@syncfusion/ej2-base';import { Property, ChildProperty, Complex, L10n, closest, extend, isNullOrUndefined, Collection, cldrData } from '@syncfusion/ej2-base';import { getInstance, addClass, removeClass, rippleEffect, detach, classList, isBlazor } from '@syncfusion/ej2-base';import { Internationalization, DateFormatOptions, KeyboardEventArgs, getUniqueID, select } from '@syncfusion/ej2-base';import { Button, RadioButton, ChangeEventArgs as ButtonChangeEventArgs } from '@syncfusion/ej2-buttons';import { DropDownList, ChangeEventArgs as DropDownChangeEventArgs, FieldSettingsModel, CheckBoxSelection } from '@syncfusion/ej2-dropdowns';import { MultiSelect, MultiSelectChangeEventArgs, PopupEventArgs  } from '@syncfusion/ej2-dropdowns';import { EmitType, Event, EventHandler, getValue, Animation, BaseEventArgs } from '@syncfusion/ej2-base';import { Query, Predicate, DataManager, Deferred, UrlAdaptor } from '@syncfusion/ej2-data';import { TextBox, NumericTextBox, InputEventArgs, ChangeEventArgs as InputChangeEventArgs } from '@syncfusion/ej2-inputs';import { DatePicker, ChangeEventArgs as CalendarChangeEventArgs } from '@syncfusion/ej2-calendars';import { DropDownButton, ItemModel, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';import { Tooltip, createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';import { resetBlazorTemplate, updateBlazorTemplate, blazorTemplates, compile as templateCompiler } from '@syncfusion/ej2-base';
import {TemplateColumn,Validation,FormatObject,ActionEventArgs,ChangeEventArgs,RuleChangeEventArgs,DisplayMode,SortDirection} from "./query-builder";
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
    values?: string[] | number[] | boolean[];

    /**
     * Specifies the operators in columns.
     * @default null
     */
    operators?: { [key: string]: Object }[];

    /**
     * Specifies the rule template for the field with any other widgets.
     */
    ruleTemplate?: string;

    /**
     * Specifies the template for value field such as slider or any other widgets.
     * @default null
     */
    template?: TemplateColumn | string;

    /**
     * Specifies the validation for columns (text, number and date).
     * @default  { isRequired: true , min: 0, max: Number.MAX_VALUE }
     */
    validation?: Validation;

    /**
     * Specifies the date format for columns.
     * @aspType string
     * @blazorType string
     * @default null
     */
    format?: string | FormatObject;

    /**
     * Specifies the step value(numeric textbox) for columns.
     * @default null
     */
    step?: number;

    /**
     * Specifies the default value for columns.
     * @default null
     */
    value?:  string[] | number[] | string | number | boolean | Date;

    /**
     * Specifies the category for columns.
     * @default null
     */
    category?: string;

}

/**
 * Interface for a class Rule
 */
export interface RuleModel {

    /**
     * Specifies the condition value in group.
     * @default null
     */
    condition?: string;

    /**
     * Specifies the rules in group.
     * @default []
     */
    rules?: RuleModel[];

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
    value?: string[] | number[] | string | number | boolean;

    /**
     * Specifies whether not condition is true/false.
     * @default false
     */
    not?: boolean;

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
     * @blazorProperty 'Created'
     */
    created?: EmitType<Event>;

    /**
     * Triggers when field, operator, value is change.
     * @event
     * @blazorProperty 'OnActionBegin'
     */
    actionBegin?: EmitType<ActionEventArgs>;

    /**
     * Triggers before the condition (And/Or), field, operator, value is changed.
     * @event
     * @blazorProperty 'OnValueChange'
     */
    beforeChange?: EmitType<ChangeEventArgs>;

    /**
     * Triggers when changing the condition(AND/OR), field, value, operator is changed
     * @event
     * @blazorProperty 'Changed'
     */
    change?: EmitType<ChangeEventArgs>;

    /**
     * Triggers when changing the condition(AND/OR), field, value, operator is changed
     * @event
     * @blazorProperty 'RuleChanged'
     */
    ruleChange?: EmitType<RuleChangeEventArgs>;

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
     * If match case is set to true, the grid filters the records with exact match. 
     * if false, it filters case insensitive records (uppercase and lowercase letters treated the same).
     * @default false
     */
    matchCase?: boolean;

    /**
     * If immediateModeDelay is set by particular number, the rule Change event is triggered after that period.
     * @default 0
     */
    immediateModeDelay?: number;

    /**
     * Enables/Disables the not group condition in query builder.
     * @default false
     */
    enableNotCondition?: boolean;

    /**
     * When set to true, the user interactions on the component are disabled.
     * @default false
     */
    readonly?: boolean;

    /**
     * Specifies the separator string for column.
     * @default ''
     */
    separator?: string;

    /**
     * Defines rules in the QueryBuilder.
     * Specifies the initial rule, which is JSON data.
     * @default {}
     */
    rule?: RuleModel;

}