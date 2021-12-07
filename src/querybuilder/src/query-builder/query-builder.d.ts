/**
 * Query Builder Source
 */
import { Component, INotifyPropertyChanged } from '@syncfusion/ej2-base';
import { ChildProperty } from '@syncfusion/ej2-base';
import { QueryBuilderModel, ShowButtonsModel, ColumnsModel, RuleModel, ValueModel } from './query-builder-model';
import { RadioButtonModel } from '@syncfusion/ej2-buttons';
import { DropDownTreeModel } from '@syncfusion/ej2-dropdowns';
import { MultiSelectModel, DropDownListModel } from '@syncfusion/ej2-dropdowns';
import { EmitType, BaseEventArgs } from '@syncfusion/ej2-base';
import { Query, Predicate, DataManager } from '@syncfusion/ej2-data';
import { TextBoxModel, NumericTextBoxModel } from '@syncfusion/ej2-inputs';
import { DatePickerModel } from '@syncfusion/ej2-calendars';
/**
 * Defines the Columns of Query Builder
 */
export declare class Columns extends ChildProperty<Columns> {
    /**
     * Specifies the fields in columns.
     *
     * @default null
     */
    field: string;
    /**
     * Specifies the labels name in columns.
     *
     * @default null
     */
    label: string;
    /**
     * Specifies the types in columns field.
     *
     * @default null
     */
    type: string;
    /**
     * Specifies the values in columns or bind the values from sub controls.
     *
     * @default null
     */
    values: string[] | number[] | boolean[];
    /**
     * Specifies the operators in columns.
     *
     * @default null
     */
    operators: {
        [key: string]: Object;
    }[];
    /**
     * Specifies the rule template for the field with any other widgets.
     *
     * @default null
     */
    ruleTemplate: string;
    /**
     * Specifies the template for value field such as slider or any other widgets.
     *
     * @default null
     */
    template: TemplateColumn | string;
    /**
     * Specifies the validation for columns (text, number and date).
     *
     * @default  { isRequired: true , min: 0, max: Number.MAX_VALUE }
     */
    validation: Validation;
    /**
     * Specifies the date format for columns.
     *
     * @aspType string
     * @blazorType string
     * @default null
     */
    format: string | FormatObject;
    /**
     * Specifies the step value(numeric textbox) for columns.
     *
     * @default null
     */
    step: number;
    /**
     * Specifies the default value for columns.
     *
     * @default null
     */
    value: string[] | number[] | string | number | boolean | Date;
    /**
     * Specifies the category for columns.
     *
     * @default null
     */
    category: string;
    /**
     * Specifies the sub fields in columns.
     *
     * @default null
     *
     */
    columns: ColumnsModel[];
}
/**
 * Defines the rule of Query Builder
 */
export declare class Rule extends ChildProperty<Rule> {
    /**
     * Specifies the condition value in group.
     *
     * @default null
     */
    condition: string;
    /**
     * Specifies the rules in group.
     *
     * @default []
     */
    rules: RuleModel[];
    /**
     * Specifies the field value in group.
     *
     * @default null
     */
    field: string;
    /**
     * Specifies the label value in group.
     *
     * @default null
     */
    label: string;
    /**
     * Specifies the type value in group.
     *
     * @default null
     */
    type: string;
    /**
     * Specifies the operator value in group.
     *
     * @default null
     */
    operator: string;
    /**
     * Specifies the sub controls value in group.
     *
     * @default null
     */
    value: string[] | number[] | string | number | boolean;
    /**
     * Specifies whether not condition is true/false.
     *
     * @default false
     */
    not: boolean;
}
/**
 * Defines the property for value.
 */
export declare class Value extends ChildProperty<Value> {
    /**
     * Specifies the property for NumericTextBox value.
     *
     * @default null
     */
    numericTextBoxModel: NumericTextBoxModel;
    /**
     * Specifies the property for MultiSelect value.
     *
     * @default null
     */
    multiSelectModel: MultiSelectModel;
    /**
     *  Specifies the property for DatePicker value.
     *
     * @default null
     */
    datePickerModel: DatePickerModel;
    /**
     *  Specifies the TextBox value.
     *
     * @default null
     */
    textBoxModel: TextBoxModel;
    /**
     * Specifies the RadioButton value.
     *
     * @default null
     */
    radioButtonModel: RadioButtonModel;
}
/**
 * Defines the ruleDelete, groupInsert, and groupDelete options of Query Builder.
 */
