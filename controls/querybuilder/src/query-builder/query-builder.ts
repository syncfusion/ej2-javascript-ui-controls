/**
 * Query Builder Source
 */
import { Component, INotifyPropertyChanged, NotifyPropertyChanges, getComponent, MouseEventArgs, Browser, compile, append } from '@syncfusion/ej2-base';
import { Property, ChildProperty, Complex, L10n, closest, extend, isNullOrUndefined, Collection, cldrData } from '@syncfusion/ej2-base';
import { getInstance, addClass, removeClass, rippleEffect, detach, classList } from '@syncfusion/ej2-base';
import { Internationalization, DateFormatOptions, KeyboardEventArgs, getUniqueID, select } from '@syncfusion/ej2-base';
import { QueryBuilderModel, ShowButtonsModel, ColumnsModel, RuleModel, ValueModel } from './query-builder-model';
import { Button, CheckBox, RadioButton, ChangeEventArgs as ButtonChangeEventArgs, RadioButtonModel } from '@syncfusion/ej2-buttons';
import { DropDownList, ChangeEventArgs as DropDownChangeEventArgs, FieldSettingsModel, CheckBoxSelection, DropDownTreeModel, DropDownTree } from '@syncfusion/ej2-dropdowns';
import { MultiSelect, MultiSelectChangeEventArgs, PopupEventArgs, MultiSelectModel, DropDownListModel } from '@syncfusion/ej2-dropdowns';
import { EmitType, Event, EventHandler, getValue, Animation, BaseEventArgs } from '@syncfusion/ej2-base';
import { Query, Predicate, DataManager, Deferred } from '@syncfusion/ej2-data';
import { TextBox, NumericTextBox, InputEventArgs, ChangeEventArgs as InputChangeEventArgs } from '@syncfusion/ej2-inputs';
import { TextBoxModel, NumericTextBoxModel } from '@syncfusion/ej2-inputs';
import { DatePicker, ChangeEventArgs as CalendarChangeEventArgs, DatePickerModel } from '@syncfusion/ej2-calendars';
import { DropDownButton, ItemModel, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { Tooltip, createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { compile as templateCompiler } from '@syncfusion/ej2-base';

 type ReturnType = { result: Object[], count: number, aggregates?: Object };
 type ruleObj = { condition: string, not: boolean };

/**
 * Defines the Columns of Query Builder
 */
export class Columns extends ChildProperty<Columns> {
    /**
     * Specifies the fields in columns.
     *
     * @default null
     */
    @Property(null)
    public field: string;
    /**
     * Specifies the labels name in columns.
     *
     * @default null
     */
    @Property(null)
    public label: string;
    /**
     * Specifies the types in columns field.
     *
     * @default null
     */
    @Property(null)
    public type: string;
    /**
     * Specifies the values in columns or bind the values from sub controls.
     *
     * @default null
     */
    @Property(null)
    public values: string[] | number[] | boolean[];
    /**
     * Specifies the operators in columns.
     *
     * @default null
     */
    @Property(null)
    public operators: { [key: string]: Object }[];
    /**
     * Specifies the rule template for the field with any other widgets.
     *
     * @default null
     * @aspType string
     */
    @Property()
    public ruleTemplate: string | Function;

    /**
     * Specifies the template for value field such as slider or any other widgets.
     *
     * @default null
     * @aspType string
     */
    @Property(null)
    public template: TemplateColumn | string | Function;
    /**
     * Specifies the validation for columns (text, number and date).
     *
     * @default  { isRequired: true , min: 0, max: Number.MAX_VALUE }
     */
    @Property({ isRequired: true , min: 0, max: Number.MAX_VALUE })
    public validation: Validation;
    /**
     * Specifies the date format for columns.
     *
     * @aspType string
     * @blazorType string
     * @default null
     */
    @Property(null)
    public format: string | FormatObject;
    /**
     * Specifies the step value(numeric textbox) for columns.
     *
     * @default null
     */
    @Property(null)
    public step: number;
    /**
     * Specifies the default value for columns.
     *
     * @default null
     */
    @Property(null)
    public value:  string[] | number[] | string | number | boolean | Date;
    /**
     * Specifies the category for columns.
     *
     * @default null
     */
    @Property(null)
    public category: string;
    /**
     * Specifies the sub fields in columns.
     *
     * @default null
     *
     */
    @Property(null)
    public columns: ColumnsModel[];
}
/**
 * Defines the rule of Query Builder
 */
export class Rule extends ChildProperty<Rule> {
    /**
     * Specifies the condition value in group.
     *
     * @default null
     */
    @Property(null)
    public condition: string;
    /**
     * Specifies the rules in group.
     *
     * @default []
     */
    @Collection<RuleModel>([], Rule)
    public rules: RuleModel[];
    /**
     * Specifies the field value in group.
     *
     * @default null
     */
    @Property(null)
    public field: string;
    /**
     * Specifies the label value in group.
     *
     * @default null
     */
    @Property(null)
    public label: string;
    /**
     * Specifies the type value in group.
     *
     * @default null
     */
    @Property(null)
    public type: string;
    /**
     * Specifies the operator value in group.
     *
     * @default null
     */
    @Property(null)
    public operator: string;
    /**
     * Specifies the sub controls value in group.
     *
     * @default null
     */
    @Property(null)
    public value: string[] | number[] | string | number | boolean;
    /**
     * Specifies whether not condition is true/false.
     *
     * @default false
     */
    @Property(false)
    public not: boolean;
}
/**
 * Defines the property for value.
 */
export class Value extends ChildProperty <Value> {
    /**
     * Specifies the property for NumericTextBox value.
     *
     * @default null
     */
    @Property(null)
    public numericTextBoxModel: NumericTextBoxModel;
    /**
     * Specifies the property for MultiSelect value.
     *
     * @default null
     */
    @Property(null)
    public multiSelectModel: MultiSelectModel;
    /**
     *  Specifies the property for DatePicker value.
     *
     * @default null
     */
    @Property(null)
    public datePickerModel: DatePickerModel;
    /**
     *  Specifies the TextBox value.
     *
     * @default null
     */
    @Property(null)
    public textBoxModel: TextBoxModel;
    /**
     * Specifies the RadioButton value.
     *
     * @default null
     */
    @Property(null)
    public radioButtonModel: RadioButtonModel;
}
/**
 * Defines the ruleDelete, groupInsert, and groupDelete options of Query Builder.
 */
export class ShowButtons extends ChildProperty<ShowButtons> {
    /**
     * Specifies the boolean value in ruleDelete that the enable/disable the buttons in rule.
     *
     * @default true
     */
    @Property(true)
    public ruleDelete: boolean;
    /**
     * Specifies the boolean value in groupInsert that the enable/disable the buttons in group.
     *
     * @default true
     */
    @Property(true)
    public groupInsert: boolean;
    /**
     * Specifies the boolean value in groupDelete that the enable/disable the buttons in group.
     *
     * @default true
     */
    @Property(true)
    public groupDelete: boolean;
}
export interface FormatObject {
    /**
     * Specifies the format in which the date format will process
     */
    skeleton?: string;
}
/**
 * Defines the fieldMode of Dropdown control.
 * ```props
 * Default :- To Specifies the fieldMode as DropDownList.
 * DropdownTree :- To Specifies the fieldMode as DropdownTree.
 * ```
 */
export type FieldMode =
    /** Display the DropdownList */
    'Default' |
    /** Display the DropdownTree */
    'DropdownTree';
/**
 * Defines the display mode of the control.
 * ```props
 * Horizontal :- To display the control in a horizontal UI.
 * Vertical :- To display the control in a vertical UI.
 * ```
 */
export type DisplayMode =
    /**  Display the Horizontal UI */
    'Horizontal' |
    /**  Display the Vertical UI */
    'Vertical';
/**
 * Defines the sorting direction of the field names in a control.
 * ```props
 * Default :- Specifies the field names in default sorting order.
 * Ascending :- Specifies the field names in ascending order.
 * Descending :- Specifies the field names in descending order.
 * ```
 */
export type SortDirection =
    /**  Show the field names in default */
    'Default' |
    /**  Show the field names in Ascending */
    'Ascending' |
    /**  Show the field names in Descending */
    'Descending';

@NotifyPropertyChanges

export class QueryBuilder extends Component<HTMLDivElement> implements INotifyPropertyChanged {
    private groupIdCounter: number;
    private ruleIdCounter: number;
    private subFilterCounter: number;
    private btnGroupId: number;
    private levelColl: Level;
    private isImportRules: boolean;
    private isPublic: boolean;
    private parser: string[][];
    private defaultLocale: Object;
    private l10n: L10n;
    private intl: Internationalization;
    private items: ItemModel[];
    private customOperators: Object;
    private operators: Object;
    private sqlOperators: Object;
    private ruleElem: Element;
    private groupElem: Element;
    private dataColl: object[];
    private dataManager: DataManager;
    private selectedColumn: ColumnsModel;
    private previousColumn: ColumnsModel;
    private actionButton: Element;
    private isInitialLoad: boolean;
    private timer: number;
    private isReadonly: boolean = true;
    private fields: Object = { text: 'label', value: 'field' };
    private columnTemplateFn: Function;
    private target: Element;
    private updatedRule: ruleObj = { not: false, condition: 'and' };
    private ruleTemplateFn: Function;
    private isLocale: boolean = false;
    private isRefreshed: boolean = false;
    private headerFn: Function;
    private subFieldElem: HTMLElement;
    private selectedRule: RuleModel;
    private isNotified: boolean = false;
    private isAddSuccess: boolean = false;
    private isNotValueChange: boolean = false;
    private isRoot: boolean;
    private prevItemData: FieldSettingsModel;
    private isFieldChange: boolean = false;
    private isFieldClose: boolean = false;
    private isDestroy: boolean = false;
    private isGetNestedData: boolean = false;
    /**
     * Triggers when the component is created.
     *
     * @event created
     * @blazorProperty 'Created'
     */
    @Event()
    public created: EmitType<Event>;
    /**
     * Triggers when field, operator, value is change.
     *
     * @event actionBegin
     * @blazorProperty 'OnActionBegin'
     */
    @Event()
    public actionBegin: EmitType<ActionEventArgs>;
    /**
     * Triggers before the condition (And/Or), field, operator, value is changed.
     *
     * @event beforeChange
     * @blazorProperty 'OnValueChange'
     */
    @Event()
    public beforeChange: EmitType<ChangeEventArgs>;
    /**
     * Triggers when changing the condition(AND/OR), field, value, operator is changed.
     *
     * @event change
     * @blazorProperty 'Changed'
     */
    @Event()
    public change: EmitType<ChangeEventArgs>;
    /**
     * Triggers when dataBound to the Query Builder.
     *
     * @event dataBound
     * @blazorProperty 'dataBound'
     */
    @Event()
    public dataBound: EmitType<Object>;
    /**
     * Triggers when changing the condition(AND/OR), field, value, operator is changed
     *
     * @event ruleChange
     * @blazorProperty 'RuleChanged'
     */
    @Event()
    public ruleChange: EmitType<RuleChangeEventArgs>;
    /**
     * Specifies the showButtons settings of the query builder component.
     * The showButtons can be enable Enables or disables the ruleDelete, groupInsert, and groupDelete buttons.
     *
     * @default { ruleDelete: true , groupInsert: true, groupDelete: true }
     */
    @Property({ ruleDelete: true, groupInsert: true, groupDelete: true })
    public showButtons: ShowButtonsModel;
    /**
     * Shows or hides the filtered query.
     *
     * @default false
     */
    @Property(false)
    public summaryView: boolean;
    /**
     * Enables or disables the validation.
     *
     * @default false
     */
    @Property(false)
    public allowValidation: boolean;
    /**
     * Specifies the fieldMode as DropDownList or DropDownTree.
     *
     * @default 'Default'
     */
    @Property('Default')
    public fieldMode: FieldMode;
    /**
     * Specifies columns to create filters.
     *
     * @default {}
     */
    @Property([])
    public columns: ColumnsModel[];
    /**
     * Specifies the property for field.
     *
     *  @default null
     */
    @Property(null)
    public fieldModel: DropDownListModel | DropDownTreeModel;
    /**
     * Specifies the property for operator.
     *
     *  @default null
     */
    @Property(null)
    public operatorModel: DropDownListModel;
    /**
     * Specifies the property for value.
     *
     * @default null
     */
    @Property(null)
    public valueModel: ValueModel;
    /**
     * Specifies the template for the header with any other widgets.
     *
     * @default null
     * @aspType string
     */
    @Property()
    public headerTemplate: string | Function;
    /**
     * Defines class or multiple classes, which are separated by a space in the QueryBuilder element.
     * You can add custom styles to the QueryBuilder using the cssClass property.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;
    /**
     * Binds the column name from data source in query-builder.
     * The `dataSource` is an array of JavaScript objects.
     *
     * @default []
     */
    @Property([])
    public dataSource: Object[] | Object | DataManager;
    /**
     * Specifies the displayMode as Horizontal or Vertical.
     *
     * @default 'Horizontal'
     */
    @Property('Horizontal')
    public displayMode: DisplayMode;
    /**
     * Enable or disable persisting component's state between page reloads.
     * If enabled, filter states will be persisted.
     *
     * @default false.
     */
    @Property(false)
    public enablePersistence: boolean;
    /**
     * Specifies the sort direction of the field names.
     *
     * @default 'Default'
     */
    @Property('Default')
    public sortDirection: SortDirection;
    /**
     * Specifies the maximum group count or restricts the group count.
     *
     * @default 5
     */
    @Property(5)
    public maxGroupCount: number;
    /**
     * Specifies the height of the query builder.
     *
     * @default 'auto'
     */
    @Property('auto')
    public height: string;
    /**
     * Specifies the width of the query builder.
     *
     * @default 'auto'
     */
    @Property('auto')
    public width: string;
    /**
     * If match case is set to true, the grid filters the records with exact match.
     * if false, it filters case insensitive records (uppercase and lowercase letters treated the same).
     *
     * @default false
     */
    @Property(false)
    public matchCase: boolean;
    /**
     * If immediateModeDelay is set by particular number, the rule Change event is triggered after that period.
     *
     * @default 0
     */
    @Property(0)
    public immediateModeDelay: number;
    /**
     * Enables/Disables the not group condition in query builder.
     *
     * @default false
     */
    @Property(false)
    public enableNotCondition: boolean;
    /**
     * When set to true, the user interactions on the component are disabled.
     *
     * @default false
     */
    @Property(false)
    public readonly: boolean;
    /**
     * Specifies the separator string for column.
     *
     * @default ''
     */
    @Property('')
    public separator: string;
    /**
     * Defines rules in the QueryBuilder.
     * Specifies the initial rule, which is JSON data.
     *
     * @default {}
     */
    @Complex<RuleModel>({ condition: 'and', rules: [] }, Rule)
    public rule: RuleModel;

    constructor(options?: QueryBuilderModel, element?: string | HTMLDivElement) {
        super(options, <string | HTMLDivElement>element);
        MultiSelect.Inject(CheckBoxSelection);
    }

    protected getPersistData(): string {
        return this.addOnPersist(['rule']);
    }
    /**
     * Clears the rules without root rule.
     *
     * @returns {void}.
     */
    public reset(): void {
        this.isImportRules = false;
        let bodyElem: Element = this.element.querySelector('.e-group-body');
        const inputElement: NodeListOf<HTMLElement> = this.element.querySelectorAll('input.e-control') as NodeListOf<HTMLElement>;
        for (let i: number = 0, len: number = inputElement.length; i < len; i++) {
            if (inputElement[i as number].className.indexOf('e-tooltip') > -1) {
                (getComponent(inputElement[i as number], 'tooltip') as Tooltip).destroy();
            } else if (inputElement[i as number].parentElement.className.indexOf('e-tooltip') > -1) {
                (getComponent(inputElement[i as number].parentElement, 'tooltip') as Tooltip).destroy();
            }
        }
        if (bodyElem) {
            bodyElem.innerHTML = '';
        } else {
            const grpContainer: HTMLElement  = this.createElement('div', { attrs: { class: 'e-group-container' } });
            const grpHeader: HTMLElement = this.createElement('div', { attrs: { class: 'e-group-header' } });
            const grpBody: HTMLElement = this.createElement('div', { attrs: { class: 'e-group-body' } });
            grpContainer.appendChild(grpHeader).appendChild(grpBody);
            this.element.appendChild(grpContainer);
            bodyElem = this.element.querySelector('.e-group-body');
        }
        if (this.headerTemplate && this.isRoot) {
            this.element.innerHTML = '';
            this.isRoot = false;
        }
        if (this.enableNotCondition) {
            removeClass(this.element.querySelectorAll('.e-qb-toggle'), 'e-active-toggle');
        }
        bodyElem.appendChild(this.createElement('div', { attrs: { class: 'e-rule-list' } }));
        this.levelColl[this.element.id + '_group0'] = [0];
        this.rule = { condition: 'and', not: false, rules: [] };
        this.disableRuleCondition(bodyElem.parentElement);
    }
    private getWrapper(): Element {
        return this.element;
    }
    protected getModuleName(): string {
        return 'query-builder';
    }
    private GetRootColumnName(field: string): string {
        return this.separator ? field.split(this.separator)[0] : field;
    }
    private initialize(): void {
        if (this.dataColl.length) {
            const columnKeys: string[] = Object.keys(this.dataColl[0]);
            const cols: ColumnsModel[] = []; const categories: string[] = [];
            let type: string; let groupBy: boolean = false;
            let isDate: boolean = false; let value: string | number | boolean | Object;
            const validateObj: Validation = {isRequired: true, min: 0, max: Number.MAX_VALUE};
            if (this.columns.length) {
                this.columnSort();
                const columns: ColumnsModel[] = this.columns;
                for (let i: number = 0, len: number = columns.length; i < len; i++) {
                    this.updateCustomOperator(columns[i as number]);
                    if (!columns[i as number].type) {
                        if (columnKeys.indexOf(columns[i as number].field) > -1) {
                            value = this.dataColl[0][columns[i as number].field];
                            type = typeof value;
                            if (type === 'string') {
                                isDate = !isNaN(Date.parse(value as string));
                            } else if (type === 'object') {
                                isDate = value instanceof Date && !isNaN(value.getTime());
                                type = 'string';
                            }
                            columns[i as number].type = type;
                            isDate = false;
                        }
                        type = 'string';
                    }
                    if (!columns[i as number].validation) {
                        columns[i as number].validation = validateObj;
                    }
                    if (columns[i as number].category) {
                        groupBy = true;
                    } else {
                        columns[i as number].category = this.l10n.getConstant('OtherFields');
                    }
                    if (categories.indexOf(columns[i as number].category) < 0) {
                        categories.push(columns[i as number].category);
                    }
                    if (!columns[i as number].operators || this.isLocale) {
                        columns[i as number].operators = this.customOperators[columns[i as number].type + 'Operator'];
                    }
                }
                if (groupBy && (categories.length > 1 || categories[0] !== this.l10n.getConstant('OtherFields'))) {
                    this.fields = { text: 'label', value: 'field', groupBy: 'category' };
                }
                this.updateSubFieldsFromColumns(this.columns);
            } else {
                for (let i: number = 0, len: number = columnKeys.length; i < len; i++) {
                    value = this.dataColl[0][columnKeys[i as number]];
                    type = typeof value;
                    if (type === 'string') {
                        isDate = !isNaN(Date.parse(value as string));
                    } else if (type === 'object' && !Object.keys(value).length) {
                        isDate = value instanceof Date && !isNaN(value.getTime());
                        type = 'string';
                    }
                    cols[i as number] = { 'field': columnKeys[i as number], 'label': columnKeys[i as number], 'type': isDate ? 'date' : type,
                        'validation': validateObj } as Columns;
                    isDate = false;
                    cols[i as number].operators = this.customOperators[cols[i as number].type + 'Operator'];
                    if (type === 'object') {
                        this.updateSubFields(value, cols[i as number]);
                    }
                }
                this.columns = cols as Columns[];
            }
        } else if (this.columns.length) {
            const columns: ColumnsModel[] = this.columns;
            for (let i: number = 0, len: number = columns.length; i < len; i++) {
                if (columns[i as number].category) {
                    this.fields = { text: 'label', value: 'field', groupBy: 'category' };
                } else {
                    columns[i as number].category = this.l10n.getConstant('OtherFields');
                }
                this.updateCustomOperator(columns[i as number]);
                if (!columns[i as number].operators || this.isLocale) {
                    columns[i as number].operators = this.customOperators[columns[i as number].type + 'Operator'];
                }
            }
            this.updateSubFieldsFromColumns(this.columns);
        }
        this.trigger('dataBound', {type: 'dataBound'});
    }

    private updateSubFieldsFromColumns(col: ColumnsModel[], field?: string): void {
        for (let i: number = 0; i < col.length; i++) {
            if (this.separator !== '' && col[i as number].field.indexOf(this.separator) < 0) {
                col[i as number].field = field ? field + this.separator + col[i as number].field : col[i as number].field;
            }
            if (col[i as number].operators) {
                this.updateCustomOperator(col[i as number]);
            } else if (col[i as number].type && col[i as number].type !== 'object') {
                col[i as number].operators = this.customOperators[col[i as number].type + 'Operator'];
            }
            if (col[i as number].columns) {
                col[i as number].type = 'object';
                this.updateSubFieldsFromColumns(col[i as number].columns, col[i as number].field);
            }
        }
    }

    private updateSubFields(value: string | number | boolean | Object, col: ColumnsModel, data?: Object): void {
        let sampCol: ColumnsModel; col.columns = []; const columnKeys: string[] = Object.keys(value);
        let field: string; let label: string; let type: string; let result: Object;
        data = data ? data : this.dataColl[0];
        for (let i: number = 0, len: number = columnKeys.length; i < len; i++) {
            const compField: string[] = col.field.split('.');
            if (data) {
                result = data[compField[compField.length - 1]][columnKeys[i as number]];
            } else {
                result = this.dataColl[0][col.field][columnKeys[i as number]];
            }
            const resData: Object = data[col.field.split(this.separator)[col.field.split(this.separator).length - 1]];
            type = typeof result; field = col.field + this.separator + columnKeys[i as number]; label = columnKeys[i as number];
            type = (type === 'object' && !isNaN(Date.parse(result as string))) ? 'date' : type;
            sampCol = { field: field, label: label, type: type };
            if (type !== 'object') {
                sampCol.operators = this.customOperators[type + 'Operator'];
            }
            col.columns.push(sampCol);
            if (type === 'object') {
                this.updateSubFields(result, sampCol, resData);
            }
        }
    }

    private updateCustomOperator(column: ColumnsModel): void {
        if (column.operators) {
            for (let j: number = 0; j < column.operators.length; j++) {
                const sqlIdx: number = Object.keys(column.operators[j as number]).indexOf('sqlOperator');
                if (sqlIdx > -1) {
                    const operator: { [key: string]: object } = column.operators[j as number];
                    const operColl: string[] = Object.keys(operator);
                    const values: string[] = operColl.map((key: string) => operator[`${key}`]).join(',').split(',');
                    const valueIdx: number = operColl.indexOf('value');
                    this.operators[values[valueIdx as number]] = values[sqlIdx as number];
                }
            }
        }
    }

    private focusEventHandler(event: MouseEventArgs): void {
        this.target = event.target as Element;
    }

    private clickEventHandler(event: MouseEventArgs): void {
        let target: Element = event.target as Element; let args: ChangeEventArgs;
        this.isImportRules = false; let groupID: string;
        if (target.tagName === 'SPAN') {
            target = target.parentElement;
        }
        if (target.className.indexOf('e-collapse-rule') > -1) {
            const animation: Animation = new Animation({ duration: 1000, delay: 0 });
            if (this.element.querySelectorAll('.e-summary-content').length < 1) {
                this.renderSummary();
            }
            const summaryElem: HTMLElement =  document.getElementById(this.element.id + '_summary_content');
            const txtareaElem: HTMLElement = summaryElem.querySelector('.e-summary-text');
            animation.animate('.e-query-builder', { name: 'SlideLeftIn' });
            const groupElem: HTMLElement = this.element.querySelector('.e-group-container') as HTMLElement;
            groupElem.style.display = 'none';
            txtareaElem.textContent = this.getSqlFromRules(this.rule);
            summaryElem.style.display = 'block';
            txtareaElem.style.height = txtareaElem.scrollHeight + 'px';
        }
        if (target.tagName === 'BUTTON' && target.className.indexOf('e-qb-toggle') < 0) {
            if (target.className.indexOf('e-removerule') > -1) {
                this.actionButton = target;
                this.deleteRule(target);
            } else if (target.className.indexOf('e-deletegroup') > -1) {
                this.actionButton = target;
                this.deleteGroup(closest(target, '.e-group-container'));
            } else if (target.className.indexOf('e-edit-rule') > -1) {
                const animation: Animation = new Animation({ duration: 1000, delay: 0 });
                animation.animate('.e-query-builder' , { name: 'SlideLeftIn' });
                document.getElementById(this.element.id + '_summary_content').style.display = 'none';
                if (this.element.querySelectorAll('.e-group-container').length < 1) {
                    this.addGroupElement(false, this.element, this.rule.condition, false, this.rule.not);
                    const mRules: RuleModel = extend({}, this.rule, {}, true);
                    this.setGroupRules(mRules);
                    this.renderSummaryCollapse();
                } else {
                    const groupElem: HTMLElement = this.element.querySelector('.e-group-container') as HTMLElement;
                    if (groupElem.querySelectorAll('.e-collapse-rule').length < 1) {
                        this.renderSummaryCollapse();
                    }
                    groupElem.style.display = 'block';
                }
            }
        } else if ((target.tagName === 'LABEL' && target.parentElement.className.indexOf('e-btn-group') > -1) ||
        target.className.indexOf('e-qb-toggle') > -1) {
            const element: Element = closest(target, '.e-group-container');
            if (!this.headerTemplate) {
                const forIdValue: string = target.getAttribute('for');
                let targetValue: string;
                if (forIdValue) {
                    targetValue = document.getElementById(forIdValue).getAttribute('value');
                }
                groupID = element.id.replace(this.element.id + '_', '');
                const group: RuleModel = this.getGroup(groupID);
                let ariaChecked: boolean;
                if (this.enableNotCondition) {
                    if (target.className.indexOf('e-qb-toggle') > -1) {
                        const toggleElem: Element = element.getElementsByClassName('e-qb-toggle')[0];
                        if (toggleElem.className.indexOf('e-active-toggle') > -1) {
                            removeClass([toggleElem], 'e-active-toggle');
                            ariaChecked = false;
                        } else {
                            addClass([toggleElem], 'e-active-toggle');
                            ariaChecked = true;
                        }
                        targetValue = group.condition;
                    } else {
                        ariaChecked = group.not;
                    }
                }
                args = { groupID: groupID, cancel: false, type: 'condition', value: targetValue.toLowerCase() };
                if (this.enableNotCondition) {
                    args = { groupID: groupID, cancel: false, type: 'condition', value: targetValue.toLowerCase(),
                        'not': ariaChecked };
                }
            }
            if (!this.isImportRules) {
                this.trigger('beforeChange', args, (observedChangeArgs: ChangeEventArgs) => {
                    this.beforeSuccessCallBack(observedChangeArgs, target);
                });
            } else {
                this.beforeSuccessCallBack(args, target);
            }
            this.target = target;
        }
    }
    private beforeSuccessCallBack(args: ChangeEventArgs, target: Element): void {
        if (!args.cancel) {
            const element: Element = closest(target, '.e-group-container');
            const groupID: string =  element.id.replace(this.element.id + '_', '');
            const beforeRules: RuleModel = this.getValidRules(this.rule);
            const rule: RuleModel = this.getParentGroup(element);
            rule.condition = args.value as string;
            if (this.enableNotCondition) {
                rule.not = args.not;
            }
            if (!this.isImportRules) {
                this.trigger('change', { groupID: groupID, type: 'condition', value: rule.condition });
            }
            this.filterRules(beforeRules, this.getValidRules(this.rule), 'condition');
        }
    }

    private selectBtn(target: Element, event: MenuEventArgs): void {
        if (event.name === 'beforeOpen') {
            if (this.showButtons.groupInsert || isNullOrUndefined(this.showButtons.groupInsert)) {
                if (this.element.querySelectorAll('.e-group-container').length >= this.maxGroupCount + 1) {
                    addClass([event.element.querySelector('li span.e-addgroup').parentElement], 'e-button-hide');
                } else {
                    removeClass([event.element.querySelector('li span.e-addgroup').parentElement], 'e-button-hide');
                }
                if (this.enableRtl) {
                    addClass([event.element.querySelector('li').parentElement], 'e-rtl');
                }
            } else {
                addClass([event.element.querySelector('li span.e-addgroup').parentElement], 'e-button-hide');
            }
        } else if (event.element.children[0].className.indexOf('e-addrule') > -1) {
            this.addRuleElement(closest(target, '.e-group-container'), {});
        } else if (event.element.children[0].className.indexOf('e-addgroup') > -1) {
            this.addGroupElement(true, closest(target, '.e-group-container'), '', true);
        }
    }
    private appendRuleElem(
        target: Element, column: ColumnsModel, type: string, parentId: string, action: string, rule?: RuleModel): Element {
        let ruleElem: Element; let elem: Element; const ruleListElem: Element = target.querySelector('.e-rule-list');
        let args: ActionEventArgs;
        if (type === 'change') {
            ruleElem = select('#' + parentId, target);
        } else {
            ruleElem = this.createElement('div', { attrs: { class: 'e-rule-container' } });
            ruleElem.setAttribute('id', target.id + '_rule' + this.ruleIdCounter);
            ruleListElem.appendChild(ruleElem); this.ruleIdCounter++;
        }
        if (column && column.ruleTemplate && rule) {
            args = { requestType: 'template-initialize', ruleID: ruleElem.id, action: action, fields: this.fields, rule: rule };
            this.trigger('actionBegin', args);
            this.ruleTemplateFn = this.templateParser(column.ruleTemplate);
            const templateID: string = this.element.id + column.field; let template: Element;
            args.fields = this.fields; args.columns = this.columns;
            if (rule.field === '') {
                rule.field = column.field;
            }
            args.operators = this.getOperators(rule.field);
            args.operatorFields = { text: 'key', value: 'value' };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((this as any).isReact) {
                template = this.ruleTemplateFn(args, this, ruleElem.id, templateID)[0];
                elem = template; elem.className += ' e-rule-field';
                ruleElem.appendChild(elem);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } else if ((this as any).isAngular) {
                const templateColl: Element [] = this.ruleTemplateFn(args, this, ruleElem.id, templateID);
                template = (templateColl[0].nodeType === 3) ? templateColl[1] : templateColl[0];
                elem = template; elem.className += ' e-rule-field';
                ruleElem.appendChild(elem);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } else if ((this as any).isVue3) {
                template = this.ruleTemplateFn(args, this, 'Template', templateID);
                elem = template;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                append(elem as any, ruleElem);
                ruleElem.children[ruleElem.children.length - 1].className += ' e-rule-field';
            } else {
                template = this.ruleTemplateFn(args, this, 'Template', templateID)[0];
                elem = template; elem.className += ' e-rule-field';
                ruleElem.appendChild(elem);
            }
        } else {
            elem = this.ruleElem.querySelector('.e-rule-field').cloneNode(true) as Element;
            ruleElem.appendChild(elem);
        }
        if (column && column.ruleTemplate && rule) { this.renderReactTemplates(); }
        return ruleElem;
    }
    private addRuleElement(
        target: Element, rule?: RuleModel, column?: ColumnsModel, action?: string, parentId?: string, isRuleTemplate?: boolean): void {
        if (!target) {
            return;
        }
        const args: ChangeEventArgs = { groupID: target.id.replace(this.element.id + '_', ''), cancel: false, type: 'insertRule' };
        if (!this.isImportRules && !this.isInitialLoad) {
            this.trigger('beforeChange', args, (observedChangeArgs: ChangeEventArgs) => {
                this.addRuleSuccessCallBack(observedChangeArgs, target, rule, column, action, parentId, isRuleTemplate);
            });
        } else {
            this.isInitialLoad = false;
            this.addRuleSuccessCallBack(args, target, rule, column, action, parentId, isRuleTemplate);
        }
    }

    private addRuleSuccessCallBack(
        args: ChangeEventArgs, trgt: Element, rule: RuleModel, col?: ColumnsModel, act?: string, pId?: string, isRlTmp?: boolean): void {
        const height: string = (this.element.className.indexOf('e-device') > -1) ? '250px' : '200px'; let ruleID: string;
        const column: ColumnsModel = (rule && rule.field) ? this.getColumn(rule.field) : col ? col : this.columns[0];
        let operators: { [key: string]: Object }[]; let dropDownList: DropDownList; let ruleElem: Element;
        let newRule: RuleModel = { 'label': '', 'field': '', 'type': '', 'operator': '' };
        if (!args.cancel) {
            if (column && column.ruleTemplate && rule.field) {
                this.selectedColumn = column; operators = this.selectedColumn.operators;
                newRule = {'label': column.label, 'field': column.field, 'type': column.type, 'operator': operators[0].value as string};
                const passedRule: RuleModel = Object.keys(rule).length ? rule : newRule;
                ruleElem = this.appendRuleElem(trgt, column, act, pId, 'field', passedRule);
                const args: ActionEventArgs = { requestType: 'template-create', action: 'insert-rule', ruleID: ruleElem.id,
                    fields: this.fields, rule: passedRule };
                this.trigger('actionBegin', args);
            } else {
                ruleElem = this.appendRuleElem(trgt, column, act, pId, 'field');
                ruleElem.querySelector('.e-filter-input').setAttribute('id', ruleElem.id + '_filterkey');
                let element: Element = ruleElem.querySelector('button');
                if (this.element.className.indexOf('e-device') > -1 || this.displayMode === 'Vertical') {
                    element.textContent = this.l10n.getConstant('Remove');
                    addClass([element], 'e-flat'); addClass([element], 'e-primary');
                } else {
                    addClass([element], 'e-round'); addClass([element], 'e-icon-btn');
                    element.setAttribute('title', this.l10n.getConstant('DeleteRule'));
                    element = this.createElement('span', { attrs: { class: 'e-btn-icon e-icons e-delete-icon' } });
                    ruleElem.querySelector('button').appendChild(element);
                }
            }
            if (this.displayMode === 'Vertical' || this.element.className.indexOf('e-device') > -1) {
                ruleElem.className = 'e-rule-container e-vertical-mode';
            } else {
                ruleElem.className = 'e-rule-container e-horizontal-mode';
            }
            if (ruleElem.previousElementSibling && ruleElem.previousElementSibling.className.indexOf('e-rule-container') > -1) {
                if (ruleElem.className.indexOf('e-joined-rule') < 0) {
                    ruleElem.className += ' e-joined-rule';
                }
                if (ruleElem.previousElementSibling.className.indexOf('e-prev-joined-rule') < 0) {
                    ruleElem.previousElementSibling.className += ' e-prev-joined-rule';
                }
            }
            if (ruleElem.previousElementSibling && ruleElem.previousElementSibling.className.indexOf('e-group-container') > -1 &&
                ruleElem.className.indexOf('e-separate-rule') < 0) {
                ruleElem.className += ' e-separate-rule';
            }
            if (!this.isImportRules) {
                this.updateAddedRule(trgt, rule, newRule, isRlTmp, pId);
            }
            if (!column || (column && !column.ruleTemplate) || !rule.field) {
                if (this.fieldMode === 'Default'){
                    let ddlField: DropDownListModel;
                    let ddlValue: string;
                    if (this.separator && rule.field) {
                        ddlValue = this.GetRootColumnName(rule.field as string);
                    } else {
                        ddlValue = this.isImportRules ? this.GetRootColumnName(rule.field as string) : rule.field;
                    }
                    ddlField = {
                        dataSource: this.columns as { [key: string]: Object }[], // tslint:disable-line
                        fields: this.fields, placeholder: this.l10n.getConstant('SelectField'),
                        popupHeight: ((this.columns.length > 5) ? height : 'auto'), close: this.fieldClose.bind(this, ruleElem.id + '_filterkey'),
                        change: this.changeField.bind(this), value: rule ? ddlValue : null, open: this.popupOpen.bind(this, true)
                    };
                    if (this.fieldModel) {
                        ddlField = {...ddlField, ...this.fieldModel as DropDownListModel};
                    }
                    dropDownList = new DropDownList(ddlField); dropDownList.appendTo('#' + ruleElem.id + '_filterkey');
                    let ddlVal: string | number | boolean;
                    if (this.separator && rule.field) {
                        ddlVal = this.GetRootColumnName(rule.field as string);
                    } else {
                        ddlVal = this.isImportRules ? this.GetRootColumnName(rule.field as string) : dropDownList.value;
                    }
                    this.selectedColumn = dropDownList.getDataByValue(ddlVal) as ColumnsModel;
                    if (Object.keys(rule).length) {
                        this.changeRule(rule, {
                            element: dropDownList.element, itemData: this.selectedColumn as FieldSettingsModel
                        } as DropDownChangeEventArgs);
                    }
                } else {
                    let ddlField: DropDownTreeModel;
                    const ddlValue: string = this.isImportRules ? (rule.field as string) : rule.field;
                    ddlField = {
                        fields: {dataSource: this.columns as { [key: string]: Object }[],
                            value: 'field', text: 'label', child: 'columns', expanded: 'expanded'},
                        placeholder: this.l10n.getConstant('SelectField'), showClearButton: false,
                        popupHeight: ((this.columns.length > 5) ? height : 'auto'), changeOnBlur: false,
                        change: this.changeField.bind(this), value: !isNullOrUndefined(ddlValue) ? [ddlValue] : null,
                        open: this.popupOpen.bind(this, false)
                    };
                    if (this.fieldModel) {
                        ddlField = {...ddlField, ...this.fieldModel as DropDownTreeModel};
                    }
                    const dropdowntree: DropDownTree = new DropDownTree(ddlField); dropdowntree.appendTo('#' + ruleElem.id + '_filterkey');
                    if (!isNullOrUndefined(dropdowntree.value)) {
                        const value: string = this.getLabelFromColumn(dropdowntree.value[0]);
                        (dropdowntree.element as HTMLInputElement).value = value;
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const ddlVal: string | number | boolean | any = !isNullOrUndefined(rule.field) ?
                        this.GetRootColumnName(rule.field as string) : dropdowntree.value;
                    this.selectedColumn = this.getColumn(ddlVal) as ColumnsModel;
                    if (Object.keys(rule).length) {
                        this.changeRule(rule, {
                            element: dropdowntree.element, itemData: this.selectedColumn as FieldSettingsModel
                        } as DropDownChangeEventArgs);
                    }
                }
            }
            ruleID = ruleElem.id.replace(this.element.id + '_', '');
            if (!this.isImportRules) {
                this.trigger('change', { groupID: trgt.id.replace(this.element.id + '_', ''), ruleID: ruleID, type: 'insertRule' });
            }
        }
    }

    private updateAddedRule(target: Element, rule: RuleModel, newRule: RuleModel, isRuleTemplate?: boolean, pId?: string): void {
        let ruleElem: Element; let index: number = 0;
        let groupElem: Element; let rules: RuleModel;
        if (isRuleTemplate) {
            ruleElem = select('#' + pId, target);
            groupElem = closest(target, '.e-group-container');
            rules = this.getParentGroup(groupElem);
            while (ruleElem && ruleElem.previousElementSibling !== null) {
                ruleElem = ruleElem.previousElementSibling;
                index++;
            }
            rules.rules[index as number] = rule;
        } else {
            groupElem = closest(target, '.e-group-container');
            rules = this.getParentGroup(groupElem);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const custom: any = (rule as any).custom;
            if (Object.keys(rule).length) {
                rules.rules.push({
                    'field': rule.field, 'type': rule.type, 'label': rule.label, 'operator': rule.operator, value: rule.value
                });
                if (custom) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (rules.rules[rules.rules.length - 1] as any).custom = custom;
                }
            } else {
                if (custom) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (newRule as any).custom = custom;
                }
                rules.rules.push(newRule);
            }
        }
        this.disableRuleCondition(target, rules);
    }

    private changeRuleTemplate(column: ColumnsModel, element: Element): void {
        const operVal: { [key: string]: Object }[] = this.selectedColumn.operators;
        if (column.ruleTemplate) {
            return ;
        } else {
            const parentGroup: HTMLElement = closest(element, '.e-group-container') as HTMLElement;
            const parentId: string = closest(element, '.e-rule-container').id;
            if (this.previousColumn && this.previousColumn.ruleTemplate) {
                detach(element.closest('[id="' + parentId + '"]').querySelector('.e-rule-field'));
                this.clearQBTemplate([parentId]);
            }
            if (column) {
                const rule: RuleModel = {field: column.field, label: column.label, operator: operVal[0].value as string, value: ''};
                this.addRuleElement(parentGroup, rule, column, 'change', parentId, true);
            }
        }
    }

    private renderToolTip(element: HTMLElement): void {
        const tooltip: Tooltip = new Tooltip({ content: this.l10n.getConstant('ValidationMessage'),
            position: 'BottomCenter', cssClass: 'e-querybuilder-error' });
        tooltip.appendTo(element);
        tooltip.open(element);
    }
    /**
     * Validate the conditions and it display errors for invalid fields.
     *
     * @returns {boolean} - Validation
     */
    public validateFields(): boolean {
        let isValid: boolean = true; let dropDownTreeObj: DropDownTree;
        if (this.allowValidation) {
            const excludeOprs: string [] = ['isnull', 'isnotnull', 'isempty', 'isnotempty'];
            let i: number; let len: number; let fieldElem: Element; let indexElem: Element; let valArray: string[] | number[] = [];
            let groupElem: Element; let index: number; let dropDownObj: DropDownList; let tempElem: Element; let rule: RuleModel;
            const ruleElemCln: NodeListOf<Element> = this.element.querySelectorAll('.e-rule-container');
            for (i = 0, len = ruleElemCln.length; i < len; i++) {
                let validateRule: Validation;
                groupElem = closest(ruleElemCln[i as number], '.e-group-container');
                rule = this.getParentGroup(groupElem); index = 0; indexElem = tempElem = ruleElemCln[i as number];
                if (this.fieldMode === 'DropdownTree') {
                    dropDownTreeObj = getComponent(ruleElemCln[i as number].querySelector('.e-rule-filter input.e-dropdowntree') as HTMLElement, 'dropdowntree');
                    if (dropDownTreeObj && dropDownTreeObj.value && dropDownTreeObj.value.length) {
                        this.selectedColumn = this.getColumn(dropDownTreeObj.value[0]) as ColumnsModel;
                        validateRule = (this.selectedColumn as ColumnsModel).validation;
                    }
                } else {
                    dropDownObj = getComponent(ruleElemCln[i as number].querySelector('.e-rule-filter input.e-dropdownlist') as HTMLElement, 'dropdownlist');
                    if (dropDownObj && dropDownObj.value) {
                        this.selectedColumn = dropDownObj.getDataByValue(dropDownObj.value) as ColumnsModel;
                        validateRule = !isNullOrUndefined(dropDownObj.index) && (this.selectedColumn as ColumnsModel).validation;
                    }
                }
                fieldElem = tempElem.querySelector('.e-rule-field input.e-control');
                if (validateRule && validateRule.isRequired) {
                    while (indexElem && indexElem.previousElementSibling !== null) {
                        indexElem = indexElem.previousElementSibling;
                        index++;
                    }
                    fieldElem = tempElem.querySelector('.e-rule-operator .e-control');
                    if (!rule.rules[index as number].operator) {
                        if (fieldElem.parentElement.className.indexOf('e-tooltip') < 0) {
                            this.renderToolTip(fieldElem.parentElement);
                        }
                        isValid = false;
                    }
                    if (rule.rules[index as number].value instanceof Array) {
                        valArray = rule.rules[index as number].value as string[] | number[];
                    }
                    if (excludeOprs.indexOf(rule.rules[index as number].operator) < 0 &&
                    (isNullOrUndefined(rule.rules[index as number].value) &&
                    rule.rules[index as number].type !== 'date') || rule.rules[index as number].value === '' ||
                    (rule.rules[index as number].value instanceof Array && valArray.length < 1)) {
                        const valElem: NodeListOf<Element> = tempElem.querySelectorAll('.e-rule-value .e-control');
                        isValid = false;
                        for (let j: number = 0, jLen: number = valElem.length; j < jLen; j++) {
                            const element: Element = valElem[j as number]; let elem: Element;
                            if (element.parentElement.className.indexOf('e-searcher') > -1) {
                                elem = closest(element, '.e-multi-select-wrapper');
                                if (elem.className.indexOf('e-tooltip') < 0) {
                                    this.renderToolTip(elem as HTMLElement);
                                }
                            } else if (valElem[j as number].parentElement.className.indexOf('e-tooltip') < 0  && valElem[j as number].className.indexOf('e-tooltip') < 0) {
                                this.renderToolTip(valElem[j as number].parentElement);
                            }
                            j++;
                        }
                    }
                } else if ((dropDownObj && dropDownObj.element && isNullOrUndefined(dropDownObj.index)) ||
                (dropDownTreeObj && dropDownTreeObj.element && (isNullOrUndefined(dropDownTreeObj.value) ||
                dropDownTreeObj.value.length < 1))) {
                    if (fieldElem.parentElement.className.indexOf('e-tooltip') < 0) {
                        this.renderToolTip(fieldElem.parentElement as HTMLElement);
                    }
                    isValid = false;
                }
            }
        }
        return isValid;
    }
    private refreshLevelColl(): void {
        this.levelColl = {};
        const groupElem: Element = this.element.querySelector('.e-group-container');
        if (groupElem) {
            this.levelColl[groupElem.id] = [0];
            const obj: LevelColl = {groupElement: groupElem, level: [0]};
            this.refreshLevel(obj);
        }
    }
    private refreshLevel(obj: LevelColl): LevelColl | void {
        const ruleList: HTMLCollection = obj.groupElement.querySelector('.e-rule-list').children;
        let childElem: Element;
        const groupElem: Element = obj.groupElement;
        let i: number; const iLen: number = ruleList.length;
        let groupCount: number = 0;
        for (i = 0; i < iLen; i++ ) {
            childElem = (ruleList[i as number] as Element);
            if (childElem.className.indexOf('e-group-container') > -1) {
                obj.level.push(groupCount);
                this.levelColl[childElem.id] = obj.level.slice();
                groupCount++;
                obj.groupElement = childElem;
                obj = this.refreshLevel(obj) as LevelColl;
            }
        }
        const ruleListElem: Element = closest(groupElem, '.e-rule-list');
        obj.groupElement = ruleListElem ? closest(ruleListElem, '.e-group-container') : groupElem;
        obj.level = this.levelColl[obj.groupElement.id].slice();
        return obj;
    }
    private groupTemplate(): Element {
        let glueElem: Element; let inputElem: Element;
        let labelElem: Element; let grpActElem: Element; let groupBtn: HTMLElement;
        const groupElem: Element = this.createElement('div', { attrs: { class: 'e-group-container' } });
        const groupHdrElem: Element = this.createElement('div', { attrs: { class: 'e-group-header' } });
        const grpBodyElem: Element = this.createElement('div', { attrs: { class: 'e-group-body' } });
        const rulesElem: Element = this.createElement('div', { attrs: { class: 'e-rule-list' } });
        groupElem.appendChild(groupHdrElem);
        grpBodyElem.appendChild(rulesElem);
        groupElem.appendChild(grpBodyElem);
        // create button group in OR and AND process
        if (!this.headerTemplate) {
            glueElem = this.createElement('div', { attrs: { class: 'e-lib e-btn-group', role: 'group' } });
            if (this.enableNotCondition) {
                inputElem = this.createElement('button', { attrs: { type: 'button', class: 'e-qb-toggle' }});
                glueElem.appendChild(inputElem);
            }
            inputElem = this.createElement('input', { attrs: { type: 'radio', class: 'e-btngroup-and', value: 'AND' } });
            glueElem.appendChild(inputElem);
            labelElem = this.createElement('label', { attrs: { class: 'e-lib e-btn e-btngroup-and-lbl e-small' },
                innerHTML: this.l10n.getConstant('AND') });
            glueElem.appendChild(labelElem);
            inputElem = this.createElement('input', { attrs: { type: 'radio', class: 'e-btngroup-or', value: 'OR' } });
            glueElem.appendChild(inputElem);
            labelElem = this.createElement('label', { attrs: { class: 'e-lib e-btn e-btngroup-or-lbl e-small' },
                innerHTML: this.l10n.getConstant('OR') });
            glueElem.appendChild(labelElem);
            groupHdrElem.appendChild(glueElem);
            grpActElem = this.createElement('div', { attrs: { class: 'e-group-action' } });
            groupBtn = this.createElement('button', { attrs: { type: 'button', class: 'e-add-btn' } });
            grpActElem.appendChild(groupBtn);
            groupHdrElem.appendChild(grpActElem);
        }
        return groupElem;
    }

    private ruleTemplate(): Element {
        let tempElem: Element;
        let clsName: string;
        const ruleElem: Element = this.createElement('div');
        const fieldElem: Element = this.createElement('div', { attrs: { class: 'e-rule-field' } });
        tempElem = this.createElement('div', { attrs: { class: 'e-rule-filter' } });
        const filterElem: Element = this.createElement('input', { attrs: { type: 'text', class: 'e-filter-input' } });
        tempElem.appendChild(filterElem);
        fieldElem.appendChild(tempElem);
        tempElem = this.createElement('div', { attrs: { class: 'e-rule-operator' } });
        fieldElem.appendChild(tempElem);
        tempElem = this.createElement('div', { attrs: { class: 'e-rule-value' } });
        fieldElem.appendChild(tempElem);
        tempElem = this.createElement('div', { attrs: { class: 'e-rule-value-delete' } });
        if (this.showButtons.ruleDelete || isNullOrUndefined(this.showButtons.ruleDelete)) {
            clsName = 'e-removerule e-rule-delete e-css e-btn e-small';
        } else {
            clsName = 'e-removerule e-rule-delete e-css e-btn e-small e-button-hide';
        }
        const delBtnElem: HTMLElement = this.createElement('button', { attrs: { type: 'button', class: clsName } });
        tempElem.appendChild(delBtnElem);
        fieldElem.appendChild(tempElem);
        ruleElem.appendChild(fieldElem);
        return ruleElem;
    }
    private addGroupElement(isGroup: boolean, target: Element, condition?: string, isBtnClick?: boolean, not?: boolean,
                            isRoot?: boolean, rule?: RuleModel): void {
        const args: ChangeEventArgs = { groupID: target.id.replace(this.element.id + '_', ''), cancel: false, type: 'insertGroup' };
        if (!this.isImportRules && !this.isInitialLoad) {
            this.trigger('beforeChange', args, (observedChangeArgs: ChangeEventArgs) => {
                this.addGroupSuccess(observedChangeArgs, isGroup, target, condition, isBtnClick, not, isRoot, rule);
            });
        } else {
            this.isInitialLoad = false;
            this.addGroupSuccess(args, isGroup, target, condition, isBtnClick, not, isRoot, rule);
        }
    }

    private addGroupSuccess(
        args: ChangeEventArgs, isGroup : boolean, eventTarget: Element, condition: string, isBtnClick: boolean, not?: boolean,
        isRoot?: boolean, rule?: RuleModel): void {
        if (!args.cancel && (this.element.querySelectorAll('.e-group-container').length <= this.maxGroupCount)) {
            const target: Element = eventTarget; let dltGroupBtn: HTMLElement; let groupID: string =  '';
            if (target.className.indexOf('e-group-container') < 0) {
                groupID = target.querySelector('.e-group-container') && target.querySelector('.e-group-container').id;
            } else {
                groupID = target.id;
            }
            const groupElem: Element = this.groupElem.cloneNode(true) as Element;
            groupElem.setAttribute('id', this.element.id + '_group' + this.groupIdCounter);
            if (this.headerTemplate ) {
                if (isRoot) {
                    isGroup = false;
                    groupElem.setAttribute('id', this.element.id + '_group0');
                    this.headerTemplateFn(groupElem, not, condition, rule, groupID);
                    this.groupIdCounter = 0;
                } else {
                    this.headerTemplateFn(groupElem, not, condition, rule, groupID);
                }
            }
            this.groupIdCounter++;
            if (!this.headerTemplate) {
                const andInpElem: Element = groupElem.querySelector('.e-btngroup-and');
                const orInpElem: Element = groupElem.querySelector('.e-btngroup-or');
                const andLblElem: Element = groupElem.querySelector('.e-btngroup-and-lbl');
                const orLblElem: Element = groupElem.querySelector('.e-btngroup-or-lbl');
                andInpElem.setAttribute('id', this.element.id + '_and' + this.btnGroupId);
                orInpElem.setAttribute('id', this.element.id + '_or' + this.btnGroupId);
                andInpElem.setAttribute('name', this.element.id + '_and' + this.btnGroupId);
                orInpElem.setAttribute('name', this.element.id + '_and' + this.btnGroupId);
                andLblElem.setAttribute('for', this.element.id + '_and' + this.btnGroupId);
                orLblElem.setAttribute('for', this.element.id + '_or' + this.btnGroupId);
                this.btnGroupId++;
            }
            if (isGroup) {
                let clsName: string;
                if (this.showButtons.groupDelete || isNullOrUndefined(this.showButtons.groupDelete)){
                    clsName = 'e-deletegroup';
                } else {
                    clsName = 'e-deletegroup e-button-hide';
                }
                dltGroupBtn = this.createElement('button', { attrs: { type: 'button', class: clsName } });
                const button: Button = new Button({ iconCss: 'e-icons e-delete-icon', cssClass: 'e-small e-round' });
                button.appendTo(dltGroupBtn);
                dltGroupBtn.setAttribute('title', this.l10n.getConstant('DeleteGroup'));
                rippleEffect(dltGroupBtn, { selector: '.deletegroup' });
                if (!this.headerTemplate) {
                    groupElem.querySelector('.e-group-action').appendChild(dltGroupBtn);
                }
                const ruleList: Element = target.querySelector('.e-rule-list');
                const childElems: HTMLCollection = ruleList.children;
                let grpLen: number = 0;
                for (let j: number = 0, jLen: number = childElems.length; j < jLen; j++) {
                    if (childElems[j as number].className.indexOf('e-group-container') > -1) {
                        grpLen += 1;
                    }
                }
                ruleList.appendChild(groupElem);
                const level: number[] = this.levelColl[target.id].slice(0);
                level.push(grpLen); this.levelColl[groupElem.id] = level;
                if (!this.isImportRules) {
                    this.isAddSuccess = true; this.addGroups([], target.id.replace(this.element.id + '_', ''));
                    this.isAddSuccess = false;
                    if (isBtnClick) {
                        this.addRuleElement(groupElem, {});
                    }
                }
            } else {
                target.appendChild(groupElem); this.levelColl[groupElem.id] = [0];
            }
            if (this.enableNotCondition) {
                if (!this.headerTemplate) {
                    const notElem: HTMLElement = groupElem.querySelector('.e-qb-toggle');
                    const tglBtn: Button = new Button({ content: this.l10n.getConstant('NOT'), cssClass: 'e-btn e-small' });
                    tglBtn.appendTo(notElem);
                    groupElem.querySelector('.e-btngroup-and-lbl').classList.add('e-not');
                    if (this.updatedRule && this.updatedRule.not) {
                        addClass([notElem], 'e-active-toggle');
                    }
                }
            }
            this.updatedRule = null;
            if (this.headerTemplate) {
                const args: ActionEventArgs = { requestType: 'header-template-create', ruleID: groupElem.id, condition: condition,
                    notCondition: this.enableNotCondition ? not : undefined };
                this.trigger('actionBegin', args);
            } else {
                const groupBtn: HTMLElement = groupElem.querySelector('.e-add-btn') as HTMLElement;
                const btnObj: DropDownButton = new DropDownButton({
                    items: this.items,
                    cssClass: 'e-round e-small e-caret-hide e-addrulegroup',
                    iconCss: 'e-icons e-add-icon',
                    beforeOpen: this.selectBtn.bind(this, groupBtn),
                    select: this.selectBtn.bind(this, groupBtn)
                });
                btnObj.appendTo(groupBtn);
                groupBtn.setAttribute('title', this.l10n.getConstant('AddButton'));
            }
            if (!this.isImportRules) {
                const grpId: string = target.id.replace(this.element.id + '_', '');
                const chgrpId: string = groupElem.id.replace(this.element.id + '_', '');
                this.trigger('change', { groupID: grpId, type: 'insertGroup', childGroupID: chgrpId });
            }
        }
    }
    private headerTemplateFn(groupElem: Element, not: boolean, condition: string, rule: RuleModel, groupID: string): Element {
        let template: Element; const templateID: string = this.element.id + '_header'; let args: ActionEventArgs;
        const groupHdr: HTMLElement = groupElem.querySelector('.e-group-header');
        if (this.headerTemplate) {
            args = { requestType: 'header-template-initialize', ruleID: groupElem.id,
                notCondition: this.enableNotCondition ? not : undefined, condition: condition, rule: this.getRuleCollection(rule, true), groupID: groupID };
            this.trigger('actionBegin', args);
            this.headerFn = this.templateParser(this.headerTemplate);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((this as any).isReact) {
                template = this.headerFn(args, this, groupElem.id, templateID)[0];
                groupHdr.appendChild(template);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } else if ((this as any).isAngular) {
                const templateColl: Element [] = this.headerFn(args, this, groupElem.id, templateID);
                template = (templateColl[0].nodeType === 3) ? templateColl[1] : templateColl[0];
                groupHdr.appendChild(template);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } else if ((this as any).isVue3) {
                template = this.headerFn(args, this, groupElem.id, templateID);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                append(template as any, groupHdr);
            } else {
                template = this.headerFn(args, this, 'Template', templateID)[0];
                groupHdr.appendChild(template);
            }
            this.renderReactTemplates();
        }
        return groupElem;
    }
    /**
     * Notify the changes to component.
     *
     * @param {string | number | boolean | Date | string[] | number[] | Date[]} value - 'value' to be passed to update the rule value.
     * @param {Element} element - 'element' to be passed to update the rule.
     * @param {string} type - 'type' to be passed to update the rule .
     * @returns {void}.
     */
    public notifyChange(value: string | number | boolean | Date | string[] | number[] | Date[], element: Element, type?: string): void {
        const grpElement: Element = closest(element, '.e-group-container');
        const rules: RuleModel = this.getParentGroup(grpElement);
        let ruleElement: Element = closest(element, '.e-rule-container'); let index: number = 0;
        if (type === 'not') {
            rules.not = value as boolean;
            return;
        }
        if (type === 'condition') {
            rules.condition = value as string;
            return;
        }
        while (ruleElement && ruleElement.previousElementSibling !== null) {
            ruleElement = ruleElement.previousElementSibling;
            index++;
        }
        const rule: RuleModel = rules.rules[index as number]; const column: ColumnsModel = this.getColumn(rule.field);
        const format: DateFormatOptions = this.getFormat(column.format);
        if (column.type === 'date') {
            if (value instanceof Date) {
                value = this.intl.formatDate(value as Date , format) as string;
            } else if (value instanceof Array) {
                for (let i: number = 0; i < value.length; i++) {
                    if (value[i as number] && value[i as number] instanceof Date) {
                        value[i as number] = this.intl.formatDate(value[i as number] as Date, format) as string;
                    }
                }
            }
        }
        if (column.ruleTemplate) {
            this.templateChange(element, value as string | number | boolean | string[] | number[], type);
        } else {
            this.isNotified = true; this.updateRules(element, value); this.isNotified = false;
        }
    }

    private templateChange(
        element: Element, value: string | number | boolean | string[] | number[], type?: string): void {
        const grpElem: Element = closest(element, '.e-group-container');
        let eventsArgs: ChangeEventArgs;
        const rules: RuleModel = this.getParentGroup(grpElem);
        let ruleElem: Element = closest(element, '.e-rule-container'); let index: number = 0;
        if (this.allowValidation) {
            this.validateValue(rules, ruleElem);
        }
        while (ruleElem && ruleElem.previousElementSibling !== null) {
            ruleElem = ruleElem.previousElementSibling;
            index++;
        }
        const rule: RuleModel = rules.rules[index as number];
        if (type === 'field') {
            this.selectedColumn = this.getColumn(value as string);
        } else if (rule) {
            this.selectedColumn = this.getColumn(rule.field);
        }
        let operVal: { [key: string]: Object }[];
        this.previousColumn = this.getColumn(rule.field); const beforeRules: RuleModel = this.getValidRules(this.rule);
        if (this.selectedColumn) {
            if (this.selectedColumn.operators) {
                operVal = this.selectedColumn.operators;
            } else {
                operVal = this.customOperators[this.selectedColumn.type + 'Operator'];
            }
        }
        const arrOper: string[] = ['in', 'notin', 'between', 'notbetween']; let prevOper: string;
        switch (type) {
        case 'field':
            rule.field = value as string; rule.label = this.selectedColumn.label;
            rule.type = this.selectedColumn.type; rule.value = '';
            rule.operator = operVal[0].value as string;
            break;
        case 'operator':
            prevOper = rule.operator; rule.operator = value as string;
            if (arrOper.indexOf(rule.operator) > -1) {
                rule.value = [];
            } else if (arrOper.indexOf(prevOper) > -1) {
                rule.value = '';
            }
            break;
        case 'value':
            rule.value = value;
        }
        this.changeRuleTemplate(this.selectedColumn, element);
        this.filterRules(beforeRules, this.getValidRules(this.rule), type);
        if (this.selectedColumn && this.selectedColumn.ruleTemplate) {
            if (type === 'field' || type === 'operator') {
                const grpEle: Element = closest(element, '.e-rule-container');
                this.destroyControls(grpEle, true);
                detach(grpEle.querySelector('.e-rule-field'));
                const ruleElement: Element = this.appendRuleElem(
                    closest(grpEle, '.e-group-container'), this.selectedColumn, 'change', grpEle.id, type, rule);
                if (this.displayMode === 'Vertical' || this.element.className.indexOf('e-device') > -1) {
                    ruleElement.className = 'e-rule-container e-vertical-mode';
                } else {
                    ruleElement.className = 'e-rule-container e-horizontal-mode';
                }
                if (ruleElement.previousElementSibling && ruleElement.previousElementSibling.className.indexOf('e-rule-container') > -1) {
                    if (ruleElement.className.indexOf('e-joined-rule') < 0) {
                        ruleElement.className += ' e-joined-rule';
                    }
                    if (ruleElement.previousElementSibling.className.indexOf('e-prev-joined-rule') < 0) {
                        ruleElement.previousElementSibling.className += ' e-prev-joined-rule';
                    }
                }
                if (ruleElement.previousElementSibling && ruleElement.previousElementSibling.className.indexOf('e-group-container') > -1 &&
                    ruleElement.className.indexOf('e-separate-rule') < 0) {
                    ruleElement.className += ' e-separate-rule';
                }
                const args: ActionEventArgs = { requestType: 'template-create', action: type, ruleID: grpEle.id,
                    fields: this.fields, rule: rule };
                eventsArgs = { groupID: grpElem.id.replace(this.element.id + '_', ''), ruleID: grpEle.id.replace(this.element.id + '_', ''),
                    value: rule.field, type: 'field' };
                this.trigger('actionBegin', args);
                this.trigger('change', eventsArgs);
            }
        }
    }
    private changeValue(i: number, args: ButtonChangeEventArgs | InputEventArgs | InputChangeEventArgs | CalendarChangeEventArgs): void {
        let element: Element;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((args as any).element && (args as any).element.classList.contains('e-multiselect')) {
            const multiSelectArgs: MultiSelectChangeEventArgs = args as MultiSelectChangeEventArgs;
            element = multiSelectArgs.element as Element;
        } else if (args.event) {
            element = args.event.target as Element;
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            element = (args as any).element;
        }
        if (element.className.indexOf('e-day') > -1 || element.className.indexOf('e-today') > -1 || element.className.indexOf('e-cell') > -1) {
            const calenderArgs: CalendarChangeEventArgs = args as CalendarChangeEventArgs;
            element = calenderArgs.element;
        }
        const groupElem: Element = closest(element, '.e-group-container');
        const ruleElem: Element = closest(element, '.e-rule-container');
        const groupID: string = groupElem && groupElem.id.replace(this.element.id + '_', '');
        const ruleID: string = ruleElem.id.replace(this.element.id + '_', '');
        const dateElement: CalendarChangeEventArgs = args as CalendarChangeEventArgs;
        if (dateElement.element && dateElement.element.className.indexOf('e-datepicker') > -1) {
            element = dateElement.element;
        }
        let value: string | number | Date | boolean | string[];
        let rbValue: number; let dropDownObj: DropDownList;
        if (element.className.indexOf('e-radio') > -1) {
            // eslint-disable-next-line
            rbValue = parseInt(element.id.split('valuekey')[1], 0);
            dropDownObj =
            getComponent(closest(element, '.e-rule-container').querySelector('.e-filter-input') as HTMLElement, 'dropdownlist');
            this.selectedColumn =  dropDownObj.getDataByValue(dropDownObj.value) as ColumnsModel;
            if (this.selectedColumn.values) {
                value = this.selectedColumn.values[rbValue as number];
            } else {
                const valColl: boolean[] = [true, false];
                value = valColl[rbValue as number];
            }
        } else if (element.className.indexOf('e-multiselect') > -1) {
            value = (getComponent(element as HTMLElement, 'multiselect') as MultiSelect).value as string[];
        } else {
            value = (<InputEventArgs | InputChangeEventArgs | CalendarChangeEventArgs>args).value;
        }
        if ((args as InputChangeEventArgs).name === 'input' && this.immediateModeDelay) {
            window.clearInterval(this.timer);
            this.timer = window.setInterval(
                () => { this.filterValue(groupID, ruleID, value, i, element); }, this.immediateModeDelay );
        } else {
            this.filterValue(groupID, ruleID, value, i, element);
        }
    }

    private filterValue(grID: string, rlID: string, value: string | number | Date | boolean | string[], i: number, ele: Element): void {
        const eventsArgs: ChangeEventArgs = { groupID: grID, ruleID: rlID, value: value, cancel: false, type: 'value' };
        window.clearInterval(this.timer);
        if (!this.isImportRules) {
            this.trigger('beforeChange', eventsArgs, (observedChangeArgs: ChangeEventArgs) => {
                this.changeValueSuccessCallBack(observedChangeArgs, ele, i, grID, rlID);
            });
        } else {
            this.changeValueSuccessCallBack(eventsArgs, ele, i, grID, rlID);
        }
    }

    private changeValueSuccessCallBack(args: ChangeEventArgs, element: Element, i: number, groupID: string, ruleID: string): void {
        if (!args.cancel) {
            this.updateRules(element, args.value, i);
            if (!this.isImportRules) {
                this.trigger('change', { groupID: groupID, ruleID: ruleID, value: args.value, cancel: false, type: 'value' });
            }
        }
    }

    private fieldClose(id: string): void {
        if (this.isFieldChange || this.isDestroy) {
            return;
        }
        this.isFieldClose = true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ddl: any = getComponent(id, 'dropdownlist') as DropDownList;
        const item: HTMLLIElement = ddl.popupObj.element.querySelector('.e-active');
        const itemData: FieldSettingsModel = ddl.getItemData();
        ddl.value = itemData.value;
        const customArgs: DropDownChangeEventArgs = {element: ddl.element, value: itemData.value, isInteracted: true,
            previousItemData: this.prevItemData, previousItem: null, item: item, itemData: itemData, event: null, e: null };
        if (ddl.previousValue !== ddl.value) {
            this.changeField(customArgs);
        }
        this.isFieldChange = false;
    }

    private changeField(args: DropDownChangeEventArgs): void {
        if (args.isInteracted) {
            if (isNullOrUndefined(args.value)) {
                return;
            }
            this.isFieldChange = true;
            this.prevItemData = args.itemData;
            const fieldElem: Element = closest(args.element, '.e-rule-filter') || closest(args.element, '.e-rule-sub-filter');
            const column: ColumnsModel = this.fieldMode === 'DropdownTree' ? this.getColumn(args.value[0]) : this.getColumn(args.value as string);
            if (this.fieldMode === 'DropdownTree' && fieldElem != null) {
                const ddtElem: HTMLInputElement = fieldElem.querySelector('.e-dropdowntree.e-control') as HTMLInputElement;
                const ddt: DropDownTree = getComponent(ddtElem, 'dropdowntree') as DropDownTree;
                if (column) {
                    if (column.type === 'object') {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ddt.value = (args as any).oldValue; ddt.dataBind();
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        if (isNullOrUndefined((args as any).oldValue)) {
                            ddtElem.value = '';
                        } else {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            ddtElem.value = (args as any).oldValue[0];
                        }
                        return;
                    } else {
                        if (!isNullOrUndefined(args.value[0])) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            ddt.value = args.value[0] as any; ddt.dataBind();
                            const result: string = this.getLabelFromColumn(args.value[0]);
                            ddtElem.value = result;
                        }
                    }
                } else {
                    return;
                }
            }
            this.destroySubFields(fieldElem);
            this.subFieldElem = null; this.isNotValueChange = true;
            if (column && column.ruleTemplate) {
                this.templateChange(args.element, column.field as string, 'field');
            } else if (column && column.columns && column.columns[0].ruleTemplate) {
                this.templateChange(args.element, column.columns[0].field as string, 'field');
            } else {
                const groupElem: Element = closest(args.element, '.e-group-container');
                const rules: RuleModel = this.getParentGroup(groupElem);
                let ruleElem: Element = closest(args.element, '.e-rule-container');
                let index: number = 0;
                while (ruleElem && ruleElem.previousElementSibling !== null) {
                    ruleElem = ruleElem.previousElementSibling;
                    index++;
                }
                rules.rules[index as number].value = '';
                this.changeRule(rules.rules[index as number], args);
            }
        }
    }

    private changeRule(rule: RuleModel, ddlArgs: DropDownChangeEventArgs): void {
        if (!ddlArgs.itemData) {
            if (this.fieldMode === 'DropdownTree') {
                const ddt: DropDownTree = getComponent(ddlArgs.element, 'dropdowntree') as DropDownTree;
                if (ddt.value == null) {
                    return;
                }
            } else {
                return;
            }
        }
        const tempRule: RuleModel = {}; let filterElem: Element = closest(ddlArgs.element, '.e-rule-filter');
        filterElem = filterElem ? filterElem : closest(ddlArgs.element, '.e-rule-sub-filter');
        let ddlObj: DropDownList | DropDownTree = getComponent(ddlArgs.element, 'dropdownlist') as DropDownList;
        if (this.fieldMode === 'DropdownTree' && filterElem != null) {
            ddlObj = getComponent(ddlArgs.element, 'dropdowntree') as DropDownTree;
        }
        const element: Element = closest(ddlArgs.element, '.e-group-container');
        const groupID: string = element.id.replace(this.element.id + '_', '');
        this.changeFilter(filterElem, ddlObj, groupID, rule, tempRule, ddlArgs);
    }
    private changeFilter(
        flt: Element, dl: DropDownList | DropDownTree, grID: string, rl: RuleModel, tmpRl: RuleModel, dArg: DropDownChangeEventArgs): void {
        if (flt) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let ddlValue: string | number | boolean | any ;
            if (this.fieldMode === 'DropdownTree') {
                ddlValue = (dl.value[0]);
            } else {
                ddlValue = this.isImportRules ? this.GetRootColumnName(dl.value as string) : dl.value;
            }
            this.selectedColumn = this.getColumn(ddlValue) as ColumnsModel;
            const ruleElem: Element = closest(flt, '.e-rule-container');
            const ruleID: string = ruleElem.id.replace(this.element.id + '_', '');
            const eventsArgs: ChangeEventArgs = { groupID: grID, ruleID: ruleID, selectedField: this.fieldMode === 'DropdownTree' ?
                dl.value[0] : dl.value as string, cancel: false, type: 'field' };
            if (!this.isImportRules) {
                this.trigger('beforeChange', eventsArgs, (observedChangeArgs: ChangeEventArgs) => {
                    this.fieldChangeSuccess(observedChangeArgs, tmpRl, flt, rl, dArg);
                });
            } else {
                this.fieldChangeSuccess(eventsArgs, tmpRl, flt, rl, dArg);
            }
        } else {
            const operatorElem: Element = closest(dArg.element, '.e-rule-operator');
            this.changeOperator(flt, operatorElem, dl, grID, rl, tmpRl, dArg);
        }
    }
    private changeOperator(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        flt: Element, opr: Element, dl: DropDownList | DropDownTree | any, grID: string, rl: RuleModel, tmpRl: RuleModel,
        dArg: DropDownChangeEventArgs): void {
        let ruleElem: Element; let ruleID: string; let eventsArgs: ChangeEventArgs;
        if (opr) {
            ruleElem = closest(opr, '.e-rule-container'); ruleID = ruleElem.id.replace(this.element.id + '_', '');
            eventsArgs = { groupID: grID, ruleID: ruleID, selectedIndex: dl.index, cancel: false, type: 'operator' };
            if (!this.isImportRules) {
                this.trigger('beforeChange', eventsArgs, (observedChangeArgs: ChangeEventArgs) => {
                    this.operatorChangeSuccess(observedChangeArgs, flt, tmpRl, rl, dArg);
                });
            } else {
                this.operatorChangeSuccess(eventsArgs, flt, tmpRl, rl, dArg);
            }
        } else {
            this.changeRuleValues(flt, rl, tmpRl, dArg);
        }
    }
    private fieldChangeSuccess(
        args: ChangeEventArgs, tempRule: RuleModel, filterElem: Element, rule: RuleModel, ddlArgs: DropDownChangeEventArgs): void {
        const ruleElem: Element = closest(filterElem, '.e-rule-container');
        const operatorElem: Element = closest(ddlArgs.element, '.e-rule-operator');
        const element: Element = closest(ddlArgs.element, '.e-group-container');
        const groupID: string = element.id.replace(this.element.id + '_', '');
        const ddlObj: DropDownList = getComponent(ddlArgs.element, 'dropdownlist') as DropDownList;
        const tooltipElem: NodeListOf<Element> = ruleElem.querySelectorAll('.e-tooltip.e-input-group');
        for (let i: number = 0; i < tooltipElem.length; i++) {
            (getComponent(tooltipElem[i as number] as HTMLElement, 'tooltip') as Tooltip).destroy();
        }
        if (!args.cancel) {
            if (isNullOrUndefined(this.selectedColumn)) {
                return;
            }
            tempRule.type = this.selectedColumn.type;
            if (ruleElem.querySelector('.e-template')) {
                rule.value = '';
            }
            if (this.selectedColumn.type === 'object' && this.fieldMode === 'Default') {
                tempRule.type = this.selectedColumn.columns[0].type;
                while (this.selectedColumn.columns) {
                    this.createSubFields(filterElem, rule, tempRule, ddlArgs);
                }
            } else {
                this.destroySubFields(filterElem);
                this.changeOperator(filterElem, operatorElem, ddlObj, groupID, rule, tempRule, ddlArgs);
            }
        } else {
            this.changeOperator(filterElem, operatorElem, ddlObj, groupID, rule, tempRule, ddlArgs);
        }
    }

    private destroySubFields(filterElem: Element): void {
        while (filterElem && filterElem.nextElementSibling.classList.contains('e-rule-sub-filter')) {
            this.destroyControls(filterElem);
            filterElem.nextElementSibling.remove();
        }
    }

    private createSubFields(filterElem: Element, rule: RuleModel, tempRule: RuleModel, ddlArgs: DropDownChangeEventArgs) : void {
        let subFieldValue : boolean = false;
        const fieldElem: Element = closest(filterElem, '.e-rule-field');
        const tempElem: Element = this.createElement('div', { attrs: { class: 'e-rule-sub-filter', id: 'subfilter' + this.subFilterCounter } });
        fieldElem.insertBefore(tempElem, fieldElem.querySelector('.e-rule-operator'));
        const ruleId: string = closest(tempElem, '.e-rule-container').id;
        const subFieldElem: Element = this.createElement('input', { attrs: { type: 'text', id: ruleId + '_subfilterkey' + this.subFilterCounter } });
        tempElem.appendChild(subFieldElem);
        const height: string = (this.element.className.indexOf('e-device') > -1) ? '250px' : '200px';
        const subFieldData: string[] = Object.keys(this.selectedColumn.columns[0]);
        let ddlField: DropDownListModel;
        ddlField = {
            dataSource: this.selectedColumn.columns as { [key: string]: Object }[],
            fields: this.fields,
            placeholder: this.l10n.getConstant('SelectField'),
            popupHeight: ((subFieldData.length > 5) ? height : 'auto'),
            change: this.changeField.bind(this),
            index: 0,
            open: this.popupOpen.bind(this, false)
        };
        if (this.fieldModel) {
            ddlField = {...ddlField, ...this.fieldModel as DropDownListModel};
        }
        const dropDownList: DropDownList = new DropDownList(ddlField);
        dropDownList.appendTo('#' + ruleId + '_subfilterkey' + this.subFilterCounter);
        if (this.isImportRules || (this.previousColumn && this.previousColumn.ruleTemplate &&
            this.GetRootColumnName(rule.field) === this.GetRootColumnName(this.previousColumn.field))) {
            const subField: ColumnsModel[] = this.selectedColumn.columns;
            for (let i: number = 0; i < subField.length; i++) {
                if (rule.field === subField[i as number].field || rule.field.indexOf(subField[i as number].field) > -1) {
                    dropDownList.value = subField[i as number].field;
                    this.selectedColumn = subField[i as number];
                    subFieldValue = true;
                    break;
                }
            }
        }
        this.subFilterCounter++;
        this.subFieldElem = subFieldElem as HTMLElement;
        // eslint-disable-next-line
        ddlArgs.itemData = ddlArgs.itemData;
        if (!subFieldValue && this.selectedColumn.columns) {
            if (!subFieldValue && this.isImportRules) {
                dropDownList.value = null;
            }
            this.selectedColumn = this.selectedColumn.columns[0];
        }
        this.previousColumn = this.selectedColumn;
        if (!this.selectedColumn.columns) {
            this.changeRuleValues(tempElem, rule, tempRule, ddlArgs);
        }
    }

    private operatorChangeSuccess(
        eventsArgs: ChangeEventArgs, filterElem: Element, tempRule: RuleModel, rule: RuleModel, ddlArgs: DropDownChangeEventArgs): void {
        if (!eventsArgs.cancel) {
            const operatorElem: Element = closest(ddlArgs.element, '.e-rule-operator');
            const valElem: Element = operatorElem.nextElementSibling;
            const dropDownObj: DropDownList = getComponent(ddlArgs.element, 'dropdownlist') as DropDownList;
            const prevOper: string = rule.operator ? rule.operator.toString().toLowerCase() : '';
            tempRule.operator = dropDownObj.value.toString();
            const currOper: string = tempRule.operator.toLowerCase();
            if (tempRule.operator.toLowerCase().indexOf('between') > -1 || (tempRule.operator.toLowerCase().indexOf('in') > -1
                && tempRule.operator.toLowerCase().indexOf('contains') < 0)) {
                filterElem = operatorElem.previousElementSibling;
                tempRule.type = rule.type;
                if (tempRule.operator.toLowerCase().indexOf('in') < 0 || prevOper.indexOf('in') < 0) {
                    rule.value = [];
                }
            } else if (typeof rule.value === 'object' && rule.value != null) {
                rule.value = rule.value.length > 0 ? rule.value[0] : rule.type === 'number' ? 0 : '';
            }
            if (ddlArgs.previousItemData) {
                const prevValue: string = ddlArgs.previousItemData.value.toString().toLowerCase();
                if ((prevValue.indexOf('between') > -1 || (prevValue.indexOf('in') > -1 || (prevValue.indexOf('null') > -1)
                || (prevValue.indexOf('empty') > -1)) && prevValue.indexOf('contains') < 0)) {
                    filterElem = operatorElem.previousElementSibling; tempRule.type = rule.type;
                }
            }
            if ((prevOper.indexOf('in') > -1 && prevOper.indexOf('in') < 5) && (currOper.indexOf('in') > -1
                && currOper.indexOf('in') < 5)) {
                filterElem = null;
            }
            if (tempRule.operator.indexOf('null') > -1 || (tempRule.operator.indexOf('empty') > -1 )) {
                const parentElem: HTMLElement = operatorElem.parentElement.querySelector('.e-rule-value') as HTMLElement;
                const tooltipElem: HTMLElement = parentElem.querySelector('.e-tooltip.e-input-group');
                if (tooltipElem) {
                    (getComponent( tooltipElem, 'tooltip') as Tooltip).destroy();
                }
                removeClass([parentElem], 'e-show'); addClass([parentElem], 'e-hide');
            }
            if (valElem && this.getColumn(rule.field).template) {
                filterElem = operatorElem.previousElementSibling;
            }
            this.changeRuleValues(filterElem, rule, tempRule, ddlArgs);
        }
    }

    private changeRuleValues(filterElem: Element, rule: RuleModel, tempRule: RuleModel, ddlArgs: DropDownChangeEventArgs): void {
        let operatorElem: Element = closest(ddlArgs.element, '.e-rule-operator'); let isSub: boolean;
        let ddlObj: DropDownList; let operatorList: { [key: string]: Object }[]; let oprElem: Element;
        if (filterElem) {
            operatorElem = filterElem.nextElementSibling;
            if (filterElem.classList.contains('e-rule-sub-filter')) {
                tempRule.type = this.selectedColumn.type; isSub = operatorElem.classList.contains('e-rule-sub-filter');
                operatorElem = isSub ? operatorElem.nextElementSibling : operatorElem;
            }
            addClass([operatorElem], 'e-operator');
            if (operatorElem.childElementCount) {
                ddlObj = getComponent(operatorElem.querySelector('.e-dropdownlist') as HTMLElement, 'dropdownlist') as DropDownList;
                tempRule.operator = ddlObj.value as string;
                let fieldObj: DropDownList | DropDownTree;
                if (this.fieldMode === 'DropdownTree') {
                    fieldObj = getComponent(filterElem.querySelector('.e-dropdowntree') as HTMLElement, 'dropdowntree') as DropDownTree;
                } else {
                    fieldObj = getComponent(filterElem.querySelector('.e-dropdownlist') as HTMLElement, 'dropdownlist') as DropDownList;
                }
                tempRule.type = this.fieldMode === 'DropdownTree' ? this.getColumn(fieldObj.value[0]).type :
                    this.getColumn(fieldObj.value as string).type;
                const itemData: ColumnsModel = ddlArgs.itemData as ColumnsModel;
                this.renderValues(
                    operatorElem, itemData, ddlArgs.previousItemData as ColumnsModel, true, rule, tempRule, ddlArgs.element);
            } else {
                const ruleId: string = closest(operatorElem, '.e-rule-container').id;
                oprElem = this.createElement('input', { attrs: { type: 'text', id: ruleId + '_operatorkey' } });
                operatorElem.appendChild(oprElem);
                if (this.selectedColumn.operators) {
                    operatorList = this.selectedColumn.operators;
                } else if (ddlArgs.itemData) {
                    operatorList = this.customOperators[this.selectedColumn.type + 'Operator'];
                }
                const height: string = (this.element.className.indexOf('e-device') > -1) ? '250px' : '200px';
                let value: string = operatorList[0].value as string;
                value = rule ? (rule.operator !== '' ? rule.operator : value) : value;
                let ddlOperator: DropDownListModel;
                ddlOperator = {
                    dataSource: operatorList,
                    fields: { text: 'key', value: 'value' },
                    placeholder: this.l10n.getConstant('SelectOperator'),
                    popupHeight: ((operatorList.length > 5) ? height : 'auto'),
                    change: this.changeField.bind(this),
                    index: 0,
                    value: value,
                    open: this.popupOpen.bind(this, false)
                };
                if (this.operatorModel) {
                    ddlOperator = {...ddlOperator, ...this.operatorModel};
                }
                const dropDownList: DropDownList = new DropDownList(ddlOperator);
                dropDownList.appendTo('#' + ruleId + '_operatorkey');
                tempRule.operator = (rule && rule.operator !== '' && !isNullOrUndefined(rule.operator)) ? rule.operator : operatorList[0].value as string;
                if (this.isImportRules) {
                    tempRule.type = this.selectedColumn.type;
                    tempRule.operator = rule.operator;
                }
                this.renderValues(
                    operatorElem, this.selectedColumn, ddlArgs.previousItemData as ColumnsModel,
                    false, rule, tempRule, ddlArgs.element);
            }
        }
        if (!this.isImportRules) {
            this.updateRules(ddlArgs.element, ddlArgs.item);
        }
    }

    private popupOpen(isField: boolean, args: PopupEventArgs): void {
        if (this.enableRtl) {
            addClass([args.popup.element], 'e-rtl' );
        }
        if (isField) {
            this.isFieldClose = false;
        }
    }

    private destroyControls(target: Element, isRuleTemplate?: boolean): void {
        const element: Element = isRuleTemplate ? target : target.nextElementSibling;
        const inputElement: NodeListOf<HTMLElement> = element.querySelectorAll('input.e-control') as NodeListOf<HTMLElement>;
        const divElement: NodeListOf<HTMLElement> = element.querySelectorAll('div.e-control:not(.e-handle)');
        const columns: ColumnsModel[] = this.columns;
        for (let i: number = 0, len: number = inputElement.length; i < len; i++) {
            if (inputElement[i as number].classList.contains('e-textbox')) {
                (getComponent(inputElement[i as number], 'textbox') as TextBox).destroy();
                detach(select('input#' + inputElement[i as number].id, element));
            } else if (inputElement[i as number].classList.contains('e-dropdownlist')) {
                if (this.allowValidation && inputElement[i as number].parentElement.className.indexOf('e-tooltip') > -1) {
                    (getComponent(inputElement[i as number].parentElement, 'tooltip') as Tooltip).destroy();
                }
                (getComponent(inputElement[i as number], 'dropdownlist') as DropDownList).destroy();
            } else if (inputElement[i as number].classList.contains('e-radio')) {
                (getComponent(inputElement[i as number], 'radio') as RadioButton).destroy();
            } else if (inputElement[i as number].classList.contains('e-numerictextbox')) {
                (getComponent(inputElement[i as number], 'numerictextbox') as NumericTextBox).destroy();
                detach(select('input#' + inputElement[i as number].id, element));
            } else if (inputElement[i as number].classList.contains('e-datepicker')) {
                (getComponent(inputElement[i as number], 'datepicker') as DatePicker).destroy();
            } else if (inputElement[i as number].classList.contains('e-multiselect')) {
                (getComponent(inputElement[i as number], 'multiselect') as MultiSelect).destroy();
            } else if (inputElement[i as number].className.indexOf('e-template') > -1) {
                const clsName: string = inputElement[i as number].className;
                for (let j: number = 0, jLen: number = columns.length; j < jLen; j++) {
                    if (columns[j as number].template && clsName.indexOf(columns[j as number].field) > -1) {
                        this.templateDestroy(columns[j as number], inputElement[i as number].id);
                        break;
                    }
                }
            }
            if (document.getElementById(inputElement[i as number].id)) {
                detach(inputElement[i as number]);
            }
        }
        for (let i: number = 0, len: number = divElement.length; i < len; i++) {
            if (divElement[i as number].className.indexOf('e-template') > -1) {
                const clsName: string = divElement[i as number].className;
                for (let j: number = 0, jLen: number = columns.length; j < jLen; j++) {
                    if (columns[j as number].template && clsName.indexOf(columns[j as number].field) > -1) {
                        this.templateDestroy(columns[j as number], divElement[i as number].id);
                        break;
                    }
                }
            }
            detach(divElement[i as number]);
        }
        const templateElement: NodeListOf<HTMLElement> = element.querySelectorAll('.e-template:not(.e-control)') as NodeListOf<HTMLElement>;
        for (let i: number = 0, len: number = templateElement.length; i < len; i++) {
            detach(templateElement[i as number]);
        }
    }
    private templateDestroy(column: ColumnsModel, elemId: string): void {
        let template: TemplateColumn;
        if (typeof column.template !== 'string' || (column.template as TemplateColumn).destroy === undefined) {
            template = column.template as TemplateColumn;
        } else {
            return;
        }
        let temp: Function = template.destroy as Function;
        if (template.destroy) {
            let templateElements: NodeListOf<Element>;
            if (document.getElementById(elemId)) {
                templateElements = closest(document.getElementById(elemId), '.e-rule-field').querySelectorAll('.e-template');
            }
            if (typeof temp === 'string') {
                temp = getValue(temp, window);
                temp({ field: column.field, elementId: elemId, elements: templateElements });
            } else {
                (template.destroy as Function)({ field: column.field, elementId: elemId, elements: templateElements });
            }
        }
    }
    /**
     * Return values bound to the column.
     *
     * @param {string} field - 'field' to be passed to get the field values.
     * @returns {object[]} - Values bound to the column
     */
    public getValues(field: string): object[] {
        const original: object = {}; const result: object[] = []; let value: string; let fieldColl: string[] = [];
        if (this.separator.length > 0) {
            fieldColl = field.split(this.separator);
        }
        const dataSource: object[] = this.dataColl;
        if (this.dataColl[1]) {
            for (let i: number = 0, iLen: number = dataSource.length; i < iLen; i++) {
                const data: object = {};
                if (fieldColl.length > 1) {
                    let dataObj: object = dataSource[i as number]; let fieldStr: string;
                    for (let j: number = 0, jLen: number = fieldColl.length; j < jLen; j++) {
                        fieldStr = fieldColl[j as number];
                        if (fieldColl.length === (j + 1)) {
                            value = dataObj[`${fieldStr}`];
                            if (Number(dataObj[`${fieldStr}`]) === dataObj[`${fieldStr}`] && dataObj[`${fieldStr}`] % 1 !== 0) {
                                value = dataObj[`${fieldStr}`].toString();
                            }
                        } else {
                            dataObj = dataObj[`${fieldStr}`];
                        }
                    }
                } else {
                    value = dataSource[i as number][`${field}`];
                    if (Number(dataSource[i as number][`${field}`]) === dataSource[i as number][`${field}`] && dataSource[i as number][`${field}`] % 1 !== 0) {
                        value = dataSource[i as number][`${field}`].toString();
                    }
                }
                if (!(value in original)) {
                    original[`${value}`] = 1;
                    if (fieldColl.length > 1) {
                        this.createNestedObject(data, fieldColl, value);
                    } else {
                        data[`${field}`] = value;
                    }
                    result.push(data);
                }
            }
        }
        return result;
    }

    private createNestedObject(obj: object, fieldColl: string[], value: string | number): void {
        let key: string; const lastIndex: number = fieldColl.length - 1;
        for (let k: number = 0; k < lastIndex; ++ k) {
            key = fieldColl[k as number];
            if (!(key in obj)) {
                obj[`${key}`] = {};
            }
            obj = obj[`${key}`];
        }
        obj[fieldColl[lastIndex as number]] = value;
    }

    private getDistinctValues(dataSource: object[], field: string): object[] {
        const original: object = {};
        const result: object[] = [];
        let nest: string[] = [];
        let value: string = ''; const isNested: number = field.indexOf(this.separator);
        for (let i: number = 0, iLen: number = dataSource.length; i < iLen; i++) {
            if (isNested === 0) {
                value = dataSource[i as number][`${field}`];
            } else {
                nest = field.split(this.separator);
                // eslint-disable-next-line @typescript-eslint/tslint/config
                nest.forEach (element => {
                    if (value) {
                        value = value[`${element}`];
                    } else {
                        value = dataSource[i as number][`${element}`];
                    }
                });
            }
            if (Number(dataSource[i as number][`${field}`]) === dataSource[i as number][`${field}`] && dataSource[i as number][`${field}`] % 1 !== 0) {
                value = dataSource[i as number][`${field}`].toString();
            }
            const data: object = {};
            if (!(value in original)) {
                original[`${value}`] = 1;
                if (isNested === 0) {
                    data[`${field}`] = value;
                } else {
                    data[nest[nest.length - 1]] = value;
                }
                result.push(data);
            }
        }
        return result;
    }
    private renderMultiSelect(rule: ColumnsModel, parentId: string, i: number, selectedValue: string[] | number[], values:
    string[] | number[] | boolean[]): void {
        let isFetched: boolean = false; let ds: object[]; let isValues: boolean = false; this.isGetNestedData = false;
        if (this.dataColl[1]) {
            if (Object.keys(this.dataColl[1]).indexOf(rule.field) > -1) {
                isFetched = true;
                ds = this.getDistinctValues(this.dataColl, rule.field);
            }
        }
        isFetched = rule.columns ? false : isFetched;
        if (!this.dataColl.length && values.length) {
            isValues = true;
        }
        let fieldValue: string = this.selectedRule.field;
        const isNested: number = this.selectedRule.field.indexOf(this.separator);
        if (isNested !== 0 && this.fieldMode !== 'DropdownTree') {
            const nest: string[] = this.selectedRule.field.split(this.separator);
            fieldValue = nest[nest.length - 1];
        }
        let multiSelectValue: MultiSelectModel;
        multiSelectValue = {
            dataSource: isValues ? values : (isFetched ? ds as { [key: string]: object }[] : this.dataManager),
            query: new Query([rule.field]),
            fields: { text: fieldValue, value: fieldValue },
            placeholder: this.l10n.getConstant('SelectValue'),
            value: selectedValue,
            mode: 'CheckBox',
            width: '100%',
            change: this.changeValue.bind(this, i),
            close: this.closePopup.bind(this, i),
            actionBegin: this.multiSelectOpen.bind(this, parentId + '_valuekey' + i),
            open: this.popupOpen.bind(this, false)
        };
        if (this.valueModel && this.valueModel.multiSelectModel) {
            multiSelectValue = {...multiSelectValue, ...this.valueModel.multiSelectModel};
        }
        const multiSelectObj: MultiSelect = new MultiSelect(multiSelectValue);
        multiSelectObj.appendTo('#' + parentId + '_valuekey' + i);
        this.updateRules(multiSelectObj.element, selectedValue, 0);
    }
    private multiSelectOpen(parentId: string, args: PopupEventArgs): void {
        if (this.dataSource instanceof DataManager) {
            const element: Element = document.getElementById(parentId);
            const dropDownObj: DropDownList =
            getComponent(closest(element, '.e-rule-container').querySelector('.e-filter-input') as HTMLElement, 'dropdownlist');
            this.selectedColumn =  dropDownObj.getDataByValue(dropDownObj.value) as ColumnsModel;
            const value: string = this.selectedColumn.field; let isFetched: boolean = false;
            if (this.dataColl[1]) {
                if (Object.keys(this.dataColl[1]).indexOf(value) > -1) {
                    isFetched = true;
                }
                const isNest: number = value.indexOf(this.separator);
                if (isNest !== 0 && this.isGetNestedData) {
                    isFetched = true;
                }
            }
            if (!isFetched) {
                args.cancel = true;
                this.bindMultiSelectData(element, value);
            }
        }
    }
    private bindMultiSelectData(element: Element, value: string): void {
        this.getMultiSelectData(element, value);
    }
    private getMultiSelectData(element: Element, value: string): void {
        let dummyData: Object[]; const deferred: Deferred = new Deferred();
        const data: Promise<Object> = this.dataManager.executeQuery(new Query().select(value)) as Promise<Object>;
        const multiselectObj: MultiSelect = (getComponent(element as HTMLElement, 'multiselect') as MultiSelect);
        multiselectObj.hideSpinner();
        this.createSpinner(closest(element, '.e-multi-select-wrapper').parentElement);
        showSpinner(closest(element, '.e-multi-select-wrapper').parentElement as HTMLElement);
        data.then((e: {actual: {result: Object[], count: number}, result: Object[]}) => {
            if (e.actual && e.actual.result) {
                dummyData = e.actual.result;
            } else {
                dummyData = e.result;
            }
            this.dataColl = extend(this.dataColl, dummyData, [], true) as object [];
            multiselectObj.dataSource = this.getDistinctValues(this.dataColl, value) as {[key: string]: object}[];
            this.isGetNestedData = true;
            hideSpinner(closest(element, '.e-multi-select-wrapper').parentElement as HTMLElement);
        }).catch((e: ReturnType) => {
            deferred.reject(e);
        });
    }
    private createSpinner(element: Element): void {
        const spinnerElem: HTMLElement = this.createElement('span', { attrs: { class: 'e-qb-spinner' } });
        element.appendChild(spinnerElem);
        createSpinner({target: spinnerElem, width: Browser.isDevice ? '16px' : '14px' });
    }
    private closePopup(i: number, args: PopupEventArgs): void {
        const element: Element = document.getElementById(args.popup.element.id.replace('_popup', ''));
        if (element) {
            const value: string[] = (getComponent(element as HTMLElement, 'multiselect') as MultiSelect).value as string[];
            this.updateRules(element, value, i);
        }
    }
    private processTemplate(target: Element, itemData: ColumnsModel, rule: RuleModel, tempRule: RuleModel): void {
        const container: Element = closest(target, '.e-rule-container');
        const tempElements: NodeListOf<Element> = container.querySelectorAll('.e-template');
        const filterElem: HTMLElement = container.querySelector('.e-rule-filter .e-filter-input') as HTMLElement;
        const ddlObj: DropDownList | DropDownTree = this.fieldMode === 'DropdownTree' ? (getComponent(filterElem, 'dropdowntree') as DropDownTree)
            : (getComponent(container.querySelector('.e-rule-filter .e-filter-input') as HTMLElement, 'dropdownlist') as DropDownList);
        const column: ColumnsModel = this.fieldMode === 'DropdownTree' ? this.getColumn(ddlObj.value[0]) : this.getColumn(ddlObj.value as string);
        if (typeof itemData.template === 'string' || (itemData.template as TemplateColumn).write === undefined) {
            const args: ActionEventArgs = { rule: rule, ruleID: container.id, operator: tempRule.operator, field: column.field,
                requestType: 'value-template-create' };
            this.trigger('actionBegin', args);
        } else {
            const template: TemplateColumn = itemData.template as TemplateColumn;
            if (typeof template.write === 'string') {
                getValue(template.write, window)({ elements: tempElements.length > 1 ? tempElements : tempElements[0], values: rule.value,
                    operator: tempRule.operator, field: column.field, dataSource: column.values });
            } else if (typeof itemData.template !== 'function') {
                (itemData.template.write as Function)({ elements: tempElements.length > 1 ? tempElements : tempElements[0],
                    values: rule.value, operator: tempRule.operator, field: column.field, dataSource: column.values });
            }
        }
    }
    private getItemData(parentId: string): ColumnsModel {
        let fieldObj: DropDownList | DropDownTree = getComponent(document.getElementById(parentId + '_filterkey'), 'dropdownlist') as DropDownList;
        if (this.fieldMode === 'DropdownTree') {
            fieldObj = getComponent(document.getElementById(parentId + '_filterkey'), 'dropdowntree') as DropDownTree;
        }
        return this.fieldMode === 'DropdownTree' ? this.getColumn(fieldObj.value[0]) : this.getColumn(fieldObj.value as string);
    }
    private setDefaultValue(parentId?: string, isArryValue?: boolean, isNumber?: boolean):
    string[] | number[] | string | number | boolean | Date {
        const itemData: ColumnsModel = this.getItemData(parentId);
        if (isNullOrUndefined(itemData.value)) {
            return isNumber ? isArryValue ? [0, 0] : 0 : isArryValue ? [] : '';
        }
        if (isArryValue) {
            if (!(itemData.value instanceof Array)) {
                return [itemData.value] as string[] | number[];
            }
        } else {
            if (itemData.value instanceof Array) {
                return itemData.value[0];
            }
        }
        return itemData.value;
    }
    private renderStringValue(parentId: string, rule: RuleModel, operator: string, idx: number, ruleValElem: HTMLElement): void {
        let selectedVal: string[]; const columnData: ColumnsModel = this.getItemData(parentId); let selectedValue: string;
        const isTemplate: boolean = (typeof columnData.template === 'string');
        if (this.isImportRules || this.isPublic || isTemplate) {
            selectedValue = rule.value as string;
        } else {
            selectedValue = this.setDefaultValue(parentId, false, false) as string;
        }
        if ((operator === 'in' || operator === 'notin') && (this.dataColl.length || columnData.values )) {
            selectedVal = this.isImportRules ? rule.value as string[] : this.setDefaultValue(parentId, true, false) as string[];
            this.renderMultiSelect(columnData, parentId, idx, selectedVal, columnData.values);
            if (this.displayMode === 'Vertical' || this.element.className.indexOf('e-device') > -1) {
                ruleValElem.style.width = '100%';
            } else {
                ruleValElem.style.width = null;
                ruleValElem.style.minWidth = '200px';
            }
        } else {
            if (operator === 'in' || operator === 'notin') {
                selectedVal = this.isImportRules ? rule.value as string[] : this.setDefaultValue(parentId, true, false) as string[];
                selectedValue = selectedVal.join(',');
            }
            let txtBox: TextBoxModel;
            txtBox = {
                placeholder: this.l10n.getConstant('SelectValue'),
                input: this.changeValue.bind(this, idx)
            };
            if (this.valueModel && this.valueModel.textBoxModel) {
                txtBox = {...txtBox, ...this.valueModel.textBoxModel};
            }
            const inputobj: TextBox = new TextBox(txtBox);
            inputobj.appendTo('#' + parentId + '_valuekey' + idx);
            inputobj.value = selectedValue;
            inputobj.dataBind();
        }
    }
    private renderNumberValue(
        parentId: string, rule: RuleModel, operator: string, idx: number, ruleValElem: HTMLElement, itemData: ColumnsModel,
        length: number): void {
        const columnData: ColumnsModel = this.getItemData(parentId);
        const isTemplate: boolean = (typeof columnData.template === 'string');
        let selectedVal: number | number[] =
        (this.isImportRules || this.isPublic || isTemplate) ? rule.value as number : this.setDefaultValue(parentId, false, true) as number;
        if ((operator === 'in' || operator === 'notin') && (this.dataColl.length || columnData.values)) {
            selectedVal = this.isImportRules ? rule.value as number[] : this.setDefaultValue(parentId, true, false) as number[];
            this.renderMultiSelect(columnData, parentId, idx, selectedVal, columnData.values);
            if (this.element.className.indexOf('e-device') > -1 || this.displayMode === 'Vertical') {
                ruleValElem.style.width = '100%';
            } else {
                ruleValElem.style.minWidth = '200px'; ruleValElem.style.width = null;
            }
        } else if (operator === 'in' || operator === 'notin') {
            selectedVal = this.isImportRules ? rule.value as number[] : this.setDefaultValue(parentId, true, false) as number[];
            const selVal: string = selectedVal.join(',');
            let txtInp: TextBoxModel;
            txtInp = {
                placeholder: this.l10n.getConstant('SelectValue'),
                input: this.changeValue.bind(this, idx)
            };
            if (this.valueModel && this.valueModel.textBoxModel) {
                txtInp = {...txtInp, ...this.valueModel.textBoxModel};
            }
            const input: TextBox = new TextBox(txtInp);
            input.appendTo('#' + parentId + '_valuekey' + idx);
            input.value = selVal;
            input.dataBind();
        } else {
            itemData = columnData;
            const min: number = (itemData.validation && itemData.validation.min) ? itemData.validation.min : 0;
            const max: number =
                (itemData.validation && itemData.validation.max) ? itemData.validation.max : Number.MAX_VALUE;
            const format: string | FormatObject = itemData.format ? itemData.format : 'n';
            if (length > 1 && rule) {
                selectedVal = rule.value[idx as number] ? rule.value[idx as number] : this.setDefaultValue(parentId, true, true) as number;
            }
            let numericTxt: NumericTextBoxModel;
            numericTxt = {
                value: (selectedVal instanceof Array) ? selectedVal[idx as number] : selectedVal as number,
                format: format as string, min: min, max: max, width: '100%',
                step: itemData.step ? itemData.step : 1,
                change: this.changeValue.bind(this, idx)
            };
            if (this.valueModel && this.valueModel.numericTextBoxModel) {
                numericTxt = {...numericTxt, ...this.valueModel.numericTextBoxModel};
            }
            const numeric: NumericTextBox = new NumericTextBox(numericTxt);
            numeric.appendTo('#' + parentId + '_valuekey' + idx);
            numeric.element.setAttribute('aria-label', itemData.label + ' ' + 'Value');
        }
    }
    private processValueString(value: string, type: string): string[] | number[] {
        const numArr: number[] = []; const strArr: string[] = value.split(',');
        if (type === 'string') {
            return strArr;
        } else {
            for (let k: number = 0, kLen: number = strArr.length; k < kLen; k++) {
                numArr.push(Number(strArr[k as number]));
            }
            return numArr;
        }
    }
    private parseDate(value: string, format?: string | FormatObject): Date {
        let formatOpt: DateFormatOptions; let selectedValue: Date;
        if (format) {
            const dParser: Function = this.intl.getDateParser({ skeleton: 'full', type: 'dateTime' });
            formatOpt = this.getFormat(format);
            selectedValue = dParser(value);
            if (isNullOrUndefined(selectedValue)) {
                selectedValue = this.intl.parseDate(value, formatOpt);
            }
        } else {
            selectedValue = new Date(value);
        }
        return selectedValue;
    }
    private renderControls(target: Element, itemData: ColumnsModel, rule: RuleModel, tempRule: RuleModel, isRendered: boolean): void {
        addClass([target.parentElement.querySelector('.e-rule-value')], 'e-value');
        removeClass([target.parentElement.querySelector('.e-rule-value')], 'e-hide');
        addClass([target.parentElement.querySelector('.e-rule-value')], 'e-show');
        if (itemData.template && ((itemData.template as TemplateColumn).create || isRendered)) {
            this.processTemplate(target, itemData, rule, tempRule);
        } else {
            let length: number;
            if (tempRule.type === 'boolean') {
                length = this.selectedColumn.values ? this.selectedColumn.values.length : 2;
            } else {
                length = tempRule.operator && tempRule.operator.toString().toLowerCase().indexOf('between') > -1 ? 2 : 1;
            }
            const parentId: string = closest(target, '.e-rule-container').id; let ruleValElem: HTMLElement;
            const operator: string = tempRule.operator.toString();
            if (target.className.indexOf('e-rule-operator') > -1 || target.className.indexOf('e-rule-filter') > -1) {
                ruleValElem = target.parentElement.querySelector('.e-rule-value') as HTMLElement;
                if (this.element.className.indexOf('e-device') > -1 || this.displayMode === 'Vertical') {
                    ruleValElem.style.width = '100%';
                } else {
                    if (operator !== 'in' && operator !== 'notin') {
                        addClass([ruleValElem], 'e-custom-value');
                    } else {
                        removeClass([ruleValElem], 'e-custom-value');
                    }
                }
                for (let i: number = 0; i < length; i++) {
                    switch (tempRule.type) {
                    case 'string': {
                        this.renderStringValue(parentId, rule, operator, i, ruleValElem);
                    }
                        break;
                    case 'number': {
                        this.renderNumberValue(parentId, rule, operator, i, ruleValElem, itemData, length);
                    }
                        break;
                    case 'boolean':
                        this.processBoolValues(itemData, rule, parentId, i);
                        break;
                    case 'date': {
                        let selectedValue: Date = new Date(); let selVal: string; let column: ColumnsModel;
                        let format: string | FormatObject = itemData.format; let datepick: DatePicker; let datePicker: DatePickerModel;
                        const place: string = this.l10n.getConstant('SelectValue');
                        const isTemplate: boolean = (typeof itemData.template === 'string');
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        if (!itemData.field && !(itemData as any).key && itemData.value) {
                            if (itemData.value instanceof Date) {
                                selectedValue = itemData.value as Date;
                            } else {
                                selectedValue = this.parseDate(itemData.value as string, itemData.format);
                            }
                        }
                        if (!itemData.format && rule && rule.field !== '') {
                            column = this.getColumn(rule.field); format = column.format;
                        }
                        if ((this.isImportRules || this.isPublic || isTemplate) && rule) {
                            column = this.getColumn(rule.field); format = column.format;
                            if (rule.value) {
                                selVal = (length > 1) ? rule.value[i as number] as string : rule.value as string;
                                selectedValue = this.parseDate(selVal, column.format);
                            } else {
                                selectedValue = rule.value as null;
                            }
                        }
                        if (format) {
                            const formatObj: DateFormatOptions = this.getFormat(format);
                            if (formatObj.skeleton) {
                                datePicker = {
                                    locale: this.getLocale(), value: selectedValue,
                                    placeholder: place, format: formatObj, change: this.changeValue.bind(this, i) };
                                if (this.valueModel && this.valueModel.datePickerModel) {
                                    datePicker = {...datePicker, ...this.valueModel.datePickerModel};
                                }
                                datepick = new DatePicker(datePicker);
                            } else {
                                datePicker = {
                                    value: selectedValue, locale: this.getLocale(),  placeholder: place,
                                    format: formatObj.format, change: this.changeValue.bind(this, i) };
                                if (this.valueModel && this.valueModel.datePickerModel) {
                                    datePicker = {...datePicker, ...this.valueModel.datePickerModel};
                                }
                                datepick = new DatePicker(datePicker);
                            }
                        } else {
                            datePicker = {
                                locale: this.getLocale(),  value: selectedValue,
                                placeholder: place, change: this.changeValue.bind(this, i) };
                            if (this.valueModel && this.valueModel.datePickerModel) {
                                datePicker = {...datePicker, ...this.valueModel.datePickerModel};
                            }
                            datepick = new DatePicker(datePicker);
                        }
                        datepick.appendTo('#' + parentId + '_valuekey' + i);
                        if (!rule.value) {
                            const elem: Element = document.getElementById(parentId + '_valuekey' + i);
                            this.updateRules(elem, selectedValue, null, this.isNotValueChange); this.isNotValueChange = false;
                        }
                    }
                        break;
                    }
                }
            }
        }
    }

    private processBoolValues(itemData: ColumnsModel, rule: RuleModel, parentId: string, i: number): void {
        let isCheck: boolean = false; let value: string; let orgValue: string | boolean;
        if (isNullOrUndefined(rule.type) && itemData) {
            rule.type = itemData.type;
        }
        let label: string;
        if (itemData.values) {
            const values: string[] = itemData.values as string[];
            if (rule.type === 'boolean' && !isNullOrUndefined(rule.value)) {
                isCheck = values[i as number].toLowerCase() === rule.value.toString().toLowerCase();
            } else if (itemData.value) {
                isCheck = values[i as number].toLowerCase() === itemData.value.toString().toLowerCase();
            } else if (i === 0) {
                isCheck = true;
            }
            orgValue = value = label = values[i as number];
        } else {
            const values: boolean[] = [true, false];
            if (rule.type === 'boolean' && !isNullOrUndefined(rule.value)) {
                isCheck = values[i as number].toString().toLowerCase() === rule.value.toString().toLowerCase();
            } else if (itemData.value) {
                isCheck = values[i as number].toString().toLowerCase() === itemData.value.toString().toLowerCase();
            } else if (i === 0) {
                isCheck = true;
            }
            value = values[i as number].toString(); orgValue = values[i as number]; label = this.l10n.getConstant(['True', 'False'][i as number]);
        }
        let radioBtn: RadioButtonModel;
        radioBtn = {
            label: label, name: parentId + 'default', checked: isCheck, value: value,
            change: this.changeValue.bind(this, i)
        };
        if (this.valueModel && this.valueModel.radioButtonModel) {
            radioBtn = {...radioBtn, ...this.valueModel.radioButtonModel};
        }
        const radiobutton: RadioButton = new RadioButton(radioBtn);
        radiobutton.appendTo('#' + parentId + '_valuekey' + i);
        if (isCheck) {
            this.updateRules(radiobutton.element, orgValue, 0);
        }
    }
    private getOperatorIndex(ddlObj: DropDownList, rule: RuleModel): number {
        let i: number;
        const dataSource: { [key: string]: Object; }[] = ddlObj.dataSource as { [key: string]: Object; }[];
        const len: number = dataSource.length;
        for (i = 0; i < len; i++) {
            if (rule.operator === ddlObj.dataSource[i as number].value) {
                return i;
            }
        }
        return 0;
    }
    private getPreviousItemData(prevItemData: ColumnsModel, column: ColumnsModel): ColumnsModel {
        if (this.isFieldClose && prevItemData) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prevItemData = this.getColumn((prevItemData as any).value);
        }
        if (column && column.template && prevItemData && Object.keys(prevItemData).length < 4) {
            prevItemData.template = column.template;
        }
        return prevItemData;
    }

    private renderValues(
        target: Element, itemData: ColumnsModel, prevItemData: ColumnsModel, isRender: boolean, rule: RuleModel,
        tempRule: RuleModel, element: Element): void {
        const subFldElem: Element = target.previousElementSibling;
        const filtElem: HTMLElement = subFldElem.getElementsByTagName('input')[0];
        const filtObj: DropDownTree | DropDownList = this.fieldMode === 'DropdownTree' ? getComponent(filtElem, 'dropdowntree')
            : getComponent(filtElem, 'dropdownlist');
        const column: ColumnsModel = this.fieldMode === 'DropdownTree' ? this.getColumn(filtObj.value[0])
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            : this.getColumn(filtObj.value as any);
        this.selectedRule = column as RuleModel;
        if (isRender) {
            const ddlObj: DropDownList = getComponent(target.querySelector('input'), 'dropdownlist') as DropDownList;
            itemData = element.id.indexOf('operator') > -1 ? itemData : this.selectedRule;
            if (itemData.operators) {
                ddlObj.value = null; ddlObj.dataBind(); ddlObj.dataSource = itemData.operators;
                ddlObj.index = this.getOperatorIndex(ddlObj, rule);
                ddlObj.value = tempRule.operator = ddlObj.dataSource[ddlObj.index].value as string;
                ddlObj.dataBind();
            }
        }
        const operator: string = tempRule.operator.toString(); let isTempRendered: boolean = false;
        if (!(operator.indexOf('null') > -1 || operator.indexOf('empty') > -1)) {
            const parentId: string = closest(target, '.e-rule-container').id;
            prevItemData = this.getPreviousItemData(prevItemData, column);
            if (prevItemData && prevItemData.template === undefined) {
                if (prevItemData.columns) {
                    prevItemData = this.getColumn(rule.field);
                }
            } else if (this.fieldMode === 'DropdownTree' && prevItemData === undefined) {
                prevItemData = this.getColumn(rule.field);
            }
            if (prevItemData && prevItemData.template) {
                this.templateDestroy(prevItemData, parentId + '_valuekey0');
                const elem: Element = select('#' + parentId + '_valuekey0', target.nextElementSibling);
                if (elem && !elem.classList.contains('e-control')) {
                    detach(select('#' + parentId + '_valuekey0', target.nextElementSibling));
                }
                if (typeof prevItemData.template === 'string' || (prevItemData.template as TemplateColumn).create === undefined) {
                    if (target.nextElementSibling.classList.contains('e-template-value')) {
                        this.clearQBTemplate([parentId]);
                    }
                    target.nextElementSibling.innerHTML = '';
                }
            }
            if (isRender) {
                this.validateValue(rule, closest(target, '.e-rule-container'));
                this.destroyControls(target);
            }
            if (column) {
                itemData.template = column.template;
            }
            if (itemData.template) {
                addClass([target.nextElementSibling], 'e-template-value'); itemData.template = column.template;
                isTempRendered = this.setColumnTemplate(itemData, parentId, column.field, itemData.value as string ||
                    operator, target, rule);
            }
            if (isTempRendered) {
                const parentElem: HTMLElement = target.parentElement.querySelector('.e-rule-value') as HTMLElement;
                if (this.element.className.indexOf('e-device') > -1 || this.displayMode === 'Vertical') {
                    parentElem.style.width = '100%';
                } else {
                    parentElem.style.width = '200px';
                }
            } else {
                removeClass([target.nextElementSibling], 'e-template-value'); let inputLen: number = 1;
                if (tempRule.type === 'boolean') {
                    inputLen = this.selectedColumn.values ? this.selectedColumn.values.length : 2;
                } else {
                    inputLen = (operator && operator.toLowerCase().indexOf('between') > -1) ? 2 : 1;
                }
                for (let i: number = 0; i < inputLen; i++) {
                    const valElem: HTMLElement = this.createElement('input', { attrs: { type: 'text', id: parentId + '_valuekey' + i } });
                    target.nextElementSibling.appendChild(valElem);
                }
            }
            this.renderControls(target, itemData, rule, tempRule, isTempRendered);
        } else {
            const parentElem: HTMLElement = target.parentElement.querySelector('.e-rule-value') as HTMLElement;
            if (parentElem) { removeClass([parentElem], 'e-show'); addClass([parentElem], 'e-hide'); }
        }
    }
    private setColumnTemplate(itemData: ColumnsModel, ruleID: string, field: string, operator: string, target: Element, rule: RuleModel)
        : boolean {
        let args: ActionEventArgs; let isRendered: boolean = true;
        if (!itemData.template) {
            return true;
        } else {
            if (typeof itemData.template === 'string' || (itemData.template as TemplateColumn).create === undefined) {
                args = { requestType: 'value-template-initialize', ruleID: ruleID, field: field, operator: operator, rule: rule,
                    renderTemplate: true };
                this.trigger('actionBegin', args, (observedActionArgs: ActionEventArgs) => {
                    isRendered = this.actionBeginSuccessCallBack(observedActionArgs, itemData, ruleID, field, target);
                });
                return isRendered;
            } else {
                let valElem: Element | Element []; const template: TemplateColumn = itemData.template as TemplateColumn;
                if (typeof template.create === 'string') {
                    valElem = getValue(template.create, window)({ field: field, operator: operator });
                } else {
                    valElem = (template.create as Function)({ field: field, operator: operator });
                }
                if (valElem instanceof Element) {
                    valElem.id = ruleID + '_valuekey0'; addClass([valElem], 'e-template');
                    target.nextElementSibling.appendChild(valElem);
                    if (field.indexOf(' ') < 0) {
                        addClass([valElem], 'e-' + field);
                    }
                } else if (valElem instanceof Array) {
                    addClass(valElem, 'e-template');
                    for (let i: number = 0, iLen: number = valElem.length; i < iLen; i++) {
                        valElem[i as number].id = ruleID + '_valuekey' + i; target.nextElementSibling.appendChild(valElem[i as number]);
                    }
                }
                addClass([target.nextElementSibling], 'e-template-value');
                return true;
            }
        }
    }

    private actionBeginSuccessCallBack(args: ActionEventArgs, itemData: ColumnsModel, ruleID: string, field: string, target: Element)
        : boolean {
        if (args.renderTemplate) {
            let valElem: Element | Element [];
            this.columnTemplateFn = this.templateParser(
                typeof itemData.template === 'function' ? itemData.template : itemData.template as string
            );
            const templateID: string = this.element.id + field;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((this as any).isReact) {
                valElem = this.columnTemplateFn(args, this, ruleID, templateID)[0];
            } // eslint-disable-next-line @typescript-eslint/no-explicit-any
            else if ((this as any).isAngular) {
                const valElemColl: Element[] = this.columnTemplateFn(args, this, ruleID, templateID);
                valElem = (valElemColl[0].nodeType === 3) ? valElemColl[1] : valElemColl[0];
            } else {
                valElem = this.columnTemplateFn(args, this, 'Template', templateID)[0];
            }
            target.nextElementSibling.appendChild(valElem as Element);
            addClass([target.nextElementSibling], 'e-template-value');
            this.renderReactTemplates();
            return true;
        } else {
            return false;
        }
    }

    private updateValues(element: HTMLElement, rule: RuleModel): void {
        let idx: number = 1;
        if (element.className.indexOf('e-template') > -1) {
            idx = 3;
        }
        const controlName: string = element.className.split(' e-')[idx as number];
        const i: number = parseInt(element.id.slice(-1), 2) as number;
        switch (controlName) {
        case 'checkbox':
            // eslint-disable-next-line
            const value: string = (getComponent(element, controlName) as CheckBox).value;
            rule.value = (value !== '') ? value : undefined;
            break;
        case 'textbox':
            rule.value = (getComponent(element, controlName) as TextBox).value;
            break;
        case 'dropdownlist':
            rule.value = (getComponent(element, controlName) as DropDownList).value as string;
            break;
        case 'radio':
            // eslint-disable-next-line
            const radioBtnObj: RadioButton = getComponent(element, controlName) as RadioButton;
            if (radioBtnObj.checked) {
                if (typeof rule.value === 'boolean') {
                    rule.value = radioBtnObj.value === 'true';
                } else {
                    if (this.getColumn(rule.field).values) {
                        rule.value = radioBtnObj.value;
                    } else {
                        rule.value = radioBtnObj.value === 'true';
                    }
                }
            }
            radioBtnObj.refresh();
            break;
        case 'numerictextbox':
            if (rule.operator.indexOf('between') > -1) {
                if (typeof rule.value === 'string' ) {
                    rule.value = [];
                }
                rule.value[i as number] = (getComponent(element, controlName) as NumericTextBox).value;
            } else {
                rule.value = (getComponent(element, controlName) as NumericTextBox).value;
            }
            break;
        case 'datepicker':
            // eslint-disable-next-line
            const column: ColumnsModel = this.getColumn(rule.field);
            // eslint-disable-next-line
            const format: DateFormatOptions = this.getFormat(column.format);
            // eslint-disable-next-line
            const selectedDate: Date = (getComponent(element, controlName) as DatePicker).value;
            if (rule.operator.indexOf('between') > -1) {
                if (typeof rule.value === 'string' ) {
                    rule.value = [];
                }
                rule.value[i as number] = this.intl.formatDate(selectedDate, format);
            } else if (isNullOrUndefined(format.format) && selectedDate) {
                rule.value = this.intl.formatDate(selectedDate);
            } else if (selectedDate) {
                rule.value = this.intl.formatDate(selectedDate, format);
            } else {
                rule.value = selectedDate as null;
            }
            break;
        case 'multiselect':
            rule.value = (getComponent(element, controlName) as MultiSelect).value as number[] | string[];
            break;
        }
    }
    private updateRules(
        target: Element, selectedValue: string | number | Date | boolean | string[] | number[] | Date[] | Element, i?: number,
        isNotTrigger?: boolean): void {
        const groupElem: Element = closest(target, '.e-group-container'); const rule: RuleModel = this.getParentGroup(groupElem);
        let ruleElem: Element = closest(target, '.e-rule-container'); let index: number = 0; let dropDownObj: DropDownList | DropDownTree;
        let eventsArgs: ChangeEventArgs; const groupID: string = groupElem.id.replace(this.element.id + '_', '');
        const beforeRules: RuleModel = this.getValidRules(this.rule);
        while (ruleElem && ruleElem.previousElementSibling !== null) {
            ruleElem = ruleElem.previousElementSibling;
            index++;
        }
        let operator: string = rule.rules[index as number].operator ? rule.rules[index as number].operator.toString() : '';
        ruleElem = closest(target, '.e-rule-container'); const ruleID: string = ruleElem.id.replace(this.element.id + '_', '');
        if (closest(target, '.e-rule-filter') || closest(target, '.e-rule-sub-filter')) {
            if (this.subFieldElem) {
                target = this.subFieldElem;
            }
            dropDownObj = this.fieldMode === 'DropdownTree' ? getComponent(target as HTMLElement, 'dropdowntree') as DropDownTree :
                getComponent(target as HTMLElement, 'dropdownlist') as DropDownList;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const column: ColumnsModel = this.fieldMode === 'DropdownTree' ? this.getColumn(dropDownObj.value[0] as any)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                : this.getColumn(dropDownObj.value as any);
            if (!this.isImportRules && rule.rules[index as number].field &&
                rule.rules[index as number].field.toLowerCase() !== column.field.toLowerCase()) {
                if (!(ruleElem.querySelectorAll('.e-template')) && !(operator.indexOf('null') > -1 )
                || (operator.indexOf('empty') > -1 )) {
                    rule.rules[index as number].value = '';
                }
            }
            this.selectedColumn = this.getColumn(this.selectedColumn.field);
            rule.rules[index as number].field = this.selectedColumn.field; rule.rules[index as number].type = this.selectedColumn.type;
            rule.rules[index as number].label = this.selectedColumn.label;
            let ruleElement: Element = closest(target, '.e-rule-filter');
            ruleElement = ruleElement ? ruleElement : closest(target, '.e-rule-sub-filter');
            let element: HTMLElement = ruleElement.nextElementSibling.querySelector('input.e-control') as HTMLElement;
            element = element ? element : ruleElement.nextElementSibling.nextElementSibling.querySelector('input.e-control') as HTMLElement;
            operator = (getComponent(element, 'dropdownlist') as DropDownList).value.toString();
            rule.rules[index as number].operator = operator;
            // Value Fields
            const valueContainer: HTMLElement = ruleElement.nextElementSibling.nextElementSibling as HTMLElement;
            let elementCln: NodeListOf<HTMLElement> = valueContainer.querySelectorAll('input.e-control');
            if (elementCln.length < 1) {
                elementCln = valueContainer.querySelectorAll('div.e-control');
            }
            if (elementCln.length < 1) {
                elementCln = valueContainer.querySelectorAll('.e-template');
            }
            eventsArgs = { groupID: groupID, ruleID: ruleID, value: rule.rules[index as number].field, type: 'field' };
            for (let i: number = 0; i < elementCln.length; i++) {
                if (operator.indexOf('null') > -1 || operator.indexOf('empty') > -1) {
                    rule.rules[index as number].value = null;
                    continue;
                }
                this.updateValues(elementCln[i as number], rule.rules[index as number]);
            }
            if (!this.isImportRules) {
                this.trigger('change', eventsArgs);
            }
            if (this.allowValidation && rule.rules[index as number].field && target.parentElement.className.indexOf('e-tooltip') > -1) {
                (getComponent(target.parentElement as HTMLElement, 'tooltip') as Tooltip).destroy();
            }
            this.filterRules(beforeRules, this.getValidRules(this.rule), 'field');
        } else if (closest(target, '.e-rule-operator')) {
            dropDownObj = getComponent(target as HTMLElement, 'dropdownlist') as DropDownList;
            rule.rules[index as number].operator = dropDownObj.value.toString();
            const inputElem: NodeListOf<HTMLElement> = ruleElem.querySelectorAll('.e-rule-value input.e-control') as NodeListOf<HTMLElement>;
            eventsArgs = { groupID: groupID, ruleID: ruleID, value: dropDownObj.value, type: 'operator'};
            if (this.allowValidation && rule.rules[index as number].operator && target.parentElement.className.indexOf('e-tooltip') > -1) {
                (getComponent(target.parentElement as HTMLElement, 'tooltip') as Tooltip).destroy();
            }
            if (inputElem.length > 1 && !(inputElem[0].className.indexOf('e-template') > -1)) {
                rule.rules[index as number].value = [];
            }
            for (let i: number = 0; i < inputElem.length; i++) {
                if (rule.rules[index as number].operator.indexOf('null') > -1 || rule.rules[index as number].operator.indexOf('empty') > -1) {
                    rule.rules[index as number].value = null;
                    continue;
                } else if (inputElem[i as number].classList.contains('e-template')) {
                    continue;
                }
                this.updateValues(inputElem[i as number], rule.rules[index as number]);
            }
            if (!this.isImportRules) {
                this.trigger('change', eventsArgs);
            }
            this.filterRules(beforeRules, this.getValidRules(this.rule), 'operator');
        } else if (closest(target, '.e-rule-value')) {
            this.ruleValueUpdate(target, selectedValue, rule, index, groupElem, ruleElem, i);
            if (!isNotTrigger) { this.filterRules(beforeRules, this.getValidRules(this.rule), 'value'); }
        }
    }
    private filterRules(beforeRule: RuleModel, afterRule: RuleModel, type: string): void {
        const beforeRuleStr: string = JSON.stringify({condition: beforeRule.condition, not: beforeRule.not, rule: beforeRule.rules});
        const afetrRuleStr: string = JSON.stringify({condition: afterRule.condition, not: afterRule.not, rule: afterRule.rules});
        if (beforeRuleStr !== afetrRuleStr) {
            if (!this.isImportRules) {
                this.trigger('ruleChange', { previousRule: beforeRule, rule: afterRule, type: type });
            }
        }
    }
    private ruleValueUpdate(
        target: Element, selectedValue: string | number | Date | boolean | string[] | number[] | Date[] | Element,
        rule: RuleModel, index: number, groupElem: Element, ruleElem: Element, i: number): void {
        let eventsArgs: ChangeEventArgs; let oper: string;
        const arrOperator: string [] = ['in', 'between', 'notin', 'notbetween'];
        if (rule.rules[index as number].operator) {
            oper = rule.rules[index as number].operator.toString().toLowerCase();
        }
        if (selectedValue !== null) {
            if (target.className.indexOf('e-multiselect') > -1 && rule.rules[index as number].type === 'number' &&
            !this.isNotified) {
                const selVal: number[] = []; const dupSelectedValue: string[] | number[] = selectedValue as number[] | string[];
                for (let k: number = 0, kLen: number = dupSelectedValue.length; k < kLen; k++) {
                    if (typeof dupSelectedValue[k as number] === 'string') {
                        selVal.push(parseFloat(dupSelectedValue[k as number] as string) as number);
                    }
                }
                if (selVal.length) {
                    selectedValue = selVal as number[];
                }
            }
            if (this.isNotified) {
                rule.rules[index as number].value = selectedValue as string | number | string[] | number[];
                eventsArgs = { groupID: groupElem.id, ruleID: ruleElem.id, value: rule.rules[index as number].value as string, type: 'value'};
                if (!this.isImportRules) {
                    this.trigger('change', eventsArgs);
                }
            } else if (target.className.indexOf('e-spin') > -1 || target.className.indexOf('e-numeric') > -1) {
                if (arrOperator.indexOf(oper) > -1) {
                    rule.rules[index as number].value[i as number] = selectedValue as string | number;
                } else {
                    rule.rules[index as number].value = selectedValue as string | number;
                }
            } else if (target.className.indexOf('e-radio') > -1) {
                rule.rules[index as number].value = selectedValue as string | number;
            } else if (target.className.indexOf('e-multiselect') > -1) {
                rule.rules[index as number].value = selectedValue as string[];
            } else if (target.className.indexOf('e-textbox') > -1) {
                if (oper === 'in' || oper === 'notin') {
                    if (rule.rules[index as number].type === 'string') {
                        rule.rules[index as number].value = this.processValueString(selectedValue as string,
                                                                                    rule.rules[index as number].type) as string[];
                    } else {
                        rule.rules[index as number].value = this.processValueString(selectedValue as string,
                                                                                    rule.rules[index as number].type) as number[];
                    }
                } else {
                    rule.rules[index as number].value = selectedValue as string | number;
                }
            } else if (target.className.indexOf('e-datepicker') > -1) {
                const format: DateFormatOptions = this.getFormat(this.getColumn(this.selectedColumn.field).format);
                if ((<DateFormatOptions>format).type) {
                    if (arrOperator.indexOf(oper) > -1) {
                        if (typeof rule.rules[index as number].value === 'string') {
                            rule.rules[index as number].value = [];
                        }
                        rule.rules[index as number].value[i as number] = this.intl.formatDate(selectedValue as Date, format);
                    } else {
                        rule.rules[index as number].value = this.intl.formatDate(selectedValue as Date, format);
                    }
                }
            }
            this.validateValue(rule, ruleElem, index);
        } else {
            if (target.className.indexOf('e-datepicker') > -1) {
                if (arrOperator.indexOf(oper) > -1) {
                    if (typeof rule.rules[index as number].value === 'string') {
                        rule.rules[index as number].value = [];
                    }
                    rule.rules[index as number].value[i as number] = selectedValue as null;
                } else {
                    rule.rules[index as number].value = selectedValue as null;
                }
            } else {
                rule.rules[index as number].value = selectedValue as null;
            }
        }
    }
    private validateValue(rule: RuleModel, ruleElem: Element, index?: number): void {
        if (!isNullOrUndefined(index)) {
            rule = rule.rules[index as number];
        }
        const isObject: boolean = typeof(rule.value) === 'object';
        if (this.allowValidation && (isNullOrUndefined(index) || (isObject ? (rule.value as string []).length > 0 : rule.value))) {
            const valElem: NodeListOf<Element> = ruleElem.querySelectorAll('.e-rule-value .e-control');
            if (valElem.length > 0) {
                if (valElem[0].className.indexOf('e-tooltip') > -1) {
                    (getComponent(valElem[0] as HTMLElement, 'tooltip') as Tooltip).destroy();
                } else if (valElem[0].parentElement.className.indexOf('e-tooltip') > -1) {
                    (getComponent(valElem[0].parentElement as HTMLElement, 'tooltip') as Tooltip).destroy();
                }
                if (valElem[1] && valElem[1].parentElement.className.indexOf('e-tooltip') > -1) {
                    (getComponent(valElem[1].parentElement as HTMLElement, 'tooltip') as Tooltip).destroy();
                }
            }
        }
    }
    private getFormat(format: string | FormatObject): DateFormatOptions {
        let formatOptions: DateFormatOptions;
        if (format) {
            if (typeof(format) === 'string') {
                formatOptions = { type: 'dateTime' } as DateFormatOptions;
                if (format === 'short' || format === 'yMd') {
                    formatOptions.type = 'date';
                    formatOptions.skeleton = format;
                } else {
                    formatOptions.format = format;
                }
            } else {
                formatOptions = { type: 'dateTime', skeleton: format.skeleton } as DateFormatOptions;
            }
        } else {
            formatOptions = { type: 'date', skeleton: 'yMd' } as DateFormatOptions;
        }
        return formatOptions;
    }
    private findGroupByIdx(groupIdx: number, rule:  RuleModel, isRoot: boolean): RuleModel {
        const ruleColl: RuleModel[] = rule.rules;
        const dupRuleColl: RuleModel[] = [];
        if (!isRoot) {
            for (let j: number = 0, jLen: number = ruleColl.length; j < jLen; j++) {
                rule = ruleColl[j as number];
                if (rule.rules) {
                    dupRuleColl.push(rule);
                }
            }
            return dupRuleColl[groupIdx as number];
        }
        return rule;
    }
    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also it maintains the initial input element from the DOM.
     *
     * @method destroy
     * @returns {void}
     */
    public destroy(): void {
        this.isDestroy = true;
        const queryElement: Element = this.element;
        if (!queryElement) { return; }
        let element: NodeListOf<HTMLElement>; let i: number; let len: number; let tooltip: NodeListOf<HTMLElement>;
        super.destroy();
        element = this.element.querySelectorAll('.e-addrulegroup') as NodeListOf<HTMLElement>;
        len = element.length;
        for (i = 0; i < len; i++) {
            (getComponent(element[i as number], 'dropdown-btn') as DropDownButton).destroy();
            detach(element[i as number]);
        }
        tooltip = this.element.querySelectorAll('.e-rule-filter .e-control.e-tooltip') as NodeListOf<HTMLElement>;
        for (i = 0; i < tooltip.length; i++) {
            (getComponent(tooltip[i as number], 'tooltip') as Tooltip).destroy();
        }
        element = this.element.querySelectorAll('.e-rule-filter .e-control:not(.e-tooltip)') as NodeListOf<HTMLElement>;
        len = element.length;
        for (i = 0; i < len; i++) {
            if (getComponent(element[i as number], 'dropdownlist') as DropDownList) {
                (getComponent(element[i as number], 'dropdownlist') as DropDownList).destroy();
            } else {
                (getComponent(element[i as number], 'dropdowntree') as DropDownTree).destroy();
            }
            detach(element[i as number]);
        }
        tooltip = this.element.querySelectorAll('.e-rule-operator .e-control.e-tooltip') as NodeListOf<HTMLElement>;
        for (i = 0; i < tooltip.length; i++) {
            (getComponent(tooltip[i as number], 'tooltip') as Tooltip).destroy();
        }
        element = this.element.querySelectorAll('.e-rule-operator .e-control:not(.e-tooltip)') as NodeListOf<HTMLElement>;
        len = element.length;
        for (i = 0; i < len; i++) {
            if (getComponent(element[i as number], 'dropdownlist') as DropDownList) {
                (getComponent(element[i as number], 'dropdownlist') as DropDownList).destroy();
                detach(element[i as number]);
            }
        }
        tooltip = this.element.querySelectorAll('.e-rule-value .e-control.e-tooltip') as NodeListOf<HTMLElement>;
        for (i = 0; i < tooltip.length; i++) {
            (getComponent(tooltip[i as number], 'tooltip') as Tooltip).destroy();
        }
        this.isImportRules = false;
        this.unWireEvents();
        this.levelColl[this.element.id + '_group0'] = [0];
        this.element.innerHTML = '';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((this as any).portals && (this as any).portals.length) { this.clearQBTemplate(); }
        classList(this.element, [], ['e-rtl', 'e-responsive', 'e-device']);
        this.isDestroy = false;
    }
    /**
     * Adds single or multiple rules.
     *
     * @param {RuleModel[]} rule - 'rule collection' to be passed to add the rules.
     * @param {string} groupID - 'group id' to be passed to add the rule in groups.
     * @returns {void}.
     */
    public addRules(rule: RuleModel[], groupID: string): void {
        groupID = this.element.id + '_' + groupID;
        this.isPublic = true;
        for (let i: number = 0, len: number = rule.length; i < len; i++) {
            this.addRuleElement(document.getElementById(groupID), rule[i as number]);
        }
        this.isPublic = false;
    }
    /**
     * Adds single or multiple groups, which contains the collection of rules.
     *
     * @param {RuleModel[]} groups - 'group collection' to be passed to add the groups.
     * @param {string} groupID - 'group id' to be passed to add the groups.
     * @returns {void}.
     */
    public addGroups(groups: RuleModel[], groupID: string): void {
        if (this.isAddSuccess || this.element.querySelectorAll('.e-group-container').length <= this.maxGroupCount) {
            groupID = this.element.id + '_' + groupID;
            const groupElem: Element = document.getElementById(groupID);
            const rule: RuleModel = this.getParentGroup(groupElem); const grouplen: number = groups.length;
            if (grouplen) {
                this.isPublic = true;
                for (let i: number = 0, len: number = groups.length; i < len; i++) {
                    this.updatedRule = {condition: groups[i as number].condition, not: groups[i as number].not};
                    this.importRules(groups[i as number], groupElem, false, groups[i as number].not);
                }
                this.isPublic = false;
            } else {
                let condition: string = 'and'; let not: boolean = false;
                if (this.updatedRule) {
                    condition = this.updatedRule.condition;
                    not = this.updatedRule.not;
                }
                if (this.enableNotCondition) {
                    rule.rules.push({ 'condition': condition, 'not': not, rules: [] });
                } else {
                    rule.rules.push({ 'condition': condition, rules: [] });
                }
            }
            if (!this.headerTemplate) {
                this.disableRuleCondition(groupElem, rule);
            }
        }
    }
    private initWrapper(): void {
        this.isInitialLoad = true;
        if (this.cssClass) {
            addClass([this.element], this.cssClass.replace(/\s+/g, ' ').trim().split(' '));
        }
        if (this.enableRtl) {
            addClass([this.element], 'e-rtl');
        }
        if (this.width) {
            this.element.style.width = this.width;
        }
        if (this.height) {
            this.element.style.height = this.height;
        }
        if (this.rule.rules.length) {
            this.isImportRules = true;
        } else {
            this.addGroupElement(false, this.element);
        }
        if (Browser.isDevice || this.displayMode === 'Vertical') {
            if (Browser.isDevice) {
                this.element.style.width = '100%';
                this.element.classList.add('e-device');
            }
            removeClass(this.element.querySelectorAll('.e-rule-container'), 'e-horizontal-mode');
            addClass(this.element.querySelectorAll('.e-rule-container'), 'e-vertical-mode');
            this.displayMode = 'Vertical';
        } else {
            this.displayMode = 'Horizontal';
        }
        if (this.summaryView) {
            if (this.isImportRules) {
                this.renderSummary();
            } else {
                this.renderSummaryCollapse();
            }
        } else {
            if (this.columns.length && this.isImportRules) {
                this.addGroupElement(false, this.element, this.rule.condition, false, this.rule.not, false, this.rule);
                const mRules: RuleModel = extend({}, this.rule, {}, true);
                this.isRefreshed = true;
                this.setGroupRules(mRules as RuleModel);
                this.isRefreshed = false;
            } else if (this.columns.length) {
                this.addRuleElement(this.element.querySelector('.e-group-container'), {});
            }
            this.notGroupRtl();
            if (this.readonly) {
                this.enableReadonly();
            }
            const buttons: NodeListOf<Element> = this.element.querySelectorAll('label.e-btn');
            let button: HTMLElement;
            for (let i: number = 0; i < buttons.length; i++) {
                button = buttons.item(i) as HTMLElement;
                rippleEffect(button, { selector: '.e-btn' });
            }
        }
    }
    private renderSummary(): void {
        const contentElem: Element = this.createElement('div', {
            attrs: {
                class: 'e-summary-content',
                id: this.element.id + '_summary_content'
            }
        });
        const textElem: Element =
        this.createElement('textarea', { attrs: { class: 'e-summary-text', readonly: 'true' }, styles: 'max-height:500px' });
        const editElem: Element = this.createElement('button', { attrs: { type: 'button', class: 'e-edit-rule e-css e-btn e-small e-flat e-primary' } });
        const divElem: Element = this.createElement('div', { attrs: { class: 'e-summary-btndiv' } });
        contentElem.appendChild(textElem);
        textElem.textContent = this.getSqlFromRules(this.rule);
        editElem.textContent = this.l10n.getConstant('Edit');
        divElem.appendChild(editElem);
        contentElem.appendChild(divElem);
        this.element.appendChild(contentElem);
    }
    private renderSummaryCollapse(): void {
        const collapseElem: Element = this.createElement('div', {
            attrs: {
                class: 'e-collapse-rule e-icons',
                title: this.l10n.getConstant('SummaryViewTitle')
            }
        });
        this.element.querySelector('.e-group-header').appendChild(collapseElem);
    }
    private columnSort(): void {
        if (this.sortDirection.toLowerCase() === 'descending') {
            this.columns = new DataManager(this.columns).executeLocal(new Query().sortByDesc('field'));
        } else if (this.sortDirection.toLowerCase() === 'ascending') {
            this.columns = new DataManager(this.columns).executeLocal(new Query().sortBy('field'));
        }
    }
    private onChangeNotGroup(): void {
        this.element.innerHTML = '';
        this.groupIdCounter = 0;
        if (!this.headerTemplate) {
            if (this.enableNotCondition) {
                if (this.enableNotCondition) {
                    const inputElem: HTMLElement = this.createElement('button', { attrs: { type: 'button', class: 'e-qb-toggle' }});
                    this.groupElem.querySelector('.e-btn-group').insertBefore(inputElem, this.groupElem.querySelector('.e-btngroup-and'));
                }
            } else {
                this.groupElem.querySelector('.e-qb-toggle').remove();
            }
        }
        this.rule = this.checkNotGroup(this.rule);
        this.initWrapper();
    }
    private notGroupRtl(): void {
        if (this.enableRtl) {
            addClass(this.element.querySelectorAll('.e-btn-group'), 'e-rtl');
        } else {
            removeClass(this.element.querySelectorAll('.e-btn-group'), 'e-rtl');
        }
    }
    private checkNotGroup(rule: RuleModel): RuleModel {
        let orgRule: RuleModel;
        if (rule.rules) {
            for (let i: number = 0; i < rule.rules.length; i++) {
                orgRule = rule.rules[i as number];
                orgRule = this.checkNotGroup(orgRule);
                rule.rules[i as number] = orgRule;
            }
        }
        if (!isNullOrUndefined(rule.not)) {
            if (this.enableNotCondition) {
                rule.not = false;
            }
            delete rule.not;
        } else if (this.enableNotCondition && !isNullOrUndefined(rule.condition)) {
            rule.not = false;
        }
        return rule;
    }
    public onPropertyChanged(newProp: QueryBuilderModel, oldProp: QueryBuilderModel): void {
        const properties: string[] = Object.keys(newProp);
        for (const prop of properties) {
            switch (prop) {
            case 'summaryView':
                // eslint-disable-next-line
                const groupElem: HTMLElement = this.element.querySelector('.e-group-container') as HTMLElement;
                // eslint-disable-next-line
                let summaryElem: HTMLElement = this.element.querySelector('.e-summary-content') as HTMLElement;
                if (newProp.summaryView) {
                    groupElem.style.display = 'none';
                    if (this.element.querySelectorAll('.e-summary-content').length < 1) {
                        this.renderSummary();
                        summaryElem = this.element.querySelector('.e-summary-content') as HTMLElement;
                    } else {
                        this.element.querySelector('.e-summary-text').textContent = this.getSqlFromRules(this.rule);
                    }
                    summaryElem.style.display = 'block';
                } else {
                    if (groupElem.querySelectorAll('.e-collapse-rule').length > -1) {
                        this.renderSummaryCollapse();
                    }
                    groupElem.style.display = 'block'; summaryElem.style.display = 'none';
                }
                break;
            case 'displayMode':
                this.refresh();
                break;
            case 'showButtons':
                if (newProp.showButtons.ruleDelete) {
                    removeClass(this.element.querySelectorAll('.e-rule-delete'), 'e-button-hide');
                } else {
                    addClass(this.element.querySelectorAll('.e-rule-delete'), 'e-button-hide');
                }
                if (newProp.showButtons.groupDelete) {
                    removeClass(this.element.querySelectorAll('.e-deletegroup'), 'e-button-hide');
                } else {
                    addClass(this.element.querySelectorAll('.e-deletegroup'), 'e-button-hide');
                }
                break;
            case 'cssClass':
                if (oldProp.cssClass) {
                    removeClass([this.element], oldProp.cssClass.split(' '));
                }
                if (newProp.cssClass) {
                    addClass([this.element], newProp.cssClass.replace(/\s+/g, ' ').trim().split(' '));
                }
                break;
            case 'enableRtl':
                if (newProp.enableRtl) {
                    addClass([this.element], 'e-rtl'); this.notGroupRtl();
                } else {
                    removeClass([this.element], 'e-rtl'); this.notGroupRtl();
                }
                break;
            case 'enablePersistence':
                this.enablePersistence = newProp.enablePersistence;
                break;
            case 'dataSource':
                this.dataSource = newProp.dataSource; this.refresh();
                break;
            case 'columns':
                this.columns = newProp.columns;
                this.columnSort();
                this.updateSubFieldsFromColumns(this.columns);
                break;
            case 'sortDirection':
                this.sortDirection = newProp.sortDirection;
                this.columnSort();
                break;
            case 'maxGroupCount':
                this.maxGroupCount = newProp.maxGroupCount;
                break;
            case 'height':
                this.height = newProp.height;
                this.element.style.height = this.height;
                break;
            case 'rule':
                this.rule = newProp.rule;
                newProp.rule = this.getRuleCollection(this.rule, false);
                break;
            case 'width':
                this.width = newProp.width;
                this.element.style.width = this.width;
                break;
            case 'locale':
                this.locale = newProp.locale; this.intl = new Internationalization(this.locale);
                this.isLocale = true; this.refresh(); this.isLocale = false; break;
            case 'enableNotCondition':
                this.onChangeNotGroup();
                break;
            case 'readonly':
                this.isReadonly = newProp.readonly;
                this.enableReadonly();
                break;
            }
        }
    }
    protected preRender(): void {
        this.element.id = this.element.id || getUniqueID('ej2-querybuilder');
        this.defaultLocale = {
            StartsWith: 'Starts With',
            EndsWith: 'Ends With',
            Contains: 'Contains',
            NotLike: 'Not Like',
            Like : 'Like',
            Equal: 'Equal',
            NotEqual: 'Not Equal',
            LessThan: 'Less Than',
            LessThanOrEqual: 'Less Than Or Equal',
            GreaterThan: 'Greater Than',
            GreaterThanOrEqual: 'Greater Than Or Equal',
            Between: 'Between',
            NotBetween: 'Not Between',
            In: 'In',
            NotIn: 'Not In',
            Remove: 'REMOVE',
            SelectField: 'Select a field',
            SelectOperator: 'Select operator',
            DeleteRule: 'Remove this condition',
            DeleteGroup: 'Delete group',
            AddGroup: 'Add Group',
            AddCondition: 'Add Condition',
            Edit: 'EDIT',
            ValidationMessage: 'This field is required',
            SummaryViewTitle: 'Summary View',
            OtherFields: 'Other Fields',
            AND: 'AND',
            OR: 'OR',
            NOT: 'NOT',
            SelectValue: 'Enter Value',
            IsEmpty: 'Is Empty',
            IsNotEmpty: 'Is Not Empty',
            IsNull: 'Is Null',
            IsNotNull: 'Is Not Null',
            True: 'true',
            False: 'false',
            AddButton: 'Add Group/Condition'
        };
        this.l10n = new L10n('querybuilder', this.defaultLocale, this.locale);
        this.intl = new Internationalization(this.locale);
        this.groupIdCounter = 0;
        this.subFilterCounter = 0;
        this.ruleIdCounter = 0;
        this.btnGroupId = 0;
        this.isImportRules = false;
        this.parser = [];
        this.customOperators = {
            stringOperator: [
                { value: 'startswith', key: this.l10n.getConstant('StartsWith') },
                { value: 'endswith', key: this.l10n.getConstant('EndsWith') },
                { value: 'contains', key: this.l10n.getConstant('Contains') },
                { value: 'equal', key: this.l10n.getConstant('Equal') },
                { value: 'notequal', key: this.l10n.getConstant('NotEqual') },
                { value: 'in', key: this.l10n.getConstant('In') },
                { value: 'notin', key: this.l10n.getConstant('NotIn') },
                { value: 'isempty', key: this.l10n.getConstant('IsEmpty') },
                { value: 'isnotempty', key: this.l10n.getConstant('IsNotEmpty') }],
            dateOperator: [
                { value: 'equal', key: this.l10n.getConstant('Equal') },
                { value: 'greaterthan', key: this.l10n.getConstant('GreaterThan') },
                { value: 'greaterthanorequal', key: this.l10n.getConstant('GreaterThanOrEqual') },
                { value: 'lessthan', key: this.l10n.getConstant('LessThan') },
                { value: 'lessthanorequal', key: this.l10n.getConstant('LessThanOrEqual') },
                { value: 'notequal', key: this.l10n.getConstant('NotEqual') }],
            booleanOperator: [
                { value: 'equal', key: this.l10n.getConstant('Equal') },
                { value: 'notequal', key: this.l10n.getConstant('NotEqual') }],
            numberOperator: [
                { value: 'equal', key: this.l10n.getConstant('Equal') },
                { value: 'greaterthanorequal', key: this.l10n.getConstant('GreaterThanOrEqual') },
                { value: 'greaterthan', key: this.l10n.getConstant('GreaterThan') },
                { value: 'between', key: this.l10n.getConstant('Between') },
                { value: 'lessthan', key: this.l10n.getConstant('LessThan') },
                { value: 'notbetween', key: this.l10n.getConstant('NotBetween') },
                { value: 'lessthanorequal', key: this.l10n.getConstant('LessThanOrEqual') },
                { value: 'notequal', key: this.l10n.getConstant('NotEqual') },
                { value: 'in', key: this.l10n.getConstant('In') },
                { value: 'notin', key: this.l10n.getConstant('NotIn') }]
        };
        this.operators = {
            equal: '=', notequal: '!=', greaterthan: '>', greaterthanorequal: '>=', lessthan: '<', in: 'IN', notin: 'NOT IN',
            lessthanorequal: '<=', startswith: 'LIKE', endswith: 'LIKE', between: 'BETWEEN', notbetween: 'NOT BETWEEN', contains: 'LIKE',
            isnull: 'IS NULL', isnotnull: 'IS NOT NULL', isempty: 'IS EMPTY', isnotempty: 'IS NOT EMPTY', notstartswith: 'NOT LIKE',
            notendswith: 'NOT LIKE', notcontains: 'NOT LIKE'
        };
        this.sqlOperators = {
            equal: '=', notequal: '!=', greaterthan: '>', greaterthanorequal: '>=', lessthan: '<', in: this.l10n.getConstant('In').toUpperCase(),
            notin: this.l10n.getConstant('NotIn').toUpperCase(), lessthanorequal: '<=', startswith: this.l10n.getConstant('Like').toUpperCase(),
            endswith: this.l10n.getConstant('Like').toUpperCase(), between: this.l10n.getConstant('Between').toUpperCase(),
            notbetween: this.l10n.getConstant('NotBetween').toUpperCase(), contains: this.l10n.getConstant('Like').toUpperCase(),
            isnull: this.l10n.getConstant('IsNull').toUpperCase(), isnotnull: this.l10n.getConstant('IsNotNull').toUpperCase(),
            isempty: this.l10n.getConstant('IsEmpty').toUpperCase(), isnotempty: this.l10n.getConstant('IsNotEmpty').toUpperCase(),
            notstartswith: this.l10n.getConstant('NotLike').toUpperCase(), notendswith: this.l10n.getConstant('NotLike').toUpperCase(),
            notcontains: this.l10n.getConstant('NotLike').toUpperCase()
        };
        if (!this.fields) {
            this.fields = { text: 'label', value: 'field'};
        }
    }

    protected render(): void {
        this.levelColl = {};
        this.items = [
            {
                text: this.l10n.getConstant('AddGroup'),
                iconCss: 'e-icons e-add-icon e-addgroup'
            },
            {
                text: this.l10n.getConstant('AddCondition'),
                iconCss: 'e-icons e-add-icon e-addrule'
            }];
        this.ruleElem = this.ruleTemplate();
        this.groupElem = this.groupTemplate();
        const stringOper: object[] = [
            { value: 'isnull', key: this.l10n.getConstant('IsNull') },
            { value: 'isnotnull', key: this.l10n.getConstant('IsNotNull') }
        ];
        const numberOper: object[] = [
            { value: 'isnull', key: this.l10n.getConstant('IsNull') },
            { value: 'isnotnull', key: this.l10n.getConstant('IsNotNull') }
        ];
        this.customOperators['stringOperator'] = this.customOperators['stringOperator'].concat(stringOper); // tslint:disable-line
        this.customOperators['numberOperator'] = this.customOperators['numberOperator'].concat(numberOper); // tslint:disable-line
        if (this.dataSource instanceof DataManager) {
            this.dataManager = this.dataSource as DataManager;
            this.executeDataManager(new Query().take(1));
        } else {
            this.dataManager = new DataManager(this.dataSource as object[]);
            this.dataColl = this.dataManager.executeLocal(new Query());
            this.initControl();
        }
        this.renderComplete();
    }

    private templateParser(template: string | Function): Function {
        if (template) {
            try {
                if (typeof template !== 'function' && document.querySelectorAll(template).length) {
                    return templateCompiler(document.querySelector(template).innerHTML.trim());
                } else {
                    return compile(template);
                }
            } catch (error) {
                return templateCompiler(template);
            }
        }
        return undefined;
    }

    private executeDataManager(query: Query): void {
        const data: Promise<Object> = this.dataManager.executeQuery(query) as Promise<Object>;
        const deferred: Deferred = new Deferred();
        data.then((e: {actual: {result: Object[], count: number}, result: Object[]}) => {
            if (e.actual && e.actual.result) {
                this.dataColl = e.actual.result;
            } else {
                this.dataColl = e.result;
            }
            this.initControl();
        }).catch((e: ReturnType) => {
            deferred.reject(e);
        });
    }
    private initControl(): void {
        this.initialize();
        this.initWrapper();
        this.wireEvents();
    }
    protected wireEvents(): void {
        const wrapper: Element = this.getWrapper();
        EventHandler.add(wrapper, 'click', this.clickEventHandler, this);
        EventHandler.add(wrapper, 'focusout', this.focusEventHandler, this);
        EventHandler.add(wrapper, 'focusin', this.focusEventHandler, this);
        EventHandler.add(this.element, 'keydown', this.keyBoardHandler, this);
    }
    protected unWireEvents(): void {
        const wrapper: Element = this.getWrapper();
        EventHandler.remove(wrapper, 'click', this.clickEventHandler);
        EventHandler.remove(wrapper, 'focusout', this.focusEventHandler);
        EventHandler.remove(wrapper, 'focusin', this.focusEventHandler);
        EventHandler.remove(this.element, 'keydown', this.keyBoardHandler);
    }
    private getParentGroup(target: Element| string, isParent ?: boolean): RuleModel {
        const groupLevel: number[] = (target instanceof Element) ? this.levelColl[target.id] : this.levelColl[`${target}`];
        const len: number = isParent ? groupLevel.length - 1 : groupLevel.length;
        let rule: RuleModel = this.rule;
        for (let i: number = 0; i < len; i++) {
            rule = this.findGroupByIdx(groupLevel[i as number], rule, i === 0);
        }
        return rule;
    }
    /**
     * Delete the Group
     *
     * @param {Element | string} target - 'target' to be passed to delete the group.
     * @returns {void}
     */
    public deleteGroup(target: Element | string): void {
        const groupElem: Element = target as Element; let groupId: string;
        if (typeof target === 'string') {
            groupId = this.element.id + '_' + target as string;
            target = document.getElementById(groupId);
        } else {
            groupId = groupElem.id.replace(this.element.id + '_', '');
        }
        const args: ChangeEventArgs = { groupID: groupId, cancel: false, type: 'deleteGroup' };
        if (!this.isImportRules) {
            this.trigger('beforeChange', args, (observedChangeArgs: ChangeEventArgs) => {
                this.deleteGroupSuccessCallBack(observedChangeArgs, target as Element);
            });
        } else {
            this.deleteGroupSuccessCallBack(args, target as Element);
        }
    }

    private deleteGroupSuccessCallBack(args: ChangeEventArgs, target: Element): void {
        if (!args.cancel) {
            let groupElem: Element = target; const rule: RuleModel = this.getParentGroup(groupElem, true);
            let index: number = 0; let i: number; let len: number; const beforeRules: RuleModel = this.getValidRules(this.rule);
            const nextElem: Element = groupElem.nextElementSibling; const prevElem: Element = groupElem.previousElementSibling;
            const element: NodeListOf<Element> = groupElem.querySelectorAll('.e-group-container');
            const valElem: NodeListOf<Element> = groupElem.querySelectorAll('.e-tooltip');
            len = valElem.length;
            for (i = 0; i < len; i++) {
                (getComponent(valElem[i as number] as HTMLElement, 'tooltip') as Tooltip).destroy();
            }
            for (i = 0, len = element.length; i < len; i++) {
                delete this.levelColl[element[i as number].id];
            }
            while (groupElem.previousElementSibling !== null) {
                groupElem = groupElem.previousElementSibling;
                index++;
            }
            if (nextElem && nextElem.className.indexOf('e-separate-rule') > -1) {
                removeClass([nextElem], 'e-separate-rule');
                addClass([nextElem], 'e-joined-rule');
                if (prevElem && prevElem.className.indexOf('e-rule-container') > -1) {
                    addClass([prevElem], 'e-prev-joined-rule');
                }
            }
            const elem: Element = groupElem.parentElement.parentElement.parentElement; const removeString: string[] = [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((this as any).isReact || (this as any).isAngular) {
                const remRule: RuleModel = rule.rules[index as number];
                const ruleElemColl: NodeListOf<Element> = target.querySelectorAll('.e-rule-container');
                if (remRule && remRule.rules) {
                    for (let r: number = 0; r < remRule.rules.length; r++) {
                        const column: ColumnsModel = this.getColumn(remRule.rules[r as number].field);
                        const isTemplateRendered: Element = ruleElemColl[r as number].querySelector('.e-template-value');
                        if (column && (column.ruleTemplate || (this.isPlatformTemplate(column) && isTemplateRendered))) {
                            removeString.push(ruleElemColl[r as number].id);
                        }
                    }
                }
            }
            detach(target);
            if (this.headerTemplate) {
                this.clearQBTemplate([target.id]);
            }
            if (removeString.length) { this.clearQBTemplate(removeString); }
            rule.rules.splice(index, 1);
            delete this.levelColl[args.groupID];
            this.refreshLevelColl();
            this.disableRuleCondition(elem, rule);
            if (!this.isImportRules) {
                this.trigger('change', args);
            }
            this.filterRules(beforeRules, this.getValidRules(this.rule), 'deleteGroup');
        }
    }

    private isPlatformTemplate(column: ColumnsModel): boolean {
        let isTemp: boolean = false;
        isTemp = column.template && (typeof column.template === 'string' || (column.template as TemplateColumn).create === undefined);
        return isTemp;
    }

    private deleteRule(target: Element): void {
        const groupElem: Element = closest(target, '.e-group-container');
        const groupID: string = groupElem.id.replace(this.element.id + '_', '');
        const ruleID: string = closest(target, '.e-rule-container').id.replace(this.element.id + '_', '');
        const args: ChangeEventArgs = { groupID: groupID, ruleID: ruleID, cancel: false, type: 'deleteRule' };
        if (!this.isImportRules) {
            this.trigger('beforeChange', args, (observedChangeArgs: ChangeEventArgs) => {
                this.deleteRuleSuccessCallBack(observedChangeArgs, target);
            });
        } else {
            this.deleteRuleSuccessCallBack(args, target);
        }
    }

    private deleteRuleSuccessCallBack(args: ChangeEventArgs, target: Element): void {
        if (!args.cancel) {
            const groupElem: Element = closest(target, '.e-group-container');
            const rule: RuleModel = this.getParentGroup(groupElem); let ruleElem: Element = closest(target, '.e-rule-container');
            const beforeRules: RuleModel = this.getValidRules(this.rule);
            const clnruleElem: Element = ruleElem; const nextElem: Element = ruleElem.nextElementSibling;
            const prevElem: Element = ruleElem.previousElementSibling; let index: number = 0;
            const valElem: NodeListOf<Element> = ruleElem.querySelectorAll('.e-tooltip');
            let i: number; const len: number = valElem.length;
            for (i = 0; i < len; i++) {
                (getComponent(valElem[i as number] as HTMLElement, 'tooltip') as Tooltip).destroy();
            }
            while (ruleElem.previousElementSibling !== null) {
                ruleElem = ruleElem.previousElementSibling;
                index++;
            }
            const column: ColumnsModel = this.getColumn(rule.rules[index as number].field);
            if (column && column.template && clnruleElem.querySelector('.e-template')) {
                this.templateDestroy(column, clnruleElem.querySelector('.e-template').id);
            }
            if (!prevElem || prevElem.className.indexOf('e-rule-container') < 0) {
                if (nextElem) {
                    removeClass([nextElem], 'e-joined-rule');
                }
            }
            if (!nextElem || nextElem.className.indexOf('e-rule-container') < 0) {
                if (prevElem) {
                    removeClass([prevElem], 'e-prev-joined-rule');
                }
            }
            const isTemplateRendered: Element = clnruleElem.querySelector('.e-template-value');
            // eslint-disable
            try {
                detach (clnruleElem);
            } catch (err) {
                // eslint-disable-next-line no-ex-assign
                err = [];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const error: any = 'error';
                // eslint-disable-next-line
                err[error] = error;
            }
            // eslint-enable
            if (column && column.ruleTemplate) {
                this.clearQBTemplate([clnruleElem.id]);
            }
            if (column && this.isPlatformTemplate(column) && isTemplateRendered) {
                this.clearQBTemplate([clnruleElem.id]);
            }
            rule.rules.splice(index, 1);
            if (!(rule.rules[0] && rule.rules[0].rules)) {
                this.disableRuleCondition(groupElem, rule);
            }
            if (!this.isImportRules) {
                this.trigger('change', args);
            }
            this.filterRules(beforeRules, this.getValidRules(this.rule), 'deleteRule');
        }
    }

    private setGroupRules(rule: RuleModel, isRoot?: boolean): void {
        if (this.headerTemplate && isRoot) {
            this.isRoot = true;
        }
        this.reset();
        this.groupIdCounter = 1;
        this.ruleIdCounter = 0;
        this.isImportRules = true;
        this.rule = rule;
        rule = this.getRuleCollection(this.rule, false);
        this.importRules(this.rule, this.element.querySelector('.e-group-container'), true, this.rule.not, isRoot);
        this.isImportRules = false;
    }

    private keyBoardHandler(e: KeyboardEventArgs): void {
        if (this.readonly && (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 13)) {
            e.preventDefault();
        }
    }

    private clearQBTemplate(ruleElemColl?: string[]): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((this as any).isReact || (this as any).isAngular) {
            this.clearTemplate(ruleElemColl);
        }
    }

    private disableRuleCondition(groupElem: Element, rules?: RuleModel): void {
        if (!this.headerTemplate) {
            if (this.readonly) {
                return;
            }
            const count: number = groupElem.querySelector('.e-rule-list').childElementCount;
            const andElem: HTMLInputElement = groupElem.querySelector('.e-btngroup-and');
            const orElem: HTMLInputElement = groupElem.querySelector('.e-btngroup-or');
            if (count > 1) {
                andElem.disabled = false;
                orElem.disabled = false;
                if (orElem.nextElementSibling.classList.contains('e-btn-disable') ||
                andElem.nextElementSibling.classList.contains('e-btn-disable')) {
                    orElem.nextElementSibling.classList.remove('e-btn-disable');
                    andElem.nextElementSibling.classList.remove('e-btn-disable');
                }
                if (rules && rules.condition === 'or') {
                    orElem.checked = true;
                } else {
                    andElem.checked = true;
                }
            } else {
                andElem.checked = false; andElem.disabled = true;
                orElem.checked = false; orElem.disabled = true;
                if (rules) {
                    orElem.nextElementSibling.classList.add('e-btn-disable');
                    andElem.nextElementSibling.classList.add('e-btn-disable');
                }
            }
        }
    }

    /**
     * Get the valid rule or rules collection.
     *
     * @param {RuleModel} currentRule - 'currentRule' to be passed to get the valid rules.
     * @returns {RuleModel} - Valid rule or rules collection
     */
    public getValidRules(currentRule?: RuleModel): RuleModel {
        if (!currentRule) {
            currentRule = this.getRules();
        }
        const ruleCondtion: string = currentRule.condition;
        const notCondition: boolean = currentRule.not;
        const ruleColl: RuleModel [] = extend([], currentRule.rules, [], true) as RuleModel [];
        const rule: RuleModel = this.getRuleCollection({condition: ruleCondtion, rules: ruleColl, not: notCondition}, true);
        return rule;
    }
    private getRuleCollection(rule: RuleModel, isValidRule: boolean): RuleModel {
        if (isNullOrUndefined(rule)) {
            return null;
        }
        let orgRule: RuleModel;
        if (rule.rules && rule.rules.length && (Object.keys(rule.rules[0]).length > 6 || isValidRule)) {
            let jLen: number = rule.rules.length;
            for (let j: number = 0; j < jLen; j++) {
                orgRule = rule.rules[j as number];
                orgRule = this.getRuleCollection(orgRule, isValidRule);
                rule.rules[j as number] = orgRule;
                if (Object.keys(orgRule).length < 1 && isValidRule) {
                    rule.rules.splice(j, 1); j--; jLen--;
                }
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const customObj: any = (rule as any).custom;
        if ((rule.field && rule.field !== '') && (isNullOrUndefined(customObj) || (customObj && (customObj.type !== 'question' &&
        customObj.type !== 'answer')))) {
            if (rule.operator) {
                if (rule.operator.toString().indexOf('null') > -1 || rule.operator.toString().indexOf('empty') > -1) {
                    rule.value = null;
                }
            }
            if ((this.isRefreshed && this.enablePersistence) || (rule.field !== '' && rule.operator !== '' && (rule.value !== '' &&
            rule.value !== undefined)) || (customObj && customObj.isQuestion)) {
                const condition: string = rule.condition;
                rule = {
                    'label': rule.label, 'field': rule.field, 'operator': rule.operator, 'type': rule.type, 'value': rule.value
                };
                if (condition) {
                    rule.condition = condition;
                }
                if (customObj) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (rule as any).custom = customObj;
                }
            } else {
                rule = {};
            }
        } else {
            if (customObj && (customObj.type === 'question' || customObj.type === 'answer')) {
                const notValue: boolean = rule.not;
                rule = { 'label': rule.label, 'field': rule.field, 'operator': rule.operator, 'type': rule.type, 'value': rule.value,
                    'condition': rule.condition, 'rules': rule.rules
                };
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (rule as any).custom = customObj;
                if (this.enableNotCondition) {
                    rule.not = notValue;
                }
            } else if ((isNullOrUndefined(rule.condition)) && isNullOrUndefined(rule.rules)) {
                rule = {};
            } else {
                if (this.enableNotCondition) {
                    rule = { 'condition': rule.condition, 'rules': rule.rules, 'not': rule.not };
                } else {
                    rule = { 'condition': rule.condition, 'rules': rule.rules };
                }
                if (rule.rules.length === 0 ) {
                    rule = {};
                }
            }
        }
        return rule;
    }
    /**
     * Set the rule or rules collection.
     *
     * @param {RuleModel} rule - 'rule' to be passed to set rules.
     * @returns {void}.
     */
    public setRules(rule: RuleModel): void {
        const mRules: RuleModel = extend({}, rule, {}, true);
        if (this.headerTemplate) {
            this.setGroupRules(mRules, true);
        } else {
            this.setGroupRules(mRules);
        }
    }
    /**
     * Gets the rule or rule collection.
     *
     * @returns {object} - Rule or rule collection
     */
    public getRules(): RuleModel {
        let rule: RuleModel;
        if (this.enableNotCondition) {
            rule = {condition: this.rule.condition, rules: this.rule.rules, not: this.rule.not};
        } else {
            rule = {condition: this.rule.condition, rules: this.rule.rules};
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((this.rule as any).custom) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (rule as any).custom = (this.rule as any).custom;
        }
        return rule;
    }
    /**
     * Gets the rule.
     *
     * @param {string | HTMLElement} elem - 'elem' to be passed to get rule.
     * @returns {object} - Rule
     */
    public getRule(elem: string | HTMLElement): RuleModel {
        let ruleElem: Element; let ruleId: string; let index: number = 0;
        if (elem instanceof HTMLElement) {
            ruleElem = closest(elem, '.e-rule-container');
        } else {
            ruleId = this.element.id + '_' + elem;
            ruleElem = document.getElementById(ruleId);
        }
        const groupElem: Element = closest(ruleElem, '.e-group-container');
        const rule: RuleModel = this.getParentGroup(groupElem);
        while (ruleElem.previousElementSibling !== null) {
            ruleElem = ruleElem.previousElementSibling;
            index++;
        }
        return rule.rules[index as number];
    }
    /**
     * Gets the group.
     *
     * @param {string | Element} target - 'target' to be passed to get group.
     * @returns {object} -Group
     */
    public getGroup(target: Element | string): RuleModel {
        if (target instanceof Element && target.className.indexOf('e-group-container') < 1) {
            target = closest(target, '.e-group-container');
        }
        const groupId: string = (target instanceof Element) ? target.id : this.element.id + '_' + target;
        const rule: RuleModel = this.getParentGroup(groupId);
        return rule;
    }
    /**
     * Deletes the group or groups based on the group ID.
     *
     * @param {string[]} groupIdColl - 'groupIdColl' to be passed to delete groups.
     * @returns {void}
     */
    public deleteGroups(groupIdColl: string[]): void {
        let i: number; const len: number = groupIdColl.length; let groupID: string;
        for (i = 0; i < len; i++) {
            groupID = this.element.id + '_' + groupIdColl[i as number];
            this.deleteGroup(document.getElementById(groupID));
        }
    }
    /**
     * Return the Query from current rules collection.
     *
     * @returns {Promise} - Query from current rules collection
     * @blazorType object
     */
    public getFilteredRecords(): Promise<Object> | object {
        const predicate: Predicate = this.getPredicate(this.getValidRules(this.rule));
        const dataManagerQuery: Query =
        isNullOrUndefined(predicate) ? new Query() : new Query().where(predicate);
        return this.dataManager.executeQuery(dataManagerQuery);
    }
    /**
     * Deletes the rule or rules based on the rule ID.
     *
     * @param {string[]} ruleIdColl - 'ruleIdColl' to be passed to delete rules.
     * @returns {void}.
     */
    public deleteRules(ruleIdColl: string[]): void {
        let i: number; const len: number = ruleIdColl.length; let ruleID: string;
        for (i = 0; i < len; i++) {
            ruleID = this.element.id + '_' + ruleIdColl[i as number];
            this.deleteRule(document.getElementById(ruleID));
        }
    }
    /**
     * Gets the query for Data Manager.
     *
     * @param {RuleModel} rule - 'rule' to be passed to get query.
     * @returns {string} - Query for Data Manager
     */
    public getDataManagerQuery(rule: RuleModel): Query {
        const predicate: Predicate = this.getPredicate(rule);
        let query: Query; const fields: string[] = [];
        for (let i: number = 0, len: string[] = Object.keys(this.columns); i < len.length; i++) {
            fields.push(this.columns[i as number].field);
        }
        if (rule.rules.length) {
            query = new Query().select(fields).where(predicate);
        } else {
            query = new Query().select(fields);
        }
        return query;
    }

    /**
     * Get the predicate from collection of rules.
     *
     * @param {RuleModel} rule - 'rule' to be passed to get predicate.
     * @returns {Predicate} - Predicate from collection of rules
     */
    public getPredicate(rule: RuleModel): Predicate {
        const ruleColl: RuleModel[] = rule.rules; let pred: Predicate; let pred2: Predicate;
        let ruleValue: string | number | Date; let ignoreCase: boolean = false; let column: ColumnsModel;
        const ignoreOper: string[] = ['notcontains', 'notstartswith', 'notendswith'];
        if (!ruleColl) {
            return pred;
        }
        for (let i: number = 0, len: number = ruleColl.length; i < len; i++) {
            const keys: string[] = Object.keys(ruleColl[i as number]);
            ignoreCase = false;
            if (keys.indexOf('rules') > -1 && ruleColl[i as number].rules) {
                pred2 = this.getPredicate(ruleColl[i as number]);
                if (pred2) {
                    if (pred) {
                        if (rule.condition === 'and') {
                            pred = pred.and(pred2);
                        } else {
                            pred = pred.or(pred2);
                        }
                    } else {
                        pred = pred2;
                    }
                }
            } else if (!isNullOrUndefined(ruleColl[i as number].operator) && !isNullOrUndefined(ruleColl[i as number].operator.length)) {
                const oper: string = ruleColl[i as number].operator.toLowerCase(); let isDateFilter: boolean = false;
                const dateOperColl: string[] = ['equal', 'notequal', 'greaterthan', 'greaterthanorequal', 'lessthan', 'lessthanorequal'];
                if (ruleColl[i as number].type === 'string') {
                    ignoreCase = this.matchCase ? false : true;
                }
                if (ruleColl[i as number].type === 'date' && dateOperColl.indexOf(oper) > -1) {
                    ignoreCase = true;
                }
                column = this.getColumn(ruleColl[i as number].field);
                if (oper.indexOf('null') > -1 || oper.indexOf('empty') > -1) {
                    ruleColl[i as number].value = null;
                } else if (ruleColl[i as number].type === 'date' && !(ruleColl[i as number].value instanceof Array)) {
                    const format: DateFormatOptions = this.getFormat(column.format);
                    if (!isNullOrUndefined(ruleColl[i as number].value)) {
                        ruleValue = this.getDate(ruleColl[i as number].value as string, format);
                        if (dateOperColl.indexOf(oper) > -1 && !this.isTime(ruleColl[i as number].value as string)) {
                            isDateFilter = true;
                        }
                    } else {
                        ruleValue = null;
                    }
                } else {
                    ruleValue = ruleColl[i as number].value as string | number;
                }
                if (i === 0) {
                    if (isDateFilter || (oper.indexOf('in') > -1 || oper.indexOf('between') > -1 || oper.indexOf('null') > -1 ||
                    oper.indexOf('empty') > -1 ) && oper.indexOf('contains') < 0) {
                        pred = isDateFilter ? this.datePredicate(ruleColl[i as number], ruleValue as Date) :
                            this.arrayPredicate(ruleColl[i as number]);
                    } else {
                        const value: string | number | Date = ruleValue as string | number | Date;
                        if (value !== '' && ignoreOper.indexOf(oper) < 0) {
                            pred = new Predicate(ruleColl[i as number].field, ruleColl[i as number].operator,
                                                 ruleValue as string | number | Date, ignoreCase);
                        }
                    }
                } else {
                    if (ignoreOper.indexOf(oper) > -1) {
                        continue;
                    }
                    if (isDateFilter || (oper.indexOf('in') > -1 || oper.indexOf('between') > -1 ||
                    oper.indexOf('null') > -1 || oper.indexOf('empty') > -1 ) && oper.indexOf('contains') < 0) {
                        pred = isDateFilter ? this.datePredicate(ruleColl[i as number], ruleValue as Date, pred, rule.condition) :
                            this.arrayPredicate(ruleColl[i as number], pred, rule.condition);
                    } else {
                        if (rule.condition === 'and') {
                            const value: string | number | Date = ruleValue as string | number | Date;
                            if (pred && value !== '') {
                                pred
                                = pred.and(ruleColl[i as number].field, ruleColl[i as number].operator,
                                           ruleValue as string | number | Date, ignoreCase);
                            } else if (value !== '') {
                                pred = new Predicate(
                                    ruleColl[i as number].field, ruleColl[i as number].operator, ruleValue as string |
                                    number | Date, ignoreCase);
                            }
                        } else {
                            const value: string | number = ruleValue as string | number;
                            if (pred && value !== '') {
                                pred = pred.or(ruleColl[i as number].field, ruleColl[i as number].operator,
                                               ruleValue as string | number, ignoreCase);
                            } else if (value !== '') {
                                pred = new Predicate(
                                    ruleColl[i as number].field, ruleColl[i as number].operator, ruleValue as string | number |
                                    Date, ignoreCase);
                            }
                        }
                    }
                }
            }
        }
        if (this.dataSource instanceof DataManager) {
            if (!isNullOrUndefined(pred) && (pred.operator === 'isnull' || pred.operator === 'isnotnull')) {
                pred.operator = pred.operator === 'isnull' ? 'equal' : 'notequal';
            }
        }
        return pred;
    }
    private getLocale(): string {
        const gregorianFormat: string = '.dates.calendars.gregorian.days.format.short';
        let localeString: string = this.locale;
        const mainVal: string = 'main.';
        const cultureObj: object = getValue(mainVal + '' + this.locale + gregorianFormat, cldrData);
        if (!cultureObj) {
            localeString = 'en';
        }
        return localeString;
    }
    private getColumn(field: string, col?: ColumnsModel[]): ColumnsModel {
        let columns: ColumnsModel[] = this.columns; let column: ColumnsModel;
        columns = col ? col : columns;
        for (let i: number = 0, iLen: number = columns.length; i < iLen; i++) {
            if (columns[i as number].field === field) {
                column = columns[i as number];
                break;
            } else if (columns[i as number].columns) {
                column = this.getColumn(field, columns[i as number].columns);
                if (column) { break; }
            } else if (field && field.indexOf(this.separator) > -1) {
                if (this.separator !== '' && columns[i as number].field === field.split(this.separator)[0]) {
                    column = columns[i as number];
                    break;
                }
            }
        }
        return column;
    }

    /* eslint-disable */

    /**
     * Return the operator bound to the column.
     *
     * @returns {[key: string]: Object}[] - Operator bound to the column
     */
    /* eslint-enable */

    public getOperators(field: string): {[key: string]: Object}[] {
        const column: ColumnsModel = this.getColumn(field);
        return column.operators;
    }
    private setTime(date: Date, isStart?: boolean): Date {
        if (isStart) {
            date.setHours(0, 0, 0);
        } else {
            date.setHours(23, 59, 59);
        }
        return date;
    }
    private datePredicate(ruleColl: RuleModel, value: Date, predicate?: Predicate, condition?: string): Predicate {
        let pred: Predicate;
        const startDate: Date = this.setTime(new Date(value.getTime()), true);
        const endDate: Date = this.setTime(value);
        switch (ruleColl.operator) {
        case 'equal':
            pred = new Predicate(ruleColl.field, 'greaterthanorequal', startDate);
            pred = pred.and(ruleColl.field, 'lessthanorequal', endDate);
            break;
        case 'notequal':
            pred = new Predicate(ruleColl.field, 'lessthan', startDate);
            pred = pred.or(ruleColl.field, 'greaterthan', endDate);
            break;
        case 'greaterthan':
            pred = new Predicate(ruleColl.field, 'greaterthan', endDate);
            break;
        case 'greaterthanorequal':
            pred = new Predicate(ruleColl.field, 'greaterthanorequal', startDate);
            break;
        case 'lessthan':
            pred = new Predicate(ruleColl.field, 'lessthan', startDate);
            break;
        case 'lessthanorequal':
            pred = new Predicate(ruleColl.field, 'lessthanorequal', endDate);
            break;
        }
        if (pred) {
            if (predicate) {
                if (condition === 'and') {
                    predicate = predicate.and(pred);
                } else if (condition === 'or') {
                    predicate = predicate.or(pred);
                }
            } else {
                predicate = pred;
            }
        }
        return predicate;
    }
    private arrayPredicate(ruleColl: RuleModel, predicate?: Predicate, condition?: string): Predicate {
        const value: number[] | string[] = ruleColl.value as number[] | string[]; const operator: string = ruleColl.operator.toString();
        const nullValue: number = ruleColl.value as number;
        let pred: Predicate; const column: ColumnsModel = this.getColumn(ruleColl.field);
        const format: DateFormatOptions = this.getFormat(column.format);
        if (operator.indexOf('null') > -1 || operator.indexOf('empty') > -1) {
            switch (operator) {
            case 'isnull':
                pred = new Predicate(ruleColl.field, 'isnull', nullValue);
                break;
            case 'isnotnull':
                pred = new Predicate(ruleColl.field, 'isnotnull', nullValue);
                break;
            case 'isempty':
                pred = new Predicate(ruleColl.field, 'equal', '');
                break;
            case 'isnotempty':
                pred = new Predicate(ruleColl.field, 'notequal', '');
                break;
            }
        }
        if (!(operator.indexOf('null') > -1 || operator.indexOf('empty') > -1)) {
            for (let j: number = 0, jLen: number = value.length; j < jLen; j++) {
                if (value[j as number] !== '' || ((operator === 'in' || operator === 'notin') && column.type === 'string')) {
                    if (j === 0) {
                        const gte: string = 'greaterthanorequal';
                        switch (operator) {
                        case 'between':
                            if (column.type !== 'date') {
                                pred = new Predicate(ruleColl.field, gte, value[j as number]);
                            } else {
                                pred = new Predicate(ruleColl.field, gte, value[j as number] ?
                                    (this.isTime(value[j as number] as string) ? this.getDate(value[j as number] as string, format) :
                                        this.setTime(this.getDate(value[j as number] as string, format), true)) : null);
                            }
                            break;
                        case 'notbetween':
                            if (column.type === 'date') {
                                pred = new Predicate(ruleColl.field, 'lessthan', value[j as number] ?
                                    (this.isTime(value[j as number] as string) ? this.getDate(value[j as number] as string, format) :
                                        this.setTime(this.getDate(value[j as number] as string, format), true)) : null);
                            } else {
                                pred = new Predicate(ruleColl.field, 'lessthan', value[j as number]);
                            }
                            break;
                        case 'in':
                            pred = new Predicate(ruleColl.field, 'equal', value[j as number]);
                            break;
                        case 'notin':
                            pred = new Predicate(ruleColl.field, 'notequal', value[j as number]);
                            break;
                        }
                    } else {
                        const gt: string = 'greaterthan';
                        switch (ruleColl.operator) {
                        case 'between':
                            if (column.type === 'date') {
                                pred = pred.and(ruleColl.field, 'lessthanorequal', value[j as number] ?
                                    (this.isTime(value[j as number] as string) ? this.getDate(value[j as number] as string, format) :
                                        this.setTime(this.getDate(value[j as number] as string, format))) : value[j as number]);
                            } else {
                                pred = pred.and(ruleColl.field, 'lessthanorequal', value[j as number]);
                            }
                            break;
                        case 'notbetween':
                            if (column.type === 'date') {
                                pred = pred.or(ruleColl.field, gt, value[j as number] ?
                                    (this.isTime(value[j as number] as string) ? this.getDate(value[j as number] as string, format) :
                                        this.setTime(this.getDate(value[j as number] as string, format))) : value[j as number]);
                            } else {
                                pred = pred.or(ruleColl.field, 'greaterthan', value[j as number]);
                            }
                            break;
                        case 'in':
                            pred = pred.or(ruleColl.field, 'equal', value[j as number]);
                            break;
                        case 'notin':
                            pred = pred.and(ruleColl.field, 'notequal', value[j as number]);
                            break;
                        }
                    }
                }
            }
        }
        if (pred) {
            if (predicate) {
                if (condition === 'and') {
                    predicate = predicate.and(pred);
                } else if (condition === 'or') {
                    predicate = predicate.or(pred);
                }
            } else {
                predicate = pred;
            }
        }
        return predicate;
    }
    private getDate(value: string, format: DateFormatOptions): Date {
        let currDate: Date = this.intl.parseDate(value as string, format);
        if ((value as string).indexOf(':') > -1 && ((value as string).indexOf('/') < 0 && (value as string).indexOf(',') < 0
        && (value as string).indexOf('-') < 0)) {
            currDate = new Date();
            // eslint-disable-next-line
            currDate.setHours(parseInt((value as string).split(':')[0]));
            // eslint-disable-next-line
            currDate.setMinutes(parseInt((value as string).split(':')[1]));
            if ((value as string).split(':')[2]) {
                // eslint-disable-next-line
                currDate.setSeconds(parseInt((value as string).split(':')[2]));
            }
        }
        return currDate;
    }
    private isTime(value: string): boolean {
        if (value && value.indexOf(':') > -1) {
            return true;
        }
        return false;
    }

    private importRules(rule: RuleModel, parentElem?: Element, isReset?: boolean, not?: boolean, isRoot?: boolean): Element {
        if (!isReset) {
            parentElem = this.renderGroup(rule, rule.condition, parentElem, not);
        } else {
            if (rule.rules.length > 1 && !this.headerTemplate) {
                // enable/disable conditions when rule group is added
                const orElem: HTMLInputElement = parentElem.querySelector('.e-btngroup-or');
                const andElem: HTMLInputElement = parentElem.querySelector('.e-btngroup-and');
                orElem.disabled = false;
                andElem.disabled = false;
                if (rule.condition === 'or') {
                    orElem.checked = true;
                } else {
                    andElem.checked = true;
                }
            } else {
                // enable/disable conditions when rule condition is added
                this.disableRuleCondition(parentElem);
            }
            if (this.headerTemplate && isRoot) {
                parentElem = this.renderGroup(rule, rule.condition, this.element, rule.not, isRoot);
            }
            if (this.enableNotCondition && !this.headerTemplate) {
                const tglBtnElem: Element = parentElem.querySelector('.e-qb-toggle');
                if (rule.not) {
                    addClass([tglBtnElem], 'e-active-toggle');
                } else {
                    removeClass([tglBtnElem], 'e-active-toggle');
                }
            }
        }
        if (rule.rules.length === 0 && this.headerTemplate) {
            rule.rules[0] = { 'label': '', 'field': '', 'operator': '', 'type': '', 'value': ''};
        }
        const ruleColl: RuleModel[] = rule.rules;
        if (!isNullOrUndefined(ruleColl)) {
            for (let i: number = 0, len: number = ruleColl.length; i < len; i++) {
                const keys: string[] = Object.keys(ruleColl[i as number]);
                if (!isNullOrUndefined(ruleColl[i as number].rules) && keys.indexOf('rules') > -1 && (ruleColl[i as number].rules.length !== 0)) {
                    parentElem = this.renderGroup(ruleColl[i as number], ruleColl[i as number].condition, parentElem,
                                                  ruleColl[i as number].not);
                    parentElem = this.importRules(ruleColl[i as number], parentElem, true);
                } else {
                    this.renderRule(ruleColl[i as number], parentElem);
                }
            }
        }
        parentElem = closest(parentElem, '.e-rule-list');
        if (parentElem) {
            parentElem = closest(parentElem, '.e-group-container');
        }
        return parentElem;
    }
    private renderGroup(rule: RuleModel, condition: string, parentElem?: Element, not?: boolean, isRoot?: boolean): Element {
        this.addGroupElement(true, parentElem, condition, false, not, isRoot, rule); //Child group
        const element: NodeListOf<Element> = parentElem.querySelectorAll('.e-group-container');
        return element[element.length - 1];
    }
    private renderRule(rule: RuleModel, parentElem?: Element): void {
        if (parentElem.className.indexOf('e-group-container') > -1) {
            this.addRuleElement(parentElem, rule); //Create rule
        } else {
            this.addRuleElement(parentElem.querySelector('.e-group-container'), rule); //Create group
        }
    }
    private enableReadonly(): void {
        const target: Element = this.element;
        const elem: NodeListOf<Element> =
        target.querySelectorAll('.e-dropdownlist, .e-numerictextbox, .e-textbox, .e-datepicker, .e-multiselect .e-lib, .e-radio');
        for (let i: number = 0; i < elem.length; i++ ) {
            if (elem[i as number].classList.contains('e-dropdownlist')) {
                const dropDownObj: DropDownList = getInstance(elem[i as number] as HTMLElement, DropDownList) as DropDownList;
                dropDownObj.readonly = this.isReadonly;
            } else if (elem[i as number].classList.contains('e-numerictextbox')) {
                const numericTextBoxObj: NumericTextBox = getInstance(elem[i as number] as HTMLElement, NumericTextBox) as NumericTextBox;
                numericTextBoxObj.readonly = this.isReadonly;
            } else if (elem[i as number].classList.contains('e-textbox')) {
                const textBoxObj: TextBox = getInstance(elem[i as number] as HTMLElement, TextBox) as TextBox;
                textBoxObj.readonly = this.isReadonly;
            } else if (elem[i as number].classList.contains('e-datepicker')) {
                const datePickerObj: DatePicker = getInstance(elem[i as number] as HTMLElement, DatePicker) as DatePicker;
                datePickerObj.readonly = this.isReadonly;
            } else if (elem[i as number].classList.contains('e-multiselect')) {
                const multiSelectObj: MultiSelect = getInstance(elem[i as number] as HTMLElement, MultiSelect) as MultiSelect;
                multiSelectObj.readonly = this.isReadonly;
            } else if (elem[i as number].classList.contains('e-radio')) {
                const radioButtonObj: RadioButton = getInstance(elem[i as number] as HTMLElement, RadioButton) as RadioButton;
                if (!radioButtonObj.checked) {
                    if (this.isReadonly) {
                        elem[i as number].parentElement.style.display = 'none';
                    } else {
                        elem[i as number].parentElement.style.display = 'inherit';
                    }
                }
            }
        }
        const deleteGroupElems: NodeListOf<Element> = this.element.querySelectorAll('.e-deletegroup');
        const addRuleGroupElems: NodeListOf<Element> = this.element.querySelectorAll('.e-addrulegroup');
        const removeRuleElems: NodeListOf<Element> = this.element.querySelectorAll('.e-removerule');
        if (!this.isReadonly && this.ruleElem.classList.contains('e-readonly')) {
            this.ruleElem.classList.remove('e-readonly');
        }
        const elems: NodeListOf<Element>[] = [deleteGroupElems, addRuleGroupElems, removeRuleElems];
        for (let i: number = 0; i < elems.length; i++) {
            elems[i as number].forEach((elem: Element) => {
                if (elem.classList.contains('e-readonly')) {
                    elem.classList.remove('e-readonly');
                } else {
                    elem.classList.add('e-readonly');
                }
            });
        }
        this.enableBtnGroup();
    }
    private enableBtnGroup(): void {
        const elems: NodeListOf<Element> = this.element.querySelectorAll('.e-btngroup-and-lbl, .e-btngroup-or-lbl, .e-qb-toggle');
        let not: boolean = false;
        elems.forEach((elem: Element) => {
            if (elem.classList.contains('e-qb-toggle') && !elem.classList.contains('e-active-toggle')
            && !elem.classList.contains('e-readonly')) {
                elem.classList.add('e-readonly');
                not = false;
            } else if (elem.classList.contains('e-qb-toggle') && elem.classList.contains('e-not-readonly')) {
                elem.classList.remove('e-not-readonly');
            } else if (elem.classList.contains('e-qb-toggle') && elem.classList.contains('e-readonly')) {
                elem.classList.remove('e-readonly');
            } else if (elem.classList.contains('e-active-toggle')) {
                elem.classList.add('e-not-readonly');
                not = true;
            } else if ((elem.previousElementSibling as HTMLInputElement).checked || elem.classList.contains('e-readonly')) {
                elem.classList.remove('e-readonly');
                if (not) {
                    if (elem.textContent === 'AND') {
                        elem.classList.add('e-readonly-and');
                    } else {
                        elem.classList.add('e-readonly-or');
                    }
                } else {
                    if (elem.textContent === 'AND' && this.isReadonly) {
                        elem.classList.remove('e-not');
                        elem.classList.add('e-readonly-and');
                    } else {
                        if (this.enableNotCondition) { elem.classList.add('e-not'); }
                        elem.classList.remove('e-readonly-and');
                    }
                    if (elem.textContent === 'OR' && this.isReadonly) {
                        elem.classList.add('e-readonly-or-not');
                    } else {
                        elem.classList.remove('e-readonly-or-not');
                    }
                }
            } else if (elem.classList.contains('e-btn-disable')) {
                // do nothing
            } else {
                elem.classList.add('e-readonly');
            }
        });
    }
    private isDateFunction(value: string): boolean {
        const dateFunc: string [] =
        ['date', 'time', 'day', 'week', 'month', 'year', 'hour', 'minute', 'second', 'now', 'quarter', 'period', 'extract'];
        for (let i: number = 0, len: number = dateFunc.length; i < len; i++) {
            if (value.toLowerCase().indexOf(dateFunc[i as number]) > -1) {
                return true;
            }
        }
        return false;
    }
    private getSqlString(rules: RuleModel, enableEscape?: boolean, queryStr?: string, sqlLocale?: boolean): string {
        let isRoot: boolean = false;
        if (!queryStr && queryStr !== '') {
            queryStr = '';
            isRoot = true;
        } else {
            queryStr += '(';
        }
        let condition: string = rules.condition;
        if (rules.not) {
            let rulesNotCondition: string;
            if (isRoot) {
                rulesNotCondition = sqlLocale ? this.l10n.getConstant('NOT').toUpperCase() + ' (' : 'NOT (';
                queryStr += rulesNotCondition;
            } else {
                rulesNotCondition = sqlLocale ? ' ' + this.l10n.getConstant('NOT').toUpperCase() + ' (' : ' NOT (';
                queryStr += rulesNotCondition;
            }
        }
        if (rules.rules) {
            for (let j: number = 0, jLen: number = rules.rules.length; j < jLen; j++) {
                if (rules.rules[j as number].rules) {
                    queryStr = this.getSqlString(rules.rules[j as number], enableEscape, queryStr, sqlLocale);
                } else {
                    const rule: RuleModel = rules.rules[j as number]; let valueStr: string = '';
                    const ruleOpertor: string = sqlLocale ? this.sqlOperators[rule.operator] : this.operators[rule.operator];
                    if (rule.value instanceof Array) {
                        if (rule.operator.toString().indexOf('between') > -1) {
                            const ruleCondition: string = sqlLocale ? ' ' + this.l10n.getConstant('AND').toUpperCase() + ' ' : ' ' + 'AND' + ' ';
                            if (rule.type === 'date' && !this.isDateFunction(rule.value[0] as string)) {
                                valueStr += '"' + rule.value[0] + '"' + ruleCondition + '"' + rule.value[1] + '"';
                            } else {
                                valueStr += rule.value[0] + ruleCondition + rule.value[1];
                            }
                        } else {
                            if (typeof rule.value[0] === 'string' && rule.value !== null) {
                                valueStr += '("' + rule.value[0] + '"';
                                for (let k: number = 1, kLen: number = rule.value.length; k < kLen; k++) {
                                    valueStr += ',"' + rule.value[k as number] + '"';
                                }
                                valueStr += ')';
                            } else {
                                valueStr += '(' + rule.value + ')';
                            }
                        }
                    } else {
                        if (rule.operator.toString().indexOf('startswith') > -1) {
                            valueStr += rule.value ? '("' + rule.value + '%")' : '(' + rule.value + ')';
                        } else if (rule.operator.toString().indexOf('endswith') > -1) {
                            valueStr += rule.value ? '("%' + rule.value + '")' : '(' + rule.value + ')';
                        } else if (rule.operator.toString().indexOf('contains') > -1) {
                            valueStr += rule.value ? '("%' + rule.value + '%")' : '(' + rule.value + ')';
                        } else {
                            if (rule.type === 'number' || typeof rule.value === 'boolean' || rule.value === null) {
                                valueStr += rule.value;
                            } else {
                                valueStr += '"' + rule.value + '"';
                            }
                        }
                    }
                    if (rule.operator.toString().indexOf('null') > -1 || (rule.operator.toString().indexOf('empty') > -1)) {
                        if (enableEscape) {
                            rule.field = '`' + rule.field + '`';
                        } else {
                            if (rule.field.indexOf(' ') > -1) {
                                rule.field = '"' + rule.field + '"';
                            }
                        }
                        queryStr += rule.field + ' ' + ruleOpertor;
                    } else {
                        if (enableEscape) {
                            rule.field = '`' + rule.field + '`';
                        } else {
                            if (rule.field.indexOf(' ') > -1) {
                                rule.field = '"' + rule.field + '"';
                            }
                        }
                        queryStr += rule.field + ' ' + ruleOpertor + ' ' + valueStr;
                    }
                    if (rule.condition && rule.condition !== '') {
                        condition = rule.condition;
                    }
                }
                if (j !== jLen - 1) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const rule: any = rules.rules[j as number];
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if (condition === '' || (rule && rule.condition !== '' && rule.custom && (rule.custom as any).isCustom)){
                        condition = rule.condition;
                    }
                    condition = sqlLocale ? this.l10n.getConstant(condition.toUpperCase()).toUpperCase() : condition.toUpperCase();
                    queryStr += ' ' + condition + ' ';
                }
            }
        }
        if (!isRoot) {
            queryStr += ')';
        }
        if (rules.not) {
            queryStr += ')';
        }
        return queryStr;
    }
    /**
     * Sets the rules from the sql query.
     *
     * @param {string} sqlString - 'sql String' to be passed to set the rule.
     * @param {boolean} sqlLocale -  Set `true` if Localization for Sql query.
     * @returns {void}
     */
    public setRulesFromSql(sqlString: string, sqlLocale?: boolean): void {
        sqlString = sqlString.replace(/`/g, '');
        const ruleModel: RuleModel = this.getRulesFromSql(sqlString, sqlLocale);
        this.setRules({ condition: ruleModel.condition, not: ruleModel.not, rules: ruleModel.rules });
    }
    /**
     * Get the rules from SQL query.
     *
     * @param {string} sqlString - 'sql String' to be passed to get the rule.
     * @param {boolean} sqlLocale - Set `true` if Localization for Sql query.
     * @returns {object} - Rules from SQL query
     */
    public getRulesFromSql(sqlString: string, sqlLocale?: boolean): RuleModel {
        this.parser = [];
        this.sqlParser(sqlString, sqlLocale);
        this.rule = { condition: 'and', not: false, rules: [] };
        const rule: RuleModel = this.processParser(this.parser, this.rule, [0], sqlLocale);
        if (this.enableNotCondition) {
            return {condition: rule.condition, not: rule.not, rules: rule.rules};
        } else {
            return {condition: rule.condition, rules: rule.rules};
        }
    }
    /**
     * Gets the sql query from rules.
     *
     * @param {RuleModel} rule - 'rule' to be passed to get the sql.
     * @param {boolean} allowEscape - Set `true` if it exclude the escape character.
     *  @param {boolean} sqlLocale - Set `true` if Localization for Sql query.
     * @returns {object} - Sql query from rules.
     */
    public getSqlFromRules(rule?: RuleModel, allowEscape?: boolean, sqlLocale?: boolean): string {
        if (!rule) {
            rule = this.getValidRules();
        }
        rule = this.getRuleCollection(rule, false);
        return this.getSqlString(this.getValidRules(rule), allowEscape, null, sqlLocale).replace(/"/g, '\'');
    }
    private sqlParser(sqlString: string, sqlLocale?: boolean): string[][] {
        let st: number = 0;
        let str: string;
        do {
            str = sqlString.slice(st);
            st += this.parseSqlStrings(str, sqlLocale);
        } while (str !== '');
        return this.parser;
    }
    private parseSqlStrings(sqlString: string, sqlLocale?: boolean): number {
        const operators: string[] = ['=', '!=', '<=', '>=', '<', '>'];
        let conditions: string[];
        if (sqlLocale) {
            conditions = [this.l10n.getConstant('AND').toUpperCase(), this.l10n.getConstant('OR').toUpperCase(), this.l10n.getConstant('NOT').toUpperCase()];
        } else {
            conditions = ['AND', 'OR', 'NOT'];
        }
        let subOp: string[];
        if (sqlLocale) {
            subOp = [this.l10n.getConstant('In').toUpperCase(), this.l10n.getConstant('NotIn').toUpperCase(),
                this.l10n.getConstant('Like').toUpperCase(), this.l10n.getConstant('NotLike').toUpperCase(),
                this.l10n.getConstant('Between').toUpperCase(), this.l10n.getConstant('NotBetween').toUpperCase(),
                this.l10n.getConstant('IsNull').toUpperCase(), this.l10n.getConstant('IsNotNull').toUpperCase(),
                this.l10n.getConstant('IsEmpty').toUpperCase(), this.l10n.getConstant('IsNotEmpty').toUpperCase()];
        } else {
            subOp = ['IN', 'NOT IN', 'LIKE', 'NOT LIKE', 'BETWEEN', 'NOT BETWEEN', 'IS NULL', 'IS NOT NULL', 'IS EMPTY', 'IS NOT EMPTY'];
        }
        let regexStr: string; let regex: RegExp; let matchValue: string;
        for (let i: number = 0, iLen: number = operators.length; i < iLen; i++) {
            regexStr = /^\w+$/.test(operators[i as number]) ? '\\b' : '';
            // eslint-disable-next-line
            regex = new RegExp('^(' + operators[i as number] + ')' + regexStr, 'ig');
            if (regex.exec(sqlString)) {
                this.parser.push(['Operators', operators[i as number].toLowerCase()]);
                return operators[i as number].length;
            }
        }
        const lastPasrser: string[] = this.parser[this.parser.length - 1];
        if (!lastPasrser || (lastPasrser && lastPasrser[0] !== 'Literal')) {
            for (let i: number = 0, iLen: number = conditions.length; i < iLen; i++) {
                regexStr = /^\w+$/.test(conditions[i as number]) ? '\\b' : '';
                // eslint-disable-next-line
                regex = new RegExp('^(' + conditions[i as number] + ')' + regexStr, 'ig');
                if (regex.exec(sqlString)) {
                    this.parser.push(['Conditions', conditions[i as number].toLowerCase()]);
                    return conditions[i as number].length;
                }
            }
        }
        for (let i: number = 0, iLen: number = subOp.length; i < iLen; i++) {
            regexStr = /^\w+$/.test(subOp[i as number]) ? '\\b' : '';
            // eslint-disable-next-line
            regex = new RegExp('^(' + subOp[i as number] + ')' + regexStr, 'ig');
            if (regex.exec(sqlString)) {
                this.parser.push(['SubOperators', subOp[i as number].toLowerCase()]);
                return subOp[i as number].length;
            }
        }
        //Left Parenthesis
        if (/^\(/.exec(sqlString)) {
            this.parser.push(['Left', '(']);
            return 1;
        }
        //Right Parenthesis
        if (/^\)/.exec(sqlString)) {
            this.parser.push(['Right', ')']);
            return 1;
        }
        //Boolean
        if (/^(true|false)/.exec(sqlString)) {
            matchValue = /^(true|false)/.exec(sqlString)[0];
            this.parser.push(['String', matchValue]);
            return matchValue.length;
        }
        //Null
        if (/^null/.exec(sqlString)) {
            matchValue = /^null/.exec(sqlString)[0];
            this.parser.push(['String', null]);
            return matchValue.length;
        }
        // eslint-disable-next-line
        if (/^`?([a-z_][a-z0-9_.\[\]\(\)]{0,}(\:(number|float|string|date|boolean))?)`?/i.exec(sqlString)) {
            // eslint-disable-next-line
            matchValue = /^`?([a-zåäö_][a-z0-9åäö_.\[\]\(\)]{0,}(\:(number|float|string|date|boolean))?)`?/i.exec(sqlString)[1];
            this.parser.push(['Literal', matchValue]);
            return matchValue.length;
        }
        // eslint-disable-next-line
        if (this.checkLiteral() && /^'?([a-z_][a-z0-9 _.\[\]\(\)]{0,}(\:(number|float|string|date|boolean))?)'?/i.exec(sqlString)) {
            // eslint-disable-next-line
            matchValue = /^'?([a-z_][a-z0-9 _.\[\]\(\)]{0,}(\:(number|float|string|date|boolean))?)'?/i.exec(sqlString)[1];
            this.parser.push(['Literal', matchValue]);
            return matchValue.length + 2;
        }
        if (this.checkNumberLiteral(sqlString, sqlLocale)) {
            // eslint-disable-next-line
            matchValue = /^[0-9]+(\.[0-9]+)?/.exec(sqlString)[0];
            this.parser.push(['Literal', matchValue]);
            return matchValue.length;
        }
        //String
        // eslint-disable-next-line
        if (/^'((?:[^\\']+?|\\.|'')*)'(?!')/.exec(sqlString)) {
            // eslint-disable-next-line
            matchValue = /^'((?:[^\\']+?|\\.|'')*)'(?!')/.exec(sqlString)[0];
            if (matchValue[matchValue.length - 2] === '(') {
                let isClosed: boolean = false;
                for (let j: number = matchValue.length; j < sqlString.length; j++) {
                    matchValue += sqlString[j as number];
                    if (sqlString[j as number] === ')') {
                        isClosed = true;
                    }
                    if (isClosed && sqlString[j as number] === '\'') {
                        break;
                    }
                }
            }
            this.parser.push(['String', matchValue]);
            return matchValue.length;
        }
        // Double String
        // eslint-disable-next-line
        if (/^"([^\\"]*(?:\\.[^\\"]*)*)"/.exec(sqlString)) {
            // eslint-disable-next-line
            matchValue = /^"([^\\"]*(?:\\.[^\\"]*)*)"/.exec(sqlString)[0];
            this.parser.push(['DoubleString', matchValue]);
            return matchValue.length;
        }
        //Number
        // eslint-disable-next-line
        if (/^[0-9]+(\.[0-9]+)?/.exec(sqlString)) {
            // eslint-disable-next-line
            matchValue = /^[0-9]+(\.[0-9]+)?/.exec(sqlString)[0];
            this.parser.push(['Number', matchValue]);
            return matchValue.length;
        }
        //Negative Number
        // eslint-disable-next-line
        if (/^-?[0-9]+(\.[0-9]+)?/.exec(sqlString)) {
            // eslint-disable-next-line
            matchValue = /^-?[0-9]+(\.[0-9]+)?/.exec(sqlString)[0];
            this.parser.push(['Number', matchValue]);
            return matchValue.length;
        }
        return 1;
    }
    private checkLiteral(): boolean {
        const lastParser: string[] = this.parser[this.parser.length - 1];
        if (!lastParser) {
            return true;
        } else {
            const secParser: string[] = this.parser[this.parser.length - 2];
            if (lastParser[0] === 'Left' && (secParser && secParser[0] === 'Conditions')) {
                return true;
            }
        }
        return false;
    }
    private checkNumberLiteral(sqlString: string, sqlLocale?: boolean): boolean {
        const lastParser: string[] = this.parser[this.parser.length - 1];
        if (!lastParser) {
            return true;
        } else {
            // eslint-disable-next-line
            if (/^[0-9]+(\.[0-9]+)?/.exec(sqlString)) {
                const secParser: string[] = this.parser[this.parser.length - 2];
                const betweenParser: string[] = this.parser[this.parser.length - 3];
                if (lastParser[0] === 'Left' && (secParser && secParser[0] === 'Conditions')) {
                    return true;
                }
                const betweenOperator: string = sqlLocale ? this.l10n.getConstant('Between').toLowerCase() : 'between';
                if (lastParser[0] === 'Conditions' && (betweenParser && betweenParser[1].indexOf(betweenOperator) < 0)) {
                    return true;
                }
            }
        }
        return false;
    }
    private getOperator(value: string, operator: string, sqlLocale?: boolean): string {
        const operators: object = {
            '=': 'equal', '!=': 'notequal', '<': 'lessthan', '>': 'greaterthan', '<=': 'lessthanorequal',
            '>=': 'greaterthanorequal', 'in': 'in', 'not in': 'notin', 'between': 'between', 'not between': 'notbetween',
            'is empty': 'isempty', 'is null': 'isnull', 'is not null': 'isnotnull', 'is not empty': 'isnotempty'
        };
        if (sqlLocale) {
            const localeOperator: string[] = Object.keys(this.sqlOperators);
            for (let i: number = 0; i < localeOperator.length; i++) {
                if (this.sqlOperators[localeOperator[i as number]] === operator.toUpperCase()) {
                    if (value && value.indexOf('%') === 0 && value[value.length - 1] === '%') {
                        return (localeOperator[i as number] === 'notcontains') ? 'notcontains' : 'contains';
                    } else if (value && value.indexOf('%') !== 0 && value.indexOf('%') === value.length - 1) {
                        return (localeOperator[i as number] === 'notstartswith') ? 'notstartswith' : 'startswith';
                    } else if (value && value.indexOf('%') === 0 && value.indexOf('%') !== value.length - 1) {
                        return (localeOperator[i as number] === 'notendswith') ? 'notendswith' : 'endswith';
                    }
                    return localeOperator[i as number];
                }
            }
            return null;
        }
        if (value) {
            if (value.indexOf('%') === 0 && value[value.length - 1] === '%') {
                return (operator === 'not like') ? 'notcontains' : 'contains';
            } else if (value.indexOf('%') !== 0 && value.indexOf('%') === value.length - 1) {
                return (operator === 'not like') ? 'notstartswith' : 'startswith';
            } else if (value.indexOf('%') === 0 && value.indexOf('%') !== value.length - 1) {
                return (operator === 'not like') ? 'notendswith' : 'endswith';
            }
        } else {
            if (operator === 'not like') {
                return 'notequal';
            } else if (operator === 'like') {
                return 'equal';
            }
        }
        return operators[`${operator}`];
    }

    private getTypeFromColumn(rules: RuleModel): string {
        const columnData: ColumnsModel = this.getColumn(rules.field);
        if (!isNullOrUndefined(columnData)) {
            return columnData.type;
        }
        return null;
    }

    private getLabelFromColumn(field: string): string {
        let label: string = ''; let l: number = 0;
        if (this.separator !== '') {
            const fieldColl: string[] = field.split(this.separator);
            for (let i: number = 0; i < fieldColl.length; i++) {
                label += this.getLabelFromField(fieldColl, i + 1);
                l++;
                if (l < fieldColl.length) {
                    label += this.separator;
                }
            }
            return label;
        }
        else{
            const labelItem: string = this.getColumn(field).label;
            return labelItem;
        }
    }
    private getLabelFromField(field: string[], startIdx: number): string {
        let fieldName: string = ''; let j: number = 0;
        for (let k: number = 0; k < startIdx; k++) {
            fieldName += field[k as number];
            j++;
            if (j < startIdx) {
                fieldName += this.separator;
            }
        }
        return this.getColumn(fieldName).label;
    }

    private processParser(parser: string[][], rules: RuleModel, levelColl: number[], sqlLocale?: boolean): RuleModel {
        let j: number; let jLen: number; let rule: RuleModel; let subRules: RuleModel; let numVal: number[] = []; let strVal: string[] = [];
        let k: number; let kLen: number; let l: number; let lLen: number; let grpCount: number;
        let operator: string; let isLeftOpened: boolean = false;
        for (let i: number = 0, iLen: number = parser.length; i < iLen; i++) {
            if (parser[i as number][0] === 'Literal') {
                const column: ColumnsModel = this.getColumn(parser[i as number][1]);
                rule = { label: (column && column.label) ? column.label : parser[i as number][1], field: parser[i as number][1] };
                if (parser[i + 1][0] === 'SubOperators') {
                    if (parser[i + 1][1].indexOf('null') > -1 || parser[i + 1][1].indexOf('empty') > -1) {
                        rule.operator = this.getOperator(' ', parser[i + 1][1], sqlLocale);
                        rule.value = null; rule.type = this.getTypeFromColumn(rule);
                    } else {
                        const oper: string = parser[i + 3][1] ? parser[i + 3][1].replace(/'/g, '') : parser[i + 3][1];
                        rule.operator = this.getOperator(oper, parser[i + 1][1], sqlLocale); }
                    operator = parser[i + 1][1]; i++; j = i + 1; jLen = iLen;
                    if (sqlLocale && rule.operator === 'contains' || rule.operator === 'startswith' || rule.operator === 'endswith') {
                        operator = 'like';
                    } else if (sqlLocale && rule.operator === 'notcontains' || rule.operator === 'notstartswith' || rule.operator === 'notendswith') {
                        operator = 'not like';
                    } else if (sqlLocale) {
                        operator = rule.operator;
                    }
                    for (j = i + 1; j < jLen; j++) {
                        if (operator.indexOf('between') < 0 && parser[j as number][0] === 'Left') {
                            isLeftOpened = true;
                        }
                        else if (parser[j as number][0] === 'Right' && isLeftOpened) {
                            i = j;
                            isLeftOpened = false;
                            break;
                        } else {
                            if (operator.indexOf('null') > -1 || operator.indexOf('empty') > -1) {
                                break;
                            }
                            if (operator.indexOf('like') > -1 && parser[j as number][0] === 'String') {
                                let val: string = parser[j as number][1];
                                if (parser[j as number][1] && parser[j as number][1][0] === '\'') {
                                    val = parser[j as number][1].substring(1, parser[j as number][1].length - 1);
                                }
                                val = val ? val.replace(/%/g, '') : parser[j as number][1];
                                rule.value = val; rule.type = 'string';
                            } else if (operator.indexOf('between') > -1) {
                                if (parser[j as number][0] === 'Literal' || parser[j as number][0] === 'Left') {
                                    break;
                                }
                                if (parser[j as number][0] === 'Number') {
                                    numVal.push(Number(parser[j as number][1]));
                                } else if (parser[j as number][0] === 'String') {
                                    let val: string = parser[j as number][1];
                                    if (parser[j as number][1] && parser[j as number][1][0] === '\'') {
                                        val = parser[j as number][1].substring(1, parser[j as number][1].length - 1);
                                    }
                                    strVal.push(val);
                                }
                            } else {
                                if (parser[j as number][0] === 'Number') {
                                    numVal.push(Number(parser[j as number][1]));
                                } else if (parser[j as number][0] === 'String') {
                                    let val: string = parser[j as number][1];
                                    if (parser[j as number][1] && parser[j as number][1][0] === '\'') {
                                        val = parser[j as number][1].substring(1, parser[j as number][1].length - 1);
                                    }
                                    strVal.push(val);
                                }
                            }
                            rule.type = this.getTypeFromColumn(rule);
                        }
                    }
                    if (operator.indexOf('like') < 0) {
                        if (parser[j - 1][0] === 'Number') {
                            rule.value = numVal; rule.type = 'number';
                        } else if (parser[j - 1][0] === 'String') {
                            rule.value = strVal; rule.type = 'string';
                        } else if (operator.indexOf('between') > -1 && parser[j - 1][0] === 'Conditions') {
                            if (strVal.length !== 0) {
                                rule.value = strVal; rule.type = 'string';
                            } else {
                                rule.value = numVal; rule.type = 'number';
                            }
                        }
                        numVal = []; strVal = []; rule.type = this.getTypeFromColumn(rule);
                    }
                } else if (parser[i + 1][0] === 'Operators') {
                    rule.operator = this.getOperator(parser[i + 2][1], parser[i + 1][1], sqlLocale);
                    if (parser[i + 2][0] === 'Number') {
                        rule.type = 'number'; rule.value = Number(parser[i + 2][1]);
                    } else {
                        rule.type = 'string'; rule.value = parser[i + 2][1] ? parser[i + 2][1].replace(/'/g, '') : parser[i + 2][1];
                    }
                    rule.type = this.getTypeFromColumn(rule);
                }
                rules.rules.push(rule);
            } else if (parser[i as number][0] === 'Left') {
                if (!(parser[0][0] === 'Left') && (parser[i - 1][1] === 'not' || sqlLocale && this.l10n.getConstant('NOT').toLowerCase() === parser[i - 1][1])) { continue; }
                this.parser = parser.splice(i + 1, iLen - (i + 1));
                if (this.enableNotCondition) {
                    subRules = { condition: 'and', rules: [], not: false };
                } else {
                    subRules = { condition: 'and', rules: [] };
                }
                grpCount = 0; kLen = rules.rules.length;
                for (k = 0; k < kLen; k++) {   //To get the group position
                    if (rules.rules[k as number].rules) {
                        grpCount++;
                    }
                }
                levelColl.push(grpCount); rules.rules.push(subRules);
                subRules = this.processParser(this.parser, subRules, levelColl, sqlLocale);
                return rules;
            } else if (parser[i as number][0] === 'Conditions') {
                if (parser[i as number][1] === 'not' || (sqlLocale && this.l10n.getConstant('NOT').toLowerCase() === parser[i as number][1])) {
                    rules.not = true;
                } else {
                    rules.condition = parser[i as number][1];
                }
            } else if (parser[i as number][0] === 'Right') {
                this.parser = parser.splice(i + 1, iLen - (i + 1));
                levelColl.pop();   //To get the parent Group
                rules = this.rule; lLen = levelColl.length;
                for (l = 0; l < lLen; l++) {
                    rules = this.findGroupByIdx(levelColl[l as number], rules, l === 0);
                }
                return this.processParser(this.parser, rules, levelColl, sqlLocale);
            }
        }
        return rules;
    }
}

class LevelColl {
    public groupElement: Element;
    public level: number[];
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
    operators?: { [key: string]: Object }[];
    operatorFields?: Object;
    field?: string;
    operator?: string;
    condition?: string;
    notCondition?: boolean;
    renderTemplate?: boolean;
    groupID?: string;
}
