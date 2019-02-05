/**
 * Query Builder Source
 */
import { Component, INotifyPropertyChanged } from '@syncfusion/ej2-base';
import { ChildProperty } from '@syncfusion/ej2-base';
import { QueryBuilderModel, ShowButtonsModel, ColumnsModel, RulesModel, RuleModel } from './query-builder-model';
import { EmitType } from '@syncfusion/ej2-base';
import { Query, Predicate, DataManager } from '@syncfusion/ej2-data';
export declare class Columns extends ChildProperty<Columns> {
    /**
     * Specifies the fields in columns.
     * @default null
     */
    field: string;
    /**
     * Specifies the labels name in columns
     * @default null
     */
    label: string;
    /**
     * Specifies the types in columns field
     * @default null
     */
    type: string;
    /**
     * Specifies the values in columns or bind the values from sub controls.
     * @default null
     */
    values: string[] | number[];
    /**
     * Specifies the operators in columns.
     * @default null
     */
    operators: {
        [key: string]: Object;
    }[];
    /**
     * Specifies the template for value field such as slider or any other widgets.
     * @default null
     */
    template: TemplateColumn;
    /**
     * Specifies the validation for columns (text, number and date).
     * @default  { isRequired: true , min: 0, max: Number.MAX_VALUE }
     */
    validation: Validation;
    /**
     * Specifies the date format for columns.
     * @default null
     */
    format: string;
    /**
     * Specifies the step value(numeric textbox) for columns.
     * @default null
     */
    step: number;
}
export declare class Rules extends ChildProperty<Rules> {
    /**
     * Specifies the condition value in group.
     * @default 'and'
     */
    condition: string;
    /**
     * Specifies the rules in group.
     * @default 'rule'
     */
    rules: RulesModel[];
    /**
     * Specifies the field value in group.
     * @default null
     */
    field: string;
    /**
     * Specifies the label value in group.
     * @default null
     */
    label: string;
    /**
     * Specifies the type value in group.
     * @default null
     */
    type: string;
    /**
     * Specifies the operator value in group.
     * @default null
     */
    operator: string;
    /**
     * Specifies the sub controls value in group.
     * @default null
     */
    value: string[] | number[] | string | number;
}
export declare class Rule extends ChildProperty<Rule> {
    /**
     * Specifies the condition value in group.
     * @default 'and'
     */
    condition: string;
    /**
     * Specifies the initial rule, which is JSON data.
     * @default 'rule'
     */
    rules: RulesModel[];
}
export declare class ShowButtons extends ChildProperty<ShowButtons> {
    /**
     * Specifies the boolean value in ruleDelete that the enable/disable the buttons in rule.
     * @default true
     */
    ruleDelete: boolean;
    /**
     * Specifies the boolean value in groupInsert that the enable/disable the buttons in group.
     * @default true
     */
    groupInsert: boolean;
    /**
     * Specifies the boolean value in groupDelete that the enable/disable the buttons in group.
     * @default true
     */
    groupDelete: boolean;
}
/**
 * Specify Specifies the displayMode as Horizontal or Vertical.
 */
export declare type DisplayMode = 
/**  Display the Horizontal UI */
'Horizontal' | 
/**  Display the Vertical UI */
'Vertical';
/**
 * Specifies the sort direction of the field names. They are
 * * Default
 * * Ascending
 * * Descending
 */
