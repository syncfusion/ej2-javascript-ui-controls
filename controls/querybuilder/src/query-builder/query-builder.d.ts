/**
 * Query Builder Source
 */
import { Component, INotifyPropertyChanged } from '@syncfusion/ej2-base';
import { ChildProperty } from '@syncfusion/ej2-base';
import { QueryBuilderModel, ShowButtonsModel, ColumnsModel, RuleModel } from './query-builder-model';
import { EmitType, BaseEventArgs } from '@syncfusion/ej2-base';
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
    values: string[] | number[] | boolean[];
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
    format: string | FormatObject;
    /**
     * Specifies the step value(numeric textbox) for columns.
     * @default null
     */
    step: number;
    /**
     * Specifies the default value for columns.
     * @default null
     */
    value: string[] | number[] | string | number | boolean | Date;
    /**
     * Specifies the category for columns.
     * @default null
     */
    category: string;
}
export declare class Rule extends ChildProperty<Rule> {
    /**
     * Specifies the condition value in group.
     * @default null
     */
    condition: string;
    /**
     * Specifies the rules in group.
     * @default []
     */
    rules: RuleModel[];
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
    value: string[] | number[] | string | number | boolean;
    /**
     * Specifies whether not condition is true/false.
     * @default false
     */
    not: boolean;
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
export interface FormatObject {
    /**
     * Specifies the format in which the date format will process
     */
    skeleton?: string;
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
    private isPublic;
    private parser;
    private defaultLocale;
    private l10n;
    private intl;
    private items;
    private customOperators;
    private operators;
    private ruleElem;
    private groupElem;
    private dataColl;
    private dataManager;
    private fields;
    private selectedColumn;
    private actionButton;
    private isInitialLoad;
    private timer;
    /**
     * Triggers when the component is created.
     * @event
     * @blazorProperty 'Created'
     */
    created: EmitType<Event>;
    /**
     * Triggers before the condition (And/Or), field, operator, value is changed.
     * @event
     * @blazorProperty 'OnValueChange'
     */
    beforeChange: EmitType<ChangeEventArgs>;
    /**
     * Triggers when changing the condition(AND/OR), field, value, operator is changed
     * @event
     * @blazorProperty 'Changed'
     */
    change: EmitType<ChangeEventArgs>;
    /**
     * Triggers when changing the condition(AND/OR), field, value, operator is changed
     * @event
     * @blazorProperty 'RuleChanged'
     */
    ruleChange: EmitType<RuleChangeEventArgs>;
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
     * If match case is set to true, the grid filters the records with exact match.
     * if false, it filters case insensitive records (uppercase and lowercase letters treated the same).
     * @default false
     */
    matchCase: boolean;
    /**
     * If immediateModeDelay is set by particular number, the rule Change event is triggered after that period.
     * @default 0
     */
    immediateModeDelay: number;
    /**
     * Enables/Disables the not group condition in query builder.
     * @default false
     */
    enableNotCondition: boolean;
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
    private beforeSuccessCallBack;
    private selectBtn;
    private addRuleElement;
    private addRuleSuccessCallBack;
    private renderToolTip;
    /**
     * Validate the conditions and it display errors for invalid fields.
     * @returns boolean.
     */
    validateFields(): boolean;
    private refreshLevelColl;
    private refreshLevel;
    private groupTemplate;
    private ruleTemplate;
    private addGroupElement;
    private addGroupSuccess;
    notifyChange(value: string | number | boolean | Date | string[] | number[] | Date[], element: Element): void;
    private changeValue;
    private filterValue;
    private changeValueSuccessCallBack;
    private changeField;
    private changeRule;
    private changeFilter;
    private changeOperator;
    private fieldChangeSuccess;
    private operatorChangeSuccess;
    private changeRuleValues;
    private destroyControls;
    private templateDestroy;
    private getDistinctValues;
    private renderMultiSelect;
    private multiSelectOpen;
    private bindBlazorMultiSelectData;
    private bindMultiSelectData;
    private getMultiSelectData;
    private createSpinner;
    private closePopup;
    private processTemplate;
    private getItemData;
    private setDefaultValue;
    private renderStringValue;
    private renderNumberValue;
    private processValueString;
    private parseDate;
    private renderControls;
    private getOperatorIndex;
    private renderValues;
    private updateValues;
    private updateRules;
    private filterRules;
    private ruleValueUpdate;
    private validatValue;
    private getFormat;
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
    addRules(rule: RuleModel[], groupID: string): void;
    /**
     * Adds single or multiple groups, which contains the collection of rules.
     * @returns void.
     */
    addGroups(groups: RuleModel[], groupID: string): void;
    private initWrapper;
    private renderSummary;
    private renderSummaryCollapse;
    private columnSort;
    private onChangeNotGroup;
    private notGroupRtl;
    private checkNotGroup;
    onPropertyChanged(newProp: QueryBuilderModel, oldProp: QueryBuilderModel): void;
    protected preRender(): void;
    protected render(): void;
    private executeDataManager;
    private initControl;
    protected wireEvents(): void;
    protected unWireEvents(): void;
    private getParentGroup;
    private deleteGroup;
    private deleteGroupSuccessCallBack;
    private deleteRule;
    private deleteRuleSuccessCallBack;
    private setGroupRules;
    private disableRuleCondition;
    /**
     * return the valid rule or rules collection.
     * @returns RuleModel.
     */
    getValidRules(currentRule: RuleModel): RuleModel;
    private getRuleCollection;
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
     * Gets the rule.
     * @returns object.
     */
    getRule(elem: string | HTMLElement): RuleModel;
    /**
     * Gets the group.
     * @returns object.
     */
    getGroup(target: Element | string): RuleModel;
    /**
     * Deletes the group or groups based on the group ID.
     * @returns void.
     */
    deleteGroups(groupIdColl: string[]): void;
    /**
     * return the Query from current rules collection.
     * @returns Promise.
     * @blazorType object
     */
    getFilteredRecords(): Promise<Object> | object;
    /**
     * Deletes the rule or rules based on the rule ID.
     * @returns void.
     */
    deleteRules(ruleIdColl: string[]): void;
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
    private getLocale;
    private getColumn;
    private datePredicate;
    private arrayPredicate;
    private getDate;
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
    getSqlFromRules(rule: RuleModel, allowEscape?: boolean): string;
    private sqlParser;
    private parseSqlStrings;
    private getOperator;
    private getTypeFromColumn;
    private processParser;
    private isBlazor;
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
/**
 * Interface for change event.
 */
export interface ChangeEventArgs extends BaseEventArgs {
    groupID: string;
    ruleID?: string;
    value?: string | number | Date | boolean | string[];
    selectedIndex?: number;
    selectedField?: string;
    cancel?: boolean;
    type?: string;
    not?: boolean;
}
export interface RuleChangeEventArgs extends BaseEventArgs {
    previousRule?: RuleModel;
    rule: RuleModel;
    type?: string;
}
