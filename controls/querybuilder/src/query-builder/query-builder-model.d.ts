import { Component, INotifyPropertyChanged, NotifyPropertyChanges, getComponent, MouseEventArgs, Browser } from '@syncfusion/ej2-base';import { Property, ChildProperty, Complex, L10n, closest, extend, isNullOrUndefined, Collection } from '@syncfusion/ej2-base';import { getInstance, addClass, removeClass, rippleEffect, detach, classList, isBlazor } from '@syncfusion/ej2-base';import { Internationalization, DateFormatOptions } from '@syncfusion/ej2-base';import { Button, RadioButton, ChangeEventArgs as ButtonChangeEventArgs } from '@syncfusion/ej2-buttons';import { DropDownList, ChangeEventArgs as DropDownChangeEventArgs, FieldSettingsModel, CheckBoxSelection } from '@syncfusion/ej2-dropdowns';import { MultiSelect, MultiSelectChangeEventArgs, PopupEventArgs  } from '@syncfusion/ej2-dropdowns';import { EmitType, Event, EventHandler, getValue, Animation, BaseEventArgs } from '@syncfusion/ej2-base';import { Query, Predicate, DataManager, Deferred, UrlAdaptor } from '@syncfusion/ej2-data';import { TextBox, NumericTextBox, InputEventArgs, ChangeEventArgs as InputChangeEventArgs } from '@syncfusion/ej2-inputs';import { DatePicker, ChangeEventArgs as CalendarChangeEventArgs } from '@syncfusion/ej2-calendars';import { DropDownButton, ItemModel, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';import { Tooltip, createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import {TemplateColumn,Validation,ChangeEventArgs,RuleChangeEventArgs,DisplayMode,SortDirection} from "./query-builder";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Columns
 */
export interface ColumnsModel {

    /**
     * Specifies the fields in columns.

     */
    field?: string;

    /**
     * Specifies the labels name in columns

     */
    label?: string;

    /**
     * Specifies the types in columns field

     */
    type?: string;

    /**
     * Specifies the values in columns or bind the values from sub controls.

     */
    values?: string[] | number[] | boolean[];

    /**
     * Specifies the operators in columns.

     */
    operators?: { [key: string]: Object }[];

    /**
     * Specifies the template for value field such as slider or any other widgets.

     */
    template?: TemplateColumn;

    /**
     * Specifies the validation for columns (text, number and date).

     */
    validation?: Validation;

    /**
     * Specifies the date format for columns.

     */
    format?: string;

    /**
     * Specifies the step value(numeric textbox) for columns.

     */
    step?: number;

    /**
     * Specifies the default value for columns.

     */
    value?:  string[] | number[] | string | number | boolean | Date;

    /**
     * Specifies the category for columns.

     */
    category?: string;

}

/**
 * Interface for a class Rule
 */
export interface RuleModel {

    /**
     * Specifies the condition value in group.

     */
    condition?: string;

    /**
     * Specifies the rules in group.

     */
    rules?: RuleModel[];

    /**
     * Specifies the field value in group.

     */
    field?: string;

    /**
     * Specifies the label value in group.

     */
    label?: string;

    /**
     * Specifies the type value in group.

     */
    type?: string;

    /**
     * Specifies the operator value in group.

     */
    operator?: string;

    /**
     * Specifies the sub controls value in group.

     */
    value?: string[] | number[] | string | number | boolean;

}

/**
 * Interface for a class ShowButtons
 */
export interface ShowButtonsModel {

    /**
     * Specifies the boolean value in ruleDelete that the enable/disable the buttons in rule.

     */
    ruleDelete?: boolean;

    /**
     * Specifies the boolean value in groupInsert that the enable/disable the buttons in group.

     */
    groupInsert?: boolean;

    /**
     * Specifies the boolean value in groupDelete that the enable/disable the buttons in group.

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
    created?: EmitType<Event>;

    /**
     * Triggers before the condition (And/Or), field, operator, value is changed.
     * @event

     */
    beforeChange?: EmitType<ChangeEventArgs>;

    /**
     * Triggers when changing the condition(AND/OR), field, value, operator is changed
     * @event

     */
    change?: EmitType<ChangeEventArgs>;

    /**
     * Triggers when changing the condition(AND/OR), field, value, operator is changed
     * @event

     */
    ruleChange?: EmitType<RuleChangeEventArgs>;

    /**
     * Specifies the showButtons settings of the query builder component.
     * The showButtons can be enable Enables or disables the ruleDelete, groupInsert, and groupDelete buttons.

     */
    showButtons?: ShowButtonsModel;

    /**
     * Shows or hides the filtered query.

     */
    summaryView?: boolean;

    /**
     * Enables or disables the validation.

     */
    allowValidation?: boolean;

    /**
     * Specifies columns to create filters.

     */
    columns?: ColumnsModel[];

    /**
     * Defines class or multiple classes, which are separated by a space in the QueryBuilder element.
     * You can add custom styles to the QueryBuilder using the cssClass property.

     */
    cssClass?: string;

    /**
     * Binds the column name from data source in query-builder.
     * The `dataSource` is an array of JavaScript objects.

     */
    dataSource?: Object[] | Object | DataManager;

    /**
     * Specifies the displayMode as Horizontal or Vertical.

     */
    displayMode?: DisplayMode;

    /**
     * Enable or disable persisting component's state between page reloads. 
     * If enabled, filter states will be persisted.

     */
    enablePersistence?: boolean;

    /**
     * Specifies the sort direction of the field names.

     */
    sortDirection?: SortDirection;

    /**
     * Specifies the maximum group count or restricts the group count.

     */
    maxGroupCount?: number;

    /**
     * Specifies the height of the query builder.

     */
    height?: string;

    /**
     * Specifies the width of the query builder.

     */
    width?: string;

    /**
     * If match case is set to true, the grid filters the records with exact match. 
     * if false, it filters case insensitive records (uppercase and lowercase letters treated the same).

     */
    matchCase?: boolean;

    /**
     * Defines rules in the QueryBuilder.
     * Specifies the initial rule, which is JSON data.

     */
    rule?: RuleModel;

}