export declare type SortDirection = 
/**  Show the field names in default */
'Default' | 
/**  Show the field names in Ascending */
'Ascending' | 
/**  Show the field names in Descending */
'Descending';
export declare class QueryBuilder extends Component<HTMLDivElement> implements INotifyPropertyChanged {
    private groupIdCounter;
    private ruleIdCounter;
    private btnGroupId;
    private levelColl;
    private isImportRules;
    private filterIndex;
    private parser;
    private defaultLocale;
    private l10n;
    private intl;
    private items;
    private customOperators;
    private operators;
    private operatorValue;
    private ruleElem;
    private groupElem;
    private dataColl;
    private dataManager;
    /**
     * Triggers when the component is created.
     * @event
     */
    created: EmitType<Object>;
    /**
     * Triggers before the condition (And/Or) is changed.
     * @event
     */
    beforeConditionChange: EmitType<Object>;
    /**
     * Triggers before the field is changed.
     * @event
     */
    beforeFieldChange: EmitType<Object>;
    /**
     * Triggers before the operator is changed. (e.g., equal, less etc.).
     * @event
     */
    beforeOperatorChange: EmitType<Object>;
    /**
     * Triggers before the value is changed.
     * @event
     */
    beforeValueChange: EmitType<Object>;
    /**
     * Triggers when changing the condition(AND/OR) in button group.
     * @event
     */
    conditionChanged: EmitType<Object>;
    /**
     * Triggers when changing the fields using the drop-down list.
     * @event
     */
    fieldChanged: EmitType<Object>;
    /**
     * Triggers when changing the rule value.
     * @event
     */
    valueChanged: EmitType<Object>;
    /**
     * Triggers when changing the operator value.
     * @event
     */
    operatorChanged: EmitType<Object>;
    /**
     * Triggers when deleting a group.
     * @event
     */
    groupDelete: EmitType<Object>;
    /**
     * Triggers when deleting the rule.
     * @event
     */
    ruleDelete: EmitType<Object>;
    /**
     * Triggers when adding a Group.
     * @event
     */
    groupInsert: EmitType<Object>;
    /**
     * Triggers when adding the rule.
     * @event
     */
    ruleInsert: EmitType<Object>;
    /**
     * Specifies the showButtons settings of the query builder component.
     * The showButtons can be enable Enables or disables the ruleDelete, groupInsert, and groupDelete buttons.
     * @default { ruleDelete: true , groupInsert: true, groupDelete: true }
     */
    showButtons: ShowButtonsModel;
    /**
     * Shows or hides the filtered query.
     * @default false
     */
    summaryView: boolean;
    /**
     * Enables or disables the validation.
     * @default false
     */
    allowValidation: boolean;
    /**
     * Specifies columns to create filters.
     * @default {}
     */
    columns: ColumnsModel[];
    /**
     * Defines class or multiple classes, which are separated by a space in the QueryBuilder element.
     * You can add custom styles to the QueryBuilder using the cssClass property.
     * @default ''
     */
    cssClass: string;
    /**
     * Binds the column name from data source in query-builder.
     * The `dataSource` is an array of JavaScript objects.
     * @default []
     */
    dataSource: Object[] | Object | DataManager;
    /**
     * Specifies the displayMode as Horizontal or Vertical.
     * @default 'Horizontal'
     */
    displayMode: DisplayMode;
    /**
     * Enables or disables the RTL support it is extended from the component class.
     * @default false.
     */
    enableRtl: boolean;
    /**
     * Enable or disable persisting component's state between page reloads.
     * If enabled, filter states will be persisted.
     * @default false.
     */
    enablePersistence: boolean;
    /**
     * Specifies the sort direction of the field names.
     * @default 'Default'
     */
    sortDirection: SortDirection;
    /**
     * Specifies the maximum group count or restricts the group count.
     * @default 5
     */
    maxGroupCount: number;
    /**
     * Specifies the height of the query builder.
     * @default 'auto'
     */
    height: string;
    /**
     * Specifies the width of the query builder.
     * @default 'auto'
     */
    width: string;
    /**
     * Defines rules in the QueryBuilder.
     * Specifies the initial rule, which is JSON data.
     * @default {}
     */
    rule: RuleModel;
    constructor(options?: QueryBuilderModel, element?: string | HTMLDivElement);
    protected getPersistData(): string;
    /**
     * Clears the rules without root rule.
     * @returns void.
     */
    reset(): void;
    private getWrapper;
    protected getModuleName(): string;
    private initialize;
    private clickEventHandler;
    private selectBtn;
    private addRuleElement;
    private renderToolTip;
    /**
     * Validate the conditions and it display errors for invalid fields.
     * @returns boolean.
     */
    validateFields(): boolean;
    private groupTemplate;
    private ruleTemplate;
    private addGroupElement;
    notifyChange(value: string | number | boolean | Date | string[] | number[] | Date[], element: Element): void;
    private changeValue;
    private changeField;
    private changeRule;
    private destroyControls;
    private templateDestroy;
    private getDistinctValues;
    private renderMultiSelect;
    private processTemplate;
    private renderStringValue;
    private renderNumberValue;
    private processValueString;
    private renderControls;
    private renderValues;
    private updateValues;
    private updateRules;
    private ruleValueUpdate;
    private validatValue;
    private findGroupByIdx;
    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also it maintains the initial input element from the DOM.
     * @method destroy
     * @return {void}
     */
    destroy(): void;
    /**
     * Adds single or multiple rules.
     * @returns void.
     */
    addRules(rule: RulesModel[], groupID: string): void;
    /**
     * Adds single or multiple groups, which contains the collection of rules.
     * @returns void.
     */
    addGroups(groups: RuleModel[], groupID: string): void;
    private initWrapper;
    private renderSummary;
    private renderSummaryCollapse;
    private columnSort;
    onPropertyChanged(newProp: QueryBuilderModel, oldProp: QueryBuilderModel): void;
    protected preRender(): void;
    protected render(): void;
    private executeDataManager;
    private initControl;
    protected wireEvents(): void;
    protected unWireEvents(): void;
    private getGroup;
    private deleteGroup;
    private deleteRule;
    private setGroupRules;
    /**
     * Set the rule or rules collection.
     * @returns void.
     */
    setRules(rule: RuleModel): void;
    /**
     * Gets the rule or rule collection.
     * @returns object.
     */
    getRules(): RuleModel;
    /**
     * Deletes the group or groups based on the group ID.
     * @returns void.
     */
    deleteGroups(groupID: string[]): void;
    /**
     * Gets the predicate from collection of rules.
     * @returns object.
     */
    getFilteredRecords(): object[];
    /**
     * Deletes the rule or rules based on the rule ID.
     * @returns void.
     */
    deleteRules(ruleID: string[]): void;
    /**
     * Gets the query for Data Manager.
     * @returns string.
     */
    getDataManagerQuery(rule: RuleModel): Query;
    /**
     * Get the predicate from collection of rules.
     * @returns null
     */
    getPredicate(rule: RuleModel): Predicate;
    private getColumn;
    private arrayPredicate;
    private importRules;
    private renderGroup;
    private renderRule;
    private getSqlString;
    /**
     * Sets the rules from the sql query.
     */
    setRulesFromSql(sqlString: string): void;
    /**
     * Get the rules from SQL query.
     * @returns object.
     */
    getRulesFromSql(sqlString: string): RuleModel;
    /**
     * Gets the sql query from rules.
     * @returns object.
     */
    getSqlFromRules(rule: RuleModel): string;
    private sqlParser;
    private parseSqlStrings;
    private getOperator;
    private processParser;
}
export interface Level {
    [key: string]: number[];
}
export interface TemplateColumn {
    /**
     * Creates the custom component.
     * @default null
     */
    create?: Element | Function | string;
    /**
     * Wire events for the custom component.
     * @default null
     */
    write?: void | Function | string;
    /**
     * Destroy the custom component.
     * @default null
     */
    destroy?: Function | string;
}
export interface Validation {
    /**
     * Specifies the minimum value in textbox validation.
     * @default 2
     */
    min?: number;
    /**
     * Specifies the maximum value in textbox validation.
     * @default 10
     */
    max?: number;
    /**
     * Specifies whether the value is required or not
     * @default true
     */
    isRequired: boolean;
}