export declare class ShowButtons extends ChildProperty<ShowButtons> {
    /**
     * Specifies the boolean value in ruleDelete that the enable/disable the buttons in rule.
     *
     * @default true
     */
    ruleDelete: boolean;
    /**
     * Specifies the boolean value in groupInsert that the enable/disable the buttons in group.
     *
     * @default true
     */
    groupInsert: boolean;
    /**
     * Specifies the boolean value in groupDelete that the enable/disable the buttons in group.
     *
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
 * Specifies the fieldMode as DropDownList or DropDownTree.
 */
export declare type FieldMode = 
/** Display the DropdownList */
'Default' | 
/** Display the DropdownTree */
'DropdownTree';
/**
 * Specifies the displayMode as Horizontal or Vertical.
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
    private subFilterCounter;
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
    private selectedColumn;
    private previousColumn;
    private actionButton;
    private isInitialLoad;
    private timer;
    private isReadonly;
    private fields;
    private columnTemplateFn;
    private target;
    private updatedRule;
    private ruleTemplateFn;
    private isLocale;
    private isRefreshed;
    private headerFn;
    private subFieldElem;
    private selectedRule;
    private isNotified;
    private isAddSuccess;
    private isNotValueChange;
    private isRoot;
    /**
     * Triggers when the component is created.
     *
     * @event created
     * @blazorProperty 'Created'
     */
    created: EmitType<Event>;
    /**
     * Triggers when field, operator, value is change.
     *
     * @event actionBegin
     * @blazorProperty 'OnActionBegin'
     */
    actionBegin: EmitType<ActionEventArgs>;
    /**
     * Triggers before the condition (And/Or), field, operator, value is changed.
     *
     * @event beforeChange
     * @blazorProperty 'OnValueChange'
     */
    beforeChange: EmitType<ChangeEventArgs>;
    /**
     * Triggers when changing the condition(AND/OR), field, value, operator is changed.
     *
     * @event change
     * @blazorProperty 'Changed'
     */
    change: EmitType<ChangeEventArgs>;
    /**
     * Triggers when dataBound to the Query Builder.
     *
     * @event dataBound
     * @blazorProperty 'dataBound'
     */
    dataBound: EmitType<Object>;
    /**
     * Triggers when changing the condition(AND/OR), field, value, operator is changed
     *
     * @event ruleChange
     * @blazorProperty 'RuleChanged'
     */
    ruleChange: EmitType<RuleChangeEventArgs>;
    /**
     * Specifies the showButtons settings of the query builder component.
     * The showButtons can be enable Enables or disables the ruleDelete, groupInsert, and groupDelete buttons.
     *
     * @default { ruleDelete: true , groupInsert: true, groupDelete: true }
     */
    showButtons: ShowButtonsModel;
    /**
     * Shows or hides the filtered query.
     *
     * @default false
     */
    summaryView: boolean;
    /**
     * Enables or disables the validation.
     *
     * @default false
     */
    allowValidation: boolean;
    /**
     * Specifies the fieldMode as DropDownList or DropDownTree.
     *
     * @default 'Default'
     */
    fieldMode: FieldMode;
    /**
     * Specifies columns to create filters.
     *
     * @default {}
     */
    columns: ColumnsModel[];
    /**
     * Specifies the property for field.
     *
     *  @default null
     */
    fieldModel: DropDownListModel | DropDownTreeModel;
    /**
     * Specifies the property for operator.
     *
     *  @default null
     */
    operatorModel: DropDownListModel;
    /**
     * Specifies the property for value.
     *
     * @default null
     */
    valueModel: ValueModel;
    /**
     * Specifies the template for the header with any other widgets.
     *
     * @default null
     */
    headerTemplate: string;
    /**
     * Defines class or multiple classes, which are separated by a space in the QueryBuilder element.
     * You can add custom styles to the QueryBuilder using the cssClass property.
     *
     * @default ''
     */
    cssClass: string;
    /**
     * Binds the column name from data source in query-builder.
     * The `dataSource` is an array of JavaScript objects.
     *
     * @default []
     */
    dataSource: Object[] | Object | DataManager;
    /**
     * Specifies the displayMode as Horizontal or Vertical.
     *
     * @default 'Horizontal'
     */
    displayMode: DisplayMode;
    /**
     * Enable or disable persisting component's state between page reloads.
     * If enabled, filter states will be persisted.
     *
     * @default false.
     */
    enablePersistence: boolean;
    /**
     * Specifies the sort direction of the field names.
     *
     * @default 'Default'
     */
    sortDirection: SortDirection;
    /**
     * Specifies the maximum group count or restricts the group count.
     *
     * @default 5
     */
    maxGroupCount: number;
    /**
     * Specifies the height of the query builder.
     *
     * @default 'auto'
     */
    height: string;
    /**
     * Specifies the width of the query builder.
     *
     * @default 'auto'
     */
    width: string;
    /**
     * If match case is set to true, the grid filters the records with exact match.
     * if false, it filters case insensitive records (uppercase and lowercase letters treated the same).
     *
     * @default false
     */
    matchCase: boolean;
    /**
     * If immediateModeDelay is set by particular number, the rule Change event is triggered after that period.
     *
     * @default 0
     */
    immediateModeDelay: number;
    /**
     * Enables/Disables the not group condition in query builder.
     *
     * @default false
     */
    enableNotCondition: boolean;
    /**
     * When set to true, the user interactions on the component are disabled.
     *
     * @default false
     */
    readonly: boolean;
    /**
     * Specifies the separator string for column.
     *
     * @default ''
     */
    separator: string;
    /**
     * Defines rules in the QueryBuilder.
     * Specifies the initial rule, which is JSON data.
     *
     * @default {}
     */
    rule: RuleModel;
    constructor(options?: QueryBuilderModel, element?: string | HTMLDivElement);
    protected getPersistData(): string;
    /**
     * Clears the rules without root rule.
     *
     * @returns {void}.
     */
    reset(): void;
    private getWrapper;
    protected getModuleName(): string;
    private GetRootColumnName;
    private initialize;
    private updateSubFieldsFromColumns;
    private updateSubFields;
    private updateCustomOperator;
    private focusEventHandler;
    private clickEventHandler;
    private beforeSuccessCallBack;
    private selectBtn;
    private appendRuleElem;
    private addRuleElement;
    private addRuleSuccessCallBack;
    private updateAddedRule;
    private changeRuleTemplate;
    private renderToolTip;
    /**
     * Validate the conditions and it display errors for invalid fields.
     *
     * @returns {boolean} - Validation
     */
    validateFields(): boolean;
    private refreshLevelColl;
    private refreshLevel;
    private groupTemplate;
    private ruleTemplate;
    private addGroupElement;
    private addGroupSuccess;
    private headerTemplateFn;
    /**
     * notify the changes to component.
     *
     * @param {string | number | boolean | Date | string[] | number[] | Date[]} value - 'value' to be passed to update the rule value.
     * @param {Element} element - 'element' to be passed to update the rule.
     * @param {string} type - 'type' to be passed to update the rule .
     * @returns {void}.
     */
    notifyChange(value: string | number | boolean | Date | string[] | number[] | Date[], element: Element, type?: string): void;
    private templateChange;
    private changeValue;
    private filterValue;
    private changeValueSuccessCallBack;
    private changeField;
    private changeRule;
    private changeFilter;
    private changeOperator;
    private fieldChangeSuccess;
    private destroySubFields;
    private createSubFields;
    private operatorChangeSuccess;
    private changeRuleValues;
    private popupOpen;
    private destroyControls;
    private templateDestroy;
    /**
     * return values bound to the column.
     *
     * @param {string} field - 'field' to be passed to get the field values.
     * @returns {object[]} - Values bound to the column
     */
    getValues(field: string): object[];
    private createNestedObject;
    private getDistinctValues;
    private renderMultiSelect;
    private multiSelectOpen;
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
    private processBoolValues;
    private getOperatorIndex;
    private getPreviousItemData;
    private renderValues;
    private setColumnTemplate;
    private actionBeginSuccessCallBack;
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
     *
     * @method destroy
     * @returns {void}
     */
    destroy(): void;
    /**
     * Adds single or multiple rules.
     *
     * @param {RuleModel[]} rule - 'rule collection' to be passed to add the rules.
     * @param {string} groupID - 'group id' to be passed to add the rule in groups.
     * @returns {void}.
     */
    addRules(rule: RuleModel[], groupID: string): void;
    /**
     * Adds single or multiple groups, which contains the collection of rules.
     *
     * @param {RuleModel[]} groups - 'group collection' to be passed to add the groups.
     * @param {string} groupID - 'group id' to be passed to add the groups.
     * @returns {void}.
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
    private templateParser;
    private executeDataManager;
    private initControl;
    protected wireEvents(): void;
    protected unWireEvents(): void;
    private getParentGroup;
    /**
     * Delete the Group
     *
     * @param {Element | string} target - 'target' to be passed to delete the group.
     * @returns {void}
     */
    deleteGroup(target: Element | string): void;
    private deleteGroupSuccessCallBack;
    private isPlatformTemplate;
    private deleteRule;
    private deleteRuleSuccessCallBack;
    private setGroupRules;
    private keyBoardHandler;
    private clearQBTemplate;
    private disableRuleCondition;
    /**
     * Get the valid rule or rules collection.
     *
     * @param {RuleModel} currentRule - 'currentRule' to be passed to get the valid rules.
     * @returns {RuleModel} - Valid rule or rules collection
     */
    getValidRules(currentRule?: RuleModel): RuleModel;
    private getRuleCollection;
    /**
     * Set the rule or rules collection.
     *
     * @param {RuleModel} rule - 'rule' to be passed to set rules.
     * @returns {void}.
     */
    setRules(rule: RuleModel): void;
    /**
     * Gets the rule or rule collection.
     *
     * @returns {object} - Rule or rule collection
     */
    getRules(): RuleModel;
    /**
     * Gets the rule.
     *
     * @param {string | HTMLElement} elem - 'elem' to be passed to get rule.
     * @returns {object} - Rule
     */
    getRule(elem: string | HTMLElement): RuleModel;
    /**
     * Gets the group.
     *
     * @param {string | Element} target - 'target' to be passed to get group.
     * @returns {object} -Group
     */
    getGroup(target: Element | string): RuleModel;
    /**
     * Deletes the group or groups based on the group ID.
     *
     * @param {string[]} groupIdColl - 'groupIdColl' to be passed to delete groups.
     * @returns {void}
     */
    deleteGroups(groupIdColl: string[]): void;
    /**
     * return the Query from current rules collection.
     *
     * @returns {Promise} - Query from current rules collection
     * @blazorType object
     */
    getFilteredRecords(): Promise<Object> | object;
    /**
     * Deletes the rule or rules based on the rule ID.
     *
     * @param {string[]} ruleIdColl - 'ruleIdColl' to be passed to delete rules.
     * @returns {void}.
     */
    deleteRules(ruleIdColl: string[]): void;
    /**
     * Gets the query for Data Manager.
     *
     * @param {RuleModel} rule - 'rule' to be passed to get query.
     * @returns {string} - Query for Data Manager
     */
    getDataManagerQuery(rule: RuleModel): Query;
    /**
     * Get the predicate from collection of rules.
     *
     * @param {RuleModel} rule - 'rule' to be passed to get predicate.
     * @returns {Predicate} - Predicate from collection of rules
     */
    getPredicate(rule: RuleModel): Predicate;
    private getLocale;
    private getColumn;
    /**
     * return the operator bound to the column.
     *
     * @returns {[key: string]: Object}[] - Operator bound to the column
     */
    getOperators(field: string): {
        [key: string]: Object;
    }[];
    private setTime;
    private datePredicate;
    private arrayPredicate;
    private getDate;
    private isTime;
    private importRules;
    private renderGroup;
    private renderRule;
    private enableReadonly;
    private enableBtnGroup;
    private isDateFunction;
    private getSqlString;
    /**
     * Sets the rules from the sql query.
     *
     * @param {string} sqlString - 'sql String' to be passed to set the rule.
     * @returns {void}
     */
    setRulesFromSql(sqlString: string): void;
    /**
     * Get the rules from SQL query.
     *
     * @param {string} sqlString - 'sql String' to be passed to get the rule.
     * @returns {object} - Rules from SQL query
     */
    getRulesFromSql(sqlString: string): RuleModel;
    /**
     * Gets the sql query from rules.
     *
     * @param {RuleModel} rule - 'rule' to be passed to get the sql.
     * @param {boolean} allowEscape - Set `true` if it exclude the escape character.
     * @returns {object} - Sql query from rules.
     */
    getSqlFromRules(rule?: RuleModel, allowEscape?: boolean): string;
    private sqlParser;
    private parseSqlStrings;
    private checkLiteral;
    private getOperator;
    private getTypeFromColumn;
    private processParser;
}
export interface Level {
    [key: string]: number[];
}
/**
 * Creates the custom component of Query Builder
 */
export interface TemplateColumn {
    /**
     * Creates the custom component.
     *
     * @default null
     */
    create?: Element | Function | string;
    /**
     * Wire events for the custom component.
     *
     * @default null
     */
    write?: void | Function | string;
    /**
     * Destroy the custom component.
     *
     * @default null
     */
    destroy?: Function | string;
}
/**
 * Defines the validation of Query Builder.
 */
export interface Validation {
    /**
     * Specifies the minimum value in textbox validation.
     *
     * @default 2
     */
    min?: number;
    /**
     * Specifies the maximum value in textbox validation.
     *
     * @default 10
     */
    max?: number;
    /**
     * Specifies whether the value is required or not
     *
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
    childGroupID?: string;
    value?: string | number | Date | boolean | string[];
    selectedIndex?: number;
    selectedField?: string;
    cancel?: boolean;
    type?: string;
    not?: boolean;
}
/**
 * Interface for rule change event arguments.
 */
export interface RuleChangeEventArgs extends BaseEventArgs {
    previousRule?: RuleModel;
    rule: RuleModel;
    type?: string;
}
/**
 * Interface for action begin and action complete event args
 */
export interface ActionEventArgs extends BaseEventArgs {
    ruleID: string;
    requestType?: string;
    action?: string;
    rule?: RuleModel;
    fields?: Object;
    columns?: ColumnsModel[];
    operators?: {
        [key: string]: Object;
    }[];
    operatorFields?: Object;
    field?: string;
    operator?: string;
    condition?: string;
    notCondition?: boolean;
    renderTemplate?: boolean;
}